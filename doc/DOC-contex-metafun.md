---
title: MetaFun
---
%img{frame}

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
all these points. See figure &ref{fig:metafun-path} for the looks of the
generated pictures with the following command and the command above.

    path a: a = (1cm,1.5cm)..(2cm,1.5cm)..(2cm,2cm);

@ figure{subfigure}
  &label{fig:metafun-path}
  The figure on the left hand side is the path of "(1cm,1.5cm)--(2cm,1.5cm)".
  the figure on the right hand side is the path of "(1cm,1.5cm)..(2cm,1.5cm)..(2cm,2cm)".

  ```img{outline,width:2cm}
  image image-metafun-1.png
  ```

  ```img{outline,width:2cm}
  image image-metafun-2.png
  ```

If a path is to be constructed with a 
precise location of one or two control points
of a cubic Bezier curve, it should be constructed with double-dots
and the keyword "controls". Following is an example 
of specifying a control point that is shared by both end points
of the curve.

    path a; a := (1.5cm,1.5cm)..controls (2.75cm,1.25cm)..(2cm,0cm)

Following is an example where there is
a different control point for each end point of a curve.

    path a; a := (1cm,1cm)..controls (.5cm,2cm) and (2.5cm,2cm)..(2cm,.5cm);

@ figure{subfigure}
  &label{fig:metafun-path-controls}
  The figure on the left hand side is the path of "(1cm,1.5cm)--(2cm,1.5cm)".
  the figure on the right hand side is the path of "(1cm,1.5cm)..(2cm,1.5cm)..(2cm,2cm)".

  ```img{outline,width:2cm}
  image image-metafun-3.png
  ```

  ```img{outline,width:2cm}
  image image-metafun-4.png
  ```

# Transformation

Transformation refers to a process called "affine operation"
that would translate points in a two dimensional space such that
after the transformation all parallel lines before the transformation
will stay parallel. Such operations include those that will
move all points to a new location, rotate all points around
a single point, expand and shrink all points around another
point, etc.

    path a; a := (1cm,1.5cm)--(2cm,1.5cm);
    a := a shifted (4cm,3cm);
    a := a rotated 15

The keyword "shifted" and "rotated" are each a keyword
that would trigger
a transformation to be applied to a path before
the keyword. Each keyword is to be followed by a specific
argument that is unique to this keyword. For instance,
the keyword "shifted" is to be expected to be followed 
by a "pair", where
a "rotated" keyword is to be expected to be followed by
a single number. 

Yet another transformation is slanting.  The slant operation’s main
application is in tilting fonts. The 𝑥-coodinates are increased by  a
percentage of their 𝑦-coordinate, so here every 𝑥 becomes 𝑥+1.5𝑦, and the
𝑦-coordinate is left untouched.  

    a slanted 1.5;

It is also possible to have multiple transformations to be
included as part of a path construction.
However, it is to remember that if this is the case, the 
transformation is applied in an order from left to right.
In the following example there are a total of 5 paths 
being created. Note that the path "d" and "e" are not
the same. See figure &ref{fig:metafun-path-transformations}.

    path a; a := (1cm,1cm)--(2cm,2cm);
    path b; b := a rotated 45;
    path c; c := a shifted (5cm,0);
    path d; d := a rotated 45 shifted (5cm,0);
    path e; e := a shifted (5cm,0) rotated 45;
    path f; f := a slanted 1.5;

@ figure{subfigure}
  &label{fig:metafun-path-transformations}
  Each subfigure is assigned the same letter
  as the name of the path expressed in the code
  example.

  ```img{outline,width:2cm}
  image image-metafun-5-1.png
  ```

  ```img{outline,width:2cm}
  image image-metafun-5-2.png
  ```

  ```img{outline,width:2cm}
  image image-metafun-5-3.png
  ```

  ```img{outline,width:2cm}
  image image-metafun-5-4.png
  ```

  ```img{outline,width:2cm}
  image image-metafun-5-5.png
  ```

  ```img{outline,width:2cm}
  image image-metafun-5-6.png
  ```

Table &ref{tab:metafun-all} is a summary that showcases various 
transformation options for a path.

