---
title: Styles
---

# Style Options

Following are styles recognized by NITRILE:

+ halign:p(1cm) c c c c
+ halign:l l c r r

  The halign-option is designed to express alignment options for table columns,
  which is a list of letter l/r/c, or a string such as "p(1cm)" for paragraph
  with a fixed width.

+ fr:1 1 1
+ fr:1 2 1
+ fr:1 2 1 3 3

  The fr-option is designed to express relative column widthes, which is
  a list of integers separated by spaces.

+ outline:1

  Set this option to 1 to allow an outline to be show for the bundle. This
  would work for some bundles but might not work for all.

+ save:a
+ save:b

  The save-option specifies a named buffer such that the content of that
  fenced bundle is to be saved under.

+ load:a
+ load:b

  The load-option instructs that the content of a fenced bundle is to be
  loaded from a named buffer.

+ fontsize:12
+ fontsize:11.5
+ fontsize:10
+ fontsize:footnotesize
+ fontsize:large

  The fontsize-option instructs that the current fenced bundle be shown
  with a different font size. The font size is either a number, such
  as 12, 11.5, 10, etc., or a string such as "footnotesize", "large",
  which must be a valid font size name.

+ leftmargin:12
+ leftmargin:20

  The leftmargin-option specifies a non-zero left margin for the fenced
  bundle. Note that this option might only be recognized for certain
  fenced-bundle and might not have an effect on some. The option name
  is a number expressing a distance in the number of "mm".

+ head:3

  The head-option specifies the number of rows at the beginning of
  input rows to be treated as the header. The input rows refer to the
  rows that user has specified in the source MD file, where some of
  the rows are data rows and others expressing a hline or dhline.
  When being treated as header certain things might happen, which 
  includes but are not limited to setting the font style to bold.
  
  For longtable-fence this option is also used to separate these rows and
  place them into a special section called "\endhead", especially when
  LATEX translation is in place and that the "longtabu" environment is
  being used.

+ foot:1

  The foot-option specifies the number of rows at the end of input
  rows to be treated as the footer. Normally this will not have
  any effect but for longtable-fence these rows will be extracted
  and placed into a special section called "\endfoot" which is 
  a feature of the "longtabu" environment of a LATEX package.

+ bullet:sect
+ bullet:maltese
+ bullet:cross
+ bullet:checkmark

  The bullet-option specifies a new symbol that will be used to replace
  the normal bullet character for a unordered list. 

    ```list[bullet:checkmark]
    - Mail Letter
    - Buy Milk
    - Go to the bank
    ```

+ hrule:-
+ hrule:--
+ hrule:---

  The hrule-option decides where to insert horizontal rules for a tabular.
  If it is set to "-", then a horizontal rule will inserted only between two
  consecutive rows (there will not be a horizontal rule if there is only a single table row.)
  If it is set to "--" then the only inserted horizontal rule will be at the very top
  of the table and the very bottom. 
  If it is set to "---" then horizontal rules will be at the very top and very bottom,
  as well between rules.

  Following example would have inserted two horizontal rules one between the
  first two rows and another one between the second/third rows.

    ```tabular[hrule:-]
    | Names | Addr.
    | James | 123 Sun Dr.
    | John  | 124 Sun Dr.
    ```

  Note that the inserting of rules will not override the existing one provided
  by the user. For example, in the following example the horizontal rules
  between the first and second row will be not inserted because there is
  already a double-rule being provided by the user.  Thus the only new
  horizontal being inserted is between the second/third row.

    ```tabular[hrule:-]
    | Names | Addr.
    ========================
    | James | 123 Sun Dr.
    | John  | 124 Sun Dr.
    ```

+ vrule:|+|+|+|+|+
+ vrule:|+|++|++|
+ vrule:|+||+|+|+|+|
+ vrule:|
+ vrule:||
+ vrule:|||

  The vrule-option is to allow for expressing that where vertical
  rules should appear between columns. The value is a string where
  each plus-sign denotes a physical column and a vertical-bar denoting
  the appearance of a vertical rule at that location. It also allows
  for expressing a double-vertical by the appearance of a
  double-vertical-bar.

  As a special rule, if the vrule-option is set to be "|||" with any
  plus-signs, it instructs that it should have a single vertical rule to appear
  between all columns as well as before the first column and after the last
  column. On the other hand, if "||" is set, then it expresses that
  vertical rules should appear at the left hand side of the first column,
  as well as at the right hand side of the last column. If it is set to
  "|" without any plus sign, it is to express that a vertical rule should
  appear only between each columns.

+ cellcolor:a cyan b lime c pink e orange

  The cellcolor-option specifies an associated list such that each color
  is to be applied to a cell with a given text. In the following example all 
  cells of text "a" will be colored using color 'cyan'. All cells of text
  "b" will be color using color 'lime', and so on.

    ```tabular{title:Cayley-1,vrule:|+||+|+|+|+|, hrule:-, cellcolor:a cyan b lime c pink e orange}
    -------------------------
    | &ast; | e | a | b | c
    =========================
    | e     | e | a | b | c
    | a     | a | b | c | e
    | b     | b | c | e | a
    | c     | c | e | a | b
    -------------------------
    ```

