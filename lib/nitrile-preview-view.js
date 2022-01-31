'use babel';

const { Emitter, Disposable, CompositeDisposable, File } = require('atom');
const { NitrilePreviewParser } = require('./nitrile-preview-parser');
const { NitrilePreviewSlide } = require('./nitrile-preview-slide');
const { NitrilePreviewFolio } = require('./nitrile-preview-folio');
const { NitrilePreviewPage } = require('./nitrile-preview-page');
const { NitrilePreviewReport } = require('./nitrile-preview-report');
const { NitrilePreviewBeamer } = require('./nitrile-preview-beamer');
const { NitrilePreviewCreamer } = require('./nitrile-preview-creamer');
const { NitrilePreviewCamper } = require('./nitrile-preview-camper');
const utils = require('./nitrile-preview-utils');
const fs = require('fs');
const JSZip = require('jszip');
const path = require('path');
const pjson = require('./nitrile-preview-config.json');

class NitrilePreviewView {


  constructor(data) {

    /// initialize members
    this.re_book_flags = /^\:\s+(\w+)\s*\=\s*(.*)$/;
    this.re_book_files = /^(\>{1,})\s+(.*)$/;
    this.element = document.createElement('div');
    this.element.classList.add('nitrile-preview');
    this.element.style.overflow = 'scroll';
    this.parser = new NitrilePreviewParser();
    this.editor = null;
    this.new_editor = null;
    this.path = '';
    this.lines = [];
    this.innerHTML = '';
    this.filemap = new Map();
    this.imagemap = new Map();
    this.chaps = [];
    this.row = -1;
    this.column = -1;
    this.zoom = atom.config.get('nitrile-preview.defaultZoomLevel');
    this.openflag = 0;///set to 1 if one of the subdocument is enabled
    this.saveastype = '';
    this.isfullpage = 0;
    this.last_active_pane_item = null;
    this.emitter = new Emitter();
    this.disposables = new CompositeDisposable();
    this.subscriptions = new CompositeDisposable();
    this.subs = [];
    this.scroll_id = 0;
    this.last_saved_file = '';
    this.saveasnames = new Map();

    /// register commands
    this.disposables.add(

      atom.commands.add(this.element, {
        'nitrile-preview:jump-to-editor': (event) => {
          this.jumpToEditor(event);
        },
        'nitrile-preview:show-highlight': (event) => {
          this.scrollHilite();
        },
        'nitrile-preview:open-linked-file': (event) => {
          this.openLinkedFile(event);
        },
        'nitrile-preview:toggle-full-page': (event) => {
          this.toggleFullPage();
        },
        'nitrile-preview:do-reload': () => {
          this.doReload();
        },
        'nitrile-preview:copy-text': () => {
          this.copyText();
        },
        'nitrile-preview:copy-html': () => {
          this.copyHtml();
        },
        'nitrile-preview:to-zoomin': () => {
          this.toZoomin();
        },
        'nitrile-preview:to-zoomout': () => {
          this.toZoomout();
        },
        'nitrile-preview:to-beamer': () => {
          this.toBeamer();
        },
        'nitrile-preview:to-creamer': () => {
          this.toCreamer();
        }, 
        'nitrile-preview:to-slide': () => {
          this.toSlide();
        }, 
        'nitrile-preview:to-folio': () => {
          this.toFolio();
        },
        'nitrile-preview:to-camper': () => {
          this.toCamper();
        } 
      })
    )

    /// register another event
    this.disposables.add(
      atom.packages.onDidActivateInitialPackages(() => {
        this.updateBlocks();
      })
    )

    /// register another event
    this.disposables.add(
      atom.workspace.getCenter().observeActivePaneItem( (item) => {
        this.last_active_pane_item = item;
        if (atom.workspace.isTextEditor(item)) {
          this.editor = item;
          this.setupEditor();
          this.updateBlocks();
        }
      })
    );

    this.disposables.add(
      atom.commands.add('atom-workspace', {
        'core:copy': (event) => { event.stopPropagation(); this.copyText(); },
        'core:move-up': () => { this.element.scrollTop -= document.body.offsetHeight / 20 },
        'core:move-down': () => { this.element.scrollTop += document.body.offsetHeight / 20 },
        'core:page-up': () => { this.element.scrollTop -= this.element.offsetHeight },
        'core:page-down': () => { this.element.scrollTop += this.element.offsetHeight },
        'core:move-to-top': () => { this.element.scrollTop = 0 },
        'core:move-to-bottom': () => { this.element.scrollTop = this.element.scrollHeight }
      })
    );


  }

