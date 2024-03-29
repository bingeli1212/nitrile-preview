---
title: NITRILE Translation
---


# Heading sectionsss

The number headings are detected by the presence of hash-marks 
at the first of the line of a paragraph.

    # Introduction
    ## Introduction
    ### Introduction

Only the previous three different kind of sections are supported.
When being translated, each of them corresponds to a section, subsection,
or subsubsection.


# Bundles

Bundles are those paragraphs fenced by triple backquotes. Each bundle
is to come with a ID that identifies this bundle. Following
are supported bundles.

- "fml"
- "img"
- "tab"
- "par"

Each bundle is designed to represent something that is to be considered 
as a single character. For instance, an image, a table, a text box etc.

[ The "fml" bundle. ]
This bundle is to typeset a multiline formula, with possibly 
alignment at the place of an equal-sign or other places.
Note that it is not required that the formula be center-aligned.
Current HTML/LATEX/CONTEX have been implemented such that it is
left-aligned.

[ The "img" bundle. ]
This bundle is to model a vector image such as SVG, Tikz, and or MetaFun,
or a raster image such as IMG element in HTML, and/or `\includegraphics` command
in LATEX and `\externalfigure` command in CONTEXT.

    ```dia{viewport:10 10,width:30}
    \drawline (0,0) (10,10)
    \drawline (0,10) (10,0)
    ```

The "viewport" attribute sets up the viewport size for the image.  For Vector
image type this sets the canvas, equivalent to the view box of the SVG, and/or
the native size of the TikZ and MetaFun. 

The "width" and "height" attribute sets the final image size, which is
equivalent to the "width" and "height" attribute of a SVG element, and the
`\resize` command for the LATEX and `\scale` command of the CONTEXT. 

The "frame" attribute allows it to have a border, which is added on top of the
raster image or vector image after it has been constructed, and whose line
width should not be affected by the scaling of the image by the
"width"/"height" attributes.

Typically if an "\image" command within the bundle is detected it is a raster
image that holds the external image. Otherwise it is a vector image that is
built in accordance of the commands found within the bundle. 

However, if the "type" attribute is set to "ink", then the result is a vector
image showing raw text inside this vector image verbatim. This can be comparied
to a \begin\end\verbatim environment of a LATEX document.

    ```img{type:ink,viewport:10 10 5,width:30}
    #include<stdio>
    int main(){
      return 0;
    }
    ```

Note that the "viewport" attribute is still used to set the native size
of the vector image and "width"/"height" the final size of the image
when shown. 

For HTML translation, the "type:canvas" and "type:ball" can also be used 
to present a Canvas object or an interactive SVG that response to mouse
events.

[ The "tab" bundle. ]
This bundle is to typeset a tabular. 

    ```tab{head}
    & Name \\ Addr.
    & John \\ 301 Sun Dr.
    & James \\ 401 Sun Dr.
    & Jane \\ 501 Sun Dr.
    & Mary \\ 601 Sun Dr.
    & Martin \\ 701 Sun Dr.
    ```

If the double-backslash is to appear in the line, it is used 
as the tabular data separator. Otherwise, data are to be
recognized by the presence of triple-or-more-spaces.

    ```tab{head}
    & Name      Addr.
    & John      301 Sun Dr.
    & James     401 Sun Dr.
    & Jane      501 Sun Dr.
    & Mary      601 Sun Dr.
    & Martin    701 Sun Dr.
    ```
    
The "head" attribute above expresses that the first row is header,
which will likely be set to bold and treated differently than other
rows in many other situations. Another similar attribute is "side",
which states that the first column is to be treated as containing
the header information for that row. 

Having a "head" attribute can make a difference in the presence of a "hew"
attribute. The "hew" attribute is designed to split a long table into two or more
parallel sections so that the table will become shorter and fatter.

    ```tab{head,hew:2}
    & Name \\ Addr.
    & John \\ 301 Sun Dr.
    & James \\ 401 Sun Dr.
    & Jane \\ 501 Sun Dr.
    & Mary \\ 601 Sun Dr.
    & Martin \\ 701 Sun Dr.
    ```

In the previous example the first three lines will be placed at the left-hand
side and the last two lines at the right-hand side, while the header is to
appear on top of both: the resulting tabular looks like it has four columns
and four rows.

There are also additional attributes: for instance, the "frame" attribute is
used to set if the tabular is to have a border placed around it. When set to
"1" or "box", the border is to be had on all four side, whilst if set to
"hsides" then only the top/bottom sides are to have the border. 

The "rules" attribute determines if vertical/horizontal rules are to appear
between rows/columns.  When set to "all", all rules are to appear between
rows/columns.  If set to "rows", only the rules between rows are to appear. If
set to "cols", only rules between columns are to appear. If set to "groups",
only the rules betweem the header and the first line of body row is to appear,
given the fact that the "head" attribute is set, or the vertical rules between
the first column and the second column is to appear if the "side" attribute is
set, or both if both attributes are set.

The "template" is to be expected a list of alignment options, such as "l r c",
which states that the first/third column is to be left, right, center aligned.
It can also be followed a number that expreses the relative width of this column,
such as "l25", "r30", etc.

Note that the "tab" bundle is designed such that it's width is a fraction
of the entire page. It is not possible to set it to an absolute width
such as 100mm like that of an "img" bundle. All numbers presented in a template
are used to express the relative width of this column with respect to the entire
tabulation. If a column is not presented with
a number such as the case of "pp20", the first column is assumed
to be a width of "10", in which case the first column is going to be
half the width of the second.

