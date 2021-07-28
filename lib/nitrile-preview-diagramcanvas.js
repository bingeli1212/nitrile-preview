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
    this.MM_to_PX = 3.7795296;
  }
  to_canvas(style,ss) {
    ss = this.trim_samp_body(ss);
    var env = {};
    this.init_internals();
    this.config = {...style};
    var viewport = style.viewport;
    let nn = this.translator.string_to_int_array(viewport);
    this.viewport_width = nn[0]||this.viewport_width;
    this.viewport_height = nn[1]||this.viewport_height;
    this.viewport_unit = nn[2]||this.viewport_unit;
    this.viewport_grid = nn[3]||this.viewport_grid;
    //
    // setup
    //
    this.u = 3.7795296*this.viewport_unit;//mm ot px
    this.vw = this.u*this.viewport_width;
    this.vh = this.u*this.viewport_height;
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
    var viewport = this.assert_string(style.viewport);
    var viewport_width = this.viewport_width;
    var viewport_height = this.viewport_height;
    var viewport_unit = this.viewport_unit;
    var MM_to_PX = this.MM_to_PX;
    let stretch = this.g_to_stretch_float(style);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    if(stretch){
      var css_width = `; width:${100*stretch}%`;
      var css_height = '';
    }else if(width && height){
      var css_width = `; width:${width}mm`;
      var css_height = `; height:${height}mm`;
    }else if(width){
      var css_width = `; width:${width}mm`;
      var css_height = `; height:${width/viewport_width*viewport_height}mm`;
    }else if(height){
      var css_width = `; width:${height/viewport_height*viewport_width}mm`;
      var css_height = `; height:${height}mm`;
    }else{
      var css_width = `; width:${viewport_width*viewport_unit}mm`;
      var css_height = `; height:${viewport_height*viewport_unit}mm`;
    }
    var css = this.translator.css('CANVAS');
    css += this.style_to_css_border(style);
    css += css_width;
    css += css_height;
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
    var img = `<canvas width='${viewport_width*viewport_unit*MM_to_PX}' height='${viewport_height*viewport_unit*MM_to_PX}' style='${css}' json='${json}'></canvas>`;
    var sub = '';
    var o = [];
    o.push({img,sub});
    return o;
  }

  localx(x) {
    /// * NOTE: this method translate and/or scale the local reference point to
    ///   Canvas coords.
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
    ///   Canvas coords.
    ///
    y = this.viewport_height-y;
    y *= this.u;
    return y;
  }
  localpt(pt) {
    /// * NOTE: this method translate and/or scale the local reference point to
    ///   Canvas coords.
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
      var x = this.localx(pt[0]);///NOTE:becomes Canvas coords
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
        o.push(`z`);
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
        Rx = Math.max(Rx,this.MIN);
        Ry = Math.max(Ry,this.MIN);
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

  ///
  ///
  ///
  p_comment(s) {
  }
  p_label(x,y,txt,ta,g){
  }
  p_math(x,y,txt,ta,g) {
  }
  p_text(x,y,txt,ta,g){
    var x = this.localx(x);
    var y = this.localy(y);
    return 
  }
  p_cairo(px,py,txt,extent,g){
  }
  p_slopedtext(x1,y1,x2,y2,txt,ta,g){
  }
  p_slopedmath(x1,y1,x2,y2,txt,ta,g){
  }
  p_fill(coords,_g){
  }
  p_draw(coords,_g){
  }
  p_stroke(coords,_g){
  }
  p_arrow(coords,_g){
  }
  p_revarrow(coords,_g){
  }
  p_dblarrow(coords,_g){
  }
  ///
  ///circle drawing
  ///
  p_circle(cx,cy,r,g){
    [cx,cy] = this.move_xy(cx,cy);
    cx = this.localx(cx);
    cy = this.localy(cy);
    r = this.localdist(r);
    return `\
{"transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_to_PX},${this.origin_y*this.viewport_unit*this.MM_to_PX}],
 "points":[
   {"op":"M","x":${cx+r},"y":${cy}},
   {"op":"A","x":${cx},  "y":${cy+r},"x1":${cx+r},"y1":${cy+r},"x2":${cx},  "y2":${cy+r},"r":${r}},
   {"op":"A","x":${cx-r},"y":${cy},  "x1":${cx-r},"y1":${cy+r},"x2":${cx-r},"y2":${cy},  "r":${r}},
   {"op":"A","x":${cx},  "y":${cy-r},"x1":${cx-r},"y1":${cy-r},"x2":${cx},  "y2":${cy-r},"r":${r}},
   {"op":"A","x":${cx+r},"y":${cy},  "x1":${cx+r},"y1":${cy-r},"x2":${cx+r},"y2":${cy},  "r":${r}},
   {"op":"z"}
  ]}`;  
  }
  ///
  ///rect drawing
  ///
  p_rect(x,y,w,h,g){
    [x,y] = this.move_xy(x,y);
    x = this.localx(x);
    y = this.localy(y);
    w = this.localdist(w);
    h = this.localdist(h);
    return `\
{"transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_to_PX},${this.origin_y*this.viewport_unit*this.MM_to_PX}],
 "points":[
   {"op":"M","x":${x},   "y":${y}},
   {"op":"L","x":${x+w}, "y":${y}},
   {"op":"L","x":${x+w}, "y":${y-h}},
   {"op":"L","x":${x},   "y":${y-h}},
   {"op":"z"}
  ]}`;  
  }
  ///
  ///line drawing
  ///
  p_line(x1,y1,x2,y2,g){
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    return `\
{"transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_to_PX},${this.origin_y*this.viewport_unit*this.MM_to_PX}],
 "points":[
   {"op":"M","x":${x1},"y":${y1}},
   {"op":"L","x":${x2},"y":${y2}}
  ]}`;
  }
  ///
  ///Bezier curve drawing
  ///
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
  p_dot_square(x,y,g){
    [x,y] = this.move_xy(x,y);
    var r = this.g_to_svg_dotsize_radius_px(g);
    var o = [];
    if (x < 0 || x > this.viewport_width) {
      return;
    }
    if (y < 0 || y > this.viewport_height) {
      return;
    }
    var x = this.localx(x);
    var y = this.localy(y);
    var r2 = r*2;
    if(this.has_dots(g)){
      o.push(`<rect x='${x-r}' y='${y-r}' width='${r2}' height='${r2}' ${this.g_to_svg_dotonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_dot_circle(x,y,g){
    [x,y] = this.move_xy(x,y);
    var r = this.g_to_svg_dotsize_radius_px(g);
    var o = [];
    if(x < 0 || x > this.viewport_width){
      return;
    }
    if(y < 0 || y > this.viewport_height){
      return;
    }
    var x = this.localx(x);
    var y = this.localy(y);
    if(this.has_dots(g)){
      o.push(`<circle cx='${this.fix(x)}' cy='${this.fix(y)}' r='${this.fix(r)}' ${this.g_to_svg_dotonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_dot_pie(cx,cy,start_a,span_a,g){
    [cx,cy] = this.move_xy(cx,cy);
    var r = this.g_to_svg_dotsize_radius_px(g);
    var o = [];
    if (cx < 0 || cx > this.viewport_width) {
      return;
    }
    if (cy < 0 || cy > this.viewport_height) {
      return;
    }
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
    o.push(`<path d='${s}' ${this.g_to_svg_dotonly_str(g)} />`);
    return o.join('\n');
  }
  p_rhbar(x,y,g){
    [x,y] = this.move_xy(x,y);
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
      o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_lhbar(x,y,g){
    [x,y] = this.move_xy(x,y);
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
      o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_tvbar(x,y,g){
    [x,y] = this.move_xy(x,y);
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var Dy = this.g_to_barlength_float(g)/2;
    var X2 = this.localx(x);
    var Y2 = this.localy(y+Dy);
    if(this.has_strokes(g)){
      o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_bvbar(x,y,g){
    [x,y] = this.move_xy(x,y);
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var dy = this.g_to_barlength_float(g)/2;
    var X2 = this.localx(x);
    var Y2 = this.localy(y-dy);
    if(this.has_strokes(g)){
      o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_image(imagefile){
    ///<image href="mdn_logo_only_color.png" height="200" width="200"/>
    if (1) {
      var { imgsrc, imgid } = this.translator.to_request_image(imagefile);
      console.log('to_request_image()','imgsrc',imgsrc.slice(0, 40), 'imgid', imgid);
    }
    var o = [];
    let width = this.localdist(this.viewport_width);
    let height = this.localdist(this.viewport_height);
    o.push(`<image xlink:href='${imgsrc}' width='${width}' height='${height}' id='${imgid}' x='0' y='0' />`);
    return o.join('\n');
  }

  ///
  ///
  ///
  g_to_svg_textdraw_str(g) {
    var d = [];
    var s = this.g_to_fontcolor_string(g);
    if (s) {
      d.push(`fill='${this.string_to_svg_color(s,g.hints)}'`);
    }
    d.push(`stroke='none'`);
    return d.join(' ');
  }
  g_to_svg_drawonly_str(g) {
    g = g||{};
    var d = [];
    let linedashed = this.g_to_linedashed_int(g);
    if (linedashed) {
      d.push(`stroke-dasharray='3.0 3.0'`);
    } 
    let linesize = this.g_to_linesize_float(g);
    if(linesize){
      d.push(`stroke-width='${linesize*1.333}'`);
    }
    let linecolor = this.g_to_linecolor_string(g);
    if (linecolor) {
      d.push(`stroke='${this.string_to_svg_color(linecolor,g.hints)}'`);
    } else {
      d.push(`stroke='currentColor'`);
    }
    let linecap = this.g_to_linecap_string(g);
    if (linedashed) {
      d.push(`stroke-linecap='butt'`);///for dashed lines if it sets to anything other than 'butt' it does not look good and the dashed part looks too close together
    } else if (linecap) {
      d.push(`stroke-linecap='${this.string_to_svg_linecap_name(linecap)}'`);
    }  
    let linejoin = this.g_to_linejoin_string(g);
    if (linejoin) {
      d.push(`stroke-linejoin='${this.string_to_svg_linejoin_name(linejoin)}'`);
    } 
    d.push(`fill='none'`);
    return d.join(' ');
  }
  g_to_svg_shadeonly_str(g,isinherit) {
    g = g||{};
    var d = [];
    let ss = this.g_to_svg_shadecolor_ss(g);
    let shade = this.g_to_shade_string(g);
    let angle = this.g_to_angle_float(g);
    let opacity = this.g_to_opacity_float(g);
    if(shade=='linear'){
      let p = {};
      p.x1 = 0;
      p.y1 = 0;
      p.x2 = 1;
      p.y2 = 0;
      p.ss = ss;
      p.type = 'linear';
      p.id = this.get_css_id();
      this.my_gradient_array.push(p);
      d.push(`fill='url(#${p.id})'`);
      ///TODO: assume angle = 0 for now
      ///NOTE: that the cos and sin are reversed here because
      /// when angle is 0 it is the top-down and when angle is 90 is left-right
      angle = this.assert_float(angle,0,0,90);
      p.x2 = this.fix(Math.sin(angle/180*Math.PI));
      p.y2 = this.fix(Math.cos(angle/180*Math.PI));
    }else if(shade=='radial'){
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
      d.push(`fill='url(#${p.id})'`);
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
      d.push(`fill='url(#${p.id})'`);
    }
    if (opacity < 1) {
      d.push(`opacity='${opacity}'`);
    }
    d.push(`stroke='none'`);
    return d.join(' ');
  }
  g_to_svg_fillonly_str(g) {
    g = g||{};
    var d = [];
    let fillcolor = this.g_to_fillcolor_string(g);
    if(fillcolor == 'none'){
      d.push(`fill='none'`)
    } 
    else if(fillcolor) {
      d.push(`fill='${this.string_to_svg_color(fillcolor,g.hints)}'`);
    } 
    else {
      d.push(`fill='currentColor'`);
    } 
    let opacity = this.g_to_opacity_float(g);
    if (opacity < 1) {
      d.push(`opacity='${opacity}'`);
    }
    d.push(`stroke='none'`);
    let blur = g.hints & this.hint_shadow;
    if (blur){
      let id = this.get_filter_blur_id();
      d.push(`filter='url(#${id})'`);
    }
    return d.join(' ');
  }
  g_to_svg_dotonly_str(g){
    g = g||{};
    var o = [];
    var s = this.g_to_dotcolor_string(g);
    if (s) {
      o.push(`fill='${this.string_to_svg_color(s,g.hints)}'`);
    } else {
      o.push(`fill='currentColor'`);
    }
    o.push(`stroke='none'`);
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
    var s = this.g_to_fontfamily_string(g);
    var ss = [];
    if(this.string_has_item(s,'monospace')){
      ss.push('monospace');
    }
    return ss.join(' ');
  }
  g_to_svg_fontstyle_str(g) {
    var s = this.g_to_fontstyle_string(g);
    var ss = [];
    if(this.string_has_item(s,'normal')){
      ss.push('normal');
    }else if(this.string_has_item(s,'italic')){
      ss.push('italic')
    }else if(this.string_has_item(s,'oblique')){
      ss.push('oblique');
    }
    return ss.join(' ');
  }
  g_to_svg_fontweight_str(g) {
    var s = this.g_to_fontweight_string(g);
    var ss = [];
    if(this.string_has_item(s,'bold')){
      ss.push('bold');
    }
    return ss.join(' ');
  }
  g_to_svg_fontsize_str(g) {
    var s = this.g_to_fontsize_string(g);
    var percent = this.string_to_fontsize_percent(s);
    if(percent){
      return percent;
    }
    var number = parseFloat(s);
    if(Number.isFinite(number)){
      number = `${number}pt`;
      return number;
    }
    return '';
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
  ///
  ///
  ///
  to_ink(style,ss){

    var npara = ss.length;
    var vgap = 2;
    var [vw,vh] = this.string_to_array(style.devicesize);
    var vw = parseFloat(vw)||600;;
    var vh = parseFloat(vh)||12;
    if(vh < npara*12){
      vh = vgap + vgap + npara*12;//12pt font
    }
    var fontsize = 12; //pt
    var extra_dy = 0.78;  
    let o = [];
    if(style.framebox){
      o.push( `<rect width='${vw}pt' height='${vh}pt' fill='none' stroke='currentColor' />`)
    }
    o.push( `<text style='font-family:monospace;white-space:pre;font-size:${fontsize}pt;' text-anchor='start' x='0' y='0' >` );
    for (var i=0; i < npara; ++i) {
      let s = ss[i];
      s = this.translator.polish(style,s);
      s = this.translator.replace_blanks_with(s,'&#160;');
      var x = 0;
      o.push( `<tspan y='${vgap + (i+extra_dy)*fontsize}pt' x='0'>${s}</tspan>` );
    }
    o.push( `</text>`);
    var text = o.join('\n');
    
    var framewidth = vw;
    var frameheight = vh;
    vw *= 1.333;
    vh *= 1.333;
    var s = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='none' viewBox='0 0 ${vw} ${vh}' >${text}</svg>`;
    return { s, framewidth, frameheight, vw, vh, text };
  }
  ///
  ///This is to generate an array of extents, each of which represent
  /// a single line, or a single Canvas element, with its x/y position;
  /// the input 'extent' expresses the maximum width each line can go;
  /// the x/y represents the topleft position; all these are in Canvas
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
}

module.exports = { NitrilePreviewDiagramCanvas };
