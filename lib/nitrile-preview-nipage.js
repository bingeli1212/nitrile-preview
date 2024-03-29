'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');

class NitrilePreviewPage extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
  }
  to_peek_document() {
    // this.build_default_idnum_map();
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var html = all.join('\n');
    return html;
  }
  to_data() {
    // this.build_default_idnum_map();
    var all = [];
    this.parser.blocks.forEach((block,i) => {
      let html = this.translate_block(block);
      all.push(html);
    });
    var body = all.join('\n');
    var stylesheet = this.to_style_css();
    var script = ``;
    var members = this.parser.members;
    var title = this.uncode(this.parser.style,this.parser.title);
    return {stylesheet,script,body,members,title};
  }
  to_style_css(){
    let fname = this.parser.data['page.css'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8");
      return lines;
    }
    return `\
p.BODY{
  text-indent: 20pt;
  margin-top: 0;
  margin-bottom: 0;
}
.PART{
  position: fixed;  
  width: 100%;
  text-align: center;
  top: 50%;
  font-size: 2em;
}
.PART::before{
  content: "\\27B0";
}
.PART::after{
  content: "\\27B0";
}
.CHAPTER + p.BODY{
  text-indent: 0;
}
.SECTION + p.BODY{
  text-indent: 0;
}
.SUBSECTION + p.BODY{
  text-indent: 0;
}
.SUBSUBSECTION + p.BODY{
  text-indent: 0;
}
.DETAILSROW{
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}`;
  }
}
module.exports = { NitrilePreviewPage };
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
const { NitrilePreviewBase } = require('./nitrile-preview-base');
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    var fname = process.argv[2];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
      var translator = new NitrilePreviewPage(parser);
      var data = translator.to_data();
      var title = translator.uncode(parser.style,parser.title);
      var link = parser.conf_to_list('page.link').map(s => {
        if(s.endsWith(".css")){
          return `<link rel="stylesheet" href="${s}"/>`;
        }
        return '';
      }).join('\n');
      var xhtml = `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<title> ${title} </title>
<script>
//<![CDATA[
${data.script}
//]]>
</script>
<style>
${data.stylesheet}
</style>
${link}
</head>
<body>
${data.body}
</body>
</html>
`;      
      await this.write_text_file(fs,xhtmlfile,xhtml);
      console.log(`written to ${xhtmlfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new Server();
  server.run();
}