@   table
    &label{tab:metafun-all}
    Path transformations.

    ```tabular
    METAPOST code              mathematical equivalent
    ----------------------------------------------------
    (x,y) shifted (a,b)        (𝑥 + 𝑎, 𝑦 + 𝑏)
    (x,y) scaled s             (𝑠𝑥, 𝑠𝑦)
    (x,y) xscaled s            (𝑠𝑥, 𝑦) 
    (x,y) yscaled s            (𝑥, 𝑠𝑦)
    (x,y) zscaled (u,v)        (𝑥𝑢−𝑦𝑣,𝑥𝑣+𝑦𝑢)
    (x,y) slanted s            (𝑥+𝑠𝑦,𝑦)
    (x,y) rotated r            (𝑥 cos(𝑟) − 𝑦 sin(𝑟), 𝑥 sin(𝑟) + 𝑦 cos(𝑟))
    ```

Another transformation that is not listed 
by the previous table 
is the one named "reflectedabout", which
is to transform the current path such that the new path
is a reflection of the existing one 
off a hypothetical "mirror". This hypothetical 
"mirror" is really a line 
expressed by a pair of coordinates, 
which may or may not be parallel to the x-axis or y-axis. 
Following is an example
that showcases this transformation of a square 
off a hypothetical "mirror" described by two points (2.4cm,-0.5cm) 
and (2.6cm,3cm). The result is shown in figure 
&ref{fig:metafun-reflectedabout}.

    p reflectedabout((2.4cm,-0.5cm),(2.6cm,3cm))

@   figure
    &label{fig:metafun-reflectedabout}
    Two squares where the one on the right hand side
    is a mirrored reflection of the one on the left
    hand side along the line of (2.4cm,-0.5cm),(2.6cm,3cm).

    ```img{outline,width:6cm}
    image image-metafun-6.png
    ```

A ``zscaled`` transformation takes a pair of numbers which is to be 
treated as a vector. When applied, its effect is similar
to that of a rotation, especially when the argument is a unit vector.
However, when the argument is not unit vector, it also has the effect
of expanding or shrinking the path.  

    p zscaled (2,0.5) 

Transformations can also be achieved by an explicitly defined 
transformation matrix. Such a matrix must be assigned to a variable 
whose type is ``transform``. When creating such a matrix, we typically
start with an identity matrix, and then manipulate this matrix
by applying transformations in the same mannor
as if we were working with a path.

    transform t ; 
    t := identity scaled 2cm shifted (4cm,1cm) ; 

With the prevous example, we have created a transformation matrix named
``t``. Once created, we can go ahead and
apply the transformation to an existing path by using
the keyword "transformed" followed by the variable ``t`` 
after an existing path.

    p transformed t

The keyword "identity" is a name of a built-in transformation matrix. The
identity matrix is defined in such a way that it scales by a factor of one in
both directions and shifts over the zero. There are other built-in
transformation matrices as well. Using a transformation matrix can be quite
useful  when it comes to saving typing and enforcing 
consistency when the same transformation is to be repeated in many
different locations. 



# Path Construction Operators

In short, a path is a collection of points and instructions embedded within
each point as to how to connect this point with the one before it. 
The connection between two points of a path is going to come out as a 
straight line or a Bezier curve between these two points when a path
is stroked, or serve as part of a boundary of a closed region.  
In particular, these instructions are stored internally as "control points"
of a cubic Bezier curve.

Take for example the figure &ref{fig:metafun-ellipses}. The figure on the
right hand side shows the location of "control points" embedded inside a
"stroked" path that is on the left hand side, in addition to the locations of
the individual points.

@   figure
    &label{fig:metafun-ellipses}
    The figure on the right
    hand side shows the locations of all "control points" 
    embedded inside a "stroked" path
    that is on the left hand side.

    ```img{outline,width:6cm}
    image image-metafun-7.png
    ```

Note that for a picture, 
there is a concept of an origin, which is location where the point (0,0) would
have been found. There is also the concept of a bounding box, which is the
measurement of a rectangle which is the smallest size possible to cover all paths 
inside a picture.

For an individual path, there is the notion of an "open" path versus that of a
"closed" path. For a closed path its last point always connects the first
point, an concept  that is important when it is used to describe a "closed"
region and which can be used for "filling".  An open path is a path is that
not considered "closed" and can only be used for stroking.

    path z0,z1,z2,z3;
    z0 = (0.5cm,1.5cm) ; 
    z1 = (2.5cm,2.5cm) ;
    z2 = (6.5cm,0.5cm) ; 
    z3 = (3.0cm,1.5cm) ;

Figure-&ref{fig:metafun-op1}-a describes a closed path 
that is ``z0--z1--z2--z3--cycle``. Here, the double-hyphen is 
considered an "operator" such that it adds the information to the path
about how the points of z0 and z1 is to be connected.
In addition, the keyword "cycle" is used to add information necessary
to the path how the last point z3 is to be connected with the first 
point z0.

