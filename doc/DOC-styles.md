---
title: Styles
---

Following are styles recognized by NITRILE:

+ halign:p(1cm) c c c c
+ halign:l l c r r

  The halign-option is designed to express alignment options for table columns,
  which is a list of letter l/r/c, or a string such as "p(1cm)" for paragraph
  with a fixed width.

+ fr:1 1 1
+ fr:1 2 1
+ fr:1 2 1 3 3

  The fr-option is designed to express relative column widthes, which is
  a list of integers separated by spaces.

+ save:a
+ save:b

  The save-option specifies a named buffer such that the content of that
  fenced bundle is to be saved under.

+ load:a
+ load:b

  The load-option instructs that the content of a fenced bundle is to be
  loaded from a named buffer.

+ fontsize:12
+ fontsize:11.5
+ fontsize:10
+ fontsize:footnotesize
+ fontsize:large

  The fontsize-option instructs that the current fenced bundle be shown
  with a different font size. The font size is either a number, such
  as 12, 11.5, 10, etc., or a string such as "footnotesize", "large",
  which must be a valid font size name.

+ leftmargin:12
+ leftmargin:20

  The leftmargin-option specifies a non-zero left margin for the fenced
  bundle. Note that this option might only be recognized for certain
  fenced-bundle and might not have an effect on some. The option name
  is a number expressing a distance in the number of "mm".

 