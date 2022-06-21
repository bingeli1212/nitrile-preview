'use babel';
const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
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
          text = blk.style.__chapnum;
        }else if(blk.name=='heading'){
          text = blk.level;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='figure'){
          text = blk.style.__fignum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='listing'){
          text = blk.style.__lstnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='table'){
          text = blk.style.__tabnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='equation'){
          text = blk.style.__eqnnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
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
    if(style.__pagenum){
      o.push(`\\setcounter{page}{${style.__pagenum}}`);
    }
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    o.push(`\\vspace{20mm}`);
    o.push(`\\begin{flushleft}`);
    o.push(`\\large Part ${style.__partnum}`);
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
    if(style.__pagenum){
      o.push(`\\setcounter{page}{${style.__pagenum}}`);
    }
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    o.push(`\\begin{flushleft}`);
    o.push(`\\Huge ${style.__chapnum} ${title}`);
    o.push(`\\end{flushleft}`);
    return o.join('\n')
  }
  hdgs_to_section(title,label,level,style){
    var title = this.uncode(style,title);
    var leader = '';
    var o = [];
    o.push('');
    if(style.__chapnum){
      var leader = `${style.__chapnum}.${level}`;
    }else{
      var leader = `${level}`;
    }
    o.push(`\\section*{${leader} ${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  hdgs_to_subsection(title,label,level,style){
    var title = this.uncode(style,title);
    var leader = '';
    var o = [];
    o.push('');
    if(style.__chapnum){
      var leader = `${style.__chapnum}.${level}`;
    }else{
      var leader = `${level}`;
    }
    o.push(`\\subsection*{${leader} ${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  hdgs_to_subsubsection(title,label,level,style){
    var title = this.uncode(style,title);
    var leader = '';
    var o = [];
    o.push('');
    if(style.__chapnum){
      var leader = `${style.__chapnum}.${level}`;
    }else{
      var leader = `${level}`;
    }
    o.push(`\\subsubsection*{${leader} ${title}}${this.to_latexlabelcmd(label)}`);
    return o.join('\n')
  }
  float_to_equation(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = bundles.filter(bundle => bundle.type=='bundle');
    var eqnnum = style.__eqnnum;
    if(style.__chapnum){
      eqnnum = style.__chapnum+"."+eqnnum;
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
  float_to_figure(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    var itms = this.bundles_to_figure_itms(style,bundles);
    var fignum = style.__fignum;
    if(style.__chapnum){
      fignum = style.__chapnum+"."+fignum;
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
  float_to_listing(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle,j) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var lstnum = style.__lstnum;
    if(style.__chapnum){
      lstnum = style.__chapnum+"."+lstnum;
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
  float_to_table(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var tabnum = style.__tabnum;
    if(style.__chapnum){
      tabnum = style.__chapnum+"."+tabnum;
    }
    var caption = this.uncode(style,title).trim();
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'tab');
      let tab = itm.tab;
      let text = `\\begin{threeparttable}\n${tab}\n\\end{threeparttable}`;
      var splitid = bundle.splitid||0;
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
  float_to_page(title,label,style,subtitles,body,bodyrow){
    var o = [];
    o.push('');
    o.push(`\\newpage`);
    if(style.__pagenum){
      o.push(`\\setcounter{page}{${style.__pagenum}}`)
    }
    o.push(`\\pagestyle{simple}`);
    o.push(`\\pagenumbering*{arabic}`);
    return o.join('\n');
  }
  float_to_hr(title,label,style,subtitles,body,bodyrow){
    var o = [];
    title = this.uncode(style,title);
    o.push('');
    o.push(`\\begin{center}`);
    o.push(`\\rule{0.75\\linewidth}{0.5pt}`);
    o.push(`\\end{center}`);
    return o.join('\n');
  }
  to_document() {
    var o = this.build_default_pagenum_map(this.parser.blocks);
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
    var tex = 'uplatex';
    if(tex=='lualatex'){
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
\\geometry{ a5paper, left=15mm, top=20mm, bottom=20mm, }
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
    }else if(tex=='xelatex'){
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
\\geometry{ a5paper, left=15mm, top=20mm, bottom=20mm, }
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
    }else if(tex=='uplatex'){
      return              `\
% !TEX program = upLatex 
\\let\\printglossary\\relax
\\documentclass[dvipdfmx,${opts.join(',')},9pt]{memoir}
${this.to_preamble_essentials_uplatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{geometry}
\\geometry{ a5paper, left=15mm, top=20mm, bottom=20mm, }
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
\\geometry{ a5paper, left=15mm, top=20mm, bottom=20mm, }
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
      if(block.sig=='CHAP' || block.sig=='PART'){
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
        let partnum = style.__partnum;
        let chapnum = style.__chapnum;
        let pagenum = style.__pagenum;
        if(block.sig=='PART'){
          label = label||`part.${partnum}`;
          all.push(`\\item Part ${partnum} ~ ${title}\\dotfill ${pagenum}`);
        }else if(block.sig=='CHAP'){
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
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewLamper };
async function run(){
  const fs = require('fs');
  const path = require('path');
  const process = require('process');
  const { NitrilePreviewParser } = require('./nitrile-preview-parser');
  for(var i=2; i < process.argv.length; ++i){
    var file = process.argv[i];
    var mdfname = `${file.slice(0,file.length-path.extname(file).length)}.md`;
    var texfname = `${file.slice(0,file.length-path.extname(file).length)}.ltx`;
    var parser = new NitrilePreviewParser();
    var translator = new NitrilePreviewLamper(parser);
    await parser.read_file_async(mdfname)
    await parser.read_import_async();
    var document = translator.to_document();
    await translator.write_text_file(fs,texfname,document);
    console.log(`written to ${texfname}`);
    if(path.extname(file).length==0){
      let { NitrilePreviewRun } = require('./nitrile-preview-run');
      let run = new NitrilePreviewRun();
      await run.run_cmd(`pdflatex ${file}`);
    }
  }
}
if(require.main===module){
  run();
}
