'use babel';

const { NitrilePreviewHtml } = require('./nitrile-preview-html');

class NitrilePreviewSlide extends NitrilePreviewHtml {

  constructor(parser) {
    super(parser);
    this.frames = 0;
    this.ending = '';
    this.my_frameid = 0;
    this.example_id = 0;///example id
    this.exercise_id = 0;///exercise id
    this.homework_id = 0;///homework id
    this.frame_id = 0;///frame_id
  }
  do_HDGS(block){
    let {hdgn} = block;
    ///reset the this.enumerate_counter if 'hdgn' is zero
    if(hdgn==1){
      this.enumerate_counter = 0;
    }
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
    //var fontfamily = this.conf('slide.font-family','serif');
    var fontfamily = '';
    var fontsize = this.conf('slide.font-size','12pt');
    var lineheight = this.conf('slide.line-height','1.13');
    var topmargin = '5pt';
    var paddingleftplst = '0.75cm';
    if(1){
      var the_slides = [];
      var html = this.to_beamer(top);
      var margintop = '10px';
      var button_html='';
    }else{
      var the_slides = [];
      var html = this.to_beamer(top);
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

    @page {
      size: 128mm 96mm;
    }  

    .slide {
      page-break-after: always;
      background-color: white;
      font-family:${fontfamily};
      font-size:${fontsize};
      line-height: ${lineheight};
      margin: auto auto;
      padding:${margintop} 36px ${margintop} 36px;
      min-width:100%;
      max-width:100%;
      min-height:100%;
      max-height:100%;
      box-sizing:border-box;
    }

    main {
      margin:0;
      padding:0;
    }

  }


  @media screen {

    .slide {
      background-color: white;
      font-family:${fontfamily};
      font-size:${fontsize};
      line-height: ${lineheight};
      margin: 1em auto;
      padding:${margintop} 36px ${margintop} 36px;
      min-width:128mm;
      max-width:128mm;
      min-height:96mm;
      max-height:96mm;
      box-sizing:border-box;
    }

    main {
      background-color: gray;
      box-sizing:border-box;
      padding:1px 0;
    }

  }

  body {
    margin:0;
    padding:0;
  }

  table {
    border-collapse:collapse;
  }

  .slide.active {
  }

  .slide .frontmattertitle {
    font-size: 1.3em;
    color: #1010B0;
  }

  .slide h2.frametitle {
    margin-left:-22px;
    margin-top:0;
    margin-bottom:0.3em;
    font-size:1.3em;
    font-weight:normal;
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
  .slide div.TEXT.QUOTE {
    font-style: italic;
  }
  .slide div.TEXT.QUOTE::before {
    content: "\\201C";
  }
  .slide div.TEXT.QUOTE::after {
    content: "\\201D";
  }
  
  .slide ul.PLST {
    position: relative;
    list-style: none;
  }
  .slide ul.PLST > li.PLST::before {
    content: "\\25B8";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(20px,0) scale(2,0.8);
  }
  .slide ul.PLST > li.PLST.SOLUTION::before {
    content: "\\25BE";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(20px,0) scale(1,2);
  }
  .slide ul.PLST > li.PLST.TOPIC::before {
    content: "\\2013";
    position: absolute;
    display: inline-block;
    right: 100%;
    transform: translate(20px,0);
  }

  .slide > ul.PLST > li.PLST {
    margin: ${topmargin} 0;
  }
  .slide > ul.PLST > ul.PLST {
    font-size: 96%;
    margin: ${topmargin} 0;
  } 
  .slide > ul.PLST > ol.PLST {
    font-size: 96%;
    margin: ${topmargin} 0;
  }
  .slide ul.PLST {
    margin: 0;
    padding-left: ${paddingleftplst};
  }

  .slide > ol.PLST > li.PLST {
    margin: ${topmargin} 0;
  }
  .slide > ol.PLST > ul.PLST {
    font-size: 96%;
    margin: ${topmargin} 0;
  } 
  .slide > ol.PLST > ol.PLST {
    font-size: 96%;
    margin: ${topmargin} 0;
  }
  .slide ol.PLST {
    margin: 0;
    padding-left: ${paddingleftplst};
  }



  .slide > dl.PLST > dt.PLST {
    margin: ${topmargin} 0;
  }
  .slide > dl.PLST > dd.PLST {
    padding-left: ${paddingleftplst};
  }
  .slide dl.PLST {
    margin: 0;
  }

  .slide > div.TEXT {
    margin: ${topmargin} 0;
  }
  .slide div.TEXT.NSPACE {
    padding-left: ${paddingleftplst};
  }

  .slide > div.SAMP {
    margin: ${topmargin} 0;
    padding-left: ${paddingleftplst};
    font-size: 96%;
  }

  .slide figure {
    margin: ${topmargin} 0;
  }
  .slide div.TEXT {
    margin: ${topmargin} 0;
  }
  .slide div.BULL .ITEM {
    margin-left: 0.75cm;
    text-indent: -0.75cm;
  }

  .slide div.TEXT.MULTI .RIFT {
    padding-top: 0.3em;
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
    var hdgs_count = 0;
    for(let block of blocks){
      let {sig,hdgn} = block;
      if(sig=='HDGS' && hdgn==2){
        o = [];
        top.push(o);
        o.push(block);
        hdgs_count++;
        continue;
      }
      if(hdgs_count==0 && sig=='PRIM'){
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
  to_beamer(top) {
    let frames = [];
    top.forEach((o, i) => {
      if (Array.isArray(o)) {
        let frame = this.to_beamer_frame(o);
        frames.push(frame);
      }
    });
    ///export frames
    let outs = [];
    frames.forEach((frame) => {
      let out = this.write_frame(frame);
      outs.push(out);
    });
    return outs.join('\n');
  }
  to_beamer_frame(o){
    let my = o.shift();
    let title = my.title;
    let re_ex = /^ex\.#\w*/i;
    let v;
    let eid;
    if((v=re_ex.exec(title))!==null){
      eid = ++this.eid;
      title = title.slice(v[0].length);
      title = `Ex.${eid}/${this.eid} ${title}`;
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
    title = this.unmask(title);
    return {title,eid,contents,solutions,topics}
  }
  to_beamer_solution(o) {
    ///the first block in 'top' is a 'PRIM'
    let my = o.shift();
    let title = this.unmask(my.title);
    let contents = o;
    let text = '';
    text = this.unmask(this.join_para(my.body));
    return {title,contents,text};
  }
  to_beamer_topic(o) {
    ///the first block in 'top' is a 'HDGS'
    let my = o.shift();
    let title = this.unmask(my.title);
    let contents = o;
    let text = '';
    return {title,contents,text};
  }
  write_frame(frame){
    let all = [];
    //let my_id = this.get_refmap_value(my.style,'idnum');
    let title = frame.title;
    let box = '&#x2610;'
    let cbox = '&#x2611;'
    let rtri = '&#x25B8;'
    let dtri = '&#x25BE;'
    let checkmark = '&#x2713;'
    let ndash = '&#x2013;'
    let sigs = [];
    ///main slide
    all.push(`<section class='slide'>`);
    all.push(`<h2 class='frametitle'>${++this.my_frameid} &#160; ${title} </h2>`);
    frame.contents.forEach((x,i) => {
      all.push('');
      all.push(x.html.trim());
    })
    frame.topics.forEach((o,i,arr) => {
      if(i==0){
        all.push(`<ul class='PLST'>`);
      }
      all.push(`<li class='PLST TOPIC' > ${o.title} </li>`);
      if(i+i==arr.length){
        all.push(`</ul>`);
      }
    });
    all.push('</section>');
    all.push('');
    ///topic slides
    frame.topics.forEach((o,i,arr) => {
      all.push(`<section class='slide'>`);
      all.push(`<h2 class='frametitle'>${++this.my_frameid} &#160; ${title} ${ndash} <i>${o.title}</i> </h2>`);
      o.contents.forEach((x,i) => {
        all.push(x.html.trim());
      });
      all.push(`</ul>`)
      all.push('</section>');
      all.push('');
    });
    ///solution-slides
    frame.solutions.forEach((o,i,arr) => {
      all.push(`<section class='slide'>`);
      all.push(`<h2 class='frametitle'>${++this.my_frameid} &#160; ${title} ${ndash} <u>${o.title}</u> </h2>`);
      if(o.text){
        all.push(`<div class='PLST SOLUTION'> <u>${o.title}</u> &#160; ${o.text} </div>`);
      }else{
        all.push(`<div class='PLST SOLUTION'> <u>${o.title}</u> </div>`);
      }
      o.contents.forEach((x,i) => {
        all.push('');
        all.push(x.html.trim());
      });
      all.push('</section>');
      all.push('');
    })
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
