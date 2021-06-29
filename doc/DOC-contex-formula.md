---
title: Formula
doc: page
---

# Typeset Formulas

Two examples:

    \placeformula[formula:aformula]
    \startformula
       y=xˆ2
    \stopformula

    \placeformula
    \startformula
      \int_0ˆ1 xˆ2 dx
    \stopformula

Between \startformula and \stopformula you are in math mode so you can define
any formula you want by using TEX commands. We advise you to have some further
reading on typesetting formulas in TEX. 

- The TEXBook by D.E. Knuth
- The Beginners Book of TEX by S. Levy and R. Seroul

Math mode can occur in two modes: in text mode and display mode. Mathematic
expres- sions in text mode are placed between $ and $.

    The Hasselt community covers an area of 42,05 \Square \Kilo \Meter.
    Now if you consider a circular area of this size with the market
    place of Hasselt as the center point $M$ you can calculate its
    diameter with ${{1}\over{4}} \pi rˆ2$.

If you type the following you will get an expression that is showned centered 
horizontally.

    $$
    \int_0ˆ1 xˆ2 dx
    $$

If you compare $$ with the first examples you’ll notice that \startformula and
\stopformula is equivalent to the $$.

    \placeformula[middle one]
        \startformula
        y=xˆ3
        \stopformula

The label "middle one" is used for referring to this formula in other part of the
document. Such a reference can be made as 

    \in{formula}[middle one].

If no numbering is required you type: 

    \placeformula[-]

Numbering of formulas is set up with \setupnumbering. In this manual numbering
is set up with \setupnumbering[way=bychapter]. This means that the chapter
number preceeds the formula number and numbering is reset with each new
chapter. For reasons of consistency the tables, figures, intermezzos etcetera
are numbered in the same way. Therefore you use \setupnumbering in the set up
area of your input file.

Formulas can be set up with:

    \setupformulas[..,..=..,..]
