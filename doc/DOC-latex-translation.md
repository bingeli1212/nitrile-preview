---
title: LATEX Translation
---


# The begin-description envelop

The LATEX begin-description envelop is designed to typeset a list of 
key/value pairs, where each key is flushed against the left margin
and each value is indented by a fixed space. 

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

Typically a single MD document would have only produced "sections",
"subsections", and "subsubsections", where a single number-sign would produc a
section, a double number-sign a subsection, and a triple number-sign a
subsubsection. 

It is also possible to manually inject a "chapter" or "part" to a 
TEX document. This is done by using the at-sign section.

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


# The "level" attribute of the block

The "level" attribute of the block is constructed by the parser, that is assigned
to each HDGS block such that it reflects the current hierarchies of the sections 
within the chapter. For instance, the first chapter will have its "level" attribute
set to "1". The first subsection of that section is "1.1". The first subsubsection
of the first subsection of the first section is "1.1.1", etc.


# The proble of "drawslopedtext"

Currently there are some issues when using "drawslopedtext", which is implemented
in LATEX using TikZ. The position of the text is expressed using "above" as part
of the option. However, this has been observed to have caused some problems when the 
drawing of the lines goes from right to left, where the "above" should have translated
into the text appearing below the line, but was not observed as so. Instead, the text
appears at the top of the line.


# The "verbatim" bundle

The verbatim bundle is implemented using a "tabular", which by nature
does not break across page boundaries. 

# To add a frame around the entire content of a figure

    \documentclass{article}
    \usepackage{graphicx}
    \usepackage{caption}
    %
    \graphicspath{ {./images/} }
    %
    \begin{document}
    %
    \fbox{
    \parbox[c]{\textwidth}{
    \centering
    \includegraphics{example-image-duck}
    \captionof{figure}{foo}
    \label{fig:cow1}
    %
    \includegraphics{example-image-duck}
    \captionof{figure}{bar}
    \label{fig:cow2}
    }}
    %
    \end{document}

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


# The "Figure" 

The "Figure" caption does not seem to be able to be shifted to a Left or Right
position other than the Center position. 


# The Tikzpicture

When a Tikzpiture is placed in a "tabular", for example the second column and the first
row, it will try to align with the text that is the first column and first row, such that
the bottom of that picture aligns with the baseline text in the first row. This will
create an effect such that the picture will "rise" above the text in the first column
if it has a significant height. To solve this problem is to wrap the Tikzpicture inside
an inner "tabular". 


# The courier font package

The package "courier" would change all fixed-width font to "courier"

    \usepackage{courier}

The "boookman" and "times" packaegs both seems to also load the "courier"
package. But they are intended to change the proportional font.


# Assign equation number manually

Following is an example of assigning equation number manually, using \tag,
to assign the equation to a number that is "5.23".

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
    \begin{lstlisting}[title=My Code]
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



    