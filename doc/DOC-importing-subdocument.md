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
    import: ./sub1.md
            ./sub2.md
    ---

In the previous example, it has been stated that
two external MD files named "sub1.md" and "sub2.md" 
will need to be "imported" into the current document.

Note that in order for the name of the file to be 
recognized it must start with a dot or double-dot, such
as "./sub1.md", or "../sub1.md". The first syntax
specifies that the file should live in the same location
as the master document, and the second syntax specifies
that the source file lives in the parent direction
of the master document.

Additional styling options can be passed to each
sub document by adding the ``{...}`` after the file.
For example, 

    ---
    title: My document title.
    import: ./sub1.md {name:chapter}
            ./sub2.md {name:chapter}
    ---

Would each have attached the styling option "name:chapter"
to this file. This styling option is to be applied
to each every blocks of that are read in this subdocument.
This allows for the translator engine to selectively detect
which block would have had come from certain places.

Note that it is important not to specify a well know styling
option name such as label---as doing so will override all
subdocument's block such that its style option will
be assigned this value regardless of what's been specified
in the source document.

Note that the main parser, during the importing, would have
also to create a new synthetic HDGS/0 block that is to be inserted
to the end of the main blocks before all other blocks in the 
subdocument are inserted. This HDGS/0 block will have a signature 'HDGS'
and a heading number set to 0. The title of this HDGS block
is to come from the "title" part of its own FRNT block,
and the label from the "label" part of its own FRNT block.
If the subdocument
does not contain a FRNT block, the title will be set to string
"NO TITLE", and the label will be set to an empty string.

If the string does not start with a dot or double-dot,
then it is assumed to be normal string and the main parser will
not attemp to treat this name as a filename of a subdocument
and will not attemp to read the file from the disc.

    ---
    title: My document title.
    import: Introduction {part}
            ./sub1.md
            ./sub2.md
            Advanced {part}
            ./sub3.md
            ./sub4.md
    ---

The previous examples shows how to establish
two parts in LATEX where each part is to include
two chapters.

