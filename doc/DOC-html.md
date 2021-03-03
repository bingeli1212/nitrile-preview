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
config fillcolor orange
config opacity 0.3
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

[ The `justify-content` property. ] The `justify-content` property aligns flex
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

  ```diagram{outline}
  viewport 18 2
  config w 2
  config h 2
  config fillcolor orange
  config opacity 0.3
  box "1\\2\\3" (0,0) [h:2] [h:2]
  ```

+ `flex-end`

  Flex items are packed toward the end of the line. The main-end margin edge of
  the last flex item is placed flush with the main-end edge of the line, and each
  preceding flex item is placed flush with the subsequent item.

  ```diagram{outline}
  viewport 18 2
  config w 2
  config h 2
  set refxy right:12
  config fillcolor orange
  config opacity 0.3
  box "1\\2\\3" (0,0) [h:2] [h:2]
  ```

+ `center`

  Flex items are packed toward the center of the line. The flex items on the line
  are placed flush with each other and aligned in the center of the line, with
  equal amounts of space between the main-start edge of the line and the first
  item on the line and between the main-end edge of the line and the last item on
  the line. (If the leftover free-space is negative, the flex items will overflow
  equally in both directions.)

  ```diagram{outline}
  viewport 18 2
  config w 2
  config h 2
  set refxy right:6
  config fillcolor orange
  config opacity 0.3
  box "1\\2\\3" (0,0) [h:2] [h:2]
  ```

+ `space-between`

  Flex items are evenly distributed in the line. If the leftover free-space is
  negative or there is only a single flex item on the line, this value is
  identical to flex-start. Otherwise, the main-start margin edge of the first
  flex item on the line is placed flush with the main-start edge of the line, the
  main-end margin edge of the last flex item on the line is placed flush with the
  main-end edge of the line, and the remaining flex items on the line are
  distributed so that the spacing between any two adjacent items is the same.

  ```diagram{outline}
  viewport 18 2
  config w 2
  config h 2
  config fillcolor orange
  config opacity 0.3
  box "1\\2\\3" (0,0) [h:8] [h:8] 
  ```

+ `space-around`

  Flex items are evenly distributed in the line, with half-size spaces on either
  end. If the leftover free-space is negative or there is only a single flex item
  on the line, this value is identical to center. Otherwise, the flex items on
  the line are distributed such that the spacing between any two adjacent flex
  items on the line is the same, and the spacing between the first/last flex
  items and the flex container edges is half the size of the spacing between flex
  items.

  ```diagram{outline}
  viewport 18 2
  config w 2
  config h 2
  config fillcolor orange
  config opacity 0.3
  box "1\\2\\3" (3,0) [h:5] [h:5] 
  ```

[ The `align-items` and `align-self` properties. ]
Flex items can be aligned in the cross axis of the current line of the flex
container, similar to `justify-content` but in the perpendicular direction.
The `align-items` sets the default alignment for all of the flex container’s items,
including anonymous flex items. The `align-self` allows this default alignment
to be overridden for individual flex items. (For anonymous flex items,
`align-self` always matches the value of `align-items` on their associated flex
container.)

If either of the flex item’s `cross-axis` margins is set to `auto`, the
`align-self` property has no effect.

+ `auto`

  Defers cross-axis alignment control to the value of `align-items` on the
  parent box. (This is the initial value of `align-self`.)

+ `flex-start`

  The cross-start margin edge of the flex item is placed flush with the
  cross-start edge of the line.

+ `flex-end`

  The cross-end margin edge of the flex item is placed flush with the cross-end
  edge of the line.

+ `center`

  The flex item’s margin box is centered in the cross axis within the line. (If
  the cross size of the flex line is less than that of the flex item, it will
  overflow equally in both directions.)

+ `baseline`

  The flex item participates in baseline alignment: all participating flex items
  on the line are aligned such that their baselines align, and the item with the
  largest distance between its baseline and its cross-start margin edge is placed
  flush against the cross-start edge of the line. If the item does not have a
  baseline in the necessary axis, then one is synthesized from the flex item’s
  border box.

