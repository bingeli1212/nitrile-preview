---
title: NITRILE Translation
---


# Numbered section headings

The number headings are detected by the presence of hash-marks 
at the first of the line of a paragraph.

    # Introduction
    ## Introduction
    ### Introduction

Only the previous three different kind of sections are supported.
When being translated, each of them corresponds to a section, subsection,
or subsubsection.


# Un-numbered section headings

Un-numbered section headings are recognized by the presence of a pair of
matching square brackets. 

    [ Regex. ]
    The `Regex` class is for expressing a regular expression.

    [ Math. ]
    The `Math` class is for grouping a collection of 
    math functions and constants.

Each un-numbered section heading is also capable of holding extra body texts.
Previous ones are level-1 un-numbered section headings.  They are similar to
`\paragraph`. Following are level-2 un-numbered headings, and they are similar
to `\subparagraph` commands in LATEX.

    [[ Regex. ]]
    The `Regex` class is for expressing a regular expression.

    [[ Math. ]]
    The `Math` class is for grouping a collection of 
    math functions and constants.


# Bundles

Bundles are those paragraphs fenced by triple backquotes.
Following are the signature IDs for the bundles.

- FML
- INK
- DIA
- TAB
- PAR
- VTM

[ The FML bundle. ]
This bundle is to typeset a multiline formula, with possibly 
alignment at the place of an equal-sign or other places.
Note that it is not required that the formula be center-aligned.
Current HTML/LATEX/CONTEX have been implemented such that it is
left-aligned.

[ The INK bundle. ]
This bundle is to crreate a picture holding only textual contents. 
The bundle is very much like a "vtm" bundle except the result is a picture, 
which makes it ideal for it to hold text with longer lines and still be 
able to be scaled to a given width/height.

    ```ink{viewport:10 10 5,width:30}
    #include<stdio>
    int main(){
      return 0;
    }
    ```

The "viewport" attribute determines the viewport size, and the resulting
is a picture of this size. The first two item is the width/height, and the
third one is the size unit. The last one by default a 5mm, thus, a 
"viewport" of "10 10 5" would result in a picture of 50mm-by-50mm in size.

The text is always set in 10pt and in monospace style fonts. 
Thus, a larger viewport size holds more text.

The "width" and "height" attributes can be used to scale
up/down the image that has been set to the size of the viewport.
These attributes are pure number always assumed in the unit of mm.  When width/height are not present the size will be resized as such,
or when only width or height is present then the other is automatically
set to the one that matches to the viewport aspect ratio. If they
are not present the size is the same as the viewport.

The "frame" attribute allows it to have a border.


[ The "dia" bundle. ]
This bundle builds a vector image such as SVG, Tikz, and or MetaFun.

    ```dia{viewport:10 10,width:30}
    \drawline (0,0) (10,10)
    \drawline (0,10) (10,0)
    ```

The "viewport", "width", and "height" attributes work in the same manner
as those of the "ink" bundle. The "dia" bundle accept inside a list of 
commands. These commands are documented by "DOC-nitrile-diagram.md" file.

The "frame" attribute allows it to have a border.


[ The TAB bundle. ]
This bundle is to typeset a tabular. 

    ```tab{head}
    Name \\ Addr.
    John \\ 301 Sun Dr.
    James \\ 401 Sun Dr.
    Jane \\ 501 Sun Dr.
    Mary \\ 601 Sun Dr.
    Martin \\ 701 Sun Dr.
    ```
    
The "head" attribute above expresses that the first row is header,
which will likely be set to bold and treated differently than other
rows in many other situations. Another similar attribute is "side",
which states that the first column is to be treated as containing
the header information for that row. 

Having a "head" attribute can make a difference in the presence of a "hew"
attribute. The "hew" attribute is designed to split a long table into two or more
parallel sections so that the table will become shorter and fatter.

    ```tab{head,hew:2}
    Name \\ Addr.
    John \\ 301 Sun Dr.
    James \\ 401 Sun Dr.
    Jane \\ 501 Sun Dr.
    Mary \\ 601 Sun Dr.
    Martin \\ 701 Sun Dr.
    ```

In the previous example the first three lines will be placed at the left-hand
side and the last two lines at the right-hand side, while the header is to
appear on top of both: the resulting tabular looks like it has four columns
and four rows.

There are also additional attributes: for instance, the "frame" attribute is
used to set if the tabular is to have a border placed around it. When set to
"1" or "box", the border is to be had on all four side, whilst if set to
"hsides" then only the top/bottom sides are to have the border. 

