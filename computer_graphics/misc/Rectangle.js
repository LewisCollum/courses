class Rectangle {
    static makeFromLimits(limits) {
        return new Rectangle(limits)
    }

    static makeFromOriginAndDimensions(origin, dimensions) {
        return new Rectangle({
            x: {first: origin.x, second: origin.x+dimensions.width},
            y: {first: origin.y, second: origin.y+dimensions.height}
        })
    }
    
    constructor(limits) {
        this.points = [
            vec4(limits.x.first, limits.y.first, 0.0, 1.0),
            vec4(limits.x.first, limits.y.second, 0.0, 1.0),
            vec4(limits.x.second, limits.y.second, 0.0, 1.0),
            vec4(limits.x.second, limits.y.first, 0.0, 1.0)]
    }

    get length() { return this.points.length }

    // TODO extract increment functions from class, since data structures shouldn't have behavior
    //
    xIncrement(increment) {
        this.points.forEach(vector => vector[0] += increment)
    }

    yIncrement(increment) {
        this.points.forEach(vector => vector[1] += increment)
    }
}
