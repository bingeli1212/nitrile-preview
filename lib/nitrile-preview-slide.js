'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.presentation = new NitrilePreviewPresentation(this);
    this.keypoint_icon = '&#x2756;'
    this.exercise_icon = '&#x270E;'
    this.margin_p = '5pt';
    this.margin_p_inner = '0pt';
    this.margin_li = '5pt';
    this.margin_li_inner = '0pt';
    this.padding_ul = '0.75cm';
    this.padding_ol = '0.75cm';
    this.padding_ul_inner = '0.5cm';
    this.padding_ol_inner = '0.5cm';
    this.padding_dd = '1.15cm';
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
    this.translate();
    ///translate to html
    var titlelines = this.to_titlelines();
    var html = this.to_beamer();
    var html = this.replace_all_refs(html);
    //var fontfamily = this.conf('slide.font-family','serif');
    var fontfamily = this.conf('slide.font-family','sans-serif');
    var fontsize = this.conf('slide.font-size','11pt');
    var lineheight = this.conf('slide.line-height','1.13');
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
      padding:10px 36px 10px 36px;
      min-width:100%;
      max-width:100%;
      min-height:100%;
      max-height:100%;
      box-sizing:border-box;
      overflow: hidden;
    }

    .container {
      display: flex;
      height: 80mm;
      width: 100%;
      flex-direction: column;
    }
    .container::before {
      content: "";
      flex: 4;
    }
    .container::after {
      content: "";
      flex: 5;
    }
    .element {
      align-self: center;
      margin: 0;
      width: 100%;
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
      margin: 2em auto;
      padding:10px 36px 10px 36px;
      min-width:128mm;
      max-width:128mm;
      min-height:96mm;
      max-height:96mm;
      box-sizing:border-box;
      overflow: hidden;
    }

    .container {
      display: flex;
      height: 80mm;
      width: 100%;
      flex-direction: column;
    }
    .container::before {
      content: "";
      flex: 4;
    }
    .container::after {
      content: "";
      flex: 5;
    }
    .element {
      align-self: center;
      margin: 0;
      width: 100%;
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

  table {
    border-collapse:collapse;
  }

  article .frontmattertitle {
    font-size: 1.3em;
    color: #1010B0;
  }

  article .frametitle {
    margin-left:-22px;
    margin-top:0;
    margin-bottom:0;
    font-size:1.3em;
    font-weight:normal;
    color: #1010B0;
  }

  article .framesubtitle {
    margin-left:-22px;
    margin-top:4px;
    margin-bottom:0;
    font-size:0.8em;
    font-weight:normal;
    color: #1010B0;
  }

  article .P.BLOCKQUOTE {
    font-style: italic;
  }
  article .P.BLOCKQUOTE::before {
    content: "\\201C";
  }
  article .P.BLOCKQUOTE::after {
    content: "\\201D";
  }
  
  article .PLST.HL {
    list-style: none;
    padding-left: ${paddingleftplst};
  }
  article .PLST.HL > li {
    text-indent: -${paddingleftplst};
  }

  article .PLST.OL {
    padding-left: ${paddingleftplst};
  }
  article .PLST.UL {
    padding-left: ${paddingleftplst};
    list-style-type: square;
  }

  article .PLST.INNER {
    margin: 0;
    font-size: 96%;
  } 
  article .PLST.UL.INNER, .PLST.OL.INNER {
    padding-left: 20px;
  }
  article .PLST > dd {
    padding-left: ${paddingleftdd};
  }

  article .P {
    margin: ${margintop} 0;
  }

  article .PLST .PLST .P {
    margin: 0;
  }

  .DISPLAYMATH {
    display: block;
    margin: ${margintop} auto;
  }

</style>
</head>
<body>
<main>
${titlelines}
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
    var toc = this.write_frame_contents(topframes);
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d.join('\n');
  }
  write_frame_contents(topframes){
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
    topframes.forEach((frame,i,arr) => {
      if(i==0){
        all.push(`<ul style='list-style:none;padding:0;font-size:${fontsize};'>`);
      }
      let icon = frame.isex?this.exercise_icon:this.keypoint_icon;
      all.push(`<li> ${icon} ${frame.title} </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    ///FONTS
    var text = all.join('\n')
    /// div
    all = [];
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'> Contents </h1>`);
    all.push(`<div class='container'>`);
    all.push(`<div class='element'>`)
    all.push(text);
    all.push('</div>')
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
    let icon = frame.isex?this.exercise_icon:this.keypoint_icon;
    let title = frame.title;
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'>${icon} ${title} </h1>`);
    all.push(`<div class='container'><div class='element'>`)
    frame.contents.forEach((x,i) => {
      if(x.html){
        all.push('');
        all.push(x.html.trim());
      }
    })
    subframes.forEach((subframe,i,arr) => {
      if(i==0){
        all.push(`<ul style='list-style:none;padding:0;'>`);
      }
      ///'o' is blocks
      let icon = subframe.isex?this.exercise_icon:this.keypoint_icon;
      all.push(`<li> ${icon} ${subframe.title} </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push('</div></div></article>');
    all.push('');
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  write_frame(frame){
    let all = [];
    //let my_id = this.get_refmap_value(my.style,'idnum');
    let icon = frame.isex?this.exercise_icon:this.keypoint_icon;
    let title = frame.title;

    //
    //NOTE: main contents
    //
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'>${icon} ${title} </h1>`);
    all.push(`<div class='container'><div class='element'>`)
    frame.contents.forEach((x,i) => {
      if(x.html){
        all.push('');
        all.push(x.html.trim());
      }
    })
    frame.solutions.forEach((o,i,arr) => {
      if(i==0){
        all.push(`<ul style='list-style:none;padding:0;margin:0;'>`);
      }
      var the_icon = this.icon_cdigits[i]||this.icon_writing_hand;
      if(arr.length==1) the_icon = this.icon_writing_hand;
      ///TESTING
      the_icon = this.to_circled_number_svg(i+1);
      if(arr.length==1) the_icon = this.icon_writing_hand;
      all.push(`<li> ${the_icon} <i>${o.title}</i> </li>`);
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
      var the_icon = this.icon_cdigits[i]||this.icon_writing_hand;
      if(arr.length==1) the_icon = this.icon_writing_hand;
      ///TESTING
      the_icon = this.to_circled_number_svg(i+1);
      if(arr.length==1) the_icon = this.icon_writing_hand;
      all.push(`<article>`);
      if(1){
        all.push(`<hgroup>`);
        all.push(`<h1 class='frametitle'>${icon} ${title} </h1>`);
        all.push(`<h2 class='framesubtitle'> ${the_icon} <i>${o.title}</i> &#160; ${o.text.trim()} </h2>`)
        all.push(`</hgroup>`);
      }else{
        all.push(`<h1 class='frametitle'> ${the_icon} <i>${o.title}</i> &#160; ${o.text.trim()} </h1>`)
      }
      all.push(`<div class='container'><div class='element'>`)
      o.contents.forEach((x,i) => {
        if(x.html){
          all.push('');
          all.push(x.html.trim());
        }
      });
      all.push('</div></div></article>');
      all.push('');
    })
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_titlelines(){
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
    let data = `<article>
    <h1 class='frametitle'></h1>
    <div class='container'><div class='element'>
    <div class='frontmattertitle' style='text-align:center;font-weight:bold;font-size:1.5em'>${this.uncode(title)}</div>
    <div class='frontmattersubtitle' style='text-align:center'>${this.uncode(subtitle)}</div>
    <div class='frontmatterauthor' style='text-align:center'>${this.uncode(author)}</div>
    <div class='frontmatterinstitute' style='text-align:center;font-variant:small-caps'>${this.uncode(institute)}</div>
    <div class='frontmatterdate' style='text-align:center'>${this.uncode(date)}</div>
    </div></div>
    </article>
    `;
    return data;
  }
}
module.exports = { NitrilePreviewSlide };
