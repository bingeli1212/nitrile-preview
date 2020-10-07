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
    ///do identify
    this.identify(this.parser.blocks);
    ///do translate
    this.parser.blocks.forEach(block => {
      this.vmap = block.vmap;
      switch (block.sig) {
        case 'PART': this.do_PART(block); break;
        case 'HDGS': this.do_HDGS(block); break;
        case 'SAMP': this.do_SAMP(block); break;
        case 'PRIM': this.do_PRIM(block); break;
        case 'TEXT': this.do_TEXT(block); break;
        case 'PLST': this.do_PLST(block); break;
        case 'HRLE': this.do_HRLE(block); break;
        case 'FLOA': this.do_FLOA(block); break;
        default: break;
      }
    })
    let htmls = this.parser.blocks.map(x => x.html);
    return htmls.join('\n');
  }
  ///override the one from *-html.js
  to_request_image(imgsrc){
    var { imgsrc, imgid } = this.view.query_imagemap_info(imgsrc);
    return {imgsrc,imgid}
  }
  ///over the one from *-html.js
  to_bodyfontsize(){
    var fontsize = atom.config.get('nitrile-preview.bodyFontSize');
    if(fontsize){
      return fontsize;
    }else{
      return 12;
    }
  }
  ///over the one from *-html.js
  to_mathfontsize(){
    var fontsize = atom.config.get('nitrile-preview.mathFontSize');
    if(fontsize){
      return fontsize;
    }else{
      return 12;
    }
  }

}
module.exports = { NitrilePreviewPeek };
