//Lewis Collum
var canvas
var gl

class EventDispatcher {
    constructor() {this.handlers = []}
    addHandler(handler) {this.handlers.push(handler)}
    sendEvent(event) {this.handlers.forEach(handler => handler(event))}
}

const clickEventDispatcher = new EventDispatcher()
function onClickEvent(event) {clickEventDispatcher.sendEvent(event)}

const keydownEventDispatcher = new EventDispatcher()
function onKeydownEvent(event) {keydownEventDispatcher.sendEvent(event)}

const rotationToggleButton = new EventDispatcher()
function onRotationToggled() {rotationToggleButton.sendEvent()}

const increaseDriftVelocityButton = new EventDispatcher()
function onIncreaseDriftVelocity() {increaseDriftVelocityButton.sendEvent()}

const decreaseDriftVelocityButton = new EventDispatcher()
function onDecreaseDriftVelocity() {decreaseDriftVelocityButton.sendEvent()}

const frameEventDispatcher = new EventDispatcher()
function onFrameEvent() {
    gl.clear(gl.COLOR_BUFFER_BIT)
    frameEventDispatcher.sendEvent()
    requestAnimFrame(onFrameEvent)
}


function init() {
    canvas = document.getElementById("gl-canvas")
    gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.viewport(0, 0, 512, 512)
    gl.clearColor(1.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    shape = {
        points: Radial.makeFromPointCount(8),
        position: form.Translate.each(0, 0, 0),
        rotation: form.Rotate.noZ(0),
        scale: form.Scale.all(0.1),

        drift: matrix.Identity(4),
        driftVelocity: 0.004,

        spin: matrix.Identity(4),
        angularVelocity: 0.01,
        isRotating: false,

        update: function() {
            shape.position = matrix.dot(shape.position, shape.drift)
            shape.rotation = matrix.dot(shape.rotation, shape.spin)
            
            shape.transformations = [
                shape.position,
                shape.rotation,
                shape.scale]
            this.interpolation = matrix.interpolate(shape.transformations)
        }
    }

    shape.keyToTransformation = {
        [65]: function() {shape.drift = form.Translate.x(-shape.driftVelocity)}, //A
        [68]: function() {shape.drift = form.Translate.x(shape.driftVelocity)}, //D,
        [83]: function() {shape.drift = form.Translate.y(-shape.driftVelocity)}, //S
        [87]: function() {shape.drift = form.Translate.y(shape.driftVelocity)}, //W
        toggleRotation: function() {
            if (!shape.isRotating) {
                shape.spin = form.Rotate.noZ(shape.angularVelocity)
                shape.isRotating = true
            } else {
                shape.spin = form.Rotate.noZ(0)
                shape.isRotating = false
            }
        },
        increaseDriftVelocity: function() {
            shape.driftVelocity += 0.001
        },
        decreaseDriftVelocity: function() {
            shape.driftVelocity -= 0.001
        }        
    }



    clickEventDispatcher.addHandler((event) => {
        shape.position = form.Translate.each(2.0*event.clientX/512 - 1, -2.0*event.clientY/512 + 1, 0)
    })
    
    drawer = new Drawer(shaderProgram)
    drawer.strategy = gl.TRIANGLE_FAN
    drawer.color = [1.0, 1.0, 0.0, 1.0]
    drawer.addDrawable(shape)
    

    keydownEventDispatcher.addHandler((event) => {
        shape.keyToTransformation[event.keyCode]()
    })

    rotationToggleButton.addHandler(() => {
        shape.keyToTransformation.toggleRotation()
    })

    increaseDriftVelocityButton.addHandler(() => {
        shape.keyToTransformation.increaseDriftVelocity()
    })

    decreaseDriftVelocityButton.addHandler(() => {
        shape.keyToTransformation.decreaseDriftVelocity()
    })
    
    frameEventDispatcher.addHandler(() => {
        shape.update()
        drawer.drawAll()
    })

    onFrameEvent()
}


class Drawer {
    constructor(shaderProgram) {
        this.shaderProgram = shaderProgram
        this.color = [0.0, 0.0, 0.0, 1.0]
        this.strategy = gl.TRIANGLE_FAN
        this.drawables = []
    }

    addDrawable(drawable) {this.drawables.push(drawable)}
    
    drawAll() {
        this.drawables.forEach((drawable) => this.drawInterpolated(drawable.points, drawable.interpolation))
    }

    drawInterpolated(points, interpolation) {
        const interpolationPointer = gl.getUniformLocation(this.shaderProgram, "interpolation")
        gl.uniformMatrix4fv(interpolationPointer, false, matrix.transpose(interpolation).flat())
        this.draw(points)
    }

    draw(points) {
        const flattenedDrawer = Float32Array.from(points.flat())
        const pointBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flattenedDrawer, gl.STATIC_DRAW)

        const pointPosition = gl.getAttribLocation(this.shaderProgram, "position")
        gl.vertexAttribPointer(pointPosition, 4, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pointPosition)

        const color = gl.getUniformLocation(this.shaderProgram, "color")
        gl.uniform4f(color, this.color[0], this.color[1], this.color[2], this.color[3])

        const bufferLength = points.length
        gl.drawArrays(this.strategy, 0, bufferLength)
    }
}

class Radial {
    static makeFromPointCount(pointCount) {
        const vectorAngle = 2 * Math.PI / pointCount
        var points = []
        for (let i = 0; i < pointCount; ++i) {
            let x = Math.cos(vectorAngle * i)
            let y = Math.sin(vectorAngle * i)
            points.push([x, y, 0, 1])
        }
        return points
    }
}
