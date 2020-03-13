//Lewis Collum
var canvas
var gl

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

    var grid = new Grid(15)
    var apple = new Apple(grid)
    var snake = new Snake(grid)

    frameEventDispatcher.addEventListener(() => {
        scoreText.nodeValue = snake.body.length

        if (squareIntersection(snake.body[0].coordinates, apple.coordinates)) {
            apple.eat()
            snake.feed()
            updatePeriod -= 2
        } 
        else if (snake.isOverEdge() || snake.isOverlapping()) {
            window.alert(`Score: ${scoreText.nodeValue}`)
            window.location.reload(false)
        } 
    })
    
    onFrameEvent()
}

var currentMillis = 0
var updatePeriod = 100
function onFrameEvent(millis) {
    if (millis > currentMillis + updatePeriod) {
        currentMillis = millis
        gl.clear(gl.COLOR_BUFFER_BIT)
        frameEventDispatcher.dispatchEvent()
    }
    requestAnimFrame(onFrameEvent)
}

class Snake {
    constructor(grid) {
        this.grid = grid
        this.points = makeSquareOfSize(this.grid.spacing)

        this.drift = matrix.Identity(4)
        this.driftVelocity = this.grid.spacing

        this.body = [{
            points: this.points,
            transformation: matrix.Identity(4),
            color: [0.6, 0.3, 0.0, 1],
            coordinates: [Math.floor(this.grid.count/2), Math.floor(this.grid.count/2)]
        }]
        drawer.addDrawable(this.body[0])  

        frameEventDispatcher.addEventListener(() => this.update())
        
        this.setMovementKeyMap()
    }

    update() {        
        this.body[this.body.length-1].transformation = matrix.dot(this.body[0].transformation, this.drift)
        this.body.unshift(this.body.pop())

        this.body[0].coordinates[0] = Math.floor((this.body[0].transformation[0][3]+1)*this.grid.count/2)
        this.body[0].coordinates[1] = Math.floor((this.body[0].transformation[1][3]+1)*this.grid.count/2)
    }    
    
    moveUp() {this.drift = form.Translate.y(this.driftVelocity)}
    moveDown() {this.drift = form.Translate.y(-this.driftVelocity)}
    moveRight() {this.drift = form.Translate.x(this.driftVelocity)}
    moveLeft() {this.drift = form.Translate.x(-this.driftVelocity)}
    stop() {this.drift = matrix.Identity(4)}

    isOverlapping() {
        var overlapping = false
        this.body.forEach((segment, index) => {
            if (index != 0 && squareIntersection(this.body[0].coordinates, segment.coordinates)) 
                overlapping = true
        })
        return overlapping
    }

    isOverEdge() {
        return this.body[0].coordinates[0] >= this.grid.count ||
            this.body[0].coordinates[0] < 0 ||
            this.body[0].coordinates[1] >= this.grid.count ||
            this.body[0].coordinates[1] < 0
    }

    feed() {
        this.body.push({
            points: this.points,
            transformation: this.body[this.body.length-1].transformation,
            color: [0.6, 0.3, 0.0, 1],
            coordinates: [null, null]
        })

        drawer.addDrawable(this.body[this.body.length-1])            
    }
    
    setMovementKeyMap() {
        this.movementKeyMap = new Proxy({
            ['A']: () => this.moveLeft(),
            ['D']: () => this.moveRight(),
            ['S']: () => this.moveDown(),
            ['W']: () => this.moveUp()
        }, safeIgnoreKeyDownHandler)
        
        document.addEventListener("keydown", (event) => {
            let key = String.fromCharCode(event.keyCode)
            this.movementKeyMap[key]()
        })
    }
}

function makeSquareOfSize(size) {
    return matrix.dotMatrices([
        radial.make2d(4),
        form.Rotate.z(Math.PI/4),
        form.Scale.all(Math.sqrt(2)*size/2)])
}

var safeIgnoreKeyDownHandler = {
    get: function(target, name) {
        if (target.hasOwnProperty(name)) {
            return target[name]
        }
        return () => {}
    }
}

class Grid {
    constructor(count) {
        this.count = count
        this.spacing = 2/count
    }

    randomCoordinates() {
        return [Math.floor(Math.random()*this.count), Math.floor(Math.random()*this.count)]        
    }

    gridToFrameCoordinates(coordinates) {
        return [coordinates[0]*this.spacing-1, coordinates[1]*this.spacing-1]        
    }
}

class Apple {
    constructor(grid) {
        this.grid = grid
        this.points = makeSquareOfSize(this.grid.spacing)
        this.color = [1.0, 0.0, 0.0, 1.0]
        
        this.eat()
        drawer.addDrawable(this)
    }
    
    eat() {
        this.coordinates = this.grid.randomCoordinates()
        const translation = this.grid.gridToFrameCoordinates(this.coordinates)
        this.transformation = form.Translate.each(translation[0]+this.grid.spacing/2, translation[1]+this.grid.spacing/2, 0)
    }
}

function squareIntersection(coordinatesA, coordinatesB) {
    return coordinatesA[0] == coordinatesB[0] && coordinatesA[1] == coordinatesB[1]
}
