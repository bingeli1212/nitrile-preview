'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewLamper extends NitrilePreviewLatex {

  constructor(parser) {
    super(parser);
    this.name='lamper';
    this.style = parser.style;
    this.only = this.parser.conf_to_list('only');
    this.latex_figure_nofloat = 1;
  }
  to_document() {
    this.build_default_idnum_map();
    this.build_default_pagenum_map();
    console.log('only',this.only);
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      if(this.only.length){
        if(this.only.indexOf(block.style.note)>=0){
          block.latex = text;
        }
      }else{
        block.latex = text;
      }
    })
    var texlines = this.parser.blocks.map(x => x.latex);
    var titlelines = this.to_titlelines();
    var toclines = this.to_toclines();
    var opts = [];
    opts.push('a5paper');
    if(this.program=='lualatex'){
      return              `\
% !TEX program = LuaLatex 
\\documentclass[${opts.join(',')},${this.bodyfontsize}pt]{memoir}
${this.to_preamble_essentials_lualatex()}
\\renewcommand{\\baselinestretch}{0.95}
\\linespread{0.5}\\selectfont
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{
 a5paper,
 left=15mm,
 top=20mm,
 bottom=10mm,
}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage[overlap,CJK]{ruby}
\\renewcommand\\rubysep{0.0ex}
${titlelines.join('\n')}
\\begin{document}
\\begin{titlingpage}
\\pagestyle{empty}
\\maketitle
\\begin{abstract}
\\end{abstract}
\\end{titlingpage}
\\setcounter{page}{1}
\\pagenumbering*{roman}
${toclines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${texlines.join('\n')}
\\end{document}
`;
    }else if(this.program=='xelatex'){
      var data_xelatex = `\
% !TEX program = XeLatex 
\\documentclass[${opts.join(',')},10pt]{memoir}
${this.to_preamble_essentials_xelatex()}
\\XeTeXlinebreaklocale "zh"
\\XeTeXlinebreakskip = 0pt plus 1pt
\\renewcommand{\\baselinestretch}{0.95}
\\linespread{0.8}\\selectfont
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{
 a5paper,
 left=15mm,
 top=20mm,
 bottom=10mm,
}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
\\begin{titlingpage}
\\pagestyle{empty}
\\maketitle
\\begin{abstract}
\\end{abstract}
\\end{titlingpage}
\\setcounter{page}{1}
\\pagenumbering*{roman}
${toclines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${texlines.join('\n')}
\\end{document}
`;
      return data_xelatex;
    }else{
      var data_pdflatex = `\
% !TEX program = PdfLatex 
\\documentclass[${opts.join(',')},9pt]{memoir}
${this.to_preamble_essentials_pdflatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{
 a5paper,
 left=15mm,
 top=20mm,
 bottom=10mm,
}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
\\begin{titlingpage}
\\pagestyle{empty}
\\maketitle
\\begin{abstract}
\\end{abstract}
\\end{titlingpage}
\\setcounter{page}{1}
\\pagenumbering*{roman}
${toclines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${texlines.join('\n')}
\\end{document}
`;
      return data_pdflatex;      
    }
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  to_titlelines(){
    var titlelines = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    if (mytitle) {
      titlelines.push(`\\title{${this.smooth(this.style,mytitle)}}`);
      titlelines.push(`\\author{${this.smooth(this.style,myauthor)}}`);
      titlelines.push(`\\date{${this.smooth(this.style,mydate)}}`);
    }
    return titlelines;
  }
  to_toclines(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.sig=='CHAP' || block.sig=='PART' || (block.sig=='FRNT' && block.style.name=='chapter')){
        pp.push(block); 
        if(pp.length==38){
          pp = [];
          o.push(pp);
        }
      }
    }
    ///
    ///remove empty pp
    ///
    o = o.filter(pp => pp.length);
    var all = [];
    o.forEach((pp) => {
      all.push(``);
      all.push(`Table Of Contents`);
      all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);
      pp.forEach((p) => {
        let block = p;
        let {label,title,style} = block;
        title = this.smooth(style,title);
        let idnum = style.idnum;
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.sig=='PART'){
          label = label||`part.${partnum}`;
          all.push(`\\item Part ${idnum} ~ ${title}\\dotfill ${pagenum}`);
        }else{
          label = label||`chapter.${chapnum}`;
          all.push(`\\item ~~~~${idnum} ~ ${title}\\dotfill ${pagenum}`)
        }
      });
      all.push(`\\end{list}`);
      all.push(`\\newpage`);
    }); 
    return all;
  }
}
module.exports = { NitrilePreviewLamper };
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewRun } = require('./nitrile-preview-run');
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    var fname = process.argv[2];    
    var oname = process.argv[3];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.tex'){
      throw "File name ends with .tex"
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
      var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
      if(oname){
        texfile = oname;
      }
      var translator = new NitrilePreviewLamper(parser);
      var data = translator.to_document();
      await this.write_text_file(fs,texfile,data);
      console.log(`written to ${texfile}`);
    }else if(path.extname(fname)===''){
      var parser = new NitrilePreviewParser();
      var mdfname = fname + ".md";
      var texfname = fname + ".tex";
      await parser.read_file_async(mdfname);
      await parser.read_import_async();
      var translator = new NitrilePreviewLamper(parser);
      var data = translator.to_document();
      await this.write_text_file(fs,texfname,data);
      console.log(`written to ${texfname}`);
      var run = new NitrilePreviewRun();
      await run.run_texfname(texfname);
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new Server();
  server.run()
}
