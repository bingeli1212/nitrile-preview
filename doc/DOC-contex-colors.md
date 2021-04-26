---
title: Colors
camer.setupbodyfont: linux,11pt
---

# Text Colors

Normally you will use colors grouped. Most environments accept a "color"
parameter as part of the key-value pairs, and some might have "textcolor" or
similar longer names too. In a running text you can use the \color command
to designate part of a running text as red.

    \color[red]{Hello}

For longer text that run across multiple paragraphs, the \startcolor
and \stopcolor commands can be used.

    \startcolor[red]
        Hello.
    \stopcolor

In case you don’t want the grouping you can use:

    \directcolor[red]{Hello}

You can even use:

    \colored[r=0.5]{Hello}

In which case an anonymous color is used. An ungrouped variant of this is:

    \directcolored[r=0.5]{Hello}
    \directcolored[r=0.0627,g=0.0627,b=0.6902]{Hello}

You will seldom use these direct variants, but they might come in handy when
you write macros yourself where extra grouping starts interfering. In fact, it
often makes sense to use a bit more abstraction. In the following example
the \definehighlight command will define the name "import" as a way to show
part of the text as red. Once defined, it can be invoked as ``\hightlight[import]``
or ``\important``.

    \definehighlight
      [important]
      [color=red]
    \starttext
    First \highlight[important]{hello} second \important {hello} third.
    \stoptext


# Color models

When you work with displays, and most of us do, the dominant color model is
rgb. As far as I know cmyk electrowetting displays are still not in production
and even there the cmyk seems to have made place for rgb (at least in
promotion movies). This is strange since where rgb is used in cases where
colors are radiated, cmyk shows up in reflective situations (and epub readers
are just that). But rgb and cmyk being complementary is not the only
difference: cmyk has an explicit black channel, and as a consequence you
cannot go from one to the other color space without loss.

In print cmyk is dominant but in order to get real good colors you can go with
spot colors. The ink is not mixed with others but applied in more or less
quantity. A mixture of spot colors and cmyk is used too. You can combine spot
colors into a so called multitone color. Often spot colors have names (for
instance refering to Pantone) but they always have a specification in another
color space in order to be shown on screen. Think of “gold” being a valid ink,
but hard to render on screen, so some yellowish replacement is used there when
documents get prepared on screen.

In ConTEXt all these models are supported, either or not at the same time. In
MkII you had to turn on color support explicitly, if only because of the
impact of the overhead on performance, but in MkIV color is on by default. You
can disable it with:

    \setupcolors
      [state=stop]

The three mentioned models are controlled by keys, and by default we have set:

    \setupcolors
      [rgb=yes,
       cmyk=yes,
       spot=yes]

Spot colors and their combinations in multitone colors are controlled by the
same parameter. You can define colors in the hsv color space but in the end
these become and behave like rgb.


# Using cmyk or rgb

When you compare colors in different color spaces, you need to be aware of the
fact that when a black component is used in cmyk, conversion to rgb might give
the same results but going back from that to cmyk will look different from the
original. Also, cmyk colors are often tuned for specific paper.

    \definecolor[demo:rgb:1][r=1.0,g=1.0]
    \definecolor[demo:rgb:2][r=1.0,g=1.0,b=0.5]
    \definecolor[demo:rgb:3][r=1.0,g=1.0,b=0.6]
    \definecolor[demo:cmy:1][y=1.0]
    \definecolor[demo:cmy:2][y=0.5]
    \definecolor[demo:cmy:3][y=0.4]

In these definitions we have no black component. 


# Using grays only

When the output is a printer that does not support colors, it sometimes
makes sense to generate a PDF that has only grays.

This can be configured in CONTEX by setting both "rgb" and "cmyk" to disabled. 
Following is an example that calls the \setupcolor to
disable both rgb and cmyk:

    \setupcolors
      [conversion=always]

The default setting is "conversion=yes" which means that all colors will be
kept by CONTEX, and the generated PDF file will be showing with colors. When
"conversion=always" is set CONTEX will take the initiative to convert all
colors to gray at the very start. This could translate to a slightly smaller
output.

    \setupcolors
      [factor=yes]

The "factor=" key controls how colors are converted to grays.  The default
value is "factor=yes", which uses the following formula to convert RGB
components to a gray scale. This formula is known to be used by gray scale
television sets to convert color to gray.

    𝑠 = 0.30𝑟 + 0.59𝑔 + 0.11𝑏

If not set to "factor=yes", the "factor=" key can be set to three floating
point numbers connected by a colon in the middle. See figure &ref{fig:colors-1}
for results of converting the same color with different
settings of the "factor=" key.

    \setupcolors
      [factor=0.20:0.40:0.40]

