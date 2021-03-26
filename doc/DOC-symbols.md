---
title: NITRILE symbols
---
%colorbutton{outline}

Symbols are those special characters that are inconvenient to express
using only ASCII characters, such as the copyright sign, the pound
sign, degree sign, etc. On the HTML side a symple is typically a UNICODE.
However, it can also be a UNICODE character followed by a combining
diacritics, or a UNICODE character followed by a superscript or subscript
characters.

NITRILE has defined symbols to be one of the following categories:

- A UNICODE symbol, such as ``&copyright;``
- A character with a combining diacritics, such as ``a~dot``
- A superscript: ``a^0``
- A subscript: ``a_0``
- A different font for the same character, such as ``a~mathbf``

There are many benefits of having symbols. First of all, it allows for
a otherwise inconvenient symbols to be mixed with ordinary text.
This is allows for math-like representations such as superscript
or subscripts to be done without added markups.
This convenience becomes useful on the HTML side as symbols are
100 percent compatible with SVG TEXT element, allowing them to be
shown inside a Diagram, which is SVG based.

On the LATEX side thing are a bit easier.
Since TEX recognizes the dollar-sign delimetered "math mode" text
everywhere, even inside a sectional text associated with a chapter or
section, the translated text for a LATEX document would include
the dollar sign "sandwidged" symbol name if the symbol is only
for a math mode, or "braced" symbol name if it is for a text mode.

The symbol names are chosen to match the corresponding
LATEX commands if they so exist.
For example, ``\emptyset``, and ``\dag`` are both valid symbol names
on the LATEX side. Thus, the symbol names are chosen to be "emptyset" and
"dag". Some symbol names, such "copyright",
do not correspond directly to a command on the LATEX side.
However, there are equivalent commands such as ``\textcopyright`` that
provides an equivalent symbol. In this case the symbol name "copyright"
would have been translated into a ``\textcopyright`` command
on the LATEX side.

NITRILE has so designed that all symbol names could also function
as a command within a math expression. In this case, the command will
have be in the form of a backslash followed by the name of the symbol.
For example: ``a + b = \copyright``

Note that LATEX recognizes the difference between a text-mode based symbol
and a math-mode based symbol. Thus, if a text-mode symbol such as ``\textcopyright``
is to be translated into an math-mode expression, then NITRILE automatically
adds the ``\text{}`` command around it so that it becmes ``\text{\textcopyright}``.
If a math-mode symbol such as ``\dag`` is to be used within a
non math-mode text, NITRILE automatically
adds a dollar-sign before and after it so that it becomes ``$\dag$``.

NITRILE attempts to ensure that all supported symbols will
work on the LATEX and HTML side, and they will show a similar look
and feel for the same symbol. However, due to the differences in
implementation and font choices, not all symbols will look identical
all the time.

With the introduction of CONTEXT translation,
things can become a bit tricky. The same LATEX commands for generating
the symbol on the LATEX side will be used for generating symbols on
the CONTEXT side. Even though CONTEXT share many symbol names with
those one the LATEX side, it has been shown that some LATEX symbol commands
simply are not work on the CONTEXT side.

Following are the key points about the symbols:

- All symbols are guaranteed to work on HTML and LATEX,
  However, not all symbols are availabel on CONTEXT.

- Following packages are designed to work with Latex2e:
  "latexsym", "amsfonts", "amssymb", "txfonts", "pxfonts",
  and "wasysym".

- Symbols can also be referenced inside a math expression,
  using the "backslash notation".
  For example, the "ballotx"
  symbol can be referenced inside a math expression
  as ``\ballotx``.

- The "wasysym" is safe to include. However, the "pentagon"
  and the "hexagon", and "varhexagon" symbols it claims
  to provide cannot be made to work and it is currently not
  included for some other unknown reasons (maybe it has some
  conflict with CJK package)

- The "arev" package cannot be included. It has shown to
  cause many other symbols to disappear.

- The "pifont" package is safe to include. It has been used
  to provide symbol such as ``ballotx``. Note that all the symbols
  it defines are text mode symbols, such as ``\ding{55}``

- Dingbats are symbols such as stars, arrows, and geometric shapes. They are
  commonly used as bullets in itemized lists or, more generally, as a means to
  draw attention to the text that follows.

- The "pifont" dingbat package warrants special mention.
  Among other capabilities, pifont provides a LATEX interface to the Zapf
  Dingbats font (one of the standard 35 PostScript fonts). However, rather than
  name each of the dingbats individually, pifont merely provides a single
  ``\ding`` command, which outputs the character that lies at a given
  position in the font. The consequence is that the pifont symbols
  can’t be listed by name in this document’s index, so be mindful of
  that fact when searching for a particular symbol.

- The "svrsymbols" package is safe to use.

- The "ar" package is safe to use. It defines the ``\AR``, the
  aspect ratio  symbol.

- The "gensymb" package is safe to use. It defines the following
  symbols: ``\celsius`` ``\micro`` ``\perthousand`` ``\degree`` ``\ohm``

