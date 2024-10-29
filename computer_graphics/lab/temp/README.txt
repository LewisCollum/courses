Lewis Collum
5/9/20
Lab 4


Video
=====

  I included a video, in case the html doesn't run for some reason.


Object
======

  Easter Island Head


Shader Implementation
=====================

  I used phong shading. In the shader, lights are stored in an
  array. Most of the conceptual models (like lights, colors, etc) are
  stored in structs. The intention was to reduce the amount of
  hard-coding in the shaders.


scene.js
========

  All objects (i.e. camera, lights, meshes) are in this file and
  imported with SceneImporter.js


SceneImporter.js
================

  Recursively adds objects from scene.js to a list of callables that the
  Drawer.js uses to render the scene.
