'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');

class NitrilePreviewPage extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.build_default_css_map();
  }
  to_peek_document() {
    this.build_default_idnum_map();
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var html = all.join('\n');
    html = `<div class='PAGE'> ${html} </div>`;
    return html;
  }
  to_document() {
    this.build_default_idnum_map();
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var html = all.join('\n');
    html = `<div class='PAGE'> ${html} </div>`;
    var title = this.parser.conf_to_string('title');
    var style = this.parser.style;
    if(title){
      title = this.uncode(style,title);
    }
    /// style_css
    var style_css = `
.LISTING .BODY {
  line-height: 1; 
  text-align: left; 
  width: 100%; 
  padding-left: 1.5em;
  position: relative;
  display: block;
}
.LISTING .BODY .LINE {
  position: relative;
  display: block;
}
.LISTING .BODY .LINE::before {
  content: var(--lineno);
  position: absolute;
  left: -1.5em;
}
.SUBCAPTION::before {
  content: var(--num) " ";
}
.COVE {
  position: relative;
}
.COVE::before {
  position: absolute;
  content: var(--bull);
  left: var(--pad);
}
`;
    var xhtmldata = `\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<style>
${style_css}
</style>
</head>
<body>
${html}
</body>
</html>
`;
    return xhtmldata;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // override the super class
  //
  ////////////////////////////////////////////////////////////////////////////////

}
module.exports = { NitrilePreviewPage };
