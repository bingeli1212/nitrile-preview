---
title: all.md
---
%?a
\drawline (0,0)(5,5)
\drawtext {math} "a+b" (0,0)
%
%?POINT
\drawdot (3,1.5)
\drawtext.ctr {tx:0.7} (3,1.5) "P"
%
%?LINE
\dblarrow (1,1.5)--(7,1.5)
\drawdot (3,1.5) (5,1.5)
\drawtext.ctr {ty:-0.7} (3,1.5) (5,1.5) "A" "B"
%
%?LINESEG
\stroke (1,1.5)--(7,1.5)
\drawdot (1,1.5) (7,1.5)
\drawtext.ctr {ty:-0.7} (1,1.5) (7,1.5) "X" "Y"
%
%?RAY
\arrow (1,1.5)--(7,1.5)
\drawdot (1,1.5) (4.5,1.5)
\drawtext.ctr {ty:-0.7} (1,1.5) (4.5,1.5) "P" "Q"
%
%?PLANE
\drawpolygon (1,0.5) (6,0.5) (7,2.5) (2,2.5)
\path E = (3.5,2)
\path F = (2.9,1.1)
\path G = (4.9,1.5)
\drawdot (&E) (&F) (&G)
\drawtext.ctr "E" {tx:0.5} (&E)
\drawtext.ctr "F" {tx:0.5} (&F)
\drawtext.ctr "G" {tx:0.5} (&G)
%
%?HATCH
\drawpolygon (2,0.5) (6,0.5) (7,2.5) (3,2.5)
\config linecap round
\path E = (3.5,2)
\path F = (2.9,1.1)
\path G = (4.9,1.5)
\drawcongbar (2,0.5)--(6,0.5) (7,2.5)--(3,2.5)
\drawcongbar {bartype:double} (6,0.5)--(7,2.5)  (3,2.5)--(2,0.5)
%
%?HATCHANG
\config linecap round
\path A/B/C = (2,2.5) (1,0.5) (3,0.5)
\drawpolygon (&A)(&B)(&C)
\drawanglemark {r:0.5,bartype:double} (&B)--(&A)--(&C)
\drawanglemark {r:0.5,bartype:single} (&C)--(&B)--(&A)
\path A/B/C = (5,2.5) (4,0.5) (6,0.5)
\drawpolygon (&A)(&B)(&C)
\drawanglemark {r:0.5,bartype:double} (&B)--(&A)--(&C)
\drawanglemark {r:0.5,bartype:single} (&C)--(&B)--(&A)
%

# Math Bundle

Hello world

```formula
   \hypotenuse = \sqrt{\text{leg}_1^2 + \text{leg}_2^2}
```

Hello world

```formula
  1 + 2 + \ctdot + n + (n+1) &= \frac{n}{2}(n+1) + (n+1) \cr
                      &= \frac{n}{2}(n+1) + \frac{2}{2}(n+1) \cr
                      &= (n+1)(\frac{n}{2} + \frac{2}{2}) \cr
                      &= \frac{n+1}{2}(n+2)\cr
                      &= \frac{n+1}{2}((n+1)+1)
```

Hello world


.page

# Inline-math 

Hello world, the formular is \(a^2 + b^2 = c^2\), 
and we can see why it is so.

Hello world, the formular is \[a^2 + b^2 = c^2\],
and we can see why it is so.


.page


# Inline-dmath

The sinh(x) and cosh(x) are also the unique solution of the equation
\[
f''(x) = f(x)
\]
such that
\[
f(0)=1
\]
\[
f'(0)=0
\]
for the hyperbolic cosine, and
\[
f(0)=0
\]
\[
f'(0)=1
\]
for the hyperbolic sine.
\[
\lim_{x\rarr \infty} \frac{1}{x} = 0
\]

.page

# Backslashed text         

The \backspace and \backquote phrases

.page

# TABULAR

```tabular{head,fontsize:small,frame,rules:all,align:p15 p40 p35 p20}
\\
& Type
& Description 
& Figure 
& Symbol
\\
& Point    
& A geometric element that has zero dimension 
& &dia{fontsize:10,viewport:8 3,width:30;;%=POINT} 
& P or Point P
\\
& Line     
& A line that is a collection of points along a straight path with no end points. 
& &dia{load:LINE,fontsize:10,viewport:8 3,width:30} 
& \(\overline{AB}\) or \(\overline{BA}\)
\\
& Line segment 
& A line segment is a part of a line that contains every point on the line between its end points. 
& &dia{load:LINESEG,fontsize:10,viewport:8 3,width:30} 
& \(\overline{XY}\) or \(\overline{YX}\)
\\
& Ray      
& A ray is a line with a single end point that goes on and on in one direction. 
& &dia{load:RAY,fontsize:10,viewport:8 3,width:30} 
& \(\overrightarrow{PQ}\)
\\
& Plane    
& A plane is a flat surface that extends to infinity. 
& &dia{load:PLANE,fontsize:10,viewport:8 3,width:30} 
& Plane EFG
```

