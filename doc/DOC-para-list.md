---
title: The "list" paragraph
---

The "list" paragraph is automatically recognized
by the presence of a symbol before 
the text of the first line.

This could be a hyphen, a plus-sign, a asterisk,
or a greater-than-sign. 

Following is treated as a block of unordered list,
where each list item is shown with a text bullet.

    ~~~list
    - Categorical (If A is in C then B is in C)
    - Disjunctive (If A is not true then B is true)
    - Hypothetical (If A is true then B is true)
    ~~~

Following is treated as a paragraph of ordered list,
where each item is shown with a number starting from
1 followed by a period.

    ~~~list
    * Categorical (If A is in C then B is in C)
    * Disjunctive (If A is not true then B is true)
    * Hypothetical (If A is true then B is true)
    ~~~

Following is treated as a paragraph of description list,
where the first line or the text before the first appearance
of a double-space is treated as the description term
and other text as description data.

    ~~~list
    + Categorical    If A is in C then B is in C
    + Disjunctive    If A is not true then B is true
    + Hypothetical   If A is true then B is true
    ~~~

For a list-paragraph, 
all items after the first must match the first item
in terms of the type. 
This means if the first item is the one started 
with a hyphen, then the second item must also 
start with a hyphen in order to be recognized
as such. 

Besides those that start with a symbol, there
are also three additional types---the one 
starting with a number, a letter a-z, or a letter
A-Z. Either of these choice must also end
with a period or a right-parenthesis. For 
instance,

    ~~~list
    1. Categorical (If A is in C then B is in C)
    2. Disjunctive (If A is not true then B is true)
    3. Hypothetical (If A is true then B is true)
    ~~~

    ~~~list
    a. Categorical (If A is in C then B is in C)
    b. Disjunctive (If A is not true then B is true)
    c. Hypothetical (If A is true then B is true)
    ~~~

    ~~~list
    A. Categorical (If A is in C then B is in C)
    B. Disjunctive (If A is not true then B is true)
    C. Hypothetical (If A is true then B is true)
    ~~~

    ~~~list
    1) Categorical (If A is in C then B is in C)
    2) Disjunctive (If A is not true then B is true)
    3) Hypothetical (If A is true then B is true)
    ~~~

    ~~~list
    a) Categorical (If A is in C then B is in C)
    b) Disjunctive (If A is not true then B is true)
    c) Hypothetical (If A is true then B is true)
    ~~~

    ~~~list
    A) Categorical (If A is in C then B is in C)
    B) Disjunctive (If A is not true then B is true)
    C) Hypothetical (If A is true then B is true)
    ~~~

The period or right-parenthesis is going to be kept
and placed after the number or letter
for Latex.JS and Html.JS translation. 

One of the latest additions is the checkbox style item,
where the first line starts with a open bracket, followed
by a single word character or space, and followed by a close bracket,
and a white space. When this pattern is detected, then each
item is considered to represent a checkbox placed in front of
each letter and the letter inside the bracket serves
as the indication that this checkbox is checked.

    ~~~list
    [ ] Item 1
    [ ] Item 2
    [x] Item 3
    ~~~

A list-paragraph can also be configured to use customized
bullets. To do this, set the bullet-style such as 
``bullet:&cross;``, to specify that a Ballot X character
to be used for each bullet, and ensure that the list
is a UL type.

    ~~~list{bullet:&cross;}
    - Item 1
    - Item 2
    - Item 3
    ~~~

It is also possible to set the type directly by settting the
type-style to one of the following values: ``type:UL``, or
``type::OL``, or ``type:A``, or ``type:a``, or ``type:0``, or
``type:CB`.

In this case each line will be treated as an item by itself
and the bullet will be set accordingly. Following is anther way to show
unordered list with three items where each item starts with a text bullet.

    ~~~list{type:OL}
    Item 1
    Item 2
    Item 3
    ~~~

    ~~~list{type:CB}
    Item 1
    Item 2
    Item 3
    ~~~