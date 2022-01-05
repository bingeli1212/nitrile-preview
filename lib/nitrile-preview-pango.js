'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewPango extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.presentation = new NitrilePreviewPresentation(this);
    this.icon_keypoint = '&#x2756;'//Black Diamond Minus White X
    this.icon_exercise = '&#x270E;'//Lower Right Pencil
    this.icon_folder   = '&#x27A5;'//Heavy Black Curved Downwards and Rightwards Arrow
    this.icon_solution = '&#x270D;'//Writing Hand
    this.icon_box = '&#x2610;'
    this.icon_cbox = '&#x2611;'
    this.icon_rtri = '&#x25B8;'
    this.icon_dtri = '&#x25BE;'
    this.icon_checkmark = '&#x2713;'
    this.icon_ndash = '&#x2013;'
    this.icon_pencil = '&#x270E;'
    this.icon_sigs = [];
    this.icon_rule = '_______';
    this.mm_to_px = 3.779;
    this.frame_padding_left   = 10 * this.mm_to_px;
    this.frame_padding_top    = 3  * this.mm_to_px;
    this.frame_padding_right  = 10 * this.mm_to_px;
    this.frame_padding_bottom = 3  * this.mm_to_px;
    this.frame_width    = 128 * this.mm_to_px;
    this.frame_height   =  96 * this.mm_to_px;
    this.frame_extent   = this.frame_width - this.frame_padding_left - this.frame_padding_right;
    this.frame_altitute = this.frame_height - this.frame_padding_top - this.frame_padding_bottom 
    this.frame_vw       = this.frame_width;
    this.frame_vh       = this.frame_height;
    this.fontsize_factor = 11/12;
    this.frontmattertitle_factor = 1.8 * this.fontsize_factor;
    this.frontmattertitle_color = '#1010B0';
    this.frametitle_factor = 1.2 * this.fontsize_factor;
    this.frametitle_color = '#1010B0';
    this.framesubtitle_scale = 0.8 * this.fontsize_factor;
    this.framesubtitle_color = '#1010B0';
    this.padding_plst = 5 * this.mm_to_px;
    this.padding_dd = 1.15 * 37.8; //1.15cm 
    this.hanging    = 0.55 * 37.8; //0.55cm 
    this.cell_padding_left_right = 12; //12px 
    this.cell_padding_top_bottom = 2; //2px 
    this.frame_svgs = [];
    this.frame_svg = null;
    this.frame_svg_x = 0;
    this.frame_svg_y = 0;
    this.frame_svg_blank = 5 * 1.333; //5pt inter-paragraph gap
    this.frame_svg_frametitle_dx = -5*this.mm_to_px;
  }
  to_document() {
    this.to_titlepage();
    this.to_beamer();
    var frame_htmls = this.frame_svgs.map((all) => {
      let s = all.join('\n');
      s = `<svg class='slide' style='background-color:white;page-break-before:always;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' viewBox='0 0 ${this.frame_vw} ${this.frame_vh}'> ${s} </svg>`;
      //s = `<article> ${s} </article>`;  ///the article wrapper is for screen display; it seems that the class=slide does not seems to be applied to @media screen svg elements
      return s;
    });
    var html = frame_htmls.join('\n');
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>

  @media print {

    @page {
      size: 128mm 96mm;
    }  

    slide {
      page-break-before: always;
      page-break-inside: avoid;
      min-width:100%;
      max-width:100%;
      min-height:95.5mm;
      max-height:95.5mm;
      box-sizing:border-box;
      overflow: hidden;
    }
  }

  @media screen {

    article {
      background-color: white;
      min-width:128mm;
      max-width:128mm;
      min-height:96mm;
      max-height:96mm;
      box-sizing:border-box;
      overflow: hidden;
      margin: 1em auto;
    }

    main {
      background-color: gray;
      box-sizing:border-box;
      padding:1px 0;
    }
  }

  body {
    margin:0;
    padding:0;
  }

</style>
</head>
<body>
<main>
${html}
</main>
</body>
</html>
`;
  }

  to_beamer() {
    let top = this.presentation.to_top(this.parser.blocks);
    ///
    ///
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,i,arr) => {
      let topframe = this.presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          ///note that each subsection is just a 'blocks'
          let subframe = this.presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let out = this.write_topics_frame(topframe,subframes);
        d.push(out);
        subframes.forEach((subframe) => {
          let out = this.write_frame(subframe);
          d.push(out);
        });
      }else{
        let out = this.write_frame(topframe);
        d.push(out);
      }
    });
    var main = d.join('\n');
    //
    //table of contents
    //
    var toc = this.write_contents_frame(topframes);
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d.join('\n');
  }
  write_contents_frame(topframes){
    /// decide if we need to change fonts
    var all = [];
    topframes.forEach((topframe,i,arr) => {
      if(i==0){
        all.push(`<ul class='LINE' style='list-style:none;padding:0;'>`);
      }
      let icon = topframe.isex?this.icon_exercise:this.icon_keypoint;
      if(topframe.subframes){
        icon = this.icon_folder;
      }
      all.push(`<li class='LINE'> ${icon} ${topframe.title} </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    ///FONTS
    var text = all.join('\n')
    /// div
    all = [];
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'> <b>Table Of Contents</b> </h1>`);
    all.push(`<div class='element'>`)
    all.push(text);
    all.push('</div>')
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_topics_frame(frame,subframes){
    let all = [];
    //
    //NOTE: main contents
    //
    let icon = this.icon_folder;
    let title = frame.title;
    all.push(`<article>`);
    all.push(`<h1 class='frametitle'>${icon} <b>${title}</b> </h1>`);
    all.push(`<div class='element'>`)
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let [height,cnt] = this.translate_block(x);
      
    })
    subframes.forEach((subframe,i,arr) => {
      if(i==0){
        all.push(`<ul class='LINE' style='list-style:none;padding:0;'>`);
      }
      ///'o' is blocks
      let icon = subframe.isex?this.icon_exercise:this.icon_keypoint;
      all.push(`<li class='LINE'> ${icon} ${subframe.title} </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push('</div></article>');
    all.push('');
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  write_frame(frame){
    //let my_id = this.get_refmap_value(my.style,'idnum');
    var icon = frame.isex?this.icon_exercise:this.icon_keypoint;
    var title = frame.title;
    var style = frame.style;

    //
    //NOTE: main contents
    //
    this.frame_svg = [];
    this.frame_svgs.push(this.frame_svg);
    this.frame_svg_x = this.frame_padding_left;
    this.frame_svg_y = this.frame_padding_top;
    let [height,cnt] = this.do_frametitle(this.frame_svg_x,this.frame_svg_y,style,icon,title);
    this.frame_svg.push(cnt);
    this.frame_svg_y += height;
    this.frame_svg_y += this.frame_svg_blank;
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let [height,cnt] = this.translate_block(x);
      this.frame_svg.push(`<svg x='${this.frame_svg_x}' y='${this.frame_svg_y}'> ${cnt} </svg>`);
      this.frame_svg_y += height;
    })
    frame.solutions.forEach((o,i,arr) => {
      var the_icon = this.icon_solution;
      var title = `&i{${o.title}}`;
      var style = o.style;
      var title = this.uncode(style,title);
      var txt = `${the_icon} ${title}`;
      let [height,cnt] = this.do_para(this.frame_svg_x,this.frame_svg_y,txt,this.frame_extent,this.fontsize_factor,style);
      this.frame_svg.push(cnt);
      this.frame_svg_y += height;
    });
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      this.frame_svg = [];
      this.frame_svgs.push(this.frame_svg);
      this.frame_svg_x = this.frame_padding_left;
      this.frame_svg_y = this.frame_padding_top;
      let [height,cnt] = this.do_frametitle(this.frame_svg_x,this.frame_svg_y,style,icon,title);
      this.frame_svg.push(cnt);
      this.frame_svg_y += height;
      [height,cnt] = this.untext(o.style,o.body);
      this.frame_svg.push(`<svg x='${this.frame_svg_x}' y='${this.frame_svg_y}'> ${cnt} </svg>`);
      this.frame_svg_y += height;
      this.frame_svg_y += this.frame_svg_blank;
      ///content of each solution slide      
      o.contents.forEach((x,i) => {
        //'x' is a block
        [height,cnt] = this.translate_block(x);
        this.frame_svg.push(`<svg x='${this.frame_svg_x}' y='${this.frame_svg_y}'> ${cnt} </svg>`);
        this.frame_svg_y += height;
      });
    })
  }
  /////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////
  to_titlepage(){
    let title = this.conf_to_string('title','Untitled');
    let subtitle = this.conf_to_string('subtitle')
    let institute = this.conf_to_string('institute');
    let author = this.conf_to_string('author');
    var date = new Date().toLocaleDateString();
    var style = this.parser.style;
    this.frame_svg = [];
    this.frame_svgs.push(this.frame_svg);
    this.frame_svg_x = this.frame_padding_left;
    this.frame_svg_y = this.frame_padding_top + 60;
    var [height,cnt] = this.do_para(this.frame_svg_x,this.frame_svg_y,this.uncode(style,title),this.frame_extent,this.frontmattertitle_factor,{...style,align:'center'});
    this.frame_svg_y += height;
    this.frame_svg_y += 40;
    this.frame_svg.push(cnt);
    var [height,cnt] = this.do_para(this.frame_svg_x,this.frame_svg_y,this.uncode(style,subtitle),this.frame_extent,this.fontsize_factor,{...style,align:'center'});
    this.frame_svg_y += height;
    this.frame_svg_y += 8;
    this.frame_svg.push(cnt);
    var [height,cnt] = this.do_para(this.frame_svg_x,this.frame_svg_y,this.uncode(style,institute),this.frame_extent,this.fontsize_factor,{...style,align:'center'});
    this.frame_svg_y += height;
    this.frame_svg_y += 8;
    this.frame_svg.push(cnt);
    var [height,cnt] = this.do_para(this.frame_svg_x,this.frame_svg_y,this.uncode(style,author),this.frame_extent,this.fontsize_factor,{...style,align:'center'});
    this.frame_svg_y += height;
    this.frame_svg_y += 8;
    this.frame_svg.push(cnt);
    var [height,cnt] = this.do_para(this.frame_svg_x,this.frame_svg_y,this.uncode(style,date),this.frame_extent,this.fontsize_factor,{...style,align:'center'});
    this.frame_svg_y += height;
    this.frame_svg_y += 8;
    this.frame_svg.push(cnt);
  }
  //////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////
  do_frametitle(px,py,style,icon,title){
    var title = this.uncode(style,title);
    var factor = this.frametitle_factor;
    return this.do_para(px+this.frame_svg_frametitle_dx,py,`${icon} ${title}`,this.frame_extent,factor,style);
  }
  /////////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////////
  item_dl_to_text(i,item,nblank,extent){
    var o = [];
    var value = this.uncode(item.style,item.value);
    var text = this.uncode(item.style,item.text);
    var cls = (!nblank) ? 'PACK' : 'PARA';
    o.push(`<dt class='${cls} DT'> <b> ${value} </b> &#160; ${text} </dt> <dd class='PACK DD'>`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let style = {...p.style,extent:extent-this.padding_plst}
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank,extent-this.padding_plst)}`);
        }
      });
    }
    o.push(`</dd>`);
    return o.join('\n\n');
  }
  item_hl_to_text(i,item,nblank,extent){
    var o = [];
    var text = this.uncode(item.style,item.text);
    var cls = (!nblank) ? 'PACK' : 'PARA';
    o.push(`<li class='${cls} LI'> ${text} `);      
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let style = {...p.style,extent:extent-this.padding_plst}
          o.push(`<div class='PARA DIV' style='text-indent:initial'> ${this.untext(style,p.lines)} </div>`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize,nblank,extent-this.padding_plst)}`);
        }
      });
    }
    o.push(`</li>`);
    return o.join('\n\n');
  }
  item_ol_to_text(i,item,nblank,extent){
    var px = 0;
    var py = 0;
    var all = [];
    if(item.type == 'A'){
      var bullet = this.int_to_letter_A(item.value);
      var o = this.do_plst_item(px,py,bullet,item.text,extent,this.fontsize_factor,item.style);
    }else if(item.type == 'a'){
      var bullet = this.int_to_letter_a(item.value);
      var o = this.do_plst_item(px,py,bullet,item.text,extent,this.fontsize_factor,item.style);
    }else if(item.type == 'I'){
      var bullet = this.int_to_letter_I(item.value);
      var o = this.do_plst_item(px,py,bullet,item.text,extent,this.fontsize_factor,item.style);
    }else if(item.type == 'i'){
      var bullet = this.int_to_letter_i(item.value);
      var o = this.do_plst_item(px,py,bullet,item.text,extent,this.fontsize_factor,item.style);
    }else if(item.value) {
      var bullet = `${item.value}`;
      var o = this.do_plst_item(px,py,bullet,item.text,extent,this.fontsize_factor,item.style);
    }else{
      var bullet = `${i+1}`;
      var o = this.do_plst_item(px,py,bullet,item.text,extent,this.fontsize_factor,item.style);
    }
    all.push(o);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let style = {...p.style,extent:extent-this.padding_plst}
          var o = this.untext(style,p.lines);
          all.push(o);
        }else if(p.itemize) {
          var o = this.itemize_to_text(p.itemize,nblank,extent-this.padding_plst);
          all.push(o);
        }
      });
    }
    var height = 0; 
    var text = '';
    all.forEach((o,i,arr) => {
      let cnt = o[1];
      let dx = 0;
      if(i>0){
        dx = this.padding_plst;
      }
      text += `<svg x='${dx}' y='${height}'> ${cnt} </svg>\n`;
      height += o[0];
      height += this.frame_svg_blank;
    });
    return [height,text];
  }
  item_ul_to_text(i,item,nblank,extent){
    var px = 0;
    var py = 0;
    var all = [];
    var o = this.do_plst_item(px,py,this.icon_bullet,item.text,extent,this.fontsize_factor,item.style);
    all.push(o);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let style = {...p.style,extent:extent-this.padding_plst}
          var o = this.untext(style,p.lines);
          all.push(o);
        }else if(p.itemize) {
          var o = this.itemize_to_text(p.itemize,nblank,extent-this.padding_plst);
          all.push(o);
        }
      });
    }
    var height = 0; 
    var text = '';
    all.forEach((o,i,arr) => {
      let cnt = o[1];
      let dx = 0;
      if(i>0){
        dx = this.padding_plst;
      }
      text += `<svg x='${dx}' y='${height}'> ${cnt} </svg>\n`;
      height += o[0];
      height += this.frame_svg_blank;
    });
    return [height,text];
  }
  itemize_to_text(itemize,nblank,extent){
    var bull = itemize.bull;
    var items = itemize.items;
    var all = [];
    switch (bull) {
      case 'DL': {
        items.forEach((item,j) => {
          let o = this.item_dl_to_text(j,item,nblank,extent);
          all.push(o);
        });
        break;
      }
      case 'HL': {
        items.forEach((item,j) => {
          let o = this.item_hl_to_text(j,item,nblank,extent);
          all.push(o);
        });
        break;
      }
      case 'OL': {
        items.forEach((item,j) => {
          let o = this.item_ol_to_text(j,item,nblank,extent);
          all.push(o);
        });
        break;
      }
      case 'UL': {
        items.forEach((item,j) => {
          let o = this.item_ul_to_text(j,item,nblank,extent);
          all.push(o);
        });
        break;
      }
    }
    var height = 0; 
    var text = '';
    all.forEach((o) => {
      let cnt = o[1];
      text += `<svg x='${0}' y='${height}'> ${cnt} </svg>\n`;
      height += o[0];
    });
    return [height,text];
  }
  //////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////
  fence_to_verse(style,ss,ssi){
    var style = this.update_style_from_switches(style,'list')
    var itms = this.ss_to_list_itms(ss,style);
    var bullet = '&#x2022;'
    const nbsp       = this.icon_nbsp;
    const squareboxo = this.icon_squareboxo;
    const squarebox  = this.icon_squarebox;
    const circleboxo = this.icon_circleboxo;
    const circlebox  = this.icon_circlebox;
    const check_ss = this.string_to_array(this.assert_string(style.check));
    var dy = 0;
    var extent = this.frame_extent;
    if(typeof style.extent === 'number'){
      extent = style.extent;
    }
    var all = [];
    itms.forEach((p,i,arr) => {
      if(p.type=='UL'){
        var [height,cnt] = this.do_list_item(0,dy,bullet,p.text,extent,this.fontsize_factor,style)
        dy += height;
        all.push(cnt);
      }
      else if(p.type=='OL'){
        let lead = `${i+1}`;
        var [height,cnt] = this.do_list_item(0,dy,lead,p.text,extent,this.fontsize_factor,style)
        dy += height;
        all.push(cnt);
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        let lead = `${p.value}${p.ending}`;
        var [height,cnt] = this.do_list_item(0,dy,lead,p.text,extent,this.fontsize_factor,style)
        dy += height;
        all.push(cnt);
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        let lead = `${this.int_to_letter_a(p.value)}${p.ending}`;
        var [height,cnt] = this.do_list_item(0,dy,lead,p.text,extent,this.fontsize_factor,style)
        dy += height;
        all.push(cnt);
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        let lead = `${this.int_to_letter_A(p.value)}${p.ending}`;
        var [height,cnt] = this.do_list_item(0,dy,lead,p.text,extent,this.fontsize_factor,style)
        dy += height;
        all.push(cnt);
      }
      else if(p.type == 'DL'){
        var [height,cnt] = this.do_para_list_item_dl(0,dy,p.value,p.text,extent,this.fontsize_factor,style)
        dy += height;
        all.push(cnt);
      }
      else if(p.type == 'CB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          var [height,cnt] = this.do_list_item(0,dy,squarebox,p.text,extent,this.fontsize_factor,style)
          dy += height;
          all.push(cnt);
        }else{
          //empty CB
          var [height,cnt] = this.do_list_item(0,dy,squareboxo,p.text,extent,this.fontsize_factor,style)
          dy += height;
          all.push(cnt);
        }
      }
      else if(p.type == 'RB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          var [height,cnt] = this.do_list_item(0,dy,circlebox,p.text,extent,this.fontsize_factor,style)
          dy += height;
          all.push(cnt);
        }else{
          //empty CB
          var [height,cnt] = this.do_list_item(0,dy,circleboxo,p.text,extent,this.fontsize_factor,style)
          dy += height;
          all.push(cnt);
        }
      }
      else {
        var [height,cnt] = this.do_list_item(0,dy,bullet,p.text,extent,this.fontsize_factor,style)
        dy += height;
        all.push(cnt);
      }
    });
    ///all fence_to_XXX methods would update the this.frame_svg_y itself
    return [dy,all.join('\n')];
  }
  fence_to_plaintext(style,ss,ssi){
    var style = this.update_style_from_switches(style,'list')
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var extent = this.frame_extent;
    if(typeof style.extent === 'number'){
      extent = style.extent;
    }
    var o = this.do_para(0,0,text,extent,this.fontsize_factor,style);
    var [height,cnt] = o;
    height += this.frame_svg_blank;
    return [height,cnt];
  }
  fence_to_dia(style,ss,ssi){
    var style = this.update_style_from_switches(style,'dia');
    var o = this.diagram.to_diagram(style,ss);
    /*
    var extent = this.frame_extent;
    if(typeof style.extent === 'number'){
      extent = style.extent;
    }
    var o = this.do_para(0,0,img,extent,this.fontsize_factor,style);
    var [height,cnt] = o;
    height += this.frame_svg_blank;
    return [height,cnt];
    */
    return o;
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  ////////////////////////////////////////////////////////////////////////////////////////
  do_plst_item(px,py,bullet,text,extent,factor,style){
    ///the indent
    var padding = this.padding_plst;//0.55cm hanging
    var text = this.uncode(style,text);
    ///draw the lead
    var [tall_bul,cnt_bul] = this.do_para(px,py,bullet,padding,factor,style);
    var [tall_txt,cnt_txt] = this.do_para(px+padding,py,text,extent-padding,factor,style);
    var all = [];
    all.push(cnt_bul);
    all.push(cnt_txt);
    return [tall_txt,all.join('\n')];
  }
  do_list_item(px,py,lead,cnt,extent,factor,style){
    ///the indent
    var txt = lead + ' ' + this.uncode(style,cnt);
    var align = 'left';
    var indent = 0;
    var hanging = 26;//0.55cm hanging
    return this.do_para(px,py,txt,extent,factor,{...style,align,indent,hanging});
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  ////////////////////////////////////////////////////////////////////////////////////////
  do_para(px,py,txt,extent,factor,style){
    ///note that the 'txt' here should've already been 'uncoded'
    var align = style.align||'';
    var indent = parseFloat(style.indent)||0;
    var hanging = parseFloat(style.hanging)||0;
    var segment_array = this.diagram.tokenizer.to_cairo_segment_array(txt,extent,factor,style);
    var indent = 0;
    var hanging = 0;
    var pp = this.diagram.cairo_segment_array_to_pp(px,py,segment_array,extent,factor,align,indent,hanging);
    ///find out the maximum seq
    var max_seq = pp.reduce((acc,cur) => Math.max(acc,cur.seq), 0);
    ///draw line-by-line
    var tall = 0;
    var all = [];
    for(var i=0; i <= max_seq; ++i){
      let line_height = 0;
      pp.forEach((p) => {
        if(p.seq==i){
          if(p.key=='latin' || p.key=='punc' || p.key=='unicode'){
            var fontfamily = this.diagram.g_to_svg_fontfamily_str(p.g);
            var fontstyle = this.diagram.g_to_svg_fontstyle_str(p.g);
            var fontweight = this.diagram.g_to_svg_fontweight_str(p.g);
            var x = p.x;
            var y = p.y + p.dy;
            var w = p.w;
            var h = p.h;
            line_height = Math.max(line_height,h);
            var txt = p.txt;
            var textlength = p.textlength;
            var anchor = 'start';
            all.push(`<text transform='translate(${this.fix(x)} ${this.fix(y)}) scale(${factor})' whmid='${this.fix(p.w)} ${this.fix(p.h)} ${this.fix(p.mid)}' font-family='${fontfamily}' font-style='${fontstyle}' font-weight='${fontweight}' font-size='${this.diagram.tokenizer.fs}pt' text-anchor='${anchor}' ${this.diagram.g_to_svg_textdraw_str(style)} dy='${this.diagram.tokenizer.text_dy_pt}pt' textLength='${this.fix(textlength)}' lengthAdjust='spacingAndGlyphs'>${txt}</text>`);
          }else if(p.key=='svg'){
            var x = p.x;
            var y = p.y + p.dy;
            var w = p.w;
            var h = p.h;
            line_height = Math.max(line_height,h);
            var vw = p.vw;
            var vh = p.vh;
            let opt = '';
            opt += ` xmlns = 'http://www.w3.org/2000/svg'`;
            opt += ` xmlns:xlink='http://www.w3.org/1999/xlink'`;
            opt += ` width='${w}' height='${h}'`;
            opt += ` fill='inherit'`;
            opt += ` stroke='inherit'`;
            opt += ` viewBox='0 0 ${vw} ${vh}'`;
            all.push(`<svg x='${this.fix(x)}' y='${this.fix(y)}' whmid='${this.fix(p.w)} ${this.fix(p.h)} ${this.fix(p.mid)}' ${opt} >${p.svg}</svg>`);
          }
        }
      });      
      tall += line_height;
    }
    return [tall,all.join('\n')];
  }
}
module.exports = { NitrilePreviewPango };
