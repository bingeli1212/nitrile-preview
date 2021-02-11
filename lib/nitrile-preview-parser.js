'use babel';

const fs = require('fs');
const path = require('path');
const { NitrilePreviewBase } = require('./nitrile-preview-base.js');
const utils = require('./nitrile-preview-utils');

const re_text = /^\w/;
const re_note = /^(%)\s+(.*)$/;
const re_hdgs = /^(#+)\s+(.*)$/u;
const re_plst = /^(-|\+|\*|<>|\d+[\.]|[A-Za-z][\.])\s+(.*)$/u;
const re_samp = /^\s{4,}(.*)$/u;
const re_floa = /^@(\w+)\s*(.*)$/u;
const re_hrle = /^\*{3}$/u;
const re_cluster_line = /^(\s*)(~{3,})(.*)$/;
const re_plaintextline = /^(\s*)(.*)$/;
const re_prim1 = /^\[\s+(.*?)\s+\]\s*(.*)$/;
const re_prim2 = /^\[\[\s+(.*?)\s+\]\]\s*(.*)$/;
const re_prim3 = /^\[\[\[\s+(.*?)\s+\]\]\]\s*(.*)$/;
const re_frnt = /^---$/;
const re_kval = /^(\w[\w\.\-]*)\s*:\s*(.*)$/;
const re_switch1 = /^%(\w+)$/;
const re_switch2 = /^%(\w+):(\w+)$/;

class NitrilePreviewParser extends NitrilePreviewBase {

  constructor() {
    super();
    this.fname = '';///the filename metadata
    this.switches = {};
    this.vmap = [];
  }
  read_lines(lines) {
    this.blocks = [];
    var nlines = 0;
    var row1 = 0;
    var row2 = 0;
    var hdgn = 0;
    var block = {};

    //
    //NOTE: read front matter
    //
    if(lines.length){
      var sig = '';
      var data = [];
      var para = [];
      var n0 = 0;
      var n = 0;
      var v;
      var style = {};
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
              let val = v[2].trim();
              data.push([key,val]);
            }
          }else{
            let val1 = line.trim();
            if(data.length){
              let [key,val] = data.pop();
              val += '\n';
              val += val1; 
              data.push([key,val]);
            }
          }
        }
        para = lines.slice(n0, n);
        style.subseq = n0;
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
        para = lines.slice(n0, n);
      } else if(this.line_is_fullline(lines[0].trim())){
        sig = 'FRNT';
        n++;
        let key = 'title';
        let val = lines[0].trim();
        if(val.startsWith('# ')) val = val.slice(2);///remove the '# ' if it starts with it
        data.push([key,val]);
        para = lines.slice(n0,n);
        style.subseq = n0;
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
        para = lines.slice(n0, n);
      }else{
        ///if there isn't any FRNT block then we need to skip any leading empty lines
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
      }
      /// up to this point if 'sig' has been set, then return
      if(sig){
        block = {sig, style, para, data};
        var para = block.para;
        var nread = para.length;
        row1 = nlines;
        nlines += nread;
        row2 = nlines;
        block.row1 = row1;
        block.row2 = row2;
        block.style.row1 = row1;
        block.style.row2 = row2;
        this.blocks.push(block);
      }
    }

    //
    //NOTE: read switches
    //
    for (; nlines < lines.length; nlines++) {
      var s = lines[nlines].trimRight();
      if((v=re_switch1.exec(s))!==null){
        let key = v[1];
        this.switches[key] = 1;
      }else if((v=re_switch2.exec(s))!==null){
        let key = v[1];
        let val = v[2];
        this.switches[key]= val;
      }else{
        break;
      }
    }

    // skip over blank lines
    ///if there isn't any FRNT block then we need to skip any leading empty lines
    while(nlines < lines.length && lines[nlines].trim().length==0){
      nlines++;
    }
    
    // start processing all lines of the editor
    while (nlines < lines.length) {
      ///read a paragraph
      var block  = this.read_para(lines,nlines,hdgn);
      var para = block.para;
      var hdgn = block.hdgn;
      /// increment block count
      var nread = para.length;
      row1 = nlines;
      nlines += nread;
      row2 = nlines;
      block.row1 = row1;
      block.row2 = row2;
      block.style.row1 = row1;
      block.style.row2 = row2;
      block.style.vmap = this.vmap;
      ///for SAMP block only
      if(block.sig=='SAMP'){
        block.style = {...this.switches,...block.style};  
      }
      ///only to merge two consecurive SAMP blocks with a empty line in the middle
      if(this.blocks.length && this.blocks[this.blocks.length-1].sig=='SAMP' && block.sig=='SAMP'){
        let prev_block = this.blocks[this.blocks.length-1];
        prev_block.para = prev_block.para.concat(block.para);
        prev_block.row2 = block.row2;
        prev_block.style.row2 = block.style.row2;
        prev_block.body.push('');
        prev_block.body = prev_block.body.concat(block.body);
      }else if(block.sig){
        this.blocks.push(block);
      }
    }
  }
  read_para (lines,n,hdgn) {
    let n0 = n;

    var bull = '';
    var body = [];
    var para = [];
    var type = '';
    var sig = '';
    var title = '';
    var style = {};
    var nspace = 0;
    var plitems = [];
    var plitem = {}; //holds a pointer to the last plitem
    var v;
    var is_cluster = 0;
    var lead = '';
    var fence = '';
    var done = 0;
    var is_empty = 0;
    var fname = path.resolve(this.fname);
    //var re_sub = /^h(\d*)$/i;

    /// read body     
    ///
    // case 'HDGS': this.do_HDGS(block); break;
    // case 'SAMP': this.do_SAMP(block); break;
    // case 'PRIM': this.do_PRIM(block); break;
    // case 'PARA': this.do_PARA(block); break;
    // case 'PLST': this.do_PLST(block); break;
    // case 'HRLE': this.do_HRLE(block); break;
    // case 'NOTE': this.do_NOTE(block); break;
    // case 'FLOA': this.do_FLOA(block); break;

    for (let i=0; !done && n < lines.length; ++i,++n) {
      var line = lines[n];
      line = line.trimRight();
      if(i==0 && (v=re_note.exec(line))!==null){
        type = 'note';
        bull = v[1];
        var {id:title,style} = this.string_to_id_and_style(v[2]);
        continue;
      }
      if(i==0 && (v=re_hdgs.exec(line))!==null){
        type = 'hdgs';
        bull = v[1];
        var {style,s:title} = this.string_to_style(v[2])
        hdgn = bull.length;
        done = 1;
        continue;
      }
      if(i==0 && (v=re_floa.exec(line))!==null){
        type = 'floa';
        title = v[1];
        var {style} = this.string_to_style(v[2]);
        continue;
      }
      if(i==0 && (v=re_hrle.exec(line))!==null){
        type = 'hrle';
        title = v[0];
        body.push(line);
        n++;  
        break;
      }
      if(i==0 && (v=re_samp.exec(line))!==null){
        type = 'samp';
        body.push(line);
        continue;  
      }
      if(i==0 && (v=re_plst.exec(line))!==null){
        type = 'plst';
        let bullet = v[1];
        body.push(v[2]);
        plitems.push({n,body,bullet});
        continue;  
      }
      if(i==0 && (v=re_prim1.exec(line))!==null){
        type = 'prim';
        hdgn = 1;
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0 && (v=re_prim2.exec(line))!==null){
        type = 'prim';
        hdgn = 2
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0 && (v=re_prim3.exec(line))!==null){
        type = 'prim';
        hdgn = 3
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0 && (v=re_cluster_line.exec(line))!==null){
        is_cluster = 1;
        lead = v[1];
        fence = v[2];
        type = 'para';
        nspace = v[1].length;
        body.push(line);
        continue;
      }
      if(i==0 && (v=re_plaintextline.exec(line))!==null){
        type = 'para';
        nspace = v[1].length;
        body.push(line);
        continue;
      }
      if(i==0){
        type = 'para';
        nspace = 0;
        body.push(line);
        continue;  
      }
      if(type=='plst'){
        /// this is to check for close paragraph fence
        if(is_cluster){
          if((v=re_cluster_line.exec(line))!==null && v[1]===lead && v[2]===fence){
            ///ending the current cluster and start a new one
            body.push(fence);
            is_cluster = 0;
            body = [];
            plitem = {n,body};
            plitems.push(plitem);
            continue;
          }else{
            line = line.slice(nspace);
            body.push(line);
            continue;
          }
        }     
        ///a fullline that is not indented   
        if(this.line_is_fullline(line)){
          if((v=re_plst.exec(line))!==null){
            body = [];
            body.push(v[2]);
            let bullet = v[1];
            plitem = {n,body,bullet};
            plitems.push(plitem);
            lead = '';
            nspace = 0;
            continue;
          }else{
            if(body.length==0){
              ///if first line of a body, then we ignore this line,
              ///this line will be process by if-statements down the road
              break;
            }else{
              body.push(line);
              continue; 
            }
          }
        }
        ///empty line
        if(!is_cluster && line.length == 0 && body.length>0) {
          ///a blank line will end the cluster if not started
          ///with cluster fence
          body = [];
          plitem = {n,body};
          plitems.push(plitem);
          lead = '';
          nspace = 0;
          continue;
        }
        ///ignore consecutive empty lines
        if(line.length == 0 && body.length==0){
          continue;
        }
        ///first line of a body 
        if(body.length==0){
          const re_leadspaces = /^(\s*)(.*)$/;
          v = re_leadspaces.exec(line);
          lead = '';
          nspace = 0;
          if(v) {
            lead = v[1];
            line = v[2];
            nspace = lead.length;
          }
          ///this is a cluster paragraph
          if((v=re_cluster_line.exec(line))!==null){
            is_cluster = 1;
            fence = v[2];
            body.push(line);
          }else{
            ///this is the first line of a normal paragraph, 
            /// it might have leading white spaces
            if((v=re_plst.exec(line))!==null){
              body.push(v[2]);
              plitem.bullet = v[1];
              plitem.lead = lead;
            }else{
              body.push(line);
            }
          }
          continue;
        }
        ///2nd and additional lines of a body
        ///trim each line by the nspace of the first line
        line = line.slice(nspace);
        body.push(line);
        continue;
      }
      if(type=='samp'){
        if(line.length==0){
          break;
        }
        ///if the last line is empty and this 
        ///line does not conform to the samp, we quit
        if(!re_samp.test(line)){
          type = 'para';
        }
        /// normal line
        body.push(line);
        continue;
        
      }
      if(type=='prim'){
        if(body.length == is_empty){
          if(line.length==0){
            is_empty++;
            body.push('');
            continue;
          }else if(re_text.test(line)){
            body.push(line);
            continue;
          }else{
            break;
          }
        }
        if(line.length==0){
          break;
        }
        body.push(line);
        continue;
      }
      if(type=='para' && is_cluster){
        if((v=re_cluster_line.exec(line))!==null && v[1]===lead && v[2]===fence){
          body.push(line);
          is_cluster = 0;
          done = 1;
          continue;
        }
        body.push(line);
        continue;
      }
      if(type=='note' && line.length > 0){
        if(this.line_is_fullline(line)){
          line = line.substr(1);// remove the first char
        }
        body.push(line);
        continue;
      }
      if(type=='floa'){
        if(line=='@'){
          done = 1;
        }else{
          body.push(line);
        }
        continue;
      }
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
    }
    else if(sig == 'SAMP'){
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
      style.nspace = nspace;
    } 
    else if(sig == 'HRLE'){
      style.sig = sig;
      style.subseq = n0;
    }
    else if(sig == 'FLOA'){
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
    return {sig, hdgn, title, fname, style, body, nspace, para, plitems};
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
  conf(in_key,def_val='',type='',suffix=''){
    var block = this.blocks[0];
    if(type=='float'){
      let ret_val = this.assert_float(def_val,0);
      if (block && block.sig == 'FRNT') {
        let data = block.data;
        for (let t of data) {
          let [key, val] = t;
          if (key.localeCompare(in_key)==0) {
            ///check 'type'
            ret_val = this.assert_float(val,ret_val);
          }  
        }
      }
      if(suffix){
        ret_val = `${ret_val}${suffix}`;
      }
      return ret_val;
    }
    if(type=='int'){
      let ret_val = this.assert_int(def_val,0);
      if (block && block.sig == 'FRNT') {
        let data = block.data;
        for (let t of data) {
          let [key, val] = t;
          if (key.localeCompare(in_key)==0) {
            ///check 'type'
            ret_val = this.assert_int(val,ret_val);
          }  
        }
      }
      if(suffix){
        ret_val = `${ret_val}${suffix}`;
      }
      return ret_val;
    }
    if(type=='list'){
      let ret_val = [];
      if(Array.isArray(def_val)){
        ret_val = def_val;
      }
      if (block && block.sig == 'FRNT') {
        let data = block.data;
        for (let t of data) {
          let [key, val] = t;
          if (key.localeCompare(in_key)==0) {
            ///check 'type'
            val = val.split('\n')
            val = val.map(x => x.trim());
            val = val.filter(x => x.length);
            if(val.length > 0){
              ret_val = val;
            }
          }  
        }
      }
      if(suffix){
        ret_val = ret_val.map(x => `${x}${suffix}`);
      }
      return ret_val;
    }
    if(1){
      let ret_val = this.assert_string(def_val,'');
      if (block && block.sig == 'FRNT') {
        let data = block.data;
        for (let t of data) {
          let [key, val] = t;
          if (key.localeCompare(in_key)==0) {
            ///check 'type'
            ret_val = this.assert_string(val,ret_val);
          }  
        }
      }
      if(suffix){
        ret_val = `${ret_val}${suffix}`;
      }
      return ret_val;
    }
  }
  async read_import_async(){
    let lines = this.conf('import','','list');
    /// read from 'body' and build 'items'
    let items = [];
    lines.forEach((line) => {
      let {name,title,fname,id} = this.string_to_mode(line);
      if(fname){
        // [chapter](./myfile.md)
        let fullfname = path.resolve(path.dirname(this.fname),fname);
        let subparser = new NitrilePreviewParser();
        let promise = subparser.read_file_async(fname);  
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
            let title = subparser.conf('title','NO TITLE');
            let label = subparser.conf('label','');
            block.sig='HDGS';
            block.hdgn = 0;
            block.name = name;
            block.title = title;
            block.fname = fname;
            block.style.label = label;
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
        let style = {};
        this.blocks.push({sig,hdgn,name,title,style});
      }
    });
    return
  }
}

module.exports = { NitrilePreviewParser }
