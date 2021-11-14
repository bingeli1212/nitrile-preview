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

  ```verbatim
  {  \{    _  \_           ‡  \ddag     £  \pounds
  }  \}    ©  \copyright   ...  \dots   §  \S
  $  \$    †  \dag         ¶  \P
  ```

- Following are common LATEX symbols and its corresponding standard
  entity name: clock, weather, misc, alpine, geometry, and electronic.
  The PDF manual for this package is written in German.

  ```verbatim
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

```tabular{visual,frame,rules:all}
Symbol                                  | Command
-----------------------------------------------------------------------------
&Alpha; and &alpha;                     |  `&Alpha;` and `&alpha;`
&Beta;  and &beta;                      |  `&Beta;`  and `&beta;`
&Gamma; and &gamma;                     |  `&Gamma;` and `&gamma;`
&Delta; and &delta;                     |  `&Delta;` and `&delta;`
&Epsilon;, &epsilon; and &varepsilon;   |  `&Epsilon;`, `&epsilon;` and `&varepsilon;`
&Zeta; and &zeta;                       |  `&Zeta;` and `&zeta;`
&Eta; and &eta;                         |  `&Eta;` and `&eta;`
&Theta;, &theta; and &vartheta;         |  `&Theta;`, `&theta;` and `&vartheta;`
&Iota; and &iota;                       |  `&Iota;` and `&iota;`
&Kappa;, &kappa; and &varkappa;         |  `&Kappa;`, `&kappa;` and `&varkappa;`
&Lambda; and &lambda;                   |  `&Lambda;` and `&lambda;`
&Mu; and &mu;                           |  `&Mu;` and `&mu;`
&Nu; and &nu;                           |  `&Nu;` and `&nu;`
&Xi; and &xi;                           |  `&Xi;` and `&xi;`
&Omicron; and &omicron;                 |  `&Omicron;` and `&omicron;`
&Pi;, &pi; and &varpi;                  |  `&Pi;`, `&pi;` and `&varpi;`
&Rho;, &rho; and &varrho;               |  `&Rho;`, `&rho;` and `&varrho;`
&Sigma;, &sigma; and &varsigma;         |  `&Sigma;`, `&sigma;` and `&varsigma;`
&Tau; and &tau;                         |  `&Tau;` and `&tau;`
&Upsilon; and &upsilon;                 |  `&Upsilon;` and `&upsilon;`
&Phi;, &phi; and &varphi;               |  `&Phi;`, `&phi;` and `&varphi;`
&Chi; and &chi;                         |  `&Chi;` and `&chi;`
&Psi; and &psi;                         |  `&Psi;` and `&psi;`
&Omega; and &omega;                     |  `&Omega;` and `&omega;`
&Digamma; and &digamma;                 |  `&Digamma;` and `&digamma;`
```

# ASCII OPERATORS

```tabular{visual,frame,rules:all}
Symbol              | Command               
---------------------------------------------
&grave;             | grave                 
&amp;               | amp                   
&quot;              | quot                  
&apos;              | apos                  
&dollar;            | dollar                
&verticalbar;       | verticalbar           
&vert;              | vert                  
&quotedbl;          | quotedbl              
&numbersign;        | numbersign    
&percent;           | percent        
&ampersand;         | ampersand
&quotesingle;       | quotesingle
&comma;             | comma
&hyphen;            | hyphen
&slash;             | slash
&greater;           | greater
&less;              | less
&at;                | at
&backslash;         | backslash
&asciicircm;        | asciicircm
&underscore;        | underscore
&braceleft;         | braceleft
&braceright;        | braceright
&asciitilde;        | asciitilde
```


# RELATIONAL OPERATORS I

```tabular{visual,frame,rules:all}
Symbol              |  Command               
----------------------------------------------
&nless;             |  nless                 
&leq;               |  leq                   
&leqslant;          |  leqslant              
&nleq;              |  nleq                  
&nleqslant;         |  nleqslant             
&prec;              |  prec                  
&nprec;             |  nprec                 
&preceq;            |  preceq                
&npreceq;           |  npreceq               
&ll;                |  ll                    
&lll;               |  lll                   
&ngtr;              |  ngtr                  
&geq;               |  geq                   
&geqslant;          |  geqslant              
&ngeq;              |  ngeq                  
&ngeqslant;         |  ngeqslant             
&succ;              |  succ                  
&nsucc;             |  nsucc                 
&succeq;            |  succeq                
&nsucceq;           |  nsucceq               
&gg;                |  gg                    
&ggg;               |  ggg                   
&doteq;             |  doteq                 
&equiv;             |  equiv                 
```

# RELATIONAL OPERATORS II

```tabular{visual,frame,rules:all}
Symbol              |  Command               
----------------------------------------------
&approx;            |  approx               
&cong;              |  cong                 
&simeq;             |  simeq                
&sim;               |  sim                  
&propto;            |  propto               
&ne;                |  ne                   
&parallel;          |  parallel             
&nparallel;         |  nparallel            
&asymp;             |  asymp                
&vdash;             |  vdash                
&smile;             |  smile                
&models;            |  models               
&perp;              |  perp                 
&bowtie;            |  bowtie               
&dashv;             |  dashv                
&frown;             |  frown                
&in;                |  in                   
&notin;             |  notin                
&ReverseElement;    |  ReverseElement       
&NotReverseElement; |  NotReverseElement    
&mid;               |  mid                  
&nmid;              |  nmid                 
```

# BINARY OPERATORS


```tabular{visual,frame,rules:all}
Symbol              |  Command            
------------------------------------------
&pm;                |  pm                 
&mp;                |  mp                 
&times;             |  times              
&Cross;             |  Cross              
&div;               |  div                
&ast;               |  ast                
&uplus;             |  uplus              
&sqcap;             |  sqcap              
&sqcup;             |  sqcup              
&vee;               |  vee                
&wedge;             |  wedge              
&CircleDot;         |  CircleDot          
&diamond;           |  diamond            
&bullet;            |  bullet             
&wreath;            |  wreath             
&oplus;             |  oplus              
&ominus;            |  ominus             
&otimes;            |  otimes             
&oslash;            |  oslash             
&circledast;        |  circledast          
&SmallCircle;       |  SmallCircle        
&prod;              |  prod               
&coprod;            |  coprod             
&sum;               |  sum                
&increment;         |  increment          
&nabla;             |  nabla              
```

# SET SYMBOLS

```tabular{visual,frame,rules:all}
Symbol              |  Command            
------------------------------------------
&emptyset;          | `&emptyset;`        
&naturals;          | `&naturals;`        
&integers;          | `&integers;`        
&rationals;         | `&rationals;`       
&algebraics;        | `&algebraics;`      
&reals;             | `&reals;`           
&primes;            | `&primes;`          
&complexes;         | `&complexes`        
&quaternions;       | `&quaternions;`     
&octonions;         | `&octonions;`       
&sedenions;         | `&sedenions;`       
```


# LOGICAL SYMBOLS

```tabular{visual,frame,rules:all}
Symbol              |  Commands           
------------------------------------------
&exist;             |  exist              
&nexist;            |  nexist             
&forall;            |  forall             
&neg;               |  neg                
&xvee;              |  xvee               
&xwedge;            |  xwedge             
&top;               |  top                
&bot;               |  bot                
&subset;            |  subset             
&nsubset;           |  nsubset            
&subseteq;          |  subseteq           
&nsubseteq;         |  nsubseteq          
&sqsubset;          |  sqsubset           
&sqsubseteq;        |  sqsubseteq         
&supset;            |  supset             
&nsupset;           |  nsupset            
&supseteq;          |  supseteq           
&nsupseteq;         |  nsupseteq          
&sqsupset;          |  sqsupset           
&sqsupseteq;        |  sqsupseteq         
&cap;               |  cap                
&cup;               |  cup                
&setminus;          |  setminus           
```

-- \(a > b \hArr b < a\)

# GROUP THEORY SYMBOLS

```tabular{visual,frame,rules:all}
Symbol              |  Commands           
------------------------------------------
&vltri;             |  vltri              
&vrtri;             |  vrtri              
&vltrie;            |  vltrie             
&vrtrie;            |  vrtrie             
&nltri;             |  nltri              
&nrtri;             |  nrtri              
```

- \(F \vltri G\)
- \(F \nltri G\)
- \(G \vrtri F\)
- \(G \nrtri F\)



# DOTS

```tabular{visual,frame,rules:all}
Symbol              |  Commands           
------------------------------------------
&sdot;              |  sdot               
&vellip;            |  vellip             
&hellip;            |  hellip             
&ctdot;             |  ctdot              
&dtdot;             |  dtdot              
&utdot;             |  utdot              
```


# DELIMETERS

```tabular{visual,frame,rules:all}
Symbol              |  Commands           
------------------------------------------
&lceil;             |  lceil              
&rceil;             |  rceil              
&ulcorner;          |  ulcorner           
&urcorner;          |  urcorner           
&lfloor;            |  lfloor             
&rfloor;            |  rfloor             
&llcorner;          |  llcorner           
&lrcorner;          |  lrcorner           
&lang;              |  lang               
&rang;              |  rang               
&vert;              |  vert               
&Vert;              |  Vert               
```

# LEFT AND RIGHT POINTNG ARROWS

```tabular{visual,frame,rules:all}
Symbol              |  Commands           
------------------------------------------
&mapsto;            |  mapsto             
&xmapsto;           |  xmapsto            
&rarr;              |  rarr               
&rArr;              |  rArr               
&xrarr;             |  xrarr              
&xrArr;             |  xrArr              
&larr;              |  larr               
&lArr;              |  lArr               
&xlarr;             |  xlarr              
&xlArr;             |  xlArr              
&harr;              |  harr               
&xharr;             |  xharr              
&hArr;              |  hArr               
&xhArr;             |  xhArr              
```


# UP AND DOWN POINTING ARROWS

```tabular{visual,frame,rules:all}
Symbol              |  Commands           
------------------------------------------
&uarr;              |  uarr               
&uArr;              |  uArr               
&darr;              |  darr               
&dArr;              |  dArr               
&varr;              |  varr               
&vArr;              |  vArr               
```


# HEBREW LETTER LIKE SYMBOLS

```tabular{visual,frame,rules:all}
Symbol              |  Commands          
-----------------------------------------
&aleph;             |  aleph             
&beth;              |  beth              
&gimel;             |  gimel             
&daleth;            |  daleth            
```

# Fraction symbols

```tabular{visual,frame,rules:all}
Symbol              |  Commands           
------------------------------------------
&onehalf;           |  onehalf            
&onethird;          |  onethird           
&twothirds;         |  twothirds          
&onequarter;        |  onequarter         
&threequarters;     |  threequarters      
&onefifth;          |  onefifth           
&twofifths;         |  twofifths          
&threefifths;       |  threefifths        
&fourfifths;        |  fourfifths         
&onesixth;          |  onesixth           
&fivesixths;        |  fivesixths         
&oneseventh;        |  oneseventh         
&oneeighth;         |  oneeighth          
&threeeighths;      |  threeeighths       
&fiveeighths;       |  fiveeighths        
&seveneighths;      |  seveneighths       
&oneninth;          |  oneninth           
&onetenth;          |  onetenth           
&zerothird;         |  zerothird          
```

```tabular{visual,frame,rules:all}
Symbol             | Command              
------------------------------------------
&coloneq;          | coloneq              
&eqcolon;          | eqcolon              
```


# OTHER SYMBOLS

```tabular{visual,frame,rules:all}
Symbol              | Command      
-----------------------------------
&deg;               | deg          
```

# LETTER-LIKE SYMBOLS

```tabular{visual,frame,rules:all}
Symbol              | Command                
---------------------------------------------
&complement;        | complement             
&hbar;              | hbar                   
&eth;               | eth                    
&imath;             | imath                  
&jmath;             | jmath                  
&ell;               | ell                    
&partial;           | partial                
&wp;                | wp                     
&Im;                | Im                     
&Re;                | Re                     
&infty;             | infty                  
&questiondown;      | questiondown           
```




# CURRENCY SYMBOLS

```tabular{visual,frame,rules:all}
Symbol         | Command        
----------------------------------
&baht;         | baht           
&cent;         | cent           
&currency;     | currency       
&dollar;       | dollar         
&dong;         | dong           
&euro;         | euro           
&florin;       | florin         
&guarani;      | guarani        
&lira;         | lira           
&naira;        | naira          
&peso;         | peso           
&pound;        | pound          
&won;          | won            
&yen;          | yen            
```


# LATIN LETTERS

```tabular{visual,frame,rules:all}
Symbol      | Command       
----------------------------
&aring;     | aring         
&Aring;     | aring         
&AElig;     | AElig         
&aelig;     | aelig         
&eth;       | eth           
&ETH;       | ETH           
&Dstrok;    | Dstrok        
&dstrok;    | dstrok        
&IJlig;     | IJlig         
&ijlig;     | ijlig         
&Lstrok;    | Lstrok        
&lstrok;    | lstrok        
&ENG;       | ENG           
&eng;       | eng           
&Oslash;    | Oslash        
&oslash;    | oslash        
&oelig;     | oelig         
&OElig;     | OElig         
&thorn;     | thorn         
&THORN;     | THORN         
&mho;       | mho           
&hstrok;    | hstrok        
```


# Letterlike Symbols, U+2100 - U+214F

```tabular{visual,frame,rules:all}
Symbol              |  Command                
----------------------------------------------
&SM;                |  SM                     
&trade;             |  trade                  
&dagger;            |  dagger                 
&Dagger;            |  Dagger                 
&para;              |  para                   
&sect;              |  sect                   
```


# DINGBATS

```tabular{visual,frame,rules:all}
Symbol              |  Command                
----------------------------------------------
&star;              |  star                   
&checkmark;         |  checkmark              
&maltese;           |  maltese                
&cross;             |  cross                  
```


# MATH OPERATORS U+2200 - U+22FF

```tabular{visual,frame,rules:all}
Symbol              |  Command                
----------------------------------------------
&ang;               |  ang                    
&angmsd;            |  angmsd                 
&angsph;            |  angsph                 
```


# GEOMETRIC SHAPES

```tabular{visual,frame,rules:all}
Symbol              |  Command                
----------------------------------------------
&bigcirc;           |  bigcirc                
&bigtriangleup;     |  bigtriangleup          
&bigtriangledown;   |  bigtriangledown        
&xutri;             |  xutri                  
&xdtri;             |  xdtri                  
&utri;              |  utri                   
&rtri;              |  rtri                   
&dtri;              |  dtri                   
&ltri;              |  ltri                   
&square;            |  square                 
&blacksquare;       |  blacksquare            
&cir;               |  cir                    
```

