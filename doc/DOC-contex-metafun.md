---
title: MetaFun
camer.setupbodyfont: linux,11pt
---

# Introduction

This document is about METAPOST and TEX. The former is a graphic programming
language, the latter a typographic programming language. However, in this
document we will not focus on real programming, but more on how we can
interface between those two languages. We will do so by using CONTEXT, a macro
package written in TEX, in which support for METAPOST is integrated in the
core. The TEX macros are integrated in CONTEXT, and the METAPOST macros are
bundled in METAFUN.

When Donald Knuth wrote his typographical programming language TEX he was in
need for fonts, especially mathematical fonts. So, as a side track, he started
writing METAFONT, a graphical lan- guage. When you read between the lines in
the METAFONT book and the source code, the name John Hobby is mentioned
alongside complicated formulas. It will be no surprise then, that, since he
was tightly involved in the development of METAFONT, after a few years his
METAPOST showed up.

While its ancestor METAFONT was originally targeted at designing fonts,
METAPOST is more ori- ented to drawing graphics as used in scientific
publications. Since METAFONT produced bitmap output, some of its operators
make use of this fact. METAPOST on the other hand produces POST- SCRIPT code,
which means that it has some features not present in METAFONT and vice versa.

With METAFUN I will demonstrate that METAPOST can also be used, or misused,
for less technical drawing purposes. We will see that METAPOST can fill in
some gaps in TEX, especially its lack of graphic capabilities. We will
demonstrate that graphics can make a document more attractive, even if it is
processed in a batch processing system like TEX. Most of all, we will see that
embedding METAPOST definitions in the TEX source enables a smooth
communication between both programs.

The best starting point for using METAPOST is the manual written by its author
John Hobby. You can find this manual at every main TEX repository. Also, a
copy of the METAFONT book from Donald Knuth is worth every cent, if only
because it will give you the feeling that many years of graphical fun lays
ahead.

In this METAFUN manual we will demonstrate how you can embed graphics in a TEX
document, but we will also introduce most of the features of METAPOST. For
this reason you will see a lot of METAPOST code. For sure there are better
methods to solve problems, but I have tried to demon- strate different methods
and techniques as much as possible.

I started using METAPOST long after I started using TEX, and I never regret
it. Although I like TEX very much, I must admit that sometimes using METAPOST
is even more fun. Therefore, before we start exploring both in depth, I want
to thank their creators, Donald Knuth and John Hobby, for providing me these
fabulous tools. Of course I also need to thank Hàn Thế Thành, for giving
the TEX community PDFTEX, as well as providing me the hooks I considered
necessary for implementing some of the features presented here. In the
meantime Taco Hoekwater has created the METAPOST library so that it can be an
integral component of LUATEX. After that happened, the program was extended to
deal with more than one number implementation: in addition to scaled integers
we now can switch to floats and arbitrary precision decimal or binary
calculations. I myself proto- typed a simple but efficient LUA script
interface. With Luigi Scarso, who is now the maintainer of METAPOST, we keep
improving the system, so who knows what will show up next.

I also want to thank David Arnold and Ton Otten for their fast proofreading,
for providing me useful input, and for testing the examples. Without David’s
patience and help, this document would be far from perfect English and less
complete. Without Ton’s help, many small typos would have gone unnoticed.

In the second version of this manual the content was been adapted to CONTEXT
MKIV that uses LUATEX and the built in METAPOST library. In the meantime some
LUA has been brought into the game, not only to help construct graphics, but
also as a communication channel. In the process some extra features have been
added and some interfacing has been upgraded. The third version of this
document deals with that too. It makes no sense to maintain compatibility with
CONTEXT MKII, but many examples can be used there as well. In the meantime
most CONTEXT users have switched to MKIV, so this is no real issue. In the
fourth update some new features are presented and the discussion of obsolete
ones have been removed.

The fifth update describes the MPIV version of METAFUN which brings some more
and improved functionality. Some examples are inspired from questions by users
and examples that Alan Braslau, Luigi Scarso and I made when testing new
features and macros. Some examples can be rewritten in a more efficient way
but are kept as they are. Therefore this manual presents dif- ferent ways to
solve problems. Hopefully this is not too confusing. Numerous examples can be
found in the other manuals and test suite.

Hans Hagen Hasselt NL March 2017


# Paths

Paths are the building blocks of METAPOST graphics. In its simplest form, a
path is a single point. Such a point is identified by two numbers, which
represent the horizontal and vertical position, often referred to as 𝑥 and 𝑦,
or (𝑥, 𝑦). Because there are two numbers involved, in METAPOST this point is
called a pair. Its related datatype is therefore pair. The following
statements assigns the point we showed previously to a pair variable.

    pair somepoint ; somepoint := (1cm,1.5cm) ;

However, for path the variable should be declared as "path" instead of "pair".

    path somepoint; somepoint := (1cm,1.5cm);

A path consists of more than one points. When two points are connected
such that a straight line should be drawn between these two points, then
it can be expressed by the following command:

    path a; a = (1cm,1.5cm)--(2cm,1.5cm);

This is the format created by John Hobby when he first started MetaPost. The
"double-hyphen" could be considered an operator such that it would establish 
a connection between two points that are on either side of this operator. 
In  addition, he has created the "double period" operator such that a Bezier
curve is to be created between three or more points such that it pass through
all these points. See figure &ref{fig:metafun-path} for the looks of generating
pictures with straight lines and curved lines.

    path a: a = (1cm,1.5cm)..(2cm,1.5cm)..(2cm,2cm);

