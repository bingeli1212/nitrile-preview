'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewPage extends NitrilePreviewHtml {

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
  to_page_document() {
    ///do translate
    this.identify();
    this.translate();
    ///translate to html
    var html = this.to_beamer();
    //putting them together
    var margintop = '0';
    //var fontfamily = this.conf('slide.font-family','serif');
    var fontfamily = '';
    var fontsize = this.conf('slide.font-size','12pt');
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


  main {
    box-sizing:border-box;
    padding:1px 0;
    background-color: white;
    font-family:${fontfamily};
    font-size:${fontsize};
    line-height: ${lineheight};
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
    margin-left:0;
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
  .slide div.TEXT.QUOTE {
    font-style: italic;
  }
  .slide div.TEXT.QUOTE::before {
    content: "\\201C";
  }
  .slide div.TEXT.QUOTE::after {
    content: "\\201D";
  }
  
  .slide ul.PLST {
    position: relative;
    list-style: none;
    margin: 0;
    padding-left: ${paddingleftplst};
  }
  .slide > ul.PLST > li.PLST {
    margin: ${topmargin} 0;
  }
  .slide ul.PLST > li.PLST::before {
    content: "\\25B8";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(20px,0) scale(2,0.8);
  }
  .slide ul.PLST > li.PLST.SOLUTION::before {
    content: "\\25BE";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(20px,0) scale(1,2);
  }

  .slide ol.PLST {
    margin: 0;
    padding-left: ${paddingleftplst};
  }
  .slide > ol.PLST > li.PLST {
    margin: ${topmargin} 0;
  }


  .slide > ul.PLST > ul.PLST {
    font-size: 96%;
    margin: ${topmargin} 0;
  } 
  .slide > ul.PLST > ol.PLST {
    font-size: 96%;
    margin: ${topmargin} 0;
  }
  .slide > ol.PLST > ul.PLST {
    font-size: 96%;
    margin: ${topmargin} 0;
  } 
  .slide > ol.PLST > ol.PLST {
    font-size: 96%;
    margin: ${topmargin} 0;
  }

  .slide ul.TOPIC {
    position: relative;
    list-style: none;
    margin: 0;
    padding-left: ${paddingleftplst};
  }
  .slide ul.TOPIC > li.TOPIC::before {
    content: "\\2013";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(20px,0);
  }

  .slide > dl.PLST > dt.PLST {
    margin: ${topmargin} 0;
  }
  .slide > dl.PLST > dd.PLST {
    padding-left: ${paddingleftdd};
  }
  .slide dl.PLST {
    margin: 0;
  }

  .slide > div.TEXT {
    margin: ${topmargin} 0;
  }
  .slide div.NSPACE {
    padding-left: ${paddingleftnspace};
  }

  .slide > div.SAMP {
    margin: ${topmargin} 0;
    padding-left: ${paddingleftplst};
    font-size: 96%;
  }

  .slide figure {
    margin: ${topmargin} 0;
  }
  .slide div.TEXT {
    margin: ${topmargin} 0;
  }
  .slide div.BULL .ITEM {
    margin-left: 0.75cm;
    text-indent: -0.75cm;
  }

  .slide div.TEXT.MULTI .RIFT {
    padding-top: 0.3em;
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
    ///main slide
    if(frame.contents.length || frame.topics.length ){
      all.push(`<section class='slide'>`);
      all.push(`<h2 class='frametitle'>${++this.frameid} &#160; ${title} </h2>`);
      frame.contents.forEach((x,i) => {
        all.push('');
        all.push(x.html.trim());
      })
      frame.topics.forEach((o,i,arr) => {
        if(i==0){
          all.push(`<ul class='TOPIC'>`);
        }
        all.push(`<li class='TOPIC' > <i>${o.title}</i> </li>`);
        if(i+1==arr.length){
          all.push(`</ul>`);
        }
      });
      all.push('</section>');
      all.push('');
    }
    ///topic slides
    frame.topics.forEach((o,i,arr) => {
      all.push(`<section class='slide'>`);
      all.push(`<h2 class='frametitle'>${++this.frameid} &#160; ${title} ${ndash} <i>${o.title}</i> </h2>`);
      o.contents.forEach((x,i) => {
        all.push(x.html.trim());
      });
      all.push(`</ul>`)
      all.push('</section>');
      all.push('');
    });
    ///solution-slides
    frame.solutions.forEach((o,i,arr) => {
      all.push(`<section class='slide'>`);
      all.push(`<h2 class='frametitle'>${++this.frameid} &#160; ${title} ${ndash} <i>${o.title}</i> </h2>`);
      if(o.text){
        all.push(`<div class='PLST SOLUTION'> ${o.text} </div>`);
      }
      o.contents.forEach((x,i) => {
        all.push('');
        all.push(x.html.trim());
      });
      all.push('</section>');
      all.push('');
    })
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
module.exports = { NitrilePreviewPage };
