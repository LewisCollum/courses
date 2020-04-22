class Drawer {
    setupWithGlAndShaders(gl, shaderProgram) {
        this.gl = gl
        this.shaderProgram = shaderProgram
        this.strategy = this.gl.TRIANGLES
        this.drawables = []
    }

    addDrawable(drawable) {
        this.drawables.push(drawable)
    }
    
    drawAll() {
        this.drawables.forEach((drawable) => this.draw(drawable))
    }

    draw(drawable) {
        const transformationLocation = this.gl.getUniformLocation(this.shaderProgram, "transformation")
        this.gl.uniformMatrix4fv(transformationLocation, false, matrix.transpose(drawable.transformation).flat())

        const flattenedView = matrix.transpose(this.view).flat()
        const viewLocation = this.gl.getUniformLocation(this.shaderProgram, "view");
        this.gl.uniformMatrix4fv(viewLocation, false, flattenedView);

        const flattenedProjection = matrix.transpose(this.projection).flat()
        const projectionLocation = this.gl.getUniformLocation(this.shaderProgram, "projection");
        this.gl.uniformMatrix4fv(projectionLocation, false, flattenedProjection);

        const flattenedPoints = Float32Array.from(drawable.points.flat())
        const pointBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, pointBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flattenedPoints, this.gl.STATIC_DRAW)

        const flattenedFaces = Uint16Array.from(drawable.faces.flat())        
        const indexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, flattenedFaces, this.gl.STATIC_DRAW)

        const pointPosition = this.gl.getAttribLocation(this.shaderProgram, "position")
        this.gl.vertexAttribPointer(pointPosition, 4, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(pointPosition)

        const color = this.gl.getUniformLocation(this.shaderProgram, "color")
        this.gl.uniform4f(color, drawable.color[0], drawable.color[1], drawable.color[2], drawable.color[3])

        const bufferLength = flattenedFaces.length
        this.gl.drawElements(this.strategy, bufferLength, this.gl.UNSIGNED_SHORT,0)
    }
}
