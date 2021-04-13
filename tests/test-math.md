---
title: test-math.md
---

This is the normal text. ``\sqrt{2}``

# Display math One

```math
e = \lim_{n\rarr\infty} {\left(1 + \frac{1}{n}\right)}^n
```

# Display math split

```math
e &= \lim_{n\rarr\infty} {\left(1 + \frac{1}{n}\right)}^n \cr
  &= a + b
```

# Display math Sum

```math
{\displaystyle e=\sum _{n=0}^{\infty }{\frac {1}{n!}}={\frac {1}{1}}+{\frac {1}{1}}+{\frac {1}{1\sdot 2}}+{\frac {1}{1\sdot 2\sdot 3}}+\ctdot }
```

# Display math Int

```math
{\displaystyle y=\int _{a}^{b} f(x) \dif{x}}
```

# Display math Lim

```math
{\displaystyle y=\lim _{x\rarr\infty} \frac{1}{x}}  
```




# Display math and aligned (no equation numbering)

```math
x = \sqrt{2} + \sqrt{4} + \sqrt{5} 
```

```math
x + 7 = \sqrt{2} + \sqrt{4} + \sqrt{5}
```

```math
y + 7 + 8 = \sqrt{2} 
```


# Display math not aligned (no equation numbering)

```math
x = \sqrt{2} + \sqrt{4} + \sqrt{5}
```

```math
x + 7 = \sqrt{2} + \sqrt{4} + \sqrt{5}
```

```math
y + 7 + 8 = \sqrt{2} 
```



# Math and text mix

The math symbol &math{a} and &math{b} are identifiers and &sqrt{2} is a sqrt.



# Greek Letters Table 1

@   table    

    | Name     | Symbol           |  Name      | Symbol           | Name     | Symbol            
    ------------------------------------------------------------------------------------------
    | \Alpha   | &math{\Alpha  }  |  \Iota     | &math{\Iota   }  | \Rho     | &math{\Rho    }     
    | \Beta    | &math{\Beta   }  |  \Kappa    | &math{\Kappa  }  | \Sigma   | &math{\Sigma  }   
    | \Gamma   | &math{\Gamma  }  |  \Lambda   | &math{\Lambda }  | \Tau     | &math{\Tau    }   
    | \Delta   | &math{\Delta  }  |  \Mu       | &math{\Mu     }  | \Upsilon | &math{\Upsilon}   
    | \Epsilon | &math{\Epsilon}  |  \Nu       | &math{\Nu     }  | \Phi     | &math{\Phi    }   
    | \Zeta    | &math{\Zeta   }  |  \Xi       | &math{\Xi     }  | \Chi     | &math{\Chi    }   
    | \Eta     | &math{\Eta    }  |  \Omicron  | &math{\Omicron}  | \Psi     | &math{\Psi    }   
    | \Theta   | &math{\Theta  }  |  \Pi       | &math{\Pi     }  | \Omega   | &math{\Omega  }   

# Greek Letters Table 2

@   table 

    | Name     | Symbol            |  Name     | Symbol           | Name     | Symbol            
    ------------------------------------------------------------------------------------------------------
    | \alpha   | &math{\alpha  }   |  \iota    | &math{\iota   }  | \rho     | &math{\rho    }        
    | \beta    | &math{\beta   }   |  \kappa   | &math{\kappa  }  | \sigma   | &math{\sigma  } 
    | \gamma   | &math{\gamma  }   |  \lambda  | &math{\lambda }  | \tau     | &math{\tau    }     
    | \delta   | &math{\delta  }   |  \mu      | &math{\mu     }  | \upsilon | &math{\upsilon}       
    | \epsilon | &math{\epsilon}   |  \nu      | &math{\nu     }  | \phi     | &math{\phi    }  
    | \zeta    | &math{\zeta   }   |  \xi      | &math{\xi     }  | \chi     | &math{\chi    }   
    | \eta     | &math{\eta    }   |  \omicron | &math{\omicron}  | \psi     | &math{\psi    }    
    | \theta   | &math{\theta  }   |  \pi      | &math{\pi     }  | \omega   | &math{\omega  }  

