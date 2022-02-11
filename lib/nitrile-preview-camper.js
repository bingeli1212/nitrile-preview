'use babel';

const { NitrilePreviewContex } = require('./nitrile-preview-contex');

class NitrilePreviewCamper extends NitrilePreviewContex {

  constructor(parser) {
    super(parser);
    this.name='camper';
    this.style = parser.style;
    this.contex_papersize = 'A5';
    this.contex_bodyfont = 'linux,10pt';
    this.contex_interlinespace = '10.0pt';
    this.contex_inlinelinespace_small = '8pt'
    this.contex_whitespace = '0pt';
    this.contex_indenting = 'yes,medium';
    this.contex_style_chapter = '\\tfd';
    this.contex_style_section = '\\bfa';
    this.contex_style_subsection = '\\bf';
    this.contex_style_subsubsection = '\\bf';
    this.contex_style_subsubsubsection = '\\bf';
  }
  to_document() {
    this.build_default_idnum_map();
    this.build_default_pagenum_map();
    var only = this.parser.conf_to_list('only');
    console.log('only',only);
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      let src = block.style.src;
      if(only.length){
        if(only.indexOf(block.style.src)>=0){
          block.latex = text;
        }
      }else{
        block.latex = text;
      }
    })
    var texlines = this.parser.blocks.map(x => x.latex);
    var titlelines = this.to_titlelines();
    var toclines = this.to_toclines();
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
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definefontfamily[cn][serif][arplsungtilgb]
\\definefontfamily[cn][sans][arplsungtilgb]
\\definefontfamily[cn][mono][arplsungtilgb]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definefontfamily[tw][serif][arplmingti2lbig5]
\\definefontfamily[tw][sans][arplmingti2lbig5]
\\definefontfamily[tw][mono][arplmingti2lbig5]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definefontfamily[jp][serif][ipaexmincho]
\\definefontfamily[jp][sans][ipaexmincho]
\\definefontfamily[jp][mono][ipaexmincho]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definefontfamily[kr][serif][baekmukbatang]
\\definefontfamily[kr][sans][baekmukbatang]
\\definefontfamily[kr][mono][baekmukbatang]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
  hdgs_to_part(title,label,level,style){
    var partnum = style.partnum;
    var raw = title;
    var title = this.uncode(style,title);
    var num = this.int_to_letter_I(partnum);
    var label = label||`part.${partnum}`;
    var text = `\
\\startpart[title={Part ${partnum} ${title}},reference={${label}},bookmark={${raw}}]
\\dontleavehmode
\\setcounter[userpage][${style.pagenum}]
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
  hdgs_to_chapter(title,label,level,style){
    var o = [];
    var idnum = style.idnum;
    var chapnum = style.chapnum;
    var pagenum = style.pagenum;
    var raw = title;
    var title = this.uncode(style,title);
    var label = label||`chapter.${chapnum}`;
    o.push('');
    o.push(`\\startchapter[title={${idnum} ~ ${title}},reference={${label}},bookmark={${raw}}]`);
    o.push(`\\setcounter[userpage][${pagenum}]`)
    return o.join('\n')
  } 
  float_to_page(title,label,style,ss,ssi){
    var pagenum = style.pagenum;
    var all = [];
    all.push('');
    all.push('\\page');
    all.push(`\\setcounter[userpage][${pagenum}]`)
    return all.join('\n');
  }
  to_titlelines(){
    var titlelines = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    if (mytitle) {
      titlelines.push(`\\dontleavehmode`);
      titlelines.push(`\\blank[6cm]`);
      titlelines.push(`\\startalignment[center]`);
      titlelines.push(`{\\tfd ${this.smooth(mytitle)}}`);
      titlelines.push(`\\blank[2cm]`);
      titlelines.push(`{\\tfa ${this.smooth(myaddr)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.smooth(myauthor)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.smooth(mydate)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`\\stopalignment`);
      titlelines.push(`\\page`);
      titlelines.push('');
    }
    return titlelines;
  }
  to_toclines(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.sig=='CHAP' || block.sig=='PART' || (block.sig=='FRNT' && block.style.name=='chapter')){
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
        let {label,title,style} = block;
        title = this.smooth(title);
        let idnum = style.idnum;
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.sig=='PART'){
          label = label||`part.${partnum}`;
          all.push(`Part ${idnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`);
        }else{
          label = label||`chapter.${chapnum}`;
          all.push(`~~~~${idnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`)
        }
      });
      all.push(`\\stoplines`);
      all.push(`\\page`);
    }); 
    return all;
  }
  samp_to_text(style,samp){
    var text = super.samp_to_text(style,samp);
    var all = [];
    all.push('');
    all.push('\\startnarrower[1*left,0*right]');
    all.push(text.trim());
    all.push('\\stopnarrower');
    return all.join('\n')
  }
}
module.exports = { NitrilePreviewCamper };
