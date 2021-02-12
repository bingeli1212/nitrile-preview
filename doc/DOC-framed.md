---
title: Creating Framed Contents.
---

The framed contents can be created by following two methods.

1. Using framed-fence
2. Setting samp:framed to 1

The first method involving setting up a framed-fence.

    ```framed
    This is framed
    contents.
    ```

The framed-fence is going to be turned into a picture. This will
be a SVG for HTML and tikzpicture for LATEX translation. 

The other method is to set the samp:framed style option. This
instructs that all SAMP-block contents will be typeset into a framed
content, instead of the normal verbatim. 

    %samp:framed
    
    Normal paragraph.

        Sample paragraph 
        contents

    Normal paragraph

Note that by setting the "framebox:1" style option the frame 
will automatically contains a border. This will apply to all
generated frames. Note that this is different than the "box:1"
style option.

For framed contents, following options are relavent:

- framewidth:300
- frameheight:200
- framebox:1

The "framewidth:300" style option is to instruct that the framewidth to be set
to 300pt. The "frameheight:200" is to instruct that the frame height is 200pt.
The smaller the frame geometry, the bigger each character will appear to be
inside the frame. The default frame width is 300pt. The frame height will
be at least as large as that to hold the number of lines, but it can be set
to a larger value.



