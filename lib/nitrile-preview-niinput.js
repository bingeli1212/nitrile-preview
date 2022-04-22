'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
const { all } = require('express/lib/application');
////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////
class NitrilePreviewLinput extends NitrilePreviewLchapter {
  constructor(parser) {
    super(parser);
    this.name = 'lchapter';
    this.style = parser.style;
  }
  to_document() {
    var all = [];
    var title = this.parser.title;
    var style = this.parser.style;
    all.push(`\\chapter{${this.uncode(style,title)}}`);
    this.parser.blocks.forEach((block) => {
      let latex = this.translate_block(block);
      all.push('');
      all.push(latex);
    })
    return all.join('\n');
  }
}
////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////
class NitrilePreviewCinput extends NitrilePreviewContex {
  constructor(parser) {
    super(parser);
    this.name = 'cinput';
    this.style = parser.style;
  }
  to_document() {
    var all = [];
    var title = this.parser.title;
    var style = this.parser.style;
    var label = this.parser.label||`chapter.${this.parser.chapnum}`;
    all.push('');
    all.push(`\\startchapter[title={${style.chapnum} ~ ${this.uncode(style,title)}},reference={${label}},bookmark={${raw}}]`);
    this.parser.blocks.forEach((block) => {
      let latex = this.translate_block(block);
      all.push('');
      all.push(latex);
    })
    return all.join('\n');
  }
}
module.exports = { NitrilePreviewLinput, NitrilePreviewCinput };

