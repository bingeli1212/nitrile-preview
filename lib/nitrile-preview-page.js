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
    this.css_map = this.to_css_map();
    this.add_css_map_entry(
      this.css_map,
      'PARAGRAPH, PRIMARY',[
        'text-indent: 0.55cm',
        'margin-top: initial',
        'margin-bottom: initial'
      ]
    );
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
    var canvas_script = this.to_canvas_script();
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
<script>
//<![CDATA[
${canvas_script}
//]]>
</script>
${html}
</body>
</html>
`;
    var xhtmldata = `\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<link href='style.css' rel='stylesheet' type='text/css'/>
</head>
<body>
<script>
//<![CDATA[
${canvas_script}
//]]>
</script>
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
