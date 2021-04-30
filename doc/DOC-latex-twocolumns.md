---
title: Display Contents In Two-Column Layout
---





# Using two minipages:

Another method is to use "minipage" environment.
Each minipage is required to have a width, and the vertical
alignment of its contents can be configured so that it can be
aligned to the top, middle, or bottom of the minipage.

    \begin{minipage}[position]{width}
      text
    \end{minipage}


# Use "multicol" package

Load the multicol package, like this \usepackage{multicol}. Then use:

    \begin{multicols}{2}
    Column 1
    \columnbreak
    Column 2
    \end{multicols}

If you omit the \columnbreak, the columns will balance automatically.
