---
title: test-box.md
---

# Slide 1

```diagram{frame}
viewport 17 9
config w 2
config h 2
config rdx 0.2
config rdy 0.2
config boxtype RECT  
origin at:&center
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,0)
arrow {linesize:2,linecolor:green} <box.1:s,-2,-2> ~ <box.1:s,0,-2> ~ <box.1:s>
arrow {linesize:2,linecolor:green} <box.2:s,+2,-2> ~ <box.2:s,0,-2> ~ <box.2:s>
```

# Slide 2

```diagram{frame}
viewport 17 9
config w 2
config h 2
config rdx 0.2
config boxtype PARA  
origin at:&center
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,0)
arrow {linesize:2,linecolor:green} <box.1:s> ~ <box.1:s,0,-2> ~ <box.2:s,0,-2> ~ <box.2:s>
```

# Slide 3

```diagram{frame}
viewport 17 9
config w 2
config h 2
config rdx 0.2
config boxtype HEXG  
origin at:&center left:2 down:2
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,4)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# Slide 4

```diagram{frame}
viewport 17 9
config w 4
config h 2
config rdx 0.2
config boxtype ELLI  
origin at:&center left:2 down:2
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,4)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX TERM

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype TERM  
origin at:&center left:2 down:2
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,4)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX RDEL

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype RDEL  
origin at:&center left:2 down:2
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,4)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX LDEL

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype LDEL  
origin at:&center left:2 down:2
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,4)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX SDOC

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype SDOC  
origin at:&center left:2 down:2
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,4)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX MDOC

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config linesize 1
config linecolor white
config boxtype MDOC  
origin at:&center left:2 down:2
box.1 {fillcolor:red} "1" (0,0)
box.2 {fillcolor:red} "2" (4,4)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX STOR

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype STOR  
config linesize 1
origin at:&center left:2 down:4
box.1 {w:4,h:2,fillcolor:red,linecolor:white} "1" (0,0)
box.2 {w:2,h:4,fillcolor:red,linecolor:white} "2" (4,4)
box.3 {w:2,h:2,fillcolor:red,linecolor:white} "2" (6,0)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX FORM

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype FORM  
config linesize 1
origin at:&center left:2 down:4
box.1 {w:4,h:2,fillcolor:red,linecolor:white} "1" (0,0)
box.2 {w:2,h:4,fillcolor:red,linecolor:white} "2" (4,4)
box.3 {w:2,h:2,fillcolor:red,linecolor:white} "2" (6,0)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX SUBP

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype SUBP  
config linesize 1
origin at:&center left:2 down:4
box.1 {w:4,h:2,fillcolor:red,linecolor:white} "1" (0,0)
box.2 {w:2,h:4,fillcolor:red,linecolor:white} "2" (4,4)
box.3 {w:2,h:2,fillcolor:red,linecolor:white} "2" (6,0)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX DOBJ

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype DOBJ  
config linesize 1
origin at:&center left:2 down:4
box.1 {w:4,h:2,fillcolor:red,linecolor:white} "1" (0,0)
box.2 {w:2,h:4,fillcolor:red,linecolor:white} "2" (4,4)
box.3 {w:2,h:2,fillcolor:red,linecolor:white} "2" (6,0)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX UOBJ

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype UOBJ  
config linesize 1
origin at:&center left:2 down:4
box.1 {w:4,h:2,fillcolor:red,linecolor:white} "1" (0,0)
box.2 {w:2,h:4,fillcolor:red,linecolor:white} "2" (4,4)
box.3 {w:2,h:2,fillcolor:red,linecolor:white} "2" (6,0)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX LOBJ

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype LOBJ  
config linesize 1
origin at:&center left:2 down:4
box.1 {w:4,h:2,fillcolor:red,linecolor:white} "1" (0,0)
box.2 {w:2,h:4,fillcolor:red,linecolor:white} "2" (4,4)
box.3 {w:2,h:2,fillcolor:red,linecolor:white} "2" (6,0)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# BOX ROBJ

```diagram{frame}
viewport 18 10
config w 4
config h 2
config rdx 0.2
config boxtype ROBJ  
config linesize 1
origin at:&center left:2 down:4
box.1 {w:4,h:2,fillcolor:red,linecolor:white} "1" (0,0)
box.2 {w:2,h:4,fillcolor:red,linecolor:white} "2" (4,4)
box.3 {w:2,h:2,fillcolor:red,linecolor:white} "2" (6,0)
arrow {linesize:2,linecolor:green} <box.1:n> ~ <box.1:n,0,3> ~ <box.2:w>
```

# Slide FlowChart

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
arrow {linesize:2,linecolor:green} <box.1:s> ~ <box.2:n>
arrow {linesize:2,linecolor:green} <box.2:s> ~ <box.3:n>
arrow {linesize:2,linecolor:green} <box.2:e> ~ <box.4:w>
arrow {linesize:2,linecolor:green} <box.4:s> ~ <box.4:s,0,-3> ~ <box.3:e>
label.lrt "Yes" <box.2:s,0.2,-0.2>
label.lrt "No" <box.2:e,0.2,-0.2>
```

