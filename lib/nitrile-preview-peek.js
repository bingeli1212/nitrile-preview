'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { NitrilePreviewDiagramSVG } = require('./nitrile-preview-diagramsvg');
const const_partnums = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'IIX', 'IX', 'X'];
const const_subfignums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

class NitrilePreviewPeek extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
  }
  set_view (view) {
    this.view = view;
  }
  to_peek_document(){
    var htmls = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      htmls.push(html);
    });
    let text = htmls.join('\n');
    return text;
  }
  ///override the one from *-html.js
  to_request_image(imgsrc){
    var { imgsrc, imgid } = this.view.query_imagemap_info(imgsrc,this);
    return {imgsrc,imgid}
  }

}
module.exports = { NitrilePreviewPeek };
