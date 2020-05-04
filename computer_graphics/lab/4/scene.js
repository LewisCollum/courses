var scene = {}
scene['lights'] = {
    point: [
        {
            colors: {
                ambient: [0.0, 0.0, 0.01],
                diffuse: [0.3, 0.05, 0.01],
                specular: [0.2, 0.1, 0.15]
            },
            falloff: {
                constant: 0,
                linear: 0,
                quadratic: 0.000052
            },
            shininess: 5,
            position: [20, 5, 20]
        }
    ],
    
    directional: [
        // {
        //     colors: {
        //         ambient: [0.1, 0.1, 0.0],
        //         diffuse: [0.9, 0.9, 0.6],
        //         specular: [0.4, 0.7, 0.0]
        //     },
        //     direction: [0, 0, 0]
        // }
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
        transformation: form.Translate.x(0)
    }),
}

scene['internal'] = {}
scene.internal['viewBox'] = {left: -5, right: 5, top: 5, bottom: -5, near: 50, far: 100}
scene['projection'] = projection.orthographic.create(scene.internal.viewBox)
