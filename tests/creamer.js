const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewCreamer } = require('../lib/nitrile-preview-creamer');

var work = async ()=>{
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewCreamer(parser);
  await parser.read_file_async(fname);
  var data = translator.to_document();
  return(data);
};

console.log(process.argv);
const fname = process.argv[2];
console.log(fname);

if (fname) {
  work().then(x => console.log(x));
  setTimeout(function () { }, 1000);
}else{
  console.log("Empty file name");
}

