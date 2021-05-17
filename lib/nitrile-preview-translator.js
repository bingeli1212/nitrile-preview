'use babel';

const {NitrilePreviewBase} = require('./nitrile-preview-base.js');
const pjson = require('./nitrile-preview-math.json');
const re_hline = /^-{3,}$/;
const re_hhline = /^={3,}$/;
const re_hline_or_hhline = /^(={3,}|-{3,})$/;
const re_rubyitem = /^(\S+?)\u{30fb}(\S+)/u;
const re_ss_bull = /^(-|\+|\*|>|\d+[\)\.]|[a-zA-Z][\)\.]|\[[\w\s]\]|\([\w\s]\))\s+(.*)$/u;
const re_ruby = /^(\S+?)\u{30fb}(\S+)/u;
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
const { cjkfontmap, cjkfontnames} = require('./nitrile-preview-cjkfontmap');

//this.re_all_diacritics = /(?<!\\)\\(dot|ddot|bar|mathring|hat|check|grave|acute|breve|tilde)\{([A-Za-z])\}/g;

class NitrilePreviewTranslator extends NitrilePreviewBase {

  constructor(parser) {
    super();
    this.parser=parser;
    this.name='';
    this.program = '';
    this.pjson = pjson;
    this.usepackages = new Set();
    this.my_ss_map = new Map();
    this.re_all_sups = /(?<!\w)([A-Za-z])\^([0-9cni])(?!\w)/g;
    this.re_all_subs = /(?<!\w)([A-Za-z])_([0-9aeoxhklmnpst])(?!\w)/g;
    this.re_all_symbols = /&([A-Za-z][A-Za-z0-9]*);/g;
    this.re_all_symbol_comments = /\[!([A-Za-z][A-Za-z0-9]*)!\]/g;
    this.re_all_diacritics = /(?<!\w)([A-Za-z])~(dot|ddot|bar|mathring|hat|check|grave|acute|breve|tilde)(?!\w)/g;
    this.re_all_mathvariants = /(?<!\w)([A-Za-z])~(mathbb|mathbf|mathit|mathcal)(?!\w)/g;
    this.re_begin_end_fence = /^`{3,}(.*)$/;
    this.re_hline = /^-{1,}$/;
    this.re_dhline = /^={1,}$/;
    this.re_style = /^\{(.*)\}$/;
    this.the_block = null;
  }
  translate_block(block){
    this.the_block = block;
    switch (block.sig) {
      case 'HDGS': return this.do_HDGS(block); break;
      case 'SAMP': return this.do_SAMP(block); break;
      case 'PRIM': return this.do_PRIM(block); break;
      case 'PARA': return this.do_PARA(block); break;
      case 'PLST': return this.do_PLST(block); break;
      case 'HRLE': return this.do_HRLE(block); break;
      default: break;
    }
    return '';
  }
  do_HDGS(block){
    var {hdgn,name,title,label,style} = block;
    var style = this.update_style_from_switches(style,'HDGS')
    var o = [];
    o.push('');
    if(name=='section'){
      hdgn += 1;
    }else if(name=='subsection'){
      hdgn += 2;
    }else if(name=='subsubsection'){
      hdgn += 3;
    }
    if(hdgn==0 && name=='part'){
      var text = this.hdgs_to_part(title,label,style);
    }else if(hdgn==0 && name=='chapter'){
      var text = this.hdgs_to_chapter(title,label,style);
    }else if(hdgn==1){
      var text = this.hdgs_to_section(title,label,style);
    }
    else if(hdgn==2){
      var text = this.hdgs_to_subsection(title,label,style);
    }
    else{
      var text = this.hdgs_to_subsubsection(title,label,style);
    }
    return text;
  }
  do_SAMP(block){
    var {id,title,label,body,style} = block;
    var style = this.update_style_from_switches(style,'SAMP');
    body = this.trim_samp_body(body);
    if(!id && style.id){
      id = style.id; 
    }
    var o = [];
    o.push('');
    if(id=='@'){
      var text = '';
    }else if(id=='equation'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_equation(title,label,style,body);
    }else if(id=='listing'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_listing(title,label,style,body)
    }else if(id=='figure'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_figure(title,label,style,body);
    }else if(id=='table'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_table(title,label,style,body);
    }else if(id=='longtable'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_longtable(title,label,style,body);
    }else if(id=='columns'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_columns(title,label,style,body);
    }else if(id=='blockquote'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_blockquote(title,label,style,body);
    }else if(id=='tabbing'){
      var style = this.update_style_from_switches(style,id);
      var text = this.float_to_tabbing(title,label,style,body);
    }else{
      var style = this.update_style_from_switches(style,'sample');
      var text = this.float_to_sample(title,label,style,body);
    }
    return text;
  }
  do_PLST(block){
    var {plitems,nblank,para,style} = block;
    var itemize = this.plitems_to_itemize(plitems,style);
    var title = '';
    var label = '';
    return this.float_to_itemize(title,label,style,itemize,nblank);
  }
  do_PARA(block){
    var {body,style} = block;
    var title = '';
    var label = '';
    return this.float_to_paragraph(title,label,style,body);
  }
  do_PRIM(block) {
    var {rank,title,body,style} = block;
    var label = '';
    return this.float_to_primary(title,label,style,body,rank);
  }
  rubify_cjk(src,vmap) {
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
    src = src || '';
    while (j < src.length) {
      i0 = src.length;
      found = 0;
      if(vmap){
        for (var rubyitem of vmap) {
          var {rb,rt} = rubyitem;
          var i = src.indexOf(rb,j);
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
        out += src.slice(j,i0);
        out += this.ruby_markup(rb,rt);//own method
        j = i0 + rb.length;
      } else {
        /// we are done, none of the substrings exists!
        out += src.slice(j);
        j = src.length;
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
  replace_sub_strings(src, map) {
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
    src = src || '';
    while (j < src.length) {
      i0 = src.length;
      k0 = map.length;
      for (k = 0; k < map.length; k += 2) {
        var str1 = map[k];
        var str2 = map[k + 1];
        var i = src.indexOf(str1, j);
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
        out += src.slice(j, i0);
        out += str2;
        j = i0 + str1.length;
      } else {
        /// we are done, none of the substrings exists!
        out += src.slice(j);
        j = src.length;
      }
    }
    return out;
  }
  to_i_letter(i){
    return ar_i_letters[i]||'';
  }
  to_I_letter(i){
    return ar_I_letters[i]||'';
  }
  to_a_letter(i){
    return ar_a_letters[i]||'';
  }
  to_A_letter(i){
    return ar_A_letters[i]||'';
  }
  to_1_letter(i){
    return ar_1_letters[i]||'';
  }
  ///
  ///
  ///
  conf_to_float(in_key,def_val){
    return this.parser.conf_to_float(in_key,def_val);
  }
  conf_to_int(in_key,def_val){
    return this.parser.conf_to_int(in_key,def_val);
  }
  conf_to_list(in_key,def_val){
    return this.parser.conf_to_list(in_key,def_val);
  }
  conf_to_string(in_key,def_val){
    return this.parser.conf_to_string(in_key,def_val);
  }
  conf_to_substring(in_key,def_val){
    return this.parser.conf_to_substring(in_key,def_val);
  }
  /////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////////
  do_fence(key,style,body){
    if(style.load){
      let name0 = style.load;
      let ss0 = this.fetch_ss_from_ss_map(name0);
      if(ss0 && ss0.length){
        body = ss0.concat(body);
      }
    }
    if(style.save){
      let name0 = style.save;
      this.my_ss_map.set(name0,body);
    }
    var o = [];
    var sub = '';
    if(style.subtitle){
      [sub,body] = this.extract_fenced_subtitle(body);
      sub = this.uncode(style,sub);
    }
    //update from switch
    if(key==='img'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_img(style,body);
    }else if(key==='diagram'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_diagram(style,body);
    }else if(key==='diagrams'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_diagrams(style,body);
    }else if(key==='ink'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_ink(style,body);
    }else if(key==='displaymath'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_displaymath(style,body);
    }else if(key=='tabular'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_tabular(style,body);
    }else if(key=='lines'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_lines(style,body);
    }else if(key=='verbatim'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_verbatim(style,body);
    }else if(key=='center'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_center(style,body);
    }else if(key=='flushright'){
      style = this.update_style_from_switches(style,key);
      o = this.fence_to_flushright(style,body);
    }
    o.forEach((p) => {
      p.sub = sub;
    })
    return o;
  }
  untext(style,body) {
    var all = [];
    var ss = [];
    var is_in_fence = 0;
    for(var s of body) {
      if(this.re_begin_end_fence.test(s.trimLeft())){
        if(!is_in_fence){
          if(ss.length){
            let text = this.join_para(ss);
            text = this.uncode(style,text);
            all.push(text);
          }
          ss = [];
          ss.push(s);
          is_in_fence = 1;
          continue;
        }else{
          ///end the previous fence
          ss.push(s);
          ss = this.trim_samp_body(ss);
          let [key,g,ss1] = this.extract_fenced_cluster(ss,0,style);
          ss1 = this.trim_samp_body(ss1);
          let o = this.do_fence(key,g,ss1);
          for(let j=0; j < o.length; ++j){
            all.push(o[j].img);
          }
          ss = [];
          is_in_fence = 0;
        }
      }else{
        ss.push(s);
      }
    }
    if(ss.length){
      let text = this.join_para(ss);
      text = this.uncode(style,text);
      all.push(text);
    }
    return all.join('\n');
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
    //const re = /``(.*?)``|`(.*?)`|(\\[A-Za-z0-9_]+\[[^\[\]]*\])|(\\[A-Za-z0-9]+\{[^\{\}]*\})|(\\[A-Za-z0-9_]+)/gs;
    const re = /``(.*?)``|`(.*?)`/gs;
    while ((v = re.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
      var txt = this.unphrase(style,txt);
      newtext += txt;
      if (v[1] !== undefined) {
        var s = v[1]
        var txt = this.literal_to_double(style,s);
        newtext += txt;
        
      } else if (v[2] !== undefined) {
        var s = v[2]
        var txt = this.literal_to_single(style,s);
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
    style = style||{};
    ///process the phrase such as &ruby{}, &url, ...
    var v;
    var line = line || '';
    var start_i = 0;
    var newtext = '';
    var k = 0;
    var txt = '';
    const re = /(?<!\\)(&[A-Za-z]+\{)|(?<!\\)(\{\{)/gs; //cannot be global because it is used recursively
    while ((v = re.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
      var txt = this.unescape(style,txt);
      newtext += txt;

      if (v[1] !== undefined) {

        //&quad{}
        //&qquad{}
        //&sub{}
        //&sup{}
        //&frac{}
        //&br{}
        //&em{...}
        //&b{...}
        //&i{...}
        //&u{...}
        //&tt{...}

        var head_text = v[1];
        i += head_text.length;
        var key = head_text.slice(1,head_text.length-1);

        ///1st-argument
        start_i = this.extract(line,i);
        var scan_text = line.slice(i,start_i);
        if(scan_text.endsWith('}')){
          var cnt = scan_text.slice(0,scan_text.length-1);
        }else{
          var cnt = scan_text.slice(0,scan_text.length);
        }
        ///2nd-argument
        var next_i = this.extract2(line,start_i);
        if(next_i>start_i){
          var cnt2 = line.slice(start_i+1,next_i-1);
          start_i = next_i;
        }else{
          var cnt2 = '';
        }
        ///3rd-argument
        var next_i = this.extract2(line,start_i);
        if(next_i>start_i){
          var cnt3 = line.slice(start_i+1,next_i-1);
          start_i = next_i;
        }else{
          var cnt3 = '';
        }
        ///
        ///always call this function with three cnt,cnt2,cnt3
        ///
        // each 'cnt' would have already been unphrased before passing to each phrase_to_XXX
        cnt = this.unphrase(style,cnt);
        cnt2 = this.unphrase(style,cnt2);
        cnt3 = this.unphrase(style,cnt3);
        /*
        ***IMPORTANT: this should've been taken care of inside each phrase_to_XXX function
        if(cnt.startsWith('#')){
          let name1 = cnt.slice(1);
          let ss1 = this.fetch_ss_from_ss_map(name1);
          if(ss1 && ss1.length){
            cnt = ss1.join('\n');
          }
        }
        */
        ///
        ///call the infamous 'do_phrase'
        ///
        txt = this.do_phrase(key,style,cnt,cnt2,cnt3);
        newtext += txt;
        ///
        ///start search after the last argument
        ///
        re.lastIndex = start_i;
        continue;
      
      } else if (v[2] !== undefined) {
        i+=2;
        var [start_i,n] = this.extract_braced_phrase(line,i,2);
        var left = 2 - n;
        txt = line.slice(i,start_i-left);  
        if(txt.length && txt.charAt(0)=='?'){
          txt = txt.slice(1);
          let re = /^(\w+)(.*)$/;
          let v = re.exec(txt);
          if(v){
            let key = v[1];
            let style1 = this.string_to_style(v[2],style);
            let o = this.do_fence(key,style1,'');
            if(o.length){
              txt = o[0].img;
            }else{
              txt = '';
            }
          }
        }else{
          txt = this.phrase_to_math(style,txt);
        }
        newtext += txt;
        re.lastIndex = start_i;
        continue;

      } else {
        start_i = re.lastIndex;

      }
    }
    var txt = line.slice(start_i);
    var txt = this.unescape(style,txt);
    newtext += txt;
    return newtext;
  }
  unescape(style,line) {
    // WIll recognized something like,
    //
    //    \setupbodyfont[...]
    //    \textbf{...}
    //    \rm
    var v;
    if(typeof line === 'string'){
    }else{
      line = ''+line;
    }
    var start_i = 0;
    var newtext = '';
    const re = /(\\[A-Za-z0-9_]+\[[^\[\]]*\])|(\\[A-Za-z0-9_]+\{[^\{\}]*\})|(\\[A-Za-z0-9_]+)|(\\[^A-Za-z0-9_\s])/gs;
    while ((v = re.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
      var txt = this.flatten(style,txt);
      newtext += txt;
      if (v[1] !== undefined) {
        var s = v[1]
        var txt = this.literal_to_escape(style,s);
        newtext += txt;
        
      } else if (v[2] !== undefined) {
        var s = v[2]
        var txt = this.literal_to_escape(style,s);
        newtext += txt;
        
      } else if (v[3] !== undefined) {
        var s = v[3]
        var txt = this.literal_to_escape(style,s);
        newtext += txt;
        
      } else if (v[4] !== undefined) {
        var s = v[4]
        var txt = this.literal_to_escape(style,s);
        newtext += txt;
        
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
    var txt = this.smooth(txt);
    return txt;
  }
  ss_to_list_itms(ss,style){
    let itms = [];
    const re_1  = /^(\d+[\.\)])\s+(.*)$/;
    const re_a  = /^([a-z][\.\)])\s+(.*)$/;
    const re_A  = /^([A-Z][\.\)])\s+(.*)$/; 
    const re_UL = /^([\-])\s+(.*)$/;
    const re_OL = /^([\*])\s+(.*)$/;
    const re_DL = /^([\+])\s+(.*)$/;
    const re_CB = /^(\[[x\s]\])\s+(.*)$/;
    const re_RB = /^(\([x\s]\))\s+(.*)$/;
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
      }else if((v=re_CB.exec(s))!==null){
        let type = 'CB';
        let bull = v[1].substr(1,1);
        let start = this.extract_first_word(v[2])
        let ending = '';
        let text = v[2];
        let value = '';
        itms.push({bull,text,value,start,ending,type});
        return;
      }else if((v=re_RB.exec(s))!==null){
        let type = 'RB';
        let bull = v[1].substr(1,1);
        let start = this.extract_first_word(v[2]);
        let ending = '';
        let text = v[2];
        let value = '';
        itms.push({bull,text,value,start,ending,type});
        return;
      }else if(this.line_is_indented(s)){        
        if(itms.length){
          let p = itms.pop();
          p.text = this.join_line(p.text,s);
          itms.push(p);
        }
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
  ss_to_tabular_rows(ss,style){
    let data = [];
    let re_datas = /^&\s+(.*)$/;
    let re_verbs = /^\|\s+(.*)$/;
    let re_tabs = /^>\s+(.*)$/;
    let s0 = ss[0]||'';
    let flag = 0;
    if(re_hline_or_hhline.test(s0)||re_datas.test(s0)||re_verbs.test(s0)||re_tabs.test(s0)){
      flag = 1
    }
    if(flag==1){
      // fill-up each row first before moving to next row, the next
      /// row is marked by the presence of a hline, or a double-backslash
      let k=0;
      ss.forEach(s => {
        let v;
        if(this.line_is_indented(s)){
          ///continuation
          if(data.length){
            let pp = data.pop();
            if(pp.length){
              let p = pp.pop();
              p.raw = `${p.raw}\n${s.trimLeft()}`;
              pp.push(p);
            }
            data.push(pp);
          }
        }
        else if((v=re_datas.exec(s))!==null){
          if(k==0){
            data.push([]);///push in a new row
          }
          if(data.length){
            let pp = data.pop();
            let raw = v[1];
            pp.push({raw});
            data.push(pp);
          }
          k = k+1;///move to next TD
        }
        else if(s.trim()=='\\\\'){
          // ends the current row
          k = 0;
        }
        else if((v=re_hline_or_hhline.exec(s))!==null){
          let pp = [];
          pp.push({raw:s});
          if(re_hline.test(s)){
            pp.hline = 1;
          }else{
            pp.hline = 2;
          }
          data.push(pp);
          k = 0;
        }
        else if((v=re_verbs.exec(s))!==null){
          s = v[1];
          let pp = this.split_line_by_verticalbar(s);
          pp = pp.map(p => p.trim());
          pp = pp.map((raw) => {
            return {raw};
          });
          data.push(pp);
          k = 0;
        }
        else if((v=re_tabs.exec(s))!==null){
          s = v[1];
          let pp = this.split_line_by_singlespace(s);
          pp = pp.map(p => p.trim());
          pp = pp.map((raw) => {
            return {raw};
          });
          data.push(pp);
          k = 0;
        }
        else{
          let pp = [];
          pp.push({raw:s});
          data.push(pp);
          k = 0;
        }
      })
    } else {  
      // scan the first line which is to express the starting/stopping position
      // of characters for each column.
      var d = [];
      var p = 0;
      var n = 0;
      for(let i=0; i < s0.length; ++i){
        let ch = s0.charAt(i);
        let isspace = /^\s/.test(ch);
        if(!p && !isspace){
          p = 1;
          d.push(i);
          n = 0;
        }else if(p && isspace){
          n++;
          if(n >= 3){
            p = 0;
          }
        }
      }
      ///now go throu all lines and extract columns
      for(let s of ss){
        let v;
        if((v=re_hline_or_hhline.exec(s))!==null){
          let pp = [];
          pp.push({raw:s});
          if(re_hline.test(s)){
            pp.hline = 1;
          }else{
            pp.hline = 2;
          }
          data.push(pp);
          continue;
        }
        let pp = [];
        d.forEach((n,j,arr) => {
          if(j+1==arr.length){
            let raw = s.slice(n).trim();
            pp.push({raw});
          }else{
            let n1 = arr[j+1];
            let raw = s.slice(n,n1).trim();
            pp.push({raw});
          }
        })
        data.push(pp);
      }  
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
  __ss_to_figure_itms(body,style){
    // the return value is a list of objects, where each object
    // contains members of 'type', 'fname', 'id', 'body', 'g', and 'sub'
    //
    var re_fence  = /^(```[A-Za-z]+)/;
    var v;
    var itms = [];
    var itm = null;
    var seq = 0;
    //var ss = ss.map((s) => s.trimLeft());
    var clusters = this.ss_to_clusters(body);
    clusters.forEach((cluster,j,arr) => {
      let s0 = cluster[0];
      if((v=re_fence.exec(s0))!==null){
        var [key,g,body,cluster] = this.extract_fenced_cluster(cluster,0,style);
        var o = this.do_fence(key,g,body);
        for(var j=0; j < o.length; ++j){
          itm = {};
          itm.key = key;
          itm.type = 'fence';
          itm.style = g;
          itm.img = o[j].img;
          itm.sub = o[j].sub;
          itm.seq = ++seq;
          itms.push(itm);
        }
      }else if(s0.trim()=='\\\\'){
        itm = {};
        itm.type = '\\\\';
        itms.push(itm);
      }
    });
    return itms;
  }
  ss_to_figure_itms(body,style){
    var itms = [];
    var ss = [];
    var is_in_fence = 0;
    var seq = 0;
    for(var s of body) {
      if(this.re_begin_end_fence.test(s.trimLeft())){
        if(!is_in_fence){
          if(ss.length){
            let text = this.join_para(ss);
            ///text = this.uncode(style,text);
            //all.push(text); ///do not add to the figure
            text = text.trim();
            if(text=='\\\\'){
              let itm = {};
              itm.type = '\\\\'
              itms.push(itm);
            }
          }
          ss = [];
          ss.push(s);
          is_in_fence = 1;
          continue;
        }else{
          ///end the previous fence
          ss.push(s);
          ss = this.trim_samp_body(ss);
          let [key,g,ss1] = this.extract_fenced_cluster(ss,0,style);
          ss1 = this.trim_samp_body(ss1);
          let o = this.do_fence(key,g,ss1);
          for(let j=0; j < o.length; ++j){
            let itm = {};
            itm.img = o[j].img;
            itm.sub = o[j].sub;
            itm.seq = ++seq;
            itm.type = 'fence';
            itm.style = g;
            itm.key = key;
            itms.push(itm);
          }
          ss = [];
          is_in_fence = 0;
        }
      }else{
        ss.push(s);
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
  plitems_to_items (plitems) {
    ///
    /// Parse the paragraph that is PLST
    ///

    var items = [];
    //
    var num = 0;
    var levels = [];
    var lead = '';
    var bull = '';
    var type = '';
    var ending = '';
    var value = '';
    var action = '';
    var more = [];
    var text = '';
    var s = '';
    //const re_leadspaces = /^(\s*)(.*)$/;
    //
    //var re = /^(\s*)(\+|\-|\*|\d+\.)\s+(.*)$/;
    //
    //var re = /^(\s*)/;
    for (var plitem of plitems) {
      let bullet = plitem.bullet;
      let lead = plitem.lead||'';
      type = ''; // need to clear type and value
      value = '';
      if (bullet) {
        // 'bullet' is set to a non-empty when it is an item, empty when it is a text
        //var text = v[2];
        //plitem.body[0] = text;
        var text = plitem.body.join('\n');
        var br = 0;
        if (bullet[0] == '-'){
          bull = 'UL';
          value = '';
        } else if (bullet[0] == '*'){
          bull = 'OL';
          value = '';
        } else if (bullet[0] == '+'){
          bull = 'DL';
          value = '';
          type = 'description';
        } else if (bullet == '<>'){
          bull = 'HL';
          value = '';
          type = 'hanginglist';
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
            type = '1';
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
          var lead0 = levels[levels.length-1][0];
          var bull0 = levels[levels.length-1][1];
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
        more.push(plitem);
        continue;
      }

      /// For Japanese language input, the following three
      /// are used for three levels of nesting
      ///  ー \u30fc
      ///  ＋ \uff0b
      ///  ＊ \uff0a

      if (action === 'push') {
        levels.push([lead,bull]);
        more = [];
        items.push({bull});
        let row1 = plitem.n;
        let row2 = plitem.n + plitem.body.length;
        items.push({bull:'LI',bullet,type,ending,value,text,row1,row2,more});
      } else {
        if (action === 'pop') {
          var [lead0,bull0] = levels.pop();
          items.push({bull:`/${bull0}`});
        }
        let n = levels.length;
        var [lead0,bull0] = levels[n-1];
        if(bull0.localeCompare(bull)!==0){
          items.push({bull:`/${bull0}`});
          items.push({bull});
          levels[n-1][1] = bull;//replace
        }
        more = [];
        let row1 = plitem.n;
        let row2 = plitem.n + plitem.body.length;
        items.push({bull:'LI',bullet,type,ending,value,text,row1,row2,more});
      }
    }
    //
    while (levels.length > 0) {
      [lead,bull] = levels.pop();
      bull = `/${bull}`;
      items.push({bull});
    }
    // clean up 'more'
    items.forEach(x => {
      if(x.more){
        x.more.forEach(plitem => {
          plitem.row1 = plitem.n;
          plitem.row2 = plitem.n + plitem.body.length;
          plitem.lines = this.trim_samp_body(plitem.body);
        })
      }
    })
    //
    return items;
  }
  plitems_to_itemize(plitems,style) {
    ///
    /// Parse the paragraph that is PLST
    ///
    //
    var num = 0;
    var levels = [];
    var lead = '';
    var bull = '';
    var type = '';
    var ending = '';
    var value = '';
    var action = '';
    var more = [];
    var text = '';
    var s = '';
    //const re_leadspaces = /^(\s*)(.*)$/;
    //
    //var re = /^(\s*)(\+|\-|\*|\d+\.)\s+(.*)$/;
    //
    //var re = /^(\s*)/;
    for (var plitem of plitems) {
      let bullet = plitem.bullet;
      let lead = plitem.lead||'';
      type = ''; // need to clear type and value
      value = '';
      if (bullet) {
        // 'bullet' is set to a non-empty when it is an item, empty when it is a text
        //var text = v[2];
        //plitem.body[0] = text;
        var text = plitem.body.join('\n');
        if (bullet[0] == '-'){
          bull = 'UL';
          value = '';
        } else if (bullet[0] == '*'){
          bull = 'OL';
          value = '';
        } else if (bullet[0] == '+'){
          bull = 'DL';
          value = plitem.body.slice(0,1).join('\n');
          text = plitem.body.slice(1).join('\n');
          type = '';
        } else if (bullet == '<>'){
          bull = 'HL';
          value = '';
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
        levels.push(itemize);
        //add a new item to the old itemize
        if(levels.length > 1){
          let itemize0 = levels[levels.length-2];
          let item0 = itemize0.items[itemize0.items.length-1];//there should always be at least in the list 
          item0.more.push({itemize});
        }
        //create a new item and add it to the new itemize
        var item = {};
        item.text = text;
        item.bullet = bullet;
        item.type = type; //'A', 'a', '0'
        item.value = value;
        item.ending = ending;
        item.style = {...style};
        item.more = [];
        itemize.items.push(item);
      }else if(action === 'pop') {
        levels.pop();
        var itemize = levels[levels.length-1];
        var item = {};
        item.text = text;
        item.bullet = bullet;
        item.type = type; //'A', 'a', '0'
        item.value = value;
        item.ending = ending;
        item.style = {...style};
        item.more = [];
        itemize.items.push(item);
      }else if(action === 'lines') {
        var itemize = levels[levels.length-1];
        var item = itemize.items[itemize.items.length-1];//the 'items' array is never empty
        var one = {};
        one.lines = plitem.body;
        one.style = {...style};
        item.more.push(one);
      }else if(action === 'item') {
        var itemize = levels[levels.length-1];
        var item = {};
        item.text = text;
        item.bullet = bullet;
        item.type = type; //'A', 'a', '0'
        item.value = value;
        item.ending = ending;
        item.style = {...style};
        item.more = [];
        itemize.items.push(item);
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
  update_rows_by_hrule(rows,hrule){
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
  fetch_ss_from_ss_map(name0){
    if (this.my_ss_map.has(name0)){
      let ss = this.my_ss_map.get(name0);
      return ss;
    }
    return [];
  }
  softhyphen_cjk(text) {
    var newtext = '';
    const ch_softhyphen = String.fromCodePoint(0xAD);
    for(var ch of text){
      let cc = ch.codePointAt(0);
      if(this.is_cjk_cc(cc)){
        newtext += ch_softhyphen;
        newtext += ch;
        continue;
      }
      newtext += ch;
    }
    return newtext;
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
    var fn0 = '';

    for (var j=0; j < text.length; ++j) {

      var c = text[j];
      var cc = text.codePointAt(j);

      //if (cc >= 256 && cc <= 0xFFFF) {
      if(this.is_cjk_cc(cc)){
        var fns = cjkfontmap[cc];
      } else {
        var fns = 0;
      }

      ///console.log('c=',c,'cjk=',this.is_cjk_cc(cc))

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

      /// check to see if this char has the same font as the last one
      var fns0 = fns0 & fns; /// bitwise-AND
      if (fns0) {
        /// get the first font: assign 'k' according to the followin rules:
        ////  0b0001 => 0, 0b0010 => 1; 0b0011 => 0; 0b0100 => 2
        var k = 0;
        for (k=0; k < cjkfontnames.length; ++k) {
          if (fns0 & (1 << k)) {
            break;
          }
        }
        var fn0 = cjkfontnames[k];
        s0 += c;
        continue
      }

      /// by the time we get here the 'c' is either a CJK that does
      //// not agree with previous character in terms of the same font;
      //// or 'c' is not a CJK at all.
      if(1){
        //newtext += `{\\${fn0}{${s0}}}`;
        newtext += this.lang_to_cjk(s0,fn0);
      }else{
        newtext += s0;
      }
      fns0 = 0;
      s0 = '';
      fn0 = '';

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
        fn0 = cjkfontnames[k];
        s0 = c;
        continue;
      }

      /// we get here if the 'c' is not a CJK
      a0 += c; // add to a0
    }

    if(a0){
      newtext += `${a0}`;
    } else if (s0){
      if(1){
        //newtext += `{\\${fn0}{${s0}}}`;
        newtext += this.lang_to_cjk(s0,fn0);
      }else{
        newtext += s0;
      }
    }
    return newtext;
  }
  ///
  ///'head' is the entire text of '&img' plus the open curly brace
  ///'i' is the location with the source string where '&img' is located
  ///
  extract_phrase(line,i,head){
    i += head.length;
    var key = head.slice(1,head.length-1);
    var lb = '{';
    var rb = '}';
    ///
    ///1st-argument
    var start_i = this.extract(line,i);
    var scan_text = line.slice(i,start_i);
    if(scan_text.endsWith(rb)){
      var cnt = scan_text.slice(0,scan_text.length-1);
    }else{
      var cnt = scan_text.slice(0,scan_text.length);
    }
    ///2nd-argument
    var next_i = this.extract2(line,start_i);
    if(next_i>start_i){
      var cnt2 = line.slice(start_i+1,next_i-1);
      start_i = next_i;
    }else{
      var cnt2 = '';
    }
    ///3rd-argument
    var next_i = this.extract2(line,start_i);
    if(next_i>start_i){
      var cnt3 = line.slice(start_i+1,next_i-1);
      start_i = next_i;
    }else{
      var cnt3 = '';
    }
    return [key,cnt,cnt2,cnt3];
  }
  ///
  ///'head' is the entire text of '```img' plus the entire style text
  ///'i' is the location with the cluster array where '```img' is located
  ///
  extract_fenced_cluster(cluster,i,style){
    var s0 = cluster[0];
    const re = /^```([A-Za-z]*)(.*)$/;
    var v = re.exec(s0);
    var key = '';
    var g = this.string_to_style('',style);
    var ss = [];
    if(v){
      key = v[1];
      g = this.string_to_style(v[2],style);
    }
    i++;
    while(i < cluster.length){
      let s = cluster[i];  
      if(s.trim()=='```'){
        i++;
        break;
      }else{
        ss.push(s);
        i++;
      }
    }
    var cluster = cluster.slice(i);
    return [key,g,ss,cluster];
  }
  /////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////////
  do_phrase(key,style,cnt,cnt2,cnt3){
    var txt = '';
    switch (key) {
      case 'verb': {
        txt = this.phrase_to_verb(style,cnt,cnt2,cnt3);
        break;
      }
      case 'code': {
        txt = this.phrase_to_code(style,cnt,cnt2,cnt3);
        break;
      }
      case 'em': {
        txt = this.phrase_to_em(style,cnt,cnt2,cnt3);
        break;
      }
      case 'b': {
        txt = this.phrase_to_b(style,cnt,cnt2,cnt3);
        break;
      }
      case 'i': {
        txt = this.phrase_to_i(style,cnt,cnt2,cnt3);
        break;
      }
      case 'u': {
        txt = this.phrase_to_u(style,cnt,cnt2,cnt3);
        break;
      }
      case 'ss': {
        txt = this.phrase_to_ss(style,cnt,cnt2,cnt3);
        break;
      }
      case 'tt': {
        txt = this.phrase_to_tt(style,cnt,cnt2,cnt3);
        break;
      }
      case 'overstrike': {
        txt = this.phrase_to_overstrike(style,cnt,cnt2,cnt3);
        break;
      }
      case 'var': {
        txt = this.phrase_to_var(style,cnt,cnt2,cnt3);
        break;
      }
      case 'br': {
        txt = this.phrase_to_br(style,cnt,cnt2,cnt3);
        break;
      }
      case 'high': {
        txt = this.phrase_to_high(style,cnt,cnt2,cnt3);
        break;
      }
      case 'low': {
        txt = this.phrase_to_low(style,cnt,cnt2,cnt3);
        break;
      }
      case 'quad': {
        txt = this.phrase_to_quad(style,cnt,cnt2,cnt3);
        break;
      }
      case 'qquad': {
        txt = this.phrase_to_qquad(style,cnt,cnt2,cnt3);
        break;
      }
      case 'ref': {
        txt = this.phrase_to_ref(style,cnt,cnt2,cnt3);
        break;
      }
      case 'link': {
        txt = this.phrase_to_link(style,cnt,cnt2,cnt3);
        break;
      }
      case 'br': {
        txt = this.phrase_to_br(style,cnt,cnt2,cnt3);
        break;
      }
      ///UTF char
      case 'utfchar': {
        txt = this.phrase_to_utfchar(style,cnt,cnt2,cnt3);
        break;
      }
      ///following will generate some pictures
      case 'colorbutton': {
        txt = this.phrase_to_colorbutton(style,cnt,cnt2,cnt3);
        break;
      }
      default: {
        txt = this.phrase_to_default(style,cnt,cnt2,cnt3);
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
}
module.exports = { NitrilePreviewTranslator }
