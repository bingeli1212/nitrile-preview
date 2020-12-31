---
title: LATEX counters
---

Everything LaTeX numbers for you has a counter associated with it. The
name of the counter is the same as the name of the environment or
command that produces the number, except with no \. Below is a list of
some of the counters used in LaTeX's standard document styles to
control numbering.

~~~tabbing
 part            paragraph       figure          enumi
 chapter         subparagraph    table           enumii
 section         page            footnote        enumiii
 subsection      equation        mpfootnote      enumiv
 subsubsection
~~~

Counters are printed in LaTeX by using a command generated as "\the"
suffixed with the name of the counter. Thus, equation numbers are
printed by the \theequation command, and section numbers by the
\thesection command. If you want to change the way such numbers are
printed, for example, change from arabic to Roman numerals, you need
to redefine the appropriate command, using the \renewcommand command.
As an example, to number equations in an appendix as A-1, A-2, ... ,
use

    \renewcommand{\theequation}{A-\arabic{equation}}

The second argument implies that the text produced by the renewed
\theequation command will be "A-" followed by the output from the
\arabic{equation} command, which is the value of the equation counter,
printed as an arabic number.

In List Environments the format for the item labels is given by
commands like \labelitemi and \labelitemii (for the first two levels
of the Itemize Environment), and like \labelenumi (for the Enumerate
Environment), and these may also be redefined.

There is an example of manipulating such counters in the discussion of
the List Environment. See also the discussions in the Itemize
Environment and in the Enumerate Environment.

You can force a change in the number produced by any of the counters.
For example, if you wanted to produce a single page numbered 13, you
could use

    \setcounter{page}{13}

A variety of commands for manipulating counters this way are given
below. Commands that manupulate counters

~~~
- \addtocounter
- \newcounter
- \setcounter
- \usecounter
- \value
- \renewcommand
~~~

Commands that print the value of a counter in various formats

~~~
- \arabic
- \alph \Alph
- \roman \Roman
- \fnsymbol
~~~

+ \addtocounter{counter}{value}

  The \addtocounter command increments the counter by the amount
  specified by the value argument, which can be negative.

+ \newcounter{newname}[oldcounter]

  The \newcounter command defines a new counter named newname. The
  optional argument oldcounter must be the name of an already defined
  counter; if present the new counter, newname, will be reset whenever
  oldcounter, the counter named in the optional argument, is
  incremented.

+ \setcounter{counter}{value}

  The \setcounter command sets the value of the specified counter to
  that specified by the value argument.

+ \usecounter{counter}

  The \usecounter command is used in the second argument of the list
  environment to allow the counter specified to be used to number the
  list items.

+ \value{counter}

  The \value command produces the value of the counter named in the
  mandatory argument. It can be used where LaTeX expects an integer or
  number, such as the second argument of a \setcounter or
  \addtocounter command, or in

  ```
  \hspace{\value{foo}\parindent}
  ```

  It is useful for doing arithmetic with counters.

+ \newcommand{cmd}[args][opt]{def}
+ \renewcommand{cmd}[args][opt]{def}
+ \providecommand{cmd}[args][opt]{def} — LaTeX2e

  These commands define (or redefine) a command.

  cmd - The name of the new or redefined command. A \ followed by a
  string of lower and/or uppercase letters or a \ followed by a single
  nonletter. For \newcommand the name must not be already defined and
  must not begin with \end; for \renewcommand it must already be
  defined. The \providecommand command is identical to the \newcommand
  command if a command with this name does not exist; if it does
  already exist, the \providecommand does nothing and the old
  definition remains in effect.

  args - An integer from 1 to 9 denoting the number of arguments of
  the command being defined. The default is for the command to have no
  arguments.

  opt - (LaTeX2e only) If present, then the first of the number of
  arguments specified by args is optional with a default value of opt;
  if absent, then all of the arguments are required.

  def - The text to be substituted for every occurrence of cmd; a
  parameter of the form #n in cmd is replaced by the text of the nth
  argument when this substitution takes place.

  ```
  \newcommand{\water}{H$_2$O}
  ```

  This would allow one to write, e.g.,

  ```
  The formula for water is \water. 
  ```

  or

  ```
  \water\ is the formula for water.
  ```

  Note, in the second case, the trailing \ followed by a blank is
  required to ensure a blank space after the H2O; LaTeX ignores the
  blank following a command, so the space has to be specifically
  inserted with the \<space>.
  As a second example consider

  ```
  \newcommand{\hypotenuse}{$a^{2}+b^{2}$}
  ```

  Note that this will produce the desired formula in text (paragraph)
  mode because of the $...$ in the definition. In math mode, however,
  the first $ in the definition will cause LaTeX to leave math mode,
  causing problems.

  In LaTeX 2.09 a standard trick for getting around this is to put the
  math-mode expression in an \mbox, viz.,

  ```
  \newcommand{\hypotenuse}{\mbox{$a^{2}+b^{2}$}}
  ```

  In LaTeX2e the \ensuremath command has been provided to alleviate
  this problem. The argument of the \ensuremath command is always
  processed in math mode, regardless of the current mode. Using this
  mechanism the above could be written as

  ```
  \newcommand{\hypotenuse}{\ensuremath{a^{2}+y^{2}}}
  ```

+ \arabic{counter}

  The \arabic command causes the current value of counter to be
  printed in Arabic numbers, i.e., 3.

+ \alph{counter}

  This command causes the current value of counter to be printed in
  alphabetic characters. The \alph command causes lower case
  alphabetic characters, i.e., a, b, c..., while the \Alph command
  causes upper case alphabetic characters, i.e., A, B, C...
  The value of the counter must be less than 27.

+ \Alph{counter}
 
  See above.

+ \roman{counter}

  This command causes the current value of counter to be printed in
  roman numerals. The \roman command causes lower case roman numerals,
  i.e., i, ii, iii, ..., while the \Roman command causes upper case
  roman numerals, i.e., I, II, III...

+ \Roman{counter}

  See above.

+ \fnsymbol{counter}

  The \fnsymbol command causes the current value of counter to be
  printed in a specific sequence of nine symbols that can be used for
  numbering footnotes. (The sequence is asterisk, dagger, double
  dagger, section mark, paragraph mark, double vertical lines, double
  asterisks, double daggers, double double daggers.)
  The value of counter must be less between 1 and 9.
  Can be used only in math mode.





