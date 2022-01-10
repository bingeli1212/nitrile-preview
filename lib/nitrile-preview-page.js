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
  to_peek_document() {
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var html = all.join('\n');
    html = this.replace_all_refs(html);
    html = `<div class='PAGE'> ${html} </div>`;
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
    var style_css = `
.PARAGRAPH {
  text-indent: initial;
  margin-left:  0;
  margin-right: 0;
}
.PARAGRAPH.PRIMARY {
  text-indent: initial;
  margin-top: 1.0em;
}
.PARAGRAPH.SAMPLE {
  text-indent: initial;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
  line-height: 1em;
}
.PARAGRAPH.ITEMIZE {
  text-indent: initial;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PARAGRAPH.INDENTING {
  text-indent: initial;
  padding-left: 1.5em;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PARAGRAPH.MATH {
  text-indent: initial;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PARAGRAPH.EQUATION {
  text-indent: initial;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PARAGRAPH.FIGURE {
  text-indent: initial;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PARAGRAPH.LONGTABU {
  text-indent: initial;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PARAGRAPH.COLUMNS {
  text-indent: initial;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PARAGRAPH.NORMAL {
  text-indent: 1.5em;
}
.CHAPTER + .PARAGRAPH.NORMAL {
  text-indent: initial;
}
.SECTION + .PARAGRAPH.NORMAL {
  text-indent: initial;
}
.SUBSECTION + .PARAGRAPH.NORMAL {
  text-indent: initial;
}
.SUBSUBSECTION + .PARAGRAPH.NORMAL {
  text-indent: initial;
}
.LISTING .BODY {
  line-height: 1em; 
  text-align: left; 
  width: 100%; 
  padding-left: 1.5em;
  position: relative;
  display: block;
}
.LISTING .BODY .LINE {
  position: relative;
  display: block;
}
.LISTING .BODY .LINE::before {
  content: var(--lineno);
  position: absolute;
  left: -1.5em;
}
.FIGURE {
  page-break-inside: avoid;
}
.FIGCAPTION {
  text-indent: initial;
  text-align: left;
  margin-top: 0;
  margin-bottom: 0.5em;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  line-height: 1em;
  white-space: normal;
  font-size: smaller;
}
.SUBCAPTION {
  text-indent: initial;
  white-space: normal; 
  font-size: smaller;
  line-height: 1em;
}
.SUBCAPTION::before {
  content: var(--num) " ";
}
.SUBROW {
  display: flex;         
  flex-direction: row;
  align-items: baseline;
}
.FLOATLEFT {
  text-indent: initial;
  float: left;
  margin-right: 1em; 
}
.FLOATRIGHT {
  text-indent: initial;
  float: right;
  margin-left: 1em; 
}
.CENTER {
  text-indent: initial;
  text-align:center;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.FLUSHRIGHT {
  text-indent: initial;
  text-align:right;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.FLUSHLEFT {
  text-indent: initial;
  text-align:left;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.QUOTE {
  text-indent: initial;
  text-align:left;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.DISPLAYMATH {
  text-indent: initial;
  text-align:center;
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.VERBATIM {
  text-indent: initial;
  text-align: left;
  width: 100%;
  line-height: 1em;
}
.VERSE {
  text-indent: initial;
  text-align: left;
}
.PARBOX {
  text-indent: initial;
  text-align: left;
}
.TABULAR {
  text-indent: initial;
}
.PARA {
  margin-top: 1.0em;
  margin-bottom: 1.0em;
}
.PACK {
  margin-top: 0em;
  margin-bottom: 0em;
}
.DT {
  margin-bottom: 0em;
}
.DD {
  margin-left: 0;
  padding-left: 10mm;
}
.LI {
  position: relative;
}
.LI::before {
  position: absolute;
  content: var(--bull);
  left: var(--pad);
}
.PART, .CHAPTER, .SECTION, .SUBSECTION, .SUBSUBSECTION, .PRIMARY {
  clear: both;
}
`;
    var htmldata = `\
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
    var xhtmldata = `\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<style>
${style_css}
</style>
</head>
<body>
<main class='PAGE'>
${html}
</main>
</body>
</html>
`;
    return xhtmldata;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // override the super class
  //
  ////////////////////////////////////////////////////////////////////////////////

}
module.exports = { NitrilePreviewPage };
