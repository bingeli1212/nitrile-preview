const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewPowerdot } = require('./nitrile-preview-powerdot');
const { NitrilePreviewFlowerpot } = require('./nitrile-preview-flowerpot');
const { NitrilePreviewBeamer } = require('./nitrile-preview-beamer');
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
const { NitrilePreviewCamper } = require('./nitrile-preview-camper');
const { NitrilePreviewCreamer } = require('./nitrile-preview-creamer');
const { NitrilePreviewArticle } = require('./nitrile-preview-article');
const { NitrilePreviewReport } = require('./nitrile-preview-report');
const { NitrilePreviewMemoir } = require('./nitrile-preview-memoir');
const { NitrilePreviewEpub } = require('./nitrile-preview-epub');
const { NitrilePreviewSlide } = require('./nitrile-preview-slide');
const { NitrilePreviewPango } = require('./nitrile-preview-pango');
const { NitrilePreviewPage } = require('./nitrile-preview-page');
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const utils = require('./nitrile-preview-utils');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

class NitrilePreviewNode extends NitrilePreviewBase {

  async toGlyphs(fname) {
    var parser = new NitrilePreviewContex();
    return await parser.toGlyphs(fname);
  }

  async toFontmap(fnames) {
    var parser = new NitrilePreviewContex();
    return await parser.toFontmap(fnames);
  }

  async toIndexDoc(fnames) {
    var d = [];
    for(let fname of fnames){
      if(path.extname(fname)==='.md'){
        let parser = new NitrilePreviewParser();
        await parser.read_file_async(fname);
        let title = parser.conf_to_string('title');
        if(!title){
          title = fname;
        }
        d.push(`<li><a href='${fname}'> ${title} </a></li>`);
      }else{
        let title = fname;
        d.push(`<li><a href='${fname}'> ${title} </a></li>`);
      }
    }
    let data = `<!DOCTYPE html>\n<html>\n<ul>${d.join('\n')}</ul>\n</html>`;
    return data;
  }

  async toHtmlDoc(fname) {
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    var doc = parser.conf_to_string('doc');
    var alt = parser.conf_to_string('alt');
    console.log('doc=',doc);
    console.log('alt=',alt);
    switch(doc){
      case 'slide': {
        if(1||alt=='flowerpot'){
          const translator = new NitrilePreviewFlowerpot(parser);
          const data = translator.to_document();
          return data;
        }else{
          const translator = new NitrilePreviewSlide(parser);
          const data = translator.to_document();
          return data;
        }
        break;        
      }
      case 'page': {
        const translator = new NitrilePreviewPage(parser);
        const data = translator.to_document();
        return data;
        break;        
      }
      default: {
        const translator = new NitrilePreviewPage(parser);
        const data = translator.to_document();
        return data;
        break;        
      }
    }
    return "unknown doc type, ensure it is set in the frontmatter"
  }

  async to_md_title (fname) {
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    var title = parser.conf_to_string('title');
    return title;
  }

  async to_xhtml_doc_async (fname) {
    if(path.extname(fname)==='.xhtml'){
      const data = utils.read_text_file_async(fname);
      return data;
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)    
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var doc = parser.conf_to_string('doc');
    var xhtmlfile = this.md_to_xhtml_file(fname);
    switch(doc){
      case 'slide': {
        const translator = new NitrilePreviewSlide(parser);
        const data = translator.to_document();
        return [data,xhtmlfile];
        break;        
      }
      default:     {
        const translator = new NitrilePreviewPage(parser);
        const data = translator.to_document();
        return [data,xhtmlfile];
        break;        
      }
    }
  }

