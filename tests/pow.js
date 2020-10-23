let Complex = require('../lib/nitrile-preview-complex.js');

function Fibo(n){
  let phi = (1 + Math.sqrt(5))/2;
  let phi2 = (1 - Math.sqrt(5))/2;
  let t1 = new Complex(phi);
  let t2 = new Complex(phi2);
  let c1 = t1.pow(n);  
  let c2 = t2.pow(n);  
  let c3 = c1.sub(c2);
  let c4 = c3.div(Math.sqrt(5));
  return c4;
}

var myn = [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,3.1415926,23.14,11.57];           
for(let n of myn){
  let a = new Complex(n);
  let b = a.pow('i');
  let mag = b.abs();
  console.log(a,b,mag);
}
