'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.presentation = new NitrilePreviewPresentation(this);
    this.keypoint_icon = '&#x2756;'
    this.exercise_icon = '&#x270E;'
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
    var topmargin = '5pt';
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

    .slide {
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

    .slide {
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

  .slide.active {
  }

  .slide .frontmattertitle {
    font-size: 1.3em;
    color: #1010B0;
  }

  .slide h2.frametitle {
    margin-left:-22px;
    margin-top:0;
    margin-bottom:0;
    font-size:1.3em;
    font-weight:normal;
    color: #1010B0;
  }

  .slide h3.framesubtitle {
    margin-left:-22px;
    margin-top:4px;
    margin-bottom:0;
    font-size:0.8em;
    font-weight:normal;
    color: #1010B0;
  }

  .slide ul.P {
    padding-left: 20px;
    margin:0;
  }
  .slide ol.P {
    padding-left: 20px;
    margin:0;
  }
  .slide dl.P {
    margin:0;
  }
  .slide div.P.QUOTE {
    font-style: italic;
  }
  .slide div.P.QUOTE::before {
    content: "\\201C";
  }
  .slide div.P.QUOTE::after {
    content: "\\201D";
  }
  
  .slide .PLST.UL {
    list-style: none;
    margin: 0;
    padding-left: ${paddingleftplst};
  }
  .slide .PLST.UL > li {
    position: relative;
  }
  .slide .PLST.UL > li::before {
    content: "\\25B8";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-10px,0) scale(1.75,0.95);
  }

  .slide .PLST.HL {
    list-style: none;
    margin: 0;
    padding-left: ${paddingleftplst};
  }
  .slide .PLST.HL > li {
    text-indent: -${paddingleftplst};
  }

  .slide .PLST.OL {
    margin: 0;
    padding-left: ${paddingleftplst};
  }

  .slide .PLST.INNER {
    font-size: 96%;
  } 

  .slide div.BOX {
    position: relative;
  }
  .slide div.BOX::before {
    content: "\\2610";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-0.5ex,0) scale(1.2);
  }
  .slide div.CBOX {
    position: relative;
  }
  .slide div.CBOX::before {
    content: "\\2611";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-0.5ex,0) scale(1.2);
  }

  .slide ul.TOPIC {
    list-style: none;
    margin: 0;
    padding-left: ${paddingleftplst};
  }
  .slide li.TOPIC1 {
    position: relative;
  }
  .slide li.TOPIC1::before {
    content: "\\278A";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC2 {
    position: relative;
  }
  .slide li.TOPIC2::before {
    content: "\\278B";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC3 {
    position: relative;
  }
  .slide li.TOPIC3::before {
    content: "\\278C";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC4 {
    position: relative;
  }
  .slide li.TOPIC4::before {
    content: "\\278D";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC5 {
    position: relative;
  }
  .slide li.TOPIC5::before {
    content: "\\278E";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC6 {
    position: relative;
  }
  .slide li.TOPIC6::before {
    content: "\\278F";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC7 {
    position: relative;
  }
  .slide li.TOPIC7::before {
    content: "\\2790";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC8 {
    position: relative;
  }
  .slide li.TOPIC8::before {
    content: "\\2791";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC9 {
    position: relative;
  }
  .slide li.TOPIC9::before {
    content: "\\2792";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }
  .slide li.TOPIC10 {
    position: relative;
  }
  .slide li.TOPIC10::before {
    content: "\\2793";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-8px,0) scale(1,1);
  }

  .slide pre {
    margin: ${topmargin} 0;
  }
  .slide .P {
    margin: ${topmargin} 0;
  }

  .slide .PLST > dd {
    padding-left: ${paddingleftdd};
  }
  .slide .PLST.INNER p {
    margin: 0;
  }

  .slide ul.TOPIC {
    margin: ${topmargin} 0;
  }
  .slide figure {
    margin: ${topmargin} 0;
  }

  .DISPLAYMATH {
    display: block;
    margin: ${topmargin} auto;
  }

  .slide ul.CONTENTS {
    list-style: none;
    margin: 0;
    padding-left: ${paddingleftplst};
  }
  .slide ul.CONTENTS > li {
    position: relative;
    margin: 0 auto;
  }
  .slide ul.CONTENTS > li.KEYPOINT::before {
    content: "\\2756";
    position: absolute;
    display: inline-block;
    right: 100%;
    top: 50%;
    transform: translate(-10px,-50%) ;
  }
  .slide ul.CONTENTS > li.EXERCISE::before {
    content: "\\270E";
    position: absolute;
    display: inline-block;
    right: 100%;
    top: 50%;
    transform: translate(-10px,-50%) ;
  }

  .slide ul.SOLUTION {
    list-style: none;
    margin: 0;
    padding-left: 0;
  }
  .slide ul.SOLUTION > li {
    position: relative;
    margin: 0 auto;
  }
  .slide ul.SOLUTION > li::before {
    content: "";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-0.5ex,0) ;
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
    ///Process each section, and within each section the subsections
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
    var all = [];
    topframes.forEach((topframe,i,arr) => {
      if(topframe.isex){
        all.push(`<li class='EXERCISE'> ${topframe.title} </li>`);
      }else{
        all.push(`<li class='KEYPOINT'> ${topframe.title} </li>`);
      }
    });
    ///FONTS
    var text = all.join('\n')
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
    /// div
    all = [];
    all.push(`<section class='slide'>`);
    all.push(`<h2 class='frametitle'> Contents </h2>`);
    all.push(`<div class='container'>`);
    all.push(`<div class='element'>`)
    all.push(`<ul class='CONTENTS' style='font-size:${fontsize}'>`)
    all.push(text);
    all.push('</ul>')
    all.push('</div>')
    all.push('</div>')
    all.push('</section>');
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
    all.push(`<section class='slide'>`);
    all.push(`<h2 class='frametitle'>${icon} ${title} </h2>`);
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
    all.push('</div></div></section>');
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
    all.push(`<section class='slide'>`);
    all.push(`<h2 class='frametitle'>${icon} ${title} </h2>`);
    all.push(`<div class='container'><div class='element'>`)
    frame.contents.forEach((x,i) => {
      if(x.html){
        all.push('');
        all.push(x.html.trim());
      }
    })
    frame.solutions.forEach((o,i,arr) => {
      if(i==0){
        all.push(`<ul class='SOLUTION'>`);
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
    all.push('</div></div></section>');
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
      all.push(`<section class='slide'>`);
      if(1){
        all.push(`<h2 class='frametitle'>${icon} ${title} </h2>`);
        all.push(`<h3 class='framesubtitle'> ${the_icon} <i>${o.title}</i> &#160; ${o.text.trim()} </h3>`)
      }else{
        all.push(`<h2 class='frametitle'> ${the_icon} <i>${o.title}</i> &#160; ${o.text.trim()} </h2>`)
      }
      all.push(`<div class='container'><div class='element'>`)
      o.contents.forEach((x,i) => {
        if(x.html){
          all.push('');
          all.push(x.html.trim());
        }
      });
      all.push('</div></div></section>');
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
    let data = `<section id='frontmatter' class='slide'>
    <h2 class='frametitle'></h2>
    <div class='container'><div class='element'>
    <p class='frontmattertitle' style='text-align:center;font-weight:bold;font-size:1.5em'>${this.uncode(title)}</p>
    <p style='text-align:center'>${this.uncode(subtitle)}</p>
    <p style='text-align:center'>${this.uncode(author)}</p>
    <p style='text-align:center;font-variant:small-caps'>${this.uncode(institute)}</p>
    <p style='text-align:center'>${this.uncode(date)}</p>
    </div></div>
    </section>
    `;
    return data;
  }
}
module.exports = { NitrilePreviewSlide };
