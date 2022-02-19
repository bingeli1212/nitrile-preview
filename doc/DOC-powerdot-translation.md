---
title: Powerdot translation
---

# The powerdot translation

The powerdot is a LATEX document class. When using this document class
it is to use the ``latex`` program, instead of ``pdflatex``. 

    $ latex myslide.md
    $ dvips myslide.dvi

The first command creates a DVI file. The second command turns the DVI file
into a PS file. On MacOSX the PS file can be opened by the PREVIEW program.


# Limitations

The limitations of a using powerdot is the following:

- The \begin{verbatim}\end{verbatim} cannot be used

- The PNG file cannot be included by \includegraphics{}, only EPS files.



