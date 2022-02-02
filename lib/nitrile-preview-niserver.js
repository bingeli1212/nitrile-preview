const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewNode } = require('./nitrile-preview-node');
const fs = require('fs');
const path = require('path');
const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');

class NitrilePreviewServer extends NitrilePreviewBase {

  constructor(inlist) {
    super();
    this.inlist = inlist;
    this.parser = new NitrilePreviewHtml();
    this.node = new NitrilePreviewNode();
    this.fnames = [];
    this.all_fname_map = {};
    this.all_stats_map = {};
    var entries = fs.readdirSync('.',{withFileTypes:true});
    entries.forEach((p) => {
      let name = p.name;
      if(path.extname(name)==".md"){
        this.fnames.push(name);
      }
    });
  }

  run() {
    var app = express();
    app.use(bodyParser.urlencoded({extended:true}));
    app.route('/Books').get(function(req,res)
    {
      res.send("Harry Potter, Gone With the Wind");
    });
    app.route('/Students').get(function(req,res)
    {
      res.send("James, Jane, Joe");
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
      console.log('route for /*.md',fname);
      //res.send('Welcome to my web portal');
      this.node.md_to_data(fname).then(data => {
        let xhtml = this.data_to_xhtml(data);
        res.send(xhtml);
        if(this.all_fname_map.hasOwnProperty(fname)){
          let p = this.all_fname_map[fname];
          p.srcs = data.srcs; 
        }else{
          let srcs = data.srcs;
          let p = {srcs};
          this.all_fname_map[fname] = p;
        }
      }).catch(x => {
        console.log(x);
        res.send(x);
      });
    });
    app.get('/',(req,res) => {
      if(this.inlist.length){
        var html = this.to_inlist_html(this.inlist);
        console.log(html);
        res.send(html);
      }else{
        var url = '/index.htm';/// -> '/my.md'
        var fname = path.join('.',url);/// -> 'my.md'
        var fname = path.resolve(fname);
        console.log(fname);
        res.sendFile(fname);
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
      var mtimeMs = this.get_fname_mtimeMs(fname);
      console.log('send','mtimeMs',mtimeMs);
      res.send(''+mtimeMs);
    });
    app.post('/echo',(req,res) => {
      // console.log('/echo');
      // console.log('req.body',req.body);
      // res.json(req.body);
      let png = req.body.png.trim();
      let url = req.body.url.trim();
      let i = url.indexOf(',');
      let s = url.slice(i+1);
      let buf = Buffer.from(s,'base64');
      if(png){
        fs.writeFileSync(png,buf);
        console.log("image saved as "+png);
        res.send("image saved as "+png);
      }else{
        console.log("empty file name, image not saved");
        res.send("empty file name, image not saved");
      }
    });
    ///
    ///main
    ///
    console.log('listening on 9004');
    var server=app.listen(9004,function() {});
  }
  to_inlist_html(inlist){
    return `
<html>
<body>
<ul>
${inlist.map((s) => {
  let href = 'href="'+s+'"';
  return '<li>'+'<a '+href+'>'+s+'</a>'+'</li>';
}).join('\n')}
</ul>
</body>
</html>
`
  }
  data_to_xhtml(data){
    return `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<script>
//<![CDATA[
var bfr = '';
if(1){
  let pathname = window.location.pathname.toString();
  pathname = encodeURIComponent(pathname);
  let url = '/stat?src='+pathname;
  console.log('first',url);
  fetch(url).then((response) => {
    return response.text();
  }).then(r => {
    bfr = r;
  });
}
setInterval(function () {
  let pathname = window.location.pathname.toString();
  pathname = encodeURIComponent(pathname);
  let url = '/stat?src='+pathname;
  console.log(url);
  fetch(url).then((response) => {
    return response.text();
  }).then(r => {
    if (bfr && bfr != r) {
      console.log('reloading');
      window.location.reload();//this will clear bfr
    }
    bfr = r;
  });
}, 2000);
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
<body>
${data.body}
</body>
</html>
`;
  }
  get_fname_mtimeMs(fname){
    var mtimeMs = 0;
    if(this.all_fname_map.hasOwnProperty(fname)){
      let p = this.all_fname_map[fname];
      if(p.srcs){
        let srcs = p.srcs;
        for(let src of srcs){
          let srcfname = src;
          fs.stat(srcfname,(err,stats) => {
            if(err){
              console.error(err);
              return;
            }
            this.all_stats_map[srcfname]=stats.mtimeMs;
          });
          let t = this.all_stats_map[srcfname];
          if(t && t > mtimeMs){
            mtimeMs = t;
          }
        }
      }
    }
    return mtimeMs;
  }
}
var server = new NitrilePreviewServer(process.argv.slice(2));
server.run();
