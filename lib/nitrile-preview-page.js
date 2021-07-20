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
  to_peek_document() {
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var html = all.join('\n');
    html = this.replace_all_refs(html);
    return html;
  }
  to_document() {
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var html = all.join('\n');
    html = this.replace_all_refs(html);
    var title = this.parser.conf_to_string('title');
    var style = this.parser.style;
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
</style>
</head>
<body>
${html}
</body>
</html>
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
