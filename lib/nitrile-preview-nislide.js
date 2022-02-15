'use babel';
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');
var script = `\
function canvas_onload(img){
  var canvasid = img.getAttribute('data-canvasid');
  var canvas = document.getElementById(canvasid);
  var cx = canvas.getContext('2d');
  cx.drawImage(img,0,0,canvas.width,canvas.height);
}
function canvas_onfocusin(canvas){
  var imgid = canvas.getAttribute('data-imgid');
  var paletteid = canvas.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  palette.style.visibility = 'visible';
}
function canvas_onfocusout(canvas){
  var imgid = canvas.getAttribute('data-imgid');
  var paletteid = canvas.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  //palette.style.visibility = 'hidden';
}
function canvas_onreset(form){
  var canvasid = form.getAttribute('data-canvasid');
  var canvas = document.getElementById(canvasid);
  var imgid = form.getAttribute('data-imgid');
  var img = document.getElementById(imgid);
  var paletteid = form.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  event.preventDefault();
  if(img){
    var cx = canvas.getContext('2d');
    cx.clearRect(0,0,canvas.width,canvas.height);
    cx.drawImage(img,0,0,canvas.width,canvas.height);
  }
  palette.style.visibility = 'hidden';
}
function canvas_onsubmit(form){
  var canvasid = form.getAttribute('data-canvasid');
  var canvas = document.getElementById(canvasid);
  var imgsrc = form.getAttribute('data-imgsrc');
  var paletteid = form.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  event.preventDefault();
  if(imgsrc){
    var url = canvas.toDataURL();                
    var png = imgsrc;
    fetch(form.action, { method:'post', body: JSON.stringify({data:"MY DATA",png,url}), headers: { "Content-Type": "application/json" } }).then(r => r.text()).then(text => alert(text));
  }
  palette.style.visibility = 'hidden';
}
function canvas_onmouseenter(canvas){
  canvas.style.cursor = 'crosshair';
}
function canvas_onmouseleave(canvas){
  var cx = canvas.getContext("2d");
  cx.cake = {};
  canvas.style.cursor = '';
}
function canvas_onmousedown(canvas){
  var cx = canvas.getContext("2d");
  if(event.button==0){
    cx.cake = {};
    cx.cake.myop = 'pencil';
    cx.cake.posx0 = Math.round((event.clientX-canvas.getBoundingClientRect().x));
    cx.cake.posy0 = Math.round((event.clientY-canvas.getBoundingClientRect().y));
    cx.cake.posx1 = cx.cake.posx0;
    cx.cake.posy1 = cx.cake.posy0;
    cx.cake.posx2 = cx.cake.posx1;
    cx.cake.posy2 = cx.cake.posy1;
    cx.cake.shiftKey = event.shiftKey;
    cx.cake.altKey   = event.altKey;
    cx.cake.mouseisdown = 1;
    cx.cake.mouseisdragged = 0;
    cx.cake.mousedragcount = 0;
  }
}
function canvas_onmousemove(canvas){
  var cx = canvas.getContext("2d");
  if(event.button==0 && cx.cake && cx.cake.mouseisdown){
    cx.cake.posx1 = cx.cake.posx2;
    cx.cake.posy1 = cx.cake.posy2;
    cx.cake.posx2 = Math.round((event.clientX-canvas.getBoundingClientRect().x));
    cx.cake.posy2 = Math.round((event.clientY-canvas.getBoundingClientRect().y));
    cx.cake.mouseisdragged = 1;
    cx.cake.mousedragcount += 1;
    if(cx.cake.shiftKey){ 
      canvas_draw_eraser(cx,canvas);
    }else{
      canvas_draw_pencil(cx,canvas);
    }
  }
}
function canvas_onmouseup(canvas){
  var cx = canvas.getContext("2d");
  if(event.button==0 && cx.cake && cx.cake.mouseisdown){
    cx.cake.mouseisdown = 0;
    cx.cake.mouseisdragged = 0;
    cx.cake.mousedragcount = 0;
  }
}
function canvas_draw_eraser(cx,canvas){
  cx.save();
  cx.lineWidth = 10;
  cx.globalCompositeOperation = 'destination-out';
  cx.beginPath();
  cx.moveTo(cx.cake.posx1,cx.cake.posy1);
  cx.lineTo(cx.cake.posx2,cx.cake.posy2);
  cx.stroke();
  cx.restore();
} 
function canvas_draw_pencil(cx,canvas){
  cx.lineWidth = 1.2;
  cx.strokeStyle = '#ae241c';   
  cx.strokeStyle = '#476fc7';        
  cx.beginPath();
  cx.moveTo(cx.cake.posx1,cx.cake.posy1);
  cx.lineTo(cx.cake.posx2,cx.cake.posy2);
  cx.stroke();
} 
`;
var stylesheet = `\
:root {
  --titlecolor: #1010B0;
}
.CANVASFORM:hover .CANVASPALETTE{
  visibility: visible;
}
.PARAGRAPH{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.EQUATION{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.FIGURE{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.LISTING{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.LONGTABU{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.COLUMN{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.FIGURE, .COLUMN, .LISTING, .EQUATION, .LONGTABU {
  margin-left: 0pt;
  margin-right: 0pt;
}
.TITLE {
  margin-left: -6mm;
  margin-right: -6mm;
  margin-top: 1mm;
  margin-bottom: 0;
  font-size:1.30em;
  font-weight: 500;
  color: var(--titlecolor);
}
.TITLE2 {
  margin-left: -6mm;
  margin-right: -6mm;
  margin-top: 0;
  margin-bottom: 0;
  font-size:0.8em;
  font-weight: 500;
  color: var(--titlecolor);
}
.FRONTMATTERTITLE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 2.5cm;
  margin-bottom: 0;
  font-size: 1.8em;
  color: var(--titlecolor);
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
      'SAMP', [
        'padding-left: 2em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SAND', [
        'padding-left: 2em',
      ]
    );
  }
  to_peek_document() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    return `${title_html}\n${html}`;
  }
  to_script(){
    return script;///global variable
  }
  to_data() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    var body = `${title_html}\n${html}`;
    var script = this.to_script();
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
      all.push(`<li style='position:relative;' > <span style='position:absolute;left:-2.0em;' > ${order} </span> <a style='color:inherit' href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </li>`);
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
      all.push(`<ul style='list-style:none;padding-left:0em;position:relative;'>`);
      subframes.forEach((subframe,j,arr) => {
        let icon = this.icon_folder;
        icon = '';
        all.push(`<li style='position:relative;font-decoration:underline;'> <span style='position:absolute;left:-2em' > ${icon} </span> <a style='color:inherit' href='#frame${id}.${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </li>`);
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
      icon = '';
      all.push(`<h1 class='TITLE'    style='${css_title}' > ${order} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle};text-decoration:underline' > ${icon} ${this.uncode(frame.style,frame.title)} </h2>`);
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
    <div class='FRONTMATTERTITLE'     style='${this.css("FRONTMATTERTITLE")}' >${this.smooth(title)}</div>
    <div class='FRONTMATTERSUBTITLE'  style='${this.css("FRONTMATTERSUBTITLE")}' >${this.smooth(subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' style='${this.css("FRONTMATTERINSTITUTE")}' >${this.smooth(institute)}</div>
    <div class='FRONTMATTERAUTHOR'    style='${this.css("FRONTMATTERAUTHOR")}' >${this.smooth(author)}</div>
    <div class='FRONTMATTERDATE'      style='${this.css("FRONTMATTERDATE")}' >${this.smooth(date)}</div>
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
}
module.exports = { NitrilePreviewSlide };
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
const { NitrilePreviewBase } = require('./nitrile-preview-base');
class NitrilePreviewServer extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    var fname = process.argv[2];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
      var translator = new NitrilePreviewSlide(parser);
      var data = translator.to_data();
      var xhtml = `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<script>
//<![CDATA[
${data.script}
//]]>
</script>
<style>
${data.stylesheet}
</style>
</head>
<body>
${data.body}
</body>
</html>
`;
      await this.write_text_file(fs,xhtmlfile,xhtml);
      console.log(`written to ${xhtmlfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new NitrilePreviewServer();
  server.run()
}
