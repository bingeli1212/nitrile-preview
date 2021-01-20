---
title: The "figure" paragraph
---

The figure paragraph on LATEX translation is always to generate
a begin-end-figure environment. If the caption-style or label-style
option is present, then the figure will be labeled; if the
caption-style option is present, the caption will be inserted.

    ~~~figure
    &img{./tree.png}
    &img{./flower.png}
    &img{./flog.png}
    ~~~

In the previous example three images will be shown inside the figure,
all of them will be shown with their native size. The images will 
be shown without any subcaptions. This is great for one or a few
images where subcaptions are not needed. 

However, if subcaptions are needed, then the subfigure-style
options should be used.

    ~~~figure{subfigure}
    &img{./tree.png}
    The tree.
    &img{./flower.png}
    The flower.
    &img{./flog.png}
    The flog.
    ~~~

When subfigure-option is set, each image will be attached a subcaption, 
shown with letter (a), (b), (c), etc., at the bottom of each image. 
The subcaption text are those that are detected after the image and before
the start of the next image. 

For LATEX generation, the "subfigure" package is to be used, and each 
subfigure will be shown in its native size, unless the width- and/or height-style
options are specified, in which case each image will be hornered. Note that
the width specified with percentage is to be measured relative to the size of the 
current page width---thus to show three images side by side, it would be best
to specify each one as 30 percent. Note that the "subfigure" package would
have wrapped the image to the next line if it thinks that it is too wide to fit
into the current line---something that is kind of automatic and not well predicted.
This means the correct percentage would need to be guessed a couple of times
before it can be right. 

For HTML translation, the same behavior specified above it to be simulated. 

To force a break such that the next image would have
started a new line, 
place a double-backslash in its own line. The following example
would have forced the second image to start a new line, and all
images will be resized to be just 30 percent of the current page width.

    ~~~figure{subfigure}
    &img{[width:30%](./tree.png)}
    The tree.
    \\
    &img{[width:30%](./flower.png)}
    The flower.
    &img{[width:30%](./flog.png)}
    The flog.
    ~~~

