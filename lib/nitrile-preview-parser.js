'use babel';

const fs = require('fs');
const path = require('path');
const { NitrilePreviewBase } = require('./nitrile-preview-base.js');
const utils = require('./nitrile-preview-utils');

const re_part  = /^@part\s+(.*)$/u;
const re_chap  = /^@chapter\s+(.*)$/u;
const re_hdgs  = /^([#]+)\s+(.*)$/u;
const re_item  = /^(\^)(\s+)(.*)$/u;
const re_capt  = /^\.([A-Za-z]*)\s*(.*)$/;
const re_subc  = /^\((\w*)\)\s*(.*)$/;
const re_hrle  = /^\*{3,}$/u;
const re_prim = /^\[\s+(.*?)\s+\]\s*(.*)$/;
const re_seco = /^\[\[\s+(.*?)\s+\]\]\s*(.*)$/;

const re_frnt   = /^---$/;
const re_kval   = /^(\w[\w\.\-]*)\s*:\s*(.*)$/;

const re_label = /^&label\{(.*)\}$/u;


class NitrilePreviewParser extends NitrilePreviewBase {

  constructor() {
    super();
    this.fname = '';///the filename metadata
    this.title = '';
    this.subtitle = '';
    this.label = '';
    this.mtimeMs = 0;///last modification time of the file
    //this.data = {};
    this.blocks = [];
    // this.num_part = 0;
    // this.num_chap = 0;
    // this.num_sect = 0;
    // this.num_subs = 0;
    // this.num_ssub = 0;
    this.imports = [];
    this.pages = [];
    this.num_page = 0;
    ///parser-specific storage
    this.style = {};
    this.buffers = {};
    this.switches = {};
    this.vmap = [];
    this.style['$'] = this;
    this.style.partnum = 0;
    this.style.chapnum = 0;
    this.style.sectnum = 0;
    this.style.subsnum = 0;
    this.style.ssubnum = 0;
    this.style.pagenum = 0;
    this.style.idnum = '';
    this.style.saveas = '';
    this.style.label = '';
    this.style.note = '';
    this.style.name = '';
    this.style.subcaptions = {};
  }
  /////////////////////////////////////////////////////////////////////
  /// read_line
  /////////////////////////////////////////////////////////////////////
  read_lines(lines) {
    var n = 0;
    var row1 = 0;
    var row2 = 0;
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
          line = line.trimEnd();
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
        const re_switch = /^%(\w+)\s*(\{.*\})$/;
        const re_import = /^%\^import\s+(.*)$/;
        const re_copy   = /^%=(\w+)\s*(.*)$/;
        const re_vmap   = /^%!(\S+?)(?:\u{30fb}|\/)(\S+)/u;
        var save_buf = null;
        var v;
        for (; n < lines.length; n++) {
          var s = lines[n].trimEnd();
          if(s.length==0){
            break;
          }
          if(save_buf){
            if(s.startsWith('%')){
              save_buf = null;
            }else{
              save_buf.push(s);
            }
          }else if((v=re_copy.exec(s))!==null){
            //%?a   
            let name = v[1];
            let g = this.string_to_style(v[2],this.style);
            save_buf = [];
            this.buffers[name] = {g,ss:save_buf};
          }else if((v=re_switch.exec(s))!==null){
            //%diagram{frame,linesize:1,fillcolor:red}
            let sig0 = v[1];
            let g = this.switches[sig0]||{};
            g = this.string_to_style(v[2],g);//read_lines()
            this.switches[sig0] = g;
          }else if((v=re_import.exec(s))!==null){
            //%^import [chapter](./ch1.md)
            let line = v[1];
            let p = {};
            p.line = line;
            this.imports.push(p);
          }else if((v=re_vmap.exec(s))!==null){
            let rb = v[1];
            let rt = v[2];
            let raw = s;
            this.vmap.push({rb,rt,raw});
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
      data = dd;
      let title = data['title'];
      if(!title){
        title = '';
      }else{
        title = this.join_para(title);
      }
      let subtitle = data['subtitle'];
      if(!subtitle){
        subtitle = '';
      }else{
        subtitle = this.join_para(subtitle);
      }
      let label = data['label'];
      if(!label){
        label = '';
      }else{
        label = this.join_para(label);
      }
      this.style.name = this.join_para(data['name']);
      this.style.chapnum = parseInt(this.join_para(data['chapnum']))||0;
      ///create a FRNT block
      let style = {...this.style};
      block = {sig, style, title, label, para, data, parser:this};
      block.row1 = 0
      block.row2 = n;
      block.style.row = 0;
      this.blocks.push(block);
      this.title = title;
      this.subtitle = subtitle;
      this.label = label;
    }else{
      ///THE first block is always a FRNT block, even when there are no lines
      var sig = 'FRNT';
      var data = [];
      var para = [];
      let title = '';
      let subtitle = '';
      let label = '';
      ///create a FRNT block
      let style = {...this.style};
      block = {sig, style, title, label, para, data, parser:this};
      block.row1 = 0
      block.row2 = n;
      block.style.row = 0;
      this.blocks.push(block);
      this.title = title;
      this.subtitle = subtitle;
      this.label = label;
    }
    ///
    /// start processing all lines of the editor
    ///
    while (n < lines.length) {
      ///read a paragraph
      var block  = this.read_para(lines,n);
      var para = block.para;
      var sig  = block.sig;
      var nread = para.length;
      row1 = n;
      n += nread;
      row2 = n;
      block.parser = this;
      block.row1 = row1;
      block.row2 = row2;
      block.style.row = row1;
      this.blocks.push(block);
    }
  }
  /////////////////////////////////////////////////////////////////////
  /// 
  /// 
  /////////////////////////////////////////////////////////////////////
  read_para (lines,n) {
    let n0 = n;

    var hdgn = 0;
    var rank = 0;
    var nblank = 0;
    var bull = '';
    var isbody = 0;
    var bodyrow = n;
    var body = [];
    var para = [];
    var type = '';
    var sig = '';
    var title = '';
    var label = '';
    var style = {...this.style};
    var plitems = [];
    var plitem = {}; //holds a pointer to the last plitem
    var v;
    var caption = '';
    var issubcaption = 0;
    var subcaptions = {};
    var bullet = '';
    var lead = '';
    var mass = '';
    var done = 0;
    var id = '';
    var level = '';
    var fname = path.resolve(this.fname);

    for (let i=0; !done && n < lines.length; ++i,++n) {
      var line = lines[n];
      line = line.trimEnd();
      if(i==0 && (v=re_hrle.exec(line))!==null){
        type = 'hrle';
        title = v[0];
        body.push(line);
        continue;
      }
      if(i==0 && (v=re_part.exec(line))!==null){
        type = 'part';
        caption = v[1];
        this.style.partnum++;
        style = {...this.style};
        continue;
      }
      if(i==0 && (v=re_chap.exec(line))!==null){
        type = 'chap';
        caption = v[1];
        this.style.chapnum++;
        this.style.sectnum = 0;
        this.style.subsnum = 0;
        this.style.ssubnum = 0;
        style = {...this.style};
        continue;
      }
      if(i==0 && (v=re_hdgs.exec(line))!==null){
        type = 'hdgs';
        bull = v[1];
        caption = v[2];
        hdgn = bull.length;
        if(hdgn==1){
          this.style.sectnum += 1;
          this.style.subsnum = 0;
          this.style.ssubnum = 0;
          level = `${this.style.sectnum}`;
        }else if(hdgn==2){
          this.style.subsnum += 1;
          this.style.ssubnum = 0;
          level = `${this.style.sectnum}.${this.style.subsnum}`;
        }else{
          this.style.ssubnum + 1;
          level = `${this.style.sectnum}.${this.style.subsnum}.${this.style.ssubnum}`;
        }
        style = {...this.style};
        continue;
      }
      if(i==0 && (v=re_capt.exec(line))!==null){
        id = v[1];
        if(id){
          type = 'capt';
        }else{
          type = 'para';
        }
        style = this.string_to_style(v[2],style);
        continue;
      }
      if(i==0 && (v=re_prim.exec(line))!==null){
        type = 'prim';
        rank = 1;
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0 && (v=re_seco.exec(line))!==null){
        type = 'seco';
        rank = 2
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0){
        type = 'para';
        body.push(line);
        continue;  
      }
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      if(type=='hrle'){
        if(line.length==0){
          break;
        }
      }
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      if(type=='hdgs'){
        if(line.length==0){
          break;
        }
      }
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      ///////////////////////////////////////////
      if(type=='plst'){///currently not used
        /// this is to check for close paragraph fence
        ///a fullline that is not indented   
        if(this.line_is_fullline(line)){
          if((v=re_item.exec(line))!==null){
            if(plitem.body.length > 0){
              body = [];
              plitem = {n,body,lead,bullet,nblank:0}
              plitems.push(plitem);
            }
            plitem.body.push(this.space(v[1]+v[2])+v[3]);
            plitem.lead = '';
            plitem.bullet = v[1];
            if(plitem.body.length==1){
              plitem.n = n;//renewal the starting line number for this plitem
            }
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
        if(line.length == 0 && plitem.body.length>0) {
          ///a blank line will end the cluster if not started
          ///with cluster fence
          body = [];
          lead = '';
          bullet = '';
          plitem = {n,body,lead,bullet,nblank:1};
          plitems.push(plitem);
          continue;
        }
        ///ignore consecutive empty lines bofore a cluster
        if(line.length == 0 && plitem.body.length==0){
          ///increment the empty line count of the last 'plitem' that is in 'plitems'
          plitem.nblank++;
          continue;
        }
        ///this is the first line of a cluster
        if(plitem.body.length==0){
          plitem.n = n;///renewer the starting number in the source for this cluster
          const re_leadspaces = /^(\s*)(.*)$/;
          if((v=re_leadspaces.exec(line))!==null){
            lead = v[1];
            mass = v[2];///remove the leading spaces
          }else{
            lead = '';
            mass = line;
            //'line' stays the same
          }
          ///this is a cluster paragraph
          ///this is the first line of a normal paragraph, 
          /// it might have leading white spaces, if so we extract the leading
          //  white space to assign it to 'lead' variable, and 'line' is adjusted
          //  so that it is without the leading spaces
          if((v=re_item.exec(mass))!==null){
            ///add to the last the 'pitem' which has already been added to 'pitems'
            plitem.body.push(this.space(v[1]+v[2])+v[3]);
            plitem.bullet = v[1];
            plitem.lead = lead;
            bullet = v[1];
          }else{
            plitem.body.push(line);//it has to use 'line' because it needs the leading space--this is important when it comes to extracting the bundle
            plitem.bullet = '';
            plitem.lead = lead;//it needs the 'lead' here so that it can know the lead for each section of the 'more' later
            bullet = '';
          }
          continue;
        }
        ///this is the 2nd line or later for a confirmed item,
        ///  we need to see if any line resembles an item if
        ///  the current 'plitem' is an item and not a text
        if(bullet.length){
          line = line.slice(lead.length);//the line is shorten by the 'lead'
          if((v=re_item.exec(line))!==null){
            ///create a new plitem
            body = [];
            body.push(this.space(v[1]+v[2])+v[3]);
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
      if(type=='capt'){
        let v;
        if(i==1 && (v=re_label.exec(line))!==null){
          label = v[1];
          continue;
        }
        if(line.length==0){
          break;
        }else if(isbody){
          body.push(line);
          continue;
        }else if(line=='\\\\'){
          isbody = 1;
          bodyrow = n+1;
          continue;
        }else if(line=='---'){
          issubcaption ^= 1;
          continue;
        }else{
          if(isbody){
            body.push(line);
          }else if(issubcaption){
            let v = re_subc.exec(line);
            if(v){
              let id = v[1];
              let text = v[2];
              subcaptions[id] = text;
            }
          }else{
            caption = this.join_line(caption,line);
          }
          continue;
        }
      }
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      if(type=='hdgs'||type=='part'||type=='chap'){
        let v;
        if(i==1 && (v=re_label.exec(line))!==null){
          label = v[1];
          continue;
        }
      }
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
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
      if(type=='seco'){
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
      style.lineno = n0;
      style.sig = sig;
    }
    else if(sig == 'HDGS'){
      style.sig = sig;
      style.lineno = n0;
      title = caption;
    } 
    else if(sig == 'CAPT'){
      style.sig = sig;
      style.lineno = n0;
      title = caption;
    } 
    else if(sig == 'PRIM'){
      style.sig = sig;
      style.lineno = n0;
    } 
    else if(sig == 'SECO'){
      style.sig = sig;
      style.lineno = n0;
    } 
    else if(sig == 'PARA'){
      style.sig = sig;
      style.lineno = n0;
    } 
    else if(sig == 'HRLE'){
      style.sig = sig;
      style.lineno = n0;
    }
    else if(sig == 'PART'){
      style.sig = sig;
      style.lineno = n0;
      title = caption;
    }
    else if(sig == 'CHAP'){
      style.sig = sig;
      style.lineno = n0;
      title = caption;
    }
    else{
      //console.error(`unhandled type: (${type})`);
      //console.error(para);
      //this could happen where 'para' are all empty lines
      sig = '';
      style.sig = sig;
      style.lineno = n0;
    }
    // update style with switches and vmap
    style.subcaptions = subcaptions;
    style.label = label;
    let parser = this;
    return {sig, hdgn, rank, id, title, label, level, fname, style, bodyrow, body, nblank, para, plitems, parser};
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
    console.log(' *** '+fname+' ['+lines.length+']');
    this.read_lines(lines);
  }
  get members() {
    var o = [];
    if(this.fname){
      let fname = this.fname;
      let mtimeMs = this.mtimeMs;
      o.push({fname,mtimeMs});
    }
    for(let p of this.imports){
      if(p.subparser){
        if(p.subparser.fname){
          let fname = p.subparser.fname;
          let mtimeMs = p.subparser.mtimeMs;
          o.push({fname,mtimeMs});   
        }
      }
    }
    return o;
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
  ///read_import_async();
  ///
  async read_import_async(){
    /// read from 'body' and build 'items'
    const re_file = /^\[(.*?)\]\((.*)\)$/;
    const re_title = /^\[(.*?)\]\"(.*)\"$/;
    let v;
    this.imports.forEach((p) => {
      var line = p.line;
      if((v=re_file.exec(line))!==null){
        // [chapter](./myfile.md)
        let name = v[1];//'chapter'
        let note = v[2];
        let fname = path.join(path.dirname(this.fname),v[2]);//already an absolute path
        let subparser = new NitrilePreviewParser();
        let promise = subparser.read_file_async(fname);  
        p.name = name;
        p.title = '';
        p.fname = fname;
        p.note = note;
        p.subparser = subparser;
        p.promise = promise;
        return;
      }
      if((v=re_title.exec(line))!==null){
        // [part]"Introduction"
        let name = v[1];//'part'
        let title = v[2];//'Introduction'
        p.name = name;
        p.title = title;
        p.fname = '';
        p.note = '';
        return;
      }
    });
    ///
    /// wait for all promises
    ///
    var all = this.imports.filter((p) => p.promise).map(p => p.promise);
    await Promise.all(all);
    ///
    /// change source blocks
    ///
    var partnum = 0;
    var chapnum = 0;
    this.imports.forEach((item,i,arr) => {
      let { name,title,note,fname,subparser} = item;
      let hdgn = 0;
      let rank = 0;
      let id = '';
      let label = '';
      let body = [];
      let nblank = 0;
      let para = [];
      let plitems = [];
      let level = '';
      let data = [];
      if(name=='part'){
        partnum++;
        let style = {...this.style};
        let sig = 'PART';
        let parser = null;
        let block = {sig, hdgn, rank, id, title, label, level, name, fname, style, body, nblank, para, plitems, data, parser};  
        block.style.name = name;
        block.style.partnum = partnum;
        block.style.chapnum = 0;
        this.blocks.push(block);
      }else if(name=='chapter'){
        chapnum++;
        if(subparser) {
          for( let block of subparser.blocks ) {
            block.style.name = name;
            block.style.note = note;
            block.style.partnum = partnum;
            block.style.chapnum = chapnum;
            this.blocks.push(block);
          }
        }
      }
    });
  }
  space(s){
    ///return a string that is the same length as 's' but filled all with spaces
    return ' '.repeat(s.length);
  }
}

module.exports = { NitrilePreviewParser }