  doReload () {

    /// find the current active editor and set it up
    /// instead
    var item = this.last_active_pane_item;
    if (atom.workspace.isTextEditor(item)) {
      this.editor = item;
      this.setupEditor();
      this.updateBlocks();
    }
  }

  registerEventHandlers (editor) {

    this.subscriptions.add(
      editor.getBuffer().onDidStopChanging(() => {
        if (editor === this.editor) {
          this.ismodified = 1;
          if(atom.config.get('nitrile-preview.liveRefresh')){
            let filename = editor.getPath();
            let ext = path.extname(filename);
            if(ext=='.md'){
              this.lines = editor.getBuffer().getLines();
              this.updateBlocks();
            }else{
              this.lines = [];
              this.updateBlocks();
            }
          }
        }
      })
    );
    this.subscriptions.add(
      editor.onDidChangeCursorPosition((event) => {
        if (editor === this.editor) {
          //if(!this.issaved || !this.ismodified){
          if(1){
            this.row = event.newBufferPosition.row;
            this.column = event.newBufferPosition.column;
            this.doHilite();
            if(atom.config.get('nitrile-preview.autoScroll')){
              this.scrollHilite();
            }
          }
        }
      })
    );
    this.subscriptions.add(
      editor.getElement().onDidChangeScrollTop((event) => {
        if (editor === this.editor) {
          //console.log('onDidChangeScrollTop','event=',event);
          //console.log('getFirstVisibleScreenRow()',editor.getElement().getFirstVisibleScreenRow());
          if(atom.config.get('nitrile-preview.autoScroll')){
            var x    = editor.getElement().getFirstVisibleScreenRow();
            var y    = 0;
            var point = editor.bufferPositionForScreenPosition([x,y]);
            //console.log('bufferPositionForScreenPosition()',point.row,point.column);
            // this.doScrollTop(point.row,point.column);
          }
        }
      })
    );
    this.subscriptions.add(
      editor.onDidSave((event) => {
        if (editor === this.editor) {
          this.path = event.path;
          this.issaved = 1;
          let ext = path.extname(this.path);
          if(ext=='.md'){
            this.lines = editor.getBuffer().getLines();
            this.updateBlocks();
          }else{
            this.lines = [];
            this.updateBlocks();
          }
        }
      })
    );
    this.subscriptions.add(
      editor.onDidDestroy(() => {
        if (editor === this.editor) {
          /// need to check to see if it is the current.
          /// It could happen that when observe new editor
          /// event is received first we would have switched
          /// over to the new editor, and then we will
          /// receive a destroy event for the old editor.
          /// If we don't check we will destroy the newly created
          /// editor.
          this.editor = null;
          this.setupEditor();
          this.updateBlocks();
        }
      })
    );
  }

  query_imagemap_info(src,translator){

    if (this.imagemap.has(src)) {
      var [imgbuf, mime] = this.imagemap.get(src);
      var imgsrc = `data:${mime};base64,${imgbuf.toString('base64')}`;
      var imgid = '';
      return {imgsrc,imgid};
    }

    var imgid = translator.get_css_id();
    console.log(`load image from file: ${imgid}, ${src}`);
    var fsrc = path.join(this.dirname(), src);
    utils.read_image_file_async(fsrc)
      .then(data => {
        this.imagemap.set(src, data);
        var [imgbuf, mime] = data;
        var node = document.querySelector(`#imgid${imgid}`);
        if (node && node.tagName=='img') {
          node.src = `data:${mime};base64,${imgbuf.toString('base64')}`;///TODO: harded coded to PNG,
          console.log(`replaced img node with datauri: ${node.src.substr(0,80)}...`);
        }else if(node && node.tagName=='image'){
          node.href = `data:${mime};base64,${imgbuf.toString('base64')}`;///TODO: harded coded to PNG,
          console.log(`replaced image node with datauri: ${node.src.substr(0,80)}...`);
        }
      })
      .catch(err => console.error(err))

    var imgsrc=fsrc;
    imgid = `imgid${imgid}`;
    return {imgsrc,imgid};
  }

