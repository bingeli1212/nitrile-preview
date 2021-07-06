const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewArticle } = require('../lib/nitrile-preview-article');

var work = async (fname)=>{
  const parser = new NitrilePreviewParser();
  await parser.read_file_async(fname);
  await parser.read_import_async();
  const translator = new NitrilePreviewArticle(parser,program);
  var tex = translator.to_document();
  return tex;
};

console.log('process.arg=', process.argv);
const fname = process.argv[2];
const program = 'pdflatex';
console.log('fname=', fname);

if(fname){
  work(fname).then(data => console.log(data));
  setTimeout(function(){},1000);
} else {
  console.log("empty file name")
}

