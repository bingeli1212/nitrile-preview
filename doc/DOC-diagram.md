---
title: The Diagram
latex.features: parskip
latex.cjk: 1
---

A diagram block is to generate a diagram with vector based figures, made up with vector based components as lines, circles, rectangles, arrows, dots, etc. The goal of using a diagram block versus using an raster based image such as PNG or JPEG is that a vector based diagram provides much better resolution especially when the diagram is printed on a piece of paper.


# Using MetaPost with LuaLatex

A diagram block is to be translated into an inline MetaPost block
between ``\begin{mplibcode}`` and ``\end{mplibcode}``. This environment is
supported by the ``luamplib`` LATEX package.

    \usepackage{luamplib}


# Using MetaFun with ConTeXt 

For CONTEX the MetaPost is called MetaFun, which is a variant that is
based on MetaPost by has been modified by Hans Hagen. The syntax of
MetaFun and MetaPost are mostly compatible, but there are differences.
One different is that MetaFun supports transparent colors, while
MetePost does not. In TexLive2020 distribution the 'label' command for
MetaFun requires quotation marks rather than btex and etex for its
first argument.

    \startMPcode
    ...
    \stopMPcode


# The SVG translation

A diagram will be converted to an embedded SVG for a HTML translation.
It is then converted to a DATA URI for a img-element.

    <img alt="diagram" src="data:img/svg+xml;charset=UTF-8,${encodeURIComponent(text)}" />
    
Note that the quotation-mark must be used to wrap the 'src' attribute
values because apostrophy (single-quote) is a valid coded character
returned by the 'encodeURIComponent()' function.



# An example diagram

Following is an example of a diagram block.

    viewport 32 20

    % variables
    path a = (1,1) -- (5,5) -- (5,1) -- (1,1) ()
    path b = (1,1) .. (5,5) .. (5,1) .. (1,1) ()

    % draw
    draw  *a
    draw  *b

    % circles

    set fillcolor pink
    circle        {r:1} (16,1)
    circle.pie    {r:1, a1:0, a2:135} (20,1)
    circle.chord  {r:1, a1:0, a2:135} (20,3)
    circle.arc    {r:1, a1:0, a2:135} (20,5)
    circle.cseg   {r:1, a1:0, a2:135} (20,7)

    % dot
    path sq = (22,3) (23,3) (23,2) (22,2)
    dot (22,1)
    dot *sq (22,4) (23,4)
    dot.hbar  (23,1) (24,1)
    dot.vbar  (25,1) (26,1)
    dot   (1,1) \
          (2,2) (3,3) \
          (4,4) (5,5)

    % 90-degree angle
    draw     (28,4)--(31,4)
    path [a,b] = *
    draw     (28,4)--(28,7)
    path [,c] = *
    drawanglearc.sq *b *a *c

    % 45-degree angle
    draw     <0,-4> (28,4)--(31,4)
    path [a,b] = *
    draw     <0,-4> (28,4)--(31,7)
    path [,c] = *
    drawanglearc *b *a *c

    % draw     will fill
    path ff = (28,8)--(31,8)--(31,9)--(28,9)--cycle
    draw {linesize:2,fillcolor:orange}  *ff
    reset

    % label
    label.rt  "C_0" (5,5)
    label.rt  "B_0" (5,1)
    label.top "A_0" (1,1)

    % arrow & dblarrow
    drawarrow (7,3) (9,5)
    drawdblarrow (9,3) (11,5)
    drawrevarrow (11,3) (13,5)

    % text of a different fontsize
    label.ctr " 簡単 Triangle " (10,1)

    % math
    label.ctr \(\sqrt{2}\) (18,18)

    %% shapes
    shape.trapezoid (2,11)
    shape.rhombus (5,11)
    shape.rect (8,11)
    shape.parallelgram (11,11)
    shape.apple (15,11)
    shape.basket (17,11)
    shape.crate (21,11)
    shape.rrect (26,11)
    shape.protractor (10,15)
    shape.updnprotractor (10,15)
    shape.radical (1,17)



# Unit length and grid lines

In Diagram, each figure is always expresses using the grid unit
length. A unit unit length is considered as a distance between two
adjacent grid lines on a graphing paper for which a length of 1
corresponds to the width of a single grid.

In Diagram a grid is drawn as the background by default. The size of
the grid is 25 grid units length long in the horizontal direction and
10 grid unit length long in the vertical directon. You can change that
by using the 'config' command.

    config width 30
    config height 20

Each grid is by default 5mm in length, thus, a total of 25 grid units
in horizontal direction will generate an image of 125mm in width, and
10 grid units of horizontal direction will put the image in the height
of 50mm. To set the unit to a different length, call the 'config unit'
command below.

    config unit 6

The 'config grid' command can be used to change how background grid
lines are to be shown in the final Diagram image. By default, each
grid is to be show with a grid line that is colored at 10% black. The
color is currently not configurable. When set the grid to 'boxed',
only the outline of the image is drawn, and when set to 'none', there
is even no outline.

    config grid boxed
    config grid none

However, for MetaPost and MetaFun generation when the grid is set to
'none' the outline is actually drawn using a "white" color pixel. This
is because the image that is generated are automatically expanded
whenever there is contents drawn on that image. Thus, without
performing the draw of the outline does not guarentee that the size of
the image will be the size we want. However, for MetaFun and MetaPost
generation the image will be "enlarged" if contents were drawn outside
of the outline.


# The config command

The config command can be used to control the configuration parameters
for the entire Diagram. This set includes the previous discussed
viewport width and height, and the unit.

However, there are additional configuration parameters. These
parameters should be set at the beginning of the Diagram, before any
drawing commands, in order to maintain consistencies. Changing these
configuration parameters in the middle of other drawing commands are
not recommended and may result in distorted picture.

+ config grid <string> 

  Set to a string expressing how the background grid lines are
  to be drawn. The valid values are "boxed", "grid", or "none". 
  The default value is an empty string, in which case it is
  the same as "grid".

+ config barlength <number>
  The default length of the bar (grid unit). The default value
  is 0.50. 

+ config fontsize <number>

  The default font size (pt) for all generated text inside this diagram.
  The default value is 12.

+ config dotsize <number>
  The default size of dot (pt) for a dot-operation. The default value
  is 5.

+ config linesize <number>

  The default size for line drawing (pt), 
  when 0 is set it uses the default line size. The default
  value is 0.

+ config fillcolor <color>

  The default color for filling an enclosed area.
  The default value is an empty string, which would have
  implied an default color. This is often to mean "black", but
  it could be different for SVG.
  It should be a string
  of 19 valid color names, such
  as "black", "pink", "steel", etc., or a
  3-digit HEX such as "#888", or a 6-digit HEX such as "#F8F8F8",
  or a HWB color such as '&HWB!0!0.2!0'.

+ config linecolor <color>

  This is the default color for stroking path or drawing a line,
  a bezier curve, or an arrow.

+ config dotcolor <color>

  This sets the default color when coloring a dot during 
  a dot-operation.          

+ config opacity <number>

  This sets the opacity of the filled color. The number must be
  between 0 and 1, where 1 is the full opacity and 0 is the full
  transparency.

+ config dotsize <number>

  This sets the default size for the dot during a dot-operation.

+ config fontcolor <color>

  This sets the default text color for any operation involving generating a text and/or label.

+ config r <number>

  This is the radius for a circle- and/or node-operation. The default
  value is 1.

+ config w <number>

  This is the width for a rectangle- or box-operation.
  The default value is 1.

+ config h <number>

  This is the height for a rectangle- or box-operation. 
  The default value is 1.

+ config answer 1

  Set it to one to show the answer. This would only have
  effect for commands that would optionally show
  answers as part of its operation, such as multiws-operation
  and longdivws-operation.

+ config answercolor <color>

  This is the color used for showing all texts, lines that are
  part of a "answer". This would be effective only for operations
  that has an "answer" option, such as multiws-operation and
  longdivws-operation. 

+ config showname 1

  Set it to "1" to allow for names to show through. This would
  only have effect on the node-operation at the current 
  to allow for a named node to show its name in the center
  when text is absent. The default is 0.   

+ config angle <number>

  Sets the angle which is a number between 0 and 90. This property
  is only applicable in conjunction with the 'shade' property
  to turn the filled color in a shade. 

+ config shade <string>

  Sets the type of the shade to use instead of a solid filled color.
  
+ config linedashed 1

  When set to 1 a dashed line will be drawn instead of a solid one.

+ config shadecolor <color> ...

  Sets one or more colors for the shade. The colors can be one, two or 
  three depending on the type of shade.
  The color must appear
  one after another separated by one or more empty spaces.

+ config linecap <string>

  This sets the type of the linecap. The valid values are:
  'butt', 'round', and 'square'.

+ config linejoin <string>

  This sets the type of the linejoin. The valid values are:
  'miter', 'round', and 'bevel'.

+ config nodeid <int>

  The 'nodeid' configuration parameter should be used for setting the default node id
  for the next node if no name is given. This parameter should always be set to
  an integer greater than 0. It will be automatically increased by 1 after that name
  is being assigned to a newly created node.

+ config span <number>

  The 'span' configuration parameter expresses the number of degrees that covers
  an range of degrees. It is currently used by the 'edge' command when it is to 
  draw a loop edge. 

+ config protrude <number> 

  The 'protrude' configuration parameter specifies a length that goes beyond the
  surface. It is currently being used by 'edge' command to set the length of the 
  looped edge beyond the node surface. 

+ config abr <number>
 
  The 'abr' configuration parameter specifies the aberration from the norm.
  It is a number that is the number of degrees. 
  It is currently being used by the 'edge' command to turn a straight line 
  into a Bezier curve, in which case this number represents an angle that
  is aberration from the straight line.

+ config shift <number>

  The 'shift' configuration parameter specifies the distance in grid unit.
  It is currently used by the 'edge' command to shift the label away
  from the center of the edge.

+ config dx <number>

  The 'dx' and 'dy' parameters are used to allow for fine turning the
  label and text. This includes all label and text related options
  such as label-operation, text-operation, cartesian-xtick-option,
  cartesian-ytick-operation, cartesian-label-operation, etc.

