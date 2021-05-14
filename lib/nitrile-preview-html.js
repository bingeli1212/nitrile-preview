'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { NitrilePreviewDiagramSVG } = require('./nitrile-preview-diagramsvg');
const const_partnums = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'IIX', 'IX', 'X'];
const const_subfignums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

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
    this.enumerate_counter = 0;
    this.my_svgarray_vspace = 3;
    this.flags = {};
    this.ref_map = {};
    this.equation_num = 0;
    this.figure_num = 0;
    this.table_num = 0;
    this.listing_num = 0;
    this.css_id = 0;
    this.def_padding = '0.5ex';
    this.icon_cdigits = ['&#x278a;','&#x278b;','&#x278c;','&#x278d;','&#x278e;','&#x278f;','&#x2790;','&#x2791;','&#x2792;','&#x2793;']
    this.icon_bullet       = '&#x2022;'
    this.icon_nbsp         = '&#160;&#160;'
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
    return o.join('\n');
  }
  hdgs_to_part(title,label,style){
    return(`<h1>Part. ${this.uncode(style,title)}</h1>`);
  }
  hdgs_to_chapter(title,label,style){
    return(`<h1>${this.uncode(style,title)}</h1>`);
  }
  hdgs_to_section(title,label,style){
    return(`<h2>${this.uncode(style,title)}</h2>`);
  }
  hdgs_to_subsection(title,label,style){
    return(`<h3>${this.uncode(style,title)}</h3>`);
  }
  hdgs_to_subsubsection(title,label,style){
    return(`<h4>${this.uncode(style,title)}</h4>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////////////
  item_dl_to_text(i,item,nblank){
    var o = [];
    var value = this.uncode(item.style,item.value);
    var text = this.uncode(item.style,item.text);
    var cls = (!nblank) ? 'PACK' : 'PARA';
    o.push(`<dt class='${cls} DT'> <b> ${value} </b> &#160; ${text} </dt> <dd class='PACK DD'>`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(p.style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank)}`);
        }
      });
    }
    o.push(`</dd>`);
    return o.join('\n\n');
  }
  item_hl_to_text(i,item,nblank){
    var o = [];
    var text = this.uncode(item.style,item.text);
    var cls = (!nblank) ? 'PACK' : 'PARA';
    o.push(`<li class='${cls} LI'> ${text} `);      
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(p.style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank)}`);
        }
      });
    }
    o.push(`</li>`);
    return o.join('\n\n');
  }
  item_ol_to_text(i,item,nblank){
    var o = [];
    var text = this.uncode(item.style,item.text);
    var cls = (!nblank) ? 'PACK' : 'PARA';
    if(item.type == 'A'){
      o.push(`<li class='${cls} LI' type='A' value='${item.value}'> ${text}`)
    }else if(item.type == 'a'){
      o.push(`<li class='${cls} LI' type='A' value='${item.value}'> ${text}`)
    }else if(item.type == 'I'){
      o.push(`<li class='${cls} LI' type='I' value='${item.value}'> ${text}`)
    }else if(item.type == 'i'){
      o.push(`<li class='${cls} LI' type='i' value='${item.value}'> ${text}`)
    }else if(item.value) {
      o.push(`<li class='${cls} LI' value='${item.value}'> ${text}`);
    }else if(item.bullet=='*'){
      let value = i+1;
      o.push(`<li class='${cls} LI' value='${value}'> ${text}`);
    }else{
      o.push(`<li class='${cls} LI' type='I' value='${item.value}'> ${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(p.style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank)}`);
        }
      });
    }
    o.push(`</li>`)
    return o.join('\n\n');
  }
  item_ul_to_text(i,item,nblank){
    var o = [];
    var text = this.uncode(item.style,item.text);
    var cls = (!nblank) ? 'PACK' : 'PARA';
    o.push(`<li class='${cls} LI'> ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(p.style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank)}`);
        }
      });
    }
    o.push('</li>')
    return o.join('\n\n')
  }
  itemize_to_text(itemize,nblank){
    var bull = itemize.bull;
    var items = itemize.items;
    var cls = (!nblank) ? 'PACK' : 'PARA';
    var o = [];
    switch (bull) {
      case 'DL': {
        o.push(`<dl class='${cls} DL'>`);
        items.forEach((item,j) => {
          let text = this.item_dl_to_text(j,item,nblank);
          o.push(text);
        });
        o.push(`</dl>`)
        break;
      }
      case 'HL': {
        o.push(`<ul class='${cls} HL'>`)
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(j,item,nblank);
          o.push(text);
        });
        o.push(`</ul>`)
        break;
      }
      case 'OL': {
        o.push(`<ol class='${cls} OL'>`);
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(j,item,nblank);
          o.push(text);
        });
        o.push('</ol>')
        break;
      }
      case 'UL': {
        o.push(`<ul class='${cls} UL'>`);
        items.forEach((item,j) => {
          let text = this.item_ul_to_text(j,item,nblank);
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
    const re_entity = /^&([A-Za-z][A-Za-z0-9]*);(.*)$/s;
    var safe='';
    var v;
    var s;
    while(line.length){
      if((v=re_entity.exec(line))!==null){
        s = v[1];
        line=v[2];        
        if(this.tokenizer.symbol_name_map.has(s)){
          let {html} = this.tokenizer.symbol_name_map.get(s);
          s = html;
        }
        safe+=s;
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
    var style = {...style,displaymath:1};
    var text = ss.join('\n');
    var {s} = this.tokenizer.to_svgmath(text,style,'html');
    var s = `<div class='DISPLAYMATH' > ${s} </div>`;
    var o = [];
    o.push({img:s,sub:''});
    return o;
  }
  fence_to_ink(style,ss){
    ss = this.trim_samp_body(ss);
    var { s, vw, vh, text } = this.diagram.to_ink(style,ss);
    var css = '';
    css += `box-sizing:border-box;`;
    css += `text-indent:0;`;
    css += this.style_to_css_width(style,vw);
    css += this.style_to_css_height(style,'auto');
    css += this.style_to_css_border(style);
    let ENCODE = 0;
    if(ENCODE){
      ///It is important to convert it to inline IMG because then the 'css_style' will take effect
      s = `<img  alt='diagram' style='${css}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}"></img>`;
    }else{
      css += `color:black;`;
      css += `background-color:white;`;
      s = `<svg class='FRAMED' style='${css}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
    }
    var o = [];
    o.push({img:s,sub:''});
    return o;
  }
  fence_to_diagrams(style,ss){
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
  fence_to_diagram(style,ss){
    var { img, sub } = this.diagram.to_diagram(style,ss);
    sub = this.uncode(style,sub);
    var o = [];
    o.push({ img, sub });
    return o;
  }
  fence_to_img(style,ss) {
    var srcs = [];
    var subtitle = '';
    const re_image = /^image\s+(.*)$/;
    const re_subtitle = /^subtitle\s+(.*)$/;
    var v;
    ss.forEach((s) => {
      if((v=re_image.exec(s))!==null){
        srcs.push(v[1]);
      }
      else if((v=re_subtitle.exec(s))!==null){
        subtitle = v[1];
      }
    })   
    var fname = this.choose_html_image_file(srcs);
    let src = fname;
    var imgsrc = `${src}`;///THIS is the URL that is assigned to <img src=...>
    var imgid = '';
    if (1) {
      var { imgsrc, imgid } = this.to_request_image(imgsrc);
      console.log('to_request_image()','imgsrc',imgsrc.slice(0, 40), 'imgid', imgid);
    }
    var css = '';
    css += `box-sizing:border-box;`;
    css += `text-indent:0;`;
    css += this.style_to_css_width(style,'');
    css += this.style_to_css_height(style,'auto');
    css += this.style_to_css_border(style);
    //return `<svg style="${css_style.join(';')}" viewBox="0 0 ${asp[0]} ${asp[1]}" xmlns="http://www.w3.org/2000/svg"><image href="${imgsrc}" width="${asp[0]}" height="${asp[1]}"/></svg>`;
    //return `<img style='object-fit:contain;${css_style.join(';')}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
    var img = `<img class='IMG' style='${css}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}'></img>`;
    var sub = this.uncode(style,subtitle);
    var o = [];
    o.push({img,sub});
    return o;
  }
  fence_to_verbatim(style,ss){
    var ss = ss.map(x => this.polish_verb(style,x));
    var ss = ss.map(x => `<code>${x}</code>`)
    var text = ss.join('<br/>')
    var text = `<div class='VERBATIM' > ${text} </div>`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_center(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var text = `<div class='CENTER' style='text-align:center'> ${text} </div>`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_flushright(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var text = `<div class='CENTER' style='text-align:right'> ${text} </div>`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_tabular(style,ss) {
    //
    //build rows
    //
    var rows = this.ss_to_tabular_rows(ss,style);
    var rows = this.update_rows_by_hrule(rows,style.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(style,p.raw);
      })
    })
    // 
    // rows_to_tabular will also take care of g.head by setting it to <th>...</th>
    //
    var text = this.rows_to_tabular(rows,style);
    //
    //put it together
    //
    var css = '';
    css += `display:inline-block;`
    css += `table-layout:fixed;`;
    var text = `<table class='TABULAR' style='${css}'  > ${text} </table>`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_lines(style,ss) {
    var itms = this.ss_to_list_itms(ss,style);
    var bullet = '&#x2022;'
    const nbsp       = this.icon_nbsp;
    const squareboxo = '&#x25CB;';           
    const squarebox  = '&#x25CF;';  
    const circleboxo = '&#x25A1;';           
    const circlebox  = '&#x25A0;';         
    //var circleboxo = this.uncode(this.style,String.fromCodePoint(0x25CB)); 
    //var circlebox = this.uncode(this.style,String.fromCodePoint(0x25CF));
    //var squareboxo = this.uncode(this.style,String.fromCodePoint(0x25A1)); 
    //var squarebox = this.uncode(this.style,String.fromCodePoint(0x25A0));
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
      var css = '';
      if(p.type=='UL'){
        d.push(`<label  style='${css}' >${bullet}${nbsp}${p.text}</label>`);
      }
      else if(p.type=='OL'){
        d.push(`<label  style='${css}' >${i+1}.${nbsp}${p.text}</label>`);  
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        d.push(`<label  style='${css}' >${p.value}${p.ending}${nbsp}${p.text}</label>`);
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        d.push(`<label  style='${css}' >${this.to_a_letter(p.value)}${p.ending}${nbsp}${p.text}</label>`);
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        d.push(`<label  style='${css}' >${this.to_A_letter(p.value)}${p.ending}${nbsp}${p.text}</label>`);
      }
      else if(p.type == 'DL'){
        d.push(`<label style='${css}' ><b>${p.value}</b> &#160; ${p.text}</label>`)
      }
      else if(p.type == 'CB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          d.push(`<label  style='${css}' > ${circlebox} ${p.text}</label> `);
        }else{
          //empty CB
          d.push(`<label  style='${css}' > ${circleboxo} ${p.text}</label> `);
        }
      }
      else if(p.type == 'RB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          d.push(`<label  style='${css}' > ${squarebox} ${p.text}</label> `);
        }else{
          //empty CB
          d.push(`<label  style='${css}' > ${squareboxo} ${p.text}</label> `);
        }
      }
      else {
        ///ordinary line without a leading bullet
        d.push(`<label  style='${css}' >${p.text}</label>`);
      }
    });
    var text = d.join('<br/>\n')
    var text = `<div class='LINES'> ${text} </div>`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  /////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////
  
  /////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////
  float_to_paragraph(title,label,style,body){
    var all = [];
    var text = this.untext(style,body);
    all.push('');
    all.push(text);
    var text = all.join('\n');
    return `<div class='PARAGRAPH' > ${text} </div>`;
  }
  float_to_primary(title,label,style,body,rank) {
    title = this.uncode(style,title);
    var text = this.untext(style,body);
    const indent = '&#160;'.repeat(5);
    var css = '';
    if (rank === 1) {
      text = `<strong>${title}</strong> &#160; ${text}`;
      css += 'padding-top:1ex;';
      var rank = 'RANK1';
    } 
    else if (rank === 2) {
      css += 'padding-top:1ex;';
      text = `${indent}<strong>${title}</strong> &#160; ${text}`;
      var rank = 'RANK1';
    }
    else {
      text = `<strong><i>${title}</i></strong> ${text}`;
      var rank = 'RANK2';
    }
    var text = `<div class='PRIMARY' style='${css}' > ${text} </div>`;
    return text;
  }
  float_to_sample(title,label,style,body){
    var body = body.map(x => this.polish_verb(style,x));
    var body = body.map(x => `<code>${x}</code>`)
    var text = body.join('<br/>\n')
    var text = `<div class='SAMPLE' > ${text} </div>`;
    return text;
  }
  float_to_itemize(title,label,style,itemize,nblank){
    var all = [];
    var text = this.itemize_to_text(itemize,nblank);
    var text = `<div class='ITEMIZE' > ${text} </div>`
    return text;
  }
  float_to_equation(title,label,style,ss){
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='fence'){
        all.push(p.img);
      }
    });
    var text = all.join('\n');
    let idnum = this.to_idnum('equation');///should be overriden by subclasses
    if(label){
      this.addto_refmap(label,idnum);
    }  
    idnum = `(${idnum})`;
    all = [];
    all.push(`<div style='display:flex;flex-direction:row;' >`);
    all.push(`<span style='margin-left:auto; margin-right:auto;' > ${text} </span>`);
    all.push(`<span style='' > ${idnum} </span>`);
    all.push(`</div>`);
    var text = all.join('\n');
    var text = `<div class='EQUATION' > ${text} </div>`;
    return text;
  }
  float_to_listing(title,label,style,ss){
    var ss = this.trim_samp_body(ss);
    if(1){
      var ss = ss.map((x, i) => {
        var line = x;
        var lineno = `${i + 1}`;
        var lineno = `<span style='position:absolute;right:100%;top:50%;transform:translateY(-50%);text-align:right;display:inline-block;text-indent:0;padding-right:1ex;font-size:smaller;'> ${lineno}</span>`;
        var line = this.polish(style,line);
        if(style.numbers){
          var text = `${line}${lineno}`;
        }else{
          var text = `${line}`;
        }
        return `<code style='white-space:pre;position:relative;'>${text}</code>`;
      });
      var text = ss.join('<br/>\n');
      var text = `<div style='font-size:smaller;' >${text}</div>`        
    }
    return `<figure class='LISTING'  > ${this.to_caption_text(title,label,style,"listing")} ${text} </figure>`;
  }
  float_to_figure(title,label,style,ss){
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    if(style.wrap){
      var wrap = style.wrap=='left' ? 'WRAPLEFT' : 'WRAPRIGHT';
      if(itms.length > 0) {        
        let p = itms[0];
        if(p.type=='fence'){
          let img = this.to_subfigure_html(p.img,p.sub);
          img = this.update_css_class(img,`${wrap}`);
          all.push(img);
        }
      }
      var text = all.join('\n');
      return `<div class='PARAGRAPH' > ${text} </div>`;
    }
    else if(style.subfigure){
      var begin = `<div class='COMBINATION' >`;
      var end = `</div>`;
      itms.forEach((p,j,arr) => {
        if(j==0){
          all.push(begin);
          all.push(end);
        }
        if(p.type=='fence'){
          p.sub = `(${this.to_a_letter(p.seq)}) ${p.sub}`
          all.pop();
          let img = this.to_subfigure_html(p.img,p.sub);
          all.push(img);
          all.push(end);
        }else{
          all.push(begin);
          all.push(end);
        }
      });
      var text = all.join('\n');
      return `<figure class='FIGURE' > ${this.to_caption_text(title,label,style,"figure")} ${text} </figure>`;
    }
    else{
      itms.forEach((p,j,arr) => {
        if(p.type=='fence'){
          all.push(p.img);
        }
      });
      var text = all.join('\n');
      return `<figure class='FIGURE'  > ${this.to_caption_text(title,label,style,"figure")} ${text} </figure>`;
    }
  }
  float_to_table(title,label,style,ss){
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    if(style.wrap){
      var wrap = style.wrap=='left' ? 'WRAPLEFT' : 'WRAPRIGHT';
      itms.forEach((p,j,arr) => {
        if(p.type=='fence'){
          let img = this.to_subfigure_html(p.img,p.sub);
          img = this.update_css_class(img,`${wrap}`);
          all.push(img);
        }
      });
      var text = all.join('\n');
      return `<div class='PARAGRAPH' > ${text} </div>`;
    }
    else if(style.subfigure){
      var begin = `<div class='COMBINATION' >`;
      var end = `</div>`;
      itms.forEach((p,j,arr) => {
        if(j==0){
          all.push(begin);
          all.push(end);
        }
        if(p.type=='fence'){
          p.sub = `(${this.to_a_letter(p.seq)}) ${p.sub}`
          all.pop();
          let img = this.to_subfigure_html(p.img,p.sub);
          all.push(img);
          all.push(end);
        }else{
          all.push(begin);   
          all.push(end);   
        }
      });
      var text = all.join('\n');
      return `<figure class='TABLE'  > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
    }
    else{
      itms.forEach((p,j,arr) => {
        if(p.type=='fence'){
          all.push(p.img);
        }
      });
      var text = all.join('\n');
      return `<figure class='TABLE'  > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
    }
  }
  float_to_longtable(title,label,style,ss){
    var ss = this.trim_samp_body(ss);
    if(1){
      var rows = this.ss_to_tabular_rows(ss,style);
      var rows = this.update_rows_by_hrule(rows,style.hrule);
      rows.forEach((pp) => {
        pp.forEach((p) => {
          p.text = this.uncode(style,p.raw);
        })
      })
      var text = this.rows_to_tabular(rows,style);
      var css = '';
      css += 'display:table;';
      css += 'text-indent:0;';
      css += 'width:100%;';
      css += this.style_to_css_bordercollapse(style);
      var text = `<table border='0' style='${css}'> ${text} </table>`;  
    }    
    var text = `<figure class='LONGTABLE'  > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
    return text;
  }
  float_to_tabbing(title,label,style,body){
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
    text = `<table border='0' style='${css}'  > ${text} </table>`;
    return `<div class='TABBING' > ${text} </div>`
  }
  float_to_columns(title,label,style,ss){
    var clusters = this.ss_to_clusters(ss);
    var texts = clusters.map((ss) => this.untext(style,ss));
    var total = texts.length;
    var n = this.assert_int(style.n,2);
    var sep = `<div style='break-before:column;'></div>`;
    var o = [];
    for(let j=0; j < total; j+=n){
      o.push(`<div class='PARA' style='columns:${n}'>`);
      for(let i=0; i < n; ++i){
        let text = texts.shift();
        text = text||'';
        if(i>0){
          o.push(sep);
        }
        o.push(text);
      }
      o.push(`</div>`);
    }
    var text = o.join('\n');
    var text = `<figure class='COLUMNS' > ${text} </figure>`;  
    return text;
  }
  float_to_blockquote(title,label,style,ss){
    var d = [];
    if(1){
      let clusters = this.ss_to_clusters(ss);
      clusters.forEach((ss) => {
        var s = this.join_para(ss);
        var s = this.uncode(style,s);
        d.push(s);
      })
    }
    var all = [];
    all.push('');
    all.push(`<figure class='BLOCKQUOTE'>`);
    all.push(`<blockquote>`)
    d.forEach((s) => {
      all.push(`<div class='PARA'> ${s} </div>`)
    })
    all.push(`</blockquote>`)
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
  to_caption_text(title,label,style,key){
    let caption_text = this.uncode(style,title).trim();
    let none = this.assert_int(style.nocaption);
    let tag = this.to_tag(key);
    let idnum = '';
    let lead = '';  
    idnum = this.to_idnum(key);
    if(label){
      this.addto_refmap(label,idnum);
    }
    lead = `${tag} ${idnum}: ${caption_text}`;
    if(none){
      return '';
    }else{
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
    return this.conf_to_string('html.bodyfontsize',12);
  }
  to_mathfontsize(){
    return this.conf_to_string('html.mathfontsize',12);
  }
  to_conf_width(){
    return this.conf_to_string('html.width',130);
  }
  to_conf_margin(){
    return this.conf_to_string('html.margin',4);
  }
  rows_to_tabular(rows,style){
    var n = rows.length ? rows[0].length : 1;
    var strut = parseInt(style.strut)||0;
    var height = (strut)?`${strut}pt`:'';
    var vbars = this.vrule_to_vbars(n,style.vrule);
    var border_top = '';
    var border_bot = '';
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    if(style.fr){
      var haligns = this.string_to_td_width(style.fr||'',n);
    }else{
      var haligns = this.string_to_td_haligns(style.halign||'',n);
    }
    ///determine if first row is a hline
    let k = rows.length;
    ///figure out how many extra columns that is the result of double vertical border
    let extra_n = 0;
    vbars.forEach((x,i) => {
      if(i>0 && i < n){
        if(x==='||'){
          extra_n++;
        }
      }
    })
    ///decide where to set borders
    var d = [];
    rows.forEach((pp,j) => {
      if (pp.upper==2) {
        d.push(`<tr><td style='border-top:1px solid;border-bottom:1px solid;' colspan='${n+extra_n}'></td></tr>`);
      }
      ///look ahead next row
      border_top = pp.upper ? '1px solid' : '';
      border_bot = pp.lower ? '1px solid' : '';
      var pp1 = [];
      pp.forEach((x,i) => {
        let {raw,text} = x;
        if(i>0 && vbars[i]==='||'){
          pp1.push(`<td style='border-left:1px solid;border-right:1px solid;border-top:${border_top};border-bottom:${border_bot};'></td>`);
        }
        let border_left = (vbars[i])?'1px solid':'';
        let border_right= (vbars[i+1])?'1px solid':'';
        const tb='0.15ex';
        const lr='1.1ex';//this value is chosen because it gives approx the same width for a table generated by LATEX or CONTEX
        let pad=`${tb} ${lr}`;
        let color = '';
        if(cellcolor_map.has(raw)){
          color = cellcolor_map.get(raw);
        }
        var ht = height;
        var css = '';
        css += `text-align:${haligns[i].ta};width:${haligns[i].pw};`
        css += `height:${ht};`
        css += `border-top:${border_top};`
        css += `border-bottom:${border_bot};`
        css += `border-left:${border_left};`
        css += `border-right:${border_right};`
        css += `background-color:${color};`
        if(style.head && j==0){
          ht = '';
          pp1.push(`<th class='TH' style='${css}'> ${text} </th>`);        
        }else{
          pp1.push(`<td class='TD' style='${css}'> ${text} </td>`);        
        }
      });
      var p = pp1.join('');
      var p = `<tr>${p}</tr>`;
      border_top = '';
      border_bot = '';
      d.push(p);
      /// add the last dhline if there is one
      if(j+1==rows.length){
        if(pp.lower==2){
          d.push(`<tr><td style='border-top:1px solid;border-bottom:1px solid;' colspan='${n+extra_n}'></td></tr>`);
        }
      }
    });
    /// add the title
    if(style.title){
      var title = this.uncode(style,style.title);
      d.unshift(`<tr><td style='text-align:center' colspan='${n+extra_n}'>${title}</td></tr>`)
    }
    return d.join('\n')
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
  string_to_td_haligns(s,n) {
    var pp = this.string_to_array(s||'');
    var re_lcr = /^[lcr]$/;
    var re_pw = /^p\((.*)\)$/;
    pp = pp.map((x) => {
      if(re_lcr.test(x)){
        if(x=='l') return {ta:'left',pw:''};
        if(x=='r') return {ta:'right',pw:''};
        return            {ta:'center',pw:''};  
      }else if(re_pw.test(x)){
        var w = re_pw.exec(x)[1];
        var w = this.string_to_css_width(w,1,'');
        if(w){
          return {ta:'left',pw:w};
        }else{
          return {ta:'left',pw:''};
        }
      }else{
        return null;
      }
    });
    pp = pp.filter((x) => x);
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
  to_subfigure(s,sub,width,style){
    //'width' is the width of the image, and style is the style of the 'figure' paragraph
    var o = [];
    var width = width||'';
    var css = '';
    css += `text-align:center;`
    css += `width:${width};`
    css += this.style_to_css_fontsize(style);
    o.push(`<table border='0' style='display:inline-block;text-indent:0;' >`);
    o.push(`<tr><td style='${css}'>${s}</td></tr>`)
    o.push(`<tr><td style='${css}'>${sub}</td></tr>`)
    o.push(`</table>`)
    return o.join('\n')
  }

  to_circled_number_svg(num){
    var d = [];
    d.push(`<svg xmlns = 'http://www.w3.org/2000/svg' width='0.75em' height='0.75em' viewBox='0 0 16 16' fill='currentColor' stroke='currentColor' >`);
    d.push(`<text transform='translate(8 1.5) scale(0.65)' style='stroke:none;fill:inherit;font-size:12pt;font-style:;' textLength='13' lengthAdjust='spacing' text-anchor='middle' dy='${this.tokenizer.text_dy_pt}pt'>${num}</text>`); 
    d.push(`<circle cx='8' cy='8' r='7' stroke='inherit' fill='none'/>`);
    d.push(`</svg>`);
    return d.join('\n');
  }
  to_frac_html(cnt,cnt2){
    var d = [];
    d.push(`<span style="display: table;">`);
      d.push(`<span style="display: table-row;">`);
        d.push(`<span style="display: table-cell;border-bottom:1px solid;text-align:center;">`);
          d.push(`${cnt}`);
        d.push(`</span>`);
      d.push(`</span>`);
      d.push(`<span style="display: table-row;">`);
        d.push(`<span style="display: table-cell;border-top:1px solid;text-align:center;">`);
          d.push(`${cnt2}`);
        d.push(`</span>`);
      d.push(`</span>`);
    d.push(`</span>`);
    return d.join('\n');
  }
  to_subfigure_html(img,sub){
    if(sub.length){
      return `<table class='SUBFIGURE' ><caption align="bottom" style="line-height:1;font-size:smaller;">${sub}</caption><tr><td style='width:1px;white-space:nowrap;text-align:center;'>${img}</td></tr></table>`;
    }else{
      return `<table class='SUBFIGURE' ><tr><td style='width:1px;white-space:nowrap;text-align:center;'>${img}</td></tr></table>`;
    }
  }
  ///
  /// literal_to_double
  ///
  literal_to_double(style,cnt){ 
    let s = this.polish_verb(style,cnt);
    s = `<q><code>${s}</code></q>`;
    return s;
  }
  ///
  /// literal_to_single
  ///
  literal_to_single(style,cnt){ 
    let s = this.polish_verb(style,cnt);
    s = `<code>${s}</code>`;
    return s;
  }
  ///
  /// literal_to_escape
  ///
  literal_to_escape(style,cnt){
    let s = this.polish_verb(style,cnt);
    s = `<code>${s}</code>`;
    return s;
  }
  /// 
  /// phrase_to_XXX
  phrase_to_verb(style,cnt,cnt2,cnt3){
    return `<kbd style='white-space:pre'>${cnt}</kbd>`;
  }
  phrase_to_code(style,cnt,cnt2,cnt3){
    return `<code>${cnt}</code>`
  }
  phrase_to_em(style,cnt,cnt2,cnt3){
    return `<i>${cnt}</i>`
  }
  phrase_to_b(style,cnt,cnt2,cnt3){
    return `<b>${cnt}</b>`
  }
  phrase_to_i(style,cnt,cnt2,cnt3){
    return `<i>${cnt}</i>`
  }
  phrase_to_u(style,cnt,cnt2,cnt3){
    return `<u>${cnt}</u>`
  }
  phrase_to_ss(style,cnt,cnt2,cnt3){
    return `<span style='font-family:sans-serif'> ${cnt} </span>`;
  }
  phrase_to_tt(style,cnt,cnt2,cnt3){
    return `<span style='font-family:monospace'> ${cnt} </span>`;
  }
  phrase_to_overstrike(style,cnt,cnt2,cnt3){
    return `<s>${cnt}</s>`
  }
  phrase_to_var(style,cnt,cnt2,cnt3){
    return `<var>${cnt}</var>`
  }
  phrase_to_br(style,cnt,cnt2,cnt3){
    return `<br/>`
  }
  phrase_to_columnbreak(style,cnt,cnt2,cnt3){
    return `<div style='break-before:column;'></div>`;
  }
  phrase_to_quad(style,cnt,cnt2,cnt3){
    return `<span style='display:inline-block;width:1em;'></span>`;
  }
  phrase_to_qquad(style,cnt,cnt2,cnt3){
    return `<span style='display:inline-block;width:2em;'></span>`;
  }
  phrase_to_high(style,cnt,cnt2,cnt3){
    return `<sup>${cnt}</sup>`;
  }
  phrase_to_low(style,cnt,cnt2,cnt3){
    var css = '';
    return `<sub>${cnt}</sub>`;
  }
  phrase_to_ref(style,cnt,cnt2,cnt3){
    if(cnt){
      return `\uFFFF${cnt}\uFFFF`;
    }
    return "??";
  }
  phrase_to_link(style,cnt,cnt2,cnt3){
    return `<a href='${cnt}'>${cnt}</a>`
  }
  ///all picture phrases
  phrase_to_colorbutton(style,cnt,cnt2,cnt3){
    var ss = [];
    ss.push(`viewport 1 1 5`);
    ss.push(`fill {fillcolor:${cnt}} &rectangle{(0.1,0.1),0.8,0.8}`);
    ss.push(`stroke {linesize:1} &rectangle{(0,0),1,1}`);
    style.width = '5mm';
    style.height = '5mm';
    var { img } = this.diagram.to_diagram(style,ss);
    return img;
  }
  ///all math phrases
  phrase_to_math(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_math(style,cnt);
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
  phrase_to_sqrt(style,cnt,cnt2,cnt3){
    return this.tokenizer.to_phrase_sqrt(style,cnt);
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
  phrase_to_default(style,cnt,cnt2,cnt3) {
    return `<span>{${cnt}}{${cnt2}}{${cnt3}}</span>`
  }
  ///
  ///
  ///
  untext(style,body){
    var text = super.untext(style,body).trim();
    if(text.length){
      return text;
    }else{
      return '';
    }
  }
}
module.exports = { NitrilePreviewHtml };
