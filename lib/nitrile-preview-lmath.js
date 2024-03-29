'use babel';

const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');

class NitrilePreviewLmath extends NitrilePreviewTokenizer {

  constructor (translator) {
    super(translator);
  }

  to_align_math (str,style,used) {
    var l = this.to_math_segment_array(str);
    var v = this.to_math_group(l);
    var v = this.to_math_commands(v);
    var v = this.to_math_subsups(v);
    var top = this.split_math_cr(v);
    var pref = {...style};
    var o = [];
    var max_n = 1;
    top.forEach( (p,i,arr) => {
      let xx = this.split_math_align(p);
      let xx_results = xx.map( (x) => {
        let [w,h,mid,s] = this.toInnerSvg(x,used,pref);
        return s;
      });
      let n = xx_results.length;
      max_n = Math.max(max_n,n);
      o.push(xx_results.join(' & '));
    });
    var s = o.join(' \\\\\n');
    if(max_n == 1 && o.length == 1){
      s = s;
    }else{
      var s = `\\begin{alignedat}{1}\n${s}\n\\end{alignedat}`;
    }
    return s;
  }
  to_literal_math(str,style,used){
    var m = this.to_innersvg_math(str,style,used);
    var [w,h,mid,s] = m;
    return s;
  }
  to_inline_math(str,style,used){
    var m = this.to_innersvg_math(str,style,used);
    var [w,h,mid,s] = m;
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
    if (v === undefined || v === null) {
      s = '{?}';///this could happen when a superscript is missing such as a^
      ///in which case we will just output a^{} to keep latex happy
      return [w,h,mid,s];
    } else if (v === '') {
      var s = '{}';
      return [w,h,mid,s];
    } else if (v === '\\displaystyle') {
      var s = ``
      return [w,h,mid,s];
    } else if (Array.isArray(v)) {
      var cmdname = v[0];
      switch (cmdname) {

        case '\\ensuremath':
          s = v[1];
          return [w,h,mid,s];
          break;

        case '\\beginend': 

          var name = v[2];
          var p = this.splitArrayForBeginEnd(v[1]);
          pref.array += 1;
          var o = [];
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
            ss = ss.join(' & ');
            ss = `${ss} \\\\`;
            o.push(ss);
          }
          var s = o.join(' ');
          pref.array -= 1;

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
          if(1){
            o.push(`\\begin{${name}}`);
            s = s.trim();
            if(s.endsWith('\\\\')){
              s = s.slice(0,s.length-2);
            }
            o.push(s);
            o.push(`\\end{${name}}`);
            var s = o.join(' ');
            return [w,h,mid,s];
          }
          break;

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
            if (fence1 === '\\lang') fence1 = '\\langle';
            if (fence1 === '\\rang') fence1 = '\\rangle';
            if (fence2 === '\\lang') fence2 = '\\langle';
            if (fence2 === '\\rang') fence2 = '\\rangle';
            /// corrections
            if (fence1 === '.') fence1 = '.';
            if (fence2 === '.') fence2 = '.';
            s =  `\\left${fence1} ${s} \\right${fence2}`;
            return [w,h,mid,s];
          }
          break;

        case '\\sub':
          /// 2 arguments, 0 option
          var [w1,h1,mid1,s1,ds1] = this.toInnerSvg(v[1],used,pref);
          var [w2,h2,mid2,s2,ds2] = this.toInnerSvg(v[2],used,pref);
          if(ds1){
            var s = `{\\displaystyle ${s1}_${s2}}`;
          }else{
            var s =          `${s1}_${s2}`;
          }
          return [w,h,mid,s];
          break;

        case '\\sup':
          /// 2 arguments, 0 option
          var [w1,h1,mid1,s1,ds1] = this.toInnerSvg(v[1],used,pref);
          var [w2,h2,mid2,s2,ds2] = this.toInnerSvg(v[2],used,pref);
          if(ds1){
            var s = `{\\displaystyle ${s1}^${s2}}`;
          }else{
            var s =          `${s1}^${s2}`;
          }
          return [w,h,mid,s];
          break;

        case '\\subsup':
          /// 3 arguments, 0 option
          var [w1,h1,mid1,s1,ds1] = this.toInnerSvg(v[1],used,pref);
          var [w2,h2,mid2,s2,ds2] = this.toInnerSvg(v[2],used,pref);
          var [w3,h3,mid3,s3,ds3] = this.toInnerSvg(v[3],used,pref);
          if(ds1){
            var s = `{\\displaystyle ${s1}_${s2}^${s3}}`;
          }else{
            var s =          `${s1}_${s2}^${s3}`;
          }
          return [w,h,mid,s];
          break;

        case '\\text': 
          var s = `\\text{${v[1]}}`;
          return [w,h,mid,s];
          break;

        case '\\overarc':
          /// \widehat{Hello World} --- NOTE: this is a hack to turn a \overarc into a \widehat because \overarc is not available on CONTEX nor LATEX
          var [w1,h1,mid1,s1] = this.toInnerSvg(v[1],used,pref);
          var s = `\\widehat{${s1}}`;
          return [w,h,mid,s];
          break;

        case '\\dint':
          var s = '\\displaystyle\\int';
          return [w,h,mid,s];
          break;
        case '\\dsum':
          var s = '\\displaystyle\\sum';
          return [w,h,mid,s];
          break;
        case '\\dprod':
          var s = '\\displaystyle\\prod';
          return [w,h,mid,s];
          break;
        case '\\dlim':
          var s = '\\displaystyle\\lim';
          return [w,h,mid,s];
          break;

        case '\\hrule':
          var num = parseFloat(v[1]);
          var v2 = v[2];
          if(!Number.isFinite(num)){
            num = 1;
          }
          if(v2){
            let mymath = pref[v2]||'';
            let used1 = new Set();
            let style1 = {};
            var mymath1 = this.to_inline_math(mymath,style1,used1,0);        
            //console.log('mymath=',mymath,'mymath1=',mymath1)
            if(mymath1){
              s = `\\rule{${this.fix(num)}em}{0.4pt}`
              // s = `\\substack{${mymath1}\\\\${s}}` // seems to work, but font size is smaller
              // s = `\\begin{array}{c}{${mymath1}}\\\\{${s}}\\end{array}` // leave too much vertical space
              // s = `{${mymath1} \\atop ${s}}` // leave too must vertical space
              // s = `{\\textstyle ${mymath1} \\above 0pt ${s}}` // leave too must vertical space
              // s = `\\stackrel{${mymath1}}{${s}}`///WORKS the best, but the font is still smaller
              s = `\\overset{\\textstyle ${mymath1}}{${s}}`;//WORKS, similar to \\stackrel and the font size is smaller
            }else{
              s = `\\rule{${this.fix(num)}em}{0.4pt}`
            }
          }else{
            s = `\\rule{${this.fix(num)}em}{0.4pt}`
          }
          return [w,h,mid,s];
          break;  
      }

