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
    this.frames = 0;
    this.frameid = 0;
    this.eid = 0; //exercise ID
    this.presentation = new NitrilePreviewPresentation(this);
  }
  to_document() {
    this.icon_keypoint = `{\\switchtobodyfont[zapfdingbats]❖}`;//U+2756 Black Diamond Minus White X
    this.icon_exercise = `{\\switchtobodyfont[zapfdingbats]✎}`;//U+270E Down Right Pencil
    this.icon_folder   = `{\\switchtobodyfont[zapfdingbats]➥}`;//U+27A5 Heavy Black Curved Downwards and Rightwards Arrow
    this.icon_solution = `{\\switchtobodyfont[zapfdingbats]✍}`;//U+270D Writing Hand
    ///process the document
    var body = this.to_body();
    return     `\
%!TEX program = ConTeXt (LuaTeX)
\\enabletrackers[fonts.missing]
\\definepapersize[BEAMER][width=128mm,height=96mm]
\\setuppapersize[BEAMER]
\\setuplayout[topspace=3mm,
             header=0mm,
             footer=0mm,
             height=90mm,
             width=108mm,
             backspace=10mm,
             leftmarginwidth=0mm, 
             rightmarginwidth=0mm, 
             leftmargindistance=0mm, 
             rightmargindistance=0mm]
\\setuppagenumbering[location={},style=]
\\setupindenting[no,medium]
\\setupwhitespace[small]
\\setscript[hanzi] % hyphenation
\\setuphead[part][number=yes]
\\setuphead[chapter][style=\\bfd,number=yes]
\\setuphead[section][style=\\bfa,number=no,page=yes,margin=-6mm,color=myblue,after={}]
\\setuphead[subsection][style=\\bfxxsm,number=no,continue=yes,before={}]
\\setuphead[subsubsection][style=\\bf,number=yes]
\\setuphead[subsubsubsection][style=\\bf,number=yes]
\\setupinteraction[state=start,color=,contrastcolor=]
\\enableregime[utf] % enable unicode fonts
\\definefontfamily[linuxlibertine][serif][linuxlibertineo]
\\definefontfamily[linuxlibertine][sans][linuxbiolinumo]
\\definefontfamily[linuxlibertine][tt][linuxlibertinemonoo]
\\definefontfamily[dejavu][serif][dejavuserif]
\\definefontfamily[dejavu][sans][dejavusans]
\\definefontfamily[dejavu][tt][dejavusansmono]
\\definefontfamily[noto][serif][notoserifnormal]
\\definefontfamily[noto][sans][notosansnormal]
\\definefontfamily[noto][tt][notosansmononormal]
\\definefontfamily[zapfdingbats][serif][zapfdingbats]
\\definefontfamily[zapfdingbats][sans][zapfdingbats]
\\definefontfamily[cn][serif][arplsungtilgb]
\\definefontfamily[cn][sans][arplsungtilgb]
\\definefontfamily[tw][serif][arplmingti2lbig5]
\\definefontfamily[tw][sans][arplmingti2lbig5]
\\definefontfamily[jp][serif][ipaexmincho]
\\definefontfamily[jp][sans][ipaexmincho]
\\definefontfamily[kr][serif][baekmukbatang]
\\definefontfamily[kr][sans][baekmukbatang]
\\definemathcommand [arccot] [nolop] {\mfunction{arccot}}
\\definemathcommand [arsinh] [nolop] {\mfunction{arsinh}}
\\definemathcommand [arcosh] [nolop] {\mfunction{arcosh}}
\\definemathcommand [artanh] [nolop] {\mfunction{artanh}}
\\definemathcommand [arcoth] [nolop] {\mfunction{arcoth}}
\\definemathcommand [sech]   [nolop] {\mfunction{sech}}
\\definemathcommand [csch]   [nolop] {\mfunction{csch}}
\\definemathcommand [arcsec] [nolop] {\mfunction{arcsec}}
\\definemathcommand [arccsc] [nolop] {\mfunction{arccsc}}
\\definemathcommand [arsech] [nolop] {\mfunction{arsech}}
\\definemathcommand [arcsch] [nolop] {\mfunction{arcsch}}
\\usemodule[ruby]
\\usesymbols[mvs]
\\setupcaptions[minwidth=\textwidth, align=middle, location=top]
\\setupinteraction[state=start]
\\placebookmarks[part,chapter,section]
\\definecolor[cyan][r=0,g=1,b=1] % a RGB color
\\definecolor[magenta][r=1,g=0,b=1] % a RGB color
\\definecolor[darkgray][r=.35,g=.35,b=.35] % a RGB color
\\definecolor[gray][r=.5,g=.5,b=.5] % a RGB color
\\definecolor[lightgray][r=.75,g=.75,b=.75] % a RGB color
\\definecolor[brown][r=.72,g=.52,b=.04] % a RGB color
\\definecolor[lime][r=.67,g=1,b=.18] % a RGB color
\\definecolor[olive][r=.5,g=.5,b=0] % a RGB color
\\definecolor[orange][r=1,g=.5,b=0] % a RGB color
\\definecolor[pink][r=1,g=.75,b=.79] % a RGB color
\\definecolor[teal][r=0,g=.5,b=.5] % a RGB color
\\definecolor[purple][r=.8,g=.13,b=.13] % a RGB color
\\definecolor[violet][r=.5,g=0,b=.5] % a RGB color
\\definecolor[myblue][r=.04,g=.04,b=.7] % a RGB color
\\definedescription[latexdesc][
  headstyle=normal, style=normal, align=flushleft, 
  alternative=hanging, width=fit, before=, after=]
\\definedescription[DL][
  headstyle=bold, style=normal, align=flushleft, 
  alternative=hanging, width=broad]
\\definedescription[HL][
  headstyle=normal, style=normal, align=flushleft, 
  alternative=hanging, width=broad]
\\definefontsize[sm]
\\definefontsize[xsm]
\\definefontsize[xxsm]
\\definefontsize[xxxsm]
\\definefontsize[big]
\\definefontsize[xbig]
\\definefontsize[xxbig]
\\definefontsize[huge]
\\definefontsize[xhuge]
\\definebodyfontenvironment
  [default]
  [sm=.9,xsm=.8,xxsm=.7,xxxsm=.5,
   big=1.2,xbig=1.4,xxbig=1.7,huge=2.0,xhuge=2.3]
\\definefloat[listing][listings]
\\setupbodyfont[11pt]
\\setupcombination[style=small]
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
      all.push(`\\sym {${icon}} ${topframe.title}`);
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
    all.push(`\\startsection[title={${this.icon_folder} ${frame.title}},bookmark={${frame.raw}}]`); 
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
      all.push(`\\sym {${icon}} ${subframe.title}`);
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
      all.push(`\\startsection[title={${icon} ${frame.title}},bookmark={${frame.raw}}]`); 
      //all.push(`\\startsubsection[title={}]`);
      frame.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })     
      all.push('\\startitemize[packed,joinedup]');
      frame.solutions.forEach((o,i,arr) => {
        all.push(`\\sym {${this.icon_solution}} {\\it ${o.title}} `);
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
      all.push(`\\startsection[title={${icon} ${frame.title}},bookmark={${frame.raw} - ${o.raw}}]`); 
      all.push(`\\startsubsection[title={{\\it ${o.title}} ~ ${this.untext(o.body,o.style).trim()}},bookmark={}]`);
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
    var style = {};
    var title = this.conf_to_string('title','Untitle');
    var subtitle = this.conf_to_string('subtitle')
    var institute = this.conf_to_string('institute')
    var author = this.conf_to_string('author')
    var date = new Date().toLocaleDateString();  
    var all = [];
    all.push(`\\dontleavehmode`);
    all.push(`\\blank[2cm]`);
    all.push(`\\startalignment[center]`);
    all.push(`\\tfd \\color[myblue]{${this.uncode(title,style)}} \\crlf`);
    all.push(`\\blank[1cm]`)
    all.push(`\\tfa ${this.uncode(subtitle,style)} \\crlf`);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.uncode(institute,style)} \\crlf`);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.uncode(author,style)} \\crlf`);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.uncode(date,style)}`);
    all.push(`\\stopalignment`);
    all.push(`\\page`);
    all.push('');
    return all.join('\n')
  }
}
module.exports = { NitrilePreviewCreamer }
