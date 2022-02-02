'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewDiagramBall } = require('./nitrile-preview-diagram-ball');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

var stylesheet = `
:root {
  --titlecolor: #1010B0;
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
    padding:1px 10mm;
  }
  body {
    margin:0;
    padding:0;
    font-family: Verdana, sans-serif;
    letter-spacing: -0.03em;
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
    padding:1px 10mm;
  }
  body {
    background-color: gray;
    box-sizing:border-box;
    font-family: Verdana, sans-serif;
    letter-spacing: -0.03em;
    font-size: 10pt;
    line-height: 1.25;
    margin:0;
    padding:1px 0;
  }
}
`;

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
    this.add_css_map_entry(this.css_map,
      'TITLE', [
        'margin-left: -6mm',
        'margin-right: -6mm',
        'margin-top: 1mm',
        'margin-bottom: 0',
        'font-size:1.30em',
        'color: var(--titlecolor)'
      ]
    );
    this.add_css_map_entry(this.css_map,
      'TITLE2', [
        'margin-left: -6mm',
        'margin-right: -6mm',
        'margin-top: 0',
        'margin-bottom: 0',
        'font-size:0.8em',
        'color: var(--titlecolor)'
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
  }
  to_peek_document() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    return `${title_html}\n${html}`;
  }
  to_data() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    var body = `${title_html}\n${html}`;
    var script = '';
    var members = this.parser.members;
    return {stylesheet,script,body,members};
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
    var css_title = this.css('TITLE');
    var css_title2 = this.css('TITLE2');
    var css_ol = this.css('OL');
    topframes.forEach((topframe,j,arr) => {
      if(n==max_n){
        all.push(`</ul>`);
        all.push('</article>');
        all.push(''); 
        n=0;
      }
      if(n==0){
        all.push(`<article data-row='0' class='SLIDE'>`);
        all.push(`<h1 class='TITLE'  style='${css_title}' > Table Of Contents </h1>`);
        all.push(`<h2 class='TITLE2' style='${css_title2}' > &#160; </h2>`);
        all.push(`<ul class='OL'     style='${css_ol};padding-left:2.0em;list-style-type:none;position:relative;' >`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let order = j+1;
      all.push(`<li style='position:relative;' > <span style='position:absolute;left:-2.0em;' > ${order} </span> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </li>`);
      n++;
    });
    all.push(`</ul>`);
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_frame_folder(id,frame,subframes){
    var css_title = this.css('TITLE');
    var css_subtitle = this.css('TITLE2');
    let all = [];
    let boardpng = frame.boardname?`${frame.boardname}.png`:``;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' data-row='${frame.style.row}' style='position:relative;' >`);
    if(boardpng){
      var imgsrc = boardpng;
      var {imgsrc, imgid} = this.to_request_image(imgsrc);
      all.push(`<img src='${imgsrc}' id='${imgid}' alt='' style='position:absolute;left:10mm;top:10mm;' />`)
    }
    all.push(`<h1 class='TITLE'    style='${css_title}' > ${id} ${this.uncode(frame.style,frame.title)} </h1>`);
    all.push(`<h2 class='TITLE2' style='${css_subtitle}' > &#160; </h2>`);
    frame.contents.forEach((x) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    if(1){
      // subframes
      all.push(`<ul style='list-style:none;padding-left:2em;position:relative;'>`);
      subframes.forEach((subframe,j,arr) => {
        let icon = this.icon_folder;
        all.push(`<li style='position:relative;font-style:oblique;'> <span style='position:absolute;left:-2em' > ${icon} </span> <a href='#frame${id}.${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </li>`);
      });
      all.push(`</ul>`);
      all.push('</article>');
      all.push('');
    }
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  write_one_frame(id,order,frame,issub,topframe){
    var css_title = this.css('TITLE');
    var css_subtitle = this.css('TITLE2');
    var css_paragraph = this.css('PARAGRAPH');
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
      all.push(`<img src='${imgsrc}' id='${imgid}' alt='' style='position:absolute;left:10mm;top:10mm;' />`)
    }
    if(issub){
      all.push(`<h1 class='TITLE'    style='${css_title}' > ${order} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle}' > ${icon} <i>${this.uncode(frame.style,frame.title)}</i> </h2>`);
    }else{
      all.push(`<h1 class='TITLE'    style='${css_title}' > ${order} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle}' > &#160; </h2>`);
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
        all.push(`<div class='PARAGRAPH' style='${css_paragraph}' > ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> ${text} </div>`);
      }else{
        all.push(`<div class='PARAGRAPH' style='${css_paragraph}' > ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> </div>`);
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
      all.push(`<h1 class='TITLE' style='${css_title}' > &#160; </h1>`);
      if(o.choice){
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice).trim();
        let row = o.style.row;
        all.push(`<h2 class='TITLE2' style='${css_subtitle}' data-row='${row}' > ${icon} <i> ${title} </i> &#160; ${text} </h2>`)
      }else{
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.uncode(o.style,this.join_para(o.body)).trim();
        let row = o.style.row;
        all.push(`<h2 class='TITLE2' style='${css_subtitle}' data-row='${row}' > ${icon} <i> ${title} </i> &#160; ${text} </h2>`)
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
    <div class='FRONTMATTERTITLE'     style='${this.css("FRONTMATTERTITLE")}' >${this.uncode(style,title)}</div>
    <div class='FRONTMATTERSUBTITLE'  style='${this.css("FRONTMATTERSUBTITLE")}' >${this.uncode(style,subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' style='${this.css("FRONTMATTERINSTITUTE")}' >${this.uncode(style,institute)}</div>
    <div class='FRONTMATTERAUTHOR'    style='${this.css("FRONTMATTERAUTHOR")}' >${this.uncode(style,author)}</div>
    <div class='FRONTMATTERDATE'      style='${this.css("FRONTMATTERDATE")}' >${this.uncode(style,date)}</div>
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
        all.push(`<li> ${this.uchar_checkboxx} ${this.uncode(style,s)} </li>`)
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
  to_caption_nonumber(){
    return true;
  }
}
module.exports = { NitrilePreviewSlide };
