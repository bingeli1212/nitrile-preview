---
title: The xelatex Translation
---

# The Xelatex Translation

Xelatex is a variant of LATEX. For each variant of LATEX most of the commands
will continue to work, except for a few specialized packages that are designed
for some specific variants of LATEX. For instance, the "beamer" class would
have been able to work with both pdflatex, xelatex, and lualatex. 

For this reason, the "xelatex" has been designed as a type of "prorgram", that
can be specified in addition to the the "translator" option.  For instance, to
generate a Beamer slides that is processed by xelatex, following front matter
settings can be used.

    ---
    title: My Slides
    translator: beamer
    program: xelatex
    ---

Similarly, if the same beamer document is to be processed by pdflatex, the 
the front matter settings should be designed as follows.
 
    ---
    title: My Slides
    translator: beamer
    program: pdflatex
    ---



# CJK Fontification

Note that due to the lack of a "unifont", where a font should have coverages
for all glyphs of a Uniocode range, the main chosen often lacks the glyphs used
to display CJK characters.  Thus, it is often the user's responsibility to have
to specify the font to be shown for a range of input characters. 

In NITRILE, this is taken care of by automatically detecting the presence of
CJK characters in the input MD file, and then automatically create translations
that include the right font switch command for a group of CJK charactesr.
For instance, if the input is the following:

   The Japanese text 日本人 means Japanese People.

When this text is being translated into a XeLaTeX document, it will look like
the following:

   The Japanese text {\jp{}日本人} means Japanese People.

The command "\jp" is called a font switch, in LATEX terms. It is designed so
that LATEX would have chosen a different font expressed by that command for all
characters up until the next ending braces.

The CJK fontification is going to happen automatically. If a CJK character is
detected in the source MD file, the translator would have inserted a font
switch in front of this character. If two or more characters appear which seems
to have been able to be described by the same font, then they are grouped
together.

Following is a list of such font switches:

    \jp  - For Japanese text
    \cn  - For Simplified Chinese character text
    \tw  - For Traditional Chinese character text
    \kr  - For Korean Chinese character text

# Defining CJK Font Switches

Note that the four CJK font switches for XELATEX are not defined by default.
They would need to be manually defined.

Currently these four font switches are not automatically defined because the
font in which each of these commands need to be defined with are system
specific.  Following are examples of how to defined these font switches by
placing settings in a Front Matter block by entering some commands. All the
commands must be for the "xelatex.post" key, which is designed to insert raw
XeLatex commands into the translated TEX file. These command will appear after
all other packages inclusion commands.

    ---
    program: xelatex
    xelatex.post: \newfontfamily{\jp}[Scale=0.85]{Osaka}
                  \newfontfamily{\cn}[Scale=0.85]{Yuanti SC}
                  \newfontfamily{\tw}[Scale=0.85]{Yuanti TC}
                  \newfontfamily{\kr}[Scale=0.85]{AppleGothic}
                  \XeTeXlinebreaklocale "th_TH"
                  \defaultfontfeatures{Mapping=tex-text}
                  \setromanfont[Mapping=tex-text]{Hoefler Text}
                  \setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Gill Sans}
                  \setmonofont[Scale=MatchLowercase]{Andale Mono}
    ---

# The "ruby" Command Anomalies

The "ruby" command seems to have an issue with the TexLive2021 release.
Especially, if two "ruby" commands are to appear inside a document right next
to each other without spaces, then the second word wold appear to be separated
from the first with some visible horizontal spaces.

    \ruby{日本}{にほん}\ruby{料理}{りょうり}

The temporary hack to make it not do that is to insert a "soft hyphen" or 0xAD
immediately before each "ruby" command, or before the backslash leading the
command.  This seems to allieviate the problem and the gap between the two
words no long appear.







