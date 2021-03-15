---
title: test-slopedtext.md
---

# Hello2

```diagram
box.1 "Hello" (0,0)
box.2 "World" (4,3)
flow.1_n.2_w (0,5)
box.1 {fillcolor:brown} "Bye"
```

# Slide 2

```diagram
box.1 "Hello" (0,0)
box.2 "World" (4,3)
box.3 "Again" (5,8)
flow.1_n.2_w.3_s
```

# Slide 3

```diagram
label.bot "Hello" &north
draw (0,0) ~ (5,5)
slopedtext "Hello" (0,0) ~ (5,5)
```

# Slide 4

```diagram
label.bot "Hello" &north
draw (0,0) ~ (5,5)
slopedtext.bot "Hello" (0,0) ~ (5,5)
```
