---
title: a.md
---
%?a
\drawline (0,0)(5,5)
\drawtext {math} "a+b" (0,0)
%

# Phrase to escape

```parbox
Hello world \\
Hello world
```

The \backspace and \backquote phrases


# Tabular

```tabular{head,fontsize:small,frame,rules:all,halign:p15 p45 p35 p20}
\\ Description \\ Figure \\ Symbol
Point    \\ A geometric element that has zero dimension \\ &dia{load:POINT,fontsize:10,viewport:8 3,width:30} \\ P or Point P
Line     \\ A line that is a collection of points along a straight path with no end points. \\ &dia{load:LINE,fontsize:10,viewport:8 3,width:30} \\ \(\overline{AB}\) or \(\overline{BA}\)
Line segment \\ A line segment is a part of a line that contains every point on the line between its end points. \\ &dia{load:LINESEG,fontsize:10,viewport:8 3,width:30} \\ \(\overline{XY}\) or \(\overline{YX}\)
Ray      \\ A ray is a line with a single end point that goes on and on in one direction. \\ &dia{load:RAY,fontsize:10,viewport:8 3,width:30} \\ \(\overrightarrow{PQ}
Plane    \\ A plane is a flat surface that extends to infinity. \\ &dia{load:PLANE,fontsize:10,viewport:8 3,width:30} \\ Plane EFG
```

# Cove

Hello world! 
Hello world! 
Hello world! 
Hello world! 

> James Yu
  James Yu
  James Yu


# Displaymath   

```displaymath
  1 + 2 + \ctdot + n + (n+1) &= \frac{n}{2}(n+1) + (n+1) \cr
                      &= \frac{n}{2}(n+1) + \frac{2}{2}(n+1) \cr
                      &= (n+1)(\frac{n}{2} + \frac{2}{2}) \cr
                      &= \frac{n+1}{2}(n+2)\cr
                      &= \frac{n+1}{2}((n+1)+1)
```

# Dia subtitle

Hello world! 
Hello world! 
Hello world! 
Hello world! 

> ```displaymath
  a + b = c      
  ```

Hello world! 
Hello world! 
Hello world! 
Hello world! 

> ```
  #include<stdio>
  int main(){
    return 0;
  }
  ```

# Parbox   

```parbox
Hello world!  \\
Hello world!  \\
Hello world!  \\
Hello world! 
```

```parbox
\(a + b = c\) \\
\(a + b = c\) \\
\(a + b = c\) \\
\(a + b = c\)
```

# Figures

Hello world! 
Hello world! 
Hello world! 
Hello world! 

.figure{swrap,salign:c}
\\
```dia{viewport:5 5,frame}
\drawline(0,0)(5,5)
```
```dia{viewport:5 5,frame}
\drawline(0,0)(5,5)
```
```dia{viewport:5 5,frame}
\drawline(0,0)(5,5)
```
```dia{viewport:5 5,frame}
\drawline(0,0)(5,5)
```
```dia{viewport:5 5,frame}
\drawline(0,0)(5,5)
```
```dia{viewport:5 5,frame}
\drawline(0,0)(5,5)
```

Hello world! 
Hello world! 
Hello world! 
Hello world! 



