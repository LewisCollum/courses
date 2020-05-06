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
        
        return function(gl) {
            let drawable = mesh.update()
            gl.uniformMatrix4fv(transformationLocation, false, drawable.transformation)
            
            const pointBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, drawable.points, gl.STATIC_DRAW)

            const indexBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawable.faces, gl.STATIC_DRAW)
            gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(positionLocation)
            
            const normalsbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normalsbuffer);
            gl.bufferData(gl.ARRAY_BUFFER, drawable.normals, gl.STATIC_DRAW);
            gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(normalLocation);

            gl.drawElements(gl.TRIANGLES, drawable.faces.length, gl.UNSIGNED_SHORT,0)            
        }
    }

    locationFromTag(tag) {
        return this.gl.getUniformLocation(this.shaderProgram, tag)
    }
}
