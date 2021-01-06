'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');

class NitrilePreviewFramedSVG extends NitrilePreviewBase {

  constructor(translator){
    super();
    this.translator = translator;
  }
  to_framed(ss,style){

    var mpara = this.assert_int(style.n,80,10,120);
    var npara = ss.length;

    //var width = `${2*(mpara+2)}mm`;
    //var height = `${(npara+3)*10}pt`;
    
    var w = (mpara) * 6.00;
    var h = (npara) * 10;
    var fontsize = 10; //pt
    var extra_dy = 0.75;
    var vw = w * 1.333;
    var vh = h * 1.333;
  
    let o = [];
    o.push( `<text style='font-family:monospace;white-space:pre;font-size:${fontsize}pt;' text-anchor='start' x='0' y='0' textLength='${w}pt' lengthAdjust='spacing' >` );
    for (var i=0; i < npara; ++i) {
      let s = ss[i];
      while (s.length < mpara) {
        s += ' ';
      }
      if(s.length > mpara){
        s = s.slice(0,mpara);
      }
      s = this.translator.polish(s);
      s = this.translator.replace_blanks_with(s,'&#160;');
      var x = 0;
      o.push( `<tspan y='${(i+extra_dy)*10}pt' x='0'>${s}</tspan>` );
    }
    o.push( `</text>`);
    var text = o.join('\n');
  
    var s = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='none' viewBox='0 0 ${vw} ${vh}' >${text}</svg>`;
  
    return { s, vw, vh, text };
  }
}
module.exports = { NitrilePreviewFramedSVG };
