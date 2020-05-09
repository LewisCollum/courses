PlyLoader = new function() {
    this.loadFromString = function(string) {
        var indices = []
        var vertices = []
        var textureCoordinates = []
        var normals = []

        var isHeader = true
        let vertexCount = 0
        let faceCount = 0
        var lines = string.split("\n")
        lines.forEach((line) => {
            var parts = line.trimRight().split(' ')

            if (isHeader) {
                if (parts[0] === 'element' && parts[1] === 'vertex')
                    vertexCount = parseInt(parts[2])
                
                else if (parts[0] === 'element' && parts[1] === 'face')
                    faceCount = parseInt(parts[2])
                
                else if (parts[0] === 'end_header')
                    isHeader = false  
            }
            else {
                if (vertexCount-- > 0) {
                    parts = parts.map(i => parseFloat(i))
                    vertices.push(...parts.splice(0, 3))
                    normals.push(...parts.splice(0, 3))
                    textureCoordinates.push(...parts)
                }
                else if (faceCount-- > 0) {
                    parts.shift()
                    parts = parts.map(i => parseInt(i))
                    indices.push(...parts)
                }
            }          
        })

        return {
            indices: Uint16Array.from(indices),
            vertices: Float32Array.from(vertices),
            textureCoordinates: Float32Array.from(textureCoordinates),
            normals: Float32Array.from(normals)
        }
    }
}
