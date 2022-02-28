const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewRun } = require('./nitrile-preview-run');
const fs = require('fs');
const process = require('process');
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    var run = new NitrilePreviewRun();
    var targets = process.argv.slice(2);
    for(let target of targets){
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
        await run.run_cmd(`${program} ${target}`);
      }
    }
  }
}
var server = new Server();
server.run();
