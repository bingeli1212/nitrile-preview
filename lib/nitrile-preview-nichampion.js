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
    var translationlines = this.to_translationlines();
    var titlepagelines = this.to_titlepagelines();
    var frontmatterlines = this.to_frontmatterlines();
    var appendiceslines = this.to_appendiceslines();
    return     `\
% !TEX program = context
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_definecolors()}
${this.to_preamble_langs()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: preamblelines
${this.to_preamblelines().join('\n')}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\starttext
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: titlepagelines
${titlepagelines.join('\n')}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: frontmatterlines   
\\startfrontmatter
${frontmatterlines.join('\n')}
\\stopfrontmatter
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: translationlines
\\startbodymatter
${translationlines.join('\n')}
\\stopbodymatter
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%: appendices
\\startappendices
${appendiceslines.join('\n')}
\\stopappendices
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\stoptext`;
  }
  to_translationlines(){
    var translationlines = [];
    this.parser.blocks.forEach((block,i,arr) => {
      if(i==0){
        return;//skip the first block which is the FRNT otherwise it is to generate a chapter
      }
      let x = this.translate_block(block);
      translationlines.push(x);
    });
    return translationlines;
  }
  to_titlepagelines(){
    let fname = this.parser.data['titlepagelines'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8").split('\n');
      return lines;
    }
    var lines = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    lines.push(`\\startstandardmakeup`)
    lines.push(`\\startalignment[center]`);
    lines.push(`{\\tfd ${this.uncode(this.style,mytitle)}}`);
    lines.push(`\\blank[2cm]`);
    lines.push(`{\\tfa ${this.uncode(this.style,myaddr)}}`);
    lines.push(`\\blank[0.2cm]`);
    lines.push(`{\\tfa ${this.uncode(this.style,myauthor)}}`);
    lines.push(`\\blank[0.2cm]`);
    lines.push(`{\\tfa ${this.uncode(this.style,mydate)}}`);
    lines.push(`\\blank[0.2cm]`);
    lines.push(`\\stopalignment`);
    lines.push(`\\stopstandardmakeup`)
    return lines;
  }
  to_frontmatterlines(){
    let fname = this.parser.data['frontmatterlines'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8").split('\n');
      return lines;
    }
    let lines = [];
    lines.push(`\\completecontent`);
    return lines;
  }
  to_part_page(title,style){
    return `\
\\dontleavehmode
\\startalignment[center]
\\blank[6cm]
{\\tfa Part ${style.__partnum}}
\\blank[1cm]
{\\tfd ${this.uncode(style,title)}}
\\stopalignment
\\stoppart`;
  }
  to_preamblelines(){
    let fname = this.parser.data['preamblelines'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8").split('\n');
      return lines;
    }
    let lines = [];
    return lines;
  }
  to_appendiceslines(){
    let fname = this.parser.data['appendiceslines'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8").split('\n');
      return lines;
    }
    let lines = [];
    lines.push(`\\setupcombinedlist[content][level=1]% sections etc. of appendices not in TOC`);
    lines.push(`\\chapter{Index} \\switchtobodyfont[10pt] \\placeindex`);
    return lines;
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