+ config dy <number>

  See 'dx'.

+ config sx <number> 

  The 'sx' and 'sy' parameters are used by the draw-operation,
  fill-operation, stroke-operation, arrow-operation,
  revarrow-operation, and dblarrow-operation when a path is provided
  as an option. In this case, these two parameters will "shrink" or
  "expand" the path in either the x-direction and/or y-direction.

+ config sy <number>

  See 'sx'. 

+ config dot 1
 
  The 'dot' parameter is used to set it so that the drawing will be shown
  as a dot. It is currently being used by the node-operation to draw the current
  node as a dot rather than a circle, in which case the 'dotsize' parameter
  is used to determine the dot size.

+ config xstep <number>

  The xstep-option is used currently by the cartesian-grid-operation to
  set the separation of each grid line in the x-direction. 

+ config ystep <number>

  The ystep-option is used currently by the cartesian-grid-operation to
  set the separation of each grid line in the y-direction.

+ config boxtype <string>

  The boxtype-option sets the type of box for the box-operation. Currently the 
  only available values are 'none', 'rect', 'hexgon', and 'triangle'. If the type string
  is unrecognized it is assumed to be 'rect', which is the default type.

+ config bartype <string>

  The bartype-option can be sets to indicate what bar it is to draw. It is currently 
  used by the drawlinesegcong-operation.

+ config gap <number>

  The gap-option sets the length in grid unit that indicates the gap. It is currently
  used by the drawlinesegcong-operation when it needs to determine the gap between the bars
  when it is instructed to draw double-bar or triple-bar. If not set it defaults to 0.15.
  


# The set-operation

The 'set' command sets the following parameters for the current
drawing environment.

+ set refx <number>

  Sets the x-coordinate origin for all future path points. For example, 
  if 'refx' is set to 10, then a path point of (0,0) will
  be mapped to (10,0).

+ set refy <number>

  Set the y-coordinate original for all future path points. For
  example, if 'refy' is set to 10, then a path point of (0,0)
  will be mapped to (0,10).

+ set refsx <number>

  Sets the scaling factor for scaling each path point
  in the future in the x-coordinate direction. For instance,
  if 'refsx' is set to 2 then a path point of (1,1) will be
  mapped to (2,1). 

+ set refsy <number>

  Sets the scaling factor for scaling each path point
  in the future in the y-coordinate direction. For instance,
  if 'refsy' is set to 2 then a path point of (1,1) will be
  mapped to (2,1).

+ set refs <number>

  A shortcut for setting 'refsx' and 'refsy' at the same
  time to the same value.

+ set refxy <string> ...

  When the key is "refxy", expects a list of string arguments. 
  The argument must be in one of the following formats: 
  "origin", "center", 
  "west", "east", "north", "south",
  "northwest", "northeast", "southwest", "southeast",
  "left:<x>", "right:<x>", "up:<y>", 
  "down:<y>", "x:<x>", or "y:<y>", where <x> and <y> each
  express a floating point number. It could also be a 
  "save:<string>" and "load:<string>" where <string> expresses
  a string. 

The 'refx', 'refy', and 'refs' parameters can be set at any point
during a drawing. It can be compared to a "transform" of a SVG
operation. In this case, all drawings will be scaled and/or
translated. 

The 'refs' defines the scaling factor and 'refx' and
'refy' defines the location to be translated to.

By default all drawings are expressed as relative to the origin, which
is (0,0), which is located at the lower-left-hand corner of the
viewport. By setting it to a different value, it allows you to treat
several drawings as a group and then move them all at once at ease.

Note that when callign the 'set' command with a parameter, but without
supplying any additional values reset that parameter to its default
value. Thus, the second 'set' command below will reset the 'refx'
parameter to its default value, which is 0.

    set refx 10
    set refx

The scaling always happens first before the translation. 

For 'refxy', it is possible to apply two or more options 
at the same time. For instance, following operation would
first move the reference point to the center, and then
one unit up. 

    set refxy center up:1

The "up/down" operation moves the current reference point
up and down, and "left/right" operation moves the current
reference point to the left or right. It is also possible
to move to a specific x-coordinate or y-coordinate using
the "x" and "y" operation.  In the following example
the reference point is moved to (12,10).

    set refxy x:12 y:10

The "save" and "load" allows the current settings of refx, refy,
refsx, and refsy to be saved to a buffer, and be restored at a later
time.

    set refxy save:a
    set refxy load:a

Note that the name of the buffer is independent of the buffer name 
used to save a diagram.



# The reset-operation

The reset-operation is done by the 'reset' command itself but a single
line without additional arguments after it. It is a shorthand for
setting 'refx' and 'refy' to 0 and 'refsx' and 'refsy' to 1

    reset

# The path-operation

The 'path' command can be used to create path variables. A path
variable must start with a upper case or lower case letters, and
followed by one or more upper case or lower case letters, or digits.
Symbols and operators are not allowed.

    path a = (1,1) -- (2,2) -- (3,4)

To reference all points in a path variable, use the at-sign followed
by the variable name. This notation serves to connect the last point
to the first of the new path variable. If additional points are
specified, they will be connected to the last point of the previous
path.

    draw &a
    draw &a -- (5,5)
    draw (0,0) -- &a -- (5,5)

Typically, a path expression consists of one or more coordinates
(points), and join types. A join type can only be '--' or '..'. The
'--' join type is to express a 'lineto' operation between the last
point and the next point. A '..' join type is to express a 'curveto'
operation between the last point and the next point. A point should
always be expressed between a set of parentheses, such as ``(1,1)``,
``(2,2)``, ``(3,4)``, etc.

However, Diagram also has something called 'path function'. It's main
purpose is to create new a new path based on points of existing path
variables. In the following example a new path variable 'c' is created
and is assigned the first point of the path 'a'.

    path c = &midpoint{&a,0}

The path command also has provision to allow for something akin to
JavaScript "array destructuring" statement, in which case individual
points of a path are assigned to different path variables at the same
time by the same assignment instruction. In the following assignment
instruction path variables 'a', 'b' and 'c' are each created and
assigned three different points of the same path that was drawn by the
``draw`` statement.

    path A = (1,1) (2,2) (3,4) (4,5)
    path [a,b,c] = &A

Each sub-variable must be separated from other sub-variables by one or
more slash character. You can skip ahead and bypass certain points by
not including any variables in between slashes. For example, you can
choose to assign the first point to variable 'a' and the third point
to variable 'b' as follows.

    path A = (1,1) (2,2) (3,4) (4,5)
    path [a,,b] = &A

Note that the last variable gets all remaining points. This, variable
'b' will get the last two points, which are (3,4) and (4,5). However,
you can choose to allow only a single point to be assigned to the last
variable by including an additional slash after this variable.

    path A = (1,1) (2,2) (3,4) (4,5)
    path [a,,b,] = &A

Similarly you can also add slashes at the beginning to skip first few
points. Following example will skip the first two points and assign
the remaining two points to variable 'a'.

    path A = (1,1) (2,2) (3,4) (4,5)
    path [,,a] = &A

Following is an example of drawing dots.

    path p = (1,2) (2,3) (3,4)
    path p = (5,6) (7,8)
    dot &p1 &p2 (9,9)

For a given path variable access to individual points or a selected
few descrete range of points can also be done by the combination of
brackets, commas, and hyphen.

    path p = (1,2) (1,3) (3,4) (4,5) (5,6) (6,7)
    dot &p[0]
    dot &p[0-1]
    dot &p[0-2]
    dot &p[0,1,2]
    dot &p[0,1,2,4-5]


# The draw/fill/stroke-operations

Following commands treats the input argument as path.

~~~list
- draw
- fill
- stroke
- arrow
- revarrow
- dblarrow
~~~

The 'draw' command would draw connecting lines between path points.
Typically it is straight lines, but Bezier curves are also supported.
This includes quadratic and cubic curves. The SVG arc is also
supported.

    draw (0,0) -- (1,1) (2,2)

The 'fill' command is similar to 'draw', except that it fills the path
with the default filled color, without drawing the the outline of the
path (without stroking it).

The double-hyphen operator between points indicates that it should be
a straight line between two points. However, it is assumed if two
points are detected without a connecting double-hyphen between, such
as the case of the second and third point above. The points are
typically expressed as absolute points, but relative points can also
be expressed. They are all in the form of [...] where a set of
brackets are present.

    draw (0,0) [l:1,1] [l:1,1]

Here the second and third points are each expressed as a distance away
from its previous point, which is to move right for one grid unit and
then up for one unit. Note that the coordinates in Diagram are always
expressed in terms of grid unit. There are other relative position
syntaxes, that are shown below.

Path expression can also include "offsets". An offset is expressed as

    <x,y>
    
The presence of an offset will not cause a real points to be inserted
into the path. Rather, it serves to provide an "offset" such that all
future points will be computed as relative to this offset. For
example, let's suppose we have the following two draw line program.

    draw (10,0) (15,0)
    draw (10,0) (10,5)

However, by using "offsets" we can rewrite them as follows.

    draw <10,0> (0,0) (5,0)
    draw <10,0> (0,0) (0,5)

Here, <10,0> are considered an offset. An offset <10,0> is to set it
so that the all future points will be considered an offset to the
point that is (10,0). Thus, the point of (0,0) is considered as
(10,0), and (5,0) is considered (15,0). The offset always appears
between a set of angle brackets. The first number is the offset in the
horizontal direction, and the second one in vertical direction.

The offset is only going to be valid for the current path, and it only
takes affect after it is encountered, and will only affect the points
that follow it. Thus, if you have placed an offset in the middle of
two points, such as the following, then the first point is to be
considered as (0,0) while the second one as (15,0).

    draw (0,0) <10,0> (5,0)

Offsets are also accumulative. Thus, if there are two offsets one
appear after another then the second offset is considered to be offset
to the first. This allows you to construct more points simply by
moving offsets. For example, you can construct a path with four points
(11,0), (12,0), (13,0) and (14,0) as follows.

    draw <11,0> (0,0) <1,0> (0,0) <1,0> (0,0) <1,0> (0,0)

