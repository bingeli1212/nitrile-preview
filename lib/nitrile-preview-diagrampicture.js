'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { arcpath } = require('./nitrile-preview-arcpath');
const my_svglabel_dx = 4;///hardcoded for moving horizontally away from the anchor point in px
const my_svglabel_dy = 2;///hardcoded for moving vertically away from the anchor point in px

class NitrilePreviewDiagramPicture extends NitrilePreviewDiagram {
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
    let [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    this.viewport_width = viewport_width;
    this.viewport_height = viewport_height;
    this.viewport_unit = viewport_unit;
    this.viewport_grid = this.viewport_grid;
    //
    // execute byte and store all outputs in this.commands member
    //
    this.exec_body(style,ss,env);
    //
    // preparing for this.commands to be send out as return value
    //
    // var d = this.commands.map(x => (typeof x==='string')?x.trim():'');
    // var d = d.filter(s => (s && s.trim().length));
    // var o = [];
    //GENERATE grids
    let stretch = this.g_to_stretch_float(style);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    if(width && height){
      var mywidth=(`${width}mm`);
      var myheight=(`${height}mm`);
      // opts.push('keepaspectratio');
    }else if(width){
      var mywidth=(`${width}mm`);
      var myheight=(`${width*(viewport_height/viewport_width)}mm`);
      // opts.push('keepaspectratio');
    }else if(height){
      var mywidth=(`${height*(viewport_width/viewport_height)}mm`);
      var myheight=(`${height}mm`);
      // opts.push('keepaspectratio');
    }else{
      var mywidth=(`${viewport_width*viewport_unit}mm`);
      var myheight=(`${viewport_height*viewport_unit}mm`);
      // opts.push('keepaspectratio');
    }
    var d = [];
    d.push(`\\setlength{\\unitlength}{${viewport_unit}mm}`);
    d.push(`\\begin{picture}(${viewport_width},${viewport_height})`);
    d.push(`{\\thinlines\\color{lightgray}\\graphpaper[1](0,0)(${viewport_width},${viewport_height})}`);
    d.push(`\\roundjoin`);
    if(style.frame){
      d.push(`{\\linethickness{1pt}\\polygon(0,0)(${viewport_width},0)(${viewport_width},${viewport_height})(0,${viewport_height})}`);
    }
    d.push(`\\linethickness{3pt}`);
    this.commands.forEach((s) => {
      if(s && typeof s==='string'){
        s = s.trim();
        if(s.length){
          d.push(s);
        }
      }
    })
    d.push(`\\end{picture}`);
    var img = d.join('\n');
    var img = `\\resizebox{${mywidth}}{${myheight}}{${img}}`;
    var img = `\\mbox{${img}}`
    var subc = this.translator.uncode(style,this.subtitle);
    var o = [];
    o.push({img,subc,w:mywidth});
    return o;
  }
  /////////////////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////////////////
  localx(x) {
    return x;
  }
  localdist(x) {
    return x;
  }
  localy(y) {
    return y;
  }
  localpt(pt) {
    let [x,y] = pt;;
    x = this.localx(x);
    y = this.localy(y);
    return [x,y];
  }
  //////////////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///ellipse drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
  p_ellipse(cx,cy,rx,ry,g){
    [cx,cy] = this.move_xy(cx,cy);
    cx = this.localx(cx);
    cy = this.localy(cy);
    rx = this.localdist(rx);
    ry = this.localdist(ry);
    var dx = 0.55228*rx;
    var dy = 0.55228*ry;
    var all = [];
    all.push(`\\moveto(${cx+rx},${cy})`);
    all.push(`\\curveto(${cx+rx},${cy+dy})(${cx+dx},${cy+ry})(${cx},${cy+ry})`);
    all.push(`\\curveto(${cx-dx},${cy+ry})(${cx-rx},${cy+dy})(${cx-rx},${cy})`);
    all.push(`\\curveto(${cx-rx},${cy-dy})(${cx-dx},${cy-ry})(${cx},${cy-ry})`);
    all.push(`\\curveto(${cx+dx},${cy-ry})(${cx+rx},${cy-dy})(${cx+rx},${cy})`);
    all.push(`\\closepath`);
    all.push(`\\strokepath`)
    return all.join('\n');
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///circle drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
  p_circle(cx,cy,r,g){
    [cx,cy] = this.move_xy(cx,cy);
    cx = this.localx(cx);
    cy = this.localy(cy);
    r = this.localdist(r);
    var s = `\\put(${cx},${cy}){\\circle{${r*2}}}`
    return s;
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///rect drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
  p_rect(x,y,w,h,rdx,rdy,g){
    if(rdx > w/2) rdx = w/2;
    if(rdy > h/2) rdy = h/2;
    [x,y] = this.move_xy(x,y);
    x = this.localx(x);
    y = this.localy(y);
    w = this.localdist(w);
    h = this.localdist(h);
    rdx = this.localdist(rdx);
    rdy = this.localdist(rdy);
    var rd = Math.min(rdx,rdy);
    rdx = rd;
    rdy = rd;
    if(rdx==0){
      var pts = [];
      pts[0] = {x,y};
      pts[1] = {x:x+w,y};
      pts[2] = {x:x+w,y:y+h};
      pts[3] = {x,y:y+h};
      pts = pts.map((pt)=>`(${pt.x},${pt.y})`);
      var s = pts.join('');
      var s = `\\polygon${s}`
      return s;
    }else{
      var rx = w/2;
      var ry = h/2;
      var cx = x + rx;
      var cy = y + ry;
      var all = [];
      all.push(`\\moveto(${cx+rx},${cy+ry-rd})`);
      all.push(`\\circlearc{${cx+rx-rd}}{${cy+ry-rd}}{${rd}}{${0}}{${90}}`);
      all.push(`\\lineto(${cx-rx+rd},${cy+ry})`);
      all.push(`\\circlearc{${cx-rx+rd}}{${cy+ry-rd}}{${rd}}{${90}}{${180}}`);
      all.push(`\\lineto(${cx-rx},${cy-ry+rd})`);
      all.push(`\\circlearc{${cx-rx+rd}}{${cy-ry+rd}}{${rd}}{${180}}{${270}}`);
      all.push(`\\lineto(${cx+rx-rd},${cy-ry})`);
      all.push(`\\circlearc{${cx+rx-rd}}{${cy-ry+rd}}{${rd}}{${270}}{${360}}`);
      all.push(`\\closepath`);
      all.push(`\\strokepath`)
      return all.join('\n');
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///line drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
  p_line(x1,y1,x2,y2,g){
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    return this.local_drawline(x1,y1,x2,y2);
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///polyline drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
  p_polyline(points,g){
    var d = [];
    var pts = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      [x,y] = this.move_xy(x,y);
      x = this.localx(x);
      y = this.localy(y);
      pts.push(`(${x},${y})`);
    }
    var s = pts.join('');
    var s = `\\polyline${s}`
    return s;
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///polygon drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
  p_polygon(points,g){
    var d = [];
    var pts = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      [x,y] = this.move_xy(x,y);
      x = this.localx(x);
      y = this.localy(y);
      pts.push(`(${x},${y})`);
    }
    var s = pts.join('');
    var s = `\\polygon${s}`
    return s;
  }
  p_sector(cx,cy,r,ri,start,span,g){
    var all = [];
    if(ri==0){
      var out0x = cx + r*Math.cos(start/180*Math.PI);
      var out0y = cy + r*Math.sin(start/180*Math.PI);
      all.push(`\\moveto(${cx},${cy})`);
      all.push(`\\lineto(${out0x},${out0y})`);
      all.push(`\\circlearc{${cx}}{${cy}}{${r}}{${start}}{${start+span}}`);
      all.push(`\\closepath`);
      all.push(`\\strokepath`);
    }else{
      var out0x = cx + r*Math.cos(start/180*Math.PI);
      var out0y = cy + r*Math.sin(start/180*Math.PI);
      var inn1x = cx + ri*Math.cos((start+span)/180*Math.PI);
      var inn1y = cy + ri*Math.sin((start+span)/180*Math.PI);
      all.push(`\\moveto(${out0x},${out0y})`);
      all.push(`\\circlearc{${cx}}{${cy}}{${r}}{${start}}{${start+span}}`);
      all.push(`\\lineto(${inn1x},${inn1y})`);
      all.push(`\\circlearc{${cx}}{${cy}}{${ri}}{${start+span}}{${start}}`);
      all.push(`\\closepath`);
      all.push(`\\strokepath`);      
    }
    return all.join('\n')
  }
  p_segment(cx,cy,r,start,span,g){
    var all = [];
    var out0x = cx + r*Math.cos(start/180*Math.PI);
    var out0y = cy + r*Math.sin(start/180*Math.PI);
    all.push(`\\moveto(${out0x},${out0y})`);
    all.push(`\\circlearc{${cx}}{${cy}}{${r}}{${start}}{${start+span}}`);
    all.push(`\\closepath`);
    all.push(`\\strokepath`);
    return all.join('\n')
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///Bezier curve drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
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
  /////////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////////
  local_drawline(x1,y1,x2,y2){
    var dx = x2-x1;
    var dy = y2-y1;
    if(Math.abs(dx) < this.MIN_FLOAT){
      //vertical line
      var s=(`\\put(${x1},${y1}){\\line(${0},${Math.sign(dy)}){${Math.abs(dy)}}}`)
    }else{
      var s=(`\\put(${x1},${y1}){\\line(${dx},${dy}){${Math.abs(dx)}}}`)
    }
    return s;
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
module.exports = { NitrilePreviewDiagramPicture };
