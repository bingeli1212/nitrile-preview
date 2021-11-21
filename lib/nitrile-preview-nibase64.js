const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewSlide } = require('./nitrile-preview-slide');
const path = require('path');
const utils = require('./nitrile-preview-utils');
const { argv } = require('process');

class NitrilePreviewServer {
  constructor() {
  }
  async run(){
    console.log('argv=',argv);
    var fname = argv[2];    
    if(!fname){
        throw "File name is empty"
    }else{
        var s = await utils.read_text_file_async(fname)
	var buf = Buffer.from(s);
        console.log(buf.toString('base64'));                     
    }
  }
}
var server = new NitrilePreviewServer();
server.run(()=>{
});
