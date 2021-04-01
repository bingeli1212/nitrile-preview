---
title: Phrases
---

Each phrase is to appear in the form of a ampersand, followed by a
word, and then immediately with space a set of parenthesis with
text in it. Following are defined phrases.

- ``&img{#myimg}``
- ``&ref{mytable}``
- ``&link{http://www.yahoo.com}``

Following is an example

    Please visit link of &link{http://www.yahoo.com} for more information.



# The 'img' phrase

The 'img' phrase is used to insert an image. The content of this phrase 
must be a string that starts with a hashmark, the word following which should
reference a valid storage of a previously saved fenced block.

    ```img{save:myimg,hidden}
    image-gimp.png
    ```

    &img{#myimg}

Typically the content of an image can be typeset using the fenced-bundle directly.
However, in some situations, such as inside a figure, it might be mandatory that
a phrase be used to reference an image or table.



# The 'tabular' phrase

The 'tabular' phrase is used to insert tabular. The content of this 
phrase must be a string that starts with a hashmark which references
an existing saved tabular content.

    ```tabular{save:mytabular,hidden}
    ...
    ```

    &tabular{#mytabular}



# The 'ref' phrase

The 'ref' phrase is designed to insert a reference to another part of
the same document, which has been previous set by a label-style. For
instance, if a figure which has been provided a label was placed
somewhere in the document, then the 'ref' phrase would have been
turned into a something that would point to this figure.

    @ figure{label:fig1}
      ...
      ...

    Please see figure &ref{fig1} for more information.

Note that the exact appearance of the text in the generated document
could vary depending on the translation type. For LATEX and CONTEX the
result is usually an integer number or others that agrees with the
figure or table number that has been assigned to the figure or table.


# The 'link' phrase

This phrase is designed to typeset a link or URI such that the content
could be shown in a different font or style. The content of a link or
URI are typically long and contains no internal spaces, which requires
some special treatment.

In LATEX there is a command called ``\url{...}`` that allows a long
URI string to be placed inside, in which case LATEX would have shown
the text with a fixed-width font, and wrap the text anywhere it deems
appropriate, without having to concern itself with the white spaces
within it.

CONTEX offers a command called ``hyphenatedurl{...}`` that does the
similar job of typesetting a potentially long URI text.


# All Math Phrases  

These phrases are designed to treat all contents inside it as part of a math
expression.  The math expression differs from normal text expression in that
all single letter symbols are considered variables. There are also operators
such as plus-sign, minus-sign, and others that requires extra spacing around
it. 

Following is a list of other phrases that assumes the content of a math expression.

+ ``&math{...}``

  This phrase is typeset a generic math expression. Valid operations 
  are following math commands:

  ```verbatim
  &math{\log = a + b}
  ```

+ ``&dfrac{...}{...}``

  This phrase is to typeset a fraction expression.

+ ``&frac{...}{...}``

  This phrase is to typeset a fraction expression such that the numerators
  and denominators are each scaled down, resulting in a smaller appearance. 

+ ``&dbinom{...}{...}``

  This phrase is to typeset a binomial expression, which is similar to a
  fraction except that it does not have a middle dividing line.

+ ``&binom{...}{...}``

  This phrase is to typeset a binomial expression, except that the entire
  expression is scaled down.

+ ``&sqrt{...}``

  This phrase is to typeset a sqrt.

+ ``&root{...}{...}``

  This phrase is to typeset a root with a degree that is not 2.
  The degree is to be given as the second argument.

+ ``&overline{...}``

  This phrase is to typeset a set of variables decorated with an overline at
  the top.

+ ``&overleftrightarrow{...}``

  This phrase is to typeset a set of variables decorated with an left-right
  arrow decorated at the top.

+ ``&overrightarrow{...}``

  This phrase is to typeset a set of variables decorated with an right pointing
  arrow decorated at the top.

+ ``&underleftrightarrow{...}``

  This phrase is to typeset a set of variable(s) decorated with a left-right-pointing
  arrow placed underneath the variable(s).

+ ``&underrightarrow{...}``

  This phrase is to typeset a set of variable(s) decorated with a right-pointing
  arrow placed underneath the variable(s).

+ ``&subsup{...}{...}{...}``
+ ``&sub{...}{...}``
+ ``&sup{...}{...}``

  This phrase would have setup a subscription, a superscription and/or both.
  Note that the first argument is always the base content.

  ```verbatim
  &subsup{x}{i}{2}
  &sub{x}{i}
  &sup{x}{2}
  ```

+ ``&sum{...}{...}{...}``

  This phrase would have setup a Summation symbol with a subscript and a
  superscript, and the contents that is the third argument.

  ```verbatim
  &sum{x=0}{&infty;}{x^2}
  ```

+ ``&int{...}{...}{...}``

  This phrase would have setup a Integral symbol with a subscript and a
  superscript, and the contents that is the third argument.

  ```verbatim
  &int{0}{&infty;}{x^2}
  ```

Additional phrases might be added in the future. For each of the
phrases above, the translation output would each have to do their best
so that the output conforms to the requirements of the target
translation.

For instance, for LATEX output the ``\ensuremath{...}`` command has to
be placed inside it, and for CONTEX translation the ``\math{...}``
command is mandatory. 

Besides standard operations such as plus-sign and minus-sign, some
special operators such as ``&times;`` can be used inside the math
expression to ensure the appearance of this symbol. However, support
for symbols could be different for different translate output. LATEX
typically has a larger set of symbols to choose from, and CONTEX only
supports some symbols that came from TEX, plus some additional UNICODE
symbols for as long as it is available as part of the current font.





