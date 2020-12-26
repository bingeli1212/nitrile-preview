---
title: External Images
---

External images can be part of a paragraph. Both LATEX and HTML supports 
mixing images and text. 

Nitrile provides a phrase that allows for an external image file to be
included within the paragraph. For instance, ``&img{tree.png}`` would
have specified that the image file ``tree.png`` that is in the same
directory of the MD file is to be inserted at this location
of the paragraph.

There are several things about the image -

1. For LATEX and HTML, the image will be placed inside a rectangle area
   that is the maximum width of the current paragraph, with a height
   that reflect an aspect ratio of 4:3. This will always ensure that
   that this rectangle area's height is three-quarter of the width. 
   However, the aspect ratio of the original image is to be maintained
   and shown maximized within this rectangle area. For example, if the
   image has a height that is twice the length as its width, then 
   the image will shown with its height reaching the top and bottom
   of the rectangle area, and some visible gap will be shown to the
   left and right-hand side of this image.

2. For LATEX, this effect is achieved using a ``\parbox`` with a fixed
   width and height, and then the image file is placed inside this
   box by the presence of the ``\includegraphics{}`` command, where
   this command will have a ``keepaspectratio`` option set. 

3. For HTML, this effect is achieved through the availability of the
   image-element of SVG. This element allows an external image to be
   shown inside an SVG. The aspect ratio of this image is automatically
   preserved. The SVG itself is then designed to maintain a 4:3 
   aspect ratio. This workaround is due to the limitation of the
   current CSS standard that lacks the native support for allowing for
   a specific aspect ratio to be specified for an image.

4. For EPUB, the technique of using the image-element within a SVG
   seems to not to be well supported currently by iBook and Calibra. 
   Thus, the EPUB translation has been reverted to using the img-element
   tag instead. 

The advantage of always have a container rectangle that respects
aspect ratio is such that when placing images side-by-side, especially
inside a figure environment, the vertical distance will line up
nicely, whilest otherwise images placed side-by-side will tend to 
have different height. 

To express a different aspect ratio other than the default setting
of 4:3, submit an "aspectratio" style-option. For instance, 
``&img{tree.png,aspectratio:9/4}`` would have provided a container
rectangle that is 9:4 in aspect ratio. 

For a img-phrase that is part of a paragraph, the width is automatically
set to be the maximum of the paragraph. However, this could be changed
by submitting the "width" style-option. For instance, 
``&img{tree.png,width:50%,aspectratio:9/4}`` would have
expressed that the container rectangle be set at the 50-percent of
the current paragraph width, and where its height is to be four-nineth
of the width, whatever that is.

When external images are used within a "figure" paragraph, 
the width of each image is always fixed at the width that is 
determined by the total paragraph width and the total number
of images to appear side by side. In this case, the width info
supplied by the "width" style-option is to be
ignored.