The keyword 'cycle' denotes a special point such that the path is to
be closed and the last point should be connected to the first point
using a straight line. Note that a 'cycle' is not a physical point. It
should be considered a meta data and a notational trick that expresses
the afformentioned intent. This notation is usually a special syntax
placed at the end of the long list of points. For SVG it is the 'z',
and for MetaPost/MetaFun it is the 'cycle'.

    draw (0,0) (1,2) (3,4) cycle

Note that for all 'draw' related commands, a path can be expressed
such that it contains multiple disjoint segments. For example, we can
express to draw two disjoint line in a single 'draw' command such that
the first line segment goes from (0,0) to (2,3) and the second line
segment goes from (4,5) to (6,7). To do that, place a null point
between the the (2,3) and (4,5).

    draw (0,0) (2,3) () (4,5) (6,7)

A null point is a point that is expressed a '()'. In addition, any
appearances In this case, Diagram recognizes that there is going to be
two path segments, one consisting of all points before the null point
and the other consisting of all points after the null point.

In additional, if the 'cycle' keyword appears then it also means the
end of the current path segment and the start of a new one. In this
case no null point needs to be specified. In the following example two
path segment is to e created, with one consisting of a triangle, and
another one a line.

    draw (0,0) (2,0) (2,2) cycle (4,0) (6,2)

For MetaPost output, each path segment requires a separate "draw"
command. For SVG, a single PATH elements is sufficient; the SVG is
implemented such that a "M" operation can follow a "z". However, in
our implementation each seprate path segment is still to be placed
inside a separate PATH element. This is specifically designed so that
those path segments that are not "closed" will not be attempted to do
a "fill" operation.

By default, the 'draw' command would stroke the path. However, if the
'fillcolor' attribute is set, then it would also fill the area
enclosed by the path. However, it does so only when the path is deemed
"closed", in which case a 'cycle' keyword must follow the last point.
If the path is not closed, it will not be filled, even when
'fillcolor' is specified.

For SVG, when a 'fill=' attribute is specified the rendering engine
will attempt to fill the area, even when the area is not closed. For
MetaPost/MetaFun the path will have to be closed before calling the
'fill' MetaPost, as otherwise the compilation will complain.

# The drawcontrolpoint-operation

The 'drawcontrolpoint' is a special command that draws all the control
points detected in a given path. The control points are those present
in a path specification that are necessary to describe a Bezier curve,
whether it is cubic or quadratic.

# The drawanglearc-operation

The 'drawanglearc' is designed to draw a small arc describing the span
of an angle. The path that is given to this command is expected to
describe the angle, where the first/second/third path would have
formed the first angle where the second point serves as the vertex of
the angle, and each of the first and third point denotes a point on
either side of the angle. There should be at least three points on the
path, but if there are additional points, then each consecutive three
points will be used to describe an angle for the arc to draw. Thus, if
there had been four points in the path, then the first three points
describes the first angle, and the last three points describes the
second angle.

The 'drawanglearc' can also place text next to the angle arc to show
the name of an angle.

    path points = (0,6) (2,4) (4,6) (6,4) (8,6)
    draw &points
    drawanglearc "1\\2\\3" &points

# The drawlinesegcong-operation

This operation is to draw a short bar to indicate the congrudencies
of two or more line segments. Each coordinates is to be assumed as
the end points of line segments.

    drawlinesegcong (0,0) (1,1) (2,2) ...

The length of the short bar is determined by the barlength-option,
which defaults to "0.5" if not set. The bartype-option will also be checked
to see if it has been set. It can be set to 'double' to indicate a double bar, 
or 'triple' to indicate a triple bar. The gap between the bar lines are determined
by the gap-option, which defaults to 0.1 unit length.





# Expressing relative points of a path

Each of the following syntax denotes a relative point.

+ [l:dx,dy] 

 This to draw a line from the current point to the new location is
 relative to the current point by dx and dy. Note that dx and dy are
 specified in Cartesian coordinates, thus positive dx is towards the
 right, and positive dy is towards the top.

+ [h:dx]

	This is to draw a horizontal line.
  
+ [v:dy] 

	This is to draw a vertical line.

+ [a:rx,ry,angle,bigarcflag,sweepflag,dx,dy] 

  This is to draw an arc to the end point that is dx/dy away from the
  current point. The arc is assumed to trace alone an elliptical arc
  with x-axis and y-axis each of which having a radius of 'rx' and
  'ry'. The angle is in the unit of degrees, specifying the rotation
  of the ellipse if any, with a positive number denoting a
  counter-clockwise rotation. The 'bigarcflag' is set to 1 if the arc
  to be drawn are the longer of the two between the starting point and
  end point. Otherwise the shorter arc is to be drawn. The 'sweepflag'
  expresses whether the arc is to travel counterclockwise or clockwise
  from the current point to the new point; the value 0 is for a
  anti-clockwise rotation and the value 1 is for a clockwise rotation.
  Thus, to draw an arc from the last point to a new point that is on
  its right hand side of the last point, and if the sweepflag is set
  to 0, then the arc will always appear below both points.

+ The [c:dx1,dy1,dx2,dy2,dx,dy] 

  This is to draw a cubic Bezier curve from the current point to the
  new point that is dx/dy away. The (dx1,dy1), and (dx2,dy2) are two
  control points. Note that all numbers are specified relative to the
  last point.

+ [s:dx2,dy2,dx,dy] 

  This is to draw a cubic Bezier curve from the current point to the
  new point that is dx/dy away. Only the second point of the current
  Bezier curve needs to be provided. The first control point is
  deduced from the second control point of the previous cubic Bezier
  curve operation. If the previous operation is not a cubic Bezier
  curve drawing, but a quadratic Bezier curve drawing, then the first
  control point of the quadratic curve is used to deduce the first
  control point of the current operation. If it is neither a cubic nor
  a quadrilatic, then the last point is assumed.

+ The [q:dx1,dy1,dx,dy] 
	
  This is to draw a quadrilatic Bezier curve. The dx1/dy1 is the only
  control point. The dx/dy is the new point. All positions are
  expressed relative to the last point.

+ The [t:dx,dy] 

  This is to draw a quadratic Bezier curve with the first control
  point deduced from a previous Bezier curve operation. If a previous
  operation is not a Bezier curve operation, then the last point is
  assumed to be control point, in which case the drawn curve will be
  straight line.

+ [angledist:1,30] 

  This allows you to construct a new point that is to travel at a
  angle of 30 degrees counterclockwise from due east for 1 unit
  length, starting from the current point.

+ [turn:30,1] 

  This is to create a new point that is equivalent to making a left
  turn of 30 degrees from the direction you have arrived at the
  current point, and then travel for one more unit length. If it is to
  make a right turn, then set the angle to a negative number.

+ [flip:5,5] 

  This is to construct a new point that is the mirror image of the
  current point. The current point in this case is five unit distance
  to the right and towards the top of the last point. The mirror is
  the line segment that is made up by the current point and the point
  before that. This operations allows you to figure out where an
  existing point will land as if you were folding a paper along an
  existing line that is traveled between the last two points.


# The shape-operation

Following commands are to draw a shape. The shape to be drawn is specified as the "subcommand". Each shape has its "native" size, which is going to be different from shape to shape.

~~~list
-   shape.rect
-   shape.rhombus
-   shape.trapezoid
-   shape.parallelgram
-   shape.apple
-   shape.rrect
-   shape.basket
-   shape.crate
-   shape.radical
-   shape.protractor
-   shape.updnprotractor
~~~

Similar to the 'circle' command, each shape is to be drawn at a
location of the path. Thus, the following command would have drawn
three 'rect' shape each at a different location.

    shape.rect   (1,1) (3,4) [l:2,1]

Each shape has its own native size, and is positioned so that its
anchor point aligns with the position specified. For example, all
'rect' shapes will be position so that its lower-left hand corner
aligns with the point given, while all shapes of 'protractor' will be
positioned so that its lower-center corner is aligned with the
location. Following table shows the native size and the anchor
position of each shape.

```tabular
Shape            | Native size      | Anchor position
------------------------------------------------------------
rect             | 1x1              | left-left
rhombus          | 1x1              | left-left
trapezoid        | 1x1              | left-left
parallelgram     | 1x1              | left-left
apple            | 1x1              | left-left
rrect            | 1x1              | left-left
basket           | 3x2              | left-left
crate            | 4x3              | left-left
radical          | 4x2              | top-left
protractor       | 7x3.5            | lower-center
updnprotractor   | 7x3.5            | upper-center
```

- (a) For the radical the height is always 2, but the width might be changed to a differen width if the 'radicallength' attribute is set to a different number. The default width is 4.

- (b) For each shape, the 'sx' and 'sy' attributes can each be set to a different quantity, for which they each acts as a scalar that is to scale the width and height of the shape. For example, we can scale the protractor horizontally by half and vertically by two-third if we were to do the following.
  
  ````
  shape.protractor {sx:0.5,sy:0.66} (0,0)
  ````

- (c) For each shape, the 'theta' can be added to express the angle of rotation around the origin. The angle is a number in degrees, where a position number expresses the rotation in the direction of unter-clockwise.
  
  ````
  shape.protractor {theta:30} 
  ````



# The dot-operation

The 'dot' command is to draw a dot to mark the location. Similar to
the primitive command, a single dot is to be repeated for all points
on the given path. Thus, following command will draw three dots each
at three different locations of the input path.

    dot (1,1) (3,4) [l:2,1]

The 'dot' command provide several subcommands that allows for a
different shape to be drawn instead of a circular dot.

    dot.hbar (1,1) (3,4) [l:2,1]
    dot.vbar (1,1) (3,4) [l:2,1]

For 'dot' command, the color can be specified using the 'dotcolor'.

    dot {dotcolor:orange} (1,1) (3,4) [l:2,1]

