---
title: Fences
---

Fences are used to typeset some inline-block elements, such
as images, frames, etc. Following are recognized fences.

- math
- img
- link
- ref
- diagram
- animation
- framed
- tabular
- minipage

# The math-fence

The math-fence allows showing of multiline math equation
or expression that expands multiple lines

   ```math
   ```


# The link-fence

The link fence is used to typeset a link.

    &link([Yahoo!]http://www.yahoo.com) 


# The img-fence

The img-fence is used to typeset an image.

    &img([width:3cm]./tree.png)

# The ref-fence

The ref-fence is used to typeset an reference to another part of the
same document. 

    &ref(#mytable)

# The diagram-fence

The diagram-fence is used to typeset a diagram that
is stored as a "note" or as in an external file.

    &diagram([width:3cm]./myfile.txt)
    &diagram([width:3cm]#mydia1)

The inline-diagram is presented as follows.

    ```diagram[width:3cm]
    ```

# The animation-fence

The animation-fence is used to typeset one or more diagrams
each one showing a frame in an animation. 

    ```animation[width:3cm]
    ```

# The framed-fence

The framed-fence is to typeset a block of text as a frame, where
text will be shown as fixed-width fonts. 

    ```framed
    ```

# The tabular-fence

The tabular-fence is used to typset a tabular.

    ```tabular
    ```

# The minipage-fence

The minipage-fence is used to typeset a minipage that is to hold a
paragraph of text.

    ```minipage
    ```



