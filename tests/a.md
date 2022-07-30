a.md


# Slide                  

The total number of colors is called the &em{chromatic number} of this graph.
\\
```img{frame,background:grid,viewport:13 13,width:20,save}
\set r = 0.5
\origin ^center
\id 1
\for theta in [0:72:359]; \do
  \var theta = theta + 90
  \var theta = deg2rad(theta)
  \var R = 5
  \var x = cos(theta) * R
  \var y = sin(theta) * R
  \node.@[1,2,3,4,5] (${x},${y})
\done
\node.1 {fillcolor:red}
\node.2 {fillcolor:blue}
\node.3 {fillcolor:red}
\node.4 {fillcolor:green}
\node.5 {fillcolor:blue}
\for theta in [0:72:359]; \do
  \var theta = theta + 90
  \var theta = deg2rad(theta)
  \var R = 2.5
  \var x = cos(theta) * R
  \var y = sin(theta) * R
  \node.@[6,7,8,9,10] (${x},${y})
\done
\node.6  {fillcolor:blue}
\node.7  {fillcolor:green}
\node.8  {fillcolor:green}
\node.9  {fillcolor:red}
\node.10 {fillcolor:red}
\edge.1.2.3.4.5.1
\edge.6.8.10.7.9.6
\edge.1.6
\edge.2.7
\edge.3.8
\edge.4.9
\edge.5.10
\drawlabel.u {shift:0.25} "Chromatic number = 3" &south
```
```img{frame,background:grid,viewport:13 13,width:20,save}
\set r = 0.5
\origin ^center
\id 1
\for theta in [0:72:359]; \do
  \var theta = theta + 90
  \var theta = deg2rad(theta)
  \var R = 5
  \var x = cos(theta) * R
  \var y = sin(theta) * R
  \node.@[1,2,3,4,5] (${x},${y})
\done
\node.1 {fillcolor:red}
\node.2 {fillcolor:blue}
\node.3 {fillcolor:red}
\node.4 {fillcolor:green}
\node.5 {fillcolor:blue}
\for theta in [0:72:359]; \do
  \var theta = theta + 90
  \var theta = deg2rad(theta)
  \var R = 2.5
  \var x = cos(theta) * R
  \var y = sin(theta) * R
  \node.@[6,7,8,9,10] (${x},${y})
\done
\node.6  {fillcolor:blue}
\node.7  {fillcolor:green}
\node.8  {fillcolor:green}
\node.9  {fillcolor:red}
\node.10 {fillcolor:red}
\edge.1.2.3.4.5.1
\edge.6.8.10.7.9.6
\edge.1.6
\edge.2.7
\edge.3.8
\edge.4.9
\edge.5.10
\drawlabel.u {shift:0.25} "Chromatic number = 3" &south
```

