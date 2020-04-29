//Lewis Collum

class LightSwitch {
    constructor(light) {
        this.light = light
        this.offColor = {
            ambient: [0.0, 0.0, 0.0],
            diffuse: [0.0, 0.0, 0.0],
            specular: [0.0, 0.0, 0.0]
        }
        this.turnOff()
   }

    turnOn() {
        this.isOn = true
        this.light.color = Object.assign({}, this.light.onColor)
    }

    turnOff() {
        this.isOn = false
        this.light.color = this.offColor
    }

    turnOffSpecular() {
        this.light.color.specular = [0.0, 0.0, 0.0]
        console.log("SPEC OFF", this.light.onColor)
    }

    turnOnSpecular() {
        if (this.isOn)
            this.light.color.specular = this.light.onColor.specular
        console.log("SPEC ON", this.light.onColor)
    }    
}

function init(){
    const canvas = document.getElementById("gl-canvas")
    const gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.enable(gl.DEPTH_TEST);    
    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    var light = {
        onColor: {
            ambient: [0.0, 0.0, 0.01],
            diffuse: [0.7, 0.3, 0.05],
            specular: [1.0, 0.7, 1.0]
        },
        position: [40, 20, 60],
    }
    const lightSwitch = new LightSwitch(light)

    var spotlight = {
        onColor: {
            ambient: [0.1, 0.1, 0.0],
            diffuse: [0.9, 0.9, 0.6],
            specular: [0.4, 0.7, 0.0]
        },
        position: [-40, 20, 60],
        lookAt: [0, 0, 0]
    }
    const spotlightSwitch = new LightSwitch(spotlight)
    
    var camera = {
        origin: [0, 20, 60],
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

    var perspective = [
        [2*near/(right-left), 0, (right+left)/(right-left), 0],
        [0, 2*near/(top-bottom), (top+bottom)/(top-bottom), 0],
        [0, 0, -(far+near)/(far-near), -2*far*near/(far-near)],
        [0, 0, -1, 0]]
    
    drawer = new Drawer()
    drawer.setupWithGlAndShaders(gl, shaderProgram)
    drawer.strategy = gl.TRIANGLES
    drawer.view = cameraViewMatrix
    drawer.viewInverse = cameraInverseViewMatrix
    drawer.projection = orthographic    

    drawer.addLight(light)
    lightSwitch.turnOn()

    //drawer.addLight(spotlight)
    //light.turnOn()    
    
    const projectionLabelMap = {
        'Parallel': orthographic,
        'Perspective': perspective
    }

    selectionSubject.addObserver(function(selections) {
        drawer.projection = projectionLabelMap[selections.projection]
        if (selections.lights.has('Point')) lightSwitch.turnOn()
        else lightSwitch.turnOff()
        if (selections.lights.has('Spot')) spotlightSwitch.turnOn()
        else spotlightSwitch.turnOff()
        if (selections.modifiers.has('Specular')) lightSwitch.turnOnSpecular()
        else lightSwitch.turnOffSpecular()        
    })
    

    const shape = radial.make3d(30, 30)
    const drawable = {
        points: getVertices(),
        faces: getFaces(),
        transformation: matrix.Identity(4),
        color: [0.6, 0.3, 0.0, 1]
    }
    drawer.addDrawable(drawable)

    frameEventDispatcher.updateMillis = 15
    frameEventDispatcher.addRenderingListener(() => {drawer.drawAll()})
    frameEventDispatcher.addEventListener(() => {
        var dt = frameEventDispatcher.dt()
        //console.log(dt)
        var newRotation = form.Rotate.y(0.8 * dt/1000.0)
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
