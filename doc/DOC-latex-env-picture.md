---
title: LATEX "picture" environment
---

# The "\line" command

    \line(x-slope,y-slope){length}

The \line command draws a line of the specified length and slope.
The slope is determined by (x-slope,y-slope) which are signed integers
of magnitude less than or equal to 6 and which have no common divisor
except for plus or minus one; For example (1,0) is a horizontal line;
(1,1) gives a slope of 45 degress; (0,1) is a vertical line; (-1,1) is
135 degrees.

The horizontal extent of the line is given by the length parameter,
except in the case of a vertical line in which case length specifies
the vertical height.

# The "\qbezier" and "\bezier" commands

    \qbezier[<N>](<AX>,<AY>)(<BX>,<BY>)(<CX>,<CY>)
    \bezier{<N>}(<AX>,<AY>)(<BX>,<BY>)(<CX>,<CY>)

The \qbezier command can be used in picture mode to draw a quadratic
Bezier curve from position (<AX>,<AY>) to (<CX>,<CY>) with control
point (<BX>,<BY>). The optional argument <N> gives the number of
points on the curve.

&img{[height:1cm]./image-img13.png}

is drawn with:

    \begin{picture}(50,50)
    \thicklines
    \qbezier(0,0)(0,50)(50,50)
    \qbezier[20](0,0)(50,0)(50,50)
    \thinlines
    \put(0,0){\line(1,1){50}}
    \end{picture}

The \bezier command is the same, except that the argument <N> is not
optional. It is provided for compatibility with the LaTeX 2.09 bezier
document style option.
