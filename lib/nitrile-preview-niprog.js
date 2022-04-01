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
      if(parser.peek=='folio' && parser.tex=='context'){
        var texfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewCamper(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfname,dcument);
        console.log(`written to ${texfname}`);
      }else if(parser.peek=='folio' && (parser.tex=='pdflatex'||parser.tex=='xelatex'||parser.tex=='lualatex')){
        var texfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewLamper(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfname,dcument);
        console.log(`written to ${texfname}`);
      }else if(parser.peek=='slide' && parser.tex=='context'){
        var texfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewCreamer(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfname,dcument);
        console.log(`written to ${texfname}`);
      }else if(parser.peek=='slide' && (parser.tex=='pdflatex'||parser.tex=='xelatex'||parser.tex=='lualatex')){
        var texfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewBeamer(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfname,dcument);
        console.log(`written to ${texfname}`);
      }else{
        var texfname = '';
      }
      ///invoke the external program
      if(texfname){
        console.log('TEX',texfname);
        var lines = fs.readFileSync(texfname, "utf8");
        var ss = lines.split('\n');
        var s0 = ss[0];
        const re = /^%\s*!TEX\s+program\s*=\s*(\w+)/i;
        const v = re.exec(s0);
        if(v){
          let program = v[1];
          console.log(program);
          program = program.toLowerCase();
          var run = new NitrilePreviewRun();
          await run.run_cmd(`${program} ${texfname}`);
        }
      }
    }else if(path.extname(fname)==='.tex'){
      var texfname = fname;
      console.log('TEX',texfname);
      var lines = fs.readFileSync(texfname, "utf8");
      var ss = lines.split('\n');
      var s0 = ss[0];
      const re = /^%\s*!TEX\s+program\s*=\s*(\w+)/i;
      const v = re.exec(s0);
      if(v){
        let program = v[1];
        console.log(program);
        program = program.toLowerCase();
        var run = new NitrilePreviewRun();
        await run.run_cmd(`${program} ${texfname}`);
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
