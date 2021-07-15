---
title: The xelatex Translation
---

# CJK Font Files

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

Note that the four CJK font switches for XELATEX are not defined by default.
They would need to be manually defined.

Currently these four font switches are not automatically defined because the
font in which each of these commands need to be defined with are system
specific.  Following are examples of how to defined these font switches by
placing settings in a Front Matter block by entering some commands. All the
commands must be for the "xelatex.post" key, which is designed to insert raw
XeLatex commands into the translated TEX file. These command will appear after
all other packages inclusion commands.

    \newfontfamily{\jp}[Scale=0.85]{Osaka}
    \newfontfamily{\cn}[Scale=0.85]{Yuanti SC}
    \newfontfamily{\tw}[Scale=0.85]{Yuanti TC}
    \newfontfamily{\kr}[Scale=0.85]{AppleGothic}
    \XeTeXlinebreaklocale "th_TH"
    \defaultfontfeatures{Mapping=tex-text}
    \setromanfont[Mapping=tex-text]{Hoefler Text}
    \setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Gill Sans}
    \setmonofont[Scale=MatchLowercase]{Andale Mono}

The \setromanfont command would have set the default font to be applied to all
texts within the document. The \setsansfont would set the font to be applied to
those texts that are marked as \textss.  Similarly, the \setmonofont would have
designated a font to be applied to those text that have been marked as \texttt. 

The \XeTeXlinebreaklocale command would designate a line breaking algorithm to
be applied. By setting it to "th_TH" it intends to setup a line breaking
algorithm such that CJK characters are to be broken at any location. By default
there are no white spaces inserted between two CJK characters. The traditional
line breaking algorithm would not break the line between two CJK characters if
there are not whitespaces. By calling this command with this setting, it allows
XeLaTeX to generate line breaks between two CJK characters even if there are no
white spaces between them.

The \newfontfamily command is designed to create a new font switch such as \jp to 
be used inside text enclosure to force the text to be shown by this font. 
An example is shown below.

    The Japanese text {\jp{}日本人} means Japanese People.

Typically, characters inside the text enclosure would likely be those 
that are supported by this particular font switch, and are typically
to appear as such, as most text editors these days are able to show 
unicode characters correctly, by switching automatically to the appropriate
font files as necessary.


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







