---
title: The columns-paragraph
---

The columns-paragraph is to typeset a paragraph of two columns.

    ~~~columns           
    Suppose it took 3 cats 3 days to catch 3 mice, how
    many cats do we need in order to catch 100 mice
    in 100 days? 
    (RATE = average number of
    mice caught by one CAT in one DAY)
    ```diagram{width:4cm,outline}
    viewport 14 8
    draw.cat {fillcolor:orange} (5,3)
    draw.mouse {scaleX:0.5,scaleY:0.5} (8,2) (8,4) (8,6)
    ```
    ~~~

All the text inside the paragraph will be subject to a two-column layout.  On
LATEX the "multicols" package is imported which provides the commands to do the
layout.  On HTML the "columns:2" style is set.

If a manual column break is needed to split the texts between the two columns, 
the columnbreak-typeface can be used.

    ~~~columns
    Text in the first column
    &columnbreak{}
    Text in the second column
    ~~~







