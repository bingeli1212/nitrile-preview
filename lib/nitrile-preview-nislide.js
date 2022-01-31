const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewSlide } = require('./nitrile-preview-slide');
const fs = require('fs');
const path = require('path');
const process = require('process');

class NitrilePreviewServer extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    var fname = process.argv[2];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
      var translator = new NitrilePreviewSlide(parser);
      var data = translator.to_data();
      var xhtml = `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<script>
//<![CDATA[
${data.script}
//]]>
</script>
<style>
${data.stylesheet}
</style>
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
var server = new NitrilePreviewServer();
server.run()
