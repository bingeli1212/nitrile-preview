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
The list type for this is "UL".

    ~~~list
    - Categorical (If A is in C then B is in C)
    - Disjunctive (If A is not true then B is true)
    - Hypothetical (If A is true then B is true)
    ~~~

Following is treated as a paragraph of ordered list,
where each item is shown with a number starting from
1 followed by a period. The list type for this list
is "OL".

    ~~~list
    * Categorical (If A is in C then B is in C)
    * Disjunctive (If A is not true then B is true)
    * Hypothetical (If A is true then B is true)
    ~~~

Following is treated as a paragraph of description list,
where the first line or the text before the first appearance
of a double-space is treated as the description term
and other text as description data. The list type for this
list is "DL".

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
are also three additional types: the one 
starting with a number, a letter a-z, or a letter
A-Z. Either of these choice must also end
with a period or a right-parenthesis. Each
of these lists will have a different type. The 
list that starts with a number is of type "1"; 
the list that starts with a lowercase letter is
of type "a", and the list that starts with an uppercase
is of type "A".

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

If the first line does not fit one of the list types, 
then each line is treated as a list item, and the list
is constructed in such a way that there is no bullet. 
In the following example we will be creating a list
with two items, and both of which will be shown without
any bullet before it.

    ~~~list
    Hello world
    This is the end.
    ~~~

One of the latest additions is the checkbox style item,
where the first line starts with a open bracket, followed
by a single word character or space, and followed by a close bracket,
and a white space. When this pattern is detected, then each
item is considered to represent a checkbox placed in front of
each letter and the letter inside the bracket serves
as the indication that this checkbox is checked. The list
type for this list is "CB".

    ~~~list
    [ ] Item 1
    [ ] Item 2
    [x] Item 3
    ~~~

Also the radiobutton style is added. The radio button gives
the user the impression that only one of the choice is available;
choosing one will automatically discheck others. The list type
for this kind of list is "RB".

    ~~~list
    ( ) Item 1
    ( ) Item 2
    (x) Item 3
    ~~~

For a "UL" type list, 
a customized
bullet can also be setup to be used for each list item.
To do this, ensure that the bullet-style is set to a 
entity name such as 
``bullet:cross``, where "cross" is a valid entity name
for referring to a Ballot X character. In this case,
the normal text bullet would have been replaced by 
this character.

    ~~~list{bullet:cross}
    - Item 1
    - Item 2
    - Item 3
    ~~~

It is also possible to set the type directly by setting the
type-style to one of the following values: ``type:UL``, or
``type::OL``, ``type:DL``, ``type:1``, ``type:a``, ``type:A``, 
``type:CB``, or ``type:RB``. However, when you do this each list
item must appear as a normal text and not containing any of the 
previous mentioned symbols, such as plus-sign, minus-sign, asterisk, etc.

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

It is also possible to combine type-style and bullet-style
to set a custom bullet. 

    ~~~list{type:UL, bullet:&cross;}
    Item 1
    Item 2
    Item 3
    ~~~