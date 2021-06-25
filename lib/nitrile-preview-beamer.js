'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewBeamer extends NitrilePreviewLatex {
  constructor(parser,pname) {
    super(parser,pname);
    this.name = 'beamer';
    this.frames = 0;
    this.frameid = 0;
    this.frameopt = '[t]';
    this.eid = 0; //exercise ID
    this.style = parser.style;
    this.icon_checkedbox = `{$\\blacksquare$}`;
    this.icon_hollowbox = `{$\\square$}`;
    //this.icon_folder   = '{\\ding{229}}';
    //this.icon_keypoint = '{\\ding{118}}';
    //this.icon_exercise = '{\\ding{46}}';
    //this.icon_solution = '{\\ding{45}}';
    this.icon_folder   = this.uncode(this.style,String.fromCodePoint(0x27A5));
    this.icon_keypoint = this.uncode(this.style,String.fromCodePoint(0x2756));
    this.icon_exercise = this.uncode(this.style,String.fromCodePoint(0x270E));
    this.icon_solution = this.uncode(this.style,String.fromCodePoint(0x270D));
    this.presentation = new NitrilePreviewPresentation(this);
  }
  to_document() {
    var body = this.to_beamer();
    var titlelines = this.to_titlepage();
    return this.to_latex_document('beamer',['10pt'],[],titlelines,body)
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
        let out = this.write_frame_folder(`${i+1}`,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,j) => {
          let out = this.write_frame_one(`${i+1}.${j+1}`,subframe);
          d.push(out);
        });
      }else{
        let out = this.write_frame_one(`${i+1}`,topframe);
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
    let outs = [];
    topframes.forEach((topframe,i,arr) => {
      if(i==0){
        outs.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{4pt}}`);      
      }
      let icon = topframe.isex?this.icon_exercise:this.icon_keypoint;
      if(topframe.subframes){
        icon = this.icon_folder;
      }
      outs.push(`\\item[${i+1}.] ${this.uncode(topframe.style,topframe.title)}`);
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
  write_frame_folder(id,frame,subframes){
    var all = [];
    // 
    //NOTE: main contents
    //
    let icon = this.icon_folder;
    all.push(`\\begin{frame}${this.frameopt}`)
    all.push(`\\frametitle{${id}. ${this.uncode(frame.style,frame.title)}}`); 
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })   
    subframes.forEach((subframe,j,arr) => {
      if(j==0){
        all.push('');
        all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{4pt}}');
      }
      ///'o' is blocks
      let icon = subframe.isex?this.icon_exercise:this.icon_keypoint;
      all.push(`\\item[${j+1}.]${this.uncode(subframe.style,subframe.title)} `);
      if(j+1==arr.length){
        all.push('\\end{list}')
      }
    });  
    all.push(`\\end{frame}`);
    all.push('');
    return all.join('\n')
  }
  write_frame_one(id,frame) {
    let all = [];
    let v = null;
    const re_choice = /^(.*?):([\w\/]+)$/;
    ///let my_id = this.get_refmap_value(my.style,'idnum');
    //let re_exercise = /^(ex):(.*)$/i;
    //let v;
    ///EXPERIMENT:
    let icon = frame.isex?this.icon_exercise:this.icon_keypoint;
    // 
    //NOTE: main contents
    //
    all.push(`\\begin{frame}${this.frameopt}`)
    all.push(`\\frametitle{${id}. ${this.uncode(frame.style,frame.title)}}`);    
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })     
    all.push('\\begin{flushleft}');
    frame.solutions.forEach((o,i,arr) => {
      all.push('')
      if((v=re_choice.exec(o.title))!==null){
        let text = this.to_choice(o.style,o.body);
        if(v[1]){
          all.push(`${this.icon_solution} {\\itshape ${this.uncode(o.style,v[1])}} `);
          all.push(`\\hfill\\break`);
        }
        all.push(text);
      }else{
        all.push(`${this.icon_solution} {\\itshape ${this.uncode(o.style,o.title)}} `);
      }
    })
    all.push('\\end{flushleft}')
    all.push(`\\end{frame}`);
    all.push('');
    //
    //NOTE: individual slides
    //
    frame.solutions.forEach((o,i,arr) => {     
      //solution slides
      all.push(`\\begin{frame}${this.frameopt}`);
      if((v=re_choice.exec(o.title))!==null){
        var title = this.uncode(o.style,v[1]);
        var text = this.to_choice(o.style,o.body,v[2]);
      }else{
        var title = this.uncode(o.style,o.title);
        var text = this.untext(o.style,o.body);
      }
      all.push(`\\frametitle{${this.icon_solution} \\itshape ${title}}`);
      all.push(`\\framesubtitle{\\bfseries ${text}}`);
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
    var title      = this.parser.conf_to_string('title');
    var subtitle   = this.parser.conf_to_string('subtitle');
    var author     = this.parser.conf_to_string('author');
    var institute  = this.parser.conf_to_string('institute')
    title = this.uncode(this.style,title);
    subtitle = this.uncode(this.style,subtitle);
    author = this.uncode(this.style,author);
    institute = this.uncode(this.style,institute);
    titlelines.push(`\\title{${title}}`);
    titlelines.push(`\\subtitle{${subtitle}}`);
    titlelines.push(`\\institute{${institute}}`);
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
module.exports = { NitrilePreviewBeamer }
