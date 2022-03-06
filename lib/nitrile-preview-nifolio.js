'use babel';
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
var stylesheet = `\
._VERB::before{
  content: "\\201C";
}
._VERB::after{
  content: "\\201D";
}
.DMATH{
  margin-top: 6pt;
  margin-bottom: 6pt;
}
.PARAGRAPH.BODY{
  text-indent: 12pt;
  margin-top: 0pt;
  margin-bottom: 0pt;
}
.SECTION + .PARAGRAPH.BODY{
  text-indent:0pt;
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
.PRIMARY{
  margin-top: 13pt;
  margin-bottom: 0pt;
}
.SECONDARY{
  margin-top: 6pt;
  margin-bottom: 0pt;
}
.PARAGRAPH{
  margin-top: 6pt;
  margin-bottom: 6pt;
}
.EQUATION{
  margin-top: 6pt;
  margin-bottom: 6pt;
}
.FIGURE{
  margin-top: 10pt;
  margin-bottom: 10pt;
}
.LISTING{
  margin-top: 10pt;
  margin-bottom: 6pt;
}
.LONGTABU{
  margin-top: 10pt;
  margin-bottom: 6pt;
}
.MULTICOLS{
  margin-top: 6pt;
  margin-bottom: 6pt;
}
.ALIGNMENT{
  margin-top: 6pt;
  margin-bottom: 6pt;
}
.FIGCAPTION {
  margin-bottom: 0.2em;
}
.EQUATION, .FIGURE, .ALIGNMENT, .LISTING, .LONGTABU, .MULTICOLS {
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
    line-height: 1.05;
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
    line-height: 1.05;
  }
  body {
    margin:0;
  }
}`;

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
        'font-size: 1.20em',
        'font-weight: 600',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SUBSECTION', [
        'font-size: 1.17em',
        'font-weight: 600',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SUBSUBSECTION', [
        'font-size: 1.17em',
        'font-weight: 600',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'DD', [
        'margin-left: 0',
        'padding-left: 30pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'OL', [
        'padding-left: 20pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'UL', [
        'padding-left: 20pt',
      ]
    );
  }
  hdgs_to_part(title,label,level,style){
    var cls = 'PART';
    var idnum = style.idnum;
    var css = this.css('PART');
    return(`<div class='PART' style='${css}' > <span><small> Part ${idnum} </small></span> <span>${this.uncode(style,title)}</span> </div>`);
  }
  to_peek_document() {
    this.build_default_idnum_map();
    var title_html = this.to_title_html();
    var output_html = this.to_output_html();
    return `${title_html}\n${output_html}`;
  }
  to_data() {
    this.build_default_idnum_map();
    var title_html = this.to_title_html();
    var output_html = this.to_output_html();
    var toc_html = this.to_toc_html();
    var title = this.uncode(this.parser.style,this.parser.title);
    var body = `
${title_html}
${toc_html}
${output_html}
`;
    var script = '';
    var members = this.parser.members;
    return {stylesheet,body,script,members,title};
  }
  to_output_html() {
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
  to_title_html(){
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
  to_toc_html(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.sig=='CHAP' || block.sig=='PART' || (block.sig=='FRNT' && block.style.name=='chapter')){
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
        let idnum = style.idnum;
        let pagenum = style.pagenum;
        title = this.smooth(style,title);
        if(block.sig=='PART'){
          all.push(`<tr> <td> Part ${idnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
        }else{
          all.push(`<tr> <td style='padding-left:1em;' > ${idnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
        }
      });
      all.push(`</table>`);    
      all.push(`</article>`);
    }); 
    let text = all.join('\n');
    return text;
  }
  samp_to_text(style,samp){
    var o = [];
    var ss = samp.map((p,i,arr) => {
      let x = p.text;
      x = x.trimEnd();
      if(x.length==0){
        x = '&#160;';
      }else{
        x = this.polish(style,x);
      }
      return `<span data-row='${p.n}'><code>${x}</code></span>`;
    })
    var text = ss.join('\n');
    var css = this.css('PARAGRAPH SAMP');
    return`<pre class='PARAGRAPH SAMP' style='${css}' data-row='${style.row}' >${text}</pre>`;
  }
}
module.exports = { NitrilePreviewFolio };
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
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    var fname = process.argv[2];    
    var oname = process.argv[3];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
      if(oname){
        xhtmlfile = oname;
      }
      var translator = new NitrilePreviewFolio(parser);
      var data = translator.to_data();
      var xhtml =  `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<script>
//<![CDATA[
${data.script}
//]]>
</script>
<style>
${data.stylesheet}
</style>
</head>
<body>
${data.body}
</body>
</html>
`;      
      await this.write_text_file(fs,xhtmlfile,xhtml);
      console.log(`written to ${xhtmlfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new Server();
  server.run();
}
