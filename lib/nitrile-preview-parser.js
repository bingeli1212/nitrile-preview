'use babel';

const fs = require('fs');
const path = require('path');
const { NitrilePreviewBase } = require('./nitrile-preview-base.js');
const { NitrilePreviewExpr } = require('./nitrile-preview-expr');
const utils = require('./nitrile-preview-utils');

const re_is_part = /^@part\s+(.*)$/u;
const re_is_chap = /^@chapter\s+(.*)$/u;
const re_is_page = /^@page\b/u;
const re_is_hdgs = /^([#]+)\s+(.*)$/u;
const re_is_item = /^(\^)(\s+)(.*)$/u;
const re_is_capt = /^\.([A-Za-z]+)(\{.*\}|)$/;
const re_is_hrle = /^\*{3,}$/u;
const re_is_prim = /^\[\s+(.*?)\s+\]\s*(.*)$/;
const re_is_seco = /^\[\[\s+(.*?)\s+\]\]\s*(.*)$/;
const re_is_label = /^&label\{(.*)\}$/u;

class NitrilePreviewParser extends NitrilePreviewBase {

  constructor() {
    super();
    this.fname = '';///the filename metadata
    this.title = '';
    this.subtitle = '';
    this.label = '';
    this.peek = '';
    this.tex = '';
    this.program = '';
    this.root = '';
    this.pagination = '';
    this.name = '';
    this.chapnum = 0;
    this.titlepage = 0;
    this.tocpage = 0;
    this.mtimeMs = 0;///last modification time of the file
    this.sdot = String.fromCodePoint(0x30fb);
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
    this.dict = [];
    this.vmap = [];
    this.data = {};
    this.memo = {};
    ///label map
    this.label_map = new Map();
    this.style.__buffers = this.buffers;
    this.style.__switches = this.switches;
    this.style.__dict = this.dict;
    this.style.__vmap = this.vmap;
    this.style.__data = this.data;
    this.style.__memo = this.memo;
    this.style.__partnum = 0;
    this.style.__chapnum = 0;
    this.style.__sectnum = 0;
    this.style.__subsnum = 0;
    this.style.__ssubnum = 0;
    this.style.__pagenum = 0;
    this.style.__fignum = 0;
    this.style.__lstnum = 0;
    this.style.__tabnum = 0;
    this.style.__eqnnum = 0;
    this.style.__note = '';
    this.style.__subcaptions = [];
  }
  /////////////////////////////////////////////////////////////////////
  /// read_line
  /////////////////////////////////////////////////////////////////////
  read_lines(lines) {
    var n = 0;
    var row1 = 0;
    var row2 = 0;
    var block = {};
    var dd = [];
    ///
    /// front matter
    ///
    if(lines.length){
      var sig = '';
      var para = [];
      if(this.line_is_fullline(lines[0])){
        ///
        /// Read switches and vmap entries
        ///
        const re_is_buffer = /^```(\w*)(.*)$/;
        const re_is_switch = /^~(\w+)\s*(\{.*\})$/u;
        const re_is_import = /^@import\s+(.*)$/u;
        //const re_is_dict   = /^!(\S+?)(?:\u{30fb}|\/)(\S+)/u;
        const re_is_vmap_1  = /^(\p{L}+)\u30fb(\p{L}+)/u;
        const re_is_vmap_2  = /^(\p{L}+)\/(\p{L}+)/u;
        const re_is_var   = /^\\var\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*(.*)$/u;
        const re_is_arr   = /^\\arr\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*(.*)$/u;
        const re_is_frnt_entry  = /^([a-zA-Z][a-zA-Z0-9\.\-]*)\s*:\s*(.*)$/;
        const re_is_tex_entry  = /^%\s+!TEX\s+([a-zA-Z][a-zA-Z0-9\.\-]*)\s*=\s*(.*)$/;
        let savebuf = null;
        let v;
        for (; n < lines.length; n++) {
          var s = lines[n].trimEnd();
          if(s.length==0){
            break;
          }
          if(savebuf){
            if(re_is_buffer.test(s)){
              savebuf = null;
            }else{
              savebuf.push(s);
            }
          }else if((v=re_is_buffer.exec(s))!==null){
            //```img{viewport:12 7,id:a1}
            savebuf = [];//renew the savebuf
            let key = v[1];
            let g = this.string_to_style(v[2],{});
            let id = g.id||'';
            this.buffers[id] = {g,key,ss:savebuf};
          }else if((v=re_is_switch.exec(s))!==null){
            //~diagram{frame,linesize:1,fillcolor:red}
            savebuf = null;
            let sig0 = v[1];
            let g = this.switches[sig0]||{};
            g = this.string_to_style(v[2],g);//read_lines()
            this.switches[sig0] = g;
          }else if((v=re_is_import.exec(s))!==null){
            //@import [chapter](./ch1.md)
            savebuf = null;
            let line = v[1];
            let p = {};
            p.line = line;
            this.imports.push(p);
          }else if((v=re_is_var.exec(s))!==null){
            let expr = new NitrilePreviewExpr(null);
            let key = v[1];
            let number = expr.read_var(v[2],this.style);
            this.style[key] = number;
          }else if((v=re_is_arr.exec(s))!==null){
            let expr = new NitrilePreviewExpr(null);
            let key = v[1];
            let numbers = expr.read_arr(v[2],this.style);
            this.style[key] = numbers;
          }else if((v=re_is_frnt_entry.exec(s))!==null){
            let key = v[1];
            let txt = v[2].trim();
            dd.push([key,txt]);
          }else if((v=re_is_tex_entry.exec(s))!==null){
            let key = v[1];
            let txt = v[2].trim();
            dd.push([key,txt]);
          }else{
            // console.log('re_dict',v[0],v[1],v[2])
            //日本・にほん; Japan
            savebuf = null;
            let dt = s;    
            let dd = '';   
            let rb = '';
            let rt = '';
            let i = s.indexOf(';');
            if(i > 0){
              dt = s.slice(0,i).trim();
              dd = s.slice(i+1).trim();
            }
            if((v=re_is_vmap_1.exec(dt))!==null){
              rb = v[1];          
              rt = v[2];          
              if(rb&&rt){
                this.vmap.push({rb,rt});
              }
            }
            else if((v=re_is_vmap_2.exec(dt))!==null){
              rb = v[1];          
              rt = v[2];          
              if(rb&&rt){
                this.vmap.push({rb,rt});
              }
            }
            this.dict.push({dt,dd,rb,rt});
          }
        }
        ///skip empty lines
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
        para = lines.slice(0, n);
      } 
      /// skip over empty lines
      while(n < lines.length && lines[n].trim().length==0){
        n++;
      }
      para = lines.slice(0, n);
      /// we need to convert dd array to this.data object
      for(let d of dd){
        let [key,val] = d;
        this.data[key] = val;
      }
      var sig = 'FRNT';  
      this.pagination = parseInt(this.data['pagination'])||'';
      this.name = this.data['name']||'';
      this.chapnum = parseInt(this.data['chapnum'])||0;
      this.titlepage = parseInt(this.data['titlepage'])||0;
      this.tocpage = parseInt(this.data['tocpage'])||0;
      this.title = this.data['title']||'';
      this.subtitle = this.data['subtitle']||'';
      this.label = this.data['label']||'';
      this.peek = this.data['peek']||'';
      this.tex = this.data['tex']||'';
      this.program = this.data['program']||'';
      this.root = this.data['root']||'';
      this.style.__chapnum = this.chapnum;
      let style = {...this.style};
      let buffers = this.buffers;
      let switches = this.switches;
      let dict = this.dict;
      let vmap = this.vmap;
      block = {sig, para, style, buffers, switches, dict, vmap, title:this.title, label:this.label, parser:this};
      block.row1 = 0
      block.row2 = n;
      block.style.row = 0;
      this.blocks.push(block);
      this.label_map.set(this.label,block);
    }else{
      var sig = 'FRNT';
      var para = [];
      let style = {...this.style};
      let buffers = this.buffers;
      let switches = this.switches;
      let dict = this.dict;
      let vmap = this.vmap;
      block = {sig, para, style, buffers, switches, dict, vmap, title:this.title, label:this.label, parser:this};
      block.row1 = 0
      block.row2 = n;
      block.style.row = 0;
      this.blocks.push(block);
      this.label_map.set(label,block);
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
      this.label_map.set(block.label,block);
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
    var buffers = this.buffers;
    var switches = this.switches;
    var dict = this.dict;
    var vmap = this.vmap;
    var plitems = [];
    var plitem = {}; //holds a pointer to the last plitem
    var v;
    var caption = '';
    var issubcaption = 0;
    var subcaptions = [];
    var bullet = '';
    var lead = '';
    var mass = '';
    var done = 0;
    var id = '';
    var name = '';
    var level = '';
    var fname = path.resolve(this.fname);

    for (let i=0; !done && n < lines.length; ++i,++n) {
      var line = lines[n];
      line = line.trimEnd();
      if(i==0 && (v=re_is_hrle.exec(line))!==null){
        type = 'hrle';
        name = 'hrle';
        title = v[0];
        body.push(line);
        continue;
      }
      if(i==0 && (v=re_is_part.exec(line))!==null){
        type = 'part';
        name = 'part';
        caption = v[1];
        this.style.__partnum++;
        style = {...this.style};
        continue;
      }
      if(i==0 && (v=re_is_chap.exec(line))!==null){
        type = 'chap';
        name = 'chapter';
        caption = v[1];
        this.style.__chapnum++;
        this.style.__sectnum = 0;
        this.style.__subsnum = 0;
        this.style.__ssubnum = 0;
        style = {...this.style};
        continue;
      }
      if(i==0 && (v=re_is_page.exec(line))!==null){
        type = 'page';
        name = 'page';
        style = {...this.style};
        continue;
      }
      if(i==0 && (v=re_is_hdgs.exec(line))!==null){
        type = 'hdgs';
        name = 'heading';
        bull = v[1];
        caption = v[2];
        hdgn = bull.length;
        if(hdgn==1){
          this.style.__sectnum += 1;
          this.style.__subsnum = 0;
          this.style.__ssubnum = 0;
          level = `${this.style.__sectnum}`;
        }else if(hdgn==2){
          this.style.__subsnum += 1;
          this.style.__ssubnum = 0;
          level = `${this.style.__sectnum}.${this.style.__subsnum}`;
        }else{
          this.style.__ssubnum + 1;
          level = `${this.style.__sectnum}.${this.style.__subsnum}.${this.style.__ssubnum}`;
        }
        style = {...this.style};
        continue;
      }
      if(i==0 && (v=re_is_capt.exec(line))!==null){
        id = v[1];
        type = 'capt';
        name = id;
        if(id=='figure'){
          ++this.style.__fignum;
        }else if(id=='listing'){
          ++this.style.__lstnum;
        }else if(id=='table'){
          ++this.style.__tabnum;
        }else if(id=='equation'){
          ++this.style.__eqnnum;
        }
        style = {...this.style};
        style = this.string_to_style(v[2],style);
        continue;
      }
      if(i==0 && (v=re_is_prim.exec(line))!==null){
        type = 'prim';
        rank = 1;
        title = v[1];
        body.push(v[2]);
        continue;
      }
      if(i==0 && (v=re_is_seco.exec(line))!==null){
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
      ///////////////////////////////////////////
      if(0&&type=='plst'){///currently not used
        /// this is to check for close paragraph fence
        ///a fullline that is not indented   
        if(this.line_is_fullline(line)){
          if((v=re_is_item.exec(line))!==null){
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
          if((v=re_is_item.exec(mass))!==null){
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
          if((v=re_is_item.exec(line))!==null){
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
        if(i==1 && (v=re_is_label.exec(line))!==null){
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
        }else if(issubcaption){
          let v = this.re_is_subcaption.exec(line);
          if(v){
            let id = v[1];
            let text = v[2];
            subcaptions.push([id,text]);
          }else if(subcaptions.length){
            let p = subcaptions.pop();
            let s = p[1];
            s = this.join_line(s,line);
            p[1] = s;
            subcaptions.push(p);
          }
          continue;
        }else{
          caption = this.join_line(caption,line);
          continue;
        }
      }
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      if(type=='hdgs'||type=='part'||type=='chap'){
        let v;
        if(i==1 && (v=re_is_label.exec(line))!==null){
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
    style.__subcaptions = subcaptions;
    let parser = this;
    if(style.autosplit){//need to be split according to style.autosplit 
      let [s0,ss,sn] = this.unwrap_bundle(body);//assume the entire body is a big bundle
      let sizes = this.string_to_int_array(style.autosplit).filter(n => n>0);
      let sh = [];//the head line
      if(style.head){
        let head = parseInt(style.head)||0;
        if(head){
          sh = ss.slice(0,head);
          ss = ss.slice(head); 
        }
      }
      let n1 = 0;
      let total_n = ss.length;
      let n = 0;
      let k = 0;
      let o = [];
      while(total_n > 0){
        if(sizes.length){
          n = sizes.shift();
        }else{
          n = total_n;
        }
        let splitid = 1+k;
        let ss1 = ss.slice(n1,n1+n);
        n1 += n;
        total_n -= n;
        k += 1;
        let ss2 = [...s0,...sh,...ss1,...sn];
        // let ssi = block.bodyrow+1+pp[0];     
        o.push({ss2,splitid});
      }
      body = [];//alter the original 'body'
      o.forEach((p) => {
        let {ss2} = p;
        body = body.concat(ss2);
      });
      let splitids = o.map(p => p.splitid).join(' ');
      style.splitids = splitids;//alter the original 'style'
    }
    return {sig, hdgn, rank, id, caste: id, title, label, level, name, fname, style, buffers, switches, dict, vmap, bodyrow, body, nblank, para, parser};//plitems is current not used
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
    try {
      var out = await utils.read_text_file_async(fname);
      var lines = out.split('\n');
      console.log(' *** '+fname+' ['+lines.length+']');
      this.read_lines(lines);
    } catch(e){
      console.log(' *** '+fname+' ['+e.toString()+']');
    }
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
  ////////////////////////////////////////////////////////////////////////
  ///
  ////////////////////////////////////////////////////////////////////////
  conf_to_float(in_key,def_val=0){
    if(this.blocks.length){
      let val = this.data[in_key];
      if(val){
        def_val = this.assert_float(val,def_val);
      }
    }
    return def_val;
  }
  conf_to_int(in_key,def_val=0){
    if(this.blocks.length){
      let val = this.data[in_key];
      if(val){
        def_val = this.assert_int(val,def_val);
      }
    }
    return def_val;
  }
  conf_to_bool(in_key,def_val=false){
    if(this.blocks.length){
      let val = this.data[in_key];
      if(val){
        def_val = this.to_bool(val);
      }
    }
    return def_val;
  }
  conf_to_list(in_key,def_val=[]){
    if(this.blocks.length){
      let val = this.data[in_key];
      if(val){
        def_val = val.split('\n');
      }
    }
    return def_val;
  }
  conf_to_string(in_key,def_val=''){
    if(this.blocks.length){
      let val = this.data[in_key];
      if(val){
        def_val = this.assert_string(val,def_val);
      }
    }
    return def_val;
  }
  ////////////////////////////////////////////////////////////////////////
  ///read_import_async();
  ////////////////////////////////////////////////////////////////////////
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
        let buffers = this.buffers;
        let switches = this.switches;
        let vmap = this.vmap;
        let sig = 'PART';
        let parser = null;
        let block = {sig, hdgn, rank, id, title, label, level, name, fname, style, buffers, switches, vmap, body, nblank, para, plitems, data, parser};  
        block.style.__partnum = partnum;
        block.style.__chapnum = chapnum;
        this.blocks.push(block);
      }else if(name=='chapter'){
        chapnum++;
        if(subparser) {
          subparser.blocks.forEach((block,i) => {
            if(i==0){
              block.sig  = 'CHAP';
            }
            block.style.__note = note;
            block.style.__partnum = partnum;
            block.style.__chapnum = chapnum;
            this.blocks.push(block);
          });
          ///merge 'this.label_map' of subparser
          this.label_map = new Map([...this.label_map,...subparser.label_map]);
        }
      }
    });
  }
  space(s){
    ///return a string that is the same length as 's' but filled all with spaces
    return ' '.repeat(s.length);
  }
  unwrap_bundle(body){ 
    var SS = body;
    var S0 = [];
    var Sn = [];
    if(body.length>0){
      let s0 = body[0];
      if(s0.startsWith('```')){
        var SS = body.slice(1);
        var S0 = body.slice(0,1);
        var Sn = [];
      }
    }
    if(S0.length==0){
      S0.push('```');
    }
    if(Sn.length==0){
      Sn.push('```');
    }
    SS = SS.filter((s) => s.startsWith('```')?false:true);
    return [S0,SS,Sn];
  }
  has_data(key,val){
    let s = this.data[key];
    if(s){
      let ss = s.split(/\s+/).map(s=>s.trim());
      if(ss.indexOf(val)>=0){
        return true;
      }
    }
    return false;
  }
}

module.exports = { NitrilePreviewParser }
