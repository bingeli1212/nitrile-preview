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
    ///icons
    this.icon_cdigits = ['&#x278a;','&#x278b;','&#x278c;','&#x278d;','&#x278e;','&#x278f;','&#x2790;','&#x2791;','&#x2792;','&#x2793;']
    this.icon_bullet       = '&#x2022;'
    this.icon_squareboxo   = '&#x25FB;'
    this.icon_squarebox    = '&#x25A3;'
    this.icon_circleboxo   = '&#x25CB;'
    this.icon_circlebox    = '&#x25CF;'
    this.icon_dag = '&#x2020;'//DAGGER        
    this.icon_hollowbox = '&#x2610;' //BALLOT BOX            
    this.icon_checkedbox = '&#x2612;' //BALLOT BOX WITH X
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
      'DETAILSROW', [
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
      'COLUMN', [
        'break-after: column',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'WRAPLT', [
        'float: left',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'WRAPRT', [
        'float: right',
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
      'FLUSHLEFT', [
        'text-align: left',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'CENTER', [
        'text-align: center',
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
      'VERBATIM', [
        'word-break: break-all',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FIGURE', [
        'page-break-inside: avoid',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'WRAPFIG', [
        'page-break-inside: avoid',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'WRAPTAB', [
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
      'EXAMPLE', [
        'padding-left: 30pt',
        'position: relative',
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
  hdgs_to_part(title,label,style){
    const cls = ('PART');
    const css = this.css(cls);
    return(`<h1 id='${label}' data-row='${style.row}' class='${cls}' style='${css}' > Part ${style.__partnum} ${this.uncode(style,title)} </h1>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_chapter(title,label,style){
    const cls = ('CHAPTER');
    const css = this.css(cls);
    return(`<h1 id='${label}' data-row='${style.row}' class='${cls}' style='${css}' > ${style.__chapnum} ${this.uncode(style,title)} </h1>`);
  }
  /////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  /////////////////////////////////////////////////////////////////////
  hdgs_to_section(title,label,hdgn,level,style){
    const cls = ('SECTION');
    const css = this.css(cls);
    if(style.__chapnum){
      var leader = ""+style.__chapnum+"."+level;
    }else{
      var leader = level;
    }
    if(hdgn==1){
      return(`<h2 id='${label}' data-row='${style.row}' class='${cls}' style='${css}' > ${leader} <span title='${this.polish(style,style.__note)}:${1+style.row}'>${this.uncode(style,title)}</span> </h2>`);
    }else if(hdgn==2){
      return(`<h3 id='${label}' data-row='${style.row}' class='${cls}' style='${css}' > ${leader} <span title='${this.polish(style,style.__note)}:${1+style.row}'>${this.uncode(style,title)}</span> </h3>`);
    }else{
      return(`<h4 id='${label}' data-row='${style.row}' class='${cls}' style='${css}' > ${leader} <span title='${this.polish(style,style.__note)}:${1+style.row}'>${this.uncode(style,title)}</span> </h4>`);
    }
  }
  //////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////
  body_to_checklist(style,ss){
    ss = ss.map(s => this.re_body_is_checklist.exec(s));
    ss = ss.filter(v => (v!==null));
    ss = ss.map(v => `${v[1]?this.icon_checkedbox:this.icon_hollowbox} ${this.uncode(style,v[2])}`);
    return ss.join('<br/>\n');
  }
  body_to_argumentlist(style,ss){
    ss = ss.map(s => this.re_body_is_argumentlist.exec(s));
    ss = ss.filter(v => (v!==null));
    ss.forEach(v => v[1]=this.string_to_argument_pair(v[1]));
    ss = ss.map(v => `${this.icon_bullet} <i>${this.uncode(style,v[1][0])}</i>: ${this.uncode(style,v[1][1])} ${this.uncode(style,v[2])}`);
    return ss.join('<br/>\n');
  }  
  /////////////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////////////
  item_dl_to_text(style,i,item,nblank){
    var o = [];
    if(item.bullet.length==1){
      var term = this.uncode(style,item.term);
    }else{
      var term = this.polish(style,item.term);
    }
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    var css_dt = this.css('DT');
    var css_dd = this.css('DD');
    if(text){
      o.push(`<dt class='DT' style='${css_dt}' data-row='${item.row}' > <b>${term}</b> </dt> <dd class='DD' style='${css_dd}' data-row='${item.row+1}' > ${text} </dd> <dd class='DD' style='${css_dd}' >`);
    }else{
      o.push(`<dt class='DT' style='${css_dt}' data-row='${item.row}' > <b>${term}</b> </dt>                                                                           <dd class='DD' style='${css_dd}' >`);
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
    if(item.bullet=='*'){
      if(item.bullet.length==1){
        var key = this.uncode(style,item.key);
      }else{
        var key = this.polish(style,item.key);
      }  
      o.push(`<li class='LI' style='${css}' type='1'  data-row='${item.row}' value='${item.value}' > <b>${key}</b> &#160; ${text}`);
    }else if(item.type == 'A'){
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
    var text = this.join_para(item.body);
    var text = this.uncode(style,text);
    var css = this.css('LI');
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
        var css = this.css(`${cls_para}`);
        if(cls_para){
          var css = this.to_fontstyled_css(css,style);
          var css = this.to_fontsized_css(css,style);
        }
        o.push(`<dl class='${cls_para}' style='${css}' data-row='${style.row}' >`);
        items.forEach((item,j) => {
          style.row = item.row;
          let text = this.item_dl_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push(`</dl>`)
        break;
      }
      case 'OL': {
        var css = this.css(`${cls_para}`);
        if(cls_para){
          var css = this.to_fontstyled_css(css,style);
          var css = this.to_fontsized_css(css,style);
        }
        o.push(`<ol class='${cls_para}' style='${css}' data-row='${style.row}' >`);
        items.forEach((item,j) => {
          style.row = item.row;
          let text = this.item_ol_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push('</ol>')
        break;
      }
      case 'UL': {
        var css = this.css(`${cls_para}`);
        if(cls_para){
          var css = this.to_fontstyled_css(css,style);
          var css = this.to_fontsized_css(css,style);
        }
        o.push(`<ul class='${cls_para}' style='${css}' data-row='${style.row}' >`);
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
  float_to_hr(title,label,style,splitid,body,bodyrow) {
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
    var fml = this.tokenizer.to_align_math(str,style,used,1);
    var itm = {};
    itm.fml = fml;
    return itm;
  }
  fence_to_img(style,ss,ssi){
    var type = style.type;
    var colors = this.string_to_array(style.colors);
    // var itm = this.diagram.to_diagram(style,ss);
    // var s_svg = `<svg width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}" >${p.svgtext}</svg>`;
    //var img = `<object class="IMG" style="${css}" width="${p.vw}" height="${p.vh}" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}" ></object>`;
    var [viewport_width,viewport_height,viewport_unit] = this.g_to_viewport_array(style);
    var unit = viewport_unit;
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    var vw = Math.round(inkwidth*this.MM_TO_PX);
    var vh = Math.round(inkheight*this.MM_TO_PX);
    var width = this.g_to_width_float(style);
    var height = this.g_to_height_float(style);
    var stretch = this.assert_float(style.stretch,0,0,1);
    if(width && height){
    }else if(width){
      height = viewport_height/viewport_width*width;
    }else if(height){
      width = viewport_width/viewport_height*height;
    }else{
      width = inkwidth;//mm
      height = inkheight;//mm
    }
    if(type=='canvas'){
      var itm = this.diagram.to_diagram(style,ss);
      var imgsrc = this.choose_image_file(itm.images);
      var { imgsrc, imgid } = this.to_request_image(imgsrc);
      var border = style.frame?'thin solid currentColor':'';
      if(stretch){
        var img = `<img style="border:${border};width:${stretch*100}%;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}" onload="img_onload(this)"> </img>`;
      }else{
        var img = `<img style="border:${border};width:${width}mm;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}" onload="img_onload(this)"> </img>`;
      }
      var imgwidget = img;
      var imgid = imgid;
      var datalist = `<datalist id='${imgid}-datalist'> ${colors.map(s=>"<option>"+s+"</option>").join("")} </datalist>`;
      var formwidget = `<form action='/action.php' method='post' class='CANVASPALETTE' style='z-index:2;position:absolute;top:100%;left:0;visibility:hidden;' data-imgid='${imgid}' id='${imgid}-form' onreset='form_onreset(this)' onsubmit='form_onsubmit(this)' ><input class='CANVASSUBMIT' type='submit'/><input class='CANVASRESET' type='reset'/><input type='button' data-imgid='${imgid}' onclick='canvas_onplus(this)' value='+'/><input type='button' data-imgid='${imgid}' onclick='canvas_onminus(this)' value='&#x2212;'/><input class='CANVASCOLOR' type='color' value='#476fc7' onchange='canvas_oncolorchange(this)' data-imgid='${imgid}' id='${imgid}-colorinput' list='${imgid}-datalist' /> ${datalist} </form>`;
      var canvaswidget = `<canvas style='border:${border};position:absolute;z-index:1;width:${width}mm;height:${height}mm;left:0;right:0;top:0;bottom:0;' width='${vw}' height='${vh}' onmouseenter="canvas_onmouseenter(this)" onmouseleave="canvas_onmouseleave(this)" onmousedown="canvas_onmousedown(this)" onmousemove="canvas_onmousemove(this)" onmouseup="canvas_onmouseup(this)" ontouchstart="canvas_ontouchstart(this)" ontouchmove="canvas_ontouchmove(this)" ontouchend="canvas_ontouchend(this)" ontouchcancel="canvas_ontouchcancel(this)" onfocusin="canvas_onfocusin(this)" onfocusout="canvas_onfocusout(this)" onkeydown="canvas_onkeydown(this)" data-imgid='${imgid}' data-paletteid='${imgid}-palette' data-colorinputid='${imgid}-colorinput' id='${imgid}-canvas' data-type='${type}' data-unit='${unit}' tabIndex='1' > </canvas>`;
      itm.img  = `<span style='position:relative;' data-imgsrc='' data-imgid='${imgid}' data-paletteid='${imgid}-palette' > ${canvaswidget} ${formwidget} ${imgwidget} </span>`
    }else if(type=='ball'){
      var itm = this.diagram.to_diagram(style,ss);
      var ballscript = itm.ballscript;
      var svgtext = itm.svgtext;
      var svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}" onmouseup="mouseup(this)" onmousemove="mousemove(this)" preserveAspectRatio="none">${ballscript}${svgtext}</svg>`;
      var { imgsrc, imgid } = this.to_request_svgid(svg);
      var border = style.frame?'thin solid currentColor':'';
      if(stretch){
        var objectwidget = `<object style="border:${border};width:${stretch*100}%;height:auto;" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}"></object>`;
      }else{
        var objectwidget = `<object style="border:${border};width:${width}mm;height:${height}mm" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}"></object>`;
      }
      itm.img  = objectwidget;
    }else if(type=='demo'){
      var itm = this.diagram.to_diagram(style,ss);
      var demo_svg = demo_svg1;
      var border = style.frame?'thin solid currentColor':'';
      if(stretch){
        var objectwidget = `<object style="border:${border};width:${stretch*100}%;height:auto;" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(demo_svg)}"></object>`;
      }else{
        var objectwidget = `<object style="border:${border};width:${itm.width}mm;height:${itm.height}mm" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(demo_svg)}"></object>`;
      }
      itm.img  = objectwidget;
    }else if(type=='ink'){
      var itm = this.ss_to_ink(style,ss,ssi);
    }else{
      var itm = this.diagram.to_diagram(style,ss);
      var border = style.frame?'thin solid currentColor':'';
      if(1){
        var svgtext = itm.svgtext;
        var imagetext = '';
        if(itm.images && itm.images.length){
          var imgsrc = this.choose_image_file(itm.images);
          var { imgsrc, imgid } = this.to_request_image(imgsrc);
          imagetext = `<image x="0" y="0" width="${vw}" height="${vh}" xlink:href="${imgsrc}" id="${imgid}" preserveAspectRatio="none"/>`;
        }
        if(stretch){
          var style_css = `border:${border};width:${stretch*100}%`;
        }else{
          var style_css = `border:${border};width:${width}mm`;
        }
        var img = `<svg style="${style_css}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}">${imagetext}${svgtext}</svg>`;
      }
      else if(itm.images && itm.images.length){
        var imgsrc = this.choose_image_file(itm.images);
        var { imgsrc, imgid } = this.to_request_image(imgsrc);
        if(stretch){
          var img = `<img style="border:${border};width:${stretch*100}%;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}"> </img>`;
        }else{
          var img = `<img style="border:${border};width:${width}mm;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}"> </img>`;
        }
      }
      else{
        var svgtext = itm.svgtext;
        var svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}" preserveAspectRatio="none">${svgtext}</svg>`;
        var { imgsrc, imgid } = this.to_request_svgid(svg);
        if(stretch){
          var img = `<img style="border:${border};width:${stretch*100}%;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}"> </img>`;
        }else{
          var img = `<img style="border:${border};width:${width}mm;height:${height}mm;" src="${imgsrc}" id="${imgid}"> </img>`;
        }  
      }
      itm.img = img;
    }
    itm.width = width;
    itm.height = height;
    itm.stretch = stretch;
    return itm;
  }
  fence_to_tab(style,ss,ssi) {
    var hew = parseInt(style.hew)||1;
    var hrules = this.string_to_int_array(style.hrules);
    var vrules = this.string_to_int_array(style.vrules);
    var fm = this.g_to_format_array(style);
    var ff = this.g_to_fontstyle_array(style);
    var fs = this.g_to_fontsize_string(style);
    var ww = this.string_to_template_array(style.template);
    var n = ww.length;
    var rows = this.ss_to_tab_rows(ss,ssi,ww.length,style);
    rows.forEach((pp,j) => {
      pp.forEach((p,i) => {
        p.text = this.uncode(style,p.text);
        if(style.head && j==0){
          p.text = `<b>${p.text}</b>`;
          p.text = this.to_fontsized_text(p.text,fs);
        }else{ 
          p.text = this.to_fontstyled_text(p.text,ff[i]);
          p.text = this.to_fontsized_text(p.text,fs);
        }
      })
    });
    rows.forEach((pp,j) => {
      if(hrules.indexOf(j)>=0){
        pp.topframe=1;
      }
      pp.forEach((p,i) => {
        if(vrules.indexOf(i)>=0){
          p.leftframe=1;
        }
      })
    })
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'')
    var all = [];
    ww.forEach(p => {
      if(!p.pw){
        p.pw = 10;
      }
    });
    var totalw = 0;
    if(1){//colgroup has to come before everything else after caption
      let s = '';
      let def = `${10*this.MM_TO_PX}`;
      if(style.side){
        let s1 = ww.map((x,i,arr) => `<col width='${x.pw*this.MM_TO_PX}'/>`).slice(0,1).join('\n');
        let s2 = ww.map((x,i,arr) => `<col width='${x.pw*this.MM_TO_PX}'/>`).slice(1).join('\n');
        s = `<colgroup>\n${s1}\n</colgroup>\n<colgroup>\n${s2}\n</colgroup>`;      
      }else{
        let s2 = ww.map((x,i,arr) => `<col width='${x.pw*this.MM_TO_PX}'/>`).join('\n');
        s = `<colgroup>\n${s2}\n</colgroup>`;
      }
      totalw = ww.map(p=>p.pw).reduce((acc,cur)=>acc+cur,0);
      if(hew>1){
        let s0 = s;
        let totalw0 = totalw;
        for(let i=1; i < hew; ++i){
          s += `\n<colgroup><col width='${this.MM_TO_PX}'/></colgroup>\n`;
          s += s0;
          totalw += 1; 
          totalw += totalw0;
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
        let ta = ww[i]?ww[i].ta:'';
        if(ta=='c'){ta='center'}
        else if(ta=='r'){ta='right'}
        else {ta='left'}
        let css = `text-align:${ta}`;
        return(`<th class='TH' style='${css};overflow-wrap:break-word;' > ${text} </th>`);
      });
      let s = ss.join('\n');
      if(hew>1){
        let s0 = s;
        for(let i=1; i < hew; ++i){
          s += `\n<th style='border-left:solid;border-right:solid'></th>\n`
          s += s0;
        }
      }
      all.push(s);
      all.push('</tr>');
      all.push('</thead>');
    }
    if(1){
      //balance the rows
      if(hew>1){
        let k = Math.ceil(rows.length/hew);
        let total = k*hew;
        while(rows.length < total){
          let pp = 'x'.repeat(n).split('').map(x => { return {}; });
          pp.forEach((p,i) => {
            p.text = '';
          })
          rows.push(pp);
        }
      }      
      all.push(`<tbody>`);
      let ss = rows.map((pp,j,arrj) => {
        let ss = pp.map((p,i,arri) => {
          let {raw,text} = p;
          let ta = ww[i]?ww[i].ta:'';
          if(ta=='c'){ta='center'}
          else if(ta=='r'){ta='right'}
          else {ta='left'}
          let css = `text-align:${ta}`;
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
          return(`<td class='TD' style='${css};overflow-wrap:break-word;' > ${text} </td>`); 
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
    var width_css = `${totalw}mm`;
    if(style.stretch){
      let stretch = this.assert_float(style.stretch,0,0,1);
      if(stretch > 0){
        width_css = `${Math.round(stretch*100)}%`
      }else{
        width_css = '100%';
      }
    }
    let s_style = this.css('SUBTITLE');
    let t_style = `${s_style};text-align:left`;
    itm.tab  = `<table style='margin:0;page-break-inside:avoid;width:${width_css};table-layout:fixed;' ${frame} ${rules} cellpadding='0' cellspacing='0' data-row='${style.row}' >\n<caption align='bottom' class='SUBTITLE' style='${t_style}'></caption>\n${text}\n</table>`;
    return itm;
  }
  fence_to_par(style,ss,ssi){
    ss = this.ss_to_backslashed_ss(style,ss);
    ss = ss.map(s => this.to_fontstyled_text(s,style.fontstyle));
    ss = ss.map(s => this.to_fontsized_text(s,style.fontsize));
    var text = ss.join('<br/>');
    var talign = 'left';
    if(style.textalign=='c'){
      talign = 'center';
    }else if(style.textalign=='r'){
      talign = 'right';
    }
    var itm = {};
    itm.par  = `<p style='margin:0;page-break-inside:avoid;text-align:${talign};' data-row='${style.row}' >${text}</p>`;
    return itm;
  }
  fence_to_vtm(style,ss,ssi){
    var ss = ss.map(x => x.trimEnd());
    var ss = ss.map(x => x?this.polish_verb(style,x):'&#160;');
    var ss = ss.map(x => this.to_fontsized_text(x,style.fontsize));
    var ss = ss.map(x => `<span><code class='CODE'>${x}</code></span>`);
    var text = ss.join('<br/>\n');
    var itm = {};
    itm.ss = ss;
    itm.par = `<p style='margin:0;page-break-inside:avoid;' data-row='${style.row}' >${text}</p>`;
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
    var text = this.tokenizer.to_literal_math(cnt,style,used);
    return text;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  /// translator function
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_displaymath(style,cnt){
    var used = new Set();
    var text = this.tokenizer.to_literal_math(cnt,style,used);//this is a SVG
    var text = `<span style='display:inline-block;width:100%;text-align:center;'> ${text} </span>`
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
  literal_to_index(style,cnt){
    cnt = this.smooth(style,cnt);
    //TBD: to add this index to the global database
    return `${cnt}`;
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
        if(blk.name=='chapter'){          
          text = blk.style.__chapnum;
        }else if(blk.name=='heading'){
          text = blk.level;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='figure'){
          text = blk.style.__fignum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='listing'){
          text = blk.style.__lstnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='table'){
          text = blk.style.__tabnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='equation'){
          text = blk.style.__eqnnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }
        var saveas = blk.saveas||'';
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
  phrase_to_img(style,cnt){
    var img = '';
    if(this.buffers.hasOwnProperty(cnt)){
      let {ss,g} = this.buffers[cnt];
      var [viewport_width,viewport_height,viewport_unit] = this.g_to_viewport_array(g);
      var inkwidth = viewport_width*viewport_unit;
      var inkheight = viewport_height*viewport_unit;
      var vw = Math.round(inkwidth*this.MM_TO_PX);
      var vh = Math.round(inkheight*this.MM_TO_PX);
      var width = this.g_to_width_float(g);
      var height = this.g_to_height_float(g);
      var stretch = this.assert_float(g.stretch,0,0,1);
      if(width && height){
      }else if(width){
        height = viewport_height/viewport_width*width;
      }else if(height){
        width = viewport_width/viewport_height*height;
      }else{
        width = inkwidth;//mm
        height = inkheight;//mm
      }
      var itm = this.diagram.to_diagram(g,ss);
      var border = g.frame?'thin solid currentColor':'';
      if(itm.images && itm.images.length){
        var imgsrc = this.choose_image_file(itm.images);
        var { imgsrc, imgid } = this.to_request_image(imgsrc);
        if(stretch){
          var img = `<img style="border:${border};width:${stretch*100}%;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}"> </img>`;
        }else{
          var img = `<img style="border:${border};width:${width}mm;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}"> </img>`;
        }
      }else{
        var svgtext = itm.svgtext;
        var svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="none">${svgtext}</svg>`;
        var { imgsrc, imgid } = this.to_request_svgid(svg);
        if(stretch){
          var img = `<img style="border:${border};width:${stretch*100}%;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}"> </img>`;
        }else{
          var img = `<img style="border:${border};width:${width}mm;height:${height}mm;" src="${imgsrc}" id="${imgid}"> </img>`;
        }  
      }
    }
    return img;
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
  /////////////////////////////////////////////////////////////////////////////
  ///
  /// float
  ///
  /////////////////////////////////////////////////////////////////////////////
  float_to_example(title,label,style,splitid,body,bodyrow){
    let ss = body.map((s) => this.uncode(style,s)).map((s) => `<li>${s}</li>`);
    var text = ss.join('\n');
    return `<ul class='EXAMPLE' style='${this.css("EXAMPLE")};' data-row='${style.row}' >${text}</ul>`;
  }
  float_to_verbatim(title,label,style,splitid,body,bodyrow){
    var ss = body.map((s,i,arr) => {
      let x = s;
      x = x.trimEnd();
      if(x.length==0){
        x = '&#160;';
      }else{
        x = this.polish_verb(style,x);
        x = this.to_fontsized_text(x,style.fontsize);
      }
      return `<code class='CODE'>${x}</code>`;
    })
    var text = ss.join('<br/>\n');
    return`<p class='VERBATIM' style='${this.css("VERBATIM")};' data-row='${style.row}' >${text}</p>`;
  }
  float_to_body(title,label,style,splitid,body,bodyrow){
    var text = this.join_para(body);
    var text = this.uncode(style,text);
    var text = `<span data-row='${style.row}' > ${text} </span>`;
    return `<p class='BODY' style='${this.css("BODY")}' > ${text} </p>`;
  }
  float_to_details(title,label,style,splitid,body,bodyrow){
    var step = this.body_to_details(body,bodyrow);
    var all = [];
    all.push('');
    step.forEach((p,i,arr) => {
      if(i==0){
        if(p.value=='+'){
          all.push(`<dl class='DETAILS' style='${this.css("DETAILS")}' data-row='${style.row}'>`);
          all.push(`<dt><b>${this.polish(style,p.term)}</b></dt>`);
          all.push(`<dd>${this.uncode(style,this.join_para(p.lines))}</dd>`);
        }else{
          all.push(`<ol class='DETAILS' style='${this.css("DETAILS")}' data-row='${style.row}'>`);
          all.push(`<li value='${p.value}'>${this.uncode(style,this.join_para(p.lines))}</li>`);
        }
      }else{
        if(this.body_is_bundle(p.lines)){
          var bundle = this.try_extract_bundle(style,p.lines,p.n,0);
          var text = bundle.ss.map(s => this.polish_verb(style,s)).map(s => `<code class='CODE'>${s}</code>`).join('<br/>\n');
        }else if(this.body_is_checklist(p.lines)){
          var text = this.body_to_checklist(style,p.lines);
        }else if(this.body_is_argumentlist(p.lines)){
          var text = this.body_to_argumentlist(style,p.lines);
        }else{
          var text = this.uncode(style,this.join_para(p.lines));
        }
        if(p.value=='+'){
          all.push(`<dd>${text}</dd>`);
        }else{
          all.push(`<span>${text}</span>`);
        }
      }
      if(i+1==arr.length){
        if(p.value=='+'){
          all.push('</dl>');
        }else{
          all.push('</ol>');
        }
      }
    });
    var text = all.join('\n');
    return text;
  } 
  float_to_primary(title,label,style,splitid,body,bodyrow){
    var title = this.uncode(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    title = (`<b>${title}</b> &#160;`)
    return `<p class='PRIMARY' style='${this.css("PRIMARY")}' data-row='${style.row}' > ${title} ${text} </p>`;
  }
  float_to_secondary(title,label,style,splitid,body,bodyrow){
    var title = this.uncode(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    title = (`&#x2003;&#x2003;<b><i>${title}</i></b> &#160;`)
    return `<p class='SECONDARY' style='${this.css("SECONDARY")}' data-row='${style.row}' > ${title} ${text} </p>`;
  }
  float_to_flushleft(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = bundles.filter(bundle => bundle.type=='bundle'); 
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle);
      let text = '';
      if(itm.fml){
        text = itm.fml;
      }else if(itm.img){
        text = itm.img;
      }else if(itm.tab){
        text = itm.tab;
      }else if(itm.par){
        text = itm.par;
      }
      all.push(text);
    });
    var text = all.join('&#160;\n');
    return `<div class='FLUSHLEFT' style='${this.css("FLUSHLEFT")};display:flex;flex-direction:row;justify-content:flex-start;align-items:flex-end;' data-row='${style.row}' >${text}</div>`;
  }
  float_to_center(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = bundles.filter(bundle => bundle.type=='bundle');    var text = '';
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle);
      let text = '';
      if(itm.fml){
        text = itm.fml;
      }else if(itm.img){
        text = itm.img;
      }else if(itm.tab){
        text = itm.tab;
      }else if(itm.par){
        text = itm.par;
      }
      all.push(text);
    });
    var text = all.join('&#160;\n');
    return `<div class='CENTER' style='${this.css("CENTER")};display:flex;flex-direction:row;justify-content:center;align-items:flex-end;' data-row='${style.row}' >${text}</div>`;
  }
  float_to_equation(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = bundles.filter(bundle => bundle.type=='bundle');
    var eqnnum = style.__eqnnum;
    if(style.__chapnum){
      eqnnum = style.__chapnum+"."+eqnnum;
    }
    var all = bundles.map((bundle,i,arr) => {
      let itm = this.do_bundle(style,bundle,'fml');
      var fml = itm.fml;
      var sub = '';
      if(arr.length>1){
        sub = this.int_to_letter_a(1+i);
      }
      return(`<span class='EQUATIONROW' style='${this.css("EQUATIONROW")}'> <span style='margin-left:auto;margin-right:auto'>${fml}</span> <span style='font-size:smaller;'> (${eqnnum}${sub}) </span> </span>`);
    });
    var text = all.join("\n");
    return `<div id='${label}' class='EQUATION' style='${this.css("EQUATION")}' data-row='${style.row}' >${text}</div>` ;
  }
  float_to_figure(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    let itms = this.bundles_to_figure_itms(style,bundles);
    var fignum = style.__fignum;
    if(style.__chapnum){
      fignum = style.__chapnum+"."+fignum;
    }
    let flex_css = 'display:flex;flex-direction:column;row-gap:0.1em;align-items:center;';
    let all = [];
    var onerow = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='bundle'){
        if(p.img){
          // let fig = this.img_to_fig(p.style,p.stretch,p.width,p.height,p.img,p.subtitle);
          let img = this.add_css_style('width:100%',p.img);
          let w = (p.stretch)?`${p.stretch*100}%`:`${p.width}mm`;
          let subtitle = this.to_fig_subtitle(p.style,p.subtitle);
          subtitle = `<span style='text-align:center;font-size:smaller;'>${subtitle}</span>`;
          onerow.push([w,img,subtitle]);
        }
      }
      if(p.type=='\\\\'||j+1==arr.length){
        let n = onerow.length;
        if(n){
          all.push(`<div style='width:100%;display:inline-grid;grid-template-columns:${onerow.map(s=>s[0]).join(' ')};justify-content:center;' > ${onerow.map(s=>s[1]).join('')} ${onerow.map(s=>s[2]).join('')} </div>`);
          onerow = [];
        }
      }
    });
    var text = all.join('\n');
    return `<figure id='${label}' class='FIGURE' style='${this.css("FIGURE")};${flex_css}' data-row='${style.row}' > ${this.to_caption_text(style,title,fignum,splitid,'Figure')} ${text} </figure>`;
  }
  float_to_wrapfig(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = this.merge_all_bundles(style,bundles);
    var o = [];
    bundles.forEach((bundle,j,arr) => {
      let p = this.do_bundle(style,bundle,'img');
      if(style.align=='left'){
        var img = this.add_css_style('float:left;margin-right:1em;',p.img);
      }else{
        var img = this.add_css_style('float:right;margin-left:1em;',p.img);
      }
      o.push(img);      
    });
    var caption = this.uncode(style,title);
    var text = o.join('\n');
    return `<p id='${label}' class='WRAPFIG' style='${this.css("WRAPFIG")}' data-row='${style.row}' > ${text} ${caption} </p>`;
  }
  float_to_wraptab(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = this.merge_all_bundles(style,bundles);
    var o = [];
    bundles.forEach((bundle,j,arr) => {
      let p = this.do_bundle(style,bundle,'tab');
      if(style.align=='left'){
        var tab = this.add_css_style('float:left;margin-right:1em;',p.tab);
      }else{
        var tab = this.add_css_style('float:right;margin-left:1em;',p.tab);
      }
      o.push(tab);
    });
    var caption = this.uncode(style,title);
    var text = o.join('\n');
    return `<p id='${label}' class='WRAPTAB' style='${this.css("WRAPTAB")}' data-row='${style.row}' > ${text} ${caption} </p>`;
  }
  float_to_listing(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var lstnum = style.__lstnum;
    if(style.__chapnum){
      lstnum = style.__chapnum+"."+lstnum;
    }
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      var splitid = bundle.splitid||0;
      var splitsi = bundle.si||0;
      let ss = bundle.ss.map((s,i,arr) => {
        let ln = (splitsi+i+1);
        s = this.polish(bundle.g,s);
        return `<code class='CODE' style='position:relative;'><span style='position:absolute;right:calc(100% + 10pt);'>${ln}</span>${s}</code>`;
      });
      var text = ss.join('\n');
      var text = `<pre style='margin-left:10pt'>${text}</pre>`;
      var css = this.css('LISTING'); 
      let s = `<figure class='LISTING' style='${css}' data-row='${style.row}' > ${this.to_caption_text(style,title,lstnum,splitid,'Listing')} ${text} </figure>`;
      all.push(s);
    });
    return all.join('\n');
  }
  float_to_table(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var tabnum = style.__tabnum;
    if(style.__chapnum){
      tabnum = style.__chapnum+"."+tabnum;
    }
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'tab');
      var splitid = bundle.splitid||0;
      var onerow = [];
      onerow.push(itm.tab);
      let flex_css = 'display:flex;flex-direction:column;row-gap:0.1em;';
      let subrow_css = this.css('FIGUREROW');
      let text = (`<span class='FIGUREROW' style='${subrow_css}' > ${onerow.join('')} </span>`);
      let s = `<figure id='${label}' class='TABLE' style='${this.css("TABLE")};${flex_css}' data-row='${style.row}' > ${this.to_caption_text(style,title,tabnum,splitid,'Table')} ${text} </figure>`;
      all.push(s);
    });
    return all.join('\n')
  }
  float_to_columns(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    var bundles = bundles.filter((p) => (p.type=='bundle'));
    var itms = bundles.map((bundle) => this.do_bundle(style,bundle));
    var n = itms.length;
    var all = [];
    all.push(`<figure class='COLUMNS' style='${this.css("COLUMNS")};display:grid;column-gap:1em;grid-template-columns:repeat(${n},${100/n}%);grid-auto-rows:auto;' data-row='${style.row}' >`);
    itms.forEach((p,j,arr) => {
      if(p.fml){
        all.push(p.fml);
      }else if(p.img){
        all.push(p.img);
      }else if(p.tab){
        all.push(p.tab);
      }else if(p.par){
        all.push(p.par);
      }
    });
    all.push(`</figure>`);
    return all.join('\n');
  }  
  float_to_lines(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = this.merge_all_bundles(style,bundles);
    var ss = [];
    var ssi = 0;
    bundles.forEach((bundle) => {
      ss = bundle.ss;
      ssi = bundle.ssi;
    });
    var align = 'left';
    if(style.textalign=='c'){
      align='center';
    }else if(style.textalign=='r'){
      align='right';
    }
    ss = ss.map((s,j,arr) => {
      s = this.uncode(style,s);
      s = this.to_fontstyled_text(s,style.fontstyle);
      s = this.to_fontsized_text(s,style.fontsize);
      s = this.solidify(s);
      return s;
    });
    var text = ss.join('<br/>');
    return `<p class='LINES' style='${this.css("LINES")};text-align:${align};' data-row='${style.row}' >${text}</p>`;
  }  
  float_to_tabbing(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = this.merge_all_bundles(style,bundles);
    var ss = [];
    var ssi = 0;
    bundles.forEach((bundle) => {
      ss = bundle.ss;
      ssi = bundle.ssi;
    });
    var rows = this.ss_to_tabbing_rows(ss,ssi);
    var all = [];
    var ww = [];
    rows.forEach((pp,j) => {
      if(j==0){
        ww = pp;
        pp.forEach((p) => {
          p.text = this.uncode(style,p.text);
        });
        let s = '<tr>' + pp.map((p,i) => `<td style='width:${ww[i].pw}ex;padding:0;'>${p.text}</td>`).join('') + '</tr>';
        if(pp.map(p=>p.text.length).reduce((acc,cur)=>acc+cur,0)>0){
          all.push(s);
        }
      }else{
        pp.forEach((p) => {
          p.text = this.uncode(style,p.text);
        });
        let s = '<tr>' + pp.map((p,i) => `<td style='width:${ww[i].pw}ex;padding:0;'>${p.text}</td>`).join('') + '</tr>';
        all.push(s);
      }
    });
    var text = all.join('\n');
    var text = `<table>${text}</table>`;
    return `<div class='TABBING' style='${this.css("TABBING")};display:flex;flex-direction:column;align-items:flex-start;' data-row='${style.row}' >${text}</div>`;
  }  
  float_to_itemize(title,label,style,splitid,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var ss = [];
    var ssi = 0;
    bundles.forEach((bundle,j,arr) => {
      ss = bundle.ss;
      ssi = bundle.ssi;
    });
    var plitems = this.ss_to_plitems(style,ss,ssi);
    var itemize = this.plitems_to_itemize(style,plitems);
    var text = this.itemize_to_text(style,itemize,"ITEMIZE");
    return text;           
  }  
  float_to_page(title,label,style,splitid,body,bodyrow){
    return '';
  }
  float_to_vspace(title,label,style,splitid,body,bodyrow){
    var n = this.assert_int(style.vspace,1,0,this.MAX_INT);
    var text = 'x'.repeat(n).split("").map(x=>`&#160;`).join('<br/>');
    return `<p class='BODY' style='${this.css("BODY")}'>${text}</p>`;
  }
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
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
  solidify(s){
    return this.replace_leading_blanks_with(s,'&#160;');
  }
  thicken(s){
    return this.replace_blanks_with(s,'&#160;');
  }
  to_empty_svg(style){
  }
  to_tab_subcaptions(style){
    var all = [];
    var ss = style.__subcaptions.map((p) => {
      if(p[0]){
        var subtitle = `(${p[0]}) ${p[1]}`;
      }else{
        var subtitle = `${p[1]}`;
      }
      return `<span>${this.uncode(style,subtitle)}</span>`;
    })
    return ss.join('<br/>');
  }
  add_css_style(cs,s){
    const re = /^<([A-Za-z]+)\s*(.*?)>(.*)<\/\1>$/s;
    var v;
    if((v=re.exec(s))!==null){
      var tag = v[1];
      var attribute = v[2];
      var content = v[3];
      var attributes = this.string_to_tag_attributes(attribute);
      attributes = attributes.map((l) => {
        let [key,val,qm] = l;
        if(key=='style'){
          val = val+';'+cs;
        }
        return [key,val,qm];
      });
      return `<${tag} ${this.string_from_tag_attributes(attributes)}>${content}</${tag}>`;
    }
    return s;
  }
  string_to_tag_attributes(s){
    const re = /^([A-Za-z\-:]+)=(['"])(.*?)\2\s*(.*)$/s;
    var v;
    var attributes = [];
    while((v=re.exec(s))!==null){
      let key = v[1];
      let qm = v[2];
      let val = v[3];
      s = v[4];
      attributes.push([key,val,qm]);
    }
    return attributes;
  }
  string_from_tag_attributes(attributes){
    var attributes = attributes.map(l => {
      let [key,val,qm] = l;
      return `${key}=${qm}${val}${qm}`;
    })
    return attributes.join(' ');
  }
  img_to_fig(style,stretch,width,height,img,subtitle){
    if(stretch){
      img = this.add_css_style('width:100%',img);
      return `\n<table class="COLUMN" style="${this.css("COLUMN")};width:${stretch*100}%;" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${this.css('SUBTITLE')}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
    }else{
      return `\n<table class="COLUMN" style="${this.css("COLUMN")};width:${width}mm;" cellpadding="0" cellspacing="0" data-row="${style.row}" >\n<caption align="bottom" class="SUBTITLE" style="${this.css('SUBTITLE')}" >${subtitle}</caption>\n<colgroup/><thead/><tbody><tr><td>${img}</td></tr></tbody>\n</table>`;
    }
  }
  ss_to_ink(style,ss,ssi){
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
    var stretch = this.assert_float(style.stretch,0,0,1);
    if(width && height){
    }else if(width){
      height = (viewport_height/viewport_width)*(width);
    }else if(height){
      width = (viewport_width/viewport_height)*(height);
    }else{
      width = inkwidth;
      height = inkheight;
    }
    var vw = inkwidth*this.MM_TO_PX;
    var vh = inkheight*this.MM_TO_PX;
    ///border
    if(style.frame){
      var border = 'thin solid currentColor';
    }else{
      var border = '';
    }
    var subtitle = style.subtitle||'';
    var svg  = `\n<svg data-bundle="INK" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="none" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}" >${svgtext}</svg>\n`;
    var { imgsrc, imgid } = this.to_request_svgid(svg);
    if(stretch>0){
      var img = `<img style="border:${border};width:${stretch*100}%;" src="${imgsrc}" id="${imgid}" onload="img_onload(this)"> </img>`;
    }else{
      var img = `<img style="border:${border};width:${width}mm;height:${height}mm;" src="${imgsrc}" id="${imgid}" onload="img_onload(this)"> </img>`;
    }
    itm.img = img;
    itm.style = style;
    itm.subtitle = subtitle;
    itm.width = width;
    itm.height = height;
    itm.stretch = stretch;
    itm.vw = vw;
    itm.vh = vh;
    itm.svg = svg;
    //var s_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}" >${img}</svg>`;
    //img = `<object class='INK' style='${css}' width='${w}' height='${h}' data='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}'></object>`;
    return itm;
  }
}
module.exports = { NitrilePreviewHtml };
