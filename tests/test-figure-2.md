---
title: test-figure.md
---

"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum."

```diagram{save:a,hidden}
viewport 5 5
draw (0,0) ~ (5,5)
```

@ figure{label:a}
  GIMP Logos.

  ```combination
  &img(image-gimp.jpg) One 
  &img(image-gimp.jpg) Two
  \\
  &diagram(#a) Three
  ```

The figure is &ref(a).

