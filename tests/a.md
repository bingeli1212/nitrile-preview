---
title: index.md
peek: slide
---

# Slide

& Q: In a language school with a total
of 30 students, 8 of them signed up for French
class, 15 of them signed up for Spanish, and 3 did both. How
many students in the class signed up for neither French nor
Spanish?
\\
```img{viewport:12 7,frame,background:grid,width:50}
\set linesize = 2
\set fillalpha = 0.2
\set fontsize = 8
\origin ^center ^h:-2
\drawpath {fillcolor:fill1} &circle{(0,0)|3}
\drawpath {fillcolor:fill2} ^h:4 &circle{(0,0)|3}
\drawlabel.c "French\\only"  ^h:-1 ^v:1  (0,0)
\drawlabel.c "Spanish\\only"  ^h:5 ^v:1  (0,0) )
\drawlabel.c "French\\and\\Spanish"  ^h:2 ^v:1  (0,0)
\drawlabel.r "5" (-0.5,-1)
\drawlabel.r "3" (+2.0,-1)
\drawlabel.r "12" (+4.5,-1)
```

A: See below.

- French Only: 8 - 3 = 5  
- Spanish Only: 15 - 3 = 12
- Neither French nor Spanish: 30 - 5 - 3 - 12 = 10


# Slide 2

```par{frame,width:50,height:50,textalign:c}
Hello world.\\
Hello world.\\
Hello world.\\
```
