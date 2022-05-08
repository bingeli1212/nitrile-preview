'use babel';
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');
class NitrilePreviewCreamer extends NitrilePreviewContex {
  constructor(parser) {
    super(parser);
    this.name = 'creamer';
    this.style = parser.style;
    this.frames = 0;
    this.frameid = 0;
    this.s_ad = String.fromCodePoint(0xAD);
    this.presentation = new NitrilePreviewPresentation(this);
    this.bodyfontsuit = this.assert_string(this.bodyfontsuit,'dejavu');
    this.bodyfontvariant = this.assert_string(this.bodyfontvariant,'ss');
    this.bodyfontsize = this.assert_float(this.bodyfontsize,10);
    this.contex_bodylineheight = 1.15;
    this.contex_whitespacesize = 5;
    this.contex_indenting = 'no';
    this.contex_caption_align = 'c';
    this.contex_caption_small = 1;
  }
  to_document() {
    ///process the document
    var body = this.to_body();
    return     `\
% !TEX program = context
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_definecolors()}
${this.to_preamble_langs()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\setscript[hanzi] % hyphenation
\\setupinteraction[state=start,color=,contrastcolor=]
\\placebookmarks[part,chapter]
\\setuphead[part][number=no]
\\setuphead[chapter][style=\bfd,number=no]
\\setuphead[section][style=\bfa,number=no]
\\setuphead[subsection][style=\bf,number=no]
\\setuphead[subsubsection][style=\bf,number=no]
\\setuphead[subsubsubsection][style=\bf,number=no]
\\definefloat[listing][listings]
\\definedescription[latexdesc][
  headstyle=normal, style=normal, align=flushleft,
  alternative=hanging, width=fit, before=, after=]
\\definedescription[DLpacked][
  headstyle=bold, style=normal, align=flushleft,
  alternative=hanging, width=broad, margin=20pt, before=, after=,]
\\definedescription[HLpacked][
  headstyle=normal, style=normal, align=flushleft, margin=1em,
  alternative=hanging, width=broad, before=, after=,]
\\definedescription[DL][
  headstyle=bold, style=normal, align=flushleft,
  alternative=hanging, width=broad, margin=20pt]
\\definedescription[HL][
  headstyle=normal, style=normal, align=flushleft, margin=1em,
  alternative=hanging, width=broad]
\\setupinterlinespace[line=11.5pt]
\\setupwhitespace[5pt]
\\setupindenting[no]
\\setupbodyfont[${this.bodyfontsuit},ss,10pt]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usesymbols[mvs]
%\\definesymbol[1][{\\symbol[martinvogel 1][MVRightArrow]}]
\\definesymbol[1][{\\symbol[martinvogel 2][Forward]}]
%\\definesymbol[1][{\\symbol[text][blacktriangle]}]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definepapersize[BEAMER][width=128mm,height=96mm]
\\setuppapersize[BEAMER]                           
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\enabletrackers[fonts.missing]
\\setuppagenumbering[location={header,right},style=]
\\setuplayout[topspace=2mm,
             header=0mm,
             footer=0mm,
             height=98mm,
             width=112mm,
             backspace=8mm,
             leftmarginwidth=0mm, 
             rightmarginwidth=0mm, 
             leftmargindistance=0mm, 
             rightmargindistance=0mm]
\\definecolor[titleblue][r=0.2,g=0.2,b=0.7]
\\setuphead[part][number=yes]
\\setuphead[chapter][style=bfd,number=yes]
\\setuphead[section][style=tfb,number=no,page=yes,margin=-5mm,color=titleblue,before={},after={}]
\\setuphead[subsection][style=normal,number=no,continue=yes,before={},after={}]
\\setuphead[subsubsection][style=small,number=no,continue=yes,before={},after={}]
\\setuphead[subsubsubsection][style=normal,number=yes]
\\setupcaptions[minwidth=\\textwidth, align=middle, style=small, location=top, number=yes, inbetween=]
\\setupcombination[distance=0.33em,style=small,inbetween=]
\\setupinteraction[state=start,color=,contrastcolor=]
\\placebookmarks[part,chapter,section]
\\setuplines[before={},after={}]
\\setuptabulate[before={},after={}]
\\definelayer[mybg][x=0mm,y=0mm,width=\\paperwidth,height=\\paperheight]
\\setupbackgrounds[page][background=mybg]       
\\definefloat[vignette][figure]
\\setupfloat[vignette][margin=10pt,default={none,low}]
\\setupcaption[vignette][number=no]                         
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
        let id = `${i+1}`;
        let out = this.write_frame_folder(id,topframe,subframes);
        all_main.push(out);
        subframes.forEach((subframe,j) => {
          let subid = `${j+1}`;
          let out = this.write_one_frame(id,subid,subframe,1,topframe);
          all_main.push(out);
        });
      }else{
        let id = `${i+1}`;
        let subid = ``;
        let out = this.write_one_frame(id,subid,topframe,0,topframe);
        all_main.push(out);
      }
    });
    var text_main = all_main.join('\n');
    //
    //table of contents
    //
    if(this.parser.tocpage){
      var text_toc = this.write_frame_toc(topframes);
    }else{
      var text_toc = '';
    }
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
      let title = this.uncode(subframe.style,subframe.title);
      let subid = `${i+1}`;
      all.push(`\\sym {\\underbar ${id}.${subid} ${title}}`);
    });  
    all.push(`\\stopitemize`);
    all.push(`\\stopsection`) 
    var text = all.join('\n');
    return text;
  }
  write_one_frame(id,subid,frame,issub,topframe) {
    let all = [];
    let v = null;
    if(1){
      ///
      ///main slide
      ///
      all.push('');
      if(issub){
        //all.push(`\\startsection[title={${id} ${this.uncode(topframe.style,topframe.title)}},reference=${id},bookmark={${id}.${subid} ${frame.raw}}]`); 
        all.push(`\\startsection[title={{\\underbar ${id}.${subid} ${this.uncode(frame.style,frame.title)}}},reference={${id}.${subid}},bookmark={${id}.${subid} ${frame.title}}]`); 
        all.push(`\\godown[+0.20cm]`)
      }else{
        all.push(`\\startsection[title={${id} ${this.uncode(topframe.style,topframe.title)}},reference=${id},bookmark={${id} ${topframe.title}}]`); 
        all.push(`\\godown[+0.20cm]`)
      }
      ///
      ///NOTE: sort into two different bins
      ///
      var wrap_contents = [];
      var norm_contents = [];
      frame.contents.forEach(x => {
        if(x.id=='wrapfig'||x.id=='wraptab'){
          wrap_contents.push(x);
        }else{
          norm_contents.push(x);
        }
      });
      ///
      ///NOTE: split into two columns if needed
      ///
      if(wrap_contents.length){
        all.push(`\\startcolumns[n=2]`);
        norm_contents.forEach((x,i) => {
          //'x' is a block
          let latex = this.translate_block(x);
          all.push('');
          all.push(latex.trim());
        })        
        all.push('')
        frame.solutions.forEach((o,i,arr) => {
          if(i>0){
            all.push('\\crlf');
          }
          if(o.choice){
            all.push(`{\\underbar ${this.uncode(o.style,o.title)}}\\crlf`);
            let text = this.to_choice(o.style,o.body,'',false);
            all.push(text);
          }else{
            all.push(`{\\underbar ${this.uncode(o.style,o.title)}}`);
          }
        })   
        all.push('');
        all.push('\\column');
        all.push('\\startalignment[center]\\dontleavehmode');
        wrap_contents.forEach((x,j) => {
          //'x' is a block
          x.style.stretch = 0.9;//hardcode it
          let bundles = this.body_to_all_bundles(x.style,x.body,x.bodyrow);
          bundles.forEach((bundle,i) => {
            if(i>0){
              all.push('\\crlf')
            }
            if(x.id=='wrapfig'){
              bundle.g.stretch = 0.9;
              let p = this.do_bundle(x.style,bundle,'img');
              all.push(p.img);
            }else if(x.id=='wraptab'){
              bundle.g.stretch = 0.9;
              let p = this.do_bundle(x.style,bundle,'tab');
              all.push(p.tab);
            }
          });
        })
        all.push('\\stopalignment')
        all.push('\\stopcolumns');
      }else{
        norm_contents.forEach((x,i) => {
          //'x' is a block
          let latex = this.translate_block(x);
          all.push('');
          all.push(latex.trim());
        })     
        all.push('')
        frame.solutions.forEach((o,i,arr) => {
          if(i>0){
            all.push('\\crlf');
          }
          if(o.choice){
            all.push(`{\\underbar ${this.uncode(o.style,o.title)}}\\crlf`);
            let text = this.to_choice(o.style,o.body,'',false);
            all.push(text);
          }else{
            all.push(`{\\underbar ${this.uncode(o.style,o.title)}}`);
          }
        })
        all.push('')
      }
      // all.push('\\vfill');
      all.push(`\\stopsection`);
      all.push('');
    }
    ///
    ///solution slides
    ///
    frame.solutions.forEach((o,i,arr) => {     
      all.push('');
/*
      if(issub){
        all.push(`\\startsection[title={},reference={},bookmark={}]`); 
        all.push(`\\godown[-0.20cm]`)
        all.push(`\\startsubsubsection[title={},reference={},bookmark={}]`); 
      }else{
        all.push(`\\startsection[title={},reference={},bookmark={}]`); 
        all.push(`\\godown[+0.40cm]`)
      }
      let icon = this.icon_dag;
*/
      if(o.choice){
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice,true);
        all.push(`\\startsection[title={{\\underbar ${title}} \\small ${text}},reference=,bookmark={${o.title}}]`);//empty 
        //all.push(`\\startsubsection[title={${text}},bookmark={}]`);
      }else{
        let title = this.uncode(o.style,o.title).trim();
        let text = this.uncode(o.style,this.join_para(o.body)).trim();
        all.push(`\\startsection[title={{\\underbar ${title}} \\small ${text}},reference=,bookmark={${o.title}}]`);//empty 
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
    var title      = this.parser.conf_to_string('title','&nbsp;');
    var subtitle   = this.parser.conf_to_string('subtitle','&nbsp;')
    var institute  = this.parser.conf_to_string('institute','&nbsp;')
    var author     = this.parser.conf_to_string('author','&nbsp;')
    var style      = this.parser.style;
    var date       = new Date().toLocaleDateString();  
    var all = [];
    all.push(`\\startstandardmakeup`);
    all.push(`\\vfill`);
    all.push(`\\startalignment[center]`);
    all.push(`\\tfc \\color[titleblue]{${this.smooth(this.style,title)}}\\\\`);
    all.push(`\\tfa ${this.smooth(this.style,subtitle)}\\\\`);
    all.push(`\\tfa ${this.smooth(this.style,institute)}\\\\`);
    all.push(`\\tfa ${this.smooth(this.style,author)}\\\\`);
    all.push(`\\tfa ${this.smooth(this.style,date)}`);
    all.push(`\\stopalignment`);
    all.push(`\\vfill`);
    all.push(`\\stopstandardmakeup`);
    all.push('');
    return all.join('\n')
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
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewCreamer };
async function run(){
  const fs = require('fs');
  const path = require('path');
  const process = require('process');
  const { NitrilePreviewParser } = require('./nitrile-preview-parser');
  for(var i=2; i < process.argv.length; ++i){
    var file = process.argv[i];
    var mdfname = `${file.slice(0,file.length-path.extname(file).length)}.md`;
    var texfname = `${file.slice(0,file.length-path.extname(file).length)}.cex`;
    var parser = new NitrilePreviewParser();
    var translator = new NitrilePreviewCreamer(parser);
    await parser.read_file_async(mdfname)
    await parser.read_import_async();
    var document = translator.to_document();
    await translator.write_text_file(fs,texfname,document);
    console.log(`written to ${texfname}`);
    if(path.extname(file).length==0){
      let { NitrilePreviewRun } = require('./nitrile-preview-run');
      let run = new NitrilePreviewRun();
      await run.run_cmd(`context ${file}`);
    }
  }
}
if(require.main===module){
  run();
}
