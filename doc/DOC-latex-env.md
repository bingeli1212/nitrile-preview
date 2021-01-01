---
title: LATEX environments
---

# LATEX environments

LaTeX provides a number of different paragraph-making environments.
Each environment begins and ends in the same manner.

    \begin{environment-name}
    ....
    ....
    \end{environment-name}

Blank lines before the \begin{} or after the \end{} cause a paragraph
break before or after the environment. Blank lines after the \begin{}
or before the \end{} are ignored.
All declarations have an environment of the same name. However, the
reverse does not always work. For example, {\abstract Abstract text
... .} may not give correct paragraph breaks.

# Available environments

~~~tabbing{n:4}
Subtopics
abstract
array
center
description
displaymath
enumerate
eqnarray
equation
figure
flushleft
flushright
itemize
list
math
minipage
picture
quotation
quote
tabbing
table
tabular
thebibliography
theorem
titlepage
trivlist
verbatim
verse
~~~

# The "theorem" environment

    \begin{theorem}
    theorem text
    \end{theorem}

The theorem environment produces "Theorem x" in boldface followed by
your theorem text.

# The "verse" environment

    \begin{verse}
    text
    \end{verse}

The verse environment is designed for poetry, though you may find
other uses for it.

# The "verbatim" environment

    \begin{verbatim}
      text 
    \end{verbatim}

or

    \begin{verbatim*}
      text
    \end{verbatim*}

The verbatim environment is a paragraph-making environment that gets
LaTeX to print exactly what you type in. It turns LaTeX into a
typewriter with carriage returns and blanks having the same effect
that they would on a typewriter. The output looks exactly as it looks
in the input file.

The difference between verbatim and verbatim* is that the latter
prints spaces as "visual" spaces, i.e., a short, squat "u".

The only text which cannot be placed in the verbatim environment is
the 14-character sequence "\end{verbatim}".

The verbatim environment may not be used in the argument of another
command. However, it can be placed inside a minipage environment which
allows you to manipulate its placement.

# The "trivlist" environment

    \begin{trivlist}
    \item First item
    ....
    \end{trivlist}

This is ike the List Environment, but uses the currently defined
values of list-making parameters. It is normally used to define an
environment with a single item, with an \item command as part of the
environment definition.

# The "titlepage" environment

    \begin{titlepage}
    text
    \end{titlepage}

The titlepage environment creates a title page, i.e. a page with no
printed page number or heading. It also causes the following page to
be numbered page one. Text and formatting for the title page are left
to you.

The \today command comes in handy for title pages. Other useful
commands include those that change Typefaces, the Centering
Environment, and the Abstract Environment.

See also \maketitle and \title

# The "quote" environment

    \begin{quote}
    text
    \end{quote}

The margins of the quote environment are indented on the left and the
right. The text is justified at both margins. For longer quotations
(more than one paragraph) use the quotation environment.

To change the left indentation, set the ``\leftmargini`` 
length, and ensure that it is placed inside a begingroup-endgroup
environment to localize the effect.

    \begingroup
    \setlength{\leftmargini}{0.5cm}
    \begin{quote}
    \(\langle a \mid a^{n} = 1 \rangle\)
    \end{quote}
    \endgroup

# The "quotation" environment

    \begin{quotation}
    text
    \end{quotation}

The margins of the quotation environment are indented on the left and
the right. The text is justified at both margins and there is
paragraph indentation. Leaving a blank line between text produces a
new paragraph.

For a short quote (one paragraph), use the quote environment.

# The "picture" environment

    \begin{picture}(width,height)(x-offset,y-offset)
    ...
    picture commands
    ...
    \end{picture}

The picture environment allows you to create just about any kind of
picture you want containing text, lines, arrows and circles. You tell
LaTeX where to put things in the picture by specifying their
coordinates. A coordinate is a number that may have a decimal point
and a minus sign (-), for example, 5, 2.3, or -3.1416. A coordinate
specifies a length in multiples of the unit length \unitlength, so if
\unitlength has been set to 1cm, then the coordinate 2.54 specifies a
length of 2.54 centimeters. You can change the value of \unitlength
anywhere you want, using the \setlength command, but it should be set
before the beginning of the picture environment since strange things
may happen if you try changing it inside the picture environment.

