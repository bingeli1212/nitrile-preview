---
title: LATEX list
---

list
 \begin{list}{label}{spacing}
 \item First item
 \item Second item
 ....
 \end{list}
The label argument specifies the default label for items in the list; it may be overriden with the optional argument of the \item command. It is a piece of text that is inserted in a box to form the label. This argument can and usually does contain other LaTeX commands.

The spacing argument contains commands to change the spacing parameters for the list. This argument will most often be null, i.e. {}. This will select default spacings, which depends on the document style and options, and which should suffice for most cases. However, the commands which can be put here are

\topsep - amount of extra vertical space at top of list
\partopsep - extra length at top if environment is preceded by a blank line (it should be a rubber length)
\itemsep - amount of extra vertical space between items
\parsep - amount of vertical space between paragraphs within an item
\leftmargin - horizontal distance between the left margins of the environment and the list; must be nonnegative
\rightmargin - horizontal distance betwen the right margins of the enviroment and the list; must be nonnegative
\listparindent - amount of extra space for paragraph indent after the first in an item; can be negative
\itemindent - indentation of first line of an item; can be negative
\labelsep - separation between end of the box containing the label and the text of the first line of an item
\labelwidth - normal width of the box containing the label; if the actual label is bigger, the natural width is used, extending into the space for the first line of the item's text
\makelabel{label} - generates the label printed by the \item command
\usecounter{ctr} enables the counter ctr to be used for numbering items; it is initialized to zero and stepped when executing an \item command that has no optional label argument.
An Example
An simple example of things that can be done with the List Enviroment will illustrate typical usage of the arguments. The following will make a list numbered by "Item-#", where the # is an upper case Roman numeral, and will indent the right margin the same as the left margin (it is not normally indented in most styles).

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
