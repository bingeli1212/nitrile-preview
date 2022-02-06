'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewLamper extends NitrilePreviewLatex {

  constructor(parser) {
    super(parser);
    this.name='lamper';
    this.style = parser.style;
    this.latex_papersize = 'a5paper';
    this.latex_bodyfont = '10pt';
  }
  to_document() {
    this.build_default_idnum_map();
    this.build_default_pagenum_map();
    var only = this.parser.conf_to_list('only');
    console.log('only',only);
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      let src = block.style.src;
      if(only.length){
        if(only.indexOf(block.style.src)>=0){
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
    var data = `\
% !TEX program = PdfLatex 
\\documentclass[${opts.join(',')},9pt]{memoir}
${this.to_preamble_essentials_pdflatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%\\usepackage{titlesec}
%%%\\titleformat{\\chapter}{\\Huge\\bfseries}{\\thechapter}{0.5ex}{\\vspace{-10ex}}[\\vspace{-3ex}]
\\pagestyle{empty}
\\pagenumbering{Roman}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
%%%\\nonzeroparskip
%%%\\setlength{\\parindent}{0pt}
%%%\\linespread{1.15}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
\\maketitle
${toclines.join('\n')}
${texlines.join('\n')}
\\end{document}
    `;
    return data;
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
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\part*{Part ${idnum} ${title}}`);
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,level,style){
    var idnum = style.idnum;
    var pagenum = style.pagenum;
    var title = this.uncode(style,title);
    var o = [];
    o.push(``);
    o.push(`\\clearpage`);
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
    o.push('\\clearpage');
    o.push(`\\setcounter{page}{${pagenum}}`)
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    return o.join('\n');
  }
  samp_to_text(style,samp){
    let ss = samp.map((p) => {
      let x = p.text;
      x = x.trimRight();
      if (x.length==0) {
        x = "~";
      }else{
        x = this.polish_verb(style,x);
        x = `{\\ttfamily{}${x}}`;
      }
      return x;
    });
    var all = [];
    all.push(``);
    all.push(`{`);
    if(this.latex_samp_small){
      all.push(`\\small`);
    }
    all.push(`\\begin{quote}`);
    all.push(`\\begin{verbatim}`);       
    samp.forEach((p) => {
      all.push(p.text);
    });
    all.push(`\\end{verbatim}`);       
    all.push(`\\end{quote}`);
    //all.push(`\\vspace{-2.0ex}`);
    all.push(`}`);
    return all.join('\n')
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
    if(style.wrap){
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
          let subcfontsize = '';
          if(p.style.footsize=='small'){
            subcfontsize = '\\footnotesize'
          }      
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
    if(style.type=='right'){
      text = text.trim();
      return `\\begin{wrapfigure}{r}{0pt}\n\\begin{tabular}{l}${text}\n\\end{tabular}\n\\end{wrapfigure}`;
    }else if(style.type=='left'){
      text = text.trim();
      return `\\begin{wrapfigure}{l}{0pt}\n\\begin{tabular}{l}${text}\n\\end{tabular}\n\\end{wrapfigure}`;
    }else{
      let o = [];
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
  phrase_to_ref(style,cnt){
    //if(cnt){
      //return `\\ref{${cnt}}`;
    //}
    //return "??";
    var label = cnt;
    if(label){
      if(this.idnum_map.hasOwnProperty(label)){
        let {idnum} = this.idnum_map[label]
        let text = `\\underline{${idnum}}`;
        return text;
      }
    }else{
      return "??";
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
      titlelines.push(`\\title{${this.uncode(this.style,mytitle)}}`);
      titlelines.push(`\\author{${this.uncode(this.style,myauthor)}}`);
      titlelines.push(`\\date{${this.uncode(this.style,mydate)}}`);
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
      if(block.sig=='FRNT' && (block.name=='chapter' || block.name=='part')){
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
        title = this.uncode(style,title);
        let idnum = style.idnum;
        let partnum = style.partnum;
        let chapternum = style.chapternum;
        let pagenum = style.pagenum;
        if(block.name=='part'){
          label = label||`part.${partnum}`;
          all.push(`\\item Part ${idnum} ~ ${title}\\dotfill ${pagenum}`);
        }else{
          label = label||`chapter.${chapternum}`;
          all.push(`\\item ~~~~${idnum} ~ ${title}\\dotfill ${pagenum}`)
        }
      });
      all.push(`\\end{list}`);
      all.push(`\\clearpage`);
    }); 
    return all;
  }
}
module.exports = { NitrilePreviewLamper };
