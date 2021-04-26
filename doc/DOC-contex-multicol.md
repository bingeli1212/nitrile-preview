---
title: Multiple Column Layout
camer.setupbodyfont: linux,11pt
---

# Introduction


This manual introduces column sets, one of the output routines of ConTEXt.
Although col- umn sets are mainly meant for typesetting journals in a
semi--automated way, you can also use them for books. We assume that the user
is familiar with ConTEXt and only discuss the commands that are related to
column sets. This manual is dedicated to those on the ConTEXt mailing list who
urged me to explain how column sets work.

This mechanism is still under construction which means that functionality may
be added and improved. Given the complex nature of this kind of typeseting,
you may occasionally run into strange situations.

Column sets are not the most efficient mechanism in ConTEXt, partly because
we’re actually dealing with multiple virtual pages (columns) per page, but
mostly because of the features that we need to support.

Hans Hagen, PRAGMA ADE Hasselt, April 2003



# Basics

As soon as enough content is collected to build a page, TEX will invoke the
output routine. This is not a fixed piece of code, but a collection of macro
calls. The default output routine is a meant for typesetting a single column,
as in this document. A multi--column output routine is available as well. This
routine mixes well with the single column one, and is activated by:

    \startcolumns
    some text ...
    \stopcolumns

There are some limitations to what you can do with this kind of multi columns,
which is why we have a third routine at out disposal: column sets. This
routine can be used for rather com- plex layouts with graphics all over the
place, and text spanning columns or even spreads. There are of course some
shortcomings, which we will discuss later.

In the examples that follow we use the following style to set up the layout:

    \startenvironment cols-000
    \dontcomplain
    \useMPlibrary[dum]
    \usetypescript
      [palatino]
      [\defaultencoding]
    \setupbodyfont
      [palatino]
    \setupcolors
      [state=start]
    \setuplayout
      [grid=yes]
    \setuplayout
      [middle]
    \setupsystem
      [random=1234]
    \setuppagenumbering
      [alternative=doublesided,
    location=]
    \setupheadertexts
      [pagenumber][right]
      [left][pagenumber]
    \setupfootertexts
      [\tttf\inputfilename]
    \setuptolerance
      [verytolerant,stretch]
    % todo: flatten
    \startuniqueMPgraphic{frame}
      fill OverlayBox withcolor transparent(1,.25,red) ;
      fill OverlayBox withcolor transparent(1,.25,blue);
    \stopuniqueMPgraphic
    \startuniqueMPgraphic{contrast}
      fill OverlayBox withcolor white ;
      fill OverlayBox withcolor transparent(1,.25,red) ;
      fill OverlayBox withcolor transparent(1,.25,yellow) ;
    \stopuniqueMPgraphic
    \defineoverlay[frame]   [\useMPgraphic{frame}]
    \defineoverlay[contrast][\useMPgraphic{contrast}]
    \definecolor[red]  [r=.75,g=.5,b=.5]
    \definecolor[green][r=.5,g=.75,b=.5]
    \definecolor[blue] [r=.5,g=.5,b=.75]
    \stopenvironment

Following is an example that will typeset the pages shown in figure
&ref{fig:multicol-1}.

    \usemodule[visual]
    \definecolumnset[example][n=2]
    \setupindenting[yes,medium]
    \starttext
    \startcolumnset[example]
       \dorecurse{15}{\fakewords{100}{200}\par}
    \stopcolumnset
    \stoptext

@ figure
  &label{fig:multicol-1}
  The output when "n=2"

  ```img{width:22%,outline}
  image-multicol-1-1.pdf
  ```

  ```img{width:22%,outline}
  image-multicol-1-2.pdf
  ```
 
  ```img{width:22%,outline}
  image-multicol-1-3.pdf
  ```

  ```img{width:22%,outline}
  image-multicol-1-4.pdf
  ```

However, if we were to modifiy the source of the \definecolumnset command such
that its second argument becomes the one that is shown as follows, the output
will look different. Following is an example that will generate 
pages shown in figure &ref{fig:multicol-2}.

    \usemodule[visual]
    \definecolumnset[example][nleft=3,nright=2,width=5cm]
    \setupindenting[yes,medium]
    \starttext
    \startcolumnset[example]
       \dorecurse{15}{\fakewords{100}{200}\par}
    \stopcolumnset
    \stoptext

