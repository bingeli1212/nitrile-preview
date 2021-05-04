---
title: Tabulate In ConTEX
---

# Introduction

This article describes the ConTEXt tabulate environment, which can be used to
typeset tables that are part of the text flow. This mechanism differs from the
TABLE based table mechanism, but recognizes the same preamble commands. It
offers automatic width calculations when typesetting (multiple) paragraphs in
tables and splits the tables over pages.



# Tabulate

In a text, tabulated information can be included either in the text flow, fixed
at the place it should appear, or it can be included at a preferred place, but
given some freedom to float when there is no room. The tabulate commands
discussed here take care of the fixed alternative, while the table commands are
primary meant for floats. However, one is free to use whatever suits best,
because none of them are limited to the cases mentioned.

While the table commands are in fact a layer around the TABLE package, the
tabulate commands are written from scratch. Both have a definition preamble,
and to keep things simple, the tabulate preamble keys are similar to those used
in tables. We use \NC to as column separators, and \NR to go to the next row.

    \starttabulate[|l|c|r|]
    \NC this and that \NC left and right \NC here and there \NC \NR
    \NC such and so   \NC up and down    \NC on and on      \NC \NR
    \stoptabulate


The three keys mean:

+ l 
  left aligned 
+ c 
  centered
+ r 
  right aligned

There are also some spacing commands. These apply to both line and paragraph
columns.

+ i 
  set space left
+ j 
  set space right 
+ k 
  set space around

Each key is to be followed an integer without space between them. This integer
such as "2" for ``k2`` would have expressed
the fact that a spacing equilvalent to 2 times the unit distance should be placed around each
content of the second column, and that column should also be center aligned.

    \starttabulate[|l|k2c|r|]
    ...
    \stoptabulate

The default unit spacing is "0.5em". However, it can be set to a different value
by setting the "unit=" key value. For instance, the following example would have
changed so that the spacing around each cell of the second column is 2em instead
of 1em.

    \starttabulate[|l|k2c|r|][unit=1em]
    ...
    \stoptabulate

It is also possible to hard code the width of a column. The width of the column 
can be changed by following three directives:

+ w(1cm)
  A fixed width of one liner
+ p(1cm) 
  A fixed width column of paragraph of text
+ p 
  A fixed width column that takes up the remaining maximum number of spaces 

In the next example the first column has an unknown width, the next one
contains a left aligned paragraph and has a width of 4cm. The third column has
2cm width one--liner, while last paragraph column occupies the rest of the
available width.

    \starttabulate[|l|p(4cm)l|w(2cm)|p|]
    ...
    \stoptabulate

A four column table with paragraph entries can be specified by saying:

  \starttabulate[|p|p|p|p|]
  ...
  \stoptabulate

Each column can be set to a different font style or font family. To do that
following column directives can be used.

+ B
  boldface
+ I
  italic
+ R
  roman 
+ S
  slanted
+ T
  teletype
  
There are also directives for expressing that a column should be treated
as math text.

+ m 
  inline math text
+ M 
  display math text

Using the ``f`` directive we can insert arbitrary font switches for a
column. For instance, ``f\bs`` would have attached the font switch ``\bs``
to the column. There are also additional directives.

+ f\column
  Font switches
+ b{...}
  To be placed before the entry 
+ a{...}
  To be placed after the entry
+ h\command
  Do with entry (hook)           

The next example shows how to apply a hook (h) and also puts something around
an entry.

    \starttabulate[|w(2cm)h\inframed|b{(}a{)}|p|]
    \HC {Ugly} \NC indeed      \NC he said.     \NC \NR
    \HC {Nice} \NC but useless \NC I would say. \NC \NR
    \stoptabulate

