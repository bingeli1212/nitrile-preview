---
title: SVG Support 
---


# Embedded Figure

You can put some svg code in a buffer:

    \startbuffer[svgtest] 
    <svg>
      <rect
        x="0" y="0" width="80" height="20"
        fill="blue" stroke="red" stroke-width="3"
        stroke-linejoin="miter"
        transform="rotate(10)"
      /> 
    </svg>
    \stopbuffer

And then reference it using \includesvgbuffer command

    \startcombination[2*1]
      {\framed[offset=overlay]{\includesvgbuffer[svgtest]}} {default} 
      {\framed[offset=overlay]{\includesvgbuffer[svgtest][offset=2bp]}} {some offset}
    \stopcombination



# Mixing in MetaFun

An svg image can be directly included in an MetaFun image. This makes it
possible to enhance (or manipulate) such an image, as in:

    \startMPcode
      draw lmt_svg [
        filename = "mozilla-tiger.svg", 
        origin = true,
      ] rotated 45 slanted .75 ysized 2cm ;
      setbounds currentpicture to 
        boundingbox currentpicture 
        enlarged 1mm ;
      addbackground 
        withcolor "darkgray" ; 
    \stopMPcode

An svg image included this way becomes a regular MetaPost picture, so a
collection of paths. Because MetaPost on the average produces rather compact
output the svg image normally also is efficiently embedded. You don’t need to
worry about loosing quality, because MetaPost is quite accurate and we use so
called ‘double’ number mode anyway.

There is not that much to tell about this command. It translates an svg image to MetaPost operators. We took a few images from a mozilla emoji font:

    \startMPcode
      draw lmt_svg [
        filename = "mozilla-svg-002.svg", 
        height = 2cm,
        width = 8cm,
      ]; 
    \stopMPcode

Because we get pictures, you can mess around with them:

    \startMPcode
      picture p ; p := lmt_svg [ filename = "mozilla-svg-001.svg" ] ; 
      numeric w ; w := bbwidth(p) ;
      draw p ;
      draw p xscaled -1 shifted (2.5*w,0);
      draw p rotatedaround(center p,45) shifted (3.0*w,0) ; 
      draw image (
        for i within p : if filled i :
        draw pathpart i withcolor green ;
        fi endfor ;
      ) shifted (4.5*w,0); 
      draw image (
        for i within p : if filled i :
        fill pathpart i withcolor red withtransparency (1,.25) ;
        fi endfor ;
      ) shifted (6*w,0);
    \stopMPcode


