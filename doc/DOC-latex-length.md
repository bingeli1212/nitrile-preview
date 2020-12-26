---
title: LATEX length
---

Lengths are units of distance relative to some document elements.
Lengths can be changed by the command:

    \setlength{\lengthname}{value_in_specified_unit}

For example, in a two-column document the column separation can be set
to 1 inch by:

    \setlength{\columnsep}{1in}

Below is a table with some of the most common lengths and their description

~~~
- \baselineskip	Vertical distance between lines in a paragraph
- \columnsep	Distance between columns
- \columnwidth	The width of a column
- \evensidemargin	Margin of even pages, commonly used in two-sided documents such as books
- \linewidth	Width of the line in the current environment.
- \oddsidemargin	Margin of odd pages, commonly used in two-sided documents such as books
- \paperwidth	Width of the page
- \paperheight	Height of the page
- \parindent	Paragraph indentation
- \parskip	Vertical space between paragraphs
- \tabcolsep	Separation between columns in a table (tabular environment)
- \textheight	Height of the text area in the page
- \textwidth	Width of the text area in the page
- \topmargin	Length of the top margin
~~~

Default lengths can not only be set to any desired value, they can
also be used as units to set the dimensions of other LATEX elements.
For instance, you can set an image to have a width of one quarter the
total text width.

    \includegraphics[width=0.25\textwidth]{lion-logo}
    [...]

In the command \includegraphics the width is set to 0.25 the width of
the entire text area (see Inserting Images for more information about
this command). You can use any length and multiply it by any factor.