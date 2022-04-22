'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
var stylesheet = `\
._VERB::before{
  content: "\\201C";
}
._VERB::after{
  content: "\\201D";
}
.CODE{
  font-size: 92%;
}
.TH, .TD{
  padding: 0.115em 0.4252em;
}
.DMATH{
  margin-top: 6pt;
  margin-bottom: 6pt;
}
.SECTION + .BODY{
  text-indent: 0;
}
.SECTION{
  margin-top: 13pt;
  margin-bottom: 8pt;
}
.SUBSECTION{
  margin-top: 10pt;
  margin-bottom: 8pt;
}
.SUBSUBSECTION{
  margin-top: 8pt;
  margin-bottom: 8pt;
}
.BODY{
  margin: 0pt 0pt 0pt 0pt;
  text-indent: 1.5em;
}
.PRIMARY{
  margin: 13pt 0pt 0pt 0pt;
}
.SECONDARY{
  margin: 6pt 0pt 0pt 0pt;
}
.EXAMPLE{
  margin: 6pt 0pt 6pt 0pt;
}
.VERBATIM{
  margin: 6pt 0pt 6pt 0pt;
}
.DETAILS{
  margin: 6pt 0pt 6pt 0pt;
}
.FLUSHLEFT{
  margin: 6pt 0pt 6pt 0pt;
}
.CENTER{
  margin: 6pt 0pt 6pt 0pt;
}
.COLUMNS{
  margin: 6pt 0pt 6pt 0pt;
}
.LINES{
  margin: 6pt 0pt 6pt 0pt;
}
.ITEMIZE{
  margin: 6pt 0pt 6pt 0pt;
}
.WRAPFIG {
  margin: 6pt 0pt 6pt 0pt;
}
.WRAPTAB {
  margin: 6pt 0pt 6pt 0pt;
}
.EQUATION{
  margin: 6pt 0pt 6pt 0pt;
}
.FIGURE{
  margin: 10pt 0pt 6pt 0pt;
}
.LISTING{
  margin: 10pt 0pt 6pt 0pt;
}
.TABLE{
  margin: 10pt 0pt 6pt 0pt;
}
.FIGCAPTION {
  margin-bottom: 0.2em;
}
@media print {
  @page {
    size: 148mm 210mm;
    margin: 0 0 0 0;
  }  
  .FOLIO {
    page-break-inside: avoid;
    page-break-after: always;
    min-width:100vw;
    max-width:100vw;
    min-height:100vh;
    max-height:100vh;
    box-sizing:border-box;
    overflow: hidden;
    padding:8mm 10mm 0mm 15mm;
    font-size: 10pt;
    line-height: 1.00;
  }
  body {
    margin:0;
    padding:0;
  }
}
@media screen {
  .FOLIO {
    margin: auto auto;
    min-width:148mm;
    max-width:148mm;
    min-height:210mm;
    max-height:210mm;
    box-sizing: border-box;
    overflow: hidden;
    padding: 8mm 10mm 0mm 15mm;
    outline: 1px solid;
    font-size: 10pt;
    line-height: 1.00;
  }
  body {
    margin:0;
  }
}`;
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
var build_default_pagenum_map = function(blocks){
  var o = [];
  var pp = [];
  o.push(pp);
  for (let block of blocks) {
    if(block.name=='part' || block.name=='chapter'){
      pp = [];
      pp.push({block});
      o.push(pp);
    }else if(block.sig=='CAPT' && block.id=='page'){
      pp = [];
      pp.push({block});
      o.push(pp);
    }else if(block.style.splitids){
      //create new blocks one for each splitid in 'block.style.splitids' settings
      let splitids = block.style.splitids||'';
      splitids = splitids.split(/\s+/);
      splitids = splitids.map(s => parseInt(s));
      splitids = splitids.filter(s => Number.isFinite(s));
      splitids.forEach((splitid,j,arr) => {
        if(j==0){
          let block1 = block;//use the original block and style
          block1.splitid = splitid;
          pp.push({block:block1});
        }else{
          pp = [];
          o.push(pp);
          let block0 = {...block};//duplicate and create a new block
          block0.sig = 'CAPT';
          block0.id = 'page';
          pp.push({block:block0});
          let block1 = {...block};//duplicate and create a new block
          block1.splitid = splitid;
          pp.push({block:block1});
        }
      });
    }else if(block.sig=='FRNT'){
      //ignore any unrecognized FRNT block
    }else{
      pp.push({block});  
    }
  }
  ///
  ///remove empty pages
  ///
  o = o.filter((pp) => pp.length);
  ///
  ///add article and page number
  ///
  o.forEach((pp,i) => {
    var id = i+1;
    var pagenum = id;
    pp.pagenum = pagenum;
    pp.forEach((p,j) => {
      if(p.block){
        p.block.style.pagenum = pagenum;
      }  
    });
  });
  return o;
}
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
class NitrilePreviewFolio extends NitrilePreviewHtml {
  constructor(parser) {
    super(parser);
    this.name = 'slide';
    this.style = parser.style;
    this.icon_subpoint = '&#x261E;'//WHITE RIGHT POINTING INDEX
    this.icon_solution = '&#x270D;'//WRITING HAND
    this.icon_folder = '&#x2615;'//HOT BEVERAGE
    this.uchar_checkboxo = '&#x2610;' //BALLOT BOX            
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.uchar_checkboxx = '&#x2612;' //BALLOT BOX WITH X
    this.vw_mm = 148;//mm
    this.vh_mm = 210;//mm
    this.vw = this.vw_mm*this.MM_TO_PX;
    this.vh = this.vh_mm*this.MM_TO_PX;
    this.add_css_map_entry(this.css_map,
      'TOCTITLE', [
        'font-size: 1.38em',
        'margin-bottom: 6pt',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'TOCANCHOR', [
        'text-decoration: none',   
        'color: inherit',     
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'PAGEHEADER', [
         'margin-top:0mm',
         'margin-bottom:8mm',
         'text-align:right', 
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'PART', [
        'position:absolute',
        'top:0',
        'right:0',
        'bottom:0',
        'left:0',
        'display:flex',
        'flex-direction:column',
        'justify-content:center',
        'align-items:center',
        'font-size:200%',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'CHAPTER', [
        'font-size: 1.88em',
        'font-weight: 500',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SECTION', [
        'font-size: 1.10em',
        'font-weight: 600',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'SUBSECTION', [
        'font-size: 1.05em',
        'font-weight: 600',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SUBSUBSECTION', [
        'font-size: 1.00em',
        'font-weight: 600',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERTITLE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 2.5cm',
        'margin-bottom: 0',
        'font-size: 1.8em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERSUBTITLE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0.8cm',
        'margin-bottom: 0',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERINSTITUTE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERAUTHOR', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERDATE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
  }
  hdgs_to_part(title,label,style){
    var cls = 'PART';
    var partnum = style.partnum;
    var css = this.css('PART');
    return(`<div class='PART' style='${css}' > <span><small> Part ${partnum} </small></span> <span>${this.uncode(style,title)}</span> </div>`);
  }
  to_peek_document() {
    var translation_html = this.to_translation_html();
    var body = `${translation_html}`;
    return body;
  }
  to_data() {
    var titlepage_html = this.to_titlepage_html();
    var translation_html = this.to_translation_html();
    var tocpage_html = this.to_tocpage_html();
    var title = this.uncode(this.parser.style,this.parser.title);
    if(!this.parser.titlepage){
      titlepage_html = '';
    }
    if(!this.parser.tocpage){
      tocpage_html = '';
    }
    var body = `${titlepage_html}\n${tocpage_html}\n${translation_html}`;
    var script = '';
    var members = this.parser.members;
    return {stylesheet,body,script,members,title};
  }
  to_xhtml(){
    var data = this.to_data();
    var all = [];
    all.push(`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">`);
    all.push(`<html xmlns='http://www.w3.org/1999/xhtml'>`);
    all.push(`<head>`);
    all.push(`<meta http-equiv='default-style' content='text/html' charset='utf-8'/>`);
    all.push(`<title> ${data.title} </title>`);
    all.push(`<script>`);
    all.push(`//<![CDATA[`);
    all.push(`${data.script}`);
    all.push(`//]]>`);
    all.push(`</script>`);
    all.push(`<style>`);
    all.push(`${data.stylesheet}`);
    all.push(`</style>`);
    all.push(`</head>`);
    all.push(`<body>`);
    all.push(`${data.body}`);
    all.push(`</body>`);
    all.push(`</html>`);
    return all.join('\n');
  }
  to_translation_html() {
    var o = build_default_pagenum_map(this.parser.blocks);
    ///
    ///flatten it
    ///
    var all = [];
    o.forEach((pp,i) => {
      let pagenum = pp.pagenum;
      all.push(`<article class='FOLIO' id='folio${pagenum}' style='position:relative;--page:"${pagenum}";' >`);
      all.push(`<div class='PAGEHEADER' id='page${pagenum}' style='${this.css("PAGEHEADER")}' > ${pagenum} </div>`);
      pp.forEach((p) => {
        let x = this.translate_block(p.block);
        all.push(x);
      });
      all.push(`</article>`);
    });
    return all.join('\n');
  }
  to_titlepage_html(){
    let title     = this.parser.conf_to_string('title','Untitled');
    let subtitle  = this.parser.conf_to_string('subtitle')
    let institute = this.parser.conf_to_string('institute');
    let author    = this.parser.conf_to_string('author');
    var style     = this.parser.style;
    var date      = new Date().toLocaleDateString();
    let data = `<article data-row='0' class='FOLIO'>
    <div class='FRONTMATTERTITLE' style='${this.css("FRONTMATTERTITLE")}' >${this.uncode(style,title)}</div>
    <div class='FRONTMATTERSUBTITLE' style='${this.css("FRONTMATTERSUBTITLE")}' >${this.uncode(style,subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' style='${this.css("FRONTMATTERINSTITUTE")}' >${this.uncode(style,institute)}</div>
    <div class='FRONTMATTERAUTHOR' style='${this.css("FRONTMATTERAUTHOR")}' >${this.uncode(style,author)}</div>
    <div class='FRONTMATTERDATE' style='${this.css("FRONTMATTERDATE")}' >${this.uncode(style,date)}</div>
    </article>
    `;
    return data;
  }
  to_fontsize(length){
    var fontsize = '';
    if( length > 16 ){
      fontsize = '90%';
    }
    if( length > 18 ){
      fontsize = '80%';
    }
    if( length > 20 ){
      fontsize = '70%';
    }
    if( length > 24 ){
      fontsize = '60%';
    }
    return fontsize;
  }
  to_tocpage_html(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.name=='part' || block.name=='chapter'){
        pp.push(block); 
        if(pp.length==38){//a singe page holds at most 38 entries
          pp = [];
          o.push(pp);
        }
      }
    }
    ///
    ///remove empty pp
    ///
    o = o.filter(pp => pp.length);
    ///
    ///generate contents
    ///
    var all = [];
    o.forEach((pp,j) => {
      all.push(`<article class='FOLIO'> `);
      let csstitle = this.css('TOCTITLE');
      let cssanchor = this.css('TOCANCHOR');
      all.push(`<div class='PAGEHEADER' id='toc.${j+1}' style='${this.css("PAGEHEADER")}' > </div>`);
      all.push(`<div class='TOCTITLE' style='${csstitle}'> Table Of Contents </div>`);
      all.push(`<table cellpadding='0' cellspacing='0' width='100%'>`);    
      pp.forEach((p) => {
        let block = p;
        let {label,title,style} = block;
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        title = this.uncode(style,title);
        if(block.name=='part'){
          all.push(`<tr> <td> Part ${partnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
        }else if(block.name=='chapter'){
          all.push(`<tr> <td style='padding-left:1em;' > ${chapnum} &#160; ${title} </td> <td style='text-align:right' > <a href='#page${pagenum}' style='${cssanchor}' >${pagenum}</a> </td> </tr>`);
        }
      });
      all.push(`</table>`);    
      all.push(`</article>`);
    }); 
    let text = all.join('\n');
    return text;
  }
}
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
class NitrilePreviewLamper extends NitrilePreviewLatex {
  constructor(parser) {
    super(parser);
    this.name='lamper';
    this.style = parser.style;
    this.latex_figure_nofloat = 1;
    this.is_enumerate_section = 1;
  }
  phrase_to_ref(style,cnt){
    //if(cnt){
      //return `\\ref{${cnt}}`;
    //}
    //return "??";
    var label = cnt;
    if(label){
      if(this.parser.label_map.has(label)){
        let blk = this.parser.label_map.get(label);
        var text = '';
        if(blk.name=='chapter'){          
          text = blk.style.chapnum;
        }else if(blk.name=='heading'){
          text = blk.level;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.name=='figure'){
          text = blk.style.fignum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.name=='listing'){
          text = blk.style.lstnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.name=='table'){
          text = blk.style.tabnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.name=='equation'){
          text = blk.style.eqnnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }
        text = `\\underline{${text}}`;
        return text;
      }else{
        return `\\sout{${this.smooth(style,label)}}`;///requires the \usepackage[normalem]{ulem}
      }
    }else{
      return "??";
    }
  }
  hdgs_to_part(title,label,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\newpage`);
    if(style.pagenum){
      o.push(`\\setcounter{page}{${style.pagenum}}`);
    }
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    o.push(`\\vspace{20mm}`);
    o.push(`\\begin{flushleft}`);
    o.push(`\\large Part ${style.partnum}`);
    o.push(`\\\\`);
    o.push(`\\Huge ${title}`);
    o.push(`\\end{flushleft}`);
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push(``);
    o.push(`\\newpage`);
    if(style.pagenum){
      o.push(`\\setcounter{page}{${style.pagenum}}`);
    }
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    o.push(`\\begin{flushleft}`);
    o.push(`\\Huge ${style.chapnum} ${title}`);
    o.push(`\\end{flushleft}`);
    return o.join('\n')
  }
  hdgs_to_section(title,label,hdgn,level,style){
    var title = this.uncode(style,title);
    var leader = '';
    var o = [];
    o.push('');
    if(style.chapnum){
      var leader = `${style.chapnum}.${level}`;
    }else{
      var leader = `${level}`;
    }
    if(hdgn==1){
      o.push(`\\section*{${leader} ${title}}${this.to_latexlabelcmd(label)}`);
    }else if(hdgn==2){
      o.push(`\\subsection*{${leader} ${title}}${this.to_latexlabelcmd(label)}`);
    }else{
      o.push(`\\subsubsection*{${leader} ${title}}${this.to_latexlabelcmd(label)}`);
    }
    return o.join('\n')
  }
  float_to_equation(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = bundles.filter(bundle => bundle.type=='bundle');
    var eqnnum = style.eqnnum;
    if(style.chapnum){
      eqnnum = style.chapnum+"."+eqnnum;
    }
    var all = [];
    all.push(``);
    all.push(`\\begin{flushleft}`);
    bundles.forEach((bundle,i,arr) => {
      let itm = this.do_bundle(style,bundle,'fml');
      let fml = itm.fml;
      var sub = '';
      if(arr.length>1){
        sub = this.int_to_letter_a(1+i);
      }
      all.push(`\\hfill\\(${fml}\\)\\hfill{(${eqnnum}${sub})}`);
      all.push(`\\\\`);
    });
    if(all[all.length-1]=='\\\\'){
      all.pop();//remove the last \\\\
    }
    all.push(`\\end{flushleft}`);
    return all.join('\n');
  }
  float_to_figure(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    var itms = this.bundles_to_figure_itms(style,bundles);
    var fignum = style.fignum;
    if(style.chapnum){
      fignum = style.chapnum+"."+fignum;
    }
    var title = this.uncode(style,title).trim();
    var all = [];
    all.push('');
    if(1){
      let onerow = [];
      let o = [];
      //o.push(`\\setlength\\multicolsep{0pt}`);
      itms.forEach((p) => {
        if(p.type=='bundle'){
          let subtitle = this.to_fig_subtitle(p.style,p.subtitle);
          let img = '';
          if(p.img){
            img = p.img;
          }
          let fig = this.img_to_fig(img);
          if(subtitle){
            onerow.push(`\\begin{threeparttable} ${fig} \\begin{tablenotes}[flushleft] \\item \\centering \\small ${subtitle} \\end{tablenotes} \\end{threeparttable}`);
          }else{
            onerow.push(`\\begin{threeparttable} ${fig}                                                                                         \\end{threeparttable}`);
          }
        }else if(p.type=='\\\\'){
          let n = onerow.length;
          if(n){
            o.push(onerow.join('~%\n'));
            o.push('\\\\')
            onerow = [];
          }
        }
      })
      if(onerow.length){
        let n = onerow.length;
        // o.push(`\\begin{multicols}{${n}}`);
        o.push(onerow.join('~%\n'));
        // o.push(`\\end{multicols}`);
        onerow = [];
      }
      var text = o.join('\n');
    }
    ///
    ///Put them together
    ///
    if(1){
      let o = [];
      o.push(``);
      o.push(`\\begin{center}`);
      o.push(`{\\small {Figure ${fignum}} : ${title}}\\vspace{0.5ex}\\break`);
      if(label){
        o.push(`\\label{${label}}`);
      }
      o.push(text);
      o.push(`\\end{center}`);
      return o.join('\n');
    }
  }
  float_to_listing(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle,j) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var lstnum = style.lstnum;
    if(style.chapnum){
      lstnum = style.chapnum+"."+lstnum;
    }
    var caption = this.uncode(style,title).trim();
    if(caption.length==0){
      caption = '~';
    }
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let ss = bundle.ss;
      var splitid = bundle.splitid||0;
      var splitsi = bundle.si||0;
      var opts = [];
      var s_ad = String.fromCodePoint(0xAD);
      if(this.latex_caption_small){
        opts.push(`title={\\small Listing ${lstnum} : ${caption}}`);
      }else{
        opts.push(`title={Listing ${lstnum} : ${caption}}`);
      }
      if(label){
        opts.push(`label={${label}}`);
      }
      opts.push(`basicstyle={\\ttfamily\\small}`)
      opts.push(`numbers=left`);
      opts.push(`firstnumber=${splitsi+1}`);
      opts.push(`xleftmargin=10pt`);
      opts = opts.join(',');
      all.push('');
      all.push(`\\begin{lstlisting}[${opts}]`);
      ss.forEach((x) => {
        if(x==s_ad){
          all.push('');
        }else{
          all.push(x);
        }
      });
      all.push(`\\end{lstlisting}`);
    });
    return all.join('\n');
  }
  float_to_table(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var tabnum = style.tabnum;
    if(style.chapnum){
      tabnum = style.chapnum+"."+tabnum;
    }
    var caption = this.uncode(style,title).trim();
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'tab');
      let tab = itm.tab;
      let text = `\\begin{threeparttable}\n${tab}\n${this.to_tab_subcaptions(style)}\n\\end{threeparttable}`;
      var splitid = bundle.splitid||0;
      if(style.subcaptions.length){
        text = this.to_subcaptioned_tabular(text,style,style.subcaptions);
      }
      let caption_align = '\\centering'
      let caption_environ = 'center'    
      if(this.latex_figure_align=='l'){
        caption_align = '\\raggedright';
        caption_environ = 'flushleft'    
      }else if(this.latex_figure_align=='r'){
        caption_align = '\\raggedleft';
        caption_environ = 'flushright'    
      }
      let caption_fontsize = '';
      if(this.latex_caption_small){
        caption_fontsize = '\\small'
      }  
      if(1){
        let o = [];
        o.push(``);
        o.push(`\\begin{${caption_environ}}`);
        o.push(`${caption_align}`);    
        o.push(`{${caption_fontsize} {Table ${tabnum}${this.int_to_letter_a(splitid)}} : ${caption}}\\vspace{0.5ex}\\break`);
        if(label){
          o.push(`\\label{${label}}`);
        }
        o.push(text);
        o.push(`\\end{${caption_environ}}`);
        let s = o.join('\n');
        all.push(s);
      }else{
        let o = [];
        o.push(``);
        o.push(`\\begin{table}[ht]`);
        o.push(`${caption_align}`);    
        o.push(`{${caption_fontsize} {Table ${tabnum}${this.int_to_letter_a(splitid)}} : ${caption}}\\vspace{0.5ex}\\break`);
        if(label){
          o.push(`\\label{${label}}`);
        }
        o.push(text);
        o.push(`\\end{table}`);
        let s = o.join('\n');
        all.push(s);
      }
    });
    return all.join('\n')
  }
  float_to_page(title,label,style,splitid,body,bodyrow){
    var o = [];
    o.push('');
    o.push(`\\newpage`);
    if(style.pagenum){
      o.push(`\\setcounter{page}{${style.pagenum}}`)
    }
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    return o.join('\n');
  }
  float_to_hr(title,label,style,splitid,body,bodyrow){
    var o = [];
    title = this.uncode(style,title);
    o.push('');
    o.push(`\\begin{center}`);
    o.push(`\\rule{0.75\\linewidth}{0.5pt}`);
    o.push(`\\end{center}`);
    return o.join('\n');
  }
  to_document() {
    var o = build_default_pagenum_map(this.parser.blocks);
    var translationlines = [];
    o.forEach((pp) => {
      pp.forEach((p) => {
        let x = this.translate_block(p.block);
        translationlines.push(x);
      });
    });
    var titlelines = this.to_titlelines();//not the same as titlepagelines
    var tocpagelines = this.to_tocpagelines();
    var titlepagelines = this.to_titlepagelines();
    if(!this.parser.titlepage){
      titlepagelines = [];
    }
    if(!this.parser.tocpage){
      tocpagelines = [];
    }
    var opts = [];
    opts.push('a5paper');
    if(this.parser.tex=='lualatex'){
      return              `\
% !TEX program = LuaLatex 
\\documentclass[${opts.join(',')},${this.bodyfontsize}pt]{memoir}
${this.to_preamble_essentials_lualatex()}
\\renewcommand{\\baselinestretch}{0.95}
\\linespread{0.8}\\selectfont
\\usepackage[overlap,CJK]{ruby}
\\renewcommand\\rubysep{0.0ex}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
\\usepackage[kerning,spacing]{microtype}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }else if(this.parser.tex=='xelatex'){
      return             `\
% !TEX program = XeLatex 
\\documentclass[${opts.join(',')},10pt]{memoir}
${this.to_preamble_essentials_xelatex()}
\\XeTeXlinebreaklocale "zh"
\\XeTeXlinebreakskip = 0pt plus 1pt
\\renewcommand{\\baselinestretch}{0.95}
\\linespread{0.8}\\selectfont
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
\\usepackage[kerning,spacing]{microtype}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }else if(this.parser.tex=='uplatex'){
      return              `\
% !TEX program = upLatex 
\\let\\printglossary\\relax
\\documentclass[dvipdfmx,${opts.join(',')},9pt]{memoir}
${this.to_preamble_essentials_uplatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }else{
      return              `\
% !TEX program = PdfLatex 
\\documentclass[${opts.join(',')},9pt]{memoir}
${this.to_preamble_essentials_pdflatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=10mm, }
\\usepackage[kerning,spacing]{microtype}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
${titlelines.join('\n')}
\\begin{document}
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setcounter{page}{1}
\\pagenumbering*{arabic}
${translationlines.join('\n')}
\\end{document}
`;
    }
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  to_titlelines(){
    var titlelines = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    if (1) {
      titlelines.push(`\\title{${this.uncode(this.style,mytitle)}}`);
      titlelines.push(`\\author{${this.uncode(this.style,myauthor)}}`);
      titlelines.push(`\\date{${this.uncode(this.style,mydate)}}`);
    }
    return titlelines;
  }
  to_tocpagelines(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.name=='chapter' || block.name=='part'){
        pp.push(block); 
        if(pp.length==38){
          pp = [];
          o.push(pp);
        }
      }
    }
    ///
    ///remove empty pp
    ///
    o = o.filter(pp => pp.length);
    var all = [];
    all.push(`\\pagenumbering*{roman}`);
    o.forEach((pp) => {
      all.push(``);
      all.push(`Table Of Contents`);
      all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);
      pp.forEach((p) => {
        let block = p;
        let {label,title,style} = block;
        title = this.uncode(style,title);
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.name=='part'){
          label = label||`part.${partnum}`;
          all.push(`\\item Part ${partnum} ~ ${title}\\dotfill ${pagenum}`);
        }else if(block.name=='chapter'){
          label = label||`chapter.${chapnum}`;
          all.push(`\\item ~~~~${chapnum} ~ ${title}\\dotfill ${pagenum}`)
        }
      });
      all.push(`\\end{list}`);
      all.push(`\\newpage`);
    }); 
    return all;
  }
  to_titlepagelines(){
    var all = [];
    all.push(`\\begin{titlingpage}`);
    all.push(`\\setcounter{page}{1}`);
    all.push(`\\pagestyle{empty}`);
    all.push(`\\maketitle`);
    all.push(`\\begin{abstract}`);
    all.push(`\\end{abstract}`);
    all.push(`\\end{titlingpage}`);
    return all;
  }
}
////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////
class NitrilePreviewCamper extends NitrilePreviewContex {
  constructor(parser) {
    super(parser);
    this.name='camper';
    this.style = parser.style;
    this.contex_papersize = 'A5';
    this.contex_bodyfontsize = 10;
    this.contex_bodylineheight = 1;
    this.contex_whitespacesize = 0;
    this.contex_bodyfontfamily = 'linux';
    this.contex_indenting = 'yes,medium';
    this.contex_style_chapter = '\\tfd';
    this.contex_style_section = '\\bfa';
    this.contex_style_subsection = '\\bf';
    this.contex_style_subsubsection = '\\bf';
    this.contex_style_subsubsubsection = '\\bf';
  }
  hdgs_to_part(title,label,style){
    var o = [];
    var raw = title;
    var label = label||`partnum.${style.partnum}`;
    var mypage = this.to_part_page(title,style);
    o.push('');
    o.push(`\\startpart[title={${this.uncode(style,title)}},reference={${label}},bookmark={${raw}}]`);
    if(style.pagenum){
      o.push(`\\setcounter[userpage][${style.pagenum}]`);
    }
    if(mypage){
      o.push(mypage);
    }else{
      o.push(`Part ${style.partnum} ${this.uncode(style,title)}`);
      o.push(`\\stoppart`)
    }
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,style){
    var o = [];
    var raw = title;
    var label = label||`chapter.${style.chapnum}`;
    o.push('');
    o.push(`\\startchapter[title={${style.chapnum} ~ ${this.uncode(style,title)}},reference={${label}},bookmark={${raw}}]`);
    if(style.pagenum){
      o.push(`\\setcounter[userpage][${style.pagenum}]`);
    }
    return o.join('\n')
  }
  hdgs_to_section(title,label,hdgn,level,style){
    var o = [];
    var raw = title;
    var title = this.uncode(style,title);
    var label = label||`chapter.${style.chapnum}.${level}`;
    if(style.chapnum){
      var leader = `${style.chapnum}.${level}`;
    }else{
      var leader = `${level}`;
    }
    o.push('');
    if(hdgn==1){
      o.push(`\\startsection[title={${leader} ${title}},reference={${label}},bookmark={${raw}}]`);
    }else if(hdgn==2){
      o.push(`\\startsubsection[title={${leader} ${title}},reference={${label}},bookmark={${raw}}]`);
    }else{
      o.push(`\\startsubsubsection[title={${leader} ${title}},reference={${label}},bookmark={${raw}}]`);
    }
    return o.join('\n')
  } 
  float_to_equation(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = bundles.filter(bundle => bundle.type=='bundle');
    var eqnnum = style.eqnnum;
    if(style.chapnum){
      eqnnum = style.chapnum+"."+eqnnum;
    }
    var all = [];
    all.push('');
    all.push('\\blank');
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'fml');
      let sub = '';
      if(arr.length>1){
        sub = this.int_to_letter_a(1+j);
      }
      let text = `\\hfill${itm.fml}\\hfill({${eqnnum}${sub}})`;
      all.push(text);
      all.push('\\godown[0pt]');
    })
    all.pop();//remove the last \\crlf
    all.push('\\blank');
    return all.join('\n');
  }
  float_to_figure(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    let itms = this.bundles_to_figure_itms(style,bundles);
    var fignum = style.fignum;
    if(style.chapnum){
      fignum = style.chapnum+"."+fignum;
    }
    let caption = this.uncode(style,title).trim();
    let salign = this.contex_caption_align;
    let s_align = "center";
    let s_interls = '';
    if(1){
      let onerow = [];
      let o = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let subtitle = this.to_fig_subtitle(p.style,p.subtitle);
          if(p.img){
            onerow.push(`{${p.img}} {${subtitle}}`);
          }
        }else if(p.type=='\\\\'){
          let n = onerow.length;
          if(n){
            o.push(`\\hbox{${s_interls}\\startcombination[${n}*1] ${onerow.join('\n')} \\stopcombination}`);
            o.push('\\\\');
            onerow = [];
          }
        }
      });
      if(onerow.length){
        let n = onerow.length;
        o.push(`\\hbox{${s_interls}\\startcombination[${n}*1] ${onerow.join('\n')} \\stopcombination}`);
      }
      var text = o.join('\n');
    }
    ///
    ///put it together
    ///
    if(1){
      let o = [];
      o.push('')
      o.push(`\\placefigure`);
      o.push(`[here]`);
      o.push(`[${label}]`);
      o.push(`{Figure ${fignum} : ${caption}}`);
      o.push(`{\\startalignment[${s_align}] \\dontleavehmode ${text} \\stopalignment}`);
      return o.join('\n');
    }
  }
  float_to_listing(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle,j) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var lstnum = style.lstnum;
    if(style.chapnum){
      lstnum = style.chapnum+"."+lstnum;
    }
    let caption = this.uncode(style,title);
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let ss = bundle.ss; //raw ss without encoding, used for \\starttyping
      var splitid = bundle.splitid||0;
      var splitsi = bundle.si||0;  
      let o = [];
      ///the space=fixed option disallows line breaking even when the line is too long,
      ///margin=10pt option adds a left margin to the content, line numbers will be right-aligned
      ///and placed to the left-hand side of the context box, numbering=line enables line numbering,
      ///start=41 would assign line number "41" to first line
      o.push(`\\starttyping[start=${splitsi+1},numbering=line,space=fixed,margin=10pt]`);
      ss.forEach( (s) => {
        o.push(s);
      });
      o.push('\\stoptyping');
      let text = o.join('\n');
      text = `\\switchtobodyfont[${this.bodyfontsize*0.9}pt]\\setupinterlinespace[line=${this.bodyfontsize*0.9}pt]${text}`
      all.push('')
      all.push(`\\placelisting`);
      all.push(`[here]`);
      all.push(`[${label}]`);
      all.push(`{Listing ${lstnum}${this.int_to_letter_a(splitid)} : ${caption}}`);
      all.push(`{${text}}`)
    });
    return all.join('\n');
  }
  float_to_table(title,label,style,splitid,body,bodyrow) {
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle,j) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var tabnum = style.tabnum;
    if(style.chapnum){
      tabnum = style.chapnum+"."+tabnum;
    }
    var caption = this.uncode(style,title);
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'tab');
      var splitid = bundle.splitid||0;
      let text = itm.tab;
      if(style.subcaptions.length){
        text = this.to_subcaptioned_tabular(text,style,style.subcaptions);
      }
      all.push('')
      all.push(`\\placetable`);
      all.push(`[here]`);
      all.push(`[${label}]`);
      all.push(`{Table ${tabnum}${this.int_to_letter_a(splitid)} : ${caption}}`);
      all.push(`{${text}}`)
    });
    return all.join('\n');
  }
  float_to_page(title,label,style,splitid,body,bodyrow){
    var all = [];
    all.push('');
    all.push('\\page');
    if(style.pagenum){
      all.push(`\\setcounter[userpage][${style.pagenum}]`)
    }
    return all.join('\n');
  }
  float_to_hr(title,label,style,splitid,body,bodyrow){
    var all = [];
    all.push('');
    title = this.uncode(style,title);
    all.push(`\\startformula`);
    all.push(`\\text{\\hl[10]}`);
    all.push(`\\stopformula`);
    return all.join('\n');
  }
  phrase_to_ref(style,cnt){
    // if(cnt){
    //   return `\\in[${cnt}]`
    // }else{
    //   return "??";
    // }
    var label = cnt;
    if(label){
      if(this.parser.label_map.has(label)){
        let blk = this.parser.label_map.get(label);
        var text = '';
        if(blk.name=='chapter'){          
          text = blk.style.chapnum;
        }else if(blk.name=='heading'){
          text = blk.level;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.name=='figure'){
          text = blk.style.fignum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.name=='listing'){
          text = blk.style.lstnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.name=='table'){
          text = blk.style.tabnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.name=='equation'){
          text = blk.style.eqnnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }
        var text = `\\inframed[frame=off]{\\underbar{${text}}}`;
        return text;
      }else{
        return `\\inframed[frame=off]{\\overstrike{${this.smooth(style,label)}}}`;
      }
    }else{
      return "??";
    }
  }
  to_document() {
    var o = build_default_pagenum_map(this.parser.blocks);
    var translationlines = [];
    o.forEach((pp) => {
      pp.forEach((p) => {
        let x = this.translate_block(p.block);
        translationlines.push(x);
      });
    });
    var titlepagelines = this.to_titlepagelines();
    var tocpagelines = this.to_tocpagelines();
    if(!this.parser.titlepage){
      titlepagelines = [];
    }
    if(!this.parser.tocpage){
      tocpagelines = [];
    }
    var data = `\
% !TEX program = context
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_definecolors()}
${this.to_preamble_langs()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\setscript[hanzi] % hyphenation
\\setupinteraction[state=start,color=,contrastcolor=]
\\placebookmarks[part,chapter]
\\setuphead[part][number=no]
\\setuphead[chapter][style=\\tfd,number=no]
\\setuphead[section][style=\\bfa,number=no]
\\setuphead[subsection][style=\\bf,number=no]
\\setuphead[subsubsection][style=\\bf,number=no]
\\setuphead[subsubsubsection][style=\\bf,number=no]
\\definefloat[listing][listings]
\\definedescription[latexdesc][
  headstyle=normal, style=normal, align=flushleft,
  alternative=hanging, width=fit, before=, after=]
\\definedescription[DLpacked][
  headstyle=bold, style=normal, align=flushleft,
  alternative=hanging, width=broad, margin=20pt, before=, after=,]
\\definedescription[HLpacked][
  headstyle=normal, style=normal, align=flushleft, margin=1em,
  alternative=hanging, width=broad, before=, after=,]
\\definedescription[DL][
  headstyle=bold, style=normal, align=flushleft,
  alternative=hanging, width=broad, margin=20pt]
\\definedescription[HL][
  headstyle=normal, style=normal, align=flushleft, margin=1em,
  alternative=hanging, width=broad]
\\setupinterlinespace[line=10pt]
\\setupwhitespace[0pt]
\\setupindenting[yes,medium]
\\setuppapersize[A5]    
\\setupbodyfont[dejavu,10pt]      
\\setupcaptions[minwidth=\\textwidth, align=middle, style=small, location=top, number=no]
\\setupcombination[distance=0.33em,style=small]                 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\enabletrackers[fonts.missing]
\\setuppagenumbering[location={header,right},style=]
\\setuplayout[topspace=10mm,
  header=10mm,
  footer=0mm,
  height=190mm,
  width=120mm,
  backspace=15mm,
  leftmarginwidth=0mm,
  rightmarginwidth=0mm,
  leftmargindistance=0mm,
  rightmargindistance=0mm]
%\\setupcombination[style=small]
\\starttext
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setupuserpagenumber[numberconversion=numbers]
${translationlines.join('\n')}
\\stoptext
    `;
    return data;
  }
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
  }
  to_titlepagelines(){
    var all = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    if (mytitle) {
      all.push(`\\startstandardmakeup`)
      all.push(`\\startalignment[center]`);
      all.push(`{\\tfd ${this.uncode(this.style,mytitle)}}`);
      all.push(`\\blank[2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,myaddr)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,myauthor)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,mydate)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`\\stopalignment`);
      all.push(`\\stopstandardmakeup`)
      all.push('');
    }
    return all;
  }
  to_tocpagelines(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.name=='part' || block.name=='chapter'){
        pp.push(block); 
        if(pp.length==38){
          pp = [];
          o.push(pp);
        }
      }
    }
    ///
    ///remove empty pp
    ///
    o = o.filter(pp => pp.length);
    ///
    ///generate TOC
    ///
    var all = [];
    o.forEach((pp) => {
      all.push(``);
      all.push(`\\startstandardmakeup`);
      all.push(`\\setupuserpagenumber[numberconversion=romannumerals]`);
      all.push(`\\startalignment[flushleft]`);
      all.push(`\\tfd Table Of Contents`);
      all.push(`\\stopalignment`);
      all.push(`\\startlines`);
      pp.forEach((p) => {
        let block = p;
        let {label,title,style} = block;
        title = this.uncode(this.style,title);
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.name=='part'){
          label = label||`part.${partnum}`;
          all.push(`Part ${partnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`);
        }else if(block.name=='chapter'){
          label = label||`chapter.${chapnum}`;
          all.push(`~~~~${chapnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`)
        }
      });
      all.push(`\\stoplines`);
      all.push('\\vfill');
      all.push(`\\stopstandardmakeup`);
    }); 
    return all;
  }
  to_part_page(title,style){
    return `\
\\dontleavehmode
\\startalignment[center]
\\blank[6cm]
{\\tfa Part ${style.partnum}}
\\blank[1cm]
{\\tfd ${this.uncode(style,title)}}
\\stopalignment
\\stoppart`;
  }
}
////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    var fname = process.argv[2];    
    if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      if(parser.tex=='context'){
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewCamper(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfile,dcument);
        console.log(`written to ${texfile}`);
      }else if(parser.tex=='pdflatex'||parser.tex=='xelatex'||parser.tex=='lualatex'){
        var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewLamper(parser);
        var dcument = translator.to_document();
        await this.write_text_file(fs,texfile,dcument);
        console.log(`written to ${texfile}`);
      }else{
        var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
        var translator = new NitrilePreviewFolio(parser);
        var xhtml = translator.to_xhtml();
        await this.write_text_file(fs,xhtmlfile,xhtml);
        console.log(`written to ${xhtmlfile}`);
      }
    }
  }
}
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewFolio, NitrilePreviewLamper, NitrilePreviewCamper };
if(require.main===module){
  var server = new Server();
  server.run();
}
