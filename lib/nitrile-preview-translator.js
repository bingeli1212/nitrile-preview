'use babel';

const {NitrilePreviewBase} = require('./nitrile-preview-base.js');
const json_rubyitems = require('./nitrile-preview-rubyitems.json');
const json_math = require('./nitrile-preview-math.json');
const json_entity = require('./nitrile-preview-entity.json');

const re_phrase = /^(\[[^\[\]]*\]|)(.*)$/;
const re_cluster_line = /^(\s*)(~{3,})(.*)$/;
const re_fullline = /^\S/;
const re_indentedline = /^\s+\S/;
const re_rubyitem = /^(\S+?)\u{30fb}(\S+)/u;
const re_ref = /^&ref\{([\w:-]*)\}\s*(.*)$/u;
const re_comm = /^%([\^!].*)$/u;
const re_spcl = /^(@@|@)\s+(\w+)\s*(.*)$/u;
const re_hdgs = /^(#+)\s+(.*)$/u;
const re_quot = /^(>)\s+(.*)$/u;
const re_math = /^(\$\$|\$)\s+(.*)$/u;
const re_plst = /^(-+|\++|\*+|\d+\)|\d+\.)\s+(.*)$/u;
const re_hlst = /^(\+)\s+(.*)$/u;
const re_dlst = /^(\*)\s+(.*)$/u;
const re_nlst = /^(\d+\))\s+(.*)$/u;
const re_long = /^(\(&\))\s+(.*)$/u;
const re_tabb = /^(&)\s+(.*)$/u;
const re_tabu = /^(=)\s+(.*)$/u;
const re_samp = /^\s+(.*)$/u;
const re_pass = /^(~~|~)\s+(.*)$/u;
const re_note = /^(%)\s+(.*)$/u;
const re_hrle = /^\*{3}$/u;
const re_sep = /^\s*(-{3,})$/u;
const re_ss_bull = /^(-|\+|\*|>|\d+[\)\.]|[a-zA-Z][\)\.]|\[\w\])\s+(.*)$/u;
const re_uri = /^\w+:\/\//u;
const re_ruby = /^(\S+?)\u{30fb}(\S+)/u;
const re_prim = /^\[\s+(.+?)\s+\]\s*(.*)$/;
const re_seco = /^\[\[\s+(.*?)\s+\]\]\s*(.*)$/;
const re_thrd = /^\[\[\[\s+(.*?)\s+\]\]\]\s*(.*)$/;
const re_blank = /^(\s+)(.*)$/;
const re_plain = /^(\S+\s*)(.*)$/;
const re_nitrilemode = /^\^(\w+)=(.*)$/u;
const re_nitrileitem = /^\^(\S+?)\u{30fb}(\S+)/u;
const re_nitrileconf = /^!(\w+)\.(\w+)\s*=\s*(.*)$/u;
const re_nitrileconf_plus = /^!(\w+)\.(\w+)\s*\+=\s*(.*)$/u;
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

//this.re_all_diacritics = /(?<!\\)\\(dot|ddot|bar|mathring|hat|check|grave|acute|breve|tilde)\{([A-Za-z])\}/g;

class NitrilePreviewTranslator extends NitrilePreviewBase {

