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
- ss-phrase - text with shown by the current choice of sans-serif text font
- tt-phrase - text with shown by the current choice of monospaced text font
- overstrike-phrase - text with shown by an accompanying overstrike line in the middle of the text

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

The framebox-phrase is designed to display a rectangular box as part of a inline text
to simulate a fill-in box that often accompanies a form. 

The box to be shown is to have a surrounding border. It should have a height that is the same as that 
of the surrounding text.

The width of the box is configurable and is conveyed by the content of this phrase. It should be
an integer expressing the total number of millimeters that is the width of this box. If the content
is empty, the box will default to a width that is 10 millimeters.












