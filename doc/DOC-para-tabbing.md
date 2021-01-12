---
title: The "tabbing" paragraph
---

The "tabbing" paragraph is produced by the "tabbing"
keyword as the first line after the fence.

    ~~~tabbing
    One 
    Two 
    Three
    Four
    Five
    Six
    ~~~

This will create a tabbing paragraph with a single column.
To create additional columns, add a blank line.

    ~~~tabbing
    One 
    Two 
    Three
    Four

    Five
    Six
    ~~~

Or a double-backslash by itself in a line.

    ~~~tabbing
    One 
    Two 
    Three
    Four
    \\
    Five
    Six
    ~~~

This would have created a tabbing paragraph with two columns,
where the first column being four lines and the second column
being two lines. The previous two method allows each column
to be built first. However, following method allows each
row to be built first.

    ~~~tabbing
    & Names
    & Address
    \\
    & John Smith
    & 101 Sunny Dr.
    \\
    & Jane Atom
    & 102 Sunny Dr.
    ~~~

The ampersand must appear at the first line occupying the first
character, and immediately be followed by a space. If this
is detected, then the entire paragraph is to be assumed that
each line that starts with the ampersand followed by a space
is to designate the start of a new tabbing cell, where the next
tabbing cell the cell of the same row. The next row is determined
by the presence of a double-backslash by itself in a line.

However, in the case where the starting ampersand "& " pattern
is not detected within the first line, and the first line is 
detected to have a vertical bar, then the entire paragraph is
deemed to be having a vertical bar separating each tabbing cell.

    ~~~tabbing
    One     | Four
    Two     | Five
    Three   | Six
    ~~~

And the first line is found to have a double-space between some words,
such as the following, then the entire paragraph is deemed to 
be formatted this way such that each line is to have one or additional
tabbing cells each separated by a double-or-more-spaces.

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
    \\
    & John Smith
    & 101 Sunny Dr.
    \\
    & Jane Atom
    & 102 Sunny Dr.
    ~~~