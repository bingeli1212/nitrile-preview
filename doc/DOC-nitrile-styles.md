---
title: Styles
---

# Style Options

Following are styles recognized by NITRILE:

+ textalign:p10 c c c c
+ textalign:l l c r r
+ textalign:p10cccc
+ textalign:llcrr

  The "align" is designed to express alignment options for table columns,
  which is a list of letter l/r/c, or a string such as "p(1cm)" for paragraph
  with a fixed width.

+ frame:1

  Set this option to 1 to allow an outline to be show for the bundle. 
  For tabular bundle the same frame-style can be set to additional values
  to fine tune the frame around the tabular.
  Now all bundles support this options.                        
  
+ rules:groups
+ rules:rows
+ rules:cols
+ rules:all

  The rules-option expresses the inner border between cells.
  When set to 'rows' only rules between rules are shown. When set to
  'cols' only rules between columns are shown. When set to 'all'
  both rules are shown. When set to 'groups' only the rules between
  groups such as header and body are shown.

+ save:1

  When this flag is set to 1 it expresses the fact that the content of the current
  bundle should be save to an internal buffer. By default the name of the buffer
  is the underscore, but if style.id is set then it is saved in accordance to this ID.
  This allows for another bundle to be restored to its content if it sets the same ID.

+ restore:1
+ restore:3

  This option instructs that a previously saved content of a bundle should be inserted
  into the new bundle. The value expressed by this option denotes the starting line
  number into which the saved content is to be inserted into the existing content. 
  By default it is set to 1, which means all contents will be inserted at line 1.

+ fontsize:12
+ fontsize:11.5
+ fontsize:10

  The fontsize-option instructs that the current fenced bundle be shown
  with a different font size. The font size is either a number, such
  as 12, 11.5, 10, etc., or a string such as "footnotesize", "large",
  which must be a valid font size name.

+ head:1

  When this flag is set it expresses that the first row is a header row.
  It is currently used by 'tabular' bundle.

+ side:1

  The side-style expresses that the first column of the tabular
  be set aside as the "side" column.

+ cellcolor:a cyan b lime c pink e orange

  The cellcolor-option specifies an associated list such that each color
  is to be applied to a cell with a given text. In the following example all 
  cells of text "a" will be colored using color 'cyan'. All cells of text
  "b" will be color using color 'lime', and so on.

    ```tabular{cellcolor:a cyan b lime c pink e orange}
    &ast; \\ e \\ a \\ b \\ c
    e     \\ e \\ a \\ b \\ c
    a     \\ a \\ b \\ c \\ e
    b     \\ b \\ c \\ e \\ a
    c     \\ c \\ e \\ a \\ b
    ```

+ subtitle:<string> 

  The subtitle-option is used to specify the subtitle of a bundle. The subtitle
  of a bundle is only used when they are part of a figure.
  
+ arrowhead:1
+ arrowhead:2
+ arrowhead:3

  The arrowhead-option is used inside a diagram to specify that a line should be drawn
  with an arrow head attached to the end point of a line, or in the case of 
  multiple line segments, the very end of the line segment. 

  The value is an integer that is bit-OR'ed values of the following:

  ```
  - Arrow head at the end: 0x1
  - Arrow head at the start: 0x2
  - Arrow head at both start and end: 0x1 + 0x2 = 0x3
  ```

+ gridalpha:0.2
+ gridalpha:0.5

  This value is to hold a float between 0-1 to express the opacity 
  for drawing grid lines. By default grid lines are drawn at an opacity
  of (0.2).

+ barlength:<length>

  This option is used by diagram-bundle when it needs to show a bar to indicate
  the location of certain points, such as those on a number line or Cartesian
  coordinate X/Y-Axis. Setting this value would allow the length of the bar
  to be shown in various length. The number is a float denoting the length
  in diagram grid unit.  If this value is not set a default value 0.40 is used.

