---
title: ConTeXt TeX Engine
---

# Background

ConTeXt is a general-purpose document processor. Like LaTeX, it is derived from TeX. 
It is especially suited for structured 
documents, automated document production, very fine typography, and multi-lingual 
typesetting. It is based in part on the TeX 
typesetting system, and uses a document markup language for manuscript preparation. 
The typographical and automated capabilities of 
ConTeXt are extensive, including interfaces for handling microtypography, multiple 
footnotes and footnote classes, and manipulating 
OpenType fonts and features. Moreover, it offers extensive support for colors, 
backgrounds, hyperlinks, presentations, figure-text 
integration, and conditional compilation. It gives the user extensive control over 
formatting while making it easy to create new 
layouts and styles without learning the low-level TeX macro language.

ConTeXt may be compared and contrasted with LaTeX, but the primary thrust of the two 
are rather distinct. ConTeXt from the ground 
up is a typography and typesetting system meant to provide users easy and consistent 
access to advanced typographical 
control—important 
for general-purpose typesetting tasks. The original vision of LaTeX is to insulate 
the user from typographical 
decisions—a 
useful approach for submitting e.g. articles for a scientific journal. LaTeX has 
evolved from that original vision; at the same 
time, ConTeXt's unified design avoids the package clashes that can happen with 
LaTeX.

ConTeXt provides a multi-lingual user interface with support for markup in English, 
Dutch, German, French, and Italian and support 
for output in many languages including western European, eastern European, 
Arabic-script, 
Chinese, Japanese, and Korean. It also 
allows the user to use different TeX engines like pdfTeX, XeTeX, and LuaTeX without 
changing the user interface.

As its native drawing engine, ConTeXt integrates a superset of MetaPost called 
MetaFun, which allows the users to use the 
drawing abilities of MetaPost for page backgrounds and ornaments. Metafun can also 
be used with stand alone MetaPost. ConTeXt also 
supports the use of other external drawing engines, like PGF/TikZ and 
PSTricks.

ConTeXt 
also provides a macro package for typesetting chemical structure diagrams 
with TeX called PPCHTeX, as well as many 
other modules. This package can also be used with plain TeX and LaTeX.

Originally entitled pragmatex, ConTeXt was given its name around 1996. by Hans 
Hagen from PRAGMA Advanced Document Engineering 
(Pragma ADE), a Netherlands-based company.

[ License ]

ConTeXt is free software: the program code (i.e. anything not under 
the /doc subtree) is distributed under the GNU GPL; the documentation 
is provided under Creative Commons Attribution NonCommercial 
ShareAlike license.[14]

The ConTeXt official manual(2001) and ConTeXt official mini 
tutorial (1999) are documents copyrighted by Pragma, but there 
is a repository of the future new manual[15] released under 
the GNU Free Documentation License.[16][17] As of April 2009 
there is an up-to-date version of the fonts and typography chapters.[18]

[ Versions ]

The current version of ConTeXt is LMTX, introduced in April 
2019 as the successor to Mark IV (MkIV).[19] Previous versions 
— Mark II (MkII) and Mark I — are no longer maintained.

According to the developers, the principal difference between 
LMTX and its predecessors is that the newest version "uses a 
compilation and scripting engine that is specifically developed 
with ConTeXt in mind: LuaMetaTeX ... [which] has been optimised 
heavily for ConTeXt use."


[ History ]

ConTeXt was created by Hans Hagen and Ton Otten of 
Pragma ADE in the Netherlands around 1991
 due to the need for educational typesetting material.

Around 1996, Hans Hagen coined the name ConTeXt meaning 
"text with tex" (con-tex-t; "con" is a Latin preposition meaning 
"together with"). Before 1996 ConTeXt was used only within 
Pragma ADE, but in 1996 it began to be adopted by a wider audience. 
The first users outside Pragma were Taco Hoekwater, Berend de Boer 
and Gilbert van den Dobbelsteen, and the first user outside the 
Netherlands was Tobias Burnus.