@   figure{subfigure}
    &label{fig:metafun-op1}
    Path contruction operators.

    ```img{outline,width:6cm,subtitle}
    ``z0--z1--z2--z3--cycle``
    ---
    image image-metafun-8-1.png
    ```

    ```img{outline,width:6cm,subtitle}
    ``z0..z1..z2..z3..cycle``
    ---
    image image-metafun-8-2.png
    ```

    \\

    ```img{outline,width:6cm,subtitle}
    ``z0---z1---z2---z3---cycle``
    ---
    image image-metafun-8-3.png
    ```

    ```img{outline,width:6cm,subtitle}
    ``z0..z1..z2--z3..cycle``
    ---
    image image-metafun-8-4.png
    ```

    \\

    ```img{outline,width:6cm,subtitle}
    ``z0..z1..z2---z3..cycle``
    ---
    image image-metafun-8-5.png
    ```

    ```img{outline,width:6cm,subtitle}
    ``z0..z1..z2 & z2..z3..z0 & cycle``
    ---
    image image-metafun-8-6.png
    ```


However, if we were to change the path construction to look like
``z0..z1..z2..z3..cycle`` 
the result would look different. In particular,
the lines connecting these points will look like smoothed curves 
transitioned smoothly from one point to another. 
See Figure-&ref{fig:metafun-op1}-b.

If the path were to be constructed as 
``z0---z1---z2---z3---cycle`` it would look very much
like that of figure (c).
However, if you were to take a look at the 
location of the control points there are some visible distinctions.
When double-hypen is used, it appears that the connection between
two points are still cubic Bezier, except that the control points
are placed in such locations where a curved line isn't produced.
However, if triple-hyphen is used the result is simply a straight line,
and no control points at all.

The distinction between double-hyphen and triple-hyphen becomes
more apparent if it is to be mixed with a double-dot 
operator. 
Figure-&ref{fig:metafun-op1}-d shows a situation 
where a double-dot is to follow a double-hyphen. 
Figure-&ref{fig:metafun-op1}-e shows a situation
where a double-dot is to following a triple-hyphen. 
Since a double-hyphen would generate a new point
with a control point that is about one-third distance
from itself to the starting point,


It is also a possibility to contruct two or more path components where 
each components is an independent cluster of connected points
using an ampersand operator (&) (Figure-&ref{fig:metafun-op1}-f).



# Named Colors

The withcolor operator accepts a color expression but in METAFUN it also
accepts a string indicating a color defined at the TEX end. Most helpers that
deal with colors are able to deal with named colors as well. Here are some
examples. First we define a few colors:

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
    addbackground withcolor 
      .5[resolvedcolor("MyColor4"),resolvedcolor("MyColor2")] ;
    currentpicture := currentpicture ysized 4cm ;

If want to add a background 
color to a picture you can do that afterwards by using the 
``addbackground`` command.
This command can be handy when you don’t know in advance 
what size the picture will have.
          
    fill fullcircle scaled 1cm withcolor .625red ;
      addbackground withcolor .625 yellow ;

The background is just a filled rectangle that 
gets the same size as the current picture, that is 
put on top of it.



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

because inclusions happen before the local textexts get initialized and due to the multipass implementation are not seeN a second time. The order of processing is shown
by table &ref{fig:metafun-textext-init}.

@   table
    &label{fig:metafun-textext-init}
    Orders of process for showing text.

    ```tabular
    action             first pass      second pass
    -------------------------------------------------
    definitions        yes
    extensions         yes
    inclusions         yes
    begin figure       yes             yes
    initializations    yes             yes
    metapost code      yes             yes
    end figure         yes             yes
    ```

The graph package (that comes with METAPOST) has some pseudo typesetting on board needed to format numbers. Because we don’t want to interfere with the definitions of macros used in that package we provide another set of macros for formatting: fmttext, thefmttext and rawfmttext.

    \startMPcode
    draw thefmttext("\bf@3.2f done",123.45678) 
      withcolor darkred ;
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
       draw thefmttext.rt("@3!texexp!",10.4698E30,false,"@2i",  
                          (0,-4LineHeight)) ;
       draw thefmttext.rt("@3!texexp!",10.4698E30,"@2.3f","@2i",
                          (0,-5LineHeight)) ;
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



# Stroking a Path

