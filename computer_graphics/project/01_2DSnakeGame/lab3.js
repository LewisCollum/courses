//Lewis Collum
var canvas
var gl

var safeIgnoreKeyDownHandler = {
    get: function(target, name) {
        if (target.hasOwnProperty(name)) {
            console.log(name)
            return target[name]
        }
        return () => {}
    }
}

var currentMillis = 0
const updatePeriod = 100
function onFrameEvent(millis) {
    if (millis > currentMillis + updatePeriod) {
        currentMillis = millis
        gl.clear(gl.COLOR_BUFFER_BIT)
        frameEventDispatcher.dispatchEvent()
    }
    requestAnimFrame(onFrameEvent)
}

function init() {
    canvas = document.getElementById("gl-canvas")
    gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0.4, 1.0, 0.4, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    drawer.setupWithGlAndShaders(gl, shaderProgram)
    drawer.strategy = gl.TRIANGLE_FAN

    const score = document.getElementById("score")
    const scoreText = document.createTextNode("")
    score.appendChild(scoreText)
    frameEventDispatcher.addEventListener(() => {
        scoreText.nodeValue = 0
    })
    
    snake = new Snake()
    snake.setDriftKeyMap(KeyMapWASD)
    drawer.addDrawable(snake)

    onFrameEvent()
}


class Snake {
    constructor() {
        this.points = matrix.dotMatrices([
            radial.make2d(4),
            form.Rotate.z(Math.PI/4),
            form.Scale.all(Math.sqrt(2)*0.04)])
        this.transformation = matrix.Identity(4)
        this.drift = matrix.Identity(4)
        this.driftVelocity = 0.08
        
        frameEventDispatcher.addEventListener(() => {
            this.update()
        })
    }

    setDriftKeyMap(KeyMap) {
        this.driftKeyMap = new KeyMap(this).proxy
        document.addEventListener("keydown", (event) => {
            let key = String.fromCharCode(event.keyCode)
            this.driftKeyMap[key]()
        })
    }
    
    update() {
        this.transformation = matrix.dot(this.transformation, this.drift)
    }    
}

class KeyMapWASD {
    constructor(driftable) {
        this.proxy = new Proxy({
            ['A']: function() {driftable.drift = form.Translate.x(-driftable.driftVelocity)},
            ['D']: function() {driftable.drift = form.Translate.x(driftable.driftVelocity)},
            ['S']: function() {driftable.drift = form.Translate.y(-driftable.driftVelocity)},
            ['W']: function() {driftable.drift = form.Translate.y(driftable.driftVelocity)},
        }, safeIgnoreKeyDownHandler)
    }
}
