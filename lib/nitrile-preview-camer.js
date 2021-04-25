'use babel';

const { NitrilePreviewContex } = require('./nitrile-preview-contex');

class NitrilePreviewCamer extends NitrilePreviewContex {

  constructor(parser) {
    super(parser);
    this.name='CAMER';
    this.style = parser.style;
  }
  to_document() {
    var style_chapter = this.conf_to_string('camer.chapter','\\bfd');
    var style_section = this.conf_to_string('camer.section','\\bfa');
    var style_subsection = this.conf_to_string('camer.subsection','\\bf');
    var style_subsubsection = this.conf_to_string('camer.subsubsection','\\bf');
    var style_subsubsubsection = this.conf_to_string('camer.subsubsubsection','\\bf');
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
    if (this.conf_to_string('camer.toc')) {
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

    /// inter-image gaps
    var dist = 0.02;
    //var hdist = istwocol ? `${dist*2}\\textwidth` : `${dist}\\textwidth`;
    var hdist = `0.02\\textwidth`;
    ///layout
    var p_papersize = '';
    var p_layout = '';
    var p_bodyfont = '';
    if (this.conf_to_string('camer.papersize')) {
      var s = `\\setuppapersize[${this.conf_to_string('camer.papersize')}]`;
      p_papersize = s;
    }
    if (this.conf_to_string('camer.layout')) {
      var s = this.conf_to_list('camer.layout');
      var s = `\\setuplayout[${s.join(',')}]`;
      p_layout = s;
    }
    //\\setupbodyfont[linuxlibertineo, ${ this.conf_to_string('bodyfontsizept') } pt]
    if (this.conf_to_string('camer.bodyfont')) {
      var s = this.conf_to_list('camer.bodyfont');
      var s = `\\setupbodyfont[${s.join(',')}]`;
      p_bodyfont = s;
    }
    var post = this.conf_to_list('camer.post');
    var data = `\
% !TEX program = ConTeXt (LuaTeX)
${this.to_preamble_core()}
\\enabletrackers[fonts.missing]
\\setuppapersize[A4]
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
\\setupinteraction[state=start,color=,contrastcolor=]
\\setupcombination[style=small]
\\setupbodyfont[10pt]
${post.join('\n')}
\\starttext
${titlelines.join('\n')}
${toclines.join('\n')}
${texlines.join('\n')}
\\stoptext
    `;
    return data;
  }
}
module.exports = { NitrilePreviewCamer };