For 'hbar' and 'vbar' subcommands the 'linecolor' attribute would have
expressed the color of the lines.

    dot.hbar {linecolor:orange} (1,1) (3,4) [l:2,1]
    dot.vbar {linecolor:orange} (1,1) (3,4) [l:2,1]

The diameter of the dot can be set using the 'dotsize' attribute.

    dot {dotcolor:orange, dotsize:10} (1,1) (3,4) [l:2,1]

For 'hbar' and 'vbar' subcommands the 'linesize' attribute would hve
expressed the width of the line.

    dot.hbar {barcolor:orange, linesize:2} (1,1) (3,4) [l:2,1]
    dot.vbar {barcolor:orange, linesize:2} (1,1) (3,4) [l:2,1]

The 'dotsize' and 'linesize' are both expressed in terms of 'pt'. For
'hbar' and 'vbar' commands, the length of the bar can be specified via
the 'barlength' attribute. It is a number that expresses the line
length in grid unit. If not specified, the default value is 0.25,
which is one-quarter the length of a grid, and it can be changed to a
different value by the 'set barlength' command.

    dot.hbar {linecolor:orange, barlength:0.5} (1,1) (3,4) [l:2,1]
    dot.vbar {linecolor:orange, barlength:0.5} (1,1) (3,4) [l:2,1]

Here, the length of each bar is going to be about half the length of
the grid. Note that for 'vbar', it's lower end point aligns with the
location, and for 'hbar', its left end aligns with the location.


# The label-operation

Drawing text labels are done by using the 'label' command. For
example, the following 'label' command will each draw a label at the
given location.

    label.rt "A" (1,1)
    label.lft "B" (2,2)
    label.top "C" (3,4)

The 'label' command is designed to draw the same label at multiple
locations. For example, we can draw the same letter A three times each
at three different locations such as follows.

    label "A" (1,1) (2,2) (3,4)

Each subcommand specifies how the text is to be aligned relative to
the locatoin. For example, the 'top' subcommand would have aligned the
text so that it appears on top of the location, centered horizontally.
When a label command is without its subcommand it defaults to 'urt',
which basically asignes the lower left hand corner of the text with
the loction.

    label.top   -  top
    label.bot   -  bottom
    label.lft   -  left
    label.rt    -  right
    label.ulft  -  upper left
    label.llft  -  lower left
    label.urt   -  upper right
    label.lrt   -  lower right
    label.ctr   -  centering the text

The text to be drawn must be expressed using a set of quotation marks,
and they must appear before any option and before any coordinates.
Usually a single text is repeated in all locations. 

    label "A" (1,1) (2,2) (3,4)

However, it is possible to specify a different text for 
each location.

    label "A \\ B \\ C" (1,1) (2,2) (3,4)

It is also possible to express that a math expression instead of plain
text. In this case use the backslash-left-parenthesis and
backslash-right-parenthesis quotation for the text.

    label \(A_0 \\ A_1 \\ A_2\) (1,1) (2,2) (3,4)




# The text-operation

The text operation is very similar to the label operation except that
it will look for double backslashes in the text and use that to draw
multi-line text box.

    text.ulft {fontsize:7,dx:-0.5} "degree\\ 3" (-3,2)
    text.urt  {fontsize:7,dx:+0.5} "degree\\ 2" (3,2)
    text.llft {fontsize:7,dx:-0.5} "degree\\ 2" (-3,-2)
    text.lrt  {fontsize:7,dx:+0.5} "degree\\ 3" (3,-2)

Unlike the label, it always treats the text as normal text, and not
the math expression. This means that the backslash-left-parenthesis
and backslash-right-parenthesis quoted text will be treated as if they
are normal text.

The text operation can also have alignment specifier for it.


    text.top   -  top
    text.bot   -  bottom
    text.lft   -  left
    text.rt    -  right
    text.ulft  -  upper left
    text.llft  -  lower left
    text.urt   -  upper right
    text.lrt   -  lower right
    text.ctr   -  centering the text

# The path-functions

Note that for a path function all its arguments must be either a path
variable or a number. Coordinate list is not valid. In the following
examples all letters a, b, c are path variables.

+ midpoint 

  The ``midpoint`` function returns the mid point of the first two
  points in a path expression if a single argument is given. Following
  returns a path with a single point: (1.5,2), which is the mid point
  of (1,1) and (2,3).

  ```
  path b = &midpoint{(1,1),(2,3)}
  ```

  Note that only the first two points of a path is used. The other
  points are ignored. Thus if path a has three points, then the third
  point is simply ignored.

  If two arguments are given, it does a linear interpolation alone the
  line segment of the first two points, and return a point that
  corresponds to the percentage of the path traveled from the first
  point to the second. The second argument is an floating point number
  between 0-1. For example, if 0.5 is given as the second parameters,
  it should return the same path as that with a single argument. Thus,
  following example will return the same result as the one before.

  ```
  path b = &midpoint{(1,1),(2,3),0.5}
  ```

+ shiftpoints 

  The ``shiftpoints`` function is always needed to be provided with
  three arguments. The first argument is always interpreted as a path
  variable. The second and the third arguments are to be interpreted
  as expressing length in grid unit. This function is to return a new
  path with exact the same number of points, except for that all the
  points will have been shifted by the number of grid units specified
  in the argument. For example, following would have shifted all the
  points in the original path one position to the left and two
  positions up.

  ```
  path b = &shiftpoints{&a,-1,2}
  ```

+ scatterpoints 

  The ``scatterpoints`` function is to create new path with the
  number of points evenly distributed beteen the two end points. In
  the previous example there will be 10 points created in a path such
  that the first point is (1,0), and the last point is (10,0), and the
  rest of the points will be spaced evenly between the first and the
  last. The last argument is a scalar telling it how many total gaps
  there is between scattered points.

  ```
  path a = &scatterpoints{(1,0),(10,0),9}
  ```

+ linelineintersect 

  The ``linelineintersect`` Returns new a path that contains a
  single point which is the point at which the two lines intersect.
  The first line is described by the symbol 'a', which must have at
  least two points. The second line is described by the symbol 'b',
  which must have at least two points. Only the first two points of
  'a' and 'b' are considered. The rest of the points of 'a' and 'b'
  are ignored.

  ```
  path b = &linelineintersect{(0,0),(10,0),(-1,5),(1,5)} 
  ```


+ linecircleintersect 

  The ``linecircleintersect`` function returns new a path that
  contains two points for the line and circle intersection. In the
  following diagram the pts variable 'pts' will hold two points: (6,2)
  and (4,2).

  ```
  path b = &linecircleintersect{(0,0),(10,0),(5,0),10}
  ```

+ circlecircleintersect 

  This method returns one or two points where two circles intersect.

  ```
  path b = &circlecircleintersect{(0,0),10,(5,0),10}
  ```


+ circlecircleintersectclip

  This method returns a closed path that describes the area that is
  the intersection area of the two circle areas. Note that it is
  important that the circle on the left-hand side is specified first.

  ```
  circle {r:3} (5,6)
  circle {r:3} (9,6)
  draw (5,5) (8,1)
  path c = &circlecircleintersectclip{(5,6),3,(9,6),3,0}
  % fill the intersection of A and B
  fill &c
  ```

+ circlecirclediffclip

  This method returns a closed path that describes the area of one of
  the circles after it has been clipped away for the area that
  overlaps with another circle The 5th argument controls which area to
  remain. If set to 0 then the circle on the left-hand side remains,
  and if set to 1 the circle on the left hand side remains. Note that
  it is important that the circle on the left-hand side is specified
  first.

  ```
  circle {r:3} (5,6)
  circle {r:3} (9,6)
  draw (5,5) (8,1)
  path c = &circlecirclediffclip{(5,6),3,(9,6),3,0}
  path d = &circlecirclediffclip{(5,6),3,(9,6),3,1}
  % fill remains of A
  fill &c
  % fill remains of B
  fill &d
  ```

+ circlepoints 

  The general syntax is: &circlepoints(center,r,a1,a2,a3...), where
  the 'center' denotes a path with a point expressing the circle
  center, and 'r' for the radius of the circle, and 'a1', 'a2', 'a3',
  etc., that expresses the angles starting from the first quadrant.
  The returned value is the coords of individual points at these
  angles.

  ```
  path b = &circlepoints{(0,0),2,30,60,90}
  ```

+ circle 

  Returns a path expressing the circle. It has a syntax of:
  &circle(center,radius), where 'center' is a path with at least one
  point, and 'radius' a scalar.

  ```
  path b = &circle(center,radius)
  ```

+ ellipse 

  This return a path expressing an ellipse. The syntax is:

  ```
  path b = &ellipse(center,xradius,yradius)
  ```

+ rectangle 

  This returns a path expressing a rectangle between to points. There
  are three ways construct the triangle, that is shown below. The
  first one construct a rectangle between to opposing points. The
  second one constructs a rectangle with an anchor point and then the
  width and height of it. The third one construct a rectangle with
  just the width and height, assuming the anchor point to be at (0,0)
  
  ```
  path b = &rectangle{point1,point2}
  path b = &rectangle{point,width,height}
  path b = &rectangle{width,height}
  ```

+ triangle 

  This returns a path expressing a triangle of three points. The
  syntax is: 
  
  ```
  path b = &triangle(point1,point2,point3)
  ```

+ polyline 

  This returns a path expressing a polyline. The syntax is:

  ```
  path b = &polyline{point1,point2,point3,...}
  ```

+ arctravel{center,start_point,sweep_angle}

  This returns a path that draws an arc. The arc is to start at the
  point 'p' that is at a circle centered at 'center'. The arc is then
  to trace out part of the circle by following an angle equal to
  'sweep_a' number of degrees. Positive 'sweep_a' is to trace in
  anti-clockwise direction and negative 'sweep_a' is to trace in
  clockwise direction.

+ arcspan

  Similar to 'arctravel', this function is the return a path that draws an
  arc. The arc is to start at the point 'p' that is at a circle
  centered at 'center'. The arc is then to trace out part of the
  circle, always in the direction of anti-clockwise direction, until
  it meats the point 'q'. If 'q' is found to be closer or further away
  from 'center', then the tracing stops as soon as it intersects with
  the radius-ray that passes through 'q'. 

  ```
  path b = arcspan{center,start_point,end_point}
  ```

