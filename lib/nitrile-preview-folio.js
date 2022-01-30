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
    this.add_css_map_entry(this.css_map,
      'CHAPTER', [
        'font-family: Verdana, sans-serif',
        'letter-spacing: -0.03em'
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SECTION', [
        'margin-top: 14pt',
        'font-size: 1.20em',
        'font-weight: 500',
        'font-family: Verdana, sans-serif',
        'letter-spacing: -0.03em'
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SUBSECTION, SUBSUBSECTION', [
        'font-size: 1.17em',
        'font-weight: 700',
        'font-family: Verdana, sans-serif',
        'letter-spacing: -0.03em'
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FIGURE', [
        'margin-top: 12pt',
        'margin-bottom: 12pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERTITLE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 2.5cm',
        'margin-bottom: 0',
        'font-size: 1.8em',
        'color: var(--titlecolor)',
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
  to_peek_document() {
    this.build_default_idnum_map();
    var title_html = this.to_titlepage();
    var html = this.to_output();
    return `${title_html}\n${html}`;
  }
  to_document() {
    this.build_default_idnum_map();
    var title_html = this.to_titlepage();
    var output_html = this.to_output();
    var toc_html = this.to_toc();
    var slide_stylesheet = `\
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
    padding:10mm 10mm 10mm 15mm;
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
    box-sizing: border-box;
    overflow: hidden;
    padding: 10mm 10mm 10mm 15mm;
    outline: 1px solid;
    font-size: 10pt;
    line-height: 1.25;
  }
  body {
    margin:0;
  }
}
    `
    var xhtmldata = `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<style>
${slide_stylesheet}
</style>
</head>
<body>
${title_html}
${toc_html}
${output_html}
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
      if(block.id=='page'){
        pp = [];
        o.push(pp);
      }else if(block.sig=='HDGS' && block.hdgn==0 && (block.name=='chapter' || block.name=='part')){
        pp = [];
        pp.push({x,block});
        o.push(pp);
      }else{
        pp.push({x,block});  
      }
    }
    ///
    ///remove empty pages
    ///
    o = o.map((pp) => {
      return pp.filter((p) => p.x.length);
    })
    o = o.filter((pp) => pp.length);
    ///
    ///add article and page number
    ///
    o.forEach((pp,i) => {
      var id = i+1;
      var pagenum = id;
      ///look for the presence of any block.label and then match it with the current page number and save
      ///this information to this.idnum_map.
      pp.forEach((p) => {
        if(p.block){
          p.block.pagenum = pagenum;
        }  
      });
      pp.unshift({x:`<article class='FOLIO' id='frame${id}' style='position:relative;--page:"${pagenum}";' >`});
      pp.push({x:`<div id='pagenum.${pagenum}' style='position:absolute;top:5mm;right:10mm;' > ${pagenum} </div>`});
      pp.push({x:`</article>`});
    });
    ///
    ///flatten it
    ///
    var all = [];
    o.forEach((pp,i) => {
      pp.forEach((p) => {
        all.push(p.x);
      });
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
    <div class='FRONTMATTERTITLE' style='${this.css("FRONTMATTERTITLE")}' >${this.uncode(style,title)}</div>
    <div class='FRONTMATTERSUBTITLE' style='${this.css("FRONTMATTERSUBTITLE")}' >${this.uncode(style,subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' style='${this.css("FRONTMATTERINSTITUTE")}' >${this.uncode(style,institute)}</div>
    <div class='FRONTMATTERAUTHOR' style='${this.css("FRONTMATTERAUTHOR")}' >${this.uncode(style,author)}</div>
    <div class='FRONTMATTERDATE' style='${this.css("FRONTMATTERDATE")}' >${this.uncode(style,date)}</div>
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
  to_toc(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.sig=='HDGS' && block.hdgn==0 && (block.name=='chapter' || block.name=='part')){
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
    var all = [];
    o.forEach((pp) => {
      all.push(`<article class='FOLIO'> `);
      all.push(`<h1> Table Of Contents </h1>`);
      all.push(`<table cellpadding='0' cellspacing='0' width='100%'>`);    
      pp.forEach((p) => {
        let block = p;
        let {label,pagenum,title,style,chapternum,partnum} = block;
        title = this.uncode(style,title);
        if(block.name=='part'){
          all.push(`<tr> <td> Part ${partnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#pagenum.${pagenum}'>${pagenum}</a> </td> </tr>`);
        }else{
          if(partnum){
            all.push(`<tr> <td style='padding-left:1em;' > ${partnum}.${chapternum} &#160; ${title} </td> <td style='text-align:right' > <a href='#pagenum.${pagenum}'>${pagenum}</a> </td> </tr>`);
          }else{
            all.push(`<tr> <td style='padding-left:1em;' > ${chapternum} &#160; ${title} </td> <td style='text-align:right' > <a href='#pagenum.${pagenum}'>${pagenum}</a> </td> </tr>`);
          }
        }
      });
      all.push(`</table>`);    
      all.push(`</article>`);
    }); 
    let text = all.join('\n');
    return text;
  }
}
module.exports = { NitrilePreviewFolio };
