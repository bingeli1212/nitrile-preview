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

# The "quotation" environment

    \begin{quotation}
    text
    \end{quotation}

The margins of the quotation environment are indented on the left and
the right. The text is justified at both margins and there is
paragraph indentation. Leaving a blank line between text produces a
new paragraph.

For a short quote (one paragraph), use the quote environment.