+ dotsize:<pt>    

  This option is used by a diagram-bundle to determine the size of the dot to
  place at a given location. It is a number expressing the diameter   of the
  dot in pt.  If not set it would have a default value of 5.

+ linesize:<pt>

  This option is used by a diagram-bundle to determine the line size for drawing
  various lines and curves. It is a number expressing the width of the line in pt.
  If not set then it uses whatever the default value the underlying system such 
  as TikZ or SVG provides.

+ fillcolor:<color>

  This option sets the color to fill an area. It is currently used by a
  diagram-bundle when it needs to fill an area in an operation such as 'fill'
  or 'draw'.  The default value is an empty string, which would have implied a
  default color. This is often to mean "black", but it could be different for
  SVG.  It should be a string of 19 valid color names, such as "black", "pink",
  "steel", etc., or a 3-digit HEX such as "#888", or a 6-digit HEX such as
  "#F8F8F8", or a HWB color such as '&hwb!0!0.2!0'.

  ```
  fillcolor:red
  fillcolor:green
  fillcolor:blue
  fillcolor:#ccc
  fillcolor:#c0c0c0
  fillcolor:&rgb!0.4|0.5|0.6
  fillcolor:&hwb!20|0.5|0.6
  fillcolor:&hsv!20|0.5|0.6
  ```

+ linecolor:<color>

  This option denotes a color that would be used to draw a line or stroke a
  path. It is currently used by a diagram-bundle. The value is a <color> that
  is the same value expected of a fillcolor-option.  When this value is not
  set, it typically assume a black color.  It could also be set to a different
  color for SVG as it uses the 'currentColor'.

+ dotcolor:<color>

  This option denotes a color of a dot when a dot is to be placed in a
  location.  It is currently used by a diagram-bundle when it needs to perform
  such an operation. When not set it defaults to black.

+ fontcolor:<color>

  This option sets the color of the text. It is currently used by a
  diagram-bundle when it needs to generate text, and the color if specified
  would be used for the font. If this option is not set the color of the text
  is not specified, in which case the text will be shown in its default color.

+ fillalpha:0.1
+ fillalpha:0.5

  This sets the opacity of the filled color. The number must be
  between 0 and 1, where 1 is the full opacity and 0 is the full
  transparency. When not set it assumes that the opacity is at 1.

+ linealpha:0.1
+ linealpha:0.5

  This sets the alpha channel value for all colors that are to be used
  for drawing lines. By default it is "1.0".

+ r:<length>

  This option denotes a length that is related to a radius. It is used by a
  diagram-bundle when it needs to perform some operations such as placing a
  node at a location, in which case the value of this option determines the
  radius of the node. This value is also used to set the radius of an angle arc
  that is drawn by the diagram.  The value of this option is a length value
  expressed in the grid unit.  There is no default value.  When this option is
  not set, each operation would each have a different default value.

+ w:<length>

  This option denotes a length expressing the length of the horizontal
  dimension of a 2D shape.  It is currently used by a diagram-bundle to set the
  width of a box when it needs to place a box at a given location.

+ h:<length>

  This option denotes a length expressing the length of the vertical dimension
  of a 2D shape.  It is currently used by a diagram-bundle to set the width of
  a box when it needs to place a box at a given location.

+ showanswer:1

  Set it to 1 to allow the answer to be shown. This option is currently used by
  certain operations of a diagram-bundle such as 'multiws' and 'longdiv' to
  also generate the answer as part of the operation if it has detected that
  this option is set.

+ showanswercolor:<color>

  This option holds the color such that when the contents associated with an
  answer is shown it will be shown in this case, including all the texts and
  line drawings.

+ showid:1

  Set it to 1 to allow for IDs to be shown. Currently this is utilized by the
  'node' operation of a diagram-bundle such that the ID of the node is shown
  inside the node.

+ multiline:1

  Set it to 1 to allow for certain commands to treat the entire text as multi-line
  text, rather than a collection of single-line labels. This option is currently
  utilized by the 'box' command such that if this option is set to 1 it treats
  the entire text as multi-line text.

