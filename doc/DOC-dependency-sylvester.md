---
title: Sylverster Intro
latex.features: parskip
---


# The Vector object

To import from this file, do the following.

  ```verbatim
  const {Vector,Matrix,Line,Plane} =
       require('./nitrile-preview-sylvester.js');
  const {$V,$M,$L,$P} =
       require('./nitrile-preview-sylvester.js');
  ```

The $V, $M, $L and $P are defined as follows by Sylvester and is currently being
exported as well.

  ```verbatim
  var $V = Vector.create;
  var $M = Matrix.create;
  var $L = Line.create;
  var $P = Plane.create;
  ```

The $M and $V is each a function object that can be called to return
a new vector or matrix. Following example shows how to create two
vectors.

  ```verbatim
  var V = $V( [1,1] );
  var V2 = $V( [4,2] );
  console.log(V);
  ///{ elements: [ 1, 1 ] }
  ```

Calling `$V()` is equivalent to calling `Vector.create()`.
Thus, following are the equivalent to the above.

  ```verbatim
  var V = Vector.create( [1,1] );
  var V2 = Vector.create( [4,2] );
  console.log(V);
  ```

+ this.eql() 

  This method is to compare with another matrix
  or vector with itself and return a Boolean value.

  ```verbatim
  var flag = V.eql(V2);
  console.log(flag);///returns false
  ```

+ this.toUnitVector()' 

  This method returns a new vector that is
  the unit vector of itself.

  ```verbatim
  var V3 = V.toUnitVector();
  console.log(V3);
  ///{ elements: [ 0.7071067811865475, 0.7071067811865475 ] }
  ```

+ this.angleFrom() 

  This method returns an angle between the new
  vector and itself.

  ```verbatim
  var V4 = $V( [0,4] );
  var angle = V.angleFrom(V4);
  console.log(angle/Math.PI*180);
  ///45.00000000000001
  ```

  Following are additiona examples:

  ```verbatim
  var V5 = $V( [-1,-1] );
  var flag = V.isParallelTo(V5);///false
  var flag = V.isAntiparallelTo(V5);///true
  var flag = V.isPerpendicularTo(V5);///false
  var V6 = $V( [-1,1] );
  var flag = V.isPerpendicularTo(V6);///true
  ```

+ this.add() 

  This method returns a new vector that is
  the result of adding each element of the input
  vector and itself.

  ```verbatim
  var newV = V.add(V6);
  console.log('add: newV: ',newV);
  ///add: newV:  { elements: [ 0, 2 ] }
  ```

+ this.subtract() 

  This method does the similar
  except that the operation is subtraction.

  ```verbatim
  var newV = V.subtract(V6);
  console.log('subtract: newV: ',newV);
  ///subtract: newV:  { elements: [ 2, 0 ] }
  ```

+ this.multiply() 

  This method is like multiplying
  every element with a scalar.

  ```verbatim
  newV = V.multiply(5);
  console.log('multiply: newV: ',newV);
  ///multiply: newV:  { elements: [ 5, 5 ] }
  ```

+ this.cross() 

  This method returns a new vector
  that is the result of the cross product of two
  vectors.

  ```verbatim
  var V1 = $V([1,0,0]);
  var V2 = $V([0,1,0]);
  var newV = V1.cross(V2);
  console.log('newV: ',newV);
  ///newV:  { elements: [ 0, 0, 1 ] }
  ```

+ this.distanceFrom() 

  This method returns a number
  that is the distance of a point in space to the current vector.

  ```verbatim
  var point = $V([1,0,2]);
  var dist = V1.distanceFrom(point);
  console.log('dist: ',dist);
  ///dist:  2
  ```

+ this.dup() 

  This function returns another copy of the same
  vector.

  ```verbatim
  > V.dup();
  { elements: [ 1, 1 ] }
  ```

+ this.map() 

  This method would return a new copy of the
  same vector except for that each element is transformed
  to a new value by a supplied function.

  ```verbatim
  > V.map( x=>x+2 )
  { elements: [ 3, 3 ] }
  ```

+ this.toDiagonalMatrix()

  This method returns a square matrix such that
  its diagonal elements are filled with all the elements of this
  vector.

  ```verbatim
  > V.toDiagonalMatrix()
  { elements: [ [ 1, 0 ], [ 0, 1 ] ] }
  ```
  
