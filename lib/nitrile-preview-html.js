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
    this.my_svgarray_vspace = 3;
    this.flags = {};
    this.ref_map = {};
    this.equation_num = 0;
    this.figure_num = 0;
    this.table_num = 0;
    this.listing_num = 0;
    this.css_id = 0;
    this.def_padding = '0.5ex';
    this.icon_folder = '&#x1F4C2;';
    this.icon_writing_hand = '&#x270D;';
    this.icon_cdigits = ['&#x278a;','&#x278b;','&#x278c;','&#x278d;','&#x278e;','&#x278f;','&#x2790;','&#x2791;','&#x2792;','&#x2793;']
    this.icon_bullet = '&#x2022;'
    this.icon_nbsp = '&#160;&#160;'
    this.icon_squareboxo = '&#x25FB;'
    this.icon_squarebox  = '&#x25A3;'
    //this.icon_circleboxo = '&#x25CE;'
    //this.icon_circlebox  = '&#x25C9;'
    this.icon_circleboxo = '&#x25CB;'
    this.icon_circlebox  = '&#x25CF;'
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
    var style = this.update_style_from_switches(style,'PART')
    let idnum=this.get_refmap_value(style,'partnum');
    var o = [];
    var title = this.uncode(title,style);
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
    return o.join('\n');
  }
  do_HDGS(block) {
    var {hdgn,title,name,style} = block;
    var style = this.update_style_from_switches(style,'HDGS')
    var o = [];
    title = this.uncode(title,style);
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
    return o.join('\n');
  }
  do_PLST(block){
    var {plitems,style} = block;
    var style = this.update_style_from_switches(style,'PLST')
    let itemize = this.plitems_to_itemize(plitems);
    var o = [];
    o.push('');
    var text = this.itemize_to_text(itemize,style);
    o.push(text);
    return o.join('\n')
  }
  item_dl_to_text(i,item,g,item_labels){
    var o = [];
    var text = this.uncode(item.text,g);
    item_labels.push(text);
    var text = item_labels.join('<br/>')
    o.push(`<dt class='PARA DT'> <b> ${text} </b> </dt> <dd class='PARA DD'>`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(lines,g)} </div>`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    o.push(`</dd>`);
    return o.join('\n\n');
  }
  item_hl_to_text(i,item,g){
    var o = [];
    o.push(`<li class='PARA LI'> ${this.uncode(item.text,g)} `);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(lines,g)} </div>`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    o.push(`</li>`);
    return o.join('\n\n');
  }
  item_ol_to_text(i,item,g){
    var o = [];
    var text = this.uncode(item.text,g);
    if(item.type == 'A'){
      o.push(`<li class='PARA LI' type='A' value='${item.value}'> ${text}`)
    }else if(item.type == 'a'){
      o.push(`<li class='PARA LI' type='A' value='${item.value}'> ${text}`)
    }else if(item.type == 'I'){
      o.push(`<li class='PARA LI' type='I' value='${item.value}'> ${text}`)
    }else if(item.type == 'i'){
      o.push(`<li class='PARA LI' type='i' value='${item.value}'> ${text}`)
    }else if(item.value) {
      o.push(`<li class='PARA LI' value='${item.value}'> ${text}`);
    }else if(item.bullet=='*'){
      let value = i+1;
      o.push(`<li class='PARA LI' value='${value}'> ${text}`);
    }else{
      o.push(`<li class='PARA LI' type='I' value='${item.value}'> ${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(lines,g)} </div>`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    o.push(`</li>`)
    return o.join('\n\n');
  }
  item_ul_to_text(i,item,g){
    var o = [];
    var text = this.uncode(item.text,g);
    o.push(`<li class='PARA LI'> ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(lines,g)} </div>`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    o.push('</li>')
    return o.join('\n\n')
  }
  itemize_to_text(itemize,g){
    var bull = itemize.bull;
    var items = itemize.items;
    var o = [];
    switch (bull) {
      case 'OL': {
        o.push(`<ol class='PARA OL'>`);
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(j,item,g);
          o.push(text);
        });
        o.push('</ol>')
        break;
      }
      case 'UL': {
        o.push(`<ul class='PARA UL'>`);
        items.forEach((item,j) => {
          let text = this.item_ul_to_text(j,item,g);
          o.push(text);
        });
        o.push('</ul>')
        break;
      }
      case 'DL': {
        o.push(`<dl class='PARA DL'>`);
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
        o.push(`</dl>`)
        break;
      }
      case 'HL': {
        o.push(`<ul class='PARA HL'>`)
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(j,item,g);
          o.push(text);
        });
        o.push(`</ul>`)
        break;
      }
    }
    return o.join('\n\n');
  }
  do_HRLE(block) {
    var {style,text} = block;
    var style = this.update_style_from_switches(style,'HRLE')
    var text = `<hr  />`;
    return text;
  }
  do_PRIM(block) {
    var {rank,title,body,style} = block;
    var style = this.update_style_from_switches(style,'PRIM')
    title = this.uncode(title,style);
    var s0 = body[0]||'';
    var text = this.untext(body,style);
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
    var text = `<div class='PARA PRIM' style='${css}' > ${text} </div>`;
    return text;
  }
  do_PARA(block){
    var {body,style} = block;
    var style = this.update_style_from_switches(style,'PARA')
    var text = this.untext(body,style);
    var css = '';
    css += this.to_css_margin(style);
    var text = `<div class='PARA' style='${css}'> ${text} </div>`
    return text;
  }
  ///
  ///
  ///
  smooth (unsafe) {
    const T1 = String.fromCharCode(0x1);
    /// change string for dialog and others, such that these
    /// texts are to be part of a SVG text element, thus any HTML markup
    /// such as <sup>, <sub> are not allowed.
    unsafe = '' + unsafe; /// force it to be a string when it can be a interger
    unsafe = unsafe.replace(this.re_all_symbols, (match,p1) => {
          try{
            var v = this.tokenizer.get_html_symbol(p1);
            v = v.replace(/&/g,T1);
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

  /////////////////////////////////////////////////////////////////////
  /// fences
  /////////////////////////////////////////////////////////////////////
  fence_to_parbox(ss,g) {
    var g = this.update_style_from_switches(g,'parbox');
    var texts = ss.map((s) => this.uncode(s,g));
    var text = texts.join('<br/>');
    var css = '';
    css += `display:inline-block;`
    css += `text-indent:initial;`;
    css += `vertical-align:middle;`
    css += this.to_css_width(g,'100%');
    css += this.to_css_fontsize(g);
    css += this.to_css_fontfamily(g);
    css += this.to_css_fontstyle(g);
    return `<span style='${css}'> ${text} </span>`;
  }
  fence_to_math(ss,g) {
    var g = this.update_style_from_switches(g,'math')
    var g = {...g,displaymath:1};
    var text = ss.join('\n');
    var {s} = this.tokenizer.to_svgmath(text,g,'html');
    var s = `<span style='display:block;text-align:center;text-indent:0'> ${s} </span>`;
    return s;
  }
  fence_to_framed(ss,g){
    var g = this.update_style_from_switches(g,'framed')
    ss = this.trim_samp_body(ss);
    var { s, vw, vh, text } = this.framed.to_framed(ss,g);
    var css = '';
    css += `box-sizing:border-box;`;
    css += `text-indent:0;`;
    css += `vertical-align:middle;`;
    css += this.to_css_width(g,vw);
    css += this.to_css_height(g,'auto');
    css += this.to_css_outline(g);
    if(g.wrap){
      css += this.to_css_float(g);
    }
    let ENCODE = 0;
    if(ENCODE){
      ///It is important to convert it to inline IMG because then the 'css_style' will take effect
      s = `<img  alt='diagram' style='${css}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}" />`;
    }else{
      css += `color:black;`;
      css += `background-color:white;`;
      s = `<svg style='${css}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
    }
    return s;
  }
  fence_to_diagram(ss,style){
    var style = this.update_style_from_switches(style,'diagram');
    var animate = this.g_to_animate_string(style);
    var quantity = this.g_to_quantity_int(style);
    var wrap = this.g_to_wrap_string(style);
    if(wrap){
      var env = {};
      var { s, vw, vh, text } = this.diagram.to_diagram(ss,style,env);
      var css = '';
      css += `box-sizing:border-box;`;
      css += `text-indent:0;`;
      css += `vertical-align:middle;`;
      css += this.to_css_width(style,vw);
      css += this.to_css_height(style,'auto');
      css += this.to_css_float(style);
      css += this.to_css_outline(style);
      let ENCODE = 0;
      if(ENCODE){
        ///It is important to convert it to inline IMG because then the 'css_style' will take effect
        s = `<img  alt='diagram' style='${css}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}" />`;
      }else{
        css += `color:black;`;
        css += `background-color:white;`;
        s = `<svg style='${css}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='currentColor' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
      }
      return s;
    }else if(animate){
      var env_array = this.animate_to_env_array(animate,quantity);
      var o = [];
      for(let env of env_array) {
        var { s, vw, vh, text } = this.diagram.to_diagram(ss,style,env);
        if(text){
          var css = '';
          css += `box-sizing:border-box;`;
          css += `text-indent:0;`;
          css += `vertical-align:middle;`;
          css += this.to_css_width(style,vw);
          css += this.to_css_height(style,'auto');
          css += this.to_css_outline(style);
          css += `color:black;`;
          css += `background-color:white;`;
          var s = `<svg style='${css}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='currentColor' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
          o.push(s);
        }
      }
      var text = o.join('\n')
      return text;
    }else{
      var env = {};
      var { s, vw, vh, text } = this.diagram.to_diagram(ss,style,env);
      var css = '';
      css += `box-sizing:border-box;`;
      css += `text-indent:0;`;
      css += `vertical-align:middle;`;
      css += this.to_css_width(style,vw);
      css += this.to_css_height(style,'auto');
      css += this.to_css_outline(style);
      let ENCODE = 0;
      if(ENCODE){
        ///It is important to convert it to inline IMG because then the 'css_style' will take effect
        s = `<img  alt='diagram' style='${css}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}" />`;
      }else{
        css += `color:black;`;
        css += `background-color:white;`;
        s = `<svg style='${css}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='currentColor' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
      }
      return s;
    }
  }
  fence_to_img(ss,style) {
    var style = this.update_style_from_switches(style,'img')
    var fname = this.choose_html_image_file(ss);
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
    css += `vertical-align:middle;`;
    css += this.to_css_width(style,'');
    css += this.to_css_height(style,'auto');
    css += this.to_css_outline(style);
    if(style.wrap){
      css += this.to_css_float(style);
    }
    //return `<svg style="${css_style.join(';')}" viewBox="0 0 ${asp[0]} ${asp[1]}" xmlns="http://www.w3.org/2000/svg"><image href="${imgsrc}" width="${asp[0]}" height="${asp[1]}"/></svg>`;
    //return `<img style='object-fit:contain;${css_style.join(';')}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
    return `<img style='${css}' src='${imgsrc}' id='${imgid}' alt='${imgsrc}' />`;
  }
  fence_to_blockquote(ss,g){
    var g = this.update_style_from_switches(g,'blockquote')
    var text = this.join_para(ss);
    var text = this.uncode(text,g);
    var css = '';
    css += `display:inline-block;`
    css += `text-align:justify;`
    css += `hyphens:auto;`
    css += `text-indent:0;`;
    css += `vertical-align:middle;`
    css += this.to_css_fontsize(g);
    css += this.to_css_fontfamily(g);
    css += this.to_css_fontstyle(g);
    css += this.to_css_leftmargin(g);

    return `<div style='${css}' > ${text} </div>`;
  }
  fence_to_verbatim(ss,g){
    var g = this.update_style_from_switches(g,'verbatim')
    var ss = ss.map(x => this.polish_verb(x));
    var ss = ss.map(x => `<code>${x}</code>`)
    var text = ss.join('<br/>')
    var css = '';
    css += `line-height:1`;
    css += `display:inline-block;`;
    css += `text-indent:0;`;
    css += this.to_css_fontsize(g);
    return `<div style='${css}'  > ${text} </div>`;
  }
  fence_to_tabular(ss,g) {
    var g = this.update_style_from_switches(g,'tabular')
    //
    //build rows
    //
    var rows = this.ss_to_tabular_rows(ss,g);
    var rows = this.update_rows_by_hrule(rows,g.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,g);
      })
    })
    // 
    // rows_to_tabular will also take care of g.head by setting it to <th>...</th>
    //
    var text = this.rows_to_tabular(rows,g);
    //
    //put it together
    //
    var css = '';
    css += `display:inline-block;`
    css += `text-indent:0;`
    css += `vertical-align:middle;`
    css += this.to_css_bordercollapse(g);
    if(g.wrap){
      css += this.to_css_float(g);
    }
    css += this.to_css_fontsize(g);  
    css += this.to_css_width(g,'');  
    return `<table border='0' style='${css}'  > ${text} </table>`;
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
    var n = (rows.length)?rows[0].length:1;
    var gap = parseFloat(g.gap)||0.02;
    var strut = parseFloat(g.strut)||0;
    var frs = this.string_to_frs_with_gap(g.fr||'',n,gap);
    var d = [];
    rows.forEach((pp,i,arr) => {
      ss = pp.map((x) => x.text);
      if(g.head && i==0){
        ss = ss.map((x) => `<b>${x}</b>`);
      }
      var minheight = gap?`height:${strut}pt`:"";
      ss = ss.map((x,i) => `<td style='width:${frs[i]*100}%;${minheight};' >${x}</td>`);
      d.push('<tr>')
      d.push(ss.join(`<td style='width:${gap*100}%' ></td>`));
      d.push('</tr>')
    });
    var text = d.join('\n')
    var css = '';
    css += this.to_css_fontsize(g);  
    css += this.to_css_fontfamily(g);
    css += this.to_css_fontstyle(g);
    css += this.to_css_width(g,'100%');  
    css += this.to_css_bordercollapse(g);
    return `<table border='0' style='${css}'  > ${text} </table>`;
  }
  fence_to_list(ss,g) {
    var g = this.update_style_from_switches(g,'list')
    var itms = this.ss_to_list_itms(ss,g);
    var bullet = '&#x2022;'
    const nbsp       = this.icon_nbsp;
    const squareboxo = this.icon_squareboxo;
    const squarebox  = this.icon_squarebox;
    const circleboxo = this.icon_circleboxo;
    const circlebox  = this.icon_circlebox;
    const check_ss = this.string_to_array(this.assert_string(g.check));
    if(g.bullet){
      try{
        let s = this.tokenizer.get_html_symbol(g.bullet);
        bullet = s;
      }catch(e){
      }
    }
    var parsep = this.assert_float(g.parsep);
    let d = [];
    itms.forEach((p,i,arr) => {
      if(p.text=='\\\\'){
        p.text = '&#160;';
      }else{
        p.text = this.uncode(p.text,g);
      }
      p.value = this.uncode(p.value,g);
      p.bull = this.uncode(p.bull,g);
      var css = `display:list-item;list-style-type:none;padding-left:${this.padding_list};text-indent:-${this.padding_list};`;
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
        d.push(`<label style='${css}' ><b>${p.value}</b><br/>${p.text}</label>`)
      }
      else if(p.type == 'CB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          d.push(`<label  style='${css}' >${squarebox}${nbsp}${p.text}</label>`);
        }else{
          //empty CB
          d.push(`<label  style='${css}' >${squareboxo}${nbsp}${p.text}</label>`);
        }
      }
      else if(p.type == 'RB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          d.push(`<label  style='${css}' >${circlebox}${nbsp}${p.text}</label>`);
        }else{
          //empty CB
          d.push(`<label  style='${css}' >${circleboxo}${nbsp}${p.text}</label>`);
        }
      }
      else {
        d.push(`<label  style='${css}' >${bullet}${nbsp}${p.text}</label>`);
      }
    });
    if(parsep){
      var text = d.join(`<div style='min-height:${parsep}pt'></div>\n`);
    }else{
      var text = d.join('\n')
    }
    var text = `<form>\n ${text} \n</form>`;
    var css = '';
    css += this.to_css_fontsize(g);
    css += this.to_css_fontfamily(g);
    css += this.to_css_fontstyle(g);
    css += this.to_css_leftmargin(g);
    text = `<div style='${css}'  > ${text} </div>`;
    return text;
  }

  /////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////
  float_to_math(title,ss,g){
    var g = this.update_style_from_switches(g,'math')
    g = {...g,displaymath:1};
    var text = ss.join('\n');
    var {s:text} = this.tokenizer.to_svgmath(text,g,'html');
    text = `<div style='text-align:center'>${text}</div>`
    var o = [];
    var figcss = this.to_figure_css(g);
    o.push(`<figure style='${figcss}'  >`);
    o.push(text);
    o.push(`</figure>`);
    text = o.join('\n');
    return text;
  }
  float_to_equation(title,ss,g){
    var g = this.update_style_from_switches(g,'equation')
    g = {...g,displaymath:1};
    var text = ss.join('\n');
    var {s:text} = this.tokenizer.to_svgmath(text,g,'html');
    var label = g.label||'';
    if(label.length){
      let idnum = this.to_idnum('equation');///should be overriden by subclasses
      if(label && idnum){
        this.addto_refmap(label,idnum);
      }  
      if(idnum) {
        idnum = `(${idnum})`;
      }
      text = `<div style='position:relative'><span style='position:absolute;right:0;top:50%;transform:translate(0,-50%);' >${idnum}</span>${text}</div>`
    }else{
      text = `<div>${text}</div>`
    }
    var o = [];
    var figcss = this.to_figure_css(g);
    var text = `<figure style='${figcss}'  > $text} </figure>`;
    return text;
  }
  float_to_listing(caption,ss,g){
    var g = this.update_style_from_switches(g,'listing')
    var ss = this.trim_samp_body(ss);
    if(1){
      var ss = ss.map((x, i) => {
        var line = x;
        var lineno = `${i + 1}`;
        var lineno = `<span style='position:absolute;right:100%;top:50%;transform:translateY(-50%);text-align:right;display:inline-block;text-indent:0;padding-right:1ex;font-size:smaller;'> ${lineno}</span>`;
        var line = this.polish(line);
        if(g.numbers){
          var text = `${line}${lineno}`;
        }else{
          var text = `${line}`;
        }
        return `<code style='white-space:pre;position:relative;'>${text}</code>`;
      });
      var text = ss.join('<br/>\n');
      var text = `<div style='font-size:smaller;' >${text}</div>`        
    }
    var figcss = this.to_figure_css(g);
    var text = `<figure style='${figcss}'  > ${this.to_caption_text(caption,g,"listing")} ${text} </figure>`;
    return text;
  }
  float_to_figure(title,ss,style){
    var style = this.update_style_from_switches(style,'figure')
    var ss = this.trim_samp_body(ss);
    var itms = this.ss_to_figure_itms(ss,style);
    var seq = 0;
    var all = [];
    itms.forEach((p,j,arr) => {
      var {key,cnt,cnt2,cnt3,sub} = p;
      if(key){
        seq++;
        p.sub = `(${this.to_a_letter(seq)}) ${this.uncode(sub,style)}`;
        p.img = this.do_phrase(key,style,cnt,cnt2,cnt3);
        all.push(this.to_subfigure_html(p.img,p.sub));
      }else{
        all.push(`<br/>`);
      }
    });
    var text = all.join('\n');
    var figcss = this.to_figure_css(style);
    return `<figure style='${figcss}'  > ${this.to_caption_text(title,style,"figure")} ${text} </figure>`;
  }
  float_to_table(title,ss,g){
    var g = this.update_style_from_switches(g,'table')
    var ss = this.trim_samp_body(ss);
    var rows = this.ss_to_tabular_rows(ss,g);
    var rows = this.update_rows_by_hrule(rows,g.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,g);
      })
    })
    var text = this.rows_to_tabular(rows,g);
    var css = '';
    css += `display:inline-block;`
    css += `text-indent:0;`
    css += `vertical-align:middle;`
    css += this.to_css_bordercollapse(g);
    css += this.to_css_fontsize(g);  
    css += this.to_css_width(g,'');  
    var text = `<table border='0' style='${css}'  > ${text} </table>`;
    var figcss = this.to_figure_css(g);
    var text = `<figure style='${figcss}'  > ${this.to_caption_text(title,g,"table")} ${text} </figure>`;
    return text;
  }
  float_to_longtable(title,ss,g){
    var g = this.update_style_from_switches(g,'longtable');
    var ss = this.trim_samp_body(ss);
    if(1){
      var rows = this.ss_to_tabular_rows(ss,g);
      var rows = this.update_rows_by_hrule(rows,g.hrule);
      rows.forEach((pp) => {
        pp.forEach((p) => {
          p.text = this.uncode(p.raw,g);
        })
      })
      var text = this.rows_to_tabular(rows,g);
      var css = '';
      css += 'display:table;';
      css += 'text-indent:0;';
      css += 'width:100%;';
      css += this.to_css_bordercollapse(g);
      var text = `<table border='0' style='${css}'> ${text} </table>`;  
    }    
    var figcss = this.to_figure_css(g);
    var text = `<figure style='${figcss}'  > ${this.to_caption_text(title,g,"table")} ${text} </figure>`;
    return text;
  }
  float_to_columns(title,ss,g){
    var g = this.update_style_from_switches(g,'columns')
    var clusters = this.ss_to_clusters(ss);
    var texts = clusters.map((ss) => this.untext(ss,g));
    var total = texts.length;
    var n = 2;
    var sep = `<div style='break-before:column;'></div>`;
    var o = [];
    //var text = texts.join(`<div style='break-before:column;'></div>`);
    //css += `columns:${n};`;
    for(let j=0; j < total; j+=n){
      o.push(`<div style='columns:${n}'>`);
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
    var css = '';
    css += this.to_css_fontsize(g);
    css += this.to_css_margin(g);
    var figcss = this.to_figure_css(g);
    var text = `<figure style='${css};${figcss}' > ${text} </figure>`;  
    return text;
  }
  float_to_framed(title,ss,g) {
    var g = this.update_style_from_switches(g,'framed')
    var { s, framewidth, frameheight, text } = this.framed.to_framed(ss,g);
    let css_style = [];
    css_style.push(`box-sizing:border-box`);
    if(g.outline==1){ 
      css_style.push(`outline:1px solid`);
    }
    css_style.push(`width:100%`);
    let ENCODE = 0;
    if(ENCODE){
      ///It is important to convert it to inline IMG because then the 'css_style' will take effect
      var text = `<img  alt='diagram' style='${css_style.join(';')}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}" />`;
    }else{
      css_style.push(`color:black`);
      css_style.push(`background-color:white`);
      var text = `<svg style='${css_style.join(';')}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='' viewBox='0 0 ${this.fix(framewidth*1.333)} ${this.fix(frameheight*1.333)}' >${text}</svg>`;
    }
    var figcss = this.to_figure_css(g);
    var text = `<figure style='${figcss}'> ${text} </figure>`;
    return text;
  }
  float_to_verbatim(title,ss,g){
    var g = this.update_style_from_switches(g,'verbatim')
    var text = this.fence_to_verbatim(ss,g);
    var text = `<figure style=''> ${text} </figure>`;
    return text;
  }
  float_to_lines(title,ss,g) {
    var g = this.update_style_from_switches(g,'lines')
    ss = ss.map(s => {
      if (!s) {
        s = "&#160;";
      }else{
        s = this.polish(s);
        if(g.rubify){
          s = this.rubify(x,g.vmap);
        }
      }
      return s;
    });
    var text = ss.join('<br/>');
    var text = `<pre >${text}</pre>`;
    var text = `<figure > ${text} </figure>`;
    return text;
  }
  
  /////////////////////////////////////////////////////////////////////
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
    var style = {};
    var items = this.parser.blocks.map(x => {
      var {id,sig,part,name,text,idnum} = x; 
      text = this.uncode(text,style);
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
    let tag = this.to_tag(name);
    let idnum = this.to_idnum(name);
    if(label && idnum){
      this.addto_refmap(label,idnum);
    }
    let caption_text = this.uncode(caption,style);
    if(idnum){
      var lead = `${tag} ${idnum}:`
    }else{
      var lead = `${tag}:`
    }
    if(caption_text){
      lead += ` ${caption_text}`
    }
    return `<figcaption style='margin:1ex auto;'>${lead} </figcaption>`;
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
  rows_to_tabular(rows,g){
    var n = rows.length ? rows[0].length : 1;
    var strut = parseInt(g.strut)||0;
    var height = (strut)?`${strut}pt`:'';
    var vbars = this.vrule_to_vbars(n,g.vrule);
    var border_top = '';
    var border_bot = '';
    var cellcolor_map = this.string_to_cellcolor_map(g.cellcolor||'')
    if(g.fr){
      var haligns = this.string_to_td_width(g.fr||'',n);
    }else{
      var haligns = this.string_to_td_haligns(g.halign||'',n);
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
        const lr='1ex';
        if(i>0 && vbars[i]==='||'){
          pp1.push(`<td style='border-left:1px solid;border-right:1px solid;border-top:${border_top};border-bottom:${border_bot};'></td>`);
        }
        let border_left = (vbars[i])?'1px solid':'';
        let border_right= (vbars[i+1])?'1px solid':'';
        let pad=`0 ${lr}`;
        let color = '';
        if(cellcolor_map.has(raw)){
          color = cellcolor_map.get(raw);
        }
        var ht = height;
        var css = '';
        css += `text-align:${haligns[i].ta};width:${haligns[i].pw};`
        css += `height:${ht};`
        css += `padding:${pad};`;
        css += `border-top:${border_top};`
        css += `border-bottom:${border_bot};`
        css += `border-left:${border_left};`
        css += `border-right:${border_right};`
        css += `background-color:${color};`
        if(g.head && j==0){
          ht = '';
          pp1.push(`<th style='${css}'> ${text} </th>`);        
        }else{
          pp1.push(`<td style='${css}'> ${text} </td>`);        
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
    if(g.title){
      var title = this.uncode(g.title,g);
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
  string_to_css_height(s,zoom,def='') {
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
    css += this.to_css_fontsize(style);
    o.push(`<table border='0' style='display:inline-block;text-indent:0;vertical-align:middle;' >`);
    o.push(`<tr><td style='${css}'>${s}</td></tr>`)
    o.push(`<tr><td style='${css}'>${sub}</td></tr>`)
    o.push(`</table>`)
    return o.join('\n')
  }
  to_css_bordercollapse(style){
    return `border-collapse:collapse;`;
  }
  to_css_margin(style){
    return `margin:${this.margin_p} 0;`                    
  }
  to_css_fontsize(style){
    return this.string_to_css_fontsize(style.fontsize);
  }
  to_css_fontfamily(style){
    return this.string_to_css_fontfamily(style.fontfamily);
  }
  to_css_fontstyle(style){
    return this.string_to_css_fontstyle(style.fontstyle);
  }
  to_css_leftmargin(style){
    var leftmargin = this.assert_float(style.leftmargin);
    if(leftmargin){
      return `margin-left:${leftmargin}mm;`;
    }
    return '';
  }
  to_css_float(style){
    var s = '';
    var wrap = (style.wrap == 'left') ? 'left' : 'right';
    if(wrap=='left'){
      s += `margin-right:0.68em;float:${wrap};`
    }else{
      s += `margin-left:0.68em;float:${wrap};`
    }
    return s;
  }
  to_css_width(style,def_width=''){
    var s = '';
    s = this.string_to_css_width(style.width,style.zoom,def_width);
    if(s) s = `width:${s};`;
    return s;
  }
  to_css_height(style,def_height=''){
    var s = '';
    s = this.string_to_css_height(style.height,style.zoom,def_height);
    if(s) s = `height:${s};`;
    return s;
  }
  to_css_outline(style){
    var s = '';
    if(style.outline){
      s = `outline:1px solid;`;
    }
    return s;
  }
  to_circled_number_svg(num){
    var d = [];
    d.push(`<svg xmlns = 'http://www.w3.org/2000/svg' width='0.75em' height='0.75em' viewBox='0 0 16 16' fill='currentColor' stroke='currentColor' style='vertical-align:baseline;'>`);
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
    return `<table border='0' style='table-layout:fixed;display:inline-table;'><caption align="bottom"><small>${sub}</small></caption><tr><td style='width:1px;white-space:nowrap;text-align:center;'>${img}</td></tr></table>`;
  }
  to_subfigure_html_table(img,sub,g){
    var o = [];
    o.push(`<table border='0'>`);
    o.push(`<tr>`);
    pp.forEach((p) => {
      o.push(`<td>${p.img}</td>`);
    });
    o.push(`</tr>`);
    o.push(`<tr>`);
    pp.forEach((p) => {
      o.push(`<td style='font-size:smaller'>${p.sub}</td>`);
    });
    o.push(`</tr>`);
    o.push(`</table>`);
    return o.join('\n');
  }
  to_figure_css(style){
    var css = '';
    //css += 'page-break-inside:avoid;';
    return css;
  }
  ///
  /// literal_to_double
  ///
  literal_to_double(style,cnt){ 
    let s = this.polish_verb(cnt);
    s = `<q><code>${s}</code></q>`;
    return s;
  }
  ///
  /// literal_to_single
  ///
  literal_to_single(style,cnt){ 
    let s = this.polish_verb(cnt);
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
  phrase_to_tt(style,cnt,cnt2,cnt3){
    return `<tt>${cnt}</tt>`
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
  phrase_to_inlinemath(style,cnt,cnt2,cnt3){  
    style.displaymath = 0;
    let {s} = this.tokenizer.to_svgmath(cnt,style,'html');
    return s;
  }
  phrase_to_displaymath(style,cnt,cnt2,cnt3){  
    style.displaymath = 1;
    let {s} = this.tokenizer.to_svgmath(cnt,style,'html');
    s = `<div style='text-align:center;'>${s}</div>`
    return s;
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
    var env = {};
    var ss = [];
    ss.push(`viewport 1 1 5`);
    ss.push(`fill {fillcolor:${cnt}} &rectangle{(0.1,0.1),0.8,0.8}`);
    ss.push(`stroke {linesize:1} &rectangle{(0,0),1,1}`);
    var { s, vw, vh, text } = this.diagram.to_diagram(ss,style,env);
    var css = '';
    css += `width:5mm;`;
    css += `height:5mm;`;
    css += `box-sizing:border-box;`;
    css += `text-indent:initial;`;
    css += `vertical-align:middle;`;
    css += `color:black;`;
    css += `background-color:white;`;
    s = `<svg style='${css}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='currentColor' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
    return s;
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
    return `<span>${cnt}</span>`
  }

}
module.exports = { NitrilePreviewHtml };
