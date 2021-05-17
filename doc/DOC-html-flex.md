---
title: CSS Flexbox Layout Module
---

# CSS Flexbox Layout Module

Before the Flexbox Layout module, there were four layout modes:

- Block, for sections in a webpage
- Inline, for text
- Table, for two-dimensional table data
- Positioned, for explicit position of an element

The Flexible Box Layout Module, makes it easier to design flexible responsive
layout structure without using float or positioning.


# Flex Containers and Flex Items

Flex containers are not considered block containers, thus some properties that 
would normally work in the context of a block layout do not necessarily 
work in the context of a flex layout. In particular,

- setting the `float` property of a flex item do not create the sense of a 
  "float", an effect of which that was achieved in the context
  of a block layout by taking this element out-of-flow;

- setting the `vertical-align` property on a flex item 
  has no visual effect;

- a flex container does not contribute a first formatted line or
  first letter to their ancestors;
  thus, the notation of ``::first-line`` and/or ``::first-letter`` 
  pseudo-element done to a flex container has no effect;

- margins of two adjacent flex items do not collapse. 

In addition, if a specific direction of a margin is set to ``auto``, 
which is called an &em{auto margin}, it serves to expand to absorb 
all extra space in that direction. An auto margin
can be set to achieve the effect of aligning that item in the cross-axis 
dimension if the margin is set at that direction. 
The same auto margin could also be used to push 
a flex item away from one of its neighboring items
in the main-axis dimension if the margin happens to be facing that direction.

Loosely speaking, flex items of a flex container are considered
"in-flow contents" of this flex container.
As for a HTML document,
each child element of a flex container parent automatically becomes a flex item 
of that container.
All text between two child elements are indirectly becoming part of a flex item
by being wrapped inside an anonymous element where that element itself becoming
the flex item.
Should those text contains only white
space then this anonymous element is not rendered,  
which could be considered equivalent to being set the ``display:none``
property.

@ figure{subfigure}
  &label{flex:container}
  Following is a flex container with four flex items:
  two of which are the Div-elements, one anonymous element, 
  and one Span-element.

  ```verbatim{frame,subtitle}
  HTML
  ---
  <div style="display:flex">
    <div>block</div>
    <div style="float:left;">float</div>
    anonymous
    <span>
      item 1
      <q style="display:block">item 2</q>
      item 3
    </span>
  </div>
  ```
  \\
  ```diagram{frame,subtitle}
  Visual
  ---
  viewport 21 4
  config fillcolor orange
  config opacity 0.3
  box {w:4,h:4} "block" (0,0)
  box {w:3,h:4} "float" (4,0)
  box {w:10,h:4} "anonymous" (7,0)
  box {w:4,h:4,multiline} "item 1\\&quot;item 2&quot;\\item 3" (17,0)
  ```

See figure &ref{flex:container} for an example of a flex container of
four flex items.
Note also that in the case that an anonymous item is created
it is unstyleable. It means that it is impossible to write CSS rules
to specifically target this item. As a result
it will inherit styles
(such as font settings) from the flex container instead.


# The Z-Ordering of a Flexbox Item

Flex items paint exactly the same as inline blocks,
except that order-modified document order is used in place of raw document
order, and z-index values other than auto create a stacking context even if
position is static (behaving exactly as if position were relative).

Note: Descendants that are positioned outside a flex item still participate in
any stacking context established by the flex item.


# Aligning Flex Items Within the Container

Items within a flex container are to be aligned vertically and/or horizontally.
Before the details are discussed following are some
key concepts that are to be covered first.

[ The main axis. ]
The &em{main axis} of a flex container is the primary axis along which flex items
are laid out. It is either horizontal or vertical. 
The direction within which the main axis extends is sometimes
called the &em{main dimension}.

The width or height of a flex container or flex item
is considered the box's &em{main size} if it happens to align
with the main axis. For instance, if the main axis is the horizontal axis,
then the flex item's width becomes the main size of this flex item. 
If the same flex item also has a property named `min-width` or `max-width`,
the values they represent 
would be considered the &em{min main size} and/or &em{max main size} 
of this flex item.

