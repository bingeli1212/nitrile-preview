'use babel';
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
class NitrilePreviewReport extends NitrilePreviewContex {
  constructor(parser) {
    super(parser);
    this.name='report';
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
  to_document() {
    // this.build_default_idnum_map();
    // this.build_default_pagenum_map();
    var only = this.parser.conf_to_list('only');
    console.log('only',only);
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      if(only.length){
        if(only.indexOf(block.style.note)>=0){
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
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\setuppapersize[A5]                           
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
  hdgs_to_part(title,style){
    var partnum = style.partnum;
    var raw = title;
    var title = this.uncode(style,title);
    var num = this.int_to_letter_I(partnum);
    var label = label||`part.${partnum}`;
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
  hdgs_to_chapter(title,style){
    var o = [];
    var chapnum = style.chapnum;
    var pagenum = style.pagenum;
    var raw = title;
    var title = this.uncode(style,title);
    var label = label||`chapter.${chapnum}`;
    o.push('');
    o.push(`\\startchapter[title={${chapnum} ~ ${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  } 
  float_to_page(title,label,style,body,bodyrow){
    var pagenum = style.pagenum;
    var all = [];
    all.push('');
    all.push('\\page');
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
      titlelines.push(`{\\tfd ${this.smooth(this.style,mytitle)}}`);
      titlelines.push(`\\blank[2cm]`);
      titlelines.push(`{\\tfa ${this.smooth(this.style,myaddr)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.smooth(this.style,myauthor)}}`);
      titlelines.push(`\\blank[0.2cm]`);
      titlelines.push(`{\\tfa ${this.smooth(this.style,mydate)}}`);
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
      if(block.style.name=='part' || block.style.name=='chapter'){
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
        title = this.smooth(style,title);
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.style.name=='part'){
          label = label||`part.${partnum}`;
          all.push(`Part ${partnum} ~ ${title}\\hfill\\ref[page][${label}]`);
        }else{
          label = label||`chapter.${chapnum}`;
          all.push(`~~~~${chapnum} ~ ${title}\\hfill\\ref[page][${label}]`)
        }
      });
      all.push(`\\stoplines`);
      all.push(`\\page`);
    }); 
    return all;
  }
}
module.exports = { NitrilePreviewReport };
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
const { NitrilePreviewBase } = require('./nitrile-preview-base');
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    var fname = process.argv[2];    
    var oname = process.argv[3];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.tex'){
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
      var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
      if(oname){
        texfile = oname;
      }
      var translator = new NitrilePreviewReport(parser);
      var data = translator.to_document();
      await this.write_text_file(fs,texfile,data);
      console.log(`written to ${texfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new Server();
  server.run();
}
