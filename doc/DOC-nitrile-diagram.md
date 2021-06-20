---
title: The Diagram
translator: camper
program: camper
dest: .
---

A diagram block is to generate a diagram with vector based figures,
made up with vector based components as lines, circles, rectangles,
arrows, dots, etc. The goal of using a diagram block versus using an
raster based image such as PNG or JPEG is that a vector based diagram
provides much better resolution especially when the diagram is printed
on a piece of paper.


# Using MetaPost with LuaLatex

A diagram block is to be translated into an inline MetaPost block
between ``\begin{mplibcode}`` and ``\end{mplibcode}``. This environment is
supported by the ``luamplib`` LATEX package.

    \usepackage{luamplib}

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

MetaPost allow for expressing a color using three integers as RGB values of a
color such as '(0.94,0.2,0.1)' where each RGB value is to be expressed as a
floating point number between 0-1.  In addition, it does not have provision
such that you can create a new color name with a customized RGB values in it,
such as

    \definecolor{ultramarine}{RGB}{0,32,96}
    \definecolor{wrongultramarine}{rgb}{0.07, 0.04, 0.56}

The \definecolor is a macro provided by xcolor package. This means if a color
is specified as "rgb(200,100,25)" then a \definecolor command must first be
called to create a "unique" color name, such as "mycolor003" which is to be
placed outside of the "mplibcode" environment, in order for this particular
color to be referenced inside "mplibcode" environment. Therefore, currently
MetaPost translation does not support specifying color using RGB directly.

Note that MetaPost does allow for a color mixing using existing color names
such as

    draw (1,2)--(2,3) withpen pencircle withcolor \mpcolor(red!80!white!20!)

Note that for units such as line width, dot size, etc, is maintained internally
by Diagram as the SVG user unit. One user unit is exactly 1/96 of an inch.
Following is the conversion of SVG units.

    1in = 96px
    1in = 72pt
    1in = 2.54cm

It seems that MetaPost allows for a line length or dot size to be expressed
without a specific unit attached to it. For example, you can ask to draw a dot
by MetaPost with the following command. The "withpen pencircle scaled 5" is
part of a configuration to the "dot" command that is to tell it to use a pen
size of 5. Note that the size of 5 is interpreted as the size of the pen,
therefore, the diameter of the dot as the pen is a circle pen.

    dot (22*u,3*u) withpen pencircle scaled 5 ;

You can also provide a unit directly, such as pt.

    dot (22*u,3*u) withpen pencircle scaled 5pt ;

The linecap attribute is defines the shape to be used at the end of open
subpaths when they are stroked. The SVG has an attribute that can used for
line-element. The available values are: 'butt', 'round', and 'square'. The
default value is 'butt'.



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

There is an outstanding issues on SVG,
the arrowhead MARKER-element does not change the color with the line
it is attached to, and is always shown as black.


# An example diagram

Following is an example of a diagram block.

    % variables
    path a = (1,1) -- (5,5) -- (5,1) -- (1,1) 
    path b = (1,1) .. (5,5) .. (5,1) .. (1,1) 
    % draw
    draw  &a
    draw  &b


# Viewport

In Diagram, each figure is always expresses using the grid unit
length. A unit unit length is considered as a distance between two
adjacent grid lines on a graphing paper for which a length of 1
corresponds to the width of a single grid.

In Diagram a grid is drawn as the background by default. The size of
the grid is 20 grid units length long in the horizontal direction and
10 grid unit length long in the vertical directon. You can change that
by setting viewport configuration setting

    ```diagram{viewport:20 10}
    ```

Each grid is by default 5mm in length, thus, a total of 20 grid units
in horizontal direction will generate an image of 200mm in width, and
10 grid units of vertical direction will put the image in the height
of 100mm. To set the unit to a different length, include the third argument
as the viewport-option. For example, to set the viewport to the previous
width and height and such that each grid is 6mm-by-6mm, do the following. 

    ```diagram{viewport:20 10 6}
    ```



# Action commands

Action command are those that would generate a translation such as those metafun
commands, tikz commands, or SVG entries. Example action commands are 'draw',
'drawtext', 'drawdot', etc.

Non-action commands are those that is used to configure environments, create and
update variables, function, and path, etc. Following are Non-action commands:

- var
- for
- path
- fn
- config
- exit
- group
- id
- origin
- show
    


# The 'config' command

The config command can be used to control the configuration parameters
for the entire Diagram. This set includes the previous discussed
viewport width and height, and the unit.

However, there are additional configuration parameters. These
parameters should be set at the beginning of the Diagram, before any
drawing commands, in order to maintain consistencies. Changing these
configuration parameters in the middle of other drawing commands are
not recommended and may result in distorted picture.

    config linesize 1
    config linecolor red


# Specifying colors

The colors in the DIAGRAM can be specified in several ways. The easiest is to
use a named color, such as "red", "green", "blue", etc.  The second is to use
RGB, such as "#CCC", "#ABABAB", etc.  The third way is to use color function
such as "hwb(30|10%|20%)" or "rgb(255|0|0)". 

    red
    green
    #CCC
    #ABABAB
    hwb(30|10%|20%)
    rgb(255|0|0)
    hsl(0|100%|50%)



# Gradient fill

The Gradient fill is provided by SVG, TikZ and MetaFun. 

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
offerd by TikZ. 

The 'shadecolor:' option holds a list of colors separated by spaces denoting
how a gradient is to flow from the first color the last.  The appearance
of the gradient depends on the choice of the 'shade' option. 

For 'shade:linear' up to three colors can be listed, and the gradient is a flow
of these three colors going through each one of the in order given.  If there
are two colors, the flow is to be between these two colors.  If only one color
is present, then flow is assumed to be between that color and black. If no
color is found, the flow is assumed to be from white to black.

For 'shade:radial', only the first two color of the 'shadecolor' option is
recognized, and the flow is to happen between these two colors. If only one
color is found, this becomes the first color and the second one is assumed to
be black.  In the absence of 'shadecolor', the flow is assumed to be between
white and black.

For 'shade:ball', only the first color of 'shadecolor' option is recognized,
which is color of the ball. If no color is found, the color of the ball is
assumed to be "gray".

There is also another issue. For SVG and TikZ when gradient fill is selected,
the color will flow from inner to outer color uniformly in both horizontal
and vertical directions. If the filled shape is a rectangle with a longer    
width than height, then the color flow at the horizontal direction will be elongated
than the color flow at the vertical direction because the width is longer than
height. However, for MetaFun this is
not the case, the color flow always seems to be uniform in all directions.
The outer color seems to be at a location away from the inner
color that is the average of the half width and half height of the rectangle.


# Valid symbol names

Symbol names refer to the names used by a path, an environment variable,
a user-defined scalar function, and an array.

A valid symbol name must start with an upper case letter
or lower case letter, and followed by additional letters or numbers.

For instance, "a", "aa", "a0" are valid
symbol names, while "0", "0a", "0ab" are not valid symbol names.



# Constructing a path

## Vector path

In graphics design, a vector path composed of a series of smooth or straight (vector) lines 
is to be drawn as an outline. Each vector path will always start with a M point,
followed by additional L, C, Q, or A points. If this path is closed, then the last
point is a z point.

+ M
  A "moveto" point.
+ L
  A "lineto" point.
+ C
  A cubic Bezier curve point.
+ Q
  A quadratic Bezier curve point.
+ A
  A arc curve point
+ z
  A "closed" path point.

The letter M expresses that the point is a "moveto" point, similar to the "M"
point in a SVG path. A path is always started by the presence of this point.
The "L" is a "lineto" point, which expresses that a straight line is to be
drawn between the last point and this point. The "C" is a cubic Bezier curve,
and "Q" is a quadratic Bezier curve. The "A" is an "arc" curve, and "z"
represents that the current path should be closed, and a straight line is to be
drawn between this point and the "M" point that started this path.

In Diagram, if multiple M points are detected, each of them will individually
start a new vector path, and will be terminated whenever a new M point is
detected. If a z point appears before a M point, then the path is considered
closed at this point, such that any additional points that are not M will be
silently ignored. The following example path 'a' would have had one vector path
in it and path 'b' would have had two vector paths in it.
 
    path a = (0,0)--(1,1) 
    path b = (0,0)--(3,4) (2,2)--(5,6)

## Path points and join

A path is a collection of path points. In the following example path "a" 
has four path points, and path "b" has four path points.

    path a = (0,0)--(1,1)
    path b = (0,0)--(3,4) (2,2)--(5,6)

Each path point is specified by a set of parentheses with two numbers inside.
The first numbers is the x-coordinate, and the second number is the
y-coordinate.  The placement of "--" between path points is for expressing a
"line join", such that the second point is to become a L point.  However, "~~"
is another join called "abr join" that express that the second point is to join
the previous point as a quadratic Bezier curve, thus becoming a Q point. 

The control point of this quadratic Bezier curve is computed by moving the
midpoint of the straight line between the two points either towards the left
hand side or right hand side of the straight line, and this movement is
determined by the number following the "abr" directive.

    path a = ^abr:30 (0,3)~~(10,3) 

Here the "abr" directive will be followed by a number that expresses an angle
in degrees that is to be rotated around the first point and second point away
from the direction of the straight line. These two independent rotations would
each produce a ray and the control point of the quadratic Bezier curve is where
these two rays meet. A positive number would means for the first point to rotate clockwise
and the second point to rotate counter-clockwise, and the absolute value of this number
is the degree of the rotation. Likewise, a negative number would reverse the rotation
for both points.

    path a = ^abr:-30 (0,3)~~(10,3)
    path b = ^abr:30 (0,3)~~(10,3)

For the examples above, path "a" would have been a curved line that looks like
a hill, and path "b" would have been a valley.

Aside from the "abr join", there is also a "hobby join". This join is to affect
a collection of points that are joint by the same "hobby join". The intent of
this join is to produce a smooth curve that goes through all the points.

    path a = (0,0)..(2,0)..(2,2)

This join is recognized by the presence of "..".  In the previous example a
smooth curve is to be created that goes through three points: (0,0), (2,0), and
(2,2). The entire curve consists of two independent cubic Bezier curves, the
first one connecting the first two points, and another one connecting the next
two points.  The control points of both curves are automatically computed based
on the location of the three points to ensure a "smooth" transition from the
end of the first curve to the start of the second. 

If another point were to be added to become the fourth point, some of the
curves would be recalculated to ensure that the new curve would appear smooth
with other curves before it.

    path a = (0,0)..(2,0)..(2,2)..(2,4)
 
There is no limit to the total number of points that can be joint by "hobby
join". However, it is required that at least there are three "non-colinear" points
because otherwise the Bezier curve will appear to be straight.

## Relative points

The "join" type specified would have worked only between absolute points, which
is to appear inside a pair of parentheses. However, it is possible to add
additional path points by specifying distances that are relative to the last
point. However, the exact location of the new point will be computed based on
the absolute location of the last point and the relative position of the new
point.

All relative points share the same syntax pattern. They would all be surrounded
by a pair of brackets, instead of a pair parentheses as was the case of an
absolute point. Within the bracket it would start with a string         that
describes the "type" of the relative point, followed by a colon, and then
addtional numbers each of which separated by a comma.  For instance, following
is how to construct a path that consists of two path points and the second one
is a L point.

    path a = (1,1) [l:2,3]

The resulting path consists of two points: (1,1) and (3,4), and the second
point is a L point. Following are additional relative points.

- [l:dx,dy] 
- [h:dx]
- [v:dy] 

These three relative points would each create a L path point, where the
position of the new point is relative to the previous point by a horizontal
distance of 'dx' and a vertical distance 'dy'.

- [a:rx,ry,angle,bigarcflag,sweepflag,dx,dy] 

This is to create a A point that is dx/dy away from the
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

- [c:dx1,dy1,dx2,dy2,dx,dy] 

This is to create a C point from the current point to the new point that is
dx/dy away. The (dx1,dy1), and (dx2,dy2) are two control points, and its value
are relative distances from the previous point.  

- [s:dx2,dy2,dx,dy] 

This is to create a Q point that is dx/dy away from the previous point. Only
the second point of the current Bezier curve needs to be provided. The first
control point is deduced from the second control point of the previous cubic
Bezier curve operation. If the previous operation is not a cubic Bezier curve
drawing, but a quadratic Bezier curve drawing, then the first control point of
the quadratic curve is used to deduce the first control point of the current
operation. If it is neither a cubic nor a quadrilatic, then the last point is
assumed.

- [q:dx1,dy1,dx,dy] 
	
