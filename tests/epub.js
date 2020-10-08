const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewEpub } = require('../lib/nitrile-preview-epub');
const utils = require('../lib/nitrile-preview-utils');

var work = async ()=>{
  console.log(fname);
  var out = await utils.read_file_async(fname);
  var lines = out.split('\n');
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewEpub(parser);
  parser.read_md_lines(lines);
  const data = await translator.to_epub_document_async();
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

