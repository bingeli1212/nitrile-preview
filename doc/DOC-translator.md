---
title: The Translator.JS Class
---

# The Translator.JS Class

The translator.JS class serves as a base class for performing translation
of parsed blocks holding structural information regarding 
the structure of the document. Each specialized translator would
each implement their own derived class which provides specialized
method that can be called to translate the blocks and save the output
to a file. While choosing to base the translator class as the base class,
it can take advantage of many common methods provided by this class. 

So far, following subclasses are implemented:

- Contex.JS
- Latex.JS
- Html.JS
- Camper.JS
- Creamer.JS
- Beamer.JS
- Epub.JS
- Article.JS
- Report.JS

Note that for some of the subclasses they have chosen to derive from other
subclasses, not directly from translator class. Examples of such classes
are Camper.JS, and Creamer.JS, each of which has chosen to derive from Context.JS.



# The "translator" Frontmatter Config

The "translator" frontmatter config entry holds a string that serves to express what
specific translator it wishes to be used. The value of this config entry is a string
of all lower cases that is assigned one of the following strings:

- contex
- latex
- html
- camper
- creamer
- beamer
- epub
- article
- report



# The "program" Frontmatter Config

The "program" config entry holds the name of a program that would serve to 
run to compile the generated document if it is set. For instance, for the
"camper" and "creamer" translator, the program could be set to the name
of "context", which should be a valid program that can be run to compile
the TEX document that is created by the "camper" or "creamer" translator.



# The "dest" Frontmatter Config

The "dest" config entry holds the value that would serve to ask that a copy 
of the compile result, such as a PDF file, would be placed at the destination
given by this entry. For instance, when set to "../pdf", it would place a copy
of the PDF file into this directory as well, in addition to the original 
PDF file that was created in the same directory as the original MD file.


# The "rename" Frontmatter Config

The "rename" config entry is designed to hold a Boolean value such that,
when it is set to true, would also change the naming of the PDF file when
it is being copied to the destination directory.  Thus, it is designed to
work in conjunction with the "dest" entry. It does not have any effect
if the "dest" entry is not set. The file will be renamed so that it matches
the title of the document.















