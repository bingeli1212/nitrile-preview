---
title: CONTEXT translation
---

# Issues

- Current version of CONTEX Y2020 seems to be broken for the "ruby" module.
  The `\ruby` command simply does not work and generate an compilation error.

- For \startcolumns command, it has been observed such that if the two column 
  is near the bottom of a page, and the image is in the second column, and then 
  image is too large to fit in the current page such that it is pushed down to
  the following page, then it overlaps with the text which is to follow
  the \endcolumns command.

- The \starttabulate does not have the capability to be placed side-by-side with
  another \startabulate. The documentation seems to suggest that this command is
  designed to typeset a tabulate that follows with the normal text, rather than
  act as a "float". The "indent=" attribution of this command can be set to "yes"
  such that it will have an indentation the same as the surrounding text, but
  it has not yet been verified.

- The \starttable is able to be placed side by side, but it will need to be 
  first placed inside a \hbox command, and then proceeded by a \dontleavehmode
  command. Note that the \dontleavehmode command will cause an extra blank vertical
  space if placed in front of some commands, thus its use has to be judicious.


# The Font size problem

  If 'bodyfontsizept' and 'diagfontsizept' are set to 
  different numbers, it has been observed that for '\sqrt{2}'
  the left-hand part of the radical symbol will be clipped.
  The problem disappear if both sizes are set to the same.


# The \bTABLE problem

The LONG table expressed by \bTABLE would  start 
in a new page even after a chapter title, when there are
not text before the table.


# The "longpadding" option

The "longpadding" option is designed to control the inner padding
for the \bTABLE. It can be set to an integer, inwhich case both
vertical and horizontal padding will be set to the same value. If 
set to two valuess, then the first one will be for the padding
top/bottom and the second one will be for the left/right padding.

# The "longvlines" option

This option controls the appearance of vertical lines for the 
LONG block. It is a list of integers. 0 is always the left-most
vertical line for the table. 1 is the vertical line to the right
of column one, 2 is the vertical line to the right of the column
two, and so on. The character asterisk instructs that all
vertical lines should appear.

# The "longhlines" option

This options controls the appearance of horizontal lines for the
\bTABLE used in LONG block. It is a list of following four letters:
t, m, b, and r. The "t" letter instructs that the top border
of the table should appear. The "m" letter instructs that the bottom
border of the header row should appear. The "b" letter instructs
that the bottom of the table should have a border. The "r" letter
instructs that borders between data rows should be drawn.

# Setting the relative font size

Font sizes can be set for the following contents:

  code: "fscode" 
  listing: "fslisting"
  tabular: "fstabular"

The first one is used the SAMP block when its style is not
set to 1 or 2. The second one is used for listing contents.
The third one is used for tabular entries, which includes all
contents of TABR, TABB, and LONG contents.  

These options must only be used to specify a "relative font size".
The only valid relative font sizes are the following:

      size            factor
      ----------------------------
      xxxsm           0.5
      xxsm            0.7
      xsm             0.8
      sm              0.9
      (empty)         1.0
      big             1.2
      xbig            1.4
      xxbig           1.7
      huge            2.0
      xhuge           2.3

For example:

  %!CONTEXT.fscode=xxsm
  %!CONTEXT.fslisting=xxsm
  %!CONTEXT.fstabular=sm  

Note that the relative font such as 'sm' is to be combined
with other switches that specifies the typeface such
as Sans Serif (\sssm), or Serif (\tfsm). This switch has
a lasting effect that stays on even after switches to a 
different font family. This could be beneficial if 
a different font family is to be chosen for a different
Unicode character or a collection of characters.

  {\tfsm Hello {\switchtobodyfont[jp]日本人}}




# Creating a CONTEXT document

When running 'nic' and the document is not a master document,
then no chapter is to be created, and only sections are.
In particular, each HDGS/1 block will become a "section"
of the CONTEXT document, and the HDGS/2 block is to become
a subsection. If there is a HDGS/0 block it will also be 
part of the generated TEX document, but it will not be 
a section. It is simply a paragraph with a bigger font (\tfd).

If the ALL.title is set, then a title page will also be generated,
with the title set to this, and ALL.author will be included
if it is also specified. If ALL.title is not set, then no title
page will be created.

