'use babel';

const fs = require('fs');
const path = require('path');
const { NitrilePreviewBase } = require('./nitrile-preview-base.js');

const re_style = /^\{([^\{\}]*)\}\s*(.*)$/u;
const re_text = /^\w/;

const re_ref = /^&ref\{([\w:-]*)\}\s*(.*)$/u;
const re_img = /^&img\{(.*?)\}\s*(.*)$/u;

const re_spcl = /^(@+)\s+(\w+)\s*(.*)$/u;
const re_hdgs = /^(#+)\s+(.*)$/u;
const re_plst = /^(-+|\++|\*+|\d+\)|\d+\.)\s+(.*)$/u;

const re_samp = /^\s\s\s\s(.*)$/u;
const re_hrle = /^\*{3}$/u;
const re_cluster_line = /^(\s*)~~~/;
const re_cluster_body = /^(\s*)(.*)$/;
const re_fence = /^```/u;
const re_verse = /^---$/u;
const re_story = /^===$/u;
const re_stop = /^\s*(={3,})\s*$/u;
const re_bars = /^\s*-{1,}\s*$/u;
const re_uri = /^\w+:\/\//u;
const re_rubyitem = /^(\S+?)\u{30fb}(\S+)/u;
const re_prim1 = /^\[\s+(.*?)\s+\]$/;
const re_prim2 = /^\[\[\s+(.*?)\s+\]\]$/;
const re_prim3 = /^\[\[\[\s+(.*?)\s+\]\]\]$/;
const re_blank = /^(\s+)(.*)$/;
const re_plain = /^(\S+\s*)(.*)$/;
const re_comm             = /^%(.*)$/u;
const re_nitrilemode      = /^(\w+)(\*|)=(.*)$/u;
const re_nitrileitem      = /^(\S+?)\u{30fb}(\S+)/u;
const re_nitrileconf      = /^(\w+)\.(\w+)\s*=\s*(.*)$/u;
const re_nitrileconf_plus = /^(\w+)\.(\w+)\s*\+=\s*(.*)$/u;
const re_fullline = /^\S/;
const re_indented = /^\s/;
const re_frnt = /^---$/;
const re_kval = /^(\w[\w\.\-]*)\s*:\s*(.*)$/;
const s_unicode_right_arrow = String.fromCharCode(8594);

class NitrilePreviewParser extends NitrilePreviewBase {

  constructor() {
    super();
    this.dirname = '';
    this.fname = '';///the filename metadata
    this.subname = '';///assigned to 'h' when being imported
    this.sublevel = 0;///assigned to a number when being imported
    this.subid = 0;///assigned to a number when being imported
    this.initialize();
  }

  initialize(){
    this.blocks = [];
    this.mode = [];         
    this.vmap = [];         
    this.notes = new Map();
    this.ismaster = 0;
    this.sample = 0;
    this.program = '';
    this.endblock = {};
  }

  read_md_lines(lines) {

    this.initialize();

    var nlines = 0;
    var row1 = 0;
    var row2 = 0;
    var o = [];

    /// start processing all lines of the editor
    while (nlines < lines.length) {

      var block  = this.read_para(lines,nlines);
      var para = block.para;

      /// increment block count
      var nread = para.length;
      row1 = nlines;
      nlines += nread;
      row2 = nlines;

      block.row1 = row1;
      block.row2 = row2;
      block.parser = this;
      block.vmap = this.vmap;
      block.notes = this.notes;

      /// 'sig' must *not* be empty
      o.push(block);

    }

    /// assign to 'this.blocks'
    this.blocks = o;
  }

 
  read_para (lines,n) {
    let n0 = n;

    var bull = '';
    var body = [];
    var para = [];
    var label = '';
    var islabeled = 0;
    var floatid = '';
    var type = '';
    var sig = '';
    var hdgn = '';
    var sig = '';
    var bull = '';
    var title = '';
    var wide = 0;
    var style = {};
    var nspace = 0;
    var plitems = [];
    var items = [];
    var v;
    var is_plitems = 0;
    var re_plitems = null;
    var is_spcl = 0;
    var is_samp = 0;
    var is_cluster = 0;
    var is_text = 0;
    var is_caption = 0;
    var done = 0;
    var caption_body = [];
    var is_solid = 0;
    var is_empty = 0;
    //var re_sub = /^h(\d*)$/i;

    /// if n0 == 0 then checks to see if we need
    /// to read front matter
    if(n0===0){
      if(re_frnt.test(lines[0].trim())){
        let sig = 'FRNT';
        let data = [];
        n++;
        for(n=1; n < lines.length; n++){
          if(re_frnt.test(lines[n].trim())){
            n++;
            break;
          }
          let line = lines[n];
          line = line.trimRight();
          if(re_fullline.test(line)){
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
        let para = lines.slice(n0, n);
        return {sig,data,para};
      }
    }

    /// read blank lines or TEX-comment lines

    for (; n < lines.length; ++n) {
      var line = lines[n];
      line = line.trimRight();
      if((v=re_comm.exec(line))!==null){
        var nitrile_line = v[1];
        if ((v = re_nitrilemode.exec(nitrile_line)) !== null) {
          var key = v[1];
          var only= v[2];
          var val = v[3];
          if(key==='part'){
            let name='part';
            let text=val;
            let refid=n;
            this.mode.push({name,text,refid});
          }else if(key==='chapter'){
            let name='chapter';
            let subn=0;
            let subf=val;
            let refid=n;///let refid be the same as linenum
            this.mode.push({name,only,subn,subf,refid});
          }else if(key==='section'){
            let name='section';
            let subn=1;
            let subf=val;
            let refid=n;///let refid be the same as linenum
            this.mode.push({name,only,subn,subf,refid});
          }else if(key==='subsection'){
            let name='subsection';
            let subn=2;
            let subf=val;
            let refid=n;///let refid be the same as linenum
            this.mode.push({name,only,subn,subf,refid});
          }else if(key==='subsubsection'){
            let name='subsubsection';
            let subn=3;
            let subf=val;
            let refid=n;///let refid be the same as linenum
            this.mode.push({name,only,subn,subf,refid});
          }
          continue;
        }
        continue;
      }
      if(line.length==0){
        continue;
      }
      break;
    }

    /// read body                   

    for (let i=0; !done && n < lines.length; ++i,++n) {
      var line = lines[n];
      line = line.trimRight();
      is_solid++;
      if(i==0 && (v=re_spcl.exec(line))!==null){
        label = '';
        type = 'spcl';
        is_spcl = 1;
        is_caption = 1;
        bull = v[1];
        floatid = v[2].toLowerCase();
        let s = v[3];
        caption_body.push(s);
        continue;
      }
      if(i==0 && (v=re_hdgs.exec(line))!==null){
        type = 'hdgs';
        bull = v[1];
        let s = v[2];
        if((v=re_ref.exec(s))!==null){
          islabeled = 1;
          label = v[1];
          title = v[2];
        } else {
          title = s;
        }
        hdgn = bull.length;
        n++;
        body.push(line);
        break;
      }
      if(i==0 && (v=re_hrle.exec(line))!==null){
        type = 'hrle';
        title = v[0];
        body.push(line);
        n++;  
        break;
      }
      if(i==0 && (v=re_samp.exec(line))!==null){
        is_samp = 1;
        type = 'samp';
        body.push(line);
        continue;  
      }
      if(i==0 && (v=re_plst.exec(line))!==null){
        is_plitems = 1;
        re_plitems = re_plst;
        type = 'plst';
        body.push(line);
        plitems.push(body);
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
        type = 'text';
        nspace = v[1].length;
        body.push(line);
        continue;
      }
      if(i==0){
        is_text = 1;
        type = 'text';
        body.push(line);
        continue;  
      }
      if(is_spcl){
        if(re_fullline.test(line)){
          break;
        }
        if(line.length==0){
          if(is_caption){
            is_caption = 0;
            continue;
          }
          body.push(line);
          continue;
        }
        if(is_caption){
          caption_body.push(line);
        }else{
          body.push(line);
        }
        continue;
      }
      if(is_plitems){
        if(re_fullline.test(line)){
          if(re_plitems.test(line)){
            body = [];
            plitems.push(body);
            body.push(line);
            //is_cluster = 0;
            continue;
          }else{
            break;
          }
        }
        if(!is_cluster && line.length == 0 && body.length>0) {
          ///a blank line will end the cluster if not started
          ///with cluster fence
          body = [];
          plitems.push(body);
          continue;
        }
        ///first empty line does not get into the body
        if(line.length == 0 && body.length==0){
          continue;
        }
        ///normal line
        if(body.length==0){
          ///a paragraph item
          if((v=re_cluster_line.exec(line))!==null){
            is_cluster = 1;
            nspace = v[1].length;
          }
          body.push(line);
          continue;
        }
        if(is_cluster){
          if((v=re_cluster_line.exec(line))!==null){
            ///ending the current cluster and start a new one
            body.push(line);
            is_cluster = 0;
            body = [];
            plitems.push(body);
            continue;
          }
          if((v=re_cluster_body.exec(line))!==null){
            let my_nspace = v[1].length;
            let my_nsolid = v[2].length;
            if(my_nspace < nspace && my_nsolid > 0){
              ///the current cluster has ended prematurely,
              ///start a new cluster
              body = [];
              body.push(line);
              plitems.push(body);
              is_cluster = 0;
              continue;
            }
          }
        }
        body.push(line);
        continue;
      }//is_plitems
      if(is_samp){
        if(line.length==0){
          body.push(line);
          continue;
        }
        if(re_fullline.test(line)){
          break;
        }
        if(!re_samp.test(line)){
          break;
        }
        ///normal line
        body.push(line);
        continue;
        
      }//end of is_samp
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
      }//'prim'
      if(type=='text' && is_cluster){
        if((v=re_cluster_line.exec(line))!==null){
          body.push(line);
          is_cluster = 0;
          done = 1;
          continue;
        }
        if((v=re_cluster_body.exec(line))!==null){
          let my_nspace = v[1].length;
          let my_nsolid = v[2].length;
          if(my_nspace < nspace && my_nsolid > 0){
            break;
          }
        }
        body.push(line);
        continue;
      }//end of is_cluster
      if(line.length==0){
        break;
      }
      body.push(line);
      continue;
    }

    /// if is 'spcl' then rollback the last few lines 
    /// that are empty

    while(is_spcl && n > n0 && lines[n-1].length==0){
      n = n-1;
    }

    /// remove bottom of 'para' that are empty lines
    /// so that these empty lines are considered part
    /// of next para

    while (is_solid && n > n0 && lines[n-1].length==0) {
      n--;
    }

    /// post-processing of 'body'

    para = lines.slice(n0, n);
    sig = type.toUpperCase();


    /// parse 'body'
    
    if(type == 'spcl'){
      ///all the bodys are just for the caption
      ///it will need to be joint by following SAMP paragraphs
      if(bull.length>1){ wide=1; }
      var caption = this.join_para(caption_body).trim();
      var [style,islabeled,label,caption] = this.string_to_caption_info(caption);
      var lines = [];
      body = this.trim_samp_body(body);
      if(floatid == 'figure'){
        var floatname = 'Figure';
      } 
      else if (floatid == 'listing'){
        var floatname = 'Listing';
      } 
      else if (floatid == 'table'){
        var floatname = 'Table';
      } 
      else if (floatid == 'longtable'){
        var floatname = 'Table';
      } 
      else if (floatid == 'equation'){
        var floatname = 'Equation';
      }
      else if (floatid == 'note'){
        var floatname = 'Note';
      }
      else if (floatid == 'vocabulary') {
        var floatname = 'Vocabulary';
      }
      else {//treat it as LLST    
        var floatname = '';
        nspace = 0;
      }
      style.floatname = floatname;
      style.label = label;
      style.caption = caption;
      sig = 'FLOA';
      return { para, sig, wide, caption, label, islabeled, style, floatname, body, hdgn, title, nspace, items};
    }
    else if(type == 'hdgs'){
      return { para, sig, wide, caption, label, islabeled, style, floatname, body, hdgn, title, nspace, items};
    } 
    else if(type == 'plst'){
      plitems = plitems.filter(x => x.length);
      items = this.parse_plitems_for_plst(plitems);
      return { para, sig, wide, caption, label, islabeled, style, floatname, body, hdgn, title, nspace, items};
    }
    else if(type == 'samp'){
      body = this.trim_samp_body(body);
      return { para, sig, wide, caption, label, islabeled, style, floatname, body, hdgn, title, nspace, items};
    } 
    else if(type == 'prim'){
      return { para, sig, wide, caption, label, islabeled, style, floatname, body, hdgn, title, nspace, items};
    } 
    else if(type == 'text'){
      [body, nspace] = this.trim_samp_para(body);
      return { para, sig, wide, caption, label, islabeled, style, floatname, body, hdgn, title, nspace, items};
    } 
    else if(type == 'hrle'){
      return { para, sig, wide, caption, label, islabeled, style, floatname, body, hdgn, title, nspace, items};
    }
    else{
      //console.error(`unhandled type: (${type})`);
      //console.error(para);
      //this could happen where 'para' are all empty lines
      sig = '';
      return { para, sig, wide, caption, label, islabeled, style, floatname, body, hdgn, title, nspace, items};
    }
  }
  async read_mode_async() {
    this.ismaster = 1;
    let all = [];
    /// get dirname
    var dirname = this.dirname; 
    console.log('dirname',dirname);
    /// read all this.mode
    for (var d of this.mode) {
      let { subf } = d;
      if (subf) {
        d.subparser = new NitrilePreviewParser();
        all.push(d.subparser.read_md_file_async(subf, dirname));
      }
    }
    /// wait for all
    await Promise.all(all);
    console.log('all mode file read completed','total',all.length,'files');
    /// at this point all sub-documents are read from disk
    for (let d of this.mode) {
      let { name, subn, text, subf, subparser, refid } = d;
      if (name === 'part') {
        let sig = 'PART';
        let subseq = 0;
        let title = text;
        let style = {};
        this.blocks.push({ sig, title, refid, subseq, style});///the 'part' block will have a refid
        console.log('part', text, refid);
      } else if (name && subparser && typeof subn == 'number') {
        /// this is the master
        subparser.subname = name;
        subparser.sublevel = subn;
        ///only for the intended
        console.log(name, subf, refid, 'blocks',subparser.blocks.length);
        let sig = 'HDGS';
        let hdgn = subn;
        let subseq = 0;
        let title = this.conf(subparser.blocks,'title','Untitled');
        let label = this.conf(subparser.blocks,'label','');
        let style = {};
        let notes = subparser.notes;
        let vmap = subparser.vmap;
        ///creates a new block for the chapter title
        this.blocks.push({sig,title,hdgn,label,refid,subseq,name,subf,subn,style,notes,vmap});
        ///just move blocks from subparser to this main parser
        subparser.blocks.forEach((x, i) => {
          if(x.sig!=='FRNT'){
            x.name = name;
            x.subf = subf;
            x.hdgn += subn;
            x.refid = refid;//all blocks from the same source file will have the same refid
            x.subseq = i+1;
            this.blocks.push(x);
          }
        });
      }
    }
    console.log('read_mode_async completed','total blocks',this.blocks.length);
  }
  parse_plst (para,isbroad) {
    ///
    /// Parse the paragraph that is PLST
    ///

    var items = [];
    //
    var num = 0;
    var levels = [];
    var lead = '';
    var bull = '';
    var bullet = '';
    var value = '';
    var action = '';
    var k = 0;
    var more = [];
    var v;
    const re_leadspaces = /^(\s*)(.*)$/;
    //
    //var re = /^(\s*)(\+|\-|\*|\d+\.)\s+(.*)$/;
    //
    var re = /^(\s*)/;
    for (var line of para) {
      if(line.length==0){
        k=0;  
        more.push('');
        continue;
      }
      if(isbroad && !k && re_indented.test(line) && !re_plst.test(line.trimLeft())){
        more.push(line);
        continue;
      }
      k++;
      v = re_leadspaces.exec(line);
      if (v) {
        lead = v[1];
        line = v[2];
      } else {
        lead = '';
      }
      v = re_plst.exec(line);
      if(isbroad && k>1){
        v = null;
      }
      if (v) {
        var bullet = v[1];
        var text = v[2];
        if (bullet == '-'){
          value = '';
          bull = 'UL';
        } else {
          bull = 'OL';
          num = parseInt(bullet);
          value = `${num}.`;
        }
        // check for indentation
        if (levels.length == 0) {
          action = 'push';
        } else {
          var lead0 = levels[levels.length-1][0];
          if (lead0.length < lead.length) {
            action = 'push';
          } else if (levels.length > 1 && lead0.length > lead.length) {
            action = 'pop';
          } else {
            action = 'item';
          }
        }
      } else {
        action = 'text';
      }

      /// For Japanese language input, the following three
      /// are used for three levels of nesting
      ///  ー \u30fc
      ///  ＋ \uff0b
      ///  ＊ \uff0a

      if (action === 'push') {
        levels.push([lead,bull]);
        more = [];
        items.push({bull,bullet,value,text,more});
      } else if (action === 'pop') {
        var [lead,bull] = levels.pop();
        bull = `/${bull}`;
        more = [];
        items.push({bull,bullet,value,text,more});
      } else if (action === 'item') {
        bull = 'LI';
        more = [];
        items.push({bull,bullet,value,text,more});
      } else {
        // 'text', concat the new text to the old of the last text
        if (items.length > 0) {
          var item = items.pop();
          var {text} = item;
          text = this.join_line(text,line);
          item.text = text;
          items.push(item);
        }
      }
    }
    //
    while (levels.length > 0) {
      [lead,bull] = levels.pop();
      bull = `/${bull}`;
      items.push({bull});
    }
    //
    return items;
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
    var start = 'a'.charCodeAt(0);
    var code = a.charCodeAt(0);
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
  async read_file_async (filename) {
    /// Returns a Promise that resolves to a string of
    /// the entire file content being read
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
  async write_file_async (filename, data) {
    /// Returns a Promise that resolves to a string of
    /// the entire file content being read
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
  async read_md_file_async(fname,dirname) { 
    if(dirname){
      var fullname = path.join(dirname,fname);
    } else {
      var fullname = fname;
    }
    ///replace the last extension with .md
    fullname = `${fullname.slice(0,fullname.length-path.extname(fullname).length)}.md`;
    var out = await this.read_file_async(fullname);
    var lines = out.split('\n');
    console.log('read file',fname,lines.length,'lines');
    this.dirname = path.dirname(fullname);
    this.fname = path.basename(fullname);
    this.read_md_lines(lines);
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
  string_to_caption_info(line) {
    var v;
    var label = '';
    var islabeled = 0;
    var style = {};
    if ((v = re_style.exec(line))!== null){
      style = this.string_to_style(v[1]);
      line = v[2];
    }
    while(1){
      if ((v = re_ref.exec(line)) !== null) {
        islabeled += 1;
        if(islabeled==1){
          label = v[1].trim();
        }else{
          label += ',';
          label += v[1].trim();
        }
        line = v[2];
      } else {
        break;
      }
    }
    return [style,islabeled,label,line];
  }
  parse_plitems_for_plst (plitems) {
    ///
    /// Parse the paragraph that is PLST
    ///

    var items = [];
    //
    var num = 0;
    var levels = [];
    var lead = '';
    var bull = '';
    var bullet = '';
    var value = '';
    var action = '';
    var k = 0;
    var more = [];
    var v;
    const re_leadspaces = /^(\s*)(.*)$/;
    //
    //var re = /^(\s*)(\+|\-|\*|\d+\.)\s+(.*)$/;
    //
    var re = /^(\s*)/;
    for (var plitem of plitems) {
      var line = plitem[0];
      v = re_leadspaces.exec(line);
      if (v) {
        lead = v[1];
        line = v[2];
      } else {
        lead = '';
      }
      v = re_plst.exec(line);
      if (v) {
        var bullet = v[1];
        var text = v[2];
        plitem[0] = text;
        text = plitem.join('\n');
        var ds = null;
        var dl = null;
        if (bullet[0] == '-'){
          value = '';
          bull = 'UL';
        } else if (bullet[0] == '*'){
          value = '';
          bull = 'UL';
          ds = this.string_to_ds(plitem[0]);
          ds.desc = plitem.slice(1).join('\n');
        } else if (bullet[0] == '+'){
          if(lead==''){
            value = '';
            bull = 'DL';
            let dt = plitem[0];
            let dd = plitem.slice(1).join('\n');
            dl = {dt,dd};
          }else{
            value = '';
            bull = 'UL';
          }
        } else {
          bull = 'OL';
          num = parseInt(bullet);
          value = `${num}.`;
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
        items.push({bull:'LI',bullet,value,text,dl,ds,more});
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
        items.push({bull:'LI',bullet,value,text,dl,ds,more});
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
        x.more = x.more.map(plitem => {
          plitem = this.trim_samp_body(plitem);
          let lines = plitem;
          return {lines};
        })
      }
    })
    //
    return items;
  }
  string_to_ds(s){
    let cat;
    let keys = [];
    var v;
    const re_key_items = /^'[^']+'(,'[^']+')*$/
    const re_key_braced = /^\{\s+(.*?)\s+\}$/;
    const re_key_quoted = /^('.*?'|".*?")\s*(.*)$/;
    const re_key_coloned = /^(.*?):\s+(.*)$/;
    const re_key_item = /^(\S+)\s*(.*)$/;
    if ((v = re_key_items.exec(s)) !== null) {
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
      cat = 'braced';
      keys.push(key)
    }
    else {
      let key = s;
      cat = '';
      keys.push(key);
    }
    return {keys,cat};
  }
  conf(blocks, in_key, def_val = '') {
    let block = blocks[0];
    if (block && block.sig == 'FRNT') {
      let data = block.data;
      for (let t of data) {
        let [key, val] = t;
        if (key.localeCompare(in_key) == 0) {
          return val;
        }
      }
    }
    return def_val;
  }

}

module.exports = { NitrilePreviewParser }
