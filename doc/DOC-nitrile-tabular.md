---
title: tabular-bundle 
---

A tabular-bundle shows text in a tabular form arrangement.
The easiest way to express texts is to use the "visual" method,
such that each table row is in its own line, and table data separated
from each other by a vertical bar. 

    ```tabular{visual:1}
    Names | Addr.        | Age
    ==========================
    James | 102 Sun Str. | 29
    --------------------------
    Jane  | 202 Rain Rd. | 21
    --------------------------
    John  | 330 Star Dr. | 44
    ```

In this case an appearance of a hyphen-minus three or more by itself would mean
a horizontal line, and an equal sign by itself repeated three or more times
would be interpreted as expressing a "double" horizontal line at that location.

If each table cell consists of text with no internal spaces, it can be
expressed without using vertical bars and by setting the "visual" style
attribute to "2". In the following example a tabular will be built such that it
consists of three rows with 3 table data for each row.

    ```tabular{visual:2}
    Apple   Red     12  
    Pear    White   13
    Banana  Yellow  21
    ```

If a tabular is to built, without the "visual" method, then each line within
the bundle is to be inspected for the appearance of a "command", which always
starts with a backslash.  For instance, following would have constructed the
same table as the one shown above, but is done without the "visual" method.

    ```tabular
    \row
    \data Names 
    \data Addr.        
    \data Age
    \hhline
    \row
    \data James 
    \data 102 Sun Str. 
    \data 29
    \hline
    \row
    \data Jane  
    \data 202 Rain Rd. 
    \data 21
    \hline
    \row
    \data John
    \data 330 Star Dr. 
    \data 44
    ```

In this case, the \hhline, \hline, \row, and \data are considered "commands"  
each providing an instruction to construct the table step by step.
In particular, the \row command would start a new row, and \data would 
add a new table data at the end of the current row.
The \hhline would insert a new "double" horizontal line, and \hline would insert
a new "single" horizontal line.

There is also a \col command that would all for constructing a tabular in a "col" mode.
This allows the table to be constructed one column at a time.

    ```tabular
    \col
    \data Names
    \hhline
    \data James
    \hline
    \data Jane
    \hline
    \data John
    \col
    \data Addr.
    \hhline 
    \data 102 Sun Str. 
    \hline
    \data 202 Rain Rd. 
    \hline
    \data 330 Star Dr. 
    \col
    \data Age
    \hhline
    \data 29
    \hline
    \data 21
    \hline
    \data 44
    ```

The tabular border lines can be specified by the rules-style
and frame-style options.

    ```tabular{visual,rules:all,frame:box}
    Names | Addr.        | Age
    ==========================
    James | 102 Sun Str. | 29
    Jane  | 202 Rain Rd. | 21
    John  | 330 Star Dr. | 44
    ```

Following are supported options for the frame-style:

- "above" The border is visible on the top side only
- "below" The border is visible on the bottom side
- "hsides" The border is visible on the top and bot
- "vsides" The border is visible on the left and righ
- "lhs" The border is visible on the left hand side o
- "rhs" The border is visible on the right hand side
- "box" The border is visible on all four sides.

Following are supported options for the rules-style:

- "groups" The rules will only be visible between row groups (<thead>, <tfoot>, <tbody>) and column groups (see <colgroup> and <col>).
- "rows" The rules will be visible between the rows only.
- "cols" The rules will be visible between the columns only.
- "all" All rules will be visible.

The alignment of each cell can be expressed by the "halign" style option. It
expectes a list of alignment format groups, which must be "l", "r", "c", and
others. It can also start with "p" and followed by one or more digits, such as
"p10" to express that it is a paragraph with a width fixed at 10mm. It can also
start with the letter "f" such as "f25", which expresses a column that is a
paragraph and its width is 25% of the current page width.

The "small" option would express that the table be set using a "smaller" font.
The "head" option would treat the first row as expressing the "header" of the
table, and is likely that that is shown using bold font typeface. HTML
translation might decorate it with the "th" element rather than the "td"
element. For longtable when the "head" option is present then the first row will
be repeated.

The "side" option would set aside the first column of the tabular 
as the "side" column. This would allow a vertical rule to be drawn between
the first column and the second when the rules-style is set to "groups".


