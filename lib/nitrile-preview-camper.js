'use babel';

const { NitrilePreviewContex } = require('./nitrile-preview-contex');

class NitrilePreviewCamper extends NitrilePreviewContex {

  constructor(parser) {
    super(parser);
    this.name='camper';
    this.style = parser.style;
  }
  to_document() {
    var style_chapter = this.conf_to_string('chapter','\\bfd');
    var style_section = this.conf_to_string('section','\\bfa');
    var style_subsection = this.conf_to_string('subsection','\\bf');
    var style_subsubsection = this.conf_to_string('subsubsection','\\bf');
    var style_subsubsubsection = this.conf_to_string('subsubsubsection','\\bf');
    var style_setuppapersize = this.conf_to_string('papersize','A4');
    var style_setupbodyfont = this.conf_to_string('bodyfont','dejavu,10pt');
    ///do translate
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      block.latex = text;
    })
    ///putting them together
    var texlines = this.parser.blocks.map(x => x.latex);
    /// generate title page
    var titlelines = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    if (mytitle) {
      titlelines.push(`\\dontleavehmode`);
      titlelines.push(`\\blank[6cm]`);
      titlelines.push(`\\startalignment[center]`);
      titlelines.push(`{\\tfd ${this.uncode(this.style,mytitle)}}`);
      titlelines.push(`\\blank[2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(this.style,myaddr)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(this.style,myauthor)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.uncode(this.style,mydate)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`\\stopalignment`);
      titlelines.push(`\\page`);
      titlelines.push('');
    }
    /// toc lines
    var toclines = [];
    var toc = this.conf_to_bool('toc');
    if(toc){
      if(1) {

        toclines = this.to_toclines();
      } else if (1) {
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
${this.to_preamble_symbols()}
${this.to_preamble_langs()}
\\enabletrackers[fonts.missing]
\\setuppagenumbering[location={header,right},style=]
\\setupindenting[yes,medium]
%\\setupwhitespace[big]
\\setscript[hanzi] % hyphenation
\\setuphead[part][number=yes]
\\setuphead[chapter][style=${style_chapter},number=yes]
\\setuphead[section][style=${style_section},number=yes]
\\setuphead[subsection][style=${style_subsection},number=yes]
\\setuphead[subsubsection][style=${style_subsubsection},number=yes]
\\setuphead[subsubsubsection][style=${style_subsubsubsection},number=yes]
\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]
\\setupinteraction[state=start,color=,contrastcolor=]
\\placebookmarks[part,chapter,section,subsection]
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
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
  }
  hdgs_to_part(title,label,partnum,chapternum,level,style){
    var raw = this.revise(title);
    var title = this.uncode(style,title);
    var num = this.int_to_letter_I(partnum);
    var text = `\
\\startpart[title={${title}},reference={${label}},bookmark={${raw}}]
\\dontleavehmode
\\startalignment[center]
\\blank[6cm]
{\\tfa Part ${num}}
\\blank[1cm]
{\\tfd ${title}}
\\stopalignment
\\stoppart
    `;
    return text;
  }
  to_toclines(){
    var all = [];
    all.push('');
    all.push(`\\startalignment[flushleft]`);
    all.push(`\\tfd Table Of Contents`);
    all.push(`\\stopalignment`);
    all.push('\\startlines')
    this.parser.blocks.forEach((block) => {
      var {sig,hdgn,name,title,label,level,partnum,chapternum,style} = block;
      if(sig=='HDGS'){
        if(this.parser.num_part && this.parser.num_chapter){
          if(hdgn==0 && name=='part'){
            title = this.uncode(style,title);
            label = label||`${partnum}`;
            all.push(`Part ${partnum} ~ ${title}\\hfill\\at[${label}]`);
          }else if(hdgn==0 && name=='chapter'){
            title = this.uncode(style,title);
            label = label||`${partnum}.${chapternum}`;
            all.push(`~~~~${partnum}.${chapternum} ~ ${title}\\hfill\\at[${label}]`)
          }
        }
        else if(this.parser.num_chapter){
          if(hdgn==0 && name=='chapter'){
            title = this.uncode(style,title);
            label = label||`${partnum}.${chapternum}`;
            all.push(`${chapternum} ~ ${title}\\hfill\\at[${label}]`)
          }
        }
        else if(this.parser.num_section){
          if(hdgn==1){
            title = this.uncode(style,title);
            label = label||`${partnum}.${chapternum}.${level}`;
            all.push(`${level} ~ ${title}\\hfill\\at[${label}]`)
          }
        }
      }
    })
    all.push('\\stoplines')
    return all;
  }
}
module.exports = { NitrilePreviewCamper };
