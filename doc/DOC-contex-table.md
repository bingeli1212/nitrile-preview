---
title: The startable command
---


# Booktabs

Latex has an excellent package called booktabs for typesetting tables. The main
features of that package is that you can have top, mid, and bottom rules of
different thickness. It is possible to achieve similar effects using tables.
For example, to match the default settings of booktabs (Well almost, this gives
a top and bottom rules of 0.09em while booktabs sets it to 0.08em).

    \setuptables[rulethickness=0.03em]
    \starttable[s0|l|i2l|i2r|]
      \HL[3]
      \NC \Use2[c]{Item}             \NC            \NC \AR
      \DL[2]                         \DC                \DR
      \NC Animal    \NC Description  \NC Price (\$) \NC \AR
      \HL[2]
      \NC Gnat      \NC per gram     \NC 13.65      \NC \AR
      \NC           \NC each         \NC  0.01      \NC \AR
      \NC Gnu       \NC stuffed      \NC 92.50      \NC \AR
      \NC Emu       \NC stuffed      \NC 33.33      \NC \AR
      \NC Armadillo \NC frozen       \NC  8.99      \NC \AR
      \HL[3]
    \stoptable


