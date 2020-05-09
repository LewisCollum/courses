class Camera {
    constructor(vectors) {
        this.vectors = vectors
        this.update()
    }

    forward(value) {
        let direction = [-this.viewPlane.normal[0], 0, -this.viewPlane.normal[2]]
        let translation = vector.multiplyByScalar(direction, value)
        this.vectors.origin = vector.add(this.vectors.origin, translation)
        this.vectors.lookAt = vector.add(this.vectors.lookAt, translation)
    }

    lateral(value) {
        let direction = [this.viewPlane.horizontalAxis[0], 0, this.viewPlane.horizontalAxis[2]]
        let translation = vector.multiplyByScalar(direction, value)
        //console.log(translation)
        this.vectors.origin = vector.add(this.vectors.origin, translation)
        this.vectors.lookAt = vector.add(this.vectors.lookAt, translation)
    }    
 
    turn(value) {
        let rotationMatrix = form.rotate.y(value)
        this.vectors.lookAt = vector.subtract(this.vectors.lookAt, this.vectors.origin)
        let rotated = matrix.multiply([[...this.vectors.lookAt, 1]], rotationMatrix)
        this.vectors.lookAt = vector.add(...rotated, [...this.vectors.origin, 0]).slice(0, 3)
    }

    update() {
        this.viewPlane = viewPlaneFromVectors(this.vectors)
        let viewMatrix = viewMatrixFromPlane(this.viewPlane)
        let viewInverseMatrix = inverseViewMatrixFromPlane(this.viewPlane)
        this.view = matrix.transpose(viewMatrix).flat()
        this.viewInverse = viewInverseMatrix.flat()
    }    
}

function viewMatrixFromVectors(vectors) {
    let viewPlane = viewPlaneFromVectors(vectors)
    const planeRotation = matrix.transpose(this.rotationMatrixFromPlane(viewPlane))
    const planeTranslation = form.translate.each(...vector.negate(viewPlane.origin))
    return matrix.multiply(planeRotation, planeTranslation)
}

function viewPlaneFromVectors(vectors) {
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

function inverseViewMatrixFromPlane(viewPlane) {
    const planeRotation = this.rotationMatrixFromPlane(viewPlane)
    const planeTranslation = form.translate.each(...viewPlane.origin)
    return matrix.multiply(planeTranslation, planeRotation)
}

function viewMatrixFromPlane(viewPlane) {
    const planeRotation = matrix.transpose(this.rotationMatrixFromPlane(viewPlane))
    const planeTranslation = form.translate.each(...vector.negate(viewPlane.origin))
    return matrix.multiply(planeRotation, planeTranslation)
}

function rotationMatrixFromPlane(viewPlane) {
    const u = viewPlane.horizontalAxis
    const v = viewPlane.verticalAxis
    const n = viewPlane.normal
    return [
        [u[0], v[0], n[0], 0],
        [u[1], v[1], n[1], 0],
        [u[2], v[2], n[2], 0],        
        [0, 0, 0, 1]]
}


// const camera = new function() {
//     this.create = function(rawCamera) {
//         let viewPlane = viewPlaneFromVectors(rawCamera)
//         let view = viewMatrixFromPlane(viewPlane)
//         let viewInverse = inverseViewMatrixFromPlane(viewPlane) 
        
//         return {
//             origin: rawCamera.origin,
//             lookAt: rawCamera.lookAt,
//             up: rawCamera.up,
//             viewInverse: viewInverse.flat(),
//             view: matrix.transpose(view).flat()
//         }
//     }

//     this.transform = function(camera, transformation) {
//         let origin = matrix.dot(transformation, [...camera.origin, 1])
//         console.log(origin)
//         Object.assign(camera, this.create({
//             origin: origin[0],
//             lookAt: camera.lookAt,
//             up: camera.up
//         }))
//     }

//     viewPlaneFromVectors = function(vectors) {
//         var viewPlane = {}

//         viewPlane.origin = vectors.origin
        
//         const distance = vector.subtract(vectors.origin, vectors.lookAt)
//         viewPlane.normal = vector.normalize(distance)
        
//         const horizontal = vector.cross(vectors.up, viewPlane.normal)
//         viewPlane.horizontalAxis = vector.normalize(horizontal)

//         const vertical = vector.cross(viewPlane.normal, viewPlane.horizontalAxis)
//         viewPlane.verticalAxis = vector.normalize(vertical)
        
//         return viewPlane
//     }


//     inverseViewMatrixFromPlane = function(viewPlane) {
//         const planeRotation = this.rotationMatrixFromPlane(viewPlane)
//         const planeTranslation = form.translate.each(...viewPlane.origin)
//         return matrix.multiply(planeTranslation, planeRotation)
//     }

//     viewMatrixFromPlane = function(viewPlane) {
//         const planeRotation = matrix.transpose(this.rotationMatrixFromPlane(viewPlane))
//         const planeTranslation = form.translate.each(...vector.negate(viewPlane.origin))
//         return matrix.multiply(planeRotation, planeTranslation)
//     }

//     rotationMatrixFromPlane = function(viewPlane) {
//         const u = viewPlane.horizontalAxis
//         const v = viewPlane.verticalAxis
//         const n = viewPlane.normal
//         return [
//             [u[0], v[0], n[0], 0],
//             [u[1], v[1], n[1], 0],
//             [u[2], v[2], n[2], 0],        
//             [0, 0, 0, 1]]
//     }
// }
