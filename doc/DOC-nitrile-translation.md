---
title: NITRILE Translation
---


# The .page directive

This directive is intended to provide a way for a translation
backend to insert a page brreak.


# The .figure directive

This directive is intended to provide a way for a translation
backend to insert a figure.


# The .longtabu directive

This directive is intended to provide a way for a translation
backend to insert a long table.


# The .column directive

This directive is intended to provide a way for a
translation backend to insert a multiple column paragraph.


# The .equation directive

This directive is intended to provide a way for a translation
backend to insert an equation section which may include one or more
equations each with a unique equation number.



# CJK and other fonts

The document may contain Unicode characters that are greater
than 0x7F. Depending on the main font, these characters may
not be shown property by the target translation, such as LATEX
and CONTEX. HTML does not have this problem.

For LATEX, there is a mechanism to detect CJK characters.
NITRILE has a builtin database regarding common CJK characters
and what language it belongs. It should be one 
of the following: JP, CN, TW, and KR. 

The goal is to recognize the continued text that belong to one language,
and thus allow for a font that is corresponding to this language to be 
selected. For example, following are Japanese characters.

    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。

Followng are simplified Chinese.
            
    冰岛由于实行高福利政策，
    所以很多人并没有存钱防老的习惯，
    银行存款占个人全部资产的比例并不多；
    此外，冰岛人投在股票、期货等金融市场上的钱也多是闲钱

Following are traditional Chinese.

    冰島由於實行高福利政策，
    所以很多人並沒有存錢防老的習慣，
    銀行存款占個人全部資產的比例並不多；
    此外，冰島人投在股票、期貨等金融市場上的錢也多是閑錢.

Each of the previous text might need to have a different font
to be shown these characters correctly. This is because
of the Han Unification effort of the Unicode, which places
CJK character in a single block, such that no single font
is to cover all characters. Thus, NITRILE need to be smart
about it, and the builtin database servers help detect
which language it is for a block of CJK characters.

For XELATEX, when a language is detected, such as JP, then it generates
the following, translation.

    {\fontspec{jp}
    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。}

For PDFLATEX, the translation is to become the following.

    \begin{CJK}{UTF8}{min}
    日本では母親がよく家族のために弁当を作っている。
    私の高校時代も給食のシステムがなかったので、
    自分でお昼を持っていかなければならず、
    私の母が弁当を作ってくれていた。}
    \end{CJK}
    
For XELATEX, the fontspec package is to be included.

    \usepackage{fontspec}

This package is always to assume that the input file is 
UTF-8 encoded. It included several commands allowing user
to select font.

    \newfontfamily
    \defaultfontfeatures
    \setromainfont
    \setsansfont
    \setmonofont

Following are some examples.

    \newfontfamily{\jp}[Scale=0.85]{Osaka}
    \newfontfamily{\cn}[Scale=0.85]{Yuanti SC}
    \newfontfamily{\tw}[Scale=0.85]{Yuanti TC}
    \newfontfamily{\kr}[Scale=0.85]{AppleGothic}
    \XeTeXlinebreaklocale "th_TH"
    \defaultfontfeatures{Mapping=tex-text}
    \setromanfont[Mapping=tex-text]{Hoefler Text}
    \setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Gill Sans}
    \setmonofont[Scale=MatchLowercase]{Andale Mono}

The \fontspect{} command is one that allows for expressing
the font name directly. For example ``{\fontspec{jp}日本}``
is specify that a font named "jp" is to be used for showing
the text that is "日本".

NITRILE always uses the font name "jp" for Japanese text, "tw" for
traditional Chinese text, "cn" for simplied Chinese text and "kr"
for Korean text. These names are alias for other real font that
is installed in the target system, which could be different
from system to system. User would have to provide the association
to map from thiese alias to real font name by creating and placing
following ".fontspec" files in the project directory.

    jp.fontspec
    tw.fontspec
    cn.fontspec
    kr.fontspec

Each ".fontspec" file contains information telling XELATEX how to
map from a font named to a font installed on the current system.
Following is the content of a "jp.fontspec" file for MAXOSX.

    \defaultfontfeatures[jp]
    {
      UprightFont=Hiragino Mincho ProN
    }

Following are contents of a "tw.fontspec" file for MAXOSX.

    \defaultfontfeatures[tw]
    {
      UprightFont=Songti TC                
    }

Following are contents of a "cn.fontspec" file for MAXOSX.

    \defaultfontfeatures[cn]
    {
      UprightFont=STSong                
    }

Following are contents of a "kr.fontspec" file for MAXOSX.

    \defaultfontfeatures[kr]
    {
      UprightFont=AppleGothic              
    }

The "UprightFont=" entry points to a font installed by OS or by 
the current distribution of TEXLIVE. For windows these font names
might be different.

For PDFLATEX there is no need to setup these files. Instead, following
packages are to be included. 

    \usepackage[overlap,CJK]{ruby}
    \renewcommand\rubysep{0.0ex};

These package defines the following commands.

    \begin{CJK}{UTF8}{min}...\end{CJK}  % For JP

    \begin{CJK}{UTF8}{gbsn}...\end{CJK} % For CN
 
    \begin{CJK}{UTF8}{bsmi}....\end{CJK} % For TW

    \begin{CJK}{UTF8}{mj}....\end{CJK}  % For KR








    

