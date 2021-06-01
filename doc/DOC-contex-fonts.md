---
title: Fonts
camer.setupbodyfont: linux,11pt
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
except that its second argument is a name such as "serif", "sans", "mono",
or "math" rather than "rm", "ss", and "tt" for expressing a typeface. 
Its third argument is the name of an exsiting font
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

Instead of supplying the name that is observed by looking at the output of a
"mtxrun" program run, a more descriptive name such as "Time New Roman",  or
"Arial" can also be used intead. Not sure where one can go about finding a
list of such names, but the program ``luaotfload-tool`` seems to generate a
list of fonts where the name of the font is more description---a uppercase and
lowercase mixed names, rather than all-lowercase ones reported by the "mtxrun"
program. Following are examples of running this command, copied from the file
named "font-sel.mkvi" that is located in
"/usr/local/texlive/2021/texmf-dist/tex/context/base/mkiv".

    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    \definefontfamily [dejavu] [serif] [DejaVu Serif]
    \definefontfamily [dejavu] [sans]  [DejaVu Sans]
    \definefontfamily [dejavu] [mono]  [DejaVu Sans Mono]
    \definefontfamily [dejavu] [math]  [XITS Math] [rscale=1.1]
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    \definefontfamily [office] [serif] [Times New Roman]
    \definefontfamily [office] [sans]  [Arial] [rscale=0.9]
    \definefontfamily [office] [mono]  [Courier]
    \definefontfamily [office] [math]  [TeX Gyre Termes Math]
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    \definefontfamily [linux] [serif] [Linux Libertine O]
    \definefontfamily [linux] [sans]  [Linux Biolinum O]
    \definefontfamily [linux] [mono]  [Latin Modern Mono]
    \definefontfamily [linux] [math]  [TeX Gyre Pagella Math] [rscale=0.9]


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

[ CJK Fonts ]

Fonts that are designed to provide glyphs of CJK characters are typically only
designed to provide glyphs for some characters in the Unicode block named "CJK
Unified Ideographs U+4E00 - U+9FFF". This block serves as a place that holds
most commonly used characters that are traditional Chinese, simplied Chinese,
or Japanese kanji. Thus, some of the characters there could be found to exist
exclusitively as a Japanese kanji, while others might appear in both traditional
and simplified Chinese. Some glyphs might appear in all three languages. 

In addition, fonts that are designed to work with a particular script might
also choose to provide glyphs that are punctuations. These punctuations glyphs
could be found to have been scattered in several different Unicode blocks.
Following is an example of creating new "bodyfont" names that are "cn"
(Simplified Chinese), "tw" (Traditional Chinese), "jp" (Japanese kanji), and
"kr" (Korean Hangul). Each name is associated with a font that is known to
have supplied glyphs for that language. All the fonts are freely
provided for by TexLive distribution as of 2021.

    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    \definefontfamily[cn][serif][arplsungtilgb]
    \definefontfamily[cn][sans][arplsungtilgb]
    \definefontfamily[cn][mono][arplsungtilgb]
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    \definefontfamily[tw][serif][arplmingti2lbig5]
    \definefontfamily[tw][sans][arplmingti2lbig5]
    \definefontfamily[tw][mono][arplmingti2lbig5]
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    \definefontfamily[jp][serif][ipaexmincho]
    \definefontfamily[jp][sans][ipaexmincho]
    \definefontfamily[jp][mono][ipaexmincho]
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    \definefontfamily[kr][serif][baekmukbatang]
    \definefontfamily[kr][sans][baekmukbatang]
    \definefontfamily[kr][mono][baekmukbatang]

# Dynamics

Sometimes you want to enable or disable a specific feature only for a specific
span of text. Defining a font for only this occasion is overkill, especially
when for instance features are used to fine-tune the typography as happens in
the Oriental TEX project, which is related to LuaTEX. Instead of defining yet
another font instance we can therefore enable and disable specific features.
For this it is not needed to know the current font and its size.

Dynamics are a special case of node mode and you don’t need to set it up when
defining a font. In fact, a font defined in base mode can also be dynamic. We
show some simple  examples of applying dynamic features.

Let’s first define some feature sets:

    \definefontfeature[f:smallcaps][smcp=yes]
    \definefontfeature[f:nocaps]   [smcp=no]
    \definefontfeature[f:oldstyle] [onum=yes]
    \definefontfeature[f:newstyle] [onum=no]

We can add and subtract these features from the current feature set that is
bound to the current font. 
The output is shown in figure &ref{fig:image-fonts-1}-(a)

    \switchtobodyfont[pagella]    123 normal
    \addfeature     {f:oldstyle}  123 oldstyle
    \addfeature     {f:smallcaps} 123 olstyle smallcaps
    \subtractfeature{f:oldstyle}  123 smallcaps
    \subtractfeature{f:smallcaps} 123 normal

