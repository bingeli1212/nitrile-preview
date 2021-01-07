---
title: The "list" paragraph
---

The "list" paragraph is automatically recognized
by the presence of a symbol before 
the text of the first line.

This could be a hyphen, a plus-sign, a asterisk,
or a greater-than-sign. 

    ~~~
    - Categorical (If A is in C then B is in C)
    - Disjunctive (If A is not true then B is true)
    - Hypothetical (If A is true then B is true)
    ~~~

    ~~~
    * Categorical (If A is in C then B is in C)
    * Disjunctive (If A is not true then B is true)
    * Hypothetical (If A is true then B is true)
    ~~~

    ~~~
    + Categorical (If A is in C then B is in C)
    + Disjunctive (If A is not true then B is true)
    + Hypothetical (If A is true then B is true)
    ~~~

All subsequent items must match the first item. 
This means if the first item is the one started 
with a hyphen, then the second item must also 
start with a hyphen in order to be recognized
as such. 

The items started with a hyphen is a UL item.
The items started with a asterisk is a OL item. 
THe items started with a plus-sign are data 
description items. 

Besides those that start with a symbol, there
are also three additional types---the one 
starting with a number, a letter a-z, or a letter
A-Z. Either of these choice must also end
with a period or a right-parenthesis. For 
instance,

    ~~~
    1. Categorical (If A is in C then B is in C)
    2. Disjunctive (If A is not true then B is true)
    3. Hypothetical (If A is true then B is true)
    ~~~

    ~~~
    a. Categorical (If A is in C then B is in C)
    b. Disjunctive (If A is not true then B is true)
    c. Hypothetical (If A is true then B is true)
    ~~~

    ~~~
    A. Categorical (If A is in C then B is in C)
    B. Disjunctive (If A is not true then B is true)
    C. Hypothetical (If A is true then B is true)
    ~~~

    ~~~
    1) Categorical (If A is in C then B is in C)
    2) Disjunctive (If A is not true then B is true)
    3) Hypothetical (If A is true then B is true)
    ~~~

    ~~~
    a) Categorical (If A is in C then B is in C)
    b) Disjunctive (If A is not true then B is true)
    c) Hypothetical (If A is true then B is true)
    ~~~

    ~~~
    A) Categorical (If A is in C then B is in C)
    B) Disjunctive (If A is not true then B is true)
    C) Hypothetical (If A is true then B is true)
    ~~~

The period or right-parenthesis is going to be kept
and placed after the number or letter
for Latex.JS and Html.JS translation. 

One of the latest additions is the checkbox-style 
option, which adds a checkbox to each list item.
The selection-style option can be set to selectively
check some of the checkboxes while the other checkboxes
are by default not checked.

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

It is also possible to set the type directly by settting the type-style
to one of the following values: ``type:UL``, or ``type::OL``, or ``type:A``, or ``type:a``,
or ``type:0``. In this case each line will be treated as an item by itself
and the bullet will be set accordingly. Following is anther way to show
unordered list with three items where each item starts with a text bullet.

    ~~~list{type:UL}
    Item 1
    Item 2
    Item 3
    ~~~