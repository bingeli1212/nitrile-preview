const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewFolio } = require('../lib/nitrile-preview-folio');

var work = async ()=>{
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewFolio(parser);
  await parser.read_file_async(fname);
  await parser.read_import_async();
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

