'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewBeamer extends NitrilePreviewLatex {
  constructor(parser,program) {
    super(parser,program);
    this.frames = 0;
    this.frameid = 0;
    this.frameopt = '[t]';
    this.eid = 0; //exercise ID
    this.icon_folder   = '{\\ding{229}}';
    this.icon_keypoint = '{\\ding{118}}';
    this.icon_exercise = '{\\ding{46}}';
    this.icon_solution = '{\\ding{45}}';
    this.presentation = new NitrilePreviewPresentation(this);
  }
  to_document() {
    var body = this.to_beamer();
    var titlelines = this.to_titlepage();
    return this.to_latex_document('beamer',[],[],titlelines,body)
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
    return d;
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
    ///ASSEMBLE
    outs = [];
    outs.push(`\\begin{frame}${this.frameopt}`);
    outs.push(`\\frametitle{Table Of Contents}`);    
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
    let icon = this.icon_folder;
    let title = frame.title;
    all.push(`\\begin{frame}${this.frameopt}`)
    all.push(`\\frametitle{${icon} ${title}}`); 
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
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
    let icon = frame.isex?this.icon_exercise:this.icon_keypoint;
    let title = frame.title;
    // 
    //NOTE: main contents
    //
    all.push(`\\begin{frame}${this.frameopt}`)
    all.push(`\\frametitle{${icon} ${title}}`);    
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
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
      all.push(`\\item[${the_bull}] \\textit{${o.title}} `);
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
      all.push(`\\begin{frame}${this.frameopt}`);
      all.push(`\\frametitle{${icon} ${title}}`);
      all.push(`\\framesubtitle{\\textit{${o.title}} ~ \\bfseries ${this.untext(o.body,o.style).trim()}}`);
      o.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })
      all.push(`\\end{frame}`);
      all.push('');
    });
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_titlepage(){
    var titlelines = [];
    var style = {}
    var title = this.conf_to_string('title');
    var subtitle = this.conf_to_string('subtitle');
    var author = this.conf_to_string('author');
    var institute = this.conf_to_string('institute')
    title = this.uncode(title,style);
    subtitle = this.uncode(subtitle,style);
    author = this.uncode(author,style);
    institute = this.uncode(institute,style);
    titlelines.push(`\\title{${title}}`);
    titlelines.push(`\\subtitle{${subtitle}}`);
    titlelines.push(`\\institute{${institute}}`);
    titlelines.push(`\\author{${author}}`);
    return titlelines;
  }
}
module.exports = { NitrilePreviewBeamer }
