node -e "const { NitrilePreviewNode } = require ('/Users/james/Documents/github/nitrile-preview/lib/nitrile-preview-node'); var node = new NitrilePreviewNode(); node.to_slide_doc_async('%1').then(([data,fname])=>{ console.log(fname); node.write_txt_file(fname,data).then((txtfile)=>{ })     }); "