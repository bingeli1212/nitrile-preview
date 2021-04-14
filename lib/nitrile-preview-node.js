const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewBeamer } = require('./nitrile-preview-beamer');
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
const { NitrilePreviewCamer } = require('./nitrile-preview-camer');
const { NitrilePreviewCamerile } = require('./nitrile-preview-camerile');
const { NitrilePreviewCreamer } = require('./nitrile-preview-creamer');
const { NitrilePreviewArticle } = require('./nitrile-preview-article');
const { NitrilePreviewReport } = require('./nitrile-preview-report');
const { NitrilePreviewEpub } = require('./nitrile-preview-epub');
const { NitrilePreviewSlide } = require('./nitrile-preview-slide');
const { NitrilePreviewPage } = require('./nitrile-preview-page');
const utils = require('./nitrile-preview-utils');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

class NitrilePreviewNode {

  async toGlyphs(fname) {
    const parser = new NitrilePreviewContex();
    return await parser.toGlyphs(fname);
  }

  async toFontmap(fnames) {
    const parser = new NitrilePreviewContex();
    return await parser.toFontmap(fnames);
  }

  async to_slide_document_async (filename) {

    if(path.extname(filename)!=='.md'){
      throw "File does not end with .md"
    }
    const parser = new NitrilePreviewParser();
    await parser.read_file_async(filename)
    await parser.read_master_async();
    await parser.read_import_async();
    var myfile = await this.run_translator(filename,parser,'slide','',false);
  }

  async to_beamer_document_async (filename) {

    if(path.extname(filename)!=='.md'){
      throw "File does not end with .md"
    }
    const parser = new NitrilePreviewParser();
    await parser.read_file_async(filename)
    await parser.read_master_async();
    await parser.read_import_async();
    var myfile = await this.run_translator(filename,parser,'beamer','xelatex',false);
  }

  async to_creamer_document_async (filename) {

    if(path.extname(filename)!=='.md'){
      throw "File does not end with .md"
    }
    const parser = new NitrilePreviewParser();
    await parser.read_file_async(filename)
    await parser.read_master_async();
    await parser.read_import_async();
    var myfile = await this.run_translator(filename,parser,'creamer','',false);
  }

  async to_camer_document_async (filename) {

    if(path.extname(filename)!=='.md'){
      throw "File does not end with .md"
    }
    const parser = new NitrilePreviewParser();
    await parser.read_file_async(filename)
    await parser.read_master_async();
    await parser.read_import_async();
    var myfile = await this.run_translator(filename,parser,'camer','',false);
  }

  async to_program_document_async (filename) {

    /// parser blocks
    if(path.extname(filename)!=='.md'){
      throw "File does not end with .md"
    }
    const parser = new NitrilePreviewParser();
    await parser.read_file_async(filename)
    await parser.read_master_async();
    await parser.read_import_async();
    var one     = parser.conf_to_string('translator'); 
    var program = parser.conf_to_string('program'); 
    await this.run_translator(filename,parser,one,program,true);
  }

