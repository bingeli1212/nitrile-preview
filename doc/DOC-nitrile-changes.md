---
title: Nitrile Changes
---

- [ ] Allow configure the width of figure/table/listing to something other than
  the full page width.
- [x] Figure out how to do "gather" or "gather*". One way to do it is to check
  the alignment of the first equation. Thus, the Tokenizer.toMathSvg() should
  also return another flag in addition to "shiftdist" such as "aligned", in
  which case it is set to 1 when a & is detected. It can also return 2 or more
  if more & is detected.
- [x] Try to implement using double-backslash \\ for splitting an existing
  equation into multiple lines, and they should be
  \begin{equation}\begin{split}...\end{split}\end{equation}. The LATEX will
  ensure that it is right-aligned if no & is found, and aligned to the & if
  there are. This would also solve the problem of only assign a single equation
  number for each $-block. 
- [x] Implement \sfrac{1}{2} which is the command provided by "xfrac" package.
- [x] to fix the \begin{align} ... \end{align} 
- [x] Reimplement do_verb using \begin{tabbing} so that it can be in two column
  mode
- [x] Place all stacked equations into a larger SVG
- [x] Use G-element for shrinking the inner SVG.
- [x] For wide-listing, use a custom-float in wide mode, and to add a new
  config-option that will split a long listing into multiple individual floats,
  each with a 1/2, 2/2, etc as part of its caption text
- [x] Eliminate the ILST and expand the DLST to include **|* so that the first
  one is used UL and second for DL. Also change it so that it recognizes
  various components, such as ${..}, {..}, {{..}}, ``..``, `..`, etc. It should
  also be smart so that for LATEX if the key-component is a math, which cannot
  be placed inside an \item, then it should use a UL.
- [x] Need to find a way to optionally include libertine because if the user
  has used a different document class such as Koma-series then there is no need
  to include libertine
- [x] The do_frmd for LATEX does not work after font is changed
- [x] Consider merging neighboring PLST blocks, and allow no vertical margins
  between consecutive list items.
- [x] For HTML, rather than hard code font size, use a span-tag and define a
  class name for it, so that stylesheet can define its size. Instead of using
  font-family, we should use tt-tag instead. 
- [ ] Allow EPUB creation to specify a different CSS stylesheet that is not
  connected directly with the source document. Maybe a switch or something
- [x] Add a class type FSCAP for all fig caption text
- [x] Use { ... } syntax for specifying options for all Diagram-API, for
  label.* command see if the text can be set else as a separate option before
  this command is invoked
- [x] circle.fill and circle.area
- [x] Change the longtable designator back to (&). Should use a convension
  parentheses as multiple paragraph 
- [x] The do_csvd is currently broken on all THREE
- [ ] Need to change do_csvd to rows instead of cols.
- [x] circle.fill, circle.draw, circle.area 
- [x] circle {start:90;stop:120}  The original order is [radius, angle1, and
  angle2]
- [x] Need to change drawanglearc operation
- [x] Add more fonts that cover the Unicode U+2717 "BALLOT X"
- [ ] Implement a binary that would return 1 to a Unicode font code point that
  is current covered by the internal fontmap.
- [x] Make sure to add class='xxx' to all blocks not just the selected few
- [x] Change CSVD to TABU
- [x] See if we can use \startparagraph for typesetting TABB block in CONTEX
- [x] For processing a standalone document that has its "root" pointing to
  another document, then the current document should appear as a chapter, or
  section or that 
- [ ] implement the ruby items as a JS Map object and check for duplicates
- [x] Add a way to insert an image in its native size.
- [x] Change the cartesian.a command so that the text and justi comes from its
  own style options rather than from the global 'label' and 'justi' options
- [x] Fix all Diagrams that are broken in Math*.md file after the last changes
  in Diagram
- [x] Compass and StraightEdge does not work and shows up as black blocks in
  math-bisecting.md, this shows up for both LATEX and COnTEX
- [ ] Use the comment-tag for row1 and row2 in HTML, such that when a MD file is
  only to remove some white spaces this would have shown up as the only thing
  that is changed
- [x] Find a quick way to generate an inilne image that is the result of a
  Diagram: so far the available ones are \xyplot{} and \vbarchart{}
- [ ] Standardize the cartesian.setup and barchart.setup so that they all just
  represent origin and width, and use other command to set the other
  attributes, such as cartesian.xrange, cartesian.yrange, etc
- [x] Redefine PICT block format so that it consists only a n-by-m grid, rather
  than
- [x] Get rid of labelgapx/labelgapy, and setup new options such as dx: dy: to
  set the additional space for label
- [x] Add \( .. \) and \[ ... \] 
- [x] Rename all cartesian.text.* to cartesian.label.* command
- [x] Separate translation engine from parser
- [x] change so that the third argument to cartesian.xplot/yplot is to indicate
  the gap for each grid
- [x] For html, the math-coordinate-system.md file shows the two images side by
  side where the first one takes way too much space
- [x] Remove the logic of treating a single `` .. `` TEXT block as a MATH
  block,
- [x] Adding smooth_for_diag for latex and context. and ensure it is called for
  when generating label text for Dialog, and also when generating styled text
  for VAR
- [x] Only fontify above 255
- [x] Implement a loop for DIagram
- [x] For variables and dialog texts, ensure that when processing `A_0` the
  digit is not be followed by another word char
