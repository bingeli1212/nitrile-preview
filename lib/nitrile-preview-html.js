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
    this.css_map = {};
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
    ///nitrile-preview-view
    this.view = null;
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
  hdgs_to_part(title,label,partnum,chapternum,level,style){
    var cls = 'PART';
    return(`<h1 row='${style.row}' class='${cls}'> Part ${partnum} &#160; ${this.uncode(style,title)} </h1>`);
  }
  hdgs_to_chapter(title,label,partnum,chapternum,level,style){
    var cls = 'CHAPTER';
    this.addto_refmap(label,`${chapternum}`);
    return(`<h1 row='${style.row}' class='${cls}'> Chapter ${chapternum} &#160; ${this.uncode(style,title)} </h1>`);
  }
  hdgs_to_section(title,label,partnum,chapternum,level,style){
    var cls = 'SECTION';
    if(chapternum){
      this.addto_refmap(label,`${chapternum}.${level}`);
      return(`<h2 row='${style.row}' class='${cls}'> ${chapternum}.${level} &#160; ${this.uncode(style,title)} </h2>`);  
    }
    this.addto_refmap(label,`${level}`);
    return(`<h2 row='${style.row}' class='${cls}'> ${level} &#160; ${this.uncode(style,title)} </h2>`);
  }
  hdgs_to_subsection(title,label,partnum,chapternum,level,style){
    var cls = ('SUBSECTION');
    if(chapternum){
      this.addto_refmap(label,`${chapternum}.{level}`);
      return(`<h3 row='${style.row}' class='${cls}'> ${chapternum}.${level} &#160; ${this.uncode(style,title)} </h3>`);  
    }
    this.addto_refmap(label,`${level}`);
    return(`<h3 row='${style.row}' class='${cls}'> ${level} &#160; ${this.uncode(style,title)} </h3>`);
  }
  hdgs_to_subsubsection(title,label,partnum,chapternum,level,style){
    var cls = ('SUBSUBSECTION');
    if(chapternum){
      this.addto_refmap(label,`${chapternum}.{level}`);
      return(`<h4 row='${style.row}' class='${cls}'> ${chapternum}.${level} &#160; ${this.uncode(style,title)} </h4>`);  
    }
    this.addto_refmap(label,`${level}`);
    return(`<h4 row='${style.row}' class='${cls}'> ${level} &#160; ${this.uncode(style,title)} </h4>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////////////
  item_dl_to_text(style,i,item,nblank){
    var o = [];
    var value = this.uncode(style,item.value);
    if(Array.isArray(item.values)){
      value = item.values.map((s) => this.uncode(style,s)).join('<br/>');
    }
    var text = this.untext(style,item.body).trim();
    //var cls = (!nblank) ? 'PACK' : 'PARA';
    if(nblank){
      o.push(`<dt class='PARA DT'> <b> ${value} </b> </dt> <dd class='PACK DD'> ${text} </dd> <dd class='PARA DD'>`);
    }else{
      o.push(`<dt class='PACK DT'> <b> ${value} </b> </dt> <dd class='PACK DD'> ${text} </dd> <dd class='PACK DD'>`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA'> ${this.untext(style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    o.push(`</dd>`);
    return o.join('\n\n');
  }
  item_hl_to_text(style,i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.polish_verb(style,text);
    var text = `<code>${text}</code>`;
    if(nblank) {
      o.push(`<li class='PARA LI'> ${text} `);      
    } else {
      o.push(`<li class='PACK LI'> ${text} `);      
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA'> ${this.untext(style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    o.push(`</li>`);
    return o.join('\n\n');
  }
  item_ol_to_text(style,i,item,nblank){
    var o = [];
    var text = this.untext(style,item.body);
    var li_cls = ''
    if(nblank) li_cls = ('PARA LI');
    else       li_cls = ('PACK LI');
    if(item.type == 'A'){
      let value = i+1;
      value = this.int_to_letter_A(value);
      o.push(`<li class='${li_cls}' type=''  value='${item.value}' style='--bull:"${value}."' > ${text}`)
    }else if(item.type == 'a'){
      let value = i+1;
      value = this.int_to_letter_a(value);
      o.push(`<li class='${li_cls}' type=''  value='${item.value}' style='--bull:"${value}."' > ${text}`)
    }else if(item.type == 'I'){
      let value = i+1;
      value = this.int_to_letter_I(value);
      o.push(`<li class='${li_cls}' type=''  value='${item.value}' style='--bull:"${value}."' > ${text}`)
    }else if(item.type == 'i'){
      let value = i+1;
      value = this.int_to_letter_i(value);
      o.push(`<li class='${li_cls}' type=''  value='${item.value}' style='--bull:"${value}."' > ${text}`)
    }else if(item.value) {
      let value = item.value;
      o.push(`<li class='${li_cls}'          value='${item.value}' style='--bull:"${value}."' > ${text}`);
    }else if(item.bullet=='*'){
      let value = i+1;
      o.push(`<li class='${li_cls}'          value='${value}'      style='--bull:"${value}."' > ${text}`);
    }else{
      let value = i+1;
      value = this.int_to_letter_i(value);
      o.push(`<li class='${li_cls}' type=''  value='${item.value}' style='--bull:"${value}."' > ${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA' > ${this.untext(style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
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
    var text = this.untext(style,item.body);
    var li_cls = '';
    if(nblank) li_cls = ('PARA LI');
    else       li_cls = ('PACK LI');
    if(key){
      if(keytype=='var'){
        text = `${this.literal_to_var(style,key)}${sep}${text}`;
      }else if(keytype=='verb'){
        text = `${this.literal_to_verb(style,key)}${sep}${text}`;
      }else{
        text = `${this.polish(style,key)}${sep}${text}`;
      }
    }
    o.push(`<li class='${li_cls}' style='--bull:"&#x2022;"' > ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA' > ${this.untext(style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    o.push('</li>')
    return o.join('\n\n')
  }
  itemize_to_text(style,itemize){
    var bull = itemize.bull;
    var items = itemize.items;
    var nblank = itemize.nblank;
    var o = [];
    switch (bull) {
      case 'DL': {
        var dl_cls = '';
        if(nblank) dl_cls = ('PARA DL');
        else       dl_cls = ('PACK DL');    
        o.push(`<dl class='${dl_cls}'>`);
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
        o.push(`</dl>`)
        break;
      }
      case 'OL': {
        var ol_cls = '';
        if(nblank) ol_cls = ('PARA OL');
        else       ol_cls = ('PACK OL');    
        o.push(`<ol class='${ol_cls}'>`);
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push('</ol>')
        break;
      }
      case 'UL': {
        var ul_cls = '';
        if(nblank) ul_cls = ('PARA UL');
        else       ul_cls = ('PACK UL');    
        o.push(`<ul class='${ul_cls}'>`);
        items.forEach((item,j) => {
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
  //
  /////////////////////////////////////////////////////////////////////
  do_HRLE(block) {
    var {style,text} = block;
    var text = `<hr  />`;
    return text;
  }

  /////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////
  polish_verb(style,unsafe){
    ///needed by the translator
    unsafe = this.polish(style,unsafe);
    unsafe = this.replace_blanks_with(unsafe,'&#160;')
    return unsafe;
  }
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
  ///       
  ///       
  /////////////////////////////////////////////////////////////////////
  fence_to_displaymath(style,ss) {
    var text = this.tokenizer.to_fence_math(style,ss);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    if(w){           
      var stretch = 0;
      var img = `\n<table class='DISPLAYMATH' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='DISPLAYMATH' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else{
      var stretch = 1;
      var img = `\n<table class='DISPLAYMATH' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='DISPLAYMATH' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_math(style,ss) {
    var cnt = ss.join(' ');
    var text = this.tokenizer.to_phrase_math(style,cnt);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    if(w){           
      var stretch = 0;
      var img = `\n<table class='DISPLAYMATH' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='DISPLAYMATH' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else{
      var stretch = 1;
      var img = `\n<table class='DISPLAYMATH' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='DISPLAYMATH' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_ink(style,ss){
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
    for (var i=0; i < npara; ++i) {
      let s = ss[i];
      s = this.polish(style,s);
      s = this.replace_blanks_with(s,'&#160;');
      var x = 0;
      all.push( `<tspan y="${vgap + (i+extra_dy)*10*this.PT_TO_MM}mm" x="0">${s}</tspan>` );
    }
    all.push( `</text>`);
    var img = all.join('\n');    
    var css = '';
    css += this.style_to_css_border(style);
    const vw = inkwidth*this.MM_TO_PX;
    const vh = inkheight*this.MM_TO_PX;
    const stretch = style.stretch;
    const width = this.g_to_width_float(style);
    const height = this.g_to_height_float(style);
    if (stretch) {         
      css += `; width:100%`;
      css += `; height:auto`; 
      var w = vw;
      var h = vh;
    } else if (width && height) {
      css += `; width:${width}mm`;
      css += `; height:${height}mm`;
      var w = width*this.MM_TO_PX;
      var h = height*this.MM_TO_PX;
    } else if (width) {
      css += `; width:${width}mm`;
      css += `; height:${width*(inkheight/inkwidth)}mm`;
      var w = width*this.MM_TO_PX;
      var h = width*(inkheight/inkwidth)*this.MM_TO_PX;
    } else if (style.height) {
      css += `; width:${height*(inkwidth/inkheight)}mm`;
      css += `; height:${height}mm`;
      var w = height*(inkwidth/inkheight)*this.MM_TO_PX;
      var h = height*this.MM_TO_PX;
    } else {
      css += `; width:${inkwidth}mm`;
      css += `; height:${inkheight}mm`;
      var w = inkwidth*this.MM_TO_PX;
      var h = inkwidth*this.MM_TO_PX;
    }
    let ENCODE = 0;
    if(ENCODE){
      let s_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}" >${img}</svg>`;
      img = `<object class='INK' style='${css}' width='${w}' height='${h}' data='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}'></object>`;
    }else{
      img = `<svg class='INK' style='${css}' width='${this.fix(w)}' height='${this.fix(h)}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='none' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${img}</svg>`;
    }
    var o = [];
    var subc = '';
    if(style.stretch){
      var img = `\n<table cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'>${subc}</caption>\n<tr><td>${img}</td></tr>\n</table>`;
      var fig = `\n<table cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'>${subc}</caption>\n<tr><td>${img}</td></tr>\n</table>`;
    }else{
      var img = `\n<table cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'>${subc}</caption>\n<tr><td>${img}</td></tr>\n</table>`;
      var fig = `\n<table cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'>${subc}</caption>\n<tr><td>${img}</td></tr>\n</table>`;
    }
    o.push({img,subc,w,h,stretch,fig});
    return o;
  }
  fence_to_dia(style,ss){
    var o = this.diagram.to_diagram(style,ss);
    o = o.map((p) => {
      let width = this.g_to_width_float(style);
      let height = this.g_to_height_float(style);
      if (width) {
        var w = width*this.MM_TO_PX;
        var h = '';
      } else {
        var w = p.vw;
        var h = p.vh;
      }
      var flt = '';
      if (style.float=='right') {         
        flt = 'FLOATRIGHT';
      } else if(style.float=='left'){
        flt = 'FLOATLEFT';
      } 
      var frame = (style.frame)?`frame='box'`:``;
      var s_svg = `<svg class='DIASVG' width='100%' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}" >${p.svgtext}</svg>`;
      //var img = `<object class='DIA' style='${css}' width='${p.vw}' height='${p.vh}' data='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}' ></object>`;
      p.subc = this.uncode(style,p.subtitle);
      p.stretch = style.stretch;
      p.w = w;
      p.h = h;
      if(style.stretch){
        p.img = `\n<table class='DIA ${flt}' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'>         </caption>\n<colgroup/><thead/><tbody><tr><td>${s_svg}</td></tr></tbody>\n</table>`;
        p.fig = `\n<table class='DIA ${flt}' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'>${p.subc}</caption>\n<colgroup/><thead/><tbody><tr><td>${s_svg}</td></tr></tbody>\n</table>`;
      }else{
        p.img = `\n<table class='DIA ${flt}' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'>         </caption>\n<colgroup/><thead/><tbody><tr><td>${s_svg}</td></tr></tbody>\n</table>`;
        p.fig = `\n<table class='DIA ${flt}' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'>${p.subc}</caption>\n<colgroup/><thead/><tbody><tr><td>${s_svg}</td></tr></tbody>\n</table>`;
      }
      return p;
    });
    return o;
  }
  fence_to_verbatim(style,ss){
    var ss = ss.map(x => x.trimRight());
    var ss = ss.map(x => x?this.polish_verb(style,x):'&#160;');
    if(style.small){
      var ss = ss.map(x => `<small>${x}</small>`);
    }
    var ss = ss.map(x => `<div><code>${x}</code></div>`);
    var text = ss.join('\n');
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    var stretch = 1;
    var img = `\n<table class='VERBATIM' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    var fig = `\n<table class='VERBATIM' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_center(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    var img = text;
    if(w){           
      var stretch = 0;
      var img = `\n<table class='CENTER' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='CENTER' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else{
      var stretch = 1;
      var img = `\n<table class='CENTER' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='CENTER' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_flushright(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    var img = text;
    if(w){           
      var stretch = 1;
      var img = `\n<table class='FLUSHRIGHT' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='FLUSHRIGHT' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else{
      var stretch = 0;
      var img = `\n<table class='FLUSHRIGHT' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='FLUSHRIGHT' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_flushleft(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    var img = text;
    if(w){           
      var stretch = 0;
      var img = `\n<table class='FLUSHLEFT' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'>         </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='FLUSHLEFT' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else{
      var stretch = 1;
      var img = `\n<table class='FLUSHLEFT' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'>         </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='FLUSHLEFT' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_tabular(style,ss) {
    var {rows,subtitle} = this.ss_to_tabular_rows(ss,style);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(style,p.raw);
        if(style.small){
          p.text = `<small>${p.text}</small>`;
        }
      })
    })
    var n = rows.length?rows[0].length:1;
    var ww = this.halign_to_html_ww(n,style.halign);
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    var all = [];
    let lower = '';
    if(style.head && rows.length){
      let pp = rows.shift();
      all.push(`<thead>`);
      all.push(`<tr>`)
      pp.forEach((x,k) => {
        let {raw,text} = x;
        let css = '';
        css += `; text-align:${ww[k].ta}`;
        all.push(`<th class='TH' style='${css}'> ${text} </th>`);
      })
      all.push('</tr>');
      all.push('</thead>');
      lower = pp.lower;
    }
    all.push(`<tbody>`);
    rows.forEach((pp,j,arr) => {
      if(lower==2){
        all.push(`<tr><td style='border-top:1px solid;border-bottom:1px solid;' colspan='${n}' height='0'></td></tr>`);
      }
      all.push('<tr>');
      pp.forEach((x,k) => {
        let {raw,text} = x;
        let color = '';
        if(cellcolor_map.has(raw)){
          color = cellcolor_map.get(raw);
        }
        let css = '';
        css += `; text-align:${ww[k].ta}`;
        if(j+1==arr.length){
          //do nothing, the rules= attribute will take care of it
        }else{
          if(lower==1){
            css += `; border-top:1px solid`;
          }
        }
        if(style.side && k == 0){
          //do not color the side column
          color = '';
        }
        if(color){
          css += `; background-color:${color}`
        }
        all.push(`<td class='TD' style='${css}'> ${text} </td>`); 
      });
      all.push('</tr>')
      lower = pp.lower;  
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
    var subc = this.uncode(style,subtitle);
    var img = `<table class='TABULAR' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' class='TABULAR'>\n<caption align='bottom' class='SUBCAPTION'>       </caption>\n${colgroup}\n${text}\n</table>`;
    var fig = `<table class='TABULAR' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' class='TABULAR'>\n<caption align='bottom' class='SUBCAPTION'>${subc}</caption>\n${colgroup}\n${text}\n</table>`;
    var o = [];
    var stretch = style.stretch;
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_verse(style,ss) {
    var itms = this.ss_to_lines_itms(ss,style);
    var bullet = '&#x2022;'
    const squarebox  = '&#x25A0;';         
    const squareboxo = '&#x25A1;';           
    const circlebox  = '&#x25C6;';         
    const circleboxo = '&#x25C7;';           
    const check_ss = this.string_to_array(this.assert_string(style.check));
    var parsep = this.assert_float(style.parsep);
    let d = [];
    itms.forEach((p,i,arr) => {
      if(p.text=='\\\\'){
        p.text = '&#160;';
      }else{
        p.text = this.uncode(style,p.text);
      }
      p.value = this.uncode(style,p.value);
      p.bull = this.uncode(style,p.bull);
      if(p.type=='UL'){
        d.push(`<div>${bullet} ${p.text}</div>`);
      }
      else if(p.type=='OL'){
        d.push(`<div>${i+1}. ${p.text}</div>`);  
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        d.push(`<div>${p.value}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        d.push(`<div>${this.int_to_letter_a(p.value)}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        d.push(`<div>${this.int_to_letter_A(p.value)}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'DL'){
        d.push(`<div><b>${p.value}</b> ${p.text}</div>`)
      }
      else if(p.type == 'INDENTED'){
        //empty CB
        let s = '&#160;'.repeat(p.value);
        d.push(`<div> ${s}${p.text}</div> `);
      }
      else {
        ///ordinary line without a leading bullet
        d.push(`<div>${p.text}</div>`);
      }
    });
    var text = d.join('\n')
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    var img = text;
    if(w){           
      var stretch = 0;
      var img = `\n<table class='VERSE' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'>         </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='VERSE' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else{
      var stretch = 1;
      var img = `\n<table class='VERSE' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'>         </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='VERSE' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_quote(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var text = text.trim();
    if(style.q){
      text = `<q>${text}</q>`;
    }
    if(style.small){
      text = `<small>${text}</small>`
    }
    if(style.italic){
      text = `<i>${text}</i>`;
    }
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    if(w){           
      var stretch = 0;
      var img = `\n<table class='QUOTE' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'>         </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='QUOTE' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else{
      var stretch = 1;
      var img = `\n<table class='QUOTE' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'>         </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='QUOTE' ${frame} ${rules} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> ${subc} </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  fence_to_parbox(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var text = text.trim();
    if(style.small){
      text = `<small>${text}</small>`
    }
    if(style.italic){
      text = `<i>${text}</i>`;
    }
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    var w = width*this.MM_TO_PX;
    var h = height*this.MM_TO_PX;
    var frame = (style.frame)?`frame='box'`:``;
    var rules = '';
    var subc = '';
    if(w && h){           
      var stretch = 0;
      var img = `\n<table class='PARBOX' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' height='${h}' >\n<caption align='bottom' class='SUBCAPTION'> </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='PARBOX' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' height='${h}' >\n<caption align='bottom' class='SUBCAPTION'> </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else if(w){           
      var stretch = 0;
      var img = `\n<table class='PARBOX' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='PARBOX' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='${w}' >\n<caption align='bottom' class='SUBCAPTION'> </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }else{
      var stretch = 1;
      var img = `\n<table class='PARBOX' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
      var fig = `\n<table class='PARBOX' ${frame} cellpadding='0' cellspacing='0' style='display:inline-table' width='100%' >\n<caption align='bottom' class='SUBCAPTION'> </caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    }
    var o = [];
    o.push({img,subc,stretch,w,h,fig});
    return o;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// This function is called during 'untext()' and for each block of text that is
  /// not part of a bundle
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  text_to_text(style,text,seq){
    var text = text.trim();
    if(text.length){
      text = this.uncode(style,text);
      if(seq==0){
        if(style.float){
        }else{
          ///add some text indentation white spaces
          let indent = this.prefix_indent;
          text = `${indent}${text}`;
        }
      }
    }
    return text;
  }
  /////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////
  float_to_paragraph(title,label,style,body){
    var all = [];
    all.push('');
    var text = this.untext(style,body);
    if(title){
      title = this.uncode(style,title);
      if(style.rank==2){
        all.push(`<b><i>${title}</i></b> &#160;`)
      }else{
        all.push(`<b>${title}</b> &#160;`)
      }
    }
    all.push(text);
    if(title){
      var cls = 'PARAGRAPH PRIMARY';
    }else{
      var cls = 'PARAGRAPH';
    }
    return `<div class='${cls}' > ${all.join('\n')} </div>`;
  }
  float_to_indent(title,label,style,body){
    var style = {...style,title,label,float:'indent'};
    var all = [];
    var text = this.untext(style,body);
    all.push('');
    all.push(text);
    var text = all.join('\n');
    let cls = 'PARAGRAPH INDENTING';
    return `<div class='${cls}' > ${text} </div>`;
  }
  float_to_sample(title,label,style,body){
    body = this.trim_samp_body(body);
    var ss = body;
    var ss = ss.map(x => x.trimRight());
    var ss = ss.map(x => x?this.polish_verb(style,x):'&#160;');
    if(style.small){
      var ss = ss.map(x => `<small>${x}</small>`);
    }
    var ss = ss.map(x => `<div><code>${x}</code></div>`);
    var text = ss.join('\n');
    var text = `<div class='SAMPLEBODY'> ${text} </div>`;
    var text = `<div class='SAMPLE'> ${text} </div>`;
    return text;
  }
  float_to_itemize(title,label,style,itemize){
    var style = {...style,title,label,float:'itemize'};
    var all = [];
    var text = this.itemize_to_text(style,itemize);
    if(title){
      title = this.uncode(style,title);
      all.push(`<div><b>${title}</b></div>`);
    }
    all.push(text);
    return(`<div class='ITEMIZE' > ${all.join('\n')} </div>`)
  }
  float_to_equation(title,label,style,ss){
    var style = {...style,title,label,float:'equation'};
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='bundle'){
        all.push(p.img);
      }
    });
    var text = all.join('\n');
    let idnum = this.to_idnum('equation');///should be overriden by subclasses
    if(label){
      this.addto_refmap(label,idnum);
    }  
    idnum = `(${idnum})`;
    var span = `<span style='position:absolute;left:0;top:50%;transform:translate(0,-50%);'>${idnum}</span>`;
    var text = `<div class='EQUATION' style='position:relative;' > ${span} ${text} </div>`;
    return text;
  }
  float_to_listing(title,label,style,ss){
    style = {...style,float:'listing'};
    var ss = this.trim_samp_body(ss);
    var ss = ss.map((s,i) => {
      var s = this.polish(style,s);
      return `<code style='white-space:pre'>${s}</code>`;
    });
    var ss = ss.map((s,i) => {
      return `<tr><td>${i+1}</td><td>${s}</td></tr>`;
    })
    var text = ss.join('\n');
    var text = `<table class='LISTINGBODY'>${text}</table>`;
    return `<figure class='LISTING'> ${this.to_caption_text(title,label,style,"listing")} ${text} </figure>`;
  }
  float_to_figure(title,label,style,ss){
    style = {...style,title,label,float:'figure'};
    let itms = this.ss_to_figure_itms(ss,style);
    let salign = style.salign;
    var all = [];
    if(style.wrap){
      let s_style = 'text-align:left';
      if(salign=='c'){                               
        s_style = 'text-align:center';
      }else if(salign=='r'){
        s_style = 'text-align:right';
      }
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let img = p.fig;
          let seq = p.seq;
          if(style.subnum){
            img = this.fig_to_subnum(img,seq);
          }
          all.push(img);
        }else if(p.type=='\\\\'){
          all.push(`<br/>`);
        }
      });
      var text = all.join('\n');
      if(style.type=='table'){
        return `<figure class='TABLE'  style='${s_style}' > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
      }else{
        return `<figure class='FIGURE' style='${s_style}' > ${this.to_caption_text(title,label,style,"figure")} ${text} </figure>`;
      }
    }else{
      let s_style = 'justify-content:flex-start';
      if(salign=='c'){                               
        s_style = 'justify-content:center';
      }else if(salign=='r'){
        s_style = 'justify-content:flex-end';
      }
      var onerow = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let img = p.fig;
          let seq = p.seq;
          if(style.subnum){
            img = this.fig_to_subnum(img,seq);
          }
          onerow.push(img);
        }else if(p.type=='\\\\'){
          all.push(`<div class='SUBROW' style='${s_style}' > ${onerow.join('&#160;\n')} </div>`);
          onerow = [];
        }
      });
      if(onerow.length){
        all.push(`<div class='SUBROW' style='${s_style}' > ${onerow.join('&#160;\n')} </div>`);
      }
      var text = all.join('\n');
      if(style.type=='table'){
        return `<figure class='TABLE' > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
      }else{
        return `<figure class='FIGURE'  > ${this.to_caption_text(title,label,style,"figure")} ${text} </figure>`;
      }
    }
  }
  float_to_longtable(title,label,style,ss){
    style = {...style,float:'longtable'};
    var itms = this.ss_to_figure_itms(ss,style);
    var text = '';
    for(let itm of itms){
      if(itm.type=='bundle' && itm.key=='tabular'){
        text = itm.img;
        break;
      }
    }
    return `<figure class='LONGTABLE' > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
  }
  float_to_tabbing(title,label,style,body){
    style = {...style,float:'tabbing'};
    var cols = this.ss_to_clusters(body);
    var cols = cols.map((ss) => ss.map((s) => this.uncode(style,s)));
    if(style.small){
      cols = cols.map((ss) => ss.map((s) => `<small>${s}</small>`));
    }
    var n = cols.length;
    var rows = this.cols_to_rows(cols);
    if(cols.length==1){
      var rows = this.col_one_to_rows(cols[0]);
      n = rows[0].length;
    }
    var gap = parseFloat(style.gap)||0.02;
    var strut = parseFloat(style.strut)||0;
    var frs = this.string_to_frs_with_gap(style.fr||'',n,gap);
    var all = [];
    rows.forEach((ss,i,arr) => {
      if(style.head && i==0){
        ss = ss.map((x) => `<b>${x}</b>`);
      }
      var minheight = gap?`height:${strut}pt`:"";
      ss = ss.map((x,i) => `<td style='width:${frs[i]*100}%;${minheight};' >${x}</td>`);
      all.push('<tr>')
      all.push(ss.join(`<td style='width:${gap*100}%' ></td>`));
      all.push('</tr>')
    });
    var text = all.join('\n')
    var css = '';
    css += this.style_to_css_width(style,'100%');  
    text = `<table border='0' style='${css}'  > ${text} </table>`;
    return `<div class='TABBING' > ${text} </div>`
  }
  float_to_columns(title,label,style,ss){
    style = {...style,float:'columns'};
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    var sep = `<div style='break-before:column;'></div>`;
    var rows = [];
    var row = [];
    rows.push(row);
    var n = this.g_to_n_int(style);
    var n = Math.max(1,n);
    itms.forEach((p,j,arr) => {
      if(p.type=='\\\\'){
        row = [];
        rows.push(row);
      }else if(p.type=='bundle'){
        row.push(p.fig);
      }
    });
    rows.forEach((row) => {
      let n = row.length;
      let sep = '&#160;';
      all.push(`<div class='SUBROW'>`);
      all.push(row.join(sep))
      all.push(`</div>`);
    });
    var text = all.join('\n');
    return text;
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
  to_caption_text(title,label,style,key){
    let caption_text = this.uncode(style,title).trim();
    let none = this.assert_int(style.nocaption);
    let tag = this.to_tag(key);
    if(none && !caption_text){
      return '';
    }if(none && caption_text){
      let lead = `${tag}: ${caption_text}`;
      return `<figcaption class='FIGCAPTION' >${lead} </figcaption>`;
    }else{
      let idnum = this.to_idnum(key);
      if(label){
        this.addto_refmap(label,idnum);
      }
      let lead = `${tag} ${idnum}: ${caption_text}`;
      return `<figcaption class='FIGCAPTION' >${lead} </figcaption>`;
    }
  }

  to_idnum(name){
    var idnum = 0;
    if(name=='equation'){
      idnum = ++this.equation_num;
    }
    if(name=='figure'){
      idnum = ++this.figure_num;
    }
    if(name=='table' || name=='longtable'){
      idnum = ++this.table_num;
    }
    if(name=='listing'){
      idnum = ++this.listing_num;
    }
    return idnum;
  }

  to_tag(name){
    var tag = '';
    if(name=='equation'){
      tag = 'Equation'
    }
    if(name=='figure'){
      tag = 'Figure'
    }
    if(name=='table' || name=='longtable'){
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
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_verb(style,cnt){ 
    let s = this.polish_verb(style,cnt);
    s = `<q><code>${s}</code></q>`;
    return s;
  }
  literal_to_single(style,cnt){ 
    let s = this.polish_verb(style,cnt);
    s = `<code>${s}</code>`;
    return s;
  }
  literal_to_escape(style,cnt){
    let s = this.polish_verb(style,cnt);
    s = `<code>${s}</code>`;
    return s;
  }
  literal_to_math(style,cnt){
    return this.tokenizer.to_phrase_math(style,cnt);
  }
  literal_to_var(style,cnt){
    var ss = cnt.split('/');
    var ss = ss.map((s) => {return this.polish(style,s)});
    var ss = ss.map((s) => `<var>${s}</var>`);
    return ss.join('/');
  }
  literal_to_node(style,cnt){
    cnt = `<code>&lt;${cnt}&gt;</code>`;
    return cnt;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_em(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<i>${cnt}</i>`
  }
  phrase_to_b(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<b>${cnt}</b>`
  }
  phrase_to_i(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<i>${cnt}</i>`
  }
  phrase_to_u(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<u>${cnt}</u>`
  }
  phrase_to_s(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<s>${cnt}</s>`
  }
  phrase_to_q(style,cnt){
    cnt = this.uncode(style,cnt);
    let ldquo = String.fromCodePoint(0x201C);
    let rdquo = String.fromCodePoint(0x201D);
    return `${ldquo}${cnt}${rdquo}`;
  }
  phrase_to_g(style,cnt){
    cnt = this.uncode(style,cnt);
    return `&#x00AB;${cnt}&#x00BB;`
  }
  phrase_to_high(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<sup>${cnt}</sup>`;
  }
  phrase_to_low(style,cnt){
    cnt = this.uncode(style,cnt);
    var css = '';
    return `<sub>${cnt}</sub>`;
  }
  phrase_to_small(style,cnt){
    cnt = this.uncode(style,cnt);
    var css = '';
    return `<small>${cnt}</small>`;
  }
  phrase_to_sans(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<span style='font-family:sans-serif'> ${cnt} </span>`;
  }
  phrase_to_mono(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<span style='font-family:monospace'> ${cnt} </span>`;
  }
  /////////////////////////////////////////////
  phrase_to_br(style,cnt){
    return `<br/>`
  }
  phrase_to_columnbreak(style,cnt){
    return `<div style='break-before:column;'></div>`;
  }
  phrase_to_quad(style,cnt){
    return `<span style='display:inline-block;width:1em;'></span>`;
  }
  phrase_to_qquad(style,cnt){
    return `<span style='display:inline-block;width:2em;'></span>`;
  }
  phrase_to_ref(style,cnt){
    if(cnt){
      return `\uFFFF${cnt}\uFFFF`;
    }
    return "??";
  }
  phrase_to_link(style,cnt){
    return `<a href='${cnt}'>${cnt}</a>`
  }
  ///all picture phrases
  phrase_to_colorbutton(style,cnt){
    //return `<span style='display:inline-block;color:${cnt};box-sizing:border-box;border:1px solid black;padding:1pt;'> &#x2588; </span>`;
    return `<span style='display:inline-block;color:${cnt};box-sizing:border-box;border:1px solid black;padding:0pt;'> &#x25FC; </span>`;
    //return `<span style='display:inline-block;color:${cnt};box-sizing:border-box;border:1px solid black;padding:1pt;'> &#x25A0; </span>`;
  }
  phrase_to_framebox(style,cnt){
    if(cnt){          
      var wd = ""+cnt+"mm";
    }else{
      var wd = '10mm';
    }
    return `<span style='display:inline-block;box-sizing:border-box;border:1px solid currentColor;padding:1px;width:${wd};'> &#160; </span>`;
  }
  phrase_to_default(style,cnt) {
    return `<span>${this.uncode(style,cnt)}</span>`
  }
  phrase_to_utfchar(style,cnt){
    return `&#x${cnt};`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  untext(style,body){
    var text = super.untext(style,body);
    var text = text.trim();
    const s = '<br/>';
    if(text.startsWith(s)){
      text = text.substr(s.length);
    }
    if(text.endsWith(s)){
      text = text.substr(0,text.length-s.length);
    }
    return text;
  }

  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
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
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  to_css_map(){
    var map = {};
    this.add_css_map_entry(
      map,
      'WRAPLEFT', [
        'text-indent: initial',
        'float: left',
        'margin-right: 1em' 
      ]);

    this.add_css_map_entry(
      map,
      'WRAPRIGHT', [
        'text-indent: initial',
        'float: right',
        'margin-left: 1em' 
      ]);
    
    this.add_css_map_entry(
      map,
      'CENTER', [
        'text-indent: initial',
        'text-align:center',
        `margin-top: ${this.n_para}`,
        `margin-bottom: ${this.n_para}`
      ]);
    
    this.add_css_map_entry(
      map,
      'FLUSHRIGHT', [
        'text-indent: initial',
        'text-align:right',
        `margin-top: ${this.n_para}`,
        `margin-bottom: ${this.n_para}` 
      ]);

    this.add_css_map_entry(
      map,
      'FLUSHLEFT', [
        'text-indent: initial',
        'text-align:left',
        `margin-top: ${this.n_para}`,
        `margin-bottom: ${this.n_para}` 
      ]);

    this.add_css_map_entry(
      map,
      'QUOTE', [
        'text-indent: initial',
        'text-align:left',
        `margin-top: ${this.n_para}`,
        `margin-bottom: ${this.n_para}` 
      ]);

    this.add_css_map_entry(
      map,
      'DISPLAYMATH', [
        'text-indent: initial',
        'text-align:center',
        `margin-top: ${this.n_para}`,
        `margin-bottom: ${this.n_para}` 
      ]);  

    this.add_css_map_entry(
      map,
      'VERBATIM', [
        'text-indent: initial',
        'text-align: left',
        'width: 100%',
        'line-height: 1'
      ]);

    this.add_css_map_entry(
      map,
      'VERSE', [
        'text-indent: initial',
        'text-align: left'
      ]);

    this.add_css_map_entry(
      map,
      'PAR', [
        'text-indent: initial',
        'text-align: left'
      ]);

    this.add_css_map_entry(
      map,
      'TABULAR', [
        'text-indent: initial',
      ]);

    this.add_css_map_entry(
      map,
      'PARA', [
        `margin-top: ${this.n_para}`,
        `margin-bottom: ${this.n_para}` 
      ]);

    this.add_css_map_entry(
      map,
      'PACK', [
        `margin-top: ${this.n_pack}`,
        `margin-bottom: ${this.n_pack}` 
      ]);

    this.add_css_map_entry(
      map,
      'DT', [
        `margin-bottom: ${this.n_pack}`
      ]);

    this.add_css_map_entry(
      map,
      'DD', [
        'margin-left: 0',
        'padding-left: 10mm'
      ]);

    this.add_css_map_entry(
      map,
      'HL', [
        'list-style: none',
        'padding-left: 0' 
      ]);

    this.add_css_map_entry(
      map,
      'OL', [
        'padding-left: 2.0em' 
      ]);

    this.add_css_map_entry(
      map,
      'UL', [
        'padding-left: 2.0em'
      ]);

    this.add_css_map_entry(
      map,
      'TH, TD', [
        'padding: 0.1em 0.6em',
      ]);

    this.add_css_map_entry(
      map,
      'RUBY', [
        'line-height: 1',
        'ruby-position: over',
        'ruby-align: space-between'
      ]);
    
    this.add_css_map_entry(
      map,
      'PART, CHAPTER, SECTION, SUBSECTION, SUBSUBSECTION, PRIMARY', [
        'clear: both'
      ]);

  
    return map;
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
  __css__(classes){
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
    return rules.join('; ');
  }
  to_trigger_stylesheet(){
    return `\
    .TRIGGERED:not(:checked) + div {
      visibility: hidden;
    }
    `
  }
  fig_to_subnum(s, seq){
    if(typeof s === 'string'){
      s = s.trim();
      const re = /^<table\b(.*?)>(.*)<\/table>$/s;
      var v;
      if((v=re.exec(s))!==null){
        let num = this.int_to_letter_a(seq);
        num = `(${num})`;
        let attributes = this.string_to_tag_attributes(v[1]);
        if(attributes.hasOwnProperty('style')){
          let attr = attributes['style'];
          attr += `; --num:"${num}"`;
          attributes['style'] = attr;
          let s = this.string_from_tag_attributes(attributes);
          return `<table ${s}>${v[2]}</table>`;
        }
        return `<table style='--num:"(${num})"' ${v[1]}>${v[2]}</table>`;
      }
    }     
    return s;
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
}
module.exports = { NitrilePreviewHtml };
