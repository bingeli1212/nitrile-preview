---
title: The "plst" BODY paragraph
---

# The "plst" BODY block

The "plst" BODY block is recognized to contain tightly packed
list; each list item might also contain additional child 
list.

If the start of this block is recognized, the rest of the text
of the paragraph until a blank line is considered to have
been part of the same block; however, each line of the text is to be
tested with a pattern similar to the one of the first line, to recognize
the start of another item. For instance, following is an ITEMIZE block
with two items.

    - Apple is a type of
      fruit everyone likes.
    - Pear is another type 
      of fruit that is popular.

When a ITEMIZE block is started, an indented paragraph following it would
be considered part of the block, and is to be examined to see if it fits
the definition of an indented item, or a normal paragraph that is 
part of the previous item.
      

    - Apple is a type of
      fruit everyone likes.
    - Pear is another type 
      of fruit that is popular.
      It has the following variety.
      - Tall pear
      - Round pear
      - Spring pear

Following are two independent "plst" BODY paragraphs.

    - Apple: is a type of
      fruit everyone likes.

    - Pear: is another type 
      of fruit that is popular.
      It has the following variety.
      - Tall pear
      - Round pear
      - Spring pear

For a DL item it consists a "term" and "description". 
The term is typically the first line and the description
are all the rest of the lines.

    + Apple
      This is a great apple.
    + Pear
      This is a great pear.


# Translations

The HTML translation is a "ul", "ol" or a "dl" element depending on the type of
the list.

The LATEX translation is a "\begin{packed_itemize}", a
"\begin{packed_enumerate}", or "\begin{packed_description}" environment
depending on the type of the list.

The CONTEX translation is a "\startitemize[packed]", or "\startDLpacked"
depending on the type of the list.

Note that visual effects of a HTML and LATEX translation has traditionally been
for the bullet to be shifted to the right, not necessarily flush with the text
of its parent items. However, the visual effects of a CONTEX translation has
always been for the bullet to be flushed with the left edge of the text of its
parent item.

