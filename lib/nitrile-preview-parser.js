'use babel';

const fs = require('fs');
const path = require('path');
const { NitrilePreviewBase } = require('./nitrile-preview-base.js');
const utils = require('./nitrile-preview-utils');

const re_style = /^\{([^\{\}]*)\}\s*(.*)$/u;
const re_text = /^\w/;

const re_ref = /^&ref\{([\w:-]*)\}\s*(.*)$/u;
const re_img = /^&img\{(.*?)\}\s*(.*)$/u;

const re_note = /^(%+)\s+(.*)$/u;
const re_capt = /^(@+)\s+(.*)$/u;
const re_hdgs = /^(#+)\s+(.*)$/u;
//const re_spcl = /^(@)\s?(\w*)\s*(.*)$/u;
const re_plst = /^(-|\+|\*|\d+[\.\)]|[A-Z][\.\)]|[a-z][\.\)])\s+(.*)$/u;
//const re_bull = /^(--|\+\+|\*\*)\s+(.*)$/u;
const re_samp = /^\s\s\s\s(.*)$/u;
const re_hrle = /^\*{3}$/u;
const re_cluster_line = /^(\s*)(~{3,})/;
const re_cluster_body = /^(\s*)(.*)$/;
const re_plaintextline = /^(\s*)(.*)$/;
const re_fence = /^```/u;
const re_verse = /^---$/u;
const re_story = /^===$/u;
const re_stop = /^\s*(={3,})\s*$/u;
const re_bars = /^\s*-{1,}\s*$/u;
const re_uri = /^\w+:\/\//u;
const re_rubyitem = /^(\S+?)\u{30fb}(\S+)/u;
const re_prim0 = /^(\+{2,})\s+(.*)$/u;
const re_prim1 = /^\[\s+(.*?)\s+\]\s*(.*)$/;
const re_prim2 = /^\[\[\s+(.*?)\s+\]\]\s*(.*)$/;
const re_prim3 = /^\[\[\[\s+(.*?)\s+\]\]\]\s*(.*)$/;
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
    this.fname = '';///the filename metadata
  }
  read_lines(lines) {
    this.blocks = [];
    this.mode = [];         
    let vmap = [];         
    let notes = new Map();
    var nlines = 0;
    var row1 = 0;
    var row2 = 0;
    var hdgn = 0;
    /// start processing all lines of the editor
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
      block.parser = this;
      block.vmap = vmap;
      block.notes = notes;
      ///only to merge two consecurive SAMP blocks with a empty line in the middle
      if(this.blocks.length && this.blocks[this.blocks.length-1].sig=='SAMP' && block.sig=='SAMP'){
        let prev_block = this.blocks[this.blocks.length-1];
        prev_block.para = prev_block.para.concat(block.para);
        prev_block.row2 = block.row2;
        prev_block.style.row2 = block.style.row2;
        prev_block.body.push('');
        prev_block.body = prev_block.body.concat(block.body);
      }else{
        this.blocks.push(block);
      }
    }
  }
  read_para (lines,n,hdgn) {
    let n0 = n;

    var bull = '';
    var body = [];
    var para = [];
    var label = '';
    var floatid = '';
    var type = '';
    var sig = '';
    var lead = '';
    var title = '';
    var style = {};
    var nspace = 0;
    var plitems = [];
    var plitem = {}; //holds a pointer to the last plitem
    var v;
    var is_plitems = 0;
    var is_cluster = 0;
    var is_caption = 0;
    var done = 0;
    var caption_body = [];
    var is_solid = 0;
    var is_empty = 0;
    //var re_sub = /^h(\d*)$/i;

    /// if n0 == 0 then checks to see if we need
    /// to read front matter
    if(lines.length && n0===0){
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
        style.subseq = n0;
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
        para = lines.slice(n0, n);
        return {para, sig, style, body, hdgn, title, nspace, data};
      }
      if(re_fullline.test(lines[0].trim())){
        let sig = 'FRNT';
        let data = [];
        n++;
        let key = 'title';
        let val = lines[0].trim();
        if(val.startsWith('# ')) val = val.slice(2);///remove the '# ' if it starts with it
        data.push([key,val]);
        let para = lines.slice(n0,n);
        style.subseq = n0;
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
        para = lines.slice(n0, n);
        return {para, sig, style, body, hdgn, title, nspace, data};
      }else{
        ///if there isn't any FRNT block then we need to skip any leading empty lines
        while(n < lines.length && lines[n].trim().length==0){
          n++;
        }
      }
    }

    /// read body                   

    for (let i=0; !done && n < lines.length; ++i,++n) {
      var line = lines[n];
      line = line.trimRight();
      is_solid++;
      if(i==0 && (v=re_note.exec(line))!==null){
        type = 'note';
        bull = v[1];
        title = v[2];
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
          style.label = label;
          body.push(title);
        } else {
          title = s;
          body.push(title);
        }
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
      if(0 && i==0 && (v=re_bull.exec(line))!==null){
        type = 'bull';
        hdgn = v[1];
        body.push(v[2]);
        plitem = {body};
        plitems.push(plitem);
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
      if(i==0 && (v=re_plaintextline.exec(line))!==null){
        type = 'text';
        nspace = v[1].length;
        body.push(line);
        continue;
      }
      if(i==0){
        type = 'text';
        nspace = 0;
        body.push(line);
        continue;  
      }
      if(type=='plst'){
        if(re_fullline.test(line)){
          if((v=re_plst.exec(line))!==null){
            body = [];
            body.push(v[2]);
            let bullet = v[1];
            plitem = {n,body,bullet};
            plitems.push(plitem);
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
          plitem = {n,body};
          plitems.push(plitem);
          continue;
        }
        ///first empty line does not get into the body
        if(line.length == 0 && body.length==0){
          continue;
        }
        ///normal line
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
        ///assuming 'lead' has already been assigned by the first line
        ///trim left of the subsequent line to it
        line = line.slice(nspace);
        /// this is when body.length > 0
        if(is_cluster){
          if((v=re_cluster_line.exec(line))!==null){
            ///ending the current cluster and start a new one
            body.push(line);
            is_cluster = 0;
            body = [];
            plitem = {n,body};
            plitems.push(plitem);
            continue;
          }
        }
        body.push(line);
        continue;
      }//is_plitems
      if(type=='bull'){
        if(line.length == 0){
          break;
        }else if(re_fullline.test(line)){
          if((v=re_bull.exec(line))!==null){
            body = [];
            body.push(v[2]);
            plitem = {body};
            plitems.push(plitem);
            continue;
          }else{
            break;
          }
        }else{
          ///add to 'body'
          body.push(line);
        }
        continue;
      }
      if(type=='samp'){
        if(line.length==0){
          break;
        }
        ///if the last line is empty and this 
        ///line does not conform to the samp, we quit
        if(!re_samp.test(line)){
          type = 'text';
        }
        /// normal line
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
        /*
        if((v=re_cluster_body.exec(line))!==null){
          let my_nspace = v[1].length;
          let my_nsolid = v[2].length;
          if(my_nspace < nspace && my_nsolid > 0){
            break;
          }
        }
        */
        body.push(line);
        continue;
      }//end of is_cluster
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
      return { para, sig, style, body, hdgn, title, nspace};
    }
    else if(sig == 'HDGS'){
      style.sig = sig;
      style.subseq = n0;
      title = body.join('\n');
      return { para, sig, style, body, hdgn, title, nspace};
    } 
    else if(sig == 'PLST'){
      style.sig = sig;
      style.subseq = n0;
      plitems = plitems.filter(x => x.body.length);
      //items = this.parse_plitems_for_plst(plitems);
      return { para, sig, style, body, hdgn, title, nspace, plitems};
    }
    else if(sig == 'BULL'){
      style.sig = sig;
      style.subseq = n0;
      plitems = plitems.filter(x => x.body.length);
      return { para, sig, style, body, hdgn, title, nspace, plitems};
    }
    else if(sig == 'SAMP'){
      style.sig = sig;
      style.subseq = n0;
      //body = this.trim_samp_body(body);
      return { para, sig, style, body, hdgn, title, nspace};
    } 
    else if(sig == 'PRIM'){
      style.sig = sig;
      style.subseq = n0;
      return { para, sig, style, body, hdgn, title, nspace};
    } 
    else if(sig == 'TEXT'){
      style.sig = sig;
      style.subseq = n0;
      style.nspace = nspace;
      return { para, sig, style, body, hdgn, title, nspace};
    } 
    else if(sig == 'HRLE'){
      style.sig = sig;
      style.subseq = n0;
      return { para, sig, style, body, hdgn, title, nspace};
    }
    else{
      //console.error(`unhandled type: (${type})`);
      //console.error(para);
      //this could happen where 'para' are all empty lines
      sig = '';
      style.sig = sig;
      style.subseq = n0;
      return { para, sig, style, body, hdgn, title, nspace};
    }
  }
  async read_mode_async() {
    let all = [];
    /// get dirname
    /// read all this.mode
    for (var d of this.mode) {
      let { subf } = d;
      if (subf) {
        d.subparser = new NitrilePreviewParser();
        let dname = path.dirname(this.fname);
        let fname = path.resolve(dname,subf);
        all.push(d.subparser.read_file_async(fname));
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
        let style = {sig,subseq, refid};
        this.blocks.push({ sig, title, style});///the 'part' block will have a refid
        console.log('part', text, refid);
      } else if (name && subparser && typeof subn == 'number') {
        ///only for the intended
        ///creates a new block for the chapter title
        ///
        console.log(name, subf, refid, 'blocks',subparser.blocks.length);
        let sig = 'HDGS';
        let hdgn = subn;
        let subseq = 0;
        let title = this.conf(subparser.blocks,'title','Untitled');
        let label = this.conf(subparser.blocks,'label','');
        let style = {sig,refid,subseq,label,name,subf};
        this.blocks.push({sig,hdgn,subseq,title,style,notes:subparser.notes,vmap:subparser.vmap});
        ///just move blocks from subparser to this main parser
        ///
        subparser.blocks.forEach((x, i) => {
          if(x.sig!=='FRNT'){
            x.hdgn += subn;
            x.style.refid = refid;//all blocks from the same source file will have the same refid
            x.style.name = name;
            x.style.subf = subf;
            this.blocks.push(x);
          }
        });
      }
    }
    console.log('read_mode_async completed','total blocks',this.blocks.length);
  }
  async do_import_blocks(block,r){
    r = parseInt(r)||0;
    ///NOTE: this function returns a list of blocks
    ///
    if(r >= 0 && block.sig=='FLOA' && block.floatname=='Import'){
      let blocks = [];
      /// read from 'body'
      let items = [];
      for (let i; i < block.body.length; ++i) {
        var line = block.body[i];
        line = line.trimRight();
        if((v=re_comm.exec(line))!==null){
          var nitrile_line = v[1];
          if ((v = re_nitrilemode.exec(nitrile_line)) !== null) {
            var key = v[1];
            var only= v[2];
            var val = v[3];
            if(key==='part'){
              let name='part';
              let title=val;
              let hdgn = 0;
              let subseq = block.row1 + i;
              items.push({name,title,hdgn,subseq});
            }else if(key==='chapter'){
              let name='section';
              let hdgn = 0;
              let subf = val;
              let subseq = block.row1 + i;
              items.push({name,only,hdgn,subf,subseq});
            }else if(key==='section'){
              let name='section';
              let hdgn = 1;
              let subf = val;
              let subseq = block.row1 + i;
              items.push({name,only,hdgn,subf,subseq});
            }else if(key==='subsection'){
              let name='section';
              let hdgn = 2;
              let subf = val;
              let subseq = block.row1 + i;
              items.push({name,only,hdgn,subf,subseq});
            }else if(key==='subsubsection'){
              let name='section';
              let hdgn = 2;
              let subf = val;
              let subseq = block.row1 + i;
              items.push({name,only,hdgn,subf,subseq});
            }else{
              let subn=parseInt(key);
              if(typeof subn == 'number' && Number.isFinite(subn) && subn >= 0){
                let name = 'section';
                let hdgn = block.hdgn + subn;
                let subf = val;
                let subseq = block.row1 + i;
                items.push({name,hdgn,subf,subseq});
              }
            }
          }
        }
      }
      /// read all 'sub'
      for (var d of items) {
        if(d.name=='sub'){
          d.subparser = new NitrilePreviewParser();
          let subfname = path.resolve(path.dirname(this.fullname),d.subf);
          let prom = d.subparser.read_file_async(subfname,r-1);
          all.push(prom);
        }
      }
      /// wait for all
      await Promise.all(all);
      /// at this point all sub-documents are read from disk
      for (let d of this.items) {
        let { name, title, hdgn, subf, subseq, subparser } = d;
        if (name === 'part') {
          /// 'part'
          let sig = 'PART';
          let style = {sig, subseq};
          blocks.push({ sig, title, hdgn, style});
        } else if (name === 'section') {
          /// 'section'
          ///insert artificial HDGN block
          let sig = 'HDGS';
          subseq = subseq + ".0"; /// 12.0
          let title = this.conf(subparser.blocks,'title','Untitled');
          let label = this.conf(subparser.blocks,'label','');
          let style = {sig,subseq,label,subf};
          blocks.push({sig,hdgn,subseq,title,style,notes:subparser.notes,vmap:subparser.vmap});
          ////insert all other blocks
          subparser.blocks.forEach((x, i) => {
            if(x.sig!=='FRNT'){
              x.hdgn += hdgn;
              x.style.subseq = subseq + "." + x.style.subseq;///"12.1", "12,2", "12.3", ...
              x.style.subf = subf;
              blocks.push(x);
            }
          });
        }
      }
      return blocks;
    }
    return [block];
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
  __parse_plitems_for_plst (plitems) {
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
      var line = plitem.body[0];
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
        plitem.body[0] = text;
        text = plitem.body.join('\n');
        var ds = null;
        var dl = null;
        if (bullet[0] == '-'){
          value = '';
          bull = 'UL';
        } else if (bullet[0] == '*'){
          value = '';
          bull = 'OL';
        } else if (bullet[0] == '+'){
          if(lead==''){
            value = '';
            bull = 'DL';
            let dt = plitem.body[0];
            let dd = plitem.body.slice(1).join('\n');
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
        let row1 = plitem.n;
        let row2 = plitem.n + plitem.body.length;
        items.push({bull:'LI',bullet,value,text,dl,ds,row1,row2,more});
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
        let row1 = plitem.n;
        let row2 = plitem.n + plitem.body.length;
        items.push({bull:'LI',bullet,value,text,dl,ds,row1,row2,more});
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
        x.more.forEach(plitem => {
          plitem.row1 = plitem.n;
          plitem.row2 = plitem.n + plitem.body.length;
          plitem.lines = this.trim_samp_body(plitem.body);
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
    var myval = def_val;
    if (block && block.sig == 'FRNT') {
      let data = block.data;
      for (let t of data) {
        let [key, val] = t;
        if (key.localeCompare(in_key)==0) {
          ///check 'type'
          if(type=='float'){
            val = parseFloat(val);
            if(Number.isFinite(val)){
              myval = val;
            }
          }else if(type=='int'){
            val = parseInt(val);
            if(Number.isFinite(val)){
              myval = val;
            } 
          }else{
            myval = val;
          }
          break;
        }
      }
    }
    ///add 'suffix'
    if(myval && suffix){
      myval = `${myval}${suffix}`
    }
    return myval;
  }
  async read_import_async(){
    let body = this.conf(this.blocks,'import').split('\n');
    /// read from 'body' and build 'items'
    const re_mode = /^(\w+)(\*|)=(.*)$/u;
    body = body.map(x => x.trimRight());
    let items = [];
    body.forEach(raw => {
      let d = {raw};
      items.push(d);
    });
    items.forEach((d,i) => {
      d.refid = i+1;
      let v;
      if ((v = re_mode.exec(d.raw)) !== null) {
        var key = v[1];
        var only= v[2];
        var val = v[3];
        if(key==='part'){
          d.name='part';
          d.title=val;
        }else if(key==='chapter'){
          d.name=key;
          d.subf = val;
          d.subn = 0;
          d.subparser = new NitrilePreviewParser();
          d.subfname = path.resolve(path.dirname(this.fname),d.subf);
          d.prom = d.subparser.read_file_async(d.subfname);  

        }else if(key==='section'){
          d.name=key;
          d.subf = val;
          d.subn = 1;
          d.subparser = new NitrilePreviewParser();
          d.subfname = path.resolve(path.dirname(this.fname),d.subf);
          d.prom = d.subparser.read_file_async(d.subfname);  

        }else if(key==='subsection'){
          d.name=key;
          d.subf = val;
          d.subn = 2;
          d.subparser = new NitrilePreviewParser();
          d.subfname = path.resolve(path.dirname(this.fname),d.subf);
          d.prom = d.subparser.read_file_async(d.subfname);  

        }else if(key==='subsubsection'){
          d.name=key;
          d.subf = val;
          d.subn = 3;
          d.subparser = new NitrilePreviewParser();
          d.subfname = path.resolve(path.dirname(this.fname),d.subf);
          d.prom = d.subparser.read_file_async(d.subfname);  

        }
      }
    });
    /// wait for all
    ///
    var all = items.filter(d => d.prom);
    var all = items.map(d => d.prom);
    await Promise.all(all);
    /// at this point all sub-documents are read from disk
    //
    let blocks = [];
    for (let d of items) {
      let { name, title, refid, subf, subn, subparser } = d;
      if (name === 'part') {
        /// 'part'
        let sig = 'PART';
        let subseq = 0;
        let style = {sig,subseq,refid,name};
        blocks.push({sig,title,style});
      } else if (subparser) {
        /// 'section'
        ///insert artificial HDGN block
        let sig = 'HDGS';
        let hdgn = subn;
        let subseq = 0;
        let title = this.conf(subparser.blocks,'title','Untitled');
        let label = this.conf(subparser.blocks,'label','');
        let style = {sig,refid,subseq,label,subf,name};
        let notes = d.subparser.notes;
        let vmap = d.subparser.vmap;
        blocks.push({sig,hdgn,title,style,notes,vmap});
        ////insert all other blocks
        subparser.blocks.forEach((x) => {
          if(x.sig!=='FRNT'){
            x.hdgn += subn;
            x.style.refid = refid;//all blocks from the same source file will have the same refid
            x.style.subf = subf;
            blocks.push(x);
          }
        });
      }
    }
    /// add to main blocks
    this.blocks = this.blocks.concat(blocks);
  }
}

module.exports = { NitrilePreviewParser }
