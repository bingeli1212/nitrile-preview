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
    var stylesheet = ``;
    var script = ``;
    var members = this.parser.members;
    return {stylesheet,script,body,members};
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // override the super class
  //
  ////////////////////////////////////////////////////////////////////////////////

}
module.exports = { NitrilePreviewPage };
