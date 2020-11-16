
# Slice

```diagram
viewport 26 10
% cylinder
path cylinder = (0,0) [a:1,0.3,0,0,0,2,0] [v:2] [h:-2] [v:-2] cycle 
draw.cylinder {shade:linear;angle:80;shadecolor:gray lightgray gray} (8,2)
path top = (0,2) [a:1,0.3,0,0,0,2,0] [a:1,0.3,0,0,0,-2,0] cycle
draw.top {fillcolor:gray} (8,2)
% cone
path cone = (0,0) [a:1,0.3,0,0,0,2,0] [l:-1,2] [l:-1,-2] cycle
draw.cone {shade:linear;shadecolor:gray lightgray gray;angle:80} (10,6)
% cube
path cube = (0,0) [h:2] [v:2] [h:-2] cycle
draw.cube {shade:linear;shadecolor:lightgray lightgray gray;angle:80} (12,2)
path topcube = <0,2> (0,0) [l:0.5,0.5] [h:2] [l:-0.5,-0.5] cycle
draw.topcube {fillcolor:gray} (12,2)
path ritcube = <2,0> (0,0) [l:0.5,0.5] [v:2] [l:-0.5,-0.5] cycle
draw.ritcube {fillcolor:gray} (12,2)
% circle
path circle = &circle{(0,0),1.2} cycle         
draw.circle {shade:radial;shadecolor:gray;angle:80} (3,6)
% circle2
path circle = &circle{(0,0),1.2} cycle         
draw.circle {shade:radial;shadecolor:yellow blue red;angle:80} (6,6)
% sphere
path ball = &circle{(0,0),1} cycle
draw.ball {shade:ball;shadecolor:lightgray gray} (4,2)
% rectangle linear lightgray->black
path rect = &rectangle{(0,0),(4,2)} cycle
draw.rect {shade:linear;shadecolor:lightgray} (16,2)
% rectangle linear white->black
path rect = &rectangle{(0,0),(4,2)} cycle
draw.rect {shade:linear;shadecolor:} (16,5)
% rectangle radial lightgray->black
path rect = &rectangle{(0,0),(4,2)} cycle
draw.rect {shade:radial;shadecolor:lightgray} (22,2)
% rectangle radial white->black
path rect = &rectangle{(0,0),(4,2)} cycle
draw.rect {shade:radial;shadecolor:} (22,5)
```

