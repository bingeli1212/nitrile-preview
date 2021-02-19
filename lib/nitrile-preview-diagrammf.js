'use babel';

const { NitrilePreviewDiagramMP } = require('./nitrile-preview-diagrammp');


class NitrilePreviewDiagramMF extends NitrilePreviewDiagramMP {

  constructor(translator) {
    super(translator);
  }
  
  ///redefine the 'to_text_label' method because MetaFun has changed its
  ///syntax
  to_tex_label(txt,math,fontsize){
    txt=txt||'';
    var fs = `${fontsize}pt`;
    if (math==1) {
      // math text
      let style = {};
      var s = this.translator.phrase_to_inlinemath(txt,style,switches);
      var s = `{\\switchtobodyfont[${fs}]${s}}`;
    } else {
      // normal text with symbols
      var s = this.translator.smooth(txt);
      var s = `{\\switchtobodyfont[${fs}]${s}}`
    }
    return `"${s}"`;
  }

}
module.exports = { NitrilePreviewDiagramMF };
