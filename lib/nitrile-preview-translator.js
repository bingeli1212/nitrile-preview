'use babel';
'use strict';

const {NitrilePreviewBase} = require('./nitrile-preview-base.js');
const pjson = require('./nitrile-preview-math.json');
const unicodedata = require('./nitrile-preview-unicodedata');
const unicodeblocks = require('./nitrile-preview-unicodeblocks');
const { cjkfontmap, cjkfontnames } = require('./nitrile-preview-cjkfontmap');
const allfontfamilies = ['serif','sans','mono','math','contex','xelatex'];
const { NitrilePreviewExpr } = require('./nitrile-preview-expr');

//this.re_all_diacritics = /(?<!\\)\\(dot|ddot|bar|mathring|hat|check|grave|acute|breve|tilde)\{([A-Za-z])\}/g;

class NitrilePreviewTranslator extends NitrilePreviewBase {

  constructor(parser) {
    super();
    this.parser=parser;
    this.name='';
    this.pjson = pjson;
    this.re_is_key_term = /^([`\*'"])(.*?)\1(\s+.*$|$)/;//it has to start with a word otherwise it could grab a hyphen minus from a math expression
    this.fonts = [];       
    ///subparser
    this.style = {};
    this.buffers = {};
    this.switches = {};
    this.vmap = [];
    // 'cjkfontmap' 
    let fonts = this.parser.conf_to_list('fonts');
    let re_font = /^(\w+)\s*(.*)$/;
    for(let s of fonts){
      let fid = '';
      let g = {};
      let start = NaN;
      let stop = NaN;
      let v = re_font.exec(s);
      if(v){
        fid = v[1];
        g = this.string_to_style(v[2],{});
      }
      v = cjkfontnames.indexOf(fid);
      if(v>=0 && v<4){
        ///'jp','cn','tw','kr'
        g = {...g,fid};
        this.fonts.push(g);
      }else if(v>=0){
        start = parseInt(g.start);
        for(let blk of unicodeblocks){
          if(parseInt(blk.start)==start){ 
            stop = parseInt(blk.stop);
            blk.other=1;
            if(Number.isFinite(start)&&Number.isFinite(stop)){
              for(let i=start; i<=stop; ++i){
                cjkfontmap[i] |= 1 << v;
              }
              g = {...g,fid};
              this.fonts.push(g);
            }
          }
        }
      }
    }
    this.bodyfontsuit = this.parser.conf_to_string('bodyfontsuit');
    this.bodyfontvariant = this.parser.conf_to_string('bodyfontvariant','');
    this.bodyfontsize = this.parser.conf_to_float('bodyfontsize',10);
    this.papersize = this.parser.conf_to_string('papersize','A5');
  }
  translate_block(block){
    this.style = block.style;
    this.buffers = block.buffers;
    this.switches = block.switches;
    this.dict = block.dict;
    this.vmap = block.vmap;
    switch (block.sig) {
      case 'FRNT': return this.do_FRNT(block); break;
      case 'PART': return this.do_PART(block); break;
      case 'CHAP': return this.do_CHAP(block); break;
      case 'HDGS': return this.do_HDGS(block); break;
      case 'CAPT': return this.do_CAPT(block); break;
      case 'PRIM': return this.do_PRIM(block); break;
      case 'SECO': return this.do_SECO(block); break;
      case 'PARA': return this.do_PARA(block); break;
      default: break;
    }
    return '';
  }
  do_FRNT(block){
    var {title,label,level,name,style} = block;
    var text = '';
    if(1){
      var text = this.hdgs_to_chapter(title,label,style);
    }
    return text;
  }
  do_PART(block){
    var {title,label,style} = block;
    var text = this.hdgs_to_part(title,label,style);
    return text;
  }
  do_CHAP(block){
    var {title,label,style} = block;
    var text = this.hdgs_to_chapter(title,label,style);
    return text;
  }
  do_HDGS(block){
    var {hdgn,title,label,hdgn,level,style} = block;
    var text = this.hdgs_to_section(title,label,hdgn,level,style);
    return text;
  }
  do_CAPT(block){
    var {id,title,label,style,splitid,body,bodyrow} = block;
    var text = '';
    var o = [];
    o.push('');
    if(id=='flushleft'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_flushleft(title,label,style,splitid,body,bodyrow);
    }else if(id=='center'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_center(title,label,style,splitid,body,bodyrow);
    }else if(id=='equation'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_equation(title,label,style,splitid,body,bodyrow);
    }else if(id=='listing'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_listing(title,label,style,splitid,body,bodyrow)
    }else if(id=='figure'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_figure(title,label,style,splitid,body,bodyrow);
    }else if(id=='table'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_table(title,label,style,splitid,body,bodyrow);
    }else if(id=='wrapfig'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_wrapfig(title,label,style,splitid,body,bodyrow);
    }else if(id=='wraptab'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_wraptab(title,label,style,splitid,body,bodyrow);
    }else if(id=='multicol'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_multicols(title,label,style,splitid,body,bodyrow);
    }else if(id=='lines'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_lines(title,label,style,splitid,body,bodyrow);
    }else if(id=='itemize'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_itemize(title,label,style,splitid,body,bodyrow);
    }else if(id=='page'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_page(title,label,style,splitid,body,bodyrow);
    }else if(id=='vspace'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_vspace(title,label,style,splitid,body,bodyrow);
    }else if(id=='vocabulary'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_vocabulary(title,label,style,splitid,body,bodyrow);
    }else if(id=='blockquote'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_blockquote(title,label,style,splitid,body,bodyrow);
    }else if(id=='tabbing'){
      style = this.update_style_from_switches(style,id);
      text = this.float_to_tabbing(title,label,style,splitid,body,bodyrow);
    }
    return text;
  }
  do_PARA(block){
    var {title,label,style,splitid,body,bodyrow} = block;
    var text = '';
    if(this.body_is_bundle(body)){
      style = this.update_style_from_switches(style,'center');
      text = this.float_to_center(title,label,style,splitid,body,bodyrow);
    }else if(this.re_body_is_details.test(body[0])){
      style = this.update_style_from_switches(style,'details');
      text = this.float_to_details(title,label,style,splitid,body,bodyrow);  
    }else if(this.re_body_is_hyphe.test(body[0])||this.re_body_is_enume.test(body[0])||this.re_body_is_dterm.test(body[0])){
      style = this.update_style_from_switches(style,'itemize');
      text = this.float_to_itemize(title,label,style,splitid,body,bodyrow);
    }else if(this.re_body_is_four_space.test(body[0])){
      body = body.map((s)=>{
        return s.slice(4);
      });
      style = this.update_style_from_switches(style,'verbatim');
      text = this.float_to_verbatim(title,label,style,splitid,body,bodyrow);
    }else if(this.re_body_is_one_space.test(body[0])){
      body = body.map((s,i)=>{
        if(i==0) return s.slice(1);
        else     return s;
      });
      style = this.update_style_from_switches(style,'blockquote');
      text = this.float_to_blockquote(title,label,style,splitid,body,bodyrow);
    }else if(this.re_body_is_verba.test(body[0])){
      body = this.body_to_body(body,this.re_body_is_verba);
      style = this.update_style_from_switches(style,'verbatim');
      text = this.float_to_verbatim(title,label,style,splitid,body,bodyrow);
    }else if(this.re_body_is_examp.test(body[0])){
      body = this.body_to_body(body,this.re_body_is_examp);
      style = this.update_style_from_switches(style,'example');
      text = this.float_to_example(title,label,style,splitid,body,bodyrow);
    }else if(this.re_body_is_cline.test(body[0])){
      body = this.body_to_body(body,this.re_body_is_cline);
      style = this.update_style_from_switches(style,'lines');
      style = {...style,textalign:'c'};
      text = this.float_to_lines(title,label,style,splitid,body,bodyrow);
    }else if(this.re_body_is_lline.test(body[0])){
      body = this.body_to_body(body,this.re_body_is_lline);
      style = this.update_style_from_switches(style,'lines');
      style = {...style,textalign:'l'};
      text = this.float_to_lines(title,label,style,splitid,body,bodyrow);
    }else{
      text = this.float_to_body(title,label,style,splitid,body,bodyrow);
    }  
    return text;
  }
  do_PRIM(block) {
    var {rank,title,style,splitid,body,bodyrow} = block;
    var label = '';
    style.rank = rank;
    return this.float_to_primary(title,label,style,splitid,body,bodyrow);
  }
  do_SECO(block) {
    var {rank,title,style,splitid,body,bodyrow} = block;
    var label = '';
    style.rank = rank;
    return this.float_to_secondary(title,label,style,splitid,body,bodyrow);
  }
  rubify_cjk(style,text) {
    var vmap = style.__vmap;
    if(!vmap){
      return text;
    }else if(vmap.length==0){
      return text;
    }
    ///
    /// perform replacements given a list of substrings and target
    /// strings. Following example is a source string and the
    /// str1 located is "greeting"
    ///
    /// "Hello world greeting and goodbye"
    ///        j     i0
    ///              k0
    ///                      j
    ///                          i0
    ///                          k0
    var j = 0;
    var k = 0;
    var i = 0;
    var i0 = 0;
    var found = 0;
    var found_rb = '';
    var found_rt = '';
    var out = '';
    text = text || '';
    while (j < text.length) {
      i0 = text.length;
      found = 0;
      if(vmap){
        for (var rubyitem of vmap) {
          var {rb,rt} = rubyitem;
          var i = text.indexOf(rb,j);
          if (i < 0) {
            continue
          }
          if (i < i0) { /// first found or a new found that is closer
            i0 = i;
            found = 1;
            found_rb = rb;
            found_rt = rt;
          } else if (i === i0 && rb.length > found_rb.length) { /// found two at the same location, prefer the longest
            i0 = i;
            found = 1;
            found_rb = rb;
            found_rt = rt;
          }
        }
      } 
      if (found) {
        /// found!
        var rb = found_rb;
        var rt = found_rt;
        out += text.slice(j,i0);
        out += this.ruby_markup(rb,rt);//own method
        j = i0 + rb.length;
      } else {
        /// we are done, none of the substrings exists!
        out += text.slice(j);
        j = text.length;
      }
    }
    return out;
  }
  buildRubyMapFromJson (json) {
    /// build an array
    /// each array-item is a two-item-array: [rb,rt]
    var o = [];
    for (var item of json.vsuru) {
      let [base,top] = item;
      o.push(item);
      o.push([base.slice(0,base.length-2),top.slice(0,top.length-2)]);
    }
    for (var item of json.v1) {
      let [base,top] = item;
      o.push(item);
      o.push([base.slice(0,base.length-1),top.slice(0,top.length-1)]);
    }
    for (var item of json.v5m) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
            '\u307e', //ま
            '\u307f', //み
            '\u3081', //め
            '\u3082\u3046', //もう
            '\u3093\u3067', //んで
            '\u3093\u3060'  //んだ
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.v5b) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
            '\u3070', //ば
            '\u3073', //び
            '\u3079', //べ
            '\u307c\u3046', //ぼう
            '\u3093\u3067', //んで
            '\u3093\u3060'  //んだ
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.v5n) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
          '\u306a', //な
          '\u306b', //に
          '\u306d', //ね
          '\u306e\u3046', //のう
          '\u3093\u3067', //んで
          '\u3093\u3060'   //んだ
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.v5s) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
          '\u3055', //さ
          '\u3057', //し
          '\u305b', //せ
          '\u305d\u3046', //そう
          '\u3057\u3066', //して
          '\u3057\u305f'  //した
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.v5g) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
          '\u304c', //が
          '\u304e', //ぎ
          '\u3052', //げ
          '\u3054\u3046', //ごう
          '\u3044\u3067', //いで
          '\u3044\u3060'  //いだ
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.v5k) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
          '\u304b', //か
          '\u304d', //き
          '\u3051', //け
          '\u3053\u3046', //こう
          '\u3044\u3066', //いて
          '\u3044\u305f'  //いた
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.v5r) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
          '\u3089', //ら
          '\u308a', //り
          '\u308c', //れ
          '\u308d\u3046', //ろう
          '\u3063\u3066', //って
          '\u3063\u305f'  //った
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.v5t) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
          '\u305f', //た
          '\u3061', //ち
          '\u3066', //て
          '\u3068\u3046', //とう
          '\u3063\u3066', //って
          '\u3063\u305f'  //った
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.v5u) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
          '\u308f', //わ
          '\u3044', //い
          '\u3048', //え
          '\u304a\u3046', //おう
          '\u3063\u3066', //って
          '\u3063\u305f'  //った
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.adji) {
      let [base,top] = item;
      o.push(item);
      var suffixes = [
          '\u304b\u3063\u305f', //かった
          '\u304f', //く
          '\u3055', //さ
          '\u307f', //み
          '\u305d\u3046'  //そう
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`]);
      }
    }
    for (var item of json.exp) {
      o.push(item);
    }
    return o;
  }
  count_empty_lines (para) {
    var n = 0;
    for (let line of para) {
      if (line.length == 0) {
        n++;
      }
    }
    return n;
  }
  removeLeadingEndingVerticalBar (para) {
    var o = [];
    for (let line of para) {
      if (line[0] === '|') {
        line = line.slice(1);
      }
      if (line[line.length-1] === '|') {
        line = line.slice(0,line.length-1);
      }
      o.push(line);
    }
    return o;
  }
  string_is_float(val){
    var re = /^[0-9\.]+$/;
    return re.test(val);
  }
  replace_sub_strings(text, map) {
    ///
    /// perform replacements given a list of substrings and target
    /// strings. Following example is a source string and the
    /// str1 located is "greeting"
    ///
    /// "Hello world greeting and goodbye"
    ///        j     i0
    ///              k0
    ///                      j
    ///                          i0
    ///                          k0
    var j = 0;
    var k = 0;
    var i = 0;
    var i0 = 0;
    var k0 = 0;
    var out = '';
    text = text || '';
    while (j < text.length) {
      i0 = text.length;
      k0 = map.length;
      for (k = 0; k < map.length; k += 2) {
        var str1 = map[k];
        var str2 = map[k + 1];
        var i = text.indexOf(str1, j);
        if (i < 0) {
          continue
        }
        /// save the i that is the least
        if (i < i0) {
          i0 = i;
          k0 = k;
        }
      }
      if (k0 < map.length) {
        /// found!
        var str1 = map[k0];
        var str2 = map[k0 + 1];
        out += text.slice(j, i0);
        out += str2;
        j = i0 + str1.length;
      } else {
        /// we are done, none of the substrings exists!
        out += text.slice(j);
        j = text.length;
      }
    }
    return out;
  }
  ///
  ///
  ///
  conf_to_float(in_key,def_val){
    if(this.name){
      in_key = this.name + "." + in_key;
    }
    return this.parser.conf_to_float(in_key,def_val);
  }
  conf_to_int(in_key,def_val){
    if(this.name){
      in_key = this.name + "." + in_key;
    }
    return this.parser.conf_to_int(in_key,def_val);
  }
  conf_to_bool(in_key,def_val){
    if(this.name){
      in_key = this.name + "." + in_key;
    }
    return this.parser.conf_to_bool(in_key,def_val);
  }
  conf_to_list(in_key,def_val){
    if(this.name){
      in_key = this.name + "." + in_key;
    }
    return this.parser.conf_to_list(in_key,def_val);
  }
  conf_to_string(in_key,def_val){
    if(this.name){
      in_key = this.name + "." + in_key;
    }
    return this.parser.conf_to_string(in_key,def_val);
  }
  conf_to_substring(in_key,def_val){
    if(this.name){
      in_key = this.name + "." + in_key;
    }
    return this.parser.conf_to_substring(in_key,def_val);
  }
  /////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////////
  do_bundle(style,bundle,key=''){
    if(bundle){
      var ss = bundle.ss;
      var ssi = bundle.ssi;
      if(!key && bundle.key){
        key = bundle.key;
      }
      var g = bundle.g;//bundle.g has already been merged with parent style
      if(g.restore){
        let name0 = g.id||'';
        let lineno = 1;
        if(style.__buffers.hasOwnProperty(name0)){
          let {ss:ss0} = style.__buffers[name0];
          if(ss0 && Array.isArray(ss0)){
            let ss1 = ss.slice(0,lineno-1);
            let ss2 = ss0;
            let ss3 = ss.slice(lineno-1);
            ss = ss1.concat(ss2).concat(ss3);
            //g = {...g0,...g};
          }
        }
      }
      if(g.save){
        let name0 = g.id||'';
        style.__buffers[name0] = {ss,key,g};
      }
      var id = g.id;
      g.subtitle = g.subtitle||'';
      var subcaption = this.to_subcaption(id,style);
      var subcaption1 = this.to_subcaption('',style);
      if(id && subcaption){
        g.subtitle = `${subcaption}`;
      }else if(subcaption1){
        g.subtitle = subcaption1;
      }
      g.row = ssi;
      var itm = {};
      //update from switch
      if(key=='img'){
        g = this.update_style_from_switches(g,key,style);
        itm = this.fence_to_img(g,ss,ssi);
      }else if(key=='fml'){
        g = this.update_style_from_switches(g,key,style);
        itm = this.fence_to_fml(g,ss,ssi);
      }else if(key=='tab'){
        g = this.update_style_from_switches(g,key,style);
        itm = this.fence_to_tab(g,ss,ssi);
      }else if(key=='par'){
        g = this.update_style_from_switches(g,key,style);
        itm = this.fence_to_par(g,ss,ssi);
      }else{
        key = 'vtm';
        g = this.update_style_from_switches(g,key,style);
        itm = this.fence_to_vtm(g,ss,ssi);
      }
      ///assign 'key' to every member of 'o'
      itm.type = bundle.type;///always copy the type, which could be either 'bundle', or '\\\\'
      itm.key = key;///always copy the key
      return itm;
    }
    return null;
  }
  uncode(style,line) {
    // WIll recognized something like,
    //
    //    ``    ``
    //    `      `
    var v;
    if(typeof line === 'string'){
    }else{
      line = ''+line;
    }
    var start_i = 0;
    var newtext = '';
    // const re = /(?:`{1,2})(.*?)(?:`{1,2})|(?<!\w)\*([\w\-\.\,:\(\)\[\]\/]+)\*(?!\w)|\\\((.*?)\\\)|\\\[(.*?)\\\]/gs;
    const re = /(`{1,2}.*?`{1,2})|(?<!\w)\*([^\*\s]+)\*(?!\w)|\\\[(.*?)\\\]|\\\((.*?)\\\)|(?<!\\)(&[A-Za-z]+\{.*?\})|(?<!\\)(\{\{.*?\}\})/ugs; //cannot be global because it is used recursively
    while ((v = re.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
      var txt = this.flatten(style,txt);
      newtext += txt;
      if (v[1] !== undefined) {
        ///literal_to_verb
        var s = v[1];
        let s1 = s.replace(/`/gs,'').trim();
        var txt = this.literal_to_verb(style,s1);
        newtext += txt;
                
      } else if (v[2] !== undefined) {
        ///literal_to_var
        var s = v[2]
        var txt = this.literal_to_var(style,s);
        newtext += txt;
                
      } else if (v[3] !== undefined) {
        ///literal_to_displaymath
        var s = v[3];
        var txt = this.literal_to_displaymath(style,s);
        newtext += txt;

      } else if (v[4] !== undefined) {
        ///literal_to_math
        var s = v[4];
        var txt = this.literal_to_math(style,s);
        newtext += txt;

      } else if (v[5] !== undefined) {
        ///literal_to_phrase
        var s = v[5];
        let i = s.indexOf('{');
        if(i>=0){
          let key = s.slice(1,i);
          var s = s.slice(i+1,-1);
          var txt = this.do_phrase(key,style,s);
          newtext += txt;
        }

      } else if (v[6] !== undefined) {
        ///literal_to_index
        var s = v[6];
        if(1){
          var s = s.slice(2,-2);
          var txt = this.literal_to_index(style,s);
          //newtext += txt;
          newtext = newtext.trimEnd() + txt;
        }

      }
      start_i = re.lastIndex;
    }
    var txt = line.slice(start_i);
    var txt = this.flatten(style,txt);
    newtext += txt;
    return newtext;
  }
  flatten(style,txt){
    ///remove newlines and join a paragraph into a single line, such that if the line starts and ends with 
    ///a CJK the spaces between the two CJK's are removed. Otherwise a spaces will be added
    if(txt == '\n'){
      return ' ';
    }
    style = style || {};
    let ss = txt.split('\n');
    var txt = this.join_para(ss);
    var txt = this.smooth(style,txt);
    return txt;
  }
  ss_to_lines_itms(ss,style){
    let itms = [];
    const re_1  = /^(\d+[\.\)])\s+(.*)$/;
    const re_a  = /^([a-z][\.\)])\s+(.*)$/;
    const re_A  = /^([A-Z][\.\)])\s+(.*)$/; 
    const re_UL = /^([\-])\s+(.*)$/;
    const re_OL = /^([\*])\s+(.*)$/;
    const re_DL = /^([\+])\s+(.*)$/;
    let v;
    ss.forEach((s,i,arr) => {
      if((v=re_1.exec(s))!==null){
        let type = '1';
        let bull = v[1].slice(0,-1);
        let start = this.extract_first_word(v[2]);
        let ending = v[1].substr(-1);
        let text = v[2];
        let value = parseInt(bull);
        itms.push({bull,text,value,start,ending,type});
        return;
      }else if((v=re_a.exec(s))!==null){
        let type = 'a';
        let bull = v[1].slice(0,-1);
        let start = this.extract_first_word(v[2])
        let ending = v[1].substr(-1);
        let text = v[2];
        let value = bull[0].codePointAt(0) - 'a'.codePointAt(0) + 1;
        itms.push({bull,text,value,start,ending,type});
        return;
      }else if((v=re_A.exec(s))!==null){
        let type = 'A';
        let bull = v[1].slice(0,-1);
        let start = this.extract_first_word(v[2])
        let ending = v[1].substr(-1);
        let text = v[2];
        let value = bull[0].codePointAt(0) - 'A'.codePointAt(0) + 1;
        itms.push({bull,text,value,start,ending,type});
        return;
      }else if((v=re_DL.exec(s))!==null){
        let type = 'DL';
        let bull = v[1];
        let start = this.extract_first_word(v[2]);
        let ending = '';
        let text = v[2];
        let value = '';
        let i = text.indexOf("\n");
        if(i>=0){
          value = text.slice(0,i);
          text = text.slice(i+1);
        }else{
          value = text;
          text = '';
        }
        itms.push({bull,text,value,start,ending,type});
        return;
      }else if((v=re_OL.exec(s))!==null){
        let type = 'OL';
        let bull = v[1];
        let start = this.extract_first_word(v[2]);
        let ending = '';
        let text = v[2];
        let value = itms.length+1;
        itms.push({bull,text,value,start,ending,type});
        return;
      }else if((v=re_UL.exec(s))!==null){
        let type = 'UL';
        let bull = v[1];
        let start = this.extract_first_word(v[2]);
        let ending = '';
        let text = v[2];
        let value = '';
        itms.push({bull,text,value,start,ending,type});
        return;
      }else if((v=this.line_is_indented(s))!==0){        
        let type = 'INDENTED';
        let bull = '';
        let start = '';
        let ending = '';
        let text = s.trimStart();
        let value = v;
        itms.push({bull,text,value,start,ending,type});
        return;
      }else{
        let type = 'TX';
        let bull = '';
        let start = this.extract_first_word(s);
        let ending = '';
        let text = s;
        let value = '';
        itms.push({bull,text,value,start,ending,type});
        return;
      }
    })
    return itms;
  }
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  ss_to_tab_rows(ss,ssi,max_n,env){
    var v;
    var rows = [];
    var i = 0;
    var startj = 0;
    var j = 0;
    var d = [];
    for(let s of ss){
      if(s.startsWith('& ')){
        var dd = [];
        d.push(dd);
        dd.push(s);
        var ss = s.slice(2).trim().split(this.re_split_doublebackslash).map(x=>x.trim());
        ss.forEach(s => dd.push(s));
      }else if(s.startsWith(': ')){
        var dd = [];
        d.push(dd);
        dd.push(s);
        dd.push(s.slice(2).trim());
      }else if(s.startsWith('^ ')){
        var dd = [];
        d.push(dd);
        dd.push(s);
        dd.push(s.slice(2).trim());
      }else if(s.startsWith('  ')){
        if(d.length){
          var dd = d.pop();
          d.push(dd);
          dd.push(s.slice(2).trim());
        }
      }
    }
    d.forEach((dd) => {
      let cmd = dd[0];
      dd = dd.slice(1);
      if(cmd.startsWith('& ')){
        let pp = dd.map((raw) => {
          let row = ssi+i;
          return {raw,row};
        });
        rows.push(pp);
        i=0;
      }else if(cmd.startsWith('^ ')){
        if(i==0){///first column 
          startj = rows.length;//starts from the last row
        }
        i++;
        if(i <= max_n){
          dd.forEach((fn,k) => {
            let v=this.re_is_braces.exec(fn);
            let fm = '';
            if(v!==null){
              fm = v[1];
              fn = v[2];
            }
            j = startj+k;
            if(j==rows.length){
              let pp = 'x'.repeat(max_n).split('').map(x => {return {raw:'',row:''}});//add a new empty row underneath all current rows
              rows.push(pp);
            }
            // let pp = rows[j];
            // let g = {...env};
            // g['n'] = j;
            // g['$'] = pp;
            // let [num] = expr.extract_next_expr(s,g);
            // if(fm){
            //   num = this.to_formatted_text(num,fm);
            // }
            rows[j][i-1].fn = fn;
            rows[j][i-1].fm = fm;
          });
        }
      }else if(cmd.startsWith(': ')){
        if(i==0){///first column
          startj = rows.length;
        }
        i++;
        if(i <= max_n){
          j = startj;
          dd.forEach((s) => {
            if(j==rows.length){
              let pp = 'x'.repeat(max_n).split('').map(x => {return {raw:'',row:''}});//add a new empty row underneath all current rows
              rows.push(pp);
            }
            if(j<rows.length){
              rows[j][i-1].raw = s;
              j++;
            }
          })
        }
      }
    })
    //
    // Set is so that each table row is the same number of elements
    //
    rows = rows.map((pp) => {
      while(pp.length < max_n) {
        let raw = '';
        let row = ssi;
        pp.push({raw,row});
      }
      return pp;
    });
    //
    // remove those that are longer than max_n 
    //
    rows = rows.map((pp) => {
      if(pp.length > max_n){
        pp = pp.slice(0,max_n);
      }
      return pp;
    })
    //
    // do calculation
    //
    rows.forEach((pp,j) => {
      const expr = new NitrilePreviewExpr(null);
      let g = {...env};
      g['n'] = j;
      g['$'] = pp;
      pp.forEach((p) => {
        if(p.fn){
          let [num] = expr.extract_next_expr(p.fn,g);
          p.raw = num;
        }
      })
    })
    //
    // do formatting
    //
    rows.forEach((pp,j) => {
      let g = {...env};
      g['n'] = j;
      g['$'] = pp;
      pp.forEach((p) => {
        if(p.fm){
          let raw = this.to_formatted_text(p.raw,p.fm);
          p.text = raw;
        }else{
          p.text = p.raw.toString();
        }
      })
    })
    // return
    return rows;
  }
  extract_body_caption(body,style){
    ///import the caption if any
    var captions = [];
    var ss = body.map(x => x);///make a copy
    if(style.caption){
      while(ss.length){
        let s = ss[0];
        if(s.length == 0){
          break;
        }else if(s.trim()=='\\\\'){
          ss = ss.slice(1);
          break;
        }else{
          captions.push(s);
          ss = ss.slice(1);
        }
      }
    }
    var caption = this.join_para(captions);
    var ss = this.trim_samp_body(ss);
    return {caption,ss};  
  }
  string_to_frs_with_gap(str,n,gap){
    gap = parseFloat(gap)||0;
    var w = (1 - (gap * (n - 1))) / n;
    let frs = this.string_to_frs(str,n);
    frs = frs.map(x => x*w);
    return frs;
  }
  string_to_frs(str, n) {
    if(typeof str !== 'string'){
      str = '';
    }
    if (n > 0) {
      var pp = str.split(/\s+/);
      pp = pp.map(x => parseInt(x));
      pp = pp.filter(x => Number.isFinite(x));
      pp = pp.map(x => (x < 1) ? 1 : x);
      while (pp.length < n) pp.push(1);
      pp = pp.slice(0, n);
      var total = pp.reduce((acc, cur) => acc + cur, 0);
      pp = pp.map(x => this.fix(x * n / total));
      return pp;
    }
    return [];
  }
  ////////////////////////////////////////////////////////////////////
  //
  // recognize & as starting a subtitle
  ///
  ////////////////////////////////////////////////////////////////////
  ss_to_img_bundle_itms(style,ss,ssi){
    //const re_image = /^\\(\w+)\s+(.*)$/;
    //const re_color = /^\\(\w+)\s+(.*)$/;
    //const re_shape = /^\\(\w+)\s+(.*)$/;
    const re_cmd = /^\\(\w+)\s+(.*)$/;
    const re_txt = /^\"(.*?)\"\s*(.*)$/;
    let v;
    let itms = {};
    for(let s of ss){
      if((v=re_cmd.exec(s))!==null){
        let key = v[1];
        let s1 = v[2];
        let v1;
        itms[key] = [];
        while((v1=re_txt.exec(s1))!==null){
          let cnt = v1[1];
          s1 = v1[2];
          itms[key].push(cnt);
        }
      }
    }
    return itms;
  }
  ////////////////////////////////////////////////////////////////////
  //
  // recognize & as starting a subtitle
  ///
  ////////////////////////////////////////////////////////////////////
  bundles_to_figure_itms(style,bundles){
    var itms = [];
    var partition = this.assert_int(style.partition,0);
    var k = 0;
    bundles.forEach(bundle => {
      if(bundle.type=='\\\\'){
        let itm = {};
        itm.type = '\\\\';
        itms.push(itm);
        k = 0;
      }else{
        if(partition && k == partition){
          let itm = {};
          itm.type = '\\\\';
          itms.push(itm);
          k = 0;
        } 
        let itm = this.do_bundle(style,bundle,'img');
        itm.type = 'bundle';
        itm.row = bundle.ssi;
        itms.push(itm);
        k++;
      }
    });
    return itms;
  }
  string_to_keys(s){
    ///this method returns an array of two items: [keys,text]
    s = s||'';
    var text = '';
    var v;
    const re_key_qq = /^`[^`]+`(,`[^`]+`)*:/
    const re_key_tt = /^'[^']+'(,'[^']+')*:/
    const re_key_i = /^"([^"]+)":/;
    const re_key_b = /^\{([^\{\}]+)\}:/;
    if ((v = re_key_qq.exec(s)) !== null) {
      text = s.slice(v[0].length).trim();
      let keys = [];
      /// 'one','two'
      /// 'single'
      const re_key_item = /^`([^`]+)`(.*)$/;
      while(s.length){
        v = re_key_item.exec(s);
        if(v==null){
          break;
        }
        let key = v[1].trim();
        s = v[2];
        s = s.slice(1);///remove the comma
        let cat = 'tt';
        keys.push({key,cat});
      }
      return [keys,text];    
    }
    else if ((v = re_key_tt.exec(s)) !== null) {
      text = s.slice(v[0].length).trim();
      let keys = [];
      /// 'one','two'
      /// 'single'
      const re_key_item = /^'([^']+)'(.*)$/;
      while(s.length){
        v = re_key_item.exec(s);
        if(v==null){
          break;
        }
        let key = v[1].trim();
        s = v[2];
        s = s.slice(1);///remove the comma
        let cat = 'tt';
        keys.push({key,cat});
      }
      return [keys,text];
    }
    else if ((v = re_key_i.exec(s)) !== null) {
      let keys = [];
      /// * "Power set":
      ///   For every set A there exists a set, denoted by &Pscr;(A) and
      ////  called the power set of A, whose elements are all
      ///   the subsets of A.
      let key = v[1].trim();
      let cat = 'i';
      keys.push({key,cat});
      text = s.slice(v[0].length).trim();
      return [keys,text];
    }
    else if ((v = re_key_b.exec(s)) !== null) {
      let keys = [];
      /// * {Power set}:
      ///   For every set A there exists a set, denoted by &Pscr;(A) and
      ////  called the power set of A, whose elements are all
      ///   the subsets of A.
      let key = v[1].trim();
      let cat = 'b';
      keys.push({key,cat});
      text = s.slice(v[0].length).trim();
      return [keys,text];      
    }
    else {
      let keys = null;
      return [keys,text];
    }
  }
  plitems_to_itemize(style,plitems) {
    var num = 0;
    var levels = [];
    var lead = '';
    var bull = '';
    var key = '';
    var term = '';
    var sep = '';
    var type = '';
    var ending = '';
    var value = '';
    var action = '';
    var more = [];
    var text = '';
    var body = [];
    var s = '';
    var keyno = style.keyno||0;
    //const re_leadspaces = /^(\s*)(.*)$/;
    //
    //var re = /^(\s*)(\+|\-|\*|\d+\.)\s+(.*)$/;
    //
    //var re = /^(\s*)/;
    for (var plitem of plitems) {
      let bullet = plitem.bullet;
      let lead = plitem.lead||'';
      let nblank = plitem.nblank;
      type = ''; // need to clear type and value
      value = '';
      if (bullet) {
        // 'bullet' is set to a non-empty when it is an item, empty when it is a text
        //var text = v[2];
        //plitem.body[0] = text;
        body = plitem.body;
        text = plitem.body.join('\n');
        if (bullet[0] == '-'){
          bull = 'UL';
          value = '';
          term = '';
          sep = '';
          body = plitem.body;
          text = body.join('\n');
        } else if (bullet[0] == '*'){
          bull = 'OL';
          value = `${++keyno}`;
          key = plitem.body.slice(0,1).join('\n').trim();
          body = plitem.body.slice(1);
          text = plitem.body.slice(1).join('\n');   
          type = '';       
        } else if (bullet[0]=='+'){
          bull = 'DL';
          value = '';
          term = plitem.body.slice(0,1).join('\n').trim();
          body = plitem.body.slice(1);
          text = plitem.body.slice(1).join('\n');
          type = '';
        } else {
          bull = 'OL';
          key = '';
          // taking care of 'A', 'a', '1', etc.
          num = parseInt(bullet);
          if(Number.isFinite(num)){
            type = '0';
            value = `${num}`;
          }else if(bullet[0].codePointAt(0) >= 65 && bullet[0].codePointAt(0) <= 90) {
            type = 'A';
            value = bullet[0].codePointAt(0) - 65 + 1
          }else if(bullet[0].codePointAt(0) >= 97 && bullet[0].codePointAt(0) <= 122) {
            type = 'a';
            value = bullet[0].codePointAt(0) - 97 + 1
          }else{
            type = '';
            value = '';
          }
          // take care of the ending
          if(bullet.endsWith('.')){
            ending = '.';
          }else if(bullet.endsWith(')')){
            ending = ')';
          }
        }
        // check for indentation
        if (levels.length == 0) {
          action = 'push';
        } else {
          var lead0 = levels[levels.length-1].lead;
          var bull0 = levels[levels.length-1].bull;
          if (lead0.length < lead.length) {
            action = 'push';
          } else if (levels.length > 1 && lead0.length > lead.length) {
            action = 'pop';
          } else {
            action = 'item';
          }
        }
      } 
      else {
        action = 'lines';
      }

      /// For Japanese language input, the following three
      /// are used for three levels of nesting
      ///  ー \u30fc
      ///  ＋ \uff0b
      ///  ＊ \uff0a

      if(action === 'push') {
        //create a new itemize to the level
        var itemize = {};
        itemize.bull = bull;
        itemize.lead = lead;
        itemize.items = [];
        itemize.nblank = 0;
        levels.push(itemize);
        //add a new item to the old itemize
        if(levels.length > 1){
          let itemize0 = levels[levels.length-2];
          let item0 = itemize0.items[itemize0.items.length-1];//there should always be at least in the list 
          item0.more.push({itemize,row:plitem.n});
        }
        //create a new item and add it to the new itemize
        var item = {};
        item.body = body;
        item.text = text;
        item.bullet = bullet;
        item.type = type; //'A', 'a', '0', 'verb'
        item.key = key;
        item.term = term;
        item.sep = sep;
        item.value = value;
        item.ending = ending;
        item.more = [];
        item.row = plitem.n;
        itemize.items.push(item);
      }else if(action === 'pop') {
        levels.pop();
        var itemize = levels[levels.length-1];
        var item = {};
        item.body = body;
        item.text = text;
        item.bullet = bullet;
        item.type = type; //'A', 'a', '0'
        item.key = key;
        item.term = term;
        item.sep = sep;
        item.value = value;
        item.ending = ending;
        item.more = [];
        item.row = plitem.n;
        itemize.items.push(item);
      }else if(action === 'lines') {
        var itemize = levels[levels.length-1];
        if(lead.length>0 && lead.length <= itemize.lead.length){
          levels.pop();
          itemize = levels[levels.length-1];
        }
        var item = itemize.items[itemize.items.length-1];//the 'items' array is never empty
        var one = {};
        one.lines = plitem.body;
        one.row = plitem.n;
        item.more.push(one);
      }else if(action === 'item') {
        var itemize = levels[levels.length-1];
        var item = {};
        item.body = body;
        item.text = text;
        item.bullet = bullet;
        item.type = type; //'A', 'a', '0'
        item.key = key;
        item.term = term;
        item.sep = sep;
        item.value = value;
        item.ending = ending;
        item.more = [];
        item.row = plitem.n;
        itemize.items.push(item);
        itemize.nblank += nblank;///the itemize's nblank member is the accumulation of all its items
      }
    }
    // save the keyno back to 'style' because all splitted bundles share the same 'style' which came from the original block
    style.keyno = keyno;
    //
    return levels[0];//it should always be at least one in there
  }
  ruby_markup (base, top) {
    var re = '';
    var rb = '';
    var rt = '';
    for (var c of base) {
      if (!/[\u3040-\u309F]/.test(c)) {
        ///not hiragana
        if (rt.length) {
          re += `(${rt})`;
          rt = '';
        }
        rb += c;
      } else {
        if (rb.length) {
          re += '(.+?)';
          rb = '';
        }
        rt += c;
      }
    }
    if (rb.length) {
      re += '(.+?)';
      rb = '';
    } else if (rt.length) {
      re += `(${rt})`;
      rt = '';
    }
    ///console.log(re);
    re = `^${re}$`;
    ///console.log(re);
    var re = new RegExp(re);
    var v = re.exec(top);
    ///console.log(v);
    var v1 = re.exec(base);
    ///console.log(v1);
    if (v && v1 && v.length === v1.length) {
      /// match
      let items = [];
      for (var j=1; j < v.length; ++j) {
        if (v1[j] === v[j]) {
          items.push([v1[j],'']);
        } else {
          items.push([v1[j],v[j]]);
        }
      }
      let o = this.do_ruby(items);
      return o;
    } else {
      let items = [];
      items.push([base,top]);
      let o = this.do_ruby(items);
      return o;
    }
  }
  vrule_to_vbars(n,vrule){
    var vrule = vrule||'';
    if(vrule.indexOf('+') >= 0){
      var pp = vrule.split('+');
      const re = /^\|{0,2}$/;
      var pp = pp.filter(x => re.test(x));
      while (pp.length < n+1){
        pp.push('');
      }
      return pp;
    }
    if(vrule==='|'){
      let pp = 'x'.repeat(n+1).split('').map((x,i,arr) => {
        if(i==0 || i+1==arr.length) return '';
        else return "|";
      });
      return pp;
    }
    if(vrule==='||'){
      let pp = 'x'.repeat(n+1).split('').map((x,i,arr) => {
        if(i==0 || i+1==arr.length) return "|";
        else return "";
      });
      return pp;
    }
    if(vrule==='|||'){
      let pp = 'x'.repeat(n+1).split('').map((x) => '|');
      return pp;
    }
    if(1){
      let pp = 'x'.repeat(n+1).split('').map((x) => '');
      return pp;
    }
  }
  __update_rows_by_hrule(rows,hrule){
    var hrule = hrule||'';
    if(hrule==='-'){
      // hrules between rows 
      rows.forEach((p,i,arr) => {
        if(arr.length > 1){
          if(i == 0){ 
            if(p.lower==0) p.lower = 1; 
          }else if(i+1 == arr.length){
            if(p.upper==0) p.upper = 1;
          }else{
            if(p.lower==0) p.lower = 1; 
            if(p.upper==0) p.upper = 1; 
          }
        }
      });
    }
    else if(hrule==='--'){
      rows.forEach((p,i,arr) => {
        if(arr.length){
          if(i==0) {
            if(p.upper==0) p.upper = 1;
          }
          if(i+1==arr.length) {
            if(p.lower==0) p.lower = 1;
          }
        }
      });
    }
    else if(hrule==='---'){
      rows.forEach((p,i,arr) => {
        if(p.upper==0) p.upper = 1;
        if(p.lower==0) p.lower = 1;
      });
    }
    return rows;
  }
  string_to_cellcolor_map(s){
    var cellcolors = new Map();
    if(s){
      let my = this.string_to_array(s);
      for(let j=0; j < my.length; j+=2){
        let key = my[j];
        let val = my[j+1];
        cellcolors.set(key,val);
      }
    }
    return cellcolors;
  }
  hrows_has_items(s,hrows){
    let items = s.split('');
    for(let item of items){
      if(hrows.indexOf(item)>=0){
        return 1;
      }
    }
    return 0;
  }
  aspect_ratio_to_float(aspect_ratio_s){
    if(!aspect_ratio_s){
      return NaN;
    }
    let pp = aspect_ratio_s.split('/').map((x) => parseInt(x)).filter((x) => Number.isFinite(x));
    if(pp.length==2){
      var ratio = pp[1]/pp[0];
    }else{
      var ratio = 1;
    }
    return ratio;
  }
  string_to_aspect_ratio(s,def_s){
    if(!s){
      s = def_s;
    }
    let pp = s.split('/').map((x) => parseInt(x)).filter((x) => Number.isFinite(x)).filter((x) => (x>0));
    if(pp.length==2){
      return pp;
    }else{
      return [1,1];
    }
  }
  name_to_hdgn(name,hdgn){
    // convert a name such as chapter to number 0
    switch(name){
      case 'chapter': return +hdgn;
      case 'section': return +hdgn+1;
      case 'subsection': return +hdgn+2;
      case 'subsubsection': return +hdgn+3;
    }
    return hdgn;
  }
  caption_to_label(s){
    // perform a caption to label lookup on all HDGS blocks
    // TODO
    // this would have required that *all* headings 
    // presented with a label---if it has been set by user--
    // or if not it must be artificially generated,using some
    // predefined algorithm; when this is done, this function
    // can return a user-defined label, or an artificially generated
    // one, by matching the query caption with the actual caption
    // of the heading.
    return 'TODO';
  }
  fetch_ss_from_mode(mode){
    var {id,body} = mode;
    if(id){
      var {body} = this.fetch_from_notes(id);
    }
    if(body){
      var ss = body;
    }else{
      var ss = [];
    }
    return {ss}
  }
  update_style_from_switches(g,name,parent=null){
    if(!parent){
      parent=g;
    }
    if(parent && parent.__switches){ 
      var myswitch = parent.__switches[name];
      if(myswitch){
        g = {...myswitch,...g};
      }
    }
    return g;
  }
  fontify_cjk(style,text) {
    ///
    /// fontify in the style of Latex
    /// 

    /// following names are bit fields, they should be in
    /// agreement with nitrile-preview-cjkfontmap.js
    // const fns_dingbats = 16;
    // const ch_softhyphen = String.fromCodePoint(0xAD);

    //const fontnames = ['jp','tw','cn','kr'];
    var newtext = '';
    var s0 = '';
    var fns0 = 0;
    var a0 = '';
    var font0 = '';
    var other = 0;

    for (var j=0; j < text.length; ++j) {

      var c = text[j];
      var cc = text.codePointAt(j);

      if(this.is_cjk_cc(cc)){
        var fns = cjkfontmap[cc];///fns is a bitmask
      } else {
        var fns = 0;
      }

      // buildup ASCII text
      if(fns == 0 && fns0 == 0){
        a0 += c;
        continue;
      } else {
        if (fns0 == 0) {
          fns0 = fns;
        }
      }

      // flush ASCII text
      if(a0){
        newtext += `${a0}`;
        a0 = '';
      } 

      /// check to see if this char has the same font0 as the last one
      //var fns0 = fns0 & fns; /// bitwise-AND
      if ((fns0=fns0 & fns) != 0) { // bitwise-AND
        /// get the first font: assign 'k' according to the followin rules:
        ////  0b0001 => 0, 0b0010 => 1; 0b0011 => 0; 0b0100 => 2
        var k = 0;
        for (k=0; k < cjkfontnames.length; ++k) {
          if (fns0 & (1 << k)) {
            break;
          }
        }
        var font0 = cjkfontnames[k]; // so we switched to a new 'font0' because the first char could be from tw and the second one from jp and both chars can be styled by jp
        s0 += c;
        continue
      }

      /// by the time we get here the 'c' is a CJK that does
      /// not agree with previous character in the font0 choice,
      /// flush the previous CJK text which is stored with variable 's0' with font choice 'font'
      newtext += this.lang_to_cjk(s0,font0);
      fns0 = 0;
      s0 = '';
      font0 = '';

      /// it is CJK if 'fns' is not zero
      if (fns) {
        /// get the first font: assign 'k' according to the followin rules:
        ////  0b0001 => 0, 0b0010 => 1; 0b0011 => 0; 0b0100 => 2
        var k = 0;
        for (k=0; k < cjkfontnames.length; ++k) {
          if (fns & (1 << k)) {
            break;
          }
        }
        /// pick a font name
        fns0 = fns;
        font0 = cjkfontnames[k];
        s0 = c;
        continue;
      }

      /// we get here if the 'c' is not a CJK
      a0 += c; // add to a0
    }

    /// we get here if we have gone through all characters in 'text' variable
    if(a0){
      newtext += `${a0}`;
    } else if (s0){
      if(1){
        //newtext += `{\\${font0}{${s0}}}`;
        newtext += this.lang_to_cjk(s0,font0);
      }else{
        newtext += s0;
      }
    }
    return newtext;
  }
  /////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////////
  do_phrase(key,style,cnt){
    var txt = '';
    switch (key) {
      case 'em': {
        txt = this.phrase_to_em(style,cnt);
        break;
      }
      case 'b': {
        txt = this.phrase_to_b(style,cnt);
        break;
      }
      case 'i': {
        txt = this.phrase_to_i(style,cnt);
        break;
      }
      case 'u': {
        txt = this.phrase_to_u(style,cnt);
        break;
      }
      case 's': {
        txt = this.phrase_to_s(style,cnt);
        break;
      }
      case 'tt': {
        txt = this.phrase_to_tt(style,cnt);
        break;
      }
      case 'q': {
        txt = this.phrase_to_q(style,cnt);
        break;
      }
      case 'g': {
        txt = this.phrase_to_g(style,cnt);
        break;
      }
      case 'high': {
        txt = this.phrase_to_high(style,cnt);
        break;
      }
      case 'low': {
        txt = this.phrase_to_low(style,cnt);
        break;
      }
      ////////////////////////////////////////////
      ////////////////////////////////////////////
      case 'br': {
        txt = this.phrase_to_br(style,cnt);
        break;
      }
      ////////////////////////////////////////////
      ////////////////////////////////////////////
      case 'ref': {
        txt = this.phrase_to_ref(style,cnt);
        break;
      }
      case 'url': {
        txt = this.phrase_to_url(style,cnt);
        break;
      }
      case 'link': {
        let v;
        if((v=this.re_is_linked_anchor.exec(cnt))!==null){
          txt = this.phrase_to_link(style,v[2],v[1]);
        }else{
          txt = this.phrase_to_link(style,cnt);
        }
        break;
      }
      ///UTF char
      case 'utfchar': {
        txt = this.phrase_to_utfchar(style,cnt);
        break;
      }
      ///UTF data
      case 'utfdata': {
        txt = this.phrase_to_utfdata(style,cnt);
        break;
      }
      ///following will generate some pictures
      case 'colorbutton': {
        txt = this.phrase_to_colorbutton(style,cnt);
        break;
      }
      case 'fbox': {
        txt = this.phrase_to_fbox(style,cnt);
        break;
      }
      case 'hrule': {
        txt = this.phrase_to_hrule(style,cnt);
        break;
      }
      case 'img': {
        txt = this.phrase_to_img(style,cnt);
        break;
      }
      default: {
        txt = this.phrase_to_default(style,cnt);
        break;
      }
    }
    return txt;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  extract_fenced_subtitle(ss){
    let ss1 = [];
    let j = 0;
    for(;j < ss.length; ++j){
      let s = ss[j];
      if(s=='---'){
        break;
      }
      ss1.push(s);
    }
    let sub = this.join_para(ss1);
    ss = ss.slice(j+1);
    return [sub,ss];
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  phrase_to_utfdata(style,cnt){
    let m = unicodedata[cnt];
    if(m && Array.isArray(m)){
      return `${m[0]}`;
    }
    return '';
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  search_label_in_blocks(label){
    for(let block of this.parser.blocks){
      if(block.label && label.localeCompare(block.label)==0){
        return 1;
      }
    }
    return 0;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  choose_image_file(files){
    return null;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  body_is_verse(body){
    const re = /^(\-|\+|\*|[A-Za-z0-9]\.)\s+(.*)$/;
    let s0 = body[0];
    let v = re.exec(s0);
    if(v){
      return true;
    }
    return false;
  }
  cnt_to_dia_phrase_itms(style,cnt){
    var ss = cnt.split(';;');
    var s0 = ss[0];
    if(s0.startsWith('\\')){
    }else{
      ///it is a style
      var style = this.string_to_style(s0,style);
      ss = ss.slice(1);
    }
    return {style,ss};
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  ss_to_plitems(style,ss,ssi){
    var plitems = [];
    var item = null;
    var re_lead = /^(\s*)(.*)$/u;
    ss.forEach((s,i,arr) => {
      let v;
      if((v=re_lead.exec(s))!==null){
        var lead = v[1];
        s = v[2];
      }else{
        var lead = '';
      }
      if((v=this.re_body_is_hyphe.exec(s))!==null){
        item = {};
        item.n = ssi+i;
        item.nblank = 0;
        item.body = [];
        item.lead = lead;
        item.bullet = v[1];
        item.body.push(' '+v[2]+v[3]);
        plitems.push(item);
      }else if((v=this.re_body_is_enume.exec(s))!==null){
        item = {};
        item.n = ssi+i;
        item.nblank = 0;
        item.body = [];
        item.lead = lead;
        item.bullet = v[1];
        item.body.push(' '+v[2]+v[3]);
        plitems.push(item);
      }else if((v=this.re_body_is_dterm.exec(s))!==null){
        item = {};
        item.n = ssi+i;
        item.nblank = 0;
        item.body = [];
        item.lead = lead;
        item.bullet = v[1];
        item.body.push(' '+v[2]+v[3]);
        plitems.push(item);
      }else{
        if(item){
          item.body.push(s);
        }
      }
    });
    return plitems;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  ss_to_backslashed_ss(ss){
    var ss1 = [];
    var ending = '';
    ss.forEach((s) => {
      if(ending.length==0){
        let s1 = ss1.pop();
        s = this.join_line(s1,s); 
      }
      if(s.endsWith('\\\\')){
        s = s.slice(0,-2);
        ending = '\\\\';
      }else{
        ending = '';
      }
      ss1.push(s);
    });
    return ss1;
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  trim_para_by(ss,prefix){
    let o = [];
    ss.forEach((s,i,arr) => {
      if(s.startsWith(prefix)){     
        let n = prefix.length;
        s = s.slice(n);
        o.push(s); 
      }else{
        if(o.length){
          let text = o.pop();
          text = this.join_line(text,s);
          o.push(text);
        }
      }
    });
    return o;
  } 
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  body_to_body(body,re){
    var all = [];
    body.forEach((s)=>{
      let v;
      if((v=re.exec(s))!==null){
        all.push(v[3]);
      }else{
        if(all.length){
          let s1 = all.pop();
          s = this.join_line(s1,s);
          all.push(s);
        }
      }
    })
    return all;
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  body_to_details(ss,ssi){
    let o = [];
    let v;
    let value = '';
    let term = '';
    ss.forEach((s,j,arr) => {
      if(j==0 && ((v=this.re_body_is_details.exec(s))!==null)){
        value = v[1]||'';
        let lines = [];
        let n=ssi+j;
        if(value=='+'){
          term = v[2];
        }else{
          lines.push(v[2]);
        }
        o.push({value,term,lines,n});
      }else if(s.trim()=='\\\\'){
        let lines = [];
        let n=ssi+j;
        o.push({value,term,lines,n});
      }else{
        if(o.length){
          let p = o.pop();
          p.lines.push(s);
          o.push(p);
        }
      }
    });
    return o;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  /// font related
  ///
  /////////////////////////////////////////////////////////////////////////////
  is_cjk_cc(cc){
    var i = 0;
    var j = unicodeblocks.length-1;
    return this.binary_search_unijson(cc,i,j,'cjk');
  }
  binary_search_unijson(num,i,j,member){
    if(i > j){
      return 0;
    }
    if(i==j){
      var m = i;
    }else{
      var m = Math.floor((i+j)/2);
    }
    var blk = unicodeblocks[m];
    if(num >= blk.start && num <= blk.stop){
      return blk['cjk']+blk['other']; 
    }
    if(i == j){
      return 0;
    }
    if(num < blk.start){
      return this.binary_search_unijson(num,i,m-1,member);
    }else{
      return this.binary_search_unijson(num,m+1,j,member);
    }
  }
  find_unicodeblock_blk_from_start(start){
    for(let blk of unicodeblocks){
      if(parseInt(blk.start)==start){ 
        stop = parseInt(blk.stop);
        if(Number.isFinite(start)&&Number.isFinite(stop)){
          return blk;
        }
      }
    }
    return null;
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  to_split_hew(n,hew){
    let k = Math.floor(n/hew);
    let nn = 'n'.repeat(hew).split('').map(s => k);
    let k0 = n - k*hew + k;
    nn[0] = k0;
    let total = 0;
    nn = nn.map(n => {
      let n1 = total;
      let n2 = total+n;
      total = n2;
      return [n1,n2];
    });
    return nn;
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  to_subcaption(key,style){
    var val = '';
    for(let p of style.__subcaptions){
      if(p[0]==key){
        val = p[1];
      }
    }
    return val;
  }
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  to_fig_subtitle(style,subtitle){
    var subtitle = this.uncode(style,subtitle);
    if(style.id){
      var subtitle = `(${style.id}) ${subtitle}`;
    }else{
      var subtitle = `${subtitle}`;
    }
    return subtitle;
  }
}
module.exports = { NitrilePreviewTranslator }
