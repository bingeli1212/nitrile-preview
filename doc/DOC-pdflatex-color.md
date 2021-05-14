---
title: LATEX text color and color in MetaPost
---

The color in LATEX text is achieved through the *xcolor* package.

    {\textcolor{green}My Text}

The `\textcolor` command is to change the environment so that the 
rest of the text is to be shown with a color of green.

To set a customed color, do the following:

    \colorlet{LightRubineRed}{RubineRed!70!} A new colour named LightRubineRed
        is created, this colour has 70% the intensity of the original RubineRed
        colour. You can think of it as a mixture of 70% RubineRed and 30%
        white. Defining colours in this way is great to obtain different tones
        of a main colour, common practice in corporate brands. In the example,
        you can see the original RubineRed and the new LightRubineRed used in
        two consecutive horizontal rulers.

    \colorlet{Mycolor1}{green!10!orange!90!} A colour named Mycolor1 is created
        with 10% green and 90%orange. You can use any number of colours to
        create new ones with this syntax.

    \definecolor{Mycolor2}{HTML}{00F9DE} The colour Mycolor2 is created using
        the HTML model. Colours in this model must be created with 6
        hexadecimal digits, the characters A,B,C,D,E and F must be upper-case.


The colour models that only xcolor support are:

  -   cmy cyan, magenta, yellow
  -   hsb hue, saturation, brightness
  -   HTML RRGGBB
  -   Gray Grey scale, a number between 1 and 15.
  -   wave Wave length. Between 363 and 814.

Following is an example of defining a new color ultramarine with RGB.

    \documentclass{article}
    \usepackage{xcolor}
    \definecolor{ultramarine}{RGB}{0,32,96}
    \definecolor{wrongultramarine}{rgb}{0.07, 0.04, 0.56}
    \begin{document}
    \textcolor{ultramarine}{Ultramarine \rule{1cm}{1cm}}
    \textcolor{wrongultramarine}{Wrong Ultramarine \rule{1cm}{1cm}}
    \end{document}

LATEX "definecolor" command

The "xcolor" package provides the following command:

    \definecolor{canvascolor}{rgb}{0.643,0.690,0.843}

Once a new color name is defined, it can be used, in places such 
as
   
    The {\color{canvascolor}colored text}.

Colors can be freely combined with other color names without having
to create new color names, 

    The {\color{canvascolor!75!white}color text}.

The "colorlet" command can also be used to create new color name
that is the result of mixing with one or more existing colors.
Following example would provide 75 percent "canvascolor" with 25
percent of "white".

    \colorlet{canvas75}{canvascolor!75!white}

The "definecolor" and "colorlet" commands can appear in a preamble,
but it can also appear as part of a normal text. Following is
a minimal example.

    \documentclass{article}
    \usepackage{xcolor}
    \definecolor{canvascolor}{rgb}{0.643,0.690,0.843}
    \colorlet{canvas75}{canvascolor!75!white}
    \begin{document}
    \noindent\ttfamily
    \color{canvas75}RGB colour canvascolor!75!white\\
    html : \convertcolorspec{named}{canvas75}{HTML}\HTMLcolour
    \HTMLcolour\\
    cmyk : \convertcolorspec{named}{canvas75}{cmyk}\CMYKcolour
    \CMYKcolour
    \end{document}