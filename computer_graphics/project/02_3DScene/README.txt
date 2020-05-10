Team: Lewis Collum & Justin Marcy

Project Description:
Our original idea was to generate a game in which the camera (acting as the player)
would try to avoid walls and gain points by collecting coins. However, we did
not have time to implement the game logic. Our final scene consists of a rotating
coin, a wall, two bushles of grass, and a ground.


Meshes:
Coin - uses material, many polyhedra
Grass - uses material, many polyhedra
Wall - textured, one polyhedra
Ground - textured


User Interaction:
To interact with the scene, the user can use the W,A,S,D keys to move the camera
position around. There is also a hidden side panel in the top left of the canvas
that allows the user to turn the point or directional light on/off using a mouse
click. Lastly, the user can increase the speed of the rotating coin by holding
down the space bar, and upon release, the speed will return to default.
In summary,
W - Move Camera Forward
A - Move Camera Left
S - Move Camera Back
D - Move Camera Right
SPACEBAR - Increase Coin Rotation Speed
Mouse Click on tab- Interact with lighting menu.

Viewing & Shading:
The scene is using perspective viewing and phong shading.


Lighting:
There are 2 point and 1 directional light sources implemented.
Point source 1 - can be turned on/off in the interactive light menu.
Point source 2 - sways back and forth by varying the x coordinate.
Directional - can be turned on/off in the interactive light menu.

Library Files:
PlyLoader - parses PLY files into vertices, texture coordinates, normals, and indices.
We use Blender to create/import a mesh and then export that mesh as a PLY. Once
exported from Blender, we import it to our webgl code with PlyLoader.

Scene - holds all objects in our scene, including lights, meshes, and the camera.
These objects (and their properties, e.g. "material") are recursively tied to
the shaders using SceneImporter.

SceneImporter - recursively add objects from the "scene" file. It generates a
list of callables that the "Drawer" uses to render each object in the "scene" file.

Drawer - iterates a list of callables (from the "SceneImporter") and runs each
callable, to render the scene.

Form, Matrix, Vector - files for matrix/vector operations.

FrameDispatcher - Users can add a listener to the FrameDispatcher which includes
their game/scene logic (in main.js). Users can also control the frame rate.
