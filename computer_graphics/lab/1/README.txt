                             ______________

                                 LAB 1

                              Lewis Collum
                             ______________


                               2020-02-06





Foundation for Making Regular Polygons
======================================

Adaptation from OpenScad
~~~~~~~~~~~~~~~~~~~~~~~~

  I adapted a method for making regular polygons from the language
  OpenScad (which is used to create 3D CAD models). In OpenScad, circles
  are defined with a radius and a number of fragments, basically. By
  changing the number of fragments of a circle in OpenScad, the circle
  can actually appear to be a triangle, square, pentagon, etc. My class
  'Radial' is the adaptation of OpenScad's circle.


Defining Each Point for a Regular Polygon
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  The 'Radial' class takes in the number of points it needs to create
  the shape. For a triangle (with the class type 'Radial'), the number
  of points is 3. Points are defined by rotating a vector by 2*pi /
  pointCount.


Craftsmanship
=============

Decorators to Separate Class Responsibilities
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  Instead of having behavior for drawing, scaling, translating in the
  'Radial' class, I seperated each unique behavior into a Decorator
  class. For example, a 'Drawer' "decorates" an object of the 'Radial'
  class type to add (or remove) behavior to the object dynamically. This
  also makes it easier to add new Decorator types in the future.


All Together
~~~~~~~~~~~~

  1. define an empty object literal (e.g. const A = {})
  2. define the base (A.base = <Radial Object>)
  3. Add decorators (A.drawer = <Drawer Object>)
