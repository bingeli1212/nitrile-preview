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
    this.icon_keypoint = this.conf('beamer.keypoint-icon','{\\ding{118}}');
    this.icon_exercise = this.conf('beamer.exercise-icon','{\\ding{46}}');
    this.icon_solution = this.conf('beamer.solution-icon',this.icon_writing_hand)
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
    let top = this.presentation.to_top(this.parser.blocks);
    ///
    ///Process each section, and within each section the subsections
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,i,arr) => {
      let topframe = this.presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          let subframe = this.presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let out = this.write_topics_frame(topframe,subframes);
        d.push(out);
        subframes.forEach((subframe) => {
          let out = this.write_frame(subframe);
          d.push(out);
        });
      }else{
        let out = this.write_frame(topframe);
        d.push(out);
      }
    });
    var main = d.join('\n');
    //
    //table of contents
    //
    var toc = this.write_contents_frame(topframes);
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d.join('\n');
  }
  write_contents_frame(topframes){
    let outs = [];
    topframes.forEach((topframe,i,arr) => {
      if(i==0){
        outs.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);      
      }
      let icon = topframe.isex?this.icon_exercise:this.icon_keypoint;
      if(topframe.subframes){
        icon = this.icon_folder;
      }
      outs.push(`\\item[${icon}] ${topframe.title}`);
      if(i+1==arr.length){
        outs.push(`\\end{list}`);    
      }
    });
    ///ASSEMBLE
    var text = outs.join('\n')
    /// decide if we need to change fonts
    var fontsize = '';
    var num_frames = topframes.length;
    if(num_frames>10){
      fontsize = `small`;
    }
    if(num_frames>15){
      fontsize = `footnotesize`;
    }
    if(num_frames>20){
      fontsize = `scriptsize`;
    }
    if(num_frames>25){
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
  write_topics_frame(frame,subframes){
    var all = [];
    // 
    //NOTE: main contents
    //
    let frameopt = this.conf('beamer.frameopt');
    let icon = this.icon_folder;
    let title = frame.title;
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
    subframes.forEach((subframe,i,arr) => {
      if(i==0){
        all.push('');
        all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}');
      }
      ///'o' is blocks
      let icon = subframe.isex?this.icon_exercise:this.icon_keypoint;
      all.push(`\\item[${icon}]${subframe.title} `);
      if(i+1==arr.length){
        all.push('\\end{list}')
      }
    });  
    all.push(`\\end{frame}`);
    all.push('');
    return all.join('\n')
  }
  write_frame(frame) {
    let all = [];
    ///let my_id = this.get_refmap_value(my.style,'idnum');
    //let re_exercise = /^(ex):(.*)$/i;
    //let v;
    ///EXPERIMENT:
    let frameopt = this.conf('beamer.frameopt');
    let icon = frame.isex?this.icon_exercise:this.icon_keypoint;
    let title = frame.title;
    // 
    //NOTE: main contents
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
        all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}');
      }
      var the_bull = this.icon_solution;
      var the_icon = `\\textcircled{\\tiny{}${i+1}}`
      if(arr.length==1) the_icon = '';
      all.push(`\\item[${the_bull}]${the_icon} \\textit{${o.title}} `);
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
      var the_bull = this.icon_solution;
      var the_icon = `\\textcircled{\\tiny{}${i+1}}`
      if(arr.length==1) the_icon = '';
      all.push(`\\frametitle{${icon} ${title} }`);
      all.push(`\\framesubtitle{${the_bull} ${the_icon} \\textit{${o.title}} ~ ${o.text.trim()}}`);
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
