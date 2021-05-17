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
    this.style = parser.style;
    this.frames = 0;
    this.frameid = 0;
    this.eid = 0; //exercise ID
    this.presentation = new NitrilePreviewPresentation(this);
  }
  to_document() {
    //this.icon_keypoint = this.uncode(this.style,String.fromCodePoint(0x2756));//Black Diamond Minus White X
    //this.icon_exercise = this.uncode(this.style,String.fromCodePoint(0x270E));//Down Right Pencil
    //this.icon_folder   = this.uncode(this.style,String.fromCodePoint(0x27A5));//Heavy Black Curved Downwards and Rightwards Arrow
    //this.icon_solution = this.uncode(this.style,String.fromCodePoint(0x270D));//Writing Hand
    this.icon_keypoint = this.uncode(this.style,String.fromCodePoint(0x262F));//YINYANG SIGN
    this.icon_exercise = this.uncode(this.style,String.fromCodePoint(0x2605));//filled black star
    this.icon_folder   = '';
    this.icon_solution = '{\\symbol[martinvogel 2][WritingHand]}';
    var style_setupbodyfont = this.conf_to_string('creamer.setupbodyfont','linux,11pt');
    var style_setupwhitespace = this.conf_to_string('creamer.setupwhitespace','5pt');
    ///process the document
    var body = this.to_body();
    return     `\
%!TEX program = ConTeXt (LuaTeX)
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_fontsizes()}
${this.to_preamble_essentials()}
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
\\setuphead[subsection][style=\\bfxxsm,number=no,continue=yes,before={}]
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
        let out = this.write_frame_folder(topframe,subframes);
        all_main.push(out);
        subframes.forEach((subframe) => {
          let out = this.write_frame(subframe);
          all_main.push(out);
        });
      }else{
        let out = this.write_frame(topframe);
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
    all.push(`\\startitemize[packed,joinedup]`);      
    topframes.forEach((topframe,i,arr) => {
      let icon = this.icon_keypoint;
      if(topframe.subframes){
        icon = this.icon_folder;
      }else if(topframe.isex){
        icon = this.icon_exercise;
      }
      all.push(`\\sym {${icon}} ${this.uncode(topframe.style,topframe.title)}`);
    });
    all.push(`\\stopitemize`);    
    var text = all.join('\n')
    ///ASSEMBLE
    all = [];
    all.push('');
    all.push(`\\startsection[title={Table Of Contents},bookmark={Table Of Contents}]`);
    //all.push(`\\startsubsection[title={}]`);    
    all.push(text);
    all.push(`\\stopsection`)
    text = all.join('\n');
    return text;
  }
  write_frame_folder(frame,subframes){
    let all = [];
    all.push('');
    all.push(`\\startsection[title={${this.icon_folder} ${this.uncode(frame.style,frame.title)}},bookmark={${frame.raw}}]`); 
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })   
    all.push('');
    all.push('\\startitemize[packed,joinedup]');
    subframes.forEach((subframe,i,arr) => {
      let icon = subframe.isex?this.icon_exercise:this.icon_keypoint;
      all.push(`\\sym {${icon}} ${this.uncode(subframe.style,subframe.title)}`);
    });  
    all.push(`\\stopitemize`);
    all.push(`\\stopsection`) 
    var text = all.join('\n');
    return text;
  }
  write_frame(frame) {
    let all = [];
    if(1){
      ///
      ///main slide
      ///
      all.push('');
      let icon = frame.isex?this.icon_exercise:this.icon_keypoint;
      all.push(`\\startsection[title={${icon} ${this.uncode(frame.style,frame.title)}},bookmark={${frame.raw}}]`); 
      //all.push(`\\startsubsection[title={}]`);
      frame.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })     
      all.push('\\startitemize[packed,joinedup]');
      frame.solutions.forEach((o,i,arr) => {
        all.push(`\\sym {${this.icon_solution}} {\\it ${this.uncode(o.style,o.title)}} `);
      })
      all.push('\\stopitemize')
      all.push(`\\stopsection`);
      all.push('');
    }
    ///
    ///solution slides
    ///
    frame.solutions.forEach((o,i,arr) => {     
      all.push('');
      let icon = frame.isex?this.icon_exercise:this.icon_keypoint;
      all.push(`\\startsection[title={${icon} ${this.uncode(frame.style,frame.title)}},bookmark={${frame.raw} - ${o.raw}}]`); 
      all.push(`\\startsubsection[title={{\\it ${this.uncode(o.style,o.title)}} ~ ${this.untext(o.style,o.body).trim()}},bookmark={}]`);
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
    var block = this.parser.blocks[0];
    var style = this.parser.style;
    var title = this.conf_to_string('title','Untitled');
    var subtitle = this.conf_to_string('subtitle')
    var institute = this.conf_to_string('institute')
    var author = this.conf_to_string('author')
    var date = new Date().toLocaleDateString();  
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
  lang_to_cjk(s,fn){
    return s;
  }
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
  }

}
module.exports = { NitrilePreviewCreamer }
