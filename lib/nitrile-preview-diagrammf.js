'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { arcpath } = require('./nitrile-preview-arcpath');

class NitrilePreviewDiagramMF extends NitrilePreviewDiagram {

  constructor(translator) {
    super(translator);
    this.re_unit = /^(\d+)mm$/;
    this.re_inlinemath = /^\`\`(.*)\`\`$/;
  }
  
  do_setup() {
  }

  do_finalize(s,style) {
    var o = [];
    var xm = this.viewport_width;
    var ym = this.viewport_height;
    var unit = this.viewport_unit;
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
    if (this.config.gridlines=='none') {
      o.push(`for i=0 step ${ym} until ${ym}: draw (0,i*u) --- (${xm}*u,i*u) withcolor white; endfor;`);
      o.push(`for i=0 step ${xm} until ${xm}: draw (i*u,0) --- (i*u,${ym}*u) withcolor white; endfor;`);
    } else {
      let gridcolor = this.g_to_gridcolor_string(this.config);
      let s = this.string_to_mp_color(gridcolor,0);
      o.push(`for i=0 upto ${ym}: draw (0,i*u) --- (${xm}*u,i*u) withcolor ${s}; endfor;`);
      o.push(`for i=0 upto ${xm}: draw (i*u,0) --- (i*u,${ym}*u) withcolor ${s}; endfor;`);
    }
    o.push(s);
    var s = o.join('\n');
    let d = [];
    d.push('\\startMPcode');
    d.push(`numeric u; u := ${unit}mm;`);
    d.push(`numeric pw; pw := u;`);
    d.push(`numeric ph; ph := u;`)
    d.push(`numeric textwidth; textwidth := \\the\\textwidth;`);
    d.push(`numeric textheight; textheight := \\the\\textwidth;`);
    d.push(`numeric ratio_w; ratio_w := 1;`)
    d.push(`numeric ratio_h; ratio_h := 1;`)
    d.push(s);
    d.push(`clip currentpicture to unitsquare xscaled (${xm}*u) yscaled (${ym}*u) ;`);
    if (style && style.width && style.height){
      let wd = style.width;
      let wd_percent = this.string_to_percentage(wd);
      if (wd_percent) {
        d.push(`textwidth := textwidth*${wd_percent};`);
        d.push(`pw := textwidth/${xm};`);
        d.push(`ratio_w := pw/u;`);  
      } else {
        d.push(`textwidth := ${wd};`)
        d.push(`pw := textwidth/${xm};`);
        d.push(`ratio_w := pw/u;`);  
      }
      let ht = style.height;
      let ht_percent = this.string_to_percentage(ht);
      if (ht_percent) {
        //do nothing
        d.push(`ratio_h := ratio_w;`);
      }else{
        d.push(`textheight := ${ht};`);
        d.push(`ph := textheight/${ym};`)
        d.push(`ratio_h := ph/u;`)
      }
      d.push(`currentpicture := currentpicture xscaled ratio_w yscaled ratio_h;`)
    } else if (style && style.width) {
      ///width-only
      let wd = style.width;
      let wd_percent = this.string_to_percentage(wd);
      if (wd_percent) {
        d.push(`textwidth := textwidth*${wd_percent};`);
        d.push(`pu := textwidth/${xm};`);
        d.push(`ratio_w := pu/u;`);  
      } else {
        d.push(`textwidth := ${wd};`)
        d.push(`pu := textwidth/${xm};`);
        d.push(`ratio_w := pu/u;`);  
      }
      d.push(`currentpicture := currentpicture scaled ratio_w;`)
    }
    if(style.frame){
      d.push(`path bb ; bboxmargin := 0pt ; bb := bbox currentpicture ;`);
      d.push(`draw bb withpen pencircle scaled 0.5pt withcolor black ;`);
    }
    d.push('\\stopMPcode');
    var img = d.join('\n');
    return { img };
  }
  do_drawarc(opt,txt,g,coords){
    var o = [];
    for (var i = 1; i < coords.length; ++i) {
      var z0 = this.point(coords, i - 1);
      var z1 = this.point(coords, i);
      if(!this.isvalidpt(z0)) continue;
      if(!this.isvalidpt(z1)) continue;
      z0 = this.local(z0);
      z1 = this.local(z1);
      var X1 = z0[0];
      var Y1 = z0[1];
      var X2 = z1[0];
      var Y2 = z1[1];
      var Rx = this.Rx;
      var Ry = this.Ry;
      var Phi = 0;
      if (this.sweepflag) {
        ///NOTE: note that the arcpath() always assumes anti-clockwise. So if we are
        ///drawing clockwise we just need to swap the starting and end point
        ///for X1/Y1 and X2/Y2
        ///this.sweepflag=1: clockwise
        ///this.sweepflag=0: anti-clockwise
        var tmp = X1; X1 = X2; X2 = tmp;
        var tmp = Y1; Y1 = Y2; Y2 = tmp;
      } 
      var [Cx, Cy, Rx, Ry] = arcpath(X1, Y1, X2, Y2, Rx, Ry, Phi, this.bigarcflag);
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
      }
      if (this.sweepflag) {
        o.push(`${this.to_leads(g)} draw subpath (${this.fix(ang2/45)},${this.fix(ang1/45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${this.fix(Phi)}) scaled(u) shifted(${this.fix(Cx)}*u,${this.fix(Cy)}*u);`);
      } else {
        o.push(`${this.to_leads(g)} draw subpath (${this.fix(ang1/45)},${this.fix(ang2/45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${this.fix(Phi)}) scaled(u) shifted(${this.fix(Cx)}*u,${this.fix(Cy)}*u);`);
      }
    }
    return o.join('\n');
  }


  localcoords(coords) {
    var s = [];
    for( let [x,y,join,x1,y1,x2,y2,Rx,Ry,angle,bigarcflag,sweepflag] of coords ) {
      if (join=='cycle'||join=='nan') {
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
      if (join=='cycle'||join=='nan') {
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
      if (join=='cycle'||join=='nan') {
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
    /// pt[2]: ['cycle','','--','','']
    var o = [];
    var items = [];
    var iscycled = 0;
    var hints = 0;
    var s = '';
    var x0 = 0;//previous point
    var y0 = 0;
    var isnewseg = 0;
    for (var i in coords) {
      var pt = coords[i];
      var x = pt[0];/// we will do fix down below
      var y = pt[1];///
      var join = pt[2]||'';
      ///doing some fixes
      join = join || '';
      if (o.length == 0 || join== 'M') {
        if(o.length){
          iscycled = 0;
          s = o.join('');
          if(o.length>1){
            items.push({iscycled,s,hints})
          }
          o = [];
        }
        o.push(`(${this.fix(x)},${this.fix(y)})`);
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
        isnewseg = 1;
        continue;
      }
      else if (join == 'L') {
        ///NOTE: line
        o.push(`--(${this.fix(x)},${this.fix(y)})`);
        x0 = x;
        y0 = y;        
        continue;
      }
      else if (join == 'C') {
        let p1x = pt[3];/// CUBIC BEZIER curve controlpoint 1x
        let p1y = pt[4];/// CUBIC BEZIER curve controlpoint 1y
        let p2x = pt[5];/// CUBIC BEZIER curve controlpoint 2x
        let p2y = pt[6];/// CUBIC BEZIER curve controlpoint 2y
        var bezier = `..controls(${this.fix(p1x)},${this.fix(p1y)})and(${this.fix(p2x)},${this.fix(p2y)})..`;
        o.push(`${bezier}(${this.fix(x)},${this.fix(y)})`);
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
        var bezier = `..controls(${this.fix(p1x)},${this.fix(p1y)})and(${this.fix(p2x)},${this.fix(p2y)})..`;
        o.push(`${bezier}(${this.fix(x)},${this.fix(y)})`);
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
        }
        if (sweepflag) {
          o.push(`--(subpath (${this.fix(ang2/45)},${this.fix(ang1/45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))`);
        } else {
          o.push(`--(subpath (${this.fix(ang1/45)},${this.fix(ang2/45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))`);
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

  ///
  ///
  ///
  p_comment(s){
    s = s.replace(/\-\-/g,'');
    s = s.replace(/\\/g,'\\\\');
    return `% <-- ${s} -->`;
  }
  p_fill(coords,_g){
    var o = [];
    var coords = this.move_coords(coords);
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
    return o.join('\n');
  }
  p_draw(coords,_g){
    var o = [];
    var coords = this.move_coords(coords);
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
    return o.join('\n');
  }
  p_stroke(coords,_g){
    var o = [];
    var coords = this.move_coords(coords);
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
    return o.join('\n');
  }
  p_arrow(coords,_g){
    var o = [];
    var coords = this.move_coords(coords);
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
    return o.join('\n');
  }
  p_revarrow(coords,_g){
    var o = [];
    var coords = this.move_coords(coords);
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
    return o.join('\n');
  }
  p_dblarrow(coords,_g){
    var o = [];
    var coords = this.move_coords(coords);
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
    return o.join('\n');
  }
  ///
  ///line drawing
  ///
  p_line(x1,y1,x2,y2,g){
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
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
    return o.join('\n');
  }
  ///
  ///rect drawing
  ///
  p_rect(x,y,w,h,g){
    var p = this.to_q_RECT(x,y,w,h,0,0);
    return this.p_draw(p,g);
  }
  p_rrect(x,y,w,h,Dx,Dy,g){
    var p = this.to_q_RECT(x,y,w,h,Dx,Dy);
    return this.p_draw(p,g);
  }
  ///
  ///Bezier curve
  ///
  p_qbezier_line(x0,y0, x1,y1, x2,y2, g){
    [x0,y0] = this.move_xy(x0,y0);
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
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
    return o.join('\n');
  }
  p_cbezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g){
    [x0,y0] = this.move_xy(x0,y0);
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    [x3,y3] = this.move_xy(x3,y3);
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
    return o.join('\n');
  }
  ///
  ///dot and bar drawing
  ///
  p_dot_square(x,y,g){
    [x,y] = this.move_xy(x,y);
    var x = this.localx(x);    
    var y = this.localy(y);    
    ///reject points that are not within the viewport
    if(x < 0 || x > this.viewport_width){
      return;
    }
    if(y < 0 || y > this.viewport_height){
      return;
    }
    ///***NOTE that drawdot cannot use shifted or scaled command
    ///   because there is no path before it
    let r2 = this.to_dotsize_diameter(g);
    let r = r2 * 0.5;
    return(`fill unitsquare scaled(${r2}) shifted(${-r},${-r}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
  }
  p_dot_circle(x,y,g){
    [x,y] = this.move_xy(x,y);
    var x = this.localx(x);    
    var y = this.localy(y);    
    ///reject points that are not within the viewport
    if(x < 0 || x > this.viewport_width){
      return;
    }
    if(y < 0 || y > this.viewport_height){
      return;
    }
    ///***NOTE that drawdot cannot use shifted or scaled command
    ///   because there is no path before it
    let r2 = this.to_dotsize_diameter(g);
    return(`fill fullcircle scaled(${r2}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
  }
  p_dot_pie(x,y,start_a,span_a,g){
    [x,y] = this.move_xy(x,y);
    var x = this.localx(x);    
    var y = this.localy(y);    
    ///reject points that are not within the viewport
    if(x < 0 || x > this.viewport_width){
      return '';
    }
    if(y < 0 || y > this.viewport_height){
      return '';
    }
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
    Rx = Math.max(r,this.MIN);
    Ry = Math.max(r,this.MIN);
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
        return(`fill (${mypath}) scaled(${r2}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
      } else {
        let mypath = `(${this.fix(Cx)},${this.fix(Cy)})--(${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang1 / 45)},${this.fix(ang2 / 45)}) of fullcircle)--cycle`;
        let r2 = this.to_dotsize_diameter(g);
        return(`fill (${mypath}) scaled(${r2}) shifted(${x}*u,${y}*u) ${this.g_to_mp_dotcolor(g)};`);
      }
    }
    return o.join('\n')
  }
  p_lhbar(x,y,g){
    [x,y] = this.move_xy(x,y);
    var o = [];
    var delta_x = this.g_to_barlength_float(g)/2;
    var mypath = `(${this.fix(x)},${this.fix(y)})--(${this.fix(x-delta_x)},${this.fix(y)})`;
    o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
    return o.join('\n');
  }
  p_rhbar(x,y,g){
    [x,y] = this.move_xy(x,y);
    var o = [];
    var delta_x = this.g_to_barlength_float(g)/2;
    var mypath = `(${this.fix(x)},${this.fix(y)})--(${this.fix(x+delta_x)},${this.fix(y)})`;
    o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
    return o.join('\n');
  }
  p_tvbar(x,y,g){
    [x,y] = this.move_xy(x,y);
    var o = [];
    var delta_y = this.g_to_barlength_float(g)/2;
    var mypath = `(${this.fix(x)},${this.fix(y)})--(${this.fix(x)},${this.fix(y+delta_y)})`;
    o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
    return o.join('\n');
  }
  p_bvbar(x,y,g){
    [x,y] = this.move_xy(x,y);
    var o = [];
    var delta_y = this.g_to_barlength_float(g)/2;
    var mypath = `(${this.fix(x)},${this.fix(y)})--(${this.fix(x)},${this.fix(y-delta_y)})`;
    o.push(`${this.to_leads(g)} draw (${mypath}) scaled(u) ${this.to_draws(g)};`);
    return o.join('\n');
  }
  ///
  ///draw text label
  ///
  p_label(x,y,txt,ta,g){
    [x,y] = this.move_xy(x,y);
    ///then we convert to local
    x = this.localx(x);
    y = this.localy(y);
    var fontsize = this.g_to_fontsize_float(g);
    fontsize = this.scale_dist(fontsize);
    var math = this.g_to_math_int(g);
    if(1){
      txt=txt||'';
      var fs = `${fontsize}pt`;
      if (math==1) {
        let style = {};
        var s = this.translator.literal_to_math(g,txt);
        var s = `\\switchtobodyfont[${fs}]${s}`;
      } else {
        var s = this.translator.flatten(g,txt);
        var s = `\\switchtobodyfont[${fs}]${s}`
      }
      var textext = s;
    }
    if(0){
      // old way of doing things, 
      if(ta=='ctr'){
        var myopt = '';
      }
      else if(ta.length && this.is_valid_ta(ta)){
        var myopt = `.${ta}`;
      }
      else {
        var myopt = `.urt`;
      }
      return(`label${myopt} (${tex_label}, (${this.fix(x)}*u,${this.fix(y)}*u)) ${this.to_texts(g)};`);
    }else{
      // now we will switch to using textext, allowing us to rotate text as well
      let factor = fontsize/this.translator.tokenizer.fs;
      var rotate = this.g_to_rotate_float(g);
      var math_gap = this.translator.tokenizer.math_gap;
      var math_fh = this.translator.tokenizer.fh;
      var half_fh = math_fh/2*factor;
      var o = [];
      o.push(`picture one; one := textext("${textext}");`);
      o.push(`numeric halfw; halfw := bbwidth(one)/2 + ${math_gap}pt;`);
      //o.push(`numeric halfh; halfh := ${this.fix(half_fh)}pt;`);
      o.push(`numeric halfh; halfh := bbheight(one)/2 ;`);
      if(ta.length==0){
        ta = 'urt';
      }
      switch(ta){
        case 'ctr':
          o.push(`draw one shifted (0,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
        case 'rt':
          o.push(`draw one shifted (halfw,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
        case 'urt':
          o.push(`draw one shifted (halfw,halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
        case 'lrt':
          o.push(`draw one shifted (halfw,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
        case 'lft':
          o.push(`draw one shifted (-halfw,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
        case 'ulft':
          o.push(`draw one shifted (-halfw,halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
        case 'llft':
          o.push(`draw one shifted (-halfw,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
        case 'top':
          o.push(`draw one shifted (0,+halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
        case 'bot':
          o.push(`draw one shifted (0,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
          break;
      }
      var text = o.join('\n');
      return text;
    }
  }
  p_math(x,y,txt,ta,g){
    [x,y] = this.move_xy(x,y);
    ///then we convert to local
    x = this.localx(x);
    y = this.localy(y);
    var fontsize = this.g_to_fontsize_float(g);
    fontsize = this.scale_dist(fontsize);
    var math = this.g_to_math_int(g);
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
      ta = 'urt';
    }
    switch(ta){
      case 'ctr':
        o.push(`draw one shifted (0,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'rt':
        o.push(`draw one shifted (halfw,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'urt':
        o.push(`draw one shifted (halfw,halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'lrt':
        o.push(`draw one shifted (halfw,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'lft':
        o.push(`draw one shifted (-halfw,0) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'ulft':
        o.push(`draw one shifted (-halfw,halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'llft':
        o.push(`draw one shifted (-halfw,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'top':
        o.push(`draw one shifted (0,+halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
      case 'bot':
        o.push(`draw one shifted (0,-halfh) rotated (${rotate}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) ${this.to_texts(g)};`);
        break;
    }
    var text = o.join('\n');
    return text;
  }
  p_text(x,y,txt,ta,g) {
    [x,y] = this.move_xy(x,y);
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontfamily = this.g_to_contex_fontfamily_switch(g);
    var fontstyle = this.g_to_contex_fontstyle_switch(g);
    var fontsize = this.g_to_fontsize_float(g);
    fontsize = this.scale_dist(fontsize);
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
    var o = [];
    o.push(`numeric fh; fh := ${fontsize}pt;`);
    o.push('picture pic[];')
    ss.forEach((s,j,arr) => {
      o.push(`pic[${j+1}] := textext("${s}");`)
    });
    if(ta.length==0){
      ta = "urt";
    }
    if(ta=='top'||ta=='ulft'||ta=='urt'){
      //TODO: need to reverse pic
      var n = ss.length;
      var dy = 0.5 + (n-1);
      ss.forEach((s,j,arr) => {
        if(ta=='ulft'){
          var dx = -0.5;
        }else if(ta=='urt'){
          var dx = +0.5;
        }else{
          var dx = 0;
        }
        o.push(`draw pic[${j+1}] shifted (${dx}*bbwidth(pic[${j+1}]),${dy}*fh) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
        dy -= 1;
      })
    }else if(ta=='bot'||ta=='llft'||ta=='lrt'){
      var dy = -0.5;
      ss.forEach((s,j,arr) => {
        if(ta=='llft'){
          var dx = -0.5;
        }else if(ta=='lrt'){
          var dx = +0.5;
        }else{
          var dx = 0;
        }
        o.push(`draw pic[${j+1}] shifted (${dx}*bbwidth(pic[${j+1}]),${dy}*fh) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
        dy -= 1;
      })
    }else if(ta=='ctr'||ta=='lft'||ta=='rt'){
      var dy = 0;
      var n = ss.length;
      dy = +(n-1)*0.5;
      ss.forEach((s,j,arr) => {
        if(ta=='lft'){
          var dx = -0.5;
        }else if(ta=='rt'){
          var dx = +0.5;
        }else{
          var dx = 0;
        }
        o.push(`draw pic[${j+1}] shifted (${dx}*bbwidth(pic[${j+1}]),${dy}*fh) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
        dy -= 1;
      })
    }
    return o.join('\n')
  }
  p_cairo(x,y,txt,extent,g){
    [x,y] = this.move_xy(x,y);
    var txt = this.translator.uncode(g,txt);
    var width = extent*this.viewport_unit;
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontsize = this.g_to_fontsize_float(g);
    fontsize = this.scale_dist(fontsize);
    if(!fontsize){
      fontsize = this.fontsize;
    }
    if(!fontcolor){
      fontcolor = 'black';
    }
    fontcolor = this.string_to_mp_color(fontcolor,g.hints); 
    ///the 's0' here is to turnoff the leading space before the 1st column
    //var txt = `\\hbox{\\starttable[s0|p(${width}mm)|]\\NC{${txt}}\\MR\\stoptable}`;
    var txt = `\\switchtobodyfont[${fontsize}pt]\\framed[frame=off,width=${width}mm,align=flushleft]{${txt}}`;
    var o = [];
    o.push(`picture one; one := textext("\\switchtobodyfont[${fontsize}pt]${txt}");`)
        //o.push(`draw pic[${j+1}] shifted (${dx}*bbwidth(pic[${j+1}]),${dy}*fh) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
    o.push(`draw one shifted (0.5*bbwidth(one),-0.5*bbheight(one)) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`)
    return o.join('\n');
  }
  p_slopedtext(x1,y1,x2,y2,txt,ta,g){
    [x1,y1] = this.move_xy(x1,y1);
    [x2,y2] = this.move_xy(x2,y2);
    /*
    picture one; one := textext("{\switchtobodyfont[8pt]Hello}") (withcolor black);
    draw one shifted (0,bbwidth(one)) rotated (45) shifted (3*u,3*u);
    */
    if(!txt) return '';
    var d = [];
    if(ta=='bot'){
      d.push(`opacity=1, pos=0.5, below, sloped`);
    }else{
      d.push(`opacity=1, pos=0.5, above, sloped`);
    }
    var fontcolor = this.g_to_fontcolor_string(g);
    var fontfamily = this.g_to_contex_fontfamily_switch(g);
    var fontstyle = this.g_to_contex_fontstyle_switch(g);
    var fontsize = this.g_to_fontsize_float(g);
    fontsize = this.scale_dist(fontsize);
    if(!fontcolor){
      fontcolor = 'black';
    }
    fontcolor = this.string_to_mp_color(fontcolor,g.hints); 
    //let fs = this.g_to_mp_font_attr(g);
    //d.push(`font=${fs}`);
    var s = this.translator.flatten(g,txt);
    if(fontsize){
      s = `\\switchtobodyfont[${fontsize}pt]${s}`        
    }else{
      s = `\\switchtobodyfont[${this.fontsize}pt]${s}`        
    }
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
      if(ta=='bot'){
        //'bot'
        o.push(`draw one shifted (0,-bbheight(one)) rotated (${this.fix(ang)}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`);
      }else{
        //'top'
        o.push(`draw one shifted (0,+bbheight(one)) rotated (${this.fix(ang)}) shifted (${this.fix(x)}*u,${this.fix(y)}*u) withcolor ${fontcolor};`);
      }
    }
    return o.join('\n')
  }
  ///
  ///circle, ellipse, arc, and pie
  ///
  p_circle(x,y,r,g){
    [x,y] = this.move_xy(x,y);
    r = this.scale_dist(r);
    var o = [];
    if (this.has_fills(g)){
      o.push(`fill fullcircle scaled(${this.fix(r*2)}) shifted(${this.fix(x)},${this.fix(y)}) scaled(u) ${this.to_fills(g)};`);
    } 
    if (this.has_strokes(g)){
      o.push(`${this.to_leads(g)} draw fullcircle scaled(${this.fix(r*2)}) shifted(${this.fix(x)},${this.fix(y)}) scaled(u) ${this.to_draws(g)};`);
    }
    return o.join('\n');
  }
  p_ellipse(x,y,Rx,Ry,angle,g){
    [x,y] = this.move_xy(x,y);
    Rx = this.scale_dist(Rx);
    Ry = this.scale_dist(Ry);
    var o = [];
    /// x,y,angle,rx,ry
    var x1 = x + Rx * Math.cos(angle/180*Math.PI);
    var y1 = y + Rx * Math.sin(angle/180*Math.PI);
    var x2 = x - Rx * Math.cos(angle/180*Math.PI);
    var y2 = y - Rx * Math.sin(angle/180*Math.PI);
    x1 = this.localx(x1);
    y1 = this.localy(y1);
    x2 = this.localx(x2);
    y2 = this.localy(y2);
    ///GETTING ready to compute the 
    var X1 = x1;
    var Y1 = y1;
    var X2 = x2;
    var Y2 = y2;
    var Phi = angle;
    var Cx = x;
    var Cy = y;
    ///THE following steps are to calculate the ang1/ang2 which is the perimetric angle
    ///which is needed for the 'subpath' of MP
    var lambda1 = Math.atan2(Y1 - Cy, X1 - Cx);
    var lambda2 = Math.atan2(Y2 - Cy, X2 - Cx);
    lambda2 -= Phi / 180 * Math.PI;
    lambda1 -= Phi / 180 * Math.PI;
    var tao1 = Math.atan2(Math.sin(lambda1) / Ry, Math.cos(lambda1) / Rx);
    var tao2 = Math.atan2(Math.sin(lambda2) / Ry, Math.cos(lambda2) / Rx);
    var ang1 = this.to360(tao1 / Math.PI * 180);
    var ang2 = this.to360(tao2 / Math.PI * 180);
    if (ang2 < ang1) { ang2 += 360; }
    if (this.has_fills(g)){
      o.push(`fill fullcircle xscaled(${this.fix(2*Rx)}*u) yscaled(${this.fix(2*Ry)}*u) rotated(${this.fix(Phi)}) shifted(${this.fix(Cx)}*u,${this.fix(Cy)}*u) ${this.to_fills(g)};`);
    }
    o.push(`${this.to_leads(g)} draw fullcircle xscaled(${this.fix(2*Rx)}*u) yscaled(${this.fix(2*Ry)}*u) rotated(${this.fix(Phi)}) shifted(${this.fix(Cx)}*u,${this.fix(Cy)}*u) ${this.to_draws(g)};`);
    return o.join('\n'); 
  }
  p_arc(cx,cy,r,start_a,span_a,g){
    [cx,cy] = this.move_xy(cx,cy);
    r = this.scale_dist(r);
    var o = [];
    var X1 = cx + r*Math.cos(start_a/180*Math.PI);
    var Y1 = cy + r*Math.sin(start_a/180*Math.PI);
    var X2 = cx + r*Math.cos((start_a+span_a)/180*Math.PI);
    var Y2 = cy + r*Math.sin((start_a+span_a)/180*Math.PI);
    var Phi = 0;
    var sweepflag = 0;
    var bigarcflag = 0;
    Rx = Math.max(r,this.MIN);
    Ry = Math.max(r,this.MIN);
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
    }
    var x0 = X1;
    var y0 = Y1;
    if (sweepflag) {
      o.push(`${this.do_leads(g)} draw ((${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang2 / 45)},${this.fix(ang1 / 45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))) scaled(u) ${this.to_draws(g)};`);
    } else {
      o.push(`${this.to_leads(g)} draw ((${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang1 / 45)},${this.fix(ang2 / 45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))) scaled(u) ${this.to_draws(g)};`);
    }
    return o.join('\n')
  }
  p_pie(cx,cy,r,start_a,span_a,g){
    [cx,cy] = this.move_xy(cx,cy);
    r = this.scale_dist(r);
    var o = [];
    var X1 = cx + r*Math.cos(start_a/180*Math.PI);
    var Y1 = cy + r*Math.sin(start_a/180*Math.PI);
    var X2 = cx + r*Math.cos((start_a+span_a)/180*Math.PI);
    var Y2 = cy + r*Math.sin((start_a+span_a)/180*Math.PI);
    var Phi = 0;
    var sweepflag = 0;
    var bigarcflag = 0;
    Rx = Math.max(r,this.MIN);
    Ry = Math.max(r,this.MIN);
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
        if (this.has_fills(g)){
          o.push(`fill ((${this.fix(Cx)},${this.fix(Cy)})--(${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang2 / 45)},${this.fix(ang1 / 45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))--cycle) scaled(u) ${this.to_fills(g)};`);
        }
        if (this.has_strokes(g)){
          o.push(`${this.do_leads(g)} draw ((${this.fix(Cx)},${this.fix(Cy)})--(${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang2 / 45)},${this.fix(ang1 / 45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))--cycle) scaled(u) ${this.to_draws(g)};`);
        }
      } else {
        if (this.has_fills(g)){
          o.push(`fill ((${this.fix(Cx)},${this.fix(Cy)})--(${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang1 / 45)},${this.fix(ang2 / 45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))--cycle) scaled(u) ${this.to_fills(g)};`);
        }
        if (this.has_strokes(g)){
          o.push(`${this.to_leads(g)} draw ((${this.fix(Cx)},${this.fix(Cy)})--(${this.fix(x0)},${this.fix(y0)})--(subpath (${this.fix(ang1 / 45)},${this.fix(ang2 / 45)}) of fullcircle xscaled(${this.fix(2*Rx)}) yscaled(${this.fix(2*Ry)}) rotated(${Phi}) shifted(${this.fix(Cx)},${this.fix(Cy)}))--cycle) scaled(u) ${this.to_draws(g)};`);
        }
      }
    }
    return o.join('\n')
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
    var s = g.fontfamily||'';
    var s = this.string_to_contex_fontfamily_switch(s);
    return s;
  }
  g_to_contex_fontstyle_switch(g){
    var s = g.fontstyle||'';
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
      ss = this.string_to_array(g.shadecolor)
    }
    ss = ss.map(s => this.string_to_mp_color(s,g.hints));
    let opacity = this.g_to_opacity_float(g);
    if(opacity < 1){
      ss = ss.map(s => `transparent(1,${opacity},${s})`);
    }
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
    if (linecolor) {
      o.push(`withcolor ${this.string_to_mp_color(linecolor,g.hints)}`);
    }
    return o.join(' ');
  }
  to_shadeonlys(g,isinherit) {
    var d = [];
    var angle = this.g_to_angle_float(g);//between 0-90
    var shade = this.g_to_shade_string(g);
    var ss = this.to_mp_shadecolor_ss(g);
    if (shade=='linear') {
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
    }else if (shade=='radial'){
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
    }
    return d.join(' ');
  }
  to_fills(g) {
    let fillcolor = this.g_to_fillcolor_string(g);
    let opacity = this.g_to_opacity_float(g);
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
  to_mp_vbarchart (g) {
    ///
    /// vbarchart
    ///
    // *** \vbarchart{20;10;0.2,0.8,0.6,0.4,1.0}
    //
    //  \begin{mplibcode}
    //  beginfig(1)
    //  linecap := butt;
    //  linejoin := mitered;
    //  w := 20mm;
    //  h := 10mm;
    //  draw ((0,0)--(0.2,0)--(0.2,0.2)--(0,0.2)--cycle)     xscaled(w) yscaled(h) ;
    //  draw ((0.2,0)--(0.4,0)--(0.4,0.8)--(0.2,0.8)--cycle) xscaled(w) yscaled(h) ;
    //  draw ((0.4,0)--(0.6,0)--(0.6,0.6)--(0.4,0.6)--cycle) xscaled(w) yscaled(h) ;
    //  draw ((0.6,0)--(0.8,0)--(0.8,0.4)--(0.6,0.4)--cycle) xscaled(w) yscaled(h) ;
    //  draw ((0.8,0)--(1,0)--(1,1.0)--(0.8,1.0)--cycle)     xscaled(w) yscaled(h) ;
    //  endfig
    //  \end{mplibcode}
    //
    var o = [];
    var w = g.width;
    var h = g.height;
    var data = g.data;
    if(w && h && data){
      var data = data.split(',');
      var data = data.map(x => x.trim());
      o.push(`w := ${w}mm;`);
      o.push(`h := ${h}mm;`);
      o.push(`${this.to_leads(g)} draw (0,0)--(1,1) xscaled(w) yscaled(h) withcolor white;`);
      for(var j=0; j < data.length; j++){
        var num=data[j];
        var gap=1/data.length;
        var x1=j*gap;
        var x2=(j+1)*gap;
        var y1=0;
        var y2=data[j];
        o.push(`${this.to_leads(g)} draw ((${this.fix(x1)},${this.fix(y1)})--(${this.fix(x2)},${this.fix(y1)})--(${this.fix(x2)},${this.fix(y2)})--(${this.fix(x1)},${this.fix(y2)})--cycle) xscaled(w) yscaled(h) ;`);
      }
    }
    var s = o.join('\n');
    return s;
  }
  to_mp_colorbox (g) {
    ///
    /// colorbox
    /// 
    var o = [];
    var width = g.width;
    var height = g.height;
    var data = g.data;
    o.push(`fill unitsquare xscaled(${width}mm) yscaled(${height}mm) withcolor ${this.string_to_mp_color(data,g.hints)};`);
    return o.join('\n');
  }
  to_mp_xyplot(g){
    ///
    /// xyplot   
    ///
    // *** \xyplot{0.2,0.2,0.3,0.3,0.4,0.4;20;10}
    //
    //  \begin{mplibcode}
    //  beginfig(1)
    //  linecap := butt;
    //  linejoin := mitered;
    //  w := 20mm;
    //  h := 10mm;
    //  fill fullcircle scaled(2) shifted(0.2,0.2) scaled(u) ;`);
    //  fill fullcircle scaled(2) shifted(0.3,0.3) scaled(u) ;`);
    //  fill fullcircle scaled(2) shifted(0.4,0.4) scaled(u) ;`);
    //  endfig
    //  \end{mplibcode}
    //
    var o = [];
    var p_circledot=1;
    var p_interline=2;
    var w = g.width;
    var h = g.height;
    var data = g.data;  
    var p = g.extra;
    if(w && h && data){
      var data = data.split(',');
      var data = data.map(x => x.trim());
      var data = data.map(x => parseFloat(x));
      var data = data.filter(x => Number.isFinite(x));
      if(p&p_interline){
        var ldata = data.slice(0,4);
        data = data.slice(4);
      }else{
        var ldata=[];
      }
      o.push(`w := ${w}mm;`);
      o.push(`h := ${h}mm;`);
      o.push(`${this.to_leads(g)} draw (0,0)--(1,1) xscaled(w) yscaled(h) withcolor white;`);
      for(var j=0; j < data.length; j+=2){
        var x=data[j];
        var y=data[j+1];
        if(p&p_circledot){
          o.push(`${this.to_leads(g)} draw fullcircle scaled(2) shifted(${this.fix(x)}*w,${this.fix(y)}*h) ;`);
        }else{
          o.push(`fill fullcircle scaled(2) shifted(${this.fix(x)}*w,${this.fix(y)}*h) ;`);
        }
      }
      ///draw interline
      if(ldata.length==4){
        var x1=ldata[0];
        var y1=ldata[1];
        var x2=ldata[2];
        var y2=ldata[3];
        o.push(`${this.to_leads(g)} draw ((${x1},${y1})--(${x2},${y2})) xscaled(w) yscaled(h) ;`);
      }
    }
    return o.join('\n');
  }
  to_dotsize_diameter(g) {
    if (g.dotsize) {
      var d = parseFloat(g.dotsize);
      if(Number.isFinite(d)){
        return (d);
      }
    } 
    return parseFloat(this.dotsize);
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
    var fontsize = this.g_to_fontsize_string(g);
    if(parseFloat(fontsize)){
      return `{\\switchtobodyfont[${fontsize}pt]${s}}`;
    }else{
      return `{\\switchtobodyfont[12pt]${s}}`;
    }
  }
  string_to_mp_color(s,hints) {
    if (!s) {
      s = 'black';
    } 
    if (s === 'currentColor'){
      s = 'black';
    }
    if (typeof s === 'string') {
      s = this.string_to_hexcolor(s,hints);
      s = s.slice(1);//remove leading number-sign
      s = this.hexcolor_to_mf_color(s);
      return s;
    } 
    else {
      return 'black';
    }
  }
  ///
  ///
  ///
  to_ink(style,ss){
    var npara = ss.length;
    var vw = this.assert_int(style.framewidth,600);
    var vh = this.assert_int(style.frameheight,0);
    var gap = 2;
    if(vh==0){
      if(vh < npara*12){;
        vh = npara*12;//12pt font
      }
      vh = vh + gap + gap;///top and bottom paddings
    }
    var o = [];
    o.push(`\\startMPcode`);
    o.push(`numeric u; u := 1pt;`);
    o.push(`numeric vw; vw := ${vw}pt;`);
    o.push(`numeric vh; vh := ${vh}pt;`)
    o.push(`draw (0,0)--(vw*u,vh*u) withpen pencircle withcolor white;`);
    ss.forEach((s,i,arr) => {
      s = this.translator.polish_verb(style,s);
      o.push(`picture one; one := textext("\\tt\\switchtobodyfont[12pt]${s}");`);
      o.push(`numeric halfw; halfw := bbwidth(one)/2;`);
      let j = arr.length - i - 1;
      o.push(`draw one shifted (halfw,${j*12+6}*u) shifted (${gap+gap}*u,${gap}*u) ${this.to_texts(style)};`);
    });
    o.push(`numeric textwidth; textwidth := \\the\\textwidth;`);
    o.push(`numeric textheight; textheight := bbheight(currentpicture);`);
    o.push(`clip currentpicture to unitsquare xscaled (vw) yscaled (textheight);`);
    o.push(`numeric ratio_w; ratio_w := 1;`)
    o.push(`numeric ratio_h; ratio_h := 1;`)
    if (style && style.width && style.height){
      let wd = style.width;
      let wd_percent = this.string_to_percentage(wd);
      if (wd_percent) {
        o.push(`textwidth := textwidth*${wd_percent};`);
        o.push(`ratio_w := textwidth/vw;`);  
      } else {
        o.push(`textwidth := ${wd};`)
        o.push(`ratio_w := textwidth/vw;`);  
      }
      let ht = style.height;
      let ht_percent = this.string_to_percentage(ht);
      if (ht_percent) {
        //do nothing
        o.push(`ratio_h := ratio_w;`);
      }else{
        o.push(`textheight := ${ht};`);
        o.push(`ratio_h := textheight/vh;`)
      }
      o.push(`currentpicture := currentpicture xscaled ratio_w yscaled ratio_h;`)
    } else if (style && style.width) {
      ///width-only
      let wd = style.width;
      let wd_percent = this.string_to_percentage(wd);
      if (wd_percent) {
        o.push(`textwidth := textwidth*${wd_percent};`);
        o.push(`ratio_w := textwidth/vw;`);  
      } else {
        o.push(`textwidth := ${wd};`)
        o.push(`ratio_w := textwidth/vw;`);  
      }
      o.push(`currentpicture := currentpicture scaled ratio_w;`)
    }
    if(style.frame){
      o.push(`path bb ; bboxmargin := 0pt ; bb := bbox currentpicture ;`);
      o.push(`draw bb withpen pencircle scaled 0.5pt withcolor black ;`);
    }
    o.push(`\\stopMPcode`);
    var text = o.join('\n');
    return {text,vw,vh};
  }
}
module.exports = { NitrilePreviewDiagramMF };
