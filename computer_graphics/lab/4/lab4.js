//Lewis Collum

function init(){
    const canvas = document.getElementById("gl-canvas")
    const gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.enable(gl.DEPTH_TEST);    
    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    var light = {
        onColor: {
            ambient: [0.0, 0.0, 0.01],
            diffuse: [0.5, 0.2, 0.05],
            specular: [0.4, 0.4, 0.6]
        },
        falloff: {
            constant: 0,
            linear: 0,
            quadratic: 0.00005
        },
        shininess: 5,
        position: [40, 20, 60]
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
    
    var camera = new Camera({
        origin: [0, 20, 60],
        lookAt: [0, 0, 0],
        up: [0, 1, 0]
    })
    
    drawer = new Drawer()
    drawer.setupWithGlAndShaders(gl, shaderProgram)
    drawer.setDrawingStrategy(gl.TRIANGLES)
    drawer.setCamera(camera)
    drawer.addLight(light)
    //drawer.addLight(spotlight)

    const viewBox = {left: -5, right: 5, top: 5, bottom: -5, near: 50, far: 100}
    const projectionLabelMap = {
        'Parallel': function() {drawer.projection = orthographicFromViewBox(viewBox)},
        'Perspective': function() {drawer.projection = perspectiveFromViewBox(viewBox)}
    }

    const lightLabelMap = {
        'Point': function() {lightSwitch.turnOn()},
        'Spot': function() {spotlightSwitch.turnOn()}
    }
    const lightRemainsLabelMap = {
        'Point': function() {lightSwitch.turnOff()},
        'Spot': function() {spotlightSwitch.turnOff()}
    }

    const modifierLabelMap = {
        'Specular': function() {lightSwitch.turnOnSpecular()}
    }    
    const modifierRemainsLabelMap = {
        'Specular': function() {lightSwitch.turnOffSpecular()}
    }
    
    selectionSubject.addObserver(console.log)    
    selectionSubject.addObserver(function(selections) {
        projectionLabelMap[selections.projection]()

        var lightRemains = new Set(Object.keys(lightLabelMap))
        selections.lights.forEach((light) => {
            lightLabelMap[light]()
            lightRemains.delete(light)
        })
        lightRemains.forEach((light) => {
            lightRemainsLabelMap[light]()            
        })

        var modifierRemains = new Set(Object.keys(modifierLabelMap))
        selections.modifiers.forEach((modifier) => {
            modifierLabelMap[modifier]()
            modifierRemains.delete(modifier)
        })
        modifierRemains.forEach((modifier) => {
            modifierRemainsLabelMap[modifier]()
        })

    })
    selectionSubject.initialize({
        projection: 'Parallel',
        lights: new Set(["Point"]),
        modifiers: new Set(["Specular"])
    })
    

    const shape = radial.make3d(30, 30)
    const drawable = {
        points: getVertices(),
        faces: getFaces(),
        transformation: matrix.Identity(4),
        color: [0.6, 0.3, 0.0, 1]
    }
    drawer.addDrawable(drawable)

    const fpsElement = document.getElementById("fps")
    const fpsTextNode = document.createTextNode("")
    fpsElement.appendChild(fpsTextNode)
    
    frameEventDispatcher.updateMillis = 0
    frameEventDispatcher.addRenderingListener(() => {drawer.drawAll()})
    frameEventDispatcher.addEventListener(() => {
        var dt = frameEventDispatcher.dt()
        
        if (Math.round(frameEventDispatcher.currentMillis)%5 == 0)
            fpsTextNode.nodeValue = Math.round(dt)
        
        var newRotation = form.Rotate.y(0.8 * dt/1000.0)
        drawable.transformation = matrix.dot(drawable.transformation, newRotation)
    })
    frameEventDispatcher.onFrameEvent()
};
