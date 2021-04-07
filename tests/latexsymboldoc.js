const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewPdflatex } = require('../lib/nitrile-preview-pdflatex');
const utils = require('../lib/nitrile-preview-utils');

var work = async ()=>{
  const parser = new NitrilePreviewParser();
  const translator = new NitrilePreviewPdflatex(parser);
  let data = translator.to_symbol_doc();
  console.log(data);
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

