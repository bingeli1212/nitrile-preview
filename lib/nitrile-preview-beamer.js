'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const unijson = require('./nitrile-preview-unicode');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');
const sect = '{\\S}';
const diamond = '{\\faDiamond}';
const envira = '{\\faEnvira}';
const leaf = '{\\faLeaf}';
const asterisk = '{\\faCertificate}';
const checkmark = '{\\faCheck}';
const pencil = '{\\faPencil}';
const leanpub = '{\\faLeanpub}'
const minus_square = '{\\faMinusSquare}'
const plus_square = '{\\faPlusSquare}';
const caret_down = '{\\faCaretDown}'
const caret_left = '{\\faCaretLeft}'
const caret_right = '{\\faCaretRight}'

class NitrilePreviewBeamer extends NitrilePreviewLatex {

  constructor(parser) {
    super(parser);
    this.frames = 0;
    this.frameid = 0;
    this.eid = 0; //exercise ID
    this.presentation = new NitrilePreviewPresentation(this);
  }
  do_HDGS(block){
    let {hdgn} = block;
    ///reset the this.enumerate_counter if 'hdgn' is zero
    if(hdgn==1){
      this.enumerate_counter = 0;
    }
  }
  to_beamer_document() {
    ///do translate
    this.translate();
    //this cannot be called at the constructor
    // this.keypoint_icon = this.conf('beamer.keypoint-icon','{\\faLeaf}');
    // this.exercise_icon = this.conf('beamer.exercise-icon','{\\faPencil}');
    this.keypoint_icon = this.conf('beamer.keypoint-icon','{\\ding{118}}');
    this.exercise_icon = this.conf('beamer.exercise-icon','{\\ding{46}}');
    this.solution_icon = this.conf('beamer.solution-icon','{\\faChevronDown}')
    //required setups
    var p_latex_program = this.to_latex_program();
    var p_core_packages = this.to_core_packages(p_latex_program);
    var p_extra_packages = this.to_latex_extrapackage(p_latex_program);
    var p_post_setups = this.to_latex_postsetup(p_latex_program);
    ///process the document
    var tex = this.to_beamer();
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
  to_beamer() {
    let outs = [];
    let top = this.presentation.to_tops(this.parser.blocks);
    let frames = this.presentation.to_frames(top);
    ///
    ///WRITE contents
    ///
    let out = this.write_frame_contents(frames);
    outs.push(out);
    ///WRITE each frame
    frames.forEach((frame,i,arr) => {
      let icon = frame.eid?this.exercise_icon:this.keypoint_icon;
      let out = this.write_frame(frame,icon);  
      outs.push(out);
    });
    ///RETURN
    return outs.join('\n')
  }
  write_frame_contents(frames){
    let frameopt = this.conf('beamer.frameopt');
    let outs = [];
    frames.forEach((frame,i,arr) => {
      if(i==0){
        outs.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);      
      }
      let icon = frame.eid?this.exercise_icon:this.keypoint_icon;
      outs.push(`\\item[${icon}] ${frame.title}`);
      if(i+1==arr.length){
        outs.push(`\\end{list}`);    
      }
    });
    ///ASSEMBLE
    var text = outs.join('\n')
    /// decide if we need to change fonts
    var fontsize = '';
    if(frames.length>10){
      fontsize = `small`;
    }
    if(frames.length>15){
      fontsize = `footnotesize`;
    }
    if(frames.length>20){
      fontsize = `scriptsize`;
    }
    if(frames.length>25){
      fontsize = `tiny`;
    }
    if(fontsize){
      text = `{\\${fontsize}{}${text}}`
    }
    ///ASSEMBLE
    outs = [];
    outs.push(`\\begin{frame}`);
    outs.push(`\\frametitle{Contents}`);    
    outs.push(text);
    outs.push(`\\end{frame}`);
    text = outs.join('\n');
    return text;
  }
  write_frame(frame, icon) {
    let all = [];
    ///let my_id = this.get_refmap_value(my.style,'idnum');
    //let re_exercise = /^(ex):(.*)$/i;
    //let v;
    ///EXPERIMENT:
    var title = frame.title;
    let chevrondown = '\\faChevronDown';
    let chevronright = '\\faChevronRight';
    let dtri = '\\MoveDown';
    let endash = '{\\textendash}'
    let sigs = [];
    let frameopt = this.conf('beamer.frameopt');
    let sdigit = `\\ding{108}`
    // 
    //NOTE: main slide
    //
    if(frameopt){
      all.push(`\\begin{frame}[${frameopt}]`)
    }else{
      all.push(`\\begin{frame}`);
    }
    all.push(`\\frametitle{${icon} ${title}}`);    
    frame.contents.forEach((x,i) => {
      if(x.latex){
        all.push('');
        all.push(x.latex.trim());
      }
    })     
    frame.solutions.forEach((o,i,arr) => {
      all.push('');
      //solution items 
      if(i==0){
        all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{0pt}}');
      }
      // var the_icon = this.icon_cdigits[i]||this.icon_writing_hand;
      // if(arr.length==1) the_icon = this.icon_writing_hand;
      var the_icon = `\\textcircled{\\tiny{}${i+1}}`
      all.push(`\\item ${the_icon} \\textit{${o.title}} `);
      if(i+1==arr.length){
        all.push('\\end{list}')
      }
    })
    all.push(`\\end{frame}`);
    all.push('');
    //
    //NOTE: individual slides
    //
    frame.solutions.forEach((o,i,arr) => {     
      //solution slides
      if(frameopt){
        all.push(`\\begin{frame}[${frameopt}]`);
      }else{
        all.push(`\\begin{frame}`);
      }
      // var the_icon = this.icon_cdigits[i]||this.icon_writing_hand;
      // if(arr.length==1) the_icon = this.icon_writing_hand;
      var the_icon = `\\textcircled{\\tiny{}${i+1}}`
      all.push(`\\frametitle{${icon} ${title} }`);
      all.push(`\\framesubtitle{${the_icon} \\textit{${o.title}} ~ ${o.text.trim()}}`);
      o.contents.forEach((x,i) => {
        if(x.latex){
          all.push('');
          all.push(x.latex.trim());
        }
      })
      all.push(`\\end{frame}`);
      all.push('');
    });
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_titlelines(){
    var titlelines = [];
    var block = this.parser.blocks[0];
    var style = {}
    if(block && block.sig=='FRNT'){
      let data = block.data;
      for(let t of data){
        let [key,val] = t;
        if(key=='title'){
          titlelines.push(`\\title{${this.uncode(val,style)}}`);
        }
        else if(key=='subtitle'){
          titlelines.push(`\\subtitle{${this.uncode(val,style)}}`);
        }
        else if(key=='author'){
          titlelines.push(`\\author{${this.uncode(val,style)}}`);
        }
        else if(key=='institute'){
          titlelines.push(`\\institute{${this.uncode(val,style)}}`);
        }
      }
    }
    return titlelines;
  }
}
module.exports = { NitrilePreviewBeamer }