@ figure
  &label{fig:multicol-2}
  The output when "nleft=3,nright=2,width=5cm"

  ```img{width:22%,outline}
  image-multicol-2-1.pdf
  ```

  ```img{width:22%,outline}
  image-multicol-2-2.pdf
  ```
 
  ```img{width:22%,outline}
  image-multicol-2-3.pdf
  ```

  ```img{width:22%,outline}
  image-multicol-2-4.pdf
  ```

It can be observed that the \definecolumnset command lives inside
the setup area of the TEX document before \starttext. The second
argument is a list of key-value options. The second example has
defined "nleft=3" and "nright=2", which expresses that for the
pages on the left-hand side should have three columns and the pages
on the right-hand side should have two. The first example sets the
"n=2" which expresses a two-column layout for all pages regardless
of their left or right status.

The \fakewords command lives inside the module of "visual" which must be
included. This command generates some random fake words in the shape of
squares. It takes two arguments, the first of which is the minimum number of
words, and other is the maximum wnumber of words. The same "visual" module
defines other commands such as \fakeformula as well.

    % mode=mkiv
    \setuppapersize[A7]
    \setupsystem[random=10]
    \setupwhitespace[big]
    \setuphead[section][style=tfd]
    \starttext
        \section{ \fakewords{3}{4} }
        \fakewords{30}{40} % min, max
        \fakenwords{6}{2}  % words, random seed
        \startformula
            \fakeformula
        \stopformula
    \stoptext

The \dorecurse command is designed to repeat a certain command 
some number of times. It has the following syntax form.

    \dorecurse{n}{commands}

The \par command is designed to start a paragraph. Normally this would've been
expressed by the presence of one or more empty line between texts; however in
the absence of this possibility the \par command can be used instead.

Typically, for each column the total number of lines are determined by the 
available vertical space within that page. However, the \setupcolumnsetlines
command can be called specifically set the total number of lines for a specific column. 

    \setupcolumnsetlines[...][...][...][...]
    [...] columnset name
    [...] nesting level
    [...] number of individual column in columnset
    [...] number of lines column should have

For the fourth argument, if the value is a positive integer, then that value
will express a fixed number of lines for that column. If that argument
is a negative integer it expresses that the total number of lines for that
column is computed dynamically by subtracting that number from
the maximum possible number of lines of that column.

    \definecolumnset[example][n=2]
    \setupcolumnsetlines[example][1][1][-2]
    \setupcolumnsetlines[example][1][2][-4]
    \setupcolumnsetlines[example][2][1][-6]
    \setupcolumnsetlines[example][2][2][-6]
    \setupcolumnsetlines[example][3][1][-4]
    \setupcolumnsetlines[example][3][2][-2]
    \starttext
    \startcolumnset[example]
       \dorecurse{15}{\fakewords{100}{200}\par}
    \stopcolumnset
    \stoptext

In articles you may want to let the introduction span which crosses multiple
columns. This span may appear anywhere within the texts that are normal
columns. The command to use for this purpose is \definecolumnsetspan. 

    \definecolumnsetspan[...][...][...=...,...]
    [...] name
    [...] name
    ...=...,... inherits from \setupcolumnsetspan

    \setupcolumnsetspan[...,...][...=...,...]
    [...,...] name
    n number
    style style command
    color color
    before  command
    after command
    ...=...,... inherits from \setupframed

In particular, the \definecolumnsetspan command 
creates a "named span". In the following example the name given
is called "wide". The second option to this command is a list of 
key-value pairs, each of which expresses the configuration for
this span. For instance, if "n=2" it expresses that the span is to 
cover two columns. 

Once, the "named span" is defined, it is ready to be inserted into
the "columned text". To do this the \startcolumnsetspan command
is to be used. In the following example the first argument to
this command is "wide" which is the name given to the \definecolumnsetspan
command above. Between the \startcolumnsetspan and \stopcolumnsetspan
are texts for the span. Note that the \startcolumnsetspan and \stopcolumnsetspan
must be called between the \startcolumnset and \stopcolumnset command
in order for it to take effect. In the example below it is called at the very
beginning of the \startcolumnset and \stopcolumnset, making the span
the very first part of the two-column text. Following
is an example that will generate pages shown in
figure &ref{fig:multicol-3}.

    \usemodule[visual]
    \definecolumnset[example][n=2]
    \definecolumnsetspan[wide][n=2]
    \setupindenting[yes,medium]
    \starttext
    \startcolumnset[example]
      \startcolumnsetspan[wide]
        \dorecurse{2}{\fakewords{25}{50}\par}
      \stopcolumnsetspan
      \dorecurse{15}{\fakewords{100}{200}\par}
    \stopcolumnset
    \stoptext

