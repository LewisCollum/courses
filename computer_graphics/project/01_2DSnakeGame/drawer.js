class Drawer {
    setupWithGlAndShaders(gl, shaderProgram) {
        this.gl = gl
        this.shaderProgram = shaderProgram
        this.strategy = this.gl.TRIANGLE_FAN
        this.drawables = []
    }

    addDrawable(drawable) {
        this.drawables.push(drawable)
    }
    
    drawAll() {
        this.drawables.forEach((drawable) => this.draw(drawable))
    }

    draw(drawable) {
        const transformationPointer = this.gl.getUniformLocation(this.shaderProgram, "transformation")
        this.gl.uniformMatrix4fv(transformationPointer, false, matrix.transpose(drawable.transformation).flat())
        
        const flattenedDrawer = Float32Array.from(drawable.points.flat())
        const pointBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, pointBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flattenedDrawer, this.gl.STATIC_DRAW)

        const pointPosition = this.gl.getAttribLocation(this.shaderProgram, "position")
        this.gl.vertexAttribPointer(pointPosition, 4, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(pointPosition)

        const color = this.gl.getUniformLocation(this.shaderProgram, "color")
        this.gl.uniform4f(color, drawable.color[0], drawable.color[1], drawable.color[2], drawable.color[3])

        const bufferLength = drawable.points.length
        this.gl.drawArrays(this.strategy, 0, bufferLength)
    }
}
