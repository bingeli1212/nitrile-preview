'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base.js');
//const re_token = /\\;|\\,|\\:|\\\\|\\\{|\\\}|\\begin\{\w+\}|\\end\{\w+\}|(\\mathcal|\\mathbf|\\mathbb|\\mathrm|\\mathit)\s*\{[A-Za-z0-9]*\}|&[a-zA-Z][a-zA-Z0-9]*;|\\[a-zA-Z]+|'+|./ugs;
const my_valid_fence_ids = [ "myLB",     "myRB",     "myLBR",    "myRBR",    "my_lobrk",   "my_robrk",   "my_langle", "my_rangle", "myLPAREN", "myRPAREN", "my_vert",  "my_Vert", "my_lceil",  "my_rceil",  "my_lfloor", "my_rfloor" ];
const my_math_variants_keys = ["mathcal","mathbf","mathbb","mathrm","mathit","mathvr"];
const my_math_variants_re = /^\\(mathit|mathrm|mathbf|mathbb|mathcal)\s*\{(.*)\}$/;
const my_char_widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.6656250, 0.1906250, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 
                        0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.5843750, 0.5828125, 0.5843750, 0.5546875, 
                        1.0140625, 0.6656250, 0.6656250, 0.7218750, 0.7218750, 0.6656250, 0.6093750, 0.7765625, 0.7218750, 0.2765625, 0.5000000, 0.6656250, 0.5546875, 0.8328125, 0.7218750, 0.7765625, 
                        0.6656250, 0.7765625, 0.7218750, 0.6656250, 0.6093750, 0.7218750, 0.6656250, 0.9437500, 0.6656250, 0.6656250, 0.6093750, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 
                        0.3328125, 0.5546875, 0.5546875, 0.5000000, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.2218750, 0.2406250, 0.5000000, 0.2218750, 0.8328125, 0.5546875, 0.5546875, 
                        0.5546875, 0.5546875, 0.3328125, 0.5000000, 0.2765625, 0.5546875, 0.5000000, 0.7218750, 0.5000000, 0.5000000, 0.5000000, 0.3546875, 0.2593750, 0.3531250, 0.5890625, 0.0000000];

class NitrilePreviewTokenizer extends NitrilePreviewBase {