  async run_translator (filename,parser,one,program,viewflag) {

    /// fetch the 'translator' key value
    switch(one){
      case 'epub': {
        const translator = new NitrilePreviewEpub(parser);
        const this_map = await translator.to_document_async();   
        ///create a zip archieve
        var this_zip = new JSZip();
        for(let [fname,fdata] of this_map.entries()){
          this_zip.file(fname,fdata);
          //console.log('this_zip','fname',fname,'fdata',fdata);
        }
        const zipdata = await this_zip.generateAsync({ type: 'nodebuffer' });
        let epubfile = `${filename.slice(0, filename.length - path.extname(filename).length)}.epub`;
        await utils.write_text_file_async(epubfile, zipdata);
        if(viewflag){
          this.to_view_file( epubfile );
        }
        break;        
      }
      case 'page': {
        const translator = new NitrilePreviewPage(parser);
        const data = translator.to_document();
        let htmlfile = `${filename.slice(0,filename.length-path.extname(filename).length)}.html`;
        await utils.write_text_file_async(htmlfile, data);
        if(viewflag){
          this.to_view_file( htmlfile );
        }
        break;        
      }
      case 'slide': {
        const translator = new NitrilePreviewSlide(parser);
        const data = translator.to_document();
        let htmlfile = `${filename.slice(0,filename.length-path.extname(filename).length)}.html`;
        console.log(htmlfile);
        await utils.write_text_file_async(htmlfile, data);
        if(viewflag){
          this.to_view_file( htmlfile );
        }
        break;        
      }
      case 'camer': {
        const translator = new NitrilePreviewCamer(parser);
        const data = translator.to_document();
        let texfile = `${filename.slice(0,filename.length-path.extname(filename).length)}.tex`;
        let pdffile = `${filename.slice(0,filename.length-path.extname(filename).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        var program = 'context';
        console.log(program); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn('context',
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log('context finished');    
          if(viewflag){
            this.to_view_file(pdffile);
          }
        }); 
        break;         
      }
      case 'camerile': {
        const translator = new NitrilePreviewCamerile(parser);
        const data = translator.to_document();
        let texfile = `${filename.slice(0,filename.length-path.extname(filename).length)}.tex`;
        let pdffile = `${filename.slice(0,filename.length-path.extname(filename).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        var program = 'context';
        console.log(program); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn('context',
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log('context finished');    
          if(viewflag){
            this.to_view_file(pdffile);
          }
        }); 
        break;      
      }
      case 'creamer': {
        const translator = new NitrilePreviewCreamer(parser);
        const data = translator.to_document();
        let texfile = `${filename.slice(0,filename.length-path.extname(filename).length)}.tex`;
        let pdffile = `${filename.slice(0,filename.length-path.extname(filename).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        var program = 'context';
        console.log(program); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn('context',
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log('context finished');    
          if(viewflag){
            this.to_view_file(pdffile);
          }
        }); 
        break;      
      }
      case 'beamer': {
        program = program||'pdflatex';
        const translator = new NitrilePreviewBeamer(parser,program);
        const data = translator.to_document();
        let texfile = `${filename.slice(0,filename.length-path.extname(filename).length)}.tex`;
        let pdffile = `${filename.slice(0,filename.length-path.extname(filename).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log(program); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn(program||'pdflatex',
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log(program+' finished');    
          if(viewflag){
            this.to_view_file(pdffile);
          }
        }); 
        break;
      }
      case 'report': {
        program = program||'pdflatex';
        const translator = new NitrilePreviewReport(parser,program);
        const data = translator.to_document();
        let texfile = `${filename.slice(0,filename.length-path.extname(filename).length)}.tex`;
        let pdffile = `${filename.slice(0,filename.length-path.extname(filename).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log(program); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn(program,
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log(program+' finished');    
          if(viewflag){
            this.to_view_file(pdffile);
          }
        });         
        break;        
      }
      default: {
        program = program||'pdflatex';
        const translator = new NitrilePreviewArticle(parser,program);
        const data = translator.to_document();
        let texfile = `${filename.slice(0,filename.length-path.extname(filename).length)}.tex`;
        let pdffile = `${filename.slice(0,filename.length-path.extname(filename).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log('program=',program); 
        console.log('dname=',dname); 
        console.log('fname=',fname); 
        const exe = require('child_process').spawn(program,
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log(program+' finished');    
          if(viewflag){
            this.to_view_file(pdffile);
          }
        });        
        break;        
      }
    }
  }

  async to_contex_symbol_doc_async(type){
    const parser = new NitrilePreviewParser();
    const translator = new NitrilePreviewContex(parser);
    const data = translator.to_symbol_doc();
    let texfile = `symbols.tex`;
    await utils.write_text_file_async(texfile, data);
    let dname = path.dirname(texfile);
    let fname = path.basename(texfile);
    let program = 'context';
    return [dname,fname];
  }

  async to_pdflatex_symbol_doc_async(type){
    const parser = new NitrilePreviewParser();
    const translator = new NitrilePreviewPdflatex(parser);
    const data = translator.to_symbol_doc();
    let texfile = `symbols.tex`;
    await utils.write_text_file_async(texfile, data);
    let dname = path.dirname(texfile);
    let fname = path.basename(texfile);
    let program = 'pdflatex';
    return [dname,fname];
  }

  ///Needed for nih
  async runHtml(args){
   
    //console.log('args=',args);
    args = args.split(' ');
    //console.log('args=',args);
    var myopts = {};
    var myfile = '';
    while(args.length){
      let item = args.shift();
      if(item.startsWith('--')){
        myopts[item] = 1;
      }
      else {
        myfile = item;
      }
    }
    if(myopts['--watch']){
      new NitrilePreviewNode().toHtml(myfile).then(f => console.log(f)).catch(err => console.log(err)) 
      //console.log(`watching ${myfile}`);
      fs.watch(myfile, (event, filename) => { 
        if (filename) { 
          //console.log(`file Changed`); 
          new NitrilePreviewNode().toHtml(filename).then(f => console.log(f)).catch(err => console.log(err)) 
        }
      }); 
    } else { 
      new NitrilePreviewNode().toHtml(myfile).then(f => console.log(f)).catch(err => console.log(err)) 
    } 

  }

  ///Needed for nic
  async runContex(args){
   
    //console.log('args=',args);
    args = args.split(' ');
    //console.log('args=',args);
    var myopts = {};
    var myfile = '';
    while(args.length){
      let item = args.shift();
      if(item.startsWith('--')){
        myopts[item] = 1;
      }
      else {
        myfile = item;
      }
    }
    if(myopts['--watch']){
      new NitrilePreviewNode().toContex(myfile).then(f => console.log(f)).catch(err => console.log(err)) 
      console.log(`watching ${myfile}`);
      fs.watch(myfile, (event, filename) => { 
        if (filename) { 
          console.log(`file Changed`); 
          new NitrilePreviewNode().toContex(filename).then(f => {
              console.log(f);
              const context  = require('child_process').spawn('context', ['--interaction=nonstopmode', f]); 
              context.stdout.on('data',(data) => process.stdout.write(data)); 
              context.on('close',(code) => console.log('context process finished')); 
          }).catch(err => console.log(err));
        }
      }); 
    } else { 
          new NitrilePreviewNode().toContex(myfile).then(f => {
              console.log(f);
              const context  = require('child_process').spawn('context', ['--interaction=nonstopmode', f]); 
              context.stdout.on('data',(data) => process.stdout.write(data)); 
              context.on('close',(code) => console.log('context process finished')); 
          }).catch(err => console.log(err));
    } 

  }

  parse_arg(args){

    var options = {};
    var values = [];
    var re_twodash_arg=/^\-\-(\w+)\=(\w+)$/;
    var re_twodash_noarg=/^\-\-(\w+)$/;
    var re_onedash=/^\-(\w+)$/;
    var v;
    for(var s of args){
      if((v=re_twodash_arg.exec(s))!==null){
        var key=v[1];
        var val=v[2];
        options[key]=val;
      }else if((v=re_twodash_noarg.exec(s))!==null){
        var key=v[1];
        options[key]=1;
      }else if((v=re_onedash.exec(s))!==null){
        var keys=v[1].split('');
        keys.forEach(x => options[x]=1);
      }else{
        values.push(s);
      }
    }
    return {options,values};
  }

  to_view_file(filename){
    console.log(filename); 
    const exe = require('child_process').spawn('open',[filename]);
  }
}

module.exports = { NitrilePreviewNode };
