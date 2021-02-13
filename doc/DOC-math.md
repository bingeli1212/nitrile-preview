---
title: The math-fence
---


# The inlinemath-fence

The math-phrase is to be recognized by the leading
backslash-left-parenthesis and ending backslash-right-parenthesis. For
example, The following text would have been recognized as a
math-phrase.

    \( \sqrt{2} \)

The spaces inside this phrase is typically ignored, although it is
sometimes necessary in order to play a role of distinguish between a
backslash-lead-symbol and a variable that follows, such as the
following

    \( \log x )

If there had been no space between the word "\log" and "x" it would
have been recognized as a symbol that is "\logx" instead of "\log".



# The displaymath-fence

A displaymath-phrase is to be recognized by the leading
backslash-left-bracket and ending-right-bracket. For instance,
following text would have been recognized as a displaymath-phrase.

    \[ \sqrt{2} \]

For LATEX translation this phrase is to be translated into the normal
LATEX display math form. For HTML translation the same effect on LATEX
will need to be simulated by styling all ".DISPLAYMATH" elements with
the ``display:block`` CSS property, and optionally setting the
``margin:0.5em auto`` such that it will be centered horizontally and
with some vertical margin.



# The math-fence

    ```math
    15 &= 25 - 10 \newline
        &= - 100 + 1 + 99 + 25 - 10  \newline
        &= - 100 + 1 + ( 99 - 10 ) + 25 \newline
        &= - 100 + 1 + 89 + 25 \newline
        &= - 100 + 1 + ( 89 + 25 ) \newline
        &= - 100 + 1 + 114 \newline
        &= - 100 + 115 \newline
        &= 15
    ```