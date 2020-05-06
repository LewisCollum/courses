var scene = {}
scene['lights'] = {
    point: [
        {
            colors: {
                ambient: [0.0, 0.0, 0],
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
                ambient: [0, 0, 0.0],
                diffuse: [0.5, 0.5, 0.4],
                specular: [0.1, 0.1, 0.1]
            },
            shininess: 30,
            direction: [0, -1, -1]
        }
    ]
}

scene['camera'] = camera.create({
    origin: [0, 10, 60],
    lookAt: [0, 0, 0],
    up: [0, 1, 0]
})


scene['meshes'] = {
    // head: mesh.create({
    //     points: getVertices(),
    //     faces: getFaces(),
    //     transformation: form.Translate.z(-0.5)
    // }),
    ground: mesh.create({
        points: radial.make2d(100),
        faces: radial.make2dIndices(100),
        transformation: matrix.multiplyAll([
            form.Translate.y(-2.5),            
            form.Scale.all(3),
            form.Rotate.x(-Math.PI/2),            
            form.Rotate.z(Math.PI/4),            
        ])
    }),
    head: mesh.create({
        points: radial.make3d(20, 20),
        faces: radial.make3dIndices(20, 20),
        transformation: form.Scale.all(1)
    })
    
}

scene['internal'] = {}
scene.internal['viewBox'] = {left: -15, right: 15, top: 15, bottom: -15, near: 50, far: 1000}
scene['projection'] = projection.orthographic.create(scene.internal.viewBox)
