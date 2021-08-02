#!/bin/bash
echo $1
#node -e "console.log($1)"
/usr/local/bin/node -e "const { NitrilePreviewNode } = require ('$HOME/github/nitrile-preview/lib/nitrile-preview-node'); \
    var node = new NitrilePreviewNode(); \
    node.to_latex_doc_async('$1').then(([data,texfile])=>{
        console.log(texfile); \
        node.write_txt_file(texfile, data).then((txtfile) => { \
          console.log('saved'); 
          const exe = require('child_process').spawn('pdflatex', ['--interaction=scrollmode', '-halt-on-error', txtfile]); \
          exe.stdout.on('data',(out) => process.stderr.write(out)); \
          exe.on('close',(code) => {  }); \
        }); \
    }) \
    "


