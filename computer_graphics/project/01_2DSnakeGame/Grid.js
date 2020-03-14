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

    makeCell() {
        return matrix.dotMatrices([
            radial.make2d(4),
            form.Rotate.z(Math.PI/4),
            form.Scale.all(Math.sqrt(2)*this.spacing/2)])        
    }
    
    isOutOfBounds(coordinates) {
        return coordinates[0] >= this.count || coordinates[0] < 0 ||
            coordinates[1] >= this.count || coordinates[1] < 0
    }

    static areCoordinatesEqual(a, b) {
        return a[0] == b[0] && a[1] == b[1]
    }
}
