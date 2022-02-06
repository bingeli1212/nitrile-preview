const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewCamper } = require('./nitrile-preview-camper');
const fs = require('fs');
const path = require('path');
const process = require('process');

class NitrilePreviewNicamper extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    var fname = process.argv[2];    
    var oname = process.argv[3];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.tex'){
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
      var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
      if(oname){
        texfile = oname;
      }
      var translator = new NitrilePreviewCamper(parser);
      var data = translator.to_document();
      await this.write_text_file(fs,texfile,data);
      console.log(`written to ${texfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
  async do_tex(texfile){
    return new Promise((resolve, reject)=>{
      const exe = require('child_process').spawn('mtxrun', ['--autogenerate','--script','context','--autopdf',texfile]); 
      exe.stdout.on('data',(out) => console.log(out.toString())); 
      exe.stderr.on('data',(out) => console.error(out.toString())); 
      exe.on('close',(code) => { 
        if(code==0){
          resolve(code);
        }else{
          reject(code);
        }
      }); 
    });
  }
}
var server = new NitrilePreviewNicamper();
server.run()
