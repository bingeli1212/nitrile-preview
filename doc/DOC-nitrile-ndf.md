---
title: NDF
---

# NDF

NITRILE DOCUMENT FORMAT, or NDF, is a literal language based on Markdown
language. It is backward compatible to MD; all NDF files are also valid MD
files; however, NDF file uses markups that does not existing in MD, and
deprecate some markups known to have been used by some existing Markdown viewer.
The document saved as NDF uses the MD file extension. STRUCTURE

NDF treats each paragraph as an independent block. A paragraph is defined as a
cluster of lines separated by one or more blank lines by neighboring clusters.
Each paragraph is to be categorized into one of the following four different
types:

- HDGS
- CAPT
- PRIM
- BODY

The HDGS paragraph types is those that is to start with one or more number-sign
characters. The CAPT is a paragraph that starts with a period, followed by a
single word immediately without blank. The PRIM paragraph is a paragraph such
that its first line starts with a part of the text that is enclosed by a set of
square brackets. All other paragraphs are recognized as PARA. Following is an
example of four different paragraphs.

    # Frog

    ## Background

    A frog is any member of a diverse and largely carnivorous 
    group of short-bodied, tailless amphibians composing the 
    order Anura (literally without tail in Ancient Greek).

    ## Etymology and taxonomy

    The use of the common names frog and toad has no taxonomic 
    justification. From a classification perspective, 
    all members of the order Anura are frogs, but only 
    members of the family Bufonidae are considered 
    "true toads". 

    [ Etymology. ] 
    The origins of the word frog are uncertain and 
    debated.[8] The word is first attested in Old 
    English as frogga, but the usual Old English 
    word for the frog was frosc (with variants 
    such as frox and forsc).

    [ Taxonomy. ] 
    About 88% of amphibian species are classified
    in the order Anura. These include over 
    7,100 species in 55 families, of which the 
    Craugastoridae (850 spp.), Hylidae (724 spp.),
    Microhylidae (688 spp.), and Bufonidae (621 spp.)
    are the richest in species.

In the previous example there are seven total paragraphs. The first, second, and
fourth paragraphs are HDGS paragraphs, the third and fifty paragraphs are PARA
paragraphs, the sixth and seventh paragraphs are PRIM paragraphs.

# THE HDGS PARAGRAPH

The HDGS paragraph is designed to typeset a sectioning heading. Typically the
paragraphs that start with single-number-sign would go on to become a section;
this section could become a section in a single article, or a section of a
chapter in a multi-chapter book. Conversely, a paragraph starting with
double-number-sign would become a subsection of a previous opened section, and
so on.

# THE CAPT PARAGRAPH

A CAPT paragraph is designed to become a figure, listing, long table, equation,
a multi-column paragraph, etc.

# THE PRIM PARAGRAPH

A PRIM paragraph is designed to become a paragraph that starts a sectioning
without a section numbering attached to it. Its target translation could be one
of many different possibilities. For instance, it could become a "\paragraph"
paragraph for a LATEX translation.

# THE BODY PARAGRAPH

A BODY paragraph could be interpreted differently depending on its contents.
For instance, if it its first
line and last line starts with triple backquote then it is to be treated
as verbatim text.

    ```
    #include <stdio.h>
    int main() {
      printf("hello world\n");
      return 0;
    }
    ```

The appearance of a triple-backquote as the first part of its first line 
and the last line is to present this paragraph as a "bundle". By default, a bundle
is verbatim-bundle, like the example shown above, but it could become another 
type of bundle if the first triple-backquote is to be followed by a keyword.
For instance, following is a parbox-bundle.

    ```parbox
    The origins and evolutionary relationships between 
    the three main groups of amphibians are 
    hotly debated. 
    ```

Following are all bundles that are currently supported.

- dia
- ink
- formula
- tabular
- parbox
- verbatim

In addition, if the first line of the paragraph starts with a hyphen-minus
followed by at least one space, or a number followed by a right parenthesis and
then a space, or an asterisk followed by a space, or a plus-sign followed by a
space, then this entire paragraph is treated as "plst". This type of paragraph
is suitable for creating a list with unlimited items, where each item can also
have an inner list that includes additional items for itself. In particular, the
hyphen-minus would signal a list that is unordered, or UL, an asterisk would
signal a list that is ordered, or OL, a plus-sign would signal a description
list, or DL, and a number followed by a parenthesis is to become a list with a
single item that is by itself, and which that single item is to have a bullet
that is that number.

    - Beverages
      - Coffee
      - Tea
      - Milk
    - Solid food
      - Sandwich
      - Fries
      - Yogurt
    - Fruits     
      - Apple    
        - Red delicious
        - Gala green   
      - Pear  
        - Asian sweet  
        - Desert green   
      - Banana

If the first line of the paragraph is to start with a greater-than character,
followed by a space, then this paragraph is to become a "cove" paragraph. This
paragraph would place a right-pointing triangle in front of the first line of
that paragraph, and the entire paragraph is shifted to the right including the
right-pointing triangle with visible amount of left margin spaces. The exact
details of this paragraph varies depending on whether a bundle is to follow it.

If a bundle is followed by it, then all lines of the bundle must be proceeded
by the same number of white space. For instance, in the following example 
all lines of the two bundles must starts with two spaces except for the first
line of each bundle. 

    > ```formula
      a + b = c      
      ```

    > ```
      #include<stdio>
      int main(){
        return 0;
      }
      ```

However, if a bundle is not to follow it then all lines after the first line must
also start with the same number of white spaces. In this case each line is to start
as a new line; and it is possible for a long to be wrapped when it appears at the
target translation.

    > 優しい日本語は優しいです
      Beautifully spoken Japanese language is beautiful.
      
If the first line of the paragraph is to start with a dollar-sign character,
followed by a space, then this paragraph is to become a "cave" paragraph. A
"cave" paragraph is to center its contents. If a bundle is to appear after 
the dollar sign, the bundle will be centered. Otherwise, each line 
of the source block will be centered on its own; and it is possible for one
of the lines to appear wrapped when it appears in the target translation.

    $ ```formula
      a + b = c      
      ```

    $ ```
      #include<stdio>
      int main(){
        return 0;
      }
      ```

    $ 優しい日本語は優しいです
      Beautifully spoken Japanese language is beautiful.

If the first line of the paragraph is indented four spaces to the right, then
the entire paragraph will be treated as a "samp" paragraph. In this case, all lines
will be shown in fixed-width fonts, and line breaks and space between characters will
be preserved. 

If the paragraph does not fit one of the descriptions aboove, it is 
treated as a "body" paragraph, which is normal paragraph.


# The CAPT blocks

The CAPT blocks are for setting up a figure with figure number, a longtabu with
table number, an equation with equation numbering, a listing with lisiting
numbering, and multi-column without any numbering, etc. The style names that can be
applied to them are the following:

- wrap - for expressing if sub-figures are to be wrapped
- partition - for expressing the maximum subfigure are to be placed inside a single figure row

Currently by default the figure captions and subtitles are to be shown by a font size that
is smaller than normal. The exact number of reduced font size is implementation specific.

Note that the previous styles are only effecting layouts of the CAPT, and they
are not to be utilized in anyway by a bundle. On the other hand, all style
options to be utilized by a bundle are never to be one of those used for layout
a CAPT block, including 'fontsize', 'fontfamily', 'fontstyle', 'fontcolor',
'linesize', etc.



