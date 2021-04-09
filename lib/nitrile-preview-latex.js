'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewDiagramTikz } = require('./nitrile-preview-diagramtikz');
const { NitrilePreviewFramedTikz } = require('./nitrile-preview-framedtikz');
const { NitrilePreviewLmath } = require('./nitrile-preview-lmath');
const unijson = require('./nitrile-preview-unicode');
const os = require('os');

class NitrilePreviewLatex extends NitrilePreviewTranslator {

  constructor(parser,program) {
    super(parser);
    this.program = program;        
    this.name='LATEX';
    this.tokenizer = new NitrilePreviewLmath(this);
    this.diagram = new NitrilePreviewDiagramTikz(this);
    this.framed = new NitrilePreviewFramedTikz(this);
    this.imgs = [];
    this.flags = {};
    this.enumerate_counter = 0;
    this.cc_symbol_map = this.tokenizer.cc_symbol_map;
    this.icon_bullet     = '{\\textbullet}';
    this.icon_circlebox  = '\\ding{108}'                       
    this.icon_circleboxo = '\\ding{109}'                       
    this.icon_squarebox  = '\\ding{110}'                       
    this.icon_squareboxo = '\\ding{111}'        
    this.count_part = 0;
    this.count_chapter = 0;
    this.count_section = 0;
    this.count_subsection = 0;
    this.count_subsubsection = 0;      
  }
  do_HDGS(block){
    var {hdgn,name,title,label,style} = block;
    var style = this.update_style_from_switches(style,'HDGS')
    var o = [];
    o.push('');
    var raw = title;
    //note that it might have something like \jp which is fine because the "bookmark" package will remove it
    var title = this.uncode(title,style);
    var star = '';
    if(name=='section'){
      hdgn += 1;
    }else if(name=='subsection'){
      hdgn += 2;
    }else if(name=='subsubsection'){
      hdgn += 3;
    }
    if(hdgn==0){
      if(name=='part'){
        o.push(`\\part{${this.uncode(title,style)}}`);
        this.count_part++;
      }else{
        o.push(`\\chapter{${title}}${this.to_latexlabelcmd(label)}`);
        if(star) o.push(`\\addcontentsline{toc}{chapter}{${raw}}`);
        this.count_chapter++;
      }
    }else if(hdgn==1){
      o.push(`\\section{${title}}${this.to_latexlabelcmd(label)}`);
      if(star) o.push(`\\addcontentsline{toc}{section}{${raw}}`);
      this.count_section++;
    }
    else if(hdgn==2){
      o.push(`\\subsection{${title}}${this.to_latexlabelcmd(label)}`);
      if(star) o.push(`\\addcontentsline{toc}{subsection}{${raw}}`);
      this.count_subsection++;
    }
    else if(hdgn>=3){
      o.push(`\\subsubsection{${title}}${this.to_latexlabelcmd(label)}`);
      this.count_subsubsection++;
    }
    return o.join('\n');
  }
  do_PLST(block){
    var {plitems,nblank,para,style} = block;
    var style = this.update_style_from_switches(style,'PLST')
    if(!nblank){
      return this.fence_to_list(para,style);
    }else{
      let itemize = this.plitems_to_itemize(plitems);
      var o = [];
      o.push('');
      var text = this.itemize_to_text(itemize,style);
      o.push(text);
      return o.join('\n')
    }
  }
  item_dl_to_text(i,item,g,item_labels){
    var o = [];
    var text = this.uncode(item.text,g);
    item_labels.push(text);
    var text = item_labels.join('\\\\')
    var text = `\\parbox{\\linewidth}{${text}}`
    o.push(`\\item[${text}]~`)          
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`${this.untext(lines,g)}`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_hl_to_text(i,item,g){
    var o = [];
    var text = this.uncode(item.text);
    o.push(`\\item ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`${this.untext(lines,g)}`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ol_to_text(i,item,g){
    var o = [];
    var text = this.uncode(item.text,g);
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
        let { lines, itemize } = p;
        if(lines){
          o.push(`${this.untext(lines,g)}`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ul_to_text(i,item,g){
    var o = [];
    var text = this.uncode(item.text,g);
    o.push(`\\item ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`${this.untext(lines,g)}`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    return o.join('\n\n')
  }
  itemize_to_text(itemize,g){
    var bull = itemize.bull;
    var items = itemize.items;
    var o = [];
    switch (bull) {
      case 'OL': {
        o.push(`\\begin{enumerate}`);
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(j,item,g);
          o.push(text);
        });
        o.push('\\end{enumerate}')
        break;
      }
      case 'UL': {
        o.push(`\\begin{itemize}`);
        items.forEach((item,j) => {
          let text = this.item_ul_to_text(j,item,g);
          o.push(text);
        });
        o.push('\\end{itemize}')
        break;
      }
      case 'DL': {
        o.push(`\\begin{description}`)
        var item_labels = [];
        items.forEach((item,j) => {
          let text = this.item_dl_to_text(j,item,g,item_labels);
          if(item_labels.length > 1){
            o.pop();
            o.push(text);
          }else{
            o.push(text);
          }
          if(item.more && item.more.length>0){
            item_labels = [];
          }
        });
        o.push(`\\end{description}`)
        break;
      }
      case 'HL': {
        o.push(`\\begin{hanginglist}`);
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(j,item,g);
          o.push(text);
        });
        o.push(`\\end{hanginglist}`)
        break;
      }
    }
    return o.join('\n\n');
  }
  do_HRLE(block){
    var o = [];
    var {title,style} = block;
    var style = this.update_style_from_switches(style,'HRLE')
    o.push('');
    title = this.uncode(title,style);
    o.push(`\\begin{center}`);
    o.push(`\\rule{0.75\\linewidth}{0.5pt}`);
    o.push(`\\end{center}`);
    return o.join('\n');
  }
  do_PRIM(block){
    var {rank,title,body,style} = block;
    var style = this.update_style_from_switches(style,'PRIM')
    title = this.uncode(title,style);
    let s0 = body[0]||'';
    let text = this.untext(body,style);
    var o = [];
    if (rank===1) {
      text = `\\paragraph{${title}} ${text}`;
      o.push('');
      o.push(`${text}`);
    } 
    else if (rank===2) {
      text = `\\subparagraph{${title}} ${text}`;
      o.push('');
      o.push(`${text}`);
    }
    else {
      text = `{\\bfseries\\itshape{}${title}} ${text}`;
      o.push('');
      o.push(`${text}`);
    } 
    return o.join('\n');
  }
  do_PARA(block){
    var {body,style} = block;
    var style = this.update_style_from_switches(style,'PARA')
    var text = this.untext(body,style);
    var o = [];
    o.push('');
    o.push(text);
    return o.join('\n');
  }
  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  do_vbarchart (g) {
    var o = [];
    o.push(`\\begin{mplibcode}`);
    o.push(`beginfig(1)`);
    o.push(this.diagram.to_mp_vbarchart(g));
    o.push(`endfig`);
    o.push(`\\end{mplibcode}`);
    var s = o.join('\n');
    var s = `\\fbox{${s}}`;
    return s;
  }
  do_xyplot (g) {
    var o = [];
    o.push(`\\begin{mplibcode}`);
    o.push(`beginfig(1)`);
    o.push(this.diagram.to_mp_xyplot(g));
    o.push(`endfig`);
    o.push(`\\end{mplibcode}`);
    var s = o.join('\n');
    var s = `\\fbox{${s}}`;
    return s;
  }
  do_colorbox (g) {
    var o = [];
    o.push(`\\begin{mplibcode}`);
    o.push(`beginfig(1)`);
    o.push(this.diagram.to_mp_colorbox(g));
    o.push(`endfig`);
    o.push(`\\end{mplibcode}`);
    var s = o.join('\n');
    var s = `\\fbox{${s}}`;
    return s;
  }

  //
  // fence_to_XXX
  // 
  fence_to_parbox(ss,g) {
    var g = this.update_style_from_switches(g,'math');
    var latex_width = this.string_to_latex_width(g.width,1,'\\linewidth');
    var texts = ss.map((s) => this.uncode(s));
    var text = texts.join('\\\\')
    return `\\parbox{${latex_width}}{${text}}`
  }
  fence_to_math(ss,g) {
    var g = this.update_style_from_switches(g,'math');
    var str = ss.join('\n')
    let s = this.tokenizer.to_lmath(str,g);
    return `\\[${s}\\]`;
  }
  fence_to_framed(ss,g) {
    var g = this.update_style_from_switches(g,'framed');
    var text = this.ss_to_framed(ss,g);
    if(g.float){
      let f = (g.float == 'left') ? 'l' : 'r';
      text = `\\begin{wraptable}{${f}}{0pt}${text}\\end{wraptable}~`;
    }
    return text;
  }
  fence_to_diagram(ss,style) {
    var style = this.update_style_from_switches(style,'diagram');
    if(style.wrap){
      var env = {};
      var { text } = this.diagram.to_diagram(ss,style,env);
      if(!text) return '';
      // 'text' is a begin-end-tikzpicture 
      let width = this.string_to_latex_width(style.width,style.zoom);
      let height = this.string_to_latex_height(style.height,style.zoom);
      if(style.outline==1){
        text = `\\setlength\\fboxsep{0pt}\\fbox{${text}}`
      }
      if(width && height){
        text = `\\resizebox{${width}}{${height}}{${text}}`;
      }else if(width){
        text = `\\resizebox{${width}}{!}{${text}}`;
      }else if(height){
        text = `\\resizebox{!}{${height}}{${text}}`;
      }
      if(style.wrap=='left'){
        text = `\\begin{wrapfigure}{l}{0pt}\n${text}\n\\end{wrapfigure}~`;
      }else{
        text = `\\begin{wrapfigure}{r}{0pt}\n${text}\n\\end{wrapfigure}~`;
      }
      return text;
    }else if(style.animate){
      var animate = this.g_to_animate_string(g);
      var quantity = this.g_to_quantity_int(g);
      var env_array = this.animate_to_env_array(animate,quantity);
      var o = [];
      for(let env of env_array){
        var { text } = this.diagram.to_diagram(ss,style,env);
        if(text){
          // 'text' is a begin-end-tikzpicture 
          let width = this.string_to_latex_width(style.width,1);
          let height = this.string_to_latex_height(style.height,1);
          if(style.outline){
            text = `\\setlength\\fboxsep{0pt}\\fbox{${text}}`
          }
          if(width && height){
            text = `\\resizebox{${width}}{${height}}{${text}}`;
          }else if(width){
            text = `\\resizebox{${width}}{!}{${text}}`;
          }else if(height){
            text = `\\resizebox{!}{${height}}{${text}}`;
          }
          o.push(text); 
        }
      }
      var text = o.join('\n')
      return text;    
    }else{
      var env = {};
      var { text } = this.diagram.to_diagram(ss,style,env);
      if(!text) return '';
      // 'text' is a begin-end-tikzpicture 
      let width = this.string_to_latex_width(style.width,style.zoom);
      let height = this.string_to_latex_height(style.height,style.zoom);
      if(style.outline==1){
        text = `\\setlength\\fboxsep{0pt}\\fbox{${text}}`
      }
      if(width && height){
        text = `\\resizebox{${width}}{${height}}{${text}}`;
      }else if(width){
        text = `\\resizebox{${width}}{!}{${text}}`;
      }else if(height){
        text = `\\resizebox{!}{${height}}{${text}}`;
      }
      return text;
    }
  }
  fence_to_img(ss,g) {
    var g = this.update_style_from_switches(g,'img');
    var text = this.ss_to_latex_includegraphics(ss,g);
    if (g.isfigure) {
      text = text;
    }else if (g.wrap) {
      let f = (g.wrap == 'left') ? 'l' : 'r';
      text = `\\begin{wraptable}{${f}}{0pt}\n${text}\n\\end{wraptable}~`;
    }else{
      // this is so that it shows up nicely aligned with
      // a picture if the next phrase is a picture
      text = `\\node[inner sep=0pt] () at (0,0) {${text}}`;
    }
    return text;
  }
  fence_to_verbatim(ss,g){
    var g = this.update_style_from_switches(g,'verbatim')
    var fontsize = this.assert_float(g.fontsize,);
    var fontsize = this.tokenizer.to_latex_fontsize(fontsize);
    var pp = ss.map(s => {
      s = this.polish(s);
      s = s.replace(/\s/g, "~");
      if (!s) {
        s = "~";
      }
      s = `{\\ttfamily{}${s}}`;
      return s;
    });
    var text = this.to_list_text(pp);
    var text = this.to_fontsized_text(text,g);
    return text;
  }
  fence_to_tabular(ss,g) {
    var g = this.update_style_from_switches(g,'tabular');
    var title = g.title||'';
    var rows = this.ss_to_tabular_rows(ss,g);
    var rows = this.update_rows_by_hrule(rows,g.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,g);
      })
    })
    if(g.head && rows.length){
      let pp0 = rows[0];
      pp0.forEach((p) => {
        p.text = `{\\bfseries ${p.text}}`;
      });
    }
    //
    //put it together
    //
    var n = (rows.length) ?  rows[0].length : 1;
    if(g.fr){
      var pcols = this.fr_to_latex_pcols(n,g.fr,g.factor);
    }else{
      var pcols = this.halign_to_latex_pcols(n,g.halign);
    }
    var pcol = this.pcols_to_latex_pcol(pcols,g.vrule);
    var o = [];
    o.push(`\\begin{tabular}{${pcol}}`);
    if(title){
      title = this.uncode(title,g);
      o.push(`\\multicolumn{${n}}{c}{${title}}\\\\`);
    }
    o.push(this.rows_to_tabular(rows, g));
    o.push('\\end{tabular}')
    var text = o.join('\n')
    text = this.to_fontsized_text(text,g);
    return text;
  }
  fence_to_tabbing(ss,g){
    var g = this.update_style_from_switches(g,'tabbing')
    var rows = this.ss_to_tabular_rows(ss,g);
    var rows = this.update_rows_by_hrule(rows,g.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,g);
      })
    })
    /// uncode all the data
    var n = (rows.length)?rows[0].length:1;
    var strut = parseFloat(g.strut)||0;
    var gap = parseFloat(g.gap)||0.02;
    var d = [];
    var frs = this.string_to_frs_with_gap(g.fr||'',n,gap);
    var tabsets = [];
    var sum = 0;
    frs.forEach((x,i,arr) => {
      sum = 0;
      sum += frs[i];
      sum += gap;
      tabsets.push(sum.toFixed(3));
    })
    d.push('');
    d.push(`\\begin{tabbing}`)
    tabsets = tabsets.map((x,i,arr) => {
      if(i+1==arr.length) return '\\kill'
      else return `\\hspace{${x}\\linewidth}`
    })
    d.push(tabsets.join('\\='));
    var s = '';
    rows.forEach((row,i,arr) => {
      if(g.head && i==0){
        row = row.map((x) => `\\textbf{${x.text}}`);
      }else {
        row = row.map((x) => `${x.text}`);
      }
      if(strut){
        row = row.map((x,i,arr) => `\\parbox[][${strut}pt][c]{${frs[i]}\\linewidth}{${x}}`)
      }else{
        row = row.map((x,i,arr) => `${x}`)
      }
      s = row.join('\\>');
      d.push(`${s}\\\\`);
    });
    if(s) {
      ///ensure the last item does not have a \\\\
      d.pop();
      d.push(s);
    }
    d.push('\\end{tabbing}')
    var text = d.join('\n')
    var text = this.to_fontsized_text(text,g);
    return text;
  }
  fence_to_list(ss,g) {
    var g = this.update_style_from_switches(g,'list')
    var itms = this.ss_to_list_itms(ss,g);
    var bullet     = this.icon_bullet; 
    let squarebox  = this.icon_squarebox;
    let squareboxo = this.icon_squareboxo;
    let circlebox  = this.icon_circlebox;
    let circleboxo = this.icon_circleboxo;
    let check_ss = this.string_to_array(this.assert_string(g.check));
    const nbsp = '~~';
    if(g.bullet){
      try{
        let s = this.tokenizer.get_tex_symbol(g.bullet);
        bullet = `{${s}}`;
      }catch(e){
      }
    }
    itms.forEach((p,i,arr) => {
      if(p.text=='\\\\') {
        p.text = '~';
      }else{
        p.text = this.uncode(p.text,g);
      }
      p.bull = this.uncode(p.bull,g);
      p.value = this.uncode(p.value,g);
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
      else if(p.type == 'CB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          p.item  = `${squarebox}`;
          p.latex = `${p.text}`;
        }
        else{
          //empty CB
          p.item  = `${squareboxo}`;
          p.latex = `${p.text}`;          
        }
      }
      else if(p.type == 'RB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          p.item  = `${circlebox}`;
          p.latex = `${p.text}`;
        }
        else{
          //empty RB
          p.item  = `${circleboxo}`;
          p.latex = `${p.text}`;
        }
      }
      else{
        ///for other types, the hangindent is not set
        p.item = `${bullet}`
        p.latex = `${p.text}`;
      }
    });
    var text = this.to_margined_text(itms);
    var text = this.to_fontsized_text(text,g);
    return text;
  }
  fence_to_wrapfig(ss,g){
    var g = this.update_style_from_switches(g,'wrapfig');
    var text = this.ss_to_latex_includegraphics(ss,g);
    //let f = (g.float == 'left') ? 'l' : 'r';
    text = `\\begin{wrapfigure}{r}{0pt}\n${text}\n\\end{wraptable}~`;
    return text;
  }
  fence_to_wrapdia(ss,g){
    var g = this.update_style_from_switches(g,'wrapdia');
    var env = {};
    var { text } = this.diagram.to_diagram(ss,g,env);
    // 'text' is a begin-end-tikzpicture 
    let width = this.string_to_latex_width(g.width,g.zoom);
    let height = this.string_to_latex_height(g.height,g.zoom);
    if(width && height){
      text = `\\resizebox{${width}}{${height}}{${text}}`;
    }else if(width){
      text = `\\resizebox{${width}}{!}{${text}}`;
    }else if(height){
      text = `\\resizebox{!}{${height}}{${text}}`;
    }
    if(g.outline){
      text = `\\setlength\\fboxsep{0pt}\\fbox{${text}}`
    }
    //let f = (g.float == 'left') ? 'l' : 'r';
    text = `\\begin{wrapfigure}{r}{0pt}\n${text}\n\\end{wrapfigure}~`;
    return text;
  }
  ///
  ///NOTE: float_to_XXX
  ///
  float_to_framed(title,label,style,ss){
    var style = this.update_style_from_switches(style,'framed')
    var text = this.ss_to_framed(ss,style);
    let all = [];
    all.push('');
    all.push(`\\begin{flushleft}`)
    all.push(text.trim());
    all.push(`\\end{flushleft}`);
    return all.join('\n');
  }
  float_to_blockquote(title,label,style,ss){
    var style = this.update_style_from_switches(style,'blockquote')
    if(1){
      let all = [];
      let clusters = this.ss_to_clusters(ss);
      clusters = clusters.map((ss) => {
        var s = this.join_para(ss);
        var s = this.uncode(s);
        if(style.rubify){
          s = this.rubify(s,style.vmap);
        }
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
  float_to_lines(title,label,style,ss){
    ss = this.trim_samp_body(ss);
    var pp = ss.map((s) => {
      if (!s) {
        s = "~";
      }else{
        s = this.polish(s);
        if(style.rubify){
          s = this.rubify(s,style.vmap);
        }
      }
      return {latex:s};
    });
    var text = this.to_margined_text(pp);
    return text;
  }
  float_to_verbatim(title,label,style,ss){
    return this.fence_to_verbatim(ss,style);
  }
  float_to_figure(title,label,style,ss){
    var style = this.update_style_from_switches(style,'figure')
    var style = {...style,isfigure:1};//this is to cause the call to 'fence_to_XXX' to behave a little differently
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    all.push('');
    if(style.subfigure){
      let d = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='phrase'){
          p.img = this.do_phrase(p.key,p.style,p.cnt,p.cnt2,p.cnt3);
          p.sub = this.uncode(p.sub,p.style);
          p.sub = `{\\small ${p.sub}}`
          d.push(`\\subfigure[${p.sub}]{${p.img}}`)
          let s = d.join('\n');
          all.pop();
          all.push(s);
        }else if(p.type=='fence'){
          p.img = this.do_fence(p.key,p.style,p.body);
          p.sub = this.uncode(p.sub,p.style);
          p.sub = `{\\small ${p.sub}}`
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
    }else{
      itms.forEach((p,j,arr) => {
        if(p.type=='phrase'){
          p.img = this.do_phrase(p.key,p.style,p.cnt,p.cnt2,p.cnt3);
          p.sub = this.uncode(p.sub,p.style);        
          all.push(p.img)
        }else if(p.type=='fence'){
          p.img = this.do_fence(p.key,p.style,p.body);
          p.sub = this.uncode(p.sub,p.style);        
          all.push(p.img)
        }
      });
    }
    var o = [];
    if(style.wide==1){
      o.push(`\\begin{figure*}[ht]`);  
    }else{
      o.push(`\\begin{figure}[ht]`);
    }
    o.push(`\\centering`);
    var title = this.uncode(title,style).trim();
    if(title){
      o.push(`\\caption{${title}}`);
      if(label){
        o.push(`\\label{${label}}`);
      }
    }
    all.forEach((s) => {
      o.push(s);
    })
    if(style.wide==1){
      o.push(`\\end{figure*}`);
    }else{
      o.push(`\\end{figure}`);
    }
    return o.join('\n');
  }
  float_to_math(title,label,style,ss){
    var style = this.update_style_from_switches(style,'math');
    style = {...style,displaymath:1}
    var text = ss.join('\n');
    var text = this.tokenizer.to_lmath(text,style);
    var text = text.trim();
    text = `\\begin{equation*}\n${text}\n\\end{equation*}`
    return text;
  }
  float_to_equation(title,label,style,ss){
    var style = this.update_style_from_switches(style,'equation');
    style = {...style,displaymath:1}
    var text = ss.join('\n')
    var text = this.tokenizer.to_lmath(text,style);
    var text = text.trim();
    if(label.length){
      text = `\\label{${label}}\n${text}`;
    }
    text = `\\begin{equation}\n${text}\n\\end{equation}`
    return text;
  }
  float_to_table(title,label,style,ss){
    var style = this.update_style_from_switches(style,'table');
    var ss = this.trim_samp_body(ss);
    //
    // preparing rows
    //
    var rows = this.ss_to_tabular_rows(ss,style);
    var rows = this.update_rows_by_hrule(rows,style.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,style);
      })
    })
    if(style.head && rows.length){
      var pp = rows[0];
      pp.forEach((p) => {
        p.text = `{\\bfseries ${p.text}}`;
      });
    }
    //
    // preparing pcol
    //
    var n = (rows.length) ? rows[0].length : 1;
    if(style.fr){
      var pcols = this.fr_to_latex_pcols(n,style.fr,style.factor);
    }else{
      var pcols = this.halign_to_latex_pcols(n,style.halign);
    }
    var pcol = this.pcols_to_latex_pcol(pcols,style.vrule);
    //
    //getting ready to put it together
    //
    var o = [];
    o.push('');
    if(style.wide==1){
      o.push(`\\begin{table*}[ht]`)
    }else{
      o.push(`\\begin{table}[ht]`);
    }
    o.push(`\\centering`);
    title = this.uncode(title,style);
    if(title){
      o.push(`\\caption{${title}}`);
      if (label) {
        o.push(`\\label{${label}}`);
      }
    }
    if(1){
      let d = [];
      d.push(`\\begin{tabular}{${pcol}}`);
      d.push(this.rows_to_tabular(rows,style));
      d.push('\\end{tabular}')
      let s = d.join('\n');
      s = this.to_fontsized_text(s,style);
      o.push(s);
    }
    if(style.wide==1){
      o.push(`\\end{table*}`);
    }else{
      o.push(`\\end{table}`);
    }
    return o.join('\n');
  }
  float_to_longtable(title,label,style,ss){
    var style = this.update_style_from_switches(style,'longtable');
    var ss = this.trim_samp_body(ss);
    var rows = this.ss_to_tabular_rows(ss,style);
    var rows = this.update_rows_by_hrule(rows,style.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,style);
      })
    })    
    var n = (rows.length) ? rows[0].length : 1;
    if(style.fr){
      var pcols = this.fr_to_latex_pcols(n,style.fr,style.factor);
    }else{
      var pcols = this.halign_to_latex_pcols(n,style.halign);
    }
    var pcol = this.pcols_to_latex_pcol(pcols,style.vrule);
    var o = [];
    o.push('');
    if(rows.length){
      var pp0 = rows[0];
      var ss = pp0.map(p => p.text)
      var ss = ss.map(s => `{\\bfseries ${s}}`)
      rows = rows.slice(1);
      o.push(`\\begin{flushleft}`)
      o.push(`\\tablecaption{${this.uncode(title)}}`);
      if(label){
        o.pop();
        o.push(`\\tablecaption{${this.uncode(title)}}\\label{${label}}`);
      }
      // \tablehead{\hline {\bfseries Name} & {\bfseries Desc} \\}
      // \tabletail{\hline \multicolumn{2}{r}{\itshape to be continued...} \\}
      //o.push(`\\tablelasttail{\\multicolumn{${n}}{r}{} \\smallskip}`);
      if(style.hrule=='---'){
        if(pp0.lower==2){
          o.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\ \\hline \\hline}`)
        }else if(pp0.lower==1){
          o.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\ \\hline}`)
        }else{
          o.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\}`)
        }
        o.push(`\\tabletail{\\hline \\multicolumn{${n}}{r}{\\itshape to be continued...} \\\\}`);
        o.push(`\\tablelasttail{}`);
        o.push(`\\begin{xtabular}{${pcol}}`)
      }else if(style.hrule=='--'){
        //before and after
        if(pp0.lower==2){
          o.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\ \\hline \\hline}`)
        }else if(pp0.lower==1){
          o.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\ \\hline}`)
        }else{
          o.push(`\\tablehead{\\hline ${ss.join(' & ')} \\\\}`)
        }
        o.push(`\\tabletail{\\hline \\multicolumn{${n}}{r}{\\itshape to be continued...} \\\\}`);
        o.push(`\\tablelasttail{\\hline}`);
        o.push(`\\begin{xtabular}{${pcol}}`)
      }else if(style.hrule=='-'){
        //inter-rows
        if(pp0.lower==2){
          o.push(`\\tablehead{${ss.join(' & ')} \\\\ \\hline \\hline}`)
        }else if(pp0.lower==1){
          o.push(`\\tablehead{${ss.join(' & ')} \\\\ \\hline}`)
        }else{
          o.push(`\\tablehead{${ss.join(' & ')} \\\\}`)
        }
        o.push(`\\tabletail{\\hline \\multicolumn{${n}}{r}{\\itshape to be continued...} \\\\}`);
        o.push(`\\tablelasttail{\\hline}`);
        o.push(`\\begin{xtabular}{${pcol}}`)
      }else{
        //no hrules
        if(pp0.lower==2){
          o.push(`\\tablehead{${ss.join(' & ')} \\\\ \\hline \\hline}`)
        }else if(pp0.lower==1){
          o.push(`\\tablehead{${ss.join(' & ')} \\\\ \\hline}`)
        }else{
          o.push(`\\tablehead{${ss.join(' & ')} \\\\}`)
        }
        o.push(`\\tabletail{\\multicolumn{${n}}{r}{\\itshape to be continued...} \\\\}`);
        o.push(`\\tablelasttail{}`);
        o.push(`\\begin{xtabular}{${pcol}}`)
      }
      var text = this.rows_to_tabular(rows,style);
      o.push(text);
      o.push('\\end{xtabular}')
      o.push('\\end{flushleft}')
    }
    return o.join('\n')
  }
  float_to_listing(title,label,style,ss){
    var opts = [];
    title = this.uncode(title,style);
    if(title){
      //if caption is empty the word "Listing" won't show
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
  float_to_columns(title,label,style,ss){
    var clusters = this.ss_to_clusters(ss);
    var texts = clusters.map((ss) => this.untext(ss,style));
    var total = texts.length;
    var n = 2;
    var o = [];
    o.push('');
    for(let j=0; j < total; j+=n){
      o.push(`\\begin{multicols}{${n}}`);
      for(let i=0; i < n; ++i){
        let text = texts.shift();
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
  ///
  ///
  ///
  _toFramedLtpp (para) {
    //var width [expr 2*([get-para-width $para]+2)]mm
    //set n [llength $para]
    //set height [expr ($n+3)*10]pt

    var mpara = 80;
    var npara = para.length;

    var verbminwidth = 80;
    if (mpara < verbminwidth) {
      mpara = verbminwidth;
    }

    var _vw = `${6*mpara}`;
    var _vh = `${10*(npara)}`;
    var vw = `${6*mpara}pt`;
    var vh = `${10*(npara)}pt`;
    para = this.toReversedArray( para );

    var o = [];
    ///o.push(`\\setlength{\\unitlength}{1pt}`);
    o.push(`\\begin{picture}(${_vw},${_vh})`);

    var y = 0; /// 8 is a sensable number---the bigger the number the more upwards the contents shifts
    for (var line of para) {
      var x = 0;
      for (var c of line) {
        if (/\S/.test(c)) {
          c = this.polish(c);
          o.push(`\\put(${x},${y}){\\ttfamily\\fontsize{10pt}{10pt}\\selectfont{}${c}}`);
        }
        x += 6;
      }
      y += 10;
    }

    o.push(`\\end{picture}`);
    return [o.join('\n'), vw, vh];
  }

  toFramedLtpp (para) {
    //var width [expr 2*([get-para-width $para]+2)]mm
    //set n [llength $para]
    //set height [expr ($n+3)*10]pt

    var mpara = 80;
    var npara = para.length;

    var verbminwidth = 80;
    if (mpara < verbminwidth) {
      mpara = verbminwidth;
    }

    var _vw = 494;
    var _vh = `${12*(npara)}`;
    para = this.toReversedArray( para );

    var o = [];
    ///o.push(`\\setlength{\\unitlength}{1pt}`);
    o.push(`\\begin{picture}(${_vw},${_vh})`);

    var y = 0; /// used to be '8' ---the bigger the number the more upwards the contents shifts
    for (var line of para) {
      var x = 0;
      line = this.polish(line);
      o.push(`\\put(${x},${y+3}){\\ttfamily\\fontsize{12pt}{12pt}\\selectfont{}${line}}`);
      y += 12;
    }

    o.push(`\\end{picture}`);
    return [o.join('\n'), _vw, _vh];
  }

  to_latexlabelcmd(label){
    var s = label?`\\label{${label}}`:'';
    return s;
  }

  to_framed_pgf (para, config ) {
    //var width [expr 2*([get-para-width $para]+2)]mm
    //set n [llength $para]
    //set height [expr ($n+3)*10]pt

    var mpara = 80;
    var npara = para.length;

    if (mpara < config.verbminwidth) {
      mpara = config.verbminwidth;
    }

    var vw = `${6*mpara}pt`;
    var vh = `${10*(1+npara)}pt`;
    para = this.toReversedArray( para );

    var o = [];
    o.push(`\\begin{pgfpicture}{0pt}{0pt}{${vw}}{${vh}}`);

    var y = 7; /// 7 is a sensable number---the bigger the number the more upwards the contents shifts
    for (var line of para) {
      var x = 0;
      for (var c of line) {
        if (/\S/.test(c)) {
          c = this.polish(c);
          o.push(`\\pgftext[x=${x}pt,y=${y}pt,base,left]{\\ttfamily\\fontsize{10pt}{10pt}\\selectfont{}${c}}`);
        }
        x += 6;
      }
      y += 10;
    }

    o.push(`\\end{pgfpicture}`);
    return [o.join('\n'), vw, vh];
  }
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(`\\ruby{${item[0]}}{${item[1]}}`);
    }
    let text = o.join('');
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
    var re_pw = /^p\((.*)\)$/;
    pcols = pcols.map((x) => {
      if(re_lcr.test(x)){
        return x;
      }
      else if(re_pw.test(x)){
        var w = re_pw.exec(x)[1];
        w = this.string_to_latex_width(w,1,'');
        if(w){
          return `p\{${w}\}`
        }else{
          return 'l';
        }
      }
      else {
        return null;
      }
    });
    pcols = pcols.filter((x) => x);
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
  make_line(ss,style){
    var lines = this.to_formula_math_array(ss.join('\n'));
    if(lines.length>0){
      lines = lines.map(pp => {
        var p = pp.join(' & ');
        return p;
      });
      lines = lines.filter(x => x.length?true:false);//remove empty lines
      var line = lines.join('\\\\\n');
      var line = `\\begin{alignedat}{1}\n${line}\n\\end{alignedat}`;
    } else {
      lines = lines.map(pp => {
        var p = pp.join(' ');
        return p;
      });
      var line = lines.join('\n');
    }
    return line;
  }
  polish_verb(line){
    line = this.polish(line);
    line = line.replace(/\s/g, "~")
    return line;
  }
  ///
  ///This method does not convert entity symbols
  ///
  polish(line){
    line=''+line;
    const re_char   = /^(.)(.*)$/s;
    var safe='';
    var v;
    while(line.length){
      if((v=re_char.exec(line))!==null){
        let s = v[1];
        line = v[2];
        switch(s) {
          case  "’":     s = "{\\char39}" ; break;
          case  "“":     s = "{\\char34}" ; break;
          case  "”":     s = "{\\char34}" ; break;
          case  `"`:     s = "{\\char34}" ; break;
          case  "\|":    s = "{\\char124}"; break;
          case  "\*":    s = "{\\char42}" ; break;
          case  "~":     s = "{\\char126}"; break;
          case  "<":     s = "{\\char60}" ; break;
          case  ">":     s = "{\\char62}" ; break;
          case  "\[":    s = "{\\char91}" ; break;
          case  "\]":    s = "{\\char93}" ; break;
          case  "#":     s = "{\\char35}" ; break;
          case  "&":     s = "{\\char38}" ; break;
          case  "%":     s = "{\\char37}" ; break;
          case  "\$":    s = "{\\char36}" ; break;
          case  "_":     s = "{\\char95}" ; break;
          case  "\^":    s = "{\\char94}" ; break;
          case  "\{":    s = "{\\char123}"; break;
          case  "\}":    s = "{\\char125}"; break;
          case  "\\":    s = "{\\char92}" ; break;
          default: {
            let cc = s.codePointAt(0);
            if(this.cc_symbol_map.has(cc)){
              s = this.cc_symbol_map.get(cc).tex;
              s = `{${s}}`
            }
            break;
          }
        } 
        safe+=s;
        continue;
      }
      safe+=line;
      break;
    }
    ///add font switches to CJK characters including Japanese hiragana and katakana
    safe = this.fontify_latex_cjk(safe);
    return safe;
  }
  ///
  ///NEW METHOD
  ///
  smooth (line) {
    line=''+line;
    const re_entity = /^&([A-Za-z][A-Za-z0-9]*);(.*)$/s;
    const re_char   = /^(.)(.*)$/s;
    var safe='';
    var v;
    while(line.length){
      if((v=re_entity.exec(line))!==null){
        let symbol=v[1];
        line=v[2];
        try{
          let s = this.tokenizer.get_tex_symbol(symbol);
          safe+=`{${s}}`;
        }catch(e){
          safe+=symbol;
        }
        continue;
      }
      if((v=re_char.exec(line))!==null){
        let s = v[1];
        line = v[2];
        switch(s) {
          case  "’":     s = "{\\char39}" ; break;
          case  "“":     s = "{\\char34}" ; break;
          case  "”":     s = "{\\char34}" ; break;
          case  `"`:     s = "{\\char34}" ; break;
          case  "\|":    s = "{\\char124}"; break;
          case  "\*":    s = "{\\char42}" ; break;
          case  "~":     s = "{\\char126}"; break;
          case  "<":     s = "{\\char60}" ; break;
          case  ">":     s = "{\\char62}" ; break;
          case  "\[":    s = "{\\char91}" ; break;
          case  "\]":    s = "{\\char93}" ; break;
          case  "#":     s = "{\\char35}" ; break;
          case  "&":     s = "{\\char38}" ; break;
          case  "%":     s = "{\\char37}" ; break;
          case  "\$":    s = "{\\char36}" ; break;
          case  "_":     s = "{\\char95}" ; break;
          case  "\^":    s = "{\\char94}" ; break;
          case  "\{":    s = "{\\char123}"; break;
          case  "\}":    s = "{\\char125}"; break;
          case  "\\":    s = "{\\char92}" ; break;
          default: {
            let cc = s.codePointAt(0);
            if(this.cc_symbol_map.has(cc)){
              s = this.cc_symbol_map.get(cc).tex;
              s = `{${s}}`
            }
            break;
          }
        } 
        safe+=s;
        continue;
      }
      safe+=line;
      break;
    }
    ///add font switches to a group of CJK characters including hiragana and katakana
    safe = this.fontify_latex_cjk(safe);
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

  string_to_latex_width(s,zoom,def='') {
    /// take an input string that is 100% and convert it to '\linewidth'.
    /// take an input string that is 50% and convert it to '0.5\linewidth'.
    /// take an input string that is 10cm and returns "10cm"
    /// take an input string that is 10 and returns "10mm"
    if (!s) {
      return def;
    }
    zoom = parseFloat(zoom)||1;
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(s))!==null) {
      var num = v[1];
      num *= zoom;
      var num = parseFloat(num)/100;
      if (Number.isFinite(num)) {
        var num = num.toFixed(3);
        if (num==1) {
          return `\\linewidth`;
        }
        return `${num}\\linewidth`;
      } 
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if((v=re.exec(s))!==null){
      var num = v[1];
      var unit = v[2];
      num *= zoom;
      if(Number.isFinite(num)){
        return `${num.toFixed(3)}${unit}`;
      }
    }
    return def;
  }
  string_to_latex_height(s,zoom) {
    if (!s) {
      return '';
    }
    zoom = parseFloat(zoom)||1;
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(s))!==null) {
      return '';
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if((v=re.exec(s))!==null){
      var num = v[1];
      var unit = v[2];
      num *= zoom;
      if(Number.isFinite(num)){
        return `${num.toFixed(3)}${unit}`;
      }
    }
    return '';
  }
  string_to_latex_height_with_aspect_ratio(width_s,aspect_ratio_s,zoom) {
    /// take an input string that is 100% and convert it to '\linewidth'.
    /// take an input string that is 50% and convert it to '0.5\linewidth'.
    /// take an input string that is 10cm and returns "10cm"
    /// take an input string that is 10 and returns "10mm"
    if (!width_s) {
      return '';
    }
    /// convert as aspect_ratio_s to a float: "16/9" -> 9/16 = 0.5625
    ///
    var ratio = this.aspect_ratio_to_float(aspect_ratio_s);
    if(!ratio){
      return '';
    }
    /// convert width_s
    ///
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(width_s))!==null) {
      var num = v[1];
      num *= zoom;
      var num = parseFloat(num)/100;
      if (Number.isFinite(num)) {
        num *= ratio;
        var num = num.toFixed(3);
        if (num==1) {
          return `\\linewidth`;
        }
        return `${num}\\linewidth`;
      } 
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if((v=re.exec(width_s))!==null){
      var num = v[1];
      num *= zoom;
      var unit = v[2];
      num *= ratio;
      if(Number.isFinite(num)){
        return `${num.toFixed(3)}${unit}`;
      }
    }
    var num = parseFloat(width_s);
    num *= zoom;
    if(Number.isFinite(num)){
      num *= ratio;
      return `${num.toFixed(3)}mm`;
    }
    return '';
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
  rows_to_tabular(rows,style,hsizes){
    var strut = parseInt(style.strut)||0;
    var strut = Math.max(strut,0);
    var d = [];
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    var flag_hline = 0;
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
      if(strut && hsizes){
        mypp = mypp.map((x,i) => `\\parbox[][${strut}pt][c]{\\hsize}{\\raggedright{}${x}}`);
      }
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
    var j = unijson.blocks.length-1;
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
    var block = unijson.blocks[m];
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
    if(latex_program === 'xelatex' || latex_program === 'lualatex'){
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
      all.push(`\\part{${this.uncode(my.title,my.style)}}`);
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
    all.push(`\\chapter{${this.uncode(my.title,my.style)}}${this.to_latexlabelcmd(my.style.label)}`);
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
    all.push(`\\section{${this.uncode(my.title,my.style)}}${this.to_latexlabelcmd(my.style.label)}`);
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
    all.push(`\\subsection{${this.uncode(my.title,my.style)}}${this.to_latexlabelcmd(my.style.label)}`);
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
    all.push(`\\subsubsection{${this.uncode(my.title,my.style)}}${this.to_latexlabelcmd(my.style.label)}`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
      }else{
        all.push(o.latex);
      }
    });
    return all.join('\n');
  }
  to_documentclass() {
    return this.conf_to_string('latex.documentclass','article');
  }
  to_documentclassopt() {
    return this.conf_to_list('latex.documentclassopt');
  }
  to_titlelines(){
    var titlelines = [];
    var block = this.parser.blocks[0];
    var style = {};
    if(block && block.sig=='FRNT'){
      let data = block.data;
      for(let t of data){
        let [key,val] = t;
        if(key=='title'){
          titlelines.push(`\\title{${this.uncode(val,style)}}`);
        }
        else if(key=='author'){
          titlelines.push(`\\author{${this.uncode(val,style)}}`);
        }
      }
    }
    return titlelines;
  }
  to_toclines(){
    var toclines = [];
    if(this.conf_to_string('latex.toc')){
      toclines.push(`\\tableofcontents`);
    } 
    return toclines;
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
  to_formula_math_array(text,style) {
    var d = this.tokenizer.to_lmath_array(text,style);
    return d;
  }
  ss_to_framed(ss,style){
    var { text } = this.framed.to_framed(ss,style);
    let width = this.string_to_latex_width(style.width,style.zoom,'\\linewidth');
    let height = this.string_to_latex_height(style.height,style.zoom);
    if(style.outline==1){
      text = `\\setlength\\fboxsep{0pt}\\fbox{${text}}`
    }
    if(width && height){
      text = `\\resizebox{${width}}{${height}}{${text}}`;
    }else if(width){
      text = `\\resizebox{${width}}{!}{${text}}`;
    }else if(height){
      text = `\\resizebox{!}{${height}}{${text}}`;
    }
    return text;
  }
  ss_to_latex_includegraphics(ss,style){
    var fname = this.choose_latex_image_file(ss);
    this.imgs.push(fname);
    var width = this.string_to_latex_width(style.width,style.zoom);
    var height = this.string_to_latex_height(style.height,style.zoom);
    /// in figure
    var opts = [];
    if(width && height){
      opts.push(`width=${width}`);
      opts.push(`height=${height}`);
    }else if(width){
      opts.push('keepaspectratio');
      opts.push(`width=${width}`);
    }else if(height){
      opts.push('keepaspectratio');
      opts.push(`height=${height}`);
    }
    if(style.outline==1){
      opts.push(`frame`)
    }
    var text = `\\includegraphics[${opts.join(',')}]{${fname}}`;
    return text;    
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
  ///
  /// literal_to_double
  ///
  literal_to_double(style,cnt){
    let s = this.polish_verb(cnt);
    return `{\\textquotedblleft{\\ttfamily{}${s}}\\textquotedblright}`;
  }
  ///
  /// literal_to_single
  ///
  literal_to_single(style,cnt){
    let s = this.polish_verb(cnt);
    return `{\\ttfamily{}${s}}`;
  }
  ///
  /// phrase_to_XXX 
  ///
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
  phrase_to_qquad(style,cnt,cnt2,cnt3){
    return `\\qquad{}`;
  }
  ///following are misc phrases
  phrase_to_inlinemath(style,cnt,cnt2,cnt3){
    let s = this.tokenizer.to_lmath(cnt,style);
    return `\\(${s}\\)`;
  }
  phrase_to_displaymath(style,cnt,cnt2,cnt3){
    let s = this.tokenizer.to_lmath(cnt,style,1);
    return `\\[${s}\\]`;
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
    var style = this.update_style_from_switches(style,'colorbutton')
    var ss = [];
    ss.push(`viewport 1 1 5`);
    ss.push(`fill {linesize:1,fillcolor:${cnt}} &rectangle{(0.1,0.1),0.8,0.8}`);
    ss.push(`stroke {linesize:1,fillcolor:${cnt}} &rectangle{(0,0),1,1}`);
    var env = {};
    var { text } = this.diagram.to_diagram(ss,style,env);
    return text;
  }
  phrase_to_img(style,cnt,cnt2,cnt3){
    var cnt2 = `{${cnt2}}`;
    style = this.string_to_style(cnt2,style)[0];
    return this.fence_to_img([cnt],style);
  }
  phrase_to_diagram(style,cnt,cnt2,cnt3){
    var cnt2 = `{${cnt2}}`;
    style = this.string_to_style(cnt2,style)[0];
    return this.fence_to_diagram([cnt],style);
  }
  phrase_to_framed(style,cnt,cnt2,cnt3){
    var cnt2 = `{${cnt2}}`;
    style = this.string_to_style(cnt2,style)[0];
    return this.fence_to_framed([cnt],style);
  }
  ///following are math phrases
  phrase_to_math(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_math(style,cnt);
  }
  phrase_to_sqrt(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_sqrt(style,cnt);
  }
  phrase_to_dfrac(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_dfrac(style,cnt,cnt2);
  }
  phrase_to_frac(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_frac(style,cnt,cnt2);
  }
  phrase_to_dbinom(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_dbinom(style,cnt,cnt2);
  }
  phrase_to_binom(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_binom(style,cnt,cnt2);
  }
  phrase_to_root(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_root(style,cnt,cnt2);
  }
  phrase_to_overline(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_overline(style,cnt);
  }
  phrase_to_overleftrightarrow(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_overleftrightarrow(style,cnt);
  }
  phrase_to_overrightarrow(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_overrightarrow(style,cnt);
  }
  phrase_to_underleftrightarrow(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_underleftrightarrow(style,cnt);
  }
  phrase_to_underrightarrow(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_underrightarrow(style,cnt);
  }
  phrase_to_subsup(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_subsup(style,cnt,cnt2,cnt3);
  }
  phrase_to_sub(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_subsup(style,cnt,cnt2,'');
  }
  phrase_to_sup(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_subsup(style,cnt,'',cnt2);
  }
  phrase_to_sum(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_sum(style,cnt,cnt2,cnt3);
  }
  phrase_to_int(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_int(style,cnt,cnt2,cnt3);
  }
  phrase_to_default(style,cnt,cnt2,cnt3){
    return `${cnt}`
  }
  ///
  ///to_pdflatex_document
  ///
  to_pdflatex_document(documentclass,documentclassopt,titlelines,body){
    ///start putting them together
    var all = [];
    all.push(`%!TeX program=PdfLatex`);
    all.push(`\\documentclass{${documentclass}}[${documentclassopt.join(',')}]`);
    all.push(`\\usepackage[utf8x]{inputenc}`);
    all.push(`\\usepackage[T1]{fontenc}`);
    all.push(`\\usepackage[overlap,CJK]{ruby}`);
    all.push(`\\renewcommand\\rubysep{0.05ex}`);
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
    all.push(`\\usepackage{parskip}`);
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
  to_xelatex_document(documentclass,documentclassopt,titlelines,body) {
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
    all.push(`\\documentclass{${documentclass}}[${documentclassopt.join(',')}]`);
    all.push(`\\usepackage{fontspec,xltxtra,xunicode}`);
    all.push(`\\usepackage[overlap,CJK]{ruby}`);
    all.push(`\\renewcommand\\rubysep{0.05ex}`);
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
    all.push(`\\usepackage{unicode-math}`);
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
    all.push(`\\usepackage{parskip}`);
    ///following are user settings related to line break locale and 
    ///new font family names
    var linebreaklocale = this.conf_to_string('xelatex.linebreaklocale');
    if(linebreaklocale){
      all.push(`\\XeTeXlinebreaklocale "${linebreaklocale}"`);
    }
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
    var newfontfamily = this.conf_to_list('xelatex.postsetup');
    newfontfamily.forEach((s) => {
      all.push(s);
    })
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
  to_latex_document(documentclass,documentclassopt,titlelines,body){
    if(this.program=='pdflatex'){
      return this.to_pdflatex_document(documentclass,documentclassopt,titlelines,body)
    }else if(this.program=='xelatex'){
      return this.to_xelatex_document(documentclass,documentclassopt,titlelines,body)
    }
    return '';
  }
}
module.exports = { NitrilePreviewLatex }
