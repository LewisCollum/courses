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
    gl.enable(gl.DEPTH_TEST)

    drawer.setupWithGlAndShaders(gl, shaderProgram)
    drawer.strategy = gl.TRIANGLES
    
    shape = {
        points: radial.make3d(40, 40),
        position: matrix.Identity(4),
        rotation: matrix.Identity(4),
        scale: form.Scale.all(0.8),

        drift: matrix.Identity(4),
        driftVelocity: 0.004,

        spin: matrix.Identity(4),
        angularVelocity: 0.05,

        growth: matrix.Identity(4),
        growthVelocity: 1.01,

        isRotating: false,

        update: function() {
            this.position = matrix.dot(this.position, this.drift)
            this.rotation = matrix.dot(this.rotation, this.spin) //rotate around LOCAL axes
            this.scale = matrix.dot(this.scale, this.growth)
            
            this.transformations = [
                this.position,
                this.rotation,
                this.scale]
            this.interpolation = matrix.dotMatrices(this.transformations)
        }
    }

    shape.keyLog = new Set()
        
    shape.keyUpHandler = {
        get: function(target, name) {
            if (target.hasOwnProperty(name) && shape.keyLog.has(name)) {
                shape.keyLog.delete(name)
                console.log(shape.keyLog)
                return target[name]
            }
            return () => {}
        }
    }
    
    shape.keyUpMap = new Proxy({
        ['A']: function() {shape.drift = matrix.dot(form.Translate.x(shape.driftVelocity), shape.drift)},
        ['D']: function() {shape.drift = matrix.dot(form.Translate.x(-shape.driftVelocity), shape.drift)},
        ['S']: function() {shape.drift = matrix.dot(form.Translate.y(shape.driftVelocity), shape.drift)},
        ['W']: function() {shape.drift = matrix.dot(form.Translate.y(-shape.driftVelocity), shape.drift)},
        ['O']: function() {shape.growth = matrix.dot(form.Scale.x(shape.growthVelocity), shape.growth)},
        ['P']: function() {shape.growth = matrix.dot(form.Scale.x(2-shape.growthVelocity), shape.growth)},
        ['K']: function() {shape.growth = matrix.dot(form.Scale.y(shape.growthVelocity), shape.growth)},
        ['L']: function() {shape.growth = matrix.dot(form.Scale.y(2-shape.growthVelocity), shape.growth)},
        ['X']: function() {shape.spin = matrix.dot(form.Rotate.x(-shape.angularVelocity), shape.spin)},
        ['Y']: function() {shape.spin = matrix.dot(form.Rotate.y(-shape.angularVelocity), shape.spin)},
        ['Z']: function() {shape.spin = matrix.dot(form.Rotate.z(-shape.angularVelocity), shape.spin)}
    }, shape.keyUpHandler)


    shape.keyDownHandler = {
        get: function(target, name) {
            if (target.hasOwnProperty(name) && !shape.keyLog.has(name)) {
                shape.keyLog.add(name)
                console.log(shape.keyLog)
                return target[name]
            }
            return () => {}
        }
    }
    
    shape.keyDownMap = new Proxy({
        ['A']: function() {shape.drift = matrix.dot(form.Translate.x(-shape.driftVelocity), shape.drift)},
        ['D']: function() {shape.drift = matrix.dot(form.Translate.x(shape.driftVelocity), shape.drift)},
        ['S']: function() {shape.drift = matrix.dot(form.Translate.y(-shape.driftVelocity), shape.drift)},
        ['W']: function() {shape.drift = matrix.dot(form.Translate.y(shape.driftVelocity), shape.drift)},
        ['O']: function() {shape.growth = matrix.dot(form.Scale.x(2 - shape.growthVelocity), shape.growth)},
        ['P']: function() {shape.growth = matrix.dot(form.Scale.x(shape.growthVelocity), shape.growth)},
        ['K']: function() {shape.growth = matrix.dot(form.Scale.y(2 - shape.growthVelocity), shape.growth)},
        ['L']: function() {shape.growth = matrix.dot(form.Scale.y(shape.growthVelocity), shape.growth)},
        ['X']: function() {shape.spin = matrix.dot(form.Rotate.x(shape.angularVelocity), shape.spin)},
        ['Y']: function() {shape.spin = matrix.dot(form.Rotate.y(shape.angularVelocity), shape.spin)},
        ['Z']: function() {shape.spin = matrix.dot(form.Rotate.z(shape.angularVelocity), shape.spin)}
    }, shape.keyDownHandler)
    
    shape.toggleRotation = function() {
        if (!shape.isRotating) {
            shape.spin = form.Rotate.z(shape.angularVelocity)
            shape.isRotating = true
        } else {
            shape.spin = form.Rotate.z(0)
            shape.isRotating = false
        }
    }

    shape.increaseDriftVelocity = function() {shape.driftVelocity += 0.001}
    shape.decreaseDriftVelocity = function() {shape.driftVelocity -= 0.001}

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
        shape.keyDownMap[key]()
    })

    document.addEventListener("keyup", (event) => {
        let key = String.fromCharCode(event.keyCode)
        shape.keyUpMap[key]()
    })


    frameEventDispatcher.addEventListener(() => {
        shape.update()
        drawer.drawAll()
    })

    drawer.addDrawable(shape)
    onFrameEvent()
}
