class SceneImporter {
    constructor(gl, shaderProgram) {
        this.gl = gl
        this.shaderProgram = shaderProgram
    }
    
    sceneToCallables(scene) {
        return this.objectToShaderLocations(scene)
    }

    isObject(entity) {
        return typeof entity === 'object' && !Array.isArray(entity)        
    }
    
    objectToShaderLocations(object, tag = "", returnables = []) {
        for (let [name, entity] of Object.entries(object)) {
            if (this.isObject(entity)) {
                console.log(entity)
                let entityTag = tag + name + '.'
                if (name === 'meshes') {
                    for(let [name, mesh] of Object.entries(entity)) 
                        returnables.push(this.makeCallableForMesh(mesh))
                }
                else if (name !== 'internal')
                    this.objectToShaderLocations(entity, entityTag, returnables)                
            }
            else if (Array.isArray(entity) && this.isObject(entity[0])) {
                let countLocation = this.locationFromTag(`count.${name}`)
                if (countLocation)
                    this.gl.uniform1i(countLocation, entity.length)
                
                entity.forEach((subEntity, i) => {
                    let subEntityTag = tag + `${name}[${i}].`
                    this.objectToShaderLocations(subEntity, subEntityTag, returnables)
                })
            }
            else if (Array.isArray(entity) && !this.isObject(entity[0])) {
                let valuesTag = tag + `${name}`
                let location = this.locationFromTag(valuesTag)
                console.log(valuesTag, location)
                if (location) {
                    if (entity.length == 3) {
                        //vec3
                        returnables.push(function(gl) {gl.uniform3f(location, ...object[name])})
                    }
                    else if (object.length == 4) {
                        //vec4
                        returnables.push(function(gl) {gl.uniform4f(location, ...object[name])})                        
                    }
                    else {
                        //Matrix
                        returnables.push(function(gl) {gl.uniformMatrix4fv(location, false, object[name])})
                    }                    
                }
            }
            else if (typeof entity === 'number') {
                let valueTag = tag + `${name}`
                let location = this.locationFromTag(valueTag)
                console.log(valueTag, location)                                
                if (location) {
                    returnables.push(function(gl) {gl.uniform1f(location, object[name])})
                }
            }            
        }
        return returnables
    }

    makeCallableForMesh(mesh) {
        let transformationLocation = this.gl.getUniformLocation(this.shaderProgram, "transformation")
        let positionLocation = this.gl.getAttribLocation(this.shaderProgram, "position")
        let normalLocation = this.gl.getAttribLocation(this.shaderProgram, "normal")
        let isTexturedLocation = this.gl.getUniformLocation(this.shaderProgram, "isTextured")
        let textureScaleLocation = this.gl.getUniformLocation(this.shaderProgram, "textureScale")
        let samplerLocation = this.gl.getUniformLocation(this.shaderProgram, "textureSampler")
        let materialCallables = this.objectToShaderLocations(mesh.settings.material, 'material.')

        console.log("MESHY", mesh)
        if (mesh.drawable.hasOwnProperty('texture')) {
            var textureCoordinatesLocation = this.gl.getAttribLocation(this.shaderProgram, "textureCoordinates")
            var texture = this.gl.createTexture()
            let image = mesh.drawable.texture.image

            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB,
                               this.gl.UNSIGNED_BYTE, image)

            var strategy = mesh.drawable.texture.isTile ?
                this.gl.REPEAT :
                this.gl.CLAMP_TO_EDGE
            
            if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height))
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);            
        }        
        
        return function(gl) {
            let drawable = mesh.update()

            materialCallables.forEach((callable) => {
                callable(gl)
            })
            
            gl.uniformMatrix4fv(transformationLocation, false, drawable.transformation)
            
            const pointBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, drawable.vertices, gl.STATIC_DRAW)
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(positionLocation)
            
            const normalsbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normalsbuffer);
            gl.bufferData(gl.ARRAY_BUFFER, drawable.normals, gl.STATIC_DRAW);
            gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(normalLocation);

            
            if (drawable.hasOwnProperty('texture')) {
                gl.uniform1i(isTexturedLocation, 1)
                gl.uniform1f(textureScaleLocation, drawable.texture.scale)

                const textureBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, drawable.texture.textureCoordinates, gl.STATIC_DRAW);
                gl.vertexAttribPointer(textureCoordinatesLocation, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(textureCoordinatesLocation);

                
                //https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.uniform1i(samplerLocation, 0)                
            }
            else {
                gl.uniform1i(isTexturedLocation, 0)
            }

            const indexBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawable.indices, gl.STATIC_DRAW)
            
            gl.drawElements(gl.TRIANGLES, drawable.indices.length, gl.UNSIGNED_SHORT,0)            
        }
    }

    isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }    

    locationFromTag(tag) {
        return this.gl.getUniformLocation(this.shaderProgram, tag)
    }
}
