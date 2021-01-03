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
    ///translate to html
    var html = this.to_page();
    ///replace all referenced labels
    html = this.replace_all_refs(html);
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

  .slide ul.PARA {
    padding-left: 20px;
    margin:0;
  }
  .slide ol.PARA {
    padding-left: 20px;
    margin:0;
  }
  .slide dl.PARA {
    margin:0;
  }
  .slide div.PARA.QUOTE {
    font-style: italic;
  }
  .slide div.PARA.QUOTE::before {
    content: "\\201C";
  }
  .slide div.PARA.QUOTE::after {
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

  .slide > div.PARA {
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
  .slide div.PARA {
    margin: ${topmargin} 0;
  }
  .slide div.BULL .ITEM {
    margin-left: 0.75cm;
    text-indent: -0.75cm;
  }

  .slide div.PARA.MULTI .RIFT {
    padding-top: 0.3em;
  }

  figure.EQUATION .IDNUM {
    position: absolute;
    right: 100%;
    transform: translate(-1ex,0);
  }
  figure.EQUATION .IDNUM::before {
    content: "(";
  }
  figure.EQUATION .IDNUM::after {
    content: ")";
  }

  figure.TABLE .IDNUM::after {
    content: ":\\00A0";
  }
  figure.FIGURE .IDNUM::after {
    content: ":\\00A0";
  }
  figure.LISTING .IDNUM::after {
    content: ":\\00A0";
  }

  figure.FIGURE table td {
    text-align: center;
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
  to_page() {
    let top = this.paper.to_top(this.parser.blocks);
    let every = this.write_paper(top);
    var this_contents = [];
    every.forEach((o,i) => {
      if (Array.isArray(o)){
        this_contents = this_contents.concat(o);
      }else{
        this_contents.push(o);
      }
    });
    let all_htmls = this_contents.map((p) => p.html );
    return all_htmls.join('\n');
  }
  write_paper(top) {
    let every = [];
    if(this.paper.num_parts == 0 && this.paper.num_chapters == 0){
      
      ///article
      ///if this is the case, the top contains a list of sections and abstracts
      let {html,title} = this.write_paper_article(top);
      every.push({html,title});
      return every;

    }if(this.paper.num_parts == 0){

      ///chapters and no-parts
      top.forEach((o, i, arr) => {
        if (Array.isArray(o) && o.length && o[0].sig=='HDGS' && o[0].hdgn=='0') {
          let {html,title} = this.write_paper_chapter(o);
          every.push({html,title});
        } else {
          let {html,title} = this.write_paper_article(o);
          every.push({html,title});
        }
      });
      return every;

    }else{

      ///parts and chapters
      ///if this is the case, top contains a list of parts, where
      /// each part is an array and the first block is a 'sig' of 'PART'
      // If 
      ///no part is specified, then top contains a single entry
      ///which contains a list of chapters
      top.forEach((o,oi,oarr) => {
        if (Array.isArray(o) && o.length && o[0].sig=='HDGS' && o[0].hdgn=='part') {
          let every1 = this.write_paper_part(o);
          every.push(every1);
        } else if (Array.isArray(o) && o.length) {
          ///the first child of 'o' is an frontmatter chapter, we treat it as an article
          o.forEach((p,pi,parr) => {
            if(Array.isArray(p) && p.length && p[0].sig=='HDGS'){
              let {html,title} = this.write_paper_chapter(p);
              every.push({html,title});
            }else{
              let {html,title} = this.write_paper_article(p);
              every.push({html,title});
            }
          });
        }
      });
      return every;
    }
  }
  write_paper_article(top) {
    let all = [];
    all.push('');
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var {html} = this.write_paper_section(o);
        all.push(html);
      } else {
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    html = `<article class='article'>${html}</article>`
    var title = '';
    return {html,title};
  }
  write_paper_part(top) {
    let every = [];
    if(1){
      let my = top[0];
      top = top.slice(1);
      this.num_parts++;
      let idnum = this.num_parts;
      let all = [];
      all.push(`<h1>${this.unmask(my.title)}</h1>`);
      var html = all.join('\n')
      html = `<section class='part'>${html}</section>`
      var title = this.unmask(my.title);
      every.push({html,title});
    }
    top.forEach((o, i) => {
      if (Array.isArray(o) && o.length && o[0].sig=='HDGS' && o[0].hdgn=='0') {
        var {html,title} = this.write_paper_chapter(o);
        every.push({html,title});
      } 
    });
    return every;
  }
  write_paper_chapter(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    this.num_chapters++;
    let idnum = this.num_chapters;
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var {html} = this.write_paper_section(o);
        all.push(html);
      } else {
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    html = `<section class='chapter'>${html}</section>`
    var title = this.unmask(my.title);
    return {html,title};
  }
  write_paper_section(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var {html} = this.write_paper_subsection(o);
        all.push(html);
      } else {
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    html = `<section class='section'>${html}</section>`
    var title = this.unmask(my.title);
    return {html,title};
  }
  write_paper_subsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        var {html} = this.write_paper_subsubsection(o);
        all.push(html);
      }else{
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    html = `<section class='subsection'>${html}</section>`
    var title = this.unmask(my.title);
    return {html,title};
  }
  write_paper_subsubsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    html = `<section class='subsubsection'>${html}</section>`
    var title = this.unmask(my.title);
    return {html,title};
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