It is possible to set the entire tabulation to a width less than 
that of the page width by setting the "stretch" option. This is
a floating point number between 0 and 1.
By default it is assumed to be 1. However, it can be set to
a number less than 1 to express a fraction of the page width, such as "0.5" for
half the page width. Setting it to 0 could cause an undesirable effect.

The "fontsize" is to be set to a string expressing the size of the font.
Currently only the value "small" is accepted, and all other value will be
ignored. In the case of "small", all texts will be shown by a "smaller" version
of the body font.

The "fontstyle" is to be expected a list each of which expressing a font style
for the corresponding column. For instance, "fontstyle:t t r" is to set it so
that the first two columns are to be set in the style of monospaced text, and
last one the roman(default) text. The letters are: t(monospaced), i(italic),
b(bold), s(slanted), and r(default) fonts.

The "vrules" and "hrules" attributes are designed to manually insert
vertical/horizontal rules between rows and columns. Note these two attribuets
are only to take affect when the "rules" attribute is not set, otherwise they
will be ignored. Each of these two attributes is to be expected a list of
integers, where an integer of "1" expressing the appearance of a
vertical/horizontal rule between the first and second column/row, and "2" for
the rule between the second/third column/row. Thus, "vrules:2 4" is to insert a
vertical rule between second/third columns, and another one between the
fourth/fifth columns.

It is possible to add additional tabular data to the last row by simply
not starting the line with '& '.

    ```tab{head}
    & Name 
      Addr.
    & John 
      301 Sun Dr.
    & James 
      401 Sun Dr.
    & Jane 
      501 Sun Dr.
    & Mary 
      601 Sun Dr.
    & Martin 
      701 Sun Dr.
    ```

The ": " lines are designed to build tabulation column-by-column.  In
particular, each ": " line starts a new column, and each "  " line following
the ": " adds an additional row at the end of that column. Note that the total
number of columns to be inserted cannot exceed that specified by "template". In
addition, new rows are only inserted when building up the first column; each
additional column only serves to fill out the blanks left inside each row
created by the first column.

    ```tab{head}
    & Name \\ Addr.
    : James
      Jane
      Mary
      Martin
    : 401 Sun Dr.
      501 Sun Dr.
      601 Sun Dr.
      701 Sun Dr.
    ```

The "^ " lines are similar to ": " except that what's after it is treated
as an arithmetic expression that is to be evaluted as is, and the result
of which be used to fill the content of that column.

    ```tab{head}
    & a \\ pow(a,2)
    : 1    
      2   
      3    
    ^ pow($1,2)  
      pow($1,2)  
      pow($1,2)  
    ```

For "^ " columns, the formatter can be placed before the expression 
to force the result to be re-formatted to fit certain forms.           

    ```tab{head}
    & a \\ pow(a,2)
    : 1    
      2   
      3    
    ^ {%.5f} pow($1,2)  
      {%.5f} pow($1,2)  
      {%.5f} pow($1,2)      
    ```

With the expression, the '$1' variable expresses the content of the first column. 
Similarly, '$2' expresses the content of the second column. Note that since each column
is built in the order from left to right, the content of the current column and the column
after it are not available. In addition, variable 'n' expresses the row number, where
the first row is at 0, regardless if it is a header row or not.

[ The "par" bundle. ]
This bundle is designed to typeset a text box.   
It allows for the possibility such that this paragraph
is able to have its own text alignment, font size, and font style.
The text box is always set as wide as the paragraph.

    ```par
    Hello world!\\
    Hello universe!\\
    Hello people!
    ```

The end-of-line-double-backslash is used to manually break the line
into multiple-lines.




# Save/Restore 

The two options of the bundle known as save/restore are recognized by NITRILE
to be special. They are to express the fact that the content of the bundle is to be
saved to an external buffer and/or restored from it. In particular, the "save" 
option expresses the fact that the content of the bundle is to be saved to 
a buffer, and the "restore" implies that part of the content is to come from
a previous saved buffer.

    ```img{save,viewport:12 7}
    \draw (0,0)--(10,10)
    ```
    ```img{restore,viewport:14,8}
    ```

In the previous example the first bundle is to express the fact that the content
is to be saved to an annonymous buffer, and the second one restored from that anonymous buffer,
such that the second "img" bundle is to have the same "\draw" command as that of the first "img".

Note that typically all bundles are to be processed in the order in which it appears in the 
source MD file, and thus it is guarenteed that the later buffer will be given the opportunity
to load from a buffer that has already been saved by a bundle that is processed before it if
it were to save it. 

Typically the bundle is saved anonymously, and by the time it is restored 
the same anonymous buffer is accessed. However, the anonymous buffer can become a named buffer
if the "id" option were to be present with the bundle. In this case the buffer is no longer anonymous,
but rather named. The name assigned to the buffer is that of the "id" option.  In order to 
restore from this buffer, the other bundle is also to have provided the same ID.
In the following example there are two named buffers, and each one is then accessed by one of the
follow-on two buffers.

    ```img{save,viewport:12 7,id:a}
    \draw (0,0)--(10,10)
    ```
    ```img{save,viewport:12 7,id:b}
    \draw (0,0)--(20,20)
    ```
    ```img{restore,viewport:14,8,id:a}
    ```
    ```img{restore,viewport:14,8,id:b}
    ```


# Copy/Paste

For "img" buffer it is also possible to paste from multiple named buffers at different location.
The paste point is recognized as "%?a" which asks to paste the content from buffer "a" and insert 
it into that location. In the following the third image would have getton the two "\draw" commands
from each one of the previous two named buffers.

    ```img{save,viewport:12 7,id:a}
    \draw (0,0)--(10,10)
    ```
    ```img{save,viewport:12 7,id:b}
    \draw (0,0)--(20,20)
    ```
    ```img
    %?a
    %?b
    ```