+ `stretch`

  If the cross size property of the flex item computes to auto, and neither of
  the cross-axis margins are auto, the flex item is stretched. Its used value is
  the length necessary to make the cross size of the item’s margin box as close
  to the same size as the line as possible, while still respecting the
  constraints imposed by `min-height`/`min-width`/`max-height`/`max-width`.

[ The `align-content` property. ]
The `align-content` property is designed to align
each line of flex items across the cross-axis. This property will have no effect
when there is only a single line.


[ The `order` property. ]
Many web pages have a similar shape in the markup, with a header on top, a
footer on bottom, and then a content area and one or two additional columns in
the middle. Generally, it’s desirable that the content come first in the page’s
source code, before the additional columns. However, this makes many common
designs, such as simply having the additional columns on the left and the
content area on the right, difficult to achieve. This has been addressed in
many ways over the years, often going by the name "Holy Grail Layout" when
there are two additional columns. order makes this trivial. For example, take
the following sketch of a page’s code and desired layout:

    <!DOCTYPE html>
    <header>...</header>
    <main>
       <article>...</article>
       <nav>...</nav>
       <aside>...</aside>
    </main>
    <footer>...</footer> 

Here is the CSS:

    main { display: flex; }
    main > article { order: 2; min-width: 12em; flex:1; }
    main > nav     { order: 1; width: 200px; }
    main > aside   { order: 3; width: 200px; }

As an added bonus, the columns will all be equal-height by default, and the
main content will be as wide as necessary to fill the screen. Additionally,
this can then be combined with media queries to switch to an all-vertical
layout on narrow screens:

    @media all and (max-width: 600px) {
      /* Too narrow to support three columns */
      main { flex-flow: column; }
      main > article, main > nav, main > aside {
        /* Return them to document order */
        order: 0; width: auto;
      }
    }

```diagram
viewport 18 8
config fillcolor orange
config opacity 0.3
box {w:18,h:2} "footer" (0,0)
box {w:18,h:2} "header" (0,6)
box {w:4,h:4} "nav"      (0,2)
box {w:10,h:4} "article" (4,2)
box {w:4,h:4} "aside"    (14,2)
```

[ Flex Lines. ]
Flex items in a flex container are laid out and aligned within flex lines,
hypothetical containers used for grouping and alignment by the layout
algorithm. A flex container can be either single-line or multi-line, depending
on the `flex-wrap` property:

- A single-line flex container (i.e. one with `flex-wrap: nowrap`) lays out all
  of its children in a single line, even if that would cause its contents to
  overflow.

- A multi-line flex container (i.e. one with `flex-wrap:wrap` or 
  `flex-wrap:wrap-reverse`) breaks its flex items across multiple lines, similar to how
  text is broken onto a new line when it gets too wide to fit on the existing
  line. When additional lines are created, they are stacked in the flex
  container along the cross axis according to the `flex-wrap` property. Every
  line contains at least one flex item, unless the flex container itself is
  completely empty.

[[[ Example 1. ]]]
This example shows four buttons that do not fit side-by-side horizontally, and
therefore will wrap into multiple lines.

    #flex {
      display: flex;
      flex-flow: row wrap;
      width: 300px;
    }
    .item {
      width: 80px;
    }
    <div id="flex">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
    </div>

Since the container is 300px wide, only three of the items fit onto a single
line. They take up 240px, with 60px left over of remaining space.  Because the
flex-flow property specifies a multi-line flex container (due to the wrap
keyword appearing in its value), the flex container will create an additional
line to contain the last item.
 
```diagram{outline} 
viewport 15 4 
group my = {w:4,h:2,fillcolor:orange,opacity:0.3} 
box {group:my} "1" (0,2) 
box {group:my} "2" (4,2) 
box {group:my} "3" (8,2) 
box {group:my} "4" (0,0) 
```

