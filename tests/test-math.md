---
title: test-math.md
program: lualatex
translator: beamer
---

# Normal text

This is the normal text. ``\sqrt{2}``

# Display math One

```displaymath
e = \lim_{n\rarr\infty} {\left(1 + \frac{1}{n}\right)}^n
```

# Display math split

```displaymath
e &= \lim_{n\rarr\infty} {\left(1 + \frac{1}{n}\right)}^n \cr
  &= a + b
```

# Display math Sum

```displaymath
{\displaystyle e=\sum _{n=0}^{\infty }{\frac {1}{n!}}={\frac {1}{1}}+{\frac {1}{1}}+{\frac {1}{1\sdot 2}}+{\frac {1}{1\sdot 2\sdot 3}}+\ctdot }
```

# Display math Int

```displaymath
{\displaystyle y=\int _{a}^{b} f(x) \dif{x}}
```

# Display math Lim

```displaymath
{\displaystyle y=\lim _{x\rarr\infty} \frac{1}{x}}  
```




# Display math and aligned (no equation numbering)

```displaymath
x = \sqrt{2} + \sqrt{4} + \sqrt{5} 
```

```displaymath
x + 7 = \sqrt{2} + \sqrt{4} + \sqrt{5}
```

```displaymath
y + 7 + 8 = \sqrt{2} 
```


# Display math not aligned (no equation numbering)

```displaymath
x = \sqrt{2} + \sqrt{4} + \sqrt{5}
```

```displaymath
x + 7 = \sqrt{2} + \sqrt{4} + \sqrt{5}
```

```displaymath
y + 7 + 8 = \sqrt{2} 
```



# Math and text mix

The math symbol {{a}} and {{b}} are identifiers and &sqrt{2} is a sqrt.



# Greek Letters Table 1

@   table    

    ```tabular
    | Name     | Symbol           |  Name      | Symbol           | Name     | Symbol            
    ------------------------------------------------------------------------------------------
    | \Alpha   | {{\Alpha  }}  |  \Iota     | {{\Iota   }}  | \Rho     | {{\Rho    }}     
    | \Beta    | {{\Beta   }}  |  \Kappa    | {{\Kappa  }}  | \Sigma   | {{\Sigma  }}   
    | \Gamma   | {{\Gamma  }}  |  \Lambda   | {{\Lambda }}  | \Tau     | {{\Tau    }}   
    | \Delta   | {{\Delta  }}  |  \Mu       | {{\Mu     }}  | \Upsilon | {{\Upsilon}}   
    | \Epsilon | {{\Epsilon}}  |  \Nu       | {{\Nu     }}  | \Phi     | {{\Phi    }}   
    | \Zeta    | {{\Zeta   }}  |  \Xi       | {{\Xi     }}  | \Chi     | {{\Chi    }}   
    | \Eta     | {{\Eta    }}  |  \Omicron  | {{\Omicron}}  | \Psi     | {{\Psi    }}   
    | \Theta   | {{\Theta  }}  |  \Pi       | {{\Pi     }}  | \Omega   | {{\Omega  }}   
    ```

# Greek Letters Table 2

@   table 

    ```tabular
    | Name     | Symbol            |  Name     | Symbol           | Name     | Symbol            
    ------------------------------------------------------------------------------------------------------
    | \alpha   | {{\alpha  }}   |  \iota    | {{\iota   }}  | \rho     | {{\rho    }}        
    | \beta    | {{\beta   }}   |  \kappa   | {{\kappa  }}  | \sigma   | {{\sigma  }} 
    | \gamma   | {{\gamma  }}   |  \lambda  | {{\lambda }}  | \tau     | {{\tau    }}     
    | \delta   | {{\delta  }}   |  \mu      | {{\mu     }}  | \upsilon | {{\upsilon}}       
    | \epsilon | {{\epsilon}}   |  \nu      | {{\nu     }}  | \phi     | {{\phi    }}  
    | \zeta    | {{\zeta   }}   |  \xi      | {{\xi     }}  | \chi     | {{\chi    }}   
    | \eta     | {{\eta    }}   |  \omicron | {{\omicron}}  | \psi     | {{\psi    }}    
    | \theta   | {{\theta  }}   |  \pi      | {{\pi     }}  | \omega   | {{\omega  }}  
    ```

