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

var myn = [-5, -4.99, -4.98, -4.97, -4.96, -4.95, -4.94, -4.93];
for(let n of myn){
  let a = Fibo(n);
  console.log(n,a);
}