+ title:<string> 

  The title-option is used to specify the title of a bundle. It is currently recognized only 
  by the tabular-bundle such that it will create "merged" row to contain this text. 
  
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

+ gridcolor:red
+ gridcolor:green
+ gridcolor:blue

  This value is to hold a string that describes the color for each grid line
  drawn inside the viewport if the 'gridlines' is not set to 'none'.
  This value is current used by diagram-bundle to draw background grids.
  If absent, the diagram-bundle has its own default value.

+ gridlines:none

  Set to a 'none' to disable the showing of grid. This option is checked by the 
  diagram-bundle, which by default shows a grid as its background. Setting
  this option to 1 will disable it.

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

+ opacity:<number>

  This sets the opacity of the filled color. The number must be
  between 0 and 1, where 1 is the full opacity and 0 is the full
  transparency. When not set it assumes that the opacity is at 1.

  ```
  opacity:0.1
  opacity:0.3
  opacity:0.5
  ```

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

+ protrude:<length> 

  The protrude-option specifies a length that goes beyond the surface. It is
  currently being used by 'edge' operation when it needs to draw a looped edge
  of a single node that connects to itself, in which case the protrude-option
  is used to determine how far apart the loop will go beyond the surface of the
  node.

+ abr:<degrees>
 
  The abr-option specifies the aberration from the norm.  It is a number that
  expresses an angle in the unit of degrees.  It is currently being utilized by
  the 'edge' operation such that when this option is set it expresses that a
  Bezier curve should be drawn instead of a straight line that connects two
  different nodes. The wider this value, the more curved edge should end up.

+ shift:<length>

  The shift-option hold a length that expresses the location of text shifted
  away from its attached location. It is currently utilized by the 'edge' and
  'draw' operation to place the text away from the middle of the line it
  intends to place the label for had the shift-option not be specified. It is
  also utilized by the 'drawanglearc' operation to shift the text away from the
  arc. Note that a positive number would have shifted the text to the
  right-hand side of the direction of the line, and a negative number would
  have shifted the text to the left relative to the direction of the line.

+ dx:<length>

  The dx-option and dy-option would have worked together to allow for a text
  based operation such as 'label' and 'text' to fine turn the location of the
  positioning of the text.  This would have affected all operations that places
  texts including but are not limited to the following operations: 'label',
  'text', 'cartesian.xtick', 'cartesian.ytick', 'cartesian.label', etc.  etc.

+ dy:<length>

  See dx-option.

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
  
+ xstep:<length>

  The xstep-option and ystep-option is used currently by the
  'cartesian.grid' to set the separation of each grid line in the
  x-direction. The option value is to be a number in grid unit.

+ ystep:<length>

  See xstep-opion. 

+ boxtype:<string>

  The boxtype-option sets the type of box for the box-operation. Currently the
  only available values are listed below. If the type string is unrecognized it
  is assumed to be 'rect', which is the default type.

  ```verbatim
  RECT
  RRECT
  HEX   
  TRI     
  DOWNTRI 
  PGRAM
  RHOMBUS
  ```

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
  
+ verbose:1

  Set it to 1 to enable verbose reporting. The verbose reporting is to increase
  the amount of output sent to the console. For Diagram this will result in every
  comment, input line, and result to be sent to the console.

+ math:1

  Set it to 1 to enable the math text to be recognized. By default 
  text passed to label is of normal text nature, but it would be 
  recognized as inline math if the style option is set.

+ replace:a/1 b/3 c/4

  Set this option to allow for labels text to be swapped for new
  contents. This option is useful if part of the diagram is reused
  but the only wishes is to replace part of label text with new
  contents. This option specifies multiple occurances of the same
  label text to be swapped for new contents, such as to replace
  all label string "a" with "1", all "b" with "3", and all "c" 
  with "4". Note that the entire label text has to match the
  given search string.
  
  ```verbatim
  viewport 10 10
  label {replace:a/1 b/3 c/4} "a/b/c" (0,0) (1,1) (2,2)
  ```

+ check:a b c

  Set this option to allow for certain entries to be shown as
  a checked checkbox or selected ratio button. This option is currently
  being utilized by the list-bundle so that it will check to see if 
  one of the items in the list is being checked. 

  This option needs to be set to the leaing word that starts an entry. For instance,
  the leading words for the following four entries are "A", "B", "C", and "D"; thus,
  to mark that the second entry be "checked" the "check" option must be set to "B". 

  ```list{check:B}
  ( ) A. Apple
  ( ) B. Pear
  ( ) C. Strawberry
  ( ) D. Banana
  ```

  Note that is also possible to mark that multiple checkboxes are to e checked
  by listing additional letters after the "check" option; they must be separated
  by one or more space.

  ```list{check:B D}
  [ ] A. Apple
  [ ] B. Pear
  [ ] C. Strawberry
  [ ] D. Banana
  ```


