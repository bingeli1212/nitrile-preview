---
title: CSS Display Property
---

# Table Values

There is a whole set of display values that force non-table elements to behave
like table elements, if you need that to happen. It’s rare-ish, but it
sometimes allows you to be “more semantic” with your code while utilizing the
unique positioning powers of tables.

    div {
      display: table;
      display: table-cell;
      display: table-column;
      display: table-colgroup;
      display: table-header-group;
      display: table-row-group;
      display: table-footer-group;
      display: table-row;
      display: table-caption;
    }

    <div style="display: table;">
      <div style="display: table-row;">
        <div style="display: table-cell;">
          Gross but sometimes useful.
        </div>
      </div>
    </div>