The "rules" attribute determines if vertical/horizontal rules are to appear
between rows/columns.  When set to "all", all rules are to appear between
rows/columns.  If set to "rows", only the rules between rows are to appear. If
set to "cols", only rules between columns are to appear. If set to "groups",
only the rules betweem the header and the first line of body row is to appear,
given the fact that the "head" attribute is set, or the vertical rules between
the first column and the second column is to appear if the "side" attribute is
set, or both if both attributes are set.

The "textalign" is to be expected a list of alignment options, such as "l r l",
which states that the first/third column is to be aligned left, and second
column aligned right. The "p25", "p30", etc, can also be one of the options
which states that a column is to have a paragraph with lines wrapped around.
The number after the letter "p" expresses the width of the column in mm.

The "fontsize" is to be set to a string expressing the size of the font.
Currently only the value "small" is accepted, and all other value will be
ignored. In the case of "small", all texts will be shown by a "smaller" version
of the body font.

The "fontstyle" is to be expected a list each of which expressing a font style
for the corresponding column. For instance, "fontstyle:t t r" is to set it so that the
first two columns are to be set in the style of monospaced text, and last one
the roman(default) text. The letters are: t(monospaced), i(italic), b(bold), 
s(slanted), and r(default) fonts.

The "vrules" and "hrules" attributes are designed to manually insert
vertical/horizontal rules between rows and columns. Note these two attribuets
are only to take affect when the "rules" attribute is not set, otherwise they
will be ignored. Each of these two attributes is to be expected a list of
integers, where an integer of "1" expressing the appearance of a
vertical/horizontal rule between the first and second column/row, and "2" for
the rule between the second/third column/row. Thus, "vrules:2 4" is to insert a
vertical rule between second/third columns, and another one between the
fourth/fifth columns.

The "direction" attribute influences how the input contents are to be
interpreted.  By default input contents are interpreted such a way that each
line contains the entire row of the tabular, 
and tabular data are to be found at the beginning, end, or between two double-backslash.
However, if "direction:row" is set, then the input contents are to be expected
to be arranged in such a way that, a double-backslash by itself starts a new row,
and each table data is to be started in its own line starting by a ampersand.
Following is an example that replicated the same table as the one before.

    ```tab{direction:row,head}
    \\
    & Name 
    & Addr.
    \\
    & John 
    & 301 Sun Dr.
    \\
    & James 
    & 401 Sun Dr.
    \\
    & Jane 
    & 501 Sun Dr.
    \\
    & Mary 
    & 601 Sun Dr.
    \\
    & Martin 
    & 701 Sun Dr.
    ```

If "direction:column" is set, then the table is to be built in similar way as
that of "direction:row", except for the fact that instead of filling out rows
one-by-one, it is to fill out columns one-by-one.

    ```tab{direction:column,head}
    \\
    & Name 
    & John 
    & James 
    & Jane 
    & Mary 
    & Martin 
    \\
    & Addr.
    & 301 Sun Dr.
    & 401 Sun Dr.
    & 501 Sun Dr.
    & 601 Sun Dr.
    & 701 Sun Dr.
    ```

[ The PAR bundle. ]
This bundle is designed to typeset a text box.   
It allows for the possibility such that this paragraph
is able to have its own text alignment, font size, and font style.
The "width" attribute can also be used to manually set it to a given
width, otherwise it is assumed to be as wide as the paragraph.

    ```par
    Hello world!\\
    Hello universe!\\
    Hello people!
    ```

The end-of-line-double-backslash is used to manually break the line
into multiple-lines.


[ The VTM bundle. ]
The VTM bundle typesets a verbatim box.



# Un-fenced blocks     

Un-fenced blocks are those that are not fenced by
triple-backquotes. Following are the signatures IDs
for these blocks.  

- "itemize"
- "example"
- "verbatim"
- "record"
- "primary"
- "secondary"
- "lines"
- "figure"
- "table"
- "columns"
- "listing"
- "equation"
- "body"
- "flushleft"
- "center"
- "page"
- "vspace"


[ The "itemize" block. ]
The PLST un-fenced block is recognized by the presence of a hyphen/plus/asterisk
character at the start of the first line. This block models
lists and nested lists. Hyphens are for expresssing unordered list items.

    - Fruits
      - Apple
      - Pear
    - Dairy
      - Cheese
      - Milk
    - Bread
    - Nuts 

