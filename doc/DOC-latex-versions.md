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

~~~
+ article
  The article class described in LaTeX: A Document Preparation System.
+ book
  The book class described in LaTeX: A Document Preparation System.
+ report
  The report class described in LaTeX: A Document Preparation System.
+ letter
  The letter class described in LaTeX: A Document Preparation System.
+ slides
  The slides class described in LaTeX: A Document Preparation System, formerly SLiTeX.
+ proc
  A document class for proceedings, based on article. Formerly the proc package.
+ ltxdoc
  The document class for documenting the LaTeX program, based on article.
+ ltxguide
  The document class for LaTeX2e for Authors and LaTeX2e for Class and Package Writers, based on article. The document you are reading now uses the ltxguide class. The layout for this class is likely to change in future releases of LaTeX.
+ ltnews
  The document class for the LaTeX News information sheet, based on article. The layout for this class is likely to change in future releases of LaTeX.
+ minimal
  This class is the bare minimum (3 lines) that is needed in a LaTeX class file. It just sets the text width and height, and defines \normalsize. It is principally intended for debugging and testing LaTeX code in situations where you do not need to load a "full" class such as article. If, however, you are designing a completely new class that is aimed for documents with structure radically different from the structure supplied by the article class, then it may make sense to use this as a base and add to it code implementing the required structure, rather than starting from article and modifying the code there.
~~~




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

    \heightits height above the baseline;
    \depthits depth below the baseline;
    \totalheightthe sum of \height and \depth;
    \widthits width.

Thus, to put "hello" in the centre of a box of twice its natural width, you would use:

    \makebox[2\width]{hello}

Or you could put f into a square box, like this: tex2html_wrap984

    \framebox{\makebox[\totalheight]{\itshape f\/}}

Note that it is the total width of the framed box, including the
frame, which is set to \totalheight. The other change is a new
possibility for <pos>: s has been added to l and r. If <pos> is s then
the text is stretched the full length of the box, making use of any
"rubber lengths" (including any inter-word spaces) in the contents of the box. If no such "rubber
length" is present, an "underfull box" will probably be produced.

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
element is \(a_n\), whereas the input ``$\seq[k]{x}$`` produces the
formula where the last element is \(x_k\). In summary, the command:

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

All the above five "defining commands" now have *-forms that are
usually the better form to use when defining commands with arguments,
unless any of these arguments is intended to contain whole paragraphs
of text. Moreover, if you ever do find yourself needing to use the
non-star form then you should ask whether that argument would not
better be treated as the contents of a suitably defined environment.

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
should use the filecontents* environment which does not add a comment
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

  ```
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

  ```
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

  ```
  Math           Text Command
  ^              \textasciicircum
  ~              \textasciitilde
  ```

+ \textregistered 
+ \texttrademark

  These commands provide the "registered trademark" (R) and
  "trademark" (TM) symbols.

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

~~~
+ alltt
  This package provides the alltt environment, which is like the verbatim environment except that \, {, and } have their usual meanings. It is described in alltt.dtx and LaTeX: A Document Preparation System.

+ doc
  This is the basic package for typesetting the documentation of LaTeX programs. It is described in doc.dtx and in The LaTeX Companion.

+ exscale
  This provides scaled versions of the math extension font. It is described in exscale.dtx and The LaTeX Companion.

+ fontenc
  This is used to specify which font encoding LaTeX should use. It is described in ltoutenc.dtx.

+ graphpap
  This package defines the \graphpaper command; this can be used in a picture environment.

+ ifthen
  Provides commands of the form "if...then do... otherwise do...". It is described in ifthen.dtx and The LaTeX Companion.

+ inputenc
  This is used to specify which input encoding LaTeX should use. It is described in inputenc.dtx.

+ latexsym
  LaTeX2e no longer loads the LaTeX symbol font by default. To access it, you should use the latexsym package. It is described in latexsym.dtx and in The LaTeX Companion; see also Section 6.

+ makeidx
  This provides commands for producing indexes. It is described in LaTeX: A Document Preparation System and in The LaTeX Companion.

+ newlfont
  This is used to emulate the font commands of LaTeX 2.09 with the New Font Selection Scheme. It is described in The LaTeX Companion.

+  oldlfont
  This is used to emulate the font commands of LaTeX 2.09. It is described in The LaTeX Companion.

+  showidx
  This causes the argument of each \index command to be printed on the page where it occurs. It is described in LaTeX: A Document Preparation System.

+  syntonly
  This is used to process a document without typesetting it. It is described in syntonly.dtx and in The LaTeX Companion.

+ tracefnt
  This allows you to control how much information about LaTeX's font loading is displayed. It is described in The LaTeX Companion.
~~~

# Related software

The following software should be available from the same distributor as your copy of LaTeX2e. You should obtain at least the graphics and tools collections in order to have all the files described in LaTeX: A Document Preparation System. The amsmath package (part of amslatex and formerly known as amstex) and babel are also mentioned in the list of `standard packages' in section C.5.2 of that book.

~~~
+ amslatex
  Advanced mathematical typesetting from the American Mathematical Society. This includes the amsmath package; it provides many commands for typesetting mathematical formulas of higher complexity. It is produced and supported by the American Mathematical Society and it is described in The LaTeX Companion.

+ babel
  This package and related files support typesetting in many languages. It is described in The LaTeX Companion.

+ graphics
  This includes the graphics package which provides support for the inclusion and transformation of graphics, including files produced by other software. Also included, is the color package which provides support for typesetting in colour. Both these packages are described in LaTeX: A Document Preparation System.
  
+ mfnfss
  Everything you need (except the fonts themselves) for typesetting with a large range of bit-map (Metafont) fonts.
 
+ psnfss
  Everything you need (except the fonts themselves) for typesetting with a large range of Type 1 (PostScript) fonts.
 
+ tools
  Miscellaneous packages written by the LaTeX3 project team.
  These packages come with documentation and each of them is also described in at least one of the books The LaTeX Companion and LaTeX: A Document Preparation System.
~~~

# Tools

This collection of packages includes, at least, the following (some
files may have slightly different names on certain systems):

~~~
+ array
  Extended versions of the environments array, tabular and tabular*, with many extra features.
 
+ dcolumn
  Alignment on "decimal points" in tabular entries. Requires the array package.
 
+ delarray
  Adds "large delimiters" around arrays. Requires array.
 
+ hhline
  Finer control over horizontal rules in tables. Requires array.
 
+ longtable
  Multi-page tables. (Does not require array, but it uses the extended features if both are loaded.)
 
+ tabularx
  Defines a tabularx environment that is similar to tabular* but it modifies the column widths, rather than the inter-column space, to achieve the desired table width.
 
+ afterpage
  Place text after the current page.

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
  "Smart space" command that helps you to avoid the common mistake of missing spaces after command names.
~~~