+ angle:<angle>

  This option holds a number expressing an angle, which is a number between 0
  and 90.  This option is currently utilized by 'fill' and 'draw' operations to
  determine the angle of the shading if a linear shading is to be used.

+ shade:<string>

  This option sets the type of the shading to be used. It is currently used by
  the 'draw' or 'fill' operation inside a diagram-bundle to determine what shading
  method to use for filling a shape. Currently the only valid values are
  "linear", "radial" and "ball"

  ```
  shade:linear
  shade:radial
  shade:ball   
  ```
  
+ shadecolor:<color> <color> <color>

  Sets one or more colors for the shade. The colors can be one, two or three
  depending on the type of shade.  The color must appear one after another
  separated by one or more empty spaces. See other section that talks about
  shading on how to set this option value.

+ linedashed:1

  When this option is set to 1 all line drawn will be a dashed line instead
  of solid lines. This is current used by the 'draw', 'stroke', 'drawanglearc', and
  other methods where drawing a line is needed.

+ linecap:<string>

  This sets the type of the linecap. The valid values are:
  "butt", "round", and "square".

+ linejoin:<string>

  This sets the type of the linejoin. The valid values are:
  "miter", "round", and "bevel".

+ span:<degrees>

  This span-option is to express a number that expresses the number of degrees of an
  angle.  It is currently utilized by the 'edge' operation when it needs to
  draw a looped edge to go from the node to itself and this values determines
  how wide the looped edge should be separated.

+ abr:<degree> <degree> <dist>
 
  The abr-style specifies the aberration from the norm.  The first number that
  expresses an angle in the unit of degrees.  It is currently being utilized by
  the 'edge' operation such that when this option is set it expresses that a
  Bezier curve should be drawn instead of a straight line that connects two
  different nodes. A negative value expresses that it should veer to the left
  hand side of the normal trajectory. A positive value expresses that it should
  veer to the right hand side. 

  The second and the third arguments are used when drawing a hoop around the same
  node to express an edge that goes out from the node and comes back to the same
  node. The second argument specifies the wide-view angle in degrees for the two
  edges that comes out the node, and the third argument expresses how far away
  the hoop is from the node. When not specified, the first argument is 0,
  the second argument is 45, and the last argument is 2.

  When drawing an edge that is a hoop, the first argument expresses the direction
  where the center of the hoop is facing outward.

+ shift:<length>

  The shift-option hold a length that expresses the location of text shifted
  away from its attached location. It is currently utilized by the 'edge' and
  'draw' operation to place the text away from the middle of the line it
  intends to place the label for had the shift-option not be specified. It is
  also utilized by the 'drawanglearc' operation to shift the text away from the
  arc. Note that a positive number would have shifted the text to the
  right-hand side of the direction of the line, and a negative number would
  have shifted the text to the left relative to the direction of the line.

+ tx:<length>

  The tx-option and ty-option would have worked together to fine tune the position
  of placing a text inside another object such as box and node, where the placement
  of the text position cannot be directly controled.

+ ty:<length>

  See tx.

+ scaleX:0.5

  The scalex-option, scaley-option and rotate-option would work
  together to scale an existing shape by these amount. It is current
  utilized by the 'fill', 'stroke', 'arrow', 'revarrow', and
  'dblarrow' commands when these commands are used to insert a
  predefined shape that is described by an existing path name. In this
  case, these two parameters will be used to "shrink" or "expand" the
  shapes in the x-direction and/or y-direction and potentially rotate
  the shape if the 'rotate' parameter is non-zero. 

  It is also currently utilized by the 'trump' command such that when
  it is set to something other than 1, will either shrink or expand the
  card beyond its normal size.

+ scaleY:0.5

  See the description for 'scaleX'.

