---
title: The "tabbing" paragraph
---

The "tabbing" paragraph is produced by the "tabbing"
keyword as the first line after the fence.

    ~~~tabbing{n:2}
    One 
    Two 
    Three
    Four
    Five
    Six
    ~~~

This would have produced a tabbing where the first three
items in the list stays at the left side of the column
and the next three items placed as the rightmost column.

The "n:2" option specifies that there should be a total
of 2 columns. The items will be evenly divided among
the columns, and the first few columns will be assigned
extra items if there are remainders when trying to divide
the total number items by the number of columns.

Note that the tabbing will always be evenly distributed
across the paragraph width.


