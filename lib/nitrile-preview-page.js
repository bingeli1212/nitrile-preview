'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');

class NitrilePreviewPage extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.pagecount = 0;
  }
  to_page_document() {
    ///do identify
    this.identify();
    ///do translate
    this.translate();
    //putting them together
    var the_pages = [];
    var top = this.to_top(this.parser.blocks);
    this.add_frnt_page(this.parser.blocks,the_pages);
    this.add_top_pages(top,the_pages);
    var html = the_pages.map(x=>x.html).join('\n');
    var display = 'none';
    var margintop = '0';
    var marginbottom = '0';
    var fontfamily = this.conf('page.font-family','sans-serif');
    var fontsize = this.conf('page.font-size','12pt');
    var display = 'block';
    var margintop = '1em';
    var marginbottom = '1em';
    var data = `\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${this.unmask(this.conf('title'))}</title>
<style>

  @media print {
    .page {page-break-after: always;}
    .page > figure {page-break-inside: avoid;}
  }

  table {
    border-collapse:collapse;
  }

  .page {
    font-family:${fontfamily};
    font-size:${fontsize};
    display: ${display};
    margin-top: ${margintop};
    margin-bottom: ${marginbottom};
    border:3px solid;
    padding:1in 1in 1in 1in;
    min-width:8.5in;
    max-width:8.5in;
    min-height:96mm;
    box-sizing: border-box;
  }

  .page.active {
    display: block;
  }

  .page .frametitle {
    margin-left:-14px;
    margin-top:0;
    margin-bottom:0.5em;
    font-size:1.2em;
  }

  .page ul.PLST {
    padding-left: 2.5em;
    margin: 0.5em 0;
  }
  .page ul.PLST > li.PLST {
    margin: 0.5em 0;
  }
  .page ul.PLST > li.PLST > div.PLST {
    margin: 0.5em 0;
  }

  .page ol.PLST {
    padding-left: 2.5em;
    margin: 0.5em 0;
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
    padding-left: 2.5em;
  }
  .page dl.PLST > dd.PLST > div.PLST {
    margin: 0.5em 0;
  }

  .page div.TEXT {
    margin: 0.5em 0;
  }
  .page div.TEXT.NSPACE {
    padding-left: 2.5em;
  }
  .page div.TEXT ul,ol {
    padding-left: 1.5em;
  }

  .page div.PLST ul,ol {
    padding-left: 1.5em;
  }

  .page div.PRIM {
    margin: 0.5em 0;
  }
   
  .page div.SAMP {
    margin: 0.5em 0;
    padding-left: 2.5em;
    font-size: small;
  }

  .page div.TEXT.QUOTE {
    font-style: italic;
  }
  .page div.TEXT.QUOTE::before {
    content: "\\201C";
  }
  .page div.TEXT.QUOTE::after {
    content: "\\201D";
  }

  .page figure {
    margin: 0.5em 0;
    margin-left: 0;
  }
  .page figure > figcaption {
    margin-left: 0;
  }
  .page figure.Listing > div {
    font-size: smaller;
  }

</style>
</head>
<body>
<main>
${html}
</main>
</body>
</html>
`;
    return data;
  }
  to_top(blocks){
    var top = [];
    var o = null;
    var pagecount=0;
    for(let block of blocks){
      let {sig,hdgn} = block;
      if(sig=='FRNT'){
        ///ignore for now
        continue;
      }
      if(sig=='PART'){
        ///ignore for now
        continue;
      }
      if(sig=='HDGS' && hdgn==0){
        pagecount++;
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }else{
        top.push(block);
      }
    }
    this.pagecount = pagecount;
    return top;
  } 
  add_top_pages(top,the_pages){
    if(this.pagecount){
      top.forEach((o,i) => {
        if(Array.isArray(o)){
          this.add_one_page(o,the_pages,1);
        }
      });
    }else{
      ///treat the entire top as a single page
      this.add_one_page(top,the_pages,0)
    }
  }
  add_one_page(top,the_pages,ischapter){
    let ch_id = '';
    let ch_title = '';
    if(ischapter){
      let my = top.shift();
      let chnum = this.get_refmap_value(my.style,'chnum');
      ch_id = chnum;
      ch_title = this.unmask(my.title);
    }
    let all = [];
    all.push(`<section id='page${ch_id}' class='page'>`);
    all.push(`<h2 class='pagetitle'>${ch_id} ${ch_title}</h2>`);
    all.push(`${top.map(x=>x.html).join('\n')}`);
    all.push(`</section>`);  
    let data = all.join('\n');
    the_pages.push({id:ch_id,title:ch_title,html:data});
  }
  add_frnt_page(blocks,the_pages){
    let title = '';
    let subtitle = '';
    let institute = '';
    let author = '';
    if(blocks.length && blocks[0].sig=='FRNT'){
      let block = blocks[0];
      for(let t of block.data){
        let [key,val] = t;
        if(key=='title'){
          title = val;
        }
        if(key=='subtitle'){
          subtitle = val;
        }
        if(key=='author'){
          author = val;
        }
        if(key=='institute'){
          institute = val;
        }
      }
      let data = `<section id='frontmatter' class='page'>
      <p style='text-align:center;font-weight:bold;font-size:1.5em'>${this.unmask(title)}</p>
      <p style='text-align:center'>${this.unmask(subtitle)}</p>
      <p style='text-align:center'>${this.unmask(author)}</p>
      <p style='text-align:center;font-variant:small-caps'>${this.unmask(institute)}</p>
      </section>
      `;
      the_pages.push({id:'frontmatter',idnum:'',title:'Intro',html:data});
    }
  }
}
module.exports = { NitrilePreviewPage };
