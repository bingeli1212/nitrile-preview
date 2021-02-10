---
title: Phrases
---

Fences are used to typeset some inline-block elements, such
as images, frames, etc. Following are recognized fences.

- math
- img
- link
- ref
- diagram
- animation
- framed
- tabular
- blockquote
- verbatim

If the name provided after the triple-backquote is not recognized
to be one of the names in the previous list, it is assumed to be
a verbatim-phrase.


# The math-phrase

The math-phrase allows showing of multiline math equation
or expression that expands multiple lines

   ```math
   ```


# The link-phrase

The link phrase is used to typeset a link.

    &link([Yahoo!]http://www.yahoo.com) 


# The img-phrase

The img-phrase is used to typeset an image.

    &img([width:3cm]./tree.png)

The img-phrase is designed to allow for showing an external
image with surrounding texts. It can also be used to create a 
vector graphic using Diagram-syntax. 

If an external image is to be expressed, then the filename 
for this image is to be described by the phrase such as

    &img(./tree.png)

The image file itself must appear
inside a pair of quotation marks and must
start with a dot or dot-dot followed by one or more 
slashes to form a relative path to the given image file. 

By default, the image will be shown in its native size.
However, additional
arguments can be passed to express the width, or set it
so that it has a frame around it.
For instance, if the image is to be
typeset at 90% of the current paragraph width, then
it should've been specified as 

    &img([width:90%]./tree.png)

The "width:90%" expresses that it is 90 percent of the line width.
Instead of specifying the width in terms of the percentage of the 
current line, it also recognize the following
four units that are "pt", "mm", "cm", "in".

If the image file is too tall, the "height" option could be used
to limit the image to the given height. In this case the image will
shrink so that its height does not go over the specified height,
and the aspect ratio of the image is kept. The "height" option
can only accept the following four units: "pt, "mm", "cm", and "in".
It will not accept the unit with the percent sign like that
of the width. 

The "frame:1" can be specified to express that the image should
come with a framed border. For instance,

    &img([width:90%,frame:1]./tree.png)


# The ref-phrase

The ref-phrase is used to typeset an reference to another part of the
same document. 

    &ref(#mytable)

Labels in LaTeX are done using commands `\label{}`
and `@ref{}`. The first command is placed next to a chapter,
section, subsection, etc., to allow for a special name to be
attached to this particular chapter, section or subjection,
so that future references to this chapter, section, or subject
can be done by simply referring to it using this special
name. 

    \chapter{My Chapter}\label{mych}

When referring to this chapter, section, or subsection,
the second command is used.

    Please see @ref{mych}

With Nitrile, the first command is always generated with a chapter,
a section, subsection, or subsubsection. The special name is 
always in the form of <filename>:<block-no>. For example, given
the following source MD file:

    My Title

    # My Section

The LATEX output would have looked like this:

    \title{My Title}
    \maketitle
    \section{My Section}\label{myfile:2}

The first section "My Section" will have a label named "myfile:2".  Assime that
this MD file is saved as `myfile.md`. The "2" here is the second block because
the first block is "My Title". You can place a '.label' option in front of the
section.

    My Title

    .label sec1
    # My Section

After you have generated the LATEX file the output would have looked like this:

    \title{My Title}
    \maketitle
    \section{My Section}\label{myfile:sec1}

To reference to a section the source MD file would need to follow the syntax of
`[[#sec#]]` when referring to a label within the same MD document. Since
Nitrile follow a convention of using a colon to separate file name and the
label, you must avoid using colon in your label. This convention allows for
referring to a label in a different source MD file using a syntax such as
`[[#myfile2:sec5#]]`, where the source MD file is named "myfile2.md" and 
the label within that file is "sec5".

Nitrile will try to detect that when you specify a label such as
`[[#sec#]]` such that it does not have a colon in it, and it will fix this
by prefixing the filename of the source document so that it will actually
become `[[#myfile:sec#]]`.




# The diagram-phrase

The diagram-phrase is used to typeset a diagram that
is stored as a "note" or as in an external file.

    &diagram([width:3cm]./myfile.txt)
    &diagram([width:3cm]#mydia1)

The inline-diagram is presented as follows.

    ```diagram[width:3cm]
    ```

# The animation-phrase

The animation-phrase is used to typeset one or more diagrams
each one showing a frame in an animation. 

    ```animation[width:3cm]
    ```

# The framed-phrase

The "framed" phrase would have setup a "framed" picture
showing the content of the block.

    ```framed
    The text inside this fenced
    area is to be shown with fixed
    width font. It is designed to 
    behave like a vector graph so that
    it will be shrinked or expanded
    to the fullest width of the paragraph.
    ```

    

# The tabular-phrase

The tabular-phrase is used to typset a tabular.

    ```tabular
    ```

# The blockquote-phrase

The blockquote-phrase is used to typeset a blockquote that is to hold a
paragraph of text.

    ```blockquote
    ```

# The verbatim-phrase

The verbatim phrase is done by placing
triple-backquotes before and after
the block. 

    ```verbatim
    This is the verbatim
    text that preserves line breaks,
    multiple white-spaces, and will by default
    show text as fixed-width font.
    ```

For LATEX generation it would prefer to use a 
table that would be able to split across multiple
pages, but so far it is not possible to have it. 
While since it is a phrase, it makes sence to 
have it all in one paragraph, thus a "tabular" 
environment is used.

If a verbatim-like block is needed to have text longer 
than one page, consider using the SAMP block.

