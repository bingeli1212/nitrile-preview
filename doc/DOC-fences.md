---
title: Fences
---

Fences are used to typeset some inline-block elements, such
as images, frames, etc. Following are recognized fences.

- math
- img
- link
- ref
- diagram
- animation
- framed
- tabular
- blockquote
- verbatim
- tabbing
- colorbutton
- parbox


If the name provided after the triple-backquote is not recognized
to be one of the names in the previous list, it is assumed to be
a verbatim-fence.


# The math-fence

The math-fence allows showing of multiline math equation
or expression that expands multiple lines

   ```math
   a = b + 1
   ```


# The img-fence

The img-fence is used to typeset an image.

    ```img[width:3cm]
    tree.png
    ```

The img-fence is designed to allow for showing an external
image with surrounding texts. It is typically a single
line within the fence, expressing the name of an image
file sitting in a directory where it can be referenced
through a URL. 

However, in cases where there might be multiple image files for the
same name but each with a different extension, then each image
file will be listed in its own line.

    ```img[width:3cm]
    tree.png
    tree.pdf
    ```

It is thus the responsibility of the translation backend to 
figure out which image file to choose.


# The diagram-fence

The diagram-fence is used to typeset a diagram that
is stored as a "note" or as in an external file.

    ```diagram[width:3cm]
    viewport 10 10
    draw (0,0)--(10,10)
    ```

# The animation-fence

The animation-fence is used to typeset one or more diagrams
each one showing a frame in an animation. 

    ```animation[width:3cm]
    ```

# The framed-fence

The "framed" fence would have setup a "framed" picture
showing the content of the block.

    ```framed
    The text inside this fenced
    area is to be shown with fixed
    width font. It is designed to 
    behave like a vector graph so that
    it will be shrinked or expanded
    to the fullest width of the fence.
    ```

    

# The tabular-fence

The tabular-fence is used to typset a tabular.

    ```tabular
    ```

# The blockquote-fence

The blockquote-fence is used to typeset a blockquote that is to hold a
fence of text.

    ```blockquote
    ```

# The verbatim-fence

The verbatim fence is done by placing
triple-backquotes before and after
the block. 

    ```verbatim
    This is the verbatim
    text that preserves line breaks,
    multiple white-spaces, and will by default
    show text as fixed-width font.
    ```


# The list-fence

The list-fence would treat each line as an item in a list.

   ```list
   1. Item 1
   2. Item 2
   ```

It would try to scan the first line to see if it follows a certain 
pattern for a list item. 
This could be a hyphen, a plus-sign, a asterisk,
or a greater-than-sign. 
Following is treated as a block of unordered list,
where each list item is shown with a text bullet.
The list type for this is "UL".

    ```list
    - Categorical (If A is in C then B is in C)
    - Disjunctive (If A is not true then B is true)
    - Hypothetical (If A is true then B is true)
    ```

Following is treated as a fence of ordered list,
where each item is shown with a number starting from
1 followed by a period. The list type for this list
is "OL".

    ```list
    * Categorical (If A is in C then B is in C)
    * Disjunctive (If A is not true then B is true)
    * Hypothetical (If A is true then B is true)
    ```

Following is treated as a fence of description list,
where the first line or the text before the first appearance
of a double-space is treated as the description term
and other text as description data. The list type for this
list is "DL".

    ```list
    + Categorical    If A is in C then B is in C
    + Disjunctive    If A is not true then B is true
    + Hypothetical   If A is true then B is true
    ```

For a list-fence, 
all items after the first must match the first item
in terms of the type. 
This means if the first item is the one started 
with a hyphen, then the second item must also 
start with a hyphen in order to be recognized
as such. 

Besides those that start with a symbol, there
are also three additional types: the one 
starting with a number, a letter a-z, or a letter
A-Z. Either of these choice must also end
with a period or a right-parenthesis. Each
of these lists will have a different type. The 
list that starts with a number is of type "1"; 
the list that starts with a lowercase letter is
of type "a", and the list that starts with an uppercase
is of type "A".

    ```list
    1. Categorical (If A is in C then B is in C)
    2. Disjunctive (If A is not true then B is true)
    3. Hypothetical (If A is true then B is true)
    ```

    ```list
    a. Categorical (If A is in C then B is in C)
    b. Disjunctive (If A is not true then B is true)
    c. Hypothetical (If A is true then B is true)
    ```

    ```list
    A. Categorical (If A is in C then B is in C)
    B. Disjunctive (If A is not true then B is true)
    C. Hypothetical (If A is true then B is true)
    ```

    ```list
    1) Categorical (If A is in C then B is in C)
    2) Disjunctive (If A is not true then B is true)
    3) Hypothetical (If A is true then B is true)
    ```

    ```list
    a) Categorical (If A is in C then B is in C)
    b) Disjunctive (If A is not true then B is true)
    c) Hypothetical (If A is true then B is true)
    ```

    ```list
    A) Categorical (If A is in C then B is in C)
    B) Disjunctive (If A is not true then B is true)
    C) Hypothetical (If A is true then B is true)
    ```