+ rotate:45

  See the description for 'scaleY'.

  This parameter is to describe a rotation angle in degrees, where a
  positive number expresses the fact to rotate in a counter-clockwise
  direction, and a negative number is for a rotation in a clockwise
  direction.

  Note: This option might work on some commands, such as draw, fill,
  stroke, arrow, dblarrow, and revarrow. However, it does not work for
  the 'trump' command, which would have asked that a text to be
  rotated, which would have required a different method.
  
+ nodetype:<string>

  - CIRC
  - RECT
  - RREC

+ boxtype:<string>

  The boxtype-option sets the type of box for the box-operation. Currently the
  only available values are listed below. If the type string is unrecognized it
  is assumed to be 'rect', which is the default type.

  - RECT
  - RREC
  - HEXG   
  - UTRI     
  - DTRI 
  - PARA
  - RHOM
  - ELLI
  - TERM
  - RDEL
  - LDEL
  - SDOC
  - MDOC
  - STOR
  - FORM
  - SUBP
  - DOBJ
  - UOBJ
  - LOBJ
  - ROBJ

  There is also a type named "NONE" that would not draw the box at all. This feature 
  is useful if only the text of the box is desired.
  
+ bartype:<string>

  The bartype-option can be sets to indicate what bar it is to draw. It is
  currently used by the 'drawlinesegcong'. It is set to 'single', 'double', or
  'tripple'.

+ gap:<length>

  The gap-option is used to express a gap between two points. It is currently
  used by the 'drawlinesegcong' when it needs to determine the gap between the
  bars when it is instructed to draw double or triple bar.  It does not have a
  default value, and each operation would determine its own default if it is
  not set.
  
+ math:1

  Set it to 1 to enable the math text to be recognized. By default 
  text passed to label is of normal text nature, but it would be 
  recognized as inline math if the style option is set.

+ fontstyle:B I R S T M
  Each letter represents a font style. 
  Multiple letters can be specified which is to represent
  one for each column of the text, typically used inside a tabular:
  B(bold), I(italic), R(roman), S(slated), T(teletype), M(math).

+ shear:0.1
+ shear:0.2

  This option holds a float that expresses the number X-units
  to shift based on the height. This value is used when
  constructing a parallelgram. It is currently used
  by Diagram. The Diagram assumes a default value of 0.1 if
  it is not set.
  
+ rdx:3.5
+ rdx:20%

  This value holds the value of the radius for the round corner that appears when
  drawing a "rrect" box type for the "box" command. This value is utilized
  This value expresses the length of the radius in the x-direction. 

  This value is typically a pure floating point number expressing a length in
  grid unit. However, it can also appear in a form of a percentage such as
  "10%" which will be interpreted as the percentage of the width of the box.

+ rdy:3.5
+ rdy:20%
  
  This value holds the value of the radius for the round corner that appears when
  drawing a "rrect" box type for the "box" command. This value is utilized
  This value expresses the length of the radius in the y-direction.

  This value is typically a pure floating point number expressing a length in
  grid unit. However, it can also appear in a form of a percentage such as
  "10%" which will be interpreted as the percentage of the height of the box.

+ fillonly:1

  This value expresses whether certain operation is going to be treated
  as a "fillonly" operation, as a way of deviating its "default" operation.

+ plottype:dot  
+ plottype:line

  This property value expresses how to represent plots. It could either be
  'dot' or 'line'. The default is 'dot'.  This value is currently used
  by the 'cartesian.xplot' and 'cartesian.yplot' commands.

+ start:<angle>

  The property value holds the starting angle in degrees. This property
  and 'span' is used currently by the 'dot.sector' command to determine
  the orientation of the sector.

+ inversed:1

  When set to 1 this property value holds that for certain operation it should
  be performed in the invsersed fasion. This is currently used by the
  'drawlinesegarc' command such when this flag is set to 1, the angle is
  recognized to be formed by a pair of line segments where the starting line
  segment appears after the ending line segment.

