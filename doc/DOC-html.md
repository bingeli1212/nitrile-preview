# HTML/EPUB Translation


# Issues and remarks

- When changing the font size, it is best to do it
  at the paragraph level, such as at the level of a P-element,
  or a TABLE-element, etc. If font size were changed using
  a SPAN-element of an individual part of the text, or 
  a table data cell (TD-element), then the inter-line-spacing
  is not adjusted, such that wider gaps between lines is
  going to be observed.

- The SVG-math seems to be effected by the change of a font-size
  as well and it is shrinked or expanded in accordance to the 
  size of the relative font size such as `0.7em`, `1.2em`.

- Following BLOCK are to be place inside a <figure>: 
  PICT, TABR, FRMD, DIAG, VERB, MATH

- The font size change for "nitabb", "nicode", "niprog" and "nicaption"
  are to be done by providing a CSS that sets the font-size
  style.

  %!HTML.css+=.nitabb{font-size:0.8em}
  %!HTML.css+=.nicode{font-size:0.9em}
  %!HTML.css+=.niprog{font-size:0.9em}
  %!HTML.css+=.nicaption{font-size:0.8em}
 
  The settings will have to be defined different differently
  for HTML and EPUB, thus allowing each translation to take on 
  a different stylesheet settings.

  %!EPUB.css+=.nitabb{font-size:0.8em}
  %!EPUB.css+=.nicode{font-size:0.9em}
  %!EPUB.css+=.niprog{font-size:0.9em}
  %!EPUB.css+=.nicaption{font-size:0.8em}

  Note that '+=' is used here instead of the normal '='.
  This allows the CSS to be built incrementally. On top
  of that, each addition by string by '+=' is going to be
  prepended with a newline character, except for the very
  first item.    


# Inline BARCHART 

The inline BARCHART takes on a syntax of the following.

  \vbarchart{width;height;data}

The 'width' argument is a number expressing in mm the width of the chart
on paper. The 'height' argument is a number expressing in mm the height
of the chart on paper. The 'data' argument is a list of floats, each separated
by a comma, the height of the bar. This number must be in the range from 0-1.

For example, the barchart of \vbarchart{20;10;0.2,0.8,0.6,0.4,1.0}
would have generated the following SVG code.

  </svg>
  <svg xmlns='http://www.w3.org/2000/svg' 
       xmlns:xlink='http://www.w3.org/1999/xlink' 
       width='20mm' height='10mm' 
       fill='currentColor' 
       stroke='currentColor' >
  <rect x='0' y='30.24' width='15.12' height='6.56' stroke='inherit' fill='none' />
  <rect x='15.12' y='7.56' width='15.12' height='29.24' stroke='inherit' fill='none' />
  <rect x='30.24' y='15.12' width='15.12' height='21.68' stroke='inherit' fill='none' />
  <rect x='45.36' y='22.68' width='15.12' height='14.12' stroke='inherit' fill='none' />
  <rect x='60.48' y='0' width='15.12' height='36.8' stroke='inherit' fill='none' />
  </svg>

Note that 1mm is 3.78px.
Thus, 20mm translates to 75.6px, and 10mm to 37.8px. These numbers are
utilized by the 'transform=' attribute so that each rect is shown in the
correct scaled size by the 'width' and 'height' arguments.


# Inline XYPLOT   

The inline XYPLOT takes on a syntax of the following.

  \xyplot{width;height;data}

The 'width' argument is a number expressing in mm the width of the chart
on paper. The 'height' argument is a number expressing in mm the height
of the chart on paper. The 'data' argument is a list of floats, each separated
by a comma. Each pair of number expresses one point in the coordinates.
Each coordinate is in the range of 0-1.

For example, the barchart of \xyplot{20;10;0.2,0.2,0.3,0.3,0.4,0.4}
would have generated the following SVG code.

  </svg>
  <svg xmlns='http://www.w3.org/2000/svg' 
       xmlns:xlink='http://www.w3.org/1999/xlink' 
       width='20mm' height='10mm' 
       fill='currentColor' 
       stroke='currentColor' >
  ...
  </svg>

Note that 1mm is 3.78px.
Thus, 20mm translates to 75.6px, and 10mm to 37.8px. These numbers are
utilized by the 'transform=' attribute so that each rect is shown in the
correct scaled size by the 'width' and 'height' arguments.

# Break Columns

Create a new div-element such that it will have a CSS of "break-before:column".

    <div style='columns:2;'> 
    Text ...
    <div style='break-before:column;'></div> 
    Text ...
    </div>

Note that contents inside a DIV-element with its "columns:2" setting, the
"width:100%" style for a child element within it would have occupied only the
entire width of the column, not the entire width of the DIV-element.

To force manual break of the content into different columns, add the following
before the contents. Note that it must be DIV-element, the SPAN-element won't
work.

    <div style='break-before:column;'></div> 

# The "flex" Layout

Some terminologies:

+ main axis
+ main dimension

  The main axis of a flex container is the primary axis along which flex items
  are laid out. It extends in the main dimension.

+ main-start
+ main-end

  The flex items are placed within the container starting on the main-start side
  and going toward the main-end side.

+ main size
+ main size property

  The width or height of a flex container or flex item, whichever is in the main
  dimension, is that box’s main size. Its main size property is thus either its
  width or height property, whichever is in the main dimension. Similarly, its
  min and max main size properties are its min-width/max-width or
  min-height/max-height properties, whichever is in the main dimension, and
  determine its min/max main size.

+ cross axis
+ cross dimension

  The axis perpendicular to the main axis is called the cross axis. It extends in
  the cross dimension.

+ cross-start
+ cross-end

  Flex lines are filled with items and placed into the container starting on the
  cross-start side of the flex container and going toward the cross-end side.

+ cross size
+ cross size property

  The width or height of a flex container or flex item, whichever is in the cross
  dimension, is that box’s cross size. Its cross size property is thus either its
  width or height property, whichever is in the cross dimension. Similarly, its
  min and max cross size properties are its min-width/max-width or
  min-height/max-height properties, whichever is in the cross dimension, and
  determine its min/max cross size.

Flex containers are not block containers, and so some properties that were
designed with the assumption of block layout don’t apply in the context of flex
layout. In particular:

- float and clear do not create floating or clearance of flex item, and do not
  take it out-of-flow.

- vertical-align has no effect on a flex item.

- the ::first-line and ::first-letter pseudo-elements do not apply to flex
  containers, and flex containers do not contribute a first formatted line or
  first letter to their ancestors.

Loosely speaking, the flex items of a flex container are boxes representing its
in-flow contents.

Each in-flow child of a flex container becomes a flex item, and each contiguous
sequence of child text runs is wrapped in an anonymous block container flex
item. However, if the entire sequence of child text runs contains only white
space (i.e. characters that can be affected by the white-space property) it is
instead not rendered (just as if its text nodes were display:none).

    <div style="display:flex">
        <!-- flex item: block child -->
        <div id="item1">block</div>
        <!-- flex item: floated element; floating is ignored -->
        <div id="item2" style="float: left;">float</div>
        <!-- flex item: anonymous block box around inline content -->
        anonymous item 3
        <!-- flex item: inline child -->
        <span>
            item 4
            <!-- flex items do not split around blocks -->
            <q style="display: block" id=not-an-item>item 4</q>
            item 4
        </span>
    </div>

```diagram
viewport 21 4
box {w:4,h:4} "block" (0,0)
box {w:3,h:4} "float" (4,0)
box {w:10,h:4} "anonymous item 3" (7,0)
box {w:4,h:4} "item 4\\&quot;item 4&quot;\\item 4" (17,0)
```

