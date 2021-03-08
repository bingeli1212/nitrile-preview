'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { arcpath } = require('./nitrile-preview-arcpath');

class NitrilePreviewDiagramTikz extends NitrilePreviewDiagram {

  constructor(translator) {
    super(translator);
    this.iscontext = 0;
  }
  do_setup() {
  }
  do_finalize(s,style) {
    var o = [];
    var xm = this.viewport_width;
    var ym = this.viewport_height;
    var unit = this.viewport_unit;
    var s_box = `\\draw (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`
    var s_clip = `\\clip (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`
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
    if(this.config.nogrid==1){
      ///we have to draw something so that it occupies the entire viewport, otherwise the viewport is going to clip to whatever the content is
      var p = `\\draw[help lines, color={rgb,15:red,15;green,15;blue,15},ultra thin] (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`;
    }else{
      var p = `\\draw[help lines, step=${unit}mm,color={rgb,255:red,235;green,235;blue,235},ultra thin] (0,0) grid (${xm*unit}mm,${ym*unit}mm);`;
    }
    p = p.trim();
    o.push(p);
    o.push(s);
    var s = o.join('\n');
    if(0){
      ///for context
      let d = [];
      d.push('\\starttikzpicture')
      d.push(s);
      d.push('\\stoptikzpicture')
      var text = d.join('\n');
      if(style && style.width){
        let w = style.width;
        w = this.translator.str_to_context_length(w);
        text = `\\definehbox[tikz][${w}]\n\\hboxtikz{${text}}`;
      }else{
        text = `\\hbox{${text}}`;
      }
    }else{
      let d = [];
      d.push(`\\begin{tikzpicture}[baseline=${ym*unit*0.5}mm]`);
      d.push(s_clip);
      d.push(s);
      d.push('\\end{tikzpicture}')
      var text = d.join('\n');
    }
    return {text};
  }
  coords_to_draw(coords) {
    ///***NOTE: returns a list of items, where each item is three members: {iscycled,s,hints}
    ///***NOTE: i.e: (1,2)..(2,3)--cycle
    /// pt[0]: [1,2,'','','']
    /// pt[1]: [2,3,'..','','']
    /// pt[2]: ['cycle','','--','','']
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
      if (o.length == 0 || join == 'M') {
        if(o.length){
          // terminate the current path segment
          iscycled = 0;
          s = o.join('');
          if(o.length>1){
            ///only export if there are at least two points
            items.push({iscycled,s,hints});
          }
          o = [];
        }
        o.push(`(${this.fix(x*u)}mm,${this.fix(y*u)}mm)`);
        x0 = x;
        y0 = y;
        hints = pt[12]||0;
        continue;
      }
      else if (join == 'cycle') {
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
        Rx = Math.max(Rx,this.MIN);
        Ry = Math.max(Ry,this.MIN);
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
            o.push(`[rotate around={${this.fix(Phi)}:(${this.fix(x0*u)}mm,${this.fix(y0*u)}mm)}] arc [start angle=${ang2},end angle=${ang1},x radius=${this.fix(Rx*u)}mm,y radius=${this.fix(Ry*u)}mm][reset cm]`);
          } else {//counter-clockwise
            o.push(`[rotate around={${this.fix(Phi)}:(${this.fix(x0*u)}mm,${this.fix(y0*u)}mm)}] arc [start angle=${ang1},end angle=${ang2},x radius=${this.fix(Rx*u)}mm,y radius=${this.fix(Ry*u)}mm][reset cm]`);
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
  p_comment(s) {
    s = s.replace(/\-\-/g,'');
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
        let path = this.my_paths.get(x);
        path = this.dup_coords(path);
        this.move_coords(path, this.refx, this.refy, this.refsx,this.refsy,0);
        let items = this.coords_to_draw(path, true);
        let dd = items.map(item => item.d);
        let d = dd.join(' ');///combine multiple path into a single line       
        if(d){
          o.push(`\\clip ${d};`);
        }
      }
    });
    let u = this.viewport_unit;
    let w = `\\fill[${this.g_to_tikz_fillonly_str(g,1)}] (0,0) rectangle (${this.fix(this.viewport_width*u)}mm,${this.fix(this.viewport_height*u)}mm);`;
    o.push(w);
    o.push('\\end{scope}')
    return o.join('\n');
  }
  p_fill(coords,_g){
    var d = [];
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
        d.push(`\\shade[${this.g_to_tikz_shadeonly_str(g,1)}] ${s};`);
      }else if(this.has_fills(g)){
        d.push(`\\fill[${this.g_to_tikz_fillonly_str(g,1)}] ${s};`);
      }
    }
    return d.join('\n');
  }
  p_draw(coords,_g){
    var d = [];
    var items = this.coords_to_draw(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if(iscycled){
        if(this.has_shades(g)){
          d.push(`\\shade[${this.g_to_tikz_shadeonly_str(g)}] ${s};`);  
        }else if(this.has_fills(g)){
          d.push(`\\fill[${this.g_to_tikz_fillonly_str(g,1)}] ${s};`);
        }
      }
      if (this.has_strokes(g)) {
        d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${s};`);
      }
    }
    return d.join('\n');
  }
  p_stroke(coords,_g){
    var d = [];
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
  p_circle(x,y,radius,g){
    var d = [];
    let unit = this.viewport_unit;
    if (this.has_fills(g)) {
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] (${x*unit}mm,${y*unit}mm) circle [radius=${this.fix(radius*unit)}mm];`);
    }
    if (this.has_strokes(g)) {
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] (${x*unit}mm,${y*unit}mm) circle [radius=${this.fix(radius*unit)}mm];`);
    }
    return d.join('\n');
  }
  p_rect(x,y,w,h,g){
    var d = [];
    let unit = this.viewport_unit;
    var mypath = `(${this.fix(x*unit)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+w)*unit)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+w)*unit)}mm,${this.fix((y+h)*unit)}mm)--(${this.fix(x*unit)}mm,${this.fix((y+h)*unit)}mm)--cycle`;
    if (this.has_fills(g)) {
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
    }
    if (this.has_strokes(g)) {
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_rrect(x,y,w,h,Dx,Dy,g){
    var d = [];
    let unit = this.viewport_unit;
    let Rx = 0.333*Dx;
    let Ry = 0.333*Dy;
    var mypath = `(${this.fix(x*unit)}mm,${this.fix((y+Dy)*unit)}mm)\
                 ..controls(${this.fix(x*unit)}mm,${this.fix((y+Ry)*unit)}mm)and(${this.fix((x+Rx)*unit)}mm,${this.fix(y*unit)}mm)..(${this.fix((x+Dx)*unit)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+w-Dx)*unit)}mm,${this.fix(y*unit)}mm)\
                 ..controls(${this.fix((x+w-Rx)*unit)}mm,${this.fix(y*unit)}mm)and(${this.fix((x+w)*unit)}mm,${this.fix((y+Ry)*unit)}mm)..(${this.fix((x+w)*unit)}mm,${this.fix((y+Dy)*unit)}mm)--(${this.fix((x+w)*unit)}mm,${this.fix((y+h-Dy)*unit)}mm)\
                 ..controls(${this.fix((x+w)*unit)}mm,${this.fix((y+h-Ry)*unit)}mm)and(${this.fix((x+w-Rx)*unit)}mm,${this.fix((y+h)*unit)}mm)..(${this.fix((x+w-Dx)*unit)}mm,${this.fix((y+h)*unit)}mm)--(${this.fix((x+Dx)*unit)}mm,${this.fix((y+h)*unit)}mm)\
                 ..controls(${this.fix((x+Rx)*unit)}mm,${this.fix((y+h)*unit)}mm)and(${this.fix(x*unit)}mm,${this.fix((y+h-Ry)*unit)}mm)..(${this.fix((x)*unit)}mm,${this.fix((y+h-Dy)*unit)}mm)--cycle`;
    if (this.has_fills(g)) {
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
    }
    if (this.has_strokes(g)) {
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_hexgon(x,y,w,h,g){
    var d = [];
    let unit = this.viewport_unit;
    let gap = h*0.25*unit;
    var mypath = `(${this.fix(x*unit+gap)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+w)*unit-gap)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+w)*unit)}mm,${this.fix((y+0.5*h)*unit)}mm)--(${this.fix((x+w)*unit-gap)}mm,${this.fix((y+h)*unit)}mm)--(${this.fix(x*unit+gap)}mm,${this.fix((y+h)*unit)}mm)--(${this.fix(x*unit)}mm,${this.fix((y+0.5*h)*unit)}mm)--cycle`;
    if (this.has_fills(g)) {
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
    }
    if (this.has_strokes(g)) {
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_triangle(x,y,w,h,g){
    var d = [];
    let unit = this.viewport_unit;
    var mypath = `(${this.fix(x*unit)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+w)*unit)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+0.5*w)*unit)}mm,${this.fix((y+h)*unit)}mm)--cycle`;
    if (this.has_fills(g)) {
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
    }
    if (this.has_strokes(g)) {
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_parallelogram(x,y,w,h,g){
    var d = [];
    let unit = this.viewport_unit;
    let shear = this.g_to_shear_float(g);
    let SX = shear*h;
    var mypath = `(${this.fix(x*unit)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+w-SX)*unit)}mm,${this.fix(y*unit)}mm)--(${this.fix((x+w)*unit)}mm,${this.fix((y+h)*unit)}mm)--(${this.fix((x+SX)*unit)}mm,${this.fix((y+h)*unit)}mm)--cycle`;
    if (this.has_fills(g)) {
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
    }
    if (this.has_strokes(g)) {
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_rhombus(x,y,w,h,g){
    var d = [];
    let unit = this.viewport_unit;
    let X1 = x+w*0.5;
    let X2 = x+w;
    let Y1 = y+h*0.5;
    let Y2 = y+h;
    var mypath = `(${this.fix(x*unit)}mm,${this.fix(Y1*unit)}mm)--(${this.fix(X1*unit)}mm,${this.fix(y*unit)}mm)--(${this.fix(X2*unit)}mm,${this.fix(Y1*unit)}mm)--(${this.fix(X1*unit)}mm,${this.fix(Y2*unit)}mm)--cycle`;
    if (this.has_fills(g)) {
      d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] ${mypath};`);
    }
    if (this.has_strokes(g)) {
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_line(x1,y1,x2,y2,g){
    var d = [];
    let unit = this.viewport_unit;
    var mypath = `(${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)--(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm)`;
    var arrowhead = this.g_to_arrowhead_int(g);
    var arrowhead_str = this.int_to_tikz_arrowhead_str(arrowhead);
    if(this.has_strokes(g)){
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}${arrowhead_str}] ${mypath};`);
    }
    return d.join('\n');
  }
  p_qbezier_line(x0,y0, x1,y1, x2,y2, g){
    var d = [];
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
    let unit = this.viewport_unit;
    var path = `(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm)..controls(${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)and(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm)..(${this.fix(x3*unit)}mm,${this.fix(y3*unit)}mm)`;
    var arrowhead = this.g_to_arrowhead_int(g);
    var arrowhead_str = this.int_to_tikz_arrowhead_str(arrowhead);
    if(this.has_strokes(g)){
      d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}${arrowhead_str}] ${path};`);
    }
    return d.join('\n');
  }
  p_arc(cx,cy,r,start_a,span_a,g){
    // let u = this.viewport_unit;
    // let mypath = `(${this.fix((x + x1) * u)}mm,${this.fix((y + y1) * u)}mm)arc[start angle=${a1},end angle=${a2},radius=${this.fix(r * u)}mm]`
    // var o = [];
    // o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    // return o.join('\n');
    var d = [];
    let unit = this.viewport_unit;
    var X1 = cx + r*Math.cos(start_a/180*Math.PI);
    var Y1 = cy + r*Math.sin(start_a/180*Math.PI);
    var X2 = cx + r*Math.cos((start_a+span_a)/180*Math.PI);
    var Y2 = cy + r*Math.sin((start_a+span_a)/180*Math.PI);
    var Phi        = 0;        
    var bigarcflag = 0;
    var da = span_a/4;
    var all_a = [start_a,          
                 start_a+da,       
                 start_a+da+da,    
                 start_a+da+da+da, 
                 start_a+da+da+da+da];
    Rx = Math.max(r,this.MIN);
    Ry = Math.max(r,this.MIN);
    if(span_a > 180){
      bigarcflag = 1;
    }
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
      var x0 = X1;
      var y0 = Y1;
      var ang1 = start_a;
      var ang2 = start_a + span_a;
      var arrowhead = this.g_to_arrowhead_int(g);
      var arrowhead_str = this.int_to_tikz_arrowhead_str(arrowhead);
      if(this.has_strokes(g)){
        //counter-clockwise
        d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}${arrowhead_str}] (${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm) [rotate around={${this.fix(Phi)}:(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm)}] arc [start angle=${ang1},end angle=${ang2},x radius=${this.fix(Rx*unit)}mm,y radius=${this.fix(Ry*unit)}mm][reset cm];`);
      }
    }
    return d.join('\n')
  }
  p_pie(cx,cy,r,start_a,span_a,g){
    // let u = this.viewport_unit;
    // let mypath = `(${this.fix((x + x1) * u)}mm,${this.fix((y + y1) * u)}mm)arc[start angle=${a1},end angle=${a2},radius=${this.fix(r * u)}mm]`
    // var o = [];
    // o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    // return o.join('\n');
    var d = [];
    let unit = this.viewport_unit;
    var X1 = cx + r*Math.cos(start_a/180*Math.PI);
    var Y1 = cy + r*Math.sin(start_a/180*Math.PI);
    var X2 = cx + r*Math.cos((start_a+span_a)/180*Math.PI);
    var Y2 = cy + r*Math.sin((start_a+span_a)/180*Math.PI);
    var Phi        = 0;        
    var sweepflag  = 0;//anti-clockwise
    var bigarcflag = 0;
    var da = span_a/4;
    var all_a = [start_a,          
                 start_a+da,       
                 start_a+da+da,    
                 start_a+da+da+da, 
                 start_a+da+da+da+da];
    Rx = Math.max(r,this.MIN);
    Ry = Math.max(r,this.MIN);
    if(span_a > 180){
      bigarcflag = 1;
    }
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
      var x0 = X1;
      var y0 = Y1;
      var ang1 = start_a;
      var ang2 = start_a + span_a;
      var arrowhead = this.g_to_arrowhead_int(g);
      var arrowhead_str = this.int_to_tikz_arrowhead_str(arrowhead);
      if(this.has_fills(g)){
        d.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}${arrowhead_str}] (${this.fix(cx*unit)}mm,${this.fix(cy*unit)}mm)--(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm) [rotate around={${this.fix(Phi)}:(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm)}] arc [start angle=${ang1},end angle=${ang2},x radius=${this.fix(Rx*unit)}mm,y radius=${this.fix(Ry*unit)}mm][reset cm];`);
      }
      if(this.has_strokes(g)){
        d.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}${arrowhead_str}] (${this.fix(cx*unit)}mm,${this.fix(cy*unit)}mm)--(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm) [rotate around={${this.fix(Phi)}:(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm)}] arc [start angle=${ang1},end angle=${ang2},x radius=${this.fix(Rx*unit)}mm,y radius=${this.fix(Ry*unit)}mm][reset cm];`);
      }
    }
    return d.join('\n')
  }
  p_rhbar(x,y,g){
    var o = [];
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
    let unit = this.viewport_unit;
    var dy = this.g_to_barlength_float(g)/2;
    var mypath = `(${x * unit}mm,${y * unit}mm)--(${(x) * unit}mm,${(y+dy) * unit}mm)`;
    if(this.has_strokes(g)){
      o.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] ${mypath};`);
    }
    return o.join('\n');
  }
  p_bvbar(x,y,g){
    var o = [];
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
    var unit = this.viewport_unit;
    var anchor = this.string_to_tikz_anchor(ta);
    if(anchor){
      d.push(`anchor=${anchor}`);
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    if(fontcolor){
      d.push(`text=${this.string_to_tikz_color(fontcolor,g.hints)}`)
    }
    let fs = this.g_to_tikz_font_attr(g);
    d.push(`font=${fs}`);
    let math = this.g_to_math_int(g);
    if(math){
      var tex_label = this.txt_to_label_math_text(txt,g);
    }else{
      var tex_label = this.txt_to_label_normal_text(txt,g);
    }
    if(this.has_texts(g)){
      return `\\draw (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) node[${d.join(',')}] {${tex_label}};`;
    }
  }
  p_text(x,y,txt,ta,g){
    /*
    \draw (0.00mm,0.00mm) node[anchor=south west] {\fontsize{12pt}{12pt}\selectfont{}\begin{tabular}{@{}l@{}}hello \\ world\end{tabular}};
    */
    if(!txt) return '';
    var unit = this.viewport_unit;
    var d = [];
    var anchor = this.string_to_tikz_anchor(ta);
    if(anchor){
      d.push(`anchor=${anchor}`);
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    if(fontcolor){
      d.push(`text=${this.string_to_tikz_color(fontcolor,g.hints)}`)
    }
    let align = this.string_to_node_align_s(ta);
    d.push(`align=${align}`);
    let fs = this.g_to_tikz_font_attr(g);
    d.push(`font=${fs}`);
    var tex_label = this.txt_to_multiline_text(txt,g);
    if(this.has_texts(g)){
      return `\\draw (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) node[${d.join(',')}] {${tex_label}};`;
    }
    //return `\\node [draw,${d.join(',')}] at (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) {\\fontsize{${fs}pt}{${fs}pt}\\selectfont{}${tex_label}};`;
  }
  p_slopedtext(x1,y1,x2,y2,txt,ta,g){
    /*
    \draw[] (0mm,0mm)--(20mm,20mm)--(40mm,20mm) node [midway, above, sloped] () {Hello World};
    */
    if(!txt) return '';
    var unit = this.viewport_unit;
    var d = [];
    if(ta=='bot'){
      d.push(`opacity=1, pos=0.5, below, sloped`);
    }else{
      d.push(`opacity=1, pos=0.5, above, sloped`);
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
  p_ellipse(x,y,Rx,Ry,angle,g){
    let unit = this.viewport_unit;
    var o = [];
    if (this.has_fills(g)) {
      o.push(`\\fill[${this.g_to_tikz_fillonly_str(g)}] (${this.fix(x * unit)}mm,${this.fix(y * unit)}mm) circle [x radius=${this.fix(Rx * unit)}mm,y radius=${this.fix(Ry * unit)}mm, rotate=${angle}];`);
    }
    if (this.has_strokes(g)) {
      o.push(`\\draw[${this.g_to_tikz_drawonly_str(g)}] (${this.fix(x * unit)}mm,${this.fix(y * unit)}mm) circle [x radius=${this.fix(Rx * unit)}mm,y radius=${this.fix(Ry * unit)}mm, rotate=${angle}];`);
    }
    return o.join('\n');
  }
  p_dot_square(x,y,g){
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
    return(`\\fill[${this.g_to_tikz_dotonly_str(g)}] (${this.fix(cx)}mm,${this.fix(cy)}mm)--(${this.fix(x0)}mm,${this.fix(y0)}mm) [rotate around={${this.fix(Phi)}:(${this.fix(x0)}mm,${this.fix(y0)}mm)}] arc [start angle=${ang1},end angle=${ang2},x radius=${this.fix(r)}mm,y radius=${this.fix(r)}mm][reset cm];`);
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
  g_to_tikz_fillonly_str(g,isinherit) {
    let d = [];
    var fillcolor = this.g_to_fillcolor_string(g);
    var opacity = this.g_to_opacity_float(g);
    if (fillcolor) {
      d.push(`fill=${this.string_to_tikz_color(fillcolor,g.hints)}`);
    } else if (isinherit) {
      d.push('fill=black');
    }
    if(opacity < 1) {
      d.push(`opacity=${opacity}`);
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
    var factor = this.g_to_diagram_fontsize_factor(g);
    var fs = `${Math.round(factor*this.fontsize)}`;
    var fs = `\\fontsize{${fs}pt}{${fs}pt}\\selectfont`;
    return fs
  }
  ///
  ///
  ///
  string_to_tikz_color(s,hints) {
    if (!s) {
      return 'black';
    } 
    if (s === 'currentColor'){
      return 'black';
    }
    if (s === 'none'){
      return '';
    }
    else if (typeof s === 'string') {
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
    var s = this.translator.phrase_to_inlinemath(s,g);
    return s;
  }
  txt_to_label_normal_text(s,g) {
    s = s || '';
    var s = this.translator.smooth(s);
    var fontfamily = this.g_to_latex_fontfamily_switch(g);
    var fontstyle = this.g_to_latex_fontstyle_switch(g);
    if(fontstyle){
      s = `${fontstyle}{}${s}`
    }
    if(fontfamily){
      s = `${fontfamily}{}${s}`
    }
    return s;
  }
  txt_to_multiline_text(s,g) {
    s = s || '';
    var fontfamily = this.g_to_latex_fontfamily_switch(g);
    var fontstyle = this.g_to_latex_fontstyle_switch(g);
    let ss = s.trim().split('\\\\');
    ss = ss.map(x => x.trim());
    ss = ss.map(x => this.translator.flatten(x)); // remove all \n 
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