+ arcsweep{center,r,start_angle,sweep_angle}

  Similar to 'arc', this function is to return a path that is to sweep
  across a given angle starting from known angle. The center of the
  arc is 'center', 'r' is the radius of the arc, the 'start_a' is the
  starting angle, and 'sweep_a' is the angle to sweep across in the
  counter counter-clockwise direction.

+ cylinder 

  This expresses a upright cylinder drawn with an ellipse at the
  bottom, with xradius/yradius, and a given height. The syntax is:

  ```
  path b = &cylinder{center,xradius,yradius,height}
  ```

+ ymirror 

  This returns a new path that is a mirror image of a given path. The
  first argument is the old path, and the second argument is a scalar
  that is a value on X-axis. The following example returns a new path
  that is a mirrored image of 'a' off the x-axis.

  ```
  path a = ...
  path b = &ymirror{a,0}
  ```

+ bbox 

  This returns a new path that represents the rectangle of the
  viewport.

+ grid

  This returns a new path that represents a grid. It expects four 
  arguments, the first two of which is the width and height of the grid,
  and the last two represents the steps in the x-direction and y-direction.
  The following example would have drawn a grid of 10-by-10, with grid
  line separation of 1 in both directions.

  ```
  path a = &grid{10,10,1,1}
  ```




# Special notes for MetaPost users

The color syntax is either the color name, such as "red", "green", or
RGB such as "rgb(200,100,25)".

The MetaPost code has the provision to allow for a "xcolor" provided
by the "xcolor" package, such as using the ``\mpcolor`` macro. Thus,
the MetaPost command can be set up as

    draw (1,2)--(2,3) withpen pencircle withcolor \mpcolor(gray)

The xcolor package has also expanded the avialble color names to more
than what's provided by MetaPost, including "gray", "orange", etc.
Following additional color names are always provided by the xcolor
package:

    red, green, blue, cyan, magenta, yellow, black, gray, white,
    darkgray, lightgray, brown, lime, olive, orange, pink,
    purple, teal, violet

SVG also allows for a color to be specified directly using RGB, such
as

    <line x1='0' y1='1' x2='2' y2='3' stroke='rgb(200,100,25)'/>

However, MetaPost does not allow for expressing a color using three
integers as RGB values of a color. It insists that a name is to be
used for \mpcolor macro. However, it does not have provision such that
you can *create* a new color name with a customized RGB values in it,
such as

    \definecolor{ultramarine}{RGB}{0,32,96}
    \definecolor{wrongultramarine}{rgb}{0.07, 0.04, 0.56}

The \definecolor is a macro provided by xcolor package. This means if
a color is specified as "rgb(200,100,25)" then a \definecolor command
must first be called to create a "unique" color name, such as
"mycolor003" which is to be placed outside of the "mplibcode"
environment, in order for this particular color to be referenced
inside "mplibcode" environment. Therefore, currently MetaPost
translation does not support specifying color using RGB directly.

Note that MetaPost does allow for a color mixing using existing color
names such as

    draw (1,2)--(2,3) withpen pencircle withcolor \mpcolor(red!80!white!20!)

Note that for units such as line width, dot size, etc, is maintained
internally by Diagram as the SVG user unit. One user unit is exactly
1/96 of an inch. Following is the conversion of SVG units.

    1in = 96px
    1in = 72pt
    1in = 2.54cm

It seems that MetaPost allows for a line length or dot size to be
expressed without a specific unit attached to it. For example, you can
ask to draw a dot by MetaPost with the following command. The "withpen
pencircle scaled 5" is part of a configuration to the "dot" command
that is to tell it to use a pen size of 5. Note that the size of 5 is
interpreted as the size of the pen, therefore, the diameter of the dot
as the pen is a circle pen.

    dot (22*u,3*u) withpen pencircle scaled 5 ;

You can also provide a unit directly, such as pt.

    dot (22*u,3*u) withpen pencircle scaled 5pt ;

The linecap attribute is defines the shape to be used at the end of
open subpaths when they are stroked. The SVG has an attribute that can
used for line-element. The available values are: 'butt', 'round', and
'square'. The default value is 'butt'.

The "dashed withdots" option for "draw" will not show any visible
dotted lines in the PDF file when linecap:=butt. The linecap:=rounded
will has to be set in order to produce dotted-lines. Thus, currently
the "set linedashed withdots" option is considered broken for MP
generation. Do not use it for now. Use "set linedashed evenly"
instead.



# The cartesian-operation

~~~list
- cartesian.setup xorigin yorigin gridrange
- cartesian.grid xmin ymin xmax ymax
- cartesian.xaxis xmin xmax
- cartesian.yaxis ymin ymax
- cartesian.ytick y1 y2 y3 ...
- cartesian.xtick x1 x2 x3 ...
- cartesian.yplot {f:P} x1 x2 x3 ...
- cartesian.xplot {f:P} y1 y2 y3 ...
- cartesian.dot x1 y1 x2 y2 x3 y3 ...
- cartesian.line x1 y1 x2 y2 x3 y3 ...
- cartesian.arrow x1 y1 x2 y2 x3 y3 ...
- cartesian.text.rt x1 y1 x2 y2 x3 y3 ...
- cartesian.ellipse x y Rx Ry Phi
- cartesian.arc x y R startAngle stopAngle
~~~

The ``cartesian`` command is used to draw plots, curves, axis, ticks
that are related to a single Cartesian coordinate. It is a composite
command that includes many sub-commands. All subcommands must follow
the word 'cartesian' after a dot symbol. The subcommand itself can
also have its own option, such as 'cartesian.text.rt'.

The ``setup`` command would set up a Cartesian coordate to be used. The
first two arguments defines the low left hand corner where the origin
of the cartesian coordinates will appear inside the Diagram. It is
specified in grid coordintes. For example, if they are passed as 2 and
3, then the origin of the Cartesian coordinates will appear at the
location of (2,3) of the Diagram.

    cartesian.setup 2 3 0.5

The third argument can be omitted. If provided, it states the how to
interpret the input range of the Cartesian coordinates. For example,
when 0.5 is passed, it states that each grid unit of the Diagram is to
be interpreted as expressing an input range of 0.5 for the Cartesian
coordinates, or that 2 grid units will be used for each length of 1 of
the input range of the Cartesian coordinates. This means that if we
were to plot a point of (1,1) of the Cartesian coordinates the dot
will appear at the location (2,3) + (2,2) = (4,5) inside the Diagram,
where (2,3) is the location of the origin, and (2,2) is where the
point is relative to the origin.

The ``cartesian.grid`` command asks to draw a grid with the lower-left
corner at (xmin,ymin) and upper-right corner at (xmax,ymax). The increment
is default at 1. The increment for x-direction can be set by the xstep-option
and the increment for y-direction can be set by the ystep-option.

    cartesian.grid -5 -5 5 5
    cartesian.grid {xstep:0.5, ystep:0.5} -5 -5 5 5

The ``cartesian.xaxis`` command is to draw the x-axis. The only two
parameters passed to it is the lower and upper range that this axis
entails. Similarly, the ``cartesian.yaxis`` command draws the y-axis
with similar parameter requirements.

    cartesian.xaxis -0.75 5.6
    cartesian.yaxis -0.75 4.5

The ``cartesian.xtick`` is used to draw ticks as well as labels on the
x-axis of the coordinate. The list of arguments passed to this command
is a list of location of these ticks on the axis. For example, if
passed as "1 2 3" then the ticks will appear where (1,0), (2,0), and
(3,0) points are. For each tick, a label string will also appear
unerneath that tick. Similarly, the ``cartesian.ytick`` command does the
same thing except for that it is for the y-axis.

    cartesian.xtick 1 2 3 4 5
    cartesian.ytick 1 2 3 4

The `cartesian dot` command shows one or more points as dots inside
the coordinate. Every two numbers are interpreted as a pair of (x,y)
coordinates.

    cartesian.dot  -4 0 4 0 \
                  -5 0 5 0

The 'cartesian.line' and 'cartesian.arrow' commands are similar,
except for that the first one will draw connecting lines between all
points, and the second one also adds an arrowhead at the very end of
the line.

    cartesian.line  -4 0 4 0 \
                    -5 0 5 0
    cartesian.arrow -4 0 4 0 \
                    -5 0 5 0

The 'cartesian.yplot; is similar to 'cartesian.dot', in that it
generates a series of dots. Only the x-coordinates of plotted points
are provided, and the y-coordinates of each point is calculated by the
supplied function, which must be provided by the "f" member of the
option.

    fn P(x) = pow(x,2)
    cartesian.yplot {f:P} 1 2 3 4 5

In the previous example, following points will be shown: (1,1), (2,4),
(3,9), (4,16), and (5,25) as dots. The Range expression in this case
can be useful, such as the following:

    fn P(v) = pow(v,2)
    cartesian.yplot {f:P} [1:5]

The name of the function could be arbitrary. However, it must be
specified by the "f" member of the option. The function must have been
previously defined by a 'fn' command, and must only accept one
argument and return a single scalar.

The 'cartesian.xplot' is similar except for that the input arguments
expresses a range of values as the y-coordinates of the points, and
the funtion generates the corresponding x-coordinates.

    fn P(v) = sqrt(v)
    cartesian.xplot {f:P} 1 4 9 25 16 25

The ``cartesian.label`` command draws a text at the location of the
cartesian coord. The text itself is expressed via the quotation marks
that must proceed the any option and all scalar values. Following
example draw texts at location (-5,0), (-5,1) and (-5,2) of the
Cartesian coordinates, and at each point the text will be "P(0)",
"P(1)", and "P(2)". The text is to appear at the bottom of each point.

    cartesian.label.bot "P(0)\\P(1)\\P(2)" -5 0 -5 1 -5 2

The 'cartesian.ellipse' will draw an ellipse centered at the location.
There can only be one ellipse to be drawn, and the signature of the
arguments are:

    cartesian.ellipse x y Rx Ry Phi

