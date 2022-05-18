'use babel';
const { NitrilePreviewLatex  } = require('./nitrile-preview-latex');
class NitrilePreviewReport extends NitrilePreviewLatex {
  constructor(parser) {
    super(parser);
    this.name='report';
    this.style = parser.style;
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
    var titlelines = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var mydate   = new Date().toLocaleDateString();
    titlelines.push(`\\title{${this.uncode(this.style,mytitle)}}`);
    titlelines.push(`\\author{${this.uncode(this.style,myauthor)}}`);
    titlelines.push(`\\date{${this.uncode(this.style,mydate)}}`);
    return `\
% !TEX program = upLatex 
\\let\\printglossary\\relax
\\documentclass[dvipdfmx,10pt]{memoir}
${this.to_preamble_essentials_uplatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=20mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\renewcommand\\secheadstyle{\\centering\\Large\\normalfont\\noindent}
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
module.exports = { NitrilePreviewReport };
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
    await parser.read_import_async();
    var translator = new NitrilePreviewReport(parser);
    var data = translator.to_document();
    var ltxfname = `${file.slice(0,file.length-path.extname(file).length)}.ltx`;
    fs.writeFileSync(ltxfname,data);
    console.log("written to "+ltxfname);
  }
}
if(require.main===module){
  run();
}