# Blocks     

Following are all blocks recognized by NITRILE.

- "alignment"
- "itemize"
- "description"
- "example"
- "preformatted"
- "details"
- "primary"
- "secondary"
- "lines"
- "tabbing"
- "body"
- "figure"
- "table"
- "listing"
- "equation"
- "multicol"
- "page"
- "vspace"
- "blockquote"
- "vocabulary"



[ The "itemize" block. ]
The PLST un-fenced block is recognized by the presence of a hyphen/plus/asterisk
character at the start of the first line. This block models
lists and nested lists. Hyphens are for expresssing unordered list items.

    - Fruits
      - Apple
      - Pear
    - Dairy
      - Cheese
      - Milk
    - Bread
    - Nuts 

The asterisks are for numbered description list where 
the terms are the content after the asterisk and description
text the subsequent lines. 

    * First step
      Prepare a paper. 
    * Next step  
      Prepare a pencil.
    * Final step  
      ...


[ The "description" block. ]
The plus-signs are for expressing description list items, such
that everything after the plus-sign is the data term, and the 
lines that follow(s) are descriptions.

    + Apple
      A wonderful fruit.
    + Pear
      Another wonderful fruit.

Typically the terms will be scanned for any appearances of formatting
markups; this allows for items such as math expression to appear
as data terms.

    + ``\vec{x}``   
      A vector denoted by variable \(x\)
    + ``\sqrt(x)``  
      The square root of variable \(x\)

In the situation where the data terms should be interpreted literally,
 then a colon should be used.

    : ``\vec{x}``   
      A vector denoted by variable \(x\)
    : ``\sqrt(x)``  
      The square root of variable \(x\)

[ The "example" block. ] 
This block is recognized by the presence of less-than-sign followed by at least
one space at the first line. All lines with the similar pattern will be considered
to start a new line, and others are the continuation of the previous line.
The output is so that all lines are left aligned with a visible left margin.

    > Hello!          
    > Good morning!       
    > Good evening!       

It is also recognized when the first line is recognized to have started with 
two spaces.

[ The "preformatted" block. ]
This block is recognized when the first line is to start with four spaces.  The
output of this block is always a text with monospace typeface font and
non-collapsed line breaks and intercharacter spaces.  In addition, a "preformatted"
block can also be designated by the leading '~' followed by a space at each
line of the block.

    ~ #include<stdio>          
    ~ int main(int argc, char** argv){
    ~   printf("Hello world!\n");
    ~   return 0;
    ~ }     

[ The "details" block. ]
This block is recognized if the first line is to start with a number followed
immediately by a right parenthesis.  This block is assumed to represent a
single ordered list item where the number represents the bullet. In addition,
this block is assumed to have child paragraphs where each child paragraph
is a paragraph of this item, such that there will be visible vertical spaces
inserted between them. The child paragraphs are detected whenever a double-backslash
is detected in a line by itself.   In the following example there are
two child paragraphs for the "Step 1", and no child paragraphs for "Step 2".        

    1) Step 1, check the temparature:
    \\
    If the temperature is greater than 10, add this ingredient.
    \\
    Otherwise, add this ingredient.

    2) Step 2, bring it to a boil, and taste it see if additional 
    salt is needed.      

Note that all child paragraphs are treated as normal paragraphs with
no particular layout assumptions. Following forms are recognized
within child paragraphs of a "details" block.

    1) Following is a code snippet:   
    \\
    ~ #include<stdio>
    ~ main(){
    ~   printf("Hello World!\n");
    ~   return 0;
    ~ }

    2) Following are examples of polynomials:
    \\
    > \(x^2 + x + 1\) 
    > \(x^3 + x + 1\) 
    > \(x^4 + x^2 + 1\) 

    3) Following are things to be done in this order:
    \\
    * get out of bed  
    * brush teeth      
    * eat breakfast      

    4) Following are items to bring to camping:
    \\
    - apple           
    - chair            
    - tent               

    5) Following is a verse found on internet:  
    \\
    | I wish I could remember that first day,
    | First hour, first moment of your meeting me,
    | If bright or dim the season, it might be
    | Summer or Winter for aught I can say;
    | So unrecorded did it slip away,
    | So blind was I to see and to foresee,
    | So dull to mark the budding of my tree
    | That would not blossom yet for many a May.

    6) Following are pictures taken during the trip:
    \\
    ```img            
    \image "pic1.png"  
    ```
    ```img            
    \image "pic2.png"    
    ```

Besides the numbers, following symbols are also allowed: "asterisk",
"hyphen-minus", and "plus-sign". The "asterisk" symbol would generate
an ordered list such that the number is to start from 1 and continue
up. It allows for items to be tracked without having to number them
manually. The "hyphen-minus" allows for generating unordered list items.
The "plus-sign" allows for generating a description list item such
that the text after the "plus-sign" is the data term (DT) and the
second line and after becomes the data description text (DD).

[ The "primary" block. ]
This block is recognized by the presence of a matching pair of square brackets
at the first line.

[ The "secondary" block. ]
This block is recognized by the presence of two matching pair of square brackets
at the first line.

[ The "lines" block. ] This block is recognized by the presence of vertical-bar
and a follow-on space at the start of the first line. Each additional line will
be scanned for this pattern, and will start a new line if detected; otherwise it
is the continuation of the previous line. If there are additional leading spaces
following the vertical-bar and the space immediately after it, these spaces are
preserved. Spaces between characters are collapsed.

    | All human are mortal.
    | Socrates is a human.
    | Socrates is mortal.

