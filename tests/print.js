const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewPrint } = require('../lib/nitrile-preview-print');
const utils = require('../lib/nitrile-preview-utils');


var work = async (fname)=>{
  var out = await utils.read_file_async(fname);
  var lines = out.split('\n');
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewPrint(parser);
  parser.read_md_lines(lines);
  var width = translator.string_pixel_width('My text ...', { size: 10 });
  console.log('This text is ' + width + 'px long in the size of 10px.');
  var width = translator.string_pixel_width('My text ...', { font: 'impact', size: 10 });
  console.log('This text is ' + width + 'px long in the size of 10px.');
  var width = translator.string_pixel_width('My text ...', { font: 'open sans', size: 10, bold: true, italic: true });
  console.log('This text is ' + width + 'px long in the size of 10px.');
  
  //var data = translator.to_print_document();
  //return(data);
};

console.log('process.arg=', process.argv);
const fname = process.argv[2];
console.log('fname=', fname);

if(fname){
  work(fname).then(data => console.log(data));
  setTimeout(function(){},1000);
} else {
  console.log("empty file name")
}

