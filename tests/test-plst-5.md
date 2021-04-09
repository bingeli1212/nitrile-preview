---
title: a.md
subtitle: Math Olympiad 2020 - 2021
author: James Yu
institute: Howard County Chinese Language School
---
%diagram{dotsize:3, fillcolor:lightgray, linejoin:round, linecolor:teal, linesize:1, fontsize:8, outline:1, viewport:20 7, math:1}

# Slide
  @sec:myslide

+ none 
  Characters are just mapped onto glyphs and no substitution or positioning 
  takes place.
+ base 
  The routines built into the engine are used. For many Latin fonts this is a 
  rather useable and efficient method.
+ node 
  Here alternative routines written in Lua are used. This mode is needed for 
  more complex scripts as well as more advanced features that demand some 
  analysis.
+ auto 
  This mode will determine the most suitable mode for the given feature set.


See section &ref{sec:myslide}.

# Mode

We use the term modes for classifying the several ways characters are turned
into glyphs. When a font is defined, a set of features can be associated and one
of them is the mode.

- Apple 
  Apple good 

  - James
    James 2
  - Yu
    Yu 2

- Pear
  The routines built into the engine 
  are used. For many Latin fonts this is aa
  rather useable and efficient method.

When we talk about features, we refer to more than only features provided by
fonts as ConTEXt adds some of its own. In the following section each of these
modes is discussed. Before we do so a short introduction to font tables that we
use is given.
