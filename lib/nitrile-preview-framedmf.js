'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');

class NitrilePreviewFramedMF extends NitrilePreviewBase {
  constructor(translator){
    super();
    this.translator = translator;
  }
  to_framed(ss,g){
    var o = [];
    var npara = ss.length;
    var vw = this.assert_int(g.framewidth,600);
    var vh = this.assert_int(g.frameheight,npara*4.2);//12pt = 4.2mm
    var solid = '\\ '.repeat(80);
    o.push(`numeric o; o := 4.2mm;`);
    //o.push(`draw (1*o,0)--(1*o,-${npara-1}*o) withpen pencircle withcolor white;`);
    o.push(`draw (0mm,0mm)--(${vw}mm,-${vh}mm) withpen pencircle withcolor white;`);
    //o.push(`label.rt("{\\tt\\switchtobodyfont[12pt]${solid}}", (0,0));`);
    ss.forEach((s,i) => {
      s = this.translator.polish(s);
      s = s.replace(/\s/g,"~");
      o.push(`label.lrt("{\\tt\\switchtobodyfont[12pt]${s}}", (0,-${i}*o));`);
    });
    var s = o.join('\n');
    if(g.width){
      let wd = g.width;
      let num = this.str_to_mf_length(wd);
      let d = [];
      d.push('\\startMPcode');
      d.push(s);
      if(num){
        d.push(`numeric tw; tw := \\the\\textwidth; tw := tw * ${num};`);
      }else{
        d.push(`numeric tw; tw := ${wd};`)
      }
      d.push(`numeric pw; pw := bbwidth(currentpicture);`);
      d.push(`numeric ratio; ratio := tw/pw;`);
      d.push(`currentpicture := currentpicture scaled ratio;`);
      d.push(`draw bbox currentpicture;`);
      d.push(`\\stopMPcode{}`);
      var text = d.join('\n');
    }else{
      let d = [];
      d.push('\\startMPcode');
      d.push(s);
      d.push(`draw bbox currentpicture;`);
      d.push(`\\stopMPcode{}`);
      var text = d.join('\n');
    }
    return {text};
  }
  str_to_mf_length(str) {
    /// take an input string that is 100% and convert it to '\linewidth'.
    /// take an input string that is 50% and convert it to '0.5\linewidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!str) {
      return '';
    }
    var re = /^(.*)\%$/;
    if (re.test(str)) {
      var str0 = str.slice(0, str.length - 1);
      var num = parseFloat(str0) / 100;
      if (Number.isFinite(num)) {
        var num = num.toFixed(3);
        return num;
      }
    }
    return '';
  }
}
module.exports = {NitrilePreviewFramedMF}