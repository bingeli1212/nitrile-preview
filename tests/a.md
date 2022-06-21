---
title: 0398 - Math Symbols
peek: slide
tex: pdflatex
---
```{id:POINT,fontsize:10,viewport:8 3,width:20}
\drawdot (3,1.5)
\drawlabel.c +0.7+0 (3,1.5) "P"
```
```{id:LINE,fontsize:10,viewport:8 3,width:20}
\dblarrow (1,1.5)--(7,1.5)
\drawdot (3,1.5) (5,1.5)
\drawlabel.c +0-0.7 (3,1.5) (5,1.5) "A" "B"
```
```{id:LINESEG,fontsize:10,viewport:8 3,width:20}
\strokepath (1,1.5)--(7,1.5)
\drawdot (1,1.5) (7,1.5)
\drawlabel.c +0-0.7 (1,1.5) (7,1.5) "X" "Y"
```
```{id:RAY,fontsize:10,viewport:8 3,width:20}
\arrow (1,1.5)--(7,1.5)
\drawdot (1,1.5) (4.5,1.5)
\drawlabel.c +0-0.7 (1,1.5) (4.5,1.5) "P" "Q"
```
```{id:PLANE,fontsize:10,viewport:8 3,width:20}
\drawpolygon (1,0.5) (6,0.5) (7,2.5) (2,2.5)
\path E = (3.5,2)
\path F = (2.9,1.1)
\path G = (4.9,1.5)
\drawdot (&E) (&F) (&G)
\drawlabel.c +0.5+0 "E" (&E)
\drawlabel.c +0.5+0 "F" (&F)
\drawlabel.c +0.5+0 "G" (&G)
```
```{id:HATCH,fontsize:10,viewport:8 3,width:20}
\drawpolygon (2,0.5) (6,0.5) (7,2.5) (3,2.5)
\set linecap = round
\path E = (3.5,2)
\path F = (2.9,1.1)
\path G = (4.9,1.5)
\drawcongbar (2,0.5)--(6,0.5) (7,2.5)--(3,2.5)
\drawcongbar {bartype:double} (6,0.5)--(7,2.5)  (3,2.5)--(2,0.5)
```
```{id:HATCHANG,fontsize:10,viewport:8 3,width:20}
\set linecap = round
\path A/B/C = (2,2.5) (1,0.5) (3,0.5)
\drawpolygon (&A)(&B)(&C)
\drawanglemark {r:0.5,bartype:double} (&B)--(&A)--(&C)
\drawanglemark {r:0.5,bartype:single} (&C)--(&B)--(&A)
\path A/B/C = (5,2.5) (4,0.5) (6,0.5)
\drawpolygon (&A)(&B)(&C)
\drawanglemark {r:0.5,bartype:double} (&B)--(&A)--(&C)
\drawanglemark {r:0.5,bartype:single} (&C)--(&B)--(&A)
```
```{id:LINEELL,fontsize:10,viewport:8 3,width:20}
\path a = (1,0.2)<l:6,1>
\drawpath &a
\drawslopedlabel {math,shift:-0.5} &a "\ell"
```
```{id:LINEPARA,fontsize:10,viewport:8 3,width:20}
\path a = (1,0.2)<l:3,2>
\path b = (4,0.2)<l:3,2>
\drawline &a
\drawline &b
\drawslopedlabel {math,shift:-0.5} &a "\ell_1"
\drawslopedlabel {math,shift:-0.5} &b "\ell_2"
```
```{id:LINENPARA,fontsize:10,viewport:8 3,width:20}
\path a = (1,0.2)<l:3,2>
\path b = (3,0.4)<l:4,1.0>
\drawline &a
\drawline &b
\drawslopedlabel {math,shift:-0.5} &a "\ell_1"
\drawslopedlabel {math,shift:-0.5} &b "\ell_2"
```
```{id:POINTAB,fontsize:10,viewport:8 3,width:20}
\path a = (1,0.25)<l:6,1>
\drawpath &a
\drawlabel.c {math} +0+0.5 "A" +0+0.5 "B" &a[0] &a[1]
\drawdot &a
```
```{id:TRIABC,fontsize:10,viewport:8 3,width:20}
\path a = (1,0.5)<l:6,0><l:-1,2.0><z>
\drawpath &a
\drawlabel.c.c.c {math} -0.5+0 "B" +0.5+0 "C" +0.5+0 "A" &a[0] &a[1] &a[2]       
\drawdot &a 
```
```{id:PARALLELOGRAMABPQ,fontsize:10,viewport:8 3,width:20}
\drawpolygon (2,0.5) (6,0.5) (7,2.5) (3,2.5)
\set linecap = round
\path E = (3.5,2)
\path F = (2.9,1.1)
\path G = (4.9,1.5)
\drawlabel.l -0.5+0 "A" (2,0.5)
\drawlabel.r +0.5+0 "P" (6,0.5)
\drawlabel.r +0.5+0 "Q" (7,2.5)
\drawlabel.l -0.5+0 "B" (3,2.5)
\drawdot.l "A" (2,0.5)
\drawdot.r "P" (6,0.5)
\drawdot.r "Q" (7,2.5)
\drawdot.l "B" (3,2.5)
```
```{id:LINESEGABC,fontsize:10,viewport:8 3,width:20}
\dblarrow (1,1.5)--(7,1.5)
\drawdot (2,1.5) (4,1.5) (6,1.5)
\drawlabel.c +0-0.7 (2,1.5) (4,1.5) (6,1.5) "A" "B" "C"
```
```{id:ANGLEALPHA,fontsize:10,viewport:8 3,width:20}
\strokepath (1,0.5)<h:6>
\strokepath (4.5,0.5)<l:-2,2>
\drawlabel.c {shift:0.2,math} "\alpha" "\beta"(3.2,1.0)<h:1.4>
```
```{id:ANGLEABC,fontsize:10,viewport:8 3,width:20}
\strokepath (1,0.5)<l:4,0><l:-2,2><z>
\drawlabel.c.c.c {shift:0.2} "B" "C" "A" (1,0.5)<l:4,0><l:-2,2><z>
```
```{id:TRIANGLEbh,fontsize:10,viewport:8 3,width:20}
\strokepath (0,0.5)<l:3,0><l:-1,2><z>
\strokepath (2,0.5)<v:2>
\strokepath (4,0.5)<l:3,0><l:1,2><l:-3,0><z>
\strokepath (7,0.5)<v:2>
\drawlabel.c {math} "b" "h" (1,0.2) (1.5,1.2)
\drawlabel.c {math} "b" "h" (5,0.2) (6.5,1.2)
```
```{id:RECTlw,fontsize:10,viewport:8 3,width:20}
\strokepath (0.5,0.5)<h:4><v:2><h:-4><z>
\drawlabel.c {math} "l" "w" (2.5,1.0) (5.0,1.5)
```