# Greek Letters Table 3

@   table

    ```tabular
    | Name        | Symbol
    ----------------------------------
    | \vartheta   | {{\vartheta  }}
    | \varrho     | {{\varrho    }}       
    | \varsigma   | {{\varsigma  }}           
    | \varphi     | {{\varphi    }}      
    | \varepsilon | {{\varepsilon}}           
    ```


# Math combinations

- ``\sqrt{2}`` &br{}
  {{\sqrt{2}}}

- ``\sqrt[3]{2}`` &br{}
  {{\sqrt[3]{2}}}

- ``\binom{a}{b}`` &br{}
  {{\binom{a}{b}}}

- ``\frac{a}{b}`` &br{}
  {{\frac{a}{b}}}


# Math accents

- ``\dot{a}`` {{\dot{a}}}
- ``\ddot{a}`` {{\ddot{a}}}
- ``\dddot{a}`` {{\dddot{a}}}
- ``\bar{a}`` {{\bar{a}}}
- ``\vec{a}`` {{\vec{a}}}
- ``\mathring{a}`` {{\mathring{a}}}
- ``\hat{a}`` {{\hat{a}}}
- ``\check{a}`` {{\check{a}}}
- ``\grave{a}`` {{\grave{a}}}
- ``\acute{a}`` {{\acute{a}}}
- ``\breve{a}`` {{\breve{a}}}
- ``\tilde{a}`` {{\tilde{a}}}
- ``\widehat{abcdef}`` {{\widehat{abcdef}}}
- ``\overline{abcdef}`` {{\overline{abcdef}}}
- ``\overleftrightarrow{abcdef}`` {{\overleftrightarrow{abcdef}}}
- ``\overrightarrow{abcdef}`` {{\overrightarrow{abcdef}}}



# Subscript and superscripts

- ``a^2`` {{a^2}}

- ``a_i`` {{a_i}}

- ``a_i^2`` {{a_i^2}}

- ``{a + b}`` {{{a + b}}}

- ``{a + b}^2`` {{{a + b}^2}}

- ``{a + b}_i`` {{{a + b}_i}}

- ``a^{1+2}`` {{a^{1+2}}}

- ``a_{1+2}`` {{a_{1+2}}}




# Text 

- ``000\text{abc}111`` &br{}
  {{000\text{abc}111}}


# Math Variants 

- ``000&ascr;&bscr;&cscr;111`` &br{}
  {{000&Ascr;&Bscr;&Cscr;111}}

- ``000&abf;&bbf;&cbf;111`` &br{}
  {{000&abf;&bbf;&cbf;111}} 

- ``000&aopf;&bopf;&copf;111`` &br{}
  {{000&aopf;&bopf;&copf;111}} 



# Matrix I

- ``\begin{matrix} a \end{matrix}``  &br{}
  {{\begin{matrix} a \end{matrix}}}

- ``\begin{pmatrix} a \end{pmatrix}`` &br{}
  {{\begin{pmatrix} a \end{pmatrix}}}

- ``\begin{bmatrix} a \end{bmatrix}`` &br{}
  {{\begin{bmatrix} a \end{bmatrix}}}

- ``\begin{Bmatrix} a \end{Bmatrix}`` &br{}
  {{\begin{Bmatrix} a \end{Bmatrix}}}

- ``\begin{vmatrix} a \end{vmatrix}`` &br{}
  {{\begin{vmatrix} a \end{vmatrix}}}

- ``\begin{Vmatrix} a \end{Vmatrix}`` &br{}
  {{\begin{Vmatrix} a \end{Vmatrix}}}



# Matrix II

- ``\begin{matrix} a \nc b \nr c \nc d \end{matrix}`` &br{}
  {{\begin{matrix} a \nc b \nr c \nc d \end{matrix}}}

