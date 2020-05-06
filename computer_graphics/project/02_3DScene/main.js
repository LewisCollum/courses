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
        'Specular': function() {
            lightSwitch.turnOnSpecular()
            directionalLightSwitch.turnOnSpecular()
        }
    }    
    const modifierRemainsLabelMap = {
        'Specular': function() {
            lightSwitch.turnOffSpecular()
            directionalLightSwitch.turnOffSpecular()
        }
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


    const scoreElement = document.getElementById("score")
    const scoreTextNode = document.createTextNode("")
    scoreElement.appendChild(scoreTextNode)

    FrameDispatcher.setUpdateMillis(20)
    FrameDispatcher.addRenderingListener(() => {drawer.drawAll()})
    FrameDispatcher.addListener(() => {
        var dt = FrameDispatcher.dt()
        
        scoreTextNode.nodeValue = Math.round(1000/dt/5)*5 //round to nearest multiple of 5
        scene.meshes.head.rotation = form.rotate.y(FrameDispatcher.millis()/1000)
        scene.meshes.head.position = form.translate.z(30*Math.cos(FrameDispatcher.millis()/500))
        scene.meshes.ground.rotation = form.rotate.x(FrameDispatcher.millis()/10000)
    })
    
    FrameDispatcher.begin()
};
