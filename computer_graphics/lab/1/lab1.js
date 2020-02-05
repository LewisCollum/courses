//Lewis Collum

function init() {
    const canvas = document.getElementById("gl-canvas")
    const gl = WebGLUtils.setupWebGL(canvas)

    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0.0, 0.5, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    
    gl.useProgram(shaderProgram)

    const rectangleLimits = {
        x: {first: 1, second: 2},
        y: {first: 3, second: 4}}

    const rectangleOrigin = {x: -1, y:-1}
    
    const rectangle = new Rectangle(rectangleLimits, rectangleOrigin)
    rectangle.draw()
}

class Rectangle {
    constructor(limits, origin) {
        this.limits = limits
        this.origin = origin
    }

    draw() {
        console.log(this.limits.x.first)
    }
}