The asterisks are for ordered list items.

    * First step, ...
    * Next step, ...
    * Final step, ...
    
The plus-signs are for expressing description list items, such
that everything after the plus-sign is the data term, and the 
lines that follow(s) are descriptions.

    + Apple
      A wonderful fruit.
    + Pear
      Another wonderful fruit.

However, in the case where there is any description lines detected, and the
lines after the plus-sign follows one of the following patterns, then 
it becomes an unordered list with a non-breakable space separating
the data term and data description.
item is in the following forms, then it becomes a unordered list.
Following are all the patterns.    

    + `ltr`       The text direction is left-to-right.
    + `rtl`       The text direction is right-to-left.
    + `inherit`   The text direction is inherited from the Canvas element or others.

    + *ltr*       The text direction is left-to-right.
    + *rtl*       The text direction is right-to-left.
    + *inherit*   The text direction is inherited from the Canvas element or others.

    + "ltr"       The text direction is left-to-right.
    + "rtl"       The text direction is right-to-left.
    + "inherit"   The text direction is inherited from the Canvas element or others.

    + 'ltr'       The text direction is left-to-right.
    + 'rtl'       The text direction is right-to-left.
    + 'inherit'   The text direction is inherited from the Canvas element or others.

The first pattern would typeset the data terms in monospaced fonts; the second
form in italic, the third one with quotation marks, and the third one in plaintext.
All of them will also be shown in bold fontface.             


[ The "lines" block. ] 
This block is recognized by the presence of vertical-bar and a follow-on 
space at the start of
the first line.  Each additional line will be scanned for this pattern, and will
start a new line if detected; otherwise it is the continuation of the previous line.
If there are additional leading spaces following the vertical-bar and the space immediately
after it, these spaces are preserved. Spaces between characters are collapsed.

    | All human are mortal.
    | Socrates is a human.
    | Socrates is mortal.

In addition, if the first character is a dollar-sign followed by at least
one space at the first line. Each additional line will be checked for the
presence of the same pattern, and if detected is to start a new line, otherwise
it is the continuation of the previous line. 
The output is so that all lines are center aligned.

    $ Hello!          
    $ Good morning!       
    $ Good evening!       


[ The "example" block. ] 
This block is recognized by the presence of less-than-sign followed by at least
one space at the first line. All lines with the similar pattern will be considered
to start a new line, and others are the continuation of the previous line.
The output is so that all lines are left aligned with a visible left margin.

    > Hello!          
    > Good morning!       
    > Good evening!       


[ The "verbatim" block. ]
This block is recognized when the first line is to start with four spaces.
The output of this block is a verbatim
text where each line starts on its own and white spaces preserved. Text will
be shown using fixed-width fonts. The four spaces of each line are to be
removed from the output regardless.

Alternatively, lines starting with '~ ' at the first line will be recognized
as also starting a "verbatim" block where the first two characters of each
linea are to be removed from the output regardless.


[ The "record" block. ]
This block is recognized if the first line is to start with a number followed
immediately by a right parenthesis.  This block is assumed to represent a
single ordered list item where the number represents the bullet. In addition,
this block is assumed to have child paragraphs where each child paragraph
is a paragraph of this item, such that there will be visible vertical spaces
inserted between them. The child paragraphs are detected whenever a double-backslash
is detected in a line by itself.   In the following example there are
two child paragraphs for the "Step 1", and no child paragraphs for "Step 2".        

    1) Step 1, check the temparature:
    \\
    If the temperature is greater than 10, add this ingredient.
    \\
    Otherwise, add this ingredient.

    2) Step 2, bring it to a boil, and taste it see if additional 
    salt is needed.      

Note that all child paragraphs are treated as normal paragraphs with
no particular layout assumptions. 


[ The "primary" block. ]
This block is recognized by the presence of a matching pair of square brackets
at the first line.

[ The "secondary" block. ]
This block is recognized by the presence of two matching pair of square brackets
at the first line.


[ The "figure" block. ]
This block is recognized by the presence of ".figure" at the first line.         

[ The "table" block. ]
This block is recognized by the presence of ".table" at the first line.         

[ The "columns" block. ]
This block is recognized by the presence of ".columns" at the first line.         

[ The "equation" block. ]
This block is recognized by the presence of ".equation" at the first line.         

[ The "listing" block. ]
This block is recognized by the presence of ".listing" at the first line.         

