#!/bin/bash
echo $1
#node -e "console.log($1)"
/usr/local/bin/node -e "const { NitrilePreviewNode } = require ('$HOME/github/nitrile-preview/lib/nitrile-preview-node'); \
    var node = new NitrilePreviewNode(); \
    node.to_powerdot_doc_async('$1').then((data) => { \
      var texfile = node.to_filename('$1','tex'); \
      node.write_txt_file(texfile, data).then((texfile) => { \
        console.log(texfile); \
        node.run_program('latex',[texfile]).then((code) => { \
          var dvifile = node.to_filename(texfile,'dvi'); \
          console.log(dvifile); \
          node.run_program('dvips',[dvifile]).then((code) => { \
            var psfile = node.to_filename(texfile,'ps'); \
            console.log(psfile); \
          }); \
        }); \
      }); \
    }) \
    "


