---
title: Phrases
---

Phrase is a term used to describe a part of inline text within a 
MD document that refers to some text that would be shown 
differently, or something that could have a completely
different semantic. 

For instance, the b-phrase would show a part of text
that is is bold.

    This &b{word} is bold.

In the previous example the text between the open and close
braces are the content of this phrase. The content of 
a phrase is to be interpreted different for each phrase. For
the b-phrase, the content is to be treated as a part 
of a normal text that happen to be shown using a different
font style.

However, for a ref-phrase, the content of this phrase is to be
treated as pointing to an existing label that is to accompany
another block.

    Please see figure &ref{mypic} for more information.

Here, the text "a1" refers to a specific label, which is itself
a string that often accompanies a figure, table, or others. 
Following is an example of a "figure" block that is accompanied
by a label that is "a1"; thus, the previous ref-phrase would likely
have genearted a text that reads like "12" if this figure is the 12th
figure in the current document.

    .figure
    &label{mypic}
     
      ```dia
      \image "mypic.png" 
      ```

Note that all phrases starts with an ampersand, followed by letters only
and opening and closing braces. The content between the opening and closing
braces are the content of the phrase. Phrases cannot be nested.

# Font style phrases

Following phrases are used to style a part of the inline text.

- b-phrase - bold text
- em-phrase - emphasized text
- it-phrase - italic text
- u-phrase - underlined text
- ss-phrase - text shown by the current choice of sans-serif text font
- tt-phrase - text shown by the current choice of monospaced text font
- overstrike-phrase - text shown by an accompanying overstrike line in the middle of the text
- q-phrase - text shown by an accompanying left/right double quotation marks             
- g-phrase - text shown by an accompanying left/right guillemot marks                      
- low-phrase - text shown as a subscript 
- high-phrase - text shown as a superscript
- small-phrase - text shown with reduced font size than surrounding text             

# Inserting horizontal spaces

Following two phrases will insert horizontal spaces with predefined length.

- quad-phrase - this is half the length of the current font size
- qquad-phrase - this is the full length of the current font size

Note that the content of the phrase is ignored. See the examples below.

    This will insert &quad{} and &qquad{} and then texts.

# Inserting references to other blocks

The ref-phrases inserts a text that references a particular figure, 
table or other blocks. The content of this phrase is a string
that is the label of that block.

# Inserting a URL

The link-phrase would insert a URL into the surrounding text.   
The content of the phrase is a string that represents the URL

# Inserting a line break

The br-phrase would insert a line break that will force a line break
at that point. The content of this phrase is ignored.

# Insert a Unicode character 

The utfchar-phrase would insert a new Unicode character whose code point
is what's been given as the content of this phrase.  The following
example would insert a Unicode character that is U+2212.

    The Unicode character of U+2212 looks like &utfchar{2212}.

# Insert a string describing a Unicode character

The utfdata-phrase inserts a string that is the content of a 
Unicode character of the given code point.

    The Unicode character of U+2212 is described as:  
    &utfchar{2212}.

# The colorbutton-phrase

The intent of this phrase is to show a color in the shape of a square, 
such that this square is considered part of an inline text.

A typical implementation of this phrase is to show a Unicode character U+25FC
with the intended color, with a border surrounding it such that the color of
the border is always black and there is a inner padding between the square and
the border that is set to 1pt. Following is an example that showcases a color
button that is of color Red.

    The color button is &colorbutton{red}.

# The framebox-phrase

The framebox-phrase is designed to display a rectangular box as part of a
inline text to simulate a fill-in box that often accompanies a form. 

The box to be shown is to have a surrounding border. It should have a height
that is the same as that of the surrounding text.

The width of the box is configurable and is conveyed by the content of this
phrase. It should be an integer expressing the total number of millimeters that
is the width of this box. If the content is empty, the box will default to a
width that is 10 millimeters. Following example inserts a frame box that
has a length of 35 millimeters.

    The framebox is &framebox{35}.


# The dia-phrase

The dia-phrase is used to generate a picture including loading an external image.
The result is a SVG for a HTML translation, a TIKZ-picture for LATEX and a 
MF image for a CONTEX translation. 

The content of this phrase is divided into two parts: the first part is a string
that is to be processed for a that is used to style the DIA processor, and the
second part is the content of the DIA language itself. The first and the second
part is separated by a double-semicolon, and the statements of the language
itself is separated by double-semicolon as well. 

Note that the frame-style that is typically seen by a dia-bundle is not applicable
to a picture generated by a dia-phrase. The DIA is entirely responsible for its 
content, including putting a framed border around its picture.

For HTML translation a SVG is generated, and the "width" and "height" attributes
are currently set to match the style-width option. For LATEX a TIKZPICTURE is generated,
which could be wrapped with a "resizebox" command to resize it to a new size to match
that of the style-width option. For CONTEX translation a "\startMPcode\stopMPcode" section
is the result. This would have already had the picture correctly resized to the one
asked for by the style-width option. 

However, for CONTEX translation it has been observed that if a
"\startMPcode\stopMPcode" is to put inside a "\starttable\stoptable" directly
then it causes weired vertical alignment mismatch between the neighboring table
data of the same row, causing the table row to become too large. The solution
to this problem is to place a "\framed{}" around the "\startMPcode\stopMPcode".