.page

# Cove

Hello world! 
Hello world! 
Hello world! 
Hello world! 

> James Yu
  James Yu
  James Yu

.page


# Dia subtitle

Hello world! 
Hello world! 
Hello world! 
Hello world! 

> ```formula
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

.page

# PARBOX    

```parbox{frame}
Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world! 
```

```parbox{frame,width:40}
\(a + b = c\) \\
\(a + b = c\) \\
\(a + b = c\) \\
\(a + b = c\)
```

.page

# Figures, I

Hello world! 
Hello world! 
Hello world! 
Hello world! 

See figure &ref{fig1}.

.figure{swrap,salign:c}
&label{fig1}
My figure collections.
---
a First
b Second
c Third
d Fourth
---
\\
```dia{viewport:5 5,frame,id:a}
\drawline(0,0)(5,5)
```
```dia{viewport:5 5,frame,id:b}
\drawline(0,0)(5,5)
```
```dia{viewport:5 5,frame,id:c}
\drawline(0,0)(5,5)
```
```dia{viewport:5 5,frame,id:d}
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



# Figures, II

.figure{}
---
a tabular
b parbox
c dia   
---
\\
```tabular{frame,rules:all,id:a,align:p15p15}
Hello \\ World 
Hello \\ World 
Hello \\ World 
```
```parbox{frame,id:b,width:30}
Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world! 
```
```dia{frame,id:c,width:30,viewport:5 5}
\drawline(0,0)(5,5)
```


# Listings  

Hello world! 
Hello world! 
Hello world! 
Hello world! 

See listing &ref{lst1}.

.listing{}
&label{lst1}
My code.
\\
```
var work = async ()=>{
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewSlide(parser);
  await parser.read_file_async(fname);
  var data = translator.to_document();
  return(data);
};
///
console.log(process.argv);
var fname = process.argv[2];
console.log(fname);
///
if(fname){
  work().then(x => console.log(x));
  setTimeout(function(){},1000);
} 
```


# Figures with subcaptions

Hello world! 
Hello world! 
Hello world! 
Hello world! 

See figure &ref{fig1}.

.figure{senum:a}
&label{fig2}
My figure collections.
---
a First
b Second is the source code for the picture
c Third
---
\\
```dia{viewport:20 10,frame,width:40,id:a}
\image "image-clock.png"
\drawrect {w:20,h:10} (0,0)
```
```ink{viewport:20 20,width:40,frame,id:b}
<svg width="500" height="250"
  viewBox="0 0 500 500"
  preserveAspectRatio="none"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <circle cx="250" cy="250" r="250"
    fill="orange"
    stroke="none"/>
</svg>
```


Hello world! 
Hello world! 
Hello world! 
Hello world! 


# Equation

Hello world! 
Hello world! 
Hello world! 
Hello world! 

.equation
&label(eq1}
\\
```formula
a + b = c
```

Hello world! 
Hello world! 
Hello world! 
Hello world! 


# Cave

The &b{set complement} operation of a set
retrieves all elements in the universal set that are not present in the original set.
The notation "\(A^c\)" reads as "the set complement of A."

$ A = {1, 2, 3, 10}
  U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
  \(A^c\) = {4, 5, 6, 7, 8, 9}


# Two tables in a figure

.figure{frame,rules:all}
---
a First
b Second
---
\\
```tabular{id:a,align:p15p15p15}
Hello \\ World \\ Too
Hello \\ World \\ Too
Hello \\ World \\ Too
Hello \\ World \\ Too
Hello \\ World \\ Too
```
```tabular{id:b,align:p15p15p15}
Hello \\ World \\ Too
Hello \\ World \\ Too
Hello \\ World \\ Too
```


# Two tables without a figure

```tabular{frame,rules:all,id:a,align:p15p15p15}
Hello \\ World \\ Too
Hello \\ World \\ Too
Hello \\ World \\ Too
Hello \\ World \\ Too
Hello \\ World \\ Too
```

```tabular{frame,rules:all,id:b,align:p15p15p15}
Hello \\ World \\ Too
Hello \\ World \\ Too
Hello \\ World \\ Too
```


# Samples   

Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 

    Hello world! 
    Hello world! 
    Hello world! 
    Hello world! 
    Hello world! 
    Hello world! 
    Hello world! 
    Hello world! 
    Hello world! 
    Hello world! 

Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 
Hello world!  Hello world!  Hello world!  Hello world!  Hello world! 

# PLST      

- Beverages
  - Coffee
  - Tea
  - Milk
- Fruits     
  * Apple    
    - Red delicious
    - Gala green   
  * Pear  
    - Asian sweet  
    - Desert green   
  * Banana

+ Laptop
  A computer on top of a lap.
+ Desktop
  A computer on top of a desk.




