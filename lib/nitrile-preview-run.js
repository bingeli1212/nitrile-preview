'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const fs = require('fs');
class NitrilePreviewRun extends NitrilePreviewBase {
  constructor(){
    super();
  }
  async run_texfname(texfname){
    var data = fs.readFileSync(texfname, "utf8");
    var ss = data.split('\n');
    var s0 = ss[0];
    const re = /^%\s*!TEX\s+program\s*=\s*(\w+)/;
    const v = re.exec(s0);
    if(v){
      let program = v[1];
      console.log(program);
      program = program.toLowerCase();
      await this.run_cmd(`${program} ${texfname}`);
    }
  }
  async run_cmd(cmd){
    console.log(cmd);
    var ss = cmd.split(/\s+/);
    var ss = ss.filter(s => s.length);
    var program = ss[0];
    var args = ss.slice(1);
    return new Promise((resolve, reject)=>{
      const child_process = require('child_process');
      process.env.PATH += ':/usr/local/bin';
      console.log(process.env);
      // const exe = child_process.spawn('printenv',['PATH']);
      const exe = child_process.spawn(program,args);
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
module.exports = { NitrilePreviewRun }