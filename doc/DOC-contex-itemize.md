---
title: Itemize
---

# The startitemize command

  \setupitemize[.1.][..,.2.,..][..,..=..,..]
  .1.          number each
  .2.          standard n*broad n*serried packed stopped joinedup atmargin 
               inmargin autointro loose section intext
  margin       no standard dimension
  width        dimension
  distance     dimension
  factor       number
  items        number
  start        number
  before       command
  inbetween    command
  after        command
  left         text
  right        text
  beforehead   command
  afterhead    command
  headstyle    normal bold slanted boldslanted type cap small ... command
  marstyle     normal bold slanted boldslanted type cap small ... command
  symstyle     normal bold slanted boldslanted type cap small ... command
  stopper      text
  n            number
  symbol       number
  align        left right normal
  indentnext   yes no

These arguments may appear in different combinations, like:

    \startitemize[a,packed][stopper=:]
    \item 2000 is a leap-year
    \item 2001 is a leap-year
    \item 2002 is a leap-year
    \item 2003 is a leap-year
    \stopitemize

The setup of the itemization commands are presented in table &ref{tb:startitemize}.

@ table
  &label{tb:startitemize}

  ```tabular
  & setup 
  & result
  ---
  & standard 
  & default setup
  \\
  & packed 
  & no white space between items
  \\
  & joinedup 
  & no white space before and after itemization 
  \\
  & paragraph 
  & no white space before an itemization
  \\
  & n*serried 
  & little horizontal white space after symbol 
  \\
  & n*broad 
  & extra horizontal white space after symbol 
  \\
  & inmargin 
  & item separator in margin
  \\
  & atmargin 
  & item separator at the margin
  \\
  & stopper 
  & punctuation after item separator
  \\
  & intro 
  & no pagebreak
  \\
  & columns
  & two columns
  ```
  
  
  
  
  
  
  
  
