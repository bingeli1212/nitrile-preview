const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewEpub } = require('../lib/nitrile-preview-epub');
const utils = require('../lib/nitrile-preview-utils');

var work = async ()=>{
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewEpub(parser);
  await parser.read_file_async(fname);
  await parser.read_import_async();
  const data = await translator.to_document_async();
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

