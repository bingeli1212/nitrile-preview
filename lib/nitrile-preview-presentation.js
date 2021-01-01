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
    let re_ex = /^ex\.#\w*/i;
    let v;
    let eid;
    if((v=re_ex.exec(title))!==null){
      eid = ++this.eid;
      title = title.slice(v[0].length);
      title = `Ex.${eid} ${title}`;
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
    title = this.translator.unmask(title);
    return {title,eid,contents,solutions,topics}
  }
  to_beamer_solution(o) {
    ///the first block in 'top' is a 'PRIM'
    let my = o.shift();
    let title = this.translator.unmask(my.title);
    let contents = o;
    let selection = '';
    let ischeckbox = false;
    let raw = this.translator.join_para(my.body);
    let text = this.translator.unmask(raw);
    if(/^@\w/.test(raw)){
      ischeckbox = true;
      var regex = /@(\w)/g;
      var v;
      var all = [];
      while ((v = regex.exec(raw)) != null){
         all.push(v[1]);
      }
      selection = all.join(' ');
    }
    return {title,contents,text,ischeckbox,selection};
  }
  to_beamer_topic(o) {
    ///the first block in 'top' is a 'HDGS'
    let my = o.shift();
    let title = this.translator.unmask(my.title);
    let contents = o;
    let text = '';
    return {title,contents,text};
  }
}
module.exports = { NitrilePreviewPresentation }
