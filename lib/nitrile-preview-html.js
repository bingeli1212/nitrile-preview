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
    this.flags = {};
    this.ref_map = {};
    this.equation_num = 0;
    this.figure_num = 0;
    this.table_num = 0;
    this.listing_num = 0;
    this.css_id = 0;
  }
  do_PART(block) {
    ///this method is currently deprecated
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
    let {hdgn,title,name,style,row1,row2} = block;
    var o = [];
    title = this.unmask(title);
    ///note that 'name' could be set to 'part'
    if(name=='part'){
      o.push(`<h1>Part. ${title}</h1>`);
    }else{
      hdgn = this.name_to_hdgn(name,hdgn);
      if(hdgn==0) {
        o.push(`<h1>${title}</h1>`);
      } 
      else if(hdgn==1) {
        o.push(`<h2>${title}</h2>`);
      } 
      else if(hdgn==2) {
        o.push(`<h3>${title}</h3>`);
      } 
      else {
        o.push(`<h4>${title}</h4>`);
      }
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
      var {bull,bullet,value,br,text,type,row1,row2,more} = item;
      text = text || '';
      let extra_text = '';
      if(more && more.length){
        more.forEach((plitem) => {
          let {lines,row1,row2} = plitem;
          extra_text += `${this.untext(lines)}`;
        });
      }
      let nested = (count>1)? 'INNER' : 'OUTER';
      switch (bull) {
        case 'OL': {
          count++;
          let nested = (count>1)? 'INNER' : 'OUTER';
          o.push(`<ol class='PLST OL ${nested}' >`);
          break;
        }
        case 'UL': {
          count++;
          let nested = (count>1)? 'INNER' : 'OUTER';
          o.push(`<ul class='PLST UL ${nested}' >`);
          break;
        }
        case 'DL': {
          count++;
          let nested = (count>1)? 'INNER' : 'OUTER';
          o.push(`<dl class='PLST DL ${nested}' >`);
          break;
        }
        case 'HL': {
          count++;
          let nested = (count>1)? 'INNER' : 'OUTER';
          o.push(`<ul class='PLST HL ${nested}' style='list-style:none;padding-left:1em;' >`);
          break;
        }
        case 'LI': {
          if(type=='hanginglist'){
            text = this.unmask(text);
            o.push(`<li style='text-indent:-1em;' ><p class='PARA'>${text}</p></li>${extra_text}`);
          }
          else if(type=='description'){
            text = this.unmask(text);
            o.push(`<dt><p class='PARA'><b>${text}</b></p></dt> <dd>${extra_text}</dd>`);
          }
          else{
            text = this.unmask(text);
            if(bullet=='*'){
              value = ++this.enumerate_counter;  
            }
            o.push(`<li type='${item.type}' value='${value}' ><p class='PARA'>${text}</p></li>${extra_text}`);
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
        case '/HL': {
          o.push(`</ul>`);
          count--;
          break;
        }
      }
    }
    o.push('');
    block.html = o.join('\n');
  }
  do_SAMP(block) {
    var {row1,row2,sig,body,parser} = block;
    body = this.trim_samp_body(body);
    body = body.map(x => this.polish(x));
    body = body.map(x => this.rubify(x));
    var text = body.join('<br/>');
    var o = []; 
    o.push(`<pre class='SAMP'>${text}</pre>`);
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
    o.push(`<p class='PRIM PRIM${hdgn}' >${text}</p>`);
    o.push('');
    block.html = o.join('\n');
  }
  do_PARA(block) {
    var {body,style} = block;
    let text = this.untext(body,style);
    block.html = text;
  }
  do_NOTE(block){
    super.do_NOTE(block);
    block.html = '';
  }
  smooth (unsafe) {
    const T1 = String.fromCharCode(0x1);
    /// change string for dialog and others, such that these
    /// texts are to be part of a SVG text element, thus any HTML markup
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
    unsafe = this.polish(unsafe);
    unsafe = this.replace_blanks_with(unsafe,'&#160;')
    return unsafe;
  }
  polish(unsafe) {
    unsafe = unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
    return unsafe;
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
  ///
  /// phrase_to_XXX
  ///
  phrase_to_inlinemath (str,style) {  
    var {s} = this.tokenizer.to_svgmath(str,style,'inlinemath');
    return s;
  }
  phrase_to_displaymath (str,style) {  
    var {s} = this.tokenizer.to_svgmath(str,style,'displaymath');
    return s;
  }
  phrase_to_math(mode,style) {
    if(mode.body){
      var str = mode.body.join('\n');
      var {s} = this.tokenizer.to_svgmath(str,style,'math');
      return s;
    }
    return '';
  }
  phrase_to_ref(mode,style){
    if(mode.title){
      let label = mode.title;
      return `\uFFFF${label}\uFFFF`;
    }
    return "??";
  }
  phrase_to_link(mode,style) {
    if(mode.title){
      return `<a href='${mode.title}'>${mode.title}</a>`
    }
    return '??';
  }
  phrase_to_framed(mode,style,sub){
    var {id,body,name} = mode;
    style = this.string_to_style(name,style);
    if(id){
      var {body} = this.fetch_from_notes(id);
    }
    if(!body) return '';
    var { s, vw, vh, text } = this.framed.to_framed(body,style);
    let css_style = [];
    css_style.push(`box-sizing:border-box`);
    if(style.frame){ 
      css_style.push(`outline:1px solid`);
      //css_style.push(`padding:1pt`);
    }
    let width = this.string_to_css_width(style.width,style.zoom);
    if(width){
      css_style.push(`width:${width}`);
    }else{
      css_style.push(`width:${vw}px`)
    }
    let height = this.string_to_css_height(style.height,style.zoom);
    if(height){
      css_style.push(`height:${height}`);
    }else{
      ///IMPORTANT: do not set the height to the wh because doing so will 
      /// not let the height grow automatically
    }
    if(style && style.float){
      let f = (style.float=='left')?'left':'right';
      css_style.push(`float:${f}`);
    }
    css_style.push('vertical-align:middle');
    let ENCODE = 0;
    if(ENCODE){
      ///It is important to convert it to inline IMG because then the 'css_style' will take effect
      s = `<img class='IMG' alt='diagram' style='${css_style.join(';')}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}" />`;
    }else{
      if(typeof sub=='string'){
        css_style.push(`color:black`);
        css_style.push(`background-color:white`);
        css_style.push(`width:100%`);
        s = `<svg style='${css_style.join(';')}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='' viewBox='0 0 ${this.fix(vw*1.333)} ${this.fix(vh*1.333)}' >${text}</svg>`;
        s = `<span style='display:inline-block;width:${width};text-align:center;'>${s}<br/>${sub}</span>`;
      }else{
        css_style.push(`color:black`);
        css_style.push(`background-color:white`);
        s = `<svg style='${css_style.join(';')}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='' viewBox='0 0 ${this.fix(vw*1.333)} ${this.fix(vh*1.333)}' >${text}</svg>`;
      }
    }
    return s;
  }
  phrase_to_diagram(mode,style,sub){
    var {id,body,name} = mode;
    style = this.string_to_style(name,style);
    if(id){
      var {body} = this.fetch_from_notes(id);
    }
    if(!body) return '';
    if(style.load){
      let name0 = style.load;
      if(this.my_diagram_ss_maps.has(name0)){
        let ss0 = this.my_diagram_ss_maps.get(name0);
        body = ss0.concat(body);
      }
    }
    if(style.save){
      this.my_diagram_ss_maps.set(style.save,body);
    }
    var { s, vw, vh, text } = this.diagram.to_diagram(body,style);
    let css_style = [];
    css_style.push(`box-sizing:border-box`);
    if(style.frame==1){
      css_style.push(`border:1px solid`);
    }
    let width = this.string_to_css_width(style.width,style.zoom,'');
    if(width){
      css_style.push(`width:${width}`);
    }else{
      css_style.push(`width:${vw}px`)
    }
    let height = this.string_to_css_height(style.height,style.zoom);
    if(height){
      css_style.push(`height:${height}`);
    }else{
      ///IMPORTANT: do not set the height to the wh because doing so will 
      /// not let the height grow automatically
    }
    if(style && style.float){
      let f = (style.float=='left')?'left':'right';
      css_style.push(`float:${f}`);
    }
    css_style.push('vertical-align:middle');
    let ENCODE = 0;
    if(ENCODE){
      ///It is important to convert it to inline IMG because then the 'css_style' will take effect
      s = `<img class='IMG' alt='diagram' style='${css_style.join(';')}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}" />`;
    }else{
      if(typeof sub=='string'){
        css_style.push(`color:black`);
        css_style.push(`background-color:white`);
        css_style.push(`width:100%`);
        s = `<svg style='${css_style.join(';')}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='currentColor' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
        s = `<span style='display:inline-block;width:${width};text-align:center;vertical-align:middle;'>${s}<br/>${sub}</span>`;
      }else{
        css_style.push(`color:black`);
        css_style.push(`background-color:white`);
        s = `<svg style='${css_style.join(';')}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='currentColor' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
      }
    }
    if(style.hidden==1){
      return '';
    }
    return s;
  }
  phrase_to_img(mode,style,sub) {
    var {fname,name,id,body} = mode;
    style = this.string_to_style(name,style);
    if(fname){
      let src = fname;
      var imgsrc = `${src}`;///THIS is the URL that is assigned to <img src=...>
      var imgid = '';
      if (1) {
        var { imgsrc, imgid } = this.to_request_image(imgsrc);
        console.log('to_request_image()','imgsrc',imgsrc.slice(0, 40), 'imgid', imgid);
      }
      let css_style = [];
      css_style.push(`box-sizing:border-box`);
      css_style.push(`vertical-align:middle`);
      let width = this.string_to_css_width(style.width,style.zoom);
      if(width){
        css_style.push(`width:${width}`)
      }
      let height = this.string_to_css_height(style.height,style.zoom);
      if(height){
        css_style.push(`height:${height}`)
      }
      if(style.frame==1){
        css_style.push(`border:1px solid`);
      }
      if(style.float){
        css_style.push(`float:${style.float=='left'?'left':'right'}`)
      }
      //return `<svg style="${css_style.join(';')}" viewBox="0 0 ${asp[0]} ${asp[1]}" xmlns="http://www.w3.org/2000/svg"><image href="${imgsrc}" width="${asp[0]}" height="${asp[1]}"/></svg>`;
      //return `<img style='object-fit:contain;${css_style.join(';')}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
      if(typeof sub=='string'){
        css_style.push(`width:100%`);
        let s = `<img style='${css_style.join(';')}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
        s = `<span style='display:inline-block;width:${width};text-align:center;vertical-align:middle;'>${s}<br/>${sub}</span>`;
        return s;
      }else{
        return `<img style='${css_style.join(';')}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
      }
    }
    return '';
  }
  phrase_to_blockquote(mode,style){
    var {body} = mode;
    if(body){
      var text = this.unmask(this.join_para(body),style);
      var width = this.string_to_css_width(style.width,style.zoom,'100%');
      var o = [];
      o.push(`<span style='display:inline-block;width:${width};text-align:justify;hyphens:auto;vertical-align:middle;'>`)
      o.push(text);
      o.push(`</span>`);
      text = o.join('\n');
      return text;
    }
    return '';
  }
  phrase_to_verbatim(mode,style){
    var {body} = mode;
    if(body){
      var body = body.map(x => this.polish_verb(x));
      var body = body.map(x => `<code>${x}</code>`)
      var text = body.join('<br/>')
      var width = this.string_to_css_width(style.width,style.zoom,'100%');
      var o = [];
      o.push(`<span style='display:inline-block;width:${width};line-height:1;'>`)
      o.push(text);
      o.push(`</span>`);
      text = o.join('\n');
      return text;
    }
    return '';
  }
  phrase_to_tabular(mode,style) {
    var {id,body,name} = mode;
    style = this.string_to_style(name,style);
    if(id){
      var {body} = this.fetch_from_notes(id);
    }
    if(!body) return '';
    let d = [];
    let rows = this.ss_to_table_rows(body,style);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.unmask(p.raw);
      })
    })
    var text = this.rows_to_tabular(rows, style);
    var css_style = [];
    if(style.float){
      var float = (style.float == 'left') ? 'left' : 'right';
      css_style.push(`float:${float}`)
    }
    css_style.push(`display:inline-block`);
    css_style.push('text-indent:0');
    css_style.push('vertical-align:middle')
    css_style = css_style.join(';');
    var n = (rows.length)?rows[0].length:1;
    d.push(`<table style='${css_style}' border='0'>`);
    d.push(text);
    d.push(`</table>`)
    text = d.join('\n');  
    return text;
  }
  ///
  /// para_to_XXX
  ///
  para_to_bull(ss,style) {
    let itms = this.ss_to_bull_itms(ss,style);
    let text = this.itms_to_bull(itms,style);
    return `<p class='PARA BULL' >${text}</p>`;
  }
  para_to_tabbing(ss,style){
    var rows = this.ss_to_table_rows(ss,style);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.unmask(p.raw);
      })
    })
    var n = (rows.length)?rows[0].length:1;
    var gap = parseFloat(style.gap)||0.02;
    var strut = parseFloat(style.strut)||0;
    var frs = this.string_to_frs_with_gap(style.fr||'',n,gap);
    var d = [];
    var has_rift = 0;
    d.push(`<table style='width:100%'>`)
    rows.forEach((pp,i,arr) => {
      ss = pp.map((x) => x.text);
      if(style.head && i==0){
        ss = ss.map((x) => `<b>${x}</b>`);
      }
      var minheight = gap?`height:${strut}pt`:"";
      ss = ss.map((x,i) => `<td style='width:${frs[i]*100}%;${minheight};' >${x}</td>`);
      d.push('<tr>')
      d.push(ss.join(`<td style='width:${gap*100}%' ></td>`));
      d.push('</tr>')
    });
    d.push('</table>')
    var text = d.join('\n')
    return `<p class='PARA TABBING' >${text}</p>`;
  }
  para_to_quote(ss,style) {
    var text = ss.join('\n');
    text = this.unmask(text,style);
    return `<blockquote class='PARA QUOTE' >${text}</blockquote>`;
  }
  para_to_samp(ss,style) {
    ss = this.trim_samp_body(ss);
    ss = ss.map(x => this.polish(x));
    ss = ss.map(x => this.rubify(x));
    var text = ss.join('<br/>');
    var o = []; 
    o.push(`<pre class='SAMP'>${text}</pre>`);
    o.push('');
    return o.join('\n');
  }
  para_to_plaintext(ss, style) {
    let text = ss.join('\n');
    text = this.unmask(text,style);
    return `<p class='PARA PLAINTEXT' >${text}</p>`;
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
      case 'i': {
        return `<i>${text}</i>`
        break;
      }
      case 'u': {
        return `<u>${text}</u>`
        break;
      }
      case 'tt': {
        return `<tt>${text}</tt>`
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
      var BOT = H - MID - 0.670;
      var va = 0;
      va -= BOT;
      va -= 2/12; ///because of a 2pt extra space added to the height
      ///vertical-align:-0.23em has been shown that the bottom
      ///of this SVG is aligned with the bottom of the surrounding text
      //return va;
      return -H + MID + 0.5;
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
  to_caption_text(caption,style,name){
    let label = style.label||'';
    let {idnum,tag} = this.name_to_idnum(label,name);
    if(label || caption){
      return `<figcaption>${tag} <span class='IDNUM'>${idnum}</span> ${this.unmask(caption)}</figcaption>`;
    }else if(label){
      return `<figcaption>${tag} <span class='IDNUM'>${idnum}</span> </figcaption>`;
    }else if(caption){
      return `<figcaption> ${this.unmask(caption)} </figcaption>`;
    }else{
      return '';
    }
  }

  name_to_idnum(label,name){
    var idnum = 0;
    var tag = '';
    if(name=='equation'){
      idnum = ++this.equation_num;
      tag = 'Equation'
    }
    if(name=='figure'){
      idnum = ++this.figure_num;
      tag = 'Figure'
    }
    if(name=='table' || name=='longtable'){
      idnum = ++this.table_num;
      tag = 'Table'
    }
    if(name=='listing'){
      idnum = ++this.listing_num;
      tag = 'Listing'
    }
    this.addto_refmap(label,idnum);
    return {idnum,tag};
  }

  to_subfig_num(j) {
    return const_subfignums[j];
  }

  to_part_num(j) {
    ///The first part is 1, not zero
    return const_partnums[j];
  }

  to_request_image(imgsrc){
    if(this.imgs.indexOf(imgsrc) < 0){
      this.imgs.push(imgsrc);
    }
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
  rows_to_tabular(rows,style){
    var o = [];
    var strut = parseInt(style.strut)||0;
    var height = (strut)?`${strut}pt`:'';
    var hrows = this.string_to_array(style.hline||'');
    var vcols = this.string_to_vcols(style.vline||'');
    var border_top = '';
    var border_bot = '';
    var table_top = '';
    var table_bot = '';
    var n = rows.length ? rows[0].length : 1;
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    var haligns = this.string_to_td_haligns(style.halign||'',n);
    var frs = this.string_to_td_width(style.fr||'',n);
    ///determine if first row is a hline
    var table_top = this.hrows_has_items('t',hrows);
    var table_bot = this.hrows_has_items('b',hrows);
    let k = rows.length;
    ///figure out how many extra columns that is the result of double vertical border
    let extra_n = 0;
    vcols.forEach((x,i) => {
      if(i>0 && i < n){
        if(x==='||'){
          extra_n++;
        }
      }
    })
    for (var j = 0; j < k; ++j) {
      var pp = rows[j];
      ///check for 'vline' for '*' or '0 1 2 3..'
      if (j > 0 && this.hrows_has_items('+',hrows)){
        border_top = '1px solid';
      }
      ///remove the '---' or '==='
      if (this.row_is_hline(pp)) {
        border_top = '1px solid';
        continue;
      }else if (this.row_is_dhline(pp)) {
        o.push(`<tr><td style='border-top:1px solid;border-bottom:1px solid;' colspan='${n+extra_n}'></td></tr>`);
        continue;
      }
      if(j==0 && table_top) border_top = '1px solid';
      if(j==k-1 && table_bot) border_bot = '1px solid';
      var mypp = [];
      pp.forEach((x, i) => {
        let {raw,text} = x;
        const lr='1ex';
        if(i>0 && vcols[i]==='||'){
          mypp.push(`<td style='border-left:1px solid;border-right:1px solid;'></td>`);
        }
        let border_left = (vcols[i])?'1px solid':'';
        let border_right= (vcols[i+1])?'1px solid':'';
        let pad=`0 ${lr}`;
        let color = '';
        if(cellcolor_map.has(raw)){
          color = cellcolor_map.get(raw);
        }
        let halign = haligns[i];
        var ht = height;
        if(style.head && j==0){
          ht = '';
          mypp.push(`<th style='width:${frs[i]};padding:${pad};border-top:${border_top};border-bottom:${border_bot};border-left:${border_left};border-right:${border_right};background-color:${color};height:${ht};text-align:${halign}'>${text}</th>`);        
        }else{
          mypp.push(`<td style='width:${frs[i]};padding:${pad};border-top:${border_top};border-bottom:${border_bot};border-left:${border_left};border-right:${border_right};background-color:${color};height:${ht};text-align:${halign}'>${text}</td>`);        
        }
      });
      var p = mypp.join('');
      var p = `<tr>${p}</tr>`;
      border_top = '';
      border_bot = '';
      o.push(p);
    }
    // add the title
    if(style.title){
      let caption_text = this.unmask(style.title);
      o.unshift(`<tr><td colspan='${n+extra_n}'>${caption_text}</td></tr>`)
    }
    return o.join('\n')
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
      var frs = this.string_to_frs_with_gap(fr,n,0);
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
      var frs = this.string_to_frs_with_gap(fr, n, gap);
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
  itms_to_bull(itms,style){
    var bullet = '&#x2022;'
    const nbsp = '&#160;&#160;'
    const squareboxo = this.unmask('&SquareBoxO;');
    const squarebox = this.unmask('&SquareBox;');
    const circleboxo = this.unmask('&CircleBoxO;');
    const circlebox = this.unmask('&CircleBox;'); 
    if(style.bullet){
      try{
        let s = this.tokenizer.get_html_symbol(style.bullet);
        bullet = s;
      }catch(e){
      }
    }
    let d = [];
    itms.forEach((p,i,arr) => {
      p.text = this.unmask(p.text);
      p.value = this.unmask(p.value);
      p.bull = this.unmask(p.bull);
      if(p.type=='UL'){
        d.push(`<label class='ITEM'>${bullet}${nbsp}${p.text}</label>`);
      }
      else if(p.type=='OL'){
        d.push(`<label class='ITEM'>${i+1}.${nbsp}${p.text}</label>`);  
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        d.push(`<label class='ITEM'>${p.value}${p.ending}${nbsp}${p.text}</label>`);
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        d.push(`<label class='ITEM'>${this.to_a_letter(p.value)}${p.ending}${nbsp}${p.text}</label>`);
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        d.push(`<label class='ITEM'>${this.to_A_letter(p.value)}${p.ending}${nbsp}${p.text}</label>`);
      }
      else if(p.type == 'DL'){
        d.push(`<label class='ITEM'><b>${p.value}</b><br/>${p.text}</label>`)
      }
      else if(p.type == 'CB'){
        if(!p.bull.trim().length){
          d.push(`<label class='ITEM'>${squareboxo} ${p.text}</label>`);
        }else{
          d.push(`<label class='ITEM'>${squarebox} ${p.text}</label>`);
        }
      }
      else if(p.type == 'RB'){
        if(!p.bull.trim().length){
          d.push(`<label class='ITEM'>${circleboxo} ${p.text}</label>`);
        }else{
          d.push(`<label class='ITEM'>${circlebox} ${p.text}</label>`);
        }
      }
      else {
        d.push(`<label class='ITEM'>${p.text}</label>`);
      }
    });
    return `<form style='font-size:${this.string_to_fontsize_percent(style.fontsize)}' >\n${d.join('\n<br/>\n')}\n</form>`;
  }
  itms_to_lines(itms,style){
    var d = [];
    var n = parseInt(style.n)||1;
    var m = Math.floor(itms.length / n);
    var z = itms.length - n * m;
    var k = z ? (m + 1) : (m);
    var frs = this.string_to_frs_with_gap(style.fr,n,0.02);
    var cols = [];
    for (let j = 0, i = 0; j < itms.length; i += 1, j += k) {
      var pp = itms.slice(j, j + k).map(p => this.unmask(p.text))
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
  itms_to_figure(itms,style) {
    var n = parseInt(style.n)||1;
    var d = [];
    var wd = (100 - 2*(n-1))/n;
    itms.forEach( (p,i,arr) => {
      let {type,mode,g,sub} = p;
      sub = this.unmask(sub);
      g.width = `100%`;///reset its width to be the percentage of the current window
      var s = '';
      if(type=='framed'){
        var s = this.phrase_to_framed(mode,g);
      }else if(type=='diagram'){
        var s = this.phrase_to_diagram(mode,g);
      }else if(type=='img'){
        var s = this.phrase_to_img(mode,g);
      }
      s = `<td style='width:${wd}%;'>${s}<span>${sub}</span></td>`;
      p.s = s;
    });
    while(itms.length){
      let pp = itms.slice(0,n);
      itms = itms.slice(n);
      pp = pp.map(x => x.s);
      while(pp.length < n){
        pp.push(`<td style='width:${wd}%;'></td>`);
      }
      let gap = `<td style='width:2%'></td>`;
      d.push(`<tr>${pp.join(gap)}</tr>`);
    }
    var text = d.join('\n'); 
    var text = `<table style='width:100%'>${text}</table>`;
    return text;
  }
  itms_to_subfigures(itms,style) {
    var subid = 0;
    itms.forEach( (p,i,arr) => {
      let {type,mode,g,sub} = p;
      if(type=='framed'){
        p.sub = this.unmask(p.sub);
        subid++;
        p.sub = `(${this.to_a_letter(subid)}) ${p.sub}`;
        p.img = this.phrase_to_framed(mode,g,p.sub);
      }else if(type=='diagram'){
        p.sub = this.unmask(p.sub);
        subid++;
        p.sub = `(${this.to_a_letter(subid)}) ${p.sub}`;
        p.img = this.phrase_to_diagram(mode,g,p.sub);
      }else if(type=='img'){
        p.sub = this.unmask(p.sub);
        subid++;
        p.sub = `(${this.to_a_letter(subid)}) ${p.sub}`;
        p.img = this.phrase_to_img(mode,g,p.sub);
      }else{
        p.img = '<br/>'
      }
    });
    var d = [];
    /// we need to place all items that are in the same row
    /// into a table
    while(itms.length){
      let p = itms[0];
      itms = itms.slice(1);
      d.push(p.img);
    }
    var text = d.join('\n'); 
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
  string_to_css_width(s,zoom,def='') {
    zoom = parseFloat(zoom)||1;
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!s) {
      return def;
    }
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(s))!==null) {
      var num = parseFloat(v[1]);
      if(Number.isFinite(num)){
        num *= zoom;
        return `${num}%`;
      }
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if ((v=re.exec(s))!==null) {
      var num = parseFloat(v[1]);
      var unit = v[2];
      if(Number.isFinite(num)){
        num *= zoom;
        return `${num}${unit}`;
      }
    }
    return def;
  }
  string_to_css_height(s,zoom) {
    zoom = parseFloat(zoom)||1;
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!s) {
      return '';
    }
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(s))!==null) {
      var num = parseFloat(v[1]);
      if(Number.isFinite(num)){
        num *= zoom;
        return `${num}%`;
      }
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if ((v=re.exec(s))!==null) {
      var num = parseFloat(v[1]);
      var unit = v[2];
      if(Number.isFinite(num)){
        num *= zoom;
        return `${num}${unit}`;
      }
    }
    return '';
  }
  string_to_css_height_with_aspect_ratio(width_s,aspect_ratio_s,zoom) {
    zoom = parseFloat(zoom)||1;
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
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
      num = parseFloat(num);
      if(Number.isFinite(num)){
        num *= ratio;
        var num = num.toFixed(3);
        if(num==100){
          return `100%`;
        }
        return `${num}%`;
      }
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if ((v=re.exec(width_s))!==null) {
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
    if (Number.isFinite(num)) {
      num *= ratio;
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
  string_to_td_width(fr,n){
    if(fr){
      ///'frs'=
      var frs = this.string_to_array(fr);
      var frs = frs.map(x => parseInt(x));
      var frs = frs.filter(x => Number.isFinite(x));
      var frs = frs.filter(x => (x > 0));
      if(frs.length > n){
        frs.slice(n);
      }else{
        while(frs.length < n){
          frs.push(1);
        }
      }
      var sum = frs.reduce((prev,curr) => prev+curr,0);
      var frs = frs.map((x) => x / sum * 100);
      var frs = frs.map((x) => x.toFixed(3));
      var frs = frs.map((x) => `${x}%`)
    } else {
      var frs = 'x'.repeat(n).split('').map(x => ``);
    }
    return frs;
  }
  string_to_td_haligns(halign,n) {
    var pp = this.string_to_array(halign||'');
    var re = /^[lcr]$/;
    pp = pp.filter(x => re.test(x));
    while(pp.length < n){
      pp.push('l');
    }
    pp = pp.map((x) => {
      if(x=='l') return 'left';
      if(x=='r') return 'right';
      return 'center';
    });
    return pp;
  }
  addto_refmap(label,idnum){
    if(label){
      if(!this.ref_map.hasOwnProperty(label)){
        this.ref_map[label] = idnum;
      }
    }
  }
  replace_all_refs(html){
    const re_ref = /\uFFFF([^\uFFFF]+)\uFFFF/g;
    html = html.replace(re_ref,(match,p1) => {
      console.log('replace_all_refs','match',match,'p1',p1);
      if(this.ref_map.hasOwnProperty(p1)){
        var idnum = this.ref_map[p1];
        return idnum;
      }
      return '??';
    });
    return html;
  }
  get_css_id(){
    return ++this.css_id;
  }
  do_FLOA_equation(block,caption,ss,style){
    var {s} = this.tokenizer.to_svgmath(ss.join('\n'),style,'math');
    let text = s;
    let label = style.label||'';
    if(label=='none'){
      label='';
    }
    if(label.length){
      let {idnum} = this.name_to_idnum(label,'equation');///should be overriden by subclasses
      text = `<div style='position:relative'><span class='IDNUM'>${idnum}</span>${text}</div>`
    }else{
      text = `<div>${text}</div>`
    }
    let o = [];
    o.push(`<figure class='EQUATION' >`);
    o.push(text);
    o.push(`</figure>`);
    text = o.join('\n');
    block.html = text;
  }
  do_FLOA_listing(block,caption,ss,style){
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
    let o = [];
    o.push(`<figure class='LISTING' >`);
    o.push(this.to_caption_text(caption,style,"listing"));
    o.push(text);
    o.push('</figure>');
    block.html = o.join('\n');
  }
  do_FLOA_figure(block,caption,ss,style){
    if(style.subfigure){
      let itms = this.ss_to_figure_itms(ss,style);
      var text = this.itms_to_subfigures(itms,style);
    }else{
      var text = this.unmask(ss.join('\n'))
    }
    let o = [];
    o.push(`<figure class='FIGURE' >`);
    o.push(this.to_caption_text(caption,style,"figure"));
    o.push(text);
    o.push('</figure>');
    text = o.join('\n');
    block.html = text;
  }
  do_FLOA_table(block,caption,ss,style){
    let rows = this.ss_to_table_rows(ss,style);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.unmask(p.raw);
      })
    })
    var text = this.rows_to_tabular(rows, style);
    var css_style = [];
    css_style.push('display:table');
    css_style.push('text-indent:0')
    if(style.fr){
      css_style.push('width:100%');
    }
    css_style = css_style.join(';');
    var text = `<table style='${css_style}' border='0'>${text}</table>`;  
    let o = [];
    o.push(`<figure class='TABLE' >`);
    o.push(this.to_caption_text(caption,style,"table"));
    o.push(text);
    o.push('</figure>');
    text = o.join('\n');
    block.html = text;
  }
  do_FLOA_longtable(block,caption,ss,style){
    let rows = this.ss_to_table_rows(ss,style);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.unmask(p.raw);
      })
    })
    var text = this.rows_to_tabular(rows, style);
    var css_style = [];
    css_style.push('display:table');
    css_style.push('text-indent:0')
    css_style.push('width:100%');
    css_style = css_style.join(';');
    var text = `<table style='${css_style}' border='0'>${text}</table>`;  
    let o = [];
    o.push(`<figure class='TABLE LONG' >`);
    o.push(this.to_caption_text(caption,style,"table"));
    o.push(text);
    o.push('</figure>');
    text = o.join('\n');  
    block.html = text;
  }

}

module.exports = { NitrilePreviewHtml };
