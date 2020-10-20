'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.frames = 0;
    this.ending = '';
    this.question_id = 0;///question id
    this.example_id = 0;///example id
    this.exercise_id = 0;///exercise_id
  }
  to_slide_document() {
    ///do translate
    this.identify();
    this.translate();
    //putting them together
    var top = this.to_top(this.parser.blocks);
    var display = 'none';
    var margintop = '0';
    var marginbottom = '0';
    var fontfamily = this.conf('slide.font-family','sans-serif');
    var fontsize = this.conf('slide.font-size','11pt');
    var lineheight = this.conf('slide.line-height','1.38');
    if(1){
      var the_slides = [];
      var html = this.to_html(top,the_slides);
      var display = 'block';
      var margintop = '1em';
      var marginbottom = '1em';
      var button_html='';
    }else{
      var the_slides = [];
      var html = this.to_html(top,the_slides);
      var popups = this.to_html_popups(the_slides);
      var button_html=`\
      <div style='display:static'>
        <button onclick='prevslide()'>&#x25C2; prev</button>
        <button onclick='nextslide()'>next &#x25B8;</button>
        <select id='popup' onchange='popupslide(this.value)'>
          ${popups}
        </select>
      </div>`;
    }
    var data = `\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${this.unmask(this.conf('title'))}</title>
<style>

  @media print {
    section {page-break-after: always;}
  }

  @media print {

    @page {
      size: 128mm; 96mm;
    }  

  }

  table {
    border-collapse:collapse;
  }

  .slide {
    font-family:${fontfamily};
    font-size:${fontsize};
    line-height: ${lineheight};
    display: ${display};
    margin-top: ${margintop};
    margin-bottom: ${marginbottom};
    border:3px solid;
    padding:10px 32px 10px 32px;
    min-width:128mm;
    max-width:128mm;
    min-height:96mm;
    max-height:96mm;
  }

  .slide.active {
    display: block;
  }

  .slide .frontmattertitle {
    color: #1010B0;
  }

  .slide .frametitle {
    margin-left:-20px;
    margin-top:0;
    margin-bottom:0.5em;
    font-size:1.2em;
    color: #1010B0;
  }

  .slide ul.TEXT {
    padding-left: 20px;
    margin:0;
  }
  .slide ol.TEXT {
    padding-left: 20px;
    margin:0;
  }
  .slide dl.TEXT {
    margin:0;
  }
  
  .slide > ul.PLST > li.PLST {
    margin: 0.3em 0;
  }
  .slide > ul.PLST > li.PLST > div.TEXT {
    margin: 0 0;
  }
  .slide > ul.PLST > li.PLST > div.TEXT.NSPACE {
    margin-bottom: 0.3em;
  }
  .slide ul.PLST {
    padding-left: 28px;
    position: relative;
    list-style: none;
    margin: 0.3em 0;
  }
  .slide ul.PLST > li.PLST:before {
    content: "\\25B8";
    color: #1010B0;
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(21px,0);
  }
  .slide ul.PLST > li.PLST.ANSWER:before {
    content: "\\25BE";
    color: #1010B0;
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(21px,0);
  }

  .slide > ol.PLST > li.PLST {
    margin: 0.3em 0;
  }
  .slide > ol.PLST > li.PLST > div.TEXT {
    margin: 0 0;
  }
  .slide > ol.PLST > li.PLST > div.TEXT.NSPACE {
    margin-bottom: 0.3em;
  }
  .slide ol.PLST {
    padding-left: 28px;
    margin: 0.3em 0;
  }  

  .slide > dl.PLST > dt.PLST {
    margin: 0.3em 0;
  }
  .slide > dl.PLST > dd.PLST {
    margin: 0.3em 0;
    padding-left: 28px;
  }
  .slide > dl.PLST > dd.PLST > div.PLST {
    margin: 0.3em 0;
  }

  .slide > div.TEXT {
    margin: 0.3em 0;
  }
  .slide div.TEXT.NSPACE {
    padding-left: 28px;
  }

  .slide > div.SAMP {
    margin: 0.3em 0;
    padding-left: 28px;
    font-size: small;
  }

  .slide > figure {
    margin: 0.3em 0;
  }

</style>
<script>

var slides = []; 
var popup = null;
var index = 0;
window.addEventListener('load', function () {

  slides = document.querySelectorAll('.slide'); // Get an array of slides
  popup = document.querySelector('select#popup');  

  slides[index].classList.add('active');  
    
});

var nextslide = () => {
  if(slides.length){
    slides[index].classList.remove('active');
    
    //Go over each slide incrementing the index
    index++;
    
    // If you go over all slides, restart the index to show the first slide and start again
    if (index >= slides.length) index = slides.length-1; 
    
    slides[index].classList.add('active');
    popup.selectedIndex = index;
  }
};

var prevslide = () => {
  if(slides.length){
    slides[index].classList.remove('active');
    
    //Go over each slide incrementing the index
    index--;
    
    // If you go over all slides, restart the index to show the first slide and start again
    if (index < 0) index = 0;  
    
    slides[index].classList.add('active');
    popup.selectedIndex = index;
  }
};

var popupslide = (val) => {
  var slide = document.querySelector('#'+val+'.slide');
  if(slide && slides.length){
    slides[index].classList.remove('active');
  
    for(let i=0; slide && i < slides.length; ++i){
      let one = slides[i];
      if(one === slide){
        index = i;
        break;
      }   
    }   
    slides[index].classList.add('active');
  }
};

</script>
</head>
<body>
<main>
${html}
</main>
${button_html}
</body>
</html>
`;
    return data;
  }
  to_top(blocks){
    var top = [];
    var o = null;
    for(let block of blocks){
      let {sig,hdgn} = block;
      if(sig=='FRNT'){
        top.push(block);
        continue;
      }
      if(sig=='HDGS' && hdgn==1){
        o = [];
        top.push(o);
        o.push(block);
        continue;
      }
      if(o){
        o.push(block);
      }
    }
    top = top.map( o => {
      if(Array.isArray(o)){
        o = this.to_solutions(o);        
      }
      return o;
    })
    return top;
  } 
  to_solutions(blocks){
    var top = [];
    var o = top;
    for(let block of blocks){
      let {sig,hdgn} = block;
      if(sig=='HDGS' && hdgn==2){
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
  to_html_popups(the_slides){
    let d = [];
    the_slides.forEach(({id,idnum,title},i) => {
      d.push(`<option value='slide${id}'>${idnum} ${title}</option>`);
    });
    return d.join('\n');
  }
  to_html(top,the_slides){
    let d = [];
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        let data = this.to_html_frame(o,the_slides);
        d.push(data);
      }
      if(o.sig=='FRNT'){
        let data = this.to_frontmatter_frame(o,the_slides);
        d.push(data);
      }
    });
    return d.join('\n');
  }
  to_html_frame(top,the_slides){
    let my = top.shift();
    let d = [];
    let w = [];
    let all = [];
    let my_id = this.get_refmap_value(my.style,'idnum');
    let my_title = my.title;
    let my_qid = '';
    let re_question = /^(question):(.*)$/i;
    let re_example = /^(example):(.*)$/i;
    let re_exercise = /^(exercise):(.*)$/i;
    let v;
    ///EXPERIMENT:
    my_id = '';
    let my_type = '';
    if((v=re_question.exec(my.title))!==null){
      my_qid = ++this.question_id;
      my_title = `${v[1]} #${my_qid}:${v[2]}`
      my_type = 'question';
    }
    if((v=re_example.exec(my.title))!==null){
      my_qid = ++this.example_id;
      my_title = `${v[1]} #${my_qid}:${v[2]}`
      my_type = 'example';
    }
    if((v=re_exercise.exec(my.title))!==null){
      my_qid = ++this.exercise_id;
      my_title = `${v[1]} #${my_qid}:${v[2]}`
      my_type = 'exercise';
    }
    my_title = this.unmask(my_title);
    let box = '&#x2610;'
    let cbox = '&#x2612;'
    let rtri = '&#x25B8;'
    let dtri = '&#x25BE;'
    let sig = '';
    //d.push(`<h2 class='frametitle'>${mid} ${mtitle}</h2>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        var data = this.to_html_solution(o);
        sig = data.sig;
        w.push(data);
      }else{
        d.push(o.html);
      }
    });
    if(
    my_type=='example'||
    my_type=='question'||
    my_type=='exercise'){
      ///multiple solutions
      ///1st slide
      all.push(`<section id='slide${my_id}' class='slide'>`);
      all.push(`<h2 class='frametitle'>${my_id} ${my_title}</h2>`);
      all.push(d.join('\n'));///main-slide contents text
      all.push(`<ul class='PLST'>`);
      w.forEach((o, i) => {
        all.push(`<li class='PLST'> ${o.title} </li>`);
      });
      all.push(`</ul>`);
      all.push('</section>');
      all.push('');
      the_slides.push({id:my_id,idnum:my_id,title:my_title});
      ///2nd, 3rd, ...
      w.forEach((o,i) => {
        let sid = `${my_id}-${i}`;
        all.push(`<section id='slide${sid}' class='slide'>`);
        all.push(`<h2 class='frametitle'>${my_id} ${my_title} <i>(${o.title})</i> </h2>`);
        all.push(d.join('\n'));///main-slide contents text
        all.push(`<ul class='PLST'>`);
        all.push(`<li class='PLST ANSWER'> <b><i>${o.title}</i></b> ${o.text.length?'-':''} ${o.text}`);
        o.contents.forEach(x => all.push(`${x.html}`));
        all.push(`</li>`)
        all.push(`</ul>`);
        all.push('</section>');
        all.push('');
        the_slides.push({id:sid,idnum:my_id,title:my_title});
      });
    }else{
      ///multiple topics
      ///main-slide
      all.push(`<section id='slide${my_id}' class='slide'>`);
      all.push(`<h2 class='frametitle'>${my_id} ${my_title}</h2>`);
      all.push(d.join('\n'));///main-slide contents text
      all.push(`<ul class='PLST'>`);
      w.forEach((o,i) => {
        all.push(`<li class='PLST'>${o.title}</li>`);
      });
      all.push(`</ul>`);
      all.push(`</section>`);
      all.push('');
      the_slides.push({id:my_id,idnum:my_id,title:my_title});
      ///child-slides
      w.forEach((o,i) => {
        let sid = `${my_id}-${i}`;
        all.push(`<section id='slide${sid}' class='slide'>`);
        all.push(`<h2 class='frametitle'>${my_id} ${my_title} (${o.title})</h2>`);
        all.push(d.join('\n'))
        all.push(`<ul class='PLST'>`);
        w.forEach((p,j) => {
          if(i==j){
            all.push(`<li class='PLST ANSWER'><b>${p.title}</b> ${p.text.length?'-':''} ${p.text}`);
            o.contents.forEach(x => all.push(`${x.html}`));
            all.push('</li>')
          }else{
            all.push(`<li class='PLST'>${p.title}</li>`);
          }
        });
        all.push(`</ul>`);
        all.push('</section>');
        all.push('');
        the_slides.push({id:sid,idnum:my_id,title:my_title});
      })
    }
    return all.join('\n');
  }
  to_html_solution(top) {
    let my = top.shift();
    let title = this.unmask(my.title);
    let contents = top;
    let text = '';
    let sig = my.sig;
    if(my.sig=='PRIM'){
      text = this.unmask(this.join_para(my.body));
    }
    return { title, contents, text, sig };
  }
  _to_html_frame_interactive(top){
    let my = top.shift();
    let idnum = this.get_refmap_value(my.style,'idnum');
    let d = [];
    let w = [];
    let all = [];
    d.push(`<h2 class='frametitle'>${idnum} ${this.unmask(my.title)}</h2>`);
    top.forEach((o,i) => {
      if(Array.isArray(o)){
        var data = this.to_html_solution(o);
        w.push(data);
      }else{
        d.push(o.html);
      }
    });
    if(d.length==1){
      ///multiple choices
      all.push(`<div id='slide${idnum}' class='slide'>`);
      all.push(d.join('\n'));
      all.push(`<ul>`);
      w.forEach(({title,contents},i) => {
        all.push(`<li>`);
        all.push(title);
        all.push(contents.map(x => x.html).join('\n'));
        all.push(`</li>`);
      });
      all.push(`</ul>`);
      all.push(`</div>`);
      all.push('');
    }else{
      ///multiple solutions
      all.push(`<div id='slide${idnum}' class='slide'>`);
      all.push(d.join('\n'));
      w.forEach(({ title, contents }, i) => {
        all.push(`<div>${title}</div>`);
        all.push(contents.map(x => x.html).join('\n'));
      });
      all.push(`</div>`);
      all.push('');
    }
    return all.join('\n');
  }
  _to_html_solution_interactive(top){
    let my = top.shift();
    let contents = [];
    //let title = `${this.unmask(my.title)} <button onclick="document.getElementById('${idnum}').hidden^=true">&#x2026;</button>`;
    let title = ` <button shown='false' onclick="document.getElementById('${idnum}').hidden^=true, this.shown^=true, this.innerHTML=this.shown?'&#x25BE;':'&#x25B8;'">&#x25B8;</button> ${this.unmask(my.title)}`;
    contents.push({html:`<div hidden='true' id='${idnum}'>`});
    top.forEach(o => {
      contents.push(o);
    });
    contents.push({html:`</div>`});
    return {title,contents};
  }
  to_frontmatter_frame(block,the_slides){
    let title = '';
    let subtitle = '';
    let institute = '';
    let author = '';
    if(block && block.sig=='FRNT'){
      for(let t of block.data){
        let [key,val] = t;
        if(key=='title'){
          title = val;
        }
        if(key=='subtitle'){
          subtitle = val;
        }
        if(key=='author'){
          author = val;
        }
        if(key=='institute'){
          institute = val;
        }
      }
    }
    let data = `<section id='frontmatter' class='slide'>
    <p class='frontmattertitle' style='text-align:center;font-weight:bold;font-size:1.5em'>${this.unmask(title)}</p>
    <p style='text-align:center'>${this.unmask(subtitle)}</p>
    <p style='text-align:center'>${this.unmask(author)}</p>
    <p style='text-align:center;font-variant:small-caps'>${this.unmask(institute)}</p>
    </section>
    `;
    the_slides.push({id:'frontmatter',idnum:'',title:'Intro'});
    return data;
  }
}
module.exports = { NitrilePreviewSlide };
