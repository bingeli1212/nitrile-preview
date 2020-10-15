const { NitrilePreviewParser } = require('../lib/nitrile-preview-parser');
const { NitrilePreviewPage } = require('../lib/nitrile-preview-page');
const utils = require('../lib/nitrile-preview-utils');

var work = async ()=>{
  const parser = new NitrilePreviewParser();
  await parser.read_file_async(fname);
  const translator = new NitrilePreviewPage(parser);
  var data = translator.to_page_document();
  console.log(data);
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

