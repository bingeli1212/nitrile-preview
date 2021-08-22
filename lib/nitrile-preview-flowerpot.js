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
    this.icon_folder = '&#x2668;'//HOT SPRING  
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
    this.css_map = this.to_css_map();
    this.add_css_map_entry(
      this.css_map,
      'UL', [
        'list-style-type: square',
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'PARAGRAPH, PRIMARY, INDENT', [
        'text-align: justify',
        '-webkit-hyphens: auto',
        '-moz-hyphens: auto',
        '-ms-hyphens: auto',
        'hyphens: auto'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FIGCAPTION',[
        'width: 80%',
        'text-align: left',
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'SLIDETITLE', [
        'font-family: serif',
        'margin-top:12px',
        'margin-bottom:30px',
        'margin-left:105px',
        'margin-right:10px',
        'font-size:1.20em',
        'font-weight:normal',
        'letter-spacing:0.05em',
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'SLIDESUBTITLE', [
        'font-family: serif',
        'margin-top:6px',
        'margin-bottom:6px',
        'margin-left:105px',
        'margin-right:10px',
        'font-size:0.9em',
        'font-weight:normal',
        'font-style:italic'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERTITLE', [
        'margin-left: 6.5mm',
        'margin-top: 2.5cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.8em',
        'font-weight: bold',
        'text-align: center',
        'align-self: center'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERSUBTITLE', [
        'margin-left: 6.5mm',
        'margin-top: 0.8cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERINSTITUTE', [
        'margin-left: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERAUTHOR', [
        'margin-left: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERDATE', [
        'margin-left: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center'
      ]
    );
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
      let s = this.to_sidesvg_for_id(p.id,toc,32);
      s = encodeURIComponent(s);
      s = `      --side${p.id}: url("data:image/svg+xml,${s}");`;
      allsidesvgs.push(s);
    })
    var allsidemaps = [];
    toc.forEach((p,i) => {
      let s = this.to_sidemap_for_id(p.id,toc,i,32);
      allsidemaps.push(s);
    })
    // background-repeat: no-repeat, no-repeat, no-repeat;
    // background-position: top left, top left, top left;
    // background-size: 88px 40px, 80px 400px, cover;
    var logofile = this.conf_to_string('logofile');
    var setup_javascript = this.to_setup_script();
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
      line-height: 1.25;
    }
    figure * {
      font-size: 10pt;
      color: #124A47;
      line-height: 1.25;
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
      left: 88px;
      width: 441px;
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
      bottom: 0px;
      right: 441px;
    }
    .EDITBOARD {
      position: absolute;
      z-index: 10;
      top: -320px;
      left: 0px;
    }
    .EDITBUTTON {
      left: 0px;
      bottom: 0px;
    }
    .EDITBUTTON:checked ~ .EDITBOARD {
      visibility: visible;
      z-index: 10;
      cursor: crosshair;
      --mycursor: crosshair;
    }
    .EDITBUTTON:checked ~ .EDITFORM {
      visibility: visible;
      z-index: 10;
    }
    .EDITFORM {
      visibility: hidden;
      margin-left: 0;
      margin-right: auto;
      margin-top: auto;
      margin-bottom: auto;
      align-left: center;
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
${setup_javascript}
//]]>
</script>
</head>
<body onload='setup()'>
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
          let order = '';
          let icon = this.icon_folder;
          let out = this.write_one_frame(id,order,icon,subframe,1,`${i+1}`,toc,pages);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = i+1;
        let icon = '';
        let out = this.write_one_frame(id,order,icon,topframe,0,'',toc,pages);
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
      let slidetitle_css = this.css('SLIDETITLE');
      let paragraph_css = this.css('PARAGRAPH');
      let ul_css = this.css('PARA UL');
      let li_css = this.css('PACK');
      if(n==0){
        all.push(`<article row='0' class='SLIDE' style='background-image:var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:top left;background-size:88px 40px,cover;' >`);
        pages.push('');
        all.push(`<div class='BOTTOMCONTAINER'><div class='PAGENUM'> / </div></div>`);
        all.push(`<h1 style='${slidetitle_css}'> <b>Table Of Contents</b> </h1>`);
        all.push(`<div style='${paragraph_css}'>`)
        all.push(`<ul style='${ul_css}; list-style:none;'>`);
      }
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`<li style='${li_css}; position:relative'> ${icon} <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> ${this.icon_folder} </li>`);
      }else{
        all.push(`<li style='${li_css}; position:relative'> ${icon} <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> </li>`);
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
    let slidetitle_css = this.css('SLIDETITLE');
    let itemize_css = this.css('ITEMIZE');
    let paragraph_css = this.css('PARAGRAPH');
    let ul_css = this.css('PARA UL');
    let li_css = this.css('PACK LI');
    let all = [];
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' row='${frame.style.row}' style='background-image:var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:top left;background-size:88px 40px,cover;' >`);
    pages.push(1);
    let boardid = `board${id}`;
    let boardname = frame.boardname;
    let edit_contents = this.to_edit_contents(boardid,boardname);
    all.push(`<div class='BOTTOMCONTAINER'>`);
    all.push(`<input class='EDITBUTTON' type='checkbox'></input>`);
    all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' width='441' height='320'></canvas>`);
    all.push(`<div class='EDITFORM'> ${edit_contents} </div>`);
    all.push(`<div class='PAGENUM'> / </div>`);
    all.push(`</div>`);
    all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
    all.push(`<h1 style='${slidetitle_css}'> ${id} <b>${this.uncode(frame.style,frame.title)}</b> ${this.icon_folder} </h1>`);
    toc.push({id,order:id,icon:'',style:frame.style,title:frame.title,posticon:this.icon_folder})
    frame.contents.forEach((x) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    // FONT
    all.push(`<div style='${itemize_css}' >`)
    subframes.forEach((subframe,j,arr) => {
      if(j==0){
        all.push(`<ul style='${ul_css}; list-style:none;'>`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${this.icon_folder}</span>`;
      all.push(`<li style='${li_css}; position:relative'> ${icon} <b> <a href='#frame${id}x${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </b> </li>`);
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
  write_one_frame(id,order,icon,frame,issub,parentid,toc,pages){
    let slidetitle_css = this.css('SLIDETITLE');
    let itemize_css = this.css('ITEMIZE');
    let paragraph_css = this.css('PARAGRAPH');
    let ul_css = this.css('PARA UL');
    let li_css = this.css('PACK LI');
    let all = [];
    let v = null;
    const re_choice = /^(.*?):([\w\/]+)$/;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' onmouseenter='myslide=this' onmouseleave='myslide=null' row='${frame.style.row}' style='background-image:var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:top left;background-size:88px 40px,cover;' >`);
    pages.push(1);
    let boardid = `board${id}`;
    let boardname = frame.boardname;
    let edit_contents = this.to_edit_contents(boardid,boardname);
    all.push(`<div class='BOTTOMCONTAINER'>`);
    all.push(`<input class='EDITBUTTON' type='checkbox'></input>`);
    all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' width='441' height='320'></canvas>`);
    all.push(`<form class='EDITFORM' action='/echo' method='post' onsubmit='board_submit(this,"${boardid}","${boardname}")'> ${edit_contents} </form>`);
    all.push(`<div class='PAGENUM'> / </div>`);
    all.push(`</div>`);
    all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
    all.push(`<h1 style='${slidetitle_css}'>${order} <a href='#frame${parentid}'>${icon}</a> <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    toc.push({id,order,icon,style:frame.style,title:frame.title,posticon:'',issub})
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    all.push(`<ul style='${itemize_css}; list-style:none; padding:0;'>`);
    frame.solutions.forEach((o,i,arr) => {
      if((v=re_choice.exec(o.title))!==null){
        all.push(`<li style='${li_css}'> ${this.icon_solution} <i>${this.uncode(o.style,v[1])}</i> </li>`);
        let text = this.to_choice(o.style,o.body);
        all.push(text);
      }else{
        all.push(`<li style='${li_css}'> ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> </li>`);
      }
    });
    all.push(`</ul>`);
    if(frame.solutions.length==0){
      all.pop();
      all.pop();
    }
    all.push('</article>');
    all.push('');
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      let title_css = this.css('SLIDETITLE');
      let subtitle_css = this.css('SLIDESUBTITLE');
      all.push(`<article class='SLIDE' id='frame${id}a${i}' onmouseenter='myslide=this' onmouseleave='myslide=null' row='${o.style.row}' style='background-image:var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:top left;background-size:88px 40px,cover;' >`);
      pages.push(1);
      let boardid = `board${id}a${i}`;
      let boardname = '';//empty imgs
      let edit_contents = this.to_edit_contents(boardid,boardname);
      all.push(`<div class='BOTTOMCONTAINER'>`);
      all.push(`<input class='EDITBUTTON' type='checkbox'></input>`);
      all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' width='441' height='320'></canvas>`);
      all.push(`<div class='EDITFORM'> ${edit_contents} </div>`);
      all.push(`<div class='PAGENUM'> / </div>`);
      all.push(`</div>`);
      all.push(`<div class='SIDECONTAINER'><img width='88' height='360' style='content:var(--side${id})' usemap='#map${id}' /></div>`);
      all.push(`<h1 style='${title_css}'> &#160; </h1>`);
      if((v=re_choice.exec(o.title))!==null){
        let icon = this.icon_solution;
        let title = this.uncode(o.style,v[1]);
        let text = this.to_choice(o.style,o.body,v[2])
        all.push(`<h2 style='${subtitle_css}'> ${icon} ${title} &#160; ${text} </h2>`)
      }else{
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.untext(o.style,o.body).trim();
        all.push(`<h2 style='${subtitle_css}'> ${icon} ${title} &#160; ${text} </h2>`)
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
    <div style='${this.css('FRONTMATTERTITLE')}' >${this.uncode(style,title)}</div>
    <div style='${this.css('FRONTMATTERSUBTITLE')}' >${this.uncode(style,subtitle)}</div>
    <div style='${this.css('FRONTMATTERINSTITUTE')}' >${this.uncode(style,institute)}</div>
    <div style='${this.css('FRONTMATTERAUTHOR')}' >${this.uncode(style,author)}</div>
    <div style='${this.css('FRONTMATTERDATE')}' >${this.uncode(style,date)}</div>
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
    all.push(`<ul style='list-style:none; padding:0;'>`);
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
  to_sidesvg_for_id(id,toc,max_n=32){
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
    let imgid = boardid + "-img";
    let imgsrc = boardname ? `${boardname}.png` : '';
    return `\
       <select name='${boardid}' onchange='select_change_line(this.value,this.name)'>
          <optgroup label='Pencil'>
           <option value='line/1.0'>Light Pencil</option>
           <option value='line/2.0'>Med Pencil</option>
           <option value='line/4'>Heavy Pencil</option>
          </optgroup>
          <optgroup label='Smudge'>
           <option value='smudge/1.0'>Light Smudge</option>
           <option value='smudge/2.5'>Med Smudge</option>
           <option value='smudge/4'>Heavy Smudge</option>
          </optgroup>
          <optgroup label='Erasers'>
            <option value='eraser/1.0'>Light Eraser</option>
            <option value='eraser/2.0'>Med Eraser</option>
            <option value='eraser/4'>Heavy Eraser</option>
            <option value='eraser/0'>Clear All</option>
         </optgroup>
       </select>
       <select name='${boardid}' onchange='select_change_color(this.value,this.name)'>
           <option value='DarkSlateBlue'>DarkSlateBlue</option>
           <option value='OrangeRed'>OrangeRed</option>
           <option value='RoyalBlue'>RoyalBlue</option>
           <option value='Teal'>Teal</option>
           <option value='Maroon'>Maroon</option>
           <option value='SeaGreen'>SeaGreen</option>
           <option value='Peru'>Peru</option>
       </select>
       <textarea class='EDITDATAURI' name='textarea' style='display:none'> </textarea>
       <textarea class='EDITFILENAME' name='filename' style='display:none'> </textarea>
       <button type='button' onclick='board_load_png("${boardid}")'>Undo</button>
       <button>Save</button>
       <img id='${imgid}' src='${imgsrc}' style='display:none'/>
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
    function setup(){
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
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        var type = canvas.getAttribute('data-type');
        if(type=='ball'){
          ball_setup_canvas(canvas);
        }else if(type=='board'){
          board_setup_canvas(canvas);
        }
      }
      //draw_canvas();
    }
    function board_setup_canvas(canvas){
      //canvas.style.cursor = 'crosshair';
      var ctx = canvas.getContext("2d");
      ctx.d = {};
      canvas.addEventListener("mousedown",  board_onmousedown,  false);
      canvas.addEventListener("mousemove",  board_onmousemove,  false);
      canvas.addEventListener("mouseup",    board_onmouseup,    false);
      canvas.addEventListener("mouseenter", board_onmouseenter, false);
      canvas.addEventListener("mouseleave", board_onmouseleave, false);
      canvas.addEventListener("touchstart", board_ontouchstart, false);
      canvas.addEventListener("touchmove",  board_ontouchmove,  false);
      canvas.addEventListener("touchend",   board_ontouchend,   false);
      canvas.addEventListener("touchcancel",board_ontouchcancel,false);
      ctx.d.myrgbs = allrgbs;
      ctx.d.myop = 'line';
      ctx.d.myline = 1.0;
      ctx.d.mycolor = 'DarkSlateBlue';
      ctx.d.mysmear = ctx.d.myrgbs['DarkSlateBlue'];
      ctx.d.mysave = [];
      var boardid = canvas.getAttribute("id");
      var imgid = boardid + "-img";
      var img = document.getElementById(imgid);
      if(img){
        ctx.drawImage(img,0,0);
      }
    }
    function board_draw_canvas(canvas){
    }
    function board_onmousedown(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      ctx.d.myposx0 = (evt.clientX-canvas.getBoundingClientRect().x)*sx;
      ctx.d.myposy0 = (evt.clientY-canvas.getBoundingClientRect().y)*sy;
      ctx.d.myposx1 = ctx.d.myposx0;
      ctx.d.myposy1 = ctx.d.myposy0;
      ctx.d.myposx2 = ctx.d.myposx1;
      ctx.d.myposy2 = ctx.d.myposy1;
      var mycursor = getComputedStyle(canvas).getPropertyValue('--mycursor');
      var mysave = ctx.getImageData(0,0, 441,320);
      ctx.d.mysave.push(mysave);
      if(mycursor.length){
        ctx.d.mymouseisdown = 1;
        if(ctx.d.myop=='select'){
          //board_draw_select(evt,ctx,canvas,true);
        }else{
          //board_draw_dot(evt,ctx,canvas,true);
        }
      }
    }
    function board_onmousemove(evt){
      mycanvas = evt.target;
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      ctx.d.myposx1 = ctx.d.myposx2;
      ctx.d.myposy1 = ctx.d.myposy2;
      ctx.d.myposx2 = (evt.clientX-canvas.getBoundingClientRect().x)*sx;
      ctx.d.myposy2 = (evt.clientY-canvas.getBoundingClientRect().y)*sy;
      if(ctx.d.mymouseisdown){
        if(ctx.d.myop=='select'){
          //board_draw_select(evt,ctx,canvas,false);
        }else{
          board_draw_dot(evt,ctx,canvas,false);
        }
      }
    }
    function board_onmouseup(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.d.mymouseisdown = 0;
    }
    function board_onmouseenter(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.d.mymouseisdown = 0;
    }
    function board_onmouseleave(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.d.mymouseisdown = 0;
    }
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
    function draw_between(myposx0,myposy0,myposx,myposy,lw,ctx){
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
    function smudge_between(myposx0,myposy0,myposx,myposy,lw,mysmear,ctx){
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
        smudgeRect(x-(lw/2),y-(lw/2),lw,lw,mysmear,ctx);
      }
    }
    function smudgeRect(x,y,w,h,mysmear,ctx){
      var idata = ctx.getImageData(x,y,w,h);
      const cutoff = 127;
      for(let i=0; i < idata.data.length; i+=4){
        if(idata.data[i+3] <= cutoff){
          let rand = Math.random();
          idata.data[i+0] = idata.data[i+0]*0.5 + rand*mysmear[0]*0.5;
          idata.data[i+1] = idata.data[i+1]*0.5 + rand*mysmear[1]*0.5;
          idata.data[i+2] = idata.data[i+2]*0.5 + rand*mysmear[2]*0.5;
          idata.data[i+3] = idata.data[i+3]*0.5 + rand*cutoff*0.5;
        }
      }
      ctx.putImageData(idata,x,y);
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_draw_select(evt,ctx,canvas,first){
      ctx.save();
      ctx.globalCompositeOperation='difference';
      ctx.fillStyle = 'white';
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      let myposx0 = ctx.d.myposx0;
      let myposy0 = ctx.d.myposy0;
      let myposx1 = ctx.d.myposx1;
      let myposy1 = ctx.d.myposy1;
      let myposx2 = ctx.d.myposx2;
      let myposy2 = ctx.d.myposy2;
      if(first){
        ctx.fillRect(100,100,200,150);
        //ctx.fillRect(myposx0,myposy0,myposx1-myposx0,myposy1-myposy0);
      }else{
        ctx.fillRect(myposx0,myposy0,myposx1-myposx0,myposy1-myposy0);
        ctx.fillRect(myposx0,myposy0,myposx2-myposx0,myposy2-myposy0);
      }
      console.log('james','board_draw_select');
      ctx.restore();
    }
    function board_draw_dot(evt,ctx,canvas,first){
      let myposx1 = ctx.d.myposx1;
      let myposy1 = ctx.d.myposy1;
      let myposx2 = ctx.d.myposx2;
      let myposy2 = ctx.d.myposy2;
      let mysmear = ctx.d.mysmear;
      let mycolor = ctx.d.mycolor;
      let myline  = ctx.d.myline;
      let myop    = ctx.d.myop;
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      if(1){
        if(evt.altKey || myop == 'eraser'){
          ///ERASER
          if(myline==0){
            ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
          }else{
            var lw = 3*myline*sx;
            if(first){
              ctx.clearRect(myposx2-(lw/2),myposy2-(lw/2),lw,lw);
            }else{
              erase_between(myposx1,myposy1,myposx2,myposy2,lw,ctx);
            }
          }
        }else if(evt.shiftKey || myop == 'smudge'){
          ///SMUDGE
          var lw = myline*sx;
          var idata = ctx.getImageData(myposx2-(lw/2),myposy2-(lw/2),lw,lw);
          if(first){
            smudgeRect(myposx2-(lw/2),myposy2-(lw/2),lw,lw,mysmear,ctx);
          }else{
            smudge_between(myposx1,myposy1,myposx2,myposy2,lw,mysmear,ctx);
          }
        }else if(myop == 'line'){
          ///PENCIL
          var lw = myline*sx;
          ctx.fillStyle = mycolor;
          if(first){
            ctx.fillRect(myposx2-(lw/2),myposy2-(lw/2),lw,lw);
          }else{
            draw_between(myposx1,myposy1,myposx2,myposy2,lw,ctx);
          }
        }
      }
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_ontouchstart(evt) {
      evt.preventDefault();
      var el = evt.target;                             
      var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        board_draw_dot(touches[i],ctx,el,true);
      }
    }
    function board_ontouchmove(evt) {
      evt.preventDefault();
      var el = evt.target;                            
      var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        board_draw_dot(touches[i],ctx,el,false);
      }
    }
    function board_ontouchend(evt) {
      evt.preventDefault();
    }
    function board_ontouchcancel(evt) {
      evt.preventDefault();
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function select_change_color(value,name){
      var canvas = document.getElementById(name);
      if(canvas && canvas.getAttribute("data-type")=='board'){
        var ctx = canvas.getContext("2d");
        ctx.d.mycolor = value;
        ctx.d.mysmear = ctx.d.myrgbs[value];
      }
    }
    function select_change_line(value,name){
      var canvas = document.getElementById(name);
      if(canvas && canvas.getAttribute("data-type")=='board'){
        var ctx = canvas.getContext("2d");
        var ss = value.split('/');
        ctx.d.myop = ss[0];
        ctx.d.myline = ss[1];
      }
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function ball_setup_canvas(canvas){
      canvas.style.cursor = 'pointer';
      var ctx = canvas.getContext('2d');
      var json = canvas.getAttribute('data-json');
      if(json){
        //only setup this canvas if it has a 'json' attribute
        var balls = JSON.parse(json);
        console.log('balls',balls);
        ctx.font = "40px Arial";
        ctx.lineWidth = 4;//px
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.fillStyle = "green";
        ctx.fillText('Hello canvas!',100,100);
        canvas.addEventListener("mousedown",  ball_onmousedown,  false);
        canvas.addEventListener("mouseup",    ball_onmouseup,    false);
        canvas.addEventListener("mousemove",  ball_onmousemove,  false);
        ctx.d = {};
        ctx.d.dirty = 1;
        ctx.d.balls = balls;
        ctx.d.currmousex = -1;
        ctx.d.currmousey = -1;
        ctx.d.hitball = null;//the ball being hit the last time
        ctx.d.downball = null;//the current ball being pressed down
        ctx.d.hitcorner = -1;// the corner last hit by the mouse
        ctx.d.downcorner = -1;//the index for the corner that is down
        ctx.d.showmode = 0;//0=corners,1=centroid
        ctx.d.rotateflag = 0;
        ctx.d.moveflag = 0;
        ctx.d.insideflag = 0;
        ctx.d.movedistx = 0;
        ctx.d.movedisty = 0;
        ctx.d.downmousex = 0;
        ctx.d.downmousey = 0;
        ctx.d.initmousex = 0;
        ctx.d.initmousey = 0;
        ctx.d.rotateangle = 0;
        ctx.d.rotatex0 = 0;
        ctx.d.rotatey0 = 0;
      }
    }
    function draw_canvas(timestamp){
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        var type = canvas.getAttribute('data-type');
        if(type=='ball'){
          ball_draw_canvas(canvas);
        }else if(type=='board'){
          board_draw_canvas(canvas);
        }
      }
      requestAnimationFrame(draw_canvas);
    }
    function ball_draw_canvas(canvas){
      var ctx = canvas.getContext('2d');
      if(ctx && ctx.d && ctx.d.dirty){
        ctx.d.dirty = 0;
        ctx.clearRect(0,0,500,500);
        ctx.d.hitball = null;
        ctx.d.balls.forEach((ball) => {
          ctx.save();
          let [a,b,c,d,e,f] = ball.transform;
          ctx.setTransform(a,b,c,d,e,f);
          if(ctx.d.rotateflag && ball == ctx.d.downball){
            ctx.translate(ctx.d.rotatex0,ctx.d.rotatey0);
            ctx.rotate(ctx.d.rotateangle);
            ctx.translate(-ctx.d.rotatex0,-ctx.d.rotatey0);
          }else if(ctx.d.moveflag && ball == ctx.d.downball){
            let matrix = ctx.getTransform();
            let a = matrix.a;
            let b = matrix.b;
            let c = matrix.c;
            let d = matrix.d;
            let e = matrix.e;
            let f = matrix.f;
            ctx.setTransform(1,0,0,1,0,0);
            ctx.translate(ctx.d.movedistx,ctx.d.movedisty);
            ctx.transform(a,b,c,d,e,f);
          }
          ctx.beginPath();
          ball.points.forEach((pt) => {
            let {op,x,y,cp1x,cp1y,cp2x,cp2y,x1,y1,x2,y2,r,ry,sAngle,eAngle,anticlockflag} = pt;
            switch(op){
              case 'M':
                ctx.moveTo(x1,y1);
                break;
              case 'L':
                ctx.lineTo(x1,y1);
                break;
              case 'A':
                ctx.arcTo(x1,y1,x2,y2,r);
                break;
              case 'a':
                ctx.arc(x1,y1,r,sAngle,eAngle,anticlockflag);
                break;
              case 'e':
                var rotation = 0;
                ctx.ellipse(x1,y1,r,ry,rotation,sAngle,eAngle,anticlockflag);
                break;
              case 'z':
                ctx.closePath();
                break;
            }
          });
          if(1||ball.type=='line'||ball.type=='polyline'){
            var hitflag = ctx.isPointInStroke(ctx.d.currmousex,ctx.d.currmousey);
          }else{
            var hitflag = ctx.isPointInPath(ctx.d.currmousex,ctx.d.currmousey);
          }
          if(hitflag){
            ctx.d.hitball = ball;
          }
          if(hitflag){
            ctx.strokeStyle = 'blue';
            ctx.stroke();
          }else if(ctx.d.downball===ball){
            ctx.strokeStyle = 'blue';
            ctx.stroke();
          }else{
            ctx.stroke();
          }
          if(ctx.d.downball===ball){
            ball_draw_canvas_corners(ctx,ball);
          }
          ctx.restore();
        });
      }
    }
    function ball_draw_canvas_corners(ctx,ball){
      ctx.save();
      ctx.d.hitcorner = -1;
      ball.points.forEach((pt,i) => {
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        let {op,x,y,cp1x,cp1y,cp2x,cp2y,x1,y1,x2,y2,r} = pt;
        switch(op){
          case 'z':
            break;
          default:
            ctx.rect(x-5,y-5,10,10);
            break;
        }
        let hitflag = ctx.isPointInPath(ctx.d.currmousex,ctx.d.currmousey);
        if(hitflag){
          ctx.d.hitcorner = i;
        }
        if(hitflag){
          ctx.lineWidth = '2';
        }
        if(ctx.d.downcorner >= 0 && ctx.d.downcorner == i){
          ctx.fillStyle = 'red';
        }
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    }
    function ball_onmousemove(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext('2d');
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      ctx.d.dirty = 1;
      ctx.d.currmousex = evt.offsetX*sx;
      ctx.d.currmousey = evt.offsetY*sy
      if(ctx.d.rotateflag){
        let angle0 = Math.atan2(ctx.d.initmousey-ctx.d.downmousey,ctx.d.initmousex-ctx.d.downmousex);
        let angle1 = Math.atan2(ctx.d.currmousey-ctx.d.downmousey,ctx.d.currmousex-ctx.d.downmousex);
        ctx.d.rotateangle = angle1-angle0;
      }else if(ctx.d.moveflag){
        ctx.d.movedistx = ctx.d.currmousex - ctx.d.initmousex;
        ctx.d.movedisty = ctx.d.currmousey - ctx.d.initmousey;
      }
    }
    function ball_onmousedown(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext('2d');
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      ctx.d.dirty = 1;
      ctx.d.currmousex = evt.offsetX*sx;
      ctx.d.currmousey = evt.offsetY*sy;
      ///check for switching to a new ball
      if(ctx.d.hitball && ctx.d.downball && ctx.d.hitball != ctx.d.downball){
        ctx.d.downball = ctx.d.hitball;
        ctx.d.hitcorner = -1;
        ctx.d.downcorner = -1;
      } else if(ctx.d.hitball && !ctx.d.downball && ctx.d.hitball != ctx.d.downball){
        ctx.d.downball = ctx.d.hitball;
        ctx.d.hitcorner = -1;
        ctx.d.downcorner = -1;
      }
      ///check for corners of existing ball
      if(ctx.d.downball && ctx.d.downcorner >= 0 && ctx.d.downcorner != ctx.d.hitcorner){
        //start rotate
        ctx.d.rotateflag = 1;
        ctx.d.rotateangle = 0;
        let [x0,y0] = getBallPointXY(ctx.d.downball,ctx.d.downcorner);
        ctx.d.rotatex0 = x0;
        ctx.d.rotatey0 = y0;
        ctx.d.initmousex = evt.offsetX*sx;
        ctx.d.initmousey = evt.offsetY*sy;
      }else if(ctx.d.downball && ctx.d.hitball && ctx.d.downball == ctx.d.hitball){
        //start move
        ctx.d.moveflag = 1;
        ctx.d.movedistx = 0;
        ctx.d.movedisty = 0;
        ctx.d.initmousex = evt.offsetX*sx;
        ctx.d.initmousey = evt.offsetY*sy;
      }else if(ctx.d.downball && ctx.d.hitcorner >= 0){
        ctx.d.insideflag = 1;
        ctx.d.initmousex = evt.offsetX*sx;
        ctx.d.initmousey = evt.offsetY*sy;
        ctx.d.rotateflag = 0;
        ctx.d.moveflag = 0;
      }else{
        ctx.d.initmousex = evt.offsetX*sx;
        ctx.d.initmousey = evt.offsetY*sy;
        ctx.d.rotateflag = 0;
        ctx.d.moveflag = 0;
      }
    }
    function ball_onmouseup(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext('2d');
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      ctx.d.dirty = 1;
      ctx.d.currmousex = evt.offsetX*sx;
      ctx.d.currmousey = evt.offsetY*sy;
      if(ctx.d.rotateflag && ctx.d.rotateangle != 0){
        ctx.save();
        let [a,b,c,d,e,f] = ctx.d.downball.transform;
        ctx.setTransform(a,b,c,d,e,f);
        ctx.translate(ctx.d.rotatex0,ctx.d.rotatey0);
        ctx.rotate(ctx.d.rotateangle);
        ctx.translate(-ctx.d.rotatex0,-ctx.d.rotatey0);
        if(1){
          let matrix = ctx.getTransform();
          let {a,b,c,d,e,f} = matrix;
          ctx.d.downball.transform = [a,b,c,d,e,f];
        }
        ctx.restore();
        ctx.d.rotateflag = 0;
      }else if(ctx.d.moveflag && (ctx.d.movedistx != 0 || ctx.d.movedisty != 0)){
        ctx.save();
        let [a,b,c,d,e,f] = ctx.d.downball.transform;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.translate(ctx.d.movedistx,ctx.d.movedisty);
        ctx.transform(a,b,c,d,e,f);
        if(1){
          let matrix = ctx.getTransform();
          let {a,b,c,d,e,f} = matrix;
          ctx.d.downball.transform = [a,b,c,d,e,f];
        }
        ctx.restore();
        ctx.d.moveflag = 0;
      }else if(ctx.d.downball && ctx.d.hitcorner >= 0){
        ctx.d.downcorner = ctx.d.hitcorner;
        ctx.d.downmousex = evt.offsetX*sx;
        ctx.d.downmousey = evt.offsetY*sy;
      }else if(ctx.d.insideflag){
        ctx.d.insideflag = 0;
        ctx.d.hitcorner = -1;
        ctx.d.downcorner = -1;
      }else{
        ctx.d.downball = ctx.d.hitball;
        ctx.d.hitcorner = -1;
        ctx.d.downcorner = -1;
      }
      ctx.d.rotateflag = 0;
      ctx.d.moveflag = 0;
    }
    function getBallPointXY(ball,corner){
      let theball1;
      let x, y;
      x = ball.points[corner].x;
      y = ball.points[corner].y;
      return [x,y];
    }
    function board_load_png(boardid){
      var imgid = boardid + "-img";
      var img = document.getElementById(imgid);
      let canvas = document.getElementById(boardid);
      let ctx = canvas.getContext("2d");
      if(ctx.d.mysave.length){
        let mysave = ctx.d.mysave.pop();
        ctx.clearRect(0,0,441,320);
        ctx.putImageData(mysave,0,0);
      }
    }
    function __board_save_png__(boardid){
      console.log('james','borad_save_png',boardid);
      let downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', 'CanvasAsImage.png');
      let canvas = document.getElementById(boardid);
      let dataURL = canvas.toDataURL('image/png');
      let url = dataURL.replace(/^data:image\\/png/,'data:application/octet-stream');
      console.log('james','url=',url);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    }
    function board_submit(form,boardid,boardname){
      let canvas = document.getElementById(boardid);
      let dataURL = canvas.toDataURL('image/png');
      var textarea = form.querySelector('textarea.EDITDATAURI');
      var filename = form.querySelector('textarea.EDITFILENAME');
      var imgsrc = boardname ? boardname+'.png' : '';
      textarea.value = dataURL;
      filename.value = imgsrc;
    }
    `;
  }
}
module.exports = { NitrilePreviewFlowerpot };
