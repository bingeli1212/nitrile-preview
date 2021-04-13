---
title: test-cairo.md
---
%diagram{r:0.65, dotsize:3, linesize:1.5, fillcolor:none, linecolor:teal, fontsize:9, outline, viewport:22 14}

# Slide

```diagram{width:100%}
origin x:2 Y:5
config scaleX 0.5
config scaleY 0.5
config fontsize 8
trump-spade-8     1.25 0
trump-club-8      4.50 0
trump-club-5      1.25 -4
trump-spade-A     4.50 -4
%%%(=ins)
origin Y:1.1 X:10.1
text.lrt {fontstyle:italic} "Rules:" (0,0)
origin down:1.0
cairo {extent:9} "1. Construct an expression that evaluates to 24 using numbers shown on each card" (0,0)
text.lrt "ACE = 1\\JACK = 11\\QUEEN = 12\\KING = 13" (1,-2.5)
origin down:5.5
cairo {extent:9} "2. ALL cards have to be used; each card can only be used once" (0,0)
origin down:2
cairo {extent:9} "3. Addition, subtraction, multiplication, and division" (0,0)
origin down:2.0
cairo {extent:9} "4. Feel free to add any number of parentheses" (0,0)
%%%
format ans1 := "(8 - 5) &times; 8 &times; A = 24"
format ans2 := "(3 - (10 mod (13 - 10))) &times; 12 = 24"
%%%(=ans)
origin x:2 Y:11
label.lrt {fontcolor:teal} "${ans1}" (0,0)
```
