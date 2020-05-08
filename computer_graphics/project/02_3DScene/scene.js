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

console.log(wall)
console.log(coin)
scene['meshes'] = {
    coin: new Mesh({
        vertices: coin.vertices,
        scale: form.scale.all(10),
        origin: form.translate.each(0, 0, -20),
        material: {
            colors: {
                ambient: [0, 0, 0],
                diffuse: [0.9, 0.9, 0.2],
                specular: [1, 1, 1]
            },
            shininess: 20
        }
    }),
    wall: new Mesh({
        vertices: wall.vertices,
        scale: form.scale.each(3, 5, 8),
        origin: form.translate.each(0, 0, -10),
        texture: {
            image: document.getElementById('texture_concrete'),
            textureCoordinates: wall.textureCoordinates
        }                    
    }),
    ground: new Mesh({
        // vertices: sphere.vertices,
        vertices: {
            values: Float32Array.from(radial.make3d(22, 50)),
            indices: Uint16Array.from(radial.make3dIndices(22, 50))
        },
        scale: form.scale.all(1),
        origin: form.translate.each(0, 0, 0),
        // texture: {
        //     image: document.getElementById('texture_concrete'),
        //     textureCoordinates: sphere.textureCoordinates
        // }
    })
}

scene['internal'] = {}
scene.internal['viewBox'] = {left: -15, right: 15, top: 15, bottom: -15, near: 25, far: 1000}
scene['projection'] = projection.perspective.create(scene.internal.viewBox)
