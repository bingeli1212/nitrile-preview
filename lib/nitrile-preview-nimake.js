const utils = require('./nitrile-preview-utils');
const fs = require('fs');
const path = require('path');
const { argv } = require('process');

class NitrilePreviewServer {

  constructor(intargets) {
    this.intargets = intargets;
    var data = fs.readFileSync('Makefile', "utf8");
    var ss = data.split('\n');
    var o = [];
    var cluster = [];
    o.push(cluster);
    for(let s of ss){
      s = s.trimEnd();
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
            let name = `cmd${i}`;
            cluster[name] = cmd;
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
      targets[target] = {...cluster};
    }
    this.targets = targets;
    if(intargets.length){
    }else if(o.length){
      let target = o[0].target;
      this.intargets.push(target);
    }
  }

  async run() {
    for(var target of this.intargets){
      try{
        var {target,deps,cmd1,cmd2,cmd3} = this.targets[target];
        await this.do_target(target,deps,cmd1,cmd2,cmd3);
      }catch(e){
        console.error(`ERROR: target not found in Makefile: ${target}`)
      }
    }
  }

  async do_target(target,deps,cmd1,cmd2,cmd3){
    for(let dep of deps){
      let dep_o = this.targets[dep];
      if(dep_o){
        await this.do_target(dep,dep_o.deps,dep_o.cmd1,dep_o.cmd2,dep_o.cmd3);
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
    if(isnewer){
      if(cmd1){
        await this.run_cmd(cmd1);
      }
      if(cmd2){
        await this.run_cmd(cmd2);
      }
      if(cmd3){
        await this.run_cmd(cmd3);
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
//console.log('argv=',argv);
var server = new NitrilePreviewServer(argv.slice(2));
server.run();

