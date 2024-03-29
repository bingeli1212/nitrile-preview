---
title: Tokenizer
---

Math expressions are part of LATEX and CONTEX, both of which
provides a typesetting language that make use of letters and
symbols to express presentation math. 

HTML does not provide native mathematic support. NITRILE
thus provides presentation math through SVG. The goal of
this presentation math is to achieve the same look and feel
of an expression one would have expected to see presented by
CONTEX/LATEX.

The syntax of the language CONTEX provides uses for
typesetting presentation math is similar to that provivided
by LATEX in many ways. However, CONTEX differs in LATEX when
it comes to expressing matrices and cases.  CONTEX is also
very different than LATEX when it comes to expressing
display math and equations, including how to number the
equation or equations.

HTML does not have a native syntax for expressing
presentation math.  the once popular MathML is being
recommended by W3C, but is not widely supported by browsers.
For this reason, NITRILE has provided a presentation math
simulation layer, which would similate the look and feel of
the presentation math one would expect from LATEX.

NITRILE uses a syntax of language for expressing
presentation math that is very similar to those one would
have seen when working with a native LATEX document.  This
language is then translated to native LATEX and CONTEX
language.  For HTML, the translation is a SVG graph that is
designed to similate the same look and feel of the math one
would have expected on LATEX.

Note that even though when the syntax of the language on NITRILE is
very similar to those of LATEX natives, and indeed most of them
would have been translated into LATEX successfully,
it should be pointed out that some feature of the language, while
working for LATEX, does not necessarily work out of the
box for CONTEX. For SVG, which requires a lot of specific 
code to take care the look and feel, many those features are
missing.

On top of that, the syntax provided by NITRILE has gone
through some modifications. The main objective is to maintain
flexibility so that there is one syntax for all three target
translations. The other objective is to come up with a way
of expressing how equations are laid out. The rest of this
document discusses the syntax of this language.

# Supported LATEX left/right fences

Braces:

    \{
    \}
    \lbrace
    \rbrace

Single brackets:

    [
    ]
    \lbrack
    \rbrack

Parentheses:

    \\lparen
    \\rparen

Double brackets:

    \lobrk
    \robrk

Double vertical bar:

    \lVert
    \rVert

Single vertical bar:

    \lvert
    \rvert

Angle bracket:

    \lang
    \rang

Floor 

    \lfloor
    \rfloor

Ceil
   
    \lceil
    \rceil

# Supported LATEX commands

    \text{Hello world}
    \operatorname{x}
    \frac{1}{4}
    \sqrt{x + y}
    \sqrt[3]{x + y}
    \od{x^2}{x}
    \od[2]{x^2}{x}
    \od[3]{x^2}{x}
    \pd{x^2}{x}
    \pd[2]{x^2}{x}
    \pd[3]{x^2}{x}
    \dif{x}
    \pmod{m}
    \pmod{5}
    \pmod{7}
    \binom{4}{0}    
    \binom{4}{1}    
    \binom{4}{2}    
    \dfrac{1}{2}
    \dbinom{1}{2}

Note that commands \od, \pd, \dif are provided by COMMON MATH
package. These commands are translated verbatim on LATEX,
provided that "commath" package are included. On CONTEX/HTML they
are translated into a set of other CONTEX commands to simulate
the same look and feel these commands do on LATEX. 

# Supported LATEX stretchable overhead symbols

    \widehat     
    \overline    
    \overleftrightarrow 
    \overrightarrow 

# Supported LATEX non-stretchable overhead symbols

    \dot         
    \ddot        
    \dddot       
    \ddddot      
    \bar         
    \vec         
    \mathring    
    \hat         
    \check       
    \grave       
    \acute       
    \breve       
    \tilde       

# Supported LATEX font variants

    \mathbb{ABab12}       Double-struck
    \mathbf{ABab12}       Bold-face
    \mathcal{ABab12}      Cal (Script Capital L U+2112, etc.)
    \mathit{ABab12}       Italic (default for single-letter variable)
    \mathrm{ABab12}       Roman (regular letter or digit)

NOTE: only the upper-case letter, lower-case letter, and digits are supported.
No spaces are allowed.

