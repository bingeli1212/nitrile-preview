'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { NitrilePreviewDiagramSVG } = require('./nitrile-preview-diagram-svg');
const const_partnums = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'IIX', 'IX', 'X'];
const const_subfignums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const path = require('path');

class NitrilePreviewHtml extends NitrilePreviewTranslator {

  constructor(parser) {
    super(parser);
    this.name='HTML';
    this.tokenizer = new NitrilePreviewTokenizer(this);
    this.diagram = new NitrilePreviewDiagramSVG(this);
    this.mathmargin = 3;
    this.mathpadding = 2;
    this.imgid = 1;
    this.imgs = [];
    this.idnum_map = {};
    this.css_map = {};
    this.num_map = {};
    this.enumerate_counter = 0;
    this.my_svgarray_vspace = 3;
    this.flags = {};
    this.ref_map = {};
    this.equation_num = 0;
    this.figure_num = 0;
    this.table_num = 0;
    this.listing_num = 0;
    this.prefix_indent = String.fromCodePoint(0x3000);
    this.css_id = 0;
    this.def_padding = '0.5ex';
    this.icon_cdigits = ['&#x278a;','&#x278b;','&#x278c;','&#x278d;','&#x278e;','&#x278f;','&#x2790;','&#x2791;','&#x2792;','&#x2793;']
    this.icon_bullet       = '&#x2022;'
    this.icon_squareboxo   = '&#x25FB;'
    this.icon_squarebox    = '&#x25A3;'
    this.icon_circleboxo   = '&#x25CB;'
    this.icon_circlebox    = '&#x25CF;'
    //this.icon_circleboxo   = '&#x274D;'//shadowed white circle
    //this.icon_circlebox    = '&#x2713;'//black circle           
    this.icon_writing_hand = '&#x270D;';
    this.padding_list = '2em';
    this.margin_p = '1em';
    this.margin_p_inner = '1em';
    this.margin_li = '1em';
    this.margin_li_inner = '1em';
    this.padding_hl = '40px';
    this.padding_ul = '40px';
    this.padding_ol = '40px';
    this.padding_dd = '40px';
    this.padding_hl_inner = '20px';
    this.padding_ul_inner = '20px';
    this.padding_ol_inner = '20px';
    this.padding_dd_inner = '40px';
    this.padding_sub_top = '0pt';
    this.padding_sub_bottom = '4pt';
    this.padding_td = '0.20em 0.4252em';
    ///nitrile-preview-view
    this.view = null;
    ///config parameters
    this.html_caption_align = 'c';
    this.html_caption_small = 1;
    this.html_samp_small = 1;
    this.html_line_paddingleft = '2em';
    this.html_line_small = 1;
  }
  to_caption_nonumber(){
    return false;
  }
  do_PART(block) {
    ///this method is currently deprecated
    var { title, style } = block;
    let idnum=this.get_refmap_value(style,'partnum');
    var o = [];
    var title = this.uncode(style,title);
    if(this.conf_to_string('html.partpage')){
      var s=this.conf_to_list('html.part');
      var s=s.map(x => x.replace(/\$\{text\}/g,title));
      var s=s.map(x => x.replace(/\$\{i\}/g,x=>this.int_to_letter_i(idnum)));
      var s=s.map(x => x.replace(/\$\{I\}/g,x=>this.int_to_letter_I(idnum)));
      var s=s.map(x => x.replace(/\$\{a\}/g,x=>this.int_to_letter_a(idnum)));
      var s=s.map(x => x.replace(/\$\{A\}/g,x=>this.int_to_letter_A(idnum)));
      var s=s.map(x => x.replace(/\$\{1\}/g,x=>this.to_1_letter(idnum)));
      var s=s.join('\n');
      o.push(s);
    }else{
      idnum = this.int_to_letter_I(idnum);
      o.push(`<h1 > <small> Part ${idnum} </small> <br/> ${title} </h1>`);
    }
    o.push('');
    return o.join('\n');
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_part(title,label,idnum,idcap,partnum,chapternum,level,style){
    var cls = 'PART';
    var css = this.css('PART');
    return(`<h1 data-row='${style.row}' class='${cls}' style='${css}' > <span style='font-weight:normal;font-size:80%' > Part ${idnum} </span> <br/> ${this.uncode(style,title)} </h1>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_chapter(title,label,idnum,idcap,partnum,chapternum,level,style){
    var cls = 'CHAPTER';
    var css = this.css('CHAPTER');
    return(`<h1 data-row='${style.row}' class='${cls}' style='${css}' > <span style='font-weight:normal;font-size:80%' > Chapter ${idnum} </span> <br/> ${this.uncode(style,title)} </h1>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_section(title,label,idnum,idcap,partnum,chapternum,level,style){
    var cls = 'SECTION';
    var css = this.css('SECTION');
    return(`<h2 data-row='${style.row}' class='${cls}' style='${css}' > ${idnum} &#160; ${this.uncode(style,title)} </h2>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_subsection(title,label,idnum,idcap,partnum,chapternum,level,style){
    var cls = ('SUBSECTION');
    var css = this.css('SUBSECTION');
    return(`<h3 data-row='${style.row}' class='${cls}' style='${css}' > ${idnum} &#160; ${this.uncode(style,title)} </h3>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_subsubsection(title,label,idnum,idcap,partnum,chapternum,level,style){
    var cls = ('SUBSUBSECTION');
    var css = this.css('SUBSUBSECTION');
    return(`<h4 data-row='${style.row}' class='${cls}' style='${css}' > ${idnum} &#160; ${this.uncode(style,title)} </h4>`);
  }
  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  item_dl_to_text(style,i,item,nblank){
    var o = [];
    var value = this.uncode(style,item.value);
    if(Array.isArray(item.values)){
      value = item.values.map((s) => this.uncode(style,s)).join('<br/>');
    }
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    var css_dt = this.css('DT');
    var css_dd = this.css('DD');
    if(text){
      o.push(`<dt class='DT' style='${css_dt}' data-row='${item.row}' > <b>${value}</b> </dt> <dd class='DD' style='${css_dd}' data-row='${item.row+1}' > ${text} </dd> <dd class='DD' style='${css_dd}' >`);
    }else{
      o.push(`<dt class='DT' style='${css_dt}' data-row='${item.row}' > <b>${value}</b> </dt>                                                                           <dd class='DD' style='${css_dd}' >`);
    }
    if(item.more && item.more.length){
      var style = {...style};
      item.more.forEach((p) => {
        style.row = p.row;///renewal the style.row to be that of the more cluster 
        if(p.lines){
          let text = this.join_para(p.lines);
          o.push(`<span data-row='${p.row}' > ${this.uncode(style,text)} </span>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize,'')}`);
        }
      });
    }
    o.push(`</dd>`);
    return o.join('\n\n');
  }
  item_ol_to_text(style,i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    var css = this.css('LI');
    if(item.type == 'A'){
      let value = i+1;
      value = this.int_to_letter_A(value);
      o.push(`<li class='LI' style='${css}' type='A'  data-row='${item.row}' value='${item.value}' > ${text}`)
    }else if(item.type == 'a'){
      let value = i+1;
      value = this.int_to_letter_a(value);
      o.push(`<li class='LI' style='${css}' type='a'  data-row='${item.row}' value='${item.value}' > ${text}`)
    }else if(item.type == 'I'){
      let value = i+1;
      value = this.int_to_letter_I(value);
      o.push(`<li class='LI' style='${css}' type='I'  data-row='${item.row}' value='${item.value}' > ${text}`)
    }else if(item.type == 'i'){
      let value = i+1;
      value = this.int_to_letter_i(value);
      o.push(`<li class='LI' style='${css}' type='i'  data-row='${item.row}' value='${item.value}' > ${text}`)
    }else if(item.value) {
      let value = item.value;
      o.push(`<li class='LI' style='${css}' type='1'  data-row='${item.row}' value='${item.value}' > ${text}`);
    }else if(item.bullet=='*'){
      let value = i+1;
      o.push(`<li class='LI' style='${css}' type='1'  data-row='${item.row}' value='${value}'      > ${text}`);
    }else{
      let value = i+1;
      value = this.int_to_letter_i(value);
      o.push(`<li class='LI' style='${css}' type='1'  data-row='${item.row}' value='${item.value}' > ${text}`);
    }
    if(item.more && item.more.length){
      var style = {...style};
      item.more.forEach((p) => {
        style.row = p.row;///renew style.row to be that of the more clister
        if(p.lines){
          let text = this.join_para(p.lines);
          o.push(`<span data-row='${p.row}' > ${this.uncode(style,text)} </span>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize,'')}`);
        }
      });
    }
    o.push(`</li>`)
    return o.join('\n\n');
  }
  item_ul_to_text(style,i,item,nblank){
    var o = [];
    var key = item.key;
    var keytype = item.keytype;
    var sep = item.sep;//sep contains the original spaces
    var text = this.join_para(item.body);
    var text = this.uncode(style,text);
    var css = this.css('LI');
    if(key){
      if(keytype=='var'){
        text = `${this.literal_to_var(style,key)}${sep}${text}`;
      }else if(keytype=='verb'){
        text = `${this.literal_to_verb(style,key)}${sep}${text}`;
      }else{
        text = `${this.polish(style,key)}${sep}${text}`;
      }
    }
    o.push(`<li class='LI' style='${css}' data-row='${item.row}' > ${text}`);
    if(item.more && item.more.length){
      var style = {...style};
      item.more.forEach((p) => {
        style.row = p.row;///renew style.row to be that of the more cluster
        if(p.lines){
          let text = this.join_para(p.lines);
          o.push(`<span data-row='${p.row}' > ${this.uncode(style,text)} </span>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize,'')}`);
        }
      });
    }
    o.push('</li>')
    return o.join('\n\n')
  }
  itemize_to_text(style,itemize,cls){
    var bull = itemize.bull;
    var items = itemize.items;
    var nblank = itemize.nblank;
    var style = {...style};///make a copy because we will be modifying it
    var o = [];
    switch (bull) {
      case 'DL': {
        var css = this.css(`${cls} DL`);
        o.push(`<dl class='DL' style='${css}' data-row='${style.row}' >`);
        items.forEach((item,j) => {
          style.row = item.row;
          let text = this.item_dl_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push(`</dl>`)
        break;
      }
      case 'OL': {
        var css = this.css(`${cls} OL`);
        o.push(`<ol class='OL' style='${css}' data-row='${style.row}' >`);
        items.forEach((item,j) => {
          style.row = item.row;
          let text = this.item_ol_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push('</ol>')
        break;
      }
      case 'UL': {
        var css = this.css(`${cls} UL`);
        o.push(`<ul class='UL' style='${css}' data-row='${style.row}' >`);
        items.forEach((item,j) => {
          style.row = item.row;           
          let text = this.item_ul_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push('</ul>')
        break;
      }
    }
    return o.join('\n\n');
  }
  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  do_HRLE(block) {
    var {style,text} = block;
    var text = `<hr  />`;
    return text;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  polish_verb(style,unsafe){
    ///needed by the translator
    unsafe = this.polish(style,unsafe);
    unsafe = this.replace_blanks_with(unsafe,'&#160;')
    return unsafe;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  polish(style,line) {
    var safe='';
    var s;
    while(line.length){
      if(line.codePointAt(0)>0xFFFF){
        s = line.slice(0,2);
        line = line.slice(2);
      }else{
        s = line.slice(0,1);
        line = line.slice(1);
      }
      switch(s) {
        case "&"  : s = "&#x0026;"          ; break;
        case "<"  : s = "&#x003C;"          ; break;
        case ">"  : s = "&#x003E;"          ; break;
        case "\"" : s = "&#x0022;"          ; break;
        case "'"  : s = "&#x0027;"          ; break;
        case "⁻¹" : s = "&#x207b;&#x00B9;"  ; break;
        case "⁻²" : s = "&#x207b;&#x00B2;"  ; break;
        case "⁻³" : s = "&#x207b;&#x00B3;"  ; break;
        case "¹"  : s = "&#x00B9;"          ; break;
        case "²"  : s = "&#x00B2;"          ; break;
        case "³"  : s = "&#x00B3;"          ; break;
      } 
      safe+=s;
      continue;
    }
    safe = this.rubify_cjk(safe,style.vmap);
    return safe;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
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
        }else{
          if(this.tokenizer.symbol_name_map.has(s)){
            let {html} = this.tokenizer.symbol_name_map.get(s);
            s = html;
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
      switch(s) {
        case "&"  : s = "&#x0026;"          ; break;
        case "<"  : s = "&#x003C;"          ; break;
        case ">"  : s = "&#x003E;"          ; break;
        case "\"" : s = "&#x0022;"          ; break;
        case "'"  : s = "&#x0027;"          ; break;
        case "⁻¹" : s = "&#x207b;&#x00B9;"  ; break;
        case "⁻²" : s = "&#x207b;&#x00B2;"  ; break;
        case "⁻³" : s = "&#x207b;&#x00B3;"  ; break;
        case "¹"  : s = "&#x00B9;"          ; break;
        case "²"  : s = "&#x00B2;"          ; break;
        case "³"  : s = "&#x00B3;"          ; break;
      } 
      safe+=s;
      continue;
    }
    return safe;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  fence_to_math(style,ss,ssi) {
    var text = this.tokenizer.to_fence_math(style,ss);
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var p = {};
    p.subc = style.subtitle||'';
    p.subc = this.uncode(style,p.subc);
    p.style = style;
    var s_style = this.style_to_subcaption_style_s(style);
    var css1 = this.css('MATH');
    var css2 = this.css('MATH');
    p.width = '';
    p.text = text;
    p.img = `\n<table class='MATH' style='${css1}' ${frame} ${rules} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n                                                                                    \n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    p.fig = `\n<table class='MATH' style='${css2}' ${frame} ${rules} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n<caption align='bottom' class='SUBCAPTION' style='${s_style}' > ${p.subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    var o = [];
    o.push(p);
    return o;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  fence_to_ink(style,ss,ssi){
    var npara = ss.length;
    var vgap = 1;//mm
    var [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    var max_inkheight = vgap + vgap + npara*10*this.PT_TO_MM;//each font is 10pt height, the font-size is 10pt
    var inkheight = Math.max(inkheight,max_inkheight);
    var extra_dy = 0.78;//pt  
    let all = [];
    all.push( `<text style="font-family:monospace;white-space:pre;font-size:10pt;" fill="currentColor" stroke="none" text-anchor="start" x="0" y="0" >` );
    ss.forEach((s,i,arr) => {
      if(s=='\\\\'){
        s = String.fromCodePoint(0x00B6);
      }else{
        s = this.polish(style,s);
        s = this.replace_blanks_with(s,'&#160;');
      }
      all.push( `<tspan y="${vgap + (i+extra_dy)*10*this.PT_TO_MM}mm" x="0">${s}</tspan>` );
    });
    all.push( `</text>`);
    var text = all.join('\n');    
    var p = {};
    p.vw = inkwidth*this.MM_TO_PX;
    p.vh = inkheight*this.MM_TO_PX;
    var s_svg = `<svg width='100%' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='none' viewBox='0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}' >${text}</svg>`;
    //var s_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}" >${img}</svg>`;
    //img = `<object class='INK' style='${css}' width='${w}' height='${h}' data='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}'></object>`;
    p.subc = style.subtitle||'';
    p.subc = this.uncode(style,p.subc);
    p.style = style;
    if(style.stretch){
      let stretch = parseFloat(style.stretch)||1;
      p.width = (stretch)?`${stretch*100}%`:p.vw;
    }else if(style.width){
      let width = parseInt(style.width);
      p.width = (width)?`${width*this.MM_TO_PX}`:p.vw;
    }else{
      p.width = p.vw;
    }
    var frame = (style.frame)?`frame='box'`:``;
    var s_style = this.style_to_subcaption_style_s(style);
    var css1 = this.css('INK');
    var css2 = this.css('INK');
    p.img = `\n<table class='INK' style='${css1}' ${frame} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n                                                                                    \n<tr><td>${s_svg}</td></tr>\n</table>`;
    p.fig = `\n<table class='INK' style='${css2}' ${frame} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n<caption align='bottom' class='SUBCAPTION' style='${s_style}' > ${p.subc} </caption>\n<tr><td>${s_svg}</td></tr>\n</table>`;
    // o.push({img,subc,width,fig,style});
    var o = [];
    o.push(p);
    return o;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  fence_to_dia(style,ss,ssi){
    var o = this.diagram.to_diagram(style,ss);
    o = o.map((p) => {
      var s_svg = `<svg width='100%' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}" >${p.svgtext}</svg>`;
      //var img = `<object class='DIA' style='${css}' width='${p.vw}' height='${p.vh}' data='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}' ></object>`;
      p.subc = style.subtitle||'';
      p.subc = this.uncode(style,p.subc);
      p.style = style;
      if(style.stretch){
        let stretch = parseFloat(style.stretch)||1;
        p.width = (stretch)?`${stretch*100}%`:p.vw;
      }else if(style.width){
        let width = parseInt(style.width);
        p.width = (width)?`${width*this.MM_TO_PX}`:p.vw;
      }else{
        p.width = p.vw;
      }
      var frame = (style.frame)?`frame='box'`:``;
      var s_style = this.style_to_subcaption_style_s(style);
      let css1 = this.css('DIA');
      let css2 = this.css('DIA');
      p.img = `\n<table class='DIA' style='${css1}' ${frame} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n                                                                                  \n<colgroup/><thead/><tbody><tr><td>${s_svg}</td></tr></tbody>\n</table>`;
      p.fig = `\n<table class='DIA' style='${css2}' ${frame} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n<caption align='bottom' class='SUBCAPTION' style='${s_style}' >${p.subc}</caption>\n<colgroup/><thead/><tbody><tr><td>${s_svg}</td></tr></tbody>\n</table>`;
      return p;
    });
    return o;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  fence_to_verbatim(style,ss,ssi){
    var ss = ss.map(x => x.trimRight());
    var ss = ss.map(x => x?this.polish_verb(style,x):'&#160;');
    var ss = ss.map(x => `<span><code>${x}</code></span>`);
    var text = ss.join('<br/>\n');
    var frame = '';
    var rules = '';
    var p = {};
    p.subc = style.subtitle||'';
    p.subc = this.uncode(style,p.subc);
    var s_style = this.style_to_subcaption_style_s(style);
    var css1 = this.css('VERBATIM');
    var css2 = this.css('VERBATIM');
    if(style.fontsize=='small'){
      css1 += ';font-size:80%';
      css2 += ';font-size:80%';
    }
    p.width = '100%';
    p.img = `\n<table class='VERBATIM' style='${css1}' ${frame} ${rules} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n                                                                                    \n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    p.fig = `\n<table class='VERBATIM' style='${css2}' ${frame} ${rules} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n<caption align='bottom' class='SUBCAPTION' style='${s_style}' > ${p.subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    var o = [];
    o.push(p);
    return o;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  fence_to_tabular(style,ss,ssi) {
    var {rows} = this.ss_to_tabular_rows(style,ss,ssi);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(style,p.raw);
      })
    })
    var n = rows.length?rows[0].length:1;
    var ww = this.halign_to_html_ww(n,style.align);
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    var all = [];
    if(style.head && rows.length){
      let pp = rows.shift();
      all.push(`<thead>`);
      all.push(`<tr>`)
      pp.forEach((p,i) => {
        let {raw,text} = p;
        let td_padding = this.padding_td;//these settings are chosen to match those of beamer and creamer
        let css = `padding:${td_padding};text-align:${ww[i].ta}`;
        if(pp.upper){
          css += `; border-top:1px solid`;
        }
        if(pp.lower){
          css += `; border-bottom:1px solid`;
        }
        if(p.left){
          css += `; border-left:1px solid`;
        }
        if(p.right){
          css += `; border-right:1px solid`;
        }
        all.push(`<th class='TH' style='${css}' > <b>${text}</b> </th>`);
      })
      all.push('</tr>');
      all.push('</thead>');
    }
    all.push(`<tbody>`);
    rows.forEach((pp,j,arr) => {
      all.push('<tr>');
      pp.forEach((p,i) => {
        let {raw,text} = p;
        let td_padding = this.padding_td;//these settings are chosen to match those of beamer and creamer
        let css = `padding:${td_padding};text-align:${ww[i].ta}`;
        let color = '';
        if(cellcolor_map.has(raw)){
          color = cellcolor_map.get(raw);
        }
        if(pp.upper){
          css += `; border-top:1px solid`;
        }
        if(pp.lower){
          css += `; border-bottom:1px solid`;
        }
        if(p.left){
          css += `; border-left:1px solid`;
        }
        if(p.right){
          css += `; border-right:1px solid`;
        }
        if(style.side && i == 0){
          //do not color the side column
          color = '';
        }
        if(color){
          css += `; background-color:${color}`
        }
        all.push(`<td class='TD' style='${css}' > ${text} </td>`); 
      });
      all.push('</tr>')
    });
    all.push(`</tbody>`);
    var text = all.join('\n');
    var frame = (style.frame)?`frame='box'`:``;
    var rules = (style.rules)?`rules='${style.rules}'`:``;
    if(style.side){
      let s1 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).slice(0,1).join('\n');
      let s2 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).slice(1).join('\n');
      var colgroup = `<colgroup>\n${s1}\n</colgroup>\n<colgroup>\n${s2}\n</colgroup>`;      
    }else{
      let s = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).join('\n');
      var colgroup = `<colgroup>\n${s}\n</colgroup>`;
    }
    var p = {};
    p.subc = style.subtitle||'';
    p.subc = this.uncode(style,p.subc);
    p.style = style;
    let s_style = this.style_to_subcaption_style_s(style);
    let css1 = this.css('TABULAR');
    let css2 = this.css('TABULAR');
    if(style.fontsize=='small'){
      css1 += ';font-size:80%';
      css2 += ';font-size:80%';
    }
    p.width = '';
    p.img = `<table class='TABULAR' style='${css1}' ${frame} ${rules} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n                                                                                    \n${colgroup}\n${text}\n</table>`;
    p.fig = `<table class='TABULAR' style='${css2}' ${frame} ${rules} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n<caption align='bottom' class='SUBCAPTION' style='${s_style}' > ${p.subc} </caption>\n${colgroup}\n${text}\n</table>`;
    var o = [];
    o.push(p);
    return o;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  fence_to_parbox(style,ss,ssi){
    var sep = '<br/>'
    var text = this.ss_to_backslashed_text(style,ss,sep);
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var p = {};
    p.subc = style.subtitle||'';
    p.subc = this.uncode(style,p.subc);
    p.style = style;
    if(style.stretch){
      let stretch = parseFloat(style.stretch);
      p.width = (stretch)?`${stretch*100}%`:'100%';
    }else if(style.width){
      let width = parseInt(style.width);
      p.width = (width)?`${width*this.MM_TO_PX}`:'100%';
    }else{
      p.width = '100%';
    }
    var s_style = this.style_to_subcaption_style_s(style);
    var css1 = this.css('PARBOX');
    var css2 = this.css('PARBOX');
    var talign = 'left';
    if(style.align=='c'){
      talign = 'center';
    }else if(style.align=='r'){
      talign = 'right';
    }
    if(style.fontsize=='small'){
      css1 += ';font-size:80%';
      css2 += ';font-size:80%';
    }
    if(style.fontstyle=='italic'){
      css1 += ';font-style:italic';
      css2 += ';font-style:italic';
    }
    p.img = `\n<table class='PARBOX' style='${css1}' ${frame} ${rules} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n                                                                                    \n<colgroup/><thead/><tbody><tr><td style='vertical-align:bottom;text-align:${talign}'>${text}</td></tr></tbody>\n</table>`;
    p.fig = `\n<table class='PARBOX' style='${css2}' ${frame} ${rules} cellpadding='0' cellspacing='0' width='${p.width}' data-row='${style.row}' >\n<caption align='bottom' class='SUBCAPTION' style='${s_style}' > ${p.subc} </caption>\n<colgroup/><thead/><tbody><tr><td style='vertical-align:bottom;text-align:${talign}'>${text}</td></tr></tbody>\n</table>`;
    var o = [];
    o.push(p);
    return o;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  float_to_equation(title,label,idnum,idcap,style,ss,ssi){
    var itms = this.ss_to_figure_itms(style,ss,ssi);
    var all = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='bundle' && p.style.float=='math'){
        all.push(p.img);
      }
    });
    var text = all.join('\n');
    idnum = idnum||'';
    var css = this.css('PARAGRAPH EQUATION');
    var css_subrow = this.css('SUBROW');
    all = [];
    all.push(`<figure class='PARAGRAPH EQUATION' style='${css}' data-row='${style.row}' >`);
    all.push(`<span class='SUBROW' style='${css_subrow}' >`)
    all.push(`<span style='margin-left:auto;margin-right:auto;' > ${text} </span>`);
    all.push(`<span> (${idnum}) </span>`);
    all.push(`</span>`);
    all.push(`</figure>`);
    return all.join('\n');
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  float_to_listing(title,label,idnum,idcap,style,ss,ssi){
    var ss = this.ss_to_first_bundle(style,ss,ssi);
    var ss = this.trim_samp_body(ss);
    var ss = ss.map((s,i,arr) => {
      if(i==0){
        return;
      }
      if(i+1==arr.length){
        return;
      }
      if(!s){
        s = '&#160;';
      }else if(s=='\\\\'){
        s = '&#160;';
      }else{
        s = this.polish(style,s);
      }
      let pad = this.html_line_paddingleft;
      let css = this.css('LINE');
      if(pad){
        css += `;padding-left:${pad}`;
      }
      if(this.html_line_small){
        css += `;font-size:80%`;
      }
      let css1 = '';
      css1 += `;left:0`;
      css1 += `;position:absolute`;
      css1 += `;font-size:smaller`;
      var bgsvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 30 20"> <text x="0" y="20" dy="-0.2em" anchor="start" font-size="14"> ${i} </text></svg>`;
      var bgsvg = encodeURIComponent(bgsvg);
      var bgsvg = `data:image/svg+xml;charset=UTF-8,${bgsvg}`;
      // return(`<span style='${css}' data-row='${ssi+i}'> <span style='${css1};background-image:url("${bgsvg}");width:1.5em;height:100%;' /> <code style='white-space:pre;'>${s}</code></span>`);
      return(`<span style='${css}' data-row='${ssi+i}'> <span style='${css1};width:1.5em;height:100%;'> ${i} </span> <code style='white-space:pre;'>${s}</code></span>`);
    });
    ss = ss.slice(1,-1);
    var text = ss.join('\n');
    // var text = `<span class='BODY' data-row='${ssi}' > ${text} </span>`;
    var css = this.css('PARAGRAPH LISTING'); 
    return `<figure class='PARAGRAPH LISTING' style='${css}' data-row='${style.row}' > ${this.to_caption_text(style,title,idnum,idcap,'Listing')} ${text} </figure>`;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  float_to_figure(title,label,idnum,idcap,style,ss,ssi){
    let itms = this.ss_to_figure_itms(style,ss,ssi);
    if(style.swrap){
      let all = [];
      let subrow_css = this.css('SUBROW');
      subrow_css += ';flex-wrap:wrap';
      if(this.html_caption_align=='l'){                               
        subrow_css += ';justify-content:flex-start';
      }else if(this.html_caption_align=='r'){
        subrow_css += ';justify-content:flex-end';
      }else{
        subrow_css += ';justify-content:center';
      }
      var onerow = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let fig = p.fig;
          onerow.push(fig);
        }
      });
      if(onerow.length){
        all.push(`<span class='SUBROW' style='${subrow_css}' > ${onerow.join('&#160;\n')} </span>`);
      }
      var text = all.join('\n');
    }else{
      let all = [];
      let subrow_css = this.css('SUBROW');
      let span_css = '';
      if(this.html_caption_align=='l'){                               
        subrow_css += ';justify-content:flex-start';
        span_css += ';text-align:left';
      }else if(this.html_caption_align=='r'){
        subrow_css += ';justify-content:flex-end';
        span_css += ';text-align:right';
      }else{
        subrow_css += ';justify-content:center';
        span_css += ';text-align:center';
      }
      var onerow = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let fig = p.fig;
          onerow.push(fig);
        }else if(p.type=='\\\\'){
          let n = onerow.length;
          all.push(`<span class='SUBROW' style='${subrow_css};grid-template-columns:repeat(${n},auto)' > ${onerow.join('&#160;')} </span>`);
          onerow = [];
        }
      });
      if(onerow.length){
        let n = onerow.length;
        all.push(`<span class='SUBROW' style='${subrow_css};grid-template-columns:repeat(${n},auto)' > ${onerow.join('&#160;')} </span>`);
      }
      var text = all.join('\n');
    }
    var css = this.css('PARAGRAPH FIGURE');
    if(style.type=='right'){
      return `<figure class='PARAGRAPH FIGURE' style='${css};float:right' data-row='${style.row}' > ${text} </figure>`;
    }else if(style.type=='left'){
      return `<figure class='PARAGRAPH FIGURE' style='${css};float:left' data-row='${style.row}' > ${text} </figure>`;
    }else if(style.type=='table'){ 
      return `<figure class='PARAGRAPH FIGURE' style='${css}' data-row='${style.row}' > ${this.to_caption_text(style,title,idnum,idcap,'Figure')} ${text} </figure>`;
    }else{
      return `<figure class='PARAGRAPH FIGURE' style='${css}' data-row='${style.row}' > ${this.to_caption_text(style,title,idnum,idcap,'Figure')} ${text} </figure>`;
    }
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  float_to_longtabu(title,label,idnum,idcap,style,ss,ssi){
    var ss = this.ss_to_first_bundle(style,ss,ssi);
    var ss = ss.slice(1,-1);
    var {rows} = this.ss_to_tabular_rows(style,ss,ssi);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(style,p.raw);
      })
    })
    var n = rows.length?rows[0].length:1;
    var ww = this.halign_to_html_ww(n,style.align);
    var all = [];
    if(style.head && rows.length){
      let pp = rows.shift();
      all.push(`<thead>`);
      all.push(`<tr>`)
      pp.forEach((p,i) => {
        let {raw,text} = p;
        let td_padding = this.padding_td;//these settings are chosen to match those of beamer and creamer
        let css = `padding:${td_padding}; text-align:${ww[i].ta}`;
        if(pp.upper){
          css += `; border-top:1px solid`;
        }
        if(pp.lower){
          css += `; border-bottom:1px solid`;
        }
        if(p.left){
          css += `; border-left:1px solid`;
        }
        if(p.right){
          css += `; border-right:1px solid`;
        }
        all.push(`<th class='TH' style='${css}' data-row='${p.row}' > ${text} </th>`);
      })
      all.push('</tr>');
      all.push('</thead>');
    }
    all.push(`<tbody>`);
    rows.forEach((pp,j,arr) => {
      all.push('<tr>');
      pp.forEach((p,i) => {
        let {raw,text} = p;
        let td_padding = this.padding_td;//these settings are chosen to match those of beamer and creamer
        let css = `padding:${td_padding}; text-align:${ww[i].ta}`;
        if(pp.upper){
          css += `; border-top:1px solid`;
        }
        if(pp.lower){
          css += `; border-bottom:1px solid`;
        }
        if(p.left){
          css += `; border-left:1px solid`;
        }
        if(p.right){
          css += `; border-right:1px solid`;
        }
        if(style.side && i == 0){
          //do not color the side column
          color = '';
        }
        all.push(`<td class='TD' style='${css}' data-row='${p.row}' > ${text} </td>`); 
      });
      all.push('</tr>')
    });
    all.push(`</tbody>`);
    var text = all.join('\n');
    var frame = style.frame;
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = (style.rules)?`rules='${style.rules}'`:``;
    if(style.side){
      let s1 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).slice(0,1).join('\n');
      let s2 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).slice(1).join('\n');
      var colgroup = `<colgroup>\n${s1}\n</colgroup>\n<colgroup>\n${s2}\n</colgroup>`;      
    }else{
      let s = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).join('\n');
      var colgroup = `<colgroup>\n${s}\n</colgroup>`;
    }
    var css = this.css('PARAGRAPH LONGTABU'); 
    var caption = this.to_longtabu_caption_text(style,title,idnum,idcap,'Table');
    return `<table class='PARAGRAPH LONGTABU' style='${css}' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >\n${caption}\n${colgroup}\n${text}\n</table>`;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  float_to_columns(title,label,idnum,idcap,style,ss,ssi){
    var itms = this.ss_to_figure_itms(style,ss,ssi);
    var all = [];
    var row = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='bundle'){
        row.push(p);
      }
    });
    var n = row.length;
    var css = this.css('PARAGRAPH COLUMNS');
    var css_subrow = this.css('SUBROW');
    css_subrow += ';justify-content:flex-start';
    all.push(`<figure class='PARAGRAPH COLUMNS' style='${css}' data-row='${style.row}' >`);
    all.push(`<span class='SUBROW' style='${css_subrow}' >`)
    for(let i=0; i < n; ++i){
      let p = row[i];
      if(i>0){
        all.push(`<span style='display:inline-block;width:1.5em;'>&#160;</span>`)
      }
      all.push(`${p.fig}`);
    }
    all.push(`</span>`);
    all.push(`</figure>`);
    return all.join('\n');
  }
  /////////////////////////////////////////////////////////////////////
  /// 
  /// 
  /////////////////////////////////////////////////////////////////////
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(`<rb>${item[0]}</rb><rt>${item[1]}</rt>`);
    }
    let text = o.join('');
    text = `<ruby>${text}</ruby>`;
    return text;
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
    var style = this.parser.style;
    var items = this.parser.blocks.map(x => {
      var {id,sig,part,name,text,idnum} = x; 
      text = this.uncode(style,text);
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
  to_caption_text(style,title,idnum,idcap,id){
    var caption_text = this.uncode(style,title).trim();
    var s_style = '';
    if(this.html_caption_align=='l'){                               
      s_style += ';text-align:left';
    }else if(this.html_caption_align=='r'){
      s_style += ';text-align:right';
    }else{
      s_style += ';text-align:center';
    }
    if(this.html_caption_small){
      s_style += ';font-size:smaller';      
    }
    if(idcap && idnum){
      var lead = `${idcap} ${idnum} : ${caption_text}`;
    }else if(idcap){
      var lead = `${idcap} : ${caption_text}`;
    }else{
      var lead = `${id} : ${caption_text}`;
    }
    var css = this.css('CAPTION');
    return `<figcaption class='CAPTION' style='${css};${s_style}' >${lead} </figcaption>`;
  }
  to_longtabu_caption_text(style,title,idnum,idcap,id){
    let caption_text = this.uncode(style,title).trim();
    let s_style = '';
    if(this.html_caption_align=='l'){                               
      s_style += ';text-align:left';
    }else if(this.html_caption_align=='r'){
      s_style += ';text-align:right';
    }else{
      s_style += ';text-align:center';
    }
    if(this.html_caption_small){
      s_style += ';font-size:smaller';
    }
    if(idcap && idnum){
      var lead = `${idcap} ${idnum} : ${caption_text}`;
    }else if(idcap){
      var lead = `${idcap} : ${caption_text}`;
    }else{
      var lead = `${id} : ${caption_text}`;
    }
    var css = this.css('CAPTION');
    return `<caption class='CAPTION' align='top' style='${css};${s_style}' >${lead} </caption>`;
  }
  to_idnum(name,block){
    var idnum = 0;
    if(block){
      var chapternum = block.chapternum;
      var pp = null;
      if(typeof chapternum == 'number'){
      }else{
        chapternum = 0;
      }
      pp = this.num_map[chapternum];
      if(pp){
      }else{
        pp = {};
        pp.equation_num = 0;
        pp.figure_num = 0;
        pp.table_num = 0;
        pp.listing_num = 0;
        this.num_map[chapternum] = pp;
      }
      if(name=='equation'){
        idnum = ++pp.equation_num;
      }
      else if(name=='figure'){
        idnum = ++pp.figure_num;
      }
      else if(name=='table'){
        idnum = ++pp.table_num;
      }
      else if(name=='listing'){
        idnum = ++pp.listing_num;
      }
      else if(name){
        if(pp.hasOwnProperty(name)){
          idnum = pp[name];
          if(Number.isFinite(idnum)){
            idnum++;
            pp[name] = idnum;
          }else{
            idnum = 1;
            pp[name] = idnum;
          }
        }else{
          idnum = 1;
          pp[name] = idnum;
        }
      }
    }
    if(chapternum){
      return `${chapternum}-${idnum}`;
    }else{
      return idnum;
    }
  }
  to_tag(name){
    var tag = '';
    if(name=='equation'){
      tag = 'Equation'
    }
    if(name=='figure'){
      tag = 'Figure'
    }
    if(name=='table'){
      tag = 'Table'
    }
    if(name=='listing'){
      tag = 'Listing'
    }
    return tag;
  }
  to_subfig_num(j) {
    return const_subfignums[j];
  }
  to_part_num(j) {
    ///The first part is 1, not zero
    return const_partnums[j];
  }
  to_request_image(imgsrc){
    if(this.view){
      //yes nitrile-preview-view
      var { imgsrc, imgid } = this.view.query_imagemap_info(imgsrc,this);
      return {imgsrc,imgid};
    }else{
      //no nitrile-preview-view
      if(this.imgs.indexOf(imgsrc) < 0){
        this.imgs.push(imgsrc);
      }
      var imgid = '';
      return {imgsrc, imgid};
    }
  }
  to_conf_width(){
    return this.conf_to_string('html.width',130);
  }
  to_conf_margin(){
    return this.conf_to_string('html.margin',4);
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
      var frs = 'x'.repeat(n).split('').map(x => `${100/n}%`);
    }
    frs = frs.map((x) => {
       return {ta:'left', pw:x};
    });
    return frs;
  }
  halign_to_html_ww(n,s) {
    // var pp = this.string_to_array(s||'');
    var re_lcr = /^([lcr])\s*(.*)$/;
    var re_pw = /^p(\d+)\s*(.*)$/;
    var re_fw = /^f(\d+)\s*(.*)$/;
    var pp = [];
    var v;
    while(s && s.length){
      if((v=re_lcr.exec(s))!==null){
        let x = v[1];
        s = v[2];
        if(x=='l')      pp.push({ta:'left',pw:''});
        else if(x=='r') pp.push({ta:'right',pw:''});
        else            pp.push({ta:'center',pw:''});
      }else if((v=re_pw.exec(s))!==null){
        var w = v[1];
        s = v[2];
        var w = `${w*3.779}`;//mm->px
        pp.push({ta:'left',pw:w});
      }else if((v=re_fw.exec(s))!==null){
        var w = v[1];
        s = v[2];
        var w = `${w}%`;
        pp.push({ta:'left',pw:w});
      }else{
        break;
      }
    }
    while(pp.length < n){
      pp.push({ta:'left',pw:''});
    }
    return pp;
  }
  ____addto_refmap(label,idnum){
    if(label){
      if(!this.ref_map.hasOwnProperty(label)){
        this.ref_map[label] = idnum;
      }
    }
  }
  ____replace_all_refs(html){
    const re_ref = /\uFFFF([^\uFFFF]+)\uFFFF/g;
    html = html.replace(re_ref,(match,p1) => {
      console.log(' *** replace_all_refs','match',match,'p1',p1);
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
  to_circled_number_svg(num){
    var d = [];
    d.push(`<svg xmlns = 'http://www.w3.org/2000/svg' width='0.75em' height='0.75em' viewBox='0 0 16 16' fill='currentColor' stroke='currentColor' >`);
    d.push(`<text transform='translate(8 1.5) scale(0.65)' style='stroke:none;fill:currentColor;font-size:12pt;font-style:;' textLength='13' lengthAdjust='spacing' text-anchor='middle' dy='${this.tokenizer.text_dy_pt}pt'>${num}</text>`); 
    d.push(`<circle cx='8' cy='8' r='7' stroke='currentColor' fill='none'/>`);
    d.push(`</svg>`);
    return d.join('\n');
  }
  to_wraprightfigure_img(img){
    var img = `<figure class='WRAPRIGHT'><tr><td>${img}</td></tr></figure>`
    return img;
  }
  to_wrapleftfigure_img(img){
    var img = `<figure class='WRAPLEFT'><tr><td>${img}</td></tr></figure>`
    return img;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_verb(style,cnt){ 
    let s = this.polish_verb(style,cnt);
    s = `<q><code>${s}</code></q>`;
    return s;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_math(style,cnt){
    return this.tokenizer.to_phrase_math(style,cnt);
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_var(style,cnt){
    var ss = cnt.split('/');
    var ss = ss.map((s) => {return this.polish(style,s)});
    var ss = ss.map((s) => `<var>${s}</var>`);
    return ss.join('/');
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_em(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<i>${cnt}</i>`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_b(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<b>${cnt}</b>`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_i(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<i>${cnt}</i>`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_u(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<u>${cnt}</u>`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_s(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<s>${cnt}</s>`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_q(style,cnt){
    cnt = this.uncode(style,cnt);
    let ldquo = String.fromCodePoint(0x201C);
    let rdquo = String.fromCodePoint(0x201D);
    return `${ldquo}${cnt}${rdquo}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_g(style,cnt){
    cnt = this.uncode(style,cnt);
    return `&#x00AB;${cnt}&#x00BB;`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_high(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<sup>${cnt}</sup>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_low(style,cnt){
    cnt = this.uncode(style,cnt);
    var css = '';
    return `<sub>${cnt}</sub>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_small(style,cnt){
    cnt = this.uncode(style,cnt);
    var css = '';
    return `<small>${cnt}</small>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_mono(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<tt>${cnt}</tt>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_ref(style,cnt){
    if(cnt){
      if(this.idnum_map.hasOwnProperty(cnt)){
        let idnum = this.idnum_map[cnt]
        return idnum;
      }
    }
    return "??";
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_link(style,cnt){
    return `<a href='${cnt}'>${cnt}</a>`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_colorbutton(style,cnt){
    //return `<span style='display:inline-block;color:${cnt};box-sizing:border-box;border:1px solid black;padding:1pt;'> &#x2588; </span>`;
    return `<span style='display:inline-block;color:${cnt};box-sizing:border-box;border:1px solid black;padding:0pt;'> &#x25FC; </span>`;
    //return `<span style='display:inline-block;color:${cnt};box-sizing:border-box;border:1px solid black;padding:1pt;'> &#x25A0; </span>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_fbox(style,cnt){
    if(cnt){          
      var wd = ""+cnt+"mm";
    }else{
      var wd = '10mm';
    }
    return `<span style='display:inline-block;box-sizing:border-box;border:1px solid currentColor;padding:1px;width:${wd};'> &#160; </span>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_dia(style,cnt){
    var {style,ss} = this.cnt_to_dia_phrase_itms(style,cnt);
    if(style.load){
      let name0 = style.load;
      if(style.buffers.hasOwnProperty(name0)){
        let ss0 = style.buffers[name0]
        if(ss0 && Array.isArray(ss0) && ss0.length){
          ss = ss0.concat(ss);
        }
      }
    }
    var o = this.diagram.to_diagram(style,ss);
    var s_svg = '';
    if(o.length){
      let p = o[0];
      if(style.width){
        s_svg = `<svg width='${style.width}mm' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}" >${p.svgtext}</svg>`;
      }else{
        s_svg = `<svg width='${this.fix(p.vw)}' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}" >${p.svgtext}</svg>`;
      }
    }
    return s_svg;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_default(style,cnt) {
    return `<span>${this.uncode(style,cnt)}</span>`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_utfchar(style,cnt){
    return `&#x${cnt};`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  choose_image_file(ss){
    const supported = ['.svg','.png','.jpg','.jpeg','.bmp','.gif'];
    for(let s of ss){
      var extname = path.extname(s).toLowerCase();
      if(supported.indexOf(extname)>=0){
        return s;
      }
    }
    return '';
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  build_default_idnum_map(){
    for(let block of this.parser.blocks){
      if(block.sig=='CAPT'){
        switch(block.id){
          case 'equation': {
            let idnum = this.to_idnum("Equation",block);
            block.idnum = idnum;
            block.idcap = "Equation";
            if(block.label){
              this.idnum_map[block.label] = idnum;
            }
            break;
          }
          case 'listing': {
            let idnum = this.to_idnum("Listing",block);
            block.idnum = idnum;
            block.idcap = "Listing";
            if(block.label){
              this.idnum_map[block.label] = idnum;
            }
            break;
          }
          case 'figure': {
            let idnum = this.to_idnum("Figure",block);
            block.idnum = idnum;
            block.idcap = "Figure";
            if(block.label){
              this.idnum_map[block.label] = idnum;
            }
            break;
          }
          case 'longtabu': {
            let idnum = this.to_idnum("Table",block);
            block.idnum = idnum;
            block.idcap = "Table";
            if(block.label){
              this.idnum_map[block.label] = idnum;
            }
            break;
          }
        }
      }else if(block.sig=='HDGS'){
        let {hdgn,name,title,label,level,partnum,chapternum,style} = block;
        let idnum = '';
        if(name=='section'){
          hdgn += 1;
        }else if(name=='subsection'){
          hdgn += 2;
        }else if(name=='subsubsection'){
          hdgn += 3;
        }
        if(hdgn==0 && name=='part'){
          idnum = ""+partnum;
        }else if(hdgn==0 && name=='chapter'){
          idnum = ""+chapternum;
        }else{
          if(chapternum){
            idnum = `${chapternum}.${level}`;
          }else{
            idnum = ""+level;
          }        
        }
        block.idnum = idnum;
        block.idcap = '';
        if(label){
          this.idnum_map[label] = idnum;
        }
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  build_default_css_map(){
    var map = this.css_map;
    this.add_css_map_entry(map,
      'PART, CHAPTER, SECTION, SUBSECTION, SUBSUBSECTION, PRIMARY', [
        'clear: both'
      ]
    );
    this.add_css_map_entry(map,
      'SUBROW', [
        'display: flex',         
        'flex-direction: row',
        'align-items: baseline',
        'align-content: flex-start'
      ]
    );
    this.add_css_map_entry(map,
      'SUBGRID', [
        'display: grid',
        'grid-column-gap: 0.33em',
        'grid-row-gap: 0.33em',
        'align-items: end'
      ]
    );
    this.add_css_map_entry(map,
      'LINE', [
        'line-height: 1',
        'text-align: left',
        'position: relative',
        'display: block'
      ]
    );
    this.add_css_map_entry(map,
      'CENTER', [
        'text-indent: initial',
        'text-align: center'
      ]
    );
    this.add_css_map_entry(map,
      'FLUSHRIGHT', [
        'text-indent: initial',
        'text-align: right'
      ]
    );
    this.add_css_map_entry(map,
      'FLUSHLEFT', [
        'text-indent: initial',
        'text-align: left'
      ]
    );
    this.add_css_map_entry(map,
      'MATH', [
        'text-indent: initial',
        'text-align: left'
      ]
    );
    this.add_css_map_entry(map,
      'VERBATIM', [
        'text-indent: initial',
        'text-align: left',
        'line-height: 1'
      ]
    );
    this.add_css_map_entry(map,
      'VERSE', [
        'text-indent: initial',
        'text-align: left'
      ]
    );
    this.add_css_map_entry(map,
      'QUOTE', [
        'text-indent: initial',
        'text-align: left',
        'padding-left: 3em',
        'padding-right: 0em'
      ]
    );
    this.add_css_map_entry(map,
      'TABULAR', [
        'text-indent: initial'
      ]
    );
    this.add_css_map_entry(map,
      'PARBOX', [
        'text-indent: initial',
        'text-align: left',
      ]
    );
    this.add_css_map_entry(map,
      'DT', [
        'margin-bottom: 0',
      ]
    );
    this.add_css_map_entry(map,
      'DD', [
        'margin-left: 0',
        'padding-left: 10mm',
      ]
    );
    this.add_css_map_entry(map,
      'OL', [
        'padding-left: 2em',
      ]
    );
    this.add_css_map_entry(map,
      'UL', [
        'padding-left: 2em',
      ]
    );
    this.add_css_map_entry(map,
      'CAPTION', [
      ]
    );
    this.add_css_map_entry(map,
      'INDENTING', [
      ]
    );
    this.add_css_map_entry(map,
      'CENTERING', [
      ]
    );
    this.add_css_map_entry(map,
      'SAMPLE', [
        'line-height: 1',
      ]
    );
    this.add_css_map_entry(map,
      'PRIMARY', [
        'margin-top: 1',
      ]
    );
    this.add_css_map_entry(map,
      'PARAGRAPH, PART, CHAPTER, SECTION, SUBSECTION, SUBSUBSECTION, PRIMARY', [
        'text-indent: initial',
        'margin-top: 6pt',
        'margin-bottom: 6pt',
        'margin-left: 0',
        'margin-right: 0',
      ]
    );
    this.add_css_map_entry(map,
      'FIGURE', [
        'page-break-inside: avoid',
      ]
    );
  }
  add_css_map_entry(map,classes,rules){
    classes = classes.split(',');
    classes = classes.map(x => x.trim());
    classes.forEach((x) => {
      if(!map.hasOwnProperty(x)){
        map[x] = [];
      }
      for(var rule of rules){
        map[x].push(rule);
      }
    });
  }
  css(classes){
    classes = this.string_to_array(classes);
    var rules = [];
    classes.forEach((x) => {
      let rules1 = this.css_map[x];
      if(rules1 && Array.isArray(rules1)){
        rules = rules.concat(rules1);
      }  
    });
    ///merge duplicate rules
    var map = new Map();
    for(var rule of rules){
      let [key,val] = rule.split(':');
      key = key.trim();
      val = val.trim();
      map.set(key,val);
    }
    rules = [];
    for(var entry of map){
      rules.push(entry.join(':'));
    }
    return rules.join(';');
  }
  to_trigger_stylesheet(){
    return `\
    .TRIGGERED:not(:checked) + div {
      visibility: hidden;
    }
    `
  }
  string_to_tag_attributes(s){
    s = s.trimLeft();
    const re1 = /^(\w+)=\'(.*?)\'\s*(.*)$/s;
    var v;
    var attributes = {};
    while(s.length){
      if((v=re1.exec(s))!==null){
        attributes[v[1]] = v[2];
        s = v[3];
      }else{
        break;
      }
    }
    return attributes;
  }
  string_from_tag_attributes(attributes){
    var o = [];
    for(var key in attributes){
      if(attributes.hasOwnProperty(key)){
        let val = attributes[key];
        o.push(`${key}='${val}'`);
      }
    }
    return o.join(' ');
  }
  style_to_subcaption_style_s(style){
    let s_style = '';
    s_style += ';padding:0.2835em';
    if(this.html_caption_align=='l'){                               
      s_style += ';text-align:left';
    }else if(this.html_caption_align=='r'){
      s_style += ';text-align:right';
    }else{
      s_style += ';text-align:center';
    }
    if(this.html_caption_small){
      s_style += ';font-size:smaller'
    }
    return s_style;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  // 
  ////////////////////////////////////////////////////////////////////////////////
  plst_to_text(style,itemize){
    var text = this.itemize_to_text(style,itemize,'PARAGRAPH ITEMIZE');
    return text;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  ////////////////////////////////////////////////////////////////////////////////
  cove_to_text(style,cove){
    var n = cove.length;
    var p0 = cove[0];
    var pn = cove[cove.length-1];
    if(n >= 2 && p0.text.startsWith('```') && pn.text.startsWith('```')){
      let all = [];
      let ss = cove.map((p) => {
        return p.text;
      });
      let ssi = style.row;
      let o = this.do_bundle(style,ss,ssi);
      if(o.length){
        let img = o[0].img;
        // img = `<span class='COVE' style='--bull:"&#x25B8;";--pad:-1.0em;display:inline-flex;'> ${img} </span>`;
        img = `<span style='position:relative;padding-left:3em;display:inline-flex;'> <span style='position:absolute;left:2em;'> &#x25B8; </span> ${img} </span>`;
        all.push(img);
      }
      var text = all.join('\n');
      var css = this.css('PARAGRAPH INDENTING');
      return `<figure class='PARAGRAPH INDENTING' style='${css}' data-row='${style.row}' > ${text} </figure>`;  ///figure used rather than p because 'img' is a table element and the table cannot be placed inside a p
    }else{
      let all = [];
      //all normal font size
      cove.forEach((p,i,arr) => {
        all.push(`<span data-row='${p.n}' > ${this.uncode(style,p.text)} </span>`);
        if(i==arr.length-1) {
        }else{
          all.push('<br/>');
        }
      })
      var text = all.join('\n');
      var text = `<span style='display:inline-block'> ${text} </span>`;
      var text = `<span style='position:relative;padding-left:3em;'> <span style='position:absolute;left:2em;'> &#x25B8; </span> ${text} </span>`;
      var css = this.css('PARAGRAPH INDENTING');
      return `<p class='PARAGRAPH INDENTING' style='${css}' data-row='${style.row}' > ${text} </p>`;
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  ////////////////////////////////////////////////////////////////////////////////
  cave_to_text(style,cave){
    var n = cave.length;
    var p0 = cave[0];
    var pn = cave[cave.length-1];
    if(n >= 2 && p0.text.startsWith('```') && pn.text.startsWith('```')){
      let all = [];
      let ss = cave.map((p) => {
        return p.text;
      });
      let ssi = style.row;
      let o = this.do_bundle(style,ss,ssi);
      if(o.length){
        let img = o[0].img;
        img = `<span style='width:100%;display:inline-flex;justify-content:center;' > ${img} </span>`;
        all.push(img);
      }
      var text = all.join('\n');
      var css = this.css('PARAGRAPH CENTERING');
      return `<figure class='PARAGRAPH CENTERING' style='${css}' data-row='${style.row}' > ${text} </figure>`;  
    }else{
      let all = [];
      //all normal font size
      cave.forEach((p,i,arr) => {
        all.push(`<span style='text-align:center' data-row='${p.n}' > ${this.uncode(style,p.text)} </span>`);
        if(i==arr.length-1) {
        }else{
          all.push('');
        }
      })
      var text = all.join('\n');
      var text = `<span style='width:100%;display:inline-flex;flex-direction:column;justify-content:center;' > ${text} </span>`;
      var css = this.css('PARAGRAPH CENTERING');
      return `<p class='PARAGRAPH CENTERING' style='${css}' data-row='${style.row}' > ${text} </p>`;
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  ////////////////////////////////////////////////////////////////////////////////
  samp_to_text(style,samp){
    var o = [];
    var ss = samp.map((p,i,arr) => {
      let x = p.text;
      x = x.trimRight();
      if(x.length==0){
        x = '&#160;';
      }else{
        x = this.polish_verb(style,x);
      }
      return `<span data-row='${p.n}'><code>${x}</code></span>`;
    })
    var text = ss.join('<br/>\n');
    var css = this.css('PARAGRAPH SAMPLE');
    if(this.html_samp_small){
      css += ';font-size:80%';
    }
    return`<p class='PARAGRAPH SAMPLE' style='${css}' data-row='${style.row}' > ${text} </p>`;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  ////////////////////////////////////////////////////////////////////////////////
  prim_to_text(style,title,body){
    var title = this.uncode(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    if(style.rank==2){
      title = (`<b><i>${title}</i></b> &#160;`)
    }else{
      title = (`<b>${title}</b> &#160;`)
    }
    let css = this.css('PARAGRAPH PRIMARY');
    return `<p class='PARAGRAPH PRIMARY' style='${css}' data-row='${style.row}' > ${title} ${text} </p>`;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  ////////////////////////////////////////////////////////////////////////////////
  body_to_text(style,body){
    body = this.trim_samp_body(body);
    var n = body.length;
    var s0 = body[0];
    var sn = body[n-1];
    if(n >= 2 && s0.startsWith('```') && sn.startsWith('```')){
      let all = [];
      let ss = body
      let ssi = style.row;
      let o = this.do_bundle(style,ss,ssi);
      if(o.length){
        let img = o[0].img;
        img = `<span style='width:100%;display:inline-flex;justify-content:flex-start;' > ${img} </span>`;
        all.push(img);
      }
      var text = all.join('\n');
      var css = this.css('PARAGRAPH NORMAL');
      return `<figure class='PARAGRAPH NORMAL' style='${css}' data-row='${style.row}' > ${text} </figure>`;  
    }else{
      var text = this.join_para(body);
      var text = this.uncode(style,text);
      var css = this.css('PARAGRAPH NORMAL');
      return `<p class='PARAGRAPH NORMAL' style='${css}' data-row='${style.row}' > ${text} </p>`;
    }
  }
  
}
module.exports = { NitrilePreviewHtml };