[ The cross axis. ]
The &em{cross axis} is always the one that is
perpendicular to the main axis. The dimension it extends is
called the cross dimension. For instance, if the main axis is the horizontal
axis, then the cross axis is the vertical axis. On the other hand,
if the main axis is the vertical axis, the cross axis is the horizontal
axis.

The width or height of flex item would be considered its &em{cross size}, 
if it happens to align with its cross axis. For instance, if the cross axis
is the vertical axis, then its height would be considered its cross size.

The contents of a flex container can be laid out
in any direction and in any order. This allows an author to trivially achieve
effects that would previously have required complex or fragile methods, such as
hacks using the float and clear properties. This functionality is exposed
through the `flex-direction`, `flex-wrap`, and `order` properties.

[ The `flex-direction` property. ] This property 
sets the direction and orientation of the main axis of the flex container. 
For a horizontal main axis, its value could be ``row`` or ``row-reverse``.
For a vertical main axis, its value could be ``column`` or ``column-reverse``.

- ``row``

  The flex container’s main axis has the same orientation as the inline axis of
  the current writing mode. The main-start and main-end directions are
  equivalent to the inline-start and inline-end directions, respectively, of
  the current writing mode.

- ``row-reverse``

  Same as row, except the main-start and main-end directions are swapped.

- ``column``

  The flex container’s main axis has the same orientation as the block axis of
  the current writing mode. The main-start and main-end directions are
  equivalent to the block-start and block-end directions, respectively, of the
  current writing mode.

- ``column-reverse``

  Same as column, except the main-start and main-end directions are swapped.

[ The `justify-content` property. ] This property determines how flex
items are aligned along the main axis of the flex container. 

This is
done after any flexible lengths and any auto margins have been resolved.
Typically it helps distribute extra free space leftover when either all the
flex items on a line are inflexible, or are flexible but have reached their
maximum size. It also exerts some control over the alignment of items when they
overflow the line.

- ``flex-start``

  Flex items are packed toward the start of the line. The main-start margin edge
  of the first flex item on the line is placed flush with the main-start edge of
  the line, and each subsequent flex item is placed flush with the preceding
  item.

  ```diagram{frame}
  viewport 18 2
  config w 2
  config h 2
  config fillcolor orange
  config opacity 0.3
  box "1" (0,0) [h:2] [h:2]
  ```

- ``flex-end``

  Flex items are packed toward the end of the line. The main-end margin edge of
  the last flex item is placed flush with the main-end edge of the line, and each
  preceding flex item is placed flush with the subsequent item.

  ```diagram{frame}
  viewport 18 2
  config w 2
  config h 2
  origin right:12
  config fillcolor orange
  config opacity 0.3
  box "1" (0,0) [h:2] [h:2]
  ```

- ``center``

  Flex items are packed toward the center of the line. The flex items on the line
  are placed flush with each other and aligned in the center of the line, with
  equal amounts of space between the main-start edge of the line and the first
  item on the line and between the main-end edge of the line and the last item on
  the line. (If the leftover free-space is negative, the flex items will overflow
  equally in both directions.)

  ```diagram{frame}
  viewport 18 2
  config w 2
  config h 2
  origin right:6
  config fillcolor orange
  config opacity 0.3
  box "1" (0,0) [h:2] [h:2]
  ```

- ``space-between``

  Flex items are evenly distributed in the line. If the leftover free-space is
  negative or there is only a single flex item on the line, this value is
  identical to flex-start. Otherwise, the main-start margin edge of the first
  flex item on the line is placed flush with the main-start edge of the line, the
  main-end margin edge of the last flex item on the line is placed flush with the
  main-end edge of the line, and the remaining flex items on the line are
  distributed so that the spacing between any two adjacent items is the same.

  ```diagram{frame}
  viewport 18 2
  config w 2
  config h 2
  config fillcolor orange
  config opacity 0.3
  box "1" (0,0) [h:8] [h:8] 
  ```

