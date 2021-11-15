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
    var setup_script = this.to_setup_script();
    var trigger_stylesheet = this.to_trigger_stylesheet();
    var slide_stylesheet = `\
    table {
      font-family: sans-serif;
      font-size: 10pt;
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
    .FRAMEBOARD {
      position: absolute;
      z-index: 9;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
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
      margin-top: 2.5cm;
      margin-bottom: 0;
      width: 115mm;
      font-size: 1.8em;
      font-weight: bold;
      color: #1010B0;
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
    .EDITIMG {
      visibility: hidden;
      position: absolute;
      z-index: 9;
      top: 0px;
      left: 0px;
    }
    .EDITBOARD {
      position: absolute;
      visibility: visible;
      z-index: 10;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
    }

    @media print {
      @page {
        size: 128mm 96mm;
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
<script>
//<![CDATA[
${setup_script}
//]]>
</script>
</head>
<body onload='setup()' onkeypress='body_keypress()' >
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
      let ul_css = ('PARA UL');
      let li_css = ('PACK');
      if(n==0){
        all.push(`<article row='0' class='SLIDE'>`);
        all.push(`<h1 class='${slidetitle_css}'> <b>Table Of Contents</b> </h1>`);
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
  write_frame_folder(id,frame,subframes){
    let slidetitle_css = ('SLIDETITLE');
    let itemize_css = ('ITEMIZE');
    let paragraph_css = ('PARAGRAPH');
    let ul_css = ('PARA UL');
    let li_css = ('PACK LI');
    let boardid = `board${id}`;
    let boardimgid = `boardimg${id}`;
    let boardname = frame.boardname;
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
    all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' data-boardimgid='${boardimgid}' data-boardname='${boardname}' data-frameid='${frameid}' width='484' height='361' ></canvas>`);
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
    let frameid = `frame${id}`;
    let all = [];
    let v = null;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' onmouseenter='myslide=this' onmouseleave='myslide=null' row='${frame.style.row}'>`);
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
    if(boardname){
      all.push(`<img class='EDITIMG' width='484' height='361' src='${boardname}.png' id='${boardimgid}' />`);
    }
    all.push(`<canvas class='EDITBOARD' id='${boardid}' data-type='board' data-boardimgid='${boardimgid}' data-boardname='${boardname}' data-frameid='${frameid}' width='484' height='361' ></canvas>`);
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
      all.push(`<canvas class='EDITBOARD' id='${boardid}x${i}' data-type='board' data-boardname='${boardname}' data-frameid='${frameid}' width='484' height='361' ></canvas>`);
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
  to_setup_script(){
    return `\
    allnames=['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen'];
    allhexcs=['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32'];
    allrgbs = {};
    all_op = 'pencil';
    all_arg = 'circle';
    all_stroke = 1;
    all_color = 'RoyalBlue';
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
      //draw_canvas();
    }
    function board_setup_canvas(canvas){
      canvas.style.cursor = 'crosshair';
      var ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
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
      ///GLOBAL STORAGE
      ///CANVAS-SPECIFIC STORAGE
      ctx.d.myfig = {x:0,y:0,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke:1,mycolor:'RoyalBlue'};
      ctx.d.mybasis = {x:0,y:0,w:0,h:0,dx:0,dy:0,dw:0,dh:0,s:null,a:null};
      ctx.d.myundo = [];
      ctx.d.myredo = [];
      var boardimgid = canvas.getAttribute("data-boardimgid");
      var boardimg = document.getElementById(boardimgid);
      if(boardimg){
        ctx.drawImage(boardimg,0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
      }
      var s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
      ctx.d.myface = s;
      var myfig = {...ctx.d.myfig};
      var mybasis = {...ctx.d.mybasis};
      var myop = all_op;
      var myarg = all_arg;
      ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
    }
    function board_draw_canvas(canvas){
    }
    function board_handle_keydown(shiftKey,keycode,ctx,canvas){
      //var n = ctx.d.myundo.length;
      //var o = ctx.d.myundo[n-1];
      console.log(keycode);
      switch(keycode){
      ///FOR SMUDGE
      case 'Backquote':
        all_op='smudge';
        break;
      ///FOR PENCIL
      case 'Digit1':
        all_op='pencil';
        break;
      ///FOR CIRCLE
      case 'Digit5':
        all_op='shape';
        all_arg='circle';
        break;
      ///FOR RECT  
      case 'Digit4':
        all_op='shape';
        all_arg='rect';
        break;
      ///FOR TRI   
      case 'Digit3':
        all_op='shape';
        all_arg='tri';
        break;
      ///FOR LINE  
      case 'Digit2':
        all_op='shape';
        all_arg='line';
        break;
      ///FOR SELECT
      case 'Digit6':
        all_op='select';
        all_arg=(shiftKey)?'copy':'move';
        break;
      ///FOR PENCIL SIZE BIG  
      case 'Equal':
        all_stroke = 3;
        break;
      ///FOR PENCIL SIZE SMALL
      case 'Minus':
        all_stroke = 1;
        break;
      ///FOR PENCIL COLORS ROYALBLUE
      case 'Digit7':
        var value = 'RoyalBlue';
        all_color = value;
        break;
      ///FOR PENCIL COLORS DARKORCHID
      case 'Digit8':
        var value = 'DarkOrchid';
        all_color = value;
        break;
      ///FOR PENCIL COLORS DARKOLIVEGREEN
      case 'Digit9':
        var value = 'DarkOliveGreen';
        all_color = value;
        break;
      ///FOR PENCIL COLORS CHOCOLATE     
      case 'Digit0':
        var value = 'Chocolate';
        all_color = value;
        break;
      /////////////////////////////////////
      ///
      /////////////////////////////////////
      case 'KeyK':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.y  += - 1;
          board_redraw(o,ctx,canvas);
        }
        break;
      case 'KeyJ':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.y  += + 1;
          board_redraw(o,ctx,canvas);
        }
        break;
      case 'KeyH':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.x  += - 1;
          board_redraw(o,ctx,canvas);
        }
        break;
      case 'KeyL':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.x  += + 1;
          board_redraw(o,ctx,canvas);
        }
        break;
      ///ROTATE
      case 'KeyE':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.rotate += (-1);
          board_redraw(o,ctx,canvas);
        }
        break;
      case 'KeyR':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.rotate += (+1);
          board_redraw(o,ctx,canvas);
        }
        break;
      ///SCALE-S
      case 'KeyD':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.w /= 1.01;
          o.myfig.h /= 1.01;
          board_redraw(o,ctx,canvas);
        }
        break;
      case 'KeyS':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.w *= 1.01;
          o.myfig.h *= 1.01;
          board_redraw(o,ctx,canvas);
        }
        break;
      ///SCALE-W
      case 'KeyW':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.w  += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
        }
        break;
      ///SCALE-T 
      case 'KeyT':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.h  += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
        }
        break;
      ///SKEW-X  
      case 'KeyX':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.skewX += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
        }
        break;
      ///SKEW-Y  
      case 'KeyY':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          o.myfig.skewY += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
        }
        break;
      ///DUPLICATE
      case 'KeyM':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          let myop     = o.myop;
          let myarg    = o.myarg;
          let myfig    = o.myfig;
          let s        = ctx.d.myface;
          let mybasis  = ctx.d.mybasis;
          myfig = {...myfig};
          mybasis = {...mybasis};
          ///save 
          ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
          ctx.d.myredo = [];
          ctx.d.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
          board_last(ctx,canvas);
        }
        break;
      ///FOR UNDO
      case 'KeyZ':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          if(ctx.d.myundo.length>1){
            o = ctx.d.myundo.pop();
            ctx.d.myredo.push(o);
          }
          board_last(ctx,canvas);
        }
        break;
      ///FOR REDO
      case 'KeyA':
        if(ctx && canvas){
          let n = ctx.d.myundo.length;
          let o = ctx.d.myundo[n-1];
          if(ctx.d.myredo.length>0){
            let o = ctx.d.myredo.pop();
            if( o.myop=='shape' ){
              o.s = ctx.d.myface;
            }
            ctx.d.myundo.push(o);
          }
          board_last(ctx,canvas);
        }
        break;
      }
    }
    function board_onmousedown(evt){
      if(evt.button==0){
        var canvas = evt.target;
        var ctx = canvas.getContext("2d");
        if(1){
          let [sx,sy] = board_calc_sx_and_sy(canvas);
          ctx.d.myposx0 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
          ctx.d.myposy0 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
          ctx.d.myposx1 = ctx.d.myposx0;
          ctx.d.myposy1 = ctx.d.myposy0;
          ctx.d.myposx2 = ctx.d.myposx1;
          ctx.d.myposy2 = ctx.d.myposy1;
          ctx.d.shiftKey = evt.shiftKey;
          ctx.d.altKey   = evt.altKey;
          ctx.d.mymouseisdown = 1;
          board_start(ctx,canvas);
        }
      }
    }
    function board_onmousemove(evt){
      if(evt.button==0){
        var canvas = evt.target;
        var ctx = canvas.getContext("2d");
        if(1){
          let [sx,sy] = board_calc_sx_and_sy(canvas);
          ctx.d.myposx1 = ctx.d.myposx2;
          ctx.d.myposy1 = ctx.d.myposy2;
          ctx.d.myposx2 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
          ctx.d.myposy2 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
          ctx.d.shiftKey = evt.shiftKey;
          ctx.d.altKey   = evt.altKey;
          if(ctx.d.mymouseisdown){
            board_drag(ctx,canvas);
          }
        }
      }
    }
    function board_onmouseup(evt){
      if(evt.button==0){
        var canvas = evt.target;
        var ctx = canvas.getContext("2d");
        if(1){
          if(ctx.d.mymouseisdown){
            board_end(ctx,canvas);
          }
          ctx.d.mymouseisdown = 0;
          ctx.d.shiftKey = 0;
          ctx.d.altKey = 0;
        }
      }
    }
    function board_onmouseenter(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.d.mymouseisdown = 0;
      ctx.d.shiftKey = evt.shiftKey;
      ctx.d.altKey   = evt.altKey;
    }
    function board_onmouseleave(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.d.mymouseisdown = 0;
      ctx.d.shiftKey = evt.shiftKey;
      ctx.d.altKey   = evt.altKey;
    }
    function board_ontouchstart(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                             
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.d.myposx0 = Math.round((touch.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.d.myposy0 = Math.round((touch.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.d.myposx1 = ctx.d.myposx0;
        ctx.d.myposy1 = ctx.d.myposy0;
        ctx.d.myposx2 = ctx.d.myposx1;
        ctx.d.myposy2 = ctx.d.myposy1;
        ctx.d.mymouseisdown = 1;
        ctx.d.shiftKey = evt.shiftKey;
        ctx.d.altKey   = evt.altKey;
        if(ctx.d.mymouseisdown){
          board_start(ctx,canvas);
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
        ctx.d.myposx1 = ctx.d.myposx2;
        ctx.d.myposy1 = ctx.d.myposy2;
        ctx.d.myposx2 = Math.round((touch.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.d.myposy2 = Math.round((touch.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.d.shiftKey = evt.shiftKey;
        ctx.d.altKey   = evt.altKey;
        if(ctx.d.mymouseisdown){
          board_drag(ctx,canvas);
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
        board_end(ctx,canvas);
        ctx.d.mymouseisdown = 0;
        ctx.d.shiftKey = 0;
        ctx.d.altKey   = 0;
      }
    }
    function board_ontouchcancel(evt) {
      evt.preventDefault();
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        var ctx = canvas.getContext("2d");
        board_end(ctx,canvas);
        ctx.d.mymouseisdown = 0;
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
      let myposx1 = ctx.d.myposx1;
      let myposy1 = ctx.d.myposy1;
      let myposx2 = ctx.d.myposx2;
      let myposy2 = ctx.d.myposy2;
      let mystroke= all_stroke;
      let mycolor = all_color;
      let mysmear = allrgbs[mycolor];
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ///PENCIL
      var lw = mystroke*sx;
      lw = Math.max(lw,1);
      lw = Math.round(lw);//this is to work around the bug of Edge V93 on mac (number less than 1 will cause an error of "width is 0")
      ctx.lineWidth = lw;
      ctx.strokeStyle = mycolor;
      //pencil_between(myposx1,myposy1,myposx2,myposy2,lw,ctx);
      ctx.beginPath();
      ctx.moveTo(myposx1,myposy1);
      ctx.lineTo(myposx2,myposy2);
      ctx.stroke();
    }
    function board_draw_smudge_fill(x1,y1,sx,sy,ctx,canvas){
      let mystroke= all_stroke;
      let mycolor = all_color;
      let mysmear = allrgbs[mycolor];
      let n = smudge_fill(x1,y1,0,0,sx,sy,0,mysmear,ctx,canvas);
    }
    function board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas){
      let mystroke= all_stroke;
      let mycolor = all_color;
      let mysmear = allrgbs[mycolor];
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      mystroke = Math.max(1,mystroke);
      var lw = 3*mystroke*sx;
      var lw = Math.round(lw);//this is to work around the bug of Edge V93 on mac (number less than 1 will cause an error of "width is 0")
      var lw = Math.max(1,lw);
      smudge_between(x1,y1,x2,y2,lw,mysmear,ctx,canvas);
    }
    function board_draw_clear(ctx,canvas,first){
      ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
    }
    function board_draw_eraser(ctx,canvas,first){
      let myposx1 = ctx.d.myposx1;
      let myposy1 = ctx.d.myposy1;
      let myposx2 = ctx.d.myposx2;
      let myposy2 = ctx.d.myposy2;
      let mystroke= all_stroke;
      let mycolor = all_color;
      let mysmear = allrgbs[mycolor];
      let myop    = all_op;
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
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_draw_hilite(ctx,canvas){
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.globalCompositeOperation = 'xor';
      ctx.fillRect(ctx.d.mybasis.x+ctx.d.mybasis.dx,
                   ctx.d.mybasis.y+ctx.d.mybasis.dy, 
                     ctx.d.mybasis.w+ctx.d.mybasis.dw,
                     ctx.d.mybasis.h+ctx.d.mybasis.dh);
      ctx.restore();
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_start(ctx,canvas){
      ///ALT-KEY always erase
      if(ctx.d.altKey){
        if(ctx.d.shiftKey){
          ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
        }else{
          board_draw_eraser(ctx,canvas,true);
        }
        return;
      }
      if(all_op=='shape' && all_arg=='circle'){
        //START
        board_reset_basis(ctx);
        let mystroke = all_stroke;
        let mycolor  = all_color;
        let x = ctx.d.myposx0;
        let y = ctx.d.myposy0;
        ctx.d.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.d.myface, 0,0);
      }
      if(all_op=='shape' && all_arg=='rect'){
        board_reset_basis(ctx);
        let mystroke = all_stroke;
        let mycolor  = all_color;
        let x = ctx.d.myposx0;
        let y = ctx.d.myposy0;
        ctx.d.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.d.myface, 0,0);
      }
      if(all_op=='shape' && all_arg=='tri'){
        board_reset_basis(ctx);
        let mystroke = all_stroke;
        let mycolor  = all_color;
        let x = ctx.d.myposx0;
        let y = ctx.d.myposy0;
        ctx.d.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.d.myface, 0,0);
      }
      if(all_op=='shape' && all_arg=='line'){
        board_reset_basis(ctx);
        let mystroke = all_stroke;
        let mycolor  = all_color;
        let x = ctx.d.myposx0;
        let y = ctx.d.myposy0;
        ctx.d.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.d.myface, 0,0);
      }
      if(all_op=='smudge'){
        //START
        board_reset_basis(ctx);
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.d.myface, 0,0);
        let x1 = ctx.d.myposx1;
        let y1 = ctx.d.myposy1;
        let x2 = ctx.d.myposx2;
        let y2 = ctx.d.myposy2;
        if(all_stroke==0){
          board_draw_smudge_fill(x1,y1,x1,y1,ctx,canvas);
        }else{
          board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas);
        }
      }
      if(all_op=='pencil'){
        //START
        board_reset_basis(ctx);
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(ctx.d.myface, 0,0);
        if(ctx.d.shiftKey && ctx.d.altKey){
          ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
        }else if(ctx.d.altKey){
          board_draw_eraser(ctx,canvas,true);
        }else{
          board_draw_pencil(ctx,canvas,true);
        }
      }
      if(all_op=='select'){
        ///START
        if( (ctx.d.myposx0 > ctx.d.mybasis.x) &&
            (ctx.d.myposx0 < ctx.d.mybasis.x+ctx.d.mybasis.w+ctx.d.mybasis.dw) &&
            (ctx.d.myposy0 > ctx.d.mybasis.y) &&
            (ctx.d.myposy0 < ctx.d.mybasis.y+ctx.d.mybasis.h+ctx.d.mybasis.dh) ){
          ///MOVE/COPY/RESIZE
          ctx.d.mybasis.s = ctx.d.myface;
          ctx.d.mybasis.a = all_arg;      
        }else{
          ///HILITE-ONLY
          board_reset_basis(ctx);
          ctx.d.mybasis.s = ctx.d.myface;
          ctx.d.mybasis.a = null;
          ctx.d.mybasis.x  = ctx.d.myposx0;
          ctx.d.mybasis.y  = ctx.d.myposy0;
          ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
          ctx.putImageData(ctx.d.myface, 0,0);
          board_draw_hilite(ctx,canvas);
        }
      }
    }
    function board_drag(ctx,canvas){
      ///ALT-KEY always erase
      if(ctx.d.altKey){
        board_draw_eraser(ctx,canvas,false);
        return;
      }
      if (all_op=='shape' && all_arg=='circle' && ctx.d.myfig){
        //DRAG  
        let myposx0 = ctx.d.myposx0;
        let myposy0 = ctx.d.myposy0;
        let myposx2 = ctx.d.myposx2;
        let myposy2 = ctx.d.myposy2;
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.d.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.d.myfig.mycolor;   
        ///CIRCLE
        let s = ctx.d.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        let cx,cy,rx,ry;
        if(ctx.d.altKey){
          cx = myposx0;
          cy = myposy0;
          rx = Math.abs(myposx0 - myposx2);
          ry = Math.abs(myposy0 - myposy2);
          if(ctx.d.shiftKey){
            let r = Math.max(rx,ry);
            rx = r;
            ry = r;
          }
        }else{
          cx = (myposx0 + myposx2)/2;
          cy = (myposy0 + myposy2)/2;
          rx = Math.abs((myposx0 - myposx2)/2);
          ry = Math.abs((myposy0 - myposy2)/2);
          if(ctx.d.shiftKey){
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
          ctx.d.myfig.x = cx;
          ctx.d.myfig.y = cy;
          ctx.d.myfig.w = rx;
          ctx.d.myfig.h = ry;
          ctx.stroke();
        }
      }
      if(all_op=='shape' && all_arg=='rect' && ctx.d.myfig){
        //DRAG  
        let myposx0 = ctx.d.myposx0;
        let myposy0 = ctx.d.myposy0;
        let myposx2 = ctx.d.myposx2;
        let myposy2 = ctx.d.myposy2;
        let x = myposx0;
        let y = myposy0; 
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.d.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.d.myfig.mycolor;   
        ///RECT  
        let s = ctx.d.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        if(ctx.d.shiftKey){
          let d = Math.min(w,h);
          w = d;
          h = d;
        }
        if(w || h){
          ctx.strokeRect(x,y, w,h);
          ctx.d.myfig.x = x;
          ctx.d.myfig.y = y;
          ctx.d.myfig.w = w; 
          ctx.d.myfig.h = h; 
        }
      }
      if(all_op=='shape' && all_arg=='tri' && ctx.d.myfig){
        //DRAG  
        let myposx0 = ctx.d.myposx0;
        let myposy0 = ctx.d.myposy0;
        let myposx2 = ctx.d.myposx2;
        let myposy2 = ctx.d.myposy2;
        let x = myposx0;
        let y = myposy0; 
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.d.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.d.myfig.mycolor;   
        ///TRI   
        let s = ctx.d.myface;
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
          ctx.d.myfig.w = w;
          ctx.d.myfig.h = h;
        }
      }
      if(all_op=='shape' && all_arg=='line' && ctx.d.myfig){
        //DRAG  
        let x1 = ctx.d.myposx0;
        let y1 = ctx.d.myposy0;
        let x2 = ctx.d.myposx2;
        let y2 = ctx.d.myposy2;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.d.myfig.mystroke*sx;
        ctx.strokeStyle = ctx.d.myfig.mycolor;
        ///LINE  
        let s = ctx.d.myface;
        ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ctx.putImageData(s, 0,0);
        let ddx = Math.abs(x2-x1);
        let ddy = Math.abs(y2-y1);
        let dd = Math.sqrt(ddx*ddx + ddy*ddy);
        if(ctx.d.shiftKey && ddx > ddy){
          x2 = ctx.d.myposx2;
          y2 = ctx.d.myposy0;
        }else if(ctx.d.shiftKey && ddy > ddx){
          x2 = ctx.d.myposx0;
          y2 = ctx.d.myposy2;
        }
        let w = x2-x1;
        let h = y2-y1;
        if(w || h){
          ctx.beginPath();
          ctx.moveTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.stroke();
          ctx.d.myfig.x = x1;
          ctx.d.myfig.y = y1; 
          ctx.d.myfig.w = w;
          ctx.d.myfig.h = h; 
        }
      }
      if(all_op=='smudge'){
        //DRAG  
        let x1 = ctx.d.myposx1;
        let y1 = ctx.d.myposy1;
        let x2 = ctx.d.myposx2;
        let y2 = ctx.d.myposy2;
        board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas,false);
      }
      if(all_op=='pencil'){
        //DRAG  
        if(ctx.d.altKey){
          board_draw_eraser(ctx,canvas,false);
        }else{
          board_draw_pencil(ctx,canvas,false);
        }
      }
      if(all_op=='select'){
        //DRAG  
        if(ctx.d.mybasis.a){
          ///MOVE/COPY/RESIZE
          let dx = ctx.d.myposx2 - ctx.d.myposx0;
          let dy = ctx.d.myposy2 - ctx.d.myposy0;
          ctx.clearRect(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
          ctx.putImageData(ctx.d.myface, 0,0);
          let p1 = ctx.getImageData(ctx.d.mybasis.x,ctx.d.mybasis.y, ctx.d.mybasis.w,ctx.d.mybasis.h);
          if(ctx.d.mybasis.a=='move'){
            if(ctx.d.shiftKey){
              if(Math.abs(dx)<Math.abs(dy)){
                dx = 0;
              }else if(Math.abs(dy)<Math.abs(dx)){
                dy = 0;
              }
            }
            ctx.clearRect(ctx.d.mybasis.x,ctx.d.mybasis.y, ctx.d.mybasis.w,ctx.d.mybasis.h);
            ctx.putImageData(p1, ctx.d.mybasis.x+dx,ctx.d.mybasis.y+dy);
            ctx.d.mybasis.s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
            ///draw hilite
            ctx.d.mybasis.dx = dx;
            ctx.d.mybasis.dy = dy;
            board_draw_hilite(ctx,canvas);
          }else if(ctx.d.mybasis.a=='copy'){
            if(ctx.d.shiftKey){
              if(Math.abs(dx)<Math.abs(dy)){
                dx = 0;
              }else if(Math.abs(dy)<Math.abs(dx)){
                dy = 0;
              }
            }
            ctx.putImageData(p1, ctx.d.mybasis.x+dx,ctx.d.mybasis.y+dy);
            ctx.d.mybasis.s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
            ///draw hilite
            ctx.d.mybasis.dx = dx;
            ctx.d.mybasis.dy = dy;
            board_draw_hilite(ctx,canvas);
          }else if(ctx.d.mybasis.a=='resize'){
            let w = p1.width;
            let h = p1.height;
            let iw = w+dx;
            let ih = h+dy;
            if(ctx.d.shiftKey){
              iw = (ih/h)*w;
              iw = Math.round(iw);
            }
            let p2 = resizeImageData(p1, iw, ih, ctx);
            ctx.clearRect(ctx.d.mybasis.x,ctx.d.mybasis.y, ctx.d.mybasis.w,ctx.d.mybasis.h);
            ctx.putImageData(p2, ctx.d.mybasis.x,ctx.d.mybasis.y);
            ctx.d.mybasis.s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
            ///draw hilite
            ctx.d.mybasis.dw = (iw-w);
            ctx.d.mybasis.dh = (ih-h);
            board_draw_hilite(ctx,canvas);
          }
        }else{
          ///HILITE-ONLY
          ctx.d.mybasis.w = ctx.d.myposx2 - ctx.d.myposx0;
          ctx.d.mybasis.h = ctx.d.myposy2 - ctx.d.myposy0;
          ctx.putImageData(ctx.d.myface, 0,0);
          board_draw_hilite(ctx,canvas);
        }
      }
    }
    function board_end(ctx,canvas){
      if(all_op=='shape'){
        //BOARD_END   
        let s        = ctx.d.myface;
        let myfig    = ctx.d.myfig;
        let myop     = all_op;
        let myarg    = all_arg;
        if(s && myfig && myop && myarg && (myfig.w || myfig.h)){
          ///normalize ctx.d.mybasis
          ctx.d.mybasis.x += ctx.d.mybasis.dx;
          ctx.d.mybasis.y += ctx.d.mybasis.dy;
          ctx.d.mybasis.dx = 0;
          ctx.d.mybasis.dy = 0;
          ctx.d.mybasis.w += ctx.d.mybasis.dw;
          ctx.d.mybasis.h += ctx.d.mybasis.dh;
          ctx.d.mybasis.dw = 0;
          ctx.d.mybasis.dh = 0;
          let mybasis  = {...ctx.d.mybasis};
          ///save 
          ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
          ctx.d.myredo = [];
          ctx.d.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        }
      } 
      else if(all_op=='pencil' || 
              all_op=='smudge' ){
        let s = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        ///normalize ctx.d.mybasis
        ctx.d.mybasis.x += ctx.d.mybasis.dx;
        ctx.d.mybasis.y += ctx.d.mybasis.dy;
        ctx.d.mybasis.dx = 0;
        ctx.d.mybasis.dy = 0;
        ctx.d.mybasis.w += ctx.d.mybasis.dw;
        ctx.d.mybasis.h += ctx.d.mybasis.dh;
        ctx.d.mybasis.dw = 0;
        ctx.d.mybasis.dh = 0;
        let mybasis  = {...ctx.d.mybasis};
        let myfig  = {...ctx.d.myfig};
        let myop = all_op;
        let myarg = all_arg;
        ///save 
        ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
        ctx.d.myredo = [];
        ctx.d.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
      }
      else if(all_op=='select'){
        let s        = ctx.d.mybasis.s;      
        if(s && ctx.d.mybasis.w && ctx.d.mybasis.h){
          ///normalize ctx.d.mybasis
          ctx.d.mybasis.x += ctx.d.mybasis.dx;
          ctx.d.mybasis.y += ctx.d.mybasis.dy;
          ctx.d.mybasis.dx = 0;
          ctx.d.mybasis.dy = 0;
          ctx.d.mybasis.w += ctx.d.mybasis.dw;
          ctx.d.mybasis.h += ctx.d.mybasis.dh;
          ctx.d.mybasis.dw = 0;
          ctx.d.mybasis.dh = 0;
          ctx.d.mybasis.s = null;
          let mybasis  = {...ctx.d.mybasis};
          let myfig = {...ctx.d.myfig};
          let myop = all_op;      
          let myarg = all_arg;
          ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
          ctx.d.myredo = [];
          ctx.d.myface = s;
        }
      }
      ///SAVE CANVAS
      all_canvas = canvas;
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_last(ctx,canvas){
      var n = ctx.d.myundo.length;
      var o = ctx.d.myundo[n-1];  
      if(o){
        board_redraw(o,ctx,canvas);
      }
    }
    function board_redraw(o,ctx,canvas){
      ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
      if(o.s){
        ctx.putImageData(o.s,0,0);
        ctx.d.myface = o.s;
      }
      if(o.mybasis){
        ///COPY-SELECTION
        ctx.d.mybasis = {...o.mybasis};
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
        ctx.d.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
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
        ctx.d.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
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
        ctx.d.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
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
        ctx.d.myface = ctx.getImageData(0,0, canvas.getAttribute('width'),canvas.getAttribute('height'));
        console.log('redraw shape line');
      } 
    }
    function board_calc_sx_and_sy(canvas){
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      return [sx,sy];
    }
    function board_reset_basis(ctx){
      ctx.d.mybasis.x = 0;
      ctx.d.mybasis.y = 0;
      ctx.d.mybasis.w = 0;
      ctx.d.mybasis.h = 0;
      ctx.d.mybasis.dx = 0;
      ctx.d.mybasis.dy = 0;
      ctx.d.mybasis.dw = 0;
      ctx.d.mybasis.dh = 0;
    }
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
    async function __resizeImageData (imageData, width, height) {
      const resizeWidth = width >> 0
      const resizeHeight = height >> 0
      const ibm = await window.createImageBitmap(imageData, 0, 0, imageData.width, imageData.height, {
        resizeWidth, resizeHeight
      })
      const canvas = document.createElement('canvas')
      canvas.width = resizeWidth
      canvas.height = resizeHeight
      const ctx = canvas.getContext('2d')
      ctx.scale(resizeWidth / imageData.width, resizeHeight / imageData.height)
      ctx.drawImage(ibm, 0, 0)
      return ctx.getImageData(0, 0, resizeWidth, resizeHeight)
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
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
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ctx.d.dirty = 1;
      ctx.d.currmousex = evt.offsetX*sx;
      ctx.d.currmousey = evt.offsetY*sy;
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
      let [sx,sy] = board_calc_sx_and_sy(canvas);
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
      let [sx,sy] = board_calc_sx_and_sy(canvas);
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
        board_handle_keydown(shiftKey,keycode,ctx,canvas);
      }else{
        var shiftKey = event.shiftKey;
        var keycode = event.code;
        var canvas = null;
        var ctx = null;
        if(all_canvas){
          canvas = all_canvas;
          ctx = canvas.getContext("2d");
        }
        board_handle_keydown(shiftKey,keycode,ctx,canvas);
      }
    }
    `;
  }
}
module.exports = { NitrilePreviewSlide };
