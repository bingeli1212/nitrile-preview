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
image with surrounding texts. It can also be used to create a 
vector graphic using Diagram-syntax. 



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


# The tabular-fence

To express a tabular, attach the word "tabular" immediate
after the opening fence.

    ~~~tabular
    Names | Addr.        | Age
    ============================
    James | 102 Sun Str. | 29
    Jane  | 202 Rain Rd. | 21
    ~~~

It is possible to include additional options to the 
tabular-fence, which must appear within a set of 
braces immediately after the word "tabular".

The tabular can also be constructed with each describing
a single tabular row, and with a double-backslash 
by itself starting a new row. In this form, each tabular data
must start with an ampersand, followed by at least one space,
and then the text. The double-backslash by itself in a line
signals the end of the current row.

    ~~~tabular
    & Names 
    & Addr.        
    & Age
    \\
    & James 
    & 102 Sun Str. 
    & 29
    \\
    & Jane  
    & 202 Rain Rd. 
    & 21
    ~~~

It is also possible to specify horizontal rule 
using a triple-hyphen such as the following

    ~~~tabular
    & Names 
    & Addr.        
    & Age
    ---
    & James 
    & 102 Sun Str. 
    & 29
    \\
    & Jane  
    & 202 Rain Rd. 
    & 21
    ~~~

A double line can be expressed by the appearance
of triple equal-sign.

    ~~~tabular
    & Names 
    & Addr.        
    & Age
    ===
    & James 
    & 102 Sun Str. 
    & 29
    \\
    & Jane  
    & 202 Rain Rd. 
    & 21
    ~~~

A tabular-fence is similar to a tabular-phrase except that a tabular-phrase
is an inline-block that would be mixed with other text in the fence,
and can be used to construct two or more side-by-side tabulars. On the
other hand a tabular-fence is designed to be by itself, form a separate 
fence. For LATEX translation it is also to be translated into a float,
such as a begin-end-tabular environment with optional caption and label.

tabular border lines can be specified by the vline-style
and hline-style options.

    ~~~tabular{vline:|*|*|*|,hline:t b}
    Names | Addr.        | Age
    ============================
    James | 102 Sun Str. | 29
    Jane  | 202 Rain Rd. | 21
    ~~~

In the previous example, the options "vline" and "hline"
are included that are intended to provide additional
instructure to typeset a tabular-fence. 
The "vline" option instructs how to draw vertical rulers
for the tabular, and the "hline" for drawing horizontal
rules. Following are additional options for the
tabular-fence.

+ vline

  This option is to specify how to draw vertical rules
  for the tabular. The vertical bar character appearing
  beteeen the asterisks represent the need to draw vertical
  rules between the columns, each of which is denoted by
  a asterisk. Thus, "|**|" would have described two 
  vertical rules before and after the two starting columns.

+ hline

  This option is to specify where and when
  to draw horizontal rules
  between rows. This option expects a list of letters that
  are either 't', 'b', and '+'. The 't' letter describes
  that a horizontal rule should appear at the top of the 
  tabular, and the 'b' letter the last line of the tabular. The 
  '+' letter describes that horizontal rules should be drawn
  between each two consecutive rows,
  not including the top and bottom. For instance, "hline:t b"
  would have instructed that the top and bottom horizontal
  rules should be drawn but now inter-row rules. "hline:+"
  instructs that the inter-row rules will be drawn but not
  the top and bottom rules.

+ halign

  This option contains list of letters each of which
  describes the alignment of the column - 'l', 'c', 'r'.

+ fr

  This option contains a list of positive integers each
  of which describing the relative width of the column.

+ strut 

  This options contains an integer that describes the number
  of pt(s) for the height of each row. Setting this to an
  integer to allow for each row to have a fixed row height.
  For instance: "strut:20" would have instructed that each
  row has a height of 20pt.

+ title

  This option expects a string that would appear
  as the "title" of the tabular, where the "title" is
  simply a text string that occupies the entire row
  of the first row of the tabular, merging all tabular data
  of that row into one large tabular data. 

The content of the tabular is determined in two different ways. In
particular, the first line of the tabular-fence is scanned, and if
the first two characters is found to be a ampersand character (U+0026)
followed by a space, then each line is understood to be describing a
tabular data. The tabular data would start from the first tabular data in
the first row, and moves to the second tabular data of that row. It
would move to the beginning of the next row if it has reached the end
of the previous row. The tabular column count when this is the case is
always determined by the "n" option.

If the ampersand-and-space combination is not found, then each line of
the tabular-fence is understood to describe an entire tabular row. For
each line, if a vertical-bar character (U+007C) is found, then the
text between the vertical-bars becomes the tabular data. If the
vertical-bar is not found, then empty spaces are used to determine the
boundaries of the tabular data.

Following is an example of the same tabular but described differently.

    ~~~tabular{vline:|*|*|*|;hline:t b}
    & Names 
    & Addr.        
    & Age
    \\
    & James 
    & 102 Sun Str. 
    & 29
    \\
    & Jane  
    & 202 Rain Rd. 
    & 21
    ~~~

It is also possible to specify the alignment for each column, which is
one of the following three options - left aligned, center aligned, or
right aligned. This is described by the "halign" option, which expects
a string of one of the three letters - 'l', 'c', and 'r', separated
by spaces. For instance, "halign:l c c" would have described the fact
that the first three columns would each have an alignment of left,
center, and center alignment. If the actual column count is longer
than the number of letters found by this option, additional columns
are assumed to be described by the letter 'l'.

By default, the tabular is understood such that each tabular data is a
single line, and the width of each column is determined by the longest
width of the tabular data of that column. However, this could be changed
so that the tabular column could be manually adjusted. This is done by
the presence of the "fr" option. For example, the "fr:2 1 2" would
have described such that each column would have a relative width of 2,
1 and 2. Note that if the list is shorter than the total number of
actual columns present then the additional columns are each to assume
a fraction of 1.

Note that for a LATEX translation the presence of the "fr" option
automatically assume that the tabular data for each column is to treated
as a fence.

    ~~~tabular
    Month    | Sales
    ================
    January  | 100
    February | 200
    Match    | 300
    ~~~

The tabular fence on LATEX translation is always to generate
a begin-end-tabular environment. If the caption-style or label-style
option is present, then the tabular will be labeled; if the
caption-style option is present, the caption will be inserted.


