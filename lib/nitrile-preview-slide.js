'use babel';

const out = require('jszip/lib/object');
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.frames = 0;
    this.ending = '';
    this.frameid = 0;
    this.eid = 0;///exercise id
    this.presentation = new NitrilePreviewPresentation(this);
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
    var html = this.to_beamer();
    //putting them together
    var margintop = '0';
    //var fontfamily = this.conf('slide.font-family','serif');
    var fontfamily = this.conf('slide.font-family','sans-serif');
    var fontsize = this.conf('slide.font-size','11pt');
    var lineheight = this.conf('slide.line-height','1.13');
    var topmargin = '5pt';
    var paddingleftplst = '0.75cm';
    var paddingleftdd = '1.15cm';
    var paddingleftnspace = '0.5cm';
    var margintop = '10px';
    var button_html='';
    var data = `\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${this.unmask(this.conf('title'))}</title>
<style>

  @media print {

    @page {
      size: 128mm 96mm;
    }  

    .slide {
      page-break-after: always;
      background-color: white;
      font-family:${fontfamily};
      font-size:${fontsize};
      line-height: ${lineheight};
      margin: auto auto;
      padding:${margintop} 36px ${margintop} 36px;
      min-width:100%;
      max-width:100%;
      min-height:100%;
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

    .slide {
      background-color: white;
      font-family:${fontfamily};
      font-size:${fontsize};
      line-height: ${lineheight};
      margin: 1em auto;
      padding:${margintop} 36px ${margintop} 36px;
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
    margin-bottom:0.3em;
    font-size:1.3em;
    font-weight:normal;
    color: #1010B0;
  }

  .slide ul.TEXT {
    padding-left: 20px;
    margin:0;
  }
  .slide ol.TEXT {
    padding-left: 20px;
    margin:0;
  }
  .slide dl.TEXT {
    margin:0;
  }
  .slide p.TEXT.QUOTE {
    font-style: italic;
  }
  .slide p.TEXT.QUOTE::before {
    content: "\\201C";
  }
  .slide p.TEXT.QUOTE::after {
    content: "\\201D";
  }
  
  .slide ul.PLST {
    list-style: none;
    margin: 0;
    padding-left: ${paddingleftplst};
  }
  .slide li.PLST {
    position: relative;
  }
  .slide ul.PLST > li.PLST::before {
    content: "\\25B8";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(-10px,0) scale(2,0.8);
  }

  .slide ol.PLST {
    margin: 0;
    padding-left: ${paddingleftplst};
  }

  .slide ul.PLST.INNER {
    font-size: 96%;
  } 
  .slide ol.PLST.INNER {
    font-size: 96%;
  }
  .slide dl.PLST.INNER {
    font-size: 96%;
  } 

  .slide ul.SOLUTION {
    list-style: none;
    margin: 0;
    padding-left: 0;
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

  .slide dd.PLST {
    padding-left: ${paddingleftdd};
  }


  .slide p.CITE {
    padding-left: 1.5em;
    text-indent: -1.5em;
    margin: ${topmargin} 0;
  }
  .slide pre.SAMP {
    margin: ${topmargin} 0;
  }
  .slide p.PARA {
    margin: ${topmargin} 0;
  }
  .slide li.PLST.OUTER {
    margin: ${topmargin} 0;
  }
  .slide dt.PLST.OUTER {
    margin: ${topmargin} 0;
  }
  .slide ul.TOPIC {
    margin: ${topmargin} 0;
  }
  .slide figure {
    margin: ${topmargin} 0;
  }

</style>
</head>
<body>
<main>
${html}
</main>
${button_html}
</body>
</html>
`;
    return data;
  }
  to_beamer() {
    let top = this.presentation.to_tops(this.parser.blocks);
    let frames = this.presentation.to_frames(top);
    //export frames
    let outs = [];
    ///export the front matter frame
    if(typeof top[0]=='object' && top[0].sig == 'FRNT'){
      outs.push(this.to_frontmatter_frame(top[0]));
    }
    ///export frames
    frames.forEach((frame) => {
      let out = this.write_frame(frame);
      outs.push(out);
    });
    return outs.join('\n');
  }
  write_frame(frame){
    let all = [];
    //let my_id = this.get_refmap_value(my.style,'idnum');
    let title = frame.title;
    let box = '&#x2610;'
    let cbox = '&#x2611;'
    let rtri = '&#x25B8;'
    let dtri = '&#x25BE;'
    let checkmark = '&#x2713;'
    let ndash = '&#x2013;'
    let sigs = [];
    let rule = '_______';

    if(frame.solutions.length){

      ///main slide
      all.push(`<section class='slide'>`);
      all.push(`<h2 class='frametitle'>${++this.frameid} &#160; ${title} </h2>`);
      all.push(`<div class='container'><div class='element'>`)
      frame.contents.forEach((x,i) => {
        all.push('');
        all.push(x.html.trim());
      })
      frame.solutions.forEach((o,i,arr) => {
        if(i==0){
          all.push(`<ul class='SOLUTION'>`);
        }
        all.push(`<li class='SOLUTION' > <i>${o.title}</i> &#160; ${rule} </li>`);
        if(i+1==arr.length){
          all.push(`</ul>`);
        }
      });
      all.push('</div></div></section>');
      all.push('');
            
      /// individual solution-slides
      frame.solutions.forEach((o,i,arr) => {
        all.push(`<section class='slide'>`);
        all.push(`<h2 class='frametitle'>${++this.frameid} &#160; ${title} </h2>`);
        all.push(`<div class='container'><div class='element'>`)
        all.push(`<ul class='SOLUTION' >`)
        if(o.text){
          all.push(`<li class='SOLUTION' > <i>${o.title}</i> &#160; <u>${o.text}</u> </li>`);
        }else{
          all.push(`<li class='SOLUTION' > <i>${o.title}</i> &#160; ${rule} </li>`);
        }
      
        o.contents.forEach((x,i) => {
          all.push('');
          all.push(x.html.trim());
        });
        
        all.push('</ul>')
        all.push('</div></div></section>');
        all.push('');
      })

    } 

    else if(frame.topics.length){

      /// main slide
      all.push(`<section class='slide'>`);
      all.push(`<h2 class='frametitle'>${++this.frameid} &#160; ${title} </h2>`);
      all.push(`<div class='container'><div class='element'>`)
      frame.contents.forEach((x,i) => {
        all.push('');
        all.push(x.html.trim());
      })
      frame.topics.forEach((o,i,arr) => {
        if(i==0) { all.push(`<ul class='TOPIC'>`); }
        all.push(`<li class='TOPIC${i+1}' > <i>${o.title}</i> </li>`);
        if(i+1==arr.length) { all.push(`</ul>`); }
      });
      all.push('</div></div></section>');
      all.push('');

      /// individual topic slides
      frame.topics.forEach((o,i,arr) => {
        all.push(`<section class='slide'>`);
        all.push(`<h2 class='frametitle'>${++this.frameid} &#160; ${title} </h2>`);
        all.push(`<div class='container'><div class='element'>`)
        all.push(`<ul class='TOPIC' >`)
        all.push(`<li class='TOPIC${i+1}' > <i>${o.title}</i> </li>`)
        o.contents.forEach((x,i) => {
          all.push(x.html.trim());
        });
        all.push(`</ul>`)
        all.push('</div></div></section>');
        all.push('');
      });

    }

    else{
      
      /// no solutions and no topics
      /// main slide
      all.push(`<section class='slide'>`);
      all.push(`<h2 class='frametitle'>${++this.frameid} &#160; ${title} </h2>`);
      all.push(`<div class='container'><div class='element'>`)
      frame.contents.forEach((x,i) => {
        all.push('');
        all.push(x.html.trim());
      })
      all.push('</div></div></section>');
      all.push('');

    }


    return all.join('\n');
  }
  to_frontmatter_frame(block){
    let title = '';
    let subtitle = '';
    let institute = '';
    let author = '';
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
    <p class='frontmattertitle' style='text-align:center;font-weight:bold;font-size:1.5em'>${this.unmask(title)}</p>
    <p style='text-align:center'>${this.unmask(subtitle)}</p>
    <p style='text-align:center'>${this.unmask(author)}</p>
    <p style='text-align:center;font-variant:small-caps'>${this.unmask(institute)}</p>
    </section>
    `;
    return data;
  }
}
module.exports = { NitrilePreviewSlide };