- The "mathabx" package is not safe to use. It defines the following
  symbols: ``\fourth`` ``\third`` ``\second``. But it complains some other
  symbols being multiply defined.

- The "mathdots" package is safe to use. However, the symbols it defines
  ``\ddots`` ``\iddots`` ``vdots`` does not seems to work correctly.

- The "metre" package is safe to use. It offers many text-mode based
  delimeters, such as:
  ``\alad`` ``\Alad`` ``\Quadrad`` ``\Quadras`` ``\angud``
  ``\Angud`` ``\Crux``

- The "textcomp" package is safe to use:
  ``\textlangle`` ``\textrangle`` ``\textlbrackdbl``
  ``\textrbrackdbl`` ``\textlquill`` ``\textrquill``

- The "columnequals" package is safe to use:
  ``\approxcolon`` ``\coloncolonminus`` ``\equalscoloncolon``
  and more.

- The "mathcolons" package is safe to use, it defines many
  binary relation operators related to colon equals.

- The "mathtools" package defines the following
  colon related relation symbols:
  ``\Colonapprox``
  ``\colonapprox``
  ``\coloneqq``
  ``\Coloneqq``
  ``\coloneq``
  ``\colonsim``
  ``\Colonsim``
  ``\dblcolon``
  ``\eqcolon``
  ``\Eqcolon``
  ``\eqqcolon``
  ``\Eqqcolon``
  ``\Coloneq``

- The "ifsym" package is safe to include. 

- The ``\mid`` and ``|`` are different. The former is a binary
  operation while the latter is a math ordinal. Contrast
  ``P(A|B)`` versus ``P(A \mid B)``, where the former does not
  allocate any spacing before and after ``|``, while the latter
  allocate spacing before and after ``\mid``.

- The "MnSymbol" package is not safe to include. It defines
  the ``filledlargestar`` symbol and others. But including
  it causes ``\varkappa`` to disappear and become undefined 
  command.

- The "stix" package is not to be included. When included after
  other packages it causes many commands to become unavailable.
  When included as the first package it does not generate any
  compile errors but many symbols disappears.

- The "marvosym" package is safe to use. It provides a "Hexasteel"
  symbol which is used as a replacement for "HEXAGON", a black
  hexagon symbol. Note that they symbols are text-based symbols.

- The "fdsymbol" package is not safe to use. It has been shown to
  mess up all symbols that are placed under "mathbb" font variants,
  i.e., ``\mathbb{a}``, ``\mathbb{A}``.

- The "boisik" package is not safe to use. When included, it messes
  up the appearance that is supposed to be shown with "mathbf"
  and "mathit" symbols and they are no longer shown as bold faced
  and/or italic.

- The "adform" package is safe to use.

- The "fourier" package is not safe to use. When included many other
  symbols will disappear.

- The "stmaryrd" package is save to include. However, it is not included
  because it redefines "\bigtriangleup" and "\bigtriangledown" such that 
  it looks too big.

- So far the symbols "pentagon", "PENTAGON", and "hexagon" does not
  work on LATEX side. The ``\pentagon`` and ``\hexagon`` commands
  compiles but fails to show visual. The ``\PENTAGON`` command
  is not availabe and no equivalents can be found.

- For symbol ``\wp``, it could be two choices: one is U+2118, which has a look
  that is similar to those found on LATEX. However, according to some sources
  the correct choice of UNICODE is U+1D4AB. As of now, the later one is
  selected.

- These symbols are availabe on LATEX with special commands, but
  preferably including "textcomp" package will redefine them
  to be a better version.

  ```
    {  \{    _  \_           ‡  \ddag     £  \pounds
    }  \}    ©  \copyright   ...  \dots   §  \S
    $  \$    †  \dag         ¶  \P
  ```

- Following are common LATEX symbols and its corresponding standard
  entity name: clock, weather, misc, alpine, geometry, and electronic.
  The PDF manual for this package is written in German.

  ```
    \cdot            \sdot
    \cdots           \ctdot
    \angle           \ang
    \leftarrow       \larr
    \rightarrow      \rarr
    \Leftarrow       \lArr
    \Rightarrow      \rArr
    \Longleftarrow   \xlArr
    \Longrightarrow  \xrArr
    \longleftarrow   \xlarr
    \longrightarrow  \xrarr
    \iddots          \dtdot
    \ddots           \dtdot
    \udots           \utdot
  ```

- Note that the \udots symbol are only provided by "MnSymbol" and "fdsymbol" package,
  neither of which are safe to include given the other included packages; therefore
  current `&utdot;` entity is not available in LATEX--it will be generated as a Unicode
  entry which will cause problem when generating PDFLATEX.

- To use the "ifsym" package it must be specified with an option; the available
  options are: clock, weather, misc, alpine, geometry, and electronic.

  \usepackage[geometry]{ifsym} 


# GREEK CAPITAL AND SMALL LETTERS

