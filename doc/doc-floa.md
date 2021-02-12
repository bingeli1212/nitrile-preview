---
title: Floating figures and tables
---

The FLOA block is used to typeset a floating figure and/or figure. To make it
work, an at-sign must appear at the first position of a new block, followed
immediately by a word that is: figure, table, longtable, listing, or equation.
The content of the block can contain empty lines, and the block
is to be terminated upon the reading of a at-sign by itself.
Following is an example of typesetting a listing:

    ~~~listing [label:ex3, caption] 
      Octave program for Example 3

      x = linspace(-50,50,101);
      y = x;
      fx = @(x) normpdf(x, 0, 10);
      g1x = @(x) -1/(x^2);
      x1 = @(y) 1/y;
      fy = @(y) fx(x1(y))/abs(g1x(x1(y)));
      figure;
      plot(x, arrayfun(fx,x));
      print -dpng "-S640,480" plot1.png;
      figure;
      hold on;
      plot(y, arrayfun(fy,y));
      plot(linspace(0,0), linspace(
            axis()(3), axis()(4)), '.1');
      axis([-15,15,axis()(3),axis()(4)]);
      hold off;
      print -dpng "-S640,480" plot2.png;
    ~~~

Following is an example of typesetting a figure.

    ~~~figure [caption, label:ex2, subfigure]
      Density functions for Example 2.

      ```img[width:45%]
      tree.png
      ```  
      A Tree
      ```img[width:45%]
      frog.jpg
      ```
      A Frog.
    ~~~

Following is an example of typesetting a table.

    ~~~table [caption, label:mytable]
      UTF-8 encoding table

      -----|---------|----------|---------|---------|---------
      Bits |Min      |Max       |Byte-1   |Byte-2   |Byte-3
      -----|---------|----------|---------|---------|---------
      7    |U+0000   |U+007F    |0xxxxxxx |         |
      11   |U+0080   |U+07FF    |110xxxxx |10xxxxxx |
      16   |U+0800   |U+FFFF    |1110xxxx |10xxxxxx |10xxxxxx
      -----|---------|----------|---------|---------|---------
    ~~~

Following is an example of typesetting a long table.

    ~~~longtable [caption, label:mytable]
      UTF-8 encoding table

      -----|---------|----------|---------|---------|---------
      Bits |Min      |Max       |Byte-1   |Byte-2   |Byte-3
      -----|---------|----------|---------|---------|---------
      7    |U+0000   |U+007F    |0xxxxxxx |         |
      11   |U+0080   |U+07FF    |110xxxxx |10xxxxxx |
      16   |U+0800   |U+FFFF    |1110xxxx |10xxxxxx |10xxxxxx
      -----|---------|----------|---------|---------|---------
    ~~~

Following is an example of typesetting an equation.

    ~~~equation [label:eq1]
      f_y(y) &= \frac{f_x(x_1)}{|g'(x_1)|} \newline
             &= \frac{f_x(\frac{1}{y})}{\left\vert - \frac{1}{ {(\frac{1}{y})}^2} \right\vert} \newline
             &= \frac{1}{y^2} f_x(\frac{1}{y}) \newline
             &= \frac{1}{y^2}  \, \text{normpdf} (\frac{1}{y}, 0, 10)
    ~~~

Note that all FLOA block follows the conventions that when 
the caption-style is specified, the first few lines of the incoming 
is to be treated as part of the text for a caption, until
an empty line is encountered, in which case all following lines
will be part of the body.