- [x] After the latest txt,ts change, ensure that all calls to label.* command
  where text labels are broken into multiple segments such as
  "``A_0``\\``B_0``\\``C_0``" are taken cared of.
- [x] Need to change so that all test scripts would pass the 'parser' as the
  constructor in each translator class
- [x] Change that for & they are both column-based, this allows an additional
  column to be easily added or mored. Thinking about changing (&) to && instead
- [x] Define a syntax that would express a range of scalar values that could be
  used in a scalar centric command such as cartesian.yplot cartesian.yplot
  {f:P} 1:4:10
- [x] Solve the problem of current empty long table entries are not allowed,
  such that for a (&) with emtpy contents are not recognized
- [x] Need to implement how to dynamically load the external image files
  specified in the translated HTML
- [x] The latest changes in localx/localy: for p_rect the w/h should be scaled
  at the Diagram level, check the bezier curve correctness display when refs is
  set to 0.5; scale circle r; 
- [x] Change all calls of readCoordsLine() to read_action_coords() in Diagram
- [x] Scale all dist by this.scaledist()
- [x] For all shapes, when reading a path to coords, make sure to scale the
  point but do not translate them
- [x] Getting ready to deprecate the * as the last coordinate. All path must be
  specifically set by the 'path' command
- [x] Implement \colorbox in HTML
- [ ] Add the capability to allow for user to specify raw CSS style to applied
  to each block 
- [ ] SVG math, for f_y(x) the space between the subscript y and the left paren
  is too wide
- [x] For PICT block, the LATEX and CONTEXT would have reduced the image to
  half the page width if the {grid:2} option is set. However, for HTML it is
  still as wide as the page, I belive this is because we use TABLE element to
  layout. It should use grid layout instead. However, the grid layout is
  probably not supported by iBOOK because it is pretty new. Consider simply set
  the parent element to white-space:pre, and then set each child element's
  widht attribute to the correct percentage settings. Inter-row elements would
  have to add an extra <br/>
- [ ] Work on adding more symbols
- [ ] add textcomp symbols
- [ ] Allow an image to be drawn on top of a Diagram
- [ ] try to see if we can scroll to specific lines of a paragraph
- [x] For test-text.md, running nip  the \ref{first} is broken
- [ ] Create a \font{} command for placing text in a different font
- [ ] Try to move the polish and unmask to be inside the translator so that the
  target translator engine do not have to remember which one to call.
- [x] change the @xyplot, @barchart and @colorbox so that the width and height
  info is the second and third argument.
- [x] Work on combining PLST > SAMP > PLST blocks
- [ ] Set the default font size for all labels
- [ ] Try to implement clipPath for Diagram
- [ ] Change the signature of scatterpoints() so that the beginning and end are
  described by a path variable
- [x] Deprecate all allpoints and somepoints path functions
- [x] Process the TEXT block with ``` ... ``` delimeters in it
- [ ] Run math-all.md and math-levelone.md to ensure all the SAMP blocks are
  alright, because of recent change to *always* asking for 4-spaces 
- [ ] Allow for LONG, and DATA blocks to be able to have captions
- [ ] Change the SAMP block to be a normal text block that calls the
  to_verbatim()
- [ ] fix all the 'step' config para
- [ ] Changes so that for the 'foreach' command it is to be ended by a  'end'
  command
- [x] The linecap and linejoin needs to be verified to work correct on context
- [x] change all &midpoint() call to include the '&' in the argument
- [x] change it so that ~~~ is allowed to have empty lines
- [x] Need to figure out how to do equation using ```math
- [x] work on having read_para() return a single MATH block with items
- [x] work on reworking all do_math() method to look for 'items' member
- [x] work on reworking all do_samp() method to look for 'body' member
- [x] work on creating a new method do_prim() for all PRIM types
- [x] work on not using 'text' member in all do_() methods
- [x] work on parsing PRIM, creating 'hdgn', 'title' and 'body' 
- [x] work on using 'hdgn' for HDGS and 'title' for the title text
- [x] work on writing the parse_plitems_for_math() function
- [x] work on changing 'do_part' to use 'title' instead of 'text'
- [x] Change to_cols() so that the input is a single list and {n:2} denotes how
  many columns to use
- [x] work on 'foreach' command so that the range would also work for [0:0.2:1]
- [x] work on the format of &img{...} to be a 'style' so that it is
  &img{src:tree.png;width:2in;height:2in}, need to change all do_img() to
  to_img() and work on the argument which is an object
- [x] For to_itemized() when n=2 or more the code that handles it needs to be
  re-written in the way that a to_cols() is
- [x] Changed so that an additional <div> is to be inserted that shows the
  row1/row2 rather than having it be part of 'to_attrs()'
- [x] Change @-Equation so that it needs to have a leading-$ in each equation
  as well.
- [x] Changed the parser so that the MATH block is converted to a TEXT block
  with 'math' cluster
- [x] change do_* to to_*
- [x] draw (0.4,1)..(0.9,1.5)..(0.6,2)..(0.1,1.5)..(0.4,1)
  (0.4,1)..(0.35,0.66)..cycle ()(0.45,0.33)..(0.4,0)
- [ ] define a new shape command to create a new shape
- [ ] The to_multi() is broken in CONTEXT
- [ ] Need to implement fillclipath Diagram command in CONTEXT
- [ ] Figure out a exclusive-clipath 
- [ ] Need to implement "float:right" in fence_to_diagram() in CONTEXT
- [ ] Need to implement "float:right" for para_to_tabulate() in CONTEXT
- [ ] Need to create a node_to_article_document()
- [ ] Need to create a local nitrile.cfg file to contain all configuration
  settings for all locales
- [ ] Need to add node_to_report_document()
- [ ] Need to rework the way how master document is importing sub-document,
  using the "title" and "label" of the FRNT block
- [ ] Redone nihtml, nixhtml, and niepub, and when does it, ensure to add a
  <style> section to style the ul.PLST.TOP, ol.PLST.TOP, and dl.PLST.TOP > li
  item so that it has some vspace before and after
- [ ] For mathit use the 'italic' style rather than the other font to see if it
  fixes the \(P\) problem where part of the P was disappearing
- [x] Turn para_to_tabulate() to a ```tabulate
- [x] fix the do_edge so that the noderadius is dependent on each node itself
- [ ] explore the possibility that a node can be a square or rectangle
- [x] For nihtml and hislide, use "html.font-family" and "html.font-size"
- [x] Similar to to_plst_ispacked() method, define another one for
  to_plst_bullettype() that returns a triangle shape or other type different
  nesting level for slides
