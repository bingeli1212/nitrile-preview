---
title: Font Format
---

# Background

In this chapter the font formats as we know them will be introduced. The
descriptions will be rather general but more details can be found in the
appendix. Although in MkIV we do support all these types eventually the focus
will be on OpenType fonts but it does not hurt to see where we are coming
from.

# Glyphs

A typeset text is mostly a sequence of characters turned into glyphs. We talk
of char- acters when you input the text, but the visualization involves
glyphs. When you copy a part of the screen in an open pdf document or html
page back to your editor you end up with characters again. In case you wonder
why we make this distinction between these two states we give an example.

    affiliation   affiliation

We see here that the shape of the a is different for an upright serif and an
italic. We also see that in ffi there is no dot on the i. The first case is
just a stylistic one but the second one, called a ligature, is actually one
shape. The 11 characters are converted into 9 glyphs. Hopefully the final
document format carries some extra information about this transformation so
that a cut and paste will work out well. In pdf files this is normally the
case. In this document we will not be too picky about the distinction as in
most cases the glyph is rather related to the character as one knows it.

So, a font contains glyphs and it also carries some information about
replacements. In addition to that there needs to be at least some information
about the dimensions of them. Actually, a typesetting engine does not have to
know anything about the actual shape at all.

@ figure{subfigure}

  &img{image-font-format-1.png}{width:5cm}
  
  &img{image-font-format-2.png}{width:5cm}

  \\
  
  &img{image-font-format-3.png}{width:10cm}


The rectangles around the shapes are called
boundingbox. The dashed line reflects the baseline where they eventually are
aligned onto next to each other. The amount above the baseline is called
height, and below is called depth. The piece of the shape above the baseline
is the ascender and the bit below the descender. The width of the bounding box
is not by definition the width of the glyph. In Type1 and OpenType fonts each
shape has a so called advance width and that is the one that will be used.

Another traditional property of a font is kerning.  In typography, kerning is
the process of adjusting the spacing between characters in a proportional
font, usually to achieve a visually pleasing result. Kerning adjusts the space
between individual letterforms, while tracking (letter-spacing) adjusts
spacing uniformly over a range of characters.

In its simplest form, kerning is adjusting the space between two individual
letters, while tracking is adjusting the spacing uniformly over a given
selection of text. The goal for both is to equalize the appearance of the
whitespace between letters.

In figure (c) you see this in action. These examples demonstrate that not all
fonts need (or provide) the same kerns (in points).

Leading is a typography term that describes the distance between each line of
text. It is pronounced ledding (like "sledding" without the "s"). The name
comes from a time when typesetting was done by hand and pieces of lead were
used to separate the lines.

So, as a start, we have now met a couple of properties of a font. They can be
summarized as follows:

- mapping to glyphs : characters are represented by a shapes that have
  recognizable properties so that readers know what they mean 

- ligature building : a sequence of characters gets mapped onto one glyph

- dimensions : each glyph has a width, height and depth

- inter-glyph kerning : optionally a bit of positive or negative space has to
  be inserted between glyphs

Regular font kerning is hardly noticeable and improves the overall look of the
page. Typesetting applications sometimes are capable of inserting additional
spaces between shapes. This more excessive kerning is not that much related to
the font and is used for special purposes, like making a snippet of text stand
out. In ConTEXt this kind of kerning is available but it is a font independent
feature. Keep in mind that when applying that kind of rather visible kerning
you’d better not have ligatures and fancy replacements enabled as ConTEXt
already tries to deal with that as good as possible.

















