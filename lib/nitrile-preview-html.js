'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { NitrilePreviewDiagramSVG } = require('./nitrile-preview-diagramsvg');
const { NitrilePreviewFramedSVG } = require('./nitrile-preview-framedsvg');
const const_partnums = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'IIX', 'IX', 'X'];
const const_subfignums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

class NitrilePreviewHtml extends NitrilePreviewTranslator {

  constructor(parser) {
    super(parser);
    this.name='HTML';
    this.tokenizer = new NitrilePreviewTokenizer(this);
    this.diagram = new NitrilePreviewDiagramSVG(this);
    this.framed = new NitrilePreviewFramedSVG(this);
    this.mathmargin = 3;
    this.mathpadding = 2;
    this.imgid = 1;
    this.imgs = [];
    this.enumerate_counter = 0;
    this.my_diagram_ss_maps = new Map();
    this.my_svgarray_vspace = 3;
  }
  do_PART(block) {
    var { title, style } = block;
    let idnum=this.get_refmap_value(style,'partnum');
    var o = [];
    var title = this.unmask(title);
    if(this.conf('html.partpage')){
      var s=this.conf('html.part').split('\t');
      var s=s.map(x => x.replace(/\$\{text\}/g,title));
      var s=s.map(x => x.replace(/\$\{i\}/g,x=>this.to_i_letter(idnum)));
      var s=s.map(x => x.replace(/\$\{I\}/g,x=>this.to_I_letter(idnum)));
      var s=s.map(x => x.replace(/\$\{a\}/g,x=>this.to_a_letter(idnum)));
      var s=s.map(x => x.replace(/\$\{A\}/g,x=>this.to_A_letter(idnum)));
      var s=s.map(x => x.replace(/\$\{1\}/g,x=>this.to_1_letter(idnum)));
      var s=s.join('\n');
      o.push(s);
    }else{
      idnum = this.to_I_letter(idnum);
      o.push(`<h1 > <small> Part ${idnum} </small> <br/> ${title} </h1>`);
    }
    o.push('');
    block.html = o.join('\n');
  }
  do_HDGS(block) {
    let {hdgn,title,style,row1,row2} = block;
    var o = [];
    title = this.unmask(title);
    let id = this.get_refmap_value(style,'id');
    let idnum = this.get_refmap_value(style,'idnum');
    let chnum = this.get_refmap_value(style,'chnum');
    if(chnum && idnum){
      idnum = chnum + '.' + idnum;
    } else if(chnum) {
      idnum = chnum;
    }
    ///note that subn and hdgn guarenteed to be integers
    if(hdgn==0) {
      o.push(`<h1 id='${id}' rows='${this.rows(row1,row2)}' >${idnum} ${title}</h1>`);
    } 
    else if(hdgn==1) {
      o.push(`<h2 id='${id}' rows='${this.rows(row1,row2)}' >${idnum} ${title}</h2>`);
    } 
    else if(hdgn==2) {
      o.push(`<h3 id='${id}' rows='${this.rows(row1,row2)}' >${idnum} ${title}</h3>`);
    } 
    else {
      o.push(`<h4 id='${id}' rows='${this.rows(row1,row2)}' >${idnum} ${title}</h4>`);
    }
    o.push('');
    block.html = o.join('\n');
    ///reset the enumerate counter
    this.enumerate_counter = 0;
  }
  do_PLST(block) {
    ///NOTE: cannot place a <p> around the <ul>. 
    let items = this.plitems_to_items(block.plitems);
    var o = []; 
    var count=0;
    //const gap = '&#x2003;';//EM space
    const gap = '&#160;';
    for (var item of items) {
      var {bull,bullet,value,br,text,keys,row1,row2,more} = item;
      text = text || '';
      let extra_text = '';
      if(more && more.length){
        more.forEach((plitem) => {
          let {lines,row1,row2} = plitem;
          extra_text += `${this.untext(lines)}`;
        });
      }
      switch (bull) {
        case 'OL': {
          let postfix = count ? '' : 'TOP';
          o.push(`<ol class='PLST' >`);
          count++;
          break;
        }
        case 'UL': {
          let postfix = count ? '' : 'TOP';
          o.push(`<ul class='PLST' >`);
          count++;
          break;
        }
        case 'DL': {
          let postfix = count ? '' : 'TOP';
          o.push(`<dl class='PLST' >`);
          count++;
          break;
        }
        case 'LI': {
          if(bullet[0]=='+'){
            text = this.unmask(text);
            keys = keys.map(({key,cat}) => {
              key = this.polish(key);
              if (cat == 'tt') {
                key = `&#x2018;<tt>${key}</tt>&#x2019;`;
              }
              else if (cat == 'i') {
                key = `<i>${key}</i>`
              }
              else {
                key = `<strong>${key}</strong>`;
              }
              return key;
            });
            o.push(`<dt class='PLST' rows='${this.rows(row1,row2)}' >${keys.join(', ')}</dt><dd class='PLST'>${text}${extra_text}</dd>`);
          }
          else{
            text = this.unmask(text);
            if(keys){
              keys = keys.map(({key,cat}) => {
                key = this.polish(key);
                if (cat == 'tt') {
                  key = `&#x2018;<tt>${key}</tt>&#x2019;`;
                }
                else if (cat == 'i') {
                  key = `<i>${key}</i>`
                }
                else if (cat == 'b') {
                  key = `<b>${key}</b>`;
                }
                return key;
              });
              if(br){
                text = `${keys.join(', ')}: <br/> ${text}`;
              }else{
                text = `${keys.join(', ')}: ${gap} ${text}`;
              }
            }
            if(bullet=='*'){
              value = ++this.enumerate_counter;  
            }
            o.push(`<li class='PLST' type='${item.type}' value='${value}' rows='${this.rows(row1,row2)}' >${text}${extra_text}</li>`);
          }
          break;
        }
        case '/OL': {
          o.push(`</ol>`);
          count--;
          break;
        }
        case '/UL': {
          o.push(`</ul>`);
          count--;
          break;
        }
        case '/DL': {
          o.push(`</dl>`);
          count--;
          break;
        }
      }
    }
    o.push('');
    block.html = o.join('\n');
  }
  do_BULL(block) {
    var {hdgn,plitems} = block;
    var num = 0;
    const bullet = '&#x2022;'
    var pp = plitems.map(plitem => {
      let text = plitem.body.join('\n');
      text = this.unmask(text);
      if(hdgn=='--'){
        text = `${bullet}&#160;&#160;${text}`
      }else if(hdgn=='**'){
        text = `${++num}.&#160;&#160;${text}`;
      }
      return text;
    });
    ///do nothing
    var o = [];
    o.push(`<div class='BULL' >${pp.join('<br/>')}</div>`);
    o.push('');
    block.html = o.join('\n');
  }
  do_SAMP(block) {
    var {row1,row2,sig,body,parser} = block;
    body = this.trim_samp_body(body);
    body = body.map(x => this.polish(x));
    var text = body.join('<br/>');
    var o = []; 
    o.push(`<div class='SAMP' rows='${this.rows(row1,row2)}' ><pre style='margin:0'>${text}</pre></div>`);
    o.push('');
    block.html = o.join('\n');
  }
  do_HRLE(block) {
    var {id,row1,row2,sig,text} = block;
    var o = []; 
    text = this.unmask(text);
    o.push(`<hr class='HRLE' style='text-align:center' />`);
    o.push('');
    block.html = o.join('\n');
  }
  do_PRIM(block) {
    var {row1,row2,hdgn,title,body} = block;
    var o = []; 
    const indent = '&#160;'.repeat(5);
    title = this.unmask(title);
    let s0 = body[0]||'';
    let text = this.unmask(body.join('\n'));
    if (hdgn === 0) {
      text = `<strong>${title}</strong> ${s0 ? '' : '&#160;'} ${text}`;
      this.textblockcount = 0;
    }
    else if (hdgn === 1) {
      text = `<strong>${title}</strong> ${s0 ? '' : '&#160;'} ${text}`;
      this.textblockcount = 0;
    }
    else if (hdgn === 2) {
      text = `<strong><i>${title}</i></strong> ${s0 ? '':'&#160;'} ${text}`;
      this.textblockcount = 0;
    } 
    else {
      text = `${indent}<strong><i>${title}</i></strong> ${s0 ? '':'&#160;'} ${text}`;
    }
    o.push(`<div class='PRIM PRIM${hdgn}' rows='${this.rows(row1,row2)}' >${text}</div>`);
    o.push('');
    block.html = o.join('\n');
  }
  do_TEXT(block) {
    var {body,style} = block;
    var o = []; 
    let text = this.untext(body,style);
    o.push(text);
    o.push('');
    block.html = o.join('\n');
  }
  smooth (unsafe) {
    const T1 = String.fromCharCode(0x1);
    /// change string for dialog and others, such that these
    /// texts are to be part of a SVG-TEXT element, thus any HTML markup
    /// such as <sup>, <sub> are not allowed.
    unsafe = '' + unsafe; /// force it to be a string when it can be a interger
    unsafe = unsafe.replace(this.re_all_sups, (match,p1,p2) => {
          switch(p2){
            // I^1
            case '0': return  `${p1}${T1}#x2070;`; 
            case '1': return  `${p1}${T1}#x00B9;`; 
            case '2': return  `${p1}${T1}#x00B2;`; 
            case '3': return  `${p1}${T1}#x00B3;`; 
            case '4': return  `${p1}${T1}#x2074;`; 
            case '5': return  `${p1}${T1}#x2075;`; 
            case '6': return  `${p1}${T1}#x2076;`; 
            case '7': return  `${p1}${T1}#x2077;`; 
            case '8': return  `${p1}${T1}#x2078;`; 
            case '9': return  `${p1}${T1}#x2079;`; 
            case 'c': return  `${p1}${T1}#x1D9C;`;
            case 'n': return  `${p1}${T1}#x207F;`; 
            case 'i': return  `${p1}${T1}#x2071;`; 
            default: return match;
          }
      })
    unsafe = unsafe.replace(this.re_all_subs, (match,p1,p2) => {
          switch(p2){
            // I_1
            case '0': return `${p1}${T1}#x2080;`;
            case '1': return `${p1}${T1}#x2081;`;
            case '2': return `${p1}${T1}#x2082;`;
            case '3': return `${p1}${T1}#x2083;`;
            case '4': return `${p1}${T1}#x2084;`;
            case '5': return `${p1}${T1}#x2085;`;
            case '6': return `${p1}${T1}#x2086;`;
            case '7': return `${p1}${T1}#x2087;`;
            case '8': return `${p1}${T1}#x2088;`;
            case '9': return `${p1}${T1}#x2089;`;
            case 'a': return `${p1}${T1}#x2090;`;
            case 'e': return `${p1}${T1}#x2091;`;
            case 'o': return `${p1}${T1}#x2092;`;
            case 'x': return `${p1}${T1}#x2093;`;
            case 'h': return `${p1}${T1}#x2095;`;
            case 'k': return `${p1}${T1}#x2096;`;
            case 'l': return `${p1}${T1}#x2097;`;
            case 'm': return `${p1}${T1}#x2098;`;
            case 'n': return `${p1}${T1}#x2099;`;
            case 'p': return `${p1}${T1}#x209A;`;
            case 's': return `${p1}${T1}#x209B;`;
            case 't': return `${p1}${T1}#x209C;`;
            default: return match;
          }
      })
    unsafe = unsafe.replace(this.re_all_diacritics, (match,p1,p2) => {
          // a~dot, a~ddot, a~bar ...
          switch(p2){
            case 'dot':      return `${p1}${T1}#x0307;`;
            case 'ddot':     return `${p1}${T1}#x0308;`;
            case 'bar':      return `${p1}${T1}#x0305;`;
            case 'mathring': return `${p1}${T1}#x030A;`;
            case 'hat':      return `${p1}${T1}#x0302;`;
            case 'check':    return `${p1}${T1}#x030C;`;
            case 'grave':    return `${p1}${T1}#x0300;`;
            case 'acute':    return `${p1}${T1}#x0301;`;
            case 'breve':    return `${p1}${T1}#x0306;`;
            case 'tilde':    return `${p1}${T1}#x0303;`;
            default: return match;
          }
      })
    unsafe = unsafe.replace(this.re_all_mathvariants, (match,p1,p2) => {
          // a~mathbb, a~mathbf, ...
          try{
            var v= this.tokenizer.get_mathvariant(p2,p1,'unicode');
            v = v.replace(/&/g,T1);
            return v;
          }catch(e){
            return match;
          }
      })
    unsafe = unsafe.replace(this.re_all_symbols, (match,p1) => {
          try{
            var v = this.tokenizer.get_html_symbol(p1);
            v = v.replace(/&/g,T1);
            return v;
          }catch(e){
            return match;
          }
      })
    unsafe = unsafe.replace(this.re_all_symbol_comments, (match,p1) => {
          try{
            var v = this.tokenizer.get_symbol_comment(p1);
            return v;
          }catch(e){
            return match;
          }
      })
    unsafe = unsafe.replace(/&/g, "&amp;")
    unsafe = unsafe.replace(/</g, "&lt;")
    unsafe = unsafe.replace(/>/g, "&gt;")
    unsafe = unsafe.replace(/"/g, "&quot;")
    unsafe = unsafe.replace(/⁻¹/g, "&#x207b;&#x00B9;")
    unsafe = unsafe.replace(/⁻²/g, "&#x207b;&#x00B2;")
    unsafe = unsafe.replace(/⁻³/g, "&#x207b;&#x00B3;")
    unsafe = unsafe.replace(/¹/g, "&#x00B9;")
    unsafe = unsafe.replace(/²/g, "&#x00B2;")
    unsafe = unsafe.replace(/³/g, "&#x00B3;")
    unsafe = unsafe.replace(/\01/g,'&');
    return unsafe;
  }
  polish_verb(unsafe){
    ///needed by the translator
    return this.polish(unsafe);
  }
  polish(unsafe) {
    unsafe = unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
    return unsafe;
  }
  phrase_to_ref (label){
    let g = this.search_refmap(label);
    if(g){
      var secsign = String.fromCharCode(0xA7);
      let id = g.id||'';
      let saveas = g.saveas||'';
      if(g.chnum){
        var idnum = `${g.chnum}.${g.idnum}`;
      }else{
        var idnum = g.idnum;
      }
      if(0){
        if(g.sig=='HDGS'){
          idnum = `Section&#160;${secsign}${idnum}`
        }else if(g.name=='equation'){
          idnum = `Equation&#160;${idnum}`
        }else if(g.name=='figure'){
          idnum = `Figure&#160;${idnum}`
        }else if(g.name=='table'){
          idnum = `Table&#160;${idnum}`
        }else if(g.name=='listing'){
          idnum = `Listing&#160;${idnum}`
        }
      }
      return `<a href='${saveas}#${id}'>${idnum}</a>`;
    }
    return `<mark><tt>${label}</tt></mark>`
  }
  do_vbarchart (g) {
    var {s,w,h} = this.diagram.to_svg_vbarchart(g);
    var s =`<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='border:1px solid currentColor; padding:2pt' width='${w}mm' height='${h}mm' fill='currentColor' stroke='currentColor' >${s}</svg>`;
    return s;
  }
  do_xyplot (cnt) {
    var {s,w,h} = this.diagram.to_svg_xyplot(cnt);
    var s =`<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='border:1px solid currentColor; padding:2pt' width='${w}mm' height='${h}mm' fill='currentColor' stroke='currentColor' >${s}</svg>`;
    return s;
  }
  do_colorbox (cnt) {
    var {s,w,h} = this.diagram.to_svg_colorbox(cnt);
    var s =`<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='border:1px solid currentColor; padding:2pt' width='${w}mm' height='${h}mm' fill='currentColor' stroke='currentColor' >${s}</svg>`;
    return s;
  }
  phrase_to_math (str,style) {  
    var {s} = this.tokenizer.to_svgmath(str,style);
    return s;
  }
  phrase_to_uri(cnt) {
    return `<a href='${cnt}'>${cnt}</a>`
  }
  fence_to_verbatim(ss,style){
    ss = ss.map(s => this.polish(s));
    var text = ss.join('<br/>');
    return `<pre style='margin:0'>${text}</pre>`;
  }
  fence_to_diagram(ss,style){
    if(style.load){
      let name0 = style.load;
      if(this.my_diagram_ss_maps.has(name0)){
        let ss0 = this.my_diagram_ss_maps.get(name0);
        ss = ss0.concat(ss);
      }
    }
    let css_style = [];
    ///figure out the zoom
    var zoom = parseFloat(style.zoom);
    if(!Number.isFinite(zoom)){
      zoom = 1;
    }
    if(style.save){
      this.my_diagram_ss_maps.set(style.save,ss);
    }
    var { s } = this.diagram.to_diagram(ss,style);
    css_style.push(`box-sizing:border-box`);
    if(style.frame==1){
      css_style.push(`border:1px solid`);
    }
    if(style.width){
      let width = this.string_to_css_width(style.width,zoom);
      css_style.push(`width:${width}`);
      css_style.push(`height:auto`)
    }
    if(style.aspectratio){
      css_style.push(`aspect-ratio:${style.aspectratio}`);
    }
    if(style && style.float){
      let f = (style.float=='left')?'left':'right';
      css_style.push(`float:${f}`);
    }
    if(1){
      ///It is important to convert it to inline IMG because then the 'css_style' will take effect
      s = `<img class='IMG' alt='diagram' style='${css_style.join(';')}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}" />`;
    }
    return s;
  }
  fence_to_framed(ss, style) {
    var { s } = this.framed.to_framed(ss,'100%');
    return s;
  }
  fence_to_math(ss, style) {
    var line = this.tokenizer.to_svgmath_split(ss.join('\n'),style);
    var text = line.s;
    return text;
  }
  phrase_to_img(cnt) {
    let g = this.string_to_style(cnt);
    if(g.src){
      var src = g.src;
      this.imgs.push(src);
      var imgsrc = `./${src}`;///THIS is the URL that is assigned to <img src=...>
      var imgid = '';
      if (1) {
        var { imgsrc, imgid } = this.to_request_image(imgsrc);
        console.log('imgsrc=', imgsrc.slice(0, 40), 'imgid=', imgid);
      }
      ///figure out the zoom factor
      var zoom = parseFloat(g.zoom);
      if(!Number.isFinite(zoom)){
        zoom = 1;
      }
      console.log('james','zoom',zoom)
      let css_style = [];
      if(g.width && g.aspectratio){
        var width = this.string_to_css_width(g.width,zoom);
        css_style.push(`width:${width}`);
        css_style.push(`aspect-ratio:${g.aspectratio}`);
      }else if(g.width){
        var width = this.string_to_css_width(g.width,zoom);
        css_style.push(`width:${width}`)
      }
      if(g.frame==1){
        css_style.push(`border:1px solid`);
        css_style.push(`box-sizing:border-box`);
      }
      if(g.float){
        css_style.push(`float:${g.float=='left'?'left':'right'}`)
      }
      console.log('james','css_style',css_style)
      return `<img style='${css_style.join(';')}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
    }
    if(g.pic){
      var id = g.pic;
      if(id){
        let ss = this.fetch_ss_from_notes('pic',id);
        if(ss){
          return this.fence_to_diagram(ss,g);
        }
      }
      return '';
    }
  }
  fence_to_tabulate(ss, style) {
    let rows = this.ss_to_tabulate_rows(ss,style);
    rows = rows.map((ss) => ss.map(s => {
      s = this.unmask(s);
      return s;
    }));
    let text = this.rows_to_tabulate(rows, style, 0);
    return text;
  }
  para_to_equation(ss,style){
    let clusters = this.ss_to_clusters(ss);
    let d = [];
    clusters.forEach((ss) => {
      let text = this.fence_to_math(ss,style);
      text = `<div>${text}</div>`
      d.push(text);
    })
    let text = d.join('');
    let idnum = this.get_refmap_value(style,'idnum');
    let chnum = this.get_refmap_value(style,'chnum');
    if(chnum){
      idnum = `(${chnum}.${idnum})`;
    }else{
      idnum = `(${idnum})`;
    }
    if(1){
      let o = [];
      o.push(`<figure class='EQUATION' >`);
      o.push(this.to_caption_text(style,"equation"));
      o.push(text);
      o.push(`</figure>`);
      text = o.join('\n');
      return text;
    }
  }
  para_to_table(ss,style){
    let rows = this.ss_to_tabulate_rows(ss,style);
    rows = rows.map((ss) => ss.map(s => {
      s = this.unmask(s);
      return s;
    }));
    if(style.long){
      var text = this.rows_to_tabulate(rows, style, 1);
      let o = [];
      o.push(`<figure class='TABLE LONG' >`);
      o.push(this.to_caption_text(style,"table"));
      o.push(text);
      o.push('</figure>');
      text = o.join('\n');
    }else{
      var text = this.rows_to_tabulate(rows, style, 0);
      let o = [];
      o.push(`<figure class='TABLE' >`);
      o.push(this.to_caption_text(style,"table"));
      o.push(text);
      o.push('</figure>');
      text = o.join('\n');
    }
    return text;
  }
  para_to_longtable(ss, style) {
    let rows = this.ss_to_tabulate_rows(ss,style);
    rows = rows.map((ss) => ss.map(s => {
      s = this.unmask(s);
      return s;
    }));
    let text = this.rows_to_tabulate(rows,style,1);
    if (1) {
      let o = [];
      o.push(`<figure class='TABLE LONG' >`);
      o.push(this.to_caption_text(style,"table"));
      o.push(text);
      o.push('</figure>');
      text = o.join('\n');
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
    return `<div class='TEXT MULTI' >${text}</div>`;
  }
  para_to_itemized(ss,style) {
    let itms = this.ss_to_itemized_itms(ss);
    itms = itms.map(p => {
      let text = p.text;
      text = this.unmask(text);
      p.text = text;
      return p;
    });
    let text = this.itms_to_itemized(itms,style);
    return `<div class='TEXT ITEMIZED' >${text}</div>`;
  }
  para_to_verse(ss,style) {
    let itms = this.ss_to_verse_itms(ss, style);
    itms.forEach(p => {
      p.text = this.unmask(p.text);
    })
    let text = this.itms_to_lines(itms, style);
    return `<div class='TEXT LINES' >${text}</div>`;
  }
  para_to_lines(ss,style) {
    let itms = this.ss_to_lines_itms(ss, style);
    itms.forEach(p => {
      p.text = this.unmask(p.text);
    })
    let text = this.itms_to_lines(itms, style);
    return `<div class='TEXT LINES' >${text}</div>`;
  }
  para_to_diagram(ss,style){
    var text = this.fence_to_diagram(ss,style);
    if (1) {
      let o = [];
      o.push(`<figure class='FIGURE' >`);
      if(style.nc){
        ///no caption
      }else{
        o.push(this.to_caption_text(style,"figure"));
      }
      o.push(text);
      o.push('</figure>');
      text = o.join('\n');
    }
    return text;  
  }
  para_to_figure(ss,style){
    let itms = this.ss_to_imgrid_itms(ss,style);
    itms.forEach((p) => {
      p.sub = this.unmask(p.sub);
    })
    var text = this.imgrid_to_htmltable(itms,style);
    if (1) {
      let o = [];
      o.push(`<figure class='FIGURE' >`);
      if(style.nc){
        ///no caption
      }else{
        o.push(this.to_caption_text(style,"figure"));
      }
      o.push(text);
      o.push('</figure>');
      text = o.join('\n');
    }
    return text;  
  }
  para_to_listing(ss,style){
    var d = ss.map((x, i) => {
      var line = x;
      var lineno = `${i + 1}`;
      var lineno = `<small style='position:absolute;right:100%;top:50%;transform:translateY(-50%);text-align:right;display:inline-block;padding-right:0.5em;'> ${lineno}</small>`;
      var line = this.polish(line);
      //var wholeline = `${lineno}${line}`;
      var wholeline = `${line}${lineno}`;
      wholeline = `<code style='white-space:pre;position:relative;'>${wholeline}</code>`;
      return (`${wholeline}`);
    });
    var text = d.join('<br/>\n');
    text = `<div>${text}</div>`
    if(1){
      let o = [];
      o.push(`<figure class='LISTING' >`);
      o.push(this.to_caption_text(style,"listing"));
      o.push(text);
      o.push('</figure>');
      text = o.join('\n');
    }
    return text;
  }
  para_to_blockquote(ss,style) {
    let text = ss.join('\n').trim();
    text = this.unmask(text, style);
    return `<div class='TEXT QUOTE' >${text}</div>`;
  
  }
  para_to_story(ss,style){
    let text = ss.join('\n');
    text = this.unmask(text, style);
    return `<div class='TEXT STORY' >${text}</div>`;
  }
  para_to_plaintext(ss, style) {
    let text = ss.join('\n');
    text = this.unmask(text, style);
    return `<div class='TEXT' >${text}</div>`;
  }
  phrase_to_br() {
    let text = '<br/>';
    return text;
  }
  phrase_to_vspace(cnt){
    return `<span style='display:block;height:${cnt}'></span>`;
  }
  phrase_to_hspace(cnt){
    return `<span style='display:inline-block;width:${cnt}'></span>`;
  }
  phrase_to_frac(cnt){
    var re = /\s*(?:\/|$)\s*/;
    var ss = cnt.split(re);
    var fs = `${this.tokenizer.frac_rate}em`;
    if(ss.length>1){
      let top = ss[0];
      let bot = ss[1];
      top = this.smooth(top);
      bot = this.smooth(bot);
      return `<table border='0' style='vertical-align:middle;display:inline-block;border-collapse:collapse'><tr><td style='text-align:center;border-bottom:1px solid;padding:0;font-size:${fs}'>${top}</td></tr><tr><td style='text-align:center;border-top:1px solid;padding:0;font-size:${fs}'>${bot}</td></tr></table>`
    }else{
      cnt = this.smooth(cnt);
      return `<table border='0' style='vertical-align:middle;display:inline-block;border-collapse:collapse'><tr><td style='text-align:center;border-bottom:1px solid;padding:0;font-size:${fs}'>1</td></tr><tr><td style='text-align:center;border-top:1px solid;padding:0;font-size:${fs}'>${cnt}</td></tr></table>`
    }
  }
  phrase_to_sfrac(cnt){
    var re = /\s*(?:\/|$)\s*/;
    var ss = cnt.split(re);
    if(ss.length>1){
      let top = ss[0];
      let bot = ss[1];
      top = this.smooth(top);
      bot = this.smooth(bot);
      return `<sup>${top}</sup>/<sub>${bot}</sub>`
    }
    cnt = this.smooth(cnt);
    return `<sup>1</sup>/<sub>${cnt}</sub>`
  }
  phrase_to_sup(cnt){
    var re = /\s*(?:\^|$)\s*/;
    var ss = cnt.split(re);
    if(ss.length>1){
      let base = ss[0];
      let exp = ss[1];
      base = this.smooth(base);
      exp = this.smooth(exp);
      return `${base}<sup>${exp}</sup>`
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
      return `${base}<sub>${exp}</sub>`
    }
    cnt = this.smooth(cnt);
    return cnt;
  }
  phrase_to_sqrt(cnt){
    cnt = this.smooth(cnt);
    return `&#x221A;<span style='text-decoration:overline'>${cnt}</span>`;
  }
  text_to_typeface(text,type) {

    type = type || '';
    switch (type) {
      case 'verb': {
        return `<kbd style='white-space:pre'>${text}</kbd>`;
        break;
      }
      case 'code': {
        return `<code>${text}</code>`
        break;
      }
      case 'em': {
        return `<i>${text}</i>`
        break;
      }
      case 'b': {
        return `<b>${text}</b>`
        break;
      }
      case 'overstrike': {
        return `<s>${text}</s>`
        break;
      }
      case 'var': {
        return `<var>${text}</var>`
        break;
      }
      default: {
        return `<span>${text}</span>`
        break;
      }
    }
  }
  translate_to_ruby(items){
    let o = [];
    for(let item of items){
      o.push(`<rb>${item[0]}</rb><rt>${item[1]}</rt>`);
    }
    let text = o.join('');
    text = `<ruby>${text}</ruby>`;
    return text;
  }


  to_math_vertical_align(w,h,mid,fs,dy){
    var W   = w / fs;
    var H   = h / fs;
    var MID = mid / fs;
    if(1){
      ///new way
      var BOT = H - MID - 0.5;
      var va = -0.23;
      va -= BOT;
      ///vertical-align:-0.23em has been shown that the bottom
      ///of this SVG is aligned with the bottom of the surrounding text
      return va;
    }else{
      ///old way
      var descent = (1 - dy);
      var va = -descent-(H-1)/2;
      va -= H/2 - MID;
      return va;
    }
  }

  to_nav_style(){
    return '';
    var nav_opts = [];
    nav_opts.push('font-size:0.76rem');
    nav_opts.push('position:absolute');
    nav_opts.push(`left:${this.to_conf_width()+2*this.to_conf_margin()+2}mm`);
    nav_opts.push(`top:${this.to_conf_margin()}mm`)
    return nav_opts.join(';');
  }

  to_page_style(){
    var fontsize = this.to_bodyfontsize();
    var main_opts = [];
    main_opts.push(`background-color:white`);
    main_opts.push(`font-size:${fontsize}pt`);
    main_opts.push(`margin:${this.to_conf_margin()}mm`);
    main_opts.push(`width:${this.to_conf_width()}mm`);
    return main_opts.join(';');
  }
  to_toc(){
    var items = this.parser.blocks.map(x => {
      var {id,sig,part,name,text,idnum} = x; 
      text = this.unmask(text);
      if(sig=='HDGS'){
        if(name=='part'){
          return `<li><a href='#${id}'>Part ${idnum} ${text}</a></li>`;
        }else{ 
          return `<li><a href='#${id}'>${idnum} ${text}</a></li>`;
        }
      } else {
        return '';
      }
    });
    items = items.filter(x => x?true:false);
    return `<ol style='list-style-type:none;'> ${items.join('\n')} </ol>`;
  }
  two_integers_to_range_string(start,end){
    ///return a list of integers separated by a space from start to end-1
    start = parseInt(start);
    end = parseInt(end);
    var d = [];
    if(Number.isFinite(start)&&Number.isFinite(end)){
      if(end > start){
        for(let i=start; i < end; ++i){
          d.push(i);
          if(d.length > 2048){
            break;
          }
        }
      }
      if(end < start){
        for(let i=start; i > end; --i){
          d.push(i);
          if(d.length > 2048){
            break;
          }
        }
      }
    }
    return d.join(' ');
  }
  to_caption_text(style,name){
    var caption=this.fetch_caption_from_notes();
    var id=this.get_refmap_value(style,'id');
    var idnum=this.get_refmap_value(style,'idnum');
    var chnum=this.get_refmap_value(style,'chnum');
    if(chnum && idnum){
      idnum = chnum + '.' + idnum;
    } else if (chnum) {
      idnum = chnum;
    }
    if(name=='equation'){
      return `<figcaption id='${id}'>(${idnum})</figcaption>`;
    }
    if(name=='figure'){
      var title = "Figure";
    }else if(name=='table'){
      var title = 'Table';
    }else if(name=='listing'){
      var title = 'Listing';
    } else {
      var title = '';
    }
    return `<figcaption id='${id}'>${title} ${idnum}: &#160; ${this.unmask(caption)}</figcaption>`;
  }

  to_subfig_num(j) {
    return const_subfignums[j];
  }

  to_part_num(j) {
    ///The first part is 1, not zero
    return const_partnums[j];
  }

  to_request_image(imgsrc) {
    var imgid = '';
    return {imgsrc, imgid};
  }

  to_colors(color){
    return this.diagram.to_colors(color);
  }

  to_bodyfontsize(){
    return this.conf('html.bodyfontsize',12);
  }
  to_mathfontsize(){
    return this.conf('html.mathfontsize',12);
  }
  to_conf_width(){
    return this.conf('html.width',130);
  }
  to_conf_margin(){
    return this.conf('html.margin',4);
  }
  rows_to_tabulate(rows,style,islongtable){
    var border = style.border||0;
    var ncols = rows.length ? rows[0].length : 1;
    var nrows = rows.length;
    const lr='1ex';
    const sp='2ex';
    if (islongtable || style.fr) {
      var frs = this.string_to_array(style.fr);
      var frs = frs.map(x => parseInt(x));
      var frs = frs.filter(x => Number.isFinite(x));
      var frs = frs.filter(x => (x > 0));
      if(frs.length > ncols){
        frs.slice(ncols);
      }else{
        while(frs.length < ncols){
          frs.push(1);
        }
      }
      var sum = frs.reduce((prev,curr) => prev+curr,0);
      var frs = frs.map(x => `${x / sum * 100}%`);
    } else {
      var frs = 'x'.repeat(ncols).split('').map(x => ``);
    }
    var d = [];
    if(border==1){
      ///the top/bottom/left/right/vertical/horizontal border lines
      ///a user-inserted hline will result in a double-hline
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          ///d.push(`<tr><td style='' colspan='${ncols}'></td></tr>`);
          ///***TO BE IGNORED*** because it already has single border line between the rows
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`<tr><td style='' colspan='${ncols}'></td></tr>`);
          continue;
        }
        pp = pp.map((x, i) => `<td style='width:${frs[i]};padding:0 ${lr};border:1px solid;'>${x}</td>`);
        var p = pp.join('');
        var p = `<tr>${p}</tr>`;
        d.push(p);
      }
    }else if(border==2){
      ///the top/bottom/left/right/vertical, no horizontal
      ///a user-inserted hline will result in a single-hline
      let border_top = '';
      let border_bot = '';
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          border_top = '1px solid';
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`<tr><td style='border-top:1px solid;border-bottom:1px solid;' colspan='${ncols}'></td></tr>`);
          continue;
        }
        if(j==0) border_top = '1px solid';
        if(j==nrows-1) border_bot = '1px solid';
        pp = pp.map((x, i) => `<td style='width:${frs[i]};padding:0 ${lr};border-left:1px solid;border-right:1px solid;border-top:${border_top};border-bottom:${border_bot};'>${x}</td>`);
        var p = pp.join('');
        var p = `<tr>${p}</tr>`;
        border_top = '';
        border_bot = '';
        d.push(p);
      }
    }else if(border==3){
      ///only the top/bottom/left/right lines
      let border_top = '';
      let border_bot = '';
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          border_top = '1px solid';
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`<tr><td style='border-top:1px solid;border-bottom:1px solid;' colspan='${ncols}'></td></tr>`);
          continue;
        }
        if(j==0) border_top = '1px solid';
        if(j==nrows-1) border_bot = '1px solid';
        pp = pp.map((x, i) => {
          let border_lft = (i==0)?'1px solid':'';
          let border_rt = (i==pp.length-1)?'1px solid':'';
          return `<td style='width:${frs[i]};padding:0 ${lr};border-left:${border_lft};border-right:${border_rt};border-top:${border_top};border-bottom:${border_bot}'>${x}</td>`;
        });
        var p = pp.join('');
        var p = `<tr>${p}</tr>`;
        border_top = '';
        border_bot = '';
        d.push(p);
      }
    }else if(border==4){
      ///only the top/bottom lines
      let border_top = '';
      let border_bot = '';
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          border_top = '1px solid';
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`<tr><td style='border-top:1px solid;border-bottom:1px solid;' colspan='${ncols}'></td></tr>`);
          continue;
        }
        if(j==0) border_top = '1px solid';
        if(j==nrows-1) border_bot = '1px solid';
        pp = pp.map((x, i) => {
          if (i==0)                var pad=`0 ${lr} 0 0`;
          else if (i+1==pp.length) var pad=`0 0 0 ${lr}`;
          else                     var pad=`0 ${lr}`;
          return (`<td style='width:${frs[i]};padding:${pad};border-top:${border_top};border-bottom:${border_bot};'>${x}</td>`);
        });
        var p = pp.join('');
        var p = `<tr>${p}</tr>`;
        border_top = '';
        border_bot = '';
        d.push(p);
      }
    }else{///border=0
      let border_top = '';
      for (var j = 0; j < nrows; ++j) {
        var pp = rows[j];
        if (this.pp_is_hline(pp)) {
          border_top = '1px solid';
          continue;
        }
        if (this.pp_is_dhline(pp)) {
          d.push(`<tr><td style='border-top:1px solid;border-bottom:1px solid;' colspan='${ncols}'></td></tr>`);
          continue;
        }
        pp = pp.map((x, i) => {
          if (i==0)                var pad=`0 ${lr} 0 0`;
          else if (i+1==pp.length) var pad=`0 0 0 ${lr}`;
          else                     var pad=`0 ${lr}`;
          return (`<td style='width:${frs[i]};padding:${pad};border-top:${border_top};'>${x}</td>`);
        });
        var p = pp.join('');
        var p = `<tr>${p}</tr>`;
        border_top = '';
        d.push(p);
      }
    }
    var text = d.join('\n');
    var css_style = [];
    if(islongtable){
      css_style.push('display:block');///always inline-block so that it can be placed side-by-side
    }else{
      css_style.push('display:inline-block');///always inline-block so that it can be placed side-by-side
    }
    if(style.float){
      var float = (style.float == 'left') ? 'left' : 'right';
      css_style.push(`float:${float}`)
    }
    if(style.zoom){
      css_style.push(`zoom:${style.zoom}`)
    }
    css_style = css_style.join(';');
    var text = `<table style='${css_style}' border='0'>${text}</table>`;
    return text;
  }
  rows_to_multi(rows,style){
    var ncols = rows.length && rows[0].length;
    var nrows = rows.length;
    var n = ncols;
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = 0.02;
    var frs = this.string_to_frs(style.fr,n);
    var d = [];
    for(let j=0; j < nrows; ++j){
      let pp = rows[j];
      pp = pp.slice(0,n);//no longer than ncols
      d.push('<tr>');
      pp.forEach((text, i) => {
        let fr = frs[i];
        d.push(`<td style='width:${fr*w*100}%'>`);
        d.push(text);
        d.push(`</td>`);
        if(i<n-1){
          d.push(`<td style='width:${gap*100}%'></td>`);
        }
      });
      d.push('</tr>');
    }
    var text = d.join('\n');
    var text = `<table border='0' style='width:100%'>${text}</table>`;
    return text;
  }
  itms_to_multi(itms,style){
    var n = parseInt(style.n)||1;
    var fr = style.fr||'';
    var border = style.border||0;
    var glue = this.glue_to_vspace(style.glue);
    //var w = (1 - (0.02 * (n - 1))) / n;
    //var gap = 0.02;
    if(border==1){
      var frs = this.string_to_frac(fr,n,0);
      var d = [];
      for(let j=0; j < itms.length; j+=n){
        let pp = itms.slice(j,j+n);///could be shorter than n
        d.push('<tr>');
        pp.forEach((text, i) => {
          let fr = frs[i];
          d.push(`<td style='padding:${glue}pt 0.5em;width:${fr*100}%'>`);
          d.push(text);
          d.push(`</td>`);
        });
        d.push('</tr>');
      }
      var text = d.join('\n');
      var text = `<table border='${border}' style='width:100%'>${text}</table>`;
    }else{
      var gap = 0.02;
      var frs = this.string_to_frac(fr, n, gap);
      var d = [];
      for (let j = 0; j < itms.length; j += n) {
        let pp = itms.slice(j, j + n);///could be shorter than n
        d.push('<tr>');
        pp.forEach((text, i) => {
          let fr = frs[i];
          d.push(`<td style='padding:${glue}pt 0;width:${fr * 100}%'>`);
          d.push(text);
          d.push(`</td>`);
          d.push(`<td style='width:${gap*100}%'></td>`);
        });
        if(pp.length){
          d.pop();
        }
        d.push('</tr>');
      }
      var text = d.join('\n');
      var text = `<table border='${border}' style='width:100%'>${text}</table>`;
    }
    return text;
  }
  _itms_to_multi(itms,style){
    var n = parseInt(style.n)||1;
    var fr = style.fr||'';
    var border = style.border||0;
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = 0.02;
    var frs = this.string_to_frs(fr,n);
    var d = [];
    for(let j=0; j < itms.length; j+=n){
      let pp = itms.slice(j,j+n);///could be shorter than n
      d.push('<tr>');
      pp.forEach((text, i) => {
        let fr = frs[i];
        d.push(`<td style='width:${fr*w*100}%'>`);
        d.push(text);
        d.push(`</td>`);
        if(i<n-1){
          d.push(`<td style='width:${gap*100}%'></td>`);
        }
      });
      d.push('</tr>');
    }
    var text = d.join('\n');
    var text = `<table border='${border}' style='width:100%'>${text}</table>`;
    return text;
  }
  cols_to_multi(cols){
    var n = cols.length;
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = 0.02;
    var d = [];
    cols.forEach((text, i) => {
      d.push(`<td style='width:${w*100}%'>`);
      d.push(text);
      d.push(`</td>`);
      if(i<n-1){
        d.push(`<td style='width:${gap*100}%'></td>`);
      }
    });
    var text = d.join('\n');
    var text = `<tr>${text}</tr>`;
    var text = `<table border='0' style='width:100%'>${text}</table>`;
    return text;
  }
  __itms_to_itemized__(itms,style){
    if(itms.length){
      if(itms[0].bull=='OL'){
        let pp = itms.map(p => {
          if(p.type=='A'){
            return `<li class='TEXT' type='A' value='${p.value}'>${p.text}</li>`;
          }
          if(p.type=='a'){
            return `<li class='TEXT' type='a' value='${p.value}'>${p.text}</li>`;
          }
          if(typeof p.value == 'number'){
            return `<li class='TEXT' value='${p.value}'>${p.text}</li>`  
          }
          return `<li class='TEXT' >${p.text}</li>`
        });
        return `<ol class='TEXT' >${pp.join('\n')}</ol>`;
      }
      else {
        let pp = itms.map(p => `<li>${p.text}</li>`);
        return `<ul class='TEXT' >${pp.join('\n')}</ul>`;
      }
    }
    return `<ul class='TEXT' ><li></li></ul>`;  
  }
  itms_to_itemized(itms,style){
    const bullet = '&#x2022;'
    if(itms.length){
      let pp = itms.map(p => {
        if(p.type=='A'){
          return `<div>${this.to_A_letter(p.value)}${p.ending} ${p.text}</div>`;
        }
        if(p.type=='a'){
          return `<div>${this.to_a_letter(p.value)}${p.ending} ${p.text}</div>`;
        }
        if(typeof p.value == 'number'){
          return `<div>${p.value}. ${p.text}</div>`  
        }
        return `<div>${bullet} ${p.text}</div>`
      });
      return `<div>${pp.join('\n')}</div>`;
    }
    return `<div></div>`;  
  }
  itms_to_lines(itms,style){
    var d = [];
    var n = parseInt(style.n)||1;
    var m = Math.floor(itms.length / n);
    var z = itms.length - n * m;
    var k = z ? (m + 1) : (m);
    var frs = this.string_to_frac(style.fr,n,0.02);
    var cols = [];
    for (let j = 0, i = 0; j < itms.length; i += 1, j += k) {
      var pp = itms.slice(j, j + k).map(p => p.text)
      cols.push(pp);
    }
    d.push(`<table border='0' style='width:100%'>`);
    for(let i = 0; i < k; ++i){
      let rr = cols.map(pp => pp[i]||'');
      rr = rr.map((s,j) => `<td style='width:${frs[j]*100}%;padding:0;'>${s}</td>`);
      let text = rr.join(`<td style='width:2%;padding:0;'></td>`);
      text = '<tr>' + text + '</tr>';
      d.push(text);
    }
    d.push(`</table>`);
    return d.join('\n')
  }
  pp_to_multi_itemized(itms,style,name){
    var fr = style.fr||'';
    var n = style.n||1;
    var d = [];
    var m = Math.floor(itms.length / n);
    var z = itms.length - n * m;
    var k = z ? (m + 1) : (m);
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = 0.02;
    var frs = this.string_to_frs(fr, n);
    d.push(`<table border='0' style='width:100%'><tr>`);
    for (let j = 0,i=0; j < itms.length; i+=1,j+=k) {
      var pp = itms.slice(j, j + k);
      let fr = frs[i];
      d.push(`<td style='width:${fr*w*100}%'><${name} class='TEXT' >\n${pp.join('\n')}\n</${name}></td>`);
      if (i < n - 1) {
        d.push(`<td style='width:${gap * 100}%'></td>`);
      }
    }
    d.push(`</tr></table>`);
    return d.join('\n')
  }
  imgrid_to_htmltable(itms,style) {
    var n = parseInt(style.n)||1;
    var d = [];
    var wd = (100 - 2*(n-1))/n;
    var gap = `<span style='width:2%;display:inline-block;'></span>`;
    itms.forEach( p => {
      let g = p.g;
      let sub = p.sub;
      g.width = `${wd}%`;///reset its width to be the percentage of the current window
      let cnt = this.string_from_style(g);
      let img = this.phrase_to_img(cnt);
      let txt = `<span class='SUB' style='display:inline-block;width:${wd}%;'>${sub}</span>`;
      p.img = img;
      p.txt = txt;
    });
    while(itms.length){
      let pp = itms.slice(0,n);
      itms = itms.slice(n);
      let imgs = pp.map(x => x.img);
      let txts = pp.map(x => x.txt);
      d.push(`${imgs.join(gap)}`);
      d.push(`${txts.join(gap)}`);
    }
    var text = d.join('\n'); 
    var text = `<div style='white-space:pre'>${text}</div>`;
    return text;
  }
  __imgrid_to_htmltable(itms,style) {
    var frame = style.frame||0;
    var n = parseInt(style.n)||1;
    var d = [];
    var imgsrcs = [];
    var wd = (100 - 2*(n-1))/n;
    var span = `<span style='width:2%;display:inline-block;'></span>`;
    var itms = itms.map( img => {
      const {src,sub} = img;
      var imgsrc = `./${src}`;///THIS is the URL that is assigned to <img src=...>
      var imgid='';
      if (1){          
        var {imgsrc,imgid} = this.to_request_image(imgsrc);
        console.log('imgsrc=',imgsrc.slice(0,40),'imgid=',imgid);
      }
      img = {src,imgsrc,imgid,sub};
      imgsrcs.push(src);
      this.imgs.push(src);
      return img;
    });
    var mypp = itms.map( img => {
      var {src,imgsrc,imgid,sub} = img;
      var img_style = `width:${wd}%;`;
      if(frame){
        img_style += 'border:1px solid;';
      }
      var td_style = `text-align:center;vertical-align:bottom;width:${100/n}%;`;
      var img = `<img id='imgid${imgid}' style='${img_style}' src='${imgsrc}' alt='${src}'/>`;
      var sub_text = sub;
      var tdstyle = `display:inline-block;text-align:center;vertical-align:top;width:${wd}%;`;
      var sub = `<span style='${tdstyle}'>${sub_text}</span>`;
      return {img,sub};
    });
    while(mypp.length){
      var pp = mypp.slice(0,n);
      mypp = mypp.slice(n);
      var itms = pp.map(x => x.img);
      var subs = pp.map(x => x.sub);
      d.push(`${itms.join(span)}`);
      d.push(`${subs.join(span)}`);
    }
    var text = d.join('\n'); 
    var text = `<div style='white-space:pre'>${text}</div>`;
    return text;
  }
  itms_to_longtable(itms, style) {
    var fr = style.fr||'';
    var hline = style.hline||'';
    var glue = style.glue||'';
    var n = parseInt(style.n)||1;
    var label = label || '';
    var caption = caption || '';
    var fr = fr || '';
    var glue = glue || '';
    var hline = hline || 0;
    var d = [];
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = 0.02;
    var frs = this.string_to_frs(fr, n);
    var hlines = this.string_to_array('t m b r');
    var vlines = this.string_to_array('*');
    var t = 1;
    var h = 6;
    frs = this.ww_to_hundred(frs);
    var d = [];
    var header = itms.slice(0, n);//pp could be shorter than n
    var header = header.map((x, i) => `<th style='\
padding:${t}pt ${h}pt;\
${'width:' + frs[i] + '%;'}\
${(vlines.indexOf(`${i}`) >= 0 || vlines.indexOf('*') >= 0) ? 'border-left:1px solid;' : ''}\
${(vlines.indexOf(`${i + 1}`) >= 0 || vlines.indexOf('*') >= 0) ? 'border-right:1px solid;' : ''}\
${hlines.indexOf('t') >= 0 ? 'border-top:1px solid;' : ''}\
${hlines.indexOf('m') >= 0 ? 'border-bottom:1px solid;' : ''} '>${x}</th>`);
    d.push(`<thead>`);
    d.push(`<tr>${header.join('')}</tr>`);
    d.push(`</thead>`);
    d.push(`<tbody>`);
    for (var k=0, j = n; j < itms.length; j+=n, k++) {
      var pp = itms.slice(j, j + n);//pp could be shorter than n
      var pp = pp.map((x, i) => `<td style='\
padding:${t}pt ${h}pt;\
${'width:' + frs[i] + '%;'}\
${(vlines.indexOf(`${i}`) >= 0 || vlines.indexOf('*') >= 0) ? 'border-left:1px solid;' : ''}\
${(vlines.indexOf(`${i + 1}`) >= 0 || vlines.indexOf('*') >= 0) ? 'border-right:1px solid;' : ''}\
${k == 0 && hlines.indexOf('m') >= 0 ? 'border-top:1px solid;' : ''}\
${k > 0 && hlines.indexOf('r') >= 0 ? 'border-top:1px solid;' : ''}\
${j+n >= itms.length && hlines.indexOf('b') >= 0 ? 'border-bottom:1px solid;' : ''} '>${x}</td>`);
      d.push(`<tr>${pp.join('')}</tr>`);
    }
    d.push(`</tbody>`);
    var text = d.join('\n');
    text = `<table border='0' style='border-collapse:collapse;width:100%;'>${text}</table>`;
    return text;
  } 
  itms_to_cols(itms,style) {
    var n = parseInt(style.n)||1;
    var n = n || 1;
    var m = Math.floor(itms.length / n);
    var z = itms.length - n * m;
    var k = z ? (m + 1) : (m);
    var cols = [];
    for (var j = 0; j < itms.length; j += k) {
      var pp = itms.slice(j, j + k);
      cols.push(pp);
    }
    var d = [];
    for (var j = 0; j < k; ++j) {
      var pp = cols.map(x => x[j] || '');
      pp = pp.map((x, i) => `<td>${x}</td>`);
      let gap = `<td style='width:1em'></td>`;
      var p = pp.join(gap);
      var p = `<tr>${p}</tr>`;
      d.push(p);
    }
    var text = d.join('\n');
    var text = `<table border='0'>${text}</table>`;
    return text;
  }
  itms_to_rows(itms,style) {
    var n = parseInt(style.n)||1;
    var n = n || 1;
    var rows = [];
    var k = 0;
    for (var j=0; j < itms.length; j++) {
      let p = itms[j];
      if(this.p_is_hline(p)){
        rows.push('-'.repeat(n).split(''));
        k = 0;
        continue;
      }
      if(k==0){
        rows.push([p]);
      }else{
        let pp = rows.pop();
        pp.push(p);
        rows.push(pp);
      }
      k++;
      k %= n;
    }
    var d = [];
    for (var j = 0; j < rows.length; ++j) {
      var pp = rows[j];
      if (this.pp_is_hline(pp)) {
        d.push(`<tr><td style='border-top:1px solid' colspan='${2*n-1}'></td></tr>`);
        continue;
      }
      pp = pp.map((x, i) => `<td>${x}</td>`);
      let gap = `<td style='width:1em'></td>`;
      var p = pp.join(gap);
      var p = `<tr>${p}</tr>`;
      d.push(p);
    }
    var text = d.join('\n');
    var text = `<table border='0'>${text}</table>`;
    return text;
  }
  string_to_css_length(s) {
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!s) {
      return '';
    }
    var re = /^(.*)\%$/;
    if (re.test(s)) {
      return s;
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if (re.test(s)) {
      return s;
    }
    var num = parseFloat(s);
    if (Number.isFinite(num)) {
      return `${num.toFixed(3)}mm`;
    }
    return '';
  }
  string_to_css_width(s,zoom) {
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!s) {
      return '';
    }
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(s))!==null) {
      var num = v[1];
      num *= zoom;
      return `${num}%`;
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if ((v=re.exec(s))!==null) {
      var num = v[1];
      num *= zoom;
      return `${num}${v[2]}`;
    }
    var num = parseFloat(s);
    if (Number.isFinite(num)) {
      num *= zoom;
      return `${num.toFixed(3)}mm`;
    }
    return '';
  }
  do_info(block){
    let {row1,row2} = block;
    if(typeof row1 == 'number' && typeof row2 == 'number'){
      block.info = `<span rows='${this.two_integers_to_range_string(row1,row2)}'></span>`;
    } else {
      block.info = '';
    }
  }
  to_attr(block){
    row1=row1||'0';
    row2=row2||'0';
    var htmlattrs = [];
    htmlattrs.push(`id='${id}'`);
    htmlattrs.push(`sig='${sig}'`);
    htmlattrs.push(`idnum='${idnum}'`);
    htmlattrs.push(`subf='${subf}'`);
    htmlattrs.push(`rows='${this.two_integers_to_range_string(row1,row2)}'`);
    return htmlattrs.join(' ');
  }
  glue_to_vspace(glue){
    var glue = parseInt(glue) || 0;
    return glue;
  }
  rows(row1,row2){
    if(typeof row1=='number' && typeof row2=='number'){
      return this.two_integers_to_range_string(row1,row2);
    }else{
      return '';
    }
  }
}

module.exports = { NitrilePreviewHtml };
