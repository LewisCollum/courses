var scene = {}
scene['lights'] = {
    point: [
        {
            colors: {
                ambient: [0.0, 0.0, 0],
                diffuse: [0.5, 0.5, 0.4],
                specular: [.5, 0.1, 0.5]
            },
            falloff: {
                constant: 0,
                linear: 0.0009,
                quadratic: 0.0001
            },
            shininess: 30,
            position: [-20, 10, 60]
        },
        {
            colors: {
                ambient: [0.0, 0.0, 0],
                diffuse: [0.5, 0.5, 0.4],
                specular: [.5, 0.1, 0.5]
            },
            falloff: {
                constant: 0,
                linear: 0.0009,
                quadratic: 0.0001
            },
            position: [20, 10, 60]
        }
    ],

    directional: [
        {
            colors: {
                ambient: [0, 0, 0.0],
                diffuse: [0.5, 0.5, 0.4],
                specular: [0.1, 0.1, 0.1]
            },
            direction: [0, -1, -1]
        }
    ]
}

scene['camera'] = camera.create({
    origin: [0, 10, -60],
    lookAt: [0, 0, 0],
    up: [0, 1, 0]
})

scene['meshes'] = {
    coin: new Mesh({
      points: coin.vertices, //getVertices(),
      faces: coin.vertices, //getFaces(),
      scale: form.scale.all(3),
    }),
    head: new Mesh({
        points: radial.make3d(20, 20), //getVertices(),
        faces: radial.make3dIndices(20, 20), //getFaces(),
        scale: form.scale.all(3),
        material: {
            colors: {
                ambient: [0, 0, 0],
                diffuse: [0, 0.8, 1],
                specular: [0.5, 0.5, 0.5]
            },
            shininess: 100
        }
    }),
    ground: new Mesh({
        points: radial.make3d(22, 50),
        faces: radial.make3dIndices(22, 50),
        scale: form.scale.all(200),
        position: form.translate.each(0, -210, 50)
    })
}

scene['internal'] = {}
scene.internal['viewBox'] = {left: -15, right: 15, top: 15, bottom: -15, near: 25, far: 1000}
scene['projection'] = projection.orthographic.create(scene.internal.viewBox)
