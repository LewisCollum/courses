//Lewis Collum

function init(){
    const canvas = document.getElementById("gl-canvas")
    const gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    var camera = {
        origin: [30.0, 40.0, 60.0],
        lookAt: [0, 0, 0],
        up: [0, 1, 0]
    }
    const cameraViewPlane = viewPlaneFromCamera(camera)
    const cameraInverseViewMatrix = inverseViewMatrixFromPlane(cameraViewPlane)
    const cameraViewMatrix = viewMatrixFromPlane(cameraViewPlane)

    var left = -5.0;
    var right = 5.0;
    var top = 5.0;
    var bottom = -5.0;
    var near = 50.0;
    var far = 100.0;
    var orthographic = [
        [2/(right-left), 0, 0, -(right+left)/(right-left)],
        [0, 2/(top-bottom), 0, -(top+bottom)/(top-bottom)],
        [0, 0, -2/(far-near), -(far+near)/(far-near)],
        [0, 0, 0, 1]]

    drawer = new Drawer()
    drawer.setupWithGlAndShaders(gl, shaderProgram)
    drawer.strategy = gl.LINES
    drawer.projection = orthographic
    drawer.view = cameraViewMatrix
    
    const drawable = {
        points: getVertices(),
        faces: getFaces(),
        transformation: matrix.Identity(4),
        color: [0.6, 0.3, 0.0, 1]
    }
    drawer.addDrawable(drawable)
    
    frameEventDispatcher.updateMillis = 50
    frameEventDispatcher.addRenderingListener(() => {drawer.drawAll()})
    frameEventDispatcher.addEventListener(() => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        var dt = frameEventDispatcher.dt()
        var newRotation = form.Rotate.y(dt/1000.0)
        drawable.transformation = matrix.dot(drawable.transformation, newRotation)
    })
    frameEventDispatcher.onFrameEvent()
};


function viewPlaneFromCamera(camera) {
    var viewPlane = {}

    viewPlane.origin = camera.origin
    
    const distance = vector.subtract(camera.origin, camera.lookAt)
    viewPlane.normal = vector.normalize(distance)
    
    const horizontal = vector.cross(camera.up, viewPlane.normal)
    viewPlane.horizontalAxis = vector.normalize(horizontal)

    const vertical = vector.cross(viewPlane.normal, viewPlane.horizontalAxis)
    viewPlane.verticalAxis = vector.normalize(vertical)
    
    return viewPlane
}


function inverseViewMatrixFromPlane(viewPlane) {
    const planeRotation = rotationMatrixFromPlane(viewPlane)
    const planeTranslation = form.Translate.each(...viewPlane.origin)
    return matrix.dot(planeTranslation, planeRotation)
}

function viewMatrixFromPlane(viewPlane) {
    const planeRotation = matrix.transpose(rotationMatrixFromPlane(viewPlane))
    const planeTranslation = form.Translate.each(...vector.negate(viewPlane.origin))
    return matrix.dot(planeRotation, planeTranslation)
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
