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
<title>${this.uncode(this.conf('title'))}</title>
<style>

  figure {
    width:100%;
    margin:5pt 0;
    text-align:center;
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
${html}
</main>
${button_html}
</body>
</html>
`;
    return data;
  }
  to_page() {
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    return all.join('\n');
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
        if (Array.isArray(o) && o.length && o[0].sig=='HDGS' && o[0].name=='part') {
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
      all.push(`<h1>${this.uncode(my.title)}</h1>`);
      var html = all.join('\n')
      html = `<section class='part'>${html}</section>`
      var title = this.uncode(my.title);
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
    all.push(`<h1>${this.uncode(my.title)}</h1>`);
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
    var title = this.uncode(my.title);
    return {html,title};
  }
  write_paper_section(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.uncode(my.title)}</h1>`);
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
    var title = this.uncode(my.title);
    return {html,title};
  }
  write_paper_subsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.uncode(my.title)}</h1>`);
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
    var title = this.uncode(my.title);
    return {html,title};
  }
  write_paper_subsubsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.uncode(my.title)}</h1>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    html = `<section class='subsubsection'>${html}</section>`
    var title = this.uncode(my.title);
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
    <p class='frontmattertitle' style='text-align:center;font-weight:bold;font-size:1.5em'>${this.uncode(title)}</p>
    <p style='text-align:center'>${this.uncode(subtitle)}</p>
    <p style='text-align:center'>${this.uncode(author)}</p>
    <p style='text-align:center;font-variant:small-caps'>${this.uncode(institute)}</p>
    </section>
    `;
    return data;
  }

}
module.exports = { NitrilePreviewPage };
