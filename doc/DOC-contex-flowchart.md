---
title: The "chart" Module
---

The following document will produce a full A4 page with a flow-chart in it:

    \usemodule[chart]
    \starttext
    \startFLOWchart [cells]
      \startFLOWcell
        \name {first}
        \location {1,1}
        \shape {singledocument}
        \text {not realy a document}
      \stopFLOWcell
    \stopFLOWchart    
    \placefigure
       [here][]
       {}{\FLOWchart[cells]}
    \stoptext

Following is another example that would produce a PDF
page that is just large enough to hold the MetaFun
graphic with 0mm padding between the flowchart graph 
and the edges of the page.

    \usemodule[chart]
    \startFLOWchart [cells]
      \startFLOWcell
        \name {first}
        \location {1,1}
        \shape {singledocument}
        \text {not realy a document}
      \stopFLOWcell
    \stopFLOWchart
    \startTEXpage [offset=0mm]
      \FLOWchart[cells]
    \stopTEXpage  

Following is another example that would create a PDF page
that is just large enough to hold the the content of a PNG file.

    \startMPpage
    draw externalfigure "image-clock.png" ;
    \stopMPpage

The size of the PDF page is determined by the number of
pixels of the image file. For a PNG file of 125 pixels by 125 pixels,
the resulting PDF file is 0.4in by 0.4in. It is also possible to 
scale the PNG file while drawing, producing a larger PDF file. Following
example would have produced an PDF page that is 0.8in by 0.8in.

    \startMPpage
    draw externalfigure "image-clock.png" xscaled 2 yscaled 2;
    \stopMPpage


