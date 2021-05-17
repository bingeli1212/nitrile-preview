---
title: PDF Bookmarks
---

# PDF Headers and Custom Properties

In order to add Author, Title, Keywords, ... to PDF headers, use:

    \setupinteraction
      [state=start,
        title={...},
        author={...},
        subtitle={...},
        keyword={...}]

In order to add custom key-value properties in the PDF Document, use:

    \pdfbackendsetinfo{foo}{bar}

Following is an example:

    \setupinteraction
        [author={Author1 Author2}]


# Private Bookmarks

We can also place our own list of bookmarks:

    \setupinteraction
      [state=start]
    \setupinteractionscreen
      [option=bookmark]
    \definelist
      [mylist]
    \placebookmarks
      [chapter,mylist]
      [chapter,mylist]
    \starttext
        \startchapter[title={My title}]
            \input knuth\page   
            \bookmark[mylist]{Before input zapf}\input zapf
        \stopchapter
    \stoptext


# An Example

For the impatient (like me), here is a complete example showing typical and
useful commands, which are explained below:

    \setupinteraction[state=start] % don't forget this line!
    % make chapter, section bookmarks visible when opening document
    \placebookmarks[chapter,section,subsection][chapter,section]
    \setupinteractionscreen[option=bookmark]
    \starttext
    \startchapter[title=The beginning]
    Hi!
    \stopchapter
    \startchapter[title={A very, very\\long title}]
    Greetings!
    \startsection[title=Why so long]
    I don't know
    \startsubsection[title=Why not?]
    Good point.
    \stopsubsection
    \stopsection
    \stopchapter
    \startchapter[title=The never-ending story]
    Oh no.
    \stopchapter
    \startchapter[title=The never-ending story,
                        bookmark=Forever!]
    Oh no.
    \stopchapter
    \stoptext

You need to activate the interaction handling in order to see the bookmarks using \setupinteraction.

    \setupinteraction
      [state=start]

The bookmarks window is usually not visible by default. To have the bookmark window open automatically when the document is opened:

    \setupinteractionscreen
      [option=bookmark] 

Disclaimer: \setupinteraction works with Adobe Reader/Acrobat, but other PDF viewers behave differently. E.g. xpdf v3.01 always opens the bookmark window.

To get bookmarks for chapters, sections, and subsections, use:

    \placebookmarks[chapter,section,subsection]

In the bookmark window, only chapter bookmarks are visible by default. If chapter and section bookmarks should be visible:

    \placebookmarks
      [chapter,section,subsection]
      [chapter]

This will open the document with the bookmarks for chapters and sections visible (read as: and open up the chapter bookmarks)

The unnumbered headings (\title, \subject etc.) do not create bookmarks, even when listed in \placebookmarks.

In order to create the bookmarks, you need to add force=yes, for example like this:

    \placebookmarks
      [title, subject]
      [force=yes]

If you do not like seeing the structure numbering in the bookmarks, you can add number=no, like this:

    \placebookmarks
      [chapter,section]
      [chapter]
      [number=no]


# Use the bookmark option

A more general method, also usable for the above problem, is to use the bookmark
option to specify the bookmark text explicitly. For example:

    \setupinteraction[state=start]
    \placebookmarks[chapter]
    \setupinteractionscreen[option=bookmark]
    \starttext
    \startchapter[title=A very long chapter\\ about splines,
                        bookmark=Splines]
    hello
    \stopchapter
    \stoptext


# Link coloring

By default, the link text gets a green or red color, depending on whether the
link is to another page or to the same page. You can change the link colors with
the color (links to other pages) and contrastcolor (links to the same page)
properties. For example, to disable link coloring alltogether:

    \setupinteraction[state=start,color=,contrastcolor=]

# Clickable table of contents

To make table of contents items clickable, use the \setupcombinedlist command.

    \setupcombinedlist[content][interaction=all]

This makes the entire table of contents line clickable. It is possible to select
just one part (sectionnumber, pagenumber, text).

If links have a color, this will also make the table of contents get a different
text color. You can use the color property to change it back, e.g.:

    \setupcombinedlist[content][interaction=all,color=black]

Alternatively, you can use the textcolor property to change just the text
colour, and leave the section and page numbers colored.

# Default focus mode

By default, clicking an inter-document hyperlink will switch to "fit page" mode,
to override this:

    \setupinteraction[state=start,focus=standard]


    