---
title: The "parbox" BODY paragraph
---

# The "parbox" BODY paragraph

The "parbox" BODY paragraph is to represent an isolated paragraph that 
might have its own font size, font style, and alignment requirements.
For instance, following is a "parbox" paragraph that is right-flushed,
and with a font size that is smaller, and shown as italic for the entire
paragraph.

    ```parbox{fontsize:small,fontstyle:italic,align:r}
    Hello world! Hello world! Hello world!
    Hello world! Hello world! Hello world!
    ```

By default all lines in a "parbox" is to form a single paragraph, where
each source line inside a bundle is not recognized as express the start of
a new line.
However, a "parbox" is designed to recognize the double-backslashes at the 
end of each line to mean to insert a manual line break, as is evidence
in the following example.

    ```parbox
    \(a + b = c\) \\
    \(a + b = c\) \\
    \(a + b = c\) \\
    \(a + b = c\)
    ```


# Translations

The HTML translation is for all bundles to become a table-element, the LATEX translation
is for all bundles to be a "tabular", and a CONTEX translation is for all bundles to be
a "\framed". 

