---
title: test-box.md
---

# Slide 1

```diagram{frame}
viewport 17 9
config w 2
config h 2
config boxtype PGRAM 
origin at:&center
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,0)
arrow {linesize:2,linecolor:green} <box.1:s,-2,-2> <box.1:s,0,-2> <box.1:s>
arrow {linesize:2,linecolor:green} <box.2:s,+2,-2> <box.2:s,0,-2> <box.2:s>
```

# Slide 2

```diagram{frame}
viewport 17 9
config w 2
config h 2
config boxtype PGRAM 
origin at:&center
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,0)
arrow {linesize:2,linecolor:green} <box.1:s> <box.1:s,0,-2> <box.2:s,0,-2> <box.2:s>
```

# Slide 3

```diagram{frame}
viewport 17 9
config w 2
config h 2
config boxtype PGRAM 
origin at:&center left:2 down:2
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,4)
arrow {linesize:2,linecolor:green} <box.1:n> <box.1:n,0,3> <box.2:w>
```

# Slide 4

```diagram{frame}
viewport 22 16
config fontsize 9
config w 5
config h 2
origin at:&center left:4
box.1 {boxtype:RECT,linecolor:orange} "Start" (-2,3)
box.2 {boxtype:RHOMBUS,linecolor:orange} "Decision" [v:-4]
box.3 {boxtype:RECT,linecolor:orange} "End" [v:-4]
box.4 {boxtype:RECT,linecolor:orange} "PAUSE" [l:8,4]
arrow {linesize:2,linecolor:green} <box.1:s> <box.2:n>
arrow {linesize:2,linecolor:green} <box.2:s> <box.3:n>
arrow {linesize:2,linecolor:green} <box.2:e> <box.4:w>
label.lrt "Yes" <box.2:s,0.2,-0.2>
label.lrt "No" <box.2:e,0.2,-0.2>
```

