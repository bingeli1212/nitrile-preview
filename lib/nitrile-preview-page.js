'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPaper } = require('./nitrile-preview-paper');

class NitrilePreviewPage extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.frames = 0;
    this.ending = '';
    this.frameid = 0;
    this.eid = 0;///exercise id
    this.paper = new NitrilePreviewPaper(this);
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
    let top = this.paper.to_top_part(this.parser.blocks);
    let text = this.write_paper(top);
    return text;
  }
  write_paper(top) {
    let all = [];
    if(this.paper.num_parts == 0 && this.paper.num_chapters == 0){
      ///sections
      top.forEach((o, i) => {
        if (Array.isArray(o)) {
          /// is a section
          let data = this.write_paper_section(o);
          all.push(data);
        } else {
          all.push(o.html);
        }
      })
      return all.join('\n');
    }else{
      ///part and chapter
      top.forEach((o, i) => {
        if (Array.isArray(o)) {
          let data = this.write_paper_part(o);
          all.push(data);
        } else {
          all.push(o.html);
        }
      });
      return all.join('\n');
    }
  }
  write_paper_part(top) {
    let my = top.shift();
    if(my.sig=='PART'){
      ///great!
    }else{
      ///put it back
      top.unshift(my);
      my=null;
    }
    let all = [];
    all.push('');
    if(my){
      all.push(`<h1>${this.unmask(my.title)}</h1>`);
    }
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.write_paper_chapter(o);
        all.push(data);
      } else {
        all.push(o.html);
      }
    });
    var text = all.join('\n');
    text = `<section class='part'>${text}</section>`
    return text;
  }
  write_paper_chapter(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.write_paper_section(o);
        all.push(data);
      } else {
        all.push(o.html);
      }
    });
    var text = all.join('\n');
    text = `<section class='chapter'>${text}</section>`
    return text;
  }
  write_paper_section(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.write_paper_subsection(o);
        all.push(data);
      } else {
        all.push(o.html);
      }
    });
    var text = all.join('\n');
    text = `<section class='section'>${text}</section>`
    return text;
  }
  write_paper_subsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<section>${this.unmask(my.title)}</section>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        var data = this.write_paper_subsubsection(o);
        all.push(data);
      }else{
        all.push(o.html);
      }
    });
    var text = all.join('\n');
    text = `<section class='subsection'>${text}</section>`
    return text;
  }
  write_paper_subsubsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        all.push(o.html);
      }
    });
    var text = all.join('\n');
    text = `<section class='subsubsection'>${text}</section>`
    return text;
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
