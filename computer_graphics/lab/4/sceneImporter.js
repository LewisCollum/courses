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
                    console.log(valuesTag, entity)                                    
                    if (entity.length == 3) {
                        //vec3
                        console.log('vec3', ...object[name])
                        returnables.push(function(gl) {gl.uniform3f(location, ...object[name])})
                    }
                    else if (object.length == 4) {
                        //vec4
                        //console.log('vec4')                                                
                        returnables.push(function(gl) {gl.uniform4f(location, ...object[name])})                        
                    }
                    else {
                        //Matrix
                        //console.log('matrix')                        
                        returnables.push(function(gl) {gl.uniformMatrix4fv(location, false, object[name])})
                    }                    
                }
            }
            else if (typeof entity === 'number') {
                let valueTag = tag + `${name}`
                let location = this.locationFromTag(valueTag)
                if (location) {
                    console.log(valueTag, entity)
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
            gl.uniformMatrix4fv(transformationLocation, false, mesh.transformation)
            
            const pointBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, mesh.points, gl.STATIC_DRAW)

            const indexBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.faces, gl.STATIC_DRAW)
            gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(positionLocation)
            
            const normalsbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normalsbuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
            gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(normalLocation);

            gl.drawElements(gl.TRIANGLES, mesh.faces.length, gl.UNSIGNED_SHORT,0)            
        }
    }

    locationFromTag(tag) {
        return this.gl.getUniformLocation(this.shaderProgram, tag)
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
