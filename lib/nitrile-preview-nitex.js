const utils = require('./nitrile-preview-utils');
const fs = require('fs');
const path = require('path');
const process = require('process');

class NitrilePreviewServer {

  constructor(intargets) {
    this.intargets = intargets;
  }

  async run(){
    for(let target of this.intargets){
      console.log(target);
      var data = fs.readFileSync(target, "utf8");
      var ss = data.split('\n');
      var s0 = ss[0];
      const re = /^%\s*!TEX\s+program\s*=\s*(\w+)/;
      const v = re.exec(s0);
      if(v){
        let program = v[1];
        console.log(program);
        program = program.toLowerCase();
        await this.run_cmd(`${program} ${target}`);
      }
    }
  }

  async run_cmd(cmd){
    console.log(cmd);
    var ss = cmd.split(/\s+/);
    var ss = ss.filter(s => s.length);
    var program = ss[0];
    var args = ss.slice(1);
    return new Promise((resolve, reject)=>{
      const exe = require('child_process').spawn(program,args);
      exe.stdout.on('data',(out) => console.log(out.toString()));
      exe.stderr.on('data',(out) => console.error(out.toString()));
      exe.on('close',(code) => {
        if (code < 0) {
          reject(code);
        } else {
          resolve(code);
        }
      });
    });
  }

}
//console.log('argv=',argv);
var server = new NitrilePreviewServer(process.argv.slice(2));
server.run().catch((err)=>{
  console.error(err.toString())
  process.exitCode = -1;
});

