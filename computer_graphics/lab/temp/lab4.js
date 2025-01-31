//Lewis Collum

function init(){
    const canvas = document.getElementById("gl-canvas")
    const gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.enable(gl.DEPTH_TEST);    
    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0, 0, 0, 1.0)

    const lightSwitch = new LightSwitch(scene.lights.point[0])
    const directionalLightSwitch = new LightSwitch(scene.lights.directional[0])

    const drawer = new Drawer(gl, shaderProgram)
    const sceneImporter = new SceneImporter(gl, shaderProgram)
    var sceneCallables = sceneImporter.sceneToCallables(scene)
    drawer.addCallables(sceneCallables)

    console.log(scene.camera)
    console.log(matrix.transpose([[1, 2, 3, 4]]))
    console.log(matrix.dot(form.Translate.y(1), [[1, 2, 3, 1]]))
    //camera.transform(scene.camera, form.Translate.y(10))
    //console.log(scene.camera)
    
    const projectionLabelMap = {
        'Parallel': function() {scene.projection = projection.orthographic.create(scene.internal.viewBox)},
        'Perspective': function() {scene.projection = projection.perspective.create(scene.internal.viewBox)}
    }

    const lightLabelMap = {
        'Point': function() {lightSwitch.turnOn()},
        'Directional': function() {directionalLightSwitch.turnOn()}
    }
    const lightRemainsLabelMap = {
        'Point': function() {lightSwitch.turnOff()},
        'Directional': function() {directionalLightSwitch.turnOff()}
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
        lights: new Set(["Point", "Directional"]),
        modifiers: new Set(["Specular"])
    })
    
    const fpsElement = document.getElementById("fps")
    const fpsTextNode = document.createTextNode("")
    fpsElement.appendChild(fpsTextNode)

    FrameDispatcher.setUpdateMillis(20)
    FrameDispatcher.addRenderingListener(() => {drawer.drawAll()})
    FrameDispatcher.addListener(() => {
        var dt = FrameDispatcher.dt()
        
        fpsTextNode.nodeValue = Math.round(1000/dt/5)*5 //round to nearest multiple of 5

        mesh.transform(
            scene.meshes.head,
            form.Rotate.y(0.8 * dt/1000.0))
    })
    
    FrameDispatcher.begin()
};
