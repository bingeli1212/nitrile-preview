---
title: LATEX Translation
---


# The description environment

The LATEX "description" environment is designed to typeset a list of key/value
pairs, where each key is flushed against the left margin and each value is
indented by a fixed space. 

Each key is placed inside a \item, such as

    \item[apple] Good apple

Where "apple" is the key and "Good apple" is the description.
It is possible to replace a text with a \parbox such as

    \item[\parbox{\linewidth}{apple\\pear\\banana}] Good apple

Such that the key is comprised of three separate entries and each
entry occupies a line by itself. However this arrangement
has been observed to have caused the description text such as "Good apple"
to sometimes appear to the right hand side of the key, rather than 
at the bottom. The fix is the add a \hfill immediately after
the closing brackets of the key. Following is the fix.

    \item[\parbox{\linewidth}{apple\\pear\\banana}]\hfill Good apple



# Add "chapters" and "parts"

Typically a single MD document would have only to become a "chapter" by itself,
and seconds within become "sections" of that chapter.  Howver, it is also
possible to manually break a single MD document so that it can produce one or
more "parts" and one or more "chapters".       

    @part Introduction

    @chapter Lesson One
    &label{lessionone}

    ...

    @chapter Lesson Two
    &label{lessiontwo}

    @part Advanced

    @chapter Lesson Three
    &label{lessionthree}

    ...

    @chapter Lesson Four
    &label{lessionfour}

The introduction of "@part" would have inserted a new HDGS block into the list
of blocks where its "name" attribute is set to "part", and the "partnum"
corresponding to the number of total parts including this one, such that the
first part being 1.

The appearance of a "@chapter" will also reset the internal counters for 
sections, subsections and subsubsections, such that the next appearance of
the section will be considered the first section. This means that the "level" 
attribute of the block will be re-numbered.


# Importing sub-documents

It is also possible to import sub-documents such as the following example
shows.

    ---
    title: My Document
    ---
    %^import [part]"Introduction"  
    %^import [chapter](./lesson1.md)
    %^import [chapter](./lesson2.md)
    %^import [part]"Introduction"
    %^import [chapter](./lesson3.md)
    %^import [chapter](./lesson4.md)




# Adding a frame to the entire figure/table

Following is for adding a frame to a figure/table float.

    \usepackage{float,lipsum}
    \floatstyle{boxed}
    \restylefloat{table}
    \restylefloat{figure}


# The "\atop" and "\substack"

The "\atop" is a native TEX command which can be used to stack to math elements
on top of each other, similar to a "\frac" will do but without the middle line.

    {\sqrt{2} \atop \hrule{7.00em}{0.4pt}}

It is better to surround the entire expression with braces so that the "\atop"
does not affect expressions down the road. It should be pointed that the font
size for both upper and lower math expression would be reduced, similar to the
effect one would have observed out of a "\frac{}{}" command.

Similar to "\atop" is "\above", which must be followed by a argument immediately
after it a length expressing the additional vertical distance.

    {a \above 0pt b}

Maybe "\atop" can be compared to similar commands "\over" which does creates a
fraction line.

The AMS package also provides a similar commands called "\substack" that works
similarly, but has the advantage of allowing two or more lines.

    \\substack{\sqrt{2} \\ \hrule{7.00em}{0.4pt}}

The "\substack" command is specifically designed for a subscript consisting of
multiple lines such as the following examle for a "\sum", where sometimes its
subscript contains multiple lines each of which needs to be in its own.

    \sum_{
    \substack{
    1\lt i\lt 3 \\
    1\le j\lt 5
    }}
    a_{ij}

The \overset{above}{main} and \stackrel{a}{b} would also work. They seems to
work the best when the bottom one is a "\hrule", where the "\atop" and "\above"
would have placed too much vertical spaces between them.


# The Math styles

The following applies to both LaTeX 2.09 and LaTeX2e.

There are four styles used in typesetting math formulas which affect the size
and certain formatting parameters (notably the placement of sub and superscripts
on variable size symbols).