@ figure{subfigure}
  &label{fig:metafun-path}
  The figure on the left hand side is the path of "(1cm,1.5cm)--(2cm,1.5cm)".
  the figure on the right hand side is the path of "(1cm,1.5cm)..(2cm,1.5cm)..(2cm,2cm)".

  ```img{outline,width:2cm}
  image-metafun-1.png
  ```

  ```img{outline,width:2cm}
  image-metafun-2.png
  ```




# Named Colors

The withcolor operator accepts a color expression but in METAFUN it also accepts a string indicat- ing a color defined at the TEX end. Most helpers that deal with colors are able to deal with named colors as well. Here are some examples. First we define a few colors:

    \definecolor[MyColor1][r=.5]
    \definecolor[MyColor2][g=.5]
    \definecolor[MyColor3][b=.5]
    \definecolor[MyColor4][s=.8]

Here we access them:

    fill fullcircle scaled 12 withcolor "MyColor1" ;
    fill fullcircle scaled 10 withcolor "MyColor2" ;
    fill fullcircle scaled  8 withcolor complementary "MyColor3" ;
    fill fullcircle scaled  6 withcolor complemented "MyColor3" ;
    fill fullcircle scaled  4 withcolor "MyColor4" randomized 2 ;
    fill fullcircle scaled  2 withcolor "MyColor4" randomized 2 ;
    addbackground
        withcolor .5[resolvedcolor("MyColor4"),resolvedcolor("MyColor2")] ;
    currentpicture := currentpicture ysized 4cm ;


# Text Labels

Text support in METAFUN has evolved quite a bit over years. For compatibility
reasons we keep old methods around but in practice one can probably do all
with the following:

    textext[.anchor](str)
    thetextext[.anchor](str,pos)
    rawtextext[.anchor](str,pos)

position a text relative to the origin position a text relative to the given
position idem but with less checking

If needed all functionality could be combined in one call (textext) but we
keep it this way.

You need to keep in mind that text in METAPOST is not a first class object but
something virtual that is known to METAFUN as something with path like
properties but is actually dealt with in the backend. This means that timing
is important.

    \startMPinitializations
    picture p ; p := image(draw textext("Foo"););
    \stopMPinitializations
    \startMPcode
      picture q ; q := image(draw textext("Bar"););
      picture r ; r := image(draw textext("Gnu"););
      draw p ;
      draw q shifted (2cm,0) ;
      draw r shifted (4cm,0) ;
    \stopMPcode

This will work out well because an initialization is part of a figure, but
this will fail:

    \startMPinclusions
    picture p ; p := image(draw textext("Foo"););
    \stopMPinclusions

because inclusions happen before the local textexts get initialized and due to the multipass implementation are not seeN a second time. The order of processing is:

    action             first pass      second pass
    definitions        yes
    extensions         yes
    inclusions         yes
    begin figure       yes             yes
    initializations    yes             yes
    metapost code      yes             yes
    end figure         yes             yes

The graph package (that comes with METAPOST) has some pseudo typesetting on board needed to format numbers. Because we don’t want to interfere with the definitions of macros used in that package we provide another set of macros for formatting: fmttext, thefmttext and rawfmttext.

    \startMPcode
    draw thefmttext("\bf@3.2f done",123.45678) withcolor darkred ;
    \stopMPcode

Here we pass one variable to the format but there can be more: 123.46 done. In
LUA the percentage sign (%) is used as format directive but that does not work
well in TEX and LUA which is why we use the at-sign (@) instead. The
formatting is done with the formatters subsystem which is an extension to the
regular LUA format function. More information can be found in clf-mkiv.pdf but
one extension is not mentioned there: ``%!texexp!``. This directive takes one
argument by default but optionally can take one or two extra arguments: the
format of the base number and one for the exponent. The following code
demonstrates this:

    \startMPcode{doublefun}
      draw image (
       draw thefmttext.rt("@!texexp!", 10.4698E30,
       draw thefmttext.rt("@1!texexp!",10.4698E30,
       draw thefmttext.rt("@2!texexp!",10.4698E30,"@2.3f",
       draw thefmttext.rt("@3!texexp!",10.4698E30,false,"@2i",  (0,-4LineHeight)) ;
       draw thefmttext.rt("@3!texexp!",10.4698E30,"@2.3f","@2i",(0,-5LineHeight)) ;
      ) withcolor darkblue ;
    \stopMPcode

We switch to double mode because we use large numbers.

    1.046980 × 10³¹
    1.046980 × 10³¹
    1.047 × 10³¹
    1.046980 × 10³¹
    1.047 × 10³¹

Of course this extra formatter is also supported in the context command:

    \startluacode
    context("%!texexp!, ",
    context("%1!texexp!, ",
    context("%2!texexp!, ",
    context("%3!texexp! and ",10.4698E30,false,"@2i")
    context("%3!texexp!",     10.4698E30,"@2.3f","@2i")
    \stopluacode

This would have generated the same output as the one shown above.



# Spot Colors

# Transparency

# Clipping

# Shading

# Typesetting TEX Label

# Page Background

# Layered Graphics

# Using MetaFun Without ConTEX

# Debugging