In July 2004, contextgarden.net wiki page was created.

ConTeXt low-level code was originally written in Dutch. 
Around 2005, the ConTeXt developers began translating this to 
English, resulting in the version known as MKII, which is now 
stable and frozen[citation needed].

In August 2007, Hans Hagen presented the MKIV version, and the 
first public beta was released later that year.

During the ConTeXt User Meeting 2008, Mojca Miklavec presented 
ConTeXt Minimals, a distribution of ConTeXt containing the latest 
binaries and intended to have a small memory footprint, thus 
demanding less bandwidth for updates. In August 2008, this 
distribution was registered as a project in launchpad web site.

In June 2008, Patrick Gundlach wrote the first post in ConTeXt blog.

In July 2009, ConTeXt started git repository.

In November 2010, the ConTeXt Group was created.

In April 2019, LMTX (ConTeXt LuaMetaTeX) was announced.

[ Example of Code ]

    % This line is a comment because % precedes it.
    % It specifies the format of head named 'title'
    % Specifically the style of the font: sans serif
    % + bold + big font.
    
    \setuphead[title][style={\ss\bfd},
        before={\begingroup},
        after={John Doe, the author\smallskip%
               \currentdate\bigskip\endgroup}]
    
    \starttext
    
    \title{\CONTEXT}
    
    \section{Text}
    \CONTEXT\ is a document preparation system for the 
    \TEX\ typesetting program. It offers programmable 
    desktop publishing features and extensive 
    facilities for automating most aspects of 
    typesetting and desktop publishing, including 
    numbering and cross-referencing (for example to 
    equation \in[eqn:famous-emc]), tables and figures, 
    page layout, bibliographies, and much more.
    
    It was originally written around 1990 by Hans 
    Hagen. It could be an alternative or complement 
    to \LATEX.
    
    \section{Maths}
    With \CONTEXT\ we could write maths. Equations 
    can be automatically numbered.
    
    \placeformula[eqn:famous-emc]
    \startformula
        E = mc^2
    \stopformula
    with
    \placeformula[eqn:def-m]
    \startformula
        m = \frac{m_0}{\sqrt{1-\frac{v^2}{c^2}}}
    \stopformula
    
    \stoptext

[ LuaTeX ]

LuaTeX is a TeX-based computer typesetting system which 
started as a version of pdfTeX with a Lua scripting engine 
embedded. After some experiments it was adopted by the TeX 
Live distribution as a successor to pdfTeX (itself an 
extension of ε-TeX, which generates PDFs).
Later in the project some functionality of Aleph was 
included (esp. multi-directional typesetting). 
The project was originally sponsored by the 
Oriental TeX project, founded by Idris Samawi 
Hamid, Hans Hagen, and Taco Hoekwater.

The main objective of the project is to provide a version of 
TeX where all internals are accessible from Lua. In the process 
of opening up TeX much of the internal code is rewritten. Instead 
of hard coding new features in TeX itself, users (or macro package writers) 
can write their own extensions. LuaTeX offers support for OpenType 
fonts with external modules. One of them, written in Lua, is provided
by the LuaTeX team, but support for complex scripts is limited; there 
is work in progress (as of 2019) to integrate HarfBuzz.

A related project is MPLib (an extended MetaPost library module), 
which brings a graphics engine into TeX.

The LuaTeX team consists of Luigi Scarso, Taco Hoekwater, Hartmut 
Henkel and Hans Hagen.

The first public beta was launched at TUG 2007 in San Diego. 
The first formal release was planned for the end of 2009, and 
the first stable production version was released in 2010.
Version 1.00 was released in September 2016 during ConTeXt 2016.
As of October 2010, both ConTeXt mark IV and LaTeX with extra 
packages (e.g. luaotfload, luamplib, luatexbase, luatextra) 
make use of new LuaTeX features. Both are supported in TeX 
Live 2010 with LuaTeX 0.60, and in LyX. Special support 
in plain TeX is still under development.

