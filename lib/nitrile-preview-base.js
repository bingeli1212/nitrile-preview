'use babel';

const char_widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375, 0.353125, 0.5890625];
const re_indented = /^(\s+)\S/;
const re_fullline = /^\S/;
const re_doublespace = /\s\s/;
const json_math = require('./nitrile-preview-math.json');
const path = require('path');

class NitrilePreviewBase {

  constructor(){
    /// all hints
    this.hint_linedashed = 1 << 0;
    this.hint_linesize2  = 1 << 1;
    this.hint_linesize4  = 1 << 2;
    this.hint_nostroke   = 1 << 3;
    this.hint_nofill     = 1 << 4;
    this.hint_lighter    = 1 << 5;
    this.hint_darker     = 1 << 6;
    this.hint_shadow     = 1 << 7;
    this.hint_fill0      = 1 << 8;
    this.hint_fill1      = 1 << 9;
    this.hint_fill2      = 1 << 10;
    this.hint_fill3      = 1 << 11;
    this.hint_fill4      = 1 << 12;
    this.hint_fill5      = 1 << 13;
    this.hint_fill6      = 1 << 14;
    this.hint_fill7      = 1 << 15;
    this.hint_fill8      = 1 << 16;
    this.hint_fill9      = 1 << 17;
    this.hint_stroke1    = 1 << 18;
    this.hint_stroke2    = 1 << 19;
    this.hint_stroke3    = 1 << 20;
    // type
    this.CC_NONE   = 0;
    this.CC_LETTER = 1;
    this.CC_NUMBER = 2;
    this.CC_PUNC   = 3;
    this.CC_SYMBOL = 4;
    this.CC_OTHER  = 5;
  }

  update_g_hints(g,hints){
    hints = parseInt(hints)||0;
    if(hints){
      g = {...g};
      if(!g.hints){
        g.hints = 0;
      }
      g.hints |= hints;
    }
    return g;
  }
  string_to_srcs(text){
    const re = /^\"(.*?)\"\s*(.*)$/;
    var srcs = [];
    var v;
    while(text){
      if((v=re.exec(text))!==null){
        let s = v[1];
        text = v[2];
        srcs.push(s);
        continue;
      }
      break;
    }
    return srcs;
  }
  string_to_array(text) {

    ///
    /// Turn a text into a list separated by one or more spaces
    ///

    text = text || '';
    text = '' + text;
    var pp = text.split(' ');
    pp = pp.filter(x => (x.length) ? true : false);
    return pp;
  }

  string_to_int_array(text) {

    var pp = this.string_to_array(text);
    pp = pp.map(x => parseInt(x));
    pp = pp.filter(x => Number.isFinite(x));
    return pp;
  }

  string_to_float_array(text) {

    var pp = this.string_to_array(text);
    pp = pp.map(x => parseFloat(x));
    pp = pp.filter(x => Number.isFinite(x));
    return pp;
  }

  string_to_int(text, def_v) {

    var v = parseInt(text);
    if (Number.isFinite(v)) {
      return v;
    }
    return def_v;
  }

