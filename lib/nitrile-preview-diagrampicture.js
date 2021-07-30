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
    this.MM_to_PX = 3.7795296;
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
    if(stretch){
      var mywidth=(`${stretch}\\linewidth`);
      var myheight=(`${stretch*(viewport_height/viewport_width)}\\linewidth`);
      // opts.push('keepaspectratio');
    }else if(width && height){
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
      const stretch = 1;
      var mywidth=(`${stretch}\\linewidth`);
      var myheight=(`${stretch*(viewport_height/viewport_width)}\\linewidth`);
      // opts.push('keepaspectratio');
    }
    var d = [];
    d.push(`\\setlength{\\unitlength}{${viewport_unit}mm}`);
    d.push(`\\begin{picture}(${viewport_width},${viewport_height})`);
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
    if(style.frame==1){
      var img = `\\setlength\\fboxsep{0pt}\\fbox{${img}}`
    }else{
      var img = `\\mbox{${img}}`
    }
    var sub = this.translator.uncode(style,this.sub);
    var o = [];
    o.push({img,sub});
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
  ///circle drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///rect drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
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
    var x=x1, y=y1, dx=x2-x1, dy=y2-y1, magnitude=Math.sqrt(dx*dx+dy*dy);
    return `\\put(${x},${y}){\\line(${dx},${dy}){${magnitude}}}`;
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ///
  ///polygon drawing
  ///
  ////////////////////////////////////////////////////////////////////////////////////
  p_polygon(points,g){
    var d = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      [x,y] = this.move_xy(x,y);
      x = this.localx(x);
      y = this.localy(y);
      if(i==1){
        d.push(`{"op":"M","x":${x},"y":${y}}`);
      }else{
        d.push(`{"op":"L","x":${x},"y":${y}}`);
      }
    }
    if(d.length){
      d.push(`{"op":"z"}`)
    }
    var s = d.join(',\n   ');
    return `\
{"transform":[${this.origin_sx},0,0,${this.origin_sy},${this.origin_x*this.viewport_unit*this.MM_to_PX},${this.origin_y*this.viewport_unit*this.MM_to_PX}],
 "points":[
   ${s}
  ]}`;
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
}
module.exports = { NitrilePreviewDiagramPicture };