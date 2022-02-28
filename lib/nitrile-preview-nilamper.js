'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewLamper extends NitrilePreviewLatex {

  constructor(parser) {
    super(parser);
    this.name='lamper';
    this.style = parser.style;
    this.latex_papersize = 'a5paper';
    this.latex_bodyfont = '10pt';
    this.only = this.parser.conf_to_list('only');
    this.latex = this.parser.conf_to_string('latex');
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
    if(this.latex=='xelatex'){
      var data_xelatex = `\
% !TEX program = XeLatex 
\\documentclass[${opts.join(',')},10pt]{memoir}
${this.to_preamble_essentials_xelatex()}
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
\\renewcommand{\\baselinestretch}{0.95}
\\setmainfont[Ligatures=TeX]{Libertinus Serif}
\\XeTeXlinebreaklocale "zh"
\\XeTeXlinebreakskip = 0pt plus 1pt
\\linespread{0.8}\\selectfont
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
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  hdgs_to_part(title,label,level,style){
    var idnum = style.idnum;
    var pagenum = style.pagenum;
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\newpage`);
    o.push(`\\setcounter{page}{${pagenum}}`);
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    o.push(`\\vspace{20mm}`);
    o.push(`\\begin{flushleft}`);
    o.push(`\\large Part ${idnum}`);
    o.push(`\\\\`);
    o.push(`\\Huge ${title}`);
    o.push(`\\end{flushleft}`);
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,level,style){
    var idnum = style.idnum;
    var pagenum = style.pagenum;
    var title = this.uncode(style,title);
    var o = [];
    o.push(``);
    o.push(`\\newpage`);
    o.push(`\\setcounter{page}{${pagenum}}`);
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    o.push(`\\begin{flushleft}`);
    o.push(`\\Huge ${idnum} ~ ${title}`);
    o.push(`\\end{flushleft}`);
    return o.join('\n')
  }
  hdgs_to_section(title,label,level,style){
    var idnum = style.idnum;
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\section*{${idnum} ${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  hdgs_to_subsection(title,label,level,style){
    var idnum = style.idnum;
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\subsection*{${idnum} ${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  hdgs_to_subsubsection(title,label,level,style){
    var idnum = style.idnum;
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\subsubsection*{${idnum} ${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  float_to_page(title,label,style,ss,ssi){
    var pagenum = style.pagenum;
    var o = [];
    o.push('');
    o.push(`\\newpage`);
    o.push(`\\setcounter{page}{${pagenum}}`)
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    return o.join('\n');
  }
  float_to_figure(title,label,style,ss,ssi){
    var itms = this.ss_to_figure_itms(style,ss,ssi);
    var title = this.uncode(style,title).trim();
    var s_align = '\\centering'
    var idnum = style.idnum;
    if(this.latex_caption_align=='l'){
      var s_align = '\\raggedleft';
    }else if(this.latex_caption_align=='r'){
      var s_align = '\\raggedright';
    }
    let s_fontsize = '';
    if(this.latex_caption_small){
      s_fontsize = '\\footnotesize'
    }  
    var all = [];
    all.push('');
    if(!style.partition){
      let o = [];
      itms.forEach((p) => {
        if(p.type=='bundle'){
          let subc = p.subc;
          o.push(`\\begin{threeparttable} ${p.img} \\begin{tablenotes}[flushleft] \\item ${s_align} ${s_fontsize} ${subc} \\end{tablenotes} \\end{threeparttable}`);
        }else if(p.type=='\\\\'){
          o.push('\\\\');
        }
      })
      var text = o.join('\n')
    }
    else{
      let onerow = [];
      let o = [];
      itms.forEach((p) => {
        if(p.type=='bundle'){
          let subc = p.subc;     
          onerow.push(`\\begin{threeparttable} ${p.img} \\begin{tablenotes}[flushleft] \\item ${s_align} ${s_fontsize} ${subc} \\end{tablenotes} \\end{threeparttable}`);
        }else if(p.type=='\\\\'){
          let n = onerow.length;
          o.push(onerow.join('~%\n'));
          o.push('\\\\');
          onerow = [];
        }
      })
      if(onerow.length){
        let n = onerow.length;
        o.push(onerow.join('~%\n'));
        o.push('\\\\');
      }
      var text = o.join('\n');
    }
    ///
    ///Put them together
    ///
    if(style.wrapfig=='right'){
      text = text.trim();
      return `\\begin{wrapfigure}{r}{0pt}\n\\begin{tabular}{l}${text}\n\\end{tabular}\n\\end{wrapfigure}`;
    }else if(style.wrapfig=='left'){
      text = text.trim();
      return `\\begin{wrapfigure}{l}{0pt}\n\\begin{tabular}{l}${text}\n\\end{tabular}\n\\end{wrapfigure}`;
    }else{
      let o = [];
      o.push(``);
      o.push(`\\begin{center}`);
      o.push(`${s_align}`);    
      if(this.latex_caption_small){
        o.push(`{\\footnotesize {Figure ${idnum}} : ${title}}\\vspace{0.5ex}\\break`);
      }else{
        o.push(`{{Figure ${idnum}} : ${title}}\\vspace{0.5ex}\\break`);
      }
      if(label){
        o.push(`\\label{${label}}`);
      }
      o.push(text);
      o.push(`\\end{center}`);
      return o.join('\n');
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
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new NitrilePreviewServer();
  server.run()
}
