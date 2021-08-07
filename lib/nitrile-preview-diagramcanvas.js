'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { arcpath } = require('./nitrile-preview-arcpath');
const my_svglabel_dx = 4;///hardcoded for moving horizontally away from the anchor point in px
const my_svglabel_dy = 2;///hardcoded for moving vertically away from the anchor point in px

class NitrilePreviewDiagramCanvas extends NitrilePreviewDiagram {

  constructor(translator) {
    super(translator);
    this.tokenizer = new NitrilePreviewTokenizer(translator);
    ///this are storages for offloading to <defs>
    this.my_gradient_array = [];
    this.my_arrowhead_array = [];
    this.my_path_array = [];
    this.my_filter_blur_id = 0;
    this.MM_TO_PX = 3.7795296;
  }
  to_canvas(style,ss) {
    ss = this.trim_samp_body(ss);
    var env = {};
    this.init_internals();
    this.config = {...style};
    var [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    this.viewport_width = viewport_width;
    this.viewport_height = viewport_height;
    this.viewport_unit = viewport_unit;
    this.viewport_grid = viewport_grid;
    var u = 3.7795296*viewport_unit;//mm ot px
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
    var MM_TO_PX = this.MM_TO_PX;
    let stretch = this.g_to_stretch_float(style);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    if(width && height){
      var css_width = `; width:${width}mm`;
      var css_height = `; height:${height}mm`;
      var w = width*this.MM_TO_PX;
    }else if(width){
      var css_width = `; width:${width}mm`;
      var css_height = `; height:${width/viewport_width*viewport_height}mm`;
      var w = width*this.MM_TO_PX;
    }else if(height){
      var css_width = `; width:${height/viewport_height*viewport_width}mm`;
      var css_height = `; height:${height}mm`;
      var w = viewport_width/viewport_height*height*this.MM_TO_PX;
    }else{
      var css_width = `; width:${viewport_width*viewport_unit}mm`;
      var css_height = `; height:${viewport_height*viewport_unit}mm`;
      var w = viewport_width*viewport_unit*this.MM_TO_PX;
    }
    var css = this.translator.css('CANVAS');
    css += this.style_to_css_border(style);
    css += css_width;
    css += css_height;
    if(1){
      var gridcolor = this.g_to_gridcolor_string(this.config);
      var gridcolor = this.string_to_svg_color(gridcolor,0);
      let gw = viewport_grid*viewport_unit*MM_TO_PX;
      let s_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${vw} ${vh}">
                   <pattern patternUnits="userSpaceOnUse" id="id" width="${gw}" height="${gw}">
                   <polyline points="0 0 ${gw} 0 ${gw} ${gw} 0 ${gw}" fill="none" stroke="${gridcolor}"/></pattern>
                   <rect x="0" y="0" width="${vw}" height="${vh}" fill="url(#id)" stroke="${gridcolor}"/></svg>`;
      css += `; background-image:url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s_svg)}"); background-size:cover;`;
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
    var img = `<canvas width='${viewport_width*viewport_unit*MM_TO_PX}' height='${viewport_height*viewport_unit*MM_TO_PX}' style='${css}' json='${json}'></canvas>`;
    var subc = '';
    var o = [];
    o.push({img,subc,w});
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
  to_canvas_script(){
    return `\
    document.onreadystatechange = () => {
      if(document.readyState === 'complete'){
        setupAllCanvas();
      }
    }
    function setupAllCanvas(){
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        setupCanvas(canvas);
      }
      drawAllCanvas();
    }
    function setupCanvas(canvas){
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
        canvas.addEventListener("mousedown", onmousedown, false);
        canvas.addEventListener("mouseup", onmouseup, false);
        canvas.addEventListener("mousemove", onmousemove, false);
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
    function drawAllCanvas(timestamp){
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        drawCanvas(canvas);
      }
      requestAnimationFrame(drawAllCanvas);
    }
    function drawCanvas(canvas){
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
    function onmousedown(evt){
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
    function onmousemove(evt){
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
    function onmouseup(evt){
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
module.exports = { NitrilePreviewDiagramCanvas };
