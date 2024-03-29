'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewExpr } = require('./nitrile-preview-expr');
const { makeknots, mp_make_choices } = require('./nitrile-preview-mppath');
const { Complex } = require('./nitrile-preview-complex');
const { NitrilePreviewClip } = require('./nitrile-preview-clip');

class NitrilePreviewDiagram extends NitrilePreviewBase {

  constructor(translator) {
    super();
    this.translator = translator;
    this.expr = new NitrilePreviewExpr(this);
    this.clip = new NitrilePreviewClip();
    /// all ss maps
    /// regular expression for non-action commands
    this.re_else_command = /^\\else$/;
    this.re_elif_command = /^\\elif\s+(.*)\s*\\then$/;
    this.re_if_command = /^\\if\s+(.*)\s*\\then$/;
    this.re_for_command = /^\\for\s+(.*)\s*\\do$/;
    this.re_proc_command = /^\\proc\s+([A-Za-z][A-Za-z0-9]*)\s*\((.*)\)$/;
    this.re_call_command = /^\\call\s+([A-Za-z][A-Za-z0-9]*)\s*\((.*)\)$/;
    this.re_exit_command = /^\\exit/;
    this.re_shape_command = /^\\shape\s+(.*?)\s*\=\s*(.*)$/;
    this.re_path_command = /^\\path\s+(.*?)\s*\=\s*(.*)$/;
    this.re_fn_command =    /^\\fn\s+([A-Za-z][A-Za-z0-9]*)\((.*?)\)\s*=\s*(.*)$/;
    this.re_var_command = /^\\var\s+([A-Za-z][A-Za-z0-9]*)(\[\]|)\s*=\s*(.*)$/;
    this.re_letp_command = /^\\let\s+\(([A-Za-z][A-Za-z0-9]*),([A-Za-z][A-Za-z0-9]*)\)\s*=\s*(.*)$/;
    this.re_letc_command = /^\\let\s+([A-Za-z][A-Za-z0-9]*):([A-Za-z][A-Za-z0-9]*)\s*=\s*(.*)$/;
    this.re_set_command = /^\\set\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*(.*)$/;
    this.re_format_command = /^\\format\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*(.*)$/;
    this.re_origin_command = /^\\origin\s+(.*)$/;
    this.re_log_command = /^\\log\s+(.*)$/;
    // when reading numbers
    this.re_numbers_is_fn            = /^\^fn:(\w+)\s*(.*)$/;
    this.re_numbers_is_list          = /^\[(.*?)\]\s*(.*)$/;
    this.re_numbers_is_solid         = /^(\S+)\s*(.*)$/;
    // when reading coords
    this.re_coords_is_txty           = /^([-+]\d)([-+]\d)\s*(.*)$/;
    this.re_coords_is_label          = /^\"([^"]*)\"\s*(.*)$/;
    this.re_coords_is_style          = /^\{(.*?)\}\s*(.*)$/;
    this.re_coords_is_pathfunc       = /^&([A-Za-z][A-Za-z0-9]*)\{(.*?)\}\s*(.*)$/;
    this.re_coords_is_pathvar        = /^&([A-Za-z][A-Za-z0-9]*)(\[\d+\]|_\d+|)\s*(.*)$/;
    this.re_coords_is_aux            = /^\^([A-Za-z\*]+)(:?)(\S*)\s*(.*)$/;
    this.re_coords_is_point          = /^\((.*?)\)\s*(.*)$/;
    this.re_coords_is_relative       = /^\<(.*?)\>\s*(.*)$/;
    this.re_coords_is_dashdot        = /^(\.+|\-+)\s*(.*)$/;
    this.re_coords_is_join           = /^\|(.*?)\|\s*(.*)$/;
    this.init_internals();
  }
  init_internals(style={}){
    // call stack maximum
    this.call_stack = [];
    // lastpt
    this.lastpt_x = 0;
    this.lastpt_y = 0;
    // for ^save and ^restore
    this.save = {};
    this.save.lastoffset_x = 0;
    this.save.lastoffset_y = 0;
    this.save.lastoffset_sx = 1;
    this.save.lastoffset_sy = 1;
    this.save.lastoffset_xmin = 0;
    this.save.lastoffset_ymin = 0;
    /// all translated commands in SVG or MP/MF
    this.commands = [];
    /// the last configured barchar coord
    this.my_barchart = {};
    /// the last configured lego coord
    this.my_lego = {};
    /// the last configured trump settings
    this.my_trumps = {};
    /// proc
    this.my_proc_map = new Map();
    /// shape
    this.my_shape_map = new Map();
    /// path
    this.my_path_map = new Map();
    /// all funcs defined by 'fn' command
    this.my_fn_map = new Map();
    /// all cars
    this.my_chart_map = new Map();
    /// all cars
    this.my_car_map = new Map();
    /// all nodes
    this.my_node_map = new Map();
    /// all detailsings
    this.my_box_map = new Map();
    /// all cartesians
    this.my_cartesian_map = new Map();
    /// all the linesegs
    this.my_lineseg_array = [];
    /// viewport
    this.viewport_width = this.VIEWPORT_WIDTH;
    this.viewport_height = this.VIEWPORT_HEIGHT;
    this.viewport_unit = this.VIEWPORT_UNIT;
    this.viewport_grid = this.VIEWPORT_GRID;
    /// origin
    this.origin_x = 0;
    this.origin_y = 0;
    this.origin_sx = 1;
    this.origin_sy = 1;   
    /// import style
    this.env = {...style};
    /// my imgsrc and my imgid
    this.my_images = [];
  }
  do_origin_command(val,env) {
    var ss = this.string_to_array(val);
    ///
    /// set origin ^at:a
    /// set origin ^pt:a
    /// set origin ^left:2 ^right:2 ^up:2 ^down:2
    /// set origin ^x:2 ^y:2 
    ///
    ss.forEach((s,i,arr) => {
      if(!s.startsWith('^')){
        return;
      }
      s = s.substr(1);
      let [name,num] = this.extract_named_float(s,env);
      let [name1,symbol] = this.extract_named_string(s,env);
      switch(name){
        case 'h':
          this.origin_x += num;
          break;
        case 'v':
          this.origin_y += num;
          break;
        case 'y':
          this.origin_y = num;
          break;
        case 'x':
          this.origin_x = num;
          break;
        case 'pt':
          //NOTE: pt:a
          if(this.re_is_symbol_name.test(symbol)){
            let pt = [0,0,'M','','','','', 0,0,0,0,0, 0];
            pt[0] = this.origin_x;
            pt[1] = this.origin_y;
            let p = [pt];
            this.my_path_map.set(symbol,p);
            this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
          }
          break;
        case 'at':
          //NOTE: at:a
          let p = this.get_path_from_symbol(symbol);
          let pt = this.point_at(p,0);
          if(this.is_valid_point(pt)){
            this.origin_x = pt[0];
            this.origin_y = pt[1];
          }
          break;
        case 'center':
          this.origin_x = this.viewport_width/2; 
          this.origin_y = this.viewport_height/2; 
          break;
        case 'top':
          this.origin_y = this.viewport_height; 
          break;
        case 'side':
          this.origin_x = this.viewport_width; 
          break;
        case 's':
          // '^s:1.25'
          if(num > this.MIN_FLOAT){
            this.origin_sx = num;
            this.origin_sy = num;
            this.origin_x *= num;
            this.origin_y *= num;
          }
          break;
        case 'sx':
          // '^sx:1.25'
          if(num > this.MIN_FLOAT){
            this.origin_sx = num;
            this.origin_x *= num;
          }
          break;
        case 'sy':
          // '^sy:1.25'
          if(num > this.MIN_FLOAT){
            this.origin_sy = num;
            this.origin_y *= num;
          }
          break;
        case 'reset':
          // ^reset
          this.origin_x = 0;
          this.origin_y = 0;
          this.origin_sx = 1;
          this.origin_sy = 1;
          break;
      }
    });
  }
  ///*NOTE: join body lines
  join_body_lines(style,lines) {
    ///
    ///copy lines from 'lines' to 'o' and scan for buffer
    ///
    var o =[];
    if(1){
      var save_buf = null;
      var v;
      ///read buffer
      // const re_start = /^%+\s*(.*)$/;
      // const re_paste = /^\?(\w+)$/;
      for(var s of lines){
        if((v=this.re_is_buf_start.exec(s))!==null){
          s = v[1];
          save_buf = null;
          if((v=this.re_is_buf_paste.exec(s))!==null){
            let name = v[1];
            if(style.__parser.buff.hasOwnProperty(name)){
              let {ss} = style.__parser.buff[name];
              o = o.concat(ss);
            }
          }
          continue;
        } 
        o.push(s);
        if(save_buf){
          save_buf.push(s);
        }
      }
      lines = o;
      o = [];
    }
    if(1){
      for (var s of lines) {
        if(o.length){
          var s0 = o[o.length-1];
          if (s0 && s0.endsWith('\\')) {
            s0 = o.pop();
            s0 = s0.slice(0,s0.length-1);///remove the last backslash
            s = `${s0}${s.trimStart()}`;///add no space between them
            o.push(s);
          }else{
            o.push(s);
          }
        }else{
          o.push(s);
        }
      }
      lines = o;
      o = [];
    }
    return lines;
  }

  ///*NOTE: this method is to execute an isolated program body.
  ///       the body could be the entire problem itself, but it can
  ///       also be a for-loop body, in which case the for-loop 
  ///       ensure to call it multiple times, each time the code
  ///       being executed are slightly different than before, because
  ///       of the replacement of one or loop variables with the actual
  ///       value

  exec_body(style,body,env){
    var v;
    var max_n;
    var lines = this.join_body_lines(style,body);//also made a new copy of it
    while (lines.length) {
      var line = lines.shift();//modify 'lines' variable
      var line0 = line;///save the original line
      //
      // replace this line with env variables 
      //
      this.do_comment(line);
      var line = this.substitute_dollar_expressions(style,line,env);
      //
      //send to console
      //
      //
      // exit 
      //
      if((v=this.re_exit_command.exec(line))!==null) {
        break;
        continue;
      }
      //
      // shape 
      //
      if((v = this.re_shape_command.exec(line)) !== null) {
        let symbol = v[1];
        let p = this.read_coords(v[2],env);
        let q = p[0];
        let g = p[1];
        let t = p[2];
        this.do_shape_command(symbol,q,g,t,env);
        continue;
      }
      //
      // path 
      //
      if((v = this.re_path_command.exec(line)) !== null) {
        let symbol = v[1];
        let p = this.read_coords(v[2],env);
        let coords = p[0];
        this.do_path_command(symbol,coords,env);
        continue;
      }
      //
      // fn
      //
      if((v = this.re_fn_command.exec(line)) !== null) {
        var f = {};
        f.name = v[1];
        f.args = v[2].split(',');
        f.expr = v[3];
        let valid_name = this.re_is_symbol_name.test(f.name);
        let valid_args = f.args.filter((s) => this.re_is_symbol_name.test(s));
        if(valid_name && valid_args.length == f.args.length){
          this.my_fn_map.set(f.name,f);
          this.do_comment(`*** fn ${f.name}(${f.args.join(',')}) = ${f.expr}`);
        }else{
          this.do_comment(`*** [ERROR] '${f.name}' is not a valid symbol name`);
        }
        continue;
      } 
      //
      // \var a = 12.3
      //
      // or 
      //
      // \var a[] = [12.3, 12.4, 12.5]
      // \var b[] = @a
      // \var c[] = {sqrt(x)} @b
      if((v=this.re_var_command.exec(line))!==null){
        let key = v[1];
        let brk = v[2]
        let val = v[3];
        if(brk){
          let a = this.expr.read_arr(val,env);//returns an array 'Complex' number
          env[key] = a;
          this.do_comment(`*** [var] ${key}[] = ${this.string_from_array(a)}`);          
        }else{
          let a = this.expr.read_var(val,env);
          env[key] = a;
          this.do_comment(`*** [var] ${key} = ${a}`);          
        }
        continue;
      }  
      //
      // \let (cx,cy) = (&O) // this sets 'cx' to x-coord and 'cy' to y-coord of (&O) point
      //
      if((v=this.re_letp_command.exec(line))!==null){
        let cx = v[1];
        let cy = v[2];
        let val = v[3];
        let [q] = this.read_coords(val,env);
        if(q.length){
          env[cx] = q[0][0];
          env[cy] = q[0][1];
          this.do_comment(`*** [let] ${cx}:${q[0][0]}, ${cy}:${q[0][1]}`);          
        }
        continue;
      }   
      //
      // \let Re:Im = a // this sets 'Re' to the real part and 'Im' to the imaginary part
      //
      if((v=this.re_letc_command.exec(line))!==null){
        let cx = v[1];
        let cy = v[2];
        let val = v[3];
        let number = this.expr.read_var(val,env);
        if(number.isFinite()){
          env[cx] = number.re;
          env[cy] = number.im;
          this.do_comment(`*** [let] ${cx}:${number.re}, ${cy}:${number.im}`);          
        }else{
          env[cx] = NaN;
          env[cy] = NaN;
          this.do_comment(`*** [let] ${cx}:${NaN}, ${cy}:${NaN}`);          
        }
        continue;
      }   
      //
      // \set fillcolor = green
      //
      if((v=this.re_set_command.exec(line))!==null){
        let key = v[1];
        let val = v[2];
        env[key] = val;
        continue;
      }
      //
      // \format a = @"%d-%d-%d" 1 2 3
      //
      if((v=this.re_format_command.exec(line))!==null){
        let symbol = v[1];
        let expr = v[2];
        let s = this.read_format_expr(expr,env);
        env[symbol] = s;
        continue;
      }   
      //
      // origin
      //
      if((v = this.re_origin_command.exec(line)) !== null) {
        var val = v[1].trim();
        this.do_origin_command(val,env);
        continue;
      }    
      //
      // log    
      //
      if((v=this.re_log_command.exec(line))!==null) {
        let s = v[1];
        console.log(`*** [log] ${s}`);
        continue;
      } 
      //
      // if-then-end
      //
      // \if i > 10; \then
      //   show ${i}
      // \elif i > 5; \then
      //   show ${i}
      // \elif i > 0; \then
      //   show ${i}
      // \else
      //   show ${i}
      // \fi
      //
      if((v=this.re_if_command.exec(line)) !== null) {
        // extract all lines underneath it until the 'end' line
        let expr = v[1];
        let thehash = this.extract_ifthen_hash(style,lines,expr);
        let thebody = this.exec_ifthen_hash(thehash,env);//it could return null
        if(thebody){
          this.exec_body(style,thebody,env);
        }
        continue;
      }
      //
      // for-loop
      //
      // \for cx in [1,2,3]; cy in [11,12,13]; \do
      //   \drawcircle
      // \done
      //
      // \for (cx,cy) in (1,2)(2,12)(3,13); \do
      //   \drawcircle
      // \done
      //
      if((v=this.re_for_command.exec(line)) !== null) {
        // extract all lines underneath it that is indented
        var loopbody = this.extract_for_loop_body(style,lines);
        var max_n = 0;
        var s = v[1];
        var iter_array = [];
        const re_for_pathpp = /^\(([A-Za-z][A-Za-z0-9]*),([A-Za-z][A-Za-z0-9]*)\)\s*in\s*(.*?)\s*;\s*(.*)$/;
        const re_for_scalar = /^([A-Za-z][A-Za-z0-9]*)\s*in\s*(.*?)\s*;\s*(.*)$/;
        while(s.length){
          if((v=re_for_pathpp.exec(s))!==null) {
            var s = v[4];
            let cx = v[1];
            let cy = v[2];
            let [q] = this.read_coords(v[3],env);
            if(1){
              let key = cx;
              let floats = q.map(pt => pt[0]);
              iter_array.push({key,floats});
              max_n = Math.max(floats.length,max_n);
            }
            if(1){
              let key = cy;
              let floats = q.map(pt => pt[1]);
              iter_array.push({key,floats});
              max_n = Math.max(floats.length,max_n);
            }
          }else if((v=re_for_scalar.exec(s))!==null) {
            var s = v[3];
            let key = v[1];
            let s1 = v[2];
            let numbers = this.expr.read_arr(s1,env);//returns an array 'Complex' number
            let floats = this.numbers_to_floats(numbers);
            iter_array.push({key,floats});
            max_n = Math.max(floats.length,max_n);
          }else{
            break;
          }
        }
        //trim loop body also makes a copy
        for(var i=0; i < max_n; ++i){
          //execute loopbody 'max_n' number of times
          //NOTE: each time set the '_' environment variable to the counter starting with '0'
          env['_']=i;
          this.do_comment(`*** _:${i}`);
          for(let {key,floats} of iter_array){
            if(i < floats.length){
              let float = floats[i];
              env[key] = float;
              this.do_comment(`*** ${key}:${float}`);
            }
          }
          //execute loopbody with the updated 'env'
          this.exec_body(style,loopbody,env);
          continue;
        }
        continue;
      }
      //
      // \proc draw a b
      //   \drawline (a,a)(b,b)
      // \endproc
      //
      if((v=this.re_proc_command.exec(line)) !== null) {
        let name = v[1];
        let l = v[2].split(',').map(s=>s.trim());
        // extract all lines underneath it that is indented
        let body = this.extract_for_proc_body(style,lines);
        this.my_proc_map.set(name,{l,body});
        continue;
      }
      //
      // \call draw 0 10
      //
      if((v=this.re_call_command.exec(line)) !== null) {
        let Name = v[1];
        let L = v[2].split(',').map(s=>s.trim());
        if(this.my_proc_map.has(Name)){
          let {l,body} = this.my_proc_map.get(Name);
          let g1 = {};
          for(let i=0; i < l.length; ++i){
            let x = l[i];
            let X = L[i]||'';
            if(this.re_is_symbol_name.test(x)){
              g1[x] = this.expr.read_var(X,env);
            }
          }
          let env1 = {...env,...g1};
          if(this.call_stack.length<10){
            this.call_stack.push({});
            this.exec_body(style,body,env1);
            this.call_stack.pop();
          }
        }
        continue;
      }
      //
      // only execute lines that do not start with spaces
      // NOTE: generate a comment in the output
      //
      var line = this.exec_action_command(style,line,env);
      if(line){
        this.commands.push(line);
      }
    }
  }
  eval_boolean_expr(s,env){
    /// eval boolean expression, which is one or more arithmetic expressions
    /// joint by the AND, OR
    const re_expr_one = /^(AND|OR|)\s*(.*?);\s*(.*)$/;
    var a = Complex.ONE;
    var v;
    while((v=re_expr_one.exec(s))!==null){
      let join = v[1];
      let expr = v[2];
      s = v[3];
      let [a1] = this.expr.extract_next_expr(expr,env);
      switch(join){
        case 'AND':
          a = (a.re==1 && a1.re==1) ? Complex.ONE : Complex.ZERO;
          break;
        case 'OR':
          a = (a.re==1 || a1.re==1) ? Complex.ONE : Complex.ZERO;
          break;
        default:
          a = a1;
          break;
      }
    }
    return a;
  }
  exec_ifthen_hash(hash,env){
    var ret_val = null;
    for(let l of hash){
      let [expr,body] = l;
      let flag = this.eval_boolean_expr(expr,env);
      if(flag.isFinite() && flag.re == 1){
        ret_val = body;
        break;
      }
    }
    if(ret_val){
      ret_val = this.trim_samp_body(ret_val);
    }
    return ret_val;
  }
  extract_ifthen_hash(style,lines,expr){
    var hash = [];
    var body = [];
    hash.push([expr,body]);
    var v;
    while(lines.length) {
      //lookahead
      var line = lines[0];
      if(line.length==0){
        //ignore empty lines
        lines.shift();//remove the first line
        continue;
      }
      if(line=='\\fi'){
        lines.shift();
        break;
      }
      if((v=this.re_elif_command.exec(line))!==null){
        expr = v[1];
        body = [];
        hash.push([expr,body]);
        lines.shift();
        continue;
      }
      if((v=this.re_else_command.exec(line))!==null){
        expr = '1';
        body = [];
        hash.push([expr,body]);
        lines.shift();
        continue;
      }
      body.push(line);
      lines.shift();//remove the first line
      continue;
    }
    return hash;
  }
  extract_for_loop_body(style,lines){
    var body=[];
    //var re_leading = /^(\s+)(.*)$/;
    var n = 0;
    var v;
    ///extract all following lines where it has an indentation 
    while(lines.length) {
      ///lookahead
      var line = lines[0];
      if(line.length==0){
        //ignore empty lines
        lines.shift();//remove the first line
        continue;
      }
      if(line==='\\done'){
        lines.shift();
        break;
      }
      body.push(line);
      lines.shift();///remove the first line
      continue;
    }
    ///remove the 'n' space from the left
    body = this.trim_samp_body(body);
    return body;
  }
  extract_for_proc_body(style,lines){
    var body=[];
    //var re_leading = /^(\s+)(.*)$/;
    var n = 0;
    var v;
    ///extract all following lines where it has an indentation 
    while(lines.length) {
      ///lookahead
      var line = lines[0];
      if(line.length==0){
        //ignore empty lines
        lines.shift();//remove the first line
        continue;
      }
      if(line==='\\endproc'){
        lines.shift();
        break;
      }
      body.push(line);
      lines.shift();///remove the first line
      continue;
    }
    ///remove the 'n' space from the left
    body = this.trim_samp_body(body);
    return body;
  }
  exec_action_command(style,line,env) {
    // NOTE: that that at this stage all env-variables have been replaced
    const re_command_line = /^\\([A-Za-z][A-Za-z0-9]*)(\.\S+|)\s*(.*)$/;
    var v = re_command_line.exec(line);
    if(v===null){
      return '';
    }
    var o = [];
    var cmd = v[1];
    var opts = this.string_to_command_opts(v[2],env);
    var data = v[3];
    //var [g,txts,data] = this.read_style_and_label(data);
    ///
    ///NOTE: always set the 'opt' to the first element of 'opts'
    ///
    var [opt] = opts;    
    ///
    ///NOTE: 
    ///
    if (cmd == 'image'){
      let [coords,g,txts] = this.read_coords(data,env);
      let w = this.viewport_width;
      let h = this.viewport_height;
      let x = 0;
      let y = 0;
      o.push(this.do_image(opt,x,y,w,h,g,txts));///own method
    }
    ///
    ///NOTE: 
    ///
    if (cmd == 'header'){
      let [coords,g,txts] = this.read_coords(data,env);
      let w = this.viewport_width;
      let h = this.viewport_height;
      let x = 0;
      let y = 0;
      o.push(this.do_header(opt,x,y,w,h,g,txts));///own method
    }
    ///
    ///NOTE: 
    ///
    if (cmd == 'footer'){
      let [coords,g,txts] = this.read_coords(data,env);
      let w = this.viewport_width;
      let h = this.viewport_height;
      let x = 0;
      let y = 0;
      o.push(this.do_footer(opt,x,y,w,h,g,txts));///own method
    }
    ///
    ///NOTE: 
    ///
    else if (cmd == 'drawlabel'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawlabel(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: 
    ///
    else if (cmd == 'drawpango'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawpango(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE:
    ///
    else if (cmd=='plot'){
      let [coords,g,txts] = this.read_coords(data,env);
      let [key,id] = opts;
      if(key=='car'){
        if(this.my_car_map.has(id)){
          let car = this.my_car_map.get(id);
          let cx = car.xorigin;
          let cy = car.yorigin;
          let sx = 1/car.xgrid;
          let sy = 1/car.ygrid;
          let xmin = car.xmin;
          let xmax = car.xmax;
          let ymin = car.ymin;
          let ymax = car.ymax;
          let x1 = this.assert_float(g.xmin,xmin);
          let x2 = this.assert_float(g.xmax,xmax);
          let xstep = this.assert_float(g.xstep,1);
          let fn = this.assert_string(g.fn);
          o.push(this.p_plot(fn,cx,cy,sx,sy,xmin,xmax,ymin,ymax,x1,x2,xstep,g));
        }
      }
    }
    ///
    ///NOTE:
    ///
    else if (cmd=='drawdot'){
      let [coords,g,txts] = this.read_coords(data,env);
      for (var i = 0; i < coords.length; i++) {
        var pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        var x = pt[0];
        var y = pt[1];
        if(opts[0]=='hbar'){
          let barlength = this.g_to_barlength_float(g)/2;
          o.push(this.p_line(x-barlength,y,x+barlength,y,g));
        }else if(opts[0]=='vbar'){
          let barlength = this.g_to_barlength_float(g)/2;
          o.push(this.p_line(x,y-barlength,x,y+barlength,g));
        }else if(opts[0]=='lhbar'){
          let barlength = this.g_to_barlength_float(g)/2;
          o.push(this.p_line(x - barlength, y, x, y, g));
        }else if(opts[0]=='rhbar'){
          let barlength = this.g_to_barlength_float(g)/2;
          o.push(this.p_line(x, y, x + barlength, y, g));
        }else if(opts[0]=='tvbar'){
          let barlength = this.g_to_barlength_float(g)/2;
          o.push(this.p_line(x, y, x, y + barlength, g));
        }else if(opts[0]=='bvbar'){
          let barlength = this.g_to_barlength_float(g)/2;
          o.push(this.p_line(x, y - barlength, x, y, g));
        }else if(opts[0]=='square'){
          o.push(this.p_dot_square(x,y,g));
        }else if(opts[0]=='pie'){
          let start_a = this.g_to_start_float(g);
          let span_a = this.g_to_span_float(g);
          o.push(this.p_dot_pie(x,y,start_a,span_a,g));
        }else{
          o.push(this.p_dot_circle(x,y,g));
        }
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawline'){
      let [coords,g,txts] = this.read_coords(data,env);
      for (var i = 1; i < coords.length; i+=2) {
        var pt1 = this.point_at(coords, i-1);
        var pt2 = this.point_at(coords, i);
        if (!this.is_valid_point(pt1)) continue;
        if (!this.is_valid_point(pt2)) continue;
        var x1 = pt1[0];
        var y1 = pt1[1];
        var x2 = pt2[0];
        var y2 = pt2[1];
        o.push(this.p_line(x1,y1,x2,y2,g));
        if(1){
          var {label,tx,ty} = this.fetch_label_at(txts,i-1,g);
          if(label){
            o.push(this.p_label(x1+tx,y1+ty,label,'c',g));
          }
        }
        if(1){
          var {label,tx,ty} = this.fetch_label_at(txts,i,g);
          if(label){
            o.push(this.p_label(x2+tx,y2+ty,label,'c',g));
          }
        }
      }
      if(coords.length==0){
        let x1 = this.get_float_prop(g,'x1',NaN);
        let y1 = this.get_float_prop(g,'y1',NaN);
        let x2 = this.get_float_prop(g,'x2',NaN);
        let y2 = this.get_float_prop(g,'y2',NaN);
        if(Number.isFinite(x1)&&Number.isFinite(y1)&&Number.isFinite(x2)&&Number.isFinite(y2)){
          o.push(this.p_line(x1,y1,x2,y2,g));
        }
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawpolyline'){
      let [coords,g,txts] = this.read_coords(data,env);
      let points = [];
      for (var i = 0; i < coords.length; i++) {
        var pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        var x = pt[0];
        var y = pt[1];
        points.push(x);
        points.push(y);
      }
      if(coords.length==0){
        points = this.get_floats_prop(g,'points');
      }
      o.push(this.p_polyline(points,g));
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawpolygon'){
      let [coords,g,txts] = this.read_coords(data,env);
      let points = [];
      for (var i = 0; i < coords.length; i++) {
        var pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        var x = pt[0];
        var y = pt[1];
        points.push(x);
        points.push(y);
      }
      if(coords.length==0){
        points = this.get_floats_prop(g,'points');
      }
      o.push(this.p_polygon(points,g));
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawtriangle'){
      let [coords,g,txts] = this.read_coords(data,env);
      for (var i = 2; i < coords.length; i+=3) {
        var pt1 = this.point_at(coords, i-2);
        var pt2 = this.point_at(coords, i-1);
        var pt3 = this.point_at(coords, i);
        if (!this.is_valid_point(pt1)) continue;
        if (!this.is_valid_point(pt2)) continue;
        if (!this.is_valid_point(pt3)) continue;
        var x1 = pt1[0];
        var y1 = pt1[1];
        var x2 = pt2[0];
        var y2 = pt2[1];
        var x3 = pt3[0];
        var y3 = pt3[1];
        o.push(this.p_triangle(x1,y1,x2,y2,x3,y3,g));
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawrect'){
      let [coords,g,txts] = this.read_coords(data,env);
      let w = this.g_to_w_float(g);
      let h = this.g_to_h_float(g);
      let rdx = this.g_to_rdx_float(g);
      let rdy = this.g_to_rdy_float(g);
      for (var i = 0; i < coords.length; i++) {
        var pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        var x = pt[0];
        var y = pt[1];
        o.push(this.p_rect(x,y,w,h,rdx,rdy,g));
      }
      if(coords.length==0){
        let x = this.get_float_prop(g,'x',NaN);
        let y = this.get_float_prop(g,'y',NaN);
        if(Number.isFinite(x)&&Number.isFinite(y)){
          o.push(this.p_rect(x,y,w,h,rdx,rdy,g));
        }      
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawellipse'){
      let [coords,g,txts] = this.read_coords(data,env);
      let rx = this.g_to_rx_float(g);
      let ry = this.g_to_ry_float(g);
      for (var i = 0; i < coords.length; i++) {
        var pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        var cx = pt[0];
        var cy = pt[1];
        o.push(this.p_ellipse(cx,cy,rx,ry,g));
      }
      if(coords.length==0){
        let cx = this.get_float_prop(g,'cx',NaN);
        let cy = this.get_float_prop(g,'cy',NaN);
        if(Number.isFinite(cx)&&Number.isFinite(cy)){
          o.push(this.p_ellipse(cx,cy,rx,ry,g));
        }        
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawcircle'){
      let [coords,g,txts] = this.read_coords(data,env);
      let r = this.g_to_r_float(g);
      for (var i = 0; i < coords.length; i++) {
        var pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        var cx = pt[0];
        var cy = pt[1];
        o.push(this.p_circle(cx,cy,r,g));
      }
      if(coords.length==0){
        let cx = this.get_float_prop(g,'cx',NaN);
        let cy = this.get_float_prop(g,'cy',NaN);
        if(Number.isFinite(cx)&&Number.isFinite(cy)){
          o.push(this.p_circle(cx,cy,r,g));
        }
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawarc'){
      let [coords,g,txts] = this.read_coords(data,env);
      let arrowhead = this.g_to_arrowhead_int(g);
      let r = this.g_to_r_float(g);
      let start = this.g_to_start_float(g);
      let span = this.g_to_span_float(g);
      for (let i = 0; i < coords.length; i++) {
        let pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        let cx = pt[0];
        let cy = pt[1];
        let q = this.to_ARC(cx,cy,r,start,span);
        if(arrowhead==1){
          o.push(this.p_arrow(q,g));
        }else if(arrowhead==2){
          o.push(this.p_revarrow(q,g));
        }else if(arrowhead==3){
          o.push(this.p_dblarrow(q,g));
        }else{
          o.push(this.p_strokepath(q,g));
        }
      }
      if(coords.length==0){
        let cx = this.get_float_prop(g,'cx',NaN);
        let cy = this.get_float_prop(g,'cy',NaN);
        if(Number.isFinite(cx)&&Number.isFinite(cy)){
          let q = this.to_ARC(cx,cy,r,start,span);
          if(arrowhead==1){
            o.push(this.p_arrow(q,g));
          }else if(arrowhead==2){
            o.push(this.p_revarrow(q,g));
          }else if(arrowhead==3){
            o.push(this.p_dblarrow(q,g));
          }else{
            o.push(this.p_strokepath(q,g));
          }
        }
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawsector'){
      let [coords,g,txts] = this.read_coords(data,env);
      let r = this.g_to_r_float(g);
      let ri = this.g_to_ri_float(g);
      let start = this.g_to_start_float(g);
      let span = this.g_to_span_float(g);
      for (var i = 0; i < coords.length; i++) {
        var pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        var cx = pt[0];
        var cy = pt[1];
        // var q = q = this.to_SECTOR(cx,cy,r,ri,start,span);
        o.push(this.p_sector(cx,cy,r,ri,start,span,g));
      }
      if(coords.length==0){
        let cx = this.get_float_prop(g,'cx',NaN);
        let cy = this.get_float_prop(g,'cy',NaN);
        if(Number.isFinite(cx)&&Number.isFinite(cy)){
          o.push(this.p_sector(cx,cy,r,ri,start,span,g));
        }
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawsegment'){
      let [coords,g,txts] = this.read_coords(data,env);
      let r = this.g_to_r_float(g);
      let start = this.g_to_start_float(g);
      let span = this.g_to_span_float(g);
      for (var i = 0; i < coords.length; i++) {
        var pt = this.point_at(coords, i);
        if (!this.is_valid_point(pt)) continue;
        var cx = pt[0];
        var cy = pt[1];
        // var q = q = this.to_SEGMENT(x,y,r,start,span);
        o.push(this.p_segment(cx,cy,r,start,span,g));
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawqbezier'){
      let [coords,g,txts] = this.read_coords(data,env);
      for(let i=0; i < coords.length; i+=2){
        let [x0,y0] = this.point_at(coords,i+0); 
        let [x1,y1] = this.point_at(coords,i+1); 
        let [x2,y2] = this.point_at(coords,i+2); 
        if(Number.isFinite(x0)&&Number.isFinite(y0)&&Number.isFinite(x1)&&Number.isFinite(y1)&&Number.isFinite(x2)&&Number.isFinite(y2)){
          o.push(this.p_qbezier_line(x0,y0,x1,y1,x2,y2,g));
        }
      }
      if(coords.length==0){
        let x0 = this.get_float_prop(g,'x0',NaN);
        let y0 = this.get_float_prop(g,'y0',NaN);
        let x1 = this.get_float_prop(g,'x1',NaN);
        let y1 = this.get_float_prop(g,'y1',NaN);
        let x2 = this.get_float_prop(g,'x2',NaN);
        let y2 = this.get_float_prop(g,'y2',NaN);
        if(Number.isFinite(x0)&&Number.isFinite(y0)&&Number.isFinite(x1)&&Number.isFinite(y1)&&Number.isFinite(x2)&&Number.isFinite(y2)){
          o.push(this.p_qbezier_line(x0,y0,x1,y1,x2,y2,g));
        }
      }
    }
    else if (cmd=='drawbezier'){
      let [coords,g,txts] = this.read_coords(data,env);
      for(let i=0; i < coords.length; i+=3){
        let [x0,y0] = this.point_at(coords,i+0); 
        let [x1,y1] = this.point_at(coords,i+1); 
        let [x2,y2] = this.point_at(coords,i+2); 
        let [x3,y3] = this.point_at(coords,i+3); 
        if(Number.isFinite(x0)&&Number.isFinite(y0)&&Number.isFinite(x1)&&Number.isFinite(y1)&&Number.isFinite(x2)&&Number.isFinite(y2)&&Number.isFinite(x3)&&Number.isFinite(y3)){
          o.push(this.p_bezier_line(x0,y0,x1,y1,x2,y2,x3,y3,g));
        }
      }
      if(coords.length==0){
        let x0 = this.get_float_prop(g,'x0',NaN);
        let y0 = this.get_float_prop(g,'y0',NaN);
        let x1 = this.get_float_prop(g,'x1',NaN);
        let y1 = this.get_float_prop(g,'y1',NaN);
        let x2 = this.get_float_prop(g,'x2',NaN);
        let y2 = this.get_float_prop(g,'y2',NaN);
        let x3 = this.get_float_prop(g,'x3',NaN);
        let y3 = this.get_float_prop(g,'y3',NaN);
        if(Number.isFinite(x0)&&Number.isFinite(y0)&&Number.isFinite(x1)&&Number.isFinite(y1)&&Number.isFinite(x2)&&Number.isFinite(y2)&&Number.isFinite(x3)&&Number.isFinite(y3)){
          o.push(this.p_bezier_line(x0,y0,x1,y1,x2,y2,x3,y3,g));
        }
      }
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawcontrolpoints') {
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawcontrolpoints(opts,g,txts,coords));//own method
    }
    else if (cmd=='drawanglearc'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawanglearc(opts,g,txts,coords));///own method
    }
    else if (cmd=='drawanglemark'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawanglemark(opts,g,txts,coords));//own method
    }
    else if (cmd=='drawcongbar'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawcongbar(opts,g,txts,coords));//own method
    }
    else if (cmd=='drawcenteredlabel'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawcenteredlabel(opts,g,txts,coords));//own method
    }
    else if (cmd == 'drawslopedlabel'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawslopedlabel(opts,g,txts,coords));///own method
    }
    else if (cmd == 'drawtabulatedlabel'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawtabulatedlabel(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: prodofprimes
    ///
    else if (cmd=='prodofprimesws') {
      let [coords,g,txts] = this.read_coords(data,env);
      let {label} = this.fetch_label_at(txts,0,g);
      o.push(this.to_prodofprimesws(coords,g,label));//own method
    }
    ///
    ///NOTE: longdivws
    ///
    else if (cmd=='longdivws') {
      let [coords,g,txts] = this.read_coords(data,env);
      let {label} = this.fetch_label_at(txts,0,g);
      o.push(this.to_longdivws(coords,g,label));//own method
    }
    ///
    ///NOTE: multiws
    ///
    else if (cmd=='multiws'){
      let [coords,g,txts] = this.read_coords(data,env);
      let {label} = this.fetch_label_at(txts,0,g);
      o.push(this.to_multiws(coords,g,label));//own method
    }
    ///
    ///NOTE: drawgrid
    ///
    else if (cmd=='drawgrid'){
      let [coords,g,txts] = this.read_coords(data,env);
      let density = this.assert_int(g.density,1,1,this.MAX_INT);
      o.push(this.p_grid(density,g));
    }
    ///
    ///NOTE: drawshape
    ///
    else if (cmd=='drawshape'){
      let [coords,g,txts] = this.read_coords(data,env);
      let shape = null;
      if(this.my_shape_map.has(opt)){
        shape = this.my_shape_map.get(opt);//opt is a shape name
      }
      if(shape){
        for (var i = 0; i < coords.length; i++) {
          var z0 = this.point_at(coords, i);
          if(!this.is_valid_point(z0)) continue;
          for (let p of shape){
            let {q} = p;
            let offsetx = z0[0];
            let offsety = z0[1];
            let scaleX = this.g_to_scaleX_float(g);
            let scaleY = this.g_to_scaleY_float(g);
            let rotate = this.g_to_rotate_float(g);
            q = this.dup_coords(q);
            this.offset_coords(q,offsetx,offsety,scaleX,scaleY,rotate);
            o.push(this.p_drawpath(q,p.g));//use the 'g' associated with the shape
          }
        }
      }
    }
    ///
    ///NOTE: drawpath, fillpath, strokepath, arrow, revarrow, dblarrow
    ///
    else if (cmd=='drawpath'){
      let [coords,g,txts] = this.read_coords(data,env);
      this.do_comment(`*** path ${this.coords_to_string(coords)}`);
      if(opt){
        ///is 'opt' a known path?
        let symbol = opt;
        let p = this.get_path_from_symbol(symbol);//the returned 'p' has already been duplicated
        var scaleX = this.g_to_scaleX_float(g);
        var scaleY = this.g_to_scaleY_float(g);
        var rotate = this.g_to_rotate_float(g);
        this.offset_coords(p,0,0,scaleX,scaleY,rotate);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'drawpath'));//own method
        }
      }else{
        ///draw a path
        o.push(this.p_drawpath(coords,g));              
      }
    }
    else if (cmd=='fillpath'){
      let [coords,g,txts] = this.read_coords(data,env);
      this.do_comment(`*** path ${this.coords_to_string(coords)}`);
      if(opt){
        ///is 'opt' a known path?
        let symbol = opt;
        let p = this.get_path_from_symbol(symbol);
        var scaleX = this.g_to_scaleX_float(g);
        var scaleY = this.g_to_scaleY_float(g);
        var rotate = this.g_to_rotate_float(g);
        this.offset_coords(p,0,0,scaleX,scaleY,rotate);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'fillpath'));//own method
        }
      }else{
        o.push(this.p_fillpath(coords, g));
      }
    }
    else if (cmd=='strokepath'){
      let [coords,g,txts] = this.read_coords(data,env);
      this.do_comment(`*** path ${this.coords_to_string(coords)}`);
      if(opt){
        ///is 'opt' a known path?
        let symbol = opt;
        let p = this.get_path_from_symbol(symbol);
        var scaleX = this.g_to_scaleX_float(g);
        var scaleY = this.g_to_scaleY_float(g);
        var rotate = this.g_to_rotate_float(g);
        this.offset_coords(p,0,0,scaleX,scaleY,rotate);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'strokepath'));//own method
        }
      }else{
        o.push(this.p_strokepath(coords, g));
      }
    }
    else if (cmd=='arrow'){
      let [coords,g,txts] = this.read_coords(data,env);
      this.do_comment(`*** path ${this.coords_to_string(coords)}`);
      o.push(this.p_arrow(coords, g));
    }
    else if (cmd=='revarrow'){
      let [coords,g,txts] = this.read_coords(data,env);
      this.do_comment(`*** path ${this.coords_to_string(coords)}`);
      o.push(this.p_revarrow(coords, g));
    }
    else if (cmd=='dblarrow'){
      let [coords,g,txts] = this.read_coords(data,env);
      this.do_comment(`*** path ${this.coords_to_string(coords)}`);
      o.push(this.p_dblarrow(coords, g));
    }else if (cmd=='rectangle'){
      let [coords,g,txts] = this.read_coords(data,env);
      for (var i = 1; i < coords.length; i++) {
        var pt1 = this.point_at(coords, i-1);
        var pt2 = this.point_at(coords, i);
        if (!this.is_valid_point(pt1)) continue;
        if (!this.is_valid_point(pt2)) continue;
        var x1 = pt1[0];
        var y1 = pt1[1];
        var x2 = pt2[0];
        var y2 = pt2[1];
        var w = x2 - x1;
        var h = y2 - y1;
        if(h < 0){
          y1 += h;
          h = -h;
        }
        if(w < 0){
          x1 += w;
          w = -w;
        }
        o.push(this.p_rect(x1,y1,w,h,0,0,g));
      }
    }
    ///
    ///NOTE: chart
    ///
    else if (cmd=='chart'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_chart(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: car 
    ///
    else if (cmd=='car'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_car(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: node and edge
    ///
    else if (cmd=='node'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_node(opts,g,txts,coords));///own method
    }
    else if (cmd=='edge'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_edge(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: The box command   
    ///
    else if (cmd=='box'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_box(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: the lego command
    ///
    else if (cmd=='lego'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_lego(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: the trump command
    ///
    else if (cmd=='trump'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_trump(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: remove empty lnes
    ///
    o = o.map((x) => {
      if(typeof x === 'string') return x.trim();
      else return null;
    });
    o = o.filter((x) => x);
    return o.join('\n');
  }

  //
  //
  //
  get_path_from_symbol(symbol) {
    ///***NOTE: this function should return a path, not a point!

    /// fix is so that &a[1] becomes &a_1

    /// if it is null then we return an empty path
    if(typeof symbol === 'string'){
      //good
    }else{
      symbol = `${symbol}`
    }
    var index = '';
    var v;
    if((v=this.re_symbol_with_subscript.exec(symbol))!==null){
      var symbol = v[1];
      var index = v[2];
      if(index && index.startsWith("_")){
        index = index.slice(1);
        index = parseInt(index);
      }else if(index && index.startsWith("[") && index.endsWith("]")){
        index = index.slice(1,-1);
        index = parseInt(index);
      }
    }
    if (this.my_path_map.has(symbol)) {
      var p = this.my_path_map.get(symbol);
      var p = this.dup_coords(p);///***important*** duplicate this coords
      if(Number.isFinite(index)){///a sub point
        if(index < p.length){
          let pt = p[index];
          return [pt];
        }else{
          return [];
        }
      }else{
        return p;
      }
    }
    if(symbol=='northwest'){
      return [[0-this.origin_x,this.viewport_height-this.origin_y,'M']];
    }
    if(symbol=='northeast'){
      return [[this.viewport_width-this.origin_x,this.viewport_height-this.origin_y,'M']]
    }
    if(symbol=='southwest'){
      return [[0-this.origin_x,0-this.origin_y,'M']]
    }
    if(symbol=='southeast'){
      return [[this.viewport_width-this.origin_x,0-this.origin_y,'M']]
    }
    if(symbol=='center'){
      return [[this.viewport_width/2-this.origin_x,this.viewport_height/2-this.origin_y,'M']]
    }
    if(symbol=='south'){
      return [[this.viewport_width/2-this.origin_x,0-this.origin_y,'M']];
    }
    if(symbol=='north'){
      return [[this.viewport_width/2-this.origin_x,this.viewport_height-this.origin_y,'M']];
    }
    if(symbol=='west'){
      return [[0-this.origin_x,this.viewport_height/2-this.origin_y,'M']];
    }
    if(symbol=='east'){
      return [[this.viewport_width-this.origin_x,this.viewport_height/2-this.origin_y,'M']];
    }
    if(symbol=='bbox'){
      let ret_val = [];
      ret_val.push([0-this.origin_x,0-this.origin_y,'M']);
      ret_val.push([this.viewport_width-this.origin_x,0-this.origin_y,'L']);
      ret_val.push([this.viewport_width-this.origin_x,this.viewport_height-this.origin_y,'L']);
      ret_val.push([0-this.origin_x,this.viewport_height-this.origin_y,'L']);
      ret_val.push([0,0,'z']);
      return ret_val;
    }
    ///check to see if this is a build-in path
    var s = this.name_to_path_string(symbol);
    if(s){
      let [coords] = this.read_coords(s,{});
      return coords;
    }
    return []; //by default resturns a path without any points in it
  }
  /// this is called inside readCoordsLine()
  exec_pathfunc(name,args) {
    var ret_val = [];
    switch (name) {
      case 'midpoint': {
        ///&midpoint(&a,&b,0.6)
        let z0       = this.assert_arg_point(args,0);
        let z1       = this.assert_arg_point(args,1);
        let fraction = this.assert_arg_float(args,2);
        if(this.is_valid_point(z0)&&this.is_valid_point(z1)&&Number.isFinite(fraction)){
          let z0x = z0[0];
          let z0y = z0[1];
          let z1x = z1[0];
          let z1y = z1[1];
          let ptx = z0x + (z1x - z0x) * fraction;
          let pty = z0y + (z1y - z0y) * fraction;
          ret_val.push([ptx, pty, 'M']);///always  a single point
        }
        break;
      }
      case 'extrude': {
        ///&extrude{&A,&B,a}
        ///extrude from B in the direction of A-B for a distance of 'a'
        let z0 = this.assert_arg_point(args,0);
        let z1 = this.assert_arg_point(args,1);
        var a =  this.assert_arg_float(args,2);
        let z0x = z0[0];
        let z0y = z0[1];
        let z1x = z1[0];
        let z1y = z1[1];
        let dist = this.calc_dist(z0x,z0y,z1x,z1y);
        let fraction = a/dist;
        let ptx = z0x + (z1x - z0x) * (1+fraction);
        let pty = z0y + (z1y - z0y) * (1+fraction);
        ret_val.push([ptx, pty, 'M']);///always  a single point
        break;
      }
      case 'rotatepoint': {
        ///constructs a single point that is rotated around the first point from the starting
        /// position of the second point and such that the final position is located 'dist' away from the 
        /// first point
        let z0   = this.assert_arg_point(args,0);
        let z1   = this.assert_arg_point(args,1);
        let rot  = this.assert_arg_float(args,2);
        let dist = this.assert_arg_float(args,3);
        let z0x = z0[0];
        let z0y = z0[1];
        let z1x = z1[0];
        let z1y = z1[1];
        let dy = z1y - z0y;
        let dx = z1x - z0x;
        let ang = Math.atan2(dy,dx);
        ang += this.deg_to_rad(rot);
        let ptx = z0x + dist*Math.cos(ang);
        let pty = z0y + dist*Math.sin(ang);
        ret_val.push([ptx, pty, 'M']);///always a single point
        break;
      }
      case 'droppoint': {
        ///&droppoint{&p1,&p2,&a}
        ///'p1' and 'p2' are two end points of the line and 'a' is the point to cast a shadow on this line
        ///constructs a line with unit length of 1 that is perpendicular
        /// to a line that intersects at the first point of that line 
        let z0 = this.assert_arg_point(args,0);
        let z1 = this.assert_arg_point(args,1);
        let z2 = this.assert_arg_point(args,2);
        let z0x = z0[0];
        let z0y = z0[1];
        let z1x = z1[0];
        let z1y = z1[1];
        let z2x = z2[0];
        let z2y = z2[1];
        let vx = z1x - z0x;
        let vy = z1y - z0y;
        let x  = z2x - z0x;
        let y  = z2y - z0y;
        let factor = (vx*x + vy*y)/(vx*vx + vy*vy);
        let ptx = z0x + vx*factor;
        let pty = z0y + vy*factor;
        ret_val.push([ptx, pty, 'M']);///always a single point        
        break;
      }
      case 'scatterpoints': {
        let p0 = this.assert_arg_point(args,0);
        let p1 = this.assert_arg_point(args,1);
        let n  = this.assert_arg_float(args,2);
        if(n < 0) {
          n = 0;
        }
        n++;
        if(n+1 > this.MAX_ARRAY) {
          n = this.MAX_ARRAY-1;
        }
        if(this.is_valid_point(p0) && this.is_valid_point(p1) && Number.isFinite(n)){
          let sx = p0[0];
          let sy = p0[1];
          let tx = p1[0];
          let ty = p1[1]
          let dx = tx - sx;
          let dy = ty - sy;
          for (let i = 0; i <= n; ++i) {
            let frac = i / n;
            let px = sx + frac * dx;
            let py = sy + frac * dy;
            ret_val.push([px, py, 'M']);
          }
        }
        break;
      }
      case 'linelineintersect': {
        /// linelineintersect{(0,0),(10,0),(-1,5),(1,5)} line1 = (0,0) to (10,0), line2 from (-1,5) to (1,5)
        let p0 = this.assert_arg_point(args,0);
        let p1 = this.assert_arg_point(args,1);
        let q0 = this.assert_arg_point(args,2);
        let q1 = this.assert_arg_point(args,3);
        let [x, y] = this.computeLineIntersection(p0, p1, q0, q1);
        if(Number.isFinite(x)&&Number.isFinite(y)){
          ret_val.push([x, y, 'M']);
        }
        break;
      }
      case 'linecircleintersect': {
        /// linecircleintersect{(0,0),(10,0),(5,0),10}
        ///
        ///  a1 - symbol: the line point 1     
        ///  a2 - symbol: the line point 2     
        ///  c - symbol: circle center (one point)
        ///  radius - number: circle radius
        let p0     = this.assert_arg_point(args,0);
        let p1     = this.assert_arg_point(args,1);
        let c      = this.assert_arg_point(args,2);
        let radius = this.assert_arg_float(args,3);
        let [A, B, C] = this.computeStandardLineForm(p0, p1);
        let [x0, y0] = c;
        // translate C to new coords
        C = C - A * x0 - B * y0;
        let rsq = radius * radius;
        let [x1, y1, x2, y2] = this.computeCircleLineIntersection(rsq, A, B, C);
        if(Math.abs(B) < 1E-6){
          ///the intersecting line is perpendicular
          y1 = +y0 - radius;
          y2 = +y0 + radius;
          x1 = x0;
          x2 = x0;
        }else{
          x1 += +x0;
          x2 += +x0;
          y1 += +y0;
          y2 += +y0;
        }
        /// change the order so that the first point is on the left-hand side
        if(x1==x2 && y1==y2){
          ret_val.push([x1, y1,'M']);
        }else if(x2 < x1){
          ret_val.push([x2, y2,'M']);
          ret_val.push([x1, y1,'M']);
        }else{
          ret_val.push([x1, y1,'M']);
          ret_val.push([x2, y2,'M']);
        }
        ///note one or both might be Infinity of NaN
        break;
      }
      case 'circlecircleintersect': {
        ///&circlecircleintersect{&Center1,R1,&Center2,R2}
        let pt1 = this.assert_arg_point(args,0);
        let R   = this.assert_arg_float(args,1);
        let pt2 = this.assert_arg_point(args,2);
        let r   = this.assert_arg_float(args,3);
        let [x1,y1] = pt1;
        let [x2,y2] = pt2;
        let dx = x2-x1;
        let dy = y2-y1;
        let delta = Math.sqrt(dx*dx + dy*dy);
        let x = (delta*delta - r*r + R*R)/(2*delta);
        let y = Math.sqrt(R * R - x * x);
        if(!Number.isFinite(y)){
          ///no points
        }else{
          let y = Math.sqrt(R*R - x*x);
          let theta = Math.atan2(dy,dx);
          let THETA = Math.atan2(y,x);
          let X1 = R*Math.cos(theta+THETA);
          let Y1 = R*Math.sin(theta+THETA);
          let X2 = R*Math.cos(theta-THETA);
          let Y2 = R*Math.sin(theta-THETA);
          ret_val.push( [x1+X1,y1+Y1,'M'] );
          ret_val.push( [x1+X2,y1+Y2,'M'] );
        }
        break;
      }
      case 'ellipsepoints': {
        /// &ellipsepoints(center,rx,ry,a1,a2,a3...)
        /// 'center' is a path, rx/ry, a1, a2, a3 are scalars
        if(args.length > 3){
          let z0   = this.assert_arg_point(args,0);
          let rx   = this.assert_arg_float(args,1);
          let ry   = this.assert_arg_float(args,2);
          let [x0,y0] = z0;
          for(let j=3; j < args.length; ++j){
            let a0 = this.assert_arg_float(args,j);
            let x1 = x0 + rx * Math.cos(Math.PI/180*a0);
            let y1 = y0 + ry * Math.sin(Math.PI/180*a0);
            ret_val.push([x1,y1,'M']);
          }
        }
        break;
      }
      case 'circlepoints': {
        /// &circlepoints(center,r,a1,a2,a3...)
        /// 'center' is a path, r, a1, a2, a3 are scalars
        if(args.length > 2){
          let z0   = this.assert_arg_point(args,0);
          let r    = this.assert_arg_float(args,1);
          let [x0,y0] = z0;
          for(let j=2; j < args.length; ++j){
            let a0 = this.assert_arg_float(args,j);
            let x1 = x0 + r * Math.cos(Math.PI/180*a0);
            let y1 = y0 + r * Math.sin(Math.PI/180*a0);
            ret_val.push([x1,y1,'M']);
          }
        }
        break;
      }
      case 'pie': {
        ///&pie(center,radius,start_ang,span)
        ///'center' is a path, radius is a scalar
        let z    = this.assert_arg_point(args,0);
        let r    = this.assert_arg_float(args,1);
        let a    = this.assert_arg_float(args,2);
        let span = this.assert_arg_float(args,3); 
        if(this.is_valid_point(z) && Number.isFinite(r) && Number.isFinite(a) && Number.isFinite(span)){
          let bigarcflag = (span > 180);
          let sweepflag = 0;
          let x1 = r*Math.cos(a/180*Math.PI);
          let y1 = r*Math.sin(a/180*Math.PI);
          let x2 = r*Math.cos((a+span)/180*Math.PI);
          let y2 = r*Math.sin((a+span)/180*Math.PI);
          ret_val.push([z[0]   ,z[1]   ,'M', '','','','', 0,0,0,0,0, z[12]]);
          ret_val.push([z[0]+x1,z[1]+y1,'L', '','','','', 0,0,0,0,0]);
          ret_val.push([z[0]+x2,z[1]+y2,'A', '','','','', r,r,0,bigarcflag,sweepflag]);
          ret_val.push([0,0,'z']);
        }
        break;
      }
      case 'circle': {
        ///&circle(center,radius)
        ///'center' is a path, radius is a scalar
        let z = this.assert_arg_point(args,0);
        let r = this.assert_arg_float(args,1); 
        ret_val.push([z[0]+r,z[1],'M', '','','','', 0,0,0,0,0, z[12]]);
        ret_val.push([z[0]-r,z[1],'A', '','','','', r,r,0,0,0]);
        ret_val.push([z[0]+r,z[1],'A', '','','','', r,r,0,0,0]);          
        ret_val.push([0,0,'z']);
        break;
      }
      case 'ellipse': {
        ///&ellipse(center,xradius,yradius)
        ///'center' is a path, xradius and yradius are both scalars        
        let z0  = this.assert_arg_point(args,0);
        let rx  = this.assert_arg_float(args,1);
        let ry  = this.assert_arg_float(args,2);
        let phi = this.assert_arg_float(args,3);
        let x1 = z0[0]+rx*Math.cos(Math.PI+phi/180*Math.PI);
        let y1 = z0[1]+rx*Math.sin(Math.PI+phi/180*Math.PI);
        let x2 = z0[0]+rx*Math.cos(phi/180*Math.PI);
        let y2 = z0[1]+rx*Math.sin(phi/180*Math.PI);
        ret_val.push([x1,y1,'M', '','','','', 0,0,0,0,0, z0[12]]);
        ret_val.push([x2,y2,'A','','','','',rx,ry,phi,1,0]);
        ret_val.push([x1,y1,'A','','','','',rx,ry,phi,1,0]);
        ret_val.push([0,0,'z']);
        break;
      }
      case 'parallelogram': {
        ///&parallelogram{(0,0),w,h,shear}
        let pt = this.assert_arg_point(args,0);
        let [x,y] = pt;
        let w  = this.assert_arg_float(args,1);
        let h  = this.assert_arg_float(args,2);
        let shear = this.assert_arg_float(args,3);
        if(w < 0){
          x = x + w;
          w = -w;
        }
        if( h < 0){
          y = y + h;
          h = -h;
        }
        let SX = shear*h;
        if(SX >= 0){
          if (SX > w) {
            SX = w;
          }
          ret_val.push([x,y,'M', '','','','', 0,0,0,0,0, pt[12]]);
          ret_val.push([x+w-SX,y,'L']);
          ret_val.push([x+w,y+h,'L']);
          ret_val.push([x+SX,y+h,'L']);
          ret_val.push([0,0,'z']);
        }else{
          SX = Math.abs(SX);
          if (SX > w) {
            SX = w;
          }
          ret_val.push([x+SX,y,'M', '','','','', 0,0,0,0,0, pt[12]]);
          ret_val.push([x+w,y,'L']);
          ret_val.push([x+w-SX,y+h,'L']);
          ret_val.push([x,y+h,'L']);
          ret_val.push([0,0,'z']);
        }
        break;
      }
      case 'rhombus': {
        //NOTE:&rectangle{(x,y),w,h}
        let pt = this.assert_arg_point(args,0);
        let [x,y] = pt;
        let w = this.assert_arg_float(args,1);
        let h = this.assert_arg_float(args,2);
        if(w < 0){
          x = x + w;
          w = -w;
        }
        if( h < 0){
          y = y + h;
          h = -h;
        }
        let W = w/2;
        let H = h/2;
        ret_val.push([x+W,y+0, 'M', '','','','', 0,0,0,0,0, pt[12]]);
        ret_val.push([x+w,y+H, 'L']);
        ret_val.push([x+W,y+h, 'L']);
        ret_val.push([x+0,y+H, 'L']);
        ret_val.push([0,0,'z']);
        break;
      }
      case 'rectangle': {
        //NOTE:&rectangle{(x,y),w,h}
        let pt = this.assert_arg_point(args,0);
        let [x,y] = pt;
        let w = this.assert_arg_float(args,1);
        let h = this.assert_arg_float(args,2);
        if(w < 0){
          x = x + w;
          w = -w;
        }
        if( h < 0){
          y = y + h;
          h = -h;
        }
        ret_val.push([x,y, 'M', '','','','', 0,0,0,0,0, pt[12]]);
        ret_val.push([x+w,y,'L']);
        ret_val.push([x+w,y+h,'L']);
        ret_val.push([x,y+h,'L']);
        ret_val.push([0,0,'z']);
        break;
      }
      case 'roundrectangle': {
        //'&roundrectangle{(0,0),w,h}
        let pt = this.assert_arg_point(args,0);
        let w = this.assert_arg_float(args,1);
        let h = this.assert_arg_float(args,2);
        let [x,y] = pt;
        if(w < 0){
          x = x + w;
          w = -w;
        }
        if( h < 0){
          y = y + h;
          h = -h;
        }
        let Dx = 0.2*w; 
        let Dy = 0.2*h; 
        ret_val.push([x+0,    y+Dy,   'M', '','','','', 0,0,0,0,0, pt[12] ]);
        ret_val.push([x+Dx,   y+0,    'C',x+0,y+0,x+0,y+0]);
        ret_val.push([x+w-Dx, y+0,    'L']);
        ret_val.push([x+w,    y+Dy,   'C',x+w,y+0,x+w,y+0]);
        ret_val.push([x+w,    y+h-Dy, 'L']);
        ret_val.push([x+w-Dx, y+h,    'C',x+w,y+h,x+w,y+h]);
        ret_val.push([x+Dx,   y+h,    'L']);
        ret_val.push([x+0,    y+h-Dy, 'C',x+0,y+h,x+0,y+h]);
        ret_val.push([x+0,    y+0,    'z']);        
        break;
      }
      case 'triangle': {
        ///&rect(width,height)
        if(args.length == 3) {
            let z0 = this.point_at(args[0].coords,0);
            let z1 = this.point_at(args[1].coords,0);
            let z2 = this.point_at(args[2].coords,0);
            ret_val.push([z0[0],z0[1],'M', '','','','', 0,0,0,0,0, z0[12]]);
            ret_val.push([z1[0],z1[1],'L']);
            ret_val.push([z2[0],z2[1],'L']);
            ret_val.push([0,0,'z']);
          }
        break;
      }
      case 'pentagram': {
        ///&pentagram(ctr,radius)
        let pt = this.assert_arg_point(args,0);
        let [cx,cy] = pt;
        let r = this.assert_arg_float(args,1);
        for(let i=0; i < 5; ++i){
          let a = (i*72*2 + 90)/180*Math.PI;
          let x = cx + r*Math.cos(a);
          let y = cy + r*Math.sin(a);
          if(i==0){
            ret_val.push([x,y,'M', '','','','', 0,0,0,0,0]);
          }else{
            ret_val.push([x,y,'L', '','','','', 0,0,0,0,0]);
          }
        }
        ret_val.push([0,0,'z']);
        break;
      }
      case 'polyline': {
        ///&circle(center,radius)
        ///'center' is a path, radius is a scalar
        args.forEach((arg,i,arr) => {
          let z = this.point_at(arg.coords,0);
          if(i==0){
            ret_val.push([z[0],z[1],'M', '','','','', 0,0,0,0,0, z[12]]);
          }else{
            ret_val.push([z[0],z[1],'L']);
          }
        })
        break;
      }
      case 'polygon': {
        ///&circle(center,radius)
        ///'center' is a path, radius is a scalar
        args.forEach((arg,i,arr) => {
          let z = this.point_at(arg.coords,0);
          if(i==0){
            ret_val.push([z[0],z[1],'M', '','','','', 0,0,0,0,0, z[12]]);
          }else{
            ret_val.push([z[0],z[1],'L']);
          }
          if(i+1==arr.length){
            ret_val.push([0,0,'z']);
          }
        })
        break;
      }
      case 'cylinder': {
        ///&cylinder(center,xradius,yradius,height)
        ///'center' is a path, xradius and yradius and height are scalars
        let z0 = this.assert_arg_point(args,0);
        let rx = this.assert_arg_float(args,1);
        let ry = this.assert_arg_float(args,2);
        let ht = this.assert_arg_float(args,3);
        ret_val.push([z0[0]-rx,z0[1]+ht, 'M', '','','','', 0,0,0,0,0, z0[12]]);
        ret_val.push([z0[0]-rx,z0[1],'L']);
        ret_val.push([z0[0]+rx,z0[1],'A','','','','',rx,ry,0,0,0]);
        ret_val.push([z0[0]+rx,z0[1]+ht,'L']);
        ret_val.push([z0[0]-rx,z0[1]+ht,'A','','','','',rx,ry,0,0,1]);
        ret_val.push([0,0,'z']);
        ret_val.push([z0[0]-rx,z0[1]+ht,'M']);
        ret_val.push([z0[0]+rx,z0[1]+ht,'A','','','','',rx,ry,0,0,0]);
        ret_val.push([z0[0]-rx,z0[1]+ht,'A','','','','',rx,ry,0,0,0]);
        ret_val.push([0,0,'z']);
        break;
      }
      case 'fracwheel': {
        //NOTE:&fracwheel(&center,radius,numerator,denominator)
        let z = this.assert_arg_point(args,0);
        let r = this.assert_arg_float(args,1);
        let num = this.assert_arg_float(args,2);
        let den = this.assert_arg_float(args,3);
        for(let i=0; i<den; ++i){
          let theta0 = i*Math.PI*2/den;
          let theta1 = (i+1)*Math.PI*2/den;
          let x0 = z[0] + r*Math.cos(theta0);
          let y0 = z[1] + r*Math.sin(theta0);
          let x1 = z[0] + r*Math.cos(theta1);
          let y1 = z[1] + r*Math.sin(theta1);
          ret_val.push([z[0],z[1],'M', '','','','', 0,0,0,0,0, z[12]]);
          ret_val.push([x0,y0,'L']);
          ret_val.push([x1,y1,'A','','','','',r,r,0,0,0]);
          ret_val.push([z[0],z[1],'L']);
          if(i<num){
            // some of the pies are closed but some others are not
            ret_val.push([0,0,'z']);
          }
        }
        break;
      }
      case 'equilateraltriangle': {
        ///&equilateraltriangle{&center,a}
        ///'a' is the length of the side 
        let z = this.assert_arg_point(args,0);
        let a = this.assert_arg_float(args,1);
        let angles = [90, 210, 330]; 
        angles.forEach((angle,i,arr) => {
          angle /= 180;
          angle *= Math.PI;
          let x = z[0] + a*Math.cos(angle)/Math.sqrt(3);
          let y = z[1] + a*Math.sin(angle)/Math.sqrt(3);
          if(i==0){
            ret_val.push([x,y,'M', '','','','', 0,0,0,0,0, z[12]]);
          }else{
            ret_val.push([x,y,'L']);
          }
        });
        ret_val.push([0,0,'z'])
        break;
      }
      case 'regularpentagon': {
        ///&regularpentagon{&center,r}
        ///'r' is the length of the side 
        let z = this.assert_arg_point(args,0);
        let r = this.assert_arg_float(args,1);
        let angles = [90, 162, 234, 306, 378]; 
        angles.forEach((a,i,arr) => {
          a /= 180;
          a *= Math.PI;
          let x = z[0] + r*Math.cos(a)*0.85;
          let y = z[1] + r*Math.sin(a)*0.85;
          if(i==0){
            ret_val.push([x,y,'M', '','','','', 0,0,0,0,0, z[12]]);
          }else{
            ret_val.push([x,y,'L']);
          }
        });
        ret_val.push([0,0,'z'])
        break;
      }
      case 'asatriangle': {
        ///&sssTriangle{&Left,B,a,C}
        ///'Left' is the position of the vertex B
        ///'a' is the length of the base (across angle A which is at the top)
        ///'B' is the angle of the vertex on the left-hand side
        ///'C' is the angle of the vertex on the right-hand side 
        let Left = this.assert_arg_point(args,0);
        let B = this.assert_arg_float(args,1);
        let a = this.assert_arg_float(args,2);
        let C = this.assert_arg_float(args,3);
        let A = 180 - B - C;
        let ratio = a/Math.sin(A/180*Math.PI);
        let b = ratio * Math.sin(B/180*Math.PI);
        let ddx = b * Math.cos((180-C)/180*Math.PI);
        let ddy = b * Math.sin((180-C)/180*Math.PI);
        ret_val.push([Left[0],Left[1],  'M', '','','','', 0,0,0,0,0, Left[12]]);
        ret_val.push([Left[0]+a,Left[1],        'L'])
        ret_val.push([Left[0]+a+ddx,Left[1]+ddy,'L'])
        ret_val.push([0,0,'z'])
        break;
      }
      case 'mirror': {
        ///NOTE: &mirror{&pt,&end1,&end2}
        if(args.length==3){
          let Z = this.assert_arg_coords(args,0);
          Z = this.dup_coords(Z);
          let st = this.assert_arg_point(args,1);
          let pt = this.assert_arg_point(args,2);
          let stx = st[0];
          let sty = st[1];
          let ptx = pt[0];
          let pty = pt[1];
          for(let z of Z){
            let tx = z[0];
            let ty = z[1];
            let [dx, dy] = this.computeMirroredPointOffset(stx,sty, ptx,pty, tx,ty);
            if(Number.isFinite(dx)&&Number.isFinite(dy)){
              z[0] += dx;
              z[1] += dy;
              z[3] += dx;
              z[4] += dy;
              z[5] += dx;
              z[6] += dy;
              ret_val.push(z);
            }
          }
        }
        break;
      }
      case 'scale': {
        //NOTE: &scale{&path,s}
        let Z  = this.assert_arg_coords(args,0);
        let s = this.assert_arg_float(args,1);
        Z = this.dup_coords(Z);
        this.offset_coords(Z,0,0,s,s,0);
        for(let z of Z){
          ret_val.push(z);
        }
        break;
      }
      case 'scalexy': {
        //NOTE: &scalexy{&path,sx,sy}
        let Z  = this.assert_arg_coords(args,0);
        let sx = this.assert_arg_float(args,1);
        let sy = this.assert_arg_float(args,2);
        Z = this.dup_coords(Z);
        this.offset_coords(Z,0,0,sx,sy,0);
        for(let z of Z){
          ret_val.push(z);
        }
        break;
      }
      case 'shearx': {
        //NOTE: &shearx{&path,sx}
        let Z  = this.assert_arg_coords(args,0);
        let sx = this.assert_arg_float(args,1);
        Z = this.dup_coords(Z);
        for(let z of Z){
          let x = z[0];
          let y = z[1];
          let c1x = z[3];
          let c1y = z[4];
          let c2x = z[5];
          let c2y = z[6];
          z[0] += z[1]*sx;
          z[3] += z[4]*sx;
          z[5] += z[6]*sx;
        }
        for(let z of Z){
          ret_val.push(z);
        }
        break;
      }
      case 'rotate': {
        //NOTE: &rotate{&path,rotate}
        let Z      = this.assert_arg_coords(args,0);
        let rotate = this.assert_arg_float(args,1);
        Z = this.dup_coords(Z);
        this.offset_coords(Z,0,0,1,1,rotate);
        for(let z of Z){
          ret_val.push(z);
        }
        break;
      }
      case 'translate': {
        //NOTE: &translate{&path,offsetX,offsetY}
        let Z       = this.assert_arg_coords(args,0);
        let offsetX = this.assert_arg_float(args,1);
        let offsetY = this.assert_arg_float(args,2);
        if(Number.isFinite(offsetX)&&Number.isFinite(offsetY)){
          Z = this.dup_coords(Z);
          this.offset_coords(Z,offsetX,offsetY,1,1,0);
          for(let z of Z){
            ret_val.push(z);
          }
        }
        break;
      }
      case 'bisectanglepoint': {
        //NOTE: returns a point 'dist' away from the vertex of a angle such that the line between this one
        /// and the vertex would bisect the angle given by &A, &B, and &C
        //bisectanglepoint{&A,&B,&C,dist}
        let z1 = this.assert_arg_point(args,0);
        let z0 = this.assert_arg_point(args,1);
        let z2 = this.assert_arg_point(args,2);
        let r  = this.assert_arg_float(args,3);
        // start drawing anglearc
        let x0 = z0[0];
        let y0 = z0[1];
        let dx1 = z1[0] - z0[0];
        let dy1 = z1[1] - z0[1];
        let dx2 = z2[0] - z0[0];
        let dy2 = z2[1] - z0[1];
        let ang1 = Math.atan2(dy1, dx1) / Math.PI * 180;
        let ang2 = Math.atan2(dy2, dx2) / Math.PI * 180;
        if (ang1 < 0) { ang1 += 360; }
        if (ang2 < 0) { ang2 += 360; }
        if (ang2 < ang1) { ang2 += 360; }
        let angledelta = ang2 - ang1;
        let ang = ang1+angledelta/2;
        if (ang > 360) {
          ang -= 360;
        }
        let labelx = x0 + (r)*Math.cos(ang / 180 * Math.PI);
        let labely = y0 + (r)*Math.sin(ang / 180 * Math.PI);
        ret_val.push([labelx,labely,'M']);
        break;
      }
      case 'grid': {
        ///&grid{(0,0),4,3}
        let pt = this.assert_arg_point(args,0);
        let [x,y] = pt;
        let w = this.assert_arg_float(args,1);
        let h = this.assert_arg_float(args,2);
        if(w < 0){
          x = x + w;
          w = -w;
        }
        if( h < 0){
          y = y + h;
          h = -h;
        }
        for(let j=0; j < h; j++){
          ret_val.push([x  ,y+j, 'M', '','','','', 0,0,0,0,0]);
          ret_val.push([x+w,y+j, 'L', '','','','', 0,0,0,0,0]);
        }
        for(let i=0; i < w; i++){
          ret_val.push([x+i,y  , 'M', '','','','', 0,0,0,0,0]);
          ret_val.push([x+i,y+h, 'L', '','','','', 0,0,0,0,0]);
        }
        break;
      }
      case 'hboxplot': {
        ///&hboxplot{Q0,Q1,Q2,Q3,Q4,y}
        let x0 = this.assert_arg_float(args,0);
        let x1 = this.assert_arg_float(args,1);
        let x2 = this.assert_arg_float(args,2);
        let x3 = this.assert_arg_float(args,3);
        let x4 = this.assert_arg_float(args,4);
        let y = this.assert_arg_float(args,5);
        ret_val.push([x0,y-0.25,'M']);
        ret_val.push([x0,y+0.25,'L']);
        ret_val.push([x4,y-0.25,'M']);
        ret_val.push([x4,y+0.25,'L']);
        ret_val.push([x0,y,'M']);
        ret_val.push([x1,y,'L']);
        ret_val.push([x3,y,'M']);
        ret_val.push([x4,y,'L']);
        ret_val.push([x1,y-0.5,'M']); 
        ret_val.push([x3,y-0.5,'L']); 
        ret_val.push([x3,y+0.5,'L']); 
        ret_val.push([x1,y+0.5,'L']); 
        ret_val.push([0,0,'z']); 
        ret_val.push([x2,y-0.5,'M']); 
        ret_val.push([x2,y+0.5,'L']); 
        break;
      }
      case 'vboxplot': {
        ///&vboxplot{x,Q0,Q1,Q2,Q3,Q4}
        let x = this.assert_arg_float(args,0);
        let y0 = this.assert_arg_float(args,1);
        let y1 = this.assert_arg_float(args,2);
        let y2 = this.assert_arg_float(args,3);
        let y3 = this.assert_arg_float(args,4);
        let y4 = this.assert_arg_float(args,5);
        ret_val.push([x-0.25,y0,'M']);
        ret_val.push([x+0.25,y0,'L']);
        ret_val.push([x,y0,'M']);
        ret_val.push([x,y1,'L']);
        ret_val.push([x-0.25,y4,'M']);
        ret_val.push([x+0.25,y4,'L']);
        ret_val.push([x,y4,'M']);
        ret_val.push([x,y3,'L']);
        ret_val.push([x-0.5,y1,'M']);
        ret_val.push([x+0.5,y1,'L']);
        ret_val.push([x+0.5,y3,'L']);
        ret_val.push([x-0.5,y3,'L']);
        ret_val.push([0,0,'z']);
        ret_val.push([x-0.5,y2,'M']);
        ret_val.push([x+0.5,y2,'L']);
        break;
      }
      case 'points': {
        let xfloats = this.assert_arg_floats(args,0);
        let yfloats = this.assert_arg_floats(args,1);
        let i = xfloats.length;
        let j = yfloats.length;
        let n = Math.min(i,j);
        for(let k=0; k < n; k++){
          let x = xfloats[k];
          let y = yfloats[k];
          ret_val.push([x,y,'M']);
        }
        break;
      }
      case 'lines': {
        ///  \draw {linecolor:blue} ^car:a &lines{[@arr],[@yarr]}
        let xfloats = this.assert_arg_floats(args,0);
        let yfloats = this.assert_arg_floats(args,1);
        let i = xfloats.length;
        let j = yfloats.length;
        let n = Math.min(i,j);
        for(let k=0; k < n; k++){
          let x = xfloats[k];
          let y = yfloats[k];
          if(k==0){
            ret_val.push([x,y,'M']);
          }else{
            ret_val.push([x,y,'L']);
          }
        }
        break;
      }
      default:
        break;

    }
    return ret_val;
  }

  iscyclept(pt) {
    if (Array.isArray(pt) && pt[2] == 'z') {
      return true;
    }
    return false;
  }

  isvalidnum(){
    for(let i=0; i < arguments.length; ++i){
      let my = arguments[i];
      if(!Number.isFinite(my)){
        return false;
      }
    }
    return true;
  }

  rotate_point(x,y,rotate){
    var cos_theta = Math.cos(rotate/180*Math.PI);
    var sin_theta = Math.sin(rotate/180*Math.PI);
    var newx=[x*cos_theta - y*sin_theta]
    var newy=[x*sin_theta + y*cos_theta]
    return [newx,newy];
  }

  dup_coords(coords){
    ///NOTE: duplicate a set of coorinates
    var p = [];
    for(let j=0; j < coords.length; ++j){
      var pt = coords[j];
      var pt1 = pt.map(x => x);
      p.push(pt1);
    }
    return p;
  }

  dup_arr(arr){
    ///NOTE: duplicate a set of Complex numbers
    var p = [];
    for(let j=0; j < arr.length; ++j){
      var a = arr[j].clone();
      p.push(a);
    }
    return p;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////
  offset_coords(coords,refx,refy,refsx=1,refsy=1,rotation=0){
    ///NOTE that his changes the coords in place
    for(var j=0; j < coords.length; ++j){
      var join = coords[j][2];
      //rotate only if 'rotate' is not zero
      if(rotation){
        var x = coords[j][0];
        var y = coords[j][1];
        var [newx,newy] = this.rotate_point(x,y,rotation);
        coords[j][0] = newx;
        coords[j][1] = newy;
        var x = coords[j][3];
        var y = coords[j][4];
        var [newx,newy] = this.rotate_point(x,y,rotation);
        coords[j][3] = newx;
        coords[j][4] = newy;
        var x = coords[j][5];
        var y = coords[j][6];
        var [newx,newy] = this.rotate_point(x,y,rotation);
        coords[j][5] = newx;
        coords[j][6] = newy;
      }
      //we do scales and also moves
      coords[j][0] *= refsx;
      coords[j][1] *= refsy;
      coords[j][3] *= refsx;
      coords[j][4] *= refsy;
      coords[j][5] *= refsx;
      coords[j][6] *= refsy;
      /// point [7,8] are Rx,Ry for 'A', and needs to be scaled
      coords[j][7] *= refsx;
      coords[j][8] *= refsy;

      /// [0] and [1] are locations and need to be moved;
      /// [3], [4], [5], [6] are control
      /// points and are absolute, 
      /// we must move them too    
      coords[j][0] += refx;
      coords[j][1] += refy;
      coords[j][3] += refx;
      coords[j][4] += refy;
      coords[j][5] += refx;
      coords[j][6] += refy;

    }
  }
  offset_pt(pt,refx,refy,refsx=1,refsy=1,minx=0,miny=0){
    /// [0] and [1] are locations and need to be moved;
    /// [3], [4], [5], [6] are control
    /// points and are absolute, 
    /// we must move them too    
    pt[0] -= minx;
    pt[1] -= miny;
    pt[3] -= minx;
    pt[4] -= miny;
    pt[5] -= minx;
    pt[6] -= miny;

    //we do scales and also moves
    pt[0] *= refsx;
    pt[1] *= refsy;
    pt[3] *= refsx;
    pt[4] *= refsy;
    pt[5] *= refsx;
    pt[6] *= refsy;
    /// point [7,8] are Rx,Ry for 'A', and needs to be scaled
    pt[7] *= refsx;
    pt[8] *= refsy;

    /// [0] and [1] are locations and need to be moved;
    /// [3], [4], [5], [6] are control
    /// points and are absolute, 
    /// we must move them too    
    pt[0] += refx;
    pt[1] += refy;
    pt[3] += refx;
    pt[4] += refy;
    pt[5] += refx;
    pt[6] += refy;
  }

  ymirror_coords(coords,X){
    var newcoords = [];
    for(let i=0; i < coords.length; ++i){
      let pt = coords[i];
      let newpt = this.ymirror_pt(pt,X);
      newcoords.push(newpt);
    }
    return newcoords;
  }

  ymirror_pt(pt,X) {
    var newpt = [];
    for(let i=0; i < pt.length; ++i){
      newpt.push(pt[i]);
    }
    newpt[0] = X+X-newpt[0];
    //newpt[1] -= offsety;
    newpt[3] = X+X-newpt[3];
    //newpt[4] -= offsety;
    newpt[5] = X+X-newpt[5];
    //newpt[6] -= offsety;
    return newpt;
  }

  xmirror_coords(coords,Y){
    var newcoords = [];
    for(let i=0; i < coords.length; ++i){
      let pt = coords[i];
      let newpt = this.xmirror_pt(pt,Y);
      newcoords.push(newpt);
    }
    return newcoords;
  }

  xmirror_pt(pt,Y) {
    var newpt = [];
    for(let i=0; i < pt.length; ++i){
      newpt.push(pt[i]);
    }
    newpt[1] = Y+Y-newpt[1];
    //newpt[1] -= offsety;
    newpt[4] = Y+Y-newpt[4];
    //newpt[4] -= offsety;
    newpt[6] = Y+Y-newpt[6];
    //newpt[6] -= offsety;
    return newpt;
  }

  is_valid_point(pt) {
    if (Array.isArray(pt)) {
      let join = pt[2];
      if (typeof join === 'string'){
        if(join === 'M'|| join === 'L'|| join === 'Q'|| join === 'C'|| join === 'A'){
          return true;
        }
      }
    }
    return false;
  }

  point_at(coords, i) {
    if (coords && Array.isArray(coords) && i >= 0 && i < coords.length) {
      var pt = coords[i];
      if(pt){
        return pt;
      }
    }
    return [NaN,NaN,'z'];
  }
  float_at(array, i) {
    if (array && Array.isArray(array) && i >= 0 && i < array.length) {
      var pt = array[i];
      if(pt.isFinite()){
        return pt.re;
      }else{
        return NaN;
      }
    } 
    return 0;
  }
  extract_pathfunc_args(s,env){
    //NOTE: parm='(0,0)|4,5'
    //NOTE: parm='&a|4,5'
    //NOTE: parm='&a_0|5|6'
    //NOTE: para='@xarr|@yarr'
    //NOTE: para='(*)|4,5'
    const s0 = s;
    const re_pnt = /^(\(.*?\))\s*(.*)$/;
    const re_sym = /^&([A-Za-z][A-Za-z0-9]*)(\[\d+\]|_\d+|)\s*(.*)$/;
    const re_var = /^([\+\-]?[A-Za-z][A-Za-z0-9_]*)\s*(.*)$/;
    const re_hex = /^([\+\-]?0x[A-Fa-f0-9]+)\s*(.*)$/;
    const re_bin = /^([\+\-]?0b[0-1]+)\s*(.*)$/;
    const re_oct = /^([\+\-]?0o[0-7]+)\s*(.*)$/;
    const re_num = /^([\+\-]?[\d\.]+)\s*(.*)$/;
    var v;
    var d = [];
    d = s.trim().split('|').map(s=>s.trim()).map(raw => {
      var pt = {raw,coords:[],array:[]};
      return pt;
    });
    d.forEach((pt) => {
      let s = pt.raw;
      if((v=re_pnt.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [q] = this.read_coords(s1,env);
        if(q.length){
          pt.coords.push(q[0]);
        }
      }
      else if((v=re_sym.exec(s))!==null){
        let symbol = v[1];
        let index  = v[2];
        symbol = symbol+index;//combine "a" and "[1]" to get "a[1]"
        s = v[3];
        let q = this.get_path_from_symbol(symbol);//the returned path has already been duplicated
        q.forEach((x) => {
          pt.coords.push(x);
        })
      }
      else if(this.re_is_avr.test(s)||this.re_is_brackets.test(s)){
        let q = this.expr.read_arr(s,env);
        q.forEach((x) => {
          pt.array.push(x);
        })     
      }
      else if((v=re_var.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let x = this.expr.read_var(s1,env);
        pt.array.push(x);
      }
      else if((v=re_hex.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let x = this.expr.read_var(s1,env);
        pt.array.push(x);
      }
      else if((v=re_bin.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let x = this.expr.read_var(s1,env);
        pt.array.push(x);
      }
      else if((v=re_oct.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let x = this.expr.read_var(s1,env);
        pt.array.push(x);
      }
      else if((v=re_num.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let x = this.expr.read_var(s1,env);
        pt.array.push(x);
      }
    });
    return d;
  }

  read_coords(line,env) {
    ///each line contains the following fields
    ///   [0] x
    ///   [1] y
    ///   [2] join
    ///   [3] x1 for bezier
    ///   [4] y1 for bezier
    ///   [5] x2 for bezier
    ///   [6] y2 for bezier
    ///   [7] Rx for 'a'
    ///   [8] Ry for 'a'
    ///   [9] Phi for 'a'
    ///   [10] bigarcflag
    ///   [11] sweepflag
    ///   [12] hint
    var line0 = line;
    var coords = [];
    var dx = 0;
    var dy = 0;
    var v, v1, v2, v3, v4;
    var n = 0;
    var x = 0;
    var y = 0;
    var x1 = 0;//First control point for cubic
    var y1 = 0;//First control point for cubic
    var x2 = 0;//Second control point for cubic
    var y2 = 0;//Second control point for cubic
    var x3 = 0;//First control point for quadratic
    var y3 = 0;//First control point for quadratic
    var dashdot = '';
    var dashdot_floats = [];
    var lasthint = 0;
    var lastoffset_x = 0;
    var lastoffset_y = 0;
    var lastoffset_sx = 1;
    var lastoffset_sy = 1;
    var lastoffset_xmin = 0;
    var lastoffset_ymin = 0;
    var last_tx = 0;
    var last_ty = 0;
    var hobby_p = [];
    var txts = [];
    var g = {...env};
    while (line.length) {

      // {style}
      if ((v=this.re_coords_is_style.exec(line))!==null) {
        line = v[2];
        let s = v[1].trim();
        s = `{${s}}`;
        g = this.string_to_style(s,g);//need to build from previous 'g'
        continue;
      }

      // +0+0
      // -0-0
      // -1-1
      // +1-1
      // +9-9
      if ((v=this.re_coords_is_txty.exec(line))!==null) {
        last_tx = parseFloat(v[1])/10;
        last_ty = parseFloat(v[2])/10;
        line = v[3];    
        continue;
      }
      
      // "text"
      if ((v=this.re_coords_is_label.exec(line))!==null) {
        let label = v[1].trim();
        line = v[2];    
        let tx = last_tx;
        let ty = last_ty;
        txts.push({label,tx,ty});
        continue;
      }
      
      // ^at:A
      if ((v = this.re_coords_is_aux.exec(line))!==null) {
        //^x:2, ^y:2, ^s:2, ^sx:2, ^sy:2, ^at:center, ^pt:a, ^hint:linedashed ^car:1
        let key   = v[1];
        let colon = v[2];
        let val   = v[3];
        line      = v[4];
        let [a] = this.expr.extract_next_expr(val,env);
        let num = 0;
        let dec = 0;
        if(a.isFinite()){
          num = a.re;
          dec = parseInt(num);
        }
        switch (key){
          case 'hint': {
            //'hint:linedashed|linesize2
            lasthint = this.string_to_lasthints(val);
            break;
          }
          case '*': {
            // '^*:a' - save the lastpt 
            let symbol = val;
            if(this.re_is_symbol_name.test(symbol)){
              let pt = [this.lastpt_x,this.lastpt_y,'M','','','','', 0,0,0,0,0, 0];
              // this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              let p = [pt];
              this.my_path_map.set(symbol,p);
              this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
            }
            break;
          }
          case 'at': {
            //at:a - restore the lastoffset_x/lastoffset_y
            let symbol = val;
            let p = this.get_path_from_symbol(symbol);
            let pt = this.point_at(p,0);
            if(this.is_valid_point(pt)){
              lastoffset_x = pt[0];
              lastoffset_y = pt[1];
            }
            break;
          }
          case 'center': lastoffset_x = this.viewport_width/2, lastoffset_y = this.viewport_height/2; break;
          case 'top': lastoffset_y = this.viewport_height; break;
          case 'side': lastoffset_x = this.viewport_width; break;
          case 'node': {
            //^node:1
            let id = val;
            if(this.my_node_map.has(id)){
              let p = this.my_node_map.get(id);
              let {x,y} = p;
              lastoffset_x = x;
              lastoffset_y = y;
            }
            break;
          }
          case 'box': {
            //^box:1
            let id = val;
            if(this.my_box_map.has(id)){
              let p = this.my_box_map.get(id);
              let {x,y} = p;
              lastoffset_x = x;
              lastoffset_y = y;
            }
            break;
          }
          case 'chart': {
            //^chart:1
            let id = val;
            if(this.my_chart_map.has(id)){
              let p = this.my_chart_map.get(id);
              let {x,y,xmin,xmax,ymin,ymax,w,h} = p;
              lastoffset_x = x;
              lastoffset_y = y;
              lastoffset_sx = w/(xmax-xmin);
              lastoffset_sy = h/(ymax-ymin);
              lastoffset_xmin = xmin;
              lastoffset_ymin = ymin;
            }
            break;
          }
          case 'car': {
            //^car:1
            let id = val;
            if(this.my_car_map.has(id)){
              let p = this.my_car_map.get(id);
              let {xorigin,yorigin,xgrid,ygrid} = p;
              lastoffset_x = xorigin;
              lastoffset_y = yorigin;
              lastoffset_sx = 1/xgrid;
              lastoffset_sy = 1/ygrid;
              lastoffset_xmin = 0;
              lastoffset_ymin = 0;
            }
            break;
          }
          default: {
            if(Number.isFinite(num)){
              if(key=='h')           lastoffset_x += num;
              else if(key=='v')      lastoffset_y += num;
              else if(key=='y')      lastoffset_y = num;
              else if(key=='x')      lastoffset_x = num;
              else if(key=='sy')     lastoffset_sy = num, lastoffset_y *= num;
              else if(key=='sx')     lastoffset_sx = num, lastoffset_x *= num;
              else if(key=='s')      lastoffset_sx = num, lastoffset_sy = num, lastoffset_x *= num, lastoffset_y *= num;
            }
            break;
          }
        }
        continue;
      }

      if((v=this.re_coords_is_pathfunc.exec(line))!==null){
        var name = v[1];
        var parm = v[2];
        line = v[3];
        var args = this.extract_pathfunc_args(parm,env);
        var pts = this.exec_pathfunc(name,args,env);
        for (var pt of pts) {
          if(this.is_valid_point(pt)){
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
          }
          if(lasthint){
            pt[12]=lasthint;
            lasthint = 0;
          }
          coords.push(pt);
        }
        continue;
      }

      if((v=this.re_coords_is_pathvar.exec(line))!==null){
        /// '&a'
        /// '&a_1'
        /// '&a[1]'
        var symbol = v[1];
        var index = v[2];
        var symbol = symbol+index;
        line = v[3];
        var pts = this.get_path_from_symbol(symbol);
        for (var pt of pts) {
          if(this.is_valid_point(pt)){
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
          }
          if(lasthint){
            pt[12]=lasthint;
            lasthint = 0;
          }
          coords.push(pt);
        }
        continue;
      }

      if((v=this.re_coords_is_point.exec(line))!==null){
        /// '(*)'
        /// '(1,2)'
        /// '(&a_0)'
        /// '(&a)'
        /// '(&a:-1,+3)
        /// '(#box:1)'
        /// '(#node:1)'
        /// '(#car:1)'
        /// '(#chart:1)'
        let s = v[1];
        line = v[2];
        let from = [];
        n++;
        if(s=='*'){
          /// '*'
          if(1){
            let pt = [this.lastpt_x,this.lastpt_y,'M', '','','','', 0,0,0,0,0, 0];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }
        }else if(s.startsWith('*:')){
          /// '*:2,3'
          s = s.slice(2);
          var [dx,dy] = s.split(',').map((x)=>x.trim());
          dx = this.extract_float(dx,env);
          dy = this.extract_float(dy,env);
          if(Number.isFinite(dx)&&Number.isFinite(dy)){
            let pt = [this.lastpt_x+dx,this.lastpt_y+dy,'M', '','','','', 0,0,0,0,0, 0];
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }
        }else if(s.startsWith('&')){
          /// '&a_0'
          /// '&a'
          /// '&a[1]'
          /// '&a:1,-3'
          let symbol = s.slice(1);
          var [dx,dy] = [0,0];
          if(symbol.indexOf(":")>=0){
            let ss = symbol.split(":");
            symbol = ss[0];
            var [dx,dy] = ss[1].split(',').map((x)=>x.trim());
            dx = this.extract_float(dx,env);
            dy = this.extract_float(dy,env);
          }
          let pts = this.get_path_from_symbol(symbol);
          if(pts.length && this.is_valid_point(pts[0])){
            ///only grab the first point, if no point, then nothing is added
            let pt = pts[0];
            if(Number.isFinite(dx)&&Number.isFinite(dy)){
              pt[0] += dx;
              pt[1] += dy;
            }
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            pt[2] = 'M';
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }
        }else if(s.startsWith('#box:')){
          /// '#box:1:n,1,2'
          s = s.slice(5);
          var [ac,dx,dy] = s.split(',').map((x)=>x.trim());
          var [id,anchor] = ac.split(':');
          if(this.my_box_map.has(id)){
            var p = this.my_box_map.get(id); 
            var {x,y,w,h,boxtype} = p;
            var [x,y] = this.move_box_xy_by_anchor(x,y,w,h,boxtype,anchor);
            dx = this.extract_float(dx,env);
            dy = this.extract_float(dy,env);
            if(Number.isFinite(dx)) x += dx;
            if(Number.isFinite(dy)) y += dy;
            if(Number.isFinite(x)&&Number.isFinite(y)){
              var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              if(lasthint){
                pt[12]=lasthint;
                lasthint = 0;
              }
              from.push(pt);
            }
          }
        }else if(s.startsWith('#node:')){
          /// '#node:2:o3,1,2'
          s = s.slice(6);
          var [ac,dx,dy] = s.split(',').map((x)=>x.trim());
          var [id,anchor] = ac.split(':');
          if(this.my_node_map.has(id)){
            var p = this.my_node_map.get(id); 
            var {x,y,r,nodetype} = p;
            var [x,y] = this.move_node_center_by_anchor(x,y,r,nodetype,anchor);
            dx = this.extract_float(dx,env);
            dy = this.extract_float(dy,env);
            if(Number.isFinite(dx)) x += dx;
            if(Number.isFinite(dy)) y += dy;
            if(Number.isFinite(x)&&Number.isFinite(y)){
              var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              if(lasthint){
                pt[12]=lasthint;
                lasthint = 0;
              }
              from.push(pt);
            }        
          }
        }else if(s.startsWith('#car:')){    
          /// '#car:1,-2,1'    
          s = s.slice(5);
          var [id,dx,dy] = s.split(',').map((x)=>x.trim());
          if(this.my_car_map.has(id)){
            var p = this.my_car_map.get(id); 
            var {xorigin,yorigin,xgrid,ygrid} = p;
            dx = this.extract_float(dx,env);
            dy = this.extract_float(dy,env);
            var x = xorigin + dx/xgrid;
            var y = yorigin + dy/ygrid;
            if(Number.isFinite(x)&&(Number.isFinite(y))){
              var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              if(lasthint){
                pt[12]=lasthint;
                lasthint = 0;
              }
              from.push(pt);
            }
          }
        }else if(s.startsWith('#chart:')){    
          /// '#chart:1,-2,1'    
          s = s.slice(7);
          var [id,dx,dy] = s.split(',').map((x)=>x.trim());
          if(this.my_chart_map.has(id)){
            var p = this.my_chart_map.get(id); 
            //var {x,y,xmin,ymin,xmax,ymax,w,h} = p;
            dx = this.extract_float(dx,env);
            dy = this.extract_float(dy,env);
            var x = (dx-p.xmin)/(p.xmax-p.xmin)*p.w + p.x;
            var y = (dy-p.ymin)/(p.ymax-p.ymin)*p.h + p.y;
            if(Number.isFinite(x)&&(Number.isFinite(y))){
              var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              if(lasthint){
                pt[12]=lasthint;
                lasthint = 0;
              }
              from.push(pt);
            }
          }
        }else{
          // '1,2'
          s = `[${s}]`;
          let numbers = this.expr.read_arr(s,env);
          let floats = this.numbers_to_floats(numbers);
          x = floats[0];
          y = floats[1];
          if(Number.isFinite(x)&&Number.isFinite(y)){
            var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }
        }
        ///add in the offset; ***NOTE that offset should only
        ///be added for real coords, and not the relatives.
        if (dashdot.charAt(0) === '.') {
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            hobby_p.push([x, y]);
            coords.push(pt);
            var tension = 1;
            var knots = makeknots(hobby_p, tension, false);///nitrile-preview-mppath.js
            mp_make_choices(knots[0]);
            ///*NOTE: If hobby_p variable contains 2 pts, the knots variable will be a two-elem
            ///       array. If hobby_p is 3-elem array, then knots variable will be a three-elem
            ///       array. In this case the pt 1 and 2 is a curve, and pt 2 and 3 is another curve.
            ///       The control points for the first curve is 
            ///            (knots[0].rx_pt, knots[0].ry_pt), 
            ///            (knots[1].lx_pt, knots[1].ly_pt), 
            ///
            ///       The control points for the second curve is 
            ///            (knots[1].rx_pt, knots[1].ry_pt),     
            ///            (knots[2].lx_pt, knots[2].ly_pt),     
            ///
            for (var i = 1; i < knots.length; ++i) {
              var j = coords.length - knots.length + i;
              coords[j][2] = 'C';
              coords[j][3] = knots[i - 1].rx_pt;
              coords[j][4] = knots[i - 1].ry_pt;
              coords[j][5] = knots[i].lx_pt;
              coords[j][6] = knots[i].ly_pt;
            }
          } 
        } else if (dashdot.charAt(0) === '-') {
          ///turn it off
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            hobby_p = [];
            hobby_p.push([x,y]);
            pt[2] = 'L';
            pt[3] = '';
            pt[4] = '';
            pt[5] = '';
            pt[6] = '';
            coords.push(pt);
          }
        } else if (dashdot === 'veer') {
          /// |veer:50|
          let abr = this.assert_float(dashdot_floats[0],0);
          let x0 = 0;
          let y0 = 0;
          if(coords.length){
            x0 = coords[coords.length-1][0];
            y0 = coords[coords.length-1][1];
          }
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            hobby_p = [];
            hobby_p.push([x,y]);     
            let [pt0,pt1,pt2] = this.abr_to_qbezier(abr, x0,y0, x,y);  
            pt[2] = 'Q';
            pt[3] = pt1[0];
            pt[4] = pt1[1];
            pt[5] = '';
            pt[6] = '';     
            coords.push(pt); 
          }
        } else if (dashdot === 'qbezier') {
          /// |qbezier:4,-1|
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            hobby_p = [];
            hobby_p.push([x,y]);          
            x1 = this.assert_float(dashdot_floats[0],0);
            y1 = this.assert_float(dashdot_floats[1],0);  
            pt[2] = 'Q';
            pt[3] = x1;
            pt[4] = y1;
            pt[5] = '';
            pt[6] = '';
            coords.push(pt);
          }
        } else if (dashdot === 'cbezier') {
          /// |cbezier:4,-1,3,2|
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            hobby_p = [];
            hobby_p.push([x,y]);          
            x1 = this.assert_float(dashdot_floats[0],0);
            y1 = this.assert_float(dashdot_floats[1],0);  
            x2 = this.assert_float(dashdot_floats[2],0);
            y2 = this.assert_float(dashdot_floats[3],0);  
            pt[2] = 'C';
            pt[3] = x1;
            pt[4] = y1;
            pt[5] = x2;
            pt[6] = y2;
            coords.push(pt);
          }
        } else {
          ///turn it off
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            hobby_p = [];
            hobby_p.push([x,y]);
            ///just copy the points w/o modification, the get_path_from_symbol() funciton needs to set the 'join' member to 'M' for a single point
            coords.push(pt);
          }
        }
        dashdot = '';
        continue;
      }

      if ((v = this.re_coords_is_relative.exec(line)) !== null) {
        n++;
        dashdot = '';
        /// <angledist:angle,dist>
        /// <clock:angle,dist>
        /// <turn:angle,dist>
        /// <flip:dx,dy> /// flip the point to the other side of the line of the last two points
        /// <sweep:cx,cy,angle> /// draws a arc that sweeps around a fixed point for a given number of degrees
        /// <extrude:dist> /// adds a new line segment that extends from the current location to a new point that follows the direction of last two points for a fixed distance
        /// <bend:dx,dy,sweepflag> /// draws a curve from the current to the point dx/dy away in the shape of a quarter ellipse
        /// <l:dx,dy> /// line
        /// <h:dx> /// line
        /// <v:dy> /// line
        /// <c:dx1,dy1,dx2,dy2,dx,dy>
        /// <s:dx2,dy2,dx,dy>
        /// <a:rx,ry,angle,bigarcflag,sweepflag,dx,dy>
        /// <q:dx1,dy1,dx,dy>
        /// <t:dx,dy>
        /// <m:dx,dy> ///move the point, will terminate the current one
        /// <z> ///add a cycle point
        var fun_name = v[1].trim();
        line = v[2];
        fun_name = fun_name.split(':');
        fun_name = fun_name.map(x => x.trim());
        var key = fun_name[0];
        var val = fun_name[1]||'';
        var val = `[${val}]`;
        var val = this.expr.read_arr(val,env);
        var val = this.numbers_to_floats(val);
        if (key === 'angledist') {
          if (val.length == 2) {
            let angle_deg = val[0];
            let dist = val[1];
            ///
            dx = dist * Math.cos(angle_deg / 180 * Math.PI);
            dy = dist * Math.sin(angle_deg / 180 * Math.PI);
            if (!Number.isFinite(dx)) { dx = 0; }
            if (!Number.isFinite(dy)) { dy = 0; }
            x = dx;
            y = dy;
            let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            coords.push(pt);
          }else if(val.length == 4){
            let angle_deg = val[0];
            let dist = val[1];
            dx = val[2];
            dy = val[3];
            var last_angle_deg = Math.atan2(dy,dx)/Math.PI*180;//anti-clockwise
            angle_deg = last_angle_deg + angle_deg;
            ///
            dx = dist * Math.cos(angle_deg / 180 * Math.PI);
            dy = dist * Math.sin(angle_deg / 180 * Math.PI);
            if (!Number.isFinite(dx)) { dx = 0; }
            if (!Number.isFinite(dy)) { dy = 0; }
            x = dx;
            y = dy;
            let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            coords.push(pt);
          }
        }
        else if (key === 'clock') {
          // [clock:30,1]
          // [clock:30,1,x1,y1]
          // [clock:30,1,x1,y1,x2,y2]
          if (val.length == 2 || val.length == 4 || val.length == 6) {
            if(val.length == 2){
              var last_angle_deg = 0
              var angle_deg = val[0];
              var dist = val[1];
              var angle_deg = last_angle_deg + angle_deg;
            }else if(val.length == 4){
              var angle_deg = val[0];
              var dist = val[1];
              var dx = val[2];
              var dy = val[3];
              var last_angle_deg = Math.atan2(dx,dy)/Math.PI*180;//clock-coords
              var angle_deg = last_angle_deg + angle_deg;
            }else if(val.length == 6){
              var angle_deg = val[0];
              var dist = val[1];
              var dx = val[2] - val[4];
              var dy = val[3] - val[5];
              var last_angle_deg = Math.atan2(dx,dy)/Math.PI*180;//clock-coords
              var angle_deg = last_angle_deg + angle_deg;
            }
            dx = dist * Math.sin(angle_deg / 180 * Math.PI);
            dy = dist * Math.cos(angle_deg / 180 * Math.PI);
            if (!Number.isFinite(dx)) { dx = 0; }
            if (!Number.isFinite(dy)) { dy = 0; }
            x = dx;
            y = dy;
            let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            coords.push(pt);
          }
        }
        else if (key === 'turn') {
          if (val.length == 2) {
            var angle = val[0];
            var dist = val[1];
            var lastangle = this.computeLastAngleDegree(coords);
            angle += lastangle;
            dx = dist * Math.cos(angle / 180 * Math.PI);
            dy = dist * Math.sin(angle / 180 * Math.PI);
            if (Number.isFinite(dx) && Number.isFinite(dy)){
              x = dx;
              y = dy;
              let pt = [x, y, 'L', '','','','', 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
            }
          }
        }
        else if (key === 'flip') {
          if (val.length == 2) {
            var tx = val[0];
            var ty = val[1];
            if (coords.length > 1 && Number.isFinite(tx) && Number.isFinite(ty)) {
              var n = coords.length;
              var st = coords[n - 2];
              var pt = coords[n - 1];
              var stx = st[0] - this.lastpt_x;
              var sty = st[1] - this.lastpt_y;
              var ptx = pt[0] - this.lastpt_x;
              var pty = pt[1] - this.lastpt_y;
              [dx, dy] = this.computeMirroredPointOffset(stx,sty, ptx,pty, tx,ty);
              if (Number.isFinite(dx) && Number.isFinite(dy)) {
                x = tx + dx;
                y = ty + dy;
                let pt = [x, y, 'L', '','','','', 0,0,0,0,0, lasthint];
                this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
                this.lastpt_x = pt[0];
                this.lastpt_y = pt[1];
                this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
                coords.push(pt);
              }
            }
          }
        }
        else if (key === 'sweep') {
          if (val.length == 3) {
            var cx = val[0];
            var cy = val[1];
            var angle = val[2];
            if (Number.isFinite(cx) && Number.isFinite(cy) && Number.isFinite(angle)) {
              cx = 0 + cx;
              cy = 0 + cy;
              dx = 0 - cx;
              dy = 0 - cy;
              var r = Math.sqrt(dx*dx + dy*dy);
              var angle0 = Math.atan2(dy,dx);
              var angle1 = angle0 + angle/180*Math.PI;
              x = cx + r*Math.cos(angle1);
              y = cy + r*Math.sin(angle1);
              let Phi = 0;
              let bigarcflag = (Math.abs(angle)>180) ? 1 : 0;
              let sweepflag = (Math.sign(angle)>=0) ? 0 : 1;
              let pt = [x, y, 'A', '','','','', r,r,Phi,bigarcflag,sweepflag, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
            }
          }
        }
        else if (key === 'extrude') {
          if (val.length == 1) {
            var dist = val[0];
            if (Number.isFinite(dist) && coords.length>1) {
              var n = coords.length;
              var x1 = coords[n-2][0];
              var y1 = coords[n-2][1];
              var x2 = coords[n-1][0];
              var y2 = coords[n-1][1];
              var angle = Math.atan2(y2-y1, x2-x1);
              x = dist*Math.cos(angle);
              y = dist*Math.sin(angle);
              let pt = [x, y, 'L', '','','','', 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
            }
          }
        }
        else if (key === 'bend') {
          ///[bend:dx,dy,sweepflag]
          dx = this.assert_float(val[0]);
          dy = this.assert_float(val[1]);
          let sweepflag = this.assert_int(val[2]);
          var rat = this.RATIO_CIRCLE_TO_CUBIC;
          x = dx;
          y = dy;
          if(sweepflag==0){
            ///anti-clockwise sweep
            if((Math.sign(dx)>0 && Math.sign(dy)>0)||
                (Math.sign(dx)<0 && Math.sign(dy)<0)){
              x1 = 0 + dx*rat;
              y1 = 0;
              x2 = x;
              y2 = y - dy*rat;
            }else{
              x1 = 0;
              y1 = 0 + dy*rat;
              x2 = x - dx*rat;
              y2 = y;
            }
            let pt = [x, y, 'C', x1,y1,x2,y2, 0,0,0,0,0, lasthint];
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            coords.push(pt);
          }else{
            //clockwise-sweep
            if((Math.sign(dx)>0 && Math.sign(dy)>0)||(Math.sign(dx)<0 && Math.sign(dy)<0)){
              x1 = 0;
              y1 = 0 + dy*rat;
              x2 = x - dx*rat;
              y2 = y;
            }else{
              x1 = 0 + dx*rat;
              y1 = 0;
              x2 = x;
              y2 = y - dy*rat;
            }
            let pt = [x, y, 'C', x1,y1,x2,y2, 0,0,0,0,0, lasthint];
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            coords.push(pt);
          }
        }
        else if (key === 'l') {
          if (val.length == 2) {
            dx = val[0];
            dy = val[1];
            if (Number.isFinite(dy) && Number.isFinite(dx)) {
              x = dx;
              y = dy;
              let pt = [x, y, 'L', '','','','', 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
            }
          }
        }
        else if (key === 'h') {
          if (val.length == 1) {
            dx = val[0];
            dy = 0;
            if (Number.isFinite(dy) && Number.isFinite(dx)) {
              x = dx;
              y = dy;
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
            }
          }
        }
        else if (key === 'v') {
          if (val.length == 1) {
            dx = 0;
            dy = val[0];
            if (Number.isFinite(dy) && Number.isFinite(dx)) {
              x = dx;
              y = dy;
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
            }
          }
        }
        else if (key === 'c') {
          if (val.length == 6) {
            x1 = val[0];
            y1 = val[1];
            x2 = val[2];
            y2 = val[3];
            x  = val[4];
            y  = val[5];
            if (Number.isFinite(x1) &&
              Number.isFinite(y1) &&
              Number.isFinite(x2) &&
              Number.isFinite(y2) &&
              Number.isFinite(x) &&
              Number.isFinite(y)) {
              let pt = [x, y, 'C', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
              x1 = pt[3];
              y1 = pt[4];
              x2 = pt[5];
              y2 = pt[6];
            }
          }
        }
        else if (key === 's') {
          let glue = '';
          if(coords.length){
            glue = coords[coords.length-1][2];
          }
          if (val.length == 4) {
            if (glue === 'Q') {
              [x1,y1] = this.MIRROR([x1,y1],[this.lastpt_x,this.lastpt_y]);
            } else if (glue === 'C') {
              [x1,y1] = this.MIRROR([x2,y2],[this.lastpt_x,this.lastpt_y]);
            } else {
              x1 = this.lastpt_x;
              y1 = this.lastpt_y;
            }
            x2 = val[0];
            y2 = val[1];
            x  = val[2];
            y  = val[3];
            if (Number.isFinite(x1) &&
              Number.isFinite(y1) &&
              Number.isFinite(x2) &&
              Number.isFinite(y2) &&
              Number.isFinite(x) &&
              Number.isFinite(y)) {
              let pt = [x, y, 'C', '','',x2,y2, 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              pt[3] = x1;///readjust for x1/y1 
              pt[4] = y1;
              coords.push(pt);
              x1 = pt[3];
              y1 = pt[4];
              x2 = pt[5];
              y2 = pt[6];
            }
          }
        }
        else if (key === 'a') {
          /// <a:rx,ry,angle,bigarcflag,sweepflag,dx,dy>
          if (val.length == 7) {
            let X2 = val[5];
            let Y2 = val[6];
            let Rx = val[0];
            let Ry = val[1];
            let Phi = val[2];
            let bigarcflag = val[3];
            let sweepflag = val[4];
            if (Number.isFinite(X2) && Number.isFinite(Y2) && Number.isFinite(Rx) && Number.isFinite(Ry) && Number.isFinite(Phi) && Number.isFinite(bigarcflag) && Number.isFinite(sweepflag)) {
              let pt = [X2, Y2, 'A', '','','','', Rx,Ry,Phi,bigarcflag,sweepflag, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
            }
          }
        }
        else if (key === 'q') {
          if (val.length == 4) {
            x1 = val[0];
            y1 = val[1];
            x  = val[2];
            y  = val[3];
            if (Number.isFinite(x1) &&
              Number.isFinite(y1) &&
              Number.isFinite(x) &&
              Number.isFinite(y)) {
              ///NOTE: need to convert to cubic
              //let [C0,C1,C2,C3] = this.quadrilaticToCubic(lastpt,[x1,y1],[x,y]);
              let pt = [x, y, 'Q', x1,y1,'','', 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              coords.push(pt);
              x1 = pt[3];
              y1 = pt[4];
              x2 = pt[5];
              y2 = pt[6];
            }
          }
        }
        else if (key === 't') {
          let glue = '';
          if(coords.length){
            glue = coords[coords.length-1][2];
          }
          if (val.length == 2) {
            x = this.lastpt_x + val[0];
            y = this.lastpt_y + val[1];
            if (glue === 'Q') {
              [x1,y1] = this.MIRROR([x1,y1],[this.lastpt_x,this.lastpt_y]);
            } else if (glue === 'C') {
              [x1,y1] = this.MIRROR([x2,y2],[this.lastpt_x,this.lastpt_y]);
            } else {
              [x1,y1] = [this.lastpt_x,this.lastpt_y];
            }
            if (Number.isFinite(x1) &&
              Number.isFinite(y1) &&
              Number.isFinite(x) &&
              Number.isFinite(y)) {
              ///last control point for Q is saved as x1/y1, we need
              ///to mirror it again the lastpt
              ///NOTE: need to convert to cubic
              //let [C0,C1,C2,C3] = this.quadrilaticToCubic(lastpt,[x1,y1],[x,y]);
              let pt = [x, y, 'Q', '','','','', 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
              pt[3] = x1;//readjust for x1/y1
              pt[4] = y1;
              coords.push(pt);
              x1 = pt[3];
              y1 = pt[4];
              x2 = pt[5];
              y2 = pt[6];
            }
          }
        }
        else if (key === 'm') {
          dx = val[0];
          dy = val[1];
          if(Number.isFinite(dx)&&Number.isFinite(dy)){
            //relatve to the lastpt
            x = dx;
            y = dy;
            let pt = [x,y,'M', '','','','', 0,0,0,0,0, lasthint];
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,1,1);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy,lastoffset_xmin,lastoffset_ymin);
            if(coords.length){
              let pt0 = coords[coords.length-1];
              if(pt0[2]=='M'){
                pt0[0] = pt[0];
                pt0[1] = pt[1];
              }else{
                coords.push(pt);
              }
            }
          }
        }
        else if (key === 'z'){
          lasthint = 0;
          dashdot = '';
          coords.push([0,0,'z']);
        }
        continue;
      }

      /// |q:4,-1|
      if ((v = this.re_coords_is_join.exec(line)) !== null) {
        [dashdot,dashdot_floats] = this.extract_named_floats(v[1]);
        line = v[2];
        continue;
      }

      /// (1,1) .. (2,3)
      if ((v = this.re_coords_is_dashdot.exec(line)) !== null) {
        dashdot = v[1].trim();
        line = v[2];
        continue;
      }  

      ///***NOTE: it is important to get out of for-loop
      ///because we do not know how to skip to the next coord
      break;
    }

    if(0){
      let s0 = this.coords_to_string(coords);
      this.do_comment(`***coords: ${s0}`);
    }

    ///NOTE: here we will call the latest addition which is to
    ///turn all continuous '..' MetaPost curve operation into
    ///..controls(x,y)and(x,y)..
    //if(user && typeof user == 'object'){
    //  user.s = line;
    //}
    return [coords,g,txts,line];
  }
  read_format_expr(line,env){
    const re_format = /^@\"(.*?)\"\s*(.*)$/;
    var v;
    if((v=re_format.exec(line))!==null){
      let fmt = v[1];
      let args = this.string_to_array(v[2]);
      let s2 = this.format_args(fmt,args,env);
      return s2;
    }
    return '';
  }
  numbers_to_floats(numbers) {
    var floats = numbers.map((x) => x.re);
    return floats;
  }
  compute_last_clock(coords) {
    var n = coords.length;
    if (n < 2) {
      return 0;
    }
    var x1 = coords[n - 2][0];
    var y1 = coords[n - 2][1];
    var x2 = coords[n - 1][0];
    var y2 = coords[n - 1][1];
    var dx = x2 - x1;
    var dy = y2 - y1;
    var ang1 = Math.atan2(dx, dy) / Math.PI * 180;
    return ang1;
  }

  computeAngleDegree(px, py, tx, ty) {
    var dx1 = tx - px;
    var dy1 = ty - py;
    var ang1 = Math.atan2(dy1, dx1) / Math.PI * 180;
    if (ang1 < 0) { ang1 += 360; }
    return ang1;
  }

  computeLastAngleDegree(coords) {
    var n = coords.length;
    if (n < 2) {
      return 0;
    }
    var sx = coords[n - 2][0];
    var sy = coords[n - 2][1];
    var px = coords[n - 1][0];
    var py = coords[n - 1][1];
    return this.computeAngleDegree(sx, sy, px, py);
  }

  computeMirroredPointOffset(stx,sty, ptx,pty, tx, ty) {
    /// This function is to compute the offset to a new point that is the
    /// mirror reflection of the current point (tx,ty) off the line formed
    /// by the last two points in the coords.
    //var n = coords.length;
    //if (n < 2) {
      //return [tx, ty];
    //}
    //var sx = coords[n - 2][0];
    //var sy = coords[n - 2][1];
    //var px = coords[n - 1][0];
    //var py = coords[n - 1][1];
    ptx -= stx;
    pty -= sty;
    tx -= stx;
    ty -= sty;
    ///console.log('computeMirroredPointOffset: adjusted: tx=',tx,' ty=',ty);
    var magni = Math.sqrt(ptx * ptx + pty * pty);
    ptx /= magni;///unit vector
    pty /= magni;///unit vector
    ///console.log('computeMirroredPointOffset: unit: px=',px,' py=',py);
    var dotprod = ptx * tx + pty * ty;
    ///console.log('computeMirroredPointOffset: dotprod=',dotprod);
    var nx = dotprod * ptx;
    var ny = dotprod * pty;
    ///console.log('computeMirroredPointOffset: nx=',nx,' ny=',ny);
    var dx = nx - tx;
    var dy = ny - ty;
    dx *= 2;
    dy *= 2;
    ///console.log('computeMirroredPointOffset: adjusted: dx=',dx,' dy=',dy);

    return [dx, dy];

  }

  computeLineIntersection(p0, p1, p2, p3) {
    /// this is to compute the intersection of two lines p0~p1 and p2~p3
    let [A1, B1, C1] = this.computeStandardLineForm(p0, p1);
    let [A2, B2, C2] = this.computeStandardLineForm(p2, p3);
    let y = (A1 * C2 - A2 * C1) / (A1 * B2 - A2 * B1);
    let x = (C1 * B2 - C2 * B1) / (A1 * B2 - A2 * B1);
    return [x, y];
  }

  computeStandardLineForm(p1, p2) {
    let [x1, y1] = p1;
    let [x2, y2] = p2;
    let A = y2 - y1;
    let B = x1 - x2;
    let C = A * x1 + B * y1;
    ///console.log('A=',A);
    ///console.log('B=',B);
    ///console.log('C=',C);
    return [A, B, C];
  }

  computeCircleLineIntersection(rsq, A, B, C) {
    ///return an array of four points: x1,y1,x2,y2
    let something = (A * A + B * B) * (B * B * rsq - C * C) + A * A * C * C;
    let x1 = (A * C + Math.sqrt(something)) / (A * A + B * B);
    let y1 = (C - A * x1) / B;
    let x2 = (A * C - Math.sqrt(something)) / (A * A + B * B);
    let y2 = (C - A * x2) / B;
    return [x1, y1, x2, y2];
  }

  assertColor(val, def_val) {
    ///such as 'red', 'rgb(200,100,123)'
    var re_colorrgb = /^rgb\((\d+)\,(\d+)\,(\d+)\)$/;
    var re_colorname = /^([A-Za-z]+)$/;
    var v = null;
    if (!val) {
      return def_val;
    }
    if ((v = re_colorrgb.exec(val)) !== null) {
      return [v[1],v[2],v[3]];
    } else if ((v = re_colorname.exec(val)) !== null) {
      return val;
    } else {
      return def_val;
    }
  }

  assertUnit(val) {
    var v = parseFloat(val);
    if (Number.isFinite(v)) {
      if (v < 1) {
        v = 1;
      }
      return v;
    } else {
      return this.def_unit;
    }
  }

  assertLength(val, def_val) {
    if (!val) {
      return def_val;
    }
    var re = /^([\d\.]+)(px|pt|mm|cm|in|)$/
    var v;
    if ((v = re.exec(val)) !== null) {
      var num = parseFloat(v[1]);
      if (!Number.isFinite(num)) {
        num = 0;
      }
      var unit = v[2];
      if (unit === '') {
        return num;
      }
      else if (unit === 'px') {
        return num;///SVG unit where 1px = 0.75pt
      }
      else if (unit==='pt'){
        return num*1.3333;
      }
      else if (unit==='mm'){
        return num*3.78;
      }
      else if (unit==='cm'){
        return num*37.8;
      }
      else if (unit==='in'){
        return num*96.0;
      }
      else {
        return num;
      }
    } else {
      return def_val;
    }
  }

  to360(val) {
    if (val < 0) {
      val += 360;
    } else if (val > 360) {
      val -= 360;
    }
    return val;
  }

  coords_to_string(coords) {
    ///***NOTE: returns [str,bad_vars]
    ///***NOTE: i.e: (1,2)..(2,3) ~ [z]
    /// pt[0]: [1,2]
    /// pt[1]: [2,3]
    /// pt[2]: [0,0,'z']
    var o = [];
    for(var i=0; i < coords.length; ++i) {
      var pt = coords[i];
      var x = pt[0];/// cannot do fix here because x could be a string
      var y = pt[1];/// cannot do fix here because x could be a string
      var join = pt[2];
      var hints = pt[12]||0;
      ///In case we have a CUBIC BEZIER curve, then pt1 and pt2 are the control points
      if (join == 'C') {
        var p1x = pt[3];/// CUBIC BEZIER curve controlpoint 1x
        var p1y = pt[4];/// CUBIC BEZIER curve controlpoint 1y
        var p2x = pt[5];/// CUBIC BEZIER curve controlpoint 2x
        var p2y = pt[6];/// CUBIC BEZIER curve controlpoint 2y
        o.push(`<C:${this.fix(p1x)},${this.fix(p1y)},${this.fix(p2x)},${this.fix(p2y)},${this.fix(x)},${this.fix(y)}>`);
      }
      else if (join == 'Q') {
        var p1x = pt[3];/// CUBIC BEZIER curve controlpoint 1x
        var p1y = pt[4];/// CUBIC BEZIER curve controlpoint 1y
        o.push(`<Q:${this.fix(p1x)},${this.fix(p1y)},${this.fix(x)},${this.fix(y)}>`);
      }
      else if (join == 'A') {
        var i3 = pt[7];/// Rx
        var i4 = pt[8];/// Ry
        var i5 = pt[9];/// angle
        var i6 = pt[10];/// bigarcflag
        var i7 = pt[11];/// sweepflag
        o.push(`<A:${this.fix(i3)},${this.fix(i4)},${this.fix(i5)},${this.fix(i6)},${this.fix(i7)},${this.fix(x)},${this.fix(y)}>`);
      }
      else if (join == 'L') {
        o.push(`<L:${this.fix(x)},${this.fix(y)}>`);
      }
      else if (join == 'z') {
        o.push(`<z>`);
      }
      else if (join == 'M') {
        o.push(`<M:${this.fix(x)},${this.fix(y)},${hints}>`);
      }
      else {
        o.push(`<>`);
      }
    }
    return o.join('');
  }

  floats_to_string(floats) {
    ///***NOTE: returns flaot float float ...
    ///***NOTE: i.e: 1 2 2 3 ...
    var s = '';
    for (var i in floats) {
      var num = floats[i];
      if(Number.isFinite(num)){
        var num = this.fix(num);
        s += ` ${num}`;
      }else{
        s += ` NaN`;
      }
    }
    return s.trim();
  }
  string_from_array(numbers) {
    var d = [];
    d = numbers.map((a) => a.toString()).map(s => `'${s}'`);
    return d.join(' ');
  }
  chart_to_string(p){
    var d = [];
    d.push(`x:${p.x}`);
    d.push(`y:${p.y}`);
    d.push(`w:${p.w}`);
    d.push(`h:${p.h}`);
    d.push(`xaxis:${p.xaxis}`);
    d.push(`yaxis:${p.yaxis}`);
    d.push(`xtick:${p.xtick}`);
    d.push(`ytick:${p.ytick}`);
    return d.join(' ');
  }
  car_to_string(p){
    var d = [];
    d.push(`xorigin:${p.xorigin}`);
    d.push(`yorigin:${p.yorigin}`);
    d.push(`xgrid:${p.xgrid}`);
    d.push(`ygrid:${p.ygrid}`);
    d.push(`xaxis:${p.xaxis}`);
    d.push(`yaxis:${p.yaxis}`);
    d.push(`xtick:${p.xtick}`);
    d.push(`ytick:${p.ytick}`);
    return d.join(' ');
  }
  node_to_string(p){
    //{x,y,r};
    var d = [];
    d.push(`id:${p.id}`);
    d.push(`x:${p.x}`);
    d.push(`y:${p.y}`);
    d.push(`r:${p.r}`);
    return d.join(' ');
  }

  box_to_string(p){
    //{x,y,w,h,rdx,rdy,boxtype};
    var d = [];
    d.push(`x:${p.x}`);
    d.push(`y:${p.y}`);
    d.push(`w:${p.w}`);
    d.push(`h:${p.h}`);
    d.push(`rdx:${p.rdx}`);
    d.push(`rdy:${p.rdy}`);
    d.push(`boxtype:${p.boxtype}`);
    return d.join(' ');
  }

  quadrilatic_bezier_to_cubic(P0,P1,P2) {
    var C0=[0,0];
    var C1=[0,0];
    var C2=[0,0];
    var C3=[0,0];
    C0 = this.PT(P0);
    C1 = this.AT(this.ST(1/3,P0), this.ST(2/3,P1));
    C2 = this.AT(this.ST(2/3,P1), this.ST(1/3,P2));
    C3 = this.PT(P2);
    return [C0,C1,C2,C3];
  }

  // return a two-element vector given a point (which could be more than one element)
  PT(v){
    return [v[0],v[1]];
  }
  // scale vector v by scalar
  ST(scalar,v){
    return [parseFloat(scalar)*parseFloat(v[0]),
            parseFloat(scalar)*parseFloat(v[1])];
  }
  // add two vectors v and w
  AT(v,w){
    return [parseFloat(v[0])+parseFloat(w[0]),
            parseFloat(v[1])+parseFloat(w[1])];
  }
  MIRROR(p,c){
    ///c is the mirror
    ///p is the point on one side of the mirror
    ///RETURN; the mirror point of 'p' with respect to 'c'
    var dx = c[0] - p[0];
    var dy = c[1] - p[1];
    var x = c[0] + dx;
    var y = c[1] + dy;
    return [x,y];
  }
  substitute_dollar_expressions(style,line,env){
    /// replace env variable before everything else
    const re_replace = /\$\{([A-Za-z][A-Za-z0-9]*)\}/g;
    line = line.replace(re_replace,(match,p1) => {
      if(env.hasOwnProperty(p1)){
        let x = env[p1];
        if(Array.isArray(x)){
          return this.string_from_array(x);
        }else if(x instanceof Complex){
          return x.toString();
        }else{
          return x;
        }
      }else{
        return match;
      }
    });
    return line;
  }
  do_shape_command(symbol,q,g,t,env){
    if(this.re_is_symbol_name.test(symbol)){
      if(this.my_shape_map.has(symbol)){
        var shape = this.my_shape_map.get(symbol);
      }else{
        var shape = [];
        this.my_shape_map.set(symbol,shape);
      }
      shape.push({q,g,t})
    }
  }
  do_path_command(symbol,coords,env){
    const re_sequencing = /^@\[(.*)\]$/;
    const re_destructuring = /\//;
    var v;
    ///check for sequencing "@[a,b,c]"
    if((v=re_sequencing.exec(symbol))!==null){
      var segs = v[1].split(',');
      var segs = segs.map((x) => x.trim());
      var i = parseInt(env['_'])||0;
      symbol = segs[i];
      if(this.re_is_symbol_name.test(symbol)){
        this.my_path_map.set(symbol, coords);
        this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
      }else{
        this.do_comment(`*** [ERROR] '${symbol}' is not a valid symbol name`);
      }
      return;
    }
    ///check for destructuring "a/b/c"
    if((v=re_destructuring.exec(symbol))!==null){
      var segs = symbol.split('/');
      var segs = segs.map((x) => x.trim());
      segs.forEach((x,i,arr) => {
        let q = [];
        if(i+1==arr.length){
          ///the last destructured symbol get all remaining points
          q = coords.slice(i);
        }else{
          q = coords.slice(i,i+1);
        }
        if (x.length==0){
          // skip and not an error
        }else if (this.re_is_symbol_name.test(x)) {
          this.my_path_map.set(x,q);
          this.do_comment(`*** path ${x} = ${this.coords_to_string(this.my_path_map.get(x))}`);
        }else{
          this.do_comment(`*** [ERROR] '${x}' is not a valid symbol name`);
        }
      });
      return;
    } 
    if(1){
      if(this.re_is_symbol_name.test(symbol)) {
        this.my_path_map.set(symbol, coords);
        this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
      }else{
        this.do_comment(`*** [ERROR] '${symbol}' is not a valid symbol name`);
      }
      return;
    }
  }

  toLinecap(s) {
    s = s || 'butt';
    if (s === 'butt'||
        s === 'round'||
        s === 'square') {
      return s;
    }
    return 'butt';
  }

  toLinejoin(s) {
    s = s || 'miter';
    if (s === 'miter'||
        s === 'bevel'||
        s === 'round') {
      return s;
    }
    return 'miter';
  }

  toLinedashed(s) {
    s = s || '';
    if (s === ''||
        s === 'evenly'||
        s === 'withdots') {
      return s;
    }
    return '';
  }

  shiftcoords(coords,dx,dy) {
    var s = [];
    for( let [x,y,join,x1,y1,x2,y2] of coords ) {
      if (join=='z'||join=='nan') {
        s.push([x,y,join,x1,y1,x2,y2]);
      } else {
        x += dx;
        y += dy;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;
        s.push([x,y,join,x1,y1,x2,y2]);
      }
    }
    return s;
  }
  do_lego(opts,g,txts,coords) {
    var o = [];
    var id = 0;
    if (!this.my_lego[id]) {
      this.my_lego[id] = {};
      var A = this.my_lego[id];
      A.origin_x = 0;
      A.origin_y = 0;
      A.wx = 0.36;
      A.wy = 0.3;
      A.wh = 1.0;
      A.perspective = '';
      A.all = new Set();
    }
    var A = this.my_lego[id];
    var subcmd = opts.shift();
    switch( subcmd ) {
      case 'size'://LEGO
        // \lego.size.4.4.4      
        A.max_x = this.assert_float(opts[0],0);
        A.max_y = this.assert_float(opts[1],0);
        A.max_z = this.assert_float(opts[2],0);
        break;

      case 'clear'://LEGO
        A.all.clear();
        break;

      case 'add'://LEGO
        var opt = opts.shift();
        if(opt=='all'){
          for(var z=1; z <= A.max_z; z++) {
            for(var x=1; x <= A.max_x; x++) {
              for(var y=1; y <= A.max_y; y++) {
                var key = `${x}/${y}/${z}`;
                A.all.add(key);
              }
            }
          }
        }
        else if(opt=='z'){
          var z = opts.shift();
          if(z >= 1 && z <= A.max_z) {
            for(var y=1; y <= A.max_y; y++) {
              for(var x=1; x <= A.max_x; x++) {
                var key = `${x}/${y}/${z}`;
                A.all.add(key);
              }
            }
          }
        }
        else if(opt=='xyz'){
          var x = this.assert_float(opts[0]);
          var y = this.assert_float(opts[1]);
          var z = this.assert_float(opts[2]);
          var key = `${x}/${y}/${z}`;
          A.all.add(key);
        }
        break;

      case 'del'://LEGO
        opt = opts.shift();
        if(opt=='xy'){
          var x = this.assert_float(opts[0]);
          var y = this.assert_float(opts[1]);
          for(var z=1; z <= A.max_z; x++){
            var key = `${x}/${y}/${z}`;
            if(A.all.has(key)){
              A.all.delete(key);
            }
          }
        }
        else if(opt=='yz'){
          var y = this.assert_float(opts[0]);
          var z = this.assert_float(opts[1]);
          for(var x=1; x <= A.max_x; x++){
            var key = `${x}/${y}/${z}`;
            if(A.all.has(key)){
              A.all.delete(key);
            }
          }
        }
        else if(opt=='zx'){
          var z = this.assert_float(opts[0]);
          var x = this.assert_float(opts[1]);
          for(var y=1; y <= A.max_y; y++){
            var key = `${x}/${y}/${z}`;
            if(A.all.has(key)){
              A.all.delete(key);
            }
          }
        }
        else if(opt=='xyz'){
          var x = this.assert_float(opts[0]);
          var y = this.assert_float(opts[1]);
          var z = this.assert_float(opts[2]);
          var key = `${x}/${y}/${z}`;
          if(A.all.has(key)){
            A.all.delete(key);
          }
        }
        break;

      case 'show2'://LEGO
        var skew = this.g_to_skew_string(g);
        var skews = this.string_to_array(skew);
        var wx = this.assert_float(skews[0],0.8 );
        var wy = this.assert_float(skews[1],0.45 );
        var wh = this.assert_float(skews[2],0.7 );
        var max_z = A.max_z;
        var max_y = A.max_y;
        var max_x = A.max_x;
        ///construct path for single cube
        A.q1 = [[0,wh,'M'],[0-wx,wh-wy,'L'],[0,wh-wy-wh,'L'],[0+wx,wh-wy,'L'],[0,0,'z']];//top
        A.q2 = [[0-wx,0-wy,'M'],[0-wx,wh-wy,'L'],[0,wh-wy-wy,'L'],[0,0-wy-wy,'L'],[0,0,'z']];//left
        A.q3 = [[0+wx,0-wy,'M'],[0+wx,wh-wy,'L'],[0,wh-wy-wy,'L'],[0,0-wy-wy,'L'],[0,0,'z']];//right
        ///export commands for each cube
        for(var j=0; j < coords.length; ++j){
          var pt = this.point_at(coords, j);
          if(!this.is_valid_point(pt)) continue;
          var origin_x = pt[0];
          var origin_y = pt[1];  
          for(var z=1; z <= max_z; z++) {
            for(var x=1; x <= max_x; x++) {
              for(var y=1; y <= max_y; y++) {
                var key = `${x}/${y}/${z}`;
                if(A.all.has(key)){
                  var q = A.q;
                  var offsetx = origin_x + ((y-1)*wx) - ((x-1)*wx);
                  var offsety = origin_y - ((x-1)*wy) - ((y-1)*wy) + ((z-1)*wh);
                  if(1){
                    var q = A.q1;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    let g1 = this.update_g_hints(g,this.hint_lighter);
                    o.push(this.p_drawpath(q,g1));
                  }
                  if(1){
                    var q = A.q2;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    o.push(this.p_drawpath(q,g));

                  }
                  if(1){
                    var q = A.q3;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    let g1 = this.update_g_hints(g,this.hint_darker);
                    o.push(this.p_drawpath(q,g1));

                  }
                }
              }
            }
          }
        }
        break;

      case 'show'://LEGO
        var skew = this.g_to_skew_string(g);
        var skews = this.string_to_array(skew);
        var wx = this.assert_float(skews[0],0.36);
        var wy = this.assert_float(skews[1],0.30);
        var ww = this.assert_float(skews[2],1.00);
        var wh = this.assert_float(skews[3],0.90);
        var max_z = A.max_z;
        var max_y = A.max_y;
        var max_x = A.max_x;
        ///construct path for each cube
        A.q1 = [[0,wh,'M'],[ww,wh,'L'],[ww-wx,wh-wy,'L'],[0-wx,wh-wy,'L'],[0,0,'z']];//top
        A.q2 = [[ww,wh,'M'],[ww,0,'L'],[ww-wx,0-wy,'L'],[ww-wx,wh-wy,'L'],[0,0,'z']];//side
        A.q3 = [[0-wx,0-wy,'M'],[0-wx,wh-wy,'L'],[ww-wx,wh-wy,'L'],[ww-wx,0-wy,'L'],[0,0,'z']];//front
        ///export commands for each cube
        for(var j=0; j < coords.length; ++j){
          var pt = this.point_at(coords, j);
          if(!this.is_valid_point(pt)) continue;
          var origin_x = pt[0];
          var origin_y = pt[1];
          for(var z=1; z <= max_z; z++) {
            for(var x=1; x <= max_x; x++) {
              for(var y=1; y <= max_y; y++) {
                var key = `${x}/${y}/${z}`;
                if(A.all.has(key)){
                  var q = A.q;
                  var offsetx = origin_x + ((y-1)*ww) - ((x-1)*wx);
                  var offsety = origin_y - ((x-1)*wy) + ((z-1)*wh);
                  if(1){
                    //top
                    var q = A.q1;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    o.push(this.p_drawpath(q,g));
                  }
                  if(1){
                    //side
                    var q = A.q2;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    let g1 = this.update_g_hints(g,this.hint_darker);
                    o.push(this.p_drawpath(q,g1));
                  }
                  if(1){
                    //side
                    var q = A.q3;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    let g1 = this.update_g_hints(g,this.hint_lighter);
                    o.push(this.p_drawpath(q,g1));
                  }
                }
              }
            }
          }
        }
        break;

      default:
        break;
    }
    
    return o.join('\n');
  }

  do_trump(opts,g,txts,coords) {
    var o = [];
    var [subcmd,subsubcmd] = opts;
    var mypath;
    var mycolor;
    switch( subcmd ) {
      case 'diamond': {
        mypath = this.name_to_path_string('diamond');
        mycolor = 'red';
        break;
      }
      case 'heart': {
        mypath = this.name_to_path_string('heart');
        mycolor = 'red';
        break;
      }
      case 'club': {
        mypath = this.name_to_path_string('club');
        mycolor = 'black';
        break;
      }
      case 'spade': {
        mypath = this.name_to_path_string('spade');
        mycolor = 'black';
        break;
      }
    }
    if(mypath && subsubcmd){
      for(let j=0; j < coords.length; ++j){
        let pt = this.point_at(coords, j);
        if (!this.is_valid_point(pt)) continue;
        let x = pt[0];
        let y = pt[1];
        let d = subsubcmd;//'1', '2', '3', '4', ... '10', 'A', 'J', 'Q', 'K'
        o.push(this.to_trump_card(x,y,mypath,d,g,mycolor));
      }
    }
    return o.join('\n')
  }
  do_image(opt,x,y,w,h,g,txts){
    var o = [];
    var labels = txts.map(p=>p.label);
    var imgsrc = this.translator.choose_image_file(labels);
    o.push(this.p_image(x,y,w,h,opt,imgsrc,g));
    return o.join('\n');
  }
  do_header(opt,x,y,w,h,g,txts){
    var o = [];
    var {label,tx,ty} = this.fetch_label_at(txts,0,g);
    o.push(this.p_header(opt,x+tx,y+ty,w,h,label,g));
    return o.join('\n');
  }
  do_footer(opt,x,y,w,h,g,txts){
    var o = [];
    var {label,tx,ty} = this.fetch_label_at(txts,0,g);
    o.push(this.p_footer(opt,x+tx,y+ty,w,h,label,g));
    return o.join('\n');
  }
  do_drawlabel(opts,g,txts,coords){
    var o = [];
    var shift = this.g_to_shift_float(g);
    for (var j = 0; j < coords.length; ++j){
      var pt = this.point_at(coords, j);
      if (!this.is_valid_point(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      var {label,tx,ty} = this.fetch_label_at(txts,j,g);
      var opt = this.fetch_opt_at(opts,j,g);
      var ta = this.assert_ta(opt);
      var [x,y] = this.radial_shift_pt(shift,ta,x,y);
      o.push(this.p_label(x+tx,y+ty,label,ta,g));
    }
    return o.join('\n');
  }
  do_drawpango(opts,g,txts,coords){
    var ta = this.assert_ta(opts[0]);
    var {label,tx,ty} = this.fetch_label_at(txts,0,g);
    var o = [];
    var extent = this.g_to_extent_float(g);
    for (var i = 0; i < coords.length; ++i){
      var pt = this.point_at(coords, i);
      if (!this.is_valid_point(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      o.push(this.p_cairo(x+tx,y+ty,label,extent,g));
    }
    return o.join('\n');
  }


  do_drawcontrolpoints(opts,g,txts,coords){    
    var o = [];
    for (var i = 0; i < coords.length; i++) {
      var pt0 = this.point_at(coords, i-1);
      var pt1 = this.point_at(coords, i);
      if (!this.is_valid_point(pt1)) continue;
      var join = pt1[2];
      var i3 = (pt1[3]);
      var i4 = (pt1[4]);
      var i5 = (pt1[5]);
      var i6 = (pt1[6]);
      var x = pt1[0];
      var y = pt1[1];
      if (join==='C') {
        o.push(this.p_dot_circle(i3,i4,g));
        o.push(this.p_dot_circle(i5,i6,g));
        o.push(this.p_dot_square(x,y,g));
        if(this.is_valid_point(pt0)){
          let x0 = pt0[0];
          let y0 = pt0[1];
          o.push(this.p_dot_square(x0,y0,g));
        }
      } if (join==='Q') {
        o.push(this.p_dot_circle(i3,i4,g));
        o.push(this.p_dot_square(x,y,g));
        if(this.is_valid_point(pt0)){
          let x0 = pt0[0];
          let y0 = pt0[1];
          o.push(this.p_dot_square(x0,y0,g));
        }
      }
    }
    return o.join('\n');
  }
  do_drawanglearc(opts,g,txts,coords){
    var [opt] = opts;
    var o = [];
    var r = this.g_to_r_float(g);
    var shift = this.g_to_shift_float(g);
    var inversed = this.g_to_inversed_int(g);
    let linesegs = this.get_linesegs(coords);
    for(var j=0; j < linesegs.length; ++j){
      var lineseg1 = linesegs[j];
      var lineseg2 = linesegs[j+1]||linesegs[0];
      var {label,tx,ty} = this.fetch_label_at(txts,j,g);
      var p0 = lineseg1.q0;
      var p1 = lineseg1.q1;
      var q0 = lineseg2.q0;
      var q1 = lineseg2.q1;
      if(this.is_valid_point(p0)&&this.is_valid_point(p1)&&this.is_valid_point(q0)&&this.is_valid_point(q1)&&this.is_same_pt(p1,q0)){
        if(inversed){
          var z0 = p1;
          var z2 = p0;
          var z1 = q1;
        }else{
          var z0 = p1;
          var z1 = p0;
          var z2 = q1;
        }
        // start drawing anglearc
        var x0 = z0[0];
        var y0 = z0[1];
        var dx1 = z1[0] - z0[0];
        var dy1 = z1[1] - z0[1];
        var dx2 = z2[0] - z0[0];
        var dy2 = z2[1] - z0[1];
        var ang1 = Math.atan2(dy1, dx1) / Math.PI * 180;
        var ang2 = Math.atan2(dy2, dx2) / Math.PI * 180;
        if (ang1 < 0) { ang1 += 360; }
        if (ang2 < 0) { ang2 += 360; }
        if (ang2 < ang1) { ang2 += 360; }
        var angledelta = ang2 - ang1;
        if (opt=='sq') {
          //if the angledelta is 90 we draw a square and reduce r by sqrt(2)
          var r1 = r/1.414;
          var x1 = x0 + r1*Math.cos(ang1 / 180 * Math.PI);
          var y1 = y0 + r1*Math.sin(ang1 / 180 * Math.PI);
          var x2 = x0 + r1*Math.cos(ang2 / 180 * Math.PI);
          var y2 = y0 + r1*Math.sin(ang2 / 180 * Math.PI);
          var xc = x0 + r1*Math.cos((ang1+ang2)/2/180*Math.PI)*1.414;
          var yc = y0 + r1*Math.sin((ang1+ang2)/2/180*Math.PI)*1.414;
          var mycoords = [];
          mycoords.push([x1,y1,'M']);
          mycoords.push([xc,yc,'L']);
          mycoords.push([x2,y2,'L']);
          o.push(this.p_strokepath(mycoords,g));
        } else {
          if(this.g_to_fillonly_int(g)){
            let g1 = this.update_g_hints(g,this.hint_nostroke);
            let q = this.to_q_pie(x0,y0,r,ang1,angledelta);
            o.push(this.p_drawpath(q,g1));  
          }else{
            let q = this.to_q_arc(x0,y0,r,ang1,angledelta);
            o.push(this.p_strokepath(q,g));
          }
        }
        if (label) {
          var ang = ang1+angledelta/2;
          if (ang > 360) {
            ang -= 360;
          }
          var labelx = x0 + (r+shift) * Math.cos(ang / 180 * Math.PI);
          var labely = y0 + (r+shift) * Math.sin(ang / 180 * Math.PI);
          o.push(this.p_label(labelx+tx,labely+ty,label,'c',g));
        }
      }
    }
    return o.join('\n');
  }
  do_drawanglemark(opts,g,txts,coords){
    var [opt] = opts;
    var o = [];
    var r = this.g_to_r_float(g);
    let gap = this.get_float_prop(g,'gap',0.15);
    let bartype = this.get_string_prop(g,'bartype');
    var inversed = this.g_to_inversed_int(g);
    let linesegs = this.get_linesegs(coords);
    for(var j=0; j < linesegs.length; ++j){
      var lineseg1 = linesegs[j];
      var lineseg2 = linesegs[j+1]||linesegs[0];
      var {label,tx,ty} = this.fetch_label_at(txts,j,g);
      var p0 = lineseg1.q0;
      var p1 = lineseg1.q1;
      var q0 = lineseg2.q0;
      var q1 = lineseg2.q1;
      if(this.is_valid_point(p0)&&this.is_valid_point(p1)&&this.is_valid_point(q0)&&this.is_valid_point(q1)&&this.is_same_pt(p1,q0)){
        if(inversed){
          var z0 = p1;
          var z2 = p0;
          var z1 = q1;
        }else{
          var z0 = p1;
          var z1 = p0;
          var z2 = q1;
        }
        // start drawing anglearc
        var x0 = z0[0];
        var y0 = z0[1];
        var dx1 = z1[0] - z0[0];
        var dy1 = z1[1] - z0[1];
        var dx2 = z2[0] - z0[0];
        var dy2 = z2[1] - z0[1];
        var ang1 = Math.atan2(dy1, dx1) / Math.PI * 180;
        var ang2 = Math.atan2(dy2, dx2) / Math.PI * 180;
        if (ang1 < 0) { ang1 += 360; }
        if (ang2 < 0) { ang2 += 360; }
        if (ang2 < ang1) { ang2 += 360; }
        var angledelta = ang2 - ang1;
        if(bartype=='triple'){
          let q3 = this.to_q_arc(x0,y0,r+gap+gap,ang1,angledelta);
          let q2 = this.to_q_arc(x0,y0,r+gap,ang1,angledelta);
          let q1 = this.to_q_arc(x0,y0,r,ang1,angledelta);
          o.push(this.p_strokepath(q3,g));
          o.push(this.p_strokepath(q2,g));
          o.push(this.p_strokepath(q1,g));
        }else if(bartype=='double'){
          let q2 = this.to_q_arc(x0,y0,r+gap,ang1,angledelta);
          let q1 = this.to_q_arc(x0,y0,r,ang1,angledelta);
          o.push(this.p_strokepath(q2,g));
          o.push(this.p_strokepath(q1,g));
        }else{
          let q1 = this.to_q_arc(x0,y0,r,ang1,angledelta);
          o.push(this.p_strokepath(q1,g));
        }
      }
    }
    return o.join('\n');
  }
  do_drawcongbar(opts,g,txts,coords){
    var o = [];
    let magni = this.g_to_barlength_float(g)/2;
    let gap = this.get_float_prop(g,'gap',0.15);
    let bartype = this.get_string_prop(g,'bartype');
    let linesegs = this.get_linesegs(coords);
    for(var j=0; j < linesegs.length; ++j){
      var lineseg = linesegs[j];
      var z0 = lineseg.q0;
      var z1 = lineseg.q1;
      if(this.is_valid_point(z0)&&this.is_valid_point(z1)){
        let z0x = parseFloat(z0[0]);
        let z0y = parseFloat(z0[1]);
        let z1x = parseFloat(z1[0]);
        let z1y = parseFloat(z1[1]);
        let dy = z1y - z0y;
        let dx = z1x - z0x;
        let angle = Math.atan2(dy,dx);
        let angle0 = angle + this.deg_to_rad(90);
        let angle1 = angle - this.deg_to_rad(90);
        let cx = (z0x + z1x)*0.5;
        let cy = (z0y + z1y)*0.5;
        //following are for triple-bar
        let cxup = cx + gap*Math.cos(angle);
        let cyup = cy + gap*Math.sin(angle);
        let cxdw = cx - gap*Math.cos(angle);
        let cydw = cy - gap*Math.sin(angle);
        //following are for double-bar
        let cxU = (cx + cxup)*0.5;
        let cyU = (cy + cyup)*0.5;
        let cxD = (cx + cxdw)*0.5;
        let cyD = (cy + cydw)*0.5;
        if(this.isvalidnum(z0x,z0y,z1x,z1y)){
          if(bartype=='triple'){
            ///triple-bar
            let pt0x = cx + magni*Math.cos(angle0);
            let pt0y = cy + magni*Math.sin(angle0);
            let pt1x = cx + magni*Math.cos(angle1);
            let pt1y = cy + magni*Math.sin(angle1);
            o.push(this.p_line(pt0x,pt0y,pt1x,pt1y,g));
            pt0x = cxup + magni*Math.cos(angle0);
            pt0y = cyup + magni*Math.sin(angle0);
            pt1x = cxup + magni*Math.cos(angle1);
            pt1y = cyup + magni*Math.sin(angle1);
            o.push(this.p_line(pt0x,pt0y,pt1x,pt1y,g));
            pt0x = cxdw + magni*Math.cos(angle0);
            pt0y = cydw + magni*Math.sin(angle0);
            pt1x = cxdw + magni*Math.cos(angle1);
            pt1y = cydw + magni*Math.sin(angle1);
            o.push(this.p_line(pt0x,pt0y,pt1x,pt1y,g));
            
          }else if(bartype=='double'){
            ///double-bar
            let pt0x = cxU + magni*Math.cos(angle0);
            let pt0y = cyU + magni*Math.sin(angle0);
            let pt1x = cxU + magni*Math.cos(angle1);
            let pt1y = cyU + magni*Math.sin(angle1);
            o.push(this.p_line(pt0x,pt0y,pt1x,pt1y,g));
            pt0x = cxD + magni*Math.cos(angle0);
            pt0y = cyD + magni*Math.sin(angle0);
            pt1x = cxD + magni*Math.cos(angle1);
            pt1y = cyD + magni*Math.sin(angle1);
            o.push(this.p_line(pt0x,pt0y,pt1x,pt1y,g));
          }else{
            ///single
            let cx = (z0x + z1x)*0.5;
            let cy = (z0y + z1y)*0.5;
            let pt0x = cx + magni*Math.cos(angle0);
            let pt0y = cy + magni*Math.sin(angle0);
            let pt1x = cx + magni*Math.cos(angle1);
            let pt1y = cy + magni*Math.sin(angle1);
            o.push(this.p_line(pt0x,pt0y,pt1x,pt1y,g));
          }
        }
      }
    }
    return o.join('\n');
  }
  do_drawcenteredlabel(opts,g,txts,coords){
    var shift = this.g_to_shift_float(g);
    var linesegs = this.get_linesegs(coords);
    var o = [];
    for(var j=0; j < linesegs.length; j++){
      var lineseg = linesegs[j];
      var {label,tx,ty} = this.fetch_label_at(txts,j,g);
      var [x1,y1] = lineseg.q0;
      var [x2,y2] = lineseg.q1;
      var x = (x1 + x2)*0.5;
      var y = (y1 + y2)*0.5;
      if(shift){
        [x,y] = this.lateral_shift_pt(shift, x1,y1, x,y, x2,y2);
      }
      var ta = this.fetch_opt_at(opts,j,g);
      if(!ta){
        ta = 'c';
      }
      o.push(this.p_label(x+tx,y+ty,label,ta,g));
    }
    return o.join('\n');
  }
  do_drawslopedlabel(opts,g,txts,coords){
    var ta = opts[0]||'';
    var o = [];
    var mar = this.g_to_mar_float(g);
    var pen = this.g_to_pen_float(g);
    var linesegs = this.get_linesegs(coords);
    var shift = this.g_to_shift_float(g);
    for (var j = 0; j < linesegs.length; ++j){
      var lineseg = linesegs[j];
      var x1 = lineseg.q0[0];
      var y1 = lineseg.q0[1];
      var x2 = lineseg.q1[0];
      var y2 = lineseg.q1[1];
      let [x1_,y1_] = this.lateral_shift_pt(shift, x1,y1, x1,y1, x2,y2);
      let [x2_,y2_] = this.lateral_shift_pt(shift, x1,y1, x2,y2, x2,y2);
      var {label,tx,ty} = this.fetch_label_at(txts,j,g);
      x1 = x1_;
      y1 = y1_;
      x2 = x2_;
      y2 = y2_;
      o.push(this.p_slopedlabel(x1_+tx,y1_+ty,x2_+tx,y2_+ty,label,ta,g));
      if(mar){
        let ang = Math.atan2(y2-y1,x2-x1);
        // var xt = mar*Math.cos(ang) + x1;
        // var yt = mar*Math.sin(ang) + y1;
        // var R = this.g_to_fontsize_float(g)*this.PT_TO_MM/this.viewport_unit/2;
        // var X1 = x1 + R*Math.cos(ang2);
        // var Y1 = y1 + R*Math.sin(ang2);
        // var Xt = xt + R*Math.cos(ang2);
        // var Yt = yt + R*Math.sin(ang2);
        o.push(this.p_line(x1,y1,x1+mar*Math.cos(ang),y1+mar*Math.sin(ang),{...g,arrowhead:2}));
        if(pen){
          //left pen
          o.push(this.p_line(x1,y1,x1+pen*Math.cos(ang+Math.PI/2),y1+pen*Math.sin(ang+Math.PI/2),g));
          o.push(this.p_line(x1,y1,x1-pen*Math.cos(ang+Math.PI/2),y1-pen*Math.sin(ang+Math.PI/2),g));
        }
      }
      if(mar){
        let ang = Math.atan2(y1-y2,x1-x2);
        // var xt = mar*Math.cos(ang) + x2;
        // var yt = mar*Math.sin(ang) + y2;
        // var R = this.g_to_fontsize_float(g)*this.PT_TO_MM/this.viewport_unit/2;
        // var X2 = x2 + R*Math.cos(ang2);
        // var Y2 = y2 + R*Math.sin(ang2);
        // var Xt = xt + R*Math.cos(ang2);
        // var Yt = yt + R*Math.sin(ang2);
        o.push(this.p_line(x2,y2,x2+mar*Math.cos(ang),y2+mar*Math.sin(ang),{...g,arrowhead:2}));
        if(pen){
          //right pen
          o.push(this.p_line(x2,y2,x2+pen*Math.cos(ang+Math.PI/2),y2+pen*Math.sin(ang+Math.PI/2),g));
          o.push(this.p_line(x2,y2,x2-pen*Math.cos(ang+Math.PI/2),y2-pen*Math.sin(ang+Math.PI/2),g));
        }
      }
    }
    return o.join('\n');
  }
  do_drawtabulatedlabel(opts,g,txts,coords){
    ///drawtabulatedlabel {shift:-1} "1\\2\\3" "a\\b\\c" "A\\B\\C" (0,0) <h:+2> <h:+2>
    var o = [];
    var shift = this.g_to_shift_float(g);
    for (var j=0; j < coords.length; j++){
      var pt = this.point_at(coords,j);
      var ta = opts[j]||'';
      if(!this.is_valid_point(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      let {label,tx,ty} = this.fetch_label_at(txts,j,g);
      let labels = label.split('\\\\');
      labels.forEach((s,i) => {
        let px = x;
        let py = y + i*shift;
        o.push(this.p_label(px+tx,py+ty,s,ta,g));
      });
    }
    return o.join('\n');
  }
  do_chart(opts,g,txts,coords){
    var all = [];
    var xaxis  = this.g_to_xaxis_string(g);
    var yaxis  = this.g_to_yaxis_string(g);
    var xtick = this.g_to_xtick_string(g);
    var ytick = this.g_to_ytick_string(g);
    var w = this.g_to_w_float(g);
    var h = this.g_to_h_float(g);
    var showgrid = this.g_to_showgrid_int(g);
    var xarr = this.string_to_array(xaxis);
    var yarr = this.string_to_array(yaxis);
    var xmin = this.assert_float(xarr[0],0);
    var xmax = this.assert_float(xarr[1],1);
    var ymin = this.assert_float(yarr[0],0);
    var ymax = this.assert_float(yarr[1],1);
    for (var j = 0; j < coords.length; j++) {
      var pt = this.point_at(coords,j);
      if(!this.is_valid_point(pt)) continue;
      var id = opts[j]||'';
      var x = pt[0];
      var y = pt[1];
      var p = {x,y,xmin,xmax,ymin,ymax,xtick,ytick,w,h};
      if(id){
        this.my_chart_map.set(id,p);
        this.do_comment(`*** [chart.${id}] ${this.chart_to_string(p)}`);
      }else{
        this.do_comment(`*** [chart] ${this.chart_to_string(p)}`);
      }
      all.push({...p,id})
    }
    ///no coords is specified, redraw the old nodes
    if(coords.length==0){
      for(var id of opts){
        if(id && this.my_chart_map.has(id)){
          var p = this.my_chart_map.get(id);
          all.push({...p,id});///make sure shadow setting is excluded, because we don't want to redraw the shadow
        }
      }
    }
    /// start to draw chart
    var o = [];
    all.forEach((one,j,arr) => {
      let {x,y,xmin,xmax,ymin,ymax,xtick,ytick,w,h,id} = one;
      if(1){
        var p = [];
        p.push([x,y,'M']);
        p.push([x+w,y,'L']);
        p.push([x+w,y+h,'L']);
        p.push([x,y+h,'L']);
        p.push([0,0,'z']);
        o.push(this.p_strokepath(p,g));
        if(xtick){
          let labels = this.string_to_array(xtick);
          for(let label of labels){
            let a = parseFloat(label);
            if(Number.isFinite(a)){
              let px = x + (a-xmin)/(xmax-xmin)*w;
              let py = y;
              o.push(this.p_tvbar(px,py,g));
              o.push(this.p_text(px,py,label,'b',g));
              if(showgrid){
                o.push(this.p_line(px,py,px,py+h,g));
              }
            }
          }
        }
        if(ytick){
          let labels = this.string_to_array(ytick);
          for(let label of labels){
            let a = parseFloat(label);
            if(Number.isFinite(a)){
              let py = y + (a-ymin)/(ymax-ymin)*h;
              let px = x;
              o.push(this.p_rhbar(px,py,g));
              o.push(this.p_text(px,py,label,'l',g));
              if(showgrid){
                o.push(this.p_line(px,py,px+w,py,g));
              }
            }
          }
        }
      }
    })
    return o.join('\n');
  }
  do_car(opts,g,txts,coords){
    var all = [];
    var xgrid = this.g_to_xgrid_float(g);
    var ygrid = this.g_to_ygrid_float(g);
    var xaxis = this.g_to_xaxis_string(g);
    var yaxis = this.g_to_yaxis_string(g);
    var xtick = this.g_to_xtick_string(g);
    var ytick = this.g_to_ytick_string(g);
    var showgrid = this.g_to_showgrid_int(g);
    let ssx = this.string_to_array(xaxis).map(x=>parseFloat(x))
    let xmin = this.assert_float(ssx[0],0);
    let xmax = this.assert_float(ssx[1],0);
    let xarr = this.assert_float(ssx[2],0);
    let ssy = this.string_to_array(yaxis).map(y=>parseFloat(y))
    let ymin = this.assert_float(ssy[0],0);
    let ymax = this.assert_float(ssy[1],0);
    let yarr = this.assert_float(ssy[2],0);
    for (var j = 0; j < coords.length; j++) {
      var pt = this.point_at(coords,j);
      if(!this.is_valid_point(pt)) continue;
      var id = opts[j]||'';
      var xorigin = pt[0];
      var yorigin = pt[1];
      var p = {xorigin,yorigin,xgrid,ygrid,xaxis,yaxis,xtick,ytick,xmin,xmax,xarr,ymin,ymax,yarr};
      if(id){
        this.my_car_map.set(id,p);
        this.do_comment(`*** car.${id} ${this.car_to_string(p)}`);
      }else{
        this.do_comment(`*** car ${this.car_to_string(p)}`);
      }
      all.push({...p,id})
    }
    ///no coords is specified, redraw the old nodes
    if(coords.length==0){
      for(var id of opts){
        if(id && this.my_car_map.has(id)){
          var p = this.my_car_map.get(id);
          all.push({...p,id});///make sure shadow setting is excluded, because we don't want to redraw the shadow
        }
      }
    }
    /// start to draw
    var o = [];
    all.forEach((one,j,arr) => {
      let {xorigin,yorigin,xgrid,ygrid,xaxis,yaxis,xtick,ytick,id} = one;
      ///draw xaxis.
      if(xtick){
        let ssx = this.string_to_array(xtick);
        for(let label of ssx){
          let num = parseFloat(label);
          if(Number.isFinite(num)){
            let px = xorigin + num/xgrid;
            let py = yorigin
            if(showgrid){//for p_car
              let ssy = this.string_to_float_array(ytick);
              if(ssy.length>=2){
                let sy0 = ssy[0];
                let sy1 = ssy[ssy.length-1];
                let g1 = this.update_g_hints(g,this.hint_grid);
                o.push(this.p_line(px,py+sy0/ygrid,px,py+sy1/ygrid,g1));
              }
            }
            o.push(this.p_tvbar(px,py,g));
            o.push(this.p_text(px,py,label,'b',g));
          }
        }
      }
      if(ytick){
        let ssy = this.string_to_array(ytick);
        for(let label of ssy){
          let num = parseFloat(label);
          if(Number.isFinite(num)){
            let px = xorigin;
            let py = yorigin + num/ygrid;
            if(showgrid){//for p_car
              let ssx = this.string_to_float_array(xtick);
              if(ssx.length>=2){
                let sx0 = ssx[0];
                let sx1 = ssx[ssx.length-1];
                let g1 = this.update_g_hints(g,this.hint_grid);
                o.push(this.p_line(px+sx0/xgrid,py,px+sx1/xgrid,py,g1));
              }
            }
            o.push(this.p_rhbar(px,py,g));
            o.push(this.p_text(px,py,label,'l',g));
          }
        }
      }
      if(xaxis){
        let ss = this.string_to_array(xaxis);
        let x1 = this.assert_float(ss[0],0);
        let x2 = this.assert_float(ss[1],0);
        let arrowhead = this.assert_float(ss[2],0);
        x1 /= xgrid;
        x2 /= xgrid;
        x1 += xorigin;
        x2 += xorigin;
        let y1 = yorigin;
        let y2 = yorigin;
        //draw axis after grid
        let p = [];
        p.push([x1,y1,'M']);
        p.push([x2,y2,'L']);
        if(arrowhead==3){
          o.push(this.p_dblarrow(p,g));
        }else if(arrowhead==2){
          o.push(this.p_revarrow(p,g));
        }else if(arrowhead==1){
          o.push(this.p_arrow(p,g));
        }else{
          o.push(this.p_strokepath(p,g));
        }
      }
      if(yaxis){
        let ss = this.string_to_array(yaxis);
        let y1 = this.assert_float(ss[0],0);
        let y2 = this.assert_float(ss[1],0);
        let arrowhead = this.assert_float(ss[2],0);
        y1 /= ygrid;
        y2 /= ygrid;
        y1 += yorigin;
        y2 += yorigin;
        let x1 = xorigin;
        let x2 = xorigin;
        //draw axis after grid
        let p = [];
        p.push([x1,y1,'M']);
        p.push([x2,y2,'L']);
        if(arrowhead==3){
          o.push(this.p_dblarrow(p,g));
        }else if(arrowhead==2){
          o.push(this.p_revarrow(p,g));
        }else if(arrowhead==1){
          o.push(this.p_arrow(p,g));
        }else{
          o.push(this.p_strokepath(p,g));
        }
      }
    })
    return o.join('\n');
  }
  do_node(opts,g,txts,coords){
    var all = [];
    var showid = this.g_to_showid_int(g);
    var nodetype = this.g_to_nodetype_string(g);
    var r = this.g_to_r_float(g);
    var x = 0;
    var y = 0;
    var label = '';
    var tx = 0;
    var ty = 0;
    ///no coords is specified, redraw the old nodes
    opts.forEach((id,j,arr)=>{
      //pull 'id' out of 'my_node_map'
      if(id && this.my_node_map.has(id)){
        var p = this.my_node_map.get(id);
        all.push(p);
      }else if(id){
        var p = {x,y,r,label,id,tx,ty,nodetype};
        this.my_node_map.set(id,p);
        all.push(p);
      }else{
        var p = null;
      }
      if(p){
        if(j < coords.length){
          var pt = this.point_at(coords,j);
          if(this.is_valid_point(pt)){
            p.x = pt[0];
            p.y = pt[1];
          }
        }
        if(j < txts.length){
          let {label,tx,ty} = this.fetch_label_at(txts,j,g);
          p.label = label; 
          p.tx = tx; 
          p.ty = ty; 
        }
        this.do_comment(`*** node ${this.node_to_string(p)}`);
      }
    });
    /// start to draw
    var o = [];
    all.forEach((one,j,arr) => {
      let {x,y,r,id,label,tx,ty,nodetype} = one;
      let q = null;
      if(nodetype=='RREC'){
        q = this.to_q_RREC(x-r,y-r,r+r,r+r);
      }else if(nodetype=='RECT'){
        q = this.to_q_RECT(x-r,y-r,r+r,r+r);
      }else{
        q = this.to_q_ELLI(x-r,y-r,r+r,r+r);
      }
      o.push(this.p_drawpath(q,g));
      if(showid){
        label = id;
        tx = 0;
        ty = 0;
      }else{
        //var {label,tx,ty} = this.fetch_label_at(txts,j,g);
      }
      if(g.fontcolor=='none'){
      }else{
        o.push(this.p_label(x+tx,y+ty,label,'c',g));
      }
    })
    return o.join('\n');
  }
  do_edge(opts,g,txts,coords){
    const shift = this.g_to_shift_float(g);
    const s_abr = this.g_to_abr_string(g);
    const ss_abr = this.string_to_array(s_abr);
    const abr = this.assert_float(ss_abr[0],0);
    const span = this.assert_float(ss_abr[1],45);
    const protrude = this.assert_float(ss_abr[2],2);
    const t = this.g_to_t_float(g);
    var o = [];
    for(let j=1; j < opts.length; ++j){
      var name1 = opts[j-1];
      var name2 = opts[j];
      var {label,tx,ty} = this.fetch_label_at(txts,j-1,g);
      if(this.my_node_map.has(name1)&&this.my_node_map.has(name2)){
        var node1 = this.my_node_map.get(name1);
        var node2 = this.my_node_map.get(name2);
        if(name1==name2){
          ///a looped edge from itself-to-itself
          var x1 = node1.x;
          var y1 = node1.y;
          var r1 = node1.r;
          let [p0,p1,p2,p3] = this.abr_to_cbezier_loop(abr,span,protrude, x1,y1,r1);
          o.push(this.p_bezier_line(p0[0],p0[1], p1[0],p1[1], p2[0],p2[1], p3[0],p3[1], g));
          //figure out where to draw label
          let mylabelx = x1 + Math.cos(abr/180*Math.PI)*(r1+protrude+shift);
          let mylabely = y1 + Math.sin(abr/180*Math.PI)*(r1+protrude+shift);
          if(label){
            o.push(this.p_label(mylabelx+tx,mylabely+ty,label,'c',g));
          }
        }else{
          //draw straight line or Bezier line between two different nodes
          var x1 = node1.x;
          var y1 = node1.y;
          var r1 = node1.r;
          var x2 = node2.x;
          var y2 = node2.y;
          var r2 = node2.r;
          let nodetype1 = node1.nodetype;   
          let nodetype2 = node2.nodetype;   
          let [p0,p1,p2] = this.abr_to_qbezier(abr, x1,y1, x2,y2); 
          p0 = this.move_node_center_by_opponent(p0[0],p0[1],p1[0],p1[1],r1,nodetype1);
          p2 = this.move_node_center_by_opponent(p2[0],p2[1],p1[0],p1[1],r2,nodetype2);
          o.push(this.p_qbezier_line(p0[0],p0[1], p1[0],p1[1], p2[0],p2[1],g));
          let pt = this.qbezier_point(t,p0,p1,p2);
          if(label){
            if(shift){
              pt = this.lateral_shift_pt(shift, p0[0],p0[1], pt[0],pt[1], p2[0],p2[1]);
            }
            o.push(this.p_label(pt[0],pt[1],label,'c',g));
          }
        }
      }
    }
    return o.join('\n');
  }
  do_box(opts,g,txts,coords){
    var all = [];
    var boxtype = this.g_to_boxtype_string(g);
    var w = this.g_to_w_float(g);
    var h = this.g_to_h_float(g);
    var rdx = this.g_to_rdx_float(g);
    var rdy = this.g_to_rdy_float(g);
    for (var j = 0; j < coords.length; j++) {
      var pt = this.point_at(coords, j);
      if (!this.is_valid_point(pt)) continue;
      var id = opts[j]||'';
      var x = pt[0];
      var y = pt[1];
      var p = {x,y,w,h,rdx,rdy,boxtype};
      if(id){
        this.my_box_map.set(id,p);
        this.do_comment(`*** box ${id} = ${this.box_to_string(p)}`);
      }
      all.push({id,x,y,w,h,rdx,rdy,boxtype});
    }
    ///if no coords, we redraw all existing nodes
    if(coords.length==0){
      for(var j=0; j < opts.length; j++){
        var id = opts[j];
        if(this.my_box_map.has(id)){
          var p = this.my_box_map.get(id);
          all.push({...p,id});
        }
      }
    }
    ///start to draw
    var o = [];
    all.forEach((one,j,arr) => {
      var {x,y,w,h,rdx,rdy,boxtype} = one;
      let q = null;
      if(boxtype=='NONE'){
        q = [];
      }else if(boxtype=='HEXG'){
        q = this.to_q_HEXO(x,y,w,h);
      }else if(boxtype=='UTRI'){
        q = this.to_q_UTRI(x,y,w,h);
      }else if(boxtype=='DTRI'){
        q = this.to_q_DTRI(x,y,w,h);
      }else if(boxtype=='PARA'){
        q = this.to_q_PARA(x,y,w,h);
      }else if(boxtype=='RHOM'){
        q = this.to_q_RHOM(x,y,w,h);
      }else if(boxtype=='ELLI'){
        q = this.to_q_ELLI(x,y,w,h);
      }else if(boxtype=='TERM'){
        q = this.to_q_TERM(x,y,w,h);
      }else if(boxtype=='RDEL'){
        q = this.to_q_RDEL(x,y,w,h);
      }else if(boxtype=='LDEL'){
        q = this.to_q_LDEL(x,y,w,h);
      }else if(boxtype=='SDOC'){
        q = this.to_q_SDOC(x,y,w,h);
      }else if(boxtype=='MDOC'){
        q = this.to_q_MDOC(x,y,w,h);
      }else if(boxtype=='STOR'){
        q = this.to_q_STOR(x,y,w,h);
      }else if(boxtype=='FORM'){
        q = this.to_q_FORM(x,y,w,h);
      }else if(boxtype=='SUBP'){
        q = this.to_q_SUBP(x,y,w,h);
      }else if(boxtype=='DOBJ'){
        q = this.to_q_DOBJ(x,y,w,h);
      }else if(boxtype=='UOBJ'){
        q = this.to_q_UOBJ(x,y,w,h);
      }else if(boxtype=='LOBJ'){
        q = this.to_q_LOBJ(x,y,w,h);
      }else if(boxtype=='ROBJ'){
        q = this.to_q_ROBJ(x,y,w,h);
      }else if(boxtype=='RREC'){
        q = this.to_q_RREC(x,y,w,h);
      }else{
        q = this.to_q_RECT(x,y,w,h);
      }
      o.push(this.p_drawpath(q,g));
      var {label,tx,ty} = this.fetch_label_at(txts,j,g);
      o.push(this.p_label(x+w/2+tx,y+h/2+ty,label,'c',g));
    });
    return o.join('\n');
  }
  lateral_shift_pt(shift, x0,y0, x1,y1, x2,y2){
    //NOTE this method is to shift the x1/y1 point lateral to the direction
    // of (x0/y0) -- (x2/y2), of a distance of 'shift'. with negative number
    // of shift making text moving left of the direction, and positive
    // number making text moving to the right
    var dx = x2 - x0;
    var dy = y2 - y0;
    var Dy = 0;
    var Dx = 0;
    if(Math.abs(dy) < this.MIN_FLOAT){
      Dx = 0;
      if(x2 >= x0){
        Dy = 1;
      }else{
        Dy = -1;
      }
    }else if(Math.abs(dx) < this.MIN_FLOAT){
      Dy = 0;
      if(y2 >= y0){
        Dx = -1;
      }else{
        Dx = 1;
      }
    }else{
      var delta = Math.atan2(dy,dx);
      delta += Math.PI*0.5;
      Dx = Math.cos(delta);
      Dy = Math.sin(delta);
    }
    Dx *= -shift;
    Dy *= -shift;
    x1 += Dx;
    y1 += Dy;
    return [x1,y1];
  }
  radial_shift_pt(shift,ta,x,y){
    var anchor, valign;
    if (ta==='br') {
      anchor = 'start', valign = 'lower';
    } else if (ta==='b') {
      anchor = 'middle', valign = 'lower';
    } else if (ta==='bl') {
      anchor = 'end', valign = 'lower';
    } else if (ta==='ur') {
      anchor = 'start', valign = 'upper';
    } else if (ta==='u') {
      anchor = 'middle', valign = 'upper';
    } else if (ta==='ul') {
      anchor = 'end', valign = 'upper';
    } else if (ta==='r') {
      anchor = 'start', valign = 'middle';
    } else if (ta==='l') {
      anchor = 'end', valign = 'middle';
    } else if (ta==='c') {
      anchor = 'middle', valign = 'middle';
    } else {
      ///treat it as 'ur'
      anchor = 'start', valign = 'upper';
    }
    if(anchor=='start'){
      x += shift;
    }else if(anchor=='end'){
      x -= shift;
    }
    ///for y
    if(valign=='upper'){
      y += shift;
    }else if(valign=='lower'){
      y -= shift;
    }
    return [x,y]
  }

  abr_to_cbezier_loop(abr,span,protrude,x1,y1,r1){
    var p0 = [0,0];
    var p1 = [0,0];
    var p2 = [0,0];
    var p3 = [0,0];
    var r2 = r1+protrude;
    var ang = 90 - abr;
    p1[0] = x1 + r2*Math.cos((ang-span)/180*Math.PI);
    p1[1] = y1 + r2*Math.sin((ang-span)/180*Math.PI);
    p2[0] = x1 + r2*Math.cos((ang+span)/180*Math.PI);
    p2[1] = y1 + r2*Math.sin((ang+span)/180*Math.PI);
    p0[0] = x1 + r1*Math.cos((ang-span)/180*Math.PI);
    p0[1] = y1 + r1*Math.sin((ang-span)/180*Math.PI);
    p3[0] = x1 + r1*Math.cos((ang+span)/180*Math.PI);
    p3[1] = y1 + r1*Math.sin((ang+span)/180*Math.PI);
    return [p0,p1,p2,p3];
  }

  abr_to_qbezier(abr, x1,y1, x2,y2){
    var p0 = [x1,y1];
    var p2 = [x2,y2];
    // 
    var dx = +x2-x1;
    var dy = +y2-y1;
    // half distance between to end points
    var half_dist = Math.sqrt(dx*dx + dy*dy)/2;
    // convert dir to radians
    abr *= Math.PI/180;
    //magnitude of the vector [U,V]
    var D = Math.tan(Math.abs(abr))*half_dist;
    // compute the unit-vector [u,v] that is perpendicular to [x1,y1]~[x2,y2]
    var u, v;
    if(Math.abs(dx) < this.MIN_FLOAT){ dx = 0; }
    if(Math.abs(dy) < this.MIN_FLOAT){ dy = 0; }
    if(dx==0 && dy==0){
      u = 0;
      v = 0;
    }else if(dy==0){
      u = 0;
      if(dx>0){
        v = 1 * D;
      }else{
        v = -1 * D;
      }
    }else if(dx==0){
      v = 0;
      if(dy>0){
        u = -1 * D;
      }else{
        u = 1 * D;
      }
    }else{
      var M = dx/dy;
      var M_sq = M*M;
      var M_sq_plus_1 = M_sq + 1;
      u = D/Math.sqrt(M_sq_plus_1); 
      if(dy>0){
        u = -u;
      }
      v = dx*u/(-dy);
    }
    if(abr < 0){
      var U = (x1+x2)/2 + u;
      var V = (y1+y2)/2 + v;
    }else{
      var U = (x1+x2)/2 - u;
      var V = (y1+y2)/2 - v;
    }
    var p1 = [U,V];
    if(0){

      //re-compute p0 starting point 
      var ang1 = Math.atan2(dy,dx);
      ang1 -= abr;
      p0[0] += r1 * Math.cos(ang1);
      p0[1] += r1 * Math.sin(ang1);
      //re-compute p2 starting point
      var ang2 = Math.PI + Math.atan2(dy,dx);
      ang2 += abr;
      p2[0] += r2 * Math.cos(ang2);
      p2[1] += r2 * Math.sin(ang2);
      //console.log('dir=',dir,'ang1=',ang1,'ang2=',ang2);
      //console.log('qbezier=',p0,p1,p2);
    }
    return [p0,p1,p2];
  }

  move_box_xy_by_anchor(x,y,w,h,boxtype,anchor){
    ///'anchor' is one of the following string:
    //   "n", "w", "e", "w", "sw", "se", "nw", "ne"
    //  return [x,y]
    if(anchor=='n'){
      x = x + w/2;
      y = y + h;
    }
    else if(anchor=='s'){
      x = x + w/2;
      y = y;
    }
    else if(anchor=='w'){
      x = x;
      y = y + h/2;
    }
    else if(anchor=='e'){
      x = x + w;
      y = y + h/2;
    }
    else if(anchor=='sw'){
      x = x;
      y = y;
    }
    else if(anchor=='se'){
      x = x + w;
      y = y;
    }
    else if(anchor=='nw'){
      x = x;
      y = y + h;
    }
    else if(anchor=='ne'){
      x = x + w;
      y = y + h;
    }
    return [x,y];
  }

  move_node_center_by_opponent(x1,y1,x2,y2,r,nodetype){
    var dy = y2-y1;
    var dx = x2-x1;
    var ang = Math.atan2(dy,dx);
    var angd = ang/Math.PI*180;
    var [dx,dy] = this.node_relative(angd,r,nodetype);
    x1 += dx;
    y1 += dy;
    return [x1,y1];
  }
  move_node_center_by_anchor(x,y,r,nodetype,anchor){
    ///'anchor' is one of the following string:
    //   "n", "w", "e", "w", "sw", "se", "nw", "ne"
    //  return [x,y]
    var angd;
    switch(anchor){
      case 'o1': angd = 60; break;
      case 'o2': angd = 30; break;
      case 'o3': angd = 0; break;
      case 'o4': angd = -30; break;
      case 'o5': angd = -60; break;
      case 'o6': angd = -90; break;
      case 'o7': angd = -120; break;
      case 'o8': angd = -150; break;
      case 'o9': angd = 180; break;
      case 'o10': angd = 150; break;
      case 'o11': angd = 120; break;
      case 'o12': angd = 90; break;
    }
    var dx = 0;
    var dy = 0;
    if(typeof angd === 'number'){
      [dx,dy] = this.node_relative(angd,r,nodetype);
    }
    x += dx;
    y += dy;
    return [x,y];
  }

  node_relative(angd,r,nodetype){
    var ang = angd/180*Math.PI;
    if(angd > 180){
      angd = 360-angd;
    }
    var dx = 0;
    var dy = 0;
    switch(nodetype){
      case 'RREC':
      case 'RECT':
        if(angd >= 0){
          if(angd < 45){
            var dx = r;
            var dy = r*Math.tan(ang);
          }else if(angd < 135){
            var dx = r*1.414*Math.sin((90-angd)/180*Math.PI);
            var dy = r;
          }else{
            var dx = -r;
            var dy = r*Math.tan(Math.PI-ang);
          }
        }else{
          if(angd > -45){
            var dx = r;
            var dy = -r*Math.tan(ang);
          }else if(angd > -135){
            var dx = -r*1.414*Math.sin((-90-angd)/180*Math.PI);
            var dy = -r;
          }else{
            var dx = -r;
            var dy = -r*Math.tan(ang);
          }
        }
        break
      default:
        var dx = r*Math.cos(ang);
        var dy = r*Math.sin(ang);
        break;
    }
    return [dx,dy];
  }

  to_start_node_anchor_point(x0,y0,r0,x1,y1){
    var p0 = [x0,y0];
    var p1 = [x1,y1];
    //re-compute p0 starting point
    var dy = p1[1] - p0[1];
    var dx = p1[0] - p0[0]; 
    var ang0 = Math.atan2(dy,dx);
    p0[0] += r0 * Math.cos(ang0);
    p0[1] += r0 * Math.sin(ang0);
    return [p0,p1];
  }

  to_end_node_anchor_point(x1,y1,x2,y2,r2){
    var p1 = [x1,y1];
    var p2 = [x2,y2];
    //re-compute p2 starting point
    var dy = p1[1] - p2[1];
    var dx = p1[0] - p2[0];
    var ang2 = Math.atan2(dy,dx);
    p2[0] += r2 * Math.cos(ang2);
    p2[1] += r2 * Math.sin(ang2);
    return [p1,p2];
  }

  fetch_label_at(txts,i,g){
    var label = '';
    var tx = 0;
    var ty = 0;
    if(i < txts.length) {
      var {label,tx,ty} = txts[i];
    }
    return {label,tx,ty};
  }

  fetch_opt_at(opts,n,g){
    if(opts.length==0){
      return '';
    }
    if(n >= opts.length){
      return opts[opts.length-1];
    }
    return opts[n];
  }

  move_label_away(x,y,ta,labeldx,labeldy){
    /// x,y,dx,dy are in grid units
    ///where positive dy goes up and positive dx goes east
    if (ta==='br') {
      var dx = +labeldx;
      var dy = -labeldy;
    } else if (ta==='b') {
      var dx = 0;
      var dy = -labeldy;
    } else if (ta==='bl') {
      var dx = -labeldx;
      var dy = -labeldy;
    } else if (ta==='ur') {
      var dx = +labeldx;
      var dy = +labeldy;
    } else if (ta==='u') {
      var dx = 0;
      var dy = +labeldy;
    } else if (ta==='ul') {
      var dx = -labeldx;
      var dy = +labeldy;
    } else if (ta==='r') {
      var dx = +labeldx;
      var dy = 0;
    } else if (ta==='l') {
      var dx = -labeldx;
      var dy = 0;
    } else if (ta==='c') {
      var dx = 0;
      var dy = 0;
    } else {
      //treat it as 'ur'
      var dx = +labeldx;
      var dy = +labeldy;
    }
    x += dx;
    y += dy;
    return [x,y];
  }
  to_dia(lines){

  }
  to_multiline(n,x,y,ta,baseskip){
    var multi = [];
    if(ta=='c'||ta=='l'||ta=='r'){
      var sy = (n-1)*(0.5*baseskip);
    }else if(ta=='u'||ta=='ul'||ta=='ur'){
      var sy = (n-1)*baseskip;
    }else{
      var sy = 0;
    }
    y += sy;
    for(let j=0; j < n; ++j){
      multi.push([x,y]);
      y -= baseskip;
    }
    return multi;
  }
  deg_to_rad(x){
    return (x * Math.PI / 180);
  }
  arc_to_cubic_bezier(xc,yc,x1,y1,x4,y4){
    let ax = x1 - xc
    let ay = y1 - yc
    let bx = x4 - xc
    let by = y4 - yc
    let q1 = ax * ax + ay * ay
    let q2 = q1 + ax * bx + ay * by
    let k2 = 4/3 * (Math.sqrt(2 * q1 * q2) - q2) / (ax * by - ay * bx)

    let x2 = xc + ax - k2 * ay
    let y2 = yc + ay + k2 * ax
    let x3 = xc + bx + k2 * by                                 
    let y3 = yc + by - k2 * bx

    return [x2,y2,x3,y3];
  }
  ///
  ///
  ///
  name_to_path_string(str){
    switch(str){
      case 'unitcircle':
        var mypath = '(1,0)<c:0,0.55,-0.45,1,-1,1><c:-0.55,0,-1,-0.45,-1,-1><c:0,-0.55,+0.45,-1,+1,-1><c:+0.55,0,+1,+0.45,1,1><z>';
        break;

      case 'unitsquare':
        var mypath = '(0,0)--(1,0)--(1,1)--(0,1)<z>';
        break;

      case 'apple': 
        var mypath = '(.5,.7)..(.25,.85)..(0,.4)..(.5,0)..(1.0,.5)..(.8,.9)..(.5,.7) -- (.5,.7)..(.6,1.0)..(.3,1.1) -- (.3,1.1)..(.4,1.0)..(.5,.7) <z>';
        break;

      case 'basket': 
        var mypath = '(0.3,0) -- (2.6,0)..(2.8,1)..(3,2) -- (3,2)..(1.5,1.5)..(0,2) -- (0,2)..(0.2,1)..(0.3,0) <z>';
        break;

      case 'crate': 
        var mypath = '(0,0)--(4,0)--(4,2)--(0,2)<z> (4,0)--(5,1)--(5,3)--(4,2)<z> (0,2)--(1,3)--(5,3)';
        break;

      case 'tree':
        var mypath = '(0,0) -- (-0.4,0) -- (-0.2,0.8) -- (-1,0.4) -- (-0.35,1.1) -- (-0.8,1.1) -- (-0.2,1.5) -- (-0.7,1.5) -- (0,2) -- (0.7,1.5) -- (0.2,1.5) -- (0.8,1.1) -- (0.35,1.1) -- (1,0.4) -- (0.2,0.8) -- (0.4,0) <z>';
        break;

      case 'balloon':
        var mypath = '(0.0, 1)..(0.5, 1.5)..(0.2, 2)..(-0.3, 1.5)..(0, 1) <z> (0, 1)..(-0.05, 0.66)..(0.15, 0.33)..(0, 0)';
        break;

      case 'house':
        var mypath = '&polygon{(-0.5,1),(1.25,3.5),(3,1),(-0.5,1)} &rectangle{(0,0),1,1} &rectangle{(1,0),1.5,1} &rectangle{(1.5,0),0.5,0.5}';
        break;

      case 'school':
        var mypath = '&rectangle{(0,0),7,3} &rectangle{(1,0),1,2} &rectangle{(3,0),1,2} &rectangle{(5,0),1,2} &polygon{(1,3),(1,5),(2,4.5),(1,4)} &polygon{(3,3),(3,5),(4,4.5),(3,4)} &polygon{(5,3),(5,5),(6,4.5),(5,4)}';
        break;

      case 'mouse':
        var mypath = '(2.5,0)--(0,0)..(2.1,1.7)..(3,2)..(4,1.5)..(4,0)..(3,-0.2)..(2.5,0)..(2.3,0.5)..(2.9,1) &circle{(1.1,0.6),0.15} (4,0)..(4.4,0)..(4,-0.5)..(2,-0.5)..(1.5,-0.4)..(1.0,-0.5)  (2.5,0) <l:-0.2,-0.2>';
        break;

      case 'cat':
        var mypath = `(-1.5,2.5)..(-2.2,0.8)..(-2,0)..(-0.5,-0.3)..(1,0)..(1.2,0.8)..(0.5,2.5)\
             (0.5,2.5)--(0.8,3.2)--(0,2.8)--(0,2.8)..(-1,2.8)--(-1,2.8)--(-1.8,3.2)--(-1.5,2.5)\
             &circle{(-0.5,1),0.15}\
             &circle{(0.5,1),0.15}\
             (-1,1.2)--(-0.5,1.5)\
             (+1,1.2)--(+0.5,1.5)\
             &ellipse{(0,0.4),0.3,0}\
             &polyline{(0.5,0.6),(2,1)}\
             &polyline{(0.5,0.5),(1.8,0.7)}\
             &polyline{(0.5,0.4),(1.6,0.4)}\
             &polyline{(-0.5,0.6),(-2,1)}\
             &polyline{(-0.5,0.5),(-1.8,0.7)}\
             &polyline{(-0.5,0.4),(-1.6,0.4)}\
             &ellipse{(-0.6,-0.2),0.4,0.3}\
             &ellipse{(+0.5,-0.2),0.4,0.3}`;
        break;

      case 'coin':
        var mypath = '&cylinder{(0,0),1,0.5,0.1} &ellipse{(0,0.1),0.8,0.3}';
        break;

      case 'club':
        var mypath = '(0.4,0.4) <a:0.15,0.15,0,1,1,0,0.2> <a:0.15,0.15,0,1,1,0.2,0> <a:0.15,0.15,0,1,1,0,-0.2> <h:-0.07> <q:0,-0.3,0.07,-0.3> <h:-0.2> <q:0.07,0,0.07,0.3> <z>';
        break;

      case 'spade':
        var mypath = '(0.4,0.1) <q:0.07,0,0.07,0.2> <h:-0.07> <c:-0.3,-0.2,-0.30,+0.15,-0.10,+0.35> <s:0.20,0.20,0.20,0.20> <c:0,0,0.2,-0.2,0.2,-0.2> <c:0.2,-0.2,0.2,-0.55,-0.1,-0.35> <h:-0.07> <q:0,-0.2,0.07,-0.2> <z>';
        break;
      
      case 'heart':
        var mypath = '(0.5,0.1) <c:-0.50,0.20,-0.45,0.90,0,0.65> <c:0.40,0.25,0.50,-0.45,0,-0.65> <z>';
        break;

      case 'diamond':
        var mypath = '(0.5,0.1) <l:-0.35,0.375> <l:0.35,0.375> <l:0.35,-0.375> <z>';
        break;

      case 'pail':
        var mypath = '(0,4) <l:0.5,-4> <q:1.5,-0.5,3,0> <l:0.5,4> <q:-2,1,-4,0> <z> (0,4) <q:2,-1,4,0>  (-0.2,4) <q:2.2,4,4.4,0>  (0.2,4) <q:1.8,4,3.6,0> &ellipse{(0.1,3.8),0.4,0.3} &ellipse{(3.9,3.8),0.4,0.3}'; 
        break;
        
      case 'protractor':
        var mypaths = [];
        mypaths.push('(-3.5, 0) -- (-0.1,0)..(0,0.1)..(0.1,0) -- (3.5, 0)..(0, 3.5)..(-3.5, 0)<z> ');
        mypaths.push('(-2.5100, 0.8500) -- (2.5100, 0.8500)..(0, 2.65)..(-2.5100, 0.8500)<z> ');
        mypaths.push('(3.4468,  0.6078) -- (3.0529,  0.5383)');
        mypaths.push('(3.2889,  1.1971) -- (2.9130,  1.0603)');
        mypaths.push('(3.0311,  1.7500) -- (2.6847,  1.5500)');
        mypaths.push('(2.6812,  2.2498) -- (2.3747,  1.9926)');
        mypaths.push('(2.2498,  2.6812) -- (1.9926,  2.3747)');
        mypaths.push('(1.7500,  3.0311) -- (1.5500,  2.6847)');
        mypaths.push('(1.1971,  3.2889) -- (1.0603,  2.9130)');
        mypaths.push('(0.6078,  3.4468) -- (0.5383,  3.0529)');
        mypaths.push('(0.0000,  3.5000) -- (0.0000,  3.1000)');
        mypaths.push('(-3.4468, 0.6078) -- (-3.0529, 0.5383)');
        mypaths.push('(-3.2889, 1.1971) -- (-2.9130, 1.0603)');
        mypaths.push('(-3.0311, 1.7500) -- (-2.6847, 1.5500)');
        mypaths.push('(-2.6812, 2.2498) -- (-2.3747, 1.9926)');
        mypaths.push('(-2.2498, 2.6812) -- (-1.9926, 2.3747)');
        mypaths.push('(-1.7500, 3.0311) -- (-1.5500, 2.6847)');
        mypaths.push('(-1.1971, 3.2889) -- (-1.0603, 2.9130)');
        mypaths.push('(-0.6078, 3.4468) -- (-0.5383, 3.0529)');
        mypaths.push('(0.0000,  0.1000) -- (0.0000,  0.8500)');
        var mypath = mypaths.join(' ');
        break;

      case 'updnprotractor':
        var mypaths = [];
        mypaths.push('(-3.5, 0) -- (-0.1,0)..(0,-0.1)..(0.1,0) -- (3.5, 0)..(0,-3.5)..(-3.5, 0)<z> ');
        mypaths.push('(-2.5100,-0.8500)  -- (2.5100,-0.8500)..(0,-2.65)..(-2.5100,-0.8500)<z> ');
        mypaths.push('( 3.4468, -0.6078) -- ( 3.0529, -0.5383)<z>');
        mypaths.push('( 3.2889, -1.1971) -- ( 2.9130, -1.0603)<z>');
        mypaths.push('( 3.0311, -1.7500) -- ( 2.6847, -1.5500)<z>');
        mypaths.push('( 2.6812, -2.2498) -- ( 2.3747, -1.9926)<z>');
        mypaths.push('( 2.2498, -2.6812) -- ( 1.9926, -2.3747)<z>');
        mypaths.push('( 1.7500, -3.0311) -- ( 1.5500, -2.6847)<z>');
        mypaths.push('( 1.1971, -3.2889) -- ( 1.0603, -2.9130)<z>');
        mypaths.push('( 0.6078, -3.4468) -- ( 0.5383, -3.0529)<z>');
        mypaths.push('( 0.0000, -3.5000) -- ( 0.0000, -3.1000)<z>');
        mypaths.push('(-3.4468, -0.6078) -- (-3.0529, -0.5383)<z>');
        mypaths.push('(-3.2889, -1.1971) -- (-2.9130, -1.0603)<z>');
        mypaths.push('(-3.0311, -1.7500) -- (-2.6847, -1.5500)<z>');
        mypaths.push('(-2.6812, -2.2498) -- (-2.3747, -1.9926)<z>');
        mypaths.push('(-2.2498, -2.6812) -- (-1.9926, -2.3747)<z>');
        mypaths.push('(-1.7500, -3.0311) -- (-1.5500, -2.6847)<z>');
        mypaths.push('(-1.1971, -3.2889) -- (-1.0603, -2.9130)<z>');
        mypaths.push('(-0.6078, -3.4468) -- (-0.5383, -3.0529)<z>');
        mypaths.push('( 0.0000, -0.1000) -- ( 0.0000, -0.8500)<z>');
        var mypath = mypaths.join(' ');
        break;

      default:
        var mypath = '';
        break;
    }
    return mypath;
  }
  to_prodofprimesws(coords,g,label){
    var z = this.point_at(coords,0);
    var x = z[0];
    var y = z[1];
    var w = 2;
    var h = 1;
    var ss = this.string_to_array(label);
    var prod = ss[0]||1;
    var factors = ss.slice(1);
    var d = [];
    for(let factor of factors){
      var ta = 'bl';
      d.push(this.p_text(x,y,`${factor}`,ta,g));
      d.push(this.p_strokepath([[x,y,'M'],[x,y-h,'L'],[x+w,y-h,'L']],g))
      var ta = 'b';
      d.push(this.p_text(x+1,y,`${prod}`,ta,g));
      y -= h;
      prod /= factor;
      prod = Math.round(prod);
    }
    if(1){
      ///the remaining prod
      var ta = 'b';
      d.push(this.p_text(x+1,y,`${prod}`,ta,g));
    }
    return d.join('\n')
  }
  to_longdivws(coords,g,label){
    var z = this.point_at(coords,0);
    var x = z[0];
    var y = z[1];
    var w = 2;
    var h = 1;
    var ss = this.string_to_array(label);
    var number = parseInt(ss[0])||'';
    var divisor = parseInt(ss[1])||'';
    var d = [];
    if(number && divisor){
      number = Math.abs(number);
      divisor = Math.abs(divisor);
      var ss = `${number}`.split('');
      var tt = `${divisor}`.split('');
      var ta = 'r';
      var n = ss.length;
      const edx = 0.3;
      ///top bar
      d.push(this.p_line(x-edx,y,x+n,y,g));
      d.push(this.p_qbezier_line(x-edx,y,x-edx+0.2,y-0.5,x-edx,y-1,g));
      ///draw the top number
      ss.forEach((s,i) => {
        d.push(this.p_text(x+i,y-0.5,s,ta,g));
      });
      ///draw the divosor
      tt.forEach((t,i) => {
        let dx = tt.length;
        d.push(this.p_text(-dx+x+i,y-0.5,t,ta,g));
      })
      ///draw the remainders
      var n = ss.length;
      var k = tt.length - 1;
      var r = ss.slice(0,k).join('');
      var j = 1;
      var showanswer = this.get_int_prop(g,'showanswer',0);
      var showsteps = this.get_int_prop(g,'showsteps',0);
      var showanswercolor = this.get_string_prop(g,'showanswercolor','');  
      if(showanswercolor){
        g = {...g,fontcolor:showanswercolor,linecolor:showanswercolor};
      }
      var steps = 0;
      for(;showanswer&&k<n;k++){
        steps++;
        r += ss[k];
        var {R,Q,P} = this.calc_remainder_quotient(r,tt.join(''));
        var s = `${Q}`;
        d.push(this.p_text(x+k,y+0.5,s,ta,g));
        r = `${R}`;
        let p = `${P}`
        var m = p.length;
        d.push(this.draw_letter_string(x+k-m+1,y-j,p,g));//draw the product
        d.push(this.p_text(x+k-m,y-j-0.5,'&minus;','r',g));//draw the minus sign on the left
        d.push(this.p_line(x+k-m+1,y-j-1,x+k+1,y-j-1,g));
        var m = r.length;
        var ex = ss[k+1]||'';
        var r0 = r+ex;
        var r0_n = r0.length;
        if(showsteps && steps >= showsteps){
          break;
        }
        if(ex) d.push(this.p_line(x+k+1+0.5,y-1,x+k+1+0.5,y-1-j,{...g,arrowhead:1}));
        j++;
        d.push(this.draw_letter_string(x+k-m+1,y-j,r0,g));
        j++;
      }
    }
    return d.join('\n')
  }
  to_multiws(coords,_g,label){
    var g = {..._g};
    g['dotsize'] = 3;
    var z = this.point_at(coords,0);
    var x = z[0];
    var y = z[1];
    var showanswer = this.get_int_prop(g,'showanswer',0);
    var showanswercolor = this.get_string_prop(g,'showanswercolor','');
    var showsteps = this.get_int_prop(g,'showsteps',0);
    // var decimalpoint = this.get_string_prop(g,'decimalpoint','');
    // var decimalpoints = this.string_to_int_array(decimalpoint);
    var [number,divisor] = this.string_to_array(label);
    var [number,decimalpoint1] = this.extract_decimal_point(number);
    var [divisor,decimalpoint2] = this.extract_decimal_point(divisor);
    var d = [];
    var all = [];
    if(number && divisor){
      var ss = `${number}`.split('');
      var tt = `${divisor}`.split('');
      var ta = 'r';
      var n = ss.length;
      var m = tt.length;
      var s = ss.join('');
      var t = tt.join('');
      ///draw the top number
      d.push(this.draw_letter_string(x,y,s,g));
      ///draw the second number
      d.push(this.draw_letter_string(x+(n-m),y-1,t,g));
      ///draw the multiplication sign
      d.push(this.p_text(x-m,y-1-0.5,'&times;','r',g));
      d.push(this.p_line(x-m,y-2,x+n,y-2,g));
      ///decimal points
      if(decimalpoint1){
        /// draw the decimal point for the first number
        d.push(this.p_dot_circle(x+n-decimalpoint1,y-1+0.25,g));
      }
      if(decimalpoint2){
        /// draw the decimal point for the second number
        d.push(this.p_dot_circle(x+n-decimalpoint2,y-2+0.25,g));
      }
      ///if we need also to provide showanswer
      var steps = 0;
      var doneflag = 0;
      if(showanswer){
        let q3 = decimalpoint1 + decimalpoint2;
        var g = {...g,fontcolor:showanswercolor,linecolor:showanswercolor,dotcolor:showanswercolor};
        let dy=2,dx=0,flag=0,flags=[];
        var p='';
        for(let j=m;j>0;j--,dx++){
          if(doneflag) {
            break;
          }
          let b = tt.slice(j-1,j);
          if(j<m){
            dy++;
            p='';
          }
          for(let i=n;i>0;i--){
            if(doneflag){
              break;
            }
            if(p.length > 1){
              dy++;
            }
            let a = ss.slice(i-1,i);
            var p = `${a*b}`;
            all.push(p + '0'.repeat(dx+(n-i)));
            d.push(this.draw_letter_string_flushright(x+i-dx,y-dy,p,g));
            if(showsteps && ++steps >= showsteps){
              doneflag = 1;
            }
          }
        }
        if(doneflag){
          //no-op
        }
        else if(dy>2){
          dy++;
          ///only compute the sum if d
          all = all.map((x) => parseInt(x));
          var sum = all.reduce((acc,cur) => acc+cur,0);
          sum = `${sum}`;
          d.push(this.draw_letter_string_flushright(x+n,y-dy,sum,g));
          d.push(this.p_line(x-m,y-dy,x+n,y-dy,g));
          if(q3){
            /// draw the decimal point for the second number
            d.push(this.p_dot_circle(x+n-q3,y-dy-1+0.25,g));
          }
        }else{
          if(q3){
            /// draw the decimal point for the second number
            d.push(this.p_dot_circle(x+n-q3,y-3+0.3,g));
          }
        }
      }
    }
    return d.join('\n')
  }
  draw_letter_string(x,y,label,g){
    var d = [];
    var tt = label.split('');
    tt.forEach((t,i) => {
      let dx = tt.length;
      d.push(this.p_text(x+i,y-0.5,t,'r',g));
    });
    return d.join('\n')
  }
  draw_letter_string_flushright(x,y,label,g){
    var d = [];
    var tt = label.split('');
    var n = tt.length;
    tt.forEach((t,i) => {
      let dx = tt.length;
      d.push(this.p_text(-n+x+i,y-0.5,t,'r',g));
    });
    return d.join('\n')
  }
  rgb_to_hwb(r, g, b) {
    var h, w, bl, max, min, chroma;
    r = r / 255;
    g = g / 255;
    b = b / 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    chroma = max - min;
    if (chroma == 0) {
      h = 0;
    } else if (r == max) {
      h = (((g - b) / chroma) % 6) * 360;
    } else if (g == max) {
      h = ((((b - r) / chroma) + 2) % 6) * 360;
    } else {
      h = ((((r - g) / chroma) + 4) % 6) * 360;
    }
    w = min;
    bl = 1 - max;
    return {h : h, w : w, b : bl};
  }
  hwb_to_rgb(hue, white, black) {
    var i, rgb, rgbArr = [], tot;
    rgb = this.hsl_to_rgb(hue, 1, 0.50);
    rgbArr[0] = rgb.r / 255;
    rgbArr[1] = rgb.g / 255;
    rgbArr[2] = rgb.b / 255;
    tot = white + black;
    if (tot > 1) {
      white = Number((white / tot).toFixed(2));
      black = Number((black / tot).toFixed(2));
    }
    for (i = 0; i < 3; i++) {
      rgbArr[i] *= (1 - (white) - (black));
      rgbArr[i] += (white);
      rgbArr[i] = Number(rgbArr[i] * 255);
    }
    return {r : rgbArr[0], g : rgbArr[1], b : rgbArr[2] };
  }  
  hsl_to_rgb(hue, sat, light) {
    var t1, t2, r, g, b;
    hue = hue / 60;
    if ( light <= 0.5 ) {
      t2 = light * (sat + 1);
    } else {
      t2 = light + sat - (light * sat);
    }
    t1 = light * 2 - t2;
    r = this.hue_to_rgb(t1, t2, hue + 2) * 255;
    g = this.hue_to_rgb(t1, t2, hue) * 255;
    b = this.hue_to_rgb(t1, t2, hue - 2) * 255;
    return {r : r, g : g, b : b};
  }
  hue_to_rgb(t1, t2, hue) {
    if (hue < 0) hue += 6;
    if (hue >= 6) hue -= 6;
    if (hue < 1) return (t2 - t1) * hue + t1;
    else if(hue < 3) return t2;
    else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
    else return t1;
  }
  calc_remainder_quotient(s,t){
    ///s is the number and t is the divisor, and they are both positive integers
    var q = s/t;
    var q_floor = Math.floor(q);
    let R = s - t*q_floor;
    let Q = q_floor;
    let P = t*q_floor;
    return {R,Q,P};
  }
  string_to_command_opts(line,env){
    var opts = line.split('.');
    const re = /^@\[(.*)\]$/;
    opts = opts.slice(1);
    opts = opts.map((s) => {
      let v = re.exec(s);
      if(v){
        let ss = v[1].split(',').map((x) => x.trim());
        let i = env['_']||0;
        return ss[i]||'';
      }
      return s;
    })
    return opts;
  }
  extract_decimal_point(s){
    // given a string such as "2.31", return a new string that is "231" and
    // also a number that is 2 which is the decimal place of this number
    // the number cannot have a hyphen-minus in front of it.
    // if the number is not in this format, return an empty string and 0
    const re0 = /^(\d+)$/;
    const re1 = /^\.(\d+)$/;
    const re2 = /^(\d+)\.(\d+)$/;
    const re3 = /^(\d+)\.$/;
    let v;
    if((v=re0.exec(s))!==null){
      return [s,0];
    }
    else if((v=re1.exec(s))!==null){
      let n = v[1].length;
      s = v[1];
      return [s,n];
    }
    else if((v=re2.exec(s))!==null){
      let n = v[2].length;
      s = v[1] + v[2];
      return [s,n];
    }
    else if((v=re3.exec(s))!==null){
      let n = 0;
      s = v[1];
      return [s,n];
    }
    return ['',0];
  }
  //////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////
  assert_arg_point(args,i){
    if(i>=0&&i<args.length){
      return this.point_at(args[i].coords,0);
    }
    return [NaN,NaN];
  }
  assert_arg_coords(args,i){
    if(i>=0&&i<args.length){
      return args[i].coords;
    }
    return [];
  }
  assert_arg_float(args,i){
    if(i>=0&&i<args.length){
      return this.float_at(args[i].array,0);
    }
    return 0;
  }
  assert_arg_floats(args,i){
    if(i>=0&&i<args.length){
      let floats = args[i].array.map((x) => x.re);
      return floats;
    }
    return [];
  }
  assert_arg_array(args,i){
    if(i>=0&&i<args.length){
      return args[i].array;
    }
    return [];
  }
  //////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////
  do_comment(s) {
    var s = this.p_comment(s);
    this.commands.push(s);
  }
  has_shades(g) {
    var s = this.assert_string(g.fillcolor);
    return (s.toLowerCase()=='shade')?true:false;
  }
  has_fills(g) {
    var s = this.g_to_fillcolor_string(g);
    return (!s || s == 'none') ? false : true;
  }
  has_strokes(g) {
    var s = this.g_to_linecolor_string(g);
    return (s && s == 'none') ? false : true;
  }
  has_dots(g){
    var s = this.g_to_dotcolor_string(g);
    return (s && s == 'none') ? false : true;
  }
  has_texts(g) {
    var s = this.g_to_fontcolor_string(g);
    return (s && s == 'none') ? false : true;
  }
  to_shape_of_path(p,g,coords,operation){
    ///the w and h are not significant here, will be
    ///removed in the future, each shape is only
    ///shown in its native size, and will be scaled
    ///using the [sx:] and [sy:] factors of 'g'
    var o = [];
    for (var i = 0; i < coords.length; i++) {
      var z0 = this.point_at(coords, i);
      if(!this.is_valid_point(z0)) continue;
      var offsetx = z0[0];
      var offsety = z0[1];
      var q = this.dup_coords(p);
      this.offset_coords(q,offsetx,offsety);
      if(operation=='fillpath'){
        o.push(this.p_fillpath(q,g));
      }else if(operation=='strokepath'){
        o.push(this.p_strokepath(q,g));
      }else if(operation=='arrow'){
        o.push(this.p_arrow(q,g));
      }else if(operation=='revarrow'){
        o.push(this.p_revarrow(q,g));
      }else if(operation=='dblarrow'){
        o.push(this.p_dblarrow(q,g));
      }else{
        o.push(this.p_drawpath(q,g));
      }
    }
    return o.join('\n');
  }
  string_to_article_id_anchor(s){
    var i = s.indexOf('.');
    if(i>=0){
      var article = s.slice(0,i);
      s = s.slice(i+1);
      var i = s.indexOf(':');
      if(i>=0){
        var id = s.slice(0,i); 
        var anchor = s.slice(i+1);
        return [article,id,anchor]
      }
    }
    return ['','',''];
  }

  get_linesegs(coords){
    var first_pt = null;
    var o = [];
    for(var j=0; j < coords.length; ++j){
      let pt = coords[j];
      let join = pt[2];
      if(join=='M'){
        first_pt = pt;
      }else if(join=='L'){
        let pt0 = coords[j-1];
        let pt1 = coords[j];
        if(pt0 && pt1){
          let q0 = [pt0[0],pt0[1],'M'];
          let q1 = [pt1[0],pt1[1],'M'];
          o.push({q0,q1});
        }
      }else if(join=='z'){
        let pt0 = coords[j-1];
        let pt1 = first_pt;
        if(pt0 && pt1){
          let q0 = [pt0[0],pt0[1],'M'];
          let q1 = [pt1[0],pt1[1],'M'];
          o.push({q0,q1});
        }
      }
    }
    return o;
  }
  is_equal(a1,a2){
    return Math.abs(a1-a2) < this.MIN_FLOAT;
  }
  is_same_pt(q1,q2){
    return (q1[0]==q2[0]&&q1[1]==q2[1]);
  }
  add_move_pt(q,pt){
    q.push(pt);
  }
  add_coords(q,coords){
    for(var pt of coords){
      q.push(pt);
    }
  }
  add_line_pt(q,pt){
    pt[2] = 'L';
    q.push(pt);
  }
  format_args(fmt,args,env){
    const re_fgroup = /^%(\-?)(\+?)(\s?)([0-9]*)(\.?)([0-9]*)([A-Za-z%_])(.*)$/;
    var v;
    var d = [];
    while(fmt.length){
      ///note that 'args' is a array obtained by doing this.string_to_array()
      if((v=re_fgroup.exec(fmt))!==null){
        let f_minus_sign = v[1];
        let f_plus_sign = v[2];
        let f_sp = v[3];
        let f_min_field = v[4];
        let f_dot = v[5];
        let f_precision = v[6];
        let f_letter = v[7];
        fmt = v[8];
        let s = '';
        ///cases
        switch(f_letter){
          case '%': {
            s = '%';
            break;
          }
          case '_': {
            let key = '_';
            if(env.hasOwnProperty(key)){
              s = ""+env[key];
            }
            break;
          }
          case 'o': {
            ///convert to a binary with numbers 0-7
            ///format "%o" 8 => '10'
            let num = args.shift();
            [num] = this.expr.extract_next_expr(num,env);
            if(num.isFinite()){
              s = this.number_to_octal_string(num);
            }
            break;
          }
          case 'x': {
            ///convert to a hex string with 0-9 and a-f
            ///format "%x" 15 => 'f'
            let num = args.shift();
            [num] = this.expr.extract_next_expr(num,env);
            if(num.isFinite()){
              s = this.number_to_hex_string(num);
            }
            break;
          }
          case 'X': {
            ///convert to a binary with 0-9 and A-F
            ///format "%b" 15 => 'F'
            let num = args.shift();
            [num] = this.expr.extract_next_expr(num,env);
            if(num.isFinite()){
              s = this.number_to_hex_string(num);
              s = s.toUpperCase();                 
            }
            break;
          }
          case 'b': {
            ///convert to a binary with all 1's and 0's
            ///format "%b" 5 => '101'
            let num = args.shift();
            [num] = this.expr.extract_next_expr(num,env);
            if(num.isFinite()){
              s = this.number_to_binary_string(num);
            }
            break;
          }
          case 'c': {
            ///convert a number to a Unicode character
            ///format "%c" 65 => 'A'
            let num = args.shift();
            [num] = this.expr.extract_next_expr(num,env);
            if(num.isFinite()){
              s = this.number_to_uchar(num);
            }
            break;
          }
          case 's': {
            let num = args.shift();
            if(env.hasOwnProperty(num)){
              s = env[num];
              if(s instanceof Complex){
                s = s.toString();
              }else{
                s = ""+s;
              }
            }else{
              [num] = this.expr.extract_next_expr(num,env);
              s = num.toString();
            }
            break;
          }
          case 'f': {
            let num = args.shift();
            [num] = this.expr.extract_next_expr(num,env);
            if(num.isFinite()){
              num = num.re;
              s = ''+num;
              if(f_precision){
                s = num.toFixed(f_precision);
              }
              if(Math.sign(num)>=0){
                if(f_sp){
                  s = ' ' + s;
                }else if(f_plus_sign){
                  s = '+' + s;
                }
              }                
            }
            break;
          }
          case 'd': {
            let num = args.shift();
            [num] = this.expr.extract_next_expr(num,env);
            if(num.isFinite()){
              num = num.floor();
              num = num.re;
              s = num;
              if(Math.sign(num)>=0){
                if(f_sp){
                  s = ' ' + s;
                }else if(f_plus_sign){
                  s = '+' + s;
                }
              }                
            }
            break;
          }
        }
        if(s && f_min_field && f_min_field > s.length){
          if(f_min_field[0]=='0'){
            ///add zeros at the beginning
            s = '0'.repeat(+f_min_field-s.length) + s;
          }
          else if(f_minus_sign){
            ///add spaces at the end
            s = s + ' '.repeat(+f_min_field-s.length);
          }else{
            ///add spaces at the beginning
            s = ' '.repeat(+f_min_fielt-s.length) + s;
          }
        } 
        d.push(s);
      }else{
        //remove the next character
        let cc = fmt.codePointAt(0);
        if(cc > 0xFFFF){
          d.push(fmt.slice(0,2));
          fmt = fmt.slice(2);
        }else{
          d.push(fmt.slice(0,1));
          fmt = fmt.slice(1);
        }
      }
    }
    return d.join('');
  }
  to_trump_card(x,y,mypath,d,g,mycolor){
    ///this size is always 5x6, unless scaled by 'scaleX', and/or 'scaleY'
    ///the fontsize is always '11pt', unless scaled by 'scaleX', and/or setting to a 
    /// this.viewport_unit other than 5mm
    ///'mycolor' is 'red' for diamond and heart, and 'black' for spade and club
    ///the card 
    let scaleX = this.g_to_scaleX_float(g);
    let scaleY = this.g_to_scaleY_float(g);
    let innersquare = '(0,0) <h:3> <v:4> <h:-3> <z>';
    let [sq] = this.read_coords(innersquare,{});
    let [q] = this.read_coords(mypath,{});
    var q1 = this.dup_coords(q);
    var q2 = this.dup_coords(q);
    this.offset_coords(sq,x+1*scaleX,y+1*scaleY,scaleX,scaleY);
    this.offset_coords(q,x,y,scaleX,scaleY);
    this.offset_coords(q1,x+(0.25*scaleX),y+4.50*scaleY,0.5*scaleX,0.5*scaleY);
    this.offset_coords(q2,x+(1.5*scaleX),y+(2*scaleY),2.0*scaleX,2.0*scaleY);
    let fontsize = 11*this.viewport_unit/5*scaleX;
    var all = [];
    let q4 = this.to_q_RREC(x,y,5*scaleX,6*scaleY,0.4*scaleX,0.4*scaleY);
    all.push(this.p_drawpath(q4,g));//draw paper background
    ///prepare 'g' for text, heart, diamond, club and spade drawing
    g = {...g,fontcolor:mycolor,fillcolor:mycolor,fontsize:fontsize,linesize:0,hints:0}
    if(d==='10'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'10','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,2*scaleX,0*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0*scaleX,-1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0*scaleX,-1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0*scaleX,-1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,-1*scaleX,0.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0*scaleX,2*scaleY);
      all.push(this.p_fillpath(q,g));
    }else if(d==='9'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'9','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,2*scaleX,0);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,-1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,-1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,-1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,-1*scaleX,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
    }else if(d==='8'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'8','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,-1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
    }else if(d==='7'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'7','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,-1.5*scaleY);
      //o.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));      
    }else if(d==='6'){
      ///
      all.push(this.p_text(x+(0.5*scaleX),y+(0.5+5)*scaleX,'6','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      //o.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,-1.5*scaleY);
      //o.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));           
    }else if(d==='5'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'5','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));       
    }else if(d==='4'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'4','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,1*scaleX,-1.5*scaleY);
      this.offset_coords(q,1*scaleX,-1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));        
    }else if(d==='3'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'3','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,2*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fillpath(q,g));
    }else if(d==='2'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'2','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      this.offset_coords(q,2*scaleX,1*scaleY);
      all.push(this.p_fillpath(q,g));
      this.offset_coords(q,0,3*scaleY);
      all.push(this.p_fillpath(q,g));
    }else if(d==='A'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'A','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      all.push(this.p_fillpath(q2,g));
    }else if(d==='J'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'J','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      all.push(this.p_strokepath(sq,{...g,linesize:0,linecolor:'lightgray'}));      
      ///
      let myjack = '(0.5,0.5) <a:0.4,0.4,0,0,1,1.8,0> <z> (0.5,0.5) <l:1.2,-0.5> <q:0.5,0,0.8,0.2> <l:-0.2,0.3> <z>';
      let [jack] = this.read_coords(myjack,{});
      this.offset_coords(jack,x+1*scaleX,y+1*scaleY,scaleX,scaleY);
      this.offset_coords(jack,0,2*scaleY);
      all.push(this.p_drawpath(jack,g));
      all.push(this.p_text(x+2.5*scaleX,y+3*scaleY,"JACK",'b',g)) 
    }else if(d==='Q'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'Q','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      all.push(this.p_strokepath(sq,{...g,linesize:0,linecolor:'lightgray'}));      
      ///
      let myjack = '(0.75,0.25) <q:0.75,-0.5,1.5,0> <l:0.25,0.75> <l:-0.5,-0.4> <l:0,0.5> <l:-0.25,-0.5> <l:-0.25,0.75> <l:-0.25,-0.75> <l:-0.25,0.5> <l:0,-0.5> <l:-0.5,0.4> <z> &circle{(2.5,1),0.1} &circle{(2,1.05),0.1} &circle{(1.5,1.35),0.1} &circle{(1,1.05),0.1} &circle{(0.5,1),0.1}';
      let [jack] = this.read_coords(myjack,{});
      this.offset_coords(jack,x+1*scaleX,y+1*scaleY,scaleX,scaleY);
      this.offset_coords(jack,0,2*scaleY);
      all.push(this.p_drawpath(jack,g));      
      all.push(this.p_text(x+2.5*scaleX,y+3*scaleY,"QUEEN",'b',g)) 
    }else if(d==='K'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'K','c',g))
      all.push(this.p_fillpath(q1,g));
      ///
      all.push(this.p_strokepath(sq,{...g,linesize:0,linecolor:'lightgray'}));      
      ///
      let myjack = '(0.5,0) <h:2> <v:0.85> <l:-0.25,-0.25> <l:-0.25,0.35> <l:-0.25,-0.25> <l:-0.25,0.55> <l:-0.25,-0.55> <l:-0.25,0.25> <l:-0.25,-0.35> <l:-0.25,0.25> <z> &circle{(2.5,0.85),0.1} &circle{(2,1.00),0.1} &circle{(1.5,1.35),0.1} &circle{(1,1.0),0.1} &circle{(0.5,0.85),0.1}';
      let [jack] = this.read_coords(myjack,{});
      this.offset_coords(jack,x+1*scaleX,y+1*scaleY,scaleX,scaleY);
      this.offset_coords(jack,0,2*scaleY);
      all.push(this.p_drawpath(jack,g));     
      all.push(this.p_text(x+2.5*scaleX,y+3*scaleY,"KING",'b',g)) 
    }
    return all.join('\n');
  }
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////
  to_SECTOR(cx,cy,r,ri,start,span){
    var p = [];
    if(span<0){
      start += span;
      span = -span;
    }
    var outer = r;
    var inner = ri;
    if(inner > outer){
      inner = outer;
    }
    var inner_sx = cx + inner*Math.cos(start/180*Math.PI) 
    var inner_sy = cy + inner*Math.sin(start/180*Math.PI);
    var inner_tx = cx + inner*Math.cos((start+span)/180*Math.PI);
    var inner_ty = cy + inner*Math.sin((start+span)/180*Math.PI);
    var outer_sx = cx + outer*Math.cos(start/180*Math.PI) 
    var outer_sy = cy + outer*Math.sin(start/180*Math.PI);
    var outer_tx = cx + outer*Math.cos((start+span)/180*Math.PI);
    var outer_ty = cy + outer*Math.sin((start+span)/180*Math.PI);
    // p.push([cx,cy,'M'])
    p.push([inner_sx,inner_sy,'M']);
    if(inner>0){
      p.push([inner_tx,inner_ty,'A','','','','',inner,inner,0,(span>180)?1:0,0]);
    }
    p.push([outer_tx,outer_ty,'L']);
    p.push([outer_sx,outer_sy,'A','','','','',outer,outer,0,(span>180)?1:0,1]);
    p.push([0,0,'z']);    
    return p;
  }
  to_ARC(cx,cy,r,start,span){
    var p = [];
    if(span<0){
      start += span;
      span = -span;
    }
    var sx = cx + r*Math.cos(start/180*Math.PI) 
    var sy = cy + r*Math.sin(start/180*Math.PI);
    var tx = cx + r*Math.cos((start+span)/180*Math.PI);
    var ty = cy + r*Math.sin((start+span)/180*Math.PI);
    p.push([sx,sy,'M']);
    p.push([tx,ty,'A','','','','',r,r,0,(span>180)?1:0,0]);
    return p;
  }
  to_PIE(cx,cy,r,start,span){
    var p = [];
    if(span<0){
      start += span;
      span = -span;
    }
    var sx = cx + r*Math.cos(start/180*Math.PI) 
    var sy = cy + r*Math.sin(start/180*Math.PI);
    var tx = cx + r*Math.cos((start+span)/180*Math.PI);
    var ty = cy + r*Math.sin((start+span)/180*Math.PI);
    p.push([cx,cy,'M']);
    p.push([sx,sy,'L']);
    p.push([tx,ty,'A','','','','',r,r,0,(span>180)?1:0,0]);
    p.push([0,0,'z']);
    return p;
  }
  to_SEGMENT(cx,cy,r,start,span){
    var p = [];
    if(span<0){
      start += span;
      span = -span;
    }
    var sx = cx + r*Math.cos(start/180*Math.PI) 
    var sy = cy + r*Math.sin(start/180*Math.PI);
    var tx = cx + r*Math.cos((start+span)/180*Math.PI);
    var ty = cy + r*Math.sin((start+span)/180*Math.PI);
    p.push([sx,sy,'M']);
    p.push([tx,ty,'A','','','','',r,r,0,(span>180)?1:0,0]);
    p.push([0,0,'z']);
    return p;
  }
  to_CIRCLE(cx,cy,r){
    var p = [];
    p.push([cx+r,cy,'M']);
    p.push([cx,cy+r,'A','','','','',r,r,0,0,0]);
    p.push([cx-r,cy,'A','','','','',r,r,0,0,0]);
    p.push([cx,cy-r,'A','','','','',r,r,0,0,0]);
    p.push([cx+r,cy,'A','','','','',r,r,0,0,0]);
    p.push([0,0,'z']);
    return p;
  }
  to_q_RECT(x,y,w,h){
    var p = [];
    p.push([x,y,'M']);
    p.push([x+w,y,'L']);
    p.push([x+w,y+h,'L']);
    p.push([x,y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_RREC(x,y,w,h,Dx=0,Dy=0){
    var p = [];
    if(!Dx) Dx = 0.2*w;
    if(!Dy) Dy = 0.2*h;
    p.push([x,y+Dy,'M']);    
    p.push([x+Dy,y,'Q',x,y]);
    p.push([x+w-Dx,y,'L']);
    p.push([x+w,y+Dy,'Q',x+w,y]);
    p.push([x+w,y+h-Dy,'L']);
    p.push([x+w-Dx,y+h,'Q',x+w,y+h]);
    p.push([x+Dx,y+h,'L']);
    p.push([x,y+h-Dy,'Q',x,y+h]);
    p.push([0,0,'z']);
    return p;
  }
  to_q_UTRI(x,y,w,h){
    var p = [];
    p.push([x,y,'M']);    
    p.push([x+w,y,'L']);
    p.push([x+w/2,y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_DTRI(x,y,w,h){
    var p = [];
    p.push([x,y+h,'M']);    
    p.push([x+w,y+h,'L']);
    p.push([x+w/2,y,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_HEXO(x,y,w,h){
    let gap = 0.2*w;
    let hh = h*0.5;
    var p = [];
    p.push([x+gap,y,'M']);
    p.push([x+w-gap,y,'L']);
    p.push([x+w,y+hh,'L']);
    p.push([x+w-gap,y+h,'L']);
    p.push([x+gap,y+h,'L']);
    p.push([x,y+hh,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_PARA(x,y,w,h){
    var gap = 0.2*w;
    var p = [];
    p.push([x,y,'M']);
    p.push([x+w-gap,y,'L']);
    p.push([x+w,y+h,'L']);
    p.push([x+gap,y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_RHOM(x,y,w,h){
    var p = [];
    var ww = w/2;
    var hh = h/2;
    p.push([x+ww,y,'M']);
    p.push([x+w,y+hh,'L']);
    p.push([x+ww,y+h,'L']);
    p.push([x,y+hh,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_ELLI(x,y,w,h){
    var p = [];
    var ww = w/2;
    var hh = h/2;
    var wc = 0.55228475 * w/2;
    var hc = 0.55228475 * h/2;
    p.push([x,y+hh,'M']);
    p.push([x+ww,y,'C',x,y+hh-hc,x+ww-wc,y]);
    p.push([x+w,y+hh,'C',x+ww+wc,y,x+w,y+hh-hc]);
    p.push([x+ww,y+h,'C',x+w,y+hh+hc,x+ww+wc,y+h]);
    p.push([x,y+hh,'C',x+ww-wc,y+h,x,y+hh+hc])
    p.push([0,0,'z']);
    return p;
  }
  to_q_TERM(x,y,w,h){
    var p = [];
    var ww = w/2;
    var hh = h/2;
    var gap = Math.min(ww,hh);
    var cc = 0.55228475 * gap;
    p.push([x+gap,y,'M']);
    p.push([x+w-gap,y,'L']);
    p.push([x+w,y+gap,'C',x+w-gap+cc,y,x+w,y+gap-cc]);
    p.push([x+w,y+h-gap,'L']);
    p.push([x+w-gap,y+h,'C',x+w,y+h-gap+cc,x+w-gap+cc,y+h]);
    p.push([x+gap,y+h,'L']);
    p.push([x,y+h-gap,'C',x+gap-cc,y+h,x,y+h-gap+cc]);
    p.push([x,y+gap,'L']);
    p.push([x+gap,y,'C',x,y+gap-cc,x+gap-cc,y]);
    p.push([0,0,'z']);
    return p;
  }
  to_q_RDEL(x,y,w,h){
    var p = [];
    var ww = w/2;
    var hh = h/2;
    var gap = Math.min(ww,hh);
    var cc = 0.55228475 * gap;
    p.push([x,y,'M']);
    p.push([x+w-gap,y,'L']);
    p.push([x+w,y+gap,'C',x+w-gap+cc,y,x+w,y+gap-cc]);
    p.push([x+w,y+h-gap,'L']);
    p.push([x+w-gap,y+h,'C',x+w,y+h-gap+cc,x+w-gap+cc,y+h]);
    p.push([x,y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_LDEL(x,y,w,h){
    var p = [];
    var ww = w/2;
    var hh = h/2;
    var gap = Math.min(ww,hh);
    var cc = 0.55228475 * gap;
    p.push([x+gap,y,'M']);
    p.push([x+w,y,'L']);
    p.push([x+w,y+h,'L']);
    p.push([x+gap,y+h,'L']);
    p.push([x,y+h-gap,'C',x+gap-cc,y+h,x,y+h-gap+cc]);
    p.push([x,y+gap,'L']);
    p.push([x+gap,y,'C',x,y+gap-cc,x+gap-cc,y]);
    p.push([0,0,'z']);
    return p;
  }
  to_q_SDOC(x,y,w,h){
    var p = [];
    var ww = w/2;
    var hh = h/2;
    var gap = Math.min(ww,hh);
    var cc = 0.55228475 * gap;
    p.push([x,y,'M']);
    p.push([x+ww,y,'Q',x+ww/2,y-ww/6]);
    p.push([x+w,y,'Q',x+w-ww/2,y+ww/6]);
    p.push([x+w,y+h,'L']);
    p.push([x,y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_MDOC(x,y,w,h){
    var p = [];
    var arr = [[x+0.1*w,y+0.1*h],[x+0.05*w,y+0.05*h],[x,y]];
    var w = 0.9*w;
    var h = 0.9*h;
    for(let i=0; i < arr.length; ++i){
      x = arr[i][0];
      y = arr[i][1];
      var ww = w/2;
      var hh = h/2;
      var gap = Math.min(ww,hh);
      var cc = 0.55228475 * gap;
      p.push([x,y,'M']);
      p.push([x+ww,y,'Q',x+ww/2,y-ww/6]);
      p.push([x+w,y,'Q',x+w-ww/2,y+ww/6]);
      p.push([x+w,y+h,'L']);
      p.push([x,y+h,'L']);
      p.push([0,0,'z']);
    }
    return p;
  }
  to_q_STOR(x,y,w,h){
    var p = [];
    var hh = 0.1*h;
    var gh = 0.1*h;
    p.push([x,     y+h-hh,'M']);
    p.push([x,     y+hh,'L']);
    p.push([x+w/2, y,'Q',x,y]);
    p.push([x+w,   y+hh,'Q',x+w,y]);
    p.push([x+w,   y+h-hh,'L']);
    p.push([x+w/2, y+h,'Q',x+w,y+h]);
    p.push([x,     y+h-hh,'Q',x,y+h]);
    p.push([0,0,'z']);
    for(let i=0; i < 3; ++i){
      let dx = -(i)*0.1*h;
      p.push([x,     dx+y+h-hh,'M']);
      p.push([x+w/2, dx+y+h-hh-hh,'Q',x,dx+y+h-hh-hh]);
      p.push([x+w,   dx+y+h-hh,'Q',x+w,dx+y+h-hh-hh]);
    }
    return p;
  }
  to_q_FORM(x,y,w,h){
    var p = [];
    var hh = 0.2*h;
    var ww = 0.2*w;
    var gap = Math.min(hh,ww);
    p.push([x,     y,'M']);
    p.push([x+w,   y,'L']);
    p.push([x+w,   y+h,'L']);
    p.push([x,     y+h,'L']);
    p.push([0,0,'z']);
    p.push([x+gap,y,'M']);
    p.push([x+gap,y+h,'L']);
    p.push([x,y+h-gap,'M']);
    p.push([x+w,y+h-gap,'L']);
    return p;
  }
  to_q_SUBP(x,y,w,h){
    var p = [];
    var hh = 0.10*h;
    var ww = 0.10*w;
    var gap = Math.min(hh,ww);
    p.push([x,     y,'M']);
    p.push([x+w,   y,'L']);
    p.push([x+w,   y+h,'L']);
    p.push([x,     y+h,'L']);
    p.push([0,0,'z']);
    p.push([x+gap,y,'M']);      p.push([x+gap,y+h,'L']);
    p.push([x+w-gap,y,'M']);    p.push([x+w-gap,y+h,'L']);
    return p;
  }
  to_q_DOBJ(x,y,w,h){
    var p = [];
    var hh = 0.50*h;
    var ww = 0.50*w;
    p.push([x,     y+hh,'M']);
    p.push([x+ww,  y,'L']);
    p.push([x+w,   y+hh,'L']);
    p.push([x+w,   y+h,'L']);
    p.push([x,     y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_UOBJ(x,y,w,h){
    var p = [];
    var hh = 0.50*h;
    var ww = 0.50*w;
    p.push([x,     y+hh,'M']);
    p.push([x,     y,'L']);
    p.push([x+w,   y,'L']);
    p.push([x+w,   y+hh,'L']);
    p.push([x+ww,  y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_LOBJ(x,y,w,h){
    var p = [];
    var hh = 0.50*h;
    var ww = 0.50*w;
    p.push([x,     y+hh,'M']);
    p.push([x+ww,  y,'L']);
    p.push([x+w,   y,'L']);
    p.push([x+w,   y+h,'L']);
    p.push([x+ww,  y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }
  to_q_ROBJ(x,y,w,h){
    var p = [];
    var hh = 0.50*h;
    var ww = 0.50*w;
    p.push([x,     y+h,'M']);
    p.push([x,     y,'L']);
    p.push([x+ww,  y,'L']);
    p.push([x+w,   y+hh,'L']);
    p.push([x+ww,  y+h,'L']);
    p.push([0,0,'z']);
    return p;
  }  
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////
  to_q_pie(cx,cy,r,start_a,span_a){
    var bigarcflag = 0;//1=big arc,0=small
    var sweepflag = 0;//0=anticlockwise,1=clockwise
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
    var y = cy + r*Math.sin(a / 180 * Math.PI);
    var q = [];
    q.push([cx,cy,'M', '','','','', 0,0,0,0,0, 0]);
    q.push([x,y,'L', '','','','', 0,0,0,0,0, 0]);
    for(var j=1; j < all_a.length; ++j){
      var a = all_a[j];
      var x = cx + r*Math.cos(a / 180 * Math.PI);
      var y = cy + r*Math.sin(a / 180 * Math.PI);  
      q.push([x,y,'A', '','','','', r,r,0,bigarcflag,sweepflag, 0]);
    }
    q.push([0,0,'z']);
    return q;
  }
  to_q_arc(cx,cy,r,start_a,span_a){
    var bigarcflag = 0;//1=big arc,0=small
    var sweepflag = 0;//0=anticlockwise,1=clockwise
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
    var y = cy + r*Math.sin(a / 180 * Math.PI);
    var q = [];
    q.push([x,y,'M', '','','','', 0,0,0,0,0, 0]);
    for(var j=1; j < all_a.length; ++j){
      var a = all_a[j];
      var x = cx + r*Math.cos(a / 180 * Math.PI);
      var y = cy + r*Math.sin(a / 180 * Math.PI);  
      q.push([x,y,'A', '','','','', r,r,0,bigarcflag,sweepflag, 0]);
    }
    return q;
  }
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////
  offset_by_dx_dy(dx,dy,ta,x,y){
    if(ta.length==0){
      ta = 'ur';
    }
    switch(ta){
      case 'ur':  x += dx, y += dy; break;
      case 'br':  x += dx, y -= dy; break;
      case 'ul': x -= dx, y += dy; break;
      case 'bl': x -= dx, y -= dy; break;
      case 'u':  y += dy; break;
      case 'b':  y -= dy; break;
      case 'r':   x += dx; break;
      case 'l':  x -= dx; break;
    }
    return [x,y];
  }
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////
  qbezier_point(t,p0,p1,p2){
    var x = (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
    var y = (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];
    return [x,y];
  }
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////
  string_to_lasthints(s){
    ///s='linedashed|linesize2'
    var ss = s.split('|');
    var n = 0;
    ss = ss.map((s) => {
      let key = `hint_${s}`;
      if(this.hasOwnProperty(key)){
        key = parseInt(this[key]);
        return key;
      }
      return NaN;
    });
    ss = ss.filter((s) => Number.isFinite(s));
    n = ss.reduce((acc,cur) => acc + cur, 0);
    return n;
  }
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////
  parse_complex(s){
    try{
      return Complex.create(s);
    }catch(e){
      return Complex.NAN;
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////
  symbol_to_int(symbol,env){
    if(env.hasOwnProperty(symbol)){
      let m = env[symbol];
      if(m && Array.isArray(m)){
        return NaN;
      }else if(m && m instanceof Complex){
        return parseInt(m.re);
      }else if(typeof m === 'number'){
        return parseInt(m);
      }else if(typeof m === 'string'){
        return parseInt(m);
      }else{
        return NaN;
      }
    }
  }
  symbol_to_float(symbol,env){
    if(env.hasOwnProperty(symbol)){
      let m = env[symbol];
      if(m && Array.isArray(m)){
        return NaN;
      }else if(m && m instanceof Complex){
        return parseFloat(m.re);
      }else if(typeof m === 'number'){
        return parseFloat(m);
      }else if(typeof m === 'string'){
        return parseFloat(m);      
      }else{
        return NaN;
      }
    }
  }
  symbol_to_string(symbol,env){
    if(env.hasOwnProperty(symbol)){
      let m = env[symbol];
      if(m && Array.isArray(m)){
        return m.toString();
      }else if(m && m instanceof Complex){
        return m.toString();
      }else if(typeof m === 'number'){
        return m.toString();
      }else if(typeof m === 'string'){
        return m;
      }else{
        return m.toString();
      }
    }
  }
  extract_named_floats(s,env){
    var ss = s.split(':');
    var ss = ss.map(x => x.trim());
    var name = ss[0]||'';
    var val = ss[1]||'';
    var val = `[${val}]`;
    var numbers = this.expr.read_arr(val,env);
    var floats = this.numbers_to_floats(numbers);
    return [name,floats];
  }
  extract_named_float(s,env){
    let [name,floats] = this.extract_named_floats(s,env);
    let num = 0;
    if(floats.length){
      let v = floats[0];
      if(Number.isFinite(v)){
        num = v;
      }
    }
    return [name,num];
  }
  extract_named_string(s,env){
    var ss = s.split(':');
    var ss = ss.map(x => x.trim());
    var name = ss[0]||'';
    var val = ss[1]||'';
    return [name,val];
  }
  extract_float(s,env){
    var val = `[${s}]`;
    var numbers = this.expr.read_arr(val,env);
    var floats = this.numbers_to_floats(numbers);
    let num = 0;
    if(floats.length){
      let v = floats[0];
      if(Number.isFinite(v)){
        num = v;
      }
    }
    return num;
  }
  ////////////////////////////////////////////////////////////////
  // return [args,line]
  ////////////////////////////////////////////////////////////////
  extract_cmd_args(key,line){
    var v;
    var args = [];
    while(line.length){
      if((v=this.re_cmd_key(line))!==null){
        return args;
      }else if((v=this.re_cmd_directive.exec(line))!==null){
        args.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_paren.exec(line))!==null){
        args.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_brack.exec(line))!==null){
        args.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_vert.exec(line))!==null){
        args.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_solid.exec(line))!==null){
        args.push(v[1]);
        line = v[2];
      }else{
        return args;
      }
    }
  }
  extract_commands(line){
    line = line.trimStart();
    ///tokenizes all keys and tokens
    var tokens = [];
    while(line.length){
      if((v=this.re_cmd_key(line))!==null){
        tokens.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_directive.exec(line))!==null){
        tokens.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_paren.exec(line))!==null){
        tokens.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_brack.exec(line))!==null){
        tokens.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_vert.exec(line))!==null){
        tokens.push(v[1]);
        line = v[2];
      }else if((v=this.re_cmd_solid.exec(line))!==null){
        tokens.push(v[1]);
        line = v[2];
      }else{
        break;
      }
    }
    ///group tokens into bands
    var bands = [];
    var band = [];
    while(tokens.length){
      let token = tokens.shift();
      if(token.startsWith('\\')){
        band = [];
        band.push(token);
        bands.push(band);
      }else{
        band.push(token);
      }
    }
    ///form cmds based on bands
    var cmds = [];
    while(bands.length){
      let cmd = this.to_command(bands);
      if(!cmd){
        break;
      }
      cmds.push(cmd);
    }
    return cmds;
  }
  to_command(bands){
    if(bands[0][0]=='\\if'){
      let cmd = bands.shift();
      while(bands.length){
        let arg = this.to_command(bands);
        if(!arg){
          break;
        }
        if(arg[0]=='\\fi'){
          cmd.push(arg);
          break;
        }
        cmd.push(arg);
        continue;
      }
      return cmd;
    }else if(bands[0][0]=='\\do'){
      let cmd = bands.shift();
      while(bands.length){
        let arg = this.to_command(bands);
        if(!arg){
          break;
        }
        if(arg[0]=='\\done'){
          cmd.push(arg);
          break;
        }
        cmd.push(arg);
        continue;
      }
      return cmd;
    }else{
      let cmd = bands.shift();
      return cmd;
    }
  }
  ////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////
  parse_image_args(s){
    const re_opt = /^\{(.*?)\}\s*(.*)$/;
    const re_src = /^"(.*?)"\s*(.*)$/;
    const re_pos = /^\((.*?)\)\s*(.*)$/;
    var v;
    var opts = {};
    var srcs = [];
    var pos = [];
    while(s.length){
      if((v=re_src.exec(s))!==null){
        srcs.push(v[1]);
        s = v[2];
      }else if((v=re_opt.exec(s))!==null){
        opts = this.string_to_style(v[1],opts);
        s = v[2];
      }else if((v=re_opt.exec(s))!==null){
        pos  = v[1].split(',');
        s = v[2];
      }else{
        break;
      }
    }
    return {opts,srcs,pos}
  }
}
module.exports = { NitrilePreviewDiagram };
























