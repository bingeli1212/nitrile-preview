
const fs = require('fs');
const path = require('path');
const process = require('process');

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
    if(intargets.length){
    }else if(o.length){
      let p = o[0];
      this.intargets.push(p.target);
    }
    this.targets = o;
  }

  async run() {
    for(var t of this.intargets){
      let p = this.find_target(t);
      try{
        await this.do_target(p);
      }catch(e){
        console.error(`nimake: *** [${t}] Error ${e.toString()}`)
      }
    }
  }

  async do_target(p){
    let {target,deps,cmd1,cmd2,cmd3} = p;
    for(let dep of deps){
      let p1 = this.find_target(dep);
      if(p1){
        try {
          await this.do_target(p1);
        }catch(e){
          console.error(`nimake: *** [${dep}] Error ${e.toString()}`)
        }
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
        console.log(code);
        if (code == 0) {
          resolve(code);
        } else {
          reject(code);
        }
      });
    });
  }

  find_target(t){
    ///the 't' is always a real target, not a '%.pdf'
    const re = /^(%)(\.\w+)$/;
    const t_ext = path.extname(t);///such as '.md' for 'foo.md'
    const t_base = t.slice(0,t.length-t_ext.length);///such as 'foo' for 'foo.md'
    for(let p of this.targets){
      const v = re.exec(p.target);
      if(v && v[2]==t_ext){
        let p1 = {...p};///make a copy       
        p1.deps = p1.deps.map((s) => {
          s = s.replace(/^%/g,t_base);
          return s;
        });
        if(typeof p1.cmd1 == 'string'){
          p1.cmd1 = p1.cmd1.replace('$<',p1.deps[0]);
        }
        if(typeof p1.cmd2 == 'string'){
          p1.cmd2 = p1.cmd2.replace('$<',p1.deps[0]);
        }
        if(typeof p1.cmd3 == 'string'){
          p1.cmd3 = p1.cmd3.replace('$<',p1.deps[0]);
        }
        return p1;
      }else if(p.target==t){
        return p;
      }
    }
    return null;
  }
}
var server = new NitrilePreviewServer(process.argv.slice(2));
server.run();

