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

    
    const rectangle = {}
    rectangle.branch = Branch.makeFromOriginAndRadius({x: 0.66, y: 0.0}, 0.25)
    rectangle.base = Radial.makeFromBranchWithCount(rectangle.branch, 4)
    rectangle.drawer = new Drawer(rectangle.base)

    rectangle.drawer.strategy = gl.LINE_LOOP
    rectangle.drawer.color = [1.0, 0.0, 0.0, 1.0]
    rectangle.drawer.draw()

    
    const septagon = {}
    septagon.branch = Branch.makeFromOriginAndRadius({x: -0.66, y: 0.0}, 0.25)
    septagon.base = Radial.makeFromBranchWithCount(septagon.branch, 7)
    septagon.drawer = new Drawer(septagon.base)

    septagon.drawer.strategy = gl.LINE_LOOP
    septagon.drawer.color = [0.0, 1.0, 0.0, 1.0]
    septagon.drawer.draw()

    
    const ellipse = {}
    ellipse.branch = Branch.makeFromOriginAndRadius({x: 0.0, y: 0.0}, 0.5)
    ellipse.base = Radial.makeFromBranchWithCount(ellipse.branch, 50)
    ellipse.drawer = new Drawer(ellipse.base)
    ellipse.translator = new Translator(ellipse.base)
    ellipse.scaler = Scaler.makeWithTranslator(ellipse.base, ellipse.translator)

    ellipse.scaler.scaleX(0.5)
    ellipse.drawer.strategy = gl.TRIANGLE_FAN
    ellipse.drawer.color = [0.0, 0.0, 1.0, 1.0]
    ellipse.drawer.draw()
}


class Translator {
    constructor(translatable) {
        this.translatable = translatable
    }

    translate(x, y) {
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

    scale(x, y) {
        this.translator.translate(-this.scalable.origin.x, -this.scalable.origin.y)
        this.scalable.points.forEach(vector => {
            vector[0] = x * vector[0]
            vector[1] = y * vector[1]
        })
        this.translator.translate(this.scalable.origin.x, this.scalable.origin.y)    
    }

    scaleX(x) {
        this.translator.translate(-this.scalable.origin.x, -this.scalable.origin.y)
        this.scalable.points.forEach(vector => {
            vector[0] = x * vector[0]
        })
        this.translator.translate(this.scalable.origin.x, this.scalable.origin.y)    
    }

    scaleY(y) {
        this.translator.translate(-this.scalable.origin.x, -this.scalable.origin.y)
        this.scalable.points.forEach(vector => {
            vector[1] = y * vector[1]
        })
        this.translator.translate(this.scalable.origin.x, this.scalable.origin.y)    
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

        const bufferLength = this.drawable.length
        gl.drawArrays(this.strategy, 0, bufferLength)
    }
}


class Branch {
    static makeFromOriginAndRadius(origin, radius) {
        return new Branch(origin, radius)
    }
    
    constructor(origin, radius) {
        this.origin = origin
        this.radius = radius
    }
}


class Radial {
    static makeFromBranchWithCount(branch, branchCount) {
        return new Radial(branch, branchCount)
    }

    constructor(branch, branchCount) {
        this.branch = branch
        this.branchCount = branchCount
        this.branchAngle = 2 * Math.PI / branchCount
        this.points = []
        for (let i = 0.0; i < this.branchCount; ++i) {
            let x = this.branch.radius * Math.cos(this.branchAngle * i) + this.branch.origin.x
            let y = this.branch.radius * Math.sin(this.branchAngle * i) + this.branch.origin.y
            this.points.push(vec4(x, y, 0.0, 1.0))
        }
    }

    get origin() { return this.branch.origin }
    get length() { return this.points.length }    
}
