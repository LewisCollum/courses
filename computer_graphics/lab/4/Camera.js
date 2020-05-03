class Camera {
    constructor(vectors) {
        this.viewPlane = this.viewPlaneFromVectors(vectors)
        this.viewInverse = this.inverseViewMatrixFromPlane(this.viewPlane)
        this.view = this.viewMatrixFromPlane(this.viewPlane)
    }

    viewPlaneFromVectors(vectors) {
        var viewPlane = {}

        viewPlane.origin = vectors.origin
        
        const distance = vector.subtract(vectors.origin, vectors.lookAt)
        viewPlane.normal = vector.normalize(distance)
        
        const horizontal = vector.cross(vectors.up, viewPlane.normal)
        viewPlane.horizontalAxis = vector.normalize(horizontal)

        const vertical = vector.cross(viewPlane.normal, viewPlane.horizontalAxis)
        viewPlane.verticalAxis = vector.normalize(vertical)
        
        return viewPlane
    }


    inverseViewMatrixFromPlane(viewPlane) {
        const planeRotation = this.rotationMatrixFromPlane(viewPlane)
        const planeTranslation = form.Translate.each(...viewPlane.origin)
        return matrix.dot(planeTranslation, planeRotation)
    }

    viewMatrixFromPlane(viewPlane) {
        const planeRotation = matrix.transpose(this.rotationMatrixFromPlane(viewPlane))
        const planeTranslation = form.Translate.each(...vector.negate(viewPlane.origin))
        return matrix.dot(planeRotation, planeTranslation)
    }

    rotationMatrixFromPlane(viewPlane) {
        const u = viewPlane.horizontalAxis
        const v = viewPlane.verticalAxis
        const n = viewPlane.normal
        return [
            [u[0], v[0], n[0], 0],
            [u[1], v[1], n[1], 0],
            [u[2], v[2], n[2], 0],        
            [0, 0, 0, 1]]
    }
    
}
