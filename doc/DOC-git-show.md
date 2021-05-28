---
title: Showing Contents Of Old Contents
---


  git show object
  git show $REV:$FILE
  git show somebranch:from/the/root/myfile.txt
  git show HEAD^^^:test/test.py

For example, to show a particular file in the current 
directory of a given hash.

  git show cab485c8:./your_file.ext 

Show this file that was commited 100 time ago.

  git show HEAD~100:./your_file.ext 