  constructor(parser) {
    super();
    this.parser=parser;
    this.name='';
    this.usepackages = new Set();
    this.re_all_sups = /(?<!\w)([A-Za-z])\^([0-9cni])(?!\w)/g;
    this.re_all_subs = /(?<!\w)([A-Za-z])_([0-9aeoxhklmnpst])(?!\w)/g;
    this.re_all_symbols = /&([A-Za-z][A-Za-z0-9]*);/g;
    this.re_all_symbol_comments = /\[!([A-Za-z][A-Za-z0-9]*)!\]/g;
    this.re_all_diacritics = /(?<!\w)([A-Za-z])~(dot|ddot|bar|mathring|hat|check|grave|acute|breve|tilde)(?!\w)/g;
    this.re_all_mathvariants = /(?<!\w)([A-Za-z])~(mathbb|mathbf|mathit|mathcal)(?!\w)/g;
    this.re_hline = /^-{1,}$/;
    this.re_dhline = /^={1,}$/;
    this.re_style = /^\{(.*)\}$/;
  }
  translate(){
    this.parser.blocks.forEach((block) => {
      this.translate_block(block);
    })
  }
  translate_block(block){
    this.vmap = block.vmap;
    this.notes = block.notes;
    switch (block.sig) {
      case 'HDGS': this.do_HDGS(block); break;
      case 'SAMP': this.do_SAMP(block); break;
      case 'PRIM': this.do_PRIM(block); break;
      case 'PARA': this.do_PARA(block); break;
      case 'PLST': this.do_PLST(block); break;
      case 'HRLE': this.do_HRLE(block); break;
      case 'NOTE': this.do_NOTE(block); break;
      default: break;
    }
  }
  rubify (src) {
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
      if(this.vmap){
        for (var rubyitem of this.vmap) {
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
        out += this.phrase_to_ruby(rb,rt);
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
  is_indented_line(line){
    const re = /^\s/;
    return (line.lenght > 0 && re.test(line));
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
  conf(in_key,def_val='',type='',suffix=''){
    return this.parser.conf(in_key,def_val,type,suffix);
  }
  untext(ss,style) {
    style = style||{};
    if(ss.length==0){
      return '';
    }
    let n = ss.length;
    let v = null;
    let w = null;
    let s0 = ss[0];
    let sz = ss[n-1];
    if(n>1 && (v=re_cluster_line.exec(s0))!==null && (w=re_cluster_line.exec(sz))!==null && v[1]===w[1] && v[2]===w[2]){ 
      let head = v[3].trim();
      let {fenceid,style:style1} = this.string_to_fenced(head);
      var style = {...style, ...style1};
      ss = ss.slice(1,n-1);
      ss = this.trim_samp_body(ss);
      if(fenceid==='equation'){
        return this.para_to_equation(ss,style);
      }
      if(fenceid==='table'){
        return this.para_to_table(ss,style);
      }
      if(fenceid==='longtable'){
        return this.para_to_longtable(ss,style);
      }
      if(fenceid==='figure'){
        return this.para_to_figure(ss,style);
      }
      if(fenceid==='listing'){
        return this.para_to_listing(ss,style);
      }
      if(fenceid==='verb'){
        return this.para_to_verb(ss,style);
      }
      if(fenceid==='framed'){
        return this.para_to_framed(ss,style);
      }
      if(fenceid=='tabbing'){
        return this.para_to_tabbing(ss,style);
      }
      if(fenceid=='quote'){
        return this.para_to_quote(ss,style);
      }
      if(fenceid=='bull'){
        return this.para_to_bull(ss,style);
      }
      ///auto detect
      if(this.ss_is_bull(ss)){
        ///- This is great
        ///- this is great
        return this.para_to_bull(ss,style);
      }
    }
    return this.para_to_plaintext(ss,style);    
  }
  uncode(line,style) {
    style = style||{};
    /// * processsing single-backquoted phrase and double-backquoted phrase
    line = line||'';
    var v;
    var start_i = 0;
    var newtext = '';
    const re_uncode = /(`{1,2})([^`]+)\1/g;
    while ((v = re_uncode.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i, i);
      var txt = this.untouch(txt,style);
      newtext += txt;
      if (v[1] !== undefined) {
        var key = v[1];
        var cnt = v[2];
        if(key.length==1){
          cnt = cnt.trim();
          cnt = this.polish(cnt);
          newtext += cnt;
        }else{
          cnt = cnt.trim();
          cnt = this.polish_verb(cnt);
          newtext += this.text_to_typeface(cnt, 'verb');
        }
      } 
      start_i = re_uncode.lastIndex;
    }
    var txt = line.slice(start_i);
    var txt = this.untouch(txt,style);
    newtext += txt;
    return newtext;
  }
  unmask(line,style) {
    style=style||{};
    /// unmask all inline markups within a text
    ///    ```
    ///    verbatim-text
    ///    ```
    line = `${line}`||'';
    var v;
    var i;
    var start_i = 0;
    var newtext = '';
    var ss = [];
    var s0 = '';
    //const re_unmask = /```(.*?)```/g;
    const fence4 = '\`\`\`\`';
    const fence3 = '\`\`\`'
    while ((i=line.indexOf(fence3,start_i)) >= 0) {
      ///this is to flush the text before the first backquote
      var txt = line.slice(start_i, i);
      var txt = this.uncode(txt,style);
      newtext += txt;
      if(line.indexOf(fence4,i)===i){
        ///this is to check if there is one additional backquote after the three
        ///it is four fences
        var j = line.indexOf(fence4,i+4);
        if(j >= 0){
          start_i = j+4;
          ss = line.slice(i+4,j).split('\n');
          s0 = ss[0];
          ss = ss.slice(1, ss.length-1);
        }else{
          start_i = line.length;
          ss = line.slice(i+4).split('\n')
          s0 = ss[0];
          ss = ss.slice(1,ss.length);
        }        
      }else{
        ///it is for three fences
        var j = line.indexOf(fence3,i+3);
        if(j >= 0){
          start_i = j+3;
          ss = line.slice(i+3,j).split('\n');
          s0 = ss[0];
          ss = ss.slice(1, ss.length-1);
        }else{
          start_i = line.length;
          ss = line.slice(i+3).split('\n')
          s0 = ss[0];
          ss = ss.slice(1,ss.length);
        }
      }
      let {fenceid,style:style1} = this.string_to_fenced(s0);
      let style2 = {...style,...style1};
      ss = this.trim_samp_body(ss);
      if(fenceid==='diagram'){
        newtext += this.fence_to_diagram(ss,style2);
      }else if(fenceid==='animate'){
        newtext += this.fence_to_animate(ss,style2);
      }else if(fenceid==='framed'){
        newtext += this.fence_to_framed(ss,style2);
      }else if(fenceid==='math'){
        newtext += this.fence_to_math(ss,style2);
      }else if(fenceid=='tabulate'||fenceid=='table'){
        newtext += this.fence_to_table(ss,style2);
      }else if(fenceid=='vbox'){
        newtext += this.fence_to_vbox(ss,style2);
      }else{
        newtext += this.fence_to_verb(ss,style2);
      }
      //console.log(start_i);
    }
    var txt = line.slice(start_i);
    var txt = this.uncode(txt,style);
    newtext += txt;
    return newtext;
  }
  untouch (line,style) {
    style = style||{};
    ///process the phrase such as &ruby{}, &url, ...
    var v;
    var line = line || '';
    var start_i = 0;
    var newtext = '';
    const re_untouch = /(?<!\\)(&[A-Za-z]+\{)|(?<!\\)(\\\()/g; //cannot be global because it is used recursively
    while ((v = re_untouch.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
      var txt = this.flatten(txt);
      var txt = this.smooth(txt);
      //var txt = this.rubify(txt);
      newtext += txt;

      if (v[1] !== undefined) {

        //&ruby{...}
        //&uri{...}
        //&ref{...}
        //&img{...}
        //&em{...}
        //&b{...}
        //&i{...}
        //&u{...}
        //&tt{...}
        //&br{}
        //&vspace{...}
        //&hspace{...}
        //&frac{...}

        var head_text = v[1];
        i += head_text.length;
        var key = head_text.slice(1,head_text.length-1);

        start_i = this.extract(line,i);
        var scan_text = line.slice(i,start_i);
        var cnt = scan_text.slice(0,scan_text.length-1);

        if(key=='ruby'){
          if((v=re_ruby.exec(cnt))!==null){
            newtext += this.phrase_to_ruby(v[1],v[2]);
          }else{
            newtext += this.phrase_to_ruby(cnt,'');
          }
        }
        else if(key=='uri'){
          let g = {href:cnt}
          newtext += this.phrase_to_uri(cnt);
        }
        else if(key=='ref'){
          newtext += this.phrase_to_ref(cnt);
        }
        else if(key=='img'){
          newtext += this.phrase_to_img(cnt);
        }
        else if(key=='em'){
          newtext += this.text_to_typeface(this.untouch(cnt,style),'em');
        }
        else if(key=='b'){
          newtext += this.text_to_typeface(this.untouch(cnt,style),'b');
        }
        else if(key=='i') {
          newtext += this.text_to_typeface(this.untouch(cnt,style),'i');
        }
        else if(key=='u') {
          newtext += this.text_to_typeface(this.untouch(cnt,style),'u');
        }
        else if(key=='tt') {
          newtext += this.text_to_typeface(this.untouch(cnt,style),'tt');
        }
        else if(key=='br'){
          newtext += this.phrase_to_br();
        }
        else if(key=='vspace'){
          newtext += this.phrase_to_vspace(cnt);
        }
        else if (key == 'hspace') {
          newtext += this.phrase_to_hspace(cnt);
        }
        else if (key == 'frac') {
          newtext += this.phrase_to_frac(cnt);
        }
        else if (key == 'sfrac') {
          newtext += this.phrase_to_sfrac(cnt);
        }
        else if (key == 'sup') {
          newtext += this.phrase_to_sup(cnt);
        }
        else if (key == 'sub') {
          newtext += this.phrase_to_sub(cnt);
        }
        else if (key == 'sqrt') {
          newtext += this.phrase_to_sqrt(cnt);
        }
        else {
          var cnt_text = `${head_text}${scan_text}`;
          var cnt_text = this.polish(cnt_text);
            //this will have to be polish so that we can see all native codes
          newtext += cnt_text;
        }
        re_untouch.lastIndex = start_i;
        continue;

      } else if (v[2] !== undefined) {

        /// \( ... \)
        i += 2;
        start_i = line.indexOf('\\)',i);
        if(start_i < 0){
          var scan_text = line.slice(i);
          var scan_text = this.phrase_to_math(scan_text,style);
          newtext += scan_text;
          start_i = line.length;
          re_untouch.lastIndex = start_i;
        }
        else {

          var scan_text = line.slice(i,start_i);
          var scan_text = this.phrase_to_math(scan_text,style);
          newtext += scan_text;
          start_i += 2;
          re_untouch.lastIndex = start_i;
        }
        continue;

      } 
      start_i = re_untouch.lastIndex;
    }
    var txt = line.slice(start_i);
    var txt = this.flatten(txt);
    var txt = this.smooth(txt);
    //var txt = this.rubify(txt);
    newtext += txt;
    return newtext;
  }
  flatten(txt){
    ///remove the newline characters if there are any, and then join
    /// the lines by not adding any space if two end characters are
    /// CJK characters
    if(txt == '\n'){
      return ' ';
    }
    let ss = txt.split('\n');
    return this.join_para(ss);
  }
  extract(line,i){
    let n = 1;
    while(n > 0 && i < line.length){
      var a = line.charAt(i);
      if(a == '\\'){
        i+=2;
        continue;
      }
      else if(a == '{'){
        n++;
        i++;
        continue;
      }
      else if(a == '}'){
        n--;
        i++;
        continue;
      }else{
        i++;
      }
    }
    return i;
  }
  to_fig(cnt){
    let g = {};
    let pp = cnt.split(';');
    pp = pp.map(x => x.trim());
    g.data  = pp[0]||'';
    g.width = pp[1]||'';
    g.height = pp[2]||'';
    g.extra = pp[3]||'';
    return g;
  }
  string_to_fenced(str){
    var re = /(\w*)(\{.*?\}|)/;
    var v = re.exec(str);
    if(v){
      let fenceid = v[1];
      let style = this.string_to_style(v[2].slice(1,v[2].length-1));
      return {fenceid,style};
    }
    return {};
  }
  ss_to_multi_itms(ss){
    let re = /^&\s+(.*)$/;
    let itms = [];
    ss.forEach(s => {
      let v;
      if(this.line_is_indented(s)){
        if(itms.length){
          let s0 = itms.pop();
          s0 = `${s0}\n${s}`;
          itms.push(s0);
        }
      }
      else if((v=re.exec(s))!==null){
        itms.push(v[1]);
      }
    })
    return itms;
  }
  ss_to_tabbing_itms(ss,style){
    ss = ss.filter((x) => x.trim().length);
    var itms = [];
    ss.forEach((s) => {
      let pp = this.split_line_by_spaces(s,2);
      pp = pp.map((x) => x.trim());
      itms.push(pp);
    })
    var maxn = itms.reduce((acc,cur) => Math.max(acc,cur.length),0);
    if(maxn > 1){
      return itms;
    }
    let n = parseInt(style.n)||1;
    var k = Math.ceil(ss.length/n);
    var cols = [];
    while(ss.length){
      var pp = ss.slice(0,k);
      ss = ss.slice(k);
      cols.push(pp);
    }
    var itms = [];
    for(let j=0; j < k; ++j){
      var pp = cols.map((x,i,arr) => x[j]||''); 
      itms.push(pp);
    }
    return itms;
  }
  ss_is_bull(ss){
    const re = re_ss_bull;
    return ss.length && re.test(ss[0]);
  }
  ss_to_bull_itms(ss,style){
    const re = re_ss_bull;
    let itms = [];
    const re_0  = /^(\d+[\.\)])\s+(.*)$/;
    const re_a  = /^([a-z][\.\)])\s+(.*)$/;
    const re_A  = /^([A-Z][\.\)])\s+(.*)$/; 
    const re_UL = /^([\-])\s+(.*)$/;
    const re_OL = /^([\*])\s+(.*)$/;
    const re_DL = /^([\+])\s+(.*)$/;
    const re_LL = /^([>])\s+(.*)$/;
    const re_CB = /^(\[\w\])\s+(.*)$/;
    let type;
    let v;
    let s0 = ss[0]||'';
    let ending0;
    if     ((v=re_0.exec(s0))!==null)  { type = '0';  ending0 = v[1].substr(-1); }
    else if((v=re_a.exec(s0))!==null)  { type = 'a';  ending0 = v[1].substr(-1); }
    else if((v=re_A.exec(s0))!==null)  { type = 'A';  ending0 = v[1].substr(-1); }
    else if((v=re_LL.exec(s0))!==null) { type = 'LL';  }
    else if((v=re_DL.exec(s0))!==null) { type = 'DL';  }
    else if((v=re_UL.exec(s0))!==null) { type = 'UL';  }
    else if((v=re_OL.exec(s0))!==null) { type = 'OL';  }
    else if((v=re_CB.exec(s0))!==null) { type = 'CB';  }
    ///if no specific type is detected, then treat
    ///each line as an item and set the type to empty string
    ss.forEach(s => {
      if(!type){
        let bull = '';
        let ending = '';
        let text = s;
        let value = '';
        if(style.type){
          itms.push({bull,text,value,ending,type:style.type});  
        }else{
          itms.push({bull,text,value,ending,type});
        }
        return;
      }else if(type=='0' && (v=re_0.exec(s))!==null && v[1].substr(-1)==ending0){
        let bull = v[1].slice(0,-1);
        let ending = v[1].substr(-1);
        let text = v[2];
        let value = parseInt(bull);
        itms.push({bull,text,value,ending,type});
        return;
      }else if(type=='a' && (v=re_a.exec(s))!==null && v[1].substr(-1)==ending0){
        let bull = v[1].slice(0,-1);
        let ending = v[1].substr(-1);
        let text = v[2];
        let value = bull[0].codePointAt(0) - 'a'.codePointAt(0) + 1;
        itms.push({bull,text,value,ending,type});
        return;
      }else if(type=='A' && (v=re_A.exec(s))!==null && v[1].substr(-1)==ending0){
        let bull = v[1].slice(0,-1);
        let ending = v[1].substr(-1);
        let text = v[2];
        let value = bull[0].codePointAt(0) - 'A'.codePointAt(0) + 1;
        itms.push({bull,text,value,ending,type});
        return;
      }else if(type=='DL' && (v=re_DL.exec(s))!==null){
        let bull = v[1];
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
        // further check for double-space separating the term and description
        // only inside the first line
        v = value.match(/^(.*?)\s{2,}(.*)$/);
        if(v!==null){
          text = v[2] + text;
          value = v[1];
        }
        itms.push({bull,text,value,ending,type});
        return;
      }else if(type=='OL' && (v=re_OL.exec(s))!==null){
        let bull = v[1];
        let ending = '';
        let text = v[2];
        let value = itms.length+1;
        itms.push({bull,text,value,ending,type});
        return;
      }else if(type=='UL' && (v=re_UL.exec(s))!==null){
        let bull = v[1];
        let ending = '';
        let text = v[2];
        let value = '';
        itms.push({bull,text,value,ending,type});
        return;
      }else if(type=='LL' && (v=re_LL.exec(s))!==null){
        let bull = v[1];
        let ending = '';
        let text = v[2];
        let value = '';
        itms.push({bull,text,value,ending,type});
        return;
      }else if(type=='CB' && (v=re_CB.exec(s))!==null){
        let bull = v[1].substr(1,1);
        let ending = '';
        let text = v[2];
        let value = '';
        itms.push({bull,text,value,ending,type});
        return;
      }else{        
        if(itms.length){
          let p = itms.pop();
          p.text = `${p.text}\n${s}`;
          itms.push(p);
        }
        return;
      }
    })
    return itms;
  }
  ss_to_table_rows(ss,style){
    let n = Math.abs(parseInt(style.n))||1;
    let data = [];
    let re_rows = /^&\s+(.*)$/;
    if(re_rows.test(ss[0])){
      let pp = [];
      let k=0;
      ss.forEach(s => {
        let v;
        if(re_indentedline.test(s)){
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
        else if((v=re_rows.exec(s))!==null){
          if(k==0){
            data.push([]);///push in a new row
          }
          if(data.length){
            let pp = data.pop();
            let raw = v[1];
            pp.push({raw});
            data.push(pp);
          }
          k = (k+1) % n;///update k
        }
        else {
          if(s.trim().length){
            let pp = 'x'.repeat(n).split('').map(x => s);
            pp = pp.map((raw) => {
              return {raw};
            });
            data.push(pp);
          }
          k=0;
        }
      })
    }else if(style.n && n > 0){
      /// if style.n is set, then we will split the contents 
      /// according to it
      /// remove all empty lines first
      ss = ss.filter((s) => s.trim().length);
      var k = Math.ceil(ss.length/n);
      var cols = [];
      while(ss.length){
        var pp = ss.slice(0,k);
        ss = ss.slice(k);
        cols.push(pp);
      }
      ///clear the 'data' first
      data = [];
      for(let j=0; j < k; ++j){
        var pp = cols.map((x,i,arr) => x[j]||''); 
        pp = pp.map((raw) => {
          raw = raw.trim();
          return {raw};
        });
        data.push(pp);
      }
    }else{
      ss = ss.filter((s) => s.trim().length);
      ///else we let the line split by itself
      ss.forEach((s) => {
        let pp = this.split_line_to_tds(s);
        pp = pp.map(p => p.trim());
        pp = pp.map((raw) => {
          return {raw};
        });
        data.push(pp);
      })
    }
    ///trim or expand all rows so that they are
    ///all the same number of cells
    ///and equal to the longest row
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
    ///calling unmask for all raw data
    data.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.unmask(p.raw);
      })
    })
    return data;
  }
  ss_to_caption_ss(ss,style){
    ///import the caption if any
    let caption = '';
    if(style.caption){
      let my = [];
      while(ss.length){
        let s = ss[0];
        ss = ss.slice(1);
        if(s=='\\\\'){
          break;
        }else{
          my.push(s);
        }
      }
      caption = my.join('\n');
    }
    return {caption,ss};  
  }
  row_is_dhline(pp){
    const re = /^=+$/;
    pp = pp.filter((x) => x.raw.length);
    let tt = pp.map(p => re.test(p.raw)?1:0);
    let n = tt.reduce((acc,cur) => acc+cur,0);
    let ret_value = (n===pp.length);
    return ret_value;
  }
  row_is_hline(pp){
    const re = /^-+$/;
    pp = pp.filter((x) => x.raw.length);
    let tt = pp.map(p => re.test(p.raw)?1:0);
    let n = tt.reduce((acc,cur) => acc+cur,0);
    let ret_value = (n===pp.length);
    return ret_value;
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
  ss_to_figure_itms(ss,style){
    let re = /^&img\{(.*?)\}(.*)$/;
    let d = [];
    ss.forEach(s => {
      let v;
      if (this.line_is_indented(s)) {
        if (d.length) {
          let p = d.pop();
          p.sub = `${p.sub}\n${s}`
          d.push(p);
        }
      }
      else if((v=re.exec(s))!==null){
        let s = v[1];
        let sub = v[2];
        let [g,src] = this.s_to_phrase_components(s);
        d.push({ src,g,sub });
      }
    });
    return d;
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
  get_ss_style(ss){
    let n = ss.length;
    let s0 = ss[0];
    let sz = ss[n-1];
    let v = null;
    let w = null;
    if(n>1 && (v=re_cluster_line.exec(s0))!==null && (w=re_cluster_line.exec(sz))!==null && v[1]===w[1] && v[2]===w[2]){ 
      let str = ss[0].slice(3);
      let {fenceid,style} = this.string_to_fenced(str);
      return {fenceid,style};
    }
    let fenceid = '';
    let style = {};
    return {fenceid,style};
  }
  do_NOTE(block) {
    let body = this.trim_samp_body(block.body);
    if(block.notes.has(block.title)){
      var items = block.notes.get(block.title);
    }else{
      var items = [];
      block.notes.set(block.title,items);
    }
    items.push(body);
    ///special processing for vocabulary
    if(block.title=='vocabulary'){
      this.addto_vmap(body,this.vmap);
    }
  }
  fetch_ss_from_notes(title,id){
    if(this.notes.has(title)) {
      let pics = this.notes.get(title);
      ///'pics' is an JS Array
      for(let pic of pics){
        if(pic.length > 1 && pic[0].localeCompare(id)==0){
          return pic.slice(1);
        }
      }
    }
    return null;
  }
  fetch_ss_from_all_notes(title){
    let ss = [];
    if(this.notes.has(title)) {
      let items = this.notes.get(title);
      ///'pics' is an JS Array
      for(let body of items){
        ss = ss.concat(body);
      }
    }
    return ss;
  }
  phrase_to_ruby (base, top) {
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
      let o = this.translate_to_ruby(items);
      return o;
    } else {
      let items = [];
      items.push([base,top]);
      let o = this.translate_to_ruby(items);
      return o;
    }
  }
  string_to_vcols(s){
    s = s||'';
    var re = /^\|{0,2}$/;
    var vcols = s.split('*');
    var vcols =  vcols.filter(x => re.test(x));
    return vcols;
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
  animate_numbers(start,stop,steps){
    start = parseFloat(start)||0;
    stop = parseFloat(stop)||0;
    if(steps <= 2){
      return [start,stop];
    }
    let n = steps - 1;
    let ret_val = [];
    let delta = stop - start;
    for(let j=0; j <= n; j++){
      ret_val.push(j/n*delta + start);
    }
    return ret_val;
  }
  replace_ss_variables(ss,variables){
    for(let v of variables){
      let {name,number} = v;
      ss = ss.map((line) => {
        let re = new RegExp(`\\\\${name}\\b`,'g');
        line = line.replace(re,number);  
        return line;
      });
    }
    return ss;
  }
  fence_to_animate(ss,style){
    var the_var = style.var||'';
    var the_vars = the_var.split(',');
    var steps = parseInt(style.steps)||0;
    var steps = Math.max(steps,2);
    var the_vars = the_vars.map((x) => {
      let vv = this.string_to_array(x);
      let v = {};
      v.name = vv[0];
      v.numbers = this.animate_numbers(vv[1],vv[2],steps);
      return v;
    });
    var d = [];
    for(let j=0; j<steps; ++j){
      let variables = [];
      the_vars.forEach((v) => {
        let name = v.name;
        let number = v.numbers[j];
        variables.push({name,number});
      })
      let ss1 = this.replace_ss_variables(ss,variables);
      var s = this.fence_to_diagram(ss1,style);
      d.push(s);
    }
    var text = d.join('\n')
    return text;
  }
  body_to_fenced(ss){
    var n = ss.length;
    var v = null;
    var w = null;
    var s0 = ss[0];
    var sz = ss[n-1];
    var fenceid = '';
    var style = {};
    if(n>1 && (v=re_cluster_line.exec(s0))!==null && (w=re_cluster_line.exec(sz))!==null && v[1]===w[1] && v[2]===w[2]){ 
      let head = v[3].trim();
      var {fenceid,style} = this.string_to_fenced(head);
      ss = ss.slice(1,n-1);
      ss = this.trim_samp_body(ss);
    }
    return {fenceid,style,ss};
  }
  s_to_phrase_components(s){
    /// a phrase looks like this &img{[width:12pt,frame]./tree.png}
    /// or &img{#id}, or &img{./tree.png}
    let v = re_phrase.exec(s);
    var g = {};
    var src = '';
    if(v){
      g = this.string_to_style(v[1]);
      src = v[2];
    }
    console.log('s_to_phrase_components','g',g,'src',src)
    return [g,src];
  }
  string_to_fontsize_rate(s){
    return json_math.fontsize_rates[s]||'';
  }
  string_to_fontsize_percent(s){
    return json_math.fontsize_percents[s]||'';
  }
  name_to_sub(s){
    // convert a name such as chapter to number 0
    switch(s){
      case 'chapter': return 0;
      case 'section': return 1;
      case 'subsection': return 2;
      case 'subsubsection': return 3;
    }
    return 0;
  }
}
module.exports = { NitrilePreviewTranslator }