NOTE: for mathbb-variant, which is for double-strike variant,
the following letters in Unicode are having a "different" appearance
than the other ones:

    C - field of complex numbers
    H - field of quaternion numbers, which is a number 
        system that extends the complex numbers.
    N - field of all natural numbers, which must be a 
        positive integers: 1, 2, 100, ...
    P - field of all prime number
    Q - field of rational numbers, excluding irrational 
        number such as PI
    R - field of all real numbers, including integers and 
        floating point numbers
    Z - field of all integers, including negative integers 
        and zeros.

Note that \mathscr is not supported. Use \mathcal instead.

# Supported LATEX spaces

    \; 
    \, 
    \:
    \quad
    \qquad

# Subscript and superscript 

   a_i
   a^2
   a_{i}
   a^{123}
   a_i^{123}

Note that if both subscript and superscript is to be provided,
the subscript must come first.

# \sum, \lim, \int, and \prod

These symbols are usually used in conjunction with
subscript/superscript.  On top of them, commands \sum, \int,
and \prod have a slightly enlarged appearance in the
presentation math when the math is in a "display mode",
including equations.

    \lim_{i \to \infty} \frac{1}{i}
    \sum_{i=0}^{100} i^2
    \int_{0}^{100} x dx

# Display math mode for \sum, \int, \lim and \prod

Note that when \sum, \lim and \int are paired with
subscript and/or superscript then there will be distinction
made whether it is a 'inlinemath' mode or a 'displaymath'
mode. The displaying of summation symbol, the lettering of
"lim", and/or the integration symbol will depends on choice
of these two display modes. In particular, when the
'displaymath' mode is detected efforts are made to make
these symbols appear larger. 

On top of that, the subscript/superscript
will appear on the top and bottom versus at the right-hand
side of the symbol. This behavioris is provided natively
on LATEX/CONTEX. SVG has been implemented to provide the
same behavior as that of LATEX.

# The \displaystyle command

The \displaystyle command that is common in the LATEX world is not to
be recognized. However, there are commands such as ``\dfrac`` and
``\dbinom`` that would generate a un-scaled down version of fractions.

# Supported matrix and cases

Following commands are recognized as to expressing a matrix, with or
without the fences. 

    \begin{matrix} ... \end{matrix}
    \begin{pmatrix} ... \end{pmatrix}
    \begin{bmatrix} ... \end{bmatrix}
    \begin{Bmatrix} ... \end{Bmatrix}
    \begin{vmatrix} ... \end{vmatrix}
    \begin{Vmatrix} ... \end{Vmatrix}
    \begin{cases} ... \end{cases}

Inside these commands, following two commands are to be recognized for
separating the rows and columns: ``\nc`` and ``\nr``. Following is an
example of expressing a parenthesized matrix with 2 rows and 2
columns. 

    \begin{pmatrix}
    a \nc b \nr
    c \nc d
    \end{pmatrix}

# The compact layout mode 

The compact layout mode is entered for subscript and superscript, in which case
certain gaps such as those that are added around operators such as plus and
minus are removed. The goal of the compact mode is to reduce the overall width
of the presentation math expression in certain situations.

# The matrix element

Note that each element within a matrix appears as
inlinemath style, even though the matrix itself might be
shown as displaymath style.

# Greek letters

Greek letters are going to presented using the following symbols in LATEX.

By default, LATEX uses the following English letters for expressing some
Greek letters. They are listed below:

    o    \omicron
    A    \Alpha
    B    \Beta
    E    \Epsilon
    Z    \Zeta
    H    \Eta
    I    \Iota
    K    \Kappa
    M    \Mu
    N    \Nu
    O    \Omicron
    P    \Rho
    T    \Tau
    X    \Chi

In NITRILE, although the English alphebet letter would work when
being translated to LATEX, it does not necessarily guarrentee that these
letter will appear as the Greek letter one would expect on LATEx.
Thus, it is recommended that a different math command be used to express
the Greek letter. These commands are shown as the second column
of the previous table.