# Points, Lines and Plane, I

```tab{text:smaller,head,frame,rules:all,template:p15 p50 p25 p20}
& Type
  Description
  Figure
  Symbol
& Point
  Geometric element having zero dimension
  &img{id:POINT}
  P or Point P
& Line
  All points along a straight path with no end points.
  &img{id:LINE}
  \(\overleftrightarrow{AB}\) or \(\overleftrightarrow{BA}\)
& Line segment
  Part of a line consisting of points between two end points.
  &img{id:LINESEG}
  \(\overline{XY}\) or \(\overline{YX}\)
& Ray
  Line with a single end point.
  &img{id:RAY}
  \(\overrightarrow{PQ}\)
& Plane
  A plane is a flat surface that extends to infinity.
  &img{id:PLANE}
  Plane EFG
```


# Symbol  for expressing lines, I

```tab{text:smaller,head,fontsize:small,frame,rules:all,template:p30 p50 p30}
& Symbol
  Explanation
  Example
& \(\ell\)
  variable for lines
  &img{id:LINEELL}
& \(\ell_1 \parallel \ell_2\)
  lines \(\ell_1\) and \(\ell_2\) are parallel
  &img{id:LINEPARA}
& \(\ell_1 \nparallel \ell_2\)
  lines \(\ell_1\) and \(\ell_2\) are non-parallel
  &img{id:LINENPARA}
& \(|AB|\)
  distance between point A and point B
  &img{id:POINTAB}
& \(|BC| \leq |AB| + |AC|\)
  distance between point B & C must be less than or equal to the sum of distances between points A & B and points A & C.
  &img{id:TRIABC}
```

# Symbol  for expressing lines, II