- \textstyle - default in the running text and in array environment
- \displaystyle - default for displayed equations
- \scriptstyle - default for first-level sub and superscripts
- \scriptscriptstyle - default for higher-level sub and superscripts

All four of these may be used in math mode as declarations to force the type
size and formatting to a style other than what would normally be used.

For example, to get a superscript that is the same size as the running text:

    $e^{\textstyle -E/kT}$   

As another example, the limits on a summation symbol are normally placed below
and above the symbol in display style and in normal sub and superscript position
in textstyle. One could force the below/above placement in running text by
using:

    \displaystyle $\sum_{n=0}^\infty x_n$

although it should be noted that this might cause LaTeX to leave extra space
between the text lines which might not be desirable.


# LaTeX 2.09 fonts

The regular type style declarations can be used in math mode. They affect only
letters (including upper case Greek letters) but not symbols (or lower case
Greek letters). Two additional style declarations which can be used only in math
mode are

- \mit
- \cal

The former is math italic style; it spaces letters as if they were words,
however, not as if they were each separate math symbols. The latter produces
upper case calligraphic letters.

# LaTeX2e math fonts

The following commands change the style only of letters, numbers, and uppercase Greek.

- \mathit - same as \mit in 2.09 (see above)
- \mathrm - Roman
- \mathbf - Bold face
- \mathsf - San Serif
- \mathtt - Typewriter style
- \mathcal - Calligraphic

All of these produce spacing appropriate for text; they do not interpret each
letter as a separate math symbol.

The \boldmath declaration causes everything (including symbols) in a formula to
be in a bold font. Note that this differs somewhat from the same declaration in
2.09 which did not affect some symbols.

For XELATEX/LUALATEX, following two packages must be included:

    \usepackage{eufrak}
    \usepackage{bbold}


# The figure caption

The caption text of a figure float does not seem to be able to be styleda as
flushleft or flushright other than being center aligned


# The Tikzpicture

When a Tikzpiture is placed in a "tabular", for example the second column and the first
row, it will try to align with the text that is the first column and first row, such that
the bottom of that picture aligns with the baseline text in the first row. This will
create an effect such that the picture will "rise" above the text in the first column
if it has a significant height. To solve this problem is to wrap the Tikzpicture inside
an inner "tabular". 


# The courier font package for pdflatex

The package "courier" would change all fixed-width font to "courier"

    \usepackage{courier}

The "boookman" and "times" packaegs both seems to also load the "courier"
package. But they are intended to change the proportional font.


# Assign equation number manually

Following is an example of assigning equation number manually to a number that
is "5.23" using the \tag command.

    \documentclass{article}
    \usepackage{amsmath}      % for \tag and \eqref macros
    \setlength\textwidth{7cm} % just for this example
    \begin{document}
    \[
    1+1=2 \tag{5.23} \label{eq:special}
    \]
    A cross-reference to equation \eqref{eq:special}.
    \end{document}


# Assign listing number manually

Following is an example of assigning listing number manually, using "title"
option.

    \documentclass{article}
    \documentclass{listings}
    \begin{document}
    \begin{lstlisting}[title={Listing 1.23 : The main function.}]
    #include<stdio>
    int main(){
      printf("hello world!\n");
      return 0;
    }
    \end{lstlisting}
    \end{document}


# Stroke-through

Following is the way for styling a strike-through for a piece of text.
  
    \usepackage[normalem]{ulem}
    \sout{Hello World}


# Underline text

Following is the way for styling an underline text.

    \usepackage[normalem]{ulem}
    \underline{Hello World}


# The baselineskip, baselinestretch, and linespread

\baselineskip is a length command which specifies the minimum space between the
botton of two successive lines in a paragraph. Its value may be automatically
reset by LaTeX, for example, by font changes in the text. The value used for an
entire paragraph is the value in effect at the blank line or command which ends
the paragraph unit.  \baselinestretch scales the value of \baselineskip. Its
default value is 1.0 but it may be reset with a \renewcommand command. If one
wants to change the spacing in a document one should reset \baselinestretch and
not \baselineskip as the latter may be reset automatically by LaTeX to account
for local variations in the text, but it is always scaled by the former. In
principle, "double spacing" can be obtained by

    \renewcommand{\baselinestretch}{2}.

