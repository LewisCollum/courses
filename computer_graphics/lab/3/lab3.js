//Lewis Collum
var canvas
var gl

class EventDispatcher {
    constructor() {this.handlers = []}
    addEventListener(listeningFunction) {this.handlers.push(listeningFunction)}
    dispatchEvent(event) {this.handlers.forEach(handler => handler(event))}
}

const frameEventDispatcher = new EventDispatcher()
function onFrameEvent() {
    gl.clear(gl.COLOR_BUFFER_BIT)
    frameEventDispatcher.dispatchEvent()
    requestAnimFrame(onFrameEvent)
}

function init() {
    canvas = document.getElementById("gl-canvas")
    gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    drawer.setupWithGlAndShaders(gl, shaderProgram)
    drawer.strategy = gl.LINE_STRIP
    drawer.color = [1.0, 1.0, 0.0, 1.0]

    
    shape = {
        points: radial.make3d(30, 10),
        position: form.Translate.each(0, 0, 0),
        rotation: form.Rotate.noZ(0),
        scale: form.Scale.all(0.8),

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

    shape.keyMap = {
        ['A']: function() {shape.drift = form.Translate.x(-shape.driftVelocity)},
        ['D']: function() {shape.drift = form.Translate.x(shape.driftVelocity)},
        ['S']: function() {shape.drift = form.Translate.y(-shape.driftVelocity)},
        ['W']: function() {shape.drift = form.Translate.y(shape.driftVelocity)},
        ['X']: function() {shape.rotation = matrix.dot(form.Rotate.x(0.1), shape.rotation)},
        ['Y']: function() {shape.rotation = matrix.dot(form.Rotate.y(0.1), shape.rotation)},
        ['Z']: function() {shape.rotation = matrix.dot(form.Rotate.z(0.1), shape.rotation)}
    }
    
    shape.toggleRotation = function() {
        if (!shape.isRotating) {
            shape.spin = form.Rotate.noZ(shape.angularVelocity)
            shape.isRotating = true
        } else {
            shape.spin = form.Rotate.noZ(0)
            shape.isRotating = false
        }
    }

    shape.increaseDriftVelocity = function() {
        shape.driftVelocity += 0.001
    }
    
    shape.decreaseDriftVelocity = function() {
        shape.driftVelocity -= 0.001
    }


    canvas.addEventListener("click", () => {
        shape.position = form.Translate.each(2.0*event.clientX/512 - 1, -2.0*event.clientY/512 + 1, 0)
    })

    document.getElementById("rotationToggleButton").addEventListener(
       "click",
        shape.toggleRotation)
    
    document.getElementById("increaseDriftVelocity").addEventListener(
        "click",
        shape.increaseDriftVelocity)

    document.getElementById("decreaseDriftVelocity").addEventListener(
        "click",
        shape.decreaseDriftVelocity)

    document.addEventListener("keydown", (event) => {
        let key = String.fromCharCode(event.keyCode)
        if (shape.keyMap.hasOwnProperty(key))
            shape.keyMap[key]()
    })

    frameEventDispatcher.addEventListener(() => {
        shape.update()
        drawer.drawAll()
    })

    drawer.addDrawable(shape)
    onFrameEvent()
}