This is to draw a Q point that is dx/dy away from the previous point. The
(dx1/dy1) is the only control point, the values of which are relative distances
from the previous point.

- [t:dx,dy] 

This is to create a Q point that is dx/dy away from the previous point.  No
control points for this point is necessary. It will be deduced from a previous
Bezier curve operation. If a previous operation is not a Bezier curve
operation, then the last point is assumed to be control point, in which case
the drawn curve will be straight line.

- [angledist:30,1] 
- [angledist:30,1,2,2] 

This is to create a new L point.  The [angledist:30,1] directive is to
construct a new line segment from the current point to a new location that is 1
unit distance away and 30 degrees counter-clockwise rotation from due east.

The [angledist:30,1,1,1] directive is similar to the one before except for
the fact that the 30 degree rotation is now to start from a non-zero degree
angle that is formed between the reference point (1,1) and the current point:
if the current point is (0,0) then the reference angle is 45 degrees, such
that the constructed line segment is to land at a point that is 75 degrees 
rotation from due east.

- [turn:30,1] 

This is to create a new L point that is equivalent to making a left hand turn
of 30 degrees from the direction you have arrived at the current point, and
then travel for one more unit length. If it is to make a right hand turn,
then set the angle to a negative number.

- [clock:30,1]
- [clock:30,1,4,0]

This is to create a new L point that is away from the current point in a
direciton described by the angle, where angle 0 is straight north, and 90
degree is to the right hand side, -90 to the left hand side, and 180 is due
south. The first argument is the angle, and the second one is the distance
away from the current point.

If there are a total of four arguments, then the last two arguments
represents the x/y coordinates of a point from which the base angle is to be
computed. The base angle is the angle formed between the due north line and
the line between the current point and the new point. The clock angle is then
being added on top of the base angle before used to figure out the new
location.

- [flip:1,3] 

This is to construct a new L point that is the mirror image of the given point
that is 1 grid distance to the right and 3 grid distance upwards from the
current point. The exact location of the new location depends on the last two
points traveled, the direction of which is treated as a mirror to which the new
point will be reflected upon. The net result could be thought of as folding a
paper along the line of the mirror with a point on one side of the line, and see
where that point will land on the other side of the line after folding. 
The new point would be added as a "L" point.

- [sweep:cx,cy,angd] 

This is to construct a new A point of a given radius.  The center of the arc is
cx/cy away from the current point. The distance of the current point and
(cx,cy) is the radius of the arc, in both x/y-direction.  The arc is expected
to have covered a sweep of 'angd' degree.  A positive number expresses that the
sweep should happen in a counter-clockwise direction, and a negative value
expresses a clockwise sweep. 

- [protrude:dist] 

This is to create a new L point. This new point is located at a distance
that is 'dist' away from the current point. The direcion of the new point
follows the same direction going from the second last point to the last point.
Thus, it is important that there are at least two path points prior to creating
this path point.

- [m:dx,dy]

This is to create a new 'M' point or update an existing 'M' point.
The new 'M" point will be moved dx/dy away from the current point.
If the last point is not a M point, a new M point will be created.
Otherwise, the last M point is updated and its new position is dx/dy away
from its current position.


## Anchor points of an object 

It is possible to add a path point that is the location of an existing anchor
point of an object. For instance, if a node with id "1" has been created prior,
it is possible to construct a path that go throug the center of this node.

    path (0,0)--(@node.1)

Following example is similar but instead of going through the center of the node,
the second point of the path will go through the top of the node.

    path (0,0)--(@node.1:o12)

Here, "o12" is considered an "anchor point" that is relative to node 1. For a
node there are two anchor points, namely o1 to o12, with each point
corresponding to the hour of an analog clock. For instance, anchor "o12" would
denote a point on the border of the node that is located north of the center
point, and "o3" is a point on the border of the node that is located east of
center point.

So far, there are two types of objects, a node and a box. Following is an example
of drawing a line between anchor points of box 1 and box 2.

    draw (@box.1:n)--(@box.2:n)

For a box, the anchor points are "n", "w", "e", "w", "nw", "ne", "sw" and "se"
. For both node and box, two additional numbers can appear after the anchor, each
of which expresses an offset from that anchor. For instance, we express that instead
of starting from the "n" anchor point of box 1, it starts from a point that is (-2,3)
away from that anchor.

    draw (@box.1:n,-2,3)--(@box.1:n)

## Fetch path point from another path

We can also instruct that a path goes through
an existing path point of another path.
To reference a path point of another path, that name of that path is to be preceeded by
an ampersand, and followed by an underscore, and then a number that serves as the 
index to the path point. 
Following example would create a path "b" where its second point is the same as
the second point of path "a".

    path a = (0,0)--(3,4)
    path b = (0,0)--(&a_1)

Notice that there are two different ways of referencing an existing path or
path points: the one with parentheses, and the one without.  The second method
allows an existing path or path points to be copied verbatim to the new path
without modification.

    path a = (0,0)[l:3,4] 
    path b = (2,2)[l:3,4]
    path c = &a &b

In the previous example the path "c" would have composed of two vector paths, 
one going from (0,0) to (3,4), and another going from (2,2) to (5,6).

The last method is know as "pasting the path points", as it copies not only
the position of the path point, but also how to connect to this path point
from the one before it.  

There are pros and cons associated with each method. The first method would be
benefical if we only want to "pull in" the position of an existing path point, 
and want to control how we will connect this point to its previous sibling. 
The second method would be useful if we want to merge multiple vector paths into
a single "composite" path.

The second method also allows for individual path points to be pasted directly
into the current path.  For instance, the following example would paste the second
point of path "a" to become the first of path "a".

    path a = (0,0)[l:3,4] 
    path c = &a_1

This could have become a problem because the second point of path "a" is a L
point, and it has since become the first point of path "c" without being
proceeded by a M point.  However, if we had constructed path "c" the
following way, then this point would have become the M point for path "c".

    path a = (0,0)[l:3,4] 
    path e = (&a_1)

## Closing a path

To "close" a path is to ensure that when an outline is drawn tracing this path,
the last point of the path should always be connected with the first of the
path by a straight line.  This would have given the illusion of a "closed" area
that is "inside the path", and thus making it possible to fill this area with a
specific color a gradient. 

The syntax for expressing a "closed" path is to add ``[z]`` to the end of the
path expression. Internally, this would have translated to creating an internal
"z" point, as opposed to other path points such as "M", "L", "Q", "C", and "A".
This means that for the following example, there would be three internal path
points for path "a":

    path a = (0,0)[l:3,4][z]

Care should be taken when pasting from a path with a "z" point, as this "z"
point will be pasted as well.  For the following example, path "c"
would have had a single internal path point that is of type "z".  

    path a = (0,0)[l:3,4][z]
    path c = &a_2

For the following example the path "d" would have been empty because the
position of a "z" point does not exist.

    path a = (0,0)[l:3,4][z]
    path d = (&a_2)

## The 'lastpt'

When constructing a path, each time an absolute point or a relative point is
encountered, its position will be remembered. This position is internally known
as the 'lastpt'. The 'lastpt' only remembers the location of the point, and
does not care about how this point is connected with its previous sibling. This
point is then used when a new relative point is specified in order to compute
the absolute point of the new relative point, as was demonstrated by the
following example.

    path a = (0,1)[h:3][v:4]

In addition, the same 'lastpt' will persist over different invocations of the
command.  This means that if there is another 'path' command or other commands
that is to construct a path, before the first path point is constructed, the
'lastpt' is updated so that it is exactly where it was at the end of the last
path construction.  This means that the path "b" in the following example would
have had a single point that is (4,6) and the 'lastpt' during path "a" construction
is set at (3,4).

    path a = (0,1)[h:3][v:4]
    path b = [l:1,1]

Note that the 'lastpt' is only updated when an absolute point or a relative
point is encountered. It is not updated when an path point from anther path is
"pasted", such as the one shown by the following example, which might not have
created the path for "c" that is (1,1) and (4,5) as was expected.

    path a = (1,1)
    path c = &a [l:3,4]

To ensure that the path created is indeed (1,1) and (4,5), it should be changed
to the following.

    path a = (1,1)
    path c = (&a) [l:3,4]

## Path functions

Each path would also allow for a 'path function' to be specifed. A path
function is similar to a named path, except that its contents are dynamically
generated based on the information expressed by its "arguments". For instance,
in the following the path function "circle" would have returned a complete path
that describes a full circle centered at location (2,3) and with a radius of 4.

    path a = &circle{(2,3),4}

A path function always returns a path. However, each path function would have
had different arguments. The arguments for the "circle" path function would
have required that the first one be a path, such as (2,3), and the second one
be a scalar, such as 4.  

As a matter of fact, these are the only two argument types for a path function.
For an argument that is of a path type, it would either expect a literal point
notation, such as (2,3), or named path notation, such as ``&o``. For instance,
the same circle path function could be invoked as follows.

    path o = (2,3)
    path a = &circle{&o,4}
    path a = &circle{(2,3),4}

Note that 'lastpt' is not updated when a path function is encountered.

## The 'hint'

There is an internal variable named 'hints' that holds the last hints
designated by the user. To set this variable, use the "hint:" directive.

- hint:linedashed
- hint:linedashed|linesize2
- hint:linedashed|linesize2|linesize4

The value is one or more strings connected by a vertical bar. Following 
is a list of such strings.

+ linedashed     
  make the line a dashed line
+ linesizetwo      
  change the line size to 2pt
+ linesizefour      
  change the line size to 4pt
+ nostroke       
  no stroke 
+ nofill         
  no fill even for a closed path
+ lighter        
  the fill color should be lighter version of the current fill color
+ darker         
  the fill color should be a darker version of the current fill color
+ shadow         
  this path segment is drawn as a drop shadow (and thus 
  deserves some special treatment if possible)

Each of these strings is translated into a bit field that is then OR'ed together.
For instance, if we were to construct a path to express the fact that the line should
be drawn at size 2, we could do the following.

    draw ^hint:linesizetwo (0,0)--(0,2) 

Note that the idea behind using a hint is to allow for a path to be constructed
to have multiple independent vector paths and each individual vector could have its
own settings such as line size, and color, etc. For this reason, a hint is only 
valid for a vector path that immediately succeeds it, and will be cleared 
as soon as this path is terminated. For intance, in the following example the
second and third vector path will not have the same hint as the first.

    draw ^hint:linesizetwo (0,0)--(0,2) \
         (0,2)[l:-0.5,-0.5] \
         (0,2)[l:0.5,-0.5]

## Setting up the 'offset'

During a path construction, each path point is subject to an internal "offset".
The "offset" is nothing but a number in horizontal and vertical direction.
When either the numbers are not zero, all future points of this path will be
added this additional distance in the x or y direction. This allows for the
same path construction description to be repeated over a number of commands
each time at a possibly different "location".

    draw           (0,0)[h:2][v:2]
    draw ^x:2 ^y:3 (0,0)[h:2][v:2]

In the previous example, the second 'draw' command is said to have established
an offset that is (1,1), shifting all points of the subsequent path points
horizontally to the right by 2, and vertically upwards by 3.  

Following are directives for setting and moving offsets.

- ^x:2
- ^y:2
- ^X:2
- ^Y:2
- ^left:2
- ^right:2
- ^up:2
- ^down:2
- ^at:a
- ^center
- ^north
- ^south
- ^east
- ^west
- ^northwest
- ^northeast
- ^southwest
- ^southeast

The "^x", "^y", "^X" and "^Y" directive would each set the x or y direction directly. 
The lowercase x/y would start from the origin. The uppercase X/Y would start from the other side
of the viewport.

The '^left', '^right', '^up', and '^down' directives is each to shift the offset
in the direction as instructed for a given number of grid distances.  The
value after the colon is expected to be a number that expresses the number of
grid units.  Note also that these operations are accumulative such that
incurring two "up:1" equals a single "up:2". Using of negative numbers is 
also allowed.

The '^at:a' directive is to set the current offset so that it coincides with the first
point of a path named "a". The value after the colon is expected to be the name
of an existing path, such as 'a', or 'a_1' for expressing the second point of
path 'a'. 

The '^center', '^north', '^south', '^east', '^west', '^northwest',
'^northeast', '^southwest', and '^southeast' directives would set the origin
relative to the current size of the viewport.

## Saving 'lastpt'

- ^lastpt:a

Any time during a path construction, it is possible to save the current
location of the 'lastpt' to a path variable so that it can be retrieved laster.
The following example would create a new path named "b" containing a single M
point that is at (4,5).

    path a = (1,1) [l:3,4] ^lastpt:b [l:5,6]




# Built-in path functions

