'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
const { NitrilePreviewBeamer, NitrilePreviewCreamer } = require('./nitrile-preview-nislide');
const { NitrilePreviewLamper, NitrilePreviewCamper } = require('./nitrile-preview-nifolio');
const { NitrilePreviewBiochem } = require('./nitrile-preview-biochem');
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
    var texfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
    if(path.extname(fname).toLowerCase()==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      if(parser.peek=='folio'){
        if(parser.tex=='context'){
          var translator = new NitrilePreviewCamper(parser);
          var document = translator.to_document();
          await this.write_text_file(fs,texfname,document);
          console.log(`written to ${texfname}`);
        }else if(parser.tex=='pdflatex'||parser.tex=='xelatex'||parser.tex=='lualatex'||parser.tex=='uplatex'){
          var translator = new NitrilePreviewLamper(parser);
          var document = translator.to_document();
          await this.write_text_file(fs,texfname,document);
          console.log(`written to ${texfname}`);
        }
      }else if(parser.peek=='slide'){
        if(parser.tex=='context'){
          var translator = new NitrilePreviewCreamer(parser);
          var document = translator.to_document();
          await this.write_text_file(fs,texfname,document);
          console.log(`written to ${texfname}`);
        }else if(parser.tex=='pdflatex'||parser.tex=='xelatex'||parser.tex=='lualatex'||parser.tex=='uplatex'){
          var translator = new NitrilePreviewBeamer(parser);
          var document = translator.to_document();
          await this.write_text_file(fs,texfname,document);
          console.log(`written to ${texfname}`);
        }
      }else if(parser.peek=='biochem'){
        var translator = new NitrilePreviewBiochem(parser);
        var document = translator.to_document();
        await this.write_text_file(fs,texfname,document);
        console.log(`written to ${texfname}`);
      }else{
        if(parser.tex=='context'){
          var translator = new NitrilePreviewContex(parser);
          var all = [];
          var title = parser.title;
          var style = parser.style;
          var label = parser.label;
          all.push(`% !TEX program = ${parser.program}`);
          all.push(`% !TEX root = ${parser.root}`);
          all.push(`\\startchapter[title={${translator.uncode(style,title)}},reference={${label}},bookmark={${title}}]`);
          parser.blocks.forEach((block) => {
            let latex = translator.translate_block(block);
            all.push('');
            all.push(latex);
          })
          var document = all.join('\n');
          await this.write_text_file(fs,texfname,document);
          console.log(`written to ${texfname}`);
        }else{
          var translator = new NitrilePreviewLatex(parser);
          var all = [];
          var title = parser.title;
          var style = parser.style;
          all.push(`% !TEX program = ${parser.program}`);
          all.push(`% !TEX root = ${parser.root}`);
          all.push(`\\chapter{${translator.uncode(style,title)}}`);
          parser.blocks.forEach((block) => {
            let latex = translator.translate_block(block);
            all.push('');
            all.push(latex);
          })
          var document = all.join('\n');
          await this.write_text_file(fs,texfname,document);
          console.log(`written to ${texfname}`);
        }
      }
    }
    if(path.extname(texfname).toLowerCase()==='.tex'){
      console.log('TEX',texfname);
      var lines = fs.readFileSync(texfname, "utf8");
      var ss = lines.split('\n');
      var s0 = ss[0];
      var s1 = ss[1];
      const re0 = /^%\s*!TEX\s+program\s*=\s*(.*)$/si;
      const re1 = /^%\s*!TEX\s+root\s*=\s*(.*)$/si;
      const v0 = re0.exec(s0);
      const v1 = re1.exec(s1);
      if(v0 && v1){
        texfname = v1[1];
        let progs = v0[1].trim().split('\\\\').map(s=>s.trim());
        for(var program of progs){
          console.log(program);
          program = program.toLowerCase();
          var run = new NitrilePreviewRun();
          var basefname = `${texfname.slice(0,texfname.length-path.extname(texfname).length)}`;
          await run.run_cmd(`${program} ${basefname}`);
        }
      }else if(v0){
        let progs = v0[1].trim().split('\\\\').map(s=>s.trim());
        for(var program of progs){
          console.log(program);
          program = program.toLowerCase();
          var run = new NitrilePreviewRun();
          var basefname = `${texfname.slice(0,texfname.length-path.extname(texfname).length)}`;
          await run.run_cmd(`${program} ${basefname}`);
        }
      }else{
        console.log('no program')
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
