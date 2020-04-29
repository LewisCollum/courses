class Drawer {
    setupWithGlAndShaders(gl, shaderProgram) {
        this.gl = gl
        this.shaderProgram = shaderProgram
        this.strategy = this.gl.TRIANGLES
        this.drawables = []
        this.lights = []
    }

    lightColorTypeLocation(index, colorType) {
        return this.gl.getUniformLocation(this.shaderProgram, `lights[${index}].color.${colorType}`)
    }

    lightColorLocation(index) {
        return {
            ambient: this.lightColorTypeLocation(index, 'ambient'),
            diffuse: this.lightColorTypeLocation(index, 'diffuse'),
            specular: this.lightColorTypeLocation(index, 'specular')
        }
    }

    lightPositionLocation(index) {
        return this.gl.getUniformLocation(this.shaderProgram, `lights[${index}].position`)
    }    

    addLight(light) {
        var index = this.lights.length
        light.colorLocation = this.lightColorLocation(index)
        light.positionLocation = this.lightPositionLocation(index)
        this.lights.push(light)
    }

    drawLight(light) {
        for (const colorType in light.color)
            this.gl.uniform3f(light.colorLocation[colorType], ...light.color[colorType])
        this.gl.uniform3f(light.positionLocation, ...light.position)
    }

    drawLights() {
        this.lights.forEach((light) => {
            console.log(light)
            this.drawLight(light)
        })
    }
    
    addDrawable(drawable) {
        this.drawables.push(drawable)
    }
    
    drawAll() {
        this.drawables.forEach((drawable) => this.draw(drawable))
    }

    draw(drawable) {
        this.drawLights()
        
        const transformationLocation = this.gl.getUniformLocation(this.shaderProgram, "transformation")
        this.gl.uniformMatrix4fv(transformationLocation, false, matrix.transpose(drawable.transformation).flat())

        const flattenedView = matrix.transpose(this.view).flat()
        const viewLocation = this.gl.getUniformLocation(this.shaderProgram, "camera.view");
        this.gl.uniformMatrix4fv(viewLocation, false, flattenedView);
        const flattenedViewInverse = this.viewInverse.flat()
        console.log("FVI", flattenedViewInverse)
        const viewInverseLocation = this.gl.getUniformLocation(this.shaderProgram, "camera.viewInverse");
        this.gl.uniformMatrix4fv(viewInverseLocation, false, flattenedViewInverse);
        const flattenedProjection = matrix.transpose(this.projection).flat()
        const projectionLocation = this.gl.getUniformLocation(this.shaderProgram, "camera.projection");
        this.gl.uniformMatrix4fv(projectionLocation, false, flattenedProjection);

        const flattenedPoints = Float32Array.from(drawable.points.flat())
        const pointBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, pointBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flattenedPoints, this.gl.STATIC_DRAW)

        const flattenedFaces = Uint16Array.from(drawable.faces.flat())        
        const indexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, flattenedFaces, this.gl.STATIC_DRAW)
        
        const pointPosition = this.gl.getAttribLocation(this.shaderProgram, "vertexPosition")
        this.gl.vertexAttribPointer(pointPosition, 4, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(pointPosition)

        var faceNormals = getFaceNormals(
            drawable.points,
            flattenedFaces);
        var vertexNormals = getVertexNormals(
            drawable.points,
            flattenedFaces,
            faceNormals);

        var normalsbuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalsbuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from(vertexNormals.flat()), this.gl.STATIC_DRAW);
        var vertexNormalPointer = this.gl.getAttribLocation(this.shaderProgram, "vertexNormal");
        this.gl.vertexAttribPointer(vertexNormalPointer, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vertexNormalPointer);

        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
        this.gl.drawElements(this.strategy, flattenedFaces.length, this.gl.UNSIGNED_SHORT,0)
    }
}


function getFaceNormals(vertices, indexList) {
    var faceNormals = [];
    for(var i=0; i < indexList.length/3; i++) {
        var p0 = vec3(vertices[indexList[3*i]][0],
                      vertices[indexList[3*i]][1],
                      vertices[indexList[3*i]][2]);
        var p1 = vec3(vertices[indexList[3*i+1]][0],
                      vertices[indexList[3*i+1]][1],
                      vertices[indexList[3*i+1]][2]);
        var p2 = vec3(vertices[indexList[3*i+2]][0],
                      vertices[indexList[3*i+2]][1],
                      vertices[indexList[3*i+2]][2]);
        var p1minusp0 = [p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]];
        var p2minusp0 = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
        var faceNormal = cross(p1minusp0, p2minusp0);
        faceNormal = normalize(faceNormal);
        faceNormals.push(faceNormal);
    }
    return faceNormals;
}

function getVertexNormals(vertices, indexList, faceNormals) {
    var vertexNormals=[];
    for(var j=0; j < vertices.length; j++) {
        var vertexNormal = [0,0,0];
        for(var i=0; i < indexList.length; i++) {
            if (indexList[3*i]==j | indexList[3*i+1]==j | indexList[3*i+2] == j) {
                vertexNormal[0] = vertexNormal[0] + faceNormals[i][0];
                vertexNormal[1] = vertexNormal[1] + faceNormals[i][1];
                vertexNormal[2] = vertexNormal[2] + faceNormals[i][2];
            }
        }
        vertexNormal = normalize(vertexNormal);
        vertexNormals.push(vertexNormal);
    }
    return vertexNormals;
}
