---
title: The "equation" paragraph
---

The equation paragraph allows for typesetting one or more equations
in the same block. 

    ~~~equation
    f_x(x) = \text{poisspdf} (x,50)
    
    \mathbf{y} = g(\mathbf{x})
    
    g(x) = 5x
    ~~~

In the previous example three equations are placed in the same
paragraph where one is shown below the other in that order. 
All the equations will be flushed so that their right-hand edges
align vertically.

For a single equation, it is possible for it to be split across 
multiple lines. 

    ~~~equation
    f_x(x) &= \text{poisspdf} (x,50)\\
           &= \text{f} (x,50)
    
    \mathbf{y} = g(\mathbf{x})
    
    g(x) = 5x
    ~~~

If a "label" option is provided, then this option will be
expected of a list of names each of which is assigned as
the label to one of the equations. In the following example
"mylabel1" is assigned to the first equation, "mylabel2" 
is assigned to the second, and "mylabel3" is assigned to
the third.

    ~~~equation{label:mylabel1 mylabel2 mylabel3}
    f_x(x) &= \text{poisspdf} (x,50)\\
           &= \text{f} (x,50)
    
    \mathbf{y} = g(\mathbf{x})
    
    g(x) = 5x
    ~~~

These labels could later on be used later on to refer
to one the above equations by doing something like 

    Please see equation &ref{mylabel1}.

If the list of name for the "label" option is shorter, then
the equations without the label will not be numbered. In the previous
example, if the second equation is not to be named, then the 
name "none" can be used.

    ~~~equation{label:mylabel1 none mylabel3}
    f_x(x) &= \text{poisspdf} (x,50)\\
           &= \text{f} (x,50)
    
    \mathbf{y} = g(\mathbf{x})
    
    g(x) = 5x
    ~~~

The equation paragraph on LATEX translation is always to generate
an "eqnarray" or "eqnarray*" environment. The second environment is
the default one, unless the label-style option is detected,
in which case the "eqnarray" environment is used, which is to 
setup for the numbering of each equations in this environment.
By default, the "eqnarray" environment is to number each equation
within this array, unless ``\notag`` is used.

