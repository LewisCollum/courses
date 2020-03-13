const drawer = {};
(function(context) {
    context.setupWithGlAndShaders = function(gl, shaderProgram) {
        context.gl = gl
        context.shaderProgram = shaderProgram
        context.strategy = context.gl.TRIANGLE_FAN
        context.drawables = []
        
        frameEventDispatcher.addRenderingListener(() => {
            this.drawAll()
        })
    }

    context.addDrawable = function(drawable) {context.drawables.push(drawable)}
    
    context.drawAll = function() {
        context.drawables.forEach((drawable) => context.draw(drawable))
    }

    context.draw = function(drawable) {
        const transformationPointer = context.gl.getUniformLocation(context.shaderProgram, "transformation")
        context.gl.uniformMatrix4fv(transformationPointer, false, matrix.transpose(drawable.transformation).flat())
        
        const flattenedDrawer = Float32Array.from(drawable.points.flat())
        const pointBuffer = context.gl.createBuffer()
        context.gl.bindBuffer(context.gl.ARRAY_BUFFER, pointBuffer)
        context.gl.bufferData(context.gl.ARRAY_BUFFER, flattenedDrawer, context.gl.STATIC_DRAW)

        const pointPosition = context.gl.getAttribLocation(context.shaderProgram, "position")
        context.gl.vertexAttribPointer(pointPosition, 4, context.gl.FLOAT, false, 0, 0)
        context.gl.enableVertexAttribArray(pointPosition)

        const color = context.gl.getUniformLocation(context.shaderProgram, "color")
        context.gl.uniform4f(color, drawable.color[0], drawable.color[1], drawable.color[2], drawable.color[3])

        const bufferLength = drawable.points.length
        context.gl.drawArrays(context.strategy, 0, bufferLength)
    }
    
})(drawer);
