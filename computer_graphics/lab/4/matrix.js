const matrix = {};
(function(context) {
    context.make = function(rows, columns, fill=null) {
        return Array(rows).fill().map(rows => Array(columns).fill().map(columns => fill))
    }

    context.Identity = function(size) {
        identity = context.make(size, size, 0)
        for (let i = 0; i < size; ++i) 
            identity[i][i] = 1
        return identity        
    }
    
    context.transpose = function(matrix) {
        return matrix[0].map((column, i) => matrix.map(row => row[i]));
    }

    context.column = function(matrix, column) {
        return matrix.map(row => row[column])
    }

    context.dot = function(first, second) {
        var dotted = context.make(first.length, second[0].length)
        matrix.transpose(second).forEach((column, columnIndex) => {
            first.forEach((row, rowIndex) => {
                dotted[rowIndex][columnIndex] = matrix.dotVector(row, column)
            })
        })
        return dotted
    }
    
    context.dotVector = function(first, second) {
        return first.map((value, index) => value * second[index]).reduce((sum, rest) => sum + rest)
    }

    context.dotMatrices = function(matrices) {
        return matrices.reduce((interpolation, rest) => context.dot(interpolation, rest))
    }
})(matrix);