- [x] Rewrite the slide.js so that each multiply solution or multiple choice
  should be placed in a separate slide
- [ ] For mathit-Y and sort, add another field in math.json so that the
  resulting SVG is wider
- [x] Change the equation to be so that it only deals with one math.
- [x] Set up a translator-wide this.refmap which is to be used by all
  sub-translators to look for label -> idnum and style -> idnum
- [ ] For latex.js the do_starttranslate() function would need to setup for the
  fontmap. This is the only place do_starttranslate() is useful.
- [x]  Need to build a cross-ref table for to-ref in HTML
- [x] Need to build a corss-ref table for to-ref in LATEX
- [x] Need to build a cross-ref table for to-ref in CONTEXT
- [x] The math fences in HTML is broken, such as lceil and rceil
- [x] Redo niepub
- [ ] Implement a 'm:2' option for fence_to_tabulate() so that a long table is
  to be split into parallel two tables laid side-by-side
- [x] The vmatrix, and Vmatrix is broken for HTML
- [x] Fixed autoruby for ALL
- [ ] long table and regular table borders are not working for CONTEXT (see
  test-float.md)
- [ ] CJK in context is not working
- [x] Consider using longtabu 
- [x] Do the same border:1 trick for LATEX longtable
- [ ] Working on defining l/c/r adjustment for table columns, including
  tabulate and longtable
- [x] Get rid of the parser.translate() function, and the default parser.block
  referened by other programs
- [x] Add the para_to_verse back
- [x] Change so that setting the Notes is done by each translator
- [x] See if within this.smooth it is possible to "join" lines that has been
  split by a newline character is to be "removed" of the newline character and
  thus, for CJK characters in HTML setting there is no "gap" between characters
  and they are still being "broken" into lines by the browser without problem.
- [x] In LATEX, the smooth() function should be defined to also substitute all
  UNICODE greek letters such as φ by the corresponding symbol, such as
  '\phi'---this allows one to have Unicode version of these characters in an
  Editor window but would be then converted into ASCII symbol entities which
  would work on all locales of latex, this would allow for a Unicode ≠ character
  to appear as ``$\neq$`` in LATEX. NOTE: this substitution can only happen inside
  'smooth()' function as we know that it only deals with plaintext
- [x] For a DS, if the first one is a \w and the last one is a colon, then the
  whole thing should be italialized and the last colon should not be
- [ ] Need to come up with a way of assigning HTML entities to each math
  variant, such as ``&Pscr;`` is for \mathcal{P} and ``&pscr;`` is for
  ``\mathcal{p}``
- [ ] Create FRNT settings for tabulate, longtable, multi, itemized, such as we
  can set the border:1 for all tabulate or longtable, etc.
- [x] Figure out a way to insert custom code in HTML for Peek, the original way
  of using to_info() is not work if EPUB is to be generated
- [x] Implemented this.ammend_saveas() in translator so that it also adds
  'saveas' field to the refmap, which can then be referenced by phrase_to_ref()
  during translation---this means the translator.translator() needs to be
  called again
