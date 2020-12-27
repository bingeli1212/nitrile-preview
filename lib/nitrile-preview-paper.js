'use babel';

class NitrilePreviewPaper {

  constructor(translator) {
    this.translator = translator;
    this.eid = 0; //exercise ID
    this.num_parts = 0;
    this.num_chapters = 0;
  }
  to_top(blocks){
    var top = this.to_top_parts(blocks);
    if(this.num_parts == 0 && this.num_chapters == 0){
      top = this.to_top_sections(blocks);
    }else if(this.num_parts == 0){
      top = this.to_top_chapters(blocks);
    }
    return top;
  }
  to_top_parts(blocks) {
    var top = [];
    var o = [];
    top.push(o);
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'FRNT'){
        continue;
      }
      if (sig == 'PART') {
        this.num_parts += 1;
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }
    }
    ///remove those arrays that are empty
    top = top.filter(o => {
      if( Array.isArray(o)) {
        return (o.length==0)?0:1;
      }
      return 1;
    })
    /// now process those chapters
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_top_chapters(o);
      }
      return o;
    })
    return top;
  }
  to_top_chapters(blocks) {
    var top = [];
    var o;
    if(blocks[0].sig=='PART'){
      o = top;
      o.push(blocks.shift());
    }else{
      o = [];
      top.push(o);
      o.push(blocks.shift());
    }
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'FRNT'){
        continue;
      }
      if (sig == 'HDGS' && hdgn == 0) {
        this.num_chapters += 1;
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    ///remove those arrays that are empty
    top = top.filter(o => {
      if( Array.isArray(o)) {
        return (o.length==0)?0:1;
      }
      return 1;
    })
    /// now process those sections
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_top_sections(o);
      }
      return o;
    })
    return top;
  }
  to_top_sections(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'FRNT'){
        continue;
      }
      if (sig == 'HDGS' && hdgn == 1) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }
    }
    ///remove those arrays that are empty
    top = top.filter(o => {
      if( Array.isArray(o)) {
        return (o.length==0)?0:1;
      }
      return 1;
    })
    /// now process those sections    
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_top_subsections(o);
      }
      return o;
    })
    return top;
  }
  to_top_subsections(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'HDGS' && hdgn == 2) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    ///remove those arrays that are empty
    top = top.filter(o => {
      if( Array.isArray(o)) {
        return (o.length==0)?0:1;
      }
      return 1;
    })
    /// now process those sections
    top = top.map(o => {
      if (Array.isArray(o)) {
        o = this.to_top_subsubsections(o);
      }
      return o;
    })
    return top;
  }
  to_top_subsubsections(blocks) {
    var top = [];
    var o = top;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'HDGS' && hdgn >= 3) {
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    return top;
  }
}
module.exports = { NitrilePreviewPaper }