- ``space-around``

  Flex items are evenly distributed in the line, with half-size spaces on either
  end. If the leftover free-space is negative or there is only a single flex item
  on the line, this value is identical to center. Otherwise, the flex items on
  the line are distributed such that the spacing between any two adjacent flex
  items on the line is the same, and the spacing between the first/last flex
  items and the flex container edges is half the size of the spacing between flex
  items.

  ```diagram{frame}
  viewport 18 2
  config w 2
  config h 2
  config fillcolor orange
  config opacity 0.3
  box "1" (3,0) [h:5] [h:5] 
  ```

[ The `align-items` and `align-self` properties. ] These
properties are designed to determine how flex items are aligned
along the cross axis.

In particular, the `align-items` property is to be set to a flex container
to set the default alignment for all flex items,
including anonymous flex items. The `align-self` property is to be 
set on individual flex items which allows for a specific flex item's
cross axis alignment to be overridden. 
However, for `align-self` to take effect, ensure that the cross-axis margin of that
item in that direction is not set to ``auto``.
Otherwise, the `align-self` property will have no effect.

Following are the possible values for these two properties.

- ``auto``

  Defers cross-axis alignment control to the value of `align-items` on the
  parent box. (This is the initial value of `align-self`.)

- ``flex-start``

  The cross-start margin edge of the flex item is placed flush with the
  cross-start edge of the line.

- ``flex-end``

  The cross-end margin edge of the flex item is placed flush with the cross-end
  edge of the line.

- ``center``

  The flex item’s margin box is centered in the cross axis within the line. (If
  the cross size of the flex line is less than that of the flex item, it will
  overflow equally in both directions.)

- ``baseline``

  The flex item participates in baseline alignment: all participating flex items
  on the line are aligned such that their baselines align, and the item with the
  largest distance between its baseline and its cross-start margin edge is placed
  flush against the cross-start edge of the line. If the item does not have a
  baseline in the necessary axis, then one is synthesized from the flex item’s
  border box.

- ``stretch``

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
The `order` property allows for arbitrary re-arranging the order of
flex items within a container to make it possible for some items to 
appear before or after other items
regardless of their natives orders inside the DOM.
This allows for greater flexibility when it comes to determining
the order of their appearances because 
the order is no longer constrained by their natural 
order within the DOM.

@ figure{subfigure}
  &label{flex:order}
  A flex container with three items each of which
  assigned a order such that the item "article" appears
  in the middle rather than being at the beginning.
  
  ```verbatim{frame,subtitle}
  HTML
  ---
  <!DOCTYPE html>
  <header>...</header>
  <main>
     <article>...</article>
     <nav>...</nav>
     <aside>...</aside>
  </main>
  <footer>...</footer> 
  ```  
  ```diagram{frame,subtitle,width:8cm}
  Visual
  ---
  viewport 18 8
  config fillcolor orange
  config opacity 0.3
  box {w:18,h:2} "footer" (0,0)
  box {w:18,h:2} "header" (0,6)
  box {w:4,h:4} "nav"      (0,2)
  box {w:10,h:4} "article" (4,2)
  box {w:4,h:4} "aside"    (14,2)
  ```
  \\
  ```verbatim{frame,subtitle}
  CSS
  ---
  main { display: flex; }
  main > article { order:2; min-width:12em; flex:1; }
  main > nav     { order:1; width: 200px; }
  main > aside   { order:3; width: 200px; }
  ```

See figure &ref{flex:order} for an example of setting the `order` property
of each flex item to alter their order of appearance
within the container.
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




# Multi-line Flexbox Layout

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

