// class LightDrawer {

// }
        // this.cameraShaderLocations = ShaderLocations(shaderProgram, {
        //     view: "camera.view",
        //     viewInverse: "camera.viewInverse",
        //     projection: "camera.projection"
        // })
        // this.vertexShaderLocations = ShaderLocations(shaderProgram, {
        //     position: "vertex.position",
        //     transformation: "vertex.transformation",
        //     normal: "vertex.normal"
        // })
        // this.lightShaderLocations = ShaderLocations(shaderProgram, {


class Drawer {
    setupWithGlAndShaders(gl, shaderProgram) {
        this.gl = gl
        this.shaderProgram = shaderProgram
        this.strategy = this.gl.TRIANGLES
        this.drawables = []
        this.lights = []
            
        this.viewLocation = this.gl.getUniformLocation(this.shaderProgram, "camera.view");
        this.viewInverseLocation = this.gl.getUniformLocation(this.shaderProgram, "camera.viewInverse");        
        this.projectionLocation = this.gl.getUniformLocation(this.shaderProgram, "camera.projection");
        this.pointPosition = this.gl.getAttribLocation(this.shaderProgram, "vertexPosition")
        this.transformationLocation = this.gl.getUniformLocation(this.shaderProgram, "transformation")
        this.vertexNormalLocation = this.gl.getAttribLocation(this.shaderProgram, "vertexNormal");
        
    }

    setDrawingStrategy(strategy) {
        this.strategy = strategy
    }

    setCamera(camera) {
        this.camera = camera
    }
    
    lightColorTypeLocation(index, colorType) {
        const location = `lights[${index}].colors.${colorType}`
        return this.gl.getUniformLocation(this.shaderProgram, location)
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

    lightFalloffTypeLocation(index, falloffType) {
        const location = `lights[${index}].falloff.${falloffType}`
        return this.gl.getUniformLocation(this.shaderProgram, location)
    }
    lightFalloffLocation(index) {
        return {
            constant: this.lightFalloffTypeLocation(index, 'constant'),
            linear: this.lightFalloffTypeLocation(index, 'linear'),
            quadratic: this.lightFalloffTypeLocation(index, 'quadratic')
        }
    }

    lightShininessLocation(index) {
        return this.gl.getUniformLocation(this.shaderProgram, `lights[${index}].shininess`)
    }    

    addLight(light) {
        var index = this.lights.length
        light.colorLocation = this.lightColorLocation(index)
        light.positionLocation = this.lightPositionLocation(index)
        light.falloffLocation = this.lightFalloffLocation(index)
        light.shininessLocation = this.lightShininessLocation(index)
        this.lights.push(light)
    }

    drawLight(light) {
        for (const colorType in light.color)
            this.gl.uniform3f(
                light.colorLocation[colorType],
                ...light.color[colorType])
        for (const falloffType in light.falloff)
            this.gl.uniform1f(
                light.falloffLocation[falloffType],
                light.falloff[falloffType])        
        this.gl.uniform3f(light.positionLocation, ...light.position)
        this.gl.uniform1f(light.shininessLocation, light.shininess)
    }

    drawLights() {
        this.lights.forEach((light) => {
            this.drawLight(light)
        })
    }
   
    
    addDrawable(drawable) {
        drawable.flattenedPoints = Float32Array.from(drawable.points.flat())
        drawable.flattenedFaces = Uint16Array.from(drawable.faces.flat())                
        const faceNormals = getFaceNormals(
            drawable.points,
            drawable.flattenedFaces);
        drawable.vertexNormals = getVertexNormals(
            drawable.points,
            drawable.flattenedFaces,
            faceNormals);        
        this.drawables.push(drawable)
    }
    
    drawAll() {
        this.drawables.forEach((drawable) => this.draw(drawable))
    }

    draw(drawable) {
        //Lights
        this.drawLights()

        //Camera
        const flattenedView = matrix.transpose(this.camera.view).flat()
        this.gl.uniformMatrix4fv(this.viewLocation, false, flattenedView);
        const flattenedViewInverse = this.camera.viewInverse.flat()
        this.gl.uniformMatrix4fv(this.viewInverseLocation, false, flattenedViewInverse);
        const flattenedProjection = matrix.transpose(this.projection).flat()
        this.gl.uniformMatrix4fv(this.projectionLocation, false, flattenedProjection);

        
        //Vertex
        this.gl.uniformMatrix4fv(this.transformationLocation, false, matrix.transpose(drawable.transformation).flat())
        

        const pointBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, pointBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, drawable.flattenedPoints, this.gl.STATIC_DRAW)


        const indexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, drawable.flattenedFaces, this.gl.STATIC_DRAW)
        
        this.gl.vertexAttribPointer(this.pointPosition, 4, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.pointPosition)

        const normalsbuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalsbuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from(drawable.vertexNormals.flat()), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.vertexNormalLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.vertexNormalLocation);

        
        //Render
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
        this.gl.drawElements(this.strategy, drawable.flattenedFaces.length, this.gl.UNSIGNED_SHORT,0)
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
