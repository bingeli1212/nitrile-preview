'use babel';

const { NitrilePreviewContex } = require('./nitrile-preview-contex');

class NitrilePreviewCamper extends NitrilePreviewContex {

  constructor(parser) {
    super(parser);
    this.name='camper';
    this.style = parser.style;
    this.contex_papersize = 'A5';
    this.contex_bodyfont = 'linux,10pt';
    this.contex_interlinespace = '11.5pt';
    this.contex_inlinelinespace_small = '8pt'
    this.contex_whitespace = '5pt';
    this.contex_indenting = 'no';
    this.context_style_chapter = '\\bfd';
    this.context_style_section = '\\bfa';
    this.context_style_subsection = '\\bf';
    this.context_style_subsubsection = '\\bf';
    this.context_style_subsubsubsection = '\\bf';
  }
  to_document() {
    this.build_default_idnum_map();
    var style_chapter = this.conf_to_string('chapter','\\bfd');
    var style_section = this.conf_to_string('section','\\bfa');
    var style_subsection = this.conf_to_string('subsection','\\bf');
    var style_subsubsection = this.conf_to_string('subsubsection','\\bf');
    var style_subsubsubsection = this.conf_to_string('subsubsubsection','\\bf');
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
    var toclines = this.to_toclines();
    if (0) {
      toclines.push(`\\setupcombinedlist[content][list={part,chapter,section}]`);
      toclines.push(`\\completecontent[criterium=all]`);
      toclines.push('');
    } 
    if (0) {
      toclines.push(`\\setupcombinedlist[content][list={part,section,subsection}]`);
      toclines.push(`\\placecontent`);
      toclines.push('');
    }
    var data = `\
% !TEX program = ConTeXt (LuaTeX)
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_essentials()}
${this.to_preamble_caption()}
${this.to_preamble_definecolors()}
${this.to_preamble_langs()}
${this.to_preamble_body()}
\\enabletrackers[fonts.missing]
\\setuppagenumbering[location={header,right},style=]
\\setuppagenumbering[state=stop]
\\setuplayout[topspace=10mm,
  header=10mm,
  footer=0mm,
  height=190mm,
  width=120mm,
  backspace=15mm,
  leftmarginwidth=0mm,
  rightmarginwidth=0mm,
  leftmargindistance=0mm,
  rightmargindistance=0mm]
%\\setupcombination[style=small]
\\starttext
${titlelines.join('\n')}
${toclines.join('\n')}
\\setuppagenumbering[state=start]
\\setcounter[userpage][1]
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
  hdgs_to_part(title,label,idnum,idcap,partnum,chapternum,level,style){
    var raw = this.revise(title);
    var title = this.uncode(style,title);
    var num = this.int_to_letter_I(partnum);
    var label = label||`partnum.${partnum}`;
    var text = `\
\\startpart[title={Part ${partnum} ${title}},reference={${label}},bookmark={${raw}}]
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
  __to_toclines(){
    var all = [];
    all.push('');
    all.push(`\\startalignment[flushleft]`);
    all.push(`\\tfd Table Of Contents`);
    all.push(`\\stopalignment`);
    all.push('\\startlines')
    this.parser.blocks.forEach((block) => {
      var {sig,hdgn,name,title,label,level,partnum,chapternum,style} = block;
      if(sig=='FRNT'){
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
  float_to_page(title,label,idnum,idcap,style,ss,ssi){
    var all = [];
    all.push('');
    all.push('\\page')
    return all.join('\n');
  }
  to_toclines(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.sig=='FRNT' && (block.name=='chapter' || block.name=='part')){
        pp.push(block); 
        if(pp.length==38){
          pp = [];
          o.push(pp);
        }
      }
    }
    ///
    ///remove empty pp
    ///
    o = o.filter(pp => pp.length);
    ///
    ///generate contents
    ///
/*
    all.push(`\\startalignment[flushleft]`);
    all.push(`\\tfd Table Of Contents`);
    all.push(`\\stopalignment`);
    all.push('\\startlines')
    all.push('\\stoplines')
*/
    var all = [];
    o.forEach((pp) => {
      all.push(``);
      all.push(`\\startalignment[flushleft]`);
      all.push(`\\tfd Table Of Contents`);
      all.push(`\\stopalignment`);
      all.push(`\\startlines`);
      pp.forEach((p) => {
        let block = p;
        let {label,pagenum,title,style,chapternum,partnum} = block;
        title = this.uncode(style,title);
        if(block.name=='part'){
          label = label||`partnum.${partnum}`;
          all.push(`Part ${partnum} ~ ${title}\\hfill\\at[${label}]`);
        }else{
          label = label||`chapternum.${chapternum}`;
          all.push(`~~~~${chapternum} ~ ${title}\\hfill\\at[${label}]`)
        }
      });
      all.push(`\\stoplines`);
      all.push(`\\page`);
    }); 
    return all;
  }
}
module.exports = { NitrilePreviewCamper };
