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
      margin-bottom:0px;
      margin-left:105px;
      margin-right:10px;
      font-size:1.20em;
      font-weight:normal;
      letter-spacing:0.05em;
      min-height: 21px;
      line-height: 1;
    }
    .SLIDESUBTITLE {
      font-family: serif;
      margin-top:0px;
      margin-bottom:10px;
      margin-left:105px;
      margin-right:10px;
      font-size:0.60em;
      font-weight:normal;
      font-style:oblique;
      letter-spacing:0.05em;
      min-height: 10px;
      line-height: 1;
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
<body onload='setup()' onkeypress='body_keypress()' tabindex='1' >
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
        all.push(`<h2 class='SLIDESUBTITLE'> <b></b> </h2>`);
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
    let edit_contents = this.to_edit_contents(boardid);
    all.push(`<article class='SLIDE' id='${frameid}' row='${frame.style.row}' style='--boardpng:url("${boardpng}");background-image:var(--boardpng),var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:88px 40px,top left,top left;background-size:441px 320px,88px 40px,cover;' >`);
    pages.push(1);
    all.push(`<div class='BOTTOMCONTAINER'>`);
    all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' data-imgid='${imgid}' data-boardname='${boardname}' data-frameid='${frameid}' width='441' height='320' ></canvas>`);
    all.push(`<div class='EDITFORM' > ${edit_contents} </div>`);
    all.push(`<div class='PAGENUM'> / </div>`);
    all.push(`</div>`);
    all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
    all.push(`<h1 class='SLIDETITLE'> ${id} <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    all.push(`<h2 class='SLIDESUBTITLE'> <b></b> </h2>`);
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
    let edit_contents = this.to_edit_contents(boardid);
    all.push(`<article class='SLIDE' id='${frameid}' row='${frame.style.row}' style='--boardpng:url("${boardpng}");background-image:var(--boardpng),var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:88px 40px,top left,top left;background-size:441px 320px,88px 40px,cover;' >`);
    pages.push(1);
    all.push(`<div class='BOTTOMCONTAINER'>`);
    all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' data-imgid='${imgid}' data-boardname='${boardname}' data-frameid='${frameid}' width='441' height='320' ></canvas>`);
    all.push(`<div class='EDITFORM' > ${edit_contents} </div>`);
    all.push(`<div class='PAGENUM'> / </div>`);
    all.push(`</div>`);
    all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
    if(issub){
      all.push(`<h1 class='SLIDETITLE'>${order} <b>${this.uncode(topframe.style,topframe.title)}</b> </h1>`);
      all.push(`<h2 class='SLIDESUBTITLE'> <b>${icon} ${this.uncode(frame.style,frame.title)}</b> </h2>`);
      order = '';
    }else{
      icon = '';
      all.push(`<h1 class='SLIDETITLE'>${order} <a href='#frame${parentid}'></a> <b>${this.uncode(topframe.style,topframe.title)}</b> </h1>`);
      all.push(`<h2 class='SLIDESUBTITLE'> <b></b> </h2>`);
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
      let edit_contents = this.to_edit_contents(boardid);
      all.push(`<article class='SLIDE' id='${frameid}' row='${frame.style.row}' style='--boardpng:url("");background-image:var(--boardpng),var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:88px 40px,top left,top left;background-size:441px 320px,88px 40px,cover;' >`);
      pages.push(1);
      all.push(`<div class='BOTTOMCONTAINER'>`);
      all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' data-imgid='${imgid}' data-boardname='${boardname}' data-frameid='${frameid}' width='441' height='320' ></canvas>`);
      all.push(`<div class='EDITFORM' > ${edit_contents} </div>`);
      all.push(`<div class='PAGENUM'> / </div>`);
      all.push(`</div>`);
      all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
      all.push(`<h1 class='SLIDETITLE'> &#160; </h1>`);
      all.push(`<h2 class='SLIDESUBTITLE'> <b></b> </h2>`);
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
  to_edit_contents(boardid){
    return `\
       <select name='${boardid}' onchange='board_change_type(this.value,this.name)'>
        <optgroup label='Board'>
           <option value='note'>Note</option>
           <option value='cplane'>Complex Plane</option>
           <option value='xyplane'>Cartesian Plane</option>
        </optgroup>
       </select>
       <input type='text' name='${boardid}' onchange='board_change_text(this.value,this.name)'/>
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
      var ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.mode = 'note';
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
        ///MISC
        ctx.note.zoom = 1;
        ctx.note.grid = 30;
        ctx.note.origin_x = Math.round(canvas.width/2);
        ctx.note.origin_y = Math.round(canvas.height/2);
        ctx.note.action = 'add';
        ctx.note.translate_x = 0.0;//in grid unit
        ctx.note.translate_y = 0.0;//in grid unit
        ctx.note.scale_factor = 1.0;
        ctx.note.rotate_ang = 0;
        ctx.note.pointisinhandle = 0;
        ctx.note.val_real = 2;
        ctx.note.val_imag = 1;
        ctx.note.text = '';
      }
    }
    function board_draw_canvas(canvas){
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_change_type(value,name){
      console.log('board_change_type',value,name);
      var canvas = document.getElementById(name);//name attribute of Input field holds the 'boardid' of the canvas
      if(canvas){
        var ctx = canvas.getContext('2d');
        if(ctx){
          ctx.mode = value;
          if(ctx.mode=='note'){
            note_redraw(null,ctx,canvas);
          }else if(ctx.mode=='cplane'){
            cplane_redraw(ctx,canvas);
          }else if(ctx.mode=='xyplane'){
            xyplane_redraw(ctx,canvas);
          }
        }
      }
    }
    function board_change_text(value,name){
      console.log('board_change_text',value,name);
      var canvas = document.getElementById(name);//name attribute of Input field holds the 'boardid' of the canvas
      if(canvas){
        var ctx = canvas.getContext('2d');
        if(ctx){
          ctx.note.text = value;
          if(ctx.mode=='note'){
            note_redraw(null,ctx,canvas);
          }else if(ctx.mode=='cplane'){
            cplane_redraw(ctx,canvas);
          }else if(ctx.mode=='xyplane'){
            xyplane_redraw(ctx,canvas);
          }
        }
      }
    }
    function board_handle_keydown(shiftKey,keycode,ctx,canvas){
      console.log('board_handle_keydown',keycode);
      switch(keycode){
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
        if(ctx && ctx.mode=='note'){
          ctx.note.all_stroke = 3.0;
        }else if(ctx && ctx.mode=='cplane'){
          ctx.note.zoom *= 1.05;
          cplane_redraw(ctx,canvas);
        }else if(ctx && ctx.mode=='xyplane'){
          ctx.note.zoom *= 1.05;
          xyplane_redraw(ctx,canvas);
        }
        break;
      ///FOR PENCIL SIZE SMALL
      case 'Minus':
        if(ctx && ctx.mode=='note'){
          ctx.note.all_stroke = 1.5;
        }else if(ctx && ctx.mode=='cplane'){
          ctx.note.zoom /= 1.05;
          cplane_redraw(ctx,canvas);
        }else if(ctx && ctx.mode=='xyplane'){
          ctx.note.zoom /= 1.05;
          xyplane_redraw(ctx,canvas);
        }
        break;
      case 'KeyK':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.y  += - 1;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode=='cplane'){
          ctx.note.val_imag += 1;
          cplane_redraw(ctx,canvas);
        }
        break;
      case 'KeyJ':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.y  += + 1;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode=='cplane'){
          ctx.note.val_imag -= 1;
          cplane_redraw(ctx,canvas);
        }
        break;
      case 'KeyH':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.x  += - 1;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode=='cplane'){
          ctx.note.val_real -= 1;
          cplane_redraw(ctx,canvas);
        }
        break;
      case 'KeyL':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.x  += + 1;
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode=='cplane'){
          ctx.note.val_real += 1;
          cplane_redraw(ctx,canvas);
        }
        break;
      ///ROTATE
      case 'KeyE':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.rotate += (-1);
          note_redraw(null,ctx,canvas);
        }
        break;
      case 'KeyR':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.rotate += (+1);
          note_redraw(null,ctx,canvas);
        }else if(ctx && ctx.mode=='cplane'){
          cplane_reset(ctx,canvas);
        }
        break;
      ///SCALE-S
      case 'KeyD':
        if(ctx && ctx.mode=='note'){
          //reduce the size
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.w /= 1.01;
          o.myfig.h /= 1.01;
          note_redraw(null,ctx,canvas);
        }
        break;
      case 'KeyS':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.w *= 1.01;
          o.myfig.h *= 1.01;
          note_redraw(null,ctx,canvas);
        }
        break;
      ///SCALE-W
      case 'KeyW':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.w  += (shiftKey)?(-1):(+1);
          note_redraw(null,ctx,canvas);
        }
        break;
      ///SCALE-T 
      case 'KeyT':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.h  += (shiftKey)?(-1):(+1);
          note_redraw(null,ctx,canvas);
        }
        break;
      ///SKEW-X  
      case 'KeyX':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.skewX += (shiftKey)?(-1):(+1);
          note_redraw(null,ctx,canvas);
        }
        break;
      ///SKEW-Y  
      case 'KeyY':
        if(ctx && ctx.mode=='note'){
          let n = ctx.note.myundo.length;
          let o = ctx.note.myundo[n-1];
          o.myfig.skewY += (shiftKey)?(-1):(+1);
          note_redraw(null,ctx,canvas);
        }
        break;
      ///DUPLICATE
      case 'KeyM':
        if(ctx && ctx.mode=='note'){
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
        }else if(ctx && ctx.mode=='cplane'){
          ctx.note.action='multiply';
          cplane_reset(ctx,canvas);
        }
        break;
      ///FOR UNDO
      case 'KeyZ':
        if(ctx && ctx.mode=='note'){
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
        if(ctx && ctx.mode=='note'){
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
        }else if(ctx && ctx.mode=='cplane'){
          ctx.note.action='add';
          cplane_reset(ctx,canvas);
        }
        break;
      }
    }
    function board_onmousedown(evt){
      var canvas = evt.target;
      all_canvas = canvas;
      if(evt.button==0){
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.posx0 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.posy0 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.posx1 = ctx.posx0;
        ctx.posy1 = ctx.posy0;
        ctx.posx2 = ctx.posx1;
        ctx.posy2 = ctx.posy1;
        ctx.shiftKey = evt.shiftKey;
        ctx.altKey   = evt.altKey;
        ctx.mouseisdown = 1;
        if(ctx.mode=='note'){
          note_start(ctx,canvas);
        }else if(ctx.mode=='cplane'){
          cplane_start(ctx,canvas);
        }else if(ctx.mode=='xyplane'){
          xyplane_start(ctx,canvas);
        }
      }
    }
    function board_onmousemove(evt){
      var canvas = evt.target;
      all_canvas = canvas;
      if(evt.button==0){
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.posx1 = ctx.posx2;
        ctx.posy1 = ctx.posy2;
        ctx.posx2 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.posy2 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.shiftKey = evt.shiftKey;
        ctx.altKey   = evt.altKey;
        if(ctx.mouseisdown){
          if(ctx.mode=='note'){
            note_drag(ctx,canvas);
          }else if(ctx.mode=='cplane'){
            cplane_drag(ctx,canvas);
          }else if(ctx.mode=='xyplane'){
            xyplane_drag(ctx,canvas);
          }
        }
      }
    }
    function board_onmouseup(evt){
      var canvas = evt.target;
      all_canvas = canvas;
      if(evt.button==0){
        var ctx = canvas.getContext("2d");
        if(ctx.mouseisdown){
          if(ctx.mode=='note'){
            note_end(ctx,canvas);
          }else if(ctx.mode=='cplane'){
            cplane_end(ctx,canvas);
          }else if(ctx.mode=='xyplane'){
            xyplane_end(ctx,canvas);
          }
        }
        ctx.mouseisdown = 0;
        ctx.shiftKey = 0;
        ctx.altKey = 0;
      }
    }
    function board_onmouseenter(evt){
      var canvas = evt.target;
      all_canvas = canvas;
      var ctx = canvas.getContext("2d");
      if(ctx.mouseisdown){
        if(ctx.mode=='note'){
          note_end(ctx,canvas);
        }else if(ctx.mode=='cplane'){
          cplane_end(ctx,canvas);
        }else if(ctx.mode=='xyplane'){
          xyplane_end(ctx,canvas);
        }
      }
      ctx.mouseisdown = 0;
      ctx.shiftKey = evt.shiftKey;
      ctx.altKey   = evt.altKey;
    }
    function board_onmouseleave(evt){
      var canvas = evt.target;
      all_canvas = canvas;
      var ctx = canvas.getContext("2d");
      if(ctx.mouseisdown){
        if(ctx.mode=='note'){
          note_end(ctx,canvas);
        }else if(ctx.mode=='cplane'){
          cplane_end(ctx,canvas);
        }else if(ctx.mode=='xyplane'){
          xyplane_end(ctx,canvas);
        }
      }
      ctx.mouseisdown = 0;
      ctx.shiftKey = evt.shiftKey;
      ctx.altKey   = evt.altKey;
    }
    function board_ontouchstart(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                             
        all_canvas = canvas;
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.posx0 = Math.round((touch.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.posy0 = Math.round((touch.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.posx1 = ctx.posx0;
        ctx.posy1 = ctx.posy0;
        ctx.posx2 = ctx.posx1;
        ctx.posy2 = ctx.posy1;
        ctx.mouseisdown = 1;
        ctx.shiftKey = evt.shiftKey;
        ctx.altKey   = evt.altKey;
        if(ctx.mouseisdown){
          if(ctx.mode=='note'){
            note_start(ctx,canvas);
          }else if(ctx.mode=='cplane'){
            cplane_start(ctx,canvas);
          }else if(ct.mode=='xyplane'){
            xyplane_start(ctx,canvas);
          }
        }
      }
    }
    function board_ontouchmove(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        all_canvas = canvas;
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.posx1 = ctx.posx2;
        ctx.posy1 = ctx.posy2;
        ctx.posx2 = Math.round((touch.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.posy2 = Math.round((touch.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.shiftKey = evt.shiftKey;
        ctx.altKey   = evt.altKey;
        if(ctx.mouseisdown){
          if(ctx.mode=='note'){
            note_drag(ctx,canvas);
          }else if(ctx.mode=='cplane'){
            cplane_drag(ctx,canvas);
          }else if(ct.mode=='xyplane'){
            xyplane_drag(ctx,canvas);
          }
        }
      }
    }
    function board_ontouchend(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        all_canvas = canvas;
        var ctx = canvas.getContext("2d");
        if(ctx.mouseisdown){
          if(ctx.mode=='note'){
            note_end(ctx,canvas);
          }else if(ctx.mode=='cplane'){
            cplane_end(ctx,canvas);
          }else if(ct.mode=='xyplane'){
            xyplane_end(ctx,canvas);
          }
        }
        ctx.mouseisdown = 0;
        ctx.shiftKey = 0;
        ctx.altKey   = 0;
      }
    }
    function board_ontouchcancel(evt) {
      evt.preventDefault();
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        all_canvas = canvas;
        var ctx = canvas.getContext("2d");
        if(ctx.mouseisdown){
          if(ctx.mode=='note'){
            note_end(ctx,canvas);
          }else if(ctx.mode=='cplane'){
            cplane_end(ctx,canvas);
          }else if(ct.mode=='xyplane'){
            xyplane_end(ctx,canvas);
          }
        }
        ctx.mouseisdown = 0;
        ctx.shiftKey = 0;
        ctx.altKey   = 0;
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
    function erase_between(posx0,posy0,posx,posy,lw,ctx){
      let dx = posx-posx0;
      let dy = posy-posy0;
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
        let x = posx0 + dx*i;
        let y = posy0 + dy*i;
        ctx.clearRect(x-(lw/2),y-(lw/2),lw,lw);
      }
    }
    function pencil_between(posx0,posy0,posx,posy,lw,ctx){
      lw = Math.max(1,lw);
      let dx = posx-posx0;
      let dy = posy-posy0;
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
        let x = posx0 + dx*i;
        let y = posy0 + dy*i;
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
    function smudge_between(posx0,posy0,posx,posy,lw,mysmear,ctx,canvas){
      let dx = posx-posx0;
      let dy = posy-posy0;
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
        let x = posx0 + dx*i;
        let y = posy0 + dy*i;
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
      let posx1 = ctx.posx1;
      let posy1 = ctx.posy1;
      let posx2 = ctx.posx2;
      let posy2 = ctx.posy2;
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
      //pencil_between(posx1,posy1,posx2,posy2,lw,ctx);
      ctx.beginPath();
      ctx.moveTo(posx1,posy1);
      ctx.lineTo(posx2,posy2);
      ctx.stroke();
    }
    function board_draw_smudge(ctx,canvas){
      let x1 = ctx.posx1;
      let y1 = ctx.posy1;
      let x2 = ctx.posx2;
      let y2 = ctx.posy2;
      let mystroke= ctx.note.all_stroke;
      let mycolor = ctx.note.all_color;
      let mysmear = allrgbs[mycolor];
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      var lw = 3*mystroke*sx;
      lw = Math.max(lw,1);
      smudge_between(x1,y1,x2,y2,lw,mysmear,ctx,canvas);
    }
    function board_smudge_fill(x1,y1,sx,sy,ctx,canvas){
      let mystroke= ctx.note.all_stroke;
      let mycolor = ctx.note.all_color;
      let mysmear = allrgbs[mycolor];
      let n = smudge_fill(x1,y1,0,0,sx,sy,0,mysmear,ctx,canvas);
    }
    function board_draw_clear(ctx,canvas,first){
      ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
    }
    function board_draw_eraser(ctx,canvas,first){
      let posx1 = ctx.posx1;
      let posy1 = ctx.posy1;
      let posx2 = ctx.posx2;
      let posy2 = ctx.posy2;
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
          ctx.clearRect(sx2-(lw/2),posy2-(lw/2),lw,lw);
        }else{
          erase_between(posx1,posy1,posx2,posy2,lw,ctx);
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
      canvas.style.cursor = 'crosshair';
      ///ALT-KEY always erase
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='circle'){
        //START
        board_reset_basis(ctx);
        let mystroke = ctx.note.all_stroke;
        let mycolor  = ctx.note.all_color;
        let x = ctx.posx0;
        let y = ctx.posy0;
        ctx.note.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='rect'){
        board_reset_basis(ctx);
        let mystroke = ctx.note.all_stroke;
        let mycolor  = ctx.note.all_color;
        let x = ctx.posx0;
        let y = ctx.posy0;
        ctx.note.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='tri'){
        board_reset_basis(ctx);
        let mystroke = ctx.note.all_stroke;
        let mycolor  = ctx.note.all_color;
        let x = ctx.posx0;
        let y = ctx.posy0;
        ctx.note.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
      }
      if(ctx.note.all_op=='shape' && ctx.note.all_arg=='line'){
        board_reset_basis(ctx);
        let mystroke = ctx.note.all_stroke;
        let mycolor  = ctx.note.all_color;
        let x = ctx.posx0;
        let y = ctx.posy0;
        ctx.note.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
      }
      if(ctx.note.all_op=='pencil'){
        //START
        board_reset_basis(ctx);
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.note.myface, 0,0);
        if(ctx.altKey){
          if(ctx.shiftKey){
            ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
          }else{
            board_draw_eraser(ctx,canvas,true);
          }
        }else if(ctx.shiftKey){
          board_draw_smudge(ctx,canvas,true);
        }else{
          board_draw_pencil(ctx,canvas,true);
        }
      }
      if(ctx.note.all_op=='select'){
        ///START
        if( (ctx.posx0 > ctx.note.mybasis.x) &&
            (ctx.posx0 < ctx.note.mybasis.x+ctx.note.mybasis.w+ctx.note.mybasis.dw) &&
            (ctx.posy0 > ctx.note.mybasis.y) &&
            (ctx.posy0 < ctx.note.mybasis.y+ctx.note.mybasis.h+ctx.note.mybasis.dh) ){
          ///MOVE/COPY/RESIZE
          ctx.note.mybasis.s = ctx.note.myface;
          ctx.note.mybasis.a = ctx.note.all_arg;      
        }else{
          ///HILITE-ONLY
          board_reset_basis(ctx);
          ctx.note.mybasis.s = ctx.note.myface;
          ctx.note.mybasis.a = null;
          ctx.note.mybasis.x  = ctx.posx0;
          ctx.note.mybasis.y  = ctx.posy0;
          ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
          ctx.putImageData(ctx.note.myface, 0,0);
          note_draw_hilite(ctx,canvas);
        }
      }
      //SAVE
    }
    function note_drag(ctx,canvas){
      if (ctx.note.all_op=='shape' && ctx.note.all_arg=='circle' && ctx.note.myfig){
        //DRAG  
        let posx0 = ctx.posx0;
        let posy0 = ctx.posy0;
        let posx2 = ctx.posx2;
        let posy2 = ctx.posy2;
        let w = posx2-posx0;
        let h = posy2-posy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.note.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.note.myfig.mycolor;   
        ///CIRCLE
        let s = ctx.note.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        let cx,cy,rx,ry;
        if(ctx.altKey){
          cx = posx0;
          cy = posy0;
          rx = Math.abs(posx0 - posx2);
          ry = Math.abs(posy0 - posy2);
          if(ctx.shiftKey){
            let r = Math.max(rx,ry);
            rx = r;
            ry = r;
          }
        }else{
          cx = (posx0 + posx2)/2;
          cy = (posy0 + posy2)/2;
          rx = Math.abs((posx0 - posx2)/2);
          ry = Math.abs((posy0 - posy2)/2);
          if(ctx.shiftKey){
            let r = Math.max(rx,ry);
            rx = r;
            ry = r;
            if(posx2 > posx0) cx = posx0 + rx;
            else if(posx2 < posx0) cx = posx0 - rx;
            if(posy2 > posy0) cy = posy0 + ry;
            else if(posy2 < posy0) cy = posy0 - ry;
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
        let posx0 = ctx.posx0;
        let posy0 = ctx.posy0;
        let posx2 = ctx.posx2;
        let posy2 = ctx.posy2;
        let x = posx0;
        let y = posy0; 
        let w = posx2-posx0;
        let h = posy2-posy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.note.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.note.myfig.mycolor;   
        ///RECT  
        let s = ctx.note.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        if(ctx.shiftKey){
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
        let posx0 = ctx.posx0;
        let posy0 = ctx.posy0;
        let posx2 = ctx.posx2;
        let posy2 = ctx.posy2;
        let x = posx0;
        let y = posy0; 
        let w = posx2-posx0;
        let h = posy2-posy0;
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
        let x1 = ctx.posx0;
        let y1 = ctx.posy0;
        let x2 = ctx.posx2;
        let y2 = ctx.posy2;
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
        if(ctx.shiftKey && ddx > ddy){
          x2 = ctx.posx2;
          y2 = ctx.posy0;
        }else if(ctx.shiftKey && ddy > ddx){
          x2 = ctx.posx0;
          y2 = ctx.posy2;
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
      if(ctx.note.all_op=='pencil'){
        //DRAG  
        if(ctx.altKey){
          ///ALT-KEY always erase
          board_draw_eraser(ctx,canvas,false);
          return;
        }else if(ctx.shiftKey){
          board_draw_smudge(ctx,canvas,false);
        }else{
          board_draw_pencil(ctx,canvas,false);
        }
      }
      if(ctx.note.all_op=='select'){
        //DRAG  
        if(ctx.note.mybasis.a){
          ///MOVE/COPY/RESIZE
          let dx = ctx.posx2 - ctx.posx0;
          let dy = ctx.posy2 - ctx.posy0;
          ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
          ctx.putImageData(ctx.note.myface, 0,0);
          let p1 = ctx.getImageData(ctx.note.mybasis.x,ctx.note.mybasis.y, ctx.note.mybasis.w,ctx.note.mybasis.h);
          if(ctx.note.mybasis.a=='move'){
            if(ctx.shiftKey){
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
            if(ctx.shiftKey){
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
            if(ctx.shiftKey){
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
          ctx.note.mybasis.w = ctx.posx2 - ctx.posx0;
          ctx.note.mybasis.h = ctx.posy2 - ctx.posy0;
          ctx.putImageData(ctx.note.myface, 0,0);
          note_draw_hilite(ctx,canvas);
        }
      }
      //SAVE
    }
    function note_end(ctx,canvas){
      canvas.style.cursor = '';
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
      else if(ctx.note.all_op=='pencil'){
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
      console.log('body_keypress()',body.tagName.toUpperCase());
      if(body.tagName.toUpperCase()=='BODY'){
        if(all_canvas){
          var shiftKey = event.shiftKey;
          var keycode = event.code;
          canvas = all_canvas;
          ctx = canvas.getContext("2d");
          board_handle_keydown(shiftKey,keycode,ctx,canvas);
        }
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
      d    =typeof(d)    !='undefined'? d    :8;
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
      ///check to see if mouse click is directly on top of the handle dot
      var flag = ctx.isPointInPath(ctx.posx0,ctx.posy0); 
      ctx.note.pointisinhandle = flag;
    }
    function cplane_drag(ctx,canvas){
      if(ctx.note.pointisinhandle){
        var diff_x = ctx.posx2 - ctx.note.origin_x;
        var diff_y = ctx.posy2 - ctx.note.origin_y;
        diff_x /= ctx.note.zoom;
        diff_y /= ctx.note.zoom;
        if(1){
          //snap to grid within 3px
          var v = diff_y % ctx.note.grid;
          if(Math.abs(v) <= 4) {
            diff_y = Math.round(diff_y / ctx.note.grid) * ctx.note.grid;
          }
        }
        if(1){
          //snap to grid within 3px
          var v = diff_x % ctx.note.grid;
          if(Math.abs(v) <= 4) {
            diff_x = Math.round(diff_x / ctx.note.grid) * ctx.note.grid;
          }
        }
        if(ctx.note.action=='multiply'){
          ctx.note.rotate_ang = Math.atan2(diff_y, diff_x);
          ctx.note.scale_factor = Math.fround(Math.sqrt(diff_y*diff_y + diff_x*diff_x))/ctx.note.grid;
        }else if(ctx.note.action=='add'){
          ctx.note.translate_x = diff_x / ctx.note.grid;
          ctx.note.translate_y = diff_y / ctx.note.grid;
        }
      }else{
        var diff_x = ctx.posx2 - ctx.posx1;
        var diff_y = ctx.posy2 - ctx.posy1;
        ctx.note.origin_x += diff_x;
        ctx.note.origin_y += diff_y;
      }
      cplane_redraw(ctx,canvas);
    }
    function cplane_end(ctx,canvas){
      cplane_redraw(ctx,canvas);
    }
    function cplane_reset(ctx,canvas){
      ctx.note.scale_factor = 1;
      ctx.note.rotate_ang = 0;
      ctx.note.translate_x = 0;
      ctx.note.translate_y = 0;
      cplane_redraw(ctx,canvas);
    }
    function cplane_redraw(ctx,canvas){
      ctx.resetTransform();
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#555588';
      ctx.translate(+ctx.note.origin_x,+ctx.note.origin_y);
      ctx.scale(ctx.note.zoom,ctx.note.zoom);
      var w = canvas.width;
      var h = canvas.height;
      var grid = ctx.note.grid;
      ///////////////////////////////////////////////
      ///draw gray grids
      ///////////////////////////////////////////////
      if(1){
        ctx.strokeStyle = 'gray';
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
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        if(1){
          var y = 0;
          ctx.moveTo(0,       y*grid);
          ctx.lineTo(-50*grid,y*grid);
          ctx.moveTo(0,       y*grid);
          ctx.lineTo(+50*grid,y*grid);
        }
        ctx.stroke();
      }
      ///////////////////////////////////////////////
      ///draw labels
      ///////////////////////////////////////////////
      if(1){
        var fs = Math.min(ctx.note.grid,10);
        var fs = ""+fs+"px";
        ctx.font = fs;
        ctx.fillStyle = 'black';
        ///draw horizontal labels
        for(var x=-50; x < +50; x++) {
          ctx.fillText(""+x,x*grid,0);
        }
        ///draw vertical labels
        for(var y=-50; y < +50; y++) {
          if(y==0) continue;
          ctx.fillText(""+y+"\u{1D456}",0,-y*grid);
        }
      }
      ///////////////////////////////////////////////
      ///draw blue grids
      ///////////////////////////////////////////////
      ctx.globalAlpha = 0.5;
      if(ctx.note.rotate_ang!=0 ||
         ctx.note.scale_factor!=1||
         ctx.note.translate_x!=0||
         ctx.note.translate_y!=0){
        ctx.rotate(ctx.note.rotate_ang);
        ctx.scale(ctx.note.scale_factor,ctx.note.scale_factor);
        ctx.translate(ctx.note.translate_x*ctx.note.grid,ctx.note.translate_y*ctx.note.grid);
        ctx.beginPath();
        ctx.strokeStyle = 'darkslategray';
        ctx.lineWidth = 0.5;
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
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        if(0){
          var x = 0;
          ctx.moveTo(x*grid,0);
          ctx.lineTo(x*grid,-50*grid);   
          ctx.moveTo(x*grid,0);
          ctx.lineTo(x*grid,+50*grid);   
        }
        if(1){
          var y = 0;
          ctx.moveTo(0,       y*grid);
          ctx.lineTo(-50*grid,y*grid);
          ctx.moveTo(0,       y*grid);
          ctx.lineTo(+50*grid,y*grid);
        }
        ctx.stroke();
      }
      ///////////////////////////////////////////////
      ///draw red arrow
      ///////////////////////////////////////////////
      if(1){
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'red';
        ctx.fillStyle   = 'red';
        var val_real = parseFloat(ctx.note.val_real);
        var val_imag = parseFloat(ctx.note.val_imag);
        let arrow_x = Math.round(val_real)*ctx.note.grid ;
        let arrow_y = -Math.round(val_imag)*ctx.note.grid ;
        arrow_x = Math.round(val_real)*ctx.note.grid ;
        arrow_y = -Math.round(val_imag)*ctx.note.grid ;
        if(Number.isFinite(arrow_x)&&
           Number.isFinite(arrow_y)){
           if(arrow_x == 0 && arrow_y == 0) {
            /// if both zero then dont draw
           } else {
            drawArrow(ctx,0,0,arrow_x,arrow_y);
           }
        }
      }
      ///////////////////////////////////////////////
      /// draw red handle 
      ///////////////////////////////////////////////
      if(1){
        ctx.beginPath();
        var r = 2;
        var f = ctx.note.zoom * ctx.note.scale_factor;
        if(f < 1){
          r /= f;
        }
        if(ctx.note.action=='add'){
          ctx.arc(0,0,r,0,Math.PI*2);
        }else if(ctx.note.action=='multiply'){
          ctx.arc(ctx.note.grid,0,r,0,Math.PI*2);
        }
        ctx.fill();
      }
      //console.log(ctx.note.origin_x,ctx.note.origin_y, ctx.note.translate_x, ctx.note.translate_y, ctx.note.scale_factor, ctx.note.rotate_ang);
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    function xyplane_start(ctx,canvas){
    }
    function xyplane_drag(ctx,canvas){
      if(0){
        //////
      }else{
        var diff_x = ctx.posx2 - ctx.posx1;
        var diff_y = ctx.posy2 - ctx.posy1;
        ctx.note.origin_x += diff_x;
        ctx.note.origin_y += diff_y;
      }
      xyplane_redraw(ctx,canvas);
    }
    function xyplane_end(ctx,canvas){
      xyplane_redraw(ctx,canvas);
    }
    function xyplane_redraw(ctx,canvas){
      ctx.resetTransform();
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#555588';
      ctx.translate(+ctx.note.origin_x,+ctx.note.origin_y);
      ctx.scale(ctx.note.zoom,ctx.note.zoom);
      var w = canvas.width;
      var h = canvas.height;
      var grid = ctx.note.grid;
      ///////////////////////////////////////////////
      ///draw gray grids
      ///////////////////////////////////////////////
      if(1){
        ctx.strokeStyle = 'gray';
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
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        if(1){
          var y = 0;
          ctx.moveTo(0,       y*grid);
          ctx.lineTo(-50*grid,y*grid);
          ctx.moveTo(0,       y*grid);
          ctx.lineTo(+50*grid,y*grid);
        }
        if(1){
          var x = 0;
          ctx.moveTo(x*grid,0);
          ctx.lineTo(x*grid,-50*grid);   
          ctx.moveTo(x*grid,0);
          ctx.lineTo(x*grid,+50*grid);   
        }
        ctx.stroke();
      }
      ///////////////////////////////////////////////
      ///draw labels
      ///////////////////////////////////////////////
      if(1){
        var fs = Math.min(ctx.note.grid,10);
        var fs = ""+fs+"px";
        ctx.font = fs;
        ctx.fillStyle = 'black';
        ///draw horizontal labels
        for(var x=-50; x < +50; x++) {
          ctx.fillText(""+x,x*grid,0);
        }
        ///draw vertical labels
        for(var y=-50; y < +50; y++) {
          if(y==0) continue;
          ctx.fillText(""+y,0,-y*grid);
        }
      }
      ///////////////////////////////////////////////
      ///draw plots  
      ///////////////////////////////////////////////
      if(1){
        ctx.fillStyle = 'DarkSlateGray';
        ctx.lineWidth = 1;
        var g = {};
        var r = 1;
        var text = ctx.note.text;
        for (var h=-50; h <= 50; h++) {
          for (var d=0; d < 30; ++d) {
            var x = h + d/30;
            g['x'] = x;
            var [y] = extract_next_expr(text,g,0);
            y = -y;
            //console.log('y=',y,'x=',x);
            if(Number.isFinite(x) && Number.isFinite(y)){
              ctx.beginPath();
              ctx.arc(x*grid,y*grid,r,0,Math.PI*2);
              ctx.fill();
            }
          }
        } 
      }
    }
    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////
    re_scalar_func     = new RegExp("^([A-Za-z][A-Za-z0-9]*)\\\\(");
    re_scalar_var      = new RegExp("^([A-Za-z][A-Za-z0-9]*)\\\\s*(.*)$");
    re_scalar_is_oct   = new RegExp("^0o([0-7]+)\\\\s*(.*)$");    
    re_scalar_is_bin   = new RegExp("^0b([0-1]+)\\\\s*(.*)$");    
    re_scalar_is_hex   = new RegExp("^0x([0-9A-Fa-f]+)\\\\s*(.*)$");    
    re_scalar_float    = new RegExp("^(\\\\d*\\\\.\\\\d+|\\\\d*\\\\.|\\\\d+)(e\\\\d+|e\\\\+\\\\d+|e\\\\-\\\\d+|E\\\\d+|E\\\\+\\\\d+|E\\\\-\\\\d+|)\\\\s*(.*)$");    
    re_scalar_op       = new RegExp("^(>=|<=|==|!=|>|<|\\\\+|-|\\\\*|\\\\/)\\\\s*(.*)$");    
    function extract_next_expr(s,g,z=0){
      /// extract the expression of a+1,b+1
      /// until we have just gone past the comma, in which
      /// case the comma will be discarded and the value of the expression 'a+1'
      /// is caluclated based on the variable stored with the 'g' 
      //NOTE: 's' is the input string. 'g' contains a list of arguments. 'z' is the level of nesting
      //RETURN: this function returns a float
      /// - this function will stop at the first sign of a comma,
      /// - this function will stop at the first sign of a unmatched close-parenthesis 
      /// such as x+1+y,...
      /// such as x+1)...
      var s0 = s;
      s = s.trimLeft();
      var op = '';
      var arg1 = 0;
      /// check to see if it is a comma, a left parenthis, or right 
      /// parenthesis
      var c = s.charAt(0);
      if (c === ',' || c === ')') {
        s = s.slice(1);
        return [c, s, c];
      }
      while(s.length){
        /// if the s starts with a comma or right-paren,
        /// then keep it in the s and return the current
        /// processed value
        var c = s.charAt(0);
        if(c === ',' || c === ')') {
          break;
        }
        if(c === '+' || c === '-') {
          op = c;
          s = s.substr(1);
          s = s.trimLeft();
          continue;
        }
        /// A term is always a float that is the result
        /// of '2', 'pi', '2*pi', '2/pi', '2*2*pi'. etc. 
        var my = this.extract_next_term(s,g,z+1);
        var [a,s,phrase] = my;
        ///'a' is string such as '*', '+', ')', or ','
        if(typeof a === 'number'){
          let arg2 = a;
          arg1 = this.exec_operator(op,arg1,arg2);
          op = '';//it must to be cleared because otherwise it might be used again
        }else{
          /// otherwise assume a is an operator
          op = a; 
        } 
        s = s.trimLeft();
      }
      var phrase = s0.substr(0,s0.length-s.length);
      //console.log('extract_next_expr', arg1, s, phrase);
      return [arg1,s,phrase];
    }
    function extract_next_term(s,g,z=0){
      /// a term is defined as number multiplied together with operator * or /,
      /// for instance, for '1 + 2*2 + 1', the '2*2' is to be processed by this function
      var s0 = s;
      s = s.trimLeft();
      var op = '';
      var arg1 = 0;    
      while(s.length){
        ///lookahead:
        /// if the s starts with a comma or right-paren,
        /// then keep it in the s and return the current
        /// processed value
        var c = s.charAt(0);
        if(c === ',' || c === ')' || c === '+' || c === '-') {
          break;
        }
        /// a scalar is defined as a function, a comma, a left 
        /// parenthesis, a right parenthesis, a plus, minus, 
        /// multiplication, or division sign 
        var my = this.extract_next_scalar(s,g,z+1);
        var [s1,s,phrase] = my;
        ///'a' is string such as '*', '+', ')', or ',', 
        ///'a' could also be a float           
        if(typeof s1 === 'number'){
          /// assume 'a' is 'arg2' and run the operator
          let arg2 = s1;
          arg1 = this.exec_operator(op,arg1,arg2);
          op = '';/// it is important to clear op here 
        }else{
          /// otherwise assume 'a' is an operator
          op = s1; 
        } 
        s = s.trimLeft();
      }
      var phrase = s0.substr(0,s0.length-s.length);
      //console.log('extract_next_expr', arg1, s, phrase);
      return [arg1,s,phrase];
    }
    function extract_next_scalar(s,g,z=0) {
      ///NOTE: this function returns an array of three elements: [a,s,phrase]
      /// The first one is a number if what extracted is a number. 
      ///
      /// 1. a number such as 1.234
      /// 2. an operator such as '+', '-', '*', '/', '>', '<', '>=', '<=' 
      /// 
      /// A scalar is defined as the value of a 
      /// complete function (including any
      /// nested functions as well), an parenthesized expression,
      /// a multiplication sign, or a division sign 
      var s0 = s;
      var v;
      s = s.trimLeft();
      if (s.length===0) {
        return ['','',''];
      }
      if (s.charAt(0)==='('){
        let myval = 0;
        s = s.slice(1);
        while(s.length){
          var [s1,s] = this.extract_next_expr(s,g,z+1);
          if(s1 === ')'){
            break;
          }else if(s1 === ','){
            continue;
          }else if(typeof s1 === 'number'){
            myval = s1;
            continue;
          }
          continue;
        }
        let phrase = s0.substr(0,s0.length - s.length);
        return [myval,s,phrase];
      }
      /// scalar function such as 'sin(x)'
      if ((v=re_scalar_func.exec(s))!==null) {
        let func_name = v[1];
        s = s.slice(v[0].length);
        let func_args = [];
        while(s.length){
          /// the 's' would have looked like: 'x+1, y+1, z)', we will 
          /// call extract_next_expr which will extract one of them until the comma or a right parentheiss
          /// and return its numerical value. If the returned 'a' is not a numerical value we will assume
          /// that we have exhausted all arguments of this func
          var [s1,s] = this.extract_next_expr(s,g,z+1);//extract until we see a comma or a right parenthesis
          if (typeof s1 === 'number') {
            let a = s1;
            func_args.push(a);
            continue;
          }
          if(s1 === ','){
            continue;
          }
          if(s1 === ')'){
            break;
          }
          continue;
        }
        ///NOTE: the 'args' will already have held a list of floats
        let num = this.exec_float_func(func_name,func_args,g,z+1);//returns a float
        let phrase = s0.substr(0,s0.length - s.length);
        //console.log('debug','extract_next_scalar', 'scalar_func', 'num',num, 's',s, 'g',g, 'phrase',phrase);
        return [num,s,phrase];
      } 
      /// here we need to check to see if it is a variable, such 
      /// as 'x', 'y', 'x1', 'xx1', etc. 
      if((v=re_scalar_var.exec(s))!==null){
        let key = v[1];
        s = v[2];
        let num = NaN;
        if(g && g.hasOwnProperty(key)){
          ///It could be a float or a string
          let m = g[key];
          if(typeof m === 'number'){
            num = m;
          }else if(typeof m === 'string'){
            try{
              num = parseFloat(m);
            }catch(e){
              num = NaN;
            }
          }
        }else if(key=='PI'){
          num = Math.PI;
        }else if(key=='E'){
          num = Math.E;
        }
        let phrase = s0.substr(0,s0.length - s.length);
        //console.log('extract_next_scalar', 'var_symbol', num, s, g, phrase);
        return [num,s,phrase];
      }
      if((v=re_scalar_is_oct.exec(s))!==null){
        /// '0o07'
        let num = v[1];
        s = v[2];
        num = parseInt(num,8);
        let a = num;
        let phrase = s0.substr(0,s0.length - s.length);
        return [a,s,phrase];
      }
      if((v=re_scalar_is_bin.exec(s))!==null){
        /// '0b110'
        let num = v[1];
        s = v[2];
        num = parseInt(num,2);
        let a = (num);
        let phrase = s0.substr(0,s0.length - s.length);
        return [a,s,phrase];
      }
      if((v=re_scalar_is_hex.exec(s))!==null){
        /// '0x10'
        let num = v[1];
        s = v[2];
        num = parseInt(num,16);
        let a = (num);
        let phrase = s0.substr(0,s0.length - s.length);
        return [a,s,phrase];
      }
      if((v=re_scalar_float.exec(s))!==null){
        /// if this is a float, such as 10, 11.2, 10E2, 10E-2, etc.
        let num = v[1];
        let suffix = v[2];
        s = v[3];
        if(suffix){
          num = ""+num+suffix;
        }
        num = parseFloat(num);
        let a = (num);
        let phrase = s0.substr(0,s0.length - s.length);
        return [a,s,phrase];
      }
      if((v=re_scalar_op.exec(s))!==null){
        /// such as '<', '>', '<=', '>='
        let phrase = v[0];
        let a = v[1];
        s = v[2];
        return [a,s,phrase];
      }
      if(1){
        /// something is wrong, only extract one character, and see if we can recover
        let cc = s.codePointAt(0);
        if(cc > 0xFFFF){
          let op = s.slice(0,2);
          let phrase = op;
          s = s.slice(2);
          return [op,s,phrase];
        }else{
          let op = s.slice(0,1);
          let phrase = op;
          s = s.slice(1);
          return [op,s,phrase];
        }
      }
    }
    function exec_float_func(func_name,func_args,g,z=0) {
      ///NOTE that 'func_args' would already have held a list of 'float' numbers
      switch(func_name) {
        case 'ln':
          if(func_args.length==1){
            return Math.log(func_args[0]);//natural logarithm
          }else{
            return NaN;
          }
        case 'log':
          if(func_args.length==1){
            return Math.log(func_args[0])/(Math.LN10);
          }else{
            return NaN;
          }
        case 'log2':
          if(func_args.length==1){
            return Math.log(func_args[0])/(Math.LN2);
          }else{
            return NaN;
          }
        case 'exp':
          if(func_args.length==1){
            return Math.exp(func_args[0]);
          }else{
            return NaN;
          }
        case 'pow':
          if(func_args.length==2){
            return Math.pow(func_args[0],func_args[1]);
          }else{
            return NaN;
          }
        case 'sqrt':
          if(func_args.length==1){
            return Math.sqrt(func_args[0]);     
          }else{
            return NaN;
          }
        case 'sin':
          if(func_args.length==1){
            return Math.sin(func_args[0]);
          }else{
            return NaN;
          }
        case 'cos':
          if(func_args.length==1){
            return Math.cos(func_args[0]);
          }else{
            return NaN;
          }
        case 'tan':
          if(func_args.length==1){
            return Math.tan(func_args[0]);
          }else{
            return NaN;
          }
        case 'asin':
          if(func_args.length==1){
            return Math.asin(func_args[0]);
          }else{
            return NaN;
          }
        case 'acos':
          if(func_args.length==1){
            return Math.acos(func_args[0]);
          }else{
            return NaN;
          }
        case 'atan':
          if(func_args.length==1){
            return Math.atan(func_args[0]);
          }else{
            return NaN;
          }
        case 'atan2':
          if(func_args.length==2){
            return Math.atan2(func_args[0],func_args[1]);
          }else{
            return NaN;
          }
        case 'sinh':
          if(func_args.length==1){
            return Math.sinh(func_args[0]);
          }else{
            return NaN;
          }
        case 'cosh':
          if(func_args.length==1){
            return Math.cosh(func_args[0]);
          }else{
            return NaN;
          }
        case 'tanh':
          if(func_args.length==1){
            return Math.tanh(func_args[0]);  
          }else{
            return NaN;
          }
        case 'deg2rad':
          if(func_args.length==1){
            return func_args[0]/180*Math.PI;
          }else{
            return NaN;
          }
        case 'rad2deg':
          if(func_args.length==1){
            return func_args[0]/Math.PI*180;
          }else{
            return NaN;
          }
        case 'floor':
          if(func_args.length==1){
            return Math.floor(func_args[0]);
          }else{
            return NaN;
          }
        case 'ceil':
          if(func_args.length==1){
            return Math.ceil(func_args[0]);
          }else{
            return NaN;
          }
        case 'round':
          if(func_args.length==1){
            return Math.round(func_args[0]);
          }else{
            return NaN;
          }
        case 'abs':
          if(func_args.length==1){
            return Math.abs(func_args[0]);
          }else{
            return NaN;
          }
        case 'sign':
          if(func_args.length==1){
            return Math.sign(func_args[0]);
          }else{
            return NaN;
          }
        case 'if':
          if(func_args.length==3){
            return (func_args[0] == 0) ? func_args[2] : func_args[1];
          }else{
            return NaN;
          }
        case 'isfinite':
          if(func_args.length==1){
            return Number.isFinite(func_args[0])?1:0;
          }else{
            return NaN;
          }
        case 'isnan':
          if(func_args.length==1){
            return Number.isFinite(func_args[0])?1:0;
          }else{
            return NaN;
          }
        default:
          break;
      }
      return NaN;;
    }
    function exec_operator(op,arg1,arg2,z=0) {
      switch(op) {
        case '*':
          return arg1*arg2;
          break;
        case '+':
          return arg1+arg2;
          break;
        case '-':
          return arg1-arg2;
          break;
        case '/':
          return arg1/arg2;
          break;
        case '>':
          return (arg1 > arg2) ? 1 : 0;
          break;
        case '<':
          return (arg1 < arg2) ? 1 : 0;
          break;
        case '<=':
          return (arg1 <= arg2) ? 1 : 0;
          break;
        case '>=':
          return (arg1 >= arg2) ? 1 : 0;
          break;
        case '!=':
          return (arg1 != arg2) ? 1 : 0;
          break;
        case '==':
          return (arg1 == arg2) ? 1 : 0;
          break;
        default:
          /// if the operator is not recognized simply returns the latest operand
          return arg2;
          break;
      }
    }
    `;
  }
}
module.exports = { NitrilePreviewFlowerpot };
