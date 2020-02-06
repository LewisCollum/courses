//Lewis Collum
var canvas
var gl
var shaderProgram

function init() {
    canvas = document.getElementById("gl-canvas")
    gl = WebGLUtils.setupWebGL(canvas)

    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)

    //TODO Encapsulate construction of radial shapes (in Factory or Builder)
    const rectangle = {}
    rectangle.base = Radial.makeFromCount(4)
    rectangle.translator = new Translator(rectangle.base)
    rectangle.scaler = Scaler.makeWithTranslator(rectangle.base, rectangle.translator)
    rectangle.drawer = new Drawer(rectangle.base)

    rectangle.translator.translate(0.66, 0.0)
    rectangle.scaler.scaleAll(0.25)
    rectangle.drawer.strategy = gl.LINE_LOOP
    rectangle.drawer.color = [1.0, 0.0, 0.0, 1.0]
    rectangle.drawer.draw()

    
    const septagon = {}
    septagon.base = Radial.makeFromCount(7)
    septagon.translator = new Translator(septagon.base)
    septagon.scaler = Scaler.makeWithTranslator(septagon.base, septagon.translator)
    septagon.drawer = new Drawer(septagon.base)

    septagon.translator.translate(-0.66, 0.0)
    septagon.scaler.scaleAll(0.25)
    septagon.drawer.strategy = gl.LINE_LOOP
    septagon.drawer.color = [0.0, 1.0, 0.0, 1.0]
    septagon.drawer.draw()

    
    const ellipse = {}
    ellipse.base = Radial.makeFromCount(50)
    ellipse.translator = new Translator(ellipse.base)
    ellipse.scaler = Scaler.makeWithTranslator(ellipse.base, ellipse.translator)
    ellipse.drawer = new Drawer(ellipse.base)

    ellipse.scaler.scale(0.2, 0.4)
    ellipse.drawer.strategy = gl.TRIANGLE_FAN
    ellipse.drawer.color = [0.0, 0.0, 1.0, 1.0]
    ellipse.drawer.draw()
}


class Translator {
    constructor(translatable) {
        this.translatable = translatable
    }

    translate(x, y) {
        this.translatable.origin.x += x
        this.translatable.origin.y += y
        this.translatable.points.forEach(vector => {
            vector[0] += x
            vector[1] += y
        })
    }
}


class Scaler {
    static makeWithTranslator(scalable, translator) {
        return new Scaler(scalable, translator)
    }
    
    constructor(scalable, translator) {
        this.scalable = scalable
        this.translator = translator
    }

    onTranslatedToCenter(f) {
        const {x: offsetX, y: offsetY} = this.scalable.origin

        this.translator.translate(-offsetX, -offsetY)
        f()
        this.translator.translate(offsetX, offsetY)
    }

    scale(x, y) {
        this.onTranslatedToCenter(() => {
            this.scalable.points.forEach(vector => {
                vector[0] = x * vector[0]
                vector[1] = y * vector[1]
            })
        })
    }

    scaleAll(magnitude) {
        this.onTranslatedToCenter(() => {
            this.scalable.points.forEach(vector => {
                vector[0] = magnitude * vector[0]
                vector[1] = magnitude * vector[1]
            })
        })
    }
    
    scaleX(x) {
        this.onTranslatedToCenter(() => {
            this.scalable.points.forEach(vector => {
                vector[0] = x * vector[0]
            })
        })
    }

    scaleY(y) {
        this.onTranslatedToCenter(() => {
            this.scalable.points.forEach(vector => {
                vector[1] = y * vector[1]
            })
        })
    }        
}


class Drawer {
    constructor(drawable) {
        this.drawable = drawable
        this.color = [0.0, 0.0, 0.0, 1.0]
        this.strategy = gl.TRIANGLE_FAN
    }

    draw() {
        const flattenedDrawer = flatten(this.drawable.points)
        const pointBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flattenedDrawer, gl.STATIC_DRAW)

        const pointPosition = gl.getAttribLocation(shaderProgram, "position")
        gl.vertexAttribPointer(pointPosition, 4, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pointPosition)

        const color = gl.getUniformLocation(shaderProgram, "color")
        gl.uniform4f(color, this.color[0], this.color[1], this.color[2], this.color[3])

        const bufferLength = this.drawable.points.length
        gl.drawArrays(this.strategy, 0, bufferLength)
    }
}

class Radial {
    static makeFromCount(pointCount) {
        return new Radial(pointCount)
    }

    constructor(pointCount) {
        this.origin = {x: 0, y: 0}
        this.pointCount = pointCount
        this.vectorAngle = 2 * Math.PI / this.pointCount
        this.points = []
        for (let i = 0.0; i < this.pointCount; ++i) {
            let x = Math.cos(this.vectorAngle * i)
            let y = Math.sin(this.vectorAngle * i)
            this.points.push(vec4(x, y, 0.0, 1.0))
        }
    }
}
