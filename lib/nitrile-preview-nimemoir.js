const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewMemoir } = require('./nitrile-preview-memoir');
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
    }else if(path.extname(fname)==='.tex'){
        var data = utils.read_text_file_async(fname);
        var texfile = fname;
    }else if(path.extname(fname)==='.md'){
        var parser = new NitrilePreviewParser();
        await parser.read_file_async(fname)
        await parser.read_import_async();
        if(parser.conf_to_string('root')){
            fname = parser.conf_to_string('root');
            parser = new NitrilePreviewParser();
            await parser.read_file_async(fname);
            await parser.read_import_async();
        }
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewMemoir(parser);
        var data = translator.to_document();
        await utils.write_text_file_async(texfile,data);
        const exe = require('child_process').spawn('pdflatex', ['--interaction=scrollmode','-halt-on-error',texfile]); 
        exe.stdout.on('data',(out) => process.stderr.write(out)); 
        exe.on('close',(code) => { console.log('mtxrun finished') }); 
    }else{
        throw "File does not end with .md"
    }
  }
}
var server = new NitrilePreviewServer();
server.run(()=>{});
