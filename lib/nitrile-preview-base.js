'use babel';

const char_widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375, 0.353125, 0.5890625];
const re_indented = /^(\s+)\S/;
const re_doublespace = /\s\s/;
const json_math = require('./nitrile-preview-math.json');
const path = require('path');
const w3color = require('./nitrile-preview-w3color');
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


class NitrilePreviewBase {

  constructor(){
    /// all hints
    this.hint_linesize1  = 1 << 0;
    this.hint_linesize2  = 1 << 1;
    this.hint_linesize4  = 1 << 2;
    this.hint_nostroke   = 1 << 3;
    this.hint_fill       = 1 << 4;
    this.hint_lighter    = 1 << 5;
    this.hint_darker     = 1 << 6;
    this.hint_linedashed = 1 << 7;
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
    this.hint_grid       = 1 << 21;
    /// constants
    this.MAX_ARRAY = 256;
    this.MAX_FLOAT = 2048;
    this.MIN_FLOAT = 0.000001;
    this.RATIO_CIRCLE_TO_CUBIC = 0.5522847498307933984022516322796;/// (or without rounding: 4*(sqrt(2)-1)/3)
    /// range expression
    this.re_is_range_two = /^([^:]+):([^:]+)$/;
    this.re_is_range_three = /^([^:]+):([^:]+):([^:]+)$/;
    // @rgb(a|b|c) or @hwb(a|b|c)
    this.re_is_aux = /^\^(\d+)\s+(`.*?`|)\s*(\{.*?\}|)\s*(.*)$/;
    this.re_is_col = /^:(\d+)\s+(`.*?`|)\s*(\{.*?\}|)\s*(.*)$/;
    this.re_is_atsign_expr   = /^@\{(.*)\}$/;
    this.re_is_dollar_expr   = /^\$\{(.*)\}$/;
    this.re_is_avr           = /^(@[A-Za-z][A-Za-z0-9]*)\s*(.*)$/;
    this.re_is_apo           = /^'(.*?)'\s*(.*)$/;
    this.re_is_braces        = /^\{(.*?)\}\s*(.*)$/;
    this.re_is_brackets      = /^\[(.*?)\]\s*(.*)$/;
    this.re_is_colorfunction =  /^@([A-Za-z][A-Za-z0-9]*)\((.*)\)$/;
    this.re_is_math = /^\\\((.*)\\\)$/;
    this.re_is_var = /^\*(.*?)\*$/;
    this.re_is_verb = /^`(.*?)`$/;
    this.re_is_quotation = /^"(.*?)"$/;
    this.re_is_buf_start = /^%+\s*(.*)$/;
    this.re_is_buf_paste = /^\?(\w+)$/;
    this.re_is_symbol_name = /^([A-Za-z][A-Za-z0-9]*)$/;
    this.re_is_bundle_fence = /^```([A-Za-z]*)\s*(.*)$/;
    this.re_is_linked_anchor = /^\[(.*?)\]\((.*)\)$/;
    this.re_is_subcaption = /^\((\w*)\)\s*(.*)$/;
    this.re_is_fullline = /^\S/;
    this.re_is_indentedline = /^(\s+)(.*)$/u;
    // symbols starting a paragraph
    this.re_body_is_detai          = /^(\d+|\+|-|\*)(\)+)\s+(.*)$/u;
    this.re_body_is_tabbi          = /^(<+)(\s)(.*)$/u;
    this.re_body_is_4spce          = /^\s\s\s\s(.*)$/u;
    this.re_body_is_1spce          = /^\s(.*)$/u;
    this.re_body_is_fence          = /^(```)(.*)$/u;
    this.re_body_is_tilda          = /^(~)(\s)(.*)$/u;
    this.re_body_is_lthan          = /^(<+)(\s)(.*)$/u;
    this.re_body_is_gthan          = /^(>)(\s)(.*)$/u;
    this.re_body_is_vtbar          = /^(\|)(\s)(.*)$/u;
    this.re_body_is_dolla          = /^(\$)(\s)(.*)$/u;
    this.re_body_is_excla          = /^(!)(\s)(.*)$/u;
    this.re_body_is_hyphe          = /^(-)(\s)(.*)$/u;
    this.re_body_is_numpe          = /^(\d+\.)(\s)(.*)$/u;
    this.re_body_is_pluss          = /^(\+)(\s)(.*)$/u;
    this.re_body_is_astrk          = /^(\*)(\s)(.*)$/u;
    this.re_body_is_itemi          = /^(-|\*|\d+\.)(\s)(.*)$/u;
    this.re_body_is_dback          = /^(\\\\)(\s)(.*)$/u;
    this.re_body_is_amper          = /^(&)(\s)(.*)$/u;
    this.re_body_is_colon          = /^(:)(\s)(.*)$/u;
    // lines
    this.re_line_is_calc           = /^&\{(.*)\}$/u;
    // others
    this.re_symbol_with_subscript = /^([A-Za-z][A-Za-z0-9]*)(\[\d+\]|_\d+|)$/;
    this.re_is_dhline = /^[=\s]+$/;
    this.re_split_doublebackslash = /\s*(?:\\\\)\s*/;
    this.re_split_triplespace = /\s{3,}/;
    // w3color
    this.w3color = w3color;
    // type
    this.CC_NONE   = 0;
    this.CC_LETTER = 1;
    this.CC_NUMBER = 2;
    this.CC_PUNC   = 3;
    this.CC_SYMBOL = 4;
    this.CC_OTHER  = 5;
    /// units
    this.MM_TO_PX = 3.7795296;
    this.MM_TO_PT = 2.835;
    this.PT_TO_MM = 0.352777778;
    /// Number
    this.MAX_FLOAT = 1E6;
    this.MAX_INT = 1E6;
    /// viewport settings
    this.VIEWPORT_WIDTH  = 10;
    this.VIEWPORT_HEIGHT = 7;
    this.VIEWPORT_UNIT   = 5;
    this.VIEWPORT_GRID   = 1;
    /// default
    /// three preset stroke color
    this.stroke1 = 'red';
    this.stroke2 = 'green';
    this.stroke3 = 'blue';
    this.gridcolor = '@rgb(235|235|235)';
    /// ten preset fill color
    this.fill0 = '@hwb(0|0%|20%)';
    this.fill1 = '@hwb(210|0%|20%)';
    this.fill2 = '@hwb(300|0%|20%)';
    this.fill3 = '@hwb(60|0%|20%)';
    this.fill4 = '@hwb(240|0%|20%)';
    this.fill5 = '@hwb(90|0%|20%)';
    this.fill6 = '@hwb(30|0%|20%)';
    this.fill7 = '@hwb(150|0%|20%)';
    this.fill8 = '@hwb(180|0%|20%)';
    this.fill9 = '@hwb(270|0%|20%)';
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
    var result = [];
    if(typeof text == 'string'){
      result = text.split(/\s+/);
    }
    return result;
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
    if(style && typeof style === 'object'){
      var g = {...style};
    }else{
      var g = {};
    }
    s = s || '';
    s = s.trim();
    //remove the braces from either end
    if(s.startsWith('{')&&s.endsWith('}')){
      s = s.slice(1,-1);        
    }
    /// split lines using 'sep'
    var ss = s.split(',');
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
      if (this.re_is_symbol_name.test(key)) {
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

  string_to_letter_array(text) {
    var result = [];
    if(typeof text == 'string'){
      result = text.replace(/\s/g,"").split("");
    }
    return result;
  }

  measure_text_length(str, fontSize = 12) {
    const avg = 0.5279276315789471
    return str
      .split('')
      .map(c => c.codePointAt(0) < char_widths.length ? char_widths[c.codePointAt(0)] : avg)
      .reduce((cur, acc) => acc + cur, 0) * fontSize;
  }

  trim_left(para){
    return para.map(x => x.trimStart());
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

  replace_leading_blanks_with(s, x) {
    s = s.replace(/^\x20+/,(match)=>{return x.repeat(match.length)})
    return s;
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
    s1 = s1.trimStart();
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
    var line = '';
    if (para && Array.isArray(para)) {
      para.forEach((s,i,arr) => {
        if(i==0) line = s;
        else line = this.join_line(line,s);
      });
    }
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

  string_to_latex_fontfamily_switch(s){
    ///NOTE: 's' is a string such as 'monospace'
    if(s=='t'||s=='T'){
      return '\\ttfamily'
    }
    return '';
  }

  string_to_latex_fontstyle_switch(s){
    ///NOTE: 's' is a string such as 'normal', 'italic', or 'oblique'
    if(s=='s'||s=='S'){
      return '\\slshape';
    }else if(s=='i'||s=='I'){
      return '\\itshape'
    }else if(s=='b'||s=='B'){
      return '\\bfseries'
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
      s = `; font-size:${s}`
      return s;
    }
    var s = parseFloat(s);
    if(Number.isFinite(s)){
      s = `; font-size:${s}pt`;
      return s;
    }
    return '';
  }

  string_to_css_fontfamily(s){
    if(s=='monospace'){
      s = `; font-family:${s}`;
      return s;
    }
    return '';
  }

  string_to_css_fontstyle(s){
    if(s=='italic'){
      s = `; font-style:${s}`
      return s;
    }else if(s=='oblique'){
      s = `; font-style:${s}`
      return s;
    }
    return '';
  }

  string_to_contex_fontfamily_switch(s){
    ///NOTE: 's' is a string such as 'monospace'
    if(s=='t'||s=='T'){
      return '\\tt'
    }
    return '';
  }

  string_to_contex_fontstyle_switch(s){
    ///NOTE: 's' is a string such as 'normal', 'italic', or 'oblique'
    if(s=='s'||s=='S'){
      return '\\sl';
    }else if(s=='i'||s=='I'){
      return '\\it'
    }else if(s=='b'||s=='B'){
      return '\\bf'
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
    if(ta=='c'||
       ta=='l'||
       ta=='r'||
       ta=='ul'||
       ta=='bl'||
       ta=='ur'||
       ta=='br'||
       ta=='u'||
       ta=='b'){
      return ta;
    }
    return 'ur';
  }

  is_valid_ta(s){
    if( s.localeCompare('c') == 0 ||
        s.localeCompare('l') == 0 ||
        s.localeCompare('r') == 0 ||
        s.localeCompare('u') == 0 ||
        s.localeCompare('b') == 0 ||
        s.localeCompare('ul') == 0 ||
        s.localeCompare('ur') == 0 ||
        s.localeCompare('bl') == 0 ||
        s.localeCompare('br') == 0) {
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
      return this.re_is_fullline.test(line);      
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

  trim_para_verbatim(para) {
    para = para.map(s => {
      if(s.startsWith('\t')){
        return s.slice(1);
      }else{
        return s.slice(4);
      }
    })
    return para;
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
    var line00 = line0.trimStart();
    var n = line0.length - line00.length;

    /// figure out the n to trim
    var n0 = n;
    for (var i = 1; i < para.length; ++i) {
      if (!para[i]) continue;
      var line0 = para[i];
      var line00 = line0.trimStart();
      var n = line0.length - line00.length;
      n0 = Math.min(n0, n);
    }

    /// now trim of the left n character 
    para = this.trim_para_at(para, n0);

    return [para, n0];
  }

  get_line_nspace(line){
    var nspace = 0;
    let line0 = line.trimStart();
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
  /// text related stylings
  ///
  g_to_mien_fontfamily_flag(g){
    var ff = this.string_to_letter_array(g.mien).map(s=>s.toLowerCase()).filter(s => (s=='t'));
    return ff[0]||'';
  }
  g_to_mien_fontstyle_flag(g){
    var ff = this.string_to_letter_array(g.mien).map(s=>s.toLowerCase()).filter(s => (s=='i'));
    return ff[0]||'';
  }
  g_to_mien_fontweight_flag(g){
    var ff = this.string_to_letter_array(g.mien).map(s=>s.toLowerCase()).filter(s => (s=='b'));
    return ff[0]||'';
  }
  g_to_mien_textdecoration_flag(g){
    var ff = this.string_to_letter_array(g.mien).map(s=>s.toLowerCase()).filter(s => (s=='s'));
    return ff[0]||'';
  }

  ///
  /// latex related stylings
  ///
  g_to_latex_fontfamily_switch(g){
    var s = this.g_to_fontstyle_string();
    var s = this.string_to_latex_fontfamily_switch(s);
    return s;
  }
  g_to_latex_fontstyle_switch(g){
    var s = this.g_to_fontstyle_string();
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
  string_to_hexcolor(s,hints){
    // the 're_colorfunction' would detect the color function
    // such as "hwb(30|10%|20%)" 
    let v;
    // replace stroke1/2/3, and fill0/1/2/3/4/5/6/7/8/9
    s = s.replace(/^stroke[123]$/,(match) => { return this[match]; });
    s = s.replace(/^fill[0-9]$/,(match) => { return this[match]; });
    // replace color function such as '@hwb(30|30%|30%)'
    if((v=this.re_is_colorfunction.exec(s))!==null){
      ///NOTE: convert '@hwb(30|30%|30%)' -> 'hwb(30,30%,30%)'
      let key = v[1];
      let val = v[2];
      s = `${key}(${val.split('|').join(',')})`;
    }
    var b = this.w3color(s);///'b' is a special object
    if(hints & this.hint_darker){
      b.darker(15);
    }
    if(hints & this.hint_lighter){
      b.lighter(15);
    }
    s = b.toHexString();
    return s;
  }
  //
  //all properties
  //
  get_floats_prop(g, name) {
    let val;
    if(g && g.hasOwnProperty(name)){
      val = g[name];
    }
    if(Array.isArray(val)){
      return val.map(s => parseFloat(s)).filter(s => Number.isFinite(s));
    }else if(Number.isFinite(val)){
      return [val];
    }else if(val){
      let s = val.toString();
      let ss = s.split(/\s+/).map(s => parseFloat(s)).filter(s => Number.isFinite(s));
      return ss;
    }else{
      return [];
    }
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
  g_to_n_int(g){
    return this.get_int_prop(g,'n',0);
  }
  g_to_width_float(g){
    return this.get_float_prop(g,'width');
  }
  g_to_height_float(g){
    return this.get_float_prop(g,'height');
  }
  g_to_viewport_array(g){
    let s = this.get_string_prop(g,'viewport');
    let ss = this.string_to_array(s);
    let viewport_width  = this.assert_int(ss[0],this.VIEWPORT_WIDTH);
    let viewport_height = this.assert_int(ss[1],this.VIEWPORT_HEIGHT);
    let viewport_unit   = this.assert_int(ss[2],this.VIEWPORT_UNIT);
    let viewport_grid   = this.assert_int(ss[3],this.VIEWPORT_GRID);
    return [viewport_width,viewport_height,viewport_unit,viewport_grid];
  }
  g_to_background_string(g){
    return this.get_string_prop(g,'background');
  }
  g_to_vspace_float(g){
    return this.get_float_prop(g,'vspace',1,0,this.MAX_FLOAT);
  }
  g_to_fillalpha_float(g){
    return this.get_float_prop(g,'fillalpha',1,0,1);
  }
  g_to_linealpha_float(g){
    return this.get_float_prop(g,'linealpha',1,0,1);
  }
  g_to_angle_float(g){
    return this.get_float_prop(g,'angle',0,0,90);
  }
  g_to_shade_string(g){
    return this.get_string_prop(g,'shade','');
  }
  g_to_linedashed_int(g){
    var t = this.get_int_prop(g,'linedashed',0);
    if(t) return t;
    if(g.hints & this.hint_linedashed){
      return 1;
    }
    return 0;
  }
  g_to_linesize_float(g){
    var t = this.get_float_prop(g,'linesize',0,0,this.MAX_FLOAT);
    if(g.hints & this.hint_linesize1){
      t += 1;
    }
    if(g.hints & this.hint_linesize2){
      t += 2;
    }
    if(g.hints & this.hint_linesize4){
      t += 4;
    }
    return t;
  }  
  g_to_dotcolor_string(g){
    return this.get_string_prop(g,'dotcolor','');
  }
  g_to_linecolor_string(g){
    if(g.hints & this.hint_nostroke){
      return 'none';
    }
    if(g.hints & this.hint_grid){
      return this.assert_string(g.gridcolor,this.gridcolor);
    }
    if(g.hints & this.hint_stroke1){
      return this.assert_string(g.stroke1,this.stroke1);
    }
    if(g.hints & this.hint_stroke2){
      return this.assert_string(g.stroke2,this.stroke2);
    }
    if(g.hints & this.hint_stroke3){
      return this.assert_string(g.stroke3,this.stroke3);
    }
    return this.get_string_prop(g,'linecolor','');
  }
  g_to_backgroundalpha_float(g){
    return this.get_float_prop(g,'backgroundalpha',0.1,0,1);
  }
  g_to_fillcolor_string(g){
    if(g.hints & this.hint_fill0){
      return this.assert_string(g.fill0,this.fill0);
    }
    if(g.hints & this.hint_fill1){
      return this.assert_string(g.fill1,this.fill1);
    }
    if(g.hints & this.hint_fill2){
      return this.assert_string(g.fill2,this.fill2);
    }
    if(g.hints & this.hint_fill3){
      return this.assert_string(g.fill3,this.fill3);
    }
    if(g.hints & this.hint_fill4){
      return this.assert_string(g.fill4,this.fill4);
    }
    if(g.hints & this.hint_fill5){
      return this.assert_string(g.fill5,this.fill5);
    }
    if(g.hints & this.hint_fill6){
      return this.assert_string(g.fill6,this.fill6);
    }
    if(g.hints & this.hint_fill7){
      return this.assert_string(g.fill7,this.fill7);
    }
    if(g.hints & this.hint_fill8){
      return this.assert_string(g.fill8,this.fill8);
    }
    if(g.hints & this.hint_fill9){
      return this.assert_string(g.fill9,this.fill9);
    }
    if(g.hints & this.hint_fill){
      return this.get_string_prop(g,'fillcolor','currentColor');
    }else{
      return this.get_string_prop(g,'fillcolor','');
    }
  }
  g_to_linecap_string(g){
    return this.get_string_prop(g,'linecap','');
  }
  g_to_linejoin_string(g){
    return this.get_string_prop(g,'linejoin','');
  }
  g_to_barlength_float(g) {
    return this.get_float_prop(g,'barlength',0.4,0,this.MAX_FLOAT);
  }
  g_to_dotsize_float(g){
    return this.get_float_prop(g,'dotsize',5,0,this.MAX_FLOAT);
  }
  g_to_fontsize_float(g){
    return this.get_float_prop(g,'fontsize',10,0,this.MAX_FLOAT);
  }
  g_to_fontsize_string(g){
    return this.get_string_prop(g,'fontsize','');
  }
  g_to_fontcolor_string(g){
    return this.get_string_prop(g,'fontcolor','');
  }
  g_to_shadecolor_string(g){
    return this.get_string_prop(g,'shadecolor','');
  }
  g_to_fontstyle_string(g){
    return this.get_string_prop(g,'fontstyle','');
  }
  g_to_fontstyle_array(g){
    var fontstyle = this.get_string_prop(g,'fontstyle','');
    var ff = fontstyle.split('').map(s => s.trim()).filter(s => s.length);
    return ff;
  }
  g_to_format_array(g){
    const re = /^(%[^%]*)\s*(.*)$/;
    var s = this.get_string_prop(g,'format','');
    var v;
    var fm = [];
    while((v=re.exec(s))!==null){
      fm.push(v[1]);
      s=v[2];
    }
    return fm;
  }
  g_to_arrowhead_int(g){
    return this.get_int_prop(g,'arrowhead',0);
  }
  g_to_scaleX_float(g){
    return this.get_float_prop(g,'scaleX',1);
  }
  g_to_scaleY_float(g){
    return this.get_float_prop(g,'scaleY',1);
  }
  g_to_rotate_float(g){
    return this.get_float_prop(g,'rotate',0);
  }
  g_to_shear_float(g){
    return this.get_float_prop(g,'shear',0.1,0);
  }
  g_to_w_float(g){
    return this.get_float_prop(g,'w',3,0);
  }
  g_to_h_float(g){
    return this.get_float_prop(g,'h',2,0);
  }
  g_to_rx_float(g){
    return this.get_float_prop(g,'rx',0.5,0);
  }
  g_to_ry_float(g){
    return this.get_float_prop(g,'ry',0.5,0);
  }
  g_to_r_float(g){
    return this.get_float_prop(g,'r',0.5,0);
  }
  g_to_mar_float(g){
    return this.get_float_prop(g,'mar',0);
  }
  g_to_pen_float(g){
    return this.get_float_prop(g,'pen',0);
  }
  g_to_extent_float(g){
    return this.get_float_prop(g,'extent',10);
  }
  g_to_nodetype_string(g){
    return this.get_string_prop(g,'nodetype','');
  }
  g_to_boxtype_string(g){
    return this.get_string_prop(g,'boxtype','');
  }
  g_to_showid_int(g){
    return this.get_int_prop(g,'showid',0);
  }
  g_to_showgrid_int(g){
    return this.get_int_prop(g,'showgrid',0);
  }
  g_to_shift_float(g){
    return this.get_float_prop(g,'shift',0);
  }
  g_to_protrude_float(g){
    return this.get_float_prop(g,'protrude',0);
  }
  g_to_span_float(g){
    return this.get_float_prop(g,'span',0);
  }
  g_to_t_float(g){
    return this.get_float_prop(g,'t',0.5);
  }
  g_to_start_float(g){
    return this.get_float_prop(g,'start',0);
  }
  g_to_ri_float(g){
    return this.get_float_prop(g,'ri',0);
  }
  g_to_abr_string(g){
    return this.get_string_prop(g,'abr',0);
  }
  g_to_rdx_float(g){
    return this.get_float_prop(g,'rdx',0);
  }
  g_to_rdy_float(g){
    return this.get_float_prop(g,'rdy',0);
  }
  g_to_fillonly_int(g){
    return this.get_int_prop(g,'fillonly',0);
  }
  g_to_plottype_string(g){
    return this.get_string_prop(g,'plottype');
  }
  g_to_inversed_int(g){
    ///0=anti-clockwise,1=clockwise
    return this.get_int_prop(g,'inversed',0);
  }
  g_to_xgrid_float(g){
    return this.get_float_prop(g,'xgrid',1,this.MIN_FLOAT);
  }
  g_to_ygrid_float(g){
    return this.get_float_prop(g,'ygrid',1,this.MIN_FLOAT);
  }
  g_to_xaxis_string(g){
    return this.get_string_prop(g,'xaxis');
  }
  g_to_yaxis_string(g){
    return this.get_string_prop(g,'yaxis');
  }
  g_to_xtick_string(g){
    return this.get_string_prop(g,'xtick');
  }
  g_to_ytick_string(g){
    return this.get_string_prop(g,'ytick');
  }
  g_to_skew_string(g){
    return this.get_string_prop(g,'skew');
  }
  g_to_math_int(g){
    return this.get_int_prop(g,'math',0,0,1);
  }
  g_to_fit_string(g){
    return this.get_string_prop(g,'fit');
  }
  g_to_clippath_string(g){
    return this.get_string_prop(g,'clippath');
  }
  g_to_hew_int(g){
    return this.get_int_prop(g,'hew',0);
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
          s0 = `${s0} ${s.trimStart()}`;
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
  async read_text_file(fs,filename) {
    return new Promise((resolve, reject)=>{
      fs.readFile(filename, "utf8", function(err, data) {
        if (err) {
          reject(err.toString());
        } else {
          resolve(data.toString());
        }
      });
    });
  }
  async write_text_file(fs,filename,data) {
    return new Promise((resolve, reject)=>{
      fs.writeFile(filename, data, 'utf8', function(err) {
        if (err) {
          reject(err.toString());
        } else {
          resolve(filename);
        }
      });
    });
  }
  int_array_to_range_array(ii){
    var n = 0;
    var pp = [];
    ii.forEach(i => {
      pp.push([n,n+i]);
      n += i;
    });
    return pp;
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
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  body_is_bundle(ss){
    var n = ss.length;
    var s0 = ss[0];
    var sz = ss[n-1];
    if(n >= 2 && s0.startsWith('```') && sz.startsWith('```')){
      return true;
    }else{
      return false;
    }
  }
  string_to_argument_pair(s){
    let v = s.split(':').map(s => s.trim());
    v.push('');
    v.slice(0,2);
    return v;
  }
  string_to_template_array(s) {
    // var pp = this.string_to_array(s||'');
    var re_lcrp = /^([lcrp])(\d*)\s*(.*)$/;
    var pp = [];
    var v;
    while(s && s.length){
      if((v=re_lcrp.exec(s))!==null){
        let ta = v[1];
        let pw = parseInt(v[2])||20;
        s = v[3];
        pp.push({ta,pw});
      }else{
        break;
      }
    }
    return pp;
  }
  string_to_ww_array(template,textalign) {
    // var pp = this.string_to_array(s||'');
    var ww = this.string_to_int_array(template);
    var aa = this.string_to_letter_array(textalign);
    ww = ww.map((w,i) => {
      let ta = aa[i]||'';
      let pw = w;
      let p = {pw,ta};
      return p;
    });
    return ww;
  }
  build_default_pagenum_map(blocks) {
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of blocks) {
      if(block.sig=='PART' || block.sig=='CHAP' || block.sig=='PAGE'){
        pp = [];
        pp.push({block});
        o.push(pp);
      }else if(block.style.splitids){
        //create new blocks one for each splitid in 'block.style.splitids' settings
        let splitids = block.style.splitids||'';
        splitids = splitids.split(/\s+/);
        splitids = splitids.map(s => parseInt(s));
        splitids = splitids.filter(s => Number.isFinite(s));
        splitids.forEach((splitid,j,arr) => {
          if(j==0){
            let block1 = block;//use the original block and style
            block1.splitid = splitid;
            pp.push({block:block1});
          }else{
            pp = [];
            o.push(pp);
            let block0 = {...block};//duplicate and create a new block
            block0.sig = 'CAPT';
            block0.id = 'page';
            pp.push({block:block0});
            let block1 = {...block};//duplicate and create a new block
            block1.splitid = splitid;
            pp.push({block:block1});
          }
        });
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
      pp.pagenum = pagenum;
      pp.forEach((p,j) => {
        if(p.block){
          p.block.style.__pagenum = pagenum;
        }  
      });
    });
    return o;
  }
  to_composed_text(cm,g){
    let m = g['$'];
    cm = cm.replace(/\$(\d+)/g, (p,p1) => {
      let id = parseInt(p1);
      if(m && Array.isArray(m) && id>=1 && id<=m.length){
        return m[id-1].raw;
      }else{
        return NaN;
      }
    })
    return cm;
  }
  to_formatted_text(s,fmt){
    const re_fgroup = /^%(\-?)(\+?)(\s?)([0-9]*)(\.?)([0-9]*)([A-Za-z%])$/;
    const nsp = String.fromCodePoint(160);//nbsp
    var v;
    ///note that 'args' is a array obtained by doing this.string_to_array()
    if((v=re_fgroup.exec(fmt))!==null){
      let f_minus_sign = v[1];
      let f_plus_sign = v[2];
      let f_sp = v[3];
      let f_min_field = v[4];
      let f_dot = v[5];
      let f_precision = v[6];
      let f_letter = v[7];
      fmt = v[8];
      let num = 0;
      ///cases
      switch(f_letter){
        case 's': {
          s = s.toString();//convert it to string because it could be a Complex number
          break;
        }
        case 'o': {
          ///convert to a binary with numbers 0-7
          ///format "%o" 8 => '10'
          num = parseInt(s);
          if(Number.isFinite(num)){
            s = this.number_to_octal_string(num);
          }
          break;
        }
        case 'x': {
          ///convert to a hex string with 0-9 and a-f
          ///format "%x" 15 => 'f'
          num = parseInt(s);
          if(Number.isFinite(num)){
            s = this.number_to_hex_string(num);
          }
          break;
        }
        case 'X': {
          ///convert to a binary with 0-9 and A-F
          ///format "%b" 15 => 'F'
          num = parseInt(s);
          if(Number.isFinite(num)){
            s = this.number_to_hex_string(num);
            s = s.toUpperCase();   
          }
          break;
        }
        case 'b': {
          ///convert to a binary with all 1's and 0's
          ///format "%b" 5 => '101'
          num = parseInt(s);
          if(Number.isFinite(num)){
            s = this.number_to_binary_string(num);
          }
          break;
        }
        case 'c': {
          ///convert a number to a Unicode character
          ///format "%c" 65 => 'A'
          num = parseInt(s);
          if(Number.isFinite(num)){
            s = this.number_to_uchar(num);
          }
          break;
        }
        case 'f': {
          num = parseFloat(s);
          if(Number.isFinite(num)){
            s = ''+num;
            if(f_precision){
              s = num.toFixed(f_precision);
            }
            if(Math.sign(num)>=0){
              if(f_sp){
                s = nsp + s;
              }else if(f_plus_sign){
                s = '+' + s;
              }
            }     
          }
          break;
        }
        case 'd': {
          num = parseInt(s);
          if(Number.isFinite(num)){
            num = Math.floor(num);
            s = num;
            if(Math.sign(num)>=0){
              if(f_sp){
                s = nsp + s;
              }else if(f_plus_sign){
                s = '+' + s;
              }
            }   
          }
          break;
        }
      }
      if(typeof s == "string" && f_min_field && f_min_field > s.length){
        if(f_min_field[0]=='0'){
          ///add zeros at the beginning
          s = '0'.repeat(+f_min_field-s.length) + s;
        }
        else if(f_minus_sign){
          ///add spaces at the end
          s = s + nsp.repeat(+f_min_field-s.length);
        }else{
          ///add spaces at the beginning
          s = nsp.repeat(+f_min_field-s.length) + s;
        }
      } else {
        s = s.toString(); 
      }
    }else if(typeof s != "string"){
      s = s.toString();
    }
    return s;
  }
  get_next_enum(style){
    let key = `${style.__sectnum}.${style.__subsnum}.${style.__ssubnum}`;
    let a = style.__parser.memo[key]||0;
    a++;
    style.__parser.memo[key]=a;
    return a;
  }
  col_letter_to_col_num(c){
    c = c.toLowerCase();
    var diff = c.codePointAt(0)-'a'.codePointAt(0);
    return diff+1;
  }
}
module.exports = { NitrilePreviewBase };