@ figure{subfigure}
  &label{flex:example-1} 
  This example shows four buttons that do not fit side-by-side horizontally, and
  therefore will wrap into multiple lines.
  Since the container is 300px wide, only three of the items fit onto a single
  line. They take up 240px, with 60px left over of remaining space.  Because the
  flex-flow property specifies a multi-line flex container (due to the wrap
  keyword appearing in its value), the flex container will create an additional
  line to contain the last item.

  ```verbatim{frame,subtitle}
  CSS
  ---
  #flex {
    display: flex;
    flex-flow: row wrap;
    width: 300px;
  }
  .item {
    width: 80px;
  }
  ```
  ```verbatim{frame,subtitle}
  HTML
  ---
  <div id="flex">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
  </div>
  ```
  \\
  ```diagram{frame,subtitle}
  Visual.
  --- 
  viewport 15 4 
  group my = {w:4,h:2,fillcolor:orange,opacity:0.3} 
  box {group:my} "1" (0,2) 
  box {group:my} "2" (4,2) 
  box {group:my} "3" (8,2) 
  box {group:my} "4" (0,0) 
  ```

Once content is broken into lines, each line is laid out independently;
the `justify-content` and `align-self` properties only
consider the items on a single line at a time.

In a multi-line flex container, the cross
size of each line is the minimum size necessary to hold all flex items of
that line. This is also true when there were only  
a single line being shown due to the availability of only a few flex items.

Whether it is shown as a single line or multiple lines,
each line is called a &em{flex line}. 
Flex lines themselves can be configured as to how they would position themselves
with the same flex container such as to move to one end of the container, 
to stay centered within the container, or to be spread out.
This control this behavior it is to set the `align-content` property
of the flex container. 

For a single-line flex
container, the cross size of the flex line is always the 
cross size of the flex container. Because there is only a single
flex line and its size is the same as the container, 
the `align-content` property would have no effect regardless of what
value it has been set to. 

@ figure{subfigure}
  &label{flex:example-2}
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

  ```verbatim{frame,subtitle}
  CSS
  ---
  #flex {
    display: flex;
    flex-flow: row wrap;
    width: 300px;
  }
  .item {
    width: 80px;
    flex: auto;
  }
  ```
  ```verbatim{frame,subtitle}
  HTML
  ---
  <div id="flex">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
  </div>
  ```
  \\
  ```diagram{frame,subtitle}
  Visual
  ---
  viewport 15 4
  group my = {w:5,h:2,fillcolor:orange,opacity:0.3} 
  group my2 = {w:15,h:2,fillcolor:orange,opacity:0.3} 
  box {group:my} "1" (0,2) 
  box {group:my} "2" (5,2) 
  box {group:my} "3" (10,2) 
  box {group:my2} "4" (0,0) 
  ```


# Expanding and Shrinking of a Flex Item

In addition to managing the locations of each flex item,
the main axis and cross axis size of a flex item can also be changed.
This particular behavior is controlling by assigning the appropriate values 
of the `flex` property of that flex item. 
Depending on the particular value,
a flex container is able to enlarge or shrink the cross size
of a flex item based on their initial size in that dimension
and the available space given by the container.

[ The `flex` property. ] This property determines the &em{flexibility} 
of a flex item.
This property is a shorthand property that holds a list of 
property values each 
of which coming from one of the following
three areas: `flex-grow`, `flex-shrink`, and `flex-basis`. 
The first two properties serve
as "growth factor" or "shrink factor" that will
be used to determine how fast it should grow or shrink relative
to other peer items.
The last property restates or resets
initial size of the item.

In general, a flex item is considered &em{completely flexible} 
if both its `flex-grow` and `flex-shrink` properties have been set to
something other than zero.
If both properties have been set to zero then this item is considered
to be &em{completely inflexible}.
 
[ The `flex-grow` property. ]
This property holds a number that expresses the growth
factor of this item. This factor is used to determine how this flex item 
is to grow relative to other
items when positive free space is
distributed. When omitted, it is set to 1.
Flex values between 0 and 1 have a somewhat special behavior: when the sum of
the flex values on the line is less than 1, together 
they will take up less than 100 percent
of the free space.