- ``\begin{pmatrix} a \nc b \nr c \nc d \end{pmatrix}`` &br{}
  {{\begin{pmatrix} a \nc b \nr c \nc d \end{pmatrix}}}

- ``\begin{bmatrix} a \nc b \nr c \nc d \end{bmatrix}`` &br{}
  {{\begin{bmatrix} a \nc b \nr c \nc d \end{bmatrix}}}

- ``\begin{Bmatrix} a \nc b \nr c \nc d \end{Bmatrix}`` &br{}
  {{\begin{Bmatrix} a \nc b \nr c \nc d \end{Bmatrix}}}



# Matrix III

- ``\begin{vmatrix} a \nc b \nr c \nc d \end{vmatrix}`` &br{}
  {{\begin{vmatrix} a \nc b \nr c \nc d \end{vmatrix}}}

- ``\begin{Vmatrix} a \nc b \nr c \nc d \end{Vmatrix}`` &br{}
  {{\begin{Vmatrix} a \nc b \nr c \nc d \end{Vmatrix}}}

- ``\begin{pmatrix} a^2 \nc b^3 \nr \cos c \nc \sin d \end{pmatrix}`` &br{}
  {{\begin{pmatrix} a^2 \nc b^3 \nr \cos c \nc \sin d \end{pmatrix}}}



# Derivative  

- ``\dif{x}`` &br{}
  {{\dif{x}}}

- ``\od{x^2}{x}`` &br{}
  {{\od{x^2}{x}}}

- ``\pd{x^2}{x}`` &br{}
  {{\pd{x^2}{x}}}

- ``\od[2]{x^2}{x}`` &br{}
  {{\od[2]{x^2}{x}}}

- ``\pd[2]{x^2}{x}`` &br{}
  {{\pd[2]{x^2}{x}}}




# Braces

- ``\lbrace a + b \rbrace`` &br{} 
   {{\lbrace a + b \rbrace}}

- ``[ a + b ]`` &br{}
  {{[ a + b ]}}

- ``( a + b )``  &br{}
  {{( a + b )}}





# Fences I

- ``\left\lbrace a \right\rbrace`` &br{}           {{\left\lbrace a \right\rbrace}}

- ``\left[ a \right]`` &br{}                       {{\left[ a \right]}}

- ``\left( a \right)`` &br{}                       {{\left( a \right)}}

- ``\left\vert a \right\vert`` &br{}               {{\left\vert a \right\vert}}



# Fences II

- ``\left\Vert a \right\Vert`` &br{}               {{\left\Vert a \right\Vert}}

- ``\left\lang a \right\rang`` &br{}               {{\left\lang a \right\rang}}

- ``\left\lbrace \frac{1}{a} \right\rbrace`` &br{}   {{\left\lbrace \frac{1}{a} \right\rbrace}}

- ``\left[ \frac{1}{a} \right]`` &br{}               {{\left[ \frac{1}{a} \right]}}



# Fences III

- ``\left( \frac{1}{a} \right)`` &br{}               {{\left( \frac{1}{a} \right)}}

- ``\left\vert \frac{1}{a} \right\vert`` &br{}       {{\left\vert \frac{1}{a} \right\vert}}

- ``\left\Vert \frac{1}{a} \right\Vert`` &br{}       {{\left\Vert \frac{1}{a} \right\Vert}}

- ``\left\lang \frac{1}{a} \right\rang`` &br{}       {{\left\lang \frac{1}{a} \right\rang}}



# Fences IV

- ``\left\lfloor \frac{1}{a} \right\rfloor`` &br{}   {{\left\lfloor \frac{1}{a} \right\rfloor}}

- ``\left\lceil \frac{1}{a} \right\rceil`` &br{}     {{\left\lceil \frac{1}{a} \right\rceil}}

- ``\left\lobrk \frac{1}{a} \right\robrk`` &br{}     {{\left\lobrk \frac{1}{a} \right\robrk}}


# eqcolon

- ``A \coloneq B`` &br{} {{A \coloneq B}}

- ``A \eqcolon B`` &br{} {{A \eqcolon B}}



