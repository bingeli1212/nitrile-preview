
  translateHtml (all,config,ispreview=false,editorrow=-1,editorcolumn=-1) {

    var dispatch = {
      'PART': this.do_part,
      'HDGS': this.do_hdgs,
      'DLST': this.do_dlst,
      'PLST': this.do_plst,
      'VERB': this.do_verb,
      'ITEM': this.do_item,
      'LIST': this.do_list,
      'SAMP': this.do_samp,
      'HRLE': this.do_hrle,
      'PRIM': this.do_prim,
      'SECO': this.do_seco,
      'TEXT': this.do_text,
      'INCL': this.do_incl,
      'QUOT': this.do_quot,
      'TBLR': this.do_tblr,
      'LONG': this.do_long,
      'IMGS': this.do_imgs,
      'TABB': this.do_tabb,
      'DIAG': this.do_diag,
      'MATH': this.do_math,
      'FRMD': this.do_frmd,
      'VERS': this.do_vers
    };

    ///
    /// Translate to HTML, returning an array of
    /// lines.
    ///
    /// sub: is an object
    ///

    var o = [];
    var heading = '';
    this.blockcount = 1;
    this.block = [];
    this.blocks = all;
    this.config = config;
    this.haschapter = config.ALL.haschapter;
    for (var block of all) {
      var {id,row1,row2,sig,data,para,fencecmd,base,subrow,fname} = block;
      this.blockcount++;///will be cleared by a HDGS
      this.block = block;
      this.base = base;
      var fencecmd = this.updateFencecmd(fencecmd,sig,config);
      var caption = fencecmd.caption?fencecmd.caption:'';
      const star = fencecmd.star;
      this.fs = fencecmd.fs;
      this.xcssfontsize = this.toCssFontsize(this.fs);
      this.xleft = this.to_stepmargin(config.ALL.stepmargin);
      this.xnumbers = this.to_numbers(fencecmd.numbers);
      this.xnumbersep = this.to_numbersep(fencecmd.numbersep);
      this.xnormalfontsize = this.to_normalfontsize(config.HTML.normalfontsize);
      this.xparatype = this.to_paratype(fencecmd.paratype);
      this.xindent = this.to_indent(fencecmd.indent);
      this.sig = sig;
      this.saveas = fencecmd.saveas;
      this.refid = fencecmd.refid;
      const label_text = (fencecmd.label) ? `${base}-${fencecmd.label}` : '';
      const caption_text = this.unmask(caption);
      this.label_text = label_text;
      this.caption_text = caption_text;
      this.xname = fencecmd.name||'';
      this.xidnum = block.idnum||'';
      /// turn off showing of blocks if outlineviewing is on
      if (ispreview && typeof subrow==='number') {
        if (sig === 'PART') {
        } else if (sig === 'HDGS') {
        } else if (sig === 'ERRO') {
        } else if (editorcolumn==0 && editorrow==subrow) {
        } else {
          ///do not show this block
          continue;
        }
      }
      if (dispatch[sig]) {
        var func = dispatch[sig];
        func.call(this,block);
      }
    }
  }
  translateLatex (all,config) {

    var dispatch = {
      'PART': this.do_part,
      'HDGS': this.do_hdgs,
      'DLST': this.do_dlst,
      'PLST': this.do_plst,
      'VERB': this.do_verb,
      'ITEM': this.do_item,
      'LIST': this.do_list,
      'SAMP': this.do_samp,
      'HRLE': this.do_hrle,
      'PRIM': this.do_prim,
      'SECO': this.do_seco,
      'TEXT': this.do_text,
      'INCL': this.do_incl,
      'QUOT': this.do_quot,
      'TBLR': this.do_tblr,
      'LONG': this.do_long,
      'IMGS': this.do_imgs,
      'TABB': this.do_tabb,
      'DIAG': this.do_diag,
      'MATH': this.do_math,
      'FRMD': this.do_frmd,
      'VERS': this.do_vers
    };

    /// the 'blocks' argument is an array of blocks; the 'haschapter'
    /// is a Boolean type set to true only when generating an 'report'
    /// document type, such that HDGS/0 will be treated as the title
    /// of the document and not a chapter.

    var o = [];
    this.block = [];
    this.config = config;
    this.haschapter = config.ALL.haschapter;
    for (var block of all) {
      var {id,row1,row2,sig,data,para,fencecmd,base,subrow,fname} = block;
      this.block = block;
      this.base = base;
      this.row1 = row1;
      this.row2 = row2;
      this.fname = fname;
      var fencecmd = this.updateFencecmd(fencecmd,sig,config);
      const star = fencecmd.star;
      const label_text = fencecmd.baselabel;
      const label_cmd = (label_text && !star)?`\\label{${label_text}}`:'';
      const caption_text = (fencecmd.caption)?this.unmask(fencecmd.caption):'';
      this.fs = fencecmd.fs;
      this.xlatexfontsize = this.toLatexFontsize(this.fs);
      this.xleft = this.to_stepmargin(config.ALL.stepmargin);
      this.xnumbers = this.to_numbers(fencecmd.numbers);
      this.xnumbersep = this.to_numbersep(fencecmd.numbersep);
      this.xparatype = this.to_paratype(fencecmd.paratype);
      this.xindent = this.to_indent(fencecmd.indent);
      this.sig = sig;
      this.label_text = label_text;
      this.label_cmd = label_cmd;
      this.caption_text = caption_text;
      if (dispatch[sig]) {
        var func = dispatch[sig];
        func.call(this,block);
      }
    }
  }

  // The old do_dlst for CONTEX, where the setupnarrower is used
  // to create indentation for text description. The latest 
  // implementation has been changed to use \latexdesc 
  // instead.
  _do_dlst(block){
    var {id,row1,row2,sig,data,para,fencecmd,base,subrow,fname} = block;
    var o = [];
    o.push(`%DLST`);
    o.push(`\\blank`);
    for (var item of data) {
      var [keys,text] = item;
      keys = keys.map( x => this.escape(x) );
      text = this.unmask(text);
      keys = keys.map( x => `\\bf{}${x}` );
      keys = keys.map( x => `\\noindent{${x}}` );
      o.push(keys.join('\\\\'));
      o.push(`\\setupnarrower[left=${fencecmd.left}mm]`);
      o.push(`\\startnarrower[left]`);
      if(text){
        o.push(`\\noindent ${text}`);
      }
      o.push(`\\stopnarrower`);
    }
    o.push('');
    block.latex = o.join('\n');
    this.needblank = 1;
  }

  parse_pict(para){

    /// @ tree.png (a)
    ///   fish.png (b)
    ///   frog.png (c)
    ///   ---
    ///   [width:.5]
    ///   tree.png (d)
    ///   
    /// or:
    ///
    /// @ ${#fig:a} Trees and fish 
    ///   and frog.
    ///   ---
    ///   tree.png (a)
    ///   fish.png (b)
    ///   frog.png (c)
    ///   ---
    ///   [width:.5]
    ///   tree.png (d)
    ///   
    ///

    /// form is ''
    var mode = {};
    var images = [];
    var lines = para.map(x=>x);
    var s = lines[0];
    var v = this.re_pict.exec(s);
    if(v){
      lines[0] = v[2];
    }
    lines = lines.map(x => x.trim());
    var re_caption = /^\$\{#([\w\:]+)\}\s*(.*)$/;
    var re_sep = /^[\-]{3,}$/;
    var re_image = /^(\S+)\s*(.*)$/;
    var re_mode = /^\[(.*)\]$/;
    var data = [];
    var images = [];
    var mode = {};
    var caption = '';
    var label = '';
    for(var i=0; i < lines.length; ++i){
      var line = lines[i];
      if(i==0){
        if((v=re_caption.exec(line))!==null){
          label = v[1];
          caption = v[2];
          continue;
        } else {
          break;
        }
      }
      if((v=re_sep.exec(line))!==null){
        i++;
        break;
      }
      caption = this.joinLine(caption,line);
    }
    ///slice off caption lines
    lines = lines.slice(i);
    ///now process the rest of the data
    for(var i=0; i < lines.length; ++i){
      var line = lines[i];
      if((v=re_sep.exec(line))!==null){
        if(images.length){
          data.push({mode,images});
          images = [];
          mode = {};
        }
        continue;
      }
      if((v=re_mode.exec(line))!==null){
        mode = this.toStyle(v[1]);
        continue;
      }
      if((v=re_image.exec(line))!==null){
        var src = v[1];
        var sub = v[2];
        images.push({src,sub});
        continue;
      }
    }
    if(1){
      if(images.length){
        data.push({mode,images});
        images = [];
        mode = {};
      }
    }
    return {caption,label,data};
  }

  parse_tabr(para){

    /// & ${#tab:a} This is a table.
    ///   ---
    ///   あ a | か ka
    ///   い i | き ki
    ///   う u | く ku
    ///   え e | け ke
    ///   お o | こ ko
    ///

    /// & ${#tab:a} This is a table.
    ///   ---
    ///   あ a   
    ///   い i   
    ///   う u   
    ///   え e   
    ///   お o   
    ///   ---
    ///   か ka
    ///   き ki
    ///   く ku
    ///   け ke
    ///   こ ko
    ///


    /// form is ''
    var lines = para.map(x=>x);
    var s = lines[0];
    var v = this.re_tabr.exec(s);
    if(v){
      lines[0] = v[2];
    }
    lines = lines.map(x => x.trim());
    var re_caption = /^\$\{#([\w\:]+)\}\s*(.*)$/;
    var re_sep = /^[\-]{3,}$/;
    var re_image = /^(\S+)\s*(.*)$/;
    var re_mode = /^\[(.*)\]$/;
    var caption = '';
    var label = '';
    for(var i=0; i < lines.length; ++i){
      var line = lines[i];
      if(i==0){
        if((v=re_caption.exec(line))!==null){
          label = v[1];
          caption = v[2];
          continue;
        } else {
          break;
        }
      }
      if((v=re_sep.exec(line))!==null){
        i++;
        break;
      }
      caption = this.joinLine(caption,line);
    }

    ///remove the caption lines
    lines = lines.slice(i);
    var data = [];

    ///  |Bits   |Description
    /// -|-------|--------------------------------------
    /// 0|0b000  |grayscale
    /// 2|0b010  |red, green and blue: rgb/truecolor
    /// 3|0b011  |indexed: channel containing   
    ///  |       |indices into a palette of colors
    /// 4|0b100  |grayscale and alpha: level of   
    ///  |       |opacity for each pixel
    /// 6|0b110  |red, green, blue and alpha

    if(lines.length && lines[0].indexOf('|') >= 0){
      var lines = lines.map(row => this.splitLineVbars(row));
      var re_bars = /^-+$/;
      lines = lines.filter(x => !re_bars.test(x[0]));
      var ncols = lines.reduce((acc,x) => Math.max(acc,x.length),0);
      for (var j=0; j < ncols; j++){
        var items = lines.map(x => x[j]||'');
        data.push(items);
      }
      return {data,caption,label};
    }

    ///   あ a   
    ///   い i   
    ///   う u   
    ///   え e   
    ///   お o   
    ///   ---
    ///   か ka
    ///   き ki
    ///   く ku
    ///   け ke
    ///   こ ko
    ///

    var items = [];
    for(var i=0; i < lines.length; ++i){
      var line = lines[i];
      if((v=re_sep.exec(line))!==null){
        if(items.length){
          data.push(items);
          items = [];
        }
        continue;
      }
      items.push(line);
    }
    if(1){
      if(items.length){
        data.push(items);
        items = [];
      }
    }
    return {data,caption,label};
  }

  do_tabb(){

 508           var [text,maxj,ww] = data;
 509           if (fencecmd.adjust) {
 510             ww = this.toAdjustedColumns(maxj,fencecmd.adjust);
 511           }
 512           ww = this.wwToOne(ww);
 513           text = text.map ( row => {
 514             row = row.map(x => x.split('\n'));
 515             row = row.map(x => x.map(y => this.unmask(y)));
 516             return row;
 517           });
 518           o.push(`\\begin{tabbing}`);
 519           var tt = ww.map(x => `\\hspace{${x}\\linewidth}`);
 520           tt = tt.join('\\=');
 521           tt += '\\kill';
 522           o.push(tt);
 523           for (var row of text) {
 524             var nn = row.map(x => x.length);
 525             var maxn = nn.reduce((acc,cur) => Math.max(acc,cur));
 526             for (var i=0; i < maxn; ++i) {
 527               var qq = row.map(x => x[i]);
 528               o.push(`${qq.join(' \\> ')}\\\\`);
 529             }
 530           }
 531           if (text.length == 0) {
 532             o.push(`(empty)`);
 533           } else {
 534             var s = o.pop(); ///remove the last \\\\
 535             s = s.slice(0,s.length-2);
 536             o.push(s);
 537           }
 538           o.push(`\\end{tabbing}`);
 539           o.push('');
 540           break;

  }

  _do_tabb(block){
    var o = [];
    var {id,row1,row2,sig,cols,subfname} = block;
    o.push(this.to_info(block));
    var ncols = cols.length;
    var nrows = 0;
    cols.forEach(x => {
      var n = x.length;
      nrows = Math.max(n, nrows);
    });
    var s = [];
    for (var j = 0; j < nrows; ++j) {
      var pp = cols.map(x => x[j] || '');
      pp = pp.map(x => this.unmask(x));
      pp = pp.map(x => this.polish(x,this.config.LATEX.fstabular));
      var p = pp.join(' & ');
      p = `${p} \\\\`;
      s.push(p);
    }
    var text = s.join('\n');
    var pcol = 'l'.repeat(ncols);
    //o.push(`\\medskip`);
    o.push(`\\begin{xltabular}{\\linewidth}{@{}${pcol}}`);
    o.push(text);
    o.push(`\\end{xltabular}`);
    //o.push(`\\medskip`);
    o.push('');
    block.latex = o.join('\n');
    this.needblank = 1;
  }

  to_required_packages_pdflatex () {
    var p_layout = '';
    if (this.conf('latex.geometry')) {
      var s = this.conf('latex.geometry');
      var s = s.split('\t').join(',');
      var p_layout = `\\usepackage[${s}]{geometry}`;
    }
    return `
\\usepackage[utf8x]{inputenc}
\\usepackage[T1]{fontenc}
${p_layout}
\\usepackage{graphicx}
\\usepackage{caption}
\\usepackage{enumitem}
\\usepackage{mathtools}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{commath}
\\usepackage{xfrac}
\\usepackage{stmaryrd}
\\usepackage{wasysym}
\\usepackage{textcomp}
\\usepackage{pifont}
\\usepackage{marvosym}
\\usepackage{MnSymbol}
\\DeclareMathOperator{\\sech}{sech}
\\DeclareMathOperator{\\csch}{csch}
\\DeclareMathOperator{\\arcsec}{arcsec}
\\DeclareMathOperator{\\arccot}{arccot}
\\DeclareMathOperator{\\arccsc}{arccsc}
\\DeclareMathOperator{\\arcosh}{arcosh}
\\DeclareMathOperator{\\arsinh}{arsinh}
\\DeclareMathOperator{\\artanh}{artanh}
\\DeclareMathOperator{\\arsech}{arsech}
\\DeclareMathOperator{\\arcsch}{arcsch}
\\DeclareMathOperator{\\arcoth}{arcoth}
\\DeclareMathSymbol{\\Alpha}{\\mathalpha}{operators}{"41}
\\DeclareMathSymbol{\\Beta}{\\mathalpha}{operators}{"42}
\\DeclareMathSymbol{\\Epsilon}{\\mathalpha}{operators}{"45}
\\DeclareMathSymbol{\\Zeta}{\\mathalpha}{operators}{"5A}
\\DeclareMathSymbol{\\Eta}{\\mathalpha}{operators}{"48}
\\DeclareMathSymbol{\\Iota}{\\mathalpha}{operators}{"49}
\\DeclareMathSymbol{\\Kappa}{\\mathalpha}{operators}{"4B}
\\DeclareMathSymbol{\\Mu}{\\mathalpha}{operators}{"4D}
\\DeclareMathSymbol{\\Nu}{\\mathalpha}{operators}{"4E}
\\DeclareMathSymbol{\\Omicron}{\\mathalpha}{operators}{"4F}
\\DeclareMathSymbol{\\Rho}{\\mathalpha}{operators}{"50}
\\DeclareMathSymbol{\\Tau}{\\mathalpha}{operators}{"54}
\\DeclareMathSymbol{\\Chi}{\\mathalpha}{operators}{"58}
\\DeclareMathSymbol{\\omicron}{\\mathord}{letters}{"6F}
\\usepackage{changepage}
\\usepackage{listings}
\\usepackage{anyfontsize}
\\usepackage[normalem]{ulem}
\\usepackage{xltabular}
\\usepackage{xtab}
\\usepackage{xcolor}
\\usepackage[export]{adjustbox}
\\usepackage{url}
`
  }

  to_required_packages_lualatex () {
    ///work on layout
    var p_layout='';
    if(this.conf('latex.geometry')){
      var s=this.conf('latex.geometry');
      var s= s.split('\t').join(',');
      var p_layout=`\\usepackage[${s}]{geometry}`;
    }

    ///build the fontspecmap
    var fontfamilymap = new Map();
    ss.forEach(s => {
      let [ccode,fnt] = s.split(',').map(x => x.trim());
      fontfamilymap.set(ccode,fnt);
    });

    ///work on fontspec
    /*
        %\\newfontfamily\\de{dejavusans}
        %\\newfontfamily\\za{zapfdingbats}
        %\\newfontfamily\\cn{arplsungtilgb}
        %\\newfontfamily\\tw{arplmingti2lbig5}
        %\\newfontfamily\\jp{ipaexmincho}
        %\\newfontfamily\\kr{baekmukbatang}
    */
    var p_fontfamily='';
    if(this.conf('lualatex.fontfamily')){
      var ss = this.conf('lualatex.fontfamily').split('\t');
      p_fontfamily = ss.map(x => {
        if(fontfamilymap.has(x)){
          let fnt = fontspecmap.get(x);
          return `\\newfontfamily\\${x}{${fnt}}`;
        }
        return '';
      }).filter(x => x.length?true:false).join('\n');
    }
    return `
\\usepackage{fontspec}
\\usepackage{ruby}
${p_fontfamily}
${p_layout}
\\usepackage{graphicx}
\\usepackage{caption}
\\usepackage{enumitem}
\\usepackage{mathtools}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{commath}
\\usepackage{xfrac}
\\usepackage{stmaryrd}
\\usepackage{wasysym}
\\usepackage{textcomp}
\\usepackage{pifont}
\\usepackage{marvosym}
\\usepackage{MnSymbol}
\\usepackage{unicode-math}
\\DeclareMathOperator{\\sech}{sech}
\\DeclareMathOperator{\\csch}{csch}
\\DeclareMathOperator{\\arcsec}{arcsec}
\\DeclareMathOperator{\\arccot}{arccot}
\\DeclareMathOperator{\\arccsc}{arccsc}
\\DeclareMathOperator{\\arcosh}{arcosh}
\\DeclareMathOperator{\\arsinh}{arsinh}
\\DeclareMathOperator{\\artanh}{artanh}
\\DeclareMathOperator{\\arsech}{arsech}
\\DeclareMathOperator{\\arcsch}{arcsch}
\\DeclareMathOperator{\\arcoth}{arcoth}
\\DeclareMathSymbol{\\Alpha}{\\mathalpha}{operators}{"41}
\\DeclareMathSymbol{\\Beta}{\\mathalpha}{operators}{"42}
\\DeclareMathSymbol{\\Epsilon}{\\mathalpha}{operators}{"45}
\\DeclareMathSymbol{\\Zeta}{\\mathalpha}{operators}{"5A}
\\DeclareMathSymbol{\\Eta}{\\mathalpha}{operators}{"48}
\\DeclareMathSymbol{\\Iota}{\\mathalpha}{operators}{"49}
\\DeclareMathSymbol{\\Kappa}{\\mathalpha}{operators}{"4B}
\\DeclareMathSymbol{\\Mu}{\\mathalpha}{operators}{"4D}
\\DeclareMathSymbol{\\Nu}{\\mathalpha}{operators}{"4E}
\\DeclareMathSymbol{\\Omicron}{\\mathalpha}{operators}{"4F}
\\DeclareMathSymbol{\\Rho}{\\mathalpha}{operators}{"50}
\\DeclareMathSymbol{\\Tau}{\\mathalpha}{operators}{"54}
\\DeclareMathSymbol{\\Chi}{\\mathalpha}{operators}{"58}
\\DeclareMathSymbol{\\omicron}{\\mathord}{letters}{"6F}
\\usepackage{changepage}
\\usepackage{listings}
\\usepackage{anyfontsize}
\\usepackage{luamplib}
\\usepackage[normalem]{ulem}
\\usepackage{xltabular}
\\usepackage{xtab}
\\usepackage{xcolor}
\\usepackage[export]{adjustbox}
\\usepackage{url}
`
  }

  to_required_packages_xelatex () {
    ///work on fontspec
    var p_layout='';
    if(this.conf('latex.geometry')){
      var s=this.conf('latex.geometry');
      var s= s.split('\t').join(',');
      var p_layout=`\\usepackage[${s}]{geometry}`;
    }
    ///work on fontspec
    var p_fontspec='';
    var my_fontspec_map = new Map();
    if(this.conf('xelatex.fontspec')){
      var ss=this.conf('xelatex.fontspec').split('\t');
      ss.forEach(s => {
        let [ccode,fnt] = s.split(',').map(x => x.trim());
        my_fontspec_map.set(ccode,fnt);
      });
    }
    var p_layout= fontnames.map(x => {
      if(my_fontspec_map.has(x)){
        let ccode = x;
        let fnt = my_fontspec_map.get(x);
        return `\\newcommand{\\${ccode}}[1]{{\\fontspec{${fnt}}#1}}`;
      }
    }).join('\n');
    ///work on line break locale
    var p_linebreaklocale='';
    if(this.conf('xelatex.linebreaklocale')){
      let w= this.conf('xelatex.linebreaklocale');
      p_linebreaklocale=`\\XeTeXlinebreaklocale "${w}"`;
    }
    return `
\\usepackage{ucs}
\\usepackage[utf8x]{inputenc}
\\usepackage{fontspec}
${p_fontspec}
${p_layout}
${p_linebreaklocale}
\\usepackage{graphicx}
\\usepackage{caption}
\\usepackage{enumitem}
\\usepackage{mathtools}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{commath}
\\usepackage{xfrac}
\\usepackage{stmaryrd}
\\usepackage{wasysym}
\\usepackage{textcomp}
\\usepackage{pifont}
\\usepackage{marvosym}
\\usepackage{MnSymbol}
\\usepackage{unicode-math}
\\DeclareMathOperator{\\sech}{sech}
\\DeclareMathOperator{\\csch}{csch}
\\DeclareMathOperator{\\arcsec}{arcsec}
\\DeclareMathOperator{\\arccot}{arccot}
\\DeclareMathOperator{\\arccsc}{arccsc}
\\DeclareMathOperator{\\arcosh}{arcosh}
\\DeclareMathOperator{\\arsinh}{arsinh}
\\DeclareMathOperator{\\artanh}{artanh}
\\DeclareMathOperator{\\arsech}{arsech}
\\DeclareMathOperator{\\arcsch}{arcsch}
\\DeclareMathOperator{\\arcoth}{arcoth}
\\DeclareMathSymbol{\\Alpha}{\\mathalpha}{operators}{"41}
\\DeclareMathSymbol{\\Beta}{\\mathalpha}{operators}{"42}
\\DeclareMathSymbol{\\Epsilon}{\\mathalpha}{operators}{"45}
\\DeclareMathSymbol{\\Zeta}{\\mathalpha}{operators}{"5A}
\\DeclareMathSymbol{\\Eta}{\\mathalpha}{operators}{"48}
\\DeclareMathSymbol{\\Iota}{\\mathalpha}{operators}{"49}
\\DeclareMathSymbol{\\Kappa}{\\mathalpha}{operators}{"4B}
\\DeclareMathSymbol{\\Mu}{\\mathalpha}{operators}{"4D}
\\DeclareMathSymbol{\\Nu}{\\mathalpha}{operators}{"4E}
\\DeclareMathSymbol{\\Omicron}{\\mathalpha}{operators}{"4F}
\\DeclareMathSymbol{\\Rho}{\\mathalpha}{operators}{"50}
\\DeclareMathSymbol{\\Tau}{\\mathalpha}{operators}{"54}
\\DeclareMathSymbol{\\Chi}{\\mathalpha}{operators}{"58}
\\DeclareMathSymbol{\\omicron}{\\mathord}{letters}{"6F}
\\usepackage{changepage}
\\usepackage{listings}
\\usepackage{anyfontsize}
\\usepackage[normalem]{ulem}
\\usepackage{xltabular}
\\usepackage{xtab}
\\usepackage{xcolor}
\\usepackage[export]{adjustbox}
\\usepackage{url}
`
  }

  parse_plst (para,isbroad) {
    ///
    /// Parse the paragraph that is PLST
    ///

    var items = [];
    //
    var num = 0;
    var levels = [];
    var lead = '';
    var bull = '';
    var bullet = '';
    var value = '';
    var action = '';
    var k = 0;
    var more = [];
    var v;
    const re_leadspaces = /^(\s*)(.*)$/;
    //
    //var re = /^(\s*)(\+|\-|\*|\d+\.)\s+(.*)$/;
    //
    var re = /^(\s*)/;
    for (var line of para) {
      if(line.length==0){
        k=0;  
        more.push('');
        continue;
      }
      if(isbroad && !k && re_indented.test(line) && !re_plst.test(line.trimLeft())){
        more.push(line);
        continue;
      }
      k++;
      v = re_leadspaces.exec(line);
      if (v) {
        lead = v[1];
        line = v[2];
      } else {
        lead = '';
      }
      v = re_plst.exec(line);
      if(isbroad && k>1){
        v = null;
      }
      if (v) {
        var bullet = v[1];
        var text = v[2];
        if (bullet == '-'){
          value = '';
          bull = 'UL';
        } else {
          bull = 'OL';
          num = parseInt(bullet);
          value = `${num}.`;
        }
        // check for indentation
        if (levels.length == 0) {
          action = 'push';
        } else {
          var lead0 = levels[levels.length-1][0];
          if (lead0.length < lead.length) {
            action = 'push';
          } else if (levels.length > 1 && lead0.length > lead.length) {
            action = 'pop';
          } else {
            action = 'item';
          }
        }
      } else {
        action = 'text';
      }

      /// For Japanese language input, the following three
      /// are used for three levels of nesting
      ///  ー \u30fc
      ///  ＋ \uff0b
      ///  ＊ \uff0a

      if (action === 'push') {
        levels.push([lead,bull]);
        more = [];
        items.push({bull,bullet,value,text,more});
      } else if (action === 'pop') {
        var [lead,bull] = levels.pop();
        bull = `/${bull}`;
        more = [];
        items.push({bull,bullet,value,text,more});
      } else if (action === 'item') {
        bull = 'LI';
        more = [];
        items.push({bull,bullet,value,text,more});
      } else {
        // 'text', concat the new text to the old of the last text
        if (items.length > 0) {
          var item = items.pop();
          var {text} = item;
          text = this.join_line(text,line);
          item.text = text;
          items.push(item);
        }
      }
    }
    //
    while (levels.length > 0) {
      [lead,bull] = levels.pop();
      bull = `/${bull}`;
      items.push({bull});
    }
    //
    return items;
  }

  do_data(block){
    ///has to use tabbing because this is the only way to
    ///work across the page and across two columns
    var o = [];
    var {id,row1,row2,sig,rows,islabeled,label,caption} = block;
    var rows = rows.map( pp => pp.map(x => this.polish(x) ));
    o.push('');
    o.push(this.to_info(block));
    o.push(this.rows_to_xltabular(rows,islabeled,label,caption));
    block.latex = o.join('\n');
  }
  to_data_xltabular(cols){
    ///has to use tabbing because this is the only way to
    ///work across the page and across two columns
    var d = [];
    var ncols = cols.length;
    var nrows = 0;
    cols.forEach(x => {
      var n = x.length;
      nrows = Math.max(n, nrows);
    });
    var pcol='l'.repeat(ncols).split('').join('');
    var w = this.to_conf_step();
    d.push(`\\begin{xltabular}[l]{\\linewidth}{@{\\hspace{${w}}}${pcol}@{}}`);
    for (var j = 0; j < nrows; ++j) {
      var pp = cols.map(x => x[j] || '');
      pp = pp.map(x => this.polish(x));
      pp = pp.join(' & ');
      pp = `${pp}\\\\`;
      d.push(pp);
    }
    if(nrows==0){
      d.push(`(empty)`);
    } 
    else {
      var pp = d.pop(); ///remove the last \\\\
      pp = pp.slice(0,pp.length-2);
      d.push(pp);
    }
    d.push(`\\end{xltabular}`);
    return d.join('\n');
  }
  to_data_tabbing(cols){
    ///has to use tabbing because this is the only way to
    ///work across the page and across two columns
    var d = [];
    var ncols = cols.length;
    var nrows = 0;
    var ww = [];
    var ss = [];
    cols.forEach(x => {
      var n = x.length;
      nrows = Math.max(n, nrows);
      var w = x.reduce((acc,s) => Math.max(acc,this.measure_text_length(s)),0);
      ww.push(w);
      var s = x.reduce((acc,s) => (acc.length>=s.length)?acc:s,'');
      ss.push(s);
    });
    ss = ss.map(x => this.polish(x));
    var d = [];
    for (var j = 0; j < nrows; ++j) {
      var pp = cols.map(x => x[j] || '');
      pp = pp.map(x => this.polish(x));
      pp = pp.join('\\>');
      pp = `${pp}\\\\`;
      d.push(pp);
    }
    if(d.length==0){
      d.push(`(empty)`);
    } 
    else {
      var pp = d.pop(); ///remove the last \\\\
      pp = pp.slice(0,pp.length-2);
      d.push(pp);
    }
    if(1){
      d.push(`\\begin{flushleft}`);
      d.push(`\\begin{adjustwidth}{${this.to_conf_step()}}{}`);
      d.push(`\\begin{tabbing}`);
      //d.push(`${ss.join('\\hspace{8pt}\\=')}\\kill`);
      d.push(`${ss.join('~\\=')}\\kill`);
      d.push(d.join('\n'));
      d.push(`\\end{tabbing}`);
      d.push(`\\end{adjustwidth}`);
      d.push(`\\end{flushleft}`);
      return d.join('\n');
    }
  }
  to_setup_script(){
    ///COPIED FROM FLOWERPOT
    return `\
    allnames=['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen'];
    allhexcs=['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32'];
    allrgbs = {};
    function setup(){
      for(let i=0; i < allnames.length; ++i){
        var name = allnames[i];
        var hexc = allhexcs[i];
        if(typeof hexc == 'string' && hexc.length==6){
          let r = '0x' + hexc.substr(0,2);
          let g = '0x' + hexc.substr(2,2);
          let b = '0x' + hexc.substr(4,2);
          r = parseInt(r);
          g = parseInt(g);
          b = parseInt(b);
          allrgbs[name]=[r,g,b];
        }
      }
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        var type = canvas.getAttribute('data-type');
        if(type=='ball'){
          ball_setup_canvas(canvas);
        }else if(type=='board'){
          board_setup_canvas(canvas);
        }
      }
      //draw_canvas();
    }
    function board_setup_canvas(canvas){
      //canvas.style.cursor = 'crosshair';
      var ctx = canvas.getContext("2d");
      ctx.d = {};
      canvas.addEventListener("mousedown",  board_onmousedown,  false);
      canvas.addEventListener("mousemove",  board_onmousemove,  false);
      canvas.addEventListener("mouseup",    board_onmouseup,    false);
      canvas.addEventListener("mouseenter", board_onmouseenter, false);
      canvas.addEventListener("mouseleave", board_onmouseleave, false);
      canvas.addEventListener("touchstart", board_ontouchstart, false);
      canvas.addEventListener("touchmove",  board_ontouchmove,  false);
      canvas.addEventListener("touchend",   board_ontouchend,   false);
      canvas.addEventListener("touchcancel",board_ontouchcancel,false);
      ctx.d.myrgbs = allrgbs;
      ctx.d.myop = 'pencil';
      ctx.d.mystroke = 1.0;
      ctx.d.mycolor = 'Black';
      ctx.d.mysmear = ctx.d.myrgbs['Black'];
      ctx.d.myobject = null;
      ctx.d.myobject_tentative = null;
      ctx.d.myfig = {x:0,y:0,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke:1.0,mycolor:'Black'};
      ctx.d.mybasis = {x:0,y:0,w:0,h:0,dx:0,dy:0,dw:0,dh:0,s:null,a:null};
      ctx.d.myundo = [];
      ctx.d.myredo = [];
      var frameid = canvas.getAttribute("data-frameid");
      var imgid = canvas.getAttribute("data-imgid");
      var img = document.getElementById(imgid);
      if(img){
        ctx.drawImage(img,0,0,441,320);
      }
      var s = ctx.getImageData(0,0, 441,320);
      ctx.d.myface = s;
      var mybasis = {...ctx.d.mybasis};
      var myfig = {...ctx.d.myfig};
      var myop = ctx.d.myop;
      var myarg = ctx.d.myarg;
      ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
      board_set_cursor(ctx,canvas);
    }
    function board_set_cursor(ctx,canvas){
      if(ctx.d.myop=='pencil' || 
         ctx.d.myop=='smudge' ||
         ctx.d.myop=='eraser' ){
        canvas.style.cursor = 'crosshair';
      }else{
        canvas.style.cursor = 'default';
      }
    }
    function board_draw_canvas(canvas){
    }
    function board_handle_keydown(shiftKey,altKey,keycode,ctx,canvas){
      if(ctx.d.myop=='object' && ctx.d.myobject){
        ///'object'
        let o = ctx.d.myobject;
        switch(keycode){
        case 'KeyK':
          ctx.save();
          ctx.setTransform(1,0,0,1,0,0);
          ctx.translate(0,-1);
          ctx.transform(...o.tr);
          o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
          ctx.restore();
          board_redraw(o,ctx,canvas);
          break;
        case 'KeyJ':
          ctx.save();
          ctx.setTransform(1,0,0,1,0,0);
          ctx.translate(0,+1);
          ctx.transform(...o.tr);
          o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
          ctx.restore();
          board_redraw(o,ctx,canvas);
          break;
        case 'KeyH':
          ctx.save();
          ctx.setTransform(1,0,0,1,0,0);
          ctx.translate(-1,0);
          ctx.transform(...o.tr);
          o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
          ctx.restore();
          board_redraw(o,ctx,canvas);
          break;
        case 'KeyL':
          ctx.save();
          ctx.setTransform(1,0,0,1,0,0);
          ctx.translate(+1,0);
          ctx.transform(...o.tr);
          o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
          ctx.restore();
          board_redraw(o,ctx,canvas);
          break;
        ///ROTATE
        case 'KeyE':
          var myrot = (shiftKey)?(+1):(-1);
          board_rotate_object(myrot,o,ctx,canvas);
          board_redraw(o,ctx,canvas);
          break;
        case 'KeyR':
          var myrot = (shiftKey)?(-1):(+1);
          board_rotate_object(myrot,o,ctx,canvas);
          board_redraw(o,ctx,canvas);
          break;
        ///HIT(s)
        case 'Digit1':
          o.hit1 = 1;
          o.hit2 = 0;
          o.hit3 = 0;
          o.hit4 = 0;
          board_redraw(o,ctx,canvas);
          break;
        case 'Digit2':
          o.hit1 = 0;
          o.hit2 = 1;
          o.hit3 = 0;
          o.hit4 = 0;
          board_redraw(o,ctx,canvas);
          break;
        case 'Digit3':
          o.hit1 = 0;
          o.hit2 = 0;
          o.hit3 = 1;
          o.hit4 = 0;
          board_redraw(o,ctx,canvas);
          break;
        case 'Digit4':
          o.hit1 = 0;
          o.hit2 = 0;
          o.hit3 = 0;
          o.hit4 = 1;
          board_redraw(o,ctx,canvas);
          break;
        }
      }
      if(ctx.d.myop=='shape'){
        ///'shape'
        let n = ctx.d.myundo.length;
        let o = ctx.d.myundo[n-1];
        switch(keycode){
        case 'KeyK':
          o.myfig.y  += - 1;
          board_redraw(o,ctx,canvas);
          break;
        case 'KeyJ':
          o.myfig.y  += + 1;
          board_redraw(o,ctx,canvas);
          break;
        case 'KeyH':
          o.myfig.x  += - 1;
          board_redraw(o,ctx,canvas);
          break;
        case 'KeyL':
          o.myfig.x  += + 1;
          board_redraw(o,ctx,canvas);
          break;
        ///PRESET
        case 'Digit1':
          o.myfig.h = o.myfig.w;
          o.myfig.rotate = 0;
          o.myfig.skewX = 0;
          o.myfig.skewY = 0;
          board_redraw(o,ctx,canvas);
          break;
        case 'Digit2':
          o.myfig.h = o.myfig.w * Math.sqrt(3) / 2;//for equilateral-triangle
          o.myfig.rotate = 0;
          o.myfig.skewX = 0;
          o.myfig.skewY = 0;
          board_redraw(o,ctx,canvas);
          break;
        case 'Digit3':
          o.myfig.h = o.myfig.w * 0.618;//for golden-ratio         
          o.myfig.rotate = 0;
          o.myfig.skewX = 0;
          o.myfig.skewY = 0;
          board_redraw(o,ctx,canvas);
          break;
        ///ROTATE
        case 'KeyE':
          o.myfig.rotate += (shiftKey)?(+1):(-1);
          board_redraw(o,ctx,canvas);
          break;
        case 'KeyR':
          o.myfig.rotate += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
          break;
        ///SCALE-S
        case 'KeyS':
          if(shiftKey){
            o.myfig.w /= 1.01;
            o.myfig.h /= 1.01;
          }else{
            o.myfig.w *= 1.01;
            o.myfig.h *= 1.01;
          }
          board_redraw(o,ctx,canvas);
          break;
        ///SCALE-W
        case 'KeyW':
          o.myfig.w  += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
          break;
        ///SCALE-T
        case 'KeyT':
          o.myfig.h  += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
          break;
        ///SKEW-X  
        case 'KeyX':
          o.myfig.skewX += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
          break;
        ///SKEW-Y  
        case 'KeyY':
          o.myfig.skewY += (shiftKey)?(-1):(+1);
          board_redraw(o,ctx,canvas);
          break;
        ///DUPLICATE
        case 'KeyD':
          if(shiftKey){
            let myop     = o.myop;
            let myarg    = o.myarg;
            let myfig    = o.myfig;
            let s        = ctx.d.myface;
            let mybasis  = ctx.d.mybasis;
            myfig = {...myfig};
            mybasis = {...mybasis};
            ///save 
            ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
            ctx.d.myredo = [];
            ctx.d.myface = ctx.getImageData(0,0, 441,320);
            board_last(ctx,canvas);
          }
          break;
        }
      }
    }
    function board_onmousedown(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ctx.d.myposx0 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
      ctx.d.myposy0 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
      ctx.d.myposx1 = ctx.d.myposx0;
      ctx.d.myposy1 = ctx.d.myposy0;
      ctx.d.myposx2 = ctx.d.myposx1;
      ctx.d.myposy2 = ctx.d.myposy1;
      ctx.d.shiftKey = evt.shiftKey;
      ctx.d.altKey   = evt.altKey;
      ctx.d.mymouseisdown = 1;
      board_start(ctx,canvas);
    }
    function board_onmousemove(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ctx.d.myposx1 = ctx.d.myposx2;
      ctx.d.myposy1 = ctx.d.myposy2;
      ctx.d.myposx2 = Math.round((evt.clientX-canvas.getBoundingClientRect().x)*sx);
      ctx.d.myposy2 = Math.round((evt.clientY-canvas.getBoundingClientRect().y)*sy);
      ctx.d.shiftKey = evt.shiftKey;
      ctx.d.altKey   = evt.altKey;
      if(ctx.d.mymouseisdown){
        board_drag(ctx,canvas);
      }else{
        board_move(ctx,canvas);
      }
    }
    function board_onmouseup(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      if(ctx.d.mymouseisdown){
        board_end(ctx,canvas);
      }
      ctx.d.mymouseisdown = 0;
    }
    function board_onmouseenter(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.d.mymouseisdown = 0;
    }
    function board_onmouseleave(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext("2d");
      ctx.d.mymouseisdown = 0;
    }
    function board_ontouchstart(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                             
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.d.myposx0 = Math.round((touch.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.d.myposy0 = Math.round((touch.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.d.myposx1 = ctx.d.myposx0;
        ctx.d.myposy1 = ctx.d.myposy0;
        ctx.d.myposx2 = ctx.d.myposx1;
        ctx.d.myposy2 = ctx.d.myposy1;
        ctx.d.mymouseisdown = 1;
        ctx.d.shiftKey = evt.shiftKey;
        ctx.d.altKey   = evt.altKey;
        if(ctx.d.mymouseisdown){
          board_start(ctx,canvas);
        }
      }
    }
    function board_ontouchmove(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        var ctx = canvas.getContext("2d");
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.d.myposx1 = ctx.d.myposx2;
        ctx.d.myposy1 = ctx.d.myposy2;
        ctx.d.myposx2 = Math.round((touch.clientX-canvas.getBoundingClientRect().x)*sx);
        ctx.d.myposy2 = Math.round((touch.clientY-canvas.getBoundingClientRect().y)*sy);
        ctx.d.shiftKey = evt.shiftKey;
        ctx.d.altKey   = evt.altKey;
        if(ctx.d.mymouseisdown){
          board_drag(ctx,canvas);
        }else{
          board_move(ctx,canvas);
        }
      }
    }
    function board_ontouchend(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        var ctx = canvas.getContext("2d");
        board_end(ctx,canvas);
        ctx.d.mymouseisdown = 0;
      }
    }
    function board_ontouchcancel(evt) {
      evt.preventDefault();
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        var canvas = touch.target;                            
        var ctx = canvas.getContext("2d");
        board_end(ctx,canvas);
        ctx.d.mymouseisdown = 0;
      }
    }
    function board_rotate_object(myrot,o,ctx,canvas){
      if(o.hit1){
        ctx.save();
        ctx.setTransform(...o.tr);
        ctx.translate(o.x1,o.y1);
        ctx.rotate(myrot/180*Math.PI);
        ctx.translate(-o.x1,-o.y1);
        o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
        ctx.restore();
      }else if(o.hit2){
        ctx.save();
        ctx.setTransform(...o.tr);
        ctx.translate(o.x2,o.y2);
        ctx.rotate(myrot/180*Math.PI);
        ctx.translate(-o.x2,-o.y2);
        o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
        ctx.restore();
      }else if(o.hit3){
        ctx.save();
        ctx.setTransform(...o.tr);
        ctx.translate(o.x3,o.y3);
        ctx.rotate(myrot/180*Math.PI);
        ctx.translate(-o.x3,-o.y3);
        o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
        ctx.restore();
      }else if(o.hit4){
        ctx.save();
        ctx.setTransform(...o.tr);
        ctx.translate(o.x4,o.y4);
        ctx.rotate(myrot/180*Math.PI);
        ctx.translate(-o.x4,-o.y4);
        o.tr = [ctx.getTransform().a,ctx.getTransform().b,ctx.getTransform().c,ctx.getTransform().d,ctx.getTransform().e,ctx.getTransform().f];
        ctx.restore();
      }
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function erase_between(myposx0,myposy0,myposx,myposy,lw,ctx){
      let dx = myposx-myposx0;
      let dy = myposy-myposy0;
      let Dx = Math.abs(dx);
      let Dy = Math.abs(dy);
      if(Dx==0&&Dy==0){
        var n = 1;
      }else if((Dx)>(Dy)){
        var n = Math.ceil(Dx/lw);
      }else{
        var n = Math.ceil(Dy/lw);
      }
      n = Math.max(1,n);
      dx /= n;
      dy /= n;
      for(i=0; i <= n; ++i){
        let x = myposx0 + dx*i;
        let y = myposy0 + dy*i;
        ctx.clearRect(x-(lw/2),y-(lw/2),lw,lw);
      }
    }
    function pencil_between(myposx0,myposy0,myposx,myposy,lw,ctx){
      lw = Math.max(1,lw);
      let dx = myposx-myposx0;
      let dy = myposy-myposy0;
      let Dx = Math.abs(dx);
      let Dy = Math.abs(dy);
      if(Dx==0&&Dy==0){
        var n = 1;
      }else if((Dx)>(Dy)){
        var n = Math.ceil(Dx/lw);
      }else{
        var n = Math.ceil(Dy/lw);
      }
      n = Math.max(1,n);
      dx /= n;
      dy /= n;
      for(i=0; i <= n; ++i){
        let x = myposx0 + dx*i;
        let y = myposy0 + dy*i;
        ctx.fillRect(x-(lw/2),y-(lw/2),lw,lw);
      }
    }
    function smudge_fill(x,y,stacksize,n,sx,sy,dir,mysmear,ctx){
      x = Math.floor(x);
      y = Math.floor(y);
      let limit = 0;
      if(stacksize<500 && n < 10000){
        var count = smudgeRect(x,y,1,1,mysmear,ctx,limit);
        n += count;
        if(count){
          let dy = y-sy;
          let dx = x-sx;
          if(dy >= 0 && dx >= 0){
            if(Math.abs(dy) > Math.abs(dx)){
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
            }else{
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
            }
          }else if(dy >= 0){
            if(Math.abs(dy) > Math.abs(dx)){
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
            }else{
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
            }
          }else if(dx >= 0){
            if(Math.abs(dy) > Math.abs(dx)){
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
            }else{
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
            }
          }else{ 
            if(Math.abs(dy) > Math.abs(dx)){
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
            }else{
              n = smudge_fill(x-1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y-1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x,  y+1,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
              n = smudge_fill(x+1,y  ,stacksize+1,n,sx,sy,dir+1,mysmear,ctx);
            }
          }
        }
      } 
      return n;
    }
    function smudge_between(myposx0,myposy0,myposx,myposy,lw,mysmear,ctx){
      let dx = myposx-myposx0;
      let dy = myposy-myposy0;
      let Dx = Math.abs(dx);
      let Dy = Math.abs(dy);
      if(Dx==0&&Dy==0){
        var n = 1;
      }else if((Dx)>(Dy)){
        var n = Math.ceil(Dx/lw);
      }else{
        var n = Math.ceil(Dy/lw);
      }
      n = Math.max(1,n);
      dx /= n;
      dy /= n;
      for(i=0; i <= n; ++i){
        let x = myposx0 + dx*i;
        let y = myposy0 + dy*i;
        let limit = 127;
        smudgeRect(x-(lw/2),y-(lw/2),lw,lw,mysmear,ctx,limit);
      }
    }
    function smudgeRect(x,y,w,h,mysmear,ctx,limit){
      ///RETURN the total number of pixels colored
      var count = 0;
      if(x >= 0 && y >= 0 && x < 441 && y < 320){
        var idata = ctx.getImageData(x,y,w,h);
        const cutoff = 127;
        for(let i=0; i < idata.data.length; i+=4){
          if(idata.data[i+3]==0){
            var rand1 = 0.5+Math.random()*0.5;
            var rand2 = 0.5+Math.random()*0.5;
            idata.data[i+0] = rand1*mysmear[0];
            idata.data[i+1] = rand1*mysmear[1];
            idata.data[i+2] = rand1*mysmear[2];
            idata.data[i+3] = rand2*cutoff*0.5;
            count++;
          }
        }
        ctx.putImageData(idata,x,y);
      }
      return count;
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_draw_pencil(ctx,canvas,first){
      let myposx1 = ctx.d.myposx1;
      let myposy1 = ctx.d.myposy1;
      let myposx2 = ctx.d.myposx2;
      let myposy2 = ctx.d.myposy2;
      let mysmear = ctx.d.mysmear;
      let mycolor = ctx.d.mycolor;
      let mystroke= ctx.d.mystroke;
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ///PENCIL
      var lw = mystroke*sx;
      lw = Math.max(lw,1);
      lw = Math.round(lw);//this is to work around the bug of Edge V93 on mac (number less than 1 will cause an error of "width is 0")
      ctx.lineWidth = lw;
      ctx.strokeStyle = mycolor;
      //pencil_between(myposx1,myposy1,myposx2,myposy2,lw,ctx);
      ctx.beginPath();
      ctx.moveTo(myposx1,myposy1);
      ctx.lineTo(myposx2,myposy2);
      ctx.stroke();
    }
    function board_draw_smudge_fill(x1,y1,sx,sy,ctx,canvas){
      let mysmear = ctx.d.mysmear;
      let mystroke= ctx.d.mystroke;
      let n = smudge_fill(x1,y1,0,0,sx,sy,0,mysmear,ctx);
    }
    function board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas){
      let mysmear = ctx.d.mysmear;
      let mycolor = ctx.d.mycolor;
      let mystroke= ctx.d.mystroke;
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      mystroke = Math.max(1,mystroke);
      var lw = 3*mystroke*sx;
      var lw = Math.round(lw);//this is to work around the bug of Edge V93 on mac (number less than 1 will cause an error of "width is 0")
      var lw = Math.max(1,lw);
      smudge_between(x1,y1,x2,y2,lw,mysmear,ctx);
    }
    function board_draw_clear(ctx,canvas,first){
      ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
    }
    function board_draw_eraser(ctx,canvas,first){
      let myposx1 = ctx.d.myposx1;
      let myposy1 = ctx.d.myposy1;
      let myposx2 = ctx.d.myposx2;
      let myposy2 = ctx.d.myposy2;
      let mysmear = ctx.d.mysmear;
      let mycolor = ctx.d.mycolor;
      let mystroke= ctx.d.mystroke;
      let myop    = ctx.d.myop;
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ///ERASER
      if(mystroke==0){
        ctx.clearRect(0,0,canvas.getAttribute('width'),canvas.getAttribute('height'));
      }else{
        mystroke = Math.max(1,mystroke);
        var lw = 3*mystroke*sx;
        var lw = Math.round(lw);//this is to work around the bug of Edge V93 on mac (number less than 1 will cause an error of "width is 0")
        if(first){
          ctx.clearRect(myposx2-(lw/2),myposy2-(lw/2),lw,lw);
        }else{
          erase_between(myposx1,myposy1,myposx2,myposy2,lw,ctx);
        }
      }
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_draw_hilite(ctx,canvas){
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.globalCompositeOperation = 'xor';
      ctx.fillRect(ctx.d.mybasis.x+ctx.d.mybasis.dx,
                   ctx.d.mybasis.y+ctx.d.mybasis.dy, 
                     ctx.d.mybasis.w+ctx.d.mybasis.dw,
                     ctx.d.mybasis.h+ctx.d.mybasis.dh);
      ctx.restore();
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_start(ctx,canvas){
      if(ctx.d.myop=='object'){
        if(ctx.d.myobject){
          ///'object' && myobject
          let {s,mybasis,myop,myarg,myfig} = ctx.d.myobject;
          let {x1,y1,x2,y2,x3,y3,x4,y4,tr} = ctx.d.myobject;
          ///TRANSFORM
          ctx.save();
          ctx.setTransform(...tr);
          ctx.d.myobject.hit1 = 0;
          ctx.d.myobject.hit2 = 0;
          ctx.d.myobject.hit3 = 0;
          ctx.d.myobject.hit4 = 0;
          if(Number.isFinite(x1) && Number.isFinite(y1)){
            ctx.beginPath();
            ctx.rect(x1-3,y1-3,6,6);
            ctx.d.myobject.hit1 = ctx.isPointInPath(ctx.d.myposx0,ctx.d.myposy0);
          }
          if(Number.isFinite(x2) && Number.isFinite(y2)){
            ctx.beginPath();
            ctx.rect(x2-3,y2-3,6,6);
            ctx.d.myobject.hit2 = ctx.isPointInPath(ctx.d.myposx0,ctx.d.myposy0);
          }
          if(Number.isFinite(x3) && Number.isFinite(y3)){
            ctx.beginPath();
            ctx.rect(x3-3,y3-3,6,6);
            ctx.d.myobject.hit3 = ctx.isPointInPath(ctx.d.myposx0,ctx.d.myposy0);
          }
          if(Number.isFinite(x4) && Number.isFinite(y4)){
            ctx.beginPath();
            ctx.rect(x4-3,y4-3,6,6);
            ctx.d.myobject.hit4 = ctx.isPointInPath(ctx.d.myposx0,ctx.d.myposy0);
          }
          ctx.restore();
        }
        if(ctx.d.myobject && (ctx.d.myobject.hit1 ||
                              ctx.d.myobject.hit2 ||
                              ctx.d.myobject.hit3 ||
                              ctx.d.myobject.hit4 )){
          ///good
        }else{
          ctx.d.myobject = ctx.d.myobject_tentative;
        }
      }
      if(ctx.d.myop=='select'){
        ///MOVE/COPY/RESIZE
        if( (ctx.d.myposx0 > ctx.d.mybasis.x) &&
            (ctx.d.myposx0 < ctx.d.mybasis.x+ctx.d.mybasis.w+ctx.d.mybasis.dw) &&
            (ctx.d.myposy0 > ctx.d.mybasis.y) &&
            (ctx.d.myposy0 < ctx.d.mybasis.y+ctx.d.mybasis.h+ctx.d.mybasis.dh) ){
          ctx.d.mybasis.s = ctx.d.myface;
          ctx.d.mybasis.a = ctx.d.myarg;
        }else{
          ///HILITE-ONLY
          board_reset_basis(ctx);
          ctx.d.mybasis.s = ctx.d.myface;
          ctx.d.mybasis.a = null;
          ctx.d.mybasis.x  = ctx.d.myposx0;
          ctx.d.mybasis.y  = ctx.d.myposy0;
          ctx.clearRect(0,0, 441,320);
          ctx.putImageData(ctx.d.myface, 0,0);
          board_draw_hilite(ctx,canvas);
        }
      }
      if(ctx.d.myop=='shape' && ctx.d.myarg=='circle'){
        //START
        board_reset_basis(ctx);
        let mystroke = ctx.d.mystroke;
        let mycolor  = ctx.d.mycolor;
        let x = ctx.d.myposx0;
        let y = ctx.d.myposy0;
        ctx.d.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(ctx.d.myface, 0,0);
      }
      if(ctx.d.myop=='shape' && ctx.d.myarg=='rect'){
        board_reset_basis(ctx);
        let mystroke = ctx.d.mystroke;
        let mycolor  = ctx.d.mycolor;
        let x = ctx.d.myposx0;
        let y = ctx.d.myposy0;
        ctx.d.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(ctx.d.myface, 0,0);
      }
      if(ctx.d.myop=='shape' && ctx.d.myarg=='tri'){
        board_reset_basis(ctx);
        let mystroke = ctx.d.mystroke;
        let mycolor  = ctx.d.mycolor;
        let x = ctx.d.myposx0;
        let y = ctx.d.myposy0;
        ctx.d.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(ctx.d.myface, 0,0);
      }
      if(ctx.d.myop=='shape' && ctx.d.myarg=='line'){
        board_reset_basis(ctx);
        let mystroke = ctx.d.mystroke;
        let mycolor  = ctx.d.mycolor;
        let x = ctx.d.myposx0;
        let y = ctx.d.myposy0;
        ctx.d.myfig = {x,y,w:0,h:0,rotate:0,skewX:0,skewY:0,mystroke,mycolor};
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(ctx.d.myface, 0,0);
      }
      if(ctx.d.myop=='eraser'){
        //START
        board_reset_basis(ctx);
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(ctx.d.myface, 0,0);
        board_draw_eraser(ctx,canvas,true);
      }
      if(ctx.d.myop=='smudge'){
        //START
        board_reset_basis(ctx);
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(ctx.d.myface, 0,0);
        let x1 = ctx.d.myposx1;
        let y1 = ctx.d.myposy1;
        let x2 = ctx.d.myposx2;
        let y2 = ctx.d.myposy2;
        if(ctx.d.mystroke==0){
          board_draw_smudge_fill(x1,y1,x1,y1,ctx,canvas);
        }else{
          board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas);
        }
      }
      if(ctx.d.myop=='pencil'){
        //START
        board_reset_basis(ctx);
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(ctx.d.myface, 0,0);
        board_draw_pencil(ctx,canvas,true);
      }
    }
    function board_drag(ctx,canvas){
      if(ctx.d.myop=='select'){
        //MOVE  
        if(ctx.d.mybasis.a){
          let dx = ctx.d.myposx2 - ctx.d.myposx0;
          let dy = ctx.d.myposy2 - ctx.d.myposy0;
          ctx.clearRect(0,0, 441,320);
          ctx.putImageData(ctx.d.myface, 0,0);
          let p1 = ctx.getImageData(ctx.d.mybasis.x,ctx.d.mybasis.y, ctx.d.mybasis.w,ctx.d.mybasis.h);
          if(ctx.d.mybasis.a=='move'){
            if(ctx.d.shiftKey){
              if(Math.abs(dx)<Math.abs(dy)){
                dx = 0;
              }else if(Math.abs(dy)<Math.abs(dx)){
                dy = 0;
              }
            }
            ctx.clearRect(ctx.d.mybasis.x,ctx.d.mybasis.y, ctx.d.mybasis.w,ctx.d.mybasis.h);
            ctx.putImageData(p1, ctx.d.mybasis.x+dx,ctx.d.mybasis.y+dy);
            ctx.d.mybasis.s = ctx.getImageData(0,0, 441,320);
            ///draw hilite
            ctx.d.mybasis.dx = dx;
            ctx.d.mybasis.dy = dy;
            board_draw_hilite(ctx,canvas);
          }else if(ctx.d.mybasis.a=='copy'){
            if(ctx.d.shiftKey){
              if(Math.abs(dx)<Math.abs(dy)){
                dx = 0;
              }else if(Math.abs(dy)<Math.abs(dx)){
                dy = 0;
              }
            }
            ctx.putImageData(p1, ctx.d.mybasis.x+dx,ctx.d.mybasis.y+dy);
            ctx.d.mybasis.s = ctx.getImageData(0,0, 441,320);
            ///draw hilite
            ctx.d.mybasis.dx = dx;
            ctx.d.mybasis.dy = dy;
            board_draw_hilite(ctx,canvas);
          }else if(ctx.d.mybasis.a=='resize'){
            let w = p1.width;
            let h = p1.height;
            let iw = w+dx;
            let ih = h+dy;
            if(ctx.d.shiftKey){
              iw = (ih/h)*w;
              iw = Math.round(iw);
            }
            let p2 = resizeImageData(p1, iw, ih, ctx);
            ctx.clearRect(ctx.d.mybasis.x,ctx.d.mybasis.y, ctx.d.mybasis.w,ctx.d.mybasis.h);
            ctx.putImageData(p2, ctx.d.mybasis.x,ctx.d.mybasis.y);
            ctx.d.mybasis.s = ctx.getImageData(0,0, 441,320);
            ///draw hilite
            ctx.d.mybasis.dw = (iw-w);
            ctx.d.mybasis.dh = (ih-h);
            board_draw_hilite(ctx,canvas);
          }
        }else{
          ///HILITE-ONLY
          ctx.d.mybasis.w = ctx.d.myposx2 - ctx.d.myposx0;
          ctx.d.mybasis.h = ctx.d.myposy2 - ctx.d.myposy0;
          ctx.putImageData(ctx.d.myface, 0,0);
          board_draw_hilite(ctx,canvas);
        }
      }
      if (ctx.d.myop=='shape' && ctx.d.myarg=='circle' && ctx.d.myfig){
        //MOVE  
        let myposx0 = ctx.d.myposx0;
        let myposy0 = ctx.d.myposy0;
        let myposx2 = ctx.d.myposx2;
        let myposy2 = ctx.d.myposy2;
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.d.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.d.myfig.mycolor;   
        ///CIRCLE
        let s = ctx.d.myface;
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(s, 0,0);
        let cx,cy,rx,ry;
        if(ctx.d.altKey){
          cx = myposx0;
          cy = myposy0;
          rx = Math.abs(myposx0 - myposx2);
          ry = Math.abs(myposy0 - myposy2);
          if(ctx.d.shiftKey){
            let r = Math.max(rx,ry);
            rx = r;
            ry = r;
          }
        }else{
          cx = (myposx0 + myposx2)/2;
          cy = (myposy0 + myposy2)/2;
          rx = Math.abs((myposx0 - myposx2)/2);
          ry = Math.abs((myposy0 - myposy2)/2);
          if(ctx.d.shiftKey){
            let r = Math.max(rx,ry);
            rx = r;
            ry = r;
            if(myposx2 > myposx0) cx = myposx0 + rx;
            else if(myposx2 < myposx0) cx = myposx0 - rx;
            if(myposy2 > myposy0) cy = myposy0 + ry;
            else if(myposy2 < myposy0) cy = myposy0 - ry;
          }
        }
        if(w || h){
          ctx.beginPath();
          ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
          ctx.d.myfig.x = cx;
          ctx.d.myfig.y = cy;
          ctx.d.myfig.w = rx;
          ctx.d.myfig.h = ry;
          ctx.stroke();
        }
      }
      if(ctx.d.myop=='shape' && ctx.d.myarg=='rect' && ctx.d.myfig){
        //MOVE  
        let myposx0 = ctx.d.myposx0;
        let myposy0 = ctx.d.myposy0;
        let myposx2 = ctx.d.myposx2;
        let myposy2 = ctx.d.myposy2;
        let x = myposx0;
        let y = myposy0; 
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.d.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.d.myfig.mycolor;   
        ///RECT  
        let s = ctx.d.myface;
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(s, 0,0);
        if(ctx.d.shiftKey){
          let d = Math.min(w,h);
          w = d;
          h = d;
        }
        if(w || h){
          ctx.strokeRect(x,y, w,h);
          ctx.d.myfig.x = x;
          ctx.d.myfig.y = y;
          ctx.d.myfig.w = w; 
          ctx.d.myfig.h = h; 
        }
      }
      if(ctx.d.myop=='shape' && ctx.d.myarg=='tri' && ctx.d.myfig){
        //MOVE  
        let myposx0 = ctx.d.myposx0;
        let myposy0 = ctx.d.myposy0;
        let myposx2 = ctx.d.myposx2;
        let myposy2 = ctx.d.myposy2;
        let x = myposx0;
        let y = myposy0; 
        let w = myposx2-myposx0;
        let h = myposy2-myposy0;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.d.myfig.mystroke*sx;         
        ctx.strokeStyle = ctx.d.myfig.mycolor;   
        ///TRI   
        let s = ctx.d.myface;
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(s, 0,0);
        let x1 = w/2;
        let y1 = 0; 
        let x2 = 0;
        let y2 = h;
        let x3 = w;
        let y3 = h;
        if(w || h){
          ctx.beginPath();
          ctx.moveTo(x+x1,y+y1);
          ctx.lineTo(x+x2,y+y2);
          ctx.lineTo(x+x3,y+y3);
          ctx.closePath();
          ctx.stroke();
          ctx.d.myfig.w = w;
          ctx.d.myfig.h = h;
        }
      }
      if(ctx.d.myop=='shape' && ctx.d.myarg=='line' && ctx.d.myfig){
        //MOVE  
        let x1 = ctx.d.myposx0;
        let y1 = ctx.d.myposy0;
        let x2 = ctx.d.myposx2;
        let y2 = ctx.d.myposy2;
        let [sx,sy] = board_calc_sx_and_sy(canvas);
        ctx.lineWidth   = ctx.d.myfig.mystroke*sx;
        ctx.strokeStyle = ctx.d.myfig.mycolor;
        ///LINE  
        let s = ctx.d.myface;
        ctx.clearRect(0,0, 441,320);
        ctx.putImageData(s, 0,0);
        let ddx = Math.abs(x2-x1);
        let ddy = Math.abs(y2-y1);
        let dd = Math.sqrt(ddx*ddx + ddy*ddy);
        if(ctx.d.shiftKey && ddx > ddy){
          x2 = ctx.d.myposx2;
          y2 = ctx.d.myposy0;
        }else if(ctx.d.shiftKey && ddy > ddx){
          x2 = ctx.d.myposx0;
          y2 = ctx.d.myposy2;
        }
        let w = x2-x1;
        let h = y2-y1;
        if(w || h){
          ctx.beginPath();
          ctx.moveTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.stroke();
          ctx.d.myfig.x = x1;
          ctx.d.myfig.y = y1; 
          ctx.d.myfig.w = w;
          ctx.d.myfig.h = h; 
        }
      }
      if(ctx.d.myop=='eraser'){
        //MOVE  
        board_draw_eraser(ctx,canvas,false);
      }
      if(ctx.d.myop=='smudge'){
        //MOVE  
        let x1 = ctx.d.myposx1;
        let y1 = ctx.d.myposy1;
        let x2 = ctx.d.myposx2;
        let y2 = ctx.d.myposy2;
        board_draw_smudge_between(x1,y1,x2,y2,ctx,canvas,false);
      }
      if(ctx.d.myop=='pencil'){
        //MOVE  
        board_draw_pencil(ctx,canvas,false);
      }
    }
    function board_end(ctx,canvas){
      if(ctx.d.myop=='object'){
        if(ctx.d.myobject){
          board_redraw(ctx.d.myobject,ctx,canvas);
        }else{
          board_last(ctx,canvas);
        }
      }
      else if(ctx.d.myop=='select'){
        let s        = ctx.d.mybasis.s;      
        if(s && ctx.d.mybasis.w && ctx.d.mybasis.h){
          ///normalize ctx.d.mybasis
          ctx.d.mybasis.x += ctx.d.mybasis.dx;
          ctx.d.mybasis.y += ctx.d.mybasis.dy;
          ctx.d.mybasis.dx = 0;
          ctx.d.mybasis.dy = 0;
          ctx.d.mybasis.w += ctx.d.mybasis.dw;
          ctx.d.mybasis.h += ctx.d.mybasis.dh;
          ctx.d.mybasis.dw = 0;
          ctx.d.mybasis.dh = 0;
          ctx.d.mybasis.s = null;
          let mybasis  = {...ctx.d.mybasis};
          let myfig = {...ctx.d.myfig};
          let myop = ctx.d.myop;
          let myarg = ctx.d.myarg;
          ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
          ctx.d.myredo = [];
          ctx.d.myface = s;
        }
      }
      else if(ctx.d.myop=='shape'){
        //BOARD_END   
        let s        = ctx.d.myface;
        let myfig    = ctx.d.myfig;
        let myop     = ctx.d.myop;
        let myarg    = ctx.d.myarg;
        if(s && myfig && myop && myarg && (myfig.w || myfig.h)){
          ///normalize ctx.d.mybasis
          ctx.d.mybasis.x += ctx.d.mybasis.dx;
          ctx.d.mybasis.y += ctx.d.mybasis.dy;
          ctx.d.mybasis.dx = 0;
          ctx.d.mybasis.dy = 0;
          ctx.d.mybasis.w += ctx.d.mybasis.dw;
          ctx.d.mybasis.h += ctx.d.mybasis.dh;
          ctx.d.mybasis.dw = 0;
          ctx.d.mybasis.dh = 0;
          let mybasis  = {...ctx.d.mybasis};
          ///save 
          ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
          ctx.d.myredo = [];
          ctx.d.myface = ctx.getImageData(0,0, 441,320);
        }
      }
      else {
        let s = ctx.getImageData(0,0, 441,320);
        ///normalize ctx.d.mybasis
        ctx.d.mybasis.x += ctx.d.mybasis.dx;
        ctx.d.mybasis.y += ctx.d.mybasis.dy;
        ctx.d.mybasis.dx = 0;
        ctx.d.mybasis.dy = 0;
        ctx.d.mybasis.w += ctx.d.mybasis.dw;
        ctx.d.mybasis.h += ctx.d.mybasis.dh;
        ctx.d.mybasis.dw = 0;
        ctx.d.mybasis.dh = 0;
        let mybasis  = {...ctx.d.mybasis};
        let myfig  = {...ctx.d.myfig};
        let myop = ctx.d.myop;
        let myarg = ctx.d.myarg;
        ///save 
        ctx.d.myundo.push({s,mybasis,myop,myarg,myfig});
        ctx.d.myredo = [];
        ctx.d.myface = ctx.getImageData(0,0, 441,320);
      }
    }
    function board_move(ctx,canvas){
      if(ctx.d.myop=='object'){
        ///'object' && !myobject    
        let myobject = null;
        for(let o of ctx.d.myundo){
          if(myobject){
            break;
          }
          let {s,mybasis,myop,myarg,myfig} = o;
          if(myop=='shape' && myarg=='circle'){
            ///OBJECT NEW  
            let rx = Math.abs(myfig.w);
            let ry = Math.abs(myfig.h);
            let x1 = rx;
            let y1 = 0; 
            let x2 = 0;
            let y2 = ry;
            let x3 = -rx;
            let y3 = 0;
            let x4 = 0;
            let y4 = -ry;
            ctx.save();
            ctx.lineWidth = 10;
            ctx.translate(myfig.x,myfig.y);
            ctx.rotate(myfig.rotate/180*Math.PI);
            ctx.beginPath();
            ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);
            let hit = ctx.isPointInStroke(ctx.d.myposx2,ctx.d.myposy2);
            let m = ctx.getTransform();
            let a = m.a;
            let b = m.b;
            let c = m.c;
            let d = m.d;
            let e = m.e;
            let f = m.f;
            ctx.translate(-myfig.x,-myfig.y);
            ctx.restore();
            if(hit){
              myfig = {...myfig};
              myop = 'object';
              mybasis = {...mybasis};
              s = ctx.d.myface;
              myobject = {s,mybasis,myop,myarg,myfig,hit1:1,hit2:0,hit3:0,hit4:0,x1,y1,x2,y2,x3,y3,x4,y4,tr:[a,b,c,d,e,f]};
            }
          }
          if(myop=='shape' && myarg=='rect'){
            ///OBJECT NEW  
            let w = myfig.w;
            let h = myfig.h;
            let x1 = 0;
            let y1 = 0; 
            let x2 = w;
            let y2 = 0;
            let x3 = w;
            let y3 = h;
            let x4 = 0;
            let y4 = h;
            y2 += myfig.skewY;
            x3 += myfig.skewX;
            y3 += myfig.skewY;
            x4 += myfig.skewX;
            ctx.save();
            ctx.lineWidth = 10;
            ctx.translate(myfig.x,myfig.y);
            ctx.rotate(myfig.rotate/180*Math.PI);
            ctx.beginPath();
            ctx.moveTo(0,                  0);
            ctx.lineTo(myfig.w,            myfig.skewY);
            ctx.lineTo(myfig.w+myfig.skewX,myfig.h+myfig.skewY);
            ctx.lineTo(myfig.skewX,        myfig.h);
            ctx.closePath();
            let hit = ctx.isPointInStroke(ctx.d.myposx2,ctx.d.myposy2);
            let m = ctx.getTransform();
            let a = m.a;
            let b = m.b;
            let c = m.c;
            let d = m.d;
            let e = m.e;
            let f = m.f;
            ctx.translate(-myfig.x,-myfig.y);
            ctx.restore();
            if(hit){
              myfig = {...myfig};
              myop = 'object';
              mybasis = {...mybasis};
              s = ctx.d.myface;
              myobject = {s,mybasis,myop,myarg,myfig,hit1:1,hit2:0,hit3:0,x1,y1,x2,y2,x3,y3,x4,y4,tr:[a,b,c,d,e,f]};
            }
          }
          if(myop=='shape' && myarg=='tri'){
            ///OBJECT NEW  
            let w = myfig.w;
            let h = myfig.h;
            let x1 = w/2;
            let y1 = 0; 
            let x2 = 0;
            let y2 = h;
            let x3 = w;
            let y3 = h;
            x2 += myfig.skewX;
            x3 += myfig.skewX;
            y3 += myfig.skewY;
            ///TRANSFORM
            ctx.save();
            ctx.lineWidth = 10;
            ctx.translate(myfig.x,myfig.y);
            ctx.translate(myfig.w/2,0);
            ctx.rotate(myfig.rotate/180*Math.PI);
            ctx.translate(-myfig.w/2,0);
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x3,y3);
            ctx.closePath();
            let hit = ctx.isPointInStroke(ctx.d.myposx2,ctx.d.myposy2);
            let m = ctx.getTransform();
            let a = m.a;
            let b = m.b;
            let c = m.c;
            let d = m.d;
            let e = m.e;
            let f = m.f;
            ctx.translate(-myfig.x,-myfig.y);
            ctx.restore();
            if(hit){
              myfig = {...myfig};
              myop = 'object';
              mybasis = {...mybasis};
              s = ctx.d.myface;
              myobject = {s,mybasis,myop,myarg,myfig,hit1:1,hit2:0,hit3:0,hit4:0,x1,y1,x2,y2,x3,y3,tr:[a,b,c,d,e,f]};
            }
          }
          if(myop=='shape' && myarg=='line'){
            ///OBJECT NEW  
            let w = myfig.w;
            let h = myfig.h;
            let x1 = 0;
            let y1 = 0; 
            let x2 = w;
            let y2 = h;
            ///TRANSFORM
            ctx.save();
            ctx.lineWidth = 10;
            ctx.translate(myfig.x,myfig.y);
            ctx.rotate(myfig.rotate/180*Math.PI);
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            let hit = ctx.isPointInStroke(ctx.d.myposx2,ctx.d.myposy2);
            let m = ctx.getTransform();
            let a = m.a;
            let b = m.b;
            let c = m.c;
            let d = m.d;
            let e = m.e;
            let f = m.f;
            ctx.translate(-myfig.x,-myfig.y);
            ctx.restore();
            if(hit){
              myfig = {...myfig};
              myop = 'object';
              mybasis = {...mybasis};
              s = ctx.d.myface;
              myobject = {s,mybasis,myop,myarg,myfig,hit1:1,hit2:0,hit3:0,hit4:0,x1,y1,x2,y2,tr:[a,b,c,d,e,f]};
            }
          }
        }
        if(myobject){
          canvas.style.cursor = 'cell';
        }else{
          canvas.style.cursor = 'default';
        }
        ctx.d.myobject_tentative = myobject;
      }
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function board_change_op(value,name){
      var canvas = document.getElementById(name);
      var ctx = canvas.getContext("2d");
      var ss = value.split('/');
      ctx.d.myop = ss[0];
      ctx.d.myarg = ss[1];
      ctx.d.myobject = null;
      board_set_cursor(ctx,canvas);
    }
    function board_change_color(value,name){
      var canvas = document.getElementById(name);
      var ctx = canvas.getContext("2d");
      ctx.d.mycolor = value;
      ctx.d.mysmear = ctx.d.myrgbs[value];
    }
    function board_change_stroke(value,name){
      var canvas = document.getElementById(name);
      var ctx = canvas.getContext("2d");
      ctx.d.mystroke = value;
    }
    function board_undo(boardid){
      var imgid = boardid + "-img";
      var img = document.getElementById(imgid);
      let canvas = document.getElementById(boardid);
      let ctx = canvas.getContext("2d");
      if(ctx.d.myundo.length>1){
        let o = ctx.d.myundo.pop();
        ctx.d.myredo.push(o);
      }
      board_last(ctx,canvas);
    }
    function board_redo(boardid){
      var imgid = boardid + "-img";
      var img = document.getElementById(imgid);
      let canvas = document.getElementById(boardid);
      let ctx = canvas.getContext("2d");
      if(ctx.d.myredo.length>0){
        let o = ctx.d.myredo.pop();
        if( o.myop=='shape' ){
          o.s = ctx.d.myface;
        }
        ctx.d.myundo.push(o);
      }
      board_last(ctx,canvas);
    }
    function board_submit(form,boardid,boardname){
      let canvas = document.getElementById(boardid);
      let dataURL = canvas.toDataURL('image/png');
      var textarea = form.querySelector('textarea.EDITDATAURI');
      var filename = form.querySelector('textarea.EDITFILENAME');
      var imgsrc = boardname ? boardname+'.png' : '';
      textarea.value = dataURL;
      filename.value = imgsrc;
    }
    function board_last(ctx,canvas){
      var n = ctx.d.myundo.length;
      var o = ctx.d.myundo[n-1];  
      if(o){
        board_redraw(o,ctx,canvas);
      }
    }
    function board_redraw(o,ctx,canvas){
      ctx.clearRect(0,0,441,320);
      if(o.s){
        ctx.putImageData(o.s,0,0);
        ctx.d.myface = o.s;
      }
      if(o.mybasis){
        ///COPY-SELECTION
        ctx.d.mybasis = {...o.mybasis};
      }
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      if(o.myop=='shape' && o.myarg=='circle'){
        let myfig = o.myfig;
        ctx.lineWidth = myfig.mystroke*sx;
        ctx.strokeStyle = myfig.mycolor;
        if(1){
          ctx.beginPath();
          let cx = myfig.x;
          let cy = myfig.y;
          let rx = Math.abs(myfig.w);//this could be negative, and it is legal for a rect
          let ry = Math.abs(myfig.h);//this could be negative, and it is legal for a rect
          ctx.ellipse(cx,cy,rx,ry,myfig.rotate/180*Math.PI,0,Math.PI*2);
          ctx.stroke();
        }
        ctx.d.myface = ctx.getImageData(0,0, 441,320);
      } 
      if(o.myop=='shape' && o.myarg=='rect'){
        let myfig = o.myfig;
        ctx.lineWidth = myfig.mystroke*sx;
        ctx.strokeStyle = myfig.mycolor;
        if(1){
          ///TRANSFORM
          ctx.save();
          ctx.translate(myfig.x,myfig.y);
          ctx.rotate(myfig.rotate/180*Math.PI);
          ctx.beginPath();
          ctx.moveTo(0,                  0);
          ctx.lineTo(myfig.w,            myfig.skewY);
          ctx.lineTo(myfig.w+myfig.skewX,myfig.h+myfig.skewY);
          ctx.lineTo(myfig.skewX,        myfig.h);
          ctx.closePath();
          ctx.translate(-myfig.x,-myfig.y);
          ctx.stroke();
          ctx.restore();
        }
        ctx.d.myface = ctx.getImageData(0,0, 441,320);
      } 
      if(o.myop=='shape' && o.myarg=='tri'){
        //REDRAW
        let myfig = o.myfig;
        ctx.lineWidth = myfig.mystroke*sx;
        ctx.strokeStyle = myfig.mycolor;
        if(1){
          let w = myfig.w;
          let h = myfig.h;
          let x1 = w/2;
          let y1 = 0; 
          let x2 = 0;
          let y2 = h;
          let x3 = w;
          let y3 = h;
          x2 += myfig.skewX;
          x3 += myfig.skewX;
          y3 += myfig.skewY;
          ///TRANSFORM
          ctx.save();
          ctx.translate(myfig.x,myfig.y);
          ctx.translate(myfig.w/2,0);
          ctx.rotate(myfig.rotate/180*Math.PI);
          ctx.translate(-myfig.w/2,0);
          ctx.beginPath();
          ctx.moveTo(x1,y1);
          ctx.lineTo(x2,y2);
          ctx.lineTo(x3,y3);
          ctx.closePath();
          ctx.translate(-myfig.x,-myfig.y);
          ctx.stroke();
          ctx.restore();
        }
        ctx.d.myface = ctx.getImageData(0,0, 441,320);
      } 
      if(o.myop=='shape' && o.myarg=='line'){
        //REDRAW
        let myfig = o.myfig;
        ctx.lineWidth = myfig.mystroke*sx;
        ctx.strokeStyle = myfig.mycolor;
        if(1){
          ///TRANSFORM
          ctx.save();
          ctx.beginPath();
          ctx.translate(myfig.x,myfig.y);
          ctx.rotate(myfig.rotate/180*Math.PI);
          ctx.moveTo(0,0);
          ctx.lineTo(myfig.w,myfig.h);
          ctx.translate(-myfig.x,-myfig.y);
          ctx.stroke();
          ctx.restore();
        }
        ctx.d.myface = ctx.getImageData(0,0, 441,320);
      } 
      if(o.myop=='object' && o.myarg=='circle'){
        ///REDRAW 
        let {myfig,hit1,hit2,hit3,hit4,x1,y1,x2,y2,x3,y3,x4,y4,tr} = ctx.d.myobject;
        let rx = (x1);
        let ry = (y2);
        ///TRANSFORM
        ctx.save();
        ctx.lineWidth = 4;//px
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "blue";
        ctx.setTransform(...tr);
        ctx.beginPath();
        ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(x1-3,y1-3,6,6);
        ctx.rect(x2-3,y2-3,6,6);
        ctx.rect(x3-3,y3-3,6,6);
        ctx.rect(x4-3,y4-3,6,6);
        ctx.fill();
        ctx.stroke();
        if(hit1){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x1-3,y1-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit2){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x2-3,y2-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit3){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x3-3,y3-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit4){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x4-3,y4-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        ctx.translate(-myfig.x,-myfig.y);
        ctx.restore();
      }
      if(o.myop=='object' && o.myarg=='rect'){
        ///REDRAW 
        let {myfig,hit1,hit2,hit3,hit4,x1,y1,x2,y2,x3,y3,x4,y4,tr} = ctx.d.myobject;
        ///TRANSFORM
        ctx.save();
        ctx.lineWidth = 4;//px
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "blue";
        ctx.setTransform(...tr);
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.lineTo(x4,y4);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(x1-3,y1-3,6,6);
        ctx.rect(x2-3,y2-3,6,6);
        ctx.rect(x3-3,y3-3,6,6);
        ctx.rect(x4-3,y4-3,6,6);
        ctx.fill();
        ctx.stroke();
        if(hit1){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x1-3,y1-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit2){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x2-3,y2-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit3){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x3-3,y3-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit4){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x4-3,y4-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        ctx.translate(-myfig.x,-myfig.y);
        ctx.restore();
      }
      if(o.myop=='object' && o.myarg=='tri'){
        ///REDRAW 
        let {myfig,hit1,hit2,hit3,x1,y1,x2,y2,x3,y3,tr} = ctx.d.myobject;
        ///TRANSFORM
        ctx.save();
        ctx.lineWidth = 4;//px
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "blue";
        ctx.setTransform(...tr);
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(x1-3,y1-3,6,6);
        ctx.rect(x2-3,y2-3,6,6);
        ctx.rect(x3-3,y3-3,6,6);
        ctx.fill();
        ctx.stroke();
        if(hit1){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x1-3,y1-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit2){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x2-3,y2-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit3){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x3-3,y3-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        ctx.translate(-myfig.x,-myfig.y);
        ctx.restore();
      }
      if(o.myop=='object' && o.myarg=='line'){
        ///REDRAW 
        let {myfig,hit1,hit2,hit3,x1,y1,x2,y2,tr} = ctx.d.myobject;
        ///TRANSFORM
        ctx.save();
        ctx.lineWidth = 4;//px
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "blue";
        ctx.setTransform(...tr);
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(x1-3,y1-3,6,6);
        ctx.rect(x2-3,y2-3,6,6);
        ctx.fill();
        ctx.stroke();
        if(hit1){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x1-3,y1-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        if(hit2){
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.rect(x2-3,y2-3,6,6);
          ctx.fill();
          ctx.stroke();
        }
        ctx.translate(-myfig.x,-myfig.y);
        ctx.restore();
      }
    }
    function board_calc_sx_and_sy(canvas){
      let sx = canvas.getAttribute("width")/canvas.getBoundingClientRect().width;
      let sy = canvas.getAttribute("height")/canvas.getBoundingClientRect().height;
      return [sx,sy];
    }
    function board_reset_basis(ctx){
      ctx.d.mybasis.x = 0;
      ctx.d.mybasis.y = 0;
      ctx.d.mybasis.w = 0;
      ctx.d.mybasis.h = 0;
      ctx.d.mybasis.dx = 0;
      ctx.d.mybasis.dy = 0;
      ctx.d.mybasis.dw = 0;
      ctx.d.mybasis.dh = 0;
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function resizeImageData(odata,iwidth,iheight,ctx) {
      var owidth = odata.width;
      var oheight = odata.height;
      var idata = ctx.createImageData(iwidth, iheight);
      for(var row = 0; row < iheight; row++) {
        for(var col = 0; col < iwidth; col++) {
          let i = row*iwidth + col;
          let ROW = Math.floor(row*(oheight/iheight));
          let COL = Math.floor(col*(owidth/iwidth));
          let I = ROW*owidth + COL;
          idata.data[i*4 + 0] = odata.data[I*4 + 0];
          idata.data[i*4 + 1] = odata.data[I*4 + 1];
          idata.data[i*4 + 2] = odata.data[I*4 + 2];
          idata.data[i*4 + 3] = odata.data[I*4 + 3];
        }
      }
      return idata;
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    async function __resizeImageData (imageData, width, height) {
      const resizeWidth = width >> 0
      const resizeHeight = height >> 0
      const ibm = await window.createImageBitmap(imageData, 0, 0, imageData.width, imageData.height, {
        resizeWidth, resizeHeight
      })
      const canvas = document.createElement('canvas')
      canvas.width = resizeWidth
      canvas.height = resizeHeight
      const ctx = canvas.getContext('2d')
      ctx.scale(resizeWidth / imageData.width, resizeHeight / imageData.height)
      ctx.drawImage(ibm, 0, 0)
      return ctx.getImageData(0, 0, resizeWidth, resizeHeight)
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function ball_setup_canvas(canvas){
      canvas.style.cursor = 'pointer';
      var ctx = canvas.getContext('2d');
      var json = canvas.getAttribute('data-json');
      if(json){
        //only setup this canvas if it has a 'json' attribute
        var balls = JSON.parse(json);
        console.log('balls',balls);
        ctx.font = "40px Arial";
        ctx.lineWidth = 4;//px
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.fillStyle = "green";
        ctx.fillText('Hello canvas!',100,100);
        canvas.addEventListener("mousedown",  ball_onmousedown,  false);
        canvas.addEventListener("mouseup",    ball_onmouseup,    false);
        canvas.addEventListener("mousemove",  ball_onmousemove,  false);
        ctx.d = {};
        ctx.d.dirty = 1;
        ctx.d.balls = balls;
        ctx.d.currmousex = -1;
        ctx.d.currmousey = -1;
        ctx.d.hitball = null;//the ball being hit the last time
        ctx.d.downball = null;//the current ball being pressed down
        ctx.d.hitcorner = -1;// the corner last hit by the mouse
        ctx.d.downcorner = -1;//the index for the corner that is down
        ctx.d.showmode = 0;//0=corners,1=centroid
        ctx.d.rotateflag = 0;
        ctx.d.moveflag = 0;
        ctx.d.insideflag = 0;
        ctx.d.movedistx = 0;
        ctx.d.movedisty = 0;
        ctx.d.downmousex = 0;
        ctx.d.downmousey = 0;
        ctx.d.initmousex = 0;
        ctx.d.initmousey = 0;
        ctx.d.rotateangle = 0;
        ctx.d.rotatex0 = 0;
        ctx.d.rotatey0 = 0;
      }
    }
    function draw_canvas(timestamp){
      var select = document.querySelectorAll('canvas');
      for(var i=0; i < select.length; i++){
        var canvas = select[i];
        var type = canvas.getAttribute('data-type');
        if(type=='ball'){
          ball_draw_canvas(canvas);
        }else if(type=='board'){
          board_draw_canvas(canvas);
        }
      }
      requestAnimationFrame(draw_canvas);
    }
    function ball_draw_canvas(canvas){
      var ctx = canvas.getContext('2d');
      if(ctx && ctx.d && ctx.d.dirty){
        ctx.d.dirty = 0;
        ctx.clearRect(0,0,500,500);
        ctx.d.hitball = null;
        ctx.d.balls.forEach((ball) => {
          ctx.save();
          let [a,b,c,d,e,f] = ball.transform;
          ctx.setTransform(a,b,c,d,e,f);
          if(ctx.d.rotateflag && ball == ctx.d.downball){
            ctx.translate(ctx.d.rotatex0,ctx.d.rotatey0);
            ctx.rotate(ctx.d.rotateangle);
            ctx.translate(-ctx.d.rotatex0,-ctx.d.rotatey0);
          }else if(ctx.d.moveflag && ball == ctx.d.downball){
            let matrix = ctx.getTransform();
            let a = matrix.a;
            let b = matrix.b;
            let c = matrix.c;
            let d = matrix.d;
            let e = matrix.e;
            let f = matrix.f;
            ctx.setTransform(1,0,0,1,0,0);
            ctx.translate(ctx.d.movedistx,ctx.d.movedisty);
            ctx.transform(a,b,c,d,e,f);
          }
          ctx.beginPath();
          ball.points.forEach((pt) => {
            let {op,x,y,cp1x,cp1y,cp2x,cp2y,x1,y1,x2,y2,r,ry,sAngle,eAngle,anticlockflag} = pt;
            switch(op){
              case 'M':
                ctx.moveTo(x1,y1);
                break;
              case 'L':
                ctx.lineTo(x1,y1);
                break;
              case 'A':
                ctx.arcTo(x1,y1,x2,y2,r);
                break;
              case 'a':
                ctx.arc(x1,y1,r,sAngle,eAngle,anticlockflag);
                break;
              case 'e':
                var rotation = 0;
                ctx.ellipse(x1,y1,r,ry,rotation,sAngle,eAngle,anticlockflag);
                break;
              case 'z':
                ctx.closePath();
                break;
            }
          });
          if(1||ball.type=='line'||ball.type=='polyline'){
            var hitflag = ctx.isPointInStroke(ctx.d.currmousex,ctx.d.currmousey);
          }else{
            var hitflag = ctx.isPointInPath(ctx.d.currmousex,ctx.d.currmousey);
          }
          if(hitflag){
            ctx.d.hitball = ball;
          }
          if(hitflag){
            ctx.strokeStyle = 'blue';
            ctx.stroke();
          }else if(ctx.d.downball===ball){
            ctx.strokeStyle = 'blue';
            ctx.stroke();
          }else{
            ctx.stroke();
          }
          if(ctx.d.downball===ball){
            ball_draw_canvas_corners(ctx,ball);
          }
          ctx.restore();
        });
      }
    }
    function ball_draw_canvas_corners(ctx,ball){
      ctx.save();
      ctx.d.hitcorner = -1;
      ball.points.forEach((pt,i) => {
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        let {op,x,y,cp1x,cp1y,cp2x,cp2y,x1,y1,x2,y2,r} = pt;
        switch(op){
          case 'z':
            break;
          default:
            ctx.rect(x-5,y-5,10,10);
            break;
        }
        let hitflag = ctx.isPointInPath(ctx.d.currmousex,ctx.d.currmousey);
        if(hitflag){
          ctx.d.hitcorner = i;
        }
        if(hitflag){
          ctx.lineWidth = '2';
        }
        if(ctx.d.downcorner >= 0 && ctx.d.downcorner == i){
          ctx.fillStyle = 'red';
        }
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    }
    function ball_onmousemove(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext('2d');
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ctx.d.dirty = 1;
      ctx.d.currmousex = evt.offsetX*sx;
      ctx.d.currmousey = evt.offsetY*sy;
      if(ctx.d.rotateflag){
        let angle0 = Math.atan2(ctx.d.initmousey-ctx.d.downmousey,ctx.d.initmousex-ctx.d.downmousex);
        let angle1 = Math.atan2(ctx.d.currmousey-ctx.d.downmousey,ctx.d.currmousex-ctx.d.downmousex);
        ctx.d.rotateangle = angle1-angle0;
      }else if(ctx.d.moveflag){
        ctx.d.movedistx = ctx.d.currmousex - ctx.d.initmousex;
        ctx.d.movedisty = ctx.d.currmousey - ctx.d.initmousey;
      }
    }
    function ball_onmousedown(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext('2d');
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ctx.d.dirty = 1;
      ctx.d.currmousex = evt.offsetX*sx;
      ctx.d.currmousey = evt.offsetY*sy;
      ///check for switching to a new ball
      if(ctx.d.hitball && ctx.d.downball && ctx.d.hitball != ctx.d.downball){
        ctx.d.downball = ctx.d.hitball;
        ctx.d.hitcorner = -1;
        ctx.d.downcorner = -1;
      } else if(ctx.d.hitball && !ctx.d.downball && ctx.d.hitball != ctx.d.downball){
        ctx.d.downball = ctx.d.hitball;
        ctx.d.hitcorner = -1;
        ctx.d.downcorner = -1;
      }
      ///check for corners of existing ball
      if(ctx.d.downball && ctx.d.downcorner >= 0 && ctx.d.downcorner != ctx.d.hitcorner){
        //start rotate
        ctx.d.rotateflag = 1;
        ctx.d.rotateangle = 0;
        let [x0,y0] = getBallPointXY(ctx.d.downball,ctx.d.downcorner);
        ctx.d.rotatex0 = x0;
        ctx.d.rotatey0 = y0;
        ctx.d.initmousex = evt.offsetX*sx;
        ctx.d.initmousey = evt.offsetY*sy;
      }else if(ctx.d.downball && ctx.d.hitball && ctx.d.downball == ctx.d.hitball){
        //start move
        ctx.d.moveflag = 1;
        ctx.d.movedistx = 0;
        ctx.d.movedisty = 0;
        ctx.d.initmousex = evt.offsetX*sx;
        ctx.d.initmousey = evt.offsetY*sy;
      }else if(ctx.d.downball && ctx.d.hitcorner >= 0){
        ctx.d.insideflag = 1;
        ctx.d.initmousex = evt.offsetX*sx;
        ctx.d.initmousey = evt.offsetY*sy;
        ctx.d.rotateflag = 0;
        ctx.d.moveflag = 0;
      }else{
        ctx.d.initmousex = evt.offsetX*sx;
        ctx.d.initmousey = evt.offsetY*sy;
        ctx.d.rotateflag = 0;
        ctx.d.moveflag = 0;
      }
    }
    function ball_onmouseup(evt){
      var canvas = evt.target;
      var ctx = canvas.getContext('2d');
      let [sx,sy] = board_calc_sx_and_sy(canvas);
      ctx.d.dirty = 1;
      ctx.d.currmousex = evt.offsetX*sx;
      ctx.d.currmousey = evt.offsetY*sy;
      if(ctx.d.rotateflag && ctx.d.rotateangle != 0){
        ctx.save();
        let [a,b,c,d,e,f] = ctx.d.downball.transform;
        ctx.setTransform(a,b,c,d,e,f);
        ctx.translate(ctx.d.rotatex0,ctx.d.rotatey0);
        ctx.rotate(ctx.d.rotateangle);
        ctx.translate(-ctx.d.rotatex0,-ctx.d.rotatey0);
        if(1){
          let matrix = ctx.getTransform();
          let {a,b,c,d,e,f} = matrix;
          ctx.d.downball.transform = [a,b,c,d,e,f];
        }
        ctx.restore();
        ctx.d.rotateflag = 0;
      }else if(ctx.d.moveflag && (ctx.d.movedistx != 0 || ctx.d.movedisty != 0)){
        ctx.save();
        let [a,b,c,d,e,f] = ctx.d.downball.transform;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.translate(ctx.d.movedistx,ctx.d.movedisty);
        ctx.transform(a,b,c,d,e,f);
        if(1){
          let matrix = ctx.getTransform();
          let {a,b,c,d,e,f} = matrix;
          ctx.d.downball.transform = [a,b,c,d,e,f];
        }
        ctx.restore();
        ctx.d.moveflag = 0;
      }else if(ctx.d.downball && ctx.d.hitcorner >= 0){
        ctx.d.downcorner = ctx.d.hitcorner;
        ctx.d.downmousex = evt.offsetX*sx;
        ctx.d.downmousey = evt.offsetY*sy;
      }else if(ctx.d.insideflag){
        ctx.d.insideflag = 0;
        ctx.d.hitcorner = -1;
        ctx.d.downcorner = -1;
      }else{
        ctx.d.downball = ctx.d.hitball;
        ctx.d.hitcorner = -1;
        ctx.d.downcorner = -1;
      }
      ctx.d.rotateflag = 0;
      ctx.d.moveflag = 0;
    }
    function getBallPointXY(ball,corner){
      let theball1;
      let x, y;
      x = ball.points[corner].x;
      y = ball.points[corner].y;
      return [x,y];
    }
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    ////////////////////////////////////////////
    function canvas_keypress(){
      var canvas = event.target;
      var ctx = canvas.getContext("2d");
      var keycode = event.code;
      var shiftKey = event.shiftKey;
      var altKey = event.altKey;
      board_handle_keydown(shiftKey,altKey,keycode,ctx,canvas);
    }
    `;
  }
