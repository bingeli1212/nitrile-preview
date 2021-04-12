'use babel';

const { NitrilePreviewTranslator } = require('./nitrile-preview-translator');
const { NitrilePreviewTokenizer } = require('./nitrile-preview-tokenizer');
const { NitrilePreviewDiagramSVG } = require('./nitrile-preview-diagramsvg');
const const_partnums = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'IIX', 'IX', 'X'];
const const_subfignums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const my_char_widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.6656250, 0.1906250, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 
                        0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.5843750, 0.5828125, 0.5843750, 0.5546875, 
                        1.0140625, 0.6656250, 0.6656250, 0.7218750, 0.7218750, 0.6656250, 0.6093750, 0.7765625, 0.7218750, 0.2765625, 0.5000000, 0.6656250, 0.5546875, 0.8328125, 0.7218750, 0.7765625, 
                        0.6656250, 0.7765625, 0.7218750, 0.6656250, 0.6093750, 0.7218750, 0.6656250, 0.9437500, 0.6656250, 0.6656250, 0.6093750, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 
                        0.3328125, 0.5546875, 0.5546875, 0.5000000, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.2218750, 0.2406250, 0.5000000, 0.2218750, 0.8328125, 0.5546875, 0.5546875, 
                        0.5546875, 0.5546875, 0.3328125, 0.5000000, 0.2765625, 0.5546875, 0.5000000, 0.7218750, 0.5000000, 0.5000000, 0.5000000, 0.3546875, 0.2593750, 0.3531250, 0.5890625, 0.0000000];

class NitrilePreviewPango extends NitrilePreviewTranslator {

  constructor(parser) {
    super(parser);
    this.name='PANGO';
    this.tokenizer = new NitrilePreviewTokenizer(this);
    this.diagram = new NitrilePreviewDiagramSVG(this);
    this.mathmargin = 3;
    this.mathpadding = 2;
    this.imgid = 1;
    this.imgs = [];
    this.enumerate_counter = 0;
    this.my_svgarray_vspace = 3;
    this.flags = {};
    this.ref_map = {};
    this.equation_num = 0;
    this.figure_num = 0;
    this.table_num = 0;
    this.listing_num = 0;
    this.css_id = 0;
    this.def_padding = '0.5ex';
    this.icon_cdigits = ['&#x278a;','&#x278b;','&#x278c;','&#x278d;','&#x278e;','&#x278f;','&#x2790;','&#x2791;','&#x2792;','&#x2793;']
    this.icon_bullet       = '&#x2022;'
    this.icon_nbsp         = '&#160;&#160;'
    this.icon_squareboxo   = '&#x25FB;'
    this.icon_squarebox    = '&#x25A3;'
    this.icon_circleboxo   = '&#x25CB;'
    this.icon_circlebox    = '&#x25CF;'
    this.icon_writing_hand = '&#x270D;';
    this.padding_list = '2em';
    this.margin_p = '1em';
    this.margin_p_inner = '1em';
    this.margin_li = '1em';
    this.margin_li_inner = '1em';
    this.padding_hl = '40px';
    this.padding_ul = '40px';
    this.padding_ol = '40px';
    this.padding_dd = '40px';
    this.padding_hl_inner = '20px';
    this.padding_ul_inner = '20px';
    this.padding_ol_inner = '20px';
    this.padding_dd_inner = '40px';
    this.padding_sub_top = '0pt';
    this.padding_sub_bottom = '4pt';
  }
  hdgs_to_section(title,label,style){
    this.the_block.cairo = this.the_block.cairo||[];
    var shape = {};
    shape.heading = 'section';
    shape.phrases = [];
    this.the_block.cairo.push(shape);
    this.the_shape = shape;
    this.uncode(style,title);
  }
  

}
module.exports = { NitrilePreviewPango }