  constructor (translator) {
    super();
    this.translator = translator;
    this.pjson = translator.pjson;
    this.def_symbol_width = 6.5; // This should be the same width as a digit
    this.length_adjust = 'spacingAndGlyphs';
    this.char_widths = my_char_widths;
    this.display_rate = 1.8;
    this.sum_script_rate = 0.60;
    this.sub_rate = 0.50;
    this.sup_rate = 0.50;
    this.frac_rate = 0.70;
    this.nroot_rate = 0.50;
    this.integral_enlarge_rate = 2.4;
    this.summation_enlarge_rate = 1.8;
    this.math_gap = 1.5;//1.5pt before and after
    this.vertical_gap = 0;//in pts for every \\cr line
    this.extra_gap = 3;//in pts (for + / etc. except for =)
    this.extra_gap_eq = 3.0;//in pts (for = only)
    this.extra_gap_int = 1;//in pts
    this.cssfontrate = 1;//set by the caller
    this.re_br = /^(<br\/>)(.*)$/s;
    this.re_svg = /^<svg\b([^<>]*>)(.*)$/s;
    this.re_span = /^<([A-Za-z]+)\b([^<>]*)>(.*)$/s;
    this.re_entity = /^(&#x[0-9A-Za-z]+;|&#[0-9]+;)(.*)$/s;
    this.re_segment = /^(\\;|\\,|\\:|\\begin\{\w+\}|\\end\{\w+\}|\\text\{.*?\}|\\hrule\[\w+\]\{.*?\}|\\hrule\{.*?\}|&[a-zA-Z][a-zA-Z0-9]*;|\\[a-zA-Z]+|'+|.)(.*)/s;///this needs to have a 's' because the SVG's could have newline in it and without it only part of the SVG will be captured in the second argument
    this.re_firstchar = /^(.)(.*)$/s;
    this.re_begin = /^\\begin\{(\w+)\}$/;
    this.re_end = /^\\end\{(\w+)\}$/;
    this.re_text_brace = /^\\text\{(.*)\}$/;
    this.re_hrule_brace = /^\\hrule(\[\w+\]|)\{(.*)\}$/;
    this.re_variable = /^[a-z]$/;
    this.re_capital_letter = /^[A-Z]$/;
    this.re_space=/\s/;
    this.re_texts=/^\\(text|operatorname)\s*\{(.*)\}$/;
    this.re_loglikename = /^\\(\w+)$/;
    this.imgs = [];
    this.iscex = 0;
    this.my_last_id = '';
    this.fs = 12;
    this.xh = 2.25;
    this.fh = this.fs + this.xh;
    this.dy = 0.60;//0.60em dy for each text element. If it has been shown that bottom part of
                    //the text is clipped then reduce it. The larger the value the more downward
                    //shift the font will be
    this.text_dy_pt = (this.fs*this.dy) + this.xh;
    this.symbol_name_map = new Map();
    this.symbol_cc_map = new Map();
    this.symbol_group_map = new Map();
    this.symbol_alt_map = new Map();
    this.build_all_symbol_maps(this.symbol_name_map,this.symbol_cc_map,this.symbol_group_map,this.symbol_alt_map);
  }

  tokenize (str) {
    return this.to_math_segment_array(str);
  }

  groupize (str) {
    var l = this.to_math_segment_array(str);
    var g = this.to_math_group(l);
    var g = this.to_math_commands(g);
    var g = this.to_math_subsups(g);
    return g;
  }

  to_svgmath (math,style,used,isdmath) {
    var l = this.to_math_segment_array(math);
    var v = this.to_math_group(l);//this takes care of \left...\right, and \begin...\end, and {...} and ensure that they each forms their own subgroup
    var v = this.to_math_commands(v);
    var v = this.to_math_subsups(v);
    var pref = {...style};
    pref.isdmath = isdmath;
    var tops = this.split_math_cr(v);
    if(tops.length==1){       
      let [w,h,mid,s,g_,q_,last_id,shiftdist] = this.toInnerSvg(tops[0],used,pref); 
      return {w,h,mid,s};    
    }else{
      var left_w = 0;
      var right_w = 0;
      var total_h = 0;
      var gap = this.vertical_gap;
      var gap = -2;//for now.
      ///get results
      var results = tops.map( (z) => {
        var pref1 = {...pref};
        let [w,h,mid,s,g_,q_,last_id,shiftdist] = this.toInnerSvg(z,used,pref1); 
        return {w,h,mid,s,shiftdist};
      });
      results.forEach( (p) => {
        let {w,h,shiftdist} = p;
        let left;
        let right;
        if(shiftdist<0){
          left = w;
          right = 0;
        }else{
          left = shiftdist;
          right = w - shiftdist;
        }
        left_w = Math.max(left_w,left);
        right_w = Math.max(right_w,right);
        total_h += h;
      })
      var w = left_w + right_w;
      var h = total_h;
      var mid = h/2;
      var o = [];
      var y_ = 0;
      results.forEach( (p) => {
        let w_ = p.w;
        let h_ = p.h;
        let s_ = p.s;
        let shiftdist_ = p.shiftdist;
        let x_;
        if(shiftdist_ < 0){
          x_ = left_w - w_;
        }else{
          x_ = left_w - shiftdist_;
        }
        o.push(`<g transform="translate(${x_*1.333},${y_*1.333})" > ${s_} </g>`);
        y_ += h_;
        y_ += gap;
        h = y_;
      })
      h -= gap;
      var s = o.join('\n')
      return {w,h,mid,s};
    }
  }

  to_outer_svg(s,w,h,mid,defs,type){
    ///type:='\\pipe' or '\\math'
    var x = 0;
    var y = 0;
    var vw = w*1.333;
    var vh = h*1.333;
    mid = mid||'0';
    var opt = '';
    var css = '';
    opt += ` xmlns = 'http://www.w3.org/2000/svg'`;
    opt += ` xmlns:xlink="http://www.w3.org/1999/xlink"`
    opt += ` type="${type}"`
    if(type=='html'){
      var va = this.to_vertical_align_em(h,mid);
      opt += ` width="${w/this.fs}em" height="${h/this.fs}em"`
      css += ` vertical-align:-${this.fix(va)}em;`
      //css += ` vertical-align:middle;`
    }else{
      opt += ` width="${w}pt" height="${h}pt"`
    }
    opt += ` fill="inherit"`
    opt += ` stroke="inherit"`
    opt += ` innersvg="${w} ${h} ${mid}"`
    opt += ` viewBox="${x} ${y} ${vw} ${vh}"`;
    ///DEBUG
    //css += ` outline:1px solid orange;`
    ///
    var s = `<svg ${opt} style="${css}" >\n<defs>\n${defs.join('\n')}\n</defs>\n${s}\n</svg>`;
    return s;
  }

  to_vertical_align_em(h,mid){
    var down = this.text_dy_pt - this.fh/2;
    var lower = h - mid;
    var lowerer = lower - down;
    var percent = lowerer/this.fs;
    return percent;
  }

  ///'g' is assumed a toplevel \pipe group
  split_math_align(g) {
    var gs = []
    var o = ['\\pipe', []];
    gs.push(o);
    g[1].forEach(x => {
      if (x == '&') {
        o = ['\\pipe', []];
        gs.push(o);
      } else {
        o[1].push(x);
      }
    })
    return gs;
  }

  ///'g' is assumed a toplevel \pipe group
  split_math_cr(g) {
    var gs = []
    var o = ['\\pipe', []];
    gs.push(o);
    g[1].forEach(x => {
      if (x == '\\cr') {
        o = ['\\pipe', []];
        gs.push(o);
      } else {
        o[1].push(x);
      }
    })
    return gs;
  }

  get_protrude_by_id(my_id){
    for(var key of my_math_variants_keys){
      for (var mathSymbol of this.pjson.fontVariants[key]) {
        let {dy,dx,id,unicode,width,fontstyle,protrude} = mathSymbol;
        if(id.localeCompare(my_id)===0){
          return parseInt(protrude)||0;
        }
      }
    }
    return 0;
  }

  buildup_defs(used){
    var defs = [];
    var myfill = 'currentColor';
    for (var mathSymbol of this.pjson.mathSymbols) {
      let {id,unicode,width,fontstyle} = mathSymbol;
      fontstyle=fontstyle||'';
      width = this.get_width_for_char(width,unicode);
      width *= this.fs/12;//scaled by fs
      if (used.has(id)) {
        let adjust = this.length_adjust;
        if(id=='myINT'||id=='mySUM'){
          adjust="spacing";
        }
        defs.push(`<text id="${id}" dy="${this.text_dy_pt}pt" textLength="${width}pt" lengthAdjust="${adjust}" style="stroke:none;fill:${myfill};font-size:${this.fs}pt;font-style:${fontstyle};">${unicode}</text>`);
      }
    }
    for(var key of my_math_variants_keys){
      for (var mathSymbol of this.pjson.fontVariants[key]) {
        let {id,unicode,width,fontstyle} = mathSymbol;
        fontstyle=fontstyle||'';
        width = this.get_width_for_char(width,unicode);
        width *= this.fs/12;//scaled by fs
        let adjust = this.length_adjust;
        if (used.has(id)) {
          defs.push(`<text id="${id}" dy="${this.text_dy_pt}pt" textLength="${width}pt" lengthAdjust="${adjust}" style="stroke:none;fill:${myfill};font-size:${this.fs}pt;font-style:${fontstyle};">${unicode}</text>`);
        }
      }
    }
    for(var symb in this.pjson.symbol){
      var p = this.pjson.symbol[symb];
      var id = 'my_' + symb;
      var width = this.get_width_for_char(p.width,p.html);
      width *= this.fs/12;
      var op = p.op||0;
      var dx = p.dx||0;
      var unicode = p.html||'';
      var fontstyle = p.fontstyle||'';
      let adjust = this.length_adjust;
      if (used.has(id)) {
        defs.push(`<text id="${id}" dy="${this.text_dy_pt}pt" textLength="${width}pt" lengthAdjust="${adjust}" style="stroke:none;fill:${myfill};font-size:${this.fs}pt;font-style:${fontstyle};">${unicode}</text>`);
      }
    }
    return defs;
  }

  isValidFenceId (id) {
    if(!id) return true;
    return (my_valid_fence_ids.indexOf(id) >= 0) ? true : false;
  }

  max (v1,v2) {
    return (v1 > v2) ? v1 : v2;
  }

  splitArrayForMatrix (v) {
    ///IMPORANT: the input argument is an item
    if(Array.isArray(v) && v[0]=='\\brace'){
      var o = [];
      var top = [];
      top.push(o);
      var pp = v[1];///the second element is the array within the brace
      for (let p of pp) {
        if (typeof p === 'string' && p === ';') {
          o = []; /// create a new row (empty row)
          top.push(o); /// add this row to the collection
        } else {
          o.push(p);/// add this new cell to this row
        }
      }
      return top;
    }else{
      ///SINGLE item
      return [[v]];
    }
  }

  splitArrayForBeginEnd (l) {
    var o = [];
    var oo = [];
    var v = [];
    oo.push(v);
    o.push(oo);
    for (let ll of l) {
      v.push(ll);
      if (typeof ll === 'string' && ll === '\\nr') {
        v.pop();///pop out the \\next that was just inserted
        v = []; /// create a new cell
        oo = []; /// create a new row (empty row)
        oo.push(v); /// add this cell to the new row (empty cell)
        o.push(oo); /// add this row to o
      } else if (typeof ll === 'string' && ll === '\\nc') {
        v.pop();///pop out the new '&' just inserted
        v = [];///create a new cell
        oo.push(v);/// add this new cell to this row
      } else {
        ///do nothing
      }
    }
    return o;
  }

  shrink_svg (v,rate = 0.7) {
    if(rate == 1){
      return v;
    }
    var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = v;
    var nw2_ = w2_*rate;
    var nh2_ = h2_*rate;
    var nmid2_ = mid2_*rate;
    var o = [];
    o.push(`<g transform="scale(${rate})"> ${s2_} </g>`);
    return [nw2_,nh2_,nmid2_,o.join('\n'),g2_,q2_,id2_];
  }

  /// calculate the (x,y) position for this SVG so that it is
  /// centered at the given rectangle given by
  //// (bx,by,bw,bh); The found position is return as an array of two elements
  findXyForCenter (w_,h_,bx,by,bw,bh) {
    bx += (bw - w_)/2.0
    by += (bh - h_)/2.0
    return [bx,by];
  }

  /// calculate the (x,y) position for this SVG so that it is
  /// flushleft at the given rectangle given by
  //// (bx,by,bw,bh); The found position is return as an array of two elements
  findXyForFlushleft (w_,h_,bx,by,bw,bh) {
    by += (bh - h_)/2.0
    return [bx,by];
  }

  findIdByEntity(v,used){
    for (var symb in this.pjson.symbol) {
      let {html,width,op} = this.pjson.symbol[symb];
      if(v.localeCompare(html)==0){
        var id = `my_${symb}`;
        used.add(id);
        width = this.get_width_for_char(width,html);
        return [id,width,op,v];
      }
    }
    for (var mathSymbol of this.pjson.mathSymbols) {
      let {kbd,width,id,op,unicode} = mathSymbol;
      if (v.localeCompare(unicode)==0) {
        used.add(id);
        width = this.get_width_for_char(width,unicode);
        return [id,width,op,v];
      }
    }
    return [id,0,0,''];
  }

  findIdByElement (v,used) {
    ///return [id,width,op,name]
    // search the normal way
    if(v){
      for (var mathSymbol of this.pjson.mathSymbols) {
        let {kbd,width,id,op,unicode} = mathSymbol;
        if (kbd === v) {
          used.add(id);
          width = this.get_width_for_char(width,unicode);
          return [id,width,op];
        }
      }
      //find \deg or &deg;
      if( (typeof v === 'string' && v.startsWith('\\')) || (typeof v === 'string' && v.startsWith('&') && v.endsWith(';')) ){
        if(v.startsWith('\\')){
          var name = v.slice(1);
        }else{
          var name = v.slice(1,-1);
        }
        ///search in 'alt_symbol' arry first
        if(this.pjson.alt_symbol[name]){
          name = this.pjson.alt_symbol[name];
        }
        if(this.symbol_name_map.has(name)){
          var {id,op,html,width} = this.symbol_name_map.get(name);
          width = this.get_width_for_char(width,html);
          op = op||0;
          used.add(id);
          return [id,width,op,name];
        }
      }else {

        // find in the symbol_cc_map using 'cc' as index
        // because of the input could be a Unicode character
        var cc = v.codePointAt(0);
        if(this.symbol_cc_map.has(cc)){
          let {id,width,op,html,name} = this.symbol_cc_map.get(cc);
          width = this.get_width_for_char(width,html);
          op = op||0;
          used.add(id);
          return [id,width,op,name];
        }
      }
    }
    return ['',0,0,''];
  }
  ///
  ///
  ///
  to_math_segment_array(str){
    ///This function is to be called for a piece of text mixed with regular text and html tags such as <svg> ... </svg>
    ///  need to extract the entire <svg> ... </svg> with other inner SVG's as a single segment
    str = str.trimLeft();
    var o = [];
    var v;
    while(str.length){
      if((v=this.re_svg.exec(str))!==null){
        var hdr = v[1];
        str = v[2];
        var [s,str] = this.extract_svg_element(str,1);
        var [w,h,mid] = this.extract_innersvg_attr(hdr);
        var p = ['\\svg',s,w,h,mid];
        o.push(p);
        str = str.trimLeft();
        continue;
      }
      if((v=this.re_span.exec(str))!==null){
        var tag = v[1];
        var att = v[2];
        str = v[3];
        var [s,str] = this.extract_span_element(str,1,tag);
        var p = ['\\text',s];
        o.push(p);
        str = str.trimLeft();
        continue;
      }
      if((v=this.re_entity.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(['\\entity',s])
        str = str.trimLeft();
        continue;
      }      
      if((v=this.re_segment.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        str = str.trimLeft();
        continue;
      }
      o.push(str);
      break;
    }
    return o;
  }
  ///
  ///
  ///
  to_cairo_segment_array(str,extent,factor,g){
    ///This function is to be called for a piece of text mixed with regular text and html tags such as <svg> ... </svg>
    ///  need to extract the entire <svg> ... </svg> with other inner SVG's as a single segment
    str = str.trimLeft();
    var o = [];
    var v;
    while(str.length){
      if((v=this.re_svg.exec(str))!==null){
        var hdr = v[1];
        str = v[2];
        var [s,str] = this.extract_svg_element(str,1);
        var [w,h,mid] = this.extract_innersvg_attr(hdr);
        var [vw,vh] = this.extract_viewBox_attr(hdr);
        if(w==0&&h==0&&mid==0){
          ///this is a diagram, does not need to be scaled down
          var [w,h,mid] = this.extract_width_height_attr(hdr,extent);
          var p = ['\\svg',s,w,h,mid,g,vw,vh];
          o.push(p);
        }else{
          ///this is a math, needs to be scaled down
          w *= 1.333*factor;
          h *= 1.333*factor;
          mid *= 1.333*factor;
          var p = ['\\svg',s,w,h,mid,g,vw,vh];
          o.push(p);
        }
        continue;
      }
      if((v=this.re_br.exec(str))!==null){
        var hdr = v[1];
        str = v[2];
        var s = '';
        var p = ['\\br',s,0,0,0,g];
        o.push(p);
        continue;
      }
      if((v=this.re_span.exec(str))!==null){
        var tag = v[1]; //such as 'span', 'b', 'i', 'em', etc.
        var att = v[2]; //this the attribute of the tag
        str = v[3];
        var [s,str] = this.extract_span_element(str,1,tag);
        let g1 = {...g};
        if(tag=='b'){
          g1.fontweight = 'bold';
        }else if(tag=='i'){
          g1.fontstyle = 'italic';
        }else if(tag=='tt'){
          g1.fontfamily = 'monospace';
        }
        let pp = this.to_cairo_segment_array(s,extent,factor,g1);
        for(let p of pp){
          o.push(p);
        }
        continue;
      }
      if((v=this.re_entity.exec(str))!==null){
        let s = v[1];
        str = v[2];
        if(s.startsWith('&#x')){
          var cc = s.slice(3,-1);
          cc = `0x${cc}`;
          cc = parseInt(cc);///return a decimal number
        }else{
          var cc = s.slice(2,-1);
          cc = parseInt(cc);///return a decimal number
        }
        o.push(['\\cc',cc,0,0,0,g]);
        continue;
      }      
      var cc = str.codePointAt(0);
      if(cc > 0xFFFF){
        str = str.substr(2);//need to extract two characters
      }else{
        str = str.substr(1);//need to extract one character
      }
      o.push(['\\cc',cc,0,0,0,g]);
      continue;
    }
    return o;
  }

  toNots (tokens) {
    /// to combine: ..., '\\not', '\\equiv', ...
    /// into:       ..., '\\not\\equiv', ...
    var o = [];
    while (tokens.length) {
      var s0 = tokens[0];
      tokens = tokens.slice(1);
      if(s0==='\\not'){
        var s1 = tokens[0];
        tokens = tokens.slice(1);
        s0 = `${s0}${s1}`;
        o.push(s0);
      } 
      else {
        o.push(s0);
      }
    }
    return o;
  }

  to_brace_group(l,math){
    ///this method is for used within a math phrase
    var o = [];
    var group = null;
    while (l.length) {
      [l,group] = this.getNextGroup(l);
      o.push(group);
    }
    return ['\\brace',o,'','',math];
  }

  to_math_group(l) {

    var o = [];
    var group = null;
    while (l.length) {
      [l,group] = this.getNextGroup(l);
      o.push(group);
    }
    return ['\\math',o];
  }

  toCleanup (g) {

    ///THIS FUNCTION IS CURRENTLY NOT USED BECAUSE THE LATEST CHAGNES TO PARSING
    ///STRINGS INTO TOKENS ARE NOT GOING TO HAVE EMPTY SPACES IN THEM

    /// THe goal of this funciton is to remove array elemetns that are constains nothing
    /// but spaces characters. It is called right after toGroup() but before toCommand(),
    /// at which time only the following keys are formed: \\brace, \\leftright and \\beginend.
    /// It also does one more thing which to 
    /// create a 5th element for the previous keys. This fifth element is a string
    /// that should be the exact replica of the original string that is inside the brace.
    /// For example, the string "hello world" will be re-constructed for \text{hello world}.
    /// This fifth element is the one that is used when translating the \text group.
    ///
    /// the 'inner' would have been an array of ['h','e','l','l','o',' ','w','o','r','l','d']
    /// we will create a 'raw' element which becomes the string 'hello world'. this variable
    /// is then assigned as the fifth element of the original group

    var inner0 = null;
    var re_empty = /^\s+$/;
    if (Array.isArray(g)) {
      var key = g[0];
      var inner  = g[1];
      var fence1 = g[2];
      var fence2 = g[3];
      var raw = inner.join('').toString();
      var inner = inner.map(x => this.toCleanup(x));
      var inner = inner.filter(x => (typeof x === 'string' && re_empty.test(x))?false:true);
      return [key,inner,fence1,fence2,raw];
    }
    return g;
  }

  findMathCommandInfo (cmdname) {
    for (var mathCommand of this.pjson.mathCommands) {
      if (mathCommand.name === cmdname) {
        return mathCommand;
      }
    }
    return null;
  }

  getNextCommand (items ) {

    /// the input is an array, and the output
    /// is an array of [items,command] where a command
    /// is an array with the first key and the rest
    /// arguments such as: ['\\frac','a','b']

    /// NOTE: each element of the input could be also be
    /// a group such as ['\\brace',...], thus, when this is
    /// is the case, we call this.to_math_commands() on this item and
    /// not doing anything.

    /// OR, if the first item is '\\frac'' then we will extract
    /// this item and the next two items to form a new command.

    var fence1;
    var fence2;
    var inner = [];
    var group = null;
    var group1 = null;
    var group2 = null;

    var item0 = items[0];
    if (Array.isArray(item0)) {

      items = items.slice(1);
      group = this.to_math_commands(item0);
      return [items,group];

    } else {

      var commandInfo = this.findMathCommandInfo(item0);
      if (commandInfo) {
        var o = [];
        var cmd = null;
        o.push(item0);
        items = items.slice(1);
        ///before we pop the next two elements from the input
        /// we will check to see if it has an 'option' flag set.
        /// If it is set then we check to see if the next three
        /// element looks like a set of bracket with an element
        /// in the middle
        if (commandInfo.option) {
          /// '[','2',']'...
          if (items[0] === '[' && items[2] === ']') {
            ///***the showanswer is yes***, so we need to push the optional item
            o.push(items[1]);
            items = items.slice(3);
          } else {
            ///***the showanswer is no***, but we still need to push an empty one
            o.push('');
          }
        }
        ///we will pop the next two element from the input
        /// and give it to this command
        for (var j=0; j < commandInfo.count; ++j) {
          [items,cmd] = this.getNextCommand(items);
          o.push(cmd);
        }
        return [items,o];

      } else {

        /// some exceptions such as '\\sqrt[n]'
        var re_nroot = /^\\sqrt\[(.*)\]$/;
        if (0 && re_nroot.test(item0)) {
          var m = re_nroot.exec(item0);
          var m1 = m[1];
          var item1 = items[1];
          items = items.slice(2);
          return [items,['\\nroot',m1,item1]];

        } else {

          return this.getNextToken(items);
        }
      }
    }
  }

  to_math_commands (g) {

    if (Array.isArray(g)) {
      var key = g[0];
      if (key==='\\pipe'||key==='\\math'||key==='\\brace'||key==='\\leftright'||key==='\\beginend') {
        var inner  = g[1];
        var fence1 = g[2];
        var fence2 = g[3];
        var raw    = g[4];

        var command = null;
        var o = [];
        while (inner.length) {
          [inner,command] = this.getNextCommand(inner);
          o.push(command);
        }
        return [key,o,fence1,fence2,raw];
      }
    }
    /// just return this 'g' untouched
    return g;
  }

  to_math_subsups (g) {

    var inner0 = null;
    var inner1 = null;
    var inner2 = null;
    var inner3 = null;
    var inner4 = null;
    if (Array.isArray(g)) {
      var key = g[0];
      if (key==='\\math' || key  === '\\brace' || key  === '\\leftright' || key === '\\beginend') {
        var inner  = g[1];
        var fence1 = g[2];
        var fence2 = g[3];
        var raw    = g[4];
        var o = [];
        var j = 0;
        while (j < inner.length) {
          inner0 = inner[j]
          inner1 = inner[j+1]
          inner2 = inner[j+2]
          inner3 = inner[j+3]
          inner4 = inner[j+4]
          if (inner1 === '_' && inner3 === '^') {
            o.push(['\\subsup',this.to_math_subsups(inner0),this.to_math_subsups(inner2),this.to_math_subsups(inner4)]);
            j += 5;
          } else if (inner1 === '^' && inner3 === '_') {
            o.push(['\\subsup',this.to_math_subsups(inner0),this.to_math_subsups(inner4),this.to_math_subsups(inner2)]);
            j += 5;
          } else if (inner1 === '_') {
            o.push(['\\sub',this.to_math_subsups(inner0),this.to_math_subsups(inner2)]);
            j += 3;
          } else if (inner1 === '^') {
            o.push(['\\sup',this.to_math_subsups(inner0),this.to_math_subsups(inner2)]);
            j += 3;
          } else {
            o.push(this.to_math_subsups(inner0));
            j += 1;
          }
        }
        return [key,o,fence1,fence2,raw];
      } else {
        if (g.length == 2) {
          return [key,this.to_math_subsups(g[1])];
        }
        if (g.length == 3) {
          return [key,this.to_math_subsups(g[1]),this.to_math_subsups(g[2])];
        }
        if (g.length == 4) {
          return [key,this.to_math_subsups(g[1]),this.to_math_subsups(g[2]),this.to_math_subsups(g[3])];
        }
      }
    }
    return g;
  }

  getNextToken (tokens) {
    var token = tokens[0];
    tokens = tokens.slice(1);
    return [tokens,token];
  }

  skipEmptyTokens (tokens) {
    while (tokens.length && tokens[0].match(/\s/)) {
      tokens = tokens.slice(1);
    }
    return tokens;
  }

  getNextGroup (tokens) {
    var v = null;
    var fence1;
    var fence2;
    var inner = [];
    var group = null;
    var group1 = null;
    var group2 = null;
    var group3 = null;
    var group4 = null;
    var token0 = null;
    var token1 = null;
    var token2 = null;
    var token3 = null;
    if (tokens[0] === '\\left') {

      tokens = tokens.slice(1);
      [tokens,fence1] = this.getNextToken(tokens);
      while (tokens.length) {
        if (tokens[0] === '\\right') {
          tokens = tokens.slice(1);
          [tokens,fence2] = this.getNextToken(tokens);
          break;
        } else {
          [tokens,group] = this.getNextGroup(tokens);
          inner.push(group);
        }
      }
      return [tokens,['\\leftright',inner,fence1,fence2]];

    } else if ((v = this.re_begin.exec(tokens[0])) !== null) {

      let name = v[1];
      var v2 = null;
      tokens = tokens.slice(1);
      while (tokens.length) {
        if ((v2 = this.re_end.exec(tokens[0])) !== null && v2[1] === name) {
          tokens = tokens.slice(1);
          break;
        } else {
          [tokens,group] = this.getNextGroup(tokens);
          inner.push(group);
        }
      }
      return [tokens,['\\beginend',inner,name,name]];

    } else if ((v = this.re_text_brace.exec(tokens[0])) !== null) {
  
      ///\text{Hello World}
      let str = v[1];
      tokens = tokens.slice(1);
      return [tokens,['\\text',str]];

    } else if ((v = this.re_hrule_brace.exec(tokens[0])) !== null) {
  
      ///\hrule{1}
      let opt = v[1];
      let str = v[2];
      tokens = tokens.slice(1);
      opt = opt.slice(1,-1);
      return [tokens,['\\hrule',str,opt]];

    } else if (tokens[0] === '\{') {

      tokens = tokens.slice(1);
      while (tokens.length) {
        if (tokens[0] === '\}') {
          tokens = tokens.slice(1);
          break;
        } else {
          [tokens,group] = this.getNextGroup(tokens);
          inner.push(group);
        }
      }
      return [tokens,['\\brace',inner]];

    } else {

      return this.getNextToken(tokens);

    }

  }

  toInnerSvg (v, used, pref) {

    /// 'v': is an element, such as '\alpha', '1', '+', or a group,
    /// such as: '\\pipe',      [Array], '', '', ...
    /// or:      '\\math',      [Array], '', '', ...
    /// or:      '\\brace',     [Array], '', '', ...
    /// or:      '\\leftright', [Array], '[', ']', ...
    /// or:      '\\beginend',  [Array], 'pmatrix', 'pmatrix', ...
    /// or:      '\\svg',       s, w, h, mid 
    /// or:      '\\entity',    s
    ///
    /// The return value of this function is an array of seven elements:
    ///           var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(...)
    ///  w_    this is a number expressing the width of the SVG in terms of pt
    ///  h_    this is a number expressing the height of the SVG in terms of pt
    ///  mid_  this is a number expresses vertically shift has to be in order to
    //         align this element with neighboring elements in a row.
    ///        It is a number expressing the distance from the top, in the unit of pt
    ///  s_    this is a string expressing a SVG element such as "<text> ... </text>"
    ///        or "<line />", or "<svg> ... </svg>"
    ///  g_    this is usually the same as the op= attribute of the element
    ///        that gives hint about whether it needs to add gaps before
    ///        and/or after this element
    ///  q_    this is a flag of 0/1 indicating whether a gap is forced after
    ///        this element, such as after a summation symbol.
    ///  id_   this is a string that is set to be the same as the id= attribute
    //         of the symbol; this is useful to let us know what symbol we are current
    //         laying out so we can space it accordingly. So far the only usage is
    //         when an open-parenthesis symbol is detected and the previous symbol is \log or
    //         like, the gap between the previous symbol and this open-parenthesis is
    //         suppressed; otherwise the gap is preserved;
    //   shiftdist_   the distance that this expression need to be shifted to the right in order
    //         align with a = after the '&'

    var x = 0;
    var y = 0;
    var w = 0;
    //var h = this.fs;
    var h = this.fh;
    var mid = h/2;
    var s = '';
    this.assert_pref_member(pref,'compact');
    this.assert_pref_member(pref,'frac');
    this.assert_pref_member(pref,'isinmatrix');
    this.assert_pref_member(pref,'isdmath');
    var compact = pref.compact;
    if (v === undefined || v === null) {
      //var s = `<use fill="currentColor" x="0" y="0" xlink:href="${my_udqu_id}" />`;
      //used.add(my_udqu_id);
      //var w = my_udqu_width;
      //w *= this.fs/12; 
      //return [w,this.fs,this.fs/2,s,0,0,''];
      var [id1,w1,op1] = this.findIdByElement('?',used);
      s = `<use fill="currentColor" xlink:href="#${id1}" />`;
      return [w1,h,mid,s,0,0,''];
    } else if (v === '') {
      return [0,0,0,'',0,0,''];
    } else if (v === '\\displaystyle') {
      pref.isdmath = 1;
      return [0,0,0,'',0,0,''];
    } else if (Array.isArray(v)) {
      const cmdname = v[0];
      switch (v[0]) {

        case '\\svg':
          w = v[2];
          h = v[3];
          mid = v[4];
          s = v[1];
          //s = `\n<svg innersvg="${w} ${h} ${mid}">${s}</svg>`;///cannot add innersvg here because it seems to have a problem of clipping the contents, need to find out why
          return [w,h,mid,s,0,0,''];
          break;

        case '\\entity':
          s = v[1];
          let m = this.findIdByEntity(s,used);
          var [id1,w1,op1] = m;
          s = `<use fill="currentColor" fill="currentColor" xlink:href="#${id1}" />`;
          return [w1,h,mid,s,op1,0,id1];
          break;
        
        case '\\beginend': 

          ///for 'beginend'

          var name = v[2];
          var p = this.splitArrayForBeginEnd(v[1]);
          
          /// figure out how many rows
          var nrow = p.length;
          var ncol = p.map(d => d.length).reduce((cur,acc) => Math.max(cur,acc));

          /// convert to inner svg for all cells
          for (let j=0; j < ncol; ++j) {
            for (let i=0; i < nrow; ++i) {
              let pv = p[i][j];
              if (pv) {
                p[i][j] = this.toInnerSvg(['\\brace',pv,'','',''],used,pref);
              }
            }
          }

          /// config parameters
          if(!Number.isFinite(pref.isinmatrix)){
            pref.isinmatrix = 0;
          }
          pref.isinmatrix += 1;
          const gap_w = 5.5 * this.fs/12;
          const gap_h = 1.0 * this.fs/12;
          var o = [];

          /// figure out the total width of the array
          var cols_w = []; /// indexed by the columns
          var rows_h = []; /// indexed by the rows
          cols_w.length = ncol;
          rows_h.length = nrow;
          let def_w = 6 * this.fs/12;
          let def_h = 6 * this.fs/12;
          cols_w.fill(def_w);
          rows_h.fill(def_h);
          /// now find out the row height for each row
          for (let j=0; j < ncol; ++j) {
            for (let i=0; i < nrow; ++i) {
              if (p[i][j]) {
                var [w_,h_,mid_,s_,g_,q_,id_] = p[i][j];
                rows_h[i] = Math.max(rows_h[i],h_);
              }
            }
          }
          /// now find out the col width for each col
          for (let j=0; j < ncol; ++j) {
            for (let i=0; i < nrow; ++i) {
              if (p[i][j]) {
                var [w_,h_,mid_,s_,g_,q_,id_] = p[i][j];
                cols_w[j] = Math.max(cols_w[j],w_);
              }
            }
          }
          /// now increase each col width by 10
          cols_w = cols_w.map(t => t + gap_w + gap_w);
          /// now increase each row height by 10
          rows_h = rows_h.map(t => t + gap_h + gap_h);
          /// now find out the total width of the array
          var array_w = cols_w.reduce((cur,acc) => cur + acc);
          var array_h = rows_h.reduce((cur,acc) => cur + acc);

          /// now we display all the cells
          var dy = 0;
          for (let i=0; i < nrow; ++i) {
            var dx = 0;
            for (let j=0; j < ncol; ++j) {
              if (p[i][j]) {
                var [w_,h_,mid_,s_,g_,q_,id_] = p[i][j];
                var bx = dx;
                var by = dy;
                var bw = cols_w[j];
                var bh = rows_h[i];
                if(name == 'cases'){
                  [bx,by] = this.findXyForFlushleft(w_,h_,bx,by,bw,bh);
                  o.push(`<svg x="${bx}pt" y="${by-gap_h}pt">`);
                }else{
                  [bx,by] = this.findXyForCenter(w_,h_,bx,by,bw,bh);
                  o.push(`<svg x="${bx-gap_w}pt" y="${by-gap_h}pt">`);
                }
                o.push(s_);
                o.push(`</svg>`);
              }
              dx += cols_w[j];
            }
            dy += rows_h[i];
          }

          //var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(['\\brace',p[0][0],'','',''],used,pref);
          //o.push(`<svg x="${10}pt" y="${10}pt">`);
          //o.push(s_);
          //o.push(`</svg>`);
          var w = array_w - gap_w - gap_w;
          var h = array_h - gap_h - gap_h;
          var mid = h/2.0;
          pref.isinmatrix -= 1;
          if (name == 'matrix') {
            return [w,h,mid,o.join('\n'),0,0,''];
          }
          ///now we need to add some fences for
          ///    pmatrix
          ///    bmatrix
          ///    Bmatrix
          ///    vmatrix
          ///    Vmatrix
          var s = o.join('\n');
          var fence1 = '';
          var fence2 = '';
          if (name == 'pmatrix') {
            fence1 = '(';
            fence2 = ')';
          } else if (name == 'bmatrix') {
            fence1 = '\\lbrack';
            fence2 = '\\rbrack';
          } else if (name == 'Bmatrix') {
            fence1 = '\\lbrace';
            fence2 = '\\rbrace';
          } else if (name == 'vmatrix') {
            fence1 = '\\vert';
            fence2 = '\\vert';
          } else if (name == 'Vmatrix') {
            fence1 = '\\Vert';
            fence2 = '\\Vert';
          } else if (name == 'cases') {
            fence1 = '\\lbrace';
            fence2 = '';
          } else {
            fence1 = '';
            fence2 = '';
          }
          if(1){
            let m = [w,h,mid,o.join('\n'),0,0,''];
            return this.to_fenced(m,fence1,fence2,used,'beginend');
          }  
          break;
      
        case '\\pipe':
        case '\\math':
        case '\\brace':
        case '\\leftright':
          
          var shiftdist = -1;
          var g = v[1];
          var w = 0;
          var h = this.fh;
          var mid = h/2;
          var results = g.map( (z) => this.toInnerSvg(z,used,pref) );
          var s = '';
          var o = [];
          for (let result of results) {
            /// compute the deepest height (h) and the deepest (mid)
            var [w_,h_,mid_,s_,g_,q_,id_] = result;
            h = (h > h_) ? h : h_;
            mid = (mid > mid_) ? mid : mid_;
          }
          var w = 0;
          if(v[0]=='\\math'||v[0]=='\\pipe'){
            w=this.math_gap;
          }
          ///this is the flag indicating if we need to add some gap
          // before an item; this flag needs to be revisited after
          // processing of each item
          var before_g = 0;
          var before_q = 0;
          var before_id = '';
          var before_id0 = '';
          var i = 0;
          var first_id = '';
          var last_id = '';
          for (i=0; i < results.length; i++){
            let result = results[i];
            var [w_,h_,mid_,s_,g_,q_,id_] = result;
            if(id_ == 'myAMPERSAND'){
              shiftdist = w;
              continue;
            }
            //if (w_ == 0) {
            if (s_ == '') {
              /// skip over blanks
              continue;
            }
            if (!first_id) {
              first_id = id_;
            }
            last_id = id_;
            /// this is to add an extra gap before and after
            if (i === 0) {
              
              /// do not need extra space before it if it is

              // the first item. Note for op=1 and op=2 the gap is optional,
              // but for op=3 the gap is mandatory;
              //
              // op=1    Used for operators such as +, -, and others such that
              //         the gap is to be added before/after, but the gap will
              //         disappear if in compact mode, such as when used in superscript/subscript
              // op=2    Only used for semicolon and comma, such that the gap is not
              //         needed before, but needed after; the gap will also disappear if in
              //         compact mode
              // op=3    Used for \log like operators, where the spacing is always needed before,
              //         and after, even in compact mode, such as "\log x". 
              //         However, the spacing after is removed if followed
              //         by a left parenthesis
              //
              // Note that 'op' is an attribute defined for each symbol by 'math.json.
              // It is returned by 'findIdByElement()' as the third array variable.
              // It is also returned as 'g' by 'toInnerSvg()'.
              //
              // The variable 'q' is designed to create mandatory space after
              // a symbol. It is used for symbol \lim, \int, \sum, and \prod, where
              // the space after it is always needed, even in compact mode. It is set
              // to 1 for \sum, \lim, and \prod, it is set to 2 for \int
              // 
            } else if (i === 1 && (before_id == 'myMI' || before_id == 'myPLUS')) {

              /// do not add gap if this is the second item and the previous item is a minus sign
              /// or a plus sign

            } else if (before_id == 'myLPAREN'){

              /// do not add gap if the previous item is a left parenthesis

            } else if (before_id0 == 'myLPAREN' && before_id == 'myMI') {

              /// do not add gap, this is for (+2 + ...)
            
            } else if (before_id0 == 'myLPAREN' && before_id == 'myPLUS') {

              /// do not add gap, this is for (-2 + ...)
            
            } else if (before_q == 1 ) {
              ///mandatory gap
              w += (this.extra_gap);

            } else if (before_q == 2 ) {
              ///mandatory gap for \\int
              w += (this.extra_gap + this.extra_gap_int);

            } else if (before_g == 3 ) {
              ///mandatory gap, suppressed if followed by a myLPAREN
              /// is is to suppress the gap beteen the 'log' and left-parenthesis
              /// immediately after it
              if (id_ === 'myLPAREN') {
              } else {
                w += (this.extra_gap);
              }
            } else if (before_g == 1) {
              if (!compact) {
                if(before_id=='myEQ'){
                  w += (this.extra_gap_eq);
                }else{
                  w += (this.extra_gap);
                }
              }

            } else if (before_g == 2) {
              if (!compact) {
                w += (this.extra_gap);
              }

            } else if (g_ == 1) {
              ///if current item requires an optional gap, then add it
              // only for non-compact layout
              if (!compact) {
                if(id_=='myEQ'){
                  w += (this.extra_gap_eq);
                }else{
                  w += (this.extra_gap);
                }
              }

            } else if (g_ == 3) {
              ///if current item requires a mandatory before-gap, then do it
              w += (this.extra_gap);

            }
            /// this is to push down those elements so that its
            /// mid line aligns with the mid line of the entire row.
            if (mid_ < mid) {
              // NOTE: this will apply to all component
              // except for the deepest (mid) component
              var dy = mid - mid_;
              //o.push(`<svg x="${w}pt" y="${dy}pt">${s_}</svg>`);
              o.push(`<g transform="translate(${w*1.333},${dy*1.333})" w="${w_*1.333}">${s_}</g>`);

              /// check to see if this component will be deeper than
              /// the computed (h)
              h_ += dy;
              h = (h > h_) ? h : h_;

            } else {
              //o.push(`<svg x="${w}pt" y="0">${s_}</svg>`);
              o.push(`<g transform="translate(${w*1.333},0)" w="${w_*1.333}">${s_}</g>`);

            }
            w += parseFloat(w_);
            before_g = g_;
            before_q = q_;
            before_id0 = before_id;
            before_id = id_;
          }
          /// add the extra 2.0pt if the 'p' flag of the last element is set 
          if((v[0]==='\\pipe' || v[0]==='\\math') && last_id && last_id.startsWith('my_')){
            let myid = last_id.slice(3);
            let p = this.pjson.symbol[myid];
            if(p && p.p){
              w += 2.0;
            }
          }
          ///
          if(v[0]==='\\leftright'){
            /// \\leftright
            s = o.join('\n');
            var fence1 = v[2];
            var fence2 = v[3];
            /// corrections
            if (fence1 === '\\\{') fence1 = '\\lbrace';
            if (fence1 === '\\\}') fence1 = '\\rbrace';
            if (fence2 === '\\\{') fence2 = '\\lbrace';
            if (fence2 === '\\\}') fence2 = '\\rbrace';
            /// corrections
            if (fence1 === '[') fence1 = '\\lbrack';
            if (fence1 === ']') fence1 = '\\rbrack';
            if (fence2 === '[') fence2 = '\\lbrack';
            if (fence2 === ']') fence2 = '\\rbrack';
            /// corrections
            if (fence1 === '\\lparen') fence1 = '(';
            if (fence1 === '\\rparen') fence1 = ')';
            if (fence2 === '\\lparen') fence2 = '(';
            if (fence2 === '\\rparen') fence2 = ')';
            /// corrections
            if (fence1 === '.') fence1 = '';
            if (fence2 === '.') fence2 = '';
            if(1){
              let m = [w,h,mid,s,0,0,''];
              return this.to_fenced(m,fence1,fence2,used,'leftright');
            }
          } else {
            s = o.join('\n');
            return [w,h,mid,s,0,0,last_id,shiftdist];
          }
          break;

        case '\\text':

          /// get the 'str'
          var v1 = v[1];
          var str = '';
          str = v1.toString();/// ensure this is text
          str = this.to_collapse_space_text(str);
          return this.to_text_element(str,pref);
          break;

        case '\\hrule':

          var v1 = v[1];
          var v2 = v[2];
          var str = '';
          str = v1.toString();
          var num = parseFloat(str);
          if(Number.isFinite(num)){
            w = num;
          }else{
            w = 1;
          }
          w *= this.fs;
          h = this.fh;
          var dy = (this.fh-this.fs)*0.25 + this.fs;
          mid = h/2;
          var o = [];
          if(v2){
            //let myt = this.get_fillin_label_at(pref.fillin,v2);
            let mymath = pref[v2]||'';
            if(mymath){
              let {w:wt_,h:ht_,s} = this.to_svgmath(mymath,pref,used,0);
              wt_ *= this.frac_rate;
              ht_ *= this.frac_rate;
              if(ht_ > h){
                let dh = ht_ - h;
                h += dh;
                mid += dh;
                dy += dh;
              }
              let dx = (w-wt_)/2;
              s = `<g transform="translate(${this.fix(dx*1.333)} 0) scale(${this.frac_rate},${this.frac_rate})"> ${s} </g>`;
              o.push(s);
            }
          }
          o.push(`<line x1="0pt" y1="${dy}pt" x2="${w}pt" y2="${dy}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\widehat':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0;
          var sunk = 3;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = 0;
          var y0 = 2.5;
          var xm = w/2;
          var ym = 0.5;
          var x1 = w;
          var y1 = 2.5;
          o.push(`<line x1="${x0}pt" y1="${y0}pt" x2="${xm}pt" y2="${ym}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${x1}pt" y1="${y1}pt" x2="${xm}pt" y2="${ym}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\overarc':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0;
          var sunk = 3;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = 0;
          var y0 = 3.0;
          var xm = w/2;//this is the x-position of the control point
          var ym = -0.50;//this is the y-position of the control point
          var x1 = w;
          var y1 = 3.0;
          //o.push(`<line x1="${x0}pt" y1="${y0}pt" x2="${xm}pt" y2="${ym}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          //o.push(`<line x1="${x1}pt" y1="${y1}pt" x2="${xm}pt" y2="${ym}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<path d="M ${x0*1.333},${y0*1.333} Q ${xm*1.333},${ym*1.333},${x1*1.333},${y1*1.333}" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\overline':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0.0;
          var sunk = 3;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          if(1){
            o.push(`<g transform="translate(${lead*1.333} ${sunk*1.333})"> ${s_} </g>`);
            if(0){
              var bar_y = 0.5;
              o.push(`<line x1="0" y1="${bar_y}pt" x2="${w}pt" y2="${bar_y}pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
            }else{
              let [ids_,ws_] = this.findIdByElement('&#x2594;',used);//this is the best choice so far
              //let [ids_,ws_] = this.findIdByElement('&#x203E;',used);
              //let [ids_,ws_] = this.findIdByElement('&#x0305;',used);
              //o.push(`<g transform="translate(${lead*1.333},0) scale(${w_/ws_},1)" > <use fill="currentColor" xlink:href="#${ids_}"/> </g>`);
              o.push(`<line x1="0pt" y1="1.5pt" x2="${w}pt" y2="1.5pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
            }
          }else{
            o.push(`<g transform="translate(${lead*1.333} ${sunk*1.333})"> ${s_} </g>`);
            o.push(`<line x1="0pt" y1="1.5pt" x2="${w}pt" y2="1.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          }
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\overrightarrow':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0.0;
          var sunk = 3;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          if(1){
            o.push(`<g transform="translate(${lead*1.333} ${sunk*1.333})"> ${s_} </g>`);
            if(0){
              var bar_y = 0.5;
              o.push(`<line x1="0" y1="${bar_y}pt" x2="${w}pt" y2="${bar_y}pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
            }else{
              //let [ids_,ws_] = this.findIdByElement('&#x2594;',used);//this is the best choice so far
              //let [ida_,wa_] = this.findIdByElement('&#x20D7;',used);//this is an right pointing arrow best for lowercase letter
              //let [ids_,ws_] = this.findIdByElement('&#x203E;',used);
              //let [ids_,ws_] = this.findIdByElement('&#x0305;',used);
              //o.push(`<g transform="translate(${lead*1.333},0) scale(${w_/wa_},1)" > <use fill="currentColor" xlink:href="#${ida_}"/> </g>`);
              o.push(`<line x1="0pt"    y1="1.5pt" x2="${w}pt"     y2="1.5pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
              o.push(`<line x1="${w}pt" y1="1.5pt" x2="${w-2.5}pt" y2="3pt"   style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
              o.push(`<line x1="${w}pt" y1="1.5pt" x2="${w-2.5}pt" y2="0pt"   style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
            }
          }else{
            o.push(`<g transform="translate(${lead*1.333} ${sunk*1.333})"> ${s_} </g>`);
            o.push(`<line x1="0pt" y1="1.5pt" x2="${w}pt" y2="1.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          }
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\overleftrightarrow':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0.0;
          var sunk = 3;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          if(1){
            o.push(`<g transform="translate(${lead*1.333} ${sunk*1.333})"> ${s_} </g>`);
            if(0){
              var bar_y = 0.5;
              o.push(`<line x1="0" y1="${bar_y}pt" x2="${w}pt" y2="${bar_y}pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
            }else{
              //let [ids_,ws_] = this.findIdByElement('&#x2594;',used);//this is the best choice so far
              //let [ida_,wa_] = this.findIdByElement('&#x20D7;',used);//this is an right pointing arrow best for lowercase letter
              //let [ids_,ws_] = this.findIdByElement('&#x203E;',used);
              //let [ids_,ws_] = this.findIdByElement('&#x0305;',used);
              //o.push(`<g transform="translate(${lead*1.333},0) scale(${w_/wa_},1)" > <use fill="currentColor" xlink:href="#${ida_}"/> </g>`);
              o.push(`<line x1="0pt"    y1="1.5pt" x2="${w}pt"     y2="1.5pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
              o.push(`<line x1="0pt"    y1="1.5pt" x2="2.5pt"      y2="3pt"   style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
              o.push(`<line x1="0pt"    y1="1.5pt" x2="2.5pt"      y2="0pt"   style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
              o.push(`<line x1="${w}pt" y1="1.5pt" x2="${w-2.5}pt" y2="3pt"   style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
              o.push(`<line x1="${w}pt" y1="1.5pt" x2="${w-2.5}pt" y2="0pt"   style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
            }
          }else{
            o.push(`<g transform="translate(${lead*1.333} ${sunk*1.333})"> ${s_} </g>`);
            o.push(`<line x1="0pt" y1="1.5pt" x2="${w}pt" y2="1.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          }
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\underleftrightarrow':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0.0; ///the arrow will protrude from either end for 2pt
          var sunk = 3;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 ;
          var o = [];
          o.push(`<g transform="translate(${lead*1.333} ${sunk*1.333})"> ${s_} </g>`);
          o.push(`<line x1="0pt"    y1="${h-1.5}pt" x2="${w}pt"     y2="${h-1.5}pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="0pt"    y1="${h-1.5}pt" x2="2.5pt"      y2="${h-3.0}pt" style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="0pt"    y1="${h-1.5}pt" x2="2.5pt"      y2="${h    }pt" style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${w}pt" y1="${h-1.5}pt" x2="${w-2.5}pt" y2="${h-3.0}pt" style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${w}pt" y1="${h-1.5}pt" x2="${w-2.5}pt" y2="${h    }pt" style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\underrightarrow':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0.0; ///the arrow will protrude from either end for 2pt
          var sunk = 3;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 ;
          var o = [];
          o.push(`<g transform="translate(${lead*1.333} ${sunk*1.333})"> ${s_} </g>`);
          o.push(`<line x1="0pt"    y1="${h-1.5}pt" x2="${w}pt"     y2="${h-1.5}pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${w}pt" y1="${h-1.5}pt" x2="${w-2.5}pt" y2="${h-3.0}pt" style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${w}pt" y1="${h-1.5}pt" x2="${w-2.5}pt" y2="${h    }pt" style="                  stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\dot':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///the arrow will protrude from either end for 2pt
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          var y = 1.5;
          y = this.lower(y,id_);
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          o.push(`<circle cx="${w/2}pt" cy="${y}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\ddot':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var minwidth = 4.0;
          var lead = Math.max(0,minwidth-w_)/2.0;
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 1.5;
          var y0 = this.lower(1.5,id_);
          var xm = w/2;
          var ym = this.lower(1.5,id_);
          var x1 = w/2 + 1.5;
          var y1 = this.lower(1.5,id_);
          o.push(`<circle cx="${x0}pt" cy="${y0}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<circle cx="${x1}pt" cy="${y1}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\dddot':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var minwidth = 5.0;
          var lead = Math.max(0,minwidth-w_)/2.0;
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 2.0;
          var y0 = this.lower(1.5,id_);
          var xm = w/2;
          var ym = this.lower(1.5,id_);
          var x1 = w/2 + 2.0;
          var y1 = this.lower(1.5,id_);
          o.push(`<circle cx="${x0}pt" cy="${y0}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<circle cx="${xm}pt" cy="${ym}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<circle cx="${x1}pt" cy="${y1}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\ddddot':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var minwidth = 7.0;
          var lead = Math.max(0,minwidth-w_)/2.0;
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 3.0;
          var y0 = this.lower(1.5,id_);
          var xm = w/2 - 1.0
          var ym = this.lower(1.5,id_);
          var xn = w/2 + 1.0
          var yn = this.lower(1.5,id_);
          var x1 = w/2 + 3.0;
          var y1 = this.lower(1.5,id_);
          o.push(`<circle cx="${x0}pt" cy="${y0}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<circle cx="${xm}pt" cy="${ym}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<circle cx="${xn}pt" cy="${yn}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<circle cx="${x1}pt" cy="${y1}pt" r="0.5pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\bar':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<g transform="translate(${lead*1.333},${sunk*1.333})">`);
          o.push(s_);
          o.push(`</g>`);
          var x0 = w/2 - 2.5;
          var y0 = this.lower(1.5,id_);
          var xm = w/2;
          var ym = this.lower(1.5,id_);
          var x1 = w/2 + 2.5
          var y1 = this.lower(1.5,id_);
          o.push(`<line x1="${x0}pt"  y1="${y0}pt"  x2="${x1}pt"     y2="${y1}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\vec':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(s_);
          var x0 = w/2 - 2.5;
          var y0 = this.lower(1.5,id_);
          var xm = w/2;
          var ym = this.lower(1.5,id_);
          var x1 = w/2 + 2.5
          var y1 = this.lower(1.5,id_);
          o.push(`<line x1="${x0}pt"  y1="${y0}pt"  x2="${x1}pt"     y2="${y1}pt"     style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${x1}pt"  y1="${y1}pt"  x2="${x1-2.0}pt" y2="${y1-1.5}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${x1}pt"  y1="${y1}pt"  x2="${x1-2.0}pt" y2="${y1+1.5}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\mathring':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 1.5;
          var y0 = this.lower(1.5,id_);
          var xm = w/2;
          var ym = this.lower(1.5,id_);
          var x1 = w/2 + 1.5
          var y1 = this.lower(1.5,id_);
          o.push(`<circle cx="${xm}pt" cy="${ym}pt" r="1.15pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\hat':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 2.5;
          var y0 = this.lower(2.5,id_);
          var xm = w/2;
          var ym = this.lower(0.5,id_);
          var x1 = w/2 + 2.5
          var y1 = this.lower(2.5,id_);
          o.push(`<line x1="${x0}pt"  y1="${y0}pt"  x2="${xm}pt" y2="${ym}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${x1}pt"  y1="${y1}pt"  x2="${xm}pt" y2="${ym}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\check':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 2.5;
          var y0 = this.lower(0.5,id_);
          var xm = w/2;
          var ym = this.lower(2.5,id_);
          var x1 = w/2 + 2.5
          var y1 = this.lower(0.5,id_);
          o.push(`<line x1="${x0}pt"  y1="${y0}pt"  x2="${xm}pt" y2="${ym}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          o.push(`<line x1="${x1}pt"  y1="${y1}pt"  x2="${xm}pt" y2="${ym}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\grave':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 1.5;
          var y0 = this.lower(0.5,id_);
          var xm = w/2;
          var ym = this.lower(1.5,id_);
          var x1 = w/2 + 1.5
          var y1 = this.lower(2.5,id_);
          o.push(`<line x1="${x0}pt"  y1="${y0}pt"  x2="${x1}pt"  y2="${y1}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\acute':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 1.5;
          var y0 = this.lower(2.5,id_);
          var xm = w/2;
          var ym = this.lower(1.5,id_);
          var x1 = w/2 + 1.5;
          var y1 = this.lower(0.5,id_);
          o.push(`<line x1="${x0}pt"  y1="${y0}pt"  x2="${x1}pt"  y2="${y1}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\breve':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 1.5
          var y0 = 1.5;
          var x1 = w/2 + 1.5
          var y1 = 0.0;
          var dy = this.lower(0,id_);
          y0 -= 1;
          y1 -= 1;
          x0 *= 1.33;
          y0 *= 1.33;
          x1 *= 1.33;
          y1 *= 1.33;
          o.push(`<svg x="-0.5pt" y="${dy}pt"><path d="M ${x0},${y0} a1,1 0 0,0 ${x1-x0} 0" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/></svg>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\tilde':
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var lead = 0; ///there will be no protruding from either end
          var sunk = 0;
          w = w_ + lead + lead;
          h = h_ + sunk;
          mid = h_/2 + sunk;
          var o = [];
          o.push(`<svg x="${lead}pt" y="${sunk}pt">`);
          o.push(s_);
          o.push(`</svg>`);
          var x0 = w/2 - 2.5;
          var y0 = this.lower(2.5,id_);
          var xm = w/2;
          var ym = this.lower(1.5,id_);
          var x1 = w/2 + 2.5
          var y1 = this.lower(0.5,id_);
          var zh = this.lower(0.0,id_);
          var zl = this.lower(3.0,id_);
          x0 *= 1.33;
          y0 *= 1.33;
          xm *= 1.33;
          ym *= 1.33;
          x1 *= 1.33;
          y1 *= 1.33;
          o.push(`<path d="M ${x0},${y0} Q ${(x0+xm)/2},${zh} ${xm},${ym} Q ${(xm+x1)/2},${zl*1.33} ${x1},${y1}" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\dif':
          /// \dif{x}

          var [idd_,wd_,op3_] = this.findIdByElement('d',used);
          var [w1_,h1_,mid1_,s1_,g1_,q1_,id1_] = this.toInnerSvg(v[1],used,pref);
          var w = wd_ + w1_;
          var h = h1_;
          var mid = mid1_;
          var o = [];
          if (1) {
            var dx = 0;
            var dy_for_d = mid1_-6;
            o.push(`<use fill="currentColor" transform="translate(${dx*1.333},0)" xlink:href="#${idd_}"/>`);
            dx += wd_;
            //o.push(`<svg x="${dx}pt" y="0">`);
            o.push(`<g transform="translate(${dx*1.333},0)">${s1_}</g>`);
            //o.push(s1_);
            //o.push(`</svg>`);
          }
          return [w,h,mid,o.join('\n'),1,0,'']; // it needs space before and after
          break;

        case '\\od':
        case '\\pd':

          ///'od' has an option=1
          /// \od{x^2}{x}
          ///   or
          /// \od[2]{x^2}{x}

          if(cmdname=='\\od'){
            var [idd_,wd_,op3_] = this.findIdByElement('d',used);
          }else{
            var [idd_,wd_,op3_] = this.findIdByElement('\\partial',used);
          }
          var hd_ = this.fh;
          var opt = v[1];

          /// get the superscript
          var [ids_,ws_,ops_] = this.findIdByElement(opt,used);
          var hs_ = this.fh;
          if (ws_) {
            var nws_ = ws_*this.sup_rate;
            var nhs_ = hs_*this.sup_rate;
            var ext = nhs_*0.30;///so the superscript '2' is to be on top of 'd' in the height of 30% of itself
          } else {
            var nws_ = 0;
            var nhs_ = 0;
            var ext = 0;
          }

          var [w1_,h1_,mid1_,s1_,g1_,q1_,id1_] = this.toInnerSvg(v[2],used,pref);
          var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = this.toInnerSvg(v[3],used,pref);
          var top_w = wd_ + nws_ + 1 + w1_;
          var bot_w = wd_ + 1 + w2_ + nws_;
          var top_h = Math.max(hd_+ext, h1_);
          var bot_h = Math.max(hd_, h2_+ext);
          ///top-part
          if (1) {
            var o = [];
            var dx = 0;
            /// letter 'd'
            o.push(`<use fill="currentColor" transform="translate(${dx*1.333},${(top_h-hd_)*1.333})" xlink:href="#${idd_}"/>`);
            /// letter '2'
            o.push(`<use fill="currentColor" transform="translate(${(dx+wd_)*1.333},${(top_h-hd_-ext)*1.333}) scale(${this.sup_rate})" xlink:href="#${ids_}"/>`);
            /// F(x)
            o.push(`<g transform="translate(${(dx+wd_+nws_+1)*1.333},${(top_h-h1_)*1.333})"> ${s1_} </g>`);
            var top_s = o.join('\n');
          }
          ///bot-part
          if (2) {
            var o = [];
            var dx = 0;
            // letter 'd'
            o.push(`<use fill="currentColor" transform="translate(${dx*1.333},${(bot_h-hd_)*1.333})" xlink:href="#${idd_}"/>`);
            // letter 'x'
            o.push(`<g transform="translate(${(dx+wd_+1)*1.333},${(bot_h-h2_)*1.333})"> ${s2_} </g>`);
            // letter '2'
            o.push(`<use fill="currentColor" transform="translate(${(dx+wd_+1+w2_)*1.333},${(bot_h-h2_-ext)*1.333}) scale(${this.sup_rate})" xlink:href="#${ids_}"/>`);
            var bot_s = o.join('\n');
          }
          var reduce_rate = this.frac_rate;
          if(reduce_rate < 1){
            top_w *= reduce_rate;
            top_h *= reduce_rate;
            bot_w *= reduce_rate;
            bot_h *= reduce_rate;
          }
          var w = Math.max(top_w,bot_w) + 2;
          var h = top_h + 1 + bot_h;
          if (top_w < bot_w) {
            var top_dx = 1 + (bot_w - top_w)/2;
            var bot_dx = 1;
          } else {
            var top_dx = 1;
            var bot_dx = 1 + (top_w - bot_w)/2;
          }
          var mid = top_h + 0.5;
          var o = [];
          var top_x = top_dx;
          var bot_x = bot_dx;
          var top_y = 0;         
          var bot_y = top_h + 1;
          o.push(`<g transform="translate(${top_x*1.333},${top_y*1.333}) scale(${reduce_rate})"> ${top_s} </g>`);
          o.push(`<g transform="translate(${bot_x*1.333},${bot_y*1.333}) scale(${reduce_rate})"> ${bot_s} </g>`);
          o.push(`<line x1="0pt" y1="${top_h+0.5}pt" x2="${w}pt" y2="${top_h+0.5}pt" style="stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          var newv = [w,h,mid,o.join('\n'),0,0,''];
          return newv;

          break;
        case '\\pmod':

          var [idlp_,wdlp_] = this.findIdByElement('(',used);
          var [idrp_,wdrp_] = this.findIdByElement(')',used);
          var [id_m_,wd_m_] = this.findIdByElement('m',used);
          var [id_o_,wd_o_] = this.findIdByElement('o',used);
          var [id_d_,wd_d_] = this.findIdByElement('d',used);
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[1],used,pref);
          var o = [];
          var dx = 0;
          var dy = 0;
          if(h_ > this.fh){
            dy = (h_-this.fh)/2;
          }
          o.push(`<use fill="currentColor" x="0" y="${dy}pt" xlink:href="#${idlp_}" />`);
          dx += wdlp_;
          o.push(`<use fill="currentColor" x="${dx}pt" y="${dy}pt" xlink:href="#${id_m_}" />`);
          dx += wd_m_;
          o.push(`<use fill="currentColor" x="${dx}pt" y="${dy}pt" xlink:href="#${id_o_}" />`);
          dx += wd_o_;
          o.push(`<use fill="currentColor" x="${dx}pt" y="${dy}pt" xlink:href="#${id_d_}" />`);
          dx += wd_d_;
          dx += 2;
          o.push(`<svg x="${dx}pt" >${s_}</svg>`);
          dx += w_;
          o.push(`<use fill="currentColor" x="${dx}pt" y="${dy}pt" xlink:href="#${idrp_}" />`);
          dx += wdrp_;
          var w = dx;
          var h = h_;
          var mid = mid_;
          return [w,h,mid,o.join('\n'),1,0,''];///1 here means need extract space before it

          break;
        case '\\sqrt':
          ///'sqrt' has an option=1
          ///NOTE: try to use U+23B7 radical symbol for this purpose
          ///NOTE: DO NOT use nested SVG because it clips the radical symbol that is outside of the box.

          var n = v[1];
          /// \sqrt{x} or \sqrt[4]{x}
          var [idr_, wr_] = this.findIdByElement('\\sqrt',used);//wrad_ contains the width of the radical symbol
          var hr_ = this.fh;
          var [w_,h_,mid_,s_,g_,q_,id_] = this.toInnerSvg(v[2],used,pref);
          var lead = wr_; 
          var sunk = 1.5;
          var ndx = 2;
          w = w_ + lead;
          h = h_ + sunk;
          mid = mid_ + sunk;
          var sy = h/this.fh;//scale factor on the y-dir
          var o = [];
          
          /// the \sqrt symbol
          o.push(`<svg y="${sunk}pt" width="${lead}pt" height="${h-sunk}pt" viewBox="0 0 ${(lead+1)*1.333} ${hr_*1.333}" preserveAspectRatio="none" > <use fill="currentColor" xlink:href="#${idr_}" /> </svg>`);

          /// the content
          o.push(`<g transform="translate(${lead*1.333},${sunk*1.333})"> ${s_} </g>`);

          /// the nth root
          if(n){
            let [ids_,ws_,ops_] = this.findIdByElement(n,used);
            var hs_ = this.fh;
            let nws_ = ws_*this.nroot_rate;
            let nhs_ = hs_*this.nroot_rate;
            o.push(`<g transform="translate(${ndx*1.333},-1) scale(${this.nroot_rate})" >`);
            o.push(`<use fill="currentColor" xlink:href="#${ids_}"/>`);
            o.push(`</g>`);
          }

          /// the top line
          if(0){
            // latest ways of using the box drawing character U+2594 which extends
            // all the way at the top to draw the top bar---instead of using line-element
            // this method ensure that the line width matches that of the sqrt symbol
            let [ids_,ws_] = this.findIdByElement('&#x2594;',used);
            o.push(`<g transform="translate(${lead*1.333},0) scale(${w_/ws_},1)" > <use fill="currentColor" xlink:href="#${ids_}"/> </g>`);
          }else{
            var bar_y = sunk;
            o.push(`<line x1="${lead}pt" y1="${bar_y}pt" x2="${w}pt" y2="${bar_y}pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
          }

          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\dfrac':
          var frac = pref.frac||0;
          var compact1 = (pref.isdmath)?0:1;
          var compact2 = (pref.isdmath)?0:1;
          var m1 = this.toInnerSvg(v[1],used,{...pref,frac,compact:compact1});
          var m2 = this.toInnerSvg(v[2],used,{...pref,frac,compact:compact1});
          return this.to_frac(m1,m2,1,0,pref.frac);
          break;

        case '\\frac':
          var frac = pref.frac||0;
          frac += 1;
          var compact1 = (pref.isdmath)?0:1;
          var compact2 = (pref.isdmath)?0:1;
          var m1 = this.toInnerSvg(v[1],used,{...pref,frac,compact:compact1});
          var m2 = this.toInnerSvg(v[2],used,{...pref,frac,compact:compact1});
          if(pref.isdmath){
            return this.to_frac(m1,m2,1,0,frac);
          }else{
            return this.to_frac(m1,m2,1,1,frac);
          }
          break;

        case '\\sfrac':
          var [w1_,h1_,mid1_,s1_,g1_,q1_,id1_] = this.shrink_svg(this.toInnerSvg(v[1],used,pref),this.frac_rate);
          var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = this.shrink_svg(this.toInnerSvg(v[2],used,pref),this.frac_rate);
          var w3_ = this.fs/4;
          var h3_ = this.fh;
          var w = w1_ + w3_ + w2_;
          var h = Math.max(h1_,h3_,h2_);
          var mid = h/2;
          var o = [];
          o.push(s1_);
          o.push(`<svg x="${w1_+w3_}pt" y="${h-h2_}pt">`);
          o.push(s2_);
          o.push(`</svg>`);
          o.push(`<line x1="${w1_+w3_+1}pt" y1="2pt" x2="${w1_-1}pt" y2="${h-1}pt" stroke="currentColor" />`);
          return [w,h,mid,o.join('\n'),0,0,''];
          break;

        case '\\dbinom':
          var frac = pref.frac||0;
          var m1 = this.toInnerSvg(v[1],used,{...pref,frac:frac+1});
          var m2 = this.toInnerSvg(v[2],used,{...pref,frac:frac+1});
          var [id1,w1,op1] = this.findIdByElement('(',used);
          var [id2,w2,op2] = this.findIdByElement(')',used);
          var [w,h,mid,s,g,q,id] = this.to_frac(m1,m2,0,0,pref.frac);
          var padding = this.extra_gap_int;//1pt gap
          var o = [];
          var x = 0;
          var y = 0;
          var sy = h/this.fh;
          o.push(`<use fill="currentColor" transform="translate(${(x)*1.333},${y})      scale(1,${sy})" xlink:href="#${id1}" />`);
          o.push(`<g transform="translate(${(x+w1+padding)*1.333},${y})" > ${s} </g>`);
          o.push(`<use fill="currentColor" transform="translate(${(x+w1+padding+w+padding)*1.333},${y}) scale(1,${sy})" xlink:href="#${id2}" />`);
          var s = o.join('\n');
          var w = w1 + padding + w + padding + w2;
          return [w,h,mid,s,g,q,id];
          break;

        case '\\binom':
          var frac = pref.frac||0;
          frac += 1;
          var m1 = this.toInnerSvg(v[1],used,{...pref,frac:frac+1});
          var m2 = this.toInnerSvg(v[2],used,{...pref,frac:frac+1});
          var [id1,w1,op1] = this.findIdByElement('(',used);
          var [id2,w2,op2] = this.findIdByElement(')',used);
          if(pref.isdmath){
            var [w,h,mid,s,g,q,id] = this.to_frac(m1,m2,0,0,frac);
          }else{
            var [w,h,mid,s,g,q,id] = this.to_frac(m1,m2,0,1,frac);
          }
          var padding = this.extra_gap_int;//1pt gap
          var o = [];
          var x = 0;
          var y = 0;
          var sy = h/this.fh;
          o.push(`<use fill="currentColor" transform="translate(${(x)*1.333},${y})      scale(1,${sy})" xlink:href="#${id1}" />`);
          o.push(`<g transform="translate(${(x+w1+padding)*1.333},${y})" > ${s} </g>`);
          o.push(`<use fill="currentColor" transform="translate(${(x+w1+padding+w+padding)*1.333},${y}) scale(1,${sy})" xlink:href="#${id2}" />`);
          var s = o.join('\n');
          var w = w1 + padding + w + padding + w2;
          return [w,h,mid,s,g,q,id];
          break;

        case '\\subsup':
        case '\\sub':
        case '\\sup':
          var compact1 = pref.compact;///the base item follows the parent instruction
          var compact2 = 1;///the sub item always compact (no extra space added between items in brace), must be set to 0/1
          var compact3 = 1;///the sup item always compact (no extra space added between items in brace), must be set to 0/1
          var q = 0;

          if (v[0] === '\\subsup') {
            var [w1_,h1_,mid1_,s1_,g1_,q1_,id1_] = this.toInnerSvg(v[1],used,{...pref,compact:compact1});
            var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = this.toInnerSvg(v[2],used,{...pref,compact:compact2});
            var [w3_,h3_,mid3_,s3_,g3_,q3_,id3_] = this.toInnerSvg(v[3],used,{...pref,compact:compact3});
            this.my_last_id = id3_;
          } else if (v[0] === '\\sub') {
            var [w1_,h1_,mid1_,s1_,g1_,q1_,id1_] = this.toInnerSvg(v[1],used,{...pref,compact:compact1});
            var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = this.toInnerSvg(v[2],used,{...pref,compact:compact2});
            var [w3_,h3_,mid3_,s3_,g3_,q3_,id3_] = [0,0,0,'',0,0];
            this.my_last_id = id2_;
          } else {
            var [w1_,h1_,mid1_,s1_,g1_,q1_,id1_] = this.toInnerSvg(v[1],used,{...pref,compact:compact1});
            var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = [0,0,0,'',0,0];
            var [w3_,h3_,mid3_,s3_,g3_,q3_,id3_] = this.toInnerSvg(v[2],used,{...pref,compact:compact3});
            this.my_last_id = id3_;
          }

          if (!pref.isinmatrix && pref.isdmath && (
                  v[1] === '\\sum' || 
                  v[1] === '\\prod' || 
                  v[1] === '\\lim'  )) {
            var o = [];
            var nw1_ = w1_    *1;///the returned size would have already been adjusted for isdstyle
            var nh1_ = h1_    *1;
            var nmid1_ = mid1_*1
            var sub_rate = this.sum_script_rate;
            var sup_rate = this.sum_script_rate;
            var nw2_ = w2_*sub_rate;
            var nh2_ = h2_*sub_rate;
            var nw3_ = w3_*sup_rate;
            var nh3_ = h3_*sup_rate;

            ///compute the max w
            var max_w = Math.max(nw1_,nw2_,nw3_);
            var dx1_ = (max_w - nw1_)/2;
            var dx2_ = (max_w - nw2_)/2;
            var dx3_ = (max_w - nw3_)/2;

            var h = 0;
            var exh = 4.5; /// this is to lower the upper limit so that it is close to the summation symbol---this is because the symmation symbol is not full height
            var exh = 4.5; /// this is to up the lower limit
            var mid = nh3_+nmid1_;

            //o.push(`<svg x="${dx3_}pt" y="${h+exh}pt" width="${nw3_}pt" height="${nh3_}pt" viewBox="0 0 ${w3_*1.333} ${h3_*1.333}">`);
            o.push(`<g transform="translate(${dx3_*1.333},${(h)*1.333}) scale(${sub_rate},${sub_rate})">`);
            o.push(s3_);
            o.push(`</g>`);
            //o.push(`</svg>`);
            h += nh3_;
            if(nh3_ > exh){
              h -= exh;
              mid -= exh;
            }

            //o.push(`<svg x="${dx1_}pt" y="${h}pt" width="${nw1_}pt" height="${nh1_}pt" viewBox="0 0 ${w1_*1.333} ${h1_*1.333}" preserveAspectRatio="none">`);
            o.push(`<g transform="translate(${dx1_*1.333},${(h)*1.333})">`)
            o.push(s1_);
            o.push(`</g>`);
            //o.push(`</svg>`);
            h += nh1_;
            if(nh2_ > exh){
              h -= exh;
            }

            //o.push(`<svg x="${dx2_}pt" y="${h}pt" width="${nw2_}pt" height="${nh2_}pt" viewBox="0 0 ${w2_*1.333} ${h2_*1.333}">`);
            o.push(`<g transform="translate(${dx2_*1.333},${(h)*1.333}) scale(${sub_rate},${sub_rate})">`);
            o.push(s2_);
            o.push(`</g>`);
            h += nh2_;
            //o.push(`</svg>`);
            return [Math.max(nw1_,nw2_,nw3_),h,mid,o.join('\n'),0,1,''];

          } else if (!pref.isinmatrix && pref.isdmath && 
                  v[1] === '\\int' ) {

            //INT

            //var [idtop_,wdtop_,optop_] = this.findIdByElement('\\inttop',used);
            //var [idbot_,wdbot_,opbot_] = this.findIdByElement('\\intbot',used);

            /// It lookes like the integral sign in display mode is fixed at a height of 12*2.6

            var nw1_   = w1_    ;
            var nh1_   = h1_    +2*this.fs/12;;//increase height by 1pt because the integration symbol font seems to protrude from the bottom
            var nmid1_ = mid1_  ;

            var nw2_ = w2_*this.sub_rate;
            var nh2_ = h2_*this.sub_rate;
            var nw3_ = w3_*this.sup_rate;
            var nh3_ = h3_*this.sup_rate;

            /// total height is the three combined
            //var h = nh2_ + nh1_ + nh3_;
            var h = nh1_;
            var mid = nmid1_;
            var exh = 5 * this.fs/12; /// this is to lower the upper limit so that it is close to the summation symbol---this is because the symmation symbol is not full height

            /// this is the dy position for all three components
            //var dy1 = nh2_;
            //var dy2 = nh2_ + nh1_;
            //var dy3 = 0;
            var dy1 = 0;//integral symbol
            var dy2 = nh1_ - nh2_;//lower script
            var dy3 = 0;//upper script

            var dx2 = 7 * this.fs/12;///shift right by 7pt
            var dx3 = 9 * this.fs/12;///shift right by 9pt

            var o = [];
            if (1) {
              var sy = nh1_/this.fh;///as a ratio to 12pt, thus if it is 13pt height then the ratio is 13/12
              o.push(`<g transform="translate(0,${dy1*1.333})">`);
              o.push(s1_);
              o.push(`</g>`);
            } 
            if (2) { //lower script
              //o.push(`<svg x="${dx2}pt" y="${dy2}pt" width="${nw2_}pt" height="${nh2_}pt" viewBox="0 0 ${w2_*1.333} ${h2_*1.333}">`);
              o.push(`<g transform="translate(${dx2*1.333},${dy2*1.333}) scale(${this.sub_rate},${this.sub_rate})">`);
              o.push(s2_);
              o.push(`</g>`);
              //o.push(`</svg>`);
            }
            if (3) { //upper script
              //o.push(`<svg x="${dx3}pt" y="${dy3}pt" width="${nw3_}pt" height="${nh3_}pt" viewBox="0 0 ${w3_*1.333} ${h3_*1.333}">`);
              o.push(`<g transform="translate(${dx3*1.333},${(dy3)*1.333}) scale(${this.sub_rate},${this.sub_rate})">`);
              o.push(s3_);
              o.push(`</g>`);
              //o.push(`</svg>`);
            }
            var extra_dx = 0.5;
            var w = Math.max(nw1_,(dx2+nw2_+extra_dx),(dx3+nw3_+extra_dx));
            var s = o.join('\n');
            return [w,h,mid,s,0,0,'']; /// q=0

          } else {

            /// THIS IS FOR INLINE-MATH      

            var o = [];
            var adjustment = this.fh/this.fs;
            var nw2_ = w2_*this.sub_rate*adjustment;
            var nh2_ = h2_*this.sub_rate*adjustment;
            var nw3_ = w3_*this.sup_rate*adjustment;
            var nh3_ = h3_*this.sup_rate*adjustment;
            /// following two variables express the amount of protrusion above the top of the base symbol for a superscript,
            /// and the protrusion below the bottom of the base symbol for a subsription,
            /// thus the total height of the expression is (supdy + h1_ + subdy)
            var supdy = nh3_ - (h1_*0.5);
            var subdy = nh2_ - (h1_*0.5);
            /// not less than zero
            supdy = Math.max(0,supdy);
            subdy = Math.max(0,subdy);
            /// following two variables adjusts the horizontal shift for super- and subscript
            if(v[1] === '\\int'){
              var supdx = w1_ + this.extra_gap_int;
              var subdx = w1_;
            } else {
              var supdx = w1_;
              var subdx = w1_;
            }
            /// following is the total w and h
            var w = this.max(supdx+nw3_, subdx+nw2_);
            var h = h1_+ subdy + supdy;
            var q = 0; // q is set to 1 for adding extra space after this element
            var mid = mid1_ + supdy;
            /// ready layout
            o.push(`<g transform="translate(0,${supdy*1.333})">`);
            o.push(s1_);
            o.push(`</g>`);
            //o.push(`<svg x="${subdx}pt" y="${h-nh2_}pt" width="${nw2_}pt" height="${nh2_}pt" viewBox="0 0 ${w2_*1.333} ${h2_*1.333}">`);
            //for SUB
            o.push(`<g transform="translate(${subdx*1.333},${(h-nh2_)*1.333}) scale(${adjustment*this.sub_rate})" >`)
            o.push(s2_);
            o.push(`</g>`);
            //o.push(`</svg>`);
            //o.push(`<svg x="${supdx}pt" width="${nw3_}pt" height="${nh3_}pt" viewBox="0 0 ${w3_*1.333} ${h3_*1.333}">`);
            //for SUP
            o.push(`<g transform="translate(${supdx*1.333},0) scale(${adjustment*this.sup_rate})" >`);
            o.push(s3_);
            o.push(`</g>`)
            //o.push(`</svg>`);
            return [w,h,mid,o.join('\n'),g1_,q,''];
          }
          break;

        default:
          throw new Error(`unhandled cmdname: '${v[0]}'`);

          break;

      } ///switch

    } else {

      //SINGLE ELEMENT

      ///
      /// ...this is an individual token!, such as 'a', 'b', '1', '2',
      ///    '&quot;', '\\emptyset', '\\mathcal{AB}', ...
      ///

      /// check for following
      ///
      ///   \\mathcal{AB},
      ///   \\mathbb{AB}, and
      ///   \\mathit{AB}
      ///
      var is_mathvariant = false;
      var m;
      if(this.re_variable.test(v)) {
        let symb = `${v}mathit`;
        var p = this.pjson.symbol[symb];//this should always work
        let id = 'my_' + symb;
        used.add(id);
        var width = this.get_width_for_char(p.width,p.html);
        var op = p.op||0;
        var s = `<use fill="currentColor" xlink:href="#${id}" />`;
        w = width;
        return [w,h,mid,s,0,0,id];
      }

      var [id,width,op] = this.findIdByElement(v,used);

      if (id === 'myINT') { 
        /// THIS is \\int symbol by itself, the goal here is to 
        /// enlarge the symbol if it is in displaymode and not inside a matrix,
        /// This change WILL propergate to \sub, \sup, and \subsup.
        var w = width;  
        var dx = 3;
        if(pref.isdmath && !pref.isinmatrix){
          w *= this.integral_enlarge_rate;
          h *= this.integral_enlarge_rate;
          mid *= this.integral_enlarge_rate;
          dx = 3;
        }
        if(1){
          var o = [];
          var sy = h/this.fh;///as a ratio to 12pt, thus if it is 13pt height then the ratio is 13/12
          o.push(`<use fill="currentColor" transform="translate(${dx},0) scale(1,${sy})" xlink:href="#${id}" />`);
        }
        s = o.join('\n');
        var q = 2;//q is set 2 for \\int
        return [w,h,mid,s,op,q,id];

      } else if (id === 'mySUM' || id === 'myPROD') { /// THIS is \\sum symbol by itself it is enlarged if 'isdstyle' is on
        //This is \sum and \prod. The code here intends to enlarge them 
        // if in isdmath mode and not inside a matrix
        var w = width;  
        if(pref.isdmath && !pref.isinmatrix){
          w *= this.summation_enlarge_rate;
          h *= this.summation_enlarge_rate;
          mid *= this.summation_enlarge_rate;
        }
        if(1){
          var o = [];
          var sx = w/width;
          var sy = h/this.fh;///as a ratio to 12pt, thus if it is 13pt height then the ratio is 13/12
          o.push(`<use fill="currentColor" transform="scale(${sx},${sy})" xlink:href="#${id}" />`);
        }
        s = o.join('\n');
        return [w,h,mid,s,op,1,id];


      } else if (id) {
        //A symbol that is defined by 'math.json',
        var s = `<use fill="currentColor" xlink:href="#${id}" />`
        var w = parseFloat(width);
        return [w,h,mid,s,op,0,id];
        
      } else if(v=='\\\\'){

        //ignore it
        return [0,0,0,'',0,0,''];

      } else if(v=='\\'){

        //ignore it
        return [0,0,0,'',0,0,''];

      } else if(v=='\}'){

        //ignore it
        return [0,0,0,'',0,0,''];

      } else {

        // if it is something like \abc, then treat it like an
        //operatorname
        if(this.re_loglikename.test(v)){
          var s = v.slice(1);
          if(this.has_html_math_operator(s)){
            s = this.get_html_math_operator(s);
          }else{
            s = this.to_collapse_space_text(s);
          }
          return this.to_operatorname_element(s,pref);
        }
        
        //Otherwise treat it like a text, for example, the asterisk character,
        ///if encountered in the math will treated set as such.
        v = this.to_collapse_space_text(v);
        return this.to_text_element(v,pref);
      }
    }
  }
  ///
  ///
  ///
  has_html_math_operator(s){
    var d = this.pjson.htmlMathOperators[s];
    return (d)?true:false;
  }
  ///
  ///
  ///
  get_html_math_operator(s){
    var d = this.pjson.htmlMathOperators[s];
    return d;
  }
  ///
  /// this method is to collapse two or more consecutive spaces into a single one
  ///
  to_collapse_space_text(text){
    var xx = text.split('');
    var newtext = '';
    for (var x of xx) {
      if (this.re_space.test(x) && newtext.length && this.re_space.test(newtext.charAt(newtext.length-1))) {
        // ingore
      } else {
        newtext += x;
      }
    }
    return newtext;
  }

  to_image_element(text){

    this.imgs.push(text);
    var s = `<img src="${text}" />`;
    var w = 0;
    var h = this.fh;
    var mid = h/2;
    return [w, h, mid, s, 0, 0, ''];
  }

  to_text_element(text,style){

    var totalw = this.measure_text_length(text,this.fs);
    text = this.translator.polish(style,text);

    var s = `<text dy="${this.text_dy_pt}pt" textLength="${totalw}pt" lengthAdjust="spacingAndGlyphs" style="stroke:none;fill:currentColor;font-size:${this.fs}pt">${text}</text>`
    var w = totalw;
    var h = this.fh;
    var mid = h/2;
    return [w, h, mid, s, 0, 0, ''];
  }

  to_operatorname_element(text,style){

    var totalw = this.measure_text_length(text,this.fs);
    text = this.translator.polish(style,text);

    var s = `<text dy="${this.text_dy_pt}pt" textLength="${totalw}pt" lengthAdjust="spacingAndGlyphs" style="stroke:none;fill:currentColor;font-size:${this.fs}pt">${text}</text>`
    var w = totalw;
    var h = this.fh;
    var mid = h/2;
    return [w, h, mid, s, 3, 0, ''];
  }

  lower(y,id) {
    var dy = this.pjson.smallLetters[id];
    if (dy) {
      dy = parseFloat(dy);
      if (Number.isFinite(dy)) {
        return y + dy;
      }
    }
    return y;
  }

  to_latex_fontsize(fs) {
    ///INPUT is 'normalsize', 'small', 'footnotesize', etc.
    var p = this.pjson.latex_fontsizes[fs];
    if (p) {
      return p;
    }
    return '';
  }

  ///
  ///build innersvg using innersvg
  ///
  to_sidebyside(mm){
    ///figure out the mid for everyone
    var w = 0;
    var h = this.fh;
    var mid = this.fh/2;
    var o = [];
    for (let m of mm) {
      /// compute the deepest height (h) and the deepest (mid)
      var [w_,h_,mid_,s_,g_,q_,id_] = m;
      h = (h > h_) ? h : h_;
      mid = (mid > mid_) ? mid : mid_;
    }
    for(let m of mm){
      var [w_,h_,mid_,s_,g_,q_,id_] = m;
      if (mid_ < mid) {
        /// this is to push down those elements so that its
        /// mid line aligns with the mid line of the entire row.
        // NOTE: this will apply to all component
        // except for the deepest (mid) component
        var dy = mid - mid_;
        o.push(`<g transform="translate(${w*1.333},${dy*1.333})" w="${w_*1.333}">${s_}</g>`);
        /// check to see if this component will be deeper than
        /// the computed (h)
        h_ += dy;
        h = (h > h_) ? h : h_;
      } else {
        o.push(`<g transform="translate(${w*1.333},0)" w="${w_*1.333}">${s_}</g>`);
      }
      w += parseFloat(w_);
    }
    var s = o.join('\n');
    return [w,h,mid,s,0,0,''];
  }
  to_sqrt(m1,used){
    var [idr_, wr_] = this.findIdByElement('\\sqrt',used);//wrad_ contains the width of the radical symbol
    var hr_ = this.fh;
    var [w_,h_,mid_,s_,g_,q_,id_] = m1;
    var lead = wr_; 
    var sunk = 1.5;
    var w = w_ + lead;
    var h = h_ + sunk;
    var mid = mid_ + sunk;
    var o = [];
    /// the \sqrt symbol
    o.push(`<svg y="${sunk}pt" width="${lead}pt" height="${h-sunk}pt" viewBox="0 0 ${(lead+1)*1.333} ${hr_*1.333}" preserveAspectRatio="none" > <use fill="currentColor" xlink:href="#${idr_}" /> </svg>`);
    /// the content
    o.push(`<g transform="translate(${lead*1.333},${sunk*1.333})"> ${s_} </g>`);
    /// the top line
    if(0){
      // latest ways of using the box drawing character U+2594 which extends
      // all the way at the top to draw the top bar---instead of using line-element
      // this method ensure that the line width matches that of the sqrt symbol
      let [ids_,ws_] = this.findIdByElement('&#x2594;',used);
      o.push(`<g transform="translate(${lead*1.333},0) scale(${w_/ws_},1)" > <use fill="currentColor" xlink:href="#${ids_}"/> </g>`);
    }else{
      var bar_y = sunk+1;
      o.push(`<line x1="${lead}pt" y1="${bar_y}pt" x2="${w}pt" y2="${bar_y}pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
    }
    return [w,h,mid,o.join('\n'),0,0,''];
  }

  to_root(m1,n,used){
    var [idr_, wr_] = this.findIdByElement('\\sqrt',used);//wrad_ contains the width of the radical symbol
    var hr_ = this.fh;
    var [w_,h_,mid_,s_,g_,q_,id_] = m1;
    var lead = wr_; 
    var sunk = 1.5;
    var w = w_ + lead;
    var h = h_ + sunk;
    var mid = mid_ + sunk;
    var o = [];
    /// the \sqrt symbol
    o.push(`<svg y="${sunk}pt" width="${lead}pt" height="${h-sunk}pt" viewBox="0 0 ${(lead+1)*1.333} ${hr_*1.333}" preserveAspectRatio="none" > <use fill="currentColor" xlink:href="#${idr_}" /> </svg>`);
    /// the content
    o.push(`<g transform="translate(${lead*1.333},${sunk*1.333})"> ${s_} </g>`);
    /// the nth root
    if(n){
      let [ids_,ws_,ops_] = this.findIdByElement(n,used);
      var hs_ = this.fs;
      let nws_ = ws_*this.nroot_rate;
      let nhs_ = hs_*this.nroot_rate;
      let ndx = 1.5;
      let ndy = -1;
      let nroot_rate = this.nroot_rate; nroot_rate = 0.65;
      o.push(`<g transform="translate(${ndx*1.333},${ndy*1.333}) scale(${nroot_rate})" >`);
      o.push(`<use fill="currentColor" xlink:href="#${ids_}"/>`);
      o.push(`</g>`);
    }
    /// the top line
    if(0){
      // latest ways of using the box drawing character U+2594 which extends
      // all the way at the top to draw the top bar---instead of using line-element
      // this method ensure that the line width matches that of the sqrt symbol
      let [ids_,ws_] = this.findIdByElement('&#x2594;',used);
      o.push(`<g transform="translate(${lead*1.333},0) scale(${w_/ws_},1)" > <use fill="currentColor" xlink:href="#${ids_}"/> </g>`);
    }else{
      var bar_y = sunk+1;
      o.push(`<line x1="${lead}pt" y1="${bar_y}pt" x2="${w}pt" y2="${bar_y}pt" style="stroke-width:1pt; stroke:currentColor; fill:none; font-size:${this.fs}pt;"/>`);
    }
    return [w,h,mid,o.join('\n'),0,0,''];
  }

  to_frac(m1,m2,isline,isreduce,nfrac){
    var reduce_rate = 1;
    if(isreduce && nfrac===1){
      reduce_rate = this.frac_rate; 
    }
    var [w1_,h1_,mid1_,s1_,g1_,q1_,id1_] = m1;
    var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = m2;
    var top_w = w1_;
    var top_h = h1_;
    var bot_w = w2_;
    var bot_h = h2_;
    var top_s = s1_;
    var bot_s = s2_;
    if(isline){
      var xw = 2.0;
    }else{
      var xw = 0.5;
    }
    var xh = 0.0;
    var xhh = xh;
    var w = Math.max(top_w,bot_w) + xw + xw;
    var h = top_h + xh + bot_h;
    var mid = top_h + xhh;
    if (top_w < bot_w) {
      var top_dx = xw + (bot_w - top_w)/2;
      var bot_dx = xw;
    } else {
      var top_dx = xw;
      var bot_dx = xw + (top_w - bot_w)/2;
    }
    var o = [];
    var top_x = top_dx;
    var bot_x = bot_dx;
    var top_y = 0;         
    var bot_y = top_h + xh;
    o.push(`<g transform="translate(${top_x*1.333},${top_y*1.333}) "> ${top_s} </g>`);
    o.push(`<g transform="translate(${bot_x*1.333},${bot_y*1.333}) "> ${bot_s} </g>`);
    if(isline){
      o.push(`<line x1="0pt" y1="${top_h-0.5}pt" x2="${w}pt" y2="${top_h-0.5}pt" stroke="currentColor" />`);
    }
    var s = o.join('\n');
    s = `<g transform="scale(${reduce_rate})"> ${s} </g>`;
    w *= reduce_rate;
    h *= reduce_rate;
    mid *= reduce_rate;
    var newv = [w,h,mid,s,0,0,''];
    return newv;
  }

  to_subsup(m1,m2,m3){
    var [w1_,h1_,mid1_,s1_,g1_,q1_,id1_] = m1;
    var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = m2;
    var [w3_,h3_,mid3_,s3_,g3_,q3_,id3_] = m3;
    var o = [];
    var adjustment = this.fh/this.fs;
    var nw2_ = w2_*this.sub_rate*adjustment;
    var nh2_ = h2_*this.sub_rate*adjustment;
    var nw3_ = w3_*this.sup_rate*adjustment;
    var nh3_ = h3_*this.sup_rate*adjustment;
    /// following two variables express the amount of protrusion above the top of the base symbol for a superscript,
    /// and the protrusion below the bottom of the base symbol for a subsription,
    /// thus the total height of the expression is (supdy + h1_ + subdy)
    var supdy = nh3_ - (h1_*0.5);
    var subdy = nh2_ - (h1_*0.5);
    /// not less than zero
    supdy = Math.max(0,supdy);
    subdy = Math.max(0,subdy);
    /// following two variables adjusts the horizontal shift for super- and subscript
    if(id1_ === 'myINT'){
      var supdx = w1_ + this.extra_gap_int;
      var subdx = w1_;
    } else {
      var supdx = w1_;
      var subdx = w1_;
    }
    /// following is the total w and h
    var w = this.max(supdx+nw3_, subdx+nw2_);
    var h = h1_+ subdy + supdy;
    var q = 0; // q is set to 1 for adding extra space after this element
    var mid = mid1_ + supdy;
    /// ready layout
    o.push(`<g transform="translate(0,${supdy*1.333})">`);
    o.push(s1_);
    o.push(`</g>`);
    //o.push(`<svg x="${subdx}pt" y="${h-nh2_}pt" width="${nw2_}pt" height="${nh2_}pt" viewBox="0 0 ${w2_*1.333} ${h2_*1.333}">`);
    //for SUB
    o.push(`<g transform="translate(${subdx*1.333},${(h-nh2_)*1.333}) scale(${adjustment*this.sub_rate})" >`)
    o.push(s2_);
    o.push(`</g>`);
    //o.push(`</svg>`);
    //o.push(`<svg x="${supdx}pt" width="${nw3_}pt" height="${nh3_}pt" viewBox="0 0 ${w3_*1.333} ${h3_*1.333}">`);
    //for SUP
    o.push(`<g transform="translate(${supdx*1.333},0) scale(${adjustment*this.sup_rate})" >`);
    o.push(s3_);
    o.push(`</g>`)
    //o.push(`</svg>`);
    var s = o.join('\n')
    return [w,h,mid,s,g1_,q,''];
  }

  to_limits(w1_,h1_,s1_,m2,m3,rate_x,rate_y){
    var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = m2;
    var [w3_,h3_,mid3_,s3_,g3_,q3_,id3_] = m3;
    var o = [];
    var mid1_ = h1_*0.5;
    var nw1_ = w1_    *rate_x;
    var nh1_ = h1_    *rate_y;
    var nmid1_ = mid1_*rate_y;
    var adjustment = this.fh/this.fs;
    var nw2_ = w2_*this.sub_rate*adjustment;
    var nh2_ = h2_*this.sub_rate*adjustment;
    var nw3_ = w3_*this.sup_rate*adjustment;
    var nh3_ = h3_*this.sup_rate*adjustment;

    ///compute the max w
    var max_w = Math.max(nw1_,nw2_,nw3_);
    var dx1_ = (max_w - nw1_)/2;
    var dx2_ = (max_w - nw2_)/2;
    var dx3_ = (max_w - nw3_)/2;

    var h = 0;
    var exh = 0; /// this is to lower the upper limit so that it is close to the summation symbol---this is because the symmation symbol is not full height
    //o.push(`<svg x="${dx3_}pt" y="${h+exh}pt" width="${nw3_}pt" height="${nh3_}pt" viewBox="0 0 ${w3_*1.333} ${h3_*1.333}">`);
    o.push(`<g transform="translate(${dx3_*1.333},${(h+exh)*1.333}) scale(${this.sup_rate*adjustment})">`);
    o.push(s3_);
    o.push(`</g>`);
    //o.push(`</svg>`);
    h += nh3_;

    //o.push(`<svg x="${dx1_}pt" y="${h}pt" width="${nw1_}pt" height="${nh1_}pt" viewBox="0 0 ${w1_*1.333} ${h1_*1.333}" preserveAspectRatio="none">`);
    var exh = (this.fh-this.fs)*rate_y*0.90;
    o.push(`<g transform="translate(${dx1_*1.333},${(h-exh)*1.333}) scale(${rate_x},${rate_y})">`)
    o.push(s1_);
    o.push(`</g>`);
    //o.push(`</svg>`);
    h += nh1_;

    //o.push(`<svg x="${dx2_}pt" y="${h}pt" width="${nw2_}pt" height="${nh2_}pt" viewBox="0 0 ${w2_*1.333} ${h2_*1.333}">`);
    o.push(`<g transform="translate(${dx2_*1.333},${(h)*1.333}) scale(${this.sub_rate*adjustment})">`);
    o.push(s2_);
    o.push(`</g>`);
    //o.push(`</svg>`);
    var s = o.join('\n');
    return [Math.max(nw1_,nw2_,nw3_),nh1_+nh2_+nh3_,nh3_+nmid1_,s,0,1,''];
  }

  to_integral(w1_,h1_,s1_,m2,m3){
    var [w2_,h2_,mid2_,s2_,g2_,q2_,id2_] = m2;
    var [w3_,h3_,mid3_,s3_,g3_,q3_,id3_] = m3;
    var o = [];
    var mid1_ = h1_*0.5;
    var nw1_ = w1_    ;
    var nh1_ = h1_    ;
    var nmid1_ = mid1_;
    var adjustment = this.fh/this.fs;
    var nw2_ = w2_*this.sub_rate*adjustment;
    var nh2_ = h2_*this.sub_rate*adjustment;
    var nw3_ = w3_*this.sup_rate*adjustment;
    var nh3_ = h3_*this.sup_rate*adjustment;

    ///compute the max w
    var max_w = Math.max(nw1_,nw2_,nw3_);
    var dx1_ = (max_w - nw1_)/2;
    var dx2_ = (max_w - nw2_)/2;
    var dx3_ = (max_w - nw3_)/2;

    ///dx3_ is the width of the integral sign
    dx3_ = nw1_;

    var h = 0;
    var exh = 0; /// this is to lower the upper limit so that it is close to the summation symbol---this is because the symmation symbol is not full height
    o.push(`<g transform="translate(${dx3_*1.333},${(h+exh)*1.333}) scale(${this.sup_rate*adjustment})">`);
    o.push(s3_);
    o.push(`</g>`);
    h += nh3_;

    var exh = (this.fh-this.fs)*0.90;
    o.push(`<g transform="translate(${dx1_*1.333},${(h-exh)*1.333})">`)
    o.push(s1_);
    o.push(`</g>`);
    h += nh1_;

    o.push(`<g transform="translate(${dx2_*1.333},${(h)*1.333}) scale(${this.sub_rate*adjustment})">`);
    o.push(s2_);
    o.push(`</g>`);
    var s = o.join('\n');
    var w = Math.max((nw1_ + nw3_),nw2_);
    var h = nh1_ + nh2_ + nh3_;
    var mid = nh3_ + nmid1_;
    return [w,h,mid,s,0,0,''];
  }
  to_fenced(m,fence1,fence2,used,type){
    var [w,h,mid,s] = m;
    var [id1,w1,op1] = this.findIdByElement(fence1,used);
    var [id2,w2,op2] = this.findIdByElement(fence2,used);
    var padding = this.extra_gap; //gaps for +
    var h1 = this.fh; var sy1 = h/h1;
    var h2 = this.fh; var sy2 = h/h2;
    var sx = 1;
    var o = [];
    o.push(`<use fill="currentColor" transform="scale(${sx},${sy1})" xlink:href="#${id1}" />`);
    o.push(`<g transform="translate(${(w1+padding)*1.333},0)" > ${s} </g>`);
    o.push(`<use fill="currentColor" transform="translate(${(w1+padding+w+padding)*1.333},0) scale(${sx},${sy2})" xlink:href="#${id2}" />`);
    w = w1 + padding + w + padding + w2;
    var s = o.join('\n');
    var m = [w,h,mid,s,0,0,''];
    return m;
  }
  __to_fenced(m,fence1,fence2,used,type){
    //NOTE: the 'type' contains a string that is either 'beginend' or 'leftright'. 
    //      for 'beginend' we would like to add some paddings, but for 'leftright' we dont
    var [w,h,mid,s] = m;
    var [id1,w1,op1] = this.findIdByElement(fence1,used);
    var [id2,w2,op2] = this.findIdByElement(fence2,used);
    var SY = h/this.fh;
    var sy = h/this.fh/2.0;
    if(type=='beginend'){
      var padding_h = 0.5*this.fs;
    }else{
      var padding_h = 0;
    }
    var o = [];
    var x1 = 0;
    var yt = padding_h*1.333;
    var yb = (padding_h+0.5*h)*1.333;
    if(type=='beginend' && id1=='myLB'){
      var [top_id,w1] = this.findIdByElement('\\lmoustache',used);
      var [bot_id,w1] = this.findIdByElement('\\rmoustache',used);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
    }else if(type=='beginend' && id1=='myLPAREN'){
      var [top_id,w1] = this.findIdByElement('\\lparenupper',used);
      var [bot_id,w1] = this.findIdByElement('\\lparenlower',used);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
    }else if(type=='beginend' && id1=='myLBR'){
      var [top_id,w1] = this.findIdByElement('\\lbrackupper',used);
      var [bot_id,w1] = this.findIdByElement('\\lbracklower',used);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
    }else if(type=='beginend' && id1=='my_vert'){
      var [top_id,w1] = this.findIdByElement('\\lbrackexten',used);
      var [bot_id,w1] = this.findIdByElement('\\lbrackexten',used)
      o.push(`<use fill="currentColor" transform="translate(${x1},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
    }else if(type=='beginend' && id1=='my_Vert'){
      var [top_id,w1h] = this.findIdByElement('\\lbrackextenh',used);
      var [bot_id,w1h] = this.findIdByElement('\\lbrackextenh',used);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x1},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x1+(w1h)*1.333},${yt})            scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x1+(w1h)*1.333},${yb})            scale(1,${sy})" xlink:href="#${bot_id}" />`);
      w1 = w1h + w1h;
    }else{
      o.push(`<use fill="currentColor" transform="translate(${x1},${yt})                        scale(1,${SY})" xlink:href="#${id1}" />`);
    }
    ///
    var x2 = (w1+w)*1.333;
    ///
    if(type=='beginend' && id2=='myRB'){
      var [top_id,w2] = this.findIdByElement('\\rmoustache',used);
      var [bot_id,w2] = this.findIdByElement('\\lmoustache',used);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
    }else if(type=='beginend' && id2=='myRPAREN'){
      var [top_id,w2] = this.findIdByElement('\\rparenupper',used);
      var [bot_id,w2] = this.findIdByElement('\\rparenlower',used);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
    }else if(type=='beginend' && id2=='myRBR'){
      var [top_id,w2] = this.findIdByElement('\\rbrackupper',used);
      var [bot_id,w2] = this.findIdByElement('\\rbracklower',used);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
    }else if(type=='beginend' && id2=='my_vert'){
      var [top_id,w2] = this.findIdByElement('\\rbrackexten',used);
      var [bot_id,w2] = this.findIdByElement('\\rbrackexten',used);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
    }else if(type=='beginend' && id2=='my_Vert'){
      var [top_id,w2h] = this.findIdByElement('\\rbrackextenh',used);
      var [bot_id,w2h] = this.findIdByElement('\\rbrackextenh',used);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yt})                        scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x2},${yb})                        scale(1,${sy})" xlink:href="#${bot_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x2+(w2h)*1.333},${yt})            scale(1,${sy})" xlink:href="#${top_id}" />`);
      o.push(`<use fill="currentColor" transform="translate(${x2+(w2h)*1.333},${yb})            scale(1,${sy})" xlink:href="#${bot_id}" />`);
      w2 = w2h + w2h;
    }else{
      o.push(`<use fill="currentColor" transform="translate(${x2},${yt})                        scale(1,${SY})" xlink:href="#${id2}" />`);
    }
    ///
    var xs = (w1)*1.333; 
    ///
    o.push(`<g transform="translate(${xs},${yt})" > ${s} </g>`);
    w = w1 + w + w2;
    h = h + padding_h + padding_h;
    mid = mid + padding_h;
    s = o.join('\n');
    var m = [w,h,mid,s,0,0,''];
    return m;
  }
  to_fence_lbrace(x,y,w,h,used){
    var o = [];
    o.push(`<use fill="currentColor" transform="scale(1,${sy})" xlink:href="#myLMOUSTACHE" />`);
    o.push(`<use fill="currentColor" transform="translate(0,${h*0.5*1.333}) scale(1,${sy})" xlink:href="#myRMOUSTACHE" />`);
    used.add('myLMOUSTACHE');
    used.add('myRMOUSTACHE');
    return o.join('\n');
  }
  
  is_mathvariant_expr(str){
    return my_math_variants_re.test(str);
  }

  // might throw an exception
  get_mathvariant(vname,alpha,field){
    var id = `${vname}-${alpha}`;
    if(pjson.fontVariants[vname]){
      for(var v of this.pjson.fontVariants[vname]){
        if(id.localeCompare(v.id)===0){
          return v[field];
        }
      }
    }
    throw 'error';
  }

  // get the font name
  has_font_name_for_cc(cc){
    if(this.symbol_cc_map.has(cc)){
      let {fonts} = this.symbol_cc_map.get(cc);
      if(fonts){
        return true;
      }
    }
    return false;
  }

  // get the font name
  get_font_name_for_cc(cc){
    if(this.symbol_cc_map.has(cc)){
      let {fonts} = this.symbol_cc_map.get(cc);
      if(fonts){
        return fonts;
      }
    }
    throw 'error';
  }

  // might throw an exception
  get_symbol_comment(name){
    if(pjson.alt_symbol[name]){
      ///search in 'alt_symbol' arry first
      name = this.pjson.alt_symbol[name];
    }
    if(pjson.symbol[name]){
      var v = this.pjson.symbol[name];
      var s = v.comment||'';
      return s;
    }
    throw 'error';
  }
  
  ////////////////////////////////////////////////////////////////
  // 
  //
  ////////////////////////////////////////////////////////////////
  get_ptex_symbol(ptex,pmath,cc,fonts){
    if(ptex){
      if(ptex.startsWith('\\')){
        var s = `{${ptex}}`
      }else{
        var s = ptex;
      }
    }else if(pmath){
      var s = `\\ensuremath{${pmath}}`;
    }else{
      var s = '?';
    }
    return s;
  }
  get_pmath_symbol(ptex,pmath,cc,fonts,op){
    if(pmath){
      return pmath;
    }else if(ptex){
      return `\\text{${ptex}}`;
    }else{
      var s = '?';
      if(op){
        s = `\\operatorname{${s}}`;
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  // 
  //
  ////////////////////////////////////////////////////////////////
  get_utex_symbol(utex,umath,cc,fonts){
    if(utex){
      if(utex.startsWith('\\')){
        var s = `{${utex}}`
      }else{
        var s = utex;
      }
    }else if(umath){
      var s = `\\ensuremath{${umath}}`;
    }else{
      var s = String.fromCodePoint(cc);
    }
    return s;
  }
  get_umath_symbol(utex,umath,cc,fonts,op){
    if(umath){
      return umath;
    }else if(utex){
      return `\\text{${utex}}`;
    }else{
      var s = String.fromCodePoint(cc);
      if(fonts){
        s = `\\text{\\${fonts}{}${s}}`
      }else{
        s = `\\text{${s}}`;
      }
      if(op){
        s = `\\operatorname{${s}}`;
      }
      return s;
    }
  }

  ////////////////////////////////////////////////////////////////
  // 
  //
  ////////////////////////////////////////////////////////////////
  get_ctex_symbol(ctex,cmath,cc,fonts){
    if(ctex){
      if(ctex.startsWith('\\')){
        var s = `{${ctex}}`
      }else{
        var s = ctex;
      }
    }else if(cmath){
      var s = `\\math{${cmath}}`;
    }else{
      var s = String.fromCodePoint(cc);
    }
    return s;
  }
  get_cmath_symbol(ctex,cmath,cc,fonts,op){
    if(cmath){
      return cmath;
    }else if(ctex){
      return `\\text{${ctex}}`
    }else{
      var s = String.fromCodePoint(cc);
      if(fonts){
        s = `\\text{\\switchtobodyfont[${fonts}]${s}}`
      }else{
        s = `\\text{${s}}`;
      }
      if(op){
        s = `\\mathop{\\mfunction{${s}}}`;
      }
      return s;  
    }
  }

  // get the font for a symbol
  get_symbol_font(name){
    if(pjson.alt_symbol[name]){
      ///search in 'alt_symbol' arry first
      name = this.pjson.alt_symbol[name];
    }
    if(pjson.symbol[name]){
      var v = this.pjson.symbol[name];
      //TESTING
      return v.fonts;
    }
    throw `unknown symbol name ${name}`;
  }

  // returns a map of Unciode character -> latex symbol so that 
  // it can be used by LaTEX/ConTEXT translation to replace
  // a Unicode character in MD file to its ASCII symbol representation
  // in 'smooth()' function
  build_all_symbol_maps(symbol_name_map,symbol_cc_map,symbol_group_map,symbol_alt_map){
    for (let name in this.pjson.symbol) {
      let p = this.pjson.symbol[name];
      let ptex  = p.ptex;
      let utex  = p.utex;
      let ctex  = p.ctex;
      let pmath = p.pmath;
      let umath = p.umath;
      let cmath = p.cmath;
      let html  = p.html;
      let op    = p.op||0;
      let width = p.width;
      let fonts = p.fonts;
      let group = p.group;
      let comment = p.comment||'';
      let cc = this.string_entity_to_cc(html);
      let id = `my_${name}`;
      let o = {ptex,utex,ctex,pmath,umath,cmath,html,op,width,fonts,group,comment,cc,id,name};
      symbol_cc_map.set(cc,o);
      symbol_name_map.set(name,o);
      if(group){
        if(symbol_group_map.has(group)){
          let l = symbol_group_map.get(group);
          l.push(name);
        }else{
          symbol_group_map.set(group,[name])
        }
      }
    }
    for (let alt_name in this.pjson.alt_symbol){
      var name = this.pjson.alt_symbol[alt_name];
      if(symbol_name_map.has(name)){
        let o = symbol_name_map.get(name);
        symbol_name_map.set(alt_name,o);
        symbol_alt_map.set(alt_name,name);
      }
    }
  }

  // build and return a map that is suitable for replacing unicode
  // characters in the MD with a suitable font variant in latex
  // ex. 0x1d443 -> $\mathit{P}$
  build_unicode_mathvariant_map(){
    var map = new Map();
    for (let name in this.pjson.fontVariants) {
      let array = this.pjson.fontVariants[name];
      array.forEach((x) => {
        let {unicode,letter} = x;
        if(unicode.startsWith('&#') && letter){
          let cc = this.string_entity_to_cc(unicode);
          if(cc && cc > 0x7F){
            //let ch = String.fromCodePoint(cc);
            let tex = `\\${name}{${letter}}`
            map.set(cc,{tex});
          }
        }
      })
    }
    return map;
  }

  /// given a string that is a HTML entity such as '&#x2220;' it is 
  /// to a an integer that is 0x2220; given a string that is '&#160;' 
  /// the integer is to be 160
  string_entity_to_cc(s){
    let re_hex = /^&#x([0-9A-Fa-f]+);$/;
    let re_dec = /^&#([0-9]+);$/;
    let v;
    if((v=re_hex.exec(s))!==null){
      return parseInt(`0x${v[1]}`);
    }
    if((v=re_dec.exec(s))!==null){
      return parseInt(v[1]);
    }
    return s.codePointAt(0);
  }
  ///
  /// return a default width for a given character
  ///
  get_width_for_char(width,html){
    if(!width){
      let cc = this.string_entity_to_cc(html);
      if(cc < this.char_widths.length){
        width = this.char_widths[cc]*this.fs;
      }else{
        width = this.def_symbol_width;
      }
    }
    return width;
  }
  ///
  /// extract part of the string that has already started with <svg>. 
  /// The extracted part of the string 
  //  will be those that includes the last corresponding </svg>;
  /// multiple inner svg.../svg pairs are considered;
  /// the return value is an array of two parts, the first part
  /// is the extracted string, and the second part is the remaining string
  ///
  extract_svg_element(str,count){
    var i = 0;
    var v;
    const re_svg_or_esvg = /(<svg\b[^<>]*>|<\/svg>)/sg;
    while((v=re_svg_or_esvg.exec(str))!==null){
      var i = v.index;
      var j = re_svg_or_esvg.lastIndex;
      let s = v[0];
      if(s.startsWith('</svg>')){
        count--;
        if(count==0){
          s = str.slice(0,i);
          str = str.slice(j);
          return [s,str];
        }
      }else{
        count++;
      }
    }
    return [str,''];
  }
  ///
  /// extract part of the string that has already started with <svg>. 
  /// The extracted part of the string 
  //  will be those that includes the last corresponding </svg>;
  /// multiple inner svg.../svg pairs are considered;
  /// the return value is an array of two parts, the first part
  /// is the extracted string, and the second part is the remaining string
  ///
  extract_span_element(str,count,tag){
    var i = 0;
    var v;
    //const re_span_or_espan = /(<span\b[^<>]*>|<\/span>)/sg;
    const re_span_or_espan = new RegExp(`(<${tag}\b[^<>]*>)|(<\/${tag}>)`,'sg')
    while((v=re_span_or_espan.exec(str))!==null){
      var i = v.index;
      var j = re_span_or_espan.lastIndex;
      let s = v[0];
      if(v[2]!==null){
        count--;
        if(count==0){
          s = str.slice(0,i);
          str = str.slice(j);
          return [s,str];
        }
      }else{
        count++;
      }
    }
    return [str,''];
  }
  ///
  /// extract the innersvg="..." attribute
  ///
  extract_viewBox_attr(str){
    const re_viewBox = /viewBox=\'(.*?)\'/s;
    var v;
    if((v=re_viewBox.exec(str))!==null){
      let s = v[1];
      let ss = this.string_to_array(s);
      let vw = parseFloat(ss[2]);
      let vh = parseFloat(ss[3]);
      return [vw,vh];
    }
    return [0,0];
  }
  ///
  /// extract the innersvg="..." attribute
  ///
  extract_innersvg_attr(str){
    const re = /innersvg=\'(.*?)\'/s;
    var v;
    if((v=re.exec(str))!==null){
      let s = v[1];
      let ss = this.string_to_array(s);
      ss = ss.map((s) => parseFloat(s));
      return ss;
    }
    return [0,0,0];
  }
  ///
  /// extract the innersvg="..." attribute
  ///
  extract_width_height_attr(str,extent){
    const re_style = /style=\'(.*?)\'/s;
    const re_viewBox = /viewBox=\'(.*?)\'/s;
    var v;
    var w;
    var h;
    var mid;
    var vw;
    var vh;
    if((v=re_viewBox.exec(str))!==null){
      let s = v[1];
      let ss = this.string_to_array(s);
      vw = parseFloat(ss[2]);
      vh = parseFloat(ss[3]);
    }
    if((v=re_style.exec(str))!==null){
      let s = v[1];
      let ss = s.split(';');
      ss = ss.map(s => s.trim());
      ss = ss.filter(s => s.length);
      ss = ss.map(s => s.split(':'));
      ss = ss.filter(s => s.length==2);
      ss = ss.forEach((s) => {
        let [key,val] = s;
        key = key.trim();
        val = val.trim();
        if(key=='width'){
          if(val.endsWith('%')){
            w = parseFloat(val)/100*extent;
          }else if(val.endsWith('mm')){
            w = parseFloat(val)*3.779;
          }else if(val.endsWith('cm')){
            w = parseFloat(val)*37.79;
          }else if(val.endsWith('in')){
            w = parseFloat(val)*96;
          }else if(val.endsWith('pt')){
            w = parseFloat(val)*1.333;
          }else{
            w = parseFloat(val);
          }
        }else if(key=='height'){
          if(val=='auto'){
            h = vh/vw*w;
          }else if(val.endsWith('mm')){
            w = parseFloat(val)*3.779;
          }else if(val.endsWith('cm')){
            w = parseFloat(val)*37.79;
          }else if(val.endsWith('in')){
            w = parseFloat(val)*96;
          }else if(val.endsWith('pt')){
            w = parseFloat(val)*1.333;
          }else{
            w = parseFloat(val);
          }
        }
      })
    }
    mid = h;
    return [w,h,mid];
  }
  ///
  ///to_innersvg_math - this function is shared by all subclasses 
  ///
  to_innersvg_math(math,used,style){
    var l = this.to_math_segment_array(math);//this method is to be derived by each subclass
    var l = this.to_brace_group(l,math);
    var l = this.to_math_commands(l);
    var l = this.to_math_subsups(l);//need to be '\\brace' here because it exports the 'used' to the caller, so that it does not need to build 'defs'
    l[0] = '\\math';///change the top to '\\math' so that it will be added an extra width to the right if the last element is a protruded symbol
    var pref = {...style,compact:0,frac:0};
    return this.toInnerSvg(l,used,pref);
  }
  ///
  ///all math phrases
  ///
  to_phrase_math(style,cnt){
    var used = new Set();
    var m = this.to_innersvg_math(cnt,used,style);
    var [w,h,mid,s] = m;
    var defs = this.buildup_defs(used);
    var text = this.to_outer_svg(s,w,h,mid,defs,'html');
    return text;
  }
  ///
  ///
  ///
  to_fence_math(style,ss){
    var used = new Set();
    var str = ss.join('\n');
    var m = this.to_svgmath(str,style,used,1);
    var {w,h,mid,s} = m;
    var defs = this.buildup_defs(used);
    var text = this.to_outer_svg(s,w,h,mid,defs,'html');
    return text;
  }
  ///
  ///get_latin_width
  ///
  get_latin_width(cc){
    ///always assume a 12pt em
    if(cc < this.char_widths.length){
      var w = this.char_widths[cc]*this.fs*1.333;
    }else{
      var w = this.def_symbol_width*1.333;
    }
    return w;
  }
  ///
  ///get_punc_width
  ///
  get_punc_width(cc){
    if(cc < this.char_widths.length){
      var w = this.char_widths[cc]*this.fs*1.333;
    }else{
      var w = this.def_symbol_width*1.333;
    }
    return w;
  }
  ///
  ///get_unicode_width
  ///
  get_unicode_width(cc){
    ///always assume a 12pt em for the following range of cc
    // the CJK Unified Ideographs block, 4E00..9FFF
    // the CJK Unified Ideographs Externsion A block, 3400..4DBF
    // the CJK Compatibility Ideographs block, F900..FAFF
    // the Supplementary Ideographic Plane, 20000..2FFFF
    // the Tertiary Ideographic Plane, 30000..3FFFF
    if((cc >= 0x4E00 && cc <= 0x9FFF)||
       (cc >= 0x3400 && cc <= 0x4DBF)||
       (cc >= 0xF900 && cc <= 0xFAFF)||
       (cc >= 0x20000 && cc <= 0x3FFFF)||
       (cc >= 0x30000 && cc <= 0x3FFFF)){
         return this.fs*1.333;
       }
    ///For U+25A0 ... U+25FF block
    if(cc >= 0x25A0 && cc <= 0x25FF){
      return 7*1.333;
    }
    ///For U+2700 ... U+27BF block Unicode Block “Dingbats”
    if(cc >= 0x2700 && cc <= 0x27BF){
      return 10*1.333;
    }
    if(this.symbol_cc_map.has(cc)){
      let width = this.symbol_cc_map.get(cc).width;
      if(width){
        return width;
      }
      return this.def_symbol_width*1.333;
    }
    return this.def_symbol_width*1.333;
  }
  ///
  ///
  ///
  assert_pref_member(g,a){
    if(!Number.isFinite(g[a])){
      g[a] = 0;
    }
  }
}

module.exports = { NitrilePreviewTokenizer }
