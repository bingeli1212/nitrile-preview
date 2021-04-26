---
title: ConTeXt TeX Engine
camer.setupbodyfont: linuxlibertine,11pt
---

# Background

ConTeXt is a general-purpose document processor. Like LaTeX, it is derived
from TeX.  It is especially suited for structured  documents, automated
document production, very fine typography, and multi-lingual  typesetting. It
is based in part on the TeX  typesetting system, and uses a document markup
language for manuscript preparation.  The typographical and automated
capabilities of  ConTeXt are extensive, including interfaces for handling
microtypography, multiple  footnotes and footnote classes, and manipulating 
OpenType fonts and features. Moreover, it offers extensive support for colors,
 backgrounds, hyperlinks, presentations, figure-text  integration, and
conditional compilation. It gives the user extensive control over  formatting
while making it easy to create new  layouts and styles without learning the
low-level TeX macro language.

ConTeXt may be compared and contrasted with LaTeX, but the primary thrust of
the two  are rather distinct. ConTeXt from the ground  up is a typography and
typesetting system meant to provide users easy and consistent  access to
advanced typographical  control—important  for general-purpose typesetting
tasks. The original vision of LaTeX is to insulate  the user from
typographical  decisions—a  useful approach for submitting e.g. articles for a
scientific journal. LaTeX has  evolved from that original vision; at the same 
time, ConTeXt's unified design avoids the package clashes that can happen with
 LaTeX.

ConTeXt provides a multi-lingual user interface with support for markup in
English,  Dutch, German, French, and Italian and support  for output in many
languages including western European, eastern European,  Arabic-script, 
Chinese, Japanese, and Korean. It also  allows the user to use different TeX
engines like PdfTEX, XeTeX, and LuaTeX without  changing the user interface.

As its native drawing engine, ConTeXt integrates a superset of MetaPost called
 MetaFun, which allows the users to use the  drawing abilities of MetaPost for
page backgrounds and ornaments. Metafun can also  be used with stand alone
MetaPost. ConTeXt also  supports the use of other external drawing engines,
like PGF/TikZ and  PSTricks.

ConTeXt  also provides a macro package for typesetting chemical structure
diagrams  with TeX called PPCHTeX, as well as many  other modules. This
package can also be used with plain TeX and LaTeX.

Originally entitled pragmatex, ConTeXt was given its name around 1996. by Hans
Hagen from PRAGMA Advanced Document Engineering  (Pragma ADE), a
Netherlands-based company.

[ License ]

ConTeXt is free software: the program code (i.e. anything not under  the /doc
subtree) is distributed under the GNU GPL; the documentation  is provided
under Creative Commons Attribution NonCommercial  ShareAlike license.[14]

The ConTeXt official manual(2001) and ConTeXt official mini  tutorial (1999)
are documents copyrighted by Pragma, but there  is a repository of the future
new manual[15] released under  the GNU Free Documentation License.[16][17] As
of April 2009  there is an up-to-date version of the fonts and typography
chapters.[18]

[ Versions ]

The current version of ConTeXt is LMTX, introduced in April  2019 as the
successor to Mark IV (MkIV).[19] Previous versions  — Mark II (MkII) and Mark
I — are no longer maintained.

According to the developers, the principal difference between  LMTX and its
predecessors is that the newest version "uses a  compilation and scripting
engine that is specifically developed  with ConTeXt in mind: LuaMetaTeX ...
[which] has been optimised  heavily for ConTeXt use."


[ History ]

ConTeXt was created by Hans Hagen and Ton Otten of  Pragma ADE in the
Netherlands around 1991 due to the need for educational typesetting material.

Around 1996, Hans Hagen coined the name ConTeXt meaning  "text with tex"
(con-tex-t; "con" is a Latin preposition meaning  "together with"). Before
1996 ConTeXt was used only within  Pragma ADE, but in 1996 it began to be
adopted by a wider audience.  The first users outside Pragma were Taco
Hoekwater, Berend de Boer  and Gilbert van den Dobbelsteen, and the first user
outside the  Netherlands was Tobias Burnus.

