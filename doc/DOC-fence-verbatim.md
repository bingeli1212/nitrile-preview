---
title: The verbatim fence
---

The verbatim fence is done by placing
triple-backquotes before and after
the block. 

    ```
    This is the verbatim
    text that preserves line breaks,
    multiple white-spaces, and will by default
    show text as fixed-width font.
    ```

For LATEX generation it would prefer to use a 
table that would be able to split across multiple
pages, but so far it is not possible to have it. 
While since it is a fence, it makes sence to 
have it all in one paragraph, thus a "tabular" 
environment is used.

If a verbatim-like block is needed to have text longer 
than one page, consider using the SAMP block.

