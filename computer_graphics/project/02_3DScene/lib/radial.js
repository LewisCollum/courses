const radial = {};
(function(context) {
    context.make2d = function(pointCount) {
        const vectorAngle = 2 * Math.PI / pointCount
        var points = [0, 0, 0]
        for (let i = 0; i < pointCount; ++i) {
            let x = Math.cos(vectorAngle * i)
            let y = Math.sin(vectorAngle * i)
            points.push(x, y, 0)
        }
        return points
    }

    context.make2dIndices = function(pointCount) {
        let faceIndices = []
        for (let i = 0; i < pointCount; ++i) {
            if (i !== pointCount-1)
                faceIndices.push(0, i+1, i+2)
            else
                faceIndices.push(0, i+1, 1)
        }
        return faceIndices
    }

    //TODO extract functions
    context.make3d = function(yawCount, pitchCount) {
        const stackCount = pitchCount+1
        const yawAngleStep = 2*Math.PI/yawCount
        const pitchAngleStep = Math.PI/stackCount
        var points = []

        points.push(0, 0, -1)
        for (let pitchIndex = 1; pitchIndex < stackCount; ++pitchIndex) {
            let pitch = pitchIndex * pitchAngleStep - Math.PI/2
            
            for (let yawIndex = 0; yawIndex < yawCount; ++yawIndex) {
                let yaw = yawIndex * yawAngleStep
                
                let x = Math.cos(pitch) * Math.cos(yaw)
                let y = Math.cos(pitch) * Math.sin(yaw)
                let z = Math.sin(pitch)

                points.push(x, y, z)
            }
        }
        points.push(0, 0, 1)
        return points
    }

    context.make3dIndices = function(yawCount, pitchCount) {
        let indices = []

        //top
        for (let i = 0; i < yawCount; ++i) {
            if (i !== yawCount-1) indices.push(0, i+2, i+1)
            else indices.push(0, 1, i+1)
        }

        for (let j = 0; j < pitchCount-1; ++j) {
            let top = j*yawCount+1
            let bottom = (j+1)*yawCount+1
            
            for (let i = 0; i < yawCount; ++i) {
                if (i !== yawCount-1) {
                    indices.push(top+i, top+i+1, bottom+i)
                    indices.push(bottom+i, top+i+1, bottom+i+1)
                }
                else {
                    indices.push(top+i, top, bottom+i)
                    indices.push(bottom+i, top, bottom)                    
                }
            }
        }

        let top = (pitchCount-1)*yawCount+1
        let bottom = pitchCount*yawCount+1
        for (let i = 0; i < yawCount; ++i) {
            if (i !== yawCount-1) indices.push(top+i, top+i+1, bottom)
            else indices.push(top+i, top, bottom)
        }
        return indices
    }
})(radial);
