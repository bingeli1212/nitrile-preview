---
title: NITRILE Translation
---


# The .page directive

This directive is intended to provide a way for a translation
backend to insert a page brreak. It should not need to be followed
by anything.

    .page


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

# The .vspace directive

This directive is intended to add a vertical space between
paragraphs.  The text following this diretive ID should
be a number expressing the total number of lines. Following
is to insert a vertical space equilvalent to 10em.

    .vspace
    10


# The phrases

- fbox{100} : creating a frame box of width equal to 100mm.
- hrule{5} : creating a hrule of width equial to 5em.
- colorbutton{red} : creating a color button colored by color "red".


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


# Specify addition fonts

For CONTEX/XELATEX translation there could be many Unicode charactesr
to be included with a document that do not necessarily have a corresponding
glyphs in the main font. Thus, these character needs to be specially
demarcated with the font with which it is suitable to be used to show
the glyph. 

For CONTEX it is 

    \switchtobodyfont[unifont]{...}

For XELATEX it is

    {\fontspec{unifont}...}

And "unifont" is assumed to be the name of the font.

The configuration for a MD document is the following.

    ---
    title: My Doc
    fonts: font0/unifont/0x2700
           font1/unifont/0x25A0
    ---

Previous syntax allows for two Unicode blocks to be configured
so that all characters within that block are to be shown
with the glyph provided by font "unifont".  The first element
is a keyword that should be one of the following between
font0-font9. The second one is the font name to be set for all
the text of it. The third one is the start range of the unicode block.

Thus, the text that is the following

    日本語Hello: ✍✎□▢

Would have been translated into CONTEX as

    {\switchtobodyfont[jp]日本語}Hello: {\switchtobodyfont[unifont]✍✎}{\switchtobodyfont[unifont]□▢}

Note that CJK characters are automatically recognized for their fonts
without need for any setup.


    

