const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewMemoir } = require('./nitrile-preview-memoir');
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
    }else if(path.extname(fname)==='.tex'){
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
      var translator = new NitrilePreviewMemoir(parser);
      var data = translator.to_document();
      await this.write_text_file(texfile,data);
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