```tabular{border:2;n:2}
   | Symbol                                  | Command
   ------------------------------------------------------------------------------
   | &Alpha; and &alpha;                     |  `&Alpha;` and `&alpha;`
   | &Beta;  and &beta;                      |  `&Beta;`  and `&beta;`
   | &Gamma; and &gamma;                     |  `&Gamma;` and `&gamma;`
   | &Delta; and &delta;                     |  `&Delta;` and `&delta;`
   | &Epsilon;, &epsilon; and &varepsilon;   |  `&Epsilon;`, `&epsilon;` and `&varepsilon;`
   | &Zeta; and &zeta;                       |  `&Zeta;` and `&zeta;`
   | &Eta; and &eta;                         |  `&Eta;` and `&eta;`
   | &Theta;, &theta; and &vartheta;         |  `&Theta;`, `&theta;` and `&vartheta;`
   | &Iota; and &iota;                       |  `&Iota;` and `&iota;`
   | &Kappa;, &kappa; and &varkappa;         |  `&Kappa;`, `&kappa;` and `&varkappa;`
   | &Lambda; and &lambda;                   |  `&Lambda;` and `&lambda;`
   | &Mu; and &mu;                           |  `&Mu;` and `&mu;`
   | &Nu; and &nu;                           |  `&Nu;` and `&nu;`
   | &Xi; and &xi;                           |  `&Xi;` and `&xi;`
   | &Omicron; and &omicron;                 |  `&Omicron;` and `&omicron;`
   | &Pi;, &pi; and &varpi;                  |  `&Pi;`, `&pi;` and `&varpi;`
   | &Rho;, &rho; and &varrho;               |  `&Rho;`, `&rho;` and `&varrho;`
   | &Sigma;, &sigma; and &varsigma;         |  `&Sigma;`, `&sigma;` and `&varsigma;`
   | &Tau; and &tau;                         |  `&Tau;` and `&tau;`
   | &Upsilon; and &upsilon;                 |  `&Upsilon;` and `&upsilon;`
   | &Phi;, &phi; and &varphi;               |  `&Phi;`, `&phi;` and `&varphi;`
   | &Chi; and &chi;                         |  `&Chi;` and `&chi;`
   | &Psi; and &psi;                         |  `&Psi;` and `&psi;`
   | &Omega; and &omega;                     |  `&Omega;` and `&omega;`
   | &Digamma; and &digamma;                 |  `&Digamma;` and `&digamma;`
```

# GENERAL    OPERATORS

```tabular{border:2;n:2}
  | Symbol              |  Command               | Comment
  ------------------------------------------------------------------------------
  | &DiacriticalGrave;  |  DiacriticalGrave      | [!DiacriticalGrave!]
  | &amp;               |  amp                   | [!amp!]
  | &quot;              |  quot                  | [!quot!]
  | &apos;              |  apos                  | [!apos!]
```

# RELATIONAL OPERATORS

```tabular{border:2;n:2}
  | Symbol              |  Command               | Comment
  ------------------------------------------------------------------------------
  | &nless;             |  nless                 | [!nless!]
  | &leq;               |  leq                   | [!leq!]
  | &leqslant;          |  leqslant              | [!leqslant!]
  | &nleq;              |  nleq                  | [!nleq!]
  | &nleqslant;         |  nleqslant             | [!nleqslant!]
  | &prec;              |  prec                  | [!prec!]
  | &nprec;             |  nprec                 | [!nprec!]
  | &preceq;            |  preceq                | [!preceq!]
  | &npreceq;           |  npreceq               | [!npreceq!]
  | &ll;                |  ll                    | [!ll!]
  | &lll;               |  lll                   | [!lll!]
  | &ngtr;              |  ngtr                  | [!ngtr!]
  | &geq;               |  geq                   | [!geq!]
  | &geqslant;          |  geqslant              | [!geqslant!]
  | &ngeq;              |  ngeq                  | [!ngeq!]
  | &ngeqslant;         |  ngeqslant             | [!ngeqslant!]
  | &succ;              |  succ                  | [!succ!]
  | &nsucc;             |  nsucc                 | [!nsucc!]
  | &succeq;            |  succeq                | [!succeq!]
  | &nsucceq;           |  nsucceq               | [!nsucceq!]
  | &gg;                |  gg                    | [!gg!]
  | &ggg;               |  ggg                   | [!ggg!]
  | &doteq;             |  doteq                 | [!doteq!]
  | &equiv;             |  equiv                 | [!equiv!]
  | &approx;            |  approx                | [!approx!]
  | &cong;              |  cong                  | [!cong!]
  | &simeq;             |  simeq                 | [!simeq!]
  | &sim;               |  sim                   | [!sim!]
  | &propto;            |  propto                | [!propto!]
  | &ne;                |  ne                    | [!ne!]
  | &parallel;          |  parallel              | [!parallel!]
  | &nparallel;         |  nparallel             | [!nparallel!]
  | &asymp;             |  asymp                 | [!asymp!]
  | &vdash;             |  vdash                 | [!vdash!]
  | &smile;             |  smile                 | [!smile!]
  | &models;            |  models                | [!models!]
  | &perp;              |  perp                  | [!perp!]
  | &bowtie;            |  bowtie                | [!bowtie!]
  | &dashv;             |  dashv                 | [!dashv!]
  | &frown;             |  frown                 | [!frown!]
  | &in;                |  in                    | [!in!]
  | &notin;             |  notin                 | [!notin!]
  | &ReverseElement;    |  ReverseElement        | [!ReverseElement!]
  | &NotReverseElement; |  NotReverseElement     | [!NotReverseElement!]
  | &mid;               |  mid                   | [!mid!]
  | &nmid;              |  nmid                  | [!nmid!]
```

