'use babel';
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////
class NitrilePreviewBiochem extends NitrilePreviewContex {
  constructor(parser) {
    super(parser);
    this.name='biochem';
    this.style = parser.style;
    this.contex_papersize = '';
    this.contex_bodyfontsize = 10;
    this.contex_bodylineheight = 1;
    this.contex_whitespacesize = 0;
    this.contex_bodyfontfamily = 'linux';
    this.contex_indenting = 'no';
  }
  to_document() {
    var translationlines = [];
    this.parser.blocks.forEach((block) => {
      let x = this.translate_block(block);
      translationlines.push(x);
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
% !TEX program = ConTeXt (LuaTeX)
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_essentials()}
${this.to_preamble_caption()}
${this.to_preamble_definecolors()}
${this.to_preamble_langs()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\setuppapersize[A5]                           
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\enabletrackers[fonts.missing]
%: Encoding. I wrote in Emacs, encoding the text in iso-latin-1
%: Language specific stuff. The book is written in German. By default, German quotes would show up as something like ,some text', quotations would be between ", the first one at the bottom of the line, the second one high (don't know how to show that here). I wanted "English" quotes and guillemets for quotations:
%: Fonts. I proposed LinLibertine, but the publisher thought that too "unorthodox". Too bad, but here's the setup for Times:
\\usetypescript[times][ec]
\\setupbodyfont[times,11pt]
%: Greek. I used the greek module. You can write "real" Greek, with all the accents, like this: See Maps article by Willi Egger):
%\\usemodule[greek]
%: Units. Units like µg, mg etc. can be consistently set with the units module (see Contextgarden page). But I found that, sometimes, the character sizes didn't match well with the text (different font, I suppose?), and I therefore often simply used "mg" instead of "\Milli\Gram" etc.
%\\usemodule[units]
%: Colours. I used two kinds of red: "red", which is predefined, and a lighter red I defined myself. Colors need to be "set up":
\\setupcolors[state=start]
\\setupcolor[rgb]
\\definecolor[lightred][r=1,g=0.85,b=0.85]
%: Papersize.
\\definepapersize[MyBook][width=17cm,height=24cm]
\\setuppapersize[MyBook][MyBook] % Prints on paper the size of MyBook
%\\setuppapersize[MyBook][A4] %Would print MyBook-size pages on A4 paper
%: Layout. I know that the following layout is not as generous as it should be, but this is what the publisher wanted; the wide cutspace is needed for margin figures:
\\setuplayout[location=middle,
  topspace=1.3cm,
  width=middle,
  cutspace=4.5cm,
  rightmargindistance=0.4cm,
  leftmargindistance=0.2cm,
  backspace=1.2cm,
  height=fit,
  rightmargin=2.5cm,
  leftmargin=1cm,
  bottomspace=2cm,
  footer=0.8cm,
  setup=strict]
%: Manual adaptations of the layout. Because of the nature of the text (many itemizations, figures, tables and such), I had to manually adjust the number of lines on some pages, e.g.:
%\adaptlayout[14][lines=+1]
%: Displaying frames etc.. In order to know what you are doing, comment/uncomment the following 4 lines:
%\\showgrid
%\\showframe
%\\showsetups
%\\showlayout
%: Page numbering. Sorry---no headers or footers. Just simple page number at bottom centre.
\\setuppagenumbering[alternative=doublesided,location=footer]
\\setupheader[state=none]
%: Tolerance. This was one of the first suggestions I got to a question I asked. Didn't change it nor play with it:
\\setuptolerance[tolerant, stretch]
%: Paragraphs. The paragraphs are not indented, but separated by whitespace:
\\setupwhitespace[medium]
%: Footnotes. I used symbols for footnotes (conversion), starting with the same symbol on a new page:
\\setupfootnotes[way=bypage, conversion=set 2]
%: Chapters and sections. Don't remember what this was for:
\\definepagebreak[chapter][yes,footer,right]
%: Bookchapters. Red chapter number, set off from title text by a vertical bar
\\define[2]\\BookchapterCommand{\\framed[frame=off,rightframe=on]{#1\\space}\\framed[frame=off]{\\space#2}}
\\setuphead[chapter][command=\\BookchapterCommand,page=chapter,numbercolor=red,alternative=inmargin]
%: Section title. Red numbers and black title on top of a gray background.
\\define[2]\\SectionCommand%
  {\\framed
     [frame=off,
      width=\\textwidth,
      align={right},
      background=color,
      backgroundcolor=lightgray]
     {\\hbox to.011\\textwidth{}\\hbox to.05\\textwidth{\\strut#1}\\quad
      \\vtop{\\hsize\\dimexpr\\hsize-.061\\textwidth-1em\\relax\\begstrut#2
\\endstrut}}}
\\setuphead[section][command=\\SectionCommand,numbercolor=red]
%: Subsections. "sans serif" on a gray background, but no numbering. 
\\define[2]\\SubsectionCommand%
  {\\framed
     [frame=off,
      width=\\textwidth,
      align={right},
      background=color,
      backgroundcolor=lightgray]
     {\\hbox to.011\\textwidth{\\strut#1}\\vtop{\\hsize\\dimexpr\\hsize-.011\\textwidth-1em\\relax\\begstrut#2
\\endstrut}}}
\\setuphead[subsection][command=\\SubsectionCommand,number=no,style=\\ss]
%: Subsubsections. Italic, no distance between subsubsection title and following paragraph. There is also an attempt to avoid subsubsection titles on the last line of a page, but if I remember correctly that didn't (always?) work:
\\setuphead[subsubsection][command=,style=slanted,number=no,before={\\blank[big]},before={\\testpage[1]},after=\\nowhitespace]
%: Legends. More space after the legends:
\\setupfloats[spaceafter=3*medium]
%: Tables I. I used Tables 
\\setuptables[bodyfont=small]
\\setupcaption[table][style={\\ssx\\setupinterlinespace[line=2.5ex]},align=left]
%: Tables II. Tables of width <0.5 times textwidth are automatically placed at the inner margin (Instructions can be found in "Details.pdf").
\\setupfloat[table][criterium=0.5\\textwidth,default=inner]
%: Figures I. Same story as tables.
\\setupcaption[figure][style={\\ssx\\setupinterlinespace[line=2.5ex]},align=left]
%: Figurs II. Figures and tables larger than textwidth (maximum: textwidth + marginwidth + what's between them) should stick out into the (outer, wide) margin:
\\definefloat[Bigfigure][Bigfigures][figure]
\\setupfloat[Bigfigure][location=inner]
\\definefloat[Bigtable][Bigtables][table]
\\setupfloat[Bigtable][location=inner]
%: Figures III. I had many figures in the outer margin (unnumbered, unlabelled). But some were a bit too wide (>2.5cm); I wanted them filling the margin and sticking into the text; I called them "vignettes":
\\definefloat[vignette][figure]
\\setupfloat[vignette][leftmargindistance=-\\outermargintotal,rightmargindistance=-\\outermargintotal,margin=0pt,default={outer,none,low}]
\\setupcaption[vignette][number=no]
%: Framed texts. I had three types of framed text which I named "Story", "MySummary" and "Oddity". You put the text between "\\startStory...\\stopStory" etc. 
\\definestartstop[Story][before={\setupbackground[style=\\tfx,background=color,backgroundcolor=white,frame=on,framecorner=rectangular,framecolor=black,rulethickness=0.5pt,topoffset=0.25cm,bottomoffset=0.25cm,leftoffset=0.25cm,rightoffset=0.25cm,before={\\blank[big]}]\\startbackground\\switchtobodyfont[10pt]},after=\\stopbackground]
\\definestartstop[MySummary][before={\\setupbackground[background=color,backgroundcolor=lightgray,backgroundcorner=rectangular,frame=off,topoffset=0.3cm,bottomoffset=0.3cm,leftoffset=0.5cm,rightoffset=0.5cm,before={\\blank[big]}]\\startbackground\\Zus},after=\\stopbackground]
\\defineframedtext[Oddity][width=0.75\textwidth,background=color,backgroundcolor=lightred,frame=off,framecorner=round,frameradius=0.5cm,backgroundcorner=round,style=\\tfx]
%: Text in the margin. sans serif, smaller size and leftaligned(!). Again: "\\setupinterlinespace".
\\setupinmargin[align=right,style=\\ss\\tfx\\setupinterlinespace]
%: Itemizations. The publisher wanted them left(!)aligned:
\\setupitemize[align=right]
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
      all.push(`\\blank[6cm]`);
      all.push(`\\startalignment[center]`);
      all.push(`{\\tfd ${this.uncode(this.style,mytitle)}}`);
      all.push(`\\blank[2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,myaddr)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,myauthor)}}`);
      all.push(`\\blank[0.2cm]`);
      all.push(`{\\tfa ${this.uncode(this.style,mydate)}}`);
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
      if(block.name=='part' || block.name=='chapter'){
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
        title = this.uncode(this.style,title);
        let partnum = style.partnum;
        let chapnum = style.chapnum;
        let pagenum = style.pagenum;
        if(block.name=='part'){
          label = label||`part.${partnum}`;
          all.push(`Part ${partnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`);
        }else if(block.name=='chapter'){
          label = label||`chapter.${chapnum}`;
          all.push(`~~~~${chapnum} ~ ${title}\\hfill\\goto{${pagenum}}[${label}]`)
        }
      });
      all.push(`\\stoplines`);
      all.push(`\\stopstandardmakeup`);
    }); 
    return all;
  }
  to_part_page(title,style){
    return `\
\\dontleavehmode
\\startalignment[center]
\\blank[6cm]
{\\tfa Part ${style.partnum}}
\\blank[1cm]
{\\tfd ${this.uncode(style,title)}}
\\stopalignment
\\stoppart`;
  }
}
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewBiochem };
