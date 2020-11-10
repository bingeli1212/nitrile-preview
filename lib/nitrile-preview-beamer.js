'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const unijson = require('./nitrile-preview-unicode');

class NitrilePreviewBeamer extends NitrilePreviewLatex {

  constructor(parser) {
    super(parser);
    this.frames = 0;
    this.ending = '';
    this.frame_id = 0;
    this.exercise_id = 0;
    this.homework_id = 0;
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
    ///start putting together
    var titlelines = this.to_titlelines();
    var toclines = this.to_toclines();
    //required setups
    var p_latex_program = this.to_latex_program();
    var p_latex_features = this.to_latex_features();
    var p_core_packages = this.to_core_packages(p_latex_program,p_latex_features);
    var p_extra_packages = this.to_extra_packages(p_latex_program,p_latex_features);
    var p_geometry_layout = this.to_geometry_layout(p_latex_program,p_latex_features);
    var p_fonts_layout = this.to_fonts_layout(p_latex_program,p_latex_features);
    var p_post_setups = this.to_post_setups(p_latex_program,p_latex_features);
    ///process the document
    var top = this.to_tops(this.parser.blocks);
    var tex = this.to_beamer(top);
    var fontsize = this.conf('beamer.fontsize','','float','pt')
    return     `\
%!TeX program=${p_latex_program}
\\documentclass[${fontsize}]{beamer}
${p_core_packages}
${p_extra_packages}
${p_fonts_layout}
${p_post_setups}
\\setbeamerfont{quote}{shape=\\upshape}
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
    let re_exercise = /^(question|example|exercise):(.*)$/i;
    let re_homework = /^(homework):(.*)$/i;
    let v;
    ///EXPERIMENT:
    my_id = '';
    let my_type = '';
    if((v=re_exercise.exec(my.title))!==null){
      //my_qid = ++this.exercise_id;
      my_title = `${v[1]} ${my_qid}:${v[2]}`
      my_type = 'question';
    }
    if((v=re_homework.exec(my.title))!==null){
      //my_qid = ++this.homework_id;
      my_title = `${v[1]} ${my_qid}:${v[2]}`
      my_type = 'exercise';
    }
    my_title = this.unmask(my_title);
    let box = '$\\Square$';
    let cbox = '\\CheckedBox';
    let dtri = '\\MoveDown';
    let endash = '{\\textendash}'
    let checkmark = '{\\ding{51}}'
    let sigs = [];
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.to_beamer_solution(o);
        sigs.push(data.sig);///save the last sig
        w.push(data);
      } else {
        d.push(o.latex);
      }
    });
    if(sigs[0]=='HDGS'){
      ///multiple topics
      ///main-slide
      if(d.length > 0){
        /// skip the main slide if 'd' is empty
        all.push(`\\begin{frame}[t]`)
        all.push(`\\frametitle{${++this.frame_id}. ${my_id} ${my_title}}`);
        all.push(d.join('\n'));
        if(w.length){
          all.push('');
          all.push(`\\begin{enumerate}`);
          w.forEach((o,i) => {
            all.push(`\\item[${checkmark}] ${o.title}`);
          });
          all.push(`\\end{enumerate}`)
        }
        all.push(`\\end{frame}`);
        all.push('');
      }
      ///sub-slides
      w.forEach((o,i) => {
        all.push(`\\begin{frame}[t]`);
        all.push(`\\frametitle{${++this.frame_id}. ${my_id} ${my_title} ${endash} \\textsl{${o.title}}}`);
        all.push('');
        o.contents.forEach(x=>all.push(x.latex));
        all.push(`\\end{frame}`);
        all.push('');
      })
    }else if(sigs[0]=='HDGS1'){
      ///multiple topics
      ///main-slide
      if(d.length > 0){
        /// skip the main slide if 'd' is empty
        all.push(`\\begin{frame}[t]`)
        all.push(`\\frametitle{${++this.frame_id}. ${my_id} ${my_title}}`);
        all.push(d.join('\n'));
        if(w.length){
          all.push('');
          all.push(`\\begin{enumerate}`);
          w.forEach((o,i) => {
            all.push(`\\item[${this.to_a_letter(i+1)})] \\textsl{${o.title}}`);
          });
          all.push(`\\end{enumerate}`)
        }
        all.push(`\\end{frame}`);
        all.push('');
      }
      ///sub-slides
      w.forEach((o,i) => {
        all.push(`\\begin{frame}[t]`);
        all.push(`\\frametitle{${++this.frame_id}. ${my_id} ${my_title} }`);
        all.push(d.join('\n'))
        all.push('');
        all.push(`\\begin{enumerate}`)
        all.push(`\\item[${this.to_a_letter(i+1)})] \\textsl{${o.title}}`)
        all.push('');
        o.contents.forEach(x=>all.push(x.latex));
        all.push(`\\end{enumerate}`)
        all.push(`\\end{frame}`);
        all.push('');
      })
    }else if(sigs[0]=='PRIM'){
      ///multiply solutions
      ///first slide
      all.push(`\\begin{frame}[t]`);
      all.push(`\\frametitle{${++this.frame_id}. ${my_id} ${my_title}}`);    
      all.push(d.join('\n'));
      if(w.length){
        w.forEach((o,i) => {
          all.push('');
          all.push(`${box} \\underline{${o.title}}`);
        });
      }
      all.push(`\\end{frame}`);
      all.push('');
      ///2nd, 3rd, ...
      w.forEach((o,i) => {     
        all.push(`\\begin{frame}[t]`);
        all.push(`\\frametitle{${++this.frame_id}. ${my_id} ${my_title} }`);
        //if(o.text){
        //  all.push(d.join('\n'))
        //}
        all.push('');
        if(o.text){
          all.push(`${cbox} \\underline{${o.title}} ~ {${o.text}}`);
        }else{
          all.push(`${cbox} \\underline{${o.title}}`);
        }
        all.push('');
        all.push(o.contents.map(x=>x.latex).join('\n'));
        all.push('');
        all.push(`\\end{frame}`);
        all.push('');
      });
    }else{
      //single slide
      all.push(`\\begin{frame}[t]`);
      all.push(`\\frametitle{${++this.frame_id}. ${my_id} ${my_title}}`);    
      all.push(d.join('\n'));
      all.push(`\\end{frame}`);
      all.push('');
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
