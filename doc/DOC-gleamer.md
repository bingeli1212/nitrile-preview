---
title: Implementing Gleamer
---


# Gleamer

The Gleamer is the CONTEX version of a Gleamer, utilizing commands available to
CONTEX to implement presentation slides that have similar appearances to LATEX
Beamer class.

# Setting Up The Paper Size

Setting up the paper size in CONTEX is done by the following set of commands.

    \setuppagenumbering[location={},style=]
    \definepapersize[BEAMER][width=128mm,height=96mm]
    \setuppapersize[BEAMER]
    \setuplayout[topspace=3mm,
             header=0mm,
             footer=0mm,
             height=90mm,
             width=108mm,
             backspace=10mm,
             leftmarginwidth=0mm, 
             rightmarginwidth=0mm, 
             leftmargindistance=0mm, 
             rightmargindistance=0mm]
    \setupindenting[no,medium]
    \setupwhitespace[small]

Here, the command "setuppagenumbering" must be used to turn off page number,
because without this command CONTEX by default would have generated page
numbering and place the page number centered inside the header. To turn the
page numbering off the command need to be specified and the "location=" option
need to set an empty string.

The page size defined by beamer is 128mm in width and 96mm in height. These
are the settings that are being set to be the "width=" and "height=" options
of the "definepapersize" command. The first argument of this command is a key
that would become the new name for this paper size settings. This is similar to
how "A4", "A5" are names for existing paper sizes. 

After the name "BEAMER" has been defined, it can be used to call the command
"setuppapersize", which expectes a single argument, or two. If two arguments
are given, the second argument acts as the paper being used by a printer, and
the first argument is the paper size for the document within that paper, and
mostly centered within the paper that is the second. This setup could be useful
to typeset a presentation such as 128mm-by-96mm in orientation, but would have
to be printed in a A4 paper instead.

The "setuplayout" command is used for setting the margins for each page. This
command is similar to the "geometry" package that are loaded for the purpose of
setting up the margins for each paper. Within this command, the "topspace="
option defines the blank space between the top of the page to the top edge of
the header, which has been set by the "header=" option so that it does not have
any height. Similarly, the "footer=" option is set to 0 to completely turn off
it. The content height itself is then set to "90mm", which is the space that
takes up from the bottom of the topspace. The bottom space does not have to be
set specifically as CONTEX automatically figure this out by the previous two.

For the left and right margins, the "backspace=" option seems to control the
total blanks before the main text. However, within in this "backspace" you can
also reserve some of it to be used for margined text.  A margined text is
defined as text placed inside this margin.  Since there is no need to have to
place texts inside the margin this area is to to be 0mm, which is done by
setting the "leftmarginwidth=" option. The "leftmargindistance=" is also set to
0mm because this defines the distance between the right edge the left margin to
the left edge of the main text.

Similarly, the "rightmarginwidth=" and "rightmargindistance=" are both set to
0mm.  To control the width of the text the "width=" option is set which
controls the total width of the main text. It is set to 108mm to express the
fact that there are 10mm of margins on both sides.

The "setupindenting" command is just to set it so that it asks CONTEX 
not to generate a first line text indent for each paragraph.

The "setupwhitespace" controls the vertical distances between to independent
paragraph. Since there are no first line indentation for each paragraph, it makes
sense to add some vertical spaces between two paragraphs to visually separate the two.
The arguments of this command can be "small", "medium" and "large".

Following two commands can be placed as the first two commands after the
"starttext" command inside a CONTEX document to asks the CONTEX to show the
various settings of the "setuplayout". The second command would also visually
draw the lines showing the boundaries of various areas, such as left/right
margin, and main text area.

    \starttext
    \showsetups
    \showlayout
    ...
    \stoptext



# Icons For the Title

The icons used for each title of of the slide is the Unicode character U+2756
BLACK DIAMOND MINUS WHITE X. It appears that the default font chosen for the
main text "Linuxlibertin" does not provide a glyph for it. However, the font
supplied by TexLive named "zapfdingbats" does, thus, the Unicode is inserted
into the text document and "switchtobodyfont" command is placed directly in
front of it to ask that it uses a different font other than the default font.

    \startsection[title={{\switchtobodyfont[zapfdingbats]❖} 
        Adding \math{{5}} and \math{{\sqrt {- 4}}}},
        reference={mysec1},
        bookmark={Adding &math{5} and &math{\sqrt{-4}}}]

One thing worth pointing out is that the "bookmark=" option of the
"startsection" command describes a string that would appear as the bookmark for
this section when this document has been made into a PDF file and the PDF file
is viewed by a PDF viewer.  The bookmark associated with this section is the
text inside the "table of contents" that is associated with this section.
However, PDF does not have any notion of a TEX command, thus, if a CONTEX
command such as "\math" has been present inside a title, the same command would
not have had any effect on the bookmark entry. In fact, PDF bookmarks should
only be made with plain Unicode characters.

The "reference=" option is similar to the "label" command inside a LATEX document,
which serves as a name that can be used to later refer to this section, whether
to show the section number or page number.

    Please see section \in[mysec1] for more information.







