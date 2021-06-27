---
title: CSS Multiple Background Images
doc: page
---

# Multiple Background Images

It is possible to a div-element such that it has multiple background images
laid on top of each other.

In the following example the div-element is styled with the class "multi-bg-example"
such that it has three background images, and one linear gradient on top of each other.
The position of each image is specified by the "background-position" property, 
and each background image is specified by the "background-image" property, where each
image is a "url" function, and the linear gradient is a "linear-gradient" function.     
    
    .multi-bg-example {
      width: 100%;
      height: 400px;
      background-image: url(firefox.png),
        url(bubbles.png),
        linear-gradient(to right, rgba(30,75,115,1), rgba(255,255,255,0));
      background-repeat: no-repeat,
        no-repeat,
        no-repeat;
      background-position: bottom right,
        left,
        right;
    }