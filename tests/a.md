---
title: a.md
---
\var x = 10
\arr xs = [1:9.5]          
\arr ys = {sqrt(x)} [xs]

# Slice

```img
\path O = ^center ^v:-0.5 (0,0)
\path tri = &equilateraltriangle{&O,5.5}
\var i = 2
\arr a = [1+I,2,3,4,5]   
\fn f(x) = sqrt(x)
\arr b = {sqrt(x)} [a]
\var c = b[i]
\log a=${a}
\log b=${b}
\log c=${c}
\log x=${x}
\log xs=${xs}
\log ys=${ys}
\for i in [0,1,2,3,4,5]; \do
  \log a[${i}]=${a[i]}
\done
\let (cx,cy) = (1,2)
\log cx=${cx}
\log cy=${cy}
\let x:y = 12-I
\log x=${x}
\log y=${y}
\var g = x+y
\log g=${g}
```


