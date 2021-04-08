'use babel';

const { NitrilePreviewContex } = require('./nitrile-preview-contex');

class NitrilePreviewCamer extends NitrilePreviewContex {

  constructor(parser) {
    super(parser);
    this.name='CAMER';
  }
  to_document() {
    var style_chapter = this.conf('context.chapter','\\bfd');
    var style_section = this.conf('context.section','\\bfa');
    var style_subsection = this.conf('context.subsection','\\bf');
    var style_subsubsection = this.conf('context.subsubsection','\\bf');
    var style_subsubsubsection = this.conf('context.subsubsubsection','\\bf');
    ///do translate
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      block.latex = text;
    })
    ///putting them together
    if (this.conf('context.twocolumn')) {
      var texlines = this.to_twocolumn_texlines(this.parser.blocks);
    } else {
      var texlines = this.parser.blocks.map(x => x.latex);
    }
    /// generate title page
    var titlelines = [];
    var mytitle = this.conf('title');
    var myauthor = this.conf('author');
    var myaddr = this.conf('institute');
    var mydate = new Date().toLocaleDateString();
    if (mytitle) {
      titlelines.push(`\\dontleavehmode`);
      titlelines.push(`\\blank[6cm]`);
      titlelines.push(`\\startalignment[center]`);
      titlelines.push(`{\\tfd ${this.uncode(mytitle)}}`);
      titlelines.push(`\\blank[2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(myaddr)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(myauthor)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(mydate)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`\\stopalignment`);
      titlelines.push(`\\page`);
      titlelines.push('');
    }

    /// toc lines
    var toclines = [];
    if (this.conf('context.toc')) {
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
    if (this.conf('context.papersize')) {
      var s = `\\setuppapersize[${this.conf('context.papersize')}]`;
      p_papersize = s;
    }
    /*
    var s_layout = `\\setuplayout[width = ${ this.conf('width') }mm,
                      backspace = ${ this.conf('backspace') }mm,
                      cutspace = ${ this.conf('cutspace') }mm,
                      topspace = ${ this.conf('topspace') }mm,
                      height = ${ this.conf('height') }mm,
                      header = ${ this.conf('header') }mm,
                      footer = ${ this.conf('footer') }mm]`;
                      */
    if (this.conf('context.layout')) {
      var s = this.conf('context.layout').split('\t');
      var s = `\\setuplayout[${s.join(',')}]`;
      p_layout = s;
    }
    //\\setupbodyfont[linuxlibertineo, ${ this.conf('bodyfontsizept') } pt]
    if (this.conf('context.bodyfont')) {
      var s = this.conf('context.bodyfont').split('\t');
      var s = `\\setupbodyfont[${s.join(',')}]`;
      p_bodyfont = s;
    }
    var data = `\
% !TEX program = ConTeXt (LuaTeX)
\\enabletrackers[fonts.missing]
\\setuppapersize[A4]
\\setuppagenumbering[location={header,right},style=]
\\setupindenting[no,medium]
\\setupwhitespace[medium]
\\setscript[hanzi] % hyphenation
\\setuphead[part][number=yes]
\\setuphead[chapter][style=${style_chapter},number=yes]
\\setuphead[section][style=${style_section},number=yes]
\\setuphead[subsection][style=${style_subsection},number=yes]
\\setuphead[subsubsection][style=${style_subsubsection},number=yes]
\\setuphead[subsubsubsection][style=${style_subsubsubsection},number=yes]
\\setupinteraction[state=start,color=,contrastcolor=]
\\enableregime[utf] % enable unicode fonts
\\definefontfamily[linuxlibertine][serif][linuxlibertineo]
\\definefontfamily[linuxlibertine][sans][linuxbiolinumo]
\\definefontfamily[linuxlibertine][tt][linuxlibertinemonoo]
\\definefontfamily[dejavu][serif][dejavuserif]
\\definefontfamily[dejavu][sans][dejavusans]
\\definefontfamily[dejavu][tt][dejavusansmono]
\\definefontfamily[noto][serif][notoserifnormal]
\\definefontfamily[noto][sans][notosansnormal]
\\definefontfamily[noto][tt][notosansmononormal]
\\definefontfamily[zapfdingbats][serif][zapfdingbats]
\\definefontfamily[zapfdingbats][sans][zapfdingbats]
\\definefontfamily[cn][serif][arplsungtilgb]
\\definefontfamily[cn][sans][arplsungtilgb]
\\definefontfamily[tw][serif][arplmingti2lbig5]
\\definefontfamily[tw][sans][arplmingti2lbig5]
\\definefontfamily[jp][serif][ipaexmincho]
\\definefontfamily[jp][sans][ipaexmincho]
\\definefontfamily[kr][serif][baekmukbatang]
\\definefontfamily[kr][sans][baekmukbatang]
\\definemathcommand [arccot] [nolop] {\\mfunction{arccot}}
\\definemathcommand [arsinh] [nolop] {\\mfunction{arsinh}}
\\definemathcommand [arcosh] [nolop] {\\mfunction{arcosh}}
\\definemathcommand [artanh] [nolop] {\\mfunction{artanh}}
\\definemathcommand [arcoth] [nolop] {\\mfunction{arcoth}}
\\definemathcommand [sech]   [nolop] {\\mfunction{sech}}
\\definemathcommand [csch]   [nolop] {\\mfunction{csch}}
\\definemathcommand [arcsec] [nolop] {\\mfunction{arcsec}}
\\definemathcommand [arccsc] [nolop] {\\mfunction{arccsc}}
\\definemathcommand [arsech] [nolop] {\\mfunction{arsech}}
\\definemathcommand [arcsch] [nolop] {\\mfunction{arcsch}}
\\usemodule[ruby]
\\usesymbols[mvs]
\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]
\\setupinteraction[state=start]
\\placebookmarks[part,chapter,section]
\\definecolor[cyan][r=0,g=1,b=1] % a RGB color
\\definecolor[magenta][r=1,g=0,b=1] % a RGB color
\\definecolor[darkgray][r=.35,g=.35,b=.35] % a RGB color
\\definecolor[gray][r=.5,g=.5,b=.5] % a RGB color
\\definecolor[lightgray][r=.75,g=.75,b=.75] % a RGB color
\\definecolor[brown][r=.72,g=.52,b=.04] % a RGB color
\\definecolor[lime][r=.67,g=1,b=.18] % a RGB color
\\definecolor[olive][r=.5,g=.5,b=0] % a RGB color
\\definecolor[orange][r=1,g=.5,b=0] % a RGB color
\\definecolor[pink][r=1,g=.75,b=.79] % a RGB color
\\definecolor[teal][r=0,g=.5,b=.5] % a RGB color
\\definecolor[purple][r=.8,g=.13,b=.13] % a RGB color
\\definecolor[violet][r=.5,g=0,b=.5] % a RGB color
\\definedescription[latexdesc][
  headstyle=normal, style=normal, align=flushleft, 
  alternative=hanging, width=fit, before=, after=]
\\definedescription[DL][
  headstyle=bold, style=normal, align=flushleft, 
  alternative=hanging, width=broad]
\\definedescription[HL][
  headstyle=normal, style=normal, align=flushleft, 
  alternative=hanging, width=broad]
\\definefontsize[sm]
\\definefontsize[xsm]
\\definefontsize[xxsm]
\\definefontsize[xxxsm]
\\definefontsize[big]
\\definefontsize[xbig]
\\definefontsize[xxbig]
\\definefontsize[huge]
\\definefontsize[xhuge]
\\definebodyfontenvironment
  [default]
  [sm=.9,xsm=.8,xxsm=.7,xxxsm=.5,
   big=1.2,xbig=1.4,xxbig=1.7,huge=2.0,xhuge=2.3]
\\definefloat[listing][listings]
\\setupbodyfont[11pt]
\\setupcombination[style=small]
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
