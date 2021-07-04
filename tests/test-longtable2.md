---
title: test-longtable.md
---

"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum."

.longtable
&label{mytable}
This is the caption for my long table.

  ```tabular{halign:l l l,hrule: ,vrule:|||}
  |     | Name  | Desc
  ----------------------
  | 1   | Hello | World
  | 2   | Hello | World
  | 3   | Hello | World
  ----------------------
  | 4   | Hello | World
  | 5   | Hello | World
  | 6   | Hello | World
  | 7   | Hello | World
  | 8   | Hello | World
  | 9   | Hello | World
  | 10  | Hello | World
  ```

See table &ref{mytable}.


