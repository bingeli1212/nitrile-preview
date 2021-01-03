---
title: Styling images using CSS
---

By default, the "width" and "height" attributes
of img-element would have controlled the width
and height of the image directly. Setting both
of them will likely change the aspect ratio
of the image, while setting either one of them
will keep the original aspect ratio and allow
the other to grow or shrink in proportion.

However, CSS does allow the original image to 
maintain its aspect ratio if both width
and height are to be changed at the same time.
If we still want to allow the image to maintain
its aspect ratio, then the image will have to 
decide how it should resize itself given the new
dimension. This decision comes down to setting
the "object-fit" style.

+ object-fit:contain

  When "object-fit:contain" is set, the image will
  be resized so that it is completely contained
  within the new confined area without going overboard.
  This is the style to use if the entire image
  needs to be visible the whole time.

  ```
    <img style='object-fit:contain;width:10cm;height:5cm' 
      src='tree.png' />`;
  ```

+ object-fit:cover

  When "object-fit:cover" is specified, the entire container box
  should be covered by the image with no empty area. This means if the
  image's aspect ratio does not agree with the container box, part of
  the image will be clipped. However, the visible part of the image
  will always maintain its aspect ratio regardless and will not be
  distorted.

+ object-fit:fill

  When "object-fill" is specified, the image will be stretched in both
  direction to fill the container box. No part of the image will be lost,
  and image is likely distorted. This is the same behavior as
  if this style option is not specified. 

+ object-fit:none

  You can also specify "object-fit:none", which in this case will not 
  resize the image in anyway. The image will be shown in its native
  size.

+ object-fit:scale-down

  The content is sized as if none or contain were specified, whichever
  would result in a smaller concrete object size.


  
  


