'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewExpr } = require('./nitrile-preview-expr');
const { makeknots, mp_make_choices } = require('./nitrile-preview-mppath');
const w3color = require('./nitrile-preview-w3color');
const { Complex } = require('./nitrile-preview-complex');

class NitrilePreviewDiagram extends NitrilePreviewBase {

  constructor(translator) {
    super();
    this.translator = translator;
    this.w3color = w3color;
    this.expr = new NitrilePreviewExpr(this);
    /// all ss maps
    this.MAX_ARRAY = 256;
    this.MAX_FLOAT = 2048;
    this.MIN = 0.000001;
    this.MM_TO_PT = 2.835;
    this.PT_TO_MM = 1/2.835;
    this.RATIO_CIRCLE_TO_CUBIC = 0.5522847498307933984022516322796;/// (or without rounding: 4*(sqrt(2)-1)/3)
    /// range expression
    this.re_range_two = /^([^:]+):([^:]+)$/;
    this.re_range_three = /^([^:]+):([^:]+):([^:]+)$/;
    /// regular expression for non-action commands
    this.re_else_command = /^\\else$/;
    this.re_elif_command = /^\\elif\s+(.*)\s*\\then$/;
    this.re_if_command = /^\\if\s+(.*)\s*\\then$/;
    this.re_for_command = /^\\for\s+(.*)\s*\\do$/;
    this.re_config_command = /^\\config\s+(\w+)\s*(.*)$/;
    this.re_exit_command = /^\\exit/;
    this.re_sub_command = /^\\subtitle\s*(.*)$/;
    this.re_path_command = /^\\path\s+(.*?)\s*\=\s*(.*)$/;
    this.re_fn_command =    /^\\fn\s+([A-Za-z][A-Za-z0-9]*)\((.*?)\)\s*=\s*(.*)$/;
    this.re_var_command = /^\\var\s+([A-Za-z][A-Za-z0-9]*)(\[\]|)\s*=\s*(.*)$/;
    this.re_group_command = /^\\group\s+(\w+)\s*=\s*(.*)$/;
    this.re_origin_command = /^\\origin\s+(.*)$/;
    this.re_lastpt_command = /^\\lastpt\s+(.*)$/;
    this.re_show_command = /^\\show\s+(.*)$/;
    /// a, a0, a0a
    this.re_is_symbolname = /^([A-Za-z][A-Za-z0-9]*)$/;
    // @rgb(a|b|c) or @hwb(a|b|c)
    this.re_is_colorfunction =  /^@([A-Za-z][A-Za-z0-9]*)\((.*)\)$/;
    // when reading numbers
    this.re_numbers_is_fn            = /^\^fn:(\w+)\s*(.*)$/;
    this.re_numbers_is_list          = /^\[(.*?)\]\s*(.*)$/;
    this.re_numbers_is_solid         = /^(\S+)\s*(.*)$/;
    // when reading coords
    this.re_coords_is_label          = /^\"([^"]*)\"\s*(.*)$/;
    this.re_coords_is_style          = /^\{(.*?)\}\s*(.*)$/;
    this.re_coords_is_pathfunc       = /^&([A-Za-z][A-Za-z0-9]+)\{(.*?)\}\s*(.*)$/;
    this.re_coords_is_pathvar        = /^&([A-Za-z][A-Za-z0-9]*_\d+|[A-Za-z][A-Za-z0-9]*)\s*(.*)$/;
    this.re_coords_is_aux            = /^\^([A-Za-z]+)(:?)(\S*)\s*(.*)$/;
    this.re_coords_is_point          = /^\((.*?)\)\s*(.*)$/;
    this.re_coords_is_relative       = /^\[(.*?)\]\s*(.*)$/;
    this.re_coords_is_dashdot        = /^(~+|\.+|\-+)\s*(.*)$/;
    this.re_coords_is_join           = /^\|(.*?)\|\s*(.*)$/;
    // this.re_scientific_notation = /^(\d+[eE](?:\+|\-|)\d+)(.*)$/;
    /// some preset values
    this.fontsize = 12;
    this.dotsize = 5;
    this.barlength = 0.40;
    this.shear = 0.1;
    this.w = 3;
    this.h = 2;
    this.r = 1;
    this.protrude = 1;
    this.span = 45;
    this.rdx = '20%';
    this.rdy = '20%';
    this.gridcolor = '@rgb(235|235|235)';
    ///initialize internals, these internals are to be reset 
    /// for each instance of diagram invoation
    this.init_internals();
  }
  init_internals(){
    /// clipathid
    //this.my_clipath_id = 0;
    /// the subtitle text
    this.sub = '';
    /// configuration parameters
    this.config = {}; 
    /// all translated commands in SVG or MP/MF
    this.commands = [];
    /// the last configured barchar coord
    this.my_barchart = {};
    /// the last configured lego coord
    this.my_lego = {};
    /// the last configured argand coord
    this.my_argands = {};
    /// the last configured trump settings
    this.my_trumps = {};
    /// path
    this.my_path_map = new Map();
    /// all funcs defined by 'fn' command
    this.my_fn_map = new Map();
    /// all group defined by 'group' command
    this.my_group_map = new Map();
    /// all cars
    this.my_car_map = new Map();
    /// all nodes
    this.my_node_map = new Map();
    /// all recordings
    this.my_box_map = new Map();
    /// all cartesians
    this.my_cartesian_map = new Map();
    /// all the linesegs
    this.my_lineseg_array = [];
    /// lastpt
    this.lastpt_x = 0;
    this.lastpt_y = 0;
    /// viewport
    this.viewport_width = 12;
    this.viewport_height = 7;
    this.viewport_unit = 5;
    /// origin
    this.origin_x = 0;
    this.origin_y = 0;
    this.origin_sx = 1;
    this.origin_sy = 1;
  }
  do_origin_command(val) {
    var ss = this.string_to_array(val);
    ///
    /// set origin ^at:&center
    /// set origin ^at:&origin
    /// set origin ^left:2 ^right:2 ^up:2 ^down:2
    /// set origin ^x:2 ^y:2 
    ///
    ss.forEach((val,i,arr) => {
      if(val.startsWith('^left:')){
        let s = val.substr(6);
        let x = parseFloat(s);
        if(Number.isFinite(x)){
          this.origin_x -= x;
        }
      }else if(val.startsWith('^right:')){
        let s = val.substr(7);
        let x = parseFloat(s);
        if(Number.isFinite(x)){
          this.origin_x += x;
        }
      }else if(val.startsWith('^up:')){
        let s = val.substr(4);
        let y = parseFloat(s);
        if(Number.isFinite(y)){
          this.origin_y += y;
        }
      }else if(val.startsWith('^down:')){
        let s = val.substr(6);
        let y = parseFloat(s);
        if(Number.isFinite(y)){
          this.origin_y -= y;
        }
      }else if(val.startsWith('^x:')){
        let s = val.substr(3);
        let x = parseFloat(s);
        if(Number.isFinite(x)){
          this.origin_x = x;
        }
      }else if(val.startsWith('^y:')){
        let s = val.substr(3);
        let y = parseFloat(s);
        if(Number.isFinite(y)){
          this.origin_y = y;
        }
      }else if(val.startsWith('^X:')){
        let s = val.substr(3);
        let x = parseFloat(s);
        if(Number.isFinite(x)){
          this.origin_x = this.viewport_width-x;
        }
      }else if(val.startsWith('^Y:')){
        let s = val.substr(3);
        let y = parseFloat(s);
        if(Number.isFinite(y)){
          this.origin_y = this.viewport_height-y;
        }
      }else if(val.startsWith('^pt:')){
        let symbol = val.substr(4);
        if(this.re_is_symbolname.test(symbol)){
          let pt = [0,0,'M','','','','', 0,0,0,0,0, 0];
          pt[0] = this.origin_x;
          pt[1] = this.origin_y;
          let p = [pt];
          this.my_path_map.set(symbol,p);
          this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
        }
      }else if(val.startsWith('^at:')){
        let symbol = val.substr(4);
        //NOTE: at:a
        let p = this.get_path_from_symbol(symbol);
        let pt = this.point(p,0);
        if(this.isvalidpt(pt)){
          this.origin_x = pt[0];
          this.origin_y = pt[1];
        }
      }else if (!val.localeCompare('^center')){
        this.origin_x = this.viewport_width/2; 
        this.origin_y = this.viewport_height/2; 
      }else if (!val.localeCompare('^north')){
        this.origin_x = this.viewport_width/2; 
        this.origin_y = this.viewport_height; 
      }else if (!val.localeCompare('^south')){
        this.origin_x = this.viewport_width/2; 
        this.origin_y = 0; 
      }else if (!val.localeCompare('^west')){
        this.origin_x = 0; 
        this.origin_y = this.viewport_height/2; 
      }else if (!val.localeCompare('^east')){
        this.origin_x = this.viewport_width; 
        this.origin_y = this.viewport_height/2; 
      }else if (!val.localeCompare('^northwest')){
        this.origin_x = 0; 
        this.origin_y = this.viewport_height; 
      }else if (!val.localeCompare('^northeast')){
        this.origin_x = this.viewport_width; 
        this.origin_y = this.viewport_height; 
      }else if (!val.localeCompare('^southwest')){
        this.origin_x = 0; 
        this.origin_y = 0; 
      }else if (!val.localeCompare('^southeast')){
        this.origin_x = this.viewport_width; 
        this.origin_y = 0; 
      }else if(val.startsWith('^s:')){
        // '^s:1.25'
        let s = val.substr(3);
        s = parseFloat(s);
        if(Number.isFinite(s)){
          this.origin_sx = s;
          this.origin_sy = s;
          this.origin_x *= s;
          this.origin_y *= s;
        }
      }else if(val.startsWith('^sx:')){
        // '^sx:1.25'
        let sx = val.substr(4);
        sx = parseFloat(sx);
        if(Number.isFinite(sx)){
          this.origin_sx = sx;
          this.origin_x *= sx;
        }
      }else if(val.startsWith('^sy:')){
        // '^sy:1.25'
        let sy = val.substr(4);
        sy = parseFloat(sy);
        if(Number.isFinite(sy)){
          this.origin_sy = sy;
          this.origin_y *= sy;
        }
      }else if(val.startsWith('^reset')){
        this.origin_x = 0;
        this.origin_y = 0;
        this.origin_sx = 1;
        this.origin_sy = 1;
      }
    });
  }
  do_lastpt_command(val) {
    var ss = this.string_to_array(val);
    ///
    /// lastpt ^at:center
    /// lastpt ^at:origin
    /// lastpt ^left:2 ^right:2 ^up:2 ^down:2
    /// lastpt ^x:2 ^y:2 
    ///
    ss.forEach((val,i,arr) => {
      if(val.startsWith('^left:')){
        let s = val.substr(6);
        let x = parseFloat(s);
        if(Number.isFinite(x)){
          this.lastpt_x -= x;
        }
      }else if(val.startsWith('^right:')){
        let s = val.substr(7);
        let x = parseFloat(s);
        if(Number.isFinite(x)){
          this.lastpt_x += x;
        }
      }else if(val.startsWith('^up:')){
        let s = val.substr(4);
        let y = parseFloat(s);
        if(Number.isFinite(y)){
          this.lastpt_y += y;
        }
      }else if(val.startsWith('^down:')){
        let s = val.substr(6);
        let y = parseFloat(s);
        if(Number.isFinite(y)){
          this.lastpt_y -= y;
        }
      }else if(val.startsWith('^x:')){
        let s = val.substr(3);
        let x = parseFloat(s);
        if(Number.isFinite(x)){
          this.lastpt_x = x;
        }
      }else if(val.startsWith('^y:')){
        let s = val.substr(3);
        let y = parseFloat(s);
        if(Number.isFinite(y)){
          this.lastpt_y = y;
        }
      }else if(val.startsWith('^X:')){
        let s = val.substr(3);
        let x = parseFloat(s);
        if(Number.isFinite(x)){
          this.lastpt_x = this.viewport_width-x;
        }
      }else if(val.startsWith('^Y:')){
        let s = val.substr(3);
        let y = parseFloat(s);
        if(Number.isFinite(y)){
          this.lastpt_y = this.viewport_height-y;
        }
      }else if(val.startsWith('^pt:')){
        let symbol = val.substr(4);
        if(this.re_is_symbolname.test(symbol)){
          let pt = [0,0,'M','','','','', 0,0,0,0,0, 0];
          pt[0] = this.lastpt_x;
          pt[1] = this.lastpt_y;
          let p = [pt];
          this.my_path_map.set(symbol,p);
          this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
        }
      }else if(val.startsWith('^at:')){
        let symbol = val.substr(4);
        //NOTE: at:a
        let p = this.get_path_from_symbol(symbol);
        let pt = this.point(p,0);
        if(this.isvalidpt(pt)){
          this.lastpt_x = pt[0];
          this.lastpt_y = pt[1];
        }
      }else if (!val.localeCompare('^center')){
        this.lastpt_x = this.viewport_width/2; 
        this.lastpt_y = this.viewport_height/2; 
      }else if (!val.localeCompare('^north')){
        this.lastpt_x = this.viewport_width/2; 
        this.lastpt_y = this.viewport_height; 
      }else if (!val.localeCompare('^south')){
        this.lastpt_x = this.viewport_width/2; 
        this.lastpt_y = 0; 
      }else if (!val.localeCompare('^west')){
        this.lastpt_x = 0; 
        this.lastpt_y = this.viewport_height/2; 
      }else if (!val.localeCompare('^east')){
        this.lastpt_x = this.viewport_width; 
        this.lastpt_y = this.viewport_height/2; 
      }else if (!val.localeCompare('^northwest')){
        this.lastpt_x = 0; 
        this.lastpt_y = this.viewport_height; 
      }else if (!val.localeCompare('^northeast')){
        this.lastpt_x = this.viewport_width; 
        this.lastpt_y = this.viewport_height; 
      }else if (!val.localeCompare('^southwest')){
        this.lastpt_x = 0; 
        this.lastpt_y = 0; 
      }else if (!val.localeCompare('^southeast')){
        this.lastpt_x = this.viewport_width; 
        this.lastpt_y = 0; 
      }
    });
  }
  to_diagrams(style,ss){
    var animate = this.g_to_animate_string(style);
    var quantity = this.g_to_count_int(style);
    var env_array = this.animate_to_env_array(animate,quantity);
    var o = [];
    for(let env of env_array){
      var g = {...style,env};
      var { img, sub } = this.to_diagram(g,ss);
      o.push({img,sub}); 
    }
    return o;
  }
  to_diagram(style,ss) {
    var env = {};
    if(style.env && typeof style.env == 'object'){
      env = style.env;
    }
    this.init_internals();
    this.config = {...style};
    var viewport = style.viewport;
    if(viewport){
      let pp = this.translator.string_to_int_array(viewport);
      if(pp[0]){
        this.viewport_width = pp[0];
      }
      if(pp[1]){
        this.viewport_height = pp[1];
      }
      if(pp[2]){
        this.viewport_unit = pp[2];
      }  
    }
    ///
    /// set up some default values and then execute the body
    ///
    this.do_setup();
    this.exec_body(style,ss,env);
    /// 
    /// here all commands has been processed, we will remove emtpy lines
    /// and get ready to call 'do_finalize'
    ///
    var o = this.commands.map(x => x.trim());
    var o = o.filter(s => (s && s.trim().length));
    return this.do_finalize(o.join('\n'),style);
  }
  ///*NOTE: join body lines
  join_body_lines(style,lines) {
    var o = [];
    var s0 = '';
    for (var s of lines) {
      if(o.length){
        var s0 = o[o.length-1];
        if (s0 && s0.endsWith('\\')) {
          s0 = o.pop();
          s0 = s0.slice(0,s0.length-1);///remove the last backslash
          s = `${s0}${s.trimLeft()}`;///add no space between them
          o.push(s);
        }else{
          o.push(s);
        }
      }else{
        o.push(s);
      }
    }
    lines = o;
    ///
    ///copy lines from 'lines' to 'o' and scan for buffer
    ///
    o =[];
    var save_buf = null;
    var v;
    const re_start = /^%+\s*(.*)$/;
    const re_copy = /^\?(\w+)$/;
    const re_paste = /^=(\w+)$/;
    for(var s of lines){
      if((v=re_start.exec(s))!==null){
        s = v[1];
        save_buf = null;
        if((v=re_copy.exec(s))!==null){
          let name = v[1];
          save_buf = [];
          style.buffers[name] = save_buf;
        }else if((v=re_paste.exec(s))!==null){
          let name = v[1];
          let load_buf = style.buffers[name];
          if(load_buf && Array.isArray(load_buf) ){
            o = o.concat(load_buf);
          }
        }
        continue;
      } 
      o.push(s);
      if(save_buf){
        save_buf.push(s);
      }
    }
    return o;
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
      var [line,flag] = this.substitute_dollar_expressions(style,line,env);
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
      //
      //
      if((v=this.re_sub_command.exec(line))!==null) {
        this.sub = this.translator.join_line(this.sub,v[1]);
        continue;
      }
      //
      // config
      //
      if((v = this.re_config_command.exec(line)) !== null) {
        var key = v[1];
        var val = v[2];
        this.config[key] = val;
        if(val=='0'){
          this.config[key] = 0;
        }
        continue;
      }
      //
      // path 
      //
      if((v = this.re_path_command.exec(line)) !== null) {
        let symbol = v[1];
        let [coords] = this.read_coords(v[2],env);
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
        let valid_name = this.re_is_symbolname.test(f.name);
        let valid_args = f.args.filter((s) => this.re_is_symbolname.test(s));
        if(valid_name && valid_args.length == f.args.length){
          this.my_fn_map.set(f.name,f);
          this.do_comment(`*** fn ${f.name}(${f.args.join(',')}) = ${f.expr}`);
        }else{
          this.do_comment(`***ERROR '${f.name}' is not a valid symbol name`);
        }
        continue;
      } 
      //
      // var a = 12.3
      // var a[] = 12.3 12.4 12.5
      // var a = @"%d-%d-%d" 1 2 3
      //  
      if((v=this.re_var_command.exec(line))!==null){
        let name = v[1];
        let arrflag = v[2];
        let s1 = v[3];
        if(this.re_is_symbolname.test(name)){
          if(arrflag){
            let [numbers] = this.read_array(s1,env);//returns an array 'Complex' number
            env[name] = numbers;
            this.do_comment(`*** env ${name}${arrflag} = ${this.array_to_string(numbers)}`);
          }else{
            let a = this.read_scalar(s1,env);
            env[name] = a;
            this.do_comment(`*** env ${name} = ${a}`);          
          }
        }else{
          this.do_comment(`***ERROR '${name}' is not a valid symbol name`);  
        }
        continue;
      }  
      //
      // group mygroup = {linesize:1,w:3,h:2}
      //
      if((v = this.re_group_command.exec(line)) !== null) {
        let id = v[1];
        let g = this.string_to_style(v[2],this.config);//Diagram group
        this.my_group_map.set(id,g);
        continue;
      }
      //
      // origin
      //
      if((v = this.re_origin_command.exec(line)) !== null) {
        var val = v[1].trim();
        this.do_origin_command(val);
        continue;
      }   
      //
      // lastpt
      //
      if((v = this.re_lastpt_command.exec(line)) !== null) {
        var val = v[1].trim();
        this.do_lastpt_command(val);
        continue;
      }   
      //
      // show    
      //
      if((v=this.re_show_command.exec(line))!==null) {
        let s = v[1];
        this.do_comment(`*** show ${s}`);
        console.log(`*** show ${s}`)
        continue;
      } 
      //
      // if-then-end
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
      if((v=this.re_for_command.exec(line)) !== null) {
        // extract all lines underneath it that is indented
        var loopbody = this.extract_for_loop_body(style,lines);
        var max_n = 0;
        var s = v[1];
        var iter_array = [];
        const re_for_one = /^(\w+)\s*in\s*(.*?)\s*;\s*(.*)$/;
        while(s.length){
          if((v=re_for_one.exec(s))!==null) {
            var s = v[3];
            let key = v[1];
            let s1 = v[2];
            let [numbers] = this.read_array(s1,env);//returns an array 'Complex' number
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
          //NOTE: each time set the '@' environment variable to the counter starting with '0'
          env['@']=`${i}`;
          env['_']=i;
          this.do_comment(`*** env _ = ${i}`);
          for(let {key,floats} of iter_array){
            if(i < floats.length){
              let float = floats[i];
              env[key] = float;
              this.do_comment(`*** env ${key} = ${float}`);
            }
          }
          //execute loopbody with the updated 'env'
          this.exec_body(style,loopbody,env);
          continue;
        }
        continue;
      }
      ///only execute lines that do not start with spaces
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
  exec_action_command(style,line,env) {
    // NOTE: that that at this stage all env-variables have been replaced
    const re_command_line = /^\\([A-Za-z][A-Za-z0-9\-]*)(\.\S+|)\s*(.*)$/;
    var v = re_command_line.exec(line);
    if(v===null){
      return '';
    }
    var o = [];
    var cmd = v[1];
    var subcmd = '';
    var subsubcmd = '';
    var opts = this.string_to_command_opts(v[2],env);
    var data = v[3];
    //var [g,txts,data] = this.read_style_and_label(data);
    ///
    ///NOTE: break into cmd/subcmd
    ///
    if(cmd.indexOf('-')>=0){
      let ss = cmd.split('-');
      cmd = ss[0]||'';
      subcmd = ss[1]||'';
      subsubcmd = ss[2]||'';
    }
    ///
    ///NOTE: always set the 'opt' to the first element of 'opts'
    ///
    var [opt] = opts;    
    ///
    ///NOTE: 
    ///
    if (cmd == 'drawlabel'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawlabel(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: 
    ///
    if (cmd == 'drawtext'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawtext(opts,g,txts,coords));///own method
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
    else if (cmd=='drawdot'){
      let [coords,g,txts] = this.read_coords(data,env);
      for (var i = 0; i < coords.length; i++) {
        var z0 = this.point(coords, i);
        if (!this.isvalidpt(z0)) continue;
        var x = z0[0];
        var y = z0[1];
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
    else if (cmd=='drawcontrolpoints') {
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawcontrolpoints(opts,g,txts,coords));//own method
    }
    else if (cmd=='drawanglearc'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawanglearc(opts,g,txts,coords));///own method
    }
    else if (cmd=='drawcongbar'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawcongbar(opts,g,txts,coords));//own method
    }
    else if (cmd=='drawcenteredtext'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawcenteredtext(opts,g,txts,coords));//own method
    }
    else if (cmd == 'drawslopedtext'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawslopedtext(opts,g,txts,coords));///own method
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
    ///NOTE: draw, fill, stroke, arrow, revarrow, dblarrow
    ///
    else if (cmd=='draw'){
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
          o.push(this.to_shape_of_path(p,g,coords,'draw'));//own method
        }
      }else{
        ///draw a path
        o.push(this.p_draw(coords,g));              
      }
    }
    else if (cmd=='fill'){
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
          o.push(this.to_shape_of_path(p,g,coords,'fill'));//own method
        }
      }else{
        o.push(this.p_fill(coords, g));
      }
    }
    else if (cmd=='stroke'){
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
          o.push(this.to_shape_of_path(p,g,coords,'stroke'));//own method
        }
      }else{
        o.push(this.p_stroke(coords, g));
      }
    }
    else if (cmd=='arrow'){
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
          o.push(this.to_shape_of_path(p,g,coords,'arrow'));//own method
        }
      }else{
        o.push(this.p_arrow(coords, g));
      }
    }
    else if (cmd=='revarrow'){
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
          o.push(this.to_shape_of_path(p,g,coords,'revarrow'));//own method
        }
      }else{
        o.push(this.p_revarrow(coords, g));
      }
    }
    else if (cmd=='dblarrow'){
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
          o.push(this.to_shape_of_path(p,g,coords,'dblarrow'));//own method
        }
      }else{
        o.push(this.p_dblarrow(coords, g));
      }
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
    ///NOTE: The image command   
    ///
    else if (cmd=='image'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_image(opts,g,txts,coords));///own method
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
    ///NOTE: the barchart command
    ///
    else if (cmd=='barchart'){
      let [numbers,g,txts] = this.read_array(data,env);
      o.push(this.do_barchart(subcmd,opts,g,txts,numbers));///own method
    }
    ///
    ///NOTE: the argand command
    ///
    else if (cmd=='argand'){
      let [numbers,g,txts] = this.read_array(data,env);
      o.push(this.do_argand(subcmd,opts,g,txts,numbers));///own method
    }
    ///
    ///NOTE: remove empty lnes
    o = o.map((x) => {
      if(typeof x === 'string') return x.trim();
      else return null;
    });
    o = o.filter((x) => x);
    return o.join('\n');
  }

  //
  //get_path_from_symbol()
  //
  get_path_from_symbol(symbol) {

    ///***NOTE: this function should return a path, not a point!

    /// if it is null then we return an empty path
    if(typeof symbol === 'string'){
      //good
    }else{
      symbol = `${symbol}`
    }
    var i = symbol.indexOf('_');
    if(i >= 0){
       var a1 = symbol.slice(0,i);
       var a2 = symbol.slice(i+1);
       var index = parseInt(a2);
       symbol = a1;
    }else{
      var index = null;
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
    if(symbol=='lastpt'){
      return [[this.lastpt_x,this.lastpt_y,'M']];
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
        let z0x = z0[0];
        let z0y = z0[1];
        let z1x = z1[0];
        let z1y = z1[1];
        let ptx = z0x + (z1x - z0x) * fraction;
        let pty = z0y + (z1y - z0y) * fraction;
        ret_val.push([ptx, pty, 'M']);///always  a single point
        break;
      }
      case 'protrude': {
        ///&protrude{&A,&B,a}
        ///protrude from B in the direction of A-B for a distance of 'a'
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
            let z0 = this.point(args[0].coords,0);
            let z1 = this.point(args[1].coords,0);
            let z2 = this.point(args[2].coords,0);
            ret_val.push([z0[0],z0[1],'M', '','','','', 0,0,0,0,0, z0[12]]);
            ret_val.push([z1[0],z1[1],'L']);
            ret_val.push([z2[0],z2[1],'L']);
            ret_val.push([0,0,'z']);
          }
        break;
      }
      case 'polyline': {
        ///&circle(center,radius)
        ///'center' is a path, radius is a scalar
        args.forEach((arg,i,arr) => {
          let z = this.point(arg.coords,0);
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
          let z = this.point(arg.coords,0);
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
      case 'ymirror': {
        let Z0 = this.assert_arg_coords(args,0);
        let X = this.assert_arg_float(args,1);
        let Z1 = this.ymirror_coords(Z0,X);
        for(let pt of Z1){
          ret_val.push(pt);
        }
        break;
      }
      case 'xmirror': {
        let Z0 = this.assert_arg_coords(args,0);
        let Y = this.assert_arg_float(args,1);
        let Z1 = this.xmirror_coords(Z0,Y);
        for(let pt of Z1){
          ret_val.push(pt);
        }
        break;
      }
      case 'mirror': {
        ///NOTE: &mirror{&pt,&end1,&end2}
        if(args.length==3){
          let z0 = this.assert_arg_point(args,0);
          let st = this.assert_arg_point(args,1);
          let pt = this.assert_arg_point(args,2);
          let tx = z0[0];
          let ty = z0[1];
          let stx = st[0];
          let sty = st[1];
          let ptx = pt[0];
          let pty = pt[1];
          let [dx, dy] = this.computeMirroredPointOffset(stx,sty, ptx,pty, tx,ty);
          tx += dx;
          ty += dy;
          if(Number.isFinite(tx)&&Number.isFinite(ty)){
            ret_val.push([tx,ty,'M']);
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
        Z = this.dup_coords(Z);
        this.offset_coords(Z,offsetX,offsetY,1,1,0);
        for(let z of Z){
          ret_val.push(z);
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
      case 'points': {
        let xfloats = this.assert_arg_floats(args,0);
        let yfloats = this.assert_arg_floats(args,1);
        let i = xfloats.length;
        let j = yfloats.length;
        let n = Math.max(i,j);
        for(let k=0; k < n; k++){
          let x = xfloats[k];
          let y = yfloats[k];
          ret_val.push([x,y,'M']);
        }
        break;
      }
      case 'lines': {
        let xfloats = this.assert_arg_floats(args,0);
        let yfloats = this.assert_arg_floats(args,1);
        let i = xfloats.length;
        let j = yfloats.length;
        let n = Math.max(i,j);
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
  /////////////////////////////////////////////////////////////////////////////////////////////////
  move_coords(coords){
    ///this method will return a duplicated coords if anything in the original is to be changed
    ///  because this method and the next two methods are used exclusively by subclasses of diagram
    ///  to align the content to the new origin, thus it is good that the subclass does not modify
    ///  the original contents of 'coords' because its contents are likely to be re-used by 'diagram' class
    if(this.origin_x !== 0 || this.origin_y !== 0 || this.origin_sx !== 1 || this.origin_sy !== 1 ){
      let p = this.dup_coords(coords);
      this.offset_coords(p,this.origin_x,this.origin_y,this.origin_sx,this.origin_sy,0);
      return p;
    }else{
      return coords;
    }
  }
  move_xy(x,y){
    var pt = [x,y];
    this.offset_pt(pt,this.origin_x,this.origin_y,this.origin_sx,this.origin_sy,0);
    return pt;
  }
  scale_dist(r){
    return r*Math.min(this.origin_sx,this.origin_sy);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
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
  offset_pt(pt,refx,refy,refsx=1,refsy=1,rotation=0){
    if(rotation){
      var x = pt[0];
      var y = pt[1];
      var [newx,newy] = this.rotate_point(x,y,rotation);
      pt[0] = newx;
      pt[1] = newy;
      var x = pt[3];
      var y = pt[4];
      var [newx,newy] = this.rotate_point(x,y,rotation);
      pt[3] = newx;
      pt[4] = newy;
      var x = pt[5];
      var y = pt[6];
      var [newx,newy] = this.rotate_point(x,y,rotation);
      pt[5] = newx;
      pt[6] = newy;
    }
    
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

  isvalidpt(pt) {
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

  point(coords, i) {
    if (coords && Array.isArray(coords) && i >= 0 && i < coords.length) {
      var pt = coords[i];
      if(pt){
        return pt;
      }else{
        return [0,0];
      }
    } 
    return [0,0];
  }
  float(array, i) {
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
    //NOTE: parm='(0,0),4,5'
    //NOTE: parm='&a,4,5'
    //NOTE: parm='&a_0,5,6'
    //NOTE: para='@xarr,@yarr'
    const s0 = s;
    const re_cma = /^(\,)\s*(.*)$/;
    const re_pnt = /^(\(.*?\)|&\w+)\s*(.*)$/;
    const re_arr = /^(\[.*?\])\s*(.*)$/;
    const re_var = /^([\+\-]?[A-Za-z][A-Za-z0-9_]*)\s*(.*)$/;
    const re_hex = /^([\+\-]?0x[A-Fa-f0-9]+)\s*(.*)$/;
    const re_bin = /^([\+\-]?0b[0-1]+)\s*(.*)$/;
    const re_oct = /^([\+\-]?0o[0-7]+)\s*(.*)$/;
    const re_num = /^([\+\-]?[\d\.]+)\s*(.*)$/;
    var v;
    var d = [];
    s = s.trimLeft();
    if(s.length==0){
      return [];
    }
    var pt = {coords:[],array:[]}
    d.push(pt);///always at least one arg
    while(s.length){
      if((v=re_cma.exec(s))!==null){
        s = v[2];
        pt = {coords:[],array:[]}
        d.push(pt);
      
      }
      else if((v=re_pnt.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [q] = this.read_coords(s1,env);
        q.forEach((x) => {
          pt.coords.push(x);
        })

      }
      else if((v=re_arr.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [q] = this.read_array(s1,env);
        q.forEach((x) => {
          pt.array.push(x);
        })
      }
      else if((v=re_var.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [q] = this.read_array(s1,env);
        q.forEach((x) => {
          pt.array.push(x);
        })
      }
      else if((v=re_hex.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [q] = this.read_array(s1,env);
        q.forEach((x) => {
          pt.array.push(x);
        })
      }
      else if((v=re_bin.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [q] = this.read_array(s1,env);
        q.forEach((x) => {
          pt.array.push(x);
        })
      }
      else if((v=re_oct.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [q] = this.read_array(s1,env);
        q.forEach((x) => {
          pt.array.push(x);
        })
      }
      else if((v=re_num.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [q] = this.read_array(s1,env);
        q.forEach((x) => {
          pt.array.push(x);
        })
      }
      else{
        break;
      }
    }
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
    var lastsweepflag = 0;
    var lastabr = 0;
    var lasthint = 0;
    var lastoffset_x = 0;
    var lastoffset_y = 0;
    var lastoffset_sx = 1;
    var lastoffset_sy = 1;
    var hobby_p = [];
    var txts = [];
    var g = {...this.config};
    const re_math = /^\\\((.*)\\\)$/;
    while (line.length) {

      // {style}
      if ((v=this.re_coords_is_style.exec(line))!==null) {
        line = v[2];
        let s = v[1].trim();
        s = `{${s}}`;
        g = this.string_to_style(s,g);//need to build from previous 'g'
        continue;
      }
      
      // "text"
      // "{{math}}"
      if ((v=this.re_coords_is_label.exec(line))!==null) {
        line = v[2];    
        let s = v[1].trim();
        if((v=re_math.exec(s))!==null){
          let math = 1;
          let label = v[1];
          txts.push({label,math});
        }else{
          let math = 0;
          let label = s;
          txts.push({label,math});
        }
        continue;
      }
      
      // ^at:A
      if ((v = this.re_coords_is_aux.exec(line))!==null) {
        //^right:2, ^up:2, ^down:2, ^left:2, ^x:2, ^X:2, ^y:2, ^Y:2, ^s:2, ^sx:2, ^sy:2, ^at:center, ^pt:a, ^hint:linedashed ^car:1
        let key   = v[1];
        let colon = v[2];
        let val   = v[3];
        line      = v[4];
        let num = parseFloat(val);
        let dec = parseInt(val);
        switch (key){
          case 'hint': {
            //'hint:linedashed|linesize2
            lasthint = this.string_to_lasthints(val);
            break;
          }
          case 'hints': {
            //NOTE:hints:1
            if(Number.isFinite(dec)){
              lasthint = dec;
            }
            break;
          }
          case 'sweepflag': {
            // 'sweepflag:1' - set it such that the sweep will be a clockwise direcition as opposed to a default counter-clockwise direction
            if(Number.isFinite(num)){
              lastsweepflag = num;
              ///currently unused but it is planned to be used by 'ellispe' operation to change the direction
            }
            break;
          }
          case 'abr': {
            // 'abr:-20' - set it such that it will veer to the left of an angle of 20 degrees
            // 'abr:40' - set it such that it will veer to the right of an angle of 40 degrees
            if(Number.isFinite(num)){
              lastabr = num;
            }
            break;
          }
          case 'at': {
            //at:a
            let symbol = val;
            let p = this.get_path_from_symbol(symbol);
            let pt = this.point(p,0);
            if(this.isvalidpt(pt)){
              lastoffset_x     = pt[0];
              lastoffset_y     = pt[1];
            }
            break;
          }
          case 'pt': {
            // '^pt:a' - save the lastpt 
            let symbol = val;
            if(this.re_is_symbolname.test(symbol)){
              let pt = [0,0,'M','','','','', 0,0,0,0,0, 0];
              pt[0] = this.lastpt_x;
              pt[1] = this.lastpt_y;
              let p = [pt];
              this.my_path_map.set(symbol,p);
              this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
            }
            break;
          }
          case 'center': lastoffset_x = this.viewport_width/2, lastoffset_y = this.viewport_height/2; break;
          case 'north':  lastoffset_x = this.viewport_width/2, lastoffset_y = this.viewport_height; break;
          case 'south':  lastoffset_x = this.viewport_width/2, lastoffset_y = 0; break;
          case 'west':   lastoffset_x = 0, lastoffset_y = this.viewport_height/2; break;
          case 'east':   lastoffset_x = this.viewport_width, lastoffset_y = this.viewport_height/2; break;
          case 'northwest': lastoffset_x = 0, lastoffset_y = this.viewport_height; break;
          case 'northeast': lastoffset_x = this.viewport_width, lastoffset_y = this.viewport_height; break;
          case 'southwest': lastoffset_x = 0, lastoffset_y = 0; break;
          case 'southeast': lastoffset_x = this.viewport_width, lastoffset_y = 0; break;
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
            }
            break;
          }
          default: {
            if(Number.isFinite(num)){
              if     (key=='up')     lastoffset_y += num;
              else if(key=='right')  lastoffset_x += num;
              else if(key=='down')   lastoffset_y -= num;
              else if(key=='left')   lastoffset_x -= num;
              else if(key=='y')      lastoffset_y = num;
              else if(key=='x')      lastoffset_x = num;
              else if(key=='Y')      lastoffset_y = this.viewport_height-num;
              else if(key=='X')      lastoffset_x = this.viewport_width-num;
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
          if(this.isvalidpt(pt)){
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
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
        /// '&a_0'
        var symbol = v[1];
        line = v[2];
        var pts = this.get_path_from_symbol(symbol);
        for (var pt of pts) {
          if(this.isvalidpt(pt)){
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
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
        /// '(1,2)'
        /// '(&a_0)'
        /// '(&a)'
        /// '(#box.)'
        /// '(#node.)'
        /// '(#cartesian)'
        /// '(#car)'
        /// '()'
        let s = v[1];
        line = v[2];
        let from = [];
        n++;
        if(s.startsWith('&')){
          /// '&a_0'
          /// '&a'
          let symbol = s.slice(1);
          let pts = this.get_path_from_symbol(symbol);
          if(pts.length && this.isvalidpt(pts[0])){
            ///only grab the first point, if no point, then nothing is added
            let pt = pts[0];
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
            pt[2] = 'M';
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt)
          }
        }else if(s.startsWith('#box.')){
          /// '#box.1:n,1,2'
          s = s.slice(5);
          var [ac,dx,dy] = s.split(',').map((x)=>x.trim());
          var [id,anchor] = ac.split(':');
          if(this.my_box_map.has(id)){
            var p = this.my_box_map.get(id); 
            var {x,y,w,h,boxtype} = p;
            var [x,y] = this.move_box_xy_by_anchor(x,y,w,h,boxtype,anchor);
            dx = parseFloat(dx);
            dy = parseFloat(dy);
            if(Number.isFinite(dx)) x += dx;
            if(Number.isFinite(dy)) y += dy;
            if(Number.isFinite(x)&&Number.isFinite(y)){
              var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
              if(lasthint){
                pt[12]=lasthint;
                lasthint = 0;
              }
              from.push(pt);
            }
          }
        }else if(s.startsWith('#node.')){
          /// '#node.2:o3,1,2'
          s = s.slice(6);
          var [ac,dx,dy] = s.split(',').map((x)=>x.trim());
          var [id,anchor] = ac.split(':');
          if(this.my_node_map.has(id)){
            var p = this.my_node_map.get(id); 
            var {x,y,r,nodetype} = p;
            var [x,y] = this.move_node_center_by_anchor(x,y,r,nodetype,anchor);
            dx = parseFloat(dx);
            dy = parseFloat(dy);
            if(Number.isFinite(dx)) x += dx;
            if(Number.isFinite(dy)) y += dy;
            if(Number.isFinite(x)&&Number.isFinite(y)){
              var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
              if(lasthint){
                pt[12]=lasthint;
                lasthint = 0;
              }
              from.push(pt);
            }        
          }
        }else if(s.startsWith('#car.')){    
          /// '#car.1,-2,1'    
          s = s.slice(5);
          var [id,dx,dy] = s.split(',').map((x)=>x.trim());
          if(this.my_car_map.has(id)){
            var p = this.my_car_map.get(id); 
            var {xorigin,yorigin,xgrid,ygrid} = p;
            dx = parseFloat(dx);
            dy = parseFloat(dy);
            var x = xorigin + dx/xgrid;
            var y = yorigin + dy/ygrid;
            if(Number.isFinite(x)&&(Number.isFinite(y))){
              var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
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
          let [numbers] = this.read_array(s,env);
          let floats = this.numbers_to_floats(numbers);
          if(floats.length==0){
            //'()', use the lastpt
            x = this.lastpt_x;
            y = this.lastpt_y;
            var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }else{
            x = floats[0];
            y = floats[1];
            if(Number.isFinite(x)&&Number.isFinite(y)){
              var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
              this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
              if(lasthint){
                pt[12]=lasthint;
                lasthint = 0;
              }
              from.push(pt);
            }
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
            this.lastpt_x = x;
            this.lastpt_y = y;  
          } 
        } else if (dashdot.charAt(0) === '~') {
          ///turn it off
          let abr = lastabr;
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            hobby_p = [];
            hobby_p.push([x,y]);          
            let [pt0,pt1,pt2] = this.abr_to_qbezier(abr, this.lastpt_x,this.lastpt_y, x,y);  
            pt[2] = 'Q';
            pt[3] = pt1[0];
            pt[4] = pt1[1];
            pt[5] = '';
            pt[6] = '';
            coords.push(pt);
            this.lastpt_x = x;
            this.lastpt_y = y;  
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
            this.lastpt_x = x;
            this.lastpt_y = y;  
          }
        } else if (dashdot === 'q') {
          /// |q:4,-1|
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            hobby_p = [];
            hobby_p.push([x,y]);          
            x1 = this.lastpt_x + this.assert_float(dashdot_floats[0],0);
            y1 = this.lastpt_y + this.assert_float(dashdot_floats[1],0);  
            pt[2] = 'Q';
            pt[3] = x1;
            pt[4] = y1;
            pt[5] = '';
            pt[6] = '';
            coords.push(pt);
            this.lastpt_x = x;
            this.lastpt_y = y;  
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
            this.lastpt_x = x;
            this.lastpt_y = y;
          }
        }
        dashdot = '';
        continue;
      }

      if ((v = this.re_coords_is_relative.exec(line)) !== null) {
        n++;
        dashdot = '';
        /// [angledist:angle,dist]
        /// [clock:angle,dist]
        /// [turn:angle,dist]
        /// [flip:dx,dy] /// flip the point to the other side of the line of the last two points
        /// [sweep:cx,cy,angle] /// draws a arc that sweeps around a fixed point for a given number of degrees
        /// [protrude:dist] /// draws a line from the current in the direction of last two points
        /// [ellipse:dx,dy] /// draws a curve from the current to the point dx/dy away in the shape of a quarter ellipse
        /// [l:dx,dy] /// line
        /// [h:dx] /// line
        /// [v:dy] /// line
        /// [c:dx1,dy1,dx2,dy2,dx,dy]
        /// [s:dx2,dy2,dx,dy]
        /// [a:rx,ry,angle,bigarcflag,sweepflag,dx,dy]
        /// [q:dx1,dy1,dx,dy]
        /// [t:dx,dy]
        /// [m:dx,dy] ///move the point, will terminate the current one
        /// [z] ///add a cycle point
        var fun_name = v[1].trim();
        line = v[2];
        fun_name = fun_name.split(':');
        fun_name = fun_name.map(x => x.trim());
        var key = fun_name[0];
        var val = fun_name[1]||'';
        var val = `[${val}]`;
        var [val] = this.read_array(val,env);
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
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
            coords.push(pt);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
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
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
            coords.push(pt);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
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
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
            coords.push(pt);
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
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
                this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
                coords.push(pt);
                this.lastpt_x = pt[0];
                this.lastpt_y = pt[1];
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
            }
          }
        }
        else if (key === 'protrude') {
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
            }
          }
        }
        else if (key === 'ellipse') {
          if (val.length == 2) {
            dx = val[0];
            dy = val[1];
            var rat = this.RATIO_CIRCLE_TO_CUBIC;
            if (Number.isFinite(dx) && Number.isFinite(dy)) {
              x = dx;
              y = dy;
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
            }
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              pt[3] = x1;///readjust for x1/y1 
              pt[4] = y1;
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
              x1 = pt[3];
              y1 = pt[4];
              x2 = pt[5];
              y2 = pt[6];
            }
          }
        }
        else if (key === 'a') {
          /// [a:rx,ry,angle,bigarcflag,sweepflag,dx,dy]
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
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
              let pt = [x, y, 'Q', '','','','', 0,0,0,0,0, lasthint];
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
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
              [x1,y1] = lastpt;
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
              this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
              pt[3] = x1;//readjust for x1/y1
              pt[4] = y1;
              coords.push(pt);
              this.lastpt_x = pt[0];
              this.lastpt_y = pt[1];
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
            this.offset_pt(pt,this.lastpt_x,this.lastpt_y,lastoffset_sx,lastoffset_sy);
            if(coords.length && coords[coords.length-1][2]=='M'){
              ///replace the previous point, keeping all its hints
              coords[coords.length-1][0] = pt[0];
              coords[coords.length-1][1] = pt[1];
            }else{
              coords.push(pt);
            }
            this.lastpt_x = pt[0];
            this.lastpt_y = pt[1];
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

  numbers_to_floats(numbers) {
    var floats = numbers.map((x) => x.re);
    return floats;
  }
  read_scalar(line,env) {
    const re_format = /^@\"(.*?)\"\s*(.*)$/;
    const re_env = /^@([A-Za-z][A-Za-z0-9]*)$/;
    const re_atsign = /^@@$/;
    let v;
    if((v=re_format.exec(line))!==null){
      let fmt = v[1];
      let args = this.string_to_array(v[2]);
      let s2 = this.format_args(fmt,args,env);
      return s2;
    }else if((v=re_env.exec(line))!==null){
      let s2 = v[1];
      if(env.hasOwnProperty(s2)){
        s2 = env[s2];
      }
      return s2;
    }else if(line.startsWith('@')){
      let s2 = line.slice(1);
      if(this.config.hasOwnProperty(s2)){
        return ""+this.config[s2];
      }
      return s2;
    }else{
      let [a] = this.expr.extract_next_expr(line,env);
      return a;
    }
  }
  read_array(line,env) {
    /// [5, 5, 0.5, 0.5, 3.14E-10, a, 1+2i, 2+1i] [1:3:10] [1:10] [1!10!20]
    var numbers = [];
    line = line.trimLeft();
    var v;
    var fns = [];
    var txts = [];
    var g = {...this.config};
    const re_math = /^\\\((.*)\\\)$/;
    while(line.length) {

      // {style}
      if((v=this.re_coords_is_style.exec(line))!==null) {
        //parse style
        line = v[2];
        let s = v[1].trim();
        s = `{${s}}`;
        g = this.string_to_style(s,g);//need to build from previous 'g'
        continue;
      }
      
      // "text"
      if((v=this.re_coords_is_label.exec(line))!==null) {
        //parse text
        line = v[2];    
        let s = v[1].trim();
        if((v=re_math.exec(s))!==null){
          let math = 1;
          let label = v[1];
          txts.push({label,math});
        }else{
          let math = 0;
          let label = s;
          txts.push({label,math});
        }
        continue;
      }

      /// ^fn:exp
      if((v=this.re_numbers_is_fn.exec(line))!==null){
        let fn = v[1];
        line = v[2];
        fns.unshift(fn);
        continue;
      }

      /// [5, 5, 0.5, 0.5, 3.14E-10, a, 1+2i, 2+1i] 
      /// [1:3:10] 
      /// [1:10] 
      /// [1!10!20]
      if((v=this.re_numbers_is_list.exec(line))!==null){ 
        const re_array    = /^@([A-Za-z][A-Za-z0-9]*)$/;
        const re_range2   = /^([^:]+):([^:]+)$/;
        const re_range3   = /^([^:]+):([^:]+):([^:]+)$/;    
        const re_spread   = /^([^!]+)!([^!]+)!([^!]+)$/;
        var expr = v[1];
        line = v[2];
        if((v=re_array.exec(expr))!==null){
          /// '@a'
          let symbol = v[1];
          if(env.hasOwnProperty(symbol)){
            let m = env[symbol];
            if(m && Array.isArray(m)){
              let all = m;
              this.copy_numbers(numbers,all,fns,env);
            }else if(m instanceof Complex){
              let all = [];
              all.push(m);
              this.copy_numbers(numbers,all,fns,env);
            }else{
              try {
                m = Complex.create(m);
                let all = [];
                all.push(m);
                this.copy_numbers(numbers,all,fns.env);
              }catch(e){
                //do nothing
              }
            }
          }
          continue;
        }
        if((v=re_range2.exec(expr))!==null){
          /// '1:10'
          let [a1] = this.expr.extract_next_expr(v[1],env);
          let [a2] = this.expr.extract_next_expr(v[2],env);
          let all = [];
          if(a1.isFinite()&&a2.isFinite()){
            all.push(a1);
            let a = a1.add(Complex.ONE);
            for(let i=0; i < this.MAX_ARRAY; ++i){
              if(a.re > a2.re){
                break;
              }
              all.push(a);
              a = a.add(Complex.ONE);
            }
          }
          this.copy_numbers(numbers,all,fns,env);
          continue; 
        }
        if((v=re_range3.exec(expr))!==null){
          /// '1:4:10'
          let [a1] = this.expr.extract_next_expr(v[1],env);
          let [a2] = this.expr.extract_next_expr(v[2],env);
          let [a3] = this.expr.extract_next_expr(v[3],env);
          let all = [];
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
          this.copy_numbers(numbers,all,fns,env);
          continue;
        }
        if((v=re_spread.exec(expr))!==null){
          /// '1!3!10'
          let [a1] = this.expr.extract_next_expr(v[1],env);
          let [a2] = this.expr.extract_next_expr(v[2],env);
          let [a3] = this.expr.extract_next_expr(v[3],env);
          let all = [];
          if(a1.isFinite()&&a2.isFinite()&&a3.isFinite()){
            let n = Math.abs(Math.round(a2.re));
            if(n==0){
              all.push(a1);
              all.push(a3);
            }else if(n > 0){
              all.push(a1);
              for(let i=0; i < n; ++i){
                let a = a3.sub(a1).mul(i+1).div(n+1).add(a1);
                all.push(a);
              }
              all.push(a3);
            }
          }
          this.copy_numbers(numbers,all,fns,env);
          continue;                
        }
        if(1){
          ///'12.3', '12.3+10i', '12.3-10i', '1i', '-1i', '1.234E-10'
          let a;
          let all = [];
          let s = expr;
          while(s.length){
            [a,s] = this.expr.extract_next_expr(s,env);
            all.push(a);
            let c = s.charAt(0);
            if (c === ',') {
              s = s.slice(1);
              s = s.trimLeft();
              continue;
            }
            break;
          }
          this.copy_numbers(numbers,all,fns,env);
        }
        continue;
      }
      if((v=this.re_numbers_is_solid.exec(line))!==null){
        let s1 = v[1];
        line = v[2];
        let [a] = this.expr.extract_next_expr(s1,env);
        let all = [a];
        this.copy_numbers(numbers,all,fns,env);
        continue;
      }

      break;
    }
    if(0){
      let s0 = this.array_to_string(numbers);
      this.do_comment(`***numbers: ${s0}`);
    }
    ///DO NOT filter 'o', as it might contain NAN, which is okay, let the command check, otherwise the order
    // of numbers will be messed up
    //o = o.filter( x => Number.isFinite(x) );
    return [numbers,g,txts,line];
  }

  copy_numbers(o,all,fns,env){
    all = all.map((a) => {
      a = this.map_number(a,fns,env);
      return a;
    });
    all.forEach((a) => {
      o.push(a);
    })
  }

  map_number(a,fns,env){
    ///note that map functions are applied from right to left
    for(let fn of fns){
      ///replace the original 'a'
      a = this.expr.exec_complex_func(fn,[a],env,0);
    }
    return a;
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
    for (var i in coords) {
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
        o.push(`[C:${this.fix(p1x)},${this.fix(p1y)},${this.fix(p2x)},${this.fix(p2y)},${this.fix(x)},${this.fix(y)}]`);
      }
      else if (join == 'Q') {
        var p1x = pt[3];/// CUBIC BEZIER curve controlpoint 1x
        var p1y = pt[4];/// CUBIC BEZIER curve controlpoint 1y
        o.push(`[Q:${this.fix(p1x)},${this.fix(p1y)},${this.fix(x)},${this.fix(y)}]`);
      }
      else if (join == 'A') {
        var i3 = pt[7];/// Rx
        var i4 = pt[8];/// Ry
        var i5 = pt[9];/// angle
        var i6 = pt[10];/// bigarcflag
        var i7 = pt[11];/// sweepflag
        o.push(`[A:${this.fix(i3)},${this.fix(i4)},${this.fix(i5)},${this.fix(i6)},${this.fix(i7)},${this.fix(x)},${this.fix(y)}]`);
      }
      else if (join == 'L') {
        o.push(`[L:${this.fix(x)},${this.fix(y)}]`);
      }
      else if (join == 'z') {
        o.push(`[z]`);
      }
      else if (join == 'M') {
        o.push(`[M:${this.fix(x)},${this.fix(y)},${hints}]`);
      }
      else {
        o.push(`[]`);
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
  array_to_string(numbers) {
    var s = '';
    for (var i in numbers) {
      var a = numbers[i];
      s += ` ${a.toString()}`;
    }
    return s.trim();
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
    let flag = 0;
    const re_replace = /\$\{(.*?)\}/g;
    let v;
    line = line.replace(re_replace,(match,p1) => {
      flag = 1;
      let m = this.read_scalar(p1,env);
      return ""+m;
    });
    return [line,flag];
  }
  do_path_command(symbol,coords,env){
    ///check for destructuring "[a,b,c]"
    const re_destructuring = /^\[(.*)\]$/;
    const re_sequencing = /^@\[(.*)\]$/;
    var v;
    if((v=re_sequencing.exec(symbol))!==null){
      var segs = v[1].split(',');
      var segs = segs.map((x) => x.trim());
      var i = parseInt(env['@'])||0;
      symbol = segs[i];
      if(this.re_is_symbolname.test(symbol)){
        this.my_path_map.set(symbol, coords);
        this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
      }else{
        this.do_comment(`***ERROR '${symbol}' is not a valid symbol name`);
      }
      return;
    }
    if((v=re_destructuring.exec(symbol))!==null){
      var segs = v[1].split(',');
      var segs = segs.map((x) => x.trim());
      for (var i = 0; i < segs.length; ++i) {
        let seg = segs[i];
        if (seg.length==0){
          // skip and not an error
        }else if (this.re_is_symbolname.test(seg)) {
          var pt = this.point(coords, i);
          if(this.isvalidpt(pt)){
            this.my_path_map.set(seg,[pt]);
          } else {
            this.my_path_map.set(seg,[]);
          }
          this.do_comment(`*** path ${seg} = ${this.coords_to_string(this.my_path_map.get(seg))}`);
        }else{
          this.do_comment(`***ERROR '${seg}' is not a valid symbol name`);
        }
      }
      return;
    } 
    if(1){
      if(this.re_is_symbolname.test(symbol)) {
        this.my_path_map.set(symbol, coords);
        this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
      }else{
        this.do_comment(`***ERROR '${symbol}' is not a valid symbol name`);
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

  do_barchart(subcmd,opts,g,txts,numbers) {
    var floats = this.numbers_to_floats(numbers);
    var o = [];
    var id = 0;
    if (!this.my_barchart[id]) {
      this.my_barchart[id] = {};
      var A = this.my_barchart[id];
      A.xorigin = 0;
      A.yorigin = 0;
      A.xwidth = 10;
      A.ywidth = 10;
      A.xrange = 100;
      A.yrange = 100;
    }
    var A = this.my_barchart[id];
    var [opt] = opts;
    switch( subcmd ) {
      case 'setup'://BARCHART
        A.xorigin = this.assert_float(floats[0],A.xorigin);
        A.yorigin = this.assert_float(floats[1],A.yorigin);
        A.xwidth = this.assert_float(floats[2],A.xwidth);
        A.ywidth = this.assert_float(floats[3],A.ywidth);
        A.xrange = this.assert_float(floats[4],A.xrange);
        A.yrange = this.assert_float(floats[5],A.yrange);
        break;

      case 'bbox'://BARCHART
        var x1 = A.xorigin; 
        var y1 = A.yorigin;
        var x2 = A.xorigin + A.xwidth;
        var y2 = A.yorigin + A.ywidth;
        var mypath = `((${x1},${y1}) ~ (${x2},${y1}) ~ (${x2},${y2}) ~ (${x1},${y2}) ~ [z]`;
        var p = [];
        p.push([x1,y1,'M']);
        p.push([x2,y1,'L']);
        p.push([x2,y2,'L']);
        p.push([x1,y2,'L']);
        p.push([0,0,'z']);
        o.push(this.p_draw(p,g));
        break;

      case 'vbar'://BARCHART
        for( var j=0; j < floats.length; j+=1 ) {
          var num = floats[j];
          if (Number.isFinite(num)){
            ///zero height bars are ignored
            if(num > 0){
              var x = A.xorigin + j*A.xwidth/A.xrange;
              var y = A.yorigin;
              var w = A.xwidth/A.xrange;
              var h = num*A.ywidth/A.yrange;
              let p = this.to_q_RECT(x,y,w,h);
              o.push(this.p_draw(p,g));          
            }
          }
        }
        break;

      case 'ytick'://BARCHART
        for( var j=0; j < floats.length; j+=1 ) {
          var num = floats[j];
          if (Number.isFinite(num)){
            var x = A.xorigin;
            var y = A.yorigin + num*A.ywidth/A.yrange;
            if(Number.isFinite(x)&&Number.isFinite(y)){
              o.push(this.p_text(x,y,`${num}`,'lft',g));
              o.push(this.p_hbar(x,y,g));
            }
          }
        }
        break;

      case 'xlabel'://BARCHART
        for( var i=0,j=0; i < floats.length; i+=1,j+=1 ) {
          var num = floats[i];
          if (Number.isFinite(num)){
            var x = A.xorigin + num*A.xwidth/A.xrange
            var y = A.yorigin;
            if(Number.isFinite(x)&&Number.isFinite(y)){
              var {label,math} = this.fetch_label_at(txts,j,g);
              if(math){
                p.push(this.p_math(x,y,label,'bot',g));
              }else{
                o.push(this.p_text(x,y,label,'bot',g));
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
          var pt = this.point(coords, j);
          if(!this.isvalidpt(pt)) continue;
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
                    o.push(this.p_draw(q,g1));
                  }
                  if(1){
                    var q = A.q2;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    o.push(this.p_draw(q,g));

                  }
                  if(1){
                    var q = A.q3;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    let g1 = this.update_g_hints(g,this.hint_darker);
                    o.push(this.p_draw(q,g1));

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
          var pt = this.point(coords, j);
          if(!this.isvalidpt(pt)) continue;
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
                    o.push(this.p_draw(q,g));
                  }
                  if(1){
                    //side
                    var q = A.q2;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    let g1 = this.update_g_hints(g,this.hint_darker);
                    o.push(this.p_draw(q,g1));
                  }
                  if(1){
                    //side
                    var q = A.q3;
                    var q = this.dup_coords(q);
                    this.offset_coords(q,offsetx,offsety,1,1,0);
                    let g1 = this.update_g_hints(g,this.hint_lighter);
                    o.push(this.p_draw(q,g1));
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


  do_argand(subcmd,opts,g,txts,numbers) {
    var shift = this.g_to_shift_float(g);
    var tx    = this.g_to_tx_float(g);
    var ty    = this.g_to_ty_float(g);
    var o = [];
    var id = 0;
    if (!this.my_argands[id]) {
      this.my_argands[id] = {};
      var A = this.my_argands[id];
      A.xorigin = 0;
      A.yorigin = 0;
      A.grid = 1;
    }
    var A = this.my_argands[id];
    switch( subcmd ) {
      case 'setup': {
        //ARGAND 
        let floats = this.numbers_to_floats(numbers);
        A.xorigin = this.assert_float(floats[0],A.xorigin);    
        A.yorigin = this.assert_float(floats[1],A.yorigin);    
        A.grid    = this.assert_float(floats[2],A.grid);  
        break;
      }
        
      case 'grid': {
        //ARGAND
        let floats = this.numbers_to_floats(numbers);
        var x1 = this.assert_float(floats[0],0);
        var y1 = this.assert_float(floats[1],0);
        var x2 = this.assert_float(floats[2],0);
        var y2 = this.assert_float(floats[3],0);
        var inc_x = this.get_float_prop(g,'xstep',1);
        var inc_y = this.get_float_prop(g,'ystep',1);
        for(var j = 0; j < this.MAX_ARRAY; j++){
          var y = y1 + inc_y*j;
          if(y > y2) break;
          o.push(this.p_line(x1/A.grid+A.xorigin,y/A.grid+A.yorigin,x2/A.grid+A.xorigin,y/A.grid+A.yorigin,g));
        }
        for(var i = 0; i < this.MAX_ARRAY; i++){
          var x = x1 + inc_x*i;
          if(x > x2) break;
          o.push(this.p_line(x/A.grid+A.xorigin,y1/A.grid+A.yorigin,x/A.grid+A.xorigin,y2/A.grid+A.yorigin,g));
        }
        break;
      }
        
      case 'xaxis': {
        //ARGAND
        let floats = this.numbers_to_floats(numbers);
        var x1 = this.assert_float(floats[0],0);
        var x2 = this.assert_float(floats[1],0);
        x1 /= A.grid;
        x2 /= A.grid;
        x1 += A.xorigin;
        x2 += A.xorigin;
        var y1 = A.yorigin;
        var y2 = A.yorigin;
        var mypath = `(${x1},${y1}) ~ (${x2},${y2})`;
        var p = [];
        p.push([x1,y1]);
        p.push([x2,y2,'L']);
        o.push(this.p_dblarrow(p,g));
        break;
      }
      
      case 'yaxis': {
        //ARGAND
        let floats = this.numbers_to_floats(numbers);
        var y1 = this.assert_float(floats[0],0);
        var y2 = this.assert_float(floats[1],0);
        y1 /= A.grid;
        y2 /= A.grid;
        y1 += A.yorigin;
        y2 += A.yorigin;
        var x1 = A.xorigin;
        var x2 = A.xorigin;
        var p = [];
        p.push([x1,y1,'M']);
        p.push([x2,y2,'L']);
        o.push(this.p_dblarrow(p,g));
        break;
      }
      
      case 'xtick': {
        //ARGAND
        let floats = this.numbers_to_floats(numbers);
        for (var j=0; j < floats.length; ++j) {
          var num = this.assert_float(floats[j],0);
          var x = A.xorigin + num/A.grid;
          var y = A.yorigin;
          o.push(this.p_tvbar(x,y,g));
          o.push(this.p_text(x,y,`${num}`,'bot',g));
        }
        break;
      }
        
      case 'ytick': {
        //ARGAND
        let floats = this.numbers_to_floats(numbers);
        for (var j=0; j < floats.length; ++j) {
          var num = this.assert_float(floats[j],0);
          var x = A.xorigin;
          var y = A.yorigin + num/A.grid;
          o.push(this.p_rhbar(x,y,g));
          o.push(this.p_text(x,y,`${num}i`,'lft',g));
        }
        break;
      }
      
      case 'dot': {
        //ARGAND
        for( var j=0; j < numbers.length; j++ ) {
          var a1 = numbers[j];
          var x = a1.re;
          var y = a1.im;
          x /= A.grid;
          y /= A.grid;
          x += A.xorigin;
          y += A.yorigin;
          if(Number.isFinite(x)&&Number.isFinite(y)){
            o.push(this.p_dot_circle(x,y,g));
          }
        }
        break;
      }

      case 'arrow': {
        //ARGAND
        for( var j=1; j < numbers.length; j++ ) {
          var a1 = numbers[j-1];
          var a2 = numbers[j];
          var x1 = a1.re;
          var y1 = a1.im;
          var x2 = a2.re;
          var y2 = a2.im;
          x1 /= A.grid;
          y1 /= A.grid;
          x1 += A.xorigin;
          y1 += A.yorigin;
          x2 /= A.grid;
          y2 /= A.grid;
          x2 += A.xorigin;
          y2 += A.yorigin;
          if(Number.isFinite(x1)&&Number.isFinite(y1)&&Number.isFinite(x2)&&Number.isFinite(y2)){
            let q = [];
            q.push([x1,y1,'M']);
            q.push([x2,y2,'L']);
            o.push(this.p_arrow(q,g));
          }
        }
        break;
      }

      case 'text': {
        //ARGAND
        for( var j=0; j < numbers.length; j++ ) {
          var a = numbers[j];
          var x = a.re;
          var y = a.im;
          if(Number.isFinite(x)&&Number.isFinite(y)){
            var {label,math} = this.fetch_label_at(txts,j,g);
            var opt = this.fetch_opt_at(opts,j,g);
            var ta = this.assert_ta(opt);
            var [x,y] = this.radial_shift_pt(shift,ta,x,y);
            if(math){
              o.push(this.p_math(x+tx,y+ty,label,ta,g));
            }else{
              o.push(this.p_text(x+tx,y+ty,label,ta,g));
            }
          }
        }
        break;
      }

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
        let pt = this.point(coords, j);
        if (!this.isvalidpt(pt)) continue;
        let x = pt[0];
        let y = pt[1];
        let d = subsubcmd;//'1', '2', '3', '4', ... '10', 'A', 'J', 'Q', 'K'
        o.push(this.to_trump_card(x,y,mypath,d,g,mycolor));
      }
    }
    return o.join('\n')
  }
  do_drawlabel(opts,g,txts,coords){
    var o = [];
    var shift = this.g_to_shift_float(g);
    var tx    = this.g_to_tx_float(g);
    var ty    = this.g_to_ty_float(g);
    for (var j = 0; j < coords.length; ++j){
      var pt = this.point(coords, j);
      if (!this.isvalidpt(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      var {label,math} = this.fetch_label_at(txts,j,g);
      var opt = this.fetch_opt_at(opts,j,g);
      var ta = this.assert_ta(opt);
      var [x,y] = this.radial_shift_pt(shift,ta,x,y);
      if(math){
        o.push(this.p_math(x+tx,y+ty,label,ta,g));
      }else{
        o.push(this.p_label(x+tx,y+ty,label,ta,g));
      }
    }
    return o.join('\n');
  }
  do_drawtext(opts,g,txts,coords){
    var o = [];
    var shift = this.g_to_shift_float(g);
    var tx    = this.g_to_tx_float(g);
    var ty    = this.g_to_ty_float(g);
    for (var j = 0; j < coords.length; ++j){
      var pt = this.point(coords, j);
      if (!this.isvalidpt(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      var {label,math} = this.fetch_label_at(txts,j,g);
      var opt = this.fetch_opt_at(opts,j,g);
      var ta = this.assert_ta(opt);
      var [x,y] = this.radial_shift_pt(shift,ta,x,y);
      if(math){
        o.push(this.p_math(x+tx,y+ty,label,ta,g));
      }else{
        o.push(this.p_text(x+tx,y+ty,label,ta,g));
      }
    }
    return o.join('\n');
  }
  do_drawpango(opts,g,txts,coords){
    var ta = this.assert_ta(opts[0]);
    var {label,math} = this.fetch_label_at(txts,0,g);
    var o = [];
    var extent = this.g_to_extent_float(g);
    for (var i = 0; i < coords.length; ++i){
      var pt = this.point(coords, i);
      if (!this.isvalidpt(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      o.push(this.p_cairo(x,y,label,extent,g));
    }
    return o.join('\n');
  }


  do_drawcontrolpoints(opts,g,txts,coords){    
    var o = [];
    for (var i = 0; i < coords.length; i++) {
      var pt0 = this.point(coords, i-1);
      var pt1 = this.point(coords, i);
      if (!this.isvalidpt(pt1)) continue;
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
        if(this.isvalidpt(pt0)){
          let x0 = pt0[0];
          let y0 = pt0[1];
          o.push(this.p_dot_square(x0,y0,g));
        }
      } if (join==='Q') {
        o.push(this.p_dot_circle(i3,i4,g));
        o.push(this.p_dot_square(x,y,g));
        if(this.isvalidpt(pt0)){
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
      var {label,math} = this.fetch_label_at(txts,j,g);
      var p0 = lineseg1.q0;
      var p1 = lineseg1.q1;
      var q0 = lineseg2.q0;
      var q1 = lineseg2.q1;
      if(this.isvalidpt(p0)&&this.isvalidpt(p1)&&this.isvalidpt(q0)&&this.isvalidpt(q1)&&this.is_same_pt(p1,q0)){
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
          o.push(this.p_stroke(mycoords,g));
        } else {
          if(this.g_to_fillonly_int(g)){
            let g1 = this.update_g_hints(g,this.hint_nostroke);
            let q = this.to_q_pie(x0,y0,r,ang1,angledelta);
            o.push(this.p_draw(q,g1));  
          }else{
            let q = this.to_q_arc(x0,y0,r,ang1,angledelta);
            o.push(this.p_stroke(q,g));
          }
        }
        if (label) {
          var ang = ang1+angledelta/2;
          if (ang > 360) {
            ang -= 360;
          }
          var labelx = x0 + (r+shift) * Math.cos(ang / 180 * Math.PI);
          var labely = y0 + (r+shift) * Math.sin(ang / 180 * Math.PI);
          if(math){
            o.push(this.p_math(labelx,labely,label,'ctr',g));
          }else{
            o.push(this.p_text(labelx,labely,label,'ctr',g));
          }
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
      if(this.isvalidpt(z0)&&this.isvalidpt(z1)){
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
  do_drawcenteredtext(opts,g,txts,coords){
    var shift = this.g_to_shift_float(g);
    var linesegs = this.get_linesegs(coords);
    var tx = this.g_to_tx_float(g);
    var ty = this.g_to_ty_float(g);
    var o = [];
    for(var j=0; j < linesegs.length; j++){
      var lineseg = linesegs[j];
      var {label,math} = this.fetch_label_at(txts,j,g);
      var [x1,y1] = lineseg.q0;
      var [x2,y2] = lineseg.q1;
      var x = (x1 + x2)*0.5;
      var y = (y1 + y2)*0.5;
      if(shift){
        [x,y] = this.lateral_shift_pt(shift, x1,y1, x,y, x2,y2);
      }
      if(math){
        o.push(this.p_math(x+tx,y+ty,label,'ctr',g));
      }else{
        o.push(this.p_text(x+tx,y+ty,label,'ctr',g));
      }
    }
    return o.join('\n');
  }
  do_drawslopedtext(opts,g,txts,coords){
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
      var {label,math} = this.fetch_label_at(txts,j,g);
      x1 = x1_;
      y1 = y1_;
      x2 = x2_;
      y2 = y2_;
      if(math){
        o.push(this.p_slopedmath(x1_,y1_,x2_,y2_,label,ta,g));
      }else{
        o.push(this.p_slopedtext(x1_,y1_,x2_,y2_,label,ta,g));
      }
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
  do_car(opts,g,txts,coords){
    var all = [];
    var xgrid = this.g_to_xgrid_float(g);
    var ygrid = this.g_to_ygrid_float(g);
    var xaxis = this.g_to_xaxis_string(g);
    var yaxis = this.g_to_yaxis_string(g);
    var xtick = this.g_to_xtick_string(g);
    var ytick = this.g_to_ytick_string(g);
    for (var j = 0; j < coords.length; j++) {
      var pt = this.point(coords,j);
      if(!this.isvalidpt(pt)) continue;
      var id = opts[j]||'';
      var xorigin = pt[0];
      var yorigin = pt[1];
      var p = {xorigin,yorigin,xgrid,ygrid,xaxis,yaxis,xtick,ytick};
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
      if(xaxis){
        let txts = this.string_to_array(xaxis);
        var x1 = this.assert_float(txts[0],0);
        var x2 = this.assert_float(txts[1],0);
        var arrowhead = this.assert_float(txts[2],0);
        x1 /= xgrid;
        x2 /= xgrid;
        x1 += xorigin;
        x2 += xorigin;
        var y1 = yorigin;
        var y2 = yorigin;
        var p = [];
        p.push([x1,y1,'M']);
        p.push([x2,y2,'L']);
        if(arrowhead==3){
          o.push(this.p_dblarrow(p,g));
        }else if(arrowhead==2){
          o.push(this.p_revarrow(p,g));
        }else if(arrowhead==1){
          o.push(this.p_arrow(p,g));
        }else{
          o.push(this.p_stroke(p,g));
        }
      }
      if(yaxis){
        let txts = this.string_to_array(yaxis);
        var y1 = this.assert_float(txts[0],0);
        var y2 = this.assert_float(txts[1],0);
        var arrowhead = this.assert_float(txts[2],0);
        y1 /= ygrid;
        y2 /= ygrid;
        y1 += yorigin;
        y2 += yorigin;
        var x1 = xorigin;
        var x2 = xorigin;
        var p = [];
        p.push([x1,y1,'M']);
        p.push([x2,y2,'L']);
        if(arrowhead==3){
          o.push(this.p_dblarrow(p,g));
        }else if(arrowhead==2){
          o.push(this.p_revarrow(p,g));
        }else if(arrowhead==1){
          o.push(this.p_arrow(p,g));
        }else{
          o.push(this.p_stroke(p,g));
        }
      }
      ///draw xtick.
      if(xtick){
        let txts = this.string_to_array(xtick);
        for(let label of txts){
          let num = parseFloat(label);
          if(Number.isFinite(num)){
            let x = xorigin + num/xgrid;
            let y = yorigin
            o.push(this.p_tvbar(x,y,g));
            o.push(this.p_text(x,y,label,'bot',g));
          }
        }
      }
      ///draw ytick.
      if(ytick){
        let txts = this.string_to_array(ytick);
        for(let label of txts){
          let num = parseFloat(label);
          if(Number.isFinite(num)){
            let x = xorigin;
            let y = yorigin + num/ygrid;
            o.push(this.p_rhbar(x,y,g));
            o.push(this.p_text(x,y,label,'lft',g));
          }
        }
      }
    })
    return o.join('\n');
  }
  do_node(opts,g,txts,coords){
    var all = [];
    var showid = this.g_to_showid_int(g);
    var shadow = this.g_to_shadow_int(g);
    var nodetype = this.g_to_nodetype_string(g);
    var tx = this.g_to_tx_float(g);
    var ty = this.g_to_ty_float(g);
    var r = this.g_to_r_float(g);
    for (var j = 0; j < coords.length; j++) {
      var pt = this.point(coords,j);
      if(!this.isvalidpt(pt)) continue;
      var id = opts[j]||'';
      var x = pt[0];
      var y = pt[1];
      var p = {x,y,r,nodetype};
      if(id){
        this.my_node_map.set(id,p);
        this.do_comment(`*** node.${id} ${this.node_to_string(p)}`);
      }else{
        this.do_comment(`*** node ${this.node_to_string(p)}`);
      }
      all.push({id,x,y,r,nodetype,shadow})
    }
    ///no coords is specified, redraw the old nodes
    if(coords.length==0){
      for(var id of opts){
        if(id && this.my_node_map.has(id)){
          var p = this.my_node_map.get(id);
          all.push({...p,id});///make sure shadow setting is excluded, because we don't want to redraw the shadow
        }
      }
    }
    /// start to draw
    var o = [];
    all.forEach((one,j,arr) => {
      let {x,y,r,id,nodetype,shadow} = one;
      let q = null;
      if(nodetype=='RREC'){
        q = this.to_q_RREC(x-r,y-r,r+r,r+r);
      }else if(nodetype=='RECT'){
        q = this.to_q_RECT(x-r,y-r,r+r,r+r);
      }else{
        q = this.to_q_ELLI(x-r,y-r,r+r,r+r);
      }
      if(shadow){
        var g1 = this.update_g_hints(g,this.hint_shadow);
        var dd = 1/this.viewport_unit/2*shadow;
        let q1 = this.dup_coords(q);
        this.offset_coords(q1,dd,-dd);
        o.push(this.p_draw(q1,g1));
      }
      o.push(this.p_draw(q,g));
      if(showid){
        var label = id;
        var math = 0;
      }else{
        var {label,math} = this.fetch_label_at(txts,j,g);
      }
      if(math){
        o.push(this.p_math(x+tx,y+ty,label,'ctr',g));
      }else{
        o.push(this.p_text(x+tx,y+ty,label,'ctr',g));
      }      
    })
    return o.join('\n');
  }
  do_edge(opts,g,txts,coords){
    const shift = this.g_to_shift_float(g);
    const abr = this.g_to_abr_float(g);
    const span = this.g_to_span_float(g);
    const protrude = this.g_to_protrude_float(g);
    const t = this.g_to_t_float(g);
    var o = [];
    for(let j=1; j < opts.length; ++j){
      var name1 = opts[j-1];
      var name2 = opts[j];
      var {label,math} = this.fetch_label_at(txts,j,g);
      if(this.my_node_map.has(name1)&&this.my_node_map.has(name2)){
        var node1 = this.my_node_map.get(name1);
        var node2 = this.my_node_map.get(name2);
        if(name1==name2){
          ///a looped edge from itself-to-itself
          var x1 = node1.x;
          var y1 = node1.y;
          var r1 = node1.r;
          let [p0,p1,p2,p3] = this.abr_to_cbezier_loop(abr,span,protrude, x1,y1,r1);
          o.push(this.p_cbezier_line(p0[0],p0[1], p1[0],p1[1], p2[0],p2[1], p3[0],p3[1], g));
          //figure out where to draw label
          let mylabelx = x1 + Math.cos(abr/180*Math.PI)*(r1+protrude+shift);
          let mylabely = y1 + Math.sin(abr/180*Math.PI)*(r1+protrude+shift);
          if(label){
            o.push(this.p_text(mylabelx,mylabely,label,'ctr',g));
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
            if(math){
              o.push(this.p_math(pt[0],pt[1],label,'ctr',g));
            }else{
              o.push(this.p_text(pt[0],pt[1],label,'ctr',g));
            }
          }
        }
      }
    }
    return o.join('\n');
  }
  do_box(opts,g,txts,coords){
    var all = [];
    var boxtype = this.g_to_boxtype_string(g);
    var shadow = this.g_to_shadow_int(g);
    var w = this.g_to_w_float(g);
    var h = this.g_to_h_float(g);
    var rdx = this.g_to_rdx_float(g);
    var rdy = this.g_to_rdy_float(g);
    var tx = this.g_to_tx_float(g);
    var ty = this.g_to_ty_float(g);
    for (var j = 0; j < coords.length; j++) {
      var pt = this.point(coords, j);
      if (!this.isvalidpt(pt)) continue;
      var id = opts[j]||'';
      var x = pt[0];
      var y = pt[1];
      var p = {x,y,w,h,rdx,rdy,boxtype};
      if(id){
        this.my_box_map.set(id,p);
        this.do_comment(`*** box ${id} = ${this.box_to_string(p)}`);
      }
      all.push({id,x,y,w,h,rdx,rdy,boxtype,shadow});
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
      var {x,y,w,h,rdx,rdy,boxtype,shadow} = one;
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
      if(shadow){
        var g1 = this.update_g_hints(g,this.hint_shadow);
        var dd = 1/this.viewport_unit/2*shadow;
        let q1 = this.dup_coords(q);
        this.offset_coords(q1,dd,-dd);
        o.push(this.p_draw(q1,g1));
      }
      o.push(this.p_draw(q,g));
      var {label,math} = this.fetch_label_at(txts,j,g);
      if(math){
        o.push(this.p_math(x+w/2+tx,y+h/2+ty,label,'ctr',g));
      }else{
        o.push(this.p_text(x+w/2+tx,y+h/2+ty,label,'ctr',g));
      }
    });
    return o.join('\n');
  }
  do_image(opts,g,txts,coords){
    var labels = txts.map(s => s.label);
    var ifile = this.translator.choose_image_file(labels);
    var o = [];
    o.push(this.p_image(ifile));
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
    if(Math.abs(dy) < this.MIN){
      Dx = 0;
      if(x2 >= x0){
        Dy = 1;
      }else{
        Dy = -1;
      }
    }else if(Math.abs(dx) < this.MIN){
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
    if (ta==='lrt') {
      anchor = 'start', valign = 'lower';
    } else if (ta==='bot') {
      anchor = 'middle', valign = 'lower';
    } else if (ta==='llft') {
      anchor = 'end', valign = 'lower';
    } else if (ta==='urt') {
      anchor = 'start', valign = 'upper';
    } else if (ta==='top') {
      anchor = 'middle', valign = 'upper';
    } else if (ta==='ulft') {
      anchor = 'end', valign = 'upper';
    } else if (ta==='rt') {
      anchor = 'start', valign = 'middle';
    } else if (ta==='lft') {
      anchor = 'end', valign = 'middle';
    } else if (ta==='ctr') {
      anchor = 'middle', valign = 'middle';
    } else {
      ///treat it as 'urt'
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
    if(Math.abs(dx) < this.MIN){ dx = 0; }
    if(Math.abs(dy) < this.MIN){ dy = 0; }
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

  fetch_label_at(txts,n,g){
    if(n < txts.length) {
      var {label,math} = txts[n];
    }else if(txts.length) {
      var {label,math} = txts[txts.length-1];
    } else{
      var label = '';
      var math = 0;
    }
    if(g.replace){
      label = this.replace_label(label,g.replace);
    }
    return {label,math};
  }

  __fetch_label_at(line,n,g) {
    const del='\\\\';
    var start_i=0;
    var i = -1;
    var i=line.indexOf(del,start_i);
    //console.log('i=',i);
    for(let j=0; j<n; ++j){
      if(i >= 0){
        start_i = i + del.length;
        //console.log('start_i=',start_i);
      } else {
        break;
      }
      i = line.indexOf(del,start_i);
      //console.log('i=',i);
    }
    //console.log('start_i=',start_i,'i=',i);
    if(i<0){
      var label = line.slice(start_i).trim();
    }else{
      var label = line.slice(start_i,i).trim();
    }
    if(g.replace){
      label = this.replace_label(label,g.replace);
    }
    return label;
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
    if (ta==='lrt') {
      var dx = +labeldx;
      var dy = -labeldy;
    } else if (ta==='bot') {
      var dx = 0;
      var dy = -labeldy;
    } else if (ta==='llft') {
      var dx = -labeldx;
      var dy = -labeldy;
    } else if (ta==='urt') {
      var dx = +labeldx;
      var dy = +labeldy;
    } else if (ta==='top') {
      var dx = 0;
      var dy = +labeldy;
    } else if (ta==='ulft') {
      var dx = -labeldx;
      var dy = +labeldy;
    } else if (ta==='rt') {
      var dx = +labeldx;
      var dy = 0;
    } else if (ta==='lft') {
      var dx = -labeldx;
      var dy = 0;
    } else if (ta==='ctr') {
      var dx = 0;
      var dy = 0;
    } else {
      //treat it as 'urt'
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
    if(ta=='ctr'||ta=='lft'||ta=='rt'){
      var sy = (n-1)*(0.5*baseskip);
    }else if(ta=='top'||ta=='ulft'||ta=='urt'){
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
  string_to_range(s){
    // [1:3:10]
    // [1:10]
    // [1,2,3,4,5]
    var base;
    var limit;
    var step;
    var ss = [];
    var is_colon = 0;
    var v;
    if ((v=this.re_range_two.exec(s))!==null) {
      var base = v[1];
      var limit = v[2];
      var step = 1;
      is_colon = 1;
    } else if ((v = this.re_range_three.exec(s)) !== null) {
      var base = v[1];
      var step = v[2];
      var limit = v[3];
      is_colon = 1;
    } else {
      var ss = s.split(',');
      ss = ss.map(x => x.trim());
      //ss = ss.map(x => parseFloat(x));
      //ss = ss.filter(x => Number.isFinite(x));
    }
    if(is_colon){
      var d = [];
      step = Math.abs(step);
      var n = Math.floor((limit - base) / step);
      n = Math.abs(n);
      if (step >= this.MIN) {
        if (limit > base) {
          for (var j = 0; j <= n; ++j) {
            d.push(parseFloat(+base + (j * step)));
            if(d.length > this.MAX_ARRAY){
              break;
            }
          }
        }
        else if (limit < base) {
          for (var j = 0; j <= n; ++j) {
            d.push(parseFloat(+base - (j * step)));
            if(d.length > this.MAX_ARRAY){
              break;
            }
          }
        }
        else {
          d.push(base);
        }
      }
      return d;
    }
    return ss;
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
  ///NOTE: all g properties
  ///
  update_style_with_group(g){
    if(g.group){
      var id = g.group;
      if(this.my_group_map.has(id)){
        var g0 = this.my_group_map.get(id);
        g = {...g0,...g};
      }
    }
    return g;
  }
  g_to_opacity_float(g){
    g = this.update_style_with_group(g);
    if(g.hints & this.hint_shadow){
      return this.get_float_prop(g,'shadowopacity',0.50,0,1);
    }
    return this.get_float_prop(g,'opacity',1,0,1);
  }
  g_to_angle_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'angle',0,0,90);
  }
  g_to_shade_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'shade','');
  }
  g_to_linedashed_int(g){
    g = this.update_style_with_group(g);
    var t = this.get_int_prop(g,'linedashed',0);
    if(t) return t;
    if(g.hints & this.hint_linedashed){
      return 1;
    }
    return 0;
  }
  g_to_linesize_float(g){
    g = this.update_style_with_group(g);
    var t = this.get_float_prop(g,'linesize',0,0,this.MAX_FLOAT);
    if(g.hints & this.hint_linesize2){
      t += 2;
    }
    if(g.hints & this.hint_linesize4){
      t += 4;
    }
    return t;
  }  
  g_to_dotcolor_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'dotcolor','');
  }
  g_to_linecolor_string(g){
    g = this.update_style_with_group(g);
    if(g.hints & this.hint_nostroke){
      return 'none';
    }
    if(g.hints & this.hint_shadow){
      return 'none';
    }
    if(g.hints & this.hint_stroke1){
      return 'stroke1';
    }
    if(g.hints & this.hint_stroke2){
      return 'stroke2';
    }
    if(g.hints & this.hint_stroke3){
      return 'stroke3';
    }
    return this.get_string_prop(g,'linecolor','');
  }
  g_to_gridcolor_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'gridcolor',this.gridcolor);
  }
  g_to_fillcolor_string(g){
    g = this.update_style_with_group(g);
    if(g.hints & this.hint_nofill){
      return 'none';
    }
    if(g.hints & this.hint_shadow){
      var s = this.get_string_prop(g,'shadowcolor','black');
      return s;
    }
    if(g.hints & this.hint_fill0){
      return 'fill0';
    }
    if(g.hints & this.hint_fill1){
      return 'fill1';
    }
    if(g.hints & this.hint_fill2){
      return 'fill2';
    }
    if(g.hints & this.hint_fill3){
      return 'fill3';
    }
    if(g.hints & this.hint_fill4){
      return 'fill4';
    }
    if(g.hints & this.hint_fill5){
      return 'fill5';
    }
    if(g.hints & this.hint_fill6){
      return 'fill6';
    }
    if(g.hints & this.hint_fill7){
      return 'fill7';
    }
    if(g.hints & this.hint_fill8){
      return 'fill8';
    }
    if(g.hints & this.hint_fill9){
      return 'fill9';
    }
    var s = this.get_string_prop(g,'fillcolor','');
    return s;
  }
  g_to_linecap_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'linecap','');
  }
  g_to_linejoin_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'linejoin','');
  }
  g_to_barlength_float(g) {
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'barlength',this.barlength,0,this.MAX_FLOAT);
  }
  g_to_dotsize_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'dotsize',this.dotsize,0,this.MAX_FLOAT);
  }
  g_to_fontsize_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'fontsize',this.fontsize,0,this.MAX_FLOAT);
  }
  g_to_fontcolor_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'fontcolor','');
  }
  g_to_shadecolor_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'shadecolor','');
  }
  g_to_fontsize_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'fontsize','');
  }
  g_to_fontstyle_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'fontstyle','');
  }
  g_to_fontweight_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'fontweight','');
  }
  g_to_fontfamily_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'fontfamily','');
  }
  g_to_arrowhead_int(g){
    g = this.update_style_with_group(g);
    return this.get_int_prop(g,'arrowhead',0);
  }
  g_to_scaleX_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'scaleX',1);
  }
  g_to_scaleY_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'scaleY',1);
  }
  g_to_rotate_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'rotate',0);
  }
  g_to_shear_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'shear',this.shear,0);
  }
  g_to_w_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'w',this.w,0);
  }
  g_to_h_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'h',this.h,0);
  }
  g_to_r_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'r',this.r,0);
  }
  g_to_mar_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'mar',0);
  }
  g_to_pen_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'pen',0);
  }
  g_to_extent_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'extent',10);
  }
  g_to_nodetype_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'nodetype','');
  }
  g_to_boxtype_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'boxtype','');
  }
  g_to_showid_int(g){
    g = this.update_style_with_group(g);
    return this.get_int_prop(g,'showid',0);
  }
  g_to_shift_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'shift',0);
  }
  g_to_protrude_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'protrude',0);
  }
  g_to_span_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'span',0);
  }
  g_to_t_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'t',0.5);
  }
  g_to_start_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'start',0);
  }
  g_to_abr_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'abr',0);
  }
  g_to_rdx_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'rdx',0);
  }
  g_to_rdy_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'rdy',0);
  }
  g_to_tx_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'tx',0);
  }
  g_to_ty_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'ty',0);
  }
  g_to_fillonly_int(g){
    g = this.update_style_with_group(g);
    return this.get_int_prop(g,'fillonly',0);
  }
  g_to_fn_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'fn');
  }
  g_to_plottype_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'plottype');
  }
  g_to_inversed_int(g){
    ///0=anti-clockwise,1=clockwise
    g = this.update_style_with_group(g);
    return this.get_int_prop(g,'inversed',0);
  }
  g_to_shadowcolor_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'shadowcolor');
  }
  g_to_shadow_int(g){
    g = this.update_style_with_group(g);
    return this.get_int_prop(g,'shadow');
  }
  g_to_xgrid_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'xgrid',1);
  }
  g_to_ygrid_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'ygrid',1);
  }
  g_to_xaxis_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'xaxis');
  }
  g_to_yaxis_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'yaxis');
  }
  g_to_xtick_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'xtick');
  }
  g_to_ytick_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'ytick');
  }
  g_to_width_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'width');
  }
  g_to_height_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'height');
  }
  g_to_skew_string(g){
    g = this.update_style_with_group(g);
    return this.get_string_prop(g,'skew');
  }
  ///
  ///
  ///
  name_to_path_string(str){
    switch(str){
      case 'apple': 
        var mypath = '(.5,.7)..(.25,.85)..(0,.4)..(.5,0)..(1.0,.5)..(.8,.9)..(.5,.7) -- (.5,.7)..(.6,1.0)..(.3,1.1) -- (.3,1.1)..(.4,1.0)..(.5,.7) [z]';
        break;

      case 'basket': 
        var mypath = '(0.3,0) -- (2.6,0)..(2.8,1)..(3,2) -- (3,2)..(1.5,1.5)..(0,2) -- (0,2)..(0.2,1)..(0.3,0) [z]';
        break;

      case 'crate': 
        var mypath = '(4,2) -- (0,2) -- (0,0) -- (4,0) -- (4,2) -- (0,2) -- (1,3) -- (5,3) -- (4,2) -- (4,0) -- (5,1) -- (5,3) -- (4,2) [z]';
        break;

      case 'tree':
        var mypath = '(0,0) -- (-0.4,0) -- (-0.2,0.8) -- (-1,0.4) -- (-0.35,1.1) -- (-0.8,1.1) -- (-0.2,1.5) -- (-0.7,1.5) -- (0,2) -- (0.7,1.5) -- (0.2,1.5) -- (0.8,1.1) -- (0.35,1.1) -- (1,0.4) -- (0.2,0.8) -- (0.4,0) [z]';
        break;

      case 'balloon':
        var mypath = '(0.0, 1)..(0.5, 1.5)..(0.2, 2)..(-0.3, 1.5)..(0, 1) [z] (0, 1)..(-0.05, 0.66)..(0.15, 0.33)..(0, 0)';
        break;

      case 'house':
        var mypath = '&polygon{(-0.5,1),(1.25,3.5),(3,1),(-0.5,1)} &rectangle{(0,0),1,1} &rectangle{(1,0),1.5,1} &rectangle{(1.5,0),0.5,0.5}';
        break;

      case 'school':
        var mypath = '&rectangle{(0,0),7,3} &rectangle{(1,0),1,2} &rectangle{(3,0),1,2} &rectangle{(5,0),1,2} &polygon{(1,3),(1,5),(2,4.5),(1,4)} &polygon{(3,3),(3,5),(4,4.5),(3,4)} &polygon{(5,3),(5,5),(6,4.5),(5,4)}';
        break;

      case 'mouse':
        var mypath = '(2.5,0)--(0,0)..(2.1,1.7)..(3,2)..(4,1.5)..(4,0)..(3,-0.2)..(2.5,0)..(2.3,0.5)..(2.9,1) &circle{(1.1,0.6),0.15} (4,0)..(4.4,0)..(4,-0.5)..(2,-0.5)..(1.5,-0.4)..(1.0,-0.5)  (2.5,0) [l:-0.2,-0.2]';
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
        var mypath = '(0.4,0.4) [a:0.15,0.15,0,1,1,0,0.2] [a:0.15,0.15,0,1,1,0.2,0] [a:0.15,0.15,0,1,1,0,-0.2] [h:-0.07] [q:0,-0.3,0.07,-0.3] [h:-0.2] [q:0.07,0,0.07,0.3] [z]';
        break;

      case 'spade':
        var mypath = '(0.4,0.1) [q:0.07,0,0.07,0.2] [h:-0.07] [c:-0.3,-0.2,-0.30,+0.15,-0.10,+0.35] [s:0.20,0.20,0.20,0.20] [c:0,0,0.2,-0.2,0.2,-0.2] [c:0.2,-0.2,0.2,-0.55,-0.1,-0.35] [h:-0.07] [q:0,-0.2,0.07,-0.2] [z]';
        break;
      
      case 'heart':
        var mypath = '(0.5,0.1) [c:-0.50,0.20,-0.45,0.90,0,0.65] [c:0.40,0.25,0.50,-0.45,0,-0.65] [z]';
        break;

      case 'diamond':
        var mypath = '(0.5,0.1) [l:-0.35,0.375] [l:0.35,0.375] [l:0.35,-0.375] [z]';
        break;

      case 'pail':
        var mypath = '(0,4) [l:0.5,-4] [q:1.5,-0.5,3,0] [l:0.5,4] [q:-2,1,-4,0] [z] (0,4) [q:2,-1,4,0]  (-0.2,4) [q:2.2,4,4.4,0]  (0.2,4) [q:1.8,4,3.6,0] &ellipse{(0.1,3.8),0.4,0.3} &ellipse{(3.9,3.8),0.4,0.3}'; 
        break;
        
      case 'protractor':
        var mypaths = [];
        mypaths.push('(-3.5, 0) -- (-0.1,0)..(0,0.1)..(0.1,0) -- (3.5, 0)..(0, 3.5)..(-3.5, 0)[z] ');
        mypaths.push('(-2.5100, 0.8500) -- (2.5100, 0.8500)..(0, 2.65)..(-2.5100, 0.8500)[z] ');
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
        mypaths.push('(-3.5, 0) -- (-0.1,0)..(0,-0.1)..(0.1,0) -- (3.5, 0)..(0,-3.5)..(-3.5, 0)[z] ');
        mypaths.push('(-2.5100,-0.8500)  -- (2.5100,-0.8500)..(0,-2.65)..(-2.5100,-0.8500)[z] ');
        mypaths.push('( 3.4468, -0.6078) -- ( 3.0529, -0.5383)[z]');
        mypaths.push('( 3.2889, -1.1971) -- ( 2.9130, -1.0603)[z]');
        mypaths.push('( 3.0311, -1.7500) -- ( 2.6847, -1.5500)[z]');
        mypaths.push('( 2.6812, -2.2498) -- ( 2.3747, -1.9926)[z]');
        mypaths.push('( 2.2498, -2.6812) -- ( 1.9926, -2.3747)[z]');
        mypaths.push('( 1.7500, -3.0311) -- ( 1.5500, -2.6847)[z]');
        mypaths.push('( 1.1971, -3.2889) -- ( 1.0603, -2.9130)[z]');
        mypaths.push('( 0.6078, -3.4468) -- ( 0.5383, -3.0529)[z]');
        mypaths.push('( 0.0000, -3.5000) -- ( 0.0000, -3.1000)[z]');
        mypaths.push('(-3.4468, -0.6078) -- (-3.0529, -0.5383)[z]');
        mypaths.push('(-3.2889, -1.1971) -- (-2.9130, -1.0603)[z]');
        mypaths.push('(-3.0311, -1.7500) -- (-2.6847, -1.5500)[z]');
        mypaths.push('(-2.6812, -2.2498) -- (-2.3747, -1.9926)[z]');
        mypaths.push('(-2.2498, -2.6812) -- (-1.9926, -2.3747)[z]');
        mypaths.push('(-1.7500, -3.0311) -- (-1.5500, -2.6847)[z]');
        mypaths.push('(-1.1971, -3.2889) -- (-1.0603, -2.9130)[z]');
        mypaths.push('(-0.6078, -3.4468) -- (-0.5383, -3.0529)[z]');
        mypaths.push('( 0.0000, -0.1000) -- ( 0.0000, -0.8500)[z]');
        var mypath = mypaths.join(' ');
        break;

      default:
        var mypath = '';
        break;
    }
    return mypath;
  }
  to_prodofprimesws(coords,g,label){
    var z = this.point(coords,0);
    var x = z[0];
    var y = z[1];
    var w = 2;
    var h = 1;
    var ss = this.string_to_array(label);
    var prod = ss[0]||1;
    var factors = ss.slice(1);
    var d = [];
    for(let factor of factors){
      var ta = 'llft';
      d.push(this.p_text(x,y,`${factor}`,ta,g));
      d.push(this.p_stroke([[x,y,'M'],[x,y-h,'L'],[x+w,y-h,'L']],g))
      var ta = 'bot';
      d.push(this.p_text(x+1,y,`${prod}`,ta,g));
      y -= h;
      prod /= factor;
      prod = Math.round(prod);
    }
    if(1){
      ///the remaining prod
      var ta = 'bot';
      d.push(this.p_text(x+1,y,`${prod}`,ta,g));
    }
    return d.join('\n')
  }
  to_longdivws(coords,g,label){
    var z = this.point(coords,0);
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
      var ta = 'rt';
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
      var showanswercolor = this.get_string_prop(g,'showanswercolor','');  
      if(showanswercolor){
        g = {...g,fontcolor:showanswercolor,linecolor:showanswercolor};
      }
      for(;showanswer&&k<n;k++){
        r += ss[k];
        var {R,Q,P} = this.calc_remainder_quotient(r,tt.join(''));
        var s = `${Q}`;
        d.push(this.p_text(x+k,y+0.5,s,ta,g));
        r = `${R}`;
        let p = `${P}`
        var m = p.length;
        d.push(this.draw_letter_string(x+k-m+1,y-j,p,g));//draw the product
        d.push(this.p_text(x+k-m,y-j-0.5,'&minus;','rt',g));//draw the minus sign on the left
        d.push(this.p_line(x+k-m+1,y-j-1,x+k+1,y-j-1,g));
        var m = r.length;
        var ex = ss[k+1]||'';
        var r0 = r+ex;
        var r0_n = r0.length;
        if(ex) d.push(this.p_line(x+k+1+0.5,y-1,x+k+1+0.5,y-1-j,{...g,arrowhead:1}));
        j++;
        d.push(this.draw_letter_string(x+k-m+1,y-j,r0,g));
        j++;
      }
    }
    return d.join('\n')
  }
  to_multiws(coords,g,label){
    var z = this.point(coords,0);
    var x = z[0];
    var y = z[1];
    var showanswer = this.get_int_prop(g,'showanswer',0);
    var showanswercolor = this.get_string_prop(g,'showanswercolor','');
    // var decimalpoint = this.get_string_prop(g,'decimalpoint','');
    // var decimalpoints = this.string_to_int_array(decimalpoint);
    var g = {...g,dotsize:3}
    var [number,divisor] = this.string_to_array(label);
    var [number,decimalpoint1] = this.extract_decimal_point(number);
    var [divisor,decimalpoint2] = this.extract_decimal_point(divisor);
    var d = [];
    var all = [];
    if(number && divisor){
      var ss = `${number}`.split('');
      var tt = `${divisor}`.split('');
      var ta = 'rt';
      var n = ss.length;
      var m = tt.length;
      var s = ss.join('');
      var t = tt.join('');
      ///draw the top number
      d.push(this.draw_letter_string(x,y,s,g));
      ///draw the second number
      d.push(this.draw_letter_string(x+(n-m),y-1,t,g));
      ///draw the multiplication sign
      d.push(this.p_text(x-m,y-1-0.5,'&times;','rt',g));
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
      if(showanswer){
        let q3 = decimalpoint1 + decimalpoint2;
        var g = {...g,fontcolor:showanswercolor,linecolor:showanswercolor,dotcolor:showanswercolor};
        let dy=2,dx=0,flag=0,flags=[];
        var p='';
        for(let j=m;j>0;j--,dx++){
          let b = tt.slice(j-1,j);
          if(j<m){
            dy++;
            p='';
          }
          for(let i=n;i>0;i--){
            if(p.length > 1){
              dy++;
            }
            let a = ss.slice(i-1,i);
            var p = `${a*b}`;
            all.push(p + '0'.repeat(dx+(n-i)));
            d.push(this.draw_letter_string_flushright(x+i-dx,y-dy,p,g));
          }
        }
        if(dy>2){
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
      d.push(this.p_text(x+i,y-0.5,t,'rt',g));
    });
    return d.join('\n')
  }
  draw_letter_string_flushright(x,y,label,g){
    var d = [];
    var tt = label.split('');
    var n = tt.length;
    tt.forEach((t,i) => {
      let dx = tt.length;
      d.push(this.p_text(-n+x+i,y-0.5,t,'rt',g));
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
        let i = env['@']||0;
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
  string_to_hexcolor(s,hints){
    // the 're_colorfunction' would detect the color function
    // such as "hwb(30|10%|20%)" 
    let v;
    if(s==='fill0'){
      s = 'hwb(0,0%,20%)';
    }else if(s==='fill1'){
      s = 'hwb(210,0%,20%)';
    }else if(s==='fill2'){
      s = 'hwb(300,0%,20%)';
    }else if(s==='fill3'){
      s = 'hwb(60,0%,20%)';
    }else if(s==='fill4'){
      s = 'hwb(240,0%,20%)';
    }else if(s==='fill5'){
      s = 'hwb(90,0%,20%)';
    }else if(s==='fill6'){
      s = 'hwb(30,0%,20%)';
    }else if(s==='fill7'){
      s = 'hwb(150,0%,20%)';
    }else if(s==='fill8'){
      s = 'hwb(180,0%,20%)';
    }else if(s==='fill9'){
      s = 'hwb(270,0%,20%)';
    }else if(s==='stroke1'){
      s = 'red';
    }else if(s==='stroke2'){
      s = 'green';
    }else if(s==='stroke3'){
      s = 'blue';
    }else if((v=this.re_is_colorfunction.exec(s))!==null){
      ///NOTE: convert '@hwb(30|30%|30%)' to 'hwb(30,30%,30%)'
      let key = v[1];
      let val = v[2];
      s = `${key}(${val.split('|').join(',')})`;
    }
    var b = this.w3color(s);///'b' is a special object
    if(hints & this.hint_darker){
      b.darker(15);
    }
    if(hints & this.hint_lighter){
      b.lighter(15);
    }
    s = b.toHexString();
    return s;
  }
  //////////////////////////////////////////////////////////////////
  //
  //
  //////////////////////////////////////////////////////////////////
  assert_arg_point(args,i){
    if(i>=0&&i<args.length){
      return this.point(args[i].coords,0);
    }
    return [0,0];
  }
  assert_arg_coords(args,i){
    if(i>=0&&i<args.length){
      return args[i].coords;
    }
    return [];
  }
  assert_arg_float(args,i){
    if(i>=0&&i<args.length){
      return this.float(args[i].array,0);
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
    if(this.config.verbose){
      console.log(s);
    }
  }
  replace_label(label,replace){
    var arr = this.string_to_array(replace);
    for(let j=0; j < arr.length; j+=1){
      var [key,val] = arr[j].split('/');
      key = key||'';
      val = val||'';
      if(typeof label=='string' && label.localeCompare(key)==0){
        return val;
      }
    }
    return label;
  }

  has_shades(g) {
    var s = this.g_to_shade_string(g);
    return (s) ? true : false;
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
      var z0 = this.point(coords, i);
      if(!this.isvalidpt(z0)) continue;
      var offsetx = z0[0];
      var offsety = z0[1];
      var q = this.dup_coords(p);
      this.offset_coords(q,offsetx,offsety);
      if(operation=='fill'){
        o.push(this.p_fill(q,g));
      }else if(operation=='stroke'){
        o.push(this.p_stroke(q,g));
      }else if(operation=='arrow'){
        o.push(this.p_arrow(q,g));
      }else if(operation=='revarrow'){
        o.push(this.p_revarrow(q,g));
      }else if(operation=='dblarrow'){
        o.push(this.p_dblarrow(q,g));
      }else{
        o.push(this.p_draw(q,g));
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
    return Math.abs(a1-a2) < this.MIN;
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
    const re_fgroup = /^%(\-?)(\+?)(\s?)(0?)([1-9]*)(\.?)([1-9]*)([A-Za-z%_])(.*)$/;
    var v;
    var d = [];
    while(fmt.length){
      ///note that 'args' is a array obtained by doing this.string_to_array()
      if((v=re_fgroup.exec(fmt))!==null){
        let f_minus_sign = v[1];
        let f_plus_sign = v[2];
        let f_sp = v[3];
        let f_leading_zero = v[4];
        let f_min_field = v[5];
        let f_dot = v[6];
        let f_precision = v[7];
        let f_letter = v[8];
        fmt = v[9];
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
          if(f_leading_zero){
            ///add zeros at the beginning
            s = '0'.repeat(f_min_field-s.length) + s;
          }
          else if(f_minus_sign){
            ///add spaces at the end
            s = s + ' '.repeat(f_min_field-s.length);
          }else{
            ///add spaces at the beginning
            s = ' '.repeat(f_min_field-s.length) + s;
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
    let innersquare = '(0,0) [h:3] [v:4] [h:-3] [z]';
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
    if(this.g_to_shadow_int(g)){
      let shadow = this.g_to_shadow_int(g);
      let g1 = this.update_g_hints(g,this.hint_shadow);
      let dd = 1/this.viewport_unit/2*shadow;
      let x1 = x+dd;
      let y1 = y-dd;
      let q3 = this.to_q_RREC(x1,y1,5*scaleX,6*scaleY,0.4*scaleX,0.4*scaleY);
      all.push(this.p_draw(q3,g1));  
      // all.push(this.p_rrect(x1,y1,5*scaleX,6*scaleY,0.4*scaleX,0.4*scaleY,g1));
    }
    let q4 = this.to_q_RREC(x,y,5*scaleX,6*scaleY,0.4*scaleX,0.4*scaleY);
    all.push(this.p_draw(q4,{...g,fillcolor:'white'}));
    // all.push(this.p_rrect(x,y,5*scaleX,6*scaleY,0.4*scaleX,0.4*scaleY,{...g,fillcolor:'white'}));
    g = {...g,fontcolor:mycolor,fillcolor:mycolor,fontsize:fontsize,linesize:0,hints:0}
    if(d==='10'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'10','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,2*scaleX,0*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0*scaleX,-1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0*scaleX,-1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0*scaleX,-1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,-1*scaleX,0.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0*scaleX,2*scaleY);
      all.push(this.p_fill(q,g));
    }else if(d==='9'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'9','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,2*scaleX,0);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,-1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,-1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,-1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,-1*scaleX,1.5*scaleY);
      all.push(this.p_fill(q,g));
    }else if(d==='8'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'8','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,-1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
    }else if(d==='7'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'7','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,-1.5*scaleY);
      //o.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));      
    }else if(d==='6'){
      ///
      all.push(this.p_text(x+(0.5*scaleX),y+(0.5+5)*scaleX,'6','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      //o.push(this.p_fill(q,g));
      this.offset_coords(q,0,-1.5*scaleY);
      //o.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-0.75*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));           
    }else if(d==='5'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'5','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));       
    }else if(d==='4'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'4','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,1*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,1*scaleX,-1.5*scaleY);
      this.offset_coords(q,1*scaleX,-1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));        
    }else if(d==='3'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'3','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,2*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,1.5*scaleY);
      all.push(this.p_fill(q,g));
    }else if(d==='2'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'2','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      this.offset_coords(q,2*scaleX,1*scaleY);
      all.push(this.p_fill(q,g));
      this.offset_coords(q,0,3*scaleY);
      all.push(this.p_fill(q,g));
    }else if(d==='A'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'A','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      all.push(this.p_fill(q2,g));
    }else if(d==='J'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'J','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      all.push(this.p_stroke(sq,{...g,linesize:0,linecolor:'lightgray'}));      
      ///
      let myjack = '(0.5,0.5) [a:0.4,0.4,0,0,1,1.8,0] [z] (0.5,0.5) [l:1.2,-0.5] [q:0.5,0,0.8,0.2] [l:-0.2,0.3] [z]';
      let [jack] = this.read_coords(myjack,{});
      this.offset_coords(jack,x+1*scaleX,y+1*scaleY,scaleX,scaleY);
      this.offset_coords(jack,0,2*scaleY);
      all.push(this.p_draw(jack,g));
      all.push(this.p_text(x+2.5*scaleX,y+3*scaleY,"JACK",'bot',g)) 
    }else if(d==='Q'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'Q','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      all.push(this.p_stroke(sq,{...g,linesize:0,linecolor:'lightgray'}));      
      ///
      let myjack = '(0.75,0.25) [q:0.75,-0.5,1.5,0] [l:0.25,0.75] [l:-0.5,-0.4] [l:0,0.5] [l:-0.25,-0.5] [l:-0.25,0.75] [l:-0.25,-0.75] [l:-0.25,0.5] [l:0,-0.5] [l:-0.5,0.4] [z] &circle{(2.5,1),0.1} &circle{(2,1.05),0.1} &circle{(1.5,1.35),0.1} &circle{(1,1.05),0.1} &circle{(0.5,1),0.1}';
      let [jack] = this.read_coords(myjack,{});
      this.offset_coords(jack,x+1*scaleX,y+1*scaleY,scaleX,scaleY);
      this.offset_coords(jack,0,2*scaleY);
      all.push(this.p_draw(jack,g));      
      all.push(this.p_text(x+2.5*scaleX,y+3*scaleY,"QUEEN",'bot',g)) 
    }else if(d==='K'){
      ///
      all.push(this.p_text(x+0.5*scaleX,y+(0.5+5)*scaleY,'K','ctr',g))
      all.push(this.p_fill(q1,g));
      ///
      all.push(this.p_stroke(sq,{...g,linesize:0,linecolor:'lightgray'}));      
      ///
      let myjack = '(0.5,0) [h:2] [v:0.85] [l:-0.25,-0.25] [l:-0.25,0.35] [l:-0.25,-0.25] [l:-0.25,0.55] [l:-0.25,-0.55] [l:-0.25,0.25] [l:-0.25,-0.35] [l:-0.25,0.25] [z] &circle{(2.5,0.85),0.1} &circle{(2,1.00),0.1} &circle{(1.5,1.35),0.1} &circle{(1,1.0),0.1} &circle{(0.5,0.85),0.1}';
      let [jack] = this.read_coords(myjack,{});
      this.offset_coords(jack,x+1*scaleX,y+1*scaleY,scaleX,scaleY);
      this.offset_coords(jack,0,2*scaleY);
      all.push(this.p_draw(jack,g));     
      all.push(this.p_text(x+2.5*scaleX,y+3*scaleY,"KING",'bot',g)) 
    }
    return all.join('\n');
  }
  ///////////////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////////////
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
      ta = 'urt';
    }
    switch(ta){
      case 'urt':  x += dx, y += dy; break;
      case 'lrt':  x += dx, y -= dy; break;
      case 'ulft': x -= dx, y += dy; break;
      case 'llft': x -= dx, y -= dy; break;
      case 'top':  y += dy; break;
      case 'bot':  y -= dy; break;
      case 'rt':   x += dx; break;
      case 'lft':  x -= dx; break;
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
    var [numbers] = this.read_array(val,env);
    var floats = this.numbers_to_floats(numbers);
    return [name,floats];
  }
}
module.exports = { NitrilePreviewDiagram };
























