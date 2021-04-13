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

- ``a^2`` &math{a^2}

- ``a_i`` &math{a_i}

- ``a_i^2`` &math{a_i^2}

- ``{a + b}`` &math{{a + b}}

- ``{a + b}^2`` &math{{a + b}^2}

- ``{a + b}_i`` &math{{a + b}_i}

- ``a^{1+2}`` &math{a^{1+2}}

- ``a_{1+2}`` &math{a_{1+2}}




# Text 

- ``000\text{abc}111`` &br{}
  &math{000\text{abc}111}


# Math Variants 

- ``000&ascr;&bscr;&cscr;111`` &br{}
  &math{000&ascr;&bscr;&cscr;111}

- ``000&abf;&bbf;&cbf;111`` &br{}
  &math{000&abf;&bbf;&cbf;111} 

- ``000&aopf;&bopf;&copf;111`` &br{}
  &math{000&aopf;&bopf;&copf;111} 



# Matrix I

- ``\begin{matrix} a \end{matrix}``  &br{}
  &math{\begin{matrix} a \end{matrix}}

- ``\begin{pmatrix} a \end{pmatrix}`` &br{}
  &math{\begin{pmatrix} a \end{pmatrix}}

- ``\begin{bmatrix} a \end{bmatrix}`` &br{}
  &math{\begin{bmatrix} a \end{bmatrix}}

- ``\begin{Bmatrix} a \end{Bmatrix}`` &br{}
  &math{\begin{Bmatrix} a \end{Bmatrix}}

- ``\begin{vmatrix} a \end{vmatrix}`` &br{}
  &math{\begin{vmatrix} a \end{vmatrix}}

- ``\begin{Vmatrix} a \end{Vmatrix}`` &br{}
  &math{\begin{Vmatrix} a \end{Vmatrix}}



# Matrix II

- ``\begin{matrix} a \nc b \nr c \nc d \end{matrix}`` &br{}
  &math{\begin{matrix} a \nc b \nr c \nc d \end{matrix}}

- ``\begin{pmatrix} a \nc b \nr c \nc d \end{pmatrix}`` &br{}
  &math{\begin{pmatrix} a \nc b \nr c \nc d \end{pmatrix}}

- ``\begin{bmatrix} a \nc b \nr c \nc d \end{bmatrix}`` &br{}
  &math{\begin{bmatrix} a \nc b \nr c \nc d \end{bmatrix}}

- ``\begin{Bmatrix} a \nc b \nr c \nc d \end{Bmatrix}`` &br{}
  &math{\begin{Bmatrix} a \nc b \nr c \nc d \end{Bmatrix}}



# Matrix III

- ``\begin{vmatrix} a \nc b \nr c \nc d \end{vmatrix}`` &br{}
  &math{\begin{vmatrix} a \nc b \nr c \nc d \end{vmatrix}}

- ``\begin{Vmatrix} a \nc b \nr c \nc d \end{Vmatrix}`` &br{}
  &math{\begin{Vmatrix} a \nc b \nr c \nc d \end{Vmatrix}}

- ``\begin{pmatrix} a^2 \nc b^3 \nr \cos c \nc \sin d \end{pmatrix}`` &br{}
  &math{\begin{pmatrix} a^2 \nc b^3 \nr \cos c \nc \sin d \end{pmatrix}}



# Derivative  

- ``\dif{x}`` &br{}
  &math{\dif{x}}

- ``\od{x^2}{x}`` &br{}
  &math{\od{x^2}{x}}

- ``\pd{x^2}{x}`` &br{}
  &math{\pd{x^2}{x}}

- ``\od[2]{x^2}{x}`` &br{}
  &math{\od[2]{x^2}{x}}

- ``\pd[2]{x^2}{x}`` &br{}
  &math{\pd[2]{x^2}{x}}




# Braces

- ``\lbrace a + b \rbrace`` &br{} 
   &math{\lbrace a + b \rbrace}

- ``[ a + b ]`` &br{}
  &math{[ a + b ]}

- ``( a + b )``  &br{}
  &math{( a + b )}





# Fences I

- ``&math{\left\lbrace a \right\rbrace}`` &br{}           &math{\left\lbrace a \right\rbrace}

- ``&math{\left[ a \right]}`` &br{}                       &math{\left[ a \right]}

- ``&math{\left( a \right)}`` &br{}                       &math{\left( a \right)}

- ``&math{\left\vert a \right\vert}`` &br{}               &math{\left\vert a \right\vert}



# Fences II

- ``&math{\left\Vert a \right\Vert}`` &br{}               &math{\left\Vert a \right\Vert}

- ``&math{\left\lang a \right\rang}`` &br{}               &math{\left\lang a \right\rang}

- ``&math{\left\lbrace \frac 1 a \right\rbrace}`` &br{}   &math{\left\lbrace \frac 1 a \right\rbrace}

- ``&math{\left[ \frac 1 a \right]}`` &br{}               &math{\left[ \frac 1 a \right]}



# Fences III

- ``&math{\left( \frac 1 a \right)}`` &br{}               &math{\left( \frac 1 a \right)}

- ``&math{\left\vert \frac 1 a \right\vert}`` &br{}       &math{\left\vert \frac 1 a \right\vert}

- ``&math{\left\Vert \frac 1 a \right\Vert}`` &br{}       &math{\left\Vert \frac 1 a \right\Vert}

- ``&math{\left\lang \frac 1 a \right\rang}`` &br{}       &math{\left\lang \frac 1 a \right\rang}



# Fences IV

- ``&math{\left\lfloor \frac 1 a \right\rfloor}`` &br{}   &math{\left\lfloor \frac 1 a \right\rfloor}

- ``&math{\left\lceil \frac 1 a \right\rceil}`` &br{}     &math{\left\lceil \frac 1 a \right\rceil}

- ``&math{\left\lobrk \frac 1 a \right\robrk}`` &br{}     &math{\left\lobrk \frac 1 a \right\robrk}


# eqcolon

- ``&math{A \coloneq B}`` &br{} &math{A \coloneq B}

- ``&math{A \eqcolon B}`` &br{} &math{A \eqcolon B}