  __requestImage (src) {


    if (!src) {
      return;
    }

    if(!this.imgid){
      this.imgid = 1;
    }else{
      this.imgid += 1;
    }

    if (!atom.packages.hasActivatedInitialPackages()) {
      return;
    }

    if ( this.imagemap.has(src) ) {
console.log(`load image from imagemap: ${imgid}, ${src}`);
      setTimeout( () => {

        if (this.imagemap.has(src)) {
          var [imgbuf,mime] = this.imagemap.get(src);
          var node = document.querySelector(`img#nitrileimg-${imgid}`);
          if (node) {
            node.src = `data:${mime};base64,${imgbuf.toString('base64')}`;///TODO: harded coded to PNG,
          }
        }

      }, 0);

    } else {

console.log(`load image from file: ${imgid}, ${src}`);
      var fsrc = path.join(this.dirname(),src);
      utils.read_image_file_async(fsrc)
        .then( data => {
            this.imagemap.set(src,data);
            var [imgbuf,mime] = data;
            var node = document.querySelector(`img#nitrileimg-${imgid}`);
            if (node) {
              node.src = `data:${mime};base64,${imgbuf.toString('base64')}`;///TODO: harded coded to PNG,
            }
        })
        .catch( err => console.error(err) )

      /// add file watch

      if (!this.filemap.has(fsrc)) {
///console.log(`add image ${fsrc} to watch`);
        var file = new File(fsrc);
        this.filemap.set(fsrc,file);

        this.subscriptions.add(
          file.onDidChange( () => {
///console.log(`image ${fsrc} changed`);
              this.imagemap.delete(src);
              this.refreshView();
          })
        );
      }

    }

  }

  doScrollTop (row,column) {

    var isscroll = 0;
    if(1){
      var node = document.querySelector(`[data-row='${row}']`);
      if (node) {
        //console.log('node',node);
        //console.log('calling scrollIntoView')
        node.scrollIntoView(true);//scroll so that the top of the element aligns with the top of the view
      }
    }
    if(0){
      ///do not scroll the preview because of the source
      ///it could "scroll" to hilite if so choose
      var the_i = 0;
      var nodes = document.querySelectorAll(`[data-row]`);
      for(var i=0; i < nodes.length; ++i){
        var node = nodes[i];
        if(row == node.getAttribute('data-row')){
          the_i = i;
          break;
        }else if(row > node.getAttribute('data-row')){
          the_i = i;
          continue;
        }else{
          break;
        }
      }
      if(the_i && nodes.length){
        var node = nodes[the_i];
        //console.log('row',row,'node',node);
        //console.log('calling scrollIntoView')
        node.scrollIntoView(true);//scroll so that the top of the element aligns with the top of the view
      }
    }
  }

