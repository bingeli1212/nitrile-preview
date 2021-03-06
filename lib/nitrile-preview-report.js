'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewReport extends NitrilePreviewLatex {

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
    return this.to_latex_document('report',[],[],titlelines,body);
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
