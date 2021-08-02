#!/bin/bash
echo $1
#node -e "console.log($1)"
/usr/local/bin/node -e "const { NitrilePreviewNode } = require ('$HOME/github/nitrile-preview/lib/nitrile-preview-node'); \
    var node = new NitrilePreviewNode(); \
    node.to_epub_doc_async('$1').then(([data,epubfname])=>{ \
        console.log(epubfname); \
        node.write_txt_file(epubfname, data).then((epubfname) => { \
          console.log('saved'); 
        }); \
    }) \
    "


