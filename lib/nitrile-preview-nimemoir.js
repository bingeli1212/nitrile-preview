const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewMemoir } = require('./nitrile-preview-memoir');
const fs = require('fs');
const path = require('path');
const process = require('process');

class NitrilePreviewServer extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    var fname = process.argv[2];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.tex'){
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
      var translator = new NitrilePreviewMemoir(parser);
      var data = translator.to_document();
      await this.write_text_file(fs,texfile,data);
      console.log(`written to ${texfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
}
var server = new NitrilePreviewServer();
server.run().catch((err)=>{
  console.error(err.toString())
  process.exitCode = -1;
});