```tab{text:smaller,head,fontsize:small,frame,rules:all,template:p30 p50 p30}
& Symbol
  Explanation
  Example
& \(\overleftrightarrow{AB}\)
  (infinite) line formed by points A and B
  &img{id:LINE}
& \(\overleftrightarrow{AB} = \overleftrightarrow{BA}\)
  line \(\overleftrightarrow{AB}\) and line \(\overleftrightarrow{BA}\) are the same line.
  &img{id:LINE}
& \(\overline{AB} \cong \overline{PQ} \)
  line segments AB and PQ are congruent
  &img{id:PARALLELOGRAMABPQ}
& \(m\overline{AB} = m\overline{PQ}\), &br{} \(AB = PQ\)
  line segments AB and PQ are of the same measure
  &img{id:PARALLELOGRAMABPQ}
& \(m\overline{AB} + m\overline{BC} = m\overline{AC}\), \(AB + BC = AC\)
  the sum of adding measure of line segment AB and line segment BC equals the measure of line segment AC
  &img{id:LINESEGABC}
& Hatch marks
  congruent line segments
  &img{id:HATCH}
```


# Symbol  for expressing circles

```tab{text:smaller,head,fontsize:small,frame,rules:all,template:p20 p50 p40}
& Symbol \\ Explanation \\ Example
& \(O\) \\ variable for circle (or center of circle) \\ Circles \(O_1\) and \(O_2\) are congruent
& \(r\) \\ variable for radius of circle \\ \(r = \sqrt{\frac{A}{\pi}} \)
& \(d\) \\ variable for diameter of circle \\ \(d = 2r\)
& \(C\) \\ variable for circumference of circle \\ \(C = 2\pi r\), \(C = \pi d\)
& \(A\) \\ variable for area of circle \\ \(A = \pi r^2 \)
& \(\pi\) \\ PI (Archimedes' constant)   \\ \(\pi = \frac{C}{d} \)
& \(\overarc{AB}\) \\ arc segment between points A and B   \\ If \(\overline{AB}\) is diameter of a circle then \(\overarc{AB}\) would be half-circumference
& \(m\overarc{AB}\) \\ measure of arc segment between points A and B  \\ If \(\overline{AB}\) is diameter of a circle then \(m\overarc{AB} = 180\deg\)
```


# Symbol for expressing angles

```tab{text:smaller,head,fontsize:small,frame,rules:all,template:p30 p50 p30}
& Symbol
  Explanation
  Example
& \(a\), \(b\), \(c\), \(\alpha\), \(\beta\), \(\gamma\), \(\theta\), \(\phi\)
  variable for angles
  &img{id:ANGLEALPHA}
& \(\deg\)
  degree symbol
  \(\alpha = 180\deg - \beta\)
& \(\ang ABC\)
  angle formed by points A, B and C
  &img{id:ANGLEABC}
& \(\ang ABC = \ang CBA\)
  angle ABC and CBA are the same angle
  &img{id:ANGLEABC}
& \(m\ang ABC = m\ang ACB\)
  angle ABC and ACB have the same measure
  &img{id:ANGLEABC}
& \(\ang B\)
  interior angle at point B
  &img{id:ANGLEABC}
& \(m\ang B + m\ang C = 100\deg\)
  the sum of adding interior angles at A and B is 100 degrees
  &img{id:ANGLEABC}
& Hatch marks
  congruent angles
  &img{id:HATCHANG}
```


# Symbol for expressing polygon shapes

```tab{text:smaller,head,fontsize:small,frame,rules:all,template:p20 p50 p40}
& Symbol
  Explanation
  Example
& \(P\)
  perimeter
  For a rectangle, \(P = 2l + 2w\)
& \(A\)
  area
  For a triangle, \(A = \frac{bh}{2} \)
& \(h\)
  variable for height of triangle/quadrilateral
  &img{id:TRIANGLEbh}
& \(b\)
  variable for base of triangle/quadrilateral
  If \(b\) is 5 and \(h\) is 3, then triangle \( A = \frac{5 \sdot 3}{2} \)
& \(l\)
  variable for length of rectangle
  &img{id:RECTlw}
& \(w\)
  variable for width of rectangle
  rectangle \( A = lw \)
& \(n\)
  variable for number of sides in polygon
  For an n-gon, the sum of interior angle equals \((n-2)\sdot 180\deg\)
```

# Symbol for expressing intervals

