'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { Complex } = require('./nitrile-preview-complex');
class NitrilePreviewExpr extends NitrilePreviewBase {

  constructor(diagram) {
    super();
    this.diagram = diagram;
    // scalar function
    this.re_scalar_pathptxy = /^&([A-Za-z][A-Za-z0-9]*_\d+)\.([xy])\s*(.*)$/;
    this.re_scalar_arraypt  = /^([A-Za-z][A-Za-z0-9]*)\[(\d+)\]\s*(.*)$/;
    this.re_scalar_func     = /^([A-Za-z][A-Za-z0-9]*)\(/;
    this.re_scalar_var      = /^([A-Za-z][A-Za-z0-9]*)\s*(.*)$/;
    this.re_scalar_im       = /^(\d*\.\d+|\d*\.|\d+)(i|j)(.*)$/;    
    this.re_scalar_float    = /^(\d*\.\d+|\d*\.|\d+)(e\d+|e\+\d+|e\-\d+|E\d+|E\+\d+|e\-\d+|)(.*)$/;    
    this.re_scalar_op       = /^(>=|<=|==|!=|>|<)\s*(.*)$/;    
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
    s = s.trimLeft();
    var op = '';
    var arg1 = Complex.create(0);
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
        s = s.trimLeft();
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
      s = s.trimLeft();
    }
    var phrase = s0.substr(0,s0.length-s.length);
    //console.log('extract_next_expr', arg1, s, phrase);
    return [arg1,s,phrase];
  }

  extract_next_term(s,g,z=0){
    /// a term is defined as number multiplied together with operator * or /,
    /// for instance, for '1 + 2*2 + 1', the '2*2' is to be processed by this function
    var s0 = s;
    s = s.trimLeft();
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
      s = s.trimLeft();
    }
    var phrase = s0.substr(0,s0.length-s.length);
    //console.log('extract_next_expr', arg1, s, phrase);
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
    s = s.trimLeft();
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
      /// scalar path point: '&pt_0.x', or '&pt_0.y'
      let phrase = v[0];
      let symbol = v[1];
      let x_y = v[2];
      s = v[3];
      let coords = this.diagram.get_path_from_symbol(symbol);
      let a = Complex.NAN;
      if(coords.length){
        let pt = this.diagram.point(coords,0);
        if(this.diagram.isvalidpt(pt)){
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
    if (this.diagram && (v=this.re_scalar_arraypt.exec(s))!==null){
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
    /// scalar function such as 'sin(x)'
    if ((v=this.re_scalar_func.exec(s))!==null) {
      let func_name = v[1];
      s = s.slice(v[0].length);
      let func_args = [];
      while(s.length){
        /// the 's' would have looked like: 'x+1, y+1, z)', we will 
        /// call extract_next_expr which will extract one of them until the comma or a right parentheiss
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
        }else if(m){
          num = m;
        }
      }else if(key=='PI'){
        num = Complex.PI;
      }else if(key=='E'){
        num = Complex.E;
      }else if(key=='I'){
        num = Complex.I;
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
      /// extract the next character which must be an operator
      /// such as '+', '-', '*', '/'
      let op = s.charAt(0);
      s = s.slice(1);
      let phrase = s0.substr(0,s0.length - s.length);
      return [op,s,phrase];
    }
  }

  exec_float_func(func_name,func_args,g,z=0){
    var func_args = func_args.map((x) => {
      return Complex.create(x);
    })
    var s1 = this.exec_complex_func(func_name,func_args,g,z);
    return s1.re;
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
}
module.exports = { NitrilePreviewExpr };
