---
title: LaTeX2e
---

# LaTeX2e

LaTeX is a synonym for LaTeX2e, which itself is the successor of LaTeX
2.09. LaTeX3 has been in development for nearly 20 years and shall be
the successor of LaTeX2e. The main basic packages for LaTeX3 can be
used but are still in an experimental state. I suppose that a lot of
LaTeX (which is actually LaTeX2e) users will be retired if LaTeX3
should ever be officially released ... ;-)

All TeX distributions support LaTeX2e which is, of course, not a
program but a macro package. The program is tex, pdftex, luatex, or
xetex. They use the macro package latex.ltx when called as latex,
pdflatex, lualatex, or xelatex.

At this point in time the plan is to evolve LaTeX incrementally rather
than trying to switch to a new code base all at once. See the talk by
Frank Mittelbach:
&uri{https://www.youtube.com/watch?v=zNci4lcb8Vo&feature=youtu.be}

So while the goals of the LaTeX3 project are coming to fruition, there
are no plans currently for changing the name from LaTeX2e to LaTeX3.

# LaTeX 2.09 and LaTeX2e

The following information is excerpted from "A Document Preparation
System: LaTeX" by Leslie Lamport, 2nd edition and/or "LaTeX2e for
authors", by the LaTeX3 Project Team, June 1994.

LaTex2e was produced in an attempt to reconcile the various, sometimes
incompatble, "flavors" of LaTeX which were developing. Some of these
included the New Font Selection Scheme (NFSS), SLITeX (for slides),
AASTeX (the American Astronomical Society macros), etc. The major
change to LaTeX2e is the method for trying to make the use of add-on
packages more uniform by the introduction of "classes" and "packages."
Most of the new commands are the "initial" commands, i.e., those which
can appear only before the \documentclass command.

A few standard LaTeX commands have been modified and a few new
commands added, notably:

- \newcommand (and related) commands, which now allow for an optional argument in newly defined commands
- \ensuremath

# Document Styles and Style Options

In LaTeX2e, documents begin with a \documentclass command. This
replaces the LaTeX 2.09 \documentstyle command. The \usepackage
command has been added and is used in conjunction with \documentclass.

LaTeX2e still understands the old \documentstyle command; if it is
encountered, LaTex2e enters compatibility mode in which most 2.09
input files should still be processed properly.

# Type Styles and Sizes

LaTeX 2.09 commands for changing type style, for example, \tt, still
work similarly in LaTeX2e. The major difference is that \sc and \sl
can no longer be used in math mode (except when LaTeX2e is in
compatibility mode, see above).

However, a new set of commands have been added to allow separate (and
independent) specification of

- Shape
- Series
- Family

These can be combined to form a wide variety of type styles. If a
style you specify is not available on your computer, LaTeX2e produce a
warning message and will substitute a style it thinks is similar.

