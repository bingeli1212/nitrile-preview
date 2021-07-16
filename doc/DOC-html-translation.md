---
title: HTML Translation
doc: page
---

# Issues

- For Radio Buttons and Check Boxes, the ideal solution would've been
  to use Dingbats character U+274D for empty circles, and U+25CF for
  filled radio buttons. But in practice there is a problem that
  U+25CF was being rendered as a very small black circle as opposed
  to a black circle that is the same size as that of U+274D. This
  would have made the list containing a mix of filled and unfilled
  circles looking extremely uncomfortable. Thus the solution to
  show a list of radio buttons and checkboxes is to use the input-element
  of the HTML with its "type" attribute set to either "radiobutton" or
  "checkbox". This presents another problem that the "readonly" attribute
  which is supposed to prevent its status from being changed by user,
  does not work for radio buttons and checkboxes. Thus in order to
  disallow an accidental change of button status all unchecked radio buttons
  and checkboxes are rendered as "disabled", which there is an attribute
  for, and works.

- For SVG Diagram, a dashed line is always drawn using dashed array of "3.0 3.0", and
  its stroke-linecap is always set to "butt". It has been observed that if it is set to
  "round" then the dashed part is too closed together reducing the gap between the
  components.

- For embedded SVG the "id" attribute of a defined element inside the <defs>..</defs>
  element need to have a unique ID string for the entire HTML file.
  It has been observed that if the same ID attribute were used even when these elements
  are defined inside the <defs> element that are in different embedded SVG images,
  the element that appears later will "overwrite" the element that appears earlier.


# The "table" element

The <table> tag is used to create a table. A table is made up of individual
cells which are organized into rows and columns. The individual cells are
defined using the table header cell <th> and table data cell <td> tags. These
tags are contained within a table row element which is defined using a <tr>
tag.

A basic table can be created using the <table>, <tr>, <th>, and <td> tags. The
following is a list of additional table related tags: <caption>, <thead>,
<tfoot>, <tbody>, <colgroup>, and <col>. All of the tags used in a table are
contained between the opening and closing <table> tags.

# The "cellpadding" and "cellspacing" attribute of a "table" element

The "cellpadding" attribute specifies the space between the border of a cell
and the contents of a cell. The value is in pixels.

The "cellspacing" attribute specifies the space between individual cells. It
also specifies the space between the outside border and the cells. The value is
in pixels.

.figure
  HTML & XHTML <table> example using cellpadding and cellspacing.

  ```verbatim{frame}
  <table cellpadding="20" cellspacing="20"
    border="1" summary="stock profits">
   <tr>
    <th colspan="3">Stock Tracker</th>
   </tr>
   <tr>
    <th>Stock Symbol</th>
    <td>MSFT</td>
    <td>GOOG</td>
   </tr>
   <tr>
    <th>Profit</th>
    <td>$723.48</td>
    <td>$1254.58</td>
   </tr>
  </table>
  ```

# The "frame" of a "table" element

The frame attribute specifies which sides of the table's outside border are
visible. Possible values are shown in the following table.

- "void"	The border is not visible.
- "above"	The border is visible on the top side only.
- "below"	The border is visible on the bottom side only.
- "hsides"	The border is visible on the top and bottom sides only.
- "vsides"	The border is visible on the left and right sides only.
- "lhs"	The border is visible on the left hand side only.
- "rhs"	The border is visible on the right hand side only.
- "box"	The border is visible on all four sides.
- 'border"	The border is visible on all four sides.


.figure
HTML & XHTML <table> example using the frame attribute.

  ```verbatim{frame}
  <table frame="hsides" border="3" summary="stock profits">
   <tr>
    <th colspan="3">Stock Tracker</th>
   </tr>
   <tr>
    <th>Stock Symbol</th>
    <td>MSFT</td>
    <td>GOOG</td>
   </tr>
   <tr>
    <th>Profit</th>
    <td>$723.48</td>
    <td>$1254.58</td>
   </tr>
  </table>
  ```

# The "rules" of a "table" element

The rules attribute specifies which rules (borders between cells) are visible.
Possible values are shown in the following table.

- "none"	No rules are visible.
- "groups"	The rules will only be visible between row groups (see <thead>, <tfoot>, and <tbody>) and column groups (see <colgroup> and <col>).
- "rows"	The rules will be visible between the rows only.
- "cols"	The rules will be visible between the columns only.
- "all"	All rules will be visible.

.figure
HTML & XHTML <table> example using the rules attribute.

  ```verbatim{frame}
  <table rules="cols" border="1" summary="stock profits">
   <tr>
    <th colspan="3">Stock Tracker</th>
   </tr>
   <tr>
    <th>Stock Symbol</th>
    <td>MSFT</td>
    <td>GOOG</td>
   </tr>
   <tr>
    <th>Profit</th>
    <td>$723.48</td>
    <td>$1254.58</td>
   </tr>
  </table>
  ```

# The "width" attribute of a "table" element

The width attribute is used to specify the width of the table. The value is in
pixels, or percentage when followed by a percent sign (%). If the value is
specified as a percentage, it refers to a percentage of the available space.