      //take care of general math commands such as \sqrt, \binom, 
      /// where there is a .count member and a .option member
      var math_cmd_info = this.findMathCommandInfo(cmdname);
      if(math_cmd_info){///is a math command
        var a_opt = '';
        var a_args = [];
        var k = math_cmd_info.option;
        var n = math_cmd_info.count;
        k = k||0;
        n = n||0;
        if(k){
          a_opt = v[1];
        }
        for(var i=0; i < n; ++i){
          a_args.push(v[1+k+i]);
        }
        s = v[0];
        if(a_opt){
          s += `[${a_opt}]`;
        }
        for(var i=0; i < n; ++i){
          let [w1,h1,mid1,s1] = this.toInnerSvg(a_args[i],used,pref);
          s += ' '; // add space, this will take care of the case
                    // of \sqrt m, here, where s1 is 'm'
          if(s1.startsWith('{') && s1.endsWith('}')){
            s += s1;
          }else{
            s += `{${s1}}`;
          }
        }
        return [w,h,mid,s];
      } 

      // just output the command name---this should have have happened,
      // this command name should have been part of the math command
      s = v[0];
      return [w,h,mid,s];

    } else {

      // SINGLE ELEMENT      

      var m;

      // if it is double-backslash
      // we replace it with a space
      
      if(v == '\\\\'){
        var s = '';
        return [w,h,mid,s];
      }

      // if it is \. 
      // we replace it with a space
      
      if(v == '\\\.'){
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

      // if it is a colon then set it as 
      // '\\ratio'                
    
      if(v == ':'){
        var s = '\\text{: }';
        return [w,h,mid,s];
      }

      // if it is \vl then treat it same as '|'
    
      if(v == '\\vl'){
        var s = '|';
        return [w,h,mid,s];
      }

      // if it is a bracket, then change it to \lbrack or \rbrack
      // -- this will help the situation where this math expression
      // appears inside a description item, where the brackets are
      // used as delimeters-only and having the brackets in the math
      // expression will mess up the syntax
      
      if(v == '['){
        var s = '\\lbrack';
        return [w,h,mid,s];
      }
      if(v == ']'){
        var s = '\\rbrack';
        return [w,h,mid,s];
      }

      // if it is a right curly braces
      // we remove it---having it will cause
      // LATEX to choke

      if(v == '\}'){
        var s = '';
        return [w,h,mid,s];
      }
      
      // the \( and \) are definitely forbidden inside the math
      
      if(v == '\\\(' || v == '\\\)'){
        var s = '';
        return [w,h,mid,s];
      }
      if(v == '\\\[' || v == '\\\]'){
        var s = '';
        return [w,h,mid,s];
      }

      // if it is a apostrophy then replace it with '\prime'
    
      if(v == "\'"){
        var s = v;
        return [w,h,mid,s];
      }
      if(v == "\'\'"){
        var s = v;
        return [w,h,mid,s];
      }
      if(v == "\'\'\'"){
        var s = v;
        return [w,h,mid,s];
      }
    
      // check to see if it is a predefined \mathcal, \mathit, etc.
  
      if(this.is_mathvariant_expr(v)){
        var s = v;
        return [w,h,mid,s];
      }

      if (this.re_capital_letter.test(v)) {
        var s = `\\text{${v}}`;
        return [w,h,mid, s ];
      }

      var ds = 0;
      var used = new Set();
      var [id,width,op,name] = this.findIdByElement(v,used);
      if(id){
        var s = v;
        // if 'name' is set, then it is a symbol such as \deg or &deg; or one converted
        // from a unicode.
        if(name){
          var {ptex,pmath,utex,umath,cc,fonts,op} = this.symbol_name_map.get(name);
          if(this.translator.prog==='lualatex'||this.translator.prog==='xelatex'){
            s = this.get_umath_symbol(utex,umath,cc,fonts,op);
          }else{
            s = this.get_pmath_symbol(ptex,pmath,cc,fonts,op);
          }
        }
        //add \\displaystyle or \textstyle
        if(id=='myDINT'){
          s = `\\int`, ds = 1;
        }else if(id=='myDSUM'){
          s = `\\sum`, ds = 1;
        }else if(id=='myDPROD'){
          s = `\\prod`, ds = 1;
        }else if(id=='myDLIM'){
          s = `\\lim`, ds = 1;
        }
        return [w,h,mid,s,ds];
      } 

      // such as '*'

      // ignore single backslash
      if(v=='\\'){
        var s = '';
        return [w,h,mid,s];
      }

      // if it is something like \abc, then treat it like an
      //operatorname
      if(this.re_loglikename.test(v)){
        var s = v.slice(1);
        if(this.has_latex_math_operator(s)){
          var s = `\\${s}`
        }else{
          var s = `\\operatorname{${s}}`
        }
        return [w,h,mid,s];
      }

      //note that a unicode character would have already been replaced by the findIdByElement() returns
      var s = `\\text{${this.translator.polish(pref,v)}}`;
      return [w,h,mid,s];

      
    }
  }
  ///
  ///
  ///
  has_latex_math_operator(s){
    var i = this.pjson.latexMathOperators.indexOf(s);
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
    str = this.translator.restore_latex_math(str);
    str = str.trimStart();
    var o = [];
    var v;
    const re_ensuremath = /^(\\ensuremath\{)(.*)$/;
    const re_ding = /^(\\ding\{\w+\})(.*)$/;
    while(str.length){
      if((v=re_ensuremath.exec(str))!==null){
        var hdr = v[1];
        str = v[2];
        var [s,str] = this.extract_ensuremath_command(str,1);
        var s = `${hdr}${s}`;
        var p = ['\\ensuremath',s]
        o.push(p);
        str = str.trimStart();
        continue;
      }
      if((v=re_ding.exec(str))!==null){
        let s = ['\\ensuremath',`\\ensuremath{\\text{${v[1]}}}`];
        str = v[2];
        o.push(s);
        str = str.trimStart();
        continue;
      }
      if((v=this.re_segment.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        str = str.trimStart();
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



}

module.exports = { NitrilePreviewLmath }
