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
    title: Data-Driven Documents
    ---
    %^import [part]Basic Concept
    %^import [chapter]./d3-intro.md
    %^import [chapter]./d3-datajoin.md
    %^import [chapter]./d3-csv.md
    %^import [chapter]./d3-selection.md
    %^import [chapter]./d3-transformation.md
    %^import [chapter]./d3-color.md
    %^import [chapter]./d3-statistics.md
    %^import [part]Layout
    %^import [chapter]./d3-stack-layout.md
    %^import [chapter]./d3-pack-layout.md
    %^import [chapter]./d3-pie-layout.md
    %^import [chapter]./d3-histogram.md
    %^import [part]Data Generator
    %^import [chapter]./d3-arc-generator.md
    %^import [chapter]./d3-area-generator.md
    %^import [chapter]./d3-symbol-generator.md
    %^import [chapter]./d3-force.md
    %^import [chapter]./d3-collections.md
    %^import [chapter]./d3-geo.md
    %^import [chapter]./d3-geodata-paths.md
    %^import [chapter]./d3-scales.md
    %^import [chapter]./d3-hierarchy.md
    %^import [part]References
    %^import [chapter]./d3-quickreference.md

In the previous example, it has been stated that four "part" will be
inserted into the document, between which there are other documents
which will be considered as "chapter".

The importing process will simply "copy" each blocks of the source
documents and insert them at the end of the last block of the current
document. During the inserting, each block will gain an additional
member called "name", which is set to the text

This is to assume that an input file is detected, Otherwise, a new
HDGS block to created, where its hdgn-member is set to 0, and its
name-, title-, id-, and fname-member are inserted as additional
members of this block. For example, when importing for the first line,
a new HDGS block is created that its hdgn-member is set 0, its
name-member set to string "part", its title-member is set to the
string "Basic Concept", its fname-member set to undefined, and its
id-member set to undefined.

This kind of setup allows for an artificial chapter to be inserted that
does not involve an actual source file. For instance, the following setup
would have setup an artificial chapter with two existing source documents
acting as its two sections.

    ---
    title: Data-Driven Documents
    ---    
    %^import [chapter]Introduction
    %^import [section]./d3-intro.md
    %^import [section]./d3-datajoin.md
    %^import [chapter]Advanced
    %^import [section]./d3-selection.md
    %^import [section]./d3-transformation.md