+ this.round() 

  This method returns a new vector such that each element
  is rouned to the integer.

  ```verbatim
  > var V6 = $V([12.1,13,1]);
  > V6
  { elements: [ 12.1, 13, 1 ] }
  > V6.round()
  { elements: [ 12, 13, 1 ] }
  ```

+ this.liesOn() 

  This method takes an argument that is a Line object, and
  'liesIn()' methods takes an argument that is a Plane object. The first
  method returns true if the vector is part of the line. The second
  method returns true if the vector is part of a plane.

+ this.rotate(angle,axis)' 

  This method
  returns a copy of the receiver rotated by angle radians about axis. If
  the receiver is a 2-vector then axis should also be a 2-vector, and
  the method returns the result of rotating the receiver about the point
  given by axis. The rotation is performed anticlockwise from the point
  of view of someone looking down on the x-y plane, so for example:

  ```verbatim
  var a = $V([10,5]);
  var b = $V([5,5]);
  var c = a.rotate(Math.PI/2, b);
  // c is the point (5,10)
  ```

If the receiver is 3-dimensional, it returns a copy of the receiver.
If it is 2-dimensional, it returns a copy of the receiver with an
additional third element, which is set to zero. For all other sizes,
it returns null. Something is similar is done in many of the methods
of the Line and Plane classes, although for performance reasons they
don’t use this method.





# The Line object

Creates a Line instance with the specified properties. anchor and
direction can each be either 2- or 3-dimensional arrays or Vectors,
and they will be stored in the Line’s properties as 3D vectors. (The
third element will be zero if a 2D vector was supplied.) direction
will be normalized before being saved. The following are all fine:

    var A = Line.create([4,8], [1,5]);
    var B = Line.create($V([4,8]), $V([1,5]));
    var C = Line.create([9,2,5], $V([8,2,0]));

For situations where x, y and z are used to refer to co-ordinates, x
corresponds to the first element of a vector, y the second and z the
third.

There are three predefined instances that are ready to be used.
They are: Line.X, Line.Y, and Line.Z. Each of them denotes
one of the axes respectively.

+ this.liesIn() 

  This method returns true if a vector lines in a line.

  ```verbatim
  > const {Matrix,Vector} = require('./nitrile-preview-sylvester.js');
  > var V = Vector.create([2,1])
  > var line1 = Line.create([0,0],[1,0.5]);
  > V.liesIn(line1)
  true
  ```

+ Line.create() 

  This method returns a new Line object. This method
  expects two arguments. Both arguments are arrays of two elements. The
  first argument expresses a point in space and the second argument
  expresses the direction of the line. Note that the line is considered
  to extend from both directions.

+ this.pointClosesTo() 

  This method returns a point on a line that is closest to
  the given point that is not on the line.

  ```verbatim
  > var line1 = Line.create([0,0],[1,0.5]);
  > var point1 = Vector.create([2,0]);
  > line1.pointClosestTo(point1);
  { elements: [ 1.5999999999999999, 0.8000000000000003, 0 ] }
  ```

+ this.contains(point) 

  This method queries and returns a Boolean value
  true if the point is part of the current line.

  ```verbatim
  > var line2 = Line.create([0,0],[2,1]);
  > line2.contains([1,0.5]);
  true
  > line2.contains([0.5,0.5]);
  false
  ```

+ this.intersectionWith() 

  This method returns a unique intersection point in
  space, if it exists.  In the following example the return value is
  null as the unique point of intersection does not exist.

  ```verbatim
  > var line1 = Line.create([0,0],[1,0.5]);
  > var line2 = Line.create([0,0],[2,1]);
  > line1.intersectionWith(line2);
  null
  ```

  In the following example the unique point is returned as it does exist.

  ```verbatim
  > var line1 = Line.create([0,0],[1,0.5]);
  > var line3 = Line.create([0,0],[1,0]);
  > line1.intersectionWith(line3);
  { elements: [ 0, 0, 0 ] }
  ```

+ this.isParallelTo() 

  This method returns a Boolean value indicative
  as to whether another line is parallel to the current line.

  ```verbatim
  > var line1 = Line.create([0,0],[1,0.5]);
  > var line3 = Line.create([0,0],[1,0]);
  > var line3 = Line.create([1,1],[2,1]);
  > line1.isParallelTo(line2)
  true
  > line1.isParallelTo(line3)
  true
  ```