# BINARY OPERATORS


```tabular{border:2;n:2}
  | Symbol              |  Command             | Comment
  ---------------------------------------------------------------
  | &pm;                |  pm                  | [!pm!]
  | &mp;                |  mp                  | [!mp!]
  | &times;             |  times               | [!times!]
  | &Cross;             |  Cross               | [!Cross!]
  | &div;               |  div                 | [!div!]
  | &ast;               |  ast                 | [!ast!]
  | &uplus;             |  uplus               | [!uplus!]
  | &sqcap;             |  sqcap               | [!sqcap!]
  | &sqcup;             |  sqcup               | [!sqcup!]
  | &vee;               |  vee                 | [!vee!]
  | &wedge;             |  wedge               | [!wedge!]
  | &CircleDot;         |  CircleDot           | [!CircleDot!]
  | &diamond;           |  diamond             | [!diamond!]
  | &bullet;            |  bullet              | [!bullet!]
  | &wreath;            |  wreath              | [!wreath!]
  | &oplus;             |  oplus               | [!oplus!]
  | &ominus;            |  ominus              | [!ominus!]
  | &otimes;            |  otimes              | [!otimes!]
  | &oslash;            |  oslash              | [!oslash!]
  | &CircleDot;         |  CircleDot           | [!CircleDot!]
  | &SmallCircle;       |  SmallCircle         | [!SmallCircle!]
  | &prod;              |  prod                | [!prod!]
  | &coprod;            |  coprod              | [!coprod!]
  | &sum;               |  sum                 | [!sum!]
  | &increment;         |  increment           | [!increment!]
  | &nabla;             |  nabla               | [!nabla!]
```

# SET SYMBOLS

```tabular{border:2;n:2;fr:1 2 4}
  | Symbol              |  Command             | Comment
  ----------------------------------------------------------------
  | &emptyset;          | `&emptyset;`         | [!emptyset!]
  | &naturals;          | `&naturals;`         | [!naturals!]
  | &integers;          | `&integers;`         | [!integers!]
  | &rationals;         | `&rationals;`        | [!rationals!]
  | &algebraics;        | `&algebraics;`       | [!algebraics!]
  | &reals;             | `&reals;`            | [!reals!]
  | &complexes;         | `&complexes`         | [!complexes!]
  | &quaternions;       | `&quaternions;`      | [!quaternions!]
  | &octonions;         | `&octonions;`        | [!octonions!]
  | &sedenions;         | `&sedenions;`        | [!sedenions!]
```


# LOGICAL SYMBOLS

```tabular{border:2;n:2;fr:1 2 4}
  | Symbol              |  Commands            | Comment
  ----------------------------------------------------------------
  | &exist;             |  exist               | [!exist!]
  | &nexist;            |  nexist              | [!nexist!]
  | &forall;            |  forall              | [!forall!]
  | &neg;               |  neg                 | [!neg!]
  | &xvee;              |  xvee                | [!xvee!]
  | &xwedge;            |  xwedge              | [!xwedge!]
  | &top;               |  top                 | [!top!]
  | &bot;               |  bot                 | [!bot!]
  | &subset;            |  subset              | [!subset!]
  | &nsubset;           |  nsubset             | [!nsubset!]
  | &subseteq;          |  subseteq            | [!subseteq!]
  | &nsubseteq;         |  nsubseteq           | [!nsubseteq!]
  | &sqsubset;          |  sqsubset            | [!sqsubset!]
  | &sqsubseteq;        |  sqsubseteq          | [!sqsubseteq!]
  | &supset;            |  supset              | [!supset!]
  | &nsupset;           |  nsupset             | [!nsupset!]
  | &supseteq;          |  supseteq            | [!supseteq!]
  | &nsupseteq;         |  nsupseteq           | [!nsupseteq!]
  | &sqsupset;          |  sqsupset            | [!sqsupset!]
  | &sqsupseteq;        |  sqsupseteq          | [!sqsupseteq!]
  | &cap;               |  cap                 | [!cap!]
  | &cup;               |  cup                 | [!cup!]
  | &setminus;          |  setminus            | [!setminus!]
```

-- \(a > b \hArr b < a\)

# GROUP THEORY SYMBOLS

