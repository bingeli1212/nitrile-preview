'use babel';

const { NitrilePreviewDiagram } = require('./nitrile-preview-diagram');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { arcpath } = require('./nitrile-preview-arcpath');
const my_svglabel_dx = 4;///hardcoded for moving horizontally away from the anchor point in px
const my_svglabel_dy = 2;///hardcoded for moving vertically away from the anchor point in px

class NitrilePreviewDiagramSVG extends NitrilePreviewDiagram {

  constructor(translator) {
    super(translator);
    this.tokenizer = new NitrilePreviewTokenizer(translator);
    this.re_unit = /^(\d+)mm$/;
    this.re_inlinemath = /^\`\`(.*)\`\`$/;
    this.is_dia = 0;
    this.my_clipath_id = 0;
    this.my_defs_id = 0;
    this.my_smallgrid_id = 0;
    this.debug_no = 0;
    this.my_lineargradient_array = [];
    this.my_radialgradient_array = [];
  }


  do_setup () {
    /// generate viewBox
    var v = null;
    var u = 3.78*this.viewport_unit;///this.viewport_unit is always in mm
    var vw = u*this.viewport_width;
    var vh = u*this.viewport_height;
    this.u = u;
    this.vw = vw;
    this.vh = vh;
  }
  do_finalize(text,style) {
    var o = [];
    ///GENERATE grids
    var u = this.u;
    var vw = this.vw;
    var vh = this.vh;
    var smallgridid = ++this.my_smallgrid_id;
    var smallgridid = `smallgrid${smallgridid}`;
    o.push('<defs>');
    o.push(`<pattern id="${smallgridid}" width="${u}" height="${u}" patternUnits="userSpaceOnUse"><path d="M ${u} 0 L 0 0 0 ${u}" fill="none" stroke="currentColor" stroke-width="0.3" /></pattern>`);
    o.push(`<marker id='markerArrow' markerWidth='3' markerHeight='4' refX='3' refY='2' orient='auto'> <path d='M0,0 L3,2 L0,4 z' stroke='none' fill='context-stroke'/> </marker>`);
    o.push(`<marker id='startArrow'  markerWidth='3' markerHeight='4' refX='0' refY='2' orient='auto'> <path d='M3,0 L3,4 L0,2 z' stroke='none' fill='context-stroke'/> </marker>`);
    this.my_lineargradient_array.forEach(p => {
      /*
        <linearGradient id="Gradient1" x1='' y1='' x2='' y2=''>
        <stop offset="0%" stop-color="yellow"/>
        <stop offset="50%" stop-color="blue" />
        <stop offset="100%" stop-color="red" />
        </linearGradient>
      */
      if(p.ss.length==0){
        o.push(`<linearGradient id="${p.id}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"> <stop offset="0%" stop-color="white"/> <stop offset="100%" stop-color="black"/> </linearGradient>`);
      }else if(p.ss.length==1){
        o.push(`<linearGradient id="${p.id}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="100%" stop-color="black"/> </linearGradient>`);
      }else if(p.ss.length==2){
        o.push(`<linearGradient id="${p.id}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="100%" stop-color="${p.ss[1]}"/> </linearGradient>`);
      }else{
        o.push(`<linearGradient id="${p.id}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="50%" stop-color="${p.ss[1]}"/> <stop offset="100%" stop-color="${p.ss[2]}"/> </linearGradient>`);
      }
    });
    this.my_radialgradient_array.forEach(p => {
      /*
        <radialGradient id="RadialGradient1">
        <stop offset="0%" stop-color="red"/>
        <stop offset="100%" stop-color="blue"/>
        </radialGradient>
      */
      if(p.ss.length==0){
        o.push(`<radialGradient id="${p.id}" cx="${p.cx}" cy="${p.cy}" fx="${p.fx}" fy="${p.fy}" r="${p.r}"> <stop offset="0%" stop-color="white"/> <stop offset="100%" stop-color="black"/> </radialGradient>`);
      }else if(p.ss.length==1){
        o.push(`<radialGradient id="${p.id}" cx="${p.cx}" cy="${p.cy}" fx="${p.fx}" fy="${p.fy}" r="${p.r}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="100%" stop-color="black"/> </radialGradient>`);
      }else{
        ///for radial there can only be two color choices
        o.push(`<radialGradient id="${p.id}" cx="${p.cx}" cy="${p.cy}" fx="${p.fx}" fy="${p.fy}" r="${p.r}"> <stop offset="0%" stop-color="${p.ss[0]}"/> <stop offset="100%" stop-color="${p.ss[1]}"/> </radialGradient>`);
      }
    });
    o.push('</defs>');
    o.push(`<rect width="${this.fix(vw)}" height="${this.fix(vh)}" stroke="currentColor" stroke-width="0.3" fill="url(#${smallgridid})" />`);
    o.push(text);    
    var text = o.join('\n');
    var width = ''
    var height = ''
    var css_style = [];
