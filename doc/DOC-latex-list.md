---
title: LATEX list
---

# The "list" environment

    \begin{list}{label}{spacing}
    \item First item
    \item Second item
    ....
    \end{list}

The label argument specifies the default label for items in the list;
it may be overriden with the optional argument of the \item command.
It is a piece of text that is inserted in a box to form the label.
This argument can and usually does contain other LaTeX commands.

The spacing argument contains commands to change the spacing
parameters for the list. This argument will most often be null, i.e.
{}. This will select default spacings, which depends on the document
style and options, and which should suffice for most cases. However,
the commands which can be put here are

~~~
- \topsep - amount of extra vertical space at top of list
- \partopsep - extra length at top if environment is preceded by a blank line (it should be a rubber length)
- \itemsep - amount of extra vertical space between items
- \parsep - amount of vertical space between paragraphs within an item
- \leftmargin - horizontal distance between the left margins of the environment and the list; must be nonnegative
- \rightmargin - horizontal distance betwen the right margins of the enviroment and the list; must be nonnegative
- \listparindent - amount of extra space for paragraph indent after the first in an item; can be negative
- \itemindent - indentation of first line of an item; can be negative
- \labelsep - separation between end of the box containing the label and the text of the first line of an item
- \labelwidth - normal width of the box containing the label; if the actual label is bigger, the natural width is used, extending into the space for the first line of the item's text
- \makelabel{label} - generates the label printed by the \item command
- \usecounter{ctr} enables the counter ctr to be used for numbering items; it is initialized to zero and stepped when executing an \item command that has no optional label argument.
~~~

An simple example of things that can be done with the List Enviroment
will illustrate typical usage of the arguments. The following will
make a list numbered by "Item-#", where the # is an upper case Roman
numeral, and will indent the right margin the same as the left margin
(it is not normally indented in most styles).

    %    define "Lcount" as a counter
    \newcounter{Lcount}
    %    set the "default" label to print counter as a Roman numeral 
    \begin{list}{Item-\Roman{Lcount}}
    %    inform the list command to use this counter
      {\usecounter{Lcount}
    %    set rightmargin equal to leftmargin
      \setlength{\rightmargin}{\leftmargin}}
    %    we can now begin the "items"
    \item This is the first item
    \item And this is the second item
    \end{list}

Note that this would produce something like:

    Item-I  This is the first item
    Item-II And this is the second item

For the \item command, it is possible to specify a text to be treated 
as the "bullet" for this item. If this is the case, then the bullet
will appear to the left hand side of the list item. For example,
the following example would have flushed the word "A.", "B.", and "C."
with the left margin, which is 0pt. Comparing the same example with 
the second example, the one being flushed against with the left
margin is the "{\faSquare0}" word; and the bullets are "A.", "B.",
and "C.", which is placed to the left hand side of the left margin.

    \begin{list}{}{\setlength\itemsep{0pt}\setlength\parsep{0pt}\setlength\leftmargin{0pt}}
    \item A. {\faSquareO}~~Categorical (If A is in C then B is in C)
    \item B. {\faSquareO}~~Disjunctive (If A is not true then B is true)
    \item C. {\faCheckSquareO}~~Hypothetical (If A is true then B is true)
    \end{list}

    \begin{list}{}{\setlength\itemsep{0pt}\setlength\parsep{0pt}\setlength\leftmargin{0pt}}
    \item[A.] {\faSquareO}~~Categorical (If A is in C then B is in C)
    \item[B.] {\faSquareO}~~Disjunctive (If A is not true then B is true)
    \item[C.] {\faCheckSquareO}~~Hypothetical (If A is true then B is true)
    \end{list}


# The "itemize" environment

    \begin{itemize}
    \item First item
    \item Second item
    ....
    \end{itemize}

The itemize environment produces a list with "tick-marks" (typically
"bullets" for first level). Itemizations can be nested within one
another, up to four levels deep.

be at least one \item command within the environment.
Each item of an itemized list begins with an \item command. There must

The default optional label argument of the \item command is given by
the \labelitemi, \labelitemii, \labelitemiii, \labelitemiv commands,
respectively, depending on the nesting level. These may be redefined
with the \renewcommand command. For example, to make the first level
marks nice five-point stars,

    \renewcommand{\labelitemi}{$\star$}

# The "enumerate" environment

    \begin{enumerate}
    \item First item
    \item Second item
    ....
    \end{enumerate}

The enumerate environment produces a numbered list. Enumerations can
be nested within one another, up to four levels deep. They can also be
nested within other paragraph-making environments.

There must be at least one \item command within the environment.
Each item of an enumerated list begins with an \item command. The
optional label argument of the \item command, if given, suppresses
incrementing the counter. If not given the default labels are taken
from the counters, enumi, enumii, enumiii, enumiv for the four allowed
levels of nesting, respectively.

The numbering style for the enumeration is determined by the commands,
\labelenumi, \labelenumii, etc., for the nested levels. These may be
redefined with the \renewcommand command. For example, to use upper
case letters for the first level and lower case letters for the second
level of enumeration:

    \renewcommand{\labelenumi}{\Alph{enumi}}
    \renewcommand{\labelenumii}{\alph{enumii}}



