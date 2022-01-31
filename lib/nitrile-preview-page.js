'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');

class NitrilePreviewPage extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
  }
  to_peek_document() {
    this.build_default_idnum_map();
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var html = all.join('\n');
    return html;
  }
  to_data() {
    this.build_default_idnum_map();
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var body = all.join('\n');
    var title = this.parser.conf_to_string('title');
    var style = this.parser.style;
    if(title){
      title = this.uncode(style,title);
    }
    /// stylesheet
    var stylesheet = ``;
    var script = ``;
    return {stylesheet,body,script};
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // override the super class
  //
  ////////////////////////////////////////////////////////////////////////////////

}
module.exports = { NitrilePreviewPage };
