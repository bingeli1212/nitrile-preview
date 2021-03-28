'use babel';

const char_widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375, 0.353125, 0.5890625];
const re_indented = /^\s+\S/;
const re_fullline = /^\S/;
const re_doublespace = /\s\s/;
const re_mode = /^\[(.*?)\](.*)$/;
const json_math = require('./nitrile-preview-math.json');
const path = require('path');

class NitrilePreviewBase {

  constructor(){
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
    this.hint_figure     = 512;
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

  string_to_style(s, g) {
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
    if(g && typeof g === 'object'){
      // good!
    }else{
      g = {};
    }
    ///make a copy of g
    g = {...g};
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
    return [g,s];
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
    return this.is_within(cc,0x4E00,0x9FFF) ||
           this.is_within(cc,0x3040,0x309F) ||
           this.is_within(cc,0x30A0,0x30FF) ||
           this.is_within(cc,0xAC00,0xD7A3) ||
           this.is_within(cc,0x3400,0x4DBF);
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
    if (s0 && s1 && this.is_cjk_cc(s0.codePointAt(s0.length-1)) && this.is_cjk_cc(s1.codePointAt(0))) {
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
      return re_indented.test(line);      
    }
    return false;
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

  string_to_mode(s){
    let name = '';
    let fname = '';
    let id = '';
    let title = '';
    let content = s;
    let v ;
    if((v=re_mode.exec(s))!==null){
      name = v[1].trim();
      content = v[2].trim();
    }
    if(content.startsWith(".")){
      // [chapter]./myfile.md
      fname = content;
    }else if(content.startsWith("#")){
      // [chapter]#id1
      id = content.substr(1);
    }else{
      // [part]My Part Title
      title = content;
    }
    return {name,fname,title,id}
  }

  string_to_id_and_style(s,style){
    const re = /^(\w*)(.*)$/;
    var id = '';
    var style = style||{};
    var v;
    if((v=re.exec(s))!==undefined){
      var id = v[1];
      var [style,s] = this.string_to_style(v[2],style);
    }
    return [id,style,s];
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

  ///
  /// Choose an image file based on their extentions
  ///
  choose_latex_image_file(ss){
    const supported = ['.pdf','.png','.jpg','.mps','.jpeg','.jbig2','.jb2','.PDF','.PNG','.JPG','.JPEG','.JBIG2','.JB2'];
    for(let s of ss){
      var extname = path.extname(s);
      if(supported.indexOf(extname)>=0){
        return s;
      }
    }
    return '';
  }
  ///
  /// Choose an image file based on their extentions
  ///
  choose_html_image_file(ss){
    const supported = ['.svg','.png','.jpg','.jpeg','.bmp','.gif'];
    for(let s of ss){
      var extname = path.extname(s).toLowerCase();
      if(supported.indexOf(extname)>=0){
        return s;
      }
    }
    return '';
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
    ///assume 'num' is a valid 'number'
    var s = '';
    while(num){
      let nyble = (num&0x7);
      s = nyble + s;
      num = num >> 3;
    }
    return s;
  }
  number_to_hex_string(num){
    ///assume 'num' is a valid 'number'
    var s = '';
    const nybles = ['a','b','c','d','e','f'];
    while(num){
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
    ///assume 'num' is a valid 'number'
    var s = '';
    while(num){
      let bit = (num&0x1)?'1':'0';
      s = bit + s;
      num = num >> 1;
    }
    return s;
  }
}
module.exports = { NitrilePreviewBase };
