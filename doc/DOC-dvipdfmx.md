--- 
title: The DVIPDFMx Project 
---



# The DVIPDFMx project

The DVIPDFMx project provides an eXtended version of the
dvipdfm, a DVI format to PDF translator developed by Mark A.
Wicks. The primary goal of this project is to support multi-byte
character encodings and large character sets for East Asian
languages by CID-keyed font technology. The secondary goal is to
support as many features as pdfTeX developed by Hàn Thê Thành.
This project is a combined work of the dvipdfm-jpn project by
Shunsaku Hirata and its modified one, dvipdfm-kor by Jin-Hwan
Cho.


# Supporting PNG Files

All graphics format supported in dvipdfm is also supported in
DVIPDFMx with few improvement: A little enhancement on PDF
inclusion (can handle dvipdfm output PDF). Improved PNG support;
alpha channel and tRNS chunk is fully supported. Indexed-color
image is no longer converted to 24-bit RGB color image.
Experimental embedded ICC profile support for JPEG and PNG
format images. Windows BMP format is also supported in DVIPDFMx.

Nearly arbitrary graphics format can be supported with the help
of external program as long as they can be translated into
single page PDF image (like dvipdfm). There are few improvement
on interpreting and translating PostScript code inserted with
\special command or read from MetaPost output PostScript files.
But there are still many limitations and restrictions.


# Embedding PDF pages

New 'page' option is introduced in PDF image inclusion. With the
DVIPDFMx driver for LaTeX graphics package, `dvipdfmx.def`, it is
possible to include a specified page in a PDF file, for example,

    \includegraphics[page=4]{a.pdf}

Moreover, `.xbb` is automatically generated if latex `-shell-escape`
is used. MPS files generated by MetaFun are supported too.
Improved PDF document parsing, and a few bugs were fixed. See
ChangeLog for more details.

# Setup files

DVIPDFMx no longer use dvipdfm as its application name. It means
that DVIPDFMx finds its configuration file at
$TEXMF/dvipdfmx/dvipdfmx.cfg. Moreover, fontmap files with
DVIPS/pdfTeX format are supported too. See dvipdfmx.cfg.


# PGF and TiKZ

2009-04-18 Support PGF Version 2.00 CVS Support PGF and TikZ
version 2.00 CVS since April 18, 2009. The style patch and the
document patch were applied to the main stream. These patches
work with DVIPDFMX-20080607 (included in texlive 2008) or later.


Font and Encoding 

DVIPDFMx supports various encodings in rather
unintuitive way (due to various reasons). For 8-bits encodings,
it supports .enc format glyph encoding file (used by dvips
program) with few extensions undocumented here and remapping of
a set of 8-bit encoded TeX fonts to a single double-byte font
with SFD file support. And it can also support various multibyte
encodings (excluding state-full encoding) by loading PostScript
CMap resource. Not all encodings are supported depending on
format of font to be used.

The following font formats are supported:

1) PostScript 
\\
Type1 PostScript Type1 format font is supported as in
dvipdfm, but they are converted to CFF format (for reducing PDF
file size when compression is enabled) and always embedded as a
font subset. Currently usable only with 8-bit encodings.
Multiple-Master font is not supported yet.

2) OpenType 
\\
All flavours of OpenType fonts is supported: OpenType
font with PostScript outline, TrueType outline, and as CIDFont
in an OpenType wrapper. However, as DVIPDFMx is not a text
manipulation program nor layout program, it supports only a part
of OpenType features; partial support for OpenType GSUB Layout
table just enough for supporting vertical writing, some of
ligatures, small-caps, and so on.

3) TrueType 
\\
Both TrueType and TTC format is supported. There are
several enhancement to dvipdfm including font subsetting. They
may be embedded as a TrueType font or as a CIDFontType 2
CIDFont.


# DVIPDFMx Documents

There are no HTML nor PDF manulas for DVIPDFMx available yet, 
however, as DVIPDFMx is an extended version of dvipdfm, basic 
usage is not different from the original one. Please refer 
The Dvipdfm User's Manual and other documents contained in 
DVIPDFM distribution. The README file may contain brief 
instruction for installation, short description of additional 
resources, and summary of extension made in DVIPDFMx. T
here are few documents related to DVIPDFMx available from 
the doc/ section of the DVIPDFMx project site:

1) "DVIPDFMx, an eXtension of DVIPDFM", PDF version of 
presentation given by Jin-Hwan Cho at the TUG 2003 
conference at Hawaii.

2) "Practical Use of Special Commands in DVIPDFMx", PDF 
version of presentation given by Jin-Hwan Cho at the 
TUG 2005 conference at Wuhan, China.

3) "DVI specials for PDF generation" by Jin-Hwan Cho, 
TUGboat 30 (2009), no. 1.
\\
Abstract. DVIPDFM(x) manages various PDF eﬀects by 
means of DVI specials. Appropriate documentation of DVI 
specials, however, is not easy to ﬁnd, and exact 
functionality is not simple to catch without reading the 
source code of DVI drivers. This paper deals with the DVI 
specials deﬁned in DVIPDFM(x) that are mainly used for 
PDF generation. We discuss the features of those specials 
with some examples, many of which are not documented elsewhere.

4) DVIPDFMx Mailing List and Archives.