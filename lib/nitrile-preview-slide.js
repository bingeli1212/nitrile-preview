'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewDiagramBall } = require('./nitrile-preview-diagram-ball');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.name = 'slide';
    this.presentation = new NitrilePreviewPresentation(this);
    this.icon_subpoint = '&#x261E;'//WHITE RIGHT POINTING INDEX
    this.icon_solution = '&#x270D;'//WRITING HAND
    this.icon_folder = '&#x2615;'//HOT BEVERAGE
    this.uchar_checkboxo = '&#x2610;' //BALLOT BOX            
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.uchar_checkboxx = '&#x2612;' //BALLOT BOX WITH X
    this.slide_width = 128;//mm
    this.slide_height = 96;//mm
    this.vw = 482;//px
    this.vh = 362;//px
  }
  to_peek_document() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    var html = this.replace_all_refs(html);
    return `${title_html}\n${html}`;
  }
  to_document() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
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
    a {
      color: inherit;
    }
    a:link {
      text-decoration: none;
    }
    a:visited {
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    a:active {
      text-decoration: underline;
    }

    .PARAGRAPH.PRIMARY {
      text-indent: initial;
      margin-top: 1.0em;
    }
    .PARAGRAPH.INDENTING {
      text-indent: initial;
      padding-left: 1.5em;
    }
    .PARAGRAPH, .ITEMIZE, .EQUATION, .TABBING, .FIGURE, .TABLE, .LONGTABLE, .LISTING, .COLUMNS, .SAMPLE {
      text-indent: initial;
      margin-top: 6pt;   
      margin-bottom: 6pt;   
      margin-left:  8mm;
      margin-right: 8mm;
    }
    .SAMPLEBODY {
      text-indent: initial;
      text-align: left;
      line-height: 1;
    }
    .LISTINGBODY {
      line-height: 1; 
      text-align: left; 
      width: 100%; 
    }
    .FIGURE, .TABLE, .LONGTABLE {
      page-break-inside: avoid;
    }
    .FIGCAPTION {
      text-indent: initial;
      text-align: left;
      margin-top: 0;
      margin-bottom: 0.5em;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
      line-height: 1;
      white-space: normal;
    }
    .SUBCAPTION {
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
    .FLOATLEFT {
      text-indent: initial;
      float: left;
      margin-right: 6pt; 
    }
    .FLOATRIGHT {
      text-indent: initial;
      float: right;
      margin-left: 6pt; 
    }
    .CENTER {
      text-indent: initial;
      text-align:center;
      margin-top: 1.0em;
      margin-bottom: 1.0em;
    }
    .FLUSHRIGHT {
      text-indent: initial;
      text-align:right;
      margin-top: 1.0em;
      margin-bottom: 1.0em;
    }
    .FLUSHLEFT {
      text-indent: initial;
      text-align:left;
      margin-top: 1.0em;
      margin-bottom: 1.0em;
    }
    .QUOTE {
      text-indent: initial;
      text-align:left;
      margin-top: 1.0em;
      margin-bottom: 1.0em;
    }
    .DISPLAYMATH {
      text-indent: initial;
      text-align:center;
      margin-top: 1.0em;
      margin-bottom: 1.0em;
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
    .PAR {
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
    .OL {
      padding-left: 1.6em; 
      list-style-type: none;   
      position: relative;
    }
    .UL {
      padding-left: 1.6em; 
      list-style-type: none;   
      position: relative;
    }
    .LI {
      position: relative;
    }
    .LI::before {
      position: absolute;
      content: var(--bull);
      left: -1.6em;
    }
    .TH, .TD {
      padding: 0.1em 0.6em;
    }
    .PART, .CHAPTER, .SECTION, .SUBSECTION, .SUBSUBSECTION, .PRIMARY {
      clear: both;
    }

    .PARAGRAPH {
      text-align: left;
      -webkit-hyphens: auto;
      -moz-hyphens: auto;
      -ms-hyphens: auto;
      hyphens: auto;
    }

    .SLIDETITLE {
      margin-left:10px;
      margin-right:10px;
      margin-top:2mm;
      margin-bottom:0;
      font-size:1.20em;
      font-weight:normal;
      color: #1010B0;
    }
    .SLIDESUBTITLE {
      margin-left:10px;
      margin-right:10px;
      margin-top:1.0mm;
      margin-bottom:0;
      font-size:0.9em;
      font-weight:normal;
      color: #1010B0;
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
        size: 128mm 96mm;
        margin: 0 0 0 0;
      }  
      .SLIDE {
        color: black;
        position: relative;
        page-break-inside: avoid;
        page-break-after: always;
        min-width:100%;
        max-width:100%;
        box-sizing:border-box;
        overflow: hidden;
        padding:1px 0;
      }
      body {
        margin:0;
        padding:0;
        font-family: sans-serif;
        font-size: 10pt;
        line-height: 1.25;
      }
    }
  
    @media screen {
      .SLIDE {
        color: black;
        position: relative;
        background-color: white;
        margin: 1em auto;
        min-width:128mm;
        max-width:128mm;
        min-height:96mm;
        max-height:96mm;
        box-sizing:border-box;
        overflow: hidden;
        padding:1px 0;
      }
      body {
        background-color: gray;
        box-sizing:border-box;
        font-family: sans-serif;
        font-size: 10pt;
        line-height: 1.25;
        padding:1px 0;
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
  to_beamer() {
    let top = this.presentation.to_top(this.parser.blocks);
    ///
    ///
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,i,arr) => {
      let topframe = this.presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          ///note that each subsection is just a 'blocks'
          let subframe = this.presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let out = this.write_frame_folder(`${i+1}`,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,j) => {
          let id = `${i+1}.${j+1}`;
          let order = `${i+1}.${j+1}`;
          let icon = this.icon_folder;
          let out = this.write_one_frame(id,order,icon,subframe,1,topframe);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = i+1;
        let icon = '';
        let out = this.write_one_frame(id,order,icon,topframe,0,topframe);
        d.push(out);
      }
    });
    var main = d.join('\n');
    //
    //table of contents
    //
    var toc = this.write_frame_toc(topframes);
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d.join('\n');
  }
  write_frame_toc(topframes){
    /// decide if we need to change fonts
    var all = [];
    var n = 0;
    var max_n = 16;
    topframes.forEach((topframe,j,arr) => {
      if(n==max_n){
        all.push(`</ul>`);
        all.push('</div>')
        all.push('</article>');
        all.push(''); 
        n=0;
      }
      let slidetitle_css = ('SLIDETITLE');
      let paragraph_css = ('PARAGRAPH');
      let ul_css = ('PARA OL');
      let li_css = ('PACK LI');
      if(n==0){
        all.push(`<article row='0' class='SLIDE'>`);
        all.push(`<h1 class='SLIDETITLE'      > <b>Table Of Contents</b> </h1>`);
        all.push(`<div class='PARAGRAPH'       >`)
        all.push(`<ul class='PARA OL' >`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let order = j+1;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`<li class='PACK LI' style='--bull:"${order}"' > <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> ${this.icon_folder} </li>`);
      }else{
        all.push(`<li class='PACK LI' style='--bull:"${order}"' > <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> </li>`);
      }
      n++;
    });
    all.push(`</ul>`);
    all.push('</div>')
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_frame_folder(id,frame,subframes){
    let slidetitle_css = ('SLIDETITLE');
    let itemize_css = ('ITEMIZE');
    let paragraph_css = ('PARAGRAPH');
    let ul_css = ('PARA UL');
    let li_css = ('PACK LI');
    let boardid = `board${id}`;
    let boardimgid = `boardimg${id}`;
    let boardname = frame.boardname;
    let boardpng = boardname?boardname+'.png':'';
    let frameid = `frame${id}`;

    let all = [];
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' row='${frame.style.row}'>`);
    all.push(`<h1 class='${slidetitle_css}'> ${id} <b>${this.uncode(frame.style,frame.title)}</b> ${this.icon_folder} </h1>`);
    frame.contents.forEach((x) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    // FONT
    all.push(`<div class='${itemize_css}' >`)
    subframes.forEach((subframe,j,arr) => {
      if(j==0){
        all.push(`<ul class='${ul_css}; list-style:none;'>`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${this.icon_folder}</span>`;
      all.push(`<li class='${li_css}' style='position:relative;font-style:oblique'> ${icon} <b> <a href='#frame${id}.${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </b> </li>`);
      if(j+1==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push(`</div>`);
    all.push('</article>');
    all.push('');
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  write_one_frame(id,order,icon,frame,issub,topframe){
    let slidetitle_css = ('SLIDETITLE');
    let slidesubtitle_css = ('SLIDESUBTITLE');
    let itemize_css = ('ITEMIZE');
    let paragraph_css = ('PARAGRAPH');
    let ul_css = ('PARA UL');
    let li_css = ('PACK LI');
    let boardid = `board${id}`;
    let boardimgid = `boardimg${id}`;
    let boardname = frame.boardname;
    let boardpng = boardname?boardname+'.png':'';
    let frameid = `frame${id}`;
    let all = [];
    let v = null;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='${frameid}' row='${frame.style.row}' >`);
    if(issub){
      all.push(`<h1 class='${slidetitle_css}'>${order} ${this.uncode(topframe.style,topframe.title)}<br/><span style='font-size:0.6em;font-style:oblique'>${icon} ${this.uncode(frame.style,frame.title)}</span> </h1>`);
    }else{
      all.push(`<h1 class='${slidetitle_css}'>${order} ${this.uncode(topframe.style,topframe.title)} </h1>`);
    }
    //
    //NOTE: frame contents
    //
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    frame.solutions.forEach((o,i,arr) => {
      if(o.choice){
        let text = this.to_choice(o.style,o.body);
        all.push(`<div class='${paragraph_css}'> ${this.icon_solution} <u>${this.uncode(o.style,o.title)}</u> ${text} </div>`);
      }else{
        all.push(`<div class='${paragraph_css}'> ${this.icon_solution} <u>${this.uncode(o.style,o.title)}</u> </div>`);
      }
    });
    //
    //NOTE: board name
    //
    all.push('</article>');
    all.push('');
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      let title_css = ('SLIDETITLE');
      all.push(`<article class='SLIDE' onmouseenter='myslide=this' onmouseleave='myslide=null' row='${o.style.row}'>`);
      all.push(`<h1 class='${title_css}'> &#160; </h1>`);
      if(o.choice){
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice).trim();
        all.push(`<h2 class='${slidesubtitle_css}'> ${icon} <u> ${title} </u> &#160; ${text} </h2>`)
      }else{
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.untext(o.style,o.body).trim();
        all.push(`<h2 class='${slidesubtitle_css}'> ${icon} <u> ${title} </u> &#160; ${text} </h2>`)
      }
      o.contents.forEach((x) => {
        //'x' is a block
        let html = this.translate_block(x);
        all.push('');
        all.push(html.trim());
      });
      all.push('</article>');
      all.push('');
    })
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_titlepage(){
    let title     = this.parser.conf_to_string('title','Untitled');
    let subtitle  = this.parser.conf_to_string('subtitle')
    let institute = this.parser.conf_to_string('institute');
    let author    = this.parser.conf_to_string('author');
    var style     = this.parser.style;
    var date      = new Date().toLocaleDateString();
    let data = `<article row='0' class='SLIDE'>
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
module.exports = { NitrilePreviewSlide };