In addition, if the first character is a dollar-sign followed by at least
one space at the first line. Each additional line will be checked for the
presence of the same pattern, and if detected is to start a new line, otherwise
it is the continuation of the previous line. 
The output is so that all lines are center aligned.

    $ Hello!          
    $ Good morning!       
    $ Good evening!       

In addition, if the first character is a exclamation-sign followed by at least
one space at the first line. Each additional line will be checked for the
presence of the same pattern, and if detected is to start a new line, otherwise
it is the continuation of the previous line. 
The output is so that all lines are center aligned.

    ! Hello!          
    ! Good morning!       
    ! Good evening!       

[ The "tabbing" block. ] This block is recognized by the presence of the "less-than"
sign followed by a single space. Each "left-than" symbol is considered to have
started a new column, and the total number of columns are determined by the total
number of "less-than" symbol detected.
The contents after the "less-than" symbol is the content of the first row of that column,
and each addition line of that column the content of the next row of that column.
The total number of rows are determined by the maximum lines of each column.        

    < 1         
      2         
      3         
      4         
      5         
    < 0.100       
      2.706       
      4.605       
      6.251       
      7.780       
      9.240       
    <  0.050       
       3.841       
       5.991       
       7.815       
       9.490                              
      11.070                              

Note that each column is always arranged such that all columns are spread
evenly across the entire width of the page, unless additional less-than
signs are used. In the following example the second column is twice the 
width as the first one.

    < 1
      2
      3
    << 10
       20
       30

For "tabbing" block, it can also fetch neighboring cells and performing
computations if the content of the column starts with an ampersand and the rest
of the cell are surrounded by a pair of curly braces.  The content must be a
valid arithmetic expression.  A semicolon can be added which is to be followed
by a formatting group for reformatting the output into a text.

    < 1
      2
      3
    < 10
      20
      30
    < &{$a+$b;%.3f}
      &{$a+$b;%.3f}
      &{$a+$b;%.3f}

In the previous example the third column is to be filled by the text
that is the result of a math expression computation, followed by a
formatted text output based on the formatting group notation.
The "$a" refers to the first column, and "$b" the second column. 

    1   10   11.000
    2   20   22.000
    3   30   33.000

It is also possible to refer to a contents of specific rows. To do
that following the letter 'a' or 'b' in the previous example by an integer,
such that '1' represents the first row, and '2' the second row. Thus, following
is the equivalent of the previous example.

    < 1
      2
      3
    < 10
      20
      30
    < &{$a1+$b1;%.3f}
      &{$a2+$b2;%.3f}
      &{$a3+$b3;%.3f}

It is also possible to use '~' in place of the integer row number
to refer to the row that is immediately above the current row.
In the following example the second row is the result of computing
the difference of number in the first column against the number 
above it.

    < 1
      2
      3
    < &{$a-$a~;%.3f}
      &{$a-$a~;%.3f}
      &{$a-$a~;%.3f}

On the other hand, '$a~~' would refer to the cell that is two above
the current row which is at the first column.

Note that '$~' would refer to the cell that is immediately above the current
column, and '$~~' would refer to the cell that is two above the current cell.
In the following example the second column is to have the content that is "10"
and "100".

    < x
      x*x
    < 10
      &{$~*$~}

Note that the computation are always performed in the order from 
first row to the last, and while within the same row the computation
is to start from first column and end with the last.

[ The "body" block. ]
This block represents a normal paragraph.  For some translations the first line
of this paragraph is likely to have some visible indentation except for the
situation where this line is the first line after a sectional heading.

    Lorem Ipsum is simply dummy text of the printing and typesetting
    industry.  Lorem Ipsum has been the industry's standard dummy text
    ever since the 1500s, when an unknown printer took a galley of type 
    and scrambled it to make a type specimen book.  

This block recognizes the following form for the presence of a 
wrapped figure or wrapped table.

    Lorem Ipsum is simply dummy text of the printing and typesetting
    industry.  Lorem Ipsum has been the industry's standard dummy text
    ever since the 1500s, when an unknown printer took a galley of type 
    and scrambled it to make a type specimen book.  
    \\ 
    ```img{width:50} 
    \image "imgs/clock.png" 
    ```

Or,

    Lorem Ipsum is simply dummy text of the printing and typesetting
    industry.  Lorem Ipsum has been the industry's standard dummy text
    ever since the 1500s, when an unknown printer took a galley of type 
    and scrambled it to make a type specimen book.  
    \\ 
    ```tab{width:50,template:20 20} 
    \\name \\description     
    \\Apple \\Fruit           
    \\Pear \\Fruit           
    ```

[ The "figure" block. ]
This block implements a "figure" with multiple sub-figures. Each sub-figure is
a bundle that is always treated as a "img" bundle. The double-backslashes can
be placed in between bundles to force the start of a new figure line, otherwise
all figures are placed at a single line. The entire block is to have a caption
that is numbered. Subtitles of each image is shown if any.

    .figure
    \\
    ```dia{width:50}
    \image "imgs/frog.png"
    ```
    ```dia{width:50}
    \image "imgs/clock.png"
    ```

[ The "table" block. ]
This block implements a table that can be split between pages.  All contents
are treated as a single bundle that is always assumed as "tab". The entire
block is to have a caption that is numbered.  Subtitles of the table can be
shown.

    .table
    &label{mytable}
    ---
    (i) My note 1.
    (ii) My note 2.
    ---
    \\
    ```{head}
    Name \\ Addr.
    Mandy \\ 801 Sun Dr.
    Zar \\ 901 Sun Dr.
    Zor \\ 1001 Sun Dr.
    ```

