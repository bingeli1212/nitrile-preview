const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewPage } = require('./nitrile-preview-page');
const fs = require('fs');
const path = require('path');
const process = require('process');

class NitrilePreviewServer {
  constructor() {
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
      var translator = new NitrilePreviewPage(parser);
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
      await this.write_text_file(xhtmlfile,xhtml);
      console.log(`written to ${xhtmlfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
  async read_text_file(filename) {
    return new Promise((resolve, reject)=>{
      fs.readFile(filename, "utf8", function(err, data) {
        if (err) {
          reject(err.toString());
        } else {
          resolve(data.toString());
        }
      });
    });
  }
  async write_text_file(filename,data) {
    return new Promise((resolve, reject)=>{
      fs.writeFile(filename, data, 'utf8', function(err) {
        if (err) {
          reject(err.toString());
        } else {
          resolve(filename);
        }
      });
    });
  }
}
var server = new NitrilePreviewServer();
server.run().catch((err)=>{
  console.error(err.toString())
  process.exitCode = -1;
});
