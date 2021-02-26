---
title: HTML/CSS Specifications
---

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

+ main-start property
+ main-end property

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

+ `cross-start` property
+ `cross-end` property

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

Note that the inter-element white space disappears: it does not become its own
flex item, even though the inter-element text does get wrapped in an anonymous
flex item.

Note also that the anonymous item’s box is unstyleable, since there is no
element to assign style rules to. Its contents will however inherit styles
(such as font settings) from the flex container.

[ Margins. ]
The margins of adjacent flex items do not collapse.
Percentage margins and paddings on flex items, like those on block boxes, are
resolved against the inline size of their containing block, e.g.
left/right/top/bottom percentages all resolve against their containing block’s
width in horizontal writing modes.

Auto margins expand to absorb extra space in the corresponding dimension. They
can be used for alignment, or to push adjacent flex items apart. See Aligning
with auto margins.

[ Z-Ordering. ] Flex items paint exactly the same as inline blocks,
except that order-modified document order is used in place of raw document
order, and z-index values other than auto create a stacking context even if
position is static (behaving exactly as if position were relative).

Note: Descendants that are positioned outside a flex item still participate in
any stacking context established by the flex item.

[ Ordering and Orientation ] The contents of a flex container can be laid out
in any direction and in any order. This allows an author to trivially achieve
effects that would previously have required complex or fragile methods, such as
hacks using the float and clear properties. This functionality is exposed
through the `flex-direction`, `flex-wrap`, and `order` properties.

The `flex-direction` property specifies how flex items are placed in the flex
container, by setting the direction of the flex container’s main axis. This
determines the direction in which flex items are laid out.

+ `row`

  The flex container’s main axis has the same orientation as the inline axis of
  the current writing mode. The main-start and main-end directions are
  equivalent to the inline-start and inline-end directions, respectively, of
  the current writing mode.

+ `row-reverse`

  Same as row, except the main-start and main-end directions are swapped.

+ `column`

  The flex container’s main axis has the same orientation as the block axis of
  the current writing mode. The main-start and main-end directions are
  equivalent to the block-start and block-end directions, respectively, of the
  current writing mode.

+ `column-reverse`

  Same as column, except the main-start and main-end directions are swapped.

[ The justify-content property. ] The justify-content property aligns flex
items along the main axis of the current line of the flex container. This is
done after any flexible lengths and any auto margins have been resolved.
Typically it helps distribute extra free space leftover when either all the
flex items on a line are inflexible, or are flexible but have reached their
maximum size. It also exerts some control over the alignment of items when they
overflow the line.

+ `flex-start`

  Flex items are packed toward the start of the line. The main-start margin edge
  of the first flex item on the line is placed flush with the main-start edge of
  the line, and each subsequent flex item is placed flush with the preceding
  item.

+ `flex-end`

  Flex items are packed toward the end of the line. The main-end margin edge of
  the last flex item is placed flush with the main-end edge of the line, and each
  preceding flex item is placed flush with the subsequent item.

+ `center`

  Flex items are packed toward the center of the line. The flex items on the line
  are placed flush with each other and aligned in the center of the line, with
  equal amounts of space between the main-start edge of the line and the first
  item on the line and between the main-end edge of the line and the last item on
  the line. (If the leftover free-space is negative, the flex items will overflow
  equally in both directions.)

+ `space-between`

  Flex items are evenly distributed in the line. If the leftover free-space is
  negative or there is only a single flex item on the line, this value is
  identical to flex-start. Otherwise, the main-start margin edge of the first
  flex item on the line is placed flush with the main-start edge of the line, the
  main-end margin edge of the last flex item on the line is placed flush with the
  main-end edge of the line, and the remaining flex items on the line are
  distributed so that the spacing between any two adjacent items is the same.

+ `space-around`

  Flex items are evenly distributed in the line, with half-size spaces on either
  end. If the leftover free-space is negative or there is only a single flex item
  on the line, this value is identical to center. Otherwise, the flex items on
  the line are distributed such that the spacing between any two adjacent flex
  items on the line is the same, and the spacing between the first/last flex
  items and the flex container edges is half the size of the spacing between flex
  items.




