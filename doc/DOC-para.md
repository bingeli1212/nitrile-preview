---
title: Paragraph
---

Paragraph can be described by a set of 
fence characters that are triple-tilde,
known as paragraph fences.

    ~~~
    Hello world.
    ~~~

It is also possible to have empty lines between
the set of opening and closing paragraph fences.   

However, in order for an opening paragraph fence
to be recognized, it must appear as the first line
of the paragraph. In addition, if the closing
paragraph fence is encountered, the paragraph is 
considered to be closed. 

By default, a fenced paragraph will be just like 
a plain-text paragraph. However, a paragraph
can be instructed to express other constructs, such
as tables, figures, lists, etc.

# The table paragraph

To express a table, attach the word "table" immediate
after the opening fence.

    ~~~table
    Names | Addr.        | Age
    ============================
    James | 102 Sun Str. | 29
    Jane  | 202 Rain Rd. | 21
    ~~~

It is possible to include additional options to the 
table-paragraph, which must appear within a set of 
braces immediately after the word "table".

    ~~~table{vline:|*|*|*|;hline:t b}
    Names | Addr.        | Age
    ============================
    James | 102 Sun Str. | 29
    Jane  | 202 Rain Rd. | 21
    ~~~

In the previous example, the options "vline" and "hline"
are included that are intended to provide additional
instructure to typeset a table-paragraph. 
The "vline" option instructs how to draw vertical rulers
for the table, and the "hline" for drawing horizontal
rules. Following are additional options for the
table-paragraph.

+ vline

  This option is to specify how to draw vertical rules
  for the table. The vertical bar character appearing
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
  table, and the 'b' letter the last line of the table. The 
  '+' letter describes that horizontal rules should be drawn
  between each two consecutive rows,
  not including the top and bottom. For instance, "hline:t b"
  would have instructed that the top and bottom horizontal
  rules should be drawn but now inter-row rules. "hline:+"
  instructs that the inter-row rules will be drawn but not
  the top and bottom rules.

+ n

  This letter sets the column count. 

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
  as the "title" of the table, where the "title" is
  simply a text string that occupies the entire row
  of the first row of the table, merging all table data
  of that row into one large table data. 

+ caption

  This caption, when set, is to instruct the table parsing
  routine to look for caption lines at the beginning of the 
  subsequent lines. The caption is assumed to have started
  at the first line and continue until a double-backslash
  is encountered as the sole content of a line, after which
  the normal table content is to start.

The content of the table is determined in two different ways. In
particular, the first line of the table-paragraph is scanned, and if
the first two characters is found to be a ampersand character (U+0026)
followed by a space, then each line is understood to be describing a
table data. The table data would start from the first table data in
the first row, and moves to the second table data of that row. It
would move to the beginning of the next row if it has reached the end
of the previous row. The table column count when this is the case is
always determined by the "n" option.

If the ampersand-and-space combination is not found, then each line of
the table-paragraph is understood to describe an entire table row. For
each line, if a vertical-bar character (U+007C) is found, then the
text between the vertical-bars becomes the table data. If the
vertical-bar is not found, then empty spaces are used to determine the
boundaries of the table data.

Following is an example of the same table but described differently.

    ~~~table{vline:|*|*|*|;hline:t b;n:3}
    & Names 
    & Addr.        
    & Age
    & James 
    & 102 Sun Str. 
    & 29
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

By default, the table is understood such that each table data is a
single line, and the width of each column is determined by the longest
width of the table data of that column. However, this could be changed
so that the table column could be manually adjusted. This is done by
the presence of the "fr" option. For example, the "fr:2 1 2" would
have described such that each column would have a relative width of 2,
1 and 2. Note that if the list is shorter than the total number of
actual columns present then the additional columns are each to assume
a fraction of 1.

Note that for a LATEX translation the presence of the "fr" option
automatically assume that the table data for each column is to treated
as a paragraph.