Note that when a ``h`` directive is used that column must be marked by
``\HC``.  The directive ``b`` and ``a`` are used to generate the opening
brace and closing brace for that entry to be placed around entry
after the hook. Following is another example that would generate
a blackened rule that extends horizontally whose length depends on the 
entry itself.  


    \def\SomeBar#1{\blackrule[width=#1em]}
    \starttabulate[|l|lh\SomeBar|]
    \HL
    \NC \bf item \NC \bf quantity \NC \NR
    \HL
    \NC figures  \HC  {5}         \NC \NR
    \NC tables   \HC  {8}         \NC \NR
    \NC formulas \HC {12}         \NC \NR
    \HL
    \stoptabulate

Until now, we used \NC to go to the next column. For special purposes one can use \EQ
to force a column separator.

    \starttabulate
    \NC equal \EQ one can change the separator by changing the \type {EQ}
                  variable with the tabulate setup command \NC \NR
    \NC colon \EQ by default, a colon is used, but an equal sign suits
                  well too \NC \NR
    \stoptabulate

Typeset this turns up as:

+ equal 
  one can change the separator by changing the EQ variable with the tabulate setup command
+ colon 
  by default, a colon is used, but an equal sign suits well too

We’ve seen \NC for normal entries, \EQ for entries seperated by an equal sign,
and \HC for hooked ones. There is also \HQ for a hooked entry with separator.
When one does not want any formatting at all, \RC and \RQ can be used.

           normal raw   hook 
    equal  \EQ    \RQ   \HQ 
    none   \NC    \RC   \HC

This small table shows all three categories. We’ve got 4 centered columns,
either bold or verbatim and two cells are aligned different. This table is
coded as:

    \starttabulate[|*{4}{cBh\type|}]
    \NC           \NC normal \NC raw   \NC hook  \NC \NR
    \RC \bf equal \HC {\EQ}  \HC {\RQ} \HC {\HQ} \NC \NR
    \RC \bf none  \HC {\NC}  \HC {\RC} \HC {\HC} \NC \NR
    \stoptabulate

The equal sign, or whatever else symbol is set up, can also be forced by the
``e`` key in the preamble.  The ``e`` key would insert an equal symbol in the
next column. When we have multiple columns with similar templates, we can save
some typing by repeating them. We have of course to make sure that the number
of vertical-bar is ok.

    \starttabulate[|*{6}{k1pc|}]
    \NC this and that \NC left and right \NC here and there \NC
        such and so   \NC up and down    \NC on and on
    \stoptabulate

Note that a "table" is for typesetting tables that are separate entities, that
may float and are sort of independent of the normal text flow.
On the other hand, a "tabulate" is meant for typesetting tabular text in the
nor- mal text flow. Therefore automatic width calculation, as demonstrated
here, comes in handy.

    \setuptabulate[...][..,..=..,..]
    ...        name
    unit       dimension
    indenting  yes *no*
    before     command
    after      command
    inner      command
    EQ         text    

The optional argument specifies a related tabulation. By setting indenting to
yes, the table is indented according to the current indentation scheme. Left
and right skips are always taken into account! The unit concerns the spacing as
set by the spacing keys ``i``, ``j`` and ``k``. Commands assigned to inner are
executed before the first columns is typeset.  One can add horizontal lines to
a table by \HL. This command automatically takes care of spacing:

For a "tabulate" each item within it can even be expressed as a "itemize".
Take a look at the following example:

    \starttabulate[|p(2cm)|p(5cm)|p|]
    \NC \startitemize[n,packed]
        \item first \item second \item third
        \stopitemize
    \NC \startitemize[packed][items=5,width=2.5em,distance=.5em]
        \its this or that \its such or so \its here or there
        \stopitemize
    \NC \startitemize[g,packed,broad]
        \item alpha \item beta \item gamma
        \stopitemize
    \NC\NR
    \stoptabulate



# Vertical Distance Between Rows

The \TB command can be placed between two rows to add additional vertical
spaces between rows.

    \starttabulate
      \NC one   \NC two   \NC\NR
      \NC two   \NC three \NC\NR
      \TB[halfline]
      \NC four  \NC five  \NC\NR
      \TB[line]
      \NC four  \NC five  \NC\NR
      \TB[1cm]
      \NC eight \NC nine \NC\NR
    \stoptabulate