During a path construction, a path function is used to return an independent
path segments constructed according to some parameters. For example, the
'&rectangle' path function can return a path segment that represents a
rectangle with a given width/height located at certain point.

Note that for a path function all its arguments must be either a path variable,
an absolute point, or a scalar.

- midpoint 

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

- scatterpoints 

The ``scatterpoints`` function is to create new path with the
points distributed evenly beteen the two end points. The 
first and the second argument denotes the first and the last
point of the path. The third argument is a scalar 
expressing how many middle points it needs to create between
the two end points. Thus if it is zero then the path will
be just the starting and ending points. If it is 1 then
the path will be three points, with one point in the middle.
In the following example two middle points will be created
such that the path contains four points.

```
path a = &scatterpoints{(1,0),(10,0),2}
```

- linelineintersect 

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


- linecircleintersect 

The ``linecircleintersect`` function returns new a path that
contains two points for the line and circle intersection. In the
following diagram the pts variable 'pts' will hold two points: (6,2)
and (4,2).

```
path b = &linecircleintersect{(0,0),(10,0),(5,0),10}
```

Note that the returned point is always arranged such that the first
point is on the left hand side of the second point.

- circlecircleintersect 

This method returns one or two points where two circles intersect.

```
path b = &circlecircleintersect{(0,0),10,(5,0),10}
```

- circlecircleintersectclip

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

- circlecirclediffclip

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

- circlepoints 

The general syntax is: &circlepoints(center,r,a1,a2,a3...), where
the 'center' denotes a path with a point expressing the circle
center, and 'r' for the radius of the circle, and 'a1', 'a2', 'a3',
etc., that expresses the angles starting from the first quadrant.
The returned value is the coords of individual points at these
angles.

```
path b = &circlepoints{(0,0),2,30,60,90}
```

- pie

Returns a closed path expressing a pie. 

```
path b = &pie(center,radius,angle,span)
```

- circle 

Returns a path expressing the circle. It has a syntax of:
&circle(center,radius), where 'center' is a path with at least one
point, and 'radius' a scalar.

```
path b = &circle(center,radius)
```

- ellipse 

This return a path expressing an ellipse. The syntax is following.
The fourth argument is the rotation in degrees, in counterclockwise
rotation.

```
path b = &ellipse(&center,xradius,yradius)
path b = &ellipse(&center,xradius,yradius,rotation)
```

- rectangle 

This returns a path expressing a rectangle between to points. There
are three ways construct the triangle, that is shown below. The
first one construct a rectangle between to opposing points. The
second one constructs a rectangle with an anchor point and then the
width and height of it. The third one construct a rectangle with
just the width and height, assuming the anchor point to be at (0,0)

```
path b = &rectangle{&point1,&point2}
path b = &rectangle{&point,width,height}
path b = &rectangle{width,height}
```

- triangle 

This returns a path expressing a triangle of three points. The syntax is: 

```
path b = &triangle(&point1,&point2,&point3)
```

- equilateraltriangle{(0,0),3}

This returns a equilateral-triangle centered at (0,0) and with a side
measurement equal to 3 grid length.

- regularpentagon{(0,0),3}

This returns a regular pentagon centered at (0,0) and with a side measurement
equal to 3 grid length.

- asatriangle{&Left,B,a,C}

This returns a triangle ABC when two angles and the side between the two
angles are known.  The triangle is oriented such that the known side is layed
horizontally with its left end point being at the point given by the 'Left'
argument. The second argument expresses the angle of the triangle located at
the left end point of the side, and the forth argument expresses the angle at
the endpoint on the right hand side.  The third argument is the length of the
side between the two angles.

- polyline 

This returns a path expressing a polyline. The syntax is:

```
path b = &polyline{&point1,&point2,&point3,...}
```

- polygon  

This returns a path expressing a polygon. The syntax is:

```
path b = &polygon{&point1,&point2,&point3,...}
```

- cylinder 

This expresses a upright cylinder drawn with an ellipse at the
bottom, with xradius/yradius, and a given height. The syntax is:

```
path b = &cylinder{&center,xradius,yradius,height}
```

- ymirror 

This returns a new path that is a mirror image of a given path. The
first argument is the old path, and the second argument is a scalar
that is a value on X-axis. The following example returns a new path
that is a mirrored image of 'a' off the x-axis.

```
path a = ...
path b = &ymirror{&a,0}
```

- mirror 

This returns a new path that holds a single point that is the mirror
image of the given point along a given line. In the following example
the returned point 'a1' would have been set to (-5,0)

```
path a = (5,0)
path b = (0,0)
path c = (0,10)
path a1 = &mirror{&a,&b,&c}
```

- bbox 

This returns a new path that represents the rectangle of the
viewport.

- grid

This returns a new path that represents a grid. It expects four 
arguments, the first two of which is the width and height of the grid,
and the last two represents the steps in the x-direction and y-direction.
The following example would have drawn a grid of 10-by-10, with grid
line separation of 1 in both directions.

```
path a = &grid{10,10,1,1}
```

- rotatepoint

This function would first rotate the point around a given point and then adjust
the new point alone the line between itself and the center such that its
distance from the center is exactly the given length.  The following example
would rotate the point (1,0) around a center that is (0,0) for 90 degrees
counter-clockwise angle and the finally adjust itself such that its
distance from the center is exactly 2.

```
path a = &droppoint{(0,0),(1,0),90,2}
```

- droppoint

The second form would have had three points, and the returned value
is a point on the line segment that is the first two points. The following
example is to return the point that is (0.5,0)

```
path a = &perpoint{(0,0),(2,0),(0.5,1)}
```

- rotate{&A,90}

This rotates a given path by a certain angle in an anti-clockwise rotation.

- translate{&A,10,20}

This translates a given path by a given distance in X and Y direction.

- bisect{&A,&B,&C,r}

This will compute a new point that lines on the line that is the result 
of bisecting the angle ABC, and with a distance of 'r' away
from vertex 'B'.



# Built-in path names

Following are built-in path that are readily available.

+ north

  This would have returned a point that coincides with the top side of the
  viewport and which centers horizontally.

+ south

  This would have returned a point that coincides with the bottom side of the
  viewport and which centers horizontally.

+ east

  This would have returned a point that coincides with the right hand side of the
  viewport and which centers vertically.

+ west

  This would have returned a point that coincides with the left hand side of the
  viewport and which centers vertically.

+ northwest

  This would have returned a point that coincides with the top left hand corner
  of the viewport.

+ northeast

  This would have returned a point that coincides with the top right hand corner
  of the viewport.

+ southwest

  This would have returned a point that coincides with the bottom left hand corner
  of the viewport.

+ southeast

  This would have returned a point that coincides with the bottom right hand corner
  of the viewport.

+ center

  This would have returned a point that coincides with the center of the
  viewport.

+ lastpt

  This would have returned a point that coincides with the latest path point
  that was used to construct a path.



# Drawing arrow head

If a coordinates is to be used directly then there are three commands that will
draw a arrow, reverse arrow, and double arrow for each path segments.

    arrow     (0,0)--(3,4)  (2,2)[h:4]
    revarrow  (0,0)--(3,4)  (2,2)[h:4]
    dblarrow  (0,0)--(3,4)  (2,2)[h:4]

However, for other operations such as 'drawanglearc', then
the 'arrowhead' should be set for the style, which is an integer
that is follows:

    arrowhead:1   arrow
    arrowhead:2   reverse arrow
    arrowhead:3   double arrow

# Remarks and problems

- The arrow head in HTML is done using MARKER-element. And for SVG 1.1 the
  limitation is that its coloring and filling is not changed to the line
  element it attaches to. It is a browser problem and currently there is no
  fix.

- For SVG a choice will have to be made. For a plain text a text-element is
  used and or for math text a nested SVG-element is to be constructed in the
  same way an inline-math is.  Unfortunately, there is no easily to allow for a
  text to be drawn so that part of it is plain text and part of it is math,
  because doing so would have required that we know exactly how many pixels the
  plain text would have taken, even though do know how many piexls a piece of
  math text is.  There is no way to correctly position the part of math text
  relative to the surrounding plain text if the length of the plain text isn't
  known.

- The text-aligmnents are default to 'urt' and not 'centered', thus we need to
  ensure previous auto choices of text alignment which asssumes the center are
  now being shown as 'urt' and thus we need to make some adjustments where
  necessary.

- Note that for a LATEX document with MetaPost commands, a single backslash by
  itself that is not followed by another backslash can cause the compilation of
  pdflatex to fail, even when that single backslash exists only in a comment.
  The same kind of behavior has also been observed in a TEX file as well.  Thus,
  care must be taken to ensure that this does not happen, basically to ensure
  that a single backslash is always escaped by another.



# Scalar and scalar expression

A "scalar expression" is an expression that evaluates to a number.  

    var a = (2+2)*(3+3)
    var a = cos(3+0.1415) + 12
    var a = 3 + pow(3,2)*3 + 2
    var a = 3 + E + 2
    var a = 3 + PI + 2
    var a = sign(-5)
    var a = 2*PI
    var a = 2*2e5
    var a = deg2rad(180)
    var a = 1/0
    var a = ln(0)

The scalar expression is expected by a command such as 'var'. It is also
expected inside a dollar-expression such as 

    text "${x*2}" (0,0)

The scalar expression has a syntax very much like those supported by the 'expr'
command of a modern day Tcl interpreter. It recognizes the plus, minus,
multiplication and division operators. The multiplication operator is the
asterisk, and the division operator is the slash character.

It provides a list of built-in functions such as 'ln' and 'sqrt'. It also
recognizes user defined functions which are created by a previous "fn" command.  It
supports operator precedence of multiplication and division over addition and
subtraction, and recognizes parentheses for grouping. It also recognizes a
number that is in the form of a scientific notation such as '2e5' or '2e-5'.

Following are examples of using an expression to assign a number to
a environment variable 'a'. Note that 'E' and 'PI' are two built-in constants
where the first one is the Euler's number and the second one being the
ratio of the circumference of a circle to its diameter.

Following is likely what to be observed in the outputs of a translation.

    % <-- var a = (2+2)*(3+3) -->
    % <-- *** env a = 24.000000 -->
    % <-- var a = cos(3+0.1415) + 12 -->
    % <-- *** env a = 11.000000 -->
    % <-- var a = 3 + pow(3,2)*3 + 2 -->
    % <-- *** env a = 32.000000 -->
    % <-- var a = 3 + E + 2 -->
    % <-- *** env a = 7.718282 -->
    % <-- var a = 3 + PI + 2 -->
    % <-- *** env a = 8.141593 -->
    % <-- var a = sign(-5) -->
    % <-- *** env a = -1.000000 -->
    % <-- var a = 2*PI -->
    % <-- *** env a = 6.283185 -->
    % <-- var a = 2*2e5 -->
    % <-- *** env a = 400000.000000 -->
    % <-- var a = deg2rad(180) -->
    % <-- *** env a = 3.141593 -->
    % <-- var a = 1/0 -->
    % <-- *** env a = Infinity -->
    % <-- var a = ln(0) -->
    % <-- *** env a = Infinity -->
    % <-- show ${a} -->
    % <-- show Infinity -->
    % <-- *** show Infinity -->

Note that if a scalar expression returns something that cannot be interpreted
as a valid number, "Infinity" or "NaN" might be observed.

It is also possible for a scalar expression to contain a variable that
refers to a x/y component of a path point. In the following example
the variable 'mx' will be assigned the sum of adding the "x"
components of the first two points in path variable 'pts', which will
be "1 + 3 = 4".

    path a = (1,2)--(3,4)
    var x = &a_0.x + &a_1.x
    var y = &a_0.y + &a_1.y
    show ${x}
    show ${y}

The dollor-expressin is designed to turn any expression into a string. For instance
the expression of ``${x}`` would have replaced itself with the actual value of the
variable ``x``. If ``x`` does not exist as a valid variable, "NaN" is returned. 

    var x = 1
    show ${x}

This would have been equivalent to the following single command
  
    show 1.000000

This is because by default, the precision is set to 6, which means any numerical
value will automatically be shown as a floating-point number with 6 digits of
decimal places. This precision can be changed by setting the "precision" option.

    config precision 10
    var x = 1
    show ${x}

The previous commands would be equivalent to the following single command:

    show 1.0000000000

However, as a special exception, if the variable is by itself and it
is recognized to be a string,
then it is shown verbatim.

    var x = @"Hello world"
    show ${x}

This would have been equivalent to the following command

    show Hello world



# Array of scalars

