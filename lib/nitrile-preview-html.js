'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { NitrilePreviewDiagramSVG } = require('./nitrile-preview-diagramsvg');
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
  hdgs_to_part(title,label,partnum,chapternum,level,style){
    return(`<h1 class='PART'>Part. ${this.uncode(style,title)}</h1>`);
  }
  hdgs_to_chapter(title,label,partnum,chapternum,level,style){
    return(`<h1 class='CHAPTER'>${this.uncode(style,title)}</h1>`);
  }
  hdgs_to_section(title,label,partnum,chapternum,level,style){
    return(`<h2 class='SECTION'>${this.uncode(style,title)}</h2>`);
  }
  hdgs_to_subsection(title,label,partnum,chapternum,level,style){
    return(`<h3 class='SUBSECTION'>${this.uncode(style,title)}</h3>`);
  }
  hdgs_to_subsubsection(title,label,partnum,chapternum,level,style){
    return(`<h4 class='SUBSUBSECTION'>${this.uncode(style,title)}</h4>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////////////
  item_dl_to_text(i,item,nblank){
    var o = [];
    var value = this.uncode(item.style,item.value);
    if(Array.isArray(item.values)){
      value = item.values.map((s) => this.uncode(item.style,s)).join('<br/>');
    }
    var text = this.untext(item.style,item.body).trim();
    var cls = (!nblank) ? 'PACK' : 'PARA';
    if(text.length){
      o.push(`<dt class='${cls} DT FIRST'> <b> ${value} </b> </dt> <dd class='PACK DD'> ${text} </dd> <dd class='${cls} DD'>`);  
    }else{
      o.push(`<dt class='${cls} DT'> <b> ${value} </b> </dt> <dd class='PACK DD'> ${text} </dd> <dd class='${cls} DD'>`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(p.style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize)}`);
        }
      });
    }
    o.push(`</dd>`);
    return o.join('\n\n');
  }
  item_hl_to_text(i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.polish_verb(item.style,text);
    var text = `<code>${text}</code>`;
    var cls = (!nblank) ? 'PACK' : 'PARA';
    o.push(`<li class='${cls} LI'> ${text} `);      
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(p.style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize)}`);
        }
      });
    }
    o.push(`</li>`);
    return o.join('\n\n');
  }
  item_ol_to_text(i,item,nblank){
    var o = [];
    var text = this.untext(item.style,item.body);
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
          o.push(`${this.itemize_to_text(p.itemize)}`);
        }
      });
    }
    o.push(`</li>`)
    return o.join('\n\n');
  }
  item_ul_to_text(i,item,nblank){
    var o = [];
    var text = this.untext(item.style,item.body);
    var cls = (!nblank) ? 'PACK' : 'PARA';
    o.push(`<li class='${cls} LI'> ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(p.style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize)}`);
        }
      });
    }
    o.push('</li>')
    return o.join('\n\n')
  }
  itemize_to_text(itemize){
    var bull = itemize.bull;
    var items = itemize.items;
    var nblank = itemize.nblank;
    var cls = (!nblank) ? 'PACK' : 'PARA';
    var o = [];
    switch (bull) {
      case 'DL': {
        o.push(`<dl class='${cls} DL'>`);
        let last_o = [];
        items.forEach((item,j) => {
          let p = (last_o.length) ? last_o[last_o.length-1] : null;
          if(p && p.text.trim().length==0 && p.more.length==0){
            last_o.push(item);
            let values = last_o.map((p) => p.value);
            item.values = values;
            let text = this.item_dl_to_text(j,item,nblank);
            o.pop();
            o.push(text);
          }else{
            last_o = [];
            last_o.push(item);
            let text = this.item_dl_to_text(j,item,nblank);
            o.push(text);
          }
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
    return this.tokenizer.to_fence_math(style,ss);
  }
  fence_to_ink(style,ss){
    ss = this.trim_samp_body(ss);
    var { s, vw, vh, text } = this.diagram.to_ink(style,ss);
    var css = '';
    css += `text-indent:0;`;
    css += this.style_to_css_border(style);
    if(style.stretch){
      css += `width:${100*style.stretch}%;`;
    } else if (style.width && style.height) {
      css += `width:${style.width}mm;`;
      css += `height:${style.height}mm;`;
    } else if (style.width) {
      css += `width:${style.width}mm;`;
    } else if (style.height) {
      css += `height:${style.height}mm;`;
    } else {
      css += `width:${vw}pt;`;
      css += `height:${vh}pt;`;
    }
    let ENCODE = 0;
    if(ENCODE){
      ///It is important to convert it to inline IMG because then the 'css_style' will take effect
      s = `<img  alt='diagram' style='${css}' src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}"></img>`;
    }else{
      // css += `color:black;`;
      // css += `background-color:white;`;
      s = `<svg class='FRAMED' style='${css}' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' >${text}</svg>`;
    }
    var o = [];
    o.push({img:s,sub:''});
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
    var css = '';
    // css += `box-sizing:border-box;`;
    css += `text-indent:0;`;
    css += this.style_to_css_border(style);
    if(style.stretch){
      css += `width:${100*style.stretch}%;`;
    } else if (style.width && style.height) {
      css += `width:${style.width}mm;`;
      css += `height:${style.height}mm;`;
    } else if (style.width) {
      css += `width:${style.width}mm;`;
    } else if (style.height) {
      css += `height:${style.height}mm;`;
    }
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
    var text = `<div class='CENTER' > ${text} </div>`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_flushright(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var text = `<div class='FLUSHRIGHT' > ${text} </div>`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_flushleft(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var text = `<div class='FLUSHLEFT' > ${text} </div>`;
    var o = [];
    o.push({img:text,sub:''});
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
        var css = '';
        css += `text-align:${ww[k].ta};`;
        all.push(`<th class='TH' style='${css}'> ${text} </th>`);
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
        var css = '';
        css += `text-align:${ww[k].ta};`;
        if(j+1==arr.length){
          //do nothing, the rules= attribute will take care of it
        }else{
          if(lower==1){
            css += `border-top:1px solid;`;
          }
        }
        if(style.side && k == 0){
          //do not color the side column
          color = '';
        }
        if(color){
          css += `background-color:${color};`
        }
        all.push(`<td class='TD' style='${css}'> ${text} </td>`); 
      });
      all.push('</tr>')
      lower = pp.lower;  
    });
    var text = all.join('\n');
    var css = '';
    css += `display:inline-table;`
    if(style.small){
      css += `font-size:smaller`;   
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
    var text = `<table class='TABULAR' ${attrs.join(' ')} style='${css}'  >\n${colgroup}\n${text}\n</table>`;
    var o = [];
    o.push({img:text,sub:''});
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
        d.push(`<div  class='PACK'   >${bullet} ${p.text}</div>`);
      }
      else if(p.type=='OL'){
        d.push(`<div  class='PACK'   >${i+1}. ${p.text}</div>`);  
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        d.push(`<div  class='PACK'   >${p.value}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        d.push(`<div  class='PACK'   >${this.to_a_letter(p.value)}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        d.push(`<div  class='PACK'   >${this.to_A_letter(p.value)}${p.ending} ${p.text}</div>`);
      }
      else if(p.type == 'DL'){
        d.push(`<div class='PACK'   ><b>${p.value}</b> ${p.text}</div>`)
      }
      else if(p.type == 'INDENTED'){
        //empty CB
        let s = '&#160;'.repeat(p.value);
        d.push(`<div  class='PACK'   > ${s}${p.text}</div> `);
      }
      else {
        ///ordinary line without a leading bullet
        d.push(`<div  class='PACK'   >${p.text}</div>`);
      }
    });
    var text = d.join('\n')
    var text = `<div class='LIST'> ${text} </div>`;
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_quote(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var all = [];
    all.push(`<blockquote class='QUOTE'>`)
    all.push(text);
    all.push(`</blockquote>`)
    var text = all.join('\n');
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  body_to_verse(style,body){
    let o = this.fence_to_verse(style,body);
    let all = [];
    o.forEach(({img}) => all.push(img))
    return all.join('\n');
  }
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
  float_to_indent(title,label,style,body){
    var all = [];
    var text = this.untext(style,body);
    all.push('');
    all.push(text);
    var text = all.join('\n');
    return `<div class='INDENT' > ${text} </div>`;
  }
  float_to_primary(title,label,style,body,rank) {
    title = this.uncode(style,title);
    if(body.length>1 && body[0].length==0){
      body = body.slice(1);
    }
    var text = this.untext(style,body);
    if (rank === 1) {
      text = `<strong>${title}</strong> &#160; ${text}`;
    } 
    else {
      text = `<strong><i>${title}</i></strong> &#160; ${text}`;
    }
    var text = `<div class='PRIMARY' > ${text} </div>`;
    return text;
  }
  float_to_verbatim(title,label,style,body){
    var all = [];
    var clusters = this.ss_to_clusters(body);
    clusters.forEach((ss)=>{
      ss = this.trim_samp_body(ss);
      let o = this.fence_to_verbatim(style,ss);
      o.forEach((p)=>{
        let s = p.img;
        s = `<div class='PARAGRAPH'> ${s} </div>`;    
        all.push('');
        all.push(s)
      });
    })
    var text = all.join('\n')
    return text;
  }
  float_to_itemize(title,label,style,itemize){
    var all = [];
    var text = this.itemize_to_text(itemize);
    var text = `<div class='ITEMIZE' > ${text} </div>`
    return text;
  }
  float_to_equation(title,label,style,ss){
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
    var ss = ss.map((s,i) => {
      var s = this.polish(style,s);
      return `<code class='LINE' style='white-space:pre'>${s}</code>`;
    });
    var ss = ss.map((s,i) => {
      return `<tr><td>${i+1}</td><td>${s}</td></tr>`;
    })
    var text = ss.join('\n');
    var text = `<table class='BODY'>${text}</table>`;
    return `<figure class='LISTING'  > ${this.to_caption_text(title,label,style,"listing")} ${text} </figure>`;
  }
  float_to_figure(title,label,style,ss){
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    if(style.wrap){
      var wrap = style.wrap=='left' ? 'WRAPLEFT' : 'WRAPRIGHT';
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let img = p.img;
          img = this.update_css_class(img,`${wrap}`);
          all.push(img);
        }
      });
      var text = all.join('\n');
      return `<div class='PARAGRAPH' > ${text} </div>`;
    }
    else if(style.subfigure){
      var rows = [];
      var row = [];
      rows.push(row);
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          p.sub = `(${this.to_a_letter(p.seq)}) ${p.sub}`
          let img = this.to_subfigure_img(p.img,p.sub);
          row.push(img);
        }else{
          row = [];
          rows.push(row);
        }
      });
      for(row of rows){
        if(row.length){
          all.push(`<div class='COMBINATION' style='grid-template-columns:repeat(${row.length},auto);'>`);
          row.forEach((img) => all.push(img));
          all.push(`</div>`);
        }
      }
      var text = all.join('\n');
      return `<figure class='FIGURE' > ${this.to_caption_text(title,label,style,"figure")} <div class='COMBINATIONROW'> ${text} </div> </figure>`;
    }
    else{
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
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
        if(p.type=='bundle'){
          let img = p.img;
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
      var rows = [];
      var row = [];
      rows.push(row);
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          p.sub = `(${this.to_a_letter(p.seq)}) ${p.sub}`
          let img = this.to_subfigure_img(p.img,p.sub);
          row.push(img);
        }else{
          row = [];
          rows.push(row);
        }
      });
      for(row of rows){
        if(row.length){
          all.push(`<div class='COMBINATION' >`);
          row.forEach((img) => all.push(img));
          all.push(`</div>`);
        }
      }
      var text = all.join('\n');
      return `<figure class='TABLE'  > ${this.to_caption_text(title,label,style,"table")} <div class='COMBINATIONROW'> ${text} </div> </figure>`;
    }
    else{
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          all.push(p.img);
        }
      });
      var text = all.join('\n');
      return `<figure class='TABLE'  > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
    }
  }
  float_to_longtable(title,label,style,ss){
    var itms = this.ss_to_figure_itms(ss,style);
    for(let itm of itms){
      if(itm.type=='bundle' && itm.key=='tabular'){
        var text = itm.img;
        var text = `<figure class='LONGTABLE'  > ${this.to_caption_text(title,label,style,"table")} ${text} </figure>`;
        return text;
      }
    }
    return '';
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
    if(style.small){
      css += 'font-size:smaller;';
    }
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
    if(this.imgs.indexOf(imgsrc) < 0){
      this.imgs.push(imgsrc);
    }
    var imgid = '';
    return {imgsrc, imgid};
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
  to_subfigure_img(img,sub){
    var s_width = this.extract_css_style(img,'width');
    img = this.update_css_style(img,'width','100%');
    var all = [];
    all.push(`<span style='' class='SUBFIGURE'>`);
    all.push(`${img}`);
    if(sub){
      all.push(`<footer class='SUBFIGCAPTION'>${sub}</footer>`);
    }
    all.push(`</span>`);
    img = all.join(' ');
    img = this.update_css_style(img,'width',s_width);
    return img;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_double(style,cnt){ 
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
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
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
    var o = this.diagram.to_diagram(style,ss);
    if(o.length){
      var img = o[0].img;
      return img;
    }
    return '';
  }
  phrase_to_default(style,cnt,cnt2,cnt3) {
    return `<span>{${cnt}}{${cnt2}}{${cnt3}}</span>`
  }
  phrase_to_utfchar(style,cnt,cnt2,cnt3){
    return `&#x${cnt};`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  untext(style,body){
    var text = super.untext(style,body);
    var text = text.trim();
    if(text.length){
      return text;
    }else{
      return '';
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  to_templated_css(n_para,n_pack,n_half,n_marginleft,n_marginright){
    return `
      table {
        border-collapse: collapse;
      }

      .LISTING > .BODY {
        line-height: 1;
        text-align: left;
        width: 100%;
        font-size: smaller;
      }

      .FIGURE, .TABLE, .LONGTABLE {
        text-align: center;
        page-break-inside: avoid;
      }

      .ITEMIZE, .PARAGRAPH, .INDENT, .EQUATION, .TABBING, .FIGURE, .TABLE, .LONGTABLE, .LISTING {
        margin-top: ${n_para};
        margin-bottom: ${n_para};
        margin-left:  ${n_marginleft};
        margin-right: ${n_marginright};
        align-self: center;
      }

      .PRIMARY {
        margin-top: ${n_para};
        margin-bottom: ${n_para};
        align-left: center;
      }

      .PARAGRAPH, .INDENT {
        text-align: justify;
        -webkit-hyphens: auto;
        -moz-hyphens: auto;
        -ms-hyphens: auto;
        hyphens: auto;
      }
      
      .INDENT {
        padding-left: 0.55cm;
      }

      .COMBINATIONROW {
        display: grid;
        grid-template-columns: 100%;
        grid-row-gap: ${n_half};
        justify-content: center;
        width: 100%;
      }

      .COMBINATION {
        text-align: center;
        overflow: visible;
        white-space: nowrap;
        width: 100%;
        align-items: baseline;
      }

      .FIGCAPTION {
        margin-top: 0;
        margin-bottom: ${n_half};
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        line-height: 1;
        font-size: smaller;
      }

      .SUBFIGCAPTION {
        line-height: 1;    
        font-size: smaller;
        white-space: normal;
      }

      .SUBFIGURE {
        display: inline-block;
        overflow: visible;
        vertical-align: top;
        text-align: center;
        margin-left: 1.5mm;
        margin-right: 1.5mm;
      }

      .WRAPLEFT {
        float: left;
        margin-right: 1em;
      }

      .WRAPRIGHT {
        float: right;
        margin-left: 1em;
      }
      
      .CENTER {
        text-align:center;
        margin-top: ${n_para};
        margin-bottom: ${n_para};
      }
      
      .FLUSHRIGHT {
        text-align:right;
        margin-top: ${n_para};
        margin-bottom: ${n_para};
      }

      .FLUSHLEFT {
        text-align:left;
        margin-top: ${n_para};
        margin-bottom: ${n_para};
      }

      .DISPLAYMATH {
        text-align:center;
        margin-top: ${n_para};
        margin-bottom: ${n_para};
      }  

      .VERBATIM {
        padding-left:0em;
        padding-right:0em;
        line-height: 1;
      }

      .PARA {
        margin-top: ${n_para};
        margin-bottom: ${n_para};
      }

      .PACK {
        margin-top: ${n_pack};
        margin-bottom: ${n_pack};
      }

      .PARA.DT.FIRST {
        margin-bottom: ${n_pack};
      }

      .DL > .DD {
        margin-left: 0;
        padding-left: 1.15cm;
      }

      .HL {
        list-style: none;
        padding-left: 0;
      }

      .OL {
        padding-left: 0.55cm;
      }

      .UL {
        padding-left: 0.55cm;
      }

      .TH, TD {
        padding: 0.1em 0.6em;
      }

      ruby {
        line-height: 1;
        ruby-position: over;
        ruby-align: space-between;
      }

      rt {
        display: inline-block;
        font-size: 35%;
        ruby-align: space-between;
      }

      .PART, .CHAPTER, .SECTION, .SUBSECTION, .SUBSUBSECTION, .PRIMARY {
        clear: both;
      }
    `;
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
}
module.exports = { NitrilePreviewHtml };
