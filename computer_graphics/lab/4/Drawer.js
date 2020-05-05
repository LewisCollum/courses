class Drawer {
    constructor(gl, shaderProgram) {
        this.gl = gl
        this.shaderProgram = shaderProgram
        this.callables = []
    }

    addCallables(callables) {
        this.callables.push(...callables)
    }
    
    drawAll() {
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
        this.callables.forEach((callable) => {
            callable(this.gl)
        })
    }
}