A list of scalars is also an expression that denotes a list of scalars, 
instead of a single one. This expression is enabled whenever a list
of scalars is expected, such as after the equal sign of a 'var' command
when the variable is preceeded by an at-sign, in which case the variable
is expected as an array that is to hold a list of numbers instead
of holding a single one.

    var @a = 0 1 2 (1+2) 

The same expression could be found elsewhere where a list of scalar is expected,
such as for a 'cartesian' and 'argand' command.

    cartesian-yplot {fn:f} 0 1 2 (1+2)
    argand-dot 0 1 2 (1+2)

It could also be found in a 'for' loop command

    for a in 0 1 2 (1+2); do
      ...
    done

The set of rules for denoting a list of scalars is different than that used for
denoting a single scalar. The main difference is that, by default, each scalar
is to be understood to be separated from its neighboring scalars by one of more
white spaces. In the previous example, a list of four scalars are recognized,
and last one is also recognized as an expression and will be processed as such.

In addition, following four syntaxes are recognized.

- Properties
- Texts
- List-expression 
- Spread-expresson
- Range-expression
- A fn-directive

The spread-expression will be recognized by the presence of an exclamation mark
within the expression. The following example would have produced a total of 22
points, with the first point being 0, and the last point being 10, and
additional 20 points generated between 0 and 10 such that the distance between
any two neighboring points is the same.

    var @a = [0!20!10]

The range-expression comes with two flavors, the one with two colons, and the one with
three colons. The only difference between the two is that the first one assumes a step
of 1, and the second one is computed dynamically based on the distance of the first 
one and the second one. For instance, following example would have generated a list
of numbers that are 1, 2, 3, 4, 5, 6, 7, 8, 9, and 10.

    var @a = [1:10]

The following would have generated a list composed numbers that are 1, 4, 7, 10.

    var @a = [1:4:10]

Note that in the case of the having three columns the middle number serves as the 
second number after the first one, and additional numbers are generated with the same
difference between the second and the first, and with the last number not exceeding
the third one. 

If none of the previous patterns were found to be true, then it is assumed to be
a list-expression, where each number is to following the previous one and is separated
by a comma.

    var @a = [1, 2, 3, 4]
    var @a = [1,2,3,4]

Note that the spaces after each comma is optional. In addition,
the spread-expression and two range-expressions 
can be freely mixed and appear in the same expression for describing
a list of number. Following are all
valid expression of genetating a list of integers from 1-10.

    var @a = 1 2 3 [4:10]
    var @a = [1:2] [3:4] 5 6 7 [8:10]
    var @a = [1,2,3,4] [5,6,7,8] 9 10

We can also copy an existing array when building a new array. For instance,
when array "a" has been built like that in the previous example, we can copy its
content when building a new array named "b" such as follows.

    var @b = @a 11 12 13

The array "b" will be a list of integers from 1-13. The way of referencing an existing
array using notation such as "@a" can even be found in a 'for' loop such as the following,
in which case the variable "i" will iterate over all numbers held by array "@a".

    for i in @a; do
      show ${i}
    done

An entire array can be show by the dollar-expression as well. Ensure that the array
variable is to appear by itself, and there are no other arithmetic operations involved.

    var @a = 1 2 3
    show ${a}

A directive is also to be recognized. A directive adds extra
possibility to the list of numbers. For the moment only the "fn" directive is supported. This
directive allows for a function to be called such that the output of this function
replaces the original scalar.

    var @a = ^fn:sqrt 1 2 3 4 5 6
    show ${a}

Following would be the output of these commands:

    % <-- var @a = ^fn:sqrt 1 2 3 -->
    % <-- *** env @a = 1 1.4142135623730951 1.7320508075688772 -->
    % <-- show ${a} -->
    % <-- *** show 1 1.4142135623730951 1.7320508075688772 -->

If two "fn" directives are encountered, the last "fn" is called first, and the output 
of which becomes the input to the first "fn". 

    fn add2(x) = x+2
    var @a = ^fn:add2 ^fn:sqrt 1 2 3
    show ${a}

In the previous example each scalar is to go
through the "sqrt" function first before being sent to the "add2" function.

    % <-- fn add2(x) = x+2 -->
    % <-- *** fn add2(x) = x+2 -->
    % <-- var @a = ^fn:add2 ^fn:sqrt 1 2 3 -->
    % <-- *** env @a = 3 3.414213562373095 3.732050807568877 -->
    % <-- show ${a} -->
    % <-- *** show 3 3.414213562373095 3.732050807568877 -->

It is also possible to refer to an array element. To do that simply use the variable
followed by an underscore itself.

    var @a = 1 2 3
    var @b = a_1 a_2

Following would be the result of the translation.

    % <-- var @a = 1 2 3 -->
    % <-- *** env @a = 1 2 3 -->
    % <-- var @b = a_1 a_2 -->
    % <-- *** env @b = 2 3 -->
    % <-- show ${b} -->
    % <-- *** show 2 3 -->


# Built-in scalar functions

Following are built-in functions provided by Diagram.

+ ln(x)
       
  It returns the natural log of a number

+ log(x)  

  It returns the base-10 log

+ log2(x)  
  
  It returns the base-2 log

+ exp(x)      

  It returns the output of an exponential function for which the base
  is set to be the Euler's number: exp(1) = e; exp(2) = e^2

+ pow(x,y)     
  
  It returns the result of raising x to the y-th power: pow(3,2) = 9; pow(4,2) = 16

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

+ if(cond,x,y)

  This function will return value 'x' if the condition is true, or 'y'
  if the condition is false. In the following example environment
  variable 'a' will be assigned a number that is 0 and 'b' a number
  that is 1.

  ```
  fn f(x) = if(x>10,1,0)
  var a = f(10)  
  var b = f(11)  
  ```

+ isfinite(x)

  This function returns 1 if the number is a finite number, ie. a number
  that is not NAN is INFINITY. Otherwise it returns 0.

+ isnan(x)

  This function returns 1 if the number is NAN, and otherwise it returns 0.




# Built-in scalar constants

Following are built-in scalar constants, which can be used as if they
are arguments. For instance, 

    var arc = 2*PI
    var mynum = 1 + 2*I

This the 'arc' env-variable would have been assigned the value of 6.28.

+ PI

  The constant π (3.141592654...)

+ E

  The Euler's number (2.71828...), the base for the natural logarithm

+ I

  The imaginary unit. This allows a complex number to be construct such as
  "1+2*I", for a complex number that is "1+2i".




# The 'origin' command

The 'lastpt' command sets the following parameters for the current
drawing environment.

- lastpt ^up:2
- lastpt ^down:2
- lastpt ^left:2
- lastpt ^right:2
- lastpt ^x:2
- lastpt ^y:2
- lastpt ^X:2
- lastpt ^Y:2
- lastpt ^at:a
- lastpt ^pt:a
- lastpt ^center
- lastpt ^north
- lastpt ^south
- lastpt ^northwest
- lastpt ^southwest
- lastpt ^northeast
- lastpt ^southeast
- lastpt ^east
- lastpt ^west

If it starts with "left:<x>", "right:<x>", "up:<y>", 
"down:<y>", where the distance expresses the number of grid units
to move in that direction. 

If it starts with "x:", then it expresses the distance from the left hand side
of the viewport. 

If it starts with "y:", then it expresses the distance from the bottom side
of the viewport.

If it starts with "X:", then what follows will be interpreted as 
expressing a number that is "x" number of unit distances from the right hand side
of the viewport.

If it starts with "Y:", then what follows is to be interpreted as
expressing a number that is "x" number of unit distances away from the top of the
viewport.

If it is "at:a" then the 'lastpt' will be set to a point coincides with the first
point of that path.

If it is "at:a_0" then the 'lastpt' will be set to a point coincides with the first
point of that path.

If it is "at:a_1" then the 'lastpt' will be set to a point coincides with the second
point of that path.

If it is "at:a_2" then the 'lastpt' will be set to a point coincides with the third
point of that path.

If it is "at:a_3" then the 'lastpt' will be set to a point coincides with the forth
point of that path.

If it is "pt:a" then it creates a new path variable named 'a' such that it
contains a single point that coincides with the current position of 
'lastpt'. 



# The 'origin' command

The 'origin' command sets the following parameters for the current
drawing environment.

- origin ^up:2
- origin ^down:2
- origin ^left:2
- origin ^right:2
- origin ^x:2
- origin ^y:2
- origin ^X:2
- origin ^Y:2
- origin ^sx:2.5
- origin ^sy:2.5
- origin ^s:2.5
- origin ^at:a
- origin ^pt:a
- origin ^reset
- origin ^center
- origin ^north
- origin ^south
- origin ^northwest
- origin ^southwest
- origin ^northeast
- origin ^southeast
- origin ^east
- origin ^west

If it starts with "left:<x>", "right:<x>", "up:<y>", 
"down:<y>", where the distance expresses the number of grid units
to move in that direction. 

If it starts with "x:", then it expresses the distance from the left hand side
of the viewport. 

If it starts with "y:", then it expresses the distance from the bottom side
of the viewport.

If it starts with "X:", then what follows will be interpreted as 
expressing a number that is "x" number of unit distances from the right hand side
of the viewport.

If it starts with "Y:", then what follows is to be interpreted as
expressing a number that is "x" number of unit distances away from the top of the
viewport.

If it is "sx:2.5" then it sets the scaling factor in the horizontal direction 
to be 2.5. 

If it is "sy:2.5" then it sets the scaling factor in the vertical direction 
to be 2.5. 

If it is "s:2.5" then it sets the scaling factor in the horizontal and
vertical direction to be 2.5. 

If it is "at:a" then the 'origin' will be set to a point coincides with the first
point of that path.

If it is "at:a_0" then the 'origin' will be set to a point coincides with the first
point of that path.

If it is "at:a_1" then the 'origin' will be set to a point coincides with the second
point of that path.

If it is "at:a_2" then the 'origin' will be set to a point coincides with the third
point of that path.

If it is "at:a_3" then the 'origin' will be set to a point coincides with the forth
point of that path.

If it is "pt:a" then it creates a new path variable named 'a' such that it
contains a single point that coincides with the current settings of the
new origin.  If this path variable already exists it will be overwritten.

If it starts with "reset" then the current origin will be set to (0,0) and the 
scaling factors will be reset to 1 in both horizontal and vertical directions.

If it starts with 'center', 'north', 'south', 'northwest', 'northeast', 'southwest', 
'southeast', 'east' and 'west', then it sets the origin to the center,  the four  
corners of the viewport, or the middle of the four sides of it.


# The 'id' command

- id 0
- id 1
- id a
- id A
- id A0
- id a12
- id node0
- id node12

Set the "id" to a string. This string would be interpreted in constructing
ID(s) for path, node, and other commands that would have required an ID.

If set to a string then it must be either 'a' or 'A'. If set to 'a' then the
next ID assigned will be 'a', after which the 'id' is changed to 'b'. It
cycles through 'a' to 'z', and then go back to being 'a' again.  If set to
'A', then it cycles through 'A' to 'Z' and then go back to being 'A' again.

If set to an integer, then that integer will become the next assigned ID, and
then the 'id' parameter will be incremented by 1. 

It can also be set to a string such as 'A0', 'a12', 'node0', 'node12', with a
pattern of one of more alpha letters followed by one of more digits. In this
case this ID will be used as is for the next auto ID assignment, but then
this ID will be changed such that the alpha letters remain the same but
number incremented by 1.  For instance, if the current 'id' parameter is
'A0', it will become 'A1' after 'A0' has been assigned. Similarly, 'a12' is
to become 'a13', 'node0' to 'node1', and 'node12' to 'node13'. 

If none of the previous pattern is detected, the first assigned ID
will be 0, and then next one 1, etc.



# The 'group' command

The "group" operation is to create a new group that holds a collection
of attribute values such that they will be applied to an element
all at once. This allows, for instance, creating of many different
boxes all of the same attributes. Changes made to a group affects all
elements inheriting attributes from that group.

    group mygroup {linesize:1,w:3,h:2}
    box {group:mygroup} (0,0) (1,2) 
    box {group:mygroup,linesize:2} (0,0) (1,2) 

In the previous example the first box will be created with "linesize:1", "w:3",
and "h:2" attributes. The second box will have the same set of attributes as
the first one except that it will have "linesize:2" instead of "linesize:1".




# The 'path' command

The 'path' command can be used to create path variables. A path
variable must start with a upper case or lower case letters, and
followed by one or more upper case or lower case letters, or digits.
Symbols and operators are not allowed.

    path a = (1,1) -- (2,2) -- (3,4)

