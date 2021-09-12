const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewEpub } = require('./nitrile-preview-epub');
const { NitrilePreviewNode } = require('./nitrile-preview-node');
const utils = require('./nitrile-preview-utils');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

class NitrilePreviewServer {

  constructor(allfiles) {
    this.parser = new NitrilePreviewHtml();
    this.node = new NitrilePreviewNode();
    this.fnames = allfiles.split(' ');
    console.log(this.fnames);
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
    app.route('/*.md').get( (req,res) => {
      /// the 'req.url' is going to be '/my.md'
      var url = req.url;/// -> '/my.md'
      var fname = path.join('.',url);/// -> 'my.md'
      console.log(fname);
      //res.send('Welcome to my web portal');
      this.node.toHtmlDoc(fname).then(data => {
            res.send(data);
          }).catch(x => {
            console.log(x);
            res.send(x);
          });
    });
    app.get('/',(req,res) => {
      this.node.toIndexDoc(this.fnames).then(data => {
            res.send(data);
          }).catch(x => {
            console.log(x);
            res.send(x);
          });
      return;
      let fnames = this.fnames;
      fnames = fnames.map(x => `<a href='/${x}'>${x}</a>`);
      fnames = fnames.map(x => `<li>${x}</li>`);
      let data = `<!DOCTYPE html>\n<html>\n<ul>${fnames.join('\n')}</ul>\n</html>`;
      res.send(data);
    });
    app.post('/echo',(req,res) => {
      // console.log('/echo');
      // console.log('req.body',req.body);
      // res.json(req.body);
      let filename = req.body.filename.trim();
      let textarea = req.body.textarea.trim();
      let i = textarea.indexOf(',');
      textarea = textarea.slice(i+1);
      let buff = Buffer.from(textarea,'base64');
      if(filename){
        fs.writeFileSync(filename,buff);
        console.log('saved to '+filename);
        res.send('saved to '+filename);
      }else{
        filename = "board.png";
        fs.writeFileSync(filename,buff);
        console.log('saved to '+filename);
        res.send('saved to '+filename);
      }
    })
    console.log('listening on 9004');
    var server=app.listen(9004,function() {});
  }
}

module.exports = { NitrilePreviewServer };

/*
var server = new NitrilePreviewServer();
server.run();
*/