```tabular{border:2;n:2;fr:1 2 4}
  | Symbol              |  Commands            | Comment
  ----------------------------------------------------------------
  | &vltri;             |  vltri               | [!vltri!]
  | &vrtri;             |  vrtri               | [!vrtri!]
  | &vltrie;            |  vltrie              | [!vltrie!]
  | &vrtrie;            |  vrtrie              | [!vrtrie!]
  | &nltri;             |  nltri               | [!nltri!]
  | &nrtri;             |  nrtri               | [!nrtri!]
```

-- \(F \vltri G\)
-- \(F \nltri G\)
-- \(G \vrtri F\)
-- \(G \nrtri F\)



# DOTS

```tabular{border:2;n:2}
  | Symbol              |  Commands            | Comment
  ----------------------------------------------------------------
  | &sdot;              |  sdot                | [!sdot!]
  | &vellip;            |  vellip              | [!vellip!]
  | &hellip;            |  hellip              | [!hellip!]
  | &ctdot;             |  ctdot               | [!ctdot!]
  | &dtdot;             |  dtdot               | [!dtdot!]
  | &utdot;             |  utdot               | [!utdot!]
```


# DELIMETERS

```tabular{border:2;n:2;fr:1 2 4}
  | Symbol              |  Commands            | Comment
  ----------------------------------------------------------------
  | &lceil;             |  lceil               | [!lceil!]
  | &rceil;             |  rceil               | [!rceil!]
  | &ulcorner;          |  ulcorner            | [!ulcorner!]
  | &urcorner;          |  urcorner            | [!urcorner!]
  | &lfloor;            |  lfloor              | [!lfloor!]
  | &rfloor;            |  rfloor              | [!rfloor!]
  | &llcorner;          |  llcorner            | [!llcorner!]
  | &lrcorner;          |  lrcorner            | [!lrcorner!]
  | &lang;              |  lang                | [!lang!]
  | &rang;              |  rang                | [!rang!]
  | &vert;              |  vert                | [!vert!]
  | &Vert;              |  Vert                | [!Vert!]
```

# LEFT AND RIGHT POINTNG ARROWS

~~~table{border:2;n:2;}
  | Symbol              |  Commands            | Comment
  ----------------------------------------------------------------
  | &mapsto;            |  mapsto              | [!mapsto!]
  | &xmapsto;           |  xmapsto             | [!xmapsto!]
  ----------------------------------------------------------------
  | &rarr;              |  rarr                | [!rarr!]
  | &rArr;              |  rArr                | [!rArr!]
  | &xrarr;             |  xrarr               | [!xrarr!]
  | &xrArr;             |  xrArr               | [!xrArr!]
  ----------------------------------------------------------------
  | &larr;              |  larr                | [!larr!]
  | &lArr;              |  lArr                | [!lArr!]       
  | &xlarr;             |  xlarr               | [!xlarr!]
  | &xlArr;             |  xlArr               | [!xlArr!]
  ---------------------------------------------------------------
  | &harr;              |  harr                | [!harr!]
  | &xharr;             |  xharr               | [!xharr!]
  | &hArr;              |  hArr                | [!hArr!]
  | &xhArr;             |  xhArr               | [!xhArr!]
~~~


# UP AND DOWN POINTING ARROWS

```tabular{border:2;n:2;fr:1 2 4}
  | Symbol              |  Commands            | Comment
  ----------------------------------------------------------------
  | &uarr;              |  uarr                | [!uarr!]
  | &uArr;              |  uArr                | [!uArr!]
  | &darr;              |  darr                | [!darr!]
  | &dArr;              |  dArr                | [!dArr!]
  | &varr;              |  varr                | [!varr!]
  | &vArr;              |  vArr                | [!vArr!]
```


# HEBREW LETTER LIKE SYMBOLS

```tabular{border:2;n:2;fr:1 2 4}
  | Symbol              |  Commands            | Comment
  ----------------------------------------------------------------
  | &aleph;             |  aleph               | [!aleph!]
  | &beth;              |  beth                | [!beth!]
  | &gimel;             |  gimel               | [!gimel!]
  | &daleth;            |  daleth              | [!daleth!]
```

# Fraction symbols

```tabular{border:2;n:2;fr:1 2 4}
  | Symbol              |  Commands            | Comment
  ----------------------------------------------------------------
  | &frac12;            |  frac12              | [!frac12!]
  | &frac13;            |  frac13              | [!frac13!]
  | &frac23;            |  frac23              | [!frac23!]
  | &frac14;            |  frac14              | [!frac14!]
  | &frac34;            |  frac34              | [!frac34!]
  | &frac15;            |  frac15              | [!frac15!]
  | &frac25;            |  frac25              | [!frac25!]
  | &frac35;            |  frac35              | [!frac35!]
  | &frac45;            |  frac45              | [!frac45!]
  | &frac16;            |  frac16              | [!frac16!]
  | &frac56;            |  frac56              | [!frac56!]
  | &frac17;            |  frac17              | [!frac17!]
  | &frac18;            |  frac18              | [!frac18!]
  | &frac38;            |  frac38              | [!frac38!]
  | &frac58;            |  frac58              | [!frac58!]
  | &frac78;            |  frac78              | [!frac78!]
  | &frac19;            |  frac19              | [!frac19!]
  | &frac110;           |  frac110             | [!frac110!]
  | &frac03;            |  frac03              | [!frac03!]
```

