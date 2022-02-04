'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewDiagramBall } = require('./nitrile-preview-diagram-ball');
const { NitrilePreviewPagination } = require('./nitrile-preview-pagination');

var stylesheet = `
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
    line-height: 1.15;
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
    line-height: 1.15;
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
        'font-size: 1.88em',
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
      'HEADING', [
         'margin-top:0mm',
         'margin-bottom:7mm',
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
        'font-weight: 600',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SECTION', [
        'font-size: 1.20em',
        'font-weight: 600',
        'margin-top: 13pt',
        'margin-bottom: 8pt',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SUBSECTION', [
        'font-size: 1.17em',
        'font-weight: 600',
        'margin-top: 10pt',
        'margin-bottom: 8pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SUBSUBSECTION', [
        'font-size: 1.17em',
        'font-weight: 600',
        'margin-top: 8pt',
        'margin-bottom: 8pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'DD', [
        'margin-left: 0em',
        'padding-left: 3em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'OL', [
        'padding-left: 2em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'UL', [
        'padding-left: 2em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'PARAGRAPH', [
        'margin-top: 5pt',
        'margin-bottom: 5pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FIGURE, COLUMN, LISTING, EQUATION, LONGTABU', [
        'margin-left: 0pt',
        'margin-right: 0pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FIGURE', [
        'margin-top: 14pt',
        'margin-bottom: 5pt',
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
  hdgs_to_part(title,label,idnum,idcap,partnum,chapternum,level,style){
    var cls = 'PART';
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
    var body = `
${title_html}
${toc_html}
${output_html}
`;
    var script = '';
    var members = this.parser.members;
    return {stylesheet,body,script,members};
  }
  to_output_html() {
    var o = this.build_default_pagenum_map();
    ///
    ///flatten it
    ///
    var all = [];
    o.forEach((pp,i) => {
      let pagenum = pp.pagenum;
      all.push(`<article class='FOLIO' id='frame${pagenum}' style='position:relative;--page:"${pagenum}";' >`);
      all.push(`<div class='HEADING' id='page${pagenum}' style='${this.css("HEADING")}' > ${pagenum} </div>`);
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
  to_toc_html(){
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
    var all = [];
    o.forEach((pp,j) => {
      all.push(`<article class='FOLIO'> `);
      let csstitle = this.css('TOCTITLE');
      let cssanchor = this.css('TOCANCHOR');
      all.push(`<div class='HEADING' id='toc.${j+1}' style='${this.css("HEADING")}' > </div>`);
      all.push(`<div class='TOCTITLE' style='${csstitle}'> Table Of Contents </div>`);
      all.push(`<table cellpadding='0' cellspacing='0' width='100%'>`);    
      pp.forEach((p) => {
        let block = p;
        let {label,pagenum,title,style,chapternum,partnum} = block;
        title = this.uncode(style,title);
        if(block.name=='part'){
          all.push(`<tr> <td> Part ${partnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
        }else{
          all.push(`<tr> <td style='padding-left:1em;' > ${chapternum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
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