+ this.reflectionIn(obj) 

  This method returns a new line that is the mirror
  image of the current line. The mirror is denoted by the 'obj'
  argument, and can be either a point (Vector), a line (Line), or a
  plane (Plane).  The following example returns a new line that is the
  mirror image off a line the X-axis.

  ```verbatim
  > var line3 = Line.create([1,1],[2,1]);
  > line3.reflectionIn(Line.X)
  {
    anchor: { elements: [ 1, -1, 0 ] },
    direction: {
      elements: [ 0.894, -0.447, 0 ]
    }
  }
  ```

+ this.rotate(angle,axis) 

  This method returns the current line around
  an axis by a given angle. The 'angle' argument expresses the angle
  which follows the right-handed rule. The 'axis' argument expresses
  a line in the 3D space. Typically 'axis' is a 3-Vector. In the
  event that it is expressed as a 2-Vector, then it is treated
  as an anchor for a 3D line whose direction is [0,0,1].
  This can be imagined as an existing line is rotated around a fixed
  point in a 2D plane.

  In the following example an existing line that is the same as the
  X-axis is rotated around a 2D point that is (5,0). The resulting line
  is a line whose anchor point is (5,0) and whose direction is (0,1,0).

  ```verbatim
  > var L = Line.X.rotate(Math.PI/2, $V([5,0]));
  > L
  {
    anchor: { elements: [ 5, -5, 0 ] },
    direction: { elements: [ 0, 1, 0 ] }
  }
  > L.eql(Line.create([5,0], [0,1]));
  true
  ```

+ this.translate(vector) 

  This method returns a new line that is the result
  of moving the line by certain offset in the 3D space.  It is
  implemented by moving the anchor point by a fixed distance given by
  the 'vector' argument. The 'vector' argument can be either a 2- or 3-
  dimensional array or Vector.  If 2-dimensional, a zero third component
  will be added.


# The Matrix

The Matrix class is designed to model real matrices in any number of
dimensions. All the elements in a matrix must be real numbers.

    Matrix.create(elements) 0.1.0

+ Matrix.create() 

  This method creates and returns a new Matrix instance
  from the array elements.  The 'elements' argument should be a nested
  array: the top level array is the rows, and each row is an array of
  elements. This means you write out a matrix in code in the same
  orientation you would on paper.

    ```verbatim
    var M = $M([
      [8,3,9],
      [2,0,7],
      [1,9,3]
    ]);
    ```

  Every row must have the same number of elements, otherwise the method
  will return null.

+ Matrix.Diagonal(elements) 

  This method returns a square matrix
  instance whose leading-diagonal elements are the values in the array
  elements, and whose off-diagonal elements are zero.

  ```verbatim
  var D = Matrix.Diagonal([4,3,7,1]);
  // D is the matrix
  //    4 0 0 0
  //    0 3 0 0
  //    0 0 7 0
  //    0 0 0 1
  ```

+ Matrix.I(n) 

  This method returns a new n×n identity matrix.

+ Matrix.Random(n,m) 

  This method returns a matrix with n rows and m
  columns, all the elements of which are random numbers between 0 and 1.

+ Matrix.Rotation(angle,axis) 

  This method can be called either with one
  argument or two arguments.  If called with only one argument, it
  returns the 2×2 matrix for an anticlockwise rotation of angle radians
  about the origin. That is, vectors are rotated anticlockwise with
  respect to the coordinate system, not the other way round.

  If called with two arguments, returns the 3×3 matrix for a
  right-handed rotation of angle radians about the axis given by the
  3-vector axis, keeping the origin fixed.

+ Matrix.RotationX(angle) 
+ Matrix.RotationY(angle)
+ Matrix.RotationZ(angle) 

  These are special versions of the more general
  'Matrix.Rotation()' method.  Each one returns a 3×3 rotation
  matrix for doing a right-handed rotation of a point in 3-dimensional
  space about the x, y and z axes respectively.

+ Matrix.Zero(n,m) 

  This method returns a matrix with n rows and m
  columns, all the elements of which are zero.

