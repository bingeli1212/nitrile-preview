'use babel';

class NitrilePreviewPresentation {

  constructor(translator) {
    this.translator = translator;
    this.eid = 0; //exercise ID
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
    let re_ex = /^(ex\.#)(.*)$/i;
    let v;
    let eid;
    let etitle;
    if((v=re_ex.exec(title))!==null){
      eid = ++this.eid;
      etitle = v[2];
      title = `Ex. ${etitle}`;
    }
    let contents = [];
    let solutions = [];
    let topics = [];
    tops.forEach((d, i) => {
      if (Array.isArray(d)) {
        let data = this.to_beamer_solution(d);
        solutions.push(data);
      } else {
        contents.push(d);
      }
    });
    title = this.translator.uncode(title);
    etitle = this.translator.uncode(etitle);
    return {title,eid,etitle,contents,solutions,topics}
  }
  to_beamer_solution(o) {
    ///the first block in 'top' is a 'PRIM'
    let my = o.shift();
    let title = this.translator.uncode(my.title);
    let style = my.style;
    style.user = 'isframesubtitle';
    let text = this.translator.untext(my.body,style);
    let contents = o;
    return {title,contents,text};
  }
  to_beamer_topic(o) {
    ///the first block in 'top' is a 'HDGS'
    let my = o.shift();
    let title = this.translator.uncode(my.title);
    let contents = o;
    let text = '';
    return {title,contents,text};
  }
}
module.exports = { NitrilePreviewPresentation }
