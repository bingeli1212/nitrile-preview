---
title: Phrases
---

# What are the phrases?

A phrases refers to a specific construct that
describes an object. Following is a list of 
object that can be expressed by a phrase -

~~~
- The img phrase
- The ref phrase
- The frac phrase
- The sup phrase
- The sub phrase
- The em phrase
~~~

[ The img phrase ]

The "img" phrase is designed to allow for showing an external
image with surrounding texts. It can also be used to create a 
vector graphic using Diagram-syntax. 

If an external image is to be expressed, then the filename 
for this image is to be described by the phrase such as
``&img{"./tree.png"}``.  The image file must placed placed
inside a pair of quotation marks, and the file should
start with a dot or dot-dot to make it clear that is 
is file name in the current directory of the directory
of the parent. 

If a vector graphic is to be created, then the language 
should be placed in a note block titled "pic", and the name
should be the first line of this block. Assuming that
the block is named "mygraph", the syntax for describing
this vector graphic is ``&img{"#mygraph"}``. 

By default, the image will be shown to occupy the maximum
width of the current line. However, additional
arguments can be passed to express the width, or set it
so that it has a frame around it.
For instance, if the image is to be
typeset at 90% of the current paragraph width, then
it should've been specified as ``&img{"./tree.png",width:90%}``.
The "width:90%" expresses that it is 90 percent of the line width.
Instead of specifying the width in terms of the percentage of the 
current line, it also recognize the absolute dimensions, such
as "pt", "mm", "cm", "in", etc.

The "frame:1" can be specified to express that the image should
come with a framed border. For instance,
``&img{"./tree.png",width:90%,frame:1}``.