The name of a path must conform a valid symbol name, which must start with an
upper case or lower case letters, and followed by one or more letters and/or
digits. Note underscore or other punctuations are allowd. Followig are valid
path names:

    a
    ab
    a0
    ab0
    ab00
    ab00ab00

The path command also has provision to allow for something akin to
JavaScript "array destructuring" statement, in which case individual
points of a path are assigned to different path variables at the same
time by the same assignment instruction. In the following assignment
instruction path variables 'a', 'b' and 'c' are each created and
assigned three different points of the same path that was drawn by the
``draw`` statement.

    path A = (1,1) -- (2,2) -- (3,4) -- (4,5)
    path [a,b,c] = &A

Each sub-variable must be separated from other sub-variables by one or
more slash character. You can skip ahead and bypass certain points by
not including any variables in between slashes. For example, you can
choose to assign the first point to variable 'a' and the third point
to variable 'b' as follows.

    path A = (1,1) -- (2,2) -- (3,4) -- (4,5)
    path [a,,b] = &A

Following example will skip the first two points and assign
the remaining two points to variable 'a'.

    path A = (1,1) -- (2,2) -- (3,4) -- (4,5)
    path [,,a] = &A

Note that the name of the path, as well as that of a scalar variable, a scalar
array, or a scalar function, must starts with a letter, followed by one or more
letters of digits. Names such as 'a', 'b', 'a0', 'b0', 'aa0', 'a0a', 'a0a0' are
all valid names. Names such as '0', '1', '0a', '0b', '00ab', etc., are not valid
names.

Aside from the path-destructuring syntax, such that each path symbol will be given
just one of the points, there is also a path-desequencing, such that only one of the 
symbols in the list will be picked to receive the entire path expression.
This syntax is typically used in conjunction with a 'for' loop command.
In the following example, the path 'A' will receive "(1,1)[h:2]",
and path 'B' will receive "(3,3)[h:2]", and path 'C' will receive "(5,5)[h:2]".

    for i in [1, 3, 5]; do
      path @[A,B,C] = (${i},${i]}) [h:2]
    done

This is done internally by looking up the current value of '@' scalar, which is
internally maintained by Diagram and is always assigned an integer indicative
of the iteration. If this scalar is 0, then the first symbol is selected. If
the scalar is 1, the second scalar is selected. So on and so forth.  All symbol
names listed must conform to the restriction of being a valid symbol name.  If
the list runs out, then no symbol name is assumed.



# The draw/fill/stroke commands    

Following commands treats the input argument as path.

- draw
- fill
- stroke
- arrow
- revarrow
- dblarrow

The 'draw' command would draw connecting lines between path points.
Typically it is straight lines, but Bezier curves are also supported.
This includes quadratic and cubic curves. The SVG arc is also
supported.

    draw (0,0)--(1,1)--(2,2)

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

Here the second and third points are each expressed as a distance away from its
previous point, which is to move right for one grid unit and then up for one
unit. Note that the coordinates in Diagram are always expressed in terms of
grid unit. There are other relative position syntaxes, that are shown below.

Note that for all 'draw' related commands, a path can be expressed such that it
contains multiple disjoint segments. For example, we can express to draw two
disjoint line in a single 'draw' command such that the first line segment goes
from (0,0) to (2,3) and the second line segment goes from (4,5) to (6,7). 

    draw (0,0)--(2,3) (4,5)--(6,7)

For example, for the following 'draw' command, where
there is a closed triangle and a line. 

    draw (0,0)--(2,0)--(2,2)[z] (4,0)--(6,2)

For MetaPost output, each path segment requires a separate "draw" command. For
SVG, a single PATH elements is sufficient; the SVG is implemented such that a
"M" operation can follow a "z". 

By default, the 'draw' command would stroke the path. However, if a path
segment is closed (when ended by a "cycle" keyword), then then it would also
attempt to fill the area. However, the 'fill' command will attempt to fill the
area regardless if it is closed or not. On the other hand, the 'stroke' command
will stroke the path, such that if the path is closed, a line will appear
between the last point and the first one.

For SVG, when a 'fill=' attribute is specified the rendering engine will
attempt to fill the area, even when the area is not closed. For
MetaPost/MetaFun the path will have to be closed before calling the 'fill'
MetaPost, as otherwise the compilation will complain.





# The 'drawcongbar' operation

This operation is to draw a short bar to indicate the congrudencies
of two or more line segments. It will look for all line segments
in the coords and will draw a short bar (can be changed via vartype
style) in the middle of the line. In the following example a short
bar is to be drawn in the middle of the horizontal line and in the middle
of the vertical line.

    drawcongbar (0,0) [h:4] [v:4]

The length of the short bar is determined by the barlength-option,
The bartype-option will also be checked
to see if it has been set. It can be set to 'double' to indicate a double bar, 
or 'triple' to indicate a triple bar. The gap between the bar lines are determined
by the gap-option, which defaults to 0.1 unit length.


# The 'drawanglearc' command

The 'drawanglearc' command is to draw an arc or half square showing
the angle formed by two consecutive line segments of a polyline
encountered in the given path. The angles formed is assumed to start
from the first point to the third point, where the second point acts
as the vertex of the angle, and this will continue for the rest of the
path, picking any two consecutive line segments, and skipping those
that are not. If the path is closed, the line segment pairs between the last
line segment and the first is also checked. 

If the 'inversed' style option is set to 1, then the angle formed is
assumed to run from the third point to the first.

This command will also be able to drawn angle label. If the path is
closed then the angle between the last point and the first point is
also to be drawn. If any of the angle is found to be exact 90 degrees,
a square is to be drawn instead of the arc.

    drawanglearc "1" "2" (2,0)--(0,0)--(0,2)

If the angle is found to be around 90, then a square is drawn instead
of an arc. However, a square can be forced if ".sq" option is given.

    drawanglearc.sq "1" "2" (2,0)--(0,0)--(0,2)


# The 'drawcenteredtext' command

The 'drawcenteredtext' command is to draw a piece of text
in the center of a line segment found in the path.

    path tri = &triangle{(0,0),(4,0),(2,2)}
    stroke &tri
    drawcenteredtext "1" "2" "3" &tri


# The 'drawslopedtext' command

The 'drawslopedtext' command is to draw a sloped text centered along a line
segment.  The command scans for the presence of all line
segments in the coodinates provided, and for every line segment found,
place a label that run along the slope of the line.

    drawslopedtext "Hello" "World" (0,0) [h:4] [v:4]

By default, the text will be placed on top of the line. But it can be 
placed at the bottom of the line if the ".bot" subcommand is supplied.

    drawslopedtext.bot "Hello" "World" (0,0) [h:4] [v:4]





# The 'drawdot' command

The 'drawdot' command is to draw a dot to mark the location. Similar to
the primitive command, a single dot is to be repeated for all points
on the given path. Thus, following command will draw three dots each
at three different locations of the input path.

    drawdot (1,1) (3,4) [l:2,1]

The 'drawdot' command provide several subcommands that allows for a
different shape to be drawn instead of a circular dot.

    drawdot.hbar (1,1) (3,4) [l:2,1]
    drawdot.vbar (1,1) (3,4) [l:2,1]

For 'drawdot' command, the color can be specified using the 'dotcolor'.

    drawdot {dotcolor:orange} (1,1) (3,4) [l:2,1]

For 'hbar' and 'vbar' subcommands the 'linecolor' attribute would have
expressed the color of the lines.

    drawdot.hbar {linecolor:orange} (1,1) (3,4) [l:2,1]
    drawdot.vbar {linecolor:orange} (1,1) (3,4) [l:2,1]

The diameter of the dot can be set using the 'dotsize' attribute.

    drawdot {dotcolor:orange, dotsize:10} (1,1) (3,4) [l:2,1]

For 'hbar' and 'vbar' subcommands the 'linesize' attribute would hve
expressed the width of the line.

    drawdot.hbar {barcolor:orange, linesize:2} (1,1) (3,4) [l:2,1]
    drawdot.vbar {barcolor:orange, linesize:2} (1,1) (3,4) [l:2,1]

The 'dotsize' and 'linesize' are both expressed in terms of 'pt'. For
'hbar' and 'vbar' commands, the length of the bar can be specified via
the 'barlength' attribute. It is a number that expresses the line
length in grid unit. If not specified, the default value is 0.25,
which is one-quarter the length of a grid, and it can be changed to a
different value by the 'set barlength' command.

    drawot.hbar {linecolor:orange, barlength:0.5} (1,1) (3,4) [l:2,1]
    drawdot.vbar {linecolor:orange, barlength:0.5} (1,1) (3,4) [l:2,1]

Here, the length of each bar is going to be about half the length of
the grid. Note that for 'vbar', it's lower end point aligns with the
location, and for 'hbar', its left end aligns with the location.


# The 'drawtext' command

The 'drawtext' command is designed to place a piece of text in one or more path
points. For instance, each of the following 'drawtext' commands will place a piece
of text at the given location.

    drawtext.rt "A" (1,1)
    drawtext.lft "B" (2,2)
    drawtext.top "C" (3,4)

The text must appear before any path points, and must enclosed within a set of
quotation marks. 

The text to be drawn is always to be shown in a single line. It will
be shown in the first path point encountered. However, if additional
path points are specified, then the same text is to be repeated 
across the other path points.

    drawtext "A" (1,1) (2,2) (3,4)

The option of this command specifies how the text is aligned relative
to the path point. For instance, if the option is 'top' then the 
text will be aligned in such a way that it appear on top of the 
path point and centered horizontally. Without the option,
it defaults to 'urt'.

    drawtext.top   -  top
    drawtext.bot   -  bottom
    drawtext.lft   -  left
    drawtext.rt    -  right
    drawtext.ulft  -  upper left
    drawtext.llft  -  lower left
    drawtext.urt   -  upper right
    drawtext.lrt   -  lower right
    drawtext.ctr   -  centering the text

It is also possible to express the fact that each path point is to show a
different piece of text, by placing double backslashes inside the text, such
that the text is being divided into segments, where each segment represents an
individual text to be placed at the location of one of the path points, 
and in the same order. For instance, the following command would have placed
letter "A" with the first point, letter "B" with the second point, and letter "C"
with the third point.

    drawtext "A" "B" "C" (1,1) (2,2) (3,4)

It is also possible to express that a math expression instead of plain text.
by setting is such that each text starts with "{{" and ends with "}}".
In the following example the first and the last text labels are 
treated as math text while the middle one is treated as plain text.

    drawtext {math:1} "{{A_0}}" "Hello" "{{A_2}}" (1,1) (2,2) (3,4)

The text command also allows for each entry to be laid out such that it is
multi-line paragraph. Note that this only works for plain text, and not
for math.

    drawtext.ulft {fontsize:7} "degree\\3" (-3,2)
    drawtext.urt  {fontsize:7} "degree\\2" (3,2)
    drawtext.llft {fontsize:7} "degree\\2" (-3,-2)
    drawtext.lrt  {fontsize:7} "degree\\3" (3,-2)

In addition, the 'drawtext' command has the capability to style the font using
the "fontfamily" and "fontstyle" style options. Note that this might not 
always work for something. For instance, for LATEX and CONTEX it is not
possible for specifying both a monospace and an italic.

    drawtext.ulft {fontfamily:monospace,fontstyle:italic,fontsize:7} \
          "degree\\3" (-3,2)



# The 'cartesian' command

The 'cartesian' is a compound command that has different subcommands listed
below.

- cartesian.1.setup xorigin yorigin gridrange
- cartesian.1.grid xmin ymin xmax ymax
- cartesian.1.xaxis xmin xmax
- cartesian.1.yaxis ymin ymax
- cartesian.1.ytick y1 y2 y3 ...
- cartesian.1.xtick x1 x2 x3 ...
- cartesian.1.yplot {f:P} x1 x2 x3 ...
- cartesian.1.xplot {f:P} y1 y2 y3 ...
- cartesian.1.dot x1 y1 x2 y2 x3 y3 ...
- cartesian.1.line x1 y1 x2 y2 x3 y3 ...
- cartesian.1.arrow x1 y1 x2 y2 x3 y3 ...
- cartesian.1.text.rt x1 y1 x2 y2 x3 y3 ...
- cartesian.1.ellipse x y Rx Ry Phi
- cartesian.1.arc x y R startAngle stopAngle

The ``cartesian`` command is used to draw plots, curves, axis, ticks
that are related to a single Cartesian coordinate. It is a composite
command that includes many sub-commands. All subcommands must follow
the word 'cartesian' after a dot symbol. The subcommand itself can
also have its own option, such as 'cartesian.label.rt'.

