'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewSlide } = require('./nitrile-preview-nislide');
const { NitrilePreviewFolio } = require('./nitrile-preview-nifolio');
const { NitrilePreviewRun } = require('./nitrile-preview-run');
const fs = require('fs');
const path = require('path');
const process = require('process');

////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    var fname = process.argv[2];    
    if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      if(parser.peek=='folio'){
        var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
        var translator = new NitrilePreviewFolio(parser);
        var xhtml = translator.to_xhtml();
        await this.write_text_file(fs,xhtmlfile,xhtml);
        console.log(`written to ${xhtmlfile}`);
      }else if(parser.peek=='slide'){
        var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
        var translator = new NitrilePreviewSlide(parser);
        var xhtml = translator.to_xhtml();
        await this.write_text_file(fs,xhtmlfile,xhtml);
        console.log(`written to ${xhtmlfile}`);
      }else{
        var xhtmlfile = '';
      }
    }
  }
}
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
if(require.main===module){
  var server = new Server();
  server.run()
}
