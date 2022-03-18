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


# Composite blocks

- "equation"
- "figure"
- "table"
- "listing"
- "multicols"
- "page"
- "vspace"
- "alignment"

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

The "alignment" composite presents a paragraph with special alignment needs.
This paragraph is to have a visible top and bottom margin, and will be set up
so that it has the desired alignment set by the "textalign" style. The
"fontsize", "fontstyle" can also be setup to fine tune its appearance.

    .alignment{textalign:r,fontsize:small,fontstyle:i}
    \\
    ```
    A frog is any member of a diverse and largely 
    carnivorous group of short-bodied, tailless 
    amphibians composing the order Anura 
    (literally without tail in Ancient Greek). 
    ```

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

Only a single bundle is supported, and it will always be treated
as a "tab" bundle.

The "listing" block is to create a listing block.

    .listing
    &label{mylisting}
    \\
    ```vtm
    #include<stdio>
    int main(){
      return 0;
    }
    ```



# Bundles

Bundles are those paragraphs fenced by triple backquotes.
Following are the signature IDs for the bundles.

- img
- dia
- ink
- fml
- tab
- par
- vtm

[ The "dia" bundle. ]
This bundle builds a vector image such as SVG, Tikz, and or MetaFun.

    ```dia{viewport:10 10,width:30}
    \drawline (0,0) (10,10)
    \drawline (0,10) (10,0)
    ```


[ The "par" bundle. ]
This bundle is designed to create a text box that contains a single
paragraph. It allows for the possibility such that this paragraph
is able to have its own text alignment, font size, and font style.
Usually, when "width" is not present, texts are arranged in lines
separated by the presence of double-backslashes. 

    ```par
    Hello world!\\
    Hello universe!\\
    Hello people!
    ```

If "width" style is provided,
double-backslashes are ignored and all texts are 
to form a single continuous paragraph.

    ```par{width:50}
    Hello world!
    Hello universe!
    Hello people!
    ```

[ The "img" bundle. ]
The "img" bundle is used to typeset an image. The "viewport" style is used to defined
the viewport size, which is by default 60mm-by-35mm in size, and the picture
will be resize to this size always regardless of its native size. 
However, this property can always be changed to a different size. The \image
command presents a list of image source files one of which will be chosen for
the target translation. For instance, HTML would choose the PNG and LATEX
would have chosen the EPS file.

    ```img{viewport:10 10 5}
    \image "frog.png" "frog.eps"
    ```

This bundle contains a list of commands to allow for this bundle to server a slighly
different purpose. For example, if \type command is setup to point to "canvas", it 
will setup a Canvas for HTML translation that would allow for user to use a Canvas
HTML element o modify the image. The \color command presents a list of customized
colors which will be used to setup the "color" input button for choosing color.

    ```img{viewport:10 10,width:30}
    \image "flog.png" "flog.eps"
    \type "canvas"
    \color "#476fc7" "#ae241c"
    ```

[ The "ink" bundle. ]
This bundle is designed to crreate a picture for holding textual contents. 
The bundle is very much like a "vtm" bundle except the result is a picture, not text,
which allows for it to be resized to a smaller or bigger one.

    ```ink{viewport:10 10 5,width:30}
    #include<stdio>
    int main(){
      return 0;
    }
    ```




# Un-fenced blocks     

Un-fenced blocks are those that are not fenced by
triple-backquotes. Following are the signatures IDs
for these blocks.  

- PLST
- COVE
- CAVE
- LAVE
- SAMP
- SAND
- STEP
- BODY


[ The PLST block. ]
The 'plst' un-fenced block is recognized by the presence of a hyphen-minus, a
plus-sign, or a asterisk in the first line. This block is designed to model
a list of multiple items which might include nested lists.

    - Fruits
      - Apple
      - Pear
    - Dairy
      - Cheese
      - Milk
    - Bread
    - Nuts 

The asterisks are for designating ordered list items.

    * First step, ...
    * Next step, ...
    * Final step, ...
    
The plus-signs are for designating description lists. 

    + Apple
      A wonderful fruit.
    + Pear
      Another wonderful fruit.

However, if only one line is detected, and the starting
item is in the following forms, then it becomes a unordered list.

    + `ltr`       The text direction is left-to-right.
    + `rtl`       The text direction is right-to-left.
    + `inherit`   The text direction is inherited from the Canvas element or others.

Following are additional three forms.

    + *ltr*       The text direction is left-to-right.
    + *rtl*       The text direction is right-to-left.
    + *inherit*   The text direction is inherited from the Canvas element or others.

    + "ltr"       The text direction is left-to-right.
    + "rtl"       The text direction is right-to-left.
    + "inherit"   The text direction is inherited from the Canvas element or others.

    + 'ltr'       The text direction is left-to-right.
    + 'rtl'       The text direction is right-to-left.
    + 'inherit'   The text direction is inherited from the Canvas element or others.