- [x] Remove the argument to this.translate() and this.identify() of translator
- [ ] css for idnum
- [x] Expanded the &img{} so that it can also be used to create a diagram as in
  &img{href:#myid} where 'myid' is a note of the current document
- [x] Fix the scroll problem in peek
- [x] Fix the &img{frame:1} for Latex and Context
- [x] Remove height-style and add aspectratio-style
- [ ] For beamer.js and slide.js, if "Answer" does not have a "body" then the
  solution slide does not include the text from the main slide
- [ ] Design @include and @input
- [x] Remove {n:} processing for para_to_itemize() and add {n:} to
  para_to_verse()
- [x] Add a new &frac{...} phrase
- [x] Distinguish between PRIM and HDGS blocks for multiple choices and
  multiple solutions
- [x] Add &sfrac{...}
- [x] Add &sup{...}
- [x] Add &sub{...}
- [ ] Figure out how to do a "long-division' using the long-division Unicode
  U+27CC
- [x] Add another field to each symbol such that if it is set then extra spaces
  are added to the entire math-svg if this symbol is at the rightmost location,
  this will take care of \mathcal{L}
- [x] Replace foreach (x,y) [1,2,2,3] with foreach [x,y] [0,2,2,3]
- [x] Force the diagram or image to take a 100% width inside a 'sides"
  paragraph block
- [x] Removed the * for PLST and now treat it as 'enumerated'
- [x] Continue the * counting across slides
- [ ] For math, use a different way for log-like symbols such as \log, \deg,
  because some of them might run into name clashes with entity-symbols such as
  ``&deg;`` one solution could be to use @log for expressing it, the latex
  translation could be \operatorname{log} which would amount to the same thing
- [ ] Prepare to deprecate the 'var' command, the environment symbol will
  replace it
- [ ] try to see if we can create a "tabulate" as a SVG image thus it can zoom
- [x] Change the fillclipath command so that the 'clipath' attribute separates
  the path by spaces rather than comma
- [x] Implement &circleclip{center,r,center2,r2} for returning a new path
  showing the remains of the second circle after being clipped away from the
  first circle, can test with the set operation, math-class-611.md
- [x] Need to implement a *rectangleminuscircle" and "rectangleminusrectangle"
  to create a new path with holes in them
- [x] Style it so that the nested PLST gets smaller font size
- [x] When side by side mode is on the width:100% on CONTEXT just does not
  work, the width of the image needs to be exactly the width of the side
- [x] Diagram:do_reset will take an argument that is 'o'
- [ ] Allow CONTEXT to process CJK
- [ ] Create path function that is &basket{}, &apple{}, &radical, &
- [ ] Try to deprecate the fillclipath command as it isn't supported by
  metapost
- [x] Change it so that @ only provides caption, the label will be provided as
  part of the style-option---as the result the Figure, Table, Longtable,
  listing, and Equation is no longer needed, as it is implied by the ~~~imgrid,
  ~~~tabulate, ~~~longtable, ~~~verbatim, and ~~~math, 
- [x] The "note" section is to be provided by the % block
- [x] Add support of para_to_equation(), para_to_table(), para_to_listing, and
  para_to_figure() in CONTEXT translation
- [x] Need to add support for importing chapters, sections, etc.
- [x]  The aspectratio: needs to be applied to PNG files as well
- [x] Rename this.string_to_latex_length() to this.string_to_latex_width()
- [x] Rename this.string_to_context_length() to this.string_to_context_width()
- [ ] \switchtobodyfont[jp]{\ruby{日本}{にほん}人} current doesn't work on
  CONTEXT, the error message says: [ctxlua]:8: attempt to index a nil value
  (global 'unicode')
- [ ] for CONTEXt, rows_to_longtable() would need to look out for {border:}
  attribute to style the table border lines
- [ ] Get the caption to work in all translations
- [ ] Set it so that for four-space-sample feature will have to be specifically
  turned on in the FRNT block
- [x] Ignore the processing if the file name isn't ending with .md
- [x] Add support of CJK for CONTEXT
- [x] The sylinder shape when used with the 'shape' command it will not draw
  appropriately for SVG
- [ ] Explore the possibility of allowing individualized options for draw, such
  as: draw {fillcolor:red} "date" (0,0) {fillcolor:green} "day" (0,1)
- [ ] Change SpacingAndGlyphs to Spacing for lengthAdjust='' and re-adjust the
  width for many characters
- [ ] Need to add to allow for direct Unicode input such as ``&#x2610;`` in the
  text - this is not doable because of LATEX might not have the capability to
  process this Unicode thus it will break if the output is PDFLATEX (X)
- [x] Modify the p_arc() methods to add Rx/Ry which will be scaled by the
  this.refsx and this.refsy by Diagram.js before passed the Rx/Ry to the
  p_arc() method defined by each translator engine
- [ ] Need to remove  p_cseg(), p_chord(), p_pie() 
- [ ] For HTML, the li-tag didn't include the nested ul-tag or ol-tag, ...
- [x] Add another font-style-pharse: &tt{...}
- [x] Get rid of rect/circle/ellipse commands - the 'ellipse' and 'rect' seems
  to be alright and not many references to them have been found, and for
  'circle' references have been found to call 'circle.pie' and 'circle.arc',
  both of which can be replaced the presence of path functions such as '&pie'
  and '&arc'
- [ ] Allow a node to also be a box so that the edge could grow out of its
  border
- [ ] Watch out for 'pic' cyclic problem, one way of doing it would disallow
  for any code executed with the 'pic' command to now allow for nested 'pic'
  command to work
- [ ] Need to think of a way to generate MULTI-TOPIC, currently being
  overridden by MULTI-SECTION
- [x] BUG: For ``\(10^{(\log(a))} = a\)`` there is too much space between the left
  parenthesis and the "log"
- [ ] Try to change the superscript and subscript so that they do not increase
  the overall height
- [ ] Add the capability to plot graphs using Diagram such cosh(t)
- [ ] Add a 3D viewing compound command similar to cartesian
- [ ] For Diagram the label command cannot change the color of the label
- [ ] Get rid of the "zoom" for tabulation
- [ ] Add additional methods such as cosh, sinh, etc. ...
- [ ] Get ready to gradually deprecate the 'shape' command because it is
  superseded by draw, fill and stroke and at the same time define some
  additional path function including 'rrect' to create some useful shapes; can
  repurpose the shape command as 'solid' which will generate a 3D solid shape
  such as cone, cylinder, rectangular prism, sphere, pyramid, and cube
- [x] For shapes such as 'circle', 'rectangle', 'cylinder', 'ellipse',
  'polyline', 'polygon', etc., do not "close" the area---the application code
  would need to do it themselves
- [x] Allow fences to be three or more backquotes
- [x] Implement **, ++, and -- to be its own BLOCK type which is to typeset
  tight lists; for -- a textbullet will be generated, for ** a number will be
  generated, for ++ nothing will be generated, all items will be flushed to the
  left edge of the page with the adding of \noindent at the beginning of the
  paragraph
- [x] Get rid of the "indented" text and just any indented block will be
  treated as a "SAMP"
- [ ] For table, listing, figure, diagram, and frame, set it so that the
  'caption' option must be set in order for the caption to be shown, and by
  setting it also make it a float
- [x] Need to implement shade in Context translation
- [x] Change &last to [last], and add last-tag as well
- [x] Ensure that \pmatrix is translated to \begin{pmatrix} in lmath and cmath
- [x] Remove do_BULL() as it has been superceeded by untext()
- [x] Remove 'sides' which can be replaced by 'table'
- [x] Adjust CSS for slide so that topmargin is increased between to 'TEXT'
  blocks
- [x] For HTML the ~~~table does not use 'tabularx'-style if {fr:} attribute is
  present
- [x] Separate table vline and hline
- [x] Allow for specifying l/c/r for table
- [x] Allow for caption of inline-table in latex
- [ ] Allow for caption of inline-table in context (tried but unable to find a
  solution)
- [x] Ensure that caption for table work for HTML See math-class-665.md
- [ ] For # heading, exclude lines that is fullline, but do include lines that
  are indented
- [ ] Need to change the ss_to_table_rows() function to return an object rather
  than the string so that it can have row and text
- [x] Implement a way to draw edge from a node to itself---currently it does
  not work
- [ ] in 'lmath' change all '[' to '\lbrack' and all ']' to '\rbrack'
- [ ] Need to update the para_to_bull() for HTML and CONTEXT for the latest
  addition (LATEX has been updated)
- [ ] Fix all floating figure, table, and other by following the rule of
  style.caption will be used to trigger it. 
- [ ] The last border line for a "table" isn't drawn when "hline:*" is set (for
  HTML)
