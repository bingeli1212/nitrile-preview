'use babel';

const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { makeknots, mp_make_choices } = require('./nitrile-preview-mppath');
const w3color = require('./nitrile-preview-w3color');

const N_Max_Array = 256;
class NitrilePreviewDiagram extends NitrilePreviewBase {

  constructor(translator) {
    super();
    this.translator = translator;
    this.w3color = w3color;
    /// all ss maps
    this.MAX = 2048;
    this.MIN = 0.000001;
    /// the environment for parsing environment var
    this.re_env_expr = /^(\w+)\s*:=\s*(.*)$/;
    /// range expression
    this.re_range_two = /^([^:]+):([^:]+)$/;
    this.re_range_three = /^([^:]+):([^:]+):([^:]+)$/;
    /// regular expression
    this.re_for_all = /^for\b\s*(\w+\s*:=\s*\[.*?\])+/;
    this.re_for_one = /^(\w+)\s*:=\s*(\[.*?\])\s*(.*)$/;
    this.re_commentline = /^\%/;
    this.re_viewport_command = /^viewport\s+(.*)$/;
    this.re_config_command = /^config\s+(\w+)\s*(.*)$/;
    this.re_reset_command = /^reset/;
    this.re_set_command = /^set\s+([\w\-]+)\s*(.*)$/;
    this.re_source_command = /^source\s+(.*)$/;
    this.re_exit_command = /^exit/;
    this.re_debug_command = /^debug(\.[\.\w]+|)\s+(.*)$/;
    // path, fn, var
    this.re_path_command = /^path\s+(.*?)\s*\=\s*(.*)$/;
    this.re_fn_command = /^fn\s+([A-Za-z][A-Za-z0-9]*)\((.*?)\)\s*=\s*(.*)$/;
    // 
    // Following command will generate output
    //
    this.re_drawcontrolpoints_command = /^drawcontrolpoints(\.\w+|)\s+(.*)$/;
    this.re_drawanglearc_command = /^drawanglearc(\.\w+|)\s+(.*)$/;
    this.re_drawlinesegcong_command = /^drawlinesegcong(\.\w+|)\s+(.*)$/;
    // fill, no stroking
    this.re_draw_command = /^draw(\.\w+|)\s+(.*)$/;
    this.re_fill_command = /^fill(\.\w+|)\s+(.*)$/;
    this.re_stroke_command = /^stroke(\.\w+|)\s+(.*)$/;
    this.re_arrow_command = /^arrow(\.\w+|)\s+(.*)$/;
    this.re_revarrow_command = /^revarrow(\.\w+|)\s+(.*)$/;
    this.re_dblarrow_command = /^dblarrow(\.\w+|)\s+(.*)$/;
    // fill with clip path in mind, to be deprecated
    this.re_fillclipath_command = /^fillclipath(\.\w+|)\s+(.*)$/;
    // node and edge
    this.re_node_command = /^node(\.[\.\w]+|)\b\s*(.*)$/;
    this.re_edge_command = /^edge(\.[\.\w]+|)\b\s*(.*)$/;
    // rec
    this.re_rec_command = /^rec(\.[\.\w]+|)\b\s*(.*)$/;
    // box and connecting lines - TODO
    this.re_box_command =  /^box(\.[\.\w]+|)\s+(.*)$/;
    // label and text
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
    // RE
    this.re_pathfunc        = /^&([A-Za-z][A-Za-z0-9]*)\{(.*?)\}\s*(.*)$/;
    this.re_pathvar_range   = /^&([A-Za-z][A-Za-z0-9]*)\[(.*?)\]\s*(.*)$/;
    this.re_pathvar_single  = /^&([A-Za-z][A-Za-z0-9]*)\s*(.*)$/;
    this.re_dashdot = /^(~|\.\.)\s*(.*)$/;
    this.re_coord = /^\((.*?)\)\s*(.*)$/;
    this.re_cycle = /^(cycle)\s*(.*)$/;
    this.re_offset = /^\<(.*?)\>\s*(.*)$/;
    this.re_relative = /^\[(.*?)\]\s*(.*)$/;
    this.re_nonblanks = /^(\S+)\s*(.*)$/;
    this.re_action_string = /^\s*(\S+)\s*(.*)$/;
    this.re_action_style = /^\s*\{(.*?)\}\s*(.*)$/;
    this.re_action_label = /^\s*(")([^"]*)\"\s*(.*)$/;
    this.re_action_label2 = /^\s*(\\\()(.*?)\\\)\s*(.*)$/;
    this.re_range = /^(\d+)\-(\d+)$/;
    this.re_scalar_path = /^&([a-zA-Z]\w*)\[(\d+)\]\.([xy])\s*(.*)$/;
    this.re_scalar_func = /^([a-zA-Z]\w*)\(/;
    this.re_scientific_notation = /^(\d+[eE](?:\+|\-|)\d+)(.*)$/;
    this.re_float_number = /^(\d*\.\d+|\d*\.|\d+)(e\d+|e\+\d+|e\-\d+|E\d+|E\+\d+|e\-\d+|)(.*)$/;
    this.re_var_name = /^([A-Za-z][A-Za-z0-9]*)(.*)$/;
    this.re_path_name = /^[A-Za-z][A-Za-z0-9]*$/;
    this.re_colorfunction = /^&(.*)$/;
    /// some preset values
    this.fontsize = 12;
    this.dotsize = 5;
    this.barlength = 0.40;
    /// all attrflags
    this.attrflag_linedashed = 1;
    this.attrflag_linesize2  = 2;
    this.attrflag_linesize4  = 4;
    this.attrflag_nostroke   = 8;
    /// initialize internals
    this.init_internals();
    this.do_reset();
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
    /// path
    this.my_path_map = new Map();
    /// all funcs defined by 'fn' command
    this.my_fn_map = new Map();
    /// all nodes
    this.my_node_map = new Map();
    /// all recordings
    this.my_rec_map = new Map();
    /// all saved ref
    this.my_ref_map = new Map();
    /// lastpt
    this.lastpt = [0,0];
    /// viewport
    this.viewport_width = 20;
    this.viewport_height = 10;
    this.viewport_unit = 5;
  }

  do_reset() {
    ///these can be changed
    this.def_refsx = this.refsx = 1;
    this.def_refsy = this.refsy = 1; 
    this.def_refx = this.refx = 0;
    this.def_refy = this.refy = 0;
    this.def_id = this.id = 0;
  }

  to_diagram(ss,style) {
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
    if(ss.length){
      ///NOTE: scan the first line for viewport command, if found, use it to set the 
      ///internals
      let s0 = ss[0]||'';
      if(s0){
        let v;
        if((v=this.re_viewport_command.exec(s0))!==null){
          let pp = this.translator.string_to_int_array(v[1]);
          if(pp[0]){
            this.viewport_width = pp[0];
          }
          if(pp[1]){
            this.viewport_height = pp[1];
          }
          if(pp[2]){
            this.viewport_unit = pp[2];
          }
          ss = ss.slice(1);
        }
      }
    }
    this.do_reset();
    this.do_setup();
    var env = {};
    this.exec_body(ss,env);
    ///remove empty output lines
    var o = this.commands.filter(s => (s) ? true : false);
    return this.do_finalize(o.join('\n'),style);
  }

  ///*NOTE: join body lines
  join_body_lines(lines) {
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
    return o;
  }

  ///*NOTE: this method is to execute an isolated program body.
  ///       the body could be the entire problem itself, but it can
  ///       also be a for-loop body, in which case the for-loop 
  ///       ensure to call it multiple times, each time the code
  ///       being executed are slightly different than before, because
  ///       of the replacement of one or loop variables with the actual
  ///       value

  exec_body(lines,env){
    var v;
    var max_n;
    lines = this.join_body_lines(lines);//also made a new copy of it
    while (lines.length) {
      var raw = lines.shift();//modify 'lines' variable
      var [lead, line] = this.trim_line_left(raw);
      if (line.length == 0) {
        continue;
      }
      if(lead.length > 0){
        continue;
      }
      // extract all lines underneath it that is indented
      var loopbody = this.extract_loop_body(lines,lead);
      // replace this line with env variables 
      var [line] = this.line_replace_env(line,env);
      // comment line
      if((v=this.re_commentline.exec(line))!== null){
        continue;
      }
      // assignment-statement
      if((v=this.re_env_expr.exec(line))!==null){
        let name = v[1];
        let expr = v[2];
        let [quan] = this.extract_next_expr(expr, {});
        env[name] = quan;
        this.commands.push(this.do_comment(`${name}:=${quan}`));
        continue;
      }  
      // for-loop
      if((v=this.re_for_all.exec(line)) !== null) {
        var max_n = 0;
        var line = line.slice(3).trim();
        var iter_array = [];
        while(line.length){
          if((v = this.re_for_one.exec(line))!==null) {
            var line = v[3];
            let name = v[1];
            let range = v[2];
            let seq = this.read_action_floats(range);
            iter_array.push({name,seq});
            max_n = Math.max(seq.length,max_n);
          }else{
            break;
          }
        }
        //trim loop body also makes a copy
        var newbody = this.trim_samp_body(loopbody);
        for(var i=0; i < max_n; ++i){
          //execute loopbody 'max_n' number of times
          //NOTE: each time set the '@' environment variable to the counter starting with '0'
          env['@']=`${i}`;
          for(var j=0; j < iter_array.length; ++j){
            //update 'env' with the loop variables
            let iter = iter_array[j];
            let name = iter.name;
            let quan = iter.seq[i]||0;
            env[name] = quan;
            this.commands.push(this.do_comment(`${name}:=${quan}`));
          }
          //execute loopbody with the updated 'env'
          this.exec_body(newbody,env);
        }
        continue;
      }
      ///only execute lines that do not start with spaces
      // NOTE: generate a comment in the output
      //
      this.commands.push(this.do_comment(line));
      this.commands.push(this.do_line(line,env));
    }
  }

  extract_loop_body(lines,lead0){
    var outlines=[];
    ///extract all lines from 'lines' until a line
    ///is encountered with an indentation less of 'lead0',
    ///in which case this line is left untouched; emtpy
    ///lines are ignore;     
    for (var n=0; lines.length; n++) {
      ///lookahead
      var [lead, line] = this.trim_line_left(lines[0]);
      ///remove empty lines
      if (line.length == 0) {
        lines.shift();//remove it from lines
        continue;
      }
      ///if the indentation is more than the parent
      if (lead.length > lead0.length) {
        var line = lines.shift();
        outlines.push(line);
        continue;
      }
      ///otherwise we get out
      break;
    }
    return outlines;
  }

  trim_line_left(line){
    var re_leading = /^(\s*)(.*)$/;
    var v;
    if((v=re_leading.exec(line))!==null){
      return [v[1],v[2]];
    }
    return ['',line];
  }

  get_float_prop(g, name, def_v=0, min=null, max=null) {
    let val;
    if(g && g.hasOwnProperty(name)){
      val = g[name];
    }else if(this.config.hasOwnProperty(name)){
      val = this.config[name];
    }
    return this.assert_float(val,def_v,min,max);
  }
  get_int_prop(g, name, def_v=0, min=null, max=null) {
    let val;
    if(g && g.hasOwnProperty(name)){
      val = g[name];
    }else if(this.config.hasOwnProperty(name)){
      val = this.config[name];
    }
    return this.assert_int(val,def_v,min,max);
  }
  get_string_prop(g, name, def_v='') {
    let val;
    if(g && g.hasOwnProperty(name)){
      val = g[name];
    }else if(this.config.hasOwnProperty(name)){
      val = this.config[name];
    }
    return this.assert_string(val,def_v);
  }