Once content is broken into lines, each line is laid out independently;
flexible lengths and the justify-content and align-self properties only
consider the items on a single line at a time.

In a multi-line flex container (even one with only a single line), the cross
size of each line is the minimum size necessary to contain the flex items on
the line (after alignment due to align-self), and the lines are aligned within
the flex container with the align-content property. In a single-line flex
container, the cross size of the line is the cross size of the flex container,
and align-content has no effect. The main size of a line is always the same as
the main size of the flex container’s content box.

[[[ Example 2. ]]]
Here’s the same example as the previous, except that the flex items have all
been given `flex:auto`. The first line has 60px of remaining space, and all of
the items have the same flexibility, so each of the three items on that line
will receive 20px of extra width, each ending up 100px wide. The remaining item
is on a line of its own and will stretch to the entire width of the line, i.e.
300px.  Since the container is 300px wide, only three of the items fit onto a
single line. They take up 240px, with 60px left over of remaining space.
Because the `flex-flow` property specifies a multi-line flex container (due to
the wrap keyword appearing in its value), the flex container will create an
additional line to contain the last item.

```diagram{outline}
viewport 15 4
group my = {w:5,h:2,fillcolor:orange,opacity:0.3} 
group my2 = {w:15,h:2,fillcolor:orange,opacity:0.3} 
box {group:my} "1" (0,2) 
box {group:my} "2" (5,2) 
box {group:my} "3" (10,2) 
box {group:my2} "4" (0,0) 
```

[ Controlling flexibility of each flex item. ]
The defining aspect of flex layout is the ability to make the flex items
“flex”, altering their width/height to fill the available space in the main
dimension. This is done with the flex property. A flex container distributes
free space to its items (proportional to their flex grow factor) to fill the
container, or shrinks them (proportional to their flex shrink factor) to
prevent overflow.

The `flex` property is to be set with each flex item. Its value affects the
final length of this flex item.  In particular, when a flex item is being
managed by a flex container, the `width`/`height` property of the flex item
becomes less important when its `flex` property is set, in which case the size
of the flex item is recomputed based upon the actual contents of this value and
the available spaces within the container. 

The `flex` property is a shorthand that holds property values from three
specialized properties: `flex-grow`, `flex-shrink`, and `flex-basis`.  A flex
item is inflexible if both `flex-grow` and `flex-shrink` properties are set to
zero. Following are descriptions of the three properties individually.

+ `flex-grow`

  This "number" component sets flex-grow longhand and specifies the flex grow
  factor, which determines how much the flex item will grow relative to the
  rest of the flex items in the flex container when positive free space is
  distributed. When omitted, it is set to 1.

  Flex values between 0 and 1 have a somewhat special behavior: when the sum of
  the flex values on the line is less than 1, they will take up less than 100%
  of the free space.

+ `flex-shrink`

  This "number" component sets flex-shrink longhand and specifies the flex
  shrink factor, which determines how much the flex item will shrink relative
  to the rest of the flex items in the flex container when negative free space
  is distributed. When omitted, it is set to 1.

  Note: The flex shrink factor is multiplied by the flex base size when
  distributing negative space. This distributes negative space in proportion to
  how much the item is able to shrink, so that e.g. a small item won’t shrink
  to zero before a larger item has been noticeably reduced.

+ `flex-basis`

  This component sets the `flex-basis longhand`, which specifies the flex basis:
  the initial main size of the flex item, before free space is distributed
  according to the flex factors.  The `flex-basis` property accepts the same
  values as the width and height properties (except that auto is treated
  differently) plus the content keyword:

  + `auto`
     
    When specified on a flex item, the auto keyword retrieves the value of the
    main size property as the used flex-basis. If that value is itself auto,
    then the used value is content.

  + `content`

    Indicates an automatic size based on the flex item’s content. (It is
    typically equivalent to the max-content size, but with adjustments to
    handle aspect ratios, intrinsic sizing constraints, and orthogonal flows;
    see details in §9 Flex Layout Algorithm.)

    Note: This value was not present in the initial release of Flexible Box
    Layout, and thus some older implementations will not support it. The
    equivalent effect can be achieved by using auto together with a main size
    (width or height) of auto.

  + [width]

    For all other values, `flex-basis` is resolved the same way as for [width]
    and [height].  When omitted from the flex shorthand, its specified value is
    0. When omitted from the `flex` shorthand, its specified value is assumed
    to be 0.

