
const fs = require('fs');
const path = require('path');
const process = require('process');

class NitrilePreviewServer {

  constructor(args) {
    this.args = args;
    this.targets = [];
    this.variables = {};
    this.first_target = '';
    this.re_suffix = /^(.*):(.*)=(.*)$/;
    this.expr = '';
    this.fname_some = [];
    this.fname_all = fs.readdirSync(".");
    this.args.forEach((s,j) => {
      if(j==0){
        this.expr = s;
        console.log(this.expr);
      }else{
        let files = this.expand_widecard(s);
        this.fname_some = this.fname_some.concat(files);
      }
    });
  }

  async run() {
    const re = new RegExp(this.expr);
    console.log(re);
    for(var t of this.fname_some){
      // console.log(t);
      let ss = fs.readFileSync(t,"utf8").split('\n');
      for(let j=0; j < ss.length; j++){
        let s = ss[j];
        if(re.test(s)){
          console.log(`[${t}:${j}]${s}`)
        }
      }
    }
  }

  expand_widecard(s){
    var all = [];
    for(let fname of this.fname_all){
      let flag = this.is_fname_match(s,fname);
      if(flag){
        all.push(fname);
      }
    }  
    return all;
  }

  is_fname_match(s1,s2){
    var ss1 = s1.split('');
    var ss2 = s2.split('');
    var i1 = 0;
    var i2 = 0;
    while(i1 < ss1.length && i2 < ss2.length){
      var c1 = ss1[i1];
      var c2 = ss2[i2];
      if(c1=='*'){
        i1++;
        c1 = ss1[i1];
      }
      if(c1==c2){
        i1++;
        i2++;
        continue;
      } else if(ss1[i1-1]=='*') {
        i2++;
        continue;
      } else {
        break;
      }
    }
    if(i1==ss1.length && i2==ss2.length){
      return true;
    }else{
      return false;
    }
  }
}
console.log(process.argv);
var server = new NitrilePreviewServer(process.argv.slice(2));
server.run();

