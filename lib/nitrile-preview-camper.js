'use babel';

const { NitrilePreviewContex } = require('./nitrile-preview-contex');

class NitrilePreviewCamper extends NitrilePreviewContex {

  constructor(parser) {
    super(parser);
    this.name='CAMPER';
    this.style = parser.style;
  }
  to_document() {
    var style_chapter = this.conf_to_string('camper.chapter','\\bfd');
    var style_section = this.conf_to_string('camper.section','\\bfa');
    var style_subsection = this.conf_to_string('camper.subsection','\\bf');
    var style_subsubsection = this.conf_to_string('camper.subsubsection','\\bf');
    var style_subsubsubsection = this.conf_to_string('camper.subsubsubsection','\\bf');
    var style_setuppapersize = this.conf_to_string('camper.setuppapersize','A4');
    var style_setupbodyfont = this.conf_to_string('camper.setupbodyfont','linux,11pt');
    ///do translate
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      block.latex = text;
    })
    ///putting them together
    var texlines = this.parser.blocks.map(x => x.latex);
    /// generate title page
    var titlelines = [];
    var mytitle = this.conf_to_string('title');
    var myauthor = this.conf_to_string('author');
    var myaddr = this.conf_to_string('institute');
    var mydate = new Date().toLocaleDateString();
    var style = this.style;
    if (mytitle) {
      titlelines.push(`\\dontleavehmode`);
      titlelines.push(`\\blank[6cm]`);
      titlelines.push(`\\startalignment[center]`);
      titlelines.push(`{\\tfd ${this.uncode(style,mytitle)}}`);
      titlelines.push(`\\blank[2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(style,myaddr)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(style,myauthor)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(style,mydate)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`\\stopalignment`);
      titlelines.push(`\\page`);
      titlelines.push('');
    }
    /// toc lines
    var toclines = [];
    if (this.conf_to_string('camper.toc')) {
      if (1) {
        toclines.push(`\\setupcombinedlist[content][list={part,chapter,section}]`);
        toclines.push(`\\completecontent[criterium=all]`);
        toclines.push('');
      } else {
        toclines.push(`\\setupcombinedlist[content][list={part,section,subsection}]`);
        toclines.push(`\\placecontent`);
        toclines.push('');
      }
    }
    var data = `\
% !TEX program = ConTeXt (LuaTeX)
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_fontsizes()}
${this.to_preamble_essentials()}
\\enabletrackers[fonts.missing]
\\setuppagenumbering[location={header,right},style=]
\\setupindenting[no,medium]
\\setupwhitespace[big]
\\setscript[hanzi] % hyphenation
\\setuphead[part][number=yes]
\\setuphead[chapter][style=${style_chapter},number=yes]
\\setuphead[section][style=${style_section},number=yes]
\\setuphead[subsection][style=${style_subsection},number=yes]
\\setuphead[subsubsection][style=${style_subsubsection},number=yes]
\\setuphead[subsubsubsection][style=${style_subsubsubsection},number=yes]
\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]
\\setupinteraction[state=start,color=,contrastcolor=]
\\placebookmarks[part,chapter,section]
\\setupcombination[style=small]
\\setuppapersize[${style_setuppapersize}]
\\setupbodyfont[${style_setupbodyfont}]
\\starttext
${titlelines.join('\n')}
${toclines.join('\n')}
${texlines.join('\n')}
\\stoptext
    `;
    return data;
  }
  lang_to_cjk(s,fn){
    return s;
  }
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
  }
}
module.exports = { NitrilePreviewCamper };