+ id:1
+ id:lines

  Set the ID. This is currently utilized by the SAMP block to set the default
  ID if it is not specifically set. It is also used by other bundles to pull
  any subcaption text out of the main caption text by looking to see if any
  subcaption is specified for their own ID.

+ partition:4

  This option is used currently by FIGURE to partition subfigure so that it
  can only take atmost 4 subfigures in a single row.

+ hew:2

  This option is used by 'tabular' bundle so that all its rows are split into equal
  portions with a total number of portions equal to 2. If the table has a head
  row then the head row is repeated at the top.

+ mar:1.23

  This option is to specify the length of the two arrows drawn on the left/right
  hand sides of a sloped text. When this option is present and the length is 
  a number other than zero, it specifies the length of the two arrows that will be drawn
  that points to the two end points given when drawing a sloped text.

+ t:0.5

  This option is used currently by the "diagram" command when it draws an edge between
  two nodes. It uses this setting to determine where along the line of the edge
  it should place the text. The default value is 0.5, which is to express that the text
  is drawn on top of the middle of the qbezier line. If it is set to something less than
  0.5 then the text will be moving away from the center and towards the start
  end of the line. A value larger than 0.5 will move the text towards the end point
  of the line. The value of 't' must be between 0 and 1.

+ xgrid:<length>

  The xgrid-option expresses the number of Cartesian grid unit for each viewport
  grid unit in the horizontal direction. This option is currently used
  exclusively by the "car" command.

+ ygrid:<length>

  The ygrid-option expresses the number of Cartesian grid unit for each viewport
  grid unit in the vertical direction. This option is currently used
  exclusively by the "car" command.

+ xaxis:<float> <float> <arrowhead>

  This option specifies how an xaxis is to be drawn. The first two numbers
  expresses the lower bound and upper bound for the axis to be drawn, and last
  number expresses how an arrowhead is to appear on either side of the axis.

+ yaxis:<float> <float> <arrowhead>

  This option specifies how an yaxis is to be drawn. The first two numbers
  expresses the lower bound and upper bound for the axis to be drawn, and last
  number expresses how an arrowhead is to appear on either side of the axis.

+ xgrid:<float> <float> ...

  This option specifies a list of floats that serves as the location where a
  tick for a x-axis is to be drawn.

+ ygrid:<float> <float> ...

  This option specifies a list of floats that serves as the location where a
  tick for a y-axis is to be drawn.

+ width:23

  This option specifies the width in units of 'mm'.

+ height:23

  This option specifies the height in units of 'mm'.

+ direction:row    
+ direction:column

  This flag is currently used by 'tabular' bundle to allow user to build
  the table either row-by-row or column-by-column.

+ hrules:1 2 3

  This flag is currently used by 'tabular' bundle to manually insert 
  horizontal rules at places when 'rules' style is not in effect. 
  It must be a positive integer where 1 is the vertical rule between 
  the first row and the second row, where the first row are body rows
  excluding the 'head' row.

+ vrules:1 2 3
  This flag is currently used by 'tabular' bundle to manually insert
  vertical rules at places when 'rules' style is not in effect.
  It must be a list of integers where 1 represent the vertical rules
  between the first and second column including 'side' column.

+ skew:

  This property is currently used by the 'lego' command to specify the skew factors
  for the pieces.

+ ri:
 
  This property sets the inner radius when drawing a circular sector. It could
  be set to 0, in which case the circular sector will cover part of the circle
  without any hole in the middle.

+ fit:contain
+ fit:cover

  This style is used within a Diagram to express the fact that when drawing an image
  as a background then it should follow this rule to stretch/reduce image when
  the viewport's aspect ratio does not agree with that of the image.

+ background:grid

  This style is used to establish the background of a img-bundle. 
  If it is set to 'grid' then a grid equivalent to one used by dia-bundle
  is to be placed underneath the image.
  
+ wrapfig:left
+ wrapfig:right

  It is currently used by FIGURE to decide
  if this is a "wrapfig" that is pushed to the "left" or "right".




