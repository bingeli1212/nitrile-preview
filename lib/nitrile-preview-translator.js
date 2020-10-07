'use babel';

const {NitrilePreviewBase} = require('./nitrile-preview-base.js');
const json_rubyitems = require('./nitrile-preview-rubyitems.json');
const json_math = require('./nitrile-preview-math.json');
const entjson = require('./nitrile-preview-entity.json');

const re_fullline = /^\S/;
const re_indentedline = /^\s+\S/;
const re_rubyitem = /^(\S+?)\u{30fb}(\S+)/u;
const re_ref = /^&ref\{([\w:-]*)\}\s*(.*)$/u;
const re_comm = /^%([\^!].*)$/u;
const re_spcl = /^(@@|@)\s+(\w+)\s*(.*)$/u;
const re_hdgs = /^(#+)\s+(.*)$/u;
const re_quot = /^(>)\s+(.*)$/u;
const re_math = /^(\$\$|\$)\s+(.*)$/u;
const re_plst = /^(-|\*\)+|\d+\)+)\s+(.*)$/u;
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
//const re_unmask = /`([^`]+)`|``([^`]+)``|```([^`]+)```|(?<!\\)\\(\w+)\{([^\{\}]+)\}|(?<!\w)\\\((.*?)\\\)|(?<!\w)\\\[(.*?)\\\]|(?<!\\)\\(\w+)(?!=\w)|(?<!\\)(\\\\)/g;
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
    this.re_hline = /^-{6,}$/;
    this.re_style = /^\{(.*)\}$/;
    this.refmap = {};

  }
  search_refmap(mylabel){
    for(let myid in this.refmap){
      let g = this.refmap[myid];
      let {label} = g;
      if(typeof label=='string' && label.localeCompare(mylabel)==0){
        return g;
      }
    }
    return null;
  }
  get_refmap_value(style, key) {
    let myid = this.get_myid(style);
    if (this.refmap && this.refmap.hasOwnProperty(myid)) {
      var g = this.refmap[myid];
      var val = g[key]||'';
      return val;
    }
    return '';
  }
  get_myid(style){
    if(!style){
      return '';
    }
    let { refid, subseq } = style;
    if(!refid){
      refid = 0;
    }
    if(!subseq){
      subseq = 0;
    }
    var myid = `__${refid}_${subseq}`;
    return myid;
  }
  identify(blocks){
    this.refmap = {}
    let A = {};
    blocks.forEach(block => {
      this.do_identify(block,A);
    })
  }
  translate(blocks){
    blocks.forEach(block => {
      this.vmap = block.vmap;
      switch (block.sig) {
        case 'PART': this.do_PART(block); break;
        case 'HDGS': this.do_HDGS(block); break;
        case 'SAMP': this.do_SAMP(block); break;
        case 'PRIM': this.do_PRIM(block); break;
        case 'TEXT': this.do_TEXT(block); break;
        case 'PLST': this.do_PLST(block); break;
        case 'HRLE': this.do_HRLE(block); break;
        case 'FLOA': this.do_FLOA(block); break;
        default: break;
      }
    })
  }
  do_identify(block, A) {
    if (!A.count) {
      A.count = 1;
      A.chapters = 0;
      A.sections = 0;
      A.subsections = 0;
      A.subsubsections = 0;
      A.parts = 0;
      A.id = 0;///ID for CSS
      A.floats = new Map();
    }
    var { sig, hdgn, floatname, label, title, style } = block;
    var myid = this.get_myid(style);
    if(!myid){
      return;
    }
    /// generate css ID
    A.id++;
    block.id = A.id;
    let id = block.id;
    /// generate 'idnum'
    if (sig == 'PART') {
      A.parts++;
      let partnum = A.parts;
      this.refmap[myid] = { sig, id, floatname, label, title, partnum };
    } else if (sig == 'HDGS') {
      let idnum;
      if (hdgn == 0) {
        A.chapters++;
        A.sections = 0;
        A.subsections = 0;
        A.subsubsections = 0;
        A.floats.clear();
        idnum = `${A.chapters}`;
      } else if (hdgn == 1) {
        A.sections++;
        A.subsections = 0;
        A.subsubsections = 0;
        idnum = `${A.sections}`;
      } else if (hdgn == 2) {
        A.subsections++;
        A.subsubsections = 0;
        idnum = `${A.sections}.${A.subsections}`;
      } else {
        A.subsubsections++;
        idnum = `${A.sections}.${A.subsections}.${A.subsubsections}`;
      }
      let chnum = A.chapters;
      let partnum = A.parts;
      this.refmap[myid] = { sig, id, floatname, label, title, idnum, chnum, partnum };
    } else if (sig=='FLOA') {
      if (!A.floats.has(title)) {
        A.floats.set(title, 1);
      } else {
        A.floats.set(title, A.floats.get(title) + 1);
      }
      let idnum = A.floats.get(title);
      let chnum = A.chapters;
      let partnum = A.parts;
      this.refmap[myid] = { sig, id, floatname, label, title, idnum, chnum, partnum };
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
  search_ref_label (in_label) {
    for (var j=0; j < this.parser.blocks.length; ++j) {
      var block = this.parser.blocks[j];
      var {id,sig,label,style,floatname,idnum,refid,id} = block;
      style=style||{};
      label = label||'';
      idnum = idnum||'';
      var labels = label.split(',');
      var idnums = idnum.split(',');
      var n = style.n || 1;
      for(let k=0; k < n; k++){
        let this_label = labels[k]||'';
        let this_idnum = idnums[k]||'';
        if(this_label.localeCompare(in_label)===0){
          let g = {sig,label:this_label,floatname,idnum:this_idnum,refid,id};
          return g;
        }        
      }
    }
    return null;
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
    return ar_i_letters[i];
  }
  to_I_letter(i){
    return ar_I_letters[i];
  }
  to_a_letter(i){
    return ar_a_letters[i];
  }
  to_A_letter(i){
    return ar_A_letters[i];
  }
  to_1_letter(i){
    return ar_1_letters[i];
  }
  conf(in_key,def_val=''){
    var block = this.parser.blocks[0];
    if (block && block.sig == 'FRNT') {
      let data = block.data;
      for (let t of data) {
        let [key, val] = t;
        if (key.localeCompare(in_key)==0) {
          return val;
        }
      }
    }
    return def_val;
  }
  untext(ss,style) {
    style = style||{};
    let n = ss.length;
    let v;
    if(n==0){
      return '';
    }
    if(n>1&&ss[0].startsWith('~~~')&&ss[n-1].startsWith('~~~')){ 
      let str = ss[0].slice(3);
      ss = ss.slice(1,n-1);
      if(ss.length){
        ss = this.trim_samp_body(ss);
        let {fenceid,style:style1} = this.string_to_fenceid(str);
        style = {...style, ...style1};
        if(fenceid==='longtable'){
          return this.para_to_longtable(ss,style);
        }
        if(this.para_is_multi(ss)){
          return this.para_to_multi(ss,style);
        }
        if(this.para_is_itemized(ss)){
          return this.para_to_itemized(ss,style);
        }
        if(this.para_is_verse(ss)){
          return this.para_to_verse(ss,style);
        }
        if(this.para_is_imgrid(ss)){
          return this.para_to_imgrid(ss,style);
        }
        return this.para_to_plaintext(ss,style);
      }
    } 
    if(n>1&&ss[0].startsWith('"""') && ss[n - 1].startsWith('"""')) {
      let s0 = ss[0].slice(3);
      ss = ss.slice(1, n - 1);
      if (ss.length) {
        if ((v = this.re_style.exec(s0)) !== null) {
          let style1 = this.string_to_style(v[1]);
          style = {...style, style1};
        }
      }
      ss = this.trim_samp_body(ss);
      return this.para_to_blockquote(ss,style);
    }
    return this.para_to_plaintext(ss,style);
  }
  uncode(line) {
    /// * processsing single-backquoted phrase and double-backquoted phrase
    line = line||'';
    var v;
    var start_i = 0;
    var newtext = '';
    const re_uncode = /(`{1,2})([^`]+)\1/g;
    while ((v = re_uncode.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i, i);
      var txt = this.untouch(txt);
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
    var txt = this.untouch(txt);
    newtext += txt;
    return newtext;
  }
  unmask(line,style) {
    style=style||{};
    /// unmask all inline markups within a text
    ///    ```
    ///    verbatim-text
    ///    ```
    line = line||'';
    var v;
    var start_i = 0;
    var newtext = '';
    const re_unmask = /(```)(.*)\n([^`]+)\1/g;
    while ((v = re_unmask.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i, i);
      var txt = this.uncode(txt);
      newtext += txt;
      if (v[1] !== undefined) {
        var key = v[1];
        var str = v[2];
        var cnt = v[3];
        let ss = cnt.split('\n');
        if(ss.length){
          let {fenceid,style:style1} = this.string_to_fenceid(str);
          style = {...style,...style1};
          let nss = ss.length;
          ss = ss.slice(0, nss - 1);
          ss = this.trim_samp_body(ss);
          if(fenceid==='diagram'){
            newtext += this.fence_to_diagram(ss,style);
          }else if(fenceid==='framed'){
            newtext += this.fence_to_framed(ss,style);
          }else if(fenceid==='math'){
            newtext += this.fence_to_math(ss,style);
          }else if(fenceid=='tabulate'){
            newtext += this.fence_to_tabulate(ss,style);
          }else{
            newtext += this.polish(ss.join('\n'));
          }
        }        
      } 
      start_i = re_unmask.lastIndex;
    }
    var txt = line.slice(start_i);
    var txt = this.uncode(txt);
    newtext += txt;
    return newtext;
  }
  untouch (line) {
    ///process the phrase such as &ruby{}, &url, ...
    var v;
    var line = line || '';
    var start_i = 0;
    var newtext = '';
    const re_untouch = /(?<!\w)(&[A-Za-z]+\{)|(?<!\\)(\\\()|(?<!\\)(\\\[)/g; //cannot be global because it is used recursively
    while ((v = re_untouch.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
      var txt = this.flatten(txt);
      var txt = this.smooth(txt);
      var txt = this.rubify(txt);
      newtext += txt;

      if (v[1] !== undefined) {

        //&ruby{...}
        //&uri{...}
        //&ref{...}
        //&img{...}
        //&em{...}
        //&b{...}
        //&br{}
        //&vspace{...}
        //&hspace{...}

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
          newtext += this.text_to_typeface(this.untouch(cnt),'em');
        }
        else if(key=='b'){
          newtext += this.text_to_typeface(this.untouch(cnt),'b');
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
          var scan_text = this.phrase_to_math(scan_text);
          newtext += scan_text;
          start_i = line.length;
          re_untouch.lastIndex = start_i;
        }
        else {

          var scan_text = line.slice(i,start_i);
          var scan_text = this.phrase_to_math(scan_text);
          newtext += scan_text;
          start_i += 2;
          re_untouch.lastIndex = start_i;
        }
        continue;

      } else if (v[3] !== undefined) {

        /// \[ ... \]
        i += 2;
        start_i = line.indexOf('\\]',i);
        if(start_i < 0){
          var scan_text = line.slice(i);
          var scan_text = this.phrase_to_math(scan_text,1);
          newtext += scan_text;
          start_i = line.length;
          re_untouch.lastIndex = start_i;
        }
        else {

          var scan_text = line.slice(i,start_i);
          var scan_text = this.phrase_to_math(scan_text,1);
          newtext += scan_text;
          start_i += 2;
          re_untouch.lastIndex = start_i;
        }
        continue;

      } 
      else if(v[4] !== undefined) {

        /// \\Alpha, \\n, \\0, \\1
        
        var match_text = v[4];
        var match_text = match_text.slice(1);//get rid of the first backslash
        var match_text = this.polish_verb(match_text);
        newtext += match_text;
        start_i = re_untouch.lastIndex;
        continue;
      }
      start_i = re_untouch.lastIndex;
    }
    var txt = line.slice(start_i);
    var txt = this.flatten(txt);
    var txt = this.smooth(txt);
    var txt = this.rubify(txt);
    newtext += txt;
    return newtext;
  }
  flatten(txt){
    ///remove the newline characters if there are any, and then join
    /// the lines by not adding any space if two end characters are
    /// CJK characters
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
  string_to_fenceid(str){
    var re = /(\w*)(\{.*?\}|)/;
    var v = re.exec(str);
    if(v){
      let fenceid = v[1];
      let style = this.string_to_style(v[2].slice(1,v[2].length-1));
      return {fenceid,style};
    }
    return {};
  }
  para_is_multi(ss){
    let re = /^&\s+(.*)$/;
    return ss.length && re.test(ss[0]);
  }
  para_is_itemized(ss){
    let re = /^(-|\+|\*|\d+\)|\d+\.|[A-Z][\.\)]|[a-z][\.\)])\s+(.*)$/;
    return ss.length && re.test(ss[0]);
  }
  para_is_verse(ss){
    let re = /^>\s+(.*)$/;
    return ss.length && re.test(ss[0]);
  }
  para_is_imgrid(ss) {
    let re = /^&&img\{.*?\}/;
    return ss.length && re.test(ss[0]);
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
  ss_to_verse_itms(ss,style){
    let re = /^>\s+(.*)$/;
    let itms = [];
    ss.forEach(s => {
      let v;
      if(this.line_is_indented(s)){
        if(itms.length){
          let s0 = itms.pop();
          s0.raw = `${s0.raw}\n${s}`;
          itms.push(s0);
        }
      }
      else if((v=re.exec(s))!==null){
        itms.push({raw:v[1]});
      }
    })
    return itms;
  }
  ss_to_itemized_itms(ss){
    let re = /^(-|\+|\*|\d+\)|\d+\.|[A-Z][\.\)]|[a-z][\.\)])\s+(.*)$/;
    let itms = [];
    ss.forEach(s => {
      let v;
      if(this.line_is_indented(s)){
        if(itms.length){
          let p = itms.pop();
          p.text = `${p.text}\n${s}`;
          itms.push(p);
        }
      }
      else if((v=re.exec(s))!==null){
        let bull = (v[1]=='-'||v[1]=='+'||v[1]=='*')?'UL':'OL';
        let type='';
        let value='';
        if(bull=='OL'){
          if(v[1].charCodeAt(0) >= 65 && v[1].charCodeAt(0) <= 90) {
            type='A';
            value = v[1].charCodeAt(0) - 65 + 1;
          }else if (v[1].charCodeAt(0) >= 97 && v[1].charCodeAt(0) <= 122) {
            type='a';
            value = v[1].charCodeAt(0) - 97 + 1;
          }else{
            type='1';
            value = parseInt(v[1]);
          }
        }
        let text = v[2];
        let ending = v[1].charAt(v[1].length-1);
        itms.push({bull,value,type,ending,text});
      }
    })
    return itms;
  }
  ss_to_tabulate_rows(ss,style){
    let n = Math.abs(parseInt(style.n))||1;
    let data = [];
    let re_rows_hline = /^>\s+---$/;
    let re_rows = /^>\s+(.*)$/;
    let re_cols = /^<\s+(.*)$/;
    if(re_rows.test(ss[0])){
      let pp = [];
      let k=0;
      ss.forEach(s => {
        let v;
        if(s==='---'){
          let pp = 'x'.repeat(n).split('').map(x => '---');
          data.push(pp);
          k=0;
        }
        else if(re_indentedline.test(s)){
          ///continuation
          if(data.length){
            let pp = data.pop();
            if(pp.length){
              let s0 = pp.pop();
              s0 = `${s0}\n${s.trimLeft()}`;
              pp.push(s0);
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
            pp.push(v[1]);
            data.push(pp);
          }
          k = (k+1) % n;///update k
        }
      })
    }else if(re_cols.test(ss[0])){
      let pp = [];
      ss.forEach(s => {
        let v;
        if (!re_fullline.test(s)) {
          if (pp.length()) {
            let s0 = pp.pop();
            s0 = `${s0}\n${s.trimLeft}`;
            pp.push(s0);
          }
        } else if ((v = re_cols.exec(s)) !== null) {
          pp.push(v[1]);
        }
      })
      ss = pp;
      var m = Math.floor(ss.length / n);
      var z = ss.length - n * m;
      var k = z ? (m + 1) : (m);///num of rows
      var cols = [];
      for (var j = 0; j < ss.length; j += k) {
        let pp = ss.slice(j, j + k);
        cols.push(pp);
      }
      for (var j = 0; j < k; ++j) {
        let pp = cols.map(x => x[j] || '');
        data.push(pp);
      }
    }else{
      ss.forEach(s => {
        let pp = this.split_line_to_tds(s);
        pp = pp.map(p => p.trim());
        data.push(pp);
      })
    }
    ///trim or expand all rows so that they are
    ///all the same number of cells
    ///as of the first row
    data = data.map((pp,i) => {
      if(pp.length > data[0].length){
        pp = pp.slice(0,data[0].length);
      }
      while(pp.length < data[0].length) {
        pp.push('');
      }
      return pp;
    })
    return data;
  }
  pp_is_hline(pp){
    const re = /^-+$/;
    let tt = pp.map(x => re.test(x)?1:0);
    let n = tt.reduce((acc,cur) => acc+cur,0);
    return (n===pp.length);
  }
  p_is_hline(p){
    let pp = [p];
    return this.pp_is_hline(pp);
  }
  string_to_frac(str,n,gap){
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
  ss_to_imgrid_itms(ss,style){
    let re = /^&&img\{(.*?)\}(.*)$/;
    let d = [];
    ss.forEach(s => {
      let v;
      if (this.line_is_indented(s)) {
        if (d.length) {
          let t = d.pop();
          t.sub = `${t.sub}\n${s}`
        }
      }
      else if((v=re.exec(s))!==null){
        var g = this.string_to_style(v[1]);
        var src = g.src||'';
        var width = g.width||'';
        var height = g.height||'';
        var sub = v[2];
        d.push({ src, width, height, sub });
      }
    });
    return d;
  }
  addto_vmap(ss,style,vmap) {
    ///return items
    let re = /^(\*|-|\+)\s+(.*)$/;
    let itms = [];
    if(vmap){
      ss.forEach(s => {
        let v;
        if (this.line_is_indented(s)) {
          if (itms.length) {
            let s0 = itms.pop();
            s0.raw = `${s0.raw}\n${s}`;
            itms.push(s0);
          }
        }
        else if ((v = re.exec(s)) !== null) {
          let raw = v[2];
          if ((v = re_rubyitem.exec(raw)) !== null) {
            let rb = v[1];
            let rt = v[2];
            vmap.push({rb, rt, raw});
          }else{
            vmap.push({ raw });
          }
        }
      })
    }
  }
  string_to_longtabu_pcols(str,n){
    if (n > 0) {
      var pp = str.split(/\s+/);
      pp = pp.map(x => parseInt(x));
      pp = pp.filter(x => Number.isFinite(x));
      pp = pp.map(x => (x < 1) ? 1 : x);
      while (pp.length < n) pp.push(1);
      pp = pp.slice(0, n);
      pp = pp.map(x => `X[${x},l]`);
      return pp;
    }
    return [];
  }
}

module.exports = { NitrilePreviewTranslator }
