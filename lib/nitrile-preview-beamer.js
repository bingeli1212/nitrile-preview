'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const unijson = require('./nitrile-preview-unicode');

class NitrilePreviewBeamer extends NitrilePreviewLatex {

  constructor(parser) {
    super(parser);
    this.frames = 0;
    this.frameid = 0;
    this.eid = 0; //exercise ID
    this.flags.small_tabulate = 1;
  }
  do_HDGS(block){
    let {hdgn} = block;
    ///reset the this.enumerate_counter if 'hdgn' is zero
    if(hdgn==1){
      this.enumerate_counter = 0;
    }
  }
  to_beamer_document() {
    ///do identify
    this.identify();
    ///do translate
    this.translate();
    //required setups
    var p_latex_program = this.to_latex_program();
    var p_core_packages = this.to_core_packages(p_latex_program);
    var p_extra_packages = this.to_latex_extrapackage(p_latex_program);
    var p_post_setups = this.to_latex_postsetup(p_latex_program);
    ///process the document
    var top = this.to_tops(this.parser.blocks);
    var tex = this.to_beamer(top);
    var titlelines = this.to_titlelines();
    var fontsize = this.conf('beamer.fontsize','','float','pt')
    return     `\
%!TeX program=${p_latex_program}
\\documentclass[${fontsize}]{beamer}
${p_core_packages}
${p_extra_packages}
\\usepackage{parskip}
${p_post_setups}
\\setbeamerfont{quote}{shape=\\upshape}
\\begin{document}
${titlelines.join('\n')}
${titlelines.length?'\\maketitle':''}
${tex}
\\end{document}
`;
  }
  to_tops(blocks) {
    var top = [];
    var o = null;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'FRNT'){
        top.push(block);
      }
      if (sig == 'HDGS' && hdgn == 1) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }
    }
    top = top.map(o => {

      if (Array.isArray(o)) {
        o = this.to_solutions(o);
      }
      return o;
    })
    return top;
  }
  to_solutions(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'HDGS' && hdgn == 2) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(sig=='PRIM'){
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    return top;
  }
  to_beamer(top) {
    let frames = [];
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        let frame = this.to_beamer_frame(o);
        frames.push(frame);
      }
    });
    ///export frames
    let outs = [];
    frames.forEach((frame) => {
      let out = this.export_frame(frame);
      outs.push(out);
    });
    return outs.join('\n');
  }
  to_beamer_frame(o){
    let my = o.shift();
    let title = my.title;
    let re_ex = /^ex\.(.*)$/i;
    let v;
    let eid;
    if((v=re_ex.exec(title))!==null){
      eid = ++this.eid;
      title = v[1];
    }
    let contents = [];
    let solutions = [];
    o.forEach((d, i) => {
      if (Array.isArray(d)) {
        let data = this.to_beamer_solution(d);
        solutions.push(data);
      } else {
        contents.push(d);
      }
    });
    title = this.unmask(title);
    return {title,eid,contents,solutions}
  }
  export_frame(frame) {
    let all = [];
    ///let my_id = this.get_refmap_value(my.style,'idnum');
    //let re_exercise = /^(ex):(.*)$/i;
    //let v;
    ///EXPERIMENT:
    var title = frame.title;
    if(frame.eid){
      var title = `Ex.${frame.eid}/${this.eid} ${frame.title}`;
    }
    let box = this.unmask('&BallotBox;');
    let cbox = this.unmask('&BallotBoxWithCheck;');
    let dtri = '\\MoveDown';
    let endash = '{\\textendash}'
    let checkmark = this.unmask('&checkmark;');
    let sigs = [];
    ///multiply solutions
    ///first slide
    all.push(`\\begin{frame}[t]`);
    all.push(`\\frametitle{${++this.frameid} ~ ${title}}`);    
    frame.contents.forEach((x,i) => {
      all.push('');
      all.push(x.latex.trim());
    })      
    if(frame.solutions.length){
      frame.solutions.forEach((o,i) => {
        if(i==0){
          all.push('');
          all.push('\\begingroup');
        }
        all.push(`${box}~\\underline{${o.title}}`);
        if(i+1==frame.solutions.length){
          all.push('\\endgroup')
        }else{
          all.push('\\hfill\\break{}')
        }
      });
    }
    all.push(`\\end{frame}`);
    all.push('');
    ///solutions
    frame.solutions.forEach((o,i) => {     
      all.push(`\\begin{frame}[t]`);
      all.push(`\\frametitle{${++this.frameid} ~ \\textsl{${title}}}`);
      all.push('');
      if(o.text){
        all.push(`${cbox}~\\underline{${o.title}} ~ {${o.text}}`);
      }else{
        all.push(`${cbox}~\\underline{${o.title}}`);
      }
      o.contents.forEach((x,i) => {
        all.push('');
        all.push(x.latex.trim());
      })
      all.push('');
      all.push(`\\end{frame}`);
      all.push('');
    });
    return all.join('\n');
  }
  to_beamer_solution(top) {
    let my = top.shift();
    let title = this.unmask(my.title);
    let contents = top;
    let text = '';
    let sig = my.sig;
    if(my.sig=='PRIM'){
      text = this.unmask(this.join_para(my.body));
    }
    return {title,contents,text,sig};
  }
  to_titlelines(){
    var titlelines = [];
    var block = this.parser.blocks[0];
    if(block && block.sig=='FRNT'){
      let data = block.data;
      for(let t of data){
        let [key,val] = t;
        if(key=='title'){
          titlelines.push(`\\title{${this.unmask(val)}}`);
        }
        else if(key=='subtitle'){
          titlelines.push(`\\subtitle{${this.unmask(val)}}`);
        }
        else if(key=='author'){
          titlelines.push(`\\author{${this.unmask(val)}}`);
        }
        else if(key=='institute'){
          titlelines.push(`\\institute{${this.unmask(val)}}`);
        }
      }
    }
    return titlelines;
  }
  para_to_listing(ss,style){
    var {caption,ss} = this.ss_to_caption_ss(ss,style);    
    let label = style.label||'';
    let opts = [];
    opts.push(`caption={${this.unmask(caption)||'~'}}`);///when caption is empty the Listing: won't show
    if(label){
      opts.push(`label={${label}}`);
    }
    opts = opts.join(',');
    ss = ss.map(x => this.polish_verb(x))
    ss = ss.map(x => `{\\ttfamily\\footnotesize{}${x}}`)
    let o = [];
    o.push('\\noindent')
    o.push(ss.join('\\hfill\\break{}\n'))
    return o.join('\n');
  }
}
module.exports = { NitrilePreviewBeamer }