The cartesian command is a compound command. It has many subcommands. which
must be listed after the dot. The first string after the dot serves
as the ID of the cartesian, in cases where there might be multiple
setups of a cartesian coordinates, in which case each cartesian coordinate
is capable of its own setup.

The ``cartesian.setup`` command would set up a Cartesian coordate to be used. The
first two arguments defines the low left hand corner where the origin
of the cartesian coordinates will appear inside the Diagram. It is
specified in grid coordintes. For example, if they are passed as 2 and
3, then the origin of the Cartesian coordinates will appear at the
location of (2,3) of the Diagram.

    cartesian.1.setup 2 3 0.5

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

The ``cartesian.1.grid`` command asks to draw a grid with the lower-left
corner at (xmin,ymin) and upper-right corner at (xmax,ymax). The increment
is default at 1. The increment for x-direction can be set by the xstep-option
and the increment for y-direction can be set by the ystep-option.

    cartesian.1.grid -5 -5 5 5
    cartesian.1.grid {xstep:0.5, ystep:0.5} -5 -5 5 5

The ``cartesian-xaxis`` command is to draw the x-axis. The only two
parameters passed to it is the lower and upper range that this axis
entails. Similarly, the ``cartesian-yaxis`` command draws the y-axis
with similar parameter requirements.

    cartesian.1.xaxis -0.75 5.6
    cartesian.1.yaxis -0.75 4.5

The ``cartesian-xtick`` is used to draw ticks as well as labels on the
x-axis of the coordinate. The list of arguments passed to this command
is a list of location of these ticks on the axis. For example, if
passed as "1 2 3" then the ticks will appear where (1,0), (2,0), and
(3,0) points are. For each tick, a label string will also appear
unerneath that tick. Similarly, the ``cartesian-ytick`` command does the
same thing except for that it is for the y-axis.

    cartesian.1.xtick 1 2 3 4 5
    cartesian.1.ytick 1 2 3 4

The `cartesian dot` command shows one or more points as dots inside
the coordinate. Every two numbers are interpreted as a pair of (x,y)
coordinates.

    cartesian.1.dot  -4 0 4 0 \
                  -5 0 5 0

The 'cartesian-line' and 'cartesian-arrow' commands are similar,
except for that the first one will draw connecting lines between all
points, and the second one also adds an arrowhead at the very end of
the line.

    cartesian.1.line  -4 0 4 0 \
                    -5 0 5 0

The 'cartesian-yplot; is similar to 'cartesian-dot', in that it
generates a series of dots. Only the x-coordinates of plotted points
are provided, and the y-coordinates of each point is calculated by the
supplied function, which must be provided by the "f" member of the
option.

    fn P(x) = pow(x,2)
    cartesian.1.yplot {f:P} 1 2 3 4 5

In the previous example, following points will be shown: (1,1), (2,4),
(3,9), (4,16), and (5,25) as dots. The Range expression in this case
can be useful, such as the following:

    fn P(v) = pow(v,2)
    cartesian.1.yplot {f:P} [1:5]

The name of the function could be arbitrary. However, it must be
specified by the "f" member of the option. The function must have been
previously defined by a "fn" command, and must only accept one
argument and return a single scalar.

The 'cartesian.1.xplot' is similar except for that the input arguments
expresses a range of values as the y-coordinates of the points, and
the funtion generates the corresponding x-coordinates.

    fn P(v) = sqrt(v)
    cartesian.1.xplot {f:P} 1 4 9 25 16 25

The ``cartesian-label`` command draws a text at the location of the
cartesian coord. The text itself is expressed via the quotation marks
that must proceed the any option and all scalar values. Following
example draw texts at location (-5,0), (-5,1) and (-5,2) of the
Cartesian coordinates, and at each point the text will be "P(0)",
"P(1)", and "P(2)". The text is to appear at the bottom of each point.

    cartesian.1.text.bot "P(0)\\P(1)\\P(2)" -5 0 -5 1 -5 2



# The 'barchart' command

The 'barchart' is another compound command that is to be used
with many subcommands. Following is a list of some
of its subcommands.

- barchart-setup xorigin yorigin xwidth ywidth xrange yrange
- barchart-bbox
- barchart-vbar
- barchart-ytick
- barchart-xtext

The 'barchart-setup' command would setup the barchart and config it.
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

    barchart-setup 0 0 10 15 5 0.4

The 'barchart-bbox' is to draw a bounding box covering the entire
barchart- It does not require any arguments.

The 'barchart-vbar' is to draw vertical bars. The arguments are the
y-values of the bar themselves. Thus, to draw the previous five bars,
it will be

    barchart-vbar 0.1 0.3 0.2 0.4 0.2

The 'barchart-ytick' operation is to draw "ticks" along its y-axis on
the left hand side, and also show the label for each axis to its left
hand side. Its arguments are the location of ticks, and they should be
stated in the same input range as those of the 'vbar'. For example, if
ticks were to be placed at the location of '0.1', '0.2' and '0.3',
then following command should be issued.

    barchart-ytick 0.1 0.2 0.3

The 'barchart-xtext' is to add information at the bottom of each bar
as to express what these bars are intended for. The text must be
provided by a set of quotation marks that must proceed all options and
scalars. The scalars express the location of vertical bars on x-axis.
Thus, if the input range has been set to 5, the first bar is to appear
between 0-1, and second bar 1-2, and so on, thus, the center location
for the first vertical bar is 0.5, and center location for the second
bar is 1.5, etc.

    barchart-xtext "P(0)\\P(1)\\P(2)" 0.5 1.5 2.5

The text will always be centered at location, and placed directly
below the bar.

# The 'if' command

The 'if' command is used to conditionally execute some block of codes
depending on the condition of an Boolean expression, such as 'i > 10',
'i == 10', 'i >= 10', 'i < 10', 'i <= 10', and 'i != 10', etc.

    if i > 10; then
      show ${i}
    elif i > 5; then
      show ${i}
    elif i > 0; then
      show ${i}
    else
      show ${i}
    fi

Note that the Boolean expression must be ended by a semicolon. The 'elif' and
'else' components are optional, and can be omitted. The body statements with
each branch should carry an indent so that it does not interfere with the
process of 'elif', 'else' and 'fi' lines. The 'fi' line would terminate this
command.

A compound Boolean statement is possible, in which case each individual
Boolean statement is to be joint by the keyword "AND" and/or "OR".

    if i > 10; AND j == 10; then
      show ${i} ${j} 
    fi

    if i > 10; OR j == 10; then
      show ${i} ${j} 
    fi

Note that each individual Boolean expression should still end with a semicolon
regardless if it is to be joint by another Boolean expression down the road.

There isn't a limit when it comes to how many Boolean expressions can be
joint by AND/OR.

    if i > 10; AND j == 10; OR k != 5; then
      show ${i} ${j} ${k}
    fi

It should be pointed out that all joins are treated equally. This means that
they will not be internally regrouped based on the order of operations of these
joins, as might have been the case for some other languages. The result of a
previous join becomes the input to the next join.

In cases where there is a misspell, or the join simply does not exist, then the
result of this Boolean expression simply overrides the one before it. For
instance, the following 'if' command considers the expression true only if
variable 'j' is set to 10, completely ignoring the state of variable 'i',
because of the fact that there isn't a join thus the second expression
always overrides the first.

    if i > 10; j == 10; then
      show ${i} ${j}
    fi



# The 'for' Command

A 'for' command is provided by Diagram such that a number of commands
can be repetitively executed, and each iteration these commands would
have been run under a different set of arguments. The basic syntax is

    for a in [1, 2, 3, 4]; do
      draw (${a},${a})--(0,0)
    done

In the example, the 'draw' command will be executed exactly four
times, each of which looks like the following.

    draw (1,1)--(0,0)
    draw (2,2)--(0,0)
    draw (3,3)--(0,0)
    draw (4,4)--(0,0)

The 'for' command starts with the keyword 'for', followed by a one or more
pairing of a "loop variable" to a range of floats. 
Each pairing must be terminated by a semicolon,
and additional pairs are allowed. 
The last part of the 'for' command must be the word "do".

The 'for' command is designed to repeat the execution of its "loop body",
which consists of a list of command up until the line "done", but not including
this line. The exact number of repetition depends on the total of floats
being iterated over. The total number of repetitions is always equal to the longest
number of floats in each pairing, and the variable without additional floats to iterate over will simply
retain its last assigned value.

During each iteration, each loop variable is to become an environment variable,
which can be accessed via a dollar-expression, or be used in other places where
an environment variable is expected.

Following is an example of iterating over two loop variables: 'a' and 'b'.

    % Using for-loop
    for a in [1,3]; b in [2,4]; do
      draw (${a},${a})--(${b},${b})
    done

Following is the equivalent commands without using the for-loop.

    % Not using the for-loop
    draw (1,1)--(2,2)
    draw (3,3)--(4,4)

Note that it is recommanded that the lines of the loop body be indented
with at least one space. This allows for the recognition of the line "done"
which must be by itself for the entire line, and without indentation. 
The loop body, once extracted, will undergo "trimming" such that all lines
will be trimmed the same number of white spaces on the left hand side. 
This design allows for writing of "nested for loop" possible, such that 
inner loop will retain its independence during the extraction of loop body
of the outer loop.

    for a in [9,19,29]; b in [0.4,0.5,0.6]; do
      origin x:${a}
      for c in [16,4]; do
        origin y:${c}
        draw (0,0) [h:-6] [v:6]
        draw (0,0) [q:-6,0,-6,6]
        path P0 = (0,0)
        path P1 = (-6,0)
        path P2 = (-6,6)
        dot &P0 &P1 &P2
        label.lrt  "P₀" &P0
        label.llft "P₁" &P1
        label.ulft "P₂" &P2
        path line1 = &P0 -- &P1
        path line2 = &P1 -- &P2
        path m0 = &midpoint{&line1,${b} }
        path m1 = &midpoint{&line2,${b} }
        dot &m0 &m1
        draw &m0 -- &m1
        path line3 = &m0 -- &m1
        path B = &midpoint{line3,${b} }
        dot &B
        label.bot "m₀" &m0
        label.lft "m₁" {dx:-.1} &m1
        label.urt "B" &B
      done
      label.bot "t=${b}" (-3,-2)
    done
      
Each 'for' command would have also added a new environment variable called '@'
that will be assigned an integer equal to the current iteration. The first
iteration this variable will be assigned the value 0, and the second iteration
the value 1, and so on. Note that during the situation of a nested loop, the
same '@' env variable will be overridden by the inner for loop.

The syntax for each pairing is so far only supporting the "in" keyword,
such that the loop variable is found to be followed by the word "in",
and then the list of floats. The list of floats would follow the same
syntax found in other commands such as "cartesian".



# The "fn" command

The "fn" command serves to create a user defined arithmetic function.
This command starts with letter "fn", followed immediately by a valid
function names, an equal sign, and an arithmetic expression.

In the following example a function named 'f' is being defined with a
single argument and an expression that evaluates an arithmetic
expression with 'x' as its argument. After this command, referencing
this function with an argument such as "f(4)" inside any other
arithmetic expression is equivalent to evaluating an expression that
is "1 + log2(4)". In the following example, variable 'a' is being
assigned a value of 3 at the end of that command.

    fn f(x) = 1 + log2(x)
    var a = f(4)

A function created by a "fn" command can be thought of as a user-defined
function, as opposed to other built-in function such as 'sqrt', 'sign', 'sin',
'floor', 'ceil', 'pow', etc. Some commands, such as 'cartesian-yplot', allows
a function name string to be passed in that will be used for plotting a group
of x/y coordinates, such as the one shown by the following example.

    fn P(x) = pow(x,2)
    cartesian-yplot {fn:P} 1 2 3



# The range-expression Syntax

When a Range-expression consists of two quantities separated by a single colon,
such as "1:10", the first one denotes the ``base``, and the second one denotes
the `limit`. The range of scalars this range-expression covers include all the
numbers between the ``base`` and ``limit``, starting from the ``base``, with
each additional number one greater than its predecessor, and with a final
number not exceeding ``limit``. Thus, for the case of a range-expression
"1:10", the scalars it entails are 1, 2, 3, 4, 5, 6, 7, 8, 9 and 10.

If a Range-expression is given as a set of three quantities, separated by two
colons, such as the case of "1:4:10", then the last quantity denotes the
``limit``, and the middle quantity denotes the next number after the first
number, and the difference between this number and the first will be used as
the increment for each additional numbers after the second number until it went
over the limit which is the third number.  Thus, in the case of "1:4:10", the
scalars it entails are: 1, 4, 7, 10.



