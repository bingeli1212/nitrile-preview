---
title: Translation
camer.setupbodyfont: linux,11pt
---

# Issues

- Advantages of using CONTEX: (1) able to switch the main font to any font
  installed by the system; (2) allow for temporarily switching to another 
  for some part of the text, such as CJK; (3) consistant vertical spacing
  between paragraphs; for an itemized list the bullets are flushed with
  the left margin rather than having a visible left margin like that
  of the LATEX; 
  
- Symbols in math mode are supported by typing their placing the Unicode
  character directly in the document and with "\math{}" command. The "\math{}"
  command can be nested, which works similarly to the "\ensuremath" command in
  LATEX; 

- For "\startitemize" command, if the option is not "packed", then there are
  visible vertical white spaces between items. Unfortunately the amount of this
  vertical space is not consistant with the inter-paragraph
  vertical space which is set by the "\setupwhitespace" command.
  Especially when the whitespace is set to "small", vertical spaces between
  items are larger than "small".

  The latest discovery have uncovered a way to fix this issue.  In particular,
  the option named "inbetween=" should be set to an empty string such as the
  following:

  ```verbatim
  \startitemize[][inbetween={},before={},after={}]
  ...
  \stopitemize
  ```

  In addition, the "before=" and "after=" should also be set to an empty string,
  thus suppressing any extra vertical spaces before and after the entire list to
  appear. It has been observed that the normal white spaces set by the "\setupwhitespace"
  command would still be placed between this list and the surrounding paragraphs before
  and after the list. Thus, the "before=" and "after=" option only seems to add extra
  vertical spaces.

  ```verbatim
  \startitemize[packed,joinedup][inbetween={},before={},after={}]
  ...
  \stopitemize
  ```

- The "\setupalign" command controls the entire article how texts are to be typeset.
  Especially things such as hyphenation, justification, hanging. etc.

  ```verbatim
  \setupalign[nothyphenated,justified,hanging]
  \setupalign[hyphenated,morehyphenation,flushleft]
  ```

- The "\startalignment" command is designed to locally change the alignment for 
  one particular paragraph. It must be ended with "\stopalignment"

  ```verbatim
  \startalignment[center]
  \startalignment[flushright]
  ```

- The "\setupwhitespace" controls inter-paragraph spacing. This is important especiall
  when text indentation of each paragraph is turned off.

  ```verbatim
  \setupwhitespace[small]
  \setupwhitespace[medium]
  \setupwhitespace[line]
  \setupwhitespace[5pt]
  ```

- Indentation is managed different than LATEX. See the section "Paragraph
  Indentations" below for more information.

- The "\type{}" command requires a balanced left-right-braces. Even when one of them
  is being escaped.

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

- Current the "linuxlibertine" does not yet support circled digit U+2460.
  The "linuxlibertine" font seems to have missing glyphs for ``Ascr`` to
  ``Zscr`` and other math variant glyphs. When using the default font these
  glyphs showed up.

- It has been noticed that when four Diagrams are being placed side by side and each
  diagram is 4cm wide, inside a Gleamer frame, then the first three Diagrams would
  have been placed at the first row and the last one wrapped, where LATEX and SVG
  would each have wrapped the third one down to the next row.

- DO NOT know how to make a double horizontal rule for a "tabular".  It has
  been observed that for a "starttable" block, two consecutive "\HL" commands
  does not turn it into a double horizontal line. It seems that these two "\HL
  commands are placed very close to each other and the horizontal line just
  appears to be a little thicker.

- DO NOT KNOW how to change the entire font for the "startable" block such that
  the table will be less taller than before. It is been seen that if a font
  switch such as "\bfxsm" is placed before "\starttable", then it the fonts are
  shrinked but the table does not gets shorter and is still the same height.

- The current setup for typesetting a HL list works beautifully in CONTEX.

- The ``\placefigure`` command could fail and cause a compile error if it is to
  generate a "Figure" caption (where "none" isn't provided inside the first
  option argument of this command). This has been observed inside Gleamer. For
  this reason, the "float_to_figure()" function inside the contex.js has been
  changed such that if the title is empty, then a "none" is placed inside the
  first optional argument, thus effectively disabling the generating of the
  "Figure" line, solving the problem and allowing the compile to continue
  inside Gleamer.

- When placing inline images using the combination of ``\hbox`` and
  ``\externalfigure``, the images could still appear being placed to far to the
  right such that it cuts into the spaces of the right margin, where it
  should've been wrapped to the next line. So far, if placed inside a figure,
  where each figure is wrapped by a "startcombination" and "stopcombination" commands,
  it seems to have worked fine. But it still needs to be verified.

- For a figure, if there are multiple lines for a sub-caption,
  the lines appear to be too far separated vertically from each other

- For TexLive2021, the command "\softhyphen" does not work and would
  cause a compile error, for downloaded context it does not have this
  problem.

- The "\startpart" and "\stoppart" command would not generate an output
  even when the "title=" field of this command is set to a non-empty string.
  The CONTEX documentation says that users are responsible for generating the
  actual contents, for instance, by placing a bTABLE in here with titles,
  subtitles, authors, and other texts. Another possibility is to use the
  "\startalignment[middle]" and "\blank[0.2cm]" commands to group a list of
  entries centered horizontally on the page, and use "\blank[2cm]" to move
  down vertically by adding extra vertical spaces between paragraph.

- The symbol names, defined in "char-def.lua", such as "onethird" does not 
  word reliably. It seems to work in one release but would stop to work
  in the subsequent release.

- A CONTEX version of a LATEX "\parbox" command can be done as follows:

  \parbox{30mm}{Hello World} 

  \framed[frame=off,width=30mm,align=flushleft]{Hello World}

  It is also possible to place font switch commands before it:

  {\switchtobodyfont[9pt]\framed[frame=off,width=30mm,align=flushleft]{Hello World}}

- It has been observed that for "starttabulate", when the column is set to "p",
  and the row contains a mix of normal text, math text, and display math, the
  row height is not big enough to hold the math text; the visual effect of this
  is that the top part of the math text of the lower row touches the bottom
  part of the text of the upper row.
  For this reason the "lines" fence is implemented using the "startlines" command.
  
- The 'start-stop-formula" command pair is not a complete replacement of a "displaymath"
  of LATEX, because it places visible whitespaces before and after the formula. It does
  howver, stop placing a indent before the next paragraph after the formula.

- The 'startlines' command would fail to produce a line-by-line paragraph when it appears
  inside a 'startsection' command.


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

  %!ConTeXt.fscode=xxsm
  %!ConTeXt.fslisting=xxsm
  %!ConTeXt.fstabular=sm  

Note that the relative font such as 'sm' is to be combined
with other switches that specifies the typeface such
as Sans Serif (\sssm), or Serif (\tfsm). This switch has
a lasting effect that stays on even after switches to a 
different font family. This could be beneficial if 
a different font family is to be chosen for a different
Unicode character or a collection of characters.

  {\tfsm Hello {\switchtobodyfont[jp]日本人}}




# Creating a ConTeXt document

When running 'nic' and the document is not a master document,
then no chapter is to be created, and only sections are.
In particular, each HDGS/1 block will become a "section"
of the ConTeXt document, and the HDGS/2 block is to become
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

The \mathscr is not available on ConTeXt and thus is not supported
on NITRILE.

# Use the "libertine" Font

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

- The \sfrac in ConTeXt does not place the numerator/denominator side-by-side,
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
  when ConTeXt determines it is just a little too long to fit in a line and it
  think it can just squeeze it in by shrinking all the spaces tighter.
  However, it has been observed that sometimes the parentheses are being drawn
  on top of other characters.

- There is not provision for a *wide* table, either for \starttabulate
  or for \bTABLE



# Remarks

- The name for the parser is 'ConTeXt'.

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

The math formula generation for ConTeXt is done 
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

Following are examples copied from WIKI page of ConTeXt.
Suppressing both the horizontal and vertical gap between cells:

    \setupcombinations[distance=0mm,after=]

A 10mm horizontal and vertical gap between cells:

    \setupcombinations[distance=10mm,after={\blank[10mm]}]

The distance between the content and its caption entry is set
with the 'inbetween' parameter.

Current the distance is made a parameter in ConTeXt
that is ConTeXt.distance, it is set to a number that represents
the percentage of the page. For example '2' would mean two-percent
of the page width. The \setupcombinations command is then placed
at the preamble of each generated ConTeXt document that reflects
this setting.

# Paper size

The paper size is done by the \setpapersize command.
Following option sets the paper size.

    %!ConTeXt.papersize=A4

# Page layout

Layout of each page is done by the \setlayout command.

    \setlayout[backspace=30mm,
               cutspace=15mm,
               width=30mm]

Following options can be used to set this command.

    %!ConTeXt.layout+=backspace=30
    %!ConTeXt.layout+=cutspace=15mm
    %!ConTeXt.layout+=width=15mm

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

The two column layout for ConTeXt can be done. It involves using
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

    \defineparagraphs[mypar][n=2]
    \startmypar
    Hello world left.
    \mypar
    Hello world right.
    \stopmypar

In this case, the word "Hello world left" will appear in its own
column which is on the left hand side, while the word "Hello
world right" will appear in its own column and it is on the right
hand side of the first column. 