For a master document that includes other child documents, each child
document is to become a chapter (if "h1" is used). If ALL.title
is set, then a title page will be created. The "h1", "h2" designation
is to express the "indent" level, for which "h1" will treate each HDGS/0
block of each child document as a chapter, HDGS/1 as section, 
HDGS/2 as subsection, and so on. The "h2" designation is to treat
the HDGS/0 of each child document as a section, HDGS/1 as a subsection,
HDGS/2 as a subsubsection, and so on. 

# The \mathscr command 

The \mathscr is not available on CONTEXT and thus is not supported
on NITRILE.

# Using libertine font

To use the Linux Libertine font, specify "linuxlibertineo" as the
font family name. 

  \setupbodyfont[linuxlibertineo]
  \setupbodyfont[linuxlibertineo,12pt]

There are other font family in there with 
similar names but not sure what they are about.

  $ mtxrun --script font --list --file -pattern=*libertine*

  familyname                weight     style    width    variant   fontname               filename               subfont   fontweight

  linuxlibertinedisplayo    normal     normal   normal   normal    linlibertinedisplayo   LinLibertine_DR.otf              conflict: book
  linuxlibertineinitialso   normal     normal   normal   normal    linlibertineio         LinLibertine_I.otf               conflict: book
  linuxlibertinemonoo       normal     normal   normal   normal    linlibertinemo         LinLibertine_M.otf               conflict: book
  linuxlibertinemonoo       bold       normal   normal   normal    linlibertinemob        LinLibertine_MB.otf
  linuxlibertinemonoo       bold       italic   normal   normal    linlibertinemobo       LinLibertine_MBO.otf
  linuxlibertinemonoo       normal     italic   normal   normal    linlibertinemoo        LinLibertine_MO.otf              conflict: book
  linuxlibertineo           normal     normal   normal   normal    linlibertineo          LinLibertine_R.otf               conflict: book
  linuxlibertineo           bold       normal   normal   normal    linlibertineob         LinLibertine_RB.otf
  linuxlibertineo           bold       italic   normal   normal    linlibertineobi        LinLibertine_RBI.otf
  linuxlibertineo           normal     italic   normal   normal    linlibertineoi         LinLibertine_RI.otf              conflict: book
  linuxlibertineo           semibold   normal   normal   normal    linlibertineoz         LinLibertine_RZ.otf
  linuxlibertineo           semibold   italic   normal   normal    linlibertineozi        LinLibertine_RZI.otf

# Cons

- Does not support \lstlisting, making code listing hard

- The \sfrac in CONTEXT does not place the numerator/denominator side-by-side,
  but instead laying them out top-to-bottom.

- The \ruby command seems to be broken for Texlive2020 release, it worked for
  Texlive2018

- For Texlive2020, if there is a part, each chapter will be numbered in such a
  way that the first integer is the part number, followed by a dot and then the
  chapter number. Each section    would be numbered in a form that is
  `part.chapter.section`.  However, the equations are still numbered as
  `chapter.section`.

- The text that is slanted (\sl) or italic (\it) within a paragraph sometimes
  shows skewed, especially when the text contains a parenthesis, such as `(?<!)`
  
- The only place to insert [+] or [eq:a] is to place it inside one
  of the items after \startmathalignment. Placing after the \startformula
  would trigger the equation numbering to be generated, and the numbering text 
  is seen vertically centered comparing to the formula---however, 
  the \in[eq:a] reference will not work in this case; all it shows is a ??.
  This is observed in Texlive2018. Not verified if this behavior is 
  the same for Texlive2020.

- For two-column-layout mode, there is not a default option to configure, it
  will have to be done manually, by placing   \startcolumns and \stopcolumns
  commands at the start and end of a chapter, or the content of a document if
  the current document is not a master document. For Texlive2020 it seems to be
  broken and will generate random errors with no obvious cause.

- When in twocolumn code, some of the lines are being compressed horizontally
  when CONTEXT determines it is just a little too long to fit in a line and it
  think it can just squeeze it in by shrinking all the spaces tighter.
  However, it has been observed that sometimes the parentheses are being drawn
  on top of other characters.

- There is not provision for a *wide* table, either for \starttabulate
  or for \bTABLE



# Remarks

- The name for the parser is 'CONTEXT'.

- The \latexdesc command allows font switch commands and other to be 
  included as part of the key, math can also appear in there as well.
  The LATEX version of \item[], can also include font switch commands
  and math mode texts (using \( and \))

- The caption appearance is more pleasing than those of LATEX, where it 
  is centered and does not take up the entire width of the page. In 
  addition, the "Figure 13.2" text is bold.

