---
title: LATEX Translation
---


# The begin-description envelop

The LATEX begin-description envelop is designed to typeset a list of 
key/value pairs, where each key is flushed against the left margin
and each value is indented by a fixed space. 

Each key is placed inside a \item, such as

    \item[apple] Good apple

Where "apple" is the key and "Good apple" is the description.
It is possible to replace a text with a \parbox such as

    \item[\parbox{\linewidth}{apple\\pear\\banana}] Good apple

Such that the key is comprised of three separate entries and each
entry occupies a line by itself. However this arrangement
has been observed to have caused the description text such as "Good apple"
to sometimes appear to the right hand side of the key, rather than 
at the bottom. The fix is the add a \hfill immediately after
the closing brackets of the key. Following is the fix.

    \item[\parbox{\linewidth}{apple\\pear\\banana}]\hfill Good apple



# Add "chapters" and "parts"

Typically a single MD document would have only produced "sections",
"subsections", and "subsubsections", where a single number-sign would produc a
section, a double number-sign a subsection, and a triple number-sign a
subsubsection. 

It is also possible to manually inject a "chapter" or "part" to a 
TEX document. This is done by using the at-sign section.

    @part Introduction

    @chapter Lesson One
    &label{lessionone}

    ...

    @chapter Lesson Two
    &label{lessiontwo}

    @part Advanced

    @chapter Lesson Three
    &label{lessionthree}

    ...

    @chapter Lesson Four
    &label{lessionfour}

The introduction of "@part" would have inserted a new HDGS block into the list
of blocks where its "name" attribute is set to "part", and the "partnum"
corresponding to the number of total parts including this one, such that the
first part being 1.

The appearance of a "@chapter" will also reset the internal counters for 
sections, subsections and subsubsections, such that the next appearance of
the section will be considered the first section. This means that the "level" 
attribute of the block will be re-numbered.


# Importing sub-documents

It is also possible to import sub-documents such as the following example
shows.

    ---
    title: My Document
    ---
    %^import [part]"Introduction"  
    %^import [chapter](./lesson1.md)
    %^import [chapter](./lesson2.md)
    %^import [part]"Introduction"
    %^import [chapter](./lesson3.md)
    %^import [chapter](./lesson4.md)


# The "level" attribute of the block

The "level" attribute of the block is constructed by the parser, that is assigned
to each HDGS block such that it reflects the current hierarchies of the sections 
within the chapter. For instance, the first chapter will have its "level" attribute
set to "1". The first subsection of that section is "1.1". The first subsubsection
of the first subsection of the first section is "1.1.1", etc.


# The proble of "drawslopedtext"

Currently there are some issues when using "drawslopedtext", which is implemented
in LATEX using TikZ. The position of the text is expressed using "above" as part
of the option. However, this has been observed to have caused some problems when the 
drawing of the lines goes from right to left, where the "above" should have translated
into the text appearing below the line, but was not observed as so. Instead, the text
appears at the top of the line.