In July 2004, contextgarden.net wiki page was created.

ConTeXt low-level code was originally written in Dutch.  Around 2005, the
ConTeXt developers began translating this to  English, resulting in the
version known as MKII, which is now  stable and frozen[citation needed].

In August 2007, Hans Hagen presented the MKIV version, and the  first public
beta was released later that year.

During the ConTeXt User Meeting 2008, Mojca Miklavec presented  ConTeXt
Minimals, a distribution of ConTeXt containing the latest  binaries and
intended to have a small memory footprint, thus  demanding less bandwidth for
updates. In August 2008, this  distribution was registered as a project in
launchpad web site.

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

[ LuaTEX ]

LuaTEX is a TeX-based computer typesetting system which  started as a version
of PdfTEX with a Lua scripting engine  embedded. After some experiments it was
adopted by the TeX  Live distribution as a successor to PdfTEX (itself an 
extension of ε-TeX, which generates PDFs). Later in the project some
functionality of Aleph was  included (esp. multi-directional typesetting). 
The project was originally sponsored by the  Oriental TeX project, founded by
Idris Samawi  Hamid, Hans Hagen, and Taco Hoekwater.

The main objective of the project is to provide a version of  TeX where all
internals are accessible from Lua. In the process  of opening up TeX much of
the internal code is rewritten. Instead  of hard coding new features in TeX
itself, users (or macro package writers)  can write their own extensions.
LuaTeX offers support for OpenType  fonts with external modules. One of them,
written in Lua, is provided by the LuaTeX team, but support for complex
scripts is limited; there  is work in progress (as of 2019) to integrate
HarfBuzz.

A related project is MPLib (an extended MetaPost library module),  which
brings a graphics engine into TeX.

The LuaTeX team consists of Luigi Scarso, Taco Hoekwater, Hartmut  Henkel and
Hans Hagen.

The first public beta was launched at TUG 2007 in San Diego.  The first formal
release was planned for the end of 2009, and  the first stable production
version was released in 2010. Version 1.00 was released in September 2016
during ConTeXt 2016. As of October 2010, both ConTeXt mark IV and LaTeX with
extra  packages (e.g. luaotfload, luamplib, luatexbase, luatextra)  make use
of new LuaTeX features. Both are supported in TeX  Live 2010 with LuaTeX 0.60,
and in LyX. Special support  in plain TeX is still under development.

So, what's LuaTEX? Short version: the hottest TEX engine  right now! Long
version: It is the designated successor of  PdfTEX and includes all of its
core features: direct generation  of PDF files with support for advanced PDF
features and  micro-typographic enhancements to TEX typographic algorithms. 
The main new features of LuaTEX are:

1. Native support of Unicode, the modern standard for 
   character classification and encoding, supporting all 
   characters in the world, from English to traditional 
   Chinese through Arabic, including a lot of mathematical 
   (or otherwise specialised) symbols.

2. Inclusion of Lua as an embedded scripting language 
   (see section 1.3 for details).

3. A lot of wonderful Lua libraries, including:

  - "fontloader": supporting modern font formats such as 
    TrueType and OpenType;
  
  - "font": allowing advanced manipulation of the fonts 
    from within the document;
  
  - "mplib": an embedded version of the graphic program MetaPost;
  
  - "callback": providing hooks into parts of the TEX engine 
    that were previously 
    inaccessible to the programmer;
  
  - other utility libraries for manipulating images, pdf files, etc.

Some of these features, such as Unicode support, directly 
impact all documents, while others merely provide tools that 
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
the command pdflatex is the same as the command PdfTEX except that 
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

The good news is: you can directly access any font on your operating 
system (in addition to those of your TEX distribution) including 
TrueType and OpenType fonts and have access to their most advanced 
features. It means it is now easy to install for use with LuaLATEX 
any modern font you may download or purchase from an editor and 
benefit from their full potential.

