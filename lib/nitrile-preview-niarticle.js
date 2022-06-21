'use babel';
const { NitrilePreviewLatex  } = require('./nitrile-preview-latex');
class NitrilePreviewArticle extends NitrilePreviewLatex {
  constructor(parser) {
    super(parser);
    this.name='report';
  }
  hdgs_to_part(title,label,style){
    return '';
  }
  hdgs_to_chapter(title,label,style){
    return '';
  }
  hdgs_to_section(title,label,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\section*{${title}}${this.to_latexlabelcmd(label)}`);
    o.push(`\\addcontentsline{toc}{section}{${title}}`);
    return o.join('\n')
  }
  hdgs_to_subsection(title,label,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\subsection*{${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  hdgs_to_subsubsection(title,label,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\subsubsection*{${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  to_document(){
    var translationlines = [];
    this.parser.blocks.forEach((block,i,arr) => {
      if(i==0){
        return;//skip the first block which is the FRNT otherwise it is to generate a chapter
      }
      let x = this.translate_block(block);
      translationlines.push(x);
    });
    var landscape = this.parser.data['article.landscape']?'landscape':'';
    var twocolumn = this.parser.data['article.twocolumn']?'twocolumn':'';
    var mytitle  = this.parser.data['title']||'';
    var myauthor = this.parser.data['author']||'';
    var mydate   = new Date().toLocaleDateString();
    return `\
% !TEX program = upLatex 
\\let\\printglossary\\relax
\\documentclass[article,dvipdfmx,10pt,${landscape},${twocolumn}]{memoir}
${this.to_preamble_essentials_uplatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=20mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\title{${this.uncode(this.parser.style,mytitle)}}
\\author{${this.uncode(this.parser.style,myauthor)}}
\\date{${this.uncode(this.parser.style,mydate)}}
\\renewcommand\\secheadstyle{\\centering\\Large\\normalfont\\noindent} %centering the section title
\\begin{document}
\\begin{titlingpage}
\\pagestyle{empty}
\\maketitle
\\begin{abstract}
\\end{abstract}
\\end{titlingpage}
\\tableofcontents
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
  }
}
module.exports = { NitrilePreviewArticle };
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
async function run(){
  const fs = require('fs');
  const path = require('path');
  const process = require('process');
  const { NitrilePreviewParser } = require('./nitrile-preview-parser');
  for(var i=2; i < process.argv.length; ++i){
    var file = process.argv[i];
    var mdfname = `${file.slice(0,file.length-path.extname(file).length)}.md`;
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(mdfname)
    var translator = new NitrilePreviewArticle(parser);
    var data = translator.to_document();
    var ltxfname = `${file.slice(0,file.length-path.extname(file).length)}.ltx`;
    fs.writeFileSync(ltxfname,data);
    console.log("written to "+ltxfname);
  }
}
if(require.main===module){
  run();
}