A position is a pair of coordinates, such as (2.4,-5), specifying the
point with x-coordinate = 2.4 and y-coordinate = -5. Coordinates are
specified in the usual way with respect to an origin, which is
normally at the lower-left corner of the picture. Note that when a
position appears as an argument, it is not enclosed in braces; the
parentheses serve to delimit the argument.

The picture environment has one mandatory argument, which specifies
the size of the picture. The environment produces a rectangular box
with width and height determined by this argument's two values.

The picture environment also has an optional position argument,
following the size argument, that can change the origin. (Unlike
ordinary optional arguments, this argument is not contained in square
brackets.) The optional argument gives the coordinates of the point at
the lower-left corner of the picture (thereby determining the origin).
For example, if \unitlength has been set to 1mm, the command

    \begin{picture}(100,200)(10,20)

produces a picture of width 100 millimeters and height 200
millimeters, whose lower-left corner is the point (10,20) and whose
upper-right corner is therefore the point (110,220). Typically one
initially omits the optional argument, leaving the origin at the
lower-left corner. If you then want to modify your picture by shifting
everything, you just add the appropriate optional argument.

The environment's mandatory argument determines the nominal size of
the picture. This need bear no relation to how large the picture
really is; LaTeX will happily allow you to put things outside the
picture, or even off the page. The picture's nominal size is used by
TeX in determining how much room to leave for it.

Everything that appears in a picture is drawn by the \put command. The command

    \put (11.3,-.3){obj}

puts the object specified by obj in the picture, with its reference
point at coordinates (11.3,-.3). The reference points for various
objects will be described below.

The \put command creates an LR box. You can put anything in the text
argument of the \put command that you'd put into the argument of an
\mbox (or related) command. When you do this, the reference point will
be the lower left corner of the box.

Following are other commands provided by this environment.

~~~tabbing{n:4}
\circle
\dashbox
\frame
\framebox
\line
\linethickness
\makebox
\multiput
\oval
\put
\shortstack
\unitlength
\vector
~~~

# minipage

    \begin{minipage}[position]{width}
    text
    \end{minipage}

The minipage environment is similar to a \parbox command. It takes the
same optional position argument and mandatory width argument. You may
use other paragraph-making environments such as the list-making and
tabular environments inside a minipage. You can also use the minipage
environment or \parbox command to put one or more paragraphs inside of
a picture environment or as a table item, for example.

There is no paragraph indentation in the minipage environment. That
is, LaTeX sets \parindent to zero; however, you may override this with
a \setlength command.

Footnotes in a minipage environment are handled in a way that is
particularly useful for putting footnotes in figures or tables. A
\footnote command puts the footnote at the bottom of the minipage
instead of at the bottom of the page, and it uses the mpfootnote
counter instead of the ordinary footnote counter. If you want the
footnote in a minipage environment to be placed at the bottom of the
actual page, in the usual fashion, use the \footnotemark and
\footnotetext commands.

Note: if you put one minipage inside another and if you are using
footnotes, they may wind up at the bottom of the wrong minipage.

# The "math" environment

There are four environments that put LaTeX in math mode:

- inlinemath (see below)
- displaymath
- eqnarray
- equation

All four of these environments are typeset in math mode, using a math
italic font and LaTeX ideas about spacing in math mode. (See also math
fonts and styles.)

The inlinemath environment is for formulas that appear right in the text.
The displaymath, eqnarray, and equation environments are for formulas
that apppear on their own line(s). The math environment can be used in
both paragraph and LR mode, but displaymath, eqnarray, and equation
environments can be used only in paragraph mode.

The inlinemath environment may be specified, as with all environments, by

    \begin{math} math equation \end{math}

However, it is used so often that it has two equivalent shorter forms:

    \( math equation \) 

or just

    $ math equation $

In LaTeX2e one can also use

    \ensuremath{math equation}

For example, Subscripts and superscripts can only be used in math
mode. To include these in running text one could use:

    The formula for water is H$_2$O.
    If the hypotenuse is $c$, then $c^2=a^2+b^2$.

Note that it is standard to use math mode for letters, such as the the
c above, which are to be shown as math variables.

