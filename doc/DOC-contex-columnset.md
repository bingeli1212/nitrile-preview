---
title: Using Column Sets
---

# Typesetting Figures

An alternative method of typesetting text into columns uses columnsets. 
This method offers more possibilities than simple columns, in particular in placing floats such as figures and in creating columnspans. 
See Columnsets manual or column sets source for many examples.
Most options in the manual (such as \placeexternalfigure) are described using the generic \placefloat. 
Additionally, \placelistoffigures creates a list of the figures used in the document.

If you don't need much more than the "normal" columns, but e.g. "lines" mode, try this:

    \setuppapersize[A4]
    \setupindenting[yes,medium]
    \starttext
    \definecolumnset[TwoColumns][n=2]
    \startcolumnset[TwoColumns]
    \input knuth \par
    \input knuth \par
    \input lorem \par
    \stopcolumnset
    \stoptext


For more details (layout grid features, spreads, different column widths etc.) please refer to the manual!