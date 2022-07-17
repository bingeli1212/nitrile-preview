'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const utils = require('./nitrile-preview-utils');
class NitrilePreviewEpub extends NitrilePreviewHtml {
  constructor(parser) {
    super(parser);
    this.name='epub';
  }
  async to_document_async () {
    var every = [];
    var pp = [];
    pp.name='';
    pp.title='';
    every.push(pp);
    for (let block of this.parser.blocks) {
      if(block.sig=='PART'){
        pp = [];
        pp.name='part';
        pp.title=this.smooth(this.parser.style,block.title);
        every.push(pp);
        pp.push({block}); 
      }else if(block.sig=='CHAP'){
        pp = [];
        pp.name='chapter';
        pp.title=this.smooth(this.parser.style,block.title);
        every.push(pp);
        pp.push({block}); 
      }else if(block.sig=='FRNT'){
        //ignore
      }else if(block.sig=='PAGE'){
        //ignore
      }else{
        pp.push({block}); 
      }
    }
    ///
    ///remove empty pp
    ///
    every = every.filter(pp => pp.length); //each entry is either a part of a chapter
    /// assign refid
    every.forEach((pp,i) => {
      let id = i;
      pp.refid = id
      pp.href = `${id}.xhtml`;
      pp.id = id;
      pp.mime = 'application/xhtml+xml';
      pp.forEach(p => {
        p.block.saveas = pp.href;
      });
    });
    ///
    /// translate now
    ///
    every.forEach((pp,i) => {
      let htmls = pp.map(p => {
        return this.translate_block(p.block)
      });
      pp.html = htmls.join('\n');
    });
    ///
    /// assembling
    ///
    var this_map = new Map();
    var all_images = [];
    /// 
    /// meta-data
    /// 
    var mytitle   = this.parser.conf_to_string('title','NO TITLE');
    var myauthor  = this.parser.conf_to_string('author');
    var mycss     = this.conf_to_string('css');///will be \n in there
    var mytoc = '';
    var style_css = this.to_style_css();
    ///
    /// images           
    ///
    //console.log('***retrieving images');
    let i = 0;
    for(let src of this.imgs){
      try {
        console.log('opening '+src)
        let [imgbuff,mime] = await utils.read_image_file_async(src);
        all_images.push({refid:`image${i++}`,href:src,mime,imgbuff});
      } catch (e) {
        console.error(' *** [ERROR] '+e.toString());
      }
    }
    console.log('all_images',all_images);

    /// generate mytoc
    mytoc = this.build_toc(every); 
    console.log('mytoc',mytoc);

    /// This area inserts an artifical TITLE page as the first page of the
    /// content list showing the title of the document and/or author;
    /// if the author is not specified it is titled "NO TITLE"
    if (1) {
      let all=[];
      all.push(`<p style='font-size:175%; text-align:center; margin:1em 0; ' >${mytitle}</p>`);
      all.push(`<p style='font-size:125%; text-align:center; margin:1em 0; ' >${myauthor}</p>`);
      every.unshift({refid:'titlepage', href:'titlepage.xhtml', mime:'application/xhtml+xml', html:all.join('\n')});
    }

    /// generate META-INF/container.xml

    this_map.set('META-INF/container.xml',`\
<?xml version='1.0' encoding='utf-8'?>
<container xmlns='urn:oasis:names:tc:opendocument:xmlns:container'
version='1.0'>
<rootfiles>
<rootfile full-path='package.opf'
media-type='application/oebps-package+xml'/>
</rootfiles>
</container>
`);

    /// generate 'mimetype' file

    this_map.set('mimetype',`\
application/epub+zip
`);

    /// generate toc.xhtml
    this_map.set('toc.xhtml',`\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:epub='http://www.idpf.org/2007/ops'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<link href='style.css' rel='stylesheet' type='text/css'/>
</head>
<body>
<nav epub:type='toc'>
<h1>Contents</h1>
${mytoc}
</nav>
</body>
</html>
`);

    /// add content*.xhtml files to zip

    for (let p of every) {
      var {href,html} = p;
      this_map.set(href,`\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:epub='http://www.idpf.org/2007/ops'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<link href='style.css' rel='stylesheet' type='text/css'/>
</head>
<body>
${html}
</body>
</html>
`);
    }


    /// add all images to zip

    for (let p of all_images) {
      let {href,imgbuff} = p;
      this_map.set(href,imgbuff);
    }

    /// generate style.css

    this_map.set('style.css',style_css);

    /// generate a unique id to be set for 'pub-id'

    let uniqueId = Math.random().toString(36).substring(2) + Date.now().toString(36);

    /// generate package.opf
    this_map.set('package.opf',`\
<?xml version='1.0' encoding='UTF-8'?>
<package xmlns='http://www.idpf.org/2007/opf' version='3.0' xml:lang='en' unique-identifier='pub-id'>
<metadata xmlns:dc='http://purl.org/dc/elements/1.1/'>
<dc:identifier id='pub-id'>${uniqueId}</dc:identifier>
<dc:language>en</dc:language>
<dc:title id='title'>${mytitle}</dc:title>
<dc:subject> </dc:subject>
<dc:creator>${myauthor}</dc:creator>
</metadata>
<manifest>
<item id='toc' properties='nav' href='toc.xhtml' media-type='application/xhtml+xml'/>
<item id='stylesheet' href='style.css' media-type='text/css'/>
${every.map(x => `<item id='${x.refid}' href='${x.href}' media-type='${x.mime}' />`).join('\n')}
${all_images.map(x => `<item id='${x.refid}' href='${x.href}' media-type='${x.mime}' />`).join('\n')}
</manifest>
<spine>
${every.map(x => `<itemref idref='${x.refid}' />`).join('\n')}
</spine>
</package>
`);
    return this_map;
  }
  build_toc(every){
    var nparts = 0;
    var nchaps = 0;
    every.forEach(pp => {
      if(pp.name=='part'){
        nparts++;
      }
      else if(pp.name=='chapter'){
        nchaps++;
      }
    });
console.log('nparts=',nparts);
console.log('nchaps=',nchaps);
    if(nparts){
      var all = [];
      var part = [];
      every.forEach(pp => {
        if(pp.name=='part'){
          part = [];
          all.push(part);
          part.push(pp);
        } else {
          part.push(pp);
        }
      });
      var tocs = [];
      tocs.push( `<ol style='list-style-type:none' epub:type='list'>` );
      all.forEach(part => {
        tocs.push( `<li>` );
        tocs.push( `<a href='${part[0].href}'>${part[0].title}</a>` );
        tocs.push( `<ol style='list-style-type:none' epub:type='list'>` );
        for(let j=1; j < part.length; ++j){
          tocs.push( `<li><a href='${part[j].href}'>${part[j].title}</a></li>` );
        } 
        tocs.push( `</ol>` );
        tocs.push( `</li>` );
      });
      tocs.push( `</ol>` );
      return tocs.join('\n');
    }else if(nchaps){
      var tocs = [];
      tocs.push( `<ol style='list-style-type:none' epub:type='list'>` );
      every.forEach(pp => {
        if(pp.name=='chapter'){
          tocs.push( `<li><a href='${pp.href}'>${pp.title}</a></li>` );
        }
      });
      tocs.push( `</ol>` );
      return tocs.join('\n');
    }else{
      var tocs = [];
      tocs.push( `<ol style='list-style-type:none' epub:type='list'>` );
      tocs.push( `</ol>` );
      return tocs.join('\n');
    }
  }
  svg_to_img(text){
    text = `<img alt='img' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(text)}" />`;
    return text;
  }
  to_style_css(){
    let fname = this.parser.data['epub.css'];
    if(fname){
      const fs = require('fs');
      let lines = fs.readFileSync(fname,"utf8");
      return lines;
    }
    return `\
figure{
  margin-left:0;
  margin-right:0;
}
p.BODY{
  text-indent: 20pt;
  margin-top: 0;
  margin-bottom: 0;
}
.PART{
  position: fixed;  
  width: 100%;
  text-align: center;
  top: 50%;
  font-size: 2em;
}
.PART::before{
  content: "\\27B0";
}
.PART::after{
  content: "\\27B0";
}
.CHAPTER + p.BODY{
  text-indent: 0;
}
.SECTION + p.BODY{
  text-indent: 0;
}
.SUBSECTION + p.BODY{
  text-indent: 0;
}
.SUBSUBSECTION + p.BODY{
  text-indent: 0;
}
`
  }
}
module.exports = { NitrilePreviewEpub };
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
async function run(){
  const { NitrilePreviewParser } = require('./nitrile-preview-parser');
  const JSZip = require('jszip');
  const fs = require('fs');
  const path = require('path');
  const process = require('process');
  var fname = process.argv[2];    
  var oname = process.argv[3];    
  if(!fname){
    throw "File name is empty"
  }else if(path.extname(fname)==='.epub'){
  }else if(path.extname(fname)==='.md'){
    console.log('reading '+fname);
    var parser = new NitrilePreviewParser();
    await parser.read_file_async(fname)
    await parser.read_import_async();
    console.log('translating');
    var translator = new NitrilePreviewEpub(parser);
    console.log('generating EPUB contents')
    var this_map = await translator.to_document_async();
    console.log('packing EPUB into a archive')
    var this_zip = new JSZip();
    for(let [fname,fdata] of this_map.entries()){
      this_zip.file(fname,fdata);
    }
    var zipdata = await this_zip.generateAsync({ type: 'nodebuffer' });
    var epubfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.epub`;
    if(oname){
      epubfname = oname;
    }
    console.log('saving as '+epubfname);
    fs.writeFileSync(epubfname,zipdata);
    console.log(`written to ${epubfname}`); 
  }else{
    throw "File does not end with .md"
  }
}
if(require.main===module){
  run();
}
