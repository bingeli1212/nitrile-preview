'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewArticle extends NitrilePreviewLatex {

  constructor(parser,program) {
    super(parser,program);
  }
  to_document() {
    var body = [];
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      body.push(text);
    })
    var titlelines = this.to_titlelines(this.parser.blocks);
    return this.to_latex_document('article',[],titlelines,body);
  }
  to_tops_section(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'FRNT'){
        top.push(block);
      }
      if (sig == 'HDGS' && hdgn == 1) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }
    }
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_tops_subsection(o);
      }
      return o;
    })
    return top;
  }
  to_tops_subsection(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'HDGS' && hdgn == 2) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_tops_subsubsection(o);
      }
      return o;
    })
    return top;
  }
  to_tops_subsubsection(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'HDGS' && hdgn >= 3) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    return top;
  }
  to_article(top) {
    let all = [];
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        let data = this.to_article_section(o);
        all.push(data);
      } else {
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_article_section(top) {
    let my = top.shift();
    let all = [];
    all.push(`\\section{${this.uncode(my.title)}}{\\label{${my.label}}}`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.to_article_subsection(o);
        all.push(data);
      } else {
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_article_subsection(top) {
    let my = top.shift();
    let all = [];
    all.push(`\\subsection{${this.uncode(my.title)}}`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        var data = this.to_article_subsubsection(o);
        all.push(data);
      }else{
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_article_subsubsection(top) {
    let my = top.shift();
    let all = [];
    all.push(`\\subsubsection{${this.uncode(my.title)}}`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_titlelines(blocks){
    var titlelines = [];
    var title = this.conf_to_string('title');
    var author = this.conf_to_string('author');
    titlelines.push(`\\title{${this.uncode(title)}}`);
    titlelines.push(`\\author{${this.uncode(author)}}`);
    return titlelines;
  }
}
module.exports = { NitrilePreviewArticle }