- [ ] Need to implement the style.vpad and style.head for HTML translation
- [ ] Figure out if it is possible to draw a character stretched over a
  horizontal distance using tikz (SVG is known to be able to do this)
- [ ] Need to figure out a way to combine symbols in LATEX which is claimed to
  be doable by symbols-a4.pdf file, but now knowing how, this will allow for
  adding the ``&checkedbox;`` which will be removed for now because the need to
  include "ifsym" package, which defined many symbols that are defined by
  "waysysym" and "marvosym" packages; there two packages were previously being
  included by it only provides few options they are not being included anymore,
  the "ifsym" package includes much moresymbols, but including "ifsym" when the
  previous two packages are included cause LATEX to generate many "command
  already defined" message
- [x] LargeWhiteSquare is being changed from U+2B1C to U+25A2
- [ ] Need to work on fence using different components of upper/lower/middle
  parenthesis, curly braces, and brackets provided by Unicode fonts---an
  alternative method is to add extra spaces at the top of matrix and at the
  bottom of it so that the stretched fences would be protruding at the top and
  bottom---this is essentially what LATEX does
- [x] Changes so that if the operator is inside a fraction numerator or
  denominator then the compact mode is on
- [ ] [LATEX PROBLEM] When drawing texts using TIKZ, if the alignment is
  center, then when drawing the period "." character the period will appear to
  be centered, rather than at its normal position.
- [ ] Need to implement for CONTEXT so that the "cex" flag in math.json file
  when not present it automatically uses a Unicode that in the field of "html"
- [ ] rename ``&wedge;`` -> ``&and;`` ``&vee; -> &or;``
- [x] Change the way &img{...} is to be expressed, .ie.
  &img{[width:2cm,frame]./tree.png}.
- [x] Changed the way NITRILE style syntax so that it could switch to recognize
  comma as separator instead of semicolons; one possibility would to scan to
  see if a semicolon is present, and if not switches to using comma as
  separators instead 
- [x] [PROBLEM] For PDFLATEX, the inclusion of package
  \usepackage[overlap,CJK]{ruby} seems to run into conflict with the inclusion
  of \usepackage[geometry]{ifsym}. When both packages are included, the
  \begin{CJK*} and \begin{CJK} seems to cause compile errors, the solution is
  to remove the inclusion of "ifsym" and keep the CJK, which is mandatory in
  order to allow for CJK text in PDFLATEX translation
- [x] Need to remove 'ifsym' package so because it conflicts with CJK in
  PDFLATEX translation
- [x] For \sum_{i=0}^{\infty} in display mode, the infinity symbol at the top
  is too far away from the Summation sign
- [x] [FR] For tokenizer.js we need to change how fences are shown by using
  Unicode symbols placing up/down for fences, integral symbol upper half
  U+2320, lower half U+2321, summation upper half U+23B2, summation lower half
  U+23B3
- [ ] [FR] Need to add to slide.js file an option to allow for showing to
  slides side-by-side
- [ ] Make build_ruby_map() a separate function to be called by a translator
  such as latex.js 
- [x] Change the syntax in parser.js for PLST block such that a "full-line"
  will not terminate the first level item
- [x] [FR] For a bull-paragraph the <> should also be recognized to express a
  hanginglist item (this could have difficult implementing it on LATEX) 
