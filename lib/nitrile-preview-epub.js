'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const path = require('path');
const utils = require('./nitrile-preview-utils');

class NitrilePreviewEpub extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.name='EPUB';
  }

  async to_epub_document_async () {
    ///identify and translate
    this.identify();
    this.translate();
    
    /// assembling
    var this_map = new Map();
    var this_images = [];
    var this_contents = [];
    var this_toc = [];
    
    var blocks = this.parser.blocks;
    var mytitle = this.conf('title','NO TITLE');
    var myauthor = this.conf('author');
    var mycss = this.conf('epub.css');///will be \n in there
    var mytoc = '';

    ////console.log('this.imgs',this.imgs);

    /// build this_images
    //console.log('***retrieving images');
    let i = 0;
    for(let src of this.imgs){
      let imgbuff = Buffer.alloc(0);
      let mime = '';
      try {
        [imgbuff,mime] = await utils.read_image_file_async(src);
      } catch (e) {
        //console.error(e.toString());
      }
      this_images.push({refid:`image${i++}`,href:src,mime,imgbuff});
    }
    console.log('this_images',this_images);

    ///This area collects information regarding toc and contents
    /// it scans the blocks and pick out blocks that 
    /// are FRNT, PART, and HDGS
    //console.log('***building toc');
    let toc;
    let saveasmap = new Map();
    let saveas = '0.xhtml'; ///this one is only used for this.num_sections only
    ///to hold initial contents before the first section header
    blocks.forEach(block => {
      let {sig,hdgn,title,style} = block;
      if(!style) return;
      let {refid,subseq} = style;
      let partnum = this.get_refmap_value(style,'partnum');
      let chnum = this.get_refmap_value(style,'chnum');
      let idnum = this.get_refmap_value(style,'idnum');
      let id = this.get_refmap_value(style,'id');///css id
      if(this.num_parts){
        let saveas = `${refid}.xhtml`;
        this.addto_saveasmap(refid,saveas,block,saveasmap);
        this.ammend_saveas(style,saveas);
        if (sig=='PART') {
          partnum = this.to_I_letter(partnum);
          title = `Part ${partnum} ${this.unmask(title)}`;
          toc = [];
          this_toc.push(toc);
          toc.push({id,saveas,title});
        } else if(sig=='HDGS'&&hdgn==0){
          partnum = this.to_I_letter(partnum);
          title = `${chnum} ${this.unmask(title)}`;
          if(toc){
            toc.push({id,saveas,title});
          }
        }        
      }
      else if(this.num_chapters){
        let saveas = `${refid}.xhtml`;
        this.addto_saveasmap(refid,saveas,block,saveasmap);
        this.ammend_saveas(style,saveas);
        if(sig=='HDGS'&&hdgn==0){
          title = `${chnum} ${this.unmask(title)}`;
          this_toc.push({id,saveas,title});
        }        
      }
      else if(this.num_sections){
        if(sig=='HDGS'&&hdgn==1){
          ///saveas will only change upon the first and subsequent sections    
          saveas = `${subseq}.xhtml`;
          title = `${idnum} ${this.unmask(title)}`;
          this_toc.push({id,saveas,title});
        }    
        ///IMPORTANT: this line must be after the previous one
        ///so that 'saveas' can change
        this.addto_saveasmap(subseq,saveas,block,saveasmap);
        this.ammend_saveas(style,saveas);
      }
    })
    mytoc = this.build_toc(this_toc); 
    this.translate();///translate again because of the newly added 'saveas' in the this.refmap
    i = 0;
    for (let [saveas,p] of saveasmap) {
      let mime = 'application/xhtml+xml';
      let htmls = p.blocks.map(x => x.html);
      this_contents.push({refid:p.refid,href:saveas,mime,htmls});
    }
    //console.log(mytoc);
    //console.log(this_contents);

    /// This area inserts an artifical TITLE page as the first page of the
    /// content list showing the title of the document and/or author;
    /// if the author is not specified it is titled "NO TITLE"
    if (1) {
      let htmls=[];
      htmls.push(`<p style='font-size:175%; text-align:center; margin:1em 0; ' >${mytitle}</p>`);
      htmls.push(`<p style='font-size:125%; text-align:center; margin:1em 0; ' >${myauthor}</p>`);
      this_contents.unshift({refid:'titlepage', href:'titlepage.xhtml', mime:'application/xhtml+xml', htmls});
      /// Add PNG files to 'this_images'...
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

    for (let p of this_contents) {
      var {href,htmls} = p;
      this_map.set(href,`\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:epub='http://www.idpf.org/2007/ops'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<link href='style.css' rel='stylesheet' type='text/css'/>
</head>
<body>
<main class='page'>
${htmls.join('\n')}
</main>
</body>
</html>
`);
    }


    /// add all images to zip

    for (let p of this_images) {
      let {href,imgbuff} = p;
      this_map.set(href,imgbuff);
    }

    /// generate style.css

    this_map.set('style.css',`\

    .page figure {
      page-break-inside: avoid;
    }  

    .page ul.PLST {
      padding-left: 28px;
    }
    .page ul.PLST > li.PLST {
      margin: 0.5em 0;
    }
    .page ul.PLST > li.PLST > div.PLST {
      margin: 0.5em 0;
    }
  
    .page ol.PLST {
      padding-left: 28px;
    }  
    .page ol.PLST > li.PLST {
      margin: 0.5em 0;
    }
    .page ol.PLST > li.PLST > div.PLST {
      margin: 0.5em 0;
    }
  
    .page dl.PLST > dt.PLST {
      margin: 0.5em 0;
    }
    .page dl.PLST > dd.PLST {
      margin: 0.5em 0;
      padding-left: 28px;
    }
    .page dl.PLST > dd.PLST > div.PLST {
      margin: 0.5em 0;
    }
  
    .page div.TEXT {
      margin: 0.5em 0;
    }
    .page div.TEXT.NSPACE {
      padding-left: 28px;
    }
    .page div.TEXT ul {
      padding-left: 20px;
    }
    .page div.TEXT ol {
      padding-left: 20px;
    }

    .page div.PRIM {
      margin: 0.5em 0;
    }
   
    .page div.SAMP {
      margin: 0.5em 0;
      padding-left: 28px;
      font-size: small;
    }
  
    .page figure {
      margin: 0.5em 0;
      margin-left: 28px;
    }
    .page figure > figcaption {
      margin-left: -28px;
    }
    .page figure.Listing > div {
      font-size: smaller;
      line-height: 1.1;
    }

    `);

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
${this_contents.map(x => `<item id='${x.refid}' href='${x.href}' media-type='${x.mime}' />`).join('\n')}
${this_images.map(x => `<item id='${x.refid}' href='${x.href}' media-type='${x.mime}' />`).join('\n')}
</manifest>
<spine>
${this_contents.map(x => `<itemref idref='${x.refid}' />`).join('\n')}
</spine>
</package>
`);

    return this_map;
  }

  build_toc(tocs){
    tocs = tocs.map(x => {
      if(Array.isArray(x)){
        ///the first one is part, it needs to stay at the toplist
        var x0 = x.shift();
        var nl = this.build_toc(x);
        return `<li><a href='${x0.saveas}#${x0.id}'>${x0.title}</a>${nl}</li>`;
      }
      return `<li><a href='${x.saveas}#${x.id}'>${x.title}</a></li>`;
    })
    tocs = tocs.join('\n');
    tocs = `<ol style='list-style-type:none;' epub:type='list'>\n ${tocs} \n</ol>`;
    return tocs;
  }

  svg_to_img(text){
    text = `<img alt='diagram' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(text)}" />`;
    return text;
  }

  addto_saveasmap(refid,saveas,block,saveasmap){
    if(!saveas) return;
    if(!saveasmap.has(saveas)){
      let blocks = [];
      saveasmap.set(saveas,{refid,blocks});
    }
    let p = saveasmap.get(saveas);
    p.blocks.push(block);
  }

  phrase_to_img(cnt) {
    let g = this.img_string_to_style(cnt);
    if(g._.substr(0,1)=='#'){
      var id = g._.substr(1);
      if(id){
        let ss = this.fetch_ss_from_notes('pic',id);
        if(ss){
          return this.fence_to_diagram(ss,g);
        }
      }
      return '';
    }else{
      var src = g._;
      var imgsrc = `${src}`;///THIS is the URL that is assigned to <img src=...>
      var imgid = '';
      if (1) {
        var { imgsrc, imgid } = this.to_request_image(imgsrc);
        console.log('to_request_image()','imgsrc',imgsrc.slice(0, 40), 'imgid', imgid);
      }
      let asp = this.string_to_aspect_ratio(g.aspectratio,"4/3");
      let css_style = [];
      css_style.push(`box-sizing:border-box`);
      if(g.width){
        var width = this.string_to_css_width(g.width,1);
        css_style.push(`width:${width}`)
      }else{
        css_style.push(`width:100%`)
      }
      if(g.frame==1){
        css_style.push(`border:1px solid`);
      }
      if(g.float){
        css_style.push(`float:${g.float=='left'?'left':'right'}`)
      }
      //return `<svg style="${css_style.join(';')}" viewBox="0 0 ${asp[0]} ${asp[1]}" xmlns="http://www.w3.org/2000/svg"><image href="${imgsrc}" width="${asp[0]}" height="${asp[1]}"/></svg>`;
      return `<img style='${css_style.join(';')}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
    }

  }

}

module.exports = { NitrilePreviewEpub };
