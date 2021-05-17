---
title: LATEX tabbing
latex.parskip: 1
---

How to use Tabs in LaTeX
To use tabs, you want to use the "tabbing" environment. (This is all described on page 62 of the latex book). It's probably easiest to explain this by example:

    \begin{tabbing}
    If \= it's raining \\
    \> then \= put on boots,\\
    \> \> take hat;\\
    \> or \> smile. \\
    Leave house.
    \end{tabbing}

This would produce:

```ink
If it's raining
   then put on boots
        take hat;
   or   smile.
Leave house.
```

Tab stops are set with the \= command, and \> moves to the next tab stop.
Lines are separted by the \ \ command.

Here are some of the other commands that are available in this environment:

~~~
+ \+   
  Causes left margin of subsequent lines to be indented one tab stop to the right, 
  just as if a \> command were added to the beginning of subsequent lines.
+ \-   
  Undoes the effect of a previous \+.
+ \'   
  Indents text flush right against the next tab stop.
~~~

For a full description of all the commands available in this environment, see Section C.9.1 of the LaTeX manual.