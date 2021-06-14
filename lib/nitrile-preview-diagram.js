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
    /// range expression
    this.re_range_two = /^([^:]+):([^:]+)$/;
    this.re_range_three = /^([^:]+):([^:]+):([^:]+)$/;
    /// regular expression
    this.re_format_command = /^format\s+(\w+)\s*=\s*\"(.*?)\"\s*(.*)$/;
    this.re_for_command = /^for\s+(.*)\s*do$/;
    this.re_config_command = /^config\s+(\w+)\s*(.*)$/;
    this.re_exit_command = /^exit/;
    this.re_path_command = /^path\s+(.*?)\s*\=\s*(.*)$/;
    this.re_fn_command =    /^fn\s+([A-Za-z][A-Za-z0-9]*)\((.*?)\)\s*=\s*(.*)$/;
    this.re_var_command = /^var\s+([A-Za-z][A-Za-z0-9]*)(\[\]|)\s*=\s*(.*)$/;
    this.re_group_command = /^group\s+(\w+)\s*=\s*(.*)$/;
    this.re_id_command = /^id\s+(.*)$/;
    this.re_origin_command = /^origin\s+(.*)$/;
    this.re_show_command = /^show\s+(.*)$/;
    ///
    this.re_commentline = /^(\%+)(.*)$/;
    // 
    // Following command will generate output
    //
    /*
    this.re_drawcontrolpoints_command = /^drawcontrolpoints(\.\w+|)\s+(.*)$/;
    this.re_drawanglearc_command = /^drawanglearc(\.\w+|)\s+(.*)$/;
    this.re_drawlinesegcong_command = /^drawlinesegcong(\.\w+|)\s+(.*)$/;
    this.re_drawlineseglabel = /^drawlineseglabel(\.\w+|)\s+(.*)$/;
    // fill, no stroking
    this.re_draw_command = /^draw(\.\w+|)\s+(.*)$/;
    this.re_fill_command = /^fill(\.\w+|)\s+(.*)$/;
    this.re_stroke_command = /^stroke(\.\w+|)\s+(.*)$/;
    this.re_arrow_command = /^arrow(\.\w+|)\s+(.*)$/;
    this.re_revarrow_command = /^revarrow(\.\w+|)\s+(.*)$/;
    this.re_dblarrow_command = /^dblarrow(\.\w+|)\s+(.*)$/;
    // node and edge
    this.re_node_command = /^node(\.[\.\w]+|)\b\s*(.*)$/;
    this.re_edge_command = /^edge(\.[\.\w]+|)\b\s*(.*)$/;
    // box and connecting lines - TODO
    this.re_box_command =  /^box(\.[\.\w]+|)\s+(.*)$/;
    // label and text
    this.re_math_command =         /^math(\.[\.\w]+|)\s+(.*)$/;
    this.re_label_command =         /^label(\.[\.\w]+|)\s+(.*)$/;
    this.re_text_command =         /^text(\.[\.\w]+|)\s+(.*)$/;
    // dot
    this.re_dot_command =             /^dot(\.[\.\w]+|)\s+(.*)$/;
    // scalar command - cartesian 
    this.re_cartesian_command =      /^cartesian(\.[\.\w]+|)\s*(.*)$/;
    // scalar command
    this.re_barchart_command =       /^barchart(\.[\.\w]+|)\s*(.*)$/;
    // scalar command
    this.re_lego_command =           /^lego(\.[\.\w]+|)\s*(.*)$/;
    // special command
    this.re_prodofprimes_command = /^prodofprimes(\.[\.\w]+|)\s+(.*)$/;
    this.re_longdivws_command = /^longdivws(\.[\.\w]+|)\s+(.*)$/;
    this.re_multiws_command = /^multiws(\.[\.\w]+|)\s+(.*)$/;
    */
    // symbol variable
    this.re_symbol_name         = /^([A-Za-z][A-Za-z0-9]*)$/;
    // path symbol
    this.re_pathvar_single      = /^&([A-Za-z][A-Za-z0-9]*_?[0-9]*)\s*(.*)$/;
    // path function
    this.re_parse_pathfunc      = /^&([A-Za-z][A-Za-z0-9]+)\{(.*?)\}\s*(.*)$/;
    // when reading numbers
    this.re_numbers_is_fn                 = /^\^fn:(\w+)\s*(.*)$/;
    this.re_numbers_is_var                = /^([A-Za-z][A-Za-z0-9]*)\s*(.*)$/;
    this.re_numbers_is_solid              = /^(\S+)\s*(.*)$/;
    this.re_numbers_is_list               = /^\[(.*?)\]\s*(.*)$/;
    this.re_numbers_is_spread             = /^([^!]+)!([^!]+)!([^!]+)$/;
    this.re_numbers_is_range_expr2        = /^([^:]+):([^:]+)$/;
    this.re_numbers_is_range_expr3        = /^([^:]+):([^:]+):([^:]+)$/;
    this.re_numbers_is_array              = /^@([A-Za-z0-9_]+)$/;
    // path construction
    this.re_coords_cycle    = /^\(cycle\)\s*(.*)$/;
    this.re_coords_nan      = /^\(\)\s*(.*)$/;
    this.re_coords_dashdot  = /^(~+|\.\.)\s*(.*)$/;
    this.re_coords_point    = /^\((.*?)\)\s*(.*)$/;
    this.re_coords_aux      = /^\^([A-Za-z]+)(:?)(\S*)\s*(.*)$/;
    this.re_coords_flow     = /^<(.*?)>\s*(.*)$/;
    this.re_coords_relative = /^\[(.*?)\]\s*(.*)$/;
    this.re_coords_style    = /^\{(.*?)\}\s*(.*)$/;
    this.re_coords_label    = /^\"([^"]*)\"\s*(.*)$/;
    //
    // this.re_scientific_notation = /^(\d+[eE](?:\+|\-|)\d+)(.*)$/;
    //
    // range, [1:2], [1:2:7], [1,2,3,4]
    this.re_range_expr_3 = /^\[(.*?):(.*?):(.*?)\]\s*(.*)$/;
    this.re_range_expr_2 = /^\[(.*?):(.*?)\]\s*(.*)$/;
    this.re_range_expr_1 = /^\[(.*?)\]\s*(.*)$/;
    // a color function such as rgb(...) or hwb(...)
    this.re_colorfunction =  /^([A-Za-z][A-Za-z0-9]*)\((.*)\)$/;
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
    this.gridcolor = 'rgb(235|235|235)';
    /// all hints
    this.hint_linedashed = 1;
    this.hint_linesize2  = 2;
    this.hint_linesize4  = 4;
    this.hint_nostroke   = 8;
    this.hint_nofill     = 16
    this.hint_lighter    = 32;
    this.hint_darker     = 64;
    this.hint_hallow     = 128;
    this.hint_shadow     = 256;
    ///initialize internals, these internals are to be reset 
    /// for each instance of diagram invoation
    this.init_internals();
  }

  init_internals(){
    /// clipathid
    //this.my_clipath_id = 0;
    /// configuration parameters
    this.config = {}; 
    /// all translated commands in SVG or MP/MF
    this.commands = [];
    /// the last configured cartesian coord
    this.my_cartesian = {};
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
    /// all nodes
    this.my_node_map = new Map();
    /// all recordings
    this.my_box_map = new Map();
    /// all recordings
    this.my_rec_map = new Map();
    /// all the linesegs
    this.my_lineseg_array = [];
    /// lastpt
    this.my_lastpt_x = 0;
    this.my_lastpt_y = 0;
    /// viewport
    this.viewport_width = 13;
    this.viewport_height = 7;
    this.viewport_unit = 5;
    /// id
    this.id = 0;
    /// origin
    this.origin_x = 0;
    this.origin_y = 0;
    this.origin_s = 1;
    this.origin_r = 0;
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
      }else if(val.startsWith('^mark:')){
        let symbol = val.substr(6);
        if(this.re_symbol_name.test(symbol)){
          let pt = [0,0];
          pt[0] = this.origin_x;
          pt[1] = this.origin_y;
          let p = [pt];
          this.my_path_map.set(symbol,p);
          this.do_comment(`*** ${symbol} = (${pt[0]},${pt[1]})`);
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
          this.origin_s = s;
        }
      }else if(val.startsWith('^r:')){
        // '^r:45'
        let s = val.substr(3);
        s = parseFloat(s);
        if(Number.isFinite(s)){
          this.origin_r = s;
        }
      }else if(val.startsWith('^reset')){
        this.origin_x = 0;
        this.origin_y = 0;
        this.origin_s = 1;
        this.origin_r = 0;
      }
    });
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
          s = `${s0} ${s.trimLeft()}`;
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
    var load_buf = null;
    var v;
    const re_buf_save = /^(%%%)=(\w+)$/;
    const re_buf_load = /^(%%%)\?(\w+)$/;
    const re_buf_stop = /^(%%%)/;
    for(var s of lines){
      if((v=this.re_commentline.exec(s))!==null){
        if((v=re_buf_save.exec(s))!==null){
          let name = v[2];
          save_buf = [];
          style.buffers[name] = save_buf;
          continue;
        }
        if((v=re_buf_load.exec(s))!==null){
          let name = v[2];
          load_buf = style.buffers[name];
          if(load_buf && Array.isArray(load_buf) ){
            o = o.concat(load_buf);
          }
          continue;
        }
        if((v=re_buf_stop.exec(s))!==null){
          save_buf = null;
          continue;
        }
        ///do not save a comment line
        continue;
      } 
      if(save_buf){
        save_buf.push(s);
      }
      o.push(s);
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
      var [line,flag] = this.replace_line_env_variables(line,env);
      if(0){
        this.do_comment(line);
      }
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
        let valid_name = this.re_symbol_name.test(f.name);
        let valid_args = f.args.filter((s) => this.re_symbol_name.test(s));
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
      // var a = [12.3 12.4 12.5]
      //
      if((v=this.re_var_command.exec(line))!==null){
        let precision = this.g_to_precision_int(this.config);
        let name = v[1];
        let index = v[2];
        let s1 = v[3];
        if(index.length){
          let [numbers] = this.read_complex_numbers(s1,env);//returns an array 'Complex' number
          env[name] = numbers;
          this.do_comment(`*** env ${name}[] = ${this.numbers_to_string(numbers,precision)}`);
        }else{
          let [a] = this.expr.extract_next_expr(s1,env);
          env[name] = a;
          this.do_comment(`*** env ${name} = ${this.numbers_to_string([a],precision)}`);          
        }
        continue;
      }  
      //
      // group mygroup = {linesize:1,w:3,h:2}
      //
      if((v = this.re_group_command.exec(line)) !== null) {
        var id = v[1];
        var g = this.string_to_style(v[2]);
        this.my_group_map.set(id,g);
        continue;
      }
      //
      // id
      //
      if((v = this.re_id_command.exec(line)) !== null) {
        var id = v[1].trim();
        this.id = id;
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
      // show    
      //
      if((v=this.re_show_command.exec(line))!==null) {
        let s = v[1];
        this.do_comment(`*** show ${s}`);
        continue;
      }
      //
      // format
      //
      if((v=this.re_format_command.exec(line))!==null){
        let name = v[1];
        let fmt = v[2];
        let args = this.string_to_array(v[3]);
        let s = this.do_format(fmt,args,env);
        env[name] = s;
        this.do_comment(`*** env ${name} = ${s}`);
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
            let name = v[1];
            let s1 = v[2];
            let [numbers] = this.read_complex_numbers(s1,env);//returns an array 'Complex' number
            let seq = this.numbers_to_floats(numbers);
            iter_array.push({name,seq});
            max_n = Math.max(seq.length,max_n);
          }else{
            break;
          }
        }
        //trim loop body also makes a copy
        for(var i=0; i < max_n; ++i){
          //execute loopbody 'max_n' number of times
          //NOTE: each time set the '@' environment variable to the counter starting with '0'
          env['@']=`${i}`;
          this.do_comment(`*** env @ = ${i}`);
          for(var j=0; j < iter_array.length; ++j){
            //update 'env' with the loop variables
            let iter = iter_array[j];
            let key = iter.name;
            let val = iter.seq[i]||0;
            env[key] = val;
            this.do_comment(`*** env ${key} = ${val}`);
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
      if(line==='done'){
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

  get_next_id(){
    if(typeof this.id === 'string'){
      const re_A = /^[A-Z]$/;
      const re_a = /^[a-z]$/;
      const re_0 = /^[0-9]+$/;
      const re_hybrid = /^([A-Za-z]+)([0-9]+)$/;
      if(re_A.test(this.id)){
        var id = this.id;
        let cc = id.codePointAt(0);
        cc += 1;
        let nextid = String.fromCodePoint(cc);
        if(re_A.test(nextid)){
          this.id = nextid;
        }else{
          this.id = 'A';
        }
      }else if(re_a.test(this.id)){
        var id = this.id;
        let cc = id.codePointAt(0);
        cc += 1;
        let nextid = String.fromCodePoint(cc);
        if(re_a.test(nextid)){
          this.id = nextid;
        }else{
          this.id = 'a';
        }
      }else if(re_0.test(this.id)){
        var id = parseInt(this.id);
        this.id = `${id+1}`;
      }else if(re_hybrid.test(this.id)){
        var id = this.id;
        let v = re_hybrid.exec(this.id);
        let alpha = v[1];
        let num = parseInt(v[2]);
        this.id = `${alpha}${num+1}`;
      }else{
        var id = '0';
        this.id = '1';
      }      
    }else{
      var id = '0';
      this.id = '1';
    }
    return id;
  }

  exec_action_command(style,line,env) {
    // NOTE: that that at this stage all env-variables have been replaced
    const re_command_line = /^([A-Za-z][A-Za-z0-9\-]*)(\.[\.\w]+|)\b\s*(.*)$/;
    var v = re_command_line.exec(line);
    if(v===null){
      return '';
    }
    var o = [];
    var cmd = v[1];
    var subcmd = '';
    var subsubcmd = '';
    var opts = this.string_to_command_opts(v[2]);
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
    ///NOTE: replace opt if it is _ with the current ID.
    ///
    var modified_flag = 0;
    opts = opts.map((x) => {
      if(x=='_'){
        modified_flag = 1;
        var id = this.get_next_id();
        this.do_comment(`***id: ${id}`)
        return `${id}`
      }else{
        return x;
      }
    })
    ///
    ///NOTE: always set the 'opt' to the first element of 'opts'
    ///
    var [opt] = opts;
    ///
    ///
    ///NOTE: *label* and *text* command
    ///
    if (cmd == 'text'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_text(opts,g,txts,coords));///own method
    }
    else if (cmd == 'slopedtext'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_slopedtext(opts,g,txts,coords));///own method
    }
    else if (cmd == 'cairo'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_cairo(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: specialized draw/fill commands
    ///
    else if (cmd=='drawcontrolpoints') {
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawcontrolpoints(opts,g,txts,coords));//own method
    }
    else if (cmd=='drawlinesegarc'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawlinesegarc(opts,g,txts,coords));///own method
    }
    else if (cmd=='drawlinesegcong'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawlinesegcong(opts,g,txts,coords));//own method
    }
    else if (cmd=='drawlineseglabel'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_drawlineseglabel(opts,g,txts,coords));//own method
    }
    else if (cmd=='fillspace'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_fillspace(opts,g,txts,coords));//own method
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
        o.push(this.draw_text_between_points(txts,g,coords));
        this.register_linesegs(coords);
      }
    }
    else if (cmd=='fill'){
      let [coords,g,txts] = this.read_coords(data,env);
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
        o.push(this.draw_text_between_points(txts,g,coords));
      }
    }
    else if (cmd=='stroke'){
      let [coords,g,txts] = this.read_coords(data,env);
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
        o.push(this.draw_text_between_points(txts,g,coords));
        this.register_linesegs(coords);
      }
    }
    else if (cmd=='arrow'){
      let [coords,g,txts] = this.read_coords(data,env);
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
        o.push(this.draw_text_between_points(txts,g,coords));
      }
    }
    else if (cmd=='revarrow'){
      let [coords,g,txts] = this.read_coords(data,env);
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
        o.push(this.draw_text_between_points(txts,g,coords));
      }
    }
    else if (cmd=='dblarrow'){
      let [coords,g,txts] = this.read_coords(data,env);
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
        o.push(this.draw_text_between_points(txts,g,coords));
      }
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
    ///NOTE: Following commands are *dot* commands
    ///
    else if (cmd=='dot'){
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
    ///NOTE: The box and flow command   
    ///
    else if (cmd=='box'){
      let [coords,g,txts] = this.read_coords(data,env);
      o.push(this.do_box(opts,g,txts,coords));///own method
    }
    ///
    ///NOTE: the cartesian command
    ///
    else if (cmd=='cartesian'){
      let [numbers,g,txts] = this.read_complex_numbers(data,env);
      o.push(this.do_cartesian(subcmd,opts,g,txts,numbers,env));///own method
    }
    ///
    ///NOTE: the barchart command
    ///
    else if (cmd=='barchart'){
      let [numbers,g,txts] = this.read_complex_numbers(data,env);
      o.push(this.do_barchart(subcmd,opts,g,txts,numbers));///own method
    }
    ///
    ///NOTE: the lego command
    ///
    else if (cmd=='lego'){
      let [numbers,g,txts] = this.read_complex_numbers(data,env);
      o.push(this.do_lego(subcmd,opts,g,txts,numbers));///own method
    }
    ///
    ///NOTE: the argand command
    ///
    else if (cmd=='argand'){
      let [numbers,g,txts] = this.read_complex_numbers(data,env);
      o.push(this.do_argand(subcmd,opts,g,txts,numbers));///own method
    }
    ///
    ///NOTE: the trump command
    ///
    else if (cmd=='trump'){
      let [numbers,g,txts] = this.read_complex_numbers(data,env);
      o.push(this.do_trump(subcmd,subsubcmd,opts,g,txts,numbers));///own method
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
      ///***important*** duplicate this coords
      var p = this.dup_coords(p);
      if(Number.isFinite(index)){
        ///single point
        if(index < p.length){
          let pt = p[index];
          pt[2] = 'M';//clear the 'join' field so that it may be assigned to 'L' by the caller
          return [pt];
        }else{
          return [];
        }
      }else{
        return p;
      }
    }
    if(symbol=='lastpt'){
      return [[this.my_lastpt_x,this.my_lastpt_y]];
    }
    if(symbol=='northwest'){
      return [[0-this.origin_x,this.viewport_height-this.origin_y]];
    }
    if(symbol=='northeast'){
      return [[this.viewport_width-this.origin_x,this.viewport_height-this.origin_y]]
    }
    if(symbol=='southwest'){
      return [[0-this.origin_x,0-this.origin_y]]
    }
    if(symbol=='southeast'){
      return [[this.viewport_width-this.origin_x,0-this.origin_y]]
    }
    if(symbol=='center'){
      return [[this.viewport_width/2-this.origin_x,this.viewport_height/2-this.origin_y]]
    }
    if(symbol=='south'){
      return [[this.viewport_width/2-this.origin_x,0-this.origin_y]];
    }
    if(symbol=='north'){
      return [[this.viewport_width/2-this.origin_x,this.viewport_height-this.origin_y]];
    }
    if(symbol=='west'){
      return [[0-this.origin_x,this.viewport_height/2-this.origin_y]];
    }
    if(symbol=='east'){
      return [[this.viewport_width-this.origin_x,this.viewport_height/2-this.origin_y]];
    }
    if(symbol=='bbox'){
      let ret_val = [];
      ret_val.push([0-this.origin_x,0-this.origin_y,'M']);
      ret_val.push([this.viewport_width-this.origin_x,0-this.origin_y,'L']);
      ret_val.push([this.viewport_width-this.origin_x,this.viewport_height-this.origin_y,'L']);
      ret_val.push([0-this.origin_x,this.viewport_height-this.origin_y,'L']);
      ret_val.push([0,0,'cycle']);
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

  is_arg_coords(a){
    if(a && Array.isArray(a.coords) && a.coords.length){
      return true;
    }
    return false;
  }

  is_arg_scalar(a){
    if(a && Number.isFinite(a.scalar)){
      return true;
    }
    return false;
  }

  /// this is called inside readCoordsLine()
  exec_path_func(name,args) {
    var ret_val = [];
    switch (name) {

      case 'midpoint': {

        let z0,z1,fraction;
        if(args.length == 1 && this.is_arg_coords(args[0])){
          z0 = this.point(args[0].coords, 0);
          z1 = this.point(args[0].coords, 1);
          fraction = 0.5;
        } else if(args.length == 2 && this.is_arg_coords(args[0]) && this.is_arg_scalar(args[1])){
          z0 = this.point(args[0].coords,0);
          z1 = this.point(args[0].coords,1);
          fraction = args[1].scalar;
        } else if(args.length == 2 && this.is_arg_coords(args[0]) && this.is_arg_coords(args[1])){
          z0 = this.point(args[0].coords,0);
          z1 = this.point(args[1].coords,0);
          fraction = 0.5;
        } else if(args.length == 3 && this.is_arg_coords(args[0]) && this.is_arg_coords(args[1]) && this.is_arg_scalar(args[2])){
          z0 = this.point(args[0].coords, 0);
          z1 = this.point(args[1].coords, 0);
          fraction = args[2].scalar;
        }
        if (this.isvalidpt(z0) && this.isvalidpt(z1) && this.isvalidnum(fraction)) {
          let z0x = parseFloat(z0[0]);
          let z0y = parseFloat(z0[1]);
          let z1x = parseFloat(z1[0]);
          let z1y = parseFloat(z1[1]);
          if(this.isvalidnum(z0x,z0y,z1x,z1y)){
            let ptx = z0x + (z1x - z0x) * fraction;
            let pty = z0y + (z1y - z0y) * fraction;
            ret_val.push([ptx, pty, 'M']);///always returns a single point
          }
        }

        break;
      }
      case 'protrude': {
        ///&protrude{&A,&B,a}
        ///protrude from B in the direction of A-B for a distance of 'a'
        if(args.length == 3 && this.is_arg_coords(args[0]) && this.is_arg_coords(args[1]) && this.is_arg_scalar(args[2])){
          let z0 = this.point(args[0].coords, 0);
          let z1 = this.point(args[1].coords, 0);
          var a = args[2].scalar;
          let z0x = parseFloat(z0[0]);
          let z0y = parseFloat(z0[1]);
          let z1x = parseFloat(z1[0]);
          let z1y = parseFloat(z1[1]);
          if(this.isvalidnum(z0x,z0y,z1x,z1y)){
            let dist = this.calc_dist(z0x,z0y,z1x,z1y);
            let fraction = a/dist;
            if(Number.isFinite(fraction)){
              let ptx = z0x + (z1x - z0x) * (1+fraction);
              let pty = z0y + (z1y - z0y) * (1+fraction);
              ret_val.push([ptx, pty]);///always returns a single point
            }
          }
        }
        break;
      }
      case 'perpoint': {
        ///return a line with unit length of 1 that is perpendicular
        /// to a line that intersects at the first point of that line 
        if (args.length == 3 && 
        this.is_arg_coords(args[0]) && 
        this.is_arg_coords(args[1]) &&
        this.is_arg_scalar(args[2])) {
          let z0 = this.point(args[0].coords, 0);
          let z1 = this.point(args[1].coords, 0);
          let magni = args[2].scalar;
          if (this.isvalidpt(z0) && this.isvalidpt(z1) && this.isvalidnum(magni)) {
            let z0x = parseFloat(z0[0]);
            let z0y = parseFloat(z0[1]);
            let z1x = parseFloat(z1[0]);
            let z1y = parseFloat(z1[1]);
            if(this.isvalidnum(z0x,z0y,z1x,z1y)){
              let dy = z1y - z0y;
              let dx = z1x - z0x;
              let angle = Math.atan2(dy,dx);
              angle += this.deg_to_rad(90);
              let ptx = z0x + magni*Math.cos(angle);
              let pty = z0y + magni*Math.sin(angle);
              ret_val.push([ptx, pty, 'M']);///always return a single point
            }
          }
        } else if (args.length == 3 && 
        this.is_arg_coords(args[0]) &&
        this.is_arg_coords(args[1]) &&
        this.is_arg_coords(args[2])) {
          let z0 = this.point(args[0].coords, 0);
          let z1 = this.point(args[1].coords, 0);
          let z2 = this.point(args[2].coords, 0);
          let z0x = parseFloat(z0[0]);
          let z0y = parseFloat(z0[1]);
          let z1x = parseFloat(z1[0]);
          let z1y = parseFloat(z1[1]);
          let z2x = parseFloat(z2[0]);
          let z2y = parseFloat(z2[1]);
          if (this.isvalidnum(z0x, z0y, z1x, z1y, z2x, z2y)) {
            let vx = z1x - z0x;
            let vy = z1y - z0y;
            let x  = z2x - z0x;
            let y  = z2y - z0y;
            let factor = (vx*x + vy*y)/(vx*vx + vy*vy);
            let ptx = z0x + vx*factor;
            let pty = z0y + vy*factor;
            ret_val.push([ptx, pty, 'M']);///always return a single point
          }
        }

        break;
      }
      case 'scatterpoints': {

        if (args.length == 3 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_coords(args[1]) &&
        this.is_arg_scalar(args[2])) {
          let p0 = this.point(args[0].coords, 0);
          let p1 = this.point(args[1].coords, 0);
          let n = args[2].scalar;
          n = parseInt(n)||0;
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
            ret_val.push([px, py]);
          }
        }
        break;
      }

      case 'linelineintersect': {

        /// linelineintersect{(0,0),(10,0),(-1,5),(1,5)} line1 = (0,0) to (10,0), line2 from (-1,5) to (1,5)

        if (args.length == 4 && 
        this.is_arg_coords(args[0]) && 
        this.is_arg_coords(args[1]) &&
        this.is_arg_coords(args[2]) &&
        this.is_arg_coords(args[3])){
          let p0 = this.point(args[0].coords, 0);
          let p1 = this.point(args[1].coords, 0);
          let q0 = this.point(args[2].coords, 0);
          let q1 = this.point(args[3].coords, 0);
          let [x, y] = this.computeLineIntersection(p0, p1, q0, q1);
          if(Number.isFinite(x)&&Number.isFinite(y)){
            ret_val.push([x, y]);
          }
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

        if (args.length == 4 &&  
        this.is_arg_coords(args[0]) &&
        this.is_arg_coords(args[1]) &&
        this.is_arg_coords(args[2]) &&
        this.is_arg_scalar(args[3])){
          let p0     = this.point(args[0].coords,0);
          let p1     = this.point(args[1].coords,0);
          let c      = this.point(args[2].coords,0);
          let radius = args[3].scalar;
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
            return [[x1,y1]];
          }else if(x2 < x1){
            return [[x2, y2], [x1, y1]];///return a path of two points;
          }else{
            return [[x1, y1], [x2, y2]];///return a path of two points;
          }
          ///note one or both might be Infinity of NaN
        }
        break;
      }

      case 'circlecircleintersect': {
        ///&circlecircleintersect{&Center1,R1,&Center2,R2}
        if(args.length==4 &&
          this.is_arg_coords(args[0]) &&
          this.is_arg_scalar(args[1]) &&
          this.is_arg_coords(args[2]) &&
          this.is_arg_scalar(args[3])) {
          let a = args[0].coords;
          let R = args[1].scalar;
          let b = args[2].coords;
          let r = args[3].scalar;
          let pt1 = this.point(a,0);
          let pt2 = this.point(b,0);
          let [x1,y1] = pt1;
          let [x2,y2] = pt2;
          let dx = x2-x1;
          let dy = y2-y1;
          let delta = Math.sqrt(dx*dx + dy*dy);
          let x = (delta*delta - r*r + R*R)/(2*delta);
          let y = Math.sqrt(R * R - x * x);
          if(!Number.isFinite(y)){
            return [];
          }else{
            let y = Math.sqrt(R*R - x*x);
            let theta = Math.atan2(dy,dx);
            let THETA = Math.atan2(y,x);
            let X1 = R*Math.cos(theta+THETA);
            let Y1 = R*Math.sin(theta+THETA);
            let X2 = R*Math.cos(theta-THETA);
            let Y2 = R*Math.sin(theta-THETA);
            return [[x1+X1,y1+Y1],[x1+X2,y1+Y2]];
          }
        }
        break;
      }

      case 'circlecircleintersectclip': {
        ///returns a new path that is the intersection of two circles;
        ///IMPORTANT, the circle on the left-hand side should ALWAYS
        ///be specified first
        if(args.length==4 &&
          this.is_arg_coords(args[0]) &&
          this.is_arg_scalar(args[1]) &&
          this.is_arg_coords(args[2]) &&
          this.is_arg_scalar(args[3])) {
          let a = args[0].coords;
          let R = args[1].scalar;
          let b = args[2].coords;
          let r = args[3].scalar;
          let pt1 = this.point(a,0);
          let pt2 = this.point(b,0);
          let [x1,y1] = pt1;
          let [x2,y2] = pt2;
          let dx = x2-x1;
          let dy = y2-y1;
          let delta = Math.sqrt(dx*dx + dy*dy);
          let x = (delta*delta - r*r + R*R)/(2*delta);
          let y = Math.sqrt(R * R - x * x);
          if(Number.isFinite(y)){
            let y = Math.sqrt(R*R - x*x);
            let theta = Math.atan2(dy,dx);
            let THETA = Math.atan2(y,x);
            let X1 = R*Math.cos(theta+THETA);
            let Y1 = R*Math.sin(theta+THETA);
            let X2 = R*Math.cos(theta-THETA);
            let Y2 = R*Math.sin(theta-THETA);
            let top_pt = [x1+X1,y1+Y1];
            let bot_pt = [x1+X2,y1+Y2];
            if(1){
              ///remains of the left circle
              let xc = pt1[0];
              let yc = pt1[1];
              let x1 = top_pt[0];
              let y1 = top_pt[1];
              let x4 = bot_pt[0];
              let y4 = bot_pt[1];
              let [x2,y2,x3,y3] = this.arc_to_cubic_bezier(xc,yc,x1,y1,x4,y4);
              ret_val.push([x1,y1,'M']);
              ret_val.push([x4,y4,'C',x2,y2,x3,y3]);
            }
            if(1){
              ///remains of the right circle
              let xc = pt2[0];
              let yc = pt2[1];
              let x1 = bot_pt[0];
              let y1 = bot_pt[1];
              let x4 = top_pt[0];
              let y4 = top_pt[1];
              let [x2,y2,x3,y3] = this.arc_to_cubic_bezier(xc,yc,x1,y1,x4,y4);
              ret_val.push([x4,y4,'C',x2,y2,x3,y3]);
              ret_val.push([0,0,'cycle']);
            }
          }
        }
        break;
      }

      case 'circlecirclediffclip': {
        ///returns a new path with the remains of the first
        ///circle A after being taken away part of itself that
        ///overlaps with B
        ///IMPORTANT, the circle on the left-hand side should ALWAYS
        ///be specified first, the 5th argument controls which circle
        ///is being taken away: when set to '0' the remains of the
        ///left circle is returned, when set to '1' the remains of the right
        ///circle is returned 
        if(args.length==5 &&
          this.is_arg_coords(args[0]) &&
          this.is_arg_scalar(args[1]) &&
          this.is_arg_coords(args[2]) &&
          this.is_arg_scalar(args[3]) &&
          this.is_arg_scalar(args[4])) {
          let a = args[0].coords;
          let R = args[1].scalar;
          let b = args[2].coords;
          let r = args[3].scalar;
          let pt1 = this.point(a,0);
          let pt2 = this.point(b,0);
          let [x1,y1] = pt1;
          let [x2,y2] = pt2;
          let dx = x2-x1;
          let dy = y2-y1;
          let delta = Math.sqrt(dx*dx + dy*dy);
          let x = (delta*delta - r*r + R*R)/(2*delta);
          let y = Math.sqrt(R * R - x * x);
          if(Number.isFinite(y)){
            let y = Math.sqrt(R*R - x*x);
            let theta = Math.atan2(dy,dx);
            let THETA = Math.atan2(y,x);
            let X1 = R*Math.cos(theta+THETA);
            let Y1 = R*Math.sin(theta+THETA);
            let X2 = R*Math.cos(theta-THETA);
            let Y2 = R*Math.sin(theta-THETA);
            let top_pt = [x1+X1,y1+Y1];
            let bot_pt = [x1+X2,y1+Y2];
            let flag = args[4].scalar;
            if(flag==0){
              ///remains of the left circle
              let xc = pt2[0];
              let yc = pt2[1];
              let x1 = top_pt[0];
              let y1 = top_pt[1];
              let x4 = bot_pt[0];
              let y4 = bot_pt[1];
              ret_val.push([x1,y1]);
              ret_val.push([x4,y4,'A','','','','',R,R,0,1,0]);
              let [x2,y2,x3,y3] = this.arc_to_cubic_bezier(xc,yc,x4,y4,x1,y1);
              ret_val.push([x1,y1,'C',x2,y2,x3,y3])
              ret_val.push([0,0,'cycle']);
            }
            else {
              ///remains of the right circle
              let xc = pt1[0];
              let yc = pt1[1];
              let x1 = bot_pt[0];
              let y1 = bot_pt[1];
              let x4 = top_pt[0];
              let y4 = top_pt[1];
              ret_val.push([x1,y1]);
              ret_val.push([x4,y4,'A','','','','',R,R,0,1,0]);
              let [x2,y2,x3,y3] = this.arc_to_cubic_bezier(xc,yc,x4,y4,x1,y1);
              ret_val.push([x1,y1,'C',x2,y2,x3,y3])
              ret_val.push([0,0,'cycle']);
            }
          }
        }
        break;
      }

      case 'rectanglecircleholeclip': {
        ///returns a new path with the remains of the rectangle
        ///minus the circle, the circle is assumed to be completely
        /// inside the rectangle and not overlapping the rectangle
        /// in any way
        ///
        ///IMPORTANT, the rectangle must be specified first.
        /// rectanglecircleholeclip{&pt1,&pt2,center,r}
        if(args.length==4 &&
          this.is_arg_coords(args[0]) &&
          this.is_arg_coords(args[1]) &&
          this.is_arg_coords(args[2]) &&
          this.is_arg_scalar(args[3]) )
        {
          let a = this.point(args[0].coords,0);
          let b = this.point(args[1].coords,0);
          let c = this.point(args[2].coords,0);
          let r = args[3].scalar;

          ret_val.push([c[0],a[1],'M']);
          ret_val.push([c[0],c[1]-r,'L']);
          ret_val.push([c[0],c[1]+r,'A','','','','',r,r,0,0,1]);
          ret_val.push([c[0],b[1],'L']);
          ret_val.push([a[0],b[1],'L']);
          ret_val.push([a[0],a[1],'L']);
          ret_val.push([c[0],a[1],'L']);
          ret_val.push([c[0],c[1]-r,'L']);
          ret_val.push([c[0],c[1]+r,'A','','','','',r,r,0,0,0]);
          ret_val.push([c[0],b[1],'L']);
          ret_val.push([b[0],b[1],'L']);
          ret_val.push([b[0],a[1],'L']);
          ret_val.push([0,0,'recyle']);
        }
        break;
      }

      case 'circlepoints': {

        /// &circlepoints(center,r,a1,a2,a3...)
        /// 'center' is a path, r, a1, a2, a3 are scalars
        if(args.length > 2 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_scalar(args[1])) {
          let coords0 = args[0].coords;            
          let r       = args[1].scalar; 
          let z0      = this.point(coords0,0);
          if(this.isvalidpt(z0)&&Number.isFinite(r)){
            let [x0,y0] = z0;
            for(let j=2; j < args.length; ++j){
              let a0 = args[j].scalar;
              if(Number.isFinite(a0)){
                let x1 = x0 + r * Math.cos(Math.PI/180*a0);
                let y1 = y0 + r * Math.sin(Math.PI/180*a0);
                ret_val.push([x1,y1,'M']);
              }
            }
          }
        }
        break;
      }

      case 'pie': {
        ///&pie(center,radius,start_ang,span)
        ///'center' is a path, radius is a scalar
        if(args.length == 4 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_scalar(args[1]) &&
        this.is_arg_scalar(args[2]) &&
        this.is_arg_scalar(args[3])) {
          let z    = this.point(args[0].coords,0);
          let r    = args[1].scalar; 
          let a    = args[2].scalar; 
          let span = args[3].scalar; 
          let bigarcflag = (span > 180);
          let sweepflag = 0;
          let x1 = r*Math.cos(a/180*Math.PI);
          let y1 = r*Math.sin(a/180*Math.PI);
          let x2 = r*Math.cos((a+span)/180*Math.PI);
          let y2 = r*Math.sin((a+span)/180*Math.PI);
          ret_val.push([z[0]   ,z[1]   ,'M', '','','','', 0,0,0,0,0, z[12]]);
          ret_val.push([z[0]+x1,z[1]+y1,'L', '','','','', 0,0,0,0,0]);
          ret_val.push([z[0]+x2,z[1]+y2,'A', '','','','', r,r,0,bigarcflag,sweepflag]);
          ret_val.push([0,0,'cycle']);
        }
        break;
      }

      case 'circle': {
        ///&circle(center,radius)
        ///'center' is a path, radius is a scalar
        if(args.length == 2 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_scalar(args[1])) {
          let z = this.point(args[0].coords,0);
          let r = args[1].scalar; 
          ret_val.push([z[0]+r,z[1],'M', '','','','', 0,0,0,0,0, z[12]]);
          ret_val.push([z[0]-r,z[1],'A', '','','','', r,r,0,0,0]);
          ret_val.push([z[0]+r,z[1],'A', '','','','', r,r,0,0,0]);          
          ret_val.push([0,0,'cycle']);
        }
        break;
      }

      case 'ellipse': {
        ///&ellipse(center,xradius,yradius)
        ///'center' is a path, xradius and yradius are both scalars        
        let z0 = this.assert_arg_pt(args,0);
        let rx = this.assert_arg_scalar(args,1);
        let ry = this.assert_arg_scalar(args,2);
        let phi = this.assert_arg_scalar(args,3);
        let x1 = z0[0]+rx*Math.cos(Math.PI+phi/180*Math.PI);
        let y1 = z0[1]+rx*Math.sin(Math.PI+phi/180*Math.PI);
        let x2 = z0[0]+rx*Math.cos(phi/180*Math.PI);
        let y2 = z0[1]+rx*Math.sin(phi/180*Math.PI);
        ret_val.push([x1,y1,'M', '','','','', 0,0,0,0,0, z0[12]]);
        ret_val.push([x2,y2,'A','','','','',rx,ry,phi,1,0]);
        ret_val.push([x1,y1,'A','','','','',rx,ry,phi,1,0]);
        ret_val.push([0,0,'cycle']);
        break;
      }

      case 'parallelogram': {
        ///&parallelogram{(0,0),w,h,shear}
        let pt = this.assert_arg_pt(args,0);
        let [x,y] = pt;
        let w  = this.assert_arg_scalar(args,1);
        let h  = this.assert_arg_scalar(args,2);
        let shear = this.assert_arg_scalar(args,3);
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
          ret_val.push([0,0,'cycle']);
        }else{
          SX = Math.abs(SX);
          if (SX > w) {
            SX = w;
          }
          ret_val.push([x+SX,y,'M', '','','','', 0,0,0,0,0, pt[12]]);
          ret_val.push([x+w,y,'L']);
          ret_val.push([x+w-SX,y+h,'L']);
          ret_val.push([x,y+h,'L']);
          ret_val.push([0,0,'cycle']);
        }
        break;
      }

      case 'rhombus': {
        //NOTE:&rectangle{(x,y),w,h}
        let pt = this.assert_arg_pt(args,0);
        let [x,y] = pt;
        let w = this.assert_arg_scalar(args,1);
        let h = this.assert_arg_scalar(args,2);
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
        ret_val.push([0,0,'cycle']);
        break;
      }

      case 'rectangle': {
        //NOTE:&rectangle{(x,y),w,h}
        let pt = this.assert_arg_pt(args,0);
        let [x,y] = pt;
        let w = this.assert_arg_scalar(args,1);
        let h = this.assert_arg_scalar(args,2);
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
        ret_val.push([0,0,'cycle']);
        break;
      }

      case 'roundrectangle': {
        let pt = this.assert_arg_pt(args,0);
        let [x,y] = pt;
        let w = this.assert_arg_scalar(args,1);
        let h = this.assert_arg_scalar(args,2);
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
        ret_val.push([x+0,    y+0,    'cycle']);        
        break;
      }

      case 'triangle': {
        ///&rect(width,height)
        if(args.length == 3 &&
          this.is_arg_coords(args[0]) &&
          this.is_arg_coords(args[1]) &&
          this.is_arg_coords(args[2])) {
            let z0 = this.point(args[0].coords,0);
            let z1 = this.point(args[1].coords,0);
            let z2 = this.point(args[2].coords,0);
            ret_val.push([z0[0],z0[1],'M', '','','','', 0,0,0,0,0, z0[12]]);
            ret_val.push([z1[0],z1[1],'L']);
            ret_val.push([z2[0],z2[1],'L']);
            ret_val.push([0,0,'cycle']);
          }
        break;
      }

      case 'polyline': {
        ///&circle(center,radius)
        ///'center' is a path, radius is a scalar
        args.forEach((arg,i,arr) => {
          if(this.is_arg_coords(arg)){
            let z = this.point(arg.coords,0);
            if(i==0){
              ret_val.push([z[0],z[1],'M', '','','','', 0,0,0,0,0, z[12]]);
            }else{
              ret_val.push([z[0],z[1],'L']);
            }
          }
        })
        break;
      }

      case 'polygon': {
        ///&circle(center,radius)
        ///'center' is a path, radius is a scalar
        args.forEach((arg,i,arr) => {
          if(this.is_arg_coords(arg)){
            let z = this.point(arg.coords,0);
            if(i==0){
              ret_val.push([z[0],z[1],'M', '','','','', 0,0,0,0,0, z[12]]);
            }else{
              ret_val.push([z[0],z[1],'L']);
            }
            if(i+1==arr.length){
              ret_val.push([0,0,'cycle']);
            }
          }
        })
        break;
      }

      case 'arctravel': {
        ///&arctravel(&Center,&Start,span_a)
        /// 'Center' is the center, 'Start' is the starting point on the arc,
        /// The 'span_a' is the angle to travel starting from 'Start'
        if(args.length == 3 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_coords(args[1]) &&
        this.is_arg_scalar(args[2]) )
        {
          let c = this.point(args[0].coords,0);
          let p = this.point(args[1].coords,0);
          let Angle = args[2].scalar;
          let dy = p[1] - c[1];
          let dx = p[0] - c[0];
          let r = Math.sqrt(dx*dx + dy*dy);
          let ang0 = Math.atan2(dy,dx);
          let ang1 = ang0 + Angle / 180 * Math.PI;
          let qx = Math.cos(ang1)*r + c[0];
          let qy = Math.sin(ang1)*r + c[1];
          let px = p[0];
          let py = p[1];
          let bigarcflag = (Math.abs(Angle) > 180) ? 1 : 0;
          let sweepflag = (Angle < 0) ? 1 : 0;
          ret_val.push([px,py,'M', '','','','', 0,0,0,0,0, c[12]]);
          ret_val.push([qx,qy,'A', '','','','', r,r,0,bigarcflag,sweepflag])
        }
        break;
      }

      case 'arcspan': {
        ///&arcspan(&center,&pt1,&pt2)
        ///'center' is the center, the arc goes from pt1 to pt2
        /// anti-clockwise
        if(args.length == 3 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_coords(args[1]) &&
        this.is_arg_coords(args[2]) )
        {
          let c = this.point(args[0].coords,0);
          let p = this.point(args[1].coords,0);
          let q = this.point(args[2].coords,0);
          let dy = p[1] - c[1];
          let dx = p[0] - c[0];
          let r = Math.sqrt(dx*dx + dy*dy);
          let ang0 = Math.atan2(dy,dx) / Math.PI * 180; //(DEG)
          let dqy = q[1] - c[1];
          let dqx = q[0] - c[0];
          let ang1 = Math.atan2(dqy,dqx) / Math.PI * 180; //(DEG)
          let Angle = ang1 - ang0;///(DEG)
          if(Angle > 360){
            Angle -= 360;
          }else if(Angle < 0){
            Angle += 360;
          }
          let qx = Math.cos(ang1/180*Math.PI)*r + c[0];
          let qy = Math.sin(ang1/180*Math.PI)*r + c[1];
          let px = p[0];
          let py = p[1];
          let bigarcflag = (Angle > 180) ? 1 : 0;
          let sweepflag = 0;///anti-clockwise
          ret_val.push([px,py,'M', '','','','', 0,0,0,0,0, c[12]]);
          ret_val.push([qx,qy,'A', '','','','',r,r,0,bigarcflag,sweepflag])
        }
        break;
      }

      case 'arcsweep': {
        ///&arcspan(&center,r,start_a,sweep_a)
        ///'&center' is the center, the arc always goes from start angle 'start_a'
        /// and sweep over 'sweep_a' angle
        /// in an anti-clockwose rotatoin
        if(args.length == 4 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_scalar(args[1]) &&
        this.is_arg_scalar(args[2]) &&
        this.is_arg_scalar(args[3]) )
        {
          let c = this.point(args[0].coords,0);
          let r =       args[1].scalar;
          let start_a = args[2].scalar;
          let sweep_a = args[3].scalar;
          let px = Math.cos(start_a/180*Math.PI)*r + c[0];
          let py = Math.sin(start_a/180*Math.PI)*r + c[1];
          let qx = Math.cos((start_a+sweep_a)/180*Math.PI)*r + c[0];
          let qy = Math.sin((start_a+sweep_a)/180*Math.PI)*r + c[1];
          let bigarcflag = (sweep_a > 180) ? 1 : 0;
          let sweepflag = 0;///anti-clockwise
          ret_val.push([px,py,'M', '','','','', 0,0,0,0,0, c[12]]);
          ret_val.push([qx,qy,'A', '','','','',r,r,0,bigarcflag,sweepflag])
        }
        break;
      }

      case 'cylinder': {
        ///&cylinder(center,xradius,yradius,height)
        ///'center' is a path, xradius and yradius and height are scalars
        let z0 = this.assert_arg_pt(args,0);
        let rx = this.assert_arg_scalar(args,1);
        let ry = this.assert_arg_scalar(args,2);
        let ht = this.assert_arg_scalar(args,3);
        ret_val.push([z0[0]-rx,z0[1]+ht, 'M', '','','','', 0,0,0,0,0, z0[12]]);
        ret_val.push([z0[0]-rx,z0[1],'L']);
        ret_val.push([z0[0]+rx,z0[1],'A','','','','',rx,ry,0,0,0]);
        ret_val.push([z0[0]+rx,z0[1]+ht,'L']);
        ret_val.push([z0[0]-rx,z0[1]+ht,'A','','','','',rx,ry,0,0,1]);
        ret_val.push([0,0,'cycle']);
        ret_val.push([z0[0]-rx,z0[1]+ht,'M']);
        ret_val.push([z0[0]+rx,z0[1]+ht,'A','','','','',rx,ry,0,0,0]);
        ret_val.push([z0[0]-rx,z0[1]+ht,'A','','','','',rx,ry,0,0,0]);
        ret_val.push([0,0,'cycle']);
        break;
      }

      case 'fracwheel': {
        //NOTE:&fracwheel(&center,radius,numerator,denominator)
        let z = this.assert_arg_pt(args,0);
        let r = this.assert_arg_scalar(args,1);
        let num = this.assert_arg_scalar(args,2);
        let den = this.assert_arg_scalar(args,3);
        for(let i=0; i<den; ++i){
          let theta0 = i*Math.PI*2/den;
          let theta1 = (i+1)*Math.PI*2/den;
          let x0 = z[0] + Math.cos(theta0);
          let y0 = z[1] + Math.sin(theta0);
          let x1 = z[0] + Math.cos(theta1);
          let y1 = z[1] + Math.sin(theta1);
          ret_val.push([z[0],z[1],'M', '','','','', 0,0,0,0,0, z[12]]);
          ret_val.push([x0,y0,'L']);
          ret_val.push([x1,y1,'A','','','','',r,r,0,0,0]);
          ret_val.push([z[0],z[1],'L']);
          if(i<num){
            // some of the pies are closed but some others are not
            ret_val.push([0,0,'cycle']);
          }
        }
        break;
      }

      case 'equilateraltriangle': {
        ///&equilateraltriangle{&center,a}
        ///'a' is the length of the side 
        let z = this.assert_arg_pt(args,0);
        let a = this.assert_arg_scalar(args,1);
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
        ret_val.push([0,0,'cycle'])
        break;
      }

      case 'regularpentagon': {
        ///&regularpentagon{&center,r}
        ///'r' is the length of the side 
        let z = this.assert_arg_pt(args,0);
        let r = this.assert_arg_scalar(args,1);
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
        ret_val.push([0,0,'cycle'])
        break;
      }

      case 'asaTriangle': {
        ///&sssTriangle{&Left,B,a,C}
        ///'Left' is the position of the vertex B
        ///'a' is the length of the base (across angle A which is at the top)
        ///'B' is the angle of the vertex on the left-hand side
        ///'C' is the angle of the vertex on the right-hand side 
        let Left = this.assert_arg_pt(args,0);
        let B = this.assert_arg_scalar(args,1);
        let a = this.assert_arg_scalar(args,2);
        let C = this.assert_arg_scalar(args,3);
        let A = 180 - B - C;
        let ratio = a/Math.sin(A/180*Math.PI);
        let b = ratio * Math.sin(B/180*Math.PI);
        let ddx = b * Math.cos((180-C)/180*Math.PI);
        let ddy = b * Math.sin((180-C)/180*Math.PI);
        ret_val.push([Left[0],Left[1],  'M', '','','','', 0,0,0,0,0, Left[12]]);
        ret_val.push([Left[0]+a,Left[1],        'L'])
        ret_val.push([Left[0]+a+ddx,Left[1]+ddy,'L'])
        ret_val.push([0,0,'cycle'])
        break;
      }

      case 'ymirror': {
        let Z0 = this.assert_arg_coords(args,0);
        let X = this.assert_arg_scalar(args,1);
        let Z1 = this.ymirror_coords(Z0,X);
        for(let pt of Z1){
          ret_val.push(pt);
        }
        break;
      }

      case 'xmirror': {
        let Z0 = this.assert_arg_coords(args,0);
        let Y = this.assert_arg_scalar(args,1);
        let Z1 = this.xmirror_coords(Z0,Y);
        for(let pt of Z1){
          ret_val.push(pt);
        }
        break;
      }

      case 'mirror': {
        ///NOTE: &mirror{&pt,&end1,&end2}
        if(args.length==3){
          let z0 = this.assert_arg_pt(args,0);
          let st = this.assert_arg_pt(args,1);
          let pt = this.assert_arg_pt(args,2);
          let tx = z0[0];
          let ty = z0[1];
          let [dx, dy] = this.computeMirroredPointOffset(st, pt, tx, ty);
          tx += dx;
          ty += dy;
          if(Number.isFinite(tx)&&Number.isFinite(ty)){
            ret_val.push([tx,ty]);
          }
        }
        break;
      }

      case 'scale': {
        //NOTE: &scale{&path,s}
        //NOTE: &scale{&path,sx,sy}
        let Z = this.assert_arg_coords(args,0);
        let sx = this.assert_arg_scalar(args,1);
        let sy = this.assert_arg_scalar(args,2);
        if(args.length == 2){
          sy = sx; 
        }
        Z = this.dup_coords(Z);
        this.offset_coords(Z,0,0,sx,sy,0);
        for(let z of Z){
          ret_val.push(z);
        }
        break;
      }

      case 'rotate': {
        //NOTE: &rotate{&path,rotate}
        let Z = this.assert_arg_coords(args,0);
        let rotate = this.assert_arg_scalar(args,1);
        Z = this.dup_coords(Z);
        this.offset_coords(Z,0,0,1,1,rotate);
        for(let z of Z){
          ret_val.push(z);
        }
        break;
      }

      case 'translate': {
        //NOTE: &translate{&path,offsetX,offsetY}
        let Z = this.assert_arg_coords(args,0);
        let offsetX = this.assert_arg_scalar(args,1);
        let offsetY = this.assert_arg_scalar(args,2);
        Z = this.dup_coords(Z);
        this.offset_coords(Z,offsetX,offsetY,1,1,0);
        for(let z of Z){
          ret_val.push(z);
        }
        break;
      }

      case 'move': {
        //NOTE: &move{&path,&origin}
        let Z = this.assert_arg_coords(args,0);
        let pt = this.assert_arg_pt(args,1);
        let offsetX = pt[0];
        let offsetY = pt[1];
        Z = this.dup_coords(Z);
        this.offset_coords(Z,offsetX,offsetY,1,1,0);
        for(let z of Z){
          ret_val.push(z);
        }
        break;
      }

      case 'bisect': {
        //NOTE: bisecting an angle
        //bisect{&A,&B,&C,1}
        let z1 = this.assert_arg_pt(args,0);
        let z0 = this.assert_arg_pt(args,1);
        let z2 = this.assert_arg_pt(args,2);
        let r  = this.assert_arg_scalar(args,3);
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
        ret_val.push([labelx,labely]);
        break;
      }

      case 'grid': {
        ///&grid{(0,0),4,3}
        let pt = this.assert_arg_pt(args,0);
        let [x,y] = pt;
        let w = this.assert_arg_scalar(args,1);
        let h = this.assert_arg_scalar(args,2);
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

      default:
        break;

    }
    return ret_val;
  }

  iscyclept(pt) {
    if (Array.isArray(pt) && pt[2] == 'cycle') {
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
    if(this.origin_x !== 0 || this.origin_y !== 0 || this.origin_s !== 1 || this.origin_r !== 0){
      let p = this.dup_coords(coords);
      this.offset_coords(p,this.origin_x,this.origin_y,this.origin_s,this.origin_s,this.origin_r);
      return p;
    }else{
      return coords;
    }
  }
  move_xy(x,y){
    var pt = [x,y];
    this.offset_pt(pt,this.origin_x,this.origin_y,this.origin_s,this.origin_s,this.origin_r);
    return pt;
  }
  scale_dist(r){
    return r*this.origin_s;
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
      if (typeof pt[2] === 'string') {
        if( pt[2] == 'cycle'|| pt[2] == 'nan') {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  point(coords, i, is_cycle=0) {
    if (coords && Array.isArray(coords) && coords.length) {
      if(is_cycle){
        var n = coords.length-1;
        i = i % n;
        if(i < 0){
          i += n;
        }
      }    
      var pt = coords[i];
      if(pt){
        return pt;
      }else{
        return [0,0,'nan'];
      }
    } 
    return [0, 0, 'nan'];
  }

  __read_style_and_label(line) {
    var v;
    var txts = [];
    var style = {...this.config};
    const re_math = /^\{\{(.*)\}\}$/;
    while(line.length){
      if((v=this.re_coords_style.exec(line))!==null) {
        //parse style
        line = v[2];
        let s = v[1].trim();
        s = `{${s}}`;
        let g = this.string_to_style(s);
        style = {...style,...g};
      }else if((v=this.re_coords_label.exec(line))!==null) {
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
      }else{
        break;
      }
    }
    return [style,txts,line];
  }

  parse_pathparm(s){
    //NOTE: parm='(0,0),4,5'
    //NOTE: parm='&a,4,5'
    //NOTE: parm='&a_0,5,6'
    const s0 = s;
    const re_point = /^\((.*?)\)\s*(.*)$/;
    const re_path = /^&([A-Za-z]\w*)\s*(.*)$/;
    var v;
    var d = [];
    s = s.trimLeft();
    while(s.length){
      if((v=re_point.exec(s))!==null){
        let s1 = v[1];
        s = v[2];
        let [x,y] = this.read_absolute_point(s1);
        let coords = [];
        coords.push([x,y,'', '','','','', 0,0,0,0,0]);
        d.push({coords});
        if (s.charAt(0) == ',') {
          s = s.slice(1).trimLeft();
        }
      }else if((v=re_path.exec(s))!==null){
        let symbol = v[1];
        s = v[2];
        let coords = this.get_path_from_symbol(symbol);
        d.push({coords});
        if (s.charAt(0) == ',') {
          s = s.slice(1).trimLeft();
        }
      }else{
        let i = s.indexOf(',');
        if(i > 0){
          let a = s.slice(0,i);
          a = parseFloat(a);
          if(Number.isFinite(a)){
            let scalar = a;
            d.push({scalar});
          }
          s = s.slice(i+1);
          continue;
        }
        if(s.length){
          let a = s;
          a = parseFloat(a);
          if(Number.isFinite(a)){
            let scalar = a;
            d.push({scalar});
          }
        }
        break;
      }
    }
    return d;
  }

  parse_pathfunc(name,parm){
    //NOTE that when this function is called the line must conform to the form
    var args = this.parse_pathparm(parm);
    var ret_val = this.exec_path_func(name,args);
    return ret_val
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
    var lastjoin = 'move';///'hobby','move','line','cubic','quadrilatic','arc'
    var lasthint = 0;
    var lastoffset_x = 0;
    var lastoffset_y = 0;
    var lastoffset_sx = 1;
    var lastoffset_sy = 1;
    var lastabr = 0;
    var hobby_p = [];
    var txts = [];
    var g = {...this.config};
    const re_math = /^\{\{(.*)\}\}$/;
    while (line.length) {

      // {style}
      if ((v=this.re_coords_style.exec(line))!==null) {
        line = v[2];
        let s = v[1].trim();
        s = `{${s}}`;
        let g1 = this.string_to_style(s);
        g = {...g,...g1};
        continue;
      }
      
      // "text"
      // "{{math}}"
      if ((v=this.re_coords_label.exec(line))!==null) {
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
      
      // ^lastpt:A
      if ((v = this.re_coords_aux.exec(line))!==null) {
        //right:2, up:2, down:2, left:2, x:2, X:2, y:2, Y:2, s:2, sx:2, sy:2, at:&a, at:center, mark:a, hints:1
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
          case 'lastpt': {
            //lastpt:a
            let symbol = val;
            let p = this.get_path_from_symbol(symbol);
            let pt = this.point(p,0);
            if(this.isvalidpt(pt)){
              this.my_lastpt_x = pt[0];
              this.my_lastpt_y = pt[1];
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
          case 'mark': {
            // 'mark:a' - save the current lastpt to a path
            if(this.re_symbol_name.test(val)){
              let pt = [0,0];
              pt[0] = this.my_lastpt_x;
              pt[1] = this.my_lastpt_y;
              let p = [pt];
              this.my_path_map.set(val,p);
              this.do_comment(`*** ${val} = (${pt[0]},${pt[1]})`);
            }
          }
          case 'veer': {
            // 'veer:-30' - set it such that it will veer to the left 
            // 'veer:+40' - set it such that it will veer to the right 
            if(Number.isFinite(num)){
              lastabr = num;
            }
            break;
          }
          default: {
            if(Number.isFinite(num)){
              if(key=='up')          lastoffset_y    +=num;
              else if(key=='down')   lastoffset_y    -=num;
              else if(key=='left')   lastoffset_x    -=num;
              else if(key=='right')  lastoffset_x    +=num;
              else if(key=='x')      lastoffset_x    =num;
              else if(key=='y')      lastoffset_y    =num;
              else if(key=='X')      lastoffset_x    =this.viewport_width-num;
              else if(key=='Y')      lastoffset_y    =this.viewport_height-num;
              else if(key=='sx')     lastoffset_sx=num;
              else if(key=='sy')     lastoffset_sy=num;
              else if(key=='s')    { lastoffset_sx=num; lastoffset_sy=num; }
            }
            break;
          }
        }
        continue;
      }

      /// (cycle) 
      if((v=this.re_coords_cycle.exec(line))!==null){
        var pt = [0,0,'cycle'];
        coords.push(pt);
        line = v[1];
        lasthint = 0;
        dashdot = '';
        continue;
      }

      /// ()
      if((v=this.re_coords_nan.exec(line))!==null){
        line = v[1];
        lasthint = 0;
        dashdot = '';
        continue;
      }

      v1 = this.re_parse_pathfunc.exec(line);
      v2 = this.re_pathvar_single.exec(line);
      v3 = this.re_coords_point.exec(line);
      v4 = this.re_coords_flow.exec(line);
      if(v1 || v2 || v3 || v4){
        var from = [];
        if(v1){
          ///path function
          v = v1;
          var name = v[1];
          var parm = v[2];
          line = v[3];
          var pts = this.parse_pathfunc(name,parm);
          for (var pt of pts) {
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }
        }
        else if(v2){
          ///path variable
          v = v2;
          var symbol = v[1].trim();
          line = v[2];
          var pts = this.get_path_from_symbol(symbol);
          for (var pt of pts) {
            this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }
        }
        else if(v3){
          ///(0,0)
          v = v3;
          n++;
          let s = v[1];
          line = v[2];
          // let ss = s.trim().split(',').map(x => x.trim());
          // x = parseFloat(ss[0])||0;
          // y = parseFloat(ss[1])||0;
          s = `[${s}]`;
          let [numbers] = this.read_complex_numbers(s,env);
          let floats = this.numbers_to_floats(numbers);
          x = floats[0]||0;
          y = floats[1]||0;
          var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
          this.offset_pt(pt,lastoffset_x,lastoffset_y,lastoffset_sx,lastoffset_sy);
          if(lasthint){
            pt[12]=lasthint;
            lasthint = 0;
          }
          from.push(pt);
        }
        else if(v4){
          ///<node.1:s,5,-3>
          ///<box.a:nw,10,10> 
          v = v4;
          n++
          let flow = v[1];
          line = v[2];
          var [s,dx,dy] = flow.split(',').map(s=>s.trim());
          var [article,id,anchor] = this.string_to_article_id_anchor(s);
          if(article=='box' && this.my_box_map.has(id)){
            var p = this.my_box_map.get(id); 
            var [x,y] = this.to_box_anchor_point(p,anchor);
            dx = parseFloat(dx)||0;
            dy = parseFloat(dy)||0;
            x += dx;
            y += dy;
            var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }else if(article=='node' && this.my_node_map.has(id)){
            var p = this.my_node_map.get(id); 
            var [x,y] = this.to_node_anchor_point(p,anchor);
            dx = parseFloat(dx)||0;
            dy = parseFloat(dy)||0;
            x += dx;
            y += dy;
            var pt = [x,y,'M', '','','','', 0,0,0,0,0, 0];
            if(lasthint){
              pt[12]=lasthint;
              lasthint = 0;
            }
            from.push(pt);
          }
        }
        ///add in the offset; ***NOTE that offset should only
        ///be added for real coords, and not the relatives.
        if (dashdot === '..') {
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
            this.my_lastpt_x = x;
            this.my_lastpt_y = y;  
          } 

        } else if (dashdot === '~') {
          ///turn it off
          if(hobby_p.length){
            hobby_p = [];
          }
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            if(lastabr){
              let [pt0,pt1,pt2] = this.abr_to_qbezier(lastabr, this.my_lastpt_x,this.my_lastpt_y,0, x,y,0);  
              pt[2] = 'Q';
              pt[3] = pt1[0];
              pt[4] = pt1[1];
              pt[5] = '';
              pt[6] = '';
              coords.push(pt);
            }else{
              pt[2] = 'L';
              pt[3] = '';
              pt[4] = '';
              pt[5] = '';
              pt[6] = '';
              coords.push(pt);
            }
            this.my_lastpt_x = x;
            this.my_lastpt_y = y;  
          }
     
        } else {
          ///turn it off
          if(hobby_p.length){
            hobby_p = [];
          }
          for (var pt of from){
            x = pt[0];
            y = pt[1];
            ///just copy the points w/o modification, the get_path_from_symbol() funciton needs to set the 'join' member to 'M' for a single point
            coords.push(pt);
            this.my_lastpt_x = x;
            this.my_lastpt_y = y;
          }
        }

        dashdot = '';
        continue;
      }

      if ((v = this.re_coords_relative.exec(line)) !== null) {
        n++;
        dashdot = '';
        /// [angledist:angle,dist]
        /// [clock:angle,dist]
        /// [turn:angle,dist]
        /// [flip:dx,dy] /// flip the point to the other side of the line of the last two points
        /// [sweep:cx,cy,angle] /// draws a arc that sweeps around a fixed point for a given number of degrees
        /// [protrude:dist] /// draws a line from the current in the direction of last two points
        /// [l:dx,dy] /// line
        /// [h:dx] /// line
        /// [v:dy] /// line
        /// [c:dx1,dy1,dx2,dy2,dx,dy]
        /// [s:dx2,dy2,dx,dy]
        /// [a:rx,ry,angle,bigarcflag,sweepflag,dx,dy]
        /// [q:dx1,dy1,dx,dy]
        /// [t:dx,dy]
        /// [dot:r] /// will have a 'cycle' at the end
        /// [m:dx,dy] ///move the point, will terminate the current one
        /// [alter:dx,dy] ///alter the last point, without changing the lastpt    
        var fun_name = v[1].trim();
        line = v[2];
        fun_name = fun_name.split(':');
        fun_name = fun_name.map(x => x.trim());
        if (fun_name.length) {
          var key = fun_name[0];
          var val = fun_name[1]||'';
          if (key === 'angledist') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 2) {
              let angle_deg = parseFloat(val[0]);
              let dist = parseFloat(val[1]);
              ///
              dx = dist * Math.cos(angle_deg / 180 * Math.PI);
              dy = dist * Math.sin(angle_deg / 180 * Math.PI);
              if (!Number.isFinite(dx)) { dx = 0; }
              if (!Number.isFinite(dy)) { dy = 0; }
              x = this.my_lastpt_x + dx;
              y = this.my_lastpt_y + dy;
              lastjoin = 'line';
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
              coords.push(pt);
              this.my_lastpt_x = x;
              this.my_lastpt_y = y;
            }else if(val.length == 4){
              dx = this.assert_float(val[2]);
              dy = this.assert_float(val[3]);
              var last_angle_deg = Math.atan2(dy,dx)/Math.PI*180;//anti-clockwise
              let angle_deg = this.assert_float(val[0]);
              angle_deg = last_angle_deg + angle_deg;
              var dist = this.assert_float(val[1]);
              ///
              dx = dist * Math.cos(angle_deg / 180 * Math.PI);
              dy = dist * Math.sin(angle_deg / 180 * Math.PI);
              if (!Number.isFinite(dx)) { dx = 0; }
              if (!Number.isFinite(dy)) { dy = 0; }
              x = this.my_lastpt_x + dx;
              y = this.my_lastpt_y + dy;
              lastjoin = 'line';
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
              coords.push(pt);
              this.my_lastpt_x = x;
              this.my_lastpt_y = y;
            }
          }
          else if (key === 'clock') {
            // [clock:30,1]
            // [clock:30,1,x1,y1]
            // [clock:30,1,x1,y1,x2,y2]
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 2 || val.length == 4 || val.length == 6) {
              if(val.length == 2){
                var last_angle_deg = 0
                var angle_deg = this.assert_float(val[0]);
                var angle_deg = last_angle_deg + angle_deg;
                var dist = this.assert_float(val[1]);
              }else if(val.length == 4){
                var dx = this.assert_float(val[2]);
                var dy = this.assert_float(val[3]);
                var last_angle_deg = Math.atan2(dx,dy)/Math.PI*180;//clock-coords
                var angle_deg = this.assert_float(val[0]);
                var angle_deg = last_angle_deg + angle_deg;
                var dist = this.assert_float(val[1]);
              }else if(val.length == 6){
                var dx = this.assert_float(val[2]) - this.assert_float(val[4]);
                var dy = this.assert_float(val[3]) - this.assert_float(val[5]);
                var last_angle_deg = Math.atan2(dx,dy)/Math.PI*180;//clock-coords
                var angle_deg = this.assert_float(val[0]);
                var angle_deg = last_angle_deg + angle_deg;
                var dist =  this.assert_float(val[1]);
              }
              dx = dist * Math.sin(angle_deg / 180 * Math.PI);
              dy = dist * Math.cos(angle_deg / 180 * Math.PI);
              if (!Number.isFinite(dx)) { dx = 0; }
              if (!Number.isFinite(dy)) { dy = 0; }
              x = this.my_lastpt_x + dx;
              y = this.my_lastpt_y + dy;
              lastjoin = 'line';
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
              coords.push(pt);
              this.my_lastpt_x = x;
              this.my_lastpt_y = y;
            }
          }
          else if (key === 'turn') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 2) {
              var angle = parseFloat(val[0]);
              var lastangle = this.computeLastAngleDegree(coords);
              angle += lastangle;
              var dist = parseFloat(val[1]);
              dx = dist * Math.cos(angle / 180 * Math.PI);
              dy = dist * Math.sin(angle / 180 * Math.PI);
              if (!Number.isFinite(dx)) { dx = 0; }
              if (!Number.isFinite(dy)) { dy = 0; }
              x = this.my_lastpt_x + dx;
              y = this.my_lastpt_y + dy;
              lastjoin = 'line';
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
              coords.push(pt);
              this.my_lastpt_x = x;
              this.my_lastpt_y = y;
            }
          }
          else if (key === 'flip') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 2) {
              var tx = parseFloat(val[0]);
              var ty = parseFloat(val[1]);
              if (coords.length > 1 && Number.isFinite(tx) && Number.isFinite(ty)) {
                var n = coords.length;
                var st = coords[n - 2];
                var pt = coords[n - 1];
                [dx, dy] = this.computeMirroredPointOffset(st, pt, tx, ty);
                if (Number.isFinite(dx) && Number.isFinite(dy)) {
                  x = tx + dx;
                  y = ty + dy;
                  lastjoin = 'line';
                  let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
                  coords.push(pt);
                  this.my_lastpt_x = x;
                  this.my_lastpt_y = y;
                }
              }
            }
          }
          else if (key === 'sweep') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 3) {
              var cx = parseFloat(val[0]);
              var cy = parseFloat(val[1]);
              var angle = parseFloat(val[2]);
              if (Number.isFinite(cx) && Number.isFinite(cy) && Number.isFinite(angle)) {
                cx = this.my_lastpt_x + cx;
                cy = this.my_lastpt_y + cy;
                dx = this.my_lastpt_x - cx;
                dy = this.my_lastpt_y - cy;
                var r = Math.sqrt(dx*dx + dy*dy);
                var angle0 = Math.atan2(dy,dx);
                var angle1 = angle0 + angle/180*Math.PI;
                x = cx + r*Math.cos(angle1);
                y = cy + r*Math.sin(angle1);
                let Phi = 0;
                let bigarcflag = angle>180;
                let sweepflag = 0;
                lastjoin = 'arc';
                let pt = [x, y, 'A', '','','','', r,r,Phi,bigarcflag,sweepflag, lasthint];
                coords.push(pt);
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 'protrude') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 1) {
              var dist = parseFloat(val[0]);
              if (Number.isFinite(dist) && coords.length>1) {
                var n = coords.length;
                var x1 = coords[n-2][0];
                var y1 = coords[n-2][1];
                var x2 = coords[n-1][0];
                var y2 = coords[n-1][1];
                var angle = Math.atan2(y2-y1, x2-x1);
                x = x2 + dist*Math.cos(angle);
                y = y2 + dist*Math.sin(angle);
                let pt = [x, y, 'L', '','','','', 0,0,0,0,0, lasthint];
                coords.push(pt);
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 'l') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 2) {
              dx = parseFloat(val[0]);
              dy = parseFloat(val[1]);
              if (Number.isFinite(dy) && Number.isFinite(dx)) {
                x = this.my_lastpt_x + dx;
                y = this.my_lastpt_y + dy;
                lastjoin = 'line';
                if(lastabr){
                  let [pt0,pt1,pt2] = this.abr_to_qbezier(lastabr, this.my_lastpt_x,this.my_lastpt_y,0, x,y,0);  
                  let pt = [x,y,'Q', pt1[0],pt1[1],'','', 0,0,0,0,0, lasthint];
                  coords.push(pt);
                }else{
                  let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
                  coords.push(pt);
                }
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 'h') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 1) {
              dx = parseFloat(val[0]);
              dy = 0;
              if (Number.isFinite(dy) && Number.isFinite(dx)) {
                x = this.my_lastpt_x + dx;
                y = this.my_lastpt_y + dy;
                lastjoin = 'line';
                if(lastabr){
                  let [pt0,pt1,pt2] = this.abr_to_qbezier(lastabr, this.my_lastpt_x,this.my_lastpt_y,0, x,y,0);  
                  let pt = [x,y,'Q', pt1[0],pt1[1],'','', 0,0,0,0,0, lasthint];
                  coords.push(pt);
                }else{
                  let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
                  coords.push(pt);
                }
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 'v') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 1) {
              dy = parseFloat(val[0]);
              dx = 0;
              if (Number.isFinite(dy) && Number.isFinite(dx)) {
                x = this.my_lastpt_x + dx;
                y = this.my_lastpt_y + dy;
                lastjoin = 'line';
                if(lastabr){
                  let [pt0,pt1,pt2] = this.abr_to_qbezier(lastabr, this.my_lastpt_x,this.my_lastpt_y,0, x,y,0);  
                  let pt = [x,y,'Q', pt1[0],pt1[1],'','', 0,0,0,0,0, lasthint];
                  coords.push(pt);
                }else{
                  let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
                  coords.push(pt);
                }
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 'c') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 6) {
              x1 = this.my_lastpt_x + parseFloat(val[0]);
              y1 = this.my_lastpt_y + parseFloat(val[1]);
              x2 = this.my_lastpt_x + parseFloat(val[2]);
              y2 = this.my_lastpt_y + parseFloat(val[3]);
              x = this.my_lastpt_x + parseFloat(val[4]);
              y = this.my_lastpt_y + parseFloat(val[5]);
              if (Number.isFinite(x1) &&
                Number.isFinite(y1) &&
                Number.isFinite(x2) &&
                Number.isFinite(y2) &&
                Number.isFinite(x) &&
                Number.isFinite(y)) {
                lastjoin = 'cubic';
                let pt = [x, y, 'C', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
                coords.push(pt);
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 's') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 4) {
              if (lastjoin === 'quadrilatic') {
                [x1,y1] = this.MIRROR([x1,y1],[this.my_lastpt_x,this.my_lastpt_y]);
              } else if (lastjoin === 'cubic') {
                [x1,y1] = this.MIRROR([x2,y2],[this.my_lastpt_x,this.my_lastpt_y]);
              } else {
                x1 = this.my_lastpt_x;
                y1 = this.my_lastpt_y;
              }
              x2 = this.my_lastpt_x + parseFloat(val[0]);
              y2 = this.my_lastpt_y + parseFloat(val[1]);
              x = this.my_lastpt_x + parseFloat(val[2]);
              y = this.my_lastpt_y + parseFloat(val[3]);
              if (Number.isFinite(x1) &&
                Number.isFinite(y1) &&
                Number.isFinite(x2) &&
                Number.isFinite(y2) &&
                Number.isFinite(x) &&
                Number.isFinite(y)) {
                lastjoin = 'cubic';
                let pt = [x, y, 'C', x1, y1, x2, y2, 0,0,0,0,0, lasthint];
                coords.push(pt);
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 'a') {
          /// [a:rx,ry,angle,bigarcflag,sweepflag,dx,dy]
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 7) {
              let X1 = this.my_lastpt_x;
              let Y1 = this.my_lastpt_y;
              let X2 = this.my_lastpt_x + parseFloat(val[5]);
              let Y2 = this.my_lastpt_y + parseFloat(val[6]);
              let Rx = parseFloat(val[0]);
              let Ry = parseFloat(val[1]);
              let Phi = parseFloat(val[2]);
              let bigarcflag = parseInt(val[3]);
              let sweepflag = parseInt(val[4]);
              if (Number.isFinite(X1) && Number.isFinite(Y1) && Number.isFinite(X2) && Number.isFinite(Y2) && Number.isFinite(Rx) && Number.isFinite(Ry) && Number.isFinite(Phi) && Number.isFinite(bigarcflag) && Number.isFinite(sweepflag)) {
                lastjoin = 'arc';
                let pt = [X2, Y2, 'A', '','','','', Rx,Ry,Phi,bigarcflag,sweepflag, lasthint];
                coords.push(pt);
                this.my_lastpt_x = X2;
                this.my_lastpt_y = Y2;
              }
            }
          }
          else if (key === 'q') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 4) {
              x1 = this.my_lastpt_x + parseFloat(val[0]);
              y1 = this.my_lastpt_y + parseFloat(val[1]);
              x = this.my_lastpt_x + parseFloat(val[2]);
              y = this.my_lastpt_y + parseFloat(val[3]);
              if (Number.isFinite(x1) &&
                Number.isFinite(y1) &&
                Number.isFinite(x) &&
                Number.isFinite(y)) {
                ///NOTE: need to convert to cubic
                //let [C0,C1,C2,C3] = this.quadrilaticToCubic(lastpt,[x1,y1],[x,y]);
                lastjoin = 'quadrilatic';
                let pt = [x, y, 'Q', x1,y1,'','', 0,0,0,0,0, lasthint];
                coords.push(pt);
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 't') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 2) {
              x = this.my_lastpt_x + parseFloat(val[0]);
              y = this.my_lastpt_y + parseFloat(val[1]);
              if (lastjoin === 'quadrilatic') {
                [x1,y1] = this.MIRROR([x1,y1],[this.my_lastpt_x,this.my_lastpt_y]);
              } else if (lastjoin === 'cubic') {
                [x1,y1] = this.MIRROR([x2,y2],[this.my_lastpt_x,this.my_lastpt_y]);
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
                lastjoin = 'quadrilatic';
                let pt = [x, y, 'Q', x1,y1,'','', 0,0,0,0,0, lasthint];
                coords.push(pt);
                this.my_lastpt_x = x;
                this.my_lastpt_y = y;
              }
            }
          }
          else if (key === 'dot') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            var r = parseFloat(val[0]);
            if (val.length == 1) {
              x = this.my_lastpt_x;
              y = this.my_lastpt_y;
              lastjoin = 'move';
              if(Number.isFinite(r)){
                coords.push([x+r,y,'M', '','','','', 0,0,0,0,0, lasthint]);
                coords.push([x-r,y,'A', '','','','', r,r,0,0,0, lasthint]);
                coords.push([x+r,y,'A', '','','','', r,r,0,0,0, lasthint]);          
                coords.push([0,0,'cycle']);
              }
              /// 'lastpt' is not changed
            }
          }
          else if (key === 'm') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            dx = parseFloat(val[0]);
            dy = parseFloat(val[1]);
            if(Number.isFinite(dx)&&Number.isFinite(dy)){
              //relatve to the lastpt
              x = this.my_lastpt_x + dx;
              y = this.my_lastpt_y + dy;
              lastjoin = 'move';
              if(coords.length && coords[coords.length-1][2]=='M'){
                coords[coords.length-1][0] = x;
                coords[coords.length-1][1] = y;
              }else{
                coords.push([x,y,'M', '','','','', 0,0,0,0,0, lasthint]);
              }
              this.my_lastpt_x = x;
              this.my_lastpt_y = y;
            }
          }
        }
        continue;
      }

      /// (1,1) .. (2,3)
      if ((v = this.re_coords_dashdot.exec(line)) !== null) {
        var fun_name = v[1].trim();
        line = v[2];
        if (fun_name === '..') {
          dashdot = '..';
          if (hobby_p.length === 0) {
            hobby_p.push([this.my_lastpt_x, this.my_lastpt_y]);
          }
        } else if(fun_name[0] === '~') {
          dashdot = '~';
        } 
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

  read_complex_numbers(line,env) {
    /// [5, 5, 0.5, 0.5, 3.14E-10, a, 1+2i, 2+1i] [1:3:10] [1:10] [1!10!20]
    var numbers = [];
    line = line.trimLeft();
    var v;
    var fns = [];
    var txts = [];
    var g = {...this.config};
    const re_math = /^\{\{(.*)\}\}$/;
    while(line.length) {

      // {style}
      if((v=this.re_coords_style.exec(line))!==null) {
        //parse style
        line = v[2];
        let s = v[1].trim();
        s = `{${s}}`;
        let g1 = this.string_to_style(s);
        g = {...g,...g1};
        continue;
      }
      
      // "text"
      if((v=this.re_coords_label.exec(line))!==null) {
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
        var expr = v[1];
        line = v[2];
        if((v=this.re_numbers_is_range_expr2.exec(expr))!==null){
          /// '1:10'
          let a1 = this.parse_complex(v[1]);//returns a 'Complex'
          let a2 = this.parse_complex(v[2]);//If empty it returns (0,0*I)
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
        if((v=this.re_numbers_is_range_expr3.exec(expr))!==null){
          /// '1:4:10'
          let a1 = this.parse_complex(v[1]);//returns a 'Complex'
          let a2 = this.parse_complex(v[2]);//If empty it returns (0,0*I)
          let a3 = this.parse_complex(v[3]);//If empty it returns (0,0*I)
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
        if((v=this.re_numbers_is_spread.exec(expr))!==null){
          /// '1!3!10'
          let a1 = this.parse_complex(v[1]);//returns a 'Complex'
          let a2 = this.parse_complex(v[2]);//If empty it returns (0,0*I)
          let a3 = this.parse_complex(v[3]);
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

      /// a
      if((v=this.re_numbers_is_var.exec(line))!==null){
        let symbol = v[1];
        line = v[2];
        if(env.hasOwnProperty(symbol)){
          let m = env[symbol];
          if(m && Array.isArray(m)){
            let all = m;
            this.copy_numbers(numbers,all,fns,env);
          }else if(m instanceof Complex){
            let all = [m];
            this.copy_numbers(numbers,all,fns,env);
          }else if(typeof m === 'number'){
            let a = Complex.create(m);
            let all = [a];
            this.copy_numbers(numbers,all,fns,env);
          }
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
      let precision = this.g_to_precision_int(this.config);
      let s0 = this.numbers_to_string(numbers,precision);
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

  computeMirroredPointOffset(st, pt, tx, ty) {
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
    var sx = st[0];
    var sy = st[1];
    var px = pt[0];
    var py = pt[1];
    px -= sx;
    py -= sy;
    tx -= sx;
    ty -= sy;
    ///console.log('computeMirroredPointOffset: adjusted: tx=',tx,' ty=',ty);
    var magni = Math.sqrt(px * px + py * py);
    px /= magni;///unit vector
    py /= magni;///unit vector
    ///console.log('computeMirroredPointOffset: unit: px=',px,' py=',py);
    var dotprod = px * tx + py * ty;
    ///console.log('computeMirroredPointOffset: dotprod=',dotprod);
    var nx = dotprod * px;
    var ny = dotprod * py;
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
    ///***NOTE: i.e: (1,2)..(2,3) ~ (cycle)
    /// pt[0]: [1,2]
    /// pt[1]: [2,3]
    /// pt[2]: [0,0,'cycle']
    var o = [];
    var iscycle = 0;
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
      else if (join == 'cycle') {
        iscycle = 1;
        o.push(`(cycle)`);
        break;
      }
      else if (join == 'nan') {
        o.push(`nan`);
      }
      else if (join == 'M') {
        o.push(`[M:${this.fix(x)},${this.fix(y)},${hints}]`);
      }
      else {
        o.push(`(${this.fix(x)},${this.fix(y)})`);
      }
    }
    return o.join(' ');
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

  numbers_to_string(numbers,precision) {
    var s = '';
    for (var i in numbers) {
      var a = numbers[i];
      s += ` ${a.toString(precision)}`;
    }
    return s.trim();
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
  replace_line_env_variables(line,env){
    /// replace env variable before everything else
    let flag = 0;
    let precision = this.g_to_precision_int(this.config);
    const re = /\$\{(.*?)\}/g;
    line = line.replace(re,(match,p1) => {
      //console.log('replace_line_env_variables','match=',match);
      flag = 1;
      if(env.hasOwnProperty(p1)){
        /// ${a}
        let m = env[p1];
        if(Array.isArray(m)){
          return this.numbers_to_string(m,precision);
        }else if(m instanceof Complex){
          return m.toString(precision);
        }else if(typeof m === 'string'){
          return m;
        }else if(typeof m === 'number'){
          return m.toFixed(precision);
        }else{
          return m.toString();
        }
      }else{    
        let expr = p1;
        let m = this.expr.extract_next_expr(expr,env);
        let [a] = m;
        if(a instanceof Complex){
          return a.toString(precision);
        }else{
          return a;
        }
      }
    });
    return [line,flag];
  }
  do_path_command(symbol,coords,env){
    ///check for destructuring "[a,b,c]"
    const re_destructuring = /^\[(.*)\]$/;
    var v;
    if(symbol === '@A'){
      var i = parseInt(env['@'])||0;
      symbol = String.fromCodePoint(0x41+i);
      if(this.re_symbol_name.test(symbol)){
        this.my_path_map.set(symbol, coords);
        this.do_comment(`*** path ${symbol} = ${this.coords_to_string(this.my_path_map.get(symbol))}`);
      }else{
        this.do_comment(`***ERROR '${symbol}' is not a valid symbol name`);
      }
      return;
    }
    if(symbol === '@a'){
      var i = parseInt(env['@'])||0;
      symbol = String.fromCodePoint(0x61+i);
      if(this.re_symbol_name.test(symbol)){
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
        }else if (this.re_symbol_name.test(seg)) {
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
      if(this.re_symbol_name.test(symbol)) {
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
      if (join=='cycle'||join=='nan') {
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
        var mypath = `((${x1},${y1}) ~ (${x2},${y1}) ~ (${x2},${y2}) ~ (${x1},${y2}) ~ (cycle)`;
        var p = [];
        p.push([x1,y1,'M']);
        p.push([x2,y1,'L']);
        p.push([x2,y2,'L']);
        p.push([x1,y2,'L']);
        p.push([0,0,'cycle']);
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
              o.push(this.p_rect(x,y,w,h,g));
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

  do_cartesian(subcmd,opts,g,txts,numbers,env) {
    let floats = this.numbers_to_floats(numbers);
    var shift = this.g_to_shift_float(g);
    var tx    = this.g_to_tx_float(g);
    var ty    = this.g_to_ty_float(g);
    var o = [];
    var id = 0;
    if (!this.my_cartesian[id]) {
      this.my_cartesian[id] = {};
      var A = this.my_cartesian[id];
      A.xorigin = 0;
      A.yorigin = 0;
      A.xgrid = 1;
      A.ygrid = 1;
    }
    var A = this.my_cartesian[id];
    var [opt] = opts;
    switch( subcmd ) {
      case 'setup'://CARTESIAN
        A.xorigin = this.assert_float(floats[0],A.xorigin);    
        A.yorigin = this.assert_float(floats[1],A.yorigin);    
        A.xgrid = this.assert_float(floats[2],A.xgrid);  
        A.ygrid = this.assert_float(floats[3],A.ygrid);  
        break;

      case 'grid'://CARTESIAN
        var x1 = this.assert_float(floats[0],0);
        var y1 = this.assert_float(floats[1],0);
        var x2 = this.assert_float(floats[2],0);
        var y2 = this.assert_float(floats[3],0);
        var inc_x = this.get_float_prop(g,'xstep',1);
        var inc_y = this.get_float_prop(g,'ystep',1);
        for(var j = 0; j < this.MAX_ARRAY; j++){
          var y = y1 + inc_y*j;
          if(y > y2) break;
          o.push(this.p_line(x1/A.xgrid+A.xorigin,y/A.ygrid+A.yorigin,x2/A.xgrid+A.xorigin,y/A.ygrid+A.yorigin,g));
        }
        for(var i = 0; i < this.MAX_ARRAY; i++){
          var x = x1 + inc_x*i;
          if(x > x2) break;
          o.push(this.p_line(x/A.xgrid+A.xorigin,y1/A.ygrid+A.yorigin,x/A.xgrid+A.xorigin,y2/A.ygrid+A.yorigin,g));
        }
        break;

      case 'xaxis'://CARTESIAN
        var x1 = this.assert_float(floats[0],0);
        var x2 = this.assert_float(floats[1],0);
        var arrowhead = this.g_to_arrowhead_int(g);
        x1 /= A.xgrid;
        x2 /= A.xgrid;
        x1 += A.xorigin;
        x2 += A.xorigin;
        var y1 = A.yorigin;
        var y2 = A.yorigin;
        var mypath = `(${x1},${y1}) ~ (${x2},${y2})`;
        var p = [];
        p.push([x1,y1]);
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
        break;

      case 'yaxis'://CARTESIAN
        var y1 = this.assert_float(floats[0],0);
        var y2 = this.assert_float(floats[1],0);
        var arrowhead = this.g_to_arrowhead_int(g);
        y1 /= A.ygrid;
        y2 /= A.ygrid;
        y1 += A.yorigin;
        y2 += A.yorigin;
        var x1 = A.xorigin;
        var x2 = A.xorigin;
        var mypath = `(${x1},${y1}) ~ (${x2},${y2})`;
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
        break;

      case 'xtick'://CARTESIAN
        for (var j=0; j < floats.length; ++j) {
          var num = this.assert_float(floats[j],0);
          var x = A.xorigin + num/A.xgrid;
          var y = A.yorigin;
          o.push(this.p_tvbar(x,y,g));
          o.push(this.p_text(x,y,`${num}`,'bot',g));
        }
        break;

      case 'ytick'://CARTESIAN
        for (var j=0; j < floats.length; ++j) {
          var num = this.assert_float(floats[j],0);
          var x = A.xorigin;
          var y = A.yorigin + num/A.ygrid;
          o.push(this.p_rhbar(x,y,g));
          o.push(this.p_text(x,y,`${num}`,'lft',g));
        }
        break;

      case 'yplot'://CARTESIAN
        var f = this.g_to_fn_string(g);
        if(this.g_to_plottype_string(g)=='line'){
          let mypts = [];
          let x0 = NaN;
          let y0 = NaN;
          for(var x of floats){
            var y = this.expr.exec_float_func(f,[x],env);
            x /= A.xgrid;
            y /= A.ygrid;
            x += A.xorigin;
            y += A.yorigin;
            if(Number.isFinite(x)&&Number.isFinite(y)&&Number.isFinite(x0)&&Number.isFinite(y0)){
              o.push(this.p_line(x0,y0,x,y,g))
            }
            x0 = x;
            y0 = y;
          }
        }else{
          for(var x of floats){
            var y = this.expr.exec_float_func(f,[x],env);
            x /= A.xgrid;
            y /= A.ygrid;
            x += A.xorigin;
            y += A.yorigin;
            if(Number.isFinite(x)&&Number.isFinite(y)){
              o.push(this.p_dot_circle(x,y,g));
            }
          }
        }
        break;

      case 'xplot'://CARTESIAN
        var f = this.g_to_fn_string(g);
        if(this.g_to_plottype_string(g)=='line'){
          let mypts = [];
          let x0 = NaN;
          let y0 = NaN;
          for(var y of floats){
            var x = this.expr.exec_float_func(f,[y],env);
            x /= A.xgrid;
            y /= A.ygrid;
            x += A.xorigin;
            y += A.yorigin;
            if(Number.isFinite(x)&&Number.isFinite(y)&&Number.isFinite(x0)&&Number.isFinite(y0)){
              o.push(this.p_line(x0,y0,x,y,g))
            }
            x0 = x;
            y0 = y;
          }
        }else{
          for(var y of floats){
            var x = this.expr.exec_float_func(f,[y],env);
            x /= A.xgrid;
            y /= A.ygrid;
            x += A.xorigin;
            y += A.yorigin;
            if (Number.isFinite(x) && Number.isFinite(y)) {
              o.push(this.p_dot_circle(x, y, g));
            }
          }
        }
        break;

      case 'dot'://CARTESIAN
        for( var j=0; j < floats.length; j+=2 ) {
          var x = floats[j];
          var y = floats[j+1];
          x /= A.xgrid;
          y /= A.ygrid;
          x += A.xorigin;
          y += A.yorigin;
          if(Number.isFinite(x)&&Number.isFinite(y)){
            o.push(this.p_dot_circle(x,y,g));
          }
        }
        break;

      case 'line'://CARTESIAN
        var coords = [];
        var is_bad = 0;
        for( var j=0; j < floats.length; j+=2 ) {
          var x = floats[j];
          var y = floats[j+1];
          x /= A.xgrid;
          y /= A.ygrid;
          x += A.xorigin;
          y += A.yorigin;
          if(j==0){
            coords.push([x,y,'M']);  
          }else{
            coords.push([x,y,'L']);
          }
          if(Number.isFinite(x)&&Number.isFinite(y)){
            //good
          }else{
            is_bad = 1;
          }
        }
        if(is_bad){
          //DONT EXPORT
        }else{
          o.push(this.p_stroke(coords,g));
        }
        break;

      case 'text'://CARTESIAN
        for( var i=0,j=0; i < floats.length; i+=2,j+=1 ) {
          var x = floats[i];
          var y = floats[i+1];
          x /= A.xgrid;
          y /= A.ygrid;
          x += A.xorigin;
          y += A.yorigin;
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

      default:
        break;
    }
    
    return o.join('\n');
  }

  do_lego(subcmd,opts,g,txts,numbers) {
    let floats = this.numbers_to_floats(numbers);
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
    var [opt] = opts;
    switch( subcmd ) {
      case 'origin'://LEGO
        // lego.setup 0 0 0.4 0.3
        A.origin_x = this.assert_float(floats[0],A.origin_x);
        A.origin_y = this.assert_float(floats[1],A.origin_y);
        break;

      case 'size'://LEGO
        // lego.size 4 4 4      
        A.max_x = this.assert_float(floats[0],0);
        A.max_y = this.assert_float(floats[1],0);
        A.max_z = this.assert_float(floats[2],0);
        break;

      case 'clear'://LEGO
        A.all.clear();
        break;

      case 'add'://LEGO
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
          for( var j=0; j < floats.length; j++ ) {
            var z = floats[j];
            if(z >= 1 && z <= A.max_z) {
              for(var y=1; y <= A.max_y; y++) {
                for(var x=1; x <= A.max_x; x++) {
                  var key = `${x}/${y}/${z}`;
                  A.all.add(key);
                }
              }
            }
          }
        }
        else if(opt=='xyz'){
          for( var j=0; j < floats.length; j+=3 ) {
            var x = floats[j];
            var y = floats[j+1];
            var z = floats[j+2];
            var key = `${x}/${y}/${z}`;
            A.all.add(key);
          }
        }
        break;

      case 'del'://LEGO
        if(opt=='xy'){
          for( var j=0; j < floats.length; j+=2 ) {
            var x = floats[j];
            var y = floats[j+1];
            for(var z=1; z <= A.max_z; x++){
              var key = `${x}/${y}/${z}`;
              if(A.all.has(key)){
                A.all.delete(key);
              }
            }
          }
        }
        else if(opt=='yz'){
          for( var j=0; j < floats.length; j+=2 ) {
            var y = floats[j];
            var z = floats[j+1];
            for(var x=1; x <= A.max_x; x++){
              var key = `${x}/${y}/${z}`;
              if(A.all.has(key)){
                A.all.delete(key);
              }
            }
          }
        }
        else if(opt=='zx'){
          for( var j=0; j < floats.length; j+=2 ) {
            var z = floats[j];
            var x = floats[j+1];
            for(var y=1; y <= A.max_y; y++){
              var key = `${x}/${y}/${z}`;
              if(A.all.has(key)){
                A.all.delete(key);
              }
            }
          }
        }
        else if(opt=='xyz'){
          for( var j=0; j < floats.length; j+=3 ) {
            var x = floats[j];
            var y = floats[j+1];
            var z = floats[j+2];
            var key = `${x}/${y}/${z}`;
            if(A.all.has(key)){
              A.all.delete(key);
            }
          }
        }
        break;

      case 'show2'://LEGO
        var wx = this.assert_float(floats[0],0.8 );
        var wy = this.assert_float(floats[1],0.45 );
        var wh = this.assert_float(floats[2],0.7 );
        var origin_x = A.origin_x;
        var origin_y = A.origin_y;
        var max_z = A.max_z;
        var max_y = A.max_y;
        var max_x = A.max_x;
        ///construct path for single cube
        A.q1 = [[0,wh],[0-wx,wh-wy,'L'],[0,wh-wy-wh,'L'],[0+wx,wh-wy,'L'],[0,0,'cycle']];//top
        A.q2 = [[0-wx,0-wy],[0-wx,wh-wy,'L'],[0,wh-wy-wy,'L'],[0,0-wy-wy,'L'],[0,0,'cycle']];//left
        A.q3 = [[0+wx,0-wy],[0+wx,wh-wy,'L'],[0,wh-wy-wy,'L'],[0,0-wy-wy,'L'],[0,0,'cycle']];//right
        ///export commands for each cube
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
        break;

      case 'show'://LEGO
        var wx = this.assert_float(floats[0],0.36);
        var wy = this.assert_float(floats[1],0.30);
        var ww = this.assert_float(floats[2],1.00);
        var wh = this.assert_float(floats[3],0.90);
        var origin_x = A.origin_x;
        var origin_y = A.origin_y;
        var max_z = A.max_z;
        var max_y = A.max_y;
        var max_x = A.max_x;
        ///construct path for each cube
        A.q1 = [[0,wh,'M'],[ww,wh,'L'],[ww-wx,wh-wy,'L'],[0-wx,wh-wy,'L'],[0,0,'cycle']];//top
        A.q2 = [[ww,wh,'M'],[ww,0,'L'],[ww-wx,0-wy,'L'],[ww-wx,wh-wy,'L'],[0,0,'cycle']];//side
        A.q3 = [[0-wx,0-wy,'M'],[0-wx,wh-wy,'L'],[ww-wx,wh-wy,'L'],[ww-wx,0-wy,'L'],[0,0,'cycle']];//front
        ///export commands for each cube
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
        break;

      default:
        break;
    }
    
    return o.join('\n');
  }


  do_argand(subcmd,opts,g,txts,numbers) {
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

      default:
      break;
    }
    
    return o.join('\n');
  }

  do_trump(subcmd,subsubcmd,opts,g,txts,numbers) {
    var floats = this.numbers_to_floats(numbers);
    var o = [];
    var id = 0;
    if (!this.my_trumps[id]) {
      this.my_trumps[id] = {};
      var A = this.my_trumps[id];
      A.w = 3;
      A.h = 4;
    }
    var A = this.my_trumps[id];
    var mypath;
    var mycolor;
    switch( subcmd ) {
      case 'setup': {
        //ARGAND 
        A.w = this.assert_float(floats[0],A.w);    
        A.h = this.assert_float(floats[1],A.h);    
        break;
      }
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
      for(let i=0; i < floats.length; i+=2){
        let x = floats[i];
        let y = floats[i+1];
        let d = subsubcmd;//'1', '2', '3', '4', ... '10', 'A', 'J', 'Q', 'K'
        o.push(this.to_trump_card(x,y,mypath,d,g,mycolor));
      }
    }
    return o.join('\n')
  }
  do_text(opts,g,txts,coords){
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
  do_cairo(opts,g,txts,coords){
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
  do_slopedtext(opts,g,txts,coords){
    var ta = opts[0]||'';
    var o = [];
    var mar = this.g_to_mar_float(g);
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
      if(math){
        o.push(this.p_slopedmath(x1_,y1_,x2_,y2_,label,ta,g));
      }else{
        o.push(this.p_slopedtext(x1_,y1_,x2_,y2_,label,ta,g));
      }
      if(mar){
        let ang = Math.atan2(y2-y1,x2-x1);
        let ang2 = ang + Math.PI/2;///90-deg
        if(ta=='bot'){
          ang2 += Math.PI;///180-deg
        }
        var xt = mar*Math.cos(ang) + x1;
        var yt = mar*Math.sin(ang) + y1;
        var R = this.g_to_fontsize_float(g)*this.PT_TO_MM/this.viewport_unit/2;
        var X1 = x1 + R*Math.cos(ang2);
        var Y1 = y1 + R*Math.sin(ang2);
        var Xt = xt + R*Math.cos(ang2);
        var Yt = yt + R*Math.sin(ang2);
        o.push(this.p_line(Xt,Yt,X1,Y1,{...g,arrowhead:1}));
      }
      if(mar){
        let ang = Math.atan2(y1-y2,x1-x2);
        let ang2 = ang - Math.PI/2;///90-deg
        if(ta=='bot'){
          ang2 += Math.PI;///180-deg
        }
        var xt = mar*Math.cos(ang) + x2;
        var yt = mar*Math.sin(ang) + y2;
        var R = this.g_to_fontsize_float(g)*this.PT_TO_MM/this.viewport_unit/2;
        var X2 = x2 + R*Math.cos(ang2);
        var Y2 = y2 + R*Math.sin(ang2);
        var Xt = xt + R*Math.cos(ang2);
        var Yt = yt + R*Math.sin(ang2);
        o.push(this.p_line(Xt,Yt,X2,Y2,{...g,arrowhead:1}));
      }
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
  do_drawlinesegarc(opts,g,txts,coords){
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
            o.push(this.p_pie(x0,y0,r,ang1,angledelta,g1));  
          }else{
            o.push(this.p_arc(x0,y0,r,ang1,angledelta,g));
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
  do_drawlinesegcong(opts,g,txts,coords){
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

  do_drawlineseglabel(opts,g,txts,coords){
    return this.draw_text_between_points(txts,g,coords);
  }
  do_node(opts,g,txts,coords){
    var all = [];
    var showid = this.g_to_showid_int(g);
    var shadow = this.g_to_shadow_int(g);
    var tx = this.g_to_tx_float(g);
    var ty = this.g_to_ty_float(g);
    var r = this.g_to_r_float(g);
    for (var j = 0; j < coords.length; j++) {
      var pt = this.point(coords,j);
      if(!this.isvalidpt(pt)) continue;
      var id = opts[j]||'';
      var x = pt[0];
      var y = pt[1];
      var p = {x,y,r};
      if(id){
        this.my_node_map.set(id,p);
      }
      all.push({id,x,y,r,shadow})
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
      let {x,y,r,id,shadow} = one;
      if(shadow){
        let g1 = this.update_g_hints(g,this.hint_shadow);
        let dd = 1/this.viewport_unit/2*shadow;
        let x1 = x+dd;
        let y1 = y-dd;
        all.push(this.p_circle(x1,y1,r,g1));
      }
      o.push(this.p_circle(x,y,r,g));
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
          let [p0,p1,p2] = this.abr_to_qbezier(abr, x1,y1,r1, x2,y2,r2);    
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
        q = this.to_q_HEXO(x,y,w,h,rdx);
      }else if(boxtype=='UTRI'){
        q = this.to_q_UTRI(x,y,w,h);
      }else if(boxtype=='DTRI'){
        q = this.to_q_DTRI(x,y,w,h);
      }else if(boxtype=='PARA'){
        q = this.to_q_PARA(x,y,w,h,rdx);
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
      }else{
        q = this.to_q_RECT(x,y,w,h,rdx,rdy);
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

  abr_to_qbezier(abr, x1,y1,r1, x2,y2,r2){
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
    return [p0,p1,p2];
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
    var s = this.get_string_prop(g,'fillcolor','');
    if(g.hints & this.hint_hallow && !s){
      // if set to hallow and the fillcolor is not set,
      // set it to 'none'
      s = 'none';
    }
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
  g_to_extent_float(g){
    g = this.update_style_with_group(g);
    return this.get_float_prop(g,'extent',10);
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
  g_to_precision_int(g){
    g = this.update_style_with_group(g);
    return this.get_int_prop(g,'precision',6);
  }
  ///
  ///
  ///
  name_to_path_string(str){
    switch(str){
      case 'apple': 
        var mypath = '(.5,.7)..(.25,.85)..(0,.4)..(.5,0)..(1.0,.5)..(.8,.9)..(.5,.7) ~ (.5,.7)..(.6,1.0)..(.3,1.1) ~ (.3,1.1)..(.4,1.0)..(.5,.7) ~ (cycle)';
        break;

      case 'basket': 
        var mypath = '(0.3,0) ~ (2.6,0)..(2.8,1)..(3,2) ~ (3,2)..(1.5,1.5)..(0,2) ~ (0,2)..(0.2,1)..(0.3,0) ~ (cycle)';
        break;

      case 'crate': 
        var mypath = '(4,2) ~ (0,2) ~ (0,0) ~ (4,0) ~ (4,2) ~ (0,2) ~ (1,3) ~ (5,3) ~ (4,2) ~ (4,0) ~ (5,1) ~ (5,3) ~ (4,2) ~ (cycle)';
        break;

      case 'tree':
        var mypath = '(0,0) ~ (-0.4,0) ~ (-0.2,0.8) ~ (-1,0.4) ~ (-0.35,1.1) ~ (-0.8,1.1) ~ (-0.2,1.5) ~ (-0.7,1.5) ~ (0,2) ~ (0.7,1.5) ~ (0.2,1.5) ~ (0.8,1.1) ~ (0.35,1.1) ~ (1,0.4) ~ (0.2,0.8) ~ (0.4,0) ~ (cycle)';
        break;

      case 'balloon':
        var mypath = '(0.0, 1)..(0.5, 1.5)..(0.2, 2)..(-0.3, 1.5)..(0, 1) ~ (cycle) (0, 1)..(-0.05, 0.66)..(0.15, 0.33)..(0, 0)';
        break;

      case 'house':
        var mypath = '&polygon{(-0.5,1),(1.25,3.5),(3,1),(-0.5,1)} &rectangle{(0,0),1,1} &rectangle{(1,0),1.5,1} &rectangle{(1.5,0),0.5,0.5}';
        break;

      case 'school':
        var mypath = '&rectangle{(0,0),7,3} &rectangle{(1,0),1,2} &rectangle{(3,0),1,2} &rectangle{(5,0),1,2} &polygon{(1,3),(1,5),(2,4.5),(1,4)} &polygon{(3,3),(3,5),(4,4.5),(3,4)} &polygon{(5,3),(5,5),(6,4.5),(5,4)}';
        break;

      case 'mouse':
        var mypath = '(2.5,0)~(0,0)..(2.1,1.7)..(3,2)..(4,1.5)..(4,0)..(3,-0.2)..(2.5,0)..(2.3,0.5)..(2.9,1) &circle{(1.1,0.6),0.15} (4,0)..(4.4,0)..(4,-0.5)..(2,-0.5)..(1.5,-0.4)..(1.0,-0.5) () (2.5,0) [l:-0.2,-0.2]';
        break;

      case 'cat':
        var mypath = `(-1.5,2.5)..(-2.2,0.8)..(-2,0)..(-0.5,-0.3)..(1,0)..(1.2,0.8)..(0.5,2.5)()\
             (0.5,2.5)~(0.8,3.2)~(0,2.8)~(0,2.8)..(-1,2.8)~(-1,2.8)~(-1.8,3.2)~(-1.5,2.5)()\
             (-0.5,1) [dot:0.15]()\
             (0.5,1) [dot:0.15]()\
             (-1,1.2)~(-0.5,1.5)()\
             (+1,1.2)~(+0.5,1.5)()\
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
        var mypath = '(0.4,0.4) [a:0.15,0.15,0,1,1,0,0.2] [a:0.15,0.15,0,1,1,0.2,0] [a:0.15,0.15,0,1,1,0,-0.2] [h:-0.07] [q:0,-0.3,0.07,-0.3] [h:-0.2] [q:0.07,0,0.07,0.3] (cycle)';
        break;

      case 'spade':
        var mypath = '(0.4,0.1) [q:0.07,0,0.07,0.2] [h:-0.07] [c:-0.3,-0.2,-0.30,+0.15,-0.10,+0.35] [s:0.20,0.20,0.20,0.20] [c:0,0,0.2,-0.2,0.2,-0.2] [c:0.2,-0.2,0.2,-0.55,-0.1,-0.35] [h:-0.07] [q:0,-0.2,0.07,-0.2] (cycle)';
        break;
      
      case 'heart':
        var mypath = '(0.5,0.1) [c:-0.50,0.20,-0.45,0.90,0,0.65] [c:0.40,0.25,0.50,-0.45,0,-0.65] (cycle)';
        break;

      case 'diamond':
        var mypath = '(0.5,0.1) [l:-0.35,0.375] [l:0.35,0.375] [l:0.35,-0.375] (cycle)';
        break;

      case 'pail':
        var mypath = '(0,4) [l:0.5,-4] [q:1.5,-0.5,3,0] [l:0.5,4] [q:-2,1,-4,0] (cycle) (0,4) [q:2,-1,4,0] () (-0.2,4) [q:2.2,4,4.4,0] () (0.2,4) [q:1.8,4,3.6,0] &ellipse{(0.1,3.8),0.4,0.3} &ellipse{(3.9,3.8),0.4,0.3}'; 
        break;
        
      case 'protractor':
        var mypaths = [];
        mypaths.push('(-3.5, 0) ~ (-0.1,0)..(0,0.1)..(0.1,0) ~ (3.5, 0)..(0, 3.5)..(-3.5, 0)(z) ');
        mypaths.push('(-2.5100, 0.8500) ~ (2.5100, 0.8500)..(0, 2.65)..(-2.5100, 0.8500)(z) ');
        mypaths.push('(3.4468,  0.6078) ~ (3.0529,  0.5383)()');
        mypaths.push('(3.2889,  1.1971) ~ (2.9130,  1.0603)()');
        mypaths.push('(3.0311,  1.7500) ~ (2.6847,  1.5500)()');
        mypaths.push('(2.6812,  2.2498) ~ (2.3747,  1.9926)()');
        mypaths.push('(2.2498,  2.6812) ~ (1.9926,  2.3747)()');
        mypaths.push('(1.7500,  3.0311) ~ (1.5500,  2.6847)()');
        mypaths.push('(1.1971,  3.2889) ~ (1.0603,  2.9130)()');
        mypaths.push('(0.6078,  3.4468) ~ (0.5383,  3.0529)()');
        mypaths.push('(0.0000,  3.5000) ~ (0.0000,  3.1000)()');
        mypaths.push('(-3.4468, 0.6078) ~ (-3.0529, 0.5383)()');
        mypaths.push('(-3.2889, 1.1971) ~ (-2.9130, 1.0603)()');
        mypaths.push('(-3.0311, 1.7500) ~ (-2.6847, 1.5500)()');
        mypaths.push('(-2.6812, 2.2498) ~ (-2.3747, 1.9926)()');
        mypaths.push('(-2.2498, 2.6812) ~ (-1.9926, 2.3747)()');
        mypaths.push('(-1.7500, 3.0311) ~ (-1.5500, 2.6847)()');
        mypaths.push('(-1.1971, 3.2889) ~ (-1.0603, 2.9130)()');
        mypaths.push('(-0.6078, 3.4468) ~ (-0.5383, 3.0529)()');
        mypaths.push('(0.0000,  0.1000) ~ (0.0000,  0.8500)()');
        var mypath = mypaths.join(' ');
        break;

      case 'updnprotractor':
        var mypaths = [];
        mypaths.push('(-3.5, 0) ~ (-0.1,0)..(0,-0.1)..(0.1,0) ~ (3.5, 0)..(0,-3.5)..(-3.5, 0)(z) ');
        mypaths.push('(-2.5100,-0.8500)  ~ (2.5100,-0.8500)..(0,-2.65)..(-2.5100,-0.8500)(z) ');
        mypaths.push('( 3.4468, -0.6078) ~ ( 3.0529, -0.5383)(z)');
        mypaths.push('( 3.2889, -1.1971) ~ ( 2.9130, -1.0603)(z)');
        mypaths.push('( 3.0311, -1.7500) ~ ( 2.6847, -1.5500)(z)');
        mypaths.push('( 2.6812, -2.2498) ~ ( 2.3747, -1.9926)(z)');
        mypaths.push('( 2.2498, -2.6812) ~ ( 1.9926, -2.3747)(z)');
        mypaths.push('( 1.7500, -3.0311) ~ ( 1.5500, -2.6847)(z)');
        mypaths.push('( 1.1971, -3.2889) ~ ( 1.0603, -2.9130)(z)');
        mypaths.push('( 0.6078, -3.4468) ~ ( 0.5383, -3.0529)(z)');
        mypaths.push('( 0.0000, -3.5000) ~ ( 0.0000, -3.1000)(z)');
        mypaths.push('(-3.4468, -0.6078) ~ (-3.0529, -0.5383)(z)');
        mypaths.push('(-3.2889, -1.1971) ~ (-2.9130, -1.0603)(z)');
        mypaths.push('(-3.0311, -1.7500) ~ (-2.6847, -1.5500)(z)');
        mypaths.push('(-2.6812, -2.2498) ~ (-2.3747, -1.9926)(z)');
        mypaths.push('(-2.2498, -2.6812) ~ (-1.9926, -2.3747)(z)');
        mypaths.push('(-1.7500, -3.0311) ~ (-1.5500, -2.6847)(z)');
        mypaths.push('(-1.1971, -3.2889) ~ (-1.0603, -2.9130)(z)');
        mypaths.push('(-0.6078, -3.4468) ~ (-0.5383, -3.0529)(z)');
        mypaths.push('( 0.0000, -0.1000) ~ ( 0.0000, -0.8500)(z)');
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
  string_to_command_opts(s){
    var opts = s.split('.');
    opts = opts.slice(1);
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
    if((v=this.re_colorfunction.exec(s))!==null){
      ///NOTE: convert 'hwb(30|30%|30%)' to 'hwb(30,30%,30%)'
      let key = v[1];
      let val = v[2];
      s = `${key}(${val.split('|').join(',')})`;
    }
    //s = this.w3color(s).toHexString();
    var b = this.w3color(s);
    if(hints & this.hint_darker){
      b.darker(15);
    }
    if(hints & this.hint_lighter){
      b.lighter(15);
    }
    s = b.toHexString();
    return s;
  }
  assert_arg_pt(args,i){
    if(this.is_arg_coords(args[i])){
      return this.point(args[i].coords,0);
    }else {
      return [0,0];
    }
  }
  assert_arg_coords(args,i){
    if(this.is_arg_coords(args[i])){
      return args[i].coords;
    }else {
      return [];///empty coords
    }
  }
  assert_arg_scalar(args,i){
    if(this.is_arg_scalar(args[i])){
      return args[i].scalar;
    }else {
      return 0;
    }
  }
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
        this.register_linesegs(q);
      }else if(operation=='arrow'){
        o.push(this.p_arrow(q,g));
      }else if(operation=='revarrow'){
        o.push(this.p_revarrow(q,g));
      }else if(operation=='dblarrow'){
        o.push(this.p_dblarrow(q,g));
      }else{
        o.push(this.p_draw(q,g));
        this.register_linesegs(q);
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
  to_box_anchor_point(p,anchor){
    ///'anchor' is one of the following string:
    //   "n", "w", "e", "w", "sw", "se", "nw", "ne"
    //  return [x,y]
    var {x,y,w,h,rdx,rdy,boxtype} = p;
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
  to_node_anchor_point(p,anchor){
    ///'anchor' is one of the following string:
    //   "n", "w", "e", "w", "sw", "se", "nw", "ne"
    //  return [x,y]
    var {x,y,r} = p;
    if(anchor=='n'){
      y = y + r;
    }
    else if(anchor=='s'){
      y = y - r;
    }
    else if(anchor=='w'){
      x = x - r;
    }
    else if(anchor=='e'){
      x = x + r;
    }
    else if(anchor=='sw'){
      x -= r;
      y -= r;
    }
    else if(anchor=='se'){
      x += r;
      y -= r;
    }
    else if(anchor=='nw'){
      x -= r;
      y += r;
    }
    else if(anchor=='ne'){
      x += r;
      y += r;
    }
    else if(anchor=='c1'){
      x += r*Math.cos(60/180*Math.PI);
      y += r*Math.sin(60/180*Math.PI);
    }
    else if(anchor=='c2'){
      x += r*Math.cos(30/180*Math.PI);
      y += r*Math.sin(30/180*Math.PI);
    }
    else if(anchor=='c3'){
      x += r*Math.cos(0/180*Math.PI);
      y += r*Math.sin(0/180*Math.PI);
    }
    else if(anchor=='c4'){
      x += r*Math.cos(-30/180*Math.PI);
      y += r*Math.sin(-30/180*Math.PI);
    }
    else if(anchor=='c5'){
      x += r*Math.cos(-60/180*Math.PI);
      y += r*Math.sin(-60/180*Math.PI);
    }
    else if(anchor=='c6'){
      x += r*Math.cos(-90/180*Math.PI);
      y += r*Math.sin(-90/180*Math.PI);
    }
    else if(anchor=='c7'){
      x += r*Math.cos(-120/180*Math.PI);
      y += r*Math.sin(-120/180*Math.PI);
    }
    else if(anchor=='c8'){
      x += r*Math.cos(-150/180*Math.PI);
      y += r*Math.sin(-150/180*Math.PI);
    }
    else if(anchor=='c9'){
      x += r*Math.cos(180/180*Math.PI);
      y += r*Math.sin(180/180*Math.PI);
    }
    else if(anchor=='c10'){
      x += r*Math.cos(150/180*Math.PI);
      y += r*Math.sin(150/180*Math.PI);
    }
    else if(anchor=='c11'){
      x += r*Math.cos(120/180*Math.PI);
      y += r*Math.sin(120/180*Math.PI);
    }
    else if(anchor=='c12'){
      x += r*Math.cos(90/180*Math.PI);
      y += r*Math.sin(90/180*Math.PI);
    }
    return [x,y];
  }
  draw_text_between_points(txts,g,coords){
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
  read_absolute_point(s){
    let ss = s.trim().split(',').map(x => x.trim());
    var x = parseFloat(ss[0]);
    var y = parseFloat(ss[1]);
    return [x,y];
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
          let q0 = [pt0[0],pt0[1]];
          let q1 = [pt1[0],pt1[1]];
          o.push({q0,q1});
        }
      }else if(join=='cycle'){
        let pt0 = coords[j-1];
        let pt1 = first_pt;
        if(pt0 && pt1){
          let q0 = [pt0[0],pt0[1]];
          let q1 = [pt1[0],pt1[1]];
          o.push({q0,q1});
        }
      }
    }
    return o;
  }
  register_linesegs(coords){
    ///add all line segments in coords to this.my_lineseg_array
    var first_pt = null;
    for(var j=0; j < coords.length; ++j){
      let pt = coords[j];
      let join = pt[2];
      if(join=='M'){
        first_pt = pt;
      }else if(join=='L'){
        let pt0 = coords[j-1];
        let pt1 = coords[j];
        if(pt0 && pt1){
          let q0 = [pt0[0],pt0[1]];
          let q1 = [pt1[0],pt1[1]];
          this.my_lineseg_array.push({q0,q1});
        }
      }else if(join=='cycle'){
        let pt0 = coords[j-1];
        let pt1 = first_pt;
        if(pt0 && pt1){
          let q0 = [pt0[0],pt0[1]];
          let q1 = [pt1[0],pt1[1]];
          this.my_lineseg_array.push({q0,q1});
        }
      }
    }
  }
  get_line_segs_path(pt,r,linesegs){
    var w = this.viewport_width;
    var h = this.viewport_height;
    var all = [];
    ///pt is an arbitrary point inside the region,
    ///lines is a list of bounding lines, each of which
    ///consists of 2 points: ql,q1
    ///r is the maximum radius of the region 
    ///with 'pt' as the center point
    for(var i=0; i < 360; i++){
      var ang_rad = i/180*Math.PI;
      var ang_deg = i;
      //construct p3 and p4
      var p0 = [0,0];
      var p1 = [0,0];
      p0[0] = pt[0];
      p0[1] = pt[1];
      p1[0] = p0[0] + r*Math.cos(ang_rad);
      p1[1] = p0[1] + r*Math.sin(ang_rad);
      var x0 = p0[0];
      var y0 = p0[1];
      ///find the lineseg with the shortest dist
      /// NOTE that for j_saved, -4=east wall, -3=north wall, -2=west wall, -1=south wall
      var dist_saved = r;
      var j_saved = -1;
      var x_saved = NaN;
      var y_saved = NaN;
      var theta_saved = NaN;
      for(var j=-4; j < linesegs.length; ++j){
        if(j==-4){
          ///east wall
          var q0 = [w,0];
          var q1 = [w,h];
        }else if(j==-3){
          //north wall
          var q0 = [w,h];
          var q1 = [0,h];
        }else if(j==-2){
          //west wall
          var q0 = [0,h];
          var q1 = [0,0];
        }else if(j==-1){
          //south wall
          var q0 = [0,0];
          var q1 = [w,0];
        }else{
          //j>=0
          var q0 = linesegs[j].q0; 
          var q1 = linesegs[j].q1; 
        }
        var [x, y] = this.computeLineIntersection(p0, p1, q0, q1);
        if(Number.isFinite(x)&&Number.isFinite(y)){
          var dist = Math.sqrt((x-x0)*(x-x0) + (y-y0)*(y-y0));
          var theta_deg = Math.atan2(y-y0,x-x0)/Math.PI*180;
          if(theta_deg < 0){
            ///for atan2 when the quadrant is the 3rd and 4th the return value is a negative angle
            theta_deg = 360 + theta_deg;
          }
        }else{
          var dist = r;   
        }
        if(Math.abs(theta_deg-ang_deg) < 45 && dist < dist_saved){
          dist_saved = dist;
          j_saved = j;
          x_saved = x;
          y_saved = y;
          theta_saved = theta_deg;
        }
      }
      ///add to the database
      let saved = [ang_deg,dist_saved,j_saved, x_saved,y_saved, theta_saved,ang_deg];
      all.push(saved);
      //console.log('saved=',this.fix(saved[0]),this.fix(saved[1]),this.fix(saved[2]),this.fix(saved[3]),this.fix(saved[4]));
    }
    ///now construct a path that represents this region
    var p = [];
    var dist_last = NaN;
    var j_last = NaN;
    var j_count = 0;
    var x_last = NaN;
    var y_last = NaN;
    for(var i=0; i < all.length; ++i){
      let pt = all[i];
      let [ang_deg,dist,j,x,y] = pt;
      if(i==0){
        dist_last = dist;
        j_last = j;
        j_count = 1;
        x_last = x;
        y_last = y;
        p.push([x,y,'M']);
      }else{
        if(j==j_last){
          ///still the same line segment, we just overwrite the last 'L' point
          let n = p.length;
          if(j_count > 1){
            p[n-1][0] = x;
            p[n-1][1] = y;
          }else{
            //this could be the second point
            p.push([x,y,'L']);  
          }
          j_count++;
        }else{
          ///jumped to a different line segment, we will make a new 'L' point
          p.push([x,y,'L']);
          j_count = 1;
        }
        j_last = j;
      }
    }
    p.push([0,0,'cycle']);
    return p;
  }
  do_fillspace(opts,g,txts,coords){
    var r = Math.max(this.viewport_width,this.viewport_height);
    var linesegs = this.my_lineseg_array;
    if(coords.length){
      var pt = this.point(coords,0);
      if(this.isvalidpt(pt)){
        var p = this.get_line_segs_path(pt,r,linesegs);
        //console.log('do_fillspace','p=',p);
        return this.p_fill(p,g);
      }
    }
    return '';
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
  do_format(fmt,args,env){
    const re_fgroup = /^%(\-?)(\+?)(\s?)(0?)([1-9]*)(\.?)([1-9]*)([A-Za-z%])(.*)$/;
    var v;
    var all = [];
    while(fmt.length){
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
          case 'o': {
            ///convert to a binary with numbers 0-7
            ///format "%o" 8 => '10'
            let arg = args[0];
            args = args.slice(1);
            let num = this.symbol_to_int(arg,env);
            if(typeof num === 'number' && Number.isFinite(num)){
              s = this.number_to_octal_string(num);
            }
            break;
          }
          case 'x': {
            ///convert to a hex string with 0-9 and a-f
            ///format "%x" 15 => 'f'
            let arg = args[0];
            args = args.slice(1);
            let num = this.symbol_to_int(arg,env);
            if(typeof num === 'number' && Number.isFinite(num)){
              s = this.number_to_hex_string(num);
            }
            break;
          }
          case 'X': {
            ///convert to a binary with 0-9 and A-F
            ///format "%b" 15 => 'F'
            let arg = args[0];
            args = args.slice(1);
            let num = this.symbol_to_int(arg,env);
            if(typeof num === 'number' && Number.isFinite(num)){
              s = this.number_to_hex_string(num);
              s = s.toUpperCase();                 
            }
            break;
          }
          case 'b': {
            ///convert to a binary with all 1's and 0's
            ///format "%b" 5 => '101'
            let arg = args[0];
            args = args.slice(1);
            let num = this.symbol_to_int(arg,env);
            if(typeof num === 'number' && Number.isFinite(num)){
              s = this.number_to_binary_string(num);                 
            }
            break;
          }
          case 'c': {
            ///convert a number to a Unicode character
            ///format "%c" 65 => 'A'
            let arg = args[0];
            args = args.slice(1);
            let num = this.symbol_to_int(arg,env);
            if(typeof num === 'number' && Number.isFinite(num)){
              s = String.fromCodePoint(num);
            }
            break;
          }
          case 's': {
            let arg = args[0];
            args = args.slice(1);
            s = this.symbol_to_string(arg,env);            
            break;
          }
          case 'f': {
            let arg = args[0];
            args = args.slice(1);
            let num = this.symbol_to_float(arg,env);
            if(typeof num === 'number'){
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
            let arg = args[0];
            args = args.slice(1);
            let num = this.symbol_to_int(arg,env);
            if(typeof num === 'number'){
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
        all.push(s);
      }else{
        //remove the next character
        let c = fmt.charAt(0);
        all.push(c);
        fmt = fmt.slice(1);
      }
    }
    return all.join('');
  }
  to_trump_card(x,y,mypath,d,g,mycolor){
    ///this size is always 5x6, unless scaled by 'scaleX', and/or 'scaleY'
    ///the fontsize is always '11pt', unless scaled by 'scaleX', and/or setting to a 
    /// this.viewport_unit other than 5mm
    ///'mycolor' is 'red' for diamond and heart, and 'black' for spade and club
    ///the card 
    let scaleX = this.g_to_scaleX_float(g);
    let scaleY = this.g_to_scaleY_float(g);
    let innersquare = '(0,0) [h:3] [v:4] [h:-3] (cycle)';
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
      all.push(this.p_rrect(x1,y1,5*scaleX,6*scaleY,0.4*scaleX,0.4*scaleY,g1));
      //all.push(this.p_circle(x1,y1,r,g1));
    }
    all.push(this.p_rrect(x,y,5*scaleX,6*scaleY,0.4*scaleX,0.4*scaleY,{...g,fillcolor:'white'}));
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
      let myjack = '(0.5,0.5) [a:0.4,0.4,0,0,1,1.8,0] (cycle) (0.5,0.5) [l:1.2,-0.5] [q:0.5,0,0.8,0.2] [l:-0.2,0.3] (cycle)';
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
      let myjack = '(0.75,0.25) [q:0.75,-0.5,1.5,0] [l:0.25,0.75] [l:-0.5,-0.4] [l:0,0.5] [l:-0.25,-0.5] [l:-0.25,0.75] [l:-0.25,-0.75] [l:-0.25,0.5] [l:0,-0.5] [l:-0.5,0.4] (cycle) &circle{(2.5,1),0.1} &circle{(2,1.05),0.1} &circle{(1.5,1.35),0.1} &circle{(1,1.05),0.1} &circle{(0.5,1),0.1}';
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
      let myjack = '(0.5,0) [h:2] [v:0.85] [l:-0.25,-0.25] [l:-0.25,0.35] [l:-0.25,-0.25] [l:-0.25,0.55] [l:-0.25,-0.55] [l:-0.25,0.25] [l:-0.25,-0.35] [l:-0.25,0.25] (cycle) &circle{(2.5,0.85),0.1} &circle{(2,1.00),0.1} &circle{(1.5,1.35),0.1} &circle{(1,1.0),0.1} &circle{(0.5,0.85),0.1}';
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
  to_q_RECT(x,y,w,h,Dx,Dy){
    var p = [];
    if(Dx==0 && Dy==0){
      p.push([x,y,'M']);
      p.push([x+w,y,'L']);
      p.push([x+w,y+h,'L']);
      p.push([x,y+h,'L']);
      p.push([0,0,'cycle']);
      return p;
    }
    p.push([x,y+Dy,'M']);    
    p.push([x+Dy,y,'Q',x,y]);
    p.push([x+w-Dx,y,'L']);
    p.push([x+w,y+Dy,'Q',x+w,y]);
    p.push([x+w,y+h-Dy,'L']);
    p.push([x+w-Dx,y+h,'Q',x+w,y+h]);
    p.push([x+Dx,y+h,'L']);
    p.push([x,y+h-Dy,'Q',x,y+h]);
    p.push([0,0,'cycle']);
    return p;
  }
  to_q_UTRI(x,y,w,h,Dx,Dy){
    var p = [];
    p.push([x,y,'M']);    
    p.push([x+w,y,'L']);
    p.push([x+w/2,y+h,'L']);
    p.push([0,0,'cycle']);
    return p;
  }
  to_q_DTRI(x,y,w,h,Dx,Dy){
    var p = [];
    p.push([x,y+h,'M']);    
    p.push([x+w,y+h,'L']);
    p.push([x+w/2,y,'L']);
    p.push([0,0,'cycle']);
    return p;
  }
  to_q_HEXO(x,y,w,h,gap){
    let hh = h*0.5;
    var p = [];
    p.push([x+gap,y,'M']);
    p.push([x+w-gap,y,'L']);
    p.push([x+w,y+hh,'L']);
    p.push([x+w-gap,y+h,'L']);
    p.push([x+gap,y+h,'L']);
    p.push([x,y+hh,'L']);
    p.push([0,0,'cycle']);
    return p;
  }
  to_q_PARA(x,y,w,h,gap){
    var p = [];
    p.push([x,y,'M']);
    p.push([x+w-gap,y,'L']);
    p.push([x+w,y+h,'L']);
    p.push([x+gap,y+h,'L']);
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
      p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
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
    p.push([0,0,'cycle']);
    return p;
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
      switch(s){
        case 'linedashed': return this.hint_linedashed;
        case 'linesize2': return this.hint_linesize2;
        case 'linesize4': return this.hint_linesize4;
        case 'nofill': return this.hint_nofill;
        case 'nostroke': return this.hint_nostroke;
        case 'lighter': return this.hint_lighter;
        case 'darker': return this.hint_darker;
        case 'shadow': return this.hint_shadow;
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
}
module.exports = { NitrilePreviewDiagram };
























