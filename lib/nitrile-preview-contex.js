'use babel';

const { NitrilePreviewDiagramMF } = require('./nitrile-preview-diagrammf');
const { NitrilePreviewFramedMF } = require('./nitrile-preview-framedmf');
const { NitrilePreviewCmath } = require('./nitrile-preview-cmath');
const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');

class NitrilePreviewContex extends NitrilePreviewTranslator {

  constructor(parser) {
    super(parser);
    this.name='CONTEX';
    this.tokenizer = new NitrilePreviewCmath(this);
    this.diagram = new NitrilePreviewDiagramMF(this);
    this.framed = new NitrilePreviewFramedMF(this);
    this.imgs = [];
    this.flags = {};
    this.enumerate_counter = 0;
    this.unicode_symbol_map = this.tokenizer.unicode_symbol_map;
    this.unicode_mathvariant_map = this.tokenizer.unicode_mathvariant_map;
    this.icon_bullet     = '{\\textbullet}';
    this.icon_circlebox  = '\\symbol[martinvogel 2][CircSteel]'                       
    this.icon_circleboxo = '\\symbol[martinvogel 2][CircPipe]'                       
    this.icon_squarebox  = '\\symbol[martinvogel 2][SquareSteel]'
    this.icon_squareboxo = '\\symbol[martinvogel 2][SquarePipe]'
    this.icon_cdigits = [ '\\ding{202}', '\\ding{203}', '\\ding{204}', '\\ding{205}', '\\ding{206}', '\\ding{207}', '\\ding{208}', '\\ding{209}', '\\ding{210}', '\\ding{211}'];
    this.icon_writing_hand = '\\symbol[martinvogel 2][WritingHand]';
    this.icon_folder = '{\\faFolderO}';
  }
  to_conf_titlepage(){
    return this.conf('context.titlepage',0);
  }
  to_conf_padding(){
    return this.conf('context.padding','1 3');
  }
  to_conf_vlines(){
    return this.conf('context.vlines','*');
  }
  to_conf_hlines(){
    return this.conf('context.hlines','t m b r');
  }
  to_conf_chapter(){
    return this.conf('context.chapter','\\bfd');
  }
  to_conf_section(){
    return this.conf('context.section','\\bfa');
  }
  to_conf_subsection(){
    return this.conf('context.subsection','\\bf');
  }
  to_conf_subsubsection(){
    return this.conf('context.subsubsection','\\bf');
  }
  to_conf_subsubsubsection(){
    return this.conf('context.subsubsubsection','\\bf');
  }
  to_context_document() {
    ///do translate
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      block.latex = text;
    })
    ///putting them together
    if (this.conf('context.twocolumn')) {
      var texlines = this.to_twocolumn_texlines(this.parser.blocks);
    } else {
      var texlines = this.parser.blocks.map(x => x.latex);
    }
    /// generate title page
    var titlelines = [];
    var mytitle = this.conf('general.title');
    var myauthor = this.conf('general.author');
    var myaddr = '';
    var mydate = new Date().toLocaleDateString();
    if (this.to_conf_titlepage()) {
      titlelines.push(`\\dontleavehmode`);
      titlelines.push(`\\blank[6cm]`);
      titlelines.push(`\\startalignment[center]`);
      titlelines.push(`\\tfd ${this.uncode(mytitle)}`);
      titlelines.push(`\\stopalignment`);
      titlelines.push(`\\blank[2cm]`);
      titlelines.push(`\\startalignment[center]`);
      titlelines.push(`\\dontleavehmode`);
      titlelines.push(`\\tfb`);
      titlelines.push(`\\bTABLE`);
      titlelines.push(`\\setupTABLE[r][each][frame=off]`);
      titlelines.push(`\\bTR \\bTD ${this.uncode(myauthor)} \\eTD \\eTR`);
      titlelines.push(`\\bTR \\bTD ${this.uncode(myaddr)}   \\eTD \\eTR`);
      titlelines.push(`\\bTR \\bTD ${this.uncode(mydate)}   \\eTD \\eTR`);
      titlelines.push(`\\eTABLE`);
      titlelines.push(`\\stopalignment`);
      titlelines.push(`\\page`);
      titlelines.push('');
    }

    /// toc lines
    var toclines = [];
    if (this.conf('context.toc')) {
      if (1) {
        toclines.push(`\\setupcombinedlist[content][list={part,chapter,section}]`);
        toclines.push(`\\completecontent[criterium=all]`);
        toclines.push('');
      } else {
        toclines.push(`\\setupcombinedlist[content][list={part,section,subsection}]`);
        toclines.push(`\\placecontent`);
        toclines.push('');
      }
    }

    /// inter-image gaps
    var dist = 0.02;
    //var hdist = istwocol ? `${dist*2}\\textwidth` : `${dist}\\textwidth`;
    var hdist = `0.02\\textwidth`;
    ///layout
    var p_papersize = '';
    var p_layout = '';
    var p_bodyfont = '';
    if (this.conf('context.papersize')) {
      var s = `\\setuppapersize[${this.conf('context.papersize')}]`;
      p_papersize = s;
    }
    /*
    var s_layout = `\\setuplayout[width = ${ this.conf('width') }mm,
                      backspace = ${ this.conf('backspace') }mm,
                      cutspace = ${ this.conf('cutspace') }mm,
                      topspace = ${ this.conf('topspace') }mm,
                      height = ${ this.conf('height') }mm,
                      header = ${ this.conf('header') }mm,
                      footer = ${ this.conf('footer') }mm]`;
                      */
    if (this.conf('context.layout')) {
      var s = this.conf('context.layout').split('\t');
      var s = `\\setuplayout[${s.join(',')}]`;
      p_layout = s;
    }
    //\\setupbodyfont[linuxlibertineo, ${ this.conf('bodyfontsizept') } pt]
    if (this.conf('context.bodyfont')) {
      var s = this.conf('context.bodyfont').split('\t');
      var s = `\\setupbodyfont[${s.join(',')}]`;
      p_bodyfont = s;
    }
    var data = `\
% !TEX program = ConTeXt (LuaTeX)
\\enabletrackers[fonts.missing]
${p_papersize}
${p_layout}
${p_bodyfont}
\\setuppagenumbering[location={header,right},style=]
\\setupindenting[no,medium]
\\setupwhitespace[medium]
\\setscript[hanzi] % hyphenation
\\setuphead[part][number=yes]
\\setuphead[chapter][style=${this.to_conf_chapter()},number=yes]
\\setuphead[section][style=${this.to_conf_section()},number=yes]
\\setuphead[subsection][style=${this.to_conf_subsection()},number=yes]
\\setuphead[subsubsection][style=${this.to_conf_subsubsection()},number=yes]
\\setuphead[subsubsubsection][style=${this.to_conf_subsubsubsection()},number=yes]
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
\\definemathcommand [arccot] [nolop] {\\mfunction{arccot}}
\\definemathcommand [arsinh] [nolop] {\\mfunction{arsinh}}
\\definemathcommand [arcosh] [nolop] {\\mfunction{arcosh}}
\\definemathcommand [artanh] [nolop] {\\mfunction{artanh}}
\\definemathcommand [arcoth] [nolop] {\\mfunction{arcoth}}
\\definemathcommand [sech]   [nolop] {\\mfunction{sech}}
\\definemathcommand [csch]   [nolop] {\\mfunction{csch}}
\\definemathcommand [arcsec] [nolop] {\\mfunction{arcsec}}
\\definemathcommand [arccsc] [nolop] {\\mfunction{arccsc}}
\\definemathcommand [arsech] [nolop] {\\mfunction{arsech}}
\\definemathcommand [arcsch] [nolop] {\\mfunction{arcsch}}
\\usemodule[ruby]
\\usesymbols[mvs]
\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]
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
\\setupbodyfont[linuxlibertineni,11pt]
\\starttext
${titlelines.join('\n')}
${toclines.join('\n')}
${texlines.join('\n')}
\\stoptext
    `;
    return data;
  }

  make_line_array(math, label, gather, mainlabel) {
    if (label == '#') {
      label = '[+]';
    } else if (label) {
      label = `[${label}]`;
    } else if (mainlabel) {
      label = '[+]';
    }
    var lines = this.to_formula_math_array(math);
    lines = lines.map(pp => {
      if (gather) {
        var p = pp.join(' ');
      } else {
        var p = pp.join(' \\NC ');
      }
      var p = '\\NC ' + p + ' \\NR';
      return p;
    });
    lines[lines.length - 1] += label;
    return lines;
  }
  ///
  ///
  ///
  do_PART(block) {
    var { title, style } = block;
    var style = this.update_style_from_switches(style,'PART')
    var o = [];
    o.push('');
    var partnum = this.get_refmap_value(style,'partnum');
    var raw = this.smooth(title);
    var title = this.uncode(title);
    o.push(`\\startpart[title={${title}},reference={},bookmark={${raw}}]`);
    if(this.conf('context.partpage')){
      var s=this.conf('context.part').split('\t');
      var s=s.map(x => x.replace(/\$\{text\}/g,title));
      var s=s.map(x => x.replace(/\$\{i\}/g,x=>this.to_i_letter(partnum)));
      var s=s.map(x => x.replace(/\$\{I\}/g,x=>this.to_I_letter(partnum)));
      var s=s.map(x => x.replace(/\$\{a\}/g,x=>this.to_a_letter(partnum)));
      var s=s.map(x => x.replace(/\$\{A\}/g,x=>this.to_A_letter(partnum)));
      var s=s.map(x => x.replace(/\$\{1\}/g,x=>this.to_1_letter(partnum)));
      var s=s.join('\n');
      o.push(s);
    }else{
      o.push(`\\dontleavehmode`);
      o.push(`\\blank[60mm]`);
      o.push(`\\startalignment[flushleft]`);
      o.push(`{\\bfb Part}`);
      o.push(`\\stopalignment`);
      o.push(`\\blank[8mm]`);
      o.push(`\\startalignment[flushleft]`);
      o.push(`{\\bfd ${title}}`);
      o.push(`\\stopalignment`);
      o.push(`\\page`);
    }
    return o.join('\n');
  }    
  do_HDGS(block){
    var {hdgn,title,style} = block;
    var {label} = style;
    var o = [];
    o.push('');
    var raw = this.smooth(title);
    var title = this.uncode(title);
    ///assign this so that it can be used by toLatexDocument().
    if(hdgn==0){
      o.push(`\\startchapter[title={${title}},reference={${label}},bookmark={${raw}}]`);
    }
    else if(hdgn==1){
      o.push(`\\startsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    } 
    else if(hdgn==2){
      o.push(`\\startsubsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    } 
    else if(hdgn==3){
      o.push(`\\startsubsubsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    }
    else {
      o.push(`\\startsubsubsubsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    }
    return o.join('\n');
  }
  do_PLST(block){
    var {plitems,style} = block;
    var style = this.update_style_from_switches(style,'PLST')
    let itemize = this.plitems_to_itemize(plitems);
    var o = [];
    o.push('');
    var text = this.itemize_to_text(itemize,style);
    o.push(text);
    return o.join('\n')
  }
  item_dl_to_text(i,item,g,item_labels){
    var o = [];
    var text = this.uncode(item.text,g);
    item_labels.push(text);
    var text = item_labels.join('\\\\')
    o.push(`\\startDL{${text}} \\crlf`);           
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`\\blank\\noindent ${this.untext(lines,g)}`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    o.push(`\\stopDL`);
    return o.join('\n\n');
  }
  item_hl_to_text(i,item,g){
    var o = [];
    o.push(`\\startHL{}${this.uncode(item.text,g)} \\\\`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`\\blank\\noindent ${this.untext(lines,g)}`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    o.push(`\\stopHL`);
    return o.join('\n\n');
  }
  item_ol_to_text(i,item,g){
    var o = [];
    var text = this.uncode(item.text,g);
    if(item.type == 'A'){
      o.push(`\\sym {${this.to_A_letter(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'a'){
      o.push(`\\sym {${this.to_a_letter(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'I'){
      o.push(`\\sym {${this.to_I_letter(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'i'){
      o.push(`\\sym {${this.to_i_letter(item.value)}${item.ending}} ${text}`)
    }else if(item.value) {
      o.push(`\\sym {${item.value}${item.ending}} ${text}`);
    }else if(item.bullet=='*'){
      let value = i+1;
      o.push(`\\sym {${value}.} ${text}`);
    }else{
      o.push(`\\item ${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`\\blank\\noindent ${this.untext(lines,g)}`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ul_to_text(i,item,g){
    var o = [];
    var text = this.uncode(item.text,g);
    o.push(`\\item ${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        let { lines, itemize } = p;
        if(lines){
          o.push(`\\blank\\noindent ${this.untext(lines,g)}`);
        }else if(itemize) {
          o.push(`${this.itemize_to_text(itemize,g)}`);
        }
      });
    }
    return o.join('\n\n')
  }
  itemize_to_text(itemize,g){
    var bull = itemize.bull;
    var items = itemize.items;
    var o = [];
    switch (bull) {
      case 'OL': {
        o.push(`\\startitemize[n]`);
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(j,item,g);
          o.push(text);
        });
        o.push('\\stopitemize')
        break;
      }
      case 'UL': {
        o.push(`\\startitemize[]`);
        items.forEach((item,j) => {
          let text = this.item_ul_to_text(j,item,g);
          o.push(text);
        });
        o.push('\\stopitemize')
        break;
      }
      case 'DL': {
        var item_labels = [];
        items.forEach((item,j) => {
          let text = this.item_dl_to_text(j,item,g,item_labels);
          if(item_labels.length > 1){
            o.pop();
            o.push(text);
          }else{
            o.push(text);
          }
          if(item.more && item.more.length>0){
            item_labels = [];
          }
        });
        break;
      }
      case 'HL': {
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(j,item,g);
          o.push(text);
        });
        break;
      }
    }
    return o.join('\n\n');
  }
  do_HRLE(block){
    var {id,row1,row2,sig,style,title} = block;
    var style = this.update_style_from_switches(style,'HRLE')
    var o = [];
    o.push('');
    title = this.uncode(title);
    o.push(`\\startformula`);
    o.push(`\\text{\\hl[10]}`);
    o.push(`\\stopformula`);
    return o.join('\n');
  }
  do_PRIM(block){
    var {rank,title,body,style} = block;
    var style = this.update_style_from_switches(style,'PRIM')
    var o = [];
    o.push('');
    var v;
    const indent = '~'.repeat(5);
    title = this.uncode(title);
    let s0 = body[0] || '';
    var text = this.untext(body,style);
    if (rank===0) {
      text = `{\\bf{}${title}}  ${s0 ? '' : '~'} ${text}`;
      o.push(`\\blank\\noindent ${text}`);
      this.needblank = 1;
    }
    else if (rank===1) {
      text = `{\\bf{}${title}}  ${s0 ? '' : '~'} ${text}`;
      o.push(`\\blank\\noindent ${text}`);
      this.needblank = 1;
    } 
    else if (rank===2) {
      text = `{\\bi{}${title}}  ${s0 ? '' : '~'} ${text}`;
      o.push(`\\blank\\noindent ${text}`);
      this.needblank = 1;
    } 
    else {
      text = `{\\bi{}${title}}  ${s0 ? '' : '~'} ${text}`;
      o.push(`\\blank\\noindent ${indent}${text}`);
      this.needblank = 1;
    }
    return o.join('\n');
  }
  do_PARA(block){
    //note that the //dontleavemode does not work for tabulate, which when place side by side in the same
    ///paragraph will not place them side-by-side. The '\\hbox' would have to be used
    var {body,style} = block;
    var style = this.update_style_from_switches(style,'PARA')
    var text = this.untext(body,style);
    var o = [];
    o.push('');
    o.push(text);
    text = o.join('\n');
    return text;
  }
  //
  //
  //
  do_data(block){
    var {rows,islabeled,label,caption} = block;
    rows = rows.map(pp => pp.map(x => this.polish(x)));
    var o = [];
    o.push('');
    o.push(this.to_info(block));
    let text = this.rows_to_table(rows);
    if(islabeled){
      o.push(`\\placetable`);
      o.push(`[split]`);
      o.push(`[${label}]`);
      o.push(`{${this.uncode(caption)}}`);
      o.push('{%');
      o.push(text);
      o.push('}');
    }else{
      o.push(`\\placetable[split,none]{}{%`);
      o.push(text);
      o.push(`}`);
    }
    return o.join('\n');
  }
  do_data_tabulate(block){
    var {id,row1,row2,sig,cols} = block;
    var o = [];
    o.push('');
    var ncols = cols.length;
    var nrows = 0;
    cols.forEach(x => {
      var n = x.length;
      nrows = Math.max(n, nrows);
    });
    var s = [];
    var pcol = 'l'.repeat(ncols);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    var h=4;
    var t=0;
    s.push(`\\starttabulate[${pcol}]`);
    for (var j = 0; j < nrows; ++j) {
      var pp = cols.map(x => x[j] || '');
      pp = pp.map(x => this.polish(x));
      s.push(`\\NC ${pp.join(' \\NC ')} \\NR`);
    }
    s.push(`\\stoptabulate`);
    var text = s.join('\n');
    o.push(`\\blank`);
    o.push(text);
    return o.join('\n');
  }
  do_data_btable(block){
    var {id,row1,row2,sig,cols} = block;
    var o = [];
    o.push('');
    var ncols = cols.length;
    var nrows = 0;
    cols.forEach(x => {
      var n = x.length;
      nrows = Math.max(n, nrows);
    });
    var s = [];
    var pcol = 'l'.repeat(ncols);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    var h=4;
    var t=0;
    s.push(`\\setupTABLE[frame=off]`);
    s.push(`\\setupTABLE[c][1][width=5mm]`);
    s.push(`\\bTABLE[loffset=${0}pt,roffset=${h*2}pt,toffset=${t}pt,boffset=${t}pt,split=yes]`);
    for (var j = 0; j < nrows; ++j) {
      var pp = cols.map(x => x[j] || '');
      pp = pp.map(x => this.polish(x));
      pp = pp.map(x => `\\bTD ${x} \\eTD`);
      s.push(`\\bTR \\bTD \\eTD ${pp.join(' ')} \\eTR`);
    }
    s.push(`\\eTABLE`);
    var text = s.join('\n');
    o.push(`\\blank`);
    o.push(text);
    return o.join('\n');
  }
  ss_to_listing(ss,style){
    // \bTABLE[loffset = 2pt, roffset = 2pt, toffset = 2pt, boffset = 2pt, split = repeat, option = stretch]
    // \bTABLEhead
    // \bTR \bTH No.\eTH \bTH Name \eTH \bTH Symbol \eTH \bTH Quantity \eTH \bTH Equivalents \eTH \eTR
    // \eTABLEhead
    // \bTABLEbody
    // \bTR \bTD { 1 } \eTD \bTD { hertz } \eTD \bTD { Hz } \eTD \bTD { frequency } \eTD \bTD { 1 / s } \eTD \eTR
    // \bTR \bTD { 2 } \eTD \bTD { radian } \eTD \bTD { rad } \eTD \bTD { angle } \eTD \bTD { m / m } \eTD \eTR
    // \bTR \bTD { 3 } \eTD \bTD { steradian } \eTD \bTD { sr } \eTD \bTD { solid angle } \eTD \bTD {
    //   m{ \high{ 2 } } /m{\high{2}}} \eTD \eTR
    let d = [];
    d.push(`\\bTABLE[frame=off,loffset = 0pt, roffset = 0pt, toffset = 0pt, boffset = 0pt, split = yes]`)
    d.push(`\\setupTABLE[c][1][width = 0.1\\textwidth]`);
    d.push(`\\setupTABLE[c][2][width = 0.9\\textwidth]`);
    ss.forEach((s,i) => {
      let li = i + 1;
      d.push(`\\bTR \\bTD {\\small\\tt ${li}~} \\eTD \\bTD {\\small\\tt ${s}} \\eTD \\eTR`)
    })
    d.push(`\\eTABLE`);
    return d.join('\n');
  }
  //
  //NOTE: phrase_to_XXX
  //
  phrase_to_inlinemath(s,g) {
    var s = this.tokenizer.to_cmath(s,g,0);
    return `\\math{${s}}`;
  }
  phrase_to_displaymath(s,g){
    var s = this.tokenizer.to_cmath(s,g,1);
    var o = [];
    o.push('\\startformula');
    o.push(s);
    o.push('\\stopformula')
    s = o.join('\n');
    return s;
  }
  phrase_to_literaldouble(s,style) {
    return `\\quote{\\type{${s}}}`;
  }
  phrase_to_literalsingle(s,style) {
    return `\\type{${s}}`;
  }
  phrase_to_ref(s,style){
    if(s){
      return `\\in[${s}]`
    }else{
      return "??"
    }
  }
  phrase_to_frac(cnt){
    var re = /\s*(?:\/|$)\s*/;
    var ss = cnt.split(re);
    if(ss.length>1){
      let top = ss[0];
      let bot = ss[1];
      top = this.smooth(top);
      bot = this.smooth(bot);
      return `\\math{\\frac{\\text{${top}}}{\\text{${bot}}}}`
    }
    cnt = this.smooth(cnt);
    return `\\math{\\frac{1}{\\text{${cnt}}}}`
  }
  phrase_to_link(cnt) {
    return `\\hyphenatedurl{${cnt}}`
  }
  phrase_to_br() {
    let text = '\\crlf';
    return text;
  }
  phrase_to_vspace(cnt){
    return `\\blank[${cnt}]`;
  }
  phrase_to_hspace(cnt){
    return `\\definehspace[hspace][${cnt}]\\hspace[${cnt}]`;
  }
  ///
  ///fence
  ///
  fence_to_vbox(ss,style){
    var text = this.untext(ss,style);
    if(style.width){
      var width = this.string_to_contex_width(style.width);
    }else{
      var width = `\\textwidth`;
    }
    var o = [];
    o.push(`\\starttabulate[|p(${width})|][distance=0pt,unit=0.5em]`);
    o.push(`\\NC ${text} \\NC\\NR`);
    o.push(`\\stoptabulate`)
    text = o.join('\n')
    text = `\\hbox{${text}}`;
    return text;
  }
  fence_to_math(ss,g) {
    var g = this.update_style_from_switches(g,'math');
    var str = ss.join('\n')
    let s = this.tokenizer.to_cmath(str,g);
    return `\\startformula{${s}}\\stopformula`;
  }
  fence_to_framed(ss,g){
    var g = this.update_style_from_switches(g,'framed');
    var { text } = this.framed.to_framed(ss,g);
    if(g.outline){
      text = `\\framed{${text}}`
    }
    return text;
  }
  fence_to_tabbing(ss,g) {
    var g = this.update_style_from_switches(g,'tabbing')
    var rows = this.ss_to_tabular_rows(ss,g);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,g);
      })
    })
    /// uncode all the data
    var n = (rows.length)?rows[0].length:1;
    var o = [];
    var pcol = 'p'.repeat(n).split('').join('|');
    o.push(`\\starttabulate[|${pcol}|]`);
    rows.forEach((pp) => {
      let myss = pp.map(p => p.text);
      let mys = myss.join(' \\NC ')
      mys = `\\NC ${mys} \\NC\\NR`;
      o.push(mys);
    })
    o.push(`\\stoptabulate`)
    var text = o.join('\n');
    var text = `\\hbox{${text}}`;
    return text;
  }
  fence_to_tabular(ss,g){
    var g = this.update_style_from_switches(g,'tabular');
    var title = g.title||'';
    //
    // build rows
    //
    var rows = this.ss_to_tabular_rows(ss,g);
    var rows = this.update_rows_by_hrule(rows,g.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,g);
      })
    })
    if(g.head && rows.length){
      let pp0 = rows[0];
      pp0.forEach((p) => {
        p.text = `{\\bold ${p.text}}`;
      });
    }
    var n = (rows.length) ? rows[0].length : 1;
    if(1){
      let d = [];
      var pcols = this.halign_to_contex_pcols(n,g.halign);
      var pcol = pcols.join('|');
      d.push(`\\starttable[|${pcol}|]`);
      if(title){
        let title_text = this.uncode(title,g);
        d.push(`\\NC \\use{${n}}\\ReFormat[c]{${title_text}} \\MR`)
      }
      d.push(this.rows_to_tabular(rows,g));
      d.push(`\\stoptable`);
      var text = d.join('\n');
    }
    //
    //add hbox
    //
    var text = `\\dontleavehmode\\hbox{${text}}`;
    return text;
  }
  fence_to_list(ss,g) {
    var g = this.update_style_from_switches(g,'list');
    let itms = this.ss_to_list_itms(ss,g);
    var bullet     = this.icon_bullet; 
    const squarebox  = this.icon_squarebox;
    const squareboxo = this.icon_squareboxo;
    const circlebox  = this.icon_circlebox;
    const circleboxo = this.icon_circleboxo;
    const check_ss = this.string_to_array(this.assert_string(g.check)); 
    itms.forEach((p,i,arr) => {
      if(p.text=='\\\\'){
        p.text = '~';
      }else{
        p.text = this.uncode(p.text,g);
      }
      p.bull = this.uncode(p.bull,g);
      p.value = this.uncode(p.value,g);
      if(p.type == 'UL'){
        p.item = `${bullet}`
        p.latex = `${p.text}`
      }
      else if(p.type == 'OL'){
        p.item = `${i+1}.`
        p.latex = `${p.text}`
      }
      else if(p.type == '1'){
        if(!p.ending) p.ending = '.';
        p.item = `${p.value}${p.ending}`;
        p.latex = `${p.text}`;
      }
      else if(p.type == 'a'){
        if(!p.ending) p.ending = '.';
        p.item  = `${this.to_a_letter(p.value)}${p.ending}`;
        p.latex = `${p.text}`;
      }
      else if(p.type == 'A'){
        if(!p.ending) p.ending = '.';
        p.item  = `${this.to_A_letter(p.value)}${p.ending}`;
        p.latex = `${p.text}`;
      }
      else if(p.type == 'DL'){
        if(p.text){
          p.item  = `{\\bf ${p.value}}`;
          p.latex = `${p.text}`;
          p.hfill = 1;
        }else{
          p.item  = `{\\bf ${p.value}}`;
        }
      }
      else if(p.type == 'CB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled CB
          p.item  = `${squarebox}`;
          p.latex = `${p.text}`;
        }else{
          //empty CB
          p.item  = `${squareboxo}`;
          p.latex = `${p.text}`;
        }
      }
      else if(p.type == 'RB'){
        if(p.bull.trim().length || this.is_in_list(p.start,check_ss)){
          //filled RB
          p.item  = `${circlebox}`;
          p.latex = `${p.text}`;
        }else{
          //empty RB
          p.item  = `${circleboxo}`;
          p.latex = `${p.text}`;
        }
      }
      else{
        ///for other types, the hangindent is not set
        p.item = `${bullet}`
        p.latex = `${p.text}`;
      }
    });
    var leftmargin = '';
    var parsep = 0;
    var text = this.to_margined_text(itms,parsep,leftmargin,g);
    return text;
  }
  fence_to_lines(ss,style){
    let itms = this.ss_to_lines_itms(ss,style);
    let text = this.itms_to_lines(itms,style);
    return text;
  }
  fence_to_verse(ss,style){
    let itms = this.ss_to_verse_itms(ss,style);
    let text = this.itms_to_lines(itms,style);
    return text;
  }
  fence_to_diagram(ss,g){
    var g = this.update_style_from_switches(g,'diagram');
    var { text } = this.diagram.to_diagram(ss,g);
    if(g.outline){
      text = `\\framed{${text}}`
    }
    return text ;
  }
  fence_to_img(ss,g) {
    ///\externalfigure[cow.pdf][width = 1cm]
    ///\externalfigure[cow.pdf][height = 1cm]
    var g = this.update_style_from_switches(g,'img');
    var text = this.ss_to_contex_externalfigure(ss,g);
    return text;
  }
  fence_to_blockquote(ss,g){
    var g = this.update_style_from_switches(g,'blockquote')
    var o = [];
    o.push('\\startnarrower[1*left,1*right]')
    var s = this.join_para(ss);
    var s = this.uncode(s,g);
    o.push(s);
    o.push('\\stopnarrower');
    var text = o.join('\n')
    return text;
  }
  fence_to_verbatim(ss,g){
    var g = this.update_style_from_switches(g,'verbatim')
    var o = [];
    o.push('\\starttabulate[|l|]');
    ss.forEach( (s,j,arr) => {
      s = this.polish(s);
      s = s.replace(/\s/g, "~");
      if (!s) {
        s = "~";
      }
      s = `\\NC \\tt ${s} \\NR`;
      o.push(s);
    });
    o.push('\\stoptabulate');
    var text = o.join('\n')
    return text;
  }

  //////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////
  text_to_typeface (type,cnt,cnt2) {
    // text is to be treated as is
    type = type || '';
    switch (type) {
      case 'verb': {
        return `{\\tt ${cnt}}`
        break;
      }
      case 'code': {
        return `{\\tt ${cnt}}`
        break;
      }
      case 'em': {
        return `{\\it ${cnt}}`
        break;
      }
      case 'b': {
        return `{\\bf ${cnt}}`
        break;
      }
      case 'i': {
        return `{\\it ${cnt}}`
        break;
      }
      case 'u': {
        return `{\\underbar ${cnt}}`
        break;
      }
      case 'tt': {
        return `{\\tt ${cnt}}`
        break;
      }
      case 'overstrike': {
        return `{\\overstrike ${cnt}}`
        break;
      }
      case 'var': {
        return `{\\sl ${cnt}}`
        break;
      }
      case 'br': {
        //return '{\\par}';
        return '{\\crlf}';
        break;
      }
      case 'sup': {
        return `\\high{${cnt}}`
        break;
      }
      case 'sub': {
        return `\\low{${cnt}}`;
        break;
      }
      case 'columnbreak': {
        return '{\\column}'
        break;
      }
      case 'qquad': {
        return '{\\qquad}'
        break;
      }
      ///following are math phrases
      case 'math': {
        return this.tokenizer.to_phrase_math(cnt);
        break;
      }
      case 'sqrt': {
        return this.tokenizer.to_phrase_sqrt(cnt);
        break;
      }
      case 'FRAC': {
        return this.tokenizer.to_phrase_FRAC(cnt,cnt2);
        break;
      }
      case 'frac': {
        return this.tokenizer.to_phrase_frac(cnt,cnt2);
        break;
      }
      case 'binom': {
        return this.tokenizer.to_phrase_binom(cnt,cnt2);
        break;
      }
      case 'root': {
        return this.tokenizer.to_phrase_root(cnt,cnt2);
        break;
      }
      case 'overline': {
        return this.tokenizer.to_phrase_overline(cnt);
        break;
      }
      case 'overleftrightarrow': {
        return this.tokenizer.to_phrase_overleftrightarrow(cnt);
        break;
      }
      case 'overrightarrow': {
        return this.tokenizer.to_phrase_overrightarrow(cnt);
        break;
      }
      case 'underleftrightarrow': {
        return this.tokenizer.to_phrase_underleftrightarrow(cnt);
        break;
      }
      case 'underrightarrow': {
        return this.tokenizer.to_phrase_underrightarrow(cnt);
        break;
      }
      default: {
        return cnt;
        break;
      }
    }
  }
  ///
  ///float_to_XXX
  ///
  float_to_figure(title,ss,g){
    var g = this.update_style_from_switches(g,'figure')
    var ss = this.trim_samp_body(ss);
    var label = g.label||'';
    var itms = this.ss_to_figure_itms(ss,g);
    var all = [];
    var seq = 0;
    itms.forEach((p,j,arr) => {
      var {id,cnt,sub} = p;
      if(id=='diagram' || id=='framed' || id=='img'){
        seq++;
        let num = this.to_a_letter(seq);
        p.sub = `(${num}) ${this.uncode(sub,g)}`;
        p.img = this.s_to_phrase(id,cnt,g);
        all.push(`\\hbox{\\startcombination[1*1] {${p.img}} {\\small ${p.sub}} \\stopcombination}`);
      }else{
        all.push(`\\crlf`);
      }
    });
    var o = [];
    o.push('')
    o.push(`\\placefigure`);
    o.push(`[]`);
    o.push(`[${label}]`);
    o.push(`{${this.uncode(title)}}`);
    o.push(`{%`);
    o.push(`\\startalignment[middle]`);
    o.push(`\\dontleavehmode`);
    o.push(all.join('\n'));
    o.push(`\\stopalignment`);
    o.push('}');
    return o.join('\n');
  }
  float_to_equation(title,ss,g){
    var g = this.update_style_from_switches(g,'equation')
    var ss = this.trim_samp_body(ss);
    var text = ss.join('\n')
    var text = this.tokenizer.to_cmath(text,g);
    var label = g.label||'';
    var o = [];
    o.push('');
    o.push(`\\placeformula[${label}]`)
    o.push(`\\startformula`)
    o.push(text);
    o.push(`\\stopformula`)
    return o.join('\n')
  }
  float_to_listing(title,ss,g){
    var g = this.update_style_from_switches(g,'listing')
    var label = g.label||'';
    var ss = this.trim_samp_body(ss);
    var o = [];
    o.push('\\starttabulate[|l|]');
    ss.forEach( (s,j,arr) => {
      s = this.polish(s);
      s = s.replace(/\s/g, "~");
      if (!s) {
        s = "~";
      }
      s = `\\NC ${s} \\NR`;
      o.push(s);
    });
    o.push('\\stoptabulate');
    var text = o.join('\n')
    o = [];
    o.push('')
    o.push(`\\placelisting`);
    o.push(`[here,split]`);
    o.push(`[${label}]`);
    o.push(`{${this.uncode(title)}}`);
    o.push(`{\\ttxsm{}${text}}`)
    return o.join('\n');
  }
  float_to_table(title,ss,g){
    var g = this.update_style_from_switches(g,'table')
    var ss = this.trim_samp_body(ss);
    var label = g.label||'';
    //
    // build rows
    //
    var rows = this.ss_to_tabular_rows(ss,g);
    var rows = this.update_rows_by_hrule(rows,g.hrule);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw,g);
      })
    })
    if(g.head && rows.length){
      let pp0 = rows[0];
      pp0.forEach((p) => {
        p.text = `{\\bold ${p.text}}`;
      });
    }
    var n = (rows.length) ? rows[0].length : 1;
    if(1){
      let d = [];
      var pcols = this.halign_to_contex_pcols(n,g.halign);
      var pcol = pcols.join('|');
      d.push(`\\starttable[|${pcol}|]`);
      d.push(this.rows_to_tabular(rows,g));
      d.push(`\\stoptable`);
      var text = d.join('\n');
    }
    //
    //put it together
    //
    var o = [];
    o.push(`\\placetable`);
    o.push('[]')
    o.push(`[${label}]`);
    o.push(`{${this.uncode(title)}}`);
    o.push(`{${text}}`);
    o.push('');
    return o.join('\n');
  }
  float_to_longtable(title,ss,g) {
    var g = this.update_style_from_switches(g,'longtable')
    let rows = this.ss_to_tabular_rows(ss,g);
    rows.forEach((pp) => {
      pp.forEach((p) => {
        p.text = this.uncode(p.raw);
      })
    })
    let text = this.rows_to_longtable(rows, g);
    return text;
  }
  float_to_columns(title,ss,g){
    var g = this.update_style_from_switches(g,'columns');
    var clusters = this.ss_to_clusters(ss);
    var texts = clusters.map((ss) => this.untext(ss,g));
    var o = [];
    var n = Math.max(2,texts.length);
    o.push('');
    o.push(`\\startcolumns[n=${n}]`);
    texts.forEach((text,i,arr) => {
      if(i){
        o.push('\\column')
      }
      o.push(text);
    });
    o.push(`\\stopcolumns`);
    return o.join('\n');
  }
  float_to_verbatim(title,ss,g){
    var g = this.update_style_from_switches(g,'verbatim');
    ss = ss.map(s => {
      if (!s) {
        s = "~";
      }else{
        s = this.polish(s);
        if(g.rubify){
          s = this.rubify(s,g.vmap);
        }
        s = s.replace(/\s/g, "~");
        s = `{\\tt{}${s}}`;
      }
      return s;
    });
    ///
    if(1){
      let all = [];
      all.push('\\startlines');
      ss.forEach((s) => all.push(s));
      all.push('\\stoplines');
      var text = all.join('\n');
    }
    if(g.indentation){
      let all = [];
      all.push(`\\startitemize`);
      all.push(text);
      all.push(`\\stopitemize`);
      var text = all.join('\n');
    }
    var o = [];
    o.push('');
    o.push(text);
    return o.join('\n');
  }
  float_to_lines(title,ss,g){
    var g = this.update_style_from_switches(g,'lines');
    ss = ss.map(s => {
      if (!s) {
        s = "~";
      }else{
        s = this.polish(s);
        if(g.rubify){
          s = this.rubify(s,g.vmap);
        }
        s = s.replace(/\s/g, "~");
        s = `${s}`;
      }
      return s;
    });
    ///
    if(1){
      let all = [];
      all.push('\\startlines');
      ss.forEach((s) => all.push(s));
      all.push('\\stoplines');
      var text = all.join('\n');
    }
    if(1){
      let all = [];
      all.push(`\\startitemize`);
      all.push(text);
      all.push(`\\stopitemize`);
      var text = all.join('\n');
    }
    var o = [];
    o.push('');
    o.push(text);
    return o.join('\n');
  }
  float_to_blockquote(title,ss,g){
    var clusters = this.ss_to_clusters(ss);
    clusters = clusters.map((ss) => {
      var s = this.join_para(ss);
      var s = this.uncode(s);
      if(g.rubify){
        s = this.rubify(s,g.vmap);
      }
      return `\\startquotation\n${s}\n\\stopquotation`
    })
    return clusters.join('\n\n')
  }
  ///
  ///
  ///
  __phrase_to_ruby (base, top) {
    var re = '';
    var rb = '';
    var rt = '';
    for (var c of base) {
      if (!/[\u3040-\u309F]/.test(c)) {
        ///not hiragana
        if (rt.length) {
          re += `(${rt})`;
          rt = '';
        }
        rb += c;
      } else {
        if (rb.length) {
          re += '(.+?)';
          rb = '';
        }
        rt += c;
      }
    }
    if (rb.length) {
      re += '(.+?)';
      rb = '';
    } else if (rt.length) {
      re += `(${rt})`;
      rt = '';
    }
    ///console.log(re);
    re = `^${re}$`;
    ///console.log(re);
    var re = new RegExp(re);
    var v = re.exec(top);
    ///console.log(v);
    var v1 = re.exec(base);
    ///console.log(v1);
    var o = '';
    if (v && v1 && v.length === v1.length) {
      /// match
      for (var j=1; j < v.length; ++j) {
        if (v1[j] === v[j]) {
          o += `\\ruby{${v1[j]}}{}`;
        } else {
          o += `\\ruby{${v1[j]}}{${v[j]}}`;
        }
      }
    } else {
      o = `\\ruby{${base}}{${top}}`;
    }
    ///console.log(o);
    return o;
  }
  __translate_to_ruby(items){
    let o = [];
    for(let item of items){
      o.push(`\\ruby{${item[0]}}{${item[1]}}`);
    }
    let text = o.join('');
    return text;
  }
  translate_to_ruby(items){
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
  }

  to_twocolumn_texlines(blocks){
    var texlines = [];
    var my_chapters = [];
    for(var i=0; i < blocks.length; ++i){
      var block = blocks[i];
      var {sig,name,hdgn,latex} = block;
      if(sig=='HDGS' && name=='part'){      
        if(my_chapters.length){
          my_chapters.pop();
          texlines.push(`\\stopcolumns`);
        }
        texlines.push(latex);
        continue;
      }
      if(sig=='HDGS' && hdgn==0){
        if(my_chapters.length){
          texlines.push(`\\stopcolumns`);
          texlines.push(`\\startcolumns[balance=no]`);
        } else {
          my_chapters.push('chapter');
          texlines.push(`\\startcolumns[balance=no]`);
        }
        texlines.push(latex);
        continue;
      } 
      if(my_chapters.length==0){
        my_chapters.push('chapter');
        texlines.push(`\\startcolumns[balance=no]`);
        texlines.push(latex);
        continue;
      }
      texlines.push(latex);
      continue;
    }
    ///finish-off
    if(my_chapters.length){
      my_chapters.pop();
      texlines.push(`\\stopcolumns`);
    }
    return texlines;
  }

  make_math_array(o,math,label,more,gather){
    ///   \startformula \startalign
    ///   \NC a_1 x + b_1 y \NC = c_1 \NR
    ///   \NC a_2 x + b_2 y \NC = c_2 \NR
    ///   \stopmathalignment \stopformula
    ///
    ///   \placeformula
    ///   \startformula \startalign
    ///   \NC a_1 x + b_1 y \NC = c_1 \NR[+]
    ///   \NC a_2 x + b_2 y \NC = c_2 \NR[eq:a]
    ///   \stopmathalignment \stopformula
    /*
    if(gather){
      o.push(`\\startformula \\startmathalignment[n=1,distance=2pt]`);
    }else{
      o.push(`\\startformula \\startmathalignment[n=2,distance=2pt]`);
    }
    var line_arr = this.make_line_array(math,label,gather,label);
    line_arr.forEach(x => o.push(x));
    for(let k=0; k < more.length; k++){
      let x = more[k];
      var line_arr = this.make_line_array(x.math,x.label,gather,label);
      line_arr.forEach(x => o.push(x));
    }
    o.push(`\\stopmathalignment \\stopformula`);
    o.push('');
    */
  }

  make_math(o,caption,label,islabeled,items,gather){
    ///   \startformula \startalign
    ///   \NC a_1 x + b_1 y \NC = c_1 \NR
    ///   \NC a_2 x + b_2 y \NC = c_2 \NR
    ///   \stopmathalignment \stopformula
    ///
    ///   \placeformula
    ///   \startformula \startalign
    ///   \NC a_1 x + b_1 y \NC = c_1 \NR[+]
    ///   \NC a_2 x + b_2 y \NC = c_2 \NR[eq:a]
    ///   \stopmathalignment \stopformula
    //var line = this.make_line(math,label,islabeled);
    //o.push(line);
    /*
    items.forEach(x => {
      var line = this.make_line(x.math,x.label,islabeled);
      o.push(line);
    });
    */
  }

  fontify_context (text,fontsize) {
    fontsize=fontsize||'';
    //const fontnames = ['za','jp','tw','cn','kr'];
    var newtext = '';
    var s0 = '';
    var fns0 = 0;
    var a0 = '';
    var fn0 = '';

    for (var j=0; j < text.length; ++j) {

      var c = text[j];
      var cc = text.codePointAt(j);

      if(this.is_cjk_cc(cc)){
        var fns = fontmap[cc]; 
      } else {
        var fns = 0;
      }

      // buildup ASCII text
      if(fns == 0 && fns0 == 0){
        a0 += c;
        continue;
      } else {
        // if first CJK char, then init 'fns0' with 'fns'
        if(fns0 == 0){
          fns0 = fns;
        }
      }

      // flush ASCII text
      if(a0){
        if(fontsize){
          newtext += `{\\switchtobodyfont[${fontsize}]${a0}}`;
        }else{
          newtext += `${a0}`;
        }
        a0 = '';
      }

      /// check to see if this char has the same font as the last one
      /// if it is the first time a CJK char is encountered

      var fns0 = fns0 & fns; /// bitwise-AND
      if (fns0) {
        /// get the first font: assign 'k' according to the followinlrules:
        ////  0b0001 => 0, 0b0010 => 1; 0b0011 => 0; 0b0100 => 2
        var k = 0;
        for (k=0; k < fontnames.length; ++k) {
          if (fns0 & (1 << k)) {
            break;
          }
        }
        ///note that fn here could be different everytime so we need to 
        ///save it to fn0 if it is still not '', when it is '', then
        ///the CJK font has swiched, or it is no longer a CJK
        var fn = fontnames[k];
        if (fn) {
          fn0 = fn;
          /// building up CJK s0 by combining with previous 'c0' and 's0'
          s0 += c;
          continue
        }
      }

      /// flush CJK
      /// by the time we get here the 'c' is either a CJK that does
      //// not agree with previous character in terms of the same font;
      //// or 'c' is not a CJK at all.
      newtext += `{\\switchtobodyfont[${fn0},${fontsize}]{${s0}}}`;
      fns0 = 0;///a list of available fonts
      s0 = '';///the CJK string
      fn0 = '';///the font chosen for use with switchbodyfont

      /// it is CJK if 'fns' is not zero
      if (fns) {
        /// get the first font: assign 'k' according to the followin rules:
        ////  0b0001 => 0, 0b0010 => 1; 0b0011 => 0; 0b0100 => 2
        var k = 0;
        for (k=0; k < fontnames.length; ++k) {
          if (fns & (1 << k)) {
            break;
          }
        }
        /// pick a font name
        fn0 = fontnames[k];
        /// save the current font map infor for this char
        var fns0 = fns;
        var s0 = c;
        continue;
      }

      /// we get here if the 'c' is not a CJK
      a0 += c; // add to a0
    }

    if(a0){
      ///ascii
      if(fontsize){
        newtext += `{\\switchtobodyfont[${fontsize}]${a0}}`;
      }else{
        newtext += `${a0}`;
      }
    } else if (s0){
      ///cjk
      newtext += `{\\switchtobodyfont[${fn0},${fontsize}]${s0}}`;
    }
    return newtext;
  }

  to_mpcolor(color) {
    return `\\MPcolor{${color}}`;
  }

  mpfontsize(fontsize) {
    /// current in CONTEXT it is not easy to change to a different fontsize
    /// when generating text in MP, so this method returns an empty string
    /// meaning we will just use the default font size, which is the body font.
    return '';
  }

  string_to_contex_width(s,zoom=1,def='') {
    zoom = parseFloat(zoom)||1;
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!s) {
      return def;
    }
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(s))!==null) {
      var num = parseFloat(v[1]);
      num *= zoom;
      num /= 100;
      if (Number.isFinite(num)) {
        var num = num.toFixed(3);
        if (num==1) {
          return `\\textwidth`;
        }
        return `${num}\\textwidth`;
      } 
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if ((v=re.exec(s))!==null) {
      var num = parseFloat(v[1]);
      num *= zoom;
      if(Number.isFinite(num)){
        return `${num}${v[2]}`
      }
    }
    var num = parseFloat(s);
    num *= zoom;
    if (Number.isFinite(num)) {
      return `${num.toFixed(3)}mm`;
    }
    return def;
  }
  string_to_contex_height(s,zoom) {
    if (!s) {
      return '';
    }
    zoom = parseFloat(zoom)||1;
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(s))!==null) {
      return '';
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if((v=re.exec(s))!==null){
      var num = v[1];
      var unit = v[2];
      num *= zoom;
      if(Number.isFinite(num)){
        return `${num.toFixed(3)}${unit}`;
      }
    }
    return '';
  }
  string_to_context_height_with_aspect_ratio(width_s,aspect_ratio_s,zoom) {
    /// take an input string that is 100% and convert it to '\textwidth'.
    /// take an input string that is 50% and convert it to '0.5\textwidth'.
    /// take an input string that is 10cm and returns "10cm"
    if (!width_s) {
      return '';
    }
    var ratio = this.aspect_ratio_to_float(aspect_ratio_s);
    if(!ratio){
      return '';
    }
    var v;
    var re = /^(.*)\%$/;
    if ((v=re.exec(width_s))!==null) {
      var num = parseFloat(v[1]);
      num *= zoom;
      num /= 100;
      num *= ratio;
      if (Number.isFinite(num)) {
        var num = num.toFixed(3);
        if (num==1) {
          return `\\textwidth`;
        }
        return `${num}\\textwidth`;
      }
    }
    var re = /^(.*)(mm|cm|in|pt)$/;
    if((v=re.exec(width_s))!==null) {
      var num = parseFloat(v[1]);
      num *= zoom;
      num *= ratio;
      if(Number.isFinite(num)){
        return `${num.toFixed(3)}${v[2]}`
      }
    }
    var num = parseFloat(width_s);
    num *= zoom;
    num *= ratio;
    if (Number.isFinite(num)) {
      return `${num.toFixed(3)}mm`;
    }
    return '';
  }
  convert_longpadding(text){
    // given a string such as "2" return [2,2]
    // given a string such as "2 3" return [2,3]
    var v = this.string_to_int_array(text);
    if(v.length == 1){
      return [v[0],v[0]];
    } else if(v.length==0){
      return [0,0];
    } else {
      return [v[0],v[1]];
    }
  }
  cols_to_tabu(cols) {
    var ncols = cols.length;
    var nrows = 0;
    cols.forEach(x => {
      var n = x ? x.length : 0;
      nrows = Math.max(n, nrows);
    });
    var s = [];
    var pcol = 'l'.repeat(ncols);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    var h = 4;
    var t = 0;
    s.push(`\\starttabulate[${pcol}]`);
    for (var j = 0; j < nrows; ++j) {
      var pp = cols.map(x => x[j] || '');
      s.push(`\\NC ${pp.join(' \\NC ')} \\NC \\NR`);
    }
    s.push('\\stoptabulate');
    return s.join('\n');
  }
  rows_to_tabulate(rows,style) {
    var ncols = rows.length ? rows[0].length : 1;
    var nrows = rows.length;
    var vbars = this.vrule_to_vbars(ncols,style.vrule);
    var d = [];
    var cellcolor_map = this.string_to_cellcolor_map(style.cellcolor||'');
    for (var j = 0; j < nrows; ++j) {
      var pp = rows[j];
      if(this.row_is_hline(pp)){
        d.push('\\HL');
        continue;
      }
      if(this.row_is_dhline(pp)){
        d.push('\\HL');
        d.push('\\TB[0.2em]')
        d.push('\\HL');
        continue;
      }
      if(this.string_has_item(style.hrule,'-') && j > 0 && d.length && d[d.length-1]!='\\HL'){
        d.push('\\HL');
      }
      ///add row
      var mypp = [];
      pp.forEach((p,i) => {
        if(i>0 && vbars[i]=='||'){
          mypp.push('\\VL');
          mypp.push('\\VL');
        }else if(vbars[i]){
          mypp.push('\\VL');
        }else {
          mypp.push('\\NC');
        }
        if(cellcolor_map.has(p.raw)){
          ///  \NC test \NC {\colored[red]   test} \NC test \NC\NR 
          let mycolorname = cellcolor_map.get(p.raw);
          mypp.pop();
          mypp.push(`\\CM[${mycolorname}]`);
          mypp.push(p.text)
        }else{
          mypp.push(p.text);
        }
      })
      if(vbars[ncols]){
        mypp.push('\\VL')
      }else{
        mypp.push('\\NC')
      }
      mypp.push('\\MR')
      d.push(mypp.join(' '));
    }
    var text = d.join('\n');
    return text;
  }
  rows_to_multi(rows) {
    let ncols = rows.length && rows[0].length;
    let nrows = rows.length;
    let n = ncols;
    var d = [];
    var pcol = 'p'.repeat(n);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    d.push(`\\defineparagraphs[sidebyside][n=${n}]`);
    for(let j=0; j < nrows; ++j){
      d.push(`\\startsidebyside`);
      let pp = rows[j];
      pp = pp.slice(0,n);
      for(let i=0; i < n; ++i){
        let text = pp[i] || '';
        d.push(text);
        if(i<n-1){
          d.push('\\sidebyside');
        }
      }
      d.push('\\stopsidebyside');
    }
    return d.join('\n');
    /*
    o.push(`\\blank`);
    o.push(`\\defineparagraphs[sidebyside][n=${ncols}]`);
    o.push(`\\startsidebyside`);
    o.push(d.join('\\sidebyside\n'));
    o.push(`\\stopsidebyside`);
    o.push('');
    */
  }
  itms_to_multi(itms,style) {
    var n = parseInt(style.n);
    var n = n || itms.length;
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = 0.02;
    var frs = this.string_to_frs(style.fr, n);
    var d = [];
    var pcol = 'p'.repeat(n);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    d.push(`\\defineparagraphs[sidebyside][n=${n+n-1},before={\\blank[0pt]},after={\\blank[0pt]}]`);
    for(let i=0; i < n; i+=1){
      d.push(`\\setupparagraphs[sidebyside][${1+i+i}][width=${frs[i]*w}\\textwidth]`);
      d.push(`\\setupparagraphs[sidebyside][${1+i+i+1}][width=${gap}\\textwidth]`);
    }
    d.pop();///remove the last line for 'gap'
    for(let j=0; j < itms.length; j+=n){
      d.push(`\\startsidebyside`);
      let pp = itms.slice(j,j+n);
      for(let i=0; i < n; ++i){
        let text = pp[i] || '';
        d.push(text);
        if(i<n-1){
          d.push('\\sidebyside');
          d.push('\\sidebyside');
        }
      }
      d.push('\\stopsidebyside');
    }
    return d.join('\n');
    /*
    o.push(`\\blank`);
    o.push(`\\defineparagraphs[sidebyside][n=${ncols}]`);
    \setupparagraphs[mypar][1][width=.1\textwidth,style=bold]
    \setupparagraphs[mypar][2][width=.4\textwidth]
    o.push(`\\startsidebyside`);
    o.push(d.join('\\sidebyside\n'));
    o.push(`\\stopsidebyside`);
    o.push('');
    */
  }
  cols_to_multi(cols) {
    let n = cols.length;
    var d = [];
    var pcol = 'p'.repeat(n);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    d.push(`\\starttabulate[${pcol}]`);
    cols.forEach(text => {
      d.push(`\\NC`);
      d.push(text);
    });
    d.push('\\NC \\NR');
    d.push('\\stoptabulate');
    return d.join('\n');
  }
  tabr_cols_to_btable(cols) {
    var ncols = cols.length;
    var nrows = 0;
    cols.forEach(x => {
      var n = x.length;
      nrows = Math.max(n, nrows);
    });
    var s = [];
    var pcol = 'l'.repeat(ncols);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    var h = 4;
    var t = 0;
    s.push(`\\bTABLE`);
    s.push(`\\setupTABLE[frame=off]`)
    s.push(`\\setupTABLE[r][first][topframe=on]`);
    s.push(`\\setupTABLE[r][first][bottomframe=on]`);
    s.push(`\\setupTABLE[r][last][bottomframe=on]`);
    for (var j = 0; j < nrows; ++j) {
      var pp = cols.map(x => x[j] || '');
      if (j == 0) {
        s.push(`\\bTABLEhead`);
        var kk = pp.map(x => x.split('\\\\'));
        var kk = kk.map(k => k.map(x => this.uncode(x)));
        var pp = kk.map(k => k.join('\\\\'));        
        s.push(`\\bTR \\bTH ${pp.join(' \\eTH \\bTH ')} \\eTH \\eTR`);
        s.push(`\\eTABLEhead`);
        s.push(`\\bTABLEbody`);
      }
      else {
        var pp = cols.map(x => x[j] || '');
        pp = pp.map(x => this.uncode(x));
        s.push(`\\bTR \\bTD ${pp.join(' \\eTD \\bTD ')} \\eTD \\eTR`);
      }
    }
    s.push(`\\eTABLEbody`);
    s.push(`\\eTABLE`);
    return s.join('\n');
  }



  do_tabb_btable(block){
    var {id,row1,row2,sig,rows,ww} = block;
    var o = [];
    o.push('');
    o.push(this.to_info(block));
    var ncols = ww.length;
    rows = rows.map(row => row.map(x => this.uncode(x)));
    ///***NOTE: xltabular is percular of naming its columns
    var s = [];
    /// adjust for the relative width
    ww = this.ww_to_one(ww);
    var pp = ww.map((x,i) => `\\setupTABLE[c][${i+1}][width=${x}\\textwidth]`);
    s.push(pp.join('\n'));
    /// turn off all frame and padding
    s.push(`\\setupTABLE[frame=off]`);
    /// writing table
    s.push(`\\bTABLE[loffset=${0}pt,roffset=${0}pt,toffset=${0}pt,boffset=${0}pt,split=yes,option=stretch]`);
    s.push(`\\bTABLEhead`);
    s.push(`\\eTABLEhead`);
    s.push(`\\bTABLEbody`);
    for( var row of rows ) {
      row = row.map(x => `\\bTD ${x} \\eTD`);
      s.push(`\\bTR ${row.join(' ')} \\eTR`);
    }
    s.push(`\\eTABLEbody`);
    s.push(`\\eTABLE`);
    o.push(`\\blank`);
    o.push(s.join('\n'));
    return o.join('\n');
  }

  to_colors(color){
    return this.diagram.to_colors(color);
  }

  rows_to_table(rows){
    var ncols = rows[0].length;
    var nrows = rows.length;;
    var d = [];
    var pcol = 'l'.repeat(ncols);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    d.push(`\\starttabulate[${pcol}]`);
    for (var j = 0; j < nrows; ++j) {
      var pp = rows[j];
      d.push(`\\NC ${pp.join(' \\NC ')} \\NR`);
    }
    d.push(`\\stoptabulate`);
    let text = d.join('\n');
    return text;
  }

  polish_verb(unsafe){
    unsafe = this.polish(unsafe);
    unsafe = unsafe.replace(/\s/g, "~")
    return unsafe;
  }

  polish(unsafe){
    unsafe = ''+unsafe;
    unsafe = unsafe.replace(/’/g, "\0char39\0")
    unsafe = unsafe.replace(/“/g, "\0char34\0")
    unsafe = unsafe.replace(/”/g, "\0char34\0")
    unsafe = unsafe.replace(/"/g, "\0char34\0")
    unsafe = unsafe.replace(/\|/g, "\0char124\0")
    unsafe = unsafe.replace(/\*/g, "\0char42\0")
    unsafe = unsafe.replace(/~/g, "\0char126\0")
    unsafe = unsafe.replace(/</g, "\0char60\0")
    unsafe = unsafe.replace(/>/g, "\0char62\0")
    unsafe = unsafe.replace(/\[/g, "\0char91\0")
    unsafe = unsafe.replace(/\]/g, "\0char93\0")
    unsafe = unsafe.replace(/#/g, "\0char35\0")
    unsafe = unsafe.replace(/&/g, "\0char38\0")
    unsafe = unsafe.replace(/%/g, "\0char37\0")
    unsafe = unsafe.replace(/\$/g, "\0char36\0")
    unsafe = unsafe.replace(/_/g, "\0char95\0") 
    unsafe = unsafe.replace(/\^/g, "\0char94\0")
    unsafe = unsafe.replace(/\{/g, "\0char123\0")
    unsafe = unsafe.replace(/\}/g, "\0char125\0")
    unsafe = unsafe.replace(/\\/g, "\0char92\0")
    unsafe = unsafe.replace(/\0(.*?)\0/g, (match, p1) => {
      return `{\\${p1}}`;
    })
    if(1){
      ///replace unicode
      let new_unsafe = '';
      for(let c of unsafe){
        let cc = c.codePointAt(0);
        if(this.unicode_symbol_map.has(cc)){
          let s = this.unicode_symbol_map.get(cc).cex;
          new_unsafe += s;
        }else if(this.unicode_mathvariant_map.has(cc)){
          let s = this.unicode_mathvariant_map.get(cc).cex;
          new_unsafe += `\\math{${s}}`;
        }else{
          new_unsafe += c;
        }
      }
      unsafe = new_unsafe;
    }
    if(this.conf('contex.cjk','','string')=='1'){
      unsafe = this.fontify_latex_cjk(unsafe);
    }
    return unsafe;
  }

  smooth (unsafe) {

    var T1 = String.fromCharCode(0x1); // caret
    var T2 = String.fromCharCode(0x2); // underscore
    var T3 = String.fromCharCode(0x3); // left-brace
    var T4 = String.fromCharCode(0x4); // right-brace
    var T5 = String.fromCharCode(0x5); // backslash  
    var T6 = String.fromCharCode(0x6); // dollar-sign
    unsafe = '' + unsafe; /// force it to be a string when it can be a interger
    unsafe = unsafe.replace(this.re_all_sups, (match,p1,p2) => {
          // I^1
          return  `${T6}${p1}${T1}${p2}${T6}`;  // octal code \01 is for caret
      })
    unsafe = unsafe.replace(this.re_all_subs, (match,p1,p2) => {
          // I_1
          return `${T6}${p1}${T2}${p2}${T6}`;  // octal code \02 is for underscore
      })
    unsafe = unsafe.replace(this.re_all_diacritics, (match,p1,p2) => {
          // a~dot, a~ddot    
          return `${T6}\0${p2}${T3}${p1}${T4}\0${T6}`;
      })
    unsafe = unsafe.replace(this.re_all_mathvariants, (match,p1,p2) => {
          // a~mathbf, a~mathbb    
          return `${T6}\0${p2}${T3}${p1}${T4}\0${T6}`;
      })
    unsafe = unsafe.replace(this.re_all_symbols, (match,p1) => {
          // symbol
          try{
            var v = this.tokenizer.get_cex_symbol(p1);
            v = v.replace(/\$/g,T6).replace(/\\/g,T5).replace(/\{/g,T3).replace(/\}/g,T4).replace(/\^/g,T1).replace(/_/g,T2);
            return v;
          }catch(e){
            return match;
          }
      })
    unsafe = unsafe.replace(this.re_all_symbol_comments, (match,p1) => {
          // symbol
          try{
            var v = this.tokenizer.get_symbol_comment(p1);
            return v;
          }catch(e){
            return match;
          }
      })
    unsafe = unsafe.replace(/’/g,     "\0char39\0")
    unsafe = unsafe.replace(/“/g,     "\0char34\0")
    unsafe = unsafe.replace(/”/g,     "\0char34\0")
    unsafe = unsafe.replace(/"/g,     "\0char34\0")
    unsafe = unsafe.replace(/\|/g,    "\0char124\0")
    unsafe = unsafe.replace(/\*/g,    "\0char42\0")
    unsafe = unsafe.replace(/~/g,     "\0char126\0")
    unsafe = unsafe.replace(/</g,     "\0char60\0")
    unsafe = unsafe.replace(/>/g,     "\0char62\0")
    unsafe = unsafe.replace(/\[/g,    "\0char91\0")
    unsafe = unsafe.replace(/\]/g,    "\0char93\0")
    unsafe = unsafe.replace(/#/g,     "\0char35\0")
    unsafe = unsafe.replace(/&/g,     "\0char38\0")
    unsafe = unsafe.replace(/%/g,     "\0char37\0")
    unsafe = unsafe.replace(/\$/g,    "\0char36\0")
    unsafe = unsafe.replace(/_/g,     "\0char95\0") 
    unsafe = unsafe.replace(/\^/g,    "\0char94\0")
    unsafe = unsafe.replace(/\{/g,    "\0char123\0")
    unsafe = unsafe.replace(/\}/g,    "\0char125\0")
    unsafe = unsafe.replace(/\\/g,    "\0char92\0")
    unsafe = unsafe.replace(/⁻¹/g,    `\0high${T3}-1${T4}\0`)
    unsafe = unsafe.replace(/⁻²/g,    `\0high${T3}-2${T4}\0`)
    unsafe = unsafe.replace(/⁻³/g,    `\0high${T3}-3${T4}\0`)
    unsafe = unsafe.replace(/¹/g,     `\0high${T3}1${T4}\0`)
    unsafe = unsafe.replace(/²/g,     `\0high${T3}2${T4}\0`)
    unsafe = unsafe.replace(/³/g,     `\0high${T3}3${T4}\0`)
    unsafe = unsafe.replace(/\0(.*?)\0/g, (match,p1) => {
          return `{\\${p1}}`;
      })
    unsafe = unsafe.replace(/\01/g,'^')
    unsafe = unsafe.replace(/\02/g,'_')
    unsafe = unsafe.replace(/\03/g,'{')
    unsafe = unsafe.replace(/\04/g,'}')
    unsafe = unsafe.replace(/\05/g,'\\')
    unsafe = unsafe.replace(/\06/g,'$')
    if(1){
      let new_unsafe = '';
      for (let c of unsafe) {
        let cc = c.codePointAt(0);
        if (this.unicode_symbol_map.has(cc)) {
          c = this.unicode_symbol_map.get(cc).cex;
        }
        new_unsafe += c;
      }
      unsafe = new_unsafe;
    }
    if(this.conf('contex.cjk','','string')=='1'){
      unsafe = this.fontify_latex_cjk(unsafe);
    }
    return unsafe;
  }
  ___itms_to_itemized___(itms,style){
    var n = parseInt(style.n);
    var n = n || 1;
    if(itms.length && itms[0].bull == 'OL'){
      let pp = itms.map(p => {
        if (p.type == 'A') {
          return `\\sym {${this.to_A_letter(p.value)}${p.ending}} ${p.text}`;
        }
        if (p.type == 'a') {
          return `\\sym {${this.to_a_letter(p.value)}${p.ending}} ${p.text}`;
        }
        if (p.type == 'I') {
          return `\\sym {${this.to_I_letter(i + 1)}${p.ending}} ${p.text}`;
        }
        if (p.type == 'i') {
          return `\\sym {${this.to_i_letter(i + 1)}${p.ending}} ${p.text}`;
        }
        if(typeof p.value == 'number'){
          return `\\sym {${p.value}${p.ending}} ${p.text}`
        }
        return `\\item ${p.text}`
      });
      if (n && n > 1) {
        return this.pp_to_multi_itemized(pp, style, 'n')
      }else{
        return (`\\startitemize[packed,n][before={}]\n${pp.join('\n')}\n\\stopitemize`);
      }
    }
    if (itms.length) {
      let pp = itms.map(p => `\\item ${p.text}`);
      if (n && n > 1) {
        return this.pp_to_multi_itemized(pp, style, '')
      } else {
        return (`\\startitemize[packed][before={}]\n${pp.join('\n')}\n\\stopitemize`);
      }
    }
    return (`\\startitemize[packed][before={}]\\item\n\\stopitemize`);
  }
  itms_to_itemized(itms,style){
    var n = parseInt(style.n);
    var n = n || 1;
    let pp = itms.map(p => {
      if (p.type == 'A') {
        return `{${this.to_A_letter(p.value)}${p.ending}} ${p.text}`;
      }
      if (p.type == 'a') {
        return `{${this.to_a_letter(p.value)}${p.ending}} ${p.text}`;
      }
      if(typeof p.value == 'number'){
        return `{${p.value}${p.ending}} ${p.text}`
      }
      return `{\\textbullet} ${p.text}`
    });
    return (`\\startlines\n${pp.join('\n')}\n\\stoplines`);
  }
  itms_to_bull(itms,style){
    let pp = itms.map((p,i) => {
      if(p.keys){
        keys = keys.map(({key,cat}) => {
          key = this.uncode(key);
          if (cat == 'tt') {
            key = `\\quote{\\tt{}${key}}`;
          }
          else if (cat == 'i') {
            key = `{\\sl{}${key}}`;
          }
          else if (cat == 'b') {
            key = `{\\bf{}${key}}`;
          }
          return key;
        });
      }
      if(p.bull == '**'){
        return `${i+1}. ${p.text}`
      }
      if(p.bull == '--'){
        return `{\\bullet} ${p.text}`
      }
      return `${p.text}`;
    });
    return (`\\startlines\n${pp.join('\n')}\n\\stoplines`);
  }
  pp_to_multi_itemized(itms,style,name){
    var n = parseInt(style.n)||1;
    var m = Math.floor(itms.length / n);
    var z = itms.length - n * m;
    var k = z ? (m + 1) : (m);
    var w = (1 - (0.02 * (n - 1))) / n;
    var gap = 0.02;
    var frs = this.string_to_frs(style.fr, n);
    var d = [];
    var pcol = 'p'.repeat(n);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    d.push(`\\defineparagraphs[sidebyside][n=${n + n - 1},before={\\blank[0pt]},after={\\blank[0pt]}]`);
    for (let i = 0; i < n; i += 1) {
      d.push(`\\setupparagraphs[sidebyside][${1 + i + i}][width=${frs[i] * w}\\textwidth]`);
      d.push(`\\setupparagraphs[sidebyside][${1 + i + i + 1}][width=${gap}\\textwidth]`);
    }
    d.push(`\\startsidebyside`);
    for (let j = 0, i = 0; j < itms.length; i += 1, j += k) {
      var pp = itms.slice(j, j + k);
      d.push(`\\startlinesp.join('\n')}\n\\stoplines`);
      if (i < n - 1) {
        d.push('\\sidebyside');
        d.push('\\sidebyside');
      }
    }
    d.push('\\stopsidebyside');
    return d.join('\n')
  }
  imgrid_to_combination(itms,style){
    var n = parseInt(style.n)||1;
    var m = Math.ceil(itms.length/n);
    var w = (1-(0.02*(n-1)))/n;
    var d = [];
    itms.forEach(p => {
      var {fname,id,g,sub} = p;
      fname = this.svg_to_png_src(fname);
      g.width=`${100*w}%`;
      let img = this.fence_to_img(fname,id,g);
      p.out = `{${img}} {${sub}}`;
    })
    d.push(`{\\centeraligned{\\startcombination[${n}*${m}]`);
    itms.forEach(p => d.push(p.out));
    d.push(`\\stopcombination}}`);
    var text = d.join('\n');
    return text;
  }
  __rows_to_longtable(rows, style) {
    var fr = style.fr || '';
    var glue = style.glue || '';
    var nrows = rows.length? rows[0].length : 0;
    var border = style.border||0;
    var n = rows.length ? rows[0].length : 1;
    var mflag = 0;
    ///header
    if(1){
      var header = rows[0];///always the same width as n
      var rows = rows.slice(1);
      if(!header){
        header = [];
      }
      if(this.row_is_hline(rows[0])){
        mflag = 1;
        rows = rows.slice(1);
      }else if(this.row_is_dhline(rows[0])){
        mflag = 1;
        rows = rows.slice(1);
      }else if(border==1){
        mflag = 1;
      }
    }
    var d = [];
    /*
    \setuptables[split=repeat]
    \placetable[here,split][tab:sample]{sample table}
    {%
    \starttablehead
    \HL
    \VL command \NC meaning \NC\SR
    \HL
    \stoptablehead
    \starttabletail
    \HL
    \stoptabletail
    \starttables[|l|l|]
    \VL \tex{NC}  \NC next column \NC\MR
    \HL
    \VL \tex{HL}  \NC horizontal line \NC\MR
    \HL
    \VL \tex{VL}  \NC vertical line \NC\MR
    \stoptables
    }
    */
    if(1){
      d.push(`\\setuptables[split=repeat]`)
    }
    if(1){
      ///set header and footer
      d.push(`\\starttablehead`)
      if(border==1||border==2||border==3||border==4){
        d.push(`\\HL`)
      }
      d.push(this.pp_to_table_row(header,border));
      if(mflag){
        d.push(`\\HL`)
      }
      d.push(`\\stoptablehead`)
    }
    if(0){
      d.push(`\\starttabletail`)
      if(border==1||border==2||border==3||border==4){
        d.push(`\\HL`)
      }
      d.push(`\\stoptabletail`)
    }
    if(1){
      ///figure out the width of each column
      var frs = this.string_to_frs(style.fr,n);
      var gap = 0.02;
      var w = (1 - (gap * (n))) / n;
      frs = frs.map(x => x*w);
      console.log(frs);
      var pcols = frs.map(x => `s(0.01\\textwidth)p(${x}\\textwidth)s(0.01\\textwidth)`);
      var pcol = pcols.join('|');
      d.push(`\\starttables[|${pcol}|]`)
    }
    for (let j = 0; j < rows.length; j++) {
      let pp = rows[j];
      if(this.row_is_hline(pp)){
        continue;
      }
      if(this.row_is_dhline(pp)){
        continue;
      }
      d.push(this.pp_to_table_row(pp,border));
      if(border==1){
        d.push('\\HL')
      }
    }
    if(border==2||border==3||border==4){
      d.push('\\HL')
    }
    d.push(`\\stoptables`);
    var text = d.join('\n');
    return text;
  }
  __rows_to_longtable__tabulate(rows, style) {
    var fr = style.fr || '';
    var glue = style.glue || '';
    var nrows = rows.length? rows[0].length : 0;
    var border = style.border||0;
    var n = rows.length ? rows[0].length : 1;
    var mflag = 0;
    ///header
    if(1){
      var header = rows[0];///always the same width as n
      var rows = rows.slice(1);
      if(!header){
        header = [];
      }
      if(this.row_is_hline(rows[0])){
        mflag = 1;
        rows = rows.slice(1);
      }else if(this.row_is_dhline(rows[0])){
        mflag = 1;
        rows = rows.slice(1);
      }else if(border==1){
        mflag = 1;
      }
    }
    var d = [];
    /*
    \setuptabulate[split=yes,header=repeat]

    \starttabulatehead
      \FL
      \NC {\bf format char} \NC {\bf meaning} \NC \AR
      \LL
    \stoptabulatehead
    \placetable[here,split][tab:sample]{sample table}
    {%
    \starttablehead
    \HL
    \VL command \NC meaning \NC\SR
    \HL
    \stoptablehead
    \starttabletail
    \HL
    \stoptabletail
    \starttables[|l|l|]
    \VL \tex{NC}  \NC next column \NC\MR
    \HL
    \VL \tex{HL}  \NC horizontal line \NC\MR
    \HL
    \VL \tex{VL}  \NC vertical line \NC\MR
    \stoptables
    }
    */
    if(1){
      d.push(`\\setuptabulate[split=yes,header=repeat]`)
    }
    if(1){
      ///set header and footer
      d.push(`\\starttabulatehead[]`)
      if(border==1||border==2||border==3||border==4){
        d.push(`\\FL`)
      }
      d.push(this.pp_to_table_row(header,border));
      if(mflag){
        d.push(`\\LL`)
      }
      d.push(`\\stoptabulatehead`)
    }
    if(0){
      d.push(`\\starttabletail`)
      if(border==1||border==2||border==3||border==4){
        d.push(`\\HL`)
      }
      d.push(`\\stoptabletail`)
    }
    if(1){
      ///figure out the width of each column
      var frs = this.string_to_frs(style.fr,n);
      var gap = 0.02;
      var w = (1 - (gap * (n))) / n;
      frs = frs.map(x => x*w);
      console.log(frs);
      var pcols = frs.map(x => `k1p(${x}\\textwidth)`);
      var pcol = pcols.join('|');
      d.push(`\\starttabulate[|${pcol}|][distance=0pt,unit=0.01\\textwidth]`)
    }
    for (let j = 0; j < rows.length; j++) {
      let pp = rows[j];
      if(this.row_is_hline(pp)){
        continue;
      }
      if(this.row_is_dhline(pp)){
        continue;
      }
      d.push(this.pp_to_table_row(pp,border));
      if(border==1){
        d.push('\\ML')
      }
    }
    if(border==2||border==3||border==4){
      d.push('\\LL')
    }
    d.push(`\\stoptabulate`);
    var text = d.join('\n');
    return text;
  }
  pp_to_table_row(pp,border){
    if(border==1){
      return `\\VL ${pp.join(' \\VL ')} \\VL\\MR`
    }else if(border==2){
      return `\\VL ${pp.join(' \\VL ')} \\VL\\MR`
    }else if(border==3){
      return `\\VL ${pp.join(' \\NC ')} \\VL\\MR`
    }else if(border==4){
      return `\\NC ${pp.join(' \\NC ')} \\NC\\MR`
    }else {
      return `\\NC ${pp.join(' \\NC ')} \\NC\\MR`
    }
  }
  rows_to_longtable(rows, g) {
    var fr = g.fr || '';
    var glue = g.glue || '';
    var nrows = rows.length? rows[0].length : 0;
    var border = g.border||0;
    var n = rows.length ? rows[0].length : 1;
    ///***NOTE: xltabular is percular of naming its columns
    let [t, h] = this.convert_longpadding('0 0');
    //let vlines = this.string_to_array(this.conf('general.longtable_v_lines'));
    //let hlines = this.string_to_array(this.conf('general.longtable_h_lines'));
    var vrules = this.vrule_to_vbars(n,g.vrule);
    var hrule = g.hrule||'';

    if(this.row_is_hline(rows[0])){
      hlines.push('m');
      rows = rows.slice(1);
    }else if(this.row_is_dhline(rows[0])){
      hlines.push('m');
      rows = rows.slice(1);
    }
    var d = [];
    /// adjust for the relative width
    var frs = this.string_to_frs(fr, nrows);
    var frs = this.ww_to_one(frs);
    var pp = frs.map((x, i) => `\\setupTABLE[c][${i + 1}][width=${x}\\textwidth]`);
    d.push(pp.join('\n'));
    /// setup for hlines
    d.push(`\\setupTABLE[frame=off]`);
    if(1){
      if(hrule=='---'){ 
        d.push(`\\setupTABLE[r][each][topframe=on]`);
        d.push(`\\setupTABLE[r][each][bottomframe=on]`);
      }else if(hrule=='--'){
        d.push(`\\setupTABLE[r][first][topframe=on]`);
        d.push(`\\setupTABLE[r][last][bottomframe=on]`);
      }else if(hrule=='-'){
        d.push(`\\setupTABLE[r][each][topframe=on]`);
        d.push(`\\setupTABLE[r][each][bottomframe=on]`);
        d.push(`\\setupTABLE[r][first][topframe=off]`);
        d.push(`\\setupTABLE[r][last][bottomframe=off]`);
      }
      if(rows.length && rows[0].lower){
        d.push(`\\setupTABLE[r][first][bottomframe=on]`);
      }
    }
    if(1){
      for (var j = 1; j <= vrules.length; j++) {
        d.push(`\\setupTABLE[c][${j}][leftframe=${vrules[j-1] ? 'on' : 'off'}]`);
        d.push(`\\setupTABLE[c][${j}][rightframe=${vrules[j] ? 'on' : 'off'}]`);
      }
    }
    //get pp0
    var pp0 = rows[0];///always the same width as n
    var pp0 = pp0.map(p => p.text);
    var rows = rows.slice(1);
    if(!pp0){
      pp0 = [];
    }
    let hl = `0`;
    /// writing table
    d.push(`\\bTABLE[loffset=${hl}pt,roffset=${hl}pt,toffset=${t}pt,boffset=${t}pt,split=repeat,option=stretch]`);
    d.push(`\\bTABLEhead`);
    d.push(`\\bTR \\bTH ${pp0.join(' \\eTH \\bTH ')} \\eTH \\eTR`);
    d.push(`\\eTABLEhead`);
    d.push(`\\bTABLEbody`);
    for (let j = 0; j < rows.length; j++) {
      let pp = rows[j];
      if(this.row_is_hline(pp)){
        continue;
      }
      if(this.row_is_dhline(pp)){
        continue;
      }
      var mypp = pp.map(p => `{${p.text}}`);
      d.push(`\\bTR \\bTD ${mypp.join(' \\eTD \\bTD ')} \\eTD \\eTR`);
    }
    d.push(`\\eTABLEbody`);
    d.push(`\\eTABLE`);
    var text = d.join('\n');
    return text;
  }
  itms_to_cols(itms, n) {
    var n = parseInt(n);
    var n = n || 1;
    var m = Math.floor(itms.length / n);
    var z = itms.length - n * m;
    var k = z ? (m + 1) : (m);
    var cols = [];
    for (var j = 0; j < itms.length; j += k) {
      var pp = itms.slice(j, j + k);
      cols.push(pp);
    }
    var d = [];
    var pcol = 'l'.repeat(n);
    var pcols = pcol.split('');
    var pcol = pcols.join('|');
    var pcol = `|${pcol}|`;
    var h = 4;
    var t = 0;
    d.push(`\\starttabulate[${pcol}]`);
    for (var j = 0; j < k; ++j) {
      var pp = cols.map(x => x[j] || '');
      d.push(`\\NC ${pp.join(' \\NC ')} \\NC \\NR`);
    }
    d.push('\\stoptabulate');
    return d.join('\n');
  }
  lang_to_cjk(s,fn){
    switch(fn) {
      case 'cn': {
        return `\\switchtobodyfont[cn]{${s}}`
        break;
      }
      case 'tw': {
        return `\\switchtobodyfont[tw]{${s}}`
        break;
      }
      case 'jp': {
        return `\\switchtobodyfont[jp]{${s}}`
        break;
      }
      case 'kr': {
        return `\\switchtobodyfont[kr]{${s}}`
        break;
      }
    }
    return s;
  }
  to_margined_text(pp,parsep,leftmargin){
    let d = [];
    if(pp.length){
      if(typeof leftmargin==='number'){
        d.push(`\\startitemize[packed]`);
      }else{
        d.push(`\\startitemize[packed]`);
      }
      pp.forEach((p) => {
        if(p.item && p.hfill && p.latex){
          d.push(`\\sym {${p.item}} \n\n${p.latex}`)
        }else if(p.item && p.latex){
          d.push(`\\sym {${p.item}} ${p.latex}`)
        }else if(p.item){
          d.push(`\\sym {${p.item}}`)
        }else if(p.latex){
          d.push(`\\sym {} ${p.latex}`)
        }else{
          console.log('error, no p.item or p.latex');
        }
      })
      d.push(`\\stopitemize`);
    }
    return d.join('\n')
  }
  ss_to_contex_table_row_s(ss,n,vrule){
    var vbars = this.vrule_to_vbars(n,vrule);
    var all = [];
    for(var j=0; j < n; ++j){
      if(vbars[j]=='|'||vbars[j]=='||'){
        all.push('\\VL');
      }else{
        all.push('\\NC')
      }
      all.push(ss[j]||'');
    }
    if(vbars[n]=='|' || vbars[n]=='||'){
      all.push('\\VL\\MR');
    }else{
      all.push('\\NC\\MR');
    }
    return all.join(' ');
  }
  halign_to_contex_pcols(n,halign) {
    /// \begin{tabular}{lcr}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var pcols = this.string_to_array(halign||'');
    var re_lcr = /^[lcr]$/;
    var re_pw = /^p\((.*)\)$/;
    pcols = pcols.map((x) => {
      if(re_lcr.test(x)){
        return x;
      }
      else if(re_pw.test(x)){
        var w = re_pw.exec(x)[1];
        w = this.string_to_contex_width(w,1,'');
        if(w){
          return `p(${w})`
        }else{
          return 'l';
        }
      }
      else {
        return null;
      }
    });
    pcols = pcols.filter((x) => x);
    while(pcols.length < n){
      pcols.push('l');
    }
    pcols = pcols.slice(0,n);
    return pcols;
  }
  ss_to_contex_externalfigure(ss,style){
    var fname = this.choose_latex_image_file(ss);
    this.imgs.push(fname);
    var width = this.string_to_contex_width(style.width,style.zoom);
    var height = this.string_to_contex_height(style.height,style.zoom);
    /// in figure
    var opts = [];
    if(width && height){
      opts.push(`width=${width}`);
      opts.push(`height=${height}`);
    }else if(width){
      opts.push(`width=${width}`);
    }else if(height){
      opts.push(`height=${height}`);
    }
    var text = `\\externalfigure[${fname}][${opts.join(',')}]`;
    if(style.outline){
      text = `\\framed{${text}}`
    }
    return text;    
  }
  to_tabulate_lcr_pcol(n,g){
    ///\blank\noindent \hbox{\starttabulate[|k5l|k1l|k5l|k5l|k5l|k5l|][distance=0pt,unit=0.1em,before={},after={}]
    var vbars = this.vrule_to_vbars(n,g.vrule)
    var pcols = this.string_to_array(g.halign);
    var re = /^[lcr]$/;
    pcols = pcols.filter(x => re.test(x));
    while(pcols.length < n){
      pcols.push('l');
    }
    pcols = pcols.map(x => `k5${x}`);
    var my = [];
    pcols.forEach((x,i) => {
      if(i > 0 && vbars[i]=='||'){
        my.push('|');
        my.push(`k1l`);
      }
      my.push('|');
      my.push(x); 
    })
    my.push('|');
    return my.join('');
  }
  itms_to_lines(itms,style) {
    var o = [];
    o.push('\\startlines')
    itms.forEach((x) => {
      o.push(this.uncode(x.text));
    })
    o.push('\\stoplines')
    return o.join('\n');
  }
  rows_to_tabular(rows,g){
    var o = [];
    rows.forEach((pp,j,arr) => {
      if(pp.upper==2){
        o.push('\\HL');
        o.push('\\HL');
      }else if(pp.upper==1){
        o.push('\\HL');
      }
      var myss = pp.map((p) => {
        return p.text;
      });
      var n = myss.length;
      var s = this.ss_to_contex_table_row_s(myss,n,g.vrule);
      o.push(s);
      if(j+1==arr.length){
        if(pp.lower==2){
          o.push('\\HL');
          o.push('\\HL');
        }else if(pp.lower==1){
          o.push('\\HL');
        }
      }
    });
    return o.join('\n');
  }
}

module.exports = { NitrilePreviewContex };
