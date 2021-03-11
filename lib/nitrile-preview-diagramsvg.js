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
    ///this are storages for offloading to <defs>
    this.my_lineargradient_array = [];
    this.my_radialgradient_array = [];
    this.my_arrowhead_array = [];
    this.my_path_array = [];
    this.my_filter_blur_id = 0;
  }


  do_setup () {
    /// generate viewBox
    ///this.viewport_unit is always in mm
    ///u is now in px, so are vw and vh
    var u = 3.7795296*this.viewport_unit;
    var vw = u*this.viewport_width;
    var vh = u*this.viewport_height;
    this.u = u;
    this.vw = vw;
    this.vh = vh;
    this.my_lineargradient_array.length = 0;
    this.my_radialgradient_array.length = 0;
    this.my_arrowhead_array.length = 0;
    this.my_path_array.length = 0;
    this.my_filter_blur_id = 0;
  }
  do_finalize(text,style) {
    var o = [];
    ///GENERATE grids
    var u = this.u;
    var vw = this.vw;
    var vh = this.vh;
    var smallgridid = this.get_css_id();
    var gridcolor = 'rgb(235,235,235)'
    o.push('<defs>');
    o.push(`<pattern id="${smallgridid}" width="${u}" height="${u}" patternUnits="userSpaceOnUse"><path d="M ${u} 0 L 0 0 0 ${u}" fill="none" stroke="${gridcolor}" /></pattern>`);
    this.my_path_array.forEach((p) => {
      /*
        <path id='1' d='M0,0 L10,10'/>
      */
      o.push(`<path id='${p.id}' d='${p.d}' />`);
    });
    this.my_arrowhead_array.forEach((p) => {
      /*
      //o.push(`<marker id='markerArrow' markerWidth='3' markerHeight='4' refX='3' refY='2' orient='auto'> <path d='M0,0 L3,2 L0,4 z' stroke='none' fill='context-stroke'/> </marker>`);
      //o.push(`<marker id='startArrow'  markerWidth='3' markerHeight='4' refX='0' refY='2' orient='auto'> <path d='M3,0 L3,4 L0,2 z' stroke='none' fill='context-stroke'/> </marker>`);
      */
     let linesize = parseFloat(p.linesize)||0; // in pt
     if(p.position=='end'){
        if(linesize){
          // none-zero linesize
          o.push(`<marker id='${p.id}' markerWidth='3' markerHeight='4' refX='3' refY='2' orient='auto'> <path d='M0.5,0 L3,1.5 L3,2.5 L0.5,4 L1.25,2.5 L1.25,1.5 z' fill='${this.string_to_svg_color(p.linecolor,'','inherit')}' stroke='none'/> </marker>`)
        }else{
          // zero linesize
          o.push(`<marker id='${p.id}' markerWidth='3' markerHeight='4' refX='3' refY='2' orient='auto'> <path d='M0.5,0 L3,1.75 L3,2.25 L0.5,4 L1.25,2.5 L1.25,1.5 z' fill='${this.string_to_svg_color(p.linecolor,'','inherit')}' stroke='none'/> </marker>`)
        }
      }else if(p.position=='start'){
        if(linesize){
          // non-zero linesize
          o.push(`<marker id='${p.id}' markerWidth='3' markerHeight='4' refX='0' refY='2' orient='auto'> <path d='M2.5,0 L1.75,1.5 L1.75,2.5 L2.5,4 L0,2.5 L0,1.5 z' fill='${this.string_to_svg_color(p.linecolor,'','inherit')}' stroke='none'/> </marker>`)
        }else{
          // zero linesize
          o.push(`<marker id='${p.id}' markerWidth='3' markerHeight='4' refX='0' refY='2' orient='auto'> <path d='M2.5,0 L1.75,1.5 L1.75,2.5 L2.5,4 L0,2.25 L0,1.75 z' fill='${this.string_to_svg_color(p.linecolor,'','inherit')}' stroke='none'/> </marker>`)
        }
      }
    })
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
    if(this.my_filter_blur_id){
      /*
       <filter id="A">
       <feGaussianBlur stdDeviation="1" />
       </filter>
      */
      o.push(`<filter id="${this.my_filter_blur_id}"> <feGaussianBlur stdDeviation="1"/> </filter>`);
    }
    o.push('</defs>');
    // this is the normal grid
    if(this.config.nogrid==1){
      o.push(`<rect width="${this.fix(vw)}" height="${this.fix(vh)}" stroke="none" fill="none" />`);
    }else{ 
      if(1){
        o.push(`<rect width="${this.fix(vw)}" height="${this.fix(vh)}" stroke='${gridcolor}' fill='url(#${smallgridid})' />`);
      }else{
        for(var j = 0; j <= this.viewport_height; j++){
          var y = j*u;
          o.push(`<line stroke="${gridcolor}" x1="0" y1="${y}" x2="${vw}" y2="${y}" />`)
        }
        for(var i = 0; i <= this.viewport_width; i++){
          var x = i*u;
          o.push(`<line stroke="${gridcolor}" x1="${x}" y1="0" x2="${x}" y2="${vh}" />`)
        }
      }
    }
    o.push(text);    
    var text = o.join('\n');
    var s = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill='currentColor' stroke='currentColor' viewBox='0 0 ${this.fix(vw)} ${this.fix(vh)}' width='${this.fix(vw)}' height='${this.fix(vh)}' preserveAspectRatio='none' >${text}</svg>`;
    var width=`${vw}px`
    var height=`${vh}px`;
    var viewBox=`0 0 ${this.fix(vw)} ${this.fix(vh)}`;
    return {s,vw,vh,text};
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



  do_drawarc(opt,txt,g,coords){
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
      s.push(`<path d='${d}' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return s.join('\n');
  }

  ___do_drawcontrolpoints(opts,g,txt,coords){    
    this.move_coords(coords,this.refx,this.refy,this.refsx,this.refsy,0);
    var s = [];
    ///NOTE: the dotsize attribute could be an empty string
    var r = this.g_to_svg_dotsize_radius_px(g);
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
        s.push(`<circle cx='${i3}' cy='${i4}' r='${r}' ${this.g_to_svg_dotonly_str(g)}/>`);
        s.push(`<circle cx='${i5}' cy='${i6}' r='${r}' ${this.g_to_svg_dotonly_str(g)}/>`);
        s.push(`<rect x='${x-r}' y='${y-r}' width='${r+r}' height='${r+r}' ${this.g_to_svg_dotonly_str(g)}/>`);
        if (typeof x0 === 'number' && typeof y0 === 'number') {
          s.push(`<rect x='${x0-r}' y='${y0-r}' width='${r+r}' height='${r+r}' ${this.g_to_svg_dotonly_str(g)}/>`);
          x0 = null;
          y0 = null;
        }
      } if (join==='Q') {
        var i3 = this.localx(z0[3]);
        var i4 = this.localy(z0[4]);
        s.push(`<circle cx='${i3}' cy='${i4}' r='${r}' ${this.g_to_svg_dotonly_str(g)}/>`);
        s.push(`<rect x='${x-r}' y='${y-r}' width='${r+r}' height='${r+r}' ${this.g_to_svg_dotonly_str(g)}/>`);
        if (typeof x0 === 'number' && typeof y0 === 'number') {
          s.push(`<rect x='${x0-r}' y='${y0-r}' width='${r+r}' height='${r+r}' ${this.g_to_svg_dotonly_str(g)}/>`);
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

  do_rcard(opt,txt,g,coords){
    var s = [];
    var w = w*this.u;
    var h = h*this.u;
    var rx = 0.2*w;
    var delta_x = 0.6*w;
    var ry = 0.2*h;
    var delta_y = 0.6*h;
    for (var i = 0; i < coords.length; i++) {
      var z0 = this.point(coords, i);
      if(!this.isvalidpt(z0)) continue;
      var x = this.localx(z0[0]);
      var y = this.localy(z0[1]);
      s.push(`<path d='M${x+rx},${y} h${delta_x} q${rx},${0},${rx},${-ry} v${-delta_y} q${0},${-ry},${-rx},${-ry} h${-delta_x} q${-rx},${0},${-rx},${ry} v${delta_y} q${rx},${0},${rx},${ry} z' ${this.g_to_svg_fillonly_str(g)} />`);
      s.push(`<path d='M${x+rx},${y} h${delta_x} q${rx},${0},${rx},${-ry} v${-delta_y} q${0},${-ry},${-rx},${-ry} h${-delta_x} q${-rx},${0},${-rx},${ry} v${delta_y} q${rx},${0},${rx},${ry} z' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return s.join('\n');
  }

  ///
  ///
  ///
  coords_to_d(coords) {
    ///***NOTE: returns a list of objects, each object has three members: {iscycled,s,hints}
    ///***NOTE: i.e: (1,2)..(2,3)--cycle
    /// pt[0]: [1,2,'','','']
    /// pt[1]: [2,3,'..','','']
    /// pt[2]: ['cycle','','--','','']
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
      var x = this.localx(pt[0]);///NOTE:becomes SVG coords
      var y = this.localy(pt[1]);
      var join = pt[2];
      var p1x = this.localx(pt[3]);/// CUBIC BEZIER curve controlpoint 1x
      var p1y = this.localy(pt[4]);/// CUBIC BEZIER curve controlpoint 1y
      var p2x = this.localx(pt[5]);/// CUBIC BEZIER curve controlpoint 2x
      var p2y = this.localy(pt[6]);/// CUBIC BEZIER curve controlpoint 2y
      
      ///In case we have a CUBIC BEZIER curve, then pt1 and pt2 are the control points
      if (o.length == 0 || join == 'M') {
        // terminate the current line segment
        if(o.length){
          iscycled = 0;
          s = o.join(' ');
          if(o.length>1){
            ///only export if there are at least two path points
            items.push({iscycled,s,hints});
          }
          o = [];
        }
        o.push(`M${this.fix(x)},${this.fix(y)}`);
        x0 = x;
        y0 = y;
        hints = pt[12]||0;
      }
      else if (join == 'cycle') {
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
  p_comment(s) {
    s = s.replace(/\-\-/g,'');
    s = s.replace(/</g, "&lt;")
    s = s.replace(/>/g, "&gt;")
    return `<!-- ${s} -->`;
  }
  p_label(x,y,txt,ta,g) {
    if(!txt) return '';

    ///ta=lrt|urt|llft|ulft|top|bot...    
    var x = this.localx(x);
    var y = this.localy(y);

    /// (x,y) is now in SVG-coordinates. 

    ///is it inline math ort?
    var d = [];
    if (this.g_to_math_int(g)) {
      //math text
      var fontcolor = this.g_to_fontcolor_string(g);
      if(fontcolor){
        g.svgfontcolor = this.string_to_svg_color(fontcolor,g.hints);
      }else{
        g.svgfontcolor = '';
      }
      var {s,w,h,defs} = this.tokenizer.to_svgmath(txt,g,'diagram');
      var vw = w*1.333;///convert to px
      var vh = h*1.333;///convert to px
      var width = w*1.333;
      var height = h*1.333;
      let factor = this.g_to_diagram_fontsize_factor(g);
      width *= factor;
      height *= factor;
      var anchor = 'middle', valign = '';
      if (ta==='lrt') {
        anchor = 'start', valign = 'lower';
      } else if (ta==='bot') {
        anchor = 'middle', valign = 'lower';
        x -= width/2;
      } else if (ta==='llft') {
        anchor = 'end', valign = 'lower';
        x -= width;
      } else if (ta==='urt') {
        anchor = 'start', valign = 'upper';
        y -= height;
      } else if (ta==='top') {
        anchor = 'middle', valign = 'upper';
        x -= width/2;
        y -= height;
      } else if (ta==='ulft') {
        anchor = 'end', valign = 'upper';
        x -= width;
        y -= height;
      } else if (ta==='rt') {
        anchor = 'start', valign = 'middle';
        y -= height/2;
      } else if (ta==='lft') {
        anchor = 'end', valign = 'middle';
        x -= width;
        y -= height/2;
      } else if (ta==='ctr') {
        anchor = 'middle', valign = 'middle';
        x -= width/2;
        y -= height/2;
      } else {
        ///treat it as 'urt'
        anchor = 'start', valign = 'upper';
        y -= height;
      }
      //console.log('mathtext','x',x,'y',y,'height',height); 
      if(this.has_texts(g)){
        d.push(`<svg x='${x}' y='${y}' width='${width}' height='${height}' fill='inherit' stroke='inherit' viewBox='0 0 ${vw} ${vh}'><defs>${defs.join('\n')}</defs>${s}</svg>`);
      }
    } else {
      //literal text with symbols
      txt = this.translator.smooth(txt);
      let factor = this.g_to_diagram_fontsize_factor(g);
      var anchor = 'middle', dy='0.3', valign = '';
      if (ta==='lrt') {
        anchor = 'start', dy='0.8', valign = 'lower';
      } else if (ta==='bot') {
        anchor = 'middle', dy='0.8', valign = 'lower';
      } else if (ta==='llft') {
        anchor = 'end', dy='0.8', valign = 'lower';
      } else if (ta==='urt') {
        anchor = 'start', dy='-0.2', valign = 'upper';
      } else if (ta==='top') {
        anchor = 'middle', dy='-0.2', valign = 'upper';
      } else if (ta==='ulft') {
        anchor = 'end', dy='-0.2', valign = 'upper';
      } else if (ta==='rt') {
        anchor = 'start', dy='0.3', valign = 'middle';
      } else if (ta==='lft') {
        anchor = 'end', dy='0.3', valign = 'middle';
      } else if (ta==='ctr') {
        anchor = 'middle', dy='0.3', valign = 'middle';
      } else {///default is 'urt'
        anchor = 'start', dy='-0.2', valign = 'upper';
      }  
      var height = this.tokenizer.fh*1.333;
      height *= factor;
      if(valign == 'upper'){
        y -= height;
      }else if(valign == 'middle'){
        y -= height/2;
      }else {
        y -= 0;
      }
      if(anchor == 'start'){
        x += this.tokenizer.math_gap * 1.333;
      }else if(anchor == 'end'){
        x -= this.tokenizer.math_gap * 1.333;
      }
      //console.log('literaltext','x',x,'y',y,'height',height); 
      var fontfamily = this.g_to_svg_fontfamily_str(g);
      var fontstyle = this.g_to_svg_fontstyle_str(g);
      if(this.has_texts(g)){
        d.push(`<text transform='translate(${x} ${y}) scale(${factor})' font-family='${fontfamily}' font-style='${fontstyle}' font-size='${this.tokenizer.fs}pt' text-anchor='${anchor}' ${this.g_to_svg_textdraw_str(g)} dy='${this.tokenizer.text_dy_pt}pt'>${txt}</text>`);
      }
    }
    return d.join('\n');
  }
  p_text(x,y,txt,ta,g){
    if(!txt) return '';
    /*
    <text x='182' y='92'>
    <tspan x='182' dy='0'>Hello</tspan>
    <tspan x='182' dy='12pt'>World</tspan>
    </text>
    */
    var x = this.localx(x);
    var y = this.localy(y);
    var factor = this.g_to_diagram_fontsize_factor(g);
    /// (x,y) is now in SVG-coordinates, dy are in the unit of 'em'
    var anchor = 'middle', dy='0.3', valign = 'middle';
    if (ta==='lrt') {
      anchor = 'start', dy='0.8', valign = 'lower';
    } else if (ta==='bot') {
      anchor = 'middle', dy='0.8', valign = 'lower';
    } else if (ta==='llft') {
      anchor = 'end', dy='0.8', valign = 'lower';
    } else if (ta==='urt') {
      anchor = 'start', dy='-0.2', valign = 'upper';
    } else if (ta==='top') {
      anchor = 'middle', dy='-0.2', valign = 'upper';
    } else if (ta==='ulft') {
      anchor = 'end', dy='-0.2', valign = 'upper';
    } else if (ta==='rt') {
      anchor = 'start', dy='0.3';
    } else if (ta==='lft') {
      anchor = 'end', dy='0.3';
    } else if (ta==='ctr') {
      anchor = 'middle', dy='0.3';
    } else {///default is 'urt'
      anchor = 'start', dy='-0.2', valign = 'upper';
    }
    var ss = txt.trim().split('\\\\');
    var ss = ss.map(s => s.trim())
    var ss = ss.map(s => this.translator.flatten(s));
    var ss = ss.map((s,i,arr) => {
      if(i==0){
        return `<tspan x='0' dy='${this.tokenizer.text_dy_pt}pt'>${s}</tspan>`;
      }else{
        return `<tspan x='0' dy='${this.tokenizer.fs}pt'>${s}</tspan>`;
      }
    });
    var txt = ss.join('\n');
    var d = [];
    //adjust y
    var height = (this.tokenizer.fs*(ss.length-1) + this.tokenizer.fh)*1.333;
    height *= factor;
    if(valign == 'upper'){
      y -= height;
    }else if(valign == 'middle'){
      y -= height/2;
    }else {
      y -= 0;
    }
    var fontfamily = this.g_to_svg_fontfamily_str(g);
    var fontstyle = this.g_to_svg_fontstyle_str(g);
    if(this.has_texts(g)){
      d.push(`<text transform='translate(${x} ${y}) scale(${factor})' font-family='${fontfamily}' font-style='${fontstyle}' font-size='${this.tokenizer.fs}pt' text-anchor='${anchor}' ${this.g_to_svg_textdraw_str(g)} dy='${this.tokenizer.text_dy_pt}pt'>${txt}</text>`);
    }
    return d.join('\n');
  }
  p_slopedtext(x1,y1,x2,y2,txt,ta,g){
    if(!txt) return '';
    var o = [];
    ///NOTE text is always placed upper
    var x = (x1+x2)/2;
    var y = (y1+y2)/2;
    if(this.has_texts(g)){
      var x = this.localx(x);
      var y = this.localy(y);
      x1 = this.localx(x1);
      y1 = this.localy(y1);
      x2 = this.localx(x2);
      y2 = this.localy(y2);
      ///x/y is in SVG coordinate
      var linelength = this.calc_dist(x1,y1,x2,y2);
      var fontfamily = this.g_to_svg_fontfamily_str(g);
      var fontstyle = this.g_to_svg_fontstyle_str(g);
      var fontsize = this.g_to_svg_fontsize_str(g);
      var txt = this.translator.flatten(txt);
      let id = this.get_css_id();
      var txt = `<textPath href='#${id}'>${txt}</textPath>`;
      if(ta=='bot'){
        o.push(`<text font-family='${fontfamily}' font-style='${fontstyle}' font-size='${fontsize}' text-anchor='middle' ${this.g_to_svg_textdraw_str(g)} dx='${linelength/2}' dy='+1.00em'>${txt}</text>`);
      }else{
        o.push(`<text font-family='${fontfamily}' font-style='${fontstyle}' font-size='${fontsize}' text-anchor='middle' ${this.g_to_svg_textdraw_str(g)} dx='${linelength/2}' dy='-0.50em'>${txt}</text>`);
      }
      ///push to my_path_array
      let path = `M${x1},${y1} L${x2},${y2}`;
      this.my_path_array.push({id:id,d:path});
    }
    return o.join('\n');
  }
  p_fillclipath(_coords, g) {
    let clipath = g.clipath||''; 
    let names = clipath.split(/\s+/).map(x => x.trim()).filter(x => x.length);
    let ids = [];
    let o = [];
    names.forEach(x => {
      if(this.my_paths.has(x)){
        let path = this.my_paths.get(x);
        path = this.dup_coords(path);
        this.move_coords(path,this.refx,this.refy,this.refsx,this.refsy,0);
        let dd = this.coords_to_d(path,true);
        let id = this.get_css_id();
        ids.push(id);
        o.push(`<clipPath id='${id}'>`)
        dd.forEach(d => {
          o.push(`<path d='${d.d}' />`);
        })
        o.push(`</clipPath>`)    
      }
    });
    let w = `<rect x='0' y='0' width='${this.fix(this.localdist(this.viewport_width))}' height='${this.fix(this.localdist(this.viewport_height))}' ${this.g_to_svg_fillonly_str(g, 1)}/>`;
    ids.forEach(id => {
      w = `<g clip-path='url(#${id})'>${w}</g>`;
    })
    o.push(w);
    return o.join('\n');
  }
  p_fill(coords,_g){
    var items = this.coords_to_d(coords,true);
    var d = [];
    for(var item of items){
      var {iscycled,s,hints} = item;
      if(!s) continue; 
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if(this.has_shades(g)){
        d.push(`<path d='${s}' ${this.g_to_svg_shadeonly_str(g)}/>`);  
      }else if(this.has_fills(g)){
        d.push(`<path d='${s}' ${this.g_to_svg_fillonly_str(g,1)}/>`);  
      }
    }
    return d.join('\n');
  }
  p_draw(coords,_g){
    var items = this.coords_to_d(coords,true);
    var d = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if(iscycled) {
        if(this.has_shades(g)){
          d.push(`<path d='${s}' ${this.g_to_svg_shadeonly_str(g)}/>`);
        }else if(this.has_fills(g)){
          d.push(`<path d='${s}' ${this.g_to_svg_fillonly_str(g,1)}/>`);
        }        
      }
      if(this.has_strokes(g)){
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)}/>`);
      }
    }
    return d.join('\n');
  }
  p_stroke(coords,_g){
    var items = this.coords_to_d(coords,true);
    var d = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      if(this.has_strokes(g)){
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)}/>`);
      }
    }
    return d.join('\n');
  }
  p_arrow(coords,_g){
    var items = this.coords_to_d(coords,true);
    var d = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      let id1 = this.create_arrowhead('end',g);
      if(this.has_strokes(g)){
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' />`);
      }
    }
    return d.join('\n');
  }
  p_revarrow(coords,_g){
    var items = this.coords_to_d(coords,true);
    var d = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      let id2 = this.create_arrowhead('start',g);
      if(this.has_strokes(g)){
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-start='url(#${id2})' />`);
      }
    }
    return d.join('\n');
  }
  p_dblarrow(coords,_g){
    var items = this.coords_to_d(coords,true);
    var d = [];
    for(var item of items){
      var {iscycled,s,hints} = item; 
      if(!s) continue;
      var g = {..._g};
      g = this.update_g_hints(g,hints);
      let id1 = this.create_arrowhead('end',g);
      let id2 = this.create_arrowhead('start',g);
      if(this.has_strokes(g)){
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' marker-start='url(#${id2})' />`);
      }
    }
    return d.join('\n');
  }
  p_circle(cx, cy, r, g) {
    var d = [];
    var r = this.localdist(r);
    var cx = this.localx(cx);
    var cy = this.localy(cy);
    if(this.has_fills(g)){
      d.push(`<circle cx='${this.fix(cx)}' cy='${this.fix(cy)}' r='${this.fix(r)}' ${this.g_to_svg_fillonly_str(g)}/>`);
    }
    if(this.has_strokes(g)){
      d.push(`<circle cx='${this.fix(cx)}' cy='${this.fix(cy)}' r='${this.fix(r)}' ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    return d.join('\n');
  }
  p_rect(x,y,w,h,g){
    var d = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var w = this.localdist(w);
    var h = this.localdist(h);
    y = y - h;
    if(this.has_fills(g)){
      d.push(`<rect x='${this.fix(x)}' y='${this.fix(y)}' width='${this.fix(w)}' height='${this.fix(h)}' ${this.g_to_svg_fillonly_str(g)} />`);
    }
    if(this.has_strokes(g)){
      d.push(`<rect x='${this.fix(x)}' y='${this.fix(y)}' width='${this.fix(w)}' height='${this.fix(h)}' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return d.join('\n');
  }
  p_rrect(x,y,w,h,Dx,Dy,g){
    var d = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var w = this.localdist(w);
    var h = this.localdist(h);
    var Dx = this.localdist(Dx);
    var Dy = this.localdist(Dy);
    var X = x+w;
    var Y = y-h;
    var s = `M${this.fix(x)},${this.fix(y-Dy)} \
             Q${this.fix(x)},${this.fix(y)},${this.fix(x+Dx)},${this.fix(y)} L${this.fix(x+w-Dx)},${this.fix(y)} \
             Q${this.fix(x+w)},${this.fix(y)},${this.fix(x+w)},${this.fix(y-Dy)} L${this.fix(x+w)},${this.fix(y-h+Dy)} \
             Q${this.fix(x+w)},${this.fix(y-h)},${this.fix(x+w-Dx)},${this.fix(y-h)} L${this.fix(x+Dx)},${this.fix(y-h)} \
             Q${this.fix(x)},${this.fix(y-h)},${this.fix(x)},${this.fix(y-h+Dy)} z`;
    if(this.has_fills(g)){
      d.push(`<path d='${s}' ${this.g_to_svg_fillonly_str(g)} />`);
    }
    if(this.has_strokes(g)){
      d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return d.join('\n');
  }
  p_hexgon(x,y,w,h,g){
    var d = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var gap = this.localdist(h*0.25)
    var w = this.localdist(w);
    var h = this.localdist(h);
    if(this.has_fills(g)){
      d.push(`<path d='M ${this.fix(x+gap)} ${this.fix(y)} L ${this.fix(x+w-gap)} ${this.fix(y)} L ${this.fix(x+w)} ${this.fix(y-0.5*h)} L ${this.fix(x+w-gap)} ${this.fix(y-h)} L ${this.fix(x+gap)} ${this.fix(y-h)} L ${this.fix(x)} ${this.fix(y-0.5*h)} z' ${this.g_to_svg_fillonly_str(g)} />`);
    }
    if(this.has_strokes(g)){
      d.push(`<path d='M ${this.fix(x+gap)} ${this.fix(y)} L ${this.fix(x+w-gap)} ${this.fix(y)} L ${this.fix(x+w)} ${this.fix(y-0.5*h)} L ${this.fix(x+w-gap)} ${this.fix(y-h)} L ${this.fix(x+gap)} ${this.fix(y-h)} L ${this.fix(x)} ${this.fix(y-0.5*h)} z' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return d.join('\n');
  }
  p_triangle(x,y,w,h,g){
    var d = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var w = this.localdist(w);
    var h = this.localdist(h);
    if(this.has_fills(g)){
      d.push(`<path d='M ${this.fix(x)} ${this.fix(y)} L ${this.fix(x+w)} ${this.fix(y)} L ${this.fix(x+0.5*w)} ${this.fix(y-h)} z' ${this.g_to_svg_fillonly_str(g)} />`);
    }
    if(this.has_strokes(g)){
      d.push(`<path d='M ${this.fix(x)} ${this.fix(y)} L ${this.fix(x+w)} ${this.fix(y)} L ${this.fix(x+0.5*w)} ${this.fix(y-h)} z' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return d.join('\n');
  }
  p_TRIANGLE(x,y,w,h,g){
    var d = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var w = this.localdist(w);
    var h = this.localdist(h);
    var D = `M ${this.fix(x)} ${this.fix(y-h)} L ${this.fix(x+0.5*w)} ${this.fix(y)} L ${this.fix(x+w)} ${this.fix(y-h)} z`;

    if(this.has_fills(g)){
      d.push(`<path d='${D}' ${this.g_to_svg_fillonly_str(g)} />`);
    }
    if(this.has_strokes(g)){
      d.push(`<path d='${D}' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return d.join('\n');
  }
  p_parallelogram(x,y,w,h,g){
    var d = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var w = this.localdist(w);
    var h = this.localdist(h);
    var shear = this.g_to_shear_float(g);
    var SX = shear*h;
    var s = `M${this.fix(x)},${this.fix(y)} L${this.fix(x+w-SX)},${this.fix(y)} L${this.fix(x+w)},${this.fix(y-h)} L${this.fix(x+SX)},${this.fix(y-h)} z`;
    if(this.has_fills(g)){
      d.push(`<path d='${s}' ${this.g_to_svg_fillonly_str(g)} />`);
    }
    if(this.has_strokes(g)){
      d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return d.join('\n');
  }
  p_rhombus(x,y,w,h,g){
    var d = [];
    var x = this.localx(x);
    var y = this.localy(y);
    var w = this.localdist(w);
    var h = this.localdist(h);
    var X1 = x+w*0.5;
    var X2 = x+w;
    var Y1 = y-h*0.5;
    var Y2 = y-h;
    var s = `M${this.fix(x)},${this.fix(Y1)} L${this.fix(X1)},${this.fix(y)} L${this.fix(X2)},${this.fix(Y1)} L${this.fix(X1)},${this.fix(Y2)} z`;
    if(this.has_fills(g)){
      d.push(`<path d='${s}' ${this.g_to_svg_fillonly_str(g)} />`);
    }
    if(this.has_strokes(g)){
      d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} />`);
    }
    return d.join('\n');
  }

  p_line(x1,y1,x2,y2,g){
    var d = [];
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        let id1 = this.create_arrowhead('end',g);
        d.push(`<line x1='${this.fix(x1)}' y1='${this.fix(y1)}' x2='${this.fix(x2)}' y2='${this.fix(y2)}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' />`);
      }else if(arrowhead==2){
        let id2 = this.create_arrowhead('start',g);
        d.push(`<line x1='${this.fix(x1)}' y1='${this.fix(y1)}' x2='${this.fix(x2)}' y2='${this.fix(y2)}' ${this.g_to_svg_drawonly_str(g)} marker-start='url(#${id2})' />`);
      }else if(arrowhead==3){
        let id1 = this.create_arrowhead('end',g);
        let id2 = this.create_arrowhead('start',g);
        d.push(`<line x1='${this.fix(x1)}' y1='${this.fix(y1)}' x2='${this.fix(x2)}' y2='${this.fix(y2)}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' marker-start='url(#${id2})' />`);
      }else{
        d.push(`<line x1='${this.fix(x1)}' y1='${this.fix(y1)}' x2='${this.fix(x2)}' y2='${this.fix(y2)}' ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    return d.join('\n');
  }

  p_qbezier_line(x0,y0, x1,y1, x2,y2, g){
    var d = [];
    var x0 = this.localx(x0);
    var y0 = this.localy(y0);
    var x1 = this.localx(x1);
    var y1 = this.localy(y1);
    var x2 = this.localx(x2);
    var y2 = this.localy(y2);
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        let id1 = this.create_arrowhead('end',g);
        d.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' />`);
      }else if(arrowhead==2){
        let id2 = this.create_arrowhead('start',g);
        d.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}' ${this.g_to_svg_drawonly_str(g)} marker-start='url(#${id2})' />`);
      }else if(arrowhead==3){
        let id1 = this.create_arrowhead('end',g);
        let id2 = this.create_arrowhead('start',g);
        d.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' marker-start='url(#${id2})' />`);
      }else{
        d.push(`<path d='M ${this.fix(x0)},${this.fix(y0)} Q ${this.fix(x1)},${this.fix(y1)},${this.fix(x2)},${this.fix(y2)}' ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    return d.join('\n');
  }
  p_cbezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g){
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
  p_arc(cx,cy,r,start_a,span_a,g){
    var d = [];
    var s = '';
    var sweepflag = 0;//anti-clockwise
    var bigarcflag = 0;
    if(span_a < 0){
      sweepflag = 1;//clockwise
    }
    var Rx = this.localdist(r);
    var Ry = this.localdist(r);
    var da = span_a/4;
    var all_a = [start_a,          
                 start_a+da,       
                 start_a+da+da,    
                 start_a+da+da+da, 
                 start_a+da+da+da+da];
    var a = all_a[0];
    var x = cx + r*Math.cos(a / 180 * Math.PI);
    var y = cy + r*Math.sin(a / 180 * Math.PI);
    x = this.localx(x);
    y = this.localy(y);
    s += ` M${this.fix(x)},${this.fix(y)}`
    for(var j=1; j < all_a.length; ++j){
      var a = all_a[j];
      var x = cx + r*Math.cos(a / 180 * Math.PI);
      var y = cy + r*Math.sin(a / 180 * Math.PI);  
      x = this.localx(x);
      y = this.localy(y);
      s += ` A${this.fix(Rx)},${this.fix(Ry)},0,${bigarcflag},${sweepflag},${this.fix(x)},${this.fix(y)}`;
    }
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_strokes(g)){
      if(arrowhead==1){
        ///front-pointing-arrow-head
        let id1 = this.create_arrowhead('end',g);
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' />`);
      }else if(arrowhead==2){
        ///back-pointing-arrow-head
        let id2 = this.create_arrowhead('start',g);
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-start='url(#${id2})' />`);
      }else if(arrowhead==3){
        ///front-and-back-pointing-arrow-heads
        let id1 = this.create_arrowhead('end',g);
        let id2 = this.create_arrowhead('start',g);
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' marker-start='url(#${id2})' />`);
      }else{
        ///no-arrow-head
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    return d.join('\n');
  }
  p_pie(cx,cy,r,start_a,span_a,g){
    var d = [];
    var s = '';
    var sweepflag = 0;//anti-clockwise
    var bigarcflag = 0;
    if(span_a < 0){
      sweepflag = 1;//clockwise
    }
    var Rx = this.localdist(r);
    var Ry = this.localdist(r);
    var da = span_a/4;
    var all_a = [start_a,          
                 start_a+da,       
                 start_a+da+da,    
                 start_a+da+da+da, 
                 start_a+da+da+da+da];
    var a = all_a[0];
    var x = cx + r*Math.cos(a / 180 * Math.PI);
    var y = cy + r*Math.sin(a / 180 * Math.PI);
    x = this.localx(x);
    y = this.localy(y);
    s = `M${this.fix(this.localx(cx))},${this.fix(this.localy(cy))}`;
    s += ` L${this.fix(x)},${this.fix(y)}`
    for(var j=1; j < all_a.length; ++j){
      var a = all_a[j];
      var x = cx + r*Math.cos(a / 180 * Math.PI);
      var y = cy + r*Math.sin(a / 180 * Math.PI);  
      x = this.localx(x);
      y = this.localy(y);
      s += ` A${this.fix(Rx)},${this.fix(Ry)},0,${bigarcflag},${sweepflag},${this.fix(x)},${this.fix(y)}`;
    }
    s += ' z';
    var arrowhead = this.g_to_arrowhead_int(g);
    if(this.has_fills(g)){
      //no-arrow-head
      d.push(`<path d='${s}' ${this.g_to_svg_fillonly_str(g)} />`);
    }
    if(this.has_strokes(g)){
      if(arrowhead==1){
        ///front-pointing-arrow-head
        let id1 = this.create_arrowhead('end',g);
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' />`);
      }else if(arrowhead==2){
        ///back-pointing-arrow-head
        let id2 = this.create_arrowhead('start',g);
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-start='url(#${id2})' />`);
      }else if(arrowhead==3){
        ///front-and-back-pointing-arrow-heads
        let id1 = this.create_arrowhead('end',g);
        let id2 = this.create_arrowhead('start',g);
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} marker-end='url(#${id1})' marker-start='url(#${id2})' />`);
      }else{
        ///no-arrow-head
        d.push(`<path d='${s}' ${this.g_to_svg_drawonly_str(g)} />`);
      }
    }
    return d.join('\n');
  }
  p_dot_square(x,y,g){
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
      o.push(`<circle cx='${x}' cy='${y}' r='${r}' ${this.g_to_svg_dotonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_dot_pie(cx,cy,start_a,span_a,g){
    var r = this.g_to_svg_dotsize_radius_px(g);
    var o = [];
    if (x < 0 || x > this.viewport_width) {
      return;
    }
    if (y < 0 || y > this.viewport_height) {
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
    s += ` L${this.fix(x)},${this.fix(y)}`
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
    var o = [];
    var x = parseFloat(x);
    var y = parseFloat(y);
    var X = this.localx(x);
    var Y = this.localy(y);
    var dy = this.g_to_barlength_float(g)/2;
    var X2 = this.localx(x);
    var Y2 = this.localy(y+dy);
    if(this.has_strokes(g)){
      o.push(`<line x1='${X}' y1='${Y}' x2='${X2}' y2='${Y2}' ${this.g_to_svg_drawonly_str(g)}/>`);
    }
    return o.join('\n');
  }
  p_bvbar(x,y,g){
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
    if(this.has_fills(g)){
      o.push(`<path d='M${x1},${y1} A${Rx},${Ry},${-angle},1,0,${x2},${y2}' ${this.g_to_svg_fillonly_str(g)} />`);//anti-clockwise fill
      o.push(`<path d='M${x1},${y1} A${Rx},${Ry},${-angle},1,1,${x2},${y2}' ${this.g_to_svg_fillonly_str(g)} />`);//clockwise fill
    }
    if(this.has_strokes(g)){
      o.push(`<path d='M${x1},${y1} A${Rx},${Ry},${-angle},1,0,${x2},${y2}' ${this.g_to_svg_drawonly_str(g)} />`);//anti-clockwise stroke
      o.push(`<path d='M${x1},${y1} A${Rx},${Ry},${-angle},1,1,${x2},${y2}' ${this.g_to_svg_drawonly_str(g)} />`);//clockwise stroke
    }
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
      d.push(`stroke-dasharray='2.5 1.5'`);
    } 
    let linesize = this.g_to_linesize_float(g);
    if(linesize){
      d.push(`stroke-width='${linesize*1.333}'`);
    }
    let linecolor = this.g_to_linecolor_string(g);
    if (linecolor) {
      d.push(`stroke='${this.string_to_svg_color(linecolor,g.hints)}'`);
    } else {
      d.push(`stroke='inherit'`);
    }
    let linecap = this.g_to_linecap_string(g);
    if (linecap) {
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
      p.id = this.get_css_id();
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
      p.id = this.get_css_id();
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
      p.id = this.get_css_id();
      this.my_radialgradient_array.push(p);
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
      d.push(`fill='inherit'`);
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
      o.push(`fill='inherit'`);
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
}

module.exports = { NitrilePreviewDiagramSVG };