- [x] Ensure that 32-bit unicode characters can be processed by smooth 
- [x] Rewrite page.js such that it does not use the presentation.js as the
  template
- [ ] [FR] Implement a path function that would scale(), rotation(), flip(),
  and translate() existing paths, current only the 'scale()' function has been
  implemented
- [x] For math SVG it looks like the outer SVG needs to expand in all four
  directions---the italic-f has some part of its tail sticking outside of the
  left field (switched to using mathit instead)
- [x] Come up with a better syntax for import such that by default only a file
  name by itself means "chapter"
- [x] For tokenizer, the absolute value using vertical-bar seems to not
  working, but using \mid seems to work (this might not be true)
- [x] Swithcing to using longtabu for para_to_multi() because this env breaks
  the table into multiple pages
- [ ] Remove the processing of a single backquote in NITRILE, this could have
  the devastitating effect of accidental introducing of a single backquote via
  copy-and-paste, such as `eth'
- [x] Need to manually draw the arrow head with the color of the line because
  this existing way of using SVG marker-begin and marker-end does not work---it
  does not draw the arrow head in the same color as that of the line
- [ ] [FR] Be able to create (for HTML) a canvas of graph of vertices and edges
  such that the nodes can be dragged around within the canvas and dropped
  anywhere, and the edges will be following the nodes all the time
- [x] [FR] For HTML if a checkbox is drawn then it is also clickable on the
  screen
- [x] [FR] For a bull-paragraph allow a HTML checkbox to be created
- [x] [FR] enhance 'set refxy' to so that each additional arguments also
  aggregate
- [x] [FR] Implement \i and \j for LATEX/HTML translation in math expression
  (already done)
- [ ] Redesign the import using following forms:- [part]("Part 1 -
  Introduction")- [chapter](file://chap1.md)- [chapter](file://chap2.md)-
  [part]("Part 2 - Next Step")
- [ ] [BUG] Need to add sectioning heading to HTML generation, currently the
  sectional heading is disabled because there is no numbering of section
  headings, this makes it impossible to have &ref{} be able to reference any
  sections, need to figure out a way to do that; another option would be to
  simply use the name of the section instead of the number, thus it becomes
  "See section <<Introduction to Programming>> for more information" 
- [x] [BUG] Need to modify paper.js and presentation.js to change it so that
  the check for 'hdgn=part' should be done with 'name=part', 
- [x] Change the syntax of &uri{} so that it expects a "mode" string
- [x] Change the syntax of &ref{} so that it expects a "mode" string, such that
  &ref{#sec1}, &ref{Introduction to Programming} would both have worked
- [x] Need to change the way "unmask" is search for the presence of
  triple-backquote such that the triple-backquote must be present at the
  beginning of a line in order to be valid
- [ ] [FR] For Diagram creating, allow an external image to be used as the
  background
- [ ] [FR] See for tall \pmatrix see if we can use a three-piece parenthesis
  instead of two
- [x] [FR] Try not to increase the height for a subscript and superscript
  because it will make it look different than what latex would've done
- [ ] [FR] Disable of endless nested list in PLST, such that only the toplevel
  list item is recognized, and all other indented paragraphs are treated as
  "attachment text to each list item"
- [ ] [FR] Add another type of paragraph called "nest" that would create nested
  lists
- [x] [BUG] For a math expression ``\(y ∈ G\)`` the \in symbol isn't allocated any
  spaces before and after even though its "op" type is set to 1 in math.json
  file - this is caused because the ∈ symbol was being treated as a text - the
  bug is fixed after a unicode is also searched in the database so that if it
  is an known operator then it is traced back to the actual symbol 
- [ ] [FR] try to watch out for superscript -1, -2, 1, 2, etc, to convert to
  the 'id' in tokenizer.findIdByElement() method
- [ ] [FR] for arrowhead scale the wings a little larger when the line size is
  small and reduce the wings of the arrow when the line size is big
- [x] [BUG] for |*||*|*| the double vertical rules under HTML is not working
  properly
- [ ] [FR] all for a new table style to be defined and assigned a name and to
  become a "named style" such that it can be used to style *all* tables in the
  same source document 
- [x] [FR] Merge fence and phrase into a single entity such that all of them
  are to be processed by the phrase_to_XXX() function
- [x] [BUG] Add the missing parsing of "\\" for "figure"
- [x] [BUG] Update the HTML.js to reflect how the "new" figure with
  subfigure-style is to be used to affect the generating a subfigure but
  otherwise a "normal" figure is to be used, and the n:3 style isn't going to
  be used, instead watching out for a \\ in the input line for manually
  breaking the rows
- [ ] [BUG] For tokenizer.js, the superscript and subscript is not shown
  correctly when its height exceeds 12pt. such as 5/3
- [ ] [BUG] For tokenizer.js, the middle bar for \frac{}{}, and the top bar for
  \bar{} is not colored same as the font color if the font color is set to blue 
- [ ] [FR] Look into tokenizer.js to ensure a \; would have aligned the decimal
  point like lmath.js does (see math-class-128.md for example) (This would need
  to revisit the math.json file for rewriting all the 'width' information of
  all the digits, equal-sign, \; \, and \. spaces. Note that it seems that two
  \; would have shifted the same width of a single digit; to match what's in
  LATEX, the equal-sign would need to be enlarged;
- [ ] [FR] For tokenizer.js, the \\sqrt needs to be reimplemented using U+23B7,
  and summation symbol using U+23B2 and U+23B3  
- [ ] [FR] Change the path command such that it becomes path.a, or path.a.b.c,
  etc.  (REJECTED because the path command is not an "action" command in which
  way it does not generate outout)
- [x] [FR] Change the way how a straight line is to be specified, which
  requires the use of '~', which is like '..',  
- [ ] [FR] Remove all 'set refx' and 'set refy' commands, and change all to
  'refxy' commands; remove 'reset' command as it is to be superceded by 'refxy
  origin' 
- [ ] [FR] Add a beamer.icon and beamer.ex-icon configuration argument to set
  the icon for normal frame and ex-frame
- [x] [FR] Add options set the text style for label-operation and text-option
  in Diagram to something like bold and italic
- [x] [FR] Change all phrases to be in the form of ``&link([width:4cm]http://www.yahoo.com)``
- [ ] [FR] For a single character try to see if we can draw it centered and not
  length adjusted, this will take care of the problem of textdoublequote and
  textsinglequote being stretched
- [x] [FR] For Diagramsvg.js when drawing literal text it should be implemented
  to use SVG as well much like math text, as not doing so would have seen
  uneven high/low text when mixed with math text drawn at the same y-location. 
- [x] [FR] For PRIM change it to \paragraph and \subparagraph for LATEX.
- [x] [FR] Deprecate NOTE and instead use the 'save' option to save the lines
  of a diagram to a internal buffer and 'pic' would load it back
- [x] [FR] In parser.js change how ~~~ blocks are grouped their lines
- [x] [FR] Add &sup{...}
- [x] [FR] Add &sub{...}
- [x] [FR] Need to change it to &frac{}{} 
- [ ] [FR] Figure out how to implement path modifier of ymirror
- [x] [FR] Change all &rectangle and &roundrectangle so that it only has one
  variation, which is to take a point and a w and h, which could be negative
- [x] [FR] Add an extra g.hints to the style so that it provides extra hint
  such as to set the linedashed, extra line width, and the user choice of
  different color, inhibit the stroking, darker/lighter of the color, etc. This
  will replace the current g.user field, and can be used to be passed to the
  string_to_svg_color(s,user,def='none') function as the replacement for its
  second argument
- [x] [FR] Try to see if there is a different way to do currently what 'rec'
  command does
- [x] [FR] Try to retire the function 'read_action_coords' as there is only a
  few places calling it and it has a conflicting semantic with
  'read_coords_line'
- [x] [FR] Try to rename 'read_action_float' to 'read_floats_line' to align
  with the function 'read_coords_line'
- [x] [FR] Implement the icon "group' for beamer and side
- [x] [FR] Rename 'textpath' to 'slopedtext'
- [x] [FR] Draw an triangle based on the size of three known angles
- [ ] [FR] Change the existing 'clock' directive to 'angledist' and expand the
  current 'angledist' command to include the possibility of having four
  arguments, and change all calling of 'clock' to 'angledist' in MD files (NOTE
  that the angle in current 'clock' directive is clockwise-turn-positive
- [ ] [FR] Allow an edge to appear as Bezier curve just like the 'flow' 
- [x] [BUG] Need to address the fact that currently for CONTEX the DL and HL
  isn't be able to be nested
- [ ] [FR] Define a default type for SAMP such that it can return "framed" or
  others
- [x] [BUG] The node-edge connection seems to not working property when refs is
  set to 0.8. See the test-node.md file
- [x] [FR] Add a new 'set offset' such that it become the default offset for
  all action commands if it does not set its own offset
- [x] [FR] Try to retire the 'refxy' and replace it with the 'offset'
- [ ] [FR] Need to implement the missing p_XXX() functions in diagrammf.js
- [x] [FR] Change it so that NitrilePreviewContex do not inherit from
  NitrilePreviewLatex
- [x] [FR] Rename 'set id' to 'id'; merge 'set origin' and 'set scale' to
  'origin'; 'set scale 1.25' will become 'origin s:1.25'; retire 'var' and
  create a new command 'let' to replace its purpose. These will become
  independent commands just like the 'group' command. Remove the 'reset'
  command and change all instances of calling 'reset' to 'origin reset'; 
- [ ] [FR] For math.json, create a separate column for 'cex'  
- [x] [FR] Change the form of 'var:' property to "ranges:x/1/10 y/2/10 z/2/10"
- [x] [FR] Change the syntax of a 'for-loop' to 'for x:=[0 1 2] y:=[1~10 11 12
  (1/2) (2*3)] z:=[1!9!11] d:=[1~4~10]
- [x] [FR] Change the syntax of a 'let-command' to 'let x := 1+2*2+1'
- [ ] [FR] Change it so that for 'flow' command the anchor point should be
  named 'north', 'south', 'west', 'east', rather than 'n', 's', 'w', and 'e'
- [ ] [FR] Add 'fontweight' attribute
- [ ] [FR] Currently to_outer_svg() is harded coded again using pt. Need to
  allow HTML to change it to using EM
- [ ] [FR] Need to come up with the new symbol of SUM and INT for display sized
  summation and integration symbol.
- [ ] [FR] Need to change the translator such that when untext it always needed
  to look for triple and double fence first
- [ ] [FR] Expand the list of 'mathOperators" section inside math.json to
  include ALL recognized math operators like \times, \div, \equiv, etc. 
- [ ] [BUG] After the recent changes to &diagram{...} and &tabular{...} using
  curly braces it need to be made aware that the style options should've become
  the second argument
- [ ] [FR] Change all \sqrt[3]{a} to \root{a}{3} inside a math
- [x] [BUG] Change all ~~~list to ```list
- [x] [FR] Change the replacement in a string in Diagram to look like a ${str}
  rather than \str, this would have prevented some texts in a math string such
  as label "\text{...}" where \text could be mistakenly treated as a candidate
  and replaced if "text" is an environment variable