# The 'node' and 'edge' commands

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
such as ``edge``. In the following example the ``edge`` command is to
draw an edge between nodes "A" and "B".

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
node, and a negative 45 degree abbration expresses that it should start
out with an angle that is 45 degrees turned to the left hand side 
of the normal trajectory, placing the starting direction at a due north 
direction. 

    node.A  (1,1)
    node.B  (5,5)
    edge.A.B {abr:-45}

A positive "abr" option would have expressed that it should veer away 
towards the right hand side of the normal trajectory.
If the edge is going to include arrow heads, then the 'arrowhead' style option
should've been provided.

    edge.A.B {arrowhead:1,abr:45}
    edge.A.B {arrowhead:2,abr:45}
    edge.A.B {arrowhead:3,abr:45}

In order to be connected with lines, each node should have an ID assigned to
it.  However, if a node is to be created inside a for-loop this
operation could proven to be difficult to manage.
In this case it can take advantage of the "auto ID" feature which will
automatically assign an ID to the node depending on the current setting.
In particular, in order to allow for a automatically chosen ID to be assigned
to a node, the name of the node should appear as an underscore.

    node._ (0,0)
    node._ (1,2)
    node._ (3,4)

By default, the name automatically assigned to the first node is '0', and the
second one '1', the third one '2', etc. 

However, there are four different ways user can influence how an ID
will be constructed, the first of which is to instruct that the ID
should cycle through a-z. The second one is to instruct that the ID
should cycle through A-Z. The third method is to instruct that the ID
should cycle through a positive integer through infinity. The forth
way is to instruct that a name be constructed with a fixed prefix and
a number afterwards.

To achieve this, the 'set' command should be used with a key of 'id'
and value to a starting ID. See the 'id' command for various ways
of setting a starting ID. In the following example the starting ID is
set to be 'node10', which is itself assigned to the next node upon
request. After the first assignment, the starting ID will be changed
to 'node11' and 'node12', which will become the ID that gets assigned
for the second and third auto ID assignment.

    id node10
    node._ (5,6)
    node._ (5,7)
    node._ (7,8)
    edge.node10.node11.node12

For a 'node' command, if no coordinates are given in the command line, and at
least one ID has been provided for the node, all nodes will be searched in the
internal database to see if this particular node has already been created. If
the answer is yes then the location information is retrieved and the node is
redrawn at that location with the information provided at the command line.
This feature allows for example, to repaint an existing node with a highlighted 
color and/or label.

    id 0
    origin ^center
    for theta in [0:60:359]; do
      var r = 2
      var x = cos(deg2rad(theta)) * r
      var y = sin(deg2rad(theta)) * r
      node._ {r:0.5} (x,y)
    done
    node.0.1.2 {fillcolor:red}

For an 'edge' command, the 'shift' style option can be utilized to allow for
a label to be shifted slightly away from its centered position so that
the text label does not obscure the edge line. By default the text label 
is drawn centered and the location is the middle of the edge.

The 'shift' option expresses a quantity that is interpreted as expressing
a length in unit distance. A negative value should have shifted the label
to the left hand side of the edge, and a positive value would have shifted
it to the right.

When the edge is a loop, which is the case when the two vertices are
the same, then the shift-option expresses an additional centrifugal
distance from the center of the node.

Aside from being a circle, a node can also have two additional shapes,
namely RREC and RECT, which is controlled by the "nodetype" member
of the config. 

    node {nodetype:RREC} (0,0)
    node {nodetype:RECT} (5,5)

The first one would have created a rounded square, and the second a 
plain square. The width and height of the square is 2 times the 'r'. 

Instead of drawing a connecting line between two nodes, where the end point
of that line is will be calculated so that it lands on the border of that
node, it is also possible to specify an anchor point of a node, so that 
it can be used inside a "draw" or "stroke" command or other commands
as a path point. The valid names of a node are the following:

    o1
    o2
    o3
    o4
    o5
    o6
    o7
    o8
    o9
    o10
    o11
    o12

Each anchor point corresponds to the hour label of a clock, such as "o3" would be
the anchor that is due east, and "o9" an anchor point at due west. This makes it 
possible to draw a line from (0,0) to the "o9" anchor point of node 1 
as is shown by the following example.

    node.1 (5,5)
    draw (0,0) -- (@node.1:o9)




# The 'box' command

This command is to draw a box at the location expressed by each path points.
The size of the box is to be controlled by the 'w' and 'h' members of style
options. If absent, the 'w' is assumed to be 3 and 'h' 2.
  
    box {w:3, h:2} (0,0) (1,2)  
    
It is also possible to place a label inside a box. 

    box {w:3, h:2} "hello\\world" "Goodbye" (0,0) (1,2) 
    
The "boxtype" style holds the type of boxes to be drawn,
other than the default rectangular shape.  Note that
regardless the choice of the boxtype, the geometry of the
shape will always be confined to the width and height given
by "w" and "h".

    box {boxtype:RECT} "Hello\\World" (0,0)

A box can come with an ID string, which must consists of all
word characters. If it is provided, then the ID string is
saved internally with the geometry of the box, and can later
be retrieved to redraw the same box with maybe a different
color, line size, and/or text.  In the following example the
box is first created with the given type and string, and 
placed in the location specified. However, it is later
redrawn with a different text because the location and
the type of the box has already been saved with the given
id "1".

    box.1 {boxtype:RECT} "Hello\\World" (0,0)
    box.1 "Goodbye" 

The previous example would have had two text being drawn on 
top of each other. This might not be a desirable effect, but
if a "fillcolor" is provided then previous text would have
been erased first.

    box.1 {boxtype:RECT} "Hello\\World" (0,0)
    box.1 {fillcolor:brown} "Goodbye" 

If the id of the box is underscore, it will be assigned an Id in the same
mannor as that of the 'node' command. 

Unlike the "node" command, the location of a box is always the lower-left
hand corner of the box, where the 'w' and 'h' member of the config 
controls the width and height of the box stemming from that point. On the other hand,
the location of a "node" is always its center, and the 'r' member of the config
controls the radius of the node, which would be the half width and half height
of the node if that node has been configured as a type of RREC or RECT. 

Note that a box cannot be connected via an 'edge' command. 
However, if a path is to go through
an anchor point of a box, such a point can be specified using
the object-expression such as the following.

    box.1 "Hello\\World" (0,0)
    box.2 "Goodbye" (5,5)
    draw (@box.1:e)--(@box.2:w)

This would have drawn a straight line from the "e" anchor point of box 1
to the "w" anchor point of box 2. The anchor points of a box is follows:

+ e
  The "east" of a box
+ w
  The "west" of a box
+ n
  The "north" of a box
+ s
  THe "south" of a box
+ sw
  The "southwest" of a box
+ se 
  The "southeast" of a box
+ nw
  The "northwest" of a box
" ne
  The "northeast" of a box

Note that an object-expression allows additional arguments that provides
"offset" to the anchor point. This allows the anchor point to be "fine-tuned"
to a slightly different location other than the default one provided.

    box.1 "Hello\\World" (0,0)
    box.2 "Goodbye" (5,5)
    draw (@box.1:e,0,0.1)--(@box.2:w,0,-0.1)

In the previous example, the "e" anchor point of box 1 will be moved up
for 0.1 grid unit, and the "w" anchor point of box 2 will be moved down
for 0.1 grid unit. If for some reason the anchor point is missing, such as
the following, then the lower-left point of the box is assumed.

    box.1 "Hello\\World" (0,0)
    box.2 "Goodbye" (5,5)
    draw (@box.1,0,0.1)--(@box.2,0,-0.1)


# The 'prodofprimesws' command

This command is to show a sheet that demonstrates the progression
of obtaining all prime factors of a given number. 

    prodofprimesws "12 2 2 3" (5,5)

Note that the result is to show the original product with a list of primes
that are to the left of that number. At this time all prime factors need to be
given as part of the input. For instance, the number "12" above is the product,
followed by 2, 2, and 3 which is the three prime factors of this product. 

In the future it might be desirable for it to automatically figure out the 
prime factor by itself.


# The 'multiws' command

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



# The 'longdivws' command

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



# The 'lego' command

The lego-operation allows for drawing of placing Lego-like
objects on top of each other in a three-dimensional space.

    ```diagram{viewport:8 8}
    source a
    config fillcolor white
    config linesize 1.5
    config linejoin round
    lego-origin 0 0
    lego-size 4 4 4
    lego-add.z 0 1 2 3
    lego-delete.xyz 0 0 2 
    lego-delete.yz 0 3 
    lego-delete.xyz 1 1 3 
    lego-delete.xyz 2 1 3 
    lego-delete.xyz 2 2 3 
    lego-show
    ```

The lego-setup operation expects four arguments, the first
two of which are the x/y origin of the x/y/z-plane of the
Lego coordinates.  The last two is the 'wx' and 'wy' length
which is the extra space extended from beyond the edge the
cube in the x/y directions.  The default values for 'wx' is
0.36 and the default value for 'wy' is 0.30. 

The lego-size operation would set the size of the stacking.
It expectes three integers, each representing the number of
maximum Lego pieces in these directions: x, y and z.  The
x-direction is the horizontal, the y-direction is the depth,
and the z-direction is the height.

The Lego pieces are first added and deleted, and then the
lego-show operation is called to draw all the pieces in the
Diagram.

The lego-add.z operation would add a layer of pieces in the
z coordinate specified.  The lego-delete.xyz operation would
delete a specific piece with the given x/y/z coordinate.

The lego-show and lego-show2 operations are the two
operations that will trigger all commands to be written to
the output. The lego-show is to show the lego pieces in a
perspective view where x-axis is going to the left and down,
y-axis is going to the right horizontally, and z-axis up
straight. 

The lego-show2 is to show the lego pieces where x-axis is
going down and left, y-axis is going right and right, and
z-axis is going straight up. 

Each lego-show and lego-show2 carries its own set of
arguments. Following shows the default set of arguments
for each operation.

    lego-show 0.36 0.30 1.00 0.90
    lego-show2 0.80 0.45 0.70

For lego-show operation, the first two arguments are the
skewed values in x-direction and y-direction. The third and
fouth arguments are the width and height of front facing 
rectangle.

For lego-show2 operation, the first and second arguments are 
the half width and half height of the diamond of the top
face. The third argument is the height.

Either lego-show and lego-show2 operation would have
generated Lego pieces that are shaded differently for two 
of its faces for each piece. For lego-show the front facing
face is shaded lighter, and the face facing to the right 
is shaded darker. For lego-show2 operation the face facing
upward is shaded lighter and the face facing right is shaded
darker. 




# The 'drawcontrolpoints' Command

This command would look for for presence of 'C' and 'Q' Bezier curves in the 
path, and then draw the control points as well as the two end points of this
curve on the chart. The control points will be drawn using round dots, and
end points of the Bezier curves as square dots.



# The 'argand' command

The 'argand' command is designed for visually showing one or more
complex numbers inside a complex plane, sometime known as an Argand
plane. 


This command has a similar feel to 'cartesian' command, that is
designed to plot one or more two-dimensional points each of which has
two x/y coordinates. It is also a compound command with many
subcommands. For instance, 'argand-setup' would designate an area
inside a diagram for showing the plots for the complex numbers.

    argand-setup 5 5 0.5

The previous command sets up a Argand plane such that its center is
located inside the viewport at the location of (5,5). From that
location, each additional half the grid distance in both horizontal
and vertical direction corresponds to one grid distance inside the
Argand plane. 

The next four commands shown below in an example are designed to draw
x-axis and y-axis, as well as ticks on either one of the axies,
similar to the similar commands within a 'cartesian' command.

    argand-xaxis -11 11
    argand-yaxis -7 7
    argand-xtick -5 -4 -3 -2 -1 1 2 3 4 5
    argand-ytick -5 -4 -3 -2 -1 1 2 3 4 5

To show a complex number within a dot, the 'argand-dot' command can be
used. The command line for this command expectes a list of complex numbers.

    var a = (2+2*I)
    argand-dot (1+2*I) (2+1*I) a
  
As usual, an array variable is also to be recognized and the list of scalar
associated with it are to be become part of the command line.

    var a[] = (1+2*I) (2+1*I) 
    argand-dot a

A dot will be drawn in that location where the complex number is expected
to be within that plane. The size of the dot is controlled by the "dot:"
attribute of the configuration parameters. To place label next to the dot
the 'argand-label' command can be used. 

    argand-text.urt "1+2i" (1+2*I) 

