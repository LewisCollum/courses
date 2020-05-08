ObjLoader = new function() {
    this.loadFromString = function(string) {
        var lines = string.split("\n")
        var vertices = {
            values: [],
            indices: []
        }
        var textureCoordinates = {
            values: [],
            indices: []
        }
        var normals = {
            values: [],
            indices: []
        }
        
        lines.forEach((line) => {
            var parts = line.trimRight().split(' ')
            let tag = parts.shift()
            
            if (tag === 'v')
                vertices.values.push(...parts.map((v) => parseFloat(v)))

            else if (tag === 'vt')
                textureCoordinates.values.push(...parts.map((v) => parseFloat(v)))

            else if (tag === 'vn')
                normals.values.push(...parts.map((v) => parseFloat(v)))

            else if (tag === 'f') {
                let fields = [parts[0].split('/'),
                              parts[1].split('/'),
                              parts[2].split('/')]

                vertices.indices.push(
                    parseInt(fields[0][0]) - 1,
                    parseInt(fields[1][0]) - 1,
                    parseInt(fields[2][0]) - 1)

                textureCoordinates.indices.push(
                    parseInt(fields[0][1] - 1),
                    parseInt(fields[1][1] - 1),
                    parseInt(fields[2][1] - 1))

                normals.indices.push(
                    parseInt(fields[0][2] - 1),
                    parseInt(fields[1][2] - 1),
                    parseInt(fields[2][2] - 1))
            }
        })

        
        return {
            vertices: pairToTypedArrays(vertices),
            textureCoordinates: pairToTypedArrays(textureCoordinates),
            normals: pairToTypedArrays(normals)
        }
    }

    pairToTypedArrays = function(valueIndexPair) {
        return {
            values: Float32Array.from(valueIndexPair.values),
            indices: Uint16Array.from(valueIndexPair.indices)
        }
    }
}
