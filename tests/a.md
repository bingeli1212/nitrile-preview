---
title: 0312 - Algebraic Equations
peek: slide
---
~img{fillalpha:0.5,linesize:1,fontsize:8}


# Hello      

If we have: \[x=1\] then we will have: \[y=1\]

.figure
\\
```img{viewport:10 12,frame:0}
\fn f(x) = x
\car.1 {showgrid,xaxis:-5 5, yaxis:-5 5, xtick:-5 -4 -3 -2 -1 1 2 3 4 5, ytick:-5 -4 -3 -2 -1 1 2 3 4 5} (5,5)
\var xarr[] = '1+2' '2+3' '3+4'
\var yarr[] = {sqrt(x)} @xarr
\path a = &lines{@xarr|@yarr}
\var zarr[] = @xarr @yarr
\for i in @xarr; \do
  \log ${i}
\done
```