# Greek Letters Table 3

@   table

    | Name        | Symbol
    ----------------------------------
    | \vartheta   | &math{\vartheta  }
    | \varrho     | &math{\varrho    }       
    | \varsigma   | &math{\varsigma  }           
    | \varphi     | &math{\varphi    }      
    | \varepsilon | &math{\varepsilon}           


# Math combinations

- ``\sqrt{2}`` &br{}
  &math{\sqrt{2}}

- ``\sqrt[3]{2}`` &br{}
  &math{\sqrt[3]{2}}

- ``\binom{a}{b}`` &br{}
  &math{\binom{a}{b}}

- ``\frac{a}{b}`` &br{}
  &math{\frac{a}{b}}


# Math accents

- ``\dot{a}`` &math{\dot{a}}

- ``\ddot{a}`` &math{\ddot{a}}

- ``\dddot{a}`` &math{\dddot{a}}

- ``\bar{a}`` &math{\bar{a}}

- ``\vec{a}`` &math{\vec{a}}

- ``\mathring{a}`` &math{\mathring{a}}

- ``\hat{a}`` &math{\hat{a}}

- ``\check{a}`` &math{\check{a}}

- ``\grave{a}`` &math{\grave{a}}

- ``\acute{a}`` &math{\acute{a}}

- ``\breve{a}`` &math{\breve{a}}

- ``\tilde{a}`` &math{\tilde{a}}

- ``\widehat{abcdef}`` &math{\widehat{abcdef}}

- ``\overline{abcdef}`` &math{\overline{abcdef}}

- ``\overleftrightarrow{abcdef}`` &math{\overleftrightarrow{abcdef}}

- ``\overrightarrow{abcdef}`` &math{\overrightarrow{abcdef}}



# Subscript and superscripts

- ``a^2`` &br{}
  \(a^2\)

- ``a_i`` &br{}
  \(a_i\)

- ``a_i^2`` &br{}
  \(a_i^2\)

- ``{a + b}`` &br{}
  \({a + b}\)

- ``{a + b}^2`` &br{}
  \({a + b}^2\)

- ``{a + b}_i`` &br{}
  \({a + b}_i\)

- ``a^{1+2}`` &br{}
  \(a^{1+2}\)

- ``a_{1+2}`` &br{}
  \(a_{1+2}\)




# Operatorname, text and variants

- ``000\operatorname{abc}111`` &br{}
  \(000\operatorname{abc}111\)

- ``000\text{abc}111`` &br{}
  \(000\text{abc}111\)

- ``000\mathit{abc}111`` &br{}
  \(000\mathit{abc}111\) &br{}

- ``000\mathrm{abc}111`` &br{}
  \(000\mathrm{abc}111\) &br{}

- ``000\mathbf{abc}111`` &br{}
  \(000\mathbf{abc}111\) &br{}

- ``000\mathbb{abc}111`` &br{}
  \(000\mathbb{abc}111\) &br{}

- ``000\mathcal{abc}111`` &br{}
  \(000\mathcal{abc}111\) &br{}



# Matrix

- ``\begin{matrix} a \end{matrix}`` &br{}
  \(\begin{matrix} a \end{matrix}\)

- ``\begin{pmatrix} a \end{pmatrix}`` &br{}
  \(\begin{pmatrix} a \end{pmatrix}\)

- ``\begin{bmatrix} a \end{bmatrix}`` &br{}
  \(\begin{bmatrix} a \end{bmatrix}\)

- ``\begin{Bmatrix} a \end{Bmatrix}`` &br{}
  \(\begin{Bmatrix} a \end{Bmatrix}\)

- ``\begin{vmatrix} a \end{vmatrix}`` &br{}
  \(\begin{vmatrix} a \end{vmatrix}\)

- ``\begin{Vmatrix} a \end{Vmatrix}`` &br{}
  \(\begin{Vmatrix} a \end{Vmatrix}\)

- ``\begin{matrix} a \nc b \nr c \nc d \end{matrix}`` &br{}
  \(\begin{matrix} a \nc b \nr c \nc d \end{matrix}\)

