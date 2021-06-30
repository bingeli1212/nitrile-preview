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
    this.n_para = '1.0em';
    this.n_pack = '1.0pt';
    this.n_half = '0.5em';
  }
  to_document() {
    ///translate to html
    var html = this.to_page();
    ///replace all referenced labels
    html = this.replace_all_refs(html);
    //putting them together
    var margintop = '0';
    var fontfamily   = this.conf_to_string('font-family','serif');
    var fontsize     = this.conf_to_string('font-size','12pt');
    var lineheight   = this.conf_to_string('line-height','1.13');
    var topmargin    = '5pt';
    var paddingleftplst = '0.75cm';
    var paddingleftdd = '1.15cm';
    var paddingleftnspace = '0.5cm';
    var margintop = '10px';
    var button_html='';
    var title = this.parser.conf_to_string('title');
    var style = this.parser.style;
    var templated_css = this.to_templated_css(this.n_para,this.n_pack,this.n_half);
    if(title){
      title = this.uncode(style,title);
    }
    var data = `\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
${templated_css}
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
    console.log('james','write_paper_part');
    let every = [];
    if(1){
      let my = top[0];
      top = top.slice(1);
      this.num_parts++;
      let idnum = this.num_parts;
      let all = [];
      all.push(`<h1>${this.uncode(my.style,my.title)}</h1>`);
      var html = all.join('\n')
      html = `<section class='part'>${html}</section>`
      var title = this.uncode(my.style,my.title);
      var title = `Part.${my.partnum} ${title}`;
      every.push({html,title});
    }
    top.forEach((o, i) => {
      if (Array.isArray(o) && o.length && o[0].sig=='HDGS' && o[0].hdgn=='0') {
    console.log('james','write_paper_chapter');
        var {html,title} = this.write_paper_chapter(o);
        every.push({html,title});
      } 
    });
    return every;
  }
  write_paper_chapter(top) {
    console.log('james','write_paper_chapter');
    let my = top.shift();
    let all = [];
    all.push('');
    this.num_chapters++;
    let idnum = this.num_chapters;
    all.push(`<h1>${this.uncode(my.style,my.title)}</h1>`);
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
    var title = this.uncode(my.style,my.title);
    console.log('james','my.chapternum=',my.chapternum);
    var title = `${my.chapternum}. ${title}`;
    return {html,title};
  }
  write_paper_section(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.uncode(my.style,my.title)}</h1>`);
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
    var title = this.uncode(my.style,my.title);
    return {html,title};
  }
  write_paper_subsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.uncode(m.style,my.title)}</h1>`);
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
    var title = this.uncode(my.style,my.title);
    return {html,title};
  }
  write_paper_subsubsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.uncode(my.style,my.title)}</h1>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    html = `<section class='subsubsection'>${html}</section>`
    var title = this.uncode(my.style,my.title);
    return {html,title};
  }
 
  to_frontmatter_frame(block){
    let title        = this.parser.conf_to_string('title');
    let subtitle     = this.parser.conf_to_string('subtitle')
    let institute    = this.parser.conf_to_string('institute');
    let author       = this.parser.conf_to_string('author');
    let style        = this.parser.style;
    let data = `<section id='frontmatter' class='slide'>
    <p class='frontmattertitle' style='text-align:center;font-weight:bold;font-size:1.5em'>${this.uncode(style,title)}</p>
    <p style='text-align:center'>${this.uncode(style,subtitle)}</p>
    <p style='text-align:center'>${this.uncode(style,author)}</p>
    <p style='text-align:center;font-variant:small-caps'>${this.uncode(style,institute)}</p>
    </section>
    `;
    return data;
  }

  ////////////////////////////////////////////////////////////////////////////////
  //
  // override the super class
  //
  ////////////////////////////////////////////////////////////////////////////////
  hdgs_to_part(title,label,partnum,chapternum,level,style){
    return(`<h1>Part.${partnum} ${this.uncode(style,title)}</h1>`);
  }
  hdgs_to_chapter(title,label,partnum,chapternum,level,style){
    return(`<h1>Chapter.${chapternum} &#160; ${this.uncode(style,title)}</h1>`);
  }
  hdgs_to_section(title,label,partnum,chapternum,level,style){
    if(chapternum){
      return(`<h2>${chapternum}.${level}. ${this.uncode(style,title)}</h2>`);  
    }
    return(`<h2>${level}. ${this.uncode(style,title)}</h2>`);
  }
  hdgs_to_subsection(title,label,partnum,chapternum,level,style){
    if(chapternum){
      return(`<h3>${chapternum}.${level}. ${this.uncode(style,title)}</h3>`);  
    }
    return(`<h3>${level}. ${this.uncode(style,title)}</h3>`);
  }
  hdgs_to_subsubsection(title,label,partnum,chapternum,level,style){
    if(chapternum){
      return(`<h4>${chapternum}.${level}. ${this.uncode(style,title)}</h4>`);  
    }
    return(`<h4>${level}. ${this.uncode(style,title)}</h4>`);
  }
}
module.exports = { NitrilePreviewPage };
