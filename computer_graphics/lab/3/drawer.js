const drawer = {};
(function(context) {
    context.setupWithGlAndShaders = function(gl, shaderProgram) {
        context.gl = gl
        context.shaderProgram = shaderProgram
        context.color = [0.0, 0.0, 0.0, 1.0]
        context.strategy = context.gl.TRIANGLE_FAN
        context.drawables = []
    }

    context.addDrawable = function(drawable) {context.drawables.push(drawable)}
    
    context.drawAll = function() {
        context.drawables.forEach((drawable) => context.drawInterpolated(drawable.points, drawable.interpolation))
    }

    context.drawInterpolated = function(points, interpolation) {
        const interpolationPointer = context.gl.getUniformLocation(context.shaderProgram, "interpolation")
        context.gl.uniformMatrix4fv(interpolationPointer, false, matrix.transpose(interpolation).flat())
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

        const color = context.gl.getUniformLocation(context.shaderProgram, "color")
        context.gl.uniform4f(color, context.color[0], context.color[1], context.color[2], context.color[3])

        const bufferLength = points.length
        context.gl.drawArrays(context.strategy, 0, bufferLength)
    }
})(drawer);
