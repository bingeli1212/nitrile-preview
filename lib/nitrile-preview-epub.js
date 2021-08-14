'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const path = require('path');
const utils = require('./nitrile-preview-utils');
const { NitrilePreviewPaper } = require('./nitrile-preview-paper');

class NitrilePreviewEpub extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.name='epub';
    this.paper = new NitrilePreviewPaper(this);
    this.num_parts = 0;
    this.num_chapters = 0;
    this.n_para = '1.0em';
    this.n_pack = '1.0pt';
    this.n_half = '0.5em';
    this.n_marginleft = 0;
    this.n_marginright = 0;
    this.css_map = this.to_css_map();
    this.add_css_map_entry(
      this.css_map,
      'PARAGRAPH',[
        'text-indent: 1.5em',
        'margin-top: initial',
        'margin-bottom: initial'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'PRIMARY',[
        'margin-bottom: initial'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FIGCAPTION',[
        'width: 80%',
        'text-align: left',
      ]
    );
  }

  async to_document_async () {
    ///translate to html
    var every = this.to_epub();
    /// assign refid
    every.forEach((o,i) => {
      if(Array.isArray(o)){
        o.forEach((p,j) => {
          p.html = this.replace_all_refs(p.html);
          p.refid = `${i}x${j}`;
          p.saveas = `${i}x${j}.xhtml`;
          p.id = `${i}x${j}`;
          p.mime = 'application/xhtml+xml';
          p.href = p.saveas;
        });
      }else{
        o.html = this.replace_all_refs(o.html);
        o.refid = i
        o.saveas = `${i}.xhtml`;
        o.id = i;
        o.mime = 'application/xhtml+xml';
        o.href = o.saveas;
      }
    });

    /// assembling
    var this_map = new Map();
    var this_images = [];
    var this_contents = [];
    
    /// update this_contents
    every.forEach((o,i) => {
      if (Array.isArray(o)){
        this_contents = this_contents.concat(o);
      }else{
        this_contents.push(o);
      }
    });
    
    /// meta-data
    var mytitle   = this.parser.conf_to_string('title','NO TITLE');
    var myauthor  = this.parser.conf_to_string('author');
    var mycss     = this.conf_to_string('css');///will be \n in there
    var mytoc = '';
    var canvas_script = this.to_canvas_script();

    /// style_css
    var style_css = `\
<script>
//<![CDATA[
${canvas_script}
//]]>
</script>
    `;
  
    /// build this_images
    //console.log('***retrieving images');
    let i = 0;
    for(let src of this.imgs){
      let imgbuff = Buffer.alloc(0);
      let mime = '';
      try {
        [imgbuff,mime] = await utils.read_image_file_async(src);
      } catch (e) {
        console.error(e.toString());
        throw e;
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
<main class='PAGE'>
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
      if(!x.title){
        ///if x.title is empty it it typically a frontmatter section, we do not want it to be listed by the TOC
        return '';
      }
      return `<li><a href='${x.saveas}'>${x.title}</a></li>`;
    })
    tocs = tocs.join('\n');
    tocs = `<ol style='list-style-type:none;' epub:type='list'>\n ${tocs} \n</ol>`;
    return tocs;
  }

  svg_to_img(text){
    text = `<img alt='dia' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(text)}" />`;
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
  to_epub() {
    let top = this.paper.to_top(this.parser.blocks);
    let every = this.write_paper(top);
    return every;
  }
  write_paper(top) {
    let every = [];
    if(this.paper.num_parts == 0 && this.paper.num_chapters == 0){
      
      ///article
      ///if this is the case, the top contains a list of sections and abstracts
      let {html,title} = this.write_paper_article(top);
      every.push({html,title});
      return every;

    }if(this.paper.num_parts == 0){

      ///chapters and no-parts
      top.forEach((o, i, arr) => {
        if (Array.isArray(o) && o.length && o[0].sig=='HDGS' && o[0].hdgn=='0') {
          let {html,title} = this.write_paper_chapter(o);
          every.push({html,title});
        } else {
          let {html,title} = this.write_paper_article(o);
          every.push({html,title});
        }
      });
      return every;

    }else{

      ///parts and chapters
      ///if this is the case, top contains a list of parts, where
      /// each part is an array and the first block is a 'sig' of 'PART'
      // If 
      ///no part is specified, then top contains a single entry
      ///which contains a list of chapters
      top.forEach((o,oi,oarr) => {
        if (Array.isArray(o) && o.length && o[0].sig=='HDGS' && o[0].name=='part') {
          let every1 = this.write_paper_part(o);
          every.push(every1);
        } else if (Array.isArray(o) && o.length) {
          ///the first child of 'o' is an frontmatter chapter, we treat it as an article
          o.forEach((p,pi,parr) => {
            if(Array.isArray(p) && p.length && p[0].sig=='HDGS'){
              let {html,title} = this.write_paper_chapter(p);
              every.push({html,title});
            }else{
              let {html,title} = this.write_paper_article(p);
              every.push({html,title});
            }
          });
        }
      });
      return every;
    }
  }
  write_paper_article(top) {
    let all = [];
    all.push('');
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var {html} = this.write_paper_section(o);
        all.push(html);
      } else {
        var html = this.translate_block(o);
        all.push(html);
      }
    });
    var html = all.join('\n');
    html = `<article class='article'>${html}</article>`
    var title = '';
    return {html,title};
  }
  write_paper_part(top) {
    let every = [];
    if(1){
      let my = top[0];
      top = top.slice(1);
      this.num_parts++;
      let idnum = this.num_parts;
      let all = [];
      let css = this.css('PART');
      all.push(`<table width='100%' style='${css}; height:80vh;'><tr><td align='center' style='font-size:2rem; font-weight:bold;'>Part ${this.int_to_letter_I(my.partnum)} <br/> ${this.uncode(my.style,my.title)}</td></tr></table>`);
      var html = all.join('\n')
      html = `<section class='part'>${html}</section>`
      var title = this.uncode(my.style,my.title);
      every.push({html,title});
    }
    top.forEach((o, i) => {
      if (Array.isArray(o) && o.length && o[0].sig=='HDGS' && o[0].hdgn=='0') {
        var {html,title} = this.write_paper_chapter(o);
        every.push({html,title});
      } 
    });
    return every;
  }
  write_paper_chapter(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    this.num_chapters++;
    let idnum = this.num_chapters;
    let css = this.css('CHAPTER');
    all.push(`<h1 style='${css}'>Chapter ${my.chapternum} &#160; ${this.uncode(my.style,my.title)}</h1>`);
    this.addto_refmap(my.label,`${my.chapternum}`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var {html} = this.write_paper_section(o);
        all.push(html);
      } else {
        var html = this.translate_block(o);
        all.push(html);
      }
    });
    var html = all.join('\n');
    html = `<section class='chapter'>${html}</section>`
    var title = this.uncode(my.style,my.title);
    return {html,title};
  }
  write_paper_section(top) {
    let my = top.shift();
    let all = [];
    let css = this.css('SECTION');
    all.push('');
    if(my.chapternum){
      all.push(`<h1 style='${css}'>${my.chapternum}.${my.level} &#160; ${this.uncode(my.style,my.title)}</h1>`);
      this.addto_refmap(my.label,`${my.chapternum}.${my.level}`);
    }else{
      all.push(`<h1 style='${css}'>${my.level} &#160; ${this.uncode(my.style,my.title)}</h1>`);
      this.addto_refmap(my.label,`${my.level}`);
    }
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var {html} = this.write_paper_subsection(o);
        all.push(html);
      } else {
        var html = this.translate_block(o);
        all.push(html);
      }
    });
    var html = all.join('\n');
    html = `<section class='section'>${html}</section>`
    var title = this.uncode(my.style,my.title);
    return {html,title};
  }
  write_paper_subsection(top) {
    let my = top.shift();
    let all = [];
    let css = this.css('SUBSECTION');
    all.push('');
    if(my.chapternum){
      all.push(`<h1 style='${css}'>${my.chapternum}.${my.level} &#160; ${this.uncode(my.style,my.title)}</h1>`);
      this.addto_refmap(my.label,`${my.chapternum}.${my.level}`);
    }else{
      all.push(`<h1 style='${css}'>${my.level} &#160; ${this.uncode(my.style,my.title)}</h1>`);
      this.addto_refmap(my.label,`${my.level}`);
    }
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        var {html} = this.write_paper_subsubsection(o);
        all.push(html);
      }else{
        var html = this.translate_block(o);
        all.push(html);
      }
    });
    var html = all.join('\n');
    html = `<section class='subsection'>${html}</section>`
    var title = this.uncode(my.style,my.title);
    return {html,title};
  }
  write_paper_subsubsection(top) {
    let my = top.shift();
    let all = [];
    let css = this.css('SUBSUBSECTION');
    all.push('');
    if(my.chapternum){
      all.push(`<h1 style='${css}'>${my.chapternum}.${my.level} &#160; ${this.uncode(my.style,my.title)}</h1>`);
      this.addto_refmap(my.label,`${my.chapternum}.${my.level}`);
    }else{
      all.push(`<h1 style='${css}'>${my.level} &#160; ${this.uncode(my.style,my.title)}</h1>`);
      this.addto_refmap(my.label,`${my.level}`);
    }
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        var html = this.translate_block(o);
        all.push(html);
      }
    });
    var html = all.join('\n');
    html = `<section class='subsubsection'>${html}</section>`
    var title = this.uncode(my.style,my.title);
    return {html,title};
  }

}

module.exports = { NitrilePreviewEpub };
