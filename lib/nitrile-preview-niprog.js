'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewBeamer, NitrilePreviewCreamer } = require('./nitrile-preview-nislide');
const { NitrilePreviewLamper, NitrilePreviewCamper } = require('./nitrile-preview-nifolio');
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
      if(parser.peek=='folio' && parser.program=='context'){
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewCamper(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfile,dcument);
        console.log(`written to ${texfile}`);
      }else if(parser.peek=='folio' && (parser.program=='pdflatex'||parser.program=='xelatex'||parser.program=='lualatex')){
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewLamper(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfile,dcument);
        console.log(`written to ${texfile}`);
      }else if(parser.peek=='slide' && parser.program=='context'){
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewCreamer(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfile,dcument);
        console.log(`written to ${texfile}`);
      }else if(parser.peek=='slide' && (parser.program=='pdflatex'||parser.program=='xelatex'||parser.program=='lualatex')){
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewBeamer(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfile,dcument);
        console.log(`written to ${texfile}`);
      }else{
        var texfile = '';
      }
      ///invoke the external program
      if(texfile){
        console.log(parser.program,texfile);
        var run = new NitrilePreviewRun();
        await run.run_cmd(`${parser.program} ${texfile}`);
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
