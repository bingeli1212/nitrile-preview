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
    // this.icon_hollowbox = String.fromCodePoint(0x2610); //BALLOT BOX WITH CHECK
    // this.icon_checkedbox = String.fromCodePoint(0x2611); //BALLOT BOX            
    // this.icon_solution = String.fromCodePoint(0x270D);
    //this.icon_folder   = String.fromCodePoint(0x2615);           
    //this.icon_hollowbox = '{\\symbol[martinvogel 2][HollowBox]}';
    //this.icon_checkedbox = '{\\symbol[martinvogel 2][CheckedBox]}';
    //this.icon_solution = '{\\symbol[martinvogel 2][WritingHand]}';
    this.icon_coffeecup = '{\\symbol[martinvogel 2][Coffeecup]}';
    this.icon_writinghand = '{\\symbol[martinvogel 2][WritingHand]}';
    this.icon_hollowbox = '{\\square}'; 
    this.icon_checkedbox = '{\\blacksquare}';             
    this.s_ad = String.fromCodePoint(0xAD);
    this.presentation = new NitrilePreviewPresentation(this);
    this.contex_bodyfont = 'dejavu,10pt,ss';
    this.contex_interlinespace = 'line=11.5pt';
    this.contex_whitespace = '5pt';
    this.contex_indenting = 'no';
    this.contex_papersize = 'BEAMER';
    this.contex_caption_align = 'c';
    this.contex_caption_small = 1;
  }
  to_document() {
    ///process the document
    var body = this.to_body();
    return     `\
% !TEX program = ConTeXt (LuaTeX)
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_essentials()}
${this.to_preamble_caption()}
${this.to_preamble_definecolors()}
${this.to_preamble_langs()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\setupbodyfont[dejavu,10pt,ss]
\\setupinterlinespace[line=12.0pt]
\\setupwhitespace[5pt]
\\setupindenting[no]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definepapersize[BEAMER][width=128mm,height=96mm]
\\setuppapersize[BEAMER]                           
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\enabletrackers[fonts.missing]
\\setuppagenumbering[location={header,right},style=]
\\setuplayout[topspace=2mm,
             header=0mm,
             footer=0mm,
             height=93mm,
             width=110mm,
             backspace=9.5mm,
             leftmarginwidth=0mm, 
             rightmarginwidth=0mm, 
             leftmargindistance=0mm, 
             rightmargindistance=0mm]
\\definecolor[titleblue][r=0.0627,g=0.0627,b=0.6902]
\\setuphead[part][number=yes]
\\setuphead[chapter][style=bfd,number=yes]
\\setuphead[section][style=tfb,number=no,page=yes,margin=-7mm,color=titleblue,before={},after={}]
\\setuphead[subsection][style=normal,number=no,continue=yes,before={},after={}]
\\setuphead[subsubsection][style=small,number=no,continue=yes,before={},after={}]
\\setuphead[subsubsubsection][style=normal,number=yes]
\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]
\\setupinteraction[state=start,color=,contrastcolor=]
\\placebookmarks[part,chapter,section]
\\setuplines[before={},after={}]
\\setuptabulate[before={},after={}]
\\usesymbols[mvs]
\\definelayer[mybg][x=0mm,y=0mm,width=\\paperwidth,height=\\paperheight]
\\setupbackgrounds[page][background=mybg]                               
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definefontfamily[cn][serif][arplsungtilgb]
\\definefontfamily[cn][sans][arplsungtilgb]
\\definefontfamily[cn][mono][arplsungtilgb]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definefontfamily[tw][serif][arplmingti2lbig5]
\\definefontfamily[tw][sans][arplmingti2lbig5]
\\definefontfamily[tw][mono][arplmingti2lbig5]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definefontfamily[jp][serif][ipaexmincho]
\\definefontfamily[jp][sans][ipaexmincho]
\\definefontfamily[jp][mono][ipaexmincho]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definefontfamily[kr][serif][baekmukbatang]
\\definefontfamily[kr][sans][baekmukbatang]
\\definefontfamily[kr][mono][baekmukbatang]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
          let id = `${i+1}.${j+1}`;
          let order = `${i+1}.${j+1}`;
          let icon = this.icon_coffeecup;
          let out = this.write_one_frame(id,order,icon,subframe,1,topframe);
          all_main.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = `${i+1}`;
        let icon = ``;
        let out = this.write_one_frame(id,order,icon,topframe,0,topframe);
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
    let n = 0;
    var max_n = 16;
    all.push('');
    topframes.forEach((topframe,i,arr) => {
      if(n==max_n){
        all.push(`\\stopitemize`);    
        all.push(`\\stopsection`)
        all.push('');
        n=0;
      }
      if(n==0){
        all.push(`\\startsection[title={Table Of Contents},reference=toc,bookmark={Table Of Contents}]`);
        all.push(`\\godown[+0.40cm]`)
        all.push(`\\startitemize[packed]`);      
      }
      let title = this.uncode(topframe.style,topframe.title);
      let label = `${i+1}`;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`\\sym {${label}} \\goto{${title}}[${label}]`);
      }else{
        all.push(`\\sym {${label}} \\goto{${title}}[${label}]`);
      }
      n++;
    });
    all.push(`\\stopitemize`);    
    all.push(`\\stopsection`)
    all.push('');
    return all.join('\n');
  }
  write_frame_folder(id,frame,subframes){
    let all = [];
    all.push('');
    all.push(`\\startsection[title={${id} ${this.uncode(frame.style,frame.title)}},reference=${id},bookmark={${id}. ${frame.raw}}]`); 
    all.push(`\\godown[+0.40cm]`)
    ///
    ///NOTE: vertical adjustment
    ///
    all.push(`\\godown[-0.02cm]`);
    ///
    ///NOTE: contents
    ///
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })   
    all.push('');
    all.push('\\startitemize[packed,joinedup]');
    subframes.forEach((subframe,i,arr) => {
      let icon = this.icon_coffeecup;
      let title = this.uncode(subframe.style,subframe.title);
      let label = `${id}.${i+1}`;
      all.push(`\\sym {\\underbar ${title}}`);
    });  
    all.push(`\\stopitemize`);
    all.push(`\\stopsection`) 
    var text = all.join('\n');
    return text;
  }
  write_one_frame(id,order,icon,frame,issub,topframe) {
    let all = [];
    let v = null;
    if(1){
      ///
      ///main slide
      ///
      all.push('');
      if(issub){
        let icon = this.icon_coffeecup;
        all.push(`\\startsection[title={${order} ${this.uncode(topframe.style,topframe.title)}},reference=${id},bookmark={${order} ${frame.raw}}]`); 
        all.push(`\\godown[-0.20cm]`)
        all.push(`\\startsubsubsection[title={{\\underbar ${this.uncode(frame.style,frame.title)}}},reference=,bookmark=]`); 
        order = '';
      }else{
        let icon = '';
        all.push(`\\startsection[title={${order} ${this.uncode(topframe.style,topframe.title)}},reference=${id},bookmark={${order}. ${topframe.raw}}]`); 
        all.push(`\\godown[+0.40cm]`)
      }
      //all.push(`\\startsubsection[title={}]`);
      ///
      ///boardname
      ///
      if(frame.boardname){
        all.push(`\\setlayer[mybg][hoffset=0mm,voffset=0mm]{\\externalfigure[${frame.boardname}.png][width=114mm,height=80mm]}`);
        all.push(`\\flushlayer[mybg]`);
      }
      ///
      ///NOTE; adjust vertical
      ///
      all.push(`\\godown[-0.02cm]`);
      ///
      ///contents
      ///
      frame.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })     
      frame.solutions.forEach((o,i,arr) => {
        all.push('')
        if(o.choice){
          all.push(`{${this.icon_writinghand}} {\\it ${this.uncode(o.style,o.title)}}\\crlf`);
          let text = this.to_choice(o.style,o.body,'',false);
          all.push(text);
        }else{
          all.push(`{${this.icon_writinghand}} {\\it ${this.uncode(o.style,o.title)}}`);
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
      let icon = this.icon_writinghand;
      if(o.choice){
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice,true);
        all.push(`\\page`);//start a new page also make sure that this slide does not appear inside the bookmark section
        all.push(`\\dontleavehmode`);
        all.push(`\\blank[0.5cm]`);
        all.push(`\\startsubsection[title={${icon} {\\it{${title}}} \\small ${text}},reference=,bookmark={${icon} ${title}}]`);//empty 
        //all.push(`\\startsubsection[title={${text}},bookmark={}]`);
      }else{
        let title = this.uncode(o.style,o.title).trim();
        let text = this.uncode(o.style,this.join_para(o.body)).trim();
        all.push(`\\page`);//start a new page also make sure that this slide does not appear inside the bookmark section
        all.push(`\\dontleavehmode`);
        all.push(`\\blank[0.5cm]`);
        all.push(`\\startsubsection[title={${icon} {\\it{${title}}} \\small ${text}},reference=,bookmark={${icon} ${title}}]`);//empty 
        //all.push(`\\startsubsection[title={${text}},bookmark={}]`);
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
    all.push(`\\tfc \\color[titleblue]{${this.smooth(title)}} `);
    all.push(`\\blank[1cm]`)
    all.push(`\\tfa ${this.smooth(subtitle)} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.smooth(institute)} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.smooth(author)} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.smooth(date)}`);
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
  to_choice(style,body,check,usetabulate){
    body = body.filter((s) => s.length)
    var all = [];
    var re_word = /^(\w+)/;
    var v;
    var checks = check?check.split('/'):[];
    if(usetabulate){
      //use starttabulate
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
    }else{
      //use line breaks
      body.forEach((s) => {
        var start;
        if((v=re_word.exec(s))!==null){
          start = v[1];
        }
        if(this.is_in_list(start,checks)){
          all.push(`${this.icon_checkedbox} ${this.uncode(style,s)}\\crlf`)
        }else{
          all.push(`${this.icon_hollowbox} ${this.uncode(style,s)}\\crlf`)
        }
      })
    }
    return all.join('\n')
  }
}
module.exports = { NitrilePreviewCreamer }
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
const { NitrilePreviewBase } = require('./nitrile-preview-base');
class Server extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    var fname = process.argv[2];    
    var oname = process.argv[3];    
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.tex'){
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname);
      await parser.read_import_async();
      var texfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
      if(oname){
        texfile = oname;
      }
      var translator = new NitrilePreviewCreamer(parser);
      var data = translator.to_document();
      await this.write_text_file(fs,texfile,data);
      console.log(`written to ${texfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new Server();
  server.run();
}
