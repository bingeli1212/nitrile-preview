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
    console.log('keypoint',this.keypoint_icon);
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
    this.keypoint_icon = this.conf('beamer.keypoint-icon','{\\faLeaf}');
    this.exercise_icon = this.conf('beamer.exercise-icon','{\\faPencil}');
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
    ///separate frames from non-exercises and exercises
    ///
    let main_frames = [];
    let ex_frames = [];
    for(let frame of frames){
      if(frame.eid){
        ex_frames.push(frame);
      }else{
        main_frames.push(frame);
      }
    }
    if(main_frames.length){
      ///
      ///write main frames including the topics
      ///
      let all = [];
      main_frames.forEach((frame,i,arr) => {
        if(i==0){
          let frameopt = this.conf('beamer.frameopt');
          frameopt = (this.string_has_item(frameopt,'t'))?"[t]":"";
          all.push(`\\begin{frame}${frameopt}`);
          all.push(`\\frametitle{Contents}`);    
          all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);      
        }
        all.push(`\\item[${this.keypoint_icon}] ${frame.title}`);
        if(i+1==arr.length){
          all.push(`\\end{list}`);    
          all.push(`\\end{frame}`);
        }
      });
      outs.push(all.join('\n'));
      main_frames.forEach((frame) => {
        let out = this.write_frame(frame,this.keypoint_icon);
        outs.push(out);
      });
    }
    if(ex_frames.length){
      ///
      ///write ex frames including the topics
      ///
      let all = [];
      ex_frames.forEach((frame,i,arr) => {
        if(i==0){
          let frameopt = this.conf('beamer.frameopt');
          frameopt = (this.string_has_item(frameopt,'t'))?"[t]":"";
          all.push(`\\begin{frame}${frameopt}`);
          all.push(`\\frametitle{Exercises}`);    
          all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);    
        }
        all.push(`\\item[${this.exercise_icon}] ${frame.title}`);
        if(i+1==arr.length){
          all.push(`\\end{list}`);    
          all.push(`\\end{frame}`);
        }
      });
      outs.push(all.join('\n'));
      ex_frames.forEach((frame) => {
        let out = this.write_frame(frame,this.exercise_icon);
        outs.push(out);
      });
    }
    return outs.join('\n');
  }
  write_frame(frame, icon) {
    let all = [];
    ///let my_id = this.get_refmap_value(my.style,'idnum');
    //let re_exercise = /^(ex):(.*)$/i;
    //let v;
    ///EXPERIMENT:
    var title = frame.title;
    let checkmark = this.unmask('&checkmark;');
    let box = this.unmask('&BallotBox;');
    let cbox = this.unmask('&BallotBoxWithCheck;');
    let chevrondown = this.unmask('&ChevronDown;');
    let edit = this.unmask('&Edit;');
    let dtri = '\\MoveDown';
    let endash = '{\\textendash}'
    let sigs = [];
    let frameopt = this.conf('beamer.frameopt');
    frameopt = (this.string_has_item(frameopt,'t'))?"[t]":"";
    /*
    let cdigits = [ '\\ding{172}','\\ding{173}','\\ding{174}','\\ding{175}','\\ding{176}',
                    '\\ding{177}','\\ding{178}','\\ding{179}','\\ding{180}','\\ding{181}'];
    */
   let cdigits = [ '\\ding{202}',
                   '\\ding{203}',
                   '\\ding{204}',
                   '\\ding{205}',
                   '\\ding{206}',
                   '\\ding{207}',
                   '\\ding{208}',
                   '\\ding{209}',
                   '\\ding{210}',
                   '\\ding{211}'];
    if(frame.solutions.length){
      
      /// write the main slide first
      all.push(`\\begin{frame}${frameopt}`);
      all.push(`\\frametitle{${icon} ${title}}`);    
      frame.contents.forEach((x,i) => {
        all.push('');
        all.push(x.latex.trim());
      })     
    
      frame.solutions.forEach((o,i,arr) => {
        all.push('');
        if(i==0){
          all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{0pt}}');
        }
        all.push(`\\item \\textit{${o.title}} : \\rule{4em}{0.4pt} `);
        if(i+1==arr.length){
          all.push('\\end{list}')
        }
      })
      
      all.push(`\\end{frame}`);
      all.push('');

      /// Write individual 'solution' slides
      frame.solutions.forEach((o,i,arr) => {     
        all.push(`\\begin{frame}${frameopt}`);
        all.push(`\\frametitle{${icon} ${title} }`);
        all.push(`\\framesubtitle{\\textit{${o.title}} : \\underline{${o.text.trim()}}}`);

        o.contents.forEach((x,i) => {
          all.push('');
          all.push(x.latex.trim());
        })
              
        all.push(`\\end{frame}`);
        all.push('');
      });
    }

    else if(frame.topics.length){

      ///write main slides with topics
      all.push(`\\begin{frame}${frameopt}`);
      all.push(`\\frametitle{${icon} ${title}}`);    
      frame.contents.forEach((x,i) => {
        all.push('');
        all.push(x.latex.trim());
      })      
      frame.topics.forEach((o,i,arr) => {
        ///topic items
        if(i==0){
          all.push('');
          all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);
        }
        all.push(`\\item[${cdigits[i]}] \\textsl{${o.title}}`);
        if(i+1==arr.length){
          all.push('\\end{list}')
        }else{
          
        }
      });
      all.push(`\\end{frame}`);
      all.push('');

      ///write each topic-slides
      frame.topics.forEach((o,i,arr) => {     
        all.push(`\\begin{frame}${frameopt}`);
        all.push(`\\frametitle{${icon} ${title} }`);
        all.push('');
        all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}}`);
        all.push(`\\item[${cdigits[i]}] \\textsl{${o.title}}`);
        o.contents.forEach((x,i) => {
          all.push('');
          all.push(x.latex.trim());
        })
        all.push('');
        all.push(`\\end{list}`)
        all.push(`\\end{frame}`);
        all.push('');
      });
    }

    else {

      /// write only main slides
      all.push(`\\begin{frame}${frameopt}`);
      all.push(`\\frametitle{${icon} ${title}}`);    
      frame.contents.forEach((x,i) => {
        all.push('');
        all.push(x.latex.trim());
      })      
      all.push(`\\end{frame}`);
      all.push('');
    }

    return all.join('\n');
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
