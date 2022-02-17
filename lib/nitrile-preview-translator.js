'use babel';
'use strict';

const {NitrilePreviewBase} = require('./nitrile-preview-base.js');
const pjson = require('./nitrile-preview-math.json');
const unicodedata = require('./nitrile-preview-unicodedata');
const re_rubyitem = /^(\S+?)\u{30fb}(\S+)/u;
const re_samp  = /^(\s{4})(.*)$/u;
const re_sand  = /^(\s{2})(.*)$/u;
const re_cove  = /^(>)(\s+)(.*)$/u;
const re_cave  = /^(\$)(\s+)(.*)$/u;
const re_plst  = /^(\s*)(-|\+|\*|\d+\.)(\s+)(.*)$/u;
const re_ss_bull = /^(-|\+|\*|>|\d+[\)\.]|[a-zA-Z][\)\.]|\[[\w\s]\]|\([\w\s]\))\s+(.*)$/u;
const re_ruby = /^(\S+?)\u{30fb}(\S+)/u;
const re_phrase = /^&(\w+)\{(.*)\}$/u;
const ar_i_letters = ['', 'i','ii','iii','iv','v','vi','vii','viii','ix','x',
                      'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx',
                      'xxi', 'xxii', 'xxiii', 'xxiv', 'xxv', 'xxvi'];
const ar_I_letters = ['', 'I','II','III','IV','V','VI','VII','VIII','IX','X',
                      'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
                      'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI'];
const ar_a_letters = ['', 'a','b','c','d','e','f','g','h','i','j',
                          'k','l','m','n','o','p','q','r','s','t',
                          'u','v','w','x','y','z'];
const ar_A_letters = ['', 'A','B','C','D','E','F','G','H','I','J',
                          'K','L','M','N','O','P','Q','R','S','T',
                          'U','V','W','X','Y','Z'];
const ar_1_letters = ['', '1','2','3','4','5','6','7','8','9','10',
                          '11','12','13','14','15','16','17','18','19','20',
                          '21','22','23','24','25','26'];
const { cjkfontmap, cjkfontnames } = require('./nitrile-preview-cjkfontmap');
const unicodeblocks = require('./nitrile-preview-unicodeblocks');

//this.re_all_diacritics = /(?<!\\)\\(dot|ddot|bar|mathring|hat|check|grave|acute|breve|tilde)\{([A-Za-z])\}/g;

class NitrilePreviewTranslator extends NitrilePreviewBase {

