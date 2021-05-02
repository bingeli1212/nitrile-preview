---
title: Figure
---

# Typesetting Figures

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


