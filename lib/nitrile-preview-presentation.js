'use babel';

class NitrilePreviewPresentation {

  constructor(translator) {
    this.translator = translator;
    this.eid = new Map(); //exercise ID
  }

  to_top(contents) {
    var holder = this.to_holder(contents,1);
    holder.sections = holder.sections.map((o) => this.to_holder(o,2));
    return holder;
  }
  to_holder(blocks,hdgn) {
    var holder = {};
    holder.blocks = [];   
    holder.sections = [];
    for (let block of blocks) {
      if (block.sig == 'HDGS' && block.hdgn == hdgn) {
        var o = [block];
        holder.sections.push(o);
        continue;
      }
      if(holder.sections.length){
        var o = holder.sections.pop();
        o.push(block);
        holder.sections.push(o);
      }else{
        holder.blocks.push(block);
      }
    }
    return holder;
  }
  to_frame(blocks) {
    ///to tops
    var tops = [];
    var o = tops;
    for (let block of blocks) {
      if(block.sig=='PRIM'){
        o = [];
        tops.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    ///the first block is always a HDGS
    let my = tops.shift();
    let title = my.title;
    let style = my.style;
    let re_ex_num = /^([A-Za-z]+\.)#(.*)$/i;
    let re_ex = /^([A-Za-z]+\.)(.*)$/i;
    let v;
    let isex = 0;
    let eid;
    let etitle;
    if((v=re_ex_num.exec(title))!==null){
      isex = 1;
      let prefix = v[1];
      if(this.eid.has(prefix)){
        eid = this.eid.get(prefix);
        eid += 1;
        this.eid.set(prefix,eid);
      }else{
        eid = 1;
        this.eid.set(prefix,eid);
      }
      title = `${v[1]}${eid}${v[2]}`
    }
    else if((v=re_ex.exec(title))!==null){
      isex = 1;
    }
    let contents = [];
    let solutions = [];
    tops.forEach((d, i) => {
      if (Array.isArray(d)) {
        let data = this.to_beamer_solution(d);
        solutions.push(data);
      } else {
        contents.push(d);
      }
    });
    var raw = title;
    return {isex,eid,title,style,raw,contents,solutions}
  }
  to_beamer_solution(o) {
    ///the first block in 'top' is a 'PRIM'
    let my = o.shift();
    let raw = my.title;
    let title = my.title;
    let style = my.style;
    let body = my.body;
    let contents = o;
    return {title,style,raw,contents,body};
  }
  to_beamer_topic(o) {
    ///the first block in 'top' is a 'HDGS'
    let my = o.shift();
    let title = my.title;
    let style = my.style;
    let contents = o;
    let text = '';
    return {title,style,contents,text};
  }
}
module.exports = { NitrilePreviewPresentation }