The \linespread command is preferred over changing \baselinestretch directly.

    \linespread{0.5} 
    

# Multi-line in display math expression

Use an array environment if a display math expression is to have multiple linse.

    \[
    \begin{array}{c}
    a + b = c\\
    a + b = c
    \end{array}
    \]


# Assign label for display math expression

    \[
    a + b = c
    \tag{1}
    \]
    \[
    a + b = c
    \tag{2}
    \]

It is also possible for assigning a label for multi-line equation.

    \[
    \begin{array}{c}
    a + b = c\cr
    a + b = c
    \end{array}
    \tag{1}
    \]



# Producing horizontal rule

Synopsis, one of:

    \rule{width}{thickness}
    \rule[raise]{width}{thickness}

Produce a rule, a filled-in rectangle.

This produces a rectangular blob, sometimes called a Halmos symbol, often used
to mark the end of a proof.

    \newcommand{\qedsymbol}{\rule{0.4em}{2ex}}

The amsthm package includes this command, with a somewhat different-looking symbol.

The mandatory arguments give the horizontal width and vertical thickness of the
rectangle. They are rigid lengths (see Lengths). The optional argument raise is
also a rigid length, and tells LaTeX how much to raise the rule above the
baseline, or lower it if the length is negative.

This produces a line, a rectangle that is wide but not tall.

    \noindent\rule{\textwidth}{0.4pt}

The line is the width of the page and 0.4 points tall. This line thickness is
common in LaTeX.

A rule that has zero width, or zero thickness, will not show up in the output,
but can cause LaTeX to change the output around it. See \strut for examples.



# CJK & other font supports

It is possible to specify a different font file for a CJK glyph that comes from
each of the four languages: jp, tw, cn, and kr. For historic reason, these four
languages each uses a subset of CJK characters, and the CJK charactesrs they use
have all be placed inside a single Unicode block called "CJK Unified
Ideographs". Font files that are designed for a specific languages only serves
to implement a subset of glyphs within this Unicode block.

In order to correctly identify the language for a particular CJK character,
NITRILE has established a built-in lookup table.  If two or more languages are
identified for a single CJK, the language chose is to come from this order: jp,
tw, cn, and kr.  NITRILE will also to attempt to identify a continuous block of
CJK characters and chooses the top language that covers all of them.

Once identified, the font switch is added the translation. For CONTEX it is
`\switchtobodyfont[jp]`, for XELATEX and LUALATEX it is `\jp` if
"jp" is the language chosen.   Other font swtiches are similarly named
after the language.

However, one of the font switches comes with a preconfigured font file
association, thus the compilation is likely to fail. In order to make these
font switches meaningful, a font file will need to be specified in the font
matter that is associated to a particular font switch, such that the
translation backend will generate appropriate translation that map these font
files to the right font switch.

On top of that, NITRILE has ten additional font switches that
are capital letter A-J, each of which can be setup to mark a range of text
that belongs to a specific Unicode code block.
In the following example the font switch "A" has been setup to cover
the Unicode code block that starts at 0x2700, or Dingbats, in addition
to the font file configuration for each of the four CJK languages.

    ---
    title: CJK
    fonts: cn{contex:arplsungtilgb,xelatex:STSong,lualatex:arplsungtilgb}
           jp{contex:ipaexmincho,xelatex:Hiragino Mincho ProN,lualatex:ipaexmincho}
           tw{contex:arplmingti2lbig5,xelatex:Songti TC,lualatex:arplminti2lbig5}
           kr{contex:baekmukbatang,xelatex:AppleGothic,lualatex:baekmukbatang}
           A{contex:Unifont,xelatex:Unifont,lualatex:Unifont,start:0x2700}
    program: xelatex
    ---

