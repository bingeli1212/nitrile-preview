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
    let d = [];
    d.push('\\startMPcode');
    d.push(`numeric pw;`);
    d.push(`numeric ph;`)
    d.push(`numeric vw; vw := ${vw}mm;`)
    d.push(`numeric vh; vh := ${vh}mm;`)
    d.push(`numeric textwidth; textwidth := \\the\\textwidth;`);
    d.push(`numeric textheight; textheight := \\the\\textwidth;`);
    d.push(`numeric ratio_w; ratio_w := 1;`)
    d.push(`numeric ratio_h; ratio_h := 1;`)
    d.push(s);
    if (g && g.width && g.height){
      let wd = g.width;
      let wd_percent = this.string_to_percentage(wd);
      if (wd_percent) {
        d.push(`textwidth := textwidth*${wd_percent};`);
        d.push(`pw := textwidth;`);
        d.push(`ratio_w := pw/vw;`);  
      } else {
        d.push(`textwidth := ${wd};`)
        d.push(`pw := textwidth;`);
        d.push(`ratio_w := pw/vw;`);  
      }
      let ht = g.height;
      let ht_percent = this.string_to_percentage(ht);
      if (ht_percent) {
        //do nothing
        d.push(`ratio_h := ratio_w;`);
      }else{
        d.push(`textheight := ${ht};`);
        d.push(`ph := textheight;`)
        d.push(`ratio_h := ph/vh;`)
      }
      d.push(`currentpicture := currentpicture xscaled ratio_w yscaled ratio_h;`)
    } else if (g && g.width) {
      ///width-only
      let wd = g.width;
      let wd_percent = this.string_to_percentage(wd);
      if (wd_percent) {
        d.push(`textwidth := textwidth*${wd_percent};`);
        d.push(`pw := textwidth;`);
        d.push(`ratio_w := pw/vw;`);  
      } else {
        d.push(`textwidth := ${wd};`)
        d.push(`pw := textwidth;`);
        d.push(`ratio_w := pw/vw;`);  
      }
      d.push(`currentpicture := currentpicture scaled ratio_w;`)
    }
    d.push('\\stopMPcode{}');
    var text = d.join('\n')
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