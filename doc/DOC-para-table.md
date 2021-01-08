---
title: The "table" paragraph
---

# The table paragraph

To express a table, attach the word "table" immediate
after the opening fence.

    ~~~table
    Names | Addr.        | Age
    ============================
    James | 102 Sun Str. | 29
    Jane  | 202 Rain Rd. | 21
    ~~~

It is possible to include additional options to the 
table-paragraph, which must appear within a set of 
braces immediately after the word "table".

The table can also be constructed with each describing
a single table row, and with a double-backslash 
by itself starting a new row. In this form, each table data
must start with an ampersand, followed by at least one space,
and then the text. The double-backslash by itself in a line
signals the end of the current row.

    ~~~table
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
    ~~~

It is also possible to specify horizontal rule 
using a triple-hyphen such as the following

    ~~~table
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
    ~~~

A double line can be expressed by the appearance
of triple equal-sign.

    ~~~table
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
    ~~~


Table border lines can be specified by the vline-style
and hline-style options.

    ~~~table{vline:|*|*|*|;hline:t b}
    Names | Addr.        | Age
    ============================
    James | 102 Sun Str. | 29
    Jane  | 202 Rain Rd. | 21
    ~~~

In the previous example, the options "vline" and "hline"
are included that are intended to provide additional
instructure to typeset a table-paragraph. 
The "vline" option instructs how to draw vertical rulers
for the table, and the "hline" for drawing horizontal
rules. Following are additional options for the
table-paragraph.

+ vline

  This option is to specify how to draw vertical rules
  for the table. The vertical bar character appearing
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
  table, and the 'b' letter the last line of the table. The 
  '+' letter describes that horizontal rules should be drawn
  between each two consecutive rows,
  not including the top and bottom. For instance, "hline:t b"
  would have instructed that the top and bottom horizontal
  rules should be drawn but now inter-row rules. "hline:+"
  instructs that the inter-row rules will be drawn but not
  the top and bottom rules.

+ n

  This letter sets the column count. 

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
  as the "title" of the table, where the "title" is
  simply a text string that occupies the entire row
  of the first row of the table, merging all table data
  of that row into one large table data. 

+ caption

  This caption, when set, is to instruct the table parsing
  routine to look for caption lines at the beginning of the 
  subsequent lines. The caption is assumed to have started
  at the first line and continue until a double-backslash
  is encountered as the sole content of a line, after which
  the normal table content is to start.

The content of the table is determined in two different ways. In
particular, the first line of the table-paragraph is scanned, and if
the first two characters is found to be a ampersand character (U+0026)
followed by a space, then each line is understood to be describing a
table data. The table data would start from the first table data in
the first row, and moves to the second table data of that row. It
would move to the beginning of the next row if it has reached the end
of the previous row. The table column count when this is the case is
always determined by the "n" option.

If the ampersand-and-space combination is not found, then each line of
the table-paragraph is understood to describe an entire table row. For
each line, if a vertical-bar character (U+007C) is found, then the
text between the vertical-bars becomes the table data. If the
vertical-bar is not found, then empty spaces are used to determine the
boundaries of the table data.

Following is an example of the same table but described differently.

    ~~~table{vline:|*|*|*|;hline:t b}
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
    ~~~

It is also possible to specify the alignment for each column, which is
one of the following three options - left aligned, center aligned, or
right aligned. This is described by the "halign" option, which expects
a string of one of the three letters - 'l', 'c', and 'r', separated
by spaces. For instance, "halign:l c c" would have described the fact
that the first three columns would each have an alignment of left,
center, and center alignment. If the actual column count is longer
than the number of letters found by this option, additional columns
are assumed to be described by the letter 'l'.

By default, the table is understood such that each table data is a
single line, and the width of each column is determined by the longest
width of the table data of that column. However, this could be changed
so that the table column could be manually adjusted. This is done by
the presence of the "fr" option. For example, the "fr:2 1 2" would
have described such that each column would have a relative width of 2,
1 and 2. Note that if the list is shorter than the total number of
actual columns present then the additional columns are each to assume
a fraction of 1.

Note that for a LATEX translation the presence of the "fr" option
automatically assume that the table data for each column is to treated
as a paragraph.

Following is an example where "caption" option is to be utilized. The
caption in this case is the text "First quarter sales of the year."

    ~~~table{caption}
    First quarter sales
    of the year.
    \\
    Month    | Sales
    ================
    January  | 100
    February | 200
    Match    | 300
    ~~~

The table paragraph on LATEX translation is always to generate
a begin-end-table environment. If the caption-style or label-style
option is present, then the table will be labeled; if the
caption-style option is present, the caption will be inserted.