Thus, in order to map each glyph to a specific font file, the "fonts"
frontmatter key is to provide for this clarification. The "program" key is used to
hold a specific LATEX engine for the target translation. The "fonts" key are
currently utilized only when "program" is set to "contex", "xelatex" or
"lualatex".

For LUALATEX translation following commands are to be inserted
to define the font swtich `\cn`, `\jp`, `\tw`, and `\kr`.

Note that for LUALATEX translation the "luatexja-fontspec" package is loaded
instead of "fontspec" package---this package fixes the problem of the original
"fontspec" package which is that this package does not wrap CJK characters
properly for those CJK characters that do not have spaces inserted between
them. A result the \newjfontfamily command is used instead of \newfontfamily.

    \newjfontfamily{\cn}{arplsungtilgb}
    \newjfontfamily{\jp}{ipaexmincho}
    \newjfontfamily{\tw}{arplmingti2lbig5}
    \newjfontfamily{\kr}{baekmukbatang}
    \newjfontfamily{\A}{Unifont}

For XELATEX translation the translation would like to insert following commands
instead.

    \newfontfamily{\cn}{arplsungtilgb}
    \newfontfamily{\jp}{ipaexmincho}
    \newfontfamily{\tw}{arplmingti2lbig5}
    \newfontfamily{\kr}{baekmukbatang}
    \newfontfamily{\A}{Unifont}

For each entry of "fonts" key, it starts with the name of a font switch. This
font switch must come from this list: cn, jp, tw, kr, A, B, C, D, E, F, G, H,
I, and J.  

After the font switch, it is list of key/value pair, where the keys must be one
of the following: contex, xelatex, lualatex, and start. The first three
describes an installed font file name, and the last one describes the starting
code point of a Unicode block, such as "0x2700".

It isn't clear if fontspec package has
capabilities to specify font files depending on the Unicode block ranges.



# Main body fonts

LATEX comes with predefined main body font, which is the font used for
all texts that are not specifically marked by a font switches. For PDFLATEX
there isn't a possibility to use font switch, font switches are only made
possible by the use of XELATEX and LUALATEX. 

For XELATEX and LUALATEX, it is also possible to set the main font which 
isn't possible for PDFLATEX. Thus, following discussion are only limited 
to XELATEX and LUALATEX translation only.

The main font consists of three different categories: serif, sans, and mono.
Typically main fonts are serif fonts, where sans fonts are used for titles and
headings, and mono fonts for verbatim text. The fontspec package, which is
responsible for setting up fonts, has created following commands:

    \setmainfont[Ligatures=TeX]{Times New Roman}
    \setsansfont[Ligatures=TeX]{Arial}           
    \setmonofont[Ligatures=TeX]{Courier New}     