  async to_contex_doc_async (fname) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return data;
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var doc = parser.conf_to_string('doc');
    var texfile = this.md_to_tex_file(fname);
    switch(doc){
      case 'slide': {
        const translator = new NitrilePreviewCreamer(parser);
        const data = translator.to_document();
        return [data,texfile];
        break;        
      }
      default:     {
        const translator = new NitrilePreviewCamper(parser);
        const data = translator.to_document();
        return [data,texfile];
        break;        
      }
    }
  }

  async to_latex_doc_async (fname) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var doc = parser.conf_to_string('doc');
    var texfile = this.md_to_tex_file(fname);
    switch(doc){
      case 'slide': {
        const translator = new NitrilePreviewBeamer(parser,'pdflatex');
        const data = translator.to_document();
        return [data,texfile];
        break;        
      }
      default:     {
        const translator = new NitrilePreviewMemoir(parser,'pdflatex');
        const data = translator.to_document();
        return [data,texfile];
        break;        
      }
    }
  }

  async to_epub_doc_async (fname) {
    if(path.extname(fname)=='.epub'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    let parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    const translator = new NitrilePreviewEpub(parser);
    const this_map = await translator.to_document_async();   
    var this_zip = new JSZip();
    for(let [fname,fdata] of this_map.entries()){
      this_zip.file(fname,fdata);
    }
    const zipdata = await this_zip.generateAsync({ type: 'nodebuffer' });
    let epubfname = this.md_to_epub_file(fname);
    return [zipdata,epubfname];
  }

  async to_flowerpot_doc_async (fname) {
    if(path.extname(fname)=='.xhtml'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var doc = parser.conf_to_string('doc');
    var outfname = this.md_to_xhtml_file(fname);
    const translator = new NitrilePreviewFlowerpot(parser);
    const data = translator.to_document();
    return [data,outfname];
  }

  async to_slide_doc_async (fname) {
    if(path.extname(fname)=='.xhtml'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var doc = parser.conf_to_string('doc');
    var outfname = this.md_to_xhtml_file(fname);
    const translator = new NitrilePreviewSlide(parser);
    const data = translator.to_document();
    return [data,outfname];
  }

  async to_pango_doc_async (fname) {

    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    await this.run_translator(fname,parser,'pango','',false);
  }

  async to_memoir_doc_async (fname) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var texfile = this.md_to_tex_file(fname);
    const translator = new NitrilePreviewMemoir(parser,'pdflatex');
    const data = translator.to_document();
    return [data,texfile];
  }

  async to_powerdot_doc_async (fname) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var texfile = this.md_to_tex_file(fname);
    const translator = new NitrilePreviewPowerdot(parser,'pdflatex');
    const data = translator.to_document();
    return data;
  }

  async to_beamer_doc_async (fname) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var texfile = this.md_to_tex_file(fname);
    const translator = new NitrilePreviewBeamer(parser,'pdflatex');
    const data = translator.to_document();
    return [data,texfile];
  }

  async to_article_doc_async (fname) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    var texfile = this.md_to_tex_file(fname);
    const translator = new NitrilePreviewArticle(parser,'pdflatex');
    const data = translator.to_document();
    return [data,texfile];
  }
  async to_report_doc_async (fname) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var texfile = this.md_to_tex_file(fname);
    const translator = new NitrilePreviewReport(parser,'pdflatex');
    const data = translator.to_document();
    return [data,texfile];
  }

  async to_camper_doc_async (fname,program) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var texfile = this.md_to_tex_file(fname);
    const translator = new NitrilePreviewCamper(parser);
    const data = translator.to_document();
    return [data,texfile];
  }

  async to_creamer_doc_async (fname,program) {
    if(path.extname(fname)==='.tex'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var texfile = this.md_to_tex_file(fname);
    const translator = new NitrilePreviewCreamer(parser);
    const data = translator.to_document();
    return [data,texfile];
  }

  async to_page_doc_async (fname) {
    if(path.extname(fname)==='.xhtml'){
      const data = utils.read_text_file_async(fname);
      return [data,fname];
    }
    if(path.extname(fname)!=='.md'){
      throw "File does not end with .md"
    }
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    if(parser.conf_to_string('root')){
      fname = parser.conf_to_string('root');
      parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
    }
    var texfile = this.md_to_xhtml_file(fname);
    const translator = new NitrilePreviewPage(parser);
    const data = translator.to_document();
    return [data,texfile];
  }

  async run_translator (mdfile,parser,tname,pname,viewflag) {

    console.log('fname=',mdfile);
    console.log('tname=',tname);
    console.log('pname=',pname);
    console.log('viewflag=',viewflag);

    /// fetch the 'tname' key value
    switch(tname){
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
        let epubfile = `${mdfile.slice(0, mdfile.length - path.extname(mdfile).length)}.epub`;
        await utils.write_text_file_async(epubfile, zipdata);
        if(viewflag){
          this.to_view_file( epubfile );
        }
        break;        
      }
      case 'page': {
        const translator = new NitrilePreviewPage(parser);
        const data = translator.to_document();
        let htmlfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.xhtml`;
        await utils.write_text_file_async(htmlfile, data);
        if(viewflag){
          this.to_view_file( htmlfile );
        }
        break;        
      }
      case 'slide': {
        const translator = new NitrilePreviewSlide(parser);
        const data = translator.to_document();
        let htmlfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.xhtml`;
        console.log(htmlfile);
        await utils.write_text_file_async(htmlfile, data);
        if(viewflag){
          this.to_view_file( htmlfile );
        }
        break;        
      }
      case 'pango': {
        const translator = new NitrilePreviewPango(parser);
        const data = translator.to_document();
        let htmlfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.xhtml`;
        console.log(htmlfile);
        await utils.write_text_file_async(htmlfile, data);
        if(viewflag){
          this.to_view_file( htmlfile );
        }
        break;        
      }
      case 'camper': {
        const translator = new NitrilePreviewCamper(parser);
        const data = translator.to_document();
        let texfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.tex`;
        let pdffile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log(pname); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn(pname,
            [fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log('finished'); 
          this.move_file(parser,pdffile);   
        }); 
        break;      
      }
      case 'creamer': {
        const translator = new NitrilePreviewCreamer(parser);
        const data = translator.to_document();
        var texfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.tex`;
        var pdffile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log(pname); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn(pname,
            [fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log('finished');    
          this.move_file(parser,pdffile);
        }); 
        break;      
      }
      case 'memoir': {
        const translator = new NitrilePreviewMemoir(parser,pname);
        const data = translator.to_document();
        let texfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.tex`;
        let pdffile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log(pname); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn(pname,
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log(pname+' finished');    
          this.move_file(parser,pdffile);
        }); 
        break;
      }
      case 'beamer': {
        const translator = new NitrilePreviewBeamer(parser,pname);
        const data = translator.to_document();
        let texfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.tex`;
        let pdffile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log(pname); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn(pname,
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log(pname+' finished');    
          this.move_file(parser,pdffile);
        }); 
        break;
      }
      case 'report': {
        const translator = new NitrilePreviewReport(parser,pname);
        const data = translator.to_document();
        let texfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.tex`;
        let pdffile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log(pname); 
        console.log(dname); 
        console.log(fname); 
        const exe = require('child_process').spawn(pname,
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log(pname+' finished');    
          if(viewflag){
            this.to_view_file(pdffile);
          }
        });         
        break;        
      }
      case 'article': {
        const translator = new NitrilePreviewArticle(parser,pname);
        const data = translator.to_document();
        let texfile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.tex`;
        let pdffile = `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.pdf`;
        await utils.write_text_file_async(texfile, data);
        let dname = path.dirname(texfile);
        let fname = path.basename(texfile);
        console.log('program=',pname); 
        console.log('dname=',dname); 
        console.log('fname=',fname); 
        const exe = require('child_process').spawn(pname,
            ['--interaction=scrollmode', 
             '-output-directory='+dname, 
             '-halt-on-error', fname]); 
        exe.stdout.on('data',(data) => process.stderr.write(data)); 
        exe.on('close',(code) => { 
          console.log(pname+' finished');    
          if(viewflag){
            this.to_view_file(pdffile);
          }
        });        
        break;        
      }
    }
  }

  move_file(parser,pdffile){
    /// see if we need to copy files to destination folder
    var destination = parser.conf_to_string('dest');
    var rename = parser.conf_to_bool('rename')
    var title = parser.conf_to_string('title',"Untitled");
    if(destination){
      fs.readFile(pdffile, null, (err,databuf) => {
        if (err) {
          console.log(err);
        } else {
          if(rename){
            var dfile = `${title}.pdf`;
            var dfile = path.resolve(destination,dfile)
            fs.writeFile(dfile,databuf,null, (werr) => {
              if(werr){
                console.log(werr);
              }else{
                console.log(dfile)
              }
            })
          }else{
            var dfile = path.resolve(destination,path.basename(pdffile));
            fs.writeFile(dfile,databuf,null, (werr) => {
              if(werr){
                console.log(werr);
              }else{
                console.log(dfile)
              }
            });
          }
        }
      });
    }
  }

  async to_doc_symbols_async(type){
    var parser = new NitrilePreviewParser();
    const translator = new NitrilePreviewPage(parser);
    const symbol_name_map = translator.tokenizer.symbol_name_map;
    const symbol_group_map = translator.tokenizer.symbol_group_map;
    const symbol_alt_map = translator.tokenizer.symbol_alt_map;
    var all = [];
    for(let iter of symbol_group_map){
      var [group,names] = iter;
      all.push('');
      all.push('@ longtable');
      all.push(`  ${group}`);
      all.push('');
      all.push('  | symbol | name | html | comment');
      all.push('  ----------------------------------');
      for(let name of names){
        let {html,comment} = symbol_name_map.get(name);
        all.push(`  | &${name}; | ${name} | ${html} | ${comment}`);
      }
      all.push('');
    }
    all.push('');
    all.push('@ longtable');
    all.push('  Alternative names.');
    all.push('');
    all.push('  | symbol | name | html | comment');
    all.push('  -----------------------------------');
    for(let iter of symbol_alt_map){
      var [alt_name,name] = iter;
      let {html,comment} = symbol_name_map.get(name);
      all.push(`  | &${name}; | ${name} | ${html} | ${comment}`);
    }
    all.push('');
    var data = all.join('\n')
    await utils.write_text_file_async("docsymbols.md", data);
  }

  async to_contex_symbol_doc_async(type){
    var parser = new NitrilePreviewParser();
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
    var parser = new NitrilePreviewParser();
    const translator = new NitrilePreviewPdflatex(parser);
    const data = translator.to_symbol_doc();
    let texfile = `symbols.tex`;
    await utils.write_text_file_async(texfile, data);
    let dname = path.dirname(texfile);
    let fname = path.basename(texfile);
    let program = 'pdflatex';
    return [dname,fname];
  }

  async to_replace_math_async(fname){
    var out = await utils.read_text_file_async(fname);
    var lines = out.split('\n');
    for(var line of lines){
      var line1 = this.replace_phrase(line,'math','{{','}}');
      console.log(line1);
    }
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
      fs.watch(myfile, (event, fname) => { 
        if (fname) { 
          //console.log(`file Changed`); 
          new NitrilePreviewNode().toHtml(fname).then(f => console.log(f)).catch(err => console.log(err)) 
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
      fs.watch(myfile, (event, fname) => { 
        if (fname) { 
          console.log(`file Changed`); 
          new NitrilePreviewNode().toContex(fname).then(f => {
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

  to_view_file(fname){
    console.log(fname); 
    const exe = require('child_process').spawn('open',[fname]);
  }

  md_to_epub_file(mdfile){
    return `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.epub`;
  }
  md_to_tex_file(mdfile){
    return `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.tex`;
  }
  md_to_xhtml_file(mdfile){
    return `${mdfile.slice(0,mdfile.length-path.extname(mdfile).length)}.xhtml`;
  }

  to_filename(fname,ext){
    return `${fname.slice(0,fname.length-path.extname(fname).length)}.${ext}`;
  }

  async write_txt_file(txtfile,data){
    await utils.write_text_file_async(txtfile, data);
    return txtfile;
  }
  async write_bin_file(txtfile,data){
    await utils.write_binary_file_async(txtfile, data);
    return txtfile;
  }
  async run_program(program,args){
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

module.exports = { NitrilePreviewNode };
