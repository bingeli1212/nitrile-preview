'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewBeamer extends NitrilePreviewLatex {
  constructor(parser,pname) {
    super(parser,pname);
    this.name = 'beamer';
    this.frames = 0;
    this.frameid = 0;
    this.frameopt = '[t,fragile]';
    this.eid = 0; //exercise ID
    this.style = parser.style;
    this.icon_checkedbox = `{$\\blacksquare$}`;
    this.icon_hollowbox = `{$\\square$}`;
    this.icon_coffeecup   = '{\\Coffeecup}';//package "tikzsymbols"
    this.icon_writinghand = '{\\ding{45}}';//package "pifont"
    //this.icon_keypoint = '{\\ding{118}}';
    //this.icon_exercise = '{\\ding{46}}';
    // this.icon_folder   = this.uncode(this.style,String.fromCodePoint(0x27A5));
    //this.icon_keypoint = this.uncode(this.style,String.fromCodePoint(0x2756));
    //this.icon_exercise = this.uncode(this.style,String.fromCodePoint(0x270E));
    //this.icon_solution = this.uncode(this.style,String.fromCodePoint(0x270D));
    this.presentation = new NitrilePreviewPresentation(this);
    this.postsetup = [];
    this.postsetup.push('\\usepackage{tikzsymbols}');//for \Coffeecup
    this.postsetup.push('\\usepackage{parskip}');
    this.postsetup.push(`\\usepackage[overlap,CJK]{ruby}`);
    this.postsetup.push(`\\renewcommand\\rubysep{0.0ex}`);
    this.postsetup.push(`\\setlength\\belowcaptionskip{-8pt}`);
  }
  to_document() {
    var body = this.to_beamer();
    var titlelines = this.to_titlepage();
    var toc = this.conf_to_bool('toc');
    return this.to_latex_document('beamer',['10pt'],this.postsetup,titlelines,toc,body)
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
          let id = `${i+1}.${j+1}`;
          let order = `${i+1}.${j+1}`;
          let icon = this.icon_coffeecup;
          let out = this.write_one_frame(id,order,icon,subframe,1,topframe);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = `${i+1}`;
        let icon = ``;
        let out = this.write_one_frame(id,order,icon,topframe,0,topframe);
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
        all.push(`\\item[${label}] ${title}`);
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
      all.push(`\\begin{frame}${this.frameopt}`);
      all.push(`\\frametitle{Table Of Contents}`);    
      all.push(`\\framesubtitle{~}`);
      if(1){
        all.push(`\\begin{tikzpicture}[overlay, remember picture]`);
        all.push(`  \\node[at=(current page.center),xshift=3mm,yshift=-3mm] {`);
        all.push(`  };`);
        all.push(`\\end{tikzpicture}`);
      }
      if(1){
        all.push(`\\vspace*{-7mm}`);
      }
      all.push(text);
      all.push(`\\end{frame}`);
    });
    return all.join('\n');
  }
  write_frame_folder(id,frame,subframes){
    var all = [];
    // 
    //NOTE: main contents
    //
    let icon = this.icon_coffeecup;
    all.push(`\\begin{frame}${this.frameopt}`)
    all.push(`\\frametitle{${id} ${this.uncode(frame.style,frame.title)}}`); 
    all.push(`\\framesubtitle{~}`);
    //
    //NOTE: frame board
    //
    if(frame.boardname){
      all.push(`\\begin{tikzpicture}[overlay, remember picture]`);
      all.push(`  \\node[at=(current page.center),xshift=3mm,yshift=-3mm] {`);
      all.push(`      \\includegraphics[width=114mm,height=80mm]{${frame.boardname}}`);
      all.push(`  };`);
      all.push(`\\end{tikzpicture}`);
    }else{
      all.push(`\\begin{tikzpicture}[overlay, remember picture]`);
      all.push(`  \\node[at=(current page.center),xshift=3mm,yshift=-3mm] {`);
      all.push(`  };`);
      all.push(`\\end{tikzpicture}`);
    }
    //
    //NOTE: lower
    //
    all.push(`\\vspace*{-7mm}`);
    //
    //NOTE: frame contents
    //
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })   
    subframes.forEach((subframe,j,arr) => {
      if(j==0){
        all.push('');
        all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{16pt}}');
      }
      ///'o' is blocks
      all.push(`\\item[${icon}] \\itshape ${this.uncode(subframe.style,subframe.title)} `);
      if(j+1==arr.length){
        all.push('\\end{list}')
      }
    });  
    all.push(`\\end{frame}`);
    all.push('');
    return all.join('\n')
  }
  write_one_frame(id,order,icon,frame,issub,topframe) {
    let all = [];
    let v = null;
    // 
    //NOTE: main contents
    //
    all.push(`\\begin{frame}${this.frameopt}`)
    if(issub){
      all.push(`\\frametitle{${order} ${this.uncode(topframe.style,topframe.title)}}`);    
      all.push(`\\framesubtitle{\\footnotesize\\itshape ${icon} ${this.uncode(frame.style,frame.title)}}`);
    }else{
      all.push(`\\frametitle{${order} ${this.uncode(topframe.style,topframe.title)}}`);    
      all.push(`\\framesubtitle{~}`);
    }
    //
    //NOTE: frame board
    //
    if(frame.boardname){
      all.push(`\\begin{tikzpicture}[overlay, remember picture]`);
      all.push(`  \\node[at=(current page.center),xshift=3mm,yshift=-3mm] {`);
      all.push(`      \\includegraphics[width=114mm,height=80mm]{${frame.boardname}}`);
      all.push(`  };`);
      all.push(`\\end{tikzpicture}`);
    }else{
      all.push(`\\begin{tikzpicture}[overlay, remember picture]`);
      all.push(`  \\node[at=(current page.center),xshift=3mm,yshift=-3mm] {`);
      all.push(`  };`);
      all.push(`\\end{tikzpicture}`);
    }
    //
    //NOTE: lower
    //
    all.push(`\\vspace*{-7mm}`);
    //
    //NOTE: frame contents
    //
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
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
    all.push(`\\end{frame}`);
    all.push('');
    //
    //NOTE: individual slides
    //
    frame.solutions.forEach((o,i,arr) => {     
      //solution slides
      let icon = this.icon_writinghand;
      all.push(`\\begin{frame}${this.frameopt}`);
      if(o.choice){
        var title = this.uncode(o.style,o.title);
        var text = this.to_choice(o.style,o.body,o.choice);
      }else{
        var title = this.uncode(o.style,o.title);
        var text = this.uncode(o.style,this.join_para(o.body));
      }
      all.push(`\\frametitle{~}`);
      all.push(`\\framesubtitle{${icon} \\itshape ${title} ~ ${text}}`);
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
    title = this.smooth(title);
    subtitle = this.smooth(subtitle);
    author = this.smooth(author);
    institute = this.smooth(institute);
    titlelines.push(`\\title{${title}}`);
    titlelines.push(`\\subtitle{${subtitle}}`);
    titlelines.push(`\\institute{${institute}}`);
    titlelines.push(`\\author{${author}}`);
    return titlelines;
  }
  to_choice(style,body,check){
    body = body.filter((s) => s.length)
    var all = [];
    all.push('\\begingroup')
    all.push(`\\renewcommand{\\arraystretch}{1.1}`);
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
    all.push('\\endgroup')
    return all.join('\n');  
  }
}
module.exports = { NitrilePreviewBeamer }
