'use babel';

const { NitrilePreviewLatex } = require('./nitrile-preview-latex');

class NitrilePreviewMemoir extends NitrilePreviewLatex {
  constructor(parser,program) {
    super(parser,program);
    this.name='memoir';
    this.style=parser.style;
    this.postsetup = [];
    this.postsetup.push(`\\newsubfloat{figure}% Allow subfloats in figure environment`);
    this.postsetup.push(`\\usepackage{longtable}`);
    this.postsetup.push(`\\usepackage[overlap,CJK]{ruby}`);
    this.postsetup.push(`\\renewcommand\\rubysep{0.0ex}`);
  }
  to_document() {
    var body = [];
    this.parser.blocks.forEach((block) => {
      let text = this.translate_block(block);
      body.push(text);
    })
    var titlelines = this.to_titlelines(this.parser.blocks);
    var toc = this.conf_to_bool('toc');
    return this.to_latex_document('memoir',[],this.postsetup,titlelines,toc,body);
  }
  to_titlelines(){
    var titlelines = [];
    var title = this.parser.conf_to_string('title');
    var author = this.parser.conf_to_string('author');
    titlelines.push(`\\title{${this.uncode(this.style,title)}}`);
    titlelines.push(`\\author{${this.uncode(this.style,author)}}`);
    return titlelines;
  }
  
  _to_pdflatex_document() {
    var conflines = this.to_config_lines();
    var texlines = this.parser.blocks.map(x => x.latex);
    var titlelines = [];
    var toclines = [];
    var documentclass = 'memoir'
    var p_documentclassopt=this.conf_to_list('documentclassopt').join(',');
    var style = this.parser.style;
    if(this.conf_to_string('titlepage')){
      titlelines.push(`\\title{${this.uncode(style,this.conf_to_string('title'))}}`);
      titlelines.push(`\\author{${this.uncode(style,this.conf_to_string('author'))}}`);
      titlelines.push(`\\maketitle`);
    }
    if(this.conf_to_string('toc')){
      toclines.push(`\\tableofcontents`);
    } 
    var packages = '';
    packages=this.to_required_packages_pdflatex_memoir();
    var extra_packages = this.to_extra_packages();
    return     `\
%!TeX program=LuaLatex
${conflines.join('\n')}
\\documentclass[${p_documentclassopt||''}]{${documentclass}}
${packages}
${extra_packages}
\\begin{document}
${titlelines.join('\n')}
${toclines.join('\n')}
${texlines.join('\n')}
\\end{document}
`;
  }

  _to_lualatex_document() {
    var conflines = this.to_config_lines();
    var texlines = this.parser.blocks.map(x => x.latex);
    var titlelines = [];
    var toclines = [];
    var documentclass = 'memoir'
    var p_documentclassopt=this.conf_to_list('documentclassopt').join(',');
    var style = this.parser.style();
    if(this.conf_to_string('titlepage')){
      titlelines.push(`\\title{${this.uncode(style,this.conf_to_string('title'))}}`);
      titlelines.push(`\\author{${this.uncode(style,this.conf_to_string('author'))}}`);
      titlelines.push(`\\maketitle`);
    }
    if(this.conf_to_string('toc')){
      toclines.push(`\\tableofcontents`);
    } 
    var packages = '';
    packages=this.to_required_packages_lualatex_memoir();
    var extra_packages = this.to_extra_packages();
    return     `\
%!TeX program=LuaLatex
${conflines.join('\n')}
\\documentclass[${p_documentclassopt||''}]{${documentclass}}
${packages}
${extra_packages}
\\begin{document}
${titlelines.join('\n')}
${toclines.join('\n')}
${texlines.join('\n')}
\\end{document}
`;
  }

  _to_extra_packages() {
    var extra = this.conf_to_string('extra');
    return extra.split('\t').join('\n');
  }

  _to_required_packages_lualatex_memoir() {

    return `
\\let\\saveprintglossary\\printglossary
\\let\\printglossary\\relax
\\usepackage{luatexja-fontspec}
\\usepackage{luatexja-ruby}
\\let\\printglossary\\saveprintglossary
\\let\\saveprintglossary\\relax
\\newjfontfamily\\de{dejavusans}
\\newjfontfamily\\za{zapfdingbats}
\\newjfontfamily\\cn{arplsungtilgb}
\\newjfontfamily\\tw{arplmingti2lbig5}
\\newjfontfamily\\jp{ipaexmincho}
\\newjfontfamily\\kr{baekmukbatang}
\\usepackage{graphicx}
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
\\usepackage{listings}
\\usepackage{anyfontsize}
\\usepackage{luamplib}
\\usepackage[normalem]{ulem}
\\usepackage{xltabular}
\\usepackage{xtab}
\\usepackage{xcolor}
\\usepackage[export]{adjustbox}
\\usepackage{url}
%%% command to define \mplibtoPDF command
\\def\\mplibtoPDF#1{\\special{pdf:literal direct #1}}
`;
  }

  _to_required_packages_pdflatex_memoir() {

    return `
\\usepackage[utf8x]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{graphicx}
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
\\usepackage{listings}
\\usepackage{anyfontsize}
\\usepackage[normalem]{ulem}
\\usepackage{xltabular}
\\usepackage{xtab}
\\usepackage{xcolor}
\\usepackage[export]{adjustbox}
\\usepackage{url}
`;
  }

  _to_required_packages_pdflatex_memoir() {

    return `\\usepackage[utf8x]{inputenc}
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
`;
  }

}
module.exports = { NitrilePreviewMemoir };
