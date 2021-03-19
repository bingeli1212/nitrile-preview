---
title: The PLST Block
---

The PLST block exists to hold the structure of a nested list 
with multiple nested levels and optionally text blocks
that are child to an list item. 

It can hold four different type of lists: UL, OL, DL, and HL.
The UL type is the "unordered list". The OL type is the "ordered
list". The DL type is the "description list". The HL type 
is the "hanging list". Each of the list is to be recognized
by a special symbol that proceeds the first item of that list.

Following is a UL list of four items.

    - Apple
    - Pear
    - Strawberry
    - Banana

Following is a OL list of four items.

    * Apple
    * Pear
    * Strawberry
    * Banana

Following is a DL list of four items.

    + Apple

      A fruit.

    + Pear

      A fruit.

    + Strawberry

      A fruit.

    + Banana

      A fruit.

Following is a HL list of four items.

    <> Apple
    <> Pear
    <> Strawberry
    <> Banana

Note that for a DL, the entire list item is to be recognized
as expressing a "data term". The "data description" are to be
recognized as the "text paragraphs" that follows that item.

In addition, for a DL, if there are no "data description" part
to be found for a particular "data term", then that "data term"
is to be "merged" with the "data term" of the following on item
if possible. By "merged" it means that both data terms are to be
shown one on top of another with no visible vertical spaces between
these data terms. This feature is to allow for two or more "data
terms" to share the same description.





