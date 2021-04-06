'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');

class NitrilePreviewFramedTikz extends NitrilePreviewBase {
  constructor(translator){
    super();
    this.translator = translator;
  }
  to_framed(ss,g){
    var npara = ss.length;
    let vw = this.assert_int(g.framewidth,600);
    let vh = this.assert_int(g.frameheight,1);
    if(vh < npara*12){
      vh = npara*12;//12pt font
    }
    var o = [];
    var anchor = 'south west';
    var fs = 12;
    var textcolor = '';
    o.push(`\\draw[color=white] (0,0) rectangle (${vw}pt,${vh}pt);`);
    var x = 0;
    var y = vh;
    ss.forEach((s,i) => {
      s = this.translator.polish(s);
      s = s.replace(/\s/g,"~");
      y -= fs;
      o.push(`\\draw (0pt,${y}pt) node[anchor=${anchor}] {\\ttfamily\\fontsize{${fs}pt}{${fs}pt}\\selectfont{}${textcolor}${s}};`);
    });
    var s = o.join('\n');
    let d = [];
    d.push(`\\begin{tikzpicture}`);
    d.push(s);
    if(g.framebox){
      d.push(`\\draw (current bounding box.north east) rectangle (current bounding box.south west);`);
    }
    d.push('\\end{tikzpicture}')
    var text = d.join('\n');
    return {text}
  }
}
module.exports = {NitrilePreviewFramedTikz}