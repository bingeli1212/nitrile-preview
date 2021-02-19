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

+ hrule:+

  The hrule-option only has one choice so far, which is the plus-sign. When it is
  set, it instructs that every body row of a tabular is to have a single hline inserted
  between them. Following example would have inserted two hrule one between the first two
  rows and another one between the second/third rows.

    ```tabular[hrule:+]
    | Names | Addr.
    | James | 123 Sun Dr.
    | John  | 124 Sun Dr.
    ```

+ vrule:|-|-|-|-|-
+ vrule:|-|--|--|
+ vrule:|-||-|-|-|-|

  The vrule-option is to allow for expressing that where vertical rules should appear
  between columns. The value is a string where each hyphen expressing a column and a vertical
  bar expressing the location of a vertical rule. It also allows for expressing a double-vertical 
  by the appearance of a double-vertical-bar.


