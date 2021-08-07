'use babel';

const pjson = require('./nitrile-preview-math.json');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');

class NitrilePreviewCmath extends NitrilePreviewTokenizer {

  constructor (translator) {
    super(translator);
  }

  to_cmath (str,style,used,isdmath) {
    var l = this.to_math_segment_array(str);
    var v = this.to_math_group(l);
    var v = this.to_math_commands(v);
    var v = this.to_math_subsups(v);
    var top = this.split_math_cr(v);
    var pref = {...style};
    pref.isdmath = isdmath;
    if(top.length==1){
      var [w,h,mid,s] = this.toInnerSvg(v,used,pref);
      return s;
    }else{
      var o = [];
      var max_n = 1;
      o.push('\\startmathalignment[n=2]');
      top.forEach( (p,i,arr) => {
        let xx = this.split_math_align(p);
        let xx_results = xx.map( (x) => {
          let [w,h,mid,s] = this.toInnerSvg(x,used,pref);
          return s;
        });
        let n = xx_results.length;
        max_n = Math.max(max_n,n);
        let s = xx_results.join(' \\NC ')
        s = `\\NC ${s} \\NR`
        o.push(s);
      });
      o.push('\\stopmathalignment')
      var s = o.join('\n')
    }
    return s;
  }

  toInnerSvg (v, used,pref) {

    /// 'v': is an element, such as '\alpha', '1', '+', or a group,
    /// such as: '\\brace',     [Array], '', '', ...
    /// or:      '\\leftright', [Array], '[', ']', ...
    /// or:      '\\beginend',  [Array], 'pmatrix', 'pmatrix', ...
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

    var x = 0;
    var y = 0;
    var w = 0;
    var h = 12;
    var mid = 6;
    var s = '';
    this.assert_pref_member(pref,'compact');
    this.assert_pref_member(pref,'frac');
    this.assert_pref_member(pref,'isinmatrix');
    this.assert_pref_member(pref,'isdmath');
    if (v === undefined || v === null) {
      s='{?}';///this could happen when a superscript is missing such as a^
      ///in which case we will just output a^{} to keep latex happy
      return [w,h,mid,s];
    } else if (v === '') {
      s='{}';
      return [w,h,mid,s];
    } else if (v === '\\displaystyle') {
      pref.isdmath = 1;
      s='\\displaystyle'
      return [w,h,mid,s];
    } else if (Array.isArray(v)) {
      var cmdname = v[0];
      switch (v[0]) {

        case '\\switchtobodyfont':
          s = `\\math{\\text{\\switchtobodyfont[${v[1]}]${v[2]}}}`;
          return [w,h,mid,s];
          break;

        case '\\ensuremath':
          s = v[1];
          return [w,h,mid,s];
          break;

        case '\\beginend': {

          var name = v[2];
          if(!Number.isFinite(pref.isinmatrix)){
            pref.isinmatrix = 0;
          }
          pref.isinmatrix += 1;
          var o = [];
          var p = this.splitArrayForBeginEnd(v[1]);
          var nrow = p.length;
          var ncol = p.map(d => d.length).reduce((cur,acc) => Math.max(cur,acc));
          for (let i=0; i < nrow; ++i) {
            var ss = [];
            for (let j=0; j < ncol; ++j) {
              let pv = p[i][j];
              if (pv) {
                var [w1,h1,mid1,s1] = this.toInnerSvg(['\\brace',pv,'','',''],used,pref);
                ss.push(s1);
              }
            }
            ss = ss.join(' \\NC ');
            ss = `\\NC ${ss} \\NR`;
            o.push(ss);
          }
          var s = o.join(' ');
          pref.isinmatrix -= 1;
          
          ///now we need to add some fences for
          ///    matrix
          ///    pmatrix
          ///    bmatrix
          ///    Bmatrix
          ///    vmatrix
          ///    Vmatrix
          var fence1 = '';
          var fence2 = '';
          if (name == 'pmatrix') {
            fence1 = '(';
            fence2 = ')';
          } else if (name == 'bmatrix') {
            fence1 = '[';
            fence2 = ']';
          } else if (name == 'Bmatrix') {
            fence1 = '\\{';
            fence2 = '\\}';
          } else if (name == 'vmatrix') {
            fence1 = '\\vert';
            fence2 = '\\vert';
          } else if (name == 'Vmatrix') {
            fence1 = '\\Vert';
            fence2 = '\\Vert';
          } else {
            fence1 = '';
            fence2 = '';
          }
          o = [];
          if(name == 'cases'){
            o.push(`\\startcases[]`);
            o.push(s);
            o.push(`\\stopcases`);
            var s = o.join(' ');
            return [w,h,mid,s];
          } else {
            var left = '';
            var right = '';
            if (fence1) { var left = `\\left${fence1}\\,`; }
            if (fence2) { var right = `\\,\\right${fence2}`; }
            o.push(`\\startmatrix[left={${left}},right={${right}}]`);
            o.push(s);
            o.push(`\\stopmatrix`);
            var s = o.join(' ');
            return [w,h,mid,s];
          }
          break;
        }

        case '':
          var g = v[1];
          var results = g.map( x => this.toInnerSvg(x,used,pref) );
          var ss = results.map( x => x[3] );
          var s = ss.join(' ');
          return [w,h,mid,s];
          break;

        case '\\pipe':
        case '\\math':
        case '\\brace':
        case '\\leftright':

          var g = v[1];
          var results = g.map( x => this.toInnerSvg(x,used,pref) );
          var s = '';
          var o = [];
          if (v[0] === '\\pipe') {
            var ss = results.map( x => x[3] );
            var s = ss.join(' ');
            return [w,h,mid,s];
          } else if (v[0] === '\\math') {
            var ss = results.map( x => x[3] );
            var s = ss.join(' ');
            return [w,h,mid,s];
          } else if (v[0] === '\\brace') {
            var ss = results.map( x => x[3] );
            var s = ss.join(' ');
            var s = `{${s}}`;
            return [w,h,mid,s];
          } else {
            var ss = results.map( x => x[3] );
            var s = ss.join(' ');
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
            if (fence1 === '\\lobrk') fence1 = '\\llbracket';
            if (fence1 === '\\robrk') fence1 = '\\rrbracket';
            if (fence2 === '\\lobrk') fence2 = '\\llbracket';
            if (fence2 === '\\robrk') fence2 = '\\rrbracket';
            /// corrections
            if (fence1 === '\\Vert') fence1 = '\\lVert';
            if (fence2 === '\\Vert') fence2 = '\\rVert';
            /// corrections
            if (fence1 === '\\vert') fence1 = '\\lvert';
            if (fence2 === '\\vert') fence2 = '\\rvert';
            /// corrections
            if (fence1 === '\\lang') fence1 = '\\lang';
            if (fence1 === '\\rang') fence1 = '\\rang';
            if (fence2 === '\\lang') fence2 = '\\lang';
            if (fence2 === '\\rang') fence2 = '\\rang';
            /// corrections
            if (fence1 === '.') fence1 = '.';
            if (fence2 === '.') fence2 = '.';
            s =  `\\left${fence1} ${s} \\right${fence2}`;
            return [w,h,mid,s];
          }
          break;

        case '\\sub':
          /// 2 arguments, 0 option
          var [w1,h1,mid1,s1] = this.toInnerSvg(v[1], used,pref);
          var [w2,h2,mid2,s2] = this.toInnerSvg(v[2], used,pref);
          var s = `${s1}_${s2}`;
          return [w,h,mid,s];
          break;

        case '\\sup':
          /// 2 arguments, 0 option
          var [w1,h1,mid1,s1] = this.toInnerSvg(v[1], used,pref);
          var [w2,h2,mid2,s2] = this.toInnerSvg(v[2], used,pref);
          var s = `${s1}^${s2}`;
          return [w,h,mid,s];
          break;

        case '\\subsup':
          /// 3 arguments, 0 option
          var [w1,h1,mid1,s1] = this.toInnerSvg(v[1], used,pref);
          var [w2,h2,mid2,s2] = this.toInnerSvg(v[2], used,pref);
          var [w3,h3,mid3,s3] = this.toInnerSvg(v[3], used,pref);
          var s = `${s1}_${s2}^${s3}`;
          return [w,h,mid,s];
          break;

        case '\\text':
          /// \text{Hello World}
          var s = `\\text{${v[1]}}`;
          return [w,h,mid,s];
          break;

        case '\\hrule':
          /// \hrule{1} // a 12pt hrule
          var num = parseFloat(v[1]);
          var v2 = v[2];
          if(!Number.isFinite(num)){
            num = 1; 
          }
          s = `\\hl[${this.fix(num)}]`
          if(v2){
            let mymath = pref[v2]||'';
            let used1 = new Set();
            let style1 = {};
            let mymath1 = this.to_cmath(mymath,style1,used,0);
            //console.log('mymath=',mymath,'mymath1=',mymath1)
            if(mymath1){
              s = `{\\startsubstack ${mymath1} \\NR ${s} \\NR \\stopsubstack}`;
            }
          }
          return [w,h,mid,s];
          break;

        case '\\dif':
          /// \dif{x}
          var [w1,h1,mid1,s1] = this.toInnerSvg(v[1],used,pref);
          var s = `\\mathrm{d}\\mathit{${s1}}`;
          return [w,h,mid,s];
          break;

        case '\\od':
          // 2 arguments, 1 option
          var opt = v[1];
          var [w1,h1,mid1,s1] = this.toInnerSvg(v[2],used,pref);
          var [w2,h2,mid2,s2] = this.toInnerSvg(v[3],used,pref);
          if (opt) {
            var s = `\\frac{\\mathrm{d}^{${opt}}${s1}}{\\mathrm{d}\\mathit${s2}^{${opt}}}`
            return [w,h,mid,s];
          } else {
            var s = `\\frac{\\mathrm{d}${s1}}{\\mathrm{d}\\mathit${s2}}`
            return [w,h,mid,s];
          }
          break;

        case '\\pd':
          // 2 arguments, 1 option
          var opt = v[1];
          var [w1,h1,mid1,s1] = this.toInnerSvg(v[2],used,pref);
          var [w2,h2,mid2,s2] = this.toInnerSvg(v[3],used,pref);
          if (opt) {
            var s = `\\frac{\\mathrm{\\partial}^{${opt}}${s1}}{\\mathrm{\\partial}\\mathit${s2}^{${opt}}}`
            return [w,h,mid,s];
          } else {
            var s = `\\frac{\\mathrm{\\partial}${s1}}{\\mathrm{\\partial}\\mathit${s2}}`
            return [w,h,mid,s];
          }
          break;

        case '\\sfrac':
          // 2 arguments, 0 option
          var [w1,h1,mid1,s1] = this.toInnerSvg(v[1],used,pref);
          var [w2,h2,mid2,s2] = this.toInnerSvg(v[2],used,pref);
          var s = `{{}^${s1}\\!/{}_${s2}}`;
          return [w,h,mid,s];
          break;

        case '\\pmod':
           var [w1,h1,mid1,s1] = this.toInnerSvg(v[1], used,pref);
           var s = `\\pmod ${s1}`;
           return [w,h,mid,s];
           break;

        // case '\\sqrt':
        //   /// 1 argument, 1 option
        //   var opt = v[1];
        //   var [w1,h1,mid1,s1] this.toInnerSvg(v[2],used,pref);
        //   if (opt) {
        //     var s =          `${v[0]}[${opt}]{${s1}}`;
        //     return [w,h,mid,s];
        //   } else {
        //     var s =          `${v[0]}{${s1}}`;
        //     return [w,h,mid,s];
        //   }

          // case '\\frac':
          // case '\\binom':
          // /// 2 arguments, 0 option
          // var [w1,h1,mid1,s1] this.toInnerSvg(v[1],used,pref);
          // var [w2,h2,mid2,s2] this.toInnerSvg(v[2],used,pref);
          // var s =          `${v[0]}{${s1}}{${s2}}`;
          // return [w,h,mid,s];
          // break;


      } 

      //take care of general math commands such as \sqrt, \binom, 
      /// where there is a .count member and a .option member
      var math_cmd_info = this.findMathCommandInfo(cmdname);
      if (math_cmd_info) {///is a math command
        var a_opt = '';
        var a_args = [];
        var k = math_cmd_info.option;
        var n = math_cmd_info.count;
        k = k || 0;
        n = n || 0;
        if (k) {
          a_opt = v[1];
        }
        for (var i = 0; i < n; ++i) {
          a_args.push(v[1 + k + i]);
        }
        s = v[0];
        if (a_opt) {
          s += `[${a_opt}]`;
        }
        for (var i = 0; i < n; ++i) {
          let [w1,h1,mid1,s1] = this.toInnerSvg(a_args[i], used,pref);
          s += ' ';
          if(s1.startsWith('{') && s1.endsWith('}')){
            s += s1;
          }else{
            s += `{${s1}}`;
          }
        }
        return [w,h,mid,s];
      } 

    } else {

      //SINGLE ELEMENT
      
      var m;

      // if it is a double-backslash
      // we replace it with nothing

      if(v=='\\\\'){
        var s = '';
        return [w,h,mid,s];
      }

      // if it is an ampersand
      // we replace it with '\&'
    
      if(v == '&'){
        var s = '\\&';
        return [w,h,mid,s];
      }
    
      // if it is a dollar sign
      // we replace it with '\$'
    
      if(v == '$'){
        var s = '\\$';
        return [w,h,mid,s];
      }
    
      // if it is a right curly braces
      // we remove it---having it will cause
      // LATEX to choke

      if(v == '\}'){
        var s = '';
        return [w,h,mid,s];
      }

      // if it is a apostrophy then replace it with '\prime'
    
      if(v == "\'"){
        var s = '\\prime';
        return [w,h,mid,s];
      }
      
      // check to see if it is a predefined \mathcal, \mathit, etc.
  
      if(this.is_mathvariant_expr(v)){
        var s = v;
        return [w,h,mid,s];
      }

      if (this.re_capital_letter.test(v)) {
        var s = v;
        return [w,h,mid,s];
      }

      var used = new Set();
      var [id,width,op,name] = this.findIdByElement(v,used);
     
      if(id){

        s = v;
        // if 'name' is set, then it is a symbol such as \deg or &deg; or one converted
        // from a unicode.
        if(name){
          var {ctex,cmath,cc,fonts,op} = this.symbol_name_map.get(name);
          s = this.get_cmath_symbol(ctex,cmath,cc,fonts,op);
        }
        return [w,h,mid,s];
      } 

      // such as '*'

      // ignore if it is a single backslash
      if (v == '\\') {
        var s = '';
        return [w,h,mid,s];
      }

      // if it is something like \abc, then treat it like an
      //operatorname
      if(this.re_loglikename.test(v)){
        var s = v.slice(1);
        if(this.has_contex_math_operator(s)){
          var s = `\\${s}`;
        }else{
          var s = `\\mathop{\\mfunction{${s}}}`
        }
        return [w,h,mid,s];
      }

      var s = `\\text{${this.translator.polish(pref,v)}}`;
      return [w,h,mid,s];
      

    }
  }
  ///
  ///
  ///
  lower(y,id) {
    var dy = pjson.smallLetters[id];
    if (dy) {
      dy = parseFloat(dy);
      if (Number.isFinite(dy)) {
        return y + dy;
      }
    }
    return y;
  }
  ///
  ///
  ///
  has_contex_math_operator(s){
    var i = this.pjson.contexMathOperators.indexOf(s);
    return (i>=0) ? true : false;
  }
  ///
  ///
  ///
  to_math_segment_array(str){
    ///THIS is a override function from Tokenizer, which is written
    ///  for parsing LATEX generated output only, such as 
    ///  "3{\\char94}{\\char123}1+2{\\char125}"
    ///THIS function is to convert these into a actual character that is '^', '\{', and '\}'
    str = this.translator.restore_contex_math(str);
    str = str.trimLeft();
    var o = [];
    var v;
    const re_switchtobodyfont = /^\{\\switchtobodyfont\[(.*?)\](.*?)\}(.*)$/;
    const re_ensuremath = /^(\\math\{)(.*)$/;
    while(str.length){
      if((v=re_switchtobodyfont.exec(str))!==null){
        str = v[3];
        var p = ['\\switchtobodyfont',v[1],v[2]];
        o.push(p);
        str = str.trimLeft();
        continue;
      }
      if((v=re_ensuremath.exec(str))!==null){
        var hdr = v[1];
        str = v[2];
        var [s,str] = this.extract_ensuremath_command(str,1);
        var s = `${hdr}${s}`;
        var p = ['\\ensuremath',s]
        o.push(p);
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

  extract_ensuremath_command(str,count){
    ///starting at position i, scan for the end of a pattern that is {...}
    ///where the starting position 'i' is one past the first brace.,
    ///the return value is the position one past the end of the pattern
    let i = 0;
    var s = '';
    while(count > 0 && i < str.length){
      var a = str.charAt(i);
      if(a == '\\'){
        i+=2;
        continue;
      }
      else if(a == '{'){
        count++;
        i++;
        continue;
      }
      else if(a == '}'){
        count--;
        i++;///include this closing braces
        if(count==0){
          s = str.slice(0,i);
          str = str.slice(i);
          return [s,str];
        }
        continue;
      }else{
        i++;
      }
    }
    return [str,''];
  }
  ///
  ///all math phrases
  ///
  to_phrase_math(style,cnt){
    var used = new Set();
    var m = this.to_innersvg_math(cnt,used,style);
    var [w,h,mid,s] = m;
    return `\\math{${s}}`
  }

}

module.exports = { NitrilePreviewCmath }