- If the math is something like ```\exp()``` the parentheses
  are sometimes observed to being placed on top of the string "exp",
  which is a flaw in the current layout system.

- I am not able to center a \starttabulate using \startalignment[center],
  regardless how hard I've tried, in spite of adding \dontleavehmode
  after \startalignment command, as was recommended by the 
  WIKI.CONTEXTGARDEN.


# Math formula

The math formula generation for CONTEXT is done 
as the following:

  $  C &= a + &b\\
       &= c + d

  $ A + B &= a + b

  $ A + B + C &= c + d

The output would have been as follows:

  \startformula
  \startmathalignment[n=2]
  \NC C \NC = a + b \NR
  \NC  \NC = c + d \NR[+]
  \stopmathalignment
  \stopformula
  \startformula
  \startmathalignment[n=2]
  \NC A + B + C \NC = c \NR
  \stopmathalignment
  \stopformula
  \startformula
    A + B = c
  \stopformula

The result is that for the first \startformula, there are
two lines on top of each other and these two lines will have
their equal-signs aligned. For the next two formulas they
are always arranged centered.

# Setting the gap between images

For PICT block, when multiple images are present in a row,
there must be some gap that needs to be reserved. The 
default setting for the gap between the images is a fixed
value (unknown), which causes the problem of not being able
to control the total width of the block so that it stay
within the width of the page.

The solution is to configure it so that the gap is set to
a fraction of the width of the page. Following is an example
of setting it to be 6% of the page width.

  \setupcombinations[distance=0.06\textwidth]

Following are examples copied from WIKI page of CONTEXT.
Suppressing both the horizontal and vertical gap between cells:

  \setupcombinations[distance=0mm,after=]

A 10mm horizontal and vertical gap between cells:

  \setupcombinations[distance=10mm,after={\blank[10mm]}]

The distance between the content and its caption entry is set
with the 'inbetween' parameter.

Current the distance is made a parameter in CONTEXT
that is CONTEXT.distance, it is set to a number that represents
the percentage of the page. For example '2' would mean two-percent
of the page width. The \setupcombinations command is then placed
at the preamble of each generated CONTEXT document that reflects
this setting.

# Paper size

The paper size is done by the \setpapersize command.
Following option sets the paper size.

  %!CONTEXT.papersize=A4

# Page layout

Layout of each page is done by the \setlayout command.

  \setlayout[backspace=30mm,
             cutspace=15mm,
             width=30mm]

Following options can be used to set this command.

  %!CONTEXT.layout+=backspace=30
  %!CONTEXT.layout+=cutspace=15mm
  %!CONTEXT.layout+=width=15mm

Note that the total distance of backspace, cutspace and width
should equal to the width of the page, which has been set to A4,
having a standard width of 210mm and height of 297mm. All the
numbers of these parameters must be specified in numbers, and are
assumed to be in mm.

The vertical spaces are controlled by the following parameters:

  \setlayout[topspace=20mm,
             header=10mm,
             footer=0mm,
             height=250mm]

# Two column layout

The two column layout for CONTEXT can be done. It involves using
the command \startcolumns[balance=no] and \stopcolumns. Without
additional setup, these two commands assumes a two column layout.
The "n=3" option can be added to force a three-column layout.
The "balance=no" option instructs that the left column can be
as long as needed if there isn't enough text and it is alright
that these two columns are not balanced---balanced means that
they each gets the same amount of text.

The things that are to be watched out is to decide where to 
start the two columns, such as if it is to be after the title
of the chapter or before, or is the title of the chapter part
of the two column or it should be allowed to expand the
entire page?

The current approach is that the two column layout is always
going to be started and stopped at the boundary where hdgn=0.
This translates to starting and stopping each new two column
layout block for each "source file".  

If the main document is a "standalone" document then the entire
document is placed under one two-column-layout division. If the
main document is a "master" document with child source files then
each child source file is to start and stop a new
two-column-layout division themselvs.  The starting and stopping
of a new two-column-layout will likely land in a new page for 
the start of a new two-column-layout.

The "\column" command can be used to force the rest of the content
to go to the next column.


# The \defineparagraphs command

This command allows to configure a block of paragraphs so that
it appears as multiple columns. 

  \defineparagraphs[sidebyside][n=2]
  \startsidebyside
  Hello world left.
  \sidebyside
  Hello world right.
  \stopsidebyside

In this case, the word "Hello world left" will appear in its own
column which is on the left hand side, while the word "Hello
world right" will appear in its own column and it is on the right
hand side of the first column. 

