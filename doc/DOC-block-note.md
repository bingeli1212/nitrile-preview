---
title: The NOTE block
---

The NOTE block is to hold a block of text as a group
of saved source lines that can be used later on for
any purpose. 

    % mydia
      viewport 10 10
      draw (0,0) (10,10)

This allows for a diagram to be saved off to a block and
later constructed using a phrase such as ``&diagram{#mydia}``,
in which case the appearance of the number sign would have 
expressed that the word following it refers to the ID of
a note. 

A NOTE block must start at the first column with no spaces 
before it. It must start with a percent sign, followed by 
one or more spaces, and then a word. The word is to be treated
as the name of this block that later on will be referred to.

There cannot not any empty lines in the body of the block. 

There are some built-in types of block that would be recognized
by NITRILE and will be subject to special processing. For
example, if the id is "__vocabulary__", then it will recognized
as containing a list of vocabularies. One of the purpose 
of a vocabulary item is for the rubifications of words.

    % __vocabulary__
    恐怖・きょうふ
    地震・じしん
    夜中に・よるなかに
    発音・はつおん
    決勝戦・けっしょうせん
    悔しさ・くやしさ
    震えた・ふるえた