# COMBINING DIACRITICS

```tabular{border:2;n:2;fr:1 2 4}
  | Symbol               |  Commands             | Comment
  ----------------------------------------------------------------
  | a~dot                |  a~dot                |
  | a~ddot               |  a~ddot               |
  | a~bar                |  a~bar                |
  | a~mathring           |  a~mathring           |
  | a~hat                |  a~hat                |
  | a~check              |  a~check              |
  | a~grave              |  a~grave              |
  | a~acute              |  a~acute              |
  | a~breve              |  a~breve              |
  | a~tilde              |  a~tilde              |
```


# MATH FONT VARIANTS

The math variant symbol allows for an alternative UNICODE to
appear instead of the current letter. Following are supported
math variants.

- mathbf
- mathbb
- mathit
- mathcal

To specify an alternative math symbol, use the syntax such
as ``a~mathbf``, to specify the alternative "mathbf" font for
letter "a". Only capitals and small letters (A-Z and a-z)
are supported.

The letter "a" in the previous example must not follow another
character such as ``aa~mathbf`` or ``1a~mathbf``.
The math variant symbol name "mathbf"
must not be followed by another letter or digit such as
``a~mathbfx`` or ``a~mathbf1``.

```tabular
| mathbb         |  mathbfds      | mathit         | mathcal
---------------------------------------------------------------
| a~mathbb       | a~mathbf       | a~mathit       | a~mathcal
| b~mathbb       | b~mathbf       | b~mathit       | b~mathcal
| c~mathbb       | c~mathbf       | c~mathit       | c~mathcal
| d~mathbb       | d~mathbf       | d~mathit       | d~mathcal
| e~mathbb       | e~mathbf       | e~mathit       | e~mathcal
| f~mathbb       | f~mathbf       | f~mathit       | f~mathcal
| g~mathbb       | g~mathbf       | g~mathit       | g~mathcal
| h~mathbb       | h~mathbf       | h~mathit       | h~mathcal
| i~mathbb       | i~mathbf       | i~mathit       | i~mathcal
| j~mathbb       | j~mathbf       | j~mathit       | j~mathcal
| k~mathbb       | k~mathbf       | k~mathit       | k~mathcal
| l~mathbb       | l~mathbf       | l~mathit       | l~mathcal
| m~mathbb       | m~mathbf       | m~mathit       | m~mathcal
| n~mathbb       | n~mathbf       | n~mathit       | n~mathcal
| o~mathbb       | o~mathbf       | o~mathit       | o~mathcal
| p~mathbb       | p~mathbf       | p~mathit       | p~mathcal
| q~mathbb       | q~mathbf       | q~mathit       | q~mathcal
| r~mathbb       | r~mathbf       | r~mathit       | r~mathcal
| s~mathbb       | s~mathbf       | s~mathit       | s~mathcal
| t~mathbb       | t~mathbf       | t~mathit       | t~mathcal
| u~mathbb       | u~mathbf       | u~mathit       | u~mathcal
| v~mathbb       | v~mathbf       | v~mathit       | v~mathcal
| w~mathbb       | w~mathbf       | w~mathit       | w~mathcal
| x~mathbb       | x~mathbf       | x~mathit       | x~mathcal
| y~mathbb       | y~mathbf       | y~mathit       | y~mathcal
| z~mathbb       | z~mathbf       | z~mathit       | z~mathcal
```
```tabular
| mathbb         |  mathbfds      | mathit         | mathcal
---------------------------------------------------------------
| A~mathbb       | A~mathbf       | A~mathit       | A~mathcal
| B~mathbb       | B~mathbf       | B~mathit       | B~mathcal
| C~mathbb       | C~mathbf       | C~mathit       | C~mathcal
| D~mathbb       | D~mathbf       | D~mathit       | D~mathcal
| E~mathbb       | E~mathbf       | E~mathit       | E~mathcal
| F~mathbb       | F~mathbf       | F~mathit       | F~mathcal
| G~mathbb       | G~mathbf       | G~mathit       | G~mathcal
| H~mathbb       | H~mathbf       | H~mathit       | H~mathcal
| I~mathbb       | I~mathbf       | I~mathit       | I~mathcal
| J~mathbb       | J~mathbf       | J~mathit       | J~mathcal
| K~mathbb       | K~mathbf       | K~mathit       | K~mathcal
| L~mathbb       | L~mathbf       | L~mathit       | L~mathcal
| M~mathbb       | M~mathbf       | M~mathit       | M~mathcal
| N~mathbb       | N~mathbf       | N~mathit       | N~mathcal
| O~mathbb       | O~mathbf       | O~mathit       | O~mathcal
| P~mathbb       | P~mathbf       | P~mathit       | P~mathcal
| Q~mathbb       | Q~mathbf       | Q~mathit       | Q~mathcal
| R~mathbb       | R~mathbf       | R~mathit       | R~mathcal
| S~mathbb       | S~mathbf       | S~mathit       | S~mathcal
| T~mathbb       | T~mathbf       | T~mathit       | T~mathcal
| U~mathbb       | U~mathbf       | U~mathit       | U~mathcal
| V~mathbb       | V~mathbf       | V~mathit       | V~mathcal
| W~mathbb       | W~mathbf       | W~mathit       | W~mathcal
| X~mathbb       | X~mathbf       | X~mathit       | X~mathcal
| Y~mathbb       | Y~mathbf       | Y~mathit       | Y~mathcal
| Z~mathbb       | Z~mathbf       | Z~mathit       | Z~mathcal
```