@ figure
  &label{fig:colors-1}
  Results of converting a color to a gray scale using
  various settings of factors.

  ```img
  image-colors-1.png
  ```


# Create Named Colors

The mostly used color definition command is \definecolor. Here we define the
primary colors:

    \definecolor [red]
    \definecolor [green]
    \definecolor [blue]
    \definecolor [yellow]  [y=1]
    \definecolor [magenta] [m=1]
    \definecolor [cyan]    [c=1]

These can be visualized as follows:

    \showcolorcomponents[red,green,blue,yellow,magenta,cyan,black]



# Transparency

Transparency is included in these tables but is, as already noted, in fact
independent. It can be defined as part of a color by the use of the "t=" key.
Following example shows how to define three colors, each named "t:red",
"t:green", and "t:blue", were each is a pure red, green or blue but with
a transparency of 0.5.

    \definecolor [t:red]   [r=1,a=1,t=.5]
    \definecolor [t:green] [g=1,a=1,t=.5]
    \definecolor [t:blue]  [b=1,a=1,t=.5]

Note that the presence of "a=" key is used to express a "transparency mode".
When set to "a=1" the mode is "normal". But there are other modes as well.
Because transparency is separated from color, we can define transparent
behaviour as follows:

    \definecolor[t:only] [a=1,t=.5]

    \dontleavehmode
    \blackrule[width=4cm,height=1cm,color=darkgreen]%
    \hskip-2cm
    \color[t:only]{\blackrule[width=4cm,height=1cm,color=darkred]}%
    \hskip-2cm
    \color[t:only]{\blackrule[width=4cm,height=1cm]}


In case you want to specify colors in the hsv color space, you can do that
too. The hue parameter (h) is in degrees and runs from 0 upto 360 (larger
values get divided). The saturation (s) and value (v) parameters run from 0 to
1. The v parameter is mandate. 

    \definecolor[mycolor][h=125,s=0.5,v=0.8]

