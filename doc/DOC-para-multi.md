---
title: The "multi" paragraph
---

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

