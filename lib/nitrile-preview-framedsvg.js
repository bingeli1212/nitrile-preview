'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');

class NitrilePreviewFramedSVG extends NitrilePreviewBase {

  constructor(translator){
    super();
    this.translator = translator;
  }
  to_framed(ss,style){

    var npara = ss.length;

    //var width = `${2*(mpara+2)}mm`;
    //var height = `${(npara+3)*10}pt`;
    
    var vw = this.assert_int(style.framewidth,600);
    var vh = this.assert_int(style.frameheight,1);
    if(vh < npara*12){
      vh = npara*12;//12pt font
    }
    var fontsize = 12; //pt
    var extra_dy = 0.78;  
    let o = [];
    o.push( `<text style='font-family:monospace;white-space:pre;font-size:${fontsize}pt;' text-anchor='start' x='0' y='0' >` );
    for (var i=0; i < npara; ++i) {
      let s = ss[i];
      s = this.translator.polish(s);
      s = this.translator.replace_blanks_with(s,'&#160;');
      var x = 0;
      o.push( `<tspan y='${(i+extra_dy)*fontsize}pt' x='0'>${s}</tspan>` );
    }
    o.push( `</text>`);
    var text = o.join('\n');
  
    var s = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='none' viewBox='0 0 ${vw*1.333} ${vh*1.333}' >${text}</svg>`;
  
    return { s, vw, vh, text };
  }
}
module.exports = { NitrilePreviewFramedSVG };
