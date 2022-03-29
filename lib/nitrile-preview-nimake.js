
const fs = require('fs');
const path = require('path');
const process = require('process');

/*

It supports the following:

1. Variables assignments
2. Variable substitutions
2. suffix substitutions
3. Implicit rules
4. The $< substitution

Following is an example of a variable assignment.

    SRC = a.c b.c 

Following is an example of variable assignment 
with suffix substitution.

    TEX = $(SRC:.c=.tex)

Following is an example of variable assignment with
variable substitution.

    ALL = main.c $(SRC)

Following is an example of an implicit rule.

    %.tex: %.c
      convert-to-tex $<

This rule will be applied for a target such as 'a.tex', in which
case the entire rule becomes.

    a.tex: a.c
      convert-to-tex a.c

During an implicit rule, the '$<' variable will be replaced by the
appearanace of the first dependence, which is 'a.c' in this case.
The same '<' can also be used in a suffix substitution such as the
following:

    %.tex: %.c
      md-to-tex $(<:.c=.md)

In the previous example the concrete rule becomes the following
if the concrete target is 'a.tex'.

    a.tex: a.c
      md-to-tex a.md

*/

class NitrilePreviewServer {

  constructor(intargets) {
    this.intargets = intargets;
    this.targets = [];
    this.variables = {};
    this.first_target = '';
    this.re_suffix = /^(.*):(.*)=(.*)$/;
    ///
    ///read the 'Makefile'
    ///
    var data = fs.readFileSync('Makefile', "utf8");
    var ss = data.split('\n');
    const re_variable = /^(\w+)\s+=\s+(.*)$/;
    const re_target = /^(\S+):\s*(.*)$/;
    const re_cmd = /^\t(.*)$/;
    let p = null;
    let i = 0;
    ss.forEach((s,j) => {
      s = s.trimEnd();
      let v;
      if((v=re_target.exec(s))!==null){       
        let target = v[1];
        let deps = v[2];
        deps = this.replace_cmd(deps,'',[]);
        deps = deps.split(/\s+/).filter(s => s.length);
        p = {};
        i = 0;
        p.target = target;
        p.deps = deps;
        this.targets.push(p);
        if(j==0){
          this.first_target = target;
        }
      }else if((v=re_variable.exec(s))!==null){
        let variable = v[1];
        let value = v[2];
        value = this.replace_cmd(value,'',[]);
        this.variables[variable] = value;
        p = null;
        i = 0;
      }else if((v=re_cmd.exec(s))!==null){       
        let cmd = v[1];
        if(p){
          i++;
          let name = `cmd${i}`;
          p[name] = cmd; //note that we cannot do this.replace_cmd() here because this might be an implicit rule, in which case the read depedency isn't concrete
        }
      }else{
        p = null;
        i = 0;
      }
    });
  
    ///
    ///decide what to make first
    ///
    if(intargets.length){
    }else if(this.first_target){
      this.intargets.push(this.first_target);
    }

  }

  async run() {
    for(var t of this.intargets){
      let p = this.find_target(t);
      if(p){
        try{
          await this.do_target(p);
        }catch(e){
          console.error(`nimake: *** [${t}] Error ${e.toString()}`)
        }
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
    }else{
      console.log(`nimake: '${target}' is up to date`)
    }
  }

  async run_cmd(cmd){
    console.log(cmd);
    var ss = cmd.split(/\s+/).filter(s => s.length);
    var cmd = ss[0];
    var args = ss.slice(1);
    return new Promise((resolve, reject)=>{
      const exe = require('child_process').spawn(cmd,args);
      exe.stdout.on('data',(out) => process.stdout.write(out));
      exe.stderr.on('data',(out) => process.stderr.write(out));
      exe.on('close',(code) => {
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
        p1.target = t; 
        p1.deps = p1.deps.map((s) => {
          s = s.replace(/^%/g,t_base);
          return s;
        });
        if(typeof p1.cmd1 == 'string'){
          p1.cmd1 = this.replace_cmd(p1.cmd1,p1.target,p1.deps);
        }
        if(typeof p1.cmd2 == 'string'){
          p1.cmd2 = this.replace_cmd(p1.cmd2,p1.target,p1.deps);
        }
        if(typeof p1.cmd3 == 'string'){
          p1.cmd3 = this.replace_cmd(p1.cmd3,p1.target,p1.deps);
        }
        return p1;
      }else if(p.target==t){
        return p;
      }
    }
    return null;
  }

  replace_cmd(cmd,target,deps){
    let v;
    cmd = cmd.replace(/(\$\(.*?\))|(\$<)/g,(m,m1,m2) => {
      if(m1){
        m1 = m1.slice(2,-1);
        if((v=this.re_suffix.exec(m1))!==null){
          let s1 = v[2];
          let s2 = v[3];
          let str = v[1];
          str = this.replace_var(str,target,deps);
          str = str.split(/\s+/).filter(s => s.length).map(s => this.replace_suffix(s1,s2,s)).join(' ');
          return str;
        }else if(this.variables.hasOwnProperty(m1)){
          return this.variables[m1];
        }else{
          return m1;
        }
      }else if(m2){
        m2 = m2.slice(1);
        m2 = this.replace_var(m2,target,deps);
        return m2;
      }
    });
    return cmd;
  }

  replace_var(s,target,deps){
    //'s' is a user-defined variable such as 'SRC' or 
    // a system variable such as '<'
    if(s=='<'){
      return deps[0]||'';
    }else if(this.variables.hasOwnProperty(s)){
      return this.variables[s];
    }else{
      return s;
    }
  }

  replace_suffix(s1,s2,s){
    //'s1' is '.md', 
    //'s2' is '.tex'
    //'s' is 'foo.md'
    //The output should be 'foo.tex'
    if(s.endsWith(s1)){
      return s.slice(0,-s1.length)+s2;
    }else{
      return s;
    }
  }

  do_patsubst(s1,s2,s){
    //'s1' is '%.md', 
    //'s2' is '%.tex'
    //'s' is 'foo.md'
    //The output should be 'foo.tex'
    var ss1 = s1.split('.');
    var ss2 = s2.split('.');
    var ss = s.split('.').map((s,i) => {
      if(ss1[i]=='%' && ss2[i]=='%'){
        return s;
      }else{
        return ss2[i];
      }
    });
    var s_new = ss.join('.');
    return s_new;
  }

}
var server = new NitrilePreviewServer(process.argv.slice(2));
server.run().catch((err)=>{
  console.error(err.toString())
  process.exitCode = -1;
});