+ fontfamily:<string>

  This option holds the font family that is for the bundle. 
  It is currently utilized by the diagram-bundle such that all
  label texts will have been set to this font family.
  So far the only valid value is "monospace".

+ fontstyle:<string>

  This option holds the font family that is for the bundle. 
  It is currently utilized by the diagram-bundle such that all
  label texts will have been set to this font style. 
  So far the only valid options are: "normal", "italic" and "oblique".

+ strut 

  This option contains an integer that describes the number
  of pt(s) for the height of each row. Setting this to an
  integer to allow for each row to have a fixed row height.
  For instance: "strut:20" would have instructed that each
  row has a height of 20pt.

+ shear:0.1
+ shear:0.2

  This option holds a float that expresses the number X-units
  to shift based on the height. This value is used when
  constructing a parallelgram. It is currently used
  by Diagram. The Diagram assumes a default value of 0.1 if
  it is not set.
  
+ group:<string>

  This attribute holds a string that is the name of an existing group that have
  been previously defined.  Setting this attribute allows for this element to
  inherit all properties associated with that group. If the group ID specified
  isn't an existing group then this attribute value is ignored.
  
  The Diagram bundle define a group by the "group" command.

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

+ parsep:<number>

  This value holds the additional spacing that serves as the separation between
  two adjacent paragraphs. This value is a multiple of pt. This value is
  currently only utilized by the list-bundle to place extra spacing between two
  consecutive list items.

+ leftmargin:<number>

  This value holds the left margin in multiple of mm. It is currently only utilized
  by the list-bundle, blockquote-bundle, and verbatim-bundle to set their 
  left margin.

+ rubify:1

  If this flags has been set then the text will be rubified.

+ animate:x/1/10 y/2/20 z/3/30

  This value holds a list of environment variables and the start/end
  values for each one of them. This value is currently utilized by the
  'diagram' bundle, such that if this property is set, then the diagram
  will generate a number of animated diagrams each of which is made by
  altering the set of environment variables to something between its start
  and end values.
  
+ count:12

  This value holds the count for certain operation. This value is currently utilized
  by the 'diagrams' bundle to express the total number of animated diagrams to be made.

+ fillonly:1

  This value expresses whether certain operation is going to be treated
  as a "fillonly" operation, as a way of deviating its "default" operation.
  
+ fn:f

  This value expresses the name of a function.

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

+ shadowcolor:<color>

  When set to a color this property describes the color used for filling a drop
  shadow. When not set it defaults to 'black'.

+ shadowopacity:<number>

  When set to a number this property describes the opacity used for filling a drop
  shadow. When not set it defaults to '0.50'.

+ shadow:1

  When set to 1 it instructs that a drop shadow effect is to be added.
  Currently the only one that react this this option is the 'node', 'box'
  and 'trump' commands.  
  
  A drop shadow will be drawn shifted to the right and down for 0.5mm in both
  directions.  The color of the drop shadow and opacity can be controlled by 
  setting the 'shadowcolor' and 'shadowopacity' property to a different value.
  
  However, the same 'shadow' key can be set to '2', '3' or more to increase the 
  distance of the shadow. The distance of the shadow is computed as 0.5mm multipled
  by the integer.

+ id:1
+ id:lines

  Set the ID. This is currently utilized by the SAMP block to set the default
  ID if it is not specifically set.

+ wrap:left
+ wrap:right

  Set it so that the image, diagram, or a table should be placed inside a wrap figure
  such that the text should flow around it.

+ subfigure:1

  This option is used exclusively by "figure" float, although it might extend to 
  other floats in the figure.

  Without it, a figure would treat each image as itself without any
  subcaptions.  Thus each image will be arranged such that they each "floats"
  from left to right, and then wrap to the next line. When there isn't space
  around it anymore. 

  When this option is set to 1 the figure environment would treat each images
  as a "subfigure", such that they each would have a sub-caption, that goes
  underneath each image.

+ n:2

  This option is used currently by the "columns" float to express the number
  of columns. 

+ mar:1.23

  This option is to specify the length of the two arrows drawn on the left/right
  hand sides of a sloped text. When this option is present and the length is 
  a number other than zero, it specifies the length of the two arrows that will be drawn
  that points to the two end points given when drawing a sloped text.

+ subtitle:text

  This option sets the text for the sub-title. It is to be used by an Img or Diagram
  bundle to set the subtitle text.

+ nocaption:1

  When set to 1 this style asks that no caption text is to be shown. This option is currently
  utilized by figure, table, longtable, and listing blocks to specifically suppress the showing
  of caption text.




