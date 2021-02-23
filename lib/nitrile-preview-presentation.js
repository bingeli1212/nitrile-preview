'use babel';

class NitrilePreviewPresentation {

  constructor(translator) {
    this.translator = translator;
    this.eid = 0; //exercise ID
  }

  to_tops(blocks) {
    var top = [];
    var o = null;
    for (let block of blocks) {
      let { sig, hdgn } = block;
      if (sig == 'FRNT'){
        top.push(block);
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
    top = top.map(o => {

      if (Array.isArray(o)) {
        o = this.to_solutions(o);
      }
      return o;
    })
    return top;
  }
  to_solutions(blocks) {
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
      if(sig=='PRIM'){
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      o.push(block);
    }
    return top;
  }
  to_frames(top) {
    let frames = [];
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        let frame = this.to_one_frame(o);
        frames.push(frame);
      }
    });
    return frames;
  }
  to_one_frame(o){
    let my = o.shift();
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
    o.forEach((d, i) => {
      if (Array.isArray(d)) {
        if(d[0].sig=='PRIM'){
          let data = this.to_beamer_solution(d);
          solutions.push(data);
        }else if(d[0].sig=='HDGS'){
          let data = this.to_beamer_topic(d);
          topics.push(data);
        }
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
