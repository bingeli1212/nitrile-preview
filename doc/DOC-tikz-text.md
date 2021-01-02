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


