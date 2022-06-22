'use babel';
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
class NitrilePreviewCamper extends NitrilePreviewContex {
  constructor(parser) {
    super(parser);
    this.name='camper';
    this.contex_papersize = 'A5';
    this.contex_bodyfontsize = 10;
    this.contex_bodylineheight = 1;
    this.contex_whitespacesize = 0;
    this.contex_bodyfontfamily = 'linux';
    this.contex_indenting = 'yes,medium';
    this.contex_style_chapter = '\\tfd';
    this.contex_style_section = '\\bfa';
    this.contex_style_subsection = '\\bf';
    this.contex_style_subsubsection = '\\bf';
    this.contex_style_subsubsubsection = '\\bf';
  }
  hdgs_to_part(title,label,style){
    var o = [];
    var raw = title;
    var label = label||`partnum.${style.__partnum}`;
    var mypage = this.to_part_page(title,style);
    o.push('');
    o.push(`\\startpart[title={${this.uncode(style,title)}},reference={${label}},bookmark={${raw}}]`);
    if(style.__pagenum){
      o.push(`\\setcounter[userpage][${style.__pagenum}]`);
    }
    if(mypage){
      o.push(mypage);
    }else{
      o.push(`Part ${style.__partnum} ${this.uncode(style,title)}`);
      o.push(`\\stoppart`)
    }
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,style){
    var o = [];
    var raw = title;
    var label = label||`chapter.${style.__chapnum}`;
    o.push('');
    o.push(`\\startchapter[title={${style.__chapnum} ~ ${this.uncode(style,title)}},reference={${label}},bookmark={${raw}}]`);
    if(style.__pagenum){
      o.push(`\\setcounter[userpage][${style.__pagenum}]`);
    }
    return o.join('\n')
  }
  hdgs_to_section(title,label,level,style){
    var o = [];
    var raw = title;
    var title = this.uncode(style,title);
    var label = label||`chapter.${style.__chapnum}.${level}`;
    if(style.__chapnum){
      var leader = `${style.__chapnum}.${level}`;
    }else{
      var leader = `${level}`;
    }
    o.push('');
    o.push(`\\startsection[title={${leader} ${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  } 
  hdgs_to_subsection(title,label,level,style){
    var o = [];
    var raw = title;
    var title = this.uncode(style,title);
    var label = label||`chapter.${style.__chapnum}.${level}`;
    if(style.__chapnum){
      var leader = `${style.__chapnum}.${level}`;
    }else{
      var leader = `${level}`;
    }
    o.push('');
    o.push(`\\startsubsection[title={${leader} ${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  } 
  hdgs_to_subsubsection(title,label,level,style){
    var o = [];
    var raw = title;
    var title = this.uncode(style,title);
    var label = label||`chapter.${style.__chapnum}.${level}`;
    if(style.__chapnum){
      var leader = `${style.__chapnum}.${level}`;
    }else{
      var leader = `${level}`;
    }
    o.push('');
    o.push(`\\startsubsubsection[title={${leader} ${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  } 
  float_to_equation(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    bundles = bundles.filter(bundle => bundle.type=='bundle');
    var eqnnum = style.__eqnnum;
    if(style.__chapnum){
      eqnnum = style.__chapnum+"."+eqnnum;
    }
    var all = [];
    all.push('');
    all.push('\\blank');
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'fml');
      let sub = '';
      if(arr.length>1){
        sub = this.int_to_letter_a(1+j);
      }
      let text = `\\hfill${itm.fml}\\hfill({${eqnnum}${sub}})`;
      all.push(text);
      all.push('\\godown[0pt]');
    })
    all.pop();//remove the last \\crlf
    all.push('\\blank');
    return all.join('\n');
  }
  float_to_figure(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    var itms = bundles.map((bundle) => this.do_bundle(style,bundle,'img'));
    var fignum = style.__fignum;
    if(style.__chapnum){
      fignum = style.__chapnum+"."+fignum;
    }
    let caption = this.uncode(style,title).trim();
    let salign = this.contex_caption_align;
    let s_align = "center";
    let s_interls = '';
    if(1){
      let onerow = [];
      let o = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          if(p.img){
            let subtitle = this.to_subcaption(subtitles,p.g);
            subtitle = this.to_fig_subtitle(p.g,subtitle);
            subtitle = this.uncode(style,subtitle);
            onerow.push(`{${p.img}} {${subtitle}}`);
          }
        }else if(p.type=='\\\\'){
          let n = onerow.length;
          if(n){
            o.push(`\\hbox{${s_interls}\\startcombination[${n}*1] ${onerow.join('\n')} \\stopcombination}`);
            o.push('\\\\');
            onerow = [];
          }
        }
      });
      if(onerow.length){
        let n = onerow.length;
        o.push(`\\hbox{${s_interls}\\startcombination[${n}*1] ${onerow.join('\n')} \\stopcombination}`);
      }
      var text = o.join('\n');
    }
    ///
    ///put it together
    ///
    if(1){
      let o = [];
      o.push('')
      o.push(`\\placefigure`);
      o.push(`[here]`);
      o.push(`[${label}]`);
      o.push(`{Figure ${fignum} : ${caption}}`);
      o.push(`{\\startalignment[${s_align}] \\dontleavehmode ${text} \\stopalignment}`);
      return o.join('\n');
    }
  }
  float_to_listing(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle,j) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var lstnum = style.__lstnum;
    if(style.__chapnum){
      lstnum = style.__chapnum+"."+lstnum;
    }
    let caption = this.uncode(style,title);
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let ss = bundle.ss; //raw ss without encoding, used for \\starttyping
      var splitid = bundle.splitid||0;
      var splitsi = bundle.si||0;  
      let o = [];
      ///the space=fixed option disallows line breaking even when the line is too long,
      ///margin=10pt option adds a left margin to the content, line numbers will be right-aligned
      ///and placed to the left-hand side of the context box, numbering=line enables line numbering,
      ///start=41 would assign line number "41" to first line
      o.push(`\\starttyping[start=${splitsi+1},numbering=line,space=fixed,margin=10pt]`);
      ss.forEach( (s) => {
        o.push(s);
      });
      o.push('\\stoptyping');
      let text = o.join('\n');
      text = `\\switchtobodyfont[${this.bodyfontsize*0.9}pt]\\setupinterlinespace[line=${this.bodyfontsize*0.9}pt]${text}`
      all.push('')
      all.push(`\\placelisting`);
      all.push(`[here]`);
      all.push(`[${label}]`);
      all.push(`{Listing ${lstnum}${this.int_to_letter_a(splitid)} : ${caption}}`);
      all.push(`{${text}}`)
    });
    return all.join('\n');
  }
  float_to_table(title,label,style,subtitles,body,bodyrow) {
    var bundles = this.body_to_all_bundles(style,body,bodyrow);
    if(splitid){
      bundles = bundles.filter((bundle,j) => bundle.splitid==splitid);
    }
    bundles = this.merge_all_bundles(style,bundles);
    var tabnum = style.__tabnum;
    if(style.__chapnum){
      tabnum = style.__chapnum+"."+tabnum;
    }
    var caption = this.uncode(style,title);
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'tab');
      var splitid = bundle.splitid||0;
      let text = itm.tab;
      all.push('')
      all.push(`\\placetable`);
      all.push(`[here]`);
      all.push(`[${label}]`);
      all.push(`{Table ${tabnum}${this.int_to_letter_a(splitid)} : ${caption}}`);
      all.push(`{${text}}`)
    });
    return all.join('\n');
  }
  float_to_page(title,label,style,subtitles,body,bodyrow){
    var all = [];
    all.push('');
    all.push('\\page');
    if(style.__pagenum){
      all.push(`\\setcounter[userpage][${style.__pagenum}]`)
    }
    return all.join('\n');
  }
  float_to_hr(title,label,style,subtitles,body,bodyrow){
    var all = [];
    all.push('');
    title = this.uncode(style,title);
    all.push(`\\startformula`);
    all.push(`\\text{\\hl[10]}`);
    all.push(`\\stopformula`);
    return all.join('\n');
  }
  phrase_to_ref(style,cnt){
    // if(cnt){
    //   return `\\in[${cnt}]`
    // }else{
    //   return "??";
    // }
    var label = cnt;
    if(label){
      if(this.parser.label_map.has(label)){
        let blk = this.parser.label_map.get(label);
        var text = '';
        if(blk.name=='chapter'){          
          text = blk.style.__chapnum;
        }else if(blk.name=='heading'){
          text = blk.level;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='figure'){
          text = blk.style.__fignum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='listing'){
          text = blk.style.__lstnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='table'){
          text = blk.style.__tabnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }else if(blk.name=='equation'){
          text = blk.style.__eqnnum;
          if(blk.style.__chapnum){
            text = blk.style.__chapnum+"."+text;
          }
        }
        var text = `\\inframed[frame=off]{\\underbar{${text}}}`;
        return text;
      }else{
        return `\\inframed[frame=off]{\\overstrike{${this.smooth(style,label)}}}`;
      }
    }else{
      return "??";
    }
  }
  to_document() {
    var o = this.build_default_pagenum_map(this.parser.blocks);
    var translationlines = [];
    o.forEach((pp) => {
      pp.forEach((p) => {
        let x = this.translate_block(p.block);
        translationlines.push(x);
      });
    });
    var titlepagelines = this.to_titlepagelines();
    var tocpagelines = this.to_tocpagelines();
    if(!this.parser.titlepage){
      titlepagelines = [];
    }
    if(!this.parser.tocpage){
      tocpagelines = [];
    }
    var data = `\
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
\\setuphead[chapter][style=\\tfd,number=no]
\\setuphead[section][style=\\bfa,number=no]
\\setuphead[subsection][style=\\bf,number=no]
\\setuphead[subsubsection][style=\\bf,number=no]
\\setuphead[subsubsubsection][style=\\bf,number=no]
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
\\setupinterlinespace[line=10pt]
\\setupwhitespace[0pt]
\\setupindenting[yes,medium]
\\setuppapersize[A5]    
\\setupbodyfont[dejavu,10pt]      
\\setupcaptions[minwidth=\\textwidth, align=middle, style=small, location=top, number=no]
\\setupcombination[distance=0.33em,style=small]                 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\enabletrackers[fonts.missing]
\\setuppagenumbering[location={header,right},style=]
\\setuplayout[topspace=10mm,
  header=10mm,
  footer=0mm,
  height=190mm,
  width=120mm,
  backspace=15mm,
  leftmarginwidth=0mm,
  rightmarginwidth=0mm,
  leftmargindistance=0mm,
  rightmargindistance=0mm]
%\\setupcombination[style=small]
\\starttext
${titlepagelines.join('\n')}
${tocpagelines.join('\n')}
\\setupuserpagenumber[numberconversion=numbers]
${translationlines.join('\n')}
\\stoptext
    `;
    return data;
  }
  do_ruby(items){
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
  }
  to_titlepagelines(){
    var all = [];
    var mytitle  = this.parser.conf_to_string('title');
    var myauthor = this.parser.conf_to_string('author');
    var myaddr   = this.parser.conf_to_string('institute');
    var mydate   = new Date().toLocaleDateString();
    if (mytitle) {
      all.push(`\\startstandardmakeup`)
      all.push(`\\startalignment[center]`);
      all.push(`{\\tfd ${this.uncode(this.parser.style,mytitle)}}`);
      all.push(`\\blank[2cm]`);
      all.push(`{\\tfa ${this.uncode(this.parser.style,myaddr)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`{\\tfa ${this.uncode(this.parser.style,myauthor)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`{\\tfa ${this.uncode(this.parser.style,mydate)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`\\stopalignment`);
      all.push(`\\stopstandardmakeup`)
      all.push('');
    }
    return all;
  }
  to_tocpagelines(){
    ///
    ///generate TOC
    ///
    var o = [];
    var pp = [];
    o.push(pp);
    for (let block of this.parser.blocks) {
      if(block.sig=='PART' || block.sig=='CHAP'){
        pp.push(block); 
        if(pp.length==38){
          pp = [];
          o.push(pp);
        }
      }
    }
    ///
    ///remove empty pp
    ///
    o = o.filter(pp => pp.length);
    ///
    ///generate TOC
    ///
    var all = [];
    o.forEach((pp) => {
      all.push(``);
      all.push(`\\startstandardmakeup`);
      all.push(`\\setupuserpagenumber[numberconversion=romannumerals]`);
      all.push(`\\startalignment[flushleft]`);
      all.push(`\\tfd Table Of Contents`);
      all.push(`\\stopalignment`);
      all.push(`\\startlines`);
      pp.forEach((p) => {
        let block = p;
        let {label,title,style} = block;
        title = this.uncode(style,title);
        let partnum = style.__partnum;
        let chapnum = style.__chapnum;
        let pagenum = style.__pagenum;
        if(block.sig=='PART'){
          label = label||`part.${partnum}`;
          all.push(`Part ${partnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`);
        }else if(block.sig=='CHAP'){
          label = label||`chapter.${chapnum}`;
          all.push(`~~~~${chapnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`)
        }
      });
      all.push(`\\stoplines`);
      all.push('\\vfill');
      all.push(`\\stopstandardmakeup`);
    }); 
    return all;
  }
  to_part_page(title,style){
    return `\
\\dontleavehmode
\\startalignment[center]
\\blank[6cm]
{\\tfa Part ${style.__partnum}}
\\blank[1cm]
{\\tfd ${this.uncode(style,title)}}
\\stopalignment
\\stoppart`;
  }
}
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewCamper };
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
    var translator = new NitrilePreviewCamper(parser);
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
