---
title: PdfLatex Translation
---

# Background

Don Knuth had this chicken or egg problem: once you can typeset a source you
need fonts but you can only make fonts if you can use them in a typesetting
program. As a result TEX came with its own fonts and it has special ways to
deal with them. Given the limitations of that time TEX puts some limitations
on fonts and also expects them to have certain properties, something that is
most noticeable in math fonts.

Rather soon from the start it has been possible to use third party fonts in
TEX, for instance Type1. As TEX only needs some information about the shapes,
it was the backend that integrated the font resources in the final document.
One of its descendants, pdfTEX, had  this backend built in and could do some
more clever things with fonts in the typesetting process, like protrusion and
expansion. The integration of front- and backend made live much easier.
Another descendant, XƎTEX made it possible to move on to the often large
OpenType fonts. On the one hand this made live even more easy but at the other
end it introduced users to the characteristics of such fonts and making the
right choices, i.e. not fall in the trap of too fancy font usage.

Some 30 years ago Don Knuth wrote a book, and in the process invented the TEX
type- setting system, the graphical language METAFONT and a bunch of fonts. He
made it open and free of charge. He was well aware that the new ideas were
built on older ones that had evolved from common sense: how to keep track of
things on paper.



