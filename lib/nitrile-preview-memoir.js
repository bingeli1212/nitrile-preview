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
    return this.to_latex_document('memoir',opts,this.postsetup,titlelines,toc,body);
  }
  to_titlelines(){
    var titlelines = [];
    var title = this.parser.conf_to_string('title');
    var author = this.parser.conf_to_string('author');
    titlelines.push(`\\title{${this.uncode(this.style,title)}}`);
    titlelines.push(`\\author{${this.uncode(this.style,author)}}`);
    return titlelines;
  }
  hdgs_to_part(title,label,partnum,chapternum,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\part{${title}}`);
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,partnum,chapternum,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\chapter{${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  hdgs_to_section(title,label,partnum,chapternum,level,style){
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
  hdgs_to_subsection(title,label,partnum,chapternum,level,style){
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
  hdgs_to_subsubsection(title,label,partnum,chapternum,level,style){
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
