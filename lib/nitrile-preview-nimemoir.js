'use babel';
const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
class NitrilePreviewMemoir extends NitrilePreviewLatex {
  constructor(parser,program) {
    super(parser,program);
    this.name='memoir';
    this.style=parser.style;
    this.postsetup = [];
    this.postsetup.push(`\\newsubfloat{figure}% Allow subfloats in figure environment`);
    this.postsetup.push(`\\usepackage{longtable}`);
    this.postsetup.push(`\\usepackage[overlap,CJK]{ruby}`);
    this.postsetup.push(`\\renewcommand\\rubysep{0.0ex}`);
    this.postsetup.push(`\\usepackage{hyperref}`);
    this.postsetup.push(`\\usepackage{memhfixc}`);
    this.postsetup.push(`\\usepackage{geometry}`);
  }
  to_document() {
    var body = [];
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      body.push(text);
    })
    var titlelines = this.to_titlelines(this.parser.blocks);
    var toc = this.conf_to_bool('toc');
    var opts = [];
    if(this.parser.num_chapter==0){
      opts.push('article');
    }
    if(this.conf_to_string('papersize')){
      opts.push(this.conf_to_string('papersize'));
    }
    return this.to_latex_document('memoir',opts,this.postsetup,titlelines,toc,body);
  }
  to_titlelines(){
    var titlelines = [];
    var title = this.parser.conf_to_string('title');
    var author = this.parser.conf_to_string('author');
    titlelines.push(`\\title{${this.smooth(this.style,title)}}`);
    titlelines.push(`\\author{${this.smooth(this.style,author)}}`);
    return titlelines;
  }
  hdgs_to_part(title,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\part{${title}}`);
    return o.join('\n')
  }
  hdgs_to_chapter(title,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\chapter{${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  hdgs_to_section(title,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    if(this.parser.num_chapter){
      o.push(`\\section{${title}}${this.to_latexlabelcmd(label)}`);
    }else{
      o.push(`\\chapter{${title}}${this.to_latexlabelcmd(label)}`);
    }
    return o.join('\n')
  }
  hdgs_to_subsection(title,label,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    if(this.parser.num_chapter){
      o.push(`\\subsection{${title}}${this.to_latexlabelcmd(label)}`);
    }else{
      o.push(`\\section{${title}}${this.to_latexlabelcmd(label)}`);
    }
    return o.join('\n')
  }
  hdgs_to_subsubsection(title,label,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    if(this.parser.num_chapter){
      o.push(`\\subsubsection{${title}}${this.to_latexlabelcmd(label)}`);
    }else{
      o.push(`\\subsection{${title}}${this.to_latexlabelcmd(label)}`);
    }
    return o.join('\n')
  }
}
module.exports = { NitrilePreviewMemoir };
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
const { NitrilePreviewBase } = require('./nitrile-preview-base');
class NitrilePreviewServer extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
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
if(require.main===module){
  var server = new NitrilePreviewServer();
  server.run();
}