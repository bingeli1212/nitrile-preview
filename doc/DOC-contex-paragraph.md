---
title: Paragraphs
---

# Vertical Spacing

Vertical spacing in CONTEX is called "whitespace". It can be configured by
the following command:

    \setupwhitespace[...]
    ... none small medium big line fixed fix dimension

Instead of a random value it is better to use one of the pre defined dimension.
Default there is no vertical spacing. Without any set up values the vertical
spacing is related to the actual fontsize.

Vertical spacing can be forced by either:

    \whitespace

    \nowhitespace

These commands have only effect when vertical spacing is set up. In fact these
commands will not be necessary for ConTEXt takes care of most situations.  TEX
handles vertical spacing around lines quite differently from that around text. In
case these problematic situations occur one can use the following commands.
Spacing around figures and tables is dealt with by ConTEXt, so only use these
commands when the typeset text looks really bad.

    \startlinecorrection ... \stoplinecorrection

For example:

    \startlinecorrection
    \framed{To boxit or not, that’s a delicate question!}
    \stoplinecorrection

One can add vertical spacing with the TEX command \vskip, but please don’t. We
advise you to use:

    \blank[..,...,..]
    ... n*small n*medium n*big nowhite back white 
        disable force reset line halfline 
        formula fixed flexible

We can use a value of one of the keywords small, medium or big. A big jump is
twice a medium jump which is four times a small jump. A value however can be
left out (\blank) when the default vertical space is desired. It is advisable
to set up the vertical spacing only once in the setup area of your document.
Local alterations throughout your document will result in a badly--spaced
document.

    \setupblank[...]
    ... normal standard line dimension big medium small fixed flexible

An example is:

    \setupblank[big]

The vertical spaces will be automatically adapted to the fontsize and they are
flexible. Changing the default set up locally is therefore not advisable.
Without an argument \setupblank adapts to the actual fontsize!

The keywords fixed and flexible are used to end or reinstate this adaptive
characteristic. In columns it is recommended to use the setup [fixed,line] or
the opposite setup [flexible,standard].

Once setup, the \blank command by itself will inject the amount of vertical
spaces setup by it.  The last vertical space can be undone by typing
\blank[back] and the next blank can be blocked by disable. With reset a disable
is ignored.

The command \blank is one of the more advanced commands. The next call is
allowed:

    \blank[2*big,medium,disable]

Since medium is half the amount of big, this results in adding a vertical
spaces of 2.5 times big. The previous vertical space will be undone
automatically and the disable suppressed the next \blank.  A lasting vertical
space can be sustained by force. For example, if you want some extra spacing at
the top of a page you will have to type force.

Following are the amount of vertical spaces that ended up being
injected between paragraphs for each particular argument to the 
\setupblank command.

@ table

  ```tabular
  setup        value
  -----------------------------------------------------------
  small        2.78249pt plus 0.92749pt minus 0.92749pt 
  medium       5.56499pt plus 1.855pt minus 1.855pt 
  big          11.12997pt plus 3.70999pt minus 3.70999pt 
  line         14.83998pt
  ```

Normally there is some stretch in the vertical spacing. This enables TEX to
fill out a page optimally. In the next example we see what happens when we add
stretch to whitespace. Each sample shows from top to bottom three \blank’s of
big, medium and small. The left and right sample show the range of the stretch.
The rightmost sample shows that adding stretch can result in shrink.

Instead of setting up a "whitespace" that is to be injected automatically by
CONTEX between paragraphs, one can control the vertical spaces around a
particular block individually, in cases where there isn't any vertical spaces
setup. An recommanded way to do this is to call \defineblank, which is to 
create a name that will be assigned to a particular vertical space, which can 
then be referred to later.

    \defineblank[.1.][.2.]
    .1. name
    .2. see p 57: \setupblank

If we type for example:

    \defineblank[aroundverbatim][medium]

then aroundverbatim is equal to medium, which can be used, for example around verbatim,
as in:

    \setuptyping
      [before={\blank[aroundverbatim]},
       after={\blank[aroundverbatim]}]

If we want some more whitespacing we only have to change the definition of
aroundverbatim: 

    \defineblank[aroundverbatim][big] 
    
The vertical spacing between two lines can be suppressed with the command:

    \packed

Vertical spacing between more than one line is suppressed by:

    \startpacked[...] ... \stoppacked 
    ... blank

The spacing around ‘packed’ text is automatically corrected. Opposed to this
command is:

     \startunpacked ... \stopunpacked

Skipping more than one vertical space is done with:

    \godown[...] ... dimension

One of the most important lessons to be learned is to avoid using \vskip in
running text. This can interfere with some hidden mechanisms of ConTEXt.
Sometimes TEX is not able to sort out spacing on its own. In such situations
one can insert the next command at the troublesome location.

    \correctwhitespace{...}

Normally one will not need this command, although sometimes when writing
macros, it can be added to make sure that the spacing is okay. Use this kind of
tweaking with care!



# Word Spacing

Default a space is placed after a period that ends a sentence. In some
countries it is custom to stretch the space after a period. Especially
documents typeset in small columns will look better that way. Because this is a
language specific feature. the default depends on the language. One can however
(temporarily) change this spacing.

    \setupspacing[...]
    ...  broad packed

In many cases we combine words and numbers that should not be separated at
linebreaking, for example number 12. These combinations can be connected by a
tight space: number ̃12. Word and number will never be separated at linebreaking
on that spot. A space can be made visible by:

    \space

Undesired spaces can be suppressed by:

    \nospace

When you want to align a row of numbers you can use tight spaces with the width
of a number. Tight spaces are activated by:

    \fixedspaces

After this command the  ̃ (tilde) generates a tight space with the width of a
number.



# Struts




# Hanging Paragraph

If you want to indent paragraphs from the second line on, you can use this bit
from Hans Hagen:

    \definestartstop
      [exdent]
      [before={\startnarrower[left]\setupindenting[-\leftskip,yes]},
       after=\stopnarrower]
    \starttext
    \startexdent
    Thus, I came to the conclusion that the designer of 
    a new system must not only be the implementer and first 
    large--scale user; the designer should also write the fir...
   
    The separation of any of these four components would have hurt 
    TEX significantly. If I had not participated fully in all 
    these activities, literally hundreds of impr...
   
    But a system cannot be successful if it is too strongly influenced 
    by a single person. Once the initial design is complete and 
    fairly robust, the real test begins as...
    \stopexdent
    \stoptext