- [ ] [FR] Change the HTML.js, LATEX.js, and CONTEX.js so that the do_phrase()
  is to be replaced by other calls of do_phrase_XXX().
- [ ] [FR] Rename all calls of fence_to_XXX() to do_fence_XXX(),
- [ ] [FR] Rename all calls of float_to_XXX() to do_float_XXX().
- [x] [FR] Rename all calls of do_HDGS(), do_PLST, do_PRIM, do_PARA, and others
  to do_block_HDGS(), do_block_PLST, do_block_PARA(), and do_block_PARA(), 
- [x] [FR] Need to add the new built-in function if(x>10,1,0)
- [x] [FR] Change all directives to the form of ``<map:f>`` or ``<keep:f>``
- [x] [FR] Ensure that more than one directives can be specified and applied in
  the reverse order in which they appear
- [x] [FR] Change the form of a environment variable inside the command line to
  be '${a}' or '${b}'
- [x] [FR] Change all appearances of array to '@a', '@b', etc
- [x] [FR] Add other built-in complex functions such as returning 1/0 for a
  finite number
- [x] [FR] Work on figuring out the entity name for mathrm, mathbf, mathscr,
  and others
- [ ] [FR] Work on figuring out the entity name for subscript 0-9
- [x] [FR] Figure out how to draw a text oriented in any direction
- [x] [FR] Set up clip for a diagram in CONTEX
- [x] [FR] Need to change the way the env variables are being replaced inside a
  Diagram, such that in the new way each occurrences of ${a} would have to be
  scoped up and replaced, even when it might not have been an environment
  variable, in which case it will be replaced with "0"
