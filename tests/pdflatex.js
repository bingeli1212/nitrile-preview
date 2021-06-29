const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewPdflatex } = require('../lib/nitrile-preview-pdflatex');
const utils = require('../lib/nitrile-preview-utils');

var work = async (fname)=>{
  const parser = new NitrilePreviewParser();
  await parser.read_file_async(fname);
  await parser.read_chapters_async();
  const translator = new NitrilePreviewPdflatex(parser);
  var tex = translator.to_document();
  return tex;
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

