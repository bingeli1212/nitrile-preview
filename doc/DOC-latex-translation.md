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