  string_to_percentage(str) {
    /// take an input string that is 100% and convert it to '\linewidth'.
    /// take an input string that is 50% and convert it to '0.5\linewidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!str) {
      return '';
    }
    var re = /^(.*)\%$/;
    if (re.test(str)) {
      var str0 = str.slice(0, str.length - 1);
      var num = parseFloat(str0) / 100;
      if (Number.isFinite(num)) {
        var num = num.toFixed(3);
        return num;
      }
    }
    return '';
  }

  string_to_style(s, style) {
    s = s || '';
    s = s.trim();
    /// extract the style which must be {...}
    var j = this.extract2(s,0);  
    if(j>0){
      var s0 = s.slice(0,j);
      var s0 = s0.slice(1,s0.length-1);//remove the beginning and ending braces
      var s = s.slice(j);
    }else{
      var s0 = '';
      var s = s;
    }
    /// split lines using 'sep'
    var sep = ',';
    var ss = s0.split(sep);
    if(style && typeof style === 'object'){
      // good!
    }else{
      style = {};
    }
    ///make a copy of g
    var g = {...style};
    ss.forEach((s,i,arr) => {
      var kk = s.split(':');
      var key = '';
      var val = '';
      if (kk.length == 1) {
        var key = kk[0].trim();
        var val = '1'; /// this should always be a text string
        /// as user might type 'columns' and then
        /// this 'columns' field will have a value
        /// that is '1'.
      } else if (kk.length == 2) {
        var key = kk[0].trim();
        var val = kk[1].trim();
      }
      if (key) {
        g[key] = val;
        if(val=='0'){
          //only this one is special so that it will work with the 'if' statement, otherwise if val is set to '0' the if statement will return true
          g[key] = 0;
        }
      }
    });
    return g;
  }

  string_from_style(g){
    let d = [];
    for(let p in g){
      let q = g[p];
      d.push(`${p}:${q}`)
    }
    var text = d.join(', ');
    return text;
  }

  string_is_float(val) {
    var re = /^[0-9\.]+$/;
    return re.test(val);
  }

  measure_text_length(str, fontSize = 12) {
    const avg = 0.5279276315789471
    return str
      .split('')
      .map(c => c.codePointAt(0) < char_widths.length ? char_widths[c.codePointAt(0)] : avg)
      .reduce((cur, acc) => acc + cur, 0) * fontSize;
  }

  trim_left(para){
    return para.map(x => x.trimLeft());
  }


  ww_to_one(ww) {
    var sum = ww.reduce((acc, num) => acc += parseFloat(num), 0);
    ww = ww.map(x => x / sum);
    ww = ww.map(x => x.toFixed(6));
    return ww;
  }

  ww_to_hundred(ww) {
    var sum = ww.reduce((acc, num) => acc += parseFloat(num), 0);
    ww = ww.map(x => x / sum);
    ww = ww.map(x => x * 100);
    ww = ww.map(x => Math.round(x));
    return ww;
  }

  replace_blanks_with(str, c) {
    return str.replace(/\s/g, c);
  }

  replace_leading_blanks_with(str, c) {
    var newstr = '';
    var m = /^(\s*)(.*)$/.exec(str);
    if (m) {
      if (m[1].length > 0) {
        for (var j = 0; j < m[1].length; ++j) {
          newstr += c;
        }
        newstr += m[2];
        return newstr;
      }
    }
    return str;
  }

  join_indented_lines (para) {
    var o = [];
    var s0 = '';
    for (var s of para) {
      if(o.length){
        if(this.line_is_indented(s)){
          var s0 = o.pop();
          s = `${s0}\n${s}`;
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

  to_bool(val) {

    ///
    /// given a string, return a boolean value
    ///
    /// to_bool("1"); //true
    /// to_bool("12"); //true
    /// to_bool("12.5"); //true
    /// to_bool("1005"); //true
    /// to_bool("0"); //false
    /// to_bool("0.0"); //false
    /// to_bool(" "); //false
    /// to_bool(""); //false
    /// to_bool(undefined); //false
    /// to_bool(null); //false
    /// to_bool('blah'); //false
    /// to_bool('yes'); //true
    /// to_bool('on'); //true
    /// to_bool('YES'); //true
    /// to_bool('ON'); //true
    /// to_bool("true"); //true
    /// to_bool("TRUE"); //true
    /// to_bool("false"); //false
    /// to_bool("FALSE"); //false
    ///

    if (!val) return false;
    if (typeof val === 'string') {
      val = val.trim();
      if (!val.length) { return false; }
      val = val.toLowerCase();
      if (val === 'true' || val === 'yes' || val === 'on') {
        return true;
      }
      val = +val;
      if (isNaN(val)) return false;
      return (val !== 0);
    }
    if (typeof val === 'boolean') {
      return val;
    }
    if (typeof val === 'number') {
      return !(val == 0);
    }
    return true;
  }
  is_within(cc,min,max){
    return (cc>=min && cc<=max);
  }
  is_cjk_cc(cc){
    if(cc < 256){
      return false;
    }
    return this.is_within(cc,0x4E00,0x9FFF) //CJK Unified Ideographs
        || this.is_within(cc,0x3040,0x309F) //hiragana
        || this.is_within(cc,0x30A0,0x30FF) //katakana
        || this.is_within(cc,0xAC00,0xD7A3) //Hangul Syllable
        || this.is_within(cc,0x3400,0x4DBF) //CJK Unified Ideographs Extension A, U+3400 - U+4DBF
        || this.is_within(cc,0x3000,0x303F) //CJK Symbols and Punctuation
        ;
  }
  is_dingbats_cc(cc){
    if(cc >= 0x2700 && cc <= 0x27BF){
      return true;
    }
    return false;
  }
  join_line (s0, s1) {
    ///
    /// join two lines
    ///
      ///if (this.isHan(s0.codePointAt(s0[s0.length-1])) && this.isHan(s1.codePointAt(0))) {

    s0 = s0 || '';
    s1 = s1 || '';
    s1 = s1.trimLeft();
    ///IMPORTANT: make sure following three cases work
    ///
    /// - Example: The operator minus (−) is not associative since
    ///  \(x−y \neq y−x\)
    ///
    /// - Example: \(a + b\)
    ///   and this is good
    ///
    /// - Example: The \(N\)
    ///   \(n\) is good
    if(s0.length==0){
      return s1;
    }else if (s0 && s1 && this.is_cjk_cc(s0.codePointAt(s0.length-1)) && this.is_cjk_cc(s1.codePointAt(0))) {
      return s0 + s1;
    } else {
      return s0 + ' ' + s1;
    }
  }
  join_para (para) {
    ///
    /// join two lines
    ///

    if (para.length === 0) {
      return '';
    }
    var line = '';
    para.forEach((s,i,arr) => {
      if(i==0) line = s;
      else line = this.join_line(line,s);
    });
    return line;
  }

  fix(v) {
    if (typeof v == 'number') {
    } else {
      v = parseFloat(v);
    }
    if(!Number.isFinite(v)) return NaN;
    return v.toFixed(2);
  }

  fix0(v) {
    if (typeof v == 'number') {
    } else {
      v = parseFloat(v);
    }
    if (!Number.isFinite(v)) v = 0;
    return v.toFixed(0);
  }

  fix2(v) {
    if (typeof v == 'number') {
    } else {
      v = parseFloat(v);
    }
    if (!Number.isFinite(v)) v = 0;
    return v.toFixed(2);
  }

  fix3(v) {
    if (typeof v == 'number') {
    } else {
      v = parseFloat(v);
    }
    if (!Number.isFinite(v)) v = 0;
    return v.toFixed(3);
  }

  assert_string(v, def_v='') {
    if (!v) {
      return def_v;
    }
    if (typeof v == 'string') {
      v = v.trim();
      if (!v) {
        return def_v;
      }
      return v;
    }
    return '' + v;
  }

  assert_int(val, def_v=0, min=null, max=null) {
    val = parseInt(val);
    if (!Number.isFinite(val)) {
      return def_v;
    }
    if (Number.isFinite(min)){
      if (val < min) {
        val = min;
      }
    } 
    if (Number.isFinite(max)){
      if (val > max) {
        val = max;
      }
    }
    return val;
  }

  assert_float(val, def_v=0, min=null, max=null) {
    val = parseFloat(val);
    if (!Number.isFinite(val)) {
      return def_v;
    }
    if (Number.isFinite(min)) {
      if (val < min) {
        val = min;
      }
    }
    if (Number.isFinite(max)) {
      if (val > max) {
        val = max;
      }
    }
    return val;
  }
  string_to_latex_width(s,zoom,def='') {
    return this.string_to_css_width(s,zoom,def);
  }
  string_to_latex_height(s,zoom,def='') {
  return this.string_to_css_height(s,zoom,def);
  }
  string_to_latex_fontsize_switch(s){
    ///NOTE: 's' is a string such as 'footnotesize', or a number such as '11.5'
    s = s||'';
    var t = json_math.latex_fontsizes[s]||'';
    if(t) return t;
    t = this.assert_float(s);
    if(t) return `\\fontsize{${t}pt}{${t}pt}\\selectfont`
    return '';
  }

  string_to_latex_fontfamily_switch(s){
    ///NOTE: 's' is a string such as 'monospace'
    s = s||'';
    if(s=='monospace'){
      return '\\ttfamily'
    }
    return '';
  }

  string_to_latex_fontstyle_switch(s){
    ///NOTE: 's' is a string such as 'normal', 'italic', or 'oblique'
    if(s=='oblique'){
      return '\\slshape';
    }else if(s=='italic'){
      return '\\itshape'
    }
    return '';
  }

  string_to_latex_fontstyle_command(s){
    ///NOTE: 's' is a string such as 'normal', 'italic', or 'oblique'
    if(s=='oblique'){
      return '\\textsl';
    }else if(s=='italic'){
      return '\\textit'
    }
    return '';
  }
  string_to_css_width(s,zoom,def='') {
    zoom = parseFloat(zoom)||1;
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!s) {
      return def;
    }
    var num = parseFloat(s);
    num *= zoom;
    if(Number.isFinite(num)){
      return `${num}mm`;
    }
    return def;
  }
  string_to_css_height(s,zoom,def='') {
    zoom = parseFloat(zoom)||1;
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!s) {
      return def;
    }
    var num = parseFloat(s);
    num *= zoom;
    if(Number.isFinite(num)){
      return `${num}mm`;
    }
    return def;
  }
  string_to_css_fontsize(s){
    s = s||'';
    var s = this.string_to_fontsize_percent(s);
    if(s){
      s = `font-size:${s};`
      return s;
    }
    var s = parseFloat(s);
    if(Number.isFinite(s)){
      s = `font-size:${s}pt;`;
      return s;
    }
    return '';
  }

  string_to_css_fontfamily(s){
    if(s=='monospace'){
      s = `font-family:${s};`;
      return s;
    }
    return '';
  }

  string_to_css_fontstyle(s){
    if(s=='italic'){
      s = `font-style:${s};`
      return s;
    }else if(s=='oblique'){
      s = `font-style:${s};`
      return s;
    }
    return '';
  }

  string_to_contex_fontfamily_switch(s){
    ///NOTE: 's' is a string such as 'monospace'
    s = s||'';
    if(s=='monospace'){
      return '\\tt'
    }
    return '';
  }

  string_to_contex_fontstyle_switch(s){
    ///NOTE: 's' is a string such as 'normal', 'italic', or 'oblique'
    if(s=='oblique'){
      return '\\sl';
    }else if(s=='italic'){
      return '\\it'
    }
    return '';
  }

  string_to_fontsize_percent(s){
    return json_math.fontsize_percents[s]||'';
  }

  string_to_fontsize_ratio(s){
    return json_math.fontsize_ratios[s]||'';
  }

  assert_ta(ta){
    if(ta=='ctr'||
       ta=='lft'||
       ta=='rt'||
       ta=='ulft'||
       ta=='llft'||
       ta=='urt'||
       ta=='lrt'||
       ta=='top'||
       ta=='bot'){
      return ta;
    }
    return 'urt';
  }

  is_valid_ta(s){
    if( s.localeCompare('ctr') == 0 ||
        s.localeCompare('lft') == 0 ||
        s.localeCompare('rt') == 0 ||
        s.localeCompare('top') == 0 ||
        s.localeCompare('bot') == 0 ||
        s.localeCompare('ulft') == 0 ||
        s.localeCompare('urt') == 0 ||
        s.localeCompare('llft') == 0 ||
        s.localeCompare('lrt') == 0) {
        return true;
    }
    return false;
  }

  line_is_indented(line){
    if(typeof line == 'string'){
      let v = re_indented.exec(line);      
      if(v){
        return v[1].length;
      }
    }
    return 0;
  }

  line_is_fullline(line){
    if(typeof line == 'string'){
      return re_fullline.test(line);      
    }
    return false;
  }

  is_para_array(para){

    /// name   value
    /// James  Wu
    /// Jane   Dune
    /// Eric   Stone

    var n = 0;
    var tt = para.map(x => re_doublespace.test(x)?1:0);
    var n = tt.reduce((acc,cur) => acc+cur,0);
    return (n == para.length)?true:false;
  }

  to_para_array(para){
    var n = 0;
    var para = para.map(x => x.split(re_doublespace));
    var para = para.map(x => x.map(y => y.trim()));
    var para = para.map(x => x.filter(y => y.length));
    return para;
  }

  get_text_at(txt,n,del=',') {
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

  ss_to_clusters(para){
    var o = [];
    var lines = [];
    o.push(lines);
    for(var s of para){
      if(s.length==0){
        lines = [];
        o.push(lines);
        continue;
      }
      lines.push(s);
    }
    o = o.filter(lines => lines.length);
    return o;
  }

  trim_para_at(para, n) {

    ///
    /// Trim the paragraph on the left side for the exact number of
    /// characters provided.
    ///

    var out = [];
    var i;
    for (i in para) {
      out.push(para[i].slice(n));
    }
    return out;
  }

  trim_samp_body(para) {

    var [para,n0] = this.trim_samp_para(para);

    return para;
  }

  trim_samp_para(para) {

    // now remove the top and bottom empty lines
    while (para.length > 0) {
      if (para[0].trim().length == 0) {
        para = para.slice(1);
      } else {
        break;
      }
    }
    while (para.length > 0) {
      if (para[para.length - 1].trim().length == 0) {
        para.pop();
      } else {
        break;
      }
    }

    if (para.length == 0) {
      return [para, 0];
    }

    var line0 = para[0];
    var line00 = line0.trimLeft();
    var n = line0.length - line00.length;

    /// figure out the n to trim
    var n0 = n;
    for (var i = 1; i < para.length; ++i) {
      if (!para[i]) continue;
      var line0 = para[i];
      var line00 = line0.trimLeft();
      var n = line0.length - line00.length;
      n0 = Math.min(n0, n);
    }

    /// now trim of the left n character 
    para = this.trim_para_at(para, n0);

    return [para, n0];
  }

  get_line_nspace(line){
    var nspace = 0;
    let line0 = line.trimLeft();
    nspace = line.length - line0.length;
    return nspace;
  }

  split_line_by_verticalbar(line) {
    ///split by vertical-bars
    var re = /\s*(?:\||$)\s*/;
    var ss = line.split(re);
    return ss;
  }

  split_line_by_triplespace(line) {
    ///split by two or more spaces
    var re = /(?:\s{3,}|$)/;
    var ss = line.trim().split(re);
    return ss;
  }

  split_line_by_doublespace(line) {
    ///split by two or more spaces
    var re = /(?:\s{2,}|$)/;
    var ss = line.trim().split(re);
    return ss;
  }

  split_line_by_singlespace(line) {
    ///split by two or more spaces
    var re = /(?:\s{1,}|$)/;
    var ss = line.trim().split(re);
    return ss;
  }

  string_has_item(s,s1){
    if(typeof s !== 'string') return false;
    if(typeof s1 !== 'string') return false;
    var i = s.indexOf(s1);
    const re = /^\S/;
    while(i >= 0){
      var c1 = s.charAt(i-1)||'';
      var c2 = s.charAt(i+s1.length)||'';
      if(!re.test(c1) && !re.test(c2)){
        return true;
      }
      var i = s.indexOf(s1);
    }
    return false;
  }
  string_to_phrase_id_and_content(s,style){
    const re = /^(\w+)\((.*?)\)\s*(.*)$/;
    var v;
    if((v=re.exec(s))!==null){
      var id = v[1];
      var cnt = v[2];
      var s = v[3];
      return [id,cnt,s];
    }else{
      var id = '';
      var cnt = '';
      return [id,cnt,s];
    }
  }
  array_to_array(arr, n) {

    // split an existing array into arrows of given number of items

    var all = [];
    for(let i=0; i < arr.length; i+=n){
      let pp = [];
      for(let j=0; j < n; ++j){
        let k = i+j;
        pp.push(arr[k]);
      }
      all.push(pp);
    }
    return all;
  }

  ///
  /// latex related stylings
  ///
  g_to_latex_fontsize_switch(g){
    var s = g.fontsize||'';
    var s = this.string_to_latex_fontsize_switch(s);
    return s;
  }
  g_to_latex_fontfamily_switch(g){
    var s = g.fontfamily||'';
    var s = this.string_to_latex_fontfamily_switch(s);
    return s;
  }
  g_to_latex_fontstyle_switch(g){
    var s = g.fontstyle||'';
    var s = this.string_to_latex_fontstyle_switch(s);
    return s;
  }

  extract_braced_phrase(line,i,n){
    ///starting at position i, scan for the end of a pattern that is {...}
    ///where the starting position 'i' is one past the first brace.,
    ///the return value is the position one past the end of the pattern
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
    return [i,n];
  }
  extract(line,i){
    ///starting at position i, scan for the end of a pattern that is {...}
    ///where the starting position 'i' is one past the first brace.,
    ///the return value is the position one past the end of the pattern
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
  extract2(line,i){
    ///starting at position i, scan for the end of a pattern that is {...}
    ///where the starting position 'i' is the first brace.,
    ///the return value is the position one past the end of the pattern
    ///NOTE: this called for the second argument of &frac{...}{2nd}
    ///If the first position is not a left brace this function returns i
    if(line.charAt(i)=='{'){
      return this.extract(line,i+1);
    }
    return i;
  }
  calc_dist(x1,y1,x2,y2){
    let dx = x1-x2;
    let dy = y1-y2;
    return Math.sqrt(dx*dx + dy*dy);
  }
  extract_first_word(s){
    const re = /^(\w+)/;
    var v;
    if((v=re.exec(s))!==null){
      return v[1];
    }
    return '';
  }
  is_in_list(s,list){
    return (list.indexOf(s) >= 0);
  }
  number_to_octal_string(num){
    ///'num' is a complex number
    num = num.re;
    var s = '';
    while(Number.isFinite(num) && num > 0){
      let nyble = (num&0x7);
      s = nyble + s;
      num = num >> 3;
    }
    return s;
  }
  number_to_hex_string(num){
    ///'num' is a complex number
    num = num.re;
    var s = '';
    const nybles = ['a','b','c','d','e','f'];
    while(Number.isFinite() && num > 0){
      let nyble = (num&0xF);
      if(nyble > 9) {
        nyble = nybles[nyble-10];
      }
      s = nyble + s;
      num = num >> 4;
    }
    return s;
  }
  number_to_binary_string(num){
    ///'num' is a complex number
    num = num.re;
    var s = '';
    while(Number.isFinite(num) && num > 0){
      let bit = (num&0x1)?'1':'0';
      s = bit + s;
      num = num >> 1;
    }
    return s;
  }
  number_to_uchar(num){
    ///'num' is a complex number
    num = num.re;
    var s = '';
    if(Number.isFinite(num) && num > 0){
      s = String.fromCodePoint(num);
    }
    return s;
  }
  animation_numbers(start,stop,total){
    start = parseFloat(start)||0;
    stop = parseFloat(stop)||0;
    if(total <= 2){
      return [start,stop];
    }
    let n = total - 1;
    let ret_val = [];
    let delta = stop - start;
    for(let j=0; j <= n; j++){
      ret_val.push(j/n*delta + start);
    }
    return ret_val;
  }
  animate_to_env_array(animate,quantity){
    var the_vars = this.string_to_array(animate);
    var the_vars = the_vars.map((s) => s.split('/'));
    var the_vars = the_vars.map((vv) => {
      if(vv.length==2){
        let v = {};
        v.name = vv[0];
        let num1 = parseFloat(vv[1]);
        if(Number.isFinite(num1)){
          v.numbers = this.animation_numbers(num1,num1,quantity);
          return v;
        }else{
          return null;
        }
      }else if(vv.length==3){
        let v = {};
        v.name = vv[0];
        let num1 = parseFloat(vv[1]);
        let num2 = parseFloat(vv[2]);
        if(Number.isFinite(num1)&&Number.isFinite(num2)){
          v.numbers = this.animation_numbers(num1,num2,quantity);
          return v;
        }else{
          return null;
        }
      }else{
        return null;
      }
    });
    var the_vars = the_vars.filter(v => v);
    var env_array = [];
    for(let j=0; j<quantity; ++j){
      let env = {};
      the_vars.forEach((v) => {
        let key = v.name;
        let val = v.numbers[j];
        env[key] = val;
      })
      env_array.push(env);
    }
    return env_array;
  }
  //
  //all properties
  //
  get_float_or_percentage_prop(g, name, def_v=0, min=null, max=null) {
    let val;
    if(g && g.hasOwnProperty(name)){
      val = g[name];
    }
    if(!val) val = def_v;
    if(typeof val==='string' && val.endsWith('%')){
      val = val.slice(0,val.length-1);
      var t = this.assert_float(val,def_v,min,max);
      var flag = 1;
    }else{
      var t = this.assert_float(val,def_v,min,max);
      var flag = 0;
    }
    return [t,flag];
  }
  get_float_prop(g, name, def_v=0, min=null, max=null) {
    let val;
    if(g && g.hasOwnProperty(name)){
      val = g[name];
    }
    return this.assert_float(val,def_v,min,max);
  }
  get_int_prop(g, name, def_v=0, min=null, max=null) {
    let val;
    if(g && g.hasOwnProperty(name)){
      val = g[name];
    }
    return this.assert_int(val,def_v,min,max);
  }
  get_string_prop(g, name, def_v='') {
    let val;
    if(g && g.hasOwnProperty(name)){
      val = g[name];
    }
    return this.assert_string(val,def_v);
  }
  ///
  ///default styles
  ///
  g_to_animate_string(g){
    return this.get_string_prop(g,'animate');
  }
  g_to_count_int(g){
    return this.get_int_prop(g,'count',0);
  }
  g_to_wrap_string(g){
    return this.get_string_prop(g,'wrap');
  }
  g_to_template_array(g){
    let s = this.get_string_prop(g,'template');
    let ss = this.string_to_array(s);
    return ss;
  }
  g_to_stretch_float(g){
    return this.get_float_prop(g,'stretch');
  }
  ///
  /// specific style
  ///
  style_to_css_bordercollapse(style){
    return `border-collapse:collapse;`;
  }
  style_to_css_margin(style){
    return `margin:${this.margin_p} 0;`                    
  }
  style_to_css_fontsize(style){
    return this.string_to_css_fontsize(style.fontsize);
  }
  style_to_css_fontfamily(style){
    return this.string_to_css_fontfamily(style.fontfamily);
  }
  style_to_css_fontstyle(style){
    return this.string_to_css_fontstyle(style.fontstyle);
  }
  style_to_css_width(style,def_width=''){
    var s = '';
    s = this.string_to_css_width(style.width,1,def_width);
    if(s) s = `width:${s};`;
    return s;
  }
  style_to_css_height(style,def_height=''){
    let s = this.string_to_css_height(style.height,1,def_height);
    if(s) s = `height:${s};`;
    return s;
  }
  style_to_css_border(style){
    var s = '';
    if(style.frame){
      s = `border:1px solid;`;
    }
    return s;
  }
  ///
  ///
  ///
  get_latin_type(cc){
    ///cc is an integer between 0 - 0xFF
    if((cc>=0x41&&cc<=0x5A)||(cc>=0x61&&cc<=0x7A)||(cc==0xAA)||(cc==0xB5)||(cc==0xBA)||(cc>=0xC0&&cc<=0xD6)||(cc>=0xD8&&cc<=0xF6)||(cc>=0xF8&&cc<=0xFF)){
      return this.CC_LETTER;
    }
    if((cc>=0x30&&cc<=0x39)||(cc==0xB2)||(cc==0xB3)||(cc==0xB9)||(cc>=0xBC&&cc<=0xBE)){
      return this.CC_NUMBER;
    }
    if((cc>=0x21&&cc<=0x23)||(cc>=0x25&&cc<=0x2A)||(cc>=0x2C&&cc<=0x2F)||(cc>=0x3A&&cc<=0x3B)||(cc>=0x3F&&cc<=0x40)||(cc>=0x5B&&cc<=0x5D)||(cc==0x5F)||(cc==0x7B)||(cc==0x7D)||(cc==0xA1)||(cc==0xA7)||(cc==0xAB)||(cc>=0xB6&&cc<=0xB7)||(cc==0xBB)||(cc==0xBF)){
      return this.CC_PUNC;
    }
    if((cc==0x24)||(cc==0x2B)||(cc>=0x3C&&cc<=0x3E)||(cc==0x5E)||(cc==0x60)||(cc==0x7C)||(cc==0x7E)||(cc>=0xA2&&cc<=0xA6)||(cc>=0xA8&&cc<=0xA9)||(cc==0xAC)||(cc>=0xAE&&cc<=0xB1)||(cc==0xB4)||(cc==0xB8)||(cc==0xD7)||(cc==0xF7)){
      return this.CC_SYMBOL;
    }
    return this.CC_NONE;
  }
  //////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  //////////////////////////////////////////////////////////////////////////////////
  extract_css_style(img,key){
    img = img.trim();
    const re = new RegExp(`^<([A-Za-z]+)\\s*([^<>]*)>(.*)<\\/\\1>$`,'s');
    // const re_svg = /^<svg\s*([^<>]*)>(.*)<\/svg>$/s;
    // const re_img = /^<img\s*([^<>]*)>(.*)<\/img>$/s;
    // const re_table = /^<table\s*([^<>]*)>(.*)<\/table>$/s;
    var v;
    if((v=re.exec(img))!==null){
      var attrs = this.string_to_html_attrs(v[2]);
      var cnt = v[3];
      for(let p of attrs) {
        let p0 = p[0];
        let p1 = p[1];
        if(p0==='style'){
          let l = p1.split(';');
          l = l.map(s => s.trim());
          l = l.filter(s => s.length);
          l = l.map(s => s.split(':'));
          for(let q of l) {
            let q0 = q[0];
            let q1 = q[1];
            if(q0===key){
              return q1;
            }
          }
        }
      }
    }
    return '';
  }
  update_css_style(img,key,val){
    img = img.trim();
    const re = new RegExp(`^<([A-Za-z]+)\\s*([^<>]*)>(.*)<\\/\\1>$`,'s');
    // const re_svg = /^<svg\s*([^<>]*)>(.*)<\/svg>$/s;
    // const re_img = /^<img\s*([^<>]*)>(.*)<\/img>$/s;
    // const re_table = /^<table\s*([^<>]*)>(.*)<\/table>$/s;
    var v;
    if((v=re.exec(img))!==null){
      var tag = v[1].trim();
      var attr = v[2].trim();
      var cnt = v[3].trim();
      var attrs = this.string_to_html_attrs(attr);
      let attrs2 = [];
      for(let p of attrs) {
        let p0 = p[0];
        let p1 = p[1];
        if(p0==='style'){
          let l = p1.split(';');
          l = l.map(s => s.trim());
          l = l.filter(s => s.length);
          l = l.map(s => s.split(':'));
          let l2 = [];
          let updateflag = 0;
          for(let q of l) {
            let q0 = q[0];
            let q1 = q[1];
            if(q0===key){
              q1 = val;
              updateflag = 1;
            }
            l2.push(`${q0}:${q1}`)
          }
          if(updateflag==0){
            l2.push(`${key}:${val}`)
          }
          l = l2;
          p1 = l.join(';');
        }
        attrs2.push(`${p0}='${p1}'`);
      }
      attr = attrs2.join(' ');
      img = `<${tag} ${attr}> ${cnt} </${tag}>`;
    }
    return img
  }
  ///
  ///
  ///
  update_css_class(html,s){
    html = html.trim();
    const re_svg = /^<([A-Za-z]+)\s*([^<>]*)>(.*)<\/\1>$/s;
    const re_img = /^<([A-Za-z]+)\s*([^<>]*)>(.*)<\/\1>$/s;
    const re_table = /^<([A-Za-z]+)\s*([^<>]*)>(.*)<\/\1>$/s;
    var v;
    if((v=re_svg.exec(html))!==null){
      var tag = v[1];
      var attrs = this.string_to_html_attrs(v[2]);
      var cnt = v[3];
    }else if((v=re_img.exec(html))!==null){
      var tag = v[1];
      var attrs = this.string_to_html_attrs(v[2]);
      var cnt = v[3];
    }else if((v=re_table.exec(html))!==null){
      var tag = v[1];
      var attrs = this.string_to_html_attrs(v[2]);
      var cnt = v[3];
    }else{
      return html;
    }
    var flag = 0;
    attrs = attrs.map((p) => {
      let key = p[0];
      let val = p[1];
      if(key=='class'){
        let vals = this.string_to_array(val);
        vals.push(`${s}`);
        val = vals.join(' ');
        flag = 1;
      }
      return [key,val];
    })
    if(!flag){
      attrs.push(['class',s])
    }
    return `<${tag} ${attrs.map(p => `${p[0]}="${p[1]}"`).join(' ')}> ${cnt} </${tag}>`;
  }
  string_to_html_attrs(s){
    ///input 's' is 'style='...' class='...' ...
    s = s.trim();
    const re_attr1 = /^([A-Za-z:]+)\s*=\s*\'(.*?)\'\s*(.*)$/s;
    const re_attr2 = /^([A-Za-z:]+)\s*=\s*\"(.*?)\"\s*(.*)$/s;
    var v;
    var all = [];
    while(s.length){
      if((v=re_attr1.exec(s))!==null){
        var key = v[1];
        var val = v[2];
        s = v[3];
        all.push([key,val]);
        continue;
      }
      if((v=re_attr2.exec(s))!==null){
        var key = v[1];
        var val = v[2];
        s = v[3];
        all.push([key,val]);
        continue;
      }
      break;
    }
    return all;
  }
  col_one_to_rows(col){
    var data = [];
    col.forEach((s) => {
      var pp = this.split_line_by_triplespace(s);
      data.push(pp);
    });
    return data;
  }
  cols_to_rows(cols){
    var data = [];
    var kk = cols.map(x => x.length);
    var k = kk.reduce((acc,cur) => Math.max(acc,cur),0);
    ///k is the max number of rows
    for(let j=0; j < k; ++j){
      var pp = cols.map((col) => col[j]||''); 
      pp = pp.map((s) => {
        s = s.trim();
        return s;
      });
      data.push(pp);
    }
    return data;
  }
  replace_phrase(line,name,prefix,postfix) {
    if(typeof line==='string'){
    }else{
      line = `${line}`;
    }
    ///process the phrase such as &ruby{}, &url, ...
    var v;
    var line = line || '';
    var start_i = 0;
    var newtext = '';
    var txt = '';
    const re = /(?<!\\)(&[A-Za-z]+\{)/gs; //cannot be global because it is used recursively
    while ((v = re.exec(line)) !== null) {
      var i = v.index;
      var txt = line.slice(start_i,i);
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
        ///
        ///call the infamous 'do_phrase'
        ///
        if(key.localeCompare(name)===0){
          txt = `${prefix}${cnt}${postfix}`;
          newtext += txt;
        }else{
          txt = `&${key}{${cnt}}`
          newtext += txt;
        }
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
    newtext += txt;
    return newtext;
  }
  join_backslashed_lines(lines){
    var o = [];
    for (var s of lines) {
      if(o.length){
        let s0 = o[o.length-1];
        if (s0 && s0.endsWith('\\')) {
          s0 = o.pop();
          s0 = s0.slice(0,s0.length-1);///remove the last backslash
          s0 = `${s0} ${s.trimLeft()}`;
          o.push(s0);
        }else{
          o.push(s);
        }
      }else{
        o.push(s);
      }
    }
    return o;
  }
}
module.exports = { NitrilePreviewBase };
