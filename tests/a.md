---
title: index.md
peek: slide
---
```img{id:polygon1,frame:0,viewport:2 3 4}
\path poly1 = ^center ^top (0,-0.5) <l:-0.8,-2> <h:1.6> <z>
\drawanglearc {r:0.35,fillonly,fillcolor:gray,inversed} &poly1
\drawpath &poly1
```
```img{id:polygon2,frame:0,viewport:2 3 4}
\path poly2 = ^center ^top (0,-0.5) <l:-0.8,-1.5> <l:1,-0.75> <l:0.6,0.6> <z> 
\drawanglearc {r:0.35,fillonly,fillcolor:gray,inversed} &poly2
\drawpath &poly2
\drawpath {linedashed} (&poly2[0])--(&poly2[2])
```
```img{id:polygon3,frame:0,viewport:2 3 4}
\path poly3 = ^center ^top (-0.3,-1.0) <l:-0.5,-1> <l:1.2,-0.6> <l:0.3,1> <l:-0.2,1> <z> 
\drawanglearc {r:0.35,fillonly,fillcolor:gray,inversed} &poly3
\drawpath &poly3
\drawpath {linedashed} (&poly3[0])--(&poly3[2])
\drawpath {linedashed} (&poly3[0])--(&poly3[3])
```
```img{id:polygon4,frame:0,viewport:2 3 4}
\path poly4 = ^center ^top (-0.3,-0.3) <l:-0.4,-1.5> <l:0.5,-0.8> <l:0.7,0.2> <l:0.3,1> <l:-0.4,1> <z> 
\drawanglearc {r:0.35,fillonly,fillcolor:gray,inversed} &poly4
\drawpath &poly4
\drawpath {linedashed} (&poly4[0])--(&poly4[2])
\drawpath {linedashed} (&poly4[0])--(&poly4[3])
\drawpath {linedashed} (&poly4[0])--(&poly4[4])
```

# example-1  

-) Sum of interior angles of a
  polygon is \((n-2) &times; 180\), where \(n\) is the
  number of sides.
\\
```tab{rules:all,frame,head,template:15 10 10 10 10,textalign:lcccc,stretch:0.9,fontsize:smaller}
&     Polygon 
      &img{id:polygon1}
      &img{id:polygon2}
      &img{id:polygon3}
      &img{id:polygon4}
&     Sides
      3
      4
      5
      6
&     Angle sum
      180&deg;
      360&deg;
      540&deg;
      720&deg;
```

