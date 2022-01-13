const utils = require('./nitrile-preview-utils');
const fs = require('fs');
const path = require('path');

class NitrilePreviewMake {

  constructor() {
    var data = fs.readFileSync('Makefile', "utf8");
    var ss = data.split('\n');
    var o = [];
    var cluster = [];
    o.push(cluster);
    for(let s of ss){
      s = s.trimRight();
      if(s.length==0){
        cluster = [];
        o.push(cluster);
        continue;
      }
      cluster.push(s);
    }
    //var stats = fs.statSync('a.md');
    //console.log(stats);
    ///
    ///parse each cluster
    ///
    for(cluster of o){
      cluster.forEach((s,i,arr) => {
        if(i==0){
          const re = /^(\S+):\s*(.*)$/;
          const v = re.exec(s);       
          if(v){
            let target = v[1];
            let deps = v[2].split(/\s+/);
            deps = deps.filter(s => s.length);
            cluster.target = target;
            cluster.deps = deps;
            //console.log('target=',target);
            //console.log('deps=',deps);
          }
        }else{
          const re = /^\t(.*)$/;
          const v = re.exec(s);       
          if(v){
            let cmd = v[1];
            cluster.cmd = cmd;
            //console.log('cmd=',cmd);
          }
        }
      });
    }
    ///
    ///group into targets
    ///
    var targets = {};
    for(cluster of o){
      let target = cluster.target;
      let deps = cluster.deps;
      let cmd = cluster.cmd;
      targets[target] = {deps,cmd};
    }
    this.targets = targets;
    this.top_target = o[0].target;
    this.top_deps = o[0].deps;
    this.top_cmd = o[0].cmd;
  }

  async run() {
    this.do_target(this.top_target,this.top_deps,this.top_cmd);
  }

  async do_target(target,deps,cmd){
    for(let dep of deps){
      let dep_o = this.targets[dep];
      if(dep_o){
        await this.do_target(dep,dep_o.deps,dep_o.cmd);
      }
    }
    var isnewer = 0;
    try {
      var fname = path.resolve(target);
      var stats = fs.statSync(fname);
      for(let dep of deps){
        var depname = path.resolve(dep);
        var depstats = fs.statSync(depname);
        if(depstats.mtimeMs > stats.mtimeMs){
          isnewer = 1;
          break;
        }
      }
    } catch(e) {
      isnewer = 1;
    }
    if(cmd){
      if(isnewer){
        console.log(cmd);
        await this.run_cmd(cmd);
      }
    }
  }

  async run_cmd(cmd){
    var ss = cmd.split(/\s+/);
    var ss = ss.filter(s => s.length);
    var program = ss[0];
    var args = ss.slice(1);
    return new Promise((resolve, reject)=>{
      const exe = require('child_process').spawn(program,args);
      exe.stdout.on('data',(out) => process.stderr.write(out));
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
var server = new NitrilePreviewMake();
server.run();

