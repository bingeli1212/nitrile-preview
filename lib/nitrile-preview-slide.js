'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.presentation = new NitrilePreviewPresentation(this);
    this.icon_keypoint = '&#x2756;'
    this.icon_exercise = '&#x270E;'
    this.icon_folder   = '&#x25B6;'
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
  do_HDGS(block){
    let {hdgn} = block;
    ///reset the this.enumerate_counter if 'hdgn' is zero
    if(hdgn==1){
      this.enumerate_counter = 0;
    }
  }
  to_slide_document() {
    //this.translate();
    ///translate to html
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    var html = this.replace_all_refs(html);
    //var fontfamily = this.conf('slide.font-family','serif');
    var fontfamily = this.conf('slide.font-family','serif');
    var fontsize = this.conf('slide.font-size','11pt');
    var lineheight = '1.13';
    var margintop = '5pt';
    var paddingleftplst = '0.75cm';
    var paddingleftdd = '1.15cm';
    var paddingleftnspace = '0.5cm';
    var button_html='';
    var title = this.uncode(this.conf('title',''));
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
    font-size:1.3em;
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
    var fontsize = '';
    var num_frames = topframes.length;
    if(num_frames>10){
      fontsize = `90%`;
    }
    if(num_frames>15){
      fontsize = `80%`;
    }
    if(num_frames>20){
      fontsize = `70%`;
    }
    if(num_frames>25){
      fontsize = `50%`;
    }
    var all = [];
    topframes.forEach((topframe,i,arr) => {
      if(i==0){
        all.push(`<ul class='LINE' style='list-style:none;padding:0;font-size:${fontsize};'>`);
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
    all.push(`<h1 class='frametitle'> Table Of Contents </h1>`);
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
    all.push(`<h1 class='frametitle'>${icon} ${title} </h1>`);
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
    all.push(`<h1 class='frametitle'>${icon} ${title} </h1>`);
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
      var the_icon = this.icon_writing_hand;
      if(arr.length==1) the_icon = this.icon_writing_hand;
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
      if(arr.length==1) the_icon = this.icon_writing_hand;
      all.push(`<article>`);
      if(1){
        all.push(`<hgroup>`);
        all.push(`<h1 class='frametitle'>${icon} ${title} </h1>`);
        all.push(`<h2 class='framesubtitle'> <i>${o.title}</i> &#160; ${this.untext(o.body,o.style).trim()} </h2>`)
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
    let title = 'Untitled';
    let subtitle = '';
    let institute = '';
    let author = '';
    var date = new Date().toLocaleDateString();
    var block = this.parser.blocks[0];
    if(block && block.sig=='FRNT'){
      for(let t of block.data){
        let [key,val] = t;
        if(key=='title'){
          title = val;
        }
        if(key=='subtitle'){
          subtitle = val;
        }
        if(key=='author'){
          author = val;
        }
        if(key=='institute'){
          institute = val;
        }
      }
    }
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
