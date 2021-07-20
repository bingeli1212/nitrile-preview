---
title: PSTricks Translation
---

- PSTricks cannot run on pdflatex without -enable-write18.

- With -enable-write18 and auto-pst-pdf, pdflatex can make use of PSTricks code
  in the input file. It is done by invoking an external program silently to
  produce a PDF output that corresponds to PSTricks code. Later this PDf output
  will be imported as images. Unfortunately, this mechanism make animation with
  animate package no longer work. Overlaying PSTricks objects on non-EPS images
  is totally impossible. Cross referencing in PSTricks code will be broken.

