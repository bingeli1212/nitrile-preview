#!/bin/bash
echo $1
#node -e "console.log($1)"
/usr/local/bin/node -e "const { NitrilePreviewNode } = require ('$HOME/github/nitrile-preview/lib/nitrile-preview-node'); \
    var node = new NitrilePreviewNode(); \
    node.to_contex_doc_async('$1').then(([data,texfile])=>{
        console.log(texfile); \
        node.write_txt_file(texfile, data).then((texfile) => { \
          console.log('saved');
          const exe = require('child_process').spawn('context', ['--interaction=scrollmode', '-halt-on-error', texfile]); \
          exe.stdout.on('data',(out) => process.stderr.write(out)); \
          exe.on('close',(code) => {  }); \
        }); \
    }) \
    "