[ The "multicol" block. ]
This block arranges to show all bundles side-by-side. The entire width of this
block is the same as the page and each bundle is given the same fractional
width which could be small or big depending on the actual number of bundles
detected. Unlike "figure" and/or "table", this block respects the key provided by
each bundle.  Subtitles are not shown.

    .multicol
    \\
    ```par
    A frog is any member of a diverse and largely 
    carnivorous group of short-bodied, tailless 
    amphibians composing the order Anura 
    (literally without tail in Ancient Greek). 
    ```
    \\
    ```dia{width:25}
    \image "frog.img"
    ```
    ```dia{width:25}
    \image "flower.img"
    ```

[ The "equation" block. ]
This block implements a numbered equation. Each bundle is assumed to be "fml"
that represents a single equation.  If a single equation is found it is
assigned an integer equation number.  Otherwise the equation number is the
integer followed by letter such as "a" and "b" to represent a sub-equation 
number.

    .equation
    &label{myeq}
    \\
    ```
    a + b = c
    ```
    ```
    a^2 + b^2 = c^c
    ```


[ The "listing" block. ]
This block treates the entire content as a single bundle, such that each line 
represents a single source code line that is to be numbered when shown.
Lines can be split into multiple pages.

    .listing
    &label{mylisting}
    \\
    ```    
    #include<stdio>
    int main(){
      return 0;
    }
    ```

[ The "page" block. ]
This block is to insert a manual page break.         

[ The "vspace" block. ]
This block is to insert a manual vertical space.         

[ The "alignment" block. ]
This block watches for the presence of one or more
bundles and will arrange such that some bundles are placed
on the same line and others on the following line.

    .alignment   
    \\
    ```dia{width:25}
    \image "frog.img"
    ```
    ```dia{width:25}
    \image "frog.img"
    ```
    \\
    ```dia{width:50}
    \image "flower.img"
    ```

In addition, the bundles can be centered aligned.

    .alignment{textalign:c}
    \\
    ```dia{width:25}
    \image "frog.img"
    ```
    ```dia{width:25}
    \image "frog.img"
    ```
    \\
    ```dia{width:50}
    \image "flower.img"
    ```

In addition, the bundles can be right aligned.

    .alignment{textalign:r}
    \\
    ```dia{width:25}
    \image "frog.img"
    ```
    ```dia{width:25}
    \image "frog.img"
    ```
    \\
    ```dia{width:50}
    \image "flower.img"
    ```


# Inline Literals

Literals are text marked with some punctuations.  For instance, a pair of
double-backquote are to turn a piece of text into math literal.

    The theorem is: ``a^2 + b^2 = c^2``.

A pair of single-backquote is to mark a piece of text as verbatim literal.

    The key combination is: `CTRL-K`.

A pair of quotation marks is to mark a piece of text as quotation literal.  The
output varies based on the target translation. For LATEX the \textquote command
from "csquotes" package is used. For CONTEX the \quotation command is used.
For HTML the Q-tagname is used.

    He sayd "good morning" to me.

A pair of double-braces is to mark a piece of text as emphasis literal.

    The saying goes like this: {{a fox jumps over a lazy dog.}}

A pair of double-asterisk is to mark a piece of text as strong literal.
Note that spaces are not allowed inside this literal.

    The **text** is shown in more weight than normal.

A pair of single-asterisk is to mark a piece of text as slanted literal.
Note that spaces are not allowed inside this literal.

    The *text* is shown in slanted comparing to normal.  

Note that strong and slanted literal can appear inside quotation literal and emphasis
literal.


# Inline phrases

A text can also appear inside a form such as `&key{...}`, to become a entity phrase.
Following are recognized entity phrases.

- em
- b
- i
- u
- s
- tt
- q
- g
- high
- low
- br
- ref
- url
- link
- utfchar
- utfdata
- checkbox
- colorbutton
- fbox
- hrule
- img
- label

The "hrule" entity phrase is to tyepset a horizontal rule of a given size
and with optional contents. Following typesets a horizontal rule 
of length equal to 10em.

    Please enter your name: &hrule{10}

Following allows for the contents to be provided that will appear on top of the
rule of length 10em. Contents recognized by a white space within the phrase.

    Please enter your name: &hrule{10 Mark Dove}

The "dia" phrase can be used to insert an inline diagram that is similar to the
content of a DIA bundle. The content of the diagram are to come from a "paste
buffer". In the following example there is a paste buffer named "mydia"
containing the content of a DIA.

    ---
    title: My Doc
    ---
    %=mydia{viewport:5 5}
    \drawline (0,0)(5,5)
    \drawline (5,0)(0,5)
    %

Later on a paraph can be constructed as follows in which case 
an inline image will be created that holds the figure.

    The diagram is: &dia{mydia}

The "checkbox" phrase inserts a checkbox that should be made interactive 
for HTML-related translation, such that it can be styled in a way to 
turn on/off other elements. For LATEX/CONTEX translations a blacksquare 
is shown.

    - &checkbox{} Apple.
    - &checkbox{} Pear.
    - &checkbox{} Banana.

The "colorbutton" phrase Create a square that looks like a button
showing given color.  For instance,

    The button is &colorbutton{red}.

