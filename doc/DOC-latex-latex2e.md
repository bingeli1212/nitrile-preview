---
title: LaTeX2e
---

# LaTeX2e

LaTeX is a synonym for LaTeX2e, which itself is the successor of LaTeX
2.09. LaTeX3 has been in development for nearly 20 years and shall be
the successor of LaTeX2e. The main basic packages for LaTeX3 can be
used but are still in an experimental state. I suppose that a lot of
LaTeX (which is actually LaTeX2e) users will be retired if LaTeX3
should ever be officially released ... ;-)

All TeX distributions support LaTeX2e which is, of course, not a
program but a macro package. The program is tex, pdftex, luatex, or
xetex. They use the macro package latex.ltx when called as latex,
pdflatex, lualatex, or xelatex.

At this point in time the plan is to evolve LaTeX incrementally rather
than trying to switch to a new code base all at once. See the talk by
Frank Mittelbach:
&uri{https://www.youtube.com/watch?v=zNci4lcb8Vo&feature=youtu.be}

So while the goals of the LaTeX3 project are coming to fruition, there
are no plans currently for changing the name from LaTeX2e to LaTeX3.

# LaTeX 2.09 and LaTeX2e

The previous version of LaTeX was known as LaTeX 2.09. Over the years
many extensions have been developed for LaTeX. This is, of course, a
sure sign of its continuing popularity but it has had one unfortunate
result: incompatible LaTeX formats came into use at different sites.
This included `standard LaTeX 2.09', LaTeX built with the New Font
Selection Scheme (NFSS), SLiTeX, AmSLaTeX, and so on. Thus, to process
documents from various places, a site maintainer was forced to keep
multiple versions of the LaTeX program. In addition, when looking at a
source file it was not always clear for which format the document was
written.

To put an end to this unsatisfactory situation, LaTeX2e has been
produced; it brings all such extensions back under a single format and
thus prevents the proliferation of mutually incompatible dialects of
LaTeX 2.09. With LaTeX2e the `new font selection scheme' is standard
and, for example, amsmath (formerly the AmSLaTeX format) or slides
(formerly the SLiTeX format) are simply extensions, which may be
loaded by documents using the same base format.

The introduction of a new release also made it possible to add a small
number of often-requested features and to make the task of writing
packages and classes simpler.

The following information is excerpted from "A Document Preparation
System: LaTeX" by Leslie Lamport, 2nd edition and/or "LaTeX2e for
authors", by the LaTeX3 Project Team, June 1994.

LaTex2e was produced in an attempt to reconcile the various, sometimes
incompatble, "flavors" of LaTeX which were developing. Some of these
included the New Font Selection Scheme (NFSS), SLITeX (for slides),
AASTeX (the American Astronomical Society macros), etc. The major
change to LaTeX2e is the method for trying to make the use of add-on
packages more uniform by the introduction of "classes" and "packages."
Most of the new commands are the "initial" commands, i.e., those which
can appear only before the \documentclass command.

A few standard LaTeX commands have been modified and a few new
commands added, notably:

- \newcommand (and related) commands, which now allow for an optional argument in newly defined commands
- \ensuremath

# Document Styles and Style Options

In LaTeX2e, documents begin with a \documentclass command. This
replaces the LaTeX 2.09 \documentstyle command. The \usepackage
command has been added and is used in conjunction with \documentclass.

LaTeX2e still understands the old \documentstyle command; if it is
encountered, LaTex2e enters compatibility mode in which most 2.09
input files should still be processed properly.

# What are classes and packages?

The main difference between LaTeX 2.09 and LaTeX2e is in the commands
before \begin{document}. In LaTeX 2.09, documents had styles, such as
article or book, and options, such as twoside or epsfig. These were
indicated by the \documentstyle command:

    \documentstyle[<options>]{<style>}

For example, to specify a two-sided article with encapsulated PostScript figures, you said:

    \documentstyle[twoside,epsfig]{article}

However, there were two different types of document style option:
built-in options such as twoside; and packages such as epsfig.sty.
These were very different, since any LaTeX document style could use
the epsfig package but only document styles which declared the twoside
option could use that option. To avoid this confusion, LaTeX2e
differentiates between built-in options and packages. These are given
by the new \documentclass and \usepackage commands:

    \documentclass[<options>]{<class>}
    \usepackage[<options>]{<packages>}

For example, to specify a two-sided article with encapsulated
PostScript figures, you now write:

    \documentclass[twoside]{article}
    \usepackage{epsfig}

You can load more than one package with a single \usepackage command;
for example, rather than writing:

    \usepackage{epsfig}
    \usepackage{multicol}

you can specify:

    \usepackage{epsfig,multicol}

Note that LaTeX2e still understands the LaTeX 2.09 \documentstyle
command. This command causes LaTeX2e to enter LaTeX 2.09 compatibility
mode, which is described in Section 4. You should not, however, use
the \documentstyle command for new documents because this
compatibility mode is very slow and the new features of LaTeX2e are
not available in this mode.

To help differentiate between classes and packages, document classes
now end with .cls rather than .sty. Packages still end with .sty,
since most LaTeX 2.09 packages work well with LaTeX2e.

# Class and package options

In LaTeX 2.09, only document styles could have options such as twoside
or draft. In LaTeX2e, both classes and packages are allowed to have
options. For example, to specify a two-sided article with graphics
using the dvips driver, you write:

    \documentclass[twoside]{article}
    \usepackage[dvips]{graphics}

It is possible for packages to share common options. For example, you
could, in addition, load the color package by specifying:

    \documentclass[twoside]{article}
    \usepackage[dvips]{graphics}
    \usepackage[dvips]{color}

But because \usepackage allows more than one package to be listed,
this can be shortened to:

    \documentclass[twoside]{article}
    \usepackage[dvips]{graphics,color}

In addition, packages will also use each option given to the
\documentclass command (if they know what to do with it), so you could
also write:

    \documentclass[twoside,dvips]{article}
    \usepackage{graphics,color}

Class and package options are covered in more detail in The LaTeX
Companion and in LaTeX2e for Class and Package Writers.

# Standard classes

The following classes are distributed with LaTeX:

+ article

  The article class described in LaTeX: A Document Preparation System.

+ book

  The book class described in LaTeX: A Document Preparation System.

+ report

  The report class described in LaTeX: A Document Preparation System.

+ letter

  The letter class described in LaTeX: A Document Preparation System.

+ slides

  The slides class described in LaTeX: A Document Preparation System, formerly
  SLiTeX.

+ proc

  A document class for proceedings, based on article. Formerly the proc
  package.

+ ltxdoc

  The document class for documenting the LaTeX program, based on article.

+ ltxguide

  The document class for LaTeX2e for Authors and LaTeX2e for Class and Package
  Writers, based on article. The document you are reading now uses the ltxguide
  class. The layout for this class is likely to change in future releases of
  LaTeX.

+ ltnews

  The document class for the LaTeX News information sheet, based on article.
  The layout for this class is likely to change in future releases of LaTeX.

+ minimal

  This class is the bare minimum (3 lines) that is needed in a LaTeX class
  file. It just sets the text width and height, and defines \normalsize. It is
  principally intended for debugging and testing LaTeX code in situations where
  you do not need to load a "full" class such as article. If, however, you are
  designing a completely new class that is aimed for documents with structure
  radically different from the structure supplied by the article class, then it
  may make sense to use this as a base and add to it code implementing the
  required structure, rather than starting from article and modifying the code
  there.




# Type Styles and Sizes

LaTeX 2.09 commands for changing type style, for example, \tt, still
work similarly in LaTeX2e. The major difference is that \sc and \sl
can no longer be used in math mode (except when LaTeX2e is in
compatibility mode, see above).

However, a new set of commands have been added to allow separate (and
independent) specification of

- Shape
- Series
- Family

These can be combined to form a wide variety of type styles. If a
style you specify is not available on your computer, LaTeX2e produce a
warning message and will substitute a style it thinks is similar.

# The "\textsuperscript" command

In LaTeX 2.09 textual superscripts such as footnote markers were
produced by internally entering math mode and typesetting the number
as a math superscript. This normally looked fine since the digits in
math fonts are the same as those in text fonts when Computer Modern
fonts are used. But when a different document font (such as Times) is
selected, the results look rather strange. For this reason the command
\textsuperscript has been introduced which typesets its argument in
the current text font, in a superscript position and in the correct
size.

# The "\ensuremath" command

    \ensuremath {<math commands>}

In LaTeX 2.09, if you wanted a command to work both in math mode and
in text mode, the suggested method was to define something like:

    \newcommand{\Gp}{\mbox{$G_p$}}

Unfortunately, the \mbox stops \Gp changing size correctly in (for
instance) subscripts or a fraction. In LaTeX2e you can define it thus:

    \newcommand{\Gp}{\ensuremath{G_p}}

Now \Gp will work correctly in all contexts. This is because the
\ensuremath does nothing, producing simply G_p, when \Gp is used
within math mode; but it ensures that math mode is entered (and
exited) as required when \Gp is used in text mode.

# The font changing in math

Most of the fonts used within math mode do not need to be explicitly
invoked; but to use letters from a range of fonts, the following class
of commands is provided.

    \mathrm {<letters>}
    \mathnormal {<letters>}
    \mathcal {<letters>}
    \mathbf {<letters>}
    \mathsf {<letters>}
    \mathtt {<letters>}
    \mathit {<letters>}

These are also one-argument commands which take as an argument the
letters which are to be typeset in the particular font. The argument
is processed in math mode so spaces within it will be ignored. Only
letters, digits and accents have their font changed, for example
$\mathbf{\tilde A \times 1}$ produces tex2html_wrap_inline986 .

# Controlling page breaks

Sometimes it is necessary, for a final version of a document, to
"help" LaTeX break the pages in the best way. LaTeX 2.09 had a variety
of commands for this situation: \clearpage, \pagebreak etc. LaTeX2e
provides, in addition, commands which can produce longer pages as well
as shorter ones.

    \enlargethispage {<size>}
    \enlargethispage* {<size>}

These commands increase the height of a page (from its normal value of
\textheight) by the specified amount <size>, a rigid length. This
change affects only the current page.

This can be used, for example, to allow an extra line to be fitted
onto the page or, with a negative length, to produce a page shorter
than normal.

The star form also shrinks any vertical white space on the page as
much as possible, so as to fit the maximum amount of text on the page.

These commands do not change the position of the footer text; thus, if
a page is lengthened too far, the main text may overprint the footer.

# Line endings

The command \\, which is used to indicate a line-end in various
places, is now a robust command when used within arguments such as
section titles.

Also, because it is often necessary to distinguish which type of line
is to be ended, we have introduced the following new command; it has
the same argument syntax as that of \\.

    \tabularnewline [<vertical-space>]

One example of its use is when the text in the last column of a
tabular environment is set with \raggedright; then \tabularnewline can
be used to indicate the end of a row of the tabular, whilst \\ will
indicate the end of a line of text in a paragraph within the column.
This command can be used in the array environment as well as tabular,
and also the extended versions of these environments offered by the
array and longtable packages in the tools collection.

# Measuring things

The first of these next commands was in LaTeX 2.09. The two new
commands are the obvious analogues.

    \settowidth {<length-cmd>} {<lr text>}
    \settoheight {<length-cmd>} {<lr text>}
    \settodepth {<length-cmd>} {<lr text>}

# Boxes

These next three commands for making LR-boxes all existed in LaTeX
2.09. They have been enhanced in two ways.

    \makebox [<width>] [<pos>] {<text>}
    \framebox [<width>] [<pos>] {<text>}
    \savebox {<cmd>} [<width>] [<pos>] {<text>}

One small but far-reaching change for LaTeX2e is that, within the
<width> argument only, four special lengths can be used. These are all
dimensions of the box that would be produced by using simply
\mbox{<text>}:

    \height      : its height above the baseline;
    \depth       : its depth below the baseline;
    \totalheight : the sum of \height and \depth;
    \width       : its width.

Thus, to put "hello" in the centre of a box of twice its natural width, you would use:

    \makebox[2\width]{hello}

Or you could put f into a square box, like this: tex2html_wrap984

    \framebox{\makebox[\totalheight]{\itshape f\/}}

Note that it is the total width of the framed box, including the
frame, which is set to \totalheight. The other change is a new
possibility for <pos>: s has been added to l and r. If <pos> is s
then the text is stretched the full length of the box, making use
of any "rubber lengths" (including any inter-word spaces) in the
contents of the box. If no such "rubber length" is present, an
"underfull box" will probably be produced.

    \parbox [<pos>] [<height>] [<inner-pos>] {<width>} {<text>}
    \begin{minipage} [<pos>] [<height>] [<inner-pos>] {<width>}
    <text>
    \end{minipage}

As for the box commands above, \height, \width, etc. may be used in
the [<height>] argument to denote the natural dimensions of the box.

The <inner-pos> argument is new in LaTeX2e. It is the vertical
equivalent to the <pos> argument for \makebox, etc, determining the
position of <text> within the box. The <inner-pos> may be any one of
t, b, c, or s, denoting top, bottom, centered, or "stretched"
alignment respectively. When the <inner-pos> argument is not
specified, LaTeX gives it same value as <pos> (this could be the
latter's default value).

    \begin{lrbox} {<cmd>}
    <text>
    \end{lrbox}

This is an environment which does not directly print anything. Its
effect is to save the typeset <text> in the bin <cmd>. Thus it is like
\sbox {<cmd>} {<text>}, except that any white space before or after
the contents <text> is ignored.

This is very useful as it enables both the \verb command and the
verbatim environment to be used within <text>.

It also makes it possible to define, for example, a "framed box"
environment. This is done by first using this environment to save some
text in a bin <cmd> and then calling \fbox{\usebox{<cmd>}}.

The following example defines an environment, called fmpage, that is a
framed version of minipage.

    \newsavebox{\fmbox}
    \newenvironment{fmpage}[1]
      {\begin{lrbox}{\fmbox}\begin{minipage}{#1}}
      {\end{minipage}\end{lrbox}\fbox{\usebox{\fmbox}}}

# Defining new commands

In LaTeX, commands can have both mandatory and optional arguments, for
example in:

    \documentclass[11pt]{article}

the 11pt argument is optional, whereas the article class name is
mandatory. In LaTeX 2.09 users could define commands with arguments,
but these had to be mandatory arguments. With LaTeX2e, users can now
define commands and environments which also have one optional
argument.

    \newcommand {<cmd>} [<num>] [<default>] {<definition>}
    \renewcommand {<cmd>} [<num>] [<default>] {<definition>}

These commands have a new, second, optional argument; this is used for
defining commands which themselves take one optional argument. This
new argument is best introduced by means of a simple (and hence not
very practical) example:

    \newcommand{\example}[2][YYY]{Mandatory arg: #2;
                                  Optional arg: #1.}

This defines \example to be a command with two arguments, referred to
as #1 and #2 in the {<definition>}--nothing new so far. But by adding
a second optional argument to this \newcommand (the [YYY]) the first
argument (#1) of the newly defined command \example is made optional
with its default value being YYY. Thus the usage of \example is
either:

    \example{BBB}

which prints:

    Mandatory arg: BBB; Optional arg: YYY.

or:
    \example[XXX]{AAA}

which prints:

    Mandatory arg: AAA; Optional arg: XXX.

The default value of the optional argument is YYY. This value is
specified as the [<default>] argument of the \newcommand that created
\example.

As another more useful example, the definition:

    \newcommand{\seq}[2][n]{\lbrace #2_{0},\ldots,\,#2_{#1} \rbrace}

means that the input ``$\seq{a}$`` produces the formula where the last
element is &sub{a/n}, whereas the input ``$\seq[k]{x}$`` produces the
formula where the last element is &sub{x/k}. In summary, the command:

    \newcommand {<cmd>} [<num>] [<default>] {<definition>}

defines <cmd> to be a command with <num> arguments, the first of which
is optional and has default value <default>. Note that there can only
be one optional argument but, as before, there can be up to nine
arguments in total.

    \newenvironment {<cmd>} [<num>] [<default>] {<beg-def>} {<end-def>}
    \renewenvironment {<cmd>} [<num>] [<default>] {<beg-def>} {<end-def>}

LaTeX2e also supports the creation of environments that have one
optional argument. Thus the syntax of these two commands has been
extended in the same way as that of \newcommand.

    \providecommand {<cmd>} [<num>] [<default>] {<definition>}

This takes the same arguments as \newcommand. If <cmd> is already
defined then the existing definition is kept; but if it is currently
undefined then the effect of \providecommand is to define <cmd> just
as if \newcommand had been used.

All the above five "defining commands" now have "-forms" ending
that are usually the better form to use when defining commands
with arguments, unless any of these arguments is intended to
contain whole paragraphs of text. Moreover, if you ever do find
yourself needing to use the non-star form then you should ask
whether that argument would not better be treated as the contents
of a suitably defined environment.

The commands produced by the above five "defining commands" are now
robust.

# The document structure for the book class

The book document class introduces new commands to indicate document structure.

    \frontmatter
    \mainmatter
    \backmatter

These commands indicate the beginning of the front matter (title page,
table of contents and prefaces), main matter (main text) and back
matter (bibliography, indexes and colophon).

# The preamble commands

The changes to the preamble commands are intentionally designed to
make LaTeX2e documents look clearly different from old documents. The
commands should be used only before \begin{document}.

+ \documentclass [<option-list>] {<class-name>} [<release-date>]

  This command replaces the LaTeX 2.09 command \documentstyle. There
  must be exactly one \documentclass command in a document; and it
  must come after the filecontents environments, if any, but before
  any other commands. The <option-list> is a list of options, each of
  which may modify the formatting of elements which are defined in the
  <class-name> file, as well as those in all following \usepackage
  commands (see below). The optional argument <release-date> can be
  used to specify the earliest desired release date of the class file;
  it should contain a date in the format YYYY/MM/DD. If a version of
  the class older than this date is found, a warning is issued.

  For example, to specify a two-column article, using a version of
  article.cls released after June 1994, you specify:

  ```
  \documentclass[twocolumn]{article}[1994/06/01]
  ```

+ \documentstyle [<option-list>] {<class-name>}

  This command is still supported for compatibility with old files. It
  is essentially the same as \documentclass except that it invokes
  LaTeX 2.09 compatibility mode. It also causes any options in the
  <option-list> that are not processed by the class file to be loaded
  as packages after the class has been loaded. See Section 4 for more
  details on LaTeX 2.09 compatibility mode.

+ \usepackage [<option-list>] {<package-name>} [<release-date>]

  Any number of \usepackage commands is allowed. Each package file (as
  denoted by <package-name>) defines new elements (or modifies those
  defined in the class file loaded by the <class-name> argument of the
  \documentclass command). A package file thus extends the range of
  documents which can be processed.

  The <option-list> argument can contain a list of options, each of
  which can modify the formatting of elements which are defined in
  this <package-name> file.

  As above, <release-date> can contain the earliest desired release
  date of the package file in the format YYYY/MM/DD; if an older
  version of the package is found, a warning is issued.

  For example, to load the graphics package for the dvips driver,
  using a version of graphics.sty released after June 1994, you write:

  ```
  \usepackage[dvips]{graphics}[1994/06/01]
  ```

  Each package is loaded only once. If the same package is requested
  more than once, nothing happens in the second or following attempt
  unless the package has been requested with options that were not
  given in the original \usepackage. If such extra options are
  specified then an error message is produced. See Section 6 how to
  resolve this problem. 
  
  As well as processing the options given in the <option-list> of the
  \usepackage command, each package processes the <option-list> of the
  \documentclass command as well. This means that any option which
  should be processed by every package (to be precise, by every
  package that specifies an action for it) can be specified just once,
  in the \documentclass command, rather than being repeated for each
  package that needs it.

+ \listfiles

  If this command is placed in the preamble then a list of the files
  read in (as a result of processing the document) will be displayed
  on the terminal (and in the log file) at the end of the run. Where
  possible, a short description will also be produced.

  Warning: this command will list only files which were read using
  LaTeX commands such as \input{<file>} or \include{<file>}. If the
  file was read using the primitive TeX syntax \input file (without {
  } braces around the file name) then it will not be listed; failure
  to use the LaTeX form with the braces can cause more severe
  problems, possibly leading to overwriting important files, so always
  put in the braces.

+ \setcounter{errorcontextlines} {<num>}

  TeX 3 introduced a new primitive \errorcontextlines which controls
  the format of error messages. LaTeX2e provides an interface to this
  through the standard \setcounter command. As most LaTeX users do not
  want to see the internal definitions of LaTeX commands each time
  they make an error, LaTeX2e sets this to -1 by default.

# Initial commands

Initial commands can appear only before the \documentclass line.

    \begin{filecontents} {<file-name>}
    <file-contents>
    \end{filecontents}

The filecontents environment is intended for bundling within a single
document file the contents of packages, options, or other files. When
the document file is run through LaTeX2e the body of this environment
is written verbatim (preceded by a comment line) to a file whose name
is given as the environment's only argument. However, if that file
already exists then nothing happens except for an information message.

Only normal ASCII text characters (7-bit visible text) should be
included in a filecontents environment. Anything else, such as tab
characters, form-feeds or 8-bit characters, should not be included in
a filecontents environment.

Tabs and form feeds produce a warning, explaining that they are turned
into spaces or blank lines, respectively. What happens to 8-bit
characters depends on the TeX installation and is in general
unpredictable.

The filecontents environment is used for including LaTeX files. For
other plain text files (such as Encapsulated PostScript files), you
should use the ``filecontents*`` environment which does not add a comment
line.

These environments are allowed only before \documentclass. This
ensures that any packages that have been bundled in the document are
present when needed.

# Text commands: all encodings

One of the main differences between LaTeX2e and LaTeX 2.09 is that
LaTeX2e can deal with fonts in arbitrary encodings. (A font encoding
is the sequence of characters in the font--for example a Cyrillic font
would have a different encoding from a Greek font.)

The two major font encodings that are used for Latin languages such as
English or German are OT1 (Donald Knuth's 7-bit encoding, which has
been used during most of TeX's lifetime) and T1 (the new 8-bit `Cork'
encoding).

LaTeX 2.09 only supported the OT1 encoding, whereas LaTeX2e has
support for both OT1 and T1 built-in. The next section will cover the
new commands which are available if you have T1-encoded fonts. This
section describes new commands which are available in all encodings.

Most of these commands provide characters which were available in
LaTeX 2.09 already. For example \textemdash gives an "em dash", which
was available in LaTeX 2.09 by typing ---. However, some fonts (for
example a Greek font) may not have the --- ligature, but you will
still be able to access an em dash by typing \textemdash.

+ \r{<text>}

  This command gives a `ring' accent, for example `o' can be typed \r{o}.

+ \SS

  This command produces a German `SS', that is a capital `ß'. This
  letter can hyphenate differently from `SS', so is needed for
  entering all-caps German.

+ \textcircled{<text>}

  This command is used to build `circled characters' such as
  \copyright. For example \textcircled{a} produces tex2html_wrap1000 .

+ \textcompwordmark

  This command is used to separate letters which would normally
  ligature. For example the ligature of "f" and "i" conglumated
  together can be produced by typing
  ``f\textcompwordmark i``. Note that the "f" and
  "i" have not ligatured to produce "fi". This is rarely useful in
  English ("shelfful" is a rare example of where it might be used) but
  is used in languages such as German.

+ \textvisiblespace

  This command produces a "visible space" character similar
  to U+2423 OPEN BOX, with a entity name ``&blank;``.

+ \textemdash 
+ \textendash 
+ \textexclamdown 
+ \textquestiondown
+ \textquotedblleft 
+ \textquotedblright 
+ \textquoteleft 
+ \textquoteright

  These commands produce characters which would otherwise be accessed
  via ligatures. The reason for making these characters directly
  accessible is so that they will work in encodings which do not have
  these characters.

+ \textbullet 
+ \textperiodcentered

  These commands allow access to characters which were previously only
  available in math mode:

  ```verbatim
  Math           Text Command
  \bullet        \textbullet
  \cdot          \textperiodcentered
  ```

+ \textbackslash 
+ \textbar 
+ \textless 
+ \textgreater

  These commands allow access to ASCII characters which were only
  available in verbatim or math mode:

  ```verbatim
  Math           Text Command
  \blackslash    \textbackslash
  \mid           \textbar
  <              \textless
  >              \textgreater
  ```

+ \textasciicircum 
+ \textasciitilde

  These commands allow access to ASCII characters which were
  previously only available in verbatim:

  ```verbatim
  Math           Text Command
  ^              \textasciicircum
  ~              \textasciitilde
  ```

+ \textregistered 
+ \texttrademark

  These commands provide the "registered trademark" (R) and
  "trademark" (TM) symbols.

+ \i
+ \j

  These two commands each provides the "dotless i" and "dotless j"
  in text mode. For math mode, use "\imath" and "\jmath" instead.

# Text commands: the T1 encoding

The OT1 font encoding is fine for typesetting in English, but has
problems when typesetting other languages. The T1 encoding solves some
of these problems, by providing extra characters (such as
"eth" and "thorn"), and it allows words containing accented letters to
be hyphenated (as long as you have a package like babel which allows
for non-American hyphenation).

This section describes the commands you can use if you have the T1
fonts. To use them, you need to get the "ec fonts", or the T1-encoded
PostScript fonts, as used by psnfss. All these fonts are available by
anonymous ftp in the Comprehensive TeX Archive, and are also available
on the CD-ROMs 4all TeX and TeX Live (both available from the TeX
Users Group).

You can then select the T1 fonts by saying:

    \usepackage[T1]{fontenc}

This will allow you to use the commands in this section. Note: Since
this document must be processable on any site running an up-to-date
LaTeX, it does not contain any characters that are present only in
T1-encoded fonts. This means that this document cannot show you what
these glyphs look like! If you want to see them then run LaTeX on the
document fontsmpl and respond "cmr" when it prompts you for a family
name.

+ \k{<text>}

  This command produces an "ogonek" accent.

+ \DH 
+ \DJ 
+ \NG 
+ \TH 
+ \dh 
+ \dj 
+ \ng 
+ \th

  These commands produce characters "eth", "dbar", "eng", and "thorn".

+ \guillemotleft 
+ \guillemotright 
+ \guilsinglleft 
+ \guilsinglright
+ \quotedblbase 
+ \quotesinglbase 
+ \textquotedbl

  These commands produce various sorts of quotation mark. 

# Old commands

+ \samepage

  The \samepage command still exists but is no longer being
  maintained. This is because it only ever worked erratically; it does
  not guarantee that there will be no page-breaks within its scope;
  and it can cause footnotes and marginals to be wrongly placed.

  We recommend using \enlargethispage in conjunction with page-break
  commands such as \newpage and \pagebreak to help control page
  breaks.

+ \SLiTeX

  Since SLiTeX no longer exists, the logo is no longer defined in the
  LaTeX kernel. A suitable replacement is \textsc{Sli\TeX}. The SLiTeX
  logo is defined in LaTeX 2.09 compatibility mode.

+ \mho 
+ \Join 
+ \Box 
+ \Diamond 
+ \leadsto
+ \sqsubset 
+ \sqsupset 
+ \lhd 
+ \unlhd 
+ \rhd 
+ \unrhd

  These symbols are contained in the LaTeX symbol font, which was
  automatically loaded by LaTeX 2.09. However, TeX has room for only
  sixteen math font families; thus many users discovered that they ran
  out. Because of this, LaTeX does not load the LaTeX symbol font
  unless you use the latexsym package.

  These symbols are also made available, using different fonts, by the
  amsfonts package, which also defines a large number of other
  symbols. It is supplied by the American Mathematical Society.

  The latexsym package is loaded automatically in LaTeX 2.09
  compatibility mode.

# Standard packages

The following packages are distributed with LaTeX:

+ alltt

  This package provides the alltt environment, which is like the verbatim
  environment except that \, {, and } have their usual meanings. It is
  described in alltt.dtx and LaTeX: A Document Preparation System.

+ doc

  This is the basic package for typesetting the documentation of LaTeX
  programs. It is described in doc.dtx and in The LaTeX Companion.

+ exscale

  This provides scaled versions of the math extension font. It is described in
  exscale.dtx and The LaTeX Companion.

+ fontenc

  This is used to specify which font encoding LaTeX should use. It is described
  in ltoutenc.dtx.

+ graphpap

  This package defines the \graphpaper command; this can be used in a picture
  environment.

+ ifthen

  Provides commands of the form "if...then do... otherwise do...". It is
  described in ifthen.dtx and The LaTeX Companion.

+ inputenc

  This is used to specify which input encoding LaTeX should use. It is
  described in inputenc.dtx.

+ latexsym

  LaTeX2e no longer loads the LaTeX symbol font by default. To access it, you
  should use the latexsym package. It is described in latexsym.dtx and in The
  LaTeX Companion; see also Section 6.

+ makeidx

  This provides commands for producing indexes. It is described in LaTeX: A
  Document Preparation System and in The LaTeX Companion.

+ newlfont

  This is used to emulate the font commands of LaTeX 2.09 with the New Font
  Selection Scheme. It is described in The LaTeX Companion.

+ oldlfont

  This is used to emulate the font commands of LaTeX 2.09. It is described in
  The LaTeX Companion.

+ showidx

  This causes the argument of each \index command to be printed on the page
  where it occurs. It is described in LaTeX: A Document Preparation System.

+ syntonly

  This is used to process a document without typesetting it. It is described in
  syntonly.dtx and in The LaTeX Companion.

+ tracefnt

  This allows you to control how much information about LaTeX's font loading is
  displayed. It is described in The LaTeX Companion.

# Related software

The following software should be available from the same distributor as your
copy of LaTeX2e. You should obtain at least the graphics and tools collections
in order to have all the files described in LaTeX: A Document Preparation
System. The amsmath package (part of amslatex and formerly known as amstex) and
babel are also mentioned in the list of `standard packages' in section C.5.2 of
that book.

+ amslatex

  Advanced mathematical typesetting from the American Mathematical Society.
  This includes the amsmath package; it provides many commands for typesetting
  mathematical formulas of higher complexity. It is produced and supported by
  the American Mathematical Society and it is described in The LaTeX Companion.

+ babel

  This package and related files support typesetting in many languages. It is
  described in The LaTeX Companion.

+ graphics

  This includes the graphics package which provides support for the inclusion
  and transformation of graphics, including files produced by other software.
  Also included, is the color package which provides support for typesetting in
  colour. Both these packages are described in LaTeX: A Document Preparation
  System.
  
+ mfnfss 

  Everything you need (except the fonts themselves) for typesetting with a
  large range of bit-map (Metafont) fonts.
 
+ psnfss 

  Everything you need (except the fonts themselves) for typesetting with a
  large range of Type 1 (PostScript) fonts.
 
+ tools 

  Miscellaneous packages written by the LaTeX3 project team.  These packages
  come with documentation and each of them is also described in at least one of
  the books The LaTeX Companion and LaTeX: A Document Preparation System.

# Tools

This collection of packages includes, at least, the following (some
files may have slightly different names on certain systems):

+ array

  Extended versions of the environments array, tabular and ``tabular*``, with
  many extra features.
 
+ dcolumn 

  Alignment on "decimal points" in tabular entries. Requires the array
  package.
 
+ delarray 

  Adds "large delimiters" around arrays. Requires array.
 
+ hhline 

  Finer control over horizontal rules in tables. Requires array.
 
+ longtable 

  Multi-page tables. (Does not require array, but it uses the
  extended features if both are loaded.)
 
+ tabularx 

  Defines a tabularx environment that is similar to ``tabular*`` but
  it modifies the column widths, rather than the inter-column space, to achieve
  the desired table width.
 
+ afterpage Place text after the current page.

+ bm

  Access bold math symbols.
 
+ enumerate

  Extended version of the enumerate environment.
 
+ fontsmpl

  Package and test file for producing "font samples".
 
+ ftnright

  Place all footnotes in the right-hand column in two-column mode.
 
+ indentfirst

  Indent the first paragraph of sections, etc.
 
+ layout

  Show the page layout defined by the current document class.
 
+ multicol

  Typeset text in columns, with the length of the columns "balanced".
 
+ rawfonts

  Preload fonts using the old internal font names of LaTeX 2.09. See Section 6.2.
 
+ somedefs

  Selective handling of package options. (Used by the rawfonts package.)
 
+ showkeys

  Prints the "keys" used by \label, \ref, \cite etc.; useful whilst drafting.
 
+ theorem

  Flexible declaration of "theorem-like" environments.
 
+ varioref

  "Smart" handling of page references.
 
+ verbatim

  Flexible extension of the verbatim environment.
 
+ xr

  Cross reference other "external" documents.
 
+ xspace

  "Smart space" command that helps you to avoid the common mistake of missing
  spaces after command names.

# The "aux" files

You can delete all of them whenever needed, typically when you are
finished with a project. But since some of them store things that are
used on subsequent compilations (e.g. citations, cross-references,
tables of contents etc.) it's generally advisable to keep them around
unless they need to be deleted due to some error. See Will cruft from
a previous compile ever change the final look of my document for more
discussion (duplicate?). – Alan Munn Aug 29 '18 at 15:43

You also can ask the compiler to run the compiler with the switch,
say, --aux-directory=./TeXAux, which will store most of the auxiliary
files in a TeXAux subdirectory of the current directory (and will
create one if there is no such directory so far). – Bernard Aug 29 '18
at 15:53

TexnicCenter has a Build->Clean Project option which will delete all
the temp files for you. – John Kormylo Aug 29 '18 at 16:54

# Font sizes

Following is a list of font sizes offered by LATEX.

     LATEX           factor      
     -------------------------
     tiny            0.5         
     scriptsize      0.7         
     footnotesize    0.8         
     small           0.9         
     normalsize      1.0         
     large           1.2         
     Large           1.4         
     LARGE           1.7         
     huge            2.0         
     Huge            2.3         

For example, change the font size for a part of the text
place the text between the set of brackets:

    In this example the {\huge huge font size} is 
    set and the {\footnotesize Foot note size also}. 
    There's a fairly large set of font sizes.

# Supporting \mathbb{...} 

In order to support the ``\mathbb{...}`` command in math mode,
the "bbold" package must be included.

+ \usepackage{bbold}

  This document describes the bbold math alphabet. This is an open (or
  ‘blackboard bold’) geometric sans serif, intended mainly for use in
  mathematics, but which may prove useful for decorative work.

  To use the fonts in LATEX2ε, you select the bbold package, and then
  use the \mathbb command to get blackboard bold mathematics, \textbb
  for text, or \bbfamily for longer text. The full font is:

# The colon character

To generate a colon character one needs to use 

    \text{: }

# Minipage

The minipage is often used to put things next to each other, which can
otherwise be hard put together. For example, two pictures side by side, two
tables next to a text or a picture or vice versa. The idea behind the minipage
command is that within an existing page "built in" an additional page. By this
one has the opportunity to use this new page, for example, set two pictures
side by side, then just set two minipages side by side. Here than in Figure 1
is set in the first and Figure 2 in the second minipage.

    \begin{minipage}[t][5cm][b]{0.5\textwidth}

This minipage now has a defined height of 5cm, and the content will now be
aligned to the bottom of the minipage.

Put three pictures side by side, where you should set the width of the image
using width = \textwidth, if they are too wide.

    \begin{minipage}[t]{0.3\textwidth}
    \includegraphics[width=\textwidth]{pic1}
    \end{minipage}
    \begin{minipage}[t]{0.3\textwidth}
    \includegraphics[width=\textwidth]{pic2}
    \end{minipage}
    \begin{minipage}[t]{0.3\textwidth}
    \includegraphics[width=\textwidth]{pic3}
    \end{minipage}

# The "columns" environment in Beamer

The columns environment is only available in the beamer document-class and
might therefore be lesser known.

Basic command structure:

    \begin{columns}
        \begin{column}{0.48\textwidth}
            %Content
        \end{column}
        \begin{column}{0.48\textwidth}
            %Content
            \includegraphics[width=\linewidth]{image-clock.png}
        \end{column}
    \end{columns}

Within the "columns" environment, each begin/end "column" environment is to
start a new column and the second argument expresses the width of the column in
LATEX length, such as the percentage of the current text width.  Inside the
"column" environment the "\linewidth" is set to the width of the column itself
and can be used to typeset an image the width of the column.

# The "multicol" environment 

The "multicol" environment provided by the "multicol" package allows you to let
the text flow between two or more columns.  Paragraph divisions are done
automatically, or you can insert \columnbreak to manually force text into the
next column. The "multicol" environment works well with Beamer. Following is an
example placed inside a "frame" environment.

    \usepackage{multicol}
    \begin{frame}{Frame Title}
      \begin{multicols}{2} % two columns
        "Lorem ipsum dolor sit amet, consectetur adipiscing 
        elit, sed do eiusmod tempor incididunt ut labore 
        et dolore magna aliqua.
        \columnbreak
        Ut enim ad minim veniam, quis nostrud exercitation 
        ullamco laboris nisi ut aliquip ex ea commodo 
        consequat. 
        \includegraphics[width=4cm]{image-clock.png}
      \end{multicols}
    \end{frame}

# The "tabbing" environment in Beamer

The "tabbing" environment in Beamer works. However, it has a little
anomaly such that if two minipages are placed side-by-side, and 
each contains a single "tabbing", then the minipage will be 
placed right next to each side without being set to the 
given width as was specified. Following is minimum working 
example, and can be observed that the two tabbing was placed 
side-by-side by without being stretched evenly across the page
as was desired.

    \begin{frame}{The minipage environment}
    \begin{minipage}{0.47\textwidth}
      \begin{tabbing}
      \kill
      A = \(\text{A}\) = A\\
      A = \(\frac {\text{A}} {\text{B}}\) =\\
      A = \begin{tabular}{@{}c@{}}{A}\\\hline{B}\end{tabular}\\
      \end{tabbing}
    \end{minipage}
    \begin{minipage}{0.47\textwidth}
      \begin{tabbing}
      \kill
      A = \(\text{A}\) = A\\
      A = \(\frac {\text{A}} {\text{B}}\) =\\
      A = \begin{tabular}{@{}c@{}}{A}\\\hline{B}\end{tabular}\\
      \end{tabbing}
    \end{minipage}
    \end{frame}

The solution that seems to work in this case was to insert a
"~" after the end-tabbing.

    \begin{frame}{The minipage environment}
    \begin{minipage}{0.47\textwidth}
      \begin{tabbing}
      \kill
      A = \(\text{A}\) = A\\
      A = \(\frac {\text{A}} {\text{B}}\) =\\
      A = \begin{tabular}{@{}c@{}}{A}\\\hline{B}\end{tabular}\\
      \end{tabbing}~
    \end{minipage}
    \begin{minipage}{0.47\textwidth}
      \begin{tabbing}
      \kill
      A = \(\text{A}\) = A\\
      A = \(\frac {\text{A}} {\text{B}}\) =\\
      A = \begin{tabular}{@{}c@{}}{A}\\\hline{B}\end{tabular}\\
      \end{tabbing}~
    \end{minipage}
    \end{frame}

# The "description" 

The description environment is a listing variant in LATEX that can be used for
a glossary, among other things. Example 1

    \begin{description}
    \item[A key point]
    There must be something here to see the effect.
    \item[Another key point] and text behind it
    \end{description}

If immediate line break is needed after the item text, place a \hfill after
the item text and then a double-backslash.

    \begin{description}
    \item[A key point]\hfill \\
    A line break is not enough to bring the text
    \item[Another key point]\hfill \\  down.
    \end{description}

# Using arrows

Latex provides a huge number of different arrow symbols. Arrows would be used
within math enviroment. If you want to use them in text just put the arrow
command between two dollar-signs like this example: 

    $\uparrow$ 

Following are arrows supported by latex2e natively.

    \twoheadleftarrow    \twoheadrightarrow
    \Lsh                 \Rsh
    \leftleftarrows      \rightrightarrows
    \upuparrows          \downdownarrows
    \rightleftarrows     \leftrightarrows
    \Lleftarrow          \Rrightarrow
    \leftarrowtail       \rightarrowtail
    \rightsquigarrow     \leftrightsquigarrow
    \looparrowleft       \looparrowright
    \circlearrowleft     \circlearrowright
    \curvearrowleft      \curvearrowright
    \upharpoonleft       \upharpoonright
    \downharpoonleft     \downharpoonright
    \nleftarrow          \nrightarrow
    \nLeftarrow          \nRightarrow
    \nleftrightarrow     \nLeftrightarrow

# Using arrow with text

First the default ones, then amssymb version and last the symbols of usepackage extarrows:

Following is to show a text with a left pointing arrow on top of it.

    \overleftarrow{Text}

Following is to show a text with a right pointing arrow on top of it.

    \overrightarrow{Text}

By using package amssymb, we can have following additional commands.
Following is to show a text with left pointing arrow underneath it.

    \underleftarrow{Text}
    
Following is to show a text with right pointing arrow underneath it.

    \underrightarrow{Text}

Following is to show a text with left-right pointing arrow on top of it.

    \overleftrightarrow{Text}

Following is to show a text with left-right pointing arrow underneath it.

    \underleftrightarrow{Text}

Note that all prevous commands are to show a text as the main object and arrows
are decorations of it. Following commands are designed to show an arrow as the
main object and texts are the decorations of the arrow; sometimes being on top
of the arrow and other times being below it. Following is a list of
horizontally oriented arrows where it can have text attached at the top (upper
text) and/or underneath it (lower text). Almost all of them have the capability
to automatically adjust the length of the arrow itself depending on the longest
of the text (extra long text).

    \xLongleftarrow[\text{lower Text}]{\text{upper Text}}  
    \xLongleftarrow{\text{extra long text}}  
    \xLongrightarrow[\text{lower Text}]{\text{upper Text}}  
    \xLongrightarrow{\text{extra long text}}  
    \xLongleftrightarrow[\text{lower Text}]{\text{upper Text}}  
    \xLongleftrightarrow{\text{extra long text}}  
    \xLeftrightarrow[\text{lower Text}]{\text{upper Text}}  
    \xLeftrightarrow{\text{extra long text}}  
    \xlongleftrightarrow[\text{lower Text}]{\text{upper Text}}  
    \xlongleftrightarrow{\text{extra long text}}  
    \xlongrightarrow[\text{lower Text}]{\text{upper Text}}  
    \xlongrightarrow{\text{extra long text}}  
    \xlongrightarrow{}  
    \xleftrightarrow[\text{lower Text}]{\text{upper Text}}  
    \xleftrightarrow{\text{extra long text}}  
    \xlongleftarrow[\text{lower Text}]{\text{upper Text}}  
    \xlongleftarrow{\text{extra long text}}  
    \xlongleftarrow{}  
    \xleftarrow[\text{lower Text}]{\text{upper Text}}  
    \xleftarrow{\text{extra long text}}  
    \xrightarrow[\text{lower Text}]{\text{upper Text}}  
    \xrightarrow{\text{extra long text}}  
    \xlongequal[\text{lower Text}]{\text{upper Text}}  
    \xlongequal{\text{extra long text}}  

# The "tabbing" environment

With the tabbing environment it is possible to set tables as it was usual on a
typewriter in the past.

    \begin{tabbing}
    Text \= more text \= even more text \= last text \\
    Second row \>  \> more content \\
    ...
    \end{tabbing}

Especially beginners should not use tabbing, because there is a large selection
of table packages and the handling of the commands within the tabbing
environment is not very intuitive. For the sake of completeness, the commands
are listed here, although I would advise against their use.

- With \= a Tab Stop is set.
- The command \> causes LaTeX to advance to the next tab stop.
- With \< it is possible to set something to the left of the local border
  without changing the border.
- \+ This moves the left edge of the next and all following commands one tab to
  the right.
- \- Moves the left border of the next and all following commands one tab to
  the left.
- With \‘ the text to the left of it is set before the next tab stop and the
  text to the right of it is set at the tab stop.
- With the command \~ everything in the column is moved to the previous column.
- With \kill at the end of the line, the set tab stop for the following lines
  is considered, but the text or the content in the line ending with \kill is
  not printed.

# The "array" environment

The array environment can be used to set mathematical tables respectively table
with math content within the math mode.

    \begin{array}{column_1column_2...column_n}
    column 1 entry & column 2 entry & ... & column n entry \\
    ...
    \end{array}

The number of columns and their orientation are defined by the letters l
(left-aligned), c (centered) and r (right-aligned) as in the tabular
environment. Again, the individual columns are separated by the & sign and the
line ends with a line break \\.

# Typesetting a "landscape" table

Some tables could become very wide, sometimes even wider as the paper width.
One solution could be taken the whole tabular in a small environment. But there
is a better way.  Solution An esay way is to change the orientation of the
table, by using usepackage lscape, which allows to change the orientation of
the page and therefor also the table.

    \documentclass{article}
    \usepackage{lscape}
    \begin{document}
    % An extra wide table
    \begin{landscape}
    \begin{tabular}{|c|c|c|}
    \hline
    Year & 2000 & 2001 \\
    \hline
    GPD in billions & 235  &  225 \\
    \hline
    \end{tabular}
    \end{landscape}
    \end{document}

# standard color names without "dvipsnames" option

Following are color names available when "xcolor" 
packages are included.

    black         darkgray          gray        
    lightgray     white             yellow        
    orange        red               purple        
    pink          magenta           violet        
    blue          cyan              teal
    green         lime              olive        
    brown

# Additional color names with "dvipsnames" option

Following are additional color names available 
when the "dvipsnames" option is included with the
"xcolor" package.

    Apricot        Cyan             Mahogany
    ProcessBlue    SpringGreen      Aquamarine
    Dandelion      Maroon           Purple
    Tan            BitterSweet      DarkOrchid
    Melon          RawSienna        TealBlue
    Black          Emerald          MidnightBlue
    Red            Thistle          Blue
    ForestGreen    Mulberry         RedOrange
    Turquoise      BlueGreen        Fuchsia
    NavyBlue       RedViolet        Violet
    BlueViolet     Goldenrod        OliveGreen
    Rhodamine      VioletRed        Brickred
    Gray           Orange           RoyalBlue
    White          Brown            Green
    OrangeRed      RoyalPurple      WildStrawberry
    BurntOrange    GreenYellow      Orchid
    RubineRed      Yellow           CadetBlue
    JungleGreen    Peach            Salmon
    YellowGreen    CarnationPink    Lavender
    Periwinkle     SeaGreen         YellowOrange
    Cerulean       LimeGreen        PineGreen
    Sepia          CornflowerBlue   Magenta
    Plum           SkyBlue

# Setting color of a tabular

Within tables, individual cells, columns, and rows can be colored. To be able
to use the commands, the option table must be set.

- The cellcolor{Color} command colors the cell in which it was set.

- The rowcolor{Color} command is set at the beginning of a row and colors it.

- The rowcolors[Option]{Beginning line}{Odd Lines Color}{Even Lines Color}
  command colors the lines accordingly. The command is placed before the table
  and affects all subsequent tables.

- The columncolor{Color} command colors a column in the appropriate color. This
  is used in the column definition of the table. The parentheses and the
  character are important here.

    \begin{tabular}{r>{\columncolor{red}}cl}
    A & B & C \\
    1 & 2 & 3 \\
    A & B & C \\
    \end{tabular}

# Change the font color of a text

The font color or text color can be changed with the \textcolor command. 
For example, to change part of the text so that its font color is blue,
we would insert the following command:

    \textcolor{blue}{Hello World}

# Change the background color 

To change the background we need to use something called a "colored background box". 
A colored background box is to be created using the command \colorbox. For example
to create a colored background box with text "Hello World" in it we can insert
the following command, which will create a box just wide enough to contain the
text and its background is set to red.

    \colorbox{red}{Hello World} 
    
It is also possible to combine both the colored background box with the font color
command to show a blue text on a red background.

    \colorbox{red}{\textcolor{blue}{Hello World}}

# Change the color for the entire page

The \pagecolor command is designed to change the color of the current page. For
example, the following command sets it so that the current page becomes red
instead of white.

    \pagecolor{red} 

# The "\color" command

The \color command changes the default color from black to the selected color.
For example, if the following command is inserted then  everything turns green,
not only the font, but also other elements like tables etc.

    \color{green} 

# Defining new colors

With xcolor you can define a new color With the command \definecolor.
For example, the following command would define a new color name "MyBlue" 
to a RGB value of RGB(0.9,0.9,0.1).

    \definecolor{MyBlue}{rgb}{0.9,0.9,1}

Note that this command can happen inside the document as well as within the
preamble.

# The "\fcolorbox" command

The \fcolorbox command is designed to create a framed box such that the border
and background color can be set individually.
For example, to create a framed box with border red and background white one
can insert the following command.

    \fcolorbox{red}{white}{$a^{2} + b^{2} = c^{2}$}

The \fcolorbox command can also work with \parbox.

    \fcolorbox{red}{white}{
    \parbox{0.3\textwidth}{
    \begin{itemize}
    \item listing
    \item key point 1
    \item key point 2
    \end{itemize}}
    }
    \fcolorbox{blue}{white}{
    \parbox{0.3\textwidth}{
    \begin{enumerate}
    \item enumeration
    \item key point
    \item key point
    \end{enumerate}}
    }

# Simulating "\textsubscript"

LATEX does not provide a "\textsubscript" command for typesetting a subscript.
But one can simulate this effect by utilizing the \raisebox command which has
been designed to raise or lower a text vertically. 

The \raisebox command expects two arguments. The first one is expected to be a
length that describes the relative position to raise or lower the subscript
text.  The second argument is the subscript text itself.  For the first
argument, if the length is positive then the text will be raised and otherwise
it will be lowered.  Following is a way to simulate the effect of
"\textsubscript{1}" by lowering the subscript text by "0.4ex" and also reducing
the font of the subscript text to "\scriptsize".

    \raisebox{-0.4ex}{\scriptsize{}1}

# Command to change font size

First, use a font like lmodern and then you can set the font size:

    {\fontsize{font size}{base line strech}\selectfont the text ...}

For example, to change a font to 40pt one can use the following command:

    {\fontsize{40}{40}\selectfont Hello World...}

# Vertical alignment for each cell within a "tabular"

The vertical alignment for each cell within a  "tabular" can be specified   
using the optional letter immediately after the beginning of tabular.

    \begin{tabular}[t]{ccc}
    ...
    \end{tabular}

The alignment is done on the basis of the top row.  The vertical alignment is
based on the middle of the table. This is also the default value for tables, so
it is not necessary to specify c.  Here the alignment takes place at the bottom
line.

# Column alignment for a "tabular"

The columns are formatted individually. On the one hand, the desired alignment
can be set to the following.

- for a left-justified column.
- for a centered column.
- for a right-justified column.

Note that the width of a column is automatically adjusted to cover the widest
cell within that column.

- ``@{Text}`` This creates a column in which each line automatically contains
  the entry Text.
- ``p{width}`` This creates a column with a fixed or predefined width. If the
  text within a cell, this column, is too long, it will be wrapped
  automatically. If a line break is to be set manually, it must be set with the
  \newline command.  By using the pipe sign, you can insert a visible seperator
  (a line) between the individual table columns.

The pipe sign | draws a vertical line over the entire height of the table. If
it is placed between two columns, the separator between them results. However,
it can also be set at the beginning and end of the column definition to
indicate the left or right margin of the table.  Within a table, you can also
mix columns with different alignment and fixed width and fixed contents.

    \begin{tabular}{|l|c|r|p{1.5cm}|@{.}|}
    \end{tabular}

If the table requires only one type of column or if a type repeats itself, the
asterisk operator can also be used. Following example would typeset three
paragraph columns each of which has a width of 2cm.

    \begin{tabular}{*{3}{p{2cm}}}
    \end{tabular}

Usually there are some visible spaces before the first column and after the
last.  If no visible spaces are desired then ``@{}`` should be used to place at
the beginning of the alignment as well as at the end.

    \begin{tabular{@{}ccc@{}}
    \end{tabular}

# Image file selection of "\includegraphics" command

For the "\includegraphics" command, if a graphic file is supplied without
an extension, then the image file will be selected based on their extension
in the order that is given. To specify this order, place the following
command in the preamble.

    \DeclareGraphicsExtensions{.png,.pdf}

\DeclareGraphicsExtensions{comma-separated list of file extensions} Declare the
filename extensions to try. This allows you to specify the order in which to
choose graphic formats when you include graphic files by giving the filename
without the extension, as in \includegraphics{functionplot}.

In this example, LaTeX will find files in the PNG format before PDF files.

    \DeclareGraphicsExtensions{.png,PNG,.pdf,.PDF}
      ...
    \includegraphics{lion}   % will find lion.png before lion.pdf 

Because the filename lion does not have a period, LaTeX uses the extension
list. For each directory in the graphics path (see \graphicspath), LaTeX will
try the extensions in the order given. If it does not find such a file after
trying all the directories and extensions then it reports ‘! LaTeX Error: File
`lion' not found’. Note that you must include the periods at the start of the
extensions.

Because GNU/Linux and Macintosh filenames are case sensitive, the list of file
extensions is case sensitive on those platforms. The Windows platform is not
case sensitive.

You are not required to include \DeclareGraphicsExtensions in your document;
the printer driver has a sensible default. For example, the most recent
pdftex.def has this extension list.

    .pdf,.png,.jpg,.mps,.jpeg,.jbig2,.jb2,.PDF,.PNG,.JPG,.JPEG,.JBIG2,.JB2 

To change the order, use the grfext package.

You can use this command anywhere in the document. You can use it more than
once. Show its value with 

    \makeatletter\typeout{\Gin@extensions}\makeatother

# Horizontal Spaces in LATEX

There are a number of horizontal spacing macros for LaTeX:

+ `\,` 

  inserts a .16667em space in text mode, or `\thinmuskip` (equivalent to
  3mu) in math mode; there's an equivalent `\thinspace` macro;

+ `\!` 

  is the negative equivalent to `\,`; there's an equivalent `\negthinspace`
  macro;

+ `\>` 

  inserts a .2222em space in text mode, or `\medmuskip` (equivalent
  to 4.0mu plus 2.0mu minus 4.0mu) in math mode; there's an equivalent
  \medspace;

+ `\:` 

  is the same as `\>`

+ `\negmedspace` 

  is the negative equivalent to `\medspace`;

+ `\;` 

  inserts a .2777em space in text mode, or `\thickmuskip` (equivalent to
  5.0mu plus 5.0mu) in math mode; there's an equivalent `\thickspace`;

+ `\negthickspace` 

  is the negative equivalent to `\thickspace`;

+ `\enspace` 

  inserts a space of .5em in text or math mode;

+ `\quad` 

  inserts a space of 1em in text or math mode;

+ `\qquad` 

  inserts a space of 2em in text or math mode;

+ `\kern{<len>}` 

  inserts a skip of <len> (may be negative) in text or math mode
  (a plain TeX skip); there's also a math-specific `\mkern <math len>`;

+ `\hskip{<len>}` 

  (similar to `\kern`);

+ `\hspace{<len>}` 

  inserts a space of length <len> (may be negative) in math or
  text mode (a LaTeX `\hskip`);

+ `\hphantom{<stuff>}` 

  inserts space of length equivalent to <stuff> in math or
  text mode. `\phantom{<stuff>}` is similar, inserting a horizontal and vertical
  space that matches <stuff>. Should be `\protected` when used in fragile
  commands (like `\caption` and sectional headings);

+ `\ ` 

  inserts what is called a "control space" (in text or math mode);

+ ` ` 

  inserts an inter-word space in text mode (and is gobbled in math mode).
  Similarly for `\space` and `{ }`.

+ `~` 

  inserts an "unbreakable" space (similar to an HTML `&nbsp;`) (in text or
  math mode);

+ `\hfill` 

  inserts a so-called "rubber length" or stretch between elements (in
  text or math mode). Note that you may need to provide a type of anchor to
  fill from/to; see What is the difference between 
  `\hspace*{\fill}` and `\hfill`.

# Two line labels in the description items

I would like to have two lines for long description names in the description
environment. The only help I could find is here. Where they have the following
code.

    \begin{description}
       % won't work
       \item[first line\\second line]
       % won't work
       \item[first line\newline second line]
       % will work
       \item[{\parbox[t]{3cm}{first line\\second line}}]
    \end{description}

For single-line item data, use \stackunder{}{}. For multi-line item data, use
\smash{\stackunder{}{}}.

Also shown is the use of \smash{\Longunderstack{...\\...\\...}} in the event
the label gets to be longer than 2 lines.

    \documentclass{article}
    \usepackage[usestackEOL]{stackengine}
    \usepackage{lipsum}
    \begin{document}
    \renewcommand\stackalignment{r}% RIGHT ALIGNED STACKS
    \renewcommand\stacktype{L}% MAKE STACKS OBEY FIXED BASELINESKIP
    \strutlongstacks{T}% TO GET PROPER SPACING FOR SINGLE-LINE ITEMS
    \begin{itemize}
       \item[\stackunder{first line}{second line}] blah blah
       \item[\smash{\stackunder{first line}{second line}}] \lipsum[4]
       \item[\smash{\Longunderstack{first\\second\\third}}] \lipsum[3]
    \end{itemize}
    \end{document}

# Draw Sloped Text for TikZ

    \documentclass{article}
    \usepackage{tikz}
    \begin{document}
    \begin{tikzpicture}
    \draw[] (0.00mm,0.00mm)--(20.00mm,20.00mm) ;
    \draw[] (0.00mm,0.00mm)--(20.00mm,20.00mm) node [pos=0.5, above, sloped] () {Hello World};
    \end{tikzpicture}
    \end{document}

Note that Tikz does not consider the entire path for placing the text. It only
seems to consider the last segment of the past. For instance, if a path
consists of two 'L' operation, then the text will only attemp to follow
the line segment of the second 'L' operation. In the second example the text
"Hello World" will only be placed on top of the second line segment which 
is a horizontal line.

    \documentclass{article}
    \usepackage{tikz}
    \begin{document}
    \begin{tikzpicture}
    \draw[] (0mm,0mm)--(20mm,20mm) ;
    \draw[] (0mm,0mm)--(20mm,20mm)--(40mm,20mm) node [pos=0.5, above, sloped] () {Hello World};
    \end{tikzpicture}
    \end{document}

The previous two example will actually draw the path and the text. If path isn't wanted
to be drawn, then setting opacity=0 inside the 'draw' command and then set it back to 1
at the side of the 'node' command will do.

    \documentclass{article}
    \usepackage{tikz}
    \begin{document}
    \begin{tikzpicture}
    \draw[opacity=0] (0mm,0mm)--(20mm,20mm)--(40mm,20mm) node [opacity=1, pos=0.5, above, sloped] () {Hello World};
    \end{tikzpicture}
    \end{document}

# Drop Shadow For TikZ

The "circular drop shadow" key can be set to allow for a drop shadow to be
shown. However, this should only work for a circle or ellipse.  Following is a
way to add a drop shadow to a circle or an ellipse.

    \draw[circular drop shadow] (32.5mm,25mm) circle [radius=5.00mm];

# PGF Shading

    \documentclass[tikz]{standalone}    
    \pgfdeclarefunctionalshading{Hermite-Gaussian modes}{\pgfpoint{-25bp}{-25bp}}{\pgfpoint{25bp}{25bp}}{}{
        10 atan sin 1000 mul cos 1 add
        exch
        10 atan sin 1000 mul cos 1 add
        mul 4 div
        dup dup
    }
    \begin{document}
        \tikz\path[shading=Hermite-Gaussian modes](-10,-10)rectangle(10,10);
    \end{document}

# The \displaylines command

The `\displaylines` command is used to display any number of centered formulas. A
double-backslash can be used in place of the \cr; the final \\ or \cr is
optional.

    \displaylines{
    a = a\cr
    \text{if } a=b \text{ then } b=a\cr
    \text{if } a=b \text{ and } b=c \text{ then } a=c
    }


# The \proof command

The `\proof` command can be used to typeset a process of proving an equation
that yields the result that was being said earlier.

    \begin{proof} The proof is a follows:
    \begin{align}
    (x+y)^3&=(x+y)(x+y)^2\\
           &=(x+y)(x^2+2xy+y^2)\\
           &=x^3+3x^2y+3xy^3+x^3.\qedhere
    \end{align}
    \end{proof}

# The "xtabular" environment

The "xtabular" environment is enabled by including the "xtab" package.
It is considered an extension to the "supertabular" package which has
claimed to have improved the following shortcomings:

1. Sometimes the top caption of a supertabular is printed on one page and the
body is printed on the following page(s). That is, there is a lonely caption.

2. Sometimes the last page of a supertabular consists of an empty table. That
is, just the head and foot of the table are printed.

3. If the number of lines in the first header for the table differs from the number
of lines in subsequent headers, then the continuation pages of the table may
be too short or, more troubling, too long.

Following is an example:

    \tablecaption{My Table}\label{mylabel}
    \tablehead{\hline {\bfseries Name} & {\bfseries Desc} \\}
    \tabletail{\hline \multicolumn{2}{r}{\itshape to be continued...} \\}
    \begin{xtabular}{|l|l|}
    \hline
    Hello & World \\
    \hline
    Hello & World \\
    \hline
    Hello & World \\
    \hline
    Hello & World \\
    \hline
    Hello & World \\
    \hline
    \end{xtabular}

The `\tabletail` command is only going to place a table tail on every table
that is to be continued, and will not be inserted into the table that is the
last part of the long table.  This command must contains contents that
describes a complete row, including the last double-slash.
However, if something is to be done for the last part of a long table, then
the `\tablelasttail{...}` command can be used for this purpose, for example,
to insert two horizontal rules.

    \tablelasttail{\hline \hline}

The `tablehead` command defines a set of commands to be inserted at the beginning
of each segmented tabular on each page. 
Similar to `tabletail`, it must also contains a content that describes
a complete row.

Note that if a horizontal rule is to be inserted at the top of a tablehead,
then `\hline` command will need to appear at the description. For the contents
of an actual tabular, if a `\hline` is to be inserted before the first row, and
between each two consecutive rows, and also after the last row, it seems that
if a table is to be broken in the middle to be split between two pages, the
accompanying `\hline` is always to accompany the part of the tabular that is
before the first row of the second tabular. This might be due to the fact where
the break always happens at the place where the double-backslash is, and therefore
pushes the `\hline` towards the second tabular after the split.

With that being said, it might be prudent to not having to include a `\hline` at the end
of a `\tablehead` definition, replying on the horizontal rule to appear as part of the 
tabular contents. However, for a `tabletail` definition things might get a little tricky
as additional details will have to be noticed, thus it might be prodent to not having
to include a horizontal rule at the end of a tail.

One thing to worth pointing out is the fact that before the start and after the
ending of a "xtabular" environment, there is no extra spaces allocated between
the last row and the start of the next paragraph, leaving absolute no vertical
space. To manually add a space, the following `\tablelasttail` command can be
defined to increase the space, or a "begin/end" of "flushleft" environment can
be used to surround the entire "xtabular".

    \tablelasttail{\multicolumn{2}{r}{} \smallskip}

For captions the "xtabular" envionment allows three different commands to be
used to describe the caption:

    \topcaption{...}
    \bottomcaption{...}
    \tablecaption{...}

The first two would have always placed the caption either at the top or at the
bottom.  The third one would place the caption at the "default' position, being
usually at the top but could potentially at other places.

Note that all the caption commands mentioned above DO NOT place captions in the
follow-on tabular components.  If additional captions are desired before each
break-down of a tabular, then the caption text will have to be manually
constructed.  This typically involves using the command `\tablefirsthead` and
`\tablehead`.  Following is an example snippet from the documentation of the
"xtab" package where the author was showing off his way of providing additional
captions for the follow-on components of a long tabular.

    \tablefirsthead{\hline \multicolumn{1}{|c|}{\textbf{Command}} &
        \multicolumn{1}{c|}{\textbf{Effect}} \\ \hline }
    \tablehead{\multicolumn{2}{c}%
        {{\captionsize\bfseries \tablename\ \thetable{} --
        continued from previous page}} \\
        \hline \multicolumn{1}{|c|}{\textbf{Command}} &
        \multicolumn{1}{c|}{\textbf{Effect}} \\ \hline }


# The command to merge two or more columns in a tabular

    \multicolumn{2}{c}{Item} \\

# Increase row spacing of a "tabular"

Re-define the \arraystretch command to set the space between rows:

    \renewcommand{\arraystretch}{1.5}

Default value is 1.0.

An alternative way to adjust the rule spacing is to add \noalign{\smallskip}
before or after the \hline and \cline{i-j} commands:

    \begin{tabular}{ | l | l | r | }
      \hline\noalign{\smallskip}
      \multicolumn{2}{c}{Item} \\
      \cline{1-2}\noalign{\smallskip}
      Animal & Description & Price (\$) \\
      \noalign{\smallskip}\hline\noalign{\smallskip}
      Gnat  & per gram & 13.65 \\
            & each     &  0.01 \\
      Gnu   & stuffed  & 92.50 \\
      Emu   & stuffed  & 33.33 \\
      Armadillo & frozen & 8.99 \\
      \noalign{\smallskip}\hline
    \end{tabular}

# Clipping in TikZ

After a \clip command, all subsequent drawings are clipped, only the parts
inside the clipping region are drawn.  Use the scope environment to restrict
the effect of clipping:

    \begin{tikzpicture}
      \draw (-2, 1.5) rectangle (2, -1.5);
      \begin{scope}
      \clip (-0.5, 0) circle (1);
      \clip ( 0.5, 0) circle (1);
      \fill[color=gray] (-2,1.5)
                      rectangle (2,-1.5);
      \end{scope}
      \draw (-0.5, 0) circle (1);
      \draw ( 0.5, 0) circle (1);
    \end{tikzpicture}


# Subfigures

    \begin{figure}[ht]
    \centering
    \caption{ GIMP Logos. }
    \label{a}
    \subfigure[\small {One}]{\includegraphics[keepaspectratio,width=3.000cm]{image-gimp.jpg}}
    \subfigure[\small {Two}]{\includegraphics[keepaspectratio,width=3.000cm]{image-gimp.jpg}}
    \\
    \subfigure[\small {Three}]{\includegraphics[keepaspectratio,width=3.000cm]{image-gimp.jpg}}
    \end{figure}

# Playing-card Suites

LATEX-2e offers commands to support the symbols that shows up in the
playing-cards: ``\clubsuit``, ``\diamondsuit``, ``\heartsuit``, and
``\spadesuit``.  These symbols are for math mode only.

# The "operatorname" Operator

The "operatorname" operator is used to define a dynamic operator on the fly
within a LATEX document, without having to have it defined previously in a preamble.
The operator is something akin to a symbol such as plus-sign or minus sign, such that
it would provide a thin space if placed between two operands. If a string is
defined as a "operatorname", it would also has the benefit of automatically adjusting
it such that if it is followed by an open parenthesis then the thin space is moved away,
giving the impression that it can be used as the name of a function.

For instance, we can define the name "fun" as an operator, such that when placed in front
of a string such as "x" it will have some thin space between the string "fun" and the text "x",
while if placed in front of an open parenthesis the thin space goes away.

    \(\operatorname{fun}x\)
    \(\operatorname{fun}(x)\)

When defining the name of a function it is possible to have some thin space between the names
such that the operator name itself looks like it is made up of two words instead of a single word.

    \(\operatorname{proj\,lim}x\)
    \(\operatorname{proj\,lim}(x)\)









