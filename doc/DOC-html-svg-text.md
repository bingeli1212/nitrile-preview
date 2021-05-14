---
title: SVG text element
---

# Draw multiple lines of text

By default, without any added attributes, the <tspan> simply mix
the text with the surrounding text without changing its
position and appearances.

    <svg xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <text x="20" y="15">
        <tspan>tspan line 1</tspan>
        <tspan>tspan line 2</tspan>
      </text>
    </svg>

You can also set the x attribute to fix the x-coordinate of the text
lines. This is useful if you want to display a list of lines below
each other, all left adjusted. Here is an example that sets x to 10 on
three lines:

    <svg xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <text y="20">
        <tspan x="10">tspan line 1</tspan>
        <tspan x="10" dy="15">tspan line 2</tspan>
        <tspan x="10" dy="15">tspan line 3</tspan>
      </text>
    </svg>

If you specify more than one number inside the dx attribute, each
number is applied to each letter inside the <tspan> element. Here is
an example:

    <text x="10" y="20">
      <tspan dx="5 10 20">123</tspan>
    </text>

It is possible to style <tspan> elements
individually. Thus you can use a <tspan> element to style a block of
text differently than the rest of the text. Here is an example,
and the resulting image: "Here is a &b{bold} word."

    <text x="10" y="20">
      Here is a <tspan style="font-weight: bold;">bold</tspan> word.
    </text>    


You can use the baseline-shift CSS property to create superscript and
subscript with the <tspan> element. Here is an SVG baseline-shift
example showing how, and the resulting image is: "text with
&sup{^superscript}" and &sub{_subscript} mixed with normal text."

    <text x="10" y="20">
      text with 
      <tspan style="baseline-shift: super;">superscript</tspan>
      and 
      <tspan style="baseline-shift: sub;">subscript</tspan> 
      mixed with normal text.
    </text>


The SVG <tref> element is used to reference texts that are defined by
the <defs> element. This way you can display the same text multiple
times in your SVG image, without having to include the text more than
once. Here is an example:

    <svg xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <text id="theText">A text that is referenced.</text>
      </defs>
      <text x="20" y="10">
        <tref xlink:href="#theText" />
      </text>
      <text x="30" y="30">
        <tref xlink:href="#theText" />
      </text>
    </svg>