# SUPERSCRIPTS

The superscript a^1 is written as `a^1`. Superscript can only be a single digit,
and the base can only be a single letter A-Z and/or a-z.

In order to be recognized as a superscript, the
base and superscript must be a single letter and/or digit. It
can not follow immediately
another word character such as ``aa^1``, ``1a^1``. The superscript
cannot be followed immediately be another letter or digit either,
such as ``a^0a``, or ``a^00``.

Because of the limitation of the UNICODE superscript characters,
only the letter n, and i, and digits 0-9 are available as superscript.
The base can only be a single digit letter that is in the
range of a-z, and/or A-Z.

```tabular{border:2;n:2}
  | Symbol               |  Commands             | Comment
  ----------------------------------------------------------------
  | a^0                  |  a^0                  |
  | a^1                  |  a^1                  |
  | a^2                  |  a^2                  |
  | a^3                  |  a^3                  |
  | a^4                  |  a^4                  |
  | a^5                  |  a^5                  |
  | a^6                  |  a^6                  |
  | a^7                  |  a^7                  |
  | a^8                  |  a^8                  |
  | a^9                  |  a^9                  |
  | a^n                  |  a^n                  |
  | a^i                  |  a^i                  |
  | a^c                  |  a^c                  |
```


# SUBSCRIPTS

The subscript a_1 is written as `a_1`. The base and subscript
 can only be a single letter or digit.

The base cannot immediately
 follow another word character such as ``aa_0``, ``1a_0``. The subscript
cannot immediately be followed by another word
character, such as ``a_0a``, or ``a_00``.

Due to the limitation of available UNICODE subscript characters,
only the letter x, h, k, l, m, n, p, s, t and digits 0-9 can serve
as the subscript. The base can only be a letter in the range of
a-z and A-Z.


```tabular{border:2;n:2}
  | Symbol               |  Commands             | Comment
  ----------------------------------------------------------------
  | a_1                  |  a_1                  |
  | a_2                  |  a_2                  |
  | a_3                  |  a_3                  |
  | a_4                  |  a_4                  |
  | a_5                  |  a_5                  |
  | a_6                  |  a_6                  |
  | a_7                  |  a_7                  |
  | a_8                  |  a_8                  |
  | a_9                  |  a_9                  |
  | a_0                  |  a_0                  |
  | a_a                  |  a_a                  |
  | a_e                  |  a_e                  |
  | a_o                  |  a_o                  |
  | a_x                  |  a_x                  |
  | a_h                  |  a_h                  |
  | a_k                  |  a_k                  |
  | a_l                  |  a_l                  |
  | a_m                  |  a_m                  |
  | a_n                  |  a_n                  |
  | a_p                  |  a_p                  |
  | a_s                  |  a_s                  |
  | a_t                  |  a_t                  |
```


# COLONEQUAL RELATED SHAPES

```tabular{border:2;n:2}
 | Symbol             | Command                | Comment
 ------------------------------------------------------------------
 | &coloneq;          | coloneq                | [!coloneq!]
 | &eqcolon;          | eqcolon                | [!eqcolon!]
```


# OTHER SYMBOLS

```tabular{border:2;n:2}
 | Symbol              | Command                | Comment
 ------------------------------------------------------------------
 | &deg;               | deg                    | [!deg!], "&deg;C", "&deg;F"
```

# LETTER-LIKE SYMBOLS

```tabular{border:2;n:2}
 | Symbol              | Command                | Comment
 ------------------------------------------------------------------
 | &complement;        | complement             | [!complement!]
 | &hbar;              | hbar                   | [!hbar!]
 | &eth;               | eth                    | [!eth!]
 | &imath;             | imath                  | [!imath!]
 | &jmath;             | jmath                  | [!jmath!]
 | &ell;               | ell                    | [!ell!]
 | &partial;           | partial                | [!partial!]
 | &wp;                | wp                     | [!wp!]
 | &Im;                | Im                     | [!Im!]
 | &Re;                | Re                     | [!Re!]
 | &infty;             | infty                  | [!infty!]
 | &questiondown;      | questiondown           | [!questiondown!]
```




# CURRENCY SYMBOLS

