const mesh = new function() {
    this.create = function(rawMesh) {
        let flattenedFaces = Uint16Array.from(rawMesh.faces.flat())
        let faceNormals = getFaceNormals(rawMesh.points, flattenedFaces)

        return {
            points: Float32Array.from(rawMesh.points.flat()),
            faces: flattenedFaces,
            normals: Float32Array.from(getVertexNormals(rawMesh.points, flattenedFaces, faceNormals).flat()),
            transformation: matrix.transpose(rawMesh.transformation).flat(),

            internal: {
                transformation: rawMesh.transformation
            }
        }
    }

    this.transform = function(entity, newTransformation) {
        let transformation = matrix.multiply(entity.internal.transformation, newTransformation)
        entity.internal.transformation = transformation        
        entity.transformation = matrix.transpose(transformation).flat()
    }

    this.setTransform = function(entity, newTransformation) {
        entity.internal.transformation = newTransformation        
        entity.transformation = matrix.transpose(newTransformation).flat()
    }
    
    this.flipNormals = function(normals) {
        let copy = [...normals]
        for (let i = 0; i < normals.length; i+=3) {
            copy[i+1] += copy[i+2]
            copy[i+2] = copy[i+1] - copy[i+2]
            copy[i+1] = copy[i+1] - copy[i+2]        
        }
        return copy
    }
}