@ figure{subfigure}
  &label{fig:image-fonts-1}
  Two outputs of using \addfeature and \subtractfeature commands.

    ```img{frame,width:80%}
    image image-fonts-1.png

    \\

    ```img{frame,width:80%}
    image image-fonts-2.png
    ```

The following does the same, but only uses addition. 
The output is shown in figure &ref{fig:image-fonts-1}-(b)

    \switchtobodyfont[pagella] 123 normal
    \addfeature{f:oldstyle}    123 oldstyle
    \addfeature{f:smallcaps}   123 olstyle smallcaps
    \addfeature{f:newstyle}    123 smallcaps
    \addfeature{f:nocaps}      123 normal

You can also completely replace a feature set. Of course the set is only
forgotten inside the current group.

    \switchtobodyfont[pagella]   123 normal
    \addfeature    {f:oldstyle}  123 oldstyle
    \addfeature    {f:smallcaps} 123 olstyle smallcaps
    \replacefeature{f:oldstyle}  123 oldstyle
    \replacefeature{f:smallcaps} 123 smallcaps

You can exercise some control with \resetfeature: 

    \switchtobodyfont[pagella] 123 normal
    \addfeature    [f:oldstyle]  123 oldstyle
    \addfeature    [f:smallcaps] 123 olstyle smallcaps
    \resetfeature                123 reset
    \addfeature    [f:oldstyle]  123 oldstyle
    \addfeature    [f:smallcaps] 123 olstyle smallcaps

Note that in the last example we have switched to using left-right-brackets
intead of left-right-braces for presenting command arguments.  Commands with
braced and bracketed variants are designed to behave the same. There is also a
generic command \feature that takes two arguments. Below we show all calls,
with long and short variants:

    \addfeature
    \subtractfeature
    \replacefeature
    \resetandaddfeature[f:mine] \feature[local][f:mine] \feature[!][f:mine]
    \revivefeature     [f:mine] \feature  [old][f:mine] \feature[>][f:mine]
    \resetfeature               \feature[reset]         \feature[<]

The \feature command can also be made to accept arguments that are surrounded
by braces instead of brackets. As a bonus, the following also works:

    \switchtobodyfont[pagella]
    123 normal
    \feature[+][f:smallcaps,f:oldstyle]
    123 SmallCaps and OldStyle



# Descretionaries

One of the complications in supporting more complex features is that we can
have  discretionary nodes. These are either inserted by the hyphenation
engine, or explicitly by the user (directly or via macros). In most cases we
don’t need to bother about this. For in- stance, more demanding scripts like
Arabic don’t hyphenate, languages using the Latin script seldom want ligatures
at hyphenation points (as they can be compound words) and/or avoid confusing
hyphenation points, so what is left are specific user inserted dis-
cretionaries. Add to that, that a proper font has not much kerning between
lowercase characters and it will be clear that we can ignore most of this.
Anyway, as we explicitly deal with user discretionaries, the next works out
okay. Watch how we normally only have something special in the replacements
text that shows up when no hyphenation is needed. The output is shown
by figure &ref{fig:fonts-3}.

    \language[nl]
    \definedfont[file:texgyrepagella-regular.otf*default]
    \hsize  1mm vereffenen \par
    \hsize  1mm effe \par
    \hsize  1mm e\discretionary{f-}{f}{ff}e \par
    \hsize 20mm e\discretionary{f-}{f}{ff}e \par
    \smallcaps
    \hsize  1mm vereffenen \par
    \hsize  1mm effe \par
    \hsize  1mm e\discretionary{f-}{f}{ff}e \par
    \hsize 20mm e\discretionary{f-}{f}{ff}e \par

@ figure
  &label{fig:fonts-3}
  The output of uisng descretionaries.

  ```img{frame,width:80%}
  image image-fonts-3.png
  ```

In base mode such things are handled by the TEX engine itself and it can deal
with pretty complex cases. In node mode we use a simplification which in
practice suffices. We will come back to this in section 5.2.12.



# Efficiency

The efficiency of the mechanisms described here depends on several factors. It
will be clear that the larger the font, the more time it will take to load it.
But what is large? Most cjk fonts are pretty large but also rather simple. A
font like Zapfino on the other hand covers only latin but comes with many
alternative shapes and a large set of rules. The Husayni font focusses on
Arabic, which in itself has not that large an alphabet, but being an advanced
script font, it has a lot of features and definitely a lot of rules.

In terms of processing it’s safe to say that Latin is of average complexity.
At most you will get some substitutions, like regular numerals being replaced
by oldstyles, or ligature building, which involves a bit of analysis, and some
kerning at the end. In base mode the substitutions have no overhead, simply
because the character table already has references to the substituents and the
replacement already takes place when defining the font. There ligature
building and kerning are also fast because of the limited amount of lookups
that also are already kept with the characters. In node mode however, the
lists have to be parsed and tables have to be consulted so even Latin
processing has some overhead: each glyph node is consulted and analyzed
(either or not in its context), often multiple times. However, the code is
rather optimized and we use caching of already analyzed data when possible.

A cjk script is somewhat more complex on the one hand, but pretty simple on
the other. Instead of font based kerning, we need to prevent or encourage
breaks between certain characters. This information is not in the font and is
processed otherwise but it does cost some time. The font part however is
largely idle as there are no features to be applied. Even better, because the
glyphs are large and the information density is high, the processing time per
page is not much different from Latin. Base mode is good enough for most cjk.

The Arabic script is another matter. There we definitely go beyond what base
mode offers so we always end up in node mode. Also, because there is some
analysis involved, quite some substitutions and in the end also positioning,
these are the least efficient fonts in terms of processing time. Of course the
fact that we mix directions also plays a role. If in the Husayni font you
enable 30 features with an average of 5 rules per feature, a 300 character
paragraph will take 45.000 actions.5 When multiple fonts are combined in a
paragraph there will be more sweeps over the list and of course the
replacements also have to happen.

In a time when the average photo camera produces megabyte pictures it makes no
sense to whine about the size of a font file. On the other hand as each font
eventually ends up in memory as a Lua table, it makes sense to optimize that
bit. This is why fonts are converted into a more efficient intermediate table
that is cached on disk. This makes loading a font quite fast and due to shared
tables memory usage rather efficient. Of course a scaled instance has to be
generated too, but that is acceptable. To some extent loading and defining a
font also depends on the way the macro package is set up.

When comparing LuaTEX with for instance pdfTEX or XƎTEX you need to take into
account that in ConTEXt MkIV we tend to use OpenType fonts only so there are
less fonts loaded than in a more traditional setup. In ConTEXt startup time of
MkIV is less than MkII although overall processing time is slower, which is
due to Unicode being used and more functionality being provided. On the other
hand, immediate MetaPost processing and more clever multipass handling wins
back time. The impact of fonts on processing time in a regular document is
therefore not that impressive. In practice a MkIV run can be faster than a
MkII run, especially when MetaPost is used.

In ConTEXt processing of node lists with respect to fonts is only one of the
many manipulations of such lists and by now fonts are not really the
bottleneck. The more not font related features users demand and enable, the
less the relative impact of font processing becomes.

Also, there are some advanced typographic extras that LuaTEX offers, like
protrusion (think of hanging punctuation) and hz optimization (glyph scaling)
and these slow down processing quite a lot, and they are not taking place at
the Lua end at all, but this might change in MkIV. And, of course, typesetting
involves more than fonts and other aspects can be way more demanding.



# Introduction

In traditional TEX a font is defined by referring to its filename. A
definition looks like this:

    \font \MyFontA = lmr10
    \font \MyFontB = lmr10 at 20pt
    \font \MyFontC = lmr10 scaled 1500

The first definition defines the command MyFontA as a reference to the font
stored in the file lmx10. No scaling takes place so the natural size is taken.
This so called designsize is in no way standardized. Just look at these three
specimen:

```img{frame}
image image-fonts-4.png
```

The designsize is normally 10 point, but as there is no real reference for
this a designer decides how to translate this into a visual representation. As
a consequence the 20pt in the second line of the example definitions only
means that the font is scaled to (normally) twice the designsize. The third
line scaled by a factor 1.5 and the reason for using a value thousand times
larger is that TEX’s numbers are integers.

The next three lines are typical for Latin Modern (derived from Computer
Modern) because this family comes in different design sizes.

    \font \MyFontD = lmr12
    \font \MyFontE = lmr12 at 20pt
    \font \MyFontF = lmr12 scaled 1500

Because the designsize is part of the font metrics the second line (\MyFontE)
is of similar size as \MyFontB although the 12 point variant is visually
better suited for scaling up.

These definitions refer to files, but what file? What gets loaded is the file
with name "name.tfm". Eventually for embedding in the (let’s assume pdf) file
the outlines are taken from "name.pfb". At that stage, when present, a "name.vf"
is consulted in order to resolve characters that are combinations of others
(potentially from other pfb files). The mapping from "name.tfm" to "name.pfb"
filename happens in the so called map file. This means that one can also refer
to another file, for instance "name.ttf".

All this logic is hard coded in the engine and because the virtual font
mechanism was introduced later without extending the tfm format, it can be
hard at times to figure out issues when a (maybe obsolete) virtual file is
present (this can be the case if you have generated the tfm file from an afm
file that comes with the pfb file when you buy one. But, in LuaTEX we no
longer use traditional fonts and as a consequence we have more options open.
Before we move on to them, we mention yet another definition:

    \font \MyFontG = lmr12 sa 1.2

This method is not part of TEX but is provided by ConTEXt, MkII as well as
MkIV. It means as much as “scale this font to 1.2 times the bodyfontsize”. As
this involves parsing the specification, it does not work as advertised here,
but the next definition works okay:

    \definefont[MyFontG][lmr12 sa 1.2]

This indicates that we already had a parser for font specifications on board
which in turn made it relatively easy to do even more parsing, for instance
for font features as introduced in XeTEX and LuaTEX.



# Specifications

In LuaTEX we intercept the font loader. We do so for several reasons.

- We want to make decisions on what file to load, this is needed when 
  for instance there are files with the same name but different properties.
- We want to be able to lookup by file, by name, and by more abstract 
  specification. In doing so, we want to be as tolerant as possible.
- We want to support several scaling methods, as discussed in the 
  previous section.
- We want to implement several strategies for passing features and 
  defining non standard approaches.

The formal specification of a font is as follows:

    \definefont[PublicReference][filename]
    \definefont[PublicReference][filename at dimension]
    \definefont[PublicReference][filename scaled number]

We already had that extended to:

    \definefont[PublicReference][filename]
    \definefont[PublicReference][filename at dimension]
    \definefont[PublicReference][filename scaled number]
    \definefont[PublicReference][filename sa number]

So let’s generalize that to:

    \definefont[PublicReference][filename scaling]

And in MkIV we now have:

    \definefont[PublicReference][filename*featurenames scaling]
    \definefont[PublicReference][filename:featurespecication scaling]
    \definefont[PublicReference][filename@virtualconstructor scaling]

The second variant is seldom used and is only provided because some users have
fonts defined in the XeTEX way. Users are advised not to use this method. The
last method is special in the sense that it’s used to define fonts that are
constructed using the built in virtual font constructors. This method is for
instance used for defining virtual math fonts.

The first method is what we use most. It is really important not to forget the
feature specification. A rather safe bet is ``*default``. In a next chapter we
will discuss the difference between these two; here we focus on the name part.

The filename is in fact a symbolic name. In ConTEXt we have always used an
indirect reference to fonts. Look at this:

    \definefont[TitleFont][SerifBold*default sa 2]

A reference like SerifBold makes it possible to define styles independent of
the chosen font family. This reference eventually gets resolved to a real name
and there can be a chain of references.

Font definitions can be grouped into a larger setup using typescripts. In that
case, we can set the features for a regular, italic, bold and bolditalic for
the whole set but when a fontname has a specific feature associated (as in the
previous examples) that one takes precedence.

So far we talked about fonts being files, but in practice a lookup happens by
file as well as by name as known to the system. In the next section this will
be explained in more detail.



# File

You can force a file lookup with:
    
    \definefont[TitleFont][file:somefilename*default sa 2]

If you use more symbolic names you can use the file: prefix in the mapping:

    \definefontsynonym[SerifBold][file:somefile]
    \definefont[TitleFont][SerifBold*default sa 2]

In projects that are supposed to run for a long time I always use the file
based lookup, because filenames tend to be rather stable. Also, as the lookup
happens in the TEX directory structure, file lookups will rely on the general
file search routines. This has the benefit that case is ignored. When no match
is found the lookup will also use the font name database. Spaces and special
characters are ignored.

The name alone is not enough as there can be similar filenames with different
suffixes. Therefore the lookup will happen in the order otf, ttf, afm, tfm and
lua. You can force a lookup by being more explicit, like:

    \definefont[TitleFont][file:somefilename.ttf*default sa 1]



# Name

Say that we want to use a Dejavu font and that instead of filenames we want to
use its given name. The best way to find out what is available is to call for
a list:

    mtxrun --script font --list --all dejavu

This produces the following list shown in figure &ref{fig:fonts-4}

@ figure
  &label{fig:fonts-4}
  The output of the "mtxrun" command.

  ```ink{frame,width:100%,framewidth:800}
  dejavusans                       dejavusans          dejavusans                       DejaVuSans.ttf
  dejavusansbold                   dejavusans          dejavusansbold                   DejaVuSans-Bold.ttf
  dejavusansboldoblique            dejavusans          dejavusansboldoblique            DejaVuSans-BoldOblique.ttf
  dejavusansbook                   dejavusans          dejavusans                       DejaVuSans.ttf
  dejavusanscondensed              dejavusans          dejavusanscondensed              DejaVuSansCondensed.ttf
  dejavusanscondensedbold          dejavusans          dejavusanscondensedbold          DejaVuSansCondensed-Bold.ttf
  dejavusanscondensedboldoblique   dejavusans          dejavusanscondensedboldoblique   DejaVuSansCondensed-BoldOblique.ttf
  dejavusanscondensedoblique       dejavusans          dejavusanscondensedoblique       DejaVuSansCondensed-Oblique.ttf
  dejavusansextralight             dejavusans          dejavusansextralight             DejaVuSans-ExtraLight.ttf
  dejavusansmono                   dejavusansmono      dejavusansmono                   DejaVuSansMono.ttf
  dejavusansmonobold               dejavusansmono      dejavusansmonobold               DejaVuSansMono-Bold.ttf
  dejavusansmonoboldoblique        dejavusansmono      dejavusansmonoboldoblique        DejaVuSansMono-BoldOblique.ttf
  dejavusansmonobook               dejavusansmono      dejavusansmono                   DejaVuSansMono.ttf
  dejavusansmononormal             dejavusansmono      dejavusansmonooblique            DejaVuSansMono-Oblique.ttf
  dejavusansmonooblique            dejavusansmono      dejavusansmonooblique            DejaVuSansMono-Oblique.ttf
  dejavusansnormal                 dejavusans          dejavusansoblique                DejaVuSans-Oblique.ttf
  dejavusansoblique                dejavusans          dejavusansoblique                DejaVuSans-Oblique.ttf
  dejavusanssemi                   dejavusans          dejavusanscondensedoblique       DejaVuSansCondensed-Oblique.ttf
  dejavuserif                      dejavuserif         dejavuserif                      DejaVuSerif.ttf
  dejavuserifbold                  dejavuserif         dejavuserifbold                  DejaVuSerif-Bold.ttf
  dejavuserifbolditalic            dejavuserif         dejavuserifbolditalic            DejaVuSerif-BoldItalic.ttf
  dejavuserifbook                  dejavuserif         dejavuserif                      DejaVuSerif.ttf
  dejavuserifcondensed             dejavuserif         dejavuserifcondensed             DejaVuSerifCondensed.ttf
  dejavuserifcondensedbold         dejavuserif         dejavuserifcondensedbold         DejaVuSerifCondensed-Bold.ttf
  dejavuserifcondensedbolditalic   dejavuserif         dejavuserifcondensedbolditalic   DejaVuSerifCondensed-BoldItalic.ttf
  dejavuserifcondenseditalic       dejavuserif         dejavuserifcondenseditalic       DejaVuSerifCondensed-Italic.ttf
  dejavuserifitalic                dejavuserif         dejavuserifitalic                DejaVuSerif-Italic.ttf
  dejavuserifnormal                dejavuserif         dejavuserifitalic                DejaVuSerif-Italic.ttf
  dejavuserifsemi                  dejavuserif         dejavuserifcondenseditalic       DejaVuSerifCondensed-Italic.ttf
  texgyredejavumath                texgyredejavumath   texgyredejavumathregular         texgyredejavu-math.otf
  texgyredejavumathnormal          texgyredejavumath   texgyredejavumathregular         texgyredejavu-math.otf
  texgyredejavumathregular         texgyredejavumath   texgyredejavumathregular         texgyredejavu-math.otf
  ```

The first column is the "identifier" column. The second is the "familyname"
column. The third column is named "fontname", and the fourth column is named
"filename". The first two columns mention the names that we can use to access
a font. These are normalized names in the sense that we only kept letters and
numbers. The \definefont command can be invoked to 
create a "bodyfont" name that would refer to one of the 
fonts reported by the "mtxrun" program. 
In particular, the next three invocatios of the 
\definefont are equivalent and would have all created the
bodyfont name "TitleFont" that points to the same font 
installed in the system by the file "dejavuserif.ttf", and
reported both as identifier "dejavuserif" and "dejavuserifnormal".

    \definefont[TitleFont][name:dejavuserif*default sa 1]
    \definefont[TitleFont][name:dejavuserifnormal*default sa 1]
    \definefont[TitleFont][name:dejavuserif.ttf*default sa 1]

In this case there are two names that all point to 
the file named ``dejavuserif.ttf``: 

    dejavuserif
    dejavuserifnormal

There are some heuristics built into ConTEXt and we do some cleanup as well.
For instance we interpret ital as italic. In a font there is sometimes
information about the weight and we look at those properties as well.
Unfortunately font names (even within a collection) are often rather
inconsistent so you still need to know what you’re looking for. The more
explicit you are, the less change of problems.



# Spec

There is often some logic in naming fonts but it’s not robust and really depends on how consistent a font designer or typefoundry has been. In ConTEXt we can access names by using a normalized scheme.

    name-weight-style-width-variant

The following values are valid:

+ weight
  black bold demi demibold extrabold heavy 
  light medium mediumbold normal regular semi 
  semibold ultra ultrabold ultralight
+ style
  italic normal oblique regular reverseitalic reverseoblique roman slanted
+ width
  book condensed expanded normal thin
+ variant
  normal oldstyle smallcaps

The four specifiers are optional but the more you provide, the better the
match. Let’s give an example:

    mtxrun --script fonts --list --spec dejavu

@ figure
  &label{fig:fonts-5}
  The output of the "mtxrun" command with the ``--spec`` switch
  and the font named "dejavu" with no additional information
  regarding weight, style, width, and variant.

  ```ink{frame,width:100%,framewidth:800}
  familyname       weight   style    width    variant   fontname         filename
  dejavuserif      normal   normal   normal   normal    dejavuserif      DejaVuSerif.ttf
  dejavusansmono   normal   normal   normal   normal    dejavusansmono   DejaVuSansMono.ttf
  dejavusans       normal   normal   normal   normal    dejavusans       DejaVuSans.ttf
  ```

We can be more specific, for instance, the following example
would have asked for font "dejavu-bold". The string "dejavu-bold"
would have been considered as asking for a font named "dejavu" and
the "weight" of which is "bold". The result of the following command
is shown by figure &ref{fig:fonts-6}.

    mtxrun --script fonts --list --spec dejavu-bold

@ figure
  &label{fig:fonts-6}
  The output of the "mtxrun" command with the ``--spec`` switch and with 
  font "dejavu-bold", which expressed a font named "dejavu" and of
  weight "bold".

  ```ink{frame,width:100%,framewidth:800}
  familyname       weight   style    width    variant   fontname                   filename
  dejavuserif      bold     normal   normal   normal    dejavuserifbold            DejaVuSerif-Bold.ttf
  dejavuserif      bold     normal   normal   normal    dejavuserifcondensedbold   DejaVuSerifCondensed-Bold.ttf
  dejavusansmono   bold     normal   normal   normal    dejavusansmonobold         DejaVuSansMono-Bold.ttf
  dejavusans       bold     normal   normal   normal    dejavusansbold             DejaVuSans-Bold.ttf
  dejavusans       bold     normal   normal   normal    dejavusanscondensedbold    DejaVuSansCondensed-Bold.ttf
  ```
 
If the query is going to include also "italic" which is the font style
then the result is going to include that as well. Following command
will generate a result that is shown by figure &ref{fig:fonts-7}.

@ figure
  &label{fig:fonts-7}
  The output of the "mtxrun" command with the ``--spec`` switch and with 
  font "dejavu-bold", which expressed a font named "dejavu" and of
  weight "bold" and style "italic".

  ```ink{frame,width:100%,framewidth:800}
  dejavuserif      bold     italic   normal   normal    dejavuserifbolditalic       DejaVuSerif-BoldItalic.ttf
  dejavusansmono   bold     italic   normal   normal    dejavusansmonoboldoblique   DejaVuSansMono-BoldOblique.ttf
  dejavusans       bold     italic   normal   normal    dejavusansboldoblique       DejaVuSans-BoldOblique.ttf
  ```

As the first hit is used we need to be more specific with respect to the name,
so lets do that in an example definition:

    \definefont[TitleFont][spec:dejavuserif-bold-italic*default sa 1]

Watch the prefix ``spec``. Wolfgang Schusters ``simplefonts`` module nowadays uses
this method to define sets of fonts based on a name only specification. Of
course that works best if a fontset has well defined properties.

In short, the \definefont command has the following forms:

    \definefont
      [MyFont]
      [namepart method specification size]

For example:

    \definefont
      [MyFont]
      [Bold*default at 12.3pt]

We have already discussed the "namepart" and "size" in a previous chapter and
here we will focus on the method. The method is represented by a character and
although we currently only have a few methods there can be many more.

This one is seldom used, but those coming from another macro package to
ConTEXt might use it as first attempt to defining a font.

    \definefont
      [MyFont]
      [Bold:+kern;+liga; at 12.3pt]

This is the XeTEX way of defining fonts. A + means as much as “turn on this
feature” so you can guess what the minus sign does. Alternatively you can use
a key/value approach with semicolons as separator. If no value is given the
value yes is assumed.

    \definefont
      [MyFont]
      [Bold:kern=yes;liga=yes; at 12.3pt]

When we started supporting XeTEX we ran into issues with already present
features of ConTEXt as the XeTEX syntax also has some more obscure properties
using slashes and brackets for signalling a file or name lookup. As in ConTEXt
we prefer a more symbolic approach anyway, it never was a real issue.

[ The feature-sets method ]

The most natural way to associate a set of feature-set with a font instance.
For instance, the feature named "default" is associated with this
font in addition to set as being "Bold".

    \definefont
      [MyFont]
      [Bold*default at 12.3pt]

The feature-set that is named "default" is defined in
``font-pre.mkiv`` as follows.

    \definefontfeature
      [default]
      [always]
      [liga=yes,
       tlig=yes,
       trep=yes] % texligatures=yes,texquotes=yes

The same ``font-pre.mkiv`` file also provides the following
similar definitions for other feature-sets names.

    \definefontfeature
      [always]
      [mode=auto,
       script=auto,
       kern=yes,
       mark=yes,
       mkmk=yes,
       curs=yes]

    \definefontfeature
      [smallcaps]
      [always]
      [smcp=yes,
       tlig=yes,
       trep=yes] % texligatures=yes,texquotes=yes

    \definefontfeature
      [oldstyle]
      [always]
      [onum=yes,
       liga=yes,
       tlig=yes,
       trep=yes] % texligatures=yes,texquotes=yes

    \definefontfeature % == default unless redefined
      [ligatures]
      [always]
      [liga=yes,
       tlig=yes,
       trep=yes]

    \definefontfeature % can be used for type1 fonts
      [complete]
      [always]
      [compose=yes,
       liga=yes,
       tlig=yes,
       trep=yes]

    \definefontfeature
      [none]
      [mode=none,
       features=no]

The previous definitions have also shown that it is possible to create 
a new feature-set that grows from an existing
feature-set.
However, do keep in mind that if a feature set is applied to a font,
and later on the feature is changed, the new change will be effective for
new fonts that have been applied this feature-set; old font names
will not be affected. 

In addition, two or more feature-sets can be specified, which
is illustrated by an example that is follows, is to be applied
with the feature-set of "always" and "oldstyle".

    \definefont
      [MyFont]
      [Bold*always,oldstyle at 12.3pt]

[ The virtual features method ]

This method is somewhat special as it demands knowledge of the internals of
the Con- TEXt font code. Much of it is still experimental but it is a nice
playground. A good example of its usage can be found in the file m-punk.mkiv
where we create a font out of MetaPost graphics.

Another example is virtual math. As in the beginning of LuaTEX and MkIV there
were only a few OpenType math fonts, and as I wanted to get rid of the old
mechanisms, it was decided to virtualize the math fonts. For instance a Latin
Modern Roman 10 point math font can be defined as follows:

    \definefontsynonym
      [LMMathRoman10-Regular]
      [LMMath10-Regular@lmroman10-math]

The name ``lmroman10-math`` is considered a virtual feature-set which 
refers to a virtual definition and in this case, it is one
using a built-in constructor and therefore we use a goodies file
to specify the font. That file looks like the following:

    return {
      name = "lm-math",
      version = "1.00",
      comment = "Goodies that complement latin modern math.",
      author = "Hans Hagen",
      copyright = "ConTeXt development team",
      mathematics = {
        ...
        virtuals = {
          ...
          ["lmroman10-math"] = ten,
          ...
        },
        ... }
      }
    }


Here ten is a previously defined table:

    local ten = {
      { name = "lmroman10-regular.otf", features = "virtualmath", main = true },
      { name = "rm-lmr10.tfm", vector = "tex-mr-missing" } ,
      { name = "lmmi10.tfm", vector = "tex-mi", skewchar = 0x7F },
      { name = "lmmi10.tfm", vector = "tex-it", skewchar = 0x7F },
      { name = "lmsy10.tfm", vector = "tex-sy", skewchar = 0x30, parameters = true } , 
      { name = "lmex10.tfm", vector = "tex-ex", extension = true } ,
      { name = "msam10.tfm", vector = "tex-ma" },
      { name = "msbm10.tfm", vector = "tex-mb" },
      { name = "stmary10.afm", vector = "tex-mc" },
      { name = "lmroman10-bold.otf", vector = "tex-bf" } ,
      { name = "lmmib10.tfm", vector = "tex-bi", skewchar = 0x7F } ,
      { name = "lmsans10-regular.otf", vector = "tex-ss", optional =
      { name = "lmmono10-regular.otf", vector = "tex-tt", optional =
      { name = "eufm10.tfm", vector = "tex-fraktur", optional = true
      { name = "eufb10.tfm", vector = "tex-fraktur-bold", optional =
    }

This says as much as: take lmroman10-regular.otf as starting point and
overload slots with ones found in the following fonts. The vectors are
predefined as they are shared with other font sets like px and tx.

In due time more virtual methods might end up in ConTEXt because they are a
convenient way to extend or manipulate fonts.



# The Mechanism

Font switching is one of the eldest features of ConTEXt because font switching
is indispensable in a macropackage. The last few years extensions to the font
switching mechanism were inevitable. We have chosen the following starting
points during the development of this mechanism:

- To change a style must be easy, this means switching to: roman (serif,
  regular), sans serif (support), teletype (or monospaced) etc. (\rm, \ss, \tt
  etc.)
- More than one variations of character must be available like slanted and bold
  (\sl and \bf).
- Different font families like Computer Modern Roman and Lucida Bright must be
  supported.
- Changing the bodyfont must also be easy, and so font size between 8pt and
  12pt must be available by default.
- Within a font different sub-- and superscripts must be available. The script
  sizes can be used during switching of family, style and alternative.
- Specific characteristics of a body font like font definition (encoding
  vector) must be taken into account.

Text can be typeset in different font sizes. We often use the unit pt to
specify the size. The availability of these font sizes are defined in
definition files. Traditionally font designers used to design a glyph
collection for each font size, but nowadays most fonts have a design size of 10
points. An exception to this rule is the Computer Modern Roman that comes with
most TEX distributions.

The most frequently used font sizes are predefined: 8, 9, 10, 11, 12 and 14.4
points. When you use another size —for example for a titlepage— ConTEXt will
define this font itself within the constraints of the used typeface. ConTEXt
works with a precision of 1 digit which prevents unnecessary loading of
fontsizes with small size differences. When a fontsize is not available ConTEXt
prefers to use a somewhat smaller font size. We consider this to be more
tolerable than a somewhat bigger font size.

The bodyfont (main font), font style and size is set up with:

    \setupbodyfont[..,...,..]
    ...  name serif regular roman sans support sansserif mono type 
         teletype handwritten calligraphic 5pt .. 12pt

In a running text a temporary font switch is done with the command:

    \switchtobodyfont[..,...,..]
    ...   5pt ... 12pt small big global

The most frequently used font sizes are predefined: 8, 9, 10, 11, 12 and 14.4
points. When you use another size —for example for a titlepage— ConTEXt will
define this font itself within the constraints of the used typeface. ConTEXt
works with a precision of 1 digit which prevents unnecessary loading of
fontsizes with small size differences. When a fontsize is not available ConTEXt
prefers to use a somewhat smaller font size. We consider this to be more
tolerable than a somewhat bigger font size.



# The Font Switches

The mechanism to switch from one style to another is rather complex and
therefore hard to explain. To begin with, the terminology is a bit fuzzy. We
call a collection of font shapes, like Lucida or Computer Modern Roman a
family. Within such a family, the members can be grouped according to
characteristics. Such a group is called a style. Examples of styles within a
family are: roman, sans serif and teletype. We already saw that there can be
alternative classifications, but they all refer to the pressence of serifs and
the glyphs having equal widths. In some cases handwritten and/or calligraphic
styles are also available. Within a style there can be alternatives, like
boldface and slanted.

There are different ways to change into a new a style or alternative. You can
use \ss to switch to a sans serif font style and \bf to get a bold alternative.
When a different style is chosen, the alternatives adapt themselves to this
style. Often we will typeset the document in one family and style. This is
called the bodyfont.

A consequent use of commands like \bf and \sl in the text will automatically
result in the desired bold and slanted altermatives when you change the family
or style in the setup area of your input file. A somewhat faster way of style
switching is done by \ssbf, \sssl, etc. but this should be used with care,
since far less housekeeping takes place.

The alternatives within a style are given below. The abbreviation \sl means
slanted, \it means italic and \bf means boldface. Sometimes \bs and \bi are
also available, meaning bold slanted and bold italic. When an alternative is
not known, ConTEXt will choose a suitable replacement automatically.

With \os we tell ConTEXt that we prefer mediaeval or old--style numbers 139
over 139. The \sc generates Small Caps. With an x we switch to smaller font
size, with a, b, c and d to a bigger one. The actual font style is stated by
\tf or typeface.

    \tfa \tfb \tfc \tfd
    \tfx \bfx \slx \itx
    \bf \sl \it \bs \bi \sc \os

It depends on the completeness of the font definition files whether
alternatives like \bfa, \bfb, etc. are available. Not all fonts have for
instance italic and slanted or both their bold alternatives. In such
situations, slanted and italic are threated as equivalents.

Switching to a smaller font is accomplished by \tfx, \bfx, \slx, etc., which
adapt themselves to the actual alternative. An even more general downscaling is
achieved by \tx, which adapts itself to the style and alernative. This command
is rather handy when one wants to write macros that act like a chameleon. Going
one more step smaller, is possible too: \txx. Using \tx when \tx is already
given, is equivalent to \txx.

Frequent font switching leads to longer processing times. When no sub- or
superscripts are used and you are very certain what font you want to use, you
can perform fast font switches with: \rmsl, \ssbf, \tttf, etc.

Switching to another font style is done by:

    \rm \ss \tt \hw \cg

When \rm is chosen ConTEXt will interpret the command \tfd as \rmd. All default
font setups use tf--setups and will adapt automatically.

The various commands will adapt themselves to the actual setup of font and
size. For example:

    {\rm test {\sl test} {\bf test} \tfc test {\tx test} {\bf test}}
    {\ss test {\sl test \tx test} {\bf test \tx test}}

When a character is not available the most acceptable alternative is chosen.
We will not go into the typographical sins of underlining. These commands are
discussed in section 11.5 (“Underline”).



# Mnemonic font switches

While learning a document markup language like ConTeXt, it can be hard to
remember all the commands. ConTeXt provides other, easy-to-remember font
switches. So for bold you can use \bold, for italic you can use \italic, for
slanted you can use \slanted, and so on. You can probably guess what the
following do:

    \normal	           \slanted
    \boldslanted	     \slantedbold
    \bolditalic	       \italicbold
    \small	           \smallnormal
    \smallbold	       \smallslanted
    \smallboldslanted	 \smallslantedbold
    \smallbolditalic	 \smallitalicbold
    \sans	             \sansserif
    \sansbold	         \smallcaps

In addition, the commands \smallbodyfont and \bigbodyfont can be used to change
the font size. The relative size depends on the value of big and small in
\definebodyfontenvironment.

These mnemonic font switches are pretty smart. You can either use them as font
style switches inside a { group }, or as a font changing command that takes an
argument. For example,

    This is {\bold bold} and so is \bold{this}. But this is not.

These mnemonic font switches can also be used for all "style=" options, and
while using them as style options, you can just give the command name without
the backslash. For example:

    \setuphead[section][style=bold]

(\boldface shown above is also defined to parallel the \typeface and \swapface switches.)



# Capitalizing Words

Note that \WORD, \Word and all following macros aren't switches, but commands
(brackets behind, not around): 

    {\em switch}, vs \Word{macro}.

Following are additional commands:

- \setcharactercasing Pass casing command (Word, WORD, etc) as a keyword
- \WORDS convert text into uppercase
- \Words turn first character of each word into uppercase
- \Caps turn first character of each word into small caps
- \Cap turn first character into small caps
- \cap turn text into small caps
- \sc start using small caps (preserve capitals)



# Underline, strike through, and overline

Underlined, struck, and overlined text can be achieved with \overbar ,
\overbars, \overstrike, \overstrikes, \underbar, and \underbars.  The canonical
way is \overstrike{text}. However, it you're using mycrotypography with
\setupalign[hz,hanging] expect the rule to be placed over the character (with
the Latin Modern fonts you should not have this problem, experienced with Linux
Libertine and mkiv). This is not what is expected. The workaround is to put the
overstriked text in a \inframed and then turn on the "frame=off" option.

    bla bla bla \inframed[frame=off]{\overstrike{striked}} bla bla



# Complete font (bodyfont) change

If you need to change to a different font size and take care of interline
spacing, you can change the bodyfont by using \switchtobodyfont. For example,
to switch to 12pt you can use \switchtobodyfont[12pt].

ConTeXt provides two relative sizes, called big and small. So, to increase the
bodyfont size, use \switchtobodyfont[big] (or \setbigbodyfont), and to decrease
the bodyfont size, use \switchtobodyfont[small] (or \setsmallbodyfont). The
exact size used for big and small can be set using \definebodyfontenvironment.

The \setupbodyfont command accepts all the same arguments as \switchtobodyfont.
The difference between the two is that \setupbodyfont also changes the font for
headers, footers and other page markings, while \switchtobodyfont does not. So
you should use \setupbodyfont for global font definitions to apply to the whole
document, and \switchtobodyfont for local font changes (i.e. changes to the
running text only). The effect of \switchtobodyfont can be localized within a
group as usual.

So far we have discussed style and size changes within a given typeface family.
If you want to use a different typeface altogether, such as Times or Palatino,
use \switchtobodyfont[times] or \switchtobodyfont[palatino]. Here "times" and
"palatino" each refers to the name of the typescript definitions for the font.
ConTeXt distribution comes with some pre-defined typescripts; if you want to
switch to another font, you need to define your own typescript. For details,
see the page on fonts.





# Characters

A number of commands use the parameter style to set up the font style and size.
You can use commands like \sl or \rma or keywords like:

    normal  bold  slanted  boldslanted  italic  bolditalic  type
    small  smallbold  smallslanted  ...  smallitalic  ...  smalltype
    capital

The parameter mechanism is rather flexible so with the parameter style you can
type bold and \bf or bf. Even the most low level kind of font switching
commands like 12ptrmbf are permitted. This is fast but requires some insight in
macros behind this mechanism.





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

# Support of PGF/T
# Support of PSTricks



# Unicode blocks

A Unicode block, or, simply, a block, is any of the subsets of the Unicode code
space that are listed in the file Blocks.txt[3] of the Unicode Character
Database. The Unicode code space is the set of all code points, that is, the
set of all integers from 0 to the integer whose hexadecimal representation is
10FFF.

The main properties of blocks are described in the Unicode Standard[1] (Section
3.4, paragraph D10b). Every block is an interval of code points, and distinct
blocks are disjoint from each other. In particular, the blocks form a partition
of a subset of the Unicode code space.

A block starts at a code point that is a multiple of 16. The number of code
points in each block is also a multiple of 16. Thus, the hexadecimal
representation of the first code point in a block is of the form pqrs0, and
that of the last code point in it is of the form tuvwF, where p, q, r, s, t, u,
v, and w, are hexadecimal digits.

The Unicode Standard gives every block a unique name that describes the common
semantic nature of its code points. These names are case insensitive, and the
hyphens, spaces, and underscores, in them are insignificant. For example, one
can refer to the block whose Unicode name is Myanmar Extended-A as
myanmarextendeda, MyanmarExtendedA, or myanmar_extended_a. ConTeXt chooses the
first of these alternative styles for the names of blocks, as described below.

The number of code points in a block varies. Some, such as the block named
Syriac Supplement, have just 16 code points, and some others, such as the block
named CJK Unified Ideographs Extension B with 42720 elements, have thousands of
code points.

Every assigned code point belongs to some block, but there are blocks which
contain unassigned code points too; for example, the block named Telugu
contains the unassigned code point 0C50. On the other hand, there are some code
points, necessarily unassigned, which do not belong to any block; the code
point 0870 is one such. Thus, the set of all assigned code points is a proper
subset of the union of all the blocks, and the union of all the blocks is a
proper subset of the Unicode code space.


# ConTeXt names of Unicode blocks

ConTeXt has its own names for all the Unicode blocks. Most of them are obtained
by converting the Unicode name of the block to the lower case, and removing the
hyphens and spaces in the name. The article entitled List of Unicode blocks
contains a table of Unicode blocks, their ConTeXt names, and links to more
information about them.

Further ranges can be seen in context/tex/texmf-context/tex/context/base/mkiv/char-ini.lua


# Fallback Fonts

A typical use of Unicode blocks is in the definition of fallback fonts to
provide glyphs for certain characters. Sometimes, when writing a document in
ConTeXt, one needs to typeset special symbols that are not available in the
base font of the document. In such a situation, one can specify a fallback font
to provide these missing symbols.

To set a fallback font for \definefontfamily you have to put all
\definefallbackfamily settings before the main font. It is also necessary to
use the correct arguments for the range key, in your case you need
miscellaneoussymbols and dingbats (and probably a few more).

    \definefallbackfamily [mainface] [serif] [Noto Emoji] [range={miscellaneoussymbols,dingbats}]
    \definefontfamily     [mainface] [serif] [Minion Pro]
    \setupbodyfont[mainface]
    \starttext
    Noto Emoji symbols: \utfchar{"26F5} \utfchar{"2712}
    \stoptext

Here is a sample of the unicode ranges included.

    \definefallbackfamily[main] [serif] [Noto Emoji]
      [force=yes,range={emoticons,
      dingbats,
      miscellaneoussymbols,
      ornamentaldingbats,
      miscellaneousmathematicalsymbolsa,
      miscellaneousmathematicalsymbolsb,miscellaneoussymbols,
      miscellaneoussymbolsandarrows,
      miscellaneoussymbolsandpictographs,
      miscellaneoustechnical}]


Note that multiple calls to \definefallbackfamily can be made each with a different set
of Unicode ranges.

    \definefallbackfamily [linux] [serif] [zapfdingbats] [range={miscellaneoussymbols,dingbats}]
    \definefallbackfamily [linux] [serif] [heitisc] [range={cjkunifiedideographs}]
    \definefontfamily [linux] [serif] [libertinusserif]
    \definefontfamily [linux] [sans]  [libertinussans]
    \definefontfamily [linux] [mono]  [libertinusmono]
    \definefontfamily [linux] [math]  [libertinusmath]
    \starttext
    Interior Angles of a Polygon
    ❖ 
    日本
    \stoptext

For the \definefallbackfamily, the last argument could include a key-value pair
that is "force=yes".  This setup "force=yes" ensures that the glyphs of the
relevant characters are replaced from the fallback font, overriding the glyphs
that may exist in the base font for these characters.

For the "range=" key following is possible:

    range=0x00000-0xFFFFF

Another example is to use the \definefontfallback command.

    \definefontfallback [xits-fallback] [file:xits-math.otf] [023B0,023B1]
    \definefontsynonym  [MathRoman]     [modern]             [fallbacks=xits-fallback]
    \starttext
    Consider this increasing sequence of moustached primes:
    \startformula
      \lmoustache 11 \rmoustache <
      \lmoustache 29 \rmoustache <
      \lmoustache 31 \rmoustache <
      \lmoustache 37 \rmoustache <
      \lmoustache 41 \rmoustache
    \stopformula
    \stoptext


# Names For Unicode Blocks

    ["adlam"]                                      = { first = 0x1E900, last = 0x1E95F,             description = "Adlam" },
    ["aegeannumbers"]                              = { first = 0x10100, last = 0x1013F,             description = "Aegean Numbers" },
    ["ahom"]                                       = { first = 0x11700, last = 0x1173F,             description = "Ahom" },
    ["alchemicalsymbols"]                          = { first = 0x1F700, last = 0x1F77F,             description = "Alchemical Symbols" },
    ["alphabeticpresentationforms"]                = { first = 0x0FB00, last = 0x0FB4F, otf="latn", description = "Alphabetic Presentation Forms" },
    ["anatolianhieroglyphs"]                       = { first = 0x14400, last = 0x1467F,             description = "Anatolian Hieroglyphs" },
    ["ancientgreekmusicalnotation"]                = { first = 0x1D200, last = 0x1D24F, otf="grek", description = "Ancient Greek Musical Notation" },
    ["ancientgreeknumbers"]                        = { first = 0x10140, last = 0x1018F, otf="grek", description = "Ancient Greek Numbers" },
    ["ancientsymbols"]                             = { first = 0x10190, last = 0x101CF, otf="grek", description = "Ancient Symbols" },
    ["arabic"]                                     = { first = 0x00600, last = 0x006FF, otf="arab", description = "Arabic" },
    ["arabicextendeda"]                            = { first = 0x008A0, last = 0x008FF,             description = "Arabic Extended-A" },
    ["arabicmathematicalalphabeticsymbols"]        = { first = 0x1EE00, last = 0x1EEFF,             description = "Arabic Mathematical Alphabetic Symbols" },
    ["arabicpresentationformsa"]                   = { first = 0x0FB50, last = 0x0FDFF, otf="arab", description = "Arabic Presentation Forms-A" },
    ["arabicpresentationformsb"]                   = { first = 0x0FE70, last = 0x0FEFF, otf="arab", description = "Arabic Presentation Forms-B" },
    ["arabicsupplement"]                           = { first = 0x00750, last = 0x0077F, otf="arab", description = "Arabic Supplement" },
    ["armenian"]                                   = { first = 0x00530, last = 0x0058F, otf="armn", description = "Armenian" },
    ["arrows"]                                     = { first = 0x02190, last = 0x021FF,             description = "Arrows" },
    ["avestan"]                                    = { first = 0x10B00, last = 0x10B3F,             description = "Avestan" },
    ["balinese"]                                   = { first = 0x01B00, last = 0x01B7F, otf="bali", description = "Balinese" },
    ["bamum"]                                      = { first = 0x0A6A0, last = 0x0A6FF,             description = "Bamum" },
    ["bamumsupplement"]                            = { first = 0x16800, last = 0x16A3F,             description = "Bamum Supplement" },
    ["basiclatin"]                                 = { first = 0x00000, last = 0x0007F, otf="latn", description = "Basic Latin" },
    ["bassavah"]                                   = { first = 0x16AD0, last = 0x16AFF,             description = "Bassa Vah" },
    ["batak"]                                      = { first = 0x01BC0, last = 0x01BFF,             description = "Batak" },
    ["bengali"]                                    = { first = 0x00980, last = 0x009FF, otf="beng", description = "Bengali" },
    ["bhaiksuki"]                                  = { first = 0x11C00, last = 0x11C6F,             description = "Bhaiksuki" },
    ["blockelements"]                              = { first = 0x02580, last = 0x0259F, otf="bopo", description = "Block Elements" },
    ["bopomofo"]                                   = { first = 0x03100, last = 0x0312F, otf="bopo", description = "Bopomofo" },
    ["bopomofoextended"]                           = { first = 0x031A0, last = 0x031BF, otf="bopo", description = "Bopomofo Extended" },
    ["boxdrawing"]                                 = { first = 0x02500, last = 0x0257F,             description = "Box Drawing" },
    ["brahmi"]                                     = { first = 0x11000, last = 0x1107F,             description = "Brahmi" },
    ["braillepatterns"]                            = { first = 0x02800, last = 0x028FF, otf="brai", description = "Braille Patterns" },
    ["buginese"]                                   = { first = 0x01A00, last = 0x01A1F, otf="bugi", description = "Buginese" },
    ["buhid"]                                      = { first = 0x01740, last = 0x0175F, otf="buhd", description = "Buhid" },
    ["byzantinemusicalsymbols"]                    = { first = 0x1D000, last = 0x1D0FF, otf="byzm", description = "Byzantine Musical Symbols" },
    ["carian"]                                     = { first = 0x102A0, last = 0x102DF,             description = "Carian" },
    ["caucasianalbanian"]                          = { first = 0x10530, last = 0x1056F,             description = "Caucasian Albanian" },
    ["chakma"]                                     = { first = 0x11100, last = 0x1114F,             description = "Chakma" },
    ["cham"]                                       = { first = 0x0AA00, last = 0x0AA5F,             description = "Cham" },
    ["cherokee"]                                   = { first = 0x013A0, last = 0x013FF, otf="cher", description = "Cherokee" },
    ["cherokeesupplement"]                         = { first = 0x0AB70, last = 0x0ABBF,             description = "Cherokee Supplement" },
    ["chesssymbols"]                               = { first = 0x1FA00, last = 0x1FA6F,             description = "Chess Symbols" },
    ["chorasmian"]                                 = { first = 0x10FB0, last = 0x10FDF,             description = "Chorasmian" },
    ["cjkcompatibility"]                           = { first = 0x03300, last = 0x033FF, otf="hang", description = "CJK Compatibility" },
    ["cjkcompatibilityforms"]                      = { first = 0x0FE30, last = 0x0FE4F, otf="hang", description = "CJK Compatibility Forms" },
    ["cjkcompatibilityideographs"]                 = { first = 0x0F900, last = 0x0FAFF, otf="hang", description = "CJK Compatibility Ideographs" },
    ["cjkcompatibilityideographssupplement"]       = { first = 0x2F800, last = 0x2FA1F, otf="hang", description = "CJK Compatibility Ideographs Supplement" },
    ["cjkradicalssupplement"]                      = { first = 0x02E80, last = 0x02EFF, otf="hang", description = "CJK Radicals Supplement" },
    ["cjkstrokes"]                                 = { first = 0x031C0, last = 0x031EF, otf="hang", description = "CJK Strokes" },
    ["cjksymbolsandpunctuation"]                   = { first = 0x03000, last = 0x0303F, otf="hang", description = "CJK Symbols and Punctuation" },
    ["cjkunifiedideographs"]                       = { first = 0x04E00, last = 0x09FFF, otf="hang", description = "CJK Unified Ideographs", catcode = "letter" },
    ["cjkunifiedideographsextensiona"]             = { first = 0x03400, last = 0x04DBF, otf="hang", description = "CJK Unified Ideographs Extension A" },
    ["cjkunifiedideographsextensionb"]             = { first = 0x20000, last = 0x2A6DF, otf="hang", description = "CJK Unified Ideographs Extension B" },
    ["cjkunifiedideographsextensionc"]             = { first = 0x2A700, last = 0x2B73F,             description = "CJK Unified Ideographs Extension C" },
    ["cjkunifiedideographsextensiond"]             = { first = 0x2B740, last = 0x2B81F,             description = "CJK Unified Ideographs Extension D" },
    ["cjkunifiedideographsextensione"]             = { first = 0x2B820, last = 0x2CEAF,             description = "CJK Unified Ideographs Extension E" },
    ["cjkunifiedideographsextensionf"]             = { first = 0x2CEB0, last = 0x2EBEF,             description = "CJK Unified Ideographs Extension F" },
    ["cjkunifiedideographsextensiong"]             = { first = 0x30000, last = 0x3134F,             description = "CJK Unified Ideographs Extension G" },
    ["combiningdiacriticalmarks"]                  = { first = 0x00300, last = 0x0036F,             description = "Combining Diacritical Marks" },
    ["combiningdiacriticalmarksextended"]          = { first = 0x01AB0, last = 0x01AFF,             description = "Combining Diacritical Marks Extended" },
    ["combiningdiacriticalmarksforsymbols"]        = { first = 0x020D0, last = 0x020FF,             description = "Combining Diacritical Marks for Symbols" },
    ["combiningdiacriticalmarkssupplement"]        = { first = 0x01DC0, last = 0x01DFF,             description = "Combining Diacritical Marks Supplement" },
    ["combininghalfmarks"]                         = { first = 0x0FE20, last = 0x0FE2F,             description = "Combining Half Marks" },
    ["commonindicnumberforms"]                     = { first = 0x0A830, last = 0x0A83F,             description = "Common Indic Number Forms" },
    ["controlpictures"]                            = { first = 0x02400, last = 0x0243F,             description = "Control Pictures" },
    ["coptic"]                                     = { first = 0x02C80, last = 0x02CFF, otf="copt", description = "Coptic" },
    ["copticepactnumbers"]                         = { first = 0x102E0, last = 0x102FF,             description = "Coptic Epact Numbers" },
    ["countingrodnumerals"]                        = { first = 0x1D360, last = 0x1D37F,             description = "Counting Rod Numerals" },
    ["cuneiform"]                                  = { first = 0x12000, last = 0x123FF, otf="xsux", description = "Cuneiform" },
    ["cuneiformnumbersandpunctuation"]             = { first = 0x12400, last = 0x1247F, otf="xsux", description = "Cuneiform Numbers and Punctuation" },
    ["currencysymbols"]                            = { first = 0x020A0, last = 0x020CF,             description = "Currency Symbols" },
    ["cypriotsyllabary"]                           = { first = 0x10800, last = 0x1083F, otf="cprt", description = "Cypriot Syllabary" },
    ["cyrillic"]                                   = { first = 0x00400, last = 0x004FF, otf="cyrl", description = "Cyrillic" },
    ["cyrillicextendeda"]                          = { first = 0x02DE0, last = 0x02DFF, otf="cyrl", description = "Cyrillic Extended-A" },
    ["cyrillicextendedb"]                          = { first = 0x0A640, last = 0x0A69F, otf="cyrl", description = "Cyrillic Extended-B" },
    ["cyrillicextendedc"]                          = { first = 0x01C80, last = 0x01C8F,             description = "Cyrillic Extended-C" },
    ["cyrillicsupplement"]                         = { first = 0x00500, last = 0x0052F, otf="cyrl", description = "Cyrillic Supplement" },
    ["deseret"]                                    = { first = 0x10400, last = 0x1044F, otf="dsrt", description = "Deseret" },
    ["devanagari"]                                 = { first = 0x00900, last = 0x0097F, otf="deva", description = "Devanagari" },
    ["devanagariextended"]                         = { first = 0x0A8E0, last = 0x0A8FF,             description = "Devanagari Extended" },
    ["digitsarabicindic"]                          = { first = 0x00660, last = 0x00669, math = true },
    ["digitsbengali"]                              = { first = 0x009E6, last = 0x009EF, math = true },
    ["digitsbold"]                                 = { first = 0x1D7CE, last = 0x1D7D8, math = true },
    ["digitsdevanagari"]                           = { first = 0x00966, last = 0x0096F, math = true },
    ["digitsdoublestruck"]                         = { first = 0x1D7D8, last = 0x1D7E2, math = true },
    ["digitsethiopic"]                             = { first = 0x01369, last = 0x01371, math = true },
    ["digitsextendedarabicindic"]                  = { first = 0x006F0, last = 0x006F9, math = true },
    ["digitsgujarati"]                             = { first = 0x00AE6, last = 0x00AEF, math = true },
    ["digitsgurmukhi"]                             = { first = 0x00A66, last = 0x00A6F, math = true },
    ["digitskannada"]                              = { first = 0x00CE6, last = 0x00CEF, math = true },
    ["digitskhmer"]                                = { first = 0x017E0, last = 0x017E9, math = true },
    ["digitslao"]                                  = { first = 0x00ED0, last = 0x00ED9, math = true },
    ["digitslatin"]                                = { first = 0x00030, last = 0x00039, math = true },
    ["digitsmalayalam"]                            = { first = 0x00D66, last = 0x00D6F, math = true },
    ["digitsmongolian"]                            = { first = 0x01810, last = 0x01809, math = true },
    ["digitsmonospace"]                            = { first = 0x1D7F6, last = 0x1D80F, math = true },
    ["digitsmyanmar"]                              = { first = 0x01040, last = 0x01049, math = true },
    ["digitsnormal"]                               = { first = 0x00030, last = 0x00039, math = true },
    ["digitsoriya"]                                = { first = 0x00B66, last = 0x00B6F, math = true },
    ["digitssansserifbold"]                        = { first = 0x1D7EC, last = 0x1D805, math = true },
    ["digitssansserifnormal"]                      = { first = 0x1D7E2, last = 0x1D7EC, math = true },
    ["digitstamil"]                                = { first = 0x00030, last = 0x00039, math = true }, -- no zero
    ["digitstelugu"]                               = { first = 0x00C66, last = 0x00C6F, math = true },
    ["digitsthai"]                                 = { first = 0x00E50, last = 0x00E59, math = true },
    ["digitstibetan"]                              = { first = 0x00F20, last = 0x00F29, math = true },
    ["dingbats"]                                   = { first = 0x02700, last = 0x027BF,              description = "Dingbats" },
    ["divesakuru"]                                 = { first = 0x11900, last = 0x1195F,              description = "Dives Akuru" },
    ["dogra"]                                      = { first = 0x11800, last = 0x1184F,              description = "Dogra" },
    ["dominotiles"]                                = { first = 0x1F030, last = 0x1F09F,              description = "Domino Tiles" },
    ["duployan"]                                   = { first = 0x1BC00, last = 0x1BC9F,              description = "Duployan" },
    ["earlydynasticcuneiform"]                     = { first = 0x12480, last = 0x1254F,              description = "Early Dynastic Cuneiform" },
    ["egyptianhieroglyphformatcontrols"]           = { first = 0x13430, last = 0x1343F,              description = "Egyptian Hieroglyph Format Controls" },
    ["egyptianhieroglyphs"]                        = { first = 0x13000, last = 0x1342F,              description = "Egyptian Hieroglyphs" },
    ["elbasan"]                                    = { first = 0x10500, last = 0x1052F,              description = "Elbasan" },
    ["elymaic"]                                    = { first = 0x10FE0, last = 0x10FFF,              description = "Elymaic" },
    ["emoticons"]                                  = { first = 0x1F600, last = 0x1F64F,              description = "Emoticons" },
    ["enclosedalphanumerics"]                      = { first = 0x02460, last = 0x024FF,              description = "Enclosed Alphanumerics" },
    ["enclosedalphanumericsupplement"]             = { first = 0x1F100, last = 0x1F1FF,              description = "Enclosed Alphanumeric Supplement" },
    ["enclosedcjklettersandmonths"]                = { first = 0x03200, last = 0x032FF,              description = "Enclosed CJK Letters and Months" },
    ["enclosedideographicsupplement"]              = { first = 0x1F200, last = 0x1F2FF,              description = "Enclosed Ideographic Supplement" },
    ["ethiopic"]                                   = { first = 0x01200, last = 0x0137F, otf="ethi",  description = "Ethiopic" },
    ["ethiopicextended"]                           = { first = 0x02D80, last = 0x02DDF, otf="ethi",  description = "Ethiopic Extended" },
    ["ethiopicextendeda"]                          = { first = 0x0AB00, last = 0x0AB2F,              description = "Ethiopic Extended-A" },
    ["ethiopicsupplement"]                         = { first = 0x01380, last = 0x0139F, otf="ethi",  description = "Ethiopic Supplement" },
    ["generalpunctuation"]                         = { first = 0x02000, last = 0x0206F,              description = "General Punctuation" },
    ["geometricshapes"]                            = { first = 0x025A0, last = 0x025FF, math = true, description = "Geometric Shapes" },
    ["geometricshapesextended"]                    = { first = 0x1F780, last = 0x1F7FF,              description = "Geometric Shapes Extended" },
    ["georgian"]                                   = { first = 0x010A0, last = 0x010FF, otf="geor",  description = "Georgian" },
    ["georgianextended"]                           = { first = 0x01C90, last = 0x01CBF,              description = "Georgian Extended" },
    ["georgiansupplement"]                         = { first = 0x02D00, last = 0x02D2F, otf="geor",  description = "Georgian Supplement" },
    ["glagolitic"]                                 = { first = 0x02C00, last = 0x02C5F, otf="glag",  description = "Glagolitic" },
    ["glagoliticsupplement"]                       = { first = 0x1E000, last = 0x1E02F,              description = "Glagolitic Supplement" },
    ["gothic"]                                     = { first = 0x10330, last = 0x1034F, otf="goth",  description = "Gothic" },
    ["grantha"]                                    = { first = 0x11300, last = 0x1137F,              description = "Grantha" },
    ["greekandcoptic"]                             = { first = 0x00370, last = 0x003FF, otf="grek",  description = "Greek and Coptic" },
    ["greekextended"]                              = { first = 0x01F00, last = 0x01FFF, otf="grek",  description = "Greek Extended" },
    ["gujarati"]                                   = { first = 0x00A80, last = 0x00AFF, otf="gujr",  description = "Gujarati" },
    ["gunjalagondi"]                               = { first = 0x11D60, last = 0x11DAF,              description = "Gunjala Gondi" },
    ["gurmukhi"]                                   = { first = 0x00A00, last = 0x00A7F, otf="guru",  description = "Gurmukhi" },
    ["halfwidthandfullwidthforms"]                 = { first = 0x0FF00, last = 0x0FFEF,              description = "Halfwidth and Fullwidth Forms" },
    ["hangulcompatibilityjamo"]                    = { first = 0x03130, last = 0x0318F, otf="jamo",  description = "Hangul Compatibility Jamo" },
    ["hanguljamo"]                                 = { first = 0x01100, last = 0x011FF, otf="jamo",  description = "Hangul Jamo" },
    ["hanguljamoextendeda"]                        = { first = 0x0A960, last = 0x0A97F,              description = "Hangul Jamo Extended-A" },
    ["hanguljamoextendedb"]                        = { first = 0x0D7B0, last = 0x0D7FF,              description = "Hangul Jamo Extended-B" },
    ["hangulsyllables"]                            = { first = 0x0AC00, last = 0x0D7AF, otf="hang",  description = "Hangul Syllables" },
    ["hanifirohingya"]                             = { first = 0x10D00, last = 0x10D3F,              description = "Hanifi Rohingya" },
    ["hanunoo"]                                    = { first = 0x01720, last = 0x0173F, otf="hano",  description = "Hanunoo" },
    ["hatran"]                                     = { first = 0x108E0, last = 0x108FF,              description = "Hatran" },
    ["hebrew"]                                     = { first = 0x00590, last = 0x005FF, otf="hebr",  description = "Hebrew" },
    ["highprivateusesurrogates"]                   = { first = 0x0DB80, last = 0x0DBFF,              description = "High Private Use Surrogates" },
    ["highsurrogates"]                             = { first = 0x0D800, last = 0x0DB7F,              description = "High Surrogates" },
    ["hiragana"]                                   = { first = 0x03040, last = 0x0309F, otf="kana",  description = "Hiragana" },
    ["ideographicdescriptioncharacters"]           = { first = 0x02FF0, last = 0x02FFF,              description = "Ideographic Description Characters" },
    ["ideographicsymbolsandpunctuation"]           = { first = 0x16FE0, last = 0x16FFF,              description = "Ideographic Symbols and Punctuation" },
    ["imperialaramaic"]                            = { first = 0x10840, last = 0x1085F,              description = "Imperial Aramaic" },
    ["indicsiyaqnumbers"]                          = { first = 0x1EC70, last = 0x1ECBF,              description = "Indic Siyaq Numbers" },
    ["inscriptionalpahlavi"]                       = { first = 0x10B60, last = 0x10B7F,              description = "Inscriptional Pahlavi" },
    ["inscriptionalparthian"]                      = { first = 0x10B40, last = 0x10B5F,              description = "Inscriptional Parthian" },
    ["ipaextensions"]                              = { first = 0x00250, last = 0x002AF,              description = "IPA Extensions" },
    ["javanese"]                                   = { first = 0x0A980, last = 0x0A9DF,              description = "Javanese" },
    ["kaithi"]                                     = { first = 0x11080, last = 0x110CF,              description = "Kaithi" },
    ["kanaextendeda"]                              = { first = 0x1B100, last = 0x1B12F,              description = "Kana Extended-A" },
    ["kanasupplement"]                             = { first = 0x1B000, last = 0x1B0FF,              description = "Kana Supplement" },
    ["kanbun"]                                     = { first = 0x03190, last = 0x0319F,              description = "Kanbun" },
    ["kangxiradicals"]                             = { first = 0x02F00, last = 0x02FDF,              description = "Kangxi Radicals" },
    ["kannada"]                                    = { first = 0x00C80, last = 0x00CFF, otf="knda",  description = "Kannada" },
    ["katakana"]                                   = { first = 0x030A0, last = 0x030FF, otf="kana",  description = "Katakana" },
    ["katakanaphoneticextensions"]                 = { first = 0x031F0, last = 0x031FF, otf="kana",  description = "Katakana Phonetic Extensions" },
    ["kayahli"]                                    = { first = 0x0A900, last = 0x0A92F,              description = "Kayah Li" },
    ["kharoshthi"]                                 = { first = 0x10A00, last = 0x10A5F, otf="khar",  description = "Kharoshthi" },
    ["khitansmallscript"]                          = { first = 0x18B00, last = 0x18CFF,              description = "Khitan Small Script" },
    ["khmer"]                                      = { first = 0x01780, last = 0x017FF, otf="khmr",  description = "Khmer" },
    ["khmersymbols"]                               = { first = 0x019E0, last = 0x019FF, otf="khmr",  description = "Khmer Symbols" },
    ["khojki"]                                     = { first = 0x11200, last = 0x1124F,              description = "Khojki" },
    ["khudawadi"]                                  = { first = 0x112B0, last = 0x112FF,              description = "Khudawadi" },
    ["lao"]                                        = { first = 0x00E80, last = 0x00EFF, otf="lao",   description = "Lao" },
    ["latinextendeda"]                             = { first = 0x00100, last = 0x0017F, otf="latn",  description = "Latin Extended-A" },
    ["latinextendedadditional"]                    = { first = 0x01E00, last = 0x01EFF, otf="latn",  description = "Latin Extended Additional" },
    ["latinextendedb"]                             = { first = 0x00180, last = 0x0024F, otf="latn",  description = "Latin Extended-B" },
    ["latinextendedc"]                             = { first = 0x02C60, last = 0x02C7F, otf="latn",  description = "Latin Extended-C" },
    ["latinextendedd"]                             = { first = 0x0A720, last = 0x0A7FF, otf="latn",  description = "Latin Extended-D" },
    ["latinextendede"]                             = { first = 0x0AB30, last = 0x0AB6F,              description = "Latin Extended-E" },
    ["latinsupplement"]                            = { first = 0x00080, last = 0x000FF, otf="latn",  description = "Latin-1 Supplement" },
    ["lepcha"]                                     = { first = 0x01C00, last = 0x01C4F,              description = "Lepcha" },
    ["letterlikesymbols"]                          = { first = 0x02100, last = 0x0214F, math = true, description = "Letterlike Symbols" },
    ["limbu"]                                      = { first = 0x01900, last = 0x0194F, otf="limb",  description = "Limbu" },
    ["lineara"]                                    = { first = 0x10600, last = 0x1077F,              description = "Linear A" },
    ["linearbideograms"]                           = { first = 0x10080, last = 0x100FF, otf="linb",  description = "Linear B Ideograms" },
    ["linearbsyllabary"]                           = { first = 0x10000, last = 0x1007F, otf="linb",  description = "Linear B Syllabary" },
    ["lisu"]                                       = { first = 0x0A4D0, last = 0x0A4FF,              description = "Lisu" },
    ["lisusupplement"]                             = { first = 0x11FB0, last = 0x11FBF,              description = "Lisu Supplement" },
    ["lowercasebold"]                              = { first = 0x1D41A, last = 0x1D433, math = true },
    ["lowercaseboldfraktur"]                       = { first = 0x1D586, last = 0x1D59F, math = true },
    ["lowercasebolditalic"]                        = { first = 0x1D482, last = 0x1D49B, math = true },
    ["lowercaseboldscript"]                        = { first = 0x1D4EA, last = 0x1D503, math = true },
    ["lowercasedoublestruck"]                      = { first = 0x1D552, last = 0x1D56B, math = true },
    ["lowercasefraktur"]                           = { first = 0x1D51E, last = 0x1D537, math = true },
    ["lowercasegreekbold"]                         = { first = 0x1D6C2, last = 0x1D6DB, math = true },
    ["lowercasegreekbolditalic"]                   = { first = 0x1D736, last = 0x1D74F, math = true },
    ["lowercasegreekitalic"]                       = { first = 0x1D6FC, last = 0x1D715, math = true },
    ["lowercasegreeknormal"]                       = { first = 0x003B1, last = 0x003CA, math = true },
    ["lowercasegreeksansserifbold"]                = { first = 0x1D770, last = 0x1D789, math = true },
    ["lowercasegreeksansserifbolditalic"]          = { first = 0x1D7AA, last = 0x1D7C3, math = true },
    ["lowercaseitalic"]                            = { first = 0x1D44E, last = 0x1D467, math = true },
    ["lowercasemonospace"]                         = { first = 0x1D68A, last = 0x1D6A3, math = true },
    ["lowercasenormal"]                            = { first = 0x00061, last = 0x0007A, math = true },
    ["lowercasesansserifbold"]                     = { first = 0x1D5EE, last = 0x1D607, math = true },
    ["lowercasesansserifbolditalic"]               = { first = 0x1D656, last = 0x1D66F, math = true },
    ["lowercasesansserifitalic"]                   = { first = 0x1D622, last = 0x1D63B, math = true },
    ["lowercasesansserifnormal"]                   = { first = 0x1D5BA, last = 0x1D5D3, math = true },
    ["lowercasescript"]                            = { first = 0x1D4B6, last = 0x1D4CF, math = true },
    ["lowsurrogates"]                              = { first = 0x0DC00, last = 0x0DFFF,              description = "Low Surrogates" },
    ["lycian"]                                     = { first = 0x10280, last = 0x1029F,              description = "Lycian" },
    ["lydian"]                                     = { first = 0x10920, last = 0x1093F,              description = "Lydian" },
    ["mahajani"]                                   = { first = 0x11150, last = 0x1117F,              description = "Mahajani" },
    ["mahjongtiles"]                               = { first = 0x1F000, last = 0x1F02F,              description = "Mahjong Tiles" },
    ["makasar"]                                    = { first = 0x11EE0, last = 0x11EFF,              description = "Makasar" },
    ["malayalam"]                                  = { first = 0x00D00, last = 0x00D7F, otf="mlym",  description = "Malayalam" },
    ["mandaic"]                                    = { first = 0x00840, last = 0x0085F, otf="mand",  description = "Mandaic" },
    ["manichaean"]                                 = { first = 0x10AC0, last = 0x10AFF,              description = "Manichaean" },
    ["marchen"]                                    = { first = 0x11C70, last = 0x11CBF,              description = "Marchen" },
    ["masaramgondi"]                               = { first = 0x11D00, last = 0x11D5F,              description = "Masaram Gondi" },
    ["mathematicalalphanumericsymbols"]            = { first = 0x1D400, last = 0x1D7FF, math = true, description = "Mathematical Alphanumeric Symbols" },
    ["mathematicaloperators"]                      = { first = 0x02200, last = 0x022FF, math = true, description = "Mathematical Operators" },
    ["mayannumerals"]                              = { first = 0x1D2E0, last = 0x1D2FF,              description = "Mayan Numerals" },
    ["medefaidrin"]                                = { first = 0x16E40, last = 0x16E9F,              description = "Medefaidrin" },
    ["meeteimayek"]                                = { first = 0x0ABC0, last = 0x0ABFF,              description = "Meetei Mayek" },
    ["meeteimayekextensions"]                      = { first = 0x0AAE0, last = 0x0AAFF,              description = "Meetei Mayek Extensions" },
    ["mendekikakui"]                               = { first = 0x1E800, last = 0x1E8DF,              description = "Mende Kikakui" },
    ["meroiticcursive"]                            = { first = 0x109A0, last = 0x109FF,              description = "Meroitic Cursive" },
    ["meroitichieroglyphs"]                        = { first = 0x10980, last = 0x1099F,              description = "Meroitic Hieroglyphs" },
    ["miao"]                                       = { first = 0x16F00, last = 0x16F9F,              description = "Miao" },
    ["miscellaneousmathematicalsymbolsa"]          = { first = 0x027C0, last = 0x027EF, math = true, description = "Miscellaneous Mathematical Symbols-A" },
    ["miscellaneousmathematicalsymbolsb"]          = { first = 0x02980, last = 0x029FF, math = true, description = "Miscellaneous Mathematical Symbols-B" },
    ["miscellaneoussymbols"]                       = { first = 0x02600, last = 0x026FF, math = true, description = "Miscellaneous Symbols" },
    ["miscellaneoussymbolsandarrows"]              = { first = 0x02B00, last = 0x02BFF, math = true, description = "Miscellaneous Symbols and Arrows" },
    ["miscellaneoussymbolsandpictographs"]         = { first = 0x1F300, last = 0x1F5FF,              description = "Miscellaneous Symbols and Pictographs" },
    ["miscellaneoustechnical"]                     = { first = 0x02300, last = 0x023FF, math = true, description = "Miscellaneous Technical" },
    ["modi"]                                       = { first = 0x11600, last = 0x1165F,              description = "Modi" },
    ["modifiertoneletters"]                        = { first = 0x0A700, last = 0x0A71F,              description = "Modifier Tone Letters" },
    ["mongolian"]                                  = { first = 0x01800, last = 0x018AF, otf="mong",  description = "Mongolian" },
    ["mongoliansupplement"]                        = { first = 0x11660, last = 0x1167F,              description = "Mongolian Supplement" },
    ["mro"]                                        = { first = 0x16A40, last = 0x16A6F,              description = "Mro" },
    ["multani"]                                    = { first = 0x11280, last = 0x112AF,              description = "Multani" },
    ["musicalsymbols"]                             = { first = 0x1D100, last = 0x1D1FF, otf="musc",  description = "Musical Symbols" },
    ["myanmar"]                                    = { first = 0x01000, last = 0x0109F, otf="mymr",  description = "Myanmar" },
    ["myanmarextendeda"]                           = { first = 0x0AA60, last = 0x0AA7F,              description = "Myanmar Extended-A" },
    ["myanmarextendedb"]                           = { first = 0x0A9E0, last = 0x0A9FF,              description = "Myanmar Extended-B" },
    ["nabataean"]                                  = { first = 0x10880, last = 0x108AF,              description = "Nabataean" },
    ["nandinagari"]                                = { first = 0x119A0, last = 0x119FF,              description = "Nandinagari" },
    ["newa"]                                       = { first = 0x11400, last = 0x1147F,              description = "Newa" },
    ["newtailue"]                                  = { first = 0x01980, last = 0x019DF,              description = "New Tai Lue" },
    ["nko"]                                        = { first = 0x007C0, last = 0x007FF, otf="nko",   description = "NKo" },
    ["numberforms"]                                = { first = 0x02150, last = 0x0218F,              description = "Number Forms" },
    ["nushu"]                                      = { first = 0x1B170, last = 0x1B2FF,              description = "Nushu" },
    ["nyiakengpuachuehmong"]                       = { first = 0x1E100, last = 0x1E14F,              description = "Nyiakeng Puachue Hmong" },
    ["ogham"]                                      = { first = 0x01680, last = 0x0169F, otf="ogam",  description = "Ogham" },
    ["olchiki"]                                    = { first = 0x01C50, last = 0x01C7F,              description = "Ol Chiki" },
    ["oldhungarian"]                               = { first = 0x10C80, last = 0x10CFF,              description = "Old Hungarian" },
    ["olditalic"]                                  = { first = 0x10300, last = 0x1032F, otf="ital",  description = "Old Italic" },
    ["oldnortharabian"]                            = { first = 0x10A80, last = 0x10A9F,              description = "Old North Arabian" },
    ["oldpermic"]                                  = { first = 0x10350, last = 0x1037F,              description = "Old Permic" },
    ["oldpersian"]                                 = { first = 0x103A0, last = 0x103DF, otf="xpeo",  description = "Old Persian" },
    ["oldsogdian"]                                 = { first = 0x10F00, last = 0x10F2F,              description = "Old Sogdian" },
    ["oldsoutharabian"]                            = { first = 0x10A60, last = 0x10A7F,              description = "Old South Arabian" },
    ["oldturkic"]                                  = { first = 0x10C00, last = 0x10C4F,              description = "Old Turkic" },
    ["opticalcharacterrecognition"]                = { first = 0x02440, last = 0x0245F,              description = "Optical Character Recognition" },
    ["oriya"]                                      = { first = 0x00B00, last = 0x00B7F, otf="orya",  description = "Oriya" },
    ["ornamentaldingbats"]                         = { first = 0x1F650, last = 0x1F67F,              description = "Ornamental Dingbats" },
    ["osage"]                                      = { first = 0x104B0, last = 0x104FF,              description = "Osage" },
    ["osmanya"]                                    = { first = 0x10480, last = 0x104AF, otf="osma",  description = "Osmanya" },
    ["ottomansiyaqnumbers"]                        = { first = 0x1ED00, last = 0x1ED4F,              description = "Ottoman Siyaq Numbers" },
    ["pahawhhmong"]                                = { first = 0x16B00, last = 0x16B8F,              description = "Pahawh Hmong" },
    ["palmyrene"]                                  = { first = 0x10860, last = 0x1087F,              description = "Palmyrene" },
    ["paucinhau"]                                  = { first = 0x11AC0, last = 0x11AFF,              description = "Pau Cin Hau" },
    ["phagspa"]                                    = { first = 0x0A840, last = 0x0A87F, otf="phag",  description = "Phags-pa" },
    ["phaistosdisc"]                               = { first = 0x101D0, last = 0x101FF,              description = "Phaistos Disc" },
    ["phoenician"]                                 = { first = 0x10900, last = 0x1091F, otf="phnx",  description = "Phoenician" },
    ["phoneticextensions"]                         = { first = 0x01D00, last = 0x01D7F,              description = "Phonetic Extensions" },
    ["phoneticextensionssupplement"]               = { first = 0x01D80, last = 0x01DBF,              description = "Phonetic Extensions Supplement" },
    ["playingcards"]                               = { first = 0x1F0A0, last = 0x1F0FF,              description = "Playing Cards" },
    ["privateusearea"]                             = { first = 0x0E000, last = 0x0F8FF,              description = "Private Use Area" },
    ["psalterpahlavi"]                             = { first = 0x10B80, last = 0x10BAF,              description = "Psalter Pahlavi" },
    ["rejang"]                                     = { first = 0x0A930, last = 0x0A95F,              description = "Rejang" },
    ["ruminumeralsymbols"]                         = { first = 0x10E60, last = 0x10E7F,              description = "Rumi Numeral Symbols" },
    ["runic"]                                      = { first = 0x016A0, last = 0x016FF, otf="runr",  description = "Runic" },
    ["samaritan"]                                  = { first = 0x00800, last = 0x0083F,              description = "Samaritan" },
    ["saurashtra"]                                 = { first = 0x0A880, last = 0x0A8DF,              description = "Saurashtra" },
    ["sharada"]                                    = { first = 0x11180, last = 0x111DF,              description = "Sharada" },
    ["shavian"]                                    = { first = 0x10450, last = 0x1047F, otf="shaw",  description = "Shavian" },
    ["shorthandformatcontrols"]                    = { first = 0x1BCA0, last = 0x1BCAF,              description = "Shorthand Format Controls" },
    ["siddham"]                                    = { first = 0x11580, last = 0x115FF,              description = "Siddham" },
    ["sinhala"]                                    = { first = 0x00D80, last = 0x00DFF, otf="sinh",  description = "Sinhala" },
    ["sinhalaarchaicnumbers"]                      = { first = 0x111E0, last = 0x111FF,              description = "Sinhala Archaic Numbers" },
    ["smallformvariants"]                          = { first = 0x0FE50, last = 0x0FE6F,              description = "Small Form Variants" },
    ["smallkanaextension"]                         = { first = 0x1B130, last = 0x1B16F,              description = "Small Kana Extension" },
    ["sogdian"]                                    = { first = 0x10F30, last = 0x10F6F,              description = "Sogdian" },
    ["sorasompeng"]                                = { first = 0x110D0, last = 0x110FF,              description = "Sora Sompeng" },
    ["soyombo"]                                    = { first = 0x11A50, last = 0x11AAF,              description = "Soyombo" },
    ["spacingmodifierletters"]                     = { first = 0x002B0, last = 0x002FF,              description = "Spacing Modifier Letters" },
    ["specials"]                                   = { first = 0x0FFF0, last = 0x0FFFF,              description = "Specials" },
    ["sundanese"]                                  = { first = 0x01B80, last = 0x01BBF,              description = "Sundanese" },
    ["sundanesesupplement"]                        = { first = 0x01CC0, last = 0x01CCF,              description = "Sundanese Supplement" },
    ["superscriptsandsubscripts"]                  = { first = 0x02070, last = 0x0209F,              description = "Superscripts and Subscripts" },
    ["supplementalarrowsa"]                        = { first = 0x027F0, last = 0x027FF, math = true, description = "Supplemental Arrows-A" },
    ["supplementalarrowsb"]                        = { first = 0x02900, last = 0x0297F, math = true, description = "Supplemental Arrows-B" },
    ["supplementalarrowsc"]                        = { first = 0x1F800, last = 0x1F8FF, math = true, description = "Supplemental Arrows-C" },
    ["supplementalmathematicaloperators"]          = { first = 0x02A00, last = 0x02AFF, math = true, description = "Supplemental Mathematical Operators" },
    ["supplementalpunctuation"]                    = { first = 0x02E00, last = 0x02E7F,              description = "Supplemental Punctuation" },
    ["supplementalsymbolsandpictographs"]          = { first = 0x1F900, last = 0x1F9FF,              description = "Supplemental Symbols and Pictographs" },
    ["supplementaryprivateuseareaa"]               = { first = 0xF0000, last = 0xFFFFF,              description = "Supplementary Private Use Area-A" },
    ["supplementaryprivateuseareab"]               = { first = 0x100000,last = 0x10FFFF,             description = "Supplementary Private Use Area-B" },
    ["suttonsignwriting"]                          = { first = 0x1D800, last = 0x1DAAF,              description = "Sutton SignWriting" },
    ["sylotinagri"]                                = { first = 0x0A800, last = 0x0A82F, otf="sylo",  description = "Syloti Nagri" },
    ["symbolsandpictographsextendeda"]             = { first = 0x1FA70, last = 0x1FAFF,              description = "Symbols and Pictographs Extended-A" },
    ["symbolsforlegacycomputing"]                  = { first = 0x1FB00, last = 0x1FBFF,              description = "Symbols for Legacy Computing" },
    ["syriac"]                                     = { first = 0x00700, last = 0x0074F, otf="syrc",  description = "Syriac" },
    ["syriacsupplement"]                           = { first = 0x00860, last = 0x0086F,              description = "Syriac Supplement" },
    ["tagalog"]                                    = { first = 0x01700, last = 0x0171F, otf="tglg",  description = "Tagalog" },
    ["tagbanwa"]                                   = { first = 0x01760, last = 0x0177F, otf="tagb",  description = "Tagbanwa" },
    ["tags"]                                       = { first = 0xE0000, last = 0xE007F,              description = "Tags" },
    ["taile"]                                      = { first = 0x01950, last = 0x0197F, otf="tale",  description = "Tai Le" },
    ["taitham"]                                    = { first = 0x01A20, last = 0x01AAF,              description = "Tai Tham" },
    ["taiviet"]                                    = { first = 0x0AA80, last = 0x0AADF,              description = "Tai Viet" },
    ["taixuanjingsymbols"]                         = { first = 0x1D300, last = 0x1D35F,              description = "Tai Xuan Jing Symbols" },
    ["takri"]                                      = { first = 0x11680, last = 0x116CF,              description = "Takri" },
    ["tamil"]                                      = { first = 0x00B80, last = 0x00BFF, otf="taml",  description = "Tamil" },
    ["tamilsupplement"]                            = { first = 0x11FC0, last = 0x11FFF,              description = "Tamil Supplement" },
    ["tangut"]                                     = { first = 0x17000, last = 0x187FF,              description = "Tangut" },
    ["tangutsupplement"]                           = { first = 0x18D00, last = 0x18D8F,              description = "Tangut Supplement" },
    ["tangutcomponents"]                           = { first = 0x18800, last = 0x18AFF,              description = "Tangut Components" },
    ["telugu"]                                     = { first = 0x00C00, last = 0x00C7F, otf="telu",  description = "Telugu" },
    ["thaana"]                                     = { first = 0x00780, last = 0x007BF, otf="thaa",  description = "Thaana" },
    ["thai"]                                       = { first = 0x00E00, last = 0x00E7F, otf="thai",  description = "Thai" },
    ["tibetan"]                                    = { first = 0x00F00, last = 0x00FFF, otf="tibt",  description = "Tibetan" },
    ["tifinagh"]                                   = { first = 0x02D30, last = 0x02D7F, otf="tfng",  description = "Tifinagh" },
    ["tirhuta"]                                    = { first = 0x11480, last = 0x114DF,              description = "Tirhuta" },
    ["transportandmapsymbols"]                     = { first = 0x1F680, last = 0x1F6FF,              description = "Transport and Map Symbols" },
    ["ugaritic"]                                   = { first = 0x10380, last = 0x1039F, otf="ugar",  description = "Ugaritic" },
    ["unifiedcanadianaboriginalsyllabics"]         = { first = 0x01400, last = 0x0167F, otf="cans",  description = "Unified Canadian Aboriginal Syllabics" },
    ["unifiedcanadianaboriginalsyllabicsextended"] = { first = 0x018B0, last = 0x018FF,              description = "Unified Canadian Aboriginal Syllabics Extended" },
    ["uppercasebold"]                              = { first = 0x1D400, last = 0x1D419, math = true },
    ["uppercaseboldfraktur"]                       = { first = 0x1D56C, last = 0x1D585, math = true },
    ["uppercasebolditalic"]                        = { first = 0x1D468, last = 0x1D481, math = true },
    ["uppercaseboldscript"]                        = { first = 0x1D4D0, last = 0x1D4E9, math = true },
    ["uppercasedoublestruck"]                      = { first = 0x1D538, last = 0x1D551, math = true }, -- gaps are filled in elsewhere
    ["uppercasefraktur"]                           = { first = 0x1D504, last = 0x1D51D, math = true },
    ["uppercasegreekbold"]                         = { first = 0x1D6A8, last = 0x1D6C1, math = true },
    ["uppercasegreekbolditalic"]                   = { first = 0x1D71C, last = 0x1D735, math = true },
    ["uppercasegreekitalic"]                       = { first = 0x1D6E2, last = 0x1D6FB, math = true },
    ["uppercasegreeknormal"]                       = { first = 0x00391, last = 0x003AA, math = true },
    ["uppercasegreeksansserifbold"]                = { first = 0x1D756, last = 0x1D76F, math = true },
    ["uppercasegreeksansserifbolditalic"]          = { first = 0x1D790, last = 0x1D7A9, math = true },
    ["uppercaseitalic"]                            = { first = 0x1D434, last = 0x1D44D, math = true },
    ["uppercasemonospace"]                         = { first = 0x1D670, last = 0x1D689, math = true },
    ["uppercasenormal"]                            = { first = 0x00041, last = 0x0005A, math = true },
    ["uppercasesansserifbold"]                     = { first = 0x1D5D4, last = 0x1D5ED, math = true },
    ["uppercasesansserifbolditalic"]               = { first = 0x1D63C, last = 0x1D655, math = true },
    ["uppercasesansserifitalic"]                   = { first = 0x1D608, last = 0x1D621, math = true },
    ["uppercasesansserifnormal"]                   = { first = 0x1D5A0, last = 0x1D5B9, math = true },
    ["uppercasescript"]                            = { first = 0x1D49C, last = 0x1D4B5, math = true },
    ["vai"]                                        = { first = 0x0A500, last = 0x0A63F,              description = "Vai" },
    ["variationselectors"]                         = { first = 0x0FE00, last = 0x0FE0F,              description = "Variation Selectors" },
    ["variationselectorssupplement"]               = { first = 0xE0100, last = 0xE01EF,              description = "Variation Selectors Supplement" },
    ["vedicextensions"]                            = { first = 0x01CD0, last = 0x01CFF,              description = "Vedic Extensions" },
    ["verticalforms"]                              = { first = 0x0FE10, last = 0x0FE1F,              description = "Vertical Forms" },
    ["wancho"]                                     = { first = 0x1E2C0, last = 0x1E2FF,              description = "Wancho" },
    ["warangciti"]                                 = { first = 0x118A0, last = 0x118FF,              description = "Warang Citi" },
    ["yezidi"]                                     = { first = 0x10E80, last = 0x10EBF,              description = "Yezidi" },
    ["yijinghexagramsymbols"]                      = { first = 0x04DC0, last = 0x04DFF, otf="yi",    description = "Yijing Hexagram Symbols" },
    ["yiradicals"]                                 = { first = 0x0A490, last = 0x0A4CF, otf="yi",    description = "Yi Radicals" },
    ["yisyllables"]                                = { first = 0x0A000, last = 0x0A48F, otf="yi",    description = "Yi Syllables" },
    ["zanabazarsquare"]                            = { first = 0x11A00, last = 0x11A4F,              description = "Zanabazar Square" },




