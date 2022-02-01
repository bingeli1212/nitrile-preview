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
    var srcs = this.parser.srcs;
    return {stylesheet,script,body,srcs};
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // override the super class
  //
  ////////////////////////////////////////////////////////////////////////////////

}
module.exports = { NitrilePreviewPage };
