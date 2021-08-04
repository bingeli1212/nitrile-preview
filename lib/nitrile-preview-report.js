'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewReport extends NitrilePreviewLatex {
  constructor(parser,program) {
    super(parser,program);
    this.name='report';
    this.style = parser.style;
    this.postsetup = [];
    this.postsetup.push(`\\usepackage{array}`);
    this.postsetup.push(`\\usepackage{caption}`);
    this.postsetup.push(`\\usepackage{longtable}`);
    this.postsetup.push(`\\usepackage{parskip}`);
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
    var docclass = (this.count_chapter)?'report':'article';
    return this.to_latex_document(docclass,[],this.postsetup,titlelines,toc,body);
  }
  to_titlelines(){
    var titlelines = [];
    var title = this.parser.conf_to_string('title');
    var author = this.parser.conf_to_string('author');
    titlelines.push(`\\title{${this.uncode(this.style,title)}}`);
    titlelines.push(`\\author{${this.uncode(this.style,author)}}`);
    return titlelines;
  }
}
module.exports = { NitrilePreviewReport }
