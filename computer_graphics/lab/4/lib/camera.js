const camera = new function() {
    this.create = function(rawCamera) {
        let viewPlane = viewPlaneFromVectors(rawCamera)
        let view = viewMatrixFromPlane(viewPlane)
        let viewInverse = inverseViewMatrixFromPlane(viewPlane) 
        
        return {
            origin: rawCamera.origin,
            lookAt: rawCamera.lookAt,
            up: rawCamera.up,
            viewInverse: viewInverse.flat(),
            view: matrix.transpose(view).flat()
        }
    }

    this.transform = function(camera, transformation) {
        let origin = matrix.dotVector([...camera.origin, 1], transformation)
        console.log(origin)
        Object.assign(camera, this.create({
            origin: origin[0],
            lookAt: camera.lookAt,
            up: camera.up
        }))
    }

    viewPlaneFromVectors = function(vectors) {
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


    inverseViewMatrixFromPlane = function(viewPlane) {
        const planeRotation = this.rotationMatrixFromPlane(viewPlane)
        const planeTranslation = form.Translate.each(...viewPlane.origin)
        return matrix.multiply(planeTranslation, planeRotation)
    }

    viewMatrixFromPlane = function(viewPlane) {
        const planeRotation = matrix.transpose(this.rotationMatrixFromPlane(viewPlane))
        const planeTranslation = form.Translate.each(...vector.negate(viewPlane.origin))
        return matrix.multiply(planeRotation, planeTranslation)
    }

    rotationMatrixFromPlane = function(viewPlane) {
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
