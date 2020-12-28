---
title: Importing Sub-documents
---

Typically a single MD file will be able to provide
all the information needed for a translated document. 
On LATEX, a single MD document is to usually to become
an document styled using the "article" class.

However, it is also common for people to write different
subjects in different MD file. In this case, having to
ask that all these contents be merged in a single MD file
beforing being translated into LATEX is not going to 
be a reasonble requirement. In this case, NITRILE 
allows contents in different MD documents to be "brought"
into the current "main" document. This process is
called "importing".

To ask that multiple MD documents needs to be imported
into the current main document, the typicall way
to list them in the Frontmatter section, using
the "import" keyword.

    ---
    title: My document title.
    import: sub1.md
            sub2.md
    ---

In the previous example, it has been stated that
two external MD files named "sub1.md" and "sub2.md" 
will need to be "imported" into the current document.

The importing process will be different for each 
target translation. For instance, for report.js importing,
each external document is to become a "chapter" by itself.

The files listed by the "import" keyword can also include
additional information. These additional information
is expressed by a list of options that follows the 
first line. For instance, the report.js translation 
supports LATEX "part" construct, which is to group
chapters into multiple sections. In this case, the file name
it encounters is to be considered as a string 
that represents the name of the part.

    ---
    title: My document title.
    import: Introduction {part}
            sub1.md
            sub2.md
            Advanced {part}
            sub3.md
            sub4.md
    ---

The previous examples shows how to establish
two parts in LATEX where each part is to include
two chapters.

