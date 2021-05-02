---
title: Styling Texts
---

# Struts

A strut is a little invisible block without width but with the maximal height
and depth of a character or line. If you want to force these maximal
dimensions, for example when you are using boxes in your own commands, than you
can use the command \strut:

    \hbox{\strut test}

If we leave out the strut in this example the box has no depth. The characters
in the word test don’t reach under the baseline. Compare for example (with
strut) with .  

Many commands use struts automatically. If for some reason you
don’t want struts you can try to suppress them by \setnostrut. However take
care that this command works only locally. A strut can be set by \setstrut.

The struts that are used by ConTEXt can be made visible with the command:

    \showstruts


# Text In The Margin

Texts can be place in the margins with:

    \inmargin[.1.][ref]{.2.}
    .1. + - low 
    .2. text

A new line in a margin text is forced with double-blackslash. An example of a
margin text is follows, in which the words "Hello" and "World" is to appear in
the margin area that on the left-hand side of the paragraph starting with "It
would...". 

    \inmargin{Hello\\World}It would be great
    if the recent reduction in washing powder 
    needed to get your wash perfectly clean had 
    resulted in an equal reduction of time needed 
    to advertise this kind of products.

When this command is used in the middle of a paragraph, the margin text will
appear on the same line as the text that comes immediately after the command. 

The command \inmargin could also puts the text in the right margin. The
location where the text will show up depends on the character of the document:
single-sided or double-sided. You can also force the text into a specific
margin, using:

    \inleft[.1.][ref]{.2.}
    .1.   + - low
    .2.   text

or,

    \inright[.1.][ref]{.2.}
    .1.   + - low
    .2.   text

There is also the,

    \inothermargin[.1.][ref]{.2.}
    .1.   + - low
    .2.   text

Following is an example:

    startlines
    \inleft{to be}\quotation{To be or not to be} to me
    \inright{or not}is rather famous english
    \inmargin{to be}And just as it is meant to be
    that quote will never perish
    \stoplines

After typesetting, the margin text "to be" will be shown inside the left margin
at the same line as the first line of the body paragraph; and "or not" will be
shown inside the right margin, at the same line as "is rather famous english";
and "to be" will be shown inside the right margin as the line "And just as it
is meant to be".



# Subscript and superscript

There are three commands to create superscript and subscript
outside the math mode:

    \high{...}
    ...  text

or 

    \low{...}
    ...  text

or

    \lohi[.1.]{.2.}{.3.}
    .1.   low
    .2.   text
    .3.   text

The next example illustrates the use of these commands:

    You can walk on \high{high} heels
    or \low{low} heels but your height
    is still the same.

The \high and \low command could be an advantage over the math mode subscript
and superscript in situations where the base text is set to a different font
size.  In these situations the subscript and superscript will be changed its
font size to go with the font size of the base text, while the math mode text
will remain the same size regardless.



# Framing a running text

To frame part of a running text the \framed command can be used.

    \placefigure
      [left]
      {none}
      {\framed[align=middle]{happy\\birthday\\to you}}



# Framing an entire paragraph

To frame an entire paragraph use the \startframedtext command.

    \startframedtext[left]
    From an experiment that was conducted by C. van Noort (1993) it was
    shown that the use of intermezzos as an attention enhancer is not very
    effective.
    \stopframedtext

The \startframedtext comes with the following configurable options:

    setupframedtexts[..,..=..,..]
    bodyfont          5pt ... 12pt small big
    style             normal bold slanted boldslanted type small... 
                      command command
    left              command
    right             command
    before            command
    after             command
    inner             command
    linecorrection    on off   
    depthcorrection   on off    
    margin            standard yes no
    ..=..             see p 210: \setupframed



# Black Rules

A Black Rules refers to a filled rectangle area that looks like a black box.

    \blackrule[..,..=..,..]
    ..=..  see p 216: \setupblackrules

When the setup is left out, the default setup is used.

    \setupblackrules[..,..=..,..]
    width         dimension max
    height        dimension max
    depth         dimension max
    alternative   a b
    distance      dimension
    n             number

The height, depth, and width of a black rule are in accordance with
the usual height, depth and width of TEX. When set to "max" 
isntead of a real value the dimensions of TEX's \strutbox command
are used. When we set all three dimensions to "max" we get.

Black rules may have different purposes. You can use them as identifiers of
sections or subsections. This paragraph is tagged by a black rule with default
dimensions: 

    \inleft{\blackrule}.

A series of black rules can be typeset by using:

    \blackrules[..,..=..,..]
    ..=..   see p 216: \setupblackrules

There are two versions. Version a sets n black rules next to each other with an
equal specified width. Version b divides the specified width over the number of
rules. This paragraph is tagged with \inleft{\blackrules}. The setup after
\blackrule and \blackrules are optional.



# Grids

We can make squared paper (a sort of grid) with the command:

    \grid[..,..=..,..]
    x            number
    y            number
    nx           number
    ny           number
    dx           number
    dy           number
    xstep        number
    ystep        number
    offset       yes no
    factor       number
    scale        number
    unit         cmptemmmexesin 
    location     left middle

The default setup produces a grid of 10 boxes horizontally
and 10 boxes vertically. This grid can be used in the background
when defining interactive areas in a figure. And for the sake
of completeness it is described in this chapter.