//    css_style.push(`color:black`);
//    css_style.push(`background-color:white`)
    text = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='currentColor' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' width='${this.fix(vw)}' height='${this.fix(vh)}' preserveAspectRatio='none' >${text}</svg>`;
    width=`${vw}px`
    height=`${vh}px`;
    return {s:text,width,height};
  }
  
  do_comment(s) {
    s = s.replace(/\-\-/g,'');
    s = s.replace(/\\/g,'\\\\');
    s = this.translator.smooth(s);
    return `<!-- ${s} -->`;
  }

  localline(x1,y1,x2,y2) {
    /// * NOTE: this method translate and/or scale the local reference point to
    ///   SVG coords.
    ///
    x1 = this.localx(x1);
    y1 = this.localy(y1);
    x2 = this.localx(x2);
    y2 = this.localy(y2);
    return [x1,y1,x2,y2];
  }

  localx(x) {
    /// * NOTE: this method translate and/or scale the local reference point to
    ///   SVG coords.
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
    ///   SVG coords.
    ///
    y = this.viewport_height-y;
    y *= this.u;
    return y;
  }

  localpt(pt) {
    /// * NOTE: this method translate and/or scale the local reference point to
    ///   SVG coords.
    ///
    let [x,y] = pt;;
    x = this.localx(x);
    y = this.localy(y);
    return [x,y];
  }

  string_to_color_name(s) {
    if (!s) {
      return 'none';
    } 
    else if (typeof s === 'string' && s[0] == '#') {
      s = s.slice(1);
      return this.webrgb_to_svgrgb_s(s);
    }
    else if (typeof s === 'string') {
      return s;
    } 
    else {
      return 'none';
    }
  }
  to_textdraw_str(g) {
    var d = [];
    var fontcolor = this.get_string_prop(g,'fontcolor','');
    if (fontcolor) {
      d.push(`fill='${this.string_to_color_name(fontcolor)}'`);
    }
    d.push(`stroke='none'`);
    return d.join(' ');
  }
  do_drawarc(opt,txt,ts,g,coords){
    ///this functionality has been incorporated into 'line' , with [a:Rx,Ry,Phi,bigf,sweepf,X1,Y1]
    var s = [];
    for (var i = 1; i < coords.length; ++i) {
      var z0 = this.point(coords, i - 1);
      var z1 = this.point(coords, i);
      if(!this.isvalidpt(z0)) continue;
      if(!this.isvalidpt(z1)) continue;
      var X1 = z0[0];
      var Y1 = z0[1];
      var X2 = z1[0];
      var Y2 = z1[1];
      var Rx = this.Rx;
      var Ry = this.Ry;
      var Phi = this.rotation;
      ///NOTE: we need to switch X1/Y1 and X2/Y2 position
      /// so that X1 is always on the left hand side of X2
      if (0 && X1 > X2) {
        var tmp = X1; X1 = X2; X2 = tmp;
        var tmp = Y1; Y1 = Y2; Y2 = tmp;
      }
      if (this.position == 'top') {
        if (this.bigarcflag) {
          var [Cx, Cy, Rx, Ry] = arcpath(X1, Y1, X2, Y2, Rx, Ry, Phi, 0);
          if (Number.isFinite(Cx) && Number.isFinite(Cy)) {
            var lambda2 = Math.atan2(Y1 - Cy, X1 - Cx);
            var lambda1 = Math.atan2(Y2 - Cy, X2 - Cx);
            lambda2 -= Phi / 180 * Math.PI;
            lambda1 -= Phi / 180 * Math.PI;
            var tao1 = Math.atan2(Math.sin(lambda1) / Ry, Math.cos(lambda1) / Rx);
            var tao2 = Math.atan2(Math.sin(lambda2) / Ry, Math.cos(lambda2) / Rx);
            var ang1 = this.to360(tao1 / Math.PI * 180);
            var ang2 = this.to360(tao2 / Math.PI * 180);
            if (ang2 < ang1) { ang2 += 360; }
          }
        } else {
          var [Cx, Cy, Rx, Ry] = arcpath(X1, Y1, X2, Y2, Rx, Ry, Phi, 1);
          if (Number.isFinite(Cx) && Number.isFinite(Cy)) {
            var lambda2 = Math.atan2(Y1 - Cy, X1 - Cx);
            var lambda1 = Math.atan2(Y2 - Cy, X2 - Cx);
            lambda2 -= Phi / 180 * Math.PI;
            lambda1 -= Phi / 180 * Math.PI;
            var tao1 = Math.atan2(Math.sin(lambda1) / Ry, Math.cos(lambda1) / Rx);
            var tao2 = Math.atan2(Math.sin(lambda2) / Ry, Math.cos(lambda2) / Rx);
            var ang1 = this.to360(tao1 / Math.PI * 180);
            var ang2 = this.to360(tao2 / Math.PI * 180);
            if (ang2 < ang1) { ang2 += 360; }
          }
        }
      } else {
        if (this.bigarcflag) {
          var [Cx, Cy, Rx, Ry] = arcpath(X1, Y1, X2, Y2, Rx, Ry, Phi, 1);
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
        } else {
          var [Cx, Cy, Rx, Ry] = arcpath(X1, Y1, X2, Y2, Rx, Ry, Phi, 0);
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
        }
      }
      //console.log('do_drawarc: tao1=',ang1);
      //console.log('do_drawarc: tao2=',ang2);
      //console.log('do_drawarc: Cx=',Cx);
      //console.log('do_drawarc: Cy=',Cy);
      //console.log('do_drawarc: Rx=',Rx);
      //console.log('do_drawarc: Ry=',Ry);
      //console.log('do_drawarc: Phi=',Phi);
      ///NOTE: need to draw an arc 
      var points = [];
      var ds = [];
      var z0 = this.point(coords, 0);
      var x = z0[0];
      var y = z0[1];
      var bigarcflag = (this.bigarcflag)?1:0;
      var sweepflag = (this.sweepflag)?1:0;///1-clockwise;1-anticlockwise;
      ///NOTE: that X1 is always at the left hand side of X2, and
      ///we are always drawing from X1->X2. Thus, if the curve is at the top
      ///then we are drawing clockwise, thus sweepflag 1.
      ///The rotation is that the positive angle rotates clockwise.
      ///The rotation angle is always in DEGRESS
      if (1) {
        ds.push(`M${this.localx(X1)},${this.localy(Y1)}`);
      }
      if (1) {
        ds.push(`A${this.localdist(Rx)},${this.localdist(Ry)},${-Phi},${bigarcflag},${sweepflag},${this.localx(X2)},${this.localy(Y2)}`);
      }
      var d = ds.join(' ');
      s.push(`<path d='${d}' ${this.to_drawonly_str(g)} />`);
    }
    return s.join('\n');
  }

  do_drawcontrolpoints(opt,txt,ts,g,coords){    
    var s = [];
    ///NOTE: the dotsize attribute could be an empty string
    var r = this.to_dotsize_radius(g);
    var x0 = null;
    var y0 = null;
    for (var i = 0; i < coords.length    ; i++) {
      var z0 = this.point(coords, i);
      if (!this.isvalidpt(z0)) continue;
      var x = this.localx(z0[0]);
      var y = this.localy(z0[1]);
      var join = z0[2];
      if (join==='C') {
        var i3 = this.localx(z0[3]);
        var i4 = this.localy(z0[4]);
        var i5 = this.localx(z0[5]);
        var i6 = this.localy(z0[6]);
        s.push(`<circle cx='${i3}' cy='${i4}' r='${r}' ${this.to_dot_str(g)}/>`);
        s.push(`<circle cx='${i5}' cy='${i6}' r='${r}' ${this.to_dot_str(g)}/>`);
        s.push(`<rect x='${x-r}' y='${y-r}' width='${r+r}' height='${r+r}' ${this.to_dot_str(g)}/>`);
        if (typeof x0 === 'number' && typeof y0 === 'number') {
          s.push(`<rect x='${x0-r}' y='${y0-r}' width='${r+r}' height='${r+r}' ${this.to_dot_str(g)}/>`);
          x0 = null;
          y0 = null;
        }
      } if (join==='Q') {
        var i3 = this.localx(z0[3]);
        var i4 = this.localy(z0[4]);
        s.push(`<circle cx='${i3}' cy='${i4}' r='${r}' ${this.to_dot_str(g)}/>`);
        s.push(`<rect x='${x-r}' y='${y-r}' width='${r+r}' height='${r+r}' ${this.to_dot_str(g)}/>`);
        if (typeof x0 === 'number' && typeof y0 === 'number') {
          s.push(`<rect x='${x0-r}' y='${y0-r}' width='${r+r}' height='${r+r}' ${this.to_dot_str(g)}/>`);
          x0 = null;
          y0 = null;
        }
      } else {
        x0 = x;
        y0 = y;
      }
    }
    return s.join('\n');
  }

  do_rcard(opt,txt,ts,g,coords){
    var s = [];
    var w = w*this.u;
    var h = h*this.u;
    var rx = 0.2*w;
    var dx = 0.6*w;
    var ry = 0.2*h;
    var dy = 0.6*h;
    for (var i = 0; i < coords.length; i++) {
      var z0 = this.point(coords, i);
      if(!this.isvalidpt(z0)) continue;
      var x = this.localx(z0[0]);
      var y = this.localy(z0[1]);
      s.push(`<path d='M${x+rx},${y} h${dx} q${rx},${0},${rx},${-ry} v${-dy} q${0},${-ry},${-rx},${-ry} h${-dx} q${-rx},${0},${-rx},${ry} v${dy} q${rx},${0},${rx},${ry} z' ${this.to_fillonly_str(g)} />`);
      s.push(`<path d='M${x+rx},${y} h${dx} q${rx},${0},${rx},${-ry} v${-dy} q${0},${-ry},${-rx},${-ry} h${-dx} q${-rx},${0},${-rx},${ry} v${dy} q${rx},${0},${rx},${ry} z' ${this.to_drawonly_str(g)} />`);
    }
    return s.join('\n');
  }

  ticks() {
    var s = [];
    if (this.tickcolor) {
      s.push(`stroke='${this.string_to_color_name(this.tickcolor)}'`);
    } else {
      s.push(`stroke='inherit'`);
    }
    if (this.ticksize) {
      s.push(`stroke-width='${this.ticksize}'`);
    }
    return s.join(' ');
  }

  localcoords(coords) {
    var s = [];
    for( let [x,y,join,x1,y1,x2,y2] of coords ) {
      if (join=='cycle'||join=='nan') {
        s.push([x,y,join,x1,y1,x2,y2]);
      } else {
        x = this.localx(x);
        y = this.localx(y);
        x1 = this.localx(x1);
        y1 = this.localx(y1);
        x2 = this.localx(x2);
        y2 = this.localx(y2);
        s.push([x,y,join,x1,y1,x2,y2]);
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

  coordsToD(coords,multi=false) {
    ///***NOTE: returns [str,bad_vars]
    ///***NOTE: i.e: (1,2)..(2,3)--cycle
    /// pt[0]: [1,2,'','','']
    /// pt[1]: [2,3,'..','','']
    /// pt[2]: ['cycle','','--','','']
    var o = [];
    var items = [];
    var iscycled = 0;
    var d = '';
    var item = {iscycled,d};
    var x0 = 0;///last point
    var y0 = 0;
    var u = this.u;
    var isnewseg = 0;
    var pt0 = [0,0];
    var pt = [0,0];
    for (var i in coords) {
      pt0[0] = pt[0];
      pt0[1] = pt[1];
      var pt = coords[i];
      var x = this.localx(pt[0]);///NOTE:becomes SVG coords
      var y = this.localy(pt[1]);
      var join = pt[2];
      var p1x = this.localx(pt[3]);/// CUBIC BEZIER curve controlpoint 1x
      var p1y = this.localy(pt[4]);/// CUBIC BEZIER curve controlpoint 1y
      var p2x = this.localx(pt[5]);/// CUBIC BEZIER curve controlpoint 2x
      var p2y = this.localy(pt[6]);/// CUBIC BEZIER curve controlpoint 2y
      ///In case we have a CUBIC BEZIER curve, then pt1 and pt2 are the control points
      if (i == 0) {
        o.push(`M${this.fix(x)},${this.fix(y)}`);
        x0 = x;
        y0 = y;
      }
      else if (join == 'cycle') {
        o.push(`z`);
        if(multi){
          iscycled = 1;
          d = o.join(' ');
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
          d = o.join(' ');
          o = [];
          items.push({iscycled,d});
          isnewseg = 1;
        }
        continue;
      }
      else if (multi && isnewseg == 1) {
        isnewseg = 0;
        o.push(`M${this.fix(x)},${this.fix(y)}`);
        x0 = x;
        y0 = y;
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
        o.push(`L${this.fix(x)},${this.fix(y)}`);
        x0 = x;
        y0 = y;
      }
    }
    if(multi){
      if(o.length){
        iscycled = 0;
        d = o.join(' ');
        items.push({iscycled,d});
      }
      return items;
    }else{
      return o.join(' ');
    }
  }

  p_label(x, y, txt, ts, ta, g) {

    ///ts=2 math text (entire text is math)
    ///ts=1 literal text 
    ///ts=0 normal text (entities will be recognized)

    ///ta=lrt|urt|llft|ulft|top|bot...
    
    ///g={}

    ///move the label distance away
    [x,y] = this.move_label_away(x,y,ta,this.config.labeldx,this.config.labeldy);
    x += this.assert_float(g.dx,0);
    y += this.assert_float(g.dy,0);
    
    var x = this.localx(x);
    var y = this.localy(y);

    let fontsize = this.to_fontsize_str(g);

    /// (x,y) is now in SVG-coordinates. 

    /// move extra distance because of the SVG specifics
    var gapx = 0;
    var gapy = 0;
    var gapx = my_svglabel_dx;
    var gapy = my_svglabel_dy;
    var dx = 0;
    var dy = 0;
    if (ta==='lrt') {
      dx = +gapx;///NOTE:these are in SVG COORD where +y goes downwards
      dy = +gapy;
    } else if (ta==='bot') {
      dy = +gapy;
    } else if (ta==='llft') {
      dx = -gapx;
      dy = +gapy;
    } else if (ta==='urt') {
      dx = +gapx;
      dy = -gapy;
    } else if (ta==='top') {
      dy = -gapy;
    } else if (ta==='ulft') {
      dx = -gapx;
      dy = -gapy;
    } else if (ta==='rt') {
      dx = +gapx;
    } else if (ta==='lft') {
      dx = -gapx;
    } else if (ta==='ctr') {
    } else {
      //treat it as 'urt'
      dx = +gapx;
      dy = -gapy;
    }
    x += dx;
    y += dy;

    ///is it inline math or text?
    var d = [];
    if (ts==2) {
      //math text
      var fontcolor = this.get_string_prop(g,'fontcolor','');
      if(fontcolor){
        g.svgfontcolor = this.string_to_color_name(fontcolor);
      }
      var {s,w,h,defs} = this.tokenizer.to_svgmath(txt,g);
      var vw = w*1.3333;///convert to px
      var vh = h*1.3333;///convert to px
      var width = w*1.3333;
      var height = h*1.3333;
      let factor = fontsize/12;
      width *= factor;
      height *= factor;
      if (ta==='lrt') {
      } else if (ta==='bot') {
        x -= width/2;
      } else if (ta==='llft') {
        x -= width;
      } else if (ta==='urt') {
        y -= height;
      } else if (ta==='top') {
        x -= width/2;
        y -= height;
      } else if (ta==='ulft') {
        x -= width;
        y -= height;
      } else if (ta==='rt') {
        y -= height/2;
      } else if (ta==='lft') {
        x -= width;
        y -= height/2;
      } else if (ta==='ctr') {
        x -= width/2;
        y -= height/2;
      } else {
        ///treat it as 'urt'
        y -= height;
      }
      d.push(`<svg x='${x}' y='${y}' width='${width}' height='${height}' fill='inherit' stroke='inherit' viewBox='0 0 ${vw} ${vh}'><defs>${defs.join('\n')}</defs>${s}</svg>`);
    } else {
      //literal text
      if(ts==1){
        txt = this.translator.polish(txt);
      }else{
        //normal text with symbols
        txt = this.translator.smooth(txt);
      }
      var anchor = 'middle', dy='0.3em';
      if (ta==='lrt') {
        anchor = 'start', dy='0.8em';
      } else if (ta==='bot') {
        anchor = 'middle', dy='0.8em';
      } else if (ta==='llft') {
        anchor = 'end', dy='0.8em';
      } else if (ta==='urt') {
        anchor = 'start', dy='-0.2em';
      } else if (ta==='top') {
        anchor = 'middle', dy='-0.2em';
      } else if (ta==='ulft') {
        anchor = 'end', dy='-0.2em';
      } else if (ta==='rt') {
        anchor = 'start', dy='0.3em';
      } else if (ta==='lft') {
        anchor = 'end', dy='0.3em';
      } else if (ta==='ctr') {
        anchor = 'middle', dy='0.3em';
      } else {
        anchor = 'start', dy='-0.2em';
      }
      d.push(`<text font-size='${fontsize?fontsize:12}pt' text-anchor='${anchor}' ${this.to_textdraw_str(g)} x='${x}' y='${y}' dy='${dy}'>${txt}</text>`);
    }
    return d.join('\n');
  }
  p_fillclipath(_coords, g) {
    let clipath = g.clipath||''; 
    let names = clipath.split(/\s+/).map(x => x.trim()).filter(x => x.length);
    let ids = [];
    let o = [];
    names.forEach(x => {
      if(this.my_paths.has(x)){
        let path = this.my_paths.get(x);
        path = this.offset_and_scale_coords(path,this.refx,this.refy,this.refsx,this.refsy,0);
        let dd = this.coordsToD(path,true);
        let id = this.get_next_clipath_id();
        id = `clipPath${id}`;
        ids.push(id);
        o.push(`<clipPath id='${id}'>`)
        dd.forEach(d => {
          o.push(`<path d='${d.d}' />`);
        })
        o.push(`</clipPath>`)    
      }
    });
    let w = `<rect x='0' y='0' width='${this.fix(this.localdist(this.viewport_width))}' height='${this.fix(this.localdist(this.viewport_height))}' ${this.to_fillonly_str(g, 1)}/>`;
    ids.forEach(id => {
      w = `<g clip-path='url(#${id})'>${w}</g>`;
    })
    o.push(w);
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
  p_fill(coords,g){
    var items = this.coordsToD(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,d} = item;
      if(!d) continue; 
      if(iscycled){
        if(g.shade){
          o.push(`<path d='${d}' ${this.to_shadeonly_str(g)}/>`);  
        }else{
          o.push(`<path d='${d}' ${this.to_fillonly_str(g,1)}/>`);  
        }
      }else{
        o.push(`<path d='${d}' ${this.to_fillonly_str(g,1)}/>`);  
      }
    }
    return o.join('\n');
  }
  p_draw(coords,g){
    var items = this.coordsToD(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,d} = item; 
      if(!d) continue;
      if(iscycled){
        if(g.shade){
          o.push(`<path d='${d}' ${this.to_shadeonly_str(g)}/>`);
        }else{
          o.push(`<path d='${d}' ${this.to_fillonly_str(g,1)}/>`);
        }
      }
      o.push(`<path d='${d}' ${this.to_drawonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_stroke(coords,g){
    var items = this.coordsToD(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,d} = item; 
      if(!d) continue;
      o.push(`<path d='${d}' ${this.to_drawonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_arrow(coords,g){
    var items = this.coordsToD(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,d} = item; 
      if(!d) continue;
      o.push(`<path d='${d}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' />`);
    }
    return o.join('\n');
  }
  p_revarrow(coords,g){
    var items = this.coordsToD(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,d} = item; 
      if(!d) continue;
      o.push(`<path d='${d}' ${this.to_drawonly_str(g)} marker-start='url(#startArrow)' />`);
    }
    return o.join('\n');
  }
  p_dblarrow(coords,g){
    var items = this.coordsToD(coords,true);
    var o = [];
    for(var item of items){
      var {iscycled,d} = item; 
      if(!d) continue;
      o.push(`<path d='${d}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' marker-start='url(#startArrow)' />`);
    }
    return o.join('\n');
  }

  p_circle(cx, cy, r, g) {
    var o = [];
    var r = this.localdist(r);
    var cx = this.localx(cx);
    var cy = this.localy(cy);
    o.push(`<circle cx='${this.fix(cx)}' cy='${this.fix(cy)}' r='${this.fix(r)}' ${this.to_fillonly_str(g)}/>`);
    o.push(`<circle cx='${this.fix(cx)}' cy='${this.fix(cy)}' r='${this.fix(r)}' ${this.to_drawonly_str(g)}/>`);
    return o.join('\n');
  }

  p_rect(x,y,w,h,g){
    var o = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var w = this.localdist(w);
    var h = this.localdist(h);
    y = y - h;
    o.push(`<rect x='${this.fix(x)}' y='${this.fix(y)}' width='${this.fix(w)}' height='${this.fix(h)}' ${this.to_fillonly_str(g)} />`);
    o.push(`<rect x='${this.fix(x)}' y='${this.fix(y)}' width='${this.fix(w)}' height='${this.fix(h)}' ${this.to_drawonly_str(g)} />`);
    return o.join('\n');
  }

  p_line(x1,y1,x2,y2,g,arrow){
    var o = [];
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    if(arrow=='arrow'){
      o.push(`<line x1='${this.fix(x1)}' y1='${this.fix(y1)}' x2='${this.fix(x2)}' y2='${this.fix(y2)}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' />`);
    }else if(arrow=='revarrow'){
      o.push(`<line x1='${this.fix(x1)}' y1='${this.fix(y1)}' x2='${this.fix(x2)}' y2='${this.fix(y2)}' ${this.to_drawonly_str(g)} marker-start='url(#startArrow)' />`);
    }else if(arrow=='dblarrow'){
      o.push(`<line x1='${this.fix(x1)}' y1='${this.fix(y1)}' x2='${this.fix(x2)}' y2='${this.fix(y2)}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' marker-start='url(#startArrow)' />`);
    }else{
      o.push(`<line x1='${this.fix(x1)}' y1='${this.fix(y1)}' x2='${this.fix(x2)}' y2='${this.fix(y2)}' ${this.to_drawonly_str(g)} />`);
    }
    return o.join('\n');
  }

  p_qbezier_line(x0,y0, x1,y1, x2,y2, g, arrow){
    var o = [];
    var x0 = this.localx(x0);
    var y0 = this.localy(y0);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    if(arrow=='arrow'){
      o.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' />`);
    }else if(arrow=='revarrow'){
      o.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}' ${this.to_drawonly_str(g)} marker-start='url(#startArrow)' />`);
    }else if(arrow=='dblarrow'){
      o.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' marker-start='url(#startArrow)' />`);
    }else{
      o.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}' ${this.to_drawonly_str(g)} />`);
    }
    return o.join('\n');
  }
  p_cbezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g, arrow){
    var o = [];
    var x0 = this.localx(x0);
    var y0 = this.localy(y0);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var x3 = this.localx(x3);
    var y3 = this.localy(y3);
    if(arrow=='arrow'){
      o.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' />`);
    }else if(arrow=='revarrow'){
      o.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}' ${this.to_drawonly_str(g)} marker-start='url(#startArrow)' />`);
    }else if(arrow=='dblarrow'){
      o.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}' ${this.to_drawonly_str(g)} marker-end='url(#markerArrow)' marker-start='url(#startArrow)' />`);
    }else{
      o.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} C ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)},${this.fix(x3)},${this.fix(y3)}' ${this.to_drawonly_str(g)} />`);
    }
    return o.join('\n');
  }
  p_dot_square(x,y,g){
    var r = this.to_dotsize_radius(g);
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
    o.push(`<rect x='${x-r}' y='${y-r}' width='${r2}' height='${r2}' ${this.to_dot_str(g)}/>`);
    return o.join('\n');
  }
  p_dot_circle(x,y,g){
    var r = this.to_dotsize_radius(g);
    var o = [];
    if(x < 0 || x > this.viewport_width){
      return;
    }
    if(y < 0 || y > this.viewport_height){
      return;
    }
    var x = this.localx(x);
    var y = this.localy(y);
    o.push(`<circle cx='${x}' cy='${y}' r='${r}' ${this.to_dot_str(g)}/>`);
    return o.join('\n');
  }
  p_rhbar(x,y,g){
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var dx = this.to_barlength_length(g)/2;
    var x2 = x + dx;
    var X2 = this.localx(x2);
    var Y2 = this.localy(y);
    o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.to_drawonly_str(g)}/>`);
    return o.join('\n');
  }
  p_lhbar(x,y,g){
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var dx = this.to_barlength_length(g)/2;
    var x2 = x - dx;
    var X2 = this.localx(x2);
    var Y2 = this.localy(y);
    o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.to_drawonly_str(g)}/>`);
    return o.join('\n');
  }
  p_tvbar(x,y,g){
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var dy = this.to_barlength_length(g)/2;
    var X2 = this.localx(x);
    var Y2 = this.localy(y+dy);
    o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.to_drawonly_str(g)}/>`);
    return o.join('\n');
  }
  p_bvbar(x,y,g){
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var dy = this.to_barlength_length(g)/2;
    var X2 = this.localx(x);
    var Y2 = this.localy(y-dy);
    o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.to_drawonly_str(g)}/>`);
    return o.join('\n');
  }

  p_pie(cx,cy,radius,angle1,angle2,g){
    //pie       
    var x1 = cx + radius * Math.cos(angle1 / 180 * Math.PI);
    var y1 = cy + radius * Math.sin(angle1 / 180 * Math.PI);
    var x2 = cx + radius * Math.cos(angle2 / 180 * Math.PI);
    var y2 = cy + radius * Math.sin(angle2 / 180 * Math.PI);
    var diff = angle2 - angle1;
    if (diff < 0) diff += 360;
    else if (diff > 360) diff -= 360;
    if (diff > 180) {
      var bigflag = 1;
    } else {
      var bigflag = 0;
    }
    var cx = this.localx(cx);
    var cy = this.localy(cy);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var r = this.localdist(radius);
    // part of a circle
    let d = [];
    d.push(`<path d='M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${bigflag} 0 ${x2} ${y2} Z' ${this.to_fillonly_str(g)} />`);
    d.push(`<path d='M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${bigflag} 0 ${x2} ${y2} Z' ${this.to_drawonly_str(g)} />`);
    return d.join('\n');
  }

  p_chord(cx,cy,radius,angle1,angle2,g){
    //chord       
    var x1 = cx + radius * Math.cos(angle1 / 180 * Math.PI);
    var y1 = cy + radius * Math.sin(angle1 / 180 * Math.PI);
    var x2 = cx + radius * Math.cos(angle2 / 180 * Math.PI);
    var y2 = cy + radius * Math.sin(angle2 / 180 * Math.PI);
    var diff = angle2 - angle1;
    if (diff < 0) diff += 360;
    else if (diff > 360) diff -= 360;
    if (diff > 180) {
      var bigflag = 1;
    } else {
      var bigflag = 0;
    }
    var cx = this.localx(cx);
    var cy = this.localy(cy);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var r = this.localdist(radius);
    // part of a circle
    return(`<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' ${this.to_drawonly_str(g)} />`);
  }

  p_cseg(cx,cy,radius,angle1,angle2,g){
    //arc     
    var x1 = cx + radius * Math.cos(angle1 / 180 * Math.PI);
    var y1 = cy + radius * Math.sin(angle1 / 180 * Math.PI);
    var x2 = cx + radius * Math.cos(angle2 / 180 * Math.PI);
    var y2 = cy + radius * Math.sin(angle2 / 180 * Math.PI);
    var diff = angle2 - angle1;
    if (diff < 0) diff += 360;
    else if (diff > 360) diff -= 360;
    if (diff > 180) {
      var bigflag = 1;
    } else {
      var bigflag = 0;
    }
    var cx = this.localx(cx);
    var cy = this.localy(cy);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var r = this.localdist(radius);
    // part of a circle
    let d = [];
    d.push(`<path d='M ${x1} ${y1} A ${r} ${r} 0 ${bigflag} 0 ${x2} ${y2} Z' ${this.to_fillonly_str(g)} />`);
    d.push(`<path d='M ${x1} ${y1} A ${r} ${r} 0 ${bigflag} 0 ${x2} ${y2} Z' ${this.to_drawonly_str(g)} />`);
    return d.join('\n');
  }

  to_drawonly_str(g) {
    g = g||{};
    var d = [];
    let linedashed = this.to_linedashed_str(g);
    if (linedashed) {
      d.push(`stroke-dasharray='2'`);
    } 
    let linesize = this.to_linesize_px(g);
    if(linesize){
      d.push(`stroke-width='${linesize}'`);
    }
    let linecolor = this.to_linecolor_str(g);
    if (linecolor) {
      d.push(`stroke='${this.string_to_color_name(linecolor)}'`);
    } else {
      d.push(`stroke='inherit'`);
    }
    let linecap = this.to_linecap_str(g);
    if (linecap) {
      d.push(`stroke-linecap='${linecap}'`);
    }  
    let linejoin = this.to_linejoin_str(g);
    if (linejoin) {
      d.push(`stroke-linejoin='${linejoin}'`);
    } 
    d.push(`fill='none'`);
    return d.join(' ');
  }
  to_shadeonly_str(g,isinherit) {
    g = g||{};
    var d = [];
    let ss = this.to_shadecolor_arr(g);
    let shade = this.to_shade_str(g);
    let angle = this.to_angle_str(g);//this should be  number
    if(shade=='linear'){
      let p = {};
      p.x1 = 0;
      p.y1 = 0;
      p.x2 = 1;
      p.y2 = 0;
      p.ss = ss;
      p.id = ++this.my_defs_id;
      this.my_lineargradient_array.push(p);
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
      p.id = ++this.my_defs_id;
      this.my_radialgradient_array.push(p);
      d.push(`fill='url(#${p.id})'`);
    }else if(shade=='ball'){
      let p = {};
      p.cx = 0.5;
      p.cy = 0.5;
      p.fx = 0.3;
      p.fy = 0.4;
      p.r = 0.5;
      p.ss = ss;
      p.id = ++this.my_defs_id;
      this.my_radialgradient_array.push(p);
      d.push(`fill='url(#${p.id})'`);
    }
    var s = this.to_opacity_str(g);
    if (s) {
      d.push(`opacity='${s}'`);
    }
    d.push(`stroke='none'`);
    return d.join(' ');
  }
  to_fillonly_str(g,isinherit) {
    g = g||{};
    var d = [];
    let s = this.to_fillcolor_str(g);
    if(s){
      d.push(`fill='${s}'`);
    } else if (isinherit) {
      d.push(`fill='inherit'`);
    } else {
      d.push(`fill='none'`)
    }
    s = this.to_opacity_str(g);
    if (s) {
      d.push(`opacity='${s}'`);
    }
    d.push(`stroke='none'`);
    return d.join(' ');
  }
  to_dot_str(g){
    g = g||{};
    var o = [];
    if (g.dotcolor) {
      o.push(`fill='${this.string_to_color_name(g.dotcolor)}'`);
    } else {
      o.push(`fill='inherit'`);
    }
    o.push(`stroke='none'`);
    return o.join(' ');
  }
  p_ellipse(x,y,Rx,Ry,angle,g){
    var o = [];
    var x1 = x + Rx * Math.cos(angle/180*Math.PI);
    var y1 = y + Rx * Math.sin(angle/180*Math.PI);
    var x2 = x - Rx * Math.cos(angle/180*Math.PI);
    var y2 = y - Rx * Math.sin(angle/180*Math.PI);
    x1 = this.localx(x1);
    y1 = this.localy(y1);
    x2 = this.localx(x2);
    y2 = this.localy(y2);
    Rx = this.localdist(Rx);
    Ry = this.localdist(Ry);
    ///anti-clockwise
    o.push(`<path d='M${x1},${y1} A${Rx},${Ry},${-angle},1,0,${x2},${y2}' ${this.to_fillonly_str(g)} />`);//anti-clockwise
    o.push(`<path d='M${x1},${y1} A${Rx},${Ry},${-angle},1,0,${x2},${y2}' ${this.to_drawonly_str(g)} />`);//anti-clockwise
    ///clockwise
    o.push(`<path d='M${x1},${y1} A${Rx},${Ry},${-angle},1,1,${x2},${y2}' ${this.to_fillonly_str(g)} />`);//clockwise
    o.push(`<path d='M${x1},${y1} A${Rx},${Ry},${-angle},1,1,${x2},${y2}' ${this.to_drawonly_str(g)} />`);//clockwise
    return o.join('\n');
  }

  to_dotsize_radius(g){
    if(g.dotsize){
      var d = parseFloat(g.dotsize);
      if(Number.isFinite(d)){
        return (d/2*1.333);
      }
    } 
    return (this.config.dotsize/2*1.333);
  }

  to_linesize_px(g){
    if(g.linesize){
      var d = parseFloat(g.linesize);
      if(Number.isFinite(d)){
        return (d*1.333);
      }
    } 
    if(this.config.linesize){
      return (this.config.linesize*1.333);
    }
    return '';
  }

  to_linecolor_str(g){
    if (g.linecolor) {
      return g.linecolor;
    }
    if (this.config.linecolor) {
      return (this.config.linecolor);
    }
    return '';
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

  to_shadecolor_arr(g){
    if (g.shadecolor) {
      let ss = this.string_to_array(g.shadecolor);
      ss = ss.map(s => this.string_to_color_name(s));
      return ss;
    } 
    if(this.config.shadecolor){
      let ss = this.string_to_array(this.config.shadecolor);
      ss = ss.map(s => this.string_to_color_name(s));
      return ss;
    }
    return [];
  }
  to_fillcolor_str(g){
    if (g.fillcolor) {
      return(`${this.string_to_color_name(g.fillcolor)}`);
    } 
    if(this.config.fillcolor){
      return(`${this.string_to_color_name(this.config.fillcolor)}`);
    }
    return '';
  }

  ___to_opacity_str(g){
    if(typeof g.opacity === 'number'){
      return `${g.opacity}`;
    }
    else if(typeof g.opacity === 'string' && g.opacity.length){
      return g.opacity;
    } 
    else if(typeof this.config.opacity === 'number'){
      return `${this.config.opacity}`;
    }
    else if(typeof this.config.opacity === 'string' && this.config.opacity.length){
      return this.config.opacity;
    } 
    return '';
  }

  to_barlength_length(g){
    if(g.barlength){
      var d = parseFloat(g.barlength);
      if(Number.isFinite(d)){
        return (d);
      }
    } 
    return parseFloat(this.config.barlength);
    
  }

  p_arc(x1,y1,x2,y2,Rx,Ry,bigarcflag,g){
    x1 = this.localx(x1);
    y1 = this.localy(y1);
    x2 = this.localx(x2);
    y2 = this.localy(y2);
    Rx = this.localdist(Rx);
    Ry = this.localdist(Ry);
    return(`<path d='M${x1},${y1} A${Rx},${Ry},0,${bigarcflag},0,${x2},${y2}' ${this.to_drawonly_str(g)} />`);
  }

  p_shape(x,y,p,g,operation){
    var sx = this.assert_float(g.sx,1);
    var sy = this.assert_float(g.sy,1);
    var theta = this.assert_float(g.theta,0);
    let q = this.offset_and_scale_coords(p,x,y,sx,sy,theta);
    var items = this.coordsToD(q,true);
    var o = [];
    for(var item of items){
      var {iscycled,d} = item;
      if(operation=='fill'){
        if(iscycled){
          o.push(`<path d='${d}' ${this.to_fillonly_str(g,1)} />`);//will fill with default background color
        }
      }else if(operation=='stroke'){
        o.push(`<path d='${d}' ${this.to_drawonly_str(g)} />`);
      }else{
        ///default to 'draw'
        if(iscycled){
          o.push(`<path d='${d}' ${this.to_fillonly_str(g,1)} />`);//will fill with default background color
        }          
        o.push(`<path d='${d}' ${this.to_drawonly_str(g)} />`);
      }
    }
    return o.join('\n');
  }

  webrgb_to_svgrgb_s(s){
    // convert a string such as EFD to rgb(93%,100%,87%)
    // will truncate to 2 decimal places
    // convert a string such as E0F0D0 to (93%,100%,87%)
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
    r *= 100;
    g *= 100;
    b *= 100;
    return `rgb(${this.fix(r)}%,${this.fix(g)}%,${this.fix(b)}%)`;
  }
  to_svg_xyplot (g) {
    // *** \xyplot{20;10;0.2,0.2,0.3,0.3,0.4,0.4}
    //
    var p_circledot=1;
    var p_interline=2;
    var o = [];
    var w = g.width;
    var h = g.height;
    var data = g.data;;
    var p = g.extra;
    if(w && h && data){
      var u = 3.78;
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
      for(var j=0; j < data.length; j+=2){
        var x=data[j];
        var y= 1 - data[j+1];
        if(p&p_circledot){
          o.push(`<circle cx='${this.fix(x*u*w)}' cy='${this.fix(y*u*h)}' r='1pt' stroke='inherit' fill='none' />`);
        }else{
          o.push(`<circle cx='${this.fix(x*u*w)}' cy='${this.fix(y*u*h)}' r='1pt' stroke='none' fill='inherit' />`);
        }
      }
      ///draw interline
      if(ldata.length==4){
        var x1=ldata[0];
        var y1=1 - ldata[1];
        var x2=ldata[2];
        var y2=1 - ldata[3];
        o.push(`<line x1='${this.fix(x1*u*w)}' y1='${this.fix(y1*u*h)}' x2='${this.fix(x2*u*w)}' y2='${this.fix(y2*u*h)}' stroke='inherit' />`);
      }
    }
    var s = o.join('\n');
    return {s,w,h};
  }
  to_svg_colorbox (g) {
    // *** \colorbox{20;10;pink}
    //
    var o = [];
    var w = g.width;
    var h = g.height;
    var color = g.data;;
    o.push(`<rect x='0' y='0' width='${this.fix(w)}mm' height='${this.fix(h)}mm' stroke='none' fill='${this.string_to_color_name(color)}' />`);
    var s = o.join('\n');
    return {s,w,h};
  }
  to_svg_vbarchart (g) {
    //  \vbarchart{20;10;0.2,0.8,0.6,0.4,1.0}. 
    //
    var o = [];
    var w = g.width;
    var h = g.height;
    var data = g.data; 
    if(w && h && data){
      var u = 3.78;
      var data = data.split(',');
      var data = data.map(x => x.trim());
      for(var j=0; j < data.length; j++){
        var num=data[j];
        var gap=1/data.length;
        var x1=j*gap;
        var y1=1-num;
        o.push(`<rect x='${this.fix(x1*u*w)}' y='${this.fix(y1*u*h)}' width='${this.fix(gap*u*w)}' height='${this.fix(num*u*h-1)}' stroke='inherit' fill='none' />`);
      }
    }
    var s = o.join('\n');
    return {s,w,h};
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
      return 'square';
    }
    return 'butt';
  }
  to_linejoin_str(g) {
    let linejoin = g.linejoin;
    if (!linejoin) {
      linejoin = this.config.linejoin;
    }
    if (linejoin === 'miter') {
      return 'miter';
    } else if (linejoin === 'round') {
      return 'round';
    } else if (linejoin === 'bevel') {
      return 'bevel';
    }
    return 'miter';
  }
  get_next_clipath_id(){
    this.my_clipath_id++;
    return this.my_clipath_id;
  }
}

module.exports = { NitrilePreviewDiagramSVG };
