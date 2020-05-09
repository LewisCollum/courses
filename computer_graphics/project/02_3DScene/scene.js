var scene = {}
scene['lights'] = {
    point: [
        {
            colors: {
                ambient: [0.0, 0.0, 0],
                diffuse: [0.8, 0.8, 0.7],
                specular: [.5, 0.1, 0.5]
            },
            falloff: {
                constant: 0,
                linear: 0.0009,
                quadratic: 0.005
            },
            position: [0, 10, -30]
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
                quadratic: 0.0008
            },
            position: [20, 20, 20]
        }
    ],

    directional: [
        {
            colors: {
                ambient: [0, 0, 0.0],
                diffuse: [0.1, 0.1, 0.1],
                specular: [0.1, 0.1, 0.1]
            },
            direction: [0, -1, 0]
        }
    ]
}


scene['camera'] = new Camera({
    origin: [0, 16, -200],
    lookAt: [0, 12, 0],
    up: [0, 1, 0]
})

console.log(wall)
console.log(coin)
scene['meshes'] = {
    coin: new Mesh({
        vertices: coin.vertices,
        indices: coin.indices,
        normals: coin.normals,
        scale: form.scale.all(10),
        origin: form.translate.each(0, 5, -20),
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
        indices: wall.indices,
        normals: wall.normals,
        scale: form.scale.all(10),
        origin: form.translate.each(0, 0, -10),
        orientation: form.rotate.y(Math.PI/2),
        material: {
            colors: {
                ambient: [0, 0, 0],
                diffuse: [0.8, 0.7, 0.6],
                specular: [0, 0, 0]
            },
            shininess: 0
        },
        texture: {
            image: document.getElementById('texture_stone'),
            textureCoordinates: wall.textureCoordinates,
            scale: 4
        }
    }),
    grass: new Mesh({
        vertices: grass.vertices,
        indices: grass.indices,
        normals: grass.normals,
        scale: form.scale.all(30),
        origin: form.translate.each(-14, 0, -18),
        material: {
            colors: {
                ambient: [0, 0, 0],
                diffuse: [0.8, 1.0, 0.8],
                specular: [0, 0, 0]
            },
            shininess: 1
        }
    }),
    grass2: new Mesh({
        vertices: grass.vertices,
        indices: grass.indices,
        normals: grass.normals,
        scale: form.scale.all(30),
        origin: form.translate.each(14, 0, -18),
        material: {
            colors: {
                ambient: [0, 0, 0],
                diffuse: [0.8, 1.0, 0.8],
                specular: [0, 0, 0]
            },
            shininess: 1
        }
    }),
    ground: new Mesh({
        vertices: plane.vertices,
        indices: plane.indices,
        normals: plane.normals,
        scale: form.scale.all(1000),
        origin: form.translate.each(0, 0, 0),
        texture: {
            image: document.getElementById('texture_dirt'),
            textureCoordinates: plane.textureCoordinates,
            scale: 50
        }
    })
}

scene['internal'] = {}
scene.internal['viewBox'] = {left: -1.5, right: 1.5, top: 1, bottom: -1, near: 5, far: 500}
scene['projection'] = projection.perspective.create(scene.internal.viewBox)
