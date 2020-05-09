//Lewis Collum

function init(){
    const canvas = document.getElementById("gl-canvas")
    const gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
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


    var spin = 0
    var velocity = 0
    var lateralVelocity = 0
    var keyLog = new Set() 
    var keyUpHandler = {
        get: function(target, name) {
            console.log(name)
            if (target.hasOwnProperty(name) && keyLog.has(name)) {
                keyLog.delete(name)
                console.log(keyLog)
                return target[name]
            }
            return () => {}
        }
    }
    var keyUpMap = new Proxy({
        ['A']: function() {lateralVelocity = 0},
        ['D']: function() {lateralVelocity = 0},
        ['S']: function() {velocity = 0},
        ['W']: function() {velocity = 0},
        ['%']: function() {spin = 0},
        ["'"]: function() {spin = 0}
    }, keyUpHandler)
    var keyDownHandler = {
        get: function(target, name) {
            if (target.hasOwnProperty(name) && !keyLog.has(name)) {
                keyLog.add(name)
                console.log(keyLog)
                return target[name]
            }
            return () => {}
        }
    }
    var keyDownMap = new Proxy({
        ['A']: function() {lateralVelocity = -100},
        ['D']: function() {lateralVelocity = 100},
        ['S']: function() {velocity = -100},
        ['W']: function() {velocity = 100},
        ['%']: function() {spin = -1.2},
        ["'"]: function() {spin = 1.2}        
    }, keyDownHandler)

    
    document.addEventListener("keydown", (event) => {
        let key = String.fromCharCode(event.keyCode)
        keyDownMap[key]()
    })    
    document.addEventListener("keyup", (event) => {
        let key = String.fromCharCode(event.keyCode)
        keyUpMap[key]()
    })

    const scoreElement = document.getElementById("score")
    const scoreTextNode = document.createTextNode("")
    scoreElement.appendChild(scoreTextNode)

    FrameDispatcher.setUpdateMillis(10)
    FrameDispatcher.addRenderingListener(() => {drawer.drawAll()})
    FrameDispatcher.addListener(() => {
        var dt = FrameDispatcher.dt()/1000
        var t = FrameDispatcher.millis()/1000

        scoreTextNode.nodeValue = Math.round(1/dt/5)*5 //round to nearest multiple of 5
        if (scene.meshes.coin) {
            scene.meshes.coin.rotation = form.rotate.y(3*t)
            scene.meshes.coin.position = form.translate.y(2.5*Math.cos(2*t))
        }

        scene.camera.forward(velocity*dt)
        scene.camera.lateral(lateralVelocity*dt)
        scene.camera.turn(spin*dt)        
        scene.camera.update()
    })
    
    FrameDispatcher.begin()
};