The 'x' and 'y' are coodinates for the center point of the ellipse.
Each of the 'Rx' and 'Ry' is the semi-major or semi-minor axis in
horizontal or vertical direction. 'Phi' is the measurement of the
angle rotation of the entire ellipse around the center. If it is a
counter-clockwise rotation. It is in degrees.

The "cartesian.arc" command will draw an arc with the given center,
radius, start and stop angle. The signature of the function looks like
the following.

    cartesian.arc x y R startAngle stopAngle

The 'x' and 'y' are coordinates expressing the center of the arc. 'R'
is the radius of the arc. 'startAngle' and 'stopAngle' are the angles
expressing starting angle and stopping angle of the arc. They are both
in degrees.


# The barchart-operation

The 'barchart' is another compound command that is to be used
with many subcommands. Following is a list of some
of its subcommands.

~~~list
- barchart.setup xorigin yorigin xwidth ywidth xrange yrange
- barchart.bbox
- barchart.vbar
- barchart.ytick
- barchart.xtext
~~~

The 'barchart.setup' command would setup the barchart and config it.
The 'xorigin' and 'yorigin' are to state the grid coordinates where
lower left hand corner is to appear in the Diagram. Note that this
number is subject to current settings of 'refx', 'refy', 'refsx' and
'refsy' settings.

The 'xwidth' and 'ywidth' is to state the width and height of the bar
chart measured in grid length. Thus, setting them to '10' and '15'
would have a barchart of 10 grids wide and 15 grids tall.

The 'xrange' and 'yrange' is to state the input range for the
x-direction and y-direction axes. Specifically, if the bars are going
to be drawn vertically, from bottom to top, then the 'yrange' should
be stated as the highest number of the tallest bar,and 'xrange' should
be stated as the total number of bars minus one. For example, if we
were to show five bars, that is 0.1, 0.3, 0.2, 0.4, 0.2, then the
'yrange' should be set to 0.4, and 'xrange' should be set to "5"
Following example shows how to set up a barchart that is to be placed
at (0,0), with a width of 10, and height of 15, and with the 'xrange'
set to 5 and 'yrange' set to 0.4.

    barchart.setup 0 0 10 15 5 0.4

The 'barchart.bbox' is to draw a bounding box covering the entire
barchart. It does not require any arguments.

The 'barchart.vbar' is to draw vertical bars. The arguments are the
y-values of the bar themselves. Thus, to draw the previous five bars,
it will be

    barchart.vbar 0.1 0.3 0.2 0.4 0.2

The 'barchart.ytick' operation is to draw "ticks" along its y-axis on
the left hand side, and also show the label for each axis to its left
hand side. Its arguments are the location of ticks, and they should be
stated in the same input range as those of the 'vbar'. For example, if
ticks were to be placed at the location of '0.1', '0.2' and '0.3',
then following command should be issued.

    barchart.ytick 0.1 0.2 0.3

The 'barchart.xtext' is to add information at the bottom of each bar
as to express what these bars are intended for. The text must be
provided by a set of quotation marks that must proceed all options and
scalars. The scalars express the location of vertical bars on x-axis.
Thus, if the input range has been set to 5, the first bar is to appear
between 0-1, and second bar 1-2, and so on, thus, the center location
for the first vertical bar is 0.5, and center location for the second
bar is 1.5, etc.

    barchart.xtext "P(0)\\P(1)\\P(2)" 0.5 1.5 2.5

The text will always be centered at location, and placed directly
below the bar.

# Drawing arrow heads

These three operations only draw lines, similar to the 'line'
operation. The 'arrow' would place an arrowhead at the ending line cap
location. The 'revarrow' would place an arrowhead at the starting line
cap location. Thesehe 'dblarrow' would place two arrowheads one at the
beginning and the other at the ending line cap location. The lines are
always drawn, regardless of the 'linesize' setting. If 'linesize' is
set to zero, the default line width for the target platform is
assumed. The 'linecolor' setting determines the line color as well as
the color of the arrowhead. However, due to outstanding issues on SVG,
the arrowhead MARKER-element does not change the color with the line
it is attached to, and is always shown as black.

    draw {arrow:1} (0,0) (3,4)
    draw {arrow:1,revarrow:1} (0,0) (3,4)
    draw {revarrow:1} (0,0) (3,4)



# Remarks and problems

- The arrow head in HTML is done using MARKER-element. And for SVG 1.1
  the limitation is that its coloring and filling is not changed to
  the line element it attaches to. It is a browser problem and
  currently there is no fix.

- For SVG we *had* to make a choice to either show a plaintext, using
  TEXT-element or math text using SVG-element, there is currently a
  lot of grief as prevously we were freely mixing normal and math text
  as this was not a problem for MetaPost, as it supports TeX text
  between btex and etex constructs. However, mixing plain text and
  math text is an issue because math text is translated into SVG and
  plain text into the TEXT-element, and there is no way to correctly
  position the SVG text if it is to appear in the middle of a
  TEXT-element.

- The generation of fontsize is always done to convert a user unit to
  pt.

- It has been observed that for MP generation if the symbol were part
  of a math such as between ``\(`` and ``\)``, then it appears smaller
  than those that are not.

- The text-aligmnents are default to 'urt' and not 'centered', thus we
  need to ensure previous auto choices of text alignment which
  asssumes the center are now being shown as 'urt' and thus we need to
  make some adjustments where necessary.

- Note that for MetaPost translation, it is very sensitive to
  backslashes. Even for texts that exists in comments, if a backslash
  is encountered that is not followed by another backslash, it is
  processed as a backslash sequence for which, it will consume a brace
  which will likely cause an unmatched brace compile error in LATEX
  engine. For this reason, all texts translated as a comment line are
  also "escaped".



# The for-loop

A for-loop is provided by Diagram such that a number of commands
can be repetitively executed, and each iteration these commands would
have been run under a different set of arguments. The basic syntax is

    for a:=[1,2,3,4]:
      draw (\a,\a) (0,0)

In the example, the 'draw' command will be executed exactly four
times, each of which looks like the following.

    draw (1,1) (0,0)
    draw (2,2) (0,0)
    draw (3,3) (0,0)
    draw (4,4) (0,0)

The for-loop starts with the keyword 'for', followed by a one or more
assignments of variables to a range of floats. The colon at the end is
optional. The for-loop would iterate over each loop variable over its
corresponding sequences. Each loop variable is to become one of the
environment variables that is going to exist even after the loop has ended. 
Following is an example of iterating over two
loop variables: 'a' and 'b'.

    % Using for-loop
    for a:=[1,3] b:=[2,4]:
      draw (\a,\a) (\b,\b)

Following is the equivalent commands without using the for-loop.

    % Not using the for-loop
    draw (1,1) (2,2)
    draw (3,3) (4,4)

Note that all lines of the loop body must have an indentation level
that is greater than the indentation of the for-loop itself.
If a line is encountered that is of the same or less of an indentation
level as that of the for-loop, then that line is not
considered as part of the loop body, and no additional lines will be
considered for inclusion as the loop body.

This design also permits the inclusion of additional nested for-loop,
each of which only to have its own loop body being indented even
further inwards. The following example show the implementation of two
for-loops. The toplevel for-loop offsers two loop variables:
'a', and 'b', and the nested for-loop offers one loop symbol:
'c'. Note that the last 'label.bot' command is not part of the nested
for-loop, but rather part of the toplevel for-loop.

    viewport 31 24
    for a:=[9,19,29] b:=[0.4,0.5,0.6]:
      set refx \a
      for c:=[16,4]:
        set refy \c
        draw (0,0) [h:-6] [v:6]
        draw (0,0) [q:-6,0,-6,6]
        path P0 = (0,0)
        path P1 = (-6,0)
        path P2 = (-6,6)
        dot &P0 &P1 &P2
        label.lrt "P_0" &P0
        label.llft "P_1" &P1
        label.ulft "P_2" &P2
        path line1 = &P0 &P1
        path line2 = &P1 &P2
        path m0 = &midpoint{line1,\b }
        path m1 = &midpoint{line2,\b }
        dot &m0 &m1
        draw &m0 &m1
        path line3 = &m0 &m1
        path B = &midpoint{line3,\b }
        dot &B
        label.bot "m_0" &m0
        label.lft "m_1" {dx:-.1} &m1
        label.urt "B" &B
      label.bot "t=\b" (-3,-2)

Note that if a for-loop contains two or more loop variables, the loop
will always interates to cover the longest sequence, and for a loop
variable that has run out of numbers in its sequence, a zero will be
assumed for that variable.


# The fn-operation

The fn-operation allows for a new user-defined function to be created.

    fn P(x) = pow(x,2)
    cartesian.yplot {f:P} 1 2 3

This operation must start with a function name, which must follow
the pattern of starting with an alpha letter followed by additional
alpha or numerical letters. Thus, the valid function names are "a", "aa",
"a0", etc, while "0", "0a", "0ab" are not valid function names.

The function is to be followed immediately 
by a set of parentheses, within which is a list of arguments,
separated by comma, followed by an equal sign, and then an arithmetic 
expression. So far the only command would make use of a function
is the 'cartesian.xplot' and 'cartesian.yplot'.

Note that the arithmetic expression can contain other funtions, including
built-in scalar function such as 'sin()', 'exp()', etc.



# Accessing an x/y component of a path variable

For a scalar expression, it is provision to access the x/y component
of a path variable. In the following example the variable 'mx' will be
assigned the sum of adding the "x" components of the first two points
in path variable 'pts', which will be "1 + 3 = 4".

    path pts = (1,2) (3,4)
    mx := &pts[0].x + &pts[1].x
    label.ctr (\mx,0)

Following is another example of adding the two "y" components of the
first two points and assign the result to 'my'.

    path pts = (1,2) (3,4)
    my := &pts[0].y + &pts[1].y
    label.ctr (0,\my)



# Setting up an environment symbol

