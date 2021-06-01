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



# The Camper.JS Translator

The Camper.JS translator serves to generated a CONTEX document of paper A4.
The papersize is actually configuration to others by the use of the "papersize" 
config entry. However, this translator serves to generate a document that resembles
the "report" document class under LATEX. Following are frontmatter config entries
implemented.

- ``camper.papersize`` 
 
  This entry serves to hold the paper size. Valid entries are "A4", "A5",
  "Letter", "Legal", etc.

- ``camper.bodyfont``

  This entry serves to hold the name of the font family and size that would apply to
  the entire document. So far, the only font family supported is "linux", which 
  is configured to point to the Linux Libertine font family, which includes fonts
  of LibertineSerif, LibertineSans, LibertineMono, and LibertineMath.

  This entry should hold a string, with the name of the font family and font size
  specification each separated by a comma. For instance, the string "linux,11pt"
  is the default, which serves to express that the body font is Linux Libertine, and 
  the font size is 11pt. To change to a 10pt body font, use "10pt". 



# The Creamer.JS Translator

The Creamer.JS translator serves to generated a CONTEX document that resembles
a PowerPoint presentation under windows or Keynote presentation under MacOSX. 

The slide is currently configured to be always at the size of 128mm by 96mm and
is not configurable.  However, unlike the Beamer.JS class, if the content
cannot fit in the current slide, it will automatically be moved to a new slide
that is created automatically. This behavior is different that those observed
under Beamer.JS, in which case all contents created for a specific slide will
not see them being split into two or more slides. Following is the config entry
that can be used for this translator.

- ``creamer.bodyfont``

  This entry serves to hold the name of the font family and size that would apply to
  the entire document. So far, the only font family supported is "linux", which 
  is configured to point to the Linux Libertine font family, which includes fonts
  of LibertineSerif, LibertineSans, LibertineMono, and LibertineMath.

  This entry should hold a string, with the name of the font family and font size
  specification each separated by a comma. For instance, the string "linux,11pt"
  is the default, which serves to express that the body font is Linux Libertine, and 
  the font size is 11pt. To change to a 10pt body font, use "10pt". 