+ this.add(matrix) 

  This method returns the matrix sum of the receiver and matrix. Thus,
  'A.add(B)' is equivalent to the operation of adding matrix A and B and
  getting the result. Returns null if the matrices are of different sizes.

+ this.augment(matrix) 

  This method returns the result of augmenting
  the receiver with matrix, that is, appending matrix to the right hand
  side of the receiver. Both matrices must have the same number of rows
  for this to work.

    ```verbatim
    var M = $M([
      [8,3,0],
      [4,4,2],
      [9,1,5]
    ]).augment(Matrix.I(3));
    // M is now the matrix:
    //    8 3 0 1 0 0
    //    4 4 2 0 1 0
    //    9 1 5 0 0 1
    ```

  The 'matrix' argument can also be a Vector, as long as it has the
  samej:w number of elements as the row number of the current matrix. It
  will be appended to the receiver as an extra column on the right hand
  side.

+ this.canMultiplyFromLeft(matrix) 

  This method is used to test whether two matrix can multiply in a particular
  order. In particular, Calling 'A.canMultiplyFromLeft(B)' returns true if
  matrix multiplication of A*B is mathematically a valid expression. This is
  the case iff A has the same number of columns as B has rows. matrix can also
  be a Vector, as long as it has the same number of elements as the receiver
  has rows.

+ this.col(j) 

  This method returns the jth column of the receiver as
  a Vector.

+ this.cols()  

  This method returns the number of columns the
  receiver has.

+ this.det() 

  This method is an alias for the 'determinant()'
  instance method which is to return the determinant of a matrix.  It
  works by returning a scalar expressive of the determinant of the
  matrix if the current matrix is square. Otherwise it will return null.
  Note that if the current matrix is singular, this method returns zero,
  with no rounding errors.

+ this.diagonal() 

  This method returns a new vector whose elements
  are filled with the diagnonal elements of the current matrix.
  Otherwise, it returns null.

+ this.dimensions() 

  This method returns an object indicative
  of the dimention of the current matrix. The number of rows
  is expressed using the 'rows' property, and the number of columns of the
  current matrix is expressed as the 'cols' property.

  ```verbatim
  var dims = Matrix.Zero(4,3).dimensions();
  // dims is {rows: 4, cols: 3}
  ```

+ this.dup() 

  This method returns a duplicate of the current matrix.

+ this.e(i,j) 

  This method returns an element of the current matrix at row
  i and column j. Note that the element of first row and first column
  should be accessed as 'e(1,1)'.

+ this.indexOf(x) 

  This method should be used to search a matrix for a known value.
  The order of the search is arrange so that each row is searched completely
  before moving on to the next row. Within each row it is search from left to right.
  An object is returned indicative of the row and column of where the value
  is. Otherwise null is returned.

  ```verbatim
  var foo = $M([
    [0,9,4],
    [9,5,8],
    [1,5,3]
  ]).indexOf(9);
  // foo is {row: 1, col: 2}
  ```

+ this.inspect() 

  This method returns a string representative of the content
  of the matrix. It can be of a great tool for debugging.

  ```verbatim
  > Matrix.I(4).inspect()
  '[1, 0, 0, 0]\n[0, 1, 0, 0]\n[0, 0, 1, 0]\n[0, 0, 0, 1]'
  ```

+ this.inv() 

  This method is an alias for the 'inverse()' method, which is to
  return a new matrix that is the inverse of the current matrix.  Note
  that the return value could be null if the matrix is considered
  singular, or it is not a square matrix. In these cases the return
  value is null. The inverse is implemented using Gauss-Jordan
  elimination algorithm.

+ this.isSameSizeAs(matrix) 

  This method returns true if the current matrix
  is of the same number of rows and columns as another matrix. The 'matrix'
  argument can be expressed as a Matrix or a Vector. If a Vector,
  it must be of the same number of element as the number of rows
  of the current matrix.

+ this.isSingular() 

  This method returns a Boolean value true if the current
  matrix is a square matrix with zero determinant.

+ this.isSquare() 

  This method reuturns a Boolean value true if the current
  is a square matrix.

