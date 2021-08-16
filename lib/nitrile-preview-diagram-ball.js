'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');

class NitrilePreviewDiagramBall extends NitrilePreviewDiagram {

  constructor(translator) {
    super(translator);
    this.tokenizer = new NitrilePreviewTokenizer(translator);
    ///this are storages for offloading to <defs>
    this.my_gradient_array = [];
    this.my_arrowhead_array = [];
    this.my_path_array = [];
    this.my_filter_blur_id = 0;
  }
    /*
    var json=`[
          {"transform":[1,0,0,1,0,0],
           "points":[
            {"op":"M","x":0,  "y":0,  "cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,"y1":0,"x2":0,"y2":0,"r":0},
            {"op":"L","x":100,"y":0,  "cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,"y1":0,"x2":0,"y2":0,"r":0},
            {"op":"L","x":100,"y":100,"cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,"y1":0,"x2":0,"y2":0,"r":0},
            {"op":"L","x":0,  "y":100,"cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,"y1":0,"x2":0,"y2":0,"r":0},
            {"op":"z"}]},
          {"transform":[1,0,0,1,100,100],
           "points":[
            {"op":"M","x":0,  "y":0,  "cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,"y1":0,"x2":0,"y2":0,"r":0},
            {"op":"L","x":100,"y":100,"cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,"y1":0,"x2":0,"y2":0,"r":0},
            {"op":"L","x":0,  "y":100,"cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,"y1":0,"x2":0,"y2":0,"r":0},
            {"op":"z"}]},
          {"transform":[1,0,0,1,50,100],
           "points":[
            {"op":"M","x":100,"y":50, "cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,   "y1":0,  "x2":100,"y2":50, "r":0},
            {"op":"A","x":50, "y":100,"cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":100, "y1":100,"x2":50, "y2":100,"r":50},
            {"op":"A","x":0,  "y":50, "cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,   "y1":100,"x2":0,  "y2":50, "r":50},
            {"op":"A","x":50, "y":0,  "cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":0,   "y1":0,  "x2":50, "y2":0,  "r":50},
            {"op":"A","x":100,"y":50, "cp1x":0,"cp1y":0,"cp2x":0,"cp2y":0,"x1":100, "y1":0,  "x2":100,"y2":50, "r":50},
            {"op":"z"}]}
          ]`;
    */
  to_ball(style,ss) {
    ss = this.trim_samp_body(ss);
    var env = {};
    this.init_internals();
    this.config = {...style};
    var [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    this.viewport_width = viewport_width;
    this.viewport_height = viewport_height;
    this.viewport_unit = viewport_unit;
    this.viewport_grid = viewport_grid;
    var u = this.MM_TO_PX*viewport_unit;//mm ot px
    var vw = u*viewport_width;
    var vh = u*viewport_height;
    //
    // setup
    //
    this.u = u;
    this.vw = vw;
    this.vh = vh;
    this.my_gradient_array = [];
    this.my_arrowhead_array = [];
    this.my_path_array = [];
    this.my_filter_blur_id = 0;
    //
    // execute byte and store all outputs in this.commands member
    //
    this.exec_body(style,ss,env);
    //
    // preparing for this.commands to be send out as return value
    //
    var d = this.commands.map(x => (typeof x==='string')?x.trim():'');
    var d = d.filter(s => (s && s.trim().length));
    var json = d.join(',');
    var json = `[${json}]`;
    var o = [];
    //GENERATE grids
    if(style.background=='grid'){
      let gridcolor = this.g_to_gridcolor_string(this.config);
      gridcolor = this.string_to_svg_color(gridcolor,0);
      let gw = viewport_grid*viewport_unit*this.MM_TO_PX;
      let bgid = this.get_css_id();
      o.push(`<pattern patternUnits="userSpaceOnUse" id="${bgid}" width="${gw}" height="${gw}"> <polyline points="0 0 ${gw} 0 ${gw} ${gw} 0 ${gw}" fill="none" stroke="${gridcolor}"/> </pattern>`);
      o.push(`<rect x="0" y="0" width="${vw}" height="${vh}" fill="url(#${bgid})" stroke="${gridcolor}"/>`);;
    }
    var svgtext = o.join('\n');
    //WIDTH/HEIGHT
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    if(width && height){
      var w = width*this.MM_TO_PX;
      var h = height*this.MM_TO_PX;
    }else if(width){
      var w = width*this.MM_TO_PX;
      var h = width*(this.viewport_height/this.viewport_width)*this.MM_TO_PX;
    }else if(height){
      var w = height*(this.viewport_width/this.viewport_height)*this.MM_TO_PX;
      var h = height*this.MM_TO_PX;
    }else{
      var w = this.viewport_width*this.viewport_unit*this.MM_TO_PX;
      var h = this.viewport_height*this.viewport_unit*this.MM_TO_PX;
    }
    //var img = `<canvas data-type='ball' width='${viewport_width*viewport_unit*this.MM_TO_PX}' height='${viewport_height*viewport_unit*this.MM_TO_PX}' style='${css}' data-json='${json}'></canvas>`;
    var subtitle = this.subtitle;
    var images = this.images;
    var o = [];
    o.push({json,subtitle,w,h,vw,vh,svgtext,images});
    return o;
  }
  /////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////
  p_comment(s){
  }
  /////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////
  p_text(x,y,txt,ta,g){
    var x = this.localx(x);
    var y = this.localy(y);
    return 
  }
  /////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////
  p_slopedtext(x1,y1,x2,y2,txt,ta,g){
  }
  /////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////
  p_arrow(coords,_g){
  }
  /////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////
  p_revarrow(coords,_g){
  }
  /////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////
  p_dblarrow(coords,_g){
  }
  /////////////////////////////////////////////////////////////////////////
  ///ellipse drawing
  /////////////////////////////////////////////////////////////////////////
  p_ellipse(cx,cy,rx,ry,g){
    [cx,cy] = this.move_xy(cx,cy);
    cx = this.localx(cx);
    cy = this.localy(cy);
    rx = this.localdist(rx);
    ry = this.localdist(ry);
    ///note that for 'a', the x1/y1 is the cx/cy of the cx.arc() method
    ///note that for 'e', the x1/y1 is the cx/cy of the cx.ellipse() method
    return `\
{"type":"ellipse",
 "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
 "points":[
   {"op":"M","x":${cx+rx},"y":${cy},    "x1":${cx+rx},"y1":${cy}},
   {"op":"e","x":${cx},   "y":${cy+ry}, "x1":${cx},   "y1":${cy},  "sAngle":${0},          "eAngle":${Math.PI*0.5},"r":${rx},"ry":${ry}},
   {"op":"e","x":${cx-rx},"y":${cy},    "x1":${cx},   "y1":${cy},  "sAngle":${Math.PI*0.5},"eAngle":${Math.PI},    "r":${rx},"ry":${ry}},
   {"op":"e","x":${cx},   "y":${cy-ry}, "x1":${cx},   "y1":${cy},  "sAngle":${Math.PI},    "eAngle":${Math.PI*1.5},"r":${rx},"ry":${ry}},
   {"op":"e","x":${cx+rx},"y":${cy},    "x1":${cx},   "y1":${cy},  "sAngle":${Math.PI*1.5},"eAngle":${Math.PI*2.0},"r":${rx},"ry":${ry}},
   {"op":"z"}
  ]}`;  
  }
  /////////////////////////////////////////////////////////////////////////
  ///circle drawing
  /////////////////////////////////////////////////////////////////////////
  p_circle(cx,cy,r,g){
    [cx,cy] = this.move_xy(cx,cy);
    cx = this.localx(cx);
    cy = this.localy(cy);
    r = this.localdist(r);
    return `\
{"type":"circle",
 "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
 "points":[
   {"op":"M","x":${cx+r},"y":${cy},  "x1":${cx+r},"y1":${cy}},
   {"op":"A","x":${cx},  "y":${cy+r},"x1":${cx+r},"y1":${cy+r},"x2":${cx},  "y2":${cy+r},"r":${r}},
   {"op":"A","x":${cx-r},"y":${cy},  "x1":${cx-r},"y1":${cy+r},"x2":${cx-r},"y2":${cy},  "r":${r}},
   {"op":"A","x":${cx},  "y":${cy-r},"x1":${cx-r},"y1":${cy-r},"x2":${cx},  "y2":${cy-r},"r":${r}},
   {"op":"A","x":${cx+r},"y":${cy},  "x1":${cx+r},"y1":${cy-r},"x2":${cx+r},"y2":${cy},  "r":${r}},
   {"op":"z"}
  ]}`;  
  }
  /////////////////////////////////////////////////////////////////////////
  ///rect drawing
  /////////////////////////////////////////////////////////////////////////
  p_rect(x,y,w,h,rdx,rdy,g){
    [x,y] = this.move_xy(x,y);
    x = this.localx(x);
    y = this.localy(y);
    w = this.localdist(w);
    h = this.localdist(h);
    rdx = this.localdist(rdx);
    rdy = this.localdist(rdy);
    if(rdx&&rdy){
      rdx=Math.min(rdx,rdy);
      return `\
{"type":"rect",
 "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
 "points":[
  {"op":"M" ,"x":${x}   ,"y":${y}    ,"x1":${x}      ,"y1":${y-rdx}  ,"x2":0           ,"y2":0         ,"r":${rdx}},
  {"op":"A" ,"x":${x}   ,"y":${y}    ,"x1":${x}      ,"y1":${y}      ,"x2":${x+rdx}    ,"y2":${y}      ,"r":${rdx}},
  {"op":"L" ,"x":${x+w} ,"y":${y}    ,"x1":${x+w-rdx},"y1":${y}      ,"x2":0           ,"y2":0         ,"r":${rdx}},
  {"op":"A" ,"x":${x+w} ,"y":${y}    ,"x1":${x+w}    ,"y1":${y}      ,"x2":${x+w}      ,"y2":${y-rdx}  ,"r":${rdx}},
  {"op":"L" ,"x":${x+w} ,"y":${y-h}  ,"x1":${x+w}    ,"y1":${y-h+rdx},"x2":0           ,"y2":0         ,"r":${rdx}},
  {"op":"A" ,"x":${x+w} ,"y":${y-h}  ,"x1":${x+w}    ,"y1":${y-h}    ,"x2":${x+w-rdx}  ,"y2":${y-h}    ,"r":${rdx}},
  {"op":"L" ,"x":${x}   ,"y":${y-h}  ,"x1":${x+rdx}  ,"y1":${y-h}    ,"x2":0           ,"y2":0         ,"r":${rdx}},
  {"op":"A" ,"x":${x}   ,"y":${y-h}  ,"x1":${x}      ,"y1":${y-h}    ,"x2":${x}        ,"y2":${y-h+rdx},"r":${rdx}},
  {"op":"z"}
  ]}`;  
    }else{
      return `\
{"type":"rect",
 "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
 "points":[
  {"op":"M","x":${x},   "y":${y},   "x1":${x},   "y1":${y}},
  {"op":"L","x":${x+w}, "y":${y},   "x1":${x+w}, "y1":${y}},
  {"op":"L","x":${x+w}, "y":${y-h}, "x1":${x+w}, "y1":${y-h}},
  {"op":"L","x":${x},   "y":${y-h}, "x1":${x},   "y1":${y-h}},
  {"op":"z"}
  ]}`;  
    }    
  }
  /////////////////////////////////////////////////////////////////////////
  ///line drawing
  /////////////////////////////////////////////////////////////////////////
  p_line(x1,y1,x2,y2,g){
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    return `\
{"type":"line",
 "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
 "points":[
  {"op":"M","x":${x1},"y":${y1}, "x1":${x1},"y1":${y1}},
  {"op":"L","x":${x2},"y":${y2}, "x1":${x2},"x1":${y2}}
  ]}`;
  }
  /////////////////////////////////////////////////////////////////////////
  ///polyline drawing
  /////////////////////////////////////////////////////////////////////////
  p_polyline(points,g){
    var d = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      [x,y] = this.move_xy(x,y);
      x = this.localx(x);
      y = this.localy(y);
      if(i==1){
        d.push(`{"op":"M","x":${x},"y":${y}, "x1":${x},"y1":${y}}`);
      }else{
        d.push(`{"op":"L","x":${x},"y":${y}, "x1":${x},"y1":${y}}`);
      }
    }
    var s = d.join(',\n  ');
    return `\
{"type":"polyline",
 "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
 "points":[
  ${s}
  ]}`;
  }
  /////////////////////////////////////////////////////////////////////////
  ///polygon drawing
  /////////////////////////////////////////////////////////////////////////
  p_polygon(points,g){
    var d = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      [x,y] = this.move_xy(x,y);
      x = this.localx(x);
      y = this.localy(y);
      if(i==1){
        d.push(`{"op":"M","x":${x},"y":${y}, "x1":${x},"y1":${y}}`);
      }else{
        d.push(`{"op":"L","x":${x},"y":${y}, "x1":${x},"y1":${y}}`);
      }
    }
    if(d.length){
      d.push(`{"op":"z"}`)
    }
    var s = d.join(',\n  ');
    return `\
{"type":"polygon",
 "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
 "points":[
  ${s}
  ]}`;
  }
  p_sector(cx,cy,r,ri,start,span,g){
    [cx,cy] = this.move_xy(cx,cy);
    cx = this.localx(cx);
    cy = this.localy(cy);
    r = this.localdist(r);
    ri = this.localdist(ri);
    //NOTE that sAngle/eAngle is reversed because SVG is clockwise rotation
    var eAngle = (360-start)/180*Math.PI;
    var sAngle = (360-(start+span))/180*Math.PI;
    var out0x = cx + r*Math.cos(start/180*Math.PI);
    var out0y = cy - r*Math.sin(start/180*Math.PI);
    var out1x = cx + r*Math.cos((start+span)/180*Math.PI);
    var out1y = cy - r*Math.sin((start+span)/180*Math.PI);
    var inn0x = cx + ri*Math.cos(start/180*Math.PI);
    var inn0y = cy - ri*Math.sin(start/180*Math.PI);
    var inn1x = cx + ri*Math.cos((start+span)/180*Math.PI);
    var inn1y = cy - ri*Math.sin((start+span)/180*Math.PI);
    if(ri==0){
      //no inner radius
      return `\
      {"type":"sector",
      "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
      "points":[
        {"op":"M","x":${cx},     "y":${cy},     "x1":${cx},"y1":${cy}},
        {"op":"L","x":${out1x},  "y":${out1y},  "x1":${out1x},"y1":${out1y}},
        {"op":"a","x":${out0x},  "y":${out0y},  "x1":${cx},"y1":${cy},"r":${r},"sAngle":${sAngle},"eAngle":${eAngle},"anticlockflag":0},
        {"op":"z"}
      ]}`;  
    }else{
      //has inner radius
      return `\
      {"type":"sector",
      "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
      "points":[
        {"op":"M","x":${out1x},  "y":${out1y},  "x1":${out1x},"y1":${out1y}},
        {"op":"a","x":${out0x},  "y":${out0y},  "x1":${cx},   "y1":${cy},"r":${r},"sAngle":${sAngle},"eAngle":${eAngle},"anticlockflag":0},
        {"op":"L","x":${inn0x},  "y":${inn0y},  "x1":${inn0x},"y1":${inn0y}},
        {"op":"a","x":${inn1x},  "y":${inn1y},  "x1":${cx},   "y1":${cy},"r":${ri},"sAngle":${eAngle},"eAngle":${sAngle},"anticlockflag":1},
        {"op":"z"}
      ]}`;  
    }
  }
  p_segment(cx,cy,r,start,span,g){
    [cx,cy] = this.move_xy(cx,cy);
    cx = this.localx(cx);
    cy = this.localy(cy);
    r = this.localdist(r);
    //NOTE that sAngle/eAngle is reversed because SVG is clockwise rotation
    var eAngle = (360-start)/180*Math.PI;
    var sAngle = (360-(start+span))/180*Math.PI;
    var out0x = cx + r*Math.cos(start/180*Math.PI);
    var out0y = cy - r*Math.sin(start/180*Math.PI);
    var out1x = cx + r*Math.cos((start+span)/180*Math.PI);
    var out1y = cy - r*Math.sin((start+span)/180*Math.PI);
    //no inner radius
    return `\
    {"type":"segment",
    "transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_TO_PX},${this.origin_y*this.viewport_unit*this.MM_TO_PX}],
    "points":[
      {"op":"M","x":${out1x},  "y":${out1y},  "x1":${out1x},"y1":${out1y}},
      {"op":"a","x":${out0x},  "y":${out0y},  "x1":${cx},"y1":${cy},"r":${r},"sAngle":${sAngle},"eAngle":${eAngle},"anticlockflag":0},
      {"op":"z"}
    ]}`;  
  }
  /////////////////////////////////////////////////////////////////////////
  ///Bezier curve drawing
  /////////////////////////////////////////////////////////////////////////
  p_qbezier_line(x0,y0, x1,y1, x2,y2, g){
    [x0,y0] = this.move_xy(x0,y0);
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    var d = [];
    var x0 = this.localx(x0);
    var y0 = this.localy(y0);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
  }
  /////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////
  p_cbezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g){
    [x0,y0] = this.move_xy(x0,y0);
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    [x3,y3] = this.move_xy(x3,y3);
    var d = [];
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
        d.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' />`);
      }else if(arrowhead==2){
        let id2 = this.create_arrowhead('start',g);
        d.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}' ${this.g_to_svg_drawonly_str(g)} marker-start='url(#${id2})' />`);
      }else if(arrowhead==3){
        let id1 = this.create_arrowhead('end',g);
        let id2 = this.create_arrowhead('start',g);
        d.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' marker-start='url(#${id2})' />`);
      }else{
        d.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}' ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    return d.join('\n');
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
  string_to_svg_color(s,hints,def='none') {
    if (!s) {
      return def;
    } 
    if(typeof(s)==='string'){
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
    // o.push(`<path d='${d}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' marker-start='url(#startArrow)' />`);
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
    if(this.my_filter_blur_id==0){
      this.my_filter_blur_id = this.get_css_id();
    }
    return this.my_filter_blur_id;
  }
  /////////////////////////////////////////////////////////////////////////
  ///grid unit to CANVAS unit, which is 0/0 at the topleft corner
  /////////////////////////////////////////////////////////////////////////
  localx(x) {
    x *= this.u;
    return x;
  }
  localdist(x) {
    x *= this.u;
    return x;
  }
  localy(y) {
    y = this.viewport_height-y;
    y *= this.u;
    return y;
  }
  localpt(pt) {
    let [x,y] = pt;;
    x = this.localx(x);
    y = this.localy(y);
    return [x,y];
  }
  ///////////////////////////////////////////////////////////////////////////////
  ///
  ///
  ///
  ///////////////////////////////////////////////////////////////////////////////
  move_coords(coords){
    ///this method will return a duplicated coords if anything in the original is to be changed
    ///  because this method and the next two methods are used exclusively by subclasses of diagram
    ///  to align the content to the new origin, thus it is good that the subclass does not modify
    ///  the original contents of 'coords' because its contents are likely to be re-used by 'dia' class
    if(this.origin_x !== 0 || this.origin_y !== 0 || this.origin_sx !== 1 || this.origin_sy !== 1 ){
      let p = this.dup_coords(coords);
      this.offset_coords(p,this.origin_x,this.origin_y,this.origin_sx,this.origin_sy,0);
      return p;
    }else{
      return coords;
    }
  }
  move_xy(x,y){
    var pt = [x,y];
    this.offset_pt(pt,this.origin_x,this.origin_y,this.origin_sx,this.origin_sy,0);
    return pt;
  }
  scale_dist(r){
    return r*Math.min(this.origin_sx,this.origin_sy);
  }
  scale_dist_x(r){
    return r*this.origin_sx;
  }
  scale_dist_y(r){
    return r*this.origin_sy;
  }
}
module.exports = { NitrilePreviewDiagramBall };
