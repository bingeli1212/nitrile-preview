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
flow {linesize:3,linecolor:orange} <box.2_s,2,-2> <box.2_s,0,-2> <box.2_s>
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
flow <box.1_s> <box.1_s,0,-2> <box.2_s,0,-2> <box.2_s>
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
flow <box.1_n> <box.2_w>
```

