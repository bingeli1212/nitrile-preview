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
    this.blank = 5 * 1.3333; //5pt inter-paragraph gap
    this.padding_dd = 1.15 * 37.8; //1.15cm 
    this.hanging    = 0.55 * 37.8; //0.55cm 
    this.cell_padding_left_right = 12; //12px 
    this.cell_padding_top_bottom = 2; //2px 
    this.frame_svgs = [];
    this.frame_svg = null;
    this.frame_svg_x = 0;
    this.frame_svg_y = 0;
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
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
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
    let all = [];
    //let my_id = this.get_refmap_value(my.style,'idnum');
    let icon = frame.isex?this.icon_exercise:this.icon_keypoint;
    let title = frame.title;

    //
    //NOTE: main contents
    //
    this.frame_svg = [];
    this.frame_svgs.push(this.frame_svg);
    this.frame_svg_x = this.frame_padding_left;
    this.frame_svg_y = this.frame_padding_top;
    this.frame_svg_y += this.do_frametitle(frame.style,icon,frame.title);
    return;

    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    frame.solutions.forEach((o,i,arr) => {
      if(i==0){
        all.push(`<ul class='LINE' style='list-style:none;padding:0;'>`);
      }
      ///TESTING
      var the_icon = this.icon_solution;
      if(arr.length==1) the_icon = this.icon_solution;
      all.push(`<li class='LINE'> ${the_icon} <i>${o.title}</i> </li>`);
      if(i+1==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push('</article>');
    all.push('');
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      ///TESTING
      var the_icon = '';
      if(arr.length==1) the_icon = this.icon_solution;
      all.push(`<article>`);
      if(1){
        all.push(`<hgroup>`);
        all.push(`<h1 class='frametitle'>${icon} <b>${title}</b> </h1>`);
        all.push(`<h2 class='framesubtitle'> <i>${o.title}</i> &#160; <b>${this.untext(o.style,o.body).trim()}</b> </h2>`)
        all.push(`</hgroup>`);
      }
      o.contents.forEach((x,i) => {
        //'x' is a block
        let html = this.translate_block(x);
        all.push('');
        all.push(html.trim());
      });
      all.push('</article>');
      all.push('');
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
  ///
  ///
  ///
  do_para(px,py,txt,extent,factor,align,g){
    var segment_array = this.diagram.tokenizer.to_cairo_segment_array(txt,g);
    var pp = this.diagram.cairo_segment_array_to_pp(segment_array,extent,0,0,factor);
    ///find out the maximum seq
    var max_seq = pp.reduce((acc,cur) => Math.max(acc,cur.seq), 0);
    ///draw line-by-line
    var line_height = 0;
    for(var i=0; i <= max_seq; ++i){
      var max_x = 0;
      pp.forEach((p) => {
        if(p.seq==i && (p.key=='latin'||p.key=='punc'||p.key=='unicode')){
          max_x = Math.max(max_x,p.x+p.w);
        }
      })
      if(align=='right'){
        var dx = extent - max_x;
      }else if(align=='center'){
        var dx = (extent - max_x)/2;
      }else{
        var dx = 0;
      }
      var dy = 0;
      line_height += this.do_line(px+dx,py+dy,pp,i,factor,g);
    }
    return line_height;
  }
  ///
  /// the x/y/extent is in SVG coordinates, 
  /// the txt is already encoded.
  ///
  do_line(dx,dy,pp,i,factor,g){
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
          this.frame_svg.push(`<text transform='translate(${this.fix(x)} ${this.fix(y)}) scale(${factor})' w='${this.fix(p.w)}' h='${this.fix(p.h)}' mid='${this.fix(p.mid)}' font-family='${fontfamily}' font-style='${fontstyle}' font-weight='${fontweight}' font-size='${this.diagram.tokenizer.fs}pt' text-anchor='${anchor}' ${this.diagram.g_to_svg_textdraw_str(g)} dy='${this.diagram.tokenizer.text_dy_pt}pt' textLength='${this.fix(textlength)}' lengthAdjust='spacingAndGlyphs'>${txt}</text>`);
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
          this.frame_svg.push(`<svg x='${this.fix(x)}' y='${this.fix(y)}' w='${this.fix(p.w)}' h='${this.fix(p.h)}' mid='${this.fix(p.mid)}' ${opt} >${p.svg}</svg>`);
        }
      }
    });
    return line_height;
  }
  //////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////
  do_frametitle(style,icon,title){
    var title = this.uncode(style,title);
    var factor = this.frametitle_factor;
    var line_height = 0;
    line_height = this.do_para(-this.frame_padding_left,0,icon,this.frame_padding_left-3,factor,'right',style);
    line_height = this.do_para(0,0,title,this.frame_extent,factor,'left',style);
    return line_height;
  }
}
module.exports = { NitrilePreviewPango };
