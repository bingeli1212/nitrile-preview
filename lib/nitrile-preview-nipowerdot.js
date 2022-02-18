'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewPowerdot extends NitrilePreviewLatex {
  constructor(parser,pname) {
    super(parser,pname);
    this.name = 'powerdot';
    this.frames = 0;
    this.frameid = 0;
    this.frameopt = '[t]';
    this.eid = 0; //exercise ID
    this.style = parser.style;
    this.icon_checkedbox = `{$\\blacksquare$}`;
    this.icon_hollowbox = `{$\\square$}`;
    this.icon_coffeecup   = '{\\Coffeecup}';
    this.icon_writinghand = '{\\ding{45}}';
    //this.icon_keypoint = '{\\ding{118}}';
    //this.icon_exercise = '{\\ding{46}}';
    // this.icon_folder   = this.uncode(this.style,String.fromCodePoint(0x27A5));
    //this.icon_keypoint = this.uncode(this.style,String.fromCodePoint(0x2756));
    //this.icon_exercise = this.uncode(this.style,String.fromCodePoint(0x270E));
    //this.icon_solution = this.uncode(this.style,String.fromCodePoint(0x270D));
    this.postsetup = [];
    this.postsetup.push(`\\usepackage{xtab}`);
    this.postsetup.push(`\\usepackage{array}`);
    this.postsetup.push(`\\usepackage{tabularx}`);
    this.postsetup.push('\\usepackage{tikzsymbols}');//for \Coffeecup
    this.postsetup.push(`\\usepackage[overlap,CJK]{ruby}`);
    this.postsetup.push(`\\renewcommand\\rubysep{0.0ex}`);
  }
  cave_to_text(style,cave){
    var n = cave.length;
    var p0 = cave[0];
    var pn = cave[cave.length-1];
    //all normal font size
    var ss = cave.map((p,i,arr) => {
      let text = this.uncode(style,p.text);
      return text;
    });
    var text = ss.join('\\\\\n');
    var all = [];
    all.push('');
    all.push(`\\begin{tightcenter}`);
    all.push(text);
    all.push(`\\end{tightcenter}`)
    return all.join('\n');
  } 
  cove_to_text(style,cove){
    var n = cove.length;
    var p0 = cove[0];
    var pn = cove[cove.length-1];
    //all normal font size
    let d=cove.map((p,i,arr) => {
      let text = this.uncode(style,p.text);
      return text;
    });
    var text=d.join('\\\\\n');
    var all = [];
    all.push('');
    all.push(`\\begin{list}{}{\\setlength\\topsep{0pt}\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{30pt}}`);
    all.push(`\\item[{$\\triangleright$}] ${text}`);
    all.push(`\\end{list}`)
    return all.join('\n');
  }
  to_document() {
    // var body = this.to_beamer();
    // var titlelines = this.to_titlepage();
    // var toc = this.conf_to_bool('toc');
    // return this.to_latex_document('powerdot',['size=10pt'],this.postsetup,titlelines,toc,body)
    var bodylines = this.to_bodylines();
    var titlelines = this.to_titlelines();
    var data_pdflatex = `\
% !TEX program = PdfLatex 
\\documentclass[size=10pt]{powerdot}
${this.to_preamble_essentials_pdflatex()}
\\usepackage{tikzsymbols}%Coffeecup
%\\usepackage[overlap,CJK]{ruby}
%\\renewcommand\\rubysep{0.0ex}
\\newenvironment{tightcenter}{%
  \\setlength\\topsep{0pt}
  \\setlength\\parskip{0pt}
  \\begin{center}
}{%
  \\end{center}
}
\\setlength\\belowcaptionskip{-8pt}
${titlelines.join('\n')}
\\begin{document}
\\maketitle
${bodylines.join('\n')}
\\end{document}
`;
    return data_pdflatex;
  }
  to_bodylines() {
    var presentation = new NitrilePreviewPresentation(this);
    let top = presentation.to_top(this.parser.blocks);
    ///
    ///Process each section, and within each section the subsections
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,i,arr) => {
      let topframe = presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          let subframe = presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let out = this.write_frame_folder(`${i+1}`,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,j) => {
          let id = `${i+1}.${j+1}`;
          let order = ``;
          let icon = this.icon_coffeecup;
          let out = this.write_one_frame(id,order,icon,subframe,1);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = `${i+1}`;
        let icon = ``;
        let out = this.write_one_frame(id,order,icon,topframe,0);
        d.push(out);
      }
    });
    var main = d.join('\n');
    //
    //table of contents
    //
    var toc = this.write_frame_toc(topframes);
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d;
  }
  write_frame_toc(topframes){
    let all = [];
    let n = 0;
    let max_n = 16;
    let texts = [];
    topframes.forEach((topframe,i,arr) => {
      if(n==max_n){
        all.push(`\\end{list}`);    
        texts.push(all.join('\n'));
        n = 0;
      }
      if(n==0){
        all = [];
        all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{16pt}}`);      
      }
      let title = this.uncode(topframe.style,topframe.title);
      let label = `${i+1}`;
      let icon = this.icon_coffeecup;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`\\item[${label}] ${title} ${icon}`);
      }else{
        all.push(`\\item[${label}] ${title}`)
      }
      ++n;
      if(i+1==arr.length){
        all.push('\\end{list}');
        texts.push(all.join('\n'));
        all = [];
      }
    });
    ///ASSEMBLE
    // var text = all.join('\n')
    ///ASSEMBLE
    all = [];
    texts.forEach((text) => {
      all.push('');
      all.push(`\\begin{slide}{Table Of Contents}`);
      all.push(text);
      all.push(`\\end{slide}`);
    });
    return all.join('\n');
  }
  write_frame_folder(id,frame,subframes){
    var all = [];
    // 
    //NOTE: main contents
    //
    let icon = this.icon_coffeecup;
    all.push(`\\begin{slide}{${id} ${this.uncode(frame.style,frame.title)} ${icon}}`); 
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
      all.push(`\\medskip`);
    })   
    subframes.forEach((subframe,j,arr) => {
      if(j==0){
        all.push('');
        all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{16pt}}');
      }
      ///'o' is blocks
      all.push(`\\item[${icon}] ${this.uncode(subframe.style,subframe.title)} `);
      if(j+1==arr.length){
        all.push('\\end{list}')
      }
    });  
    all.push(`\\end{slide}`);
    all.push('');
    return all.join('\n')
  }
  write_one_frame(id,order,icon,frame,issub) {
    let all = [];
    let v = null;
    const re_choice = /^(.*?):([\w\/]+)$/;
    // 
    //NOTE: main contents
    //
    all.push(`\\begin{slide}{${order} ${icon} ${this.uncode(frame.style,frame.title)}}`);    
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
      all.push(`\\medskip`);
    })     
    //
    //NOTE: cannot use flushleft here because it will cause the previous wrapped figure to go to next page
    frame.solutions.forEach((o,i,arr) => {
      all.push('')
      if(o.choice){
        let text = this.to_choice(o.style,o.body);
        all.push(`${this.icon_writinghand} {\\itshape ${this.uncode(o.style,o.title)}} `);
        all.push(`\\hfill\\break`);
        all.push(text);
      }else{
        all.push(`${this.icon_writinghand} {\\itshape ${this.uncode(o.style,o.title)}} `);
      }
    })
    all.push(`\\end{slide}`);
    all.push('');
    //
    //NOTE: individual slides
    //
    frame.solutions.forEach((o,i,arr) => {     
      //solution slides
      let icon = this.icon_writinghand;
      all.push(`\\begin{slide}{~}`);
      if(o.choice){
        var title = this.uncode(o.style,o.title);
        var text = this.to_choice(o.style,o.body,o.choice);
      }else{
        var title = this.uncode(o.style,o.title);
        var text = this.uncode(o.style,this.join_para(o.body));
      }
      all.push(`{\\small ${icon} ${title} ~ ${text}}`);
      o.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
        all.push('\\medskip');
      })
      all.push(`\\end{slide}`);
      all.push('');
    });
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_titlelines(){
    var titlelines = [];
    var style = {}
    var title      = this.parser.conf_to_string('title');
    var subtitle   = this.parser.conf_to_string('subtitle');
    var author     = this.parser.conf_to_string('author');
    var institute  = this.parser.conf_to_string('institute')
    title = this.uncode(this.style,title);
    subtitle = this.uncode(this.style,subtitle);
    author = this.uncode(this.style,author);
    institute = this.uncode(this.style,institute);
    titlelines.push(`\\title{${title}}`);
    // titlelines.push(`\\subtitle{${subtitle}}`);
    // titlelines.push(`\\institute{${institute}}`);
    titlelines.push(`\\author{${author}}`);
    return titlelines;
  }
  to_choice(style,body,check){
    body = body.filter((s) => s.length)
    var all = [];
    all.push('\\begin{tabular}{@{}p{\\linewidth}@{}}');
    var re_word = /^(\w+)/;
    var v;
    var checks = check?check.split('/'):[];
    body.forEach((s) => {
      var start;
      if((v=re_word.exec(s))!==null){
        start = v[1];
      }
      if(this.is_in_list(start,checks)){
        all.push(`${this.icon_checkedbox} ${this.uncode(style,s)} \\tabularnewline`)
      }else{
        all.push(`${this.icon_hollowbox} ${this.uncode(style,s)} \\tabularnewline`)
      }
    })
    all.push('\\end{tabular}');
    return all.join('\n');  
  }
}
module.exports = { NitrilePreviewPowerdot }
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
const { NitrilePreviewBase } = require('./nitrile-preview-base');
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    var fname = process.argv[2];    
    var oname = process.argv[3];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.tex'){
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
      var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
      if(oname){
        texfile = oname;
      }
      var translator = new NitrilePreviewPowerdot(parser);
      var data = translator.to_document();
      await this.write_text_file(fs,texfile,data);
      console.log(`written to ${texfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new Server();
  server.run();
}