Now for the bad news: it is not always easy to get a list of 
all available fonts. Under Windows with TEX Live, the 
command-line tool ``fc-list`` lists them all, but is not very 
friendly. Under Mac OS X, the Fontbook application lists the 
fonts of your system, but not those of your TEX distribution. 
Same with ``fc-list`` on Linux. More bad news: it is not easy to 
access your old fonts that way. Happily, more fonts are available 
in modern formats every day (well, month or year, actually, 
if you count only good fonts).

XeTEX shares two of the essential features of 
LuaTEX: (1) native Unicode and (2) support for modern font formats. 
However, it does not have the other features of LuaTEX. On the other 
hand, it appears to be more stable than LuaTEX as of right now. 
Though the implementation of XeTEX and LuaTEX concerning fonts
are vastly different, 
magically, the same ``fontspec`` package can be included by
either engine without much trouble, owning to 
the superior design of the package author, who
had designed to provide the same set of
font selection commands
that could works in both situations.

[ Lua ]

The Lua is a nice, small language, obviously less surprising 
and much easier to learn than TEX as a programming language.
The essential reference is the very readable book Programming in Lua, 
whose first edition is freely available online. For a quick start, 
I recommend you read chapters 1 to 5 and have a quick glance at part 3. 
Note that all the libraries mentioned in chapter 3 are included in 
LuaTEX, but the os library is restricted for security reasons.
Depending on your programming culture, you may be directly interested 
in the rest of part 1 and part 2 which present more advanced features 
of the language, but part 4 is useless in a LuaTEX context, 
unless of course you want to hack LuaTEX itself. Finally, the 
Lua reference manual is available online and comes with a handy index.

The simplest way to execute Lua code from inside
a TEX document is to use the \directlua command. 
This command takes a single argument which is to be interpreted
as the native code to Lua. Conversely, the output
from the Lua code ``tex.sprint`` would have been sent back
to TEX, replacing the command with that text. For example, the following 
Lua code inside the \directlua command would have generated 
the text that is "3.1415926535898". 

    The $\pi$ is $\directlua{tex.sprint(math.pi)}$.

The \directlua command can be called either from within 
a text mode or from within a math mode. Following is 
the same command that is called from within a text mode.

    The $\pi$ is $\directlua{tex.sprint(math.pi)}$.

[ The fontspec Package ]

The ``fontspec`` package is designed for LuaTEX to offer
commands such that they can be called from within a TEX document
to permanently switch default fonts or temporarily switch 
to another one for some specific unicode code points.

- Specifically, 
  use the \fontspec command to switch temporarily to your 
  font.

- If you are using always the same symbol, you can build a 
  special command to insert this symbol, based on the 
  same \fontspec command. 

