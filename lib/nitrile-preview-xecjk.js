'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewXecjk extends NitrilePreviewLatex {
  constructor(parser) {
    super(parser,'xelatex');
  }
  to_document() {
    var body = [];
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      body.push(text);
    })
    var titlelines = this.to_titlelines(this.parser.blocks);
    var toc = this.conf_to_bool('toc');
    var fonts = this.to_xecjk_fonts();
    return this.to_latex_document('article',[],fonts,titlelines,toc,body);
  }
  to_xecjk_fonts(){
    ///mainfont, sansfont, and monofont
    /// \setCJKmainfont{UnGungseo.ttf}
    /// \setCJKsansfont{UnGungseo.ttf}
    /// \setCJKmonofont{gulim.ttf}
    ///\newCJKfontfamily[kr]\kr{AppleGothic}
    var all = [];
    var p_mainfont=this.conf_to_string('xecjk.mainfont');
    var p_sansfont=this.conf_to_string('xecjk.sansfont');
    var p_monofont=this.conf_to_string('xecjk.monofont');
    var extrafonts = this.conf_to_list('xecjk.extrafonts');
    if(p_mainfont){ 
      all.push(`\\setCJKmainfont{${p_mainfont}}`);
    }
    if(p_sansfont){ 
      all.push(`\\setCJKsansfont{${p_sansfont}}`);
    }
    if(p_monofont){ 
      all.push(`\\setCJKmonofont{${p_monofont}}`);
    }
    extrafonts.forEach((s) => {
      let [fn,fnt] = s.split(',');
      all.push(`\\newCJKfontfamily[${fn}]\\${fn}{${fnt}}`);
    });
    return all;
  }
}
module.exports = { NitrilePreviewXecjk }
