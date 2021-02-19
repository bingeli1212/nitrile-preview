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

