'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
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
    this.n_para = '6pt';
    this.n_pack = '1.0pt';
    this.n_half = '2.25pt';
    this.n_marginleft = '8mm';
    this.n_marginright = '8mm';
    this.slide_width = 128;//mm
    this.slide_height = 96;//mm
    this.css_map = this.to_css_map();
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
        'margin-left:10px',
        'margin-right:10px',
        'margin-top:2mm',
        'margin-bottom:0',
        'font-size:1.40em',
        'font-weight:normal',
        'color: #1010B0'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'SLIDESUBTITLE', [
        'margin-left:10px',
        'margin-right:10px',
        'margin-top:3mm',
        'margin-bottom:0',
        'font-size:0.9em',
        'font-weight:normal',
        'color: #1010B0'
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
        'color: #1010B0',
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
  fence_to_dia(style,ss){
    var all = [];
    var o = this.diagram.to_diagram(style,ss);
    o = o.map((p) => {
      let s_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}" >${p.svgtext}</svg>`;
      var css = this.css('dia');
      if(style.frame){
        css += `; outline:1px solid currentColor`;
      }
      if(p.imgsrc){
        css += `; background-image:url("${p.imgsrc}"),url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}")`;
        if(style.fit=='contain'){
          css += `; background-size:contain,contain`;
        }else if(style.fit=='cover'){
          css += `; background-size:cover,contain`;
        }else{
          css += `; background-size:100% 100%,contain`;
        }
        css += `; background-position:center`;
        css += `; background-repeat:no-repeat`;
      }else{
        css += `; background-image:url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}")`;
        css += `; background-size:contain`;
        css += `; background-position:center`;
        css += `; background-repeat:no-repeat`;
      }
      if(!p.w){
        css += `; width:100%`;
        css += `; height:auto`;
      }
      p.img = (`<canvas style='${css}' data-type='board' width='${p.vw}' height='${p.vh}'></canvas>`);
      return p;
    });
    return o;
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
    var setup_script = this.to_setup_script();
    var trigger_stylesheet = this.to_trigger_stylesheet();
    var slide_stylesheet = `\
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
    @media print {

      @page {
        size: 128mm 96mm;
      }  
  
      .SLIDE {
        color: black;
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
        line-height: 1.15;
      }

      figure * {
        font-family: sans-serif;
        font-size: 10pt;
        line-height: 1.15;
      }
    }
  
    @media screen {
  
      .SLIDE {
        color: black;
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
        line-height: 1.15;
        padding:1px 0;
      }

      figure * {
        font-family: sans-serif;
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
${slide_stylesheet}
</style>
</head>
<body onload='setup()'>
<script>
//<![CDATA[
${setup_script}
//]]>
</script>
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
          let order = '';
          let icon = this.icon_folder;
          let out = this.write_one_frame(id,order,icon,subframe,1,`${i+1}`);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = i+1;
        let icon = '';
        let out = this.write_one_frame(id,order,icon,topframe,0,'');
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
      let slidetitle_css = this.css('SLIDETITLE');
      let paragraph_css = this.css('PARAGRAPH');
      let ul_css = this.css('PARA UL');
      let li_css = this.css('PACK');
      if(n==0){
        all.push(`<article row='0' class='SLIDE'>`);
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
  write_frame_folder(id,frame,subframes){
    let slidetitle_css = this.css('SLIDETITLE');
    let itemize_css = this.css('ITEMIZE');
    let paragraph_css = this.css('PARAGRAPH');
    let ul_css = this.css('PARA UL');
    let li_css = this.css('PACK LI');

    let all = [];
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' row='${frame.style.row}'>`);
    all.push(`<h1 style='${slidetitle_css}'> ${id} <b>${this.uncode(frame.style,frame.title)}</b> ${this.icon_folder} </h1>`);
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
      all.push(`<li style='${li_css}; position:relative'> ${icon} <b> <a href='#frame${id}.${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </b> </li>`);
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
  write_one_frame(id,order,icon,frame,issub,parentid){
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
    all.push(`<article class='SLIDE' id='frame${id}' row='${frame.style.row}'>`);
    all.push(`<h1 style='${slidetitle_css}'>${order} <a href='#frame${parentid}'>${icon}</a> <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
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
      all.push(`<article class='SLIDE' row='${o.style.row}'>`);
      all.push(`<h1 style='${title_css}'> &#160; </h1>`);
      if((v=re_choice.exec(o.title))!==null){
        let icon = this.icon_solution;
        let title = this.uncode(o.style,v[1]);
        let text = this.to_choice(o.style,o.body,v[2])
        all.push(`<h2 style='${subtitle_css}'> ${icon} <i> ${title} &#160; ${text} </i> </h2>`)
      }else{
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.untext(o.style,o.body).trim();
        all.push(`<h2 style='${subtitle_css}'> ${icon} <i> ${title} &#160; ${text} </i> </h2>`)
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
    <div style='${this.css('FRONTMATTERTITLE')}' >${this.uncode(style,title)}</div>
    <div style='${this.css('FRONTMATTERSUBTITLE')}' >${this.uncode(style,subtitle)}</div>
    <div style='${this.css('FRONTMATTERINSTITUTE')}' >${this.uncode(style,institute)}</div>
    <div style='${this.css('FRONTMATTERAUTHOR')}' >${this.uncode(style,author)}</div>
    <div style='${this.css('FRONTMATTERDATE')}' >${this.uncode(style,date)}</div>
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
}
module.exports = { NitrilePreviewSlide };
