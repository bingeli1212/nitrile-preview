'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');

class NitrilePreviewFramedTikz extends NitrilePreviewBase {
  constructor(translator){
    super();
    this.translator = translator;
  }
  to_framed(ss,style){
    let vw = this.assert_int(style.framewidth,300);
    let vh = this.assert_int(style.frameheight,0);
    ss = ss.map(x=>x);///make a copy
    ss.reverse();
    var o = [];
    var unit = 12;
    //var solid = '\\ '.repeat(n);
    var x = 0;
    var y = 0;
    var anchor = 'south west';
    var fs = '12pt';
    var textcolor = '';
    var zoom = 1;
    o.push(`\\draw[color=white] (0,0) rectangle (${vw}pt,${vh}pt);`);
    ss.forEach((s,i) => {
      s = this.translator.polish(s);
      s = s.replace(/\s/g,"~");
      let x = 0;
      let y = i;
      o.push(`\\draw (${this.fix(x * unit)}pt,${this.fix(y * unit)}pt) node[anchor=${anchor}] {\\ttfamily\\fontsize{${fs}pt}{${fs}pt}\\selectfont{}${textcolor}${s}};`);
    });
    var s = o.join('\n');
    let d = [];
    d.push('\\begin{tikzpicture}');
    d.push(s);
    d.push('\\end{tikzpicture}')
    var text = d.join('\n');
    return {text}
  }
}
module.exports = {NitrilePreviewFramedTikz}