Note that to use a CONTEXT "paragraph" this is the only way,
which is to have to define a new paragraph with a new name.
Another limitation is that all the texts of this paragraph is
always to be kept together---this means if the text is long
they will not be split into multiple columns, in a two column
layout mode, or spilled into the next page. 

# One-column float for two column layout

The \placefloat command does not have an option to allow for a
one-column float. 

The only way of similating it is to use the
\startpostponing..\page..\stoppostponing command. 

  \startpostponing
  ...
  \page
  \stoppostponing

It automatically switches to expand the float to cover both
columns if the width of the float is *wider* than the width
of the single column it is in.

However, the problem is that there is no obvious way to 
set \bTABLE *wider*---this width of this table is determined
by the internal algorithm to be the same as the width of the 
\textwidth. 

However, so far the only way to trick it is to hardcode the
column width to be the same and being the fraction of the
\makeupwidth, which seems to be always set to the width of the
entire page, rather than \textwidth, which will be shrunk to be
the width of only a single column.

Similarly, the \starttabulate also suffers the same problem.
The width of the table is now allowed to go over the width
of \textwidth.

# Break line inside \bTABLE

Inside \bTABLE, the text within a cell can be broken into
multiple lines by insert a double-backslash in the middle
of a line. However, the \starttabulate environment does not
allow for such a construction.


# The \bTABLE for LONG table

For the LONG block, it sometimes can be observed that 
if the text is too long to fit inside the cell it will
protrude into the next cell to its right hand side.



# Sections and chapters

CONTEXT automatically chooses sections as the toplevel
sectional headings when no \startchapter is detectd.

  
# Generating customized part page

Set the `CONTEXT.partpage` option to 1, and then 
set the `CONTEXT.part` using segmented entry 
syntax, where each entry to appear in its own line.

  %^CONTEXT.partpage=1
  %^CONTEXT.part+=\dontleavehmode
  %^CONTEXT.part+=\blank[50mm]
  %^CONTEXT.part+=\startalignment[flushleft]
  %^CONTEXT.part+={\bfb Part ${1}}
  %^CONTEXT.part+=\stopalignment
  %^CONTEXT.part+=\blank[8mm]
  %^CONTEXT.part+=\startalignment[flushleft]
  %^CONTEXT.part+={\bfd ${text}}
  %^CONTEXT.part+=\stopalignment
  %^CONTEXT.part+=\page

Use `${text}` for a placehold for the title of 
of the part, and `${1}` for the numbering 
of the part. Replace "1" with one of the following
letter or digit for a different 
numbering style. For example `${a}` would have
been for lowercase letters such that 'a' will be
shown for the first part, and 'b' for the 
second part, etc.

- a for lowercase letters
- A for uppercase letters
- i for lowercase Roman numerals
- I for uppercase Roman numerals
- 1 for numbers (default)

For now, only the first 26 parts are supported.


# Centering of a "tabulate"

Following are ways to center a "tabulate".
It involves calling \placetable with a "force" flag so that
the table is turned into a "float" but is "forced" into 
being placed at the current location instead of having an
option to be moved around. 

    \placetable[force,none]{}{%
    \starttabulate[|l|l|]
    \HL
    \NC First \NC Second \NR
    \NC number \NC number \NR
    \HL
    \NC 1 \NC 2 \NR
    \NC 2 \NC 4 \NR
    \NC 3 \NC 6 \NR
    \NC 4 \NC 8 \NR
    \NC 5 \NC 10 \NR
    \NC 5.5 \NC 11 \NR
    \NC 6 \NC 12 \NR
    \HL
    \stoptabulate
    }


# The headers for "tabulate"

Tabulate supports header rows that can be repeated over new table pages instead
of the title. There is a separate environment \starttabulatehead where this
header row has to be specified in advance of its use in a tabulation.

In ConTeXt MkIV the command requires an additional [], thus you need to write
\starttabulatehead[] instead.


    \setuptabulate[split=yes,header=repeat]

    \starttabulatehead
      \FL
      \NC {\bf format char} \NC {\bf meaning} \NC \AR
      \LL
    \stoptabulatehead

    \starttabulate[|r|l|]
        \NC c \NC centered      \NC \AR
        \NC l \NC left aligned  \NC \AR
        \NC r \NC right aligned \NC \AR
    \stoptabulate

