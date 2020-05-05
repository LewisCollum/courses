var scene = {}
scene['lights'] = {
    point: [
        {
            colors: {
                ambient: [0.0, 0.0, 0.01],
                diffuse: [0.8, 0.4, 0.2],
                specular: [.5, 0.1, 0.5]
            },
            falloff: {
                constant: 0,
                linear: 0.0009,
                quadratic: 0.0001
            },
            shininess: 30,
            position: [0, 20, 5]
        }
    ],
    
    directional: [
        {
            colors: {
                ambient: [0.1, 0.1, 0.0],
                diffuse: [0.5, 0.5, 0.4],
                specular: [0.1, 0.1, 0.1]
            },
            direction: [0, -1, 0]
        }
    ]
}

scene['camera'] = camera.create({
    origin: [0, 20, 60],
    lookAt: [0, 0, 0],
    up: [0, 1, 0]
})


scene['meshes'] = {
    head: mesh.create({
        points: getVertices(),
        faces: getFaces(),
        transformation: form.Translate.z(-0.5)
    }),
    ground: mesh.create({
        points: radial.make2d(100),
        faces: radial.make2dIndices(100),
        transformation: matrix.multiplyAll([
            form.Translate.y(-2.5),            
            form.Scale.all(3),
            form.Rotate.x(-Math.PI/2),            
            form.Rotate.z(Math.PI/4),            
        ])
    })      
}

scene['internal'] = {}
scene.internal['viewBox'] = {left: -5, right: 5, top: 5, bottom: -5, near: 50, far: 100}
scene['projection'] = projection.orthographic.create(scene.internal.viewBox)
