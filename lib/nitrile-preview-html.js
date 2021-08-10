'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { NitrilePreviewDiagramSVG } = require('./nitrile-preview-diagramsvg');
const { NitrilePreviewDiagramCanvas } = require('./nitrile-preview-diagramcanvas');
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
    this.canvas = new NitrilePreviewDiagramCanvas(this);
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
    var css = this.css('PART');
    return(`<h1 row='${style.row}' style='${css}'> Part ${partnum} &#160; ${this.uncode(style,title)} </h1>`);
  }
  hdgs_to_chapter(title,label,partnum,chapternum,level,style){
    var css = this.css('CHAPTER');
    this.addto_refmap(label,`${chapternum}`);
    return(`<h1 row='${style.row}' style='${css}'> Chapter ${chapternum} &#160; ${this.uncode(style,title)} </h1>`);
  }
  hdgs_to_section(title,label,partnum,chapternum,level,style){
    var css = this.css('SECTION');
    if(chapternum){
      this.addto_refmap(label,`${chapternum}.${level}`);
      return(`<h2 row='${style.row}' style='${css}'> ${chapternum}.${level} &#160; ${this.uncode(style,title)} </h2>`);  
    }
    this.addto_refmap(label,`${level}`);
    return(`<h2 row='${style.row}' style='${css}'> ${level} &#160; ${this.uncode(style,title)} </h2>`);
  }
  hdgs_to_subsection(title,label,partnum,chapternum,level,style){
    var css = this.css('SUBSECTION');
    if(chapternum){
      this.addto_refmap(label,`${chapternum}.{level}`);
      return(`<h3 row='${style.row}' style='${css}'> ${chapternum}.${level} &#160; ${this.uncode(style,title)} </h3>`);  
    }
    this.addto_refmap(label,`${level}`);
    return(`<h3 row='${style.row}' style='${css}'> ${level} &#160; ${this.uncode(style,title)} </h3>`);
  }
  hdgs_to_subsubsection(title,label,partnum,chapternum,level,style){
    var css = this.css('SUBSUBSECTION');
    if(chapternum){
      this.addto_refmap(label,`${chapternum}.{level}`);
      return(`<h4 row='${style.row}' style='${css}'> ${chapternum}.${level} &#160; ${this.uncode(style,title)} </h4>`);  
    }
    this.addto_refmap(label,`${level}`);
    return(`<h4 row='${style.row}' style='${css}'> ${level} &#160; ${this.uncode(style,title)} </h4>`);
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
      o.push(`<dt style='${this.css('PARA DT')}'> <b> ${value} </b> </dt> <dd style='${this.css('PACK DD')}'> ${text} </dd> <dd style='${this.css('PARA DD')}'>`);
    }else{
      o.push(`<dt style='${this.css('PACK DT')}'> <b> ${value} </b> </dt> <dd style='${this.css('PACK DD')}'> ${text} </dd> <dd style='${this.css('PACK DD')}'>`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let div_css = this.css('PARA');
          o.push(`<div style='${div_css}'> ${this.untext(style,p.lines)} </div>`);
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
    var li_css = ''
    if(nblank) li_css = this.css('PARA LI');
    else       li_css = this.css('PACK LI');
    o.push(`<li style='${li_css}'> ${text} `);      
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let div_css = this.css('PARA');
          o.push(`<div style='${div_css}'> ${this.untext(style,p.lines)} </div>`);
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
    var li_css = ''
    if(nblank) li_css = this.css('PARA LI');
    else       li_css = this.css('PACK LI');
    if(item.type == 'A'){
      o.push(`<li style='${li_css}' type='A' value='${item.value}'> ${text}`)
    }else if(item.type == 'a'){
      o.push(`<li style='${li_css}' type='A' value='${item.value}'> ${text}`)
    }else if(item.type == 'I'){
      o.push(`<li style='${li_css}' type='I' value='${item.value}'> ${text}`)
    }else if(item.type == 'i'){
      o.push(`<li style='${li_css}' type='i' value='${item.value}'> ${text}`)
    }else if(item.value) {
      o.push(`<li style='${li_css}' value='${item.value}'> ${text}`);
    }else if(item.bullet=='*'){
      let value = i+1;
      o.push(`<li style='${li_css}' value='${value}'> ${text}`);
    }else{
      o.push(`<li style='${li_css}' type='I' value='${item.value}'> ${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let div_css = this.css('PARA');
          o.push(`<div style='${div_css}' > ${this.untext(style,p.lines)} </div>`);
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
    var li_css = '';
    if(nblank) li_css = this.css('PARA LI');
    else       li_css = this.css('PACK LI');
    if(key){
      if(keytype=='var'){
        o.push(`<li style='${li_css}'> ${this.literal_to_var(style,key)}${sep}${text}`);
      }else if(keytype=='verb'){
        o.push(`<li style='${li_css}'> ${this.literal_to_verb(style,key)}${sep}${text}`);
      }else{
        o.push(`<li style='${li_css}'> ${this.polish(style,key)}${sep}${text}`);
      }
    }else{
      o.push(`<li style='${li_css}'> ${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let div_css = this.css('PARA');
          o.push(`<div style='${div_css}' > ${this.untext(style,p.lines)} </div>`);
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
        var dl_css = '';
        if(nblank) dl_css = this.css('PARA DL');
        else       dl_css = this.css('PACK DL');    
        o.push(`<dl style='${dl_css}'>`);
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
      case 'HL': {
        var hl_css = '';
        if(nblank) hl_css = this.css('PARA HL');
        else       hl_css = this.css('PACK HL');    
        o.push(`<ul style='${hl_css}'>`)
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push(`</ul>`)
        break;
      }
      case 'OL': {
        var ol_css = '';
        if(nblank) ol_css = this.css('PARA OL');
        else       ol_css = this.css('PACK OL');    
        o.push(`<ol style='${ol_css}'>`);
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push('</ol>')
        break;
      }
      case 'UL': {
        var ul_css = '';
        if(nblank) ul_css = this.css('PARA UL');
        else       ul_css = this.css('PACK UL');    
        o.push(`<ul style='${ul_css}'>`);
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
    var displaymath_css = this.css('DISPLAYMATH');
    if(style.float){
      /// return text
    }else{
      var text = `<div style='${displaymath_css}' > ${text} </div>`;
    }
    var o = [];
    o.push({img:text,subc:''});
    return o;
  }
  fence_to_ink(style,ss){
    var npara = ss.length;
    var vgap = 1;//mm
    var [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    var max_vh = vgap + vgap + npara*10*this.PT_TO_MM;//each font is 10pt height, the font-size is 10pt
    var inkheight = Math.max(inkheight,max_vh);
    var extra_dy = 0.78;//pt  
    let all = [];
    if(style.framebox){
      all.push( `<rect width="${inkwidth}mm" height="${inkheight}mm" fill="none" stroke="currentColor" />`)
    }
    all.push( `<text style="font-family:monospace;white-space:pre;font-size:10pt;" text-anchor="start" x="0" y="0" >` );
    for (var i=0; i < npara; ++i) {
      let s = ss[i];
      s = this.polish(style,s);
      s = this.replace_blanks_with(s,'&#160;');
      var x = 0;
      all.push( `<tspan y="${vgap + (i+extra_dy)*10*this.PT_TO_MM}mm" x="0">${s}</tspan>` );
    }
    all.push( `</text>`);
    var img = all.join('\n');    
    var css = this.css('INK');
    css += this.style_to_css_border(style);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    if (width && height) {
      css += `; width:${width}mm`;
      css += `; height:${height}mm`;
      var w = width*this.MM_TO_PX;
    } else if (width) {
      css += `; width:${width}mm`;
      css += `; height:${width*(inkheight/inkwidth)}mm`;
      var w = width*this.MM_TO_PX;
    } else if (style.height) {
      css += `; height:${height}mm`;
      css += `; width:${height*(inkwidth/inkheight)}mm`;
      var w = inkwidth/inkheight*height*this.MM_TO_PX;
    } else {
      css += `; width:${inkwidth}mm`;
      css += `; height:${inkheight}mm`;
      var w = inkwidth*this.MM_TO_PX;
    }
    var vw = inkwidth*this.MM_TO_PX;
    var vh = inkheight*this.MM_TO_PX;
    let ENCODE = 0;
    if(ENCODE){
      ///It is important to convert it to inline IMG because then the 'css_style' will take effect
      img = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='none' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${img}</svg>`;
      img = `<img alt='diagram' style='${css}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(img)}"></img>`;
    }else{
      // css += `color:black;`;
      // css += `background-color:white;`;
      img = `<svg style='${css}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='none' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${img}</svg>`;
    }
    var o = [];
    var subc = '';
    o.push({img,subc,w});
    return o;
  }
  fence_to_canvas(style,ss){
    var o = this.canvas.to_canvas(style,ss);
    return o;
  }
  fence_to_diagram(style,ss){
    var o = this.diagram.to_diagram(style,ss);
    return o;
  }
  fence_to_img(style,ss) {
    var [srcs,subtitle] = this.ss_to_img_srcs_and_subtitle(ss);
    var fname = this.choose_image_file(srcs);
    let src = fname;
    var imgsrc = `${src}`;///THIS is the URL that is assigned to <img src=...>
    var imgid = '';
    if (1) {
      var { imgsrc, imgid } = this.to_request_image(imgsrc);
      console.log('to_request_image()','imgsrc',imgsrc.slice(0, 40), 'imgid', imgid);
    }
    var css = this.css('IMG')
    css += this.style_to_css_border(style);
    let stretch = this.g_to_stretch_float(style);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    let [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    if (width && height) {
      var mywidth = `${width}`
      var myheight = `${height}`
      var w = width*this.MM_TO_PX;
    } else if (width) {
      var mywidth = `${width}`
      var myheight = `${width*(viewport_height/viewport_width)}`
      var w = width*this.MM_TO_PX;
    } else if (height) {
      var myheight = `${height}`
      var mywidth = `${height*(viewport_width/viewport_height)}`
      var w = height*(viewport_width/viewport_height)*this.MM_TO_PX;
    } else {
      var mywidth = `${viewport_width*viewport_unit}`;
      var myheight = `${viewport_height*viewport_unit}`;
      var w = viewport_width*viewport_unit*this.MM_TO_PX;
    }
    css += `; width:${mywidth}mm`;
    css += `; height:${myheight}mm`;
    var fit = this.g_to_fit_string(style);
    var position = this.g_to_position_string(style);
    if(fit=='contain'){
      css += `; object-fit:contain`;
    }else if(fit=='cover'){
      css += `; object-fit:cover`;
    }else{
      css += `; object-fit:fill`;
    }
    if(position){
      css += `; object-position:${position}`;
    }
    //return `<svg style="${css_style.join(';')}" viewBox="0 0 ${asp[0]} ${asp[1]}" xmlns="http://www.w3.org/2000/svg"><image href="${imgsrc}" width="${asp[0]}" height="${asp[1]}"/></svg>`;
    //return `<img style='object-fit:contain;${css_style.join(';')}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
    var img = `<img style='${css}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}'></img>`;
    var subc = this.uncode(style,subtitle);
    var w = mywidth*this.MM_TO_PX;
    var o = [];
    o.push({img,subc,w});
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
    var css = this.css('VERBATIM');
    var frame = style.frame;
    var width = this.g_to_width_float(style);
    if(frame){
      frame = `frame='box'`;
    }else{
      frame = '';
    }
    if(width){
      width = `width='${width}mm'`;
    }else{
      width = `width='100%'`;
    }
    var text = `<table ${frame} ${width} style='${css}'> <tr><td>${text}</td></tr> </table>`;
    var o = [];
    o.push({img:text,subc:''});
    return o;
  }
  fence_to_center(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var css = this.css('CENTER');
    var text = `<div style='${css}' > ${text} </div>`;
    var o = [];
    o.push({img:text,subc:''});
    return o;
  }
  fence_to_flushright(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var css = this.css('FLUSHRIGHT');
    var text = `<div style='${css}' > ${text} </div>`;
    var o = [];
    o.push({img:text,subc:''});
    return o;
  }
  fence_to_flushleft(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var css = this.css('FLUSHLEFT')
    var text = `<div style='${css}' > ${text} </div>`;
    var o = [];
    o.push({img:text,subc:''});
    return o;
  }
  fence_to_tabular(style,ss) {
    var rows = this.ss_to_tabular_rows(ss,style);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(style,p.raw);
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
        let css = this.css('TH');
        css += `; text-align:${ww[k].ta}`;
        all.push(`<th  style='${css}'> ${text} </th>`);
      })
      all.push('</tr>');
      all.push('</thead>');
      lower = pp.lower;
    }
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
        let css = this.css('TD');
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
        all.push(`<td  style='${css}'> ${text} </td>`); 
      });
      all.push('</tr>')
      lower = pp.lower;  
    });
    var text = all.join('\n');
    let css = this.css('TABULAR');
    if(style.small){
      css += `; font-size:smaller`;   
    }
    var attrs = [];
    var stretch = this.g_to_stretch_float(style);
    if(stretch > 0){
      attrs.push(`width='${stretch*100}%'`);
    }
    if(style.frame){
      if(style.frame==1){
        attrs.push(`frame='box'`);  
      }else{
        attrs.push(`frame='${style.frame}'`);
      }
    }
    if(style.rules){
      attrs.push(`rules='${style.rules}'`);
    }
    if(style.side){
      let s1 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).slice(0,1).join('\n');
      let s2 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).slice(1).join('\n');
      var colgroup = `<colgroup>\n${s1}\n</colgroup>\n<colgroup>\n${s2}\n</colgroup>`;      
    }else{
      let s = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).join('\n');
      var colgroup = `<colgroup>\n${s}\n</colgroup>`;
    }
    var text = `<table ${attrs.join(' ')} style='${css}'  >\n${colgroup}\n${text}\n</table>`;
    var o = [];
    o.push({img:text,subc:''});
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
      let css = '';
      if(p.type=='UL'){
        d.push(`<div  style='${css}'   >${bullet} ${p.text}</div>`);
      }
      else if(p.type=='OL'){
        d.push(`<div  style='${css}'   >${i+1}. ${p.text}</div>`);  
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        d.push(`<div  style='${css}'   >${p.value}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        d.push(`<div  style='${css}'   >${this.int_to_letter_a(p.value)}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        d.push(`<div  style='${css}'   >${this.int_to_letter_A(p.value)}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'DL'){
        d.push(`<div style='${css}'   ><b>${p.value}</b> ${p.text}</div>`)
      }
      else if(p.type == 'INDENTED'){
        //empty CB
        let s = '&#160;'.repeat(p.value);
        d.push(`<div  style='${css}'   > ${s}${p.text}</div> `);
      }
      else {
        ///ordinary line without a leading bullet
        d.push(`<div  style='${css}'   >${p.text}</div>`);
      }
    });
    var text = d.join('\n')
    let css = this.css('VERSE');
    var text = `<div style='${css}'> ${text} </div>`;
    var o = [];
    o.push({img:text,subc:''});
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
    var all = [];
    let css = this.css('QUOTE');
    all.push(`<blockquote style='${css}'>`)
    all.push(text);
    all.push(`</blockquote>`)
    var text = all.join('\n');
    var o = [];
    o.push({img:text,subc:''});
    return o;
  }
  fence_to_par(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var text = text.trim();
    if(style.small){
      text = `<small>${text}</small>`
    }
    if(style.italic){
      text = `<i>${text}</i>`;
    }
    var all = [];
    let css = this.css('PAR');
    all.push(`<div style='${css}'>`)
    all.push(text);
    all.push(`</div>`)
    var text = all.join('\n');
    var o = [];
    o.push({img:text,subc:''});
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
    var v;
    if((v=this.re_paragraph_hidden.exec(body[0]))!==null){
      var button_text = v[1];
      var text = this.untext(style,body.slice(1));
    }
    if(button_text){
      var text = `<label>${button_text}</label> <input class='TRIGGERED' type='checkbox'></input> <div>${text}</div>`;
    }else{
      var text = this.untext(style,body);
    }
    all.push('');
    all.push(text);
    var text = all.join('\n');
    let css = this.css('PARAGRAPH');
    if(style.seq==1){
      css += '; text-indent:initial';
    }
    return `<div style='${css}' > ${text} </div>`;
  }
  float_to_indent(title,label,style,body){
    var style = {...style,title,label,float:'indent'};
    var all = [];
    var text = this.untext(style,body);
    all.push('');
    all.push(text);
    var text = all.join('\n');
    let css = this.css('PARAGRAPH INDENTING');
    return `<div style='${css}' > ${text} </div>`;
  }
  float_to_primary(title,label,style,body,rank) {
    var style = {...style,title,label,float:'primary'};
    title = this.uncode(style,title);
    if(body.length>1 && body[0].length==0){
      body = body.slice(1);
    }
    var indent = this.prefix_indent;
    var text = this.untext(style,body);
    if (rank === 1) {
      text = `<strong>${title}</strong> &#160; ${text}`;
    } 
    else {
      text = `<strong><i>${title}</i></strong> &#160; ${text}`;
    }
    let css = this.css('PRIMARY');
    var text = `<div style='${css}' > ${indent}${text} </div>`;
    return text;
  }
  float_to_ink(title,label,style,body){
    body = this.trim_samp_body(body);
    body.unshift('```ink');
    body.push('```');
    var text = this.untext(style,body);
    var title = this.uncode(style,title);
    var paragraph_css = this.css('PARAGRAPH');
    var examplecaption_css = this.css('EXAMPLECAPTION');
    var text = `<table style='${paragraph_css}'> <caption class='${examplecaption_css}' align='top'>${title}</caption> <tr><td>${text}</td></tr> </table>`;
    return text;
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
    var css = this.css('SAMPLE');
    var text = `<div style='${css}'> ${text} </div>`;
    return text;
  }
  float_to_itemize(title,label,style,itemize){
    var style = {...style,title,label,float:'itemize'};
    var all = [];
    var text = this.itemize_to_text(style,itemize);
    let css = this.css('ITEMIZE')
    var text = `<div style='${css}' > ${text} </div>`
    return text;
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
    let css = this.css('EQUATION');
    var text = `<div style='${css}; text-align:center; position:relative;' > ${span} ${text} </div>`;
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
    var body_css = this.css('BODY');
    var figure_css = this.css('LISTING');
    var text = ss.join('\n');
    var text = `<table style='${body_css}'>${text}</table>`;
    return `<figure style='${figure_css}'  > ${this.to_caption_text(title,label,style,"listing")} ${text} </figure>`;
  }
  float_to_figure(title,label,style,ss){
    style = {...style,float:'figure'};
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    if(style.wrap){
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let img = p.img;
          if(style.wrap=='left'){
            img = this.to_wrapleftfigure_img(img);
          }else{
            img = this.to_wraprightfigure_img(img);
          }
          all.push(img);
        }
      });
      var text = all.join('\n');
      let paragraph_css = this.css('PARAGRAPH');
      var text = `<div style='${paragraph_css}' > ${text} </div>`;
      return text;
    }
    else{
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let img = this.to_subfigure_img(p.img,p.subc,p.w,p.seq,style.subfigure);
          all.push(img);
        }else if(p.type=='\\\\'){
          all.push(`<br/>`);
        }
      });
      var text = all.join('\n');
      let figure_css = this.css('FIGURE')
      return `<figure style='${figure_css}'  > ${this.to_caption_text(title,label,style,"figure")} ${text} </figure>`;
    }
  }
  float_to_table(title,label,style,ss){
    style = {...style,float:'table'};
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    if(style.wrap){
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let img = p.img;
          if(style.wrap=='left'){
            img = this.to_wrapleftfigure_img(img);
          }else{
            img = this.to_wraprightfigure_img(img);
          }
          all.push(img);
        }
      });
      var text = all.join('\n');
      let paragraph_css = this.css('PARAGRAPH');
      var text = `<div style='${paragraph_css}' > ${text} </div>`;
      return text;
    }
    else{
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let img = this.to_subfigure_img(p.img,p.subc,p.w,p.seq,style.subfigure);
          all.push(img);
        }else if(p.type=='\\\\'){
          all.push(`<br/>`);
        }
      });
      var text = all.join('\n');
      let figure_css = this.css('TABLE')
      return `<figure style='${figure_css}'  > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
    }
  }
  float_to_longtable(title,label,style,ss){
    style = {...style,float:'longtable'};
    var itms = this.ss_to_figure_itms(ss,style);
    for(let itm of itms){
      if(itm.type=='bundle' && itm.key=='tabular'){
        var text = itm.img;
        let css = this.css('LONGTABLE')
        var text = `<figure style='${css}'  > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
        return text;
      }
    }
    return '';
  }
  float_to_tabbing(title,label,style,body){
    style = {...style,float:'tabbing'};
    var cols = this.ss_to_clusters(body);
    var cols = cols.map((ss) => ss.map((s) => this.uncode(style,s)));
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
    css += this.style_to_css_bordercollapse(style);
    if(style.small){
      css += 'font-size:smaller;';
    }
    text = `<table border='0' style='${css}'  > ${text} </table>`;
    let figure_css = this.css('TABBING');
    return `<div style='${figure_css}' > ${text} </div>`
  }
  float_to_columns(title,label,style,ss){
    style = {...style,float:'columns'};
    var itms = this.ss_to_figure_itms(ss,style);
    var n = this.g_to_n_int(style);
    var n = Math.max(1,n);
    var all = [];
    var sep = `<div style='break-before:column;'></div>`;
    var rows = [];
    var row = [];
    itms.forEach((p,j,arr) => {
      if(j%n===0){
        row = [];
        rows.push(row);
      }
      row.push(p.img);
    });
    rows.forEach((row) => {
      let para_css = this.css('PARA')
      all.push(`<div style='${para_css}; columns:${n}'>`);
      all.push(row.join(sep))
      all.push(`</div>`);
    });
    var text = all.join('\n');
    var figure_css = this.css('COLUMNS')
    var text = `<figure style='${figure_css}' > ${text} </figure>`;  
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
      let caption_css = this.css('FIGCAPTION')
      return `<figcaption style='${caption_css}' >${lead} </figcaption>`;
    }else{
      let idnum = this.to_idnum(key);
      if(label){
        this.addto_refmap(label,idnum);
      }
      let lead = `${tag} ${idnum}: ${caption_text}`;
      let caption_css = this.css('FIGCAPTION')
      return `<figcaption style='${caption_css}' >${lead} </figcaption>`;
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
    d.push(`<text transform='translate(8 1.5) scale(0.65)' style='stroke:none;fill:inherit;font-size:12pt;font-style:;' textLength='13' lengthAdjust='spacing' text-anchor='middle' dy='${this.tokenizer.text_dy_pt}pt'>${num}</text>`); 
    d.push(`<circle cx='8' cy='8' r='7' stroke='inherit' fill='none'/>`);
    d.push(`</svg>`);
    return d.join('\n');
  }
  to_wraprightfigure_img(img){
    let wraprightfigure_css = this.css('WRAPRIGHT')
    var img = `<table style='display:inline-table; ${wraprightfigure_css}'>
    <tr><td>${img}</td></tr></table>`
    return img;
  }
  to_wrapleftfigure_img(img){
    let wrapleftfigure_css = this.css('WRAPLEFT')
    var img = `<table style='display:inline-table; ${wrapleftfigure_css}'>
    <tr><td>${img}</td></tr></table>`
    return img;
  }
  to_subfigure_img(img,sub,w,seq,subfigure){
    let subcaption_css = this.css('SUBCAPTION');
    let subfigure_css = this.css('SUBFIGURE');
    let o = [];
    if(w){
      o.push(`<table cellpadding='0' cellspacing='0' style='${subfigure_css}' width='${w}' >`);
    }else{
      o.push(`<table cellpadding='0' cellspacing='0' style='${subfigure_css}' >`);
    }
    if(subfigure){
      sub = `(${this.int_to_letter_a(seq)}) ${sub}`;
    }
    if(sub){
      o.push(`<caption align='bottom' style='${subcaption_css}'>${sub}</caption>`);
    }
    o.push(`<tr><td>${img}</td></tr>`);
    o.push(`</table>`);
    return o.join('\n');
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
  phrase_to_ss(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<span style='font-family:sans-serif'> ${cnt} </span>`;
  }
  phrase_to_tt(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<span style='font-family:monospace'> ${cnt} </span>`;
  }
  phrase_to_overstrike(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<s>${cnt}</s>`
  }
  /////////////////////////////////////////////
  phrase_to_verb(style,cnt){
    return `<kbd style='white-space:pre'>${cnt}</kbd>`;
  }
  phrase_to_code(style,cnt){
    return `<code>${cnt}</code>`
  }
  phrase_to_var(style,cnt){
    return `<var>${cnt}</var>`
  }
  phrase_to_guillemet(style,cnt){
    return `&#x00AB;${cnt}&#x00BB;`
  }
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
  phrase_to_high(style,cnt){
    return `<sup>${cnt}</sup>`;
  }
  phrase_to_low(style,cnt){
    var css = '';
    return `<sub>${cnt}</sub>`;
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
    var ss = [];
    ss.push(`viewport 1 1 5`);
    ss.push(`fill {fillcolor:${cnt}} &rectangle{(0.1,0.1),0.8,0.8}`);
    ss.push(`stroke {linesize:1} &rectangle{(0,0),1,1}`);
    style.width = '5';
    style.height = '5';
    var o = this.diagram.to_diagram(style,ss);
    if(o.length){
      var img = o[0].img;
      return img;
    }
    return '';
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
      'BODY', [
      'line-height: 1', 
      'text-align: left', 
      'width: 100%', 
      'font-size: smaller' 
    ]);

    this.add_css_map_entry(
      map,
      'FIGURE, TABLE, LONGTABLE', [
        'text-align: center',
        'page-break-inside: avoid'
      ]
    );

    this.add_css_map_entry(
      map,
      'PARAGRAPH, PRIMARY, ITEMIZE, EQUATION, TABBING, FIGURE, TABLE, LONGTABLE, LISTING, COLUMNS, SAMPLE',[
        'text-indent: initial',
        `margin-top: ${this.n_para}`,
        `margin-bottom: ${this.n_para}`,
        `margin-left:  ${this.n_marginleft}`,
        `margin-right: ${this.n_marginright}`
      ]
    );
    
    this.add_css_map_entry(
      map,
      'SAMPLE', [
        'text-indent: initial',
        'text-align: left',
        'line-height: 1'
      ]);

    this.add_css_map_entry(
      map,
      'INDENTING', [
        'text-indent: initial',
        'padding-left: 0.55cm'
      ]
    );
  
    this.add_css_map_entry(
      map,
      'COMBINATIONROW', [
        'display: grid',
        'grid-template-columns: 100%',
        `grid-row-gap: ${this.n_half}`,
        'justify-content: center',
        'width: 100%'
      ]
    );

    this.add_css_map_entry(
      map,
      'COMBINATION', [
        'text-indent: initial',
        'text-align: center',
        'overflow: visible',
        'white-space: nowrap',
        'width: 100%',
        'align-items: baseline' 
      ]
    );

    this.add_css_map_entry(
      map,
      'EXAMPLECAPTION', [
        'text-indent: initial',
        'white-space: normal'
      ]
    );

    this.add_css_map_entry(
      map,
      'FIGCAPTION', [
        'text-indent: initial',
        //'text-align: center',
        'margin-top: 0',
        `margin-bottom: ${this.n_half}`,
        //'width: 80%',
        'margin-left: auto',
        'margin-right: auto',
        // 'line-height: 1',
        // 'font-size: smaller'
        'white-space: normal'
      ]
    );

    this.add_css_map_entry(
      map,
      'SUBCAPTION', [
        'text-indent: initial',
        // 'line-height: 1',    
        // 'font-size: smaller',
        'white-space: normal' 
      ]);

    this.add_css_map_entry(
      map,
      'SUBFIGURE', [
        ///try not to set the vertical-align because the subcaptions are implemented
        ///as the caption-element of a table-element, which would have been shown nicely
        ///to hang downwards while the base of the table aligns with other base of the table
        'text-indent: initial',
        'display: inline-table',
      ]);

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
        'text-indent: initial'
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
  css(classes){
    classes = this.string_to_array(classes);
    var rules = [];
    classes.forEach((x) => {
      let rules1 = this.css_map[x];
      if(rules1 && Array.isArray(rules1)){
        rules = rules.concat(rules1);
      }  
    });
    return rules.join('; ');
  }
  to_canvas_script(){
    return this.canvas.to_canvas_script();
  }
  to_trigger_stylesheet(){
    return `\
    .TRIGGERED:not(:checked) + div {
      visibility: hidden;
    }
    `
  }
}
module.exports = { NitrilePreviewHtml };
