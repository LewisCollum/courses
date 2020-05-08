class Mesh {
    constructor(settings) {
        this.settings = settings
        this.setDefaults()
        this.setDrawable()
    }

    setDefaults() {
        this.settings.transformation = matrix.Identity(4)
        if (!this.settings.hasOwnProperty('position'))
            this.settings.position = matrix.Identity(4)
        if (!this.settings.hasOwnProperty('scale'))
            this.settings.scale = matrix.Identity(4)
        if (!this.settings.hasOwnProperty('rotation'))
            this.settings.rotation = matrix.Identity(4)
        if (!this.settings.hasOwnProperty('material'))
            this.settings.material = {
                colors: {
                    ambient: [0, 0, 0],
                    diffuse: [1, 1, 1],
                    specular: [0, 0, 0]
                },
                shininess: 1
            }
    }

    setDrawable() {
        let flattenedFaces = Uint16Array.from(this.settings.faces.flat())
        let faceNormals = getFaceNormals(this.settings.points, flattenedFaces)

        this.drawable = {
            points: Float32Array.from(this.settings.points.flat()),
            faces: flattenedFaces,
            normals: Float32Array.from(getVertexNormals(this.settings.points, flattenedFaces, faceNormals).flat()),
            transformation: Float32Array.from(matrix.transpose(this.settings.transformation).flat())
        }
    }

    set position(matrix) {
        this.settings.position = matrix
    }

    set rotation(matrix) {
        this.settings.rotation = matrix
    }

    set scale(matrix) {
        this.settings.scale = matrix
    }

    transform(matrix) {
        this.settings.transformation = matrix
    }

    update() {
        this.settings.transformation = matrix.multiplyAll([this.settings.position, this.settings.scale, this.settings.rotation])
        this.drawable.transformation = Float32Array.from(matrix.transpose(this.settings.transformation).flat())
        return this.drawable
    }

    static flipNormals(normals) {
        let copy = Array.from(normals)
        for (let i = 0; i < copy.length; i+=3) {
            copy[i+1] += copy[i+2]
            copy[i+2] = copy[i+1] - copy[i+2]
            copy[i+1] = copy[i+1] - copy[i+2]        
        }
        return copy
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