Once a path is constructed, it can be stroke, or filled if this 
path is closed. When stroked, typically it will be stroked
using a default line width, and with color black. However,
a different color or line width can be specified.
The common choice of command to stroke a path is ``draw``. But
the ``drawarrow`` command can also be used, which would draw
an arrowhead as well. Following example will produce a stroking
of path that is shown by figure &ref{fig:metafun-stroke-1}.

    path p ; p := (0cm,1cm)..(2cm,2cm)..(4cm,0cm)..(2.5cm,1cm)..cycle ;
    drawarrow p withcolor .625red ;
    draw p shifted (7cm,0) dashed withdots withcolor .625yellow ;

@   figure 
    &label{fig:metafun-stroke-1}
    The result of stroking two paths.
  
    ```img{outline,width:8cm}
    image image-metafun-9.png
    ```

On a side note, once something is drawn, it is placed inside variable named 
``currentpicture`` which is of type ``image``. This variable can be treated
as if it is a customized variable declared by user. For instance, it can be assigned
to another ``image`` variable such as following:

    picture pic ; pic := currentpicture ;

Once assigned, the current picture can be cleared to get ready to hold new
contents. The following command effectively clears the picture memory and
allows us to start anew.

    currentpicture := nullpicture ;

Interestingly, the new picture variable we have created can be "drawn" onto
of the new ``currentpicture`` again by the ``draw`` command, and we
can freely mix shift, rotate and slant transformation
as we wanted.

    draw pic rotated 45 withcolor red ;

A picture can hold multiple paths. You may compare a picture to grouping as
provided by drawing applications. See figure &ref{fig:metafun-multi-picture}
which is the output of the following example.

    draw (0cm,0cm)--(1cm,1cm) ; 
    draw (1cm,0cm)--(0cm,1cm) ;
    picture pic ; pic := currentpicture ;
    draw pic shifted (3cm,0cm) ; 
    draw pic shifted (6cm,0cm) ;
    pic := currentpicture ; 
    draw pic shifted (0cm,2cm) ;

@   figure
    &label{fig:metafun-multi-picture}
    Using ``currentpicture`` to make multiple copies.

    ```img{outline,width:8cm}
    image image-metafun-10.png
    ```



# Units

Like TEX, METAPOST supports multiple units of length. In TEX, these units are
hard coded and handled by the parser, where the internal unit of length is the
scaled point (sp), something on the nanometer range. Because METAPOST is
focused on POSTSCRIPT output, its internal unit is the big point (bp). All
other units are derived from this unit and available as numeric instead of
hard coded. Careful reading reveals that only the bp and in are fixed, while
the rest of the dimensions are scalar multiples of bp.

    mm= 2.83464;
    pt= 0.99626;
    dd= 1.06601;
    bp:= 1; 
    cm = 28.34645 ; 
    pc = 11.95517 ; 
    cc = 12.79213 ; 
    in := 72 ;

Since we are dealing with graphics, the most commonly used dimensions are pt,
bp, mm, cm and in. Following is an example that creates a square of size
1in in both directions, and a circle of 1in in diameter. It is produced
by the following MetaFun code and the result of which is shown by 
figure &ref{fig:metafun-textoneinch}.

    fill fullsquare scaled 72.27pt withcolor .625yellow ;
    fill fullcircle scaled 72.27pt withcolor white ;
    label("72.27pt", center currentpicture) ;

@   figure
    &label{fig:metafun-textoneinch}
    The square and circle of size 1 inch.

    ```img
    image image-metafun-11.png
    ```

In METAPOST the following lines are identical:

    draw fullcircle scaled 100 ;
    draw fullcircle scaled 100bp ;

You might be tempted to omit the unit, but this can be confusing, particularly
if you also program in a language like METAFONT, where the pt is the base
unit. This means that a circle scaled to 100 in METAPOST is not the same as a
circle scaled to 100 in METAFONT. Consider the next definition:



# Scaling a MetaFun Drawing

It is possible to scale an entire MetaFun drawing
by using the \scale command.

    \scale[width=\textwidth]{
      \startMPcode
        draw (0,0)--(100,0)--(100,100)--(0,100)--(0,0);
      \stopMPcode
    }

Or you can just scale the units:

    \showframe
    \starttext
    \startMPcode
      pickup pencircle scaled .5bp ; % defaultpen
      numeric u ; u := (\the\textwidth - .5bp)/1400 ;
      for i = 0 upto 13:
        label(decimal i, ((i + .5) * 100u, 50u)) ;
        draw unitsquare scaled (100u) xshifted (i*100u) ;
      endfor ;
    \stopMPcode
    \stoptext


# Processing with mpost program

