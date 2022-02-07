---
title: XeLaTeX
---


# Following is a sample LATEX document for XeLaTeX

    %!TeX program = XeLaTeX
    \documentclass[varwidth,border=6pt]{standalone}
    \usepackage{xeCJK}
    \setCJKmainfont{Noto Sans CJK SC}
    \usepackage[overlap,CJK]{ruby}
    \usepackage{setspace}
    \usepackage{xpinyin}
    %
    % Start Editing Document
    \begin{document}
    \Large
    %\begin{CJK}{UTF8}{bkai}
    \begin{spacing}{2}
    \ruby{帀}{Za}
    \end{spacing}
    %\end{CJK}
    %
    %\begin{CJK}{UTF8}{bkai}
    \begin{spacing}{2}
    \ruby{體}{Ti}
    \end{spacing}
    %\end{CJK}
    %
    \end{document}


# Following are found at stackexchange

\usepackage[utf8]{inputenc} with XeLaTeX is wrong, because XeTeX directly reads
UTF-8 and that package confuses the way it interprets the characters.

Files input to Xe(La)TeX should always be UTF-8 encoded (UTF-16 and UTF-32 work
too, but UTF-8 seems preferable). There is the possibility to specify a
different input encoding, but this is for legacy documents and is not what you
want.

If you want a document that typesets both with pdflatex and xelatex, then you
can try

    \documentclass{article}
    \usepackage{ifxetex}
    \ifxetex
      \usepackage{fontspec}
    \else
      \usepackage[T1]{fontenc}
      \usepackage[utf8]{inputenc}
      \usepackage{lmodern}
    \fi
    \begin{document}
    áéíóúñ
    \end{document}

and save the file as UTF-8. 

You can use babel in both cases, since Spanish is based on the Latin alphabet;
however, switching to Polyglossia for XeLaTeX may be better:

    \documentclass{article}
    \usepackage{ifxetex}
    \ifxetex
      \usepackage{fontspec}
      \usepackage{polyglossia}
      \setmainlanguage{spanish}
    \else
      \usepackage[T1]{fontenc}
      \usepackage[utf8]{inputenc}
      \usepackage[spanish]{babel}
      \usepackage{lmodern}
    \fi
    \begin{document}
    áéíóúñ
    \end{document}

Note that fontspec uses by default the OpenType version of the Latin Modern fonts.



# Imcompatible packages

XeLaTEX is not compatible with following packages and should 
not have them be included with a TEX file.

    \usepackage{latexsym}
    \usepackage{amsfonts}
    \usepackage{amssymb}
    \usepackage{txfonts}
    \usepackage{pxfonts}
    \usepackage{pifont}
    \usepackage{bbold}




# Font switching commands

    \setmainfont
    \setsansfont
    \setmonofont
    \newfontfamily
    \newfontface
    \fontspec


# The fontspec file

Following are the fontspec files used on Mac OS X

For "cn.fontspec"

    \defaultfontfeatures[cn]
    {
      UprightFont=STSong                
    }

For "jp.fontspec"

    \defaultfontfeatures[jp]
    {
      UprightFont=Hiragino Mincho ProN
    }

For "kr.fontspec"

    \defaultfontfeatures[kr]
    {
      UprightFont=AppleGothic              
    }

For "tw.fontspec"

    \defaultfontfeatures[tw]
    {
      UprightFont=Songti TC                
    }