[ The `flex-shrink` property. ]
This property holds a number that expresses the 
shrink factor of this item. This factor determines how this flex item 
will shrink relative
to other items in the container when negative free space
is distributed. When omitted, it is set to 1.
The flex shrink factor is multiplied by the flex base size when
determining how much a particular item should shrink. 
This prevents a small item from being shrunk 
to zero before a larger item had a chance to 
be noticeably reduced.

[ The `flex-basis` property. ]
This property sets the flex basis, which
describes the main size of the flex item.  
This property accepts the same
length values as the `width` and `height` properties would.
In addition, it can be set to ``auto`` and/or ``content``.

- ``auto``
     
    When specified on a flex item, the ``auto`` keyword retrieves the value 
    that has been set to its
    main size property. If that value is itself ``auto``,
    then it behaves the same as ``content``.

- ``content``

    This value expresses that the item’s native content size should be used. 
    This size is typically equivalent to the max-content size, but it could
    be adjusted to
    handle aspect ratios, intrinsic sizing constraints, and orthogonal flows;
    see details in §9 Flex Layout Algorithm.

    Note: This value was not present in the initial release of Flexible Box
    Layout, and thus some older implementations will not support it. The
    equivalent effect can be achieved by setting the ``flex-basis:auto`` 
    together with a main size (width or height) of ``auto``.

- <length> or <percentage>

    For all other values, `flex-basis` is resolved the same way as for [width]
    and [height].  When omitted from the flex shorthand, its specified value is
    0. When omitted from the `flex` shorthand, its specified value is assumed
    to be 0.

When ``flex:none`` is encountered, the ``none`` keyword expands to be ``0 0 auto``.
Authors are encouraged to control flexibility using the `flex` shorthand rather
than with its longhand properties directly, as the shorthand correctly resets
any unspecified components to accommodate common uses.


# Aligning Flex Items In the Cross-Axis Dimension

There are several ways to achieve the effect of aligning flex items
in the cross-axis dimension. The first method
involves assigning ``auto`` to the appropriate margin of the item. 
For instance, when the main
axis is horizontal, then the word ``auto`` can be set to the `margin-top` and 
`margin-bottom`
property of a flex item to allow it to be adjusted in its vertical dimension.

Another method involves assigning an appropriate value to the `align-self` property 
of this item.

[ Aligning with auto margins. ] Auto margins refers to the process of 
setting one of the `margin` 
properties of a flex item to ``auto``. 
When set, a flex item would have effects
very similar to those one would have observed when the same item is under
a normal block flow. In particular,

- during calculations of flex bases and flexible lengths, auto margins are
  treated as 0;

- prior to alignment via `justify-content` and `align-self`, any positive free space
  is distributed to auto margins in that dimension;

- overflowing boxes ignore their auto margins and overflow in the end direction.

Note: If free space is distributed to auto margins, the alignment properties
will have no effect in that dimension because the margins would have already
absorbed all the free space. Thus from a the perspective of a container,
there had been no free spaces to be managed with.

@ figure{subfigure}
  &label{flex:example-3}
  The following example shows that by setting ``margin-left:auto``
  property of a flex item, 
  it would've absorbed all the free spaces to its left,
  creating a visual gap between itself and the item before it.

  ```verbatim{frame,subtitle}
  CSS
  ---
  nav > ul {
    display: flex;
  }
  nav > ul > #login {
    margin-left: auto;
  }
  ```
  ```verbatim{frame,subtitle}
  HTML
  ---
  <nav>
    <ul>
      <li>About</li>
      <li>Projects</li>
      <li>Interact</li>
      <li id="login">Login</li>
    </ul>
  </nav>
  ```
  \\
  ```diagram{frame,subtitle}
  Visual
  ---
  viewport 20 2
  config fillcolor orange
  config opacity 0.3
  box {w:4,h:2} "About"    (0,0)
  box {w:4,h:2} "Projects" (4,0)
  box {w:4,h:2} "Interact" (8,0)
  box {w:4,h:2} "Login"    (16,0)
  ```

