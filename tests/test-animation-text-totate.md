---
title: test-trump.md
---

# Slide

```diagram{outline}
viewport 10 10
config fontsize 14
label.top "2" (4,4)
draw (2,4) ~ (6,4)
draw (2,2) ~ (6,2)
draw (2,2) [v:2]
draw (6,2) [v:2]
label.bot "2" (4,2)
label.lft "2" (2,3)
label.rt "2" (6,3)
```
```diagram{outline}
viewport 10 10
config fontsize 14
label.top {math} "2" (4,4)
draw (2,4) ~ (6,4)
draw (2,2) ~ (6,2)
draw (2,2) [v:2]
draw (6,2) [v:2]
label.bot {math} "2" (4,2)
label.lft {math} "2" (2,3)
label.rt {math} "2" (6,3)
```

# Slide 2

```animation{width:2.5cm,outline,range:ang/0/330,total:12}
viewport 10 10
config fontsize 14
dot (5,5)
config rotate ${ang}
show angle=${ang}
label "Hello World Great" (5,5)
```
