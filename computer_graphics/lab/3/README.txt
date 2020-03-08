Lewis Collum
03/07/2020


Key Map
=======

   key   mapping              
  ----------------------------
   W     up                   
   S     down                 
   A     left                 
   D     right                
   X     rotate around X axis 
   Y     rotate around Y axis 
   Z     rotate around Z axis 
   O, P  Scale along X Axis   
   K, L  Scale along Y Axis   


Transformation Amount
=====================

   Transformation  Reverse  Forward 
  ----------------------------------
   scaling            0.99     1.01 
   translating      -0.004    0.004 
   rotating          -0.05     0.05 


Transformations
===============

  1. For each key press, a derivative matrix (e.g. drift, spin, growth)
     is set by dotting the new derivative matrix with the old derivative
     matrix; by dotting them, the new derivative matrix preserves the
     transformations from the old derivative matrix.

     Example: drift = dot(newDriftTransformation, drift)

  2. On every frame, the shape.update function is called. This function
     starts by setting each parent matrix (i.e. position, rotation,
     scale) with the dot of the corresponding derivative matrix and the
     previous parent matrix.

     Example: position = dot(drift, position)

  3. The shape.update function ends by interpolating the transformations
     in the order of scaling, rotating, then positioning.