[ The `align-self` property. ]
The property doesn't apply to block-level boxes, or to table cells. If a
flex item's cross-axis margin is set to ``auto``, then this property is ignored.

- ``auto``

  Computes to the parent's align-items value.

- ``normal``

  The effect of this keyword is dependent of the layout mode we are in:

  - in absolutely-positioned layouts, the keyword behaves like start on
    replaced absolutely-positioned boxes, and as stretch on all other
    absolutely-positioned boxes;

  - in static position of absolutely-positioned layouts, the keyword behaves as
    stretch;

  - for flex items, the keyword behaves as stretch;

  - for grid items, this keyword leads to a behavior similar to the one of
    stretch, except for boxes with an aspect ratio or an intrinsic sizes where
    it behaves like start;

  - the property doesn't apply to block-level boxes, and to table cells.

- ``self-start``

  Aligns the items to be flush with the edge of the alignment container
  corresponding to the item's start side in the cross axis.

- ``self-end``

  Aligns the items to be flush with the edge of the alignment container
  corresponding to the item's end side in the cross axis.

- ``flex-start``

  The cross-start margin edge of the flex item is flushed with the cross-start
  edge of the line.

- ``flex-end``

  The cross-end margin edge of the flex item is flushed with the cross-end edge
  of the line.

- ``center``

  The flex item's margin box is centered within the line on the cross-axis. If
  the cross-size of the item is larger than the flex container, it will
  overflow equally in both directions.

- ``baseline``, ``first-baseline``, ``last-baseline``

  Specifies participation in first- or last-baseline alignment: aligns the
  alignment baseline of the box’s first or last baseline set with the
  corresponding baseline in the shared first or last baseline set of all the
  boxes in its baseline-sharing group.  The fallback alignment for first
  baseline is start, the one for last baseline is end.

- ``stretch``

  If the combined size of the items along the cross axis is less than the size
  of the alignment container and the item is auto-sized, its size is increased
  equally (not proportionally), while still respecting the constraints imposed
  by max-height/max-width (or equivalent functionality), so that the combined
  size of all auto-sized items exactly fills the alignment container along the
  cross axis.

- ``safe``

  If the size of the item overflows the alignment container, the item is
  instead aligned as if the alignment mode were start.

- ``unsafe``

  Regardless of the relative sizes of the item and alignment container, the
  given alignment value is honored.

Figure &ref{flex:example-4} illustrates the difference in cross-axis alignment in overflow
situations between using auto margins and using the alignment properties.
All items on the left-hand side figure are centered using auto margins. All items
on the right-hand side figure are centered using align-self style. 

@ figure{subfigure}
  &label{flex:example-4}
  Items aligned using auto margins would have to be limited by the availability of
  left margin, and would not go overboard past the left margin boundary 
  had it already exhausted all left margin spaces.
  Instead, the contents overflow past the margin on the right hand side. 
  On the other hand, items aligned
  using align-self style are not limited by the availability of left margin and thus will always
  be centered regardless.
  
  ```diagram{frame,subtitle}
  Using auto margins.
  ---
  viewport 11 10
  draw {fillcolor:gray,opacity:0.3} &rectangle{(3,0),5,10}
  box {fillcolor:orange,opacity:0.3,w:3} "Blog" (4,1)
  box {fillcolor:orange,opacity:0.3,w:4} "About" (3.5,4)
  box {fillcolor:orange,opacity:0.3,w:8} "Hello World" (3,7)
  ```
  ```diagram{frame,subtitle}
  Using ``align-self:center`` property.
  ---
  viewport 11 10
  draw {fillcolor:gray,opacity:0.3} &rectangle{(3,0),5,10}
  box {fillcolor:orange,opacity:0.3,w:3} "Blog" (4,1)
  box {fillcolor:orange,opacity:0.3,w:4} "About" (3.5,4)
  box {fillcolor:orange,opacity:0.3,w:8} "Hello World" left:1.5 (3,7)
  ```

