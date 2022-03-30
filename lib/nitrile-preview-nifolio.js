'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
var stylesheet = `\
._VERB::before{
  content: "\\201C";
}
._VERB::after{
  content: "\\201D";
}
.CODE{
  font-size: 92%;
}
.TH, .TD{
  padding: 0.115em 0.4252em;
}
.DMATH{
  margin-top: 6pt;
  margin-bottom: 6pt;
}
.SECTION + .BODY{
  text-indent: 0;
}
.SECTION{
  margin-top: 13pt;
  margin-bottom: 8pt;
}
.SUBSECTION{
  margin-top: 10pt;
  margin-bottom: 8pt;
}
.SUBSUBSECTION{
  margin-top: 8pt;
  margin-bottom: 8pt;
}
.BODY{
  margin: 0pt 0pt 0pt 0pt;
  text-indent: 1.5em;
}
.PRIMARY{
  margin: 13pt 0pt 0pt 0pt;
}
.SECONDARY{
  margin: 6pt 0pt 0pt 0pt;
}
.EXAMPLE{
  margin: 6pt 0pt 6pt 0pt;
}
.VERBATIM{
  margin: 6pt 0pt 6pt 0pt;
}
.RECORD{
  margin: 6pt 0pt 6pt 0pt;
}
.FLUSHLEFT{
  margin: 6pt 0pt 6pt 0pt;
}
.CENTER{
  margin: 6pt 0pt 6pt 0pt;
}
.COLUMNS{
  margin: 6pt 0pt 6pt 0pt;
}
.LINES{
  margin: 6pt 0pt 6pt 0pt;
}
.ITEMIZE{
  margin: 6pt 0pt 6pt 0pt;
}
.EQUATION{
  margin: 6pt 0pt 6pt 0pt;
}
.FIGURE{
  margin: 10pt 0pt 6pt 0pt;
}
.LISTING{
  margin: 10pt 0pt 6pt 0pt;
}
.TABLE{
  margin: 10pt 0pt 6pt 0pt;
}
.FIGCAPTION {
  margin-bottom: 0.2em;
}
.EQUATION, .FIGURE, .LISTING, .TABLE, .COLUMNS, .LINES {
  margin-left: 0pt;
  margin-right: 0pt;
}
.FRONTMATTERTITLE{
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 2.5cm;
  margin-bottom: 0;
  font-size: 1.8em;
  color: var(--titlecolor);
  text-align: center;
  align-self: center;
}
.FRONTMATTERSUBTITLE{
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.8cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
.FRONTMATTERINSTITUTE{
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
.FRONTMATTERAUTHOR{
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
.FRONTMATTERDATE{
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
@media print {
  @page {
    size: 148mm 210mm;
    margin: 0 0 0 0;
  }  
  .FOLIO {
    page-break-inside: avoid;
    page-break-after: always;
    min-width:100vw;
    max-width:100vw;
    min-height:100vh;
    max-height:100vh;
    box-sizing:border-box;
    overflow: hidden;
    padding:8mm 10mm 0mm 15mm;
    font-size: 10pt;
    line-height: 1.00;
  }
  body {
    margin:0;
    padding:0;
  }
}
@media screen {
  .FOLIO {
    margin: auto auto;
    min-width:148mm;
    max-width:148mm;
    min-height:210mm;
    max-height:210mm;
    box-sizing: border-box;
    overflow: hidden;
    padding: 8mm 10mm 0mm 15mm;
    outline: 1px solid;
    font-size: 10pt;
    line-height: 1.00;
  }
  body {
    margin:0;
  }
}`;
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
class NitrilePreviewFolio extends NitrilePreviewHtml {
  constructor(parser) {
    super(parser);
    this.name = 'slide';
    this.style = parser.style;
    this.icon_subpoint = '&#x261E;'//WHITE RIGHT POINTING INDEX
    this.icon_solution = '&#x270D;'//WRITING HAND
    this.icon_folder = '&#x2615;'//HOT BEVERAGE
    this.uchar_checkboxo = '&#x2610;' //BALLOT BOX            
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.uchar_checkboxx = '&#x2612;' //BALLOT BOX WITH X
    this.vw_mm = 148;//mm
    this.vh_mm = 210;//mm
    this.vw = this.vw_mm*this.MM_TO_PX;
    this.vh = this.vh_mm*this.MM_TO_PX;
    this.add_css_map_entry(this.css_map,
      'TOCTITLE', [
        'font-size: 1.38em',
        'margin-bottom: 6pt',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'TOCANCHOR', [
        'text-decoration: none',   
        'color: inherit',     
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'PAGEHEADER', [
         'margin-top:0mm',
         'margin-bottom:8mm',
         'text-align:right', 
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'PART', [
        'position:absolute',
        'top:0',
        'right:0',
        'bottom:0',
        'left:0',
        'display:flex',
        'flex-direction:column',
        'justify-content:center',
        'align-items:center',
        'font-size:200%',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'CHAPTER', [
        'font-size: 1.88em',
        'font-weight: 500',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SECTION', [
        'font-size: 1.10em',
        'font-weight: 600',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SUBSECTION', [
        'font-size: 1.05em',
        'font-weight: 600',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SUBSUBSECTION', [
        'font-size: 1.00em',
        'font-weight: 600',
      ]
    );
  }
  hdgs_to_part(title,style){
    var cls = 'PART';
    var partnum = style.partnum;
    var css = this.css('PART');
    return(`<div class='PART' style='${css}' > <span><small> Part ${partnum} </small></span> <span>${this.uncode(style,title)}</span> </div>`);
  }
  to_peek_document() {
    var translation_html = this.to_translation_html();
    var body = `${translation_html}`;
    return body;
  }
  to_data() {
    var titlepage_html = this.to_titlepage_html();
    var translation_html = this.to_translation_html();
    var tocpage_html = this.to_tocpage_html();
    var title = this.uncode(this.parser.style,this.parser.title);
    if(!this.parser.titlepage){
      titlepage_html = '';
    }
    if(!this.parser.tocpage){
      tocpage_html = '';
    }
    var body = `${titlepage_html}\n${tocpage_html}\n${translation_html}`;
    var script = '';
    var members = this.parser.members;
    return {stylesheet,body,script,members,title};
  }
  to_xhtml(){
    var data = this.to_data();
    var all = [];
    all.push(`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">`);
    all.push(`<html xmlns='http://www.w3.org/1999/xhtml'>`);
    all.push(`<head>`);
    all.push(`<meta http-equiv='default-style' content='text/html' charset='utf-8'/>`);
    all.push(`<title> ${data.title} </title>`);
    all.push(`<script>`);
    all.push(`//<![CDATA[`);
    all.push(`${data.script}`);
    all.push(`//]]>`);
    all.push(`</script>`);
    all.push(`<style>`);
    all.push(`${data.stylesheet}`);
    all.push(`</style>`);
    all.push(`</head>`);
    all.push(`<body>`);
    all.push(`${data.body}`);
    all.push(`</body>`);
    all.push(`</html>`);
    return all.join('\n');
  }
  to_translation_html() {
    var o = this.build_default_pagenum_map();
    ///
    ///flatten it
    ///
    var all = [];
    o.forEach((pp,i) => {
      let pagenum = pp.pagenum;
      all.push(`<article class='FOLIO' id='folio${pagenum}' style='position:relative;--page:"${pagenum}";' >`);
      all.push(`<div class='PAGEHEADER' id='page${pagenum}' style='${this.css("PAGEHEADER")}' > ${pagenum} </div>`);
      pp.forEach((p) => {
        let x = this.translate_block(p.block);
        all.push(x);
      });
      all.push(`</article>`);
    });
    return all.join('\n');
  }
  to_titlepage_html(){
    let title     = this.parser.conf_to_string('title','Untitled');
    let subtitle  = this.parser.conf_to_string('subtitle')
    let institute = this.parser.conf_to_string('institute');
    let author    = this.parser.conf_to_string('author');
    var style     = this.parser.style;
    var date      = new Date().toLocaleDateString();
    let data = `<article data-row='0' class='FOLIO'>
    <div class='FRONTMATTERTITLE' style='${this.css("FRONTMATTERTITLE")}' >${this.uncode(style,title)}</div>
    <div class='FRONTMATTERSUBTITLE' style='${this.css("FRONTMATTERSUBTITLE")}' >${this.uncode(style,subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' style='${this.css("FRONTMATTERINSTITUTE")}' >${this.uncode(style,institute)}</div>
    <div class='FRONTMATTERAUTHOR' style='${this.css("FRONTMATTERAUTHOR")}' >${this.uncode(style,author)}</div>
    <div class='FRONTMATTERDATE' style='${this.css("FRONTMATTERDATE")}' >${this.uncode(style,date)}</div>
    </article>
    `;
    return data;
  }
  to_fontsize(length){
    var fontsize = '';
    if( length > 16 ){
      fontsize = '90%';
    }
    if( length > 18 ){
      fontsize = '80%';
    }
    if( length > 20 ){
      fontsize = '70%';
    }
    if( length > 24 ){
      fontsize = '60%';
    }
    return fontsize;
  }
  to_tocpage_html(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.style.name=='part' || block.style.name=='chapter'){
        pp.push(block); 
        if(pp.length==38){//a singe page holds at most 38 entries
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
    var all = [];
    o.forEach((pp,j) => {
      all.push(`<article class='FOLIO'> `);
      let csstitle = this.css('TOCTITLE');
      let cssanchor = this.css('TOCANCHOR');
      all.push(`<div class='PAGEHEADER' id='toc.${j+1}' style='${this.css("PAGEHEADER")}' > </div>`);
      all.push(`<div class='TOCTITLE' style='${csstitle}'> Table Of Contents </div>`);
      all.push(`<table cellpadding='0' cellspacing='0' width='100%'>`);    
      pp.forEach((p) => {
        let block = p;
        let {label,title,style} = block;
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        title = this.uncode(style,title);
        if(block.style.name=='part'){
          all.push(`<tr> <td> Part ${partnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
        }else{
          all.push(`<tr> <td style='padding-left:1em;' > ${chapnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
        }
      });
      all.push(`</table>`);    
      all.push(`</article>`);
    }); 
    let text = all.join('\n');
    return text;
  }
}
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
class NitrilePreviewLamper extends NitrilePreviewLatex {
  constructor(parser) {
    super(parser);
    this.name='lamper';
    this.style = parser.style;
    this.latex_figure_nofloat = 1;
  }
  to_document() {
    var o = this.build_default_pagenum_map();
    var translationlines = [];
    o.forEach((pp) => {
      pp.forEach((p) => {
        let x = this.translate_block(p.block);
        translationlines.push(x);
      });
    });
    var titlelines = this.to_titlelines();//not the same as titlepagelines
    var tocpagelines = this.to_tocpagelines();
    var titlepagelines = this.to_titlepagelines();
    if(!this.parser.titlepage){
      titlepagelines = [];
    }
    if(!this.parser.tocpage){
      tocpagelines = [];
    }
    var opts = [];
    opts.push('a5paper');
    if(this.prog=='lualatex'){
      return              `\
% !TEX program = LuaLatex 
\\documentclass[${opts.join(',')},${this.bodyfontsize}pt]{memoir}
${this.to_preamble_essentials_lualatex()}
\\renewcommand{\\baselinestretch}{0.95}
\\linespread{0.8}\\selectfont
\\usepackage[overlap,CJK]{ruby}
\\renewcommand\\rubysep{0.0ex}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }else if(this.prog=='xelatex'){
      return             `\
% !TEX program = XeLatex 
\\documentclass[${opts.join(',')},10pt]{memoir}
${this.to_preamble_essentials_xelatex()}
\\XeTeXlinebreaklocale "zh"
\\XeTeXlinebreakskip = 0pt plus 1pt
\\renewcommand{\\baselinestretch}{0.95}
\\linespread{0.8}\\selectfont
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }else{
      return              `\
% !TEX program = PdfLatex 
\\documentclass[${opts.join(',')},9pt]{memoir}
${this.to_preamble_essentials_pdflatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  to_titlelines(){
    var titlelines = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    if (1) {
      titlelines.push(`\\title{${this.uncode(this.style,mytitle)}}`);
      titlelines.push(`\\author{${this.uncode(this.style,myauthor)}}`);
      titlelines.push(`\\date{${this.uncode(this.style,mydate)}}`);
    }
    return titlelines;
  }
  to_tocpagelines(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.style.name=='chapter' || block.style.name=='part'){
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
    var all = [];
    all.push(`\\pagenumbering*{roman}`);
    o.forEach((pp) => {
      all.push(``);
      all.push(`Table Of Contents`);
      all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);
      pp.forEach((p) => {
        let block = p;
        let {label,title,style} = block;
        title = this.uncode(style,title);
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.style.name=='part'){
          label = label||`part.${partnum}`;
          all.push(`\\item Part ${partnum} ~ ${title}\\dotfill ${pagenum}`);
        }else{
          label = label||`chapter.${chapnum}`;
          all.push(`\\item ~~~~${chapnum} ~ ${title}\\dotfill ${pagenum}`)
        }
      });
      all.push(`\\end{list}`);
      all.push(`\\newpage`);
    }); 
    return all;
  }
  to_titlepagelines(){
    var all = [];
    all.push(`\\begin{titlingpage}`);
    all.push(`\\setcounter{page}{1}`);
    all.push(`\\pagestyle{empty}`);
    all.push(`\\maketitle`);
    all.push(`\\begin{abstract}`);
    all.push(`\\end{abstract}`);
    all.push(`\\end{titlingpage}`);
    return all;
  }
}
////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////
class NitrilePreviewCamper extends NitrilePreviewContex {
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
  to_document() {
    var o = this.build_default_pagenum_map();
    var translationlines = [];
    o.forEach((pp) => {
      pp.forEach((p) => {
        let x = this.translate_block(p.block);
        translationlines.push(x);
      });
    });
    var titlepagelines = this.to_titlepagelines();
    var tocpagelines = this.to_tocpagelines();
    if(!this.parser.titlepage){
      titlepagelines = [];
    }
    if(!this.parser.tocpage){
      tocpagelines = [];
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
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setuppagenumbering[state=start]
\\setcounter[userpage][1]
${translationlines.join('\n')}
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
  to_titlepagelines(){
    var all = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    if (mytitle) {
      all.push(`\\dontleavehmode`);
      all.push(`\\blank[6cm]`);
      all.push(`\\startalignment[center]`);
      all.push(`{\\tfd ${this.uncode(this.style,mytitle)}}`);
      all.push(`\\blank[2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,myaddr)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,myauthor)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,mydate)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`\\stopalignment`);
      all.push(`\\page`);
      all.push('');
    }
    return all;
  }
  to_tocpagelines(){
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
    ///generate TOC
    ///
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
        title = this.uncode(this.style,title);
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.style.name=='part'){
          label = label||`part.${partnum}`;
          all.push(`Part ${partnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`);
        }else{
          label = label||`chapter.${chapnum}`;
          all.push(`~~~~${chapnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`)
        }
      });
      all.push(`\\stoplines`);
      all.push(`\\page`);
    }); 
    return all;
  }
  to_part_page(title,style){
    return `\
\\dontleavehmode
\\startalignment[center]
\\blank[6cm]
{\\tfa Part ${style.partnum}}
\\blank[1cm]
{\\tfd ${this.uncode(style,title)}}
\\stopalignment
\\stoppart`;
  }
}
////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    var fname = process.argv[2];    
    if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      if(parser.prog=='context'){
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewCamper(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfile,dcument);
        console.log(`written to ${texfile}`);
      }else if(parser.prog=='pdflatex'||parser.prog=='xelatex'||parser.prog=='lualatex'){
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewLamper(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfile,dcument);
        console.log(`written to ${texfile}`);
      }else{
        var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
        var translator = new NitrilePreviewFolio(parser);
        var xhtml = translator.to_xhtml();
        await this.write_text_file(fs,xhtmlfile,xhtml);
        console.log(`written to ${xhtmlfile}`);
      }
    }
  }
}
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewFolio, NitrilePreviewLamper, NitrilePreviewCamper };
if(require.main===module){
  var server = new Server();
  server.run();
}
