const { NitrilePreviewNode } = require('../lib/nitrile-preview-node');

var node = new NitrilePreviewNode();
node.to_doc_symbols_async().then(console.log('done!'))
setTimeout(function(){},1000);
  
