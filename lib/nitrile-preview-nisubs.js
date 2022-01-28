
const { timeStamp } = require('console');
const fs = require('fs');
const path = require('path');
const process = require('process');

         /*
          printf(“\033[0;31m”); //Set the text to the color red
          printf(“Hello\n”); //Display Hello in red
          printf(“\033[0m”); //Resets the text to default color
            Black \033[0;30m
            Red \033[0;31m
            Green \033[0;32m  
            Yellow \033[0;33m
            Blue \033[0;34m
            Purple \033[0;35m
            Cyan \033[0;36m
            White \033[0;37m
          */
 
class NitrilePreviewServer {

  constructor(args) {
    this.args = args;
    this.targets = [];
    this.variables = {};
    this.first_target = '';
    this.re_suffix = /^(.*):(.*)=(.*)$/;
    this.terms = [];
    this.fnames_some = [];
    this.fnames_all = fs.readdirSync(".");
    this.terms = [];
    for(let j=0; j < args.length; ++j) {
      let arg = args[j];
      if(j==0){
        if(arg=='--'){
          var data = fs.readFileSync('Subsfile','utf8');
          var ss = data.split('\n').map(s => s.trim()).filter(s => s.length);
          console.log('ss',ss)
          ss.forEach((s) => {
            var dd = [];
            dd = s.split('\\\\');
            if(dd.length==2){
              var expr = dd[0];
              var repl = dd[1];
            }else{
              var expr = s;
              var repl = '';
            }
            console.error(expr,repl);
            this.terms.push({expr,repl})
          })
        }else{
          var dd = [];
          dd = arg.split('\\\\');
          if(dd.length==2){
            var expr = dd[0];
            var repl = dd[1];
          }else{
            var expr = arg;
            var repl = '';
          }
          console.log('herer')
          this.terms.push({expr,repl})
        }
      }else{
        let fnames = this.expand_widecard(arg);
        this.fnames_some = this.fnames_some.concat(fnames);
      }
    }
  }

  async run() {
    for(let term of this.terms){
      let {expr,repl} = term;
      await this.run_one(expr,repl);
    }
  }

  async run_one(expr,repl) {
    const esc = String.fromCodePoint(27)
    const redbegin = `${esc}[0;31m`;
    const redend = `${esc}[0m`;
    const greenbegin = `${esc}[0;32m`;
    const greenend = `${esc}[0m`;
    // const re = new RegExp(expr);
    // console.log(re);
    for(var fname of this.fnames_some){
      console.error(` *** ${fname} ${expr} ${repl}`);
      var ss = fs.readFileSync(fname,"utf8").split('\n');
      var SS = [];
      for(let j=0; j < ss.length; j++){
        var s = ss[j];
        var i = s.indexOf(expr);
        if(i>=0){
          var s1 = s.slice(0,i);
          var s2 = s.slice(i,i+expr.length);
          var s3 = s.slice(i+s2.length);
          var t2 = repl;
          var S = (`${s1}${t2}${s3}`)
        }else{
          var S = s;
        }
        SS.push(S);
      }
      fs.writeFileSync(fname, SS.join('\n'));
    }
  }

  expand_widecard(s){
    var all = [];
    for(let fname of this.fnames_all){
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
var server = new NitrilePreviewServer(process.argv.slice(2));
server.run();