Note that to use a ConTeXt "paragraph" this is the only way,
which is to have to define a new paragraph with a new name.
Another limitation is that all the texts of this paragraph is
always to be kept together---this means if the text is long
they will not be split into multiple columns, in a two column
layout mode, or spilled into the next page. 

Another example could be the following:

    \defineparagraphs
       [mypar][n=3,before={\blank},after={\blank}]
    \setupparagraphs
       [mypar][1][width=.1\textwidth,character=bold]
    \setupparagraphs
       [mypar][2][width=.4\textwidth]

    \startmypar
    1252
    \mypar
    Hasselt obtains its city charter from bishop Hendrik van Vianden.
    \mypar
    Hendrik van Vianden was pressed by other towns not to agree with the
    charter. It took Hasselt a long period of time to convince the
    Bishop. After supporting the Bishop in a small war against the
    Drents, the charter was released.
    \stopmypar

    \startmypar
    1350
    \mypar
    Hasselt joins the Hanzepact to protect their international trade.
    \mypar
    The Hanzepact was of great importance for merchants in Hasselt. In
    those days trading goods were taxed at every city, highway or
    rivercrossing. After joining the Hanzepact duty free routes all over
    Europe became available to Hasselt. However important the Hanzepact
    was, Hasselt always stayed a minor member of the pact.
    \stopmypar

The previous example shows that after defining a paragraph with
\defineparagraphs you can format the paragraph with "\setupparagraphs". Next
you can start your paragraph with "\start..." and end it with "\stop..." A new
paragraph starts with the name of your paragraph, in this case it is "\mypar".

Here is another example:

    \defineparagraphs[chempar]     [n=3,before=,after=,distance=1em]
    \setupparagraphs [chempar] [1] [width=.12\textwidth]
    \setupparagraphs [chempar] [2] [width=.4\textwidth]
    \startchempar
    Limekilns
    \chempar
    Hasselt has its own limekilns. These were build in 1504 and produced
    quick lime up to 1956. Nowadays they are a touristic attraction.
    \chempar
    \chemical{CaCO_3, ̃,GIVES, ̃,CaO, ̃,+, ̃,CO_2}
    \stopchempar

By the way you could also type it in a more cryptic way:

    \chempar Limekilns
        \\ Hasselt has its own limekilns. They were build in 1504 and
           produced quick lime up to 1956. Nowadays they form a
           touristic attraction.
        \\ \chemical{CaCO_3, ̃,GIVES, ̃,CaO, ̃,+, ̃,CO_2} \\

The double backslashes are used as column separators and are essential.




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

ConTeXt automatically chooses sections as the toplevel
sectional headings when no \startchapter is detectd.

  
# Generating customized part page

Set the `ConTeXt.partpage` option to 1, and then 
set the `ConTeXt.part` using segmented entry 
syntax, where each entry to appear in its own line.

    %^ConTeXt.partpage=1
    %^ConTeXt.part+=\dontleavehmode
    %^ConTeXt.part+=\blank[50mm]
    %^ConTeXt.part+=\startalignment[flushleft]
    %^ConTeXt.part+={\bfb Part ${1}}
    %^ConTeXt.part+=\stopalignment
    %^ConTeXt.part+=\blank[8mm]
    %^ConTeXt.part+=\startalignment[flushleft]
    %^ConTeXt.part+={\bfd ${text}}
    %^ConTeXt.part+=\stopalignment
    %^ConTeXt.part+=\page

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

# Gradient Color For Ball

If the a gradient color is to be desired, and the "shade=" option has been set to
"ball", then following "fill" command would have to be generated.

    fill (...) withshademethod "circular" 
               withshadecenter(-0.45,0.35) 
               withshadedomain(0,1) 
               withshadestep( 
                 withshadefraction 0.5 
                 withshadecolors(\MPcolor{white},(0.000,0.502,0.502)) ) 
               withshadestep( 
                 withshadefraction 1.0 
                   withshadecolors((0.000,0.502,0.502),\MPcolor{black}) );
    
The "withshadecenter()" option is to be fixed at a value of "(-0.45,0.35)",
which expresses the shift from the center towards the left and top. The
"withshadedomain(0,1)" option expresses the extent of the color shift, where 0
expresses a 0% and 1 means 100%.  The "withshadestep()" command would have
setup a color keyframe. The first one is to extablish that at the 50% mark the
color would have already shifted to being (0,0.5,0.5), and the color would
have stayed at RGB(0,0.5,0.5) between the 50% mark and 100% mark.

This is assumed that the user has provided at least one color for the "shadecolor" style.
If this is not the case, then the color is assumed to be gray, or (0.5,0.5,0.5)

    fill (...) withshademethod "circular" 
               withshadecenter(-0.45,0.35) 
               withshadedomain(0,1) 
               withshadestep( 
                 withshadefraction 0.5 
                 withshadecolors(\MPcolor{white},(0.5,0.5,0.5)) ) 
               withshadestep( 
                 withshadefraction 1.0 
                 withshadecolors((0.5,0.5,0.5),\MPcolor{black}) );



# Gradient Color For Linear

Following is an example of linear shading.

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

Following is an example of circular shade.

Shading is available too. This mechanism is a bit more complex deep down
because it needs resources as well as shading vectors that adapt themselves to
the current scale. We will not go into detail about the shading properties
here.

    \startMPcode
        comment("two shades with mp colors");
        fill fullcircle scaled 5cm
            withshademethod "circular"
            withshadevector (2cm,1cm)
            withshadecenter (.1,.5)
            withshadedomain (.2,.6)
            withshadefactor 1.2
            withshadecolors (red,white)
            ;
        fill fullcircle scaled 5cm shifted (6cm,0)
            withshademethod "circular"
            withcolor "red" shadedinto "blue"
        ;
    \stopMPcode



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

- \AR	
  next row	make row with automatic vertical space adjustment
- \NR	
  next row	make row with no vertical space adjustment
- \FR	
  first row	make row, adjust upper spacing
- \LR	
  last row	make row, adjust lower spacing
- \MR	
  mid row	make row, adjust upper and lower spacing
- \SR	
  separate row	make row, adjust upper and lower spacing
- \VL	
  vertical line	draw a vertical line, go to next column
- \NC	
  next column	go to next column
- \HL	
  horizontal line	draw a horizontal
- \DL	
  division line?	draw a division line over the next column
- \DL[n]	
  division line?	draw a division line over n columns
- \DC	
  division column?	draw a space over the next column
- \DR	
  division row?	make row, adjust upper and lower spacing
- \LOW{text}	
  lower text
- ? \DL, \DC and \DR are used in combination.
- \TWO, \THREE etc.		
  use the space of the next two, three columns

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

  Each cell is in (inline) math mode. 