@ figure
  &label{fig:multicol-3}
  This is the output of the page where a column span was instroduced
  and it is at the start of the columned text.

  ```img{width:25%,outline}
  image-multicol-3-1.pdf
  ```

  ```img{width:25%,outline}
  image-multicol-3-2.pdf
  ```
 
  ```img{width:25%,outline}
  image-multicol-3-3.pdf
  ```

However, when a column span is introduced into the column text, its
performance would have suffered if the location of the span happens to be at
the second column instead of the first.  Following is an example that calls
the \startcolumnsetspan multiple times. The second and third instances of this
invocation happens to  be at the second column of the columned text. It can be
observed that because it does not have additional columns to expand to on its
right hand side. The text seems to be on top of each other. See figure 
&ref{fig:multicol-4}

    \usemodule[visual]
    \definecolumnset[example][n=2]
    \definecolumnsetspan[wide][n=2]
    \setupindenting[yes,medium]
    \starttext
    \startcolumnset[example]
      \startcolumnsetspan[wide]
        \fakewords{25}{50}
      \stopcolumnsetspan
      \dorecurse{3}{\fakewords{100}{200}\par}
      \startcolumnsetspan[wide]
        \fakewords{25}{50}
      \stopcolumnsetspan
      \dorecurse{3}{\fakewords{100}{200}\par}
      \startcolumnsetspan[wide]
        \fakewords{25}{50}
      \stopcolumnsetspan
      \dorecurse{3}{\fakewords{100}{200}\par}
    \stopcolumnset
    \stoptext


@ figure
  &label{fig:multicol-4}
  A situation where three column spans are introduced
  and two of them landed on the second column of the 
  columned text.

  ```img{width:25%,outline}
  image-multicol-4-1.pdf
  ```

  ```img{width:25%,outline}
  image-multicol-4-2.pdf
  ```
 
  ```img{width:25%,outline}
  image-multicol-4-3.pdf
  ```

The \definecolumnsetarea command is designed to create a fixed area (e.g. for
images, text or ads) in a column set.

    \definecolumnsetarea[...][...][...=...,...]
    [...] name
    [...] name
    ...=...,... inherits from \setupcolumnsetarea

    \setupcolumnsetarea[...,...][...=...,...]
    [...,...] name
    [...=...,...]
      state         start stop repeat
      x             start area at column no.
      y             start area at line no.
      nx            area width (no. of columns)
      ny            area height (no. of lines)
      style         style command
      color         color
      clipoffset    dimension
      rightoffset   dimension
      ...=...,...   inherits from \setupframed

The columnsets manual also shows an additional optional (second) parameter
[left], [right] or [both] as well as a key "type".

In the source the "type="" key (with the possible values of "both", "fixed",
"left", "right", "next") is disabled with the remark "not now". Probably it
should control the placement on left/right pages.

You can position areas on the left, right or next page or on both pages. When
you set state to repeat, an area is repeated, otherwise it is only placed
once.

If there are two consecutive \startcolumnset commands such that one follows
the other, then the second one would likely to start at a new page. 
Following example would have generated the output that looks like the
figure &ref{fig:multicol-5}.

    \usemodule[visual]
    \setupindenting[yes,medium]
    \definecolumnset [example-1] [n=2]
    \definecolumnset [example-2] [n=2]
    \starttext \showgrid
      \startcolumnset [example-1] \dorecurse {1}{\input tufte \par} \stopcolumnset
      \startcolumnset [example-2] \dorecurse {1}{\input ward  \par} \stopcolumnset
    \stoptext

@ figure
  &label{fig:multicol-5}
  A situation where there are two \startcolumnset
  commands such that one immediately follows
  the other.

  ```img{width:25%,outline}
  image-multicol-5-1.pdf
  ```

  ```img{width:25%,outline}
  image-multicol-5-2.pdf
  ```
 
 As a side note. To convert a multi-page PDF file to a number
 of PNG files where each PNG file represents a page, use the 
 following command:

     convert x.pdf +adjoin x-%04d.png

To verify that ImageMagick is working properly following
commands can be run. If it works property then the logo
would have been generated that are "logo.gif".

magick logo: logo.gif
magick identify logo.gif
magick logo.gif win:

Note, use a double quote (") rather than a single quote (') for the ImageMagick command line under Windows:

    magick "e:/myimages/image.png" "e:/myimages/image.jpg"

Use two double quotes for VBScript scripts:

    Set objShell = wscript.createobject("wscript.shell")
    objShell.Exec("magick ""e:/myimages/image.png"" ""e:/myimages/image.jpg""")


