---
title: Switches
---

The switches are used to set the default styling for
paragraphs and fences. It must appear before all other
blocks and after the front matter.

In the following example the two diagrams will
both have a boxed frame and the first diagram 
will have a width of 90% and the second one
100%.

    ---
    titie: My Doc
    ---

    %diagram{box,width:90%}

    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore
    magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat... 

    ```diagram
    ```

    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore
    magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat... 

    ```diagram{width:100%}
    ```

The switches also allows for blocks that are normally
difficult to have a styling provided for to have default
styling, such as SAMP, PLST, PARA, etc.



