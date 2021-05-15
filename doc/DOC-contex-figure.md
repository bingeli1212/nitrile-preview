---
title: Figure
---

# Typesetting Figures

Floating Objects (floats) are placed (and numbered) automatically, with a configurable (and optional) caption. 
They are placed at an appropriate position determined by the TeX float placement algorithm. 
The algorithm has a number of options that can influence float placement.

Most options in the manual (such as \placeexternalfigure) are described using the generic \placefloat. 
Additionally, \placelistoffigures creates a list of the figures used in the document.

Floats include "graphic", "figure", "table", and "intermezzo". 
Additional floats can be defined using \definefloat.

    \placefloat[place][reference]{caption}{some float}

The argument ``place`` is one or several (comma separated) of:

@ btable 

  preference	result
  left	left of text
  right	right of text
  here	preferably here
  top	at top of page
  bottom	at bottom of page
  inleft	in left margin
  inright	in right margin
  inmargin	in the margin (left or right)
  margin	in the margin (margin float)
  page	on a new (empty) page
  opposite	on the left page
  90	orientation (rotation angle), both caption and contents
  always	precedence over stored floats
  force	per se here
  split	(For TABLES only) split tables

The argument ``reference`` is a string expressing a label that can be 
referred to later by the command \in.
If it is empty this argument can be omitted.
An example is the following:

    \placefigure[none] {} {\externalfigure[figurename]}

If you do not want the figure to be numbered (but still want the caption)

    \placefigure [nonumber] {caption} {\externalfigure[figurename]}

Suppose you want the figure to be placed on the right side of the page, 
a few lines into the paragraph, 
and want the rest of the paragraph to wrap around the figure

    \placefigure [right,2*line] {caption} {\externalfigure[figurename]}

or

    \placefigure [right,2*hang] {caption} {\externalfigure[figurename]}

This does not work correctly at a page boundary. 
The line option leaves the space above the figures empty, 
while the hang option also wraps texts above the figure.


# Floats and other limitations of columns

Columns and one-column floats don’t work well together in TeX. 
It seems that you can't have a float that spans one column automatically 
put at the top or the bottom and have the columns balanced automatically 
at the end. 
Neither ConTeXt nor LaTeX can do it in a automatized way 
(like with floats that span more than a column). 

However you can use ``columnsets`` 
to make it work more or less.
With ``columnsets`` you can put floats that span one, 
two or any number of columns and in any position 
(top, bottom, middle of the text). 
The price for this is that you have to balance the columns manually 
at the end (see Columnset manual).

Columnsets have a limitation, 
however: they are very strongly grid-based, 
and you can't change the interlinespace within 
the columnset (e.g., if some paragraphs are typed 
in a smaller font). You can change the interlinespace 
if the entire text with a smaller interlinespace fits 
in one column, like a float or a section title (putting 
it between \startlinecorrection\stoplinecorrection), 
but if the text with a smaller interlinespace starts 
in one column and has to continue in the following one, 
nothing will work, and the layout will be completely messed.

Changing the font weight or shape 
inbetween \startcolumnset and \stopcolumnset may cause some 
columns to be shifted vertically. Then you must use 
\restoreinterlinespace after the font switch (\bf, \ss) to 
correct the interline spacing. 

So, if you want columns and one-column floats and don’t have 
to change the interlinespacing, use Columnsets. 
If not, you can use Columns with some tricks.


# Adding Subcaptions To Each Subfigure

    \startcombination[...] ... \stopcombination

The \startcombination · · · \stopcombination pair is used for combining two
pictures in one figure. You can type the number of pictures within the bracket
pair. If you want to display one picture below the other you would have typed
[1*2]. You can imagine what happens when you combine 6 pictures as [3*2]
([h*v]).

The examples shown above are enough for creating illustrated documents.
Sometimes however you want a more integrated layout or the picture and the
text. For that purpose you can use \startfiguretext. An example
shown below would have typesetted a figure with picture on the left
hand side and a long paragraph on the right hand side.

    \startfiguretext
      [left]
      [fig:citizens]
      {none}
      {\externalfigure[hass07g]
       [type=tif,width=.5\makeupwidth,frame=on]}
       Hasselt has always had a varying number of citizens due to
       economic events. For example the Dedemsvaart was dug around 1810.
       This canal runs through Hasselt and therefore trade florished.
       This led to a population growth of almost 40\% within 10 ̃years.
       Nowadays the Dedemsvaart has no commercial value anymore and the
       canals have become a touristic attraction.
    \stopfiguretext

The last curly brace pair enclose the command \externalfigure. This command
gives you the freedom to do anything you want with a figure. \externalfigure
has two bracket pairs. The first is used for the exact file name without
extension, the second for file formats and dimensions. It is not difficult to
guess what happens if you type:3.

    \inmarge
      {\externalfigure
         [hass23g]
         [type=tif,width=\marginwidth,frame=on]}


You can set up the layout of figures with:

    \setupfloats[..,..=..,..]

You can set up the numbering and the labels with:

    \setupcaptions[..,..=..,..]

These commands are typed in the set up area of your input file and have a
global effect on all floating blocks.

    \setupfloats
      [location=right]
    \setupcaptions
      [location=top,
      height=.4\makeupheight,
      character=boldslanted]

    \placefigure
      {Just a picture.}
      {\externalfigure[hass18g][frame=on]}


# Leading Paragraph

Using \externalfigure[...] at the beginning of a paragraph 
results in a line break after the image. 
This is because \externalfigure is a \vbox and when a \vbox is encountered at (what appears to be) the beginning of a paragraph, it remains in vertical mode. 
To prevent this, add \dontleavehmode before \externalfigure, like this:

    \dontleavehmode
    \externalfigure[...] ... first line ...


