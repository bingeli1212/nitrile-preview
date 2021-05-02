---
title: Itemize
---

# The startitemize command

The \startitemize command looks like the following:

    \startitemize[..,..,..][..,..=..,..]
     ...
    \stopitemize

The second argument is the same as the third argument of the
the \setupitemize command.

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

The following example would have generated a list that is packed
and the leading bullet the uppercase roman letters I, II, III, etc.

    \startitemize[R,packed,broad]
    \item Hasselt was founded in the 14th century.
    \item Hasselt is known as a so called Hanze town.
    \item Hasselt’s name stems from a tree.
    \stopitemize

The setup of the itemization commands are presented in table &ref{tb:startitemize}.

+ setup 
  result
+ standard 
  default setup
+ packed 
  no white space between items
+ joinedup 
  no white space before and after itemization 
+ paragraph 
  no white space before an itemization
+ n*serried 
  little horizontal white space after symbol 
+ n*broad 
  extra horizontal white space after symbol 
+ inmargin 
  item separator in margin
+ atmargin 
  item separator at the margin
+ stopper 
  punctuation after item separator
+ intro 
  no pagebreak
+ columns
  two columns
  
The bracket pair contains information on item separators
and local set up variables:

+  1              
   - 
+  2              
   • 
+  3              
   ✭ 
+  n              
   1 2 3 4 ...
+  a              
   a b c d ...
+  A              
   A B C D ...
+  r              
   i ii iii iv ...
+  R              
   I II III IV ...
  
You can also define your own item separator by means of \definesymbol. For example if you try this:

    \definesymbol[5][$\clubsuit$]
    \startitemize[5,packed]
    \item Hasselt was built on a riverdune.
    \item Hasselt lies at the crossing of two rivers.
    \stopitemize

You will get:

    ♣ Hasselt was built on a riverdune.
    ♣ Hasselt lies at the crossing of two rivers.  

Instead of using \item, another alternative is to use \head.
The \head command would have treated the entire line as the bullet,
rather than the leading bullet, star, or other numbers. This has
the advantage such that all texts within a single "head" will not be
split into two pages.
  
    \startitemize
    \head kraamschudden \hfill (child welcoming)
        When a child is born the neighbours come to visit the new
        parents. The women come to admire the baby and the men come to
        judge the baby (if it is a boy) if he will become a strong man.  
    \head nabuurschap (naberschop) \hfill (neighbourship)
        Smaller communities used to be very dependent on the
        cooperation among the members for their well being. Members of
        the {\em nabuurschap} helped each other in difficult times
        during harvest times, funerals or any hardship that fell upon
        the community. 
    \head Abraham \& Sarah  \hfill (identical)
        When people turn 50 in Hasselt it is said that they see Abraham
        or Sarah. The custom is to give these people a {\em speculaas}
        Abraham or a Sarah. Speculaas is a kind of hard spiced biscuit.
    \stopitemize

In the following example the itemize will be shown with four columns.

    \startitemize[n,columns,four]
    \item Achter’t Werk
    \item Baangracht
    \item Brouwersgracht
    \item Eikenlaan
    \item Eiland    
    \item Gasthuisstraat
    \item Heerengracht   
    \item Justitiebastion
    \item Hofstraat       
    \item Hoogstraat      
    \stopitemize

Sometimes you want to continue the enumeration after a short intermezzo. Then
you type for example the following, then the numbering of each item will
continue but the number columns would have switched over to
be three. 

    \startitemize[continue,columns,three,broad] 




