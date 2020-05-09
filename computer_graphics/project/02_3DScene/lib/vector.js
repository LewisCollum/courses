const vector = {};
(function(context) {
    context.make = function(size, fill=null) {
        return Array(size).fill().map(elements => fill)
    }

    context.ones = function(size) {
        return context.make(size, 1)
    }

    context.zeros = function(size) {
        return context.make(size, 0)
    }

    context.empty = function(size) {
        return context.make(size, null)
    }
    
    context.magnitude = function(vector) {
        return vector.map(x => x**2).reduce((sum, element) => sum + element)**(1/2)
    }

    context.multiply = function(first, second) {
        return first.map((x, i) => x * second[i])
    }

    context.multiplyByScalar = function(vector, scalar) {
        return vector.map(x => x * scalar)
    }
    
    context.divide = function(first, second) {
        return first.map((x, i) => x / second[i])
    }

    context.divideByScalar = function(vector, scalar) {
        return vector.map(x => x / scalar)
    }
    
    context.normalize = function(vector) {
        return context.divideByScalar(vector, context.magnitude(vector))
    }

    context.cross = function(a, b) {
        return [
            a[1]*b[2] - a[2]*b[1],
            -(a[0]*b[2] - a[2]*b[0]),
            a[0]*b[1] - a[1]*b[0]
        ]
    }

    context.add = function(first, second) {
        return first.map((x, i) => x + second[i])
    }

    context.subtract = function(first, second) {
        return first.map((x, i) => x - second[i])
    }

    context.negate = function(vector) {
        return vector.map(x => -x)
    }
})(vector);
