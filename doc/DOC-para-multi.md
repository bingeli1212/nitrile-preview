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

This paragraph is similar to "table"; however, instead of being
a table where it will "float" and have a caption, the "multi"
paragraph can simply be viewed as a convenient way to
create multiply column layout, where each row is a list
of paragraphs placed side-by-side. The LATEX translation 
uses "longtabu" environment for this. This environment has
the capability to break the content into multiple pages. 

The number of side-by-side paragraph in each row
is controlled by the "n" option. By default only a single
paragraph appears in each row.

The relative width of the paragraph in each
row can be adjusted by the "fr" option, 
such as "fr:1 2", which expresses that 
the relative width of the first and second paragraph be 
set to one to two.
The third paragraph and beyond are all assumed
to be set to "1".

The "skip" option expresses that there should be
visible vertical distances inserted between two rows.
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