# Image Labels

Suppose your document contains an image at multiple locations; all of these images are to be of the same size, which is not necessarily the same as the natural size of the image. 
Furthermore, as before, you want to set the size of all the images by changing only one setup. 
Here, the macro to use is \useexternalfigure, which defines a symbolic label for inserting an image plus settings. 
For example:

    \useexternalfigure[mylogo]
                      [logo.pdf][width=2cm]
                  
defines an image label mylogo that maps to the image file logo.pdf and sets its width to 2cm. 
This image label may be used as a normal image filename:

   \externalfigure[mylogo]


# Diagnostic Tracking

To get diagnostic information about image inclusion, enable the tracker graphics.locating by editing the ConTeXt file and adding:

    \enabletrackers[graphics.locating]

Alternatively, compile the ConTeXt file using:

    context --trackers=graphics.locating filename

The tracker writes diagnostics to the console. 
Suppose we use \externalfigure[somefile.pdf] and ConTeXt finds the file in the current search path; then the following information is printed on the console:

    graphics > inclusion > locations: local,global
    graphics > inclusion > path list: . .. ../..
    graphics > inclusion > strategy: forced format pdf
    graphics > inclusion > found: somefile.pdf -> somefile.pdf
    graphics > inclusion > format natively supported by backend: pdf

If the file somefile.pdf is not found in the current search path, then the following information is printed on the console (even if the graphics.locating tracker is not set):

    graphics > inclusion > strategy: forced format pdf
    graphics > inclusion > not found: somefile.pdf
    graphics > inclusion > not found: ./somefile.pdf
    graphics > inclusion > not found: ../somefile.pdf
    graphics > inclusion > not found: ../../somefile.pdf
    graphics > inclusion > not found: images/somefile.pdf
    graphics > inclusion > not found: /home/user/images/somefile.pdf
    graphics > inclusion > format not supported: 

and a placeholder gray box is put in the output:

Sometimes, one would rather use a placeholder image for an image that is yet to be made. 
In such cases, load the MP library dum via:

    \useMPlibrary[dum]

Then, whenever an image file is not found in the current search path, a random MetaPost image is shown in the output.


# Visualize Bounding Box

If, for instance, the image is taking more space than expected, it can be useful to visualize the bounding box of the image. To do this:

    \externalfigure[logo.pdf][frame=on]

ConTeXt includes a Perl script pdftrimwhite that removes extra white space at the borders of a PDF file. To run this script:

    mtxrun --script pdftrimwhite [flags] input output

The most important flag is --offset=dimen, which keeps some extra space around the trimmed image.

Similar functionality is provided by another Perl script, pdfcrop, that is included in most TeX distributions.


# Image Clipping

Clip an image using the generic \clip command. For example, to clip the original image to a 1cm x 2cm rectangle at an offset of (3mm,5mm) from the top left corner:

    \clip[width=1cm, height=2cm, hoffset=3mm, voffset=5mm]
         {\externalfigure[logo.pdf]}

As another example, this cuts the image into a 3x3 pieces and then outputs the (2,2) piece:

    \clip[nx=3,ny=3,x=2,y=2]
         {\externalfigure[logo.pdf]}

In PDF files, it is possible to specify different size information in PDF headers MediaBox, TrimBox, CropBox, and ArtBox. To clip to one of these sizes, use

    \externalfigure[logo.pdf][size=art]

Other options are: none (detault), media for MediaBox, crop for CropBox, trim for TrimBox, and art for ArtBox.


# Image Mirroring

To mirror (flip) an image, use the generic \mirror command. For example, to mirror horizontally:

    \mirror{\externalfigure[logo.pdf]}

To mirror vertically, first rotate the image by 180° and then mirror it:

    \mirror{\externalfigure[logo.pdf][orientation=180]}


# Image Rotation

Rotate included images by 90°, 180°, or 270° using the orientation key. For example:

    \externalfigure[logo.pdf][orientation=90]

To rotate by an arbitrary angle, use the \rotate command. For example:

    \rotate[rotation=45]{\externalfigure[logo.pdf]}



# Image Scaling

NOTE: If either width or height is specified, then the scale key has no effect.

To scale an image use the scale key: scale=1000 corresponds to the original dimensions of the image, scale=500 scales the image to 50% of the original size, scale=1500 scales the images to 150% of the original size, and so on. For example:

    \externalfigure[logo.pdf][scale=500]

scales the image to 50% of its size.

Use \setupexternalfigures to set the scale of all images. For example, to scale all images to be twice their original size, use:

    \setupexternalfigures[scale=2000]

In addition, the xscale and yscale keys scale the image in only one dimension. For example:

    \externalfigure[logo.pdf][xscale=500]
    \externalfigure[logo.pdf][yscale=500]

Scaling changes the visible size of a picture, but not the data or file size. If you want to reduce your file size by decreasing image resolution, see Downsampling.

ConTeXt can limit included images to particular dimensions. For example, to ensure that an included image is not more than 0.2\textwidth:

    \externalfigure[logo.pdf][maxwidth=0.2\textwidth]

If maxwidth is specified and the width of the image is less than maxwidth, then the image is not scaled; if the width of the image is greater than maxwidth, then the width is restricted to maxwidth and the height is scaled appropriately to maintain the original aspect ratio.

The option maxheight is analogous to maxwidth, for checking the height of the image.

For example, to ensure that figures do not overflow the text~area, one may set:

    \setupexternalfigures
        [maxwidth=\textwidth,
         maxheight=0.8\textheight]