Following is an example of a LuaLATEX document.

    \documentclass{article}
    \usepackage{fontspec}
    \newfontfamily\wingdingsfont{Wingdings}
    \newcommand\wingdings[1]{{\wingdingsfont\symbol{#1}}}
    \usepackage{fonttable}
    \begin{document}
    \wingdings{40} 123-4567-8900
    \fonttable{Wingdings}
    \end{document}

By default, ``fontspec`` adjusts LATEX’s default maths setup in order 
to maintain the correct Computer Modern symbols when the roman 
font changes. However, it will attempt to avoid doing this if 
another maths font package is loaded (such as mathpazo or the 
unicode-math package).

If you find that fontspec is incorrectly changing the maths 
font when it shouldn’t be, apply the no-math package option 
to manually suppress its behaviour here.

If you wish to customise any part of the ``fontspec`` interface, 
this should be done by creating your own ``fontspec.cfg`` file, 
which will be automatically loaded if it is found by XeTEX 
or LuaTEX. A ``fontspec.cfg`` file is distributed with ``fontspec``
with a small number of defaults set up within it.
To customise ``fontspec`` to your liking, use the standard ``.cfg``
file as a starting point or write your own from scratch, then 
either place it in the same folder as the main document for 
isolated cases, or in a location that XeTEX or LuaTEX 
searches by default; e.g. in MacTEX: ``~/Library/texmf/tex/latex/``.
The package option no-config will suppress the loading of 
the ``fontspec.cfg`` file under all circumstances.

The \strong macro is used analogously to \emph but produces 
variations in weight. If you
need it in environment form, use 

    \begin{strongenv}...\end{strongenv}.

As with emphasis, this font-switching command is 
intended to move through a range of font weights. 
For example, if the fonts are set up correctly it allows 
usage such as 

    \strong{...\strong{...}} 
    
in which each 
nested \strong macro increases the weight of the font.

[ List of Fonts ]

If all you need is a list of the registered fonts, you can run
one of the following commands. The first one is to show all
fonts installed by the system, and the second one will
only show those fonts with the matching pattern.

    mtxrun --script fonts --list --all
    mtxrun --script fonts --list --all --pattern=*

These names are to be used with a CONTEX program only. The names
to be used with a LuaTEX are different. They will have to be 
obtained by running one of the follow commands:

    luaotfload-tool --list=*

You can use 

    man 1 luaotfload-tool 
    
For additional details of this command.

If you did not yet build the font indices you will have to do 
so before running above commands. For example, you will need to
run the following command for the system to build a internal
database that will cover all fonts installed within the current
system:

    mtxrun --script fonts --reload

For LuaTEX the following command should be issued:

    luaotfload-tool --update

[ Defining New Fonts To be Used ]

The \newfontfamily command can be used to create a new fonts
switch name such as "\jp" to be used. For instance. the following
commands would have created font switches that are named "\jp",
"\cn", "\tw", "\kr", and "\dingbats". The package "luatexja" 
is needed if it is to typeset CJK characters that are longer than
the width of one paragraph. It takes care of performing line breaks
between CJK characters because otherwise the default line break
algorithm does not generate a line break between two adjacent CJK
characters without a space between them.

    \newfontfamily{\jp}[]{ipaexmincho}
    \newfontfamily{\cn}[]{arplsungtilgb}
    \newfontfamily{\tw}[]{arplmingti2lbig5}
    \newfontfamily{\kr}[]{baekmukbatang}
    \newfontfamily{\dingbats}[]{zapfdingbats}

Once defined, the "\jp" font switch name can be used
inside a TEX document such as:

    The Japanese word for "today" 
    is {\jp{}今日}.
    
[ Line Breaks For Japanese Characters ]

You will notice that by just choosing a Japanese font for one or more
Japanese characters are not enough to get the current output. Especially,
the line break does not happen as intended for Japanese characters, which
typically do not have blanks inserted between them. This would have been
translated into a situation where a long is just as long as the longest
non-blank cluster of characters. 

Following package is designed to address this problem.
However, by including it it seems to have disrupted all the 
font selections made by "fontspec" package, such that 
the "dingbats" fonts no longer works.

    \usepackage{luatexja}


# Handling Fonts

[ Symbols ]

Symbols are named graphical or typographic elements. They can be divided into
symbol sets, which gives some namespace independence, as well. You can load the
symbol definitions from a symb-bla file with:

    \usesymbols[bla]

Given a symbol Snowman defined in a symbolset Weather Symbols, you could
typeset the symbol with:

    \setupsymbolset [Weather Symbols]
    \symbol [Snowman]

Or, alternatively, you don't need to load the entire symbolset:

    \symbol[Weather Symbols][Snowman]

You can override the existing symbols used at different levels in itemized
lists by redefining the existing symbol numbers, with code like the following:

    \usesymbols[mvs]
    \definesymbol[1][{\symbol[martinvogel 2][PointingHand]}]
    \definesymbol[2][{\symbol[martinvogel 2][CheckedBox]}]
    \startitemize[packed]
    \item item \item item
     \startitemize[packed]
     \item item \item item
     \stopitemize
    \item item
    \stopitemize

Following is an example that defines a green circle for symbol "YES" and a red
circle for symbol "NO".

    \startuniqueMPgraphic{0}
        fill fullcircle scaled 1cm withcolor red ;
    \stopuniqueMPgraphic
    \startuniqueMPgraphic{1}
        fill fullcircle scaled 1cm withcolor green ;
    \stopuniqueMPgraphic
    \starttext
    \definesymbol[YES][\uniqueMPgraphic{1}]
    \definesymbol[NOP][\uniqueMPgraphic{0}]
    \stoptext

Following is an example that creates a symbol set:

    \definefontsynonym [WebDing] [file:webdings.ttf]
    \def\WebDingSymbol{\getnamedglyphdirect{WebDing}}
    \startsymbolset [webding]
    \definesymbol[surf][\WebDingSymbol{surf}]
    \definesymbol[motorcycle][\WebDingSymbol{motorcycle}]
    \definesymbol[mountain][\WebDingSymbol{mountain}]
    \definesymbol[art][\WebDingSymbol{art}]
    \definesymbol[occasion][\WebDingSymbol{occasion}]
    \stopsymbolset
    \starttext
    \tfc
    \symbol[webding][surf]
    \symbol[webding][motorcycle]
    \symbol[webding][mountain]
    \symbol[webding][art]
    \symbol[webding][occasion]
    \stoptext

Note that the name "webding" in calling the \symbol command below 
is due to the fact of the existance of a symbol set that is named "webding"
which is afforded by the calling of \startsymbolset[webding] and \stopsymbolset,
within which all \definesymbol commands called will be considered a symbol within
this symbol set, the result of which is for the user to have to specify the name
of this symbol set before the symbol, such as the following.

    \symbol[webding][surf]

Without the \startsymbolset[webding] and \stopsymbol commands, the same \definesymbol
command would have created a symbol named "surf" such that it can be used
within the main TEX body without the symbol set name, such as the following.

    \symbol[surf]

The ``\definefontsynonum[WebDing][file:webdings.ttf]`` command would have
created a new font named "WebDing" that refers to this font. The
``\getnamedglyphdirect{WebDing}{surf}`` command is useful to get the glyph
named "surf" directly from the font file that is now called "WebDing", or
"webdings.ttf". Thus, the ``\definesymbol[surf][\WebDingSymbol{surf}]``
command can be thought to have been expanded to the following command:

    \definesymbol[surf][\getnamedglyphdirect{WebDing}{surf}]

Note that the string "surf" is a name that is assigned to a specific glyph
within the font file "webdings.ttf". This name is not visible to an average
user without having to look inside the font file itself. One way to do it
is to open the font file "webdings.ttf" using a program such as "fontforge",
which is a free download for Windows, Mac, and Linux. After openning
the "webdings.ttf" file using "fontforge", the name of the glyph can be shown
by clicking a glyph and then look at the info text shown near the top of the 
window.

[ Typescript ]

The typescript environment functions as a container for the font and type definitions therein.

Example

In almost all cases the environment is used like this

    \starttypescript [serif] [myname] [name]
       \definefontsynonym [...]
       ...
    \stoptypescript
    \starttypescript [sans] [myname] [name]
       \definefontsynonym [...]
       ...
    \stoptypescript
    \starttypescript [mono] [myname] [name]
       \definefontsynonym [...]
       ...
    \stoptypescript

immediately followed by

    \starttypescript [myname]
       \definetypeface [myname] [ss] [sans]  [...]
       \definetypeface [myname] [rm] [serif] [...]
       \definetypeface [myname] [tt] [mono]  [...]
    \stoptypescript

and the created definitions are then later used (perhaps in a different file) by:

    \usetypescript [myname]
    \setupbodyfont [myname]

Following is an example:

    $ mtxrun --script fonts --list --all
    dejavusans                         dejavusans       ......   
    dejavusansbold                     dejavusans       ......   
    dejavusansboldoblique              dejavusans       ......   
    dejavusansbook                     dejavusans       ......   
    dejavusanscondensed                dejavusans       ......   
    dejavusanscondensedbold            dejavusans       ......   
    dejavusanscondensedboldoblique     dejavusans       ......   
    dejavusanscondensedoblique         dejavusans       ......   
    dejavusansextralight               dejavusans       ......   
    dejavusansmono                     dejavusansmono   ......   
    dejavusansmonobold                 dejavusansmono   ......   
    dejavusansmonoboldoblique          dejavusansmono   ......   
    dejavusansmonobook                 dejavusansmono   ......   
    dejavusansmononormal               dejavusansmono   ......   
    dejavusansmonooblique              dejavusansmono   ......   
    dejavusansnormal                   dejavusans       ......   
    dejavusansoblique                  dejavusans       ......   
    dejavusanssemi                     dejavusans       ......   
    dejavuserif                        dejavuserif      ......   
    dejavuserifbold                    dejavuserif      ......   
    dejavuserifbolditalic              dejavuserif      ......   
    dejavuserifbook                    dejavuserif      ......   
    dejavuserifcondensed               dejavuserif      ......   
    dejavuserifcondensedbold           dejavuserif      ......   
    dejavuserifcondensedbolditalic     dejavuserif      ......   
    dejavuserifcondenseditalic         dejavuserif      ......   
    dejavuserifitalic                  dejavuserif      ......   
    dejavuserifnormal                  dejavuserif      ......   
    dejavuserifsemi                    dejavuserif      ......   

Given the output of the "mtxrun" run above, we can put following into
the setup area of the TEX file.

    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    % Define first script named [serif][dejavu]
    % Define second script named [sans][dejavu]
    % Define the typeface dejavu; use serif for rm-fonts, sans serif for ss-fonts.
    % Indicate the typeface to use.
    \starttypescript [serif] [dejavu]
      \definefontsynonym [Serif]             [name:dejavuserif]
      \definefontsynonym [SerifBold]         [name:dejavuserif]
      \definefontsynonym [SerifItalic]       [name:dejavuserif]
      \definefontsynonym [SerifSlanted]      [name:dejavuserif]
      \definefontsynonym [SerifBoldItalic]   [name:dejavuserif]
      \definefontsynonym [SerifBoldSlanted]  [name:dejavuserif]
      \definefontsynonym [SerifCaps]         [name:dejavuserif]
    \stoptypescript
    \starttypescript [sans] [dejavu]
      \definefontsynonym [Sans]             [name:dejavuserif]
      \definefontsynonym [SansBold]         [name:dejavuserif]
      \definefontsynonym [SansItalic]       [name:dejavuserif]
      \definefontsynonym [SansSlanted]      [name:dejavuserif]
      \definefontsynonym [SansBoldItalic]   [name:dejavuserif]
      \definefontsynonym [SansBoldSlanted]  [name:dejavuserif]
      \definefontsynonym [SansCaps]         [name:dejavuserif]
    \stoptypescript
    \starttypescript [mono] [dejavu]
      \definefontsynonym [Sans]             [name:dejavuserif]
      \definefontsynonym [SansBold]         [name:dejavuserif]
      \definefontsynonym [SansItalic]       [name:dejavuserif]
      \definefontsynonym [SansSlanted]      [name:dejavuserif]
      \definefontsynonym [SansBoldItalic]   [name:dejavuserif]
      \definefontsynonym [SansBoldSlanted]  [name:dejavuserif]
      \definefontsynonym [SansCaps]         [name:dejavuserif]
    \stoptypescript
    \definetypeface[mydejavu][rm][serif][dejavu]
    \definetypeface[mydejavu][ss][sans][dejavu]
    \definetypeface[mydejavu][tt][mono][dejavu]
    \usetypescript[mydejavu][uc]
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


The first script is named ``[serif][dejavu]``. The second script is named
``[sans][dejavu]``, and the third script is named ``[mono][dejavu]``. 
Each script defines the choices of fonts to be used for each of the
font styles, such as the font to use when the style is italic, bold,
or bold and italic, each of which could be a font that is defined in 
a different font file.

In our example we have made it clear such that all font family choices such as
``\rm``, ``\ss``, or ``\tt`` and all font style choices within each font
family is going to come from the same "dejavuserif" font.  This design is
delibrately chosen and suitable in a situation to show a  glyph that serves as
a symbol where it makes sense such that this glyph is always to look the same
regardless of the choice of the typeface and styles of the surrounding text.
This also takes the issue where a particular glyph is found to be defined in
one style, such as normal but not in italic or bold.

The \definetypeface command is designed to creates a new name that would
serve as a name for a collection of typefaces. For instance, 
the name "myfree" is created to serve as the name for serif, sans, and
mono typeface coming from the font "free". 
It does it by allowing the name "myfree" as the first argument.
The second argument is one of the following: "rm", "ss", 
or "tt". The third and fourth arguments are names of a individual typescript.
Note that each typescript is identified by two names that are the 
first and second argument of the \starttypescript command.

The fifth argument to \definetypeface specifies specific font size setups (if
any), these will be covered in the reference manual. Almost always, specifying
default will suffice.

The optional sixth argument is used for tweaking font settings like the
specification of font features or adjusting parameters. In this case, the two
modern font sets are loaded with a small magnification, this evens out the
visual heights of the font styles.

Once defined, the name "myfree" becomes a "bodyfont" that can be used
inside the \setupbodyfont and \switchtobodyfont commands.

As an alternative to calling \definetypeface, which is to associate a "bodyfont"
name with a typescript, CONTEXT also has provided a
command called \definefontfamily. This command is similar to \definetypeface
except that its second argument is a name such as "serif", "sans", or "mono" to 
express the typeface. Its third argument is the name of an exsiting font
that is typically the second column of the output of the "mtxrun" program.

    \definefontfamily[mydejavu][serif][dejavuserif]
    \definefontfamily[mydejavu][sans][dejavusans]
    \definefontfamily[mydejavu][mono][dejavusansmono]

One advantage of using \definefontfamily is that CONTEXT will automatically
recognize the "right" choice of a font for a font style such as italic or
bold. For instance, if the current typeface is serif, and the name of font is
specified as "dejavuserif", then it will switch to using the "dejavuserifbold"
font for a bold text because it knows that this font is the right choice. 
This command also seems to be smart enough to stay with the same font if a
specific font style font is not found.

[ Switching Fonts ]

Setting up the main font for the entire document is done by calling the
\setupbodyfont command in the setup area. This command expects a single
argument, which is a list of features of this font, including the "bodyfont"
name, the typeface, and size. 

    \setupbodyfont[mydejavu]

The name of the "bodyfont" is the string given to the  first argument to the
\definetypeface command, or the string that is the first argument  to the
\definefontfamily command. By default, when the command is invoked as
``\setupbodyfont[mydejavu]``, it assumes the "serif" typeface that is
associated with the bodyfont "mydejavu". If the same command is invoked as
``\setupbodyfont[mydejavu,sans]`` then it assumes the "sans" typeface of the
"mydejavu" bodyfont. Similarly, for a teletype typeface it will have  to be
``\setupbodyfont[mydejavu,mono]``. The same command could also include the
font size information. For instance to set the 10pt sans font for the main
body following command can be used.

    \setupbodyfont[mydejavu,sans,10pt]

Similarly, the \switchtobodyfont command is to provide a temporary switch to a
different "bodyfont" for a part of a main text. It expects a single argument
which is in the same form as that of the \setupbodyfont.

    {\switchtobodyfont[mydejavu,sans,10pt]Hello}



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



