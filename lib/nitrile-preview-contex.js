'use babel';

const { NitrilePreviewDiagramMF } = require('./nitrile-preview-diagram-mf');
const { NitrilePreviewCmath } = require('./nitrile-preview-cmath');
const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const w3color = require('./nitrile-preview-w3color');
const path = require('path');
const { all } = require('express/lib/application');

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
    this.contex_papersize = 'A5';
    this.contex_bodyfont = 'dejavu,10pt';
    this.contex_linespace = '12.5pt';
    this.contex_linespace_small = '10.0pt'
    this.contex_whitespace = '0pt';
    this.contex_indenting = 'yes,medium';
    this.contex_caption_align = 'c';
    this.contex_caption_small = 1;
    this.contex_samp_small = 1;
  }
  to_caption_nonumber(){
    return false;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////////
  hdgs_to_part(title,label,idnum,idcap,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    var label = label||`${partnum}`;
    o.push('');
    o.push(`\\startpart[title={${title}},reference={${label}},bookmark={${raw}}]`);
    o.push(title);
    o.push(`\\stoppart`)
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,idnum,idcap,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    var label = label||`${partnum}.${chapternum}`;
    o.push('');
    o.push(`\\startchapter[title={${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  }
  hdgs_to_section(title,label,idnum,idcap,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    var label = label||`${partnum}.${chapternum}.${level}`;
    o.push('');
    o.push(`\\startsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  } 
  hdgs_to_subsection(title,label,idnum,idcap,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    var label = label||`${partnum}.${chapternum}.${level}`;
    o.push('');
    o.push(`\\startsubsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  } 
  hdgs_to_subsubsection(title,label,idnum,idcap,partnum,chapternum,level,style){
    var o = [];
    var raw = this.revise(title);    
    var title = this.uncode(style,title);
    var label = label||`${partnum}.${chapternum}.${level}`;
    o.push('');
    o.push(`\\startsubsubsection[title={${title}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  }
  //////////////////////////////////////////////////////////////////////////
  ///
  //////////////////////////////////////////////////////////////////////////
  item_dl_to_text(style,i,item,nblank){
    var o = [];
    var value = this.uncode(style,item.value);
    if(Array.isArray(item.values)){
      value = item.values.map((s) => this.uncode(style,s).trim()).join('\\\\');
    }
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
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
          let text = this.join_para(p.lines);
          o.push(this.uncode(style,text));
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
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
  item_hl_to_text(style,i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    var value = this.to_hl_bullet_text(item.bullet);
    var text = `{${value}~~${text}}`;
    if(!nblank){
      o.push(`\\startHLpacked{}${text} `);
    }else{
      o.push(`\\startHL{}${text} `);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let text = this.join_para(p.lines);
          o.push(this.uncode(style,text));
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
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
  item_ol_to_text(style,i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    if(item.type == 'A'){
      o.push(`\\sym {${this.int_to_letter_A(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'a'){
      o.push(`\\sym {${this.int_to_letter_a(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'I'){
      o.push(`\\sym {${this.int_to_letter_I(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'i'){
      o.push(`\\sym {${this.int_to_letter_i(item.value)}${item.ending}} ${text}`)
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
          let text = this.join_para(p.lines);
          o.push(this.uncode(style,text));
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    return o.join('\n\n');
  }
  item_ul_to_text(style,i,item,nblank){
    var o = [];
    var key = item.key;
    var keytype = item.keytype;
    var sep = item.sep;
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    if(key){
      if(keytype=='var'){
        o.push(`\\item{}{${this.literal_to_var(style,key)}}${sep}${text}`);
      }else if(keytype=='verb'){
        o.push(`\\item{}{${this.literal_to_verb(style,key)}}${sep}${text}`);
      }else{
        o.push(`\\item{}{${this.polish(style,key)}}${sep}${text}`);
      }
    }else{
      o.push(`\\item{}${text}`);
    }
    if(item.more && item.more.length){
      item.more.forEach((p) => {
        if(p.lines){
          let text = this.join_para(p.lines);
          o.push(this.uncode(style,text));
        }else if(p.itemize) {
          o.push(`${this.itemize_to_text(style,p.itemize)}`);
        }
      });
    }
    return o.join('\n\n')
  }
  itemize_to_text(style,itemize){
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
            let text = this.item_dl_to_text(style,j,item,nblank);
            o.pop();
            o.push(text);
          }else{
            last_o = [];
            last_o.push(item);
            let text = this.item_dl_to_text(style,j,item,nblank);
            o.push(text);
          }
        });
        break;
      }
      case 'HL': {
        nowhitespace = 1;
        items.forEach((item,j) => {
          let text = this.item_hl_to_text(style,j,item,nblank);
          o.push(text);
        });
        break;
      }
      case 'OL': {
        if(!nblank){
          o.push(`\\startitemize[n,packed][]`);
        }else{
          o.push(`\\startitemize[n][]`);
        }
        items.forEach((item,j) => {
          let text = this.item_ol_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push('\\stopitemize')
        break;
      }
      case 'UL': {
        if(!nblank){
          o.push(`\\startitemize[packed][]`);
        }else{
          o.push(`\\startitemize[][]`);
        }
        items.forEach((item,j) => {
          let text = this.item_ul_to_text(style,j,item,nblank);
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
  fence_to_displaymath(style,ss,ssi) {
    var str = ss.join('\n');
    var used = new Set();
    var sss = this.tokenizer.to_cmath(str,style,used,1);
    var max_n = 1;
    sss.forEach((ss) => {
      let n = ss.length;
      if(n > max_n){
        max_n = n;
      }
    })
    // var text = `\\startformula{${text}}\\stopformula`;
    sss = sss.map((ss) => {
      ss = ss.map((s) => `\\math{${s}}`)
      return ss;
    })
    sss = sss.map((ss) => {
      while(ss.length < max_n){
        ss.push('');
      }
      return ss;
    })
    var pcol = 'l'.repeat(max_n).split('').join('|');
    var all = [];
    all.push(`\\starttabulate[|${pcol}|]`);
    sss.forEach((ss) => {
      let s = ss.join(' \\NC ');
      s = `\\NC ${s} \\NC\\NR`
      all.push(s);
    })
    all.push(`\\stoptabulate`);
    var text = all.join('\n');
    var img = `\\framed[frame=off,location=top,strut=no]{${text}}`
    var frm = `\\framed[frame=off,location=top,strut=no]{${text}}`
    var subc = style.subtitle||'';
    var subc = this.uncode(style,subc);
    var w = '';
    var o = [];
    o.push({img,frm,width:w,subc,style});
    return o;
  }
  fence_to_ink(style,ss,ssi){
    var npara = ss.length;
    var vgap = 1;//1mm
    var [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    var max_inkheight = vgap + vgap + npara*10*this.PT_TO_MM;//fs font
    var inkheight = Math.max(inkheight,max_inkheight);
    var all = [];
    all.push(`\\startMPcode`);
    all.push(`numeric u; u := 1mm;`);
    all.push(`numeric inkwidth; inkwidth := ${inkwidth}mm;`);
    all.push(`numeric inkheight; inkheight := ${inkheight}mm;`)
    all.push(`draw (0,0)--(inkwidth,inkheight) withpen pencircle withcolor white;`);
    ss.forEach((s,j,arr) => {
      if(s=='\\\\'){
        s = String.fromCodePoint(0x00B6);
      }else{
        s = this.polish_verb(style,s);
      }
      let x = 0;
      let y = inkheight - ((j+1)*10)*this.PT_TO_MM + vgap;
      all.push(`pair a ; a := (${this.fix(x)}*u,${this.fix(y)}*u) ;`);
      all.push(`label.rt("\\tt\\switchtobodyfont[10pt]${s}",a) ;`);
    });
    all.push(`clip currentpicture to unitsquare xscaled (inkwidth) yscaled (inkheight);`);
    var w = `${inkwidth}mm`
    if(style.stretch){
      let stretch = parseFloat(style.stretch);
      if(stretch){
        all.push(`currentpicture := currentpicture xsized (\\the\\textwidth*${stretch}) ;`)
        var w = `${stretch*100}%`;
      }
    }else if(style.width) {
      let width = parseInt(style.width);
      if(width){
        all.push(`currentpicture := currentpicture xsized (${width}mm) ysized (${inkheight/inkwidth*width}mm);`)
        var w = `${width}mm`
      }
    }
    all.push(`\\stopMPcode`);
    var text = all.join('\n');
    if(style.frame){
      var img = `\\framed[frame=on,location=top,strut=no]{${text}}`;
      var frm = `\\framed[frame=on,location=top,strut=no]{${text}}`;
    }else{
      var img = `\\framed[frame=off,location=top,strut=no]{${text}}`;
      var frm = `\\framed[frame=off,location=top,strut=no]{${text}}`;
    }
    var subc = style.subtitle||'';
    var subc = this.uncode(style,subc);
    var o = [];
    o.push({img,frm,subc,width:w,style});
    return o;
  }
  fence_to_tabular(style,ss,ssi){
    ///'figure', 'table', and 'longtable'
    var {rows} = this.ss_to_tabular_rows(style,ss,ssi);
    var n = rows.length ? rows[0].length : 1;
    var ww = this.halign_to_contex_width_and_align(n,style.align);
    var pcol = this.ww_to_context_starttable_pcol(ww,n);
    rows.forEach((pp,j) => {
      pp.forEach((p) => {
        p.text = this.uncode(style,p.raw);
        if(p.text.length==0){
          p.text = '~';
        }
        if(style.head && j==0){
          p.text = `{\\bold ${p.text}}`
        }
      })
    })
    var all = [];
    if(style.frame){
      if(style.rules=='groups'){
        all.push(`\\starttable[s2|${pcol}|]`);
        all.push('\\HL')
        rows.forEach((row,j) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\VL ${p.text} `);
            }else if(i==1){
              if(style.side){
                all.push(`\\VL ${p.text} `);
              }else{
                all.push(`\\NC ${p.text} `);
              }
            }else{
              all.push(`\\NC ${p.text} `);
            }
          });
          all.push(`\\VL\\FR`)
          if(style.head && j==0){
            all.push(`\\HL`);
          }
        })
        all.push('\\HL')
        all.push(`\\stoptable`)
      }
      else if(style.rules=='rows'){
        all.push(`\\starttable[s2|${pcol}|]`);
        all.push('\\HL')
        rows.forEach((row,j) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\VL ${p.text} `);
            }else{
              all.push(`\\NC ${p.text} `);
            }
          });
          all.push(`\\VL\\FR`)
          all.push(`\\HL`);
        })
        all.push(`\\stoptable`)
      }
      else if(style.rules=='columns'){
        all.push(`\\starttable[s2|${pcol}|]`);
        all.push('\\HL')
        rows.forEach((row,j) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\VL ${p.text} `);
            }else{
              all.push(`\\VL ${p.text} `);
            }
          });
          all.push(`\\VL\\FR`)
        })
        all.push(`\\HL`);
        all.push(`\\stoptable`)
      }
      else if(style.rules=='all'){
        all.push(`\\starttable[s2|${pcol}|]`);
        all.push('\\HL')
        rows.forEach((row,j) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\VL ${p.text} `);
            }else{
              all.push(`\\VL ${p.text} `);
            }
          });
          all.push(`\\VL\\FR`)
          all.push(`\\HL`);
        })
        all.push(`\\stoptable`)
      }
      else{
        all.push(`\\starttable[s2|${pcol}|]`);
        all.push('\\HL')
        rows.forEach((row,j) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\VL ${p.text} `);
            }else{
              all.push(`\\NC ${p.text} `);
            }
          });
          all.push(`\\VL\\FR`)
        })
        all.push(`\\HL`);
        all.push(`\\stoptable`)
      }
    }else{
      /// no frame
      if(style.rules=='groups'){
        all.push(`\\starttable[s2|${pcol}|]`);
        rows.forEach((row,j) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\NC ${p.text} `);
            }else if(i==1){
              if(style.side){
                all.push(`\\VL ${p.text} `);
              }else{
                all.push(`\\NC ${p.text} `);
              }
            }else{
              all.push(`\\NC ${p.text} `);
            }
          });
          all.push(`\\NC\\FR`)
          if(style.head && j==0){
            all.push(`\\HL`);
          }
        })
        all.push(`\\stoptable`)
      }
      else if(style.rules=='rows'){
        all.push(`\\starttable[s2|${pcol}|]`);
        rows.forEach((row,j,arr) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\NC ${p.text} `);
            }else{
              all.push(`\\NC ${p.text} `);
            }
          });
          all.push(`\\NC\\FR`)
          if(j<arr.length-1){
            all.push(`\\HL`);
          }
        })
        all.push(`\\stoptable`)
      }
      else if(style.rules=='columns'){
        all.push(`\\starttable[s2|${pcol}|]`);
        rows.forEach((row,j,arr) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\NC ${p.text} `);
            }else{
              all.push(`\\VL ${p.text} `);
            }
          });
          all.push(`\\NC\\FR`)
        })
        all.push(`\\stoptable`)
      }
      else if(style.rules=='all'){
        all.push(`\\starttable[s2|${pcol}|]`);
        rows.forEach((row,j,arr) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\NC ${p.text} `);
            }else{
              all.push(`\\VL ${p.text} `);
            }
          });
          all.push(`\\NC\\FR`)
          if(j<arr.length-1){
            all.push(`\\HL`);
          }
        })
        all.push(`\\stoptable`)
      }
      else {
        all.push(`\\starttable[s2|${pcol}|]`);
        rows.forEach((row,j,arr) => {
          row.forEach((p,i) => {
            if(i==0){
              all.push(`\\NC ${p.text} `);
            }else{
              all.push(`\\NC ${p.text} `);
            }
          });
          all.push(`\\NC\\FR`)
        })
        all.push(`\\stoptable`)
      }
    }
    var text = all.join('\n');
    var img = `\\framed[frame=off,location=top,strut=no]{${text}}`;
    var frm = `\\framed[frame=off,location=top,strut=no]{${text}}`;
    if(style.fontsize=='small'){
      img = `{\\small\\setupinterlinespace[line=10pt]${img}}`;
      frm = `{\\small\\setupinterlinespace[line=10pt]${frm}}`;
    }
    var o = [];
    var subc = style.subtitle||'';
    var subc = this.uncode(style,subc);
    o.push({img,frm,subc,style});
    return o;
  }
  fence_to_dia(style,ss,ssi){
    var o = this.diagram.to_diagram(style,ss);
    o.forEach((p) => {
      p.subc = style.subtitle||'';
      p.subc = this.uncode(style,p.subc);    
      p.style = style;
      // if(style.frame){
      //   p.img = `\\starttable[s0|l|]\n\\HL\n\\VL{${p.img}}\\VL\\NR\\HL\\stoptable`;
      // }else{
      //   p.img = `\\starttable[s0|l|]\n\\NC{${p.img}}\\NC\\NR\\stoptable`;
      // }
      let img = p.img;
      if(style.frame){
        p.img = `\\framed[frame=on,location=top,strut=no]{${img}}`
        p.frm = `\\framed[frame=on,location=top,strut=no]{${img}}`
      }else{
        p.img = `\\framed[frame=off,location=top,strut=no]{${img}}`
        p.frm = `\\framed[frame=off,location=top,strut=no]{${img}}`
      }
    });
    return o;
  }
  fence_to_verbatim(style,ss,ssi){
    ss = ss.map((s) => {
      s = s.trimRight();
      s = this.polish_verb(style,s);
      if (!s) {
        s = "~";
      }
      return s;
    });
    let all = [];
    all.push('\\starttabulate[|lT|][]');
    ss.forEach((s) => {
      s = `\\NC ${s} \\NC\\NR`;
      all.push(s);
    });
    all.push('\\stoptabulate');
    var text = all.join('\n');
    var img = `\\framed[frame=off,location=top,strut=no]{${text}}`
    var frm = `\\framed[frame=off,location=top,strut=no]{${text}}`
    if(style.fontsize=='small'){
      img = `\\small\\setupinterlinespace[line=10pt]${img}`
      frm = `\\small\\setupinterlinespace[line=10pt]${frm}`
    }
    var subc = style.subtitle||'';
    var subc = this.uncode(style,subc);
    var o = [];
    o.push({img,frm,subc,style});
    return o;
  }
  fence_to_parbox(style,ss,ssi) {
    var sep = '\\\\';
    var text = this.ss_to_backslashed_text(style,ss,sep).trim();
    let opts = [];
    let width = this.g_to_width_float(style);
    if(width){
      opts.push(`width=${width}mm`);
    }else{
      opts.push(`width=fit`);//maximum width is the text width
    }
    if(style.frame){
      opts.push(`frame=on`);
    }else{
      opts.push(`frame=off`);
    }
    opts.push('strut=no');
    opts.push('location=top');
    if(style.align=='c'){
      opts.push('align=middle');
    }else if(style.align=='r'){
      opts.push('align=left');
    }else{
      opts.push('align=right');
    }
    var text = `\\framed[${opts.join(',')}]{${text}}`
    if(style.fontstyle=='italic'){
      text = `{\\italic ${text}}`;
    }
    if(style.fontsize=='small'){
      text = `{\\small\\setupinterlinespace[line=10.0pt] ${text}}`;
    }
    var img = text;
    var frm = text;
    var subc = style.subtitle||'';
    var subc = this.uncode(style,subc);
    var o = [];
    o.push({img,frm,subc,style});
    return o;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////////////////////////////
  float_to_figure(title,label,idnum,idcap,style,ss,ssi){
    style = {...style,title,label,float:'figure'};
    let itms = this.ss_to_figure_itms(style,ss,ssi);
    let caption = this.uncode(style,title).trim();
    let salign = this.contex_caption_align;
    let s_align = "flushleft";
    if(salign=='c'){
      s_align = "center";
    }else if(salign=='r'){
      s_align = "flushright";
    }
    if(style.swrap){
      let o = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let subc = p.subc;
          if(style.senum){ 
            subc = this.senum_to_subc(style.senum,p.seq,subc);
          }
          o.push(`\\hbox{\\startcombination[1*1] {${p.img}} {${subc}} \\stopcombination}`);
        }else if(p.type=='\\\\'){
          o.push('\\\\');
        }
      });
      var text = o.join('\n')
    }else{
      let onerow = [];
      let o = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          let subc = p.subc;
          if(style.senum){ 
            subc = this.senum_to_subc(style.senum,p.seq,subc);
          }
          onerow.push(`{${p.img}} {${subc}}`);
        }else if(p.type=='\\\\'){
          let n = onerow.length;
          o.push(`\\hbox{\\startcombination[${n}*1] ${onerow.join('\n')} \\stopcombination}`);
          o.push('\\\\');
          onerow = [];
        }
      });
      if(onerow.length){
        let n = onerow.length;
        o.push(`\\hbox{\\startcombination[${n}*1] ${onerow.join('\n')} \\stopcombination}`);
      }
      var text = o.join('\n');
    }
    ///
    ///put it together
    ///
    if(style.type=='right'){
      let o = [];
      o.push('');
      o.push(`\\placefigure[right,none][]{}{${text}}`);
      return o.join('\n');
    }else if(style.type=='left'){
      let o = [];
      o.push('');
      o.push(`\\placefigure[left,none][]{}{${text}}`);
      return o.join('\n');
    }else if(style.table){
      let o = [];
      o.push('')
      o.push(`\\placetable`);
      o.push(`[here]`);
      o.push(`[${label}]`);
      o.push(`{${caption}}`);
      o.push(`{\\startalignment[${s_align}] \\dontleavehmode ${text} \\stopalignment}`);
      return o.join('\n');
    }else{
      let o = [];
      o.push('')
      o.push(`\\placefigure`);
      o.push(`[here,${this.to_caption_nonumber()?'nonumber':''}]`);
      o.push(`[${label}]`);
      o.push(`{${this.to_caption_nonumber()?'Figure : ':''}${caption}}`);
      o.push(`{\\startalignment[${s_align}] \\dontleavehmode ${text} \\stopalignment}`);
      return o.join('\n');
    }
  }
  float_to_equation(title,label,idnum,idcap,style,ss,ssi){
    var itms = this.ss_to_figure_itms(style,ss,ssi);
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
  float_to_listing(title,label,idnum,idcap,style,ss,ssi){
    style = {...style,float:'listing'};
    var ss = this.ss_to_first_bundle(style,ss,ssi);
    if(ss.length){
      ss = ss.slice(1,-1);
    }
    var ss = this.trim_samp_body(ss);
    var title = this.uncode(style,title).trim();
    var o = [];
    var opts = [];
    var s_ad = String.fromCodePoint(0xAD);
    if(style.fontsize=='small'){
      opts.push('bodyfont=small');
    }
    o.push(`\\starttabulate[|l|Tl|][${opts.join(',')}]`);
    ss.forEach( (s,j,arr) => {
      if(s==s_ad){
        s = "~";
      }else{
        s = this.polish_verb(style,s);
      }
      s = `\\NC ${j+1} \\NC ${s} \\NR`;
      o.push(s);
    });
    o.push('\\stoptabulate');
    var text = o.join('\n');
    var caption = this.uncode(style,title);
    o = [];
    o.push('')
    o.push(`\\placelisting`);
    o.push(`[here,split,${this.to_caption_nonumber()?'nonumber':''}]`);
    o.push(`[${label}]`);
    o.push(`{${this.to_caption_nonumber()?'Listing : ':''}${caption}}`);
    o.push(`{${text}}`)
    return o.join('\n');
  }
  float_to_longtabu(title,label,idnum,idcap,style,ss,ssi) {
    style = {...style,title,label,float:'longtabu'};
    var ss = this.ss_to_first_bundle(style,ss,ssi);
    var ss = ss.slice(1,-1);
    var o = this.fence_to_tabular(style,ss,ssi);
    var text = o[0].img;
    var all = [];
    text = `\\placetable[split][${label}]{${this.uncode(style,title)}}{${text}}`;
    all.push(text);
    return all.join('\n');
  }
  float_to_columns(title,label,idnum,idcap,style,ss,ssi){
    style = {...style,n,float:'columns'};
    var itms = this.ss_to_figure_itms(style,ss,ssi);
    var row = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='bundle'){
        row.push(p);
      }
    });
    var n = row.length;
    var all = [];
    all.push('');
    all.push(`\\defineparagraphs[twocolumns][n=${n}]`);
    all.push(`\\starttwocolumns`);
    for(let i=0; i < n; ++i){
      if(i>0){
        all.push('\\twocolumns');
      }
      let p = row[i];
      all.push(p.img);
    }
    all.push(`\\stoptwocolumns`);
    return all.join('\n');
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
    const re_dhyphe = /^(--)(.*)$/s;
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
      if((v=re_dhyphe.exec(line))!==null){
        s = v[1];
        line=v[2];        
        safe+='-\\/-';
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
        return `{${this.int_to_letter_A(p.value)}${p.ending}} ${p.text}`;
      }
      if (p.type == 'a') {
        return `{${this.int_to_letter_a(p.value)}${p.ending}} ${p.text}`;
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
  lang_to_cjk(s,fn){
    if(fn){
      return `{\\switchtobodyfont[${fn}]${s}}`
    }
    return s;
  }
  ss_to_contex_tabulate_row_s(myss,style){
    var text = '';
    if(style.rules=='cols'||style.rules=='all'){
      text = myss.join(' \\VL ');
    }else if(style.rules=='groups'){
      let text1 = myss.slice(0,1).join(' \\NC ');
      let text2 = myss.slice(1).join(' \\NC ');
      text = `${text1} \\VL ${text2}`;
    }else{
      text = myss.join(' \\NC ');
    }
    if(style.frame==1 || style.frame=='box' || style.frame=='vsides'){
      text = `\\VL ${text} \\VL\\NR`;
    }else if(style.frame=='lhs'){
      text = `\\VL ${text} \\NC\\NR`;
    }else if(style.frame=='rhs'){
      text = `\\NC ${text} \\VL\\NR`;
    } else {
      text = `\\NC ${text} \\NC\\NR`;
    }
    return text;
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
  halign_to_contex_width_and_align(n,s) {
    /// \begin{tabular}{lcr}{
    /// | >{\hsize=0.5\hsize\raggedright\arraybackslash}X
    ///  | >{\hsize=0.5\hsize\centering\arraybackslash}X
    ///  | >{\hsize=2.0\hsize\raggedleft\arraybackslash}X | }
    var re_lcr = /^([lcr])\s*(.*)$/;
    var re_pw = /^p(\d+)\s*(.*)$/;
    var re_fw = /^f(\d+)\s*(.*)$/;
    var v;
    var pcols = [];
    var letters = {'l':'flushleft','c':'center','r':'flushright'};
    while(s && s.length) {
      if((v=re_lcr.exec(s))!==null){
        let align = letters[v[1]];
        let width = null;
        s = v[2];
        pcols.push({width,align});
      }
      else if((v=re_pw.exec(s))!==null){
        let width = v[1];
        let align = "flushleft";
        s = v[2];
        pcols.push({width,align});
      }
      else {
        break;
      }
    }
    while(pcols.length < n){
      let width = null;
      let align = "flushleft";
      pcols.push({width,align});
    }
    pcols = pcols.slice(0,n);
    return pcols;
  }
  to_tabulate_lcr_pcol(n,style){
    ///\blank\noindent \hbox{\starttabulate[|k5l|k1l|k5l|k5l|k5l|k5l|][distance=0pt,unit=0.1em,before={},after={}]
    var vbars = this.vrule_to_vbars(n,style.vrule)
    var pcols = this.string_to_array(style.align);
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
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_verb(style,cnt){
    let s = this.polish_verb(style,cnt);
    s = `{\\tt{}${s}}`;
    s = `\\quotation{${s}}`;
    return s;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_math(style,cnt){
    return this.tokenizer.to_phrase_math(style,cnt);
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_var(style,cnt){
    var ss = cnt.split('/');
    var ss = ss.map((s) => {return this.polish(style,s)});
    var ss = ss.map((s) => `{\\sl ${s}}`);
    return ss.join('/');    
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_em(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\it ${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_b(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\bf ${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_i(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\it ${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_u(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\underbar ${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_s(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\overstrike ${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_q(style,cnt){
    cnt = this.uncode(style,cnt);
    let ldquo = String.fromCodePoint(0x201C);
    let rdquo = String.fromCodePoint(0x201D);
    return `{${ldquo}{${cnt}}${rdquo}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_g(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\leftguillemot{${cnt}}\\rightguillemot}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_high(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\high{${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_low(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\low{${cnt}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_small(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\small ${cnt}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_mono(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\tt ${cnt}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_ref(style,cnt){
    if(this.search_label_in_blocks(cnt)){
      return `\\in[${cnt}]`
    }else{
      return `{\\it ${this.smooth(cnt)}}`;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_link(style,cnt){
    cnt = this.restore_uri(cnt);
    return `{\\tt \\hyphenatedurl{${cnt}}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_colorbutton(style,cnt){
    var ch = String.fromCodePoint(0x25FC);
    //var ch = '\\math{\\blacksquare}';
    return `\\inframed[autowidth=force,location=inline,height=1.2em]{\\color[${cnt}]{${ch}}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_fbox(style,cnt){
    if(cnt){         
      var wd = ""+cnt+"mm";
    }else{
      var wd = "";
    }
    if(!wd){
      return `\\inframed[width=10mm]{\\strut}`;
    }else{
      return `\\inframed[width=${wd}]{\\strut}`;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_dia(style,cnt){
    var {style,ss} = this.cnt_to_dia_phrase_itms(style,cnt);
    if(style.load){
      let name0 = style.load;
      if(style.buffers.hasOwnProperty(name0)){
        let ss0 = style.buffers[name0]
        if(ss0 && Array.isArray(ss0) && ss0.length){
          ss = ss0.concat(ss);
        }
      }
    }
    var o = this.diagram.to_diagram(style,ss);
    var img = '';
    if(o.length){
      img = o[0].img;
      img = `\\framed[frame=off,strut=off,location=top]{${img}}`
    }
    return img;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_default(style,cnt){
    return cnt;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_utfchar(style,cnt){
    return `\\utfchar{"${cnt}}`;
  }
  /////////////////////////////////////////////////////////////////
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
    all.push(`  headstyle=normal, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad, before=, after=,]`);
    all.push(`\\definedescription[HLpacked][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad, before=, after=,]`);
    all.push(`\\definedescription[DL][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft, `);
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
  /////////////////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////////////////
  to_preamble_fonts(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\enableregime[utf] % enable unicode fonts`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefallbackfamily [dejavu] [serif] [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [dejavu] [sans]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [dejavu] [mono]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [dejavu] [math]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefontfamily [dejavu] [serif] [dejavuserif]    [rscale=0.96]`);
    all.push(`\\definefontfamily [dejavu] [sans]  [dejavusans]     [rscale=0.96]`);
    all.push(`\\definefontfamily [dejavu] [mono]  [dejavusansmono] [rscale=0.96]`);
    all.push(`\\definefontfamily [dejavu] [math]  [dejavumath]     [rscale=0.96]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily [office] [serif] [Times New Roman]`);
    all.push(`\\definefontfamily [office] [sans]  [Arial] [rscale=0.9]`);
    all.push(`\\definefontfamily [office] [mono]  [Courier New]`);
    all.push(`\\definefontfamily [office] [math]  [TeX Gyre Termes Math]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefallbackfamily [linux] [serif] [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [linux] [sans]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [linux] [mono]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [linux] [math]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefontfamily [linux] [serif] [libertinusserif]`);
    all.push(`\\definefontfamily [linux] [sans]  [libertinussans]`);
    all.push(`\\definefontfamily [linux] [mono]  [libertinusmono] [rscale=0.85]`);
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
    all.push(`\\setupbodyfont[${this.contex_bodyfont}]`);
    all.push(`\\setupinterlinespace[line=${this.contex_linespace}]`);
    all.push(`\\setupwhitespace[${this.contex_whitespace}]`);
    all.push(`\\setupindenting[${this.contex_indenting}]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_papersize(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\setuppapersize[${this.contex_papersize}]`);
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
    all.push(`  headstyle=normal, style=normal, align=flushleft, margin=1em,`);
    all.push(`  alternative=hanging, width=broad, before=, after=,]`);
    all.push(`\\definedescription[DL][`);
    all.push(`  headstyle=bold, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad]`);
    all.push(`\\definedescription[HL][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft, margin=1em,`);
    all.push(`  alternative=hanging, width=broad]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n');
  }
  to_preamble_caption(){
    var all = [];
    var align = 'middle';
    if(this.contex_caption_align=='l'){
      align = 'right';
    }else if(this.contex_caption_align=='r'){
      align = 'left';
    }
    var style = '';
    if(this.contex_caption_small){
      style = 'small';
    }
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\setupcaptions[minwidth=\\textwidth, align=${align}, style=${style}, location=top]`);
    all.push(`\\setupcombination[style=${style}]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_misc(){
    var all = [];
    all.push(`\\setupinteraction[state=start]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\placebookmarks[part,chapter,section]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_symbols(){
    var all = [];
    all.push(`\\usesymbols[mvs]`);
    return all.join('\n');
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
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Choose an image file based on their extentions
  //
  ////////////////////////////////////////////////////////////////////////////////
  choose_image_file(ss){
    const supported = ['.pdf','.png','.jpg','.mps','.jpeg','.jbig2','.jb2','.PDF','.PNG','.JPG','.JPEG','.JBIG2','.JB2'];
    for(let s of ss){
      var extname = path.extname(s);
      if(supported.indexOf(extname)>=0){
        this.imgs.push(s);
        return s;
      }
    }
    return '';
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  to_mp_image(style,fname,xm,ym,unit,grid){
    var background = this.g_to_background_string(style);
    var fit = this.g_to_fit_string(style);
    var all = [];
    all.push(`\\startMPcode`);
    all.push(`numeric u; u := ${unit}mm;`);
    all.push(`numeric vw; vw := ${xm}*u;`);
    all.push(`numeric vh; vh := ${ym}*u;`);
    all.push(`draw unitsquare sized(vw,vh) withcolor white ;`);
    all.push(`picture p ; p := externalfigure "${fname}" ;`);
    all.push(`numeric sx ; sx := bbwidth(p)/vw ;`);
    all.push(`numeric sy ; sy := bbheight(p)/vh ;`);
    all.push(`for i=0 step ${ym} until ${ym}: draw (0,i*u) --- (${xm}*u,i*u) withcolor white; endfor;`);
    all.push(`for i=0 step ${xm} until ${xm}: draw (i*u,0) --- (i*u,${ym}*u) withcolor white; endfor;`);
    if(fit=='contain'){
      all.push(`if sx > sy : p := p xsized(vw) ; else : p := p ysized(vh) ; fi ;`);
    }else if(fit=='cover'){
      all.push(`if sx < sy : p := p xsized(vw) ; else : p := p ysized(vh) ; fi ;`);
    }else{
      ///default is 'fill'
      all.push(`p := p sized(vw,vh) ;`);
    }
    all.push(`draw p shifted((vw-bbwidth(p))/2,(vh-bbheight(p))/2) ;`);
    all.push(`clip currentpicture to unitsquare xscaled (vw) yscaled (vh) ;`);
    let width = this.g_to_width_float(style);
    let height = this.g_to_height_float(style);
    if (width && height){
      all.push(`currentpicture := currentpicture sized(${width}mm,${height}mm) ;`)
      var w = width;
    } else if (width) {
      all.push(`currentpicture := currentpicture xsized(${width}mm) ;`)
      var w = width;
    } else if (height) {
      all.push(`currentpicture := currentpicture ysized(${height}mm) ;`)
      var w = width * (xm/ym);
    } else {
      var w = xm*unit;
    }
    if(0){///draw a box around the current picture
      all.push(`path bb ; bboxmargin := 0pt ; bb := bbox currentpicture ;`);
      all.push(`draw bb withpen pencircle scaled 0.5pt withcolor black ;`);
    }
    all.push(`\\stopMPcode`);
    var img = all.join('\n');
    return [img,w];
  }
  to_definecolor_s(colorname){
    var p = w3color(colorname);///'p' is a special object
    var s = p.toHexString();
    ///\definecolor{MyBlue}{rgb}{0.9,0.9,1}
    var r = s.substr(1,2); 
    var g = s.substr(3,2);
    var b = s.substr(5,2);
    return `\\definecolor[${colorname}][h=${r}${g}${b}]`;
  }
  to_all_definecolor_s(){
    var colors = [
      "AliceBlue",
      "AntiqueWhite",
      "Aqua",
      "Aquamarine",
      "Azure",
      "Beige",
      "Bisque",
      "Black",
      "BlanchedAlmond",
      "Blue",
      "BlueViolet",
      "Brown",
      "BurlyWood",
      "CadetBlue",
      "Chartreuse",
      "Chocolate",
      "Coral",
      "CornflowerBlue",
      "Cornsilk",
      "Crimson",
      "Cyan",
      "DarkBlue",
      "DarkCyan",
      "DarkGoldenRod",
      "DarkGray",
      "DarkGrey",
      "DarkGreen",
      "DarkKhaki",
      "DarkMagenta",
      "DarkOliveGreen",
      "DarkOrange",
      "DarkOrchid",
      "DarkRed",
      "DarkSalmon",
      "DarkSeaGreen",
      "DarkSlateBlue",
      "DarkSlateGray",
      "DarkSlateGrey",
      "DarkTurquoise",
      "DarkViolet",
      "DeepPink",
      "DeepSkyBlue",
      "DimGray",
      "DimGrey",
      "DodgerBlue",
      "FireBrick",
      "FloralWhite",
      "ForestGreen",
      "Fuchsia",
      "Gainsboro",
      "GhostWhite",
      "Gold",
      "GoldenRod",
      "Gray",
      "Grey",
      "Green",
      "GreenYellow",
      "HoneyDew",
      "HotPink",
      "IndianRed",
      "Indigo",
      "Ivory",
      "Khaki",
      "Lavender",
      "LavenderBlush",
      "LawnGreen",
      "LemonChiffon",
      "LightBlue",
      "LightCoral",
      "LightCyan",
      "LightGoldenRodYellow",
      "LightGray",
      "LightGrey",
      "LightGreen",
      "LightPink",
      "LightSalmon",
      "LightSeaGreen",
      "LightSkyBlue",
      "LightSlateGray",
      "LightSlateGrey",
      "LightSteelBlue",
      "LightYellow",
      "Lime",
      "LimeGreen",
      "Linen",
      "Magenta",
      "Maroon",
      "MediumAquaMarine",
      "MediumBlue",
      "MediumOrchid",
      "MediumPurple",
      "MediumSeaGreen",
      "MediumSlateBlue",
      "MediumSpringGreen",
      "MediumTurquoise",
      "MediumVioletRed",
      "MidnightBlue",
      "MintCream",
      "MistyRose",
      "Moccasin",
      "NavajoWhite",
      "Navy",
      "OldLace",
      "Olive",
      "OliveDrab",
      "Orange",
      "OrangeRed",
      "Orchid",
      "PaleGoldenRod",
      "PaleGreen",
      "PaleTurquoise",
      "PaleVioletRed",
      "PapayaWhip",
      "PeachPuff",
      "Peru",
      "Pink",
      "Plum",
      "PowderBlue",
      "Purple",
      "RebeccaPurple",
      "Red",
      "RosyBrown",
      "RoyalBlue",
      "SaddleBrown",
      "Salmon",
      "SandyBrown",
      "SeaGreen",
      "SeaShell",
      "Sienna",
      "Silver",
      "SkyBlue",
      "SlateBlue",
      "SlateGray",
      "SlateGrey",
      "Snow",
      "SpringGreen",
      "SteelBlue",
      "Tan",
      "Teal",
      "Thistle",
      "Tomato",
      "Turquoise",
      "Violet",
      "Wheat",
      "White",
      "WhiteSmoke",
      "Yellow",
      "YellowGreen"
      ];
    var all = colors.map((s) => this.to_definecolor_s(s));
    return all.join('\n');
  }
  onerow_to_combination(onerow,o){
    let n = onerow.length;
    o.push(`\\hbox{\\startcombination[${n}*1] ${onerow.join('\n')} \\stopcombination}`);
  }
  to_hl_bullet_text(bullet){
    if(bullet=='>'){
      //return '{$\\triangleright$}';
      return String.fromCodePoint(0x25B8);
    }
    return '';
  }
  ww_to_context_starttable_pcol(ww,n){
    var ss = ww.map((p) => {
      if(p.width){
        return `p(${p.width-3}mm)`;//remove 1mm from the actual width for \starttable
      }else if(p.align=='center'){
        return 'c';
      }else if(p.align=='flushleft'){
        return 'l';
      }else if(p.align=='flushright'){
        return 'r';
      }else{
        return 'l';
      }
    })
    while(ss.length < n){
      ss.push('l');
    }
    return ss.join('|');
  }
  ss_to_longtabu(style,ss,ssi){
    ///'figure', 'table', and 'longtable'
    var {rows} = this.ss_to_tabular_rows(style,ss,ssi);
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
    var ww = this.halign_to_contex_width_and_align(n,style.align);
    var all = [];
    ///add configuration entries
    if(1){
      all.push(`\\setupTABLE[frame=off,loffset=4pt,roffset=4pt,toffset=0pt,boffset=0pt]`);
    }
    /// setup for hlines
    if(style.rules){
      if(style.rules=='groups'){
        if(style.head){
          all.push(`\\setupTABLE[r][1][bottomframe=on]`);
        } 
        if(style.side){
          all.push(`\\setupTABLE[c][1][rightframe=on]`);
        }
      }else if(style.rules=='rows'){
        all.push(`\\setupTABLE[r][each][bottomframe=on]`);
        all.push(`\\setupTABLE[r][last][bottomframe=off]`);
      }else if(style.rules=='cols'){
        all.push(`\\setupTABLE[c][each][rightframe=on]`);
        all.push(`\\setupTABLE[c][last][rightframe=off]`);
      }else if(style.rules=='all'){
        all.push(`\\setupTABLE[r][each][bottomframe=on]`);
        all.push(`\\setupTABLE[r][last][bottomframe=off]`);
        all.push(`\\setupTABLE[c][each][rightframe=on]`);
        all.push(`\\setupTABLE[c][last][rightframe=off]`);
      }
    }
    if(style.frame){
      if(style.frame==1||style.frame=='box'){
        all.push(`\\setupTABLE[r][first][topframe=on]`);
        all.push(`\\setupTABLE[r][last][bottomframe=on]`);
        all.push(`\\setupTABLE[c][first][leftframe=on]`);
        all.push(`\\setupTABLE[c][last][rightframe=on]`);
      }else if(style.frame=='above'){
        all.push(`\\setupTABLE[r][first][topframe=on]`);
      }else if(style.frame=='below'){
        all.push(`\\setupTABLE[r][last][bottomframe=on]`);
      }else if(style.frame=='hsides'){
        all.push(`\\setupTABLE[r][first][topframe=on]`);
        all.push(`\\setupTABLE[r][last][bottomframe=on]`);
      }else if(style.frame=='lhs'){
        all.push(`\\setupTABLE[c][first][leftframe=on]`);
      }else if(style.frame=='rhs'){
        all.push(`\\setupTABLE[c][last][rightframe=on]`);
      }else if(style.frame=='vsides'){
        all.push(`\\setupTABLE[c][first][leftframe=on]`);
        all.push(`\\setupTABLE[c][last][rightframe=on]`);
      }
    }
    let hl = `4`;
    /// setting horizontal and vertical offset
    var opts=[];
    if(style.float=='longtabu'){
      opts.push(`split=repeat`);
    }
    if(style.fontsize=='small'){
      opts.push(`style=small`);
    }
    all.push(`\\bTABLE[${opts.join(',')}]`);
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
    if(1){
      console.log('ww=',ww);
      ww.map((x, i) => {
        let {width,align} = x;
        if(width){
          all.push(`\\setupTABLE[c][${i + 1}][width=${width}mm,align=flushleft]`);
        }else if(align){
          all.push(`\\setupTABLE[c][${i + 1}][align=${align}]`);
        }
      });  
    }
    if(1){
      let vborders = this.string_to_int_array(style.vborder);
      vborders.forEach((x) => {
        all.push(`\\setupTABLE[c][${x+1}][leftframe=on]`);
      })
      vborders.forEach((x) => {
        all.push(`\\setupTABLE[c][${x}][rightframe=on]`);
      })
    }
    let vrules = [];
    for (let j = 0; j < rows.length; j++) {
      if(j==0 && style.head){
        all.push(`\\bTABLEhead`);
        let pp = rows[j];
        var myrowtext = this.pp_to_btable_row_text(pp,vrules,'\\bTH','\\eTH');
        if(pp.upper && pp.lower){
          all.push(`\\bTR[topframe=on,bottomframe=on] ${myrowtext} \\eTR`);
        }else if(pp.upper){
          all.push(`\\bTR[topframe=on] ${myrowtext} \\eTR`);
        }else if(pp.lower){
          all.push(`\\bTR[bottomframe=on] ${myrowtext} \\eTR`);
        }else{
          all.push(`\\bTR[] ${myrowtext} \\eTR`);
        }
        all.push(`\\eTABLEhead`);
      }else{
        all.push(`\\bTABLEbody`);
        let pp = rows[j];
        var myrowtext = this.pp_to_btable_row_text(pp,vrules,'\\bTD','\\eTD');
        if(pp.upper && pp.lower){
          all.push(`\\bTR[topframe=on,bottomframe=on] ${myrowtext} \\eTR`);
        }else if(pp.upper){
          all.push(`\\bTR[topframe=on] ${myrowtext} \\eTR`);
        }else if(pp.lower){
          all.push(`\\bTR[bottomframe=on] ${myrowtext} \\eTR`);
        }else{
          all.push(`\\bTR[] ${myrowtext} \\eTR`);
        }
        all.push(`\\eTABLEbody`);
      }
    }
    all.push(`\\eTABLE`);
    var img = all.join('\n');
    var o = [];
    var subc = style.subtitle||'';
    var subc = this.uncode(style,subc);
    o.push({img,subc,style});
    return o;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  plst_to_text(style,itemize){
    var text = this.itemize_to_text(style,itemize).trim();
    var all = [];
    all.push('');
    all.push('\\blank');
    all.push(text);
    return all.join('\n');
  }
  ///////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////
  cove_to_text(style,cove){
    var all = [];
    all.push('\\blank');
    all.push('\\startnarrower[1*left,0*right]');
    all.push(`\\defineparagraphs[mycove][n=2]`);
    all.push(`\\setupparagraphs[mycove][1][width=.05\\textwidth,align=left]`);
    all.push(`\\startmycove`);
    all.push(`\\framed[width=fit,frame=off,strut=no,location=top,align=left]{$\\triangleright$}`);
    all.push(`\\mycove`);
    var n = cove.length;
    var p0 = cove[0];
    var pn = cove[n-1];
    if(n >= 2 && p0.text.startsWith('```') && pn.text.startsWith('```')){
      let ss = cove.map((p) => p.text);
      let ssi = style.row;
      let o = this.do_bundle(style,ss,ssi);
      if(o.length){
        let img = o[0].frm;
        all.push(img);
      }
    }else{
      //all normal font size
      cove.forEach((p,i,arr) => {
        let text = this.uncode(style,p.text);
        if(i+1==arr.length){
        }else{
          text += ' \\crlf';
        }
        all.push(text);
      })
    }
    all.push('\\stopmycove')
    all.push('\\stopnarrower')
    return all.join('\n');
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  math_to_text(style,cove){
    var all = [];
    all.push('');
    all.push('\\startalignment[center] \\dontleavehmode');
    var n = cove.length;
    var p0 = cove[0];
    var pn = cove[n-1];
    if(n >= 2 && p0.text.startsWith('```') && pn.text.startsWith('```')){
      let ss = cove.map((p) => p.text);
      let ssi = style.row;
      let o = this.do_bundle(style,ss,ssi);
      if(o.length){
        let img = o[0].frm;
        all.push(img);
      }
    }else{
      //all normal font size
      cove.forEach((p,i,arr) => {
        let text = this.uncode(style,p.text);
        if(i==arr.length-1){
        }else{
          text += ' \\\\';
        }
        all.push(text);
      })
    }
    all.push('\\stopalignment')
    return all.join('\n');
  }    
  ///////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////
  samp_to_text(style,samp){
    let ss = samp.map((p) => {
      let x = p.text;
      x = x.trimRight();
      x = this.polish_verb(style,x);
      if (!x) {
        x = "~";
      }
      return x;
    });
    var opts = [];
    var s_interlinespace = '';
    if(this.contex_samp_small){
      opts.push(`style=small`);
      s_interlinespace = `\\setupinterlinespace[line=${this.contex_linespace_small}]`;
    }
    let all = [];
    all.push('\\blank');//need a blank, otherwise there are no vertical spaces in front of it---dont know why
    all.push(`\\startalignment[right]${s_interlinespace}`);
    all.push(`\\startlines[${opts.join(',')}]`);
    ss.forEach((s) => {
      all.push(`{\\tt ${s}}`);
    });
    all.push(`\\stoplines`);
    all.push(`\\stopalignment`);
    return all.join('\n')
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  prim_to_text(style,title,body){
    var all = [];
    var title = this.uncode(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    all.push('');
    if(style.rank==2) {
      all.push(`\\blank\\indent\\mbox{\\bi ${title}} ~ ${text}`);
    }else{
      all.push(`\\blank\\noindent\\mbox{\\bf ${title}} ~ ${text}`);
    } 
    return all.join('\n');
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  norm_to_text(style,body){
    body = this.trim_samp_body(body);
    var n = body.length;
    var s0 = body[0];
    var sn = body[n-1];
    if(n >= 2 && s0.startsWith('```') && sn.startsWith('```')){
      let all = [];
      all.push('\\blank')
      all.push('\\startalignment[right] \\dontleavehmode');
      let ss = body;
      let ssi = style.row;
      let o = this.do_bundle(style,ss,ssi);
      if(o.length){
        let img = o[0].frm;
        all.push(img);
      }
      all.push('\\stopalignment')
      all.push('\\blank')
      var text = all.join('\n');
    }else{
      var text = this.join_para(body);
      var text = this.uncode(style,text);
    }
    var all = [];
    all.push('');
    all.push(text);
    return all.join('\n');
  }  
}
module.exports = { NitrilePreviewContex };