Setting up environment symbol to attach a name the result of an
arithmetic expression.
In the following example the symbol 'pi' is assigned a
quantity that 3.1415, which is then used inside the function body of
'f' as well as part of the the 'draw' command.

    pi := 3.1415
    fn f(x) = \pi/x
    set refx 5
    set refy 5
    cartesian.xaxis -10 10
    cartesian.yaxis -10 10
    cartesian.yplot {f:f} [1:10]
    arrow (0,0) (\pi,\pi)

Note that the symbol following the backslash must conform to
the conventionn of starting with a letter, and followed by additional
letters and/or digits if any. A single letter symbol is permitted. In
addition, instead of being assigned a number, the right hand side of
the equal sign can also be a valid expression, in which case the value
of that expression is evaluated immediately, and the quantity of which
is assigned to the symbol.

    pi := cos(0)/2





# The built-in scalar functions

Following are built-in functions provided by Diagram

+ ln(x)
       
  It returns the natural log of a number

+ log(x)  

  It returns the base-10 log

+ log2(x)  
  
  It returns the base-2 log

+ exp(x)      

  It returns the output of an exponential function for which the base
  is set to be the Euler's number ``e``: exp(1) = e; exp(2) = ``e^2``

+ pow(x,y)     
  
  It returns the result of raising ``x`` to the ``y``-th power: pow(3,2) = 9; pow(4,2) = 16

+ sqrt(x)   
  
  It returns the square root of a number: sqrt(9) = 3

+ cos(x)       
  
  It returns the output of a cosine function, input must be given in radians

+ sin(x)       
  
  It returns the output of a sine function, input must be given in radians

+ tan(x)

  It returns the tangent of a number.

+ asin(x)

  It returns the inverse sin of a number.

+ acos(x)

  It returns the inverse cosine of a number.

+ atan(x)

  Inverse tangent of a number.

+ atan2(y,x)

  Inverse tangent of y/x

+ sinh(x)

  Hyperbolic sign of x.

+ cosh(x)

  Hyperbolic cosine of x.

+ tanh(x)

  Hyperbolic tangent of x.

+ deg2rad(x)       
  
  It converts a quantity in degrees to a quantity in radian: rad(180) = 3.1415

+ rad2deg(x)       
  
  It converts a quantity in radians to a quantity in degrees: deg(3.1415) = 180

+ floor(x)

  The largest (closest to positive infinity) value that is not greater
  than the argument and is equal to a mathematical integer.

+ ceil(x) 

  The smallest (closest to negative infinity) value that is not less
  than the argument and is equal to a mathematical integer.

+ round(x)

  Round to the nearest integer. Examples: round(-2.5) = -2,
  round(-2.6) = -3,
  round(-0.1) = -0, round(0.1) = 0, round(2.5) = 3

+ abs(x)

  Absolute value of a number. 

+ sign(x)

  Sign (+1 or -1 or 0) of a number

+ PI()

  The constant π (3.141592654...)

+ E()

  The Euler's number (2.71828...), the base for the natural logarithm



# The range-expression syntax

The range-expression serves to present one or more scalar quantities
with a command that expects scalar quantities as part of its command
line structure. When it appears as part of a group of scalar arguments
of a command, it serves to express one or more scalar quantities for
that command. For example, in the following command a total of 11
scalars will be supplied to the ``cartesian.yplot`` command.

    fn P(x) = pow(x,2)
    cartesian.yplot {f:P} [1:10]

A range-expression must appears between a set of brackets, and it
consists of two or three quantities each separated by a single colon.

When a range-expression consists of two quantities, such as "1:10",
the first one denotes the ``base``, and the second one denotes the
`limit`. The range of scalars this range-expression covers include all
the numbers between the ``base`` and ``limit``, starting from the ``base``,
with each additional number one greater than its predecessor, and with
a final number not exceeding ``limit``. Thus, for the case of a
range-expression "1:10", the scalars it entails are 1, 2, 3, 4, 5, 6,
7, 8, 9 and 10.

If a Range-expression is given as a set of three quantities, such as
the case of "1:3:10", then the last quantity denotes the ``limit``, and
the middle quantity denotes the increment for each additional scalar
after the ``base``. Thus, in the case of "1:3:10", the scalars it
entails are: 1, 4, 7, 10.


# List of floats

For cartesian-operation and barchart-operation, it expectes a list
of scalars after the style and label text. 
 
    cartesian.line {linecolor:red} 0 0 1 1 2 3

This would have drawn a line from (0,0) to (1,1) to (2,3). This new
type of floats allows for flexibility of listing one dimensional
numbers and two dimensional numbers seemlessly. For example, the 'cartesian.line'
would have considered the list as expressing a list of coordinates 
in a two-dimensional grid. However, the operation 'cartesian.xtick' 
would have considered the same list as expressing a list of coordinates
along x-axis, and the numbers in the list only expressed the x-coordinate,
where y-coordinates are assumed to be 0.

    cartesian.xtick 1 2 3 4 5

This new syntax also allows for functions and ranges to be mixed
with numbers. For example, in the following example would have
created a list of three floats: 1, 3 and 5.

    cartesian.xtick [1:2:5]






# The node- and edge-operations

Nodes and edges are common constructions found in almost any
literatures covering the topics in the fields of graph theory.

The 'node' and 'edge' commands are for supporting drawings of such
nature. In particular, each ``node`` command is to draw one or more
nodes, with each node shaped as a circle, with optional text in the
middle.

    node.A  (1,1)
    node.B  (5,5)

The previous two commands would have drawn two nodes, one named "A",
and one named "B" at two locations where each aligns with the center
of one of the nodes. The default radius of the node is 1, but it can
be configured to another such as "2" by doing the following

    config r 2

The option after the command such as ".A" and ".B" is used to assign a
name to this node, so that it can be referred to later by a command
such as ``edge``. In the following example the ``edge`` command is to draw
an edge between nodes "A" and "B".

    edge.A.B

The edge is by default a straight line. Each end point of this line
starts from the outside of the node, touching the perimeter of the
circle. However, if a curved line is desired, then the "abr" option
can be specified. This option describes an angle in degree, from the
view point of the starting node, how far off it is to veer away from
the straight line direction to reach the destination node. A positive
"abr" option would mean that it makes a counter-clockwise rotation for
that number of degrees, and a negative "abr" expresses that it should
make a clockwise rotation. Note that for the starting node if it is to
make a counterclockwise rotation then the destination node is to have
a clockwise rotation such that the incoming line is to have the same  
abbration. The resulting quardratic Bezier curve is to be formed such
that the control point of the Bezier curve is the intersection point
where the two lines meet.

When the starting and ending node is the same, then the 'edge' command
is to draw a loop. This loop is shown in the shape of a cubic Bezier
curve. There are three configuration parameters that is to control the
appearance of this cubic Bezier curve: 'abr', 'protrude' and 'span'.
The 'protrude' parameter determines the distance of the two control
points of the Bezier curve away from the surface of the node; it is an
integer expressing the number of unit length and the default value is
'1'. The 'span' parameter expresses the number of degrees of a central
angle formed by the two control points and the origin of the node. The
'abr' expresses the direction of the middle line bisecting the central
angle; if 'abr' is set to zero and 'span' is set to '30' then the
central angle is -15 to 15; if 'abr' is set to '90' and 'span' is set
to '30' then the central angle is from 90-15 to 90+15. The default
value for 'span' 45. The wider this angle is, the fatter the loop will
appear to be.

Thus, the following example would have drawn a curved edge that is to
come out of the first node at the top of the circle, and then entering
the second node on its left-hand side. This is because the straight
line direction would be a 45 degree from the first node to the second
node, and thus an addition turning of 45 degree angle would have
placed the starting direction at a 90 degree angle. Since the turning
would be semantical, the destination node would have its angle turned
in the opposite direction.

    node.A  (1,1)
    node.B  (5,5)
    edge.A.B {abr:45}

If the edge is going to include arrow heads, then one of the following
three options should've been used

    edge.A.B {arrow,abr:45}
    edge.A.B {revarrow,abr:45}
    edge.A.B {dblarrow,abr:45}

For the node-operation, the dot-option, if present, would have asked the
node to be drawn as a dot, and in which case the label text
is not to be drawn. This allows one to render
each node as a colored dot. The size of the dot is to be controlled
the same way how a "dot" operation is controlled, such as to set the
"dotsize" for the size of the dot in diameter, and "dotcolor" for the
color of the dot.

Typically each node is to be assigned a name that follows the period
after the "node" keyword. However, if a node-operation is to be done inside
a for-loop then this assigning of a node name to a node is difficult to implement.
If assigning to a node a name is important, then it can be done
By setting the nodeid-option to an integer
greater than 1. If this is the case, whenever a new node is 
created and is not given a name, the integer of this parameter
is used as the new node name, and this integer is automatically incremented
by 1. In the following example each node is assigned a name that is "1", "2",
"3", "4", "5", and "6".

    ```diagram{frame, width:2cm}
    viewport 6 6
    config r 0.2
    config fillcolor black
    config nodeid 1
    set refxy center
    for theta:=[0:60:359]:
      r := 2
      x := cos(deg2rad(\theta)) * \r
      y := sin(deg2rad(\theta)) * \r
      node (\x,\y)
    edge.1.2.3.4.5.6.1
    ```

For a node-operation, if no coordinates are given in the command line,
all nodes will be searched in the internal database to see if this
particular node has already been drawn; and if it has then it is
redrawn using the last known position and radius information. However,
the style and label information would have to come from the new
command line. This feature allows for an existing node to be redrawn
with different styles and/or text. In the following example, the first
three nodes are redrawn with a filled color that is red.

    for theta:=[0:60:359]:
      r := 2
      x := cos(deg2rad(\theta)) * \r
      y := sin(deg2rad(\theta)) * \r
      node (\x,\y)
    node.1.2.3 {fillcolor:red}

For an edge-operation, if the shift-option is set, then the label
would be shifted away from its intended position for the given
distance. The shift-option expresses a unit length. The label would
have been drawn in a position that is this distance away, in a new
position that is this number of distance away in a direction that is
90-degrees counter-clockwise turn from the direction going from the
first node to the second. 

