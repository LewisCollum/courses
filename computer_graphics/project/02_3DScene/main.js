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

    
    const lightLabelMap = {
        'Point': function() {lightSwitch.turnOn()},
        'Directional': function() {directionalLightSwitch.turnOn()}
    }
    const lightRemainsLabelMap = {
        'Point': function() {lightSwitch.turnOff()},
        'Directional': function() {directionalLightSwitch.turnOff()}
    }
    
    selectionSubject.addObserver(function(selections) {
        var lightRemains = new Set(Object.keys(lightLabelMap))
        selections.lights.forEach((light) => {
            lightLabelMap[light]()
            lightRemains.delete(light)
        })
        lightRemains.forEach((light) => {
            lightRemainsLabelMap[light]()            
        })
    })
    selectionSubject.initialize({
        lights: new Set(["Point", "Directional"])
    })


    const scoreElement = document.getElementById("score")
    const scoreTextNode = document.createTextNode("")
    scoreElement.appendChild(scoreTextNode)

    FrameDispatcher.setUpdateMillis(20)
    FrameDispatcher.addRenderingListener(() => {drawer.drawAll()})
    FrameDispatcher.addListener(() => {
        var dt = FrameDispatcher.dt()

        scoreTextNode.nodeValue = Math.round(1000/dt/5)*5 //round to nearest multiple of 5
        if (scene.meshes.coin) {
            scene.meshes.coin.rotation = form.rotate.y(3*FrameDispatcher.millis()/1000)
            scene.meshes.coin.position = form.translate.y(2.5*Math.cos(FrameDispatcher.millis()/500))
        }
        if (scene.meshes.ground) {
            scene.meshes.ground.rotation = form.rotate.x(FrameDispatcher.millis()/10000)
        }
        scene.meshes.wall.rotation = form.translate.x(5*Math.cos(2*FrameDispatcher.millis()/1000))        
    })
    
    FrameDispatcher.begin()
};