You can run the program ``mpost`` to process a 'myfile.mp' file such as the
following:

    outputtemplate := "%j-%c.svg";
    outputformat   := "svg";
    beginfig (1);
      % draw a line
      draw (1cm,2cm) -- (3cm,5cm);
    endfig;
    end.

The command line will look like:

    $ mpost myfile.mp

This will produce a file named ``myfile-1.svg``. The digit '1' in the filename
come from having that digit in ``beginfig(1)`` of the MP file. 
The second line of that file asks that it should generate
a SVG output instead. 
The first line changes the output file
naming so that the output file will be saved as ``myfile-1.svg``. 

Without these two lines the output is a PS file, and the PS file is saved
under the name of ``myfile.1``.


# MetaPost

MetaPost refers to both a programming language and the interpreter of the
MetaPost programming language. Both are derived from Donald Knuth's Metafont
language and interpreter. MetaPost produces vector graphic diagrams from a
geometric/algebraic description. The language shares Metafont's declarative
syntax for manipulating lines, curves, points and geometric transformations.
However,

  beginfig(1) ;
  fill fullcircle scaled 5cm withcolor red ; % a graphic
  endfig ;
  end .

Don’t forget the semi--colons that end the statements. If the file is saved as
yourfile.mp, then the file can be processed. Before we process this file, we
first need to load some basic METAPOST definitions, because the built in
repertoire of commands is rather limited. Such a set is called a format. The
standard format is called metapost but we will use a more extensive set of
macros metafun. In the past such a set was converted into a mem file and
running the above file was done with:

  mpost --mem=metafun.mem yourfile

However, this is no longer the case and macros need to be loaded at startup as
follows:

  mpost --ini metafun.mpii yourfile.mp

Watch the suffix mpii: this refers to the stand alone, the one that doesn’t
rely on LUATEX.  After the run the results are available in yourfile.1 and can
be viewed with GHOSTSCRIPT. You don’t need to close the file so reprocessing is
very convenient.

- Metafont is set up to produce fonts, in the form of image files (in .gf
format) with associated font metric files (in .tfm format), whereas MetaPost
produces EPS, SVG, or PNG files

- The output of Metafont consists of the fonts at a fixed resolution in a
raster-based format, whereas MetaPost's output is vector-based graphics (lines,
Bézier curves)

- Metafont output is monochrome, whereas MetaPost uses RGB or CMYK colors.

- The MetaPost language can include text labels on the diagrams, either strings
from a specified font, or anything else that can be typeset with TeX.

- Starting with version 1.8, Metapost allows floating-point arithmetic with 64
bits (default: 32 bit fixed-point arithmetic)

Many of the limitations of MetaPost derive from features of Metafont. For
instance, MetaPost does not support all features of PostScript. Most notably,
paths can have only one segment (so that regions are simply connected), and
regions can be filled only with uniform colours. PostScript level 1 supports
tiled patterns and PostScript 3 supports Gouraud shading.

MetaPost is distributed with many distributions of the TeX and Metafont
framework, for example, it is included in the MiKTeX and the TeX Live
distributions.

The encapsulated postscript produced by Metapost can be included in LaTeX,
ConTeXt, and TeX documents via standard graphics inclusion commands. The
encapsulated postscript output can also be used with the PDFTeX engine, thus
directly giving PDF. This ability is implemented in ConTeXt and in the LaTeX
graphics package, and can be used from plain TeX via the supp-pdf.tex macro
file.

Prior to the introduction of ConTeXt and LuaTeX, MetaPost is only to serve as
an indenpendent interpreter that is to process as the input a MetaPost document
and produce as the output a separate image file that would then to be included
with the document, possibly using \includegraphics command. However, with the
introduction of ConTeXt and LuaTeX, it is possible to embed    MetaPost source
code directly within a document file, and then compile the document using the
same command as to compile a normal ConTeXt or LuaTeX file, and then have the
resulting image appearing as part of the document. It is also possible to
typeset the image as a "float".

  \starttext
    \startMPpage
      fill fullcircle scaled 5cm withcolor red ;
    \stopMPpage
    \startMPpage
      fill unitsquare scaled 5cm withcolor red ;
    \stopMPpage
  \stoptext

If the file is saved as yourfile.tex, then you can produce a PDF file with:

  context yourfile

The previous call will use LUATEX and CONTEXT MKIV to produce a file with two
pages using the built in METAPOST library with METAFUN. When you use this route
you will automatically get the integrated text support shown in this manual,
including OPENTYPE support. If one page is enough, you can also say:

