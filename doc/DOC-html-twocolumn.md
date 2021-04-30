---
title: Two Column Layout
---


# Break Columns

Create a new div-element such that it will have a CSS of "break-before:column".

    <div style='columns:2;'> 
    Text ...
    <div style='break-before:column;'></div> 
    Text ...
    </div>

Note that contents inside a DIV-element with its "columns:2" setting, the
"width:100%" style for a child element within it would have occupied only the
entire width of the column, not the entire width of the DIV-element.

To force manual break of the content into different columns, add the following
before the contents. Note that it must be DIV-element, the SPAN-element won't
work.

    <div style='break-before:column;'></div> 

