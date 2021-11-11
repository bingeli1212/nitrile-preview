const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewEpub   } = require('./nitrile-preview-epub');
const path = require('path');
const utils = require('./nitrile-preview-utils');
const JSZip = require('jszip');
const { argv } = require('process');

class NitrilePreviewServer {
  constructor() {
  }
  async run(){
    console.log('argv=',argv);
    var fname = argv[2];    
    if(!fname){
        throw "File name is empty"
    }else if(path.extname(fname)==='.epub'){
        console.log(`${epubfname} is already an EPUB file`); 
    }else if(path.extname(fname)==='.md'){
        var parser = new NitrilePreviewParser();
        await parser.read_file_async(fname)
        await parser.read_import_async();
        if(parser.conf_to_string('root')){
            fname = parser.conf_to_string('root');
            parser = new NitrilePreviewParser();
            await parser.read_file_async(fname);
            await parser.read_import_async();
        }
        var epubfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.epub`;
        var translator = new NitrilePreviewEpub(parser);
        var this_map = await translator.to_document_async();
        var this_zip = new JSZip();
        for(let [fname,fdata] of this_map.entries()){
          this_zip.file(fname,fdata);
        }
        var zipdata = await this_zip.generateAsync({ type: 'nodebuffer' });
        await utils.write_text_file_async(epubfname,zipdata);
        console.log(`${epubfname} created or updated`); 
        
    }else{
        throw "File does not end with .md"
    }
  }
}
var server = new NitrilePreviewServer();
server.run(()=>{});
