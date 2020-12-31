---
title: The "tabbing" paragraph
---

The "tabbing" paragraph is produced by the "tabbing"
keyword as the first line after the fence.

    ~~~tabbing{n:2}
    One 
    Two 
    Three
    Four
    Five
    Six
    ~~~

When the n-style option is present, it assumes that
each line by itself representing a tabbed paragraph,
and that the tabbed paragraph should be split into multiple
columns. In this case, it decides the how many lines
will go into each column by dividing the total
number of lines by "n". If the result produces no remainder
then the quotient determines the total number of lines
for each column. If the result produces a remainder
then then the each column gets one extra count above
the quotient.

However, the first line starts with an ampersand, and then
a space, then the data will be parsed in such a way
that each line with a leading "& " will signal the start
of a new tabbed paragraph, and the next such entry will be
the next tabbed paragraph of the same row, up until the total
number of entries has been reached in a row which must be set by the
n-style option, in which case it will start a new row.
If the n-style option is not set, then
the table is assumed to be a single column table.

    ~~~multi{n:2}
    & Names
    & Address

    & John Smith
    & 101 Sunny Dr.

    & Jane Atom
    & 102 Sunny Dr.
    ~~~

The presence of an empty line will force the next "& " entry
to start a new row. If a line is found to have started with
the leading "& " pattern, then two thing will happen. If the
line is indented, then this line is considered the continuation
of a previous item entry. If the line is not indented, then it
is to start a complete new row and every row data will be filled
this text.

However, in the case where the starting ampersand "& " pattern
is not detected within the first line, 
the arrangement of the tabbed paragraphs in each row
is to be determined by the presence of the vertical-bar.

    ~~~tabbing
    One     | Four
    Two     | Five
    Three   | Six
    ~~~

If a vertical-bar wasn't detected, then the tabbed paragraphs
is to be determined by the presence of two or more consecutive
white spaces.

    ~~~tabbing
    One       Four
    Two       Five
    Three     Six
    ~~~

The "tabbing" paragraph recognises some style options.

The relative width of the paragraph in each
row can be adjusted by the "fr" option, 
such as "fr:1 2", which expresses that 
the relative width of the first and second paragraph be 
set to one to two.
The third paragraph and beyond are all assumed
to be set to "1".

The strut-style option is designed so that each
tabbed line become a tabbed paragraph such that
long lines will be wrapped around. This option
expects an integer that will be interpreted
as the number of "pt", which will become the 
height of each paragraph. This option is useful
if the tabbed line is too long to fit inside
the allocated space.

    ~~~tabbing{strut:30}
    One       Four
    Two       Five
    Three     Six
    ~~~

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

    ~~~tabbing{n:2;head;gap:0.1}
    & Names
    & Address

    & John Smith
    & 101 Sunny Dr.

    & Jane Atom
    & 102 Sunny Dr.
    ~~~