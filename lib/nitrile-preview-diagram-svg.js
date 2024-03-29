'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { arcpath } = require('./nitrile-preview-arcpath');
const my_svglabel_dx = 4;///hardcoded for moving horizontally away from the anchor point in px
const my_svglabel_dy = 2;///hardcoded for moving vertically away from the anchor point in px
const ballscript=`\
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
`;
class NitrilePreviewDiagramSVG extends NitrilePreviewDiagram {

  constructor(translator) {
    super(translator);
    this.tokenizer = new NitrilePreviewTokenizer(translator);
    ///this are storages for offloading to <defs>
    this.my_gradient_array = [];
    this.my_arrowhead_array = [];
    this.my_textpath_array = [];
    this.my_filterblur_id = 0;
    this.MM_TO_PX = 3.7795296;
  }
  to_diagram(style,ss){
    this.init_internals(style);
    ss = this.trim_samp_body(ss);
    var [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    this.viewport_width = viewport_width;
    this.viewport_height = viewport_height;
    this.viewport_unit = viewport_unit;
    this.viewport_grid = viewport_grid;
    this.background = this.g_to_background_string(style);      
    this.width = this.g_to_width_float(style);
    this.height = this.g_to_height_float(style);
    this.stretch = this.assert_float(style.stretch,0,0,1);
    ///SVG-specific SETUPS
    ///u is now in px, so are vw and vh
    var u = viewport_unit*this.MM_TO_PX;
    var vw = u*viewport_width;
    var vh = u*viewport_height;
    this.u = u;
    this.vw = vw;
    this.vh = vh;
    this.my_gradient_array = [];
    this.my_arrowhead_array = [];
    this.my_textpath_array = [];
    this.my_filterblur_id = 0;
    ///EXECUTE BODY   
    var env = this.env;
    this.exec_body(style,ss,env);//this will likely update 'this.outputs'
    ///BACKGROUND
    var viewport_width = this.viewport_width;
    var viewport_height = this.viewport_height;
    var viewport_unit = this.viewport_unit;
    var viewport_grid = this.viewport_grid;
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    var vw = Math.round(inkwidth*this.MM_TO_PX);
    var vh = Math.round(inkheight*this.MM_TO_PX);
    ///COLLECT OUTPUT
    var d = this.commands.map(x => x.trim());
    var d = d.filter(s => (s && s.trim().length));
    var s = d.join("\n");
    ///ASSEMBLE OUTPUT
    var o = [];
    var n = this.viewport_grid;
    var smallgridid = this.get_css_id();
    o.push("<defs>");
    //o.push(`<pattern id="${smallgridid}" width="${u*n}" height="${u*n}" patternUnits="userSpaceOnUse"><path d="M ${u*n} 0 L 0 0 0 ${u*n}" fill="none" stroke="${gridcolor}" /></pattern>`);
    this.my_textpath_array.forEach((p) => {
      /*
        <path id="1" d="M0,0 L10,10"/>
      */
      o.push(`<path id="path${p.id}" d="${p.d}" />`);
    });
    this.my_arrowhead_array.forEach((p) => {
      /*
      //o.push(`<marker id="markerArrow" markerWidth="3" markerHeight="4" refX="3" refY="2" orient="auto"> <path d="M0,0 L3,2 L0,4 z" stroke="none" fill="context-stroke"/> </marker>`);
      //o.push(`<marker id="startArrow"  markerWidth="3" markerHeight="4" refX="0" refY="2" orient="auto"> <path d="M3,0 L3,4 L0,2 z" stroke="none" fill="context-stroke"/> </marker>`);
      */
     let linesize = parseFloat(p.linesize)||0; // in pt
     if(p.position=="end"){
        let Dx = linesize/2/4*3.5;
        let Color = this.string_to_svg_color(p.linecolor,"","inherit");
        o.push(`<marker id="marker${p.id}" markerWidth="4" markerHeight="4" refX="${4-Dx}" refY="2" orient="auto"> <path d="M0.5,0 L4,2 L0.5,4 z" fill="${Color}" stroke="none"/> </marker>`)
      }else if(p.position=="start"){
        let Dx = linesize/2/4*3.5;
        let Color = this.string_to_svg_color(p.linecolor,"","inherit");
        o.push(`<marker id="marker${p.id}" markerWidth="4" markerHeight="4" refX="${0+Dx}" refY="2" orient="auto"> <path d="M3.5,0 L0,2 L3.5,4 z" fill="${Color}" stroke="none"/> </marker>`)
      }
    })
    this.my_gradient_array.forEach(p => {
      if(p.type=="linear"){
        /*
        <linearGradient id="Gradient1" x1="" y1="" x2="" y2="">
        <stop offset="0%" stop-color="yellow"/>
        <stop offset="50%" stop-color="blue" />
        <stop offset="100%" stop-color="red" />
        </linearGradient>
        */
        if(p.ss.length==0){
          o.push(`<linearGradient id="shade${p.id}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"> <stop offset="0%" stop-color="white"/> <stop offset="100%" stop-color="black"/> </linearGradient>`);
        }else if(p.ss.length==1){
          o.push(`<linearGradient id="shade${p.id}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="100%" stop-color="black"/> </linearGradient>`);
        }else if(p.ss.length==2){
          o.push(`<linearGradient id="shade${p.id}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="100%" stop-color="${p.ss[1]}"/> </linearGradient>`);
        }else{
          o.push(`<linearGradient id="shade${p.id}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="50%" stop-color="${p.ss[1]}"/> <stop offset="100%" stop-color="${p.ss[2]}"/> </linearGradient>`);
        }
      }else if(p.type=="radial"){
        /*
        <radialGradient id="RadialGradient1">
        <stop offset="0%" stop-color="red"/>
        <stop offset="100%" stop-color="blue"/>
        </radialGradient>
        */
        if(p.ss.length==0){
          o.push(`<radialGradient id="shade${p.id}" cx="${p.cx}" cy="${p.cy}" fx="${p.fx}" fy="${p.fy}" r="${p.r}"> <stop offset="0%" stop-color="white"/> <stop offset="100%" stop-color="black"/> </radialGradient>`);
        }else if(p.ss.length==1){
          o.push(`<radialGradient id="shade${p.id}" cx="${p.cx}" cy="${p.cy}" fx="${p.fx}" fy="${p.fy}" r="${p.r}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="100%" stop-color="black"/> </radialGradient>`);
        }else{
          ///for radial there can only be two color choices
          o.push(`<radialGradient id="shade${p.id}" cx="${p.cx}" cy="${p.cy}" fx="${p.fx}" fy="${p.fy}" r="${p.r}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="100%" stop-color="${p.ss[1]}"/> </radialGradient>`);
        }
      }else if(p.type=="ball"){
        if(p.ss.length==0){
          o.push(`<radialGradient id="shade${p.id}" cx="${p.cx}" cy="${p.cy}" fx="${p.fx}" fy="${p.fy}" r="${p.r}"> <stop offset="0%" stop-color="white"/> <stop offset="100%" stop-color="rgb(128,128,128)"/> </radialGradient>`);
        }else{
          let color = p.ss[0];
          o.push(`<radialGradient id="shade${p.id}" cx="${p.cx}" cy="${p.cy}" fx="${p.fx}" fy="${p.fy}" r="${p.r}"> <stop offset="0%" stop-color="white"/> <stop offset="100%" stop-color="${color}"/> </radialGradient>`);
        }
      }
    });
    if(this.my_filterblur_id){
      /*
       <filter id="A">
       <feGaussianBlur stdDeviation="1" />
       </filter>
      */
      o.push(`<filter id="filter${this.my_filterblur_id}"> <feGaussianBlur stdDeviation="0.111"/> </filter>`);
    }
    o.push("</defs>");
    if(this.background=="grid"){
      let backgroundalpha = this.g_to_backgroundalpha_float(this.env);
      let gw = viewport_grid*viewport_unit*this.MM_TO_PX;
      let bgid = this.get_css_id();
      o.push(`<pattern patternUnits="userSpaceOnUse" id="pattern${bgid}" width="${gw}" height="${gw}"> <polyline points="0 0 ${gw} 0 ${gw} ${gw} 0 ${gw}" fill="none" stroke="currentColor" /> </pattern>`);
      o.push(`<rect x="0" y="0" width="${vw}" height="${vh}" fill="url(#pattern${bgid})" stroke="currentColor" opacity="${backgroundalpha}" />`);
    }
    ///all svg.
    o.push(s);
    var svgtext = o.join("\n");
    return { svgtext,ballscript,style };
  }
  localx(x) {
    /// * NOTE: this method translate and/or scale the local reference point to
    ///   SVG coords.
    ///
    x *= this.u;
    return x;
  }

  localdist(x) {
    x *= this.u;
    return x;
  }

  localy(y) {
    /// * NOTE: this method translate and/or scale the local reference point to
    ///   SVG coords.
    ///
    y = this.viewport_height-y;
    y *= this.u;
    return y;
  }
  localpt(pt) {
    /// * NOTE: this method translate and/or scale the local reference point to
    ///   SVG coords.
    ///
    let [x,y] = pt;;
    x = this.localx(x);
    y = this.localy(y);
    return [x,y];
  }
  ///
  ///
  ///
  coords_to_d(coords) {
    ///***NOTE: returns a list of objects, each object has three members: {iscycled,s,hints}
    ///***NOTE: i.e: (1,2)..(2,3)--cycle
    /// pt[0]: [1,2,'','','']
    /// pt[1]: [2,3,'..','','']
    /// pt[2]: ['z','','--','','']
    var o = [];
    var items = [];
    var iscycled = 0;
    var s = '';
    var x0 = 0;///last point
    var y0 = 0;
    var u = this.u;
    var hints = 0;
    var pt0 = [0,0];
    var pt = [0,0];
    for (var i in coords) {
      pt0[0] = pt[0];
      pt0[1] = pt[1];
      var pt = coords[i];
      var x = this.localx(pt[0]);///NOTE:becomes SVG coords
      var y = this.localy(pt[1]);
      var join = pt[2];
      var p1x = this.localx(pt[3]);/// CUBIC BEZIER curve controlpoint 1x
      var p1y = this.localy(pt[4]);/// CUBIC BEZIER curve controlpoint 1y
      var p2x = this.localx(pt[5]);/// CUBIC BEZIER curve controlpoint 2x
      var p2y = this.localy(pt[6]);/// CUBIC BEZIER curve controlpoint 2y
      
      ///In case we have a CUBIC BEZIER curve, then pt1 and pt2 are the control points
      if (join == 'M') {
        // terminate the current line segment
        if(o.length){
          iscycled = 0;
          s = o.join(' ');
          items.push({iscycled,s,hints});
          o = [];
        }
        o.push(`M${this.fix(x)},${this.fix(y)}`);
        x0 = x;
        y0 = y;
        hints = pt[12]||0;
      }
      else if (join == 'z') {
        if(o.length){
          ///NOTE: this is to prevent to have a 'z' as the only item in a path data string, which will generate an error by the browser
          o.push(`z`);
        }
        iscycled = 1;
        s = o.join(' ');
        o = [];
        items.push({iscycled,s,hints});
        continue;
      }
      else if(join == 'L'){
        ///NOTE: line
        o.push(`L${this.fix(x)},${this.fix(y)}`);
        x0 = x;
        y0 = y;
        continue;
      }
      else if (join == 'C') {
        o.push(`C${this.fix(p1x)},${this.fix(p1y)},${this.fix(p2x)},${this.fix(p2y)},${this.fix(x)},${this.fix(y)}`);
        x0 = x;
        y0 = y;
      }
      else if (join == 'Q') {
        o.push(`Q${this.fix(p1x)},${this.fix(p1y)},${this.fix(x)},${this.fix(y)}`);
        x0 = x;
        y0 = y;
      }
      else if (join == 'A') {
        var X1 = pt0[0];///X1/Y1 is the previous point
        var Y1 = pt0[1];
        var X2 = pt[0];///(X2,Y2) is the current point
        var Y2 = pt[1];  
        var Rx         = pt[7];       
        var Ry         = pt[8];      
        var Phi        = pt[9];        
        var bigarcflag = pt[10];        
        var sweepflag  = pt[11];        
        if (sweepflag) {
          ///following is to use the internal 'arcpath()' method to 
          ///readjust Rx and Ry in case it is too small
          ///NOTE: note that the arcpath() always assumes anti-clockwise. So if we are
          ///drawing clockwise we just need to swap the starting and end point
          ///for X1/Y1 and X2/Y2
          ///this.sweepflag=1: clockwise
          ///this.sweepflag=0: anti-clockwise
          var tmp = X1; X1 = X2; X2 = tmp;
          var tmp = Y1; Y1 = Y2; Y2 = tmp;
        } 
        Rx = Math.max(Rx,this.MIN_FLOAT);
        Ry = Math.max(Ry,this.MIN_FLOAT);
        var [Cx, Cy, Rx, Ry] = arcpath(X1, Y1, X2, Y2, Rx, Ry, Phi, bigarcflag);
        /// we only do this when 'Cx' and 'Cy' is not a NAN, otherwise the data
        /// passed in are non-sensical
        if(Number.isFinite(Cx) && Number.isFinite(Cy)){
          var Rx         = this.localdist(Rx);       
          var Ry         = this.localdist(Ry);        
          o.push(`A${this.fix(Rx)},${this.fix(Ry)},${-this.fix(Phi)},${bigarcflag?1:0},${sweepflag?1:0},${this.fix(x)},${this.fix(y)}`);
        }
        x0 = x;
        y0 = y;
      }
      else {
        // terminate the current line segment
        iscycled = 0;
        s = o.join(' ');
        o = [];
        items.push({iscycled,s,hints});
      }
    }
    if(o.length){
      iscycled = 0;
      s = o.join(' ');
      items.push({iscycled,s,hints});
    }
    return items;
  }

  ///////////////////////////////////////////////////////////////////////////////
  ///
  ///all primitive methods
  ///
  ///////////////////////////////////////////////////////////////////////////////
  p_comment(s) {
    s = s.replace(/\-\-/g,'==');
    s = s.replace(/</g, "&#x003c;");
    s = s.replace(/>/g, "&#x003e;");
    return `<!-- ${s} -->`;
  }
  p_header(opt,x,y,vpw,vph,txt,g){
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    var x = x * this.u;
    var y = y * this.u;
    var vpw = vpw * this.u;
    var vph = vph * this.u;
    var v;
    if(this.g_to_math_int(g)){
      var is_math = 1;
    }else if((v=this.re_is_math.exec(txt))!==null){
      txt = v[1];
      var is_math = 1;
    }else{
      var is_math = 0;
    }
    if(is_math){
      ///font size and factor and math text
      var fontsize = this.g_to_fontsize_float(g);
      if(!fontsize){
        fontsize = this.fontsize;
      }
      var used = new Set();
      var {s,w,h} = this.tokenizer.to_svgmath(txt,g,used,0);
      var defs = this.tokenizer.buildup_defs(used);
      var factor = fontsize/this.translator.tokenizer.fs;
      var vw = w*1.333;///convert to px
      var vh = h*1.333;///convert to px
      var width = w*1.333;
      var height = h*1.333;
      width *= factor;
      height *= factor;
      if(opt=='l'){
        return `<g transform='translate(${3},${3})'><svg width="${width}" height="${height}" fill="currentColor" stroke="none" viewBox="0 0 ${vw} ${vh}"><defs>${defs.join('\n')}</defs>${s}</svg></g>`;  
      }else if(opt=='r'){
        return `<g transform='translate(${vpw-width-3},${3})'><svg width="${width}" height="${height}" fill="currentColor" stroke="none" viewBox="0 0 ${vw} ${vh}"><defs>${defs.join('\n')}</defs>${s}</svg></g>`;  
      }else{
        return `<g transform='translate(${(vpw-width)/2},${3})'><svg width="${width}" height="${height}" fill="currentColor" stroke="none" viewBox="0 0 ${vw} ${vh}"><defs>${defs.join('\n')}</defs>${s}</svg></g>`;
      }
    } else {
      var txt = this.translator.smooth(g,txt);
      if(opt=='l'){
        return `<text x="${3}" y="${3}" font-size="${fontsize}pt" text-anchor="start" ${this.g_to_svg_textdraw_str(g)} dy="0.78em">${txt}</text>`;
      }else if(opt=='r'){
        return `<text x="${vpw-3}" y="${3}" font-size="${fontsize}pt" text-anchor="end" ${this.g_to_svg_textdraw_str(g)} dy="0.78em">${txt}</text>`;
      }else{
        return `<text x="${vpw/2}" y="${3}" font-size="${fontsize}pt" text-anchor="middle" ${this.g_to_svg_textdraw_str(g)} dy="0.78em">${txt}</text>`;
      }
    }
  }
  p_footer(opt,x,y,vpw,vph,txt,g){
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    var x = x * this.u;
    var y = y * this.u;
    var vpw = vpw * this.u;
    var vph = vph * this.u;
    var v;
    if(this.g_to_math_int(g)){
      var is_math = 1;
    }else if((v=this.re_is_math.exec(txt))!==null){
      txt = v[1];
      var is_math = 1;
    }else{
      var is_math = 0;
    }
    if(is_math){
      ///font size and factor and math text
      var fontsize = this.g_to_fontsize_float(g);
      if(!fontsize){
        fontsize = this.fontsize;
      }
      var used = new Set();
      var {s,w,h} = this.tokenizer.to_svgmath(txt,g,used,0);
      var defs = this.tokenizer.buildup_defs(used);
      var factor = fontsize/this.translator.tokenizer.fs;
      var vw = w*1.333;///convert to px
      var vh = h*1.333;///convert to px
      var width = w*1.333;
      var height = h*1.333;
      width *= factor;
      height *= factor;
      if(opt=='l'){
        return `<g transform='translate(${3},${vph-height})'><svg width="${width}" height="${height}" fill="currentColor" stroke="none" viewBox="0 0 ${vw} ${vh}"><defs>${defs.join('\n')}</defs>${s}</svg></g>`;  
      }else if(opt=='r'){
        return `<g transform='translate(${vpw-width-3},${vph-height})'><svg width="${width}" height="${height}" fill="currentColor" stroke="none" viewBox="0 0 ${vw} ${vh}"><defs>${defs.join('\n')}</defs>${s}</svg></g>`;  
      }else{
        return `<g transform='translate(${(vpw-width)/2},${vph-height})'><svg width="${width}" height="${height}" fill="currentColor" stroke="none" viewBox="0 0 ${vw} ${vh}"><defs>${defs.join('\n')}</defs>${s}</svg></g>`;
      }
    } else {
      var txt = this.translator.smooth(g,txt);
      if(opt=='l'){
        return `<text x="${3}" y="${vph}" font-size="${fontsize}pt" text-anchor="start" ${this.g_to_svg_textdraw_str(g)} dy="-0.22em">${txt}</text>`;
      }else if(opt=='r'){
        return `<text x="${vpw-3}" y="${vph}" font-size="${fontsize}pt" text-anchor="end" ${this.g_to_svg_textdraw_str(g)} dy="-0.22em">${txt}</text>`;
      }else{
        return `<text x="${vpw/2}" y="${vph}" font-size="${fontsize}pt" text-anchor="middle" ${this.g_to_svg_textdraw_str(g)} dy="-0.22em">${txt}</text>`;
      }
    }
  }
  p_image(x,y,w,h,ta,imgsrc,g){
    var { imgsrc, imgid } = this.translator.to_request_image(imgsrc);
    //shift the image based on the settings of 'ta'
    switch(ta){
      case 'c' : x+=w/2; y+=h/2; break;
      case 'ul': x-=w;           break;
      case 'bl': x-=w;   y-=h;   break;
      case 'ur' :                 break;
      case 'br' :         y-=h;   break;
      case 'u' : x+=w/2;         break;
      case 'b' : x+=w/2; y-=h;   break;
      case 'l' : x-=w;   y-=h/2; break;
      case 'r'  :         y-=h/2; break;
    }
    //draw image
    x = this.localx(x);
    y = this.localy(y);
    w = this.localdist(w);
    h = this.localdist(h);
    y = y-h;//SVG origin is at the topleft
    var preserveAspectRatio = '';
    if(this.g_to_fit_string(g)=='contain'){
      preserveAspectRatio = 'xMidYMid meet';
    }else if(this.g_to_fit_string(g)=='cover'){
      preserveAspectRatio = 'xMidYMid slice';
    }else{
      preserveAspectRatio = 'none';
    }
    var img = `<image x="${x}" y="${y}" width="${w}" height="${h}" xlink:href="${imgsrc}" id="${imgid}" preserveAspectRatio="${preserveAspectRatio}"/>`;
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_label(x,y,txt,ta,g){
    const re = /^\\\((.*)\\\)$/;
    let v;
    if(this.g_to_math_int(g)){
      return this.p_math(x,y,txt,ta,g);
    } else if((v=re.exec(txt))!==null){
      return this.p_math(x,y,v[1],ta,g);
    }else{
      return this.p_text(x,y,txt,ta,g);
    }
  }
  p_math(x,y,txt,ta,g) {
    if(!txt) return '';
    ///ta=lrt|urt|llft|ulft|top|bot...    
    /// (x,y) is now in SVG-coordinates. 
    var x = this.localx(x);
    var y = this.localy(y);
    ///font size and factor and math text
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    var factor = fontsize/this.translator.tokenizer.fs;
    var used = new Set();
    var {s,w,h} = this.tokenizer.to_svgmath(txt,g,used,0);
    var defs = this.tokenizer.buildup_defs(used);

    ///is it inline math ort?
    var d = [];
    var dx = 0;
    var dy = 0;
    var vw = w*1.333;///convert to px
    var vh = h*1.333;///convert to px
    var width = w*1.333;
    var height = h*1.333;
    width *= factor;
    height *= factor;
    var anchor = 'middle', valign = '';
    if (ta==='br') {
      anchor = 'start';
      valign = 'lower';
    } else if (ta==='b') {
      anchor = 'middle';
      valign = 'lower';
      dx -= width/2;
    } else if (ta==='bl') {
      anchor = 'end';
      valign = 'lower';
      dx -= width;
    } else if (ta==='ur') {
      anchor = 'start';
      valign = 'upper';
      dy -= height;
    } else if (ta==='u') {
      anchor = 'middle';
      valign = 'upper';
      dx -= width/2;
      dy -= height;
    } else if (ta==='ul') {
      anchor = 'end';
      valign = 'upper';
      dx -= width;
      dy -= height;
    } else if (ta==='r') {
      anchor = 'start';
      valign = 'middle';
      dy -= height/2;
    } else if (ta==='l') {
      anchor = 'end';
      valign = 'middle';
      dx -= width;
      dy -= height/2;
    } else if (ta==='c') {
      anchor = 'middle';
      valign = 'middle';
      dx -= width/2;
      dy -= height/2;
    } else {
      ///treat it as 'ur'
      anchor = 'start';
      valign = 'upper';
      dy -= height;
    }
    //console.log('mathtext','x',x,'y',y,'height',height); 
    var rotate = this.g_to_rotate_float(g);
    if(this.has_texts(g)){
      var fontcolor = this.g_to_fontcolor_string(g);
      if(fontcolor){
        var svgfontcolor = this.string_to_svg_color(fontcolor,g.hints);
      }else{
        var svgfontcolor = 'inherit';
      }
      let s1 = `<g transform="translate(${x},${y}) rotate(${-rotate}) translate(${dx},${dy})"><svg width="${width}" height="${height}" fill="${svgfontcolor}" stroke="${svgfontcolor}" style="color:${svgfontcolor}" viewBox="0 0 ${vw} ${vh}"><defs>${defs.join('\n')}</defs>${s}</svg></g>`;
      d.push(s1);
    }
    var img = d.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_text(x,y,txt,ta,g){
    if(!txt) return '';
    /*
    <text x="182" y="92">
    <tspan x="182" dy="0">Hello</tspan>
    <tspan x="182" dy="12pt">World</tspan>
    </text>
    */
    var x = this.localx(x);
    var y = this.localy(y);
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    var factor = fontsize/this.translator.tokenizer.fs;
    /// (x,y) is now in SVG-coordinates, dy are in the unit of 'em'
    var anchor = 'middle', dy="0.3", valign = 'middle';
    if (ta==='br') {
      anchor = 'start', dy="0.8", valign = 'lower';
    } else if (ta==='b') {
      anchor = 'middle', dy="0.8", valign = 'lower';
    } else if (ta==='bl') {
      anchor = 'end', dy="0.8", valign = 'lower';
    } else if (ta==='ur') {
      anchor = 'start', dy="-0.2", valign = 'upper';
    } else if (ta==='u') {
      anchor = 'middle', dy="-0.2", valign = 'upper';
    } else if (ta==='ul') {
      anchor = 'end', dy="-0.2", valign = 'upper';
    } else if (ta==='r') {
      anchor = 'start', dy="0.3";
    } else if (ta==='l') {
      anchor = 'end', dy="0.3";
    } else if (ta==='c') {
      anchor = 'middle', dy="0.3";
    } else {///default is 'ur'
      anchor = 'start', dy="-0.2", valign = 'upper';
    }
    var ss = txt.trim().split('\\\\');
    var ss = ss.map(s => s.trim())
    var ss = ss.map(s => this.translator.flatten(g,s));
    var ss = ss.map((s,i,arr) => {
      if(i==0){
        return `<tspan x="0" dy="${this.tokenizer.text_dy_pt}pt">${s}</tspan>`;
      }else{
        return `<tspan x="0" dy="${this.tokenizer.fs}pt">${s}</tspan>`;
      }
    });
    var txt = ss.join('\n');
    var d = [];
    //adjust y
    var height = (this.tokenizer.fs*(ss.length-1) + this.tokenizer.fs)*1.333;
    height *= factor;
    if(valign == 'upper'){
      y -= height;
    }else if(valign == 'middle'){
      y -= height/2;
    }else {
      y -= 0;
    }
    var fontfamily = this.g_to_svg_fontfamily_str(g);
    var fontstyle = this.g_to_svg_fontstyle_str(g);
    var fontweight = this.g_to_svg_fontweight_str(g);
    var textdecoration = this.g_to_svg_textdecoration_str(g);
    if(this.has_texts(g)){
      d.push(`<text transform="translate(${x} ${y}) scale(${factor})" font-family="${fontfamily}" font-style="${fontstyle}" font-weight="${fontweight}" text-decoration="${textdecoration}" font-size="${this.tokenizer.fs}pt" text-anchor="${anchor}" ${this.g_to_svg_textdraw_str(g)} dy="${this.tokenizer.text_dy_pt}pt">${txt}</text>`);
    }
    var img = d.join(' ');
    ////<g transform="translate(113,-66) translate(0,+132.28) scale(1.5,0.5) translate(0,-132.28)">
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_grid(density,g){
    var o = [];
    for(let j=0; j <= this.viewport_height; ++j){
      o.push(`M0,${j*this.u} L${this.viewport_width*this.u},${j*this.u}`);
      if(density>1){
        for(let k=1; k < density; ++k){
          o.push(`M0,${(j+k/density)*this.u} L${this.viewport_width*this.u},${(j+k/density)*this.u}`);
        }
      }
    }
    for(let i=0; i <= this.viewport_width; ++i){
      o.push(`M${i*this.u},0 L${i*this.u},${this.viewport_height*this.u}`);
      if(density>1){
        for(let k=1; k < density; ++k){
          o.push(`M${(i+k/density)*this.u},0 L${(i+k/density)*this.u},${this.viewport_height*this.u}`);
        }
      }
    }
    var img = o.join(' ');
    var img = `<path d="${img}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`;
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_cairo(px,py,txt,extent,g){
    if(!txt) return '';
    var px = this.localx(px);
    var py = this.localy(py);
    var extent = this.localdist(extent);
    /// (x,y) is now in SVG-coordinates, 
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    var factor = fontsize/this.translator.tokenizer.fs;
    var txt = this.translator.uncode(g,txt);
    var segment_array = this.tokenizer.to_cairo_segment_array(txt,extent,factor,g);
    var align = 'left';
    var indent = 0;
    var hanging = 0;
    var pp = this.cairo_segment_array_to_pp(px,py,segment_array,extent,factor,align,indent,hanging);
    var o = [];
    pp.forEach((p,i,arr) => {
      if(p.key=='latin' || p.key=='punc' || p.key=='unicode'){
        var anchor = 'start';
        var fontfamily = this.g_to_svg_fontfamily_str(p.g);
        var fontstyle = this.g_to_svg_fontstyle_str(p.g);
        var fontweight = this.g_to_svg_fontweight_str(p.g);
        var textdecoration = this.g_to_svg_textdecoration_str(p.g);
        var x = p.x;
        var y = p.y + p.dy;
        var w = p.w;
        var h = p.h;
        var txt = p.txt;
        var textlength = p.textlength;
        o.push(`<text transform="translate(${this.fix(x)} ${this.fix(y)}) scale(${factor})" w="${this.fix(p.w)}" h="${this.fix(p.h)}" mid="${this.fix(p.mid)}" font-family="${fontfamily}" font-style="${fontstyle}" font-weight="${fontweight}" text-decoration="${textdecoration}" font-size="${this.tokenizer.fs}pt" text-anchor="${anchor}" ${this.g_to_svg_textdraw_str(g)} dy="${this.tokenizer.text_dy_pt}pt" textLength="${this.fix(textlength)}" lengthAdjust="spacingAndGlyphs">${txt}</text>`);
      }else if(p.key=='svg'){
        var x = p.x;
        var y = p.y + p.dy;
        var w = p.w;
        var h = p.h;
        var vw = p.vw;
        var vh = p.vh;
        let opt = '';
        opt += ` xmlns="http://www.w3.org/2000/svg"`;
        opt += ` xmlns:xlink="http://www.w3.org/1999/xlink"`
        opt += ` width="${w}" height="${h}"`
        opt += ` fill="inherit"`
        opt += ` stroke="inherit"`
        opt += ` viewBox="0 0 ${vw} ${vh}"`;
        o.push(`<svg x="${this.fix(x)}" y="${this.fix(y)}" w="${this.fix(p.w)}" h="${this.fix(p.h)}" mid="${this.fix(p.mid)}" ${opt} >${p.svg}</svg>`);
      }
    });
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_slopedlabel(x1,y1,x2,y2,txt,ta,g){
    const re = /^\\\((.*)\\\)$/;
    let v;
    if(this.g_to_math_int(g)){
      return this.p_slopedmath(x1,y1,x2,y2,txt,ta,g);
    } else if((v=re.exec(txt))!==null){
      return this.p_slopedmath(x1,y1,x2,y2,v[1],ta,g);
    }else{
      return this.p_slopedtext(x1,y1,x2,y2,txt,ta,g);
    }
  }
  p_slopedtext(x1,y1,x2,y2,txt,ta,g){
    if(!txt) return '';
    var o = [];
    ///NOTE text is always placed upper
    var x = (x1+x2)/2;
    var y = (y1+y2)/2;
    if(this.has_texts(g)){
      var x = this.localx(x);
      var y = this.localy(y);
      x1 = this.localx(x1);
      y1 = this.localy(y1);
      x2 = this.localx(x2);
      y2 = this.localy(y2);
      ///x/y is in SVG coordinate
      var linelength = this.calc_dist(x1,y1,x2,y2);
      var fontfamily = this.g_to_svg_fontfamily_str(g);
      var fontstyle = this.g_to_svg_fontstyle_str(g);
      var fontweight = this.g_to_svg_fontweight_str(g);
      var fontsize = this.g_to_fontsize_float(g);
      var txt = this.translator.flatten(g,txt);
      let id = this.get_css_id();
      var txt = `<textPath href="#path${id}">${txt}</textPath>`;
      if(ta=='b'){
        o.push(`<text font-family="${fontfamily}" font-style="${fontstyle}" font-weight="${fontweight}" font-size="${fontsize}pt" text-anchor="middle" ${this.g_to_svg_textdraw_str(g)} dx="${linelength/2}" dy="+0.80em">${txt}</text>`);
      }else if(ta=='u'){
        o.push(`<text font-family="${fontfamily}" font-style="${fontstyle}" font-weight="${fontweight}" font-size="${fontsize}pt" text-anchor="middle" ${this.g_to_svg_textdraw_str(g)} dx="${linelength/2}" dy="-0.20em">${txt}</text>`);
      }else{
        o.push(`<text font-family="${fontfamily}" font-style="${fontstyle}" font-weight="${fontweight}" font-size="${fontsize}pt" text-anchor="middle" ${this.g_to_svg_textdraw_str(g)} dx="${linelength/2}" dy="+0.30em">${txt}</text>`);
      }
      ///push to my_path_array
      let path = `M${x1},${y1} L${x2},${y2}`;
      this.my_textpath_array.push({id:id,d:path});
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_slopedmath(x1,y1,x2,y2,txt,ta,g){
    if(!txt) return '';
    var rotate = Math.atan2(y2-y1,x2-x1)/Math.PI*180;//in degrees
    var o = [];
    ///font size and factor and math text
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontfamily = this.g_to_svg_fontfamily_str(g);
    var fontstyle = this.g_to_svg_fontstyle_str(g);
    var fontweight = this.g_to_svg_fontweight_str(g);
    var fontsize = this.g_to_fontsize_float(g);
    var factor = fontsize/this.translator.tokenizer.fs;
    var used = new Set();
    var {s,w,h} = this.tokenizer.to_svgmath(txt,g,used,0);
    var defs = this.tokenizer.buildup_defs(used);
    var fh = this.tokenizer.fh;
    ///NOTE text is always placed upper
    var x = (x1+x2)/2;
    var y = (y1+y2)/2;
    if(this.has_texts(g)){
      var x = this.localx(x);
      var y = this.localy(y);
      x1 = this.localx(x1);
      y1 = this.localy(y1);
      x2 = this.localx(x2);
      y2 = this.localy(y2);
      ///figure out x/y
      var dx = 0;
      var dy = 0;
      var vw = w*1.333;///convert to px
      var vh = h*1.333;///convert to px
      var width = w*1.333;
      var height = h*1.333;
      width *= factor;
      height *= factor;
      var anchor = 'middle', valign = '';
      if (ta==='b') {
        anchor = 'middle';
        valign = 'lower';
        dx -= width/2;
      } else if (ta==='u'){ ///assume 'u'
        anchor = 'middle';
        valign = 'upper';
        dx -= width/2;
        dy -= height;
      } else {
        anchor = 'middle';
        valign = '';
        dx -= width/2;
        dy -= height/2;
      }
      ///x/y is in SVG coordinate
      if(this.has_texts(g)){
        if(fontcolor){
          var svgfontcolor = this.string_to_svg_color(fontcolor,g.hints);
        }else{
          var svgfontcolor = 'inherit';
        }
        let s1 = `<g transform="translate(${x},${y}) rotate(${-rotate}) translate(${dx},${dy})"><svg width="${width}" height="${height}" fill="${svgfontcolor}" stroke="${svgfontcolor}" viewBox="0 0 ${vw} ${vh}"><defs>${defs.join('\n')}</defs>${s}</svg></g>`;
        o.push(s1);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_fillclipath(_coords, g) {
    let clipath = this.g_to_clippath_string(g);
    let names = clipath.split(/\s+/).map(x => x.trim()).filter(x => x.length);
    let ids = [];
    let o = [];
    names.forEach(x => {
      if(this.my_paths.has(x)){
        var path = this.my_paths.get(x);
        let dd = this.coords_to_d(path,true);
        let id = this.get_css_id();
        ids.push(id);
        o.push(`<clipPath id="${id}">`)
        dd.forEach(d => {
          o.push(`<path d="${d.d}" />`);
        })
        o.push(`</clipPath>`)    
      }
    });
    let w = `<rect x="0" y="0" width="${this.fix(this.localdist(this.viewport_width))}" height="${this.fix(this.localdist(this.viewport_height))}" ${this.g_to_svg_fillonly_str(g)}/>`;
    ids.forEach(id => {
      w = `<g clip-path="url(#${id})">${w}</g>`;
    })
    o.push(w);
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_fillpath(coords,_g){
    var items = this.coords_to_d(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,s,hints} = item;
      if(!s) continue; 
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if(this.has_shades(g)){
        o.push(`<path d="${s}" ${this.g_to_svg_shadeonly_str(g)} stroke="none"/>`);  
      }else{
        o.push(`<path d="${s}" ${this.g_to_svg_fillonly_str(g)} stroke="none"/>`);  
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_drawpath(coords,_g){
    var items = this.coords_to_d(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if(iscycled) {
        if(this.has_shades(g)){
          o.push(`<path d="${s}" ${this.g_to_svg_shadeonly_str(g)} ${this.g_to_svg_drawonly_str(g)} />`);
        }else if(this.has_fills(g)){
          o.push(`<path d="${s}" ${this.g_to_svg_fillonly_str(g)} ${this.g_to_svg_drawonly_str(g)} />`);
        }else{
          o.push(`<path d="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
        }
      }else{
        o.push(`<path d="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_strokepath(coords,_g){
    var items = this.coords_to_d(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if(this.has_strokes(g)){
        o.push(`<path d="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)}/>`);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_arrow(coords,_g){
    var items = this.coords_to_d(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      let id1 = this.create_arrowhead('end',g);
      if(this.has_strokes(g)){
        o.push(`<path d="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-end="url(#marker${id1})" />`);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_revarrow(coords,_g){
    var items = this.coords_to_d(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      let id2 = this.create_arrowhead('start',g);
      if(this.has_strokes(g)){
        o.push(`<path d="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-start="url(#marker${id2})" />`);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_dblarrow(coords,_g){
    var items = this.coords_to_d(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      let id1 = this.create_arrowhead('end',g);
      let id2 = this.create_arrowhead('start',g);
      if(this.has_strokes(g)){
        o.push(`<path d="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-end="url(#marker${id1})" marker-start="url(#marker${id2})" />`);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  ///////////////////////////////////////////////////////////////////////
  ///specialized shape drawing
  ///////////////////////////////////////////////////////////////////////
  p_ellipse(cx,cy,rx,ry,g){
    var o = [];
    cx = this.localx(cx);
    cy = this.localy(cy);
    rx = this.localdist(rx);
    ry = this.localdist(ry);
    if(this.has_shades(g)){
      o.push(`<ellipse cx="${this.fix(cx)}" cy="${this.fix(cy)}" rx="${this.fix(rx)}" ry="${this.fix(ry)}" ${this.g_to_svg_shadeonly_str(g)} ${this.g_to_svg_drawonly_str(g)} />`);
    }else if(this.has_fills(g)){
      o.push(`<ellipse cx="${this.fix(cx)}" cy="${this.fix(cy)}" rx="${this.fix(rx)}" ry="${this.fix(ry)}" ${this.g_to_svg_fillonly_str(g)} ${this.g_to_svg_drawonly_str(g)} />`);
    }else{
      o.push(`<ellipse cx="${this.fix(cx)}" cy="${this.fix(cy)}" rx="${this.fix(rx)}" ry="${this.fix(ry)}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;  
  }
  p_circle(cx,cy,r,g){
    var o = [];
    cx = this.localx(cx);
    cy = this.localy(cy);
    r = this.localdist(r);
    if(this.has_shades(g)){
      o.push(`<circle cx="${this.fix(cx)}" cy="${this.fix(cy)}" r="${this.fix(r)}" ${this.g_to_svg_shadeonly_str(g)} ${this.g_to_svg_drawonly_str(g)} />`);
    }else if(this.has_fills(g)){
      o.push(`<circle cx="${this.fix(cx)}" cy="${this.fix(cy)}" r="${this.fix(r)}" ${this.g_to_svg_fillonly_str(g)} ${this.g_to_svg_drawonly_str(g)} />`);
    }else{
      o.push(`<circle cx="${this.fix(cx)}" cy="${this.fix(cy)}" r="${this.fix(r)}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_rect(x,y,w,h,rdx,rdy,g){
    var o = [];
    x = this.localx(x);
    y = this.localy(y);
    w = this.localdist(w);
    h = this.localdist(h);
    rdx = this.localdist(rdx);
    rdy = this.localdist(rdy);
    var centerx = Math.round(x+w/2); 
    var centery = Math.round(y-h/2);
    var id = this.get_css_id();
    if(this.has_shades(g)){
      o.push(`<rect id="${id}" x="${this.fix(x)}" y="${this.fix(y-h)}" width="${this.fix(w)}" height="${this.fix(h)}" rx="${this.fix(rdx)}" ry="${this.fix(rdy)}" ${this.g_to_svg_shadeonly_str(g)} ${this.g_to_svg_drawonly_str(g)} ${this.g_to_svg_ball_str(g,centerx,centery)} />`);
    }else if(this.has_fills(g)){
      o.push(`<rect id="${id}" x="${this.fix(x)}" y="${this.fix(y-h)}" width="${this.fix(w)}" height="${this.fix(h)}" rx="${this.fix(rdx)}" ry="${this.fix(rdy)}" ${this.g_to_svg_fillonly_str(g)} ${this.g_to_svg_drawonly_str(g)} ${this.g_to_svg_ball_str(g,centerx,centery)} />`);
    }else{
      o.push(`<rect id="${id}" x="${this.fix(x)}" y="${this.fix(y-h)}" width="${this.fix(w)}" height="${this.fix(h)}" rx="${this.fix(rdx)}" ry="${this.fix(rdy)}" fill="none" ${this.g_to_svg_drawonly_str(g)} ${this.g_to_svg_ball_str(g,centerx,centery)} />`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_line(x1,y1,x2,y2,g){
    var o = [];
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        let id1 = this.create_arrowhead('end',g);
        o.push(`<line x1="${this.fix(x1)}" y1="${this.fix(y1)}" x2="${this.fix(x2)}" y2="${this.fix(y2)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-end="url(#marker${id1})" />`);
      }else if(arrowhead==2){
        let id2 = this.create_arrowhead('start',g);
        o.push(`<line x1="${this.fix(x1)}" y1="${this.fix(y1)}" x2="${this.fix(x2)}" y2="${this.fix(y2)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-start="url(#marker${id2})" />`);
      }else if(arrowhead==3){
        let id1 = this.create_arrowhead('end',g);
        let id2 = this.create_arrowhead('start',g);
        o.push(`<line x1="${this.fix(x1)}" y1="${this.fix(y1)}" x2="${this.fix(x2)}" y2="${this.fix(y2)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-end="url(#marker${id1})" marker-start="url(#marker${id2})" />`);
      }else{
        o.push(`<line x1="${this.fix(x1)}" y1="${this.fix(y1)}" x2="${this.fix(x2)}" y2="${this.fix(y2)}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_polyline(points,g){
    var d = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      x = this.localx(x);
      y = this.localy(y);
      d.push(`${x},${y}`);
    }
    var s = d.join(' ');
    var o = [];
    if(this.has_strokes(g)){
      o.push(`<polyline points="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_polygon(points,g){
    var d = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      x = this.localx(x);
      y = this.localy(y);
      d.push(`${x},${y}`);
    }
    var s = d.join(' ');
    var o = [];
    if(this.has_shades(g)){
      o.push(`<polygon points="${s}" ${this.g_to_svg_shadeonly_str(g)} ${this.g_to_svg_drawonly_str(g)} />`);
    }else if(this.has_fills(g)){
      o.push(`<polygon points="${s}" ${this.g_to_svg_fillonly_str(g)} ${this.g_to_svg_drawonly_str(g)} />`);
    }else{
      o.push(`<polygon points="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_sector(cx,cy,r,ri,start,span,g){
    var q = this.to_SECTOR(cx,cy,r,ri,start,span);
    return this.p_drawpath(q,g);
  }
  p_segment(cx,cy,r,start,span,g){
    var q = this.to_SEGMENT(cx,cy,r,start,span);
    return this.p_drawpath(q,g);
  }
  ///////////////////////////////////////////////////////////////////
  ///Bezier curve drawing
  ///////////////////////////////////////////////////////////////////
  p_qbezier_line(x0,y0, x1,y1, x2,y2, g){
    var o = [];
    var x0 = this.localx(x0);
    var y0 = this.localy(y0);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        let id1 = this.create_arrowhead('end',g);
        o.push(`<path d="M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-end="url(#marker${id1})" />`);
      }else if(arrowhead==2){
        let id2 = this.create_arrowhead('start',g);
        o.push(`<path d="M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-start="url(#marker${id2})" />`);
      }else if(arrowhead==3){
        let id1 = this.create_arrowhead('end',g);
        let id2 = this.create_arrowhead('start',g);
        o.push(`<path d="M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-end="url(#marker${id1})" marker-start="url(#marker${id2})" />`);
      }else{
        o.push(`<path d="M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_bezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g){
    var o = [];
    var x0 = this.localx(x0);
    var y0 = this.localy(y0);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var x3 = this.localx(x3);
    var y3 = this.localy(y3);
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        let id1 = this.create_arrowhead('end',g);
        o.push(`<path d="M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-end="url(#marker${id1})" />`);
      }else if(arrowhead==2){
        let id2 = this.create_arrowhead('start',g);
        o.push(`<path d="M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-start="url(#marker${id2})" />`);
      }else if(arrowhead==3){
        let id1 = this.create_arrowhead('end',g);
        let id2 = this.create_arrowhead('start',g);
        o.push(`<path d="M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}" fill="none" ${this.g_to_svg_drawonly_str(g)} marker-end="url(#marker${id1})" marker-start="url(#marker${id2})" />`);
      }else{
        o.push(`<path d="M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  ///
  ///
  ///
  p_plot(fn,cx,cy,sx,sy,xmin,xmax,ymin,ymax,x1,x2,xstep,g){
    var all = [];
    var d = [];
    all.push(d);
    for(var i=0; i <= this.MAX_INT; i++){
      var x = x1+i*xstep;
      if(x>x2){
        break;
      }
      var y = this.expr.exec_complex_func(fn,[x],g)
      if(y.isFinite()){
        y = y.re;
        if(x >= xmin && x <= xmax && y >= ymin && y <= ymax){
          x *= sx;
          y *= sy;
          x += cx;
          y += cy;
          if(d.length==0){
            d.push(`M${this.fix(this.localx(x))},${this.fix(this.localy(y))}`);
          }else{
            d.push(`L${this.fix(this.localx(x))},${this.fix(this.localy(y))}`);
          }
          continue;
        }
      }
      if(d.length){
        d = [];
        all.push(d);
      }
    } 
    all = all.filter(d=>d.length);
    all = all.map(d=>d.join(' '));
    all = all.map(s=>`<path d="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`)
    all = all.map(s=>`<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${s} </g>`);
    return all.join('\n');   
    /*
    let unit = this.viewport_unit;
    let viewport_width = this.viewport_width;
    let viewport_height = this.viewport_height;
    var x1 = NaN;
    var y1 = NaN;
    var d = [];
    var all = [];
    all.push(d);
    var i = 0;
    for(var pt of coords){
      if(!this.is_valid_point(pt)){
        break;
      }
      let x2 = pt[0];
      let y2 = pt[1];
      if(i==0){
        i=1;
        x1=x2;
        y1=y2;
      }
      var [accept] = this.clip.CohenSutherlandLineClipAndDraw(x1,y1,x2,y2,0,0,viewport_width,viewport_height);
      if(accept){
        if(d.length==0){
          //include the first ponit
          d.push(`M${this.fix(this.localx(x1))},${this.fix(this.localy(y1))}`);
        }
        d.push(`L${this.fix(this.localx(x2))},${this.fix(this.localy(y2))}`);
      }else{
        d = [];
        all.push(d);
      }
      x1=x2;
      y1=y2;
    } 
    all = all.filter(d=>d.length);
    all = all.map(d=>d.join(' '));
    all = all.map(s=>`<path d="${s}" fill="none" ${this.g_to_svg_drawonly_str(g)} />`)
    all = all.map(s=>`<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${s} </g>`);
    return all.join('\n');   
    */
  }
  ///
  ///
  ///
  p_dot_square(x,y,g){
    var r = this.g_to_svg_dotsize_radius_px(g);
    var o = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var r2 = r*2;
    if(this.has_dots(g)){
      o.push(`<rect x="${x-r}" y="${y-r}" width="${r2}" height="${r2}" ${this.g_to_svg_dotonly_str(g)}/>`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_dot_circle(x,y,g){
    var r = this.g_to_svg_dotsize_radius_px(g);
    var o = [];
    var x = this.localx(x);
    var y = this.localy(y);
    if(this.has_dots(g)){
      o.push(`<circle cx="${this.fix(x)}" cy="${this.fix(y)}" r="${this.fix(r)}" ${this.g_to_svg_dotonly_str(g)}/>`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_dot_pie(cx,cy,start_a,span_a,g){
    var r = this.g_to_svg_dotsize_radius_px(g);
    var o = [];
    cx = this.localx(cx);
    cy = this.localy(cy);
    var s = '';
    var sweepflag = 0;//anti-clockwise
    var bigarcflag = 0;
    if(span_a < 0){
      sweepflag = 1;//clockwise
    }
    var da = span_a/4;
    var all_a = [start_a,          
                 start_a+da,       
                 start_a+da+da,    
                 start_a+da+da+da, 
                 start_a+da+da+da+da];
    var a = all_a[0];
    var x = cx + r*Math.cos(a / 180 * Math.PI);
    var y = cy - r*Math.sin(a / 180 * Math.PI);
    s = `M${this.fix(cx)},${this.fix(cy)}`;
    s += ` L${this.fix(x)},${this.fix(y)}`;
    for(var j=1; j < all_a.length; ++j){
      var a = all_a[j];
      var x = cx + r*Math.cos(a / 180 * Math.PI);
      var y = cy - r*Math.sin(a / 180 * Math.PI);  
      s += ` A${this.fix(r)},${this.fix(r)},0,${bigarcflag},${sweepflag},${this.fix(x)},${this.fix(y)}`;
    }
    s += ' z';
    o.push(`<path d="${s}" ${this.g_to_svg_dotonly_str(g)} />`);
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_rhbar(x,y,g){
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var delta_x = this.g_to_barlength_float(g)/2;
    var x2 = x + delta_x;
    var X2 = this.localx(x2);
    var Y2 = this.localy(y);
    if(this.has_strokes(g)){
      o.push(`<line x1="${X}" y1="${Y}" x2="${X2}" y2="${Y2}" fill="none" ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_lhbar(x,y,g){
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var delta_x = this.g_to_barlength_float(g)/2;
    var x2 = x - delta_x;
    var X2 = this.localx(x2);
    var Y2 = this.localy(y);
    if(this.has_strokes(g)){
      o.push(`<line x1="${X}" y1="${Y}" x2="${X2}" y2="${Y2}" fill="none" ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_tvbar(x,y,g){
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var Dy = this.g_to_barlength_float(g)/2;
    var X2 = this.localx(x);
    var Y2 = this.localy(y+Dy);
    if(this.has_strokes(g)){
      o.push(`<line x1="${X}" y1="${Y}" x2="${X2}" y2="${Y2}" fill="none" ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  p_bvbar(x,y,g){
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var dy = this.g_to_barlength_float(g)/2;
    var X2 = this.localx(x);
    var Y2 = this.localy(y-dy);
    if(this.has_strokes(g)){
      o.push(`<line x1="${X}" y1="${Y}" x2="${X2}" y2="${Y2}" fill="none" ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    var img = o.join(' ');
    var img = `<g transform="translate(${this.origin_x*this.u},${-this.origin_y*this.u}) translate(0,${this.viewport_height*this.u}) scale(${this.origin_sx},${this.origin_sy}) translate(0,${-this.viewport_height*this.u})"> ${img} </g>`;
    return img;
  }
  ///////////////////////////////////////////////////////////////////////////////
  ///
  ///
  ///
  ///////////////////////////////////////////////////////////////////////////////
  g_to_svg_textdraw_str(g) {
    var d = [];
    var s = this.g_to_fontcolor_string(g);
    if (s) {
      d.push(`fill="${this.string_to_svg_color(s,g.hints)}"`);
    }
    d.push(`stroke="none"`);
    return d.join(' ');
  }
  g_to_svg_drawonly_str(g) {
    g = g||{};
    var d = [];
    let linedashed = this.g_to_linedashed_int(g);
    if (linedashed) {
      d.push(`stroke-dasharray="3.0 3.0"`);
    } 
    let linesize = this.g_to_linesize_float(g);
    if(linesize){
      d.push(`stroke-width="${linesize*1.333}"`);
    }
    let linecolor = this.g_to_linecolor_string(g);
    if(linecolor=="none"){
      d.push(`stroke="none"`);
    }else if(linecolor){
      d.push(`stroke="${this.string_to_svg_color(linecolor,g.hints)}"`);
    }else{
      d.push(`stroke="currentColor"`);
    }
    let linecap = this.g_to_linecap_string(g);
    if (linedashed) {
      d.push(`stroke-linecap="butt"`);///for dashed lines if it sets to anything other than 'butt' it does not look good and the dashed part looks too close together
    } else if (linecap) {
      d.push(`stroke-linecap="${this.string_to_svg_linecap_name(linecap)}"`);
    }  
    let linejoin = this.g_to_linejoin_string(g);
    if (linejoin) {
      d.push(`stroke-linejoin="${this.string_to_svg_linejoin_name(linejoin)}"`);
    } 
    let alpha = this.g_to_linealpha_float(g);
    if (alpha < 1) {
      d.push(`stroke-opacity="${alpha}"`);
    }
    //d.push(`fill="none"`);
    return d.join(' ');
  }
  g_to_svg_shadeonly_str(g,isinherit) {
    g = g||{};
    var d = [];
    let ss = this.g_to_svg_shadecolor_ss(g);
    let shade = this.g_to_shade_string(g);
    let angle = this.g_to_angle_float(g);
    let opacity = this.g_to_fillalpha_float(g);
    if(shade=='radial'){
      let p = {};
      p.cx = 0.5;
      p.cy = 0.5;
      p.fx = 0.5;
      p.fy = 0.5;
      p.r = 0.5;
      p.ss = ss;
      p.type = 'radial';
      p.id = this.get_css_id();
      this.my_gradient_array.push(p);
      d.push(`fill="url(#shade${p.id})"`);
    }else if(shade=='ball'){
      let p = {};
      p.cx = 0.5;
      p.cy = 0.5;
      p.fx = 0.3;
      p.fy = 0.3;
      p.r = 0.5;
      p.ss = ss;
      p.type = 'ball';
      p.id = this.get_css_id();
      this.my_gradient_array.push(p);
      d.push(`fill="url(#shade${p.id})"`);
    }else{//default to 'linear'
      let p = {};
      p.x1 = 0;
      p.y1 = 0;
      p.x2 = 1;
      p.y2 = 0;
      p.ss = ss;
      p.type = 'linear';
      p.id = this.get_css_id();
      this.my_gradient_array.push(p);
      d.push(`fill="url(#shade${p.id})"`);
      ///TODO: assume angle = 0 for now
      ///NOTE: that the cos and sin are reversed here because
      /// when angle is 0 it is the top-down and when angle is 90 is left-right
      angle = this.assert_float(angle,0,0,90);
      p.x2 = this.fix(Math.sin(angle/180*Math.PI));
      p.y2 = this.fix(Math.cos(angle/180*Math.PI));
    }
    if (opacity < 1) {
      d.push(`fill-opacity="${opacity}"`);
    }
    //d.push(`stroke="none"`);
    return d.join(' ');
  }
  g_to_svg_fillonly_str(g) {
    g = g||{};
    var d = [];
    let fillcolor = this.g_to_fillcolor_string(g);
    if(fillcolor == 'none'){
      d.push(`fill="none"`)
    } 
    else if(fillcolor) {
      d.push(`fill="${this.string_to_svg_color(fillcolor,g.hints)}"`);
    } 
    else {
      d.push(`fill="currentColor"`);
    } 
    let opacity = this.g_to_fillalpha_float(g);
    if (opacity < 1) {
      d.push(`fill-opacity="${opacity}"`);
    }
    //d.push(`stroke="none"`);
    return d.join(' ');
  }
  g_to_svg_dotonly_str(g){
    g = g||{};
    var o = [];
    var s = this.g_to_dotcolor_string(g);
    if (s) {
      o.push(`fill="${this.string_to_svg_color(s,g.hints)}"`);
    } else {
      o.push(`fill="currentColor"`);
    }
    o.push(`stroke="none"`);
    return o.join(' ');
  }
  g_to_svg_dotsize_radius_px(g){
    let dotsize = this.g_to_dotsize_float(g);
    return (dotsize/2*1.333);
  }
  g_to_svg_shadecolor_ss(g){
    let shadecolor = this.g_to_shadecolor_string(g);
    var ss = [];
    if (shadecolor) {
      ss = this.string_to_array(shadecolor);
    } 
    ss = ss.map(s => this.string_to_svg_color(s,g.hints));
    return ss;
  }
  g_to_svg_fontfamily_str(g) {
    var ss = [];
    var f = this.g_to_mien_fontfamily_flag(g);
    switch(f){
      case 't':
        ss.push('monospace');
        break;
    }
    return ss.join(' ');
  }
  g_to_svg_fontstyle_str(g) {
    var ss = [];
    var f = this.g_to_mien_fontstyle_flag(g);
    switch(f){
      case 'i':
        ss.push('italic');
        break;
    }
    return ss.join(' ');
  }
  g_to_svg_fontweight_str(g) {
    var ss = [];
    var f = this.g_to_mien_fontweight_flag(g);
    switch(f){
      case 'b':
        ss.push('bold');
        break;
    }
    return ss.join(' ');
  }
  g_to_svg_textdecoration_str(g) {
    var ss = [];
    var f = this.g_to_mien_textdecoration_flag(g);
    switch(f){
      case 's':
        ss.push('line-through');
        break;
    }
    return ss.join(' ');
  }
  ///
  ///
  ///
  g_to_svg_ball_str(g,centerx,centery){
    var ss = [];
    ss.push(`onclick="click(this)"`);
    ss.push(`onmousedown="mousedown(this)"`);
    ss.push(`data-centerx="${centerx}"`);
    ss.push(`data-centery="${centery}"`);
    return ss.join(' ');
  }
  ///
  ///
  ///
  hexcolor_to_svgcolor(s){
    // convert a string such as EFD to rgb(93%,100%,87%)
    // will truncate to 2 decimal places
    // convert a string such as E0F0D0 to (93%,100%,87%)
    if(s.length==6){
      var r = s.substr(0,2); r = parseInt(`0x${r}`); 
      var g = s.substr(2,2); g = parseInt(`0x${g}`); 
      var b = s.substr(4,2); b = parseInt(`0x${b}`); 
    }else if(s.length==3){
      var r = s.substr(0,1); r = parseInt(`0x${r}${r}`);
      var g = s.substr(1,1); g = parseInt(`0x${g}${g}`); 
      var b = s.substr(2,1); b = parseInt(`0x${b}${b}`); 
    } else {
      var r = 0;
      var g = 0;
      var b = 0;
    }
    return `rgb(${r},${g},${b})`;
  }

  ///
  ///
  ///
  string_to_svg_color(s,hints,def='currentColor') {
    if (!s) {
      return def;
    } 
    if(s=='currentColor'){
      return 'currentColor';
    }
    if(typeof(s)=='string'){
      s = this.string_to_hexcolor(s,hints);
      s = s.slice(1);
      s = this.hexcolor_to_svgcolor(s);
      return s;
    }
    return def;
  }
  string_to_svg_linecap_name(linecap) {
    if (linecap === 'butt') {
      return 'butt';
    } else if (linecap === 'round') {
      return 'round';
    } else if (linecap === 'square') {
      return 'square';
    }
    return 'butt';
  }
  string_to_svg_linejoin_name(linejoin) {
    if (linejoin === 'miter') {
      return 'miter';
    } else if (linejoin === 'round') {
      return 'round';
    } else if (linejoin === 'bevel') {
      return 'bevel';
    }
    return 'miter';
  }

  ///
  ///
  ///
  create_arrowhead(position,g){
    // o.push(`<path d="${d}" ${this.to_drawonly_str(g)} marker-end="url(#markerArrow)" marker-start="url(#startArrow)" />`);
    /// position is 'start' or 'end'
    /// color is a color for the arrow
    /// this function returns a string looks like 'url(#arrow1)'
    let linesize = this.g_to_linesize_float(g);
    let linecolor = this.g_to_linecolor_string(g);
    let id = this.get_css_id();
    let o = {id,position,linesize,linecolor};
    this.my_arrowhead_array.push(o);
    return id;
  }
  get_css_id(){
    return this.translator.get_css_id();
  }
  get_filter_blur_id(){
    if(this.my_filterblur_id==0){
      this.my_filterblur_id = this.get_css_id();
    }
    return this.my_filterblur_id;
  }
  ///
  ///This is to generate an array of extents, each of which represent
  /// a single line, or a single SVG element, with its x/y position;
  /// the input 'extent' expresses the maximum width each line can go;
  /// the x/y represents the topleft position; all these are in SVG
  /// user coordinates; 
  /// @align: 'left', 'right', or 'center'
  /// @indent: integer
  /// @hanging: integer
  cairo_segment_array_to_pp(px,py,segment_array,extent,factor,align,indent,hanging){
    var line_h = this.tokenizer.fh*1.333;
    var line_mid = line_h/2;
    var glue_w = 3*1.333;
    var nbsp_w = 3*1.333;
    var pp = [];
    var p_latin = {key:'latin',txt:'',w:0,h:0,mid:0};
    var p_br = {key:'br',w:0,h:0,mid:0};
    var p_svg = {key:'svg',svg:'',w:0,h:0,mid:0};
    var p_punc = {key:'punc',txt:'',w:0,h:line_h,mid:line_mid}
    var p_glue = {key:'glue',w:0,h:line_h,mid:line_mid};
    var p_nbsp = {key:'nbsp',w:0,h:line_h,mid:line_mid};
    var p_unicode = {key:'unicode',w:0,h:line_h,mid:line_mid};
    var p = null;
    /// first step is to merge all '\\cc' element into a single 'text' element
    for(var segment of segment_array){
      var type = segment[0];
      var cc = segment[1];
      var g = segment[5];
      if(type=='\\cc'){
        if(cc==0x20){//space
          ///create a new glue segment
          if(p && p.key=='glue'){
            ///do nothing
          }else{
            p = {...p_glue};
            p.w = glue_w*factor;
            p.h = line_h*factor;
            p.mid = line_mid*factor;
            p.g = g;
            pp.push(p);
          }
          continue;
        }
        if(cc==0xA0){//NBSP
          p = {...p_nbsp};
          p.w = nbsp_w*factor;
          p.h = line_h*factor;
          p.mid = line_mid*factor;
          p.g = g;
          pp.push(p);
          continue;
        }
        if(cc <= 0xFF){
          ///LATIN-1
          var type = this.get_latin_type(cc);
          var islatin = (type==this.CC_LETTER)||(type==this.CC_NUMBER)||(type==this.CC_SYMBOL)?true:false;
          var ispunc = (type==this.CC_PUNC);
          if(islatin && p && p.key=='latin'){
            var s = String.fromCodePoint(cc);
            w = this.tokenizer.get_latin_width(cc);
            p.txt += s;
            p.textlength += w;
            p.w += w*factor;
            p.h = line_h*factor;
            p.mid = line_mid*factor;
          }else if(islatin){
            var s = String.fromCodePoint(cc);
            w = this.tokenizer.get_latin_width(cc);
            p = {...p_latin};
            p.txt = s;
            p.textlength = w;
            p.w = w*factor;
            p.h = line_h*factor;
            p.mid = line_mid*factor;
            p.g = g;
            pp.push(p);
          }else if(ispunc){
            var s = String.fromCodePoint(cc);
            w = this.tokenizer.get_punc_width(cc);
            p = {...p_punc};
            p.txt = s;
            p.textlength = w;
            p.w = w*factor;
            p.h = line_h*factor;
            p.mid = line_mid*factor;
            p.g = g;
            pp.push(p);
          }else{
            ///do not add anything if the type is others such as CC_NONE
          }
          continue;
        }
        p = {...p_unicode};
        p.txt = String.fromCodePoint(cc);
        w = this.tokenizer.get_unicode_width(cc);
        p.textlength = w;
        p.w = w*factor;
        p.h = line_h*factor;
        p.mid = line_mid*factor;
        p.g = g;
        pp.push(p);
        continue;
      }
      if(type=='\\br'){
        p = {...p_br};
        p.w = 0;
        p.h = 0;
        p.mid = 0;
        p.g = g;
        pp.push(p);
        continue;
      }
      if(type=='\\svg'){
        p = {...p_svg};
        p.svg = cc;
        var w = segment[2];
        var h = segment[3];
        var mid = segment[4];
        ///svg's w and h does not need to be scaled down here, before for math it has already been and for diagram it should remain as original
        p.vw = segment[6];
        p.vh = segment[7];
        p.w = w;
        p.h = h;
        p.mid = mid;
        p.g = g;
        pp.push(p);
        continue;
      }
    }
    ///at this step we should scan each element and 
    // split them into multiple lines, but not yet 
    // to decide the vertical distance between lines but only 
    // to separate words of each line horizontally
    var w = 0;
    var seq = 0;
    for(var p of pp){
      var w1 = w + p.w;
      if(w==0){
        ///first element of the current line, always honored
        if(seq==0 && indent){
          p.x = indent;
          p.seq = seq;
          w = indent + p.w;
        }else{
          p.x = 0;
          p.seq = seq;
          w = p.w;
        }
      }
      else if(p.key=='br'){
        p.x = hanging;
        p.seq = ++seq;
        w = hanging;
      }
      else if(p.key=='glue'){
        p.x = w;
        p.seq = seq;
        w += p.w;
      }
      else if(w1 <= extent){
        p.x = w;
        p.seq = seq;
        w += p.w;
      }
      else{
        p.x = hanging;
        p.seq = ++seq;
        w = hanging + p.w;
      }
    }
    ///at this step we should examine each line (with the same seq)
    // and assign a 'h' and 'mid' which is the maximum of all
    var h = 0;
    for(var j=0; j <= seq; ++j){
      var pp1 = pp.filter((p) => (p.seq==j)?true:false)
      var max_h = pp1.reduce((acc,cur) => Math.max(acc,cur.h),0);
      var max_mid = pp1.reduce((acc,cur) => Math.max(acc,cur.mid),0);
      pp1.forEach((p) => {
        var dy = max_mid - p.mid;
        p.y = h;
        p.dy = dy;
      })
      h += max_h;
    }
    ///at this stage we will adjust all p.x if the @align is 'center' or 'right'
    if(align=='center' || align=='right'){
      for(var i=0; i <= seq; ++i){
        var max_x = 0;
        pp.forEach((p) => {
          if(p.seq==i && (p.key=='latin'||p.key=='punc'||p.key=='unicode')){
            max_x = Math.max(max_x,p.x+p.w);
          }
        })
        pp.forEach((p) => {
          if(p.seq==i){
            if(align=='right'){
              var dx = extent - max_x;
              p.x += dx;
            }else if(align=='center'){
              var dx = (extent - max_x)/2;
              p.x += dx;
            }
          }
        })
      }
    }
    ///at this stage all p.x and p.y are being added to the px and py
    pp.forEach((p) => {
      p.x += px;
      p.y += py;
    });
    //console.log(pp);
    return pp;
  }
  ///////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////
  to_empty_svg(w,h){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="none"/></svg>`;
  }

}

module.exports = { NitrilePreviewDiagramSVG };
