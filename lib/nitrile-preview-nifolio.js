'use babel';
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
var stylesheet = `\
figure{
  width:100%;
}
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
.EXAMPLE{
  list-style-type: none;   
}
.EXAMPLE li::before {
  content: "\\2020" "\\00A0";
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
.PREFORMATTED{
  margin: 6pt 0pt 6pt 0pt;
}
.DETAILS{
  margin: 6pt 0pt 6pt 0pt;
}
.ALIGNMENT{
  margin: 6pt 0pt 6pt 0pt;
}
.LINES{
  margin: 6pt 0pt 6pt 0pt;
}
.TABBING{
  margin: 6pt 0pt 6pt 0pt;
}
.ITEMIZE{
  margin: 6pt 0pt 6pt 0pt;
}
.MULTICOL{
  margin: 6pt 0pt 6pt 0pt;
}
.STAMP {
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
.CAPTION {
  margin-bottom: 0.2em;
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
class NitrilePreviewFolio extends NitrilePreviewHtml {
  constructor(parser) {
    super(parser);
    this.name = 'slide';
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
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERTITLE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 2.5cm',
        'margin-bottom: 0',
        'font-size: 1.8em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERSUBTITLE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0.8cm',
        'margin-bottom: 0',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERINSTITUTE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERAUTHOR', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERDATE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
  }
  hdgs_to_part(title,label,style){
    var cls = 'PART';
    var partnum = style.__partnum;
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
  to_document(){
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
    var o = this.build_default_pagenum_map(this.parser.blocks);
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
      if(block.sig=='PART' || block.sig=='CHAP'){
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
        let partnum = style.__partnum;
        let chapnum = style.__chapnum;
        let pagenum = style.__pagenum;
        title = this.uncode(style,title);
        if(block.sig=='PART'){
          all.push(`<tr> <td> Part ${partnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
        }else if(block.sig=='CHAP'){
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
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewFolio };
async function run(){
  const fs = require('fs');
  const path = require('path');
  const process = require('process');
  const { NitrilePreviewParser } = require('./nitrile-preview-parser');
  for(var i=2; i < process.argv.length; ++i){
    var mdfname = process.argv[i];
    var xhtmlfname = `${mdfname.slice(0,mdfname.length-path.extname(mdfname).length)}.xhtml`;
    var parser = new NitrilePreviewParser();
    var translator = new NitrilePreviewFolio(parser);
    await parser.read_file_async(mdfname)
    await parser.read_import_async();
    var document = translator.to_document();
    await translator.write_text_file(fs,xhtmlfname,document);
    console.log(`written to ${xhtmlfname}`);
  }
}
if(require.main===module){
  run();
}