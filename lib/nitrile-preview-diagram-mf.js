'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { arcpath } = require('./nitrile-preview-arcpath');

class NitrilePreviewDiagramMF extends NitrilePreviewDiagram {

  constructor(translator) {
    super(translator);
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
    var stretch = this.assert_float(style.stretch,0,0,1);
    ///MF-specific SETUPs
    ///EXECUTE BODY
    var env = this.env;
    this.exec_body(style,ss,env);
    ///COLLECT OUTPUT
    var d = [];
    var d = this.commands.map(x => x.trim());
    var d = d.filter(s => (s && s.trim().length));
    var s = d.join('\n');
    ///ASSEMBLE OUTPUT
    var all = [];
    var xm = this.viewport_width;
    var ym = this.viewport_height;
    var unit = this.viewport_unit;
    var grid = this.viewport_grid;
    all.push('\\startMPcode');
    all.push(`numeric u; u := ${unit}mm;`);
    all.push(`numeric vw; vw := ${xm}*u;`);
    all.push(`numeric vh; vh := ${ym}*u;`);
    all.push(`draw unitsquare sized(vw,vh) withcolor white ;`);
    if (this.background=='grid'){ 
      // withcolor transparent(1,0,black)
      let backgroundalpha = this.g_to_backgroundalpha_float(this.env);
      all.push(`for i=0 step ${grid} until ${ym}: draw (0,i*u) --- (${xm}*u,i*u) withpen pencircle scaled (0.5) withcolor transparent(1,${backgroundalpha},black); endfor;`);
      all.push(`for i=0 step ${grid} until ${xm}: draw (i*u,0) --- (i*u,${ym}*u) withpen pencircle scaled (0.5) withcolor transparent(1,${backgroundalpha},black); endfor;`);
    } 
    var imgsrc = '';
    if(this.my_images.length){
      var imgsrc = this.translator.choose_image_file(this.my_images);
      all.push(`draw image ( picture p; p := externalfigure "${imgsrc}"; p := p sized(${xm}*u,${ym}*u); draw p shifted(0*u,0*u); ) xscaled(1) yscaled(1) shifted(0*u,0*u) ;`);  
      all.push(s);
    }else{
      all.push(s);
    }
    all.push(`% <-- all done -->`);
    all.push(`clip currentpicture to unitsquare sized(vw,vh) ;`);
    let width = this.width;
    let height = this.height;
    // all.push(`currentpicture := currentpicture xsized (\\the\\textwidth) ;`)
    if (stretch > 0) {
      all.push(`currentpicture := currentpicture xsized (${stretch}*TextWidth)  ;`) //'TextWidth' is a keyword in MF
    } else if (width && height){
      all.push(`currentpicture := currentpicture xsized (${width}mm) ysized (${height}mm) ;`)
    } else if (width) {
      all.push(`currentpicture := currentpicture xsized (${width}mm) ;`)
    } else if (height) {
      all.push(`currentpicture := currentpicture ysized (${height}mm) ;`)
    }
    //if(frame){
     // all.push(`path bb ; bboxmargin := 0pt ; bb := bbox currentpicture ;`);
      //all.push(`draw bb withpen pencircle scaled 0.5pt withcolor black ;`);
    //}
    all.push('\\stopMPcode');
    var img = all.join('\n');
    if(style.frame){
      img = `\\framed[frame=on,location=bottom,strut=no]{${img}}`
    }else{
      img = `\\framed[frame=off,location=bottom,strut=no]{${img}}`
    }
    var output = { img, imgsrc, style };
    return(output);
  }
  localcoords(coords) {
    var s = [];
    for( let [x,y,join,x1,y1,x2,y2,Rx,Ry,angle,bigarcflag,sweepflag] of coords ) {
      if (join=='z'||join=='nan') {
        s.push([x,y,join,x1,y1,x2,y2,Rx,Ry,angle,bigarcflag,sweepflag]);
      } else {
        x = this.localx(x);
        y = this.localy(y);
        x1 = this.localx(x1);
        y1 = this.localy(y1);
        x2 = this.localx(x2);
        y2 = this.localy(y2);
        s.push([x,y,join,x1,y1,x2,y2,Rx,Ry,angle,bigarcflag,sweepflag]);
      }
    }
    return s;
  }
  scalecoords(coords,scalarx,scalary) {
    var s = [];
    for( let [x,y,join,x1,y1,x2,y2] of coords ) {
      if (join=='z'||join=='nan') {
        s.push([x,y,join,x1,y1,x2,y2]);
      } else {
        x *= scalarx;
        y *= scalary;
        x1 *= scalarx;
        y1 *= scalary;
        x2 *= scalarx;
        y2 *= scalary;
        s.push([x,y,join,x1,y1,x2,y2]);
      }
    }
    return s;
  }

  rotatecoords(coords,ang_deg) {
    var s = [];
    var costheta = Math.cos(ang_deg/180*Math.PI);
    var sintheta = Math.sin(ang_deg/180*Math.PI);
    for( let [x,y,join,x1,y1,x2,y2] of coords ) {
      if (join=='z'||join=='nan') {
        s.push([x,y,join,x1,y1,x2,y2]);
      } else {
        var _x   =   x*costheta -   y*sintheta;
        var _y   =   x*sintheta +   y*costheta;
        var _x1  =  x1*costheta -  y1*sintheta;
        var _y1  =  x1*sintheta +  y1*costheta;
        var _x2  =  x2*costheta -  y2*sintheta;
        var _y2  =  x2*sintheta +  y2*costheta;
        s.push([_x,_y,join,_x1,_y1,_x2,_y2]);
      }
    }
    return s;
  }

