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

    this.updateTransformation = function(entity, newTransformation) {
        let transformation = matrix.dot(entity.internal.transformation, newTransformation)
        entity.internal.transformation = transformation        
        entity.transformation = matrix.transpose(transformation).flat()
    }
}