The period or right-parenthesis is going to be kept
and placed after the number or letter
for Latex.JS and Html.JS translation. 

If the first line does not fit one of the list types, 
then each line is treated as a list item, and the list
is constructed in such a way that there is no bullet. 
In the following example we will be creating a list
with two items, and both of which will be shown without
any bullet before it.

    ```list
    Hello world
    This is the end.
    ```

One of the latest additions is the checkbox style item,
where the first line starts with a open bracket, followed
by a single word character or space, and followed by a close bracket,
and a white space. When this pattern is detected, then each
item is considered to represent a checkbox placed in front of
each letter and the letter inside the bracket serves
as the indication that this checkbox is checked. The list
type for this list is "CB".

    ```list
    [ ] Item 1
    [ ] Item 2
    [x] Item 3
    ```

Also the radiobutton style is added. The radio button gives
the user the impression that only one of the choice is available;
choosing one will automatically discheck others. The list type
for this kind of list is "RB".

    ```list
    ( ) Item 1
    ( ) Item 2
    (x) Item 3
    ```

For a "UL" type list, 
a customized
bullet can also be setup to be used for each list item.
To do this, ensure that the bullet-style is set to a 
entity name such as 
``bullet:cross``, where "cross" is a valid entity name
for referring to a Ballot X character. In this case,
the normal text bullet would have been replaced by 
this character.

    ```list{bullet:cross}
    - Item 1
    - Item 2
    - Item 3
    ```

It is also possible to set the type directly by setting the
type-style to one of the following values: ``type:UL``, or
``type::OL``, ``type:DL``, ``type:1``, ``type:a``, ``type:A``, 
``type:CB``, or ``type:RB``. However, when you do this each list
item must appear as a normal text and not containing any of the 
previous mentioned symbols, such as plus-sign, minus-sign, asterisk, etc.

    ```list{type:OL}
    Item 1
    Item 2
    Item 3
    ```

    ```list{type:CB}
    Item 1
    Item 2
    Item 3
    ```

It is also possible to combine type-style and bullet-style
to set a custom bullet. 

    ```list{type:UL, bullet:&cross;}
    Item 1
    Item 2
    Item 3
    ```


# The tabbing-fence

The "tabbing" fence is produced by the "tabbing"
keyword as the first line after the fence.

    ```tabbing
    One 
    Two 
    Three
    Four
    Five
    Six
    ```

This will create a tabbing fence with a single column.
To create additional columns, add a blank line.

    ```tabbing
    One 
    Two 
    Three
    Four

    Five
    Six
    ```

Or a double-backslash by itself in a line.

    ```tabbing
    One 
    Two 
    Three
    Four
    \\
    Five
    Six
    ```

This would have created a tabbing fence with two columns,
where the first column being four lines and the second column
being two lines. The previous two method allows each column
to be built first. However, following method allows each
row to be built first.

    ```tabbing
    & Names
    & Address
    \\
    & John Smith
    & 101 Sunny Dr.
    \\
    & Jane Atom
    & 102 Sunny Dr.
    ```

The ampersand must appear at the first line occupying the first
character, and immediately be followed by a space. If this
is detected, then the entire fence is to be assumed that
each line that starts with the ampersand followed by a space
is to designate the start of a new tabbing cell, where the next
tabbing cell the cell of the same row. The next row is determined
by the presence of a double-backslash by itself in a line.

However, in the case where the starting ampersand "& " pattern
is not detected within the first line, and the first line is 
detected to have a vertical bar, then the entire fence is
deemed to be having a vertical bar separating each tabbing cell.

    ```tabbing
    One     | Four
    Two     | Five
    Three   | Six
    ```

And the first line is found to have a double-space between some words,
such as the following, then the entire fence is deemed to 
be formatted this way such that each line is to have one or additional
tabbing cells each separated by a double-or-more-spaces.

    ```tabbing
    One       Four
    Two       Five
    Three     Six
    ```

The "tabbing" fence recognises some style options.

The relative width of the fence in each
row can be adjusted by the "fr" option, 
such as "fr:1 2", which expresses that 
the relative width of the first and second fence be 
set to one to two.
The third fence and beyond are all assumed
to be set to "1".

The strut-style option is designed so that each
tabbed line become a tabbed fence such that
long lines will be wrapped around. This option
expects an integer that will be interpreted
as the number of "pt", which will become the 
height of each fence. This option is useful
if the tabbed line is too long to fit inside
the allocated space.

    ```tabbing{strut:30}
    One       Four
    Two       Five
    Three     Six
    ```

The "gap" option specifies the fractional of the total
width that would be reserved for inserting between
two internal columns. The value expected here is a 
number between 0 and 1. The default value is 0.02, which
expresses that a gap is to be set at 2 percent width
of the entire table width.

The "head" option specifies that the first row 
should be treated as the table header. On LATEX
translation the text will be shown with a font weight
of bold. On HTML translation the TH-element might've
been used instead of the TD-element.

    ```tabbing{n:2;head;gap:0.1}
    & Names
    & Address
    \\
    & John Smith
    & 101 Sunny Dr.
    \\
    & Jane Atom
    & 102 Sunny Dr.
    ```

