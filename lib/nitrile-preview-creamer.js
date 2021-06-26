'use babel';

const { NitrilePreviewContex } = require('./nitrile-preview-contex');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');
const sect = '{\\S}';
const diamond = '{\\faDiamond}';
const envira = '{\\faEnvira}';
const leaf = '{\\faLeaf}';
const asterisk = '{\\faCertificate}';
const checkmark = '{\\faCheck}';
const pencil = '{\\faPencil}';
const leanpub = '{\\faLeanpub}'
const minus_square = '{\\faMinusSquare}'
const plus_square = '{\\faPlusSquare}';
const caret_down = '{\\faCaretDown}'
const caret_left = '{\\faCaretLeft}'
const caret_right = '{\\faCaretRight}'

class NitrilePreviewCreamer extends NitrilePreviewContex {

  constructor(parser) {
    super(parser);
    this.name = 'creamer';
    this.style = parser.style;
    this.frames = 0;
    this.frameid = 0;
    this.nbsp = String.fromCodePoint(160);
    this.icon_checkedbox = '{\\symbol[martinvogel 2][CheckedBox]}';
    this.icon_hollowbox = '{\\symbol[martinvogel 2][HollowBox]}';
    this.icon_keypoint = '{\\symbol[martinvogel 2][ComputerMouse]}';
    this.icon_subpoint = '{\\symbol[martinvogel 2][PointingHand]}';
    this.icon_solution = '{\\symbol[martinvogel 2][WritingHand]}';
    this.icon_folder   = '{\\symbol[martinvogel 2][Coffeecup]}';
    this.presentation = new NitrilePreviewPresentation(this);
  }
  to_document() {
    var style_setupbodyfont = this.conf_to_string('bodyfont','linux,11pt');
    var style_setupwhitespace = this.conf_to_string('whitespace','5pt');
    ///process the document
    var body = this.to_body();
    return     `\
%!TEX program = ConTeXt (LuaTeX)
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_fontsizes()}
${this.to_preamble_essentials()}
${this.to_preamble_langs()}
\\enabletrackers[fonts.missing]
\\definepapersize[BEAMER][width=128mm,height=96mm]
\\setuppapersize[BEAMER]
\\setuplayout[topspace=3mm,
             header=0mm,
             footer=0mm,
             height=90mm,
             width=115mm,
             backspace=6.5mm,
             leftmarginwidth=0mm, 
             rightmarginwidth=0mm, 
             leftmargindistance=0mm, 
             rightmargindistance=0mm]
\\setuppagenumbering[location={},style=]
\\setupindenting[no,medium]
\\setscript[hanzi] % hyphenation
\\definecolor[titleblue][r=0.0627,g=0.0627,b=0.6902]
\\setuphead[part][number=yes]
\\setuphead[chapter][style=\\bfd,number=yes]
\\setuphead[section][style=\\bfa,number=no,page=yes,margin=-3.5mm,color=titleblue,after={}]
\\setuphead[subsection][style=\\bfsm,number=no,continue=yes,before={}]
\\setuphead[subsubsection][style=\\bf,number=yes]
\\setuphead[subsubsubsection][style=\\bf,number=yes]
\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]
\\setupinteraction[state=start,color=,contrastcolor=]
\\placebookmarks[part,chapter,section];
\\setuplines[before={},after={}]
\\setuptabulate[before={},after={}]
\\setupbodyfont[${style_setupbodyfont}]
\\setupwhitespace[${style_setupwhitespace}]
\\setupcombination[style=small]
\\usesymbols[mvs]
\\starttext
${body.join('\n')}
\\stoptext
`;
  }
  to_body() {
    let top = this.presentation.to_top(this.parser.blocks);
    ///
    ///Process each section, and within each section the subsections
    ///
    var all_main = [];
    var topframes = [];
    top.sections.forEach((sect,i,arr) => {
      let topframe = this.presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        ///
        ///the subframes are build on the fly
        ///
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          let subframe = this.presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let out = this.write_frame_folder(`${i+1}`,topframe,subframes);
        all_main.push(out);
        subframes.forEach((subframe,j) => {
          let out = this.write_frame(`${i+1}.${j+1}`,subframe,1);
          all_main.push(out);
        });
      }else{
        let out = this.write_frame(`${i+1}`,topframe,0);
        all_main.push(out);
      }
    });
    var text_main = all_main.join('\n');
    //
    //table of contents
    //
    var text_toc = this.write_frame_toc(topframes);
    ///
    ///titlelines
    ///
    var text_titlepage = this.to_titlepage()
    //
    // put together
    //
    var all = [];
    all.push(text_titlepage)
    all.push(text_toc);
    all.push(text_main);
    return all;
  }
  write_frame_toc(topframes){
    let all = [];
    all.push('');
    all.push(`\\startsection[title={Table Of Contents},reference=toc,bookmark={Table Of Contents}]`);
    all.push(`\\startitemize[packed,joinedup]`);      
    topframes.forEach((topframe,i,arr) => {
      let icon = this.icon_keypoint;
      let title = this.uncode(topframe.style,topframe.title);
      let label = `${i+1}`;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`\\sym {${label}.} \\goto{${title} ${this.icon_folder}}[${label}]`);
      }else{
        all.push(`\\sym {${label}.} \\goto{${title}}[${label}]`);
      }
    });
    all.push(`\\stopitemize`);    
    all.push(`\\stopsection`)
    return all.join('\n');
  }
  write_frame_folder(id,frame,subframes){
    let all = [];
    all.push('');
    all.push(`\\startsection[title={${id}. ${this.uncode(frame.style,frame.title)} ${this.icon_folder}},reference=${id},bookmark={${id}. ${this.revise(frame.raw)}}]`); 
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })   
    all.push('');
    all.push('\\startitemize[packed,joinedup]');
    subframes.forEach((subframe,i,arr) => {
      let icon = this.icon_subpoint;
      let title = this.uncode(subframe.style,subframe.title);
      let label = `${id}.${i+1}`;
      all.push(`\\sym {${i+1}.} \\goto{${title}}[${label}]`);
    });  
    all.push(`\\stopitemize`);
    all.push(`\\stopsection`) 
    var text = all.join('\n');
    return text;
  }
  write_frame(id,frame,issub) {
    let all = [];
    let v = null;
    const re_choice = /^(.*?):([\w\/]+)$/;
    if(1){
      ///
      ///main slide
      ///
      all.push('');
      //let icon = issub?this.icon_subpoint:this.icon_keypoint;
      if(issub){
        all.push(`\\startsection[title={${id}. ${this.uncode(frame.style,frame.title)}},reference=${id},bookmark={${id}. ${this.revise(frame.raw)}}]`); 
      }else{
        all.push(`\\startsection[title={${id}. ${this.uncode(frame.style,frame.title)}},reference=${id},bookmark={${id}. ${this.revise(frame.raw)}}]`); 
      }
      //all.push(`\\startsubsection[title={}]`);
      frame.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })     
      frame.solutions.forEach((o,i,arr) => {
        all.push('')
        if((v=re_choice.exec(o.title))!==null){
          if(v[1]){
            all.push(`{${this.icon_solution}} {\\it ${this.uncode(o.style,v[1])}}`);
          }
          let text = this.to_choice(o.style,o.body);
          all.push(text);
        }else{
          all.push(`{${this.icon_solution}} {\\it ${this.uncode(o.style,o.title)}} `);
        }
      })
      all.push(`\\stopsection`);
      all.push('');
    }
    ///
    ///solution slides
    ///
    frame.solutions.forEach((o,i,arr) => {     
      all.push('');
      let icon = this.icon_solution;
      if((v=re_choice.exec(o.title))!==null){
        all.push(`\\startsection[title={${icon} \\it ${this.uncode(o.style,v[1])}},reference=${id}:${i},bookmark={${String.fromCodePoint(0x270D)} ${this.revise(v[1])}}]`); 
        let text = this.to_choice(o.style,o.body,v[2]);
        all.push(`\\startsubsection[title={${text}},bookmark={}]`);
      }else{
        all.push(`\\startsection[title={${icon} \\it ${this.uncode(o.style,o.title)}},reference=${id}:${i},bookmark={${String.fromCodePoint(0x270D)} ${this.revise(o.title)}}]`); 
        let text = this.untext(o.style,o.body).trim();
        all.push(`\\startsubsection[title={${text}},bookmark={}]`);
      }
      all.push('');
      o.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })
      all.push(`\\stopsubsection`);
      all.push(`\\stopsection`)
    });
    return all.join('\n');
  }
  to_titlepage(){
    var title      = this.parser.conf_to_string('title','Untitled');
    var subtitle   = this.parser.conf_to_string('subtitle')
    var institute  = this.parser.conf_to_string('institute')
    var author     = this.parser.conf_to_string('author')
    var style      = this.parser.style;
    var date       = new Date().toLocaleDateString();  
    var all = [];
    all.push(`\\dontleavehmode`);
    all.push(`\\blank[2cm]`);
    all.push(`\\startalignment[center]`);
    all.push(`\\tfc \\color[titleblue]{${this.uncode(style,title)}} `);
    all.push(`\\blank[1cm]`)
    all.push(`\\tfa ${this.uncode(style,subtitle)} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.uncode(style,institute)} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.uncode(style,author)} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.uncode(style,date)}`);
    all.push(`\\stopalignment`);
    all.push(`\\page`);
    all.push('');
    return all.join('\n')
  }
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
  }
  to_choice(style,body,check){
    body = body.filter((s) => s.length)
    var all = [];
    var re_word = /^(\w+)/;
    var v;
    var checks = check?check.split('/'):[];
    all.push('\\starttabulate[|l|]');
    body.forEach((s) => {
      var start;
      if((v=re_word.exec(s))!==null){
        start = v[1];
      }
      if(this.is_in_list(start,checks)){
        all.push(`\\NC ${this.icon_checkedbox} ${this.uncode(style,s)} \\NC\\NR`)
      }else{
        all.push(`\\NC ${this.icon_hollowbox} ${this.uncode(style,s)} \\NC\\NR`)
      }
    })
    all.push(`\\stoptabulate`)
    return all.join('\n')
  }
}
module.exports = { NitrilePreviewCreamer }