```tab{text:smaller,head,fontsize:small,frame,rules:all,template:p20 p50 p40}
& Symbol \\ Explanation \\ Example
& \((a, b)\) \\ a value greater than \(a\) and less than \(b\) \\ \(x\) is between (0, 1)
& \([a, b]\) \\ a value greater or equal to \(a\) and less than \(b\) \\ \(x\) is between [0, 1]
& \((a, b]\) \\ a value greater than \(a\) and less than or equal to \(b\) \\ \(x\) is between (0, 1]
& \([a, b)\) \\ a value greater than or equal to \(a\) and less than \(b\) \\ \(x\) is between [0, 1)
```


# Quizzes

## Q1

Which one of the following is the correct notation
for denoting the fact that interior angle
B and C are congruent?

$ &img{id:ANGLEABC}

[ Answer:B ]
A. \(\ang ABC = \ang CBA\)
B. \(\ang ABC \cong \ang ACB\)
C. \(m\ang ABC = m\ang ACB\)
D. \(\ang B = \ang C\)

## Q2

Which one of the following is the correct notation
for denoting the fact that interior angle
B and C have the same measure?

$ &img{id:ANGLEABC}

[ Answer:C ]
A. \(\ang ABC = \ang CBA\)
B. \(\ang ABC \cong \ang ACB\)
C. \(m\ang ABC = m\ang ACB\)
D. \(\ang B = \ang C\)

## Q3

Which one of the following is not correct
in terms for what it tries to express?

$ &img{id:ANGLEABC}

[ Answer:D ]
A. \(m\ang A + m\ang B \geq m\ang C\)
B. \(m\ang B = m\ang C\)
C. \(\ang B = \ang B\)
D. \(\ang B = \ang C\)

## Q4

Which one of the following is the correct notation
for denoting the
distance measured between point A and B?

$ &img{id:LINE}


[ Answer:A ]
A. \(AB\)
B. \(\overrightarrow{AB}\)
C. \(\overline{AB}\)
D. \(\overleftrightarrow{AB}\)

## Q5

Which one of the symbols below is mostly used
for denoting the radius of a circle?

```img{fontsize:10,viewport:8 3}
\drawcircle {fillcolor:none,r:1.3} (4,1.5)
\drawdot (4,1.5)
\drawline (4,1.5)<h:1.3>
```

[ Answer:A ]
A. \(r\)
B. \(d\)
C. \(l\)
D. \(w\)

## Q6

Which one of the symbols below is mostly used
for denoting the diameter of a circle?

```img{fontsize:10,viewport:8 3}
\drawcircle {fillcolor:none,r:1.3} (4,1.5)
\drawdot (4,1.5)
\drawline (4,1.5)<h:+1.3>
\drawline (4,1.5)<h:-1.3>
```

[ Answer:B ]
A. \(r\)
B. \(d\)
C. \(l\)
D. \(w\)

## Q7

Which one of the following is the most appropriate
one for expressing the formula to compute
the area of a rectangle?

```img{fontsize:10,viewport:8 3}
\drawrect {fillcolor:none,w:4,h:2} (2.5,0.5)
```

[ Answer:D ]
A. \(C = bh\)
B. \(A = bh\)
C. \(C = lw\)
D. \(A = lw\)

## Q8

Which one of the following is the correct notation
for denoting the measured length
of the arc segment between
point A and B?

```img{fontsize:10,viewport:8 3}
\drawcircle {fillcolor:none,r:1.3,linedashed} (4,1.5)
\drawdot (4,1.5)
\drawarc {r:1.3,start:0,span:60,linesize:2.0} (4,1.5)
\var x1 = 4.0 + 1.3*cos(0)
\var y1 = 1.5 + 1.3*sin(0)
\drawlabel.r {shift:0.1,math} "A" (x1,y1)
\var x2 = 4.0 + 1.3*cos(60/180*3.14159)
\var y2 = 1.5 + 1.3*sin(60/180*3.14159)
\show ${x2}
\show ${y2}
\drawlabel.r {shift:0.1,math} "B" (x2,y2)
```

[ Answer:D ]
A. \(\overline{AB} = 5.0\)
B. \(m\overline{AB} = 5.0\)
C. \(\overarc{AB} = 5.0\)
D. \(m\overarc{AB} = 5.0\)

## Q9

Which one of the following notation should be used
for expressing a range of numbers that is between 0 and 100 including
0 but excluding 100?

[ Answer:D ]
A. \((0, 100)\)
B. \([0, 100]\)
C. \((0, 100]\)
D. \([0, 100)\)
