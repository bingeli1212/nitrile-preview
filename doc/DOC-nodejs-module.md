---
title: NODEJS Modules
---

# Node.js require.main

Quite late me answer, but i leave it here for reference.

When a file is the entry point of a program, it's the main module. e.g. node
index.js OR npm start, ​the index.js is the main module & the entry point of our
application.

But we might need to run it just as a module, and NOT as a main module. This can
happen if we require the index.js like so:

    node -e "require('./index.js')(5,6)"

We can check if a file is the main module in 2 ways.

    require.main === module
    module.parent === null

Lets say that we have a simple index.js file, that it either console.log() ,when
it is the main module, or it exports a sum function, when it is not the main
module:

    if(require.main === module) {
      // it is the main entry point of the application
      // do some stuff here
      console.log('i m the entry point of the app')
    } else{
      // its not the entry point of the app, and it behaves as 
      // a module
      module.exports = (num1, num2) => {
        console.log('--sum is:',num1+num2)
      }
    }

Ways to check the above condition:

* node index.js --> will print "i m the entry point of the app"
* node -e "require('./index.js')(5,6)" --> will print "--sum is: 11"