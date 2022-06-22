'use babel';
const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');
class NitrilePreviewBeamer extends NitrilePreviewLatex {
  constructor(parser) {
    super(parser);
    this.name = 'beamer';
    this.frames = 0;
    this.frameid = 0;
    //this.frameopt = '[t]';
    this.frameopt = 'c';
    this.eid = 0; //exercise ID
    this.parskip = 0;
    this.is_enumerate_section = 1;
  }
  to_document() {
    var bodylines = this.to_beamer();
    var titlelines = this.to_beamer_title();
    var titlepagelines = this.to_beamer_titleframe();
    var data_pdflatex = `\
% !TEX program = PdfLatex 
\\documentclass[10pt]{beamer}
${this.to_preamble_essentials_pdflatex()}
\\usepackage{parskip}
\\usepackage{tabularx}
\\usepackage[kerning,spacing]{microtype} 
\\usepackage{tikzsymbols}%Coffeecup
\\setlength\\belowcaptionskip{-8pt}
\\definecolor{titlecolor}{rgb}{0.2,0.2,0.7}
\\begin{document}
${titlepagelines.join('\n')}
${bodylines.join('\n')}
\\end{document}
`;
    var data_uplatex = `\
% !TEX program = upLatex \\\\ dvipdfmx
\\documentclass[uplatex,dvipdfmx,10pt]{beamer}
${this.to_preamble_essentials_uplatex()}
\\usepackage{parskip}
\\usepackage{tabularx}
\\setlength\\belowcaptionskip{-5pt}
${titlelines.join('\n')}
\\begin{document}
\\maketitle
${bodylines.join('\n')}
\\end{document}
`;
    var data_xelatex = `\
% !TEX program = XeLatex
\\documentclass[10pt]{beamer}
${this.to_preamble_essentials_xelatex()}
\\usepackage{parskip}
\\usepackage{tabularx}
\\usepackage[kerning,spacing]{microtype} 
\\setlength\\belowcaptionskip{-8pt}
${titlelines.join('\n')}
\\XeTeXlinebreaklocale "zh"
\\XeTeXlinebreakskip = 0pt plus 1pt
\\begin{document}
\\maketitle
${bodylines.join('\n')}
\\end{document}
`;
    var data_lualatex = `\
% !TEX program = LuaLatex
\\documentclass[10pt]{beamer}
${this.to_preamble_essentials_lualatex()}
\\usepackage{parskip}
\\usepackage{tabularx}
\\usepackage[kerning,spacing]{microtype} 
\\setlength\\belowcaptionskip{-8pt}
${titlelines.join('\n')}
\\begin{document}
\\maketitle
${bodylines.join('\n')}
\\end{document}
`;
    return data_uplatex;
  }
  to_beamer() {
    var presentation = new NitrilePreviewPresentation(this);
    let top = presentation.to_top(this.parser.blocks);
    ///
    ///Process each section, and within each section the subsections
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,j,arr) => {
      let topframe = presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          let subframe = presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let id = `${j+1}`;
        let out = this.write_frame_folder(id,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,k) => {
          let subid = `${k+1}`;
          let out = this.write_one_frame(id,subid,subframe,1,topframe);
          d.push(out);
        });
      }else{
        let id = `${j+1}`;
        let subid = ``;
        let out = this.write_one_frame(id,subid,topframe,0,topframe);
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
      all.push(`\\begin{frame}[${this.frameopt}]`);
      all.push(`\\frametitle{Table Of Contents}`);    
      all.push(`\\framesubtitle{~}`);
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
    all.push(`\\begin{frame}[${this.frameopt}]`)
    all.push(`\\frametitle{${id} ${this.uncode(frame.style,frame.title)}}`); 
    all.push(`\\framesubtitle{~}`);
    //
    //NOTE: frame contents
    //
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })   
    subframes.forEach((subframe,k,arr) => {
      if(k==0){
        all.push('');
        all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{0pt}}');
      }
      ///'o' is blocks
      all.push(`\\item \\underline{${id}.${k+1} ${this.uncode(subframe.style,subframe.title)}} `);
      if(k+1==arr.length){
        all.push('\\end{list}')
      }
    });  
    all.push(`\\end{frame}`);
    all.push('');
    return all.join('\n')
  }
  write_one_frame(id,subid,frame,issub,topframe) {
    let all = [];
    let v = null;
    // 
    //NOTE: main contents
    //
    all.push(`\\begin{frame}[${this.frameopt}]`)
    if(issub){
      all.push(`\\frametitle{${id} ${this.uncode(topframe.style,topframe.title)}}`);    
      all.push(`\\framesubtitle{\\footnotesize\\underline{${id}.${subid} ${this.uncode(frame.style,frame.title)}}}`);
    }else{
      all.push(`\\frametitle{${id} ${this.uncode(topframe.style,topframe.title)}}`);    
      all.push(`\\framesubtitle{~}`);
    }
    ///
    ///NOTE: sort into two different bins
    ///
    var wrap_contents = [];
    var norm_contents = [];
    frame.contents.forEach(x => {
      if(x.id=='wrapfig'||x.id=='wraptab'){
        wrap_contents.push(x);
      }else{
        norm_contents.push(x);
      }
    });
    //
    //NOTE: check if split into columns is needed
    //
    if(wrap_contents.length){
      all.push('\\begin{columns}');
      all.push('\\begin{column}{0.5\\textwidth}')
      norm_contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })         
      all.push('');
      frame.solutions.forEach((o,i,arr) => {
        if(o.choice){
          let text = this.to_choice(o.style,o.body);
          all.push(`\\underline{${this.uncode(o.style,o.title)}} `);
          all.push(`\\hfill\\break`);
          all.push(text);
        }else{
          all.push(`\\underline{${this.uncode(o.style,o.title)}} `);
          all.push(`\\hfill\\break`);
        }
      })  
      all.push('\\end{column}')
      all.push('\\begin{column}{0.5\\textwidth}')
      all.push('\\begin{center}')
      wrap_contents.forEach((x,j) => {
        //'x' is a block
        let bundles = this.body_to_all_bundles(x.style,x.body,x.bodyrow);
        bundles.forEach((bundle,i) => {
          if(i>0){
            all.push('\\\\');
          }
          if(x.id=='wrapfig'){
            let p = this.do_bundle(x.style,bundle,'img');
            all.push(p.img.trim());
          }else if(x.id=='wraptab'){
            let p = this.do_bundle(x.style,bundle,'tab');
            all.push(p.tab.trim());
          }
        });
      })           
      all.push('\\end{center}')
      all.push('\\end{column}')
      all.push('\\end{columns}');
    }else{
      norm_contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })     
      all.push('');
      frame.solutions.forEach((o,i,arr) => {
        if(o.choice){
          let text = this.to_choice(o.style,o.body);
          all.push(`\\underline{${this.uncode(o.style,o.title)}} `);
          all.push(`\\hfill\\break`);
          all.push(text);
        }else{
          all.push(`\\underline{${this.uncode(o.style,o.title)}} `);
          all.push(`\\hfill\\break`);
        }
      })
    }
    all.push('');
    all.push(`\\end{frame}`);
    all.push('');
    //
    //NOTE: individual slides
    //
    frame.solutions.forEach((o,i,arr) => {     
      //solution slides
      let icon = this.icon_dag;
      all.push(`\\begin{frame}[t]`);
      if(o.choice){
        var title = this.uncode(o.style,o.title);
        var text = this.to_choice(o.style,o.body,o.choice);
      }else{
        var title = this.uncode(o.style,o.title);
        var text = this.uncode(o.style,this.join_para(o.body));
      }
      all.push(`\\frametitle{~}`);
      all.push(`\\framesubtitle{\\underline{${title}} ~ ${text}}`);
      o.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })
      all.push('');
      all.push(`\\end{frame}`);
      all.push('');
    });
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_beamer_title(){
    var titlelines = [];
    var title      = this.parser.conf_to_string('title');
    var subtitle   = this.parser.conf_to_string('subtitle');
    var author     = this.parser.conf_to_string('author');
    var institute  = this.parser.conf_to_string('institute')
    title = this.smooth(this.parser.style,title);
    subtitle = this.smooth(this.parser.style,subtitle);
    author = this.smooth(this.parser.style,author);
    institute = this.smooth(this.parser.style,institute);
    titlelines.push(`\\title{${title}}`);
    titlelines.push(`\\subtitle{${subtitle}}`);
    titlelines.push(`\\institute{${institute}}`);
    titlelines.push(`\\author{${author}}`);
    return titlelines;
  }
  to_beamer_titleframe(){
    var titlelines = [];
    var title      = this.parser.conf_to_string('title','&nbsp;');
    var subtitle   = this.parser.conf_to_string('subtitle','&nbsp;');
    var author     = this.parser.conf_to_string('author','&nbsp;');
    var institute  = this.parser.conf_to_string('institute','&nbsp;')
    var date       = new Date().toLocaleDateString();  
    title = this.smooth(this.parser.style,title);
    subtitle = this.smooth(this.parser.style,subtitle);
    author = this.smooth(this.parser.style,author);
    institute = this.smooth(this.parser.style,institute);
    titlelines.push('');
    titlelines.push(`\\begin{frame}`)
    titlelines.push(`\\frametitle{~}`);
    titlelines.push(`\\framesubtitle{~}`);
    titlelines.push(`\\begin{center}`);
    titlelines.push(`{\\Large \\color{titlecolor}${title}}\\\\`);
    titlelines.push(`${subtitle}\\\\`);
    titlelines.push(`${institute}\\\\`);
    titlelines.push(`${author}\\\\`);
    titlelines.push(`${date}`);
    titlelines.push(`\\end{center}`);
    titlelines.push(`\\end{frame}`)
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
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewBeamer };
async function run(){
  const fs = require('fs');
  const path = require('path');
  const process = require('process');
  const { NitrilePreviewParser } = require('./nitrile-preview-parser');
  for(var i=2; i < process.argv.length; ++i){
    var file = process.argv[i];
    var mdfname = `${file.slice(0,file.length-path.extname(file).length)}.md`;
    var texfname = `${file.slice(0,file.length-path.extname(file).length)}.ltx`;
    var parser = new NitrilePreviewParser();
    var translator = new NitrilePreviewBeamer(parser);
    await parser.read_file_async(mdfname)
    await parser.read_import_async();
    var document = translator.to_document();
    await translator.write_text_file(fs,texfname,document);
    console.log(`written to ${texfname}`);
    if(path.extname(file).length==0){
      let { NitrilePreviewRun } = require('./nitrile-preview-run');
      let run = new NitrilePreviewRun();
      await run.run_cmd(`pdflatex ${file}`);
    }
  }
}
if(require.main===module){
  run();
}
