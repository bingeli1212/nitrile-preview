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
    this.icon_folder = '&#x2668;'//HOT SPRING  
    //this.uchar_checkboxo = '&#x25FB;' //White Medium Square
    //this.uchar_checkboxx = '&#x25FC;' //Black Medium Square
    this.uchar_checkboxo = '&#x2610;' //White Medium Square
    this.uchar_checkboxx = '&#x2612;' //Black Medium Square
  }
  to_document() {
    //this.translate();
    ///translate to html
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    var html = this.replace_all_refs(html);
    var fontfamily = 'serif';
    var fontsize = '11pt';
    var lineheight = '1.15';
    var margintop = '6pt';
    var paddingleftplst = '0.75cm';
    var paddingleftdd = '1.15cm';
    var paddingleftnspace = '0.5cm';
    var button_html='';
    var title = this.parser.conf_to_string('title');
    var style = this.parser.style;
    var data = `\
<!DOCTYPE html>
<html lang='en-US'>
<head>
<meta charset="utf-8" />
<title>${this.uncode(style,title)}</title>
<style>

  @media print {

    @page {
      size: 128mm 96mm;
    }  

    article {
      page-break-inside: avoid;
      page-break-after: always;
      min-width:100%;
      max-width:100%;
      box-sizing:border-box;
      overflow: hidden;
    }

    main {
      margin:0;
      padding:0;
    }
  }

  @media screen {

    article {
      background-color: white;
      margin: 1em auto;
      min-width:128mm;
      max-width:128mm;
      min-height:96mm;
      max-height:96mm;
      box-sizing:border-box;
    }

    main {
      background-color: gray;
      box-sizing:border-box;
      padding:1px 0;
    }
  }

  article {
    font-family:${fontfamily};
    font-size:${fontsize};
    line-height: ${lineheight};
    box-sizing:border-box;
    overflow: hidden;
    padding:1px 0;
  }

  body {
    margin:0;
    padding:0;
  }

  .frontmattertitle {
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

  .frontmattersubtitle {
    margin-left: 6.5mm;
    margin-top: 0.8cm;
    margin-bottom: 0;
    width: 115mm;
    font-size: 1.1em;
    text-align: center;
    align-self: center;
  }

  .frontmatterinstitute {
    margin-left: 6.5mm;
    margin-top: 0.2cm;
    margin-bottom: 0;
    width: 115mm;
    font-size: 1.1em;
    text-align: center;
    align-self: center;
  }

  .frontmatterauthor {
    margin-left: 6.5mm;
    margin-top: 0.2cm;
    margin-bottom: 0;
    width: 115mm;
    font-size: 1.1em;
    text-align: center;
    align-self: center;
  }

  .frontmatterdate {
    margin-left: 6.5mm;
    margin-top: 0.2cm;
    margin-bottom: 0;
    width: 115mm;
    font-size: 1.1em;
    text-align: center;
    align-self: center;
  }

  .frametitle {
    margin-left:10px;
    margin-top:3mm;
    margin-bottom:0;
    font-size:1.20em;
    font-weight:normal;
    color: #1010B0;
  }

  .framesubtitle {
    margin-left:10px;
    margin-top:3mm;
    margin-bottom:0;
    font-size:0.8em;
    font-weight:normal;
    color: #1010B0;
  }

  table {
    border-collapse: collapse;
  }

  .FIGURE, .TABLE, .LONGTABLE {
    margin-top: 5.5pt;
    margin-bottom: 5.5pt;
    margin-left: 6.5mm;
    margin-right:6.5mm;
    text-align: center;
    align-self: center;
  }

  .ITEMIZE, .PARAGRAPH, .SAMPLE, .INDENT, .EQUATION, .TABBING {
    margin-left: 6.5mm;
    margin-top: 5.5pt;
    margin-bottom: 5.5pt;
    width: 115mm;
    align-self: center;
  }

  .PARAGRAPH, .INDENT {
    text-align: justify;
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
  }
  
  .INDENT {
    padding-left: 0.55cm;
  }

  .COMBINATION {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
  }

  .FIGCAPTION {
    margin-top: 0;
    margin-bottom: 5.5pt;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    line-height: 1;
    font-size: smaller;
  }

  .SUBFIGCAPTION {
    line-height: 1;    
    font-size: smaller;
  }

  .SUBFIGURE {
    table-layout:fixed;
    display:inline-table;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-top: 5.5pt;
  }

  .WRAPLEFT {
    float: left;
    margin-right: 1em;
  }

  .WRAPRIGHT {
    float: right;
    margin-left: 1em;
  }

  .DISPLAYMATH {
    text-align:center;
    margin-top: 5.5pt;
    margin-bottom: 5.5pt;
  }

  .SAMPLE {
    padding-left:0em;
    padding-right:0em;
  }

  .PARA {
    margin-top: 5.5pt;
    margin-bottom: 5.5pt;
  }

  .PACK {
    margin-top: 1pt;
    margin-bottom: 1pt;
  }

  .DL > .DD {
    padding-left: 1.15cm;
  }

  .HL {
    list-style: none;
    padding-left: 0;
  }

  .OL {
    padding-left: 0.55cm;
  }

  .UL {
    padding-left: 0.55cm;
  }

  .TH, TD {
    padding: 0.15em 0.6em;
  }

  ruby {
    line-height: 1;
    ruby-position: over;
    ruby-align: space-between;
  }

  rt {
    display: inline-block;
    font-size: 35%;
    ruby-align: space-between;
  }

</style>
</head>
<body>
<main>
${title_html}
${html}
</main>
${button_html}
</body>
</html>
`;
    return data;
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
          let out = this.write_frame_one(`${i+1}.${j+1}`,subframe,1);
          d.push(out);
        });
      }else{
        let out = this.write_frame_one(`${i+1}`,topframe,0);
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
      if(n+1==max_n){
        all.push(`</ul>`);
        all.push('</div>')
        all.push('</article>');
        all.push(''); 
        n=0;
      }
      if(n==0){
        all.push(`<article>`);
        all.push(`<h1 class='frametitle'> <b>Table Of Contents</b> </h1>`);
        all.push(`<div class='PARAGRAPH'>`)
        all.push(`<ul class='PARA UL TOC' style='list-style:none;padding-left:1em;'>`);
      }
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.5ex,-50%);'>${j+1}.</span>`;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`<li class='PACK' style='position:relative'> ${icon} <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> ${this.icon_folder} </li>`);
      }else{
        all.push(`<li class='PACK' style='position:relative'> ${icon} <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> </li>`);
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
    let all = [];
    //
    //NOTE: main contents
    //
    all.push(`<article id='frame${id}'>`);
    all.push(`<h1 class='frametitle'> ${id}. <b>${this.uncode(frame.style,frame.title)}</b> ${this.icon_folder} </h1>`);
    frame.contents.forEach((x) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    // FONT
    var fontsize = this.to_fontsize(subframes.length);
    all.push(`<div class='ITEMIZE' style='font-size:${fontsize}' >`)
    subframes.forEach((subframe,j,arr) => {
      if(j==0){
        all.push(`<ul class='PARA UL' style='list-style:none;padding-left:1em;'>`);
      }
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.5ex,-50%);'>${j+1}.</span>`;
      all.push(`<li class='PACK' style='position:relative'> ${icon} <b> <a href='#frame${id}.${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </b> </li>`);
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
  write_frame_one(id,frame,issub){
    let all = [];
    let v = null;
    const re_choice = /^(.*?):([\w\/]+)$/;
    //
    //NOTE: main contents
    //
    all.push(`<article id='frame${id}'>`);
    all.push(`<h1 class='frametitle'>${id}. <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    all.push(`<ul class='PARAGRAPH' style='list-style:none;padding:0;'>`);
    frame.solutions.forEach((o,i,arr) => {
      if((v=re_choice.exec(o.title))!==null){
        all.push(`<li class='PACK'> ${this.icon_solution} <i>${this.uncode(o.style,v[1])}</i> </li>`);
        let text = this.to_choice(o.style,o.body);
        all.push(text);
      }else{
        all.push(`<li class='PACK'> ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> </li>`);
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
      all.push(`<article>`);
      if((v=re_choice.exec(o.title))!==null){
        all.push(`<h1 class='frametitle'>${this.icon_solution} <i>${this.uncode(o.style,v[1])}</i> </h1>`);
        let text = this.to_choice(o.style,o.body,v[2])
        all.push(`<h2 class='framesubtitle'> <b>${text}</b> </h2>`)
      }else{
        all.push(`<h1 class='frametitle'>${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> </h1>`);
        let text = this.untext(o.style,o.body).trim();
        all.push(`<h2 class='framesubtitle'> <b>${text}</b> </h2>`)
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
    let data = `<article>
    <div class='frontmattertitle' >${this.uncode(style,title)}</div>
    <div class='frontmattersubtitle' >${this.uncode(style,subtitle)}</div>
    <div class='frontmatterinstitute' >${this.uncode(style,institute)}</div>
    <div class='frontmatterauthor' >${this.uncode(style,author)}</div>
    <div class='frontmatterdate' >${this.uncode(style,date)}</div>
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
    all.push(`<ul class='' style='list-style:none;padding:0;'>`);
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