When the edge is a loop, which is the case when the two vertices are
the same, then the shift-option expresses an additional centrifugal
distance from the center of the node.








# The box-operation

This command is to draw a box at the location expressed by the path
points. The size of the box is controlled by the 'w' and 'h' members
of the configuration parameters, each of which can be set by the
'config' operation to be a default.
  
  ```
  box {w:3, h:2} (0,0) (1,2)  
  ```
    
It is also possible to place a label inside a box. 

  ```
  box {w:3, h:2} "1\\2" (0,0) (1,2) 
  ```
    

# The rec-operation

The 'rec' operation is a group of compound commands that serve the
purpose of recording some operations for the purpose of playing them
back later. In the following example two 'draw' operations are
recorded to the tape 'a' and later played back.

    path one = (0,0.3) [a:1,0.3,0,0,0,2,0] [v:2] [h:-2] [v:-2] cycle
    path two = (0,2.3) [a:1,0.3,0,0,0,2,0] [a:1,0.3,0,0,0,-2,0] cycle
    rec.a.draw {shade:linear,angle:80,shadecolor:gray lightgray gray} &one
    rec.a.draw {fillcolor:gray} &two
    rec.a.playback (2,0)

    

# Gradient Fill

The Gradient Fill is provided by SVG, TikZ and MetaFun. 

In general, there are two gradient fills, "linear" and "radial". 
The first is to fill a gradient from one side of the figure
to another, and the second one is to fill the gradient
from a point inside the figure, usually the center, and move
concentrically away from that point.

For SVG, to do that is to define a 'linearGradient' or 'radialGradient' 
element, assign it a id, and then place this element inside a 
'defs' block. When a shape such as a rectangle need to be filled with
this pattern, it will set the 'fill=' attribute of this rectangle
with a url, such as 'fill=url(#myid)', assuming that 'myid' is the 
id of the 'linearGradient' or 'radialGradient' element.

For TikZ, it is to use the '\shade' command, rather than the
'\fill' command. Within this command, there are several option
we need to set. First of all, the 'shading=' option. This option
is to be set with a string that is either 'axis', or 'radial'. 
It can also be set to 'ball', which acts like a 'radial' but will
move the center point of the inner color away from the center
of the shape towards some hardcoded point that is the north-west
location within the shape.

When 'shading=' is set to 'axis', there are three options we
can set, namely "top color=", "bottom color=", and "midddle color=". 
The first two defines "from color" and "to color", and the last one
defines a "middle color that sits between the first two colors. 
The last one can be omitted, in which case the color will simply 
flow from the "top color" to the "bottom color". 

By default TikZ flows color from top to bottom. However, you can
change it to flow a different direction by setting the "angle=" option. 
This takes a number that is from 0-90, denoting an angle rotating
anti-clockwise. Thus, when "angle=90" the color flow will be from
left to right. 

When "shading=" is set to "radial", then the two color choices
will be "inner color=" and "outer color=". There is no other options
to set.

When "shading=" is set to "ball", there is only color to
set and this one is "ball color=".
This color defines the color of the ball. With this gradient it is better
to apply it to a circular shape, although other shapes 
are also allows. Tikz will apply a gradient to the shape to simulate
the effect of having a light at the top-left hand corner of the ball.

For MetaFun it offers linear gradient and radial gradient as well.
For linear gradient the 'withshademethod "linear"' must be specified.
The 'withshadedirection' option specifies the direction of flow of the color.

    withshadedirection (0.5, 2.5) // bottom-to-top
    withshadedirection (2.5, 0.5) // top-to-bottom
    withshadedirection (1.5, 3.5) // right-to-left
    withshadedirection (3.5, 1.5) // left-to-right

Basically for MetaFun each quardrant is assigned a number 1, thus, rotating 
an be achieved by adding 1/90 (approx. 0.011) to the two coordinates of the 'withshadedirection='
for every one degree turned anti-clockwise. For example, when top-to-bottom color
flow is (2.5, 0.5), the flow that is one-degree rotated anti-clockwise will result
in a coordinates pair of (2.511, 0.511).

For linear gradient, there can be one color, two colors, and three colors, which
is supported by TikZ. For SVG the actual number of colors choices can be more. 
For MetaFun it is also possible to specify three or more colors. However, in order
to maintain backward compatibility with TikZ, only three colors will be supported
for linear gradient. For MetaFun, when three colors are used for linear gradient,
the MetaFun code will look like the following:

    withshadestep( 
      withshadefraction .5 
      withshadecolors(\MPcolor{yellow},\MPcolor{blue})
    )
    withshadestep( 
      withshadefraction 1 
      withshadecolors(\MPcolor{blue},\MPcolor{red})
    )

Assuming the top color is yellow, middle one being blue,
and the bottom one being red. If there are only two colors, 
then it will look like

    withshadestep( 
      withshadefraction 1 
      withshadecolors(\MPcolor{blue},\MPcolor{red})
    )

In this case, the top color is blue and bottom color is red,
assuming the color flows from top to bottom, where in reality the
flow direction is controlled by the 'withshadedirection'
directive. For radial gradient, the syntax for MetaFun
is a little different:

    withshademethod "circular"
    withshadefactor 1
    withshadedomain(0,2)
    withshadecolors(\MPcolor{blue},\MPcolor{red})

Will allow the radial gradient to look similar to those of SVG
and/or TikZ. Note the presence of 'withshadefactor' and 'withshadedomain'.
Not certain how they actually do the job behind the scene but 
choice of these numbers seems to work the magic of generating
the effect similar to those of SVG and/or TikZ.

For 'shade:ball', the following commands are hardcoded:

    withshademethod "circular"
    withshadecenter(-0.45,0.35)
    withshadedomain(0,1.5)
    withshadestep( 
      withshadefraction .25 
      withshadecolors(\MPcolor{white},\MPcolor{blue})
    )
    withshadestep( 
      withshadefraction  1 
      withshadecolors(\MPcolor{blue},\MPcolor{black}) 
    )

To simulate the effect of "shade:ball" on SVG, the 
'radialGradient' element is filled with the following
attributes:

    <radialGradient 
      id="..."     
      cx="0.5"     
      cy="0.5"     
      fx="0.3"     
      fy="0.4"     
      r="0.5"     
      <stop offset="0%" stop-color="white"/> 
      <stop offset="100%" stop-color="lightgray"/> 
    </radialGradient>

For Diagram, the 'shade:linear', 'shade:radial', and 'shade:ball' allows for
three different kind of gradient fills similar to linear, radial, and ball
offerd by TikZ. The 'shadecolor' option is used to specify the color(s) that
flows from one to another. In particular, if no color is specified, or
'shadecolor' option is missing, the gradient will be assumed a flow from white
to black. If there is only color present, then it is assume to flow from that
color to black. If there are two colors present, then the color flows from the
first to the second. If there are three colors present, the first and third is
the to and from color, and the second is the middle color. Note that three
color only is supported when the 'shade:linear' is the case. For
'shade:radial', only atmost the first two colors will be picked. For
'shade:ball', only the first color will be picked. If no color is specified,
for 'shade:ball' the ball is assumed to be of color "gray".

There is also another issue. For SVG and TikZ when gradient fill is selected,
the color will flow from inner to outer color uniformly in both horizontal
and vertical directions. If the filled shape is a rectangle with a longer    
width than height, then the color flow at the horizontal direction will be elongated
than the color flow at the vertical direction because the width is longer than
height. However, for MetaFun this is
not the case, the color flow always seems to be uniform in all directions.
The outer color seems to be at a location away from the inner
color that is the average of the half width and half height of the rectangle.


# The multiws-operation

The multiws-operation allows for a multiplication worksheet
to be shown on the canvas. In the following example the workflow
of a multiplication worksheet of 24 multiplied by 3 is to be
shown at location (2,1).

    multiws "24 3" {answer} (2,1) 

By default "answer" is not set, in which case only
the multiplier and the multiplicant are shown. However, when
the "answer" option is set, the entire worksheet workflow that
leads to the solution is to be shown inside the canvas. 
The "answercolor" can be set which will be used to draw all lines, 
dots, and texts with that color.

    multiws "24 3" {answer,answercolor:orange} (2,1) 

It is also possible to include a decimal number with one of the numbers
or both numbers. If this the case, the correct decimal place
will be shown both at multiplier and multiplicant
and as well as at the product.

    multiws {answer,answercolor:orange} "2.1 4" (0,0)
    
    multiws {answer,answercolor:orange} "2.1 1.4" (0,0)

# The longdivws-operation

The longdivws-operation allows one to show the complete workflow  
of a long division between two integers, with quotient and remainders.
In the following example a long division workflow is to be shown 
starting at the coordinate (2,1).

    longdivws "11 4" {answer} (2,1)

By default the "answer" is not set, in which case only the
the dividend and divisor is to be shown. The "answercolor" can
also be set which will be used to drawn everything that is 
related to the answer, including lines and text.

    longdivws "11 4" {answer,answercolor:orange} (2,1)

Unlike the "multiws" operation, the "longdivws" operation does
not scan the input for any appearances of decimal points---thus if
a decimal point was included in one of the numbers it 
will likely cause unpredictable result.

# The fence option

The fence options are explained as follows:

+ width

  Set the width of the diagram. 

+ frame

  When set to 1 the diagram will have a frame.

+ hidden

  When set to 1 the diagram will not be shown.

+ save

  When set to a string the diagram source code will be saved
  to a buffer with this name.

+ load

  When set to a string the diagram source code will be restored
  that corresponds to this string.


# Specifying colors

The colors in the DIAGRAM can be specified in several ways. The
easiest is to use a named color, such as "red", "green", "blue", etc.
The second is to use RGB, such as "#CCC", "#ABABAB", etc. 
The third way is to use color function such as "&hwb!30!10%|20%"
or "&rgb!255!0!0". 

    red
    green
    #CCC
    #ABABAB
    &hwb!30!10%!20%
    &rgb!255!0!0
    &hsl!0!100%!50%