+ this.map(iterator) 

  This method returns a new matrix by modifying the
  elements of the current matrix using a user supplied function.  The
  user supplied function is to have its argument filled with three
  values, with the first one being the value of the element itself, and
  the second one being the row number, and the third one being the
  column number.  The row number and column number can be used to
  access the element directly by calling the 'e()' instance method.

  Following is an example of compute a new matrix whose elements
  are the squared version of the current matrix.

  ```verbatim
  var A_sq = A.map(function(x) { return x * x; });
  ```

  Following code snippet can be used to test if a particular matrix is
  symmetric. It does it by first returning a new matrix, where each
  element is either 1 or 0 depending on the fact that it is symmetric.
  The original matrix can be said to be symmetric if the new
  matrix does not have any 0's in it.

  ```verbatim
  var is_sym = (A.map(
    function(x, i, j) { return (A.e(i,j) == A.e(j,i)) ? 1 : 0; }
  ).indexOf(0) === null);
  ```

+ this.max() 

  This method returns the largest absolute value out of all
  elements of the current matrix.

+ this.minor(i,j,n,m) 

  This method returns a new matrix containing a subset of
  elements of the current matrix.  The subset of matrix starts at row i and
  column j, with a total number of n rows and m columns.

  ```verbatim
  var M = $M([
    [9,2,6,5],
    [0,1,7,4],
    [4,2,6,7],
    [1,8,5,3]
  ]);
  ```

  The following example returns a new matrix containing a subset of
  elements of the current matrix starting from row 2 and column 1, with
  a total of two rows and three columns.

  ```verbatim
  var A = M.minor(2,1,2,3);
  // 0 1 7
  // 4 2 6
  ```

  The following example returns a new matrix containing a subset of
  elements of the current matrix starting from the first row and forth
  column, with a total of three rows and three columns.

  ```verbatim
  var B = M.minor(1,4,3,3);
  // 5 9 2
  // 4 0 1
  // 7 4 2
  ```

  Notice that the reading of rows and columns from the current matrix
  will recycle. This feature can utilized to return a new matrix whose
  rows and columns are being repeated by X number of times.

  ```verbatim
  var C = M.minor(1,1,4,8);
  // 9 2 6 5 9 2 6 5
  // 0 1 7 4 0 1 7 4
  // 4 2 6 7 4 2 6 7
  // 1 8 5 3 1 8 5 3
 ```

+ this.multiply(object) 

  This method is to perform matrix multiplication.  If
  the 'object' argument is a Matrix, Then the effect of calling
  'A.multiply(B)' means matrix multiplication of A*B. If the 'object'
  argument is a Vector, then it is converted to a column matrix,
  multiplied by the receiver, and the result is returned as a Vector
  (this saves you having to call col(1) on the result). If object is a
  scalar, then the method returns a copy of the receiver with all its
  elements multiplied by object.

  This method is aliased as 'x()'.

+ this.rank() 

  This method returns the rank of the current matrix, which is
  the number of linearly independent rows/columns it contains.  The
  'rk()' method is an alias of the same method.

+ this.round() 

  This method returns a new matrix with all its elements
  rounded to the nearest integer.

+ this.row(i) 

  This method returns the ith row of the receiver as a Vector.
  Note that when calling 'row()' without any arguments, it returns an
  integer indicative of how many rows the current matrix has.

+ this.snapTo(x) 

  This method returns a copy of the receiver in which any
  elements that differ from x by less than the value of
  Sylvester.precision are set exactly equal to 'x'.

+ this.subtract(matrix) 

  This method returns a new matrix that is the result
  of subtracting matrix from the receiver. Thus, calling 'A.subtract(B)'
  is equivalent to the operation of A − B. This method returns null if
  the matrices are of different sizes.

+ this.toRightTriangular() 

  This method returns a copy of the receiver
  converted to right triangular form. The conversion is done only by
  adding multiples of rows to other rows, so the determinant (if the
  matrix is square) is unchanged. This method can be used on non-square
  matrices, which lets you use it to solve sets of simultaneous
  equations. For example: solving the system of linear equations

    ```verbatim
    3x + 2y − z = 1
    2x − 2y + 4z = −2
    −x + ½y − z = 0
    ```

  would be written as:

    ```verbatim
    var equations = $M([
      [ 3,   2, -1,  1],
      [ 2,  -2,  4, -2],
      [-1, 0.5, -1,  0]
    ]);
    ```

  You can then call this method followed by ways to obtain the solution
  of x, y and z.

    ```verbatim
    var eqns = equations.toRightTriangular();
    var sol_z = eqns.e(3,4) / eqns.e(3,3);
    var sol_y = (eqns.e(2,4) - eqns.e(2,3)*sol_z) / eqns.e(2,2);
    var sol_x = (eqns.e(1,4) - eqns.e(1,3)*sol_z - eqns.e(1,2)*sol_y) / eqns.e(1,1);
    ```