  constructor(parser) {
    super();
    this.parser=parser;
    this.name='';
    this.latex = '';
    this.pjson = pjson;
    this.idnum_map = {};
    this.chapter_map = {};
    this.otherfont_map = {};
    this.usepackages = new Set();
    //this.my_ss_map = new Map();
    this.re_all_sups = /(?<!\w)([A-Za-z])\^([0-9cni])(?!\w)/g;
    this.re_all_subs = /(?<!\w)([A-Za-z])_([0-9aeoxhklmnpst])(?!\w)/g;
    this.re_all_symbols = /&([A-Za-z][A-Za-z0-9]*);/g;
    this.re_all_symbol_comments = /\[!([A-Za-z][A-Za-z0-9]*)!\]/g;
    this.re_all_diacritics = /(?<!\w)([A-Za-z])~(dot|ddot|bar|mathring|hat|check|grave|acute|breve|tilde)(?!\w)/g;
    this.re_all_mathvariants = /(?<!\w)([A-Za-z])~(mathbb|mathbf|mathit|mathcal)(?!\w)/g;
    this.re_begin_end_fence = /^`{3,}(.*)$/;
    this.re_sep_bb = /\s*(?:\\\\|$)\s*/;
    this.re_hline = /^-{3,}$/;
    this.re_dhline = /^={3,}$/;
    this.re_style = /^\{(.*)\}$/;
    this.re_dl_term       = /^(\w[\w\-\(\)\.\<\>\[\]\|,]*)\s*(.*)$/;//it has to start with a word otherwise it could grab a hyphen minus from a math expression
    this.re_ul_key        = /^([\w\-\(\)\.\<\>\[\]\|,]+)(\s+-|:)(?!\S)(.*)$/;//same as above
    this.re_ul_key_var    = /^\*(.*?)\*(\s+-|:)(?!\S)(.*)$/;//same as above
    this.re_ul_key_verb   = /^``(.*?)``(\s+-|:)(?!\S)(.*)$/;//same as above
    this.re_paragraph_hidden = /^\^([\p{Alphabetic}\p{Number}]+:?)\^$/u;
    this.the_block = null;
    this.my_ref_map = new Map();
    //populate the 'cjkfontmap' array for the given font
    let fonts = this.parser.conf_to_list('fonts');
    for(let s of fonts){
      let ss = s.split('/');
      let fn = ss[0];
      let font = ss[1];
      let start = parseInt(ss[2]);
      let stop = NaN;
      for(let blk of unicodeblocks){
        if(parseInt(blk.start)==start){ 
          stop = parseInt(blk.stop);
          blk.other=1;
          break;
        }
      }
      if(Number.isFinite(start)&&Number.isFinite(stop)){
        let v = cjkfontnames.indexOf(fn);
        if(v >= 0){
          for(let i=start; i<=stop; ++i){
            cjkfontmap[i] |= 1 << v;
          }
        }
        cjkfontnames[v] = font;
      }
    }
  }
  translate_block(block){
    this.the_block = block;
    switch (block.sig) {
      case 'FRNT': return this.do_FRNT(block); break;
      case 'PART': return this.do_PART(block); break;
      case 'CHAP': return this.do_CHAP(block); break;
      case 'HDGS': return this.do_HDGS(block); break;
      case 'CAPT': return this.do_CAPT(block); break;
      case 'PRIM': return this.do_PRIM(block); break;
      case 'PARA': return this.do_PARA(block); break;
      default: break;
    }
    return '';
  }
  do_FRNT(block){
    var {title,label,level,style} = block;
    var text = '';
    if(style.name=='chapter'){
      var text = this.hdgs_to_chapter(title,label,level,style);
    }
    return text;
  }
  do_PART(block){
    var {title,label,level,style} = block;
    var text = this.hdgs_to_part(title,label,level,style);
    return text;
  }
  do_CHAP(block){
    var {title,label,level,style} = block;
    var text = this.hdgs_to_chapter(title,label,level,style);
    return text;
  }
  do_HDGS(block){
    var {hdgn,name,title,label,level,style} = block;
    if(hdgn==1){
      var text = this.hdgs_to_section(title,label,level,style);
    }
    else if(hdgn==2){
      var text = this.hdgs_to_subsection(title,label,level,style);
    }
    else{
      var text = this.hdgs_to_subsubsection(title,label,level,style);
    }
    return text;
  }
  do_CAPT(block){
    var {id,title,label,idnum,idcap,pagenum,bodyrow,body,style} = block;
    body = this.trim_samp_body(body);
    var text = '';
    var o = [];
    o.push('');
    if(id=='@'){
      var text = '';
    }else if(id=='equation'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_equation(title,label,style,body,bodyrow);
    }else if(id=='listing'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_listing(title,label,style,body,bodyrow)
    }else if(id=='figure'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_figure(title,label,style,body,bodyrow);
    }else if(id=='longtabu'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_longtabu(title,label,style,body,bodyrow);
    }else if(id=='column'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_column(title,label,style,body,bodyrow);
    }else if(id=='page'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_page(title,label,style,body,bodyrow);
    }else if(id=='vspace'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_vspace(title,label,style,body,bodyrow);
    }
    return text;
  }
  do_PARA(block){
    var {body,bodyrow,style} = block;
    var title = '';
    var label = '';
    return this.float_to_paragraph(title,label,style,body,bodyrow);
  }
  do_PRIM(block) {
    var {rank,title,body,bodyrow,style} = block;
    var label = '';
    style.rank = rank;
    return this.float_to_primary(title,label,style,body,bodyrow);
  }
  rubify_cjk(text,vmap) {
    vmap = vmap||[]
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
  int_to_letter_i(i){
    return ar_i_letters[i]||'';
  }
  int_to_letter_I(i){
    return ar_I_letters[i]||'';
  }
  int_to_letter_a(i){
    return ar_a_letters[i]||'';
  }
  int_to_letter_A(i){
    return ar_A_letters[i]||'';
  }
  to_1_letter(i){
    return ar_1_letters[i]||'';
  }
  ///
  ///
  ///
  conf_to_float(in_key,def_val){
    in_key = this.name + "." + in_key;
    return this.parser.conf_to_float(in_key,def_val);
  }
  conf_to_int(in_key,def_val){
    in_key = this.name + "." + in_key;
    return this.parser.conf_to_int(in_key,def_val);
  }
  conf_to_bool(in_key,def_val){
    in_key = this.name + "." + in_key;
    return this.parser.conf_to_bool(in_key,def_val);
  }
  conf_to_list(in_key,def_val){
    in_key = this.name + "." + in_key;
    return this.parser.conf_to_list(in_key,def_val);
  }
  conf_to_string(in_key,def_val){
    in_key = this.name + "." + in_key;
    return this.parser.conf_to_string(in_key,def_val);
  }
  conf_to_substring(in_key,def_val){
    in_key = this.name + "." + in_key;
    return this.parser.conf_to_substring(in_key,def_val);
  }
  /////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////////
  do_bundle(style,ss,ssi){
    var key  = '';
    var s0 = ss[0];
    var sn = ss[ss.length-1];
    var re = /^(\w+)(.*)$/;
    if(s0.startsWith("```") && sn.startsWith("```")){
      let s = s0.slice(3);
      let v = re.exec(s);
      if(v){
        key = v[1];
        style = this.string_to_style(v[2],style);///make a copy of the parent 'style'
        let id = style.id;
        style.subtitle = style.subtitle||'';
        if(id && style.subcaptions && style.subcaptions.hasOwnProperty(id)){
          style.subtitle = `(${id}) ${style.subcaptions[id]}`;
        }
        style.row = ssi;
        style.float = key;
      }
      ss = ss.slice(1,-1);
      ssi += 1;
    }
    if(style.restore){
      let name0 = style.id||'';
      name0 = '_'+name0;
      let lineno = parseInt(style.restore)||1;
      if(style.buffers.hasOwnProperty(name0)){
        let ss0 = style.buffers[name0]
        if(ss0 && Array.isArray(ss0) && ss0.length){
          let ss1 = ss.slice(0,lineno-1);
          let ss2 = ss0;
          let ss3 = ss.slice(lineno-1);
          ss = ss1.concat(ss2).concat(ss3);
        }
      }
    }
    if(style.save){
      let name0 = style.id||'';
      name0 = '_'+name0;
      style.buffers[name0] = ss;
    }
    var o = [];
    //update from switch
    if(key=='img'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_img(style,ss,ssi);
    }else if(key=='dia'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_dia(style,ss,ssi);
    }else if(key=='ink'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_ink(style,ss,ssi);
    }else if(key=='fml'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_fml(style,ss,ssi);
    }else if(key=='tab'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_tab(style,ss,ssi);
    }else if(key=='par'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_par(style,ss,ssi);
    }else{
      key = 'vtm';
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_vtm(style,ss,ssi);
    }
    ///assign 'key' to every member of 'o'
    return o;
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
    const re = /(?:`{1,2})(.*?)(?:`{1,2})|(?<!\w)\*\*([\w\-\.\,:\(\)\[\]\/]+)\*\*(?!\w)|(?<!\w)\*([\w\-\.\,:\(\)\[\]\/]+)\*(?!\w)|\\\((.*?)\\\)|\\\[(.*?)\\\]/gs;
    while ((v = re.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
      var txt = this.unphrase(style,txt);
      newtext += txt;
      if (v[1] !== undefined) {
        ///literal_to_verb
        var s = v[1]
        var txt = this.literal_to_verb(style,s);
        newtext += txt;
                
      } else if (v[2] !== undefined) {
        ///literal_to_strong
        var s = v[2]
        var txt = this.literal_to_strong(style,s);
        newtext += txt;
                
      } else if (v[3] !== undefined) {
        ///literal_to_var
        var s = v[3]
        var txt = this.literal_to_var(style,s);
        newtext += txt;
                
      } else if (v[4] !== undefined) {
        ///literal_to_math
        var s = v[4];
        var txt = this.literal_to_math(style,s);
        newtext += txt;

      } else if (v[5] !== undefined) {
        ///literal_to_dmath
        var s = v[5];
        var txt = this.literal_to_dmath(style,s);
        newtext += txt;

      }
      start_i = re.lastIndex;
    }
    var txt = line.slice(start_i);
    var txt = this.unphrase(style,txt);
    newtext += txt;
    return newtext;
  }
  unphrase (style,line) {
    // WIll recognized something like,
    //
    //    &em{   }       
    //    {{     }}
    //
    if(typeof line==='string'){
    }else{
      line = `${line}`;
    }
    ///process the phrase such as &ruby{}, &url, ...
    var v;
    var line = line || '';
    var start_i = 0;
    var newtext = '';
    var k = 0;
    var txt = '';
    const re = /(?<!\\)(&[A-Za-z]+\{)/gs; //cannot be global because it is used recursively
    while ((v = re.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
      var txt = this.flatten(style,txt);
      newtext += txt;
      if (v[1] !== undefined) {
        //&quad{}
        //&qquad{}
        //&sub{}
        //&sup{}
        //&br{}
        //&em{...}
        //&b{...}
        //&i{...}
        //&u{...}
        //&tt{...}
        var head_text = v[1];
        i += head_text.length;
        var key = head_text.slice(1,head_text.length-1);
        ///
        ///1st-argument
        ///
        start_i = this.extract(line,i);
        var scan_text = line.slice(i,start_i);
        if(scan_text.endsWith('}')){
          var cnt = scan_text.slice(0,scan_text.length-1);
        }else{
          var cnt = scan_text.slice(0,scan_text.length);
        }
        ///
        ///call the infamous 'do_phrase'
        ///
        txt = this.do_phrase(key,style,cnt);
        newtext += txt;
        ///
        ///start search after the last argument
        ///
        re.lastIndex = start_i;
        continue;
      
      } else {
        start_i = re.lastIndex;

      }
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
    var txt = this.smooth(txt);
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
        let text = s.trimLeft();
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
  ss_to_tabular_rows(style,ss,ssi){
    var data = [];
    var subtitles = [];
    // extract subtitle from bottom
    ///
    const re_bb = /^\\\\$/;
    const re_hp = /^&$/;
    const re_it = /^&\s+(.*)$/;
    const re_hline = this.re_hline;
    const re_dhline = this.re_dhline;
    if(style.direction=='column'){
      let n = 0;//column
      let k = 0;//row
      ss.forEach((s,i) => {
        let v;
        if((v=re_bb.exec(s))!==null){
          n++;
          k=0;
        } else if((v=re_hp.exec(s))!==null){
          k++;
          let p = {};
          p.raw = '';
          p.row = ssi+i;
          if(!data[k-1]){
            data[k-1] = [];
          }
          data[k-1][n-1] = p;
        } else if((v=re_it.exec(s))!==null){
          k++;
          let p = {};
          p.raw = v[1];
          p.row = ssi+i;
          if(!data[k-1]){
            data[k-1] = [];
          }
          data[k-1][n-1] = p;
        } else {
          if(n>0 && k>0){
            let p = data[k-1][n-1];
            p.raw = this.join_line(p.raw,s.trim());
          }
        } 
      })
    }else if(style.direction=='row'){
      let n = 0;//column
      let k = 0;//row
      ss.forEach((s,i) => {
        let v;
        if((v=re_bb.exec(s))!==null){
          k++;
          n=0;
        } else if((v=re_hp.exec(s))!==null){
          n++;
          if(n>0 && k>0){
            let p = {};
            p.raw = '';    
            p.row = ssi+i;
            if(!data[k-1]){
              data[k-1] = [];
            }
            data[k-1][n-1] = p;
          }
        } else if((v=re_it.exec(s))!==null){
          n++;
          if(n>0 && k>0){
            let p = {};
            p.raw = v[1];    
            p.row = ssi+i;
            if(!data[k-1]){
              data[k-1] = [];
            }
            data[k-1][n-1] = p;
          }
        } else {
          if(n>0 && k>0){
            let p = data[k-1][n-1];
            p.raw = this.join_line(p.raw,s.trim());
          }
        } 
      })
    }else{
      let pp = [];
      // fill-up each row first before moving to next row, the next
      /// row is marked by the presence of a hline, or a double-backslash
      ss.forEach((s,i) => {
        let v;
        if((v=re_hline.exec(s))!==null){
          pp = [];
          pp.hline = 1;
          data.push(pp);
        } else if((v=re_dhline.exec(s))!==null){
          pp = [];
          pp.hline = 2;
          data.push(pp);
        } else {
          var re = /\s*(?:\\\\|$)\s*/;
          var ss = s.split(re);
          pp = ss.map((raw) => {
            let row = ssi+i;
            return {raw,row};
          });
          data.push(pp);
        }
      })
    } 
    // Set is so that each table row is the same number of elements
    // as the long row
    var max_n = data.reduce((acc,cur) => Math.max(acc,cur.length),0);
    data = data.map((pp) => {
      while(pp.length < max_n) {
        if(pp.length){
          let raw = '';
          pp.push({raw});
        }else{
          let raw = '';
          pp.push({raw});
        }
      }
      return pp;
    })
    // now scan for any rows that looks like a 'hline' or 'dhline' and set
    // the 'upper' or 'lower' field of that 'pp' 
    var rows = [];
    var upper = 0;
    for(var pp of data){
      if(pp.hline==2){
        upper = 2;
        continue;
      }
      else if(pp.hline==1){
        upper = 1;
        continue;
      }
      else{
        pp.lower = 0;
        pp.upper = upper;
        upper = 0;
        rows.push(pp);
      }
    }
    // fix the last row
    if(upper && rows.length){
      var pp1 = rows[rows.length-1];
      pp1.lower = upper;
    }
    // assign 'lower'
    for(var j=0; j < rows.length-1; ++j){
      var pp = rows[j];
      var pp1 = rows[j+1];
      pp.lower = pp1.upper;
    }
    // assign 'left' and 'right'
    var vborders = this.string_to_int_array(style.vborder);
    vborders.forEach((x) => {
      rows.forEach((pp) => {
        pp.forEach((p,i) => {
          if(i==x){
            p.left = 1;
          }
        });
      });
    });
    vborders.forEach((x) => {
      rows.forEach((pp) => {
        pp.forEach((p,i) => {
          if((i+1)==x){
            p.right = 1;
          }
        })
      })
    });
    // return
    let subtitle = this.join_para(subtitles);
    return {rows,subtitle};
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
  // recognize images and subtiltes inside a 'img' fence
  ///
  ////////////////////////////////////////////////////////////////////
  ss_to_img_srcs_and_subtitle(body){
    body = this.join_backslashed_lines(body);
    var subtitle = '';
    var image = '';
    const re_image = /^\\image\s+(.*)$/;
    const re_subtitle = /^\\subtitle\s+(.*)$/;
    var v;
    body.forEach((s) => {
      if((v=re_image.exec(s))!==null){
        image = v[1];
      }else if((v=re_subtitle.exec(s))!==null){
        subtitle = v[1];
      }
    })
    subtitle = subtitle.trim();
    var srcs = this.string_to_srcs(image);
    return [srcs,subtitle];
  }
  ////////////////////////////////////////////////////////////////////
  //
  // recognize & as starting a subtitle
  ///
  ////////////////////////////////////////////////////////////////////
  ss_to_canvas_itms(style,ss,ssi){
    const re_image = /^\\image\s+(.*)$/;
    const re_color = /^\\color\s+(.*)$/;
    const re_edit = /^\\edit\b/;
    let v;
    let itms = {};
    itms.imgsrc = '';
    itms.colors = [];
    itms.edit = 0;
    for(let s of ss){
      if((v=re_image.exec(s))!==null){
        let imgsrc = v[1];
        if(imgsrc.startsWith('"')&&imgsrc.endsWith('"')){
          imgsrc = imgsrc.slice(1,-1);
        }
        itms.imgsrc = imgsrc;
      }else if((v=re_color.exec(s))!==null){
        let color = v[1];
        itms.colors.push(color);
      }else if((v=re_edit.exec(s))!==null){
        itms.edit = 1;
      }
    }
    return itms;
  }
  ////////////////////////////////////////////////////////////////////
  //
  // recognize & as starting a subtitle
  ///
  ////////////////////////////////////////////////////////////////////
  ss_to_figure_itms(style,ss,ssi){
    var itms = [];
    var text = '';
    var partition = this.assert_int(style.partition,0);
    var k = 0;
    var i = 0;
    while(i < ss.length) {
      var i0 = i;//save i
      var [d,ic] = this.try_extract_bundle(style,ss,i);
      if(ic==0){
        var s = ss[i];     
        i++;
        if(s=='\\\\'){
          let itm = {};
          itm.type = '\\\\';
          itms.push(itm);
          k = 0;
          text = '';
        }else{
          text = this.join_line(text,s);
        }
      }else{
        i+=ic;
        //d = this.trim_samp_body(d);//do not trim the body, it is significant to each body
        let o = this.do_bundle(style,d,ssi+i0);///the parent 'style' is passed in and 'do_bundle()' will duplicate it
        for(let j=0; j < o.length; ++j){
          if(partition && k == partition){
            let itm = {};
            itm.type = '\\\\';
            itms.push(itm);
            k = 0;
          } 
          let itm = o[j];
          text = text.trim();
          if(text){
            ///overwrite the 'sub' if text is non-empty
            itm.sub = this.uncode(style,text);
            text = '';
          }
          itm.type = 'bundle';
          itm.row = ssi + i0;
          itms.push(itm);
          k++;
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
  ss_to_first_bundle(style,ss,ssi){
    var [d,ic] = this.try_extract_bundle(style,ss,0);
    return d;
  }
  ss_to_all_bundles(style,ss,ssi){
    var itms = [];
    var i = 0;
    while(i < ss.length){ 
      var [d,ic] = this.try_extract_bundle(style,ss,i);
      if(ic==0){
        i++;
      }else{
        i+=ic;
        let ss = d;
        itms.push({ss});
      }
    }
    return itms;
  }
  addto_vmap(ss,vmap) {
    ///return items
    let re = /^(\*|-|\+)\s+(.*)$/;
    let itms = [];
    if(vmap){
      ss.forEach(s => {
        s = s.trim();
        let v;
        if ((v = re_rubyitem.exec(s)) !== null) {
          let rb = v[1];
          let rt = v[2];
          let raw = s;
          vmap.push({rb, rt, raw});
        }
      })
    }
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
  plitems_to_itemize(plitems) {
    var num = 0;
    var levels = [];
    var lead = '';
    var bull = '';
    var key = '';
    var keytype = '';
    var sep = '';
    var type = '';
    var ending = '';
    var value = '';
    var action = '';
    var more = [];
    var text = '';
    var body = [];
    var s = '';
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
        if (bullet[0] == '-' || bullet[0] == 'ー'){
          bull = 'UL';
          value = '';
          key = '';
          keytype = '';
          sep = '';
          let v0;
          let body0 = plitem.body[0]||'';
          body = plitem.body;
          text = body.join('\n');
        } else if (bullet[0] == '*'){
          bull = 'OL';
          value = '';
        } else if (bullet[0] == '+' || bullet[0] == '＋' ){
          bull = 'DL';
          value = '';
          let v0;
          if(plitem.body.length==1 && (v0=this.re_dl_term.exec(plitem.body[0].trim()))!==null){
            value = v0[1];
            body = [v0[2]];
            text = body.join('\n');
          }else{
            value = plitem.body.slice(0,1).join('\n');
            body = plitem.body.slice(1);
            text = plitem.body.slice(1).join('\n');
          }
          type = '';
        } else {
          bull = 'OL';
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
        item.type = type; //'A', 'a', '0'
        item.key = key;
        item.keytype = keytype;
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
        item.keytype = keytype;
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
        item.keytype = keytype;
        item.sep = sep;
        item.value = value;
        item.ending = ending;
        item.more = [];
        item.row = plitem.n;
        itemize.items.push(item);
        itemize.nblank += nblank;///the itemize's nblank member is the accumulation of all its items
      }
    }
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
  update_style_from_switches(style,name){
    var myswitch = style.switches[name];
    if(myswitch){
      style = {...myswitch,...style};
    }
    return style;
  }
  fontify_cjk(text) {
    ///
    /// fontify in the style of Latex
    /// 

    /// following names are bit fields, they should be in
    /// agreement with nitrile-preview-cjkfontmap.js
    const fns_dingbats = 16;
    const ch_softhyphen = String.fromCodePoint(0xAD);

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
  ///
  ///'head' is the entire text of '```img' plus the entire style text
  ///'i' is the location with the cluster array where '```img' is located
  ///
  try_extract_bundle(style,ss,i){
    const i0 = i;
    const re = /^(\s*)```(.*)$/;
    var d = [];
    var ic = 0;
    const s0 = ss[i]||'';
    var v=re.exec(s0);
    if(v){
      d.push(s0);
      var spaces = v[1];
      //var g = this.string_to_style(v[3],style);//extract_bundle()
      i++;       
      for(; i < ss.length; ++i){
        let s = ss[i];      
        if(s.trim()=='```'){
          d.push(s);
          i++;
          break;
        }else{
          d.push(s);
        }
      }
      ///trim the body to the edge of the first fence
      d = d.map((s) => s.slice(spaces.length));
      ic = i - i0;
    }
    ///note that 'key' could be an empty string, so it is better to check for 'ic' for a presence of a bundle
    return [d,ic];
  }
  /////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////////
  do_phrase(key,style,cnt){
    var txt = '';
    switch (key) {
      case 'dfn': {
        txt = this.phrase_to_dfn(style,cnt);
        break;
      }
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
      case 'small': {
        txt = this.phrase_to_small(style,cnt);
        break;
      }
      case 'mono': {
        txt = this.phrase_to_mono(style,cnt);
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
        txt = this.phrase_to_link(style,cnt);
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
      case 'dia': {
        txt = this.phrase_to_dia(style,cnt);
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
  to_capt_idnum(name,block){
    var idnum = 0;
    if(block){
      var chapnum = block.style.chapnum;
      var pp = null;
      if(typeof chapnum == 'number'){
      }else{
        chapnum = 0;
      }
      pp = this.chapter_map[chapnum];
      if(pp){
      }else{
        pp = {};
        pp.equation_num = 0;
        pp.figure_num = 0;
        pp.table_num = 0;
        pp.listing_num = 0;
        this.chapter_map[chapnum] = pp;
      }
      if(name){
        if(pp.hasOwnProperty(name)){
          idnum = pp[name];
          if(Number.isFinite(idnum)){
            idnum++;
            pp[name] = idnum;
          }else{
            idnum = 1;
            pp[name] = idnum;
          }
        }else{
          idnum = 1;
          pp[name] = idnum;
        }
      }
      if(chapnum){
        return `${chapnum}.${idnum}`;
      }else{
        return ''+idnum;
      }
    }else{
      return ''+idnum;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  build_default_idnum_map(){
    for(let block of this.parser.blocks){
      let saveas = block.style.saveas;
      if(block.sig=='CAPT'){
        switch(block.id){
          case 'equation': {
            let n = parseInt(block.style.n)||0;
            if(n){
              block.style.idcap = "Equation";
              let labels = this.string_to_array(block.label);
              for(let j=0; j < n; ++j){
                let idnum = this.to_capt_idnum("Equation",block);
                block.style["idnum"+j] = idnum;
                if(j < labels.length){
                  let label = labels[j];
                  this.idnum_map[label] = {idnum,saveas};
                  block.style["label"+j] = label;
                }else{
                  block.style["label"+j] = '';
                }
              }
              block.style.idnum = block.style.idnum0;//ensure that 'idnum' is set
              block.style.label = block.style.label0;//ensure that 'label' is set
            }else{
              let idnum = this.to_capt_idnum("Equation",block);
              block.style.idnum = idnum;
              block.style.idcap = "Equation";
              if(block.label){
                this.idnum_map[block.label] = {idnum,saveas};
                block.style.label = block.label;
              }else{
                block.style.label = '';
              }
              block.style.idnum0 = block.style.idnum;
              block.style.label0 = block.style.label;
            }
            break;
          }
          case 'listing': {
            let idnum = this.to_capt_idnum("Listing",block);
            block.style.idnum = idnum;
            block.style.idcap = "Listing";
            if(block.label){
              this.idnum_map[block.label] = {idnum,saveas};
              block.style.label = block.label;
            }else{
              block.style.label = '';
            }
            break;
          }
          case 'figure': {
            let idnum = this.to_capt_idnum("Figure",block);
            block.style.idnum = idnum;
            block.style.idcap = "Figure";
            if(block.label){
              this.idnum_map[block.label] = {idnum,saveas};
              block.style.label = block.label;
            }else{
              block.style.label = '';
            }
            break;
          }
          case 'longtabu': {
            let idnum = this.to_capt_idnum("Table",block);
            block.style.idnum = idnum;
            block.style.idcap = "Table";
            if(block.label){
              this.idnum_map[block.label] = {idnum,saveas};
              block.style.label = block.label;
            }else{
              block.style.label = '';
            }
            break;
          }
        }
      }else if(block.sig=='PART'){
        let {hdgn,title,label,level,style} = block;
        let idnum = '';
        if(style.partnum){
          idnum = ""+style.partnum;
        }
        block.style.idnum = idnum;
        block.style.idcap = '';
        if(label){
          this.idnum_map[label] = {idnum,saveas};
          block.style.label = label;
        }else{
          block.style.label = '';
        }
      }else if(block.sig=='CHAP' || (block.sig=='FRNT' && block.style.name=='chapter')){
        let {hdgn,title,label,level,style} = block;
        let idnum = '';
        if(style.chapnum){
          idnum = ""+style.chapnum;
        }
        block.style.idnum = idnum;
        block.style.idcap = '';
        if(label){
          this.idnum_map[label] = {idnum,saveas};
          block.style.label = label;
        }else{
          block.style.label = '';
        }
      }else if(block.sig=='HDGS'){
        let {hdgn,name,title,label,level,style} = block;
        let idnum = '';
        if(style.chapnum){
          idnum = ""+style.chapnum+"."+level;
        }else{
          idnum = ""+level;
        }        
        block.style.idnum = idnum;
        block.style.idcap = '';
        if(label){
          this.idnum_map[label] = {idnum,saveas};
          block.style.label = label;
        }else{
          block.style.label = '';
        }
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  build_default_pagenum_map(){
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.sig=='CHAP' || block.sig=='PART' || (block.sig=='FRNT' && block.style.name=='chapter')){
        pp = [];
        pp.push({block});
        o.push(pp);
      }else if(block.sig=='CAPT' && block.id=='page'){
        pp = [];
        pp.push({block});
        o.push(pp);
      }else if(block.sig=='FRNT'){
        //ignore any unrecognized FRNT block
      }else{
        pp.push({block});  
      }
    }
    ///
    ///remove empty pages
    ///
    o = o.filter((pp) => pp.length);
    ///
    ///add article and page number
    ///
    o.forEach((pp,i) => {
      var id = i+1;
      var pagenum = id;
      ///look for the presence of any block.label and then match it with the current page number and save
      ///this information to this.idnum_map.
      pp.pagenum = pagenum;
      pp.forEach((p) => {
        if(p.block){
          p.block.style.pagenum = pagenum;
        }  
      });
    });
    return o;
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
  ss_to_plitems(ss,ssi){
    var plitems = [];
    var item = null;
    ss.forEach((s,i,arr) => {
      let v;
      if((v=re_plst.exec(s))!==null){
        item = {};
        item.n = ssi+i;
        item.nblank = 0;
        item.body = [];
        item.lead = v[1];
        item.bullet = v[2];
        item.body.push(' '+v[3]+v[4]);
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
  ss_to_backslashed_ss(style,ss){
    var text = this.join_para(ss);
    var re = this.re_sep_bb;    
    var ss = text.split(re);
    var ss = ss.map((s) => this.uncode(style,s));
    return ss;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  is_samp(ss){
    return ss.length && re_samp.test(ss[0]);
  }
  is_cove(ss){
    return ss.length && re_cove.test(ss[0]);
  }
  is_cave(ss){
    return ss.length && re_cave.test(ss[0]);
  }
  is_sand(ss){
    return ss.length && re_sand.test(ss[0]);
  }
  is_plst(ss){
    return ss.length && re_plst.test(ss[0]);
  }
  is_bundle(ss){
    var n = ss.length;
    var s0 = ss[0];
    var sz = ss[n-1];
    if(n >= 2 && s0.startsWith('```') && sz.startsWith('```')){
      return true;
    }else{
      return false;
    }
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  ss_to_cove(ss,ssi){
    let o = [];
    ss.forEach((s,i,arr) => {
      let v = re_cove.exec(s);
      if(v){
        let text=v[3]; 
        let n=ssi+i;
        o.push({text,n});
      }else{
        if(o.length){
          let p = o.pop();
          p.text = this.join_line(p.text,s);
          o.push(p);
        }
      }
    });
    return o;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  ss_to_samp(ss,ssi){
    var all = [];
    ss.forEach((s,i,arr) => {
      let text = s.slice(4);//remove the first 4 characters
      let n = ssi+i;
      all.push({text,n});
    });
    return all;
  }  
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  ss_to_sand(ss,ssi){
    var all = [];
    ss.forEach((s,i,arr) => {
      let text = s.slice(2);//remove the first 2 characters
      let n = ssi+i;
      all.push({text,n});
    });
    return all;
  }  
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  ss_to_cave(ss,ssi){
    let o = [];
    ss.forEach((s,i,arr) => {
      let v = re_cave.exec(s);
      if(v){
        let text=v[3]; 
        let n=ssi+i;
        o.push({text,n});
      }else{
        if(o.length){
          let p = o.pop();
          p.text = this.join_line(p.text,s);
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
  get_other_font_for_cc(cc){
    return '';
  }
}
module.exports = { NitrilePreviewTranslator }
