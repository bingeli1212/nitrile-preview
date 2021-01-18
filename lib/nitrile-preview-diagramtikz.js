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
    if(this.config.grid=='none'){
      ///we have to draw something so that it occupies the entire viewport, otherwise the viewport is going to clip to whatever the content is
      var p = `\\draw[help lines, color={rgb,15:red,15;green,15;blue,15},ultra thin] (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`;
    }else if(this.config.grid=='boxed'){
      var p = `\\draw[help lines, color={rgb,15:red,13;green,13;blue,13},ultra thin] (0,0) rectangle (${xm*unit}mm,${ym*unit}mm);`;
    }else{
      var p = `\\draw[help lines, step=${unit}mm,color={rgb,15:red,13;green,13;blue,13},ultra thin] (0,0) grid (${xm*unit}mm,${ym*unit}mm);`;
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
      d.push('\\begin{tikzpicture}');
      d.push(s_clip);
      d.push(s);
      d.push('\\end{tikzpicture}')
      var text = d.join('\n');
    }
    return {text};
  }
  do_comment(s) {
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
        path = this.offset_and_scale_coords(path, this.refx, this.refy, this.refsx,this.refsy,0);
        let items = this.coordsToDraw(path, true);
        let dd = items.map(item => item.d);
        let d = dd.join(' ');///combine multiple path into a single line       
        if(d){
          o.push(`\\clip ${d};`);
        }
      }
    });
    let u = this.viewport_unit;
    let w = `\\fill[${this.to_fills(g,1)}] (0,0) rectangle (${this.fix(this.viewport_width*u)}mm,${this.fix(this.viewport_height*u)}mm);`;
    o.push(w);
    o.push('\\end{scope}')
    return o.join('\n');
  }
  p_fill(coords,g){
    var o = [];
    var items = this.coordsToDraw(coords,true);
    for(var item of items) {
      var {iscycled,d} = item;
      d = d.trim();
      if(!d) continue;
      if(iscycled){
        if(g.shade){
          o.push(`\\shade[${this.to_shadeonlys(g,1)}] ${d};`);
        }else{
          o.push(`\\fill[${this.to_fillonlys(g,1)}] ${d};`);
        }
      }else{
        if(g.shade){
          o.push(`\\shade[${this.to_shadeonlys(g,1)}] ${d}--cycle;`);
        }else{
          o.push(`\\fill[${this.to_fillonlys(g,1)}] ${d}--cycle;`);
        }
      }
    }
    return o.join('\n');
  }
  p_draw(coords,g){
    var o = [];
    var items = this.coordsToDraw(coords,true);
    for(var item of items) {
      var {iscycled,d} = item;
      d = d.trim();
      if(!d) continue;
      if(iscycled){
        if(g.shade){
          o.push(`\\shade[${this.to_shadeonlys(g)}] ${d};`);  
        }else{
          o.push(`\\fill[${this.to_fillonlys(g,1)}] ${d};`);
        }
      }
      o.push(`\\draw[${this.to_draws(g)}] ${d};`);
    }
    return o.join('\n');
  }
  p_stroke(coords,g){
    var o = [];
    var items = this.coordsToDraw(coords,true);
    for(var item of items) {
      var {iscycled,d} = item;
      d = d.trim();
      if(!d) continue;
      o.push(`\\draw[${this.to_draws(g)}] ${d};`);
    }
    return o.join('\n');
  }
  p_arrow(coords,g){
    var o = [];
    var items = this.coordsToDraw(coords,true);
    for(var item of items) {
      var {iscycled,d} = item;
      d = d.trim();
      if(!d) continue;
      o.push(`\\draw[${this.to_draws(g)},->] ${d};`);
    }
    return o.join('\n');
  }
  p_revarrow(coords,g){
    var o = [];
    var items = this.coordsToDraw(coords,true);
    for(var item of items) {
      var {iscycled,d} = item;
      d = d.trim();
      if(!d) continue;
      o.push(`\\draw[${this.to_draws(g)},<-] ${d};`);
    }
    return o.join('\n');
  }
  p_dblarrow(coords,g){
    var o = [];
    var items = this.coordsToDraw(coords,true);
    for(var item of items) {
      var {iscycled,d} = item;
      d = d.trim();
      if(!d) continue;
      o.push(`\\draw[${this.to_draws(g)},<->] ${d};`);
    }
    return o.join('\n');
  }
  p_circle(x,y,radius,g){
    let u = this.viewport_unit;
    var o = [];
    if (this.has_fills(g)) {
      o.push(`\\fill[${this.to_fills(g)}] (${x*u}mm,${y*u}mm) circle [radius=${this.fix(radius*u)}mm];`);
    }
    o.push(`\\draw[${this.to_draws(g)}] (${x*u}mm,${y*u}mm) circle [radius=${this.fix(radius*u)}mm];`);
    return o.join('\n');
  }
  p_rect(x,y,w,h,g){
    let u = this.viewport_unit;
    var mypath = `(${this.fix(x*u)}mm,${this.fix(y*u)}mm)--(${this.fix((x+w)*u)}mm,${this.fix(y*u)}mm)--(${this.fix((x+w)*u)}mm,${this.fix((y+h)*u)}mm)--(${this.fix(x*u)}mm,${this.fix((y+h)*u)}mm)--cycle`;
    var o = [];
    if (this.has_fills(g)) {
      o.push(`\\fill[${this.to_fills(g)}] ${mypath};`);
    }
    o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    return o.join('\n');
  }
  p_debug(line){
    this.debug_no += 1;
    let x = 0;
    let y = this.debug_no;
    let ts = 1;///literal text
    let ta = ''
    let g = {};
    return this.p_label(x,y,line,ts,ta,g);
  }
  p_line(x1,y1,x2,y2,g,arrow){
    let u = this.viewport_unit;
    var mypath = `(${this.fix(x1*u)}mm,${this.fix(y1*u)}mm)--(${this.fix(x2*u)}mm,${this.fix(y2*u)}mm)`;
    var o = [];
    if(arrow=='arrow'){
      o.push(`\\draw[${this.to_draws(g)},->] ${mypath};`);
    }else if(arrow=='revarrow'){
      o.push(`\\draw[${this.to_draws(g)},<-] ${mypath};`);
    }else if(arrow=='dblarrow'){
      o.push(`\\draw[${this.to_draws(g)},<->] ${mypath};`);
    }else{
      o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    }
    return o.join('\n');
  }
  p_qbezier_line(x0,y0, x1,y1, x2,y2, g, arrow){
    var o = [];
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
    if(arrow=='arrow'){
      o.push(`\\draw[${this.to_draws(g)},->] ${path};`);
    }else if(arrow=='revarrow'){
      o.push(`\\draw[${this.to_draws(g)},<-] ${path};`);
    }else if(arrow=='dblarrow'){
      o.push(`\\draw[${this.to_draws(g)},<->] ${path};`);
    }else{
      o.push(`\\draw[${this.to_draws(g)}] ${path};`);
    }
    return o.join('\n');
  }
  p_cbezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g, arrow){
    var o = [];
    let unit = this.viewport_unit;
    var path = `(${this.fix(x0*unit)}mm,${this.fix(y0*unit)}mm)..controls(${this.fix(x1*unit)}mm,${this.fix(y1*unit)}mm)and(${this.fix(x2*unit)}mm,${this.fix(y2*unit)}mm)..(${this.fix(x3*unit)}mm,${this.fix(y3*unit)}mm)`;
    if(arrow=='arrow'){
      o.push(`\\draw[${this.to_draws(g)},->] ${path};`);
    }else if(arrow=='revarrow'){
      o.push(`\\draw[${this.to_draws(g)},<-] ${path};`);
    }else if(arrow=='dblarrow'){
      o.push(`\\draw[${this.to_draws(g)},<->] ${path};`);
    }else{
      o.push(`\\draw[${this.to_draws(g)}] ${path};`);
    }    
    return o.join('\n');
  }
  p_rhbar(x,y,g){
    var o = [];
    let u = this.viewport_unit;
    var dx = this.to_barlength_length(g)/2;
    var mypath = `(${x*u}mm,${y*u}mm)--(${(x+dx)*u}mm,${y*u}mm)`;
    o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    return o.join('\n');
  }
  p_lhbar(x,y,g){
    var o = [];
    let u = this.viewport_unit;
    var dx = this.to_barlength_length(g)/2;
    var mypath = `(${x*u}mm,${y*u}mm)--(${(x-dx)*u}mm,${y*u}mm)`;
    o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    return o.join('\n');
  }
  p_tvbar(x,y,g){
    var o = [];
    let u = this.viewport_unit;
    var dy = this.to_barlength_length(g)/2;
    var mypath = `(${x * u}mm,${y * u}mm)--(${(x) * u}mm,${(y+dy) * u}mm)`;
    o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    return o.join('\n');
  }
  p_bvbar(x,y,g){
    var o = [];
    let u = this.viewport_unit;
    var dy = this.to_barlength_length(g)/2;
    var mypath = `(${x * u}mm,${y * u}mm)--(${(x) * u}mm,${(y-dy) * u}mm)`;
    o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    return o.join('\n');
  }
  p_label(x,y,txt,ts,ta,g){
    var unit = this.viewport_unit;
    var d = [];
    var anchor = this.string_to_tikz_anchor(ta);
    if(anchor){
      d.push(`anchor=${anchor}`);
    }
    var fontcolor = this.get_string_prop(g,'fontcolor','');
    if(fontcolor){
      d.push(`text=${this.to_colors(fontcolor)}`)
    }
    let dx = this.assert_float(g.dx,0);
    let dy = this.assert_float(g.dy,0);
    x += dx;
    y += dy;
    let fs = this.to_fontsize_str(g);
    var tex_label = this.to_tex_label(txt, ts, fs);
    return `\\draw (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) node[${d.join(',')}] {\\fontsize{${fs}pt}{${fs}pt}\\selectfont{}${tex_label}};`;
  }
  p_text(x,y,txt,ts,ta,g){
    /*
    \draw (0.00mm,0.00mm) node[anchor=south west] {\fontsize{12pt}{12pt}\selectfont{}\begin{tabular}{@{}l@{}}hello \\ world\end{tabular}};
    */
    var unit = this.viewport_unit;
    var d = [];
    var anchor = this.string_to_tikz_anchor(ta);
    if(anchor){
      d.push(`anchor=${anchor}`);
    }
    var fontcolor = this.get_string_prop(g,'fontcolor','');
    if(fontcolor){
      d.push(`text=${this.to_colors(fontcolor)}`)
    }
    let dx = this.assert_float(g.dx,0);
    let dy = this.assert_float(g.dy,0);
    x += dx;
    y += dy;
    let fs = this.to_fontsize_str(g);
    let align = this.string_to_node_align_s(ta);
    var tex_label = this.to_tex_text(txt,fs);
    return `\\draw (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) node[${d.join(',')},align=${align}] {${tex_label}};`;
    //return `\\node [draw,${d.join(',')}] at (${this.fix(x*unit)}mm,${this.fix(y*unit)}mm) {\\fontsize{${fs}pt}{${fs}pt}\\selectfont{}${tex_label}};`;
  }
  p_pie(x,y,radius,angle1,angle2,g){
    ///pie
    var x1 = radius * Math.cos(angle1 / 180 * Math.PI);
    var y1 = radius * Math.sin(angle1 / 180 * Math.PI);
    var x2 = radius * Math.cos(angle2 / 180 * Math.PI);
    var y2 = radius * Math.sin(angle2 / 180 * Math.PI);
    let u = this.viewport_unit;
    if(angle2 < angle1){
      angle2 += 360;
    }
    let mypath = `(${this.fix(x*u)}mm,${this.fix(y*u)}mm)--(${this.fix((x+x1)*u)}mm,${this.fix((y+y1)*u)}mm)arc[start angle=${angle1},end angle=${angle2},radius=${this.fix(radius*u)}mm]`
    var o = [];
    if (this.has_fills(g)) {
      o.push(`\\fill[${this.to_fills(g)}] ${mypath}--cycle;`);
    }
    o.push(`\\draw[${this.to_draws(g)}] ${mypath}--cycle;`);
    return o.join('\n');
  }
  p_chord(x,y,radius,angle1,angle2,g){
    ///chord
    var x1 = radius * Math.cos(angle1 / 180 * Math.PI);
    var y1 = radius * Math.sin(angle1 / 180 * Math.PI);
    var x2 = radius * Math.cos(angle2 / 180 * Math.PI);
    var y2 = radius * Math.sin(angle2 / 180 * Math.PI);
    let u = this.viewport_unit;
    if (angle2 < angle1) {
      angle2 += 360;
    }
    let mypath = `(${this.fix((x + x1) * u)}mm,${this.fix((y + y1) * u)}mm)--(${this.fix((x + x2) * u)}mm,${this.fix((y + y2) * u)}mm)`
    var o = [];
    o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    return o.join('\n');
  }
  p_cseg(x,y,radius,angle1,angle2,g){
    ///cseg
    var x1 = radius * Math.cos(angle1 / 180 * Math.PI);
    var y1 = radius * Math.sin(angle1 / 180 * Math.PI);
    var x2 = radius * Math.cos(angle2 / 180 * Math.PI);
    var y2 = radius * Math.sin(angle2 / 180 * Math.PI);
    let u = this.viewport_unit;
    if (angle2 < angle1) {
      angle2 += 360;
    }
    let mypath = `(${this.fix((x + x1) * u)}mm,${this.fix((y + y1) * u)}mm)arc[start angle=${angle1},end angle=${angle2},radius=${this.fix(radius * u)}mm]`
    var o = [];
    if (this.has_fills(g)) {
      o.push(`\\fill[${this.to_fills(g)}] ${mypath}--cycle;`);
    }
    o.push(`\\draw[${this.to_draws(g)}] ${mypath}--cycle;`);
    return o.join('\n');
  }
  p_ellipse(x,y,Rx,Ry,angle,g){
    let u = this.viewport_unit;
    var o = [];
    if (this.has_fills(g)) {
      o.push(`\\fill[${this.to_fills(g)}] (${this.fix(x * u)}mm,${this.fix(y * u)}mm) circle [x radius=${this.fix(Rx * u)}mm,y radius=${this.fix(Ry * u)}mm, rotate=${angle}];`);
    }
    o.push(`\\draw[${this.to_draws(g)}] (${this.fix(x * u)}mm,${this.fix(y * u)}mm) circle [x radius=${this.fix(Rx * u)}mm,y radius=${this.fix(Ry * u)}mm, rotate=${angle}];`);
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
    let u = this.viewport_unit;
    ///***NOTE that drawdot cannot use shifted or scaled command
    ///   because there is no path before it
    let r2 = this.to_dotsize_diameter(g);
    let r = r2*0.5;
    r2 *= 0.35;///pt to mm
    r *= 0.35;///pt to mm
    return `\\fill[${this.to_dotcolors(g)}] (${x * u - r}mm,${y * u - r}mm) rectangle (${x*u+r}mm,${y*u+r}mm);`;
    //return (`fill fullcircle scaled(${this.to_dotsize_diameter(g)}) shifted(${x}*u,${y}*u) ${this.to_dotcolors(g)};`);
  }
  p_dot_circle(x,y,g){
    ///reject points that are not within the viewport
    if (x < 0 || x > this.viewport_width) {
      return;
    }
    if (y < 0 || y > this.viewport_height) {
      return;
    }
    let u = this.viewport_unit;
    ///***NOTE that drawdot cannot use shifted or scaled command
    ///   because there is no path before it
    return `\\fill[${this.to_dotcolors(g)}] (${x * u}mm,${y * u}mm) circle [radius=${this.to_dotsize_diameter(g)*0.5}pt];`;
    //return (`fill fullcircle scaled(${this.to_dotsize_diameter(g)}) shifted(${x}*u,${y}*u) ${this.to_dotcolors(g)};`);
  }
  p_arc(x1,y1,x2,y2,Rx,Ry,bigarcflag,g){
    // let u = this.viewport_unit;
    // let mypath = `(${this.fix((x + x1) * u)}mm,${this.fix((y + y1) * u)}mm)arc[start angle=${a1},end angle=${a2},radius=${this.fix(r * u)}mm]`
    // var o = [];
    // o.push(`\\draw[${this.to_draws(g)}] ${mypath};`);
    // return o.join('\n');
    var o = [];
    let u = this.viewport_unit;
    var X1 = x1;
    var Y1 = y1;
    var X2 = x2;
    var Y2 = y2;
    var Phi        = 0;        
    var sweepflag  = 0;
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
      var x0 = X1;
      var y0 = Y1;
      if (sweepflag) {//clockwise
        o.push(`\\draw[${this.to_draws(g)}] (${x0*u}mm,${y0*u}mm) [rotate around={${this.fix(Phi)}:(${this.fix(x0*u)}mm,${this.fix(y0*u)}mm)}] arc [start angle=${ang2},end angle=${ang1},x radius=${this.fix(Rx*u)}mm,y radius=${this.fix(Ry*u)}mm][reset cm];`);
      } else {//counter-clockwise
        o.push(`\\draw[${this.to_draws(g)}] (${x0*u}mm,${y0*u}mm) [rotate around={${this.fix(Phi)}:(${this.fix(x0*u)}mm,${this.fix(y0*u)}mm)}] arc [start angle=${ang1},end angle=${ang2},x radius=${this.fix(Rx*u)}mm,y radius=${this.fix(Ry*u)}mm][reset cm];`);
      }
    }
    return o.join('\n')
  }
  p_shape(x,y,p,g,operation){
    var o = [];
    var sx = this.assert_float(g.sx, 1);
    var sy = this.assert_float(g.sy, 1);
    var theta = this.assert_float(g.theta, 0);
    //let u = this.viewport_unit;
    let q = this.offset_and_scale_coords(p,x,y,sx,sy,theta);
    var items = this.coordsToDraw(q, true);
    for (var item of items) {
      var { iscycled, d } = item;
      d = d.trim();
      if (!d) continue;
      if(operation=='fill'){
        if (iscycled) {
          o.push(`\\fill[${this.to_fillonlys(g,1)}] ${d} [reset cm];`);
        }
      }else if(operation=='stroke'){
        o.push(`\\draw[${this.to_draws(g)}] ${d} [reset cm];`);
      }else{
        /// default to 'draw' operation
        if (iscycled) {
          o.push(`\\fill[${this.to_fillonlys(g,1)}] ${d} [reset cm];`);
        }
        o.push(`\\draw[${this.to_draws(g)}] ${d} [reset cm];`);
      }
    }
    return o.join('\n');
  }
  coordsToDraw(coords,multi=false) {
    ///***NOTE: returns [str,bad_vars]
    ///***NOTE: i.e: (1,2)..(2,3)--cycle
    /// pt[0]: [1,2,'','','']
    /// pt[1]: [2,3,'..','','']
    /// pt[2]: ['cycle','','--','','']
    var o = [];
    var items = [];
    var iscycled = 0;
    var d = '';
    var x0 = 0;//previous point
    var y0 = 0;
    var isnewseg = 0;
    var u = this.viewport_unit;
    for (var i in coords) {
      var pt = coords[i];
      var x = pt[0];/// we will do fix down below
      var y = pt[1];///
      var join = pt[2];
      ///doing some fixes
      join = join || '';
      if (i == 0) {
        o.push(`(${this.fix(x*u)}mm,${this.fix(y*u)}mm)`);
        x0 = x;
        y0 = y;
        continue;
      }
      else if (join == 'cycle') {
        if(o.length){
          o.push(`--cycle`);
        }
        if(multi){
          iscycled = 1;
          d = o.join('');
          o = [];
          items.push({iscycled,d});
          isnewseg = 1;
          continue;
        }else{
          break;
        }
      }
      else if (join == 'nan') {
        if(multi){
          iscycled = 0;
          d = o.join('');
          o = [];
          items.push({iscycled,d});
          isnewseg = 1;
        }
        continue;
      }
      else if (multi && isnewseg == 1) {
        isnewseg = 0;
        o.push(`(${this.fix(x*u)}mm,${this.fix(y*u)}mm)`);
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
        ///NOTE: line
        o.push(`--(${this.fix(x*u)}mm,${this.fix(y*u)}mm)`);
        x0 = x;
        y0 = y;
      }
    }
    if(multi){
      if(o.length){
        iscycled = 0;
        d = o.join('');
        items.push({iscycled,d});
      }
      return items;
    }else{
      return o.join('');
    }
  }
  to_draws(g) {
    var o = [];
    let linedashed = this.to_linedashed_str(g);
    if (linedashed) {
      o.push(`dashed`);
    }
    var d = this.to_linesize_pt(g);
    if(d){
      o.push(`line width=${d}pt`);
    }
    let linecolor = this.to_linecolor_str(g);
    if (linecolor) {
      o.push(`color=${this.to_colors(linecolor)}`);
    }
    var linecap = this.to_linecap_str(g);
    if (linecap) {
      o.push(`line cap=${linecap}`)
    } 
    var linejoin = this.to_linejoin_str(g);
    if (linejoin) {
      o.push(`line join=${linejoin}`)
    }
    return o.join(',');
  }
  to_fills(g,isinherit) {
    let d = [];
    var s = this.to_fillcolor_str(g);
    if (s) {
      d.push(`fill=${s}`);
    } else if (isinherit) {
      d.push('fill=black');
    }
    s = this.to_opacity_str(g);
    if(s) {
      d.push(`opacity=${s}`);
    }
    return d.join(',');
  }
  to_shadeonlys(g) {
    let d = [];
    var shade = this.to_shade_str(g);
    var ss = this.to_shadecolor_arr(g);
    if(shade=='linear'){
      var angle = this.to_angle_str(g);
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
    var s = this.to_opacity_str(g);
    if(s) {
      d.push(`opacity=${s}`);
    }
    if(1){
      d.push(`line width=0pt`)
    }
    return d.join(',');
  }
  to_fillonlys(g,isinherit) {
    let d = [];
    var s = this.to_fillcolor_str(g);
    if (s) {
      d.push(`fill=${s}`);
    } else if (isinherit) {
      d.push('fill=black');
    }
    s = this.to_opacity_str(g);
    if(s) {
      d.push(`opacity=${s}`);
    }
    if(1){
      d.push(`line width=0pt`)
    }
    return d.join(',');
  }
  to_linesize_pt(g){
    if (g.linesize) {
      var d = parseFloat(g.linesize);
      if(Number.isFinite(d)){
        return(`${d}`);
      }
    }
    if(this.config.linesize){
      d = this.config.linesize;
      return(`${d}`);
    }
    return '';
  }  
  to_linecolor_str(g){
    if (g.linecolor) {
      return this.to_colors(g.linecolor);
    }
    if(this.config.linecolor){
      return this.to_colors(this.config.linecolor);
    }
    return '';
  }
  fontsizes() {
    //return this.translator.mpfontsize(this.fontsize);
    return '12';
  }
  to_colors(color,user) {
    if (!color) {
      return 'black';
    } 
    if (color === 'currentColor'){
      return 'black';
    }
    if (color === 'none'){
      return '';
    }
    else if (typeof color === 'string' && color[0] == '#') {
      color = color.slice(1);///getrid of the first #
      return this.webrgb_to_definecolor(color,user);
    }
    else if (typeof color === 'string') {
      return (color);
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
  has_fills(g) {
    var d = this.to_fillcolor_str(g);
    return (d) ? true : false;
  }
  to_fontsize_str(g){
    if(g.fontsize){
      return g.fontsize;
    }
    if(this.config.fontsize){
      return this.config.fontsize;
    }
    return '12';
  }
  to_fillcolor_str(g) {
    if (g.fillcolor) {
      return (`${this.to_colors(g.fillcolor)}`);
    }
    if (this.config.fillcolor) {
      return (`${this.to_colors(this.config.fillcolor)}`);
    }
    return '';
  }
  to_shadecolor_arr(g) {
    if (g.shadecolor) {
      let ss = this.string_to_array(g.shadecolor)
      ss = ss.map(s => this.to_colors(s));
      return ss;
    }
    if (this.config.shadecolor) {
      let ss = this.string_to_array(this.config.shadecolor)
      ss = ss.map(s => this.to_colors(s));
      return ss;
    }
    return [];
  }
  to_linecap_str(g) {
    let linecap = g.linecap;
    if (!linecap) {
      linecap = this.config.linecap;
    }
    if (linecap === 'butt') {
      return 'butt';
    } else if (linecap === 'round') {
      return 'round';
    } else if (linecap === 'square') {
      return 'rect';
    }
    return '';
  }
  to_linejoin_str(g) {
    let linejoin = g.linejoin;
    if(!linejoin){
      linejoin = this.config.linejoin;
    }
    if (linejoin === 'miter') {
      return 'miter';
    } else if (linejoin === 'round') {
      return 'round';
    } else if (linejoin === 'bevel') {
      return 'bevel';
    }
    return '';
  }
  webrgb_to_definecolor(s) {
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
  to_barlength_length(g) {
    if (g.barlength) {
      var d = parseFloat(g.barlength);
      if (Number.isFinite(d)) {
        return (d);
      }
    }
    return parseFloat(this.config.barlength);
  }
  to_tex_label(txt, ts, fontsize) {
    txt = txt || '';
    var fs = `${fontsize}pt`;
    if (ts == 2) {
      // math text
      let style = {};
      var s = this.translator.phrase_to_inlinemath(txt,style);
    } else if (ts == 1) {
      // literal text 
      var s = this.translator.polish(txt);
    } else {
      // normal text with symbols
      var s = this.translator.smooth(txt);
    }
    return `${s}`;
  }
  to_tex_text(txt,fs) {
    txt = txt || '';
    let ss = txt.trim().split('\\\\');
    ss = ss.map(x => x.trim());
    ss = ss.map(x => this.translator.flatten(x)); // remove all \n 
    ss = ss.map(x => this.translator.smooth(x)); // normal text with symbols
    ss = ss.map(x => `\\fontsize{${fs}pt}{${fs}pt}\\selectfont{}${x}`)
    let text = ss.join(' \\\\ ');
    return text;
  }
  to_dotsize_diameter(g) {
    if (g.dotsize) {
      var d = parseFloat(g.dotsize);
      if(Number.isFinite(d)){
        return (d);
      }
    } 
    return parseFloat(this.config.dotsize);
  }
  to_dotcolors(g) {
    if (g.dotcolor) {
      return (`color=${this.to_colors(g.dotcolor)}`);
    }
    return '';
  }

}
module.exports = { NitrilePreviewDiagramTikz };
