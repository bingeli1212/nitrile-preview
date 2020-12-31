---
title: LATEX math environment
---

# Miscellaneous symbols

The following symbols are also used only in math mode

~~~
- \aleph - Hebrew aleph
- \hbar - h-bar, Planck's constant
- \imath - variation on "i"; no dot
- See also \i
- \jmath - variation on "j"; no dot
- See also \j
- \ell - script (loop) "l"
- \wp - fancy script lowercase "P"
- \Re - script capital "R" ("Real")
- \Im - script capital "I" ("Imaginary")
- \prime - prime (also obtained by typing ')
- \nabla - inverted capital Delta
- \surd - radical (square root) symbol
- \angle - angle symbol
- \forall - "for all" (inverted A)
- \exists - "exists" (left-facing E)
- \backslash - backslash
- \partial - partial derivative symbol
- \infty - infinity symbol
- \triangle - open triangle symbol
- \Box - open square
- \Diamond - open diamond
- \flat - music: flat symbol
- \natural - music: natural symbol
- \sharp - music: sharp symbol
- \clubsuit - playing cards: club suit symbol
- \diamondsuit - playing cards: diamond suit symbol
- \heartsuit - playing cards: heart suit symbol
- \spadesuit - playing cards: spade suit symbol
~~~

# Some other symbols

The following symbols can be used in any mode.

~~~
- \dag - dagger
- \ddag - double dagger
- \S - section symbol
- \P - paragraph symbol
- \copyright - copyright symbol
- \pounds - British pound sterling symbol
~~~

# Calligraphic style letters

Twenty-six calligraphic letters are provided (the upper case
alphabet). These can only be used in math mode.

In LaTeX 2.09 they are produced with the \cal declaration

    ${\cal A}$

In LaTeX2e they are obtained with the \mathcal command:

    $\mathcal{CAL}$


# Greek letters

These commands may be used only in math mode.

Lower case

~~~
- \alpha
- \beta
- \gamma
- \delta
- \epsilon
- \varepsilon (variation, script-like)
- \zeta
- \eta
- \theta
- \vartheta (variation, script-like)
- \iota
- \kappa
- \lambda
- \mu
- \nu
- \xi
- \pi
- \varpi (variation)
- \rho
- \varrho (variation, with the tail)
- \sigma
- \varsigma (variation, script-like)
- \tau
- \upsilon
- \phi
- \varphi (variation, script-like)
- \chi
- \psi
- \omega
~~~

Capital letters

~~~
- \Gamma
- \Delta
- \Theta
- \Lambda
- \Xi
- \Pi
- \Sigma
- \Upsilon
- \Phi
- \Psi
- \Omega
~~~

# Accents

The rules differ somewhat depending whether you are in text mode, math
mode, or the tabbing environment

[ Text mode ] The following accents may be placed on letters. Although
"o" is used in most of the example, the accents may be placed on any
letter. Accents may even be placed above a "missing" letter; for
example, \~{} produces a tilde over a blank space.

The following commands may be used only in paragraph or LR mode.

~~~
- \`{o} produces a grave accent, ò
- \'{o} produces an acute accent, ó
- \^{o} produces a circumflex, ô
- \"{o} produces an umlaut or dieresis, ö
- \H{o} produces a long Hungarian umlaut
- \~{o} produces a tilde, õ
- \c{c} produces a cedilla, ç
- \={o} produces a macron accent (a bar over the letter)
- \b{o} produces a bar under the letter
- \.{o} produces a dot over the letter
- \d{o} produces a dot under the letter
- \u{o} produces a breve over the letter
- \v{o} produces a "v" over the letter
- \t{oo} produces a "tie" (inverted u) over the two letters
~~~

Note that the letters "i" and "j" require special treatment when they
are given accents because it is often desirable to replace the dot
with the accent. For this purpose, the commands \i and \j can be used
to produce dotless letters.

For example,

~~~
- \^{\i} should be used for i, circumflex, î
- \"{\i} should be used for i, umlaut, ï
~~~

[ Math mode ] Several of the above and some similar accents can also
be produced in math mode. The following commands may be used only in
math mode.

~~~
- \hat{o} is similar to the circumflex (cf. \^)
- \widehat{oo} is a wide version of \hat over several letters
- \check{o} is a vee or check (cf. \v)
- \tilde{o} is a tilde (cf. \~)
- \widetilde{oo} is a wide version of \tilde over several letters
- \acute{o} is an acute accent (cf. \`)
- \grave{o} is a grave accent (cf. \')
- \dot{o} is a dot over the letter (cf. \.)
- \ddot{o} is a double dot over the letter
- \breve{o} is a breve (cf. \u)
- \bar{o} is a macron (cf. \=)
- \vec{o} is a vector (arrow) over the letter
~~~

[ Tabbing environment ] Some of the accent marks used in running text
have other uses in the tabbing environment. In that case they can be
created with the following command:

~~~
- \a' for an acute accent
- \a` for a grave accent
- \a= for a macron accent
~~~

# The "\overbrace"

    \overbrace{equation}

The \overbrace command generates a brace over equation; math mode. To
"label" the overbrace, use a superscript.

# The "\overline"

    \overline{equation}

The \overline command causes the argument equation to be overlined;
math mode.

# The "\underbrace"

    \underbrace{formula}

The \underbrace command generates a brace underneath the formula; math
mode. To "label" the underbrace, use a subscript.

# The "\underline"

    \underline{text}

The \underline command causes the argument text to be underlined. This
command can be used in math mode, paragraph mode, and LR mode.
This command is fragile although the \overline command is robust.

# The angle brackets

The math symbols < > and | are used only in math mode. Note that left
and right angle brackets (which are somewhat taller than < and >) can
be obtained with \langle and \rangle commands.

# The prime symbol

The single right quotation mark, ', produces a prime in math mode. You
can also use \prime.

# Dots

~~~
- \cdots (centered ellipsis)
- \ddots (diagonal ellipsis)
- \ldots (ellipsis)
- \vdots (vertical ellipsis)
~~~

# The "\sqrt"

    \sqrt[root]{arg}

The \sqrt command produces the square root (radical) symbol with the
argument as radicand. The optional argument, root, determines what
root to produce, i.e. the cube root of x+y would be typed as
``$\sqrt[3]{x+y}$``.

The radical sign is variable size, that is, it is made larger if the
radicand is, for example, a built-up fraction.

# The "\stackrel"

This can be used to stack something above something else; used in math
mode.

    \stackrel{top}{bot}

The first argument, top, is typset immediately above the second
argument, bot; the former is set in the same math style as a
superscript.
For example

    H$_2$CO$_3$ $\stackrel{\rm heat}
      {\longrightarrow}$ H$_2$O + CO$_2$

# The "\mathop"

This command does not seem to be well documented but appears to work,
at least in current versions of LaTeX 2.09.

The argument is considered to be a single variable sized math symbol
for purposes of placing limits below (subscripts) and above
(superscripts) in display math style. For example,

    \mathop{\sum \sum}_{i,j=1}^{N} a_i a_j

would produce something like having two summation symbols placed
one before the other then have the entire two symbol treated
like a single one.

It is possible to create two rows of "subscripts" by using a similar
construction: The first row is created as subscripts of the symbol in
the usual way and a lower row is created by placing this whole
construct as the argument of a \mathop command with its own subscript.
For example

    \mathop{\sum_{i,j=1}^{N}}_{i>j}

# The "equation" environment

    \begin{equation}
    math formula
    \label{eqno1}
    \end{equation}

The equation environment centers your equation on the page and places
the equation number in the right margin.

The \label command is required only if you want to use a \ref command
to refer to the number assigned to this equation.

The Display Math environment gives the same effect without the
equation number.

# The "eqnarray" environment

    \begin{eqnarray[*]}
    var_1  & rel_1  & eq1 \\
    var_2  & rel_2  & eq2 \\
    ....
    \end{eqnarray[*]}

The eqnarray environment is typically used to display a sequence of
equations or inequalities; it may also be used to manage spacing for
long equations. The \lefteqn command is useful in this environment for
splitting long equations over several lines.

It is very much like a three-column array environment, with position
argument rcl, i.e., the columns are justified right, center, and left,
respectively. (However, \multicolumn may not be used.)

Consecutive rows are separated by \\ commands and consecutive items
within a row separated by an &. Any item may be empty, i.e., no text.

A separate equation number is placed on every line unless that line
has a \nonumber command. The optional eqnarray* form does not generate
any equation numbers.

A \label command anywhere within a row generates a reference to that
row's number.

# Modes

When LaTeX is processing your input text, it is always in one of three modes:

- Paragraph mode
- Math mode
- LR mode, or Left-to-right mode, called LR mode for short

LaTeX changes mode only when it goes up or down a staircase to a
different level, though not all level changes produce mode changes.
Mode changes occur only when entering or leaving an environment, or
when LaTeX is processing the argument of certain text-producing
commands.

[ Paragraph mode. ] Paragraph mode is the most common; it's the one
LaTeX is in when processing ordinary text. In that mode, LaTeX breaks
your text into lines and breaks the lines into pages.

There are also several text-producing commands and environments for
making a box that put LaTeX in paragraph mode. The box made by one of
these commands or environments will be called a parbox. When LaTeX is
in paragraph mode while making a box, it is said to be in inner
paragraph mode. The normal paragraph mode, in which LaTeX starts out,
is called outer paragraph mode.

[ Math mode. ] LaTeX is in math mode when it's generating a
mathematical formula. It is in math mode in the math, displaymath,
equation, and eqnarray environments.

In math mode letters are assumed to be math symbols and spaced
accordingly. Spaces in the input are ignored, except that spaces may
be needed to delineate the end of commands.

[ LR mode. ] In LR mode, as in paragraph mode, LaTeX considers the
output that it produces to be a string of words with spaces between
them. In LR mode, unlike paragraph and math modes, spaces are not
ignored; an input space creates an output space. However, unlike
paragraph mode, LaTeX keeps going from left to right; it never starts
a new line in LR mode. Even if you put a hundred words into an \mbox,
LaTeX would keep typesetting them from left to right inside a single
box, and then complain because the resulting box was too wide to fit
on the line.

LaTeX is in LR mode when it starts making a box with an \mbox command.
You can get it to enter a different mode inside the box - for example,
you can make it enter math mode to put a formula in the box.

# Subscripts

To get an expression, exp, to appear as a subscript, you just type
``_{exp}``. Can be used only in math mode. Thus, for a simple
expression that is part of the running text:

    H$_2$O is the formula for water

should have shown the character "2" as the subscript for letter "H".
Note that the braces around the argument may be omitted if the
subscript is a single character.

If a symbol has both subscripts and superscripts, the order doesn't
matter. The following are equivalent:

    a_n^2

and

    a^2_n

Subscripts are normally displayed in a smaller font; to prevent this
and, for example, use a standard Roman font, one would use;

    $J_{\rm Roman}$

# Superscripts

To get an expression, exp, to appear as a superscript, you just type
^{exp}. Can be used only in math mode. Thus, for a simple expression
that is part of the running text:

    x$^3$ is the third power of x

should have shown the "3" as the superscript of x. Note that the
braces around the argument may be omitted if the superscript is a
single character.
If a symbol has both subscripts and superscripts, the order doesn't
matter. The following are equivalent:

    a_n^2

and

    a^2_n

Superscripts may have their own superscripts:

    $x^{y^{z}}$

# Spacing in math mode

In a math environment, LaTeX ignores the spaces you type and puts in
the spacing that it thinks is best. LaTeX formats mathematics the way
it's done in mathematics texts. If you want different spacing, LaTeX
provides the following four commands for use in math mode:

~~~
- \; - a thick space
- \: - a medium space
- \, - a thin space
- \! - a negative thin space
~~~




