const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewPango } = require('../lib/nitrile-preview-pango');

var work = async ()=>{
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewPango(parser);
  await parser.read_file_async(fname);
  var data = translator.to_document();
  return(data);
};

console.log(process.argv);
var fname = process.argv[2];
console.log(fname);

if(fname){
  work().then(x => console.log(x));
  setTimeout(function(){},1000);
} else {
  console.log("empty file name")
}

