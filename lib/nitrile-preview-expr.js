'use babel';

const N_Max_Array = 256;
const { NitrilePreviewBase } = require('./nitrile-preview-base');
class NitrilePreviewExpr extends NitrilePreviewBase {

  constructor(diagram) {
    super();
    this.diagram = diagram;
    // scalar function
    this.re_scalar_var      = /^([A-Za-z][A-Za-z0-9]*)(.*)$/;
    this.re_scalar_pathptxy = /^&([A-Za-z0-9_]+)\.([xy])\s*(.*)$/;
    this.re_scalar_func     = /^([A-Za-z]\w*)\(/;
    this.re_scalar_float    = /^(\d*\.\d+|\d*\.|\d+)(e\d+|e\+\d+|e\-\d+|E\d+|E\+\d+|e\-\d+|)(.*)$/;    
  }

  /// extract the expression of a+1,b+1
  /// until we have just gone past the comma, in which
  /// case the comma will be discarded and the value of the expression 'a+1'
  /// is caluclated based on the variable stored with the 'g' 
  extract_next_expr(s,g,z=0){
    //NOTE: 's' is the input string. 'g' contains a list of arguments. 'z' is the level of nesting
    /// - this function will stop at the first sign of a comma,
    /// - this function will stop at the first sign of a unmatched close-parenthesis 
    /// such as x+1+y,...
    /// such as x+1)...
    var s0 = s;
    s = s.trimLeft();
    var op = '';
    var arg1 = 0;
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
      var [a,s,phrase] = this.extract_next_term(s,g,z+1);
      ///'a' is string such as '*', '+', ')', or ','
      if (typeof a === 'number') {
        /// assume a is 'arg2 and run the operator
        let arg2 = a;
        arg1 = this.exec_operator(op,arg1,arg2);
        /// it is important to clear op here
        op = ''; 
        arg2 = '';
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
    /// such as 'a*2/pi'
    var s0 = s;
    s = s.trimLeft();
    var op = '';
    var arg1 = 0;
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
      var [a,s,phrase] = this.extract_next_scalar(s,g,z+1);
      ///'a' is string such as '*', '+', ')', or ',', 
      ///'a' could also be a number
      if (typeof a === 'number') {
        /// assume 'a' is 'arg2' and run the operator
        var arg2 = a;
        arg1 = this.exec_operator(op,arg1,arg2);
        /// it is important to clear op here
        op = ''; 
        arg2 = '';
      }else{
        /// otherwise assume 'a' is an operator
        op = a; 
      } 
      s = s.trimLeft();
    }
    var phrase = s0.substr(0,s0.length-s.length);
    //console.log('extract_next_expr', arg1, s, phrase);
    return [arg1,s,phrase];
  }

  extract_next_scalar(s,g,z=0) {
    ///NOTE: this function returns an array of three elements: [num,s,phrase]
    /// The first one is a number if what extracted is a number. It could also 
    /// be a string expressing a multiplcation sign or division sign: '*' or '/'. 
    ///
    /// A scalar is defined as the value of a 
    /// complete function (including any
    /// nested functions as well), an parenthesized expression,
    /// a multiplication sign, or a division sign 
    var s0 = s;
    s = s.trimLeft();
    if (s.length===0) {
      return ['','',''];
    }
    var v;
    if (s.charAt(0)==='('){
      var myval = 0;
      s = s.slice(1);
      while(s.length){
        var [a,s] = this.extract_next_expr(s,g,z+1);
        if(a === ')'){
          break;
        }else if(a === ','){
          continue;
        }else if(typeof a === 'number'){
          myval = a;
          continue;
        }
        continue;
      }
      var phrase = s0.substr(0,s0.length - s.length);
      //console.log('extract_next_scalar','paren',myval,s,g,phrase);
      return [myval,s,phrase];
    }
    /// scalar path point: '&pt_0.x', or '&pt_0.y'
    if (this.diagram && (v=this.re_scalar_pathptxy.exec(s))!==null) {
      let symbol = v[1];
      let x_y = v[2];
      s = v[3];
      var num = 0;
      let coords = this.diagram.get_path_from_symbol(symbol);
      if(coords.length){
        let pt = this.diagram.point(coords,0);
        if(this.diagram.isvalidpt(pt)){
          if(x_y == 'x'){
            num = pt[0];
          }else if(x_y == 'y'){
            num = pt[1];
          }
        }else{
          num = 0;
        }
      }
      var phrase = v[0];
      return [num,s,phrase];
    }
    /// scalar function such as 'sin(x)'
    if ((v=this.re_scalar_func.exec(s))!==null) {
      var func_name = v[1];
      s = s.slice(v[0].length);
      var args = [];
      while(s.length){
        /// the 's' would have looked like: 'x+1, y+1, z)', we will 
        /// call extract_next_expr which will extract one of them until the comma or a right parentheiss
        /// and return its numerical value. If the returned 'a' is not a numerical value we will assume
        /// that we have exhausted all arguments of this func
        var [a,s] = this.extract_next_expr(s,g,z+1);//extract until we see a comma or a right parenthesis
        if (typeof a === 'number') {
          args.push(a);
          continue;
        }
        if(a === ','){
          continue;
        }
        if(a === ')'){
          break;
        }
        continue;
      }
      var num = this.exec_scalar_func(func_name,args,z+1);
      var phrase = s0.substr(0,s0.length - s.length);
      //console.log('debug','extract_next_scalar', 'scalar_func', 'num',num, 's',s, 'g',g, 'phrase',phrase);
      return [num,s,phrase];
    } 
    /// here we need to check to see if it is a variable, such 
    /// as 'x', 'y', 'x1', 'xx1', etc. 
    if((v=this.re_scalar_var.exec(s))!==null){
      var var_name = v[1];
      s = v[2];
      if(g && g.hasOwnProperty(var_name)){
        var num = g[var_name];
      }else if(var_name=='PI'){
        var num = Math.PI;
      }else if(var_name=='E'){
        var num = Math.E;
      }else{
        var num = NaN;
      }
      var phrase = s0.substr(0,s0.length - s.length);
      //console.log('extract_next_scalar', 'var_symbol', num, s, g, phrase);
      return [num,s,phrase];
    }
    /// if this is a float
    if((v=this.re_scalar_float.exec(s))!==null){
      var num = v[1];
      var suffix = v[2];
      s = v[3];
      if(suffix){
        num = `${num}${suffix}`
      }
      num = parseFloat(num);
      var phrase = s0.substr(0,s0.length - s.length);
      //console.log('extract_next_scalar', 'float_number', num, s, g, phrase);
      return [num,s,phrase];
    }
    /// extract the next character which must be an operator
    /// such as '+', '-', '*', '/'
    var op = s.charAt(0);
    s = s.slice(1);
    var phrase = s0.substr(0,s0.length - s.length);
    //console.log('extract_next_scalar', op, s, g, phrase);
    return [op,s,phrase];
  }

  /*
  Math.log() return the natural logarithm that is base e
  Math.log10 - return base 10 log
  The Math.log1p() function returns the natural logarithm (base e) of 1 + a number, that is
    Math.log1p(x) = ln(1+x), assuming x > -1
  The Math.log2() function returns the base 2 logarithm
  The constant Math.LN10 is the natural logarithm of 10, which is approx. 2.302
  */

  exec_scalar_func(func_name,func_args,z=0) {
    switch(func_name) {
      case 'ln':
        return Math.log(func_args[0]);
      case 'log':
        return Math.log10(func_args[0]);
      case 'log2':
        return Math.log2(func_args[0]);
      case 'exp':
        return Math.exp(func_args[0]);
      case 'pow':
        return Math.pow(func_args[0],func_args[1]);
      case 'sqrt':
        return Math.sqrt(func_args[0]);     
      case 'sin':
        return Math.sin(func_args[0]);
      case 'cos':
        return Math.cos(func_args[0]);
      case 'tan':
        return Math.tan(func_args[0]);
      case 'asin':
        return Math.asin(func_args[0]);
      case 'acos':
        return Math.acos(func_args[0]);
      case 'atan':
        return Math.atan(func_args[0]);
      case 'atan2':
        return Math.atan2(func_args[0],func_args[1]);
      case 'sinh':
        return Math.sinh(func_args[0]);
      case 'cosh':
        return Math.cosh(func_args[0]);
      case 'tanh':
        return Math.tanh(func_args[0]);  
      case 'deg2rad':
        return func_args[0]/180*Math.PI;
      case 'rad2deg':
        return func_args[0]/Math.PI*180;
      case 'floor':
        return Math.floor(func_args[0]);
      case 'ceil':
        return Math.ceil(func_args[0]);
      case 'round':
        return Math.round(func_args[0]);
      case 'abs':
        return Math.abs(func_args[0]);
      case 'sign':
        return Math.sign(func_args[0]);
      default:
        break;
    }
    if (this.diagram && this.diagram.my_fn_map.has(func_name)) {
      var f = this.diagram.my_fn_map.get(func_name);
      var g = {};
      /// place into 'g' so that each property is the name of the argument
      /// such as 'x', 'y', and the value of that property is the number
      /// in the same order of 'func_args' that is passed in
      f.args.forEach((x,i) => {
        g[x] = func_args[i];
      });
      var myexpr = `${f.expr}`;
      //console.log('debug','myexpr',myexpr)
      //the myexpr is a string such as  '(4*x+0.5+3)'
      //and the 'g' variable contains a list of its arguments and its assigned values
      var [ret_val] = this.extract_next_expr(myexpr,g);
      return ret_val;//this could be NaN too
    }
    return NaN;
  }

  exec_operator(op,arg1,arg2,z=0) {
    switch(op) {
      case '*':
        return parseFloat(arg1)*parseFloat(arg2);
        break;
      case '+':
        return parseFloat(arg1)+parseFloat(arg2);
        break;
      case '-':
        return parseFloat(arg1)-parseFloat(arg2);
        break;
      case '/':
        return parseFloat(arg1)/parseFloat(arg2);
        break;
      default:
        /// if the operator is not recognized simply returns the latest operand
        return arg2;
        break;
    }
  }
}
module.exports = { NitrilePreviewExpr };