# Shaded colors

  \startMPcode
  numeric u; u := 5mm;
  numeric pu; pu := u;
  numeric fr; fr := 1;
  numeric textwidth; textwidth := \the\textwidth;
  numeric textheight; textheight := \the\textwidth;
  numeric ratio_w; ratio_w := 1;
  numeric ratio_h; ratio_h := 1;
  for i=0 upto 10: draw (0,i*u) --- (16*u,i*u) withcolor .9white; endfor;
  for i=0 upto 16: draw (i*u,0) --- (i*u,10*u) withcolor .9white; endfor;
  % <-- viewport 16 10 -->
  % <-- width: 16 height: 10 -->
  % <-- % cube -->
  % <-- path cube = (0,0) [h:2] [v:2] [h:-2] cycle -->
  % <-- saved cube=(0.00,0.00) (2.00,0.00) (2.00,2.00) (0.00,2.00) cycle -->
  % <-- draw.cube {fillcolor:#666;angle:80} (12,2) -->
  fill ((12.00,2.00)--(14.00,2.00)--(14.00,4.00)--(12.00,4.00)--cycle) scaled(u) withshademethod "linear" withshadevector (1,0) withshadecolors ((0.40,0.40,0.40),(1,1,1),(0.80,0.80,0.80));
  linecap:=butt;linejoin:=mitered; draw ((12.00,2.00)--(14.00,2.00)--(14.00,4.00)--(12.00,4.00)--cycle) scaled(u) ;
  \stopMPcode{}

# Symbols

You can override the existing symbols used at different levels in itemized
lists by redefining the existing symbol numbers, with code like the following:

    \usesymbols[mvs]
    \definesymbol[1][{\symbol[martinvogel 2][PointingHand]}]
    \definesymbol[2][{\symbol[martinvogel 2][CheckedBox]}]
    \startitemize[packed]
    \item item \item item
     \startitemize[packed]
     \item item \item item
     \stopitemize
    \item item
    \stopitemize

Following is the file that contains the PointingHand symbol:

    symb-imp-mvs.mkiv:    \definesymbol [PointingHand]       [\MartinVogelSymbol{PointingHand}]

It is located at:

    /usr/local/texlive/2020/texmf-dist/tex/context/base/mkiv

The symbol can be used directly inside a CONTEX-TEX document such as:

    The symbol is \symbol[martinvogel 2][PointingHand]   


# Special Unicode Characters

There are some predefined names for some Uniocode characters. They are defined
in file 'char-def.lua', listed under the key 'contextname', such as
'\oneeighth', '\threeeighths', '\textcurrency', etc. They should appear inside
a CONTEX-TEX file directly with the backslash and should be translated into the
corresponding Unicode character. However, in reality their appearance also
depends on the availability of that glyph being provided by the font. 

Following is a snippet from the file 'char-def.lua' that defines the
'contextname' of 'threeeighths'.

    [0x215C]={
     adobename="threeeighths",
     category="no",
     cjkwd="a",
     contextname="threeeighths",
     description="VULGAR FRACTION THREE EIGHTHS",
     direction="on",
     linebreak="al",
     specials={ "fraction", 0x33, 0x2044, 0x38 },
     unicodeslot=0x215C,
    },

# Tabulars

Following is an example of creating something similar to a 'tabular'
for a LATEX document.

    \starttable[|l|l|]
    \HL
    \VL \tex{NC}  \VL next column     \VL\MR
    \HL
    \VL \tex{HL}  \VL horizontal line \VL\MR
    \HL
    \VL \tex{VL}  \VL vertical line   \VL\MR
    \HL
    \stoptable

In contrast to LATEX, the column specifier 'l', 'r', and 'c' must be separated
by a vertical-rule, which is mandatory. The vertical-rule itself does not 
mean that a vertical line is going to appear between that column. Rather
a vertical-rule is added by placing \VL between each two data cells or before
the first data cell or after the last data cell.

In addition, the 'p(4cm)' can be used to express that a column is a 
paragraph column of '4cm' width--this is to replace the 'l', 'r', 
or 'c'.

    \starttable[|l|p(4cm)|]
    \HL
    \VL \tex{NC}  \VL next column     \VL\MR
    \HL
    \VL \tex{HL}  \VL horizontal line \VL\MR
    \HL
    \VL \tex{VL}  \VL vertical line   \VL\MR
    \HL
    \stoptable

Note that if we were to generate two side-by-side tabular then we need to do two things:
the first is to start the paragraph with '\dontleavehmode' command, and the second
is to place each 'table' inside a '\hbox' command, such as the following:

    \dontleavehmode
    \hbox{\starttable[|l|p(4cm)|]
    \HL
    \VL \tex{NC}  \VL next column     \VL\MR
    \HL
    \VL \tex{HL}  \VL horizontal line \VL\MR
    \HL
    \VL \tex{VL}  \VL vertical line   \VL\MR
    \HL
    \stoptable} \hbox{\starttable[|l|p(4cm)|]
    \HL
    \VL \tex{NC}  \VL next column     \VL\MR
    \HL
    \VL \tex{HL}  \VL horizontal line \VL\MR
    \HL
    \VL \tex{VL}  \VL vertical line   \VL\MR
    \HL
    \stoptable} 

Following is what's been called "format keys":

    Key	      Meaning
    |	        column separator
    c	        center
    l	        flush left
    r	        flush right
    s<n>	    set intercolumn space at value n = 0; 1; 2
    w<>	      set minimum column width at specified value

Following are what's called "command" within the table:

- \AR	next row	make row with automatic vertical space adjustment
- \NR	next row	make row with no vertical space adjustment
- \FR	first row	make row, adjust upper spacing
- \LR	last row	make row, adjust lower spacing
- \MR	mid row	make row, adjust upper and lower spacing
- \SR	separate row	make row, adjust upper and lower spacing
- \VL	vertical line	draw a vertical line, go to next column
- \NC	next column	go to next column
- \HL	horizontal line	draw a horizontal
- \DL	division line?	draw a division line over the next column
- \DL[n]	division line?	draw a division line over n columns
- \DC	division column?	draw a space over the next column
- \DR	division row?	make row, adjust upper and lower spacing
- \LOW{text}	—	lower text
- ? \DL, \DC and \DR are used in combination.
- \TWO, \THREE etc.	—	use the space of the next two, three columns

If a table is to be turned into a "float", then the \placetable
command can be used.

The first command \placetable has the same function as \placefigure.
It takes care of spacing before and after the table and numbering.
Furthermore the floating mechanism is initialized so the table will be
placed at the most optimal location of the page.


    \placetable[here][tab:ships]{Ships that moored at Hasselt.}
    \starttable[|c|c|]
    \HL
    \NC \bf Year \NC \bf Number of ships \NC\SR
    \HL
    \NC 1645 \NC 450 \NC\FR
    \NC 1671 \NC 480 \NC\MR
    \NC 1676 \NC 500 \NC\MR
    \NC 1695 \NC 930 \NC\LR
    \HL
    \stoptable
    ...
    ...
    See \in{Table}[tab:ships] on \at{page}[tab:ships] 

Following are copied from CONTEX-WIKI:

- You get vertical lines (rules), if you use \VL instead of \NC.
- Better use \SR, \FR, \MR, \LR instead of \NR.
- You can also use \AR instead of \SR, \FR, \MR and \LR (AR for automatic row).
- You can leave out the \NC before the "row" command, but not if you use \AR in
  a last or single row (see example).
- You can influence the table with \setuptables.

Following are additional format keys:

+ `a{tokens}` 

  Adds tokens after the column content

+ `b{tokens}`

  Adds tokens before the column content

+ `\{`

  Enclose the column in braces {grouping}

+ `*{n}{keys}`

  Equivalent to repeating the formatting
  keys 'keys' n times.

+ `\LeftGlue`

  Specifies the left glue to be used before
  the column.

+ `\RightGlue`

  Specifies the right glue to be used after
  the column.

+ `l`

  left-aligned column

+ `r`

  right-aligned column

+ `c`

  center-aligned column

+ `p(width)`

  Set each cell as a paragraph

+ `s(width)`

  Specify inter-column width    

+ `w`

  Set minimum column width      

+ `k`

  Insert a kern both left and right of the column

+ `i`

  Add a kern to the left of the column             

+ `j`

  Add a kern to the right of the column             

+ `n`

  Numeric item not in math mode                     

+ `N`

  Numeric item in math mode                         

+ `m`

  Each cell is in (inline) math mode. Equivalent to `b$ a$`

+ `M`

  Each cell is in (display) math mode. Equivalent to `\{b$\displaystyle}a$}`

+ `\m`

  Equivalent to `l b{{}}m`

+ `\M`

  Equivalent to `l b{{}}M`

+ `f\command`

  Set font according to the command

+ `B`

  Bold font. Equivalent to `f\bf`

+ `I`

  Italic font. Equivalent to `f\it`

+ `S`

  Slanted font. Equivalent to `f\sl`

+ `R`

  Roman font. Equivalent to `f\rm`

+ `T`

  Teletype font. Equivalent to `f\tt`

+ `C`

  Color. Use it in combination with `\{` (e.g. `\{C{red} )

+ `s`

  Set the tabskip to the right of this column and of all
  following columns up to the next `s` or `o` key.

+ `o`

  Set the tabskip to the right of this column only.

Following are some examples of using format keys to specify columns

+ `|l|`

  a left-aligned column, as wide as necessary.

+ `|lw(2cm)|`

  a left-aligned column of at least 2 cm width

+ `|p(2cm)|`

  a center-aligned paragraph of 2cm in width           

+ `|lp(0.5\textwidth)|`

  a left-aligned paragraph of the specified width

+ `|cp(0.5\textwidth)|`

  a center-aligned paragraph of the specified width

+ `|xp(0.5\textwidth)|`

  a justified-aligned paragraph of the specified width

[ Column Spans. ] It's possible to create columnspans. The `\use` command
can be use for this purpose. The `\ReFormat` command can be used after
to change how the merged columns cell is to be reformated.

    \starttable[s(0pt)|ls(10pt)|rs(0pt)|]
    \HL
    \NC \use{2}\ReFormat[cB]{Spanning head} \SR
    \HL
    \NC \Use{2}[cB]{Spanning head} \SR % slightly shorted
    \HL
    \NC left text	\VL right column text         \NC \AR
    \NC new row     \VL new row                   \NC \AR
    \NC left text	\VL \ReFormat[l]{reformatted} \NC \AR
    \HL
    \NC \use{2}Spanning entry \SR 
    \HL
    \stoptable

[ Table as Floating Object. ] Following is an example of using 
`\placetable` command to generate a "float" table.

    \placetable[here][tab:sample]{sample table}{
    \starttable ...
    \stoptable
    }

If you do not want a caption for your table, to get rid of it altogether you
have to add "none" to settings and then leave the braces empty; if you only
leave the braces empty, your table will still be numbered ("Table 1" etc.).

    \placetable[here,none][tab:sample]{}{
    \starttable ...
    \stoptable
    }

[ Simulating a blockquote. ]
To simulate a blockquote, where a specific paragraph has non-zero
left/right margins, we can use the "narrower" command.

    \startnarrower[3*left,2*right]
    \dontleavehmode
    \hbox{\starttable[|l|p(4cm)|]
    \HL
    \VL First One In an Hour \VL Second One In an Hour \VL\MR
    \HL
    \VL Hello \VL World \VL\MR
    \HL
    \stoptable}
    \stopnarrower

Ensure that '\dontleavehmode' is specified and each "table" is placed inside a
"\hbox" command, otherwise the table does not respect the margin and will
always be flushed against the left-hand side of the page.

# Spaces

    \starttext %\hsize\zeropoint
    \startlines
    a\enskip             b
    a\quad               b
    a\qquad              b
    a\twoperemspace      b
    a\threeperemspace    b
    a\fourperemspace     b
    a\sixperemspace      b
    a\figurespace        b
    a\punctuationspace   b
    a\breakablethinspace b
    a\hairspace          b
    a\zerowidthspace     b
    \stoplines
    \stoptext


# Unicode Math Symbols

[ Unicode Math symbols. ]
CONTEXT has some support for math symbols in Unicode.
For example, it does not provide support for \coloneq
symbol but we can type a Unicode character U+2254 directly
inside the math formular and it will work.

    \( A ≔ B \)

When it is translated into a CONTEXT document it becomes

    \math{A ≔ B}

And it just works.

Following is a partial list of common LATEX symbols that
cannot be found on the CONTEXT side such that it must be
typeset by a Unicode character.

- \coloneq 
- \ctdot

Another interesting fact about CONTEXT is that for the following 
\startpart command which has a "bookmark" entry expected to be
filled in with a string that is to appear as a PDF bookmark,
the value for the "bookmark" field can also contain a \math command
such as the following.

  \startpart[title={A \math{≔} B},reference={},bookmark={A \math{≔} B}]
  
Context will ensure to convert the symbol into a Uniocode string in which
case it will appear as the PDF bookmark correctly. However, for 
slightly more complicated math expression such as the following
it stops working.

  \startpart[title={A \math{≔} B},reference={},bookmark={A \math{\sqrt{2} ≔} B}]

# Subscript

In ConTeXt, you can write the following to generate a subscript text.

    like\low{this}

# Superscript

In CONTEX, the superscript is typeset by a '\high' command.

    like\high{this}

# Multi-line text

The 'textext' command in MetaPost can be used to generate a picture of
the text, which can then be saved to a picture variable. After that
we can "draw" the picture to a specific location using the "draw" 
command followed by a "shifted" modified, in which case the picture
will be centered at that location. The "bbheight" and "bbwidth"
are two functions that can be called on a picture to query its
height and width, which allows us to precisely figure where to
shift. The MetaPost syntax even allows for a position to be 
calculated such as to add a 2pt additional movement to the shift.

In the following example a double-line text "Hello\\World" is being sent to
location (5,5), where "Hello" is positioned so that it is centered
horizontally, and vertically positioned just above that point. The word "World"
is positioned above "Hello" with a 2pt separation between the bottom of the
word "World" and the top of the word "Hello".

    picture pic[];
    pic[1] := textext("\switchtobodyfont[12pt]Hello");
    pic[2] := textext("\switchtobodyfont[12pt]World");
    draw pic[1] shifted (0,0.5*bbheight(pic[1])) shifted (5*u,5*u);
    draw pic[2] shifted (0,1.5*bbheight(pic[2])+2pt) shifted (5*u,5*u);

# Simulating "hanging list"

The "hangling list" is defined as a list of items where each item is a paragraph of
texts with one or more lines, where the first line is flushed with the left margin, 
and subsequent lines of this same paragraph is each indented by a non-zero indentation.
This style of indentating can be thought of as "reverse" indentation where the indentation
does not apply to the first line, but rather to the lines starting from the second.

This effect can be simulated on CONTEX by utilizing the "description" feature of the
CONTEX. We will start by defining a new description named "HL"

    \definedescription[HL][
      headstyle=normal, style=normal, align=flushleft,
      alternative=hanging]

This will need to go before `\starttext`. The following is where we want to have the actual
"hanging list" items. 

    \startHL{}A sequence is a progression of numbers.

      Example 1: 1, 2, 3, 4, 5, ...

      Example 2: 1, 2, 3, 4, 5, ...

    \stopHL

This "hanging list" can be nested as well.

    \startHL{}A sequence is a progression of numbers.

      Example 1: 1, 2, 3, 4, 5, ...

      Example 2: 1, 2, 4, 8, 16, ...

    \stopHL

    \startHL{}A series is a summation of numbers.

      Example 1: 1 + 2 + 3 + 4 + 5 + ...

      Example 2: 1 + 2 + 4 + 8 + 16 + ...

    \stopHL

# Similating "description list"

The "description list" on CONTEX will have to be simulated in the same way.

    \definedescription[DL][
      headstyle=bold, style=normal, align=flushleft,
      alternative=hanging]

This will need to go before `\starttext`. Note that the difference between this one
and the one for a "hanging list" is the fact that the "headstyle=bold", which has
been set to point to "bold" instead of "normal"; this is to ensure that that the entire
data term is to be shown as bold. Another important thing to note is that the
"alternative=" must be set to "hanging"; this is the only way to ensure that the content
of the description list is indented by a non-empty white space.

The following is where we want to have the actual
"descrption list" items. 

    \startDL{Sequence} \crlf

      Example 1: 1, 2, 3, 4, 5, ...

      Example 2: 1, 2, 3, 4, 5, ...

    \stopDL

    \startDL{Series} \crlf

      Example 1: 1 + 2 + 3 + 4 + 5 + ...

      Example 2: 1 + 2 + 4 + 8 + 16 + ...

    \stopDL

Note that a '\crlf' command will need to be added after the `\startDL` command to ensure that
it does not pick up the first paragraph after it to "merge" with the item. Without it 
the text "Example 1:..." would have been shown to appear after the text "Sequence". 

This "description list" can be nested as well.

    \startDL{Sequence} \crlf

      \startDL{Arithmetic} \crlf
      
        An arithmetic sequence is formed by 
        applying a common difference between two consecutive terms.
      
        Example: 1, 2, 3, 4, 5, ...

      \stopDL

      \startDL{Geometry} \crlf
      
        A geometry sequence is formed by
        applying a common factor between two consecutive terms.
      
        Example: 1, 2, 4, 8, 16, ...

      \stopDL

    \stopDL

    \startDL{Series} \crlf

      Example 1: 1 + 2 + 3 + 4 + 5 + ...

      Example 2: 1 + 2 + 4 + 8 + 16 + ...

    \stopDL