+ `M`

  Each cell is in (display) math mode. 

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

  Color. Use it in combination with ``\{`` (e.g. ``\{C{red}`` )

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
ConTeXt has some support for math symbols in Unicode.
For example, it does not provide support for \coloneq
symbol but we can type a Unicode character U+2254 directly
inside the math formular and it will work.

    \( A ≔ B \)

When it is translated into a ConTeXt document it becomes

    \math{A ≔ B}

And it just works.

Following is a partial list of common LATEX symbols that
cannot be found on the ConTeXt side such that it must be
typeset by a Unicode character.

- \coloneq 
- \ctdot

Another interesting fact about ConTeXt is that for the following 
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

In the following example a double-line text ``Hello\\World`` is being sent to
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

# Simulating CONTEX version of the "description list"

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


# Typesetting a Floating Figure

For a floating figure, all subfigures can be setup so that 
images are placed side-by-side from left to right, and will
then be wrapped down to the next row if it can't fit in the rest
of the spaces of the current row.

The subcaptions of a subfigure can be placed underneath the 
image using the start/stop combination command.

    \placefigure
    []
    [myfig]
    {GIMP Logos.}
    {%
    \startalignment[middle]
    \dontleavehmode
    \hbox{%
      \startcombination[1*1] 
        {\externalfigure[image-gimp.jpg][]} 
        { \small One} 
      \stopcombination}
    \hbox{%
      \startcombination[1*1] 
        {\externalfigure[image-gimp.jpg][]} 
        { \small One} 
      \stopcombination}
    \hbox{%
      \startcombination[1*1] 
        {\externalfigure[image-gimp.jpg][]} 
        { \small One} 
      \stopcombination}
    \hbox{%
      \startcombination[1*1] 
        {\externalfigure[image-gimp.jpg][]} 
        { \small One} 
      \stopcombination}
    \stopalignment
    }


# Left/Right/Center Alignment

The text alignment could be done by using the start/stop of "alignment"
environment variable. The option specified here is "flushleft", "flushright",
or "middle".  Following example is to set up a paragraph such that all contents
are center aligned.

    \startalignment[middle]% 
    \dontleavehmode
    \externalfigure[cow][width=2cm]
    \stopalignment

# Add a left margin

To add a left margin to an environment, such as "startlines/stoplines" , place 
this environment between "startitemize/stopitemize".

    \startitemize
    \startlines
    ...
    \stoplines
    \stopitemize

# Following are Function that are defined by CONTEX

In writing mathematics, the names of variables are in italics, but
some common functions like trignomeric functions, min, max, log, etc.
are always written in upright roman font. The following log like
functions are defined in ConTeXt.

    \arccos	\arcsin	\arctan	\arg	\cosh	\cos	\coth	\cot	\csc	\deg
    \det	\dim	\exp	\gcd	\hom	\inf	\injlim	\ker	\lg	\liminf
    \limsup	\lim	\ln	\log	\median	\max	\min	\mod	\div	\projlim
    \Pr	\sec	\sinh	\sin	\sup	\tanh	\tan

ConTeXt provides the command \definemathcommand to define new log like
functions. For example, if you want to define a lcd function, you can do

    \definemathcommand [lcd] [nolop] {\mfunction{lcd}}

The nolop option tells ConTeXt that subscripts should be placed on the side of
the command (as in trignometric functions) rather than underneath the command
(as in min, max, and limits). If you want to place the subscript underneath the
command, you can use limop instead. The \mfunction command sets its argument in
the current math roman font. So,

    \definemathcommand [lcd] [nolop] {\mfunction{lcd}}

expands to

    \def\lcd{\mathop{\mfunction{lcd}\nolimits}}}

while

    \definemathcommand [argmin] [limop] {\mfunction{arg\,min}}

expands to

    \def\argmin{\mathop{\mfunction{arg\,min}}} 
    
Notice no \limits or \nolimits

Thus, it is possible to generate a function definition on the fly without having
to previous define it in the preamble of a CONTEX document. For instance, if 
a new function named "fun" is needed, we can have it appear within a CONTEX document
such as follows. The first one is to have a thin space between the name "fun" and
the argument "x", and the second one would have had no spacing between the name "fun"
and the opening parenthesis.

    a = \math{\mathop{\mfunction{fun}}x}
    a = \math{\mathop{\mfunction{fun}}(x)}

# Paragraph Indentations

In plain TeX, controlling indentation is simple: The user sets a value for
parindent, and each new paragraph is indented by that value, unless explicitly
begun with noindent. Environments can provide a noindent at the end of their
definitions, and if the user wants to overrule that, he can add an explicit
indent at the beginning of the next paragraph. For the most part, LaTeX follows
the same convention.

Indentation in ConTeXt are a bit different: it mostly does not rely on the
presence of blank lines, but uses ``\setupindenting`` to manage general
indentation, the ``indentnext=yes/no/auto`` key on environments to
enable/disable indentation after them, and ``\indentation`` and
``\noindentation`` to manually force/disable an indentation.

The commands ``\indent``, ``\noindent``, ``\indenting``, and ``\noindenting``
are present for historical reasons, but should not be used. Especially, they
should not be confused with ``\indentation`` and ``\noindentation``.

[ Setting up indentation for the whole document ]
Almost all indentation involves two issues that need to be address: (1) when to
indent, and (2) how much to indent. In ConTeXt, these issues can be addressed
by running the ``\setupindenting`` command before the main body. This command
expects a list of reserved words between the first set of square brackets.  Each
reserve words conveys a specific meaning as to how the indentations are to be
done for the entire document.

```list
+ no yes: 
  These reserved words turn indentation on/off
+ none small medium big dimension: 
  These reserved words control the size of indentation
+ first next: 
  These reserved words controls the indentation for the first paragraph. 
  The behavior of which can also be overridden by each environments with the setting
  of the indentnext=yes/no/auto.
+ odd even: 
  These reserved words control the indentation of odd/even lines in \obeylines scopes
+ normal: 
  These reserved words control the globally defined size of indent. Useful when used as 
  the values of the indenting key of different environments.
```

[ Indentation immediately after an environment. ]
The ``\setupindenting`` command is designed to indent each paragraph,
regardless of their location or surroundings.  However, sometimes it might
seems typographically correct for controlling the indentation of a paragraph
depending on their relative position from environments surrounding it.

For instance, it might seem to be typographically correct that a paragraph not
be indented if it immediately follows an environment that is itemize,
enumerations, definitions, formulas and/or floats. It also might be correct
that a paragraph not be indented if it follows a head such as chapters,
sections, and subsections.

Fortunately, ConTeXt has designed it so that almost all environments has a key
named "indentnext" that can be set to a value that is either "yes" or "no" that
controls how the paragraph immediately following it should be indented.

    \setupitemgroup[itemize][indentnext=no]

Typically this key should've been assigned a value before the start of the main
text.  Following are details of the indentation behavior for the paragraph
immediately following the environment.

```list
+ yes 
  declares that the first paragraph following the environment should always be
  indented.
+ no 
  declares that the first paragraph following the environment should never be
  indented.
+ auto 
  declares that the next paragraph should be indented only if there is a blank
  line detected after the environment and before the next paragraph. Setting
  indentnext=auto is equivalent to the default plain TeX and LaTeX behaviour.
```

When set to "auto", the following paragraph will be indented only if there is
a blank line between the end of the environment and the first line of the
next paragraph. Thus, in the following example the paragraph starting with
the word "Hello" is not to be indented.

    \startitemize
      \item Two
    \stopitemize
    Hello, this paragraph should not be indented.

Following are some examples of calling variants of the "setup" command for
many different environments.

    % Do not indent paragraphs after \stopitemize
    \setupitemgroup[itemize][indentnext=no]

    % indent paragraphs after section heads
    \setuphead[section][indentnext=yes]

    % indent the paragraphs after all sectioning heads 
    \setupheads[indentnext=yes] 

    % indent paragraphs after formulas if there is a blank space in between
    \setupformulas[indentnext=auto] 

[ Indentation within an environment. ]
The ``\setupindentation`` and the "indentnext" key takes care of controlling
the indentation behavior of normal paragraphs, the indentation of paragraphs
inside each environment itself are not affected.           

By default, ConTeXt does not attempt to indent any paragraph within a
particular environment. The indentations of these paragraph are left entirely
to the implementation details of each environment itself.  For some environment,
such as itemize, description, or enumeration, the environment provides a key
named "indenting" that can be set to control the behavior of paragraphs with
that environment.  Following is an examle which sets up so that the second
paragraph after each item is to be indented by 40pt.

    \setuppapersize[A5]
    \setupindenting[medium,yes]
    \setupitemgroup[itemize][indenting={40pt,next}]
    \startitemize
    \item This is an example of a multi|-|paragraph 
          item inside an itemize environment.
          ­ 
          This second paragraph is indented by 40pt
          (double the normal indentation).
    \stopitemize

In order to override the rule that has been setup for a particular paragraph, such
as to force an indentation, the ``\indentation`` command can be used that should've
been placed immediately in front of the paragraph.

    \indentation This paragraph will be indented ...

To suppress an indentation of a paragraph that otherwise would've been indented,
the ``\noindent`` command can be used to place immediately in front of the paragraph.

    \noindent This paragraph will NOT be indented ...

Note that the ``\indent`` command which is a TEX native command does not work
in ConTeXt.

# The "itemize" Environment

The "itemize" environment is to typeset itemized list. It starts with ``\startitemize``
and ends with ``\stopitemize``. 

    \startitemize
    \item Apple
    \item Pear 
    \item Strawberry
    \stopitemize

The first arument for this command is the option.  Following are various
options that can be specified for this environment.

    \startitemize
    \startitemize[n]
    \startitemize[n,packed]
    \startitemize[packed]
    \startitemize[joinedup]
    \startitemize[packed,joinedup]
    \startitemize[text]

The key/value pairs of this command can be specified as the second argument
of this command.

    \startitemize[text][textdistance=medium]

When "text" is used, each item is treated as a list, such that if an item text
is wrapped to the next line, the second line and beyond are not indented to
flush with the text. Rather, the left margin of the second line and beyond is
flushed with the bullet instead.  Note that the "textdistance" key which
supposedly should have controled the vertical distance between items does not
seem to work.

When "joinup" is included, it suppress any additional spaces that might have
been placed before and after the entire environment, such that this environment
will have the same amount of vertical space between itself and the surrounding
paragraphs, as those of any two normal paragraphs.

After the start fo the ``\startitemize``, the ``\item`` command can be used which 
is to designate a particular paragraph as an "item" of the environment. Besides,
the command ``\item``, following are additional variants of it that can be used 
in place of ``\item``, each of which serving a slightly different purpose.

```list
+ \item 
  to print ordinary items
+ \sym 
  to print an item with a custom symbol
+ \mar 
  to print an item with margin text
+ \sub 
  to print an item with a continuation mark
+ \its 
  to print an item with a row of marks (for response ranges)
+ \ran 
  to print a range for the \its row
+ \head 
  to print a head within the list
+ \but 
  to print an item whose mark is an interactive button
+ \nop 
  to print an item without a mark, and without incrementing the item counter
```

# The "bTABLE" environment

The preferred way to typeset tables is to use what are called “natural tables”
(also known as “automatic tables” or “HTML tables”). They are especially suited
for XML conversions. See the &link{enattab.pdf} manual for many examples.

To place a table use:

    \placetable{Caption}
    {\bTABLE
    \bTR \bTD One \eTD \bTD two \eTD \eTR
    \bTR \bTD One \eTD \bTD two \eTD \eTR
    \eTABLE}

A more elaborate example:

This is our red-coloured table.

    \setupcolors[state=start]
    \setupTABLE[row][odd][background=color,
                          backgroundcolor=red, 
                          width=.2\textwidth]
    \bTABLE[split=yes] % allow splitting over page boundaries
      \bTR \bTD[nr=3] 1 \eTD \bTD[nc=2] 2/3     \eTD \bTD[nr=3] 4 \eTD \eTR
      \bTR                   \bTD 2 \eTD \bTD 3 \eTD                   \eTR
      \bTR                   \bTD 2 \eTD \bTD 3 \eTD                   \eTR
      \bTR \bTD[nc=3] 1/2/3                     \eTD \bTD 4 \eTD       \eTR
      \bTR \bTD 1       \eTD \bTD 2 \eTD \bTD 3 \eTD \bTD 4 \eTD       \eTR
    \eTABLE

Try to divide your table into...

    \bTABLEhead (table header)
    \bTABLEnext (alternate table header on following pages)
    \bTABLEbody (table body)
    \bTABLEfoot (table footer)

and 

    \setupTABLE[split=yes] or [split=repeat]

see also tabl-ntb.mkiv

If you must split a natural table over several pages, you can simply do this by
adding ``\setupTABLE[split=yes]`` to your TABLE definition. Another way is to
define it right at the TABLE start by adding the parameter ``[split=yes]`` (see
example). However, ``\startlinecorrection`` can lead to unpredictable vertical
spaces between rows.

In this case the table head (all between ``\bTABLEhead`` and ``\eTABLEhead``)
is printed only once at the beginning of the table. But if you use
``[split=repeat]``, it is printed on top of every new page, that contains parts of
your multipage table. Please take account of the fact, that the head cells are
enclosed by ``\bTH`` and ``\eTH`` (and not ``\[be]TC``).

If you want to use an alternative table header for all following pages, you can
do this by defining an additional header. Just add the second header between
``\bTABLEnext`` and ``\eTABLEnext``, right after your normal head definition.
Now every additional page of the multipage table starts with the next table
head.

The table foot is declared between ``\bTABLEfoot`` and ``\eTABLEfoot``. It
defines the concluding row of your natural table.

Beware: Split tables often begin not on the page (or in the column, if you use
them) where they could start, but on/in the next one. This is a known
limitation due to the complicated calculation of remaining space on the page.
That won't become better before this calculations are newly written in Lua.
(Said Hans on 2010-09-24.)

The following standalone example deals with all the mentioned aspects of
natural tables. Just copy and paste it as a starting point for further
experiments...

    \starttext

    \setupcolors[state=start]

    % setup for all cells
    \setupTABLE[r][each][style=\tfx\it, align=center]

    % setup table head
    \setupTABLE[r][first]
      [background=color,
       backgroundcolor=yellow]
    % setup table footer
    \setupTABLE[r][last]
      [style=bold,
       background=color,
       backgroundcolor=green]

    \bTABLE[split=repeat,option=stretch]
    %
    % IMPORTANT: use \bTH ... \eTH to enclose the head|next cells
    \bTABLEhead
    \bTR
      \bTH  head1 \eTH
      \bTH  head2 \eTH
      \bTH  head3 \eTH
    \eTR
    \eTABLEhead
    % 
    \bTABLEnext % setup for next table head
    \bTR [background=color,backgroundcolor=cyan]
      \bTH  next1 \eTH
      \bTH  next2 \eTH
      \bTH  next3 \eTH
    \eTR
    \eTABLEnext
    %
    % the table body (main part)
    %
    \bTABLEbody
    %
    \dorecurse{100}{% 100 rows
    \bTR
      \bTC  body body body body body \eTC
      \bTC  body body body body body \eTC
      \bTC  body body body body body \eTC
    \eTR
    }%
    %
    \eTABLEbody
    %
    % the table foot
    %
    \bTABLEfoot
    \bTR
      \bTC  foot1 \eTC
      \bTC  foot2 \eTC
      \bTC  foot3 \eTC
    \eTR
    \eTABLEfoot
    %
    \eTABLE

    \stoptext

# The "chapters" and "sections"

ConTeXt creates chapters with the ``\chapter`` command. The text that is put
inside the curly braces is the chapter title that will appear.

    \starttext
    \chapter{First Chapter Title}
    This is the text in the first chapter.
    \chapter{Second Chapter Title}
    This is the text in the second chapter.
    \stoptext 

The created document will automatically get sequential chapter numbers and each
chapter will start on a new page. Similar to chapters, sections and subsections
can be created with other header commands as shown in table 4.1.

    Numbered Header    Numberless Header
    ===============    =================
    \chapter           \title
    \section           \subject
    \subsection        \subsubject
    \subsubsection     \subsubsubject 

The command has two arguments. The first optional argument is a square bracket
pair and the second argument an argument in a curly braces pair. The curly
braces contain the text that will be rendered in the document as the chapter
title. The square bracket pair is optional and can be used for internal
references elsewhere in the document.

    \chapter[first-chapter]{This is the First Chapter Title}

If somewhere else in the document you want to refer to this header, you type
for example

    \on{page}[first-chapter]

Or, alternatively

    \at{page}[first-chapter] 

# A ConTEXt Document with a Table of Contents

The command ``\placecontent`` creates a table of contents on the same page.

    \starttext
    \placecontent
    \chapter{First Chapter Title}
    This is the text in the first chapter.
    \chapter{Second Chapter Title}
    This is the text in the second chapter.
    \stoptext

The command ``\completecontent`` creates a table of contents on a new page.

    \starttext
    \completecontent
    \chapter{First Chapter Title}
    This is the text in the first chapter.
    \chapter{Second Chapter Title}
    This is the text in the second chapter.
    \stoptext

The chapter numbers assigned to each chapter in the document will automatically
match the corresponding chapter numbers in the table of contents that ConTEXt
creates with either the ``\placecontent`` or the ``\completecontent`` command. 

# Changing the Header Style

Look at the following ``\setuphead`` command example.

    \setuphead[chapter][style=bold]

This command will provide for chapter headers to have a bold font. The
following command will arrange for section headers to be slanted.

    \setuphead[section][style=slanted]

The ``\definehead`` command together with the ``\setuphead`` commands can modify the
headers as the following example illustrates.

    \definehead[myheader][section]
    \setuphead[myheader]
    [numberstyle=bold,
    textstyle=cap,
    before=\hairline\blank,
    after=\nowhitespace\hairline]
    \myheader[myhead]{First Section Header Title}

The ``\setupheads`` command is used to set up numbering of the numbered headings.

    \setupheads[alternative=inmargin,separator=--]

With this command, all numbers will appear in the margin, and ‘Section 1.1’
will look like ‘Section 1- 1’. The ``\setupheads`` command should be put in the
setup area of the document. 

# The "setuppapersize" Command

The ``\setuppapersize`` is used to define both the paper size for screen
typesettings and paper size for printing.

The ``\setuppapersize[A4,landscape][A3,landscape]`` command is to define a A4
size in screen typesetting that would have to be printed in a A3 paper.
Following are additional paper size recognized by ConTeXt.

    A3                    ISO A3 standard
    A4                    ISO A4 standard
    A5                    ISO A5 standard
    A6                    ISO A6 standard
    S6
    letter                U.S. letter standard
    legal                 U.S. legal standard
    portrait              rendered in portrait format
    landscape             rendered in landscape format
    oversized             adds 1.5 cm on each side
    doublesized           double the height
    doubleoversized
    mirrored
    rotated
    90
    180
    270

The ``\definepapersize`` command together with the ``\setuppapersize`` command can
modify the paper size as the following example illustrates.

    \definepapersize[mypapersize][width=8.5in,height=11in]
    \setuppapersize[mypapersize][mypapersize]

As indicated, after defining the ‘mypapersize’ option, it can be used just as
well as the regular A3, A4, etc. paper sizes for both screen size and paper
size. 

# The Text in Header and Footer

The ``\setupheadertexts`` and ``\setupfootertexts`` commands are used for creating a
header and footer. Both have the following general syntax.

    \setupheadertexts[...][...][...] 
    \setupfootertexts[...][...][...]

The commands have three arguments. The first square bracket pair is used to set
the location of the header or footer. The header and footer itself are placed
within the second square bracket pairs. In a double sided document, the second
and third square bracket pairs are used for the header and the footer on the
left and right side pages, respectively. Table 5.2 shows some of the command
options that can be used at the first square bracket pair. 

    Arg          Option           Description
    ===========================================
    1            text
                 margin
                 edge
    -------------------------------------------
    2            text
                 section
                 date
                 mark
    -------------------------------------------
                 pagenumber
    3            text
                 section
                 date
                 mark
                 pagenumber 
    -------------------------------------------

In many cases you can omit parameters, as in the next example.

    \setupheadertexts[chapter]

In this case the parameter ‘chapter’ is interpreted as an implicit option. This
keyword will yield the title of the current chapter on the middle of the page
header. This header will change dynamically at every new chapter. The following
example illustrates the addition of the book title as well.

    \setupheadertexts[my Book Title][chapter]

In this case the text ‘my Book Title’ will appear on the left of the page
header and the title of the current chapter on the right of the page header.
You can setup the page header and footer with.

    \setupheader[...]

and

    \setupheader[...] 

Following are values that can be set for the "style=" key.

```list
+ normal
+ bold
+ slanted
```

The following example illustrates its use.

    \setupheadertexts[style=bold]
or

    \setupheadertexts[style=\ss]

If you want to leave out the page header and footer on one particular page, for
example the title page, you can use

    \noheaderandfooterlines 

# Set Global Page Numbers

The ``\setuppagenumbering`` command is used for setting page numbers. The
command has the following general syntax.

    \setuppagenumbering[..,..=..,..]

The command has a single argument in a square bracket pair that can contain
multiple assignment options and their key values. Table 5.4 shows some of the
``\setuppagenumbering`` command assignment options.

Following are values for the "alternative=" key.

```list
+ singlesided
+ doublesided
```

Following are values for the "location=" key.

```list
+ header
+ footer
+ left  
+ right  
+ middle
+ margin
```

Following are values for the "conversion=" key.

```list
+ numbers
+ characters
+ romannumerals
```

The "left=", "right=", and "text=" are to be set to the actual
text.

In order to remove page numbering entirely, set location to blank.

    \setuppagenumbering[location=]

# Changing Local Page Numbering

Page numbering takes place automatically but you can enforce a page number with

    \page[25]

Sometimes it is better to state a relative page number like

    \page[+2]

or

    \page[-2] 

# Page Breaking

A page can be enforced or blocked by the page command

    \page[...]

The ``\page`` command has a single argument in a square bracket pair that can
contain a single keyword option. Following shows some of the available keyword
options.

```list
+ yes 
  enforce a page
+ makeup 
  enforce a page without filling
+ no 
  no page
+ preference 
  prefer a new page here
+ bigpreference 
  great preference for a new page here
+ left 
  next page is a left handside page
+ right 
  next page is a right handside page
+ disable 
  following commands have no effect
+ reset 
  following commands do have effect
+ empty 
  insert an empty page
+ last 
  add pages until an even number is reached
+ quadriple 
  add pages until foursome is reached 
```

# The Page Background

The \setupbackgrounds command is used for aaaa. The command has the following
general syntax.

    \setupbackgrounds[...][..,..][..,..=..,..]

The command has a single argument in a square bracket pair that can contain
multiple keys and key values. 

# Paragraph Separation

In ConTEXt, you can start a new paragraph with either en empty line or the
``\par`` command. It is advised to use empty lines as paragraph separators.
This will lead to clearly structured and well organized input files and will
prevent mistakes. Only in situations where a command has to be closed
explicitly, the ``\par`` command should be used. 

# Paragraph Formatting

Sometime you want to apply a special format to paragraphs. You can define a special format with the
\defineparagraphs command, after which you can specify the details of this format with the
\setupparagraphs command, which have the following general syntax.

    \defineparagraphs[..,..][..,..=..,..]
    \setupparagraphs[..,..][..,..][..,..=..,..]

A few ``\defineparagraphs`` command options are listed below.

             key         value
    ======================================
    1        name              
    --------------------------------------
    2        n           number
             rule        on     
                         off    
             height      fit    
                         dimension
             before      <command> 
             after       <command> 
             inner       <command> 
             distance    <command> 
             tolerance   verystrict
                         strict      
                         tolerant    
                         verytolerant
                         stretch      
             align       left        
                         right       
                         middle      
    --------------------------------------

Following are some command options for the ``\setupparagraphs`` command.

             key         value
    ======================================
    1        name              
    --------------------------------------
    2        number      
             each        
             style       normal 
                         bold      
                         slanted   
             width       <command> 
             height      <command> 
             before      <command> 
             after       <command> 
             tolerance   verystrict
                         strict      
                         tolerant    
                         verytolerant
             align       left        
                         right       
                         middle      
                         <width>     
    --------------------------------------


After defining a paragraph with ``\defineparagraphs`` you can format the
paragraph with ``\setupparagraphs``. Next, you can start your paragraph with
the ``\start`` and the ``\stop`` command combination. A new paragraph starts
with the name of your paragraph, in this case ‘mypar’. 

    \defineparagraphs[mypar]
                     [n=3,
                     before={\blank},
                     after={\blank}]
    \setupparagraphs[mypar]
                    [1]
                    [width=.08\textwidth,
                    style=bold]
    \setupparagraphs[mypar]
                    [2]
                    [width=.3\textwidth]
    \startmypar
    1360
    \mypar
    First oil painting in western Europe
    \mypar
    With the introduction of oil painting into western Europe, the earliest
    naturalistic painting is created. Its subject is the French king, John the Good.
    After this, naturalistic portraitures become prominent in European art.
    \stopmypar

Below is another example of paragraph formatting.

    \defineparagraphs[paintpar]
                      [n=3,
                      before=,
                      after=,distance=1em]
    \setupparagraphs[paintpar]
                      [1]
                      [width=.1\textwidth]
    \setupparagraphs[paintpar]
                      [2]
                      [width=.3\textwidth]
    \startpaintpar
    \it 1360
    \paintpar
    First oil painting in western Europe
    \paintpar
    With the introduction of oil painting into western Europe, the earliest
    naturalistic painting is created. Its subject is the French king, John the Good.
    After this, naturalistic portraitures become prominent in European art.
    \stoppaintpar

This can also be coded in a more cryptic and efficient way.

    \paintpar 
    \it 1360
    \\
    First oil painting in western Europe
    \\
    With the introduction of oil painting into western Europe, the earliest
    naturalistic painting is created. Its subject is the French king, John the Good.
    After this, naturalistic portraitures become prominent in European art.
    \\

The \\ columns are used as column separators and they are essential. In order
to condense the ConTEXt code, this cane be coded as following.

    \paintpar \it 1360
    \\ First oil painting in western Europe
    \\ With the introduction of oil painting into western Europe, the earliest
    naturalistic painting is created. Its subject is the French king, John the Good.
    After this, naturalistic portraitures become prominent in European art. \\ 

# Paragraph Vertical Spacing

Vertical spacing between paragraphs can be specified by.

    \setupwhitespace[..,..]

Following shows the available command options for the ``\setupwhitespace``
command. 

```list
+ none
+ small
+ medium
+ big
+ dimension 
```

When inter-paragraph spacing is specified there are two commands available that
are seldom used.

    \nowhitespace

and

    \whitespace

If a paragraph contains horizontal lines, the line spacing requires extra care.
Consider the following example where the ``\framed{some text}`` command is used to
put lines around the word enclosed inside the curly braces pair. 

    This is a paragraph that contains some words that are
    \framed{enclosed with lines}
    in order to show the required correction.

When processed, we see an alignment problem that must be corrected. This can be
done as following with the ``\startlinecorrection`` and ``\stoplinecorrection``
command pair.

    This is a paragraph that contains some words that are
    \startlinecorrection
    \framed{enclosed with lines}
    \stoplinecorrection
    in order to show the required correction.

The vertical spacing of the output will be better. 

# Implicit Vertical Spacing

Furthermore, the ``\blank`` command provides for vertical white spacing, too.
The general syntax for the ``\bank`` command is.

    \blank[..,..]

Following shows the available command options for the ``\blank`` command. 

```list
+ none
+ small
+ medium
+ big
+ nowhite
+ back
+ white
+ dimension
```

You can specify the amount of blank space using keyword options such as small,
middle, and big, which are related to the current font size as the following
example illustrates.

    This is the first line of text
    \blank
    This is the second line of text
    \blank[big]
    This is the third line of text
    \blank[2*big]
    This is the fourth line of text

If you do not specify a parameter, the ``\blank`` command will yield the default
space. Default spacing can be setup with

    \setupblank[..,..] 

This is a global parameter and is usually put in the setup area of the input
file, so all vertical blank spaces in the document will get its properties. It
has the same keyword options as the ``\blank`` command. Alternatively, a
‘dimension’ such as for example ‘3pt’ can be specified. If you want to suppress
vertical spacing you can use the following command combination. 

    \startpacked[..,..] . . . \stoppacked 

If you want to increase vertical spacing you can use the following command pair
combination.

    \startunpacked[..,..] . . . \stopunpacked

The following code illustrates its use.

    \defineparagraphs[year][n=2,before=,after=]
    \year 500 \\ beginning of the middle ages \\
    \year 1500 \\ end of the middle ages \\
    \startpacked
    \year 500 \\ beginning of the middle ages \\
    \year 1500 \\ end of the middle ages \\
    \stoppacked
    \startunpacked
    \year 500 \\ beginning of the middle ages \\
    \year 1500 \\ end of the middle ages \\
    \stopunpacked

The first two lines have regular vertical spacing, the next two lines have
reduced vertical spacing and the last two lines have increased vertical
spacing. 

# Explicit Vertical Spacing

You can force vertical space as following.

    \godown[...]

The command has the same keyword options as the ``\blank`` command.
Alternatively, a ‘distance’ such as for example ‘10in’ can be specified. 

# Margin Text

The ``\inmargin`` command is used to put text in the margin. The command has the
following general syntax.

    \inmargin{...}

Where the text that needs to be put in the margin is put inside the curly
braces pair as the following example illustrates.

    \inmargin{this text will be put in the margin} 

# Regular Outlined Text

The ``\framed`` command is used to outline a text.

    \framed[height=1cm,width=fit]{This text is outlined}

The ``\framed`` command has the following general syntax.

    \framed[..,..=..,..]{...}

The command has two arguments. The first argument is a square bracket pair that
optional and contains the properties of the outlining. The second argument is a
curly braces pair that encloses the text that will be outlined. Table 7.7 shows
some of the ``\framed`` command keys and their available key values. 

    Option         Value
    ==============================
    width          fit
                   cm 
    height         fit
    background        
    ------------------------------

# Inline Outlined Text

The ``\inframed`` command is used to outline a text inline and is a better
command to use to outline small pieces of text within a paragraph because it
automatically takes care of interline spacing.  

    This line has \inframed[width=fit]{some of its words} outlined.  

The ``\inframed`` command uses the same general syntax and command options as
the ``\framed`` command. 

# Paragraph Outlined Text

If you want to outline complete paragraphs you can use the following command pair combination.

    \startframedtext[..,..] ... \stopframedtext

The following code illustrates its use.

    \startframedtext[width=.7\makeupwidth]
    This text is a small paragraph and it shall be outlined. 
    This is done with the ConTEXt startframed and stopframed 
    command pair.
    \blank
    Various command options are available to modify the settings 
    of the outlining.
    \stopframedtext 

# Alignment

Single lines of text can be aligned with the commands ``\leftaligned``, ``\midaligned``
and ``\rightalinged``, as demonstrated in the example below.

    \leftaligned{\inframed[width=fit]{This text is aligned left}}
    \midaligned{\inframed[height=1.5cm,frame=off]{This text is aligned in the middle}}
    \rightaligned{\inframed[height=10mm]{This text is aligned right}}

Alignment of paragraphs is done with the following commands.

    \startalignment[..,..] . . . \stopalignment

You can optionally specify the stretch tolerance and the vertical and
horizontal direction.

    \setuptolerance[..,..]

Some ``\setuptolerance`` Command Options.

In columns you could specify the tolerance as following.

    \setuptolerance[horizontal,verytolerant]

Horizontal and vertical alignment can be setup with the \setupalign command.

    \setupalign[..,..] 

Following are reserved words that can be placed into the first argument.

```list
+ width
+ left
+ right
+ middle
+ broad
+ line
```

# Fonts and Font Switches

The default font type in ConTEXt is Computer Modern Roman (CMR). You can also
use the Lucinda Bright font family. Many of the font types of the American
Mathematical Society (AMS), but also PostScript (pos) such as Times fonts can
be used. Fonts can be installed using the ‘texfont.pl’ Perl script which can
generate the font metrics needed. In ConTEXt there are four ways to switch
fonts.

```list
1. A complete font change (\setupbodyfont, \switchtobodyfont).
2. Font size (\tfa, tfb, etc.)
3. Font style (\rm, \ss, etc.)
4. Alternative font style (\bold, \sans, etc.)
```

If you want an overview of the available font family, you can type

    \showbodyfont[cmr]

This command will show a table with all font variations of the CMR font family. 

[ Defining the Body Font at the Beginning of the Document. ]
The ``\setupbodyfont`` command is used in the setup area of the input file to select the font family,
style and size for a document. The following example would set at the setup area the font type for the
document at sans serif at a size of 9 points.

    \setupbodyfont[sansserif,9pt]
    \starttext
    This is a text in sans-serif.
    \stoptext

The ``\setupbodyfont`` command has the following general syntax.

    \setupbodyfont[..,..,..]

The command has a single argument that can contain a list of keywords.
Following shows some of the keywords for this command.

    sansserif
    palatino
    ber
    10pt

The following example specifies that you want to use the Karl Berry fontnames.

    \setupbodyfont[ber,phv,ss]
    \starttext
    This is a text in sans-serif.
    \stoptext

With phv you specify that you want to load the Helvetica font definitions, and
with ss you specify that you want to use a sans-serif font as the body font. To
use the default postscript font Times, Helvetica and Courier, use

    \setupbodyfont[ber,pos]
    \starttext
    This is a text in Times.
    \stoptext

[ Defining the Body Font in the Middle of the Document. ]

The ``\switchtobodyfont`` command is used for changes mid-document and at
section level. The command has the following general syntax.

    \switchtobodyfont[..,..,..]

The command has a single argument that can contain several keyword options. The
following example starts with sans serif font type at 9 points and in the
middle of the document, it changes to Palatino font type at 8 points.

    \setupbodyfont[sansserif,9pt]
    \starttext
    This text will be rendered in the document 9 point sans serif.
    \switchtobodyfont[palatino,8pt]
    This text will be rendered in the document 8 point palatino.
    \stoptext

Font sizes are available from 4pt to 12pt. 

[  Style and Size Switches in Commands. ]
In a number of commands you can optionally specify style switches to obtain the
desired typeface, for example

    \setuphead[chapter][style=\boldslanted]

You can also use size switches to change the typestyle inside a group, for
example

    \setuphead[chapter][style=\tfd]
    
Following shows some of the available typeface switch options, typestyle
options shall be explained later in this chapter. 

    \normal
    \bold
    \boldslanted
    \bolditalic
    \small
    \smallbold
    \smallboldslanted
    \smallbolditalic
    \sans
    \sansbold
    \slanted
    \slantedbold
    \italicbold
    \smallnormal
    \smallslanted 
    \smallslantedbold
    \smallitalicbold
    \sansserif
    \smallcaps

You can either use those as style or size switches inside a group, or as a font
changing command that takes an argument, for example

    This is {\bold some bold text} but \bold{this text is bold} too.

The result on the document is the same. 

The font switch is used to change the local font setting, for example

    There is some {\em emphasized text} in this line.

The switch influences everything in its group. Notice how curly braces are used
to keep font switching local.

In running local text, the inline typeface can be changed into some other
typeface. The following example shows how text is changed to slanted inside
curly braces with the \sl command.  

    This {\sl text} is slanted.

```list
+ \sl 
  slanted
+ \it 
  italic
+ \bf 
  bold 
```

In running local text, the inline typestyle can be changed into some other
typestyle. The following example shows how some typestyle is changed inside
curly braces with the \tfc command.

  This {\tfc text} will be rendered in another typestyle. 

Following are addtional options.

```list
+ \tfxx 
  somewhat smaller then \tfx
+ \tfx 
  somewhat smaller then \ft
+ \tf 
  actual style
+ \tfa 
  somewhat greater then \tf
+ \tfb 
  somewhat greater then \tfa
+ \tfc 
  somewhat greater then \tfb
+ \tfd 
  somewhat greater then \tfc 
```

The actual typestyle is indicated with \tf. If you want to switch to a somewhat
greater size, you can type \tfa, \tfb, \tfc or \tfd.

In running local text, the inline fontstyle can be changed locally into some
other fontstyle. The following example shows how some text is changed to
teletype fontstyle inside curly braces with the \tt command.

    The {\tt text} will be rendered in teletype fontstyle. 

Following are addtional options.

```list
+ \rm
+ \ss
+ tt
```

[ Changing and Combining Local Typeface and Typestyle. ]
It is also possible to combine a typeface and a typestyle. An addition of a, b,
c or d to \sl, \it or \bf is also allowed. like at the following example where
the commands \sl and \tfb are combined to the \slb command that renders the
inline text both slanted and in a somewhat greater size. The following example
will demonstrate the effect.

    The {\slb text } will be rendered in another typeface and typestyle.

Similarly, the combined commands \slc and \sld can be used. 

[ Redefining the Body Font. ]
For special purposes you can define your own font size using the
\definebodyfont command, which has the following general syntax.

    \definebodyfont[size][style][options]

In the example below we will define the body font to be Roman at 9 points.

    \definebodyfont[9pt][rm][tfe=cmr12 at 24pt]{\tfe Some Text}

Additionally we redefine the \tfe command as a Computer Modern Roman font at 24
points. 

[ Emphasized Text. ]
The command \em is used to emphasize text consistently throughout the document as the following
example illustrates.

    This {\em text } is emphasized. 
    
    This {\bf \em text} is both boldfaced and emphasized. 

Emphasized words appear in either slanted or italic style. An emphasize within
an already emphasized environment will result in normal print again, so some
kind of contrast will be ensured.

[ Small Caps. ]
Many acronyms are printed in small capitals. In ConTEXt there are two types of
small capitcals, real small caps and pseudo small caps. Real small caps are
somewhat smaller than the capital of the actual bodyfont and are created with
the {\sc...} command. Pseudo small caps are more intelligent since they adapt
to the surrounding text and are created with the {\cap...} command.

    This {\sc text} is in real small caps.

    This {\cap text} is in pseudo small caps. 

The reason for using pseudo small caps instead of real small caps is not just a
matter of taste. 

[ Block Quotations. ]
The ``\startquotation`` and ``\stopquotation`` command pair creates quotations.

    \startquotation
    This is a quotation.
    \stopquotation

The ``\startquotation`` command creates the quotation and the
``/stopquotation`` command closes off the quotation. 

[ Inline Quotes. ]
ConTEXt also has inline quotes that can be created with either the ``\quote``
or ``\quotation`` commands.

    This \quote{text} is single quoted.

    This \quotation{text} is double quoted.

The ``\quote`` command surrounds the quote with single quote characters. The
``\quotation`` command surrounds the quote with double quote characters. 

[ Verbatim Text. ]
Text that is not subject to macro expansion is created with the
``\starttyping`` command and is closed off wit the ``\stoptyping`` command. The
text inside this command pair will appear exactly as typed, meaning it will
display typed text and the output will reflect the line breaks as the appear in
the input.

    \starttyping
    This is verbatim text in ConTEXt that is not 
    subject to macro expansion.
    \stoptyping

The text will be displayed with a monospace font such as for example Courier or
Courier New.

[ Inline Verbatim Text. ]
The ``\type`` command is used for inline verbatim. The curly braces enclose the
text that you want to type verbatim.  Be careful with the ``\type`` command since
it will temporarily disable th eline breaking mechanism. 

    This \type{text} is verbatim.

[ Block Text Colors. ]
The ``\setupcolor`` command activates the use of red, green and blue colored
text and the ``\startcolor`` and ``\stopcolor`` command pair specifiy the
colored text section.

    \setupcolor[state=start]
    \startcolor[red]
    This text will be rendered red in the document.
    \stopcolor

[ Inline Colored Text. ]
The ``\color`` command is used for coloring text inline.

    \setupcolor[state=start]
    This \color[green]{text} is green.

    \setupcolor[state=start]
    \startcolor[red]
    This text will be rendered red and this 
    \color[green]{text} is green.
    \stopcolor

On a black and white printer you will see only grey shades. 

[ Background Text. ]
In order to emphasize a section, you can use backgrounds with the
``\startbackground`` and ``\stopbackground`` command pair as the following
example illustrates.

    \setupbackgrounds[background=screen,corner=round]
    \startbackground
    This text has a background with round corners.
    \stopbackground

The ``\setupbackgrounds`` command is used to set some values for the
background. The background command has the following general syntax.

    \setupbackgrounds[..,..=..,..]

```list
+ background
  It can be set to 'screen', or a color.
+ corner
  It can be set to 'round'.
+ page
+ text
+ backgroundcolor
```

# Typesetting Multiline Math

The multi-line math can be typeset using the native `\\displaylines`` command,
which must appear inside a math mode.

    $$
    \displaylines{x = \sqrt{1}+\sqrt{2} \cr
    y = \sqrt{2} + \sqrt{3} \cr
    z = \sqrt{3} + \sqrt{4}}
    $$

The ``\startmathalignment`` command can also be used, but this would have to be
placed between the "formula" environment which is a CONTEX-based environment,
not TEX-based. One of the advantages of using ``\startmathalignment`` is that
it allows multiline math equations to be aligned at the equal-sign of each
line.

    \startformula{\startmathalignment[n=2]
    \NC x \NC = \sqrt {2} + \sqrt {3} \NR
    \NC  \NC = \sqrt {2} + \sqrt {3} \NR
    \NC  \NC = \sqrt {2} + \sqrt {3} \NR
    \NC  \NR
    \stopmathalignment}\stopformula

# Typesetting a Wrapfigure

The ``\placefigure`` command can be used to typeset a figure that is
to appear on the left or right hand side of the page, with text
flowing around it. Following is an example of typesetting a figure
named "Logo" which is to appear on the left hand side of the page.

    \placefigure
      [left]
      [fig:logo]
      {This is an example of a logo.}
      {\externalfigure[Logo]}

# Using "\hbox"

You should wrap TikZ graphics inside ``\hbox`` when placing them, for example:

    \placefigure[here][fig:myfig]{My figure.}{\hbox{\starttikzpicture
      \draw (0, 0) circle (3cm);
    \stoptikzpicture}}

# The "\dontleavehmode" Madness

The "\dontleavehmode" is needed if multiple images are to be placed side by
side.  For instance, if two image is placed inside a ``\hbox``, and the first
image is to appear as the first item of a paragraph, then the two images 
are to be stacked on top of each other if "\dontleavehmode" is not placed
at the beginning of the paragraph.

     \dontleavehmode
     \hbox{\externalfigure[image-clock.png]}
     \hbox{\externalfigure[image-clock.png]}

Without this command the images maybe placed one on top of each other. This is
especially true when the paragraph starts with an image instead of 
a regular text.
    
     \hbox{\externalfigure[image-clock.png]}
     \hbox{\externalfigure[image-clock.png]}

Strangely, if the paragraph starts with a text then this command is not necessary
because images are to be shown side by side.

     The images are: \hbox{\externalfigure[image-clock.png]}
     \hbox{\externalfigure[image-clock.png]}

The "\dontleavehmode" command should be used judicially, as placing it in front of
some other command can cause an extra vertical space to be generated. For instance,
the following example would have caused the extra vertical space to be generated
before "\placefigure".

    \dontleavehmode
    \placefigure[right,none][]{}{\externalfigure{image-clock.png}}

For this reason, the "float_to_paragraph()" method has been implemented such that
it would check the return value of "untext()", which could be calling one of the
"fence_to_xxx" method, and return a "\externalfigure", or "\startMPcode" command.
Both of which are to typeset an image. However, it has been observed that 
the "\startMPcode" command at the beginning of a paragraph does not allow it
to have the normal "whitespace" placed between itself and the paragraph before it.
To fix it the solution is to place a "\dontleavehmode" command placed immediate
before it.

# Typescript

A TypeScript (as opposed to a font) contains font definitions for the
individual font styles (regular, sans, math, etc. and bold, italic, bolditalic,
etc.).

I can list all the fonts with mtxrun --script fonts --list --all --pattern=*.
But since \setupbodyfont[my-typescript] takes a TypeScript and not a font, I
would like to know the installed TypeScripts.

Default TypeScripts can be found in the type-imp-* files in the directory
tex/texmf-context/tex/context/base/ (relative to the ConTeXt installation
directory).

If you installed TeX on a Mac with TexLive 2013, you can list them as such:

    ls /usr/local/texlive/2013/texmf-dist/tex/context/base/type-imp-*

and used in \setupbodyfont[my-typescript] without the type-imp- prefix.

Furthermore there are TypeScripts which ship as third party modules. These can
be found in "tex/context/third/typescripts/", or
"texlive/2017/texmf-dist/tex/context/fonts/mkiv/"


# Merge Cells In a Row in "starttable"

The "\use2" command in the following "startable" example shows how
to use this command to merge two adjacent cells in a single table row
into creating a single table cell that occupies the spaces of the second
and third column.

    \placetable{Opening hours library.}
    \starttable[|l|c|c|]
    \HL
    \VL \bf Day   \VL \use2 \bf \Opening hours          \VL\SR
    \HL
    \VL Monday    \VL 14.00 -- 17.30 \VL 18.30 -- 20.30 \VL\FR
    \VL Tuesday   \VL                \VL                \VL\MR
    \VL Wednesday \VL 10.00 -- 12.00 \VL 14.00 -- 17.30 \VL\MR
    \VL Thursday  \VL 14.00 -- 17.30 \VL 18.30 -- 20.30 \VL\MR
    \VL Friday    \VL 14.00 -- 17.30 \VL                \VL\MR
    \VL Saturday  \VL 10.00 -- 12.30 \VL                \VL\LR
    \HL
    \stoptable


# The Chemical Symbol Formulas

CONTEX is relying on the PICTEX macros of M.J. Wichura to draw this kind of
structures. Though the chemical module consists of only two or three commands,
it takes some practice to get the right results. This is how the input looks:

    \placeformula[-]
    \startformula
    \startchemical[scale=small,width=fit,top=3000,bottom=3000]
      \chemical[SIX,SB2356,DB14,Z2346,SR3,RZ3,-SR6,+SR6,-RZ6,+RZ6]
               [C,N,C,C,H,H,H]
      \chemical[PB:Z1,ONE,Z0,DIR8,Z0,SB24,DB7,Z27,PE][C,C,CH_3,O]
      \chemical[PB:Z5,ONE,Z0,DIR6,Z0,SB24,DB7,Z47,PE][C,C,H_3C,O]
      \chemical[SR24,RZ24][CH_3,H_3C]
      \bottext{Compound A}
    \stopchemical
    \stopformula



# Fontstyle and Size

You select the font family, style and size for document with:

    \setupcorps[..., ..., ...]

Type \setupcorps[sansserif,9pt] in the setup area. 
For changes in the mid-document and on paragraph level you should use:

    \switchtocorps[..., ..., ...]

Following is an example of what an CONTEX document should look like:

  On November 10th (one day before Saint Martensday) the youth of
  Hasselt go from door to door to sing a special song and they
  accompany themselves with a {\em foekepot}. And they won’t go away
  before you give them some money or sweets. The song goes like this:
  \startnarrower
  \switchtocorps[lbr,10pt]
  \startlines
  Foekepotterij, foekepotterij,
  Geef mij een centje dan ga’k voorbij.
  Geef mij een alfje dan blijf ik staan,
  ’k Zak nog liever naar m’n arrenmoeder gaan.
  Hier woont zo’n rieke man, die zo vulle gèven kan.
  Gèf wat, old wat, gèf die arme stumpers wat,
  ’k Eb zo lange met de foekepot elopen.
  ’k Eb gien geld om brood te kopen.
  Foekepotterij, foekepotterij,
  Geef mij een centje dan ga’k voorbij.
  \stoplines
  \stopnarrower

You should notice that \startnarrower · · · \stopnarrower is also used as a
begin and end of the fontswitch. The function of \startlines and \stoplines in
this example is obvious.

If you want an overview of the available font family you can type:

    \showcorps[cmr]

This should've generated a table in your PDF that looks like the following

    +---------------------------------+
    |          [cmr]                  |
    +---------------------------------+
    |   |\tf|\sc|\sl|\it| ....        |
    +---------------------------------+
    |\rm|Ag |Ag |Ag |Ag | ....        |
    |\ss|Ag |Ag |Ag |Ag | ....        |
    |\tt|Ag |Ag |Ag |Ag | ....        |
    +---------------------------------+

For many commands one of its parameters is called "character" and it is
designed to hold a value that describes the desired typestyle for that command.
For example, the \setuphead command has a parameter called "character" that can
be set to a command that describes the font size used for that section head.

    \setuphead[chapter][character=\tfd]

In this case the character size for chapters is indicated with a command \tfd.
But instead of a command you could use the predefined options that are related
to the actual typeface:

    normal  bold  slanted  boldslanted  type  mediaeval
    small  smallbold  smallslanted  smallboldslanted smalltype
    capital cap

In the running text (local) you can change the typestyle into roman, sans serif
and teletype with \rm, \ss and \tt.

You can change the typeface like italic and boldface with \sl and \bf.

The typesize is available from 4pt to 12pt and is changed with \switchtocorps.

The actual style is indicated with \tf. If you want to change into a somewhat
greater size you can type \tfa, \tfb, \tfc and \tfd. An addition of a, b, c and
d to \sl, \it and \bf is also allowed.

    {\tfc Mintage}
    In the period from {\tt 1404} till {\tt 1585} Hasselt had its own
    {\sl right of coinage}. This right was challenged by other cities,
    but the {\switchtocorps[7pt] bishops of Utrecht} did not honour these
    {\slb protests}.

The curly braces indicate begin and end of style or size switches.

The \definecorps command allows you to create new font switch command that
serves to capture several font related settings such as font styles, sizes and
family, and with which you can change them all at once.

   \definecorps[..,.1.,..][.2.][..,..=..,..]

A definition could look like this:

  \definecorps[12pt][rm][tfe=cmr12 at 48pt]
  {\tfe Hasselt}

Now \tfe will produce 48pt characters in the cmr font. Hasselt

[ Small Caps. ] 
Abbreviations like PDF (Portable Document Format) are printed in pseudo small
caps. A small capital is somewhat smaller than the capital of the actual
typeface. Pseudo small caps are produced with:

    \kap{}

If you compare following three different inputs:

  PDF 
  \kap{PDF} 
  {\sc PDF}

You will see that the command \sc shows the real small caps. The reason for
using pseudo small caps instead of real small caps is just a matter of taste.

[ Emphasized Text. ]
To emphasize words consistently throughout your document you use:

\em

Following is an example:

  If you walk through Hasselt you should {\bf \em watch out} for {\em
  Amsterdammers}. An {\em Amsterdammer} is {\bf \em not} a person from
  Amsterdam but a little stone pilar used to separate sidewalk and
  road. A pedestrian should be protected by these {\em Amsterdammers}
  against cars but more often people get hurt from tripping over them.

Empasized words appear in a slanted style.  However, a nested emphasize word
within an already emphasize paragraph is show using normal font again. 

[ Teletyped Text. ]
If you want to display typed text and want to keep your line breaking exactly
as it is you use

   \starttyping ... \stoptyping

In the text you can use:

    \type{...}

The curly braces enclose the text you want in teletype. You have to be careful
with \type because the line breaking mechanism is not working anymore.

You can set up the ’typing’ with following two commands:

    \setuptyping[]
    \setuptype[]



# Accents

An accent can be added on top of a letter. Following are commands in CONTEX that
allows an accent to be added. (All examples use letter u as the base)

    \`{u}        \u{u}
    \'{u}        \v{u}
    \^{u}        \H{u}
    \"{u}        \t{u}
    \~{u}        \c{u}
    \={u}        \d{u}
    \.{u}        \b{u}

Following are for adding double-top-dots for a dotless-i and a hat for a dotless-j.

    \"{\i}
    \^{\j}


# Foreign Symbols

CONTEX includes several commands that allows for input of some symbols that 
are part of non-English alphabets.

    \oe         \O
    \OE         \l
    \ae         \L
    \AE         \SS
    \aa         ?`
    \AA         !`
    \o         



# Vertical Spacing Between Paragraphs

The vertical spacing between paragraphs can be specified by:

    \setupwhitespace[...]

This document is produced with 

    \setupwhitespace[small]   
    \setupwhitespace[middle]   
    \setupwhitespace[big]   
    
When a paragraph consists of a horizontal line or a table there is a small
problem that must be corrected. For that purpose you could carry out a
correction with:

      \startlinecorrection
      \starttable[|l|l|]
      \HL
      \NC \bf City \NC \bf Area code \NC\SR
      \HL
      \NC  Hasselt \NC 8060 -- 8065 \NC\SR
      \HL
      \stoptable
      \stoplinecorrection

Another command to deal with vertical spacing is:

    \blank[..,...,..]

The bracket pair is optional and within the bracket pair you can type the
amount of spacing. Keywords like small, middle and big are related to the
fontsize.

    In official writings Hasselt always has the affix Ov. This is an
    abbrevation for the province of {\em Overijssel}.
    \blank[2*big]
    The funny thing is that there is no other Hasselt in the Netherlands.
    So it is redundant.
    \blank
    The affix is a leftover from the times that the Netherlands and
    Belgium were one country under the reign of King Philip II of Spain.
    \blank[2*big]
    Hasselt in Belgium lies in the province of Limburg. One wonders if
    the Belgian people write Hasselt (Li) on their letters.

The command \blank when issued without the bracket pair is to generate a
vertical space that agrees with the current settings of the \setupwhitespace.

The \startpacked and \stoppacked commands can be used to temporarily suppress
inter-paragraph spacing. For instance, in the example below the second part of the
paragraph would have had two lines which are packed close together, whilst the
first two lines will have visible vertical spaces between them

    \defineparagraphs[city][n=2,before=,after=]

    \city Hasselt (Ov) \\ Overijssel \\
    \city Hasselt (Li) \\ Limburg    \\

    \startpacked
    \city Hasselt (Ov) \\ The Netherlands \\
    \city Hasselt (Li) \\ Belgium
    \stoppacked

The \startunpacked and \stopunpacked commands are for doing the opposite.

The \blank command would have only generated enough vertical spaces between
paragraphs, and won't go over it if two or more of the same \blank commands are
found to appear one after another.  However, the command \godown[] would have
forced the downward spacing to be generated regardless.



# Define Your Own Command

A new command can be created that accept any number of arguments.
For instance, a new command named \myputfugure can be created that
can be used such as

    \define[3]\myputfigure%
      {\placefigure[here,force]
      [fig:#1]
      {#2}
      {\externalfigure[#3][type=tif,width=5cm,frame=on]}}

After this command is defined this way, anytime a command such as the following
appear inside a CONTEX document:

    \myputfigure{lion}{The Dutch lion is a sentry.}{hass13g}

It would have been translated into the following command instead:

    {\placefigure[here,force]
    [fig:lion]
    {The Dutch lion is a sentry.}
    {\externalfigure[hass13g][type=tif,width=5cm,frame=on]}}

A custom start/stop command pair can be created as well. Doing this requires
the command of 

    \definestartstop[...][...,..=..,...]

For instance:

    \definestartstop
      [stars]
      [commandos={\inleft{\hbox to
                  \leftmarginwidth{\leaders\hbox{$\star$}\hfill}}},
       before=\blank,
       after=\blank]

A new float can also be created by using the command

    \definefloat[.1.][.2.]

The bracket pairs are used for the name in singular and plural form. For 
example:

    \definefloat[intermezzo][intermezzos]

Now the following commands are available:

    \placeintermezzo[][]{}{}
    \startintermezzotext ... \stopintermezzotext
    \placelistofintermezzos
    \completelistofintermezzos

The newly defined floating block can be set up with:

    \setupfloat[...][..,..=..,=..]
    \setupfloats[..,..=..,..]
    \setupcaption[...],[..,..=..,..]

These commands are typed in the setup area and will have a global
effect on all subsequent floating blocks. Following is an example,
that shows the defining of a new float named "intermezzo". The 
caption will be 

    \setupfloats[place=middle]
    \setupcaption[place=bottom,headstyle=boldslanted]
    \placeintermezzo[][]{An intermezzo.}
    \startframedtext
    At the beginning of this century there was a tramline from Zwolle to
    Blokzijl via Hasselt. Other means of transport became more important
    and just before the second world war the tramline was stopped.
    Nowadays such a tramline would have been become very profitable.
    \stopframedtext



# METAFUN Draw External PNG

Following is a METAFUN command to draw an external image inside a 
METAFUN Picture and scale it so that its width is exactly 10mm
and its lower-left hand corner is at (10mm,10mm).

    picture p; p := externalfigure "image-gimp.jpg";
    draw p scaled (10mm/bbwidth(p)) shifted (10mm,10mm);



