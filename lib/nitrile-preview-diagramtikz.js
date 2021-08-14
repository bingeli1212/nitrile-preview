'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { arcpath } = require('./nitrile-preview-arcpath');

class NitrilePreviewDiagramTikz extends NitrilePreviewDiagram {

  constructor(translator) {
    super(translator);
  }
  to_diagram(style,ss){
    var animate = this.g_to_animate_string(style);
    var count = this.g_to_count_int(style);
    var envs = this.animate_to_env_array(animate,count);
    var o = [];
    if(envs.length==0){
      envs.push({});
    }
    envs.forEach((env) => {
      let p = this.do_one_frame(style,ss,env);
      o.push(p); 
    });
    return o;
  }
  do_one_frame(style,ss,env) {
    this.init_internals();
    ///CONFIG and VIEWPORT
    this.config = {...style};
    var viewport = style.viewport;
    let nn = this.translator.string_to_int_array(viewport);
    this.viewport_width = nn[0]||this.viewport_width;
    this.viewport_height = nn[1]||this.viewport_height;
    this.viewport_unit = nn[2]||this.viewport_unit;
    this.viewport_grid = nn[3]||this.viewport_grid;
    ///EXECUTE COMMANDS
    ss = this.trim_samp_body(ss);
    this.exec_body(style,ss,env);
    ///COLLECT OUTPUT
    var d = this.commands.map(x => x.trim());
    var d = d.filter(s => (s && s.trim().length));
    var s = d.join('\n');
    ///ASSEMBLE OUTPUT
    var xm = this.viewport_width;
    var ym = this.viewport_height;
    var unit = this.viewport_unit;
    var grid = this.viewport_grid;
    var gridcolor = this.g_to_gridcolor_string(style);      
    var gridcolor = this.string_to_tikz_color(gridcolor,0);
    var background = this.g_to_background_string(style);
    ///get the define colornames
    /// these items needs to be constracted after all
    /// previous p's have been processed because it needs
    /// to be dependant on some of the command line options
    /// settings such as width and height.
    ///var ym = this.viewport_height;
    ///var xm = this.viewport_width;
    ///var unit = this.viewport_unit;
    ///var a1 = `pu := \\mpdim{\\linewidth}/${xm};`;
    ///var a2 = `u := ${unit}mm;`;///unit is always in mm
    ///var a3 = `ratio := pu/u;`;
    ///var a4 = `picture wheel;`;
    ///var a5 = `wheel := image(`;
    ///var a6 = `for i=0 upto ${ym}: draw (0,i*u) --- (${xm}*u,i*u) withcolor .9white; endfor;`;
    ///var a7 = `for i=0 upto ${xm}: draw (i*u,0) --- (i*u,${ym}*u) withcolor .9white; endfor;`;
    ///o.push(a1, a2, a3, a4, a5, a6, a7);
    var all = [];
    all.push(`\\begin{tikzpicture}`);
    all.push(`\\clip (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`);
    if(background=='grid'){  
      all.push(`\\draw[help lines, step=${unit*grid}mm,color=${gridcolor},ultra thin] (0,0) grid (${xm*unit}mm,${ym*unit}mm);`);
    }else{
      ///we have to draw something so that it occupies the entire viewport, otherwise the viewport is going to clip to whatever the content is
      all.push(`\\draw[help lines, color={rgb,15:red,15;green,15;blue,15},ultra thin] (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`);
    }
    if(style.frame){
      //all.push(`\\draw[color={rgb,15:red,0;green,0;blue,0},line width=1pt] (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`);
      //all.push(`\\draw [line width=1pt] (current bounding box.north east) rectangle (current bounding box.south west);`);
    }
    all.push(s);
    all.push('\\end{tikzpicture}')
    var img = all.join('\n');
    var stretch = this.g_to_stretch_float(style);
    var width = this.g_to_width_float(style);
    var height = this.g_to_height_float(style);
    if(width && height){
      img = `\\resizebox{${width}mm}{${height}mm}{${img}}`;
      var mywidth = `${width}mm`
      var myheight = `${height}mm`
    }else if(width){
      img = `\\resizebox{${width}mm}{${ym/xm*width}mm}{${img}}`;
      var mywidth = `${width}mm`;
      var myheight = `${ym/xm*width}mm`;
    }else if(height){
      img = `\\resizebox{${xm/ym*height}mm}{${height}mm}{${img}}`;
      var mywidth = `${xm/ym*height}mm`;
      var myheight = `${height}mm`
    }else{
      //use default settings of mywidth, myheight
      var mywidth = `${xm*unit}mm`;
      var myheight = `${ym*unit}mm`;  
    }
    ///set the outline
    if(style.frame){
      img = `\\frame{${img}}`
    }else{
      img = `\\mbox{${img}}`
    }
    var subc = this.translator.uncode(style,this.subtitle);
    return { img, subc, w:mywidth };
  }
  ///
  ///
  ///
  coords_to_draw(coords) {
    ///***NOTE: returns a list of items, where each item is three members: {iscycled,s,hints}
    ///***NOTE: i.e: (1,2)..(2,3)--cycle
    /// pt[0]: [1,2,'','','']
    /// pt[1]: [2,3,'..','','']
    /// pt[2]: ['z','','--','','']
    var o = [];
    var items = [];
    var iscycled = 0;
    var hints = 0;
    var s = '';
    var x0 = 0;//previous point
    var y0 = 0;
    var u = this.viewport_unit;
    for (var i in coords) {
      var pt = coords[i];
      var x = pt[0];/// we will do fix down below
      var y = pt[1];///
      var join = pt[2]||'';
      if (join == 'M') {
        if(o.length){
          // terminate the current path segment
          iscycled = 0;
          s = o.join('');
          items.push({iscycled,s,hints});
          o = [];
        }
        o.push(`(${this.fix(x*u)}mm,${this.fix(y*u)}mm)`);
        x0 = x;
        y0 = y;
        hints = pt[12]||0;
        continue;
      }
      else if (join == 'z') {
        if(o.length){
          o.push(`--cycle`);
        }
        iscycled = 1;
        s = o.join('');
        o = [];
        items.push({iscycled,s,hints});
        continue;
      }
      else if(join == 'L') {     
        ///NOTE: line
        o.push(`--(${this.fix(x*u)}mm,${this.fix(y*u)}mm)`);
        x0 = x;
        y0 = y;
        continue;
      }
      else if (join == 'C') {
        var u = this.viewport_unit;
        let p1x = pt[3];/// CUBIC BEZIER curve controlpoint 1x
        let p1y = pt[4];/// CUBIC BEZIER curve controlpoint 1y
        let p2x = pt[5];/// CUBIC BEZIER curve controlpoint 2x
        let p2y = pt[6];/// CUBIC BEZIER curve controlpoint 2y
        var bezier = `..controls(${this.fix(p1x*u)}mm,${this.fix(p1y*u)}mm)and(${this.fix(p2x*u)}mm,${this.fix(p2y*u)}mm)..`;
        o.push(`${bezier}(${this.fix(x*u)}mm,${this.fix(y*u)}mm)`);
        x0 = x;
        y0 = y;
      }
      else if (join == 'Q') {
        let p1x_ = pt[3];/// QUADRILATIC BEZIER curve controlpoint 1x
        let p1y_ = pt[4];/// QUADRILATIC BEZIER curve controlpoint 1y
        let [C0,C1,C2,C3] = this.quadrilatic_bezier_to_cubic([x0,y0],[p1x_,p1y_],[x,y]);
        let p1x = C1[0];
        let p1y = C1[1];
        let p2x = C2[0];
        let p2y = C2[1];
        var bezier = `..controls(${this.fix(p1x*u)}mm,${this.fix(p1y*u)}mm)and(${this.fix(p2x*u)}mm,${this.fix(p2y*u)}mm)..`;
        o.push(`${bezier}(${this.fix(x*u)}mm,${this.fix(y*u)}mm)`);
        x0 = x;
        y0 = y;
      }
      else if (join == 'A') {
        var X1 = x0;
        var Y1 = y0;
        var X2 = x;
        var Y2 = y;
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
        if (Number.isFinite(Cx) && Number.isFinite(Cy)) {        
          var lambda1 = Math.atan2(Y1 - Cy, X1 - Cx);
          var lambda2 = Math.atan2(Y2 - Cy, X2 - Cx);
          lambda2 -= Phi / 180 * Math.PI;
          lambda1 -= Phi / 180 * Math.PI;
          var tao1 = Math.atan2(Math.sin(lambda1) / Ry, Math.cos(lambda1) / Rx);
          var tao2 = Math.atan2(Math.sin(lambda2) / Ry, Math.cos(lambda2) / Rx);
          var ang1 = this.to360(tao1 / Math.PI * 180);
          var ang2 = this.to360(tao2 / Math.PI * 180);
          if (ang2 < ang1) { ang2 += 360; }
          if (sweepflag) {//clockwise
            o.push(`[rotate around={${this.fix(Phi)}:(${this.fix(x0*u)}mm,${this.fix(y0*u)}mm)}] arc [start angle=${this.fix(ang2)},end angle=${this.fix(ang1)},x radius=${this.fix(Rx*u)}mm,y radius=${this.fix(Ry*u)}mm][reset cm]`);
          } else {//counter-clockwise
            o.push(`[rotate around={${this.fix(Phi)}:(${this.fix(x0*u)}mm,${this.fix(y0*u)}mm)}] arc [start angle=${this.fix(ang1)},end angle=${this.fix(ang2)},x radius=${this.fix(Rx*u)}mm,y radius=${this.fix(Ry*u)}mm][reset cm]`);
          }
        }
        x0 = x;
        y0 = y;
      }
      else {
        // terminate the current path segment
        iscycled = 0;
        s = o.join('');
        o = [];
        items.push({iscycled,s,hints});
        continue;
      }
    }
    if(o.length){
      iscycled = 0;
      s = o.join('');
      o = [];
      items.push({iscycled,s,hints});
    }
    return items;
  }
  ///
  ///
  ///
  p_comment(s) {
    s = s.replace(/\\/g,'\\\\');
    return `% <-- ${s} -->`;
  }
  p_fillclipath(_coords,g){
    let clipath = g.clipath || '';
    let names = clipath.split(/\s+/).map(x => x.trim()).filter(x => x.length);
    let ids = [];
    let o = [];
    o.push('\\begin{scope}')
    names.forEach(x => {
      if (this.my_paths.has(x)) {
        var path = this.my_paths.get(x);
        var path = this.move_coords(path);
        let items = this.coords_to_draw(path, true);
        let dd = items.map(item => item.d);
        let d = dd.join(' ');///combine multiple path into a single line       
        if(d){
          o.push(`\\clip ${d};`);
        }
      }
    });
    let u = this.viewport_unit;
    let w = `\\fill[${this.g_to_tikz_fillonly_str(g)}] (0,0) rectangle (${this.fix(this.viewport_width*u)}mm,${this.fix(this.viewport_height*u)}mm);`;
    o.push(w);
    o.push('\\end{scope}')
    return o.join('\n');
  }
  p_fill(coords,_g){
    var d = [];
    var coords = this.move_coords(coords);
    var items = this.coords_to_draw(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = {..._g};
      var g = this.update_g_hints(g,hints);
      if(!iscycled){
        s += `--cycle`;
      }
      if(this.has_shades(g)){
        d.push(`\\shade[${this.g_to_tikz_shadeonly_str(g)}] ${s};`);
      }else{
        d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${s};`);
      }
    }
    return d.join('\n');
  }
  p_draw(coords,_g){
    var d = [];
    //var coords = this.move_coords(coords);
    var items = this.coords_to_draw(coords,true);
    var canvas = `transform canvas={xshift=${this.origin_x*this.viewport_unit}mm,yshift=${this.origin_y*this.viewport_unit}mm,xscale=${this.origin_sx},yscale=${this.origin_sy}}`;
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if(iscycled){
        if(this.has_shades(g)){
          d.push(`\\shade[${canvas},${this.g_to_tikz_shadeonly_str(g)}] ${s};`);  
        }else if(this.has_fills(g)){
          d.push(`\\fill[${canvas},${this.g_to_tikz_fillonly_str(g)}] ${s};`);
        }
      }
      if (this.has_strokes(g)) {
        d.push(`\\draw[${canvas},${this.g_to_tikz_drawonly_str(g)}] ${s};`);
      }
    }
    return d.join('\n');
  }
  p_stroke(coords,_g){
    var d = [];
    var coords = this.move_coords(coords);
    var items = this.coords_to_draw(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if (this.has_strokes(g)) {
        d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${s};`);
      }
    }
    return d.join('\n');
  }
  p_arrow(coords,_g){
    var d = [];
    var coords = this.move_coords(coords);
    var items = this.coords_to_draw(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if (this.has_strokes(g)) {
        d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)},->] ${s};`);
      }
    }
    return d.join('\n');
  }
  p_revarrow(coords,_g){
    var d = [];
    var coords = this.move_coords(coords);
    var items = this.coords_to_draw(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if (this.has_strokes(g)) {
        d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)},<-] ${s};`);
      }
    }
    return d.join('\n');
  }
  p_dblarrow(coords,_g){
    var d = [];
    var coords = this.move_coords(coords);
    var items = this.coords_to_draw(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if (this.has_strokes(g)) {
        d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)},<->] ${s};`);
      }
    }
    return d.join('\n');
  }
  ////////////////////////////////////////////////////////////////////////////
  ///ellipse drawing
  ////////////////////////////////////////////////////////////////////////////
  p_ellipse(cx,cy,rx,ry,g){
    var d = [];
    [cx,cy] = this.move_xy(cx,cy);
    rx = this.scale_dist_x(rx);
    ry = this.scale_dist_y(ry);
    let unit = this.viewport_unit;
    var mypath = `(${this.fix(cx*unit)}mm,${this.fix(cy*unit)}mm) ellipse [x radius=${this.fix(rx*unit)}mm, y radius=${this.fix(ry*unit)}mm]`;
    if(this.has_shades(g)){
      d.push(`\\shade[${this.g_to_tikz_shadeonly_str(g)}] ${mypath};`);
    }else if(this.has_fills(g)){
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
    }
    if(this.has_strokes(g)){
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_circle(cx,cy,r,g){
    var d = [];
    //[cx,cy] = this.move_xy(cx,cy);
    //var r = this.scale_dist_x(r);
    let unit = this.viewport_unit;
    var mypath = `(${this.fix(cx*unit)}mm,${this.fix(cy*unit)}mm) circle [radius=${this.fix(r*unit)}mm]`;
    var canvas = `transform canvas={xshift=${this.origin_x*this.viewport_unit}mm,yshift=${this.origin_y*this.viewport_unit}mm,xscale=${this.origin_sx},yscale=${this.origin_sy}}`;
    if(this.has_shades(g)){
      d.push(`\\shade[${canvas},${this.g_to_tikz_shadeonly_str(g)}] ${mypath};`);
    }else if(this.has_fills(g)){
      d.push(`\\fill[${canvas},${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
    }
    if(this.has_strokes(g)){
      d.push(`\\draw[${canvas},${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_rect(x,y,w,h,rdx,rdy,g){
    var d = [];
    [x,y] = this.move_xy(x,y);
    w = this.scale_dist_x(w);
    h = this.scale_dist_y(h);
    rdx = this.scale_dist_x(rdx);
    rdy = this.scale_dist_y(rdy);
    let unit = this.viewport_unit;
    var mypath = `(${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) rectangle (${this.fix((x+w)*unit)}mm,${this.fix((y+h)*unit)}mm)`;
    if(rdx&&rdy){
      rdx = Math.min(rdx,rdy);
      if(this.has_shades(g)){
        d.push(`\\shade[rounded corners=${rdx*unit}mm,${this.g_to_tikz_shadeonly_str(g)}] ${mypath};`);
      }else if(this.has_fills(g)){
        d.push(`\\fill[rounded corners=${rdx*unit}mm,${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
      }
      if(this.has_strokes(g)){
        d.push(`\\draw[rounded corners=${rdx*unit}mm,${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
      }
    }
    else{    
      if(this.has_shades(g)){
        d.push(`\\fill[${this.g_to_tikz_shadeonly_str(g)}] ${mypath};`);
      }else if(this.has_fills(g)){
        d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
      }
      if(this.has_strokes(g)){
        d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
      }
    }
    return d.join('\n');
  }
  p_line(x1,y1,x2,y2,g){
    var d = [];
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    let unit = this.viewport_unit;
    var mypath = `(${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)--(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm)`;
    var arrowhead = this.g_to_arrowhead_int(g);
    var arrowhead_str = this.int_to_tikz_arrowhead_str(arrowhead);
    if(this.has_strokes(g)){
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}${arrowhead_str}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_polyline(points,g){
    var d = [];
    let unit = this.viewport_unit;
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      [x,y] = this.move_xy(x,y);
      d.push(`(${this.fix(x*unit)}mm,${this.fix(y*unit)}mm)`);
    }
    var text = '';
    //var mypath = `(${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)--(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm)--(${this.fix(x3*unit)}mm,${this.fix(y3*unit)}mm)--cycle`;
    var s = d.join('--');
    if(this.has_strokes(g)){
      text=(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${s};`);
    }
    return text;
  }
  p_polygon(points,g){
    var d = [];
    let unit = this.viewport_unit;
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      [x,y] = this.move_xy(x,y);
      d.push(`(${this.fix(x*unit)}mm,${this.fix(y*unit)}mm)`);
    }
    d.push(`cycle`);
    var s = d.join('--');
    var d = [];
    if(this.has_shades(g)){
      d.push(`\\shade[${this.g_to_tikz_shadeonly_str(g)}] ${s};`);
    }else if(this.has_fills(g)){
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${s};`);
    }
    if(this.has_strokes(g)){
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${s};`);
    }
    return d.join('\n');
  }
  p_sector(cx,cy,r,ri,start,span,g){
    var q = this.to_SECTOR(cx,cy,r,ri,start,span);
    return this.p_draw(q,g);
  }
  p_segment(cx,cy,r,start,span,g){
    var q = this.to_SEGMENT(cx,cy,r,start,span);
    return this.p_draw(q,g);
  }
  ////////////////////////////////////////////////////////////////////////
  ///Bezier curve drawing
  ////////////////////////////////////////////////////////////////////////
  p_qbezier_line(x0,y0, x1,y1, x2,y2, g){
    var d = [];
    [x0,y0] = this.move_xy(x0,y0);
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    let [C0,C1,C2,C3] = this.quadrilatic_bezier_to_cubic([x0,y0],[x1,y1],[x2,y2]);
    let unit = this.viewport_unit;
    var x0 = C0[0];
    var y0 = C0[1];
    var x1 = C1[0];
    var y1 = C1[1];
    var x2 = C2[0];
    var y2 = C2[1];
    var x3 = C3[0];
    var y3 = C3[1];
    var path = `(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm)..controls(${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)and(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm)..(${this.fix(x3*unit)}mm,${this.fix(y3*unit)}mm)`;
    var arrowhead = this.g_to_arrowhead_int(g);
    var arrowhead_str = this.int_to_tikz_arrowhead_str(arrowhead);
    if(this.has_strokes(g)){
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}${arrowhead_str}] ${path};`);
    }
    return d.join('\n');
  }
  p_cbezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g){
    var d = [];
    [x0,y0] = this.move_xy(x0,y0);
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    [x3,y3] = this.move_xy(x3,y3);
    let unit = this.viewport_unit;
    var path = `(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm)..controls(${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)and(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm)..(${this.fix(x3*unit)}mm,${this.fix(y3*unit)}mm)`;
    var arrowhead = this.g_to_arrowhead_int(g);
    var arrowhead_str = this.int_to_tikz_arrowhead_str(arrowhead);
    if(this.has_strokes(g)){
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}${arrowhead_str}] ${path};`);
    }
    return d.join('\n');
  }
  p_rhbar(x,y,g){
    var o = [];
    [x,y] = this.move_xy(x,y);
    let unit = this.viewport_unit;
    var delta_x = this.g_to_barlength_float(g)/2;
    var mypath = `(${x*unit}mm,${y*unit}mm)--(${(x+delta_x)*unit}mm,${y*unit}mm)`;
    if(this.has_strokes(g)){
      o.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return o.join('\n');
  }
  p_lhbar(x,y,g){
    var o = [];
    [x,y] = this.move_xy(x,y);
    let unit = this.viewport_unit;
    var delta_x = this.g_to_barlength_float(g)/2;
    var mypath = `(${x*unit}mm,${y*unit}mm)--(${(x-delta_x)*unit}mm,${y*unit}mm)`;
    if(this.has_strokes(g)){
      o.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return o.join('\n');
  }
  p_tvbar(x,y,g){
    var o = [];
    [x,y] = this.move_xy(x,y);
    let unit = this.viewport_unit;
    var Dy = this.g_to_barlength_float(g)/2;
    var mypath = `(${x * unit}mm,${y * unit}mm)--(${(x) * unit}mm,${(y+Dy) * unit}mm)`;
    if(this.has_strokes(g)){
      o.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return o.join('\n');
  }
  p_bvbar(x,y,g){
    var o = [];
    [x,y] = this.move_xy(x,y);
    let unit = this.viewport_unit;
    var dy = this.g_to_barlength_float(g)/2;
    var mypath = `(${x * unit}mm,${y * unit}mm)--(${(x) * unit}mm,${(y-dy) * unit}mm)`;
    if(this.has_strokes(g)){
      o.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return o.join('\n');
  }
  p_label(x,y,txt,ta,g){
    if(!txt) return '';
    var d = [];
    //[x,y] = this.move_xy(x,y);
    var unit = this.viewport_unit;
    var anchor = this.string_to_tikz_anchor(ta);
    if(anchor){
      d.push(`anchor=${anchor}`);
    }
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    if(fontcolor){
      d.push(`text=${this.string_to_tikz_color(fontcolor,g.hints)}`)
    }
    var fs = `\\fontsize{${fontsize}pt}{${fontsize}pt}\\selectfont`;
    d.push(`font=${fs}`);
    var rotate = this.g_to_rotate_float(g);
    if(rotate){
      d.push(`rotate=${this.fix(rotate)}`);
    }
    var tex_label = this.translator.smooth(txt);
    if(this.has_texts(g)){
      var canvas = `transform canvas={xshift=${this.origin_x*this.viewport_unit}mm,yshift=${this.origin_y*this.viewport_unit}mm,xscale=${this.origin_sx},yscale=${this.origin_sy}}`;
      return `\\draw[${canvas}] (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) node[${d.join(',')}] {${tex_label}};`;
    }
    return '';
  }
  p_math(x,y,txt,ta,g){
    if(!txt) return '';
    var d = [];
    //[x,y] = this.move_xy(x,y);
    var unit = this.viewport_unit;
    var anchor = this.string_to_tikz_anchor(ta);
    if(anchor){
      d.push(`anchor=${anchor}`);
    }
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    if(fontcolor){
      d.push(`text=${this.string_to_tikz_color(fontcolor,g.hints)}`)
    }
    var fs = `\\fontsize{${fontsize}pt}{${fontsize}pt}\\selectfont`;
    d.push(`font=${fs}`);
    var rotate = this.g_to_rotate_float(g);
    if(rotate){
      d.push(`rotate=${this.fix(rotate)}`);
    }
    var tex_label = this.txt_to_label_math_text(txt,g);
    if(this.has_texts(g)){
      var canvas = `transform canvas={xshift=${this.origin_x*this.viewport_unit}mm,yshift=${this.origin_y*this.viewport_unit}mm,xscale=${this.origin_sx},yscale=${this.origin_sy}}`;
      return `\\draw[${canvas}] (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) node[${d.join(',')}] {${tex_label}};`;
    }
    return '';
  }
  p_text(x,y,txt,ta,g){
    /*
    \draw (0.00mm,0.00mm) node[anchor=south west] {\fontsize{12pt}{12pt}\selectfont{}\begin{tabular}{@{}l@{}}hello \\ world\end{tabular}};
    */
    if(!txt) return '';
    //[x,y] = this.move_xy(x,y);
    var unit = this.viewport_unit;
    var d = [];
    var anchor = this.string_to_tikz_anchor(ta);
    if(anchor){
      d.push(`anchor=${anchor}`);
    }
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    if(fontcolor){
      d.push(`text=${this.string_to_tikz_color(fontcolor,g.hints)}`)
    }
    let align = this.string_to_node_align_s(ta);
    d.push(`align=${align}`);
    var fs = `\\fontsize{${fontsize}pt}{${fontsize}pt}\\selectfont`;
    d.push(`font=${fs}`);
    var tex_label = this.txt_to_multiline_text(txt,g);
    if(this.has_texts(g)){
      var canvas = `transform canvas={xshift=${this.origin_x*this.viewport_unit}mm,yshift=${this.origin_y*this.viewport_unit}mm,xscale=${this.origin_sx},yscale=${this.origin_sy}}`;
      return `\\draw[${canvas}] (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) node[${d.join(',')}] {${tex_label}};`;
    }
    return '';
  }
  p_cairo(x,y,txt,extent,g){
    [x,y] = this.move_xy(x,y);
    var unit = this.viewport_unit;
    var txt = this.txt_to_singleline_text(txt,g);
    var tex_label = `\\parbox{${this.fix(extent*unit)}mm}{\\raggedright ${txt}}`;
    var d = [];
    var anchor = this.string_to_tikz_anchor('lrt');
    if(anchor){
      d.push(`anchor=${anchor}`);
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    if(fontcolor){
      d.push(`text=${this.string_to_tikz_color(fontcolor,g.hints)}`)
    }
    var align = this.string_to_node_align_s('lrt');
    d.push(`align=${align}`);
    var fs = this.g_to_tikz_font_attr(g);
    d.push(`font=${fs}`);
    return `\\draw (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) node[${d.join(',')}] {${tex_label}};`;
  }
  p_slopedtext(x1,y1,x2,y2,txt,ta,g){
    /*
    \draw[] (0mm,0mm)--(20mm,20mm)--(40mm,20mm) node [midway, above, sloped] () {Hello World};
    */
    if(!txt) return '';
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    var unit = this.viewport_unit;
    var d = [];
    if(ta=='bot'){
      d.push(`opacity=1, pos=0.5, below, sloped`);
    }else if (ta=='top'){
      d.push(`opacity=1, pos=0.5, above, sloped`);
    }else{
      d.push(`opacity=1, pos=0.5, sloped`);
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    if(fontcolor){
      d.push(`text=${this.string_to_tikz_color(fontcolor,g.hints)}`)
    }
    let fs = this.g_to_tikz_font_attr(g);
    d.push(`font=${fs}`);
    var tex_label = this.txt_to_label_normal_text(txt,g);
    if(this.has_texts(g)){
      return `\\draw[opacity=0] (${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)--(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm) node[${d.join(',')}] () {${tex_label}};`;
    }
    //return `\\node [draw,${d.join(',')}] at (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) {\\fontsize{${fs}pt}{${fs}pt}\\selectfont{}${tex_label}};`;
  }
  p_slopedmath(x1,y1,x2,y2,txt,ta,g){
    /*
    \draw[] (0mm,0mm)--(20mm,20mm)--(40mm,20mm) node [midway, above, sloped] () {Hello World};
    */
    if(!txt) return '';
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    var unit = this.viewport_unit;
    var d = [];
    if(ta=='bot'){
      d.push(`opacity=1, pos=0.5, below, sloped`);
    }else if (ta=='top'){
      d.push(`opacity=1, pos=0.5, above, sloped`);
    }else{
      d.push(`opacity=1, pos=0.5, sloped`);
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    if(fontcolor){
      d.push(`text=${this.string_to_tikz_color(fontcolor,g.hints)}`)
    }
    let fs = this.g_to_tikz_font_attr(g);
    d.push(`font=${fs}`);
    var tex_label = this.txt_to_label_math_text(txt,g);
    if(this.has_texts(g)){
      return `\\draw[opacity=0] (${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)--(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm) node[${d.join(',')}] () {${tex_label}};`;
    }
    //return `\\node [draw,${d.join(',')}] at (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) {\\fontsize{${fs}pt}{${fs}pt}\\selectfont{}${tex_label}};`;
  }
  p_dot_square(x,y,g){
    [x,y] = this.move_xy(x,y);
    ///reject points that are not within the viewport
    if (x < 0 || x > this.viewport_width) {
      return;
    }
    if (y < 0 || y > this.viewport_height) {
      return;
    }
    let unit = this.viewport_unit;
    ///***NOTE that drawdot cannot use shifted or scaled command
    ///   because there is no path before it
    let r2 = this.g_to_dotsize_float(g);
    let r = r2*0.5;
    r2 *= 0.35;///pt to mm
    r *= 0.35;///pt to mm
    if(this.has_dots(g)){
      return `\\fill[${this.g_to_tikz_dotonly_str(g)}] (${this.fix(x*unit-r)}mm,${this.fix(y*unit-r)}mm) rectangle (${this.fix(x*unit+r)}mm,${this.fix(y*unit+r)}mm);`;
    }
    //return (`fill fullcircle scaled(${this.g_to_dotsize_float(g)}) shifted(${x}*u,${y}*u) ${this.to_dotcolors(g)};`);
  }
  p_dot_circle(x,y,g){
    [x,y] = this.move_xy(x,y);
    ///reject points that are not within the viewport
    if (x < 0 || x > this.viewport_width) {
      return;
    }
    if (y < 0 || y > this.viewport_height) {
      return;
    }
    let unit = this.viewport_unit;
    ///***NOTE that drawdot cannot use shifted or scaled command
    ///   because there is no path before it
    if(this.has_dots(g)){
      return `\\fill[${this.g_to_tikz_dotonly_str(g)}] (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) circle [radius=${this.g_to_dotsize_float(g)*0.5}pt];`;
    }
    //return (`fill fullcircle scaled(${this.g_to_dotsize_float(g)}) shifted(${x}*u,${y}*u) ${this.to_dotcolors(g)};`);
  }
  p_dot_pie(cx,cy,start_a,span_a,g){
    [cx,cy] = this.move_xy(cx,cy);
    var r = this.g_to_dotsize_float(g)*0.5;
    // let u = this.viewport_unit;
    // let mypath = `(${this.fix((x + x1) * u)}mm,${this.fix((y + y1) * u)}mm)arc[start angle=${a1},end angle=${a2},radius=${this.fix(r * u)}mm]`
    // var o = [];
    // o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    // return o.join('\n');
    let unit = this.viewport_unit;
    var Phi        = 0;        
    /// we only do this when 'Cx' and 'Cy' is not a NAN, otherwise the data
    /// passed in are non-sensical
    var cx = cx*unit;  // grid unit to mm
    var cy = cy*unit;  // grid unit to mm
    var r = r*0.35;    // pt to mm
    var x0 = cx + r*Math.cos(start_a/180*Math.PI);
    var y0 = cy + r*Math.sin(start_a/180*Math.PI);
    var ang1 = start_a;
    var ang2 = start_a + span_a;
    return(`\\fill[${this.g_to_tikz_dotonly_str(g)}] (${this.fix(cx)}mm,${this.fix(cy)}mm)--(${this.fix(x0)}mm,${this.fix(y0)}mm) [rotate around={${this.fix(Phi)}:(${this.fix(x0)}mm,${this.fix(y0)}mm)}] arc [start angle=${this.fix(ang1)},end angle=${this.fix(ang2)},x radius=${this.fix(r)}mm,y radius=${this.fix(r)}mm][reset cm];`);
  }
  p_image(imagefile,g){
    var o = [];
    var width = this.viewport_width*this.viewport_unit;
    var height = this.viewport_height*this.viewport_unit;
    var fit = this.g_to_fit_string(g);
    if(fit=='contain'){
      o.push(`\\node (image) at (${width/2}mm,${height/2}mm) { \\includegraphics[width=${width}mm,height=${height}mm,keepaspectratio]{${imagefile}} } ;`);
    }else if(fit=='cover'){
      //currently 'cover' is unsupported on LATEX because of lack of capability offered by includegrahics command
      o.push(`\\node (image) at (${width/2}mm,${height/2}mm) { \\includegraphics[width=${width}mm,height=${height}mm,keepaspectratio]{${imagefile}} } ;`);
    }else{
      //default is 'fill'
      o.push(`\\node (image) at (${width/2}mm,${height/2}mm) { \\includegraphics[width=${width}mm,height=${height}mm]{${imagefile}} } ;`);
    }
    return o.join('\n');
  }

  ///
  ///NOTE: build necessary arguments for a TikZ operation
  ///
  g_to_tikz_drawonly_str(g) {
    //NOTE that if linecolor:none then draw=none is set
    var d = [];
    let linedashed = this.g_to_linedashed_int(g);
    if (linedashed) {
      d.push(`dashed`);
    }
    var linesize = this.g_to_linesize_float(g);
    if(linesize){
      d.push(`line width=${linesize}pt`);
    }
    let linecolor = this.g_to_linecolor_string(g);
    if (linecolor) {
      d.push(`color=${this.string_to_tikz_color(linecolor,g.hints)}`);
    }
    var linecap = this.g_to_linecap_string(g);
    if (linecap) {
      d.push(`line cap=${this.string_to_tikz_linecap(linecap)}`)
    } 
    var linejoin = this.g_to_linejoin_string(g);
    if (linejoin) {
      d.push(`line join=${this.string_to_tikz_linejoin(linejoin)}`)
    }
    return d.join(',');
  }
  g_to_tikz_fillonly_str(g) {
    let d = [];
    var fillcolor = this.g_to_fillcolor_string(g);
    var opacity = this.g_to_opacity_float(g);
    if (fillcolor=='none') {
      d.push(`fill opacity=0`)
    }else{
      if(!fillcolor){
        d.push('fill=black');
      }else{
        d.push(`fill=${this.string_to_tikz_color(fillcolor,g.hints)}`);
      }
      if(opacity < 1) {
        d.push(`opacity=${opacity}`);
      }
    }
    if(1){
      d.push(`line width=0pt`)
    }
    return d.join(',');
  }
  g_to_tikz_shadeonly_str(g) {
    let d = [];
    var shade = this.g_to_shade_string(g);
    var ss = this.g_to_tikz_shadecolor_ss(g);
    if(shade=='linear'){
      var angle = this.g_to_angle_float(g);
      if(ss.length==0){
        d.push(`top color=white`);
        d.push(`bottom color=black`);
      }else if(ss.length==1){
        d.push(`top color=${ss[0]}`);
        d.push(`bottom color=black`);
      }else if(ss.length==2){
        d.push(`top color=${ss[0]}`);
        d.push(`bottom color=${ss[1]}`);
      }else {
        d.push(`top color=${ss[0]}`);
        d.push(`bottom color=${ss[2]}`);
        d.push(`middle color=${ss[1]}`);
        ///NOTE that the "middle color" must appear after "bottom color" other TIKZ does not work
      }
      d.push(`shading angle=${angle}`);
      d.push(`shading=axis`)
    }else if(shade=='radial'){
      if(ss.length==0){
        d.push(`inner color=white`);
        d.push(`outer color=black`);        
      }else if(ss.length==1){
        d.push(`inner color=${ss[0]}`);
        d.push(`outer color=black`);
      }else{
        d.push(`inner color=${ss[0]}`);
        d.push(`outer color=${ss[1]}`);
      }
      d.push(`shading=radial`)
    }else if(shade=='ball'){
      if (ss.length) {
        d.push(`ball color=${ss[0]}`);
      }else{
        d.push(`ball color=gray`);
      }
    }
    var s = this.g_to_opacity_float(g);
    if(s < 1) {
      d.push(`opacity=${s}`);
    }
    if(1){
      d.push(`line width=0pt`)
    }
    return d.join(',');
  }
  g_to_tikz_shadecolor_ss(g) {
    let shadecolor = this.g_to_shadecolor_string(g);
    var ss = [];
    if (shadecolor) {
      ss = this.string_to_array(shadecolor)
    }
    ss = ss.map(s => this.string_to_tikz_color(s,g.hints));
    return ss;
  }
  g_to_tikz_dotonly_str(g) {
    var s = this.g_to_dotcolor_string(g);
    if (s) {
      return (`color=${this.string_to_tikz_color(s,g.hints)}`);
    }
    return '';
  }
  g_to_tikz_font_attr(g){
    var fontsize = this.g_to_fontsize_float(g);
    fontsize = this.scale_dist(fontsize);
    var fs = `${Math.round(fontsize)}`;
    var fs = `\\fontsize{${fs}pt}{${fs}pt}\\selectfont`;
    return fs
  }
  ///
  ///
  ///
  string_to_tikz_color(s,hints) {
    if (!s) {
      s = 'black';
    }else if (s === 'currentColor'){
      s = 'black';
    }
    ///update the hint
    if (typeof s === 'string') {
      s = this.string_to_hexcolor(s,hints);
      s = s.slice(1);
      s = this.hexcolor_to_tikzcolor(s);
      return s;
    } 
    else {
      return 'black';
    }
  }
  string_to_tikz_anchor(ta){
    if( ta.localeCompare('lft') == 0   ) return 'east';
    if( ta.localeCompare('rt') == 0    ) return 'west';
    if( ta.localeCompare('top') == 0   ) return 'south';
    if( ta.localeCompare('bot') == 0   ) return 'north';
    if( ta.localeCompare('ulft') == 0  ) return 'south east';
    if( ta.localeCompare('urt') == 0   ) return 'south west';
    if( ta.localeCompare('llft') == 0  ) return 'north east';
    if( ta.localeCompare('lrt') == 0   ) return 'north west';
    if( ta.localeCompare('ctr') == 0   ) return '';
    return 'south west';
  }
  string_to_tabular_align_letter(ta){
    if( ta.localeCompare('lft') == 0   ) return 'r';
    if( ta.localeCompare('rt') == 0    ) return 'l';
    if( ta.localeCompare('top') == 0   ) return 'c';
    if( ta.localeCompare('bot') == 0   ) return 'c';
    if( ta.localeCompare('ulft') == 0  ) return 'r';
    if( ta.localeCompare('urt') == 0   ) return 'l';
    if( ta.localeCompare('llft') == 0  ) return 'r';
    if( ta.localeCompare('lrt') == 0   ) return 'l';
    if( ta.localeCompare('ctr') == 0   ) return 'c';
    return 'l';
  }
  string_to_node_align_s(ta){
    if( ta.localeCompare('lft') == 0   ) return 'right';
    if( ta.localeCompare('rt') == 0    ) return 'left';
    if( ta.localeCompare('top') == 0   ) return 'center';
    if( ta.localeCompare('bot') == 0   ) return 'center';
    if( ta.localeCompare('ulft') == 0  ) return 'right';
    if( ta.localeCompare('urt') == 0   ) return 'left';
    if( ta.localeCompare('llft') == 0  ) return 'right';
    if( ta.localeCompare('lrt') == 0   ) return 'left';
    if( ta.localeCompare('ctr') == 0   ) return 'center';
    return 'left';
  }


  string_to_tikz_linecap(linecap) {
    if (linecap === 'butt') {
      return 'butt';
    } else if (linecap === 'round') {
      return 'round';
    } else if (linecap === 'square') {
      return 'rect';
    }
    return '';
  }
  string_to_tikz_linejoin(linejoin) {
    if (linejoin === 'miter') {
      return 'miter';
    } else if (linejoin === 'round') {
      return 'round';
    } else if (linejoin === 'bevel') {
      return 'bevel';
    }
    return '';
  }
  hexcolor_to_tikzcolor(s) {
    // convert a string such as EFD to {rgb,15:red,3; green,4; blue,5}
    // will truncate to 2 decimal places
    // convert a string such as E0F0D0 to (0.93,1,0.87)
    if (s.length == 6) {
      var r = s.substr(0, 2); r = parseInt(`0x${r}`); 
      var g = s.substr(2, 2); g = parseInt(`0x${g}`); 
      var b = s.substr(4, 2); b = parseInt(`0x${b}`); 
      var base = 255;
    } else if (s.length == 3) {
      var r = s.substr(0, 1); r = parseInt(`0x${r}`); 
      var g = s.substr(1, 1); g = parseInt(`0x${g}`); 
      var b = s.substr(2, 1); b = parseInt(`0x${b}`); 
      var base = 15;
    } else {
      var r = 0;
      var g = 0;
      var b = 0;
      var base = 1;
    }
    return `{rgb,${base}:red,${r};green,${g};blue,${b}}`;
  }
  txt_to_label_math_text(s,g) {
    s = s || '';
    var s = this.translator.literal_to_math(g,s);
    return s;
  }
  txt_to_label_normal_text(s,g) {
    s = s || '';
    var s = this.translator.smooth(s);
    return s;
  }
  txt_to_singleline_text(s,g) {
    s = s || '';
    var fontfamily = this.g_to_latex_fontfamily_switch(g);
    var fontstyle = this.g_to_latex_fontstyle_switch(g);
    let ss = [s];
    ss = ss.map(x => x.trim());
    ss = ss.map(x => this.translator.flatten(g,x)); // remove all \n 
    ss = ss.map((s) => {
      if(fontstyle){
        s = `${fontstyle}{}${s}`
      }
      if(fontfamily){
        s = `${fontfamily}{}${s}`
      }
      return s;
    });
    s = ss.join(' \\\\ ');
    return s;
  }
  txt_to_multiline_text(s,g) {
    s = s || '';
    var fontfamily = this.g_to_latex_fontfamily_switch(g);
    var fontstyle = this.g_to_latex_fontstyle_switch(g);
    let ss = s.trim().split('\\\\');
    ss = ss.map(x => x.trim());
    ss = ss.map(x => this.translator.flatten(g,x)); // remove all \n 
    ss = ss.map((s) => {
      if(fontstyle){
        s = `${fontstyle}{}${s}`
      }
      if(fontfamily){
        s = `${fontfamily}{}${s}`
      }
      return s;
    });
    s = ss.join(' \\\\ ');
    return s;
  }
  int_to_tikz_arrowhead_str(arrowhead){
    if(arrowhead==1){
      var arrowhead_str = ',->';
    }else if(arrowhead==2){
      var arrowhead_str = ',<-';
    }else if(arrowhead==3){
      var arrowhead_str = ',<->';
    }else{
      var arrowhead_str = '';
    }
    return arrowhead_str;
  }

}
module.exports = { NitrilePreviewDiagramTikz };
