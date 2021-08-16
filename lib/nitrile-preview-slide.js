'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.name = 'slide';
    this.presentation = new NitrilePreviewPresentation(this);
    this.icon_subpoint = '&#x261E;'//WHITE RIGHT POINTING INDEX
    this.icon_solution = '&#x270D;'//WRITING HAND
    this.icon_folder = '&#x2615;'//HOT BEVERAGE
    this.uchar_checkboxo = '&#x2610;' //BALLOT BOX            
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.uchar_checkboxx = '&#x2612;' //BALLOT BOX WITH X
    this.n_para = '6pt';
    this.n_pack = '1.0pt';
    this.n_half = '2.25pt';
    this.n_marginleft = '8mm';
    this.n_marginright = '8mm';
    this.slide_width = 128;//mm
    this.slide_height = 96;//mm
    this.css_map = this.to_css_map();
    this.add_css_map_entry(
      this.css_map,
      'PARAGRAPH, PRIMARY, INDENT', [
        'text-align: justify',
        '-webkit-hyphens: auto',
        '-moz-hyphens: auto',
        '-ms-hyphens: auto',
        'hyphens: auto'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FIGCAPTION',[
        'width: 80%',
        'text-align: left',
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'SLIDETITLE', [
        'margin-left:10px',
        'margin-right:10px',
        'margin-top:2mm',
        'margin-bottom:0',
        'font-size:1.40em',
        'font-weight:normal',
        'color: #1010B0'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'SLIDESUBTITLE', [
        'margin-left:10px',
        'margin-right:10px',
        'margin-top:3mm',
        'margin-bottom:0',
        'font-size:0.9em',
        'font-weight:normal',
        'color: #1010B0'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERTITLE', [
        'margin-left: 6.5mm',
        'margin-top: 2.5cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.8em',
        'font-weight: bold',
        'color: #1010B0',
        'text-align: center',
        'align-self: center'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERSUBTITLE', [
        'margin-left: 6.5mm',
        'margin-top: 0.8cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERINSTITUTE', [
        'margin-left: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERAUTHOR', [
        'margin-left: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center'
      ]
    );
    this.add_css_map_entry(
      this.css_map,
      'FRONTMATTERDATE', [
        'margin-left: 6.5mm',
        'margin-top: 0.2cm',
        'margin-bottom: 0',
        'width: 115mm',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center'
      ]
    );
  }
  fence_to_dia(style,ss){
    var all = [];
    var o = this.diagram.to_diagram(style,ss);
    o = o.map((p) => {
      let s_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(p.vw)} ${this.fix(p.vh)}" >${p.svgtext}</svg>`;
      var css = this.css('DIA');
      if(style.frame){
        css += `; outline:1px solid currentColor`;
      }
      if(style.stretch){
        css += `; width:100%`;
        css += `; height:auto`;
      }else{
        css += `; width:${p.w}px`;
        css += `; height:${p.h}px`;
      }
      if(p.imgsrc){
        css += `; background-image:url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}"),url("${p.imgsrc}")`;
        if(style.fit=='contain'){
          css += `; background-size:contain,contain`;
        }else if(style.fit=='cover'){
          css += `; background-size:contain,cover`;
        }else{
          css += `; background-size:contain,100% 100%`;
        }
        if(style.position=='fixed'){
          css += `; background-position:center,0 0`;
        }else{
          css += `; background-position:center,center`;
        }
        css += `; background-repeat:no-repeat`;
      }else{
        css += `; background-image:url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}")`;
        css += `; background-size:contain`;
        css += `; background-position:center`;
        css += `; background-repeat:no-repeat`;
      }
      p.img = (`<canvas style='${css}' data-type='board' width='${p.vw}' height='${p.vh}'></canvas>`);
      p.subc = this.uncode(style,p.subtitle);
      return p;
    });
    return o;
  }
  to_peek_document() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    var html = this.replace_all_refs(html);
    return `${title_html}\n${html}`;
  }
  to_document() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    var html = this.replace_all_refs(html);
    var html = `${title_html}\n${html}`;
    var title = this.parser.conf_to_string('title');
    var style = this.parser.style;
    var title = this.uncode(style,title);
    var setup_script = this.to_setup_script();
    var trigger_stylesheet = this.to_trigger_stylesheet();
    var slide_stylesheet = `\
    a {
      color: inherit;
    }
    a:link {
      text-decoration: none;
    }
    a:visited {
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    a:active {
      text-decoration: underline;
    }
    @media print {

      @page {
        size: 128mm 96mm;
      }  
  
      .SLIDE {
        color: black;
        page-break-inside: avoid;
        page-break-after: always;
        min-width:100%;
        max-width:100%;
        box-sizing:border-box;
        overflow: hidden;
        padding:1px 0;
      }
  
      body {
        margin:0;
        padding:0;
        font-family: sans-serif;
        font-size: 10pt;
        line-height: 1.15;
      }

      figure * {
        font-family: sans-serif;
        font-size: 10pt;
        line-height: 1.15;
      }
    }
  
    @media screen {
  
      .SLIDE {
        color: black;
        background-color: white;
        margin: 1em auto;
        min-width:128mm;
        max-width:128mm;
        min-height:96mm;
        max-height:96mm;
        box-sizing:border-box;
        overflow: hidden;
        padding:1px 0;
      }
  
      body {
        background-color: gray;
        box-sizing:border-box;
        font-family: sans-serif;
        font-size: 10pt;
        line-height: 1.15;
        padding:1px 0;
      }

      figure * {
        font-family: sans-serif;
        font-size: 10pt;
        line-height: 1.15;
      }

    }
    `
    var xhtmldata = `\
<?xml version='1.0' encoding='UTF-8'?>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<link href='style.css' rel='stylesheet' type='text/css'/>
<style>
${trigger_stylesheet}
${slide_stylesheet}
</style>
</head>
<body onload='setup()'>
<script>
//<![CDATA[
${setup_script}
//]]>
</script>
<main class='PAGE'>
${html}
</main>
</body>
</html>
`;
    return xhtmldata;
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
        let out = this.write_frame_folder(`${i+1}`,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,j) => {
          let id = `${i+1}.${j+1}`;
          let order = '';
          let icon = this.icon_folder;
          let out = this.write_one_frame(id,order,icon,subframe,1,`${i+1}`);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = i+1;
        let icon = '';
        let out = this.write_one_frame(id,order,icon,topframe,0,'');
        d.push(out);
      }
    });
    var main = d.join('\n');
    //
    //table of contents
    //
    var toc = this.write_frame_toc(topframes);
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d.join('\n');
  }
  write_frame_toc(topframes){
    /// decide if we need to change fonts
    var all = [];
    var n = 0;
    var max_n = 16;
    topframes.forEach((topframe,j,arr) => {
      if(n==max_n){
        all.push(`</ul>`);
        all.push('</div>')
        all.push('</article>');
        all.push(''); 
        n=0;
      }
      let slidetitle_css = this.css('SLIDETITLE');
      let paragraph_css = this.css('PARAGRAPH');
      let ul_css = this.css('PARA UL');
      let li_css = this.css('PACK');
      if(n==0){
        all.push(`<article row='0' class='SLIDE'>`);
        all.push(`<h1 style='${slidetitle_css}'> <b>Table Of Contents</b> </h1>`);
        all.push(`<div style='${paragraph_css}'>`)
        all.push(`<ul style='${ul_css}; list-style:none;'>`);
      }
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`<li style='${li_css}; position:relative'> ${icon} <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> ${this.icon_folder} </li>`);
      }else{
        all.push(`<li style='${li_css}; position:relative'> ${icon} <b> <a href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </b> </li>`);
      }
      n++;
    });
    all.push(`</ul>`);
    all.push('</div>')
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_frame_folder(id,frame,subframes){
    let slidetitle_css = this.css('SLIDETITLE');
    let itemize_css = this.css('ITEMIZE');
    let paragraph_css = this.css('PARAGRAPH');
    let ul_css = this.css('PARA UL');
    let li_css = this.css('PACK LI');

    let all = [];
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' row='${frame.style.row}'>`);
    all.push(`<h1 style='${slidetitle_css}'> ${id} <b>${this.uncode(frame.style,frame.title)}</b> ${this.icon_folder} </h1>`);
    frame.contents.forEach((x) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    // FONT
    all.push(`<div style='${itemize_css}' >`)
    subframes.forEach((subframe,j,arr) => {
      if(j==0){
        all.push(`<ul style='${ul_css}; list-style:none;'>`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${this.icon_folder}</span>`;
      all.push(`<li style='${li_css}; position:relative'> ${icon} <b> <a href='#frame${id}.${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </b> </li>`);
      if(j+1==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push(`</div>`);
    all.push('</article>');
    all.push('');
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  write_one_frame(id,order,icon,frame,issub,parentid){
    let slidetitle_css = this.css('SLIDETITLE');
    let itemize_css = this.css('ITEMIZE');
    let paragraph_css = this.css('PARAGRAPH');
    let ul_css = this.css('PARA UL');
    let li_css = this.css('PACK LI');

    let all = [];
    let v = null;
    const re_choice = /^(.*?):([\w\/]+)$/;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' row='${frame.style.row}'>`);
    all.push(`<h1 style='${slidetitle_css}'>${order} <a href='#frame${parentid}'>${icon}</a> <b>${this.uncode(frame.style,frame.title)}</b> </h1>`);
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    all.push(`<ul style='${itemize_css}; list-style:none; padding:0;'>`);
    frame.solutions.forEach((o,i,arr) => {
      if((v=re_choice.exec(o.title))!==null){
        all.push(`<li style='${li_css}'> ${this.icon_solution} <i>${this.uncode(o.style,v[1])}</i> </li>`);
        let text = this.to_choice(o.style,o.body);
        all.push(text);
      }else{
        all.push(`<li style='${li_css}'> ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> </li>`);
      }
    });
    all.push(`</ul>`);
    if(frame.solutions.length==0){
      all.pop();
      all.pop();
    }
    all.push('</article>');
    all.push('');
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      let title_css = this.css('SLIDETITLE');
      let subtitle_css = this.css('SLIDESUBTITLE');
      all.push(`<article class='SLIDE' row='${o.style.row}'>`);
      all.push(`<h1 style='${title_css}'> &#160; </h1>`);
      if((v=re_choice.exec(o.title))!==null){
        let icon = this.icon_solution;
        let title = this.uncode(o.style,v[1]);
        let text = this.to_choice(o.style,o.body,v[2])
        all.push(`<h2 style='${subtitle_css}'> ${icon} <i> ${title} &#160; ${text} </i> </h2>`)
      }else{
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.untext(o.style,o.body).trim();
        all.push(`<h2 style='${subtitle_css}'> ${icon} <i> ${title} &#160; ${text} </i> </h2>`)
      }
      o.contents.forEach((x) => {
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
  to_titlepage(){
    let title     = this.parser.conf_to_string('title','Untitled');
    let subtitle  = this.parser.conf_to_string('subtitle')
    let institute = this.parser.conf_to_string('institute');
    let author    = this.parser.conf_to_string('author');
    var style     = this.parser.style;
    var date      = new Date().toLocaleDateString();
    let data = `<article row='0' class='SLIDE'>
    <div style='${this.css('FRONTMATTERTITLE')}' >${this.uncode(style,title)}</div>
    <div style='${this.css('FRONTMATTERSUBTITLE')}' >${this.uncode(style,subtitle)}</div>
    <div style='${this.css('FRONTMATTERINSTITUTE')}' >${this.uncode(style,institute)}</div>
    <div style='${this.css('FRONTMATTERAUTHOR')}' >${this.uncode(style,author)}</div>
    <div style='${this.css('FRONTMATTERDATE')}' >${this.uncode(style,date)}</div>
    </article>
    `;
    return data;
  }
  to_choice(style,body,check){
    body = body.filter((s) => s.length)
    var all = [];
    var re_word = /^(\w+)/;
    var v;
    var checks = check?check.split('/'):[];
    all.push(`<ul style='list-style:none; padding:0;'>`);
    body.forEach((s) => {
      var start;
      if((v=re_word.exec(s))!==null){
        start = v[1];
      }
      if(this.is_in_list(start,checks)){
        all.push(`<li> ${this.uchar_checkboxc} ${this.uncode(style,s)} </li>`)
      }else{
        all.push(`<li> ${this.uchar_checkboxo} ${this.uncode(style,s)} </li>`)
      }
    })
    all.push(`</ul>`)
    return all.join('\n')
  }
  to_fontsize(length){
    var fontsize = '';
    if( length > 16 ){
      fontsize = '90%';
    }
    if( length > 18 ){
      fontsize = '80%';
    }
    if( length > 20 ){
      fontsize = '70%';
    }
    if( length > 24 ){
      fontsize = '60%';
    }
    return fontsize;
  }
  to_setup_script(){
    return `\
    function setup(){
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        var type = canvas.getAttribute('data-type');
        if(type=='ball'){
          ball_setup_canvas(canvas);
        }else if(type=='board'){
          board_setup_canvas(canvas);
        }
      }
      draw_canvas();
      document.onmousemove=function(evt){
        if(evt.target.nodeType==1&&evt.target.nodeName=='canvas'){
          var type = evt.target.getAttribute('data-type');
          if(type=='board'){
            board_onmousemove(evt);
          }else if(type=='ball'){
            ball_onmousemove(evt);
          }
        }
      }
      document.onmousedown=function(evt){
        if(evt.target.nodeType==1&&evt.target.nodeName=='canvas'){
          var type = evt.target.getAttribute('data-type');
          if(type=='board'){
            board_onmousedown(evt);
          }else if(type=='ball'){
            ball_onmousedown(evt);
          }
        }
      }
      document.onmouseup=function(evt){
        if(evt.target.nodeType==1&&evt.target.nodeName=='canvas'){
          var type = evt.target.getAttribute('data-type');
          if(type=='board'){
            board_onmouseup(evt);
          }else if(type=='ball'){
            ball_onmouseup(evt);
          }
        }
      }
    }
    function board_setup_canvas(canvas){
      var ctx = canvas.getContext("2d");
      ctx.d = {};
    }
    function board_draw_canvas(canvas){
    }
    function board_onmousemove(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      ctx.d.myposx = evt.offsetX*sx;
      ctx.d.myposy = evt.offsetY*sy;
      if(evt.buttons){
        if(evt.shiftKey){
          var lw = 4*sx;
          ctx.clearRect(ctx.d.myposx-(lw/2),ctx.d.myposy-(lw/2),lw,lw);
        }else{
          var lw = 2*sx;
          ctx.fillStyle = "black";
          ctx.fillRect(ctx.d.myposx-(lw/2),ctx.d.myposy-(lw/2),lw,lw);
        }
      }
    }
    function board_onmousedown(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      ctx.d.myposx = evt.offsetX*sx;
      ctx.d.myposy = evt.offsetY*sy;
      if(1){
        if(evt.shiftKey&&evt.altKey){
          ctx.clearRect(0,0,canvas.getAttribute("width"),canvas.getAttribute("height"));
        }else if(evt.shiftKey){
          var lw = 4*sx;
          ctx.clearRect(ctx.d.myposx-(lw/2),ctx.d.myposy-(lw/2),lw,lw);
        }else{
          var lw = 2*sx;
          ctx.fillStyle = "black";
          ctx.fillRect(ctx.d.myposx-(lw/2),ctx.d.myposy-(lw/2),lw,lw);
        }
      }
    }
    function board_onmouseup(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function ball_setup_canvas(canvas){
      cx = canvas.getContext('2d');
      var json = canvas.getAttribute('json');
      if(json){
        //only setup this canvas if it has a 'json' attribute
        var balls = JSON.parse(json);
        console.log('balls',balls);
        cx.font = "40px Arial";
        cx.lineWidth = 4;//px
        cx.lineCap = "round";
        cx.lineJoin = "round";
        cx.fillStyle = "green";
        cx.fillText('Hello canvas!',100,100);
        //canvas.addEventListener("mousedown", ball_onmousedown, false);
        //canvas.addEventListener("mouseup", ball_onmouseup, false);
        //canvas.addEventListener("mousemove", ball_onmousemove, false);
        cx.d = {};
        cx.d.dirty = 1;
        cx.d.balls = balls;
        cx.d.currmousex = -1;
        cx.d.currmousey = -1;
        cx.d.hitball = null;//the ball being hit the last time
        cx.d.downball = null;//the current ball being pressed down
        cx.d.hitcorner = -1;// the corner last hit by the mouse
        cx.d.downcorner = -1;//the index for the corner that is down
        cx.d.showmode = 0;//0=corners,1=centroid
        cx.d.rotateflag = 0;
        cx.d.moveflag = 0;
        cx.d.insideflag = 0;
        cx.d.movedistx = 0;
        cx.d.movedisty = 0;
        cx.d.downmousex = 0;
        cx.d.downmousey = 0;
        cx.d.initmousex = 0;
        cx.d.initmousey = 0;
        cx.d.rotateangle = 0;
        cx.d.rotatex0 = 0;
        cx.d.rotatey0 = 0;
      }
    }
    function draw_canvas(timestamp){
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        var type = canvas.getAttribute('data-type');
        if(type=='ball'){
          ball_draw_canvas(canvas);
        }else if(type=='board'){
          board_draw_canvas(canvas);
        }
      }
      requestAnimationFrame(draw_canvas);
    }
    function ball_draw_canvas(canvas){
      var cx = canvas.getContext('2d');
      if(cx && cx.d && cx.d.dirty){
        cx.d.dirty = 0;
        cx.clearRect(0,0,500,500);
        cx.d.hitball = null;
        cx.d.balls.forEach((ball) => {
          cx.save();
          let [a,b,c,d,e,f] = ball.transform;
          cx.setTransform(a,b,c,d,e,f);
          if(cx.d.rotateflag && ball == cx.d.downball){
            cx.translate(cx.d.rotatex0,cx.d.rotatey0);
            cx.rotate(cx.d.rotateangle);
            cx.translate(-cx.d.rotatex0,-cx.d.rotatey0);
          }else if(cx.d.moveflag && ball == cx.d.downball){
            let matrix = cx.getTransform();
            let a = matrix.a;
            let b = matrix.b;
            let c = matrix.c;
            let d = matrix.d;
            let e = matrix.e;
            let f = matrix.f;
            cx.setTransform(1,0,0,1,0,0);
            cx.translate(cx.d.movedistx,cx.d.movedisty);
            cx.transform(a,b,c,d,e,f);
          }
          cx.beginPath();
          ball.points.forEach((pt) => {
            let {op,x,y,cp1x,cp1y,cp2x,cp2y,x1,y1,x2,y2,r,ry,sAngle,eAngle,anticlockflag} = pt;
            switch(op){
              case 'M':
                cx.moveTo(x1,y1);
                break;
              case 'L':
                cx.lineTo(x1,y1);
                break;
              case 'A':
                cx.arcTo(x1,y1,x2,y2,r);
                break;
              case 'a':
                cx.arc(x1,y1,r,sAngle,eAngle,anticlockflag);
                break;
              case 'e':
                var rotation = 0;
                cx.ellipse(x1,y1,r,ry,rotation,sAngle,eAngle,anticlockflag);
                break;
              case 'z':
                cx.closePath();
                break;
            }
          });
          if(1||ball.type=='line'||ball.type=='polyline'){
            var hitflag = cx.isPointInStroke(cx.d.currmousex,cx.d.currmousey);
          }else{
            var hitflag = cx.isPointInPath(cx.d.currmousex,cx.d.currmousey);
          }
          if(hitflag){
            cx.d.hitball = ball;
          }
          if(hitflag){
            cx.strokeStyle = 'blue';
            cx.stroke();
          }else if(cx.d.downball===ball){
            cx.strokeStyle = 'blue';
            cx.stroke();
          }else{
            cx.stroke();
          }
          if(cx.d.downball===ball){
            drawBallCorners(cx,ball);
          }
          cx.restore();
        });
      }
    }
    function drawBallCorners(cx,ball){
      cx.save();
      cx.d.hitcorner = -1;
      ball.points.forEach((pt,i) => {
        cx.fillStyle = 'yellow';
        cx.strokeStyle = 'black';
        cx.lineWidth = 1;
        cx.beginPath();
        let {op,x,y,cp1x,cp1y,cp2x,cp2y,x1,y1,x2,y2,r} = pt;
        switch(op){
          case 'z':
            break;
          default:
            cx.rect(x-5,y-5,10,10);
            break;
        }
        let hitflag = cx.isPointInPath(cx.d.currmousex,cx.d.currmousey);
        if(hitflag){
          cx.d.hitcorner = i;
        }
        if(hitflag){
          cx.lineWidth = '2';
        }
        if(cx.d.downcorner >= 0 && cx.d.downcorner == i){
          cx.fillStyle = 'red';
        }
        cx.fill();
        cx.stroke();
      });
      cx.restore();
    }
    function drawBallCentroid(cx,ball){
      cx.save();
      cx.fillStyle = "yellow";
      cx.strokeStyle = "black";
      cx.lineWidth = 1;
      cx.beginPath();
      let [x,y] = getBallCentroid(ball);
      cx.arc(x,y,10,0,Math.PI*2,false);
      cx.closePath();
      cx.fill();
      cx.stroke();
      cx.restore();
    }
    function ball_onmousedown(evt){
      var canvas = evt.target;
      var cx = canvas.getContext('2d');
      cx.d.dirty = 1;
      cx.d.currmousex = evt.offsetX;
      cx.d.currmousey = evt.offsetY;
      ///check for switching to a new ball
      if(cx.d.hitball && cx.d.downball && cx.d.hitball != cx.d.downball){
        cx.d.downball = cx.d.hitball;
        cx.d.hitcorner = -1;
        cx.d.downcorner = -1;
      } else if(cx.d.hitball && !cx.d.downball && cx.d.hitball != cx.d.downball){
        cx.d.downball = cx.d.hitball;
        cx.d.hitcorner = -1;
        cx.d.downcorner = -1;
      }
      ///check for corners of existing ball
      if(cx.d.downball && cx.d.downcorner >= 0 && cx.d.downcorner != cx.d.hitcorner){
        //start rotate
        cx.d.rotateflag = 1;
        cx.d.rotateangle = 0;
        let [x0,y0] = getBallPointXY(cx.d.downball,cx.d.downcorner);
        cx.d.rotatex0 = x0;
        cx.d.rotatey0 = y0;
        cx.d.initmousex = evt.offsetX;
        cx.d.initmousey = evt.offsetY;
      }else if(cx.d.downball && cx.d.hitball && cx.d.downball == cx.d.hitball){
        //start move
        cx.d.moveflag = 1;
        cx.d.movedistx = 0;
        cx.d.movedisty = 0;
        cx.d.initmousex = evt.offsetX;
        cx.d.initmousey = evt.offsetY;
      }else if(cx.d.downball && cx.d.hitcorner >= 0){
        cx.d.insideflag = 1;
        cx.d.initmousex = evt.offsetX;
        cx.d.initmousey = evt.offsetY;
        cx.d.rotateflag = 0;
        cx.d.moveflag = 0;
      }else{
        cx.d.initmousex = evt.offsetX;
        cx.d.initmousey = evt.offsetY;
        cx.d.rotateflag = 0;
        cx.d.moveflag = 0;
      }
    }
    function ball_onmousemove(evt){
      var canvas = evt.target;
      var cx = canvas.getContext('2d');
      cx.d.dirty = 1;
      cx.d.currmousex = evt.offsetX;
      cx.d.currmousey = evt.offsetY;
      if(cx.d.rotateflag){
        let angle0 = Math.atan2(cx.d.initmousey-cx.d.downmousey,cx.d.initmousex-cx.d.downmousex);
        let angle1 = Math.atan2(cx.d.currmousey-cx.d.downmousey,cx.d.currmousex-cx.d.downmousex);
        cx.d.rotateangle = angle1-angle0;
      }else if(cx.d.moveflag){
        cx.d.movedistx = cx.d.currmousex - cx.d.initmousex;
        cx.d.movedisty = cx.d.currmousey - cx.d.initmousey;
      }
    }
    function ball_onmouseup(evt){
      var canvas = evt.target;
      var cx = canvas.getContext('2d');
      cx.d.dirty = 1;
      cx.d.currmousex = evt.offsetX;
      cx.d.currmousey = evt.offsetY;
      if(cx.d.rotateflag && cx.d.rotateangle != 0){
        cx.save();
        let [a,b,c,d,e,f] = cx.d.downball.transform;
        cx.setTransform(a,b,c,d,e,f);
        cx.translate(cx.d.rotatex0,cx.d.rotatey0);
        cx.rotate(cx.d.rotateangle);
        cx.translate(-cx.d.rotatex0,-cx.d.rotatey0);
        if(1){
          let matrix = cx.getTransform();
          let {a,b,c,d,e,f} = matrix;
          cx.d.downball.transform = [a,b,c,d,e,f];
        }
        cx.restore();
        cx.d.rotateflag = 0;
      }else if(cx.d.moveflag && (cx.d.movedistx != 0 || cx.d.movedisty != 0)){
        cx.save();
        let [a,b,c,d,e,f] = cx.d.downball.transform;
        cx.setTransform(1,0,0,1,0,0);
        cx.translate(cx.d.movedistx,cx.d.movedisty);
        cx.transform(a,b,c,d,e,f);
        if(1){
          let matrix = cx.getTransform();
          let {a,b,c,d,e,f} = matrix;
          cx.d.downball.transform = [a,b,c,d,e,f];
        }
        cx.restore();
        cx.d.moveflag = 0;
      }else if(cx.d.downball && cx.d.hitcorner >= 0){
        cx.d.downcorner = cx.d.hitcorner;
        cx.d.downmousex = evt.offsetX;
        cx.d.downmousey = evt.offsetY;
      }else if(cx.d.insideflag){
        cx.d.insideflag = 0;
        cx.d.hitcorner = -1;
        cx.d.downcorner = -1;
      }else{
        cx.d.downball = cx.d.hitball;
        cx.d.hitcorner = -1;
        cx.d.downcorner = -1;
      }
      cx.d.rotateflag = 0;
      cx.d.moveflag = 0;
    }
    function getBallPointXY(ball,corner){
      let theball1;
      let x, y;
      x = ball.points[corner].x;
      y = ball.points[corner].y;
      return [x,y];
    }
    function getBallCentroid(ball){
      let x = 0;
      let y = 0;
      let n = 0;
      ball.points.forEach((pt,i) => {
        if(pt.op=='z'){
        }else{
          x += pt.x;
          y += pt.y;
          n++;
        }
      });
      x /= n;
      y /= n;
      return [x,y];
    }`;
  }
}
module.exports = { NitrilePreviewSlide };