  coords_to_mp(coords) {
    ///***NOTE: returns [str,bad_vars]
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
    for (var i in coords) {
      var pt = coords[i];
      var x = pt[0];/// we will do fix down below
      var y = pt[1];///
      var join = pt[2]||'';
      ///doing some fixes
      join = join || '';
      if (join== 'M') {
        if(o.length){
          iscycled = 0;
          s = o.join('');
          items.push({iscycled,s,hints})
          o = [];
        }
        o.push(`(${this.fix(x)},${this.fix(y)})`);
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
      else if (join == 'L') {
        ///NOTE: line
        if(o.length){
          o.push(`--(${this.fix(x)},${this.fix(y)})`);
          x0 = x;
          y0 = y;        
        }
        continue;
      }
      else if (join == 'C') {
        if(o.length){
          let p1x = pt[3];/// CUBIC BEZIER curve controlpoint 1x
          let p1y = pt[4];/// CUBIC BEZIER curve controlpoint 1y
          let p2x = pt[5];/// CUBIC BEZIER curve controlpoint 2x
          let p2y = pt[6];/// CUBIC BEZIER curve controlpoint 2y
          var bezier = `..controls(${this.fix(p1x)},${this.fix(p1y)})and(${this.fix(p2x)},${this.fix(p2y)})..`;
          o.push(`${bezier}(${this.fix(x)},${this.fix(y)})`);
          x0 = x;
          y0 = y;
        }
      }
      else if (join == 'Q') {
        if(o.length){
          let p1x_ = pt[3];/// QUADRILATIC BEZIER curve controlpoint 1x
          let p1y_ = pt[4];/// QUADRILATIC BEZIER curve controlpoint 1y
          let [C0,C1,C2,C3] = this.quadrilatic_bezier_to_cubic([x0,y0],[p1x_,p1y_],[x,y]);
          let p1x = C1[0];
          let p1y = C1[1];
          let p2x = C2[0];
          let p2y = C2[1];
          var bezier = `..controls(${this.fix(p1x)},${this.fix(p1y)})and(${this.fix(p2x)},${this.fix(p2y)})..`;
          o.push(`${bezier}(${this.fix(x)},${this.fix(y)})`);
          x0 = x;
          y0 = y;
        }
      }
      else if (join == 'A') {
        if(o.length){
          var X1 = x0;
          var Y1 = y0;
          var X2 = x;
          var Y2 = y;
          var Rx         = pt[7];       
          var Ry         = pt[8];       
          var Phi        = pt[9];        
          var bigarcflag = pt[10];        
          var sweepflag  = pt[11];  
          var ang1 = 0;
          var ang2 = 0;     
          var Cx = 0;
          var Cy = 0; 
          if (sweepflag) {
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
          }else{
            Cx = x;
            Cy = y;
            Rx = 0;
            Ry = 0;
            ang1 = 0;
            ang2 = 0;
          }
          if(Rx>this.MIN_FLOAT&&Ry>this.MIN_FLOAT){
            if (sweepflag) {
              o.push(`--(subpath (${this.fix(ang2/45)},${this.fix(ang1/45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))`);
            } else {
              o.push(`--(subpath (${this.fix(ang1/45)},${this.fix(ang2/45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))`);
            }
          }else{
            o.push(`--(${this.fix(Cx)},${this.fix(Cy)})`);
          }
          x0 = x;
          y0 = y;
        }
      }
      else {
        // terminate the current path segment
        break;
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

  to_leads(g){
    let d = [];
    let linecap = this.to_linecaps(g);
    let linejoin = this.to_linejoins(g);
    d.push(`linecap:=${linecap}`);
    d.push(`linejoin:=${linejoin}`);
    return `${d.join(';')};`
  }

  to_linecaps(g) {
    let linecap = this.g_to_linecap_string(g);
    if (linecap === 'butt') {
      return 'butt';
    } else if (linecap === 'round') {
      return 'rounded';
    } else if (linecap === 'square') {
      return 'squared';
    }
    return 'butt';
  }
  
  to_linejoins(g) {
    let linejoin = this.g_to_linejoin_string(g);
    if (linejoin === 'miter') {
      return 'mitered';
    } else if (linejoin === 'round') {
      return 'rounded';
    } else if (linejoin === 'bevel') {
      return 'beveled';
    }
    return 'mitered';
  }
  
  local(pt) {
    var x = pt[0];
    var y = pt[1];
    return [x, y];
  }

  localx(x) {
    return x;
  }

  localy(y) {
    return y;
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///
  ///all primitive methods
  ///
  ////////////////////////////////////////////////////////////////////////////////
  p_comment(s){
    s = s.replace(/\\/g,'\\\\');
    return `% <-- ${s} -->`;
  }
  p_fillpath(coords,_g){
    var o = [];
    var items = this.coords_to_mp(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = this.update_g_hints(_g,hints);//will make a copy of _g if changed
      if(!iscycled){
        s = `${s}--cycle`
      }
      if(this.has_shades(g)){
        o.push(`fill (${s}) scaled(u) ${this.to_shadeonlys(g,1)};`);
      }else{
        o.push(`fill (${s}) scaled(u) ${this.to_fills(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_drawpath(coords,_g){
    var o = [];
    var items = this.coords_to_mp(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = this.update_g_hints(_g,hints);
      if(iscycled){
        if(this.has_shades(g)){
          o.push(`fill (${s}) scaled(u) ${this.to_shadeonlys(g,1)};`);
        }else if(this.has_fills(g)){
          o.push(`fill (${s}) scaled(u) ${this.to_fills(g)};`);
        }
      }
      if(this.has_strokes(g)){
        o.push(`draw (${s}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_strokepath(coords,_g){
    var o = [];
    var items = this.coords_to_mp(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = this.update_g_hints(_g,hints);
      if(this.has_strokes(g)){
        o.push(`${this.to_leads(g)} draw (${s}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_arrow(coords,_g){
    var o = [];
    var items = this.coords_to_mp(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = this.update_g_hints(_g,hints);
      if(this.has_strokes(g)){
        o.push(`${this.to_leads(g)} drawarrow (${s}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_revarrow(coords,_g){
    var o = [];
    var items = this.coords_to_mp(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = this.update_g_hints(_g,hints);
      if(this.has_strokes(g)){
        o.push(`${this.to_leads(g)} drawarrow reverse(${s}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_dblarrow(coords,_g){
    var o = [];
    var items = this.coords_to_mp(coords,true);
    for(var item of items) {
      var {iscycled,s,hints} = item;
      s = s.trim();
      if(!s) continue;
      var g = this.update_g_hints(_g,hints);
      if(this.has_strokes(g)){
        o.push(`${this.to_leads(g)} drawdblarrow (${s}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  ////////////////////////////////////////////////////////////////////////////
  ///ellipse drawing
  ////////////////////////////////////////////////////////////////////////////
  p_ellipse(cx,cy,rx,ry,g){
    var o = [];
    if(this.has_shades(g)){
      o.push(`${this.to_leads(g)} fill unitcircle shifted(-0.5,-0.5) xscaled(${this.fix(2*rx)}) yscaled(${this.fix(2*ry)}) shifted(${this.fix(cx)},${this.fix(cy)}) scaled(u) ${this.to_shadeonlys(g)};`);
    }else if(this.has_fills(g)){
      o.push(`${this.to_leads(g)} fill unitcircle shifted(-0.5,-0.5) xscaled(${this.fix(2*rx)}) yscaled(${this.fix(2*ry)}) shifted(${this.fix(cx)},${this.fix(cy)}) scaled(u) ${this.to_fills(g)};`);
    }
    if(this.has_strokes(g)){
      o.push(`${this.to_leads(g)} draw unitcircle shifted(-0.5,-0.5) xscaled(${this.fix(2*rx)}) yscaled(${this.fix(2*ry)}) shifted(${this.fix(cx)},${this.fix(cy)}) scaled(u) ${this.to_draws(g)};`);
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_circle(cx,cy,r,g){
    var o = [];
    if(this.has_shades(g)){
      o.push(`${this.to_leads(g)} fill unitcircle shifted(-0.5,-0.5) scaled(${this.fix(2*r)}) shifted(${this.fix(cx)},${this.fix(cy)}) scaled(u) ${this.to_shadeonlys(g,1)};`);
    }else if(this.has_fills(g)){
      o.push(`${this.to_leads(g)} fill unitcircle shifted(-0.5,-0.5) scaled(${this.fix(2*r)}) shifted(${this.fix(cx)},${this.fix(cy)}) scaled(u) ${this.to_fills(g)};`);
    }
    if(this.has_strokes(g)){
      o.push(`${this.to_leads(g)} draw unitcircle shifted(-0.5,-0.5) scaled(${this.fix(2*r)}) shifted(${this.fix(cx)},${this.fix(cy)}) scaled(u) ${this.to_draws(g)};`);
    }
    var img = o.join(' ')
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_rect(x,y,w,h,rdx,rdy,g){
    var o = [];
    if(rdx&&rdy){
      rdx = Math.min(rdx,rdy);
      if(this.has_shades(g)){
        o.push(`${this.to_leads(g)} fill roundedsquare(${this.fix(w)},${this.fix(h)},${this.fix(rdx)}) shifted(${this.fix(x)},${this.fix(y)}) scaled(u) ${this.to_shadeonlys(g)};`);
      }else if(this.has_fills(g)){
        o.push(`${this.to_leads(g)} fill roundedsquare(${this.fix(w)},${this.fix(h)},${this.fix(rdx)}) shifted(${this.fix(x)},${this.fix(y)}) scaled(u) ${this.to_fills(g)};`);
      }
      if(this.has_strokes(g)){
        o.push(`${this.to_leads(g)} draw roundedsquare(${this.fix(w)},${this.fix(h)},${this.fix(rdx)}) shifted(${this.fix(x)},${this.fix(y)}) scaled(u) ${this.to_draws(g)};`);
      }
    }else{
      if(this.has_shades(g)){
        o.push(`${this.to_leads(g)} fill unitsquare xscaled(${this.fix(w)}) yscaled(${this.fix(h)}) shifted(${this.fix(x)},${this.fix(y)}) scaled(u) ${this.to_shadeonlys(g)};`);
      }else if(this.has_fills(g)){
        o.push(`${this.to_leads(g)} fill unitsquare xscaled(${this.fix(w)}) yscaled(${this.fix(h)}) shifted(${this.fix(x)},${this.fix(y)}) scaled(u) ${this.to_fills(g)};`);
      }
      if(this.has_strokes(g)){
        o.push(`${this.to_leads(g)} draw unitsquare xscaled(${this.fix(w)}) yscaled(${this.fix(h)}) shifted(${this.fix(x)},${this.fix(y)}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_line(x1,y1,x2,y2,g){
    var mypath = `(${this.fix(x1)},${this.fix(y1)})--(${this.fix(x2)},${this.fix(y2)})`;
    var o = [];
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        o.push(`${this.to_leads(g)} drawarrow (${mypath}) scaled(u) ${this.to_draws(g)};`);
      }else if(arrowhead==2){
        o.push(`${this.to_leads(g)} drawarrow reverse(${mypath}) scaled(u) ${this.to_draws(g)};`);
      }else if(arrowhead==3){
        o.push(`${this.to_leads(g)} drawdblarrow (${mypath}) scaled(u) ${this.to_draws(g)};`);
      }else{
        o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_polyline(points,g){
    var d = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      d.push(`(${this.fix(x)},${this.fix(y)})`);
    }
    var o = [];
    var s = d.join('--');
    if(this.has_strokes(g)){
      o.push(`${this.to_leads(g)} draw (${s}) scaled(u) ${this.to_draws(g)};`);
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_polygon(points,g){
    var d = [];
    for(var i=1; i < points.length; i+=2){
      var x = points[i-1];
      var y = points[i];
      d.push(`(${this.fix(x)},${this.fix(y)})`);
    }
    d.push(`cycle`);
    var o = [];
    var s = d.join('--');
    if(this.has_shades(g)){
      o.push(`${this.to_leads(g)} fill (${s}) scaled(u) ${this.to_shadeonlys(g)};`);
    }else if(this.has_fills(g)){
      o.push(`${this.to_leads(g)} fill (${s}) scaled(u) ${this.to_fills(g)};`);
    }
    if(this.has_strokes(g)){
      o.push(`${this.to_leads(g)} draw (${s}) scaled(u) ${this.to_draws(g)};`);
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
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
  //////////////////////////////////////////////////////////////////////
  ///Bezier curve
  //////////////////////////////////////////////////////////////////////
  p_qbezier_line(x0,y0, x1,y1, x2,y2, g){
    var o = [];
    let [C0,C1,C2,C3] = this.quadrilatic_bezier_to_cubic([x0,y0],[x1,y1],[x2,y2]);
    var x0 = C0[0];
    var y0 = C0[1];
    var x1 = C1[0];
    var y1 = C1[1];
    var x2 = C2[0];
    var y2 = C2[1];
    var x3 = C3[0];
    var y3 = C3[1];
    var path = `(${this.fix(x0)},${this.fix(y0)})..controls(${this.fix(x1)},${this.fix(y1)})and(${this.fix(x2)},${this.fix(y2)})..(${this.fix(x3)},${this.fix(y3)})`;
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        o.push(`${this.to_leads(g)} drawarrow (${path}) scaled(u) ${this.to_draws(g)};`);
      }else if(arrowhead==2){
        o.push(`${this.to_leads(g)} drawarrow reverse(${path}) scaled(u) ${this.to_draws(g)};`);
      }else if(arrowhead==3){
        o.push(`${this.to_leads(g)} drawdblarrow (${path}) scaled(u) ${this.to_draws(g)};`);
      }else{
        o.push(`${this.to_leads(g)} draw (${path}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_bezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g){
    var o = [];
    var path = `(${this.fix(x0)},${this.fix(y0)})..controls(${this.fix(x1)},${this.fix(y1)})and(${this.fix(x2)},${this.fix(y2)})..(${this.fix(x3)},${this.fix(y3)})`;
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        o.push(`${this.to_leads(g)} drawarrow (${path}) scaled(u) ${this.to_draws(g)};`);
      }else if(arrowhead==2){
        o.push(`${this.to_leads(g)} drawarrow reverse(${path}) scaled(u) ${this.to_draws(g)};`);
      }else if(arrowhead==3){
        o.push(`${this.to_leads(g)} drawdblarrow (${path}) scaled(u) ${this.to_draws(g)};`);
      }else{
        o.push(`${this.to_leads(g)} draw (${path}) scaled(u) ${this.to_draws(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  ///
  ///plot
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
          d.push(`(${this.fix(x)},${this.fix(y)})`);
          continue;
        }
      }
      if(d.length){
        d = [];
        all.push(d);
      }
    } 
    all = all.filter(d=>d.length);
    all = all.map(d=>d.join('--'));
    all = all.map(s=>`draw (${s}) scaled(u) ${this.to_draws(g)};`)
    all = all.map(s => `draw image ( ${s} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`);
    return all.join('\n');   
  }
  ///
  ///dot and bar drawing
  ///
  p_dot_square(x,y,g){
    ///***NOTE that drawdot cannot use shifted or scaled command
    ///   because there is no path before it
    let r2 = this.to_dotsize_diameter(g);
    let r = r2 * 0.5;
    var o = [];
    o.push(`fill unitsquare scaled(${r2}) shifted(${-r},${-r}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_dot_circle(x,y,g){
    let r2 = this.to_dotsize_diameter(g);
    x = this.fix(x);
    y = this.fix(y);
    var o = [];
    o.push(`fill fullcircle scaled(${r2}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_dot_pie(x,y,start_a,span_a,g){
    ///following is just copied from p_pie
    var cx = 0;
    var cy = 0;
    var r = 0.5;
    var o = [];
    var X1 = cx + r*Math.cos(start_a/180*Math.PI);
    var Y1 = cy + r*Math.sin(start_a/180*Math.PI);
    var X2 = cx + r*Math.cos((start_a+span_a)/180*Math.PI);
    var Y2 = cy + r*Math.sin((start_a+span_a)/180*Math.PI);
    var Phi = 0;
    var sweepflag = 0;
    var bigarcflag = 0;
    Rx = Math.max(r,this.MIN_FLOAT);
    Ry = Math.max(r,this.MIN_FLOAT);
    if(span_a > 180){
      bigarcflag = 1;
    }
    var [Cx, Cy, Rx, Ry] = arcpath(X1, Y1, X2, Y2, Rx, Ry, Phi, bigarcflag);
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
      if (sweepflag) {
        let mypath = `(${this.fix(Cx)},${this.fix(Cy)})--(${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang2 / 45)},${this.fix(ang1 / 45)}) of fullcircle)--cycle`;
        let r2 = this.to_dotsize_diameter(g);
        //return(`fill (${mypath}) scaled(${r2}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
        o.push(`fill (${mypath}) scaled(${r2}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
      } else {
        let mypath = `(${this.fix(Cx)},${this.fix(Cy)})--(${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang1 / 45)},${this.fix(ang2 / 45)}) of fullcircle)--cycle`;
        let r2 = this.to_dotsize_diameter(g);
        //return(`fill (${mypath}) scaled(${r2}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
        o.push(`fill (${mypath}) scaled(${r2}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
      }
    }
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_lhbar(x,y,g){
    var o = [];
    var delta_x = this.g_to_barlength_float(g)/2;
    var mypath = `(${this.fix(x)},${this.fix(y)})--(${this.fix(x-delta_x)},${this.fix(y)})`;
    o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_rhbar(x,y,g){
    var o = [];
    var delta_x = this.g_to_barlength_float(g)/2;
    var mypath = `(${this.fix(x)},${this.fix(y)})--(${this.fix(x+delta_x)},${this.fix(y)})`;
    o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_tvbar(x,y,g){
    var o = [];
    var delta_y = this.g_to_barlength_float(g)/2;
    var mypath = `(${this.fix(x)},${this.fix(y)})--(${this.fix(x)},${this.fix(y+delta_y)})`;
    o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_bvbar(x,y,g){
    var o = [];
    var delta_y = this.g_to_barlength_float(g)/2;
    var mypath = `(${this.fix(x)},${this.fix(y)})--(${this.fix(x)},${this.fix(y-delta_y)})`;
    o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_header(opt,x,y,w,h,txt,g){
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
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
      txt=txt||'';
      var s = this.translator.literal_to_math(g,txt);
      var s = `\\switchtobodyfont[${fontsize}pt]${s}`;
      var textext = s;
    }else{
      txt=txt||'';
      var s = this.translator.smooth(g,txt);
      var s = `\\switchtobodyfont[${fontsize}pt]${s}`;
      var textext = s;
    }
    if(1){
      // now we will switch to using textext, allowing us to rotate text as well
      var o = [];
      o.push(`picture one; one := textext("${textext}");`);
      o.push(`numeric halfw; halfw := bbwidth(one)/2 ;`);
      o.push(`numeric halfh; halfh := bbheight(one)/2 ;`);
      if(opt=='l'){
        o.push(`draw one shifted (+halfw+2pt,-halfh-2pt) shifted (${this.fix(0)}*u,${this.fix(h)}*u) ${this.to_texts(g)};`);
      }else if(opt=='r'){
        o.push(`draw one shifted (-halfw-2pt,-halfh-2pt) shifted (${this.fix(w)}*u,${this.fix(h)}*u) ${this.to_texts(g)};`);
      }else{
        o.push(`draw one shifted (0,-halfh-2pt) shifted (${this.fix(w/2)}*u,${this.fix(h)}*u) ${this.to_texts(g)};`);
      }
      var img = o.join(' ');
      var img = `draw image ( ${img} ) ;`;
    }
    return img;
  }
  p_footer(opt,x,y,w,h,txt,g){
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
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
      txt=txt||'';
      var s = this.translator.literal_to_math(g,txt);
      var s = `\\switchtobodyfont[${fontsize}pt]${s}`;
      var textext = s;
    }else{
      txt=txt||'';
      var s = this.translator.smooth(g,txt);
      var s = `\\switchtobodyfont[${fontsize}pt]${s}`;
      var textext = s;
    }
    if(1){
      // now we will switch to using textext, allowing us to rotate text as well
      var o = [];
      o.push(`picture one; one := textext("${textext}");`);
      o.push(`numeric halfw; halfw := bbwidth(one)/2 ;`);
      o.push(`numeric halfh; halfh := bbheight(one)/2 ;`);
      if(opt=='l'){
        o.push(`draw one shifted (+halfw,+halfh) shifted (${this.fix(0)}*u,${this.fix(0)}*u) ${this.to_texts(g)};`);
      }else if(opt=='r'){
        o.push(`draw one shifted (-halfw,+halfh) shifted (${this.fix(w)}*u,${this.fix(0)}*u) ${this.to_texts(g)};`);
      }else{
        o.push(`draw one shifted (0,+halfh) shifted (${this.fix(w/2)}*u,${this.fix(0)}*u) ${this.to_texts(g)};`);
      }
      var img = o.join(' ');
      var img = `draw image ( ${img} ) ;`;
    }
    return img;
  }
  p_image(x,y,w,h,ta,imgsrc,g){
    ///default the image is to be drawn at the center of (x/y)
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
    x = this.fix(x);
    y = this.fix(y);
    w = this.fix(w);
    h = this.fix(h);
    var o = [];
    o.push(`picture p ; p := externalfigure "${imgsrc}" ;`);
    o.push(`numeric sx ; sx := bbwidth(p)/(${w}*u) ;`);
    o.push(`numeric sy ; sy := bbheight(p)/(${h}*u) ;`);
    if(this.g_to_fit_string(g)=='contain'){
      o.push(`if sx > sy : p := p xsized(${w}*u) ; else : p := p ysized(${h}*u) ; fi ;`);
    }else if(this.g_to_fit_string(g)=='cover'){
      o.push(`if sx < sy : p := p xsized(${w}*u) ; else : p := p ysized(${h}*u) ; fi ;`);
    }else{
      ///default is 'fill'
      o.push(`p := p sized(${w}*u,${h}*u) ;`);
    }
    o.push(`draw p shifted(${x}*u,${y}*u) ;`);
    var img = o.join(' ')
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    if(imgsrc){
      return img;
    }else{
      return '';
    }
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
  p_math(x,y,txt,ta,g){
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    if(1){
      txt=txt||'';
      var s = this.translator.literal_to_math(g,txt);
      var s = `\\switchtobodyfont[${fontsize}pt]${s}`;
      var textext = s;
    }
    // now we will switch to using textext, allowing us to rotate text as well
    var rotate = this.g_to_rotate_float(g);
    var math_gap = this.translator.tokenizer.math_gap;
    var o = [];
    o.push(`picture one; one := textext("${textext}");`);
    o.push(`numeric halfw; halfw := bbwidth(one)/2 + ${math_gap}pt;`);
    o.push(`numeric halfh; halfh := bbheight(one)/2 ;`);
    if(ta.length==0){
      ta = 'ur';
    }
    switch(ta){
      case 'c':
        o.push(`draw one shifted (0,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'r':
        o.push(`draw one shifted (halfw,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'ur':
        o.push(`draw one shifted (halfw,halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'br':
        o.push(`draw one shifted (halfw,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'l':
        o.push(`draw one shifted (-halfw,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'ul':
        o.push(`draw one shifted (-halfw,halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'bl':
        o.push(`draw one shifted (-halfw,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'u':
        o.push(`draw one shifted (0,+halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'b':
        o.push(`draw one shifted (0,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
    }
    var img = o.join(' ')
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_text(x,y,txt,ta,g) {
    var fontsize = this.g_to_fontsize_float(g);
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontfamily = this.g_to_mien_fontfamily_flag(g);
    var fontstyle = this.g_to_mien_fontstyle_flag(g);
    var fontweight = this.g_to_mien_fontweight_flag(g);
    var textdecoration = this.g_to_mien_textdecoration_flag(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    if(!fontcolor){
      fontcolor = 'black';
    }
    fontcolor = this.string_to_mp_color(fontcolor,g.hints); 
    let ss = txt.trim().split('\\\\');
    ss = ss.map(x => x.trim());
    ss = ss.map(x => this.translator.flatten(g,x)); // remove all \n 
    ss = ss.map((s) => {
      s = `\\switchtobodyfont[${fontsize}pt]${s}`        
      if(textdecoration=='s'){
        s = `\\inframed[frame=off]{\\overstrike{${s}}}`;
      }
      if(fontweight=='b'){
        s = `\\bold{${s}}`;
      }
      if(fontstyle=='i'){
        s = `\\italic{${s}}`;
      }
      if(fontfamily=='t'){
        s = `{\\tt ${s}}`
      }
      return s;
    });
    var o = [];
    o.push(`numeric fh; fh := ${fontsize}pt;`);
    if(ta.length==0){
      ta = "ur";
    }
    if(ta=='u'||ta=='ul'||ta=='ur'){
      o.push('picture pic[];')
      ss.forEach((s,j,arr) => {
        o.push(`pic[${j+1}] := textext.urt("${s}");`)
      });
      var n = ss.length;
      var dy = (n-1)*1.0;
      ss.forEach((s,j,arr) => {
        if(ta=='ul'){
          var dx = -1.0;
        }else if(ta=='ur'){
          var dx = +0.0;
        }else{
          var dx = -0.5;
        }
        o.push(`draw pic[${j+1}] shifted (${dx}*bbwidth(pic[${j+1}]),${dy}*fh) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
        dy -= 1;
      })
    }else if(ta=='b'||ta=='bl'||ta=='br'){
      o.push('picture pic[];')
      ss.forEach((s,j,arr) => {
        o.push(`pic[${j+1}] := textext.urt("${s}");`)
      });
      var n = ss.length;
      var dy = -1.0;
      ss.forEach((s,j,arr) => {
        if(ta=='bl'){
          var dx = -1.0;
        }else if(ta=='br'){
          var dx = +0.0;
        }else{
          var dx = -0.5;
        }
        o.push(`draw pic[${j+1}] shifted (${dx}*bbwidth(pic[${j+1}]),${dy}*fh) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
        dy -= 1;
      })
    }else if(ta=='c'||ta=='l'||ta=='r'){
      o.push('picture pic[];')
      ss.forEach((s,j,arr) => {
        o.push(`pic[${j+1}] := textext.urt("${s}");`)
      });
      var n = ss.length;
      var dy = -0.5+(n-1)*0.5;
      ss.forEach((s,j,arr) => {
        if(ta=='l'){
          var dx = -1.0;
        }else if(ta=='r'){
          var dx = +0.0;
        }else{
          var dx = -0.5;
        }
        o.push(`draw pic[${j+1}] shifted (${dx}*bbwidth(pic[${j+1}]),${dy}*fh) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
        dy -= 1;
      })
    }
    var img = o.join(' ')
    /// draw image ( draw ((0,0)--(3,3)) scaled(u) withpen pencircle scaled 1; ) shifted(1*u,1*u) xscaled(2) yscaled(2) ;
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_grid(density,g){
    if(this.has_strokes(g)){
      var o = [];
      o.push(`draw hlingrid(0,${this.viewport_height*density},1,${this.viewport_height},${this.viewport_width}) scaled(u) ${this.to_draws(g)};`);
      o.push(`draw vlingrid(0,${this.viewport_width*density},1,${this.viewport_width},${this.viewport_height}) scaled(u) ${this.to_draws(g)};`);
      o = o.map((img) => {
        var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
        return img;
      })
      return o.join('\n');
    }
    return '';
  }
  p_cairo(x,y,txt,extent,g){
    var ss = this.txt_to_singleline_ss(txt,g);
    var txt = ss[0]||'';
    var width = extent*this.viewport_unit;
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontsize = this.g_to_fontsize_float(g);
    var fontfamily = this.g_to_mien_fontfamily_flag(g);
    var fontstyle = this.g_to_mien_fontstyle_flag(g);
    var fontweight = this.g_to_mien_fontweight_flag(g);
    var textdecoration = this.g_to_mien_textdecoration_flag(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    if(!fontcolor){
      fontcolor = 'black';
    }
    fontcolor = this.string_to_mp_color(fontcolor,g.hints); 
    ///the 's0' here is to turnoff the leading space before the 1st column
    //var txt = `\\hbox{\\starttable[s0|p(${width}mm)|]\\NC{${txt}}\\MR\\stoptable}`;
    var s = txt;
    s = `\\framed[frame=off,width=${width}mm,align=flushleft]{${s}}`;
    s = `\\switchtobodyfont[${fontsize}pt]\\setupinterlinespace[line=${fontsize}pt]${s}`        
    if(textdecoration=='s'){
      s = `\\inframed[frame=off]{\\overstrike{${s}}}`;
    }
    if(fontweight=='b'){
      s = `\\bold{${s}}`;
    }
    if(fontstyle=='i'){
      s = `\\italic{${s}}`;
    }
    if(fontfamily=='t'){
      s = `{\\tt ${s}}`
    }
    var o = [];
    o.push(`picture one; one := textext("${s}");`)
        //o.push(`draw pic[${j+1}] shifted (${dx}*bbwidth(pic[${j+1}]),${dy}*fh) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
    o.push(`draw one shifted (0.5*bbwidth(one),-0.5*bbheight(one)) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
    var img = o.join(' ');
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
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
    /*
    picture one; one := textext("{\switchtobodyfont[8pt]Hello}") (withcolor black);
    draw one shifted (0,bbwidth(one)) rotated (45) shifted (3*u,3*u);
    */
    if(!txt) return '';
    var d = [];
    if(ta=='b'){
      d.push(`opacity=1, pos=0.5, below, sloped`);
    }else{
      d.push(`opacity=1, pos=0.5, above, sloped`);
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontfamily = this.g_to_contex_fontfamily_switch(g);
    var fontstyle = this.g_to_contex_fontstyle_switch(g);
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    if(!fontcolor){
      fontcolor = 'black';
    }
    fontcolor = this.string_to_mp_color(fontcolor,g.hints); 
    //let fs = this.g_to_mp_font_attr(g);
    //d.push(`font=${fs}`);
    var s = this.translator.flatten(g,txt);
    s = `\\switchtobodyfont[${fontsize}pt]${s}`        
    if(fontstyle){
      s = `${fontstyle}{}${s}`
    }
    if(fontfamily){
      s = `${fontfamily}{}${s}`
    }
    var x = (x1+x2)/2;
    var y = (y1+y2)/2;
    var ang = (Math.atan2(y2-y1,x2-x1))/Math.PI*180;
    var o = [];
    if(this.has_texts(g)){
      o.push(`picture one; one := textext("${s}");`);
      if(ta=='b'){
        //'b'
        o.push(`draw one shifted (0,-bbheight(one)*0.5) rotated (${this.fix(ang)}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`);
      }else if(ta=='u'){
        //'u'
        o.push(`draw one shifted (0,+bbheight(one)*0.5) rotated (${this.fix(ang)}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`);
      }else{
        //'c'
        o.push(`draw one shifted (0,+bbheight(one)*0.0) rotated (${this.fix(ang)}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`);
      }
    }
    var img = o.join(' ')
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  p_slopedmath(x1,y1,x2,y2,txt,ta,g){
    /*
    picture one; one := textext("{\switchtobodyfont[8pt]Hello}") (withcolor black);
    draw one shifted (0,bbwidth(one)) rotated (45) shifted (3*u,3*u);
    */
    if(!txt) return '';
    var d = [];
    if(ta=='b'){
      d.push(`opacity=1, pos=0.5, below, sloped`);
    }else{
      d.push(`opacity=1, pos=0.5, above, sloped`);
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontfamily = this.g_to_contex_fontfamily_switch(g);
    var fontstyle = this.g_to_contex_fontstyle_switch(g);
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    if(!fontcolor){
      fontcolor = 'black';
    }
    fontcolor = this.string_to_mp_color(fontcolor,g.hints); 
    var s = this.translator.literal_to_math(g,txt);
    s = `\\switchtobodyfont[${fontsize}pt]${s}`        
    if(fontstyle){
      s = `${fontstyle}{}${s}`
    }
    if(fontfamily){
      s = `${fontfamily}{}${s}`
    }
    var x = (x1+x2)/2;
    var y = (y1+y2)/2;
    var ang = (Math.atan2(y2-y1,x2-x1))/Math.PI*180;
    var o = [];
    if(this.has_texts(g)){
      o.push(`picture one; one := textext("${s}");`);
      if(ta=='b'){
        //'b'
        o.push(`draw one shifted (0,-bbheight(one)*0.5) rotated (${this.fix(ang)}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`);
      }else if(ta=='u'){
        //'u'
        o.push(`draw one shifted (0,+bbheight(one)*0.5) rotated (${this.fix(ang)}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`);
      }else{
        //'c'
        o.push(`draw one shifted (0,+bbheight(one)*0.0) rotated (${this.fix(ang)}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`);
      }
    }
    var img = o.join(' ')
    var img = `draw image ( ${img} ) xscaled(${this.origin_sx}) yscaled(${this.origin_sy}) shifted(${this.origin_x}*u,${this.origin_y}*u) ;`;
    return img;
  }
  ///
  /// g_to_XXX
  ///
  g_to_mp_dotcolor(g){
    var s = this.g_to_dotcolor_string(g);
    if(s){
      return(`withcolor ${this.string_to_mp_color(s,g.hints)}`);
    }
    return '';
  }
  g_to_contex_fontfamily_switch(g){
    var s = this.g_to_fontstyle_string(g)||'';
    var s = this.string_to_contex_fontfamily_switch(s);
    return s;
  }
  g_to_contex_fontstyle_switch(g){
    var s = this.g_to_fontstyle_string(g)||'';
    var s = this.string_to_contex_fontstyle_switch(s);
    return s;
  }
  ///
  /// to_XXX
  ///
  to_mp_shadecolor_ss(g) {
    let shadecolor = this.g_to_shadecolor_string(g);
    var ss = [];
    if (shadecolor) {
      ss = this.string_to_array(shadecolor)
    }
    ss = ss.map(s => this.string_to_mp_color(s,g.hints));
    return ss;
  }
  to_draws(g) {
    var o = [];
    let linedashed = this.g_to_linedashed_int(g);
    if (linedashed) {
      o.push(`dashed evenly`);
    }
    var d = this.g_to_linesize_float(g);
    if(d){
      o.push(`withpen pencircle scaled ${d}`);
    }
    let linecolor = this.g_to_linecolor_string(g);
    let alpha = this.g_to_linealpha_float(g);
    if (linecolor) {
      linecolor = this.string_to_mp_color(linecolor,g.hints);
      if(alpha < 1){
        linecolor = `transparent(1,${alpha},(${linecolor}))`;
      } 
      o.push(`withcolor ${linecolor}`);
    }else{
      if(alpha < 1){
        o.push(`withcolor transparent(1,${alpha},(black))`);
      }
    }
    return o.join(' ');
  }
  to_shadeonlys(g,isinherit) {
    var d = [];
    var angle = this.g_to_angle_float(g);//between 0-90
    var shade = this.g_to_shade_string(g);
    var opacity = this.g_to_fillalpha_float(g);
    var ss = this.to_mp_shadecolor_ss(g);
    if (shade=='radial'){
      d.push(`withshademethod \"circular\"`);
      d.push(`withshadefactor 1`)
      d.push(`withshadedomain(0,2)`)
      if(ss.length==0){
        d.push(`withshadecolors(white,black)`)
      }else if(ss.length==1){
        d.push(`withshadecolors(${ss[0]},\\MPcolor{black})`)
      }else{
        ///for radial there can only be two color choices
        d.push(`withshadecolors(${ss[0]},${ss[1]})`)
      }
    }else if (shade=='ball'){
      d.push(`withshademethod \"circular\"`);
      //d.push(`withshadedirection(3.39,1.39)`);
      d.push(`withshadecenter(-0.45,0.35)`)
      d.push(`withshadedomain(0,1)`)
      if(ss.length==0){
        d.push(`withshadestep( withshadefraction 0.5 withshadecolors(\\MPcolor{white},(0.5,0.5,0.5)) )`)
        d.push(`withshadestep( withshadefraction 1.0 withshadecolors((0.5,0.5,0.5),\\MPcolor{black}) )`)
      }else{
        d.push(`withshadestep( withshadefraction 0.5 withshadecolors(\\MPcolor{white},${ss[0]}) )`)
        d.push(`withshadestep( withshadefraction 1.0 withshadecolors(${ss[0]},\\MPcolor{black}) )`)
      }
    }else{ //default to 'linear'
      d.push(`withshademethod \"linear\"`);
      var adjust = angle/90;
      var from = 2.5 + adjust;
      var to = 0.5 + adjust;
      d.push(`withshadedirection(${this.fix(from)},${this.fix(to)})`)
      if(ss.length==0){
        d.push(`withshadestep( withshadefraction 1 withshadecolors(white,black) )`)
      }else if(ss.length==1){
        d.push(`withshadestep( withshadefraction 1 withshadecolors(${ss[0]},\\MPcolor{black}) )`)
      }else if(ss.length==2){
        d.push(`withshadestep( withshadefraction 1 withshadecolors(${ss[0]},${ss[1]}) )`)
      }else{
        d.push(`withshadestep( withshadefraction .5 withshadecolors(${ss[0]},${ss[1]}) )`)
        d.push(`withshadestep( withshadefraction 1 withshadecolors(${ss[1]},${ss[2]}) )`)
      }
    }
    if(opacity<1){
      d.push(`withtransparency(1,${opacity})`);
    }
    return d.join(' ');
  }
  to_fills(g) {
    let fillcolor = this.g_to_fillcolor_string(g);
    let opacity = this.g_to_fillalpha_float(g);
    if (fillcolor=='none') {
      return 'withcolor transparent(1,0,black)';//complete transparent
    }
    var s = this.string_to_mp_color(fillcolor,g.hints);
    if(opacity < 1){
      s = `transparent(1,${opacity},(${s}))`;
    }
    if (s) {
      return(`withcolor ${s}`);
    }
    return '';
  }
  to_texts(g) {
    var s = '';
    var fontcolor = this.g_to_fontcolor_string(g);
    if (fontcolor) {
      s = `withcolor ${this.string_to_mp_color(fontcolor,g.hints)}`;
    }
    return s;
  }
  to_dotsize_diameter(g) {
    return this.g_to_dotsize_float(g);
  }
  hexcolor_to_mf_color(s){
    // convert a string such as FFF or EFEFEF (without the hashmark) to (0.93,1,0.87)
    // will truncate to 2 decimal places
    // convert a string such as E0F0D0 to (0.93,1,0.87)
    if(s.length==6){
      var r = s.substr(0,2); r = parseInt(`0x${r}`); r /= 255;
      var g = s.substr(2,2); g = parseInt(`0x${g}`); g /= 255;
      var b = s.substr(4,2); b = parseInt(`0x${b}`); b /= 255;
    }else if(s.length==3){
      var r = s.substr(0,1); r = parseInt(`0x${r}`); r /= 15;
      var g = s.substr(1,1); g = parseInt(`0x${g}`); g /= 15;
      var b = s.substr(2,1); b = parseInt(`0x${b}`); b /= 15;
    } else {
      var r = 1;
      var g = 1;
      var b = 1;
    }
    return `(${this.fix3(r)},${this.fix3(g)},${this.fix3(b)})`;
  }
  ///redefine the 'to_text_label' method because MetaFun has changed its
  ///syntax
  to_tex_label(txt,math,fontsize){
    txt=txt||'';
    var fs = `${fontsize}pt`;
    if (math==1) {
      // math text
      let style = {};
      var s = this.translator.literal_to_math(style,txt);
      var s = `{\\switchtobodyfont[${fs}]${s}}`;
    } else {
      // normal text with symbols
      var s = this.translator.flatten(g,txt);
      var s = `{\\switchtobodyfont[${fs}]${s}}`
    }
    return `"${s}"`;
  }
  to_tex_text(txt,g){
    // normal text with symbols
    var s = this.translator.flatten(g,txt);
    var fontsize = this.g_to_fontsize_float(g);
    return `{\\switchtobodyfont[${fontsize}pt]${s}}`;
  }
  string_to_mp_color(s,hints) {
    if (!s) {
      s = 'black';
    } 
    if (s == 'currentColor'){
      s = 'black';
    }
    if (typeof s == 'string') {
      s = this.string_to_hexcolor(s,hints);
      s = s.slice(1);//remove leading number-sign
      s = this.hexcolor_to_mf_color(s);
      return s;
    } 
    else {
      return 'black';
    }
  }
  //////////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////////
  txt_to_singleline_ss(txt,g){
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontfamily = this.g_to_contex_fontfamily_switch(g);
    var fontstyle = this.g_to_contex_fontstyle_switch(g);
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    if(!fontcolor){
      fontcolor = 'black';
    }
    fontcolor = this.string_to_mp_color(fontcolor,g.hints); 
    let ss = [txt];
    ss = ss.map(x => x.trim());
    ss = ss.map(x => this.translator.flatten(g,x)); // remove all \n 
    ss = ss.map((s) => {
      s = `\\switchtobodyfont[${fontsize}pt]${s}`        
      if(fontstyle){
        s = `${fontstyle}{}${s}`
      }
      if(fontfamily){
        s = `${fontfamily}{}${s}`
      }
      return s;
    });
    return ss;
  }
  txt_to_multiline_ss(txt,g){
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontfamily = this.g_to_contex_fontfamily_switch(g);
    var fontstyle = this.g_to_contex_fontstyle_switch(g);
    var fontsize = this.g_to_fontsize_float(g);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    if(!fontcolor){
      fontcolor = 'black';
    }
    fontcolor = this.string_to_mp_color(fontcolor,g.hints); 
    let ss = txt.trim().split('\\\\');
    ss = ss.map(x => x.trim());
    ss = ss.map(x => this.translator.flatten(g,x)); // remove all \n 
    ss = ss.map((s) => {
      s = `\\switchtobodyfont[${fontsize}pt]${s}`        
      if(fontstyle){
        s = `${fontstyle}{}${s}`
      }
      if(fontfamily){
        s = `${fontfamily}{}${s}`
      }
      return s;
    });
    return ss;
  }
}
module.exports = { NitrilePreviewDiagramMF };
