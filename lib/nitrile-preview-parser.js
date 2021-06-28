'use babel';

const fs = require('fs');
const path = require('path');
const { NitrilePreviewBase } = require('./nitrile-preview-base.js');
const utils = require('./nitrile-preview-utils');

const re_hdgs  = /^(#+)\s+(.*)$/u;
const re_plst  = /^(-|\+|\*|<>|\d+[\.]|[A-Za-z][\.])\s+(.*)$/u;
const re_sdot  = /^\.([A-Za-z]*)(.*)$/;
const re_samp  = /^\s{4,}(.*)$/u;
const re_cove  = /^(>)\s+(.*)$/u;
const re_hrle  = /^\*{3,}$/u;
const re_prim1 = /^\[\s+(.*?)\s+\]\s*(.*)$/;
const re_prim2 = /^\[\[\s+(.*?)\s+\]\]\s*(.*)$/;
const re_prim3 = /^\[\[\[\s+(.*?)\s+\]\]\]\s*(.*)$/;

const re_frnt  = /^---$/;
const re_kval  = /^(\w[\w\.\-]*)\s*:\s*(.*)$/;
const re_buffer_start = /^(%%%)=(\w+)$/;
const re_buffer_stop = /^(%%%)/;
const re_switch = /^%(\w+)\s*(\{.*\})$/;
const re_vmap = /^(\S+?)\u{30fb}(\S+)/u;
const re_label = /^\s*&label\{(\S+)\}\s*$/;


class NitrilePreviewParser extends NitrilePreviewBase {

  constructor() {
    super();
    this.fname = '';///the filename metadata
    this.style = {};
    this.buffers = {};
    this.switches = {};
    this.vmap = [];
    this.data = {};
    this.blocks = [];
  }
  /////////////////////////////////////////////////////////////////////
  /// read_line
  /////////////////////////////////////////////////////////////////////
  read_lines(lines) {
    this.blocks = [];
    var n = 0;
    var row1 = 0;
    var row2 = 0;
    var hdgn = 0;
    var block = {};
    ///
    /// front matter
    ///
    if(lines.length){
      var sig = '';
      var data = [];
      var para = [];
      var v;
      if(re_frnt.test(lines[0].trim())){
        sig = 'FRNT';
        for(n=1; n < lines.length; n++){
          if(re_frnt.test(lines[n].trim())){
            n++;
            break;
          }
          let line = lines[n];
          line = line.trimRight();
          if(this.line_is_fullline(line)){
            if((v=re_kval.exec(line))!==null){
              let key = v[1];
              let txt = v[2].trim();
              data.push([key,[txt]]);
            }
          }else{
            let txt = line.trim();
            if(data.length){
              let [key,val] = data.pop();
              val.push(txt);
              data.push([key,val]);
            }
          }
        }
        ///
        /// Read switches and vmap entries
        ///
        var save_buf = null;
        for (; n < lines.length; n++) {
          var s = lines[n].trimRight();
          var sig0 = '';
          if(s.length==0){
            break;
          }
          if((v=re_buffer_start.exec(s))!==null){
            //buffer
            save_buf = [];
            let name = v[2];
            this.buffers[name] = save_buf;
            continue;
          }
          if((v=re_buffer_stop.exec(s))!==null){
            save_buf = null;
            continue;
          }
          if(save_buf){
            save_buf.push(s);
            continue;
          }
          if((v=re_switch.exec(s))!==null){
            //switches
            sig0 = v[1];
            let g1 = this.string_to_style(v[2]);
            ///merge
            let g0 = this.switches[sig0]||{};
            g0 = {...g0,...g1};
            this.switches[sig0] = g0;
            continue;
          }
          if((v=re_vmap.exec(s))!==null){
            let rb = v[1];
            let rt = v[2];
            let raw = s;
            this.vmap.push({rb,rt,raw});
            continue;
          }
        }
        ///skip empty lines
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
        para = lines.slice(0, n);
      } else if(this.line_is_fullline(lines[0].trim())){
        sig = 'FRNT';
        n++;
        let key = 'title';
        let txt = lines[0].trim();
        if(txt.startsWith('# ')) txt = txt.slice(2).trim();///remove the '# ' if it starts with it
        data.push([key,[txt]]); //note that 'val' is added as a list
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
        para = lines.slice(0, n);
      }else{
        ///if there isn't any FRNT block then we need to create an empty
        /// FRNT block
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
        para = lines.slice(0, n);
      }
      /// we need to convert data array to data object
      let dd = {};
      for(let d of data){
        let [key,val] = d;
        dd[key] = val;
      }
      sig = 'FRNT';  
      this.data = dd;
      var data = this.data;
      var style = {};
      style.buffers = this.buffers;
      style.switches = this.switches;
      style.vmap = this.vmap;
      block = {sig, style, para, data};
      block.row1 = 0
      block.row2 = n;
      this.blocks.push(block);
      this.style = style;
    }
    ///
    /// start processing all lines of the editor
    ///
    while (n < lines.length) {
      ///read a paragraph
      var block  = this.read_para(lines,n,hdgn);
      var para = block.para;
      var hdgn = block.hdgn;
      /// increment block count
      var nread = para.length;
      row1 = n;
      n += nread;
      row2 = n;
      block.row1 = row1;
      block.row2 = row2;
      this.blocks.push(block);
    }
  }
  /////////////////////////////////////////////////////////////////////
  /// 
  /// 
  /////////////////////////////////////////////////////////////////////
  read_para (lines,n,hdgn) {
    let n0 = n;

    var rank = 0;
    var nblank = 0;
    var bull = '';
    var body = [];
    var para = [];
    var type = '';
    var sig = '';
    var title = '';
    var label = '';
    var style = {};
    var nspace = 0;
    var plitems = [];
    var plitem = {}; //holds a pointer to the last plitem
    var v;
    var is_capt = 0;
    var bullet = '';
    var lead = '';
    var fence = '';
    var done = 0;
    var id = '';
    var fname = path.resolve(this.fname);

    for (let i=0; !done && n < lines.length; ++i,++n) {
      var line = lines[n];
      line = line.trimRight();
      if(i==0 && (v=re_hdgs.exec(line))!==null){
        type = 'hdgs';
        bull = v[1];
        title = v[2];
        hdgn = bull.length;
        continue;
      }
      if(i==0 && (v=re_hrle.exec(line))!==null){
        type = 'hrle';
        title = v[0];
        body.push(line);
        n++;  
        break;
      }
      if(i==0 && (v=re_sdot.exec(line))!==null){
        type = 'samp';
        is_capt = 1;
        id = v[1];
        style = this.string_to_style(v[2]);
        continue;
      }
      if(i==0 && (v=re_samp.exec(line))!==null){
        type = 'samp';
        body.push(line);
        continue;  
      }
      if(i==0 && (v=re_cove.exec(line))!==null){
        type = 'cove';
        body.push(v[2]);
        continue;  
      }
      if(i==0 && (v=re_plst.exec(line))!==null){
        type = 'plst';
        lead = '';
        bullet = v[1];
        body.push(v[2]);
        plitem = {n,body,lead,bullet,nblank:0};
        plitems.push(plitem);
        continue;  
      }
      if(i==0 && (v=re_prim1.exec(line))!==null){
        type = 'prim';
        rank = 1;
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0 && (v=re_prim2.exec(line))!==null){
        type = 'prim';
        rank = 2
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0 && (v=re_prim3.exec(line))!==null){
        type = 'prim';
        rank = 3
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0){
        type = 'para';
        nspace = 0;
        body.push(line);
        continue;  
      }
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      if(type=='hdgs'){
        if(line.length==0){
          break;
        }
        if(i==1){
          let v1 = re_label.exec(line);
          if(v1){
            label = v1[1];
          }
        }
        continue;
      }
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      if(type=='plst'){
        /// this is to check for close paragraph fence
        ///a fullline that is not indented   
        if(this.line_is_fullline(line)){
          if((v=re_plst.exec(line))!==null){
            if(plitem.body.length > 0){
              body = [];
              plitem = {n,body,lead,bullet,nblank:0}
              plitems.push(plitem);
            }
            plitem.body.push(v[2]);
            plitem.lead = '';
            plitem.bullet = v[1];
            continue;
          }else{
            if(plitem.body.length==0){
              ///if first line of a body, then we ignore this line,
              ///this line will be process by if-statements down the road
              break;
            }else{
              plitem.body.push(line);
              continue; 
            }
          }
        }
        ///empty line
        if(line.length == 0 && body.length>0) {
          ///a blank line will end the cluster if not started
          ///with cluster fence
          body = [];
          lead = '';
          bullet = '';
          plitem = {n,body,lead,bullet,nblank:1};
          plitems.push(plitem);
          nspace = 0;
          continue;
        }
        ///ignore consecutive empty lines
        if(line.length == 0 && body.length==0){
          ///increment the empty line count of the last 'plitem' that is in 'plitems'
          plitem.nblank++;
          continue;
        }
        ///this is the first line of a cluster
        if(body.length==0){
          const re_leadspaces = /^(\s*)(.*)$/;
          if((v=re_leadspaces.exec(line))!==null){
            lead = v[1];
            line = v[2];///remove the leading spaces
          }else{
            lead = '';
            //'line' stays the same
          }
          ///this is a cluster paragraph
          ///this is the first line of a normal paragraph, 
          /// it might have leading white spaces, if so we extract the leading
          //  white space to assign it to 'lead' variable, and 'line' is adjusted
          //  so that it is without the leading spaces
          if((v=re_plst.exec(line))!==null){
            ///add to the last the 'pitem' which has already been added to 'pitems'
            plitem.body.push(v[2]);
            plitem.bullet = v[1];
            plitem.lead = lead;
            bullet = v[1];
          }else{
            plitem.body.push(line);
          }
          continue;
        }
        ///this is the 2nd and later of a cluster, 
        ///  we need to check if it looks like an item if
        ///  the current 'plitem' is an item and not a text
        if(bullet.length){
          line = line.slice(lead.length);
          if((v=re_plst.exec(line))!==null){
            ///create a new plitem
            body = [];
            body.push(v[2]);
            bullet = v[1];
            plitem = {n,body,lead,bullet,nblank:0};
            plitems.push(plitem);
          }else{
            plitem.body.push(line);
          }
          continue;
        }
        ///this is the 2nd line or later of a cluster and the cluster is not an item
        ///  we just add it to the body
        if(1){
          plitem.body.push(line);
        }
        continue;
      }
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      if(type=='samp'){
        ///if the last line is empty and this 
        ///line does not conform to the samp, we quit
        if(is_capt){
          if(i==1){
            let v = re_label.exec(line);
            if(v){
              label = v[1];
              continue;
            }
          }
          if(line.length==0){
            is_capt = 0;
          }else{
            title = this.join_line(title,line);
          }
        }else{
          if(this.line_is_fullline(line)){
            break;
          }
          body.push(line);
        }
        continue;
      }
      if(type=='cove'){
        if(line.length==0){
          break;
        }
        body.push(line);
        continue;
      }
      if(type=='prim'){
        if(line.length==0){
          break;
        }
        body.push(line);
        continue;
      }
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      if(type=='para'){
        if(line.length==0){
          break;
        }else{
          body.push(line);
        }
        continue;
      }
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      if(line.length==0){
        break;
      }
      body.push(line);
      continue;
    }
      
    /// include all subsequent non-emtpy lines
    /// this helps create a more stable environment where
    /// the row1 and row2 are being counted for each
    /// block

    while(n < lines.length && lines[n].trim().length==0){
      n++;
    }

    /// post-processing of 'body'

    para = lines.slice(n0, n);
    sig = type.toUpperCase();


    /// parse 'body'
    
    if(sig == 'NOTE'){
      style.subseq = n0;
      style.sig = sig;
    }
    else if(sig == 'HDGS'){
      style.sig = sig;
      style.subseq = n0;
    } 
    else if(sig == 'PLST'){
      style.sig = sig;
      style.subseq = n0;
      plitems = plitems.filter(x => x.body.length);
      nblank = plitems.reduce( (acc,cur) => acc+cur.nblank, 0 );
    }
    else if(sig == 'SAMP'){
      style.sig = sig;
      style.subseq = n0;
    } 
    else if(sig == 'COVE'){
      style.sig = sig;
      style.subseq = n0;
    } 
    else if(sig == 'PRIM'){
      style.sig = sig;
      style.subseq = n0;
    } 
    else if(sig == 'PARA'){
      style.sig = sig;
      style.subseq = n0;
    } 
    else if(sig == 'HRLE'){
      style.sig = sig;
      style.subseq = n0;
    }
    else{
      //console.error(`unhandled type: (${type})`);
      //console.error(para);
      //this could happen where 'para' are all empty lines
      sig = '';
      style.sig = sig;
      style.subseq = n0;
    }
    // update style with switches and vmap
    style.buffers = this.buffers;
    style.switches = this.switches;
    style.vmap = this.vmap;
    return {sig, hdgn, rank, id, title, label, fname, style, body, nblank, para, plitems};
  }
  is_han (cc) {
    ///
    /// Given a character code and returns true if it is considered a CJK unified character
    ///

    if (cc >= 0x4E00 && cc <= 0x9FFF) {
      return true;
    } else {
      return false;
    }
  }
  col_letter_to_num(a){
    a = a.toLowerCase();
    var start = 'a'.codePointAt(0);
    var code = a.codePointAt(0);
    var n = code-start;
    if(!Number.isFinite(n)){
      n = NaN;
    }
    else if(n<0){ 
      n = 0;
    } 
    else if(n>25){
      n = 25;
    } 
    return n;
  }
  row_letter_to_num(a){
    var n = parseInt(a);
    if(!Number.isFinite(n)){
      n = 0;
    }
    else if(n < 0) {
      n = 0;
    }
    else if (n>200){
      n = 200;
    }
    return n;
  }
  async read_file_async(fname) {
    ///replace the last extension with .md
    //fname = `${fname.slice(0,fname.length-path.extname(fname).length)}.md`;
    this.fname = fname;
    ///read the lines
    var out = await utils.read_text_file_async(fname);
    var lines = out.split('\n');
    this.read_lines(lines);
  }
  add_ruby_item(base,top,type,mydesc,mymap) {
    /// "節約する","せつやくする","vsuru"
    let item = [base,top,mydesc];
    var o = mymap;
    if(type==='vsuru') {
      o.push(item);
      ///o.push([base.slice(0,base.length-2),top.slice(0,top.length-2),mydesc]);
      var suffixes = [
            'して',
            'し',
            ''
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-2)}${suffix}`,`${top.slice(0,top.length-2)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v1') {
      o.push(item);
      ///o.push([base.slice(0,base.length-1),top.slice(0,top.length-1),mydesc]);
      var suffixes = [
            'ます',
            'た',
            'ました',
            'て',
            'られ',
            'させ',
            'させられ',
            'ろ',
            'ない',
            'ません',
            'なかった',
            'ませんでした',
            'なくて',
            'るな',
            ''
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5m') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5b') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5n') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5s') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5g') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5k') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5r') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5t') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='v5u') {
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
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else if(type==='adji') {
      o.push(item);
      var suffixes = [
          '\u304b\u3063\u305f', //かった
          '\u304f', //く
          '\u3055', //さ
          '\u307f', //み
          'む',
          '\u305d\u3046'  //そう
      ];
      for (let suffix of suffixes) {
        o.push([`${base.slice(0,base.length-1)}${suffix}`,`${top.slice(0,top.length-1)}${suffix}`,mydesc]);
      }
    }
    else {
      o.push(item);
    }
    return o;
  }
  string_to_ds(s){
    let cat;
    let keys = [];
    var v;
    const re_key_quoted = /^'[^']+'(,'[^']+')*$/
    const re_key_braced = /^\{\s+(.*?)\s+\}$/;
    const re_key_coloned = /^(\w.*?):$/;
    if ((v = re_key_quoted.exec(s)) !== null) {
      /// 'one','two'
      /// 'single'
      const re_key_item = /^'([^']+)'(.*)$/;
      while(s.length){
        v = re_key_item.exec(s);
        if(v==null){
          break;
        }
        let key = v[1];
        s = v[2];
        s = s.slice(1);///remove the comma
        keys.push(key);
      }
      cat = 'quoted';
    }
    else if ((v = re_key_braced.exec(s)) !== null) {
      /// { Apple tree } 
      let key = v[1];
      cat = '';
      keys.push(key)
    }
    else if ((v = re_key_coloned.exec(s)) !== null) {
      /// * Power set:
      ///   For every set A there exists a set, denoted by &Pscr;(A) and
      ////  called the power set of A, whose elements are all
      ///   the subsets of A.
      let key = v[1];
      cat = 'coloned';
      keys.push(key);
    }
    else {
      let key = s;
      cat = '';
      keys.push(key);
    }
    return {keys,cat};
  }
  ///
  ///
  ///
  conf_to_float(in_key,def_val=0){
    var block = this.blocks[0];
    def_val = this.assert_float(def_val);
    if (block && block.sig == 'FRNT') {
      let val = block.data[in_key];
      if(val){
        def_val = this.assert_float(val[0],def_val);
      }
    }
    return def_val;
  }
  conf_to_int(in_key,def_val=0){
    var block = this.blocks[0];
    def_val = this.assert_int(def_val);
    if (block && block.sig == 'FRNT') {
      let val = block.data[in_key];
      if(val){
        def_val = this.assert_int(val[0],def_val);
      }
    }
    return def_val;
  }
  conf_to_bool(in_key,def_val=false){
    var block = this.blocks[0];
    def_val = this.assert_int(def_val);
    if (block && block.sig == 'FRNT') {
      let val = block.data[in_key];
      if(val){
        def_val = this.to_bool(val[0]);
      }
    }
    return def_val;
  }
  conf_to_list(in_key,def_val=[]){
    var block = this.blocks[0];
    if (block && block.sig == 'FRNT') {
      let val = block.data[in_key];
      if(val){
        def_val = val;
      }
    }
    return def_val;
  }
  conf_to_string(in_key,def_val=''){
    var block = this.blocks[0];
    def_val = this.assert_string(def_val);
    if (block && block.sig == 'FRNT') {
      let val = block.data[in_key];
      if(val){
        def_val = this.assert_string(val[0],def_val);
      }
    }
    return def_val;
  }
  conf_to_substring(in_key,def_val=''){
    var block = this.blocks[0];
    def_val = this.assert_string(def_val);
    if (block && block.sig == 'FRNT') {
      let val = block.data[in_key];
      if(val){
        def_val = this.assert_string(val[1],def_val);
      }
    }
    return def_val;
  }
  ///
  ///read_master_async();
  ///
  async read_master_async(){
    let line = this.conf_to_string('master');
    let lines = [line];
    /// read from 'body' and build 'items'
    let items = [];
    lines.forEach((line) => {
      let {name,title,fname,id} = this.string_to_mode(line);
      if(fname){
        // [chapter]./myfile.md
        let fullfname = path.resolve(path.dirname(this.fname),fname);
        let subparser = new NitrilePreviewParser();
        let promise = subparser.read_file_async(fullfname);  
        items.push({name,title,fname,id,subparser,fullfname,promise})
      }else{
        items.push({name,title,fname,id})
      }
    });
    ///
    /// wait for all promises
    ///
    var all = items.filter((p) => p.promise).map(p => p.promise);
    await Promise.all(all);
    ///
    /// change source blocks
    ///
    var block0 = null;
    items.forEach((item,i,arr) => {
      let { name,title,fname,subparser} = item;
      if(subparser) {
        subparser.blocks.forEach((block) => {
          // convert a FRNT block to a HDGS block with 'hdgn' set to 0
          if(block.sig=='FRNT'){
            block0 = block;
          }
        });
      }
    });
    /// 
    /// merge with the current front matter block
    ///
    if(this.blocks.length && block0){
      let frnt_block = this.blocks[0];
      frnt_block.data = {...block0.data, ...frnt_block.data};
    }
  }
  ///
  ///read_import_async();
  ///
  async read_import_async(){
    let lines = this.conf_to_list('import');
    /// read from 'body' and build 'items'
    let items = [];
    lines.forEach((line) => {
      let {name,title,fname,id} = this.string_to_mode(line);
      if(fname){
        // [chapter](./myfile.md)
        let fullfname = path.resolve(path.dirname(this.fname),fname);
        let subparser = new NitrilePreviewParser();
        let promise = subparser.read_file_async(fullfname);  
        items.push({name,title,fname,id,subparser,fullfname,promise})
      }else{
        items.push({name,title,fname,id})
      }
    });
    ///
    /// wait for all promises
    ///
    var all = items.filter((p) => p.promise).map(p => p.promise);
    await Promise.all(all);
    ///
    /// change source blocks
    ///
    items.forEach((item,i,arr) => {
      let { name,title,fname,subparser} = item;
      if(subparser) {
        subparser.blocks.forEach((block) => {
          // convert a FRNT block to a HDGS block with 'hdgn' set to 0
          if(block.sig=='FRNT'){
            let title = subparser.conf_to_string('title','NO TITLE');
            let subtitle = subparser.conf_to_substring('title','');
            let v = re_label.exec(subtitle);
            if(v){
              let label = v[1];
              block.label = label;
            }
            block.sig='HDGS';
            block.hdgn = 0;
            block.name = name;
            block.title = title;
            block.fname = fname;
          }else{
            block.name = name;
            block.fname = fname;
          }
          this.blocks.push(block);
        });
      }
      else{
        // create a new synthetic block
        let sig = 'HDGS';
        let hdgn = 0;
        let label = '';
        let rank = 0;
        let id = '';
        let fname = '';
        let body = [];
        let nblank = 0;
        let para = [];
        let plitems = [];
        let style = {};
        style.buffers = this.buffers;
        style.switches = this.switches;
        style.vmap = this.vmap;
        this.blocks.push({sig, hdgn, rank, id, title, label, fname, style, body, nblank, para, plitems});
      }
    });
    return
  }
}

module.exports = { NitrilePreviewParser }
