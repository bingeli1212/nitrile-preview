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
