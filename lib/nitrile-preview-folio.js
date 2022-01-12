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
    this.build_default_css_map();
    this.add_css_map_entry(this.css_map,
      'SECTION', [
        'margin-top: 14pt',
        'font-size: 1.25em',
        'font-weight: 700',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SUBSECTION, SUBSUBSECTION', [
        'font-size: 1.17em',
        'font-weight: 700',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FIGURE', [
        'margin-top: 12pt',
        'margin-bottom: 12pt',
      ]
    );
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
    var slide_stylesheet = `\
    
.LISTING .BODY {
  line-height: 1em; 
  text-align: left; 
  width: 100%; 
  padding-left: 1.5em;
  position: relative;
  display: block;
}
.LISTING .BODY .LINE {
  position: relative;
  display: block;
}
.LISTING .BODY .LINE::before {
  content: var(--lineno);
  position: absolute;
  left: -1.5em;
}
.SUBCAPTION::before {
  content: var(--num) " ";
}
.COVE {
  position: relative;
}
.COVE::before {
  position: absolute;
  content: var(--bull);
  left: var(--pad);
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
.PAGENUM {
  content: var(--page);
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
    padding:10mm 10mm;
    font-family: Verdana, sans-serif;
    letter-spacing: -0.03em;
    font-size: 10pt;
    line-height: 1.25em;
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
    padding: 10mm 10mm;
    outline: 1px solid;
    font-family: Verdana, sans-serif;
    letter-spacing: -0.03em;
    font-size: 10pt;
    line-height: 1.25em;
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
${slide_stylesheet}
</style>
</head>
<body>
${title_html}
${html}
</body>
</html>
`;
    return xhtmldata;
  }
  to_output() {
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      let x = this.translate_block(block);
      pp.push(x);       
      if(block.id=='page'){
        pp = [];
        o.push(pp);
      }
    }
    ///add article and page number
    o.forEach((pp,i) => {
      var id = i+1;
      pp.unshift(`<article class='FOLIO' id='frame${id}' style='position:relative;--page:"${id}";' >`);
      pp.push(`<div class='PAGENUM' style='position:absolute;top:5mm;right:10mm;' > </div>`);
      pp.push(`</article>`);
    });
    ///flatten it
    var all = [];
    o.forEach((pp,i) => {
      all.push(pp.join('\n'));
    });
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
