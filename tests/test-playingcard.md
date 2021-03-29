---
title: Sylverster Intro
latex.features: parskip
---


# The Vector object

```diagram{outline,width:4cm}
viewport 10 10
path club = (0.4,0.4) [a:0.15,0.15,0,1,1,0,0.2] [a:0.15,0.15,0,1,1,0.2,0] [a:0.15,0.15,0,1,1,0,-0.2] [h:-0.07] [q:0,-0.3,0.07,-0.3] [h:-0.2] [q:0.07,0,0.07,0.3] cycle
draw.club {scaleX:10,scaleY:10,fillcolor:black} (0,0)
```
```diagram{outline,width:4cm}
viewport 10 10
path spade = (0.4,0.1) [q:0.07,0,0.07,0.2] [h:-0.07] [c:-0.3,-0.2,-0.30,+0.15,-0.10,+0.35] [s:0.20,0.20,0.20,0.20] [c:0,0,0.2,-0.2,0.2,-0.2] [c:0.2,-0.2,0.2,-0.55,-0.1,-0.35] [h:-0.07] [q:0,-0.2,0.07,-0.2] cycle
draw.spade {scaleX:10,scaleY:10,fillcolor:black} (0,0)
```
```diagram{outline,width:4cm}
viewport 10 10
path heart = (0.5,0.1) [c:-0.50,0.20,-0.50,0.90,0,0.70] [c:0.50,0.20,0.50,-0.50,0,-0.70] cycle
draw.heart {scaleX:10,scaleY:10,fillcolor:red} (0,0)
```
```diagram{outline,width:4cm}
viewport 10 10
path diamond = (0.5,0.1) [l:-0.35,0.375] [l:0.35,0.375] [l:0.35,-0.375] cycle
draw.diamond {scaleX:10,scaleY:10,fillcolor:red} (0,0)
```