[ The "page" block. ]
This block is recognized by the presence of ".page" at the first line.         

[ The "vspace" block. ]
This block is recognized by the presence of ".vspace" at the first line.         

[ The "body" block. ]
This block represents a normal paragraph.  For some translations the first line
of this paragraph is likely to have some visible indentation except for the situation
where this line is the first line after a sectional heading.



# Inline Literals

Literals are text marked with some punctuations.  For instance, a pair of
double-backquote are to turn a piece of text into math literal.

    The theorem is: ``a^2 + b^2 = c^2``.

A pair of single-backquote is to mark a piece of text as verbatim literal.

    The key combination is: `CTRL-K`.

A pair of quotation marks is to mark a piece of text as quotation literal.  The
output varies based on the target translation. For LATEX the \textquote command
from "csquotes" package is used. For CONTEX the \quotation command is used.
For HTML the Q-tagname is used.

    He sayd "good morning" to me.

A pair of double-braces is to mark a piece of text as emphasis literal.

    The saying goes like this: {{a fox jumps over a lazy dog.}}

A pair of double-asterisk is to mark a piece of text as strong literal.
Note that spaces are not allowed inside this literal.

    The **text** is shown in more weight than normal.

A pair of single-asterisk is to mark a piece of text as slanted literal.
Note that spaces are not allowed inside this literal.

    The *text* is shown in slanted comparing to normal.  

Note that strong and slanted literal can appear inside quotation literal and emphasis
literal.


# Inline phrases

A text can also appear inside a form such as `&key{...}`, to become a entity phrase.
Following are recognized entity phrases.

- em
- b
- i
- u
- s
- tt
- q
- g
- high
- low
- br
- ref
- url
- link
- utfchar
- utfdata
- colorbutton
- fbox
- hrule
- img
- dia
- label

The "hrule" entity phrase is to tyepset a horizontal rule of a given size
and with optional contents. Following typesets a horizontal rule 
of length equal to 10em.

    Please enter your name: &hrule{10}

Following allows for the contents to be provided that will appear on top of the
rule of length 10em. Contents recognized by a white space within the phrase.

    Please enter your name: &hrule{10 Mark Dove}

The "dia" phrase can be used to insert an inline diagram that is similar to the
content of a DIA bundle. The content of the diagram are to come from a "paste
buffer". In the following example there is a paste buffer named "mydia"
containing the content of a DIA.

    ---
    title: My Doc
    ---
    %=mydia{viewport:5 5}
    \drawline (0,0)(5,5)
    \drawline (5,0)(0,5)
    %

Later on a paraph can be constructed as follows in which case 
an inline image will be created that holds the figure.

    The diagram is: &dia{mydia}

The "colorbutton" phrase Create a square that looks like a button
showing given color.  For instance,

    The button is &colorbutton{red}.

The "ref" phrase inserts an integer expressing a reference to an existing label.
For instance, the phrase `&ref{sect1}` would likely have inserted a number that
is "1" should label "sect1" be associated with the first section of an article.

    Please see section &ref{sect1}.

The "label" phrase Create a label that is associated with a particular section
or other composite block.     For instance, following example associated label
"sect1` with a section titled "Introduction". If this section is later on
referenced by `&ref{sect1}`, then an integer 1 could be inserted if this
section is the first section.

    # Introduction
    &label{sect1}



# CJK and custom fonts

The document may contain Unicode characters that are greater
than 0x7F. Depending on the main font, these characters may
not be shown property by the target translation, such as LATEX
and CONTEX. HTML does not have this problem.

For LATEX, there is a mechanism to detect CJK characters.
NITRILE has a builtin database regarding common CJK characters
and what language it belongs. It should be one 
of the following: JP, CN, TW, and KR. 

The goal is to recognize the continued text that belong to one language,
and thus allow for a font that is corresponding to this language to be 
selected. For example, following are Japanese characters.

    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。

Followng are simplified Chinese.
            
    冰岛由于实行高福利政策，
    所以很多人并没有存钱防老的习惯，
    银行存款占个人全部资产的比例并不多；
    此外，冰岛人投在股票、期货等金融市场上的钱也多是闲钱

Following are traditional Chinese.

    冰島由於實行高福利政策，
    所以很多人並沒有存錢防老的習慣，
    銀行存款占個人全部資產的比例並不多；
    此外，冰島人投在股票、期貨等金融市場上的錢也多是閑錢.

