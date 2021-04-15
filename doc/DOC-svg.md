---
title: SVG translation
---


# Advantages of Using SVG

7 Reasons Why You Should Be Using Scalable Vector Graphics

- SVGs are scalable and will render pixel-perfect at any resolution whereas
  JPEGs, PNGs and GIFs will not.
- SVGs are vector images and therefore are usually much smaller in file-size
  than bitmap-based images.
- Embedded SVGs can be styled using CSS.
- They are SEO friendly allowing you to add keywords, descriptions and links
  directly to the markup.
- SVGs can be embedded into the HTML which means they can be cached, edited
  directly using CSS and indexed for greater accessibility.
- They are future proof. SVGs can be scaled indefinitely meaning that they will
  always render to pixel-perfection on newer display technologies such as 8K
  and beyond.
- SVGs can be animated directly or by using CSS or JavaScript making it easy
  for web designers to add interactivity to a site.



# What Is SVG and What Is SVG Used For?

Let’s get technical for a second. SVG stands for “Scalable Vector Graphics” and
is an XML based, vector image format.

SVG images are predominantly found on the web, and while they have comparable
uses to JPEG, PNG and WebP image types, their DNA is extremely different.

In its simplest form, this is what an SVG file looks like under the hood:

    <svg xmlns="http://www.w3.org/2000/svg">
      <rect width="250" height="250" fill="#0000FF"/>
    </svg>

That SVG file would render a 250 pixels wide, blue square.

So how are SVGs different?

Well, traditional image types like JPEG, PNG and GIF are bitmap-based (or
raster-based), meaning they consist of a set amount of pixels. Typically, this
means that as soon as you start to increase or decrease an image of this type,
you are presented with jagged lines, blurry artifacts and a pixelated mess.

We also have the more recent image type of WebP, developed by Google which aims
to supersede the JPEG, PNG and GIF file formats altogether as a singular more
flexible solution. I feel as if discussing WebP would make this article more
confusing than helpful as it’s a different subject altogether which I’d be
happy to consider in another article.

In short, the WebP image type was created to generate much smaller file sizes
and eliminate the need to use different image types on the web. It is currently
unsupported by Safari and is yet to gain significant traction on the web.

You can find out more about WebP via the Google Developers site or read this
article by our very own Ian Jones which discusses WebP compression in a bit
more detail as well as how to serve WebP images using WP Offload Media.

Right, back on track…

So how does the SVG format differ to bitmap-based images? They are vector-based
meaning that they are resolution independent. Rather than consisting of pixels,
SVG images consist of shapes. This means that they can scale indefinitely
without a reduction of quality. Magical.

Okay, so enough about what they are. Why should we use them?



# Config Font Color For Text

The color in SVG can be specified in following different forms.

    <use x = "300" y = "10" xlink:href = "#s3" fill = "cornflowerblue"/>
    <use x = "370" y = "10" xlink:href = "#s3" fill = "rgb(100, 149, 237)"/>
    <use x = "440" y = "10" xlink:href = "#s3" fill = "#6495ED"/>
    <use x = "510" y = "10" xlink:href = "#s3" fill = "rgb(39.2%, 58.4%, 92.9%)"/>



# Embed a PNG image inside a SVG

The <image> SVG element includes images inside SVG documents. It
can display raster image files or other SVG files.

The only image formats SVG software must support are JPEG, PNG,
and other SVG files. Animated GIF behavior is undefined.

SVG files displayed with <image> are treated as an image:
external resources aren't loaded, :visited styles aren't applied,
and they cannot be interactive. To include dynamic SVG elements,
try <use> with an external URL. To include SVG files and run
scripts inside them, try <object> inside of <foreignObject>.

Note: The HTML spec defines <image> as a synonym for <img> while
parsing HTML. This specific element and its behavior only apply
inside SVG documents or inline SVG.

    <svg width="200" height="200"
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink">     
      <image href="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png"
         height="200" width="200"/>
    </svg>

Following are the attributes of the "image" element (copied from developer.mozilla.org):

+ x  
+ y  
  Positions the image horizontally from the origin.
+ width  
+ height 
  The width and the height of the image renders at. Unlike HTML's <img>, these two
  attributes are required.
+ href 
+ xlink:href 
  Points at a URL for the image file.
+ preserveAspectRatio 
  Controls how the image is scaled.
+ crossorigin 
  Defines the value of the credentials flag for CORS requests.

The "image" element is also to have the following "global" attributes:

- Conditional processing attributes
- Core attributes
- Graphical event attributes
- Presentation attributes
- Xlink attributes
- ``class``
- ``style``
- ``externalResourcesRequired``
- ``transform``

There are some important things to take note of. First of all, if you do not
set the ``x`` or ``y`` attributes, they will be set to 0.

The ``width`` and ``height`` attributes of the "image" element is required,
without which the image will not be shown.  This is different that the behavior
of the "img" element, which would have rendered the image using its native
size, when the ``width`` and ``height`` are omited. Following is an example:

    <image width="100%" height="10mm" href="./image-clock.png"/>

The "image-clock.png" is a 125-by-125 pixel image.  In the previous example
this image will be shown centered horizontally just below the top line of the
viewport and its height will be set to 10mm. 

This is because the ``width`` attribute, when set to "100%", is to entitle the
image to the entire width of the viewport. However, since the
``preserveAspectRatio`` attribute is set in such a way that the image must be
preserving its aspect ratio, the image's width is only to be as large as its
height.  Since the viewport's width is larger than 10mm, the image appears to
be centered horizontally with visible margins on its left and right hand sides.



