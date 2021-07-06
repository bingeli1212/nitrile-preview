'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewArticle extends NitrilePreviewLatex {

  constructor(parser,program) {
    super(parser,program);
    this.style = parser.style;
  }
  to_document() {
    var body = [];
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      body.push(text);
    })
    var titlelines = this.to_titlelines(this.parser.blocks);
    return this.to_latex_document('article',[],[],titlelines,body);
  }
  to_titlelines(){
    var titlelines = [];
    var title = this.conf_to_string('title');
    var author = this.conf_to_string('author');
    titlelines.push(`\\title{${this.uncode(this.style,title)}}`);
    titlelines.push(`\\author{${this.uncode(this.style,author)}}`);
    return titlelines;
  }
}
module.exports = { NitrilePreviewArticle }
