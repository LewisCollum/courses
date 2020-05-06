const matrix = {};
(function(context) {
    context.make = function(rows, columns, fill=null) {
        return Array(rows).fill().map(rows => Array(columns).fill().map(columns => fill))
    }

    context.multiply = (a, b) => a.map(x => context.transpose(b).map(y => context.dot(x, y)))
    context.multiplyAll = a => a.reduce((product, rest) => context.multiply(product, rest))
    context.dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n)
    context.transpose = a => a[0].map((x, i) => a.map(y => y[i]))

    context.Identity = function(size) {
        identity = context.make(size, size, 0)
        for (let i = 0; i < size; ++i) 
            identity[i][i] = 1
        return identity        
    }
    
    context.column = function(matrix, column) {
        return matrix.map(row => row[column])
    }
    
    context.dotVector = function(first, second) {
        return first.map((value, index) => value * second[index]).reduce((sum, rest) => sum + rest)
    }


})(matrix);
