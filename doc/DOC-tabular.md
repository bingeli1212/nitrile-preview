---
title: tabular-bundle 
---

A tabular-bundle allows for data to be arranged in a tabular
form.

    ```tabular
    | Names | Addr.        | Age
    ============================
    | James | 102 Sun Str. | 29
    | Jane  | 202 Rain Rd. | 21
    ```

The tabular can also be constructed with each describing
a single tabular row, and with a double-backslash 
by itself starting a new row. In this form, each tabular data
must start with an ampersand, followed by one or more spaces,
and then the text. A double-backslash by itself in a line
signals the end of the current row. 

    ```tabular
    & Names 
    & Addr.        
    & Age
    \\
    & James 
    & 102 Sun Str. 
    & 29
    \\
    & Jane  
    & 202 Rain Rd. 
    & 21
    ```

In addition, a triple-hyphen and triple-equal-sign
will also end the current row and adds a 'hline' or 'dhline' row.

    ```tabular
    & Names 
    & Addr.        
    & Age
    ---
    & James 
    & 102 Sun Str. 
    & 29
    \\
    & Jane  
    & 202 Rain Rd. 
    & 21
    ```

Or,

    ```tabular
    & Names 
    & Addr.        
    & Age
    ===
    & James 
    & 102 Sun Str. 
    & 29
    \\
    & Jane  
    & 202 Rain Rd. 
    & 21
    ```

The 'hline' (horizontal line) and 'dhline' (double horizontal line)
are to be inserted into the table in two different ways. The first
is the manual method. This requires that a triple-hyphen or triple-equal-sign 
or longer to appear in the source, which is to be done slightly different
depending on whether it is column based or row based input.

The other ways is to specify the "hline:+" option, which instruct that
all data rows will have a 'hline' inserted automatically between them. 
Note that a 'hline' will not be inserted before the first data row
or after the last data row. This will still need to be accomplished by
manually inserting the triple-hyphen or triple-equal-sign. This implementation 
allows flexibility to create "\endhead" and "\endfoot" sections where 
it will include 'hline' or 'dhline' in them, while only automatically inserting
inter-row horizontal rules when inside data rows.

A tabular-fence is similar to a tabular-phrase except that a tabular-phrase
is an inline-block that would be mixed with other text in the fence,
and can be used to construct two or more side-by-side tabulars. On the
other hand a tabular-fence is designed to be by itself, form a separate 
fence. For LATEX translation it is also to be translated into a float,
such as a begin-end-tabular environment with optional caption and label.

tabular border lines can be specified by the vline-style
and hline-style options.

    ```tabular{vline:|*|*|*|,hline:+}
    | Names | Addr.        | Age
    ============================
    | James | 102 Sun Str. | 29
    | Jane  | 202 Rain Rd. | 21
    ```

In the previous example, the options "vline" and "hline"
are included that are intended to provide additional
instructure to typeset a tabular-fence. 
The "vline" option instructs how to draw vertical rulers
for the tabular, and the "hline" for drawing horizontal
rules. Following are additional options for the
tabular-fence.

+ vline

  This option is to specify how to draw vertical rules
  for the tabular. The vertical bar character appearing
  beteeen the asterisks represent the need to draw vertical
  rules between the columns, each of which is denoted by
  a asterisk. Thus, "|**|" would have described two 
  vertical rules before and after the two starting columns.

+ hline

  This option is to specify where and when
  to draw horizontal rules
  between rows. This option expects a list of letters that
  are either 't', 'b', and '+'. The 't' letter describes
  that a horizontal rule should appear at the top of the 
  tabular, and the 'b' letter the last line of the tabular. The 
  '+' letter describes that horizontal rules should be drawn
  between each two consecutive rows,
  not including the top and bottom. For instance, "hline:t b"
  would have instructed that the top and bottom horizontal
  rules should be drawn but now inter-row rules. "hline:+"
  instructs that the inter-row rules will be drawn but not
  the top and bottom rules.

+ halign

  This option contains list of letters each of which
  describes the alignment of the column - 'l', 'c', 'r'.

+ fr

  This option contains a list of positive integers each
  of which describing the relative width of the column.

+ strut 

  This options contains an integer that describes the number
  of pt(s) for the height of each row. Setting this to an
  integer to allow for each row to have a fixed row height.
  For instance: "strut:20" would have instructed that each
  row has a height of 20pt.

+ title

  This option expects a string that would appear
  as the "title" of the tabular, where the "title" is
  simply a text string that occupies the entire row
  of the first row of the tabular, merging all tabular data
  of that row into one large tabular data. 

The content of the tabular is determined in two different ways. In
particular, the first line of the tabular-fence is scanned, and if
the first two characters is found to be a ampersand character (U+0026)
followed by a space, then each line is understood to be describing a
tabular data. The tabular data would start from the first tabular data in
the first row, and moves to the second tabular data of that row. It
would move to the beginning of the next row if it has reached the end
of the previous row. The tabular column count when this is the case is
always determined by the "n" option.

If the ampersand-and-space combination is not found, then each line of
the tabular-fence is understood to describe an entire tabular row. For
each line, if a vertical-bar character (U+007C) is found, then the
text between the vertical-bars becomes the tabular data. If the
vertical-bar is not found, then empty spaces are used to determine the
boundaries of the tabular data.

Following is an example of the same tabular but described differently.

    ```tabular{vline:|*|*|*|;hline:t b}
    & Names 
    & Addr.        
    & Age
    \\
    & James 
    & 102 Sun Str. 
    & 29
    \\
    & Jane  
    & 202 Rain Rd. 
    & 21
    ```

It is also possible to specify the alignment for each column, which is
one of the following three options - left aligned, center aligned, or
right aligned. This is described by the "halign" option, which expects
a string of one of the three letters - 'l', 'c', and 'r', separated
by spaces. For instance, "halign:l c c" would have described the fact
that the first three columns would each have an alignment of left,
center, and center alignment. If the actual column count is longer
than the number of letters found by this option, additional columns
are assumed to be described by the letter 'l'.

By default, the tabular is understood such that each tabular data is a
single line, and the width of each column is determined by the longest
width of the tabular data of that column. However, this could be changed
so that the tabular column could be manually adjusted. This is done by
the presence of the "fr" option. For example, the "fr:2 1 2" would
have described such that each column would have a relative width of 2,
1 and 2. Note that if the list is shorter than the total number of
actual columns present then the additional columns are each to assume
a fraction of 1.

Note that for a LATEX translation the presence of the "fr" option
automatically assume that the tabular data for each column is to treated
as a fence.

    ```tabular
    | Month    | Sales
    ====================
    | January  | 100
    | February | 200
    | Match    | 300
    ```

If each table cell is a word by itself, where there is no spaces within it,
then one can use the '>' symbol at the first line.

    ```tabular
    > Month      Sales
    ====================
    > January    100
    > February   200
    > Match      300
    ```

Note that the '|' symbol and '>' symbol can mix.

    ```tabular
    | Month    | Sales Volume
    ==========================
    > January    100
    > February   200
    > Match      300
    ```

The tabular fence on LATEX translation is always to generate
a begin-end-tabular environment. If the caption-style or label-style
option is present, then the tabular will be labeled; if the
caption-style option is present, the caption will be inserted.

If a tabular bundle 