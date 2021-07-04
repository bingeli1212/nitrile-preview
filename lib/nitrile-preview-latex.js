'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewDiagramTikz } = require('./nitrile-preview-diagramtikz');
const { NitrilePreviewLmath } = require('./nitrile-preview-lmath');
const unicodeblocks = require('./nitrile-preview-unicodeblocks');
const os = require('os');

class NitrilePreviewLatex extends NitrilePreviewTranslator {

  constructor(parser,program) {
    super(parser);
    this.program = program;        
    this.name='LATEX';
    this.tokenizer = new NitrilePreviewLmath(this);
    this.diagram = new NitrilePreviewDiagramTikz(this);
    this.imgs = [];
    this.flags = {};
    this.enumerate_counter = 0;
    this.style = parser.style;
    this.symbol_cc_map = this.tokenizer.symbol_cc_map;
    this.count_part = 0;
    this.count_chapter = 0;
    this.count_section = 0;
    this.count_subsection = 0;
    this.count_subsubsection = 0;      
  }
  hdgs_to_part(title,label,partnum,chapternum,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\part{${this.uncode(style,title)}}`);
    this.count_part++;
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,partnum,chapternum,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\chapter{${title}}${this.to_latexlabelcmd(label)}`);
    // o.push(`\\addcontentsline{toc}{chapter}{${raw}}`);
    this.count_chapter++;
    return o.join('\n')
  }
  hdgs_to_section(title,label,partnum,chapternum,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\section{${title}}${this.to_latexlabelcmd(label)}`);
    // o.push(`\\addcontentsline{toc}{section}{${raw}}`);
    this.count_section++;
    return o.join('\n')
  }
  hdgs_to_subsection(title,label,partnum,chapternum,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\subsection{${title}}${this.to_latexlabelcmd(label)}`);
    // o.push(`\\addcontentsline{toc}{subsection}{${raw}}`);
    this.count_subsection++;
    return o.join('\n')
  }
  hdgs_to_subsubsection(title,label,partnum,chapternum,level,style){
    var title = this.uncode(style,title);
    var o = [];
    o.push('');
    o.push(`\\subsubsection{${title}}${this.to_latexlabelcmd(label)}`);
    this.count_subsubsection++;
    return o.join('\n')
  }
  /////////////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////////////
  item_dl_to_text(i,item,nblank){
    var o = [];
    var value = this.uncode(item.style,item.value);
    if(Array.isArray(item.values)){
      value = item.values.map((s) => this.uncode(item.style,s)).join('\\\\')
    }
    value = `\\parbox{\\linewidth}{${value}}`;
    var text = this.uncode(item.style,item.text).trim();
    if(text.length){
      o.push(`\\item[${value}] \\hfill\\break ${text}`)            
    }else{
      o.push(`\\item[${value}] ${text}`)
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`${this.untext(p.style,p.lines)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_hl_to_text(i,item,nblank){
    var o = [];
    var text = this.polish_verb(item.style,item.text);
    var text = `\\texttt{${text}}`;
    o.push(`\\item ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`${this.untext(p.style,p.lines)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ol_to_text(i,item,nblank){
    var o = [];
    var text = this.uncode(item.style,item.text);
    if(item.type == 'A'){
      o.push(`\\item[${this.to_A_letter(item.value)}${item.ending}] ${text}`)
    }else if(item.type == 'a'){
      o.push(`\\item[${this.to_a_letter(item.value)}${item.ending}] ${text}`)
    }else if(item.type == 'I'){
      o.push(`\\item[${this.to_I_letter(item.value)}${item.ending}] ${text}`)
    }else if(item.type == 'i'){
      o.push(`\\item[${this.to_i_letter(item.value)}${item.ending}] ${text}`)
    }else if(item.value) {
      o.push(`\\item[${item.value}${item.ending}] ${text}`);
    }else if(item.bullet=='*'){
      let value = i+1;
      o.push(`\\item[${value}.] ${text}`);
    }else{
      o.push(`\\item ${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`${this.untext(p.style,p.lines)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ul_to_text(i,item,nblank){
    var o = [];
    var text = this.uncode(item.style,item.text);
    o.push(`\\item ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`${this.untext(p.style,p.lines)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank)}`);
        }
      });
    }
    return o.join('\n\n')
  }
  itemize_to_text(itemize,nblank){
    var bull = itemize.bull;
    var items = itemize.items;
    var o = [];
    switch (bull) {
      case 'DL': {
        if(!nblank){
          o.push(`\\begin{packed_desc}`)  
        }else{
          o.push(`\\begin{description}`)
        }
        let last_o = [];
        items.forEach((item,j) => {
          let p = (last_o.length) ? last_o[last_o.length-1] : null;
          if(p && p.text.trim().length==0 && p.more.length==0){
            last_o.push(item);
            let values = last_o.map((p) => p.value);
            item.values = values;
            let text = this.item_dl_to_text(j,item,nblank);
            o.pop();
            o.push(text);
          }else{
            last_o = [];
            last_o.push(item);
            let text = this.item_dl_to_text(j,item,nblank);
            o.push(text);
          }
        });
        if(!nblank){
          o.push(`\\end{packed_desc}`)  
        }else{
          o.push(`\\end{description}`)
        }
        break;
      }
      case 'HL': {
        if(!nblank){
          o.push(`\\begin{packed_hang}`);
        }else{
          o.push(`\\begin{hanginglist}`);
        }
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(j,item,nblank);
          o.push(text);
        });
        if(!nblank){
          o.push(`\\end{packed_hang}`)
        }else{
          o.push(`\\end{hanginglist}`)
        }
        break;
      }
      case 'OL': {
        if(!nblank){
          o.push(`\\begin{packed_enum}`)
        }else{
          o.push(`\\begin{enumerate}`);
        }
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(j,item,nblank);
          o.push(text);
        });
        if(!nblank){
          o.push('\\end{packed_enum}')
        }else{
          o.push('\\end{enumerate}')
        }
        break;
      }
      case 'UL': {
        if(!nblank){
          o.push(`\\begin{packed_item}`);  
        }else{
          o.push(`\\begin{itemize}`);
        }
        items.forEach((item,j) => {
          let text = this.item_ul_to_text(j,item,nblank);
          o.push(text);
        });
        if(!nblank){
          o.push('\\end{packed_item}')
        }else{
          o.push('\\end{itemize}')
        }
        break;
      }
    }
    return o.join('\n\n');
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ////////////////////////////////////////////////////////////////////////////////////
  do_HRLE(block){
    var o = [];
    var {title,style} = block;
    o.push('');
    title = this.uncode(style,title);
    o.push(`\\begin{center}`);
    o.push(`\\rule{0.75\\linewidth}{0.5pt}`);
    o.push(`\\end{center}`);
    return o.join('\n');
  }
  /////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////
  fence_to_parbox(style,ss) {
    var latex_width = this.string_to_latex_width(style.width,1,'\\linewidth');
    var texts = ss.map((s) => this.uncode(style,s));
    var text = texts.join('\\\\')
    var text = `\\parbox{${latex_width}}{${text}}`
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_displaymath(style,ss) {
    var str = ss.join('\n')
    var used = new Set();
    var text = this.tokenizer.to_lmath(str,style,used,1);
    var text = `\\[${text}\\]`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_ink(style,ss) {
    var { text } = this.diagram.to_ink(style,ss);
    let width = this.string_to_latex_width(style.width,style.zoom,'\\linewidth');
    let height = this.string_to_latex_height(style.height,style.zoom);
    if(width && height){
      text = `\\resizebox{${width}}{${height}}{${text}}`;
    }else if(width){
      text = `\\resizebox{${width}}{!}{${text}}`;
    }else if(height){
      text = `\\resizebox{!}{${height}}{${text}}`;
    }
    if(style.frame==1){
      text = `\\setlength\\fboxsep{0pt}\\fbox{${text}}`
    }
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_diagrams(style,ss) {
    var animate = this.g_to_animate_string(style);
    var quantity = this.g_to_count_int(style);
    var env_array = this.animate_to_env_array(animate,quantity);
    var o = [];
    for(let env of env_array){
      var g = {...style,env};
      var { img, sub } = this.diagram.to_diagram(g,ss);
      sub = this.uncode(style,sub);
      o.push({img,sub}); 
    }
    return o;
  }
  fence_to_diagram(style,ss) {
    var { img, sub } = this.diagram.to_diagram(style,ss);
    sub = this.uncode(style,sub);
    var o = [];
    o.push({img,sub});
    return o;
  }
  fence_to_img(style,ss) {
    var [srcs,subtitle] = this.ss_to_img_srcs_and_subtitle(ss,style);
    var fname = this.choose_latex_image_file(srcs);
    this.imgs.push(fname);
    /// in figure
    var opts = [];
    if(style.stretch){
      opts.push(`width=${style.stretch}\\linewidth`);
    }else if(style.width && style.height){
      opts.push(`width=${style.width}mm`);
      opts.push(`height=${style.height}mm`);
    }else if(style.width){
      opts.push('keepaspectratio');
      opts.push(`width=${style.width}mm`);
    }else if(style.height){
      opts.push('keepaspectratio');
      opts.push(`height=${style.height}mm`);
    }
    if(style.frame==1){
      opts.push(`frame`)
    }
    var img = `\\includegraphics[${opts.join(',')}]{${fname}}`;
    var sub = this.uncode(style,subtitle);  
    var o = [];
    o.push({img,sub});
    return o;
  }
  fence_to_verbatim(style,ss){
    var all = [];
    all.push(`\\begin{tabular}{@{}l@{}}`);
    ss.forEach((s) => {
      s = this.polish_verb(style,s);
      if (!s) {
        s = "~";
      }
      s = `{\\ttfamily{}${s}}\\\\`;
      all.push(s);
    })
    all.push('\\end{tabular}')
    var text = all.join('\n')
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_center(style,ss) {
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var all = [];
    all.push('');
    all.push(`\\begin{center}`);
    all.push(text);
    all.push(`\\end{center}`);
    var text = all.join('\n');
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_flushright(style,ss) {
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var all = [];
    all.push('');
    all.push(`\\begin{flushright}`);
    all.push(text);
    all.push(`\\end{flushright}`);
    var text = all.join('\n');
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_tabular(style,ss) {
    if(style.float=='longtable'){
      ///'xtabular'  
      //   \tablehead{\hline {\bfseries Name} & {\bfseries Desc} \\}
      //   \tabletail{\hline \multicolumn{2}{r}{\itshape to be continued...} \\}
      //   \tablelasttail{\multicolumn{${n}}{r}{} \\smallskip}
      var title = style.title||'';
      var label = style.label||'';
      var rows = this.ss_to_tabular_rows(ss,style);
      var rows = this.update_rows_by_hrule(rows,style.hrule);
      rows.forEach((pp) => {
        pp.forEach((p) => {
          p.text = this.uncode(style,p.raw);
        })
      })    
      var none = this.assert_int(style.nocaption);
      var n = (rows.length) ? rows[0].length : 1;
      var pcols = this.halign_to_latex_pcols(n,style.halign);
      var pcol = this.pcols_to_latex_pcol(pcols,style.vrule);
      var all = [];
      all.push('');
      rows.forEach((pp,j,arr)=>{
        if(j==0){
          if(!none){
            if(label){
              all.push(`\\tablecaption{${this.uncode(style,title)}}\\label{${label}}`);
            }else{
              all.push(`\\tablecaption{${this.uncode(style,title)}}`);
            }
          }
        }
        if(j==0 && style.head && style.hrule=='---'){
          let ss = pp.map(p => p.text).map(s => `{\\bfseries ${s}}`);
          if(pp.lower==2){
            all.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\ \\hline \\hline}`)
          }else if(pp.lower==1){
            all.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\ \\hline}`)
          }else{
            all.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\}`)
          }
          all.push(`\\tabletail{\\hline \\multicolumn{${n}}{r}{\\itshape to be continued...} \\\\}`);
          all.push(`\\tablelasttail{}`);
          all.push(`\\begin{flushleft}`)
          all.push(`\\begin{xtabular}{${pcol}}`)
          if(pp.lower==2){
            all.push('\\hline');
            all.push('\\hline');
          }else if(pp.lower==1){
            all.push('\\hline');
          }
        }else if(j==0 && style.head && style.hrule=='--'){
          let ss = pp.map(p => p.text).map(s => `{\\bfseries ${s}}`);
          //before and after
          if(pp.lower==2){
            all.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\ \\hline \\hline}`)
          }else if(pp.lower==1){
            all.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\ \\hline}`)
          }else{
            all.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\}`)
          }
          all.push(`\\tabletail{\\hline \\multicolumn{${n}}{r}{\\itshape to be continued...} \\\\}`);
          all.push(`\\tablelasttail{\\hline}`);
          all.push(`\\begin{flushleft}`)
          all.push(`\\begin{xtabular}{${pcol}}`)
          if(pp.lower==2){
            all.push('\\hline');
            all.push('\\hline');
          }else if(pp.lower==1){
            all.push('\\hline');
          }
        }else if(j==0 && style.head && style.hrule=='-'){
          let ss = pp.map(p => p.text).map(s => `{\\bfseries ${s}}`);
          //inter-rows
          if(pp.lower==2){
            all.push(`\\tablehead{${ss.join(' & ')} \\\\ \\hline \\hline}`)
          }else if(pp.lower==1){
            all.push(`\\tablehead{${ss.join(' & ')} \\\\ \\hline}`)
          }else{
            all.push(`\\tablehead{${ss.join(' & ')} \\\\}`)
          }
          all.push(`\\tabletail{\\hline \\multicolumn{${n}}{r}{\\itshape to be continued...} \\\\}`);
          all.push(`\\tablelasttail{\\hline}`);
          all.push(`\\begin{flushleft}`)
          all.push(`\\begin{xtabular}{${pcol}}`)
          if(pp.lower==2){
            all.push('\\hline');
            all.push('\\hline');
          }else if(pp.lower==1){
            all.push('\\hline');
          }
        }else if(j==0 && style.head){
          //no hrules
          let ss = pp.map(p => p.text).map(s => `{\\bfseries ${s}}`);
          if(pp.lower==2){
            all.push(`\\tablehead{${ss.join(' & ')} \\\\ \\hline \\hline}`)
          }else if(pp.lower==1){
            all.push(`\\tablehead{${ss.join(' & ')} \\\\ \\hline}`)
          }else{
            all.push(`\\tablehead{${ss.join(' & ')} \\\\}`)
          }
          all.push(`\\tabletail{\\multicolumn{${n}}{r}{\\itshape to be continued...} \\\\}`);
          all.push(`\\tablelasttail{}`);
          all.push(`\\begin{flushleft}`)
          all.push(`\\begin{xtabular}{${pcol}}`)
          if(pp.lower==2){
            all.push('\\hline');
            all.push('\\hline');
          }else if(pp.lower==1){
            all.push('\\hline');
          }
        }else if(j==0){
          all.push(`\\begin{flushleft}`)
          all.push(`\\begin{xtabular}{${pcol}}`)
          if(pp.upper==2){
            all.push('\\hline');
            all.push('\\hline');
          }else if(pp.upper==1){
            all.push('\\hline');
          }
          let s = this.row_to_tabular(pp,style);
          all.push(s);
        }else{
          ///table body
          let s = this.row_to_tabular(pp,style);
          all.push(s);
        }
      });
      if(rows.length){
        all.push('\\end{xtabular}')
        all.push('\\end{flushleft}')
      }
      var text = all.join('\n')
      var o = [];
      o.push({img:text,sub:''});
      return o;
    }
    else {
      ///'figure','table', or plaintext
      var rows = this.ss_to_tabular_rows(ss,style);
      var rows = this.update_rows_by_hrule(rows,style.hrule);
      rows.forEach((pp) => {
        pp.forEach((p) => {
          p.text = this.uncode(style,p.raw);
        })
      })
      if(style.head && rows.length){
        let pp0 = rows[0];
        pp0.forEach((p) => {
          p.text = `{\\bfseries ${p.text}}`;
        });
      }
      //
      //put it together
      //
      var n = (rows.length) ?  rows[0].length : 1;
      var pcols = this.halign_to_latex_pcols(n,style.halign);
      var pcol = this.pcols_to_latex_pcol(pcols,style.vrule);
      var all = [];
      rows.forEach((pp,j,arr)=>{
        if(j==0){
          all.push(`\\begin{tabular}{${pcol}}`);
          if(pp.upper==2){
            all.push('\\hline');
            all.push('\\hline');
          }else if(pp.upper==1){
            all.push('\\hline');
          }
        }
        all.push(this.row_to_tabular(pp,style));
      })
      if(rows.length){
        all.push('\\end{tabular}')
      }
      var text = all.join('\n');
      if(text.small){
        var text = `{\\small${text}}`;
      }
      var o = [];
      o.push({img:text,sub:''});
      return o;
    }
  }
  fence_to_list(style,ss) {
    var itms = this.ss_to_lines_itms(ss,style);
    var bullet     = '{\\textbullet}';
    // var circlebox  = this.uncode(this.style,String.fromCodePoint(0x2714));
    // var circleboxo = this.uncode(this.style,String.fromCodePoint(0x274D)); 
    // var squarebox  = this.uncode(this.style,String.fromCodePoint(0x2714)); 
    // var squareboxo = this.uncode(this.style,String.fromCodePoint(0x274F));
    var circleboxo = this.uncode(this.style,String.fromCodePoint(0x274D)); 
    var squareboxo = this.uncode(this.style,String.fromCodePoint(0x2752)); 
    var circlebox = this.uncode(this.style,String.fromCodePoint(0x25CF));
    var squarebox = this.uncode(this.style,String.fromCodePoint(0x25A0));
    let check_ss = this.string_to_array(this.assert_string(style.check));
    const nbsp = '~~';
    itms.forEach((p,i,arr) => {
      if(p.text=='\\\\') {
        p.text = '~';
      }else{
        p.text = this.uncode(style,p.text);
      }
      p.bull = this.uncode(style,p.bull);
      p.value = this.uncode(style,p.value);
      if(p.type == 'UL'){
        p.item = `${bullet}`
        p.latex = `${p.text}`
      }
      else if(p.type == 'OL'){
        p.item = `${i+1}.`
        p.latex = `${p.text}`
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        p.item = `${p.value}${p.ending}`;
        p.latex = `${p.text}`;
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        p.item  = `${this.to_a_letter(p.value)}${p.ending}`;
        p.latex = `${p.text}`;
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        p.item  = `${this.to_A_letter(p.value)}${p.ending}`;
        p.latex = `${p.text}`;
      }
      else if(p.type == 'DL'){
        if(p.text){
          p.item  = `\\textbf{${p.value}}`;
          p.latex = `${p.text}`;
          p.hfill = 1;
        }else{
          p.item  = `\\textbf{${p.value}}`;
        }
      }
      else if(p.type == 'INDENTED'){
        //empty RB
        p.indented = 1;
        p.item  = '';
        p.latex = `${p.text}`;
      }
      else{
        ///for other types, the hangindent is not set
        p.item = '';
        p.latex = `${p.text}`;
      }
    });
    var all = [];
    all.push(`\\begin{tabular}{@{}p{\\linewidth}@{}}`);
    itms.forEach((p) => {
      if(p.indented){
        let s = '~'.repeat(p.value);
        all.push(`${s} ${p.latex} \\tabularnewline`)
      }else if(p.item && p.hfill && p.latex){
        all.push(`${p.item} ${p.latex} \\tabularnewline`)
      }else if(p.item && p.latex){
        all.push(`${p.item} ${p.latex} \\tabularnewline`)
      }else if(p.item){
        all.push(`${p.item} \\tabularnewline`)
      }else if(p.latex){
        all.push(`${p.latex} \\tabularnewline`)
      }else{
        console.log('error, no p.item or p.latex');
      }
    });
    all.push(`\\end{tabular}`);
    var text = all.join('\n');
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  ///////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////
  float_to_paragraph(title,label,style,body){
    var all = [];
    var text = this.untext(style,body);
    all.push('');
    all.push(text);
    return all.join('\n');
  }
  float_to_indent(title,label,style,body){
    var all = [];
    var text = this.untext(style,body);
    all.push('');
    all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}}`);
    all.push(`\\item ${text}`);
    all.push(`\\end{list}`)
    return all.join('\n');
  }
  float_to_primary(title,label,style,body,rank){
    title = this.uncode(style,title);
    let text = this.untext(style,body);
    var all = [];
    if (rank===1) {
      text = `\\paragraph{${title}} ${text}`;
      all.push('');
      all.push(`${text}`);
    } 
    else if (rank===2) {
      text = `\\subparagraph{${title}} ${text}`;
      all.push('');
      all.push(`${text}`);
    }
    else {
      text = `{\\bfseries\\itshape{}${title}} ${text}`;
      all.push('');
      all.push(`${text}`);
    } 
    return all.join('\n');
  }
  float_to_sample(title,label,style,body){
    var all = [];
    all.push('');
    body = body.map((s) => {
      s = this.polish_verb(style,s);
      s = s.replace(/\s/g, "~");
      if (!s) {
        s = "~";
      }
      s = `{\\ttfamily{}${s}}`;
      return s;
    });
    var text = body.join('\\\\\n');
    all.push(text); 
    return all.join('\n');
  }
  float_to_itemize(title,label,style,itemize,nblank){
    var all = [];
    var text = this.itemize_to_text(itemize,nblank);
    all.push('');
    all.push(text);
    return all.join('\n')
  }
  float_to_blockquote(title,label,style,ss){
    if(1){
      let all = [];
      let clusters = this.ss_to_clusters(ss);
      clusters = clusters.map((ss) => {
        var s = this.join_para(ss);
        var s = this.uncode(style,s);
        all.push(s);
      })
      var text = all.join('\n\n');
    }
    if(1){
      let all = [];
      all.push('');
      all.push(`\\begin{quote}`);
      all.push(`\\textquotedblleft{}${text}\\textquotedblright`);
      all.push(`\\end{quote}`);
      var text = all.join('\n');
    }
    return text;
  }
  float_to_figure(title,label,style,ss){
    var style = {...style,title,label,float:'figure'};
    var itms = this.ss_to_figure_itms(ss,style);
    var title = this.uncode(style,title).trim();
    var none = this.assert_int(style.nocaption);
    var all = [];
    all.push('');
    if(style.wrap){
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          all.push(p.img)
        }
      });
      var text = all.join('\n');
      if(style.wrap=='left'){
        text = `\\begin{wrapfigure}{l}{0pt}\n${text}\n\\end{wrapfigure}`;
      }else{
        text = `\\begin{wrapfigure}{r}{0pt}\n${text}\n\\end{wrapfigure}`;
      }
      return text;
    }
    if(style.subfigure){
      let d = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          p.sub = `\\footnotesize ${p.sub}`
          d.push(`\\subfigure[${p.sub}]{${p.img}}`)
          let s = d.join('\n');
          all.pop();
          all.push(s);
        }else{
          d = [];
          all.push(`\\\\`);
          all.push('');
        }
      });
      var o = [];
      o.push(`\\begin{figure}[ht]`);
      o.push(`\\centering`);
      if(none && !title){
        ///this is needed as documented by the 'subfigure' package document.
        ///without this the subfigure counter will continue from the previous figure
        o.push(`\\setcounter{subfigure}{0}`);
      }else if(none && title){
        o.push(`\\caption{${title}}`);
        if(label){
          o.push(`\\label{${label}}`);
        }
      }else{
        o.push(`\\caption{${title}}`);
        if(label){
          o.push(`\\label{${label}}`);
        }
      }
      all.forEach((s) => {
        o.push(s);
      })
      o.push(`\\end{figure}`);  
      return o.join('\n')
    }
    else{
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          all.push(p.img)
        }
      });
      var o = [];
      o.push(`\\begin{figure}[ht]`);
      o.push(`\\centering`);    
      if(none && !title){
        ///this is needed as documented by the 'subfigure' package document.
        ///without this the subfigure counter will continue from the previous figure
        o.push(`\\setcounter{subfigure}{0}`);
      }else if(none && title){
        o.push(`\\caption{${title}}`);
        if(label){
          o.push(`\\label{${label}}`);
        }
      }else{
        o.push(`\\caption{${title}}`);
        if(label){
          o.push(`\\label{${label}}`);
        }
      }
      all.forEach((s) => {
        o.push(s);
      })
      o.push(`\\end{figure}`);
      return o.join('\n')
    }
  }
  float_to_table(title,label,style,ss){
    var style = {...style,title,label,float:'figure'};
    var itms = this.ss_to_figure_itms(ss,style);
    var title = this.uncode(style,title).trim();
    var none = this.assert_int(style.nocaption);
    var all = [];
    all.push('');
    if(style.wrap){
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          all.push(p.img)
        }
      });
      var text = all.join('\n');
      let f = (style.wrap == 'left') ? 'l' : 'r';
      text = `\\begin{wraptable}{${f}}{0pt}${text}\\end{wraptable}`;
      return text;
    }
    else if(style.subfigure){
      let d = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          p.sub = `\\footnotesize ${p.sub}`
          d.push(`\\subfigure[${p.sub}]{${p.img}}`)
          let s = d.join('\n');
          all.pop();
          all.push(s);
        }else{
          d = [];
          all.push(`\\\\`);
          all.push('');
        }
      });
      var o = [];
      o.push(`\\begin{table}[ht]`);
      o.push(`\\centering`);
      if(none && !title){
        ///this is needed as documented by the 'subfigure' package document.
        ///without this the subfigure counter will continue from the previous figure
        o.push(`\\setcounter{subfigure}{0}`);
      }else if(none && title){
        o.push(`\\caption{${title}}`);
        if(label){
          o.push(`\\label{${label}}`);
        }
      }else{
        o.push(`\\caption{${title}}`);
        if(label){
          o.push(`\\label{${label}}`);
        }
      }
      all.forEach((s) => {
        o.push(s);
      })
      o.push(`\\end{table}`);
      return o.join('\n');
    }
    else{
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          all.push(p.img)
        }
      });
      var o = [];
      o.push(`\\begin{table}[ht]`);
      o.push(`\\centering`);
      if(none && !title){
        ///this is needed as documented by the 'subfigure' package document.
        ///without this the subfigure counter will continue from the previous figure
        o.push(`\\setcounter{subfigure}{0}`);
      }else if(none && title){
        o.push(`\\caption{${title}}`);
        if(label){
          o.push(`\\label{${label}}`);
        }
      }else{
        o.push(`\\caption{${title}}`);
        if(label){
          o.push(`\\label{${label}}`);
        }
      }
      all.forEach((s) => {
        o.push(s);
      })
      o.push(`\\end{table}`);
      return o.join('\n');
    }
  }
  float_to_longtable(title,label,style,ss){
    var style = {...style,title,label,float:'longtable'};
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    for(let itm of itms){
      if(itm.type=='bundle' && itm.key=='tabular'){
        var text = itm.img;
        return text;
      }
    }
    return '';
  }
  float_to_equation(title,label,style,ss){
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='bundle' && p.key=='displaymath'){
        let s = p.img;
        s = s.trim();
        s = s.slice(2,s.length-2);//remove the \[ and \]
        all.push(s);
      }
    });
    var text = all.join('\n');
    var o = [];
    o.push(`\\begin{equation}`);
    if(label){
      o.push(`\\label{${label}}`);
    }
    o.push(`${text}`);
    o.push(`\\end{equation}`)
    return o.join('\n')
  }
  float_to_listing(title,label,style,ss){
    var opts = [];
    var title = this.uncode(style,title).trim();
    var none = this.assert_int(style.nocaption);
    //if caption is empty the word "Listing" won't show
    if(title.length==0){
      title = '~';
    }
    if(!none){
      opts.push(`caption={${title}}`);
      if(label){
        opts.push(`label={${label}}`);
      }
    }
    opts.push(`basicstyle={\\ttfamily\\footnotesize}`)
    opts = opts.join(',');
    let o = [];
    o.push('');
    o.push(`\\begin{lstlisting}[${opts}]`);
    ss.forEach(x => o.push(x));
    o.push(`\\end{lstlisting}`);
    return o.join('\n');
  }
  float_to_tabbing(title,label,style,body){
    var cols = this.ss_to_clusters(body);
    var cols = cols.map((ss) => ss.map((s) => this.uncode(style,s)));
    var n = cols.length;
    var rows = this.cols_to_rows(cols);
    if(cols.length==1){
      var rows = this.col_one_to_rows(cols[0])
      n = rows[0].length;
    }
    var gap = parseFloat(style.gap)||0.02;
    var strut = parseFloat(style.strut)||0;
    var frs = this.string_to_frs_with_gap(style.fr||'',n,gap);
    var all = [];
    var tabsets = [];
    var sum = 0;
    frs.forEach((x,i,arr) => {
      sum = 0;
      sum += frs[i];
      sum += gap;
      tabsets.push(sum.toFixed(3));
    })
    all.push('');
    all.push(`\\begin{tabbing}`)
    tabsets = tabsets.map((x,i,arr) => {
      if(i+1==arr.length) return '\\kill'
      else return `\\hspace{${x}\\linewidth}`
    })
    all.push(tabsets.join('\\='));
    var s = '';
    rows.forEach((row,i,arr) => {
      if(style.head && i==0){
        row = row.map((x) => `\\textbf{${x}}`);
      }else {
        row = row.map((x) => `${x}`);
      }
      if(strut){
        row = row.map((x,i,arr) => `\\parbox[][${strut}pt][c]{${frs[i]}\\linewidth}{${x}}`)
      }else{
        row = row.map((x,i,arr) => `${x}`)
      }
      s = row.join('\\>');
      all.push(`${s}\\\\`);
    });
    if(s) {
      ///ensure the last item does not have a \\\\
      all.pop();
      all.push(s);
    }
    all.push('\\end{tabbing}')
    var text = all.join('\n')
    return text;
  }
  float_to_columns(title,label,style,ss){
    var clusters = this.ss_to_clusters(ss);
    var texts = clusters.map((ss) => this.untext(style,ss));
    var total = texts.length;
    var n = this.assert_int(style.n,2);
    var o = [];
    o.push('');
    for(let j=0; j < total; j+=n){
      o.push(`\\begin{multicols}{${n}}`);
      for(let i=0; i < n; ++i){
        let text = texts.shift();
        text = text||'~';
        text = `\\parbox[][][t]{\\linewidth}{\\raggedright{}${text}}`;
        if(i){
          o.push('\\columnbreak')
        }
        o.push(text);
      }
      o.push('\\end{multicols}');
    }
    return o.join('\n');
  }

  to_latexlabelcmd(label){
    var s = label?`\\label{${label}}`:'';
    return s;
  }

  do_ruby(items){
    let glue = String.fromCodePoint('0xAD');
    let o = [];
    for(let item of items){
      if(item[0] && item[1]){
        o.push(`${glue}\\ruby{${item[0]}}{${item[1]}}`);
      }else if(item[0]){
        o.push(`${item[0]}`);
      }
    }
    let text = o.join(glue);
    return text;
  }
  to_multi_xtabular_pcols(n,style){
    if (n > 0) {
      var frs = this.string_to_frs_with_gap(style.fr||'',n,0.02);
      frs = frs.map((x,i) => `p{${x.toFixed(3)}\\linewidth}`);
      return frs;
    }
    return [];
  }
  to_longtabu_pcols(n,style){
    var pcols = this.string_to_array(style.halign||'');
    var re = /^[lcr]$/;
    pcols = pcols.filter(x => re.test(x));
    while(pcols.length < n){
      pcols.push('l');
    }
    pcols = pcols.slice(0,n);
    if (n > 0) {
      var pp = this.string_to_array(style.fr);
      pp = pp.map(x => parseInt(x));
      pp = pp.filter(x => Number.isFinite(x));
      pp = pp.map(x => (x < 1) ? 1 : x);
      while (pp.length < n) pp.push(1);
      pp = pp.slice(0, n);
      pp = pp.map((x,i) => {
        if(pcols[i]=='r') {
          return `X[${x},r]`;
        }else if(pcols[i]=='c'){
          return `X[${x},c]`
        }else{ 
          return `X[${x},l]`
        }
      });
      return pp;
    }
    return [];
  }
  to_xltabular_pcols (frs, n) {
    /// given a ww that is a list of ".2 .3 .5" try to figure out
    /// the width of each p-column with an assumed gap between columns
    /// that is .01\linewidth
    ///
    /// \begin{tabularx}{\linewidth}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    frs = frs.map( x => x*n );
    frs = frs.map( x => x.toFixed(6) );
    frs = frs.map(x => `>{\\hsize=${x}\\hsize\\raggedright\\arraybackslash}X`);
    return frs;
  }
  to_tabularx_pcols(n,style) {
    /// \begin{tabularx}{\linewidth}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var pcols = this.string_to_array(style.halign||'');
    var re = /^[lcr]$/;
    pcols = pcols.filter(x => re.test(x));
    while(pcols.length < n){
      pcols.push('l');
    }
    pcols = pcols.slice(0,n);
    var frs = this.string_to_frs(style.fr,n);
    frs = frs.map((x,i) => {
      if(pcols[i]=='r'){
        return `>{\\hsize=${x}\\hsize\\raggedleft\\arraybackslash}X`;
      }else if(pcols[i]=='c'){
        return `>{\\hsize=${x}\\hsize\\centering\\arraybackslash}X`;
      }else{
        return `>{\\hsize=${x}\\hsize\\raggedright\\arraybackslash}X`;
      }
    });
    return frs;
  }
  to_tabularx_hsizes(n,style) {
    /// \begin{tabularx}{\linewidth}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var frs = this.string_to_frs(style.fr,n);
    frs = frs.map((x,i) => {
      return `${x}\\hsize`;
    });
    return frs;
  }
  fr_to_latex_pcols(n,fr,factor) {
    /// \begin{tabularx}{\linewidth}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var frs = this.string_to_frs(fr,n);
    frs = frs.map((x) => x/n);
    factor = parseFloat(factor);
    if(Number.isFinite(factor)){
      frs = frs.map((x) => x*factor);
    }
    frs = frs.map((x) => `p{${this.fix(x)}\\linewidth}`);
    return frs;
  }
  halign_to_latex_pcols(n,halign) {
    /// \begin{tabular}{lcr}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var pcols = this.string_to_array(halign||'');
    var re_lcr = /^[lcr]$/;
    var re_pw = /^p\d+$/;
    var re_fw = /^f\d+$/;
    pcols = pcols.map((x) => {
      if(re_lcr.test(x)){
        return x;
      }
      else if(re_pw.test(x)){
        var w = x.slice(1);
        return `p\{${w}mm\}`
      }
      else if(re_fw.test(x)){
        var w = x.slice(1);
        return `p\{${w/100}\\linewidth\}`
      }
      else {
        return 'l';
      }
    });
    while(pcols.length < n){
      pcols.push('l');
    }
    pcols = pcols.slice(0,n);
    return pcols;
  }
  pcols_to_latex_pcol(pcols,vrule){
    var n = pcols.length;
    var vbars =  this.vrule_to_vbars(n,vrule);
    var pp = [];
    for(var i=0; i < n; ++i){
      pp.push(vbars[i]);
      pp.push(pcols[i]);
    }
    pp.push(vbars[n]);
    var pcol = pp.join('');
    return pcol;
  }
  polish_verb(style,unsafe){
    let myhyp = `-${String.fromCodePoint('0x200B')}`
    unsafe = this.polish(style,unsafe);
    unsafe = unsafe.replace(/\s/g, "~")
    unsafe = unsafe.replace(/\-/g,myhyp);
    //unsafe = unsafe.replace(/\-/g,String.fromCodePoint('0x2011'));
    return unsafe;
  }
  ///
  ///This method does not convert entity symbols
  ///
  polish(style,line){
    line=''+line;
    const re_char   = /^(.)(.*)$/s;
    var safe='';
    var v;
    var s;
    while(line.length){
      if(line.codePointAt(0)>0xFFFF){
        s = line.slice(0,2);
        line = line.slice(2);
      }else{
        s = line.slice(0,1);
        line = line.slice(1);
      }
      let cc = s.codePointAt(0);
      if(this.tokenizer.symbol_cc_map.has(cc)){
        let {ptex,pmath,utex,umath,fonts} = this.tokenizer.symbol_cc_map.get(cc);
        if(this.program=='lualatex'||this.program=='xelatex'){
          s = this.tokenizer.get_utex_symbol(utex,umath,cc,fonts);
        }else{
          s = this.tokenizer.get_ptex_symbol(ptex,pmath,cc,fonts);
        }
      }
      safe+=s;
      continue;
    }
    ///add font switches to CJK characters including Japanese hiragana and katakana
    safe = this.fontify_cjk(safe);
    safe = this.rubify_cjk(safe,style.vmap);
    safe = this.softhyphen_cjk(safe);
    return safe;
  }
  ///
  ///NEW METHOD
  ///
  smooth (line) {
    line=''+line;
    const re_entity = /^&([A-Za-z][A-Za-z0-9]*|#[A-Za-z0-9]+);(.*)$/s;
    var safe='';
    var v;
    var s;
    while(line.length){
      if((v=re_entity.exec(line))!==null){
        s = v[1];
        line=v[2];    
        if(s.startsWith('#')){
          s = s.slice(1);
          s = "0"+s;
          s = parseInt(s);
          if(Number.isFinite(s)){
            s = String.fromCodePoint(s);
          }
          safe+=s;
        } else {
          if(this.tokenizer.symbol_name_map.has(s)){
            let {ptex,pmath,utex,umath,cc,fonts} = this.tokenizer.symbol_name_map.get(s);
            if(this.program=='lualatex'||this.program=='xelatex'){
              s = this.tokenizer.get_utex_symbol(utex,umath,cc,fonts);
            }else{
              s = this.tokenizer.get_ptex_symbol(ptex,pmath,cc,fonts);
            }        
          }
          safe+=s;
        }
        continue;
      }
      if(line.codePointAt(0)>0xFFFF){
        s = line.slice(0,2);
        line = line.slice(2);
      }else{
        s = line.slice(0,1);
        line = line.slice(1);
      }
      let cc = s.codePointAt(0);
      if(this.tokenizer.symbol_cc_map.has(cc)){
        let {ptex,pmath,utex,umath,fonts} = this.tokenizer.symbol_cc_map.get(cc);
        if(this.program=='lualatex'||this.program=='xelatex'){
          s = this.tokenizer.get_utex_symbol(utex,umath,cc,fonts);
        }else{
          s = this.tokenizer.get_ptex_symbol(ptex,pmath,cc,fonts);
        }
      }
      safe+=s;
      continue;
    }
    ///add font switches to a group of CJK characters including hiragana and katakana
    safe = this.fontify_cjk(safe);
    safe = this.softhyphen_cjk(safe);
    return safe;
  }
  to_mpcolor(color) {
    return `\\mpcolor{${color}}`;
  }
  mpfontsize(fontsize) {
    ///For now, just match the behavior of the context so that the font size
    ///for MP stays the same regardless.
    return '';
    const names = ["tiny",  "scriptsize",  "footnotesize", "small", "normalsize", "large", "Large", "LARGE", "huge", "Huge" ];
    const sizes = [6,  8,  10, 11, 12, 14, 17, 20, 25, 25];
    const len = 10;
    var sz = parseInt(fontsize);
    if (Number.isFinite(sz)) {
      if (sz < sizes[0]) {
        return `\\${names[0]}{}`;
      } else if (sz > sizes[9]) {
        return `\\${names[9]}{}`;
      } else {
        for(var i=1; i < len; ++i) {
          if (sz <= sizes[i]) {
            return `\\${names[i]}{}`;
          }
        }
      }
      return '\\normalsize{}';
    }
    else if(names.indexOf(this.fontsize) >= 0){
      return `\\${this.fontsize}{}`;
    }
    else {
      return '\\normalsize{}';
    }
  }

  

  svg_to_png_src(src){
    if(src.endsWith('.svg')){
      return src.slice(0,src.length-4) + '.png';
    }
    return src;
  }

  to_info(block) {
    var { fname, name, subn, hdgn, title, sig, row1, row2 } = block;
    fname = fname || '';
    name = name || '';
    subn = subn || '';
    sig = sig || '';
    row1 = row1 || '';
    row2 = row2 || '';
    hdgn = (typeof hdgn == 'number') ? hdgn : '';
    return (`%{sig:${sig}} {hdgn:${hdgn}} {fname:${fname}} {name:${name}:${subn}} {row:${row1}:${row2}}`);
  }
  row_to_tabular(pp,style){
    var d = [];
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    ///add colorcell
    var mypp = pp.map(x => {
      let {raw,text} = x;
      if(cellcolor_map.has(raw)){
        let my_color = cellcolor_map.get(raw);
        return `\\cellcolor{${my_color}}{}${text}`
      }else{
        return text;
      }
    })
    d.push(`${mypp.join(' & ')} \\tabularnewline`);
    ///taking care of the lower hrule
    if(pp.lower==2){
      d.push('\\hline');
      d.push('\\hline');
    }else if(pp.lower==1){
      d.push('\\hline');
    }
    return d.join('\n');
  }
  rows_to_tabular(rows,style,hsizes){
    var d = [];
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    rows.forEach((pp,j) => {
      if(pp.upper==2){
        d.push('\\hline')
        d.push('\\hline')
      }else if(pp.upper==1){
        d.push('\\hline')
      }
      ///add colorcell
      var mypp = pp.map(x => {
        let {raw,text} = x;
        if(cellcolor_map.has(raw)){
          let my_color = cellcolor_map.get(raw);
          return `\\cellcolor{${my_color}}{}${text}`
        }else{
          return text;
        }
      })
      d.push(`${mypp.join(' & ')} \\tabularnewline`);
      ///taking care of the last hline
      if(j+1==rows.length){
        if(pp.lower==2){
          d.push('\\hline');
          d.push('\\hline');
        }else if(pp.lower==1){
          d.push('\\hline');
        }
      }
    });
    return d.join('\n');
  }
  cols_to_multi(cols){
    let n = cols.length;
    var d = [];
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = `@{\\hspace{0.02\\linewidth}}`;
    var col = `p{${w}\\linewidth}`;
    var pcol = 'x'.repeat(n).split('').map(x => col).join(gap);
    d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
    cols.forEach((text, i) => {
      d.push(`\\begin{minipage}[c]{\\linewidth}`);
      d.push(text);
      d.push(`\\end{minipage}`);
      if (i == n - 1) {
        d.push('\\\\');
      } else {
        d.push('&');
      }
    });
    d.push(`\\end{tabular}`);
    return d.join('\n');
  }
  to_colors(color){
    return this.diagram.to_colors(color);
  }
  to_geometry_layout(latex_program){
    if (this.conf_to_string('latex.geometry')) {
      var s = this.conf_to_string('latex.geometry');
      var s = s.split('\n').join(',');
      return `\\usepackage[${s}]{geometry}`;
    }
    return '';
  }
  to_core_packages(latex_program){
    let all=[];
    let platform = os.platform();
    let p_unicode_math = '';
    /// 'pdflatex'
    if(latex_program=='pdflatex'){
      ///all.push(`\\usepackage{pinyin}`); this causes \(\pi\) to stop compiling
      all.push(`\\usepackage[T1]{fontenc}`);
      all.push(`\\usepackage[utf8]{inputenc}`);
      if(this.conf_to_string('latex.cjk')=='1'){
        all.push(`\\usepackage[overlap,CJK]{ruby}`);
        all.push(`\\renewcommand\\rubysep{0.05ex}`);
      }
    }
    /// 'xelatex' and 'latex.xecjk'
    else if(latex_program=='xelatex' && this.conf_to_string('latex.xecjk')){
      ///mainfont, sansfont, and monofont
      /// \setCJKmainfont{UnGungseo.ttf}
      /// \setCJKsansfont{UnGungseo.ttf}
      /// \setCJKmonofont{gulim.ttf}
      all.push(`\\usepackage[utf8]{inputenc}`);
      all.push(`\\usepackage{fontspec}`);
      all.push(`\\usepackage{xecjk}`);
      var p_mainfont = this.conf_to_string('latex.xecjk.mainfont');
      var p_sansfont = this.conf_to_string('latex.xecjk.sansfont');
      var p_monofont = this.conf_to_string('latex.xecjk.monofont');
      if (p_mainfont) { p_mainfont = `\\setCJKmainfont{${p_mainfont}}`; }
      if (p_sansfont) { p_sansfont = `\\setCJKsansfont{${p_sansfont}}`; }
      if (p_monofont) { p_monofont = `\\setCJKmonofont{${p_monofont}}`; }
      var p = [p_mainfont, p_sansfont, p_monofont];
      p = p.filter(x => x.length);
      all = all.concat(p);
      ///extra fonts
      var ss = this.conf_to_string('latex.xecjk.fonts');
      if (ss) {
        ss = ss.split('\n');
        ss = ss.map(s => {
          let [fn, fnt] = s.split(',');
          ///\newCJKfontfamily[kr]\kr{AppleGothic}
          return `\\newCJKfontfamily[${fn}]\\${fn}{${fnt}}`;
        });
        ss = ss.filter(x => x.length);
        all = all.concat(ss);
      }
    }
    /// 'xelatex' only
    else if(latex_program=='xelatex'){
      all.push(`\\usepackage[utf8]{inputenc}`);
      all.push(`\\usepackage{fontspec}`);
      if(platform=='win32'){
        var font_defs = ``;
      }else if(platform=='darwin'){
        if(this.conf_to_string('latex.cjk')=='1'){
          all.push(`\\newfontfamily{\\jp}[]{YuMincho}`);
          all.push(`\\newfontfamily{\\cn}[]{Songti SC}`);
          all.push(`\\newfontfamily{\\tw}[]{Songti TC}`);
          all.push(`\\newfontfamily{\\kr}[]{AppleGothic}`);
          // all.push(`\\newfontfamily{\\jp}[Scale=0.85]{YuMincho}`);
          // all.push(`\\newfontfamily{\\cn}[Scale=0.85]{Songti SC}`);
          // all.push(`\\newfontfamily{\\tw}[Scale=0.85]{Songti TC}`);
          // all.push(`\\newfontfamily{\\kr}[Scale=0.85]{AppleGothic}`);
          all.push(`\\XeTeXlinebreaklocale "zh"`);
          all.push(`\\XeTeXlinebreakskip = 0pt plus 1pt`);
          all.push(`\\usepackage{ruby}`)
          all.push(`\\renewcommand\\rubysep{0.05ex}`);
        }
      }else if(platform=='linux'){
        var font_defs = ``;
      }else{
        var font_defs = ``;
      }
    }
    /// 'lualatex' and 'lutexja'
    else if(latex_program=='lualatex'){
      if(this.conf_to_string('latex.cjk')=='1'){
        all.push(`\\usepackage{luatexja-fontspec}`);
        all.push(`\\usepackage{ruby}`)
        all.push(`\\renewcommand\\rubysep{-0.05em}`);
        all.push(`\\newjfontfamily{\\jp}[]{ipaexmincho}`);
        all.push(`\\newjfontfamily{\\cn}[]{arplsungtilgb}`);
        all.push(`\\newjfontfamily{\\tw}[]{arplmingti2lbig5}`);
        all.push(`\\newjfontfamily{\\kr}[]{baekmukbatang}`);
        // all.push(`\\newjfontfamily{\\jp}[Scale=0.85]{ipaexmincho}`);
        // all.push(`\\newjfontfamily{\\cn}[Scale=0.85]{arplsungtilgb}`);
        // all.push(`\\newjfontfamily{\\tw}[Scale=0.85]{arplmingti2lbig5}`);
        // all.push(`\\newjfontfamily{\\kr}[Scale=0.85]{baekmukbatang}`);
      }else{
        all.push(`\\usepackage{fontspec}`);
      }
    }
    /// all commmon required packages
    all.push(`\\usepackage{graphicx}`);
    all.push(`\\usepackage{caption}`);
    all.push(`\\usepackage{subfigure}`);
    all.push(`\\usepackage{mathtools}`);
    all.push(`\\usepackage{latexsym}`);
    all.push(`\\usepackage{amsfonts}`);
    all.push(`\\usepackage{amssymb}`);
    all.push(`\\usepackage{txfonts}`);
    all.push(`\\usepackage{pxfonts}`);
    all.push(`\\usepackage{textcomp}`);
    all.push(`\\usepackage{pifont}`);
    all.push(`\\usepackage{xfrac}`);
    all.push(`\\usepackage{bbold}`);
    all.push(`\\usepackage{commath}`);
    all.push(`\\DeclareMathOperator{\\sech}{sech}`);
    all.push(`\\DeclareMathOperator{\\csch}{csch}`);
    all.push(`\\DeclareMathOperator{\\arcsec}{arcsec}`);
    all.push(`\\DeclareMathOperator{\\arccot}{arccot}`);
    all.push(`\\DeclareMathOperator{\\arccsc}{arccsc}`);
    all.push(`\\DeclareMathOperator{\\arcosh}{arcosh}`);
    all.push(`\\DeclareMathOperator{\\arsinh}{arsinh}`);
    all.push(`\\DeclareMathOperator{\\artanh}{artanh}`);
    all.push(`\\DeclareMathOperator{\\arsech}{arsech}`);
    all.push(`\\DeclareMathOperator{\\arcsch}{arcsch}`);
    all.push(`\\DeclareMathOperator{\\arcoth}{arcoth}`);
    all.push(`\\DeclareMathOperator{\\median}{median}`);
    all.push(`\\DeclareMathSymbol{\\Alpha}{\\mathalpha}{operators}{"41}`);
    all.push(`\\DeclareMathSymbol{\\Beta}{\\mathalpha}{operators}{"42}`);
    all.push(`\\DeclareMathSymbol{\\Epsilon}{\\mathalpha}{operators}{"45}`);
    all.push(`\\DeclareMathSymbol{\\Zeta}{\\mathalpha}{operators}{"5A}`);
    all.push(`\\DeclareMathSymbol{\\Eta}{\\mathalpha}{operators}{"48}`);
    all.push(`\\DeclareMathSymbol{\\Iota}{\\mathalpha}{operators}{"49}`);
    all.push(`\\DeclareMathSymbol{\\Kappa}{\\mathalpha}{operators}{"4B}`);
    all.push(`\\DeclareMathSymbol{\\Mu}{\\mathalpha}{operators}{"4D}`);
    all.push(`\\DeclareMathSymbol{\\Nu}{\\mathalpha}{operators}{"4E}`);
    all.push(`\\DeclareMathSymbol{\\Omicron}{\\mathalpha}{operators}{"4F}`);
    all.push(`\\DeclareMathSymbol{\\Rho}{\\mathalpha}{operators}{"50}`);
    all.push(`\\DeclareMathSymbol{\\Tau}{\\mathalpha}{operators}{"54}`);
    all.push(`\\DeclareMathSymbol{\\Chi}{\\mathalpha}{operators}{"58}`);
    all.push(`\\DeclareMathSymbol{\\omicron}{\\mathord}{letters}{"6F}`);
    all.push(`\\usepackage{changepage}`);
    all.push(`\\usepackage{hang}`);
    all.push(`\\usepackage{listings}`);
    all.push(`\\usepackage{anyfontsize}`);
    all.push(`\\usepackage[normalem]{ulem}`);
    all.push(`\\usepackage{xcolor}`);
    all.push(`\\usepackage{colortbl}`);
    all.push(`\\usepackage{tikz}`);
    all.push(`\\usepackage[export]{adjustbox}`);
    all.push(`\\usepackage{url}`);
    all.push(`\\usepackage{wrapfig}`);
    all.push(`\\usepackage{tabularx}`)
    all.push(`\\usepackage{hhline}`);
    all.push(`\\usepackage{array}`);
    all.push(`\\usepackage{xtab}`);
    all.push(`\\usepackage{multicol}`);
    all.push(`\\newcolumntype{R}[1]{>{\\raggedleft\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newcolumntype{L}[1]{>{\\raggedright\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newcolumntype{C}[1]{>{\\centering\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newsavebox\\ltmcbox`);
    all.push(`\\newenvironment{fakelongtable} {\\setbox\\ltmcbox\\vbox\\bgroup \\csname`);
    all.push(`@twocolumnfalse\\endcsname \\csname col@number\\endcsname\\csname`);
    all.push(`@ne\\endcsname} {\\unskip\\unpenalty\\unpenalty\\egroup\\unvbox\\ltmcbox}`);
   
    /// unicode-math
    if(latex_program=='lualatex'||latex_program=='xelatex'){
      all.push('\\usepackage{unicode-math}');
    }
    return all.join('\n')
  }
  to_latex_extrapackage(latex_program){
    let s = this.conf_to_string('latex.extrapackage');
    if (s) {
      let ss = s.split('\n');
      return ss.join('\n');
    }
    return '';
  }
  to_latex_parskippackage(latex_program){
    let features = this.conf_to_string('latex.features');
    if(this.string_has_item(features,'parskip')){
      return `\\usepackage{parskip}`
    }
    return '';
  }
  to_latex_postsetup(latex_program){
    let s = this.conf_to_string('latex.postsetup');
    if(s){
      let ss = s.split('\n');
      return ss.join('\n');
    }
    return '';
  }
  is_fontname_defined(fn){
    ///fn is one of the strings that is specified by the array name 'fontnames'
    
  }
  is_cjk_cc(cc){
    var i = 0;
    var j = unicodeblocks.length-1;
    return this.binary_search_unijson(cc,i,j);
  }
  binary_search_unijson(num,i,j){
    if(i > j){
      return 0;
    }
    if(i==j){
      var m = i;
    }else{
      var m = Math.floor((i+j)/2);
    }
    var block = unicodeblocks[m];
    if(num >= block.start && num <= block.stop){
      return block.cjk;
    }
    if(i == j){
      return 0;
    }
    if(num < block.start){
      return this.binary_search_unijson(num,i,m-1);
    }else{
      return this.binary_search_unijson(num,m+1,j);
    }
  }
  glue_to_glue(glue){
    var glue = glue || '';
    if (glue) {
      glue = `\\noalign{\\vskip ${glue}}`
    }
    return glue;
  }  
  glue_to_vspace(glue){
    var glue = parseInt(glue) || 0;
    glue = `\\vspace{${glue}pt}`
    return glue;
  }
  glue_to_vspace_before(glue){
    var glue = parseInt(glue) || 0;
    glue += 2;//additional 2 pt before the line for latex
    glue = `\\vspace{${glue}pt}`
    return glue;
  }
  glue_to_vspace_after(glue){
    var glue = parseInt(glue) || 0;
    glue += 0;//additional 1 pt after the line for latex
    glue = `\\vspace{${glue}pt}`
    return glue;
  }
  lang_to_cjk(s,fn){ 
    if(this.program === 'pdflatex'){
      switch(fn) {
        case 'cn': {
          return `\\begin{CJK*}{UTF8}{gbsn}${s}\\end{CJK*}`
          break;
        }
        case 'tw': {
          return `\\begin{CJK*}{UTF8}{bsmi}${s}\\end{CJK*}`
          break;
        }
        case 'jp': {
          return `\\begin{CJK*}{UTF8}{min}${s}\\end{CJK*}`
          break;
        }
        case 'kr': {
          return `\\begin{CJK*}{UTF8}{mj}${s}\\end{CJK*}`
          break;
        }
      }
      return s;
    }
    if(this.program === 'xelatex' || this.program === 'lualatex'){
      return `{\\${fn}{}${s}}`
    }
    return s;
  }
  to_top_part(blocks) {
    var top = [];
    var o = [];
    top.push(o);
    for (let block of blocks) {
      let { sig, hdgn, name } = block;
      if (sig == 'FRNT'){
        continue;
      }
      if (sig == 'HDGS' && name == 'part') {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }
    }
    ///remove those arrays that are empty
    top = top.filter(o => {
      if( Array.isArray(o)) {
        return (o.length==0)?0:1;
      }
      return 1;
    })
    /// now process those chapters
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_top_chapter(o);
      }
      return o;
    })
    return top;
  }
  to_top_chapter(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn, name } = block;
      if (sig == 'FRNT'){
        continue;
      }
      if (sig == 'HDGS' && this.name_to_hdgn(name,hdgn) == 0) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }
    }
    ///remove those arrays that are empty
    top = top.filter(o => {
      if( Array.isArray(o)) {
        return (o.length==0)?0:1;
      }
      return 1;
    })
    /// now process those sections
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_top_section(o);
      }
      return o;
    })
    return top;
  }
  to_top_section(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn, name } = block;
      if (sig == 'FRNT'){
        continue;
      }
      if (sig == 'HDGS' && this.name_to_hdgn(name,hdgn) == 1) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }
    }
    ///remove those arrays that are empty
    top = top.filter(o => {
      if( Array.isArray(o)) {
        return (o.length==0)?0:1;
      }
      return 1;
    })
    /// now process those sections    
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_top_subsection(o);
      }
      return o;
    })
    return top;
  }
  to_top_subsection(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn, name } = block;
      if (sig == 'HDGS' && this.name_to_hdgn(name,hdgn) == 2) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    ///remove those arrays that are empty
    top = top.filter(o => {
      if( Array.isArray(o)) {
        return (o.length==0)?0:1;
      }
      return 1;
    })
    /// now process those sections
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_top_subsubsection(o);
      }
      return o;
    })
    return top;
  }
  to_top_subsubsection(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn, name } = block;
      if (sig == 'HDGS' && this.name_to_hdgn(name,hdgn) >= 3) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    return top;
  }
  to_report(top) {
    let all = [];
    top.forEach((o,i,arr) => {
      if (Array.isArray(o)) {
        let data = this.to_report_part(o);
        all.push(data);
      } else {
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_report_part(top) {
    let my = top.shift();
    if(my.sig=='HDGS' && my.name=='part'){
      ///great!
    }else{
      ///put it back
      top.unshift(my);
      my=null;
    }
    let all = [];
    all.push('');
    if(my){
      all.push(`\\part{${this.uncode(my.style,my.title)}}`);
    }
    top.forEach((o,i,arr) => {
      if (Array.isArray(o)) {
        var data = this.to_report_chapter(o);
        all.push(data);
      } else {
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_report_chapter(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`\\chapter{${this.uncode(my.style,my.title)}}${this.to_latexlabelcmd(my.style.label)}`);
    top.forEach((o,i,arr) => {
      if (Array.isArray(o)) {
        var data = this.to_report_section(o);
        all.push(data);
      } else {
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_report_section(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`\\section{${this.uncode(my.style,my.title)}}${this.to_latexlabelcmd(my.style.label)}`);
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        var data = this.to_report_subsection(o);
        all.push(data);
      } else {
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_report_subsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`\\subsection{${this.uncode(my.style,my.title)}}${this.to_latexlabelcmd(my.style.label)}`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        var data = this.to_report_subsubsection(o);
        all.push(data);
      }else{
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_report_subsubsection(top) {
    let my = top.shift();
    let all = [];
    all.push('');
    all.push(`\\subsubsection{${this.uncode(my.style,my.title)}}${this.to_latexlabelcmd(my.style.label)}`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  get_leftmargin(ptype){
    var key = `latex.${ptype}`;
    var val = this.conf_to_string(key);
    var ss = this.string_to_array(val);
    var ss = ss.filter((x) => x.startsWith('>'));
    if(ss.length){
      var s = ss[0];
      return s.substr(1);
    }
    return '';
  }
  ///
  ///
  ///
  to_list_text(pp){
    let d = [];
    var parsep = 0;
    if(pp.length){
      d.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{0pt}}`);
      pp.forEach((p) => {
        d.push(`\\item ${p}`)
      })
      d.push(`\\end{list}`);
    }
    return d.join('\n')
  }
  ///
  ///
  ///
  to_margined_text(pp){
    let d = [];
    var parsep = 0;
    if(pp.length){
      d.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{${parsep}pt}}`);
      pp.forEach((p) => {
        if(p.item && p.hfill && p.latex){
          d.push(`\\item[${p.item}]\\hfill\\break\n${p.latex}`)
        }else if(p.item && p.latex){
          d.push(`\\item[${p.item}]${p.latex}`)
        }else if(p.item){
          d.push(`\\item[${p.item}]`)
        }else if(p.latex){
          d.push(`\\item ${p.latex}`)
        }else{
          console.log('error, no p.item or p.latex');
        }
      })
      d.push(`\\end{list}`);
    }
    return d.join('\n')
  }
  ///
  ///
  ///
  to_fontsized_text(s,style){
    var fs = this.g_to_latex_fontsize_switch(style);
    var fontfamily = this.g_to_latex_fontfamily_switch(style);
    var fontstyle = this.g_to_latex_fontstyle_switch(style);
    if(fs){
      s = `${fs}{}${s}`
    }
    if(fontstyle){
      s = `${fontstyle}{}${s}`
    }
    if(fontfamily){
      s = `${fontfamily}{}${s}`
    }
    let d = [];
    d.push('\\bgroup');
    d.push(s.trim());
    d.push('\\egroup');
    s = d.join('\n');
    return s;
  }
  ///
  ///
  ///
  restore_uri(str){
    var v;
    const re_charcode = /^\{\\char(\d+)\}\s*(.*)$/
    const re_char = /^(\w+)\s*(.*)$/
    const re_S = /^(\S)\s*(.*)$/;
    str = str.trimLeft();
    var o = [];
    while(str.length){
      if((v=re_charcode.exec(str))!==null){
        let cc = v[1];
        str = v[2];
        let s = String.fromCodePoint(cc);
        o.push(s);
        continue;
      }
      if((v=re_char.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        continue;
      }
      if((v=re_S.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        continue;
      }
      o.push(str);
      break;
    }
    return o.join('');
  }
  ///
  ///
  ///
  restore_latex_math(str){
    var v;
    const re_charcode = /^\{\\char(\d+)\}(.*)$/
    const re_char = /^(\w+)(.*)$/
    const re_S = /^(.)(.*)$/;
    str = str.trimLeft();
    var o = [];
    while(str.length){
      if((v=re_charcode.exec(str))!==null){
        let cc = v[1];
        str = v[2];
        let s = String.fromCodePoint(cc);
        o.push(s);
        continue;
      }
      if((v=re_char.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        continue;
      }
      if((v=re_S.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        continue;
      }
      o.push(str);
      break;
    }
    return o.join('');
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_double(style,cnt){
    let s = this.polish_verb(style,cnt);
    return `{\\textquotedblleft{\\ttfamily{}${s}}\\textquotedblright}`;
  }
  literal_to_single(style,cnt){
    let s = this.polish_verb(style,cnt);
    return `{\\ttfamily{}${s}}`;
  }
  literal_to_escape(style,cnt){
    let s = this.polish_verb(style,cnt);
    s = `{\\ttfamily{}${s}}`;
    return s;
  }
  literal_to_math(style,cnt){
    return this.tokenizer.to_phrase_math(style,cnt);
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_verb(style,cnt,cnt2,cnt3){
    return `\\,{}\\texttt{${cnt}}\\,{}`;
  }
  phrase_to_code(style,cnt,cnt2,cnt3){
    return `\\texttt{${cnt}}`
  }
  phrase_to_em(style,cnt,cnt2,cnt3){
    return `\\emph{${cnt}}`
  }
  phrase_to_b(style,cnt,cnt2,cnt3){
    return `\\textbf{${cnt}}`
  }
  phrase_to_i(style,cnt,cnt2,cnt3){
    return `\\textit{${cnt}}`
  }
  phrase_to_u(style,cnt,cnt2,cnt3){
    return `\\underline{${cnt}}`
  }
  phrase_to_ss(style,cnt,cnt2,cnt3){
    return `\\textsf{${cnt}}`
  }
  phrase_to_tt(style,cnt,cnt2,cnt3){
    return `\\texttt{${cnt}}`
  }
  phrase_to_overstrike(style,cnt,cnt2,cnt3){
    return `\\sout{${cnt}}`
  }
  phrase_to_var(style,cnt,cnt2,cnt3){
    return `\\textsl{${cnt}}`
  }
  phrase_to_br(style,cnt,cnt2,cnt3){
    return `\\newline{}`
  }
  phrase_to_high(style,cnt,cnt2,cnt3){
    return `\\textsuperscript{${cnt}}`;
  }
  phrase_to_low(style,cnt,cnt2,cnt3){
    return `\\raisebox{-0.4ex}{\\scriptsize{}${cnt}}`;
  }
  phrase_to_quad(style,cnt,cnt2,cnt3){
    return `\\quad{}`;
  }
  phrase_to_qquad(style,cnt,cnt2,cnt3){
    return `\\qquad{}`;
  }
  phrase_to_ref(style,cnt,cnt2,cnt3){
    if(cnt){
      return `\\ref{${cnt}}`;
    }
    return "??";
  }
  phrase_to_link(style,cnt,cnt2,cnt3){
    cnt = this.restore_uri(cnt);
    return `\\url{${cnt}}`
  }
  ///following are picture phrases
  phrase_to_colorbutton(style,cnt,cnt2,cnt3){
    var ss = [];
    ss.push(`viewport 1 1 5`);
    ss.push(`fill {linesize:1,fillcolor:${cnt}} &rectangle{(0.1,0.1),0.8,0.8}`);
    ss.push(`stroke {linesize:1,fillcolor:${cnt}} &rectangle{(0,0),1,1}`);
    var { img } = this.diagram.to_diagram(style,ss);
    return img;
  }
  phrase_to_default(style,cnt,cnt2,cnt3){
    return `${cnt}`
  }
  phrase_to_utfchar(style,cnt,cnt2,cnt3){
    return `\\char"${cnt}{}`;
  }
  ///
  ///to_pdflatex_document
  ///
  to_pdflatex_document(documentclass,documentclassopt,postsetup,titlelines,body){
    ///start putting them together
    var all = [];
    all.push(`%!TeX program=PdfLatex`);
    all.push(`\\documentclass[${documentclassopt.join(',')}]{${documentclass}}`);
    all.push(`\\usepackage[utf8x]{inputenc}`);
    all.push(`\\usepackage[T1]{fontenc}`);
    all.push(`\\usepackage[overlap,CJK]{ruby}`);
    all.push(`\\renewcommand\\rubysep{0.0ex}`);
    all.push(`\\usepackage{graphicx}`);
    all.push(`\\usepackage{caption}`);
    all.push(`\\usepackage{subfigure}`);
    all.push(`\\usepackage{mathtools}`);
    all.push(`\\usepackage{latexsym}`);
    all.push(`\\usepackage{amsfonts}`);
    all.push(`\\usepackage{amssymb}`);
    all.push(`\\usepackage{txfonts}`);
    all.push(`\\usepackage{pxfonts}`);
    all.push(`\\usepackage{pifont}`);
    all.push(`\\usepackage{bbold}`);
    all.push(`\\usepackage{xfrac}`);
    all.push(`\\usepackage{textcomp}`);
    all.push(`\\usepackage{commath}`);
    all.push(`\\DeclareMathOperator{\\sech}{sech}`);
    all.push(`\\DeclareMathOperator{\\csch}{csch}`);
    all.push(`\\DeclareMathOperator{\\arcsec}{arcsec}`);
    all.push(`\\DeclareMathOperator{\\arccot}{arccot}`);
    all.push(`\\DeclareMathOperator{\\arccsc}{arccsc}`);
    all.push(`\\DeclareMathOperator{\\arcosh}{arcosh}`);
    all.push(`\\DeclareMathOperator{\\arsinh}{arsinh}`);
    all.push(`\\DeclareMathOperator{\\artanh}{artanh}`);
    all.push(`\\DeclareMathOperator{\\arsech}{arsech}`);
    all.push(`\\DeclareMathOperator{\\arcsch}{arcsch}`);
    all.push(`\\DeclareMathOperator{\\arcoth}{arcoth}`);
    all.push(`\\DeclareMathOperator{\\median}{median}`);
    all.push(`\\DeclareMathSymbol{\\Alpha}{\\mathalpha}{operators}{"41}`);
    all.push(`\\DeclareMathSymbol{\\Beta}{\\mathalpha}{operators}{"42}`);
    all.push(`\\DeclareMathSymbol{\\Epsilon}{\\mathalpha}{operators}{"45}`);
    all.push(`\\DeclareMathSymbol{\\Zeta}{\\mathalpha}{operators}{"5A}`);
    all.push(`\\DeclareMathSymbol{\\Eta}{\\mathalpha}{operators}{"48}`);
    all.push(`\\DeclareMathSymbol{\\Iota}{\\mathalpha}{operators}{"49}`);
    all.push(`\\DeclareMathSymbol{\\Kappa}{\\mathalpha}{operators}{"4B}`);
    all.push(`\\DeclareMathSymbol{\\Mu}{\\mathalpha}{operators}{"4D}`);
    all.push(`\\DeclareMathSymbol{\\Nu}{\\mathalpha}{operators}{"4E}`);
    all.push(`\\DeclareMathSymbol{\\Omicron}{\\mathalpha}{operators}{"4F}`);
    all.push(`\\DeclareMathSymbol{\\Rho}{\\mathalpha}{operators}{"50}`);
    all.push(`\\DeclareMathSymbol{\\Tau}{\\mathalpha}{operators}{"54}`);
    all.push(`\\DeclareMathSymbol{\\Chi}{\\mathalpha}{operators}{"58}`);
    all.push(`\\DeclareMathSymbol{\\omicron}{\\mathord}{letters}{"6F}`);
    all.push(`\\usepackage{changepage}`);
    all.push(`\\usepackage{hang}`);
    all.push(`\\usepackage{listings}`);
    all.push(`\\usepackage{anyfontsize}`);
    all.push(`\\usepackage[normalem]{ulem}`);
    all.push(`\\usepackage{xcolor}`);
    all.push(`\\usepackage{colortbl}`);
    all.push(`\\usepackage{tikz}`);
    all.push(`\\usepackage[export]{adjustbox}`);
    all.push(`\\usepackage{url}`);
    all.push(`\\usepackage{wrapfig}`);
    all.push(`\\usepackage{tabularx}`)
    all.push(`\\usepackage{hhline}`);
    all.push(`\\usepackage{array}`);
    all.push(`\\usepackage{xtab}`);
    all.push(`\\usepackage{multicol}`);
    all.push(`\\newcolumntype{R}[1]{>{\\raggedleft\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newcolumntype{L}[1]{>{\\raggedright\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newcolumntype{C}[1]{>{\\centering\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newsavebox\\ltmcbox`);
    all.push(`\\newenvironment{fakelongtable} {\\setbox\\ltmcbox\\vbox\\bgroup \\csname`);
    all.push(`@twocolumnfalse\\endcsname \\csname col@number\\endcsname\\csname`);
    all.push(`@ne\\endcsname} {\\unskip\\unpenalty\\unpenalty\\egroup\\unvbox\\ltmcbox}`);
    all.push(`\\newcommand{\\textzerosubscript}{\\raisebox{-0.4ex}{\\scriptsize 0}}`);
    all.push(`\\newcommand{\\textonesubscript}{\\raisebox{-0.4ex}{\\scriptsize 1}}`);
    all.push(`\\newcommand{\\texttwosubscript}{\\raisebox{-0.4ex}{\\scriptsize 2}}`);
    all.push(`\\newcommand{\\textthreesubscript}{\\raisebox{-0.4ex}{\\scriptsize 3}}`);
    all.push(`\\newcommand{\\textfoursubscript}{\\raisebox{-0.4ex}{\\scriptsize 4}}`);
    all.push(`\\newcommand{\\textfivesubscript}{\\raisebox{-0.4ex}{\\scriptsize 5}}`);
    all.push(`\\newcommand{\\textsixsubscript}{\\raisebox{-0.4ex}{\\scriptsize 6}}`);
    all.push(`\\newcommand{\\textsevensubscript}{\\raisebox{-0.4ex}{\\scriptsize 7}}`);
    all.push(`\\newcommand{\\texteightsubscript}{\\raisebox{-0.4ex}{\\scriptsize 8}}`);
    all.push(`\\newcommand{\\textninesubscript}{\\raisebox{-0.4ex}{\\scriptsize 9}}`);
    all.push(`\\newenvironment{packed_enum}{`);
    all.push(`  \\begin{enumerate}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{enumerate}}`);
    all.push(`\\newenvironment{packed_item}{`);
    all.push(`  \\begin{itemize}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{itemize}}`);
    all.push(`\\newenvironment{packed_desc}{`);
    all.push(`  \\begin{description}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{description}}`);
    all.push(`\\newenvironment{packed_hang}{`);
    all.push(`  \\begin{hanginglist}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{hanginglist}}`);
    all.push(`\\usepackage{parskip}`);
    postsetup.forEach((s) => {
      all.push(s);
    });
    all.push(`\\begin{document}`);
    titlelines.forEach((s) => {
      all.push(s);
    })
    if(titlelines.length){
      all.push(`\\maketitle`)
    }
    body.forEach((s) => {
      all.push(s);
    })
    all.push(`\\end{document}`);
    return all.join('\n')   
  }
  ///
  ///to_xelatex_document
  ///
  to_xelatex_document(documentclass,documentclassopt,postsetup,titlelines,body) {
    ///we need to do a translate of block by block first, this will
    /// also update following instance variables:
    ///   this.num_chapter, 
    ///   this.num_section,
    ///   this.num_subsection,
    ///   this.num_subsubsection
    /// these variables will be used to decide if we need 'article' or 'report'
    ///start putting them together
    var all = [];
    all.push(`%!TeX program=XeLatex`);
    all.push(`\\documentclass[${documentclassopt.join(',')}]{${documentclass}}`);
    all.push(`\\usepackage{fontspec,xltxtra,xunicode}`);
    all.push(`\\usepackage{ruby}`);
    ///following are core packages, with the addition of unicodemath
    all.push(`\\usepackage{graphicx}`);
    all.push(`\\usepackage{caption}`);
    all.push(`\\usepackage{subfigure}`);
    all.push(`\\usepackage{mathtools}`);
    all.push(`\\usepackage{latexsym}`);
    all.push(`\\usepackage{amsfonts}`);
    all.push(`\\usepackage{amssymb}`);
    all.push(`\\usepackage{txfonts}`);
    all.push(`\\usepackage{pxfonts}`);
    all.push(`\\usepackage{textcomp}`);
    all.push(`\\usepackage{pifont}`);
    all.push(`\\usepackage{xfrac}`);
    all.push(`\\usepackage{bbold}`);
    all.push(`\\usepackage{commath}`);
    all.push(`\\DeclareMathOperator{\\sech}{sech}`);
    all.push(`\\DeclareMathOperator{\\csch}{csch}`);
    all.push(`\\DeclareMathOperator{\\arcsec}{arcsec}`);
    all.push(`\\DeclareMathOperator{\\arccot}{arccot}`);
    all.push(`\\DeclareMathOperator{\\arccsc}{arccsc}`);
    all.push(`\\DeclareMathOperator{\\arcosh}{arcosh}`);
    all.push(`\\DeclareMathOperator{\\arsinh}{arsinh}`);
    all.push(`\\DeclareMathOperator{\\artanh}{artanh}`);
    all.push(`\\DeclareMathOperator{\\arsech}{arsech}`);
    all.push(`\\DeclareMathOperator{\\arcsch}{arcsch}`);
    all.push(`\\DeclareMathOperator{\\arcoth}{arcoth}`);
    all.push(`\\DeclareMathOperator{\\median}{median}`);
    all.push(`\\DeclareMathSymbol{\\Alpha}{\\mathalpha}{operators}{"41}`);
    all.push(`\\DeclareMathSymbol{\\Beta}{\\mathalpha}{operators}{"42}`);
    all.push(`\\DeclareMathSymbol{\\Epsilon}{\\mathalpha}{operators}{"45}`);
    all.push(`\\DeclareMathSymbol{\\Zeta}{\\mathalpha}{operators}{"5A}`);
    all.push(`\\DeclareMathSymbol{\\Eta}{\\mathalpha}{operators}{"48}`);
    all.push(`\\DeclareMathSymbol{\\Iota}{\\mathalpha}{operators}{"49}`);
    all.push(`\\DeclareMathSymbol{\\Kappa}{\\mathalpha}{operators}{"4B}`);
    all.push(`\\DeclareMathSymbol{\\Mu}{\\mathalpha}{operators}{"4D}`);
    all.push(`\\DeclareMathSymbol{\\Nu}{\\mathalpha}{operators}{"4E}`);
    all.push(`\\DeclareMathSymbol{\\Omicron}{\\mathalpha}{operators}{"4F}`);
    all.push(`\\DeclareMathSymbol{\\Rho}{\\mathalpha}{operators}{"50}`);
    all.push(`\\DeclareMathSymbol{\\Tau}{\\mathalpha}{operators}{"54}`);
    all.push(`\\DeclareMathSymbol{\\Chi}{\\mathalpha}{operators}{"58}`);
    all.push(`\\DeclareMathSymbol{\\omicron}{\\mathord}{letters}{"6F}`);
    all.push(`\\usepackage{changepage}`);
    all.push(`\\usepackage{hang}`);
    all.push(`\\usepackage{listings}`);
    all.push(`\\usepackage{anyfontsize}`);
    all.push(`\\usepackage[normalem]{ulem}`);
    all.push(`\\usepackage{xcolor}`);
    all.push(`\\usepackage{colortbl}`);
    all.push(`\\usepackage{tikz}`);
    all.push(`\\usepackage[export]{adjustbox}`);
    all.push(`\\usepackage{url}`);
    all.push(`\\usepackage{wrapfig}`);
    all.push(`\\usepackage{tabularx}`)
    all.push(`\\usepackage{hhline}`);
    all.push(`\\usepackage{array}`);
    all.push(`\\usepackage{xtab}`);
    all.push(`\\usepackage{multicol}`);
    all.push(`\\newcolumntype{R}[1]{>{\\raggedleft\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newcolumntype{L}[1]{>{\\raggedright\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newcolumntype{C}[1]{>{\\centering\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newsavebox\\ltmcbox`);
    all.push(`\\newenvironment{fakelongtable} {\\setbox\\ltmcbox\\vbox\\bgroup \\csname`);
    all.push(`@twocolumnfalse\\endcsname \\csname col@number\\endcsname\\csname`);
    all.push(`@ne\\endcsname} {\\unskip\\unpenalty\\unpenalty\\egroup\\unvbox\\ltmcbox}`);
    all.push(`\\newcommand{\\textzerosubscript}{\\raisebox{-0.4ex}{\\scriptsize 0}}`);
    all.push(`\\newcommand{\\textonesubscript}{\\raisebox{-0.4ex}{\\scriptsize 1}}`);
    all.push(`\\newcommand{\\texttwosubscript}{\\raisebox{-0.4ex}{\\scriptsize 2}}`);
    all.push(`\\newcommand{\\textthreesubscript}{\\raisebox{-0.4ex}{\\scriptsize 3}}`);
    all.push(`\\newcommand{\\textfoursubscript}{\\raisebox{-0.4ex}{\\scriptsize 4}}`);
    all.push(`\\newcommand{\\textfivesubscript}{\\raisebox{-0.4ex}{\\scriptsize 5}}`);
    all.push(`\\newcommand{\\textsixsubscript}{\\raisebox{-0.4ex}{\\scriptsize 6}}`);
    all.push(`\\newcommand{\\textsevensubscript}{\\raisebox{-0.4ex}{\\scriptsize 7}}`);
    all.push(`\\newcommand{\\texteightsubscript}{\\raisebox{-0.4ex}{\\scriptsize 8}}`);
    all.push(`\\newcommand{\\textninesubscript}{\\raisebox{-0.4ex}{\\scriptsize 9}}`);
    all.push(`\\newenvironment{packed_enum}{`);
    all.push(`  \\begin{enumerate}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{enumerate}}`);
    all.push(`\\newenvironment{packed_item}{`);
    all.push(`  \\begin{itemize}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{itemize}}`);
    all.push(`\\newenvironment{packed_desc}{`);
    all.push(`  \\begin{description}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{description}}`);
    all.push(`\\newenvironment{packed_hang}{`);
    all.push(`  \\begin{hanginglist}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{hanginglist}}`);
    all.push(`\\usepackage{parskip}`);
    ///following are user settings related to line break locale and 
    ///new font family names
    // var linebreaklocale = this.conf_to_string('xelatex.linebreaklocale');
    // if(linebreaklocale){
    //   all.push(`\\XeTeXlinebreaklocale "th_TH"`);
    // }
    ///FOLLOWING commands are for setting up default fonts
    ///     all.push(`\\defaultfontfeatures{Mapping=tex-text}`);
    ///     all.push(`\\setromanfont[Mapping=tex-text]{Hoefler Text}`);
    ///     all.push(`\\setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Gill Sans}`);
    ///     all.push(`\\setmonofont[Scale=MatchLowercase]{Andale Mono}`);
    ///FOLLOWING commands are for creating new font switch names:
    ///     \newfontfamily{\A}{Geeza Pro}
    ///     \newfontfamily{\H}[Scale=0.9]{Lucida Grande}
    ///     \newfontfamily{\J}[Scale=0.85]{Osaka}
    ///FONT SWITCHES can be used as follows:
    ///     Here are some multilingual Unicode fonts: this is Arabic text: {\A السلام عليكم}, 
    ///     this is Hebrew: {\H שלום}, and here's some Japanese: {\J 今日は}.
    let platform = os.platform();
    if(platform=='win32'){
    }else if(platform=='darwin'){
      //all.push(`\\newfontfamily{\\jp}[Scale=0.85]{Osaka}`);
      //all.push(`\\newfontfamily{\\cn}[Scale=0.85]{Yuanti SC}`);
      //all.push(`\\newfontfamily{\\tw}[Scale=0.85]{Yuanti TC}`);
      //all.push(`\\newfontfamily{\\kr}[Scale=0.85]{AppleGothic}`);
      all.push(`\\newfontfamily{\\jp}[]{Osaka}`);
      all.push(`\\newfontfamily{\\cn}[]{Yuanti SC}`);
      all.push(`\\newfontfamily{\\tw}[]{Yuanti TC}`);
      all.push(`\\newfontfamily{\\kr}[]{AppleGothic}`);
      all.push(`\\XeTeXlinebreaklocale "th_TH"`);
      all.push(`\\XeTeXlinebreakskip = 0pt plus 1pt`);
      all.push(`\\setromanfont[]{Palatino}`);
      all.push(`\\setsansfont[]{Verdana}`);
      all.push(`\\setmonofont[]{Andale Mono}`);
    }else if(platform=='linux'){
    }else{
    }
    var post = this.conf_to_list('xelatex.post');
    post.forEach((s) => {
      all.push(s);
    })
    postsetup.forEach((s) => {
      all.push(s);
    });
    all.push(`\\begin{document}`);
    titlelines.forEach((s) => {
      all.push(s);
    })
    if(titlelines.length){
      all.push(`\\maketitle`)
    }
    body.forEach((s) => {
      all.push(s);
    })
    all.push(`\\end{document}`);
    return all.join('\n')
  }
  ///
  ///to_xelatex_document
  ///
  to_lualatex_document(documentclass,documentclassopt,postsetup,titlelines,body) {
    ///we need to do a translate of block by block first, this will
    /// also update following instance variables:
    ///   this.num_chapter, 
    ///   this.num_section,
    ///   this.num_subsection,
    ///   this.num_subsubsection
    /// these variables will be used to decide if we need 'article' or 'report'
    ///start putting them together
    var all = [];
    all.push(`%!TeX program=LuaLatex`);
    all.push(`\\documentclass[${documentclassopt.join(',')}]{${documentclass}}`);
    all.push(`\\usepackage{fontspec}`);
    all.push(`\\usepackage{ruby}`)
    all.push(`\\renewcommand\\rubysep{0.0ex}`);
    ///following are core packages, with the addition of unicodemath
    all.push(`\\usepackage{graphicx}`);
    all.push(`\\usepackage{caption}`);
    all.push(`\\usepackage{subfigure}`);
    all.push(`\\usepackage{mathtools}`);
    all.push(`\\usepackage{latexsym}`);
    all.push(`\\usepackage{amsfonts}`);
    all.push(`\\usepackage{amssymb}`);
    all.push(`\\usepackage{txfonts}`);
    all.push(`\\usepackage{pxfonts}`);
    all.push(`\\usepackage{pifont}`);
    all.push(`\\usepackage{bbold}`);
    all.push(`\\usepackage{xfrac}`);
    all.push(`\\usepackage{commath}`);
    all.push(`\\DeclareMathOperator{\\sech}{sech}`);
    all.push(`\\DeclareMathOperator{\\csch}{csch}`);
    all.push(`\\DeclareMathOperator{\\arcsec}{arcsec}`);
    all.push(`\\DeclareMathOperator{\\arccot}{arccot}`);
    all.push(`\\DeclareMathOperator{\\arccsc}{arccsc}`);
    all.push(`\\DeclareMathOperator{\\arcosh}{arcosh}`);
    all.push(`\\DeclareMathOperator{\\arsinh}{arsinh}`);
    all.push(`\\DeclareMathOperator{\\artanh}{artanh}`);
    all.push(`\\DeclareMathOperator{\\arsech}{arsech}`);
    all.push(`\\DeclareMathOperator{\\arcsch}{arcsch}`);
    all.push(`\\DeclareMathOperator{\\arcoth}{arcoth}`);
    all.push(`\\DeclareMathOperator{\\median}{median}`);
    all.push(`\\DeclareMathSymbol{\\Alpha}{\\mathalpha}{operators}{"41}`);
    all.push(`\\DeclareMathSymbol{\\Beta}{\\mathalpha}{operators}{"42}`);
    all.push(`\\DeclareMathSymbol{\\Epsilon}{\\mathalpha}{operators}{"45}`);
    all.push(`\\DeclareMathSymbol{\\Zeta}{\\mathalpha}{operators}{"5A}`);
    all.push(`\\DeclareMathSymbol{\\Eta}{\\mathalpha}{operators}{"48}`);
    all.push(`\\DeclareMathSymbol{\\Iota}{\\mathalpha}{operators}{"49}`);
    all.push(`\\DeclareMathSymbol{\\Kappa}{\\mathalpha}{operators}{"4B}`);
    all.push(`\\DeclareMathSymbol{\\Mu}{\\mathalpha}{operators}{"4D}`);
    all.push(`\\DeclareMathSymbol{\\Nu}{\\mathalpha}{operators}{"4E}`);
    all.push(`\\DeclareMathSymbol{\\Omicron}{\\mathalpha}{operators}{"4F}`);
    all.push(`\\DeclareMathSymbol{\\Rho}{\\mathalpha}{operators}{"50}`);
    all.push(`\\DeclareMathSymbol{\\Tau}{\\mathalpha}{operators}{"54}`);
    all.push(`\\DeclareMathSymbol{\\Chi}{\\mathalpha}{operators}{"58}`);
    all.push(`\\DeclareMathSymbol{\\omicron}{\\mathord}{letters}{"6F}`);
    all.push(`\\usepackage{changepage}`);
    all.push(`\\usepackage{hang}`);
    all.push(`\\usepackage{listings}`);
    all.push(`\\usepackage{anyfontsize}`);
    all.push(`\\usepackage[normalem]{ulem}`);
    all.push(`\\usepackage{xcolor}`);
    all.push(`\\usepackage{colortbl}`);
    all.push(`\\usepackage{tikz}`);
    all.push(`\\usepackage[export]{adjustbox}`);
    all.push(`\\usepackage{url}`);
    all.push(`\\usepackage{wrapfig}`);
    all.push(`\\usepackage{tabularx}`)
    all.push(`\\usepackage{hhline}`);
    all.push(`\\usepackage{array}`);
    all.push(`\\usepackage{xtab}`);
    all.push(`\\usepackage{multicol}`);
    all.push(`\\newcolumntype{R}[1]{>{\\raggedleft\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newcolumntype{L}[1]{>{\\raggedright\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newcolumntype{C}[1]{>{\\centering\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}`);
    all.push(`\\newsavebox\\ltmcbox`);
    all.push(`\\newenvironment{fakelongtable} {\\setbox\\ltmcbox\\vbox\\bgroup \\csname`);
    all.push(`@twocolumnfalse\\endcsname \\csname col@number\\endcsname\\csname`);
    all.push(`@ne\\endcsname} {\\unskip\\unpenalty\\unpenalty\\egroup\\unvbox\\ltmcbox}`);
    all.push(`\\newcommand{\\textzerosubscript}{\\raisebox{-0.4ex}{\\scriptsize 0}}`);
    all.push(`\\newcommand{\\textonesubscript}{\\raisebox{-0.4ex}{\\scriptsize 1}}`);
    all.push(`\\newcommand{\\texttwosubscript}{\\raisebox{-0.4ex}{\\scriptsize 2}}`);
    all.push(`\\newcommand{\\textthreesubscript}{\\raisebox{-0.4ex}{\\scriptsize 3}}`);
    all.push(`\\newcommand{\\textfoursubscript}{\\raisebox{-0.4ex}{\\scriptsize 4}}`);
    all.push(`\\newcommand{\\textfivesubscript}{\\raisebox{-0.4ex}{\\scriptsize 5}}`);
    all.push(`\\newcommand{\\textsixsubscript}{\\raisebox{-0.4ex}{\\scriptsize 6}}`);
    all.push(`\\newcommand{\\textsevensubscript}{\\raisebox{-0.4ex}{\\scriptsize 7}}`);
    all.push(`\\newcommand{\\texteightsubscript}{\\raisebox{-0.4ex}{\\scriptsize 8}}`);
    all.push(`\\newcommand{\\textninesubscript}{\\raisebox{-0.4ex}{\\scriptsize 9}}`);
    all.push(`\\newenvironment{packed_enum}{`);
    all.push(`  \\begin{enumerate}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{enumerate}}`);
    all.push(`\\newenvironment{packed_item}{`);
    all.push(`  \\begin{itemize}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{itemize}}`);
    all.push(`\\newenvironment{packed_desc}{`);
    all.push(`  \\begin{description}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{description}}`);
    all.push(`\\newenvironment{packed_hang}{`);
    all.push(`  \\begin{hanginglist}`);
    all.push(`    \\setlength{\\itemsep}{1pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{hanginglist}}`);
    all.push(`\\usepackage{parskip}`);
    ///all.push(`\\usepackage{luatexja}`);///cannot use this, it causes all \\newfontfamily commands to stop working, and all dingbats fonts looks weired
    all.push(`\\newfontfamily{\\jp}[]{ipaexmincho}`);
    all.push(`\\newfontfamily{\\cn}[]{arplsungtilgb}`);
    all.push(`\\newfontfamily{\\tw}[]{arplmingti2lbig5}`);
    all.push(`\\newfontfamily{\\kr}[]{baekmukbatang}`);
    all.push(`\\newfontfamily{\\dingbats}[]{Zapf Dingbats}`);
    all.push(`\\newfontfamily{\\dejavu}[]{dejavuserif}`);
    all.push('\\usepackage{unicode-math}');
    ///following are user settings related to line break locale and 
    ///new font family names
    // var linebreaklocale = this.conf_to_string('xelatex.linebreaklocale');
    // if(linebreaklocale){
    //   all.push(`\\XeTeXlinebreaklocale "th_TH"`);
    // }
    ///FOLLOWING commands are for setting up default fonts
    ///     all.push(`\\defaultfontfeatures{Mapping=tex-text}`);
    ///     all.push(`\\setromanfont[Mapping=tex-text]{Hoefler Text}`);
    ///     all.push(`\\setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Gill Sans}`);
    ///     all.push(`\\setmonofont[Scale=MatchLowercase]{Andale Mono}`);
    ///FOLLOWING commands are for creating new font switch names:
    ///     \newfontfamily{\A}{Geeza Pro}
    ///     \newfontfamily{\H}[Scale=0.9]{Lucida Grande}
    ///     \newfontfamily{\J}[Scale=0.85]{Osaka}
    ///FONT SWITCHES can be used as follows:
    ///     Here are some multilingual Unicode fonts: this is Arabic text: {\A السلام عليكم}, 
    ///     this is Hebrew: {\H שלום}, and here's some Japanese: {\J 今日は}.
    ///FOLLOWING are post
    var post = this.conf_to_list('lualatex.post');
    post.forEach((s) => {
      all.push(s);
    })
    postsetup.forEach((s) => {
      all.push(s);
    });
    all.push(`\\begin{document}`);
    titlelines.forEach((s) => {
      all.push(s);
    })
    if(titlelines.length){
      all.push(`\\maketitle`)
    }
    body.forEach((s) => {
      all.push(s);
    })
    all.push(`\\end{document}`);
    return all.join('\n')
  }
  ///
  ///
  ///
  to_latex_document(documentclass,documentclassopt,postsetup,titlelines,body){
    if(this.program=='pdflatex'){
      return this.to_pdflatex_document(documentclass,documentclassopt,postsetup,titlelines,body)
    }else if(this.program=='xelatex'){
      return this.to_xelatex_document(documentclass,documentclassopt,postsetup,titlelines,body)
    }else if(this.program=='lualatex'){
      return this.to_lualatex_document(documentclass,documentclassopt,postsetup,titlelines,body)
    }
    return '';
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  untext(style,body){
    var all = [];
    var text = super.untext(style,body);
    all.push('');
    all.push(text);
    return all.join('\n')
  }
}
module.exports = { NitrilePreviewLatex }
