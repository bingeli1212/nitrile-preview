---
title: a.md
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

# Display math

Hello world!

```displaymath
   \hypotenuse = \sqrt{\text{leg}_1^2 + \text{leg}_2^2}
```

Hello world!


.page

# Phrase to escape

```parbox
Hello world \\
Hello world
```

The \backspace and \backquote phrases

.page

# Tabular

```tabular{head,fontsize:small,frame,rules:all,align:p15 p40 p35 p20}
\\ Description \\ Figure \\ Symbol
Point    \\ A geometric element that has zero dimension \\ &dia{load:POINT,fontsize:10,viewport:8 3,width:30} \\ P or Point P
Line     \\ A line that is a collection of points along a straight path with no end points. \\ &dia{load:LINE,fontsize:10,viewport:8 3,width:30} \\ \(\overline{AB}\) or \(\overline{BA}\)
Line segment \\ A line segment is a part of a line that contains every point on the line between its end points. \\ &dia{load:LINESEG,fontsize:10,viewport:8 3,width:30} \\ \(\overline{XY}\) or \(\overline{YX}\)
Ray      \\ A ray is a line with a single end point that goes on and on in one direction. \\ &dia{load:RAY,fontsize:10,viewport:8 3,width:30} \\ \(\overrightarrow{PQ}\)
Plane    \\ A plane is a flat surface that extends to infinity. \\ &dia{load:PLANE,fontsize:10,viewport:8 3,width:30} \\ Plane EFG
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

# Displaymath   

```displaymath
  1 + 2 + \ctdot + n + (n+1) &= \frac{n}{2}(n+1) + (n+1) \cr
                      &= \frac{n}{2}(n+1) + \frac{2}{2}(n+1) \cr
                      &= (n+1)(\frac{n}{2} + \frac{2}{2}) \cr
                      &= \frac{n+1}{2}(n+2)\cr
                      &= \frac{n+1}{2}((n+1)+1)
```

.page

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

.page

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

.page

# Figures

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



