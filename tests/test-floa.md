---
title: 143 - The Game of Sudoku・数独
subtitle: Math Olympiad 2020 - 2021
author: James Yu
institute: Howard County Chinese Language School
latex.cjk: 1
beamer.frameopt: fragile
---

# [label:my] The Game of Sudoku

@listing [label:lst-one-variable-ex-3, caption, numbers] 
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
@

# Figure 

@figure [caption, label:fig-one-variable-ex-2, subfigure]
  Density functions for Example 2.
  (a) Density function for \(x\);
  (b) Density function for \(x^2\)

  ```img[width:45%]
  image-clock.png   
  ```
  ```img[width:45%]
  image-gimp.jpg
  ```
@

# Table 

@table [caption, label:mytable]
  UTF-8 encoding table

  -----|---------|----------|---------|---------|---------
  Bits |Min      |Max       |Byte-1   |Byte-2   |Byte-3
  -----|---------|----------|---------|---------|---------
  7    |U+0000   |U+007F    |0xxxxxxx |         |
  11   |U+0080   |U+07FF    |110xxxxx |10xxxxxx |
  16   |U+0800   |U+FFFF    |1110xxxx |10xxxxxx |10xxxxxx
  -----|---------|----------|---------|---------|---------
@

# Longtable

@longtable [caption, label:mytable]
  UTF-8 encoding table

  -----|---------|----------|---------|---------|---------
  Bits |Min      |Max       |Byte-1   |Byte-2   |Byte-3
  -----|---------|----------|---------|---------|---------
  7    |U+0000   |U+007F    |0xxxxxxx |         |
  11   |U+0080   |U+07FF    |110xxxxx |10xxxxxx |
  16   |U+0800   |U+FFFF    |1110xxxx |10xxxxxx |10xxxxxx
  -----|---------|----------|---------|---------|---------
@

# Equation

@equation 
 a = b + 1
@

# Equation

@equation

 f_x(\frac{1}{y})

@

# Equation

@equation [label:eq1]
  f_y(y) &= \frac{f_x(x_1)}{|g'(x_1)|} \newline
         &= \frac{f_x(\frac{1}{y})}{\left\vert - \frac{1}{ {(\frac{1}{y})}^2} \right\vert} \newline
         &= \frac{1}{y^2} f_x(\frac{1}{y}) \newline
         &= \frac{1}{y^2}  \, \text{normpdf} (\frac{1}{y}, 0, 10)
@




