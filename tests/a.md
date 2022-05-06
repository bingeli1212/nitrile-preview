---
title: 0312 - Algebraic Equations
peek: slide
---
~img{fillalpha:0.5,linesize:1,fontsize:8}


# Example-I

.figure{}
\\
```img{frame,id:a,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = x
\arr arr = [-10:10;40]
\arr yarr = {x} [arr]
\drawplot  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\subtitle "\(y=x\)"
```
```img{frame,id:b,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = x*x
\arr arr = [-10:10;40]
\arr yarr = {x*x} [arr]
\drawplot  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\subtitle "\(y=x^2\)"
```
```img{frame,id:c,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = x*x*x
\arr arr = [-10:10;40]
\arr yarr = {x*x*x} [arr]
\drawplot  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\subtitle "\(y=x^3\)"
```
\\
```img{frame,id:d,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = 2*x
\arr arr = [-10:10;40]
\arr yarr = {2*x} [arr]
\drawplot  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\drawdot ^car:1 (0,0)
\subtitle "\(y=2x\)"
```
```img{frame,id:e,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = 2*x*x
\arr arr = [-10:10;40]
\arr yarr = {2*x*x} [arr]
\drawplot  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\drawdot ^car:1 (0,0)
\subtitle "\(y=2x^2\)"
```
```img{frame,id:f,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = 2*x*x*x
\arr arr = [-10:10;40]
\arr yarr = {2*x*x*x} [arr]
\drawplot  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\drawdot ^car:1 (0,0)
\subtitle "\(y=2x^3\)"
```
\\
```img{frame,id:g,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = 3*x
\arr arr = [-10:10;80]
\arr yarr = {3*x} [arr]
\drawplot  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\drawdot ^car:1 (0,0)
\subtitle "\(y=3x\)"
```
```img{frame,id:h,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = 3*x*x
\arr arr = [-10:10;40]
\arr yarr = {3*x*x} [arr]
\drawplot  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\drawdot ^car:1 (0,0)
\subtitle "\(y=3x^2\)"
```
```img{frame,id:i,viewport: 16 10,background:grid,gridcolor:lightgray,width:30}
\car.1 {xgrid:1, ygrid:1, xaxis:-10 10, yaxis:-10 10, xtick: -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8, ytick: -2 -1 1 2 3 4 5 6 7 8} (8,5)
\fn f1(x) = 3*x*x*x
\arr arr = [-3:3;40]
\arr yarr = {3*x*x*x} [arr]
\drawpath  {linecolor:brown} ^car:1 &points{[arr],[yarr]}
\drawdot ^car:1 (0,0)
\subtitle "\(y=3x^3\)"
```
