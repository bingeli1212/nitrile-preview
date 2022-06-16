const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewSlide } = require('./nitrile-preview-nislide');
const { NitrilePreviewFolio } = require('./nitrile-preview-nifolio');
const { NitrilePreviewPage } = require('./nitrile-preview-nipage');
const fs = require('fs');
const path = require('path');
const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const stat_script = `\
var bfr = 0;
setInterval(function () {
  let pathname = window.location.pathname.toString();
  pathname = encodeURIComponent(pathname);
  let url = '/stat.php?q='+pathname;
  console.log(url);
  fetch(url).then((response) => {
    return response.text();
  }).then(r => {
    r = parseFloat(r);
    if(r==0){
      console.log('reloading',r);
      window.location.reload();//this will clear bfr
    }
    else if(bfr && r>bfr){
      console.log('reloading',r,bfr);
      window.location.reload();//this will clear bfr
    }
    bfr = r;
  });
}, 2000);`;
class Server extends NitrilePreviewBase {
  constructor() {
    super();
    this.md_map = {};
    this.entries = fs.readdirSync('.',{withFileTypes:true});
    this.entries.forEach((p) => {
        ///p.isDirectory();
        ///p.isFile()
      console.log(p.name,p.isDirectory(),p.isFile());
    });
    
  }
  async run() {
    // this.inlist.forEach((p) => {
    //   this.read_text_file(fs,p.fname).then(data => {
    //     let lines = data.split('\n');
    //     let subparser = new NitrilePreviewParser();
    //     subparser.read_lines(lines);
    //     let title = subparser.title;
    //     p.title = title;
    //     let subtitle = subparser.subtitle;
    //     p.subtitle = subtitle;
    //   })      
    // });
    // var all = this.inlist.map(p => p.promise);
    // await Promise.all(all);
    var app = express();
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.route('/Books').get(function(req,res)
    {
      res.send("Harry Potter, Gone With the Wind");
    });
    app.route('/Students').get(function(req,res)
    {
      res.send("James, Jane, Joe");
    });
    app.route('/*.epub').get( (req,res) => {
      /// the 'req.url' is going to be '/my.md'
      var url = req.url;/// -> '/my.md'
      var fname = path.join('.',url);/// -> 'my.md'
      var fname = path.resolve(fname);
      console.log(fname);
      res.sendFile(fname);
    });
    app.route('/*.pdf').get( (req,res) => {
      /// the 'req.url' is going to be '/my.md'
      var url = req.url;/// -> '/my.md'
      var fname = path.join('.',url);/// -> 'my.md'
      var fname = path.resolve(fname);
      console.log(fname);
      res.sendFile(fname);
    });
    app.route('/*.png').get( (req,res) => {
      /// the 'req.url' is going to be '/my.md'
      var url = req.url;/// -> '/my.md'
      var fname = path.join('.',url);/// -> 'my.md'
      var fname = path.resolve(fname);
      console.log(fname);
      res.sendFile(fname);
    });
    app.route('/*.jpg').get( (req,res) => {
      /// the 'req.url' is going to be '/my.md'
      var url = req.url;/// -> '/my.md'
      var fname = path.join('.',url);/// -> 'my.md'
      var fname = path.resolve(fname);
      console.log(fname);
      res.sendFile(fname);
    });
    app.route('/*.js').get( (req,res) => {
      /// the 'req.url' is going to be '/my.md'
      var url = req.url;/// -> '/my.md'
      var fname = path.join('.',url);/// -> 'my.md'
      var fname = path.resolve(fname);
      console.log(fname);
      res.sendFile(fname);
    });
    app.route('/*.htm').get( (req,res) => {
      /// the 'req.url' is going to be '/my.md'
      var url = req.url;/// -> '/my.md'
      var fname = path.join('.',url);/// -> 'my.md'
      var fname = path.resolve(fname);
      console.log('route for /*.htm',fname);
      res.sendFile(fname);
    });
    app.route('/*.md').get( (req,res) => {
      /// the 'req.url' is going to be '/my.md'
      var url = req.url;/// -> '/my.md'
      var fname = path.join('.',url);/// -> 'my.md'
      var fname = path.resolve(fname);
      console.log(fname);
      this.md_to_data(fname).then(data => {
        let refreshflag = 1;
        //let xhtml = this.data_to_xhtml(data,url,stat_script);
        let xhtml = this.data_to_xhtml(data,url,'');
        res.send(xhtml);
        let members = data.members;
        this.md_map[fname] = members;
        this.get_md_mtimeMs(fname);//get the last mtimeMs of the main doc and subdocs 
      }).catch(x => {
        console.log(x);
        res.send(x);
      });
    });
    app.get('/stat.php',(req,res) => {
      var q = req.query.q;
      console.log('stat.php');
      console.log('q=',q);
      let fpath = path.resolve(path.join('.',q));
      var mtimeMs = this.get_md_mtimeMs(fpath);
      console.log('send','mtimeMs',mtimeMs);
      res.send(''+mtimeMs);
    });
    app.post('/action.php',(req,res) => {
      //res.send(JSON.stringify(req.body));
      let png = req.body.png.trim();
      let url = req.body.url.trim();
      let i = url.indexOf(',');
      let s = url.slice(i+1);
      let buf = Buffer.from(s,'base64');
      if(png){
        png = path.join('.',png);
        png = path.resolve(png);
        fs.writeFileSync(png,buf);
        console.log("image saved as "+png);
        res.send("image saved as "+png);
      }else{
        console.log("empty file name, image not saved");
        res.send("empty file name, image not saved");
      }
    });
    app.get('*',(req,res) => {
      console.log(' *** [req.url]',req.url);
      var url = req.url;/// -> '/my.md'
      if(url.endsWith("/")){
        url = url.slice(0,-1);
      }
      var dirname = url.slice(1);
      var results = this.entries.filter((p) => p.isDirectory && p.name.localeCompare(dirname)==0);
      if(url.length==0 || results.length){
        //either '/', or '/math'
        url = path.join(url,'index.md');
        var fpath = path.join('.',url);
        var fpath = path.resolve(fpath);
        var refreshflag = 0;
        console.log(' *** [resolved]',fpath);
        this.md_to_data(fpath).then(data => {
          let xhtml = this.data_to_xhtml(data,url,'');
          res.send(xhtml);
          let members = data.members;
          this.md_map[fpath] = members;
          this.get_md_mtimeMs(fpath);//get the last mtimeMs of the main doc and subdocs 
        }).catch(x => {
          console.log(x);
          fs.readdir(path.dirname(fpath),{withFileTypes:true},(err,files)=>{
            if(err){
              console.log(err);
              res.send(err);
            }else{
              files = files.filter((p) => p.isFile());
              files = files.filter((p) => (path.extname(p.name)==".xhtml"||path.extname(p.name)==".epub"));
              var xhtml = this.files_to_xhtml(files,url);
              res.send(xhtml);
            }
          });
        });
      }else{
        res.send(url);
      }
    });
    ///
    ///main
    ///
    console.log('listening on 9004');
    var server=app.listen(9004,function() {});
  }
  to_index_html(inlist){
    return `
<html>
<body>
<ul>
${inlist.map((p) => {
  let href = 'href="'+p.fname+'"';
  let text = p.title||p.fname;
  if(p.subtitle){
    text += " <small>("+p.subtitle+")</small>";
  }
  return '<li>'+'<a '+href+'>'+text+'</a>'+'</li>';
}).join('\n')}
</ul>
</body>
</html>
`
  }
  data_to_xhtml(data,url,stat_script){
    return `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<title> ${data.title} </title>
<base href="${url}"/>
<script>
//<![CDATA[
${stat_script}
//]]>
</script>
<script>
//<![CDATA[
${data.script}
//]]>
</script>
<style>
${data.stylesheet}
</style>
</head>
<body onload="body_onload()">
${data.body}
</body>
</html>
`;
  }
  files_to_xhtml(files,url) {
    var relurl = path.dirname(url);
    var text = files.map((p)=>"<div>"+`<a href="${relurl}/${p.name}">${p.name}</a>`+"</div>").join('\n');
    return `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<body>
${text}
</body>
</html>
`;
  }
  get_md_mtimeMs(fname){
    var mtimeMs = 0;
    if(this.md_map.hasOwnProperty(fname)){
      let members = this.md_map[fname];
      if(members){
        for(let member of members){
          let srcfname = member.fname;
          fs.stat(srcfname,(err,stats) => {
            if(err){
              console.error(err);
              return;
            }
            member.mtimeMs=stats.mtimeMs;
          });
          if(member.mtimeMs && member.mtimeMs > mtimeMs){
            mtimeMs = member.mtimeMs;
          }
        }
      }
    }
    return mtimeMs;
  }
  async md_to_data(fname) {
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    var lines = fs.readFileSync(fname,"utf8").split('\n');
    parser.read_lines(lines);
    var peek = parser.peek;
    console.log('md_to_data');
    console.log('peek=',peek);
    switch(peek){
      case 'slide': {
        const translator = new NitrilePreviewSlide(parser);
        var data = translator.to_data();
        break;        
      }
      case 'folio': {
        const translator = new NitrilePreviewFolio(parser);
        var data = translator.to_data();
        break;        
      }
      default: {
        const translator = new NitrilePreviewPage(parser);
        var data = translator.to_data();
        break;        
      }
    }
    return data;
  }
}
var server = new Server();
server.run();
/*
    app.post('/post',(req,res) => {
      //res.send(JSON.stringify(req.body));
      let png = req.body.png.trim();
      let url = req.body.url.trim();
      let i = url.indexOf(',');
      let s = url.slice(i+1);
      let buf = Buffer.from(s,'base64');
      if(png){
        png = path.join('.',png);
        png = path.resolve(png);
        fs.writeFileSync(png,buf);
        console.log("image saved as "+png);
        res.send("image saved as "+png);
      }else{
        console.log("empty file name, image not saved");
        res.send("empty file name, image not saved");
      }
    });
    app.get('/stat',(req,res) => {
      //console.log('/stat');
      //console.log('req.body',req.body);
      //console.log('req.query',req.query);
      //console.log('stat.mtimeMs',stat.mtimeMs);
      //res.json(req.body);
      let src = req.query.src;
      console.log('recv','/stat','src',src);
      let fname = path.resolve(path.join('.',src));
      var mtimeMs = this.get_md_mtimeMs(fname);
      console.log('send','mtimeMs',mtimeMs);
      res.send(''+mtimeMs);
    });
    app.post('/echo',(req,res) => {
      // console.log('/echo');
      // res.json(req.body);
      let png = req.body.png.trim();
      let url = req.body.url.trim();
      let i = url.indexOf(',');
      let s = url.slice(i+1);
      let buf = Buffer.from(s,'base64');
      if(png){
        png = path.join('.',png);
        png = path.resolve(png);
        fs.writeFileSync(png,buf);
        console.log("image saved as "+png);
        res.send("image saved as "+png);
      }else{
        console.log("empty file name, image not saved");
        res.send("empty file name, image not saved");
      }
    });
*/
