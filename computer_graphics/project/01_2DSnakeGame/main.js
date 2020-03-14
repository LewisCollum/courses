//Lewis Collum
function init() {
    const canvas = document.getElementById("gl-canvas")
    const gl = WebGLUtils.setupWebGL(canvas)

    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(shaderProgram)
    gl.viewport(0, 0, 512, 512)
    gl.clearColor(0.4, 1.0, 0.4, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    drawer.setupWithGlAndShaders(gl, shaderProgram)
    drawer.strategy = gl.TRIANGLE_FAN

    const grid = new Grid(15)
    const apple = new Apple(grid)
    const snake = new Snake(grid)

    const scoreElement = document.getElementById("score")
    const scoreTextNode = document.createTextNode("")
    scoreElement.appendChild(scoreTextNode)
    scoreTextNode.nodeValue = snake.length

    frameEventDispatcher.updateMillis = 100

    frameEventDispatcher.addEventListener(() => {
        gl.clear(gl.COLOR_BUFFER_BIT)

        if (Grid.areCoordinatesEqual(snake.headCoordinates, apple.coordinates)) {
            snake.feed()
            apple.eat()
            
            scoreTextNode.nodeValue = snake.length
            
            frameEventDispatcher.increaseUpdateMillis(-2)
        } 
        else if (snake.isDead) {
            window.alert(`Score: ${scoreTextNode.nodeValue}`)
            window.location.reload(false)
        } 
    })
    
    frameEventDispatcher.onFrameEvent()
}