Each command changes the main font for each of the three categories. This allows
for automatic switch to one of these fonts based on the latex command such as
`\ssfamily`, and `\ttfamily``. 

The "bodyfontsuit" frontmatter key can be used to insert these commands that
allows for the main font to be changed to a different font suit. The previous
example is the result of setting this key to "office". Following are likely
the output when this key is set to "linux".

    \setmainfont[Ligatures=TeX]{Libertinus Serif}
    \setsansfont[Ligatures=TeX]{Libertinus Sans Mono}
    \setmonofont[Ligatures=TeX]{Libertinus Mono} 

Following are likely the output when this key is set to "dejavu".

    \defaultfontfeatures[DejaVu Serif]{Scale=0.89}
    \defaultfontfeatures[DejaVu Sans]{Scale=0.89}
    \defaultfontfeatures[DejaVu Sans Mono]{Scale=0.89}
    \setmainfont[Ligatures=TeX]{DejaVu Serif}     
    \setsansfont[Ligatures=TeX]{DejaVu Sans Mono}     
    \setmonofont[Ligatures=TeX]{DejaVu Mono}     

The \defaultfontfeatures command allows for some features regarding this
font to be turned on/off, or to be set to a different value.




# Disabling double-hyphen ligature

To disable produce a en-dash or em-dash in LATEX, add the following command definition
to the preamble, and then specify this command inside a block.

    \newcommand{\activatehyphen}{%
      \begingroup\lccode`~=`-
      \lowercase{\endgroup\def~}{\char`\-\kern0pt }%
      \catcode`\-=\active
    }

This command should be placed inside the preamble section of the document, and
can be later on inserted as part of the content as follows, such that the
double-hyphen below will not be combined into forming a ligature as it normally
does.

    {\activatehyphen{}--mycolor}



# Trim contents outside of boundingbox for "picture" environment

The LATEX "picture" environment allows for lines, curves, and text to be drawn
by using a set of higher-level commands. However, one of the drawback is that
it does not clip the content which causes the problem such that the contents
drawing outside the boundary of a "picture" environment will be seen to have
overlapped with the contents that are outside of the picture environment. 

To solve this problem the \clipbox command from "trimclip" package can be used.
Following example shows how to clip the output of a "picture" environment so
that contents outside of 100mm-by-100mm box are removed.

    \clipbox*{0mm 0mm 100mm 100mm}{\setlength{\unitlength}{1mm}
    \begin{picture}(100,100)
    \put(0,30.5549999972){\ttfamily\fontsize{10pt}{10pt}\selectfont{}This~is~a~tale~for~a~night~of~snow.}
    \put(0,27.0272222172){\ttfamily\fontsize{10pt}{10pt}\selectfont{}It~was~lived~in~the~north~land~long~ago.}
    \put(0,23.499444437199998){\ttfamily\fontsize{10pt}{10pt}\selectfont{}And~old~man,~nearing~the~end~of~life,}
    \put(0,19.9716666572){\ttfamily\fontsize{10pt}{10pt}\selectfont{}Took~to~his~arms~a~fair~young~wife.}
    \end{picture}}

Note that the "\clipbox" command defined by this package only serves to add
instructions to the generated PDF to clip away the contents; it does not
actually remove the contents in the generated PDF.  Fortunately, most PDF
viewers seem to have paid attention to this instruction and the contents are
indeed not visible.



# The {hew:2} style

The {hew:2} style has been added lately to allow for lines in SAMP and SAND
blocks to be evenly distributed among two columns.

For LATEX translation this effect is produced by using a "multicols" envionment
such that contents are evenly distributed between the two columns. 
Note that the same {hew:3} and {hew:4} and other styles are equally possible.



# Drawing raster image inside "tikzpicture"

The "tikzpicture" environment allows for an external raster image file to be
loaded and drawn inside this environment. The tikz command to do so is a
`\draw` command that makes use of a "node". However, it has been noted that in
order for the entire raster image to cover the entire tikzpicture viewport, it
is important to position the "node" at the center of the viewport and the
"anchor" option of the `\draw` command left unspecified; this will result in
this node being "centered" at the viewport. This allows for the entire raster
image to be drawn in exactly the size of the viewport. If however, the node is
positioned at (0,0) the "anchor=south west" would have to be specified for the
`\draw` command; this has been noticed to have a problem such that the picture
is slightly shifted to the right and up such that part of the image are
trimmed.



# The nibeamer.js translation. 

The nibeamer.js translation of a MD file is to produce a TEX file that is 
based on "beamer" documentclass.

- Currently "t" option is specified for each frame to force the content to be 
  flushed towards the top of each slide
- The beamer has a "fragile" option placed for each frame; however, if this
  option is set then "wrapfigure" will stop working   
- However, if "fragile" is not set then "begin/end/lstlisting" and "begin/end/verbatim" 
  and "begin/end/Verbatim" will not compile.         

Following is the "columns" environment in Beamer that should be used instead.

    \documentclass[demo]{beamer}
    \begin{document}
      \begin{frame}
    \frametitle{explanation}
    \begin{columns}
    \begin{column}{0.5\textwidth}
       some text here some text here some text here some text here some text here
    \end{column}
    \begin{column}{0.5\textwidth}  
        \begin{center}
         %%%%% this is a minipage, so \textwidth is already adjusted to the size of the column
         \includegraphics[width=\textwidth]{image1.jpg}
         \end{center}
    \end{column}
    \end{columns}
    \end{frame}
    \end{document}




# The nilamper.js translation. 

The nilamper.js translation of a MD file is to produce a TEX file that is 
based on "memoir" documentclass.


# Include MetaFun graphics

Following is an example of setting a graphic
for the title page.

    \documentclass[a4paper,10pt]{article}
    \usepackage{eso-pic}
    \usepackage{luamplib}
    \mplibsetformat{metafun}
    \usepackage{xcolor}
    \definecolor{maincolor}{rgb}{.4,0,0}
    \usepackage{fontspec}
    \newfontfamily\TitlePageFont{lmmonolt10-bold.otf}
    \begin{document}
    \AddToShipoutPictureFG*{%
      \begin{mplibcode}
        beginfig(0) ;
        path Page ; Page := unitsquare xscaled (\mpdim{\paperwidth}) yscaled (\mpdim{\paperheight}) ;
        numeric w ; w := bbwidth(Page) ;
        numeric h ; h := bbheight(Page) ;
        fill Page withcolor \mpcolor{maincolor} ;
        draw textext.urt("\TitlePageFont Q")       xysized (1.1   w,0.9 h) shifted (-.05w,.05h) withcolor .20white ;
        draw textext.top("\TitlePageFont SQL")     xysized (0.4725w,0.13h) shifted (.675w,.24w) withcolor .60white ;
        draw textext.top("\TitlePageFont CONTEXT") xsized  (0.6   w)       shifted (.675w,.10w) withcolor .60white ;
        setbounds currentpicture to Page ;
        endfig ;
      \end{mplibcode}%
    }
    % Generate a page
    \leavevmode
    \thispagestyle{empty}
    \end{document}


# Use microtype package

I just say 

    \usepackage[kerning,spacing]{microtype} 

which enables glyph scaling and margin kerning. You can browse the other
options, but this is basically all you need. – 



# Overlaying two graphics

This section describes how to overlay two graphics. Note that there is no guarantee 
that the top graphic is transparent; it may have been created with an opaque
background that hides the bottom graphic.
For example18, the files left.eps and right.eps contain the graphics shown in

    \makebox[0pt][l]{\includegraphics{left.eps}}%
    \includegraphics{right.eps}

Another method for overlaying graphics is the overpic package, which defines a 
picture environment which is the size of the included graphic. See the overpic package
documentation for details.




# Known Problems in latex.js translation

- The \underline command leaves too much vertical space between 
  the text and the line
- For TIKZ when text anchor is not centered it leaves too much gap
  between the text and the anchor
- The sub-caption of figure/table are current made by "threeparttable"
  and there seems to be no way of making them to be in a font size
  that is \small
- The caption make by \begin\end\center are not able to be influenced
  by \small or \footnotesize or others.
- The -{}- method works for disabling en-dash ligature, but this method
  does not work for LuaLaTeX; use the -\kern0pt- method instead.
- begin/end/verbatim or begin/end/Verbatim cannot be used inside "beamer"
  without making the slide "fragile"
- begin/end/lstlisting cannot be used inside a "beamer" document
  without making the slide "fragile"
- For PDFLATEX translation the \begin{CJK} command cannot appear as part
  of the document title \title{...}, for LUALATEX this is okay.
- When style.stretch is present the "tabularx" environment is used. 
  This env is supplied by "memoir" document class, and must include 
  an external package name "tabularx" otherwise.              
- The "columns" toplevel block is implemented using begin/end/multicols
  env; using "minipage" seems to have problem if the left hand side
  is a "par" bundle and the right hand side is a "img" bundle where the
  text is placed lower than expected. Due to the limitation of this env,
  where setting "1" as the number of columns is to cause an warning,
  the number is set to "2" if it is "1" or less.
- For "tab" bundle, it only generates "tabularx", and the "threeparttable"
  is set only inside a "table" float. This arrangement is to avoid having
  "threeparttable" inside a "columns" float.
- \url{} command cannot appear inside a \caption{} command                  
  
