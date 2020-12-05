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
    this.my_diagram_ss_maps = new Map();
    this.unicode_symbol_map = this.tokenizer.build_unicode_symbol_map();
  }
  do_start_translate(){
  }
  do_end_translate(){
  }
  do_PART(block){
    var {title} = block;
    var o = [];
    o.push('');
    var title = this.unmask(title);//note that it might have something like \jp
                                 //which is fine because the "bookmark" package
                                 //will remove it
    o.push(`\\part{${title}}`);
    block.latex = o.join('\n');
  }
  do_HDGS(block){
    var {hdgn,title,name,subn,label,style} = block;
    var o = [];
    o.push('');
    var raw = title;
    var title = this.unmask(title);//note that it might have something like \jp
                                 //which is fine because the "bookmark" package 
                                 //will remove it
    //note that 'subn' and 'hdgn' are guarrenteed to be integers
    subn = subn||0;
    var level = +hdgn + subn;
    var star='';
    if(level==0){
      if(name=='chapter'){              
        o.push(`\\chapter${star}{${title}}${this.to_latexlabelcmd(label)}`);
        if(star) o.push(`\\addcontentsline{toc}{chapter}{${raw}}`);
      }else{
        o.push(`\\begin{flushleft}`);
        o.push(`\\noindent{\\huge ${title}}`);
        o.push(`\\end{flushleft}`);
      }
    }
    else if(level==1){
      o.push(`\\section${star}{${title}}${this.to_latexlabelcmd(label)}`);
      if(star) o.push(`\\addcontentsline{toc}{section}{${raw}}`);
    }
    else if(level==2){
      o.push(`\\subsection${star}{${title}}${this.to_latexlabelcmd(label)}`);
      if(star) o.push(`\\addcontentsline{toc}{subsection}{${raw}}`);
    }
    else{
      o.push(`\\subsubsection${star}{${title}}${this.to_latexlabelcmd(label)}`);
    }
    ///reset the enumerate counter
    this.enumerate_counter = 0;
    block.latex = o.join('\n');
  }
  do_PLST(block){
    var o = [];
    var {plitems} = block;
    let items = this.plitems_to_items(plitems);
    o.push('');
    var bull0 = '';
    const nbsp = '~';
    //var nosep=isbroad?'':'nosep';
    for (var item of items) {
      var {bull,bullet,br,value,text,keys,more} = item;
      text = text || '';
      if (bull==='OL'||bull==='UL') bull0 = bull;
      let extra_text = '';
      if(more && more.length){
        more.forEach((p) => {
          let {lines} = p;
          extra_text+=`\n\n${this.untext(lines).trim()}`;///make sure to always insert a blank line between each non-item paragraph
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
        case 'LI': {
          if (bullet[0]=='+'){
            text = this.unmask(text);
            keys = keys.map(({key,cat}) => {
              key = this.polish(key);
              if (cat == 'tt') {
                key = `\`\\texttt{${key}}'`;
              }
              if (cat == 'i') {
                key = `\\textsl{${key}}`
              }
              if (cat == 'b') {
                key = `\\textbf{${key}}`
              }
              return key;
            });
            if(text){
              text = `\\hfill\\\\${text}`;
            }else{
              text = `\\hfill`;
            }
            o.push(`\\item[${keys.join(', ')}] ${text} \n\n${extra_text}`);
          } else {
            text = this.unmask(text);
            if(keys){
              keys = keys.map(({key,cat}) => {
                key = this.polish(key);
                if (cat == 'tt') {
                  key = `\`\\texttt{${key}}'`;
                }
                if (cat == 'i') {
                  key = `\\textsl{${key}}`
                }
                if (cat == 'b') {
                  key = `\\textbf{${key}}`
                }
                return key;
              });
              if(br){
                text = `${keys.join(', ')}: \\hfill\\break\n${nbsp} ${text}`;
              }else{
                text = `${keys.join(', ')}: ${nbsp} ${text}`;
              }
            }
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
            }else{
              o.push(`\\item ${text} ${extra_text}`);
            }
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
      }
    }
    block.latex = o.join('\n');
  }
  do_BULL(block){
    var {hdgn,plitems} = block;
    var num = 0;
    var pp = plitems.map(plitem => {
      let text = plitem.body.join('\n');
      text = this.unmask(text);
      if(hdgn=='--'){
        text = `\\textbullet{}~~${text}`
      }else if(hdgn=='**'){
        text = `${++num}.~~${text}`;
      }
      return text;
    });
    ///do nothing
    var o = [];
    o.push('');
    o.push(`\\noindent`)
    o.push(pp.join('\\hfill\\break{}\n'))
    block.latex = o.join('\n');
  }
  do_SAMP(block){
    var {id,row1,row2,sig,body} = block;
    body = this.trim_samp_body(body);
    var o = []; 
    var o = [];
    o.push('');
    body = body.map(s => {
      s = this.polish(s);
      s = s.replace(/\s/g, "~");
      if (!s) {
        s = "~";
      }
      s = `{\\ttfamily{}${s}}`;
      return s;
    });
    var text = body.join('\\hfill\\break\n');
    o.push(`\\begin{quote}`);
    o.push(text);
    o.push('\\end{quote}')
    block.latex = o.join('\n');
  }
  do_HRLE(block){
    var o = [];
    var {id,row1,row2,sig,title} = block;
    o.push('');
    title = this.unmask(title);
    o.push(`\\begin{center}`);
    o.push(`\\rule{0.75\\linewidth}{0.5pt}`);
    o.push(`\\end{center}`);
    block.latex = o.join('\n');
  }
  do_PRIM(block){
    var o = [];
    var {hdgn,title,body} = block;
    o.push('');
    var v;
    const indent = '~'.repeat(5);
    title = this.unmask(title);
    let s0 = body[0]||'';
    let text = this.unmask(body.join('\n'));///cannot use this.join_para() because of the potential ```math and sort that needs line separation
    if (hdgn===0) {
      text = `\\paragraph{${title}} ${text}`;
      o.push(`${text}`);
    }
    else if (hdgn===1) {
      text = `{\\bfseries{}${title}} ${s0 ? '' : '~'} ${text}`;
      o.push(`\\bigskip`);
      o.push(`\\noindent ${text}`);
    } 
    else if (hdgn===2) {
      text = `{\\bfseries\\itshape{}${title}} ${s0 ? '' : '~'} ${text}`;
      o.push(`\\bigskip`);
      o.push(`\\noindent ${text}`);
    } 
    else {
      text = `{\\bfseries\\itshape{}${title}} ${s0 ? '' : '~'} ${text}`;
      o.push(`\\bigskip`);
      o.push(`\\noindent ${indent}${text}`);
    }
    block.latex = o.join('\n');
  }
  do_TEXT(block){
    var {body,style} = block;
    let text = this.untext(body,style);
    if(style.flushleft){
      text = text.trim();
      var o = [];
      o.push('');
      o.push('\\begin{flushleft}')
      o.push(text);
      o.push('\\end{flushleft}')
      text = o.join('\n');
    }
    if(this.flags.nspace && style.nspace){
      text = text.trim();
      var o = [];
      o.push('');
      o.push('\\begin{quote}')
      o.push(text);
      o.push('\\end{quote}')
      text = o.join('\n');
    }
    if(1){
      text = text.trim();
      var o = [];
      o.push('');
      o.push(text);
      text = o.join('\n');      
    }
    block.latex = text;
  }
  phrase_to_ref (label) {
    let g = this.search_refmap(label);
    if(g){
      var { sig, name } = g;
      var secsign = String.fromCharCode(0xA7);
      if(sig=='HDGS'){
        return `\\ref{${label}}`;
      }
      return `\\ref{${label}}`;
    }
    return this.text_to_typeface(label,'overstrike');
  }
  do_dia (cnt) {
    var lines = cnt.split(';;');
    lines = lines.map(x => x.trim());
    this.diagram.is_dia = 1;
    var {s,xm,ym,unit,definedcolors} = this.diagram.to_diagram(lines);
    this.diagram.is_dia = 0;
    var d = [];
    if(definedcolors.length){
      d.push(definedcolors.join('\n'));
    }
    d.push('\\begin{tikzpicture}');
    d.push(s);
    d.push('\\end{tikzpicture}')
    var text = d.join('\n');
    return text;
  }
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
  phrase_to_math(text,style) {
    var s = this.tokenizer.to_lmath(text,style);
    return `${s}`;
  }
  to_formula_math_array(text,style) {
    var d = this.tokenizer.to_lmath_array(text,style);
    return d;
  }
  phrase_to_uri(cnt) {
    return `\\url{${cnt}}`
  }
  fence_to_vbox(ss,style){
    var o = [];
    var text = ss.join('\n');
    var text = this.unmask(text);
    if(style.width){
      var width = this.string_to_latex_width(style.width)
    }else{
      var width = '\\linewidth'
    }
    o.push(`\\begin{minipage}{${width}}`);
    o.push(text);
    o.push(`\\end{minipage}`)
    text = o.join('\n')
    return text;
  }
  fence_to_verbatim(ss,style){
    var glue = parseInt(style.glue) || 0;
    var o = [];
    ss = ss.map(s => {
      s = this.polish(s);
      s = s.replace(/\s/g, "~");
      if (!s) {
        s = "~";
      }
      s = `{\\ttfamily{}${s}}`;
      return s;
    });
    var text = ss.join('\\\\');
    o.push(`\\tabulinesep = ${glue}pt`);
    o.push(`\\begin{tabu}{@{}l@{}}`);
    o.push(text);
    o.push('\\end{tabu}')
    return o.join('\n')
  }
  fence_to_diagram(ss,style){
    let text = this.ss_to_diagram(ss,style);
    if(1){
      let o = [];
      text = text.trim();
      o.push('')
      o.push('\\begin{tabular}{@{}l@{}}')
      o.push(text);
      o.push('\\end{tabular}')
      text = o.join('\n');
    }
    return text;
  }
  ss_to_diagram(ss,style){
    if (style.load) {
      let name0 = style.load;
      if (this.my_diagram_ss_maps.has(name0)) {
        let ss0 = this.my_diagram_ss_maps.get(name0);
        ss = ss0.concat(ss);
      }
    }
    if (style.save) {
      this.my_diagram_ss_maps.set(style.save, ss);
    }
    var { s } = this.diagram.to_diagram(ss,style);
    return s;
  }
  fence_to_framed(ss,style){
    var {s} = this.framed.to_framed(ss,'100%');
    return s;
  }
  fence_to_math(ss, style) {
    let line = this.make_line(ss,style);
    return `\\(${line}\\)`;
  }
  phrase_to_img(cnt) {
    let g = this.string_to_style(cnt);
    if(g.src){
      let src = g.src;
      this.imgs.push(src);
      let my_opt = [];
      var zoom = parseFloat(g.zoom);
      if(!Number.isFinite(zoom)){
        zoom = 1;
      }
      if(g.width && g.aspectratio){
        let width = this.string_to_latex_width(g.width,zoom);
        let height = this.string_to_latex_height_with_aspect_ratio(g.width,g.aspectratio,zoom);
        my_opt.push(`width=${width}`);
        my_opt.push(`height=${height}`);
      }else if(g.width){
        let width = this.string_to_latex_width(g.width,zoom);
        my_opt.push(`width=${width}`);
      }
      if(g.frame==1){
        my_opt.push(`frame`)
      }
      let text = `\\includegraphics[${my_opt.join(',')}]{${src}}`;
      if(g.float) {
        let f = (g.float == 'left') ? 'l' : 'r';
        text = `\\begin{wraptable}{${f}}{0pt}\n${text}\n\\end{wraptable}~`;
      }
      return text;
    }
    if(g.pic){
      let id = g.pic;
      if(id){
        let ss = this.fetch_ss_from_notes('pic',id);
        if(ss){
          return this.ss_to_diagram(ss,g);
        }
      }
      return '';
    }
  }
  fence_to_tabulate(ss,style) {
    let rows = super.ss_to_tabulate_rows(ss,style);
    rows = rows.map((ss) => ss.map(s => {
      s = this.unmask(s);
      return s;
    }));
    let text = this.rows_to_tabulate(rows, style);
    return text;
  }
  para_to_equation(ss,style){
    let label = style.label||'';
    if(label){
      var labelcmd=`\\label{${label}}`
    }else{
      var labelcmd='';
    }
    let clusters = this.ss_to_clusters(ss);
    let d = [];
    clusters.forEach((ss) => {
      let text = this.make_line(ss,style);
      d.push(text);
    })
    d = d.map(x => x.trim());
    let text = d.join('\\\\');
    text = `\\begin{split}\n${text}\n\\end{split}${labelcmd}`
    text = `\\begin{equation}\n${text}\n\\end{equation}`
    return text;
  }
  para_to_table(ss,style){
    let rows = super.ss_to_tabulate_rows(ss,style);
    rows = rows.map((ss) => ss.map(s => {
      s = this.unmask(s);
      return s;
    }));
    if(style.long){
      var text = this.rows_to_longtable(rows,style);
      ///this method will automatically setup the
      /// caption and label
      /// ...so we do not need to do anything here
    }else {
      var text = this.rows_to_tabulate(rows,style);
      let o = [];
      if(style.float){
        o.push('');
        o.push(`\\begin{table}[ht]`);
        o.push(`\\centering`);
        var caption = this.fetch_caption_from_notes();
        var caption_text = this.unmask(caption);
        o.push(`\\caption{${caption_text}}`);
        if (style.label) {
          o.push(`${this.to_latexlabelcmd(style.label)}`);
        }
        o.push(text);
        o.push(`\\end{table}`);
        text = o.join('\n');
      }else{
        o.push('');
        //o.push('\\begin{center}')
        text = text.trim();
        o.push(text)
        //o.push('\\end{center}')
        text = o.join('\n')
      }
    }
    return text;
  }
  para_to_multi(ss,style){
    let itms = this.ss_to_multi_itms(ss);
    itms = itms.map(s => {
      s = this.unmask(s);
      return s;
    });
    let text = this.itms_to_multi(itms,style);
    var o = [];
    o.push(text);
    return o.join('\n');
  }
  para_to_bull(ss,style) {
    let itms = this.ss_to_bull_itms(ss);
    itms = itms.map(p => {
      p.text = this.unmask(p.text);
      p.term = this.unmask(p.term);
      return p;
    });
    let text = this.itms_to_bull(itms,style);
    return text;
  }
  para_to_verse(ss,style) {
    let itms = this.ss_to_verse_itms(ss, style);
    itms.forEach(p => {
      p.text = this.unmask(p.text);
    })
    let text = this.itms_to_lines(itms, style);
    return text;
  }
  para_to_lines(ss,style){
    let itms = this.ss_to_lines_itms(ss,style);
    itms.forEach(p => {
      p.text = this.unmask(p.text);
    })
    let text = this.itms_to_lines(itms,style);
    return text;
  }
  para_to_diagram(ss,style) {
    var text = this.ss_to_diagram(ss,style);
    if(style.caption){
      let o = [];
      o.push(`\\begin{figure}[ht]`);
      o.push(`\\centering`);
      var caption = this.fetch_caption_from_notes();
      var caption_text = this.unmask(caption);
      o.push(`\\caption{${caption_text}}`);
      if (style.label) {
        o.push(`${this.to_latexlabelcmd(style.label)}`);
      }
      o.push(text);
      o.push(`\\end{figure}`);
      text = o.join('\n');
    }
    return text;
  }
  para_to_figure(ss,style) {
    let itms = this.ss_to_imgrid_itms(ss,style);
    itms.forEach(p => {
      p.sub = this.unmask(p.sub);
    })
    var text = this.imgrid_to_tabular(itms,style);
    if(1){
      let o = [];
      o.push(`\\begin{figure}[ht]`);
      o.push(`\\centering`);
      var caption = this.fetch_caption_from_notes();
      var caption_text = this.unmask(caption);
      if(style.nc){
        ///no caption
      }else{
        o.push(`\\caption{${caption_text}}`);
        if (style.label) {
          o.push(`${this.to_latexlabelcmd(style.label)}`);
        }
      }
      o.push(text);
      o.push(`\\end{figure}`);
      text = o.join('\n');
    }
    return text;
  }
  para_to_listing(ss,style){
    let opts = [];
    let caption = this.fetch_caption_from_notes();
    let label = style.label||'';
    opts.push(`caption={${this.unmask(caption)||'~'}}`);///when caption is empty the Listing: won't show
    if(label){
      opts.push(`label={${label}}`);
    }
    opts = opts.join(',');
    let o = [];
    o.push('');
    o.push(`\\begin{lstlisting}[${opts}]`);
    ss.forEach(x => o.push(x));
    o.push(`\\end{lstlisting}`);
    return o.join('\n');
  }
  para_to_blockquote(ss) {
    let text = ss.join('\n').trim();
    text = this.unmask(text);
    var lq = String.fromCharCode(96);
    var rq = String.fromCharCode(39);
    text = `${lq}${lq}{\\itshape{}${text}}${rq}${rq}`;
    var o = [];
    o.push('')
    o.push(text);
    return o.join('\n');
  }
  para_to_story(ss,style){
    let text = ss.join('\n').trim();///cannot use join_para() here because it has to maintain \n so that triple ```math can work there
    text = this.unmask(text,style);
    let o = [];
    o.push(`\\begin{tabu}{@{}p{\\linewidth}@{}}`);
    o.push(text);
    o.push(`\\end{tabu}`)
    return o.join('\n');
  }
  para_to_plaintext(ss,style) {
    let text = ss.join('\n').trim();///cannot use join_para() here because it has to maintain \n so that triple ```math can work there
    text = this.unmask(text,style);
    let o = [];
    o.push('');
    o.push(text);
    return o.join('\n');
  }
  phrase_to_br() {
    let text = '\\hfill\\break{}';
    return text;
  }
  phrase_to_vspace(cnt){
    return `\\hfill\\break{}\\vspace{${cnt}}\\hfill\\break{}`;
  }
  phrase_to_hspace(cnt){
    return `\\hspace*{${cnt}}`;
  }
  phrase_to_frac(cnt){
    var re = /\s*(?:\/|$)\s*/;
    var ss = cnt.split(re);
    if(ss.length>1){
      let top = ss[0];
      let bot = ss[1];
      top = this.smooth(top);
      bot = this.smooth(bot);
      return `\$\\text{${top}}\\over\\text{${bot}}\$`
    }
    cnt = this.smooth(cnt);
    return `\${1}\\over\\text{${cnt}}\$`
  }
  phrase_to_sfrac(cnt){
    var re = /\s*(?:\/|$)\s*/;
    var ss = cnt.split(re);
    if(ss.length>1){
      let top = ss[0];
      let bot = ss[1];
      top = this.smooth(top);
      bot = this.smooth(bot);
      return `\$\\sfrac{\\text{${top}}}{\\text{${bot}}}\$`
    }
    cnt = this.smooth(cnt);
    return `\$\\sfrac{1}{\\text{${cnt}}}\$`
  }
  phrase_to_sup(cnt){
    var re = /\s*(?:\^|$)\s*/;
    var ss = cnt.split(re);
    if(ss.length>1){
      let base = ss[0];
      let exp = ss[1];
      base = this.smooth(base);
      exp = this.smooth(exp);
      return `\${\\text{${base}}}^{\\text{${exp}}}\$`
    }
    cnt = this.smooth(cnt);
    return cnt;
  }
  phrase_to_sub(cnt){
    var re = /\s*(?:_|$)\s*/;
    var ss = cnt.split(re);
    if(ss.length>1){
      let base = ss[0];
      let exp = ss[1];
      base = this.smooth(base);
      exp = this.smooth(exp);
      return `\${\\text{${base}}}_{\\text{${exp}}}\$`
    }
    cnt = this.smooth(cnt);
    return cnt;
  }
  phrase_to_sqrt(cnt){
    cnt = this.smooth(cnt);
    return `\$\\sqrt{\\text{${cnt}}}\$`
  }
  text_to_typeface (text,type) {
    type = type || '';
    switch (type) {
      case 'verb': {
        return `\\,{}\\texttt{${text}}\\,{}`;
        break;
      }
      case 'code': {
        return `\\texttt{${text}}`
        break;
      }
      case 'em': {
        return `\\emph{${text}}`
        break;
      }
      case 'b': {
        return `\\textbf{${text}}`
        break;
      }
      case 'i': {
        return `\\textit{${text}}`
        break;
      }
      case 'u': {
        return `\\underline{${text}}`
        break;
      }
      case 'overstrike': {
        return `\\sout{${text}}`
        break;
      }
      case 'var': {
        return `\\textsl{${text}}`
        break;
      }
      default: {
        return `${text}`
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
  toFramedFigure (text) {
    var o = [];
    for (var pp of text) {
      pp = pp.map( x => {
          var [image,width,opts,src,srcs,sub] = x;
          if (!src && srcs.length) {
            src = srcs[0];///TODO: need to change it so that it picks a right format
          }
          var { height } = opts;
          if (height) {
            return `\\begin{subfigure}[t]{${width}\\linewidth}\\includegraphics[keepaspectratio=true,height=${height},width=\\linewidth]{${src}}\\caption{${this.unmask(sub)}}\\end{subfigure}`;
          } else {
            return `\\begin{subfigure}[t]{${width}\\linewidth}\\includegraphics[keepaspectratio=true,width=\\linewidth]{${src}}\\caption{${this.unmask(sub)}}\\end{subfigure}`;
          }
      });

      var spacing = 1;
      var sep = '~'.repeat(spacing);
      o.push(pp.join(sep));
    }
    return o.join('\n');
  }
  to_longtabu_pcols (frs, n) {
    /// given a ww that is a list of 1 2 2 5 4 try to figure out
    /// the width of each p-column with an assumed gap between columns
    /// \begin{longtabu} to \linewidth {|X[1]|X[2]|X[2]|X[5]|X[4]}
    frs = frs.map( x => `X[${x}]` );
    return frs;
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
  pols_to_pcol(pcols,style){
    if(style.border==1 || style.border==2){
      return `|${pcols.join('|')}|`;
    }
    if(style.border==3){
      return `|${pcols.join('')}|`
    }
    return pcols.join('');
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
      var cc = text.charCodeAt(j);

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
    unsafe = this.fontify_latex_cjk(unsafe);
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
    unsafe = unsafe.replace(this.re_all_sups, (match,p1,p2) => {
          // I^1
          return  `${T6}${T7}${p1}${T8}${T1}${p2}${T6}`;  // octal code \01 is for caret
      })
    unsafe = unsafe.replace(this.re_all_subs, (match,p1,p2) => {
          // I_1
          return `${T6}${p1}${T2}${p2}${T6}`;  // octal code \02 is for underscore
      })
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
    unsafe = unsafe.replace(/’/g,     "\0char39\0")
    unsafe = unsafe.replace(/“/g,     "\0char34\0")
    unsafe = unsafe.replace(/”/g,     "\0char34\0")
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
    let new_unsafe = '';
    for(let c of unsafe){
      if(this.unicode_symbol_map.has(c)){
        c = this.unicode_symbol_map.get(c).tex;
      }
      new_unsafe += c;
    }
    unsafe = new_unsafe;
    unsafe = this.fontify_latex_cjk(unsafe);
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

  string_to_latex_width(width_s,zoom) {
    zoom = parseFloat(zoom)||1;
    /// take an input string that is 100% and convert it to '\linewidth'.
    /// take an input string that is 50% and convert it to '0.5\linewidth'.
    /// take an input string that is 10cm and returns "10cm"
    /// take an input string that is 10 and returns "10mm"
    if (!width_s) {
      return '';
    }
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(width_s))!==null) {
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
    if((v=re.exec(width_s))!==null){
      var num = v[1];
      num *= zoom;
      if(Number.isFinite(num)){
        return `${num}${v[2]}`;
      }
    }
    var num = parseFloat(width_s);
    num *= zoom;
    if(Number.isFinite(num)){
      return `${num.toFixed(3)}mm`;
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
    var { subf, name, subn, dept, hdgn, title, sig, row1, row2 } = block;
    subf = subf || '';
    name = name || '';
    subn = subn || '';
    sig = sig || '';
    row1 = row1 || '';
    row2 = row2 || '';
    hdgn = (typeof hdgn == 'number') ? hdgn : '';
    return (`%{sig:${sig}} {hdgn:${hdgn}} {subf:${subf}} {name:${name}:${subn}} {row:${row1}:${row2}}`);
  }
  itms_to_cols(itms,glue,n){
    var n = parseInt(n);
    var n = n || 1;
    var m = Math.floor(itms.length/n);
    var z = itms.length - n*m;
    var k = z ? (m+1) : (m);
    var pp = itms.slice(0,k);
    var cols = [];
    for (var j = 0; j < itms.length; j+=k) {
      var pp = itms.slice(j,j+k);
      cols.push(pp);
    }
    var pcol = 'l'.repeat(n);
    var glue = this.glue_to_glue(glue);
    var d = [];
    d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
    for (var j = 0; j < k; ++j) {
      var pp = cols.map(x => x[j] || '');
      d.push(`${glue}${pp.join(' & ')}\\\\${glue}`);
    }
    d.push('\\end{tabular}');
    return d.join('\n');
  }
  itms_to_rows(itms,glue,n){
    var n = parseInt(n);
    var n = n || 1;
    var rows = [];
    var k = 0;
    for (var j = 0; j < itms.length; j++) {
      let p = itms[j];
      if (this.p_is_hline(p)) {
        rows.push('-'.repeat(n).split(''));
        k = 0;
        continue;
      }
      if (k == 0) {
        rows.push([p]);
      } else {
        let pp = rows.pop();
        pp.push(p);
        rows.push(pp);
      }
      k++;
      k %= n;
    }
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = `@{\\hspace{0.02\\linewidth}}`;
    var col = `p{${w}\\linewidth}`;
    var pcol = 'x'.repeat(n).split('').map(x => col).join(gap);
    var glue = this.glue_to_glue(glue);
    var d = [];
    d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
    for (var j = 0; j < rows.length; ++j) {
      var pp = rows[j];
      if(this.pp_is_hline(pp)){
        d.push(`${glue}\\hline${glue}`);
        continue;
      }
      d.push(`${glue}${pp.join(' & ')}\\\\${glue}`);
    }
    d.push('\\end{tabular}');
    return d.join('\n');
  }
  cols_to_tabulary(cols){
    var ncols = cols.length;
    var pcols = 'L'.repeat(ncols).split('');
    var maxn = 0;
    var pcol = pcols.join('');
    var nrows = 0;
    var vpadding = 1;
    /// find out the longest rows
    cols.forEach(x => {
      var n = x ? x.length : 0;
      nrows = Math.max(n, nrows);
    });
    var s = [];
    s.push(`\\begin{tabulary}{\\linewidth}{${pcol}}`);
    for (var j = 0; j < nrows; ++j) {
      var pp = cols.map(x => x[j] || '');
      if (j == 0) {
        s.push('\\hline');
        s.push(`\\noalign{\\vspace{${vpadding}pt}}`);
        var kk = pp.map(x => x.split('\\\\'));
        var kk = kk.map(k => k.map(x => this.unmask(x)));
        var maxn = kk.reduce((maxn,k) => Math.max(maxn,k.length),0);
        for(var n=0; n < maxn; ++n){
          var pp = kk.map(x => x[n]||'');
          s.push(`${pp.join(' & ')}\\\\`);
        }
        s.push(`\\noalign{\\vspace{${vpadding}pt}}`);
        s.push('\\hline');
      }
      else {
        var pp = pp.map(x => this.unmask(x));
        s.push(`\\noalign{\\vspace{${vpadding}pt}}`);
        s.push(`${pp.join(' & ')}\\\\`);
      }
    }
    s.push(`\\noalign{\\vspace{${vpadding}pt}}`);
    s.push('\\hline');
    s.push('\\end{tabulary}');
    return s.join('\n');
  }
  rows_to_tabulate(rows,style){
    var vline = style.vline || '';
    var border = style.border || 0;
    var ncols = rows.length ? rows[0].length : 0;
    var nrows = rows.length;
    var d = [];
    if (style.glue) {
      var glue = parseInt(style.glue) || 0;
      //glue += 1;
    }else{
      var glue = 0;
    }
    if(border==1){
      ///top/bottom/left/right/vertical/horizontal border lines
      ///user-inserted hline will result in a double-hline
      d.push('\\hline')
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          ///d.push(`\\hline`);
          ///***IGNORED
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
        d.push('\\hline');
      }
    }else if(border==2){
      ///top/bottom/left/right/vertical, no horizontal lines
      ///user-inserted hline will result in a single-hline
      d.push('\\hline')
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hline`);
          d.push(`\\hline`);
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
      d.push('\\hline');
    }else if(border==3){
      ///only left/right/top/bottom, no vertical/horizontal
      ///a user-inserted hline translates to a double-hline
      d.push('\\hline')
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hline`);
          d.push(`\\hline`);
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
      d.push('\\hline')
    }else if(border==4){
      ///only the top/bottom, no left/right/vertical/horizontal
      ///a user-inserted hline translates to a double-hline
      d.push('\\hline');
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hline`);
          d.push(`\\hline`);
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
      d.push('\\hline');
    }else{
      ///no border lines
      ///a user-inserted hline translates to a single-hline
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hline`);
          d.push(`\\hline`);
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
    }
    ///join tabular lines
    var text = d.join('\n');
    d = [];
    ///figure out if the columns are fixed
    if(style.fr){
      let frs = this.string_to_array(style.fr);
      frs = frs.map(x => parseInt(x));
      frs = frs.filter(x => Number.isFinite(x));
      frs = frs.filter(x => (x > 0));
      if(frs.length > ncols){
        frs = frs.slice(ncols);
      }else if(frs.length < ncols){
        while(frs.length < ncols){
          frs.push(1);
        }
      }
      ///\begin{tabu} to \linewidth {llX[2]lllXl}
      if(border==1||border==2){
        var pcol = frs.map(x => `X[${x}]`).join('|');
        var pcol = `|${pcol}|`
      }else if(border==3){
        var pcol = frs.map(x => `X[${x}]`).join('');
        var pcol = `|${pcol}|`
      }else{
        var pcol = frs.map(x => `X[${x}]`).join('');
        var pcol = `@{}${pcol}@{}`
      }
      var w = '';
      if(style.width){
        let zoom = 1;
        var w = this.string_to_latex_width(style.width,zoom);
      }
      if(!w){
        w = `\\linewidth`;
      }
      d.push(`\\tabulinesep = ${glue}pt`);
      d.push(`\\begin{tabu} to ${w} {${pcol}}`);
      d.push(text);
      d.push(`\\end{tabu}`);
      text = d.join('\n')  
    }else{
      if(border==1||border==2){
        var pcol = 'l'.repeat(ncols).split('').join('|');  
        var pcol = `|${pcol}|`
      }else if(border==3){
        var pcol = 'l'.repeat(ncols).split('').join('');  
        var pcol = `|${pcol}|`
      }else if(vline){
        var pcols = 'l'.repeat(ncols).split('');
        var vcols = '|'.repeat(ncols+1).split('');
        let my = this.string_to_int_array(vline);
        vcols = vcols.map((x,i) => {
          if(my.indexOf(i) >= 0){
            return x;
          }else{
            return '';
          }
        })
        if(vcols[0]==''){
          vcols[0] = '@{}'
        }
        if(vcols[ncols]==''){
          vcols[ncols] = '@{}';
        }
        var mycols = [];
        for(let i=0; i < ncols; ++i){
          mycols.push(vcols[i]);
          mycols.push(pcols[i]);
        }
        mycols.push(vcols[ncols]);
        var pcol = mycols.join('');
      }else{
        var pcol = 'l'.repeat(ncols).split('').join('');  
        var pcol = `@{}${pcol}@{}`
      }
      d.push(`\\tabulinesep = ${glue}pt`);
      d.push(`\\begin{tabu}{${pcol}}`);
      d.push(text);
      d.push(`\\end{tabu}`)
      text = d.join('\n')
    }
    if(style.float) {
      let f = (style.float == 'left') ? 'l' : 'r';
      text = `\\begin{wraptable}{${f}}{0pt}\n${text}\n\\end{wraptable}`;
    }else{
      text = `${text}`
    }
    return text;
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
  _rows_to_tabular(rows, ww, style, isheader) {
    ///this function is assuming all texts has been escaped
    var ncols = ww.length;
    var pcols = 'l'.repeat(ncols).split('');
    var maxn = 0;
    var pcol = pcols.join('');
    var nrows = rows.length;
    var vpadding = style.vpadding || 0;
    var d = [];
    if (isheader) {
      d.push(`\\begin{tabular}{${pcol}}`);
    } else {
      d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
    }
    for (var j = 0; j < nrows; ++j) {
      var pp = rows[j];
      if (isheader && j == 0) {
        d.push('\\hline');
      }
      if (vpadding > 0) {
        d.push(`\\noalign{\\vspace{${vpadding}pt}}`);
      }
      d.push(`${pp.join(' & ')}\\\\`);
      if (vpadding > 0) {
        d.push(`\\noalign{\\vspace{${vpadding}pt}}`);
      }
      if (isheader && j == 0) {
        d.push('\\hline');
      }
    }
    if (isheader) {
      d.push('\\hline');
    }
    d.push('\\end{tabular}');
    return d.join('\n');
  }
  __images_to_tabular(opts,images){
    var n = this.assert_int(opts.grid,1,1);
    var d = [];
    var w = (1-(0.02*(n-1)))/n;
    var gap = `@{\\hspace{0.02\\linewidth}}`;
    var col = `>{\\centering}p{${w}\\linewidth}`;
    var pcol = 'x'.repeat(n).split('').map(x => col).join(gap);
    d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
    var all = images.map(x => {
      var {src,width,height,sub} = x;
      const imgsrc = this.svg_to_png_src(src);
      var mygraphopts = [];
      mygraphopts.push(`width=\\linewidth`);
      if(opts && opts.frame){
        mygraphopts.push(`frame`);
      }
      var img=`\\includegraphics[${mygraphopts.join(',')}]{${imgsrc}}`;
      var sub = this.unmask(sub);
      return {img,sub};
    });
    while(all.length){
      var pp = all.slice(0,n);
      all = all.slice(n);
      //ensure imgs and subs is at least n
      var imgs = pp.map(x => x.img);
      var subs = pp.map(x => x.sub);
      while(imgs.length < n) imgs.push('');
      while(subs.length < n) subs.push('');
      d.push(imgs.join(' & '));
      d.push(`\\tabularnewline`);
      d.push(subs.join(' & '));
      d.push(`\\tabularnewline`);
    }
    d.push(`\\end{tabular}`);
    return d.join('\n');
  }

  to_colors(color){
    return this.diagram.to_colors(color);
  }

  rows_to_xltabular(rows,islabeled,label,caption){
    var d = [];
    var ncols = rows[0].length;
    var nrows = rows.length;
    var pcol='l'.repeat(ncols).split('').join('');
    d.push(`\\begin{xltabular}{\\linewidth}{@{}${pcol}@{}}`);
    if(islabeled){
      if(label){
        d.push(`\\caption{${this.unmask(caption)}\\label{${label}}}\\\\`);
      }else{
        d.push(`\\caption{${this.unmask(caption)}}\\\\`);
      }
    }
    for (var j = 0; j < nrows; ++j) {
      var pp = rows[j];
      pp = pp.join(' & ');
      pp = `${pp}\\tabularnewline`;
      d.push(pp);
    }
    if(nrows==0){
      d.push(`(empty)`);
    } 
    else {
      d.pop(); 
      d.push(pp);
    }
    d.push(`\\end{xltabular}`);
    return d.join('\n');
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
  __to_core_packages (latex_program) {
    let input = '';
    if(latex_program=='lualatex'){
      input = `\
\\usepackage{luatexja-fontspec}
`
    }else if(latex_program=='xelatex'){
      input = `\
\\usepackage[utf8]{inputenc}
\\usepackage{fontspec}
`
    }else{///default to 'pdflatex'
      input = `\
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
`
    }
    let p_unicode_math='';
    if(latex_program=='lualatex'||latex_program=='xelatex'){
      p_unicode_math='\\usepackage{unicode-math}'
    }
    return `\
${input}
\\usepackage{graphicx}
\\usepackage{caption}
\\usepackage{mathtools}
\\usepackage{latexsym}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{txfonts}
\\usepackage{pxfonts}
\\usepackage{wasysym}
\\usepackage{stmaryrd}
\\usepackage{textcomp}
\\usepackage{pifont}
\\usepackage{marvosym}
\\usepackage{xfrac}
\\usepackage{commath}
\\DeclareMathOperator{\\sech}{sech}
\\DeclareMathOperator{\\csch}{csch}
\\DeclareMathOperator{\\arcsec}{arcsec}
\\DeclareMathOperator{\\arccot}{arccot}
\\DeclareMathOperator{\\arccsc}{arccsc}
\\DeclareMathOperator{\\arcosh}{arcosh}
\\DeclareMathOperator{\\arsinh}{arsinh}
\\DeclareMathOperator{\\artanh}{artanh}
\\DeclareMathOperator{\\arsech}{arsech}
\\DeclareMathOperator{\\arcsch}{arcsch}
\\DeclareMathOperator{\\arcoth}{arcoth}
\\DeclareMathSymbol{\\Alpha}{\\mathalpha}{operators}{"41}
\\DeclareMathSymbol{\\Beta}{\\mathalpha}{operators}{"42}
\\DeclareMathSymbol{\\Epsilon}{\\mathalpha}{operators}{"45}
\\DeclareMathSymbol{\\Zeta}{\\mathalpha}{operators}{"5A}
\\DeclareMathSymbol{\\Eta}{\\mathalpha}{operators}{"48}
\\DeclareMathSymbol{\\Iota}{\\mathalpha}{operators}{"49}
\\DeclareMathSymbol{\\Kappa}{\\mathalpha}{operators}{"4B}
\\DeclareMathSymbol{\\Mu}{\\mathalpha}{operators}{"4D}
\\DeclareMathSymbol{\\Nu}{\\mathalpha}{operators}{"4E}
\\DeclareMathSymbol{\\Omicron}{\\mathalpha}{operators}{"4F}
\\DeclareMathSymbol{\\Rho}{\\mathalpha}{operators}{"50}
\\DeclareMathSymbol{\\Tau}{\\mathalpha}{operators}{"54}
\\DeclareMathSymbol{\\Chi}{\\mathalpha}{operators}{"58}
\\DeclareMathSymbol{\\omicron}{\\mathord}{letters}{"6F}
\\usepackage{changepage}
\\usepackage{listings}
\\usepackage{anyfontsize}
\\usepackage[normalem]{ulem}
\\usepackage{xcolor}
\\usepackage{tikz}
\\usepackage[export]{adjustbox}
\\usepackage{url}
\\usepackage{wrapfig}
\\usepackage{longtable,tabu}
\\usepackage{hhline}
${p_unicode_math}
`
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
      all.push(`\\usepackage[overlap,CJK]{ruby}`);
      all.push(`\\renewcommand\\rubysep{0.05ex}`);
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
        all.push(`\\newfontfamily{\\jp}[]{YuMincho}`);
        all.push(`\\newfontfamily{\\cn}[]{Songti SC}`);
        all.push(`\\newfontfamily{\\tw}[]{Songti TC}`);
        all.push(`\\newfontfamily{\\kr}[]{AppleGothic}`);
        // all.push(`\\newfontfamily{\\jp}[Scale=0.85]{YuMincho}`);
        // all.push(`\\newfontfamily{\\cn}[Scale=0.85]{Songti SC}`);
        // all.push(`\\newfontfamily{\\tw}[Scale=0.85]{Songti TC}`);
        // all.push(`\\newfontfamily{\\kr}[Scale=0.85]{AppleGothic}`);
      }else if(platform=='linux'){
        var font_defs = ``;
      }else{
        var font_defs = ``;
      }
      all.push(`\\XeTeXlinebreaklocale "zh"`);
      all.push(`\\XeTeXlinebreakskip = 0pt plus 1pt`);
      all.push(`\\usepackage{ruby}`)
      all.push(`\\renewcommand\\rubysep{0.05ex}`);
    }
    /// 'lualatex' and 'lutexja'
    else if(latex_program=='lualatex'){
      if(this.flags.is_cjk){
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
    all.push(`\\usepackage{mathtools}`);
    all.push(`\\usepackage{latexsym}`);
    all.push(`\\usepackage{amsfonts}`);
    all.push(`\\usepackage{amssymb}`);
    all.push(`\\usepackage{txfonts}`);
    all.push(`\\usepackage{pxfonts}`);
    all.push(`\\usepackage{wasysym}`);
    all.push(`\\usepackage{stmaryrd}`);
    all.push(`\\usepackage{textcomp}`);
    all.push(`\\usepackage{pifont}`);
    all.push(`\\usepackage{marvosym}`);
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
    all.push(`\\usepackage{listings}`);
    all.push(`\\usepackage{anyfontsize}`);
    all.push(`\\usepackage[normalem]{ulem}`);
    all.push(`\\usepackage{xcolor}`);
    all.push(`\\usepackage{tikz}`);
    all.push(`\\usepackage[export]{adjustbox}`);
    all.push(`\\usepackage{url}`);
    all.push(`\\usepackage{wrapfig}`);
    all.push(`\\usepackage{longtable,tabu}`);
    all.push(`\\usepackage{hhline}`);
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
  __itms_to_itemized__(itms,style){
    if(itms.length){
      let pp = itms.map((p,i) => {
        if(p.type == 'A'){
          return `\\item[${this.to_A_letter(p.value)}${p.ending}] ${p.text}`;
        }
        if(p.type == 'a'){
          return `\\item[${this.to_a_letter(p.value)}${p.ending}] ${p.text}`;
        }
        if(p.type == 'I'){
          return `\\item[${this.to_I_letter(i + 1)}${p.ending}] ${p.text}`;
        }
        if(p.type == 'i'){
          return `\\item[${this.to_i_letter(i + 1)}${p.ending}] ${p.text}`;
        }
        if(typeof p.value == 'number'){
          return `\\item[${p.value}${p.ending}] ${p.text}`
        }
        return `\\item[\\textbullet] ${p.text}`
      });
      return `\\begin{list}{\\textbullet}{\\setlength\\parsep{0ex}\n\\setlength\\itemsep{0ex}}\n${pp.join('\n')}\n\\end{list}`;
    }
    return `\\begin{list}{\\textbullet}{\\setlength\\parsep{0ex}\n\\setlength\\itemsep{0ex}}\n\\item\n\\end{list}`;
  }
  itms_to_itemized(itms,style){
    let pp = itms.map((p,i) => {
      if(p.type == 'A'){
        return `{${this.to_A_letter(p.value)}${p.ending}} ${p.text}`;
      }
      if(p.type == 'a'){
        return `{${this.to_a_letter(p.value)}${p.ending}} ${p.text}`;
      }
      if(p.type == 'I'){
        return `{${this.to_I_letter(i + 1)}${p.ending}} ${p.text}`;
      }
      if(p.type == 'i'){
        return `{${this.to_i_letter(i + 1)}${p.ending}} ${p.text}`;
      }
      if(typeof p.value == 'number'){
        return `{${p.value}${p.ending}} ${p.text}`
      }
      return `{\\textbullet} ${p.text}`
    });
    return `\n\\begingroup\n${pp.join('\\hfill\\break{}\n')}\n\\endgroup`;
  }
  __itms_to_bull(itms,style){
    let pp = itms.map((p,i) => {
      if(p.bull == '--'){
        return `{\\textbullet} ${p.text}`;
      }
      if(p.bull == '**'){
        return `{${i+1}}. ${p.text}`
      }
      return `${p.text}`
    });
    return `\n\\begingroup\n${pp.join('\\hfill\\break{}\n')}\n\\endgroup`;
  }
  itms_to_bull(itms,style){
    let pp = itms.map((p,i) => {
      if(p.bull == '**'){
        return `\\item[${i+1}.] ${p.text}`
      }
      if(p.bull == '--'){
        return `\\item[\\textbullet] ${p.text}`
      }
      return `\\item[${p.term}] ${p.text}`
    });
    return `\\begin{list}{}{\\setlength\\parsep{0ex}\\setlength\\itemsep{0ex}}\n${pp.join('\n')}\n\\end{list}`;
  }
  itms_to_lines(itms,style){
    var d = [];
    if (style.glue) {
      var glue = parseInt(style.glue) || 0;
      glue += 1;
    }else{
      var glue = 1;
    }
    var n = parseInt(style.n)||1;
    var m = Math.floor(itms.length / n);
    var z = itms.length - n * m;
    var k = z ? (m + 1) : (m);
    var pcol = 'x'.repeat(n).split('').map((x, i) => `X[1,l]`).join('');
    var cols = [];
    for (let j = 0, i = 0; j < itms.length; i += 1, j += k) {
      var pp = itms.slice(j, j + k).map(p => p.text)
      cols.push(pp);
    }
    d.push(`\\tabulinesep = ${glue}pt`);
    d.push(`\\begin{tabu} to \\linewidth{@{}${pcol}@{}}`);
    for(let i = 0; i < k; ++i){
      let rr = cols.map(pp => pp[i]||'');
      d.push(rr.join(' & '));
      d.push('\\\\')
    }
    d.push(`\\end{tabu}`);
    return d.join('\n')
  }
  pp_to_multi_itemized(itms,fr,n){
    var d = [];
    var m = Math.floor(itms.length / n);
    var z = itms.length - n * m;
    var k = z ? (m + 1) : (m);
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = `@{\\hspace{0.02\\linewidth}}`;
    var frs = this.string_to_frs(fr, n);
    var pcol = 'x'.repeat(n).split('').map((x, i) => `p{${frs[i] * w}\\linewidth}`).join(gap);
    d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
    for (let j = 0, i = 0; j < itms.length; i += 1, j += k) {
      var pp = itms.slice(j, j + k);
      d.push(`\\begin{list}{\\textbullet}{\\setlength\\topsep{0ex}\\setlength\\parsep{0ex}\\setlength\\itemsep{0ex}}\n${pp.join('\n')}\n\\end{list}`);
      if(i==n-1){
        d.push('\\\\')
      }else{
        d.push(' & ')
      }
    }
    d.push(`\\end{tabular}`);
    return d.join('\n')
  }
  rows_to_longtable(rows,style) {
    ///all row data has been unmasked
    var caption = this.fetch_caption_from_notes();
    var label = style.label || '';
    if (style.glue) {
      var glue = parseInt(style.glue) || 0;
      glue += 1;
    } else {
      var glue = 1;
    }
    var n = rows.length ? rows[0].length : 1;
    if(style.caption){
      ///captionlabelline
      var d = [];
      if (label) {
        d.push(`\\caption{${this.unmask(caption)}\\label{${label}}}\\\\`);
      } else {
        d.push(`\\caption{${this.unmask(caption)}}\\\\`)
      }
      var captionlabelline = d.join('\n')
    }else{
      var captionlabelline = '';
    }
    if(1){
      ///headerline
      var d = [];
      if (style.border==1||style.border==2||style.border==3||style.border==4) { 
        d.push('\\hline'); 
      }
      let header = rows[0];//all rows are guarrenteed the same length
      rows = rows.slice(1);
      d.push(`${header.join(' & ')}\\\\`);
      let pp=rows[0];//hline or dhline
      if (this.pp_is_hline(pp)){
        d.push('\\hline'); 
        rows = rows.slice(1);
      }else if(this.pp_is_dhline(pp)){
        d.push(`\\hhline{${'='.repeat(n)}}`); 
        rows = rows.slice(1);
      }else if(style.border==1){
        d.push('\\hline'); 
      }
      d.push(`\\endhead`);
      var headerline = d.join('\n')
    }
    if(1){
      ///footerline
      var d = [];
      if (style.border==1||style.border==2||style.border==3||style.border==4) { 
        d.push('\\hline'); 
      }
      d.push(`\\endfoot`);
      var footerline = d.join('\n')
    }
    if(1){
      var pcols = this.string_to_longtabu_pcols(style.fr||'', n);
      if(style.border==1 || style.border==2){
        var pcol = `|${pcols.join('|')}|`;
      }else if(style.border==3){
        var pcol = `|${pcols.join('')}|`
      }else{
        var pcol = pcols.join('');  
      }
    }
    ///start the longtabu
    var d = [];
    d.push(`\\tabulinesep=${glue}pt`);
    d.push(`\\begin{longtabu} to \\linewidth {@{}${pcol}@{}}`);
    d.push(captionlabelline);
    d.push(headerline);
    d.push(footerline);
    ///for table body
    let nrows = rows.length;
    let border = style.border||0;
    if (border == 1) {
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          ///d.push(`\\hline`);
          ///***IGNORED
          continue;
        } else if (this.pp_is_dhline(pp)) {
          d.push(`\\hhline{${'='.repeat(n)}}`); ///a feature of the "hhline" package
          continue;
        } else if (j > 0){
          d.push('\\hline');
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
    } else if (border == 2) {
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hhline{${'='.repeat(n)}}`); 
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
    } else if (border == 3) {
      ///only left/right/top/bottom border lines
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hhline{${'='.repeat(n)}}`); 
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
    } else if (border == 4) {
      ///only the top/bottom border lines
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hhline{${'='.repeat(n)}}`); 
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
    } else {
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          d.push(`\\hline`);
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`\\hhline{${'='.repeat(n)}}`); 
          continue;
        }
        d.push(`${pp.join(' & ')}\\\\`);
      }
    }
    ///end the longtabu
    d.push('\\end{longtabu}');
    return d.join('\n');
  }
  itms_to_multi(itms,style) {
    ///all row data has been unmasked
    var border = style.border||0;
    var fr = style.fr || '';
    var glue_before = this.glue_to_vspace_before(style.glue);
    var glue_after = this.glue_to_vspace_after(style.glue);
    var n = parseInt(style.n)||1;
    var d = [];
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = `@{\\hspace{0.02\\linewidth}}`;
    var gaph = `@{\\hspace{0.01\\linewidth}}|@{\\hspace{0.01\\linewidth}}`;
    var frs = this.string_to_frs(fr, n);
    if(border==1){
      var pcol = 'x'.repeat(n).split('').map((x, i) => `p{${frs[i] * w}\\linewidth}`).join(gaph);
      var pcol = `|${pcol}|`;
    }else{
      var pcol = 'x'.repeat(n).split('').map((x,i) => `p{${frs[i]*w}\\linewidth}`).join(gap);
    }
    d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
    if(border==1){
      d.push('\\hline')
    }
    for (let j = 0; j < itms.length; j+=n) {
      let pp = itms.slice(j,j+n);//pp could be shorter than n
      let ss = pp.map(text => {
        return `\\begin{minipage}{\\linewidth}\n${glue_before}\\raggedright{}${text}${glue_after}\\end{minipage}`;
      }); 
      d.push(`${ss.join(' & ')}\\\\`);      
      if(border==1){
        d.push('\\hline')
      }
    }
    d.push(`\\end{tabular}`);
    var text = d.join('\n');
    var zoom = parseFloat(style.zoom);
    if(!Number.isFinite(zoom)){
      zoom = 1;
    }
    if(style.width){
      let w = style.width;
      w = this.string_to_latex_width(w,zoom);
      text = `\\resizebox{${w}}{!}{${text}}`
    }
    return text;
  }  
  _itms_to_multi(itms,style) {
    ///all row data has been unmasked
    var fr = style.fr || '';
    var glue = this.glue_to_glue(style.glue);
    var n = parseInt(style.n)||1;
    var d = [];
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = `@{\\hspace{0.02\\linewidth}}`;
    var frs = this.string_to_frs(fr, n);
    var pcol = 'x'.repeat(n).split('').map((x,i) => `p{${frs[i]*w}\\linewidth}`).join(gap);
    for (let j = 0; j < itms.length; j+=n) {
      let pp = itms.slice(j,j+n);//pp could be shorter than n
      d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
      let ss = pp.map(text => {
        return `\\begin{minipage}{\\linewidth}\n${text}\\end{minipage}`;
      }); 
      d.push(`${glue}${ss.join(' & ')}\\\\${glue}`);      
      d.push(`\\end{tabular}`);
      d.push('\\hfill\\\\');
    }
    d.pop();///remove the last hfill
    return d.join('\n');
  }
  imgrid_to_tabular(itms,style) {
    var n = parseInt(style.n)||1;
    var d = [];
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = `@{\\hspace{0.02\\linewidth}}`;
    var col = `>{\\centering}p{${w}\\linewidth}`;
    var pcol = 'x'.repeat(n).split('').map(x => col).join(gap);
    itms.forEach(p => {
      var { g } = p;
      ///sub is already unmasked!
      g.width = `100%`;
      if(g.src){
        g.src = this.svg_to_png_src(g.src);
      }
      var cnt = this.string_from_style(g);
      var img = this.phrase_to_img(cnt);
      p.img = img;
    });
    d.push(`\\begin{tabular}{@{}${pcol}@{}}`);
    while (itms.length) {
      let pp = itms.slice(0, n);
      itms = itms.slice(n);
      //ensure imgs and subs is at least n
      let imgs = pp.map(x => x.img);
      let subs = pp.map(x => x.sub);
      while (imgs.length < n) imgs.push('');
      while (subs.length < n) subs.push('');
      d.push(imgs.join(' & '));
      d.push(`\\tabularnewline`);
      d.push(subs.join(' & '));
      d.push(`\\tabularnewline`);
    }
    d.push(`\\end{tabular}`);
    return d.join('\n');
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
      this.flags.is_cjk = 1;
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
      this.flags.is_cjk = 1;
      return `{\\${fn}{${s}}}`
    }
    return s;
  }
  aspect_ratio_to_float(aspect_ratio_s){
    if(!aspect_ratio_s){
      return NaN;
    }
    let pp = aspect_ratio_s.split('/').map((x) => parseInt(x)).filter((x) => Number.isFinite(x));
    if(pp.length==2){
      var ratio = pp[1]/pp[0];
    }else{
      var ratio = 1;
    }
    return ratio;
  }
}
module.exports = { NitrilePreviewLatex }
