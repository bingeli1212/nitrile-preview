'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { Complex } = require('./nitrile-preview-complex');
class NitrilePreviewExpr extends NitrilePreviewBase {

  constructor(diagram) {
    super();
    this.diagram = diagram;
    // scalar function
    this.re_scalar_pathptxy  = /^&([A-Za-z][A-Za-z0-9]*\[\d+\])\.([xy])\s*(.*)$/;
    this.re_scalar_arraypt_0 = /^([A-Za-z][A-Za-z0-9]*)\[(\d+)\]\s*(.*)$/;
    this.re_scalar_arraypt_i = /^([A-Za-z][A-Za-z0-9]*)\[([A-Za-z][A-Za-z0-9]*)\]\s*(.*)$/;
    this.re_scalar_func      = /^([A-Za-z][A-Za-z0-9]*)\(/;
    this.re_scalar_usvar     = /^(_)\s*(.*)$/;
    this.re_scalar_dvar      = /^(\$\d+)\s*(.*)$/;
    this.re_scalar_var       = /^([A-Za-z][A-Za-z0-9]*)\s*(.*)$/;
    this.re_scalar_im        = /^(\d*\.\d+|\d*\.|\d+)(i|j)\s*(.*)$/;    
    this.re_scalar_is_oct    = /^0o([0-7]+)\s*(.*)$/;    
    this.re_scalar_is_bin    = /^0b([0-1]+)\s*(.*)$/;    
    this.re_scalar_is_hex    = /^0x([0-9A-Fa-f]+)\s*(.*)$/;    
    this.re_scalar_float     = /^(\d*\.\d+|\d*\.|\d+)(e\d+|e\+\d+|e\-\d+|E\d+|E\+\d+|E\-\d+|)\s*(.*)$/;    
    this.re_scalar_op        = /^(>=|<=|==|!=|>|<|\+|-|\*|\/)\s*(.*)$/;    
  }

  /// extract the expression of a+1,b+1
  /// until we have just gone past the comma, in which
  /// case the comma will be discarded and the value of the expression 'a+1'
  /// is caluclated based on the variable stored with the 'g' 
  extract_next_expr(s,g,z=0){
    //NOTE: 's' is the input string. 'g' contains a list of arguments. 'z' is the level of nesting
    //RETURN: this function returns a 'Complex' number
    /// - this function will stop at the first sign of a comma,
    /// - this function will stop at the first sign of a unmatched close-parenthesis 
    /// such as x+1+y,...
    /// such as x+1)...
    var s0 = s;
    s = s.trimStart();
    var op = '';
    var arg1 = Complex.ZERO;
    /// check to see if it is a comma, a left parenthis, or right 
    /// parenthesis
    var c = s.charAt(0);
    if (c === ',' || c === ')') {
      s = s.slice(1);
      return [c, s, c];
    }
    while(s.length){
      /// if the s starts with a comma or right-paren,
      /// then keep it in the s and return the current
      /// processed value
      var c = s.charAt(0);
      if(c === ',' || c === ')') {
        break;
      }
      if(c === '+' || c === '-') {
        op = c;
        s = s.substr(1);
        s = s.trimStart();
        continue;
      }
      /// A term is always a float that is the result
      /// of '2', 'pi', '2*pi', '2/pi', '2*2*pi'. etc. 
      var my = this.extract_next_term(s,g,z+1);
      var [a,s,phrase] = my;
      ///'a' is string such as '*', '+', ')', or ','
      if (a instanceof Complex) {
        /// assume a is 'arg2 and run the operator
        let arg2 = a;
        arg1 = this.exec_operator(op,arg1,arg2);
        op = '';//it must to be cleared because otherwise it might be used again 
      }else if(typeof a === 'number'){
        let arg2 = Complex.create(a);
        arg1 = this.exec_operator(op,arg1,arg2);
        op = '';//it must to be cleared because otherwise it might be used again
      }else{
        /// otherwise assume a is an operator
        op = a; 
      } 
      s = s.trimStart();
    }
    var phrase = s0.substr(0,s0.length-s.length);
    return [arg1,s,phrase];
  }

  extract_next_term(s,g,z=0){
    /// a term is defined as number multiplied together with operator * or /,
    /// for instance, for '1 + 2*2 + 1', the '2*2' is to be processed by this function
    var s0 = s;
    s = s.trimStart();
    var op = '';
    var arg1 = Complex.ZERO;
    while(s.length){
      ///lookahead:
      /// if the s starts with a comma or right-paren,
      /// then keep it in the s and return the current
      /// processed value
      var c = s.charAt(0);
      if(c === ',' || c === ')' || c === '+' || c === '-') {
        break;
      }
      /// a scalar is defined as a function, a comma, a left 
      /// parenthesis, a right parenthesis, a plus, minus, 
      /// multiplication, or division sign 
      var my = this.extract_next_scalar(s,g,z+1);
      var [s1,s,phrase] = my;
      ///'a' is string such as '*', '+', ')', or ',', 
      ///'a' could also be a Complex number
      if (s1 instanceof Complex) {
        /// assume 'a' is 'arg2' and run the operator
        let arg2 = s1;
        arg1 = this.exec_operator(op,arg1,arg2);
        op = '';/// it is important to clear op here
      }else if(typeof s1 === 'number'){
        /// assume 'a' is 'arg2' and run the operator
        let arg2 = Complex.create(s1);
        arg1 = this.exec_operator(op,arg1,arg2);
        op = '';/// it is important to clear op here 
      }else{
        /// otherwise assume 'a' is an operator
        op = s1; 
      } 
      s = s.trimStart();
    }
    var phrase = s0.substr(0,s0.length-s.length);
    return [arg1,s,phrase];
  }

  extract_next_scalar(s,g,z=0) {
    ///NOTE: this function returns an array of three elements: [a,s,phrase]
    /// The first one is a number if what extracted is a number. 
    ///
    /// 1. a number such as 1.234
    /// 2. an operator such as '+', '-', '*', '/', '>', '<', '>=', '<=' 
    /// 
    /// A scalar is defined as the value of a 
    /// complete function (including any
    /// nested functions as well), an parenthesized expression,
    /// a multiplication sign, or a division sign 
    var s0 = s;
    var v;
    s = s.trimStart();
    if (s.length===0) {
      return ['','',''];
    }
    if (s.charAt(0)==='('){
      let myval = Complex.ZERO;
      s = s.slice(1);
      while(s.length){
        var [s1,s] = this.extract_next_expr(s,g,z+1);
        if(s1 === ')'){
          break;
        }else if(s1 === ','){
          continue;
        }else if(s1 instanceof Complex){
          myval = s1;
          continue;
        }else if(typeof s1 === 'number'){
          myval = Complex.create(s1);
          continue;
        }
        continue;
      }
      let phrase = s0.substr(0,s0.length - s.length);
      return [myval,s,phrase];
    }
    if (this.diagram && (v=this.re_scalar_pathptxy.exec(s))!==null) {
      /// scalar path point: '&pt[1].x', or '&pt[1].y'
      let phrase = v[0];
      let symbol = v[1];
      let x_y = v[2];
      s = v[3];
      let coords = this.diagram.get_path_from_symbol(symbol);
      let a = Complex.NAN;
      if(coords.length){
        let pt = this.diagram.point_at(coords,0);
        if(this.diagram.is_valid_point(pt)){
          let num = 0;
          if(x_y == 'x'){
            num = pt[0];
          }else if(x_y == 'y'){
            num = pt[1];
          }
          a = Complex.create(num);
        }
      }
      return [a,s,phrase];
    }
    if (this.diagram && (v=this.re_scalar_arraypt_0.exec(s))!==null){
      /// 'a[0]', 'a0[0]', 'a0[1]'
      let phrase = v[0];
      let symbol = v[1];
      let index = v[2];
      s = v[3];
      if(g.hasOwnProperty(symbol)){
        let m = g[symbol];
        if(m && Array.isArray(m)){
          if(index >= 0 && index < m.length){
            let a = m[index];///a complex number
            return [a,s,phrase];
          }
        }
      }
      let a = Complex.NAN;
      return [a,s,phrase];
    }
    if (this.diagram && (v=this.re_scalar_arraypt_i.exec(s))!==null){
      /// 'a[i]', 'a0[j]', 'a0[i0]'
      let phrase = v[0];
      let symbol = v[1];
      let index = v[2];
      s = v[3];
      if(g.hasOwnProperty(symbol)){
        let m = g[symbol];
        if(m && Array.isArray(m)){
          if(g.hasOwnProperty(index)){
            index = g[index];
            index = parseInt(index);
            if(index >= 0 && index < m.length){
              let a = m[index];///a complex number
              return [a,s,phrase];
            }
          }
        }
      }
      let a = Complex.NAN;
      return [a,s,phrase];
    }
    /// scalar function such as 'sin(x)'
    if ((v=this.re_scalar_func.exec(s))!==null) {
      let func_name = v[1];
      s = s.slice(v[0].length);
      let func_args = [];
      while(s.length){
        /// the 's' would have looked like: 'x+1, y+1, z)', we will 
        /// call extract next expr which will extract one of them until the comma or a right parentheiss
        /// and return its numerical value. If the returned 'a' is not a numerical value we will assume
        /// that we have exhausted all arguments of this func
        var [s1,s] = this.extract_next_expr(s,g,z+1);//extract until we see a comma or a right parenthesis
        if (s1 instanceof Complex) {
          func_args.push(s1);
          continue;
        }
        if (typeof s1 === 'number') {
          let a = Complex.create(s1);
          func_args.push(a);
          continue;
        }
        if(s1 === ','){
          continue;
        }
        if(s1 === ')'){
          break;
        }
        continue;
      }
      ///NOTE: the 'args' will already have held a list of 'Complex' numbers
      let num = this.exec_complex_func(func_name,func_args,g,z+1);//returns a 'Complex' number
      let phrase = s0.substr(0,s0.length - s.length);
      //console.log('debug','extract_next_scalar', 'scalar_func', 'num',num, 's',s, 'g',g, 'phrase',phrase);
      return [num,s,phrase];
    } 
    if((v=this.re_scalar_usvar.exec(s))!==null){
      let key = v[1];
      s = v[2];
      let num = Complex.ZERO;
      if(g && g.hasOwnProperty('_')){
        let m = g[key];
        try{
          num = Complex.create(m);
        }catch(e){
        }
      }
      let phrase = s0.substr(0,s0.length - s.length);
      return [num,s,phrase];
    }
    /// here we need to check to see if it is a '$1', '$2', '$3', etc. 
    if((v=this.re_scalar_dvar.exec(s))!==null){
      let id = parseInt(v[1].slice(1));
      s = v[2];
      let num = Complex.NAN;
      if(g && g.hasOwnProperty('$')){
        let m = g['$'];
        if(m && Array.isArray(m) && id>=1 && id<=m.length){
          num = m[id-1].raw;//hardcoded to be the 'raw' member
          if(num instanceof Complex){
            //no-op
          }else if(typeof num === 'number'){
            num = Complex.create(m);
          }else if(typeof num === 'string'){
            try{
              num = Complex.create(num);
            }catch(e){
              num = Complex.NAN;
            }
          }
        }
      }
      let phrase = s0.substr(0,s0.length - s.length);
      return [num,s,phrase];
    }
    /// here we need to check to see if it is a variable, such 
    /// as 'x', 'y', 'x1', 'xx1', etc. 
    if((v=this.re_scalar_var.exec(s))!==null){
      let key = v[1];
      s = v[2];
      let num = Complex.NAN;
      if(g && g.hasOwnProperty(key)){
        ///It could be a 'Complex' number, or it could be an array of Complex numbers
        let m = g[key];
        if(m && Array.isArray(m)){
          num = Complex.NAN;
        }else if(m instanceof Complex){
          num = m;
        }else if(typeof m === 'number'){
          num = Complex.create(m);
        }else if(typeof m === 'string'){
          try{
            num = Complex.create(m);
          }catch(e){
            num = Complex.NAN;
          }
        }
      }else if(key=='PI'){
        num = Complex.PI;
      }else if(key=='E'){
        num = Complex.E;
      }else if(key=='I'){
        num = Complex.I;
      }else if(key=='PHI'){
        num = Complex.create((1+Math.sqrt(5))/2);
      }
      let phrase = s0.substr(0,s0.length - s.length);
      //console.log('extract_next_scalar', 'var_symbol', num, s, g, phrase);
      return [num,s,phrase];
    }
    if((v=this.re_scalar_im.exec(s))!==null){
      let num = v[1];
      let suffix = v[2];
      s = v[3];
      num = parseFloat(num);
      let a = Complex.create(0,num);
      let phrase = s0.substr(0,s0.length - s.length);
      return [a,s,phrase];
    }
    if((v=this.re_scalar_is_oct.exec(s))!==null){
      /// '0o07'
      let num = v[1];
      s = v[2];
      num = parseInt(num,8);
      let a = Complex.create(num);
      let phrase = s0.substr(0,s0.length - s.length);
      return [a,s,phrase];
    }
    if((v=this.re_scalar_is_bin.exec(s))!==null){
      /// '0b110'
      let num = v[1];
      s = v[2];
      num = parseInt(num,2);
      let a = Complex.create(num);
      let phrase = s0.substr(0,s0.length - s.length);
      return [a,s,phrase];
    }
    if((v=this.re_scalar_is_hex.exec(s))!==null){
      /// '0x10'
      let num = v[1];
      s = v[2];
      num = parseInt(num,16);
      let a = Complex.create(num);
      let phrase = s0.substr(0,s0.length - s.length);
      return [a,s,phrase];
    }
    if((v=this.re_scalar_float.exec(s))!==null){
      /// if this is a float, such as 10, 11.2, 10E2, 10E-2, etc.
      let num = v[1];
      let suffix = v[2];
      s = v[3];
      if(suffix){
        num = `${num}${suffix}`
      }
      num = parseFloat(num);
      let a = Complex.create(num);
      let phrase = s0.substr(0,s0.length - s.length);
      return [a,s,phrase];
    }
    if((v=this.re_scalar_op.exec(s))!==null){
      /// such as '<', '>', '<=', '>='
      let phrase = v[0];
      let a = v[1];
      s = v[2];
      return [a,s,phrase];
    }
    if(1){
      /// something is wrong, only extract one character, and see if we can recover
      let cc = s.codePointAt(0);
      if(cc > 0xFFFF){
        let op = s.slice(0,2);
        let phrase = op;
        s = s.slice(2);
        return [op,s,phrase];
      }else{
        let op = s.slice(0,1);
        let phrase = op;
        s = s.slice(1);
        return [op,s,phrase];
      }
    }
  }
  exec_complex_func(func_name,func_args,g,z=0) {
    ///NOTE that 'func_args' would already have held a list of 'Complex' numbers
    switch(func_name) {
      case 'ln':
        if(func_args.length==1){
          return func_args[0].log();
        }else{
          return Complex.NAN;
        }
      case 'log':
        if(func_args.length==1){
          return func_args[0].log().div(Math.log(10));
        }else{
          return Complex.NAN;
        }
      case 'log2':
        if(func_args.length==1){
          return func_args[0].log().div(Math.log(2));
        }else{
          return Complex.NAN;
        }
      case 'exp':
        if(func_args.length==1){
          return func_args[0].exp();
        }else{
          return Complex.NAN;
        }
      case 'pow':
        if(func_args.length==2){
          return func_args[0].pow(func_args[1]);
        }else{
          return Complex.NAN;
        }
      case 'sqrt':
        if(func_args.length==1){
          return func_args[0].sqrt();     
        }else{
          return Complex.NAN;
        }
      case 'sin':
        if(func_args.length==1){
          return func_args[0].sin();
        }else{
          return Complex.NAN;
        }
      case 'cos':
        if(func_args.length==1){
          return func_args[0].cos();
        }else{
          return Complex.NAN;
        }
      case 'tan':
        if(func_args.length==1){
          return func_args[0].tan();
        }else{
          return Complex.NAN;
        }
      case 'asin':
        if(func_args.length==1){
          return func_args[0].asin();
        }else{
          return Complex.NAN;
        }
      case 'acos':
        if(func_args.length==1){
          return func_args[0].acos();
        }else{
          return Complex.NAN;
        }
      case 'atan':
        if(func_args.length==1){
          return func_args[0].atan();
        }else{
          return Complex.NAN;
        }
      case 'atan2':
        if(func_args.length==2){
          return Complex.create(Math.atan2(func_args[0].re,func_args[1].re));
        }else{
          return Complex.NAN;
        }
      case 'sinh':
        if(func_args.length==1){
          return func_args[0].sinh();
        }else{
          return Complex.NAN;
        }
      case 'cosh':
        if(func_args.length==1){
          return func_args[0].cosh();
        }else{
          return Complex.NAN;
        }
      case 'tanh':
        if(func_args.length==1){
          return func_args[0].tanh();  
        }else{
          return Complex.NAN;
        }
      case 'deg2rad':
        if(func_args.length==1){
          return Complex.create(func_args[0].re/180*Math.PI);
        }else{
          return Complex.NAN;
        }
      case 'rad2deg':
        if(func_args.length==1){
          return Complex.create(func_args[0].re/Math.PI*180);
        }else{
          return Complex.NAN;
        }
      case 'floor':
        if(func_args.length==1){
          return func_args[0].floor();
        }else{
          return Complex.NAN;
        }
      case 'ceil':
        if(func_args.length==1){
          return func_args[0].ceil();
        }else{
          return Complex.NAN;
        }
      case 'round':
        if(func_args.length==1){
          return func_args[0].round();
        }else{
          return Complex.NAN;
        }
      case 'abs':
        if(func_args.length==1){
          return Complex.create(func_args[0].abs());//the 'abs' returns a number
        }else{
          return Complex.NAN;
        }
      case 'sign':
        if(func_args.length==1){
          return func_args[0].sign();
        }else{
          return Complex.NAN;
        }
      case 'if':
        if(func_args.length==3){
          return (func_args[0].re == 0) ? func_args[2] : func_args[1];
        }else{
          return Complex.NAN;
        }
      case 'isfinite':
        if(func_args.length==1){
          return (func_args[0].isFinite()) ? Complex.ONE : Complex.ZERO;
        }else{
          return Complex.NAN;
        }
      case 'isnan':
        if(func_args.length==1){
          return (func_args[0].isNaN()) ? Complex.ONE : Complex.ZERO;
        }else{
          return Complex.NAN;
        }
      default:
        break;
    }
    if (this.diagram && this.diagram.my_fn_map.has(func_name)) {
      var f = this.diagram.my_fn_map.get(func_name);
      var g1 = {...g};//makes a copy
      /// place into 'g' so that each property is the name of the argument
      /// such as 'x', 'y', and the value of that property is the number
      /// in the same order of 'func_args' that is passed in
      f.args.forEach((x,i) => {
        g1[x] = func_args[i];
      });
      var myexpr = `${f.expr}`;
      ///NOTE: myexpr might look like 'x + y', and 'g1' contains two members 'x' and 'y', 
      var my = this.extract_next_expr(myexpr,g1,z);//this returns a 'Complex' number
      var [ret_val] = my;
      return ret_val;//this could be NaN too
    }
    return Complex.NAN;;
  }

  exec_operator(op,arg1,arg2,z=0) {
    switch(op) {
      case '*':
        return arg1.mul(arg2);
        break;
      case '+':
        return arg1.add(arg2);
        break;
      case '-':
        return arg1.sub(arg2);
        break;
      case '/':
        return arg1.div(arg2);
        break;
      case '%':
        return Complex.create(arg1.re % arg2.re);
        break;
      case '>':
        return (arg1.re > arg2.re) ? Complex.ONE : Complex.ZERO;
        break;
      case '<':
        return (arg1.re < arg2.re) ? Complex.ONE : Complex.ZERO;
        break;
      case '<=':
        return (arg1.re <= arg2.re) ? Complex.ONE : Complex.ZERO;
        break;
      case '>=':
        return (arg1.re >= arg2.re) ? Complex.ONE : Complex.ZERO;
        break;
      case '!=':
        return (arg1.re != arg2.re) ? Complex.ONE : Complex.ZERO;
        break;
      case '==':
        return (arg1.re == arg2.re) ? Complex.ONE : Complex.ZERO;
        break;
      default:
        /// if the operator is not recognized simply returns the latest operand
        return arg2;
        break;
    }
  }
  /*
  Planned functions
  product(a1,a2,a3,...) multiple all the numbers in the arguments and returns the final product
  */
   ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  read_var(line,env) {
    let [a] = this.extract_next_expr(line,env);
    return a;
  }
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  read_arr(line,env) {
    /// [5, 5, 0.5, 0.5, 3.14E-10, a, 1+2i, 2+1i] [1:3:10] [1:10] [1!10!20]
    var all = [];
    line = line.trimStart();
    var v;
    var fns = [];
    while(line.length) {
      /// {sqrt(x)}
      if((v=this.re_is_braces.exec(line))!==null){
        let fn = v[1];
        line = v[2];
        fns.unshift(fn);
        continue;
      }
      /// @xarr
      /// @yarr 
      if((v=this.re_is_avr.exec(line))!==null){
        let name = v[1];
        line = v[2];
        if(env.hasOwnProperty(name)){
          let l = env[name];
          if(l && Array.isArray(l)){
            l.forEach((x) => {
              all.push(x);
            })
          }
        }
        continue;
      }
      /// [5, 5, 0.5, 0.5, 3.14E-10, a, 1+2i, 2+1i] 
      /// [1:3:10] 
      /// [1:10] 
      /// [1!10!20]
      if((v=this.re_is_brackets.exec(line))!==null){ 
        var expr = v[1];
        line = v[2];
        if((v=this.re_is_range_two.exec(expr))!==null){
          /// '1:10'
          /// '1:10;3
          let v1 = v[1];
          let v2 = v[2];
          let n = 0;
          let k = v2.indexOf(';');
          if(k>0){
            n = parseInt(v2.slice(k+1))||0;
            v2 = v2.slice(0,k)
          }
          let [a1] = this.extract_next_expr(v1,env);
          let [a2] = this.extract_next_expr(v2,env);
          if(n==0){
            n = Math.floor(Math.abs(a2.sub(a1).re))-1;
            if(n>this.MAX_ARRAY){
              n=this.MAX_ARRAY;
            }
          }
          if(a1.isFinite()&&a2.isFinite()){
            all.push(a1);
            for(let i=0; i<n; ++i){
              let a = a1.add(i+1);
              if(n>0){
                a = a2.sub(a1).mul(i+1).div(n+1).add(a1);
              }
              all.push(a);
            }
            all.push(a2);
          }
          continue; 
        }
        if((v=this.re_is_range_three.exec(expr))!==null){
          /// '1:4:10'
          let [a1] = this.extract_next_expr(v[1],env);
          let [a2] = this.extract_next_expr(v[2],env);
          let [a3] = this.extract_next_expr(v[3],env);
          if(a1.isFinite()&&a2.isFinite()&&a3.isFinite()){
            all.push(a1);
            let a = a2.clone();
            for(let i=0; i < this.MAX_ARRAY; ++i){
              ///**IMPORTANT: only compare the real part because a is a Complex number
              if(a.re > a3.re){
                break;
              }
              all.push(a);
              let incr = a2.sub(a1);
              a = a.add(incr);
            }
          }
          continue;
        }
        if(1){
          ///'12.3', '12.3+10i', '12.3-10i', '1i', '-1i', '1.234E-10'
          let a;
          let s = expr;
          while(s.length){
            [a,s] = this.extract_next_expr(s,env);
            all.push(a);
            let c = s.charAt(0);
            if (c === ',') {
              s = s.slice(1);
              s = s.trimStart();
              continue;
            }
            break;
          }
        }
        continue;
      }
      break;
    }
    for(let fn of fns){
      let g = {...env};
      all = all.map((x) => {
        g['x'] = x;
        let [a] = this.extract_next_expr(fn,g);
        return a;
      });
    }
    if(0){
      let s0 = this.array_to_string(all);
      console.log(`*** [arr] ${s0}`);
    }
    ///DO NOT filter 'o', as it might contain NAN, which is okay, let the command check, otherwise the order
    // of numbers will be messed up
    //o = o.filter( x => Number.isFinite(x) );
    return all;
  }
}
module.exports = { NitrilePreviewExpr };