+ this.toUpperTriangular() 

  This method is an alias to 'toRightTriangular()'.

+ this.tr() 

  This method is an alias to 'trace()', which is a method to
  return the trace of a square matrice, computed as the sum of their
  leading-diagonal elements.

+ this.transpose() 

  This method returns a new matrix that is the result of
  transposing the current matrix.



# The Plane class

The Plane class is designed to model infinite flat planes in 3
dimensions.

+ Plane.create(anchor,v1,v2) 

  This method creates a new Plane instance
  with the given properties. It can be called with either two arguments
  or three arguments. If two arguments are supplied, 'v1' is considered
  the normal of the plane.  If three arguments are supplied, 'v1' and
  'v2' are considered two vectors within the plane, in which case the
  normal of the plane is computed as the cross product of v1 × v2. For
  the first case the normal of the plane is stored as the internals of
  the plane. In the second case the normal of the plane is first
  computed and then stored as the internals. In either cases the
  normal is first converted to a unit vector before being saved.

  In either case, the 'anchor' argument is any point in the plane.

+ Plane.XY 
+ Plane.XZ 
+ Plane.YX 
+ Plane.YZ 
+ Plane.ZX
+ Plane.ZY 

  They are predefined instance variables expressive of
  the planes that are: x-y, y-z and/or z-x.

+ this.contains(obj) 

  This method returns a Boolean value true if a Line or a
  Vector lies completely in the current plane. The 'obj' argument could
  be either a Line or a Vector instance.

+ this.distanceFrom(obj)

  This method is to return a number that is the
  shortest distance between the current plane and another Line, a Plane
  or a Vector.

+ this.dup() 

  This method is to return a duplicate of the current plane.

+ this.eql(plane) 

  This method is to return a Boolean value true if the
  current plane is considered the same as another plane that is passed
  as the 'plane' argument.  In particular, if the internal member of
  'plane.anchor' is a point in the current plane, and the internal
  member 'plane.normal' is parallel to the receiver’s normal, then
  this method returns true.

+ this.intersectionWith(obj)

  This method returns the unique intersection of
  the receiver with obj, which can be either a Line or a Plane. If obj
  is a Line, a Vector is returned. If obj is a Plane, a Line is
  returned. If no intersection exists, returns null.

+ this.intersects(obj) 

  This method returns true iff the receiver has a
  unique intersection with obj, which can be either a Line or a Plane.

+ this.isParallelTo(obj) 

  This method returns true if the current plane and plane
  denoted by 'obj' are considered parallel. If the 'obj' argument is a
  Plane, then the normal vectors of the two plane can point to opposite
  directions while still being considered as parallel.  If the 'obj'
  argument is a Line then its direction must be perpendicular to the
  normal of the current plane.

+ this.isPerpendicularTo(plane) 

  This method returns true if the Plane denoted by
  the 'plane' argument is perpendicular to the current plane.

+ this.pointClosestTo(point) 

  This method returns a new Vector denoting a
  point on the current plane that is considered being closest to the
  vector point denoted by the 'point' argument.

+ this.reflectionIn(obj) 

  This method returns a new Plane instance
  representing the result of reflecting (inverting) the current plane
  with respect to 'obj', which could be a Line, a Plane or a Vector.

+ this.rotate(angle,axis) 

  This method returns a new Plane instance that is
  the result of rotating the current plane by a given 'angle' in radians
  about the Line denoted by the 'axis' argument. The rotation is
  performed in a right-handed fashion about 'axis.direction'.

+ this.translate(vector) 

  This method returns a new Plan instance that is the
  result of translating the current plane by adding the content of the
  'vector' to its 'anchor' property. The 'vector' argument can be a 2-
  or 3- dimensional array or Vector.  If 2-dimensional, a zero third
  component will be added.




