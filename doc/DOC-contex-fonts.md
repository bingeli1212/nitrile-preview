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

    ```img{outline,width:80%}
    image-fonts-1.png
    ```

    \\

    ```img{outline,width:80%}
    image-fonts-2.png
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

  ```img{outline,width:80%}
  image-fonts-3.png
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

```img{outline}
image-fonts-4.png
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

  ```framed{outline,width:100%,framewidth:800}
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

  ```framed{outline,width:100%,framewidth:800}
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

  ```framed{outline,width:100%,framewidth:800}
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

  ```framed{outline,width:100%,framewidth:800}
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