The first form would typeset the leading terms in monospaced fonts; the second
form in italic, the third one with quotation marks, and the third one in plaintext.


[ The COVE block. ] 
This block is recognized by the presence of greater-than-sign followed by at
least one space at the first line. Each additional line will be checked for the
presence of the same sign and the follow-on space, and if detected it becomes a
new line by itself; otherwise it is considered the continuation of the previous
line. The output is that all lines are left aligned and the entire block has a
non-zero left padding, and there is a black right-pointing triangle in front of
the first line of the block and inside the left padding area.

    > All human are mortal.
    > Socrates is a human.
    > Socrates is mortal.


[ The CAVE block. ] 
This block is recognized by the presence of dollar-sign followed by at least
one space at the first line. Each additional line will be checked for the
presence of the same sign and follow-on space, and if detected it becomes a new
line by itself; otherwise it is considered the continuation of the previous
line.  When being typeset, the output is so that all lines are center aligned.

    $ Hello!          
    $ Good morning!       
    $ Good evening!       


[ The LAVE block. ] 
This block is recognized by the presence of less-than-sign followed by at least
one space at the first line. Each additional line will be checked for the
presence of the same sign   and follow-on space, and if detected it becomes a
new line by itself; otherwise it is considered the continuation of the previous
line. When being typeset, the output is so that all lines are left flushed
and with none-zero left padding for the entire block.

    < Hello!          
    < Good morning!       
    < Good evening!       


[ The SAMP block. ]
This block is recognized if the first line is lead with a quadruple white
space. Each of the following line is to be assume to have a leading quadruple
space and    it will be removed.  The output of this block is a verbatim block
where each line is to be shown in monospace font style where white spaces are
preserved.

[ The SAND block. ]
This block is recognized if the first line is lead with a double white space.
Each of the following line is to be assumed to have a leading double space and
it will be removed. The output is a block where each line is to be shown by
itself similar to a SAMP block and each white spaces are translated into a
non-breakable white space, except for the fact that the proportional font
styles are applied instead of monospace.

[ The STEP block. ]
This block is recognized if the first line is lead by a numeric number followed
by a right parenthesis and then additional spaces.  This block is assumed to
represent a single ordered list item with the given leader.  This block is to
be scanned for the presence of any follow-on child paragraphs, and if detected
each one of them will be shown as an independent paragraph that is to have the
same left padding as the list item itself.  Each follow-on child paragraph is
to be detected if the preceding line is a double-backslash by itself.  In the
following example the STEP block contains two follow-on child paragraphs.

    1) Step 1, check the temparature:
    \\
    If the temperature is greater than 10, add this ingredient.
    \\
    Otherwise, add this ingredient.

In the following example there is no follow-on child paragraphs.

    2) Step 2, bring it to a boil, and taste it see if additional 
    salt is needed.      

Note that all child paragraphs are treated as normal paragraphs with
no particular layout assumptions.


[ The BODY block. ]
This block represents a normal paragraph.  For some translations the first line
of this paragraph is likely to have some visible indentation except for the situation
where this line is the first line after a sectional heading.



# Literals

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


# Entity phrases

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


# Splitting "listing" block

A "listing" block could be split into multiple blocks and with
a "page" block inserted between two splitted ones. It can
be done so by placing "split" style options.
In the following example three blocks will be created
that are: "listing", "page" and "listing".
The first "listing" block holds the first five lines
and the second "listing" block holds the last two lines
of the listing.

    .listing{split:5 10}
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

This would be equivalent to having the following three
blocks.

    .listing
    &label{mylisting}
    My JavaScript program.
    \\
    ```
    var a = 1;
    var b = 1;
    var c = 2;
    var d = Math.abs(12);
    var e = a + b + c;
    ```

    .page

    .listing
    &label{mylisting}
    My JavaScript program.
    \\
    ```
    var f = [1,2,3,4,5];
    var g = [5,6,6,7,7,];
    ```



# Splitting "table" block

A "table" block could be split into multiple blocks and with
a "page" block inserted between two splitted ones. It can
be done so by placing "split" style options similar to 
that of a "listing" block. 
However the "head" style option should also be specified to hold
the number lines that are to be repeated for all splitted blocks.

    .table{split:5 10,head:1}
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

This would be equivalent to the following.

    .table
    &label{mytable}
    My table.               
    \\
    ```tab{head}
    Name \\ Addr.
    John \\ 301 Sun Dr.
    James \\ 401 Sun Dr.
    Jane \\ 501 Sun Dr.
    Mary \\ 601 Sun Dr.
    Martin \\ 701 Sun Dr.
    ```

    .page

    .table
    &label{mytable}
    My table.               
    \\
    ```tab{head}
    Name \\ Addr.
    Mandy \\ 801 Sun Dr.
    Zar \\ 901 Sun Dr.
    Zor \\ 1001 Sun Dr.
    ```