.figure
HTML & XHTML <table> example using the width attribute.

  ```verbatim{frame}
  <table width="50%" border="1" summary="stock profits">
   <tr>
    <th colspan="3">Stock Tracker</th>
   </tr>
   <tr>
    <th>Stock Symbol</th>
    <td>MSFT</td>
    <td>GOOG</td>
   </tr>
   <tr>
    <th>Profit</th>
    <td>$723.48</td>
    <td>$1254.58</td>
   </tr>
  </table>
  ```

# The <colgroup> element

The <colgroup> tag allows structural divisions to be created within a table.
The <colgroup> tag allows styles or HTML attributes to be applied to one or
more columns, all at the same time. If used, place the <colgroup> tag before
any <thead>, <tfoot>, <tbody>, or <tr> tags within the table. Also, if a
<caption> tag is used, the <colgroup> tag should occur after it.

A table may contain more than one <colgroup> tag. The number of columns in a
colgroup is determined either by the use of the <colgroup> tag's span
attribute, or by using <col> tags between the opening and closing <colgroup>
tags.

.figure
HTML & XHTML <colgroup> example using the span attribute to set the number of columns.

  ```verbatim{frame}
  <table border="1" summary="Stock Performance">
   <caption>Stock Tracker</caption>
   <colgroup span="2" width="300"></colgroup>
    <tr>
     <th>Stock Symbol</th>
     <th>Profit</th>
    </tr>
    <tr>
     <td>MSFT</td>
     <td>$723.48</td>
    </tr>
    <tr>
     <td>GOOG</td>
     <td>$1254.58</td>
    </tr>
  </table>
  ```

.figure
HTML <colgroup> example using <col> tags to set the number of columns.

  ```verbatim{frame}
  <table border="1" summary="Stock Performance">
   <caption>Stock Tracker</caption>
   <colgroup>
    <col width="200">
    <col width="300">
   </colgroup>
    <tr>
     <th>Stock Symbol</th>
     <th>Profit</th>
    </tr>
    <tr>
     <td>MSFT</td>
     <td>$723.48</td>
    </tr>
    <tr>
     <td>GOOG</td>
     <td>$1254.58</td>
    </tr>
  </table>
  ```

.figure
XHTML <colgroup> example using <col> tags to set the number of columns.

  ```verbatim{frame}
  <table border="1" summary="Stock Performance">
   <caption>Stock Tracker</caption>
   <colgroup>
    <col width="200" />
    <col width="300" />
   </colgroup>
    <tr>
     <th>Stock Symbol</th>
     <th>Profit</th>
    </tr>
    <tr>
     <td>MSFT</td>
     <td>$723.48</td>
    </tr>
    <tr>
     <td>GOOG</td>
     <td>$1254.58</td>
    </tr>
  </table>
  ```

# Various styling elements

Following are styling elements:

<a> <abbr> <acronym> <b> <bdo> <big> <br> <button> <cite> <code>
<del> <dfn> <em> <i> <iframe>1 <img> <input> <ins> <kbd> <label>
<map> <object> <q> <s> <samp> <script> <select> <small> <span>
<strike> <strong> <sub> <sup> <textarea> <tt> <u> <var>

- <abbr>

  The <abbr> tag allows the occurrence of an abbreviation to be
  identified. The abbreviation is placed between the opening and
  closing abbr tags. Use the title attribute to specify the full
  text of that which is being abbreviated.

  ```verbatim
  <p>The 8th month of the year is <abbr title="August">Aug.</abbr></p>
  ```

- <acronym>

  The <acronym> tag allows the occurrence of an acronym to be
  identified. The acronym is placed between the opening and
  closing acronym tags. Use the title attribute to specify the
  full phrase, or series of words, that the acronym is formed
  from.

  ```verbatim
  <p>The <acronym title="Internal Revenue Service">IRS</acronym> collects
  tax revenue.</p>
  ```

- <var>

  The <var> tag is used to mark a variable or program argument.
  The text is placed between the opening and closing tags.

  ```verbatim
  <p>The user's name is held in the variable <var>$userName</var></p>
  ```
- <button>

  The <button> tag is used to create a button that can contain
  content. The <button> tag can be used with a <form> tag. The
  <button> tag can also be used as a stand alone tag which can
  use a scripting language, like JavaScript, to give it
  functionality.

  ```verbatim{}
  <form action="example_input.php" method="post">
  <p>
   Text: <input type="text" name="texttest" title="test"><br>
   <button type="submit">Send<br>Text</button>
   <button type="reset"><img src="yel.gif" alt="reset"><br>Reset</button>
  </p>
  </form>
  ```

  ```verbatim{}
  <form action="example_input.php" method="post">
  <p>
   Text: <input type="text" name="texttest" title="test"/><br/>
   <button type="submit">Send<br />Text</button>
   <button type="reset"><img src="img.png" alt="reset"/><br/>Reset</button>
  </p>
  </form>
  ```

  ```verbatim{}
  <p>
  <button type="button" onclick="window.location='http://www.web.com'">
  Go To Little Web Hut</button>
  </p>
  ```
