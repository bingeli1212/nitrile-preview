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

However, it is also possible to import sub-documents which would each become
an entire chapter.

    ---
    title: My Document
    ---
    %^import [part]"Introduction"  
    %^import [chapter](./lesson1.md)
    %^import [chapter](./lesson2.md)
    %^import [part]"Introduction"
    %^import [chapter](./lesson3.md)
    %^import [chapter](./lesson4.md)