- [x] [BUG] For do_node and do_edge, it seems to break down when origin s:2 is
  set
- [x] [BUG] The 'fontfamily' and 'fontstyle' in diagrammf.js isn't being
  implemented
- [x] [BUG] The shade for "ball" isn't consistent for some ping-pong balls. See
  test-pingpongball.md
- [ ] [BUG] Need to take care of all the 'img', 'diagram', and 'framed' phrases
  in 'figure
- [ ] [FR] Create a niarticle, nireport, and nimemoir binaries
- [x] [FR] Need to add a column in math.json to specify the font that has this
  glyph
- [x] [FR] Figure out a way to allow a label to a colon, thus making a label
  not part of a style but rather a part of the text itself, or for a @float, a
  part of the header
- [x] [FR] Add the capability to detect whether a list is packed or not in the
  parser, and set it to be fence_to_list() if it is packed; need to change all
  placed where the 'label' is accessed as 'style.label' and change it so that
  it is accessed as block.label
- [x] [FR] Change the this.conf() method to something like
  this.conf_to_string(), which will always only return the first line if there
  are multiple lines, whilst this.conf_to_list() returns a list; this allows
  the subdocuments to have its @label being placed directly as the second line
  of the heading
- [x] [FR] Add hdgs_to_XXX methods so that all subclass can implement
- [x] [BUG] Ensure fontcolor works for cairo
- [x] [FR] Allow an img, a tabular, a diagram, or a framed to have a subtitle
  as well that go underneath, and when so the width can be known, and for img
  the size is to be assume some default - this is not done because they can
  become a subfigure of a figure or table and thus automatically entitled a
  subcaption 
- [ ] [FR] See if a tabular can be made into a picture 
- [ ] [FR] See if a parbox can be turned into a picture
- [x] [FR] Add a new style key named such as "wrap:left" or "wrap:right" that
  would allow for creating of a wrap figure or table. 
- [x] [FR] Change the parser.js so that for consecutive DL keys with no DD
  contents all the keys are placed into an array instead, such that the
  translator will see a list of keys, instead of just a single key.
- [x] [FR] Set is so that if a image width or height isn't specified within a
  figure, then it will be shown max text width 
- [x] [BUG] The "image" command inside a Diagram is not working for EPUB
- [ ] [FR] Use a matrix to capture all the transformations of the current
  "origin"
- [x] [BUG] The "relative points" current didn't undergo the ^sx and ^sy
  transform except for "l"
- [x] [FR] Change trump and lego command into a form that uses period instead
  of dashes
- [x] [FR] Change so that the copy buffer will end whenever a % is encountered
- [x] [BUG] Ensure that the directives of read_coords() and read_floats() can
  also be specified using variables instead of just numbers
- [x] [FR] Changed the "abr" from edge to include up to 3 arg that can be used
  for drawing a hoop for a node as well as a curve line between two nodes
- [x] [FR] Removed "abr" from read_coords() and added a veer-join, 
- [x] [FR] Renamed q-join to qbezier-join
- [x] [FR] Added cbezier-join
- [x] [BUG] Check to make sure that the fontstyle-style and fontweight-style in
  LATEX are working
- [x] [FR] Change the syntax of (#node.1) to (#node:1)
- [x] [FR] Create a syntax to allow for returning the 're' and 'im' part of a
  complex number, so that each part can become part of a command to be plotted
  in a cartesian coord.
- [ ] 




