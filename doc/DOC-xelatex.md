---
title: The xelatex Translation
---


# Specifying CJK Fonts

On a MaxOS system, the following settings can be specified for the
"xelatex.post" key, which would place these lines directly into the translated
TEX file after all other packages inclusions.

    ---
    xelatex.post: \newfontfamily{\jp}[Scale=0.85]{Osaka}
                  \newfontfamily{\cn}[Scale=0.85]{Yuanti SC}
                  \newfontfamily{\tw}[Scale=0.85]{Yuanti TC}
                  \newfontfamily{\kr}[Scale=0.85]{AppleGothic}
                  \XeTeXlinebreaklocale "th_TH"
                  \defaultfontfeatures{Mapping=tex-text}
                  \setromanfont[Mapping=tex-text]{Hoefler Text}
                  \setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Gill Sans}
                  \setmonofont[Scale=MatchLowercase]{Andale Mono}
    ---




