'use babel';
const { rawListeners } = require('process');
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
class NitrilePreviewChampion extends NitrilePreviewContex {
  constructor(parser) {
    super(parser);
    this.name='camper';
    this.style = parser.style;
    this.contex_papersize = 'A5';
    this.contex_bodyfontsize = 10;
    this.contex_bodylineheight = 1;
    this.contex_whitespacesize = 0;
    this.contex_bodyfontfamily = 'linux';
    this.contex_indenting = 'yes,medium';
    this.contex_style_chapter = '\\tfd';
    this.contex_style_section = '\\bfa';
    this.contex_style_subsection = '\\bf';
    this.contex_style_subsubsection = '\\bf';
    this.contex_style_subsubsubsection = '\\bf';
  }
  hdgs_to_part(title,label,style){
    var label = label||`partnum.${style.__partnum}`;
    return `\
\\startpart[title={${this.uncode(style,title)}},reference={${label}}] 
\\dontleavehmode 
\\startalignment[flushleft] 
\\blank[0cm] 
{\\tfb Part ${style.__partnum}} 
\\blank[0.3cm] 
{\\tfd ${this.uncode(style,title)}} 
\\stopalignment 
\\stoppart`;
  }
  to_document() {
    return `\
% !TEX program = context
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_definecolors()}
${this.to_preamble_langs()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: preamble
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${this.to_preamble()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\starttext
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: titlepage
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${this.to_titlepage()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: frontmatter   
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\startfrontmatter
${this.to_frontmatter()}
\\stopfrontmatter
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: bodymatter
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\startbodymatter
${this.to_bodymatter()}
\\stopbodymatter
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: appendices
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\startappendices
${this.to_appendices()}
\\stopappendices
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\stoptext`;
  }
  to_bodymatter(){
    var lines = [];
    this.parser.blocks.forEach((block,i,arr) => {
      if(i==0){
        return;//skip the first block which is the FRNT otherwise it is to generate a chapter
      }
      let x = this.translate_block(block);
      lines.push(x);
    });
    return lines.join('\n');
  }
  to_titlepage(){
    let fname = this.parser.data['titlepagelines'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8");
      return lines;
    }
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    return `\
\\startstandardmakeup
\\startalignment[center]
{\\tfd ${this.uncode(this.style,mytitle)}}
\\blank[2cm]
{\\tfa ${this.uncode(this.style,myaddr)}}
\\blank[0.2cm]
{\\tfa ${this.uncode(this.style,myauthor)}}
\\blank[0.2cm]
{\\tfa ${this.uncode(this.style,mydate)}}
\\blank[0.2cm]
\\stopalignment
\\stopstandardmakeup`;
  }
  to_frontmatter(){
    let fname = this.parser.data['frontmatterlines'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8");
      return lines;
    }
    return `\
\\completecontent`;
  }
  to_preamble(){
    let fname = this.parser.data['preamblelines'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8");
      return lines;
    }
    return ``;
  }
  to_appendices(){
    let fname = this.parser.data['appendiceslines'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8");
      return lines;
    }
    return `\
\\setupcombinedlist[content][level=1]% sections etc. of appendices not in TOC
\\chapter{Index} \\switchtobodyfont[10pt] \\placeindex`;
  }
}
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewChampion };
async function run(){
  const fs = require('fs');
  const path = require('path');
  const process = require('process');
  const { NitrilePreviewParser } = require('./nitrile-preview-parser');
  for(var i=2; i < process.argv.length; ++i){
    var file = process.argv[i];
    var mdfname = `${file.slice(0,file.length-path.extname(file).length)}.md`;
    var texfname = `${file.slice(0,file.length-path.extname(file).length)}.cex`;
    var parser = new NitrilePreviewParser();
    var translator = new NitrilePreviewChampion(parser);
    await parser.read_file_async(mdfname)
    await parser.read_import_async();
    var document = translator.to_document();
    await translator.write_text_file(fs,texfname,document);
    console.log(`written to ${texfname}`);
  }
}
if(require.main===module){
  run();
}
