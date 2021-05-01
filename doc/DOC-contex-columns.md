---
title: Columns
---

# Columns

The TEX programmer knows that it is not easy to put text in columns. Gratefully
a ConTEXt user is not bothered with the implementation of extensive macros.

    \setupcolumns[..,..=..,..]
    n             number
    ntop          number
    rule          on *off*
    height        dimension
    tolerance     verystrict strict tolerant verytolerant stretch 
    distance      dimension
    balance       *yes* no
    align         yes no *text*
    blank         *fixed* halfline *line* flexible big medium small
    option        background
    direction     left *right*
    ..=..         see p 210: \setupframed


The letter "n" expresses the fact that the number of columns. The column
text is enclosed by.

    \startcolumns[..,..=..,..] ... \stopcolumns
    ..=..    see p 64: \setupcolumns

The local setup of columns can be added directly after this command. A new
column is forced by:

    \column

Following is an examle that tries to typeset texts into two columns.

    \startcolumns[rule=on,n=2,tolerance=verytolerant]
    Thus, I came to the conclusion that the designer of a new
    system must not only be the implementer and first
    ...


# Paragraphs

In some cases you want to typeset a paragraph in columns. For example in a
definition where you have a first column containing meaningful text and a
second column containing meaningful text. In these cases you can use:

    \defineparagraphs[...][..,..=..,..]
    ...        name
    n          number
    rule       on *off*
    height     fit dimension
    before     command
    after      command
    inner      command
    distance   dimension
    tolerance  verystrict strict tolerant verytolerant stretch 
    align      left right middle

This command defines a layout that consists of paragraphs arranged in columns
from left to right. For instance, to define a two column paragraph we would do:

    \defineparagraphs[TwoColumns][n=2]
    \setupparagraphs[TwoColumns][1][width=5cm]

    \startTwoColumns
       This is the top left corner.
    \TwoColumns
       In graphic environments the top right corner
       is also called the upper right corner.
    \stopTwoColumns

    \startTwoColumns
       In a similr way, the bottom left corner is
       called the lower left corner.
    \TwoColumns
       Which leaves the bottom right corner, that is also
       known as lower right corner. Now what is the alternative
       name for the top left corner?
    \stopTwoColumns

In the previous example,
when \defineparagraphs is called, the first argument is what    
that this two-column paragraph layout is named. This name
will become part of the \startTwoColumns, \stopTwoColumns, 
and \TwoColumns, and the last command is to force the move
of the next paragraph into the subsequent column.  

    \defineparagraphs [CombinedItem]     [n=3,rule=on]
    \setupparagraphs  [CombinedItem] [2] [width=3em]
    \setupparagraphs  [CombinedItem] [3] [width=7em]




