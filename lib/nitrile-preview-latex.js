'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewDiagramTikz } = require('./nitrile-preview-diagram-tikz');
const { NitrilePreviewLmath } = require('./nitrile-preview-lmath');
const w3color = require('./nitrile-preview-w3color');
const os = require('os');
const path = require('path');

class NitrilePreviewLatex extends NitrilePreviewTranslator {
  constructor(parser) {
    super(parser);
    this.name='latex';
    this.tokenizer = new NitrilePreviewLmath(this);
    this.diagram = new NitrilePreviewDiagramTikz(this);
    this.imgs = [];
    this.flags = {};
    this.enumerate_counter = 0;
    this.style = parser.style;
    this.parskip = 0;
    this.symbol_cc_map = this.tokenizer.symbol_cc_map;
    this.count_part = 0;
    this.count_chapter = 0;
    this.count_section = 0;
    this.count_subsection = 0;
    this.count_subsubsection = 0;      
    ///configuration params
    this.latex_caption_small = 1;
    this.latex_figure_align = 'c';
    this.latex_figure_nofloat = 0;
    this.program = this.assert_string(this.program,'pdflatex');
  }
  /////////////////////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////////////////////
  hdgs_to_part(title,style){
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
  hdgs_to_chapter(title,style){
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
    o.push(`\\Huge ${style.chapnum} ~ ${title}`);
    o.push(`\\end{flushleft}`);
    return o.join('\n')
  }
  hdgs_to_section(title,style){
    var title = this.uncode(style,title);
    if(style.chapnum){
      var leader = `${style.chapnum}.${style.level}`;
    }else{
      var leader = `${style.level}`;
    }
    var o = [];
    o.push('');
    if(style.hdgn==1){
      o.push(`\\section*{${leader} ${title}}${this.to_latexlabelcmd(style.label)}`);
    }else if(style.hdgn==2){
      o.push(`\\subsection*{${leader} ${title}}${this.to_latexlabelcmd(style.label)}`);
    }else{
      o.push(`\\subsubsection*{${leader} ${title}}${this.to_latexlabelcmd(style.label)}`);
    }
    return o.join('\n')
  }
  float_to_page(title,label,style,bundles){
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
  /////////////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////////////
  item_dl_to_text(style,i,item,nblank){
    var o = [];
    var value = this.uncode(style,item.value);
    if(Array.isArray(item.values)){
      value = item.values.map((s) => this.uncode(style,s)).join('\\\\')
    }
    value = `\\parbox{\\linewidth}{${value}}`;
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    if(text.length){
      o.push(`\\item[${value}]\\hfill\\break ${text}`)            
    }else{
      o.push(`\\item[${value}]\\hfill ${text}`)
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let text = this.join_para(p.lines);
          o.push(`${this.uncode(style,text)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_hl_to_text(style,i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    var value = this.to_hl_bullet_text(item.bullet);
    o.push(`\\item ${value}~~${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let text = this.join_para(p.lines);
          o.push(`${this.uncode(style,text)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ol_to_text(style,i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    if(item.type == 'A'){
      o.push(`\\item[${this.int_to_letter_A(item.value)}${item.ending}] ${text}`)
    }else if(item.type == 'a'){
      o.push(`\\item[${this.int_to_letter_a(item.value)}${item.ending}] ${text}`)
    }else if(item.type == 'I'){
      o.push(`\\item[${this.int_to_letter_I(item.value)}${item.ending}] ${text}`)
    }else if(item.type == 'i'){
      o.push(`\\item[${this.int_to_letter_i(item.value)}${item.ending}] ${text}`)
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
          let text = this.join_para(p.lines);
          o.push(`${this.uncode(style,text)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ul_to_text(style,i,item,nblank){
    var o = [];
    var key = item.key;
    var keytype = item.keytype;
    var sep = ' ~ ';
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    if(key){
      if(keytype=='var'){
        o.push(`\\item  \\textbf{${this.literal_to_var(style,key)}}${sep}${text}`);
      }else if(keytype=='verb'){
        o.push(`\\item  \\textbf{${this.literal_to_verb(style,key)}}${sep}${text}`);
      }else if(keytype=='quotation'){
        o.push(`\\item  \\textbf{${this.literal_to_quotation(style,key)}}${sep}${text}`);
      }else{
        o.push(`\\item  \\textbf{${this.polish(style,key)}}${sep}${text}`);
      }
    }else{
      o.push(`\\item ${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let text = this.join_para(p.lines);
          o.push(`${this.uncode(style,text)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    return o.join('\n\n')
  }
  itemize_to_text(style,itemize){
    var bull = itemize.bull;
    var items = itemize.items;
    var nblank = itemize.nblank;
    var o = [];
    switch (bull) {
      case 'DL': {
        if(!nblank){
          o.push(`\\begin{packed_description}`)  
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
            let text = this.item_dl_to_text(style,j,item,nblank);
            o.pop();
            o.push(text);
          }else{
            last_o = [];
            last_o.push(item);
            let text = this.item_dl_to_text(style,j,item,nblank);
            o.push(text);
          }
        });
        if(!nblank){
          o.push(`\\end{packed_description}`)  
        }else{
          o.push(`\\end{description}`)
        }
        break;
      }
      case 'HL': {
        if(!nblank){
          o.push(`\\begin{packed_hanginglist}`);
        }else{
          o.push(`\\begin{hanginglist}`);
        }
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(style,j,item,nblank);
          o.push(text);
        });
        if(!nblank){
          o.push(`\\end{packed_hanginglist}`)
        }else{
          o.push(`\\end{hanginglist}`)
        }
        break;
      }
      case 'OL': {
        if(!nblank){
          o.push(`\\begin{packed_enumerate}`)
        }else{
          o.push(`\\begin{enumerate}`);
        }
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(style,j,item,nblank);
          o.push(text);
        });
        if(!nblank){
          o.push('\\end{packed_enumerate}')
        }else{
          o.push('\\end{enumerate}')
        }
        break;
      }
      case 'UL': {
        if(!nblank){
          o.push(`\\begin{packed_itemize}`);  
        }else{
          o.push(`\\begin{itemize}`);
        }
        items.forEach((item,j) => {
          let text = this.item_ul_to_text(style,j,item,nblank);
          o.push(text);
        });
        if(!nblank){
          o.push('\\end{packed_itemize}')
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
  fence_to_fml(style,ss,ssi) {
    var str = ss.join('\n')
    var used = new Set();
    var text = this.tokenizer.to_align_math(str,style,used,1);
    var img = `\\begin{tabular}{@{}l@{}}\n\\(${text}\\)\\tabularnewline\n\\end{tabular}`;
    var subtitle = style.subtitle||'';
    var o = [];
    o.push({img,subtitle,text,style});
    return o;
  }
  fence_to_ink(style,ss,ssi) {
    var all = [];
    var npara = ss.length;
    // var vgap = 1;
    var [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    // var max_inkheight = npara*10*this.PT_TO_MM;//fs font
    // var inkheight = Math.max(inkheight,max_inkheight);
    var s_width = this.g_to_width_float(style);
    var s_height = this.g_to_height_float(style);
    if(s_width && s_height){
      var width = s_width;
      var height = s_height;
    }else if(s_width){
      var width = s_width;
      var height = (viewport_height/viewport_width)*(s_width);
    }else if(s_height){
      var height = s_height;
      var width = (viewport_width/viewport_height)*(s_height);
    }else{
      var width = inkwidth;
      var height = inkheight;
    }
    var extra_dy = 2.6;//in pt
    all.push(`\\setlength{\\unitlength}{1mm}`);
    all.push(`\\begin{picture}(${inkwidth},${inkheight})`);
    ss.forEach((s,j) => {
      if(s=='\\\\'){
        s = "{\\P}"
      }else{
        s = this.polish_verb(style,s);
      }
      all.push(`\\put(0,${inkheight-((j+1)*10+extra_dy)*this.PT_TO_MM}){\\ttfamily\\fontsize{10pt}{10pt}\\selectfont{}${s}}`);
    });
    all.push(`\\end{picture}`);
    var text = all.join('\n');
    text = `\\clipbox*{0mm 0mm ${inkwidth}mm ${inkheight}mm}{${text}}`;//the 'trimclip' package
    text = `\\resizebox{${width}mm}{${height}mm}{${text}}`;
    if(style.frame){
      var img = `\\begin{tabular}{|@{}l@{}|}\\hline\n${text}\\tabularnewline\\hline\\end{tabular}`;
    }else{
      var img = `\\begin{tabular}{@{}l@{}}${text}\\tabularnewline\\end{tabular}`
    }
    var subtitle = style.subtitle||'';
    var o = [];
    o.push({img,subtitle,width,height,style});
    return o;
  }
  fence_to_img(style,ss,ssi){
    var itms = this.ss_to_img_bundle_itms(style,ss,ssi);
    var p = {};
    p.subtitle = style.subtitle||'';
    p.style = style;
    if(itms.subtitle){
      p.subtitle = itms.subtitle.join(' ');
    }
    var [viewport_width,viewport_height,viewport_unit] = this.g_to_viewport_array(style);
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    p.vw = inkwidth*this.MM_TO_PX;
    p.vh = inkheight*this.MM_TO_PX;
    p.width = p.vw;
    p.height = p.vh;
    if(style.width){
      let width = parseInt(style.width);
      if(width){
        p.width = width*this.MM_TO_PX;
        p.height = viewport_height/viewport_width*p.width;
      }
    }
    p.width = Math.round(p.width);//have to turn it into integers otherwise the canvas might not draw the image exact
    p.height = Math.round(p.height);//same    
    var imgsrc = this.choose_image_file(itms.image);
    p.text = `\\includegraphics[width=${Math.round(p.width/this.MM_TO_PX)}mm,height=${Math.round(p.height/this.MM_TO_PX)}mm]{${imgsrc}}`;
    if(style.frame){
      p.img = `\\begin{tabular}{|@{}l@{}|}\\hline\n${p.text}\\tabularnewline\\hline\\end{tabular}`;
    }else{
      p.img = `\\begin{tabular}{@{}l@{}}${p.text}\\tabularnewline\\end{tabular}`
    }
    var o = [];
    o.push(p);
    return o;
  }
  fence_to_dia(style,ss,ssi) {
    var o = this.diagram.to_diagram(style,ss);
    o.forEach((p) => {
      p.style = style;
      let text = p.img;
      if(style.frame){
        var img = `\\begin{tabular}{|@{}l@{}|}\\hline\n${text}\\tabularnewline\\hline\\end{tabular}`;
      }else{
        var img = `\\begin{tabular}{@{}l@{}}${text}\\tabularnewline\\end{tabular}`
      }
      p.img = img;
    });
    return o;
  }
  fence_to_tab(style,ss,ssi) {
    ///'figure','table', or plaintext
    var {rows} = this.ss_to_tabular_rows(style,ss,ssi);
    var ff = this.g_to_fontstyle_array(style);
    rows.forEach((pp,j) => {
      pp.forEach((p,i) => {
        p.text = this.uncode(style,p.raw);
        if(style.head && j==0){
          p.text = `{\\bfseries ${p.text}}`
        }else{
          p.text = this.to_fontstyled_text(p.text,ff[i]);
        }
      })
    })
    //
    //put it together
    //
    var n = (rows.length) ?  rows[0].length : 1;
    var hew = parseInt(style.hew)||1;
    var hrules = this.string_to_int_array(style.hrules);
    var vrules = this.string_to_int_array(style.vrules);
    var pcols = this.halign_to_latex_pcols(n,style.textalign);
    var pcol = this.pcols_to_latex_pcol(pcols,style.rules,style.side,vrules);
    var all = [];
    all.push(`\\begingroup`)
    all.push(`\\renewcommand{\\arraystretch}{1.33}`);
    if(style.fontsize=='small'){
      all.push(`\\small`);
    }
    if(hew>1){
      let s0 = pcol;
      for(let i=1; i < hew; ++i){
        pcol += '||';
        pcol += s0;
      }
    }
    if(style.frame){
      all.push(`\\begin{tabular}{|${pcol}|}`);
      all.push('\\hline')
    }else{
      all.push(`\\begin{tabular}{${pcol}}`);
    }
    if(style.head && rows.length){
      //HEAD
      let row = rows.shift();
      let dd = row.map((p,i) => {
        return p.text;
      });
      if(style.rules=='groups' && style.side){
        dd = dd.map((d,i,arr) => {
          if(i==1){
            return `${d} &`
          }else{
            return `${d} &`
          }
        })
      }else if(style.rules=='cols' || style.rules=='all'){
        dd = dd.map((d,i,arr) => {
          if(i==0){
            return `${d} &`
          }else{
            return `${d} &`
          }
        })
      }else{
        dd = dd.map((d,i,arr) => {
          if(i==0){
            return `${d} &`
          }else{
            return `${d} &`
          }
        })
      }
      let s = dd.join('\n')
      if(hew>1){
        let s0 = s;
        for(let i=1; i < hew; ++i){
          if(style.rules=='groups'||style.rules=='cols'||style.rules=='all'){
            s += '\n'; // no-need for an extra '&' because table-gap is done by two ||
          }else{
            s += '\n';
          }
          if(style.rules=='groups'||style.rules=='cols'||style.rules=='all'){
            s += s0;
          }else{
            s += s0;
          }
        }
      }
      s = s.slice(0,-1) + '\\\\';
      all.push(s);
      //HEAD rule
      if(style.rules=='groups'||style.rules=='rows'||style.rules=='all'){
        all.push('\\hline')
      }
    }
    if(1){
      //BODY
      let ss = rows.map((row,j,arr) => {
        let dd = row.map((p,i) => {
          return p.text;
        });
        if(style.rules=='groups' && style.side){
          dd = dd.map((d,i,arr) => {
            if(i==1){
              return `${d} &`
            }else{
              return `${d} &`
            }
          })
        }else if(style.rules=='cols' || style.rules=='all'){
          dd = dd.map((d,i,arr) => {
            if(i==0){
              return `${d} &`
            }else{
              return `${d} &`
            }
          })
        }else{
          dd = dd.map((d,i,arr) => {
            if(i==0){
              return `${d} &`
            }else{
              return `${d} &`
            }
          })
        }
        let s = dd.join('\n');
        return s;
      });
      let m = 0;
      let m0 = ss.length;
      if(hew>1){
        m = Math.floor(ss.length/hew);//number of rows for all columns
        m0 = ss.length - m*(hew-1);///number of rows for the first column
      }
      let i = 0;
      let k = m0;
      let ss1 = ss.slice(i,k);
      i+=m0, k+=m;
      let multicolumn_dd_s = `\\multicolumn{${n}}{c||}{} `;
      let multicolumn_d_s = `\\multicolumn{${n}}{c|}{} `;
      let multicolumn_s = `\\multicolumn{${n}}{c}{} `;
      while(i < ss.length){
        let ss2 = ss.slice(i,k);
        ss1 = ss1.map((s,j,arr) => {
          if(style.rules=='groups'||style.rules=='cols'||style.rules=='all'){
            s += '\n'; //no-need for '&'; table-gap is done by '||'
          }else{
            s += '\n';
          }
          let s2 = ss2[j]||'';
          if(!s2){
            if(style.frame){
              s2 = `${multicolumn_dd_s}&`;
            }else{
              s2 = `${multicolumn_s}&`;
            }
          }
          s += s2;
          return s;
        });
        i+=m, k+=m;
      }
      if(style.frame){
        ///replace the multicolumn as well
        ss1 = ss1.map(s => {
          s = s.slice(0,-1);//remove '&'
          if(s.endsWith(multicolumn_dd_s)){
            let n = multicolumn_dd_s.length;
            s = s.slice(0,-n);
            s += multicolumn_d_s;
            s += '\\\\';
          }else{
            s += '\\\\';
          }
          return s;
        })
      }else{
        ss1 = ss1.map(s => s.slice(0,-1) + '\\\\');
      }
      ///inserting hrules
      if(style.rules=='all'||style.rules=='rows'){
        let s = ss1.join('\n\\hline\n');
        all.push(s);
      }else if(style.rules){
        let s = ss1.join('\n');
        all.push(s);
      }else{
        ///artificial hrules
        console.log('hrules',hrules)
        ss1 = ss1.map((s,j,arrj) => {
          if(j>0 && hrules.indexOf(j)>=0){
            s = '\\hline\n'+s;
          }
          return s;
        })
        let s = ss1.join('\n');
        all.push(s);
      }
    }    
    if(style.frame){
      all.push('\\hline')
    }
    all.push('\\end{tabular}')
    all.push(`\\endgroup`)
    var img = all.join('\n');
    var subtitle = style.subtitle||'';
    var w = '';
    var o = [];
    o.push({img,subtitle,width:w,tbl:1,style});
    return o;
  }
  fence_to_par(style,ss,ssi){
    var ss = this.ss_to_backslashed_ss(style,ss);
    var ss = ss.map(s => this.to_fontstyled_text(s,style.fontstyle));
    let a = 'p{\\linewidth}';
    if(style.width){
      a = `p{${style.width}mm}`;
    }
    var n = ss.length;
    var text = ss.join('\\\\\n');
    var text = `\\multirow{${n}}{=}{${text}}`;
    if(style.frame){
      var img = `\\begin{tabular}{@{}|${a}|@{}}\\hline\n${text}\\hline\n\\end{tabular}`;
    }else{
      var img = `\\begin{tabular}{@{}${a}@{}}\n${text}\n\\end{tabular}`
    }
    if(style.fontsize=='small'){
      var img = `\\begingroup\\small${img}\\endgroup`;
    }
    var subtitle = style.subtitle||'';
    var o = [];
    o.push({img,subtitle,style});
    return o;
  }
  fence_to_vtm(style,ss,ssi){
    ss = ss.map((s) => {
      s = this.polish_verb(style,s);
      if (!s) {
        s = "~";
      }
      s = `{\\ttfamily{}${s}}`;
      return s;
    });
    var all = [];
    all.push('\\begingroup');
    if(1){
      all.push('\\small');
    }
    if(style.frame){
      all.push(`\\begin{tabular}{@{}|l|@{}}`);
      all.push(`\\hline`)
      ss.forEach((x) => all.push(`${x}\\tabularnewline`));
      all.push(`\\hline`)
      all.push('\\end{tabular}');
    }else{
      all.push(`\\begin{tabular}{@{}l@{}}`);
      ss.forEach((x) => all.push(`${x}\\tabularnewline`));
      all.push('\\end{tabular}');
    }
    all.push('\\endgroup');
    var img = all.join('\n');
    var subtitle = style.subtitle||'';
    var o = [];
    o.push({img,subtitle,tbl:1,style});
    return o;
  }
  ///////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////
  float_to_figure(title,label,style,bundles){
    var fignum = style.fignum;
    if(style.chapnum){
      fignum = style.chapnum+"."+fignum;
    }
    var itms = this.bundles_to_figure_itms(style,bundles);
    var title = this.uncode(style,title).trim();
    var caption_align = '\\centering'
    var caption_environ = 'center'    
    if(this.latex_figure_align=='l'){
      var caption_align = '\\raggedright';
      var caption_environ = 'flushleft'    
    }else if(this.latex_figure_align=='r'){
      var caption_align = '\\raggedleft';
      var caption_environ = 'flushright'    
    }
    let caption_fontsize = '';
    if(this.latex_caption_small){
      caption_fontsize = '\\small'
    }  
    var all = [];
    all.push('');
    if(!style.partition){
      let o = [];
      itms.forEach((p) => {
        if(p.type=='bundle'){
          let subtitle = p.subtitle;
          if(subtitle){
            o.push(`\\begin{threeparttable} ${p.img} \\begin{tablenotes}[flushleft] \\item ${caption_align} ${caption_fontsize} ${this.uncode(style,subtitle)} \\end{tablenotes} \\end{threeparttable}`);
          }else{
            o.push(`\\begin{threeparttable} ${p.img}                                                                                                                             \\end{threeparttable}`);
          }
        }else if(p.type=='\\\\'){
          o.push('\\\\');
        }
      })
      var text = o.join('\n')
    }
    else{
      let onerow = [];
      let o = [];
      //o.push(`\\setlength\\multicolsep{0pt}`);
      itms.forEach((p) => {
        if(p.type=='bundle'){
          let subtitle = p.subtitle;
          if(subtitle){
            onerow.push(`\\begin{threeparttable} ${p.img} \\begin{tablenotes}[flushleft] \\item ${caption_align} ${caption_fontsize} ${this.uncode(style,subtitle)} \\end{tablenotes} \\end{threeparttable}`);
          }else{
            onerow.push(`\\begin{threeparttable} ${p.img}                                                                                                                             \\end{threeparttable}`);
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
    if(style.wrapfig=='right'){
      text = text.trim();
      return `\\begin{wrapfigure}{r}{0pt}\n${text}\n\\end{wrapfigure}`;
    }else if(style.wrapfig=='left'){
      text = text.trim();
      return `\\begin{wrapfigure}{l}{0pt}\n${text}\n\\end{wrapfigure}`;
    }else if(this.latex_figure_nofloat){
      let o = [];
      o.push(``);
      o.push(`\\begin{${caption_environ}}`);
      o.push(`${caption_align}`);    
      o.push(`{${caption_fontsize} {Figure ${fignum}} : ${title}}\\vspace{0.5ex}\\break`);
      if(label){
        o.push(`\\label{${label}}`);
      }
      o.push(text);
      o.push(`\\end{${caption_environ}}`);
      return o.join('\n');
    }else{
      let o = [];
      o.push(``);
      o.push(`\\begin{figure}[ht]`);
      o.push(`${caption_align}`);    
      o.push(`{${caption_fontsize} {Figure ${fignum}} : ${title}}\\vspace{0.5ex}\\break`);
      if(label){
        o.push(`\\label{${label}}`);
      }
      o.push(text);
      o.push(`\\end{figure}`);
      return o.join('\n');
    }
  }
  float_to_table(title,label,style,bundles){
    var tabnum = style.tabnum;
    if(style.chapnum){
      tabnum = style.chapnum+"."+tabnum;
    }
    var text = '';
    var splitid = '';
    if(bundles.length){
      let o = this.do_bundle(style,bundles[0],'tab');
      text = o[0].img;
      splitid = bundles[0].splitid||'';
    }
    if(splitid){
      splitid = `(${splitid})`;
    }
    var title = this.uncode(style,title).trim();
    var caption_align = '\\centering'
    var caption_environ = 'center'    
    if(this.latex_figure_align=='l'){
      var caption_align = '\\raggedright';
      var caption_environ = 'flushleft'    
    }else if(this.latex_figure_align=='r'){
      var caption_align = '\\raggedleft';
      var caption_environ = 'flushright'    
    }
    let caption_fontsize = '';
    if(this.latex_caption_small){
      caption_fontsize = '\\small'
    }  
    if(this.latex_figure_nofloat){
      let o = [];
      o.push(``);
      o.push(`\\begin{${caption_environ}}`);
      o.push(`${caption_align}`);    
      o.push(`{${caption_fontsize} {Table ${tabnum}${splitid}} : ${title}}\\vspace{0.5ex}\\break`);
      if(label){
        o.push(`\\label{${label}}`);
      }
      o.push(text);
      o.push(`\\end{${caption_environ}}`);
      return o.join('\n');
    }else{
      let o = [];
      o.push(``);
      o.push(`\\begin{table}[ht]`);
      o.push(`${caption_align}`);    
      o.push(`{${caption_fontsize} {Table ${tabnum}} : ${title}}\\vspace{0.5ex}\\break`);
      if(label){
        o.push(`\\label{${label}}`);
      }
      o.push(text);
      o.push(`\\end{table}`);
      return o.join('\n');
    }
  }
  float_to_equation(title,label,style,bundles){
    var eqnnum = style.eqnnum;
    if(style.chapnum){
      eqnnum = style.chapnum+"."+eqnnum;
    }
    bundles = bundles.filter(bundle => bundle.type=='bundle');
    var all = [];
    all.push(``);
    bundles.forEach((bundle,i,arr) => {
      all.push(`\\[`);
      let o = this.do_bundle(style,bundle,'fml');
      if(o.length){
        let p = o[0];
        var sub = '';
        if(arr.length>1){
          sub = this.int_to_letter_a(1+i);
        }
        all.push(`${p.text}`);
        all.push(`\\tag{${eqnnum}${sub}}`);
        if(label && i==0){
          all.push(`\\label{${label}}`);
        }
        all.push(`\\]`);
      }
    });
    return all.join('\n')
  }
  float_to_listing(title,label,style,bundles){
    var lstnum = style.lstnum;
    if(style.chapnum){
      lstnum = style.chapnum+"."+lstnum;
    }
    var splitid = '';
    var splitstart = 0;
    var ss = [];
    if(bundles.length){
      ss = bundles[0].ss;
      splitid = bundles[0].splitid||'';
      splitstart = bundles[0].splitstart||0;
    }
    if(splitid){
      splitid = `(${splitid})`;
    }
    var ss = this.trim_samp_body(ss);
    var opts = [];
    var s_ad = String.fromCodePoint(0xAD);
    var title = this.uncode(style,title).trim();
    //if caption is empty the word "Listing" won't show
    if(title.length==0){
      title = '~';
    }
    if(this.latex_caption_small){
      opts.push(`title={\\small Listing ${lstnum}${splitid} : ${title}}`);
    }else{
      opts.push(`title={Listing ${lstnum}${splitid} : ${title}}`);
    }
    if(label){
      opts.push(`label={${label}}`);
    }
    opts.push(`basicstyle={\\ttfamily\\small}`)
    opts.push(`numbers=left`);
    opts.push(`firstnumber=${splitstart+1}`);
    opts = opts.join(',');
    let all = [];
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
    return all.join('\n');
  }
  float_to_multicols(title,label,style,bundles){
    var itms = this.bundles_to_figure_itms(style,bundles);
    var row = [];
    itms = itms.filter(p => p.type=='bundle');
    var n = itms.length;
    var all = [];
    all.push('');
    all.push(`\\begin{flushleft}`);           
    for(let k=0; k < n; ++k){
      var p = itms[k];
      var text = p.img;
      all.push(`\\begin{minipage}{${1/n}\\linewidth}`);
      all.push(text);
      all.push(`\\end{minipage}%`);
    }
    all.push(`\\end{flushleft}`);
    return all.join('\n');
  }
  float_to_alignment(title,label,style,bundles){
    var ss = bundles[0].ss;
    var all = [];
    var a = 'flushleft';
    if(style.textalign=='c'){
      a = 'center';
    }else if(style.textalign=='r'){
      a = 'flushright';
    }
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var text = this.to_fontstyled_text(text,style.fontstyle);
    var text = this.to_fontsized_text(text,style.fontsize);
    all.push('');
    all.push(`\\begin{${a}}`);
    all.push(text);
    all.push(`\\end{${a}}`);
    return all.join('\n');
  }
  float_to_vspace(title,label,style,bundles){
    var all = [];
    var vspace = this.g_to_vspace_float(style);
    all.push('');
    all.push(`\\vspace{${vspace}em}`);
    return all.join('\n');
  }
  //////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////
  to_latexlabelcmd(label){
    var s = label?`\\label{${label}}`:'';
    return s;
  }

  do_ruby(items){
    // let glue = String.fromCodePoint('0xAD');
    let glue = '';
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
  halign_to_longtabu_ww(n,halign){
    var pcols = this.string_to_array(halign);
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
  halign_to_tabularx_ww(n,halign) {
    /// \begin{tabularx}{\linewidth}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var pcols = this.string_to_array(halign);
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
    // var pcols = this.string_to_array(s||'');
    var re_lcr = /^([lcr])\s*(.*)$/;
    var re_pw = /^p(\d+)\s*(.*)$/;
    var pp = [];
    var v;
    while(halign && halign.length){
      if((v=re_lcr.exec(halign))!==null){
        var x = v[1];
        halign = v[2];
        pp.push(x);
      }
      else if((v=re_pw.exec(halign))!==null){
        var w = v[1];
        halign = v[2];
        ///reduce by 2mm for latex
        w = parseInt(w)-4;
        if(w < 1){
          w = 1;//don't let go below 1mm
        }
        pp.push(`p\{${w}mm\}`);
      }
      else {
        break;
      }
    }
    while(pp.length < n){
      pp.push('l');
    }
    pp = pp.slice(0,n);
    return pp;
  }
  pcols_to_latex_pcol(pcols,rules,side,vrules){
    var pcol = '';
    if(rules=='cols'||rules=='all'){
      pcol = pcols.join('|');
    }else if(rules=='groups' && side){
      let pcols1 = pcols.slice(0,1);
      let pcols2 = pcols.slice(1);
      pcol = `${pcols1.join('')}|${pcols2.join('')}`;
    }else if(rules){
      pcol = pcols.join('');
    }else{
      ///manually insert vrules
      pcols = pcols.map((s,i,arri) => {
        if(i>0 && vrules.indexOf(i)>=0){
          return '|'+s;
        }else{
          return s;
        }
      })
      pcol = pcols.join('');
    }
    return pcol;
  }
  polish_verb(style,unsafe){
    //let myhyp = `-${String.fromCodePoint('0x200B')}`
    unsafe = this.polish(style,unsafe);
    unsafe = unsafe.replace(/­/g, "~")
    unsafe = unsafe.replace(/\s/g, "~")
    unsafe = unsafe.replace(/-/g, "-{}")
    //unsafe = unsafe.replace(/\-/g,myhyp);
    //unsafe = unsafe.replace(/\-/g,String.fromCodePoint('0x2011'));
    return unsafe;
  }
  polish_literal(style,unsafe){
    //let myhyp = `-${String.fromCodePoint('0x200B')}`
    unsafe = this.polish(style,unsafe);
    unsafe = unsafe.replace(/­/g, "~")
    unsafe = unsafe.replace(/-/g, "-{}")
    //unsafe = unsafe.replace(/\-/g,myhyp);
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
      }else if(cc==0xAD){
        s = "";
      }
      safe+=s;
      continue;
    }
    ///add font switches to CJK characters including Japanese hiragana and katakana
    safe = this.fontify_cjk(style,safe);
    return safe;
  }
  ///
  ///NEW METHOD
  ///
  smooth (style,line) {
    line=''+line;
    const re_entity = /^&([A-Za-z][A-Za-z0-9]*|#[A-Za-z0-9]+);(.*)$/s;
    const re_dhyphe = /^(--)(.*)$/s;
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
      if((v=re_dhyphe.exec(line))!==null){
        s = v[1];
        line=v[2];        
        safe+='-\\/-';
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
      }else if(cc==0xAD){
        s = "";
      }
      safe+=s;
      continue;
    }
    ///add font switches to a group of CJK characters including hiragana and katakana
    safe = this.fontify_cjk(style,safe);
    safe = this.rubify_cjk(style,safe);
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
  row_to_tabular(pp,j,style){
    var d = [];
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    var mypp = pp.map((x,k) => {
      let {raw,text} = x;
      let mycolor = '';
      if(cellcolor_map.has(raw)){
        mycolor = cellcolor_map.get(raw);
      }
      if(style.side && k==0){
        mycolor = '';
      }
      if(style.head && j==0){
        mycolor = '';
      }
      if(mycolor){
        text = `\\cellcolor{${mycolor}}{}${text}`
      }
      return text;
    });
    d.push(`${mypp.join(' & ')} \\\\`);
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
      // if(this.conf_to_string('latex.cjk')=='1'){
      //   all.push(`\\usepackage[overlap,CJK]{ruby}`);
      //   all.push(`\\renewcommand\\rubysep{0.05ex}`);
      // }
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
        all.push(`\\let\\printglossary\\relax`);
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
    all.push(`\\usepackage{array}`);
    // all.push(`\\renewcommand{\\arraystretch}{1.45}`);
    all.push(`\\usepackage{graphicx}`);
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
    all.push(`\\usepackage{pict2e}`);
    all.push(`\\usepackage{graphpap}`);
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
    if(this.program == 'pdflatex'){
      switch(fn) {
        case 'cn': {
          return `\\begin{CJK}{UTF8}{gbsn}${s}\\end{CJK}`
          break;
        }
        case 'tw': {
          return `\\begin{CJK}{UTF8}{bsmi}${s}\\end{CJK}`
          break;
        }
        case 'jp': {
          return `\\begin{CJK}{UTF8}{min}${s}\\end{CJK}`
          break;
        }
        case 'kr': {
          return `\\begin{CJK}{UTF8}{mj}${s}\\end{CJK}`
          break;
        }
      }
      return s;
    }
    if(this.program == 'xelatex'){
      //return `{\\fontspec{${fn}}${s}}`
      return `{\\${fn}{}${s}}`
    }
    if(this.program == 'lualatex'){
      return `{\\${fn}{}${s}}`
    }
    return s;
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
  to_fontsized_text(s,f){
    switch(f){
      case 'small':
        s = `\\small ${s}`;
        break;
    }
    return s;
  }
  to_fontstyled_text(s,f){
    switch(f){
      case 's':
      case 'S':
        s = `\\slshape ${s}`;
        break;
      case 'i':
      case 'I':
        s = `\\itshape ${s}`;
        break;
      case 'b':
      case 'B':
        s = `\\bfseries ${s}`;
        break;
      case 't':
      case 'T':
        s = `\\ttfamily ${s}`;
        break;
    }
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
    str = str.trimStart();
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
    str = str.trimStart();
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
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_verb(style,cnt){
    let s = this.polish(style,cnt);
    s = s.replace(/-/g, "-{}")
    return `\\texttt{${s}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_math(style,cnt){
    var used = new Set();
    var s = this.tokenizer.to_literal_math(cnt,style,used,0);
    return `\\ensuremath{${s}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_dmath(style,cnt){
    var used = new Set();
    var s = this.tokenizer.to_literal_math(cnt,style,used,1);
    return `\\[\\ensuremath{${s}}\\]`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_strong(style,cnt){
    var ss = cnt.split('/');
    var ss = ss.map((s) => {return this.polish(style,s)});
    var ss = ss.map((s) => `\\textbf{${s}}`);
    return ss.join('/');    
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_var(style,cnt){
    var ss = cnt.split('/');
    var ss = ss.map((s) => {return this.polish(style,s)});
    var ss = ss.map((s) => `\\textsl{${s}}`);
    return ss.join('/');    
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_span(key,style,cnt){
    cnt = this.uncode(style,cnt);
    if(key=='em'){
      return `\\emph{${cnt}}`
    }else{
      return `{${cnt}}`;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_quotation(style,s){
    s = this.uncode(style,s);
    return `\\textquote{${s}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_em(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\emph{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_b(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\textbf{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_i(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\textit{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_u(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\underline{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_s(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\sout{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_tt(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\texttt{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_q(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\textquotedblleft{${cnt}}\\textquotedblright}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_g(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\guillemetleft{${cnt}}\\guillemetright}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_high(style,cnt){
    return `\\textsuperscript{${cnt}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_low(style,cnt){
    return `\\raisebox{-0.4ex}{\\scriptsize{}${cnt}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_small(style,cnt){
    return `{\\small{}${cnt}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_mono(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\texttt{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_br(style,cnt){
    return `{\\hfill\\break}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
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
        if(blk.style.name=='chapter'){          
          text = blk.style.chapnum;
        }else if(blk.style.name=='heading'){
          text = blk.style.level;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.style.name=='figure'){
          text = blk.style.fignum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.style.name=='listing'){
          text = blk.style.lstnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.style.name=='table'){
          text = blk.style.tabnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.style.name=='equation'){
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
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_url(style,cnt){
    return `\\url{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_link(style,cnt){
    cnt = this.restore_uri(cnt);
    return `\\url{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_colorbutton(style,cnt){
    return `{\\setlength{\\fboxsep}{1pt}\\fcolorbox{black}{white}{\\textcolor{${cnt}}{\\(\\blacksquare\\)}}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_fbox(style,cnt){
    if(cnt){
      var wd = ""+cnt+"em";
    }else{
      var wd = "1em";
    }
    if(!wd){
      return `{\\setlength{\\fboxsep}{0pt}\\framebox[10mm]{\\strut}}`;
    }else{
      return `{\\setlength{\\fboxsep}{0pt}\\framebox[${wd}]{\\strut}}`;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_hrule(style,cnt){
    var i = cnt.indexOf(' ');
    if(i<0){
      if(cnt){          
        var wd = ""+cnt+"em";
      }else{
        var wd = "1em";
      }
      var s = '~';
    }else{
      var wd = cnt.slice(0,i);
      var s = cnt.slice(i+1);
      if(wd){          
        wd = wd+"em";
      }else{
        wd = "1em";
      }
      s = s.trim();
      s = this.uncode(style,s);
      if(!s){
        s = '~';
      }
    }
    return `\\begin{tabular}{@{}c@{}}\\parbox{${wd}}{\\centering ${s}}\\tabularnewline\\hline\\end{tabular}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_img(style,cnt){
    var s_img = '';
    if(style['$'].buffers.hasOwnProperty(cnt)){
      let {ss,g} = style['$'].buffers[cnt];
      var itms = this.ss_to_img_bundle_itms(g,ss,0);
      if(itms.image){
        var imgsrc = this.choose_image_file(itms.image);
        var p = {};
        var [viewport_width,viewport_height,viewport_unit] = this.g_to_viewport_array(g);
        var unit = viewport_unit;
        var inkwidth = viewport_width*viewport_unit;
        var inkheight = viewport_height*viewport_unit;
        p.vw = Math.round(inkwidth*this.MM_TO_PX);
        p.vh = Math.round(inkheight*this.MM_TO_PX);
        var width = this.g_to_width_float(g);
        var height = this.g_to_height_float(g);
        if(width && height){
          p.width = width;
          p.height = height;
        }else if(width){
          p.width = width;
          p.height = viewport_height/viewport_width*width;
        }else if(height){
          p.height = height;
          p.width = viewport_width/viewport_height*height;
        }else{
          p.width = inkwidth;//mm
          p.height = inkheight;//mm
        }
        if(g.frame){
          s_img = `\\frame{\\includegraphics[width=${p.width}mm,height=${p.height}mm]{${imgsrc}}}`;
        }else{
          s_img = `\\includegraphics[width=${p.width}mm,height=${p.height}mm]{${imgsrc}}`;
        }
      }
    }
    return s_img;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_dia(style,cnt){
    var img = '';
    if(style['$'].buffers.hasOwnProperty(cnt)){
      let {ss,g} = style['$'].buffers[cnt];
      var o = this.diagram.to_diagram(g,ss);
      if(o.length){
        img = o[0].img;
        if(style.frame){
          img = `{\\begin{tabular}{@{}|l|@{}}\\hline{${img}}\\tabularnewline\\hline\\end{tabular}}`;///this step is necessary to remove any baseline that is embedded within each tikzpicture because otherwise this picture will try to baseline-align with neighboring text such that it rises above it
        }else{
          img = `{\\begin{tabular}{@{}l@{}}${img}\\end{tabular}}`;///this step is necessary to remove any baseline that is embedded within each tikzpicture because otherwise this picture will try to baseline-align with neighboring text such that it rises above it
        }
      }
    }
    return img;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_default(style,cnt){
    return `${cnt}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_utfchar(style,cnt){
    return `\\char"${cnt}{}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  choose_image_file(ss){
    const supported = ['.eps','.pdf','.png','.jpg','.mps','.jpeg','.jbig2','.jb2','.PDF','.PNG','.JPG','.JPEG','.JBIG2','.JB2'];
    for(let s of ss){
      var extname = path.extname(s);
      if(supported.indexOf(extname)>=0){
        this.imgs.push(s);
        return s;
      }
    }
    return '';
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  to_tikz_image(style,fname,fit,xm,ym,unit,grid){
    var width = xm*unit;
    var height = ym*unit;
    var background = this.g_to_background_string(style);
    var all = [];
    all.push(`\\begin{tikzpicture}`);
    all.push(`\\clip (0,0) rectangle (${width}mm,${height}mm) ;`);
    all.push(`\\draw[help lines, color={rgb,15:red,15;green,15;blue,15},ultra thin] (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`);
    if(fit=='contain'){
      all.push(`\\node (image) at (${width/2}mm,${height/2}mm) { \\includegraphics[width=${width}mm,height=${height}mm,keepaspectratio]{${fname}} } ;`);
    }else if(fit=='cover'){
      //currently 'cover' is unsupported on LATEX because of lack of capability offered by includegrahics command
      all.push(`\\node (image) at (${width/2}mm,${height/2}mm) { \\includegraphics[width=${width}mm,height=${height}mm,keepaspectratio]{${fname}} } ;`);
    }else{
      //default is 'fill'
      all.push(`\\node (image) at (${width/2}mm,${height/2}mm) { \\includegraphics[width=${width}mm,height=${height}mm]{${fname}} } ;`);
    }
    all.push(`\\end{tikzpicture}`);
    return all.join('\n');
  }
  to_definecolor_s(colorname){
    var p = w3color(colorname);///'p' is a special object
    var s = p.toHexString();
    ///\definecolor{MyBlue}{rgb}{0.9,0.9,1}
    var r = '0x' + s.substr(1,2); 
    var g = '0x' + s.substr(3,2);
    var b = '0x' + s.substr(5,2);
    r = parseInt(r)/255;
    g = parseInt(g)/255;
    b = parseInt(b)/255;
    return `\\definecolor{${colorname}}{rgb}{${r},${g},${b}}`;
  }
  to_all_definecolor_s(){
    var colors = [
      "AliceBlue",
      "AntiqueWhite",
      "Aqua",
      "Aquamarine",
      "Azure",
      "Beige",
      "Bisque",
      "Black",
      "BlanchedAlmond",
      "Blue",
      "BlueViolet",
      "Brown",
      "BurlyWood",
      "CadetBlue",
      "Chartreuse",
      "Chocolate",
      "Coral",
      "CornflowerBlue",
      "Cornsilk",
      "Crimson",
      "Cyan",
      "DarkBlue",
      "DarkCyan",
      "DarkGoldenRod",
      "DarkGray",
      "DarkGrey",
      "DarkGreen",
      "DarkKhaki",
      "DarkMagenta",
      "DarkOliveGreen",
      "DarkOrange",
      "DarkOrchid",
      "DarkRed",
      "DarkSalmon",
      "DarkSeaGreen",
      "DarkSlateBlue",
      "DarkSlateGray",
      "DarkSlateGrey",
      "DarkTurquoise",
      "DarkViolet",
      "DeepPink",
      "DeepSkyBlue",
      "DimGray",
      "DimGrey",
      "DodgerBlue",
      "FireBrick",
      "FloralWhite",
      "ForestGreen",
      "Fuchsia",
      "Gainsboro",
      "GhostWhite",
      "Gold",
      "GoldenRod",
      "Gray",
      "Grey",
      "Green",
      "GreenYellow",
      "HoneyDew",
      "HotPink",
      "IndianRed",
      "Indigo",
      "Ivory",
      "Khaki",
      "Lavender",
      "LavenderBlush",
      "LawnGreen",
      "LemonChiffon",
      "LightBlue",
      "LightCoral",
      "LightCyan",
      "LightGoldenRodYellow",
      "LightGray",
      "LightGrey",
      "LightGreen",
      "LightPink",
      "LightSalmon",
      "LightSeaGreen",
      "LightSkyBlue",
      "LightSlateGray",
      "LightSlateGrey",
      "LightSteelBlue",
      "LightYellow",
      "Lime",
      "LimeGreen",
      "Linen",
      "Magenta",
      "Maroon",
      "MediumAquaMarine",
      "MediumBlue",
      "MediumOrchid",
      "MediumPurple",
      "MediumSeaGreen",
      "MediumSlateBlue",
      "MediumSpringGreen",
      "MediumTurquoise",
      "MediumVioletRed",
      "MidnightBlue",
      "MintCream",
      "MistyRose",
      "Moccasin",
      "NavajoWhite",
      "Navy",
      "OldLace",
      "Olive",
      "OliveDrab",
      "Orange",
      "OrangeRed",
      "Orchid",
      "PaleGoldenRod",
      "PaleGreen",
      "PaleTurquoise",
      "PaleVioletRed",
      "PapayaWhip",
      "PeachPuff",
      "Peru",
      "Pink",
      "Plum",
      "PowderBlue",
      "Purple",
      "RebeccaPurple",
      "Red",
      "RosyBrown",
      "RoyalBlue",
      "SaddleBrown",
      "Salmon",
      "SandyBrown",
      "SeaGreen",
      "SeaShell",
      "Sienna",
      "Silver",
      "SkyBlue",
      "SlateBlue",
      "SlateGray",
      "SlateGrey",
      "Snow",
      "SpringGreen",
      "SteelBlue",
      "Tan",
      "Teal",
      "Thistle",
      "Tomato",
      "Turquoise",
      "Violet",
      "Wheat",
      "White",
      "WhiteSmoke",
      "Yellow",
      "YellowGreen"
      ];
    var all = colors.map((s) => this.to_definecolor_s(s));
    return all.join('\n');
  }
  to_hl_bullet_text(bullet){
    if(bullet=='>'){
      return '{$\\triangleright$}';
    }
    return '';
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  plst_to_text(style,itemize){
    var text = this.itemize_to_text(style,itemize);
    var all = [];
    all.push(``);
    if(style.fontsize||style.fontstyle){
      all.push(`\\begingroup`);   
      if(style.fontsize=='small'){
        all.push('\\small');
      }
      if(style.fontstyle=='i'||style.fontstyle=='I'){
        all.push('\\itshape');
      }
      all.push(text);
      all.push(`\\endgroup`);   
    }else{
      all.push(text);
    }
    return all.join('\n');
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  cove_to_text(style,cove){
    var n = cove.length;
    var p0 = cove[0];
    var pn = cove[cove.length-1];
    //all normal font size
    let d=cove.map((p,i,arr) => {
      let text = this.uncode(style,p.text);
      return text;
    });
    var text=d.join('\\\\\n');
    var all = [];
    all.push('');
    all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{30pt}}`);
    all.push(`\\item[{$\\triangleright$}] ${text}`);
    all.push(`\\end{list}`)
    return all.join('\n');
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  cave_to_text(style,cave){
    var n = cave.length;
    var p0 = cave[0];
    var pn = cave[cave.length-1];
    //all normal font size
    let d=cave.map((p,i,arr) => {
      let text = this.uncode(style,p.text);
      return text;
    });
    var text=d.join('\\\\\n');
    var all = [];
    all.push('');
    all.push(`\\begin{center}`);
    all.push(text);
    all.push(`\\end{center}`)
    return all.join('\n');
  }  
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  step_to_text(style,step){
    step.forEach((p,i,arr) => {
      p.text = this.uncode(style,p.text);
    });
    var all = [];
    all.push('');
    all.push(`\\begin{enumerate}`);
    step.forEach((p,i) => {
      if(i==0){
        all.push(`\\item[${p.value}.] ${p.text}`);
      }else{
        all.push(``);
        all.push(p.text);
      }
    });
    all.push(`\\end{enumerate}`)
    return all.join('\n');
  }  
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  samp_to_text(style,samp){
    let ss = samp.map((p) => {
      let x = p.text;
      x = x.trimEnd();
      return x;
    });
    let hew = this.g_to_hew_int(style);
    let n = ss.length;
    let fontsize_css = '';
    let fontsize_swi = '';
    if(style.fontsize=='small'){
      fontsize_css = 'fontsize=\\small';
      fontsize_swi = '\\small';
    }
    if(hew>1){
      let nn = this.to_split_hew(n,hew);
      let all = [];
      all.push('');
      all.push(`\\begin{multicols}{${hew}}`);              
      nn.forEach((nl,j) => {
        let [n1,n2] = nl;
        let ss1 = ss.slice(n1,n2);
        let text1 = ss1.join('\n');
        all.push(`\\begin{Verbatim}[${fontsize_css}]`);
        all.push(text);
        all.push(`\\end{Verbatim}`);
      });
      all.pop();//remove the last \columnbreak
      all.push(`\\end{multicols}`);              
      return all.join('\n')
    }else{
      var all = [];
      all.push('');
      let text = ss.join('\n');
      all.push(`\\begin{Verbatim}[${fontsize_css}]`);
      all.push(text);
      all.push(`\\end{Verbatim}`);
      return all.join('\n')
    }
  }
  ///////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////
  sand_to_text(style,sand){
    var ss = sand.map((p) => {
      let x = p.text;
      x = x.trimEnd();
      if (!x) {
        x = "~";
      }else{
        x = this.polish_verb(style,x);
        x = this.to_fontstyled_text(x,style.fontstyle);
      }
      return x;
    });
    let hew = this.g_to_hew_int(style);
    let n = ss.length;
    let fontsize_css = '';
    let fontsize_swi = '';
    if(style.fontsize=='small'){
      fontsize_css = '\\small';
      fontsize_swi = '\\small';
    }
    if(hew>1){
      let nn = this.to_split_hew(n,hew);
      let all = [];
      all.push('');
      all.push(`\\begin{multicols}{${hew}}`);
      nn.forEach((nl,j) => {
        all.push(`\\begin{minipage}{\\textwidth}${fontsize_swi}`);                        
        let [n1,n2] = nl;
        let ss1 = ss.slice(n1,n2);
        let text1 = ss1.join('\\\\\n');
        all.push(text1);
        all.push(`\\end{minipage}`);               
      });
      all.push(`\\end{multicols}`);
      return all.join('\n')
    }else{
      let text = ss.join('\\\\');
      var all = [];
      all.push('');
      all.push(`\\begin{flushleft}${fontsize_swi}`);
      all.push(text);
      all.push(`\\end{flushleft}`)
      return all.join('\n')
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  bundle_to_text(style,bundle){
    var o = this.do_bundle(style,bundle);
    var text = '';
    if(o.length){
      text = o[0].img;
    }
    var all = [];
    all.push('');
    all.push('\\begin{flushleft}');
    all.push(text);
    all.push('\\end{flushleft}');
    return all.join('\n');
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  body_to_text(style,body){
    if(this.parskip){
      var text = this.join_para(body);
      var text = this.uncode(style,text);
      var text = `\\begin{flushleft}\n${text}\n\\end{flushleft}`;
    }else{
      var text = this.join_para(body);
      var text = this.uncode(style,text);
    }
    var all = [];
    all.push('');
    all.push(text);
    return all.join('\n');
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  float_to_primary(title,label,style,body,bodyrow){
    var all = [];
    var title = this.uncode(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    all.push('');
    all.push(`\\paragraph{${title}}`);
    all.push(text);
    return all.join('\n');
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  float_to_secondary(title,label,style,body,bodyrow){
    var all = [];
    var title = this.uncode(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    all.push('');
    all.push(`\\subparagraph{${title}}`);
    all.push(text);
    return all.join('\n');
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  to_preamble_essentials_pdflatex(){
    var all = [];
    all.push(`\\usepackage[utf8x]{inputenc}`);
    all.push(`\\usepackage[T1]{fontenc}`);
    all.push("\\newcommand{\\activatehyphen}{\\begingroup\\lccode`~=`- \\lowercase{\\endgroup\\def~}{\\char`\\-\\kern0pt }\\catcode`\\-=\\active}");
    all.push(`\\usepackage[overlap,CJK]{ruby}`);
    all.push(`\\renewcommand\\rubysep{0.0ex}`);
    all.push(`\\usepackage{array}`);
    all.push(`\\usepackage{multirow}`);
    all.push(`\\usepackage{csquotes}`);
    // all.push(`\\renewcommand{\\arraystretch}{1.45}`);
    all.push(`\\usepackage{graphicx}`);
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
    all.push(`\\usepackage{trimclip}`);
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
    all.push(`\\usepackage{hang}`);
    all.push(`\\usepackage{listings}`);
    all.push(`\\usepackage{anyfontsize}`);
    all.push(`\\usepackage[normalem]{ulem}`);
    all.push(`\\usepackage{xcolor}`);
    all.push(`\\usepackage{colortbl}`);
    all.push(`\\usepackage{tikz}`);
    all.push(`\\usepackage{pict2e}`);
    all.push(`\\usepackage{graphpap}`);
    all.push(`\\usepackage{url}`);
    all.push(`\\usepackage{wrapfig}`);
    all.push(`\\usepackage{multicol}`);
    all.push(`\\usepackage{threeparttable}`);
    all.push(`\\usepackage{fancyvrb}`);
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
    all.push(`\\newenvironment{packed_enumerate}{`);
    all.push(`  \\begin{enumerate}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{enumerate}}`);
    all.push(`\\newenvironment{packed_itemize}{`);
    all.push(`  \\begin{itemize}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{itemize}}`);
    all.push(`\\newenvironment{packed_description}{`);
    all.push(`  \\begin{description}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{description}}`);
    all.push(`\\newenvironment{packed_hanginglist}{`);
    all.push(`  \\begin{hanginglist}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{hanginglist}}`);
    all.push(this.to_all_definecolor_s());
    return all.join('\n');
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  to_preamble_essentials_xelatex(){
    var all = [];
    all.push(`\\usepackage{fontspec}`);
    all.push("\\newcommand{\\activatehyphen}{\\begingroup\\lccode`~=`- \\lowercase{\\endgroup\\def~}{\\char`\\-\\kern0pt }\\catcode`\\-=\\active}");
    all.push(`\\usepackage[overlap,CJK]{ruby}`);
    all.push(`\\renewcommand\\rubysep{0.0ex}`);
    all.push(`\\usepackage{array}`);
    all.push(`\\usepackage{multirow}`);
    all.push(`\\usepackage{csquotes}`);
    // all.push(`\\renewcommand{\\arraystretch}{1.45}`);
    all.push(`\\usepackage{graphicx}`);
    all.push(`\\usepackage{mathtools}`);
    all.push(`\\usepackage{latexsym}`);
    all.push(`\\usepackage{eufrak}`);
    all.push(`\\usepackage{bbold}`);
    all.push(`\\usepackage{xfrac}`);
    all.push(`\\usepackage{commath}`);
    all.push(`\\usepackage{trimclip}`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
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
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\usepackage{hang}`);
    all.push(`\\usepackage{listings}`);
    all.push(`\\usepackage{anyfontsize}`);
    all.push(`\\usepackage[normalem]{ulem}`);
    all.push(`\\usepackage{xcolor}`);
    all.push(`\\usepackage{colortbl}`);
    all.push(`\\usepackage{tikz}`);
    all.push(`\\usepackage{pict2e}`);
    all.push(`\\usepackage{graphpap}`);
    all.push(`\\usepackage{url}`);
    all.push(`\\usepackage{wrapfig}`);
    all.push(`\\usepackage{multicol}`);
    all.push(`\\usepackage{threeparttable}`);
    all.push(`\\usepackage{fancyvrb}`);
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
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\newenvironment{packed_enumerate}{`);
    all.push(`  \\begin{enumerate}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{enumerate}}`);
    all.push(`\\newenvironment{packed_itemize}{`);
    all.push(`  \\begin{itemize}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{itemize}}`);
    all.push(`\\newenvironment{packed_description}{`);
    all.push(`  \\begin{description}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{description}}`);
    all.push(`\\newenvironment{packed_hanginglist}{`);
    all.push(`  \\begin{hanginglist}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{hanginglist}}`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(this.to_all_definecolor_s());
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    for(let font of this.fonts){
      let {fid,xelatex} = font;
      if(fid && xelatex){
        all.push(`\\newfontfamily{\\${fid}}{${xelatex}}`);
      }
    }
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`%%% bodyfontsuit: ${this.bodyfontsuit} %%%`);
    all.push(`%%% bodyfontvariant: ${this.bodyfontvariant} %%%`);
    all.push(`%%% bodyfontsize: ${this.bodyfontsize} %%%`);
    if(this.bodyfontsuit=='linux'){
      if(this.bodyfontvariant=='ss'){
        all.push(`\\defaultfontfeatures[Libertinus Mono]{Scale=0.89}`);
        all.push(`\\setmainfont[Ligatures=TeX]{Libertinus Sans}`);
        all.push(`\\setsansfont[Ligatures=TeX]{Libertinus Sans}`);
        all.push(`\\setmonofont[Ligatures=TeX]{Libertinus Mono}`);
      }else{
        all.push(`\\defaultfontfeatures[Libertinus Mono]{Scale=0.89}`);
        all.push(`\\setmainfont[Ligatures=TeX]{Libertinus Serif}`);
        all.push(`\\setsansfont[Ligatures=TeX]{Libertinus Sans}`);
        all.push(`\\setmonofont[Ligatures=TeX]{Libertinus Mono}`);
      }
    }else if(this.bodyfontsuit=='dejavu'){
      if(this.bodyfontvariant=='ss'){
        all.push(`\\defaultfontfeatures[DejaVu Serif]{Scale=0.89}`);
        all.push(`\\defaultfontfeatures[DejaVu Sans]{Scale=0.89}`);
        all.push(`\\defaultfontfeatures[DejaVu Sans Mono]{Scale=0.89}`);
        all.push(`\\setmainfont[Ligatures=TeX]{DejaVu Sans}`);
        all.push(`\\setsansfont[Ligatures=TeX]{DejaVu Sans}`);
        all.push(`\\setmonofont[Ligatures=TeX]{DejaVu Sans Mono}`);
      }else{
        all.push(`\\defaultfontfeatures[DejaVu Serif]{Scale=0.89}`);
        all.push(`\\defaultfontfeatures[DejaVu Sans]{Scale=0.89}`);
        all.push(`\\defaultfontfeatures[DejaVu Sans Mono]{Scale=0.89}`);
        all.push(`\\setmainfont[Ligatures=TeX]{DejaVu Serif}`);
        all.push(`\\setsansfont[Ligatures=TeX]{DejaVu Sans}`);
        all.push(`\\setmonofont[Ligatures=TeX]{DejaVu Sans Mono}`);
      }
    }else if(this.bodyfontsuit=='office'){
      if(this.bodyfontvariant=='ss'){
        all.push(`\\setmainfont[Ligatures=TeX]{Arial}`);
        all.push(`\\setsansfont[Ligatures=TeX]{Arial}`);
        all.push(`\\setmonofont[Ligatures=TeX]{Courier New}`);
      }else{
        all.push(`\\setmainfont[Ligatures=TeX]{Times New Roman}`);
        all.push(`\\setsansfont[Ligatures=TeX]{Arial}`);
        all.push(`\\setmonofont[Ligatures=TeX]{Courier New}`);
      }
    }
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n');
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  to_preamble_essentials_lualatex(){
    var all = [];
    all.push(`\\let\\printglossary\\relax`);
    all.push(`\\usepackage{luatexja-fontspec}`);
    all.push("\\newcommand{\\activatehyphen}{\\begingroup\\lccode`~=`- \\lowercase{\\endgroup\\def~}{\\char`\\-\\kern0pt }\\catcode`\\-=\\active}");
    all.push(`\\usepackage[overlap,CJK]{ruby}`);
    all.push(`\\renewcommand\\rubysep{0.0ex}`);
    all.push(`\\usepackage{array}`);
    all.push(`\\usepackage{multirow}`);
    all.push(`\\usepackage{csquotes}`);
    // all.push(`\\renewcommand{\\arraystretch}{1.45}`);
    all.push(`\\usepackage{graphicx}`);
    all.push(`\\usepackage{mathtools}`);
    all.push(`\\usepackage{latexsym}`);
    all.push(`\\usepackage{eufrak}`);
    all.push(`\\usepackage{bbold}`);
    all.push(`\\usepackage{xfrac}`);
    all.push(`\\usepackage{commath}`);
    all.push(`\\usepackage{trimclip}`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
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
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\usepackage{hang}`);
    all.push(`\\usepackage{listings}`);
    all.push(`\\usepackage{anyfontsize}`);
    all.push(`\\usepackage[normalem]{ulem}`);
    all.push(`\\usepackage{xcolor}`);
    all.push(`\\usepackage{colortbl}`);
    all.push(`\\usepackage{tikz}`);
    all.push(`\\usepackage{pict2e}`);
    all.push(`\\usepackage{graphpap}`);
    all.push(`\\usepackage{url}`);
    all.push(`\\usepackage{wrapfig}`);
    all.push(`\\usepackage{multicol}`);
    all.push(`\\usepackage{threeparttable}`);
    all.push(`\\usepackage{fancyvrb}`);
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
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\newenvironment{packed_enumerate}{`);
    all.push(`  \\begin{enumerate}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{enumerate}}`);
    all.push(`\\newenvironment{packed_itemize}{`);
    all.push(`  \\begin{itemize}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{itemize}}`);
    all.push(`\\newenvironment{packed_description}{`);
    all.push(`  \\begin{description}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{description}}`);
    all.push(`\\newenvironment{packed_hanginglist}{`);
    all.push(`  \\begin{hanginglist}`);
    all.push(`    \\setlength{\\itemsep}{0pt}`);
    all.push(`    \\setlength{\\parskip}{0pt}`);
    all.push(`    \\setlength{\\parsep}{0pt}`);
    all.push(`  }{\\end{hanginglist}}`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(this.to_all_definecolor_s());
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    for(let font of this.fonts){
      let {fid,lualatex} = font;
      if(fid && lualatex){
        all.push(`\\newjfontfamily{\\${fid}}{${lualatex}}`);
      }
    }
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`%%% bodyfontsuit: ${this.bodyfontsuit} %%%`);
    all.push(`%%% bodyfontvariant: ${this.bodyfontvariant} %%%`);
    all.push(`%%% bodyfontsize: ${this.bodyfontsize} %%%`);
    if(this.bodyfontsuit=='linux'){
      if(this.bodyfontvariant=='ss'){
        all.push(`\\defaultfontfeatures[Libertinus Mono]{Scale=0.89}`);
        all.push(`\\setmainfont[Ligatures=TeX]{Libertinus Sans}`);
        all.push(`\\setsansfont[Ligatures=TeX]{Libertinus Sans}`);
        all.push(`\\setmonofont[Ligatures=TeX]{Libertinus Mono}`);
      }else{
        all.push(`\\defaultfontfeatures[Libertinus Mono]{Scale=0.89}`);
        all.push(`\\setmainfont[Ligatures=TeX]{Libertinus Serif}`);
        all.push(`\\setsansfont[Ligatures=TeX]{Libertinus Sans}`);
        all.push(`\\setmonofont[Ligatures=TeX]{Libertinus Mono}`);
      }
    }else if(this.bodyfontsuit=='dejavu'){
      if(this.bodyfontvariant=='ss'){
        all.push(`\\defaultfontfeatures[DejaVu Serif]{Scale=0.89}`);
        all.push(`\\defaultfontfeatures[DejaVu Sans]{Scale=0.89}`);
        all.push(`\\defaultfontfeatures[DejaVu Sans Mono]{Scale=0.89}`);
        all.push(`\\setmainfont[Ligatures=TeX]{DejaVu Sans}`);
        all.push(`\\setsansfont[Ligatures=TeX]{DejaVu Sans}`);
        all.push(`\\setmonofont[Ligatures=TeX]{DejaVu Sans Mono}`);
      }else{
        all.push(`\\defaultfontfeatures[DejaVu Serif]{Scale=0.89}`);
        all.push(`\\defaultfontfeatures[DejaVu Sans]{Scale=0.89}`);
        all.push(`\\defaultfontfeatures[DejaVu Sans Mono]{Scale=0.89}`);
        all.push(`\\setmainfont[Ligatures=TeX]{DejaVu Serif}`);
        all.push(`\\setsansfont[Ligatures=TeX]{DejaVu Sans}`);
        all.push(`\\setmonofont[Ligatures=TeX]{DejaVu Sans Mono}`);
      }
    }else if(this.bodyfontsuit=='office'){
      if(this.bodyfontvariant=='ss'){
        all.push(`\\setmainfont[Ligatures=TeX]{Arial}`);
        all.push(`\\setsansfont[Ligatures=TeX]{Arial}`);
        all.push(`\\setmonofont[Ligatures=TeX]{Courier New}`);
      }else{
        all.push(`\\setmainfont[Ligatures=TeX]{Times New Roman}`);
        all.push(`\\setsansfont[Ligatures=TeX]{Arial}`);
        all.push(`\\setmonofont[Ligatures=TeX]{Courier New}`);
      }
    }
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n');
  }
}
module.exports = { NitrilePreviewLatex }
