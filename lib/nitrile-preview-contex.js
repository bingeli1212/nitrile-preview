'use babel';

const { NitrilePreviewDiagramMF } = require('./nitrile-preview-diagram-mf');
const { NitrilePreviewCmath } = require('./nitrile-preview-cmath');
const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const w3color = require('./nitrile-preview-w3color');
const path = require('path');
const { all } = require('express/lib/application');
const { urlToHttpOptions } = require('url');

class NitrilePreviewContex extends NitrilePreviewTranslator {

  constructor(parser) {
    super(parser);
    this.name='contex';
    this.tokenizer = new NitrilePreviewCmath(this);
    this.diagram = new NitrilePreviewDiagramMF(this);
    this.imgs = [];
    this.flags = {};
    this.enumerate_counter = 0;
    this.blacktriangleright = '{$\\blacklozenge$}';
    this.symbol_name_map = this.tokenizer.symbol_name_map;
    this.symbol_cc_map = this.tokenizer.symbol_cc_map;
    ///icons
    this.icon_bullet       = '{\\textbullet}';
    this.icon_circlebox    = '\\symbol[martinvogel 2][CircSteel]'                       
    this.icon_circleboxo   = '\\symbol[martinvogel 2][CircPipe]'                       
    this.icon_squarebox    = '\\symbol[martinvogel 2][SquareSteel]'
    this.icon_squareboxo   = '\\symbol[martinvogel 2][SquarePipe]'
    this.icon_writing_hand = '\\symbol[martinvogel 2][WritingHand]';
    // this.icon_dag = '{\\symbol[martinvogel 2][Cross]}';
    // this.icon_hollowbox = '{\\symbol[martinvogel 2][HollowBox]}'; 
    // this.icon_checkedbox = '{\\symbol[martinvogel 2][CheckedBox]}';             
    this.icon_nabla = '{\\nabla}';
    this.icon_dag = '{\\dag}';
    this.icon_hollowbox = '{\\square}'; 
    this.icon_checkedbox = '{\\blacksquare}';             
    ///configuration
    this.contex_papersize = 'A5';
    this.contex_bodylineheight = 1;
    this.contex_whitespacesize = 5;
    this.contex_caption_align = 'c';
    this.contex_caption_small = 1;
    this.contex_style_chapter = '\\bfd';
    this.contex_style_section = '\\bfa';
    this.contex_style_subsection = '\\bf';
    this.contex_style_subsubsection = '\\bf';
    this.contex_style_subsubsubsection = '\\bf';
    this.contex_blank = 0;
    this.contex_noindent = 0;
  }
  /////////////////////////////////////////////////////////////////////////////
  ///
  /////////////////////////////////////////////////////////////////////////////
  hdgs_to_part(title,label,style){
    var o = [];
    var raw = title;
    o.push('');
    o.push(`\\startpart[title={${this.polish(style,title)}},reference={${label}},bookmark={${raw}}]`);
    o.push(`Part ${style.__partnum} ${this.polish(style,title)}`);
    o.push(`\\stoppart`)
    return o.join('\n')
  }
  hdgs_to_chapter(title,label,style){
    var o = [];
    var raw = title;
    o.push('');
    o.push(`\\startchapter[title={${this.polish(style,title)}},reference={${label}},bookmark={${raw}}]`);
    return o.join('\n')
  }
  hdgs_to_section(title,label,level,style){
    var o = [];
    o.push('');
    o.push(`\\startsection[title={${this.polish(style,title)}},reference={${label}},bookmark={${title}}]`);
    return o.join('\n')
  } 
  hdgs_to_subsection(title,label,level,style){
    var o = [];
    o.push('');
    o.push(`\\startsubsection[title={${this.polish(style,title)}},reference={${label}},bookmark={${title}}]`);
    return o.join('\n')
  } 
  hdgs_to_subsubsection(title,label,level,style){
    var o = [];
    o.push('');
    o.push(`\\startsubsubsection[title={${this.polish(style,title)}},reference={${label}},bookmark={${title}}]`);
    return o.join('\n')
  } 
  //////////////////////////////////////////////////////////////////////////
  ///
  //////////////////////////////////////////////////////////////////////////
  item_dl_to_text(style,i,item,nblank){
    var o = [];
    var term = this.uncode(style,item.term);
    var text = this.join_para(item.body).trim();
    var text = this.uncode(style,text);
    if(text.length){
      o.push(`\\sym {\\bf ${term}}\\crlf\n${text}`);           
    }else{
      o.push(`\\sym {\\bf ${term}}`);
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
    return o.join('\n');
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
    return o.join('\n');
  }
  item_ol_to_text(style,i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    if(item.bullet=='*'){
      let a = style.__parser.memo['*']||0;
      a++;
      style.__parser.memo['*'] = a;
      o.push(`\\sym {${a}.} ${text}`);
    }else if(item.type == 'A'){
      o.push(`\\sym {${this.int_to_letter_A(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'a'){
      o.push(`\\sym {${this.int_to_letter_a(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'I'){
      o.push(`\\sym {${this.int_to_letter_I(item.value)}${item.ending}} ${text}`)
    }else if(item.type == 'i'){
      o.push(`\\sym {${this.int_to_letter_i(item.value)}${item.ending}} ${text}`)
    }else if(item.value) {
      o.push(`\\sym {${item.value}${item.ending}} ${text}`);
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
    return o.join('\n');
  }
  item_ul_to_text(style,i,item,nblank){
    var o = [];
    var text = this.join_para(item.body);
    var text = this.uncode(style,text).trim();
    o.push(`\\item{}${text}`);
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
    return o.join('\n')
  }
  itemize_to_text(style,itemize){
    var bull = itemize.bull;
    var items = itemize.items;
    var nblank = itemize.nblank;
    var nowhitespace = 0;
    var o = [];
    switch (bull) {
      case 'DL': {
        if(!nblank){
          o.push(`\\startitemize[packed][itemalign=flushleft,leftmargin=0pt]`);
        }else{
          o.push(`\\startitemize[][itemalign=flushleft,leftmargin=0pt]`);
        }
        items.forEach((item,j) => {
          let text = this.item_dl_to_text(style,j,item,nblank);
          o.push(text);
        });
        o.push('\\stopitemize')
        break;
      }
      case 'OL': {
        if(!nblank){
          o.push(`\\startitemize[n,packed][itemalign=flushright,leftmargin=0pt,width=15pt,distance=5pt]`);
        }else{
          o.push(`\\startitemize[n][itemalign=flushright,leftmargin=0pt,width=15pt,distance=5pt]`);
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
          o.push(`\\startitemize[packed][itemalign=flushright,leftmargin=0pt,width=15pt,distance=5pt]`);
        }else{
          o.push(`\\startitemize[][itemalign=flushright,leftmargin=0pt,width=15pt,distance=5pt]`);
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
      return o.join('\n');
    }
    if(nowhitespace){
      return o.join('\n\\nowhitespace\n');
    }
    return o.join('\n');
  }
  //////////////////////////////////////////////////////////////////////////
  ///
  //////////////////////////////////////////////////////////////////////////

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
  fence_to_fml(g,ss) {
    var str = ss.join('\n');
    var used = new Set();
    var sss = this.tokenizer.to_align_math(str,g,used,1);
    var max_n = 1;
    sss.forEach((ss) => {
      let n = ss.length;
      if(n > max_n){
        max_n = n;
      }
    })
    sss = sss.map((ss) => {
      while(ss.length < max_n){
        ss.push('');
      }
      return ss;
    })
    var pcols = 'l'.repeat(max_n).split('');
    if(pcols.length>0){
      pcols[0]='r';
    }
    var pcols=pcols.map(s => `k0${s}`);
    var pcol=pcols.join('|'); 
    var all = [];
    all.push(`\\startformula`);
    all.push(`\\startmathalignment`)
    sss.forEach((ss) => {
      let s = ss.join(' \\NC ');
      s = `\\NC ${s} \\NR`
      all.push(s);
    })
    all.push(`\\stopmathalignment`)
    all.push(`\\stopformula`);
    var text = all.join('\n');
    var fml = text;
    return({fml,sss,style: g});
  }
  fence_to_img(g,ss){
    if(g.type=='ink'){
      return this.ss_to_ink(g,ss);
    }else{
      return this.diagram.to_diagram(g,ss);  
    }
  }
  fence_to_tab(g,ss){
    var hew = parseInt(g.hew)||1;
    var vrules = this.string_to_int_array(g.vrules);
    var hrules = this.string_to_int_array(g.hrules);
    var stretch = this.assert_float(g.stretch,0,0,1);
    var ww = this.string_to_ww_array(g.template,g.textalign);
    var rows = this.ss_to_tab_rows(ss,ww.length,g);
    var m = ww.length;
    rows.forEach((pp,j) => {
      pp.forEach((p,i) => {
        p.text = this.uncode(g,p.text);
        if(p.text.length==0){
          p.text = '~';
        }
        if(g.head && j==0){
          p.text = `{\\bold ${p.text}}`
        }
      })
    })
    rows.forEach((pp,j) => {
      if(hrules.indexOf(j)>=0){
        pp.topframe=1;
      }
      pp.forEach((p,i) => {
        if(vrules.indexOf(i)>=0){
          p.leftframe=1;
        }
      })
    })
    var heads = [];
    if(g.head){
      heads = rows.slice(0,1);
      rows.shift();
    }
    if(hew>1){
      if(1){
        let ww1 = ww.map(w=>w);
        for(let i=1; i<hew; ++i){
          ww.push({ta:'',pw:1});//1mm gap
          ww1.forEach(w=>ww.push(w));
        }
      }
      if(1){
        heads.forEach((pp,j,arr) => {
          let ss1 = pp.map(p => p.text);
          for(let i=1; i<hew; ++i){
            pp.push({text:''});
            ss1.forEach(s => pp.push({text:s}));
          }
        });
      }
      if(1){
        let k = Math.ceil(rows.length/hew);
        rows.forEach((pp,j,arr) => {
          if(j<k){
            let m = pp.length;
            for(let i=1; i<hew; ++i){
              let ss1 = 'x'.repeat(m).split("").map(x=>'');
              if(i*k+j < arr.length){
                ss1 = arr[i*k+j].map(p=>p.text);
              }
              pp.push({text:''});
              ss1.forEach(s => pp.push({text:s}));
            }
          }
        });
        rows = rows.slice(0,k);//only keep the top k rows
      }
    }
    var totalw = 0;
    ww.forEach((p,j) => {
      if(p.pw){
        totalw += p.pw;
      }else{
        totalw += 10;
        p.pw = 10;
      }
    })
    var all = [];
    // opts.push('option=stretch');
    var textsmaller = '';
    if(g.fontsize=='smaller'){
      textsmaller = '\\small\\setupinterlinespace';
    }
    if(rows.title){
      all.push(`\\inframed[frame=off,align=center,width=\\textwidth]{${this.polish(g,rows.title)}}`)
    }
    all.push(`\\bTABLE[style=${textsmaller}]`);
    ///add configuration entries
    if(1){
      all.push(`\\setupTABLE[frame=off,loffset=2pt,roffset=2pt,toffset=0.5pt,boffset=0.5pt]`);
    }
    /// setup for hlines
    if(g.rules){
      if(g.rules=='groups'){
        if(g.head){
          all.push(`\\setupTABLE[r][1][bottomframe=on]`);
        } 
        if(g.side){
          all.push(`\\setupTABLE[c][1][rightframe=on]`);
          if(hew>1){
            let k=1;
            for(let i=1; i<hew; ++i){
              k+=1;
              k+=m;
              all.push(`\\setupTABLE[c][${k}][rightframe=on]`);
            }
          }
        }
      }else if(g.rules=='rows'){
        all.push(`\\setupTABLE[r][each][bottomframe=on]`);
        all.push(`\\setupTABLE[r][last][bottomframe=off]`);
      }else if(g.rules=='cols'){
        all.push(`\\setupTABLE[c][each][rightframe=on]`);
        all.push(`\\setupTABLE[c][last][rightframe=off]`);
      }else if(g.rules=='all'){
        all.push(`\\setupTABLE[r][each][bottomframe=on]`);
        all.push(`\\setupTABLE[r][last][bottomframe=off]`);
        all.push(`\\setupTABLE[c][each][rightframe=on]`);
        all.push(`\\setupTABLE[c][last][rightframe=off]`);
      }
    }
    if(g.frame){
      if(g.frame==1||g.frame=='box'){
        all.push(`\\setupTABLE[r][first][topframe=on]`);
        all.push(`\\setupTABLE[r][last][bottomframe=on]`);
        all.push(`\\setupTABLE[c][first][leftframe=on]`);
        all.push(`\\setupTABLE[c][last][rightframe=on]`);
      }else if(g.frame=='above'){
        all.push(`\\setupTABLE[r][first][topframe=on]`);
      }else if(g.frame=='below'){
        all.push(`\\setupTABLE[r][last][bottomframe=on]`);
      }else if(g.frame=='hsides'){
        all.push(`\\setupTABLE[r][first][topframe=on]`);
        all.push(`\\setupTABLE[r][last][bottomframe=on]`);
      }else if(g.frame=='lhs'){
        all.push(`\\setupTABLE[c][first][leftframe=on]`);
      }else if(g.frame=='rhs'){
        all.push(`\\setupTABLE[c][last][rightframe=on]`);
      }else if(g.frame=='vsides'){
        all.push(`\\setupTABLE[c][first][leftframe=on]`);
        all.push(`\\setupTABLE[c][last][rightframe=on]`);
      }
    }
    if(hew>1){    
      ///setup vertical lines between hew sections
      let k=1;
      for(let i=1; i<hew; ++i){
        k+=1;
        k+=m;
        all.push(`\\setupTABLE[c][${k}][leftframe=on]`);
        all.push(`\\setupTABLE[c][${k-1}][leftframe=on]`);
      }
    }
    if(1){
      //setup column width and alignment
      ww.map((x, i) => {
        let {pw,ta} = x;
        if(ta=='r'){
          ta = 'flushright'
        }else if(ta=='c'){
          ta = 'center'
        }else{
          ta = 'flushleft';
        }
        let mywidth = `${pw}mm`;
        if(stretch>0){
          mywidth = `${pw/totalw*stretch}\\textwidth`;
        }
        all.push(`\\setupTABLE[c][${i + 1}][width=${mywidth},align={${ta},lohi}]`);
      });  
    }
    if(1){
      heads.forEach((pp,j,arr) => {
        if(j==0){
          //all.push(`\\bTABLEhead`);
        }
        let myrowtext = pp.map((p,i) => {
          if(p.leftframe){
            return `\\bTD[leftframe=on] ${p.text} \\eTD`;
          }else{
            return `\\bTD ${p.text} \\eTD`;
          }
        }).join(' ');
        let topframe = '';
        if(pp.topframe){
          topframe='topframe=on';
        }
        all.push(`\\bTR[${topframe}] ${myrowtext} \\eTR`);
        if(j+1==arr.length){
          //all.push(`\\eTABLEhead`);
        }
      });
    }
    if(1){
      rows.forEach((pp,j,arr) => {
        if(j==0){
          //all.push(`\\bTABLEbody`);
        }
        let myrowtext = pp.map((p,i) => {
          if(p.leftframe){
            return `\\bTD[leftframe=on] ${p.text} \\eTD`;
          }else{
            return `\\bTD ${p.text} \\eTD`;
          }
        }).join(' ');
        let topframe = '';
        if(pp.topframe){
          topframe='topframe=on';
        }
        all.push(`\\bTR[${topframe}] ${myrowtext} \\eTR`);
        if(j+1==arr.length){
          //all.push(`\\eTABLEbody`);        
        }
      });
    }
    all.push(`\\eTABLE`);
    var tab = all.join('\n');
    return {tab,style: g};
  }
  fence_to_par(g,ss) {
    ss = this.ss_to_backslashed_ss(ss);
    ss = ss.map(s => this.uncode(g,s));
    var text2 = ss.map(s => `\\NC ${s} \\NC\\NR`).join('\n');    
    var textsmaller = '';
    var textalign = 'l';
    if(g.fontsize=='smaller'){
      textsmaller = 'small';
    }
    if(g.textalign){
      textalign = g.textalign;
    }
    var par = `\\starttabulate[|k0${textalign}p|][bodyfont=${textsmaller}]\n${text2}\n\\stoptabulate`;
    return({par,style: g});
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///
  /// float
  ///
  ///////////////////////////////////////////////////////////////////////////////////////////////
  float_to_blockquote(title,label,style,subtitles,body,bodyrow){
    body = this.ss_to_backslashed_ss(body);
    body = body.map((s) => this.uncode(style,s));
    var text = body.join('\\crlf\n');
    var all = [];
    all.push('');
    all.push('\\startitemize[leftmargin=20pt,width=10pt,distance=0pt,itemalign=flushleft]');
    all.push(`\\sym {} ${text}`);
    all.push('\\stopitemize');
    return all.join('\n');
  }
  float_to_preformatted(title,label,style,subtitles,body,bodyrow){
    let ss = body.map((s,j) => {
      let x = s;
      x = x.trimEnd();
      if (!x) {
        x = "~";
      }else{
        x = this.polish_verb(style,x);
      }
      return x;
    });
    var opts = [];
    let hew = this.g_to_hew_int(style);
    let n = ss.length;
    let all = [];
    all.push('');
    all.push('\\blank');//need a blank, otherwise there are no vertical spaces in front of it---dont know why
    all.push(`\\startalignment[right]`);
    all.push(`\\startlines[${opts.join(',')}]`);
    ss.forEach((s) => {
      all.push(`{\\tt ${s}}`);
    });
    all.push(`\\stoplines`);
    all.push(`\\stopalignment`);
    return all.join('\n')
  }
  float_to_flushleft(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    var itms = bundles.map((bundle) => this.do_bundle(style,bundle));
    var d = [];
    var one = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='\\\\'){
        d.push(one.join("\n"));
        one = [];
      }else{
        if(p.fml){
          let text = p.fml;
          one.push(text);
        }else if(p.img){
          let text = p.img;//itm.img is known to have \framed
          one.push(text);
        }else if(p.tab){
          let text = p.tab;
          one.push(text);
        }else if(p.par){
          let text = p.par;
          one.push(text);
        }
      }
      if(j+1==arr.length){
        d.push(one.join("\n"));
      }
    });
    var text = d.join("\\crlf\n");
    var all = [];
    all.push('');
    all.push('\\blank')
    all.push('\\startalignment[flushleft]\\dontleavehmode');
    all.push(text);
    all.push('\\stopalignment')
    return all.join('\n');
  }
  float_to_center(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    var itms = bundles.map((bundle) => this.do_bundle(style,bundle));
    var d = [];
    var one = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='\\\\'){
        d.push(one.join("\n"));
        one = [];
      }else{
        if(p.fml){
          let text = p.fml;
          one.push(text);
        }else if(p.img){
          let text = p.img;//itm.img is known to have \framed
          one.push(text);
        }else if(p.tab){
          let text = `${p.tab}`;
          one.push(text);
        }else if(p.par){
          let text = p.par;
          one.push(text);
        }
      }
      if(j+1==arr.length){
        d.push(one.join("\n"));
      }
    });
    var text = d.join("\\crlf\n");
    var all = [];
    all.push('');
    all.push('\\blank')
    all.push('\\startalignment[center]\\dontleavehmode');
    all.push(text);
    all.push('\\stopalignment')
    return all.join('\n');
  }
  float_to_body(title,label,style,subtitles,body,bodyrow){
    body = this.ss_to_backslashed_ss(body);
    body = body.map((text) => {
      text = this.uncode(style,text);
      return text;
    });
    var text = body.join('\\crlf\n');
    var all = [];
    all.push('');
    if(this.contex_blank && this.contex_noindent){
      all.push('\\blank\\noindent');
    }else if(this.contex_blank){
      all.push('\\blank');
    }
    all.push(text);
    return all.join('\n');
  } 
  float_to_details(title,label,style,subtitles,body,bodyrow){
    var step = this.body_to_details(body);
    var all = [];
    all.push('');
    step.forEach((p,i) => {
      if(i==0){
        if(p.value=='+'){
          if(p.lines.length){
            all.push(`\\startitemize[itemalign=flushleft,leftmargin=0pt]`);   
            all.push(`\\sym{\\bf ${this.uncode(style,p.term)}}\\crlf\n${this.uncode(style,this.join_para(p.lines).trim())}`);
          }else{
            all.push(`\\startitemize[itemalign=flushleft,leftmargin=0pt]`);   
            all.push(`\\sym{\\bf ${this.uncode(style,p.term)}}`);
          }
        }else if(p.value==':'){
          if(p.lines.length){
            all.push(`\\startitemize[itemalign=flushleft,leftmargin=0pt]`);   
            all.push(`\\sym{\\bf ${this.polish(style,p.term)}}\\crlf\n${this.uncode(style,this.join_para(p.lines).trim())}`);
          }else{
            all.push(`\\startitemize[itemalign=flushleft,leftmargin=0pt]`);   
            all.push(`\\sym{\\bf ${this.polish(style,p.term)}}`);
          }
        }else if(p.value=='-'){
          all.push(`\\startitemize[itemalign=flushright,leftmargin=0pt,width=15pt,distance=5pt]`);   
          all.push(`\\item ${this.uncode(style,this.join_para(p.lines).trim())}`);
        }else if(p.value=='*'){
          let a = style.__parser.memo['*']||0;
          a++;
          style.__parser.memo['*'] = a;
          all.push(`\\startitemize[itemalign=flushright,leftmargin=0pt,width=15pt,distance=5pt]`);   
          all.push(`\\sym{${a}.} ${this.uncode(style,this.join_para(p.lines).trim())}`);
        }else{
          all.push(`\\startitemize[itemalign=flushright,leftmargin=0pt,width=15pt,distance=5pt]`);   
          all.push(`\\sym{${p.value}.} ${this.uncode(style,this.join_para(p.lines).trim())}`);
        }
      }else{
        if(this.re_body_is_fence.test(p.lines[0])){
          var bundles = this.body_to_all_bundles(style,p.lines);
          var itms = bundles.map((bundle) => this.do_bundle(style,bundle));
          let d = [];
          itms.forEach((p,i,arr)=>{
            if(p.type=='bundle'){
              if(p.fml){
                d.push(p.fml);
              }else if(p.img){
                d.push(p.img);
              }else if(p.tab){
                d.push(p.tab);
              }else if(p.par){
                d.push(p.par);
              } 
            }
          });
          let text = d.join('\n');
          all.push('');
          all.push(`\\blank\\noindent`);
          all.push('\\startalignment[flushleft]\\dontleavehmode');
          all.push(text);
          all.push('\\stopalignment');
        }else if(this.re_body_is_gthan.test(p.lines[0])){
          let lines = this.body_to_body(p.lines,this.re_body_is_gthan).map(x=>`${this.icon_nabla}\\ \\ ${this.uncode(style,x)}`);
          let text = lines.join('\\\\\n')
          all.push('');
          all.push(`\\blank\\noindent`);
          all.push(text);
        }else if(this.re_body_is_hyphe.test(p.lines[0])){
          let lines = this.body_to_body(p.lines,this.re_body_is_hyphe).map(x=>`${this.icon_bullet}\\ \\ ${this.uncode(style,x)}`);
          let text = lines.join('\\\\\n')
          all.push('');
          all.push(`\\blank\\noindent`);
          all.push(text);
        }else if(this.re_body_is_vtbar.test(p.lines[0])){
          let lines = this.body_to_body(p.lines,this.re_body_is_vtbar).map(x=>`${this.uncode(style,x)}`);
          let text = lines.join('\\\\\n')
          all.push('');
          all.push(`\\blank\\noindent`);
          all.push(text);
        }else if(this.re_body_is_tilda.test(p.lines[0])){
          let lines = this.body_to_body(p.lines,this.re_body_is_tilda).map(x=>`${this.polish_verb(style,x)}`);
          let text = lines.join('\n')
          all.push('');
          all.push(`\\blank\\noindent`);
          all.push('\\startlines\\tt');
          all.push(text);
          all.push('\\stoplines');
        }else{
          all.push('');
          all.push(`\\blank\\noindent`);
          all.push(this.uncode(style,this.join_para(p.lines)));
        }
      }
    });
    all.push(`\\stopitemize`);
    return all.join('\n');
  } 
  float_to_primary(title,label,style,subtitles,body,bodyrow){
    var all = [];
    var title = this.polish(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    all.push('');
    all.push(`\\godown[5pt]`);
    all.push(`\\blank\\noindent\\mbox{\\bf ${title}} ${text}`);
    return all.join('\n');
  }
  float_to_secondary(title,label,style,subtitles,body,bodyrow){
    var all = [];
    var title = this.polish(style,title).trim();
    var text = this.join_para(body);
    var text = this.uncode(style,text).trim();
    all.push('');
    all.push(`\\blank\\noindent\\mbox{\\bi ${title}} ${text}`);
    return all.join('\n');
  }
  float_to_figure(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    var itms = bundles.map((bundle) => this.do_bundle(style,bundle,'img'));
    var fignum = style.__fignum;
    if(style.__chapnum){
      fignum = style.__chapnum+"."+fignum;
    }
    let caption = this.uncode(style,title).trim();
    let s_align = "center";
    let s_interls = '';
    subtitles = subtitles.map(x=>x);
    if(1){
      let onerow = [];
      let o = [];
      itms.forEach((p,j,arr) => {
        if(p.type=='bundle'){
          if(p.img){
            let subtitle = subtitles.shift();
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
      o.push(`{${caption}}`);
      o.push(`{\\startalignment[${s_align}] \\dontleavehmode ${text} \\stopalignment}`);
      return o.join('\n');
    }
  }
  float_to_wrapfig(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    bundles = this.merge_all_bundles(style,bundles);
    let o = [];
    bundles.forEach((bundle,j,arr) => {
      let p = this.do_bundle(style,bundle,'img');
      o.push(p.img);
    });
    var caption = this.uncode(style,title);
    var text = o.join('\n')
    if(style.align=='left'){
      return(`\n\\placefigure[left,none][]{}{${text}}${caption}`);
    }else{
      return(`\n\\placefigure[right,none][]{}{${text}}${caption}`);
    }
  }
  float_to_wraptab(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    bundles = this.merge_all_bundles(style,bundles);
    let o = [];
    bundles.forEach((bundle,j,arr) => {
      let p = this.do_bundle(style,bundle,'tab');
      o.push(p.tab);
    });
    var caption = this.uncode(style,title);
    var text = o.join('\n')
    if(style.align=='left'){
      return(`\n\\placetable[left,none][]{}{${text}}${caption}`);
    }else{
      return(`\n\\placetable[right,none][]{}{${text}}${caption}`);
    }
  }
  float_to_equation(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    bundles = bundles.filter(bundle => bundle.type=='bundle');
    if(bundles.length==1){
      var all = [];
      all.push('');
      all.push(`\\placeformula[${label}]`);//only one \startformula and \stopformula for a single \placeformula
      bundles.forEach((bundle,j,arr) => {
        let itm = this.do_bundle(style,bundle,'fml');
        let fml = itm.fml;
        all.push(fml);
      })
      return all.join('\n');
    }else{
      var all = [];
      all.push('');
      all.push(`\\startsubformulas[${label}]`);//only one \startformula and \stopformula for a single \placeformula
      bundles.forEach((bundle,j,arr) => {
        all.push(`\\placeformula`);//only one \startformula and \stopformula for a single \placeformula
        let itm = this.do_bundle(style,bundle,'fml');
        let fml = itm.fml;
        all.push(fml);
      })
      all.push(`\\stopsubformulas`);
      return all.join('\n');
    }
  }
  float_to_listing(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    var splitid = '';
    bundles = this.merge_all_bundles(style,bundles);
    var lstnum = style.__lstnum;
    if(style.__chapnum){
      lstnum = style.__chapnum+"."+lstnum;
    }
    let caption = this.uncode(style,title);
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let ss = bundle.ss; //raw ss without encoding, used for \\starttyping
      var splitsi = bundle.si||0;  
      let o = [];
      ///the space=fixed option disallows line breaking even when the line is too long,
      ///margin=10pt option adds a left margin to the content, line numbers will be right-aligned
      ///and placed to the left-hand side of the context box, numbering=line enables line numbering,
      ///start=41 would assign line number "41" to first line
      o.push(`\\starttyping[start=${1},numbering=line,space=fixed,margin=10pt]`);
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
      all.push(`{${caption}}`);
      all.push(`{${text}}`)
    });
    return all.join('\n');
  }
  float_to_table(title,label,style,subtitles,body,bodyrow) {
    var bundles = this.body_to_all_bundles(style,body);
    bundles = this.merge_all_bundles(style,bundles);
    var tabnum = style.__tabnum;
    if(style.__chapnum){
      tabnum = style.__chapnum+"."+tabnum;
    }
    var caption = this.uncode(style,title);
    var all = [];
    bundles.forEach((bundle,j,arr) => {
      let itm = this.do_bundle(style,bundle,'tab');
      let text = itm.tab;
      if(0&&style.__subcaptions.length){
        text = this.to_subcaptioned_tabular(text,style,style.__subcaptions);
      }
      all.push('')
      all.push(`\\placetable`);
      all.push(`[here]`);
      all.push(`[${label}]`);
      all.push(`{${caption}}`);
      all.push(`{${text}}`)
    });
    return all.join('\n');
  }
  float_to_multicol(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    //bundles = bundles.filter((p) => (p.type=='bundle'));
    var itms = bundles.map((bundle) => this.do_bundle(style,bundle));
    var n = 1
    var d = [];
    var one = [];
    itms.forEach((p,j,arr) => {
      if(p.type=='\\\\'){
        d.push(one.join("\n"));
        d.push('\\column');
        one = [];
        n++;
      }else{
        if(p.fml){
          one.push(p.fml);
        }else if(p.img){
          one.push('\\dontleavehmode');
          one.push(p.img);
        }else if(p.tab){
          one.push(`\\hbox{${p.tab}}`);
        }else if(p.par){
          one.push(p.par);
        }
      }
      if(j+1==arr.length){
        d.push(one.join("\n"));
        one = [];
      }
    });
    var text = d.join("\n");
    var all = [];
    all.push('');
    all.push(`\\startcolumns[n=${n}]`);
    all.push(text);
    all.push(`\\stopcolumns`);
    return all.join('\n');
  }
  float_to_linesleft(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    bundles = this.merge_all_bundles(style,bundles);
    var all = [];
    all.push('');
    all.push('\\blank')
    bundles.forEach((bundle)=>{
      let ss = bundle.ss;
      let align = 'flushleft';
      all.push(`\\startalignment[${align}]\\dontleavehmode`);
      ss = ss.map(s => {
        s = this.uncode(style,s);
        s = this.solidify(s);
        return(s);
      });
      all.push(ss.join("\\crlf\n"))
      all.push(`\\stopalignment`);
    })
    return all.join('\n');
  }
  float_to_linescenter(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    bundles = this.merge_all_bundles(style,bundles);
    var all = [];
    all.push('');
    all.push('\\blank')
    bundles.forEach((bundle)=>{
      let ss = bundle.ss;
      let align = 'center';
      all.push(`\\startalignment[${align}]\\dontleavehmode`);
      ss = ss.map(s => {
        s = this.uncode(style,s);
        s = this.solidify(s);
        return(s);
      });
      all.push(ss.join("\\crlf\n"))
      all.push(`\\stopalignment`);
    })
    return all.join('\n');
  }
  float_to_linesright(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    bundles = this.merge_all_bundles(style,bundles);
    var all = [];
    all.push('');
    all.push('\\blank')
    bundles.forEach((bundle)=>{
      let ss = bundle.ss;
      let align = 'flushright';
      all.push(`\\startalignment[${align}]`);
      ss =  ss.map(s => {
        s = this.uncode(style,s);
        s = this.solidify(s);
        return(s);
      });
      all.push(`\\startlines`);
      ss.forEach(s => all.push(s));
      all.push(`\\stoplines`);
      all.push(`\\stopalignment`);
    })
    return all.join('\n');
  }
  float_to_example(title,label,style,subtitles,body,bodyrow){
    var ss = body.map((s) => this.uncode(style,s)).map(s=>`${this.icon_nabla}\\ \\ ${s}`);
    var text = ss.join('\\crlf\n');
    var all = [];
    all.push('');
    all.push(`\\startalignment[flushleft]`);
    all.push(`\\startlines`);
    all.push(`${text}`);
    all.push('\\stoplines');
    all.push(`\\stopalignment`);
    return all.join('\n');
  }
  float_to_description(title,label,style,subtitles,body,bodyrow){
    var ss = body.map((s) => {
      let [dt,dd] = s.split('\n').map(s=>s.trim());
      if(dd){
        return `\\sym {\\bold ${this.uncode(style,dt)}} \\crlf\n ${this.uncode(style,dd)}`;
      }else{
        return `\\sym {\\bold ${this.uncode(style,dt)}}`;
      }
      return; 
    });
    var text=ss.join('\n');
    var all = [];
    all.push('');
    all.push(`\\startitemize[packed][itemalign=flushleft,leftmargin=0pt]`);
    all.push(text);
    all.push(`\\stopitemize`);            
    return all.join('\n');
  }
  float_to_enumeration(title,label,style,subtitles,body,bodyrow){
    let ss = body.map((s)=>`\\sym {${this.get_next_enum(style)}.} ${this.uncode(style,s)}`);
    var text=ss.join('\n');
    var all = [];
    all.push('');
    all.push(`\\startitemize[packed][itemalign=flushleft,leftmargin=0pt,width=15pt,distance=5pt]`);
    all.push(text);
    all.push(`\\stopitemize`);            
    return all.join('\n');
  }
  float_to_tabbing(title,label,style,subtitles,body,bodyrow){
    var n = body.length;
    var ss = body.map((s,j) => {
      let dd = s.split('\n').map(x=>x.trim());
      return dd;
    });
    var m = ss.map(dd=>dd.length).reduce((acc,cur)=>Math.max(acc,cur),0);
    var all = [];
    var fmt = 'x'.repeat(n).split("").map(x=>`k0p(${1/n}\\textwidth)`).join('|');//there are extra spaces between columns
    all.push(`\\starttabulate[|${fmt}|]`);
    for(let j=0;j<m;++j){
      let ss1 = ss.map(dd=>dd[j]||'');
      let style1 = {...style};
      style1['n'] = j+1;
      style1['$'] = ss1;
      ss1 = ss1.map(x=>this.uncode(style1,x));
      let s1 = '\\NC ' + ss1.join(' \\NC ') + ' \\NC\\NR';
      all.push(s1);
    }
    all.push(`\\stoptabulate`);
    return all.join('\n');
  }
  float_to_itemize(title,label,style,subtitles,body,bodyrow){
    var bundles = this.body_to_all_bundles(style,body);
    var splitid = '';
    bundles = this.merge_all_bundles(style,bundles);
    var all = [];
    all.push('');
    bundles.forEach((bundle,j,arr) => {
      let plitems = this.ss_to_plitems(style,bundle.ss);
      let itemize = this.plitems_to_itemize(style,plitems);
      let text = this.itemize_to_text(style,itemize);
      all.push(text);
    });
    return all.join('\n');
  }
  float_to_vspace(title,label,style,subtitles,body,bodyrow){
    var all = [];
    var n = this.assert_int(style.vspace,1,0,this.MAX_INT);
    var text = 'x'.repeat(n).split("").map(x=>`~`).join('\\crlf');
    all.push('');
    all.push(text);
    return all.join('\n');
  }
  float_to_page(title,label,style,subtitles,body,bodyrow){
    return '';
  }
  float_to_hr(title,label,style,subtitles,body,bodyrow){
    return '';
  }
  float_to_vocabulary(title,label,style,subtitles,body,bodyrow){
    let ss = style.__parser.dict.map(p => {
      let {dt,dd} = p;
      dt = this.polish(style,dt);
      dd = this.polish(style,dd);
      if(dd.length){
        return `\\sym {\\bf ${dt}}\\crlf\n${dd}`
      }else{
        return `\\sym {\\bf ${dt}}`
      }
    })
    var text = ss.join('\n');
    var all = [];
    all.push('');
    all.push(`\\startitemize[packed][itemalign=flushright,leftmargin=0pt,width=15pt,distance=5pt]`);
    all.push(text);
    all.push(`\\stopitemize`);
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
    \setupparagraphs[sidebyside][1][width=.1\textwidth,style=bold]
    \setupparagraphs[sidebyside][2][width=.4\textwidth]
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
    unsafe = unsafe.replace(/\-/g,"-\\/");
    // unsafe = unsafe.replace(/\./g,mydot);
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
    safe = this.fontify_cjk(style,safe);
    return safe;
  }
  ///
  /// Replace all Unicode phrases and fontify CJK and others
  ///
  smooth (style,line) {
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
    safe = this.fontify_cjk(style,safe);
    safe = this.rubify_cjk(style,safe);
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
    var pcols = this.string_to_array(style.textalign);
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
  solidify(s){
    return this.replace_leading_blanks_with(s,'~');
  }
  thicken(s){
    return this.replace_blanks_with(s,'~');
  }
  ///
  ///
  ///
  restore_uri(str){
    var v;
    const re_charcode = /^\{\\char(\d+)\}\s*(.*)$/
    const re_char = /^(\w+)\s*(.*)$/;
    const re_S = /^(\S)\s*(.*)$/;
    str = str.trimStart();
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
    str = str.trimStart();
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
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_verb(style,cnt){
    let s = this.polish(style,cnt);
    s = `{\\tt{}${s}}`;
    //s = `\\quotation{${s}}`;
    return s;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_math(style,cnt){
    var used = new Set();
    var s = this.tokenizer.to_literal_math(cnt,style,used);
    return `\\math{${s}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_displaymath(style,cnt){
    var used = new Set();
    var s = this.tokenizer.to_literal_math(cnt,style,used);
    return `\\startformula{${s}}\\stopformula`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_strong(style,cnt){
    var ss = cnt.split('/');
    var ss = ss.map((s) => {return this.polish(style,s)});
    var ss = ss.map((s) => `{\\bf ${s}}`);
    return ss.join('/');    
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
  literal_to_index(style,cnt){
    cnt = this.smooth(style,cnt);
    return `\\index{${cnt}}${cnt}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  literal_to_quotation(style,cnt){
    cnt = this.uncode(style,cnt);
    return "\\quotation{"+cnt+"}";
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_em(style,cnt){
    cnt = this.uncode(style,cnt);
    return `\\index{${cnt}}{\\it ${cnt}}`
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
  phrase_to_tt(style,cnt){
    cnt = this.uncode(style,cnt);
    return `{\\tt ${cnt}}`
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
  phrase_to_br(style,cnt){
    return `{\\crlf}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_ref(style,cnt){
    return `\\in[${cnt}]`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_url(style,cnt){
    return `{\\tt \\hyphenatedurl{${cnt}}}`
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_link(style,cnt,anchor){
    if(anchor){
      return `${this.smooth(style,anchor)}({\\tt \\hyphenatedurl{${cnt}}})`
    }else{
      return `{\\tt \\hyphenatedurl{${cnt}}}`
    }
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
      var wd = ""+cnt+"em";
    }else{
      var wd = "1em";
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
  phrase_to_hrule(style,cnt){
      ///return `{\\hl[${wd}]}`;//the optional value express the number of 1em
    var i = cnt.indexOf(' ');
    if(i<0){
      if(cnt){          
        var wd = ""+cnt+"em";
      }else{
        var wd = "1em";
      }
      var s = '\\strut';
    }else{
      var wd = cnt.slice(0,i);
      var s = cnt.slice(i+1);
      if(wd){          
        wd = wd+"em";
      }else{
        wd = "1em";
      }
      s = s.trim();
      s = this.uncode(style,s);
      if(!s){
        s = '\\strut';
      }
    }
    //return `{\\hl[${wd}]}`;//the optional value express the number of 1em
    return `\\inframed[frame=off,bottomframe=on,width=${wd}]{${s}}`;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_img(style,cnt){
    var img = '';
    var g1 = this.string_to_style(cnt,{});
    var id = g1.id||'';
    if(style.__parser.buff.hasOwnProperty(id)){
      let {ss,g} = style.__parser.buff[id];
      g = {...g,...g1};
      var p = this.diagram.to_diagram(g,ss);
      img = p.img;
    }
    return img;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_wrapimgleft(style,cnt){
    var img = '';
    var g1 = this.string_to_style(cnt,{});
    var id = g1.id||'';
    if(style.__parser.buff.hasOwnProperty(id)){
      let {ss,g} = style.__parser.buff[id];
      g = {...g,...g1};
      var p = this.diagram.to_diagram(g,ss);
      img = p.img;
    }
    return(`\n\\placefigure[left,none][]{}{${img}}${caption}`);
  }
  //////////////////////////////////////////////////////////////////////////////////////
  //
  // translator function
  //
  //////////////////////////////////////////////////////////////////////////////////////
  phrase_to_wrapimgright(style,cnt){
    var img = '';
    var g1 = this.string_to_style(cnt,{});
    var id = g1.id||'';
    if(style.__parser.buff.hasOwnProperty(id)){
      let {ss,g} = style.__parser.buff[id];
      g = {...g,...g1};
      var p = this.diagram.to_diagram(g,ss);
      img = p.img;
    }
    return(`\n\\placefigure[right,none][]{}{${img}}${caption}`);
  }
  phrase_to_calc(style,cnt){
    return super.phrase_to_calc(style,cnt).replace(/\xa0/g,'~');
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
    all.push(`\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\setupinteraction[state=start]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\placebookmarks[part,chapter]`);
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
    all.push(`\\definefallbackfamily [dejavu] [serif] [Unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [dejavu] [sans]  [Unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [dejavu] [mono]  [Unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefallbackfamily [dejavu] [math]  [Unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefontfamily [dejavu] [serif] [dejavuserif]    [rscale=0.92]`);
    all.push(`\\definefontfamily [dejavu] [sans]  [dejavusans]     [rscale=0.92]`);
    all.push(`\\definefontfamily [dejavu] [mono]  [dejavusansmono] [rscale=0.90]`);
    all.push(`\\definefontfamily [dejavu] [math]  [dejavumath]     [rscale=0.92]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\definefontfamily [office] [serif] [Times New Roman]`);
    all.push(`\\definefontfamily [office] [sans]  [Arial] [rscale=0.9]`);
    all.push(`\\definefontfamily [office] [mono]  [Courier New]`);
    all.push(`\\definefontfamily [office] [math]  [TeX Gyre Termes Math]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    //all.push(`\\definefallbackfamily [linux] [serif] [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    //all.push(`\\definefallbackfamily [linux] [sans]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    //all.push(`\\definefallbackfamily [linux] [mono]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    //all.push(`\\definefallbackfamily [linux] [math]  [unifont] [range={miscellaneoussymbols,dingbats,cjkunifiedideographs,hiragana,katakana,cjksymbolsandpunctuation}]`);
    all.push(`\\definefontfamily [linux] [serif] [libertinusserif]`);
    all.push(`\\definefontfamily [linux] [sans]  [libertinussans]`);
    all.push(`\\definefontfamily [linux] [mono]  [libertinusmono] [rscale=0.83]`);
    all.push(`\\definefontfamily [linux] [math]  [libertinusmath]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    for(let font of this.fonts){
      let {fid,context} = font;
      if(fid && context){
        all.push(`\\definefontfamily[${fid}][serif][${context}]`);
        all.push(`\\definefontfamily[${fid}][sans][${context}]`);
        all.push(`\\definefontfamily[${fid}][mono][${context}]`);
        all.push(`\\definefontfamily[${fid}][math][${context}]`);
      }
    }
    //all.push(`\\setupbodyfont[${this.bodyfontsuit},${this.bodyfontvariant},${this.bodyfontsize}pt]`);
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
  to_preamble_essentials(){
    var all = [];
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\setscript[hanzi] % hyphenation`);
    all.push(`\\setupinteraction[state=start,color=,contrastcolor=]`);
    all.push(`\\placebookmarks[part,chapter]`);
    all.push(`\\setuphead[part][number=no]`);
    all.push(`\\setuphead[chapter][style=${this.contex_style_chapter},number=no]`);
    all.push(`\\setuphead[section][style=${this.contex_style_section},number=no]`);
    all.push(`\\setuphead[subsection][style=${this.contex_style_subsection},number=no]`);
    all.push(`\\setuphead[subsubsection][style=${this.contex_style_subsubsection},number=no]`);
    all.push(`\\setuphead[subsubsubsection][style=${this.contex_style_subsubsubsection},number=no]`);
    all.push(`\\definefloat[listing][listings]`);
    all.push(`\\definedescription[latexdesc][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=fit, before=, after=]`);
    all.push(`\\definedescription[DLpacked][`);
    all.push(`  headstyle=bold, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad, margin=20pt, before=, after=,]`);
    all.push(`\\definedescription[HLpacked][`);
    all.push(`  headstyle=normal, style=normal, align=flushleft, margin=1em,`);
    all.push(`  alternative=hanging, width=broad, before=, after=,]`);
    all.push(`\\definedescription[DL][`);
    all.push(`  headstyle=bold, style=normal, align=flushleft,`);
    all.push(`  alternative=hanging, width=broad, margin=20pt]`);
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
    all.push(`\\setupcaptions[minwidth=\\textwidth, align=${align}, style=${style}, location=top, number=no]`);
    all.push(`\\setupcombination[distance=0.33em,style=${style}]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    return all.join('\n')
  }
  to_preamble_misc(){
    var all = [];
    all.push(`\\setupinteraction[state=start]`);
    all.push(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
    all.push(`\\placebookmarks[part,chapter]`);
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
  to_preamble_definecolors(){
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
  to_hl_bullet_text(bullet){
    if(bullet=='>'){
      //return '{$\\triangleright$}';
      return String.fromCodePoint(0x25B8);
    }
    return '';
  }
  to_context_starttable_pcol(ww){
    var ss = ww.map((p) => {
      let pw = p.pw;
      let ta = p.ta;
      if(Number.isFinite(pw)){
        pw = pw-3;
        if(pw<0){
          pw = 0;
        }
        pw = `(${pw}mm)`;
      }else{
        pw = '';
      }
      if(ta=='c'){
        ta = `c`;//remove 1mm from the actual width for \starttable
      }else if(ta=='r'){
        ta = `r`;
      }else if(ta=='l'){
        ta = `l`;
      }else{
        return `p`;
      }
      return `${ta}${pw}`;
    });
    var text = ss.join('|');
    var text = `s2|${text}|`;
    return text;
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
    all.push('\\blank');
    return all.join('\n');
  }
  ///////////////////////////////////////////////////////////////////////
  ///
  /// const bull1 = `\\symbol[martinvogel 2][PointingHand]`;
  ///
  ///////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  cave_to_text(style,cave){
    let ss = cave.map((p,i,arr) => {
      return  this.uncode(style,p.text);
    });
    var text = ss.join('\n');
    var all = [];
    all.push('');
    all.push('\\startalignment[center]');
    all.push('\\startlines');
    all.push(text);
    all.push('\\stoplines');
    all.push('\\stopalignment')
    return all.join('\n');
  }    
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
  lave_to_text(style,lave){
    let ss = lave.map((p,i,arr) => {
      return  this.uncode(style,p.text);
    });
    var text = ss.join('\\crlf\n');
    var all = [];
    all.push('');
    all.push('\\blank');
    all.push('\\startitemize[leftmargin=20pt,width=0pt,distance=0pt,itemalign=flushleft]');
    all.push(`\\sym {} ${text}`);
    all.push('\\stopitemize');
    all.push('\\blank');
    return all.join('\n');
  }    
  ////////////////////////////////////////////////////////////////////////////////
  //
  //
  ////////////////////////////////////////////////////////////////////////////////
 
  ///////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////
  ///
  ///
  ///////////////////////////////////////////////////////////////////////
  sand_to_text(style,sand){
    let ss = sand.map((p,j) => {
      let x = p.text;
      x = x.trimEnd();
      if (!x) {
        x = "~";
      }else{
        x = this.polish_verb(style,x);
      }
      return x;
    });
    var opts = [];
    let hew = this.g_to_hew_int(style);
    let n = ss.length;
    var fontsize_css = '';
    if(hew>1){
      let nn = this.to_split_hew(n,hew);
      let all = [];
      all.push('');
      all.push('\\blank');//need a blank, otherwise there are no vertical spaces in front of it---dont know why
      all.push(`\\defineparagraphs[sidebyside][n=${hew}]`);
      all.push(`\\startsidebyside`);
      nn.forEach((nl,j) => {
        if(j==0){
        }else{
          all.push(`\\sidebyside`);
        }
        let [n1,n2] = nl;
        let ss1 = ss.slice(n1,n2);
        all.push(`\\startalignment[flushleft]${fontsize_css}`);
        all.push(`\\startlines[${opts.join(',')}]`);
        ss1.forEach((s) => {
          all.push(`{${s}}`);
        });
        all.push(`\\stoplines`);
        all.push(`\\stopalignment`);
      });
      all.push(`\\stopsidebyside`);
      return all.join('\n')
    }else{
      let all = [];
      all.push('');
      all.push('\\blank');//need a blank, otherwise there are no vertical spaces in front of it---dont know why
      all.push(`\\startalignment[right]${fontsize_css}`);
      all.push(`\\startlines[${opts.join(',')}]`);
      ss.forEach((s) => {
        all.push(`{${s}}`);
      });
      all.push(`\\stoplines`);
      all.push(`\\stopalignment`);
      return all.join('\n')
    }
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

 
  /////////////////////////////////////////////////////////////////////////////
  ///
  ///
  /////////////////////////////////////////////////////////////////////////////
  to_subcaptioned_tabular(img,style,subcaptions){
    var onerow = [];
    subcaptions.forEach((p) => {
      if(p[0]){
        var subtitle=(`(${p[0]}) ${p[1]}`);
      }else{
        var subtitle=(`${p[1]}`);
      }
      onerow.push(this.uncode(style,subtitle));
    })
    return `\\hbox{\\startcombination[1*1] ${img} {${onerow.join(' \\crlf ')}} \\stopcombination}`;
  }
  to_column_img(img,subtitle){
    if(subtitle){
      return `\\startcombination[1*1] {${img}} {${subtitle}} \\stopcombination`;
    }else{
      return img;
    }
  }
  to_part_page(title,style){
    return '';
  }
  tab_to_hsides(all){
    var s0 = all.slice(0,1);
    var sn = all.slice(1,-1);
    var sN = all.slice(-1);
    return [...s0,'\\HL',...sn,'\\HL',...sN];
  }
  tab_to_frame(all){
    all = all.map((s,j,arr) => {
      if(s.startsWith('\\starttable')){
        return s;
      }else if(s.startsWith('\\stoptable')){
        return s;
      }else if(s.startsWith('\\HL')){
        return s;
      }else{
        if(s.startsWith('\\NC') && s.endsWith('\\NC\\FR')){ 
          s = s.slice(3,-6);
          s = `\\VL${s}\\VL\\FR`
          return s;
        }else{
          return s;
        }
      }
    })
    var s0 = all.slice(0,1);
    var sn = all.slice(1,-1);
    var sN = all.slice(-1);
    return [...s0,'\\HL',...sn,'\\HL',...sN];
  }
  ss_to_ink(style,ss){
    var npara = ss.length;
    // var vgap = 1;//1mm
    var [viewport_width,viewport_height,viewport_unit,viewport_grid] = this.g_to_viewport_array(style);
    var inkwidth = viewport_width*viewport_unit;
    var inkheight = viewport_height*viewport_unit;
    var s_ad = String.fromCodePoint(0xAD);
    var all = [];
    all.push(`\\startMPcode`);
    all.push(`numeric u; u := 1mm;`);
    all.push(`numeric inkwidth; inkwidth := ${inkwidth}mm;`);
    all.push(`numeric inkheight; inkheight := ${inkheight}mm;`)
    all.push(`draw unitsquare sized(inkwidth,inkheight) withcolor white ;`);
    ss.forEach((s,j,arr) => {
      if(s==s_ad){
        s = "~";
      }else if(s=='\\\\'){
        s = String.fromCodePoint(0x00B6);
      }else{
        s = this.polish_verb(style,s);
      }
      let extra_dy_mm = 1.0;
      let x = 0;
      let y = inkheight - ((j+1)*10)*this.PT_TO_MM + extra_dy_mm;
      all.push(`pair a ; a := (${this.fix(x)}*u,${this.fix(y)}*u) ;`);
      all.push(`label.rt("\\tt\\switchtobodyfont[10pt]${s}",a) ;`);
    });
    all.push(`clip currentpicture to unitsquare xscaled (inkwidth) yscaled (inkheight);`);
    let width = style.width;
    let height = style.height;
    // all.push(`currentpicture := currentpicture xsized (\\the\\textwidth) ;`)
    let stretch = this.assert_float(style.stretch,0,0,1);
    if (stretch > 0) {
      all.push(`currentpicture := currentpicture xsized (${stretch}*TextWidth) ;`) //'TextWidth' is a keyword in MF
    } else if (width && height){
      all.push(`currentpicture := currentpicture xsized (${width}mm) ysized (${height}mm) ;`)
    } else if (width) {
      all.push(`currentpicture := currentpicture xsized (${width}mm) ;`)
    } else if (height) {
      all.push(`currentpicture := currentpicture ysized (${height}mm) ;`)
    }
    all.push(`\\stopMPcode`);
    var img = all.join('\n');
    if(style.frame){
      img = `\\framed[frame=on,location=bottom,strut=no]{${img}}`;
    }else{
      img = `\\framed[frame=off,location=bottom,strut=no]{${img}}`;
    }
    var tab = '';
    var subtitle = style.subtitle||'';
    return({img,subtitle,style});
  }
}
module.exports = { NitrilePreviewContex };
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
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
    var translator = new NitrilePreviewContex(parser);
    await parser.read_file_async(mdfname)
    var all = [];
    var title = parser.title;
    var style = parser.style;
    var label = parser.label;
    //all.push(`\\startchapter[title={${translator.uncode(style,title)}},reference={${label}},bookmark={${title}}]`);
    parser.blocks.forEach((block) => {
      let latex = translator.translate_block(block);
      all.push('');
      all.push(latex);
    })
    var document = all.join('\n');
    await translator.write_text_file(fs,texfname,document);
    console.log(`written to ${texfname}`);
  }
}
if(require.main===module){
  run();
}

