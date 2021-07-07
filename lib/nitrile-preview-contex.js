'use babel';

const { NitrilePreviewDiagramMF } = require('./nitrile-preview-diagrammf');
const { NitrilePreviewCmath } = require('./nitrile-preview-cmath');
const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');

class NitrilePreviewContex extends NitrilePreviewTranslator {

  constructor(parser) {
    super(parser);
    this.name='CONTEX';
    this.program = 'context';
    this.style = parser.style;
    this.tokenizer = new NitrilePreviewCmath(this);
    this.diagram = new NitrilePreviewDiagramMF(this);
    this.imgs = [];
    this.flags = {};
    this.enumerate_counter = 0;
    this.symbol_name_map = this.tokenizer.symbol_name_map;
    this.symbol_cc_map = this.tokenizer.symbol_cc_map;
    this.icon_bullet       = '{\\textbullet}';
    this.icon_circlebox    = '\\symbol[martinvogel 2][CircSteel]'                       
    this.icon_circleboxo   = '\\symbol[martinvogel 2][CircPipe]'                       
    this.icon_squarebox    = '\\symbol[martinvogel 2][SquareSteel]'
    this.icon_squareboxo   = '\\symbol[martinvogel 2][SquarePipe]'
    this.icon_writing_hand = '\\symbol[martinvogel 2][WritingHand]';
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////////
  hdgs_to_part(title,label,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    o.push('');
    o.push(`\\startpart[title={${title}},reference={${label}},bookmark={${raw}}]`);
    o.push(title);
    o.push(`\\stoppart`)
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    o.push('');
    o.push(`\\startchapter[title={${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  }
  hdgs_to_section(title,label,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    o.push('');
    o.push(`\\startsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  } 
  hdgs_to_subsection(title,label,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    o.push('');
    o.push(`\\startsubsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  } 
  hdgs_to_subsubsection(title,label,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    o.push('');
    o.push(`\\startsubsubsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  }
  //////////////////////////////////////////////////////////////////////////
  ///
  //////////////////////////////////////////////////////////////////////////
  item_dl_to_text(i,item,nblank){
    var o = [];
    var value = this.uncode(item.style,item.value);
    if(Array.isArray(item.values)){
      value = item.values.map((s) => this.uncode(item.style,s)).join('\\\\');
    }
    var text = this.uncode(item.style,item.text).trim();
    if(text.length==0){
      text = '~';///this is important: if 'text' is empty then it tends to join up the next paragraph
    }else{
      text = '\\crlf '+text;
    }
    if(!nblank){
      o.push(`\\startDLpacked{${value}} ${text} `);           
    }else{
      o.push(`\\startDL{${value}} ${text} `);           
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`${this.untext(p.style,p.lines)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize)}`);
        }
      });
    }
    if(!nblank){
      o.push(`\\stopDLpacked`);
    }else{
      o.push(`\\stopDL`);
    }
    return o.join('\n\n');
  }
  item_hl_to_text(i,item,nblank){
    var o = [];
    var text = this.polish_verb(item.style,item.text);
    var text = `{\\tt ${text}}`;
    if(!nblank){
      o.push(`\\startHLpacked{}${text} `);
    }else{
      o.push(`\\startHL{}${text} `);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`${this.untext(p.style,p.lines)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize)}`);
        }
      });
    }
    if(!nblank){
      o.push(`\\stopHLpacked`);
    }else{
      o.push(`\\stopHL`);
    }
    return o.join('\n\n');
  }
  item_ol_to_text(i,item,nblank){
    var o = [];
    var text = this.uncode(item.style,item.text);
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
      o.push(`\\item{}${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`\\noindent\n${this.untext(p.style,p.lines)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ul_to_text(i,item,nblank){
    var o = [];
    var text = this.uncode(item.style,item.text);
    o.push(`\\item{}${text}`);
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          o.push(`\\noindent\n${this.untext(p.style,p.lines)}`);
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(p.itemize)}`);
        }
      });
    }
    return o.join('\n\n')
  }
  itemize_to_text(itemize){
    var bull = itemize.bull;
    var items = itemize.items;
    var nblank = itemize.nblank;
    var nowhitespace = 0;
    var o = [];
    var test_list = [];
    switch (bull) {
      case 'DL': {
        nowhitespace = 1;
        let last_o = [];
        items.forEach((item,j) => {
          let p = (last_o.length) ? last_o[last_o.length-1] : null;
          if(p && p.text.trim().length==0 && p.more.length==0){
            last_o.push(item);
            let values = last_o.map((p) => p.value);
            item.values = values;
            let text = this.item_dl_to_text(j,item,nblank);
            o.pop();
            o.push(text);
          }else{
            last_o = [];
            last_o.push(item);
            let text = this.item_dl_to_text(j,item,nblank);
            o.push(text);
          }
        });
        break;
      }
      case 'HL': {
        nowhitespace = 1;
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(j,item,nblank);
          o.push(text);
        });
        break;
      }
      case 'OL': {
        if(!nblank){
          o.push(`\\startitemize[n,packed][inbetween={},before={},after={}]`);
        }else{
          o.push(`\\startitemize[n][inbetween={},before={},after={}]`);
        }
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(j,item,nblank);
          o.push(text);
        });
        o.push('\\stopitemize')
        break;
      }
      case 'UL': {
        if(!nblank){
          o.push(`\\startitemize[packed][inbetween={},before={},after={}]`);
        }else{
          o.push(`\\startitemize[][inbetween={},before={},after={}]`);
        }
        items.forEach((item,j) => {
          let text = this.item_ul_to_text(j,item,nblank);
          o.push(text);
        });
        o.push('\\stopitemize')
        break;
      }
    }
    if(nblank){
      return o.join('\n\n');
    }
    if(nowhitespace){
      return o.join('\n\\nowhitespace\n');
    }
    return o.join('\n\n');
  }
  //////////////////////////////////////////////////////////////////////////
  ///
  //////////////////////////////////////////////////////////////////////////
  do_HRLE(block){
    var {style,title} = block;
    var o = [];
    o.push('');
    title = this.uncode(style,title);
    o.push(`\\startformula`);
    o.push(`\\text{\\hl[10]}`);
    o.push(`\\stopformula`);
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
  ////////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  ////////////////////////////////////////////////////////////////////////////////////////////
  fence_to_parbox(style,ss) {
    var contex_width = this.string_to_contex_width(style.width,1,'\\textwidth');
    var texts = ss.map((s) => this.uncode(style,s));
    var text = texts.join('\\crlf\n');
    var text = `\\hbox{\\starttable[|p(${contex_width})|]\\NC{${text}}\\MR\\stoptable}`;
    var o = [];
    o.push({img:text});
    return o;
  }
  fence_to_displaymath(style,ss) {
    var str = ss.join('\n');
    var used = new Set();
    var text = this.tokenizer.to_cmath(str,style,used,1);
    var text = `\\startformula{${text}}\\stopformula`;
    var o = [];
    o.push({img:text});
    return o;
  }
  fence_to_ink(style,ss){
    var { text } = this.diagram.to_ink(style,ss);
    var o = [];
    o.push({img:text});
    return o;
  }
  fence_to_tabular(style,ss){
    ///'figure', 'table', and 'longtable'
    if(style.float){
      var rows = this.ss_to_tabular_rows(ss,style);
      var rows = this.update_rows_by_hrule(rows,style.hrule);
      rows.forEach((pp) => {
        pp.forEach((p) => {
          p.text = this.uncode(style,p.raw);
          if(p.text.length==0){
            p.text = '~';
          }
        })
      })
      var n = rows.length ? rows[0].length : 1;
      let [t, h] = this.convert_longpadding('0 0');
      var vrules = this.vrule_to_vbars(n,style.vrule);
      var ww = this.halign_to_contex_width(n,style.halign);
      var all = [];
      /// setup for hlines
      if(0){
        if(style.hrule=='---'){ 
          all.push(`\\setupTABLE[r][each][topframe=on]`);
          all.push(`\\setupTABLE[r][each][bottomframe=on]`);
        }else if(style.hrule=='--'){
          all.push(`\\setupTABLE[r][first][topframe=on]`);
          all.push(`\\setupTABLE[r][last][bottomframe=on]`);
        }else if(style.hrule=='-'){
          all.push(`\\setupTABLE[r][each][topframe=on]`);
          all.push(`\\setupTABLE[r][each][bottomframe=on]`);
          all.push(`\\setupTABLE[r][first][topframe=off]`);
          all.push(`\\setupTABLE[r][last][bottomframe=off]`);
        }
      }
      let hl = `4`;
      /// writing table
      var opts=[];
      opts.push(`loffset=${hl}pt`);
      opts.push(`roffset=${hl}pt`);
      opts.push(`toffset=${t}pt`);
      opts.push(`boffset=${t}pt`);
      opts.push(`split=repeat`);
      if(this.g_to_stretch_float(style)==1){
        opts.push(`option=stretch`);
      }
      if(style.small){
        opts.push(`style=small`);
      }
      all.push(`\\bTABLE[${opts.join(',')}]`);
      ///add configuration entries
      if(1){
        all.push(`\\setupTABLE[frame=off]`);
      }
      if(0){
        for (var j = 1; j <= rows.length; j++) {
          if(rows[j-1].upper){
            all.push(`\\setupTABLE[r][${j}][topframe=on]`);
          }
          if(rows[j-1].lower){
            all.push(`\\setupTABLE[r][${j}][bottomframe=on]`);
          }
        }
      }
      if(1){
        //take care of the topframe of the first row
        for (var j = 1; j <= rows.length; j++) {
          if(rows[j-1].upper==1){
            all.push(`\\setupTABLE[r][${j}][topframe=on]`);
          }else if(rows[j-1].upper==1){
            all.push(`\\setupTABLE[r][${j}][topframe=on]`);
          }
          break;
        }
      }
      if(0){
        for (var j = 1; j <= vrules.length; j++) {
          all.push(`\\setupTABLE[c][${j}][leftframe=${vrules[j-1] ? 'on' : 'off'}]`);
          all.push(`\\setupTABLE[c][${j}][rightframe=${vrules[j] ? 'on' : 'off'}]`);
        }
      }
      if(0){
        ///take care of the leftframe of the first column
        ///dont do that anymore, this is to cause a left frame to appear for a double-hrule row
        for (var j = 0; j < vrules.length; j++) {
          let rule = vrules[j];
          if(rule=='||' || rule=='|'){
            all.push(`\\setupTABLE[c][1][leftframe=on]`);  
          }
          break;
        }
      }
      if(1){
        ww.map((x, i) => {
          if(x){
            all.push(`\\setupTABLE[c][${i + 1}][width=${x}]`);
          }
        });  
      }
      for (let j = 0; j < rows.length; j++) {
        if(j==0 && style.head){
          all.push(`\\bTABLEhead`);
          let pp = rows[j];
          var myrowtext = this.pp_to_btable_row_text(pp,vrules,'\\bTH','\\eTH');
          if(pp.lower==2){
            all.push(`\\bTR[bottomframe=on] ${myrowtext} \\eTR`);
            all.push(`\\bTR[bottomframe=on,height=1.50pt] \\eTR`);
          }else if(pp.lower==1){
            all.push(`\\bTR[bottomframe=on] ${myrowtext} \\eTR`);
          }else{
            all.push(`\\bTR[] ${myrowtext} \\eTR`);
          }
          all.push(`\\eTABLEhead`);
        }else{
          all.push(`\\bTABLEbody`);
          let pp = rows[j];
          var myrowtext = this.pp_to_btable_row_text(pp,vrules,'\\bTD','\\eTD');
          if(pp.lower==2){
            all.push(`\\bTR[bottomframe=on] ${myrowtext} \\eTR`);
            all.push(`\\bTR[bottomframe=on,height=1.50pt] \\eTR`);
          }else if(pp.lower==1){
            all.push(`\\bTR[bottomframe=on] ${myrowtext} \\eTR`);
          }else{
            all.push(`\\bTR[] ${myrowtext} \\eTR`);
          }
          all.push(`\\eTABLEbody`);
        }
      }
      all.push(`\\eTABLE`);
      var text = all.join('\n');
      var o = [];
      o.push({img:text,sub:''});
      return o;
    }else{
      ///regular table, use 'starttabulate' 
      /// because it "flows" with the text, such that if it is inside a 
      /// itemized env it will be indented like normal text would, 
      /// in addition, two '\HL' would have generated a double horizontal rule
      var rows = this.ss_to_tabular_rows(ss,style);
      var rows = this.update_rows_by_hrule(rows,style.hrule);
      rows.forEach((pp) => {
        pp.forEach((p) => {
          p.text = this.uncode(style,p.raw);
          if(p.text.length==0){
            p.text = '~';
          }
        })
      })
      if(style.head && rows.length){
        let pp0 = rows[0];
        pp0.forEach((p) => {
          p.text = `{\\bold ${p.text}}`;
        });
      }
      var n = (rows.length) ? rows[0].length : 1;
      if(1){
        let d = [];
        var ww = this.halign_to_contex_ww(n,style.halign);
        var ww = ww.map((s) => `s2${s}`);
        var pcol = ww.join('|');
        ///***the 'frame=off' option ensures that the table will be indented if placed inside a 'startitemize'
        d.push(`\\starttabulate[|${pcol}|]`);
        ////////
        //let title_text = this.uncode(style,title);
        //d.push(`\\NC \\use{${n}}\\ReFormat[c]{${title_text}} \\MR`)
        ////////
        d.push(this.rows_to_tabular(rows,style));
        d.push(`\\stoptabulate`);
        var text = d.join('\n');
        if(style.small){
          text = `{\\small${text}}`;
        }
      }
      var o = [];
      o.push({img:text,sub:''});
      return o;
    }
  }
  fence_to_diagrams(style,ss){
    return this.diagram.to_diagrams(style,ss);
  }
  fence_to_diagram(style,ss){
    var { img, sub } = this.diagram.to_diagram(style,ss);
    var o = [];
    o.push({img,sub});
    return o;
  }
  fence_to_img(style,ss) {
    ///\externalfigure[cow.pdf][width = 1cm]
    ///\externalfigure[cow.pdf][height = 1cm]
    var [srcs,subtitle] = this.ss_to_img_srcs_and_subtitle(ss,style);
    var fname = this.choose_contex_image_file(srcs);
    this.imgs.push(fname);
    /// in figure
    var opts = [];
    if(style.stretch){
      opts.push(`width=${style.stretch}\\textwidth`);
    }else if(style.width && style.height){
      opts.push(`width=${style.width}mm`);
      opts.push(`height=${style.height}mm`);
    }else if(style.width){
      opts.push(`width=${style.width}mm`);
    }else if(style.height){
      opts.push(`height=${style.height}mm`);
    }
    if(style.frame){
      opts.push(`frame=on`);
    }
    var img = `\\externalfigure[${fname}][${opts.join(',')}]`;
    var sub = this.uncode(style,subtitle);
    img = `\\hbox{${img}}`;
    var o = [];
    o.push({img,sub});
    return o;
  }
  fence_to_verbatim(style,ss){
    var d = [];
    if(style.small){
      d.push('\\starttabulate[|l|][bodyfont=small]');
    }else{
      d.push('\\starttabulate[|l|]');
    }
    ss.forEach( (s,j,arr) => {
      s = this.polish_verb(style,s);
      if (!s) {
        s = "~";
      }
      s = `\\NC \\tt ${s} \\NR`;
      d.push(s);
    });
    d.push('\\stoptabulate');
    var text = d.join('\n')
    if(style.frame){
      text = `\\framed{${text}}`;
    }
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_center(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var d = [];
    d.push('');
    d.push(`\\startalignment[center]`);
    d.push(text);
    d.push(`\\stopalignment`);
    var text = d.join('\n');
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_flushright(style,ss){
    var text = this.join_para(ss);
    var text = this.uncode(style,text);
    var d = [];
    d.push('');
    d.push(`\\startalignment[flushright]`);
    d.push(text);
    d.push(`\\stopalignment`);
    var text = d.join('\n');
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  fence_to_list(style,ss) {
    let itms = this.ss_to_lines_itms(ss,style);
    var bullet     = this.icon_bullet; 
    var circlebox = this.uncode(this.style,String.fromCodePoint(0x25C6));
    var circleboxo = this.uncode(this.style,String.fromCodePoint(0x25C7)); 
    var squarebox = this.uncode(this.style,String.fromCodePoint(0x25A0));
    var squareboxo = this.uncode(this.style,String.fromCodePoint(0x25A1)); 
    const check_ss = this.string_to_array(this.assert_string(style.check)); 
    itms.forEach((p,i,arr) => {
      if(p.text=='\\\\'){
        p.text = '~';
      }else{
        p.text = this.uncode(style,p.text);
      }
      p.bull = this.uncode(style,p.bull);
      p.value = this.uncode(style,p.value);
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
      else if(p.type == 'INDENTED'){
        //indented
        p.indented = 1;
        p.latex = `${p.text}`;
      }
      else{
        ///for other types, the hangindent is not set
        p.item = '';
        p.latex = `${p.text}`;
      }
    });
    var all = [];
    all.push('\\starttabulate[|l|]');
    itms.forEach((p,i,arr) => {
      if(p.indented){
        let s = '~'.repeat(p.value);
        all.push(`\\NC ${s} ${p.latex} \\NC\\NR`);
      }else if(p.item && p.hfill && p.latex){
        all.push(`\\NC ${p.item} ${p.latex} \\NC\\NR`)
      }else if(p.item && p.latex){
        all.push(`\\NC ${p.item} ${p.latex} \\NC\\NR`)
      }else if(p.item){
        all.push(`\\NC ${p.item} \\NC\\NR`)
      }else if(p.latex){
        all.push(`\\NC ${p.latex} \\NC\\NR`)
      }else{
        console.log('error, no p.item or p.latex');
      }
    });
    all.push('\\stoptabulate');
    var text = all.join('\n');
    if(style.frame){
      text = `\\framed{${text}}`;
    }
    var o = [];
    o.push({img:text,sub:''});
    return o;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////////////////////////////
  float_to_paragraph(title,label,style,body){
    var all = [];
    var text = this.untext(style,body);
    all.push('');
    all.push(text);
    return all.join('\n');
  }
  float_to_indent(title,label,style,body){
    var all = [];
    var text = this.untext(style,body);
    all.push('');
    all.push('\\startnarrower[1*left,0*right]');
    all.push(text);
    all.push('\\stopnarrower')
    return all.join('\n');
  }
  float_to_primary(title,label,style,body,rank){
    var all = [];
    all.push('');
    const indent = '~'.repeat(5);
    title = this.uncode(style,title);
    let s0 = body[0] || '';
    var text = this.untext(style,body);
    if (rank===0) {
      text = `{\\bf{}${title}}  ${s0 ? '' : '~'} ${text}`;
      all.push(`\\blank\\noindent ${text}`);
      this.needblank = 1;
    }
    else if (rank===1) {
      text = `{\\bf{}${title}}  ${s0 ? '' : '~'} ${text}`;
      all.push(`\\blank\\noindent ${text}`);
      this.needblank = 1;
    } 
    else if (rank===2) {
      text = `{\\bi{}${title}}  ${s0 ? '' : '~'} ${text}`;
      all.push(`\\blank\\noindent ${text}`);
      this.needblank = 1;
    } 
    else {
      text = `{\\bi{}${title}}  ${s0 ? '' : '~'} ${text}`;
      all.push(`\\blank\\noindent ${indent}${text}`);
      this.needblank = 1;
    }
    return all.join('\n');
  }
  float_to_sample(title,label,style,body){
    var all = [];
    all.push('');
    all.push('\\startnarrower[1*left,0*right]');
    all.push('\\startlines');
    body.forEach( (s) => {
      s = this.polish_verb(style,s);
      if (!s) {
        s = "~";
      }
      s = `{\\tt ${s}}`;
      all.push(s);
    });
    all.push('\\stoplines');
    all.push('\\stopnarrower');
    return all.join('\n')
  }
  float_to_itemize(title,label,style,itemize){
    var all = [];
    var text = this.itemize_to_text(itemize);
    all.push('');
    all.push(text);
    return all.join('\n');
  }
  float_to_figure(title,label,style,ss){
    style={...style,label,title,float:'figure'};
    var itms = this.ss_to_figure_itms(ss,style);
    var title = this.uncode(style,title).trim();
    var none = this.assert_int(style.nocaption);
    let wrap = style.wrap=='left'?'left':'right';
    if(style.wrap){
      var all = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          if(p.sub){
            var text = `\\placefigure[${wrap}][]{${p.sub}}{${p.img}}`;  
          }else{
            var text = `\\placefigure[${wrap},none][]{}{${p.img}}`;
          }
          all.push(text);
        }
      });
      return all.join('\n')
    }
    else if(style.subfigure){
      var all = [];
      let d = [];
      all.push('');
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          p.sub = `(${this.to_a_letter(p.seq)}) ${p.sub}`
          d.push( `{${p.img}} {${p.sub}}` );
          let s = `\\hbox{\\startcombination[${d.length}*1]\n${d.join('\n')}\n\\stopcombination}`;   
          all.pop();
          all.push(s);         
        }else{
          d = [];
          all.push(`\\crlf`);
          all.push('');
        }
      });
      var o = [];
      o.push('')
      o.push(`\\placefigure`);
      if(none && !title){
        o.push(`[here,none]`);
      }else if(none && title){
        o.push(`[here]`);
      }else{
        o.push(`[here]`);
      }
      o.push(`[${label}]`);
      o.push(`{${title}}`);
      o.push(`{\\startalignment[center]%`);
      all.forEach((s) => {
        o.push(s)
      })
      o.push('\\stopalignment}');
      return o.join('\n');
    }
    else{
      var all = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          all.push(`\\hbox{\\startcombination[1*1] {${p.img}} {} \\stopcombination}`);
        }
      });
      var o = [];
      o.push('')
      o.push(`\\placefigure`);
      if(none && !title){
        o.push(`[here,none]`);
      }else if(none && title){
        o.push(`[here]`);
      }else{
        o.push(`[here]`);
      }
      o.push(`[${label}]`);
      o.push(`{${title}}`);
      o.push(`{\\startalignment[center]%`);
      o.push(`\\dontleavehmode%`);
      all.forEach((s) => {
        o.push(s)
      })
      o.push('\\stopalignment}');
      return o.join('\n');
    }
  }
  float_to_table(title,label,style,ss){
    style={...style,label,title,float:'table'};
    var itms = this.ss_to_figure_itms(ss,style);
    var title = this.uncode(style,title).trim();
    var none = this.assert_int(style.nocaption);
    if(style.wrap){
      var all = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          all.push(p.img);
        }
      });
      var text = all.join('\n')
      let wrap = style.wrap=='left'?'left':'right';
      text = `\n\\placetable[${wrap},none][]{}{${text}}`;
      return text;
    }
    if(style.subfigure){
      var all = [];
      let d = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          p.sub = `(${this.to_a_letter(p.seq)}) ${p.sub}`
          d.push( `{${p.img}} {${p.sub}}` );
          let s = `{\\startcombination[${d.length}*1]\n${d.join('\n')}\n\\stopcombination}`;   
          all.pop();
          all.push(s);         
        }else{
          d = [];
          all.push(`\\crlf`);
          all.push('');
        }
      });
      var o = [];
      o.push('')
      o.push(`\\placetable`);
      if(none && !title){
        o.push(`[here,none]`);
      }else if(none && title){
        o.push(`[here]`);
      }else{
        o.push(`[here]`);
      }
      o.push(`[${label}]`);
      o.push(`{${title}}`);
      o.push(`{\\startalignment[center]%`);
      all.forEach((s) => {
        o.push(s)
      })
      o.push('\\stopalignment}');
      return o.join('\n');
    }else{
      var all = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          all.push(`{\\startcombination[1*1] {${p.img}} {} \\stopcombination}`);
        }
      });
      var o = [];
      o.push('')
      o.push(`\\placetable`);
      if(none && !title){
        o.push(`[here,none]`);
      }else if(none && title){
        o.push(`[here]`);
      }else{
        o.push(`[here]`);
      }
      o.push(`[${label}]`);
      o.push(`{${title}}`);
      o.push(`{\\startalignment[center]%`);
      o.push(`\\dontleavehmode%`);
      all.forEach((s) => {
        o.push(s)
      })
      o.push('\\stopalignment}');
      return o.join('\n');
    }
  }
  float_to_equation(title,label,style,ss){
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='bundle'){
        all.push(p.img);
      }
    });
    var text = all.join('\n');
    if(label){
      var o = [];
      o.push('');
      o.push(`\\placeformula[${label}]`)
      o.push(text);
      return o.join('\n')
    }else{
      var o = [];
      o.push('');
      o.push(`\\placeformula[+]`)
      o.push(text);
      return o.join('\n')
    }
  }
  float_to_listing(title,label,style,ss){
    var ss = this.trim_samp_body(ss);
    var title = this.uncode(style,title).trim();
    var none = this.assert_int(style.nocaption);
    var o = [];
    o.push('\\starttabulate[|Tl|][bodyfont=small]');
    ss.forEach( (s,j,arr) => {
      s = this.polish_verb(style,s);
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
    o.push(`[here,split,${none?'none':''}]`);
    o.push(`[${label}]`);
    o.push(`{${this.uncode(style,title)}}`);
    o.push(`{${text}}`)
    return o.join('\n');
  }
  float_to_longtable(title,label,style,ss) {
    style = {...style,title,label,float:'longtable'};
    var itms = this.ss_to_figure_itms(ss,style);
    var all = [];
    for(let itm of itms){
      if(itm.type=='bundle' && itm.key=='tabular'){
        var text = itm.img;
        text = `\\placetable[split][${label}]{${this.uncode(style,title)}}{${text}}`;
        all.push(text);
      }
    }
    return all.join('\n');
  }
  float_to_tabbing(title,label,style,body) {
    var cols = this.ss_to_clusters(body);
    var cols = cols.map((ss) => ss.map((s) => this.uncode(style,s)));
    var n = cols.length;
    var rows = this.cols_to_rows(cols);
    if(cols.length==1){
      var rows = this.col_one_to_rows(cols[0]);
      n = rows[0].length;
    }
    var gap = parseFloat(style.gap)||0.02;
    var strut = parseFloat(style.strut)||0;
    var frs = this.string_to_frs_with_gap(style.fr||'',n,gap);
    var all = [];
    var tabsets = [];
    var sum = 0;
    var pcol = 'p'.repeat(n).split('').join('|');
    all.push(`\\starttabulate[|${pcol}|]`);
    rows.forEach((ss) => {
      let s = ss.join(' \\NC ')
      s = `\\NC ${s} \\NC\\NR`;
      all.push(s);
    })
    all.push(`\\stoptabulate`)
    var text = all.join('\n');//cannot use hbox here because we expect the tabbing to run across pages
    if(style.small){
      text = `{\\small\n${text}}`;
    }
    return text;
  }
  float_to_columns(title,label,style,ss){
    var clusters = this.ss_to_clusters(ss);
    var texts = clusters.map((ss) => this.untext(style,ss));
    var o = [];
    var n = this.assert_int(style.n,2);
    var total = texts.length;
    o.push('');
    for(let j=0; j < total; j+=n){
      o.push(`\\startcolumns[n=${n}]`);
      for(let i=0; i < n; ++i){
        var text = texts.shift();
        var text = text||'';
        if(i>0){
          o.push('\\column');
        }
        if(text){
          o.push(text);
        }else{
          o.push('~');
        }
      }
      o.push(`\\stopcolumns`);
    }
    return o.join('\n');
  }
  float_to_blockquote(title,label,style,ss){
    var clusters = this.ss_to_clusters(ss);
    clusters = clusters.map((ss) => {
      var s = this.join_para(ss);
      var s = this.uncode(style,s);
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
  do_ruby(items){
    ///***IMPORTANT: this is current the working version but is currently disabled for CONTEX translation because the \ruby{} command support seems to be broken in the 2020 release of TexLive */
    let o = [];
    for(let item of items){
      o.push(`\\ruby{${item[0]}}{${item[1]}}`);
    }
    let text = o.join('');
    return text;
  }
  __do_ruby(items){
    ///***IMPORTANT:a dummpy function that current disables any placing of \ruby commands---this is to address the
    ///  fact that current release of CONTEX is broken
    let o = [];
    for(let item of items){
      o.push(item[0]);
    }
    let text = o.join('');
    return text;
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
    return this.string_to_css_width(s,zoom,def);
  }
  string_to_contex_height(s,zoom,def='') {
    return this.string_to_css_height(s,zoom,def);
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

  polish_verb(style,unsafe){
    let myhyp = `-${String.fromCodePoint('0x200B')}`
    let mydot = `.${String.fromCodePoint('0x200B')}`
    unsafe = this.polish(style,unsafe);
    unsafe = unsafe.replace(/\s/g, "~")
    unsafe = unsafe.replace(/\-/g,myhyp);
    unsafe = unsafe.replace(/\./g,mydot);
    //unsafe = unsafe.replace(/\-/g,String.fromCodePoint('0x2212'));
    //unsafe = unsafe.replace(/\-/g,'{\\texthyphen}');
    //unsafe = unsafe.replace(/\./g,'{\\textperiod}');
    //unsafe = unsafe.replace(/\-/g,String.fromCodePoint('0xFE52'));
    return unsafe;
  }
  ///
  ///this does not convert entity symbols:q
  ///
  polish(style,line){
    line=''+line;
    const re_char   = /^(.)(.*)$/s;
    var safe='';
    var v;
    var s;
    while(line.length){
      if(line.codePointAt(0)>0xFFFF){
        s = line.slice(0,2);
        line = line.slice(2);
      }else{
        s = line.slice(0,1);
        line = line.slice(1);
      }
      let cc = s.codePointAt(0);
      if(this.tokenizer.symbol_cc_map.has(cc)){
        let {ctex,cmath,fonts} = this.tokenizer.symbol_cc_map.get(cc);
        s = this.tokenizer.get_ctex_symbol(ctex,cmath,cc,fonts);
      }
      safe+=s;
      continue;
    }
    ///always call fontify cjk
    safe = this.fontify_cjk(safe);
    safe = this.rubify_cjk(safe,style.vmap);
    return safe;
  }
  ///
  /// Replace all Unicode phrases and fontify CJK and others
  ///
  smooth (line) {
    line=''+line;
    const re_entity = /^&([A-Za-z][A-Za-z0-9]*|#[A-Za-z0-9]+);(.*)$/s;
    var safe='';
    var v;
    var s;
    while(line.length){
      if((v=re_entity.exec(line))!==null){
        s = v[1];
        line=v[2];        
        if(s.startsWith('#')){
          s = s.slice(1);
          s = "0"+s;
          s = parseInt(s);
          if(Number.isFinite(s)){
            s = String.fromCodePoint(s);
          }
          safe+=s;
        }else{
          if(this.tokenizer.symbol_name_map.has(s)){
            let {ctex,cmath,cc,fonts} = this.tokenizer.symbol_name_map.get(s);
            s = this.tokenizer.get_ctex_symbol(ctex,cmath,cc,fonts);
          }
          safe+=s;
        }
        continue;
      }
      if(line.codePointAt(0)>0xFFFF){
        s = line.slice(0,2);
        line = line.slice(2);
      }else{
        s = line.slice(0,1);
        line = line.slice(1);
      }
      let cc = s.codePointAt(0);
      if(this.tokenizer.symbol_cc_map.has(cc)){
        let {ctex,cmath,fonts} = this.tokenizer.symbol_cc_map.get(cc);
        s = this.tokenizer.get_ctex_symbol(ctex,cmath,cc,fonts);
      }     
      safe+=s;
      continue;
    }
    ///always call fontify cjk
    safe = this.fontify_cjk(safe);
    return safe;
  }
  ///
  /// To remove all Unicode entities and convert them to true unicode
  ///
  revise (line) {
    line=''+line;
    const re_entity = /^&([A-Za-z][A-Za-z0-9]*);(.*)$/s;
    var safe='';
    var v;
    var s;
    while(line.length){
      if((v=re_entity.exec(line))!==null){
        s = v[1];
        line=v[2];        
        if(this.tokenizer.symbol_name_map.has(s)){
          let {ctex,cmath,cc,fonts} = this.tokenizer.symbol_name_map.get(s);
          s = String.fromCodePoint(cc);
        }
        safe+=s;
        continue;
      }
      if(line.codePointAt(0)>0xFFFF){
        s = line.slice(0,2);
        line = line.slice(2);
      }else{
        s = line.slice(0,1);
        line = line.slice(1);
      }
      safe+=s;
      continue;
    }
    //prepend following with a backslash so that it can be used inside a bookmark=
    safe = safe.replace(/#/g,'\\#').replace(/%/g,'\\%');
    return safe;
  }
  ///
  ///
  ///
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
          key = this.uncode(style,key);
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
    if(fn){
      return `{\\switchtobodyfont[${fn}]${s}}`
    }
    return s;
  }
  to_margined_text(pp,parsep,leftmargin){
    let d = [];
    if(pp.length){
      if(typeof leftmargin==='number'){
        d.push(`\\startitemize[packed,joinedup]`);
      }else{
        d.push(`\\startitemize[packed,joinedup]`);
      }
      pp.forEach((p) => {
        if(p.item && p.hfill && p.latex){
          d.push(`\\sym {${p.item}} \\crlf\n${p.latex}`)
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
  halign_to_contex_ww(n,s) {
    /// \begin{tabular}{lcr}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var re_lcr = /^([lcr])\s*(.*)$/;
    var re_pw = /^p(\d+)\s*(.*)$/;
    var re_fw = /^f(\d+)\s*(.*)$/;
    var v;
    var pcols = [];
    while(s && s.length) {
      if((v=re_lcr.exec(s))!==null){
        var w = v[1];
        s = v[2];
        pcols.push(w);
      }
      else if((v=re_pw.exec(s))!==null){
        var w = v[1];
        s = v[2];
        var w = `${w}mm`;
        var w = `p(${w})`;
        pcols.push(w);
      }
      else if((v=re_fw.exec(s))!==null){
        var w = v[1];
        s = v[2];
        var w = `${w/100}\\textwidth`;
        var w = `p(${w})`;
        pcols.push(w);
      }
      else {
        break;
      }
    }
    while(pcols.length < n){
      pcols.push('l');
    }
    pcols = pcols.slice(0,n);
    return pcols;
  }
  halign_to_contex_width(n,s) {
    /// \begin{tabular}{lcr}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var re_lcr = /^([lcr])\s*(.*)$/;
    var re_pw = /^p(\d+)\s*(.*)$/;
    var re_fw = /^f(\d+)\s*(.*)$/;
    var v;
    var pcols = [];
    while(s && s.length) {
      if((v=re_lcr.exec(s))!==null){
        s = v[2];
        pcols.push(null);
      }
      else if((v=re_pw.exec(s))!==null){
        var w = v[1];
        s = v[2];
        var w = `${w}mm`;
        pcols.push(w);
      }
      else if((v=re_fw.exec(s))!==null){
        var w = v[1];
        s = v[2];
        var w = `${w/100}\\textwidth`;
        pcols.push(w);
      }
      else {
        break;
      }
    }
    while(pcols.length < n){
      pcols.push(null);
    }
    pcols = pcols.slice(0,n);
    return pcols;
  }
  to_tabulate_lcr_pcol(n,style){
    ///\blank\noindent \hbox{\starttabulate[|k5l|k1l|k5l|k5l|k5l|k5l|][distance=0pt,unit=0.1em,before={},after={}]
    var vbars = this.vrule_to_vbars(n,style.vrule)
    var pcols = this.string_to_array(style.halign);
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
      o.push(this.uncode(style,x.text));
    })
    o.push('\\stoplines')
    return o.join('\n');
  }
  rows_to_tabular(rows,style){
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
      var s = this.ss_to_contex_table_row_s(myss,n,style.vrule);
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
  ///
  ///
  ///
  restore_uri(str){
    var v;
    const re_charcode = /^\{\\char(\d+)\}\s*(.*)$/
    const re_char = /^(\w+)\s*(.*)$/;
    const re_S = /^(\S)\s*(.*)$/;
    str = str.trimLeft();
    var o = [];
    while(str.length){
      if((v=re_charcode.exec(str))!==null){
        let cc = v[1];
        str = v[2];
        let s = String.fromCodePoint(cc);
        o.push(s);
        continue;
      }
      if((v=re_char.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        continue;
      }
      if((v=re_S.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        continue;
      }
      o.push(str);
      break;
    }
    return o.join('');
  }
  ///
  ///
  ///
  restore_contex_math(str){
    var v;
    const re_charcode = /^\{\\char(\d+)\}(.*)$/
    const re_char = /^(\w+)(.*)$/;
    const re_S = /^(.)(.*)$/;
    str = str.trimLeft();
    var o = [];
    while(str.length){
      if((v=re_charcode.exec(str))!==null){
        let cc = v[1];
        str = v[2];
        let s = String.fromCodePoint(cc);
        o.push(s);
        continue;
      }
      if((v=re_char.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        continue;
      }
      if((v=re_S.exec(str))!==null){
        let s = v[1];
        str = v[2];
        o.push(s);
        continue;
      }
      o.push(str);
      break;
    }
    return o.join('');
  }
  ///
  ///
  ///
  to_latex_program() {
    return 'context';
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_double(style,cnt){
    let s = this.polish_verb(style,cnt);
    s = `{\\tt{}${s}}`;
    s = `\\quotation{${s}}`;
    return s;
  }
  literal_to_single(style,cnt){
    let s = this.polish_verb(style,cnt);
    s = `{\\tt{}${s}}`;
    return s;
  }
  literal_to_escape(style,cnt){
    let s = this.polish_verb(style,cnt);
    s = `{\\tt{}${s}}`;
    return s;
  }
  literal_to_math(style,cnt){
    return this.tokenizer.to_phrase_math(style,cnt);
  }
  //////////////////////////////////////////////////////////////////////////////////////
  /// 
  ///
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_verb(style,cnt,cnt2,cnt3){
    return `{\\tt ${cnt}}`
  }
  phrase_to_code(style,cnt,cnt2,cnt3){
    return `{\\tt ${cnt}}`
  }
  phrase_to_em(style,cnt,cnt2,cnt3){
    return `{\\it ${cnt}}`
  }
  phrase_to_b(style,cnt,cnt2,cnt3){
    return `{\\bf ${cnt}}`
  }
  phrase_to_i(style,cnt,cnt2,cnt3){
    return `{\\it ${cnt}}`
  }
  phrase_to_u(style,cnt,cnt2,cnt3){
    return `{\\underbar ${cnt}}`
  }
  phrase_to_ss(style,cnt,cnt2,cnt3){
    return `{\\ss ${cnt}}`
  }
  phrase_to_tt(style,cnt,cnt2,cnt3){
    return `{\\tt ${cnt}}`
  }
  phrase_to_overstrike(style,cnt,cnt2,cnt3){
    return `{\\overstrike ${cnt}}`
  }
  phrase_to_var(style,cnt,cnt2,cnt3){
    return `{\\sl ${cnt}}`
  }
  phrase_to_br(style,cnt,cnt2,cnt3){
    //return '{\\par}';
    return '{\\crlf}';
  }
  phrase_to_high(style,cnt,cnt2,cnt3){
    return `\\high{${cnt}}`
  }
  phrase_to_low(style,cnt,cnt2,cnt3){
    return `\\low{${cnt}}`;
  }
  phrase_to_quad(style,cnt,cnt2,cnt3){
    return '{\\quad}'
  }
  phrase_to_qquad(style,cnt,cnt2,cnt3){
    return '{\\qquad}'
  }
  phrase_to_ref(style,cnt,cnt2,cnt3){
    if(this.search_label_in_blocks(cnt)){
      return `\\in[${cnt}]`
    }else{
      return `{\\it ${this.smooth(cnt)}}`;
    }
  }
  phrase_to_link(style,cnt,cnt2,cnt3){
    cnt = this.restore_uri(cnt);
    return `{\\tt \\hyphenatedurl{${cnt}}}`
  }
  phrase_to_br(style,cnt,cnt2,cnt3){
    return '\\crlf';
  }
  phrase_to_vspace(style,cnt,cnt2,cnt3){
    return `\\blank[${cnt}]`;
  }
  phrase_to_hspace(style,cnt,cnt2,cnt3){
    return `\\definehspace[hspace][${cnt}]\\hspace[${cnt}]`;
  }
  ///following are picture phrases
  phrase_to_colorbutton(style,cnt,cnt2,cnt3){
    var ss = [];
    style = {...style,viewport:'1 1 5'};
    ss.push(`fill {linesize:1,fillcolor:${cnt}} &rectangle{(0.1,0.1),0.8,0.8}`);
    ss.push(`stroke {linesize:1,fillcolor:${cnt}} &rectangle{(0,0),1.0,1.0}`);
    var { img } = this.diagram.to_diagram(style,ss);
    var text = `\\hbox{${img}}`;
    return text;
  }
  ///following are math phrases
  phrase_to_default(style,cnt,cnt2,cnt3){
    return cnt;
  }
  phrase_to_utfchar(style,cnt,cnt2,cnt3){
    return `\\utfchar{"${cnt}}`;
  }
  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  __to_preamble_core(){
    var all = [];
    all.push(`\\enableregime[utf] % enable unicode fonts`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily [dejavu] [serif] [DejaVu Serif]`);
    all.push(`\\definefontfamily [dejavu] [sans]  [DejaVu Sans]`);
    all.push(`\\definefontfamily [dejavu] [mono]  [DejaVu Sans Mono]`);
    all.push(`\\definefontfamily [dejavu] [math]  [XITS Math] [rscale=1.1]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily [office] [serif] [Times New Roman]`);
    all.push(`\\definefontfamily [office] [sans]  [Arial] [rscale=0.9]`);
    all.push(`\\definefontfamily [office] [mono]  [Courier]`);
    all.push(`\\definefontfamily [office] [math]  [TeX Gyre Termes Math]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily [linux] [serif] [Linux Libertine O]`);
    all.push(`\\definefontfamily [linux] [sans]  [Linux Biolinum O]`);
    all.push(`\\definefontfamily [linux] [mono]  [Latin Modern Mono]`);
    all.push(`\\definefontfamily [linux] [math]  [TeX Gyre Pagella Math] [rscale=0.9]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily [source] [serif] [sourceserifpro]`);
    all.push(`\\definefontfamily [source] [sans]  [sourcesanspro]`);
    all.push(`\\definefontfamily [source] [mono]  [sourcecodepro]`);
    all.push(`\\definefontfamily [source] [math]  [TeX Gyre Pagella Math] [rscale=1.0]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily[noto][serif][notoserif]`);
    all.push(`\\definefontfamily[noto][sans][notosans]`);
    all.push(`\\definefontfamily[noto][mono][notosansmono]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily[cn][serif][arplsungtilgb]`);
    all.push(`\\definefontfamily[cn][sans][arplsungtilgb]`);
    all.push(`\\definefontfamily[cn][mono][arplsungtilgb]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily[tw][serif][arplmingti2lbig5]`);
    all.push(`\\definefontfamily[tw][sans][arplmingti2lbig5]`);
    all.push(`\\definefontfamily[tw][mono][arplmingti2lbig5]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily[jp][serif][ipaexmincho]`);
    all.push(`\\definefontfamily[jp][sans][ipaexmincho]`);
    all.push(`\\definefontfamily[jp][mono][ipaexmincho]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily[kr][serif][baekmukbatang]`);
    all.push(`\\definefontfamily[kr][sans][baekmukbatang]`);
    all.push(`\\definefontfamily[kr][mono][baekmukbatang]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`% Define first script named [serif][free]`);
    all.push(`% Define second script named [sans][free]`);
    all.push(`% Define second script named [mono][free]`);
    all.push(`% Define the typeface free; use serif for rm-fonts, sans serif for ss-fonts.`);
    all.push(`% Indicate the typeface to use.`);
    all.push(`\\starttypescript [serif] [free]`);
    all.push(`  \\definefontsynonym [Serif]             [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SerifBold]         [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SerifItalic]       [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SerifSlanted]      [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SerifBoldItalic]   [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SerifBoldSlanted]  [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SerifCaps]         [name:freeserifnormal]`);
    all.push(`\\stoptypescript`);
    all.push(`\\starttypescript [sans] [free]`);
    all.push(`  \\definefontsynonym [Sans]             [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansBold]         [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansItalic]       [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansSlanted]      [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansBoldItalic]   [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansBoldSlanted]  [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansCaps]         [name:freeserifnormal]`);
    all.push(`\\stoptypescript`);
    all.push(`\\starttypescript [mono] [free]`);
    all.push(`  \\definefontsynonym [Sans]             [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansBold]         [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansItalic]       [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansSlanted]      [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansBoldItalic]   [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansBoldSlanted]  [name:freeserifnormal]`);
    all.push(`  \\definefontsynonym [SansCaps]         [name:freeserifnormal]`);
    all.push(`\\stoptypescript`);
    all.push(`\\definetypeface[fre][rm][serif][free]`);
    all.push(`\\definetypeface[fre][ss][sans][free]`);
    all.push(`\\definetypeface[fre][tt][mono][free]`);
    all.push(`\\usetypescript [fre][uc]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`% Define first script named [serif][roboto]`);
    all.push(`% Define second script named [sans][roboto]`);
    all.push(`% Define second script named [mono][roboto]`);
    all.push(`% Define the typeface roboto; use serif for rm-fonts, sans serif for ss-fonts.`);
    all.push(`% Indicate the typeface to use.`);
    all.push(`\\starttypescript [serif] [roboto]`);
    all.push(`  \\definefontsynonym [Serif]             [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SerifBold]         [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SerifItalic]       [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SerifSlanted]      [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SerifBoldItalic]   [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SerifBoldSlanted]  [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SerifCaps]         [name:robotoregular]`);
    all.push(`\\stoptypescript`);
    all.push(`\\starttypescript [sans] [roboto]`);
    all.push(`  \\definefontsynonym [Sans]             [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansBold]         [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansItalic]       [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansSlanted]      [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansBoldItalic]   [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansBoldSlanted]  [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansCaps]         [name:robotoregular]`);
    all.push(`\\stoptypescript`);
    all.push(`\\starttypescript [mono] [roboto]`);
    all.push(`  \\definefontsynonym [Sans]             [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansBold]         [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansItalic]       [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansSlanted]      [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansBoldItalic]   [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansBoldSlanted]  [name:robotoregular]`);
    all.push(`  \\definefontsynonym [SansCaps]         [name:robotoregular]`);
    all.push(`\\stoptypescript`);
    all.push(`\\definetypeface[rob][rm][serif][roboto]`);
    all.push(`\\definetypeface[rob][ss][sans][roboto]`);
    all.push(`\\definetypeface[rob][tt][mono][roboto]`);
    all.push(`\\usetypescript [rob][uc]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`% Define first script named [serif][dejavu]`);
    all.push(`% Define second script named [sans][dejavu]`);
    all.push(`% Define second script named [mono][dejavu]`);
    all.push(`% Define the typeface dejavu; use serif for rm-fonts, sans serif for ss-fonts.`);
    all.push(`% Indicate the typeface to use.`);
    all.push(`\\starttypescript [serif] [dejavu]`);
    all.push(`  \\definefontsynonym [Serif]             [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SerifBold]         [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SerifItalic]       [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SerifSlanted]      [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SerifBoldItalic]   [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SerifBoldSlanted]  [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SerifCaps]         [name:dejavuserif]`);
    all.push(`\\stoptypescript`);
    all.push(`\\starttypescript [sans] [dejavu]`);
    all.push(`  \\definefontsynonym [Sans]             [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansBold]         [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansItalic]       [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansSlanted]      [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansBoldItalic]   [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansBoldSlanted]  [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansCaps]         [name:dejavuserif]`);
    all.push(`\\stoptypescript`);
    all.push(`\\starttypescript [mono] [dejavu]`);
    all.push(`  \\definefontsynonym [Sans]             [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansBold]         [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansItalic]       [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansSlanted]      [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansBoldItalic]   [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansBoldSlanted]  [name:dejavuserif]`);
    all.push(`  \\definefontsynonym [SansCaps]         [name:dejavuserif]`);
    all.push(`\\stoptypescript`);
    all.push(`\\definetypeface[dej][rm][serif][dejavu]`);
    all.push(`\\definetypeface[dej][ss][sans][dejavu]`);
    all.push(`\\definetypeface[dej][tt][mono][dejavu]`);
    all.push(`\\usetypescript [dej][uc]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definemathcommand [arccot] [nolop] {\\mfunction{arccot}}`);
    all.push(`\\definemathcommand [arsinh] [nolop] {\\mfunction{arsinh}}`);
    all.push(`\\definemathcommand [arcosh] [nolop] {\\mfunction{arcosh}}`);
    all.push(`\\definemathcommand [artanh] [nolop] {\\mfunction{artanh}}`);
    all.push(`\\definemathcommand [arcoth] [nolop] {\\mfunction{arcoth}}`);
    all.push(`\\definemathcommand [sech]   [nolop] {\\mfunction{sech}}`);
    all.push(`\\definemathcommand [csch]   [nolop] {\\mfunction{csch}}`);
    all.push(`\\definemathcommand [arcsec] [nolop] {\\mfunction{arcsec}}`);
    all.push(`\\definemathcommand [arccsc] [nolop] {\\mfunction{arccsc}}`);
    all.push(`\\definemathcommand [arsech] [nolop] {\\mfunction{arsech}}`);
    all.push(`\\definemathcommand [arcsch] [nolop] {\\mfunction{arcsch}}`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\usesymbols[mvs]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\setupinteraction[state=start]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\placebookmarks[part,chapter,section]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definecolor[cyan][r=0,g=1,b=1] % a RGB color`);
    all.push(`\\definecolor[magenta][r=1,g=0,b=1] % a RGB color`);
    all.push(`\\definecolor[darkgray][r=.35,g=.35,b=.35] % a RGB color`);
    all.push(`\\definecolor[gray][r=.5,g=.5,b=.5] % a RGB color`);
    all.push(`\\definecolor[lightgray][r=.75,g=.75,b=.75] % a RGB color`);
    all.push(`\\definecolor[brown][r=.72,g=.52,b=.04] % a RGB color`);
    all.push(`\\definecolor[lime][r=.67,g=1,b=.18] % a RGB color`);
    all.push(`\\definecolor[olive][r=.5,g=.5,b=0] % a RGB color`);
    all.push(`\\definecolor[orange][r=1,g=.5,b=0] % a RGB color`);
    all.push(`\\definecolor[pink][r=1,g=.75,b=.79] % a RGB color`);
    all.push(`\\definecolor[teal][r=0,g=.5,b=.5] % a RGB color`);
    all.push(`\\definecolor[purple][r=.8,g=.13,b=.13] % a RGB color`);
    all.push(`\\definecolor[violet][r=.5,g=0,b=.5] % a RGB color`);
    all.push(`%%%`);
    all.push(`\\definedescription[latexdesc][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft, `);
    all.push(`  alternative=hanging, width=fit, before=, after=]`);
    all.push(`\\definedescription[DLpacked][`);
    all.push(`  headstyle=bold, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad, before=, after=,]`);
    all.push(`\\definedescription[HLpacked][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad, before=, after=,]`);
    all.push(`\\definedescription[DL][`);
    all.push(`  headstyle=bold, style=normal, align=flushleft, `);
    all.push(`  alternative=hanging, width=broad]`);
    all.push(`\\definedescription[HL][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft, `);
    all.push(`  alternative=hanging, width=broad]`);
    all.push(`%%%`);
    all.push(`\\definefontsize[sm]`);
    all.push(`\\definefontsize[xsm]`);
    all.push(`\\definefontsize[xxsm]`);
    all.push(`\\definefontsize[xxxsm]`);
    all.push(`\\definefontsize[big]`);
    all.push(`\\definefontsize[xbig]`);
    all.push(`\\definefontsize[xxbig]`);
    all.push(`\\definefontsize[huge]`);
    all.push(`\\definefontsize[xhuge]`);
    all.push(`\\definebodyfontenvironment`);
    all.push(`  [default]`);
    all.push(`  [sm=.9,xsm=.8,xxsm=.7,xxxsm=.5,`);
    all.push(`   big=1.2,xbig=1.4,xxbig=1.7,huge=2.0,xhuge=2.3]`);
    all.push(`%%%`);
    all.push(`\\definefloat[listing][listings]`);
    all.push(`%%%`);
    return all.join('\n');
  }
  ///
  ///
  ///
  untext(style,body){
    var all = [];
    all.push('');
    var text = super.untext(style,body).trim();
    if(text.startsWith('\\startMPcode') || text.startsWith('\\hbox') || text.startsWith(`\\ruledhbox`)){
      all.push(`\\dontleavehmode%`);
    }
    all.push(text);
    return all.join('\n').trim();
  }
  /////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////////////////
  to_preamble_fonts(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\enableregime[utf] % enable unicode fonts`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily [dejavu] [serif] [dejavuserif]`);
    all.push(`\\definefontfamily [dejavu] [sans]  [dejavusans]`);
    all.push(`\\definefontfamily [dejavu] [mono]  [dejavusansmono]`);
    all.push(`\\definefontfamily [dejavu] [math]  [dejavumath]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily [office] [serif] [Times New Roman]`);
    all.push(`\\definefontfamily [office] [sans]  [Arial] [rscale=0.9]`);
    all.push(`\\definefontfamily [office] [mono]  [Courier New]`);
    all.push(`\\definefontfamily [office] [math]  [TeX Gyre Termes Math]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`%\\definefallbackfamily [linux] [serif] [zapfdingbats] [range={miscellaneoussymbols,dingbats}]`);
    all.push(`%\\definefallbackfamily [linux] [sans]  [zapfdingbats] [range={miscellaneoussymbols,dingbats}]`);
    all.push(`%\\definefallbackfamily [linux] [mono]  [zapfdingbats] [range={miscellaneoussymbols,dingbats}]`);
    all.push(`%\\definefallbackfamily [linux] [serif] [hiraginominchopro] [range={cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`%\\definefallbackfamily [linux] [sans]  [hiraginominchopro] [range={cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`%\\definefallbackfamily [linux] [mono]  [hiraginominchopro] [range={cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefontfamily [linux] [serif] [libertinusserif]`);
    all.push(`\\definefontfamily [linux] [sans]  [libertinussans]`);
    all.push(`\\definefontfamily [linux] [mono]  [libertinusmono] [rscale=0.9]`);
    all.push(`\\definefontfamily [linux] [math]  [libertinusmath]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_math(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definemathcommand [arccot] [nolop] {\\mfunction{arccot}}`);
    all.push(`\\definemathcommand [arsinh] [nolop] {\\mfunction{arsinh}}`);
    all.push(`\\definemathcommand [arcosh] [nolop] {\\mfunction{arcosh}}`);
    all.push(`\\definemathcommand [artanh] [nolop] {\\mfunction{artanh}}`);
    all.push(`\\definemathcommand [arcoth] [nolop] {\\mfunction{arcoth}}`);
    all.push(`\\definemathcommand [sech]   [nolop] {\\mfunction{sech}}`);
    all.push(`\\definemathcommand [csch]   [nolop] {\\mfunction{csch}}`);
    all.push(`\\definemathcommand [arcsec] [nolop] {\\mfunction{arcsec}}`);
    all.push(`\\definemathcommand [arccsc] [nolop] {\\mfunction{arccsc}}`);
    all.push(`\\definemathcommand [arsech] [nolop] {\\mfunction{arsech}}`);
    all.push(`\\definemathcommand [arcsch] [nolop] {\\mfunction{arcsch}}`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_colors(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definecolor[cyan][r=0,g=1,b=1] % a RGB color`);
    all.push(`\\definecolor[magenta][r=1,g=0,b=1] % a RGB color`);
    all.push(`\\definecolor[darkgray][r=.35,g=.35,b=.35] % a RGB color`);
    all.push(`\\definecolor[gray][r=.5,g=.5,b=.5] % a RGB color`);
    all.push(`\\definecolor[lightgray][r=.75,g=.75,b=.75] % a RGB color`);
    all.push(`\\definecolor[brown][r=.72,g=.52,b=.04] % a RGB color`);
    all.push(`\\definecolor[lime][r=.67,g=1,b=.18] % a RGB color`);
    all.push(`\\definecolor[olive][r=.5,g=.5,b=0] % a RGB color`);
    all.push(`\\definecolor[orange][r=1,g=.5,b=0] % a RGB color`);
    all.push(`\\definecolor[pink][r=1,g=.75,b=.79] % a RGB color`);
    all.push(`\\definecolor[teal][r=0,g=.5,b=.5] % a RGB color`);
    all.push(`\\definecolor[purple][r=.8,g=.13,b=.13] % a RGB color`);
    all.push(`\\definecolor[violet][r=.5,g=0,b=.5] % a RGB color`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_fontsizes(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontsize[sm]`);
    all.push(`\\definefontsize[xsm]`);
    all.push(`\\definefontsize[xxsm]`);
    all.push(`\\definefontsize[xxxsm]`);
    all.push(`\\definefontsize[big]`);
    all.push(`\\definefontsize[xbig]`);
    all.push(`\\definefontsize[xxbig]`);
    all.push(`\\definefontsize[huge]`);
    all.push(`\\definefontsize[xhuge]`);
    all.push(`\\definebodyfontenvironment`);
    all.push(`  [default]`);
    all.push(`  [sm=.9,xsm=.8,xxsm=.7,xxxsm=.5,`);
    all.push(`   big=1.2,xbig=1.4,xxbig=1.7,huge=2.0,xhuge=2.3]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_essentials(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefloat[listing][listings]`);
    all.push(`\\definedescription[latexdesc][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft, `);
    all.push(`  alternative=hanging, width=fit, before=, after=]`);
    all.push(`\\definedescription[DLpacked][`);
    all.push(`  headstyle=bold, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad, before=, after=,]`);
    all.push(`\\definedescription[HLpacked][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad, before=, after=,]`);
    all.push(`\\definedescription[DL][`);
    all.push(`  headstyle=bold, style=normal, align=flushleft, `);
    all.push(`  alternative=hanging, width=broad]`);
    all.push(`\\definedescription[HL][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft, `);
    all.push(`  alternative=hanging, width=broad]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n');
  }
  to_preamble_misc(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\setupinteraction[state=start]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\placebookmarks[part,chapter,section]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_langs(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    var style_langs = this.conf_to_list('lang');
    for(let lang of style_langs){
      let pp = lang.split('=');
      let p1 = pp[0];
      let p2 = pp[1];
      all.push(`\\definefontfamily[${p1}][serif][${p2}]`);
      all.push(`\\definefontfamily[${p1}][sans][${p2}]`);
      all.push(`\\definefontfamily[${p1}][mono][${p2}]`);
    }
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  pp_to_btable_bottom_frame(pp){
    var all = [];
    if(pp.lower==2){
      /*
      \bTR[bottomframe=on] \bTH Name \eTH \bTH Symbol \eTH \eTR
      \bTR[height=2.25pt,bottomframe=on] \eTR
      */
      all.push('bottomframe=on');
    }else if(pp.lower==1){
      all.push('bottomframe=on');
    }
    return all.join(',')
  }
  pp_to_btable_row_text(pp,vrules,btd,etd){
    var all = [];
    let rule0 = vrules[0];
    let lf = '';
    if(rule0 && rule0=='||'){
      all.push(`${btd}[rightframe=on,width=2pt] ${etd}`);
      lf = 'leftframe=on';
    }else if(rule0 && rule0=='|'){
      lf = 'leftframe=on';
    }
    pp.forEach((p,j,arr)=>{
      let rule1 = vrules[j+1];
      if(rule1 && rule1=='||'){
        all.push(`${btd}[rightframe=on,${lf}] ${p.text} ${etd}`);
        all.push(`${btd}[rightframe=on,width=2pt] ${etd}`);
      }else if(rule1 && rule1=='|'){
        all.push(`${btd}[rightframe=on,${lf}] ${p.text} ${etd}`);
      }else{
        all.push(`${btd}[${lf}] ${p.text} ${etd}`);
      }
      lf = '';
    })
    return all.join(' ');
  }
}
module.exports = { NitrilePreviewContex };
