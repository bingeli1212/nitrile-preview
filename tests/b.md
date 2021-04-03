---
title: a.md
subtitle: Math Olympiad 2020 - 2021
author: James Yu
institute: Howard County Chinese Language School
---


# Ex.# (Three Squares Problem)

Given three squares and three angles,
prove that: m&ang;a + m&ang;b + m&ang;c = 90&deg;
 
```diagram{save:a,viewport:22 12}
config opacity 0.2
path square = &rectangle{(0,0),4,4}
path [A,B,C,D] = (0,0) (4,0) (8,0) (12,0)
path [a,b,c,d] = (0,4) (4,4) (8,4) (12,4)
origin right:3 up:1 
origin s:1.25
draw.square {fillcolor:green} (0,0)
draw.square {fillcolor:red} (4,0)
draw.square {fillcolor:blue} (8,0)
dot &A &B &C &D &a &b &c &d
config linesize 1
draw &A~&d
draw &B~&d
draw &C~&d
config shift 0.5
drawlinesegarc "a"  &D~&A~&d
drawlinesegarc "b"  &D~&B~&d
drawlinesegarc "c"  &D~&C~&d
```

[ Step 1. ]
Draw three square above and add some lines.

```diagram{load:a,save:a,viewport:22 12}
%%%
draw.square {linedashed:1, fillcolor:none} (0,4)
draw.square {linedashed:1, fillcolor:none}   (4,4)
draw.square {linedashed:1, fillcolor:none}  (8,4)
draw {linedashed:1} (0,0)~(4,8)~(12,4)
path e = (4,8)
drawlinesegarc "1" &d~&A~&e
drawlinesegarc "2" &e~&A~&a
```

[ Step 2. ]
m&ang;2 = m&ang;b
,
m&ang;1 = m&ang;c 
,
m&ang;2 + m&ang;1 + m&ang;a = 90&deg;
, &therefore;
m&ang;b + m&ang;c + m&ang;a = 90&deg;

```diagram{load:a,viewport:22 12}
```




