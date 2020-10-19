'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const unijson = require('./nitrile-preview-unicode');

class NitrilePreviewBeamer extends NitrilePreviewLatex {

  constructor(parser) {
    super(parser);
    this.frames = 0;
    this.ending = '';
    this.question_id = 0;
    this.example_id = 0;
    this.exercise_id = 0;
  }
  to_conf_step(){
    return this.conf('latex.step','5mm');
  }
  to_beamer_document() {
    ///do identify
    this.identify();
    ///do translate
    this.translate();
    ///start putting together
    var titlelines = this.to_titlelines();
    var toclines = this.to_toclines();
    var p_latex_program = this.to_latex_program();
    var p_locale_packages = this.to_locale_packages();
    var p_core_packages = this.to_core_packages();
    var p_extra_packages = this.to_extra_packages();
    var p_fonts_layout = this.to_fonts_layout();
    var p_post_setups = this.to_post_setups();
    var top = this.to_tops(this.parser.blocks);
    var tex = this.to_beamer(top);
    return     `\
%!TeX program=${p_latex_program}
\\documentclass{beamer}
${p_locale_packages}
${p_core_packages}
${p_extra_packages}
${p_fonts_layout}
${p_post_setups}
\\begin{document}
${titlelines.join('\n')}
${titlelines.length?'\\maketitle':''}
${toclines.join('\n')}
${tex}
${this.ending}
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
    let d = [];
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        let data = this.to_beamer_frame(o);
        d.push(data);
      }
    });
    return d.join('\n');
  }
  to_beamer_frame(top) {
    let my = top.shift();
    let d = [];
    let w = [];
    let all = [];
    let my_id = this.get_refmap_value(my.style,'idnum');
    let my_title = my.title;
    let my_qid = '';
    let re_question = /^(question):(.*)$/i;
    let re_example = /^(example):(.*)$/i;
    let re_exercise = /^(exercise):(.*)$/i;
    let v;
    ///EXPERIMENT:
    my_id = '';
    if((v=re_question.exec(my.title))!==null){
      my_qid = ++this.question_id;
      my_title = `${v[1]} #${my_qid}:${v[2]}`
    }
    if((v=re_example.exec(my.title))!==null){
      my_qid = ++this.example_id;
      my_title = `${v[1]} #${my_qid}:${v[2]}`
    }
    if((v=re_exercise.exec(my.title))!==null){
      my_qid = ++this.exercise_id;
      my_title = `${v[1]} #${my_qid}:${v[2]}`
    }
    my_title = this.unmask(my_title);
    let box = '$\\Square$';
    let cbox = '$\\CheckedBox$';
    let sig = '';
    //d.push(`\\frametitle{${idnum} ${this.unmask(my.title)}}`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.to_beamer_solution(o);
        sig = data.sig;///save the last sig
        w.push(data);
      } else {
        d.push(o.latex);
      }
    });
    if(sig=='HDGS'){
      ///multiply choices
      ///first slide
      all.push(`\\begin{frame}[t]`);
      all.push(`\\frametitle{${my_id} ${my_title}}`);    
      all.push(d.join('\n'));
      if(w.length){
        all.push(`\\begin{itemize}`);
        w.forEach((o,i) => {
          let sym = '$\\Square$';
          all.push(`\\item[${sym}] ${o.title}`);
        });
        all.push(`\\end{itemize}`);
      }
      all.push(`\\end{frame}`);
      ///2nd, 3rd, ...
      w.forEach((p,k) => {     
        all.push(`\\begin{frame}[t]`);
        all.push(`\\frametitle{${my_id} ${my_title}}`);
        all.push(d.join('\n'))
        all.push(`\\begin{itemize}`);
        w.forEach((o,i) => {
          let sym = (i==k)?'$\\CheckedBox$':'$\\Square$';
          all.push(`\\item[${sym}] ${this.unmask(o.title)}`);
          if(i==k){
            all.push('');
            all.push(o.contents.map(x=>x.latex).join('\n'));
            all.push('');
          }
        });
        all.push(`\\end{itemize}`);
        all.push(`\\end{frame}`);
        all.push('');
      });
    }else{
      ///multiple solutions
      ///main-slide
      all.push(`\\begin{frame}[t]`)
      all.push(`\\frametitle{${my_id} ${my_title}}`);
      all.push(d.join('\n'));
      if(w.length){
        all.push('');
        w.forEach((o,i) => {
          if(i==w.length-1){
            all.push(`${box} \\textbf{${o.title}}\\hfill\\break{}`);
          }else{
            all.push(`${box} \\textbf{${o.title}}\\hfill\\break{}`);
          }
        });
        all.push('')
      }
      all.push(`\\end{frame}`);
      ///child-slides
      w.forEach((o,i) => {
        all.push(`\\begin{frame}[t]`);
        all.push(`\\frametitle{${my_id} ${my_title} (${o.title})}`);
        all.push(d.join('\n'));
        all.push('');
        all.push(`${cbox} \\textbf{${o.title}} - ${o.text}`);
        all.push('')
        ///child-slide contents
        o.contents.forEach(x=>all.push(x.latex));
        ///close frame
        all.push(`\\end{frame}`);
      })
    }
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
}
module.exports = { NitrilePreviewBeamer }
