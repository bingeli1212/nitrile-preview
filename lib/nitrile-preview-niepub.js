const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewEpub   } = require('./nitrile-preview-epub');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const process = require('process');

class NitrilePreviewServer extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    var fname = process.argv[2];    
    var oname = process.argv[3];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.epub'){
    }else if(path.extname(fname)==='.md'){
      console.log('reading '+fname);
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      console.log('translating');
      var translator = new NitrilePreviewEpub(parser);
      console.log('generating EPUB contents')
      var this_map = await translator.to_document_async();
      console.log('packing EPUB into a archive')
      var this_zip = new JSZip();
      for(let [fname,fdata] of this_map.entries()){
        this_zip.file(fname,fdata);
      }
      var zipdata = await this_zip.generateAsync({ type: 'nodebuffer' });
      var epubfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.epub`;
      if(oname){
        epubfname = oname;
      }
      console.log('saving as '+epubfname);
      fs.writeFileSync(epubfname,zipdata);
      console.log(`written to ${epubfname}`); 
    }else{
      throw "File does not end with .md"
    }
  }
}
var server = new NitrilePreviewServer();
server.run();
