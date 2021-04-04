test-pingpongball.md


# Slide

```diagram{outline,width:4.5cm,wrap:right}
viewport 15 9
origin x:5 y:1
config fillcolor teal
path O = (0,0)
path O3 = up:2.9 (0,0)
path O4 = up:4.5 (0,0)
path base = &ellipse{&O,2,0.2}
path bar = &ellipse{&O3,0.2,2.8}
path beam = &ellipse{&O4,2.8,0.2}
draw &base
draw &bar
draw &beam
draw (-2.8,4.5)[l:-1.25,-3.0] mark:p1
draw (-2.8,4.5)[l:+1.25,-3.0] mark:p2
draw (+2.8,4.5)[l:-1.25,-3.0]
draw (+2.8,4.5)[l:+1.25,-3.0]
draw (-4.05,1.5)[q:+1.25,-0.5,+2.5,0]cycle
draw (+4.05,1.5)[q:-1.25,-0.5,-2.5,0]cycle
%%%
path ball = &circle{(0,0),0.5)}
draw.ball {shade:ball,shadecolor:white teal} (4.5,0)[h:1][h:1][h:1][h:1]
draw.ball {shade:ball,shadecolor:white teal} (5.0,0.85)[h:1][h:1][h:1]
```
