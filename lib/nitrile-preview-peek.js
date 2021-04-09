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
    ///do translate
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      block.html = text;
    })
    let htmls = this.parser.blocks.map(x => x.html);
    let text = htmls.join('\n');
    let front = this.to_frontmatter(this.parser.blocks);
    return front + '\n' + text;
  }
  ///override the one from *-html.js
  to_request_image(imgsrc){
    var { imgsrc, imgid } = this.view.query_imagemap_info(imgsrc,this);
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
  /// return a translated frontmatter block
  to_frontmatter(blocks){
    if(blocks.length){
      let block = blocks[0];
      let {style} = block;
      if(block.sig=='FRNT'){
        let pp = block.data.map(([key,val]) => {
          return `<td><strong>${this.polish(key,style)}</strong></td><td>${val.split('\n').map(x => this.polish(x,style)).join('<br/>')}</td>`
        })
        pp = pp.map(x => `<tr>${x}</tr>`);
        let text = pp.join('\n');
        let {row1,row2} = block.style;
        text = `<table class='FRNT' rows='${this.rows(row1,row2)}' >${text}</table>`;
        return text;
      }
    }
    return '';
  }

}
module.exports = { NitrilePreviewPeek };
