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




