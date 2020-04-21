class Snake {
    constructor(grid) {
        this.grid = grid
        this.points = grid.makeCell()

        this.drift = matrix.Identity(4)
        this.driftVelocity = this.grid.spacing

        this.body = [{
            points: this.points,
            transformation: matrix.Identity(4),
            color: [0.6, 0.3, 0.0, 1],
            coordinates: [Math.floor(this.grid.count/2), Math.floor(this.grid.count/2)]
        }]
        
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

    get head() {
        return this.body[0]
    }

    get tail() {
        return this.body[this.body.length-1]
    }

    get isOverlapping() {
        var overlapping = false
        this.body.forEach((segment, index) => {
            if (index != 0 && Grid.areCoordinatesEqual(this.body[0].coordinates, segment.coordinates)) 
                overlapping = true
        })
        return overlapping
    }

    get isOverEdge() { return this.grid.isOutOfBounds(this.body[0].coordinates) }

    get isDead() {
        return this.isOverEdge || this.isOverlapping
    }

    get length() {
        return this.body.length
    }

    feed() {
        this.body.push({
            points: this.points,
            transformation: this.body[this.body.length-1].transformation,
            color: [0.6, 0.3, 0.0, 1],
            coordinates: [null, null]
        })
    }
    
    setMovementKeyMap() {
        this.movementKeyMap = new Proxy({
            ['A']: () => this.moveLeft(),
            ['D']: () => this.moveRight(),
            ['S']: () => this.moveDown(),
            ['W']: () => this.moveUp()
        }, {
            get: function(target, name) {
                return target.hasOwnProperty(name) ? target[name] : () => {} 
            }
        })
        
        document.addEventListener("keydown", (event) => {
            let key = String.fromCharCode(event.keyCode)
            this.movementKeyMap[key]()
        })
    }
}