Each of the previous text might need to have a different font
to be shown these characters correctly. This is because
of the Han Unification effort of the Unicode, which places
CJK character in a single block, such that no single font
is to cover all characters. Thus, NITRILE need to be smart
about it, and the builtin database servers help detect
which language it is for a block of CJK characters.

For XELATEX, when a language is detected, such as JP, then it generates
the following, translation.

    {\fontspec{jp}
    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。}

For PDFLATEX, the translation is to become the following.

    \begin{CJK}{UTF8}{min}
    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。}
    \end{CJK}
    
For XELATEX, the fontspec package is to be included.

    \usepackage{fontspec}

This package is always to assume that the input file is 
UTF-8 encoded. It included several commands allowing user
to select font.

    \newfontfamily
    \defaultfontfeatures
    \setromainfont
    \setsansfont
    \setmonofont

Following are some examples.

    \newfontfamily{\jp}[Scale=0.85]{Osaka}
    \newfontfamily{\cn}[Scale=0.85]{Yuanti SC}
    \newfontfamily{\tw}[Scale=0.85]{Yuanti TC}
    \newfontfamily{\kr}[Scale=0.85]{AppleGothic}
    \XeTeXlinebreaklocale "th_TH"
    \defaultfontfeatures{Mapping=tex-text}
    \setromanfont[Mapping=tex-text]{Hoefler Text}
    \setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Gill Sans}
    \setmonofont[Scale=MatchLowercase]{Andale Mono}

The \fontspect{} command is one that allows for expressing
the font name directly. For example ``{\fontspec{jp}日本}``
is specify that a font named "jp" is to be used for showing
the text that is "日本".

NITRILE always uses the font name "jp" for Japanese text, "tw" for
traditional Chinese text, "cn" for simplied Chinese text and "kr"
for Korean text. These names are alias for other real font that
is installed in the target system, which could be different
from system to system. User would have to provide the association
to map from thiese alias to real font name by creating and placing
following ".fontspec" files in the project directory.

    jp.fontspec
    tw.fontspec
    cn.fontspec
    kr.fontspec

Each ".fontspec" file contains information telling XELATEX how to
map from a font named to a font installed on the current system.
Following is the content of a "jp.fontspec" file for MAXOSX.

    \defaultfontfeatures[jp]
    {
      UprightFont=Hiragino Mincho ProN
    }

Following are contents of a "tw.fontspec" file for MAXOSX.

    \defaultfontfeatures[tw]
    {
      UprightFont=Songti TC                
    }

Following are contents of a "cn.fontspec" file for MAXOSX.

    \defaultfontfeatures[cn]
    {
      UprightFont=STSong                
    }

Following are contents of a "kr.fontspec" file for MAXOSX.

    \defaultfontfeatures[kr]
    {
      UprightFont=AppleGothic              
    }

The "UprightFont=" entry points to a font installed by OS or by 
the current distribution of TEXLIVE. For windows these font names
might be different.

For PDFLATEX there is no need to setup these files. Instead, following
packages are to be included. 

    \usepackage[overlap,CJK]{ruby}
    \renewcommand\rubysep{0.0ex};

These package defines the following commands.

    \begin{CJK}{UTF8}{min}...\end{CJK}  % For JP

    \begin{CJK}{UTF8}{gbsn}...\end{CJK} % For CN
 
    \begin{CJK}{UTF8}{bsmi}....\end{CJK} % For TW

    \begin{CJK}{UTF8}{mj}....\end{CJK}  % For KR

For CONTEX/XELATEX translation there could be many Unicode charactesr
to be included with a document that do not necessarily have a corresponding
glyphs in the main font. Thus, these character needs to be specially
demarcated with the font with which it is suitable to be used to show
the glyph. 

For CONTEX it is 

    \switchtobodyfont[jp]{...}

For XELATEX it is

    {\fontspec{jp}...}

And "jp" is assumed to be the name of the font,
that must have been configured.


# Specify addition fonts

