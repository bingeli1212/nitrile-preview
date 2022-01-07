'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewDiagramBall } = require('./nitrile-preview-diagram-ball');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.name = 'slide';
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
  margin-left:  9mm;
  margin-right: 9mm;
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
.PART, .CHAPTER, .SECTION, .SUBSECTION, .SUBSUBSECTION, .PRIMARY {
  clear: both;
}

.TITLE {
  margin-left:10px;
  margin-right:10px;
  margin-top:1mm;
  margin-bottom:0;
  font-size:1.30em;
  font-weight:bold;
  color: #1010B0;
  hyphens: auto;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  -o-hyphens: auto;
  word-break:break-word;
}
.SUBTITLE {
  margin-left:10px;
  margin-right:10px;
  margin-top:0;
  margin-bottom:0;
  font-size:0.8em;
  font-weight:normal;
  color: #1010B0;
  hyphens: auto;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  -o-hyphens: auto;
  word-break:break-word;
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
    var presentation = new NitrilePreviewPresentation();
    let top = presentation.to_top(this.parser.blocks);
    ///
    ///
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,i,arr) => {
      let topframe = presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          ///note that each subsection is just a 'blocks'
          let subframe = presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let out = this.write_frame_folder(`${i+1}`,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,j) => {
          let id = `${i+1}.${j+1}`;
          let order = `${i+1}.${j+1}`;
          let out = this.write_one_frame(id,order,subframe,1,topframe);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = i+1;
        let out = this.write_one_frame(id,order,topframe,0,topframe);
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
      if(n==0){
        all.push(`<article data-row='0' class='SLIDE'>`);
        all.push(`<h1 class='TITLE'      > <b>Table Of Contents</b> </h1>`);
        all.push(`<div class='PARAGRAPH'       >`)
        all.push(`<ul class='PARA OL' style='padding-left:2.0em;list-style-type:none;position:relative;' >`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let order = j+1;
      all.push(`<li class='PACK LI' style='--bull:"${order}";--pad:-2.0em;' > <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> </li>`);
      n++;
    });
    all.push(`</ul>`);
    all.push('</div>')
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_frame_folder(id,frame,subframes){
    let all = [];
    let boardpng = frame.boardname?`${frame.boardname}.png`:``;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' data-row='${frame.style.row}' style='position:relative;' >`);
    if(boardpng){
      var imgsrc = boardpng;
      var {imgsrc, imgid} = this.to_request_image(imgsrc);
      all.push(`<img src='${imgsrc}' id='${imgid}' alt='' width='${114*this.MM_TO_PX}' height='${80*this.MM_TO_PX}' style='position:absolute;left:9mm;top:10mm;' />`)
    }
    all.push(`<h1 class='TITLE'> ${id} <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    all.push(`<h2 class='SUBTITLE'> &#160; </h2>`);
    if(1){
      frame.contents.forEach((x) => {
        ///'x' is a block
        let html = this.translate_block(x);
        all.push('');
        all.push(html.trim());
      })
      // FONT
      all.push(`<div class='ITEMIZE' >`)
      subframes.forEach((subframe,j,arr) => {
        if(j==0){
          all.push(`<ul class='PARA UL' style='list-style:none;padding-left:2em;position:relative;'>`);
        }
        //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
        //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${this.icon_folder}</span>`;
        let icon = this.icon_folder;
        all.push(`<li class='PACK LI' style='position:relative;font-style:oblique;--bull:"";'> ${icon} <b> <a href='#frame${id}.${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </b> </li>`);
        if(j+1==arr.length){
          all.push(`</ul>`);
        }
      });
      all.push(`</div>`);
      all.push('</article>');
      all.push('');
    }
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  write_one_frame(id,order,frame,issub,topframe){
    let icon = this.icon_folder;
    let all = [];
    let boardpng = frame.boardname?`${frame.boardname}.png`:``;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' data-row='${frame.style.row}' style='position:relative;' >`);
    if(boardpng){
      var imgsrc = boardpng;
      var {imgsrc, imgid} = this.to_request_image(imgsrc);
      all.push(`<img src='${imgsrc}' id='${imgid}' alt='' width='${114*this.MM_TO_PX}' height='${80*this.MM_TO_PX}' style='position:absolute;left:9mm;top:10mm;' />`)
    }
    if(issub){
      all.push(`<h1 class='TITLE'> ${order} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='SUBTITLE'> ${icon} <i>${this.uncode(frame.style,frame.title)}</i> </h2>`);
    }else{
      all.push(`<h1 class='TITLE'> ${order} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='SUBTITLE'> &#160; </h2>`);
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
        all.push(`<div class='PARAGRAPH'> ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> ${text} </div>`);
      }else{
        all.push(`<div class='PARAGRAPH'> ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> </div>`);
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
      all.push(`<article class='SLIDE' data-row='${o.style.row}'>`);
      all.push(`<h1 class='TITLE'> &#160; </h1>`);
      if(o.choice){
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice).trim();
        let row = o.style.row;
        all.push(`<h2 class='SUBTITLE' data-row='${row}' > ${icon} <i> ${title} </i> &#160; ${text} </h2>`)
      }else{
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.untext(o.style,o.body).trim();
        let row = o.style.row;
        all.push(`<h2 class='SUBTITLE' data-row='${row}' > ${icon} <i> ${title} </i> &#160; ${text} </h2>`)
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
    let data = `<article data-row='0' class='SLIDE'>
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