When `flex:none` is encountered, the "none" keyword expands to be "0 0 auto".
Authors are encouraged to control flexibility using the flex shorthand rather
than with its longhand properties directly, as the shorthand correctly resets
any unspecified components to accommodate common uses.

[ Aligning with "auto" margins. ] Auto margins on flex items have an effect
very similar to auto margins in block flow:

- During calculations of flex bases and flexible lengths, auto margins are
  treated as 0.

- Prior to alignment via justify-content and align-self, any positive free space
  is distributed to auto margins in that dimension.

- Overflowing boxes ignore their auto margins and overflow in the end direction.

Note: If free space is distributed to auto margins, the alignment properties
will have no effect in that dimension because the margins will have stolen all
the free space left over after flexing.

[[[ Example 3. ]]]
One use of auto margins in the main axis is to separate flex items into
distinct "groups". The following example shows how to use this to reproduce a
common UI pattern - a single bar of actions with some aligned on the left and
others aligned on the right.

    nav > ul {
      display: flex;
    }
    nav > ul > #login {
      margin-left: auto;
    }
    <nav>
      <ul>
        <li>About</li>
        <li>Projects</li>
        <li>Interact</li>
        <li id="login">Login</li>
      </ul>
    </nav>

```diagram{outline}
viewport 20 2
config fillcolor orange
config opacity 0.3
box {w:4,h:2} "About"    (0,0)
box {w:4,h:2} "Projects" (4,0)
box {w:4,h:2} "Interact" (8,0)
box {w:4,h:2} "Login"    (16,0)
```

[[[ Example 4. ]]]
The figure below illustrates the difference in cross-axis alignment in overflow
situations between using auto margins and using the alignment properties.
The items in the figure on the left are centered with margins, while those in
the figure on the right are centered with align-self. If this column flex
container was placed against the left edge of the page, the margin behavior
would be more desirable, as the long item would be fully readable. In other
circumstances, the true centering behavior might be better.

```diagram{outline}
viewport 11 10
draw {fillcolor:gray,opacity:0.3} &rectangle{(3,0),5,10}
box {fillcolor:orange,opacity:0.3,w:3} "Blog" (4,1)
box {fillcolor:orange,opacity:0.3,w:4} "About" (3.5,4)
box {fillcolor:orange,opacity:0.3,w:8} "Hello World" (3,7)
```
```diagram{outline}
viewport 11 10
draw {fillcolor:gray,opacity:0.3} &rectangle{(3,0),5,10}
box {fillcolor:orange,opacity:0.3,w:3} "Blog" (4,1)
box {fillcolor:orange,opacity:0.3,w:4} "About" (3.5,4)
box {fillcolor:orange,opacity:0.3,w:8} "Hello World" /-1.5,/ (3,7)
```

# Draw Text Along A Path

Note that the dx='' attribute in this case is used to shift the text along 
the path, such that when dx='' is set to be half the length of the path
and text-anchor='middle' then the text is placed around the center
of the path. the dy='' attribute shifts the text up and down the path, 
such that when dy='' is negative it shifts text up and when dy='' is 
positive it shifts text down. By default the text's base line aligns
with the path.

    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- to hide the path, it is usually wrapped in a <defs> element -->
      <!-- <defs> -->
      <path id="MyPath" fill="none" stroke="red"
            d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
      <!-- </defs> -->
      <text>
        <textPath href="#MyPath">
          Quick brown fox jumps over the lazy dog.
        </textPath>
      </text>
    </svg>