By default, the label's location is at the upper-right-hand corner
of the dot. However, it can be changed by specifying an alignment 
option to the command such as ".urt", ".ctr", ".lft", etc. If the label text
is specfied it is used. But the latel text is omitted, the label text
is automatically constructed from the complex number itself.

    argand-text.urt (1+2*I)

The font size, coloring, and appearance can be controlled by the 
"fontsize", "fontfamily", "fontstyle", "fontcolor" attributes
of the configuration settings. 

The other common illustration of showing a complex nubmer is by drawing
an arrow that originates from the origin and lands on top of the point,
then the 'argand-arrow' command can be used for this purpose. This command
expects at least two points, the first one the starting point of the arrow
and the second one the point where the arrow ends. The following example
would have drawn an arrow from the origin to "1+2j".

    argand-arrow 0 (1+2*I)



# The 'var' command

The 'var' command is to create an environment variable that
is the result of an arithmetic expression. 

    var a = pow(2,1/12)
    draw (0,0)--(a,a)

The previous example has created an environment variable named 'a', 
which has been assigned a numerical value that is equivalent to 
the result computed by the arithmetic function of "pow(2,1/12)". 
The symbol 'a' can later appear in many different places such as the
one show above inside a 'draw' command to take place where a number
is expected.

This string representation of the environment variable is also able to 
appear inside any command by the use of the "dollar-expression" such as
the one shown below.

    text "${a}" (0,0)

In this example the text shown at position (0,0) will be composed of the 
the number that equals to the value of this variable.

The same 'var' command is also able to create an "array" variable, in which
case a list of numbers, rather than a single number, is to be assigned to this
symbol name, and later on be access in various places.

    var @a = 1 2 3
    text "${a_0}" "${a_1}" "${a_2}" (0,0) [h:1] [h:1]

The previous example has created an array of three numbers, and was later
on used to generate text output on various locations, pulling the content of 
each element of the array. 

One of the key features of utilizing a scalar variable is its ability to hold a
number that is capable of representing a complex number. For instance, following
example will first create two complex numbers "1+1i" and "2+3i" and then add
them together to get a number that equals to "3+4i".

    var a = 1+1i
    var b = 2+3i
    var c = a + b

Note that there is a built-in constant that is "I", which represents the
the imaginary unit of a complex number. Thus, it is possible to create a complex
number such as follows.

    var a = 1 + 1*I
    var b = 2 + 3*I
    var c = a + b

However, the notation of "i" and "j" are special notations that must follow
a valid number in order for a imaginary number to be recognized. Thus, following
are all valid notation for a complex number with an imaginary component.

    var a = 1 + 1j
    var a = 1 + 2.22i
    var a = 1j
    var a = -10i

However, following are illegal:

    var a = i
    var a = j
    var a = -i
    var a = -j

This is because if a "i" and "j" were to appear by itself, it is to be recognized
as a scalar variable much similar to the situation below, in which case the "i" in 
the second line is to be treated as a variable holding a value of 10.

    var i = 10
    var b = i

The 'var' command is also designed to create a variable that holds a literal
string rather than a number. In this case, the first argument after the equal
sign must be a formatting string, which must appear starting with an at-sign, and
immediately followed by a set of quotation marks.

    var num = pow(2,1/12)
    var s = @"%.2f" num

Note that is possible to have empty spaces inside the
quotation marks. 

    var num1 = pow(2,1/12)
    var num2 = pow(2,2/12)
    var s = @"%.2f %.2f" num1 num2

Each additional argument after the initial formatting string is to be treated as
existing scalar variables. They each serve as an independent source that is to
supply the content of each "formatting group" that is to be found within the
formatting string. Each "formatting group" is identified by the presence of the
percent sign, which is followed by additional letters, numbers, period, etc.
that serves to provide additional information as to how this argument is to be
formatted in order to appear at that location. Each formatting group including
the percent sign is to disappear and its place completely replaced by the
content of the argument. After each formatting group has been found the argument
to be replaced with, the resulting string is saved within the environment under
the variable name in much the same mannor as with an arithmetic expression.

Following formatting groups are recognized.

+ %%

  This formatting group is to output the percent-sign itself

  ```
  var a = 1.23456789
  var s = @"%0.2f%%" a
  % s => '1.23%'
  ```

+ %f

  This formatting group is to treat each arguments as a floating point
  number. The number after the period inside the formatting group
  express the decimal places to be used for this number.

  ```
  var a = 1.23456789
  var s = @"%.2f" a
  % s => '1.23'
  ```

+ %d 

  This formatting group would parse the argument as an integer.

  ```
  var a = 0x10
  var s = @"%d" a
  % s => "16"
  ```

+ %x 

  This formatting group is to output a hexdecimal number of the 
  given quantity. The lower-case ``x`` would've generated a hex
  number with all letters between A-Z in lowercases, where
  the upper-case ``X`` letter would've generated a hex
  number with all letters between A-Z in uppercases.

  ```
  var a = 15
  var s = @"%x" a
  % s => "f"
  var s = @"%X" a
  % s => "F"
  ```

+ %X

  See formatting group ``x``.

+ %b

  This formatting group is to output a binary number with one's and zero's.

  ```
  var a = 5
  var s = @"%b" 5
  % s => "101"
  ```

+ %o 

  This formatting group is to output an octal number.

  ```
  var a = 0xF0
  var s = @"%o" a
  % a => "360"
  ```

+ %c

  This formatting group is to turn an integer to a Unicode character
  with that given code point.

  ```
  var a = 65
  var s = @"%c" a
  % a => "A"
  ```

+ %s

  This formatting group is to treat the argument simply as a string
  with no particular assumption.

  ```
  var a = @"hello"
  var b = @"and"
  var c = @"world"
  var s = @"%s-%s-%s" a b c
  % s => "hello-and-world"
  ```

  

# The 'trump' command

The 'trump' command is designed to show faces of a playing card. It
has provision to show a card from 1-9, 'A', 'J', 'Q', and 'K', from
any one of the four suits.

To show a card of diamond-10 at coordinates (5,5), type the following
command.

    trump-diamond-10 5 5

For a standard card, the size is fixed at 5 grid unit in width and 6
grid distance in height. For the previous command, the lower-bottom
location of the card will be aligned with the coordinates (5,5). The
font-size for any texts inside the card is fixed and is not
configurable. The face of the card will always be filled with the
color of white and is not configurable. The only visual changes that a
user can provide is the width of the outline of the card.

The second part of the command is the name for the suit. It should be
one of the following names:
 
     diamond
     heart
     club
     spade

The third part of the command is the letter for the individual card.
It should be a integer between 1-10, or a capital letter that
is either 'A', 'J', 'Q', or 'K'.

For diamond and heart the color red will be shown for all interior
symbols. For club and spade, color black will be used. These options
are currently not configurable.

However, if a different card size is desired, the width and height of
the new card can be configured by setting the 'scaleX' and 'scaleY'
configuration parameter. For instance, setting 'scaleX:0.5' and
'scaleY:0.5' would have effective shrink the size of the card to 2.5
grid distance in width, and 3 grid distance in height, or half of what
it normally is. Note that the 'rotate' parameter will not have any
effect on this command.  



# Copy-and-paste Buffers

Copy-and-paste Buffers are internal buffers to Diagram. It saves
buffers allowing a collection of lines in one instance of a Diagram invocation
to be copied and later "pasted" into a location of another Diagram invocation. 

Here, the term "buffer" is simply defined to be a collection of lines
between to instances of comment lines. 

When a comment line is detected inside a Diagram, the text after the percent-sign
is scanned, and see if it fits one of the following two patterns:

1. If the text befits the pattern of "(=word)" where "word" is a
   placeholder for a string of one or more word characters, then lines
   between this comment and the first occurence of the next comment
   will be saved to a buffer, and the name of the buffer will be the
   actual string denoted by "word".

2. If the text befits the pattern of "(?word)" where "word" is a
   placeholder reresenting any length of string having one or more
   word characters, then it represents a desire to retrieve the
   contents of a previous saved buffer for which its contents are to
   be inserted into the current location of the source program. The
   name of the named buffer is the string expressed by the "word".

Note that for a copy-buffer, it the limit of the buffer line only extends
as far as the a comment line where the number of percent-signs agrees
with the one that starts the buffer. For instance, if the line starts
the copy-buffer is

    %%%(=a)

Then the copy buffer will include all lines up till the line that is

   %%%

not including this line. The paste buffer line does not have this 
limitation. As soon as the paste buffer line is detected, all the previous
copied contents will be inserted at that location.

Following is an example of repeating the same block of commands inside
another Diagram. The first Diagram has defined three buffers,
assigning them names that are 'a', 'b', and 'c'. The second Diagram
simply just asks that the program codes saved in buffer 'a' be pasted
into the program at that location. The third and fourth Diagram does
the same thing except for asking for a different buffer to be
retrieved.

    ```diagram
    %%%(=a)
    trump-diamond-J {scaleX:0.5,scaleY:0.5} 2  1
    trump-heart-Q   {scaleX:0.5,scaleY:0.5} 7  1
    trump-spade-K   {scaleX:0.5,scaleY:0.5} 12 1
    trump-club-A    {scaleX:0.5,scaleY:0.5} 17 1
    %%%
    %%%(=b)
    trump-diamond-10 {scaleX:0.5,scaleY:0.5} 2  5
    trump-heart-9    {scaleX:0.5,scaleY:0.5} 7  5
    trump-spade-8    {scaleX:0.5,scaleY:0.5} 12 5
    trump-club-7     {scaleX:0.5,scaleY:0.5} 17 5
    %%%
    %%%(=c)
    trump-diamond-6  {scaleX:0.5,scaleY:0.5} 2  9
    trump-heart-5    {scaleX:0.5,scaleY:0.5} 6  9
    trump-spade-4    {scaleX:0.5,scaleY:0.5} 10 9
    trump-club-3     {scaleX:0.5,scaleY:0.5} 14 9
    trump-club-2     {scaleX:0.5,scaleY:0.5} 18 9
    ```

    ```diagram
    %%%(?a)
    ```

    ```diagram
    %%%(?b)
    ```

    ```diagram
    %%%(?c)
    ```


# Fill-out data

It is possible to also add text above the hrule done by the 
\hrule command. This feature is possible to allow for creating
a figure with only the hrule, followed by another diagram with
the same hrule but with added text on top of it.

It is done by supplying each \hrule with an option that serves
as the ID for this hrule, such as 

    \hrule[A]{5}

Which will draw a line of 5em long by default. However, if an option
named "A" is set, either by the style option or by 'config' command,
then the text of it should be treated as a math text that would
be parsed and the result of which stacked on top this hrule. Following
is an example where the first diagram draws four hrules each of which
were given an ID of A, B, C, and D. The second diagram would have loaded
the same source, but in its style supplying the option of A, B, C and D
each of which is a string of math text. Thus, when the second diagram
is drawn it would have seen the math text associated with the ID of 
each of the four hrule, and will then pull the math text from the style
and the use it to place it on the top of the hrule.
    
    ```diagram{width:100%,save:ex3,viewport:22 12}
    origin ^northwest
    draw (0,0) -- [v:-14]
    draw (3,0) -- [v:-14]
    draw (6,0) -- [v:-14]
    for y:=[0:2:12]:
      draw (0,-${y}) [h:22]
    %%% table
    origin ^down:1
    origin ^x:1.5
    text.ctr "x"  "y"  ^down:0  (0,0) [h:3] 
    text.ctr "1"  "2"  ^down:2  (0,0) [h:3] 
    text.ctr "2"  "3"  ^down:4  (0,0) [h:3]
    text.ctr "3"  "4"  ^down:6  (0,0) [h:3]
    text.ctr "4"  "5"  ^down:8  (0,0) [h:3]
    text.ctr "10" "11" ^down:10 (0,0) [h:3]
    origin ^x:3.5
    text.rt "{{f(x,y)=x^2+y+1}}"       ^down:0  (3,0)
    text.rt "{{f(1,2)=4}}"             ^down:2  (3,0)
    text.rt "{{f(2,3)=\hrule[A]{5}}}"     ^down:4  (3,0) 
    text.rt "{{f(3,4)=\hrule[B]{5}}}"     ^down:6  (3,0) 
    text.rt "{{f(4,5)=\hrule[C]{5}}}"     ^down:8  (3,0) 
    text.rt "{{f(10,11)=\hrule[D]{5}}}"   ^down:10 (3,0) 
    ```

    ```diagram{width:100%,A:8,B:14,C:22,D:112,load:ex3}
    ```


# Define custom colors

There are 10 custom colors, namely color1 to color10, that can
be used. These colors are predefined and can be used.

    