```tabular{border:2;n:2}
 |  Symbol         | Command          | Comment
 -------------------------------------------------------------------
 |  &baht;         | baht             | [!baht!]
 |  &cent;         | cent             | [!cent!]
 |  &currency;     | currency         | [!currency!]
 |  &dollar;       | dollar           | [!dollar!]
 |  &dong;         | dong             | [!dong!]
 |  &euro;         | euro             | [!euro!]
 |  &florin;       | florin           | [!florin!]
 |  &guarani;      | guarani          | [!guarani!]
 |  &lira;         | lira             | [!lira!]
 |  &naira;        | naira            | [!naira!]
 |  &peso;         | peso             | [!peso!]
 |  &pound;        | pound            | [!pound!]
 |  &won;          | won              | [!won!]
 |  &yen;          | yen              | [!yen!]
```


# LATIN LETTERS

```tabular{border:2;n:2}
 | Symbol      | Command         | Comment
 ------------------------------------------------------------------
 | &aring;     | aring           | [!aring!]
 | &Aring;     | aring           | [!Aring!]
 | &AElig;     | AElig           | [!AElig!]
 | &aelig;     | aelig           | [!aelig!]
 | &eth;       | eth             | [!eth!]
 | &ETH;       | ETH             | [!ETH!]
 | &Dstrok;    | Dstrok          | [!Dstrok!]
 | &dstrok;    | dstrok          | [!dstrok!]
 | &IJlig;     | IJlig           | [!IJlig!]
 | &ijlig;     | ijlig           | [!ijlig!]
 | &Lstrok;    | Lstrok          | [!Lstrok!]
 | &lstrok;    | lstrok          | [!lstrok!]
 | &ENG;       | ENG             | [!ENG!]
 | &eng;       | eng             | [!eng!]
 | &Oslash;    | Oslash          | [!Oslash!]
 | &oslash;    | oslash          | [!oslash!]
 | &oelig;     | oelig           | [!oelig!]
 | &OElig;     | OElig           | [!OElig!]
 | &thorn;     | thorn           | [!thorn!]
 | &THORN;     | THORN           | [!THORN!]
 | &mho;       | mho             | [!mho!]
 | &hstrok;    | hstrok          | [!hstrok!]
```

# GEOMETRIC SHAPES & DINGBAT

```tabular{border:2;n:2}
| Symbol              |  Command                | Comment
------------------------------------------------------------------
| &bigcirc;           |  bigcirc                | [!bigcirc!]
| &bigtriangleup;     |  bigtriangleup          | [!bigtriangleup!]
| &bigtriangledown;   |  bigtriangledown        | [!bigtriangledown!]
| &star;              |  star                   | [!star!]
| &copy;              |  copy                   | [!copy!]
| &reg;               |  reg                    | [!reg!]
| &SM;                |  SM                     | [!SM!]
| &trade;             |  trade                  | [!trade!]
| &dagger;            |  dagger                 | [!dagger!]
| &Dagger;            |  Dagger                 | [!Dagger!]
| &para;              |  para                   | [!para!]
| &sect;              |  sect                   | [!sect!]
| &checkmark;         |  checkmark              | [!checkmark!]
| &maltese;           |  maltese                | [!maltese!]
| &cross;             |  cross                  | [!cross!]
| &ang;               |  ang                    | [!ang!]
| &angmsd;            |  angmsd                 | [!angmsd!]
| &angsph;            |  angsph                 | [!angsph!]
| &xutri;             |  xutri                  | [!xutri!]
| &xdtri;             |  xdtri                  | [!xdtri!]
| &utri;              |  utri                   | [!utri!]
| &rtri;              |  rtri                   | [!rtri!]
| &dtri;              |  dtri                   | [!dtri!]
| &ltri;              |  ltri                   | [!ltri!]
| &square;            |  square                 | [!square!]
| &blacksquare;       |  blacksquare            | [!blacksquare!]
| &cir;               |  cir                    | [!cir!]
```

# Non-standard Symbols

```tabular
| Symbol               | Command                | Comment
------------------------------------------------------------------
| &BallotBox;          | BallotBox              | [!BallotBox!]        
| &BallotBoxWithCheck; | BallotBoxWithCheck     | [!BallotBoxWithCheck!]
| &BallotBoxWithX;     | BallotBoxWithX         | [!BallotBoxWithX!]
| &CircleBoxO;         | CircleBoxO             | [!CircleBoxO!]      
| &CircleBox;          | CircleBox              | [!CircleBox!]      
| &SquareBoxO;         | SquareBoxO             | [!SquareBoxO!]      
| &SquareBox;          | SquareBox              | [!SquareBox!]       
| &ChevronLeft;        | ChevronLeft            | [!ChevronLeft!]     
| &ChevronRight;       | ChevronRight           | [!ChevronRight!]    
| &ChevronUp;          | ChevronUp              | [!ChevronUp!]       
| &ChevronDown;        | ChevronDown            | [!ChevronDown!]     
| &BigSquare;          | BigSquare              | [!BigSquare!]       
| &CaretRight;         | CaretRight             | [!CaretRight!]      
| &CaretDown;          | CaretDown              | [!CaretDown!]       
| &Pencil;             | Pencil                 | [!Pencil!]          
```  

