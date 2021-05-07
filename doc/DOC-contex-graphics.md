---
title: Graphics
camer.setupbodyfont: linux,11pt
---

# SVG

SVG (Scalable Vector Graphics, a XML based format) can be converted to the PDF
format at runtime by ConTeXt MkIV (LuaTeX), provided you have Inkscape installed
as below.

Supported vector graphics formats of MkII/MKIV are MetaPost (and MetaFun).

There is a workaround, though, using Inkscape to convert SVG to PDF. Inkscape
must be installed and callable (i.e. in your PATH):

    \setupexternalfigures[location=local,directory=.,conversion=pdf] % lowres,prefix=lowres/]
    \starttext
    \externalfigure[svg/sample.svg][frame=on]
    \stoptext

# ConTeXt and Inkscape

Inkscape changed its command line interface in version 1.0. As a consequence, if
you use an old version of ConTeXt and you have Inkscape 1.0 or newer installed,
the conversion from SVG to PDF fails.

Newer versions of ConTeXt (since May 7th, 2020) will detect Inkscape's version
and manage to convert SVG to PDF anyway. But it's a temporary workaround, until
version 1.0 of Inkscape gets widespread, because version detection has a
performance cost.

# LMTX and SVG

LMTX has a direct support for SVG. It uses MetaPost (MetaFun) to process SVG, so
you don't need an external tool like Inkscape.

Using MetaPost to process SVG opens many opportunities to work on it.

Anyway it's a work in progress, not every feature (or inconsistency) of SVG is
supported, though many are. Just try and ask in the mailing list.

You can find more in the docs that come with LMTX distribution, in particular in
svg-lmtx.pdf and luametafun.pdf.
