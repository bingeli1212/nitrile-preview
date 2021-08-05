'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewFlowerpot extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.name = 'slide';
    this.presentation = new NitrilePreviewPresentation(this);
    this.icon_subpoint = '&#x261E;'//WHITE RIGHT POINTING INDEX
    this.icon_solution = '&#x270D;'//WRITING HAND
    this.icon_folder = '&#x2668;'//HOT SPRING  
    this.uchar_checkboxo = '&#x2610;' //BALLOT BOX            
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.uchar_checkboxx = '&#x2612;' //BALLOT BOX WITH X
    this.n_para = '6pt';
    this.n_pack = '1.0pt';
    this.n_half = '2.25pt';
    this.n_marginleft = '105px';
    this.n_marginright = '30px';
    this.slide_width = 140;//mm
    this.slide_height = 106;//mm
    this.vw = Math.round(140*this.MM_to_PX);//529
    this.vh = Math.round(106*this.MM_to_PX);//400
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
      let s = this.to_sidesvg_for_id(p.id,toc);
      s = encodeURIComponent(s);
      s = `      --side${p.id}: url("data:image/svg+xml,${s}");`;
      allsidesvgs.push(s);
    })
    // background-repeat: no-repeat, no-repeat, no-repeat;
    // background-position: top left, top left, top left;
    // background-size: 88px 40px, 80px 400px, cover;
    var canvas_script = this.to_canvas_script();
    var trigger_stylesheet = this.to_trigger_stylesheet();
    var main_stylesheet = `\
    :root {
      --logosvg: url("image-slide.png");
      --bgsvg: url("data:image/svg+xml,${encodeURIComponent(this.bgsvg)}");
      --bgsvg0: url("data:image/svg+xml,${encodeURIComponent(this.bgsvg0)}");
      --totalpagenum: "${totalpagenum}";
    }

    :root {
${allsidesvgs.join('\n')}
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
    .PAGENUM::before {
      counter-increment: pagenum;
      content: counter(pagenum);
    }
    .PAGENUM::after {
      content: var(--totalpagenum);
    }
    .PAGENUMCONTAINER {
      position: absolute;
      top: 360px;
      left: 88px;
      bottom: 0px;
      right: 20px;
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      align-items: center;
      font-size: 1.2em;
      font-weight: bold;
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
      }

      body {
        margin:0;
        padding:0;
        font-family: serif;
        font-size: 10pt;
        line-height: 1.15;
      }

      figure * {
        font-family: serif;
        font-size: 10pt;
        line-height: 1.15;
      }
    }
  
    @media screen {
  
      .SLIDE {
        color: #124A47;
        position: relative;
        outline: 1px solid #124A47;
        margin: 1em auto;
        min-width:140mm;
        max-width:140mm;
        min-height:106mm;
        max-height:106mm;
        box-sizing:border-box;
        overflow: hidden;
        padding:1px 0;
      }
  
      body {
        background-color: lightgray;
        box-sizing:border-box;
        font-family: serif;
        font-size: 10pt;
        line-height: 1.15;
        padding:1px 0;
      }

      figure * {
        font-family: serif;
        font-size: 10pt;
        line-height: 1.15;
      }

    }
    `
    var xhtmldata = `\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<link href='style.css' rel='stylesheet' type='text/css'/>
<style>
${trigger_stylesheet}
${main_stylesheet}
</style>
</head>
<body>
<script>
//<![CDATA[
${canvas_script}
//]]>
</script>
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
          let out = this.write_one_frame(id,order,icon,subframe,1,toc,pages);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = i+1;
        let icon = '';
        let out = this.write_one_frame(id,order,icon,topframe,0,toc,pages);
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
        pages.push(1);
        all.push(`<div class='PAGENUMCONTAINER'><div class='PAGENUM'> / </div></div>`);
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
    all.push(`<article class='SLIDE' id='frame${id}' row='${frame.style.row}' style='background-image:var(--logosvg),var(--side${id}),var(--bgsvg);background-repeat:no-repeat;background-position:top left;background-size:88px 40px,88px 400px,cover;' >`);
    pages.push(1);
    all.push(`<div class='PAGENUMCONTAINER'><div class='PAGENUM'> / </div></div>`);
    all.push(`<h1 style='${slidetitle_css}'> ${id} <b>${this.uncode(frame.style,frame.title)}</b> ${this.icon_folder} </h1>`);
    toc.push({id,order:id,icon:'',style:frame.style,title:frame.title})
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
  write_one_frame(id,order,icon,frame,issub,toc,pages){
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
    all.push(`<article class='SLIDE' id='frame${id}' row='${frame.style.row}' style='background-image:var(--logosvg),var(--side${id}),var(--bgsvg);background-repeat:no-repeat;background-position:top left;background-size:88px 40px,88px 400px,cover;' >`);
    pages.push(1);
    all.push(`<div class='PAGENUMCONTAINER'><div class='PAGENUM'> / </div></div>`);
    all.push(`<h1 style='${slidetitle_css}'>${order} ${icon} <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    toc.push({id,order,icon,style:frame.style,title:frame.title})
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
      all.push(`<article class='SLIDE' row='${o.style.row}' style='background-image:var(--logosvg),var(--bgsvg);background-repeat:no-repeat;background-position:top left;background-size:88px 40px,cover;' >`);
      pages.push(1);
      all.push(`<div class='PAGENUMCONTAINER'><div class='PAGENUM'> / </div></div>`);
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
    <div class='PAGENUMCONTAINER'><div class='PAGENUM'> / </div></div>
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
  to_side_svg(toc){
    var all = [];
    all.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 400">`);
    toc.forEach((p,j) => {
      all.push(`<text x="5" y="60" dy="${j*12}" stroke="none" fill="#124A47" font-size="5pt" >${p.order} ${p.icon} ${this.smooth(p.title)}</text>`)
    })
    all.push(`</svg>`);
    return all.join('\n') 
  }
  to_sidesvg_for_id(id,toc){
    var all = [];
    var where_j = 0;
    // all.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 400">`);
    // all.push(`<svg y="${dy}">`)
    toc.forEach((p,j) => {
      if(p.id==id){
        where_j = j;
        all.push(`<rect x="0" y="${60+j*12}" width="88" height="12" transform="translate(0,2.4) translate(0,-12)" stroke="none" fill="#124A47"/>`);
        all.push(`<text id="svg${p.id}" x="5" y="${60+j*12}" stroke="none" fill="#DDEEFF" font-size="5pt" >${p.order} ${p.icon} ${this.smooth(p.title)}</text>`)
      }else{
        all.push(`<text id="svg${p.id}" x="5" y="${60+j*12}" stroke="none" fill="#124A47" font-size="5pt" >${p.order} ${p.icon} ${this.smooth(p.title)}</text>`)
      }
    })
    var text = all.join('\n');
    if(where_j > 26){
      let dj = where_j - 26;
      text = (`<svg y="${-dj*12}"> ${text} </svg>`);
    }
    text = (`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 400"> ${text} </svg>`);
    return text
  }
}
module.exports = { NitrilePreviewFlowerpot };
