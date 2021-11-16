'use babel';

const { NitrilePreviewSlide } = require('./nitrile-preview-slide');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewFlowerpot extends NitrilePreviewSlide {

  constructor(parser) {
    super(parser);
    this.name = 'flowerpot';
    this.presentation = new NitrilePreviewPresentation(this);
    this.icon_subpoint = '&#x261E;'//WHITE RIGHT POINTING INDEX
    this.icon_solution = '&#x270D;'//WRITING HAND
    //this.icon_folder = '&#x2668;'//HOT SPRING  
    this.icon_folder = '&#x2615;'//HOT BEVERAGE
    this.uchar_checkboxo = '&#x2610;' //BALLOT BOX            
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.uchar_checkboxx = '&#x2612;' //BALLOT BOX WITH X
    this.n_para = '6pt';
    this.n_pack = '0.0pt';
    this.n_half = '2.25pt';
    this.n_marginleft = '105px';
    this.n_marginright = '30px';
    this.slide_width = 140;//mm
    this.slide_height = 106;//mm
    this.vw = Math.round(140*this.MM_TO_PX);//529
    this.vh = Math.round(106*this.MM_TO_PX);//400
    // console.log(this.vw,this.vh)
    this.bgsvg0 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 529 400"> 
        <rect x="0" y="0" width="529" height="400" stroke="none" fill="#DDEEFF"/> 
    </svg>`;
    this.bgsvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 529 400"> 
        <rect x="0" y="0" width="529" height="400" stroke="none" fill="#F4F4F4"/> 
        <rect x="0" y="0" width="529" height="40" stroke="none" fill="#DDEEFF"/> 
        <rect x="0" y="0" width="88" height="400" stroke="none" fill="#DDEEFF"/> 
        <rect x="0" y="360" width="529" height="40" stroke="none" fill="#B3DAFF"/> 
    </svg>`;
  }
  to_peek_document() {
    var toc = [];
    var pages = [];
    var title_html = this.to_titlepage(pages);
    var main_html = this.to_main_html(toc,pages);
    var main_html = this.replace_all_refs(main_html);
    return `${title_html}\n${main_html}`;
  }
  to_document() {
    var toc = [];
    var pages = [];
    var title_html = this.to_titlepage(pages);
    var main_html = this.to_main_html(toc,pages);
    var main_html = this.replace_all_refs(main_html);
    var totalpagenum = pages.length;
    var allsidesvgs = [];
    toc.forEach((p) => {
      let s = this.to_sidesvg_for_id(p.id,toc,30);
      s = encodeURIComponent(s);
      s = `      --side${p.id}: url("data:image/svg+xml,${s}");`;
      allsidesvgs.push(s);
    })
    var allsidemaps = [];
    toc.forEach((p,i) => {
      let s = this.to_sidemap_for_id(p.id,toc,i,30);
      allsidemaps.push(s);
    })
    // background-repeat: no-repeat, no-repeat, no-repeat;
    // background-position: top left, top left, top left;
    // background-size: 88px 40px, 80px 400px, cover;
    var logofile = this.conf_to_string('logofile');
    var setup_script = this.to_setup_script();
    var main_stylesheet = `\
    :root {
      --logosvg: url("${logofile}");
      --bgsvg: url("data:image/svg+xml,${encodeURIComponent(this.bgsvg)}");
      --bgsvg0: url("data:image/svg+xml,${encodeURIComponent(this.bgsvg0)}");
      --totalpagenum: "${totalpagenum}";
    }
    :root {
${allsidesvgs.join('\n')}
    }
    table {
      font-size: 10pt;
      color: #124A47;
      line-height: 1.00;
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
    .MAIN {
      counter-reset: pagenum;      
    }
    .PAGENUM {
      margin-left: auto;
      margin-right: 10px;
      font-size: 1.2em;
      font-weight: bold;
    }
    .PAGENUM::before {
      counter-increment: pagenum;
      content: counter(pagenum);
    }
    .PAGENUM::after {
      content: var(--totalpagenum);
    }
    .BOTTOMCONTAINER {
      position: absolute;
      top: 360px;
      left: 0px;
      width: 529px;
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
    .SIDECONTAINER {
      position: absolute;
      top: 40px;
      left: 0px;
      bottom: 40px;
      right: 441px;
      overflow: hidden;
    }
    .EDITIMG {
      visibility: hidden;
      position: absolute;
      z-index: 9;
      top: -320px;
      left: 0px;
    }
    .EDITBOARD {
      position: absolute;
      visibility: visible;
      z-index: 10;
      top: -320px;
      left: 88px;
    }
    .EDITBUTTON {
      left: 0px;
      bottom: 0px;
    }
    .EDITFORM {
      margin-left: 0;
      margin-right: auto;
      margin-top: auto;
      margin-bottom: auto;
      align-left: center;
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
      margin-left:  105px;
      margin-right: 30px;
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
      text-align: center;
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
    .SUBFIGURE {
      display: inline-table;
    }
    .WRAPLEFT {
      text-indent: initial;
      float: left;
      margin-right: 1em; 
    }
    .WRAPRIGHT {
      text-indent: initial;
      float: right;
      margin-left: 1em; 
    }
    .CENTER {
      text-indent: initial;
      text-align:center;
      margin-top: 6pt;   
      margin-bottom: 6pt;   
    }
    .FLUSHRIGHT {
      text-indent: initial;
      text-align:right;
      margin-top: 6pt;   
      margin-bottom: 6pt;   
    }
    .FLUSHLEFT {
      text-indent: initial;
      text-align:left;
      margin-top: 6pt;   
      margin-bottom: 6pt;   
    }
    .QUOTE {
      text-indent: initial;
      text-align:left;
      margin-top: 6pt;   
      margin-bottom: 6pt;   
    }
    .DISPLAYMATH {
      text-indent: initial;
      text-align:center;
      margin-top: 6pt;   
      margin-bottom: 6pt;   
    }
    .MATH {
      text-indent: initial;
      text-align:left;
      margin-top: 6pt;   
      margin-bottom: 6pt;   
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
      margin-top: 6pt;   
      margin-bottom: 6pt;   
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
      padding-left: 2.0em; 
    }
    .UL {
      padding-left: 2.0em; 
      list-style-type: square;
    }
    .TH, .TD {
      padding: 0.1em 0.6em;
    }
    .PART, .CHAPTER, .SECTION, .SUBSECTION, .SUBSUBSECTION, .PRIMARY {
      clear: both;
    }

    .PARAGRAPH {
      text-align: justify;
      -webkit-hyphens: auto;
      -moz-hyphens: auto;
      -ms-hyphens: auto;
      hyphens: auto;
    }
    .SLIDETITLE {
      font-family: serif;
      margin-top:6px;
      margin-bottom:10px;
      margin-left:105px;
      margin-right:10px;
      font-size:1.20em;
      font-weight:normal;
      letter-spacing:0.05em;
      min-height: 31px;
    }
    .FRONTMATTERTITLE {
      margin-left: 6.5mm;
      margin-top: 2.5cm;
      margin-bottom: 0;
      width: 115mm;
      font-size: 1.8em;
      font-weight: bold;
      text-align: center;
      align-self: center;
    }
    .FRONTMATTERSUBTITLE {
      margin-left: 6.5mm;
      margin-top: 0.8cm;
      margin-bottom: 0;
      width: 115mm;
      font-size: 1.1em;
      text-align: center;
      align-self: center;
    }
    .FRONTMATTERINSTITUTE {
      margin-left: 6.5mm;
      margin-top: 0.2cm;
      margin-bottom: 0;
      width: 115mm;
      font-size: 1.1em;
      text-align: center;
      align-self: center;
    }
    .FRONTMATTERAUTHOR {
      margin-left: 6.5mm;
      margin-top: 0.2cm;
      margin-bottom: 0;
      width: 115mm;
      font-size: 1.1em;
      text-align: center;
      align-self: center;
    }
    .FRONTMATTERDATE {
      margin-left: 6.5mm;
      margin-top: 0.2cm;
      margin-bottom: 0;
      width: 115mm;
      font-size: 1.1em;
      text-align: center;
      align-self: center;
    }

    @media print {

      @page {
        size: 140mm 106mm;
      }  
  
      .SLIDE {
        color: #124A47;
        position: relative;
        page-break-inside: avoid;
        page-break-after: always;
        min-width:100vw;
        max-width:100vw;
        min-height:100vh;
        max-height:100vh;
        box-sizing:border-box;
        overflow: hidden;
        padding:1px 0;
        font-family: serif;
        font-size: 10pt;
        line-height: 1.25;
      }

      body {
        margin:0;
        padding:0;
      }

    }
  
    @media screen {
  
      .SLIDE {
        color: #124A47;
        position: relative;
        outline: 1px solid #124A47;
        margin: 1em auto 1em 5px;
        min-width:140mm;
        max-width:140mm;
        min-height:106mm;
        max-height:106mm;
        box-sizing:border-box;
        overflow: hidden;
        padding:1px 0;
        font-family: serif;
        font-size: 10pt;
        line-height: 1.25;
      }
  
      body {
        background-color: lightgray;
        box-sizing:border-box;
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
${main_stylesheet}
</style>
<script>
//<![CDATA[
${setup_script}
//]]>
</script>
</head>
<body onload='setup()' onkeypress='body_keypress()' >
${allsidemaps.join('\n')}
<main class='MAIN'>
${title_html}
${main_html}
</main>
</body>
</html>
`;
    return xhtmldata;
  }
  to_main_html(toc,pages) {
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
        let out = this.write_frame_folder(`${i+1}`,topframe,subframes,toc,pages);
        d.push(out);
        topframe.subframes.forEach((subframe,j) => {
          let id = `${i+1}x${j+1}`;
          let order = `${i+1}.${j+1}`;
          let icon = this.icon_folder;
          let out = this.write_one_frame(id,order,icon,subframe,1,`${i+1}`,toc,pages,topframe);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = i+1;
        let icon = this.icon_folder;
        let out = this.write_one_frame(id,order,icon,topframe,0,'',toc,pages,topframe);
        d.push(out);
      }
    });
    var text = d.join('\n');
    //
    //title and table of contents
    //
    var table_of_contents_frame = this.write_frame_toc(topframes,pages);
    //
    // put together
    //
    var d = [];
    d.push(table_of_contents_frame);
    d.push(text);
    return d.join('\n');
  }
  write_frame_toc(topframes,pages){
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
      let paragraph_css = ('PARAGRAPH');
      let ul_css = ('PARA UL');
      let li_css = ('PACK');
      if(n==0){
        all.push(`<article row='0' class='SLIDE' style='background-image:var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:top left;background-size:88px 40px,cover;' >`);
        pages.push('');
        all.push(`<div class='BOTTOMCONTAINER'><div class='PAGENUM'> / </div></div>`);
        all.push(`<h1 class='SLIDETITLE'> <b>Table Of Contents</b> </h1>`);
        all.push(`<div class='${paragraph_css}'>`)
        all.push(`<ul class='${ul_css}' style='list-style:none;'>`);
      }
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`<li class='${li_css}' style='position:relative'> ${icon} <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> ${this.icon_folder} </li>`);
      }else{
        all.push(`<li class='${li_css}' style='position:relative'> ${icon} <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> </li>`);
      }
      n++;
    });
    all.push(`</ul>`);
    all.push('</div>')
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_frame_folder(id,frame,subframes,toc,pages){
    let itemize_css = ('ITEMIZE');
    let paragraph_css = ('PARAGRAPH');
    let ul_css = ('PARA UL');
    let li_css = ('PACK LI');
    let all = [];
    //
    //NOTE: main contents
    //
    let frameid = `frame${id}`;
    let boardid = `board${id}`;
    let imgid   = `img${id}`;
    let boardname = frame.boardname;
    let boardpng = boardname?boardname+'.png':'';
    let edit_contents = this.to_edit_contents(boardid,boardname);
    all.push(`<article class='SLIDE' id='${frameid}' row='${frame.style.row}' style='--boardpng:url("${boardpng}");background-image:var(--boardpng),var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:88px 40px,top left,top left;background-size:441px 320px,88px 40px,cover;' >`);
    pages.push(1);
    all.push(`<div class='BOTTOMCONTAINER'>`);
    all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' data-imgid='${imgid}' data-boardname='${boardname}' data-frameid='${frameid}' width='441' height='320' onkeypress='canvas_keypress()' ></canvas>`);
    all.push(`<div class='PAGENUM'> / </div>`);
    all.push(`</div>`);
    all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
    all.push(`<h1 class='SLIDETITLE'> ${id} <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    toc.push({id,order:id,icon:'',style:frame.style,title:frame.title,posticon:''})
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
        all.push(`<ul class='${ul_css}' style='list-style:none;'>`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${this.icon_folder}</span>`;
      all.push(`<li class='${li_css}' style='position:relative;font-style:oblique'> ${icon} <b> <a href='#frame${id}x${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </b> </li>`);
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
  write_one_frame(id,order,icon,frame,issub,parentid,toc,pages,topframe){
    let itemize_css = ('ITEMIZE');
    let paragraph_css = ('PARAGRAPH');
    let all = [];
    let v = null;
    //
    //NOTE: main contents
    //
    let frameid = `frame${id}`;
    let boardid = `board${id}`;
    let imgid   = `img${id}`;
    let boardname = frame.boardname;
    let boardpng = boardname?boardname+'.png':'';
    let edit_contents = this.to_edit_contents(boardid,boardname);
    all.push(`<article class='SLIDE' id='${frameid}' row='${frame.style.row}' style='--boardpng:url("${boardpng}");background-image:var(--boardpng),var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:88px 40px,top left,top left;background-size:441px 320px,88px 40px,cover;' >`);
    pages.push(1);
    all.push(`<div class='BOTTOMCONTAINER'>`);
    all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' data-imgid='${imgid}' data-boardname='${boardname}' data-frameid='${frameid}' width='441' height='320' onkeypress='canvas_keypress()' ></canvas>`);
    all.push(`<div class='PAGENUM'> / </div>`);
    all.push(`</div>`);
    all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
    if(issub){
      all.push(`<h1 class='SLIDETITLE'>${order} <a href='#frame${parentid}'></a> <b>${this.uncode(topframe.style,topframe.title)}<br/><span style='font-size:0.6em;font-style:oblique'>${icon} ${this.uncode(frame.style,frame.title)}</span></b> </h1>`);
      order = '';
    }else{
      icon = '';
      all.push(`<h1 class='SLIDETITLE'>${order} <a href='#frame${parentid}'></a> <b>${this.uncode(topframe.style,topframe.title)}</b> </h1>`);
    }
    toc.push({id,order,icon,style:frame.style,title:frame.title,posticon:'',issub})
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
    all.push('</article>');
    all.push('');
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      let frameid = `frame${id}a${i}`;
      let boardid = `board${id}a${i}`;
      let imgid   = `img${id}a${i}`;
      let boardname = '';//empty imgs
      let edit_contents = this.to_edit_contents(boardid,boardname);
      all.push(`<article class='SLIDE' id='${frameid}' row='${frame.style.row}' style='--boardpng:url("");background-image:var(--boardpng),var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:88px 40px,top left,top left;background-size:441px 320px,88px 40px,cover;' >`);
      pages.push(1);
      all.push(`<div class='BOTTOMCONTAINER'>`);
      all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' data-imgid='${imgid}' data-boardname='${boardname}' data-frameid='${frameid}' width='441' height='320' onkeypress='canvas_keypress()' ></canvas>`);
      all.push(`<div class='PAGENUM'> / </div>`);
      all.push(`</div>`);
      all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
      all.push(`<h1 class='SLIDETITLE'> &#160; </h1>`);
      if(o.choice){
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice).trim();
        all.push(`<div class='${paragraph_css}'> ${this.icon_solution} <u>${title}</u> &#160; ${text} </div>`)
      }else{
        let title = this.uncode(o.style,o.title).trim();
        let text = this.untext(o.style,o.body).trim();
        all.push(`<div class='${paragraph_css}'> ${this.icon_solution} <u>${title}</u> &#160; ${text} </div>`)
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
  to_titlepage(pages){
    let title     = this.parser.conf_to_string('title','Untitled');
    let subtitle  = this.parser.conf_to_string('subtitle')
    let institute = this.parser.conf_to_string('institute');
    let author    = this.parser.conf_to_string('author');
    var style     = this.parser.style;
    var date      = new Date().toLocaleDateString();
    let data = `<article row='0' class='SLIDE' style='background:var(--bgsvg0);'>
    <div class='FRONTMATTERTITLE' >${this.uncode(style,title)}</div>
    <div class='FRONTMATTERSUBTITLE' >${this.uncode(style,subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' >${this.uncode(style,institute)}</div>
    <div class='FRONTMATTERAUTHOR' >${this.uncode(style,author)}</div>
    <div class='FRONTMATTERDATE' >${this.uncode(style,date)}</div>
    <div class='BOTTOMCONTAINER'><div class='PAGENUM'> / </div></div>
    </article>
    `;
    pages.push(1);
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
  to_sidesvg_for_id(id,toc,max_n=30){
    var all = [];
    var where_j = 0;
    toc.forEach((p,j) => {
      if(p.id==id){
        where_j = j;
      }
    });
    var dj = 0;
    var dy = 0;
    if(where_j > max_n){
      dj = where_j - max_n;
      dy = dj*10;
    }
    toc.forEach((p,j) => {
      let y = j*10;
      if(where_j==j){
        all.push(`<rect x="0" y="${y-dy}" width="88" height="10" stroke="none" fill="#124A47"/>`);
        var fontcolor = '#DDEEFF';
      }else{
        var fontcolor = '#124A47';
      }
      let x = 5;
      if(p.issub){
        x += 5;
      }
      all.push(`<text id="svg${p.id}" x="${x}" y="${y-dy+8}" stroke="none" fill="${fontcolor}" font-size="5pt" >${p.order} ${p.icon} ${this.smooth(p.title)} ${p.posticon} </text>`)
    })
    var text = all.join('\n');
    text = (`<svg xmlns="http://www.w3.org/2000/svg" width="88" height="360" viewBox="0 0 88 360"> ${text} </svg>`);
    return text
  }
  to_sidemap_for_id(id,toc,where_j,max_n){
    var all = [];
    all.push(`<map name='map${id}'>`);
    toc.forEach((p,j) => {
      // 508 <map name='shapesmap'><area shape='rect' coords='0 0 88 10' href='http:www.google.com'/> </map>
      if(where_j > max_n){
        let dn = where_j - max_n;
        all.push(`<area shape='rect' coords='0 ${(j-dn)*10} 88 ${(j-dn)*10+10}' href='#frame${p.id}'/>`);
      }else{
        all.push(`<area shape='rect' coords='0 ${j*10} 88 ${j*10+10}' href='#frame${p.id}'/>`);
      }
    })
    all.push(`</map>`);
    return all.join('\n')
  }
  to_edit_contents(boardid,boardname){
    return `\
       <select name='${boardid}' onchange='board_change_op(this.value,this.name)'>
        <optgroup label='Draw'>
           <option value='pencil'>Pencil</option>
           <option value='smudge'>Smudge</option>
           <option value='eraser'>Eraser</option>
        </optgroup>
        <optgroup label='Shape'>
           <option value='shape/circle'>Circle</option>
           <option value='shape/rect'>Rectangle</option>
           <option value='shape/tri'>Triangle</option>
           <option value='shape/line'>Line</option>
        </optgroup>
        <optgroup label='Selection'>
           <option value='select/move'>Move</option>
           <option value='select/copy'>Copy</option>
           <option value='select/resize'>Resize</option>
        </optgroup>
        <optgroup label='Object'>
           <option value='object/object'>Object</option>
        </optgroup>
       </select>
       <select name='${boardid}' onchange='board_change_color(this.value,this.name)'>
          <option value='Black'>Black</option>
          <option value='Blue'>Blue</option>
          <option value='BlueViolet'>BlueViolet</option>
          <option value='Brown'>Brown</option>
          <option value='BurlyWood'>BurlyWood</option>
          <option value='CadetBlue'>CadetBlue</option>
          <option value='Chartreuse'>Chartreuse</option>
          <option value='Chocolate'>Chocolate</option>
          <option value='Coral'>Coral</option>
          <option value='CornflowerBlue'>CornflowerBlue</option>
          <option value='Crimson'>Crimson</option>
          <option value='Cyan'>Cyan</option>
          <option value='DarkBlue'>DarkBlue</option>
          <option value='DarkCyan'>DarkCyan</option>
          <option value='DarkGoldenRod'>DarkGoldenRod</option>
          <option value='DarkGray'>DarkGray</option>
          <option value='DarkGreen'>DarkGreen</option>
          <option value='DarkKhaki'>DarkKhaki</option>
          <option value='DarkMagenta'>DarkMagenta</option>
          <option value='DarkOliveGreen'>DarkOliveGreen</option>
          <option value='DarkOrange'>DarkOrange</option>
          <option value='DarkOrchid'>DarkOrchid</option>
          <option value='DarkRed'>DarkRed</option>
          <option value='DarkSalmon'>DarkSalmon</option>
          <option value='DarkSeaGreen'>DarkSeaGreen</option>
          <option value='DarkSlateBlue'>DarkSlateBlue</option>
          <option value='DarkSlateGray'>DarkSlateGray</option>
          <option value='DarkSlateGrey'>DarkSlateGrey</option>
          <option value='DarkTurquoise'>DarkTurquoise</option>
          <option value='DarkViolet'>DarkViolet</option>
          <option value='DeepPink'>DeepPink</option>
          <option value='DeepSkyBlue'>DeepSkyBlue</option>
          <option value='DimGray'>DimGray</option>
          <option value='DimGrey'>DimGrey</option>
          <option value='DodgerBlue'>DodgerBlue</option>
          <option value='FireBrick'>FireBrick</option>
          <option value='FloralWhite'>FloralWhite</option>
          <option value='ForestGreen'>ForestGreen</option>
          <option value='Fuchsia'>Fuchsia</option>
          <option value='Gainsboro'>Gainsboro</option>
          <option value='GhostWhite'>GhostWhite</option>
          <option value='Gold'>Gold</option>
          <option value='GoldenRod'>GoldenRod</option>
          <option value='Gray'>Gray</option>
          <option value='Grey'>Grey</option>
          <option value='Green'>Green</option>
          <option value='GreenYellow'>GreenYellow</option>
          <option value='HoneyDew'>HoneyDew</option>
          <option value='HotPink'>HotPink</option>
          <option value='IndianRed'>IndianRed</option>
          <option value='Indigo'>Indigo</option>
          <option value='Ivory'>Ivory</option>
          <option value='Khaki'>Khaki</option>
          <option value='Lavender'>Lavender</option>
          <option value='LavenderBlush'>LavenderBlush</option>
          <option value='LawnGreen'>LawnGreen</option>
          <option value='LemonChiffon'>LemonChiffon</option>
          <option value='LightBlue'>LightBlue</option>
          <option value='LightCoral'>LightCoral</option>
          <option value='LightCyan'>LightCyan</option>
          <option value='LightGoldenRodYellow'>LightGoldenRodYellow</option>
          <option value='LightGray'>LightGray</option>
          <option value='LightGrey'>LightGrey</option>
          <option value='LightGreen'>LightGreen</option>
          <option value='LightPink'>LightPink</option>
          <option value='LightSalmon'>LightSalmon</option>
          <option value='LightSeaGreen'>LightSeaGreen</option>
          <option value='LightSkyBlue'>LightSkyBlue</option>
          <option value='LightSlateGray'>LightSlateGray</option>
          <option value='LightSlateGrey'>LightSlateGrey</option>
          <option value='LightSteelBlue'>LightSteelBlue</option>
          <option value='LightYellow'>LightYellow</option>
          <option value='Lime'>Lime</option>
          <option value='LimeGreen'>LimeGreen</option>
          <option value='Linen'>Linen</option>
          <option value='Magenta'>Magenta</option>
          <option value='Maroon'>Maroon</option>
          <option value='MediumAquaMarine'>MediumAquaMarine</option>
          <option value='MediumBlue'>MediumBlue</option>
          <option value='MediumOrchid'>MediumOrchid</option>
          <option value='MediumPurple'>MediumPurple</option>
          <option value='MediumSeaGreen'>MediumSeaGreen</option>
          <option value='MediumSlateBlue'>MediumSlateBlue</option>
          <option value='MediumSpringGreen'>MediumSpringGreen</option>
          <option value='MediumTurquoise'>MediumTurquoise</option>
          <option value='MediumVioletRed'>MediumVioletRed</option>
          <option value='MidnightBlue'>MidnightBlue</option>
          <option value='MintCream'>MintCream</option>
          <option value='MistyRose'>MistyRose</option>
          <option value='Moccasin'>Moccasin</option>
          <option value='NavajoWhite'>NavajoWhite</option>
          <option value='Navy'>Navy</option>
          <option value='OldLace'>OldLace</option>
          <option value='Olive'>Olive</option>
          <option value='OliveDrab'>OliveDrab</option>
          <option value='Orange'>Orange</option>
          <option value='OrangeRed'>OrangeRed</option>
          <option value='Orchid'>Orchid</option>
          <option value='PaleGoldenRod'>PaleGoldenRod</option>
          <option value='PaleGreen'>PaleGreen</option>
          <option value='PaleTurquoise'>PaleTurquoise</option>
          <option value='PaleVioletRed'>PaleVioletRed</option>
          <option value='PapayaWhip'>PapayaWhip</option>
          <option value='PeachPuff'>PeachPuff</option>
          <option value='Peru'>Peru</option>
          <option value='Pink'>Pink</option>
          <option value='Plum'>Plum</option>
          <option value='PowderBlue'>PowderBlue</option>
          <option value='Purple'>Purple</option>
          <option value='RebeccaPurple'>RebeccaPurple</option>
          <option value='Red'>Red</option>
          <option value='RosyBrown'>RosyBrown</option>
          <option value='RoyalBlue'>RoyalBlue</option>
          <option value='SaddleBrown'>SaddleBrown</option>
          <option value='Salmon'>Salmon</option>
          <option value='SandyBrown'>SandyBrown</option>
          <option value='SeaGreen'>SeaGreen</option>
          <option value='SeaShell'>SeaShell</option>
          <option value='Sienna'>Sienna</option>
          <option value='Silver'>Silver</option>
          <option value='SkyBlue'>SkyBlue</option>
          <option value='SlateBlue'>SlateBlue</option>
          <option value='SlateGray'>SlateGray</option>
          <option value='SlateGrey'>SlateGrey</option>
          <option value='Snow'>Snow</option>
          <option value='SpringGreen'>SpringGreen</option>
          <option value='SteelBlue'>SteelBlue</option>
          <option value='Tan'>Tan</option>
          <option value='Teal'>Teal</option>
          <option value='Thistle'>Thistle</option>
          <option value='Tomato'>Tomato</option>
          <option value='Turquoise'>Turquoise</option>
          <option value='Violet'>Violet</option>
          <option value='Wheat'>Wheat</option>
          <option value='White'>White</option>
          <option value='WhiteSmoke'>WhiteSmoke</option>
          <option value='Yellow'>Yellow</option>
          <option value='YellowGreen'>YellowGreen</option>
       </select>
       <select name='${boardid}' onchange='board_change_stroke(this.value,this.name)'>
           <option value='1.0'>Thin</option>
           <option value='2.0'>Mid</option>
           <option value='4.0'>Thick</option>
           <option value='0.0'>Special</option>
       </select>
       <textarea class='EDITDATAURI' name='textarea' style='display:none'> </textarea>
       <textarea class='EDITFILENAME' name='filename' style='display:none'> </textarea>
       <button type='button' onclick='board_undo("${boardid}")'>&#x2B6E;</button>
       <button type='button' onclick='board_redo("${boardid}")'>&#x2B6F;</button>
       <button>&#x2B8B;</button>
       `;
  }
  ////////////////////////////////////////////////////////////////////////
  //
  //
  //
  ////////////////////////////////////////////////////////////////////////
  to_setup_script(){
    return `\
    allnames=['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen'];
    allhexcs=['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32'];
    allrgbs = {};
    //all_op = 'pencil';
    //all_arg = 'circle';
    //all_stroke = 1.5;
    //all_color = 'RoyalBlue';
    all_canvas = null;
    for(let i=0; i < allnames.length; ++i){
      var name = allnames[i];
      var hexc = allhexcs[i];
      if(typeof hexc == 'string' && hexc.length==6){
        let r = '0x' + hexc.substr(0,2);
        let g = '0x' + hexc.substr(2,2);
        let b = '0x' + hexc.substr(4,2);
        r = parseInt(r);
        g = parseInt(g);
        b = parseInt(b);
        allrgbs[name]=[r,g,b];
      }
    }
    function setup(){
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        board_setup_canvas(canvas);
      }
    }
    function board_setup_canvas(canvas){
      canvas.addEventListener("mousedown",  board_onmousedown,  false);
      canvas.addEventListener("mousemove",  board_onmousemove,  false);
      canvas.addEventListener("mouseup",    board_onmouseup,    false);
      canvas.addEventListener("mouseenter", board_onmouseenter, false);
      canvas.addEventListener("mouseleave", board_onmouseleave, false);
      canvas.addEventListener("touchstart", board_ontouchstart, false);
      canvas.addEventListener("touchmove",  board_ontouchmove,  false);
      canvas.addEventListener("touchend",   board_ontouchend,   false);
      canvas.addEventListener("touchcancel",board_ontouchcancel,false);
      canvas.style.cursor = 'crosshair';
      var ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.mode = 0;
      if(1){
        ctx.note = {};
        ///GLOBAL STORAGE
        ///CANVAS-SPECIFIC STORAGE
        ctx.note.myfig = {x:0,y:0,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke:1,mycolor:'RoyalBlue'};
        ctx.note.mybasis = {x:0,y:0,w:0,h:0,dx:0,dy:0,dw:0,dh:0,s:null,a:null};
        ctx.note.myundo = [];
        ctx.note.myredo = [];
        ctx.note.all_op = 'pencil';
        ctx.note.all_arg = 'circle';
        ctx.note.all_stroke = 1.5;
        ctx.note.all_color = 'RoyalBlue';
        var s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.note.myface = s;
        var myfig = {...ctx.note.myfig};
        var mybasis = {...ctx.note.mybasis};
        var myop = ctx.note.all_op;
        var myarg = ctx.note.all_arg;
        ctx.note.myundo.push({s,mybasis,myop,myarg,myfig});
      }
      if(1){
        ctx.cplane = {};
        ctx.cplane.w = parseFloat(canvas.width);
        ctx.cplane.h = parseFloat(canvas.height);
        ctx.cplane.grid = 30;
        ctx.cplane.origin_x = Math.round(ctx.cplane.w/2);
        ctx.cplane.origin_y = Math.round(ctx.cplane.h/2);
        ctx.cplane.action = 'add';
        ctx.cplane.translate_x = 0.0;//in grid unit
        ctx.cplane.translate_y = 0.0;//in grid unit
        ctx.cplane.scale_factor = 1.0;
        ctx.cplane.rotate_ang = 0;
        ctx.cplane.mymouseisdown = 0;
        ctx.cplane.val_real = 2;
        ctx.cplane.val_imag = 1;
      }
    }
    function board_draw_canvas(canvas){
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_handle_keydown(shiftKey,keycode,ctx,canvas){
      console.log(keycode);
      switch(keycode){
      ///FOR SMUDGE
      case 'Backquote':
        ctx.note.all_op='smudge';
        break;
      ///FOR PENCIL
      case 'Digit1':
        ctx.note.all_op='pencil';
        break;
      ///FOR LINE  
      case 'Digit2':
        ctx.note.all_op='shape';
        ctx.note.all_arg='line';
        break;
      ///FOR TRI   
      case 'Digit3':
        ctx.note.all_op='shape';
        ctx.note.all_arg='tri';
        break;
      ///FOR RECT  
      case 'Digit4':
        ctx.note.all_op='shape';
        ctx.note.all_arg='rect';
        break;
      ///FOR CIRCLE
      case 'Digit5':
        ctx.note.all_op='shape';
        ctx.note.all_arg='circle';
        break;
      ///FOR SELECT
      case 'Digit6':
        ctx.note.all_op='select';
        ctx.note.all_arg=(shiftKey)?'copy':'move';
        break;
      ///FOR PENCIL COLORS ROYALBLUE
      case 'Digit7':
        var value = 'RoyalBlue';
        ctx.note.all_color = value;
        break;
      ///FOR PENCIL COLORS DARKORCHID
      case 'Digit8':
        var value = 'DarkOrchid';
        ctx.note.all_color = value;
        break;
      ///FOR PENCIL COLORS DARKOLIVEGREEN
      case 'Digit9':
        var value = 'DarkOliveGreen';
        ctx.note.all_color = value;
        break;
      ///FOR PENCIL COLORS CHOCOLATE     
      case 'Digit0':
        var value = 'Chocolate';
        ctx.note.all_color = value;
        break;
      ///FOR PENCIL SIZE BIG  
      case 'Equal':
        if(ctx && ctx.mode==0){
          ctx.note.all_stroke = 3.0;
        }else if(ctx && ctx.mode==1){
          //zoom-in
          ctx.cplane.grid += 2;
          ctx.cplane.grid = Math.max(4,ctx.cplane.grid);
          ctx.cplane.grid = Math.min(100,ctx.cplane.grid);
          cplane_redraw(ctx,canvas);
        }
        break;
      ///FOR PENCIL SIZE SMALL
      case 'Minus':
        if(ctx && ctx.mode==0){
          ctx.note.all_stroke = 1.5;
        }else if(ctx && ctx.mode==1){
          //zoom-out       
          ctx.cplane.grid -= 2;
          ctx.cplane.grid = Math.max(4,ctx.cplane.grid);
          ctx.cplane.grid = Math.min(100,ctx.cplane.grid);
          cplane_redraw(ctx,canvas);
        }
        break;
      ///FOR mode
      case 'Backslash':
        if(ctx){
          ctx.mode = (ctx.mode + 1) % 2;
          if(ctx && ctx.mode==0){
            note_redraw(null,ctx,canvas);
          }else{
            cplane_redraw(ctx,canvas);
          }
        }
        break;
      case 'KeyK':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.y  += - 1;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode==1){
          ctx.cplane.val_imag += 1;
          cplane_redraw(ctx,canvas);
        }
        break;
      case 'KeyJ':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.y  += + 1;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode==1){
          ctx.cplane.val_imag -= 1;
          cplane_redraw(ctx,canvas);
        }
        break;
      case 'KeyH':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.x  += - 1;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode==1){
          ctx.cplane.val_real -= 1;
          cplane_redraw(ctx,canvas);
        }
        break;
      case 'KeyL':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.x  += + 1;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode==1){
          ctx.cplane.val_real += 1;
          cplane_redraw(ctx,canvas);
        }
        break;
      ///ROTATE
      case 'KeyE':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.rotate += (-1);
          note_redraw(null,ctx,canvas);
        }
        break;
      case 'KeyR':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.rotate += (+1);
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode==1){
          cplane_reset(ctx,canvas);
        }
        break;
      ///SCALE-S
      case 'KeyD':
        if(ctx && ctx.mode==0){
          //reduce the size
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.w /= 1.01;
          o.myfig.h /= 1.01;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode==1){
          //zoom-out       
          ctx.cplane.grid -= 2;
          ctx.cplane.grid = Math.max(4,ctx.cplane.grid);
          ctx.cplane.grid = Math.min(100,ctx.cplane.grid);
          cplane_redraw(ctx,canvas);
        }
        break;
      case 'KeyS':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.w *= 1.01;
          o.myfig.h *= 1.01;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode==1){
          //zoom-in
          ctx.cplane.grid += 2;
          ctx.cplane.grid = Math.max(4,ctx.cplane.grid);
          ctx.cplane.grid = Math.min(100,ctx.cplane.grid);
          cplane_redraw(ctx,canvas);
        }
        break;
      ///SCALE-W
      case 'KeyW':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.w  += (shiftKey)?(-1):(+1);
          note_redraw(null,ctx,canvas);
        }
        break;
      ///SCALE-T 
      case 'KeyT':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.h  += (shiftKey)?(-1):(+1);
          note_redraw(null,ctx,canvas);
        }
        break;
      ///SKEW-X  
      case 'KeyX':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.skewX += (shiftKey)?(-1):(+1);
          note_redraw(null,ctx,canvas);
        }
        break;
      ///SKEW-Y  
      case 'KeyY':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.skewY += (shiftKey)?(-1):(+1);
          note_redraw(null,ctx,canvas);
        }
        break;
      ///DUPLICATE
      case 'KeyM':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          let myop     = o.myop;
          let myarg    = o.myarg;
          let myfig    = o.myfig;
          let s        = ctx.note.myface;
          let mybasis  = ctx.note.mybasis;
          myfig = {...myfig};
          mybasis = {...mybasis};
          ///save 
          ctx.note.myundo.push({s,mybasis,myop,myarg,myfig});
          ctx.note.myredo = [];
          ctx.note.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
          note_redraw(null,ctx,canvas);
        }
        if(ctx && ctx.mode==1){
          ctx.cplane.action='multiply';
          cplane_reset(ctx,canvas);
        }
        break;
      ///FOR UNDO
      case 'KeyZ':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          if(ctx.note.myundo.length>1){
            o = ctx.note.myundo.pop();
            ctx.note.myredo.push(o);
          }
          note_redraw(null,ctx,canvas);
        }
        break;
      ///FOR REDO
      case 'KeyA':
        if(ctx && ctx.mode==0){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          if(ctx.note.myredo.length>0){
            let o = ctx.note.myredo.pop();
            if( o.myop=='shape' ){
              o.s = ctx.note.myface;
            }
            ctx.note.myundo.push(o);
          }
          note_redraw(null,ctx,canvas);
        }
        if(ctx && ctx.mode==1){
          ctx.cplane.action='add';
          cplane_reset(ctx,canvas);
        }
        break;
      }
    }
    function board_onmousedown(evt){
      if(evt.button==0){
        var canvas = evt.target;
        var ctx = canvas.getContext("2d");
        if(ctx.mode==0){
          let [sx,sy] = board_calc_sx_and_sy(canvas);
          ctx.note.myposx0 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
          ctx.note.myposy0 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
          ctx.note.myposx1 = ctx.note.myposx0;
          ctx.note.myposy1 = ctx.note.myposy0;
          ctx.note.myposx2 = ctx.note.myposx1;
          ctx.note.myposy2 = ctx.note.myposy1;
          ctx.note.shiftKey = evt.shiftKey;
          ctx.note.altKey   = evt.altKey;
          ctx.note.mymouseisdown = 1;
          note_start(ctx,canvas);
        }
        if(ctx.mode==1){
          let [sx,sy] = board_calc_sx_and_sy(canvas);
          ctx.cplane.myposx0 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
          ctx.cplane.myposy0 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
          ctx.cplane.myposx1 = ctx.cplane.myposx0;
          ctx.cplane.myposy1 = ctx.cplane.myposy0;
          ctx.cplane.myposx2 = ctx.cplane.myposx1;
          ctx.cplane.myposy2 = ctx.cplane.myposy1;
          ctx.cplane.mymouseisdown = 1;
          ctx.cplane.shiftKey = evt.shiftKey;
          ctx.cplane.altKey   = evt.altKey;
          cplane_start(ctx,canvas);
        }
      }
    }
    function board_onmousemove(evt){
      if(evt.button==0){
        var canvas = evt.target;
        var ctx = canvas.getContext("2d");
        if(ctx.mode==0){
          let [sx,sy] = board_calc_sx_and_sy(canvas);
          ctx.note.myposx1 = ctx.note.myposx2;
          ctx.note.myposy1 = ctx.note.myposy2;
          ctx.note.myposx2 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
          ctx.note.myposy2 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
          ctx.note.shiftKey = evt.shiftKey;
          ctx.note.altKey   = evt.altKey;
          if(ctx.note.mymouseisdown){
            note_drag(ctx,canvas);
          }
        }
        if(ctx.mode==1){
          let [sx,sy] = board_calc_sx_and_sy(canvas);
          ctx.cplane.myposx1 = ctx.cplane.myposx2;
          ctx.cplane.myposy1 = ctx.cplane.myposy2;
          ctx.cplane.myposx2 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
          ctx.cplane.myposy2 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
          ctx.cplane.shiftKey = evt.shiftKey;
          ctx.cplane.altKey   = evt.altKey;
          if(ctx.cplane.mymouseisdown){
            cplane_drag(ctx,canvas);
          }
        }
      }
    }
    function board_onmouseup(evt){
      if(evt.button==0){
        var canvas = evt.target;
        var ctx = canvas.getContext("2d");
        if(ctx.mode==0){
          if(ctx.note.mymouseisdown){
            note_end(ctx,canvas);
          }
          ctx.note.mymouseisdown = 0;
          ctx.note.shiftKey = 0;
          ctx.note.altKey = 0;
        }
        if(ctx.mode==1){
          if(ctx.cplane.mymouseisdown){
            cplane_end(ctx,canvas);
          }
          ctx.cplane.mymouseisdown = 0;
          ctx.cplane.shiftKey = 0;
          ctx.cplane.altKey = 0;
        }
      }
    }
    function board_onmouseenter(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.note.mymouseisdown = 0;
      ctx.note.shiftKey = evt.shiftKey;
      ctx.note.altKey   = evt.altKey;
    }
    function board_onmouseleave(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.note.mymouseisdown = 0;
      ctx.note.shiftKey = evt.shiftKey;
      ctx.note.altKey   = evt.altKey;
    }
    function board_ontouchstart(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                             
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.note.myposx0 = Math.round((touch.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.note.myposy0 = Math.round((touch.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.note.myposx1 = ctx.note.myposx0;
        ctx.note.myposy1 = ctx.note.myposy0;
        ctx.note.myposx2 = ctx.note.myposx1;
        ctx.note.myposy2 = ctx.note.myposy1;
        ctx.note.mymouseisdown = 1;
        ctx.note.shiftKey = evt.shiftKey;
        ctx.note.altKey   = evt.altKey;
        if(ctx.note.mymouseisdown){
          note_start(ctx,canvas);
        }
      }
    }
    function board_ontouchmove(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.note.myposx1 = ctx.note.myposx2;
        ctx.note.myposy1 = ctx.note.myposy2;
        ctx.note.myposx2 = Math.round((touch.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.note.myposy2 = Math.round((touch.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.note.shiftKey = evt.shiftKey;
        ctx.note.altKey   = evt.altKey;
        if(ctx.note.mymouseisdown){
          note_drag(ctx,canvas);
        }
      }
    }
    function board_ontouchend(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        var ctx = canvas.getContext("2d");
        note_end(ctx,canvas);
        ctx.note.mymouseisdown = 0;
        ctx.note.shiftKey = 0;
        ctx.note.altKey   = 0;
      }
    }
    function board_ontouchcancel(evt) {
      evt.preventDefault();
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        var ctx = canvas.getContext("2d");
        note_end(ctx,canvas);
        ctx.note.mymouseisdown = 0;
      }
    }
    function board_rotate_object(myrot,o,ctx,canvas){
      if(o.hit1){
        ctx.save();
        ctx.setTransform(...o.tr);
        ctx.translate(o.x1,o.y1);
        ctx.rotate(myrot/180*Math.PI);
        ctx.translate(-o.x1,-o.y1);
        o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
        ctx.restore();
      }else if(o.hit2){
        ctx.save();
        ctx.setTransform(...o.tr);
        ctx.translate(o.x2,o.y2);
        ctx.rotate(myrot/180*Math.PI);
        ctx.translate(-o.x2,-o.y2);
        o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
        ctx.restore();
      }else if(o.hit3){
        ctx.save();
        ctx.setTransform(...o.tr);
        ctx.translate(o.x3,o.y3);
        ctx.rotate(myrot/180*Math.PI);
        ctx.translate(-o.x3,-o.y3);
        o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
        ctx.restore();
      }else if(o.hit4){
        ctx.save();
        ctx.setTransform(...o.tr);
        ctx.translate(o.x4,o.y4);
        ctx.rotate(myrot/180*Math.PI);
        ctx.translate(-o.x4,-o.y4);
        o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
        ctx.restore();
      }
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function erase_between(myposx0,myposy0,myposx,myposy,lw,ctx){
      let dx = myposx-myposx0;
      let dy = myposy-myposy0;
      let Dx = Math.abs(dx);
      let Dy = Math.abs(dy);
      if(Dx==0&&Dy==0){
        var n = 1;
      }else if((Dx)>(Dy)){
        var n = Math.ceil(Dx/lw);
      }else{
        var n = Math.ceil(Dy/lw);
      }
      n = Math.max(1,n);
      dx /= n;
      dy /= n;
      for(i=0; i <= n; ++i){
        let x = myposx0 + dx*i;
        let y = myposy0 + dy*i;
        ctx.clearRect(x-(lw/2),y-(lw/2),lw,lw);
      }
    }
    function pencil_between(myposx0,myposy0,myposx,myposy,lw,ctx){
      lw = Math.max(1,lw);
      let dx = myposx-myposx0;
      let dy = myposy-myposy0;
      let Dx = Math.abs(dx);
      let Dy = Math.abs(dy);
      if(Dx==0&&Dy==0){
        var n = 1;
      }else if((Dx)>(Dy)){
        var n = Math.ceil(Dx/lw);
      }else{
        var n = Math.ceil(Dy/lw);
      }
      n = Math.max(1,n);
      dx /= n;
      dy /= n;
      for(i=0; i <= n; ++i){
        let x = myposx0 + dx*i;
        let y = myposy0 + dy*i;
        ctx.fillRect(x-(lw/2),y-(lw/2),lw,lw);
      }
    }
    function smudge_fill(x,y,stacksize,n,sx,sy,dir,mysmear,ctx,canvas){
      x = Math.floor(x);
      y = Math.floor(y);
      let limit = 0;
      if(stacksize<500 && n < 10000){
        var count = smudgeRect(x,y,1,1,mysmear,limit,ctx,canvas);
        n += count;
        if(count){
          let dy = y-sy;
          let dx = x-sx;
          if(dy >= 0 && dx >= 0){
            if(Math.abs(dy) > Math.abs(dx)){
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
            }else{
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
            }
          }else if(dy >= 0){
            if(Math.abs(dy) > Math.abs(dx)){
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
            }else{
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
            }
          }else if(dx >= 0){
            if(Math.abs(dy) > Math.abs(dx)){
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
            }else{
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
            }
          }else{ 
            if(Math.abs(dy) > Math.abs(dx)){
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
            }else{
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx,canvas);
            }
          }
        }
      } 
      return n;
    }
    function smudge_between(myposx0,myposy0,myposx,myposy,lw,mysmear,ctx,canvas){
      let dx = myposx-myposx0;
      let dy = myposy-myposy0;
      let Dx = Math.abs(dx);
      let Dy = Math.abs(dy);
      if(Dx==0&&Dy==0){
        var n = 1;
      }else if((Dx)>(Dy)){
        var n = Math.ceil(Dx/lw);
      }else{
        var n = Math.ceil(Dy/lw);
      }
      n = Math.max(1,n);
      dx /= n;
      dy /= n;
      for(i=0; i <= n; ++i){
        let x = myposx0 + dx*i;
        let y = myposy0 + dy*i;
        let limit = 127;
        smudgeRect(x-(lw/2),y-(lw/2),lw,lw,mysmear,limit,ctx,canvas);
      }
    }
    function smudgeRect(x,y,w,h,mysmear,limit,ctx,canvas){
      ///RETURN the total number of pixels colored
      var count = 0;
      var width = canvas.getAttribute('width');
      var height = canvas.getAttribute('height');
      if(x >= 0 && y >= 0 && x < width && y < height){
        var idata = ctx.getImageData(x,y,w,h);
        const cutoff = 127;
        for(let i=0; i < idata.data.length; i+=4){
          if(idata.data[i+3]==0){
            var rand1 = 0.5+Math.random()*0.5;
            var rand2 = 0.5+Math.random()*0.5;
            idata.data[i+0] = rand1*mysmear[0];
            idata.data[i+1] = rand1*mysmear[1];
            idata.data[i+2] = rand1*mysmear[2];
            idata.data[i+3] = rand2*cutoff*0.5;
            count++;
          }
        }
        ctx.putImageData(idata,x,y);
      }
      return count;
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_draw_pencil(ctx,canvas,first){
      let myposx1 = ctx.note.myposx1;
      let myposy1 = ctx.note.myposy1;
      let myposx2 = ctx.note.myposx2;
      let myposy2 = ctx.note.myposy2;
      let mystroke= ctx.note.all_stroke;
      let mycolor = ctx.note.all_color;
      let mysmear = allrgbs[mycolor];
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ///PENCIL
      var lw = mystroke*sx;
      lw = Math.max(lw,1);
      //lw = Math.round(lw);//this is to work around the bug of Edge V93 on mac (number less than 1 will cause an error of "width is 0")
      ctx.lineWidth = lw;
      ctx.strokeStyle = mycolor;
      //pencil_between(myposx1,myposy1,myposx2,myposy2,lw,ctx);
      ctx.beginPath();
      ctx.moveTo(myposx1,myposy1);
      ctx.lineTo(myposx2,myposy2);
      ctx.stroke();
    }
    function board_draw_smudge_fill(x1,y1,sx,sy,ctx,canvas){
      let mystroke= ctx.note.all_stroke;
      let mycolor = ctx.note.all_color;
      let mysmear = allrgbs[mycolor];
      let n = smudge_fill(x1,y1,0,0,sx,sy,0,mysmear,ctx,canvas);
    }
    function board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas){
      let mystroke= ctx.note.all_stroke;
      let mycolor = ctx.note.all_color;
      let mysmear = allrgbs[mycolor];
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      var lw = 3*mystroke*sx;
      lw = Math.max(lw,1);
      //var lw = Math.round(lw);//this is to work around the bug of Edge V93 on mac (number less than 1 will cause an error of "width is 0")
      smudge_between(x1,y1,x2,y2,lw,mysmear,ctx,canvas);
    }
    function board_draw_clear(ctx,canvas,first){
      ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
    }
    function board_draw_eraser(ctx,canvas,first){
      let myposx1 = ctx.note.myposx1;
      let myposy1 = ctx.note.myposy1;
      let myposx2 = ctx.note.myposx2;
      let myposy2 = ctx.note.myposy2;
      let mystroke= ctx.note.all_stroke;
      let mycolor = ctx.note.all_color;
      let mysmear = allrgbs[mycolor];
      let myop    = ctx.note.all_op;
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ///ERASER
      if(mystroke==0){
        ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
      }else{
        mystroke = Math.max(1,mystroke);
        var lw = 3*mystroke*sx;
        var lw = Math.round(lw);//this is to work around the bug of Edge V93 on mac (number less than 1 will cause an error of "width is 0")
        if(first){
          ctx.clearRect(myposx2-(lw/2),myposy2-(lw/2),lw,lw);
        }else{
          erase_between(myposx1,myposy1,myposx2,myposy2,lw,ctx);
        }
      }
    }
    function board_calc_sx_and_sy(canvas){
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      return [sx,sy];
    }
    function board_reset_basis(ctx){
      ctx.note.mybasis.x = 0;
      ctx.note.mybasis.y = 0;
      ctx.note.mybasis.w = 0;
      ctx.note.mybasis.h = 0;
      ctx.note.mybasis.dx = 0;
      ctx.note.mybasis.dy = 0;
      ctx.note.mybasis.dw = 0;
      ctx.note.mybasis.dh = 0;
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function note_draw_hilite(ctx,canvas){
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.globalCompositeOperation = 'xor';
      ctx.fillRect(ctx.note.mybasis.x+ctx.note.mybasis.dx,
                   ctx.note.mybasis.y+ctx.note.mybasis.dy, 
                   ctx.note.mybasis.w+ctx.note.mybasis.dw,
                   ctx.note.mybasis.h+ctx.note.mybasis.dh);
      ctx.restore();
    }
    function note_start(ctx,canvas){
      ///ALT-KEY always erase
      if(ctx.note.altKey){
        if(ctx.note.shiftKey){
          ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
        }else{
          board_draw_eraser(ctx,canvas,true);
        }
        return;
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='circle'){
        //START
        board_reset_basis(ctx);
        let mystroke = ctx.note.all_stroke;
        let mycolor  = ctx.note.all_color;
        let x = ctx.note.myposx0;
        let y = ctx.note.myposy0;
        ctx.note.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='rect'){
        board_reset_basis(ctx);
        let mystroke = ctx.note.all_stroke;
        let mycolor  = ctx.note.all_color;
        let x = ctx.note.myposx0;
        let y = ctx.note.myposy0;
        ctx.note.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='tri'){
        board_reset_basis(ctx);
        let mystroke = ctx.note.all_stroke;
        let mycolor  = ctx.note.all_color;
        let x = ctx.note.myposx0;
        let y = ctx.note.myposy0;
        ctx.note.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='line'){
        board_reset_basis(ctx);
        let mystroke = ctx.note.all_stroke;
        let mycolor  = ctx.note.all_color;
        let x = ctx.note.myposx0;
        let y = ctx.note.myposy0;
        ctx.note.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
      }
      if(ctx.note.all_op=='smudge'){
        //START
        board_reset_basis(ctx);
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
        let x1 = ctx.note.myposx1;
        let y1 = ctx.note.myposy1;
        let x2 = ctx.note.myposx2;
        let y2 = ctx.note.myposy2;
        if(ctx.note.all_stroke==0){
          board_draw_smudge_fill(x1,y1,x1,y1,ctx,canvas);
        }else{
          board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas);
        }
      }
      if(ctx.note.all_op=='pencil'){
        //START
        board_reset_basis(ctx);
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
        if(ctx.note.shiftKey && ctx.note.altKey){
          ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
        }else if(ctx.note.altKey){
          board_draw_eraser(ctx,canvas,true);
        }else{
          board_draw_pencil(ctx,canvas,true);
        }
      }
      if(ctx.note.all_op=='select'){
        ///START
        if( (ctx.note.myposx0 > ctx.note.mybasis.x) &&
            (ctx.note.myposx0 < ctx.note.mybasis.x+ctx.note.mybasis.w+ctx.note.mybasis.dw) &&
            (ctx.note.myposy0 > ctx.note.mybasis.y) &&
            (ctx.note.myposy0 < ctx.note.mybasis.y+ctx.note.mybasis.h+ctx.note.mybasis.dh) ){
          ///MOVE/COPY/RESIZE
          ctx.note.mybasis.s = ctx.note.myface;
          ctx.note.mybasis.a = ctx.note.all_arg;      
        }else{
          ///HILITE-ONLY
          board_reset_basis(ctx);
          ctx.note.mybasis.s = ctx.note.myface;
          ctx.note.mybasis.a = null;
          ctx.note.mybasis.x  = ctx.note.myposx0;
          ctx.note.mybasis.y  = ctx.note.myposy0;
          ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
          ctx.putImageData(ctx.note.myface, 0,0);
          note_draw_hilite(ctx,canvas);
        }
      }
      //SAVE
      all_canvas = canvas;
    }
    function note_drag(ctx,canvas){
      ///ALT-KEY always erase
      if(ctx.note.altKey){
        board_draw_eraser(ctx,canvas,false);
        return;
      }
      if (ctx.note.all_op=='shape' && ctx.note.all_arg=='circle' && ctx.note.myfig){
        //DRAG  
        let myposx0 = ctx.note.myposx0;
        let myposy0 = ctx.note.myposy0;
        let myposx2 = ctx.note.myposx2;
        let myposy2 = ctx.note.myposy2;
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.note.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.note.myfig.mycolor;   
        ///CIRCLE
        let s = ctx.note.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        let cx,cy,rx,ry;
        if(ctx.note.altKey){
          cx = myposx0;
          cy = myposy0;
          rx = Math.abs(myposx0 - myposx2);
          ry = Math.abs(myposy0 - myposy2);
          if(ctx.note.shiftKey){
            let r = Math.max(rx,ry);
            rx = r;
            ry = r;
          }
        }else{
          cx = (myposx0 + myposx2)/2;
          cy = (myposy0 + myposy2)/2;
          rx = Math.abs((myposx0 - myposx2)/2);
          ry = Math.abs((myposy0 - myposy2)/2);
          if(ctx.note.shiftKey){
            let r = Math.max(rx,ry);
            rx = r;
            ry = r;
            if(myposx2 > myposx0) cx = myposx0 + rx;
            else if(myposx2 < myposx0) cx = myposx0 - rx;
            if(myposy2 > myposy0) cy = myposy0 + ry;
            else if(myposy2 < myposy0) cy = myposy0 - ry;
          }
        }
        if(w || h){
          ctx.beginPath();
          ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
          ctx.note.myfig.x = cx;
          ctx.note.myfig.y = cy;
          ctx.note.myfig.w = rx;
          ctx.note.myfig.h = ry;
          ctx.stroke();
        }
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='rect' && ctx.note.myfig){
        //DRAG  
        let myposx0 = ctx.note.myposx0;
        let myposy0 = ctx.note.myposy0;
        let myposx2 = ctx.note.myposx2;
        let myposy2 = ctx.note.myposy2;
        let x = myposx0;
        let y = myposy0; 
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.note.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.note.myfig.mycolor;   
        ///RECT  
        let s = ctx.note.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        if(ctx.note.shiftKey){
          let d = Math.min(w,h);
          w = d;
          h = d;
        }
        if(w || h){
          ctx.strokeRect(x,y, w,h);
          ctx.note.myfig.x = x;
          ctx.note.myfig.y = y;
          ctx.note.myfig.w = w; 
          ctx.note.myfig.h = h; 
        }
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='tri' && ctx.note.myfig){
        //DRAG  
        let myposx0 = ctx.note.myposx0;
        let myposy0 = ctx.note.myposy0;
        let myposx2 = ctx.note.myposx2;
        let myposy2 = ctx.note.myposy2;
        let x = myposx0;
        let y = myposy0; 
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.note.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.note.myfig.mycolor;   
        ///TRI   
        let s = ctx.note.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        let x1 = w/2;
        let y1 = 0; 
        let x2 = 0;
        let y2 = h;
        let x3 = w;
        let y3 = h;
        if(w || h){
          ctx.beginPath();
          ctx.moveTo(x+x1,y+y1);
          ctx.lineTo(x+x2,y+y2);
          ctx.lineTo(x+x3,y+y3);
          ctx.closePath();
          ctx.stroke();
          ctx.note.myfig.w = w;
          ctx.note.myfig.h = h;
        }
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='line' && ctx.note.myfig){
        //DRAG  
        let x1 = ctx.note.myposx0;
        let y1 = ctx.note.myposy0;
        let x2 = ctx.note.myposx2;
        let y2 = ctx.note.myposy2;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.note.myfig.mystroke*sx;
        ctx.strokeStyle = ctx.note.myfig.mycolor;
        ///LINE  
        let s = ctx.note.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        let ddx = Math.abs(x2-x1);
        let ddy = Math.abs(y2-y1);
        let dd = Math.sqrt(ddx*ddx + ddy*ddy);
        if(ctx.note.shiftKey && ddx > ddy){
          x2 = ctx.note.myposx2;
          y2 = ctx.note.myposy0;
        }else if(ctx.note.shiftKey && ddy > ddx){
          x2 = ctx.note.myposx0;
          y2 = ctx.note.myposy2;
        }
        let w = x2-x1;
        let h = y2-y1;
        if(w || h){
          ctx.beginPath();
          ctx.moveTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.stroke();
          ctx.note.myfig.x = x1;
          ctx.note.myfig.y = y1; 
          ctx.note.myfig.w = w;
          ctx.note.myfig.h = h; 
        }
      }
      if(ctx.note.all_op=='smudge'){
        //DRAG  
        let x1 = ctx.note.myposx1;
        let y1 = ctx.note.myposy1;
        let x2 = ctx.note.myposx2;
        let y2 = ctx.note.myposy2;
        board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas,false);
      }
      if(ctx.note.all_op=='pencil'){
        //DRAG  
        if(ctx.note.altKey){
          board_draw_eraser(ctx,canvas,false);
        }else{
          board_draw_pencil(ctx,canvas,false);
        }
      }
      if(ctx.note.all_op=='select'){
        //DRAG  
        if(ctx.note.mybasis.a){
          ///MOVE/COPY/RESIZE
          let dx = ctx.note.myposx2 - ctx.note.myposx0;
          let dy = ctx.note.myposy2 - ctx.note.myposy0;
          ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
          ctx.putImageData(ctx.note.myface, 0,0);
          let p1 = ctx.getImageData(ctx.note.mybasis.x,ctx.note.mybasis.y, ctx.note.mybasis.w,ctx.note.mybasis.h);
          if(ctx.note.mybasis.a=='move'){
            if(ctx.note.shiftKey){
              if(Math.abs(dx)<Math.abs(dy)){
                dx = 0;
              }else if(Math.abs(dy)<Math.abs(dx)){
                dy = 0;
              }
            }
            ctx.clearRect(ctx.note.mybasis.x,ctx.note.mybasis.y, ctx.note.mybasis.w,ctx.note.mybasis.h);
            ctx.putImageData(p1, ctx.note.mybasis.x+dx,ctx.note.mybasis.y+dy);
            ctx.note.mybasis.s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
            ///draw hilite
            ctx.note.mybasis.dx = dx;
            ctx.note.mybasis.dy = dy;
            note_draw_hilite(ctx,canvas);
          }else if(ctx.note.mybasis.a=='copy'){
            if(ctx.note.shiftKey){
              if(Math.abs(dx)<Math.abs(dy)){
                dx = 0;
              }else if(Math.abs(dy)<Math.abs(dx)){
                dy = 0;
              }
            }
            ctx.putImageData(p1, ctx.note.mybasis.x+dx,ctx.note.mybasis.y+dy);
            ctx.note.mybasis.s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
            ///draw hilite
            ctx.note.mybasis.dx = dx;
            ctx.note.mybasis.dy = dy;
            note_draw_hilite(ctx,canvas);
          }else if(ctx.note.mybasis.a=='resize'){
            let w = p1.width;
            let h = p1.height;
            let iw = w+dx;
            let ih = h+dy;
            if(ctx.note.shiftKey){
              iw = (ih/h)*w;
              iw = Math.round(iw);
            }
            let p2 = resizeImageData(p1, iw, ih, ctx);
            ctx.clearRect(ctx.note.mybasis.x,ctx.note.mybasis.y, ctx.note.mybasis.w,ctx.note.mybasis.h);
            ctx.putImageData(p2, ctx.note.mybasis.x,ctx.note.mybasis.y);
            ctx.note.mybasis.s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
            ///draw hilite
            ctx.note.mybasis.dw = (iw-w);
            ctx.note.mybasis.dh = (ih-h);
            note_draw_hilite(ctx,canvas);
          }
        }else{
          ///HILITE-ONLY
          ctx.note.mybasis.w = ctx.note.myposx2 - ctx.note.myposx0;
          ctx.note.mybasis.h = ctx.note.myposy2 - ctx.note.myposy0;
          ctx.putImageData(ctx.note.myface, 0,0);
          note_draw_hilite(ctx,canvas);
        }
      }
      //SAVE
      all_canvas = canvas;
    }
    function note_end(ctx,canvas){
      if(ctx.note.all_op=='shape'){
        //BOARD_END   
        let s        = ctx.note.myface;
        let myfig    = ctx.note.myfig;
        let myop     = ctx.note.all_op;
        let myarg    = ctx.note.all_arg;
        if(s && myfig && myop && myarg && (myfig.w || myfig.h)){
          ///normalize ctx.note.mybasis
          ctx.note.mybasis.x += ctx.note.mybasis.dx;
          ctx.note.mybasis.y += ctx.note.mybasis.dy;
          ctx.note.mybasis.dx = 0;
          ctx.note.mybasis.dy = 0;
          ctx.note.mybasis.w += ctx.note.mybasis.dw;
          ctx.note.mybasis.h += ctx.note.mybasis.dh;
          ctx.note.mybasis.dw = 0;
          ctx.note.mybasis.dh = 0;
          let mybasis  = {...ctx.note.mybasis};
          ///save 
          ctx.note.myundo.push({s,mybasis,myop,myarg,myfig});
          ctx.note.myredo = [];
          ctx.note.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        }
      } 
      else if(ctx.note.all_op=='pencil' || 
              ctx.note.all_op=='smudge' ){
        let s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ///normalize ctx.note.mybasis
        ctx.note.mybasis.x += ctx.note.mybasis.dx;
        ctx.note.mybasis.y += ctx.note.mybasis.dy;
        ctx.note.mybasis.dx = 0;
        ctx.note.mybasis.dy = 0;
        ctx.note.mybasis.w += ctx.note.mybasis.dw;
        ctx.note.mybasis.h += ctx.note.mybasis.dh;
        ctx.note.mybasis.dw = 0;
        ctx.note.mybasis.dh = 0;
        let mybasis  = {...ctx.note.mybasis};
        let myfig  = {...ctx.note.myfig};
        let myop = ctx.note.all_op;
        let myarg = ctx.note.all_arg;
        ///save 
        ctx.note.myundo.push({s,mybasis,myop,myarg,myfig});
        ctx.note.myredo = [];
        ctx.note.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
      }
      else if(ctx.note.all_op=='select'){
        let s        = ctx.note.mybasis.s;      
        if(s && ctx.note.mybasis.w && ctx.note.mybasis.h){
          ///normalize ctx.note.mybasis
          ctx.note.mybasis.x += ctx.note.mybasis.dx;
          ctx.note.mybasis.y += ctx.note.mybasis.dy;
          ctx.note.mybasis.dx = 0;
          ctx.note.mybasis.dy = 0;
          ctx.note.mybasis.w += ctx.note.mybasis.dw;
          ctx.note.mybasis.h += ctx.note.mybasis.dh;
          ctx.note.mybasis.dw = 0;
          ctx.note.mybasis.dh = 0;
          ctx.note.mybasis.s = null;
          let mybasis  = {...ctx.note.mybasis};
          let myfig = {...ctx.note.myfig};
          let myop = ctx.note.all_op;      
          let myarg = ctx.note.all_arg;
          ctx.note.myundo.push({s,mybasis,myop,myarg,myfig});
          ctx.note.myredo = [];
          ctx.note.myface = s;
        }
      }
      ///SAVE CANVAS
      all_canvas = canvas;
    }
    function note_redraw(o,ctx,canvas){
      if(o==null){
        let n = ctx.note.myundo.length;
        o = ctx.note.myundo[n-1];  
      }
      ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
      ctx.resetTransform();
      if(o.s){
        ctx.putImageData(o.s,0,0);
        ctx.note.myface = o.s;
      }
      if(o.mybasis){
        ///COPY-SELECTION
        ctx.note.mybasis = {...o.mybasis};
      }
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      if(o.myop=='shape' && o.myarg=='circle'){
        let myfig = o.myfig;
        ctx.lineWidth = myfig.mystroke*sx;
        ctx.strokeStyle = myfig.mycolor;
        if(1){
          ctx.beginPath();
          let cx = myfig.x;
          let cy = myfig.y;
          let rx = Math.abs(myfig.w);//this could be negative, and it is legal for a rect
          let ry = Math.abs(myfig.h);//this could be negative, and it is legal for a rect
          ctx.ellipse(cx,cy,rx,ry,myfig.rotate/180*Math.PI,0,Math.PI*2);
          ctx.stroke();
        }
        ctx.note.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
      } 
      if(o.myop=='shape' && o.myarg=='rect'){
        let myfig = o.myfig;
        ctx.lineWidth = myfig.mystroke*sx;
        ctx.strokeStyle = myfig.mycolor;
        if(1){
          ///TRANSFORM
          ctx.save();
          ctx.translate(myfig.x,myfig.y);
          ctx.rotate(myfig.rotate/180*Math.PI);
          ctx.beginPath();
          ctx.moveTo(0,                  0);
          ctx.lineTo(myfig.w,            myfig.skewY);
          ctx.lineTo(myfig.w+myfig.skewX,myfig.h+myfig.skewY);
          ctx.lineTo(myfig.skewX,        myfig.h);
          ctx.closePath();
          ctx.translate(-myfig.x,-myfig.y);
          ctx.stroke();
          ctx.restore();
        }
        ctx.note.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        console.log('redraw shape rect');
      } 
      if(o.myop=='shape' && o.myarg=='tri'){
        //REDRAW
        let myfig = o.myfig;
        ctx.lineWidth = myfig.mystroke*sx;
        ctx.strokeStyle = myfig.mycolor;
        if(1){
          let w = myfig.w;
          let h = myfig.h;
          let x1 = w/2;
          let y1 = 0; 
          let x2 = 0;
          let y2 = h;
          let x3 = w;
          let y3 = h;
          x2 += myfig.skewX;
          x3 += myfig.skewX;
          y3 += myfig.skewY;
          ///TRANSFORM
          ctx.save();
          ctx.translate(myfig.x,myfig.y);
          ctx.translate(myfig.w/2,0);
          ctx.rotate(myfig.rotate/180*Math.PI);
          ctx.translate(-myfig.w/2,0);
          ctx.beginPath();
          ctx.moveTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.lineTo(x3,y3);
          ctx.closePath();
          ctx.translate(-myfig.x,-myfig.y);
          ctx.stroke();
          ctx.restore();
        }
        ctx.note.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        console.log('redraw shape tri');
      } 
      if(o.myop=='shape' && o.myarg=='line'){
        //REDRAW
        let myfig = o.myfig;
        ctx.lineWidth = myfig.mystroke*sx;
        ctx.strokeStyle = myfig.mycolor;
        if(1){
          ///TRANSFORM
          ctx.save();
          ctx.beginPath();
          ctx.translate(myfig.x,myfig.y);
          ctx.rotate(myfig.rotate/180*Math.PI);
          ctx.moveTo(0,0);
          ctx.lineTo(myfig.w,myfig.h);
          ctx.translate(-myfig.x,-myfig.y);
          ctx.stroke();
          ctx.restore();
        }
        ctx.note.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        console.log('redraw shape line');
      } 
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function resizeImageData(odata,iwidth,iheight,ctx) {
      var owidth = odata.width;
      var oheight = odata.height;
      var idata = ctx.createImageData(iwidth, iheight);
      for(var row = 0; row < iheight; row++) {
        for(var col = 0; col < iwidth; col++) {
          let i = row*iwidth + col;
          let ROW = Math.floor(row*(oheight/iheight));
          let COL = Math.floor(col*(owidth/iwidth));
          let I = ROW*owidth + COL;
          idata.data[i*4 + 0] = odata.data[I*4 + 0];
          idata.data[i*4 + 1] = odata.data[I*4 + 1];
          idata.data[i*4 + 2] = odata.data[I*4 + 2];
          idata.data[i*4 + 3] = odata.data[I*4 + 3];
        }
      }
      return idata;
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function body_keypress(){
      var body = event.target;
      if(body.tagName=='CANVAS'){
        var canvas = event.target;
        var ctx = canvas.getContext("2d");
        var keycode = event.code;
        var shiftKey = event.shiftKey;
        all_canvas = canvas;
        board_handle_keydown(shiftKey,keycode,ctx,canvas);
      }else if(all_canvas) {
        var shiftKey = event.shiftKey;
        var keycode = event.code;
        canvas = all_canvas;
        ctx = canvas.getContext("2d");
        board_handle_keydown(shiftKey,keycode,ctx,canvas);
      }
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function drawHead(ctx,x0,y0,x1,y1,x2,y2,style) {
      'use strict';
      if(typeof(x0)=='string') x0=parseInt(x0);
      if(typeof(y0)=='string') y0=parseInt(y0);
      if(typeof(x1)=='string') x1=parseInt(x1);
      if(typeof(y1)=='string') y1=parseInt(y1);
      if(typeof(x2)=='string') x2=parseInt(x2);
      if(typeof(y2)=='string') y2=parseInt(y2);
      var radius=3;
      var twoPI=2*Math.PI;

      // all cases do this.
      ctx.save();
      ctx.lineWidth='1';
      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(x1,y1);
      ctx.lineTo(x2,y2);
      switch(style){
        case 0:
          // curved filled, add the bottom as an arcTo curve and fill
          var backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
          ctx.arcTo(x1,y1,x0,y0,.55*backdist);
          ctx.closePath();
          ctx.fill();
          break;
        case 1:
          // straight filled, add the bottom as a line and fill.
          ctx.beginPath();
          ctx.moveTo(x0,y0);
          ctx.lineTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.lineTo(x0,y0);
          ctx.closePath();
          ctx.fill();
          break;
        case 2:
          // unfilled head, just stroke.
          ctx.closePath();
          ctx.stroke();
          break;
        case 3:
          //filled head, add the bottom as a quadraticCurveTo curve and fill
          var cpx=(x0+x1+x2)/3;
          var cpy=(y0+y1+y2)/3;
          ctx.quadraticCurveTo(cpx,cpy,x0,y0);
          ctx.closePath();
          ctx.fill();
          break;
        case 4:
          //filled head, add the bottom as a bezierCurveTo curve and fill
          var cp1x, cp1y, cp2x, cp2y,backdist;
          var shiftamt=5;
          if(x2==x0){
            // Avoid a divide by zero if x2==x0
            backdist=y2-y0;
            cp1x=(x1+x0)/2;
            cp2x=(x1+x0)/2;
            cp1y=y1+backdist/shiftamt;
            cp2y=y1-backdist/shiftamt;
          }else{
            backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
            var xback=(x0+x2)/2;
            var yback=(y0+y2)/2;
            var xmid=(xback+x1)/2;
            var ymid=(yback+y1)/2;

            var m=(y2-y0)/(x2-x0);
            var dx=(backdist/(2*Math.sqrt(m*m+1)))/shiftamt;
            var dy=m*dx;
            cp1x=xmid-dx;
            cp1y=ymid-dy;
            cp2x=xmid+dx;
            cp2y=ymid+dy;
          }

          ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x0,y0);
          ctx.closePath();
          ctx.fill();
          break;
      }
      ctx.restore();
    }
    function drawArrow(ctx,x1,y1,x2,y2,style,which,angle,d) {
      'use strict';
      // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
      // would happen instead of addition
      if(typeof(x1)=='string') x1=parseInt(x1);
      if(typeof(y1)=='string') y1=parseInt(y1);
      if(typeof(x2)=='string') x2=parseInt(x2);
      if(typeof(y2)=='string') y2=parseInt(y2);
      style=typeof(style)!='undefined'? style:3;
      which=typeof(which)!='undefined'? which:1; // end point gets arrow
      angle=typeof(angle)!='undefined'? angle:Math.PI/8;
      d    =typeof(d)    !='undefined'? d    :6;
      // default to using drawHead to draw the head, but if the style
      // argument is a function, use it instead
      //var toDrawHead=typeof(style)!='function'?drawHead:style;
      var toDrawHead=drawHead;

      // For ends with arrow we actually want to stop before we get to the arrow
      // so that wide lines won't put a flat end on the arrow.
      //
      var dist=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
      var ratio=(dist-d/3)/dist;
      var tox, toy,fromx,fromy;
      if(which&1){
        tox=Math.round(x1+(x2-x1)*ratio);
        toy=Math.round(y1+(y2-y1)*ratio);
      }else{
        tox=x2;
        toy=y2;
      }
      if(which&2){
        fromx=x1+(x2-x1)*(1-ratio);
        fromy=y1+(y2-y1)*(1-ratio);
      }else{
        fromx=x1;
        fromy=y1;
      }

      // Draw the shaft of the arrow
      ctx.beginPath();
      ctx.moveTo(fromx,fromy);
      ctx.lineTo(tox,toy);
      ctx.stroke();

      // calculate the angle of the line
      var lineangle=Math.atan2(y2-y1,x2-x1);
      // h is the line length of a side of the arrow head
      var h=Math.abs(d/Math.cos(angle));

      if(which&1){  // handle far end arrow head
        var angle1=lineangle+Math.PI+angle;
        var topx=x2+Math.cos(angle1)*h;
        var topy=y2+Math.sin(angle1)*h;
        var angle2=lineangle+Math.PI-angle;
        var botx=x2+Math.cos(angle2)*h;
        var boty=y2+Math.sin(angle2)*h;
        drawHead(ctx,topx,topy,x2,y2,botx,boty,style);
      }
      if(which&2){ // handle near end arrow head
        var angle1=lineangle+angle;
        var topx=x1+Math.cos(angle1)*h;
        var topy=y1+Math.sin(angle1)*h;
        var angle2=lineangle-angle;
        var botx=x1+Math.cos(angle2)*h;
        var boty=y1+Math.sin(angle2)*h;
        drawHead(ctx,topx,topy,x1,y1,botx,boty,style);
      }
    }
    function getCursorPosition(evt) {
      var canvas = evt.target();
      var x;
      var y;
      if (evt.pageX != undefined && evt.pageY != undefined) {
        x = evt.pageX;
        y = evt.pageY;
      }
      else {
        x = evt.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
        y = evt.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
      }
      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;
      return {x,y};
    }
    function getDist(x,x1,y,y1){ 
      return Math.sqrt((x-x1)*(x-x1) + (y-y1)*(y-y1));
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function cplane_start(ctx,canvas){
    }
    function cplane_drag(ctx,canvas){
      var diff_x = ctx.cplane.myposx2 - ctx.cplane.origin_x;
      var diff_y = ctx.cplane.myposy2 - ctx.cplane.origin_y;
      if(1){
        //snap to grid within 2px
        var v = diff_y % ctx.cplane.grid;
        if(Math.abs(v) <= 2) {
          diff_y = Math.round(diff_y / ctx.cplane.grid) * ctx.cplane.grid;
        }
      }
      if(1){
        //snap to grid within 2px
        var v = diff_x % ctx.cplane.grid;
        if(Math.abs(v) <= 2) {
          diff_x = Math.round(diff_x / ctx.cplane.grid) * ctx.cplane.grid;
        }
      }
      if(ctx.cplane.action=='multiply'){
        ctx.cplane.rotate_ang = Math.atan2(diff_y, diff_x);
        ctx.cplane.scale_factor = Math.fround(Math.sqrt(diff_y*diff_y + diff_x*diff_x))/ctx.cplane.grid;
      }else if(ctx.cplane.action=='add'){
        ctx.cplane.translate_x = diff_x / ctx.cplane.grid;
        ctx.cplane.translate_y = diff_y / ctx.cplane.grid;
      }
      cplane_redraw(ctx,canvas);
    }
    function cplane_end(ctx,canvas){
      cplane_redraw(ctx,canvas);
    }
    function cplane_reset(ctx,canvas){
      ctx.cplane.scale_factor = 1;
      ctx.cplane.rotate_ang = 0;
      ctx.cplane.translate_x = 0;
      ctx.cplane.translate_y = 0;
      cplane_redraw(ctx,canvas);
    }
    function cplane_redraw(ctx,canvas){
      ctx.resetTransform();
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#555588';
      ctx.translate(+ctx.cplane.origin_x,+ctx.cplane.origin_y);
      var w = canvas.width;
      var h = canvas.height;
      var grid = ctx.cplane.grid;
      ///////////////////////////////////////////////
      ///draw gray grids
      ///////////////////////////////////////////////
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (var x=-50; x <= 50; x++) {
        ctx.moveTo(x*grid,0);
        ctx.lineTo(x*grid,-50*grid);   
        ctx.moveTo(x*grid,0);
        ctx.lineTo(x*grid,+50*grid);   
      }
      for (var y=-50; y <= 50; y++) {
        ctx.moveTo(0,       y*grid);
        ctx.lineTo(-50*grid,y*grid);
        ctx.moveTo(0,       y*grid);
        ctx.lineTo(+50*grid,y*grid);
      }
      ctx.stroke();
      var fs = Math.min(ctx.cplane.grid,8);
      var fs = ""+fs+"px";
      ctx.font = fs;
      if(1){
        ///draw horizontal labels
        for(var x=-50; x < +50; x++) {
          ctx.fillText(""+x,x*grid,0);
        }
      }
      if(1){
        ///draw vertical labels
        for(var y=-50; y < +50; y++) {
          if(y==0) continue;
          ctx.fillText(""+y+"\u{1D456}",0,-y*grid);
        }
      }
      ///////////////////////////////////////////////
      ///draw blue grids
      ///////////////////////////////////////////////
      ctx.rotate(ctx.cplane.rotate_ang);
      ctx.scale(ctx.cplane.scale_factor,ctx.cplane.scale_factor);
      ctx.translate(ctx.cplane.translate_x*ctx.cplane.grid,ctx.cplane.translate_y*ctx.cplane.grid);
      ctx.beginPath();
      ctx.strokeStyle = '#4545ff';
      ctx.lineWidth = 0.5/ctx.cplane.scale_factor;//reduce the line size
      for (var x=-50; x <= 50; x++) {
        ctx.moveTo(x*grid,0);
        ctx.lineTo(x*grid,-50*grid);   
        ctx.moveTo(x*grid,0);
        ctx.lineTo(x*grid,+50*grid);   
      }
      for (var y=-50; y <= 50; y++) {
        ctx.moveTo(0,       y*grid);
        ctx.lineTo(-50*grid,y*grid);
        ctx.moveTo(0,       y*grid);
        ctx.lineTo(+50*grid,y*grid);
      }
      ctx.stroke();
      if(1){
        /// draw handle
        ctx.save();
        if(ctx.cplane.action=='add'){
          ctx.beginPath();
          var r = 4/ctx.cplane.scale_factor;//reduce the dot size if necessary
          ctx.arc(0,0,r,0,Math.PI*2);
          ctx.fill();
        }else if(ctx.cplane.action=='multiply'){
          ctx.beginPath();
          var r = 4/ctx.cplane.scale_factor;//reduce the dot size if necessary
          ctx.arc(ctx.cplane.grid,0,r,0,Math.PI*2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.lineWidth = 1/ctx.cplane.scale_factor;
      ctx.strokeStyle = 'red';
      ctx.fillStyle   = 'red';
      var val_real = parseFloat(ctx.cplane.val_real);
      var val_imag = parseFloat(ctx.cplane.val_imag);
      if(1){
        let arrow_x = Math.round(val_real)*ctx.cplane.grid ;
        let arrow_y = -Math.round(val_imag)*ctx.cplane.grid ;
        arrow_x = Math.round(val_real)*ctx.cplane.grid ;
        arrow_y = -Math.round(val_imag)*ctx.cplane.grid ;
        if(Number.isFinite(arrow_x)&&
           Number.isFinite(arrow_y)){
           if(arrow_x == 0 && arrow_y == 0) {
            /// if both zero then dont draw
           } else {
            drawArrow(ctx,0,0,arrow_x,arrow_y);
           }
        }
      }
      console.log(ctx.cplane.origin_x,ctx.cplane.origin_y,
                  ctx.cplane.translate_x,
                  ctx.cplane.translate_y,
                  ctx.cplane.scale_factor,
                  ctx.cplane.rotate_ang);
    }
    `;
  }
}
module.exports = { NitrilePreviewFlowerpot };