It is also possible to use a web color name which consists of letters of three
or six hexadecimal digits. Following are some examples.

    \definecolor[mycolor][x=4477AA]
    \definecolor[mycolor][h=4477AA]
    \definecolor[mycolor][x=66]
    \definecolor[mycolor][#4477AA]

The hash character is normally not accepted in TEX source code but when you
get the specification from elsewhere (e.g. xml) it can be convenient.


#  Color groups

Nowadays we seldom use colorgroups but they are still supported. Groups are
collec- tions of distinctive colors, something we needed in projects where
many graphics had to be made and consistency between text and image colors was
important. The groups can be translated into similar collections in drawing
programs used at that time.

    \definecolorgroup
      [mygroup]
      [1.00:0.90:0.90, % 1
       1.00:0.80:0.80, % 2
       1.00:0.70:0.70, % 3
       1.00:0.55:0.55, % 4
       1.00:0.40:0.40, % 5
       1.00:0.25:0.25, % 6
       1.00:0.15:0.15, % 7
       0.90:0.00:0.00] % 8

After this definition, the name "mygroup" becomes known as a color group,
and colors within this group can be referenced as "mygroup:1", "mygroup:2", 
"mygroup:3", etc. Following is an example that invokes the \blackrule
command, which itself contains key-value pair of "color=" for which
the name "mygroup:1" can be passed in to this key to express a specific
color.

    \blackrule[width=3cm,height=1cm,depth=0pt,color=mygroup:1]\quad
    \blackrule[width=3cm,height=1cm,depth=0pt,color=mygroup:2]\quad
    \blackrule[width=3cm,height=1cm,depth=0pt,color=mygroup:3]

The number of elements is normally limited and eight is about what is useful
and still distinguishes good enough when printed in black and white.

The \blackrule is a CONTEXT command that draws a horizontal filled box,
that can be considered a rule with a thickness. 

    \blackrule[...=...,...]
    ...=...,... inherits from \setupblackrules

Following are some examples of calling this command.

    \blackrule %default rule
    \blackrule[color=red, height=1em] % customized rule



# Color Palets

Color palets are constructs within CONTEX such that each of which represents
a mapping between a set of color names to a concrete color definitions. When
a specific palet is active, all color names that have a matching definition inside
this palet will be converted to a color that is defined in accordance of this palet.
This feature allows for maintaining a different set of colors 
to be applied for the same set of color names.

For instance, we can create a new palet named "mypalet" such that
when this palet is active all colors named "darkred" will be mapped
to color "darkcyan" instead.

    \definepalet
      [mypalet]
      [darkred=darkcyan,
       darkgreen=darkmagenta,
       darkblue=darkyellow]

To do that we will first define a palet, with a command like the one show above.
Then we will call \setuppalet with the name of the palet that is "mypalet". 

Note
that if a color name is encountered that is not part of the currently active
palet,  this color is not affected by the mapping defined by this palet.
Following example would have generated six rules each of which having 
a different color that is shown in figure &ref{fig:colors-2}

    \blackrule[width=15mm,height=10mm,depth=0mm,color=darkred]\quad
    \blackrule[width=15mm,height=10mm,depth=0mm,color=darkgreen]\quad
    \blackrule[width=15mm,height=10mm,depth=0mm,color=darkblue]\quad
    \setuppalet[mypalet]%
    \blackrule[width=15mm,height=10mm,depth=0mm,color=darkred]\quad
    \blackrule[width=15mm,height=10mm,depth=0mm,color=darkgreen]\quad
    \blackrule[width=15mm,height=10mm,depth=0mm,color=darkblue]

@ figure
  &label{fig:colors-2}
  Six black rules where the first three are generated
  with the standard colors and the last three 
  with color names obtained from a palet named
  "mypalet".

  ```img
  image-colors-2.png
  ```

It is also possible to describe mappings of a palet using colors 
with a syntax that describes each color component. For instance,
the same "mypalet" palet can be defined as follows using "r=",
"g=" color components.

    \definepalet
      [mypalet]
      [important={r=.5},
       notabene={g=.5},
       warning={r=.5,g=.5}]



# Transparency Modes

We already discussed transparency as part of colors. In most cases we will
choose type normal (or 1) as transparency type, but there are more:

@   tabbing

    0 none
    1 normal
    2 multiply
    3 screen
    4 overlay

    5 softlight
    6 hardlight
    7 colordodge 
    8 colorburn 
    9 darken

    10 lighten 
    11 difference 
    12 exclusion 
    13 hue 
    14 saturation

    15 color
    16 luminosity


Colors and transparencies are coupled by definitions. We will explain this by
some examples. When we say:

    \definecolor[clr1][r=.5]

A non-transparent color is defined and when we say:
    
    \definecolor[clr2][g=.5,a=1,t=.5]

We defined a color with a transparency. However, color and transparency get
separated attributes. So when we nest them as in:

    \color[clr1]{\bf RED   \color[clr2] {GREEN}}
    \color[clr2]{\bf GREEN \color[clr1] {RED}  }

The transparencies of the color at the outer layer is also going to 
have an effect on the colors at the inner layer, and effect of which
depends on the color mode. In particular, when the mode is 1, the inner
color simply overwrite the outer color. However, when the mode is set
to something other than 1, then the two colors might be mixed
in accordance of the transparency mode.



# Overlays

If we do this:

    \startoverlay
      {\blackrule[color=darkred, height=2cm,width=4cm]}
      {\blackrule[color=darkblue,height=1cm,width=3cm]}
    \stopoverlay

we get:
   
```img
image-colors-3.png
```

The blue rectangle is drawn on top of the red one. In print, normally the
printing engine will make sure that there is no red below the blue. In case of
transparent colors this is somewhat tricky because then we definitely want to
see part of what lays below.



# Setting main text color

Setting the color of the running text is done with:

    \setupcolors
      [textcolor=darkgray]

If needed you can also set the pagecolormodel there but its default value is
none which means that it will obey the global settings.



# Tikz

In case you use the TikZ graphical subsystem you need to be aware of the the
fact that its color support is more geared towards LATEX. There is glue code
that binds the ConTEXt color system to its internal representation but there
can still be problems. For instance, not all color systems are supported so
ConTEXt will try to remap, but only when it knows that it has to do so. You
can best not mix colorspaces when you use TikZ. If you really want (and there
is no real reason to do so) you can say:

    \enabledirectives[colors.pgf]

and then (at the cost of some extra overhead) define colors as:

    \definecolor[pgfcolora][blue!50!green]
    \definecolor[pgfcolorb][red!50!blue]



# MetaFun

Originally TEX and MetaPost were separated processes and even in LuaTEX they
still are. There can be many independent MetaPost instances present, but
always there is Lua as glue between them. In the early days of LuaTEX this was
a one way channel: the MetaPost output is available at the TEX end in Lua as a
table and properties are used to communicate extensions. In today’s LuaTEX the
MetaPost library has access to Lua itself so that gives us a channel to TEX,
although with some limitations. Say that we have a color defined as follows:

    \definecolor[MyColor][r=.25,g=.50,b=.75]

We can apply this to a rule:

    \blackrule[color=MyColor,width=3cm,height=1cm,depth=0cm]

From this we get:

    \startMPcode
      fill unitsquare xyscaled (3cm,1cm) withcolor \MPcolor {MyColor} ;
    \stopMPcode

When the code is pushed to MetaPost the color gets expanded, in this case to (0.25, 0.50, 0.75) because we specified an rgb color but the other colorspaces are supported too. Equally valid code is:

    \startMPcode
      fill unitsquare xyscaled (3cm,1cm) withcolor "MyColor" ;
    \stopMPcode

This is very un-MetaPost as naturally it can only deal with numerics for gray
scales, triplets for rgb colors, and quadruplets for cmyk colors. In MetaFun
(as present in Con- TEXt MKIV) the withcolor operator also accepts a string,
which is resolved to a color specification.

For the record we note that when we use transparent colors, a more complex
specification gets passed with \MPcolor or resolved (via the string). The
same is true for spot and multitone colors. It will be clear that when you
want to assign a color to a variable you have to make sure the type matches. A
rather safe way to define colors is:

    def MyColor =
      \MPcolor{MyColor}
    enddef ;

and because we can use strings, string variables are also an option.

For MetaFun the "withtransparency" command can be used to supply additional
information to commands such as "fill". Following is an example of 
using MetaFun to generate a picture that is shown in figure &ref{fig:colors-4}.

    \startMPcode
      fill fullsquare xyscaled (4cm,2cm) randomized 5mm
        withcolor "darkred" ;
      fill fullsquare xyscaled (2cm,4cm) randomized 5mm
        withcolor "darkblue" withtransparency ("normal",0.5) ;
      fill fullsquare xyscaled (4cm,2cm) randomized 5mm shifted (45mm,0)
        withcolor "darkred"  withtransparency ("normal",0.5) ;
      fill fullsquare xyscaled (2cm,4cm) randomized 5mm shifted (45mm,0)
        withcolor "darkblue" withtransparency ("normal",0.5) ;
      fill fullsquare xyscaled (4cm,2cm) randomized 5mm shifted (90mm,0)
        withcolor "darkred"  withtransparency ("normal",0.5) ;
      fill fullsquare xyscaled (2cm,4cm) randomized 5mm shifted (90mm,0)
        withcolor "darkblue" ;
    \stopMPcode

@ figure
   &label{fig:color-4}
   Six squares where two are overlayed on top of each other. For
   the two on the left hand side the top on as a partial transparency.
   For the two in the middle both has partial transparency. For the two
   on the right hand side only the bottom has a partial transparency.

  ```img
  image-colors-4.png
  ```


# Shading in MetaFun

Shading is possible in MetaFun. Following is an example
of MetaFun that is to generate a picture shown in 
figure &ref{fig:colors-5}.

    \dontleavehmode
    \hbox{
    \startMPcode
        comment("two shades with mp colors");
        fill fullcircle scaled 4cm
            withshademethod "circular"
            withshadevector (2cm,1cm)
            withshadecenter (.1,.5)
            withshadedomain (.2,.6)
            withshadefactor 0.8
            withshadecolors (red,blue)
            ;
    \stopMPcode}
    \hbox{
    \startMPcode
        comment("two shades with mp colors");
        fill fullcircle scaled 4cm
            withshademethod "circular"
            withshadevector (2cm,1cm)
            withshadecenter (.1,.5)
            withshadedomain (.2,.6)
            withshadefactor 1.0
            withshadecolors (red,blue)
            ;
    \stopMPcode}
    \hbox{
    \startMPcode
        comment("two shades with mp colors");
        fill fullcircle scaled 4cm
            withshademethod "circular"
            withshadevector (2cm,1cm)
            withshadecenter (.1,.5)
            withshadedomain (.2,.6)
            withshadefactor 1.2
            withshadecolors (red,blue)
            ;
    \stopMPcode}

@ figure
  &label{fig:colors-5}
  The same circle that is shaded in three different ways.

  ```img
  image-colors-5.png
  ```

Instead of using "withshadecolors", we can also use "withcolor", 
followed by "shadedinto". Following is an example of using this
technique and the result is shown by figure &ref{fig:colors-6}.

    \startMPcode
        comment("two shades with mp colors");
        fill fullcircle scaled 4cm shifted (6cm,0)
            withshademethod "circular"
            withcolor "red" shadedinto "blue"
        ;
    \stopMPcode

@ figure 
  &label{fig:colors-6}
  A circle shaded by using a combination of
  "withcolor" and "shadedinto".

  ```img
  image-colors-6.png
  ```



  