The "ref" phrase inserts an integer expressing a reference to an existing label.
For instance, the phrase `&ref{sect1}` would likely have inserted a number that
is "1" should label "sect1" be associated with the first section of an article.

    Please see section &ref{sect1}.

The "label" phrase Create a label that is associated with a particular section
or other composite block.     For instance, following example associated label
"sect1` with a section titled "Introduction". If this section is later on
referenced by `&ref{sect1}`, then an integer 1 could be inserted if this
section is the first section.

    # Introduction
    &label{sect1}

# CJK and custom fonts

The document may contain Unicode characters that are greater
than 0x7F. Depending on the main font, these characters may
not be shown property by the target translation, such as LATEX
and CONTEX. HTML does not have this problem.

For LATEX, there is a mechanism to detect CJK characters.
NITRILE has a builtin database regarding common CJK characters
and what language it belongs. It should be one 
of the following: JP, CN, TW, and KR. 

The goal is to recognize the continued text that belong to one language,
and thus allow for a font that is corresponding to this language to be 
selected. For example, following are Japanese characters.

    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。

Followng are simplified Chinese.
            
    冰岛由于实行高福利政策，
    所以很多人并没有存钱防老的习惯，
    银行存款占个人全部资产的比例并不多；
    此外，冰岛人投在股票、期货等金融市场上的钱也多是闲钱

Following are traditional Chinese.

    冰島由於實行高福利政策，
    所以很多人並沒有存錢防老的習慣，
    銀行存款占個人全部資產的比例並不多；
    此外，冰島人投在股票、期貨等金融市場上的錢也多是閑錢.

Each of the previous text might need to have a different font
to be shown these characters correctly. This is because
of the Han Unification effort of the Unicode, which places
CJK character in a single block, such that no single font
is to cover all characters. Thus, NITRILE need to be smart
about it, and the builtin database servers help detect
which language it is for a block of CJK characters.

For XELATEX, when a language is detected, such as JP, then it generates
the following, translation.

    {\fontspec{jp}
    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。}

For PDFLATEX, the translation is to become the following.

    \begin{CJK}{UTF8}{min}
    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。}
    \end{CJK}
    
For XELATEX, the fontspec package is to be included.

    \usepackage{fontspec}

This package is always to assume that the input file is 
UTF-8 encoded. It included several commands allowing user
to select font.

    \newfontfamily
    \defaultfontfeatures
    \setromainfont
    \setsansfont
    \setmonofont

Following are some examples.

    \newfontfamily{\jp}[Scale=0.85]{Osaka}
    \newfontfamily{\cn}[Scale=0.85]{Yuanti SC}
    \newfontfamily{\tw}[Scale=0.85]{Yuanti TC}
    \newfontfamily{\kr}[Scale=0.85]{AppleGothic}
    \XeTeXlinebreaklocale "th_TH"
    \defaultfontfeatures{Mapping=tex-text}
    \setromanfont[Mapping=tex-text]{Hoefler Text}
    \setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Gill Sans}
    \setmonofont[Scale=MatchLowercase]{Andale Mono}

The \fontspect{} command is one that allows for expressing
the font name directly. For example ``{\fontspec{jp}日本}``
is specify that a font named "jp" is to be used for showing
the text that is "日本".

NITRILE always uses the font name "jp" for Japanese text, "tw" for
traditional Chinese text, "cn" for simplied Chinese text and "kr"
for Korean text. These names are alias for other real font that
is installed in the target system, which could be different
from system to system. User would have to provide the association
to map from thiese alias to real font name by creating and placing
following ".fontspec" files in the project directory.

    jp.fontspec
    tw.fontspec
    cn.fontspec
    kr.fontspec

Each ".fontspec" file contains information telling XELATEX how to
map from a font named to a font installed on the current system.
Following is the content of a "jp.fontspec" file for MAXOSX.

    \defaultfontfeatures[jp]
    {
      UprightFont=Hiragino Mincho ProN
    }

Following are contents of a "tw.fontspec" file for MAXOSX.

    \defaultfontfeatures[tw]
    {
      UprightFont=Songti TC                
    }

Following are contents of a "cn.fontspec" file for MAXOSX.

    \defaultfontfeatures[cn]
    {
      UprightFont=STSong                
    }

Following are contents of a "kr.fontspec" file for MAXOSX.

    \defaultfontfeatures[kr]
    {
      UprightFont=AppleGothic              
    }

The "UprightFont=" entry points to a font installed by OS or by 
the current distribution of TEXLIVE. For windows these font names
might be different.

For PDFLATEX there is no need to setup these files. Instead, following
packages are to be included. 

    \usepackage[overlap,CJK]{ruby}
    \renewcommand\rubysep{0.0ex};

These package defines the following commands.

    \begin{CJK}{UTF8}{min}...\end{CJK}  % For JP

    \begin{CJK}{UTF8}{gbsn}...\end{CJK} % For CN
 
    \begin{CJK}{UTF8}{bsmi}....\end{CJK} % For TW

    \begin{CJK}{UTF8}{mj}....\end{CJK}  % For KR

For CONTEX/XELATEX translation there could be many Unicode charactesr
to be included with a document that do not necessarily have a corresponding
glyphs in the main font. Thus, these character needs to be specially
demarcated with the font with which it is suitable to be used to show
the glyph. 

For CONTEX it is 

    \switchtobodyfont[jp]{...}

For XELATEX it is

    {\fontspec{jp}...}

And "jp" is assumed to be the name of the font,
that must have been configured.


# Specify addition fonts

