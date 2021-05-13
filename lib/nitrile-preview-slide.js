'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.presentation = new NitrilePreviewPresentation(this);
    this.icon_keypoint = '&#x2756;'//Black Diamond Minus White X
    this.icon_exercise = '&#x270E;'//Lower Right Pencil
    this.icon_folder   = '&#x27A5;'//Heavy Black Curved Downwards and Rightwards Arrow
    this.icon_solution = '&#x270D;'//Writing Hand
    this.margin_p         = '5pt';
    this.margin_p_inner   = '5pt';
    this.margin_li        = '5pt';
    this.margin_li_inner  = '0pt';
    this.padding_ul       = '0.75cm';
    this.padding_ul_inner = '0.5cm';
    this.padding_ol       = '0.75cm';
    this.padding_ol_inner = '0.5cm';
    this.padding_hl       = '0.75cm';
    this.padding_hl_inner = '0.5cm';
    this.padding_dd       = '1.15cm';
    let box = '&#x2610;'
    let cbox = '&#x2611;'
    let rtri = '&#x25B8;'
    let dtri = '&#x25BE;'
    let checkmark = '&#x2713;'
    let ndash = '&#x2013;'
    let pencil = '&#x270E;'
    let sigs = [];
    let rule = '_______';
  }
  to_document() {
    //this.translate();
    ///translate to html
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    var html = this.replace_all_refs(html);
    var fontfamily = this.conf_to_string('slide.font-family','serif');
    var fontsize = '11pt';
    var lineheight = '1.13';
    var margintop = '5pt';
    var paddingleftplst = '0.75cm';
    var paddingleftdd = '1.15cm';
    var paddingleftnspace = '0.5cm';
    var button_html='';
    var title = this.conf_to_string('title');
    var style = this.parser.style;
    var data = `\
<!DOCTYPE html>
<html>
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
      font-family:${fontfamily};
      font-size:${fontsize};
      line-height: ${lineheight};
      margin: auto auto;
      min-width:100%;
      max-width:100%;
      min-height:90mm;
      max-height:100%;
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
      font-family:${fontfamily};
      font-size:${fontsize};
      line-height: ${lineheight};
      margin: 1em auto;
      min-width:128mm;
      max-width:128mm;
      min-height:96mm;
      max-height:96mm;
      box-sizing:border-box;
      overflow: hidden;
    }

    main {
      background-color: gray;
      box-sizing:border-box;
      padding:1px 0;
    }

  }

  article {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  body {
    margin:0;
    padding:0;
  }

  .frontmattertitle {
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
    margin-top: 0.8cm;
    margin-bottom: 0;
    width: 115mm;
    font-size: 1.1em;
    text-align: center;
    align-self: center;
  }

  .frontmatterinstitute {
    margin-top: 0.2cm;
    margin-bottom: 0;
    width: 115mm;
    font-size: 1.1em;
    text-align: center;
    align-self: center;
  }

  .frontmatterauthor {
    margin-top: 0.2cm;
    margin-bottom: 0;
    width: 115mm;
    font-size: 1.1em;
    text-align: center;
    align-self: center;
  }

  .frontmatterdate {
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

  .FIGURE, .TABLE, .LONGTABLE, .EQUATION {
    margin-top: 5pt;
    margin-bottom: 0;
    text-align: center;
    align-self: center;
  }

  .ITEMIZE, .PARAGRAPH {
    align-self: center;
    margin-top: 5pt;
    margin-bottom: 0;
    width: 115mm;
  }

  .COMBINATION {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .FIGCAPTION {
    margin-top: 0;
    margin-bottom: 5pt;
  }

  .SUBFIGURE {
    table-layout:fixed;
    display:inline-table;
  }

  .WRAPLEFT {
    float: left;
    margin-right: 0.68em;
  }

  .WRAPRIGHT {
    float: right;
    margin-left: 0.68em;
  }

  .DISPLAYMATH {
    text-align:center;
  }

  .SAMPLE {
    padding-left:0em;
    padding-right:0em;
  }

  .PARA {
    margin: 5pt 0;
  }

  .LINE {
    margin: 0.10em 0;
  }

  .PACK {
    margin: 1pt 0;
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
    padding: 0.18ex 1.10ex;
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
        let out = this.write_topics_frame(topframe,subframes);
        d.push(out);
        subframes.forEach((subframe) => {
          let out = this.write_frame(subframe);
          d.push(out);
        });
      }else{
        let out = this.write_frame(topframe);
        d.push(out);
      }
    });
    var main = d.join('\n');
    //
    //table of contents
    //
    var toc = this.write_contents_frame(topframes);
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d.join('\n');
  }
  write_contents_frame(topframes){
    /// decide if we need to change fonts
    var all = [];
    topframes.forEach((topframe,i,arr) => {
      if(i==0){
        all.push(`<ul class='PARA UL' style='list-style:none;padding:0;'>`);
      }
      let icon = topframe.isex?this.icon_exercise:this.icon_keypoint;
      if(topframe.subframes){
        icon = this.icon_folder;
      }
      all.push(`<li class='LINE'> ${icon} ${this.uncode(topframe.style,topframe.title)} </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    ///FONTS
    var text = all.join('\n')
    /// div
    all = [];
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'> <b>Table Of Contents</b> </h1>`);
    all.push(`<div class='PARAGRAPH'>`)
    all.push(text);
    all.push('</div>')
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_topics_frame(frame,subframes){
    let all = [];
    //
    //NOTE: main contents
    //
    let icon = this.icon_folder;
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'>${icon} <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    all.push(`<div class='PARAGRAPH'>`)
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    subframes.forEach((subframe,i,arr) => {
      if(i==0){
        all.push(`<ul class='PARA UL' style='list-style:none;padding:0;'>`);
      }
      ///'o' is blocks
      let icon = subframe.isex?this.icon_exercise:this.icon_keypoint;
      all.push(`<li class='LINE'> ${icon} ${this.uncode(subframe.style,subframe.title)} </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push('</div></article>');
    all.push('');
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  write_frame(frame){
    let all = [];
    //let my_id = this.get_refmap_value(my.style,'idnum');
    let icon = frame.isex?this.icon_exercise:this.icon_keypoint;

    //
    //NOTE: main contents
    //
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'>${icon} <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    frame.solutions.forEach((o,i,arr) => {
      if(i==0){
        all.push(`<ul class='PARAGRAPH' style='list-style:none;padding:0;'>`);
      }
      ///TESTING
      var the_icon = this.icon_solution;
      if(arr.length==1) the_icon = this.icon_solution;
      all.push(`<li class='LINE'> ${the_icon} <i>${this.uncode(o.style,o.title)}</i> </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push('</article>');
    all.push('');
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      ///TESTING
      var the_icon = '';
      if(arr.length==1) the_icon = this.icon_solution;
      all.push(`<article>`);
      if(1){
        all.push(`<hgroup>`);
        all.push(`<h1 class='frametitle'>${icon} <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
        all.push(`<h2 class='framesubtitle'> <i>${this.uncode(o.style,o.title)}</i> &#160; <b>${this.uncode(o.style,this.join_para(o.body)).trim()}</b> </h2>`)
        all.push(`</hgroup>`);
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
    let title = this.conf_to_string('title','Untitled');
    let subtitle = this.conf_to_string('subtitle')
    let institute = this.conf_to_string('institute');
    let author = this.conf_to_string('author');
    var date = new Date().toLocaleDateString();
    var style = this.parser.style;
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
}
module.exports = { NitrilePreviewSlide };
