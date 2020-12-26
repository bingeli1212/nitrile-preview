---
title: LATEX begin-end-quote environment
---

To change the left indentation, set the ``\leftmargini`` 
length, and ensure that it is placed inside a begingroup-endgroup
environment to localize the effect.

    \begingroup
    \setlength{\leftmargini}{0.5cm}
    \begin{quote}
    \(\langle a \mid a^{n} = 1 \rangle\)
    \end{quote}
    \endgroup