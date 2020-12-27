'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const path = require('path');
const utils = require('./nitrile-preview-utils');
const { NitrilePreviewPaper } = require('./nitrile-preview-paper');

class NitrilePreviewEpub extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.name='EPUB';
    this.paper = new NitrilePreviewPaper(this);
  }

  async to_epub_document_async () {
    ///translate to html
    var every = this.to_epub();
    /// assign refid
    every.forEach((p,i) => {
      p.html = this.replace_all_refs(p.html);
      p.refid = i+1;
      p.saveas = `${i+1}.xhtml`;
      p.id = i+1;
      p.mime = 'application/xhtml+xml';
      p.href = p.saveas;
    });

    /// assembling
    var this_map = new Map();
    var this_images = [];
    var this_contents = every.map(x => x);
    
    /// meta-data
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

    /// generate mytoc
    mytoc = this.build_toc(every); 

    /// This area inserts an artifical TITLE page as the first page of the
    /// content list showing the title of the document and/or author;
    /// if the author is not specified it is titled "NO TITLE"
    if (1) {
      let all=[];
      all.push(`<p style='font-size:175%; text-align:center; margin:1em 0; ' >${mytitle}</p>`);
      all.push(`<p style='font-size:125%; text-align:center; margin:1em 0; ' >${myauthor}</p>`);
      this_contents.unshift({refid:'titlepage', href:'titlepage.xhtml', mime:'application/xhtml+xml', html:all.join('\n')});
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
      var {href,html} = p;
      this_map.set(href,`\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:epub='http://www.idpf.org/2007/ops'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<link href='style.css' rel='stylesheet' type='text/css'/>
</head>
<body>
<main class='page'>
${html}
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
    figure.EQUATION .IDNUM {
      position: absolute;
      right: 100%;
      transform: translate(-1ex,0);
    }
    figure.EQUATION .IDNUM::before {
      content: "(";
    }
    figure.EQUATION .IDNUM::after {
      content: ")";
    }
  
    figure.TABLE .IDNUM::after {
      content: ":\\00A0";
    }
    figure.FIGURE .IDNUM::after {
      content: ":\\00A0";
    }
    figure.LISTING .IDNUM::after {
      content: ":\\00A0";
    }
  
    figure.FIGURE table td {
      text-align: center;
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
        return `<li><a href='${x0.saveas}'>${x0.title}</a>${nl}</li>`;
      }
      return `<li><a href='${x.saveas}'>${x.title}</a></li>`;
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
  to_epub() {
    let top = this.paper.to_top(this.parser.blocks);
    let text = this.write_epub(top);
    return text;
  }
  write_epub(top) {
    let every = [];
    if(this.paper.num_parts == 0 && this.paper.num_chapters == 0){
      ///sections
      ///if this is the case, the top contains a list of sections
      top.forEach((o, i) => {
        if (Array.isArray(o)) {
          /// 'o' is a section
          let {html,title} = this.write_paper_section(o);
          every.push({html,title});
        } 
      })
      return every;
    }else{
      ///parts and chapters
      ///if this is the case, top contains a list of parts, where
      /// each part is an array and the first block is a 'sig' of 'PART'
      // If 
      ///no part is specified, then top contains a single entry
      ///which contains a list of chapters
      top.forEach((o, i) => {
        if (Array.isArray(o)) {
          // 'o' is a part
          if(o.length && o[0].sig=='PART'){
            let block = o[0];
            o = o.slice(1);
            let title = this.unmask(my.title);
            let html = `<h1>${title}</h1>`;
            html = `<section class='part'>${html}</section>`
            every.push({html,title});
          }
          top.forEach((o, i) => {
            if (Array.isArray(o)) {
              let {html,title} = this.write_paper_chapter(o);
              every.push({html,title});
            } 
          });
        } 
      });
      return every;
    }
  }
  write_paper_chapter(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.write_paper_section(o);
        all.push(data);
      } else {
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    var title = this.unmask(my.title);
    return {html,title};
  }
  write_paper_section(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.write_paper_subsection(o);
        all.push(data);
      } else {
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    var title = this.unmask(my.title);
    return {html,title};
  }
  write_paper_subsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<section>${this.unmask(my.title)}</section>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        var data = this.write_paper_subsubsection(o);
        all.push(data);
      }else{
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    var title = this.unmask(my.title);
    return {html,title};
  }
  write_paper_subsubsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`<h1>${this.unmask(my.title)}</h1>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        this.translate_block(o);
        all.push(o.html);
      }
    });
    var html = all.join('\n');
    var title = this.unmask(my.title);
    return {html,title};
  }

}

module.exports = { NitrilePreviewEpub };
