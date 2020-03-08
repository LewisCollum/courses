const radial = {};
(function(context) {
    context.make2d = function(pointCount) {
        const vectorAngle = 2 * Math.PI / pointCount
        var points = []
        for (let i = 0; i < pointCount; ++i) {
            let x = Math.cos(vectorAngle * i)
            let y = Math.sin(vectorAngle * i)
            points.push([x, y, 0, 1])
        }
        return points
    }

    //TODO extract functions
    context.make3d = function(yawCount, pitchCount) {
        const stackCount = pitchCount+1
        const yawAngleStep = 2*Math.PI/yawCount
        const pitchAngleStep = Math.PI/stackCount
        var points = []

        points.push([0, 0, -1, 1])
        for (let pitchIndex = 1; pitchIndex < stackCount; ++pitchIndex) {
            let pitch = pitchIndex * pitchAngleStep - Math.PI/2
            
            for (let yawIndex = 0; yawIndex < yawCount; ++yawIndex) {
                let yaw = yawIndex * yawAngleStep
                
                let x = Math.cos(pitch) * Math.cos(yaw)
                let y = Math.cos(pitch) * Math.sin(yaw)
                let z = Math.sin(pitch)

                points.push([x, y, z, 1])
            }
        }
        points.push([0, 0, 1, 1])

        var triangulated = []
        
        //bottom
        for (let yawIndex = 0; yawIndex < yawCount; ++yawIndex) {
            let a = points[0]
            let b = points[1+yawIndex]
            let c = yawIndex == yawCount-1 ? points[1] : points[1+yawIndex+1]
            triangulated.push(a, b, c)
        }

        for (let pitchIndex = 0; pitchIndex < stackCount-2; ++pitchIndex) {
            for (let yawIndex = 0; yawIndex < yawCount; ++yawIndex) {
                var yawStart = pitchIndex*yawCount+1
                var nextYawStart = yawStart+yawCount
                let a = points[yawStart + yawIndex]
                let b = points[nextYawStart + yawIndex]
                let c = (yawIndex == yawCount-1) ? 
                    points[yawStart] :
                    points[yawStart + yawIndex+1]
                let d = (yawIndex == yawCount-1) ?
                    points[nextYawStart] :
                    points[nextYawStart + yawIndex+1]
                
                triangulated.push(a, b, c)
                triangulated.push(c, b, d)
            }
        }

        //top
        for (let yawIndex = 0; yawIndex < yawCount; ++yawIndex) {
            let last = points.length-1
            let lastYawsStart = last-yawCount
            let a = points[last]
            let b = points[last-1-yawIndex]
            let c = yawIndex == yawCount-1 ? points[last-1] : points[last-1-yawIndex-1]
            triangulated.push(a, b, c)
        }
        return triangulated
    }
})(radial);