- ``\begin{pmatrix} a \nc b \nr c \nc d \end{pmatrix}`` &br{}
  \(\begin{pmatrix} a \nc b \nr c \nc d \end{pmatrix}\)

- ``\begin{bmatrix} a \nc b \nr c \nc d \end{bmatrix}`` &br{}
  \(\begin{bmatrix} a \nc b \nr c \nc d \end{bmatrix}\)

- ``\begin{Bmatrix} a \nc b \nr c \nc d \end{Bmatrix}`` &br{}
  \(\begin{Bmatrix} a \nc b \nr c \nc d \end{Bmatrix}\)

- ``\begin{vmatrix} a \nc b \nr c \nc d \end{vmatrix}`` &br{}
  \(\begin{vmatrix} a \nc b \nr c \nc d \end{vmatrix}\)

- ``\begin{Vmatrix} a \nc b \nr c \nc d \end{Vmatrix}`` &br{}
  \(\begin{Vmatrix} a \nc b \nr c \nc d \end{Vmatrix}\)

- ``\begin{pmatrix} a^2 \nc b^3 \nr \cos c \nc \sin d \end{pmatrix}`` &br{}
  \(\begin{pmatrix} a^2 \nc b^3 \nr \cos c \nc \sin d \end{pmatrix}\)



# Derivative  

- ``\dif{x}`` &br{}
  \(\dif{x}\)

- ``\od{x^2}{x}`` &br{}
  \(\od{x^2}{x}\)

- ``\pd{x^2}{x}`` &br{}
  \(\pd{x^2}{x}\)

- ``\od[2]{x^2}{x}`` &br{}
  \(\od[2]{x^2}{x}\)

- ``\pd[2]{x^2}{x}`` &br{}
  \(\pd[2]{x^2}{x}\)




# Braces

- ``\{ a + b \}`` &br{}
  \(\{ a + b \}\)

- ``[ a + b ]`` &br{}
  \([ a + b ]\)

- ``( a + b )`` &br{}
  \(( a + b )\)





# Fences

- ``\(\left\{ a \right\}\)`` &br{}
  \(\left\{ a \right\}\)

- ``\(\left[ a \right]\)`` &br{}
  \(\left[ a \right]\)

- ``\(\left( a \right)\)`` &br{}
  \(\left( a \right)\)

- ``\(\left\vert a \right\vert\)`` &br{}
  \(\left\vert a \right\vert\)

- ``\(\left\Vert a \right\Vert\)`` &br{}
  \(\left\Vert a \right\Vert\)

- ``\(\left\langle a \right\rangle\)`` &br{}
  \(\left\langle a \right\rangle\)

- ``\(\left\{ \frac 1 a \right\}\)`` &br{}
  \(\left\{ \frac 1 a \right\}\)

- ``\(\left[ \frac 1 a \right]\)`` &br{}
  \(\left[ \frac 1 a \right]\)

- ``\(\left( \frac 1 a \right)\)`` &br{}
  \(\left( \frac 1 a \right)\)

- ``\(\left\vert \frac 1 a \right\vert\)`` &br{}
  \(\left\vert \frac 1 a \right\vert\)

- ``\(\left\Vert \frac 1 a \right\Vert\)`` &br{}
  \(\left\Vert \frac 1 a \right\Vert\)

- ``\(\left\langle \frac 1 a \right\rangle\)`` &br{}
  \(\left\langle \frac 1 a \right\rangle\)

- ``\(\left\lfloor \frac 1 a \right\rfloor\)`` &br{}
  \(\left\lfloor \frac 1 a \right\rfloor\)

- ``\(\left\lceil \frac 1 a \right\rceil\)`` &br{}
  \(\left\lceil \frac 1 a \right\rceil\)

- ``\(\left\lobrk \frac 1 a \right\robrk\)`` &br{}
  \(\left\lobrk \frac 1 a \right\robrk\)


# eqcolon

- \(A \coloneq B\)

- \(A \eqcolon B\)


