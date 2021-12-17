const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewPage } = require('./nitrile-preview-page');
const path = require('path');
const utils = require('./nitrile-preview-utils');
const { argv } = require('process');

class NitrilePreviewServer {
  constructor() {
  }
  async run(){
    console.log('argv=',argv);
    var fname = argv[2];    
    if(!fname){
        throw "File name is empty"
    }else if(path.extname(fname)==='.md'){
        var parser = new NitrilePreviewParser();
        await parser.read_file_async(fname)
        await parser.read_import_async();
        var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
        var translator = new NitrilePreviewPage(parser);
        var data = translator.to_document();//xhtml
        await utils.write_text_file_async(xhtmlfile,data);
        console.log(`written to ${xhtmlfile}`);
    }else{
        throw "File does not end with .md"
    }
  }
}
var server = new NitrilePreviewServer();
server.run(()=>{});
