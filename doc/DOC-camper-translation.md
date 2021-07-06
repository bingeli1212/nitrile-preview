---
title: Camper Translation
---

# Specify the CJK font name

By default, NITRILE has built-in capability to recognized the specific language
for a given CJK characters. Currently, only following are supported: cn, jp, tw, kr. 
These are the font names to be used within the \switchtobodyfont, such as
```
\switchtobodyfont[jp]日本人
```

However, these are symbolic names that needs to be associated with specific font 
file names. Following are frontmatter entries that can be specified in the master
document to associate each symbolic font name to a font filename. 
```
camper.lang:  cn=heitisc
              jp=hiraginominchopro
```

Here, the "heitisc" and "hiraginominchopro" are font names reported by
running the following command:
```
mtxrun --script font --name --all
```
Since LuaTEX can recognize both fonts installed by the system as well as those that came
with a CONTEX installation, LuaTEX would create a font name that associate with the font files
it has found. 