  get_path_from_variable(a) {

    ///***NOTE: this function should return a path, not a point!

    /// if it is null then we return an empty path
    if (!a) {
      return [];
    }
    if (this.my_path_map.has(a)) {
      return this.my_path_map.get(a);
    }
    if(a=='last'){
      return [[this.lastpt[0],this.lastpt[1]]];
    }
    if(a=='northwest'){
      return [[0,this.viewport_height]];
    }
    if(a=='south'){
      return [[this.viewport_width/2,0]];
    }
    if(a=='north'){
      return [[this.viewport_width/2,this.viewport_height]];
    }
    if(a=='west'){
      return [[0,this.viewport_height/2]];
    }
    if(a=='east'){
      return [[this.viewport_width,this.viewport_height/2]];
    }
    ///check to see if this is a build-in path
    var s = this.name_to_path_string(a);
    if(s){
      return this.read_coords_line(this.name_to_path_string(a)).coords;
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
  exec_path_func(line, fun_str, args) {

    var ret_val = [];
    switch (fun_str) {

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
        } else if(args.length == 3){
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
            ret_val.push([ptx, pty]);///always returns a single point
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
              ret_val.push([ptx, pty]);///always return a single point
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
            ret_val.push([ptx, pty]);///always return a single point
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
          n = parseInt(n);
          if(!n) n = 1;
          if (n > N_Max_Array) {
            n = N_Max_Array;
          }else if(n < 1){
            n = 1;
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
            ret_val.push([px, py, 'L']);
          }
        }
        break;
      }
      case 'shiftpoints': {

        /// shiftpoints(a,0,-2)
        /// shiftpoints(a,2,-1)

        if (args.length == 3 &&
            this.is_arg_coords(args[0]) &&
            this.is_arg_scalar(args[1]) &&
            this.is_arg_scalar(args[2])) {
          let coords = args[0].coords;    
          let dx = args[1].scalar;      
          let dy = args[2].scalar;      
          for(let z of coords){
            let t = z.map(x => x);//make a copy
            t[0] += dx;
            t[1] += dy;        
            t[3] += dx;        
            t[4] += dy;        
            t[5] += dx;        
            t[6] += dy;        
            ret_val.push(t);
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
          let d = Math.sqrt(dx*dx + dy*dy);
          let x = (d*d - r*r + R*R)/(2*d);
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
          let d = Math.sqrt(dx*dx + dy*dy);
          let x = (d*d - r*r + R*R)/(2*d);
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
              ret_val.push([x1,y1]);
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
          let d = Math.sqrt(dx*dx + dy*dy);
          let x = (d*d - r*r + R*R)/(2*d);
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

          ret_val.push([c[0],a[1]]);
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
                ret_val.push([x1,y1,'L']);
              }
            }
          }
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
          ret_val.push([z[0]+r,z[1]]);
          ret_val.push([z[0]-r,z[1],'A','','','','',r,r,0,0,0]);
          ret_val.push([z[0]+r,z[1],'A','','','','',r,r,0,0,0]);          
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
        ret_val.push([x1,y1]);
        ret_val.push([x2,y2,'A','','','','',rx,ry,phi,1,0]);
        ret_val.push([x1,y1,'A','','','','',rx,ry,phi,1,0]);
        ret_val.push([0,0,'cycle']);
        break;
      }

      case 'rectangle': {
        ///&rectangle(point1,point2)
        if(args.length == 2 && this.is_arg_scalar(args[0]) && this.is_arg_scalar(args[1])) {
          let w = args[0].scalar;
          let h = args[1].scalar;
          ret_val.push([0,0]);
          ret_val.push([w,0,'L']);
          ret_val.push([w,h,'L']);
          ret_val.push([0,h,'L']);
          ret_val.push([0,0,'cycle']);
        } else if(args.length == 2 && this.is_arg_coords(args[0]) && this.is_arg_coords(args[1])) {
          let z1 = this.point(args[0].coords,0);
          let z2 = this.point(args[1].coords,0);
          ret_val.push([z1[0],z1[1]]);
          ret_val.push([z2[0],z1[1],'L']);
          ret_val.push([z2[0],z2[1],'L']);
          ret_val.push([z1[0],z2[1],'L']);
          ret_val.push([0,0,'cycle']);
        } else if(args.length == 3 && this.is_arg_coords(args[0]) && this.is_arg_scalar(args[1]) && this.is_arg_scalar(args[2])) {
          let pt = this.point(args[0].coords,0);
          let x = pt[0];
          let y = pt[1];
          let w = args[1].scalar;
          let h = args[2].scalar;
          ret_val.push([x,y]);
          ret_val.push([x+w,y,'L']);
          ret_val.push([x+w,y+h,'L']);
          ret_val.push([x,y+h,'L']);
          ret_val.push([0,0,'cycle']);
        }
        break;
      }

      case 'roundrectangle': {
        if(args.length == 2 && this.is_arg_coords(args[0]) && this.is_arg_coords(args[1])) {
          let z1 = this.point(args[0].coords,0);
          let z2 = this.point(args[1].coords,0);
          let w = Math.abs(z1[0]-z2[0]);
          let h = Math.abs(z1[1]-z2[1]);
          let x = Math.min(z1[0],z2[0]);
          let y = Math.min(z1[1],z2[1]);
          let dx = 0.2*w; 
          let dy = 0.2*h; 
          ret_val.push([x+0,    y+dy,   '' ]);
          ret_val.push([x+dx,   y+0,    'C',x+0,y+0,x+0,y+0]);
          ret_val.push([x+w-dx, y+0,    'L']);
          ret_val.push([x+w,    y+dy,   'C',x+w,y+0,x+w,y+0]);
          ret_val.push([x+w,    y+h-dy, 'L']);
          ret_val.push([x+w-dx, y+h,    'C',x+w,y+h,x+w,y+h]);
          ret_val.push([x+dx,   y+h,    'L']);
          ret_val.push([x+0,    y+h-dy, 'C',x+0,y+h,x+0,y+h]);
          ret_val.push([x+0,    y+0,    'cycle']);
        }
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
            ret_val.push([z0[0],z0[1]]);
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
              ret_val.push([z[0],z[1],'']);
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
              ret_val.push([z[0],z[1],'']);
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
        ///&arctravel(Center,Start,angle)
        /// 'Center' is the center, 'Start' is the starting point on the arc,
        /// The 'angle' is the angle to travel starting from 'Start'
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
          ret_val.push([px,py]);
          ret_val.push([qx,qy,'A','','','','',r,r,0,bigarcflag,sweepflag])
        }
        break;
      }

