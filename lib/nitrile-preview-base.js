'use babel';

const char_widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375, 0.353125, 0.5890625];
const re_indented = /^\s+\S/;
const re_fullline = /^\S/;
const re_doublespace = /\s\s/;
const re_mode = /^\[(.*?)\]\((.*)\)$/u;

class NitrilePreviewBase {

  constructor(){
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

  string_to_style(line) {

    /// remove before and ending braces
    line = line.trim();
    if(line.startsWith('{') && line.endsWith('}')){
      line = line.substr(1,line.length-2);
    }else if(line.startsWith('[') && line.endsWith(']')){
      line = line.substr(1,line.length-2);
    }

    /// detect which separator to use, semicolon or comma.
    /// strategy: if semicolon is detected it is used, otherwise
    /// comma is used

    var sep = ';';
    if(line.indexOf(sep) < 0){
      sep = ',';
    }

    /// split lines using 'sep'

    var ss = line.split(sep);
    var g = {};
    const re_default = /^"(.*)"$/;
    let v;
    ss.forEach((s,i,arr) => {
      if(i==0 && (v=re_default.exec(s))!==null){
        var key = '_';
        var val = v[1];
      }else{
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
      }
      if (key) {
        g[key] = val;
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
    var text = d.join(',');
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
    if(!Number.isFinite(v)) v = 0;
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

  assert_string(v, def_v) {
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

  assert_int(val, def_v, min=null, max=null) {
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

  assert_float(val, def_v, min=null, max=null) {
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

  split_line_to_tds(line){
    if(line.indexOf('|') < 0){
      ///split by two or more spaces
      var re = /(?:\s{2,}|$)/;
      var ss = line.trim().split(re);
      return ss;
    }else{
      ///split by vertical-bars
      var re = /\s*(?:\||$)\s*/;
      var ss = line.split(re);
      return ss;
    }
  }

  split_line_by_spaces(line,ns) {
    ///
    /// Break a line into multiple segments based on three-spaces
    ///

    var o = [];
    var i = 0;
    var k = -1;
    var n = 0;
    var j0 = 0;
    var j = 0;
    for (j = 0; j < line.length; ++j) {
      var c = line[j];
      if (/\s/.test(c)) {
        i = j;
      } else {
        k = j;
      }
      if (k >= 0 && (i - k == ns)) {
        o.push(line.slice(j0, j + 1));
        j0 = j + 1;
      }
    }
    if (j0 < j) {
      o.push(line.slice(j0, j));
    }
    return o;
  }

  string_has_item(s,s1){
    if(typeof s == 'string' && typeof s == 'string'){
      var re = new RegExp(`\\b${s1}\\b`)
      return re.test(s);
    }
    return false;
  }

  string_to_mode(s){
    let caption = '';
    let fname = '';
    let id = '';
    let title = '';
    let v = re_mode.exec(s);
    if(v!==null){
      caption = v[1].trim();
      let v2 = v[2].trim();
      if(v2.startsWith(".")){
        // [chapter](./myfile.md)
        fname = v2;
      }else if(v2.startsWith("#")){
        // [chapter](#id1)
        id = v2.substr(1);
      }else{
        // [part](My Part Title)
        title = v2;
      }
    }else if(s.startsWith(".")){
      fname = s;
    }else if(s.startsWith("#")){
      id = s.substr(1);
    }
    return {caption,fname,title,id}
  }

  string_to_id_and_style(str){
    var re = /(\w*)(\{.*?\}|)/;
    var v = re.exec(str);
    if(v){
      let id = v[1];
      let style = this.string_to_style(v[2]);
      return {id,style};
    }
    else {
      let id = '';
      let style = {};
      return {id,style};
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
}
module.exports = { NitrilePreviewBase };