Inclusion of MetaPost code in LaTeX is also possible by using LaTeX-packages,
for example gmp or mpgraphics.


# Differences Between MetaPost and MetaFun

MetaFun is the "improved" version of the original MetaPost. It is written by
Hans Hagen, that is based of the original MetaPost, who is primarily written by
John Hobby. "MetaFun" tries to add additional features that are previous absent
from MetaPost, and at the same time modify it so that it will work with ConTeXt
to provide graphing capability, just as MetaPost has done to TeX.
At the mean time, MetaFun has maintained backward compatibility with MetaPost,
even though it has introduced some additional syntax.

In a nutshell, if LuaTeX is to be used, then one should stick strictly with
the syntax of MetaPost. If ConTeXt is to be used, then one can switch over
to some of the new syntax introduced by MetaFun.

Following is two different syntax for typesetting a label text inside a
ConTeXt document:

Under MetaPost:

    label (btex {\switchtobodyfont[12pt]0} etex, (4*u,7.5*u)) ;

Under MetaFun:

    draw textext("{\switchtobodyfont[12pt]0}") shifted (4*u,7.5*u) ;

The first one is the MetaPost syntax, and the second one is the MetaFun
syntax. Notice that the text to be processed is a ConText native
text that should also work directly inside a ConTeXt document. If the
same "label" command is to be used inside a LuaLaTeX document, then
the string passed to the "label" command would have to be a one
that is compatible with LuaLaTeX, such as the following:

    label (btex {\fontsize{12pt}{12pt}\selectfont{}0} etex, (4*u,7.5*u)) ;

The ``\fontsize{12pt}{12pt}\selectfont`` command is defined by the 
"anyfont" package that must also be included within that LuaLaLaTeX
document.

The ``textext()`` function constructs a new path object that is based
on the choice of the font and the text string composition.
With the introduction of this function, it is possible to 
call up the "draw" command, which expects a path specification.

    draw textext("{\switchtobodyfont[12pt]0}") shifted (4*u,7.5*u) ;

Without going through textext() function, the process of drawing
a text label must be done through the "label" command such as 
follows.

    label (btex {\switchtobodyfont[12pt]0} etex, (4*u,7.5*u)) ;

The "alignment" option of the "label" command is to be specified
by the "alignment" option of the "textext()" function as follows:

    label.rt (btex {\switchtobodyfont[12pt]0} etex, (4*u,7.5*u)) ;
    draw textext.rt("{\switchtobodyfont[12pt]0}") shifted (4*u,7.5*u) ;


# Drawing An Entire Page

The \startMPpage is one to create an entire page that is to be
filled with vectors of graphics. Following is a simple example:

    \definecolor [Top] [h=a5b291]
    \definecolor [Bottom] [h=b7c1a7]
    \definecolor [TitleColor] [h=96433a]
    \starttext
    \startMPpage
    StartPage;
    numeric w; w := bbwidth(Page);
    numeric h; h := bbheight(Page);
    fill (unitsquare xyscaled (w,0.8h)) withcolor \MPcolor{Bottom}
    fill (unitsquare xyscaled (w,0.2h)) withcolor \MPcolor{Top}
    draw (0,.8h) -- (w,.8h) withpen pensquare scaled 2pt withcolor white;
    StopPage;
    \stopMPpage
    \stoptext

This block of MetaFun code is to create an entire page that is to
be filled with two colors and a line drawn at the border of the
two colors, with the top color taking up 20-percent of the
height, and the bottom color taking up 80-percent of the height,
and with a width that spans the entire width of the page. Of
course, the name of the color such as "Bottom" and "Top" must be
enclosed using the command \MPcolor in order to convert the name
of the color, which is defined within the CONTEX scope, into a
color within the METAFUN scope. Note that METAPOST/METAFUN only
defines two colors, "black" and "white". These are the only two
color names that can be used within the METAPOST/METAFUN
directly. This is also why the last "draw" command is able to use the 
color name "white" without having to go through the \MPcolor
command.

The bbwidth(Page) and bbheight(Page) are designed
to return the width and/or height of the
bounding box of the picture being drawn. For \startMPpage, after
the "StartPage" command, the entire picture is to be pointed to by
the "Page" varibale. This can be compared to the "currentpicture"
variable if \startMPcode is to be used instead.



# Spot Colors

# Transparency

# Clipping

# Shading

# Typesetting TEX Label

# Page Background

# Layered Graphics

# Using MetaFun Without ConTEX

# Debugging


