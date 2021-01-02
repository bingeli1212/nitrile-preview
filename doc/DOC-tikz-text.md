---
titile: TIKZ showing texts
---

A short example derived from the pgf/tikZ 2.10 manual.

    \documentclass{minimal}
    \usepackage{tikz}
    \usetikzlibrary{automata,positioning}
    \begin{document}
      \begin{tikzpicture}[%
        >=stealth,
        node distance=3cm,
        on grid,
        auto
      ]
        \node[state] (A)              {A};
        \node        (B) [right of=A,fill=blue!25,text width=3cm]{This is a demonstration text for showing how line breaking works.};;
        \path[->] (A) edge (B);
      \end{tikzpicture}
    \end{document}

For text alignment there is also the align option.

You can just put a simple tabular environment, if you want to control
the break. For instance, use

    \node (mynode) [mystyle,right=of anothernode] {\begin{tabular}{c} This node \\ is \\ valuable \end{tabular}};

One can use an environment inside of the node that forces line breaking or creates a line-breaking environment in order to achieve line breaking inside of the node. The example in the manual uses the tabular environment:

    \documentclass{article}
    \usepackage{tikz}
    \begin{document}
    \begin{tikzpicture}
    \node [draw] (example-tabular) {
    \begin{tabular}{cc}
    eaxmple1 & example2 \\
    example 3 & example4 \\
    \end{tabular}
    };
    \end{tikzpicture}
    \end{document}

If you want to manually insert line breaks, you can use \\ and the
optional argument align. (If you do not specify an option for align,
the line breaking will not happen, and the problem noted by the OP
will occur.)

    \begin{tikzpicture}
    \node (example-align) [draw, align=left]{example \\ example example};
    \end{tikzpicture}

The advantage to this option is that the size of the node is
automatically set to the width of the longest line inside the node, as
can be seen in the accompanying image, where the width of the node is
set to the width of the second line. The disadvantage to this solution
is that you have to manually control the line breaking yourself (more
on this below).

It is also worth noting that you can control the spacing of the lines
via an optional argument of the \\ command:

    \begin{tikzpicture}
    \node (example-align) [draw, align=left]{example \\[5em] example example};
    \end{tikzpicture}

# 2. Use \\ and align.

If you want to manually insert line breaks, you can use \\ and the
optional argument align. (If you do not specify an option for align,
the line breaking will not happen, and the problem noted by the OP
will occur.)

    \begin{tikzpicture}
    \node (example-align) [draw, align=left]{example \\ example example};
    \end{tikzpicture}

The advantage to this option is that the size of the node is
automatically set to the width of the longest line inside the node, as
can be seen in the accompanying image, where the width of the node is
set to the width of the second line. The disadvantage to this solution
is that you have to manually control the line breaking yourself (more
on this below).

It is also worth noting that you can control the spacing of the lines
via an optional argument of the \\ command:

    \begin{tikzpicture}
    \node (example-align) [draw, align=left]{example \\[5em] example example};
    \end{tikzpicture}

# 3. Use text width and \\ (and maybe align, too).

Finally, the third option noted in the TikZ-PGF manual is to use the
text width argument, which, I believe, internally creates a minipage
environment. This solution manually sets the width of the node, and it
can then be used in conjunction with manual line breaking:

    \begin{tikzpicture}
    \node (example-textwidth-1) [draw, text width=3cm]{example \\ example};
    \end{tikzpicture}

Additionally, it can be used with a lengthier block of text whose
default width is greater than the width specified via text width. In
such cases, the text will automatically wrap inside a box of the
specified width:

    \begin{tikzpicture}
    \node (example-textwidth-2) [draw, text width=3cm]{This is a demonstration text for showing how line breaking works.};
    \end{tikzpicture}

The text width argument can also be used in conjunction with the align
argument to produce different effects. The options for align are left,
flush left, right, flush right, center, flush center, justify, and
none. See pp. 225-227 for the details of the different effects of
these align options in conjunction with the text width argument.

In brief, however, the flush variants do not try to balance left and
right borders via hyphenation. In my opinion, the result often does
not look good (see picture), but it can be used if, for whatever
reason, you do wish to avoid hyphenation.

# Using a begin-end-tabular

Using this is suggested by some people. However the only problem is that
it increases the distance of the text from the anchor point.
If this is not of a concern then it is possible to use this technique.






