'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewDiagramTikz } = require('./nitrile-preview-diagramtikz');
const { NitrilePreviewFramedTikz } = require('./nitrile-preview-framedtikz');
const { NitrilePreviewLmath } = require('./nitrile-preview-lmath');
const { cjkfontmap, cjkfontnames} = require('./nitrile-preview-cjkfontmap');
const unijson = require('./nitrile-preview-unicode');
const os = require('os');

class NitrilePreviewLatex extends NitrilePreviewTranslator {

  constructor(parser) {
    super(parser);
    this.name='LATEX';
    this.tokenizer = new NitrilePreviewLmath(this);
    this.diagram = new NitrilePreviewDiagramTikz(this);
    this.framed = new NitrilePreviewFramedTikz(this);
    this.imgs = [];
    this.flags = {};
    this.enumerate_counter = 0;
    this.unicode_symbol_map = this.tokenizer.unicode_symbol_map;
    this.unicode_mathvariant_map = this.tokenizer.unicode_mathvariant_map;
    this.icon_bullet     = '{\\textbullet}';
    this.icon_circlebox  = '\\ding{108}'                       
    this.icon_circleboxo = '\\ding{109}'                       
    this.icon_squarebox  = '\\ding{110}'                       
    this.icon_squareboxo = '\\ding{111}'                       
    this.icon_cdigits = [ '\\ding{202}', '\\ding{203}', '\\ding{204}', '\\ding{205}', '\\ding{206}', '\\ding{207}', '\\ding{208}', '\\ding{209}', '\\ding{210}', '\\ding{211}'];
    this.icon_writing_hand = '\\ding{45}';
    this.icon_folder = '{\\faFolderO}';
  }
  do_HDGS(block){
    var {hdgn,name,title,style} = block;
    var style = this.update_style_from_switches(style,'HDGS')
    var o = [];
    o.push('');
    var raw = title;
    var title = this.uncode(title,style);//note that it might have something like \jp
                                 //which is fine because the "bookmark" package 
                                 //will remove it
    var star='';
    var label = style.label||'';
    if(name == 'part'){
      o.push(`\\part{${this.uncode(title,style)}}`);
      
    }else{
      hdgn = this.name_to_hdgn(name,hdgn);
      console.log('name',name,'hdgn',hdgn,'title',`"${title}"`);
      if(hdgn==0){
        o.push(`\\chapter${star}{${title}}${this.to_latexlabelcmd(label)}`);
        if(star) o.push(`\\addcontentsline{toc}{chapter}{${raw}}`);
      }
      else if(hdgn==1){
        o.push(`\\section${star}{${title}}${this.to_latexlabelcmd(label)}`);
        if(star) o.push(`\\addcontentsline{toc}{section}{${raw}}`);
      }
      else if(hdgn==2){
        o.push(`\\subsection${star}{${title}}${this.to_latexlabelcmd(label)}`);
        if(star) o.push(`\\addcontentsline{toc}{subsection}{${raw}}`);
      }
      else if(hdgn>=3){
        o.push(`\\subsubsection${star}{${title}}${this.to_latexlabelcmd(label)}`);
      }
    }
    ///reset the enumerate counter
    this.enumerate_counter = 0;
    block.latex = o.join('\n');
  }
  do_PLST(block){
    var o = [];
    var {plitems,style} = block;
    var style = this.update_style_from_switches(style,'PLST')
    let items = this.plitems_to_items(plitems);
    o.push('');
    var bull0 = '';
    const nbsp = '~';
    //var nosep=isbroad?'':'nosep';
    var item_labels = [];
    for (var item of items) {
      var {bull,bullet,value,text,more} = item;
      text = text || '';
      text = this.uncode(text,style);
      if (bull==='OL'||bull==='UL') bull0 = bull;
      let extra_text = '';
      if(more && more.length){
        more.forEach((p) => {
          let {lines} = p;
          extra_text+=`\n\n${this.untext(lines,style).trim()}\n`;///make sure to always insert a blank line between each non-item paragraph
        });
      }
      switch (bull) {
        case 'OL': {
          o.push(`\\begin{enumerate}`);
          break;
        }
        case 'UL': {
          o.push(`\\begin{itemize}`);
          break;
        }
        case 'DL': {
          o.push(`\\begin{description}`)
          break;
        }
        case 'HL': {
          o.push(`\\begin{hanginglist}`)
          break;
        }
        case 'LI': {
          // if a '*' then we need to assign a counter that is continuous
          // from a prevous list
          if(item.type == 'A'){
            o.push(`\\item[${this.to_A_letter(item.value)}${item.ending}] ${text} ${extra_text}`)
          }else if(item.type == 'a'){
            o.push(`\\item[${this.to_a_letter(item.value)}${item.ending}] ${text} ${extra_text}`)
          }else if(item.type == 'I'){
            o.push(`\\item[${this.to_I_letter(item.value)}${item.ending}] ${text} ${extra_text}`)
          }else if(item.type == 'i'){
            o.push(`\\item[${this.to_i_letter(item.value)}${item.ending}] ${text} ${extra_text}`)
          }else if(item.value) {
            o.push(`\\item\[${item.value}${item.ending}\] ${text} ${extra_text}`);
          }else if(bullet[0]=='*'){
            value = ++this.enumerate_counter;
            o.push(`\\item\[${value}.\] ${text} ${extra_text}`);
          }else if(bullet[0]=='+'){
            item_labels.push(text);
            text = item_labels.join('\\\\')
            text = `\\parbox{\\linewidth}{${text}}`
            if(item_labels.length > 1){
              o.pop();
            }
            o.push(`\\item[${text}]~ ${extra_text}`)
            if(more.length>0){
              item_labels = [];
            }            
          }else{
            o.push(`\\item ${text} ${extra_text}`);
          }
          break;
        }
        case '/OL': {
          o.push(`\\end{enumerate}`);
          break;
        }
        case '/UL': {
          o.push(`\\end{itemize}`);
          break;
        }
        case '/DL': {
          o.push(`\\end{description}`);
          break;
        }
        case '/HL': {
          o.push(`\\end{hanginglist}`);
          break;
        }
      }
    }
    block.latex = o.join('\n');
  }
  do_SAMP(block){
    var {body,style} = block;
    var style = this.update_style_from_switches(style,'SAMP')
    var ss = body;
    if(style.samp=='framed'){
      var text = this.samp_to_framed(ss,style);
    }else {
      var text = this.samp_to_verbatim(ss,style);
    }
    block.latex = text;
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
    block.latex = o.join('\n');
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
    block.latex = o.join('\n');
  }
  do_PARA(block){
    var {title,body,style} = block;
    var style = this.update_style_from_switches(style,'PARA')
    var {caption,ss} = this.extract_body_caption(body,style);
    if(title=='equation'){
      var text = this.para_to_equation(caption,ss,style);
      block.latex = text;
    }else if(title=='listing'){
      var text = this.para_to_listing(caption,ss,style)
      block.latex = text;
    }else if(title=='figure'){
      var text = this.para_to_figure(caption,ss,style);
      block.latex = text;
    }else if(title=='table'){
      var text = this.para_to_table(caption,ss,style);
      block.latex = text;
    }else if(title=='longtable'){
      var text = this.para_to_longtable(caption,ss,style);
      block.latex = text;
    }else if(title=='columns'){
      var text = this.para_to_columns(caption,ss,style);
      block.latex = text;
    }else if(title=='vocabulary'){
      this.addto_vmap(body,block.style.vmap);
      block.latex = '';
    }else{
      var text = this.untext(body,style);
      var d = [];
      d.push('');
      d.push(text);
      text = d.join('\n');
      block.latex = text;
    }
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
  // phrase_to_XXX
  //
  phrase_to_inlinemath(s,style) {
    var s = this.tokenizer.to_lmath(s,style);
    return `\\(${s}\\)`;
  }
  phrase_to_displaymath(s,style) {
    var s = this.tokenizer.to_lmath(s,style,1);
    return `\\[${s}\\]`;
  }
  phrase_to_uncode(s,style) {
    var s = this.polish_verb(s);
    return `{\\ttfamily{}${s}}`;
  }
  phrase_to_unquote(s,style) {
    var s = this.polish_verb(s);
    return `{\\ttfamily{}\`\`${s}''}`;
  }
  phrase_to_ref (s,style) {
    // a mode consists of three properties: caption, id, fname
    if(s){
      return `\\ref{${s}}`;
    }
    return "??";
  }
  phrase_to_link(s,style) {
    if(s){
      return `\\url{${s}}`
    }
    return '??';
  }
  //
  // fence_to_XXX
  // 
  fence_to_parbox(ss,g) {
    var latex_width = this.string_to_latex_width(g.width,1,'\\linewidth');
    var text = ss.join('\n')
    var text = this.uncode(text);
    return `\\parbox{${latex_width}}{${text}}`
  }
  fence_to_math(ss,g) {
    var g = this.update_style_from_switches(g,'math');
    var str = ss.join('\n')
    let s = this.tokenizer.to_lmath(str,g);
    return `\\(${s}\\)`;
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
  fence_to_diagram(ss,g) {
    var g = this.update_style_from_switches(g,'diagram')
    var { text } = this.diagram.to_diagram(ss,g);
    if(!text) return '';
    // 'text' is a begin-end-tikzpicture 
    let width = this.string_to_latex_width(g.width,g.zoom);
    let height = this.string_to_latex_height(g.height,g.zoom);
    if(g.outline==1){
      text = `\\setlength\\fboxsep{0pt}\\fbox{${text}}`
    }
    if(width && height){
      text = `\\resizebox{${width}}{${height}}{${text}}`;
    }else if(width){
      text = `\\resizebox{${width}}{!}{${text}}`;
    }else if(height){
      text = `\\resizebox{!}{${height}}{${text}}`;
    }
    if(g.float){
      let f = (g.float == 'left') ? 'l' : 'r';
      text = `\\begin{wraptable}{${f}}{0pt}${text}\\end{wraptable}~`;
    } 
    return text;
  }
  fence_to_img(ss,g) {
    var g = this.update_style_from_switches(g,'img');
    var text = this.ss_to_includegraphics(ss,g);
    if (g.float) {
      let f = (g.float == 'left') ? 'l' : 'r';
      text = `\\begin{wraptable}{${f}}{0pt}\n${text}\n\\end{wraptable}~`;
    }else{
      // this is so that it shows up nicely aligned with
      // a picture if the next phrase is a picture
      text = `\\node[inner sep=0pt] () at (0,0) {${text}}`;
      text = `\\tikz[baseline=(current bounding box.base)]{${text}}`
    }
    return text;
  }
  fence_to_blockquote(ss,g){
    var g = this.update_style_from_switches(g,'blockquote')
    var leftmargin = this.assert_float(g.leftmargin);
    var parsep = 0;
    var s = this.join_para(ss);
    var s = this.uncode(s,g);
    var pp = [];
    pp.push({latex:s});
    var text = this.to_margined_text(pp,parsep,leftmargin);
    var text = this.to_fontsized_text(text,g);
    return text;
  }
  fence_to_verbatim(ss,g){
    var g = this.update_style_from_switches(g,'verbatim')
    var leftmargin = this.assert_float(g.leftmargin,0);
    var parsep = 0;
    var fontsize = this.assert_float(g.fontsize,);
    var fontsize = this.tokenizer.to_latex_fontsize(fontsize);
    var pp = ss.map(s => {
      s = this.polish(s);
      s = s.replace(/\s/g, "~");
      if (!s) {
        s = "~";
      }
      s = `{\\ttfamily{}${s}}`;
      return {latex:s};
    });
    var text = this.to_margined_text(pp,parsep,leftmargin);
    var text = this.to_fontsized_text(text,g);
    return text;
  }
  fence_to_tabular(ss,g) {
    var g = this.update_style_from_switches(g,'tabular');
    var title = g.title||'';
    var width = g.width||'';
    var rows = this.ss_to_tabular_rows(ss,g);
    var rows = this.update_rows_by_hrule(rows,g.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,g);
      })
    })
    let n = 1;
    if(rows.length){
      n = rows[0].length;
    }
    ///NOTE: decide if it is to use a tabularx-env or tabular-env
    var is_tabularx;
    var is_tabular;
    if(g.fr) is_tabularx = 1;
    else         is_tabular = 1;
    if(is_tabularx){
      let pcols = this.to_tabularx_pcols(n,g);
      let hsizes = this.to_tabularx_hsizes(n,g);
      let pcol = this.to_combined_pcols(pcols,g);
      let d = [];
      let latex_width = this.string_to_latex_width(width,'','\\linewidth');
      d.push(`\\begin{tabularx}{${latex_width}}{${pcol}}`);
      if(title){
        let title_text = this.uncode(title,g);
        d.push(`\\multicolumn{${n}}{c}{${title_text}}\\tabularnewline`)
      }
      if(g.head){
        var pp = rows[0];
        rows = rows.slice(1);
        if(pp.upper==2){
          d.push('\\hline')
          d.push('\\hline')
        }else if(pp.upper==1){
          d.push('\\hline')
        }
        var myapp = pp.map((x) => x.text);
        var myapp = myapp.map((x) => `\\textbf{${x}}`);
        d.push(myapp.join(' & '));
        d.push('\\tabularnewline')
        if(pp.lower==2){
          d.push('\\hline')
          d.push('\\hline')
        }else if(pp.lower==1){
          d.push('\\hline')
        }
        ///turn off the 'upper' for the upcoming body row
        if(rows.length){
          var pp = rows[0];
          pp.upper = 0;
        }
      }
      var text = this.rows_to_tabular(rows, g, hsizes);
      d.push(text);
      d.push('\\end{tabularx}')
      var text = d.join('\n')
    }
    if(is_tabular){
      let pcols = this.to_lcr_pcols(n,g);
      let pcol = this.to_combined_pcols(pcols,g);
      let d = [];
      d.push(`\\begin{tabular}{${pcol}}`);
      if(title){
        let title_text = this.uncode(title,g);
        d.push(`\\multicolumn{${n}}{c}{${title_text}}\\tabularnewline`)
      }
      if(g.head){
        var pp = rows[0];
        rows = rows.slice(1);
        if(pp.upper==2){
          d.push('\\hline')
          d.push('\\hline')
        }else if(pp.upper==1){
          d.push('\\hline')
        }
        var myapp = pp.map((x) => x.text);
        var myapp = myapp.map((x) => `\\textbf{${x}}`);
        d.push(myapp.join(' & '));
        d.push('\\tabularnewline')
        if(pp.lower==2){
          d.push('\\hline')
          d.push('\\hline')
        }else if(pp.lower==1){
          d.push('\\hline')
        }
        ///turn off the 'upper' for the upcoming body row
        if(rows.length){
          var pp = rows[0];
          pp.upper = 0;
        }
      }
      var text = this.rows_to_tabular(rows, g);
      d.push(text);
      d.push('\\end{tabular}')
      var text = d.join('\n')
    }
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
    const nbsp = '~~';
    if(g.bullet){
      try{
        let s = this.tokenizer.get_tex_symbol(g.bullet);
        bullet = s;
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
        if(!p.bull.trim().length){
          //empty CB
          p.item  = `${squareboxo}`;
          p.latex = `${p.text}`;
        }
        else{
          //filled CB
          p.item  = `${squarebox}`;
          p.latex = `${p.text}`;
        }
      }
      else if(p.type == 'RB'){
        if(!p.bull.trim().length){
          //empty RB
          p.item  = `${circleboxo}`;
          p.latex = `${p.text}`;
        }
        else{
          p.item  = `${circlebox}`;
          p.latex = `${p.text}`;
        }
      }
      else{
        ///for other types, the hangindent is not set
        p.item = `${bullet}`
        p.latex = `${p.text}`;
      }
    });
    var leftmargin = '';
    var parsep = 0;
    var text = this.to_margined_text(itms,parsep,leftmargin,g);
    var text = this.to_fontsized_text(text,g);
    return text;
  }
  fence_to_colorbutton(ss,g){
    var g = this.update_style_from_switches(g,'colorbutton')
    var s = ss[0]||'';
    if(s){
      var ss = [];
      ss.push(`viewport 1 1`);
      ss.push(`fill {fillcolor:${s}} &rectangle{(0,0),1,1}`);
      var { text } = this.diagram.to_diagram(ss,g);
      if(text){
        // 'text' is a begin-end-tikzpicture 
        let width = this.string_to_latex_width(g.width,g.zoom);
        let height = this.string_to_latex_height(g.height,g.zoom);
        if(g.outline==1){
          text = `\\setlength\\fboxsep{0pt}\\fbox{${text}}`
        }
        if(width && height){
          text = `\\resizebox{${width}}{${height}}{${text}}`;
        }else if(width){
          text = `\\resizebox{${width}}{!}{${text}}`;
        }else if(height){
          text = `\\resizebox{!}{${height}}{${text}}`;
        }
        s = text;
      }
    }
    return s;
  }
  //////////////////////////////////////////////////////////////
  /// samp   
  //////////////////////////////////////////////////////////////
  samp_to_framed(ss,style){
    ss = this.trim_samp_body(ss);
    var text = this.ss_to_framed(ss,style);
    var o = [];
    if(0){
      o.push('');
      o.push(`\\begin{flushleft}`)
      o.push(text);
      o.push(`\\end{flushleft}`)
      return o.join('\n');
    }else{
      var pp = [];
      pp.push({latex:text});
      var leftmargin = this.assert_float(style.leftmargin);
      var parsep = 0;
      var text = this.to_margined_text(pp,parsep,leftmargin,style);
      return text;
    }
  }
  samp_to_verbatim(ss,style){
    ss = this.trim_samp_body(ss);
    var o = [];
    o.push('');
    ss = ss.map(s => {
      if (!s) {
        s = "~";
      }else{
        s = this.polish(s);
        if(style.rubify){
          s = this.rubify(s,style.vmap);
        }
        s = s.replace(/\s/g, "~");
        s = `{\\ttfamily{}${s}}`;
      }
      return s;
    });
    if(0){
      var text = ss.join('\\\\\n');
      o.push('');
      o.push(`\\begin{flushleft}`)
      o.push(text);
      o.push(`\\end{flushleft}`)
      return o.join('\n');
    }else{
      var pp = ss.map(x => ({latex:x}));
      var leftmargin = this.assert_float(style.leftmargin);
      var parsep = 0;
      var text = this.to_margined_text(pp,parsep,leftmargin,style);
      return text;
    }
  }
  ///
  /// para
  ///
  para_to_equation(caption,ss,style){
    var style = this.update_style_from_switches(style,'equation')
    let text = this.tokenizer.to_lmath(ss.join('\n'),style);
    let label = style.label||'';
    if(label=='none'){
      label = '';
    }
    if(label.length){
      text = `\\label{${label}}\n${text}`;
    }else{
      text = `\\notag\n${text}`;
    }
    if(label.length){
      text = `\\begin{eqnarray}\n${text}\n\\end{eqnarray}`
    }else{
      text = `\\begin{eqnarray*}\n${text}\n\\end{eqnarray*}`
    }
    return text;
  }
  para_to_figure(caption,ss,style){
    var o = [];
    var style = this.update_style_from_switches(style,'figure')
    if(style.subfigure){
      let itms = this.ss_to_figure_itms(ss,style);
      itms.forEach((p,i,arr) => {
        var {type,ss,g,sub} = p;
        p.sub = this.uncode(sub,style);
        if(type=='diagram'){
          p.img = this.fence_to_diagram(ss,g);
        }else if(type=='framed'){
          p.img = this.fence_to_framed(ss,g);
        }else if(type=='img'){
          p.img = this.fence_to_img(ss,g); 
        }else{
          p.img = '\\\\';
        }
      });
      while (itms.length) {
        let p = itms[0];
        itms = itms.slice(1);
        if(p.img=='\\\\'){
          o.push('\\\\');
        }else{
          o.push(`\\subfigure[{${p.sub}}]{${p.img}}`)
        }
      }
      var text = o.join('\n');
    }else{
      var text = this.untext(ss,style);
    }
    var o = [];
    if(style.wide==1){
      o.push(`\\begin{figure*}[ht]`);  
    }else{
      o.push(`\\begin{figure}[ht]`);
    }
    o.push(`\\centering`);
    if(caption){
      var caption_text = this.uncode(caption,style);
      o.push(`\\caption{${caption_text}}`);
    }else{
      o.push(`\\caption{}`);
    }
    if(style.label){
      o.push(`\\label{${style.label}}`);
    }
    o.push(text);
    if(style.wide==1){
      o.push(`\\end{figure*}`);
    }else{
      o.push(`\\end{figure}`);
    }
    text = o.join('\n');
    return text;
  }
  para_to_table(caption,ss,style){
    var style = this.update_style_from_switches(style,'table')
    var text = this.fence_to_tabular(ss,style);
    let o = [];
    o.push('');
    if(style.wide==1){
      o.push(`\\begin{table*}[ht]`)
    }else{
      o.push(`\\begin{table}[ht]`);
    }
    o.push(`\\centering`);
    if(caption){
      var caption_text = this.uncode(caption,style);
      o.push(`\\caption{${caption_text}}`);
    }else{
      o.push(`\\caption{}`);
    }
    if (style.label) {
      o.push(`\\label{${style.label}}`);
    }
    o.push(text);
    if(style.wide==1){
      o.push(`\\end{table*}`);
    }else{
      o.push(`\\end{table}`);
    }
    text = o.join('\n');
    return text;
  }
  para_to_longtable(caption,ss,style){
    var style = this.update_style_from_switches(style,'longtable')
    var rows = this.ss_to_tabular_rows(ss,style);
    var rows = this.update_rows_by_hrule(rows,style.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,style);
      })
    })    
    var n = 1;
    if(rows.length){
      n = rows[0].length;
    }
    var d = [];
    var pcols = this.to_longtabu_pcols(n,style);
    var pcol = this.to_combined_pcols(pcols,style);
    d.push('');
    d.push(`\\begin{fakelongtable}`)
    d.push(`\\begin{longtabu} to \\linewidth {${pcol}}`)
    var caption_text = this.uncode(caption,style);
    if(style.caption && style.label){
      d.push(`\\caption{${caption_text}}`);
      d.push(`\\label{${style.label}}`);
      d.push(`\\tabularnewline`)
    }else if(caption){
      d.push(`\\caption{${caption_text}}`);
      d.push(`\\tabularnewline`)
    }else if(style.label){
      d.push(`\\caption{}`);
      d.push(`\\label{${style.label}}`);
      d.push(`\\tabularnewline`)
    }else{
      d.push(`\\caption{}`);
      d.push(`\\tabularnewline`)
    }
    // see if we need to add a \\endhead
    if(style.head){
      if(rows.length){
        var pp = rows[0];
        rows = rows.slice(1);
        if(pp.upper==2){
          d.push('\\hline')
          d.push('\\hline')
        }else if(pp.upper==1){
          d.push('\\hline')
        }
        var myapp = pp.map((x) => x.text);
        var myapp = myapp.map((x) => `\\textbf{${x}}`);
        d.push(myapp.join(' & '));
        d.push('\\tabularnewline')
        if(pp.lower==2){
          d.push('\\hline')
          d.push('\\hline')
        }else if(pp.lower==1){
          d.push('\\hline')
        }
      }
      ///turn off the 'upper' for the upcoming body row
      if(rows.length){
        var pp = rows[0];
        pp.upper = 0;
      }
      d.push('\\endhead');
    }
    // see if we need to add a \\endfoot
    if(style.foot){
      if(rows.length){
        var pp = rows.slice(-1);
        rows = rows.pop();
        if(pp.upper==2){
          d.push('\\hline')
          d.push('\\hline')
        }else if(pp.upper==1){
          d.push('\\hline')
        }
        var myapp = pp.map((x) => x.text);
        var myapp = myapp.map((x) => `\\textbf{${x}}`);
        d.push(myapp.join(' & '));
        d.push('\\tabularnewline')
        if(pp.lower==2){
          d.push('\\hline')
          d.push('\\hline')
        }else if(pp.lower==1){
          d.push('\\hline')
        }
        ///turn off the 'lower' for the last body row
        if(rows.length){
          var pp = rows[rows.length-1];
          pp.lower = 0;
        }
      }
      d.push('\\endfoot')
    }
    var text = this.rows_to_tabular(rows,style);
    d.push(text);
    d.push('\\end{longtabu}')
    d.push(`\\end{fakelongtable}`)
    text = d.join('\n')
    return text;
  }
  para_to_listing(caption,ss,style){
    var style = this.update_style_from_switches(style,'listing')
    let opts = [];
    if(caption){
      var caption_text = this.uncode(caption,style);
      opts.push(`caption={${caption_text}}`);///when caption is empty the Listing: won't show
    }
    if(style.label){
      opts.push(`label={${style.label}}`);
    }
    opts.push(`basicstyle={\\ttfamily\\footnotesize}`)
    opts = opts.join(',');
    let o = [];
    o.push('');
    o.push(`\\begin{lstlisting}[${opts}]`);
    ss.forEach(x => o.push(x));
    o.push(`\\end{lstlisting}`);
    var text = o.join('\n');
    return text;
  }
  para_to_columns(caption,ss,style){
    var style = this.update_style_from_switches(style,'columns')
    var text = this.untext(ss,style);
    var d = [];
    d.push('');
    d.push(`\\begin{multicols}{2}`);
    d.push(text);
    d.push('\\end{multicols}');
    var text = d.join('\n');
    return text;
  }
  ///
  /// text typefaces
  ///
  text_to_typeface (type,cnt,cnt2) {
    ///NOTE: do not need to uncode cnt or cnt2
    type = type || '';
    switch (type) {
      case 'verb': {
        return `\\,{}\\texttt{${cnt}}\\,{}`;
        break;
      }
      case 'code': {
        return `\\texttt{${cnt}}`
        break;
      }
      case 'em': {
        return `\\emph{${cnt}}`
        break;
      }
      case 'b': {
        return `\\textbf{${cnt}}`
        break;
      }
      case 'i': {
        return `\\textit{${cnt}}`
        break;
      }
      case 'u': {
        return `\\underline{${cnt}}`
        break;
      }
      case 'tt': {
        return `\\texttt{${cnt}}`
        break;
      }
      case 'overstrike': {
        return `\\sout{${cnt}}`
        break;
      }
      case 'var': {
        return `\\textsl{${cnt}}`
        break;
      }
      case 'br': {
        return `\\newline{}`
        break;
      }
      case 'frac': {
        cnt2 = cnt2||'\\textquestiondown';
        return `\\begin{tabular}{@{}c@{}}{${cnt}}\\\\\\hline{${cnt2}}\\end{tabular}`;
        break;
      }
      case 'sup': {
        return `\\textsuperscript{${cnt}}`;
        break;
      }
      case 'sub': {
        return `\\raisebox{-0.4ex}{\\scriptsize{}${cnt}}`;
        break;
      }
      case 'columnbreak': {
        return `\\columnbreak{}`;
        break;
      }
      case 'qquad': {
        return `\\qquad{}`;
        break;
      }
      default: {
        return `${cnt}`
        break;
      }
    }
  }

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
  translate_to_ruby(items){
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
  to_lcr_pcols(n,style) {
    /// \begin{tabular}{lcr}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var pcols = this.string_to_array(style.halign||'');
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
  to_combined_pcols(pcols,style){
    var n = pcols.length;
    var vbars =  this.vrule_to_vbars(n,style.vrule);
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
  fontify_latex_cjk (text) {
    ///
    /// fontify in the style of Latex
    ///

    //const fontnames = ['jp','tw','cn','kr'];
    var newtext = '';
    var s0 = '';
    var fns0 = 0;
    var a0 = '';
    var fn0 = '';

    for (var j=0; j < text.length; ++j) {

      var c = text[j];
      var cc = text.codePointAt(j);

      //if (cc >= 256 && cc <= 0xFFFF) {
      if(this.is_cjk_cc(cc)){
        var fns = cjkfontmap[cc];
      } else {
        var fns = 0;
      }

      ///console.log('c=',c,'cjk=',this.is_cjk_cc(cc))

      // buildup ASCII text
      if(fns == 0 && fns0 == 0){
        a0 += c;
        continue;
      } else {
        if (fns0 == 0) {
          fns0 = fns;
        }
      }

      // flush ASCII text
      if(a0){
        newtext += `${a0}`;
        a0 = '';
      } 

      /// check to see if this char has the same font as the last one
      var fns0 = fns0 & fns; /// bitwise-AND
      if (fns0) {
        /// get the first font: assign 'k' according to the followin rules:
        ////  0b0001 => 0, 0b0010 => 1; 0b0011 => 0; 0b0100 => 2
        var k = 0;
        for (k=0; k < cjkfontnames.length; ++k) {
          if (fns0 & (1 << k)) {
            break;
          }
        }
        var fn0 = cjkfontnames[k];
        s0 += c;
        continue
      }

      /// by the time we get here the 'c' is either a CJK that does
      //// not agree with previous character in terms of the same font;
      //// or 'c' is not a CJK at all.
      if(1){
        //newtext += `{\\${fn0}{${s0}}}`;
        newtext += this.lang_to_cjk(s0,fn0);
      }else{
        newtext += s0;
      }
      fns0 = 0;
      s0 = '';
      fn0 = '';

      /// it is CJK if 'fns' is not zero
      if (fns) {
        /// get the first font: assign 'k' according to the followin rules:
        ////  0b0001 => 0, 0b0010 => 1; 0b0011 => 0; 0b0100 => 2
        var k = 0;
        for (k=0; k < cjkfontnames.length; ++k) {
          if (fns & (1 << k)) {
            break;
          }
        }
        /// pick a font name
        fns0 = fns;
        fn0 = cjkfontnames[k];
        s0 = c;
        continue;
      }

      /// we get here if the 'c' is not a CJK
      a0 += c; // add to a0
    }

    if(a0){
      newtext += `${a0}`;
    } else if (s0){
      if(1){
        //newtext += `{\\${fn0}{${s0}}}`;
        newtext += this.lang_to_cjk(s0,fn0);
      }else{
        newtext += s0;
      }
    }
    return newtext;
  }

  polish_verb(unsafe){
    unsafe = this.polish(unsafe);
    unsafe = unsafe.replace(/\s/g, "~")
    return unsafe;
  }

  polish(unsafe){
    unsafe = ''+unsafe;
    unsafe = unsafe.replace(/’/g, "\0char39\0")
    unsafe = unsafe.replace(/“/g, "\0char34\0")
    unsafe = unsafe.replace(/”/g, "\0char34\0")
    unsafe = unsafe.replace(/"/g, "\0char34\0")
    unsafe = unsafe.replace(/\|/g, "\0char124\0")
    unsafe = unsafe.replace(/\*/g, "\0char42\0")
    unsafe = unsafe.replace(/~/g, "\0char126\0")
    unsafe = unsafe.replace(/</g, "\0char60\0")
    unsafe = unsafe.replace(/>/g, "\0char62\0")
    unsafe = unsafe.replace(/\[/g, "\0char91\0")
    unsafe = unsafe.replace(/\]/g, "\0char93\0")
    unsafe = unsafe.replace(/\*/g, "\0char36\0")
    unsafe = unsafe.replace(/#/g, "\0char35\0")
    unsafe = unsafe.replace(/&/g, "\0char38\0")
    unsafe = unsafe.replace(/%/g, "\0char37\0")
    unsafe = unsafe.replace(/\$/g, "\0char36\0")
    unsafe = unsafe.replace(/_/g, "\0char95\0") 
    unsafe = unsafe.replace(/\^/g, "\0char94\0")
    unsafe = unsafe.replace(/\{/g, "\0char123\0")
    unsafe = unsafe.replace(/\}/g, "\0char125\0")
    unsafe = unsafe.replace(/\\/g, "\0char92\0")
    unsafe = unsafe.replace(/\0(.*?)\0/g, (match, p1) => {
      return `{\\${p1}}`;
    })
    if(1){
      ///replace unicode
      let new_unsafe = '';
      for(let c of unsafe){
        let cc = c.codePointAt(0);
        if(this.unicode_symbol_map.has(cc)){
          let s = this.unicode_symbol_map.get(cc).tex;
          new_unsafe += s;
        }else if(this.unicode_mathvariant_map.has(cc)){
          let s = this.unicode_mathvariant_map.get(cc).tex;
          new_unsafe += `\\ensuremath{${s}}`;
        }else{
          new_unsafe += c;
        }
      }
      unsafe = new_unsafe;
    }
    if(this.conf('latex.cjk','','string')=='1'){
      unsafe = this.fontify_latex_cjk(unsafe);
    }
    return unsafe;
  }

  smooth (unsafe) {

    var T1 = String.fromCharCode(0x1); // caret
    var T2 = String.fromCharCode(0x2); // underscore
    var T3 = String.fromCharCode(0x3); // left-brace
    var T4 = String.fromCharCode(0x4); // right-brace
    var T5 = String.fromCharCode(0x5); // backslash  
    var T6 = String.fromCharCode(0x6); // dollar-sign
    var T7 = String.fromCharCode(0x7); // \text{}
    var T8 = String.fromCharCode(0x8); // \text{}
    unsafe = '' + unsafe; /// force it to be a string when it can be a interger
    unsafe = unsafe.replace(this.re_all_diacritics, (match,p1,p2) => {
          // a~dot, a~ddot    
          return `${T6}\0${p2}${T3}${p1}${T4}\0${T6}`;
      })
    unsafe = unsafe.replace(this.re_all_mathvariants, (match,p1,p2) => {
          // a~mathbf, a~mathbb    
          return `${T6}\0${p2}${T3}${p1}${T4}\0${T6}`;
      })
    unsafe = unsafe.replace(this.re_all_symbols, (match,p1) => {
          // symbol
          try{
            var v = this.tokenizer.get_tex_symbol(p1);
            v = v.replace(/\$/g,T6).replace(/\\/g,T5).replace(/\{/g,T3).replace(/\}/g,T4).replace(/\^/g,T1).replace(/_/g,T2);
            return v;
          }catch(e){
            return match;
          }
      })
    unsafe = unsafe.replace(this.re_all_symbol_comments, (match,p1) => {
          // symbol
          try{
            var v = this.tokenizer.get_symbol_comment(p1);
            return v;
          }catch(e){
            return match;
          }
      })
    unsafe = unsafe.replace(/"/g,     "\0char34\0")
    unsafe = unsafe.replace(/\|/g,    "\0char124\0")
    unsafe = unsafe.replace(/\*/g,    "\0char42\0")
    unsafe = unsafe.replace(/~/g,     "\0char126\0")
    unsafe = unsafe.replace(/</g,     "\0char60\0")
    unsafe = unsafe.replace(/>/g,     "\0char62\0")
    unsafe = unsafe.replace(/\[/g,    "\0char91\0")
    unsafe = unsafe.replace(/\]/g,    "\0char93\0")
    unsafe = unsafe.replace(/\*/g,    "\0char36\0")
    unsafe = unsafe.replace(/#/g,     "\0char35\0")
    unsafe = unsafe.replace(/&/g,     "\0char38\0")
    unsafe = unsafe.replace(/%/g,     "\0char37\0")
    unsafe = unsafe.replace(/\$/g,    "\0char36\0")
    unsafe = unsafe.replace(/_/g,     "\0char95\0") 
    unsafe = unsafe.replace(/\^/g,    "\0char94\0")
    unsafe = unsafe.replace(/\{/g,    "\0char123\0")
    unsafe = unsafe.replace(/\}/g,    "\0char125\0")
    unsafe = unsafe.replace(/\\/g,    "\0char92\0")
    unsafe = unsafe.replace(/⁻¹/g,    `\0textsuperscript${T3}-1${T4}\0`)
    unsafe = unsafe.replace(/⁻²/g,    `\0textsuperscript${T3}-2${T4}\0`)
    unsafe = unsafe.replace(/⁻³/g,    `\0textsuperscript${T3}-3${T4}\0`)
    unsafe = unsafe.replace(/¹/g,     `\0textsuperscript${T3}1${T4}\0`)
    unsafe = unsafe.replace(/²/g,     `\0textsuperscript${T3}2${T4}\0`)
    unsafe = unsafe.replace(/³/g,     `\0textsuperscript${T3}3${T4}\0`)
    unsafe = unsafe.replace(/\0(.*?)\0/g, (match,p1) => {
          return `{\\${p1}}`;
      })
    unsafe = unsafe.replace(/\01/g,'^')
    unsafe = unsafe.replace(/\02/g,'_')
    unsafe = unsafe.replace(/\03/g,'{')
    unsafe = unsafe.replace(/\04/g,'}')
    unsafe = unsafe.replace(/\05/g,'\\')
    unsafe = unsafe.replace(/\06/g,'$')
    unsafe = unsafe.replace(/\07/g,'\\text\{')
    unsafe = unsafe.replace(/\010/g,'\}')
    if(1){
      let new_unsafe = '';
      for(let c of unsafe){
        let cc = c.codePointAt(0);
        if(this.unicode_symbol_map.has(cc)){
          let s = this.unicode_symbol_map.get(cc).tex;
          new_unsafe += s;
        }else if(this.unicode_mathvariant_map.has(cc)){
          let s = this.unicode_mathvariant_map.get(cc).tex;
          new_unsafe += `\\ensuremath{${s}}`;
        }else{
          new_unsafe += c;
        }
      }
      unsafe = new_unsafe;
    }
    if(this.conf('latex.cjk','','string')=='1'){
      unsafe = this.fontify_latex_cjk(unsafe);
    }    
    return unsafe;
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
  to_latex_program() {
    let latex_program = this.conf('latex.program');
    if(latex_program=='lualatex'){
      return 'lualatex';
    }else if(latex_program=='xelatex'){
      return 'xelatex';
    }else{
      return 'pdflatex';
    }
  }
  to_geometry_layout(latex_program){
    if (this.conf('latex.geometry')) {
      var s = this.conf('latex.geometry');
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
      if(this.conf('latex.cjk','','string')=='1'){
        all.push(`\\usepackage[overlap,CJK]{ruby}`);
        all.push(`\\renewcommand\\rubysep{0.05ex}`);
      }
    }
    /// 'xelatex' and 'latex.xecjk'
    else if(latex_program=='xelatex' && this.conf('latex.xecjk')){
      ///mainfont, sansfont, and monofont
      /// \setCJKmainfont{UnGungseo.ttf}
      /// \setCJKsansfont{UnGungseo.ttf}
      /// \setCJKmonofont{gulim.ttf}
      all.push(`\\usepackage[utf8]{inputenc}`);
      all.push(`\\usepackage{fontspec}`);
      all.push(`\\usepackage{xecjk}`);
      var p_mainfont = this.conf('latex.xecjk.mainfont');
      var p_sansfont = this.conf('latex.xecjk.sansfont');
      var p_monofont = this.conf('latex.xecjk.monofont');
      if (p_mainfont) { p_mainfont = `\\setCJKmainfont{${p_mainfont}}`; }
      if (p_sansfont) { p_sansfont = `\\setCJKsansfont{${p_sansfont}}`; }
      if (p_monofont) { p_monofont = `\\setCJKmonofont{${p_monofont}}`; }
      var p = [p_mainfont, p_sansfont, p_monofont];
      p = p.filter(x => x.length);
      all = all.concat(p);
      ///extra fonts
      var ss = this.conf('latex.xecjk.fonts');
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
        if(this.conf('latex.cjk','','string')=='1'){
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
      if(this.conf('latex.cjk','','string')=='1'){
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
    all.push(`\\usepackage{fontawesome}`);
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
    all.push(`\\usepackage{longtable,tabu}`);
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
    let s = this.conf('latex.extrapackage');
    if (s) {
      let ss = s.split('\n');
      return ss.join('\n');
    }
    return '';
  }
  to_latex_parskippackage(latex_program){
    let features = this.conf('latex.features');
    if(this.string_has_item(features,'parskip')){
      return `\\usepackage{parskip}`
    }
    return '';
  }
  to_latex_postsetup(latex_program){
    let s = this.conf('latex.postsetup');
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
    var latex_program = this.to_latex_program();
    if(latex_program === 'pdflatex'){
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
      return `{\\${fn}{${s}}}`
    }
    return s;
  }
  to_latex_document() {
    this.translate();
    ///start putting them together
    var top = this.to_top_part(this.parser.blocks);
    var tex = this.to_report(top);
    var titlelines = this.to_titlelines();
    var toclines = this.to_toclines();
    //required setups
    var p_latex_program = this.to_latex_program();
    var p_documentclass = this.to_documentclass();
    var p_documentclassopt = this.to_documentclassopt();
    var p_core_packages = this.to_core_packages(p_latex_program);
    var p_extra_packages = this.to_latex_extrapackage(p_latex_program);
    var p_parskip_packages = this.to_latex_parskippackage(p_latex_program);
    var p_geometry_layout = this.to_geometry_layout(p_latex_program);
    var p_post_setups = this.to_latex_postsetup(p_latex_program);
    return     `\
%!TeX program=${p_latex_program}
\\documentclass[${p_documentclassopt}]{${p_documentclass}}
${p_core_packages}
${p_extra_packages}
${p_parskip_packages}
${p_geometry_layout}
${p_post_setups}
\\begin{document}
${titlelines.join('\n')}
${titlelines.length?'\\maketitle':''}
${toclines.join('\n')}
${tex}
\\end{document}
`;
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
    return this.conf('latex.documentclass', 'article');
  }
  to_documentclassopt() {
    return this.conf('latex.documentclassopt','','list',',');
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
    if(this.conf('latex.toc')){
      toclines.push(`\\tableofcontents`);
    } 
    return toclines;
  }
  get_leftmargin(ptype){
    var key = `latex.${ptype}`;
    var val = this.conf(key,'');
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
  ss_to_diagram(ss,style){
    var { text } = this.diagram.to_diagram(ss,style);
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
  ss_to_includegraphics(ss,style){
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
  to_margined_text(pp,parsep,leftmargin){
    let d = [];
    if(pp.length){
      if(typeof leftmargin==='number'){
        d.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{${parsep}pt}\\setlength\\leftmargin{${leftmargin}mm}}`);
      }else{
        d.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{${parsep}pt}}`);
      }
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
}
module.exports = { NitrilePreviewLatex }
