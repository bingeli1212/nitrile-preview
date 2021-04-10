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
    var title = this.uncode(this.conf_to_string('title'));
    var data = `\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
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
      padding:3mm 10mm 3mm 10mm;
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
      padding:3mm 10mm 3mm 10mm;
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

  body {
    margin:0;
    padding:0;
  }

  .frontmattertitle {
    font-size: 1.3em;
    color: #1010B0;
  }

  .frametitle {
    margin-left:-22px;
    margin-top:0;
    margin-bottom:0.3em;
    font-size:1.20em;
    font-weight:normal;
    color: #1010B0;
  }

  .framesubtitle {
    margin-left:-22px;
    margin-top:-0.3em;
    margin-bottom:0.3em;
    font-size:0.8em;
    font-weight:normal;
    color: #1010B0;
  }

  figure {
    width:100%;
    margin:5pt 0;
    text-align:center;
  }

  .LINE {
    margin: 0.15em 0;
  }

  .PARA {
    margin: 5pt 0;
  }

  .DL > .DD {
    padding-left: 1.15cm;
  }

  .HL {
    list-style: none;
    padding-left: 0.75cm;
  }
  .HL > .LI {
    text-indent: -0.75cm;
  }

  .OL {
    padding-left: 0.75cm;
  }

  .UL {
    padding-left: 0.75cm;
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
        all.push(`<ul class='LINE' style='list-style:none;padding:0;'>`);
      }
      let icon = topframe.isex?this.icon_exercise:this.icon_keypoint;
      if(topframe.subframes){
        icon = this.icon_folder;
      }
      all.push(`<li class='LINE'> ${icon} ${topframe.title} </li>`);
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
    all.push(`<div class='element'>`)
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
    let title = frame.title;
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'>${icon} <b>${title}</b> </h1>`);
    all.push(`<div class='element'>`)
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    subframes.forEach((subframe,i,arr) => {
      if(i==0){
        all.push(`<ul class='LINE' style='list-style:none;padding:0;'>`);
      }
      ///'o' is blocks
      let icon = subframe.isex?this.icon_exercise:this.icon_keypoint;
      all.push(`<li class='LINE'> ${icon} ${subframe.title} </li>`);
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
    let title = frame.title;

    //
    //NOTE: main contents
    //
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'>${icon} <b>${title}</b> </h1>`);
    all.push(`<div class='element'>`)
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    frame.solutions.forEach((o,i,arr) => {
      if(i==0){
        all.push(`<ul class='LINE' style='list-style:none;padding:0;'>`);
      }
      ///TESTING
      var the_icon = this.icon_solution;
      if(arr.length==1) the_icon = this.icon_solution;
      all.push(`<li class='LINE'> ${the_icon} <i>${o.title}</i> </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push('</div></div></article>');
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
        all.push(`<h1 class='frametitle'>${icon} <b>${title}</b> </h1>`);
        all.push(`<h2 class='framesubtitle'> <i>${o.title}</i> &#160; <b>${this.untext(o.body,o.style).trim()}</b> </h2>`)
        all.push(`</hgroup>`);
      }
      all.push(`<div class='element'>`)
      o.contents.forEach((x,i) => {
        //'x' is a block
        let html = this.translate_block(x);
        all.push('');
        all.push(html.trim());
      });
      all.push('</div></div></article>');
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
    let data = `<article style='display:flex; flex-direction:column; justify-content:center;' >
    <div>
    <div class='frontmattertitle' style='text-align:center;font-weight:bold;font-size:1.8em;margin:1cm auto;'>${this.uncode(title)}</div>
    <div class='frontmattersubtitle' style='text-align:center;font-size:1.1em;margin:0.2cm auto;'>${this.uncode(subtitle)}</div>
    <div class='frontmatterinstitute' style='text-align:center;font-size:1.1em;margin:0.2cm auto;'>${this.uncode(institute)}</div>
    <div class='frontmatterauthor' style='text-align:center;font-size:1.1em;margin:0.2cm auto;'>${this.uncode(author)}</div>
    <div class='frontmatterdate' style='text-align:center;font-size:1.1em;margin:0.2cm auto;'>${this.uncode(date)}</div>
    </div>
    </article>
    `;
    return data;
  }
}
module.exports = { NitrilePreviewSlide };
