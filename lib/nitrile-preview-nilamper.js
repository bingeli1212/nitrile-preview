'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewLamper extends NitrilePreviewLatex {

  constructor(parser) {
    super(parser);
    this.name='lamper';
    this.style = parser.style;
    this.latex_figure_nofloat = 1;
    this.titlepage = parser.conf_to_int('titlepage');
    this.tocpage = parser.conf_to_int('tocpage');
  }
  to_document() {
    this.build_default_pagenum_map();
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      block.latex = text;
    })
    var translationlines = this.parser.blocks.map(x => x.latex);
    var titlelines = this.to_titlelines();
    var tocpagelines = this.to_tocpagelines();
    var titlepagelines = this.to_titlepagelines();
    if(!this.titlepage){
      titlepagelines = [];
    }
    if(!this.tocpage){
      tocpagelines = [];
    }
    var opts = [];
    opts.push('a5paper');
    if(this.program=='lualatex'){
      return              `\
% !TEX program = LuaLatex 
\\documentclass[${opts.join(',')},${this.bodyfontsize}pt]{memoir}
${this.to_preamble_essentials_lualatex()}
\\renewcommand{\\baselinestretch}{0.95}
\\linespread{0.8}\\selectfont
\\usepackage[overlap,CJK]{ruby}
\\renewcommand\\rubysep{0.0ex}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }else if(this.program=='xelatex'){
      return             `\
% !TEX program = XeLatex 
\\documentclass[${opts.join(',')},10pt]{memoir}
${this.to_preamble_essentials_xelatex()}
\\XeTeXlinebreaklocale "zh"
\\XeTeXlinebreakskip = 0pt plus 1pt
\\renewcommand{\\baselinestretch}{0.95}
\\linespread{0.8}\\selectfont
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }else{
      return              `\
% !TEX program = PdfLatex 
\\documentclass[${opts.join(',')},9pt]{memoir}
${this.to_preamble_essentials_pdflatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
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
    if (1) {
      titlelines.push(`\\title{${this.smooth(this.style,mytitle)}}`);
      titlelines.push(`\\author{${this.smooth(this.style,myauthor)}}`);
      titlelines.push(`\\date{${this.smooth(this.style,mydate)}}`);
    }
    return titlelines;
  }
  to_tocpagelines(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.style.name=='chapter' || block.style.name=='part'){
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
    all.push(`\\pagenumbering*{roman}`);
    all.push(`\\begin{titlingpage}`);
    o.forEach((pp) => {
      all.push(``);
      all.push(`Table Of Contents`);
      all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);
      pp.forEach((p) => {
        let block = p;
        let {label,title,style} = block;
        title = this.smooth(style,title);
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.style.name=='part'){
          label = label||`part.${partnum}`;
          all.push(`\\item Part ${partnum} ~ ${title}\\dotfill ${pagenum}`);
        }else{
          label = label||`chapter.${chapnum}`;
          all.push(`\\item ~~~~${chapnum} ~ ${title}\\dotfill ${pagenum}`)
        }
      });
      all.push(`\\end{list}`);
      all.push(`\\newpage`);
    }); 
    return all;
  }
  to_titlepagelines(){
    var all = [];
    all.push(`\\setcounter{page}{1}`);
    all.push(`\\pagestyle{empty}`);
    all.push(`\\maketitle`);
    all.push(`\\begin{abstract}`);
    all.push(`\\end{abstract}`);
    all.push(`\\end{titlingpage}`);
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