The four CJK fonts are "jp", "cn", "tw" and "kr".
There are also additional ten fonts that can be configured. Each one
can be configured to style a text that belongs to one of the existing 
Unicode blocks. For instance, it is pssible to set up so that font "A"
is to be applied to all texts that belong to Unicode block starting at 0x2700,
or Dingbats. Following example sets up so that the "jp" font would load
"ipaexmincho" for CONTEX, "Hiragino Mincho ProN" for XELATEX, and "ipaexmincho"
for LUALATEX translation, and in addition, the "Unifont" for all the previous
three translations for all texts of Unicode block 0x2700.

    ---
    title: My Doc
    fonts: jp{contex:ipaexmincho,xelatex:Hiragino Mincho ProN",lualatex:ipaexmincho}
           A{contex:Unifont,xelatex:Unifont,lualatex:Unifont,start:0x2700}
    ---

Thus, the text that is the following

    日本語Hello: ✍✎

Would have been translated into CONTEX as

    {\switchtobodyfont[jp]日本語}Hello: {\switchtobodyfont[A]✍✎}{\switchtobodyfont[A]□▢}

And to XELATEX and LUALATEX as

    {\jp{}日本語}Hello:{\A{}✍✎}

Note that "jp", "cn", "tw" and "kr" are font ID that are automatically applied
to texts of CJK characters without any setup from the user side. However, each
of these font ID must be linked to an installed system font in order for it to
work. By configuring the "fonts" front matter key it allows for an installed
system font to be linked to a font ID, such that the translation would create
necessary commands to link this font ID with the installed system font.
For CONTEX it is \definefontfamily, and for LUALATEX/XELATEX it is \newfontfamily
and/or \newjfontfamily.

For texts of a particular Unicode block to be applied a specific font the font
ID "A", "B", "C", "D", "C", "D", "E", "F", "G", or "H" must be used. Each of
these font ID must be linked with an installed system font in order for this
font ID to work.

    
# Frontmatter configuration parameters

Following are keys that can appear as part of the configurations

- title
- tex   
- peek
- fonts
- bodyfontsuit
- bodyfontsize
- bodyfontvariant
- titlepage
- tocpage
- name
- chapnum

[ tex. ]
The "tex" key is to hold a string that identifies which specific TEX
program used for the "peek" type. Valid entries are: "pdflatex", "xelatex",
"lualatex" and "context".

[ fonts. ]
For CJK/Unicode fonts.

[ bodyfontsuit. ]
This should be set to one of the following: "linux", "dejavu", and "office".
The first one would instruct that the translation should be switched to using
Libertina font; the "dejavu" should instruct the translation to use the
Dejavu font; and the "office" should instruct that "Times New Roman" should be
used instead.

[ bodyfontvariant. ]
This should be set to "ss" if the main font should be a Sans Serif
instead of the normal Serif. 

[ bodyfontsize. ]
This should be set to an integer such as "11" for expressing
the size of the main font in "pt".

[ peek. ]
This should be set to a translation backend name such as "folio" to express
the fact that if this MD document is to be served over the HTTP then
that translation should be used to convert it to HTML/XHTML document.
Other available HTML/XHTML translation backends are: "slide", and "page".

[ title. ]
This should be set to a string holding the title of the document. This string
would serve a variety of purposes, one of which would be to set the "title"
tag of the generated HTML/XHTML document. 



# Auxiliary information sections

Auxilary information sections provide auxiliary information to all
blocks/bundles of the current document. They can be categorized into
following four different types.

- imports
- ruby annotations
- defaut styles
- named storage
- variables
- arrays

The "import" sections are for providing external documents that are to be
imported as chapters, or to create one or more "part" section placed between
chapters.

The "ruby annotation" sections are to provide ruby annotation for certain
Japanese/Chinese characters.

The "default style" sections are to add default style configurations to be
present for all blocks/bundles of a particular ID.

The "named storage" sections establishes named storages and suppy its contents;
these storage buffers can later on by referenced and its contents retrieved.

To add additional chapters and parts, use the '@import" statement.

    @import [part]"Introduction"
    @import [chapter](./chap1.md)
    @import [chapter](./chap2.md)
    @import [chapter](./chap3.md)
    @import [part]"Introduction"
    @import [chapter](./chap4.md)
    @import [chapter](./chap5.md)
    @import [chapter](./chap6.md)

Ruby annotations can be specified which is automatically attached to matching
words in the document

    !異臭・いしゅう
    !匂い・におい
    !危ない・あぶない
    !蓋/ふた
    !埃/ほこり
    !覆われた・おおわれた
    !汚れた・よごれた
    !真っ黒/まっくろ

Default styles can be specifieid which will be applied to all matching blocks.

    ~preformatted{textsmaller}
    ~img{frame,viewport:20 20,width:40}

Name bundle storages provide storage for individual bundles such that      
they can be recalled through their "restore" attribute.

    ```img{id:spider,viewport:10 10,fontsize:10}
    \drawpath {fillcolor:white} &ellipse{(0,1.4),0.65,1.0}
    \drawpath {fillcolor:white} &ellipse{(0,0.3),0.4,0.3}
    \fillpath {fillcolor:black} &circle{(-0.2,0.25),0.1}
    \fillpath {fillcolor:black} &circle{(+0.2,0.25),0.1}
    \drawpath (+0.3,0.45) <clock:+35,1> <clock:+35,0.4> &circle{(*),0.1}
    \drawpath (+0.3,0.45) <clock:+55,1> <clock:+35,0.4> &circle{(*),0.1}
    \drawpath (+0.3,0.45) <clock:+75,1> <clock:+35,0.4> &circle{(*),0.1}
    \drawpath (+0.3,0.45) <clock:+95,1> <clock:+35,0.4> &circle{(*),0.1}
    \drawpath (-0.3,0.45) <clock:-35,1> <clock:-35,0.4> &circle{(*),0.1}
    \drawpath (-0.3,0.45) <clock:-55,1> <clock:-35,0.4> &circle{(*),0.1}
    \drawpath (-0.3,0.45) <clock:-75,1> <clock:-35,0.4> &circle{(*),0.1}
    \drawpath (-0.3,0.45) <clock:-95,1> <clock:-35,0.4> &circle{(*),0.1}
    ```

Both keys and styles can be omitted. However, If an ID attribute is not found
then this bundle is not stashed.

    ```{id:ant}
    \drawpath (-0.8,1)   <clock:-150,0.7> &circle{(*),0.1}
    \drawpath (-0.6,0.8) <clock:-160,0.7> &circle{(*),0.1}
    \drawpath (-0.3,1)   <clock:-170,0.7> &circle{(*),0.1}
    \drawpath (-0.1,0.8) <clock:-175,0.7> &circle{(*),0.1}
    \drawpath (+0.3,1)   <clock:-190,0.7> &circle{(*),0.1}
    \drawpath (+0.6,0.8) <clock:-199,0.7> &circle{(*),0.1}
    \drawpath {fillcolor:white} &ellipse{(0.9,1.20),0.65,0.40,15}
    \drawpath {fillcolor:white} &ellipse{(+0.2,1.1),0.4,0.3}
    \drawpath {fillcolor:white} &ellipse{(-0.4,1.1),0.4,0.3}
    \drawpath {fillcolor:white} &ellipse{(-1.1,1.4),0.5,0.5}
    \fillpath {fillcolor:black} &circle{(-1.3,1.4),0.1}
    \drawpath (-1,1.7) <q:0.5,0.5,-0.3,0.8>
    \drawpath (-1.2,1.7) <q:0.5,0.5,-0.4,0.8>
    ```

Variables and arrays can be specified by using the "\var" and/or "\arr"
commands. These commands creates new variables and array which will be inserted
and becomes part of the style for all blocks.

    \var a = 12+1
    \arr as = [1-10] [2-20]
    





# Splitting "listing" block

A "listing" block could be split such that a long listing is to be replaced by
two or more shorter listings. Each additional sub-listing is expected to start
a new page.

This is to be achieved by inserting a "autosplit" style attribute.  This attribute
is to be expected a list of numbers where each number represents the total
number of input lines that are to go to each sub-listing.  If the list is shorter
than the total number of bundles needed than an additional bundle is created
that holds all the remaining lines.

In the following example the listing is to be split into two sub-listing where
the first sub-listing containing the first five input lines of the original bundle,
and the second sub-listing holds all the remaining lines.   

    .listing{autosplit:5}
    &label{mylisting}
    My JavaScript program.
    \\
    ```
    var a = 1;
    var b = 1;
    var c = 2;
    var d = Math.abs(12);
    var e = a + b + c;
    var f = [1,2,3,4,5];
    var g = [5,6,6,7,7,];
    ```

The caption of each sub-listing is to be made such that the first sub-listing
might read "Listing 1a", and the second sub-listing "Listing 1b".



# Splitting "table" block

A "table" composite block can also undergo the process of being split into
multiple sub-tables including utilizing the "autosplit" attribute which would
split the input lines into multiple bundles in the same way the "listing" does.

In addition, if the original table container a header row then the "head"
attribute should be set to a number expressing the total number of input lines
that should go to the header row. Lines belonging to the header row are not
counted towards input lines to split. Captions of splitted sub-tables are
likely to become "Table 1a", "Table 1b" etc.

In the following example there will be two sub-tables. The first sub-table
contains entries for John, James, Jane, Mary and Martin, and the second
sub-table contains entries for Zar and Zor. Each sub-table will be furnished
with a header row that is Name and Addr.

    .table{autosplit:5,head:1}
    &label{mytable}
    My table.               
    \\
    ```
    Name \\ Addr.
    John \\ 301 Sun Dr.
    James \\ 401 Sun Dr.
    Jane \\ 501 Sun Dr.
    Mary \\ 601 Sun Dr.
    Martin \\ 701 Sun Dr.
    Mandy \\ 801 Sun Dr.
    Zar \\ 901 Sun Dr.
    Zor \\ 1001 Sun Dr.
    ```

An alternative way is to manually break a long table bundle into smaller
bundles, and add the "splitids" attribute to the style of the "table".  This
setup is the same as the previous one, except in this case the table header has
to be manually repeated in each smaller bundle.  It is also important to set
the "splitids" attribute to hold a list of integers that is the same length as
that of the total number of bundles, and start the first number with 1, 
followed by 2, 3, etc.

    .table{splitids:1 2}
    &label{mytable}
    My table.               
    \\
    ```
    Name \\ Addr.
    John \\ 301 Sun Dr.
    James \\ 401 Sun Dr.
    Jane \\ 501 Sun Dr.
    Mary \\ 601 Sun Dr.
    Martin \\ 701 Sun Dr.
    ```
    ```
    Name \\ Addr.
    Mandy \\ 801 Sun Dr.
    Zar \\ 901 Sun Dr.
    Zor \\ 1001 Sun Dr.
    ```




# Splitting a "itemize" block

A long list of itemized list can be split into two or more groups such that
each list is to appear in a different page.  The settings are similar to
splitting the listing and/or table.

.itemize{autosplit:5}
\\
```
- Hello
- Hello
- Hello
- Hello
- Hello
- World
- World
```




