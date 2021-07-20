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
    this.n_marginleft = 0;
    this.n_marginright = 0;
    this.n_lineheight = '1.15';
    this.n_fontfamily = 'sans-serif';
    this.n_fontsize = '10pt';
    this.css_map = this.to_css_map()
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
    var templated_css = this.to_templated_css(this.n_para,this.n_pack,this.n_half,this.n_marginleft,this.n_marginright);
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