The four CJK fonts are "jp", "cn", "tw" and "kr".
There are also additional ten fonts that can be configured. Each one
can be configured to style a text that belongs to one of the existing 
Unicode blocks. For instance, it is pssible to set up so that font "A"
is to be applied to all texts that belong to Unicode block starting at 0x2700,
or Dingbats. Following example sets up so that the "jp" font would load
"ipaexmincho" for CONTEX, "Hiragino Mincho ProN" for XELATEX, and "ipaexmincho"
for LUALATEX translation, and in addition, the "Unifont" for all the previous
three translations for all texts of Unicode block 0x2700.

    ---
    title: My Doc
    fonts: jp{contex:ipaexmincho,xelatex:Hiragino Mincho ProN",lualatex:ipaexmincho}
           A{contex:Unifont,xelatex:Unifont,lualatex:Unifont,start:0x2700}
    ---

Thus, the text that is the following

    日本語Hello: ✍✎

Would have been translated into CONTEX as

    {\switchtobodyfont[jp]日本語}Hello: {\switchtobodyfont[A]✍✎}{\switchtobodyfont[A]□▢}

And to XELATEX and LUALATEX as

    {\jp{}日本語}Hello:{\A{}✍✎}

Note that "jp", "cn", "tw" and "kr" are font ID that are automatically applied
to texts of CJK characters without any setup from the user side. However, each
of these font ID must be linked to an installed system font in order for it to
work. By configuring the "fonts" front matter key it allows for an installed
system font to be linked to a font ID, such that the translation would create
necessary commands to link this font ID with the installed system font.
For CONTEX it is \definefontfamily, and for LUALATEX/XELATEX it is \newfontfamily
and/or \newjfontfamily.

For texts of a particular Unicode block to be applied a specific font the font
ID "A", "B", "C", "D", "C", "D", "E", "F", "G", or "H" must be used. Each of
these font ID must be linked with an installed system font in order for this
font ID to work.

    
# Frontmatter configuration parameters

Following are keys that can appear as part of the configurations

- title
- program
- peek
- fonts
- bodyfontsuit
- bodyfontsize
- bodyfontvariant
- titlepage
- tocpage
- name
- chapnum

[ program. ]
The "program" key is to hold a string that is to be interpreted
as the program to run to compile the translated document. It is currently
utilized to provide variations of the same LATEX translation. For instance,
it can be set to 'pdflatex', 'xelatex', and 'lualatex' such that the translated
TEX document should be tailored to this variable.

[ fonts. ]
For CJK/Unicode fonts.

[ bodyfontsuit. ]
This should be set to one of the following: "linux", "dejavu", and "office".
The first one would instruct that the translation should be switched to using
Libertina font; the "dejavu" should instruct the translation to use the
Dejavu font; and the "office" should instruct that "Times New Roman" should be
used instead.

[ bodyfontvariant. ]
This should be set to "ss" if the main font should be a Sans Serif
instead of the normal Serif. 

[ bodyfontsize. ]
This should be set to an integer such as "11" for expressing
the size of the main font in "pt".

[ peek. ]
This should be set to a translation backend name such as "folio" to express
the fact that if this MD document is to be served over the HTTP then
that translation should be used to convert it to HTML/XHTML document.
Other available HTML/XHTML translation backends are: "slide", and "page".

[ title. ]
This should be set to a string holding the title of the document. This string
would serve a variety of purposes, one of which would be to set the "title"
tag of the generated HTML/XHTML document. 



# Auxiliary information sections

Auxilary information sections provide auxiliary information to all
blocks/bundles of the current document. They can be categorized into
following four different types.

- imports
- ruby annotations
- defaut styles
- named storage

The "import" sections are for providing external documents that are to be
imported as chapters, or to create one or more "part" section placed between
chapters.

The "ruby annotation" sections are to provide ruby annotation for certain
Japanese/Chinese characters.

The "default style" sections are to add default style configurations to be
present for all blocks/bundles of a particular ID.

The "named storage" sections establishes named storages and suppy its contents;
these storage buffers can later on by referenced and its contents retrieved.

[ Import. ]

    %^import [part]"Introduction"
    %^import [chapter](./chap1.md)
    %^import [chapter](./chap2.md)
    %^import [chapter](./chap3.md)
    %^import [part]"Introduction"
    %^import [chapter](./chap4.md)
    %^import [chapter](./chap5.md)
    %^import [chapter](./chap6.md)

[ Ruby annotation. ]

    %!異臭・いしゅう
    %!匂い・におい
    %!危ない・あぶない
    %!蓋/ふた
    %!埃/ほこり
    %!覆われた・おおわれた
    %!汚れた・よごれた
    %!真っ黒/まっくろ

[ Default style. ]

    %~samp{fontsize:small}
    %~ink{frame,viewport:20 20,width:40}
    %~dia{frame,viewport:20 20,width:40}

[ Named storage. ]
Name storages pairs contents (lines) with a name. The contents
are stored internally  and associated with the given name. 
The contents can later on be inserted into a DIA bundle, and/or
retrieved by a "dia" phrase.

    %=spider{viewport:10 10,fontsize:10}
    \drawpath {fillcolor:white} &ellipse{(0,1.4),0.65,1.0}
    \drawpath {fillcolor:white} &ellipse{(0,0.3),0.4,0.3}
    \fillpath {fillcolor:black} &circle{(-0.2,0.25),0.1}
    \fillpath {fillcolor:black} &circle{(+0.2,0.25),0.1}
    \drawpath (+0.3,0.45) <clock:+35,1> <clock:+35,0.4> &circle{(*),0.1}
    \drawpath (+0.3,0.45) <clock:+55,1> <clock:+35,0.4> &circle{(*),0.1}
    \drawpath (+0.3,0.45) <clock:+75,1> <clock:+35,0.4> &circle{(*),0.1}
    \drawpath (+0.3,0.45) <clock:+95,1> <clock:+35,0.4> &circle{(*),0.1}
    \drawpath (-0.3,0.45) <clock:-35,1> <clock:-35,0.4> &circle{(*),0.1}
    \drawpath (-0.3,0.45) <clock:-55,1> <clock:-35,0.4> &circle{(*),0.1}
    \drawpath (-0.3,0.45) <clock:-75,1> <clock:-35,0.4> &circle{(*),0.1}
    \drawpath (-0.3,0.45) <clock:-95,1> <clock:-35,0.4> &circle{(*),0.1}
    %
    %=ant{viewport:10 10,fontsize:10}
    \drawpath (-0.8,1)   <clock:-150,0.7> &circle{(*),0.1}
    \drawpath (-0.6,0.8) <clock:-160,0.7> &circle{(*),0.1}
    \drawpath (-0.3,1)   <clock:-170,0.7> &circle{(*),0.1}
    \drawpath (-0.1,0.8) <clock:-175,0.7> &circle{(*),0.1}
    \drawpath (+0.3,1)   <clock:-190,0.7> &circle{(*),0.1}
    \drawpath (+0.6,0.8) <clock:-199,0.7> &circle{(*),0.1}
    \drawpath {fillcolor:white} &ellipse{(0.9,1.20),0.65,0.40,15}
    \drawpath {fillcolor:white} &ellipse{(+0.2,1.1),0.4,0.3}
    \drawpath {fillcolor:white} &ellipse{(-0.4,1.1),0.4,0.3}
    \drawpath {fillcolor:white} &ellipse{(-1.1,1.4),0.5,0.5}
    \fillpath {fillcolor:black} &circle{(-1.3,1.4),0.1}
    \drawpath (-1,1.7) <q:0.5,0.5,-0.3,0.8>
    \drawpath (-1.2,1.7) <q:0.5,0.5,-0.4,0.8>
    %


# Composite blocks

- "equation"
- "figure"
- "table"
- "listing"
- "columns"  
- "page"
- "vspace"

The "page" composite block is intended to provide a way for a translation
backend to insert a page brreak. It should always to appear by itself. 

    .page

The "figure" directive is intended to provide a way for a translation
backend to insert a figure.

    .figure
    \\
    ```dia{width:50}
    \image "imgs/frog.png"
    ```
    ```dia{width:50}
    \image "imgs/clock.png"
    ```

The "multicols" composite block is for constructing a multi-column paragraph.

    .multicols
    \\
    ```par{width:50}
    A frog is any member of a diverse and largely 
    carnivorous group of short-bodied, tailless 
    amphibians composing the order Anura 
    (literally without tail in Ancient Greek). 
    ```
    ```dia{width:50}
    \image "frog.img"
    ```

The "equation" composite block is intended to provide a way for a translation
backend to insert an equation section which may include one or more equations
each with a unique equation number.

    .equation
    &label{a b}
    \\
    ```
    a + b = c
    ```
    ```
    a^2 + b^2 = c^c
    ```

The "vspace" composite block is for inserting vertical spaces. By default
it inserts a vertical space equivalent to 1em. However, the "vspace" style
option can be specified which holds a number expressing multiple "em".
Following example inserts a vertical space equal to "10em".

    .vspace{vspace:10}

The "figure" block is to create a figure with one or more subfigures.

    .figure
    &label{myfigure}
    These are the pictures of golden ratio.
    \\
    ```dia
    \image "goldenratio1.png"
    ```
    ```dia
    \image "goldenratio1.png"
    ```

The "table" block is to create a numbered table.

    .figure
    &label{mytable}
    \\
    ```tab
    Name \\ Addr.
    James \\ 301 Day Drive.
    John \\ 401 Evening Way. 
    ```

Only a single bundle is supported, and it will always be treated as a "tab"
bundle.  In addition, any subcaptions detected inside the caption will become
the footnote of the table.

    .table
    &label{mytable}
    ---
    (i) My note 1.
    (ii) My note 2.
    ---
    \\
    ```{head}
    Name \\ Addr.
    Mandy \\ 801 Sun Dr.
    Zar \\ 901 Sun Dr.
    Zor \\ 1001 Sun Dr.
    ```

The "listing" block is to create a listing block.
Only the first bundle is utilized and it is always
treated as a VTM block regardless.

    .listing
    &label{mylisting}
    \\
    ```vtm
    #include<stdio>
    int main(){
      return 0;
    }
    ```



# Splitting "listing" block

A "listing" block could be split such that a long listing is to be replaced by
two or more shorter listings. Each additional sub-listing is expected to start
a new page.

This is to be achieved by inserting a "autosplit" style attribute.  This attribute
is to be expected a list of numbers where each number represents the total
number of input lines that are to go to each sub-listing.  If the list is shorter
than the total number of bundles needed than an additional bundle is created
that holds all the remaining lines.

In the following example the listing is to be split into two sub-listing where
the first sub-listing containing the first five input lines of the original bundle,
and the second sub-listing holds all the remaining lines.   

    .listing{autosplit:5}
    &label{mylisting}
    My JavaScript program.
    \\
    ```
    var a = 1;
    var b = 1;
    var c = 2;
    var d = Math.abs(12);
    var e = a + b + c;
    var f = [1,2,3,4,5];
    var g = [5,6,6,7,7,];
    ```

The caption of each sub-listing is to be made such that the first sub-listing
might read "Listing 1a", and the second sub-listing "Listing 1b".



# Splitting "table" block

A "table" composite block can also undergo the process of being split into
multiple sub-tables including utilizing the "autosplit" attribute which would
split the input lines into multiple bundles in the same way the "listing" does.

In addition, if the original table container a header row then the "head"
attribute should be set to a number expressing the total number of input lines
that should go to the header row. Lines belonging to the header row are not
counted towards input lines to split. Captions of splitted sub-tables are
likely to become "Table 1a", "Table 1b" etc.

In the following example there will be two sub-tables. The first sub-table
contains entries for John, James, Jane, Mary and Martin, and the second
sub-table contains entries for Zar and Zor. Each sub-table will be furnished
with a header row that is Name and Addr.

    .table{autosplit:5,head:1}
    &label{mytable}
    My table.               
    \\
    ```
    Name \\ Addr.
    John \\ 301 Sun Dr.
    James \\ 401 Sun Dr.
    Jane \\ 501 Sun Dr.
    Mary \\ 601 Sun Dr.
    Martin \\ 701 Sun Dr.
    Mandy \\ 801 Sun Dr.
    Zar \\ 901 Sun Dr.
    Zor \\ 1001 Sun Dr.
    ```

An alternative way is to manually break a long table bundle into smaller
bundles, and add the "splitids" attribute to the style of the "table".  This
setup is the same as the previous one, except in this case the table header has
to be manually repeated in each smaller bundle.  It is also important to set
the "splitids" attribute to hold a list of integers that is the same length as
that of the total number of bundles, and start the first number with 1, 
followed by 2, 3, etc.

    .table{splitids:1 2}
    &label{mytable}
    My table.               
    \\
    ```
    Name \\ Addr.
    John \\ 301 Sun Dr.
    James \\ 401 Sun Dr.
    Jane \\ 501 Sun Dr.
    Mary \\ 601 Sun Dr.
    Martin \\ 701 Sun Dr.
    ```
    ```
    Name \\ Addr.
    Mandy \\ 801 Sun Dr.
    Zar \\ 901 Sun Dr.
    Zor \\ 1001 Sun Dr.
    ```




# Splitting a "itemize" block

A long list of itemized list can be split into two or more groups such that
each list is to appear in a different page.  The settings are similar to
splitting the listing and/or table.

.itemize{autosplit:5}
\\
```
- Hello
- Hello
- Hello
- Hello
- Hello
- World
- World
```




