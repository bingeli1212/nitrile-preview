---
title: The "Beamer.JS" translation
---

The "Beamer.JS" translation intends to produce one or more slides
using the LATEX "beamer" class.

# The checkboxes

Following is an example of problem set that would show
three checkboxes each for one of the multiple choices,
and with a solution that "A" is the correct answer,
which corresponds to the first choice.

    Q: What is the type of the syllogism for the following 
    sentence?

      1. All cars have wheels.
      2. I drive a car.
      3. Therefore, my car has wheels.

    ~~~{checkbox}
    A. Categorical (If A is in C then B is in C)
    B. Disjunctive (If A is not true then B is true)
    C. Hypothetical (If A is true then B is true)
    ~~~

    [ Answer ] : A

By default, a pattern of a set of square brackets with
a letter or digit inside followed by a semicolon is recognized
by NITRILE to treach this item as having asked for a checkbox
to be placed to its left hand side before all existing texts.

For "Beamer.JS" translation recognizes that if the body text 
of the solution block starts with a semicolon and followed
by a white space, then
the body text is to express an answer to a multiple choice
question in the main section.

In this case, it would remove the initial semicolon
and then trim the body text, and then treat it as a string
that describes the answer. The answer would look like
"A" for choosing the first choice, or "A B" for
having chosen the first two choices. Note that the answer
must corresponds to the letter placed inside the brackets
exactly.

The bull-paragraph is able to change some of the checkboxes
to a "checked box" rather than an "unchecked box" if it has
found the presence of a selection-style option. For instance,
if the selection-style option contains a string that is "A B", 
then both the checkboxes corresponding to choice "A" and "B"
will be shown as "checked box", while the choice of "C" will
be shown as "unchecked box".