Following is an example where "caption" option is to be utilized. The
caption in this case is the text "First quarter sales of the year."

    ~~~table{caption}
    First quarter sales
    of the year.
    \\
    Month    | Sales
    ================
    January  | 100
    February | 200
    Match    | 300
    ~~~

The table paragraph on LATEX translation is always to generate
a begin-end-table environment. If the caption-style or label-style
option is present, then the table will be labeled; if the
caption-style option is present, the caption will be inserted.


# The equation paragraph

The equation paragraph allows for typesetting one or more equations
in the same block. 

    ~~~equation
    f_x(x) = \text{poisspdf} (x,50)
    
    \mathbf{y} = g(\mathbf{x})
    
    g(x) = 5x
    ~~~

In the previous example three equations are placed in the same
paragraph where one is shown below the other in that order. 
All the equations will be flushed so that their right-hand edges
align vertically.

For a single equation, it is possible for it to be split across 
multiple lines. 

    ~~~equation
    f_x(x) &= \text{poisspdf} (x,50)\\
           &= \text{f} (x,50)
    
    \mathbf{y} = g(\mathbf{x})
    
    g(x) = 5x
    ~~~

If a "label" option is provided, then this option will be
expected of a list of names each of which is assigned as
the label to one of the equations. In the following example
"mylabel1" is assigned to the first equation, "mylabel2" 
is assigned to the second, and "mylabel3" is assigned to
the third.

    ~~~equation{label:mylabel1 mylabel2 mylabel3}
    f_x(x) &= \text{poisspdf} (x,50)\\
           &= \text{f} (x,50)
    
    \mathbf{y} = g(\mathbf{x})
    
    g(x) = 5x
    ~~~

These labels could later on be used later on to refer
to one the above equations by doing something like 

    Please see equation &ref{mylabel1}.

If the list of name for the "label" option is shorter, then
the equations without the label will not be numbered. In the previous
example, if the second equation is not to be named, then the 
name "none" can be used.

    ~~~equation{label:mylabel1 none mylabel3}
    f_x(x) &= \text{poisspdf} (x,50)\\
           &= \text{f} (x,50)
    
    \mathbf{y} = g(\mathbf{x})
    
    g(x) = 5x
    ~~~

The equation paragraph on LATEX translation is always to generate
an "eqnarray" or "eqnarray*" environment. The second environment is
the default one, unless the label-style option is detected,
in which case the "eqnarray" environment is used, which is to 
setup for the numbering of each equations in this environment.
By default, the "eqnarray" environment is to number each equation
within this array, unless ``\notag`` is used.

# The figure paragraph

The figure paragraph on LATEX translation is always to generate
a begin-end-figure environment. If the caption-style or label-style
option is present, then the figure will be labeled; if the
caption-style option is present, the caption will be inserted.


# The multi paragraph

The "multi" paragraph is done by the presence of the
keyword "multi".
This paragraph is designed to showcase text and/or
pictures side by side.

    ~~~multi{n:2;head;skip:big;gap:0.1}
    & Sequence
    & Series

    & A list of numbers
    & A single number

    & Finite and infinite
    & Always infinite

    & No first term for some:  "..., -4, -2, 0, 2, 4, ..."
    & Always has first term
    ~~~

This paragraph is similar to "table"; however, it does not
attempt to create a "float" under LATEX translation. Instead,
it will create a "xtabular" under LATEX translation with the
intent to allow for long table contents to be broken into
multiple pages. 

In addition, it always treat each table data as paragraph. 
The total number of columns is set by the "n" option. The
relative width of the columns are set by the "fr" option, 
such as "fr:1 2 1", that would express that there are three
columns and the first and second column is only half the
size of the middle one. 

The "skip" option expresses that there should be
visible vertical distances inserted between two internal 
text rows.
The accepted values are "small", "med", and "big".
On LATEX, these values translate directly to ``\smallskip``, 
``\medskip``, and ``\bigskip``.

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




