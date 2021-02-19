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

+ head:3

  The head-option specifies the number of rows at the beginning of
  input rows to be treated as the header. The input rows refer to the
  rows that user has specified in the source MD file, where some of
  the rows are data rows and others expressing a hline or dhline.
  When being treated as header certain things might happen, which 
  includes but are not limited to setting the font style to bold.
  
  For longtable-fence this option is also used to separate these rows and
  place them into a special section called "\endhead", especially when
  LATEX translation is in place and that the "longtabu" environment is
  being used.

+ foot:1

  The foot-option specifies the number of rows at the end of input
  rows to be treated as the footer. Normally this will not have
  any effect but for longtable-fence these rows will be extracted
  and placed into a special section called "\endfoot" which is 
  a feature of the "longtabu" environment of a LATEX package.

+ bullet:sect
+ bullet:maltese
+ bullet:cross
+ bullet:checkmark

  The bullet-option specifies a new symbol that will be used to replace
  the normal bullet character for a unordered list. 

    ```list[bullet:checkmark]
    - Mail Letter
    - Buy Milk
    - Go to the bank
    ```

+ hrule:-

  The hrule-option only has one choice so far, which is the hyphen-minus. When it is
  set, it instructs that every body row of a tabular is to have a single hline inserted
  between them. Following example would have inserted two hrule one between the first two
  rows and another one between the second/third rows.

    ```tabular[hrule:-]
    | Names | Addr.
    | James | 123 Sun Dr.
    | John  | 124 Sun Dr.
    ```

+ vrule:|+|+|+|+|+
+ vrule:|+|++|++|
+ vrule:|+||+|+|+|+|
+ vrule:|||

  The vrule-option is to allow for expressing that where vertical
  rules should appear between columns. The value is a string where
  each plus-sign denotes a physical column and a vertical-bar denoting
  the appearance of a vertical rule at that location. It also allows
  for expressing a double-vertical by the appearance of a
  double-vertical-bar.

  As a special rule, if the vrule-option is set to be "|||", or a
  triple-vbar by itself without any plus-signs, then it instructs that
  it should have a single vertical rule to appear between all columns
  as well as before the first column and after the last column.

+ cellcolor:a cyan b lime c pink e orange

  The cellcolor-option specifies an associated list such that each color
  is to be applied to a cell with a given text. In the following example all 
  cells of text "a" will be colored using color 'cyan'. All cells of text
  "b" will be color using color 'lime', and so on.

    ```tabular{title:Cayley-1,vrule:|+||+|+|+|+|, hrule:-, cellcolor:a cyan b lime c pink e orange}
    -------------------------
    | &ast; | e | a | b | c
    =========================
    | e     | e | a | b | c
    | a     | a | b | c | e
    | b     | b | c | e | a
    | c     | c | e | a | b
    -------------------------
    ```

+ title:Cayley-1

  The title-option is used to specify the title of a bundle. It is currently recognized only 
  by the tabular-bundle such that it will create "merged" row to contain this text. 
  

+ arrowhead:1
+ arrowhead:2
+ arrowhead:3

  The arrowhead-option is used inside a diagram to specify that a line should be drawn
  with an arrow head attached to the end point of a line, or in the case of 
  multiple line segments, the very end of the line segment. 

  The value is an integer that is bit-OR'ed values of the following:

  ```
  - Arrow head at the end: 0x1
  - Arrow head at the start: 0x2
  - Arrow head at both start and end: 0x1 + 0x2 = 0x3
  ```







