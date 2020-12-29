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

The importing process will simply "copy" each blocks
of the source documents and insert them at the end
of the master document, such that all blocks of the
sub document will be in the same order and will appear
after all existing blocks of the main document.

Note that in order for the name of the file to be 
recognized it must start with a dot or double-dot, such
as "./sub1.md", or "../sub1.md". The first syntax
specifies that the file should live in the same location
as that of the master document, and the second syntax specifies
that the source file lives in the parent direction
of the master document.

Additional styling options can be passed to each
sub document by adding the ``{...}`` after the file.
So far, the only recognized option is "hdgn", which 
will be set to either an integer, or string "part".

    ---
    title: My document title.
    import: Introduction {hdgn:0}
            ./sub1.md 
            The Next Phase {hdgn:0}
            ./sub2.md 
    ---

In this case, two chapter headings will be inserted into the 
final translated document, each with the title of "Introductin"
and "The Next Phase". The toplevel heading block in a child
document is HDGS/1, which will be treated as "sections".

For a report.js translation, the number of chapters, when
present, will result in a "report" document class being
set, rather than the default "article".

The "hdgn" option can also be used to create "parts". 
In this case, the "hdgn" should be set to "part". 

    ---
    title: My document title.
    import: My first part {hdgn:part}
            Introduction {hdgn:0}
            ./sub1.md 
            ./sub2.md 
            The Next Phase {hdgn:0}
            ./sub3.md
            ./sub4.md
            My second part {hdgn:part}
            The Third Phase {hdgn:0}
            ./sub5.md 
            ./sub6.md 
            The Third Phase {hdgn:0}
            ./sub7.md
            ./sub8.md
    ---

The previous examples shows how to establish
two parts in LATEX where each part is to include
two chapters.

If "hdgn" is specified for a subdocument,
such that its value is a positive integer,
then each HDGS block of that child document
is to be "shifted". For example,
specifying an "hdgn:1" will shift all heading blocks
of a child document by 1, such that a HDGS/1 block
will become HDGS/2, and HDGS/2 becomes HDGS/3, etc.
Note that so far there is no way for a HDGS/0 block to be
specified directly inside a document. As a convension,
HDGS/0 is understood to be a chapter heading,
HDGS/1 is for a section heading,
HDGS/2 is for a subsection heading,
and HDGS/3 is for a subsubsection heading.

If a "hdgn" is not specified, it is assumed to be "0".
This allows chapters to be created by default.
For instance, in the following example two chapter
headings are created to hold contents of each child document.

    ---
    title: My document title.
    import: Introduction 
            ./sub1.md 
            The Next Phase 
            ./sub2.md 
    ---

Note that the FRNT blocks of child documents are not imported. 
Additional styles specified will be passed to all blocks of 
child blocks and new synthetic HDGS heading blocks. This 
allows for a new heading block to have a label, for instance.

    ---
    title: My document title.
    import: Introduction {label:intro}
            ./sub1.md 
            The Next Phase {label:thenextphase}
            ./sub2.md 
    ---


