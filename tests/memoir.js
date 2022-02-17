const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewMemoir } = require('../lib/nitrile-preview-nimemoir');
const utils = require('../lib/nitrile-preview-utils');

var work = async ()=>{
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewMemoir(parser,program);
  await parser.read_file_async(fname);
  
  var data = translator.to_document();
  return(data);
};

console.log(process.argv);
const fname = process.argv[2];
const program = 'pdflatex';
console.log(fname);

if (fname) {
  work().then(x => console.log(x));
  setTimeout(function () { }, 1000);
}else{
  console.log("Empty file name");
}