To ensure translation of these commands to Greek letters on LATEX target,
following additional commands must be added to the preamble of a LATEX
document.

    \DeclareMathSymbol{\omicron}{\mathord}{letters}{"6F}
    \DeclareMathSymbol{\Alpha}{\mathalpha}{operators}{"41}
    \DeclareMathSymbol{\Beta}{\mathalpha}{operators}{"42}
    \DeclareMathSymbol{\Epsilon}{\mathalpha}{operators}{"45}
    \DeclareMathSymbol{\Zeta}{\mathalpha}{operators}{"5A}
    \DeclareMathSymbol{\Eta}{\mathalpha}{operators}{"48}
    \DeclareMathSymbol{\Iota}{\mathalpha}{operators}{"49}
    \DeclareMathSymbol{\Kappa}{\mathalpha}{operators}{"4B}
    \DeclareMathSymbol{\Mu}{\mathalpha}{operators}{"4D}
    \DeclareMathSymbol{\Nu}{\mathalpha}{operators}{"4E}
    \DeclareMathSymbol{\Omicron}{\mathalpha}{operators}{"4F}
    \DeclareMathSymbol{\Rho}{\mathalpha}{operators}{"50}
    \DeclareMathSymbol{\Tau}{\mathalpha}{operators}{"54}
    \DeclareMathSymbol{\Chi}{\mathalpha}{operators}{"58}

Following table shows the UNICODE code point that would be used for each
Greek letters:

    "\Alpha"          "&#913;"         
    "\Beta"           "&#914;"         
    "\Gamma"          "&#915;"         
    "\Delta"          "&#916;"         
    "\Epsilon"        "&#917;"         
    "\Zeta"           "&#918;"         
    "\Eta"            "&#919;"         
    "\Theta"          "&#920;"         
    "\Iota"           "&#921;"         
    "\Kappa"          "&#922;"         
    "\Lambda"         "&#923;"         
    "\Mu"             "&#924;"         
    "\Nu"             "&#925;"         
    "\Xi"             "&#926;"         
    "\Omicron"        "&#927;"         
    "\Pi"             "&#928;"         
    "\Rho"            "&#929;"         
    "\Sigma"          "&#931;"         
    "\Tau"            "&#932;"         
    "\Upsilon"        "&#933;"         
    "\Phi"            "&#934;"         
    "\Chi"            "&#935;"         
    "\Psi"            "&#936;"         
    "\Omega"          "&#937;"         

    "\alpha"          "&#945;"         
    "\beta"           "&#946;"         
    "\gamma"          "&#947;"         
    "\delta"          "&#948;"         
    "\epsilon"        "&#949;"         
    "\zeta"           "&#950;"         
    "\eta"            "&#951;"         
    "\theta"          "&#952;"         
    "\vartheta"       "&#x03D1;"       
    "\iota"           "&#953;"         
    "\kappa"          "&#954;"         
    "\lambda"         "&#955;"         
    "\mu"             "&#956;"         
    "\nu"             "&#957;"         
    "\xi"             "&#958;"         
    "\o"              "&#959;"         
    "\pi"             "&#960;"         
    "\rho"            "&#961;"         
    "\varrho"         "&#x03F1;"       
    "\varsigma"       "&#962;"         
    "\sigma"          "&#963;"         
    "\tau"            "&#964;"         
    "\upsilon"        "&#965;"         
    "\phi"            "&#x03D5;"       
    "\varphi"         "&#x03C6;"       
    "\chi"            "&#967;"         
    "\psi"            "&#968;"         
    "\omega"          "&#969;"         
    "\varepsilon"     "&#x03F5;"       

Following is the complete list of Greek letters one should use
on NITRILE. 

    Alpha     \Alpha        Iota      \Iota           Rho       \Rho       
    Beta      \Beta         Kappa     \Kappa          Sigma     \Sigma     
    Gamma     \Gamma        Lambda    \Lambda         Tau       \Tau       
    Delta     \Delta        Mu        \Mu             Upsilon   \Upsilon   
    Epsilon   \Epsilon      Nu        \Nu             Phi       \Phi       
    Zeta      \Zeta         Xi        \Xi             Chi       \Chi       
    Eta       \Eta          Omicron   \Omicron        Psi       \Psi       
    Theta     \Theta        Pi        \Pi             Omega     \Omega     

    alpha    \alpha         iota      \iota           rho       \rho            
    beta     \beta          kappa     \kappa          sigma     \sigma   
    gamma    \gamma         lambda    \lambda         tau       \tau         
    delta    \delta         mu        \mu             upsilon   \upsilon       
    epsilon  \epsilon       nu        \nu             phi       \phi      
    zeta     \zeta          xi        \xi             chi       \chi       
    eta      \eta           omicron   \omicron        psi       \psi        
    theta    \theta         pi        \pi             omega     \omega    

Following are additional Greek letter symbols that are supported.

    vartheta     \vartheta
    varrho       \varrho          
    varsigma     \varsigma             
    varphi       \varphi          
    varepsilon   \varepsilon           

# Horizontal rules

A horizontal rule can be typeset using the ``\hrule`` command.
This command takes a single argument that expresses the multiple
widthes of the current font size. For instance, a ``\hrule{3}`` 
is to draw a horizontal rule the width of 36pt if the current font size
is set at 12pt

    \hrule{3}

# The commath package

Following commands are supported that are provided by the 'commath' package.

    \usepackage{commath}

- The \od command: 

    \od{x^2}{x}
    \od[2]{x^2}{x}

- The \pd command:

    \pd{x^2}{x}
    \pd[2]{x^2}{x}

- The \dif command:

    \dif{x}

# Equation numbering

By default, equations are not numbered. However if the equation
is detected to have a label that is at the first part of the expression
immediately after the dollar sign, then this equation is to be
numbered.  On top of that, if multiple equations are "conglomerated"
due to their appearing one after another, then all the equations
will be numbered.

This makes it easy to be implemented in LATEX, as latex provides
two environments, namely, "align" and "gather", that would assign
a number for each one of the equations in the list. If one is to
prefer having a single number for an equation that spans across
multiple lines, then the "split" is the one. The nice thing about
the "split" is that it can be nested inside an "align" or "gather".
See the following.

    \begin{align}
    \begin{split}
    A = a + b + c\\
      = 2a + 2b
    \end{split}
    B = a + b\\
    C = b + c
    \end{align}

However, similar things can not be said for CONTEX. For CONTEX,
There is no "subalignment", or I have tried and it does not 
work. For CONTEX, it is possible to assign numbering to a selected
few equations with a \startmathalign-\stopmathalign block.  And this
is exactly what we are going to do to "simulate" this effect
if some of the equations are considered to be part of a larger "multi-line"
equation where one should only assign a single number. Following
is how to do it in CONTEX.

    \startmathalign[n=1]
    \NC A \NC = a + b + c \NR
    \NC   \NC = 2a + 2b \NR[+]
    \NC B \NC = a + b \NR[+]
    \NC C \NC = b + c \NR[+]
    \stopmathalign

This is to assume that following appears within
a source MD file.

    $ $(#eq:a) A &= a + b + c\\ 
                  &= 2a + 2b

    $          B &= a + b

    $          C &= b + c      

Note that in the previous case, when the first equation
(main-equation) is present with a label, then numbering for all
remaining sub-equations is to be done, regardless if the that
sub-equation is presented with a labeled or not.  Regardless,
having a label with a sub-equation is going to make it easier to
"refer" to this sub-equation within a text block.

    $ $(#eq:a) A &= a + b + c\\ 
                  &= 2a + 2b

    $ $(#eq:b) B &= a + b

    $ $(#eq:c) C &= b + c      

For a given equation (whether it is a main-equation or a
sub-equation), if a double-backslashes are detected in the main
expression, (those that are part of a begin-end matrix or
begin-end cases are not counted), then these backslashes are
interpreted as "line breaks" for a long formular.  This behavior
is similar to LATEX "split" environment.

    $ $(#eq:a) A &= a + b + c\\ 
                  &= 2a + 2b

For LATEX translation it will become a "split".

    \begin{gather}
    \begin{split}
    A &= a + b + c\\ 
    &= 2a + 2b
    \end{split}\label{eq:a}
    \end{gather}

For CONTEX, it will be translated into a \startformula,
with \startmathalignment inside.

    \placeformula
    \startformula
    \startmathalignment[n=2]
    \NC A \NC a + b + c \NC\NR
    \NC   \NC 2a + 2b \NC\NR[eq:a]
    \stopmathalignment
    \stopformula

If this one is to be followed by additional sub-equations,
such as the following.

    $ $(#eq:a) A &= a + b + c\\ 
                &= 2a + 2b

    $ $(#eq:b) B &= a + b

    $ $(#eq:c) C &= b + c      

Then for LATEX it becomes.

    \begin{gather}
    \begin{split}
    A &= a + b + c\\ 
    &= 2a + 2b
    \end{split}\\
    B &= a + b\\
    C &= b + c      
    \end{gather}

For CONTEX is becomes:

    \placeformula
    \startformula
    \startmathalignment[n=2]
    \NC A \NC = a + b + c \NR
    \NC  \NC = 2 a + 2 b \NR[eq:a]
    \stopmathalignment
    \stopformula
    \placeformula
    \startformula
    \startmathalignment[n=2]
    \NC B \NC = a + b \NR[eq:b]
    \stopmathalignment
    \stopformula
    \placeformula
    \startformula
    \startmathalignment[n=2]
    \NC C \NC = b + c \NR[eq:c]
    \stopmathalignment
    \stopformula

Thus, the net effect is that both LATEX and CONTEX will *always* treat 
the alignments among two or more main- or sub-equations as "gather".
There is currently no provision to change that into an "align" because
there is no obvious way to implement it on CONTEX. On LATEX it is
possible, and on HTML it can be simulated.

# HTML ENTITY

HTML entity names such as ``&gt;``, ``&lt;`` can also be used inside
the math expression.

    \(a &gt; b\)


# Display style operators 

Following are math operators that would show itself in a form similar
to how they are show in a "display math" style on LATEX. 

    \dfrac
    \dbinom
    \dint
    \dsum
    \dprod
    \dlim

Due to the presence of these operator, there is no need to specify
a "displaymath" mode where the same `\frac` operator will show differently,
as now the difference has been moved to the choice of individual operators,
allowing the same operator to be shown in a consistant way regardless where
it is used.


# Issues and remarks            

- A matching \begin{somename} and \end{somename} environment for which the
  name of the environment is not one of the recognized one will simply be
  treated as a normal braced expression.

- If a \begin{name1} is found for which there is no matching \end{name1}
  then the rest of the expression after \begin{name1} is treated as part
  of that environment and no error is generated.

- For a backslash followed by one or more letters such as \Rot, then it is
  treated as a log-like symbol. For CONTEX/LATEX translation it is to
  generate something like '\;\text{Rot}' to similate this effect. 
  However, this similation is not always perfect.
  First of all, a space \; is always added, even when it is at the beginning
  of an expression. Second, the after-space should be created if \Rot is not
  immediately followed by a parenthesis, which is exactly what \log like 
  operators do.  But this bahavior is not implemented for CONTEX/LATEX
  translation.  For HTML this behavior is correctly similated.

- In LATEX, The double-backslash (\\) in a inline math will actually cause a
  line break in PDF file. In CONTEX, the same double-backslash does not do 
  anything. This is to assume that it is not part of a begin-end matrix 
  or cases. However, in NITRILE, a \\ that is part of the top-level
  expression is repurposed to mean to break down a long expression 
  into two or more lines.

- In LATEX, the ampersand (&) in a inline math that is not part of a
  \begin{matrix} will not show up in the PDF file. NITRILE has repurposed this
  character as expressing the "alignment point" (this is only when this 
  character is not part of a matrix or cases expression.

- The fraction, such as \frac{1}{3} when previewed in HTML, appeared to be a
  little too tall relative to the surrounding text, especailly when 
  LATEX have made it appear a little smaller comparing with the surrounding
  text.

- If a unicode math symbol is entered, such as U+2262 NOT IDENTICAL TO, 
  then HTML translation will display it. However, it will display it without
  treating it as an operator. It is treating it as a text. Thus, this
  symbol gets no extra spacing before and after it. This problem is the 
  same that is to happen to ther Unicode character that need to be 
  treated as an operator like such as plus-sign or minus-sign, to have
  before and after-space. Right now, all these character are treated 
  as a text, thus, no before and after space is allocated.

- The \operatorname{} is not available on CONTEX. NITRILE
  supports it. It is being
  translated as ``{\\:\\mathrm{a}\\:}`` if ``\operatorname{a}`` is 
  detected.

- The ddddot{a} is not supported on CONTEX. Therefore it is
  not provided by NITRILE.

- The \not\equiv symbol is not being rendered correctly on CONTEX; 
  it is rendered as a \not followed by \equiv. Thus, the \not\equiv
  is not supported by NITRILE. The solution to have this symbol
  ("not congruent") is to enter this symbol as a Unicode character,
  in a MD document: U+2262 symbol (≢).

- For unicode characters such as ℤ (U+2124), it cannot be shown
  on LATEX yet because there is no suitable font found to show
  this glyph.

- Note that the backtick and the dollar-sign aren't part of the TEX 
  math expression.  CONTEX even goes so far as to raise an error
  if a dollar-sign or backtick is detected. For this reason and
  others, the math expression detection excludes any appearances
  of backtick and dollar-sign. If they are detected, then it is
  not treated as a math expression but rather as normal text.

- For \usepackage{libertinust1math} the U character when it is
  under \mathcal{U} looks more a little like a V than a U. But I
  think it is a small issue. Overall, this fonts is much better
  when it comes to rendering small letters and numbers such as
  those of a nested fraction.  Especially the vertical spacing 
  between the numerator and denominator seems correct while the native
  LATEX font does this poorly.
  
- Currently for SVG-math it uses nested SVG to shrink the inner SVG,
  in some cases the top part of the letter of ``\xi`` is clipped,
  as in ``\int_{-\infty}^{\infty} f(\xi) \dif{\xi}`` . This does not
  happen in all places, and it differs. For this, iBOOK would have
  clipped the top part of ``\xi``, while Safari does not have this
  problem.
  
- In iBOOK, if the math has only a single letter that is
  ``\mathcal{L}`` then when it is displayed in iBOOK the right part of
  the letter is clipped. This is probably correct because the standard
  unicode SVG outline for this character shows that some part of the
  character lies outside of the bounding box of the found, and thus
  wheneven when the character is shown with the character stretched
  over the entire length, this will only apply to the portion of the
  character that is inside the bounding box, and the part that is
  outside of the bounding box should by definition be outside of the
  bounding box. Not sure how solve this, but a possible solution is to
  include, for each character, an additional member in the 'math.json'
  file to specify the extra amount of space to the left or right, such
  that when being stringed together and it is the last character this
  extra space will be taken into account.

- Note that it is not possible to insert caret and underscore
  in math. These two are reserved characters that are for
  designating superscripts and subscripts.

- When a symbol is entered as a form such as ``&times;``, the name is
  assumed to be a standard named entity that has been standardized by
  the web. If the name does not exist, for instance ``&a;``, then
  entire string is shown instead, including the leading ampersand and
  ending semicolon. Otherwise it could be considered a math operator
  such as ``&times;``, or a normal letter such as ``&Phi;``.
  
- However, if a symbol is entered with a leading backslash, such as
  ``\log``, the name would first go through a validity check to see if
  it is a valid entity. If the answer is yes then it would go through
  the same steps as that of the entity.  However, if the name is not
  recognized then it is check by each local translation to see if it
  is one of the predefined operator known to that translation. For
  instance a ``\bmod`` would have been known to LATEX thus it will be
  used as such. However, if it is not one of the known operators then
  then this will be treated as a user-defined operator.  LATEX and
  CONTEX each has provided a way to dynamically create user defined
  math operators. The operator has the advantage of having a thin
  space if appear directly in front of an operator, or will stay
  closely if an open parenthesis is encountered instead.

- For an inline math the ``&math`` phrase should've been used, for
  which a raw math expression is to be included in there. There are
  other similar phrases such as ``&frac``, ``&binom``, ``&sqrt``,
  ``&root``, etc. See "DOC-phrases" for additional math phrases.

- For displaymath the math-bundle should be used. It generates a
  display  math for LATEX generation, which should center the math
  expression at the middle of the page. For CONTEX it adds the
  \startformula and \stopformula which is the CONTEX's way of
  centering an expression and showing it display-math style.

- For generating plain text within a math, use the ``\text{...}`` command, 
  such as ``\text{Hello World}``.
  The plain text cannot have braces, and could
  contain letters, digits and punctuations. 

- For generating a fill-in horizontal rule, use the ``\hrule{...}`` command,
  such as ``\hrule{1}``. The numbers placed are recognized as expressing 
  multiples of em.  For LATEX this translates to ``\rule{1em}{0.4pt}``. For 
  CONTEX this translates to ``\hl[1]``. For HTML a SVG-line element is generated
  that draw a horizontal line near the bottom. 
  
- For all math-variant symbols, such as "mathscr", "mathcal", "mathbb", etc,
  these commands are no longer functioning. The replacement is to choose
  a suitable symbol name apppriate for the variant. For instance, the symbol
  name "Ascr" should be used for "mathscr" variant of letter "A". 

- It is alright to write ``\overline \Ascr``, for example, that would mean 
  ``\overline{\Ascr}``. The LATEX and CONTEX generation will automatically 
  detect that and place a brace around it to make it conform to the 
  local syntax standard. It has been observed that for LATEX if the command
  "overline" was followed with a symbol without the brace it would have
  broken the compile.



  




