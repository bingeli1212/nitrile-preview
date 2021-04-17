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
    this.framesubtitle_scale = 0.8;
    this.framesubtitle_color = '#1010B0';
    this.padding_dd = 1.15 * 37.8; //1.15cm 
    this.hanging    = 0.55 * 37.8; //0.55cm 
    this.cell_padding_left_right = 12; //12px 
    this.cell_padding_top_bottom = 2; //2px 
    this.frame_svgs = [];
    this.frame_svg = null;
    this.frame_svg_x = 0;
    this.frame_svg_y = 0;
    this.frame_svg_blank = 0 * 1.3333; //5pt inter-paragraph gap
  }
  to_document() {
    this.to_titlepage();
    this.to_beamer();
    var frame_htmls = this.frame_svgs.map((all) => {
      let s = all.join('\n');
      s = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100%' height='auto' viewBox='0 0 ${this.frame_vw} ${this.frame_vh}'> ${s} </svg>`;
      s = `<article> ${s} </article>`;  
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

    article {
      page-break-inside: avoid;
      min-width:100%;
      max-width:100%;
      min-height:90mm;
      max-height:100%;
      box-sizing:border-box;
      overflow: hidden;
    }

    main {
      margin:0;
      padding:0;
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
      let dy = this.translate_block(x);
      if(Number.isFinite(dy)){
        this.frame_svg_y += dy;
      }
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
    var all = [];
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
    var dy = this.do_frametitle(0,0,style,icon,title);
    this.frame_svg_y += dy;
    this.frame_svg_y += this.frame_svg_blank;
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let dy = this.translate_block(x);
      if(Number.isFinite(dy)){
        this.frame_svg_y += dy;
        this.frame_svg_y += this.frame_svg_blank;
      }
    })
    frame.solutions.forEach((o,i,arr) => {
      var the_icon = this.icon_solution;
      var title = o.title;
      var style = o.style;
      var title = this.uncode(style,title);
      var txt = `${the_icon} ${title}`;
      var align = 'left';
      var dy = this.do_para(0,0,txt,this.frame_extent,this.fontsize_factor,align,style);
      this.frame_svg_y += dy;
    });
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      this.frame_svg = [];
      this.frame_svgs.push(this.frame_svg);
      this.frame_svg_x = this.frame_padding_left;
      this.frame_svg_y = this.frame_padding_top;
      var dy = this.do_frametitle(0,0,style,icon,title);
      this.frame_svg_y += dy;
      this.untext(o.style,o.body);
      ///content of each solution slide      
      o.contents.forEach((x,i) => {
        //'x' is a block
        let dy = this.translate_block(x);
        if(Number.isFinite(dy)){
          this.frame_svg_y += dy;
          this.frame_svg_y += this.frame_svg_blank;
        }
      });
    })
    //
    //NOTE: end
    //
    return all.join('\n');
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
    this.frame_svg_y += this.do_para(0,0,this.uncode(style,title),this.frame_extent,this.frontmattertitle_factor,'center',style);
    this.frame_svg_y += 40;
    this.frame_svg_y += this.do_para(0,0,this.uncode(style,subtitle),this.frame_extent,this.fontsize_factor,'center',style);
    this.frame_svg_y += 8;
    this.frame_svg_y += this.do_para(0,0,this.uncode(style,institute),this.frame_extent,this.fontsize_factor,'center',style);
    this.frame_svg_y += 8;
    this.frame_svg_y += this.do_para(0,0,this.uncode(style,author),this.frame_extent,this.fontsize_factor,'center',style);
    this.frame_svg_y += 8;
    this.frame_svg_y += this.do_para(0,0,this.uncode(style,date),this.frame_extent,this.fontsize_factor,'center',style);
  }
  //////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////
  do_frametitle(px,py,style,icon,title){
    var title = this.uncode(style,title);
    var factor = this.frametitle_factor;
    var line_height = 0;
    line_height = this.do_para(-10,py,`${icon} ${title}`,this.frame_extent,factor,'left',style);
    return line_height;
  }
  ///
  ///
  ///
  do_para_plst_item(px,py,lead,txt,extent,factor,style){
    ///the indent
    var dx = 22;
    ///draw the lead
    var line_height_lead = this.do_para(px,py,lead,dx,factor,'left',style)
    ///draw the text
    var segment_array = this.diagram.tokenizer.to_cairo_segment_array(txt,extent,style);
    var align = 'left';
    var indent = 0;
    var hanging = 20*factor;//0.55cm hanging
    var pp = this.diagram.cairo_segment_array_to_pp(segment_array,extent-dx,0,0,factor,align,indent,hanging);
    var max_seq = pp.reduce((acc,cur) => Math.max(acc,cur.seq), 0);
    ///draw line-by-line
    var line_height_text = 0;
    for(var i=0; i <= max_seq; ++i){
      line_height_text += this.do_line(px+dx,py,pp,i,factor,style);
    }
    var line_height = Math.max(line_height_lead,line_height_text)
    return line_height;
  }
  ///
  ///
  ///
  do_para_list_item(px,py,lead,txt,extent,factor,style){
    ///the indent
    txt = lead + ' ' + txt;
    ///draw the text
    var segment_array = this.diagram.tokenizer.to_cairo_segment_array(txt,extent,style);
    var align = 'left';
    var indent = 0;
    var hanging = 26*factor;//0.55cm hanging
    var pp = this.diagram.cairo_segment_array_to_pp(segment_array,extent,0,0,factor,align,indent,hanging);
    var max_seq = pp.reduce((acc,cur) => Math.max(acc,cur.seq), 0);
    ///draw line-by-line
    var dy = 0;
    for(var i=0; i <= max_seq; ++i){
      dy += this.do_line(px,py,pp,i,factor,style);
    }
    return dy;
  }
  ///
  ///
  ///
  do_para(px,py,txt,extent,factor,align,style){
    var indent = parseFloat(style.indent)||0;
    var hanging = parseFloat(style.hanging)||0;
    var segment_array = this.diagram.tokenizer.to_cairo_segment_array(txt,extent,style);
    var indent = 0;
    var hanging = 0;
    var pp = this.diagram.cairo_segment_array_to_pp(segment_array,extent,0,0,factor,align,indent,hanging);
    ///find out the maximum seq
    var max_seq = pp.reduce((acc,cur) => Math.max(acc,cur.seq), 0);
    ///draw line-by-line
    var line_height = 0;
    for(var i=0; i <= max_seq; ++i){
      line_height += this.do_line(px,py,pp,i,factor,style);
    }
    return line_height;
  }
  ///
  /// the x/y/extent is in SVG coordinates, 
  /// the txt is already encoded.
  ///
  do_line(dx,dy,pp,i,factor,style){
    var line_height = 0;
    pp.forEach((p) => {
      if(p.seq==i){
        if(p.key=='latin' || p.key=='punc' || p.key=='unicode'){
          var fontfamily = this.diagram.g_to_svg_fontfamily_str(p.g);
          var fontstyle = this.diagram.g_to_svg_fontstyle_str(p.g);
          var fontweight = this.diagram.g_to_svg_fontweight_str(p.g);
          var x = this.frame_svg_x + dx + p.x;
          var y = this.frame_svg_y + dy + p.y + p.dy;
          var w = p.w;
          var h = p.h;
          line_height = Math.max(line_height,h);
          var txt = p.txt;
          var textlength = p.textlength;
          var anchor = 'start';
          this.frame_svg.push(`<text transform='translate(${this.fix(x)} ${this.fix(y)}) scale(${factor})' whmid='${this.fix(p.w)} ${this.fix(p.h)} ${this.fix(p.mid)}' font-family='${fontfamily}' font-style='${fontstyle}' font-weight='${fontweight}' font-size='${this.diagram.tokenizer.fs}pt' text-anchor='${anchor}' ${this.diagram.g_to_svg_textdraw_str(style)} dy='${this.diagram.tokenizer.text_dy_pt}pt' textLength='${this.fix(textlength)}' lengthAdjust='spacingAndGlyphs'>${txt}</text>`);
        }else if(p.key=='svg'){
          var x = this.frame_svg_x + dx + p.x;
          var y = this.frame_svg_y + dy + p.y + p.dy;
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
          this.frame_svg.push(`<svg x='${this.fix(x)}' y='${this.fix(y)}' whmid='${this.fix(p.w)} ${this.fix(p.h)} ${this.fix(p.mid)}' ${opt} >${p.svg}</svg>`);
        }
      }
    });
    return line_height;
  }
  //////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////
  fence_to_list(style,body){
    var style = this.update_style_from_switches(style,'list')
    var itms = this.ss_to_list_itms(body,style);
    var bullet = '&#x2022;'
    const nbsp       = this.icon_nbsp;
    const squareboxo = this.icon_squareboxo;
    const squarebox  = this.icon_squarebox;
    const circleboxo = this.icon_circleboxo;
    const circlebox  = this.icon_circlebox;
    const check_ss = this.string_to_array(this.assert_string(style.check));
    var dy = 0;
    itms.forEach((p,i,arr) => {
      if(p.text=='\\\\'){
        p.text = '&#160;';
      }else{
        p.text = this.uncode(style,p.text);
      }
      p.value = this.uncode(style,p.value);
      p.bull = this.uncode(style,p.bull);
      if(p.type=='UL'){
        dy += this.do_para_list_item(0,dy,bullet,p.text,this.frame_extent,this.fontsize_factor,style)
      }
      else if(p.type=='OL'){
        let lead = `${i+1}`;
        dy += this.do_para_list_item(0,dy,lead,p.text,this.frame_extent,this.fontsize_factor,style)
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        let lead = `${p.value}${p.ending}`;
        dy += this.do_para_list_item(0,dy,lead,p.text,this.frame_extent,this.fontsize_factor,style)
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        let lead = `${this.to_a_letter(p.value)}${p.ending}`;
        dy += this.do_para_list_item(0,dy,lead,p.text,this.frame_extent,this.fontsize_factor,style)
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        let lead = `${this.to_A_letter(p.value)}${p.ending}`;
        dy += this.do_para_list_item(0,dy,lead,p.text,this.frame_extent,this.fontsize_factor,style)
      }
      else if(p.type == 'DL'){
        dy += this.do_para_list_item_dl(0,dy,p.value,p.text,this.frame_extent,this.fontsize_factor,style)
      }
      else if(p.type == 'CB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          dy += this.do_para_list_item(0,dy,squarebox,p.text,this.frame_extent,this.fontsize_factor,style)
        }else{
          //empty CB
          dy += this.do_para_list_item(0,dy,squareboxo,p.text,this.frame_extent,this.fontsize_factor,style)
        }
      }
      else if(p.type == 'RB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          dy += this.do_para_list_item(0,dy,circlebox,p.text,this.frame_extent,this.fontsize_factor,style)
        }else{
          //empty CB
          dy += this.do_para_list_item(0,dy,circleboxo,p.text,this.frame_extent,this.fontsize_factor,style)
        }
      }
      else {
        dy += this.do_para_list_item(0,dy,bullet,p.text,this.frame_extent,this.fontsize_factor,style)
      }
    });
    ///all fence_to_XXX methods would update the this.frame_svg_y itself
    return dy;
  }
  fence_to_plaintext(style,body){
    var style = this.update_style_from_switches(style,'list')
    var text = this.join_para(body);
    var text = this.uncode(style,text);
    return this.do_para(0,0,text,this.frame_extent,this.fontsize_factor,'left',style);
  }
  //////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////
  float_to_paragraph(title,label,style,body){
    var dy = this.untext(style,body);
    dy += this.frame_svg_blank;
    return dy;
  }
  fence_to_diagram(style,body){
    console.log(style,body);
    var style = this.update_style_from_switches(style,'diagram');
    if(style.animate){
      var { text } = this.diagram.to_animated_diagrams(style,body);
    }else{
      var { text } = this.diagram.to_diagram(style,body);
    }
    return this.do_para(0,0,text,this.frame_extent,this.fontsize_factor,'left',style);
  }
}
module.exports = { NitrilePreviewPango };
