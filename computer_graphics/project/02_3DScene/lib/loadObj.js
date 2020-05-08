function loadObj(string) {
    var lines = string.split("\n");
    var vertices = [];
    var indices = [];

    lines.forEach((line) => {
        var parts = line.trimRight().split(' ')
        if (parts[0] === 'v')
            vertices.push(parts[1], parts[2], parts[3])

        else if (parts[0] ==='f') {
            let fields = [parts[1].split('/'),
                          parts[2].split('/'),
                          parts[3].split('/')]

            indices.push(
                parseInt(fields[0][0]) - 1,
                parseInt(fields[1][0]) - 1,
                parseInt(fields[2][0]) - 1)
        }
    })
    return {
        vertices: vertices,
        indices: indices
    }
}