So, what's LuaTEX? Short version: the hottest TEX engine 
right now! Long version: It is the designated successor of 
pdfTEX and includes all of its core features: direct generation 
of PDF files with support for advanced PDF features and 
micro-typographic enhancements to TEX typographic algorithms. 
The main new features of LuaTEX are:

1. Native support of Unicode, the modern standard for character classification and encod- ing, supporting all characters in the world, from English to traditional Chinese through Arabic, including a lot of mathematical (or otherwise specialised) symbols.

2. Inclusion of Lua as an embedded scripting language (see section 1.3 for details).

3. A lot of wonderful Lua libraries, including:

  - "fontloader": supporting modern font formats such as TrueType and OpenType;
  
  - "font": allowing advanced manipulation of the fonts from within the document;
  
  - "mplib": an embedded version of the graphic program MetaPost;
  
  - "callback": providing hooks into parts of the TEX engine that were previously 
    inaccessible to the programmer;
  
  - other utility libraries for manipulating images, pdf files, etc.

Some of these features, such as Unicode support, directly 
impact all documents, while oth- ers merely provide tools that 
package authors will use to provide you with more powerful commands 
and other enhancements.

[ LuaLaTeX ]

To answer this question, we need to mention a few details 
about the TEX world that you may usually ignore: the difference 
between an engine and a format. An engine is an actual computer 
program, while a format is a set of macros executed by an engine, 
usually preloaded when the engine is invoked with a particular name.

Actually, a format is more or less like a document class or a 
package, except it is associated with a particular command name. 
Imagine there is a command latex-article that would do the same 
as latex, except you wouldn't need to say \documentclass{article} 
at the begin- ning of your file. Similarly, in current distributions, 
the command pdflatex is the same as the command pdftex except that 
you don't need to put the instructions to load LATEX at the beginning 
of your source file. 􏰀is is convenient, and slightly more efficient too.

Formats are great because they implement powerful commands using 
the basic tools an engine provides. However the power of the format 
is sometimes limited by the engine's tools set, so people started 
developing more powerful engines so that other people can implement 
even more powerful formats (or packages). The most famous engines now 
(except the original TEX) are PdfTEX, XeTEX and LuaTEX.

To further complicate the picture, the original TEX engine produced 
only DVI files, while its successors may (also) produce PDF file. 
Each command in your system corresponds to a particular engine with 
a particular format and a particular output mode. 􏰀e following table 
summarizes this: rows are indexed by format, columns by engine, and 
in each cell the first line is the command for this engine with this 
format in DVI mode, and the second for the same PDF mode.

In short, LuaLATEX is mostly like LATEX, with a few differences, and more
powerful packages and tools designed specifically for it.
Here we present an absolute minimum you should know to produce a document 
with LuaLATEX, while the rest of the document provides more details about 
the available packages.

1. Don't load ``inputenc``, just encode your source in UTF-8.

2. Don't load ``fontenc`` nor ``textcomp``, but load ``fontspec``.

3. ``babel`` works with LuaLATEX but you can load ``polyglossia`` instead.

4. Don't use any package that changes the fonts, but use fontspec's 
   commands instead.

So, you only need to get familiar with ``fontspec``, which is easy: select 
the main (serif) font with \setmainfont, the sans serif font with 
\setsansfont and the mono-spaced (typewriter) font with \setmonofont. 􏰀
The argument to these commands is the human-friendly name of the font, 
for example ``Latin Modern Roman`` rather than ``ec-lmr10``. You probably want 
to use \defaultfontfeatures{Ligatures=TeX} before these commands to keep 
the usual TEX substitutions (such as --- for an em-dash) working.

# Typographical Capabilities

- Interfaces for handling microtypography
- Multiple footnotes
- Manipulating OpenType fonts and features
- Colored text and/or colored background
- Hyperlinks
- Figure-text integration


# Multi-lingual Support



# MetaFun Support

- Create vector graphic drawings
- Drawing the page backgrounds and ornaments

# Support of PGF/TikZ


# Support of PSTricks



