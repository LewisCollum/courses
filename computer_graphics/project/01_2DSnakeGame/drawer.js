const drawer = {};
(function(context) {
    context.setupWithGlAndShaders = function(gl, shaderProgram) {
        context.gl = gl
        context.shaderProgram = shaderProgram
        context.color = [0.0, 0.0, 0.0, 1.0]
        context.strategy = context.gl.TRIANGLE_FAN
        context.drawables = []
        
        frameEventDispatcher.addRenderingListener(() => {
            this.drawAll()
        })
    }

    context.addDrawable = function(drawable) {context.drawables.push(drawable)}
    
    context.drawAll = function() {
        context.drawables.forEach((drawable) => context.drawTransformed(drawable.points, drawable.transformation))
    }

    context.drawTransformed = function(points, transformation) {
        const transformationPointer = context.gl.getUniformLocation(context.shaderProgram, "transformation")
        context.gl.uniformMatrix4fv(transformationPointer, false, matrix.transpose(transformation).flat())
        context.draw(points)
    }

    context.draw = function(points) {
        const flattenedDrawer = Float32Array.from(points.flat())
        const pointBuffer = context.gl.createBuffer()
        context.gl.bindBuffer(context.gl.ARRAY_BUFFER, pointBuffer)
        context.gl.bufferData(context.gl.ARRAY_BUFFER, flattenedDrawer, context.gl.STATIC_DRAW)

        const pointPosition = context.gl.getAttribLocation(context.shaderProgram, "position")
        context.gl.vertexAttribPointer(pointPosition, 4, context.gl.FLOAT, false, 0, 0)
        context.gl.enableVertexAttribArray(pointPosition)

        const color = context.gl.getAttribLocation(context.shaderProgram, "color")
        //context.gl.uniform4f(color, context.color[0], context.color[1], context.color[2], context.color[3])
        context.gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0)
        context.gl.enableVertexAttribArray(color)

        const bufferLength = points.length
        context.gl.drawArrays(context.strategy, 0, bufferLength)
    }
})(drawer);
