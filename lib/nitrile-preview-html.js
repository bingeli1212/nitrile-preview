'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { NitrilePreviewDiagramSVG } = require('./nitrile-preview-diagram-svg');
const const_partnums = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'IIX', 'IX', 'X'];
const const_subfignums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const path = require('path');
const demo_svg1 = `\
<?xml version="1.0" standalone="no"?>
  <svg viewBox="0 0 600 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" 
   onmouseup="mouseup(this)" onmousemove="mousemove(this)">
    <desc>Example script01 - invoke an ECMAScript function from an onclick event
    </desc>
    <!-- ECMAScript to change the radius with each click -->
    <script type="application/ecmascript"> <![CDATA[
      var tid;
      var tx=NaN;
      var ty=NaN;
      var telemx=NaN;
      var telemy=NaN;
      var ismousedown=0;
      function mousemove(svg){
        if(ismousedown){
          var ex = event.clientX;
          var ey = event.clientY;
          console.log("mousemove",event.clientX,event.clientY,ismousedown);
          var rx = (+ex-tx)/svg.getBoundingClientRect().width;
          var ry = (+ey-ty)/svg.getBoundingClientRect().height;
          var viewBox = svg.getAttribute("viewBox");
          var [vx,vy,vw,vh] = viewBox.split(" ").map(s => s.trim()).map(s => parseFloat(s));
          var dx = Math.round(vw*rx);
          var dy = Math.round(vh*ry);
          if(Number.isFinite(dx)&&Number.isFinite(dy)){
            var telem = document.getElementById(tid);
            if(telem){
              telem.setAttribute("data-translatex",+telemx+dx);
              telem.setAttribute("data-translatey",+telemy+dy);
              set_transform_attribute(telem);
            }
          }
          console.log(vx,vy,vw,vh,ex,ey,tx,ty,rx,ry,dx,dy);
        }
      }
      function mousedown(svg){
        tx = event.clientX;
        ty = event.clientY;
        //this is only going to be rect/polygon/circle
        telemx = svg.getAttribute("data-translatex")||0;
        telemy = svg.getAttribute("data-translatey")||0;
        tid = svg.id;
        console.log("mousedown",tx,tx,telemx,telemy,tid)
        ismousedown=1;
      }
      function mouseup(svg){
        console.log("mouseup",event.clientX,event.clientY);
        ismousedown=0;
      }
      function click(rect) {
        tx=event.clientX;
        ty=event.clientY;
        elemX = rect.getAttribute("x");
        elemY = rect.getAttribute("y");
        console.log("click",tx,ty,elemX,elemY);
        tid=rect.id;
        if(event.altKey){
          var rotation = parseFloat(rect.getAttribute("data-rotation"))||0;
          if(event.ctrlKey){
            rotation -= 5;
          }else{
            rotation += 5;
          }
          rect.setAttribute("data-rotation",rotation);
          set_transform_attribute(rect);
          event.preventDefault();   
        }
      }
      function set_transform_attribute(elem){
        var centerx = parseFloat(elem.getAttribute("data-centerx"))||0;
        var centery = parseFloat(elem.getAttribute("data-centery"))||0;
        var rotation = parseFloat(elem.getAttribute("data-rotation"))||0;
        var translatex = parseFloat(elem.getAttribute("data-translatex"))||0;
        var translatey = parseFloat(elem.getAttribute("data-translatey"))||0;
        elem.setAttribute("transform", "translate("+(translatex)+","+(translatey)+") translate("+(centerx)+","+(centery)+") rotate("+(rotation)+") translate("+(-centerx)+","+(-centery)+")");  
      }
    ]]> </script>
    <!-- Outline the drawing area with a blue line -->
    <rect x="1" y="1" width="598" height="498" fill="none" stroke="blue"/>
    <!-- Act on each click event -->
    <rect id="my1" onclick="click(this)" onmousedown="mousedown(this)" x="100" y="100" width="100" height="100" data-centerx="150" data-centery="150"     stroke="blue" stroke-width="20" fill="none"/>
    <rect id="my2" onclick="click(this)" onmousedown="mousedown(this)" x="150" y="150" width="100" height="100" data-centerx="200" data-centery="200"     stroke="brown" stroke-width="20" fill="none"/>
    <text id="my3" onclick="click(this)" onmousedown="mousedown(this)" x="250" y="250" data-centerx="250" data-centery="250"  stroke="none" fill="gray" font-size="30pt">Hello World</text>
    <text x="300" y="480" font-family="Verdana" font-size="35" text-anchor="middle">
      Click on circle to change its size
    </text>
  </svg>`;
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
    this.svgs = [];
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
    this.button_color_1 = '#476fc7';
    this.button_color_2 = '#ae241c';
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
    //this.padding_td = '0.215em 0.4252em';
    ///nitrile-preview-view
    this.view = null;
    ///config parameters
    this.html_caption_align = 'c';
    this.html_caption_small = 1;
    this.html_samp_small = 1;
    this.html_line_paddingleft = '2em';
    this.html_line_small = 1;
    ///default css map
    this.add_css_map_entry(this.css_map,
      'PART, CHAPTER, SECTION, SUBSECTION, SUBSUBSECTION, PRIMARY, SECONDARY', [
        'clear: both'
      ]
    );
    this.add_css_map_entry(this.css_map,
      'BUTTON', [
        'background-color: transparent',
        'font-size: 6px',
        'padding: 0',
        'user-select: none',
        'touch-action: manipulation',
        'min-width:  10px',
        'min-height: 10px',
        'max-width:  10px',
        'max-height: 10px',
        'margin-top: auto',
        'margin-bottom: auto',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'REF', [
        'color: inherit',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'URL', [
        'font-family:monospace',
        'word-break:break-all',  
      ]
    );
    this.add_css_map_entry(this.css_map,
      'VERB', [
        'font-family:monospace',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'STEPROW', [
        'display: block',
        'margin-top: 0.30em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'PLSTROW', [
        'display: inline-flex',
        'justify-content: flex-start'
      ]
    );
    this.add_css_map_entry(this.css_map,
      'BODYROW', [
        'display: inline-flex',
        'justify-content: flex-start'
      ]
    );
    this.add_css_map_entry(this.css_map,
      'EQUATIONROW', [
        'display: flex',         
        'flex-direction: row',
        'align-items: center',
        'align-content: flex-start',
        'flex-wrap: wrap',
        'justify-content: center',
        'width: 100%',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FIGUREROW', [
        'display: flex',         
        'flex-direction: row',
        'align-items: baseline',
        'align-content: flex-start',
        'justify-content: center',
        'column-gap: 0.2em',
        'row-gap: 0.1em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'COLUMNROW', [
        'display: flex',         
        'flex-direction: row',
        'align-items: flex-end',
        'justify-content: flex-start',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'PARAGRAPHCOLUMN', [
        'display: flex',         
        'flex-direction: row',
        'align-items: flex-start',
        'justify-content: flex-start',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'COLUMN', [
        'break-after: column',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SUBGRID', [
        'display: grid',
        'grid-column-gap: 0.33em',
        'grid-row-gap: 0.33em',
        'align-items: end'
      ]
    );
    this.add_css_map_entry(this.css_map,
      'LINE', [
        'text-align: left',
        'position: relative',
        'display: block'
      ]
    );
    this.add_css_map_entry(this.css_map,
      'DMATH', [
        'display: flex',
        'flex-direction: row',
        'justify-content: center',
        'width: 100%',
        'text-indent: initial',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FML', [
        'text-align: left'
      ]
    );
    this.add_css_map_entry(this.css_map,
      'VTM', [
        'text-align: left',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'TAB', [
      ]
    );
    this.add_css_map_entry(this.css_map,
      'PAR', [
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FIGCAPTION', [
        'font-size: smaller',
        'text-align: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SUBTITLE', [
        'font-size: smaller',
        'text-align: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SAMP', [
        'word-break: break-all',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SAND', [
        'word-break: break-all',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FIGURE', [
        'page-break-inside: avoid',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'TOC', [
        'font-size: 1.68em',
        'font-weight: 530',
      ]      
    );
    this.add_css_map_entry(this.css_map,
      'COVE', [
        'padding-left: 30pt',
        'position: relative',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'CAVE', [
        'text-align: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'LAVE', [
        'padding-left: 20pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'DD', [
        'margin-left: 0',
        'padding-left: 20pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'OL', [
        'padding-left: 20pt',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'UL', [
        'padding-left: 20pt',
      ]
    );
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_part(title,style){
    const cls = ('PART');
    const css = this.css(cls);
    return(`<h1 id='${style.label}' data-row='${style.row}' class='${cls}' style='${css}' > Part ${style.partnum} &#160; ${this.uncode(style,title)} </h1>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_chapter(title,style){
    const cls = ('CHAPTER');
    const css = this.css(cls);
    return(`<h1 id='${style.label}' data-row='${style.row}' class='${cls}' style='${css}' > ${style.chapnum} &#160; ${this.uncode(style,title)} </h1>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_section(title,style){
    const cls = ('SECTION');
    const css = this.css(cls);
    if(style.chapnum){
      var leader = ""+style.chapnum+"."+style.level;
    }else{
      var leader = style.level;
    }
    if(style.hdgn==1){
      return(`<h2 id='${style.label}' data-row='${style.row}' class='${cls}' style='${css}' > ${leader} <span title='${style.note}:${1+style.row}'>${this.uncode(style,title)}</span> </h2>`);
    }else if(style.hdgs==2){
      return(`<h3 id='${style.label}' data-row='${style.row}' class='${cls}' style='${css}' > ${leader} <span title='${style.note}:${1+style.row}'>${this.uncode(style,title)}</span> </h3>`);
    }else{
      return(`<h4 id='${style.label}' data-row='${style.row}' class='${cls}' style='${css}' > ${leader} <span title='${style.note}:${1+style.row}'>${this.uncode(style,title)}</span> </h4>`);
    }
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
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
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
    var sep = ' &#160; ';
    var text = this.join_para(item.body);
    var text = this.uncode(style,text);
    var css = this.css('LI');
    if(key){
      if(keytype=='var'){
        text = `<strong>${this.literal_to_var(style,key)}</strong>${sep}${text}`;
      }else if(keytype=='verb'){
        text = `<strong>${this.literal_to_verb(style,key)}</strong>${sep}${text}`;
      }else if(keytype=='quotation'){
        text = `<strong>${this.literal_to_quotation(style,key)}</strong>${sep}${text}`;
      }else{
        text = `<strong>${this.polish(style,key)}</strong>${sep}${text}`;
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
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    o.push('</li>')
    return o.join('\n\n')
  }
  itemize_to_text(style,itemize,cls_para=''){
    var bull = itemize.bull;
    var items = itemize.items;
    var nblank = itemize.nblank;
    var style = {...style};///make a copy because we will be modifying it
    var o = [];
    switch (bull) {
      case 'DL': {
        var css = this.css(`DL ${cls_para}`);
        if(cls_para){
          var css = this.to_fontstyled_css(css,style);
          var css = this.to_fontsized_css(css,style);
        }
        o.push(`<dl class='DL ${cls_para}' style='${css}' data-row='${style.row}' >`);
        items.forEach((item,j) => {
          style.row = item.row;
          let text = this.item_dl_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push(`</dl>`)
        break;
      }
      case 'OL': {
        var css = this.css(`OL ${cls_para}`);
        if(cls_para){
          var css = this.to_fontstyled_css(css,style);
          var css = this.to_fontsized_css(css,style);
        }
        o.push(`<ol class='OL ${cls_para}' style='${css}' data-row='${style.row}' >`);
        items.forEach((item,j) => {
          style.row = item.row;
          let text = this.item_ol_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push('</ol>')
        break;
      }
      case 'UL': {
        var css = this.css(`UL ${cls_para}`);
        if(cls_para){
          var css = this.to_fontstyled_css(css,style);
          var css = this.to_fontsized_css(css,style);
        }
        o.push(`<ul class='UL ${cls_para}' style='${css}' data-row='${style.row}' >`);
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
    while(line && line.length){
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
  smooth (style,line) {
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
    safe = this.rubify_cjk(style,safe);
    return safe;
  }
  /////////////////////////////////////////////////////////////////////
  //
  // fence translator functions
  //
  /////////////////////////////////////////////////////////////////////
  fence_to_fml(style,ss,ssi) {
    var str = ss.join('\n');
    var used = new Set();
    var img = this.tokenizer.to_align_math(str,style,used,1);
    var itm = {};
    var subtitle = this.to_fig_subtitle(style);
    var s_style = this.css('SUBTITLE');
    itm.img = img;
    itm.fig  = `\n<table class='COLUMN    FML' style='${this.css("COLUMN    FML")}' cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${s_style}' > ${subtitle} </caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
    itm.par  = `\n<table class='PARAGRAPH FML' style='${this.css("PARAGRAPH FML")}' cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${s_style}' > ${subtitle} </caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
    itm.style = style;
    itm.subtitle = subtitle;
    return itm;
  }
  fence_to_ink(style,ss,ssi){
    if(1){
      let npara = ss.length;
      let extra_dy = 0.85;//pt  
      let extra_dx = 3.52;//pt  
      let all = [];
      all.push( `<text style="font-family:monospace;white-space:pre;font-size:10pt;" fill="currentColor" stroke="none" text-anchor="start" x="${extra_dx*this.PT_TO_MM}mm" y="0" >` );
      ss.forEach((s,i,arr) => {
        if(s=='\\\\'){
          s = String.fromCodePoint(0x00B6);
        }else{
          s = this.polish(style,s);
          s = this.replace_blanks_with(s,'&#160;');
        }
        all.push( `<tspan y="${(i+extra_dy)*10*this.PT_TO_MM}mm" x="${extra_dx*this.PT_TO_MM}mm">${s}</tspan>` );
      });
      all.push( `</text>`);
      var svgtext = all.join('\n');    
    }
    var itm = {};
    var [viewport_width,viewport_height,viewport_unit] = this.g_to_viewport_array(style);
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    var width = this.g_to_width_float(style);
    var height = this.g_to_height_float(style);
    if(width && height){
      itm.width = width;
      itm.height = height;
    }else if(width){
      itm.width = width;
      itm.height = (viewport_height/viewport_width)*(width);
    }else if(height){
      itm.height = height;
      itm.width = (viewport_width/viewport_height)*(height);
    }else{
      itm.width = inkwidth;
      itm.height = inkheight;
    }
    itm.vw = inkwidth*this.MM_TO_PX;
    itm.vh = inkheight*this.MM_TO_PX;
    ///border
    if(style.frame){
      itm.border = 'thin solid currentColor';
    }else{
      itm.border = '';
    }
    var s_style = this.css('SUBTITLE');
    var subtitle = this.to_fig_subtitle(style);
    var svg  = `\n<svg data-bundle="INK" data-label="${style.label}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="none" viewBox="0 0 ${this.fix(itm.vw)} ${this.fix(itm.vh)}" >${svgtext}</svg>\n`;
    var { imgsrc, imgid } = this.to_request_svgid(svg);
    var img = `<img style="border:${itm.border};width:${itm.width}mm;height:${itm.height}mm" src="${imgsrc}" id="${imgid}" onload="img_onload(this)"/>`;
    itm.img = img;
    itm.fig  = `\n<table class='COLUMN    INK' style='${this.css("COLUMN    INK")}' cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${s_style}' > ${subtitle} </caption>\n<tr><td>${img}</td></tr>\n</table>`;
    itm.par  = `\n<table class='PARAGRAPH INK' style='${this.css("PARAGRAPH INK")}' cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${s_style}' > ${subtitle} </caption>\n<tr><td>${img}</td></tr>\n</table>`;
    itm.style = style;
    itm.subtitle = subtitle;
    //var s_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}" >${img}</svg>`;
    //img = `<object class='INK' style='${css}' width='${w}' height='${h}' data='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}'></object>`;
    return itm;
  }
  fence_to_dia(style,ss,ssi){
    var type = style.type;
    var colors = this.string_to_array(style.colors);
    var itm = this.diagram.to_diagram(style,ss);
    // var s_svg = `<svg width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}" >${p.svgtext}</svg>`;
    //var img = `<object class="DIA" style="${css}" width="${p.vw}" height="${p.vh}" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}" ></object>`;
    var [viewport_width,viewport_height,viewport_unit] = this.g_to_viewport_array(style);
    var unit = viewport_unit;
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    itm.vw = Math.round(inkwidth*this.MM_TO_PX);
    itm.vh = Math.round(inkheight*this.MM_TO_PX);
    var width = this.g_to_width_float(style);
    var height = this.g_to_height_float(style);
    if(width && height){
      itm.width = width;
      itm.height = height;
    }else if(width){
      itm.width = width;
      itm.height = viewport_height/viewport_width*width;
    }else if(height){
      itm.height = height;
      itm.width = viewport_width/viewport_height*height;
    }else{
      itm.width = inkwidth;//mm
      itm.height = inkheight;//mm
    }
    var s_style = this.css("SUBTITLE");
    var subtitle = this.to_fig_subtitle(style,itm.subtitle);
    if(type=='canvas'){
      // var imgwidget = `<img style="position:relative;visibility:hidden;width:${p.width}mm;height:${p.height}mm;" width="${p.vw}" height="${p.vh}" src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}" id="${imgid}" onload="img_onload(this)"/>`;
      var border = style.frame?'thin solid currentColor':'';
      var imgwidget = itm.img;
      var imgid = itm.imgid;
      var datalist = `<datalist id='${imgid}-datalist'> ${colors.map(s=>"<option>"+s+"</option>").join("")} </datalist>`;
      var formwidget = `<form action='/action.php' method='post' class='CANVASPALETTE' style='z-index:2;position:absolute;top:100%;left:0;visibility:hidden;' data-imgid='${imgid}' id='${imgid}-form' onreset='form_onreset(this)' onsubmit='form_onsubmit(this)' ><input class='CANVASSUBMIT' type='submit'/><input class='CANVASRESET' type='reset'/><button type='button' data-imgid='${imgid}' onclick='canvas_onplus(this)'>+</button><button type='button' data-imgid='${imgid}' onclick='canvas_onminus(this)'>&#x2212;</button><input class='CANVASCOLOR' type='color' value='#476fc7' onchange='canvas_oncolorchange(this)' data-imgid='${imgid}' id='${imgid}-colorinput' list='${imgid}-datalist' /> ${datalist} </form>`;
      var canvaswidget = `<canvas style='border:${border};position:absolute;z-index:1;width:${itm.width}mm;height:${itm.height}mm;left:0;right:0;top:0;bottom:0;' width='${itm.vw}' height='${itm.vh}' onmouseenter="canvas_onmouseenter(this)" onmouseleave="canvas_onmouseleave(this)" onmousedown="canvas_onmousedown(this)" onmousemove="canvas_onmousemove(this)" onmouseup="canvas_onmouseup(this)" ontouchstart="canvas_ontouchstart(this)" ontouchmove="canvas_ontouchmove(this)" ontouchend="canvas_ontouchend(this)" ontouchcancel="canvas_ontouchcancel(this)" onfocusin="canvas_onfocusin(this)" onfocusout="canvas_onfocusout(this)" onkeydown="canvas_onkeydown(this)" data-imgid='${imgid}' data-paletteid='${imgid}-palette' data-colorinputid='${imgid}-colorinput' id='${imgid}-canvas' data-type='${type}' data-unit='${unit}' tabIndex='1' > </canvas>`;
      var img = `<div class='CANVASFORM' style='position:relative;' data-imgsrc='' data-imgid='${imgid}' data-paletteid='${imgid}-palette' > ${canvaswidget} ${formwidget} ${imgwidget} </div>`
      itm.img  = img;
      itm.fig  = `\n<table class="COLUMN    DIA" style="${this.css("COLUMN    DIA")}" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${s_style}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
      itm.par  = `\n<table class="PARAGRAPH DIA" style="${this.css("PARAGRAPH DIA")}" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${s_style}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
    }else if(type=='ball'){
      var svg = itm.svg;
      var objectwidget = `<object style="border:${border};width:${itm.width}mm;height:${itm.height}mm" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}"></object>`;
      var img = objectwidget;
      itm.img  = img;
      itm.fig  = `\n<table class="COLUMN    DIA" style="${this.css("COLUMN    DIA")}" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${s_style}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
      itm.par  = `\n<table class="PARAGRAPH DIA" style="${this.css("PARAGRAPH DIA")}" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${s_style}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
    }else if(type=='demo'){
      var demo_svg = demo_svg1;
      var objectwidget = `<object style="border:${border};width:${itm.width}mm;height:${itm.height}mm" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(demo_svg)}"></object>`;
      var img = objectwidget;
      itm.img  = img;
      itm.fig  = `\n<table class="COLUMN    DIA" style="${this.css("COLUMN    DIA")}" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${s_style}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
      itm.par  = `\n<table class="PARAGRAPH DIA" style="${this.css("PARAGRAPH DIA")}" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${s_style}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
    }else{
      var img = itm.img;//original image from diagram-svg.js
      itm.fig  = `\n<table class="COLUMN    DIA" style="${this.css("COLUMN    DIA")}" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${s_style}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
      itm.par  = `\n<table class="PARAGRAPH DIA" style="${this.css("PARAGRAPH DIA")}" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${s_style}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
    }
    itm.style = style;
    itm.subtitle = subtitle;
    return itm;
  }
  fence_to_tab(style,ss,ssi) {
    var ff = this.g_to_fontstyle_array(style);
    var fs = this.g_to_fontsize_string(style);
    var {rows} = this.ss_to_tabular_rows(style,ss,ssi);
    rows.forEach((pp,j) => {
      pp.forEach((p,i) => {
        p.text = this.uncode(style,p.raw);
        if(style.head && j==0){
          p.text = `<b>${p.text}</b>`;
          p.text = this.to_fontsized_text(p.text,fs);
        }else{ 
          p.text = this.to_fontstyled_text(p.text,ff[i]);
          p.text = this.to_fontsized_text(p.text,fs);
        }
      })
    })
    var hew = parseInt(style.hew)||1;
    var n = rows.length?rows[0].length:1;
    var ww = this.halign_to_html_ww(n,style.textalign);
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    var all = [];
    if(1){//colgroup has to come before everything else after caption
      let s = '';
      if(style.side){
        let s1 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).slice(0,1).join('\n');
        let s2 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).slice(1).join('\n');
        s = `<colgroup>\n${s1}\n</colgroup>\n<colgroup>\n${s2}\n</colgroup>`;      
      }else{
        let s2 = ww.map((x,i,arr) => `<col width='${x.pw}'/>`).join('\n');
        s = `<colgroup>\n${s2}\n</colgroup>`;
      }
      if(hew>1){
        let s0 = s;
        for(let i=1; i < hew; ++i){
          s += `\n<colgroup><col width='${this.MM_TO_PX}'/></colgroup>\n`;
          s += s0;
        }
      }
      all.push(s);
    }    
    if(style.head && rows.length){
      let pp = rows.shift();
      all.push(`<thead>`);
      all.push(`<tr>`)
      let ss = pp.map((p,i) => {
        let {raw,text} = p;
        let td_padding = this.css('TH'); //these settings are chosen to match those of beamer and creamer
        let css = `padding:${td_padding};text-align:${ww[i].ta}`;
        return(`<th class='TH' style='${css}' > ${text} </th>`);
      });
      let s = ss.join('\n');
      if(hew>1){
        let s0 = s;
        for(let i=1; i < hew; ++i){
          s += `\n<td style='border-left:solid;border-right:solid'></td>\n`
          s += s0;
        }
      }
      all.push(s);
      all.push('</tr>');
      all.push('</thead>');
    }
    if(1){
      let hrules = this.string_to_int_array(style.hrules);
      let vrules = this.string_to_int_array(style.vrules);
      all.push(`<tbody>`);
      let ss = rows.map((pp,j,arrj) => {
        let ss = pp.map((p,i,arri) => {
          let {raw,text} = p;
          let td_padding = this.css('TD'); //these settings are chosen to match those of beamer and creamer
          let css = `padding:${td_padding};text-align:${ww[i].ta}`;
          let color = '';
          if(cellcolor_map.has(raw)){
            color = cellcolor_map.get(raw);
          }
          if(style.side && i == 0){
            //do not color the side column
            color = '';
          }
          if(color){
            css += `; background-color:${color}`
          }
          if(i+1==arri.length){
          }else{
            if(vrules.indexOf(i+1)>=0){
              css += `;border-right:thin solid`;
            }
          }
          if(j+1==arrj.length){
          }else{
            if(hrules.indexOf(j+1)>=0){
              css += `;border-bottom:thin solid`;
            }
          }
          return(`<td class='TD' style='${css}' > ${text} </td>`); 
        });
        let s = ss.join('\n');
        return s;
      });
      let m = 0;
      let m0 = ss.length;
      if(hew>1){
        m = Math.floor(ss.length/hew);//number of rows for all columns
        m0 = ss.length - m*(hew-1);///number of rows for the first column
      }
      let i = 0;
      let k = m0;
      let ss1 = ss.slice(i,k);
      i+=m0, k+=m;
      while(i < ss.length){
        let ss2 = ss.slice(i,k);
        ss1 = ss1.map((s,j,arr) => {
          s += `\n<td style='border-left:solid;border-right:solid'></td>\n`
          if(j < ss2.length){
            s += ss2[j];
          }else{
            s += `<td colspan='${n}'></td>`
          }
          return s;
        });
        i+=m, k+=m;
      }
      ss1 = ss1.map((s) => `<tr>\n${s}\n</tr>`)
      let s = ss1.join('\n');
      all.push(s);
      all.push(`</tbody>`);
    }
    var text = all.join('\n');
    var frame = '';
    if(style.frame=='hsides'){
      frame=`frame='hsides'`;
    }else if(style.frame){
      frame=`frame='box'`;   
    }
    var rules = (style.rules)?`rules='${style.rules}'`:``;
    var itm = {};
    var subtitle = this.to_fig_subtitle(style);
    var fontsize_css = '';
    let s_style = this.css('SUBTITLE');
    let t_style = `${s_style};text-align:left`;
    itm.fig  = `<table class='COLUMN    TAB' style='${this.css("COLUMN    TAB")};${fontsize_css}' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${s_style}'>${subtitle}</caption>                      \n${text}\n</table>`;
    itm.par  = `<table class='PARAGRAPH TAB' style='${this.css("PARAGRAPH TAB")};${fontsize_css}' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >                                                                                                         \n${text}\n</table>`;
    itm.tab  = `<table class='          TAB' style='${this.css("          TAB")};${fontsize_css}' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${t_style}'>${this.to_tab_subcaptions(style)}</caption>\n${text}\n</table>`;
    itm.img  = ``;
    itm.style = style;
    itm.subtitle = subtitle;
    return itm;
  }
  fence_to_par(style,ss,ssi){
    ss = this.ss_to_backslashed_ss(style,ss);
    ss = ss.map(s => this.to_fontstyled_text(s,style.fontstyle));
    ss = ss.map(s => this.to_fontsized_text(s,style.fontsize));
    var css_width = '';
    var text = '';
    if(style.width){
      text = ss.join('<br/>');
      css_width = `width:${style.width}mm`;
    }else{
      text = ss.join('<br/>');
    }
    var frame = '';
    var rules = '';
    var itm = {};
    var subtitle = this.to_fig_subtitle(style);
    var talign = 'left';
    if(style.textalign=='c'){
      talign = 'center';
    }else if(style.textalign=='r'){
      talign = 'right';
    }
    var fontsize_css = '';
    var text = `<span style='margin-left:auto;margin-right:auto;display:inline-block;${css_width};text-align:${talign};'> ${text} </span>`;
    var s_style = this.css('SUBTITLE');
    itm.fig  = `\n<table class='COLUMN    PAR' style='${this.css("COLUMN    PAR")};${fontsize_css}' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${s_style}'>${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td style='vertical-align:bottom;'>${text}</td></tr></tbody>\n</table>`;
    itm.par  = `\n<table class='PARAGRAPH PAR' style='${this.css("PARAGRAPH PAR")};${fontsize_css}' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >\n                                                                                 \n<colgroup/><thead/><tbody><tr><td style='vertical-align:bottom;'>${text}</td></tr></tbody>\n</table>`;
    itm.img = '';
    itm.subtitle = subtitle;
    itm.style = style;
    return itm;
  }
  fence_to_vtm(style,ss,ssi){
    var ss = ss.map(x => x.trimEnd());
    var ss = ss.map(x => x?this.polish_verb(style,x):'&#160;');
    var ss = ss.map(x => `<span><code>${x}</code></span>`);
    var text = ss.join('<br/>\n');
    var frame = '';
    var rules = '';
    var itm = {};
    var subtitle = this.to_fig_subtitle(style);
    var s_style = this.css('SUBTITLE');
    var fontsize_css = '';
    itm.ss = ss;
    itm.fig = `\n<table class='COLUMN    VTM' style='${this.css("COLUMN    VTM")};${fontsize_css}' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${s_style}'>${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    itm.par  = `\n<table class='PARAGRAPH VTM' style='${this.css("PARAGRAPH VTM")};${fontsize_css}' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >\n                                                                                 \n<colgroup/><thead/><tbody><tr><td>${text}</td></tr></tbody>\n</table>`;
    itm.img = '';
    itm.style = style;
    itm.subtitle = subtitle;
    return itm;
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
  to_caption_text(style,title,capid,splitid,captext){
    var caption_text = this.uncode(style,title).trim();
    var s_style = '';
    if(this.html_caption_align=='l'){                               
      s_style += ';text-align:left';
    }else if(this.html_caption_align=='r'){
      s_style += ';text-align:right';
    }else{
      s_style += ';text-align:center';
    }
    var splitid = splitid||'';
    if(Number.isFinite(splitid)){
      splitid = this.int_to_letter_a(splitid);
    }
    var lead = `${captext} ${capid}${splitid} : ${caption_text}`;
    var css = this.css('FIGCAPTION');
    return `<figcaption class='FIGCAPTION' style='${css};${s_style}' >${lead} </figcaption>`;
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
      // if(this.imgs.indexOf(imgsrc) < 0){
        this.imgs.push(imgsrc);
      // }
      var imgid = `image${this.imgs.length}`;
      return {imgsrc, imgid};
    }
  }
  to_request_svgid(svg){
    this.svgs.push(svg);
    var imgid = `svg${this.svgs.length}`;
    var imgsrc = `data:image/svg+xml;charset:UTF-8,${encodeURIComponent(svg)}`;
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
    let s = this.polish(style,cnt);
    s = `<span class='VERB' style='${this.css("VERB")}'>${s}</span>`;
    return s;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_math(style,cnt){
    var used = new Set();
    var text = this.tokenizer.to_literal_math(cnt,style,used,0);
    return text;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_dmath(style,cnt){
    var used = new Set();
    var text = this.tokenizer.to_literal_math(cnt,style,used,1);//this is a SVG
    var css = this.css('DMATH')
    var text = `<span class='DMATH' style='${css}'> ${text} </span>`
    return text;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_strong(style,cnt){
    var ss = cnt.split('/');
    var ss = ss.map((s) => {return this.polish(style,s)});
    var ss = ss.map((s) => `<strong>${s}</strong>`);
    return ss.join('/');
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
  literal_to_span(key,style,cnt){
    cnt = this.uncode(style,cnt);
    if(key=='em'){
      return `<em>${cnt}</em>`
    }else{
      return `<span>${cnt}</span>`;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_quotation(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<q>${cnt}</q>`;
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
  phrase_to_tt(style,cnt){
    cnt = this.uncode(style,cnt);
    return `<tt>${cnt}</tt>`
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
  phrase_to_br(style,cnt){
    return `<br/>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_ref(style,cnt){
    var label = cnt;
    var ref_css = this.css('REF');
    if(label){
      if(this.parser.label_map.has(label)){
        let blk = this.parser.label_map.get(label);
        var text = '';
        if(blk.style.name=='chapter'){          
          text = blk.style.chapnum;
        }else if(blk.style.name=='heading'){
          text = blk.style.level;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.style.name=='figure'){
          text = blk.style.fignum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.style.name=='listing'){
          text = blk.style.lstnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.style.name=='table'){
          text = blk.style.tabnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }else if(blk.style.name=='equation'){
          text = blk.style.eqnnum;
          if(blk.style.chapnum){
            text = blk.style.chapnum+"."+text;
          }
        }
        var saveas = blk.style.saveas;
        text = `<a style='${ref_css}' href='${saveas}#${label}'>${text}</a>`;
        return text;
      }else{
        return `<s style='${ref_css}' >${this.smooth(style,label)}</s>`;
      }
    }
    return "??";
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_url(style,cnt){
    return `<span class='URL' style='${this.css("URL")}'>${this.smooth(style,cnt)}</span>`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_link(style,cnt,anchor){
    if(anchor){
      return `<a href='${cnt}'>${this.smooth(style,anchor)}</a>`
    }else{
      return `<a href='${cnt}'>${cnt}</a>`
    }
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
      var wd = ""+cnt+"em";
    }else{
      var wd = '1em';
    }
    return `<span style='display:inline-block;box-sizing:border-box;border:1px solid currentColor;padding:1px;width:${wd};'> &#160; </span>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_hrule(style,cnt){
    var i = cnt.indexOf(' ');
    if(i<0){
      if(cnt){          
        var wd = ""+cnt+"em";
      }else{
        var wd = "1em";
      }
      var s = '&#160;';
    }else{
      var wd = cnt.slice(0,i);
      var s = cnt.slice(i+1);
      if(wd){          
        wd = wd+"em";
      }else{
        wd = "1em";
      }
      s = s.trim();
      s = this.uncode(style,s);
      if(!s){
        s = '&#160;';
      }
    }
    return `<span style='display:inline-block;box-sizing:border-box;border-bottom:thin solid currentColor;padding:1px;min-width:${wd};text-align:center;'> ${s} </span>`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_dia(style,cnt){
    var text = '';
    if(style['$'].buffers.hasOwnProperty(cnt)){
      let {ss,g} = style['$'].buffers[cnt];
      var p = this.diagram.to_diagram(g,ss);
      text = p.img;
    }
    return text;
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
    s = s.trimStart();
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
  ////////////////////////////////////////////////////////////////////////////////
  //
  // all paragraphs      
  // 
  ////////////////////////////////////////////////////////////////////////////////
  plst_to_text(style,itemize){
    var text = this.itemize_to_text(style,itemize,'PARAGRAPH PLST');
    return text;
  }
  cove_to_text(style,cove){
    if(1){
      let ss = cove.map((p,i,arr) => {
        let s = `<span style='text-align:left' data-row='${p.n}' > ${this.uncode(style,p.text)} </span>`;
        if(i+1==arr.length) {
          return s;
        }else{
          return s+'<br/>';
        }
      })
      var text = ss.join('\n');
    }
    let css = this.css('PARAGRAPH COVE');
    return `<p class='PARAGRAPH COVE' style='${css}' > <span style='position:absolute;left:20pt;'> &#x2023; </span> ${text} </p>`;
  }
  cave_to_text(style,cave){
    if(1){
      let ss = cave.map((p,i,arr) => {
        let s = (`<span style='text-align:center' data-row='${p.n}' > ${this.uncode(style,p.text)} </span>`);
        if(i+1==arr.length) {
          return s;
        }else{
          return s+'<br/>';
        }
      })
      var text = ss.join('\n');
    }
    let css = this.css('PARAGRAPH CAVE');
    return `<p class='PARAGRAPH CAVE' style='${css}' > ${text} </p>`;
  }
  lave_to_text(style,lave){
    if(1){
      let ss = lave.map((p,i,arr) => {
        let s = (`<span style='text-align:left' data-row='${p.n}' > ${this.uncode(style,p.text)} </span>`);
        if(i+1==arr.length) {
          return s;
        }else{
          return s+'<br/>';
        }
      })
      var text = ss.join('\n');
    }
    let css = this.css('PARAGRAPH LAVE');
    return `<p class='PARAGRAPH LAVE' style='${css}' > ${text} </p>`;
  }
  step_to_text(style,step){
    step.forEach((p,i,arr) => {
      p.text = this.uncode(style,p.text);
    });
    var all = [];
    all.push('');
    step.forEach((p,i) => {
      if(i==0){
        all.push(`<li value='${p.value}'> ${p.text} </li>`);
      }else{
        all.push(`<span class='STEPROW' style='${this.css("STEPROW")}'> ${p.text} </span>`);
      }
    });
    var text = all.join('\n');
    return`<ol class='PARAGRAPH STEP OL' style='${this.css("PARAGRAPH STEP OL")}' data-row='${style.row}' > ${text} </ol>`;
  }  
  samp_to_text(style,samp){
    var ss = samp.map((p,i,arr) => {
      let x = p.text;
      x = x.trimEnd();
      if(x.length==0){
        x = '&#160;';
      }else{
        x = this.polish_verb(style,x);
      }
      return `<span data-row='${p.n}'><code>${x}</code></span>`;
    })
    let hew = this.g_to_hew_int(style);
    let n = ss.length;
    let fontsize_css = '';
    if(hew>1){
      let nn = this.to_split_hew(n,hew);
      let all = [];
      let tt = nn.map((nl,j) => {
        let [n1,n2] = nl;
        let ss1 = ss.slice(n1,n2);
        let text1 = ss1.join('<br/>\n');
        return  ( `<span> ${text1} </span>` );
      });
      var text = tt.join('<br/>\n');
      var css = this.css('PARAGRAPH SAMP');
      return `<p class='PARAGRAPH SAMP' style='${css};column-count:${hew};${fontsize_css};' >${text}</p>`;
    }else{
      var text = ss.join('<br/>\n');
      var css = this.css('PARAGRAPH SAMP');
      return`<p class='PARAGRAPH SAMP' style='${css};${fontsize_css};' data-row='${style.row}' >${text}</p>`;
    }
  }
  sand_to_text(style,sand){
    var ss = sand.map((p,i,arr) => {
      let x = p.text;
      x = x.trimEnd();
      if(x.length==0){
        x = '&#160;';
      }else{
        x = this.polish_verb(style,x);
        x = this.to_fontstyled_text(x,style.fontstyle);
      }
      return `<span data-row='${p.n}'>${x}</span>`;
    })
    let hew = this.g_to_hew_int(style);
    let n = ss.length;
    let fontsize_css = '';
    if(hew>1){
      let nn = this.to_split_hew(n,hew);
      let all = [];
      let tt = nn.map((nl,j) => {
        let [n1,n2] = nl;
        let ss1 = ss.slice(n1,n2);
        let text1 = ss1.join('<br/>\n');
        return  ( `<span> ${text1} </span>` );
      });
      var text = tt.join('<br/>\n');
      var css = this.css('PARAGRAPH SAND');
      return `<p class='PARAGRAPH SAND' style='${css};column-count:${hew};${fontsize_css};' > ${text} </p>`;
    }else{
      var text = ss.join('<br/>\n');
      var css = this.css('PARAGRAPH SAND');
      return `<p class='PARAGRAPH SAND' style='${css};${fontsize_css};' > ${text} </p>`;
    }
  }
  bundle_to_text(style,bundle){
    var itm = this.do_bundle(style,bundle);
    var par = itm.par;
    let css = this.css('PARAGRAPH BUNDLE');
    return `<p class='PARAGRAPH BUNDLE' style='${css}' > ${par} </p>`;
  }
  body_to_text(style,body){
    var text = this.join_para(body);
    var text = this.uncode(style,text);
    var text = `<span data-row='${style.row}' > ${text} </span>`;
    let css = this.css('PARAGRAPH BODY');
    return `<p class='PARAGRAPH BODY' style='${css}' > ${text} </p>`;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  /// float
  ///
  /////////////////////////////////////////////////////////////////////////////
  float_to_primary(title,label,style,body,bodyrow){
    var title = this.uncode(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    title = (`<b>${title}</b> &#160;`)
    let css = this.css('PRIMARY');
    return `<p class='PRIMARY' style='${css}' data-row='${style.row}' > ${title} ${text} </p>`;
  }
  float_to_secondary(title,label,style,body,bodyrow){
    var title = this.uncode(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    title = (`&#x2003;&#x2003;<b><i>${title}</i></b> &#160;`)
    let css = this.css('SECONDARY');
    return `<p class='SECONDARY' style='${css}' data-row='${style.row}' > ${title} ${text} </p>`;
  }
  float_to_equation(title,label,style,bundles){
    var eqnnum = style.eqnnum;
    if(style.chapnum){
      eqnnum = style.chapnum+"."+eqnnum;
    }
    bundles = bundles.filter(bundle => bundle.type=='bundle');
    var css = this.css('EQUATION');
    var all = [];
    all.push(`<figure id='${label}' class='EQUATION' style='${css}' data-row='${style.row}' >`);
    bundles.forEach((bundle,i,arr) => {
      let itm = this.do_bundle(style,bundle,'fml');
      var sub = '';
      if(arr.length>1){
        sub = this.int_to_letter_a(1+i);
      }
      all.push(`<span class='EQUATIONROW' style='${this.css("EQUATIONROW")}'> <span style='margin-left:auto;margin-right:auto'>${itm.img}</span> <span style='font-size:smaller;'> (${eqnnum}${sub}) </span> </span>`);
    })
    all.push(`</figure>`);
    return all.join('\n');
  }
  float_to_figure(title,label,style,bundles){
    var fignum = style.fignum;
    if(style.chapnum){
      fignum = style.chapnum+"."+fignum;
    }
    var splitid = '';
    let itms = this.bundles_to_figure_itms(style,bundles);
    let flex_css = 'display:flex;flex-direction:column;row-gap:0.1em;';
    let subrow_css = this.css('FIGUREROW');
    if(!style.partition){
      subrow_css += ';flex-wrap:wrap';
    }
    let all = [];
    var onerow = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='bundle'){
        let fig = p.fig;
        onerow.push(fig);
      }else if(p.type=='\\\\'){
        let n = onerow.length;
        if(n){
          all.push(`<span class='FIGUREROW' style='${subrow_css}' > ${onerow.join('')} </span>`);
          onerow = [];
        }
      }
    });
    if(onerow.length){
      let n = onerow.length;
      all.push(`<span class='FIGUREROW' style='${subrow_css}' > ${onerow.join('')} </span>`);
    }
    var text = all.join('\n');
    var css = this.css('FIGURE');
    if(style.wrapfig=='right'){
      return `<figure id='${label}' class='FIGURE' style='${css};float:right' data-row='${style.row}' > ${text} </figure>`;
    }else if(style.wrapfig=='left'){
      return `<figure id='${label}' class='FIGURE' style='${css};float:left' data-row='${style.row}' > ${text} </figure>`;
    }else{
      return `<figure id='${label}' class='FIGURE' style='${css};${flex_css}' data-row='${style.row}' > ${this.to_caption_text(style,title,fignum,splitid,'Figure')} ${text} </figure>`;
    }
  }
  float_to_listing(title,label,style,bundles){
    var lstnum = style.lstnum;
    if(style.chapnum){
      lstnum = style.chapnum+"."+lstnum;
    }
    if(style.splitid){
      //if style.splitis set then we will only be interested in outputing the bundle with marching splitid
      bundles = bundles.filter((bundle) => bundle.splitid==style.splitid);
    }
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let splitid = bundle.splitid||0;
      let splitstart = bundle.splitstart||0;
      let ss = bundle.ss.map((s,i,arr) => {
        let ln = (splitstart+i+1);
        s = this.polish(bundle.g,s);
        return `<code class='LINENO' style='position:relative;'><span style='position:absolute;right:calc(100% + 10pt);'>${ln}</span>${s}</code>`;
      });
      var text = ss.join('\n');
      var text = `<pre style='margin-left:10pt'>${text}</pre>`;
      var css = this.css('LISTING'); 
      let s = `<figure class='LISTING' style='${css}' data-row='${style.row}' > ${this.to_caption_text(style,title,lstnum,splitid,'Listing')} ${text} </figure>`;
      all.push(s);
    });
    return all.join('\n');
  }
  float_to_table(title,label,style,bundles){
    var tabnum = style.tabnum;
    if(style.chapnum){
      tabnum = style.chapnum+"."+tabnum;
    }
    if(style.splitid){
      //if style.splitis set then we will only be interested in outputing the bundle with marching splitid
      bundles = bundles.filter((bundle) => bundle.splitid==style.splitid);
    }
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'tab');
      let splitid = bundle.splitid||0;
      var onerow = [];
      onerow.push(itm.tab);
      let flex_css = 'display:flex;flex-direction:column;row-gap:0.1em;';
      let subrow_css = this.css('FIGUREROW');
      let text = (`<span class='FIGUREROW' style='${subrow_css}' > ${onerow.join('')} </span>`);
      let css = this.css('TABLE'); 
      let s = `<figure id='${label}' class='TABLE' style='${css};${flex_css}' data-row='${style.row}' > ${this.to_caption_text(style,title,tabnum,splitid,'Table')} ${text} </figure>`;
      all.push(s);
    });
    return all.join('\n')
  }
  float_to_multicols(title,label,style,bundles){
    var itms = this.bundles_to_figure_itms(style,bundles);
    var itms = itms.filter((p) => (p.type=='bundle'));
    var n = itms.length;
    var all = [];
    all.push(`<figure class='MULTICOLS' style='${this.css("MULTICOLS")};column-count:${n};' data-row='${style.row}' >`);
    itms.forEach((p,j,arr) => {
      let fig = p.fig;
      all.push(fig);
    });
    all.push(`</figure>`);
    return all.join('\n');
  }  
  float_to_lines(title,label,style,bundles){
    var all = [];
    if(bundles.length){
      var bundle = bundles[0];
      var hew = this.g_to_hew_int(bundle.g);
      if(hew<1){
        hew = 1;
      }
      all.push(`<figure class='LINES' style='${this.css("LINES")};column-count:${hew};' data-row='${style.row}' >`);
      bundle.ss.forEach((s,j,arr) => {
        s = this.uncode(bundle.g,s);
        s = this.to_fontstyled_text(s,style.fontstyle);
        s = this.to_fontsized_text(s,style.fontsize);
        if(j+1==arr.length){
          all.push(s);
        }else{
          all.push(s+"<br/>");
        }
      });
      all.push(`</figure>`);
    }
    return all.join('\n');
  }  
  float_to_page(title,label,style,bundles){
    return '';
  }
  float_to_vspace(title,label,style,bundles){
    var all = [];
    var vspace = this.g_to_vspace_float(style);
    all.push('');
    all.push(`<div style='height:${vspace}em'> </div>`);
    return all.join('\n');
  }
  to_fontsized_text(s,fs){
    switch(fs){
      case 'small':
        s = `<small>${s}</small>`;
        break;
    }
    return s;
  }
  to_fontstyled_text(s,f){
    switch(f){
      case 'b': 
      case 'B': 
        return `<b>${s}</b>`;
      case 'i': 
      case 'I': 
        return `<i>${s}</i>`;
      case 's': 
      case 'S': 
        return `<i>${s}</i>`;
      case 't': 
      case 'T': 
        return `<tt>${s}</tt>`;
    }
    return s;
  }
  to_fontstyled_css(css,style){
    let f = this.g_to_fontstyle_string(style);
    switch(f){
      case 'i': 
      case 'I': 
        css = `${css};font-style:italic`;
        break;
    }
    return css;
  }
  to_fontsized_css(css,style){
    let f = this.g_to_fontsize_string(style);
    switch(f){
      case 'small':
        css = `${css};font-size:smaller`;
        break;
    }
    return css;
  }
  to_empty_svg(style){
  }
  to_tab_subcaptions(style){
    var all = [];
    var ss = style.subcaptions.map((p) => {
      if(p[0]){
        var subtitle = `(${p[0]}) ${p[1]}`;
      }else{
        var subtitle = `${p[1]}`;
      }
      return `<span>${this.uncode(style,subtitle)}</span>`;
    })
    return ss.join('<br/>');
  }
}
module.exports = { NitrilePreviewHtml };
