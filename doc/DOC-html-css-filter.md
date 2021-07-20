---
title: CSS Filters
---

# Filter Functions

To use the CSS filter property, you specify a value for one of the following
functions listed above. If the value is invalid, the function returns “none.”
Except where noted, the functions that take a value expressed with a percent
sign (as in 34%) also accept the value expressed as decimal (as in 0.34).

Here’s a demo that lets you play with individual filters a bit:


+ grayscale()

  ```verbatim
  filter: grayscale(20%)
  /* same as... */
  filter: grayscale(0.2);
  ```

  Converts the input image to grayscale. The value of “amount” defines the
  proportion of the conversion. A value of 100% is completely grayscale. A value
  of 0% leaves the input unchanged. Values between 0% and 100% are linear
  multipliers on the effect. If the “amount” parameter is missing, a value of
  100% is used. Negative values are not allowed.

+ sepia()

  ```verbatim
  filter: sepia(0.8);
  /* same as... */
  filter: sepia(80%);
  ```

  Converts the input image to sepia. The value of “amount” defines the proportion
  of the conversion. A value of 100% is completely sepia. A value of 0 leaves the
  input unchanged. Values between 0% and 100% are linear multipliers on the
  effect. If the “amount” parameter is missing, a value of 100% is used. Negative
  values are not allowed.

+ saturate()

  ```verbatim
  filter: saturate(2);
  /* same as... */
  filter: saturate(200%);
  ```

  Saturates the input image. The value of “amount” defines the proportion of the
  conversion. A value of 0% is completely un-saturated. A value of 100% leaves
  the input unchanged. Other values are linear multipliers on the effect. Values
  over 100% are allowed, providing super-saturated results. If the “amount”
  parameter is missing, a value of 100% is used. Negative values are not allowed.

+ hue-rotate()

  ```verbatim
  filter: hue-rotate(180deg);
  /* same as... */
  filter: hue-rotate(0.5turn);
  ```

  Applies a hue rotation on the input image. The value of “angle” defines the
  number of degrees around the color circle the input samples will be adjusted. A
  value of 0deg leaves the input unchanged. If the “angle” parameter is missing,
  a value of 0deg is used. The maximum value is 360deg.

+ invert()

  ```verbatim
  filter: invert(100%);
  ```
      
  Inverts the samples in the input image. The value of “amount” defines the
  proportion of the conversion. A value of 100% is completely inverted. A value
  of 0% leaves the input unchanged. Values between 0% and 100% are linear
  multipliers on the effect. If the “amount” parameter is missing, a value of
  100% is used. Negative values are not allowed.

+ opacity()

  ```verbatim
  filter: opacity(0.5);
  /* same as... */
  filter: opacity(50%);
  ```

  Applies transparency to the samples in the input image. The value of “amount”
  defines the proportion of the conversion. A value of 0% is completely
  transparent. A value of 100% leaves the input unchanged. Values between 0% and
  100% are linear multipliers on the effect. This is equivalent to multiplying
  the input image samples by amount. If the “amount” parameter is missing, a
  value of 100% is used. This function is similar to the more established opacity
  property; the difference is that with filters, some browsers provide hardware
  acceleration for better performance. Negative values are not allowed.

+ brightness()

  ```verbatim
  filter: brightness(0.5);
  /* same as... */
  filter: brightness(50%);
  ```

  Applies a linear multiplier to input image, making it appear more or less
  bright. A value of 0% will create an image that is completely black. A value of
  100% leaves the input unchanged. Other values are linear multipliers on the
  effect. Values of an amount over 100% are allowed, providing brighter results.
  If the “amount” parameter is missing, a value of 100% is used.

+ contrast()

  ```verbatim
  filter: contrast(4);
  /* same as... */
  filter: contrast(400%);
  ```

  Adjusts the contrast of the input. A value of 0% will create an image that is
  completely black. A value of 100% leaves the input unchanged. Values over the
  amount over 100% are allowed, providing results with less contrast. If the
  “amount” parameter is missing, a value of 100% is used.

+ blur()

  ```verbatim
  filter: blur(5px);
  filter: blur(1rem);
  ```

  Applies a Gaussian blur to the input image. The value of ‘radius’ defines the
  value of the standard deviation to the Gaussian function, or how many pixels on
  the screen blend into each other, so a larger value will create more blur. If
  no parameter is provided, then a value 0 is used. The parameter is specified as
  a CSS length, but does not accept percentage values.

+ drop-shadow()

  ```verbatim
  filter: drop-shadow(2px 2px 5px rgb(0 0 0 / 0.5));
  filter: drop-shadow(4px 4px red); /* no blur */
  ```

  Applies a drop shadow effect to the input image. A drop shadow is effectively a
  blurred, offset version of the input image’s alpha mask drawn in a particular
  color, composited below the image. The function accepts a parameter of type
  (defined in CSS3 Backgrounds), with the exception that the ‘inset’ keyword is
  not allowed.

  This function is similar to the more established box-shadow property; the
  difference is that with filters, some browsers provide hardware acceleration
  for better performance.

  Drop-shadow also mimics the intended objects outline naturally unlike
  box-shadow that treats only the box as its path.

  Just like with text-shadow, there is no ‘spread’ parameter to create a solid
  shadow larger than the object.

+ url()

  ```verbatim
  filter: url()
  ```

  The url() function takes the location of an XML file that specifies an SVG
  filter, and may include an anchor to a specific filter element. Here’s a
  tutorial that works as a nice intro to SVG filters with a fun demo.

# Animating Filters

Since Filters are animatable it can open the doors for a whole bunch of fun.

# Notes

- You may combine any number of functions to manipulate the rendering, but order
  still matters (i.e., using grayscale() after sepia() will result in completely
  gray output).

- A computed value of other than “none” results in the creation of a stacking
  context the same way that CSS opacity does. The filter property has no effect
  on the geometry of the target element’s box model, even though filters can
  cause painting outside of an element’s border box. Any parts of the target
  element are affected by filter functions. This includes any content,
  background, borders, text decoration, outline and visible scrolling mechanism
  of the element to which the filter is applied, and those of its descendants.
  Filters can also be applied to inline content, such as individual text spans.

- The specification also introduces a filter(image-URL, filter-functions) wrapper
  function for an image. It would allow you to filter any image at the time you
  use it within CSS. For example, you could blur a background image without
  blurring the text. This filter function is not yet supported in browsers. In
  the meantime, you can apply both the background and the filter to a
  pseudo-element to create a similar effect.