      case 'arcspan': {
        ///&arcspan(Center,Pt1,Pt2)
        ///'Center' is the center, the arc goes from Pt1 to Pt2
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
          ret_val.push([px,py]);
          ret_val.push([qx,qy,'A','','','','',r,r,0,bigarcflag,sweepflag])
        }
        break;
      }

      case 'arcsweep': {
        ///&arcspan(center,start_a,sweep_a)
        ///'center' is the center, the arc always goes from start angle 'start_a'
        /// and sweep over 'span_a' angle
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
          ret_val.push([px,py]);
          ret_val.push([qx,qy,'A','','','','',r,r,0,bigarcflag,sweepflag])
        }
        break;
      }

      case 'cylinder': {
        ///&cylinder(center,xradius,yradius,height)
        ///'center' is a path, xradius and yradius and height are scalars
        if(args.length == 4 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_scalar(args[1]) &&
        this.is_arg_scalar(args[2]) && 
        this.is_arg_scalar(args[3])) {
          let z0 = this.point(args[0].coords,0);
          let rx = args[1].scalar; 
          let ry = args[2].scalar;
          let ht = args[3].scalar;
          ret_val.push([z0[0]-rx,z0[1]+ht]);
          ret_val.push([z0[0]-rx,z0[1],'L']);
          ret_val.push([z0[0]+rx,z0[1],'A','','','','',rx,ry,0,0,0]);
          ret_val.push([z0[0]+rx,z0[1]+ht,'L']);
          ret_val.push([z0[0]-rx,z0[1]+ht,'A','','','','',rx,ry,0,0,1]);
          ret_val.push([0,0,'cycle']);
          ret_val.push([z0[0]-rx,z0[1]+ht]);
          ret_val.push([z0[0]+rx,z0[1]+ht,'A','','','','',rx,ry,0,0,0]);
          ret_val.push([z0[0]-rx,z0[1]+ht,'A','','','','',rx,ry,0,0,0]);
          ret_val.push([0,0,'cycle']);
        }
        break;
      }

      case 'fracwheel': {
        ///&fracwheel(center,radius,numerator,denominator)
        ///'center' is a path, radius, numerator, and denominator are scalars
        if(args.length == 4 &&
        this.is_arg_coords(args[0]) &&
        this.is_arg_scalar(args[1]) &&
        this.is_arg_scalar(args[2]) && 
        this.is_arg_scalar(args[3])) {
          let z = this.point(args[0].coords,0);
          let r = args[1].scalar; 
          let num = args[2].scalar;
          let den = args[3].scalar;
          for(let i=0; i<den; ++i){
            let theta0 = i*Math.PI*2/den;
            let theta1 = (i+1)*Math.PI*2/den;
            let x0 = z[0] + Math.cos(theta0);
            let y0 = z[1] + Math.sin(theta0);
            let x1 = z[0] + Math.cos(theta1);
            let y1 = z[1] + Math.sin(theta1);
            ret_val.push([z[0],z[1]]);
            ret_val.push([x0,y0,'L']);
            ret_val.push([x1,y1,'A','','','','',r,r,0,0,0]);
            ret_val.push([z[0],z[1],'L']);
            if(i<num){
              // some of the pies are closed but some others are not
              ret_val.push([0,0,'cycle']);
            }
          }
        }
        break;
      }

      case 'equilateraltriangle': {
        ///&equilateraltriangle{(0,0),3}
        ///The first point is a coordinate representing the center of the triangle, and second argument is the distance from the center to one of the vertices
        let z = this.assert_arg_pt(args,0);
        let a = this.assert_arg_scalar(args,1);
        let angles = [90, 210, 330]; 
        angles.forEach((angle,i,arr) => {
          angle /= 180;
          angle *= Math.PI;
          let x = z[0] + a*Math.cos(angle)/Math.sqrt(3);
          let y = z[1] + a*Math.sin(angle)/Math.sqrt(3);
          if(i==0){
            ret_val.push([x,y]);
          }else{
            ret_val.push([x,y,'L']);
          }
        });
        ret_val.push([0,0,'cycle'])
        break;
      }

      case 'grid': {
        if(args.length == 4 &&
          this.is_arg_scalar(args[0]) &&
          this.is_arg_scalar(args[1]) &&
          this.is_arg_scalar(args[2]) &&
          this.is_arg_scalar(args[3])) {
            let xmax = args[0].scalar;
            let ymax = args[1].scalar;
            let inc_x = args[2].scalar;
            let inc_y = args[3].scalar;
            for(var j = 0; j < this.MAX; j++){
              var y = inc_y*j;
              if(y > ymax) break;
              ret_val.push([0,y]);
              ret_val.push([xmax,y,'L']);
            }
            for(var i = 0; i < this.MAX; i++){
              var x = inc_x*i;
              if(x > xmax) break;
              ret_val.push([x,0]);
              ret_val.push([x,ymax,'L']);
            }
          }
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

      case 'mirror': {
        let z0 = this.assert_arg_pt(args,0);
        let st = this.assert_arg_pt(args,1);
        let pt = this.assert_arg_pt(args,2);
        let tx = z0[0];
        let ty = z0[1];
        let [dx, dy] = this.computeMirroredPointOffset(st, pt, tx, ty);
        tx += dx;
        ty += dy;
        ret_val.push([tx,ty]);
        break;
      }

      case 'scale': {
        if(args.length == 2 &&
          this.is_arg_coords(args[0]) &&
          this.is_arg_scalar(args[1])) {
            let Z = args[0].coords;
            let a = args[1].scalar;
            let U = this.offset_and_scale_coords(Z,0,0,a,a,0);
            for(let u of U){
              ret_val.push(u);
            }
          }
        else if(args.length == 3 &&
          this.is_arg_coords(args[0]) &&
          this.is_arg_scalar(args[1]) &&
          this.is_arg_scalar(args[2])) {
            let Z = args[0].coords;
            let ax = args[1].scalar;
            let ay = args[2].scalar;
            let U = this.offset_and_scale_coords(Z,0,0,ax,ay,0);
            for(let u of U){
              ret_val.push(u);
            }
          }
        break;
      }

      case 'rotate': {
        if(args.length == 2 &&
          this.is_arg_coords(args[0]) &&
          this.is_arg_scalar(args[1])) {
            let Z = args[0].coords;
            let rotate = args[1].scalar;
            let U = this.offset_and_scale_coords(Z,0,0,1,1,rotate);
            for(let u of U){
              ret_val.push(u);
            }
          }
        break;
      }

      case 'translate': {
        let Z = this.assert_arg_coords(args,0);
        let MX = this.assert_arg_scalar(args,1);
        let MY = this.assert_arg_scalar(args,2);
        let U = this.offset_and_scale_coords(Z,MX,MY,1,1,0);
        for(let u of U){
          ret_val.push(u);
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

      case 'bbox': {
        ///&bbox{}
        ret_val.push([0,0]);
        ret_val.push([this.viewport_width,0,'L']);
        ret_val.push([this.viewport_width,this.viewport_height,'L']);
        ret_val.push([0,this.viewport_height,'L']);
        ret_val.push([0,0,'L']);
        break;
      }

      default:
        break;

    }
    if (ret_val.length == 0) {
      return [[0, 0]];///a coordinate with a single point
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

  offset_and_scale_coords(coords,offsetx,offsety,xscale,yscale,rotate){
    var newcoords = [];
    for(let i=0; i < coords.length; ++i){
      let pt = coords[i];
      let newpt = this.offset_and_scale_pt(pt,offsetx,offsety,xscale,yscale,rotate);
      newcoords.push(newpt);
    }
    return newcoords;
  }

  offset_and_scale_pt(pt,offsetx,offsety,xscale,yscale,rotate){
    var newpt = [];
    for (let i = 0; i < pt.length; ++i) {
      newpt.push(pt[i]);
    }
    ///rotate first
    ///cos(theta)  -sin(theta)
    ///sin(theta)   cos(theta)
    ///newx=[x*cos_theta - y*sin_theta]
    ///newy=[x*sin_theta + y*cos_theta]
    if(rotate){
      var x = newpt[0];
      var y = newpt[1];
      var [newx,newy] = this.rotate_point(x,y,rotate);
      newpt[0] = newx;
      newpt[1] = newy;
      var x = newpt[3];
      var y = newpt[4];
      var [newx,newy] = this.rotate_point(x,y,rotate);
      newpt[3] = newx;
      newpt[4] = newy;
      var x = newpt[5];
      var y = newpt[6];
      var [newx,newy] = this.rotate_point(x,y,rotate);
      newpt[5] = newx;
      newpt[6] = newy;
    }
    ///scale second
    newpt[0] *= xscale;
    newpt[1] *= yscale;
    newpt[3] *= xscale;
    newpt[4] *= yscale;
    newpt[5] *= xscale;
    newpt[6] *= yscale;
    newpt[7] *= yscale;
    newpt[8] *= yscale;
    ///offset last
    newpt[0] += offsetx;
    newpt[1] += offsety;
    newpt[3] += offsetx;
    newpt[4] += offsety;
    newpt[5] += offsetx;
    newpt[6] += offsety;
    return newpt;
  }

  offset_pt(pt,offsetx,offsety) {
    var newpt = [];
    for(let i=0; i < pt.length; ++i){
      newpt.push(pt[i]);
    }
    newpt[0] += offsetx;
    newpt[1] += offsety;
    newpt[3] += offsetx;
    newpt[4] += offsety;
    newpt[5] += offsetx;
    newpt[6] += offsety;
    return newpt;
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

  point(coords, i) {
    if (coords && Array.isArray(coords) && i < coords.length) {
      var pt = coords[i];
      return pt;
    } 
    return [0, 0, 'nan'];
  }

  read_action_token(line) {
    var v;
    var s = '';
    if((v=this.re_action_string.exec(line))!==null){
      var s = v[1];
      line = v[2];
    }
    return [s,line];
  }

  read_action_style_label(line) {
    var v;
    var g = {...this.config};
    var txt = "";
    ///parse style
    if((v=this.re_action_style.exec(line))!==null) {
      var s = v[1].trim();
      var line = v[2];
      var s = `{${s}}`;
      var {style:g} = this.string_to_style(s,g);
    }
    ///parse label or label text
    if((v=this.re_action_label.exec(line))!==null) {
      var txt = v[2].trim();
      line = v[3];    
    }else if((v=this.re_action_label2.exec(line))!==null) {
      var txt = v[2].trim();
      g.math = 1;
      line = v[3];    
    }
    return [g,txt,line];
  }

  read_coords_line(line) {
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
    ///   [12] attrflag
    var coords = [];
    var offsetx = 0;
    var offsety = 0;
    var lastpt = [0, 0];
    var attrflag = 0;
    var dx = 0;
    var dy = 0;
    var x = 0;
    var y = 0;
    var v;
    var n = 0;
    var x1 = 0;//First control point for cubic
    var y1 = 0;//First control point for cubic
    var x2 = 0;//Second control point for cubic
    var y2 = 0;//Second control point for cubic
    var x3 = 0;//First control point for quadratic
    var y3 = 0;//First control point for quadratic
    var lastjoin = '';///'hobby','','cubic','quadrilatic','arcpath'
    var hobby_p = [];
    while (line.length) {

      if ((v = this.re_pathfunc.exec(line)) !== null) {
        var raw = v[0];
        var fun_name = v[1];
        var fun_args = this.string_to_pathfunc_args(v[2]);
        line = v[3];
        var ret_val = this.exec_path_func(raw, fun_name, fun_args);
        for (var i = 0; i < ret_val.length; ++i) {
          let pt = this.point(ret_val, i);
          pt = this.offset_pt(pt,offsetx,offsety);
          [x, y, join] = pt;
          if(i==0 && lastjoin=='line'){
            pt[2]='L'
          }
          lastjoin='';
          pt[12] = attrflag;//always set the attrflag for a path func generated coords
          coords.push(pt);
          lastpt[0] = pt[0];
          lastpt[1] = pt[1];
        }
        continue;
      }

      if ((v = this.re_pathvar_range.exec(line)) !== null) {
        var fun_name = v[1].trim();
        var range = v[2].trim();
        line = v[3];

        var symbol = fun_name;
        if (symbol.length == 0) {
          var from = this.lastcoords;
        } else {
          var from = this.get_path_from_variable(symbol);
        }
        var indices = range.split(',');
        var join = '';
        for (var s of indices) {
          if (this.re_range.test(s)) {
            var v = this.re_range.exec(s);
            var i1 = parseInt(v[1]);
            var i2 = parseInt(v[2]);
            if (Number.isFinite(i1) && Number.isFinite(i2)) {
              for (var i = i1; i1 <= i2 && i <= i2; ++i) {
                [x, y, join] = this.point(from, i);
                if (join === 'cycle') {
                  // skip
                }else{
                  if(lastjoin=='line' && !join){
                    join = 'L';
                    lastjoin = '';
                  }
                  x += offsetx;
                  y += offsety;
                  let pt = [x,y,join];
                  coords.push(pt);
                  lastpt[0] = x;
                  lastpt[1] = y;
                }
              }
              for (var i = i1; i1 > i2 && i >= i2; --i) {
                // first index is greater than the second
                [x, y, join] = this.point(from, i);
                if (join === 'cycle') {
                  // skip
                }else{
                  if(lastjoin=='line' && !join){
                    join = 'L';
                    lastjoin = '';
                  }
                  x += offsetx;
                  y += offsety;
                  let pt = [x,y,join];
                  coords.push(pt);
                  lastpt[0] = x;
                  lastpt[1] = y;
                }
              }
            }
          } else {
            var i = parseInt(s);
            if (Number.isFinite(i)) {
              [x, y, join] = this.point(from, i);
              if (join === 'cycle') {
                // skip
              }else{
                if(lastjoin=='line' && !join){
                  join = 'L';
                  lastjoin = '';
                }
                x += offsetx;
                y += offsety;
                let pt = [x,y,join];
                coords.push(pt);
                lastpt[0] = x;
                lastpt[1] = y;
              }
            }
          }
        }
        continue;

      } 

      if ((v = this.re_pathvar_single.exec(line)) !== null) {
        var symbol = v[1].trim();
        line = v[2];
        var from = this.get_path_from_variable(symbol);
        for (var i = 0; i < from.length; ++i) {
          var pt = this.point(from, i);
          var pt = this.offset_pt(pt,offsetx,offsety);
          if(lastjoin=='line'){
            pt[2]='L';
            lastjoin = '';
          }
          coords.push(pt);
          lastpt[0] = pt[0];
          lastpt[1] = pt[1];
        }
        continue;

      }

      if ((v = this.re_cycle.exec(line))!==null) {
        let pt = [0,0,'cycle'];
        coords.push(pt);
        line = v[2];
        lastjoin = '';
        //break;
        continue;
      }

      /// such as (0,0)
      if ((v = this.re_coord.exec(line))!==null) {
        n++;
        var fun_name = v[1].trim();
        line = v[2];
        fun_name = fun_name.split(',');
        fun_name = fun_name.map(x => x.trim());
        if (fun_name.length < 2) {
          let pt = [0,0,'nan'];
          //coords.push(pt);
          lastjoin = '';
          continue;
        }
        var d0 = fun_name[0];
        var d1 = fun_name[1];
        if (!d0) {
          x = lastpt[0];
        } else {
          x = parseFloat(d0);
          x += offsetx;
        }
        if (!d1) {
          y = lastpt[1];
        } else {
          y = parseFloat(d1);
          y += offsety;
        }
        if (Number.isFinite(x) && Number.isFinite(y)) {
          ///add in the offset; ***NOTE that offset should only
          ///be added for real coords, and not the relatives.
          if (lastjoin === 'hobby') {
            hobby_p.push([x, y]);
            var tension = 1;
            var knots = makeknots(hobby_p, tension, false);///nitrile-preview-mppath.js
            mp_make_choices(knots[0]);
            let pt = [x,y, '', '','','','', 0,0,0,0,0, attrflag];
            coords.push(pt);
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
            lastjoin = '';///reset it to '' so that it needs another .. to make it 'hobby'
          } else {
            ///turn it off
            if(hobby_p.length){
              hobby_p = [];
            }
            if(lastjoin==='line'){
              let pt = [x,y,'L', '','','','', 0,0,0,0,0, attrflag];
              coords.push(pt);
            }else{
              let pt = [x,y,'',  '','','','', 0,0,0,0,0, attrflag];
              coords.push(pt);
            }
            lastjoin = '';
          }
          lastpt[0] = x;
          lastpt[1] = y;
        }
        continue;
      }

      if ((v = this.re_offset.exec(line)) !== null) {
        n++;
        /// <1,2>, or <1,>, or <,2>, or <,,1>
        var fun_name = v[1].trim();
        line = v[2];
        if (!fun_name) {
          continue; ///d is an empty string
        }
        if(fun_name=='last'){
          dx = this.lastpt[0];
          dy = this.lastpt[1];
          if (Number.isFinite(dx)) { offsetx += dx; lastpt[0] += dx; }
          if (Number.isFinite(dy)) { offsety += dy; lastpt[1] += dy; }
          continue;
        }
        else if(fun_name.startsWith('&')){
          let a = fun_name.slice(1);
          let a_coords = this.get_path_from_variable(a);
          let a_pt = this.point(a_coords,0);
          if(a_coords.length && this.isvalidpt(a_pt)){
            offsetx = a_pt[0];
            offsety = a_pt[1];
            lastpt[0] = offsetx;
            lastpt[1] = offsety;
          }
          continue;
        }
        fun_name = fun_name.split(',');
        fun_name = fun_name.map(x => x.trim());
        if (fun_name.length == 2) {
          dx = parseFloat(fun_name[0]);
          dy = parseFloat(fun_name[1]);
          if (Number.isFinite(dx)) { offsetx += dx; lastpt[0] += dx; }
          if (Number.isFinite(dy)) { offsety += dy; lastpt[1] += dy; }
        }else if(fun_name.length == 3){
          ///with attrflag
          dx = parseFloat(fun_name[0]);
          dy = parseFloat(fun_name[1]);
          if (Number.isFinite(dx)) { offsetx += dx; lastpt[0] += dx; }
          if (Number.isFinite(dy)) { offsety += dy; lastpt[1] += dy; }
          attrflag = fun_name[2]||0;
        }
        continue;
      }

      if ((v = this.re_relative.exec(line)) !== null) {
        n++;
        /// [angledist:angle,dist]
        /// [clock:angle,dist]
        /// [turn:angle,dist]
        /// [flip:dx,dy] /// flip the point to the other side of the line of the last two points
        /// [l:dx,dy] /// line
        /// [h:dx] /// line
        /// [v:dy] /// line
        /// [c:dx1,dy1,dx2,dy2,dx,dy]
        /// [s:dx2,dy2,dx,dy]
        /// [a:rx,ry,angle,bigarcflag,sweepflag,dx,dy]
        /// [q:dx1,dy1,dx,dy]
        /// [t:dx,dy]
        /// [dot:r]
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
              var angle = parseFloat(val[0]);
              var dist = parseFloat(val[1]);
              dx = dist * Math.cos(angle / 180 * Math.PI);
              dy = dist * Math.sin(angle / 180 * Math.PI);
              if (!Number.isFinite(dx)) { dx = 0; }
              if (!Number.isFinite(dy)) { dy = 0; }
              x = lastpt[0] + dx;
              y = lastpt[1] + dy;
              lastjoin = '';
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
              coords.push(pt);
              lastpt[0] = x;
              lastpt[1] = y;
            }
          }
          else if (key === 'clock') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 2 || val.length == 4 || val.length == 6) {
              if(val.length == 2){
                var last_angle_deg = 0
                var angle_deg = thie.assert_float(val[0]);
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
              x = lastpt[0] + dx;
              y = lastpt[1] + dy;
              lastjoin = '';
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
              coords.push(pt);
              lastpt[0] = x;
              lastpt[1] = y;
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
              x = lastpt[0] + dx;
              y = lastpt[1] + dy;
              lastjoin = '';
              let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
              coords.push(pt);
              lastpt[0] = x;
              lastpt[1] = y;
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
                  lastjoin = '';
                  let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
                  coords.push(pt);
                  lastpt[0] = x;
                  lastpt[1] = y;
                }
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
                x = lastpt[0] + dx;
                y = lastpt[1] + dy;
                lastjoin = '';
                let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
                coords.push(pt);
                lastpt[0] = x;
                lastpt[1] = y;
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
                x = lastpt[0] + dx;
                y = lastpt[1] + dy;
                lastjoin = '';
                let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
                coords.push(pt);
                lastpt[0] = x;
                lastpt[1] = y;
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
                x = lastpt[0] + dx;
                y = lastpt[1] + dy;
                lastjoin = '';
                let pt = [x, y, 'L', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
                coords.push(pt);
                lastpt[0] = x;
                lastpt[1] = y;
              }
            }
          }
          else if (key === 'c') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 6) {
              x1 = lastpt[0] + parseFloat(val[0]);
              y1 = lastpt[1] + parseFloat(val[1]);
              x2 = lastpt[0] + parseFloat(val[2]);
              y2 = lastpt[1] + parseFloat(val[3]);
              x = lastpt[0] + parseFloat(val[4]);
              y = lastpt[1] + parseFloat(val[5]);
              if (Number.isFinite(x1) &&
                Number.isFinite(y1) &&
                Number.isFinite(x2) &&
                Number.isFinite(y2) &&
                Number.isFinite(x) &&
                Number.isFinite(y)) {
                lastjoin = 'cubic';
                let pt = [x, y, 'C', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
                coords.push(pt);
                lastpt[0] = x;
                lastpt[1] = y;
              }
            }
          }
          else if (key === 's') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 4) {
              if (lastjoin === 'quadrilatic') {
                [x1,y1] = this.MIRROR([x1,y1],lastpt);
              } else if (lastjoin === 'cubic') {
                [x1,y1] = this.MIRROR([x2,y2],lastpt);
              } else {
                [x1,y1] = lastpt;
              }
              x2 = lastpt[0] + parseFloat(val[0]);
              y2 = lastpt[1] + parseFloat(val[1]);
              x = lastpt[0] + parseFloat(val[2]);
              y = lastpt[1] + parseFloat(val[3]);
              if (Number.isFinite(x1) &&
                Number.isFinite(y1) &&
                Number.isFinite(x2) &&
                Number.isFinite(y2) &&
                Number.isFinite(x) &&
                Number.isFinite(y)) {
                lastjoin = 'cubic';
                let pt = [x, y, 'C', x1, y1, x2, y2, 0,0,0,0,0, attrflag];
                coords.push(pt);
                lastpt[0] = x;
                lastpt[1] = y;
              }
            }
          }
          else if (key === 'a') {
          /// [a:rx,ry,angle,bigarcflag,sweepflag,dx,dy]
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 7) {
              let X1 = lastpt[0];
              let Y1 = lastpt[1];
              let X2 = lastpt[0] + parseFloat(val[5]);
              let Y2 = lastpt[1] + parseFloat(val[6]);
              let Rx = parseFloat(val[0]);
              let Ry = parseFloat(val[1]);
              let Phi = parseFloat(val[2]);
              let bigarcflag = parseInt(val[3]);
              let sweepflag = parseInt(val[4]);
              if (Number.isFinite(X1) &&
                  Number.isFinite(Y1) &&
                  Number.isFinite(X2) &&
                  Number.isFinite(Y2) &&
                  Number.isFinite(Rx) &&
                  Number.isFinite(Ry) &&
                  Number.isFinite(Phi) &&
                  Number.isFinite(bigarcflag) &&
                  Number.isFinite(sweepflag)) {
                lastjoin = 'arcpath';
                let pt = [X2, Y2, 'A', '','','','', Rx,Ry,Phi,bigarcflag,sweepflag, attrflag];
                coords.push(pt);
                lastpt[0] = X2;
                lastpt[1] = Y2;
              }
            }
          }
          else if (key === 'q') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 4) {
              x1 = lastpt[0] + parseFloat(val[0]);
              y1 = lastpt[1] + parseFloat(val[1]);
              x = lastpt[0] + parseFloat(val[2]);
              y = lastpt[1] + parseFloat(val[3]);
              if (Number.isFinite(x1) &&
                Number.isFinite(y1) &&
                Number.isFinite(x) &&
                Number.isFinite(y)) {
                ///NOTE: need to convert to cubic
                //let [C0,C1,C2,C3] = this.quadrilaticToCubic(lastpt,[x1,y1],[x,y]);
                let pt = [x, y, 'Q', x1,y1,'','', 0,0,0,0,0, attrflag];
                coords.push(pt);
                lastpt[0] = x;
                lastpt[1] = y;
                lastjoin = 'quadrilatic';
              }
            }
          }
          else if (key === 't') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            if (val.length == 2) {
              x = lastpt[0] + parseFloat(val[0]);
              y = lastpt[1] + parseFloat(val[1]);
              if (lastjoin === 'quadrilatic') {
                [x1,y1] = this.MIRROR([x1,y1],lastpt);
              } else if (lastjoin === 'cubic') {
                [x1,y1] = this.MIRROR([x2,y2],lastpt);
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
                let pt = [x, y, 'Q', x1,y1,'','', 0,0,0,0,0, attrflag];
                coords.push(pt);
                lastpt[0] = x;
                lastpt[1] = y;
                lastjoin = 'quadrilatic';
              }
            }
          }
          else if (key === 'dot') {
            var val = val.split(',');
            var val = val.map(x => x.trim());
            var r = parseFloat(val[0]);
            if (val.length == 1) {
              x = lastpt[0];
              y = lastpt[1];
              if(Number.isFinite(r)){
                coords.push([x+r,y, '',  '','','','', 0,0,0,0,0, attrflag]);
                coords.push([x-r,y, 'A', '','','','', r,r,0,0,0, attrflag]);
                coords.push([x+r,y, 'A', '','','','', r,r,0,0,0, attrflag]);          
                coords.push([0,0,'cycle']);
              }
              /// 'lastpt' is not changed
            }
          }
        }
        continue;
      }

      /// (1,1) .. (2,3)
      if ((v = this.re_dashdot.exec(line)) !== null) {
        var fun_name = v[1].trim();
        line = v[2];
        if (fun_name === '..') {
          lastjoin = 'hobby';
          if (hobby_p.length === 0) {
            hobby_p.push([lastpt[0], lastpt[1]]);
          }
        } else if(fun_name === '~') {
          lastjoin = 'line';
        }
        continue;
      }

      ///***NOTE: it is important to get out of for-loop
      ///because we do not know how to skip to the next coord
      break;
    }

    ///NOTE: here we will call the latest addition which is to
    ///turn all continuous '..' MetaPost curve operation into
    ///..controls(x,y)and(x,y)..
    //if(user && typeof user == 'object'){
    //  user.s = line;
    //}
    this.lastpt[0] = lastpt[0];
    this.lastpt[1] = lastpt[1];
    return {coords,line};
  }

  adjust_shape_coords(coords) {
    for(var j=0; j < coords.length; ++j){
      var join = coords[2];
      //for shapes we do scale-only
      coords[j][0] *= this.refsx;
      coords[j][1] *= this.refsy;
      coords[j][3] *= this.refsx;
      coords[j][4] *= this.refsy;
      coords[j][5] *= this.refsx;
      coords[j][6] *= this.refsy;
    }
    return coords;
  }

  read_shape_coords(line) {
    var {coords} = this.read_coords_line(line);
    for(var j=0; j < coords.length; ++j){
      var join = coords[2];
      //for shapes we do scale-only
      coords[j][0] *= this.refsx;
      coords[j][1] *= this.refsy;
      coords[j][3] *= this.refsx;
      coords[j][4] *= this.refsy;
      coords[j][5] *= this.refsx;
      coords[j][6] *= this.refsy;
    }
    return coords;
  }

  read_action_coords(line) {
    var {coords} = this.read_coords_line(line);
    for(var j=0; j < coords.length; ++j){
      var join = coords[2];
      //we do scales and also moves
      coords[j][0] *= this.refsx;
      coords[j][1] *= this.refsy;
      coords[j][3] *= this.refsx;
      coords[j][4] *= this.refsy;
      coords[j][5] *= this.refsx;
      coords[j][6] *= this.refsy;

      /// note that points [3,4,5,6] are control
      /// points and are absolute, 
      /// we must move them too    
      coords[j][0] += this.refx;
      coords[j][1] += this.refy;
      coords[j][3] += this.refx;
      coords[j][4] += this.refy;
      coords[j][5] += this.refx;
      coords[j][6] += this.refy;

      /// point [7,8] are Rx,Ry for 'A', and needs to be scaled
      coords[j][7] *= this.refsx;
      coords[j][8] *= this.refsy;
    }
    return coords;
  }

  scalexy(x,y){
    x *= this.refsx;
    y *= this.refsy;
    x += this.refx;
    y += this.refy;
    return [x,y];
  }

  read_action_floats(line) {

    /// 5 5 0.5 0.5 \pi [1:3:10]
    var o = [];
    line = line.trimLeft();
    var m;
    var re_float = /^(.*?)(\,|\s|$)(.*)$/;
    var re_range_expr_3 = /^\[(.*?):(.*?):(.*?)\]\s*(.*)$/;
    var re_range_expr_2 = /^\[(.*?):(.*?)\]\s*(.*)$/;
    var re_range_expr_1 = /^\[(.*?)\]\s*(.*)$/;
    var v;
    while(line.length) {
      if((v=re_range_expr_3.exec(line))!==null){
        // [1:3:10]
        line = v[4];
        var base = parseFloat(v[1].trim());
        var step = parseFloat(v[2].trim());
        var limit = parseFloat(v[3].trim());
        step = Math.abs(step);
        var n = Math.floor((limit - base)/step);
        n = Math.abs(n);
        if(step >= this.MIN){   
          if(limit > base){
            for(var j=0; j <= n; ++j){
              o.push(parseFloat(+base + (j*step)));
            }
          }
          else if(limit < base){
            for (var j = 0; j <= n; ++j) {
              o.push(parseFloat(+base - (j*step)));
            }            
          }
          else if(limit == base){
            o.push(parseFloat(+base));
          }
        }
      }
      else if((v=re_range_expr_2.exec(line))!==null){
        // [1:10]
        line = v[3];
        var base = parseFloat(v[1].trim());
        var step = 1;
        var limit = parseFloat(v[2].trim());
        step = Math.abs(step);
        var n = Math.floor((limit - base)/step);
        n = Math.abs(n);
        if(step >= this.MIN){   
          if(limit > base){
            for(var j=0; j <= n; ++j){
              o.push(parseFloat(+base + (j*step)));
            }
          }
          else if(limit < base){
            for (var j = 0; j <= n; ++j) {
              o.push(parseFloat(+base - (j*step)));
            }            
          }
          else if(limit == base){
            o.push(parseFloat(+base));
          }
        }
      }
      else if((v=re_range_expr_1.exec(line))!==null){
        // [1,2,3]
        line = v[2];
        var items = v[1].split(',');
        items = items.map(x => x.trim());
        items.forEach((x,i,arr) => {
          o.push(parseFloat(x));
        })
      }
      else if((v=re_float.exec(line))!==null){
        // 12
        let val = v[1];
        let comma = v[2];
        line = v[3];
        val = parseFloat(val);
        o.push(val);
      }
      else{
        break;
      }
      line = line.trimLeft();
    }
    o = o.filter( x => Number.isFinite(x) );
    return o;
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
    ///***NOTE: i.e: (1,2)..(2,3) ~ cycle
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
      else if (join == 'cycle') {
        iscycle = 1;
        o.push(`cycle`);
        break;
      }
      else if (join == 'nan') {
        o.push(`()`);
      }
      else {
        o.push(`(${this.fix(x)},${this.fix(y)})`);
      }
    }
    return o.join(' ');
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
  line_replace_env(line,env){
    /// replace env variable before everything else
    let flag = 0;
    for (let env_name in env) {
      if (env.hasOwnProperty(env_name)) {
        let env_val = env[env_name];
        let re = new RegExp(`\\\\${env_name}\\b`, 'g');
        if(env_name==='@'){
          // for '\\@' matching, we dont need '\\b' because otherwise it wont work
          re = new RegExp(`\\\\@`,'g');
        }
        let line2 = line.replace(re, env_val);
        if(line2.localeCompare(line)!==0){
          flag=1;
          line = line2;
        }
      }
    }
    return [line,flag];
  }
  exec_line(line,env) {
    // NOTE: that that at this stage all env-variables have been replaced
    var coords = [];
    var v;
    var o = [];
    //
    // NOTE: path command
    //
    if ((v = this.re_path_command.exec(line)) !== null) {
      var symbol = v[1];
      line = v[2];
      ///NOTE: must call readCoordsLine() because it does not movept by refsx/refsy/refx/refy
      var {coords} = this.read_coords_line(line);
      ///NOTE: for "[a,b,c]"
      var re = /^\[(.*)\]$/;
      if((v=re.exec(symbol))!==null){
        var segs = v[1].split(',');
        var segs = segs.map(x => x.trim());
        var seg = '';
        for (var i = 0; i < segs.length; ++i) {
          var seg = segs[i];
          if (this.re_path_name.test(seg)) {
            var pt = this.point(coords, i);
            if(this.isvalidpt(pt)){
              this.my_path_map.set(seg,[pt]);
            } else {
              this.my_path_map.set(seg,[]);
            }
            o.push(this.do_comment(`***SAVED: ${seg}=${this.coords_to_string(this.my_path_map.get(seg))}`));
          }
        } 
        ///last variable gets all the remaining pts
        if(this.re_path_name.test(seg)){
          for (var j=i; j < coords.length; ++j) {
            var pt = this.point(coords, j);
            if(this.isvalidpt(pt)){
              this.my_path_map.get(seg).push(pt);
            }
          }
          o.push(this.do_comment(`***SAVED: ${seg}=${this.coords_to_string(this.my_path_map.get(seg))}`));
        }
      } else if (this.re_path_name.test(symbol)) {
        this.my_path_map.set(symbol, coords);
        o.push(this.do_comment(`***SAVED: ${symbol}=${this.coords_to_string(this.my_path_map.get(symbol))}`));
      } else {
        o.push(this.do_comment(`***ERROR: ${symbol} is not a valid variable`));
      }
    }
    ///
    /// config
    ///
    else if ((v = this.re_config_command.exec(line)) !== null) {
      var key = v[1];
      var val = v[2];
      this.config[key] = val;
    }
    /// 
    /// set/reset
    ///
    else if ((v = this.re_reset_command.exec(line)) !== null) {
      this.do_reset();
    }
    else if ((v = this.re_set_command.exec(line)) !== null) {
      var key = v[1];
      var val = v[2].trim();
      if (key === 'refxy') {
        var ss = this.string_to_array(val);
        ///
        /// set refxy (4,5) 
        /// set refxy center
        /// set refxy origin
        /// set refxy left:2 right:2 up:2 down:2
        ///
        ss.forEach((val,i,arr) => {

          if(val == 'origin'){
            this.refx = 0;
            this.refy = 0;
          }else if(val === 'center'){
            this.refx = this.viewport_width/2;
            this.refy = this.viewport_height/2;
          }else if(val === 'north'){
            this.refx = this.viewport_width/2;
            this.refy = this.viewport_height;
          }else if(val === 'south'){
            this.refx = this.viewport_width/2;
            this.refy = 0;
          }else if(val === 'west'){
            this.refx = 0;
            this.refy = this.viewport_height/2;
          }else if(val === 'east'){
            this.refx = this.viewport_width;
            this.refy = this.viewport_height/2;
          }else if(val === 'northwest'){
            this.refx = 0;
            this.refy = this.viewport_height;
          }else if(val === 'northeast'){
            this.refx = this.viewport_width;
            this.refy = this.viewport_height;
          }else if(val === 'southwest'){
            this.refx = 0;
            this.refy = 0;
          }else if(val === 'southeast'){
            this.refx = this.viewport_width;
            this.refy = 0;
          }else if(val.startsWith('left:')){
            let s = val.substr(5);
            let x = parseFloat(s);
            if(Number.isFinite(x)){
              this.refx -= x;
            }
          }else if(val.startsWith('right:')){
            let s = val.substr(6);
            let x = parseFloat(s);
            if(Number.isFinite(x)){
              this.refx += x;
            }
          }else if(val.startsWith('up:')){
            let s = val.substr(3);
            let y = parseFloat(s);
            if(Number.isFinite(y)){
              this.refy += y;
            }
          }else if(val.startsWith('down:')){
            let s = val.substr(5);
            let y = parseFloat(s);
            if(Number.isFinite(y)){
              this.refy -= y;
            }
          }else if(val.startsWith('x:')){
            let s = val.substr(2);
            let x = parseFloat(s);
            if(Number.isFinite(x)){
              this.refx = x;
            }
          }else if(val.startsWith('y:')){
            let s = val.substr(2);
            let y = parseFloat(s);
            if(Number.isFinite(y)){
              this.refy = y;
            }
          }else if(val.startsWith('save:')){
            let s = val.substr(5);
            let refx = this.refx;
            let refy = this.refy;
            let refsx = this.refsx;
            let refsy = this.refsy;
            this.my_ref_map.set(s,{refx,refy,refsx,refsy})
          }else if(val.startsWith('load:')){
            let s = val.substr(5);
            if(this.my_ref_map.has(s)){
              let {refx,refy,refsx,refsy} = this.my_ref_map.get(s);
              this.refx = refx;
              this.refy = refy;
              this.refsx = refsx;
              this.refsy = refsy;
            }
          }
        })
      }
      else if (key === 'refx') {
        ///
        /// /3 - from left
        /// 3/ - from right
        ///
        if (val[0] === '/') { /// '/3'
          val = val.slice(1);
          val = this.assert_float(val, this.def_refx, 0, this.viewport_width);
        } else if (val[val.length - 1] === '/') { /// '3/'
          val = val.slice(0, val.length - 1);
          val = this.viewport_width - this.assert_float(val, this.def_refx, 0, this.viewport_width);
        } else {
          val = this.assert_float(val, this.def_refx, -this.viewport_width, this.viewport_width);
        }
        this.refx = val;
      } ///such as 12.5
      else if (key === 'refy') {
        ///
        /// /3 - from top
        /// 3/ - from bottom
        ///
        ///if it is "/3" then it specifies a distance from the top side of the diagram
        if (val[0] === '/') { /// '/3'
          val = val.slice(1);
          val = this.viewport_height - this.assert_float(val, this.def_refy, 0, this.viewport_height);
        } else if (val[val.length - 1] === '/') { /// '3/'
          val = val.slice(0, val.length - 1);
          val = this.assert_float(val, this.def_refy, 0, this.viewport_height);
        } else {
          val = this.assert_float(val, this.def_refy, -this.viewport_height, this.viewport_height);
        }
        this.refy = val;
      } ///such as 12.5
      else if (key === 'refs') { 
        this.refsx = this.assert_float(val, this.def_refsx, this.MIN, this.MAX); 
        this.refsy = this.assert_float(val, this.ref_refsy, this.MIN, this.MAX);
      } 
      else if (key === 'refsx') {
        this.refsx = this.assert_float(val, this.def_refsx, this.MIN, this.MAX); 
      }
      else if (key === 'refsy' ) {
        this.refsy = this.assert_float(val, this.ref_refsy, this.MIN, this.MAX);
      }
      else if (key === 'id' ) {
        this.id = this.assert_int(val, this.ref_id, 0, this.MAX);
      }
    }
    ///NOTE: fn
    else if ((v = this.re_fn_command.exec(line)) !== null) {
      var f = {};
      f.name = v[1];
      f.args = v[2].split(',');
      f.expr = v[3];
      this.my_fn_map.set(f.name,f);
    }
    ///NOTE: source
    else if ((v = this.re_source_command.exec(line)) !== null) {
      let id = v[1];
      let source = this.translator.fetch_ss_from_ss_map(id);
      if(source.length) {
        this.exec_body(source,env);
      }
    }
    ///
    ///NOTE: *label* and *text* command
    ///
    else if ((v = this.re_label_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      o.push(this.do_label(opts,g,txt,coords));///own method
    }
    else if ((v = this.re_text_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      o.push(this.do_text(opts,g,txt,coords));///own method
    }
    ///
    ///NODE: the *debug* command
    ///
    else if ((v = this.re_debug_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      o.push(this.do_debug(line));///own method
    }
    ///
    ///NOTE: all *draw* commands, dealing directly with a path
    ///
    else if ((v = this.re_drawcontrolpoints_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      var txt = '';
      o.push(this.do_drawcontrolpoints(opts,g,txt,coords));//not own method
    }
    else if ((v = this.re_drawanglearc_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      o.push(this.do_drawanglearc(opts,g,txt,coords));//own method
    }
    else if ((v = this.re_drawlinesegcong_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      o.push(this.do_drawlinesegcong(opts,g,txt,coords));//own method
    }
    ///
    ///NOTE: rec
    ///
    else if ((v = this.re_rec_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      /// rec.a.draw {linecolor:gray} (0,0) (...)
      /// rec.a.fill {fillcolor:gray} &a &b ...
      /// rec.a.playback &newpos &newpos2 ...
      let [name,cmd,subcmd] = opts;
      if(name){
        if(this.my_rec_map.has(name)){
          var rec = this.my_rec_map.get(name);
        }else {
          var rec = [];
          this.my_rec_map.set(name,rec);
        }
        ///'rec' is an array
        if(cmd=='playback'){
          var [g,txt,line] = this.read_action_style_label(line);
          var coords = this.read_action_coords(line);///path is to be modified by refx/refy/refsx/refsy    
          o.push(this.to_playback_rec(rec,g,coords));//own method
        }else{
          var [g,txt,line] = this.read_action_style_label(line);
          var {coords} = this.read_coords_line(line);//path is not modified by current settings of refx/refy/refsx/refsy    
          let a = {};
          a.cmd = cmd;
          a.cmdopt = subcmd;
          a.p = coords;
          a.g = g;
          rec.push(a);   
        }
      }
    }
    ///
    ///NOTE: prodofprimes
    ///
    else if ((v = this.re_prodofprimes_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      var z = this.point(coords,0);
      var x = z[0];
      var y = z[1];
      o.push(this.to_prodofprimes(x,y,g,txt));//own method
    }
    ///
    ///NOTE: longdivws
    ///
    else if ((v = this.re_longdivws_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      var z = this.point(coords,0);
      var x = z[0];
      var y = z[1];
      o.push(this.to_longdivws(x,y,g,txt));//own method
    }
    ///
    ///NOTE: multiws
    ///
    else if ((v = this.re_multiws_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      var z = this.point(coords,0);
      var x = z[0];
      var y = z[1];
      o.push(this.to_multiws(x,y,g,txt));//own method
    }
    ///
    ///NOTE: draw, fill, stroke
    ///
    else if ((v = this.re_draw_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var [opt] = opts;
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      if(opt){
        ///is 'opt' a known path?
        let p = this.get_path_from_variable(opt);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'draw'));//own method
        }
      }else{
        ///draw a path
        o.push(this.p_draw(coords,g));              
      }
    }
    else if ((v = this.re_fill_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var [opt] = opts;
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      if(opt){
        ///is 'opt' a known path?
        let p = this.get_path_from_variable(opt);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'fill'));//own method
        }
      }else{
        o.push(this.p_fill(coords, g));
      }
    }
    else if ((v = this.re_stroke_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var [opt] = opts;
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      if(opt){
        ///is 'opt' a known path?
        let p = this.get_path_from_variable(opt);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'stroke'));//own method
        }
      }else{
        o.push(this.p_stroke(coords, g));
      }
    }
    else if ((v = this.re_arrow_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var [opt] = opts;
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      if(opt){
        ///is 'opt' a known path?
        let p = this.get_path_from_variable(opt);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'arrow'));//own method
        }
      }else{
        o.push(this.p_arrow(coords, g));
      }
    }
    else if ((v = this.re_revarrow_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var [opt] = opts;
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      if(opt){
        ///is 'opt' a known path?
        let p = this.get_path_from_variable(opt);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'revarrow'));//own method
        }
      }else{
        o.push(this.p_revarrow(coords, g));
      }
    }
    else if ((v = this.re_dblarrow_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var [opt] = opts;
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      if(opt){
        ///is 'opt' a known path?
        let p = this.get_path_from_variable(opt);
        if(p.length){
          o.push(this.to_shape_of_path(p,g,coords,'dblarrow'));//own method
        }
      }else{
        o.push(this.p_dblarrow(coords, g));
      }
    }
    ///
    ///NOTE: fill with clip-path in mind
    ///
    else if ((v = this.re_fillclipath_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      o.push(this.p_fillclipath(coords, g));
    }
    ///
    ///NOTE: node and edge
    ///
    else if ((v = this.re_node_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      o.push(this.do_node(opts,g,txt,coords));///own method
    }
    else if ((v = this.re_edge_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      o.push(this.do_edge(opts,g,txt,coords));///own method
    }
    ///
    ///NOTE: Following commands are *dot* commands
    ///
    else if ((v = this.re_dot_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      for (var i = 0; i < coords.length; i++) {
        var z0 = this.point(coords, i);
        if (!this.isvalidpt(z0)) continue;
        var x = z0[0];
        var y = z0[1];
        if(opts[0]=='hbar'){
          let barlength = this.to_barlength_float(g)/2;
          o.push(this.p_line(x-barlength,y,x+barlength,y,g));
        }else if(opts[0]=='vbar'){
          let barlength = this.to_barlength_float(g)/2;
          o.push(this.p_line(x,y-barlength,x,y+barlength,g));
        }else if(opts[0]=='lhbar'){
          let barlength = this.to_barlength_float(g)/2;
          o.push(this.p_line(x - barlength, y, x, y, g));
        }else if(opts[0]=='rhbar'){
          let barlength = this.to_barlength_float(g)/2;
          o.push(this.p_line(x, y, x + barlength, y, g));
        }else if(opts[0]=='tvbar'){
          let barlength = this.to_barlength_float(g)/2;
          o.push(this.p_line(x, y, x, y + barlength, g));
        }else if(opts[0]=='bvbar'){
          let barlength = this.to_barlength_float(g)/2;
          o.push(this.p_line(x, y - barlength, x, y, g));
        }else if(opts[0]=='square'){
          o.push(this.p_dot_square(x,y,g));
        }else{
          o.push(this.p_dot_circle(x,y,g));
        }
      }
    }
    ///
    ///NOTE: The box command   
    ///
    else if ((v = this.re_box_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var coords = this.read_action_coords(line);
      o.push(this.do_box(opts,g,txt,coords));///own method
    }
    ///
    ///NOTE: the cartesian command
    ///
    else if ((v = this.re_cartesian_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var floats = this.read_action_floats(line);
      o.push(this.do_cartesian(opts,g,txt,floats));///own method
    }
    ///
    ///NOTE: the barchart command
    ///
    else if ((v = this.re_barchart_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var floats = this.read_action_floats(line);
      o.push(this.do_barchart(opts,g,txt,floats));///own method
    }
    ///
    ///NOTE: the lego command
    ///
    else if ((v = this.re_lego_command.exec(line)) !== null) {
      var opts = this.string_to_command_opts(v[1]);
      var line = v[2];
      var [g,txt,line] = this.read_action_style_label(line);
      var floats = this.read_action_floats(line);
      o.push(this.do_lego(opts,g,txt,floats));///own method
    }
    return o.join('\n');
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

  /// extract the expression of a+1,b+1
  /// until we have just gone past the comma, in which
  /// case the comma will be discarded and the value of the expression 'a+1'
  /// is caluclated based on the variable stored with the 'g' 
  extract_next_expr(s,g,z=0){
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

      /// a scalar is defined as a function, a comma, a left 
      /// parenthesis, a right parenthesis, a plus, minus, 
      /// multiplication, or division sign 
      var [a,s,phrase] = this.extract_next_scalar(s,g,z+1);
      ///'a' is string such as '*', '+', ')', or ','
      if (typeof a === 'number') {
        /// assume a is 'arg2 and run the operator
        var arg2 = a;
        arg1 = this.exec_operator(op,arg1,arg2);
        /// it is important to clear op here
        op = ''; 
      }else{
        /// otherwise assume a is an operator
        op = a; 
      } 
    }
    var phrase = s0.substr(0,s0.length-s.length);
    //console.log('extract_next_expr', arg1, s, phrase);

    return [arg1,s,phrase];
  }

  extract_next_scalar(s,g,z=0) {
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
    /// scalar path point: '&pt[0].x', or '&pt[0].y'
    if ((v=this.re_scalar_path.exec(s))!==null) {
      let pathvar = v[1];
      let k = v[2];
      let x_y = v[3];
      s = v[4];
      var num = 0;
      let coords = this.get_path_from_variable(pathvar);
      if(coords.length){
        let pt = this.point(coords,k);
        if(x_y == 'x'){
          num = pt[0];
        }else if(x_y == 'y'){
          num = pt[1];
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
    /// as 'x', 'y', 'x1', 'xx1', etc. And we also need
    /// to check to see if it is an operator, such as '+', '-', 
    /// '*', '/', etc.
    if((v=this.re_var_name.exec(s))!==null){
      var var_name = v[1];
      s = v[2];
      if(g && g.hasOwnProperty(var_name)){
        var num = g[var_name];
      }else{
        var num = NaN;
      }
      var phrase = s0.substr(0,s0.length - s.length);
      //console.log('extract_next_scalar', 'var_symbol', num, s, g, phrase);
      return [num,s,phrase];
    }
    /// if this is a float
    if((v=this.re_float_number.exec(s))!==null){
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
      case 'PI':
        return Math.PI;
      case 'E':
        return Math.E;
      default:
        break;
    }
    if (this.my_fn_map.has(func_name)) {
      var f = this.my_fn_map.get(func_name);
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

  do_barchart(opts,g,txt,floats) {
    var o = [];
    var id = 0;
    var dx = this.get_float_prop(g,'dx',0);
    var dy = this.get_float_prop(g,'dy',0);
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
    var [opt,subopt] = opts;
    switch( opt ) {
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
        var mypath = `((${x1},${y1}) ~ (${x2},${y1}) ~ (${x2},${y2}) ~ (${x1},${y2}) ~ cycle`;
        var coords = this.read_action_coords(mypath);
        o.push(this.p_draw(coords,g));
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
              [x,y] = this.scalexy(x,y);
              o.push(this.p_rect(x,y,w,h,g));
            }
          }
        }
        break;

      case 'ytick'://BARCHART
        var dx = this.get_float_prop(g,'dx',0);
        var dy = this.get_float_prop(g,'dy',0);
        for( var j=0; j < floats.length; j+=1 ) {
          var num = floats[j];
          if (Number.isFinite(num)){
            var x = A.xorigin;
            var y = A.yorigin + num*A.ywidth/A.yrange;
            [x,y] = this.scalexy(x,y);
            if(Number.isFinite(x)&&Number.isFinite(y)){
              o.push(this.p_label(x+dx,y+dy,`${num}`,'lft',g));
              o.push(this.p_hbar(x,y,g));
            }
          }
        }
        break;

      case 'xlabel'://BARCHART
        for( var j=0,i=0; j < floats.length; j+=1,i++ ) {
          var num = floats[j];
          if (Number.isFinite(num)){
            var x = A.xorigin + num*A.xwidth/A.xrange
            var y = A.yorigin;
            [x,y] = this.scalexy(x,y);
            if(Number.isFinite(x)&&Number.isFinite(y)){
              var label = this.fetch_label_at(txt,j);
              o.push(this.p_label(x+dx,y+dy,label,'bot',g));
            }
          }
        }
        break;

      default:
        break;
    }
    
    return o.join('\n');
  }

  do_cartesian(opts,g,txt,floats) {
    var o = [];
    var id = 0;
    if (!this.my_cartesian[id]) {
      this.my_cartesian[id] = {};
      var A = this.my_cartesian[id];
      A.xorigin = 0;
      A.yorigin = 0;
      A.grid = 1;
    }
    var A = this.my_cartesian[id];
    var [opt,subopt] = opts;
    var dx = this.get_float_prop(g,'dx',0);
    var dy = this.get_float_prop(g,'dy',0);
    switch( opt ) {
      case 'setup'://CARTESIAN
        A.xorigin = this.assert_float(floats[0],A.xorigin);    
        A.yorigin = this.assert_float(floats[1],A.yorigin);    
        A.grid = this.assert_float(floats[2],A.grid);  
        break;

      case 'grid'://CARTESIAN
        var x1 = this.assert_float(floats[0],0);
        var y1 = this.assert_float(floats[1],0);
        var x2 = this.assert_float(floats[2],0);
        var y2 = this.assert_float(floats[3],0);
        var inc_x = this.get_float_prop(g,'xstep',1);
        var inc_y = this.get_float_prop(g,'ystep',1);
        for(var j = 0; j < this.MAX; j++){
          var y = y1 + inc_y*j;
          if(y > y2) break;
          o.push(this.p_line(x1/A.grid+A.xorigin,y/A.grid+A.yorigin,x2/A.grid+A.xorigin,y/A.grid+A.yorigin,g));
        }
        for(var i = 0; i < this.MAX; i++){
          var x = x1 + inc_x*i;
          if(x > x2) break;
          o.push(this.p_line(x/A.grid+A.xorigin,y1/A.grid+A.yorigin,x/A.grid+A.xorigin,y2/A.grid+A.yorigin,g));
        }
        break;

      case 'xaxis'://CARTESIAN
        var x1 = this.assert_float(floats[0],0);
        var x2 = this.assert_float(floats[1],0);
        x1 /= A.grid;
        x2 /= A.grid;
        x1 += A.xorigin;
        x2 += A.xorigin;
        var y1 = A.yorigin;
        var y2 = A.yorigin;
        var mypath = `(${x1},${y1}) ~ (${x2},${y2})`;
        var coords = this.read_action_coords(mypath);
        o.push(this.p_dblarrow(coords,g));
        break;

      case 'yaxis'://CARTESIAN
        var y1 = this.assert_float(floats[0],0);
        var y2 = this.assert_float(floats[1],0);
        y1 /= A.grid;
        y2 /= A.grid;
        y1 += A.yorigin;
        y2 += A.yorigin;
        var x1 = A.xorigin;
        var x2 = A.xorigin;
        var mypath = `(${x1},${y1}) ~ (${x2},${y2})`;
        var coords = this.read_action_coords(mypath);
        o.push(this.p_dblarrow(coords,g));
        break;

      case 'xtick'://CARTESIAN
        for (var j=0; j < floats.length; ++j) {
          var num = floats[j];
          var x = A.xorigin + num/A.grid;
          var y = A.yorigin;
          [x,y] = this.scalexy(x,y);
          o.push(this.p_tvbar(x,y,g));
          if(Number.isFinite(x)&&Number.isFinite(y)){
            o.push(this.p_label(x+dx,y+dy,`${num}`,'bot',g));
          }
        }
        break;

      case 'ytick'://CARTESIAN
        for (var j=0; j < floats.length; ++j) {
          var num = floats[j];
          var x = A.xorigin;
          var y = A.yorigin + num/A.grid;
          [x,y] = this.scalexy(x,y);
          o.push(this.p_rhbar(x,y,g));
          if(Number.isFinite(x)&&Number.isFinite(y)){
            o.push(this.p_label(x+dx,y+dy,`${num}`,'lft',g));
          }
        }
        break;

      case 'ellipse'://CARTESIAN
        /// x,y,rx,ry,angle
        var x     = this.assert_float(floats[0],0);
        var y     = this.assert_float(floats[1],0);
        var Rx    = this.assert_float(floats[2],2);
        var Ry    = this.assert_float(floats[3],1);
        var angle = this.assert_float(floats[4],0);
        Rx /= A.grid;
        Ry /= A.grid;
        x /= A.grid;
        y /= A.grid;
        x += A.xorigin;
        y += A.yorigin;
        [x,y] = this.scalexy(x,y);
        o.push(this.p_ellipse(x,y,Rx,Ry,angle,g));
        break;

      case 'yplot'://CARTESIAN
        var f = g.f;
        if(g.plot=='line'){
          ///using curved lines
          let mypts = [];
          let x0 = NaN;
          let y0 = NaN;
          for(var x of floats){
            var y = this.exec_scalar_func(f,[x]);
            x /= A.grid;
            y /= A.grid;
            x += A.xorigin;
            y += A.yorigin;
            [x,y] = this.scalexy(x,y);
            if(Number.isFinite(x)&&Number.isFinite(y)&&Number.isFinite(x0)&&Number.isFinite(y0)){
              //mypts.push(`(${this.fix(x)},${this.fix(y)})`);
              o.push(this.p_line(x0,y0,x,y,g))
            }
            x0 = x;
            y0 = y;
          }
          // mypts = mypts.join('..');
          // let {coords} = this.read_coords_line(mypts);
          // o.push(this.p_stroke(coords,g));
        }else{
          ///default plot style is dot
          for(var x of floats){
            var y = this.exec_scalar_func(f,[x]);
            x /= A.grid;
            y /= A.grid;
            x += A.xorigin;
            y += A.yorigin;
            [x,y] = this.scalexy(x,y);
            if(Number.isFinite(x)&&Number.isFinite(y)){
              o.push(this.p_dot_circle(x,y,g));
            }
          }
        }
        break;

      case 'xplot'://CARTESIAN
        var f = g.f;
        for (var y of floats) {
          var x = this.exec_scalar_func(f, [y]);
          x /= A.grid;
          y /= A.grid;
          x += A.xorigin;
          y += A.yorigin;
          [x,y] = this.scalexy(x,y);
          if (Number.isFinite(x) && Number.isFinite(y)) {
            o.push(this.p_dot_circle(x, y, g));
          }
        }
        break;

      case 'dot'://CARTESIAN
        for( var j=0; j < floats.length; j+=2 ) {
          var x = floats[j];
          var y = floats[j+1];
          x /= A.grid;
          y /= A.grid;
          x += A.xorigin;
          y += A.yorigin;
          [x,y] = this.scalexy(x,y);
          if(Number.isFinite(x)&&Number.isFinite(y)){
            o.push(this.p_dot_circle(x,y,g));
          }
        }
        break;

      case 'line'://CARTESIAN
        var coords = [];
        for( var j=0; j < floats.length; j+=2 ) {
          var x = floats[j];
          var y = floats[j+1];
          x /= A.grid;
          y /= A.grid;
          x += A.xorigin;
          y += A.yorigin;
          [x,y] = this.scalexy(x,y);
          coords.push([x,y,'L']);
        }
        o.push(this.p_stroke(coords,g));
        break;

      case 'label'://CARTESIAN
        for( var j=0,i=0; j < floats.length; j+=2,i++ ) {
          var x = floats[j];
          var y = floats[j+1];
          x /= A.grid;
          y /= A.grid;
          x += A.xorigin;
          y += A.yorigin;
          [x,y] = this.scalexy(x,y);
          if(Number.isFinite(x)&&Number.isFinite(y)){
            var ta = subopt||'';
            o.push(this.p_label(x+dx,y+dy,txt,ta,g));
          }
        }
        break;

      case 'arc'://CARTESIAN
        /// cartesian arc x y r start_a span_a
        var x     = this.assert_float(floats[0],0);
        var y     = this.assert_float(floats[1],0);
        var r     = this.assert_float(floats[2],1);
        var start_a = this.assert_float(floats[3],0);
        var span_a  = this.assert_float(floats[4],45);
        var x1 = x + r*Math.cos(start_a/180*Math.PI);
        var y1 = y + r*Math.sin(start_a/180*Math.PI);
        var x2 = x + r*Math.cos((start_a+span_a)/180*Math.PI);
        var y2 = y + r*Math.sin((start_a+span_a)/180*Math.PI);
        x1 /= A.grid;
        y1 /= A.grid;
        x2 /= A.grid;
        y2 /= A.grid;
        x1 += A.xorigin;
        y1 += A.yorigin;
        x2 += A.xorigin;
        y2 += A.yorigin;
        [x1,y1] = this.scalexy(x1,y1);
        [x2,y2] = this.scalexy(x2,y2);
        var Rx = r * this.refsx;
        var Ry = r * this.refsy;
        var bigarcflag = (span_a > 180)?1:0;
        o.push(this.p_arc(x1,y1,x2,y2,Rx,Ry,bigarcflag,g));
        break;

      default:
        break;
    }
    
    return o.join('\n');
  }

  do_lego(opts,g,txt,floats) {
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
    var [opt,subopt] = opts;
    switch( opt ) {
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
        if(subopt=='all'){
          for(var z=1; z <= A.max_z; z++) {
            for(var x=1; x <= A.max_x; x++) {
              for(var y=1; y <= A.max_y; y++) {
                var key = `${x}/${y}/${z}`;
                A.all.add(key);
              }
            }
          }
        }
        else if(subopt=='z'){
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
        else if(subopt=='xyz'){
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
        if(subopt=='xy'){
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
        else if(subopt=='yz'){
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
        else if(subopt=='zx'){
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
        else if(subopt=='xyz'){
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
                  var q = this.offset_and_scale_coords(q,this.refx,this.refy,this.refsx,this.refsy,0);
                  var q = this.offset_and_scale_coords(q,offsetx,offsety,1,1,0);
                  g.user = 'lighter'
                  o.push(this.p_draw(q,g));
                }
                if(1){
                  var q = A.q2;
                  var q = this.offset_and_scale_coords(q,this.refx,this.refy,this.refsx,this.refsy,0);
                  var q = this.offset_and_scale_coords(q,offsetx,offsety,1,1,0);
                  g.user = '';
                  o.push(this.p_draw(q,g));

                }
                if(1){
                  var q = A.q3;
                  var q = this.offset_and_scale_coords(q,this.refx,this.refy,this.refsx,this.refsy,0);
                  var q = this.offset_and_scale_coords(q,offsetx,offsety,1,1,0);
                  g.user = 'darker';
                  o.push(this.p_draw(q,g));

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
        A.q1 = [[0,wh],[ww,wh,'L'],[ww-wx,wh-wy,'L'],[0-wx,wh-wy,'L'],[0,0,'cycle']];//top
        A.q2 = [[ww,wh],[ww,0,'L'],[ww-wx,0-wy,'L'],[ww-wx,wh-wy,'L'],[0,0,'cycle']];//side
        A.q3 = [[0-wx,0-wy],[0-wx,wh-wy,'L'],[ww-wx,wh-wy,'L'],[ww-wx,0-wy,'L'],[0,0,'cycle']];//front
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
                  var q = this.offset_and_scale_coords(q,this.refx,this.refy,this.refsx,this.refsy,0);
                  var q = this.offset_and_scale_coords(q,offsetx,offsety,1,1,0);
                  g.user = ''
                  o.push(this.p_draw(q,g));
                }
                if(1){
                  //side
                  var q = A.q2;
                  var q = this.offset_and_scale_coords(q,this.refx,this.refy,this.refsx,this.refsy,0);
                  var q = this.offset_and_scale_coords(q,offsetx,offsety,1,1,0);
                  g.user = 'darker'
                  o.push(this.p_draw(q,g));
                }
                if(1){
                  //side
                  var q = A.q3;
                  var q = this.offset_and_scale_coords(q,this.refx,this.refy,this.refsx,this.refsy,0);
                  var q = this.offset_and_scale_coords(q,offsetx,offsety,1,1,0);
                  g.user = 'lighter'
                  o.push(this.p_draw(q,g));
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

  do_label(opts,g,txt,coords){
    var ta = opts[0]||'';
    var o = [];
    var dx = this.get_float_prop(g,'dx',0);
    var dy = this.get_float_prop(g,'dy',0);
    for (var i = 0; i < coords.length; ++i){
      var pt = this.point(coords, i);
      if (!this.isvalidpt(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      var label = this.fetch_label_at(txt,i);
      if(g.replace){
        var label = this.replace_label(label,g.replace);
      }
      o.push(this.p_label(x+dx,y+dy,label,ta,g));
    }
    return o.join('\n');
  }
  do_text(opts,g,txt,coords){
    var ta = opts[0]||'';
    var o = [];
    var dx = this.get_float_prop(g,'dx',0);
    var dy = this.get_float_prop(g,'dy',0);
    for (var i = 0; i < coords.length; ++i){
      var pt = this.point(coords, i);
      if (!this.isvalidpt(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      o.push(this.p_text(x+dx,y+dy,txt,ta,g));
    }
    return o.join('\n');
  }
  to_playback_rec(rec,g,coords){
    var o = [];
    for (var i = 0; i < coords.length; i++) {
      var z0 = this.point(coords, i);
      if(!this.isvalidpt(z0)) continue;
      var offsetx = z0[0];
      var offsety = z0[1];
      var scaleX = this.get_float_prop(g,'scaleX',1);
      var scaleY = this.get_float_prop(g,'scaleY',1);
      var rotate = this.get_float_prop(g,'rotate',0);
      for(let a of rec){
        let g = a.g;
        let p = a.p;
        let q = this.offset_and_scale_coords(p,offsetx,offsety,scaleX,scaleY,rotate);
        let operation = a.cmd;
        if(operation=='fill'){
          o.push(this.p_fill(q,g));
        }else if(operation=='stroke'){
          o.push(this.p_stroke(q,g));
        }else{
          o.push(this.p_draw(q,g));
        }
      }
    }
    return o.join('\n');
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
      var scaleX = this.get_float_prop(g,'scaleX',1);
      var scaleY = this.get_float_prop(g,'scaleY',1);
      var rotate = this.get_float_prop(g,'rotate',0);
      var q = this.offset_and_scale_coords(p,offsetx,offsety,scaleX,scaleY,rotate);
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

  do_drawanglearc(opts,g,txt,coords){   
    var [opt] = opts;
    var o = [];
    var r = this.get_float_prop(g,'r',0.75,0,this.MAX);
    var shift = this.get_float_prop(g,'shift',1);
    var dx = this.get_float_prop(g,'dx',0);
    var dy = this.get_float_prop(g,'dy',0);
    for(var j=0; j < coords.length-2; ++j){
      // 'z0' is the vertex, 'z1' is the start, and 'z2' is the stop 
      var z1 = this.point(coords, j+0);
      var z0 = this.point(coords, j+1);
      var z2 = this.point(coords, j+2);
      //var label = ss[j];
      var label = this.fetch_label_at(txt,j);
      // check for validity of all three points
      if(!this.isvalidpt(z0)) continue;
      if(!this.isvalidpt(z1)) continue;
      if(!this.isvalidpt(z2)) continue;
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
      var bigarcflag = (angledelta > 180) ? 1 : 0;
      var x1 = x0 + r*Math.cos(ang1 / 180 * Math.PI);
      var y1 = y0 + r*Math.sin(ang1 / 180 * Math.PI);
      var x2 = x0 + r*Math.cos(ang2 / 180 * Math.PI);
      var y2 = y0 + r*Math.sin(ang2 / 180 * Math.PI);
      var xc = x0 + r*Math.cos((ang1+ang2)/2/180*Math.PI)*1.414;
      var yc = y0 + r*Math.sin((ang1+ang2)/2/180*Math.PI)*1.414;
      if (opt==='sq') {
        var mycoords = [];
        mycoords.push([x1,y1]);
        mycoords.push([xc,yc,'L']);
        mycoords.push([x2,y2,'L']);
        o.push(this.p_stroke(mycoords,g));
        r = r*1.414;
      } else {
        if(x1==x2 && y1==y2){
          o.push(this.p_circle(x0,y0,r,g));
        }else{
          o.push(this.p_arc(x1,y1,x2,y2,r,r,bigarcflag,g));
        }
      }
      if (label) {
        var ang = ang1+angledelta/2;
        if (ang > 360) {
          ang -= 360;
        }
        var labelx = x0 + (r+shift) * Math.cos(ang / 180 * Math.PI);
        var labely = y0 + (r+shift) * Math.sin(ang / 180 * Math.PI);
        o.push(this.p_label(labelx+dx,labely+dy,label,'ctr',g));
      }
    }
    return o.join('\n');
  }

  do_drawlinesegcong(opts,g,txt,coords){
    var o = [];
    let magni = this.to_barlength_float(g)/2;
    let gap = this.get_float_prop(g,'gap',0.15);
    let bartype = this.get_string_prop(g,'bartype');
    for(var j=0; j < coords.length-1; ++j){
      var z0 = this.point(coords, j+0);
      var z1 = this.point(coords, j+1);
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

  do_node(opts,g,txt,coords){
    var o = [];
    var r = this.get_float_prop(g,"r",1);
    var showid = this.get_int_prop(g,"showid",0);
    var dx = this.get_float_prop(g,'dx',0);
    var dy = this.get_float_prop(g,'dy',0);
    coords.forEach((pt,i,arr) => {
      if(!this.isvalidpt(pt)) return;
      var v = {pt,r,txt}
      var name = opts[i]||'';
      o.push(this.p_circle(pt[0],pt[1],r,g));
      if(txt){
        o.push(this.p_label(pt[0]+dx,pt[1]+dy,txt,'ctr',g));
      }else if(showid && name){
        o.push(this.p_label(pt[0]+dx,pt[1]+dy,name,'ctr',g));
      }
      if(name=='_'){
        ///NOTE:auto-assigning of ID
        var id = this.assert_int(this.id,0,0,this.MAX);
        this.id = ++id;
        name = `${id}`
        this.my_node_map.set(name,v);
      }else if(name){
        this.my_node_map.set(name,v);
      }
    });
    ///
    ///NOTE:if no coords is specified, then reuse the old position
    ///
    if(coords.length==0){
      for(var name of opts){
        if(name && this.my_node_map.has(name)){
          var v = this.my_node_map.get(name);
          var {pt,r} = v;
          if(g.dot){
            o.push(this.p_dot_circle(pt[0],pt[1],g));
          }else{
            o.push(this.p_circle(pt[0],pt[1],r,g));
            if(txt){
              o.push(this.p_label(pt[0]+dx,pt[1]+dy,txt,'ctr',g));
            }else if(showid && name){
              o.push(this.p_label(pt[0]+dx,pt[1]+dy,name,'ctr',g));
            }
          }
        }
      }
    }
    return o.join('\n');
  }

  do_edge(opts,g,txt,coords){
    var shift = this.get_float_prop(g,'shift',0);
    var abr = this.get_float_prop(g,'abr',0);
    var span = this.get_float_prop(g,'span',45);
    var protrude = this.get_float_prop(g,'protrude',1);
    var dx = this.get_float_prop(g,'dx',0);
    var dy = this.get_float_prop(g,'dy',0);
    var o = [];
    for(let i=1; i < opts.length; ++i){
      var name1 = opts[i-1];
      var name2 = opts[i];
      if(this.my_node_map.has(name1)&&this.my_node_map.has(name2)){
        var node1 = this.my_node_map.get(name1);
        var node2 = this.my_node_map.get(name2);
        if(name1==name2){
          ///a looped edge from itself-to-itself
          let [p0,p1,p2,p3] = this.abr_to_cbezier_loop(abr,span,protrude, node1.pt[0],node1.pt[1],node1.r);
          o.push(this.p_cbezier_line(p0[0],p0[1], p1[0],p1[1], p2[0],p2[1], p3[0],p3[1], g));
          //figure out where to draw label
          let mylabelx = node1.pt[0] + Math.cos(abr/180*Math.PI)*(node1.r+protrude+shift);
          let mylabely = node1.pt[1] + Math.sin(abr/180*Math.PI)*(node1.r+protrude+shift);
          o.push(this.p_label(mylabelx+dx,mylabely+dy,txt,'ctr',g));
        }else{
          //draw straight line or Bezier line between two different nodes
          let [p0,p1,p2] = this.abr_to_qbezier(abr, node1.pt[0],node1.pt[1],node1.r, node2.pt[0],node2.pt[1],node2.r);        
          if(abr){
            o.push(this.p_qbezier_line(p0[0],p0[1], p1[0],p1[1], p2[0],p2[1],g));
          }else{
            o.push(this.p_line(p0[0],p0[1],p2[0],p2[1],g));
          }
          //draw label
          p1[0] = (p0[0] + p2[0])*0.5;
          p1[1] = (p0[1] + p2[1])*0.5;
          if(shift){
            p1 = this.lateral_shift_pt(shift, p0[0],p0[1], p1[0],p1[1], p2[0],p2[1]);
            o.push(this.p_label(p1[0]+dx,p1[1]+dy,txt,'ctr',g));
          }else{
            o.push(this.p_label(p1[0]+dx,p1[1]+dy,txt,'ctr',g));
          }
        }
      }
    }
    return o.join('\n');
  }

  lateral_shift_pt(shift, x0,y0, x1,y1, x2,y2){
    var dx = x1 - x0;
    var dy = y1 - y0;
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
    Dx *= shift;
    Dy *= shift;
    x1 += Dx;
    y1 += Dy;
    return [x1,y1];
  }

  abr_to_cbezier_loop(abr,span,protrude,x1,y1,r1){
    var p0 = [0,0];
    var p1 = [0,0];
    var p2 = [0,0];
    var p3 = [0,0];
    var r2 = r1+protrude;
    p1[0] = x1 + r2*Math.cos((abr-span)/180*Math.PI);
    p1[1] = y1 + r2*Math.sin((abr-span)/180*Math.PI);
    p2[0] = x1 + r2*Math.cos((abr+span)/180*Math.PI);
    p2[1] = y1 + r2*Math.sin((abr+span)/180*Math.PI);
    p0[0] = x1 + r1*Math.cos((abr-span)/180*Math.PI);
    p0[1] = y1 + r1*Math.sin((abr-span)/180*Math.PI);
    p3[0] = x1 + r1*Math.cos((abr+span)/180*Math.PI);
    p3[1] = y1 + r1*Math.sin((abr+span)/180*Math.PI);
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
    if(abr > 0){
      var U = (x1+x2)/2 + u;
      var V = (y1+y2)/2 + v;
    }else{
      var U = (x1+x2)/2 - u;
      var V = (y1+y2)/2 - v;
    }
    var p1 = [U,V];
    //re-compute p0 starting point 
    var ang1 = Math.atan2(dy,dx);
    ang1 += abr;
    p0[0] += r1 * Math.cos(ang1);
    p0[1] += r1 * Math.sin(ang1);
    //re-compute p2 starting point
    var ang2 = Math.PI + Math.atan2(dy,dx);
    ang2 -= abr;
    p2[0] += r2 * Math.cos(ang2);
    p2[1] += r2 * Math.sin(ang2);
    //console.log('dir=',dir,'ang1=',ang1,'ang2=',ang2);
    //console.log('qbezier=',p0,p1,p2);
    return [p0,p1,p2];
  }

  do_box(opts,g,txt,coords){
    var o = [];
    var boxtype = this.get_string_prop(g,"boxtype","");
    var dx = this.get_float_prop(g,"dx",0);
    var dy = this.get_float_prop(g,"dy",0);
    var w = this.get_float_prop(g,"w",2);
    var h = this.get_float_prop(g,"h",2);
    for (var j = 0; j < coords.length; j++) {
      var pt = this.point(coords, j);
      if (!this.isvalidpt(pt)) continue;
      var x = pt[0];
      var y = pt[1];
      if(boxtype=='none'){
        ///dont draw box
      }else if(boxtype=='hexgon'){
        o.push(this.p_hexgon(x,y,w,h,g));
      }else if(boxtype=='triangle'){
        o.push(this.p_triangle(x,y,w,h,g));
      }else{
        ///in the future this would be for different kind of
        ///boxes
        o.push(this.p_rect(x,y,w,h,g));
      }
      if (txt) {
        var ctr_x = x + w/2;
        var ctr_y = y + h/2;
        var label = this.fetch_label_at(txt,j);
        o.push(this.p_label(ctr_x+dx,ctr_y+dy,label,'ctr',g));
      }
    }
    return o.join('\n');
  }
  fetch_label_at(txt,n) {
    const del='\\\\';
    var start_i=0;
    var i = -1;
    var i=txt.indexOf(del,start_i);
    //console.log('i=',i);
    for(let j=0; j<n; ++j){
      if(i >= 0){
        start_i = i + del.length;
        //console.log('start_i=',start_i);
      } else {
        break;
      }
      i = txt.indexOf(del,start_i);
      //console.log('i=',i);
    }
    //console.log('start_i=',start_i,'i=',i);
    if(i<0){
      return txt.slice(start_i).trim();
    }else{
      return txt.slice(start_i,i).trim();
    }
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
  string_to_pathfunc_args(s){
    var v;
    var d = [];
    var user = {};
    s = s.trimLeft();
    while(s.length){
      var {coords,line} = this.read_coords_line(s);
      if(coords.length){
        d.push({coords});
        s = line;
        if (s.charAt(0) == ',') {
          s = s.slice(1).trimLeft();
          continue;
        }
        break;
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
            if(d.length > this.MAX){
              break;
            }
          }
        }
        else if (limit < base) {
          for (var j = 0; j <= n; ++j) {
            d.push(parseFloat(+base - (j * step)));
            if(d.length > this.MAX){
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
  to_opacity_float(g){
    return this.get_float_prop(g,'opacity',1,0,1);
  }
  to_angle_float(g){
    return this.get_float_prop(g,'angle',0,0,90);
  }
  to_shade_string(g){
    return this.get_string_prop(g,'shade','');
  }
  to_linedashed_int(g){
    return this.get_int_prop(g,'linedashed',0);
  }
  to_linesize_float(g){
    return this.get_float_prop(g,'linesize',0,0,this.MAX);
  }  
  to_linecolor_string(g){
    return this.get_string_prop(g,'linecolor','');
  }
  to_fillcolor_string(g){
    return this.get_string_prop(g,'fillcolor','');
  }
  to_linecap_string(g){
    return this.get_string_prop(g,'linecap','');
  }
  to_linejoin_string(g){
    return this.get_string_prop(g,'linejoin','');
  }
  to_barlength_float(g) {
    return this.get_float_prop(g,'barlength',this.barlength,0,this.MAX);
  }
  to_dotsize_float(g){
    return this.get_float_prop(g,'dotsize',this.dotsize,0,this.MAX);
  }
  to_fontsize_float(g){
    return this.get_float_prop(g,'fontsize',this.fontsize,0,this.MAX);
  }
  to_fontcolor_string(g){
    return this.get_string_prop(g,'fontcolor','');
  }
  to_shadecolor_string(g){
    return this.get_string_prop(g,'shadecolor','');
  }
  to_math_int(g){
    return this.get_int_prop(g,'math',0);
  }
  to_fontstyle_string(g){
    return this.get_string_prop(g,'fontstyle','');
  }
  to_fontfamily_string(g){
    return this.get_string_prop(g,'fontfamily','');
  }
  name_to_path_string(str){
    switch(str){
      case 'rect':
        var mypath = `(0,0) ~ (1,0) ~ (1,1) ~ (0,1) ~ cycle;`;
        break;
    
      case 'rhombus': 
        var mypath = `(0,0.5) ~ (0.5,1) ~ (1,0.5) ~ (0.5,0) ~ cycle`;
        break;

      case 'trapezoid': 
        var mypath = `(0,0) ~ (1,0) ~ (0.6,1) ~ (0.2,1) ~ cycle;`;
        break;

      case 'parallelgram':
        var sl = 0.3;
        var sw = (1-sl);
        var mypath = `(0,0) [h:${sw}] [l:${sl},1] [h:${-sw}] [l:-${sl},-1] ~ cycle`;
        break;

      case 'apple': 
        var mypath = '(.5,.7)..(.25,.85)..(0,.4)..(.5,0)..(1.0,.5)..(.8,.9)..(.5,.7) ~ (.5,.7)..(.6,1.0)..(.3,1.1) ~ (.3,1.1)..(.4,1.0)..(.5,.7) ~ cycle';
        break;

      case 'rrect': 
        var mypath = `(0.2,0) [h:0.6] [c:0.2,0,0.2,0,0.2,0.2] [v:0.6] [c:0,0.2,0,0.2,-0.2,0.2] [h:-0.6] [c:-0.2,0,-0.2,0,-0.2,-0.2] [v:-0.6] [c:0,-0.2,0,-0.2,0.2,-0.2] ~ cycle`;
        break;

      case 'basket': 
        var mypath = '(0.3,0) ~ (2.6,0)..(2.8,1)..(3,2) ~ (3,2)..(1.5,1.5)..(0,2) ~ (0,2)..(0.2,1)..(0.3,0) ~ cycle';
        break;

      case 'crate': 
        var mypath = '(4,2) ~ (0,2) ~ (0,0) ~ (4,0) ~ (4,2) ~ (0,2) ~ (1,3) ~ (5,3) ~ (4,2) ~ (4,0) ~ (5,1) ~ (5,3) ~ (4,2) ~ cycle';
        break;

      case 'tree':
        var mypath = '(0,0) ~ (-0.4,0) ~ (-0.2,0.8) ~ (-1,0.4) ~ (-0.35,1.1) ~ (-0.8,1.1) ~ (-0.2,1.5) ~ (-0.7,1.5) ~ (0,2) ~ (0.7,1.5) ~ (0.2,1.5) ~ (0.8,1.1) ~ (0.35,1.1) ~ (1,0.4) ~ (0.2,0.8) ~ (0.4,0) ~ cycle';
        break;

      case 'balloon':
        var mypath = '(0.0, 1)..(0.5, 1.5)..(0.2, 2)..(-0.3, 1.5)..(0, 1) ~ cycle (0, 1)..(-0.05, 0.66)..(0.15, 0.33)..(0, 0)';
        break;

      case 'house':
        var mypath = '&polygon{(-0.5,1),(1.25,3.5),(3,1),(-0.5,1)} &rectangle{(0,0),(1,1)} &rectangle{(1,0),(2.5,1)} &rectangle{(1.5,0),(2,0.5)}';
        break;

      case 'school':
        var mypath = '&rectangle{(0,0),(7,3)} &rectangle{(1,0),(2,2)} &rectangle{(3,0),(4,2)} &rectangle{(5,0),(6,2)} &polygon{(1,3),(1,5),(2,4.5),(1,4)} &polygon{(3,3),(3,5),(4,4.5),(3,4)} &polygon{(5,3),(5,5),(6,4.5),(5,4)}';
        break;

      case 'mouse':
        var mypath = '(2.5,0)~(0,0)..(2.1,1.7)..(3,2)..(4,1.5)..(4,0)..(3,-0.2)..(2.5,0)..(2.3,0.5)..(2.9,1) &circle{(1.1,0.6),0.15} (4,0)..(4.4,0)..(4,-0.5)..(2,-0.5)..(1.5,-0.4)..(1.0,-0.5) (2.5,0) [l:-0.2,-0.2]';
        break;

      case 'cat':
        var mypath = `(-1.5,2.5)..(-2.2,0.8)..(-2,0)..(-0.5,-0.3)..(1,0)..(1.2,0.8)..(0.5,2.5)\
             (0.5,2.5)~(0.8,3.2)~(0,2.8)~(0,2.8)..(-1,2.8)~(-1,2.8)~(-1.8,3.2)~(-1.5,2.5)\
             (-0.5,1) [dot:0.15] (0.5,1) [dot:0.15]\
             (-1,1.2)~(-0.5,1.5)\
             (+1,1.2)~(+0.5,1.5)\
             &ellipse{(0,0.4),0.3,0}\
             &polyline{(0.5,0.6),(2,1)} &polyline{(0.5,0.5),(1.8,0.7)} &polyline{(0.5,0.4),(1.6,0.4)}\
             &polyline{(-0.5,0.6),(-2,1)} &polyline{(-0.5,0.5),(-1.8,0.7)} &polyline{(-0.5,0.4),(-1.6,0.4)}\
             <,,8> &ellipse{(-0.6,-0.2),0.4,0.3}\
             <,,8> &ellipse{(+0.5,-0.2),0.4,0.3}`;
        break;

      case 'coin':
        var mypath = '&cylinder{(0,0),1,0.5,0.1} &ellipse{(0,0.1),0.8,0.3}';
        break;
        
      case 'protractor':
        var mypaths = [];
        mypaths.push('(-3.5, 0) ~ (-0.1,0)..(0,0.1)..(0.1,0) ~ (3.5, 0)..(0, 3.5)..(-3.5, 0) ~ cycle ');
        mypaths.push('(-2.5100, 0.8500) ~ (2.5100, 0.8500)..(0, 2.65)..(-2.5100, 0.8500) ~ cycle ');
        mypaths.push('(3.4468,  0.6078) ~ (3.0529,  0.5383)');
        mypaths.push('(3.2889,  1.1971) ~ (2.9130,  1.0603)');
        mypaths.push('(3.0311,  1.7500) ~ (2.6847,  1.5500)');
        mypaths.push('(2.6812,  2.2498) ~ (2.3747,  1.9926)');
        mypaths.push('(2.2498,  2.6812) ~ (1.9926,  2.3747)');
        mypaths.push('(1.7500,  3.0311) ~ (1.5500,  2.6847)');
        mypaths.push('(1.1971,  3.2889) ~ (1.0603,  2.9130)');
        mypaths.push('(0.6078,  3.4468) ~ (0.5383,  3.0529)');
        mypaths.push('(0.0000,  3.5000) ~ (0.0000,  3.1000)');
        mypaths.push('(-3.4468, 0.6078) ~ (-3.0529, 0.5383)');
        mypaths.push('(-3.2889, 1.1971) ~ (-2.9130, 1.0603)');
        mypaths.push('(-3.0311, 1.7500) ~ (-2.6847, 1.5500)');
        mypaths.push('(-2.6812, 2.2498) ~ (-2.3747, 1.9926)');
        mypaths.push('(-2.2498, 2.6812) ~ (-1.9926, 2.3747)');
        mypaths.push('(-1.7500, 3.0311) ~ (-1.5500, 2.6847)');
        mypaths.push('(-1.1971, 3.2889) ~ (-1.0603, 2.9130)');
        mypaths.push('(-0.6078, 3.4468) ~ (-0.5383, 3.0529)');
        mypaths.push('(0.0000,  0.1000) ~ (0.0000,  0.8500)');
        var mypath = mypaths.join(' ');
        break;

      case 'updnprotractor':
        var mypaths = [];
        mypaths.push('(-3.5, 0) ~ (-0.1,0)..(0,-0.1)..(0.1,0) ~ (3.5, 0)..(0,-3.5)..(-3.5, 0) ~ cycle ');
        mypaths.push('(-2.5100,-0.8500)  ~ (2.5100,-0.8500)..(0,-2.65)..(-2.5100,-0.8500) ~ cycle ');
        mypaths.push('( 3.4468, -0.6078) ~ ( 3.0529, -0.5383)');
        mypaths.push('( 3.2889, -1.1971) ~ ( 2.9130, -1.0603)');
        mypaths.push('( 3.0311, -1.7500) ~ ( 2.6847, -1.5500)');
        mypaths.push('( 2.6812, -2.2498) ~ ( 2.3747, -1.9926)');
        mypaths.push('( 2.2498, -2.6812) ~ ( 1.9926, -2.3747)');
        mypaths.push('( 1.7500, -3.0311) ~ ( 1.5500, -2.6847)');
        mypaths.push('( 1.1971, -3.2889) ~ ( 1.0603, -2.9130)');
        mypaths.push('( 0.6078, -3.4468) ~ ( 0.5383, -3.0529)');
        mypaths.push('( 0.0000, -3.5000) ~ ( 0.0000, -3.1000)');
        mypaths.push('(-3.4468, -0.6078) ~ (-3.0529, -0.5383)');
        mypaths.push('(-3.2889, -1.1971) ~ (-2.9130, -1.0603)');
        mypaths.push('(-3.0311, -1.7500) ~ (-2.6847, -1.5500)');
        mypaths.push('(-2.6812, -2.2498) ~ (-2.3747, -1.9926)');
        mypaths.push('(-2.2498, -2.6812) ~ (-1.9926, -2.3747)');
        mypaths.push('(-1.7500, -3.0311) ~ (-1.5500, -2.6847)');
        mypaths.push('(-1.1971, -3.2889) ~ (-1.0603, -2.9130)');
        mypaths.push('(-0.6078, -3.4468) ~ (-0.5383, -3.0529)');
        mypaths.push('( 0.0000, -0.1000) ~ ( 0.0000, -0.8500)');
        var mypath = mypaths.join(' ');
        break;

      default:
        var mypath = '';
        break;
    }
    return mypath;
  }
  to_prodofprimes(x,y,g,txt){
    var w = 2;
    var h = 1;
    var ss = this.string_to_array(txt);
    var prod = ss[0]||1;
    var factors = ss.slice(1);
    var d = [];
    for(let factor of factors){
      var ta = 'llft';
      d.push(this.p_label(x,y,`${factor}`,ta,g));
      d.push(this.p_stroke([[x,y],[x,y-h],[x+w,y-h]],g))
      var ta = 'bot';
      d.push(this.p_label(x+1,y,`${prod}`,ta,g));
      y -= h;
      prod /= factor;
      prod = Math.round(prod);
    }
    if(1){
      ///the remaining prod
      var ta = 'bot';
      d.push(this.p_label(x+1,y,`${prod}`,ta,g));
    }
    return d.join('\n')
  }
  to_longdivws(x,y,g,txt){
    var w = 2;
    var h = 1;
    var ss = this.string_to_array(txt);
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
      ///top bar
      d.push(this.p_line(x,y,x+n,y,g));
      d.push(this.p_qbezier_line(x,y,x+0.2,y-0.5,x,y-1,g));
      ///draw the top number
      ss.forEach((s,i) => {
        d.push(this.p_label(x+i,y-0.5,s,ta,g));
      });
      ///draw the divosor
      tt.forEach((t,i) => {
        let dx = tt.length;
        d.push(this.p_label(-dx+x+i,y-0.5,t,ta,g));
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
        var txt = `${Q}`;
        d.push(this.p_label(x+k,y+0.5,txt,ta,g));
        r = `${R}`;
        let p = `${P}`
        var m = p.length;
        d.push(this.draw_letter_string(x+k-m+1,y-j,p,g));//draw the product
        d.push(this.p_label(x+k-m,y-j-0.5,'&minus;','rt',g));//draw the minus sign on the left
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
  to_multiws(x,y,g,txt){
    var showanswer = this.get_int_prop(g,'showanswer',0);
    var showanswercolor = this.get_string_prop(g,'showanswercolor','');
    // var decimalpoint = this.get_string_prop(g,'decimalpoint','');
    // var decimalpoints = this.string_to_int_array(decimalpoint);
    var g = {...g,dotsize:3}
    var [number,divisor] = this.string_to_array(txt);
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
      d.push(this.p_label(x-m,y-1-0.5,'&times;','rt',g));
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
  draw_letter_string(x,y,txt,g){
    var d = [];
    var tt = txt.split('');
    tt.forEach((t,i) => {
      let dx = tt.length;
      d.push(this.p_label(x+i,y-0.5,t,'rt',g));
    });
    return d.join('\n')
  }
  draw_letter_string_flushright(x,y,txt,g){
    var d = [];
    var tt = txt.split('');
    var n = tt.length;
    tt.forEach((t,i) => {
      let dx = tt.length;
      d.push(this.p_label(-n+x+i,y-0.5,t,'rt',g));
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
    opts = opts.filter(x => x.length);
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
  w3color_to_hexstring(s,user){
    // the 're_colorfunction' would detect the color function
    // such as "&HWB!30!10%!20%" 
    let v;
    if((v=this.re_colorfunction.exec(s))!==null){
      let aa = v[1].split('!');
      let a0 = aa.shift();
      s = `${a0}(${this.translator.string_to_array(aa).join(',')})`;
    }
    //s = this.w3color(s).toHexString();
    var b = this.w3color(s);
    if(this.string_has_item(user,'darker')){
      b.darker(15);
    }else if(this.string_has_item(user,'lighter')){
      b.lighter(15);
    }
    s = b.toHexString();
    return s;
  }
  assert_arg_pt(args,i){
    if(this.is_arg_coords(args[i])){
      return this.point(args[i].coords,0);
    }else {
      return [0,0,''];
    }
  }
  assert_arg_coords(args,i){
    if(this.is_arg_coords(args[i])){
      return args[i].coords;
    }else {
      return [0,0,''];
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
    if(this.config.debug){
      console.log(`${s}`);
    }
    return this.p_comment(s);
  }
  do_debug(s) {
    console.log(`${s}`);
    return '';
  }
  do_line(s,env) {
    var s1 = this.exec_line(s,env);
    if(this.config.debug){
      console.log(`${s1}`);
    }
    return s1;
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
  update_g_by_attrflag(g,attrflag){
    if(attrflag & this.attrflag_linedashed){
      g.linedashed = 1;
    }
    if(attrflag & this.attrflag_linesize2){
      let n = parseFloat(g.linesize)||0;
      n += 2; 
      g.linesize = n;
    }
    if(attrflag & this.attrflag_linesize4){
      let n = parseFloat(g.linesize)||0;
      n += 4; 
      g.linesize = n;
    }
    if(attrflag & this.attrflag_nostroke){
      g.nostroke = 1;
    }
    return g;
  }
  to_diagram_fontsize_factor(g){
    var factor = this.string_to_fontsize_ratio(g.fontsize);
    if(Number.isFinite(factor)){
      return factor;
    }
    var factor = g.fontsize/this.tokenizer.fs;
    if(Number.isFinite(factor)){
      return factor;
    }
    return 1;
  }

}
module.exports = { NitrilePreviewDiagram };
























