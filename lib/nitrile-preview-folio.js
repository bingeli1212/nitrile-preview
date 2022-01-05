'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewDiagramBall } = require('./nitrile-preview-diagram-ball');
const { NitrilePreviewPagination } = require('./nitrile-preview-pagination');

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
  }
  to_peek_document() {
    var title_html = this.to_titlepage();
    var html = this.to_output();
    var html = this.replace_all_refs(html);
    return `${title_html}\n${html}`;
  }
  to_document() {
    var title_html = this.to_titlepage();
    var html = this.to_output();
    var html = this.replace_all_refs(html);
    var html = `${title_html}\n${html}`;
    var title = this.parser.conf_to_string('title');
    var style = this.parser.style;
    var title = this.uncode(style,title);
    var trigger_stylesheet = this.to_trigger_stylesheet();
    var slide_stylesheet = `\
table {
  font-family: sans-serif;
  font-size: 10pt;
  line-height: 1.00;
  table-layout: fixed;
}

.PARAGRAPH.PRIMARY {
  text-indent: initial;
  margin-top: 1.0em;
}
.PARAGRAPH.INDENTING {
  text-indent: initial;
  padding-left: 1.5em;
}
.PARAGRAPH {
  text-indent: initial;
  margin-top: 6pt;   
  margin-bottom: 6pt;   
  margin-left:  0;
  margin-right: 0;
}
.SECTION {
  margin-left: 0;
  margin-right: 0;
  margin-top: 6pt;
  margin-bottom: 6pt;
}
.LISTING .BODY {
  line-height: 1; 
  text-align: left; 
  width: 100%; 
  padding-left: 1.5em;
  position: relative;
}
.LISTING .BODY .LINE {
  position: relative;
}
.LISTING .BODY .LINE::before {
  content: var(--lineno);
  position: absolute;
  left: -1.5em;
}
.FIGURE {
  page-break-inside: avoid;
}
.FIGCAPTION {
  text-indent: initial;
  margin-top: 0;
  margin-bottom: 0.5em;
  line-height: 1;
  white-space: normal;
}
.SUBCAPTION {
  padding: 0;
  text-indent: initial;
  white-space: normal; 
  font-size: smaller;
  line-height: 1;
}
.SUBCAPTION::before {
  content: var(--num) " ";
}
.SUBROW {
  display: flex;         
  flex-direction: row;
  align-items: baseline;
}
.CENTER {
  text-indent: initial;
  text-align:center;
}
.FLUSHRIGHT {
  text-indent: initial;
  text-align:right;
}
.FLUSHLEFT {
  text-indent: initial;
  text-align:left;
}
.QUOTE {
  text-indent: initial;
  text-align:left;
  padding-left: 12pt;   
  padding-right: 12pt;   
}
.DISPLAYMATH {
  text-indent: initial;
  text-align:center;
}
.MATH {
  text-indent: initial;
  text-align:left;
}
.VERBATIM {
  text-indent: initial;
  text-align: left;
  width: 100%;
  line-height: 1;
}
.VERSE {
  text-indent: initial;
  text-align: left;
}
.PARBOX {
  text-indent: initial;
  text-align: left;
}
.TABULAR {
  text-indent: initial;
}
.PARA {
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PACK {
  margin-top: 0em;
  margin-bottom: 0em;
}
.DT {
  margin-bottom: 0em;
}
.DD {
  margin-left: 0;
  padding-left: 10mm;
}
.LI {
  position: relative;
}
.LI::before {
  position: absolute;
  content: var(--bull);
  left: var(--pad);
}
.TH, .TD {
  padding: 0.1em 0.6em;
}
.PART, .CHAPTER, .SECTION, .SUBSECTION, .SUBSUBSECTION, .PRIMARY {
  clear: both;
}
.FRONTMATTERTITLE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 2.5cm;
  margin-bottom: 0;
  font-size: 1.8em;
  font-weight: bold;
  color: #1010B0;
  text-align: center;
  align-self: center;
}
.FRONTMATTERSUBTITLE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.8cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
.FRONTMATTERINSTITUTE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
.FRONTMATTERAUTHOR {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
.FRONTMATTERDATE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}

.EDITIMG {
  visibility: hidden;
  position: absolute;
  top: 0px;
  left: 0px;
}
.EDITBOARD {
  position: absolute;
  visibility: visible;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background-position: 0px 0px;
  background-repeat: no-repeat;
}
@media print {
  @page {
    size: 148mm 210mm;
    margin: 0 0 0 0;
  }  
  .FOLIO {
    page-break-inside: avoid;
    page-break-after: always;
    min-width:100%;
    max-width:100%;
    box-sizing:border-box;
    overflow: hidden;
    padding:10mm 10mm;
    font-family: sans-serif;
    font-size: 10pt;
    line-height: 1.25;
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
    font-family: sans-serif;
    font-size: 10pt;
    line-height: 1.25;
    box-sizing: border-box;
    overflow: hidden;
    padding: 10mm 10mm;
    outline: 1px solid;
  }
  body {
    margin:0;
  }
}
    `
    var xhtmldata = `\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<style>
${trigger_stylesheet}
${slide_stylesheet}
</style>
</head>
<body>
<main class='PAGE'>
${html}
</main>
</body>
</html>
`;
    return xhtmldata;
  }
  to_output() {
    //var pagination = new NitrilePreviewPagination();
    let chapters = [];
    for (let block of this.parser.blocks) {
      if(block.sig == 'FRNT'){
        chapters.push( [block] );
        continue;
      }
      if(!block.parser){
        chapters.push( [block] );
      } else {
        if (chapters.length==0){
          chapters.push( [block] );
        } else if (chapters[chapters.length-1][0].parser === block.parser) {
          chapters[chapters.length-1].push(block);
        } else {
          chapters.push( [block] );
        }
      }
    }
    ///
    ///
    ///
    var pp = [];
    var p = {};
    if( chapters.length == 1) {
      ///no-chapter doc
      let sections = chapters[0];
      // sections = sections.slice(1);///remove the first one which is the FRNT block
      for (let block of sections) {
        p = {}; 
        p.chapter = null;
        p.block = block; 
        // change the FRNT block into a chapter block
        if(block.sig=='FRNT'){
          let subparser = block.parser;
          let title = subparser.conf_to_string('title','NO TITLE');
          let label = subparser.conf_to_string('label','');
          block.title = title;
          block.label = label;
          block.sig = 'HDGS';
          block.hdgn = 0;
          block.name = 'chapter';
          block.chapternum = 1;
          block.partnum = 0;
        }
        pp.push(p);
      }
    } else {
      ///multi-chapter doc
      chapters = chapters.slice(1);///remove the first one which is the FRNT block
      for (let chapter of chapters) {
        for (let block of chapter) {
          p = {}; 
          p.chapter = chapter;
          p.block = block; 
          pp.push(p);
        }
        p = {};
        p.block = null;
        p.chapter = null;
        pp.push(p);
      }
    }
    var all = [];
    var i = 0;
    var n = 0;
    var id = 0;
    while (i < pp.length) {
      ///note that each subsection is just a 'blocks'
      id = id+1;
      all.push(`<article class='FOLIO' id='frame${id}' style='position:relative;--page:${id};' >`);
      while (i < pp.length) {
        let p = pp[i];
        i++;
        n++;
        let x = this.translate_block(p.block);
        all.push(x);       
        if(pp[i]){
          let block = pp[i].block;
          if(!block){
            i++;
            n = 0;
            break;
          }
          let parser = pp[i].block.parser;
          if(!parser){
            break;
          }
          let pages = parser.pages;
          if(pages.indexOf(n) >= 0){
            break;
          }
        }           
      }
      all.push(`<div style='position:absolute;top:5mm;right:10mm;' > ${id} </div>`)
      all.push(`</article>`);
    }
    return all.join('\n');
  }
  to_titlepage(){
    let title     = this.parser.conf_to_string('title','Untitled');
    let subtitle  = this.parser.conf_to_string('subtitle')
    let institute = this.parser.conf_to_string('institute');
    let author    = this.parser.conf_to_string('author');
    var style     = this.parser.style;
    var date      = new Date().toLocaleDateString();
    let data = `<article data-row='0' class='FOLIO'>
    <div class='FRONTMATTERTITLE' >${this.uncode(style,title)}</div>
    <div class='FRONTMATTERSUBTITLE' >${this.uncode(style,subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' >${this.uncode(style,institute)}</div>
    <div class='FRONTMATTERAUTHOR' >${this.uncode(style,author)}</div>
    <div class='FRONTMATTERDATE' >${this.uncode(style,date)}</div>
    </article>
    `;
    return data;
  }
  to_choice(style,body,check){
    body = body.filter((s) => s.length)
    var all = [];
    var re_word = /^(\w+)/;
    var v;
    var checks = check?check.split('/'):[];
    all.push(`<ul style='margin-top:0;margin-bottom:0;list-style:none; padding:0;'>`);
    body.forEach((s) => {
      var start;
      if((v=re_word.exec(s))!==null){
        start = v[1];
      }
      if(this.is_in_list(start,checks)){
        all.push(`<li> ${this.uchar_checkboxc} ${this.uncode(style,s)} </li>`)
      }else{
        all.push(`<li> ${this.uchar_checkboxo} ${this.uncode(style,s)} </li>`)
      }
    })
    all.push(`</ul>`)
    return all.join('\n')
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
}
module.exports = { NitrilePreviewFolio };
