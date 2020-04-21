class Apple {
    constructor(grid) {
        this.grid = grid
        this.points = this.grid.makeCell()
        this.color = [1.0, 0.0, 0.0, 1.0]
        
        this.eat()
    }
    
    eat() {
        this.coordinates = this.grid.randomCoordinates()
        const translation = this.grid.gridToFrameCoordinates(this.coordinates)
        this.transformation = form.Translate.each(translation[0]+this.grid.spacing/2, translation[1]+this.grid.spacing/2, 0)
    }
}
