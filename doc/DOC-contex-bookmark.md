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


# Clickable links

The \setupinteraction command configures all interaction in 
the resulting PDF document. Basic interaction (meaning clickable 
links for references) is enabled using

    \setupinteraction[state=start]

This makes all links generated with the \goto command 
(and indirectly the \in and \at commands) clickable. 
A page is dedicated to this system of References.


# The goto command

Example 1

    \setupinteraction[state=start]
    \reference[label:1]{Some text}    
    \page[yes] % Insert page break
    Link to \goto{some text}[label:1].

Link to an URL

    \goto{Wiki}[url(http://wiki.contextgarden.net)]
    \goto{Email}[url(mailto:spam@example.com)]

Link to a page

    \goto{Other page}[page(3)]

Open a file or program
    
    \goto{Start}[program(test.tex)]

By enclosing \goto’s destination in program(#1) you have some means of launching files or programs.

Of course, this is a security issue.

However, PDF readers seem to handle this inconsistently.

The following test.tex will attempt to open itself. Notice that per default PDF readers stay in the current working directory.

    \setupinteraction[state=start]
    \starttext
    \goto{A file}[program(test.tex)]\par                    % case 1: destination specified
    \goto{A command}[program(/usr/bin/kwrite test.tex)]\par % case 2: program and destination specified
    \stoptext

The command \at is used for referencing using a page number.

Example

    \setuppapersize[A5]
    \placeformula[eq:pythagoras]
    \startformula
    a^2 + b^2 = c^2
    \stopformula
    Pythagoras' theorem is shown on \at[eq:pythagoras]. \par
    Pythagoras' theorem is shown on \at{page}[eq:pythagoras]. \par
    Pythagoras' theorem is shown on \at{page}{~and page 2}[eq:pythagoras].
    
The command \title would provides the complete title of a 
referenced block of text (e.g. chapter's title). 
The title is in quotation marks by default, 
but these surrounding elements can be changed with the 
left and right options of \setupreferencing.

Example

    \starttext
    \chapter[myreference]{Chapter 1}
    See \about[myreference] for more information.
    \stoptext

The result would be:

    See "Chapter 1" for more information.
    
The command \in is used to generate a reference number for the referenced
object, (e.g. an equation, figure, section, enumerated item). 
This works only with numbered items! The curly-brace arguments 
contain prefix and suffix, the square brackets contain the label 
of the point/object/section to which you are referring.
After the prefix an automatic space is inserted in the output. 
If this is problematic, for instance because you want parentheses 
around a referenced number, see \definereferenceformat. 

That command allows you to define your own in-like commands.

Example

    \placeformula[eq:pythagoras]
    \startformula
      a^2+b^2=c^2
    \stopformula    
    See \in{Equation}{.}[eq:pythagoras] \par
    
This would have generated the following output:

    See Equation 1.
    
The \reference command is used to create some referenced text.    

Example

    \starttext
      See reference \in[myref 1] on \at{page}[myref 1]
      \section{Section one}
      \reference[myref 1]{MyRef1} This is the first reference.
    \stoptext






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


    