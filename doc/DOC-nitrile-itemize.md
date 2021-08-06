---
title: Itemize
---

# The ITEMIZE block

An ITEMIZE block is considered the start of a text
such that its first character of its first line is
a plus-sign/hyphen-minius/asterisk, followed
by a space or more, and then additional texts.

If the start of this block is recognized, the rest of the text
of the paragraph until a blank line is considered to have
been part of the same block; however, each line of the text is to be
tested with a pattern similar to the one of the first line, to recognize
the start of another item. For instance, following is an ITEMIZE block
with two items.

.sample

    - Apple: a type of
      fruit everyone likes.
    - Pear: another type 
      of fruit that is popular.

When a ITEMIZE block is started, an indented paragraph following it would
be considered part of the block, and is to be examined to see if it fits
the definition of an indented item, or a normal paragraph that is 
part of the previous item.
      
.sample

    - Apple: is a type of
      fruit everyone likes.
    - Pear: is another type 
      of fruit that is popular.
      It has the following variety.

      - Tall pear
      - Round pear
      - Spring pear

The previous example would have typesetted the three varieties
of a pear to be sub-items of the item "Pear".
Note that the blank line between the last line of the item "Pear"
and the first line of "Tall pear" is mandatory; and otherwise
these subitems are recognized as the continuation of the text
for the same "Pear" item, such as the following example
would have shown.

.sample

    - Apple: is a type of
      fruit everyone likes.
    - Pear: is another type 
      of fruit that is popular.
      It has the following variety.
      - Tall pear
      - Round pear
      - Spring pear

If the indented paragraph does not start with a 
plus-sign/hyphen-minius/asterisk, 
then the entire indented paragraph is recognized
to be a normal paragraph.

.sample

    - Apple: is a type of
      fruit everyone likes.
    - Pear: is another type 
      of fruit that is popular.
      It has the following variety.

      "James likes apples."

# Packed/unpacked items

The items could be considered packed if there are no visible spaces
between each item. Following are packed items.

.sample

    - Apple: is a type of
      fruit everyone likes.
    - Pear: is another type 
      of fruit that is popular.
      It has the following variety.

Following are unpacked items.

.sample

    - Apple: is a type of
      fruit everyone likes.

    - Pear: is another type 
      of fruit that is popular.
      It has the following variety.

NITRILE recognized a packed/unpacked item by the presence of the blank lines
before the second item or any item after that. If any one of the items is
unpacked then every item in the same list is unpacked.  Unpacked items will
have visible vertical margins before/after it.

# The UL keys

For a UL item that is a single line, a search is conducted to look into the
content of first line after the bullet,  to searched for the appearance of a
"key".  Following are all items with valid keys:

.sample

    - Apple - This is a great apple.
    - Pear - This is a great pear.
    - Apple: This is a great apple.
    - Pear: This is a great pear.
    - margin-left - This is a great apple.
    - margin-right - This is a great pear.
    - margin-left: This is a great apple.
    - margin-right: This is a great pear.
    - url(): This is a great apple.
    - url() - This is a great pear.
    - cx.lineWidth: This is a great apple.
    - cx.lineWidth - This is a great pear.
    - cx.drawImage(): This is a great apple.
    - cx.drawImage() - This is a great pear.

In general, a key is recognized as a word with only the following characters:
any alphanumerical letter such as capital or small letters, digits from 0-9, a
period, a hyphen-minus, and left/right parenthesis. There cannot be any spaces
allowed in a key. 

The key is to be followed by a "separator" which must be a
"space-hyphen-space", or "colon-space", and then additional texts.

The key is typically typeset as italic, and the separator added, followed by 
the normal text.

# The DL term

For a DL item it consists a "term" and "description". 
The term is typically the first line and the description
are all the rest of the lines.

.sample

    + Apple
      This is a great apple.
    + Pear
      This is a great pear.

However, if there is only a single line, then it is assumed that the line
contains both the term and the description. A search is to be conducted
to separate the term form the description. The pattern is to be recognized
in the same manner as that for a UL item of a single line.

    + Apple - This is a great apple.
    + Pear - This is a great pear.
    + Apple: This is a great apple.
    + Pear: This is a great pear.
    + margin-left - This is a great apple.
    + margin-right - This is a great pear.
    + margin-left: This is a great apple.
    + margin-right: This is a great pear.
    + url(): This is a great apple.
    + url() - This is a great pear.
    + cx.lineWidth: This is a great apple.
    + cx.lineWidth - This is a great pear.
    + cx.drawImage(): This is a great apple.
    + cx.drawImage() - This is a great pear.