  doHilite() {
    var row = this.row;
    var node = document.querySelector(`[data-row='${row}']`);
    if(node){
      //console.log('row',row,'node',node);
      //console.log('calling scrollIntoView')
      if(this.hilite_node && this.hilite_node===node){
        //nothing
      }else if(this.hilite_node){
        this.hilite_node.style.outline = '';
        this.hilite_node = node;
        node.style.outline = '2px solid orange';
      }else{
        node.style.outline = '2px solid orange';
        this.hilite_node = node;  
      }
    }else{
      if(this.hilite_node){
        this.hilite_node.style.outline = '';
        this.hilite_node = null;
      }
    }
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Nitrile Preview';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://nitrile-preview';
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'right';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['right'];
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      deserializer: 'nitrile-preview/NitrilePreviewView'
    };
  }

  // called when nitrile-preview window is being destroyed
  destroy() {

    this.disposables.dispose();
    this.subscriptions.dispose();
    this.element.remove();
    this.emitter.emit('did-destroy');

  }

  dirname () {
    /// figure out the dirname of the current editor
    var dirname = path.dirname(this.path);
    if (path.isAbsolute(dirname)) {
      return dirname;
    } else {
      try {
        dirname = atom.project.getPaths()[0];
      } catch(e) {
        dirname = '';
      }
      return dirname;
    }
  }

  getBool (val) {

    ///
    /// given a string, return a boolean value
    ///
    /// getBool("1"); //true
    /// getBool("0"); //false
    /// getBool("true"); //true
    /// getBool("false"); //false
    /// getBool("TRUE"); //true
    /// getBool("FALSE"); //false
    ///

    var num = +val;
    return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
  }

  isEqual ( x, y ) {
    if ( x === y ) return true;
      // if both x and y are null or undefined and exactly the same

    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
      // if they are not strictly equal, they both need to be Objects

    if ( x.constructor !== y.constructor ) return false;
      // they must have the exact same prototype chain, the closest we can do is
      // test there constructor.

    for ( var p in x ) {
      if ( ! x.hasOwnProperty( p ) ) continue;
        // other properties were tested using x.constructor === y.constructor

      if ( ! y.hasOwnProperty( p ) ) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

      if ( x[ p ] === y[ p ] ) continue;
        // if they have the same strict value or identity then they are equal

      if ( typeof( x[ p ] ) !== "object" ) return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

      if ( ! this.isEqual( x[ p ],  y[ p ] ) ) return false;
        // Objects and Arrays must be tested recursively
    }

    for ( p in y ) {
      if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
  }

  updateBlocks() {

    if(this.editor){
      var filename = this.editor.getPath();
      var ext = path.extname(filename);
      console.log(filename);
      console.log(ext);
    }

    this.parser = new NitrilePreviewParser();
    this.parser.read_lines(this.lines);
    this.refreshView();
    
  }
  
  refreshView() {
    
    // This function will call translateBlock() because it will 
    // look for loaded image and then rebuild the HTML to
    // embed the loaded image as data URI

    var html = '';
    if(this.parser.conf_to_string('peek')=='slide'){
      let translator = new NitrilePreviewSlide(this.parser);
      translator.view = this;
      html = translator.to_peek_document();
    }else if(this.parser.conf_to_string('peek')=='folio'){
      let translator = new NitrilePreviewFolio(this.parser);
      translator.view = this;
      html = translator.to_peek_document();
    }else{
      let translator = new NitrilePreviewPage(this.parser);
      translator.view = this;
      html = translator.to_peek_document();
    }

    const { scrollTop } = this.element;
    this.element.textContent = ''
    this.element.innerHTML = html;
    this.element.scrollTop = scrollTop

    this.doHilite();
    if(atom.config.get('nitrile-preview.autoScroll')){
      this.scrollHilite();
    }

    /// save it so that it can be copied to clipboard later
    this.innerHTML = html;
    this.element.style.zoom = this.zoom;
  }


  async openEditorAsync(data) {
    var editor = await atom.workspace.open(data,{pending:true,searchAllPanes:true,activatePane:false,activateItem:false})
    return editor;
  }

  onDestroyed (callback) {

    /// called when this view is destroyed.

    return this.emitter.on('did-destroy',callback);
  }

  openLinkedFile (event) {

    /// open the linked file in editor

    var node = event.target;
    var [node,fName] = this.findFnameNode(node);
    if (node) {
      if (fName) {
        atom.workspace.open(fName,{pending:true,searchAllPanes:true});
      }
    }

  }

  toggleFullPage() {
  }

  findParentHnodeById (node, id) {
    while (node ) {
      var nodeName = ''+node.nodeName;
      var className = ''+node.className;
      var idName = ''+node.id;
      if (className === 'nitrile-preview') {
        return null;
      }
      if (nodeName.match(/^H[1-6]$/) && idName === id) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  findFnameNode (node) {
    while (node ) {
      var nodeName = ''+node.nodeName;
      var className = ''+node.className;
      var fName = node.getAttribute('fName');
      if (className === 'nitrile-preview') {
        return [null,null];
      }
      if (fName) {
        return [node,fName];
      }
      node = node.parentNode;
    }
    return [null,null];
  }

  scrollHilite() {

    /// scroll the preview window so that the selected
    /// node is shown

    var elem = this.hilite_node;
    if (elem) {
      // elem.scrollIntoView({block: 'nearest'});
      elem.scrollIntoView({block: 'center'});
    }

  }

  copyText () {

    /// copy the selected text (if any)

    const selection = window.getSelection()
    const selectedText = selection.toString()
    const selectedNode = selection.baseNode

    // Use default copy event handler if there is selected text inside this view
    if (
      selectedText &&
      selectedNode != null &&
      (this.element === selectedNode || this.element.contains(selectedNode))
    ) {
      atom.clipboard.write(selectedText)
    }

  }

  copyHtml () {

    /// copy the entire HTML

    atom.clipboard.write(this.innerHTML);

  }

  toPage() {


    /// called as a command by 'Save As HTML...'
    this.saveastype = 'page';
    atom.workspace.paneForItem(this).saveItemAs(this);

  }

  toZoomin() {


    this.zoom += 0.10;
    if(this.zoom > 5){
      this.zoom = 5;
    }
    this.doReload();

  }

  toZoomout () {

    /// either to a book or an article depending

    this.zoom -= 0.10;
    if(this.zoom < 0.5){
      this.zoom = 0.5;
    }
    this.doReload();

  }

  toBeamer () {

    /// either to a book or an article depending

    this.saveastype = 'beamer';
    atom.workspace.paneForItem(this).saveItemAs(this);

  }

  toCreamer () {

    /// either to a book or an article depending

    this.saveastype = 'creamer';
    atom.workspace.paneForItem(this).saveItemAs(this);

  }

  toSlide () {

    /// either to a book or an article depending

    this.saveastype = 'slide';
    atom.workspace.paneForItem(this).saveItemAs(this);

  }

  toFolio () {

    /// either to a book or an article depending

    this.saveastype = 'folio';
    atom.workspace.paneForItem(this).saveItemAs(this);

  }

  toCamper () {

    /// either to a book or an article depending

    this.saveastype = 'camper';
    atom.workspace.paneForItem(this).saveItemAs(this);

  }

  findEditorByPath (path) {
    /// try to find amoung active editors for the one
    /// that matches the given path
    for (const editor of atom.workspace.getTextEditors()) {
      if (editor.getPath() && path && editor.getPath() === path) {
        return editor;
      }
    }
    return null;
  }

  jumpToEditor (event) {

    ///NOTE: if the editor is set, then we basically the 'event.target'
    ///which is a HTML Element node reference (see DOM for more information)
    ///Since each DOM node has a nodeName, nodeClass which are the standard
    ///members of the Element class. This gives you the chance to search
    ///DOM for a node up until you have hit the 'nitrile-preview'---this is
    ///the topmost node for our entire app---which means we should not go outside
    /// of this boundary because outside of it is no longer our App.
    /// 
    ///The goal is to search for a node that has the 'rows=' attribute set. 
    /// This is guarentted by the 'translate()' function.
    ///
    ///Once we've found it, we retrieve the 'rows' attribute of this node,
    ///which tells us which block we have clicked on, and this matches back
    ///to the source ID file and the particular line number that has constributed
    ///to this particular block. 
    ///
    ///It is pretty easy to ask the editor to jump to a particular line number
    ///which is to simply call the editor.setCursorBufferPosition().
    ///
// console.log('jumpToEditor')
    if (this.editor) {
      var node = event.target;
      while (node) {
        var nodeName = ''+node.nodeName;
        var className = ''+node.className;
        var row = node.getAttribute('data-row');
        if (className === 'nitrile-preview') {
          break;
        }
        if (row) {
          this.editor.setCursorBufferPosition([+row,0],{'.autoscroll': true});
          //this.editor.focus();
          // this.editor.setSelectedBufferRange(new Range([+row,0],[+row+1,0]));
          return;
        }
        node = node.parentNode;
      }

    } 
  }

  setupEditor () {
    this.lines = [];
    this.path = '';
    this.subscriptions.dispose();
    this.imagemap.clear();
    this.filemap.clear();
    this.saveasnames.clear();
    this.saveastype = '';
    this.row = -1;
    this.column = -1;
    if (this.editor && path.extname(this.editor.getPath())=='.md') {
      this.lines = this.editor.getBuffer().getLines();
      this.path = this.editor.getPath();
      this.row = this.editor.getCursorBufferPosition().row;
      this.column = this.editor.getCursorBufferPosition().column;
      this.registerEventHandlers(this.editor);
    }else{
      this.lines = [];
      this.path = '';
      this.row = 0;
      this.column = 0;
    }
  }

  getPath () {

    /// This function is a required function that must be implemented
    /// as part of an item interface function.
    ///
    /// It is is called by Atom when it needs to find out the
    /// path of the current file.
    ///
    /// It is also called when this.saveItemAs() is called. 
    ///
    /// This function should return a "desired" file name to be saved
    /// such as "myfile.tex" if the current editing document is "myfile.md".
    /// This file name will be shown as the "default" file name 
    /// inside a SaveAs dialog.

    var outname  = '';
    if (this.path) {
      var filename = this.path;
      var rootname = `${filename.slice(0,filename.length-path.extname(filename).length)}`;
      switch (this.saveastype) {
        case 'html':
          outname = `${rootname}.html`;
          break;
        case 'xhtml':
        case 'slide':
        case 'folio':
          outname = `${rootname}.xhtml`;
          break;
        case 'beamer':
        case 'creamer':
        case 'camper':
          outname = `${rootname}.tex`;
          break;
        case 'epub':
          outname = `${rootname}.epub`;
          break;
        default:
          outname = `${rootname}.txt`;
          break;
      }
      if(this.saveasnames.has(this.saveastype)){
        ///retrieve the last saved filename for the same savetype
        outname = this.saveasnames.get(this.saveastype);
        console.log('previous saveas=',outname);
      }
      if (path.isAbsolute(this.dirname())) {
        outname = path.resolve(this.dirname(),outname);
        this.saveasnames.set(this.saveastype,outname);
        return outname;
      } else {
        this.saveasnames.set(this.saveastype,outname);
        return outname;
      }
    }

  }

  async saveAs (savefilepath) {

    /// this function is required as an item interface
    /// function that will be called by Atom after it
    /// has confirmed a save-path with user and it
    /// this function is then called to actually save
    /// whatever needs to be saved to this path.
    
    this.saveasnames.set(this.saveastype, savefilepath);

    try {
      var data = '';
      var datatype = '';

      if (this.saveastype === 'report') {

        const translator = new NitrilePreviewReport(this.parser);
        var data = translator.to_report_document();

        fs.writeFileSync(savefilepath, data);
        atom.notifications.addSuccess(savefilepath + ' saved, '
              + data.length + ' character(s)');

      } 
      else if (this.saveastype === 'page') {

        const translator = new NitrilePreviewPage(this.parser);
        var data = translator.to_peek_document();

        fs.writeFileSync(savefilepath, data);
        atom.notifications.addSuccess(savefilepath + ' saved, '
              + data.length + ' character(s)');

      } 
      else if (this.saveastype === 'beamer') {

        const translator = new NitrilePreviewBeamer(this.parser);
        var data = translator.to_document();

        fs.writeFileSync(savefilepath, data);
        atom.notifications.addSuccess(savefilepath + ' saved, '
              + data.length + ' character(s)');

      } 
      else if (this.saveastype === 'creamer') {

        const translator = new NitrilePreviewCreamer(this.parser);
        var data = translator.to_document();

        fs.writeFileSync(savefilepath, data);
        atom.notifications.addSuccess(savefilepath + ' saved, '
              + data.length + ' character(s)');

      } 
      else if (this.saveastype === 'slide') {

        const translator = new NitrilePreviewSlide(this.parser);
        var data = translator.to_peek_document();

        fs.writeFileSync(savefilepath, data);
        atom.notifications.addSuccess(savefilepath + ' saved, '
              + data.length + ' character(s)');

      } 
      else if (this.saveastype === 'folio') {

        const translator = new NitrilePreviewFolio(this.parser);
        var data = translator.to_peek_document();

        fs.writeFileSync(savefilepath, data);
        atom.notifications.addSuccess(savefilepath + ' saved, '
              + data.length + ' character(s)');

      } 
      else if (this.saveastype === 'camper') {

        const translator = new NitrilePreviewCamper(this.parser);
        var data = translator.to_document();

        fs.writeFileSync(savefilepath, data);
        atom.notifications.addSuccess(savefilepath + ' saved, '
              + data.length + ' character(s)');

      } 

    } catch(e) {

      atom.notifications.addError(e.toString());
      console.error(e.stack);
    }

  }

  _onDidChangeModified (callback) {

    // No op to suppress deprecation warning
    return new Disposable()

  }

  getFileNameAtBookRow (line) {
    var v = this.re_book_files.exec(line);
    if (v) {
      return v[2];
    }
    return '';
  }

}


module.exports = { NitrilePreviewView };
