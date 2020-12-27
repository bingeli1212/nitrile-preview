---
title: EPUB Generation
---

[ Example package.opf ]

An example "package.opf" file:

    <?xml version='1.0' encoding='UTF-8'?>
    <package xmlns='http://www.idpf.org/2007/opf' version='3.0' xml:lang='en' unique-identifier='pub-id'>
    <metadata xmlns:dc='http://purl.org/dc/elements/1.1/'>
    <dc:identifier id='pub-id'>zwqrwtcablkj6v3a45</dc:identifier>
    <dc:language>en</dc:language>
    <dc:title id='title'>740 - Sequence and Series</dc:title>
    <dc:subject> </dc:subject>
    <dc:creator>James Yu</dc:creator>
    </metadata>
    <manifest>
    <item id='toc' properties='nav' href='toc.xhtml' media-type='application/xhtml+xml'/>
    <item id='stylesheet' href='style.css' media-type='text/css'/>
    <item id='titlepage' href='titlepage.xhtml' media-type='application/xhtml+xml' />
    <item id='0' href='0.xhtml' media-type='application/xhtml+xml' />
    <item id='image0' href='image-clock.png' media-type='image/png' />
    </manifest>
    <spine>
    <itemref idref='titlepage' />
    <itemref idref='0' />
    </spine>
    </package>


[ Navigation file ]

The EPUB3 Navigation file is set by listing this file as one of the 
"items" in the "manifest" section. This item should have its
"properties" attribute set to "nav". In the previous example
this file is "toc.xhtml", and is saved with the archieve.

The "spine" section should list all items that should appear
within EBOOK. this is what user will be seeing and reading
when the EBOOK is opened. This would normally include a
title page, a front matter, and one or more chapters. 
Typically the navigation file should not be part of the
spine, but it is perfectly legal to have it there
being listed, in which case the user will see a "Table of Contents".

All external images that are not part of the spine should
also be listed within the "manifest", with the "media-type" being
correctly set. For PNG file it is "image/png", for a SVG file
it should be "image/svg+xml". For a PDF file it is "application/pdf".
The "read_image_file_async()" function has been implemented to read
a image file content and return a string that is the mime-type.
The returned mime-type is determined by reading the signature
of the input file.

[ paper.js ]

The "paper.js" file contains a JS class "Paper" that is implemented
to return an object that describes the structure of the blocks.
It provides a function named "to_top()" that should be called as 
such,

    let paper = new NitrilePreviewPaper(translator);
    let top = paper.to_top(blocks);

The return value 'top' is a JS array. Its elements will be interpreted
slightly differently depending the presence of parts and chapters.
In particular,

- if there are no parts and no chapters, then it 
  contains single "child" element, which is itself
  a JS array, and which contains
  a list of blocks from the main document.
  If there are sections within this main document, each
  section is to appear as an array.

  ```
  top (array) 
    + block
    + block
    + block
    + section (array) 
      + block
      + block
    + section (array)
      + block
      + block
  ```

- if there are chapters being imported but no parts,
  then the returned value would only contain arrays.
  Each array is to capture each imported chapters,
  except for the first array, which is to 
  capture all blocks
  in the main document. 
  If there are no content in the main document, 
  then the first "anonymous chapter" 
  array will not contain any blocks.

  ```
  top (array) 
    + anonymous chapter (array) 
      + block
      + block
      + block
      + section (array) 
        + block
        + block
      + section (array)
        + block
        + block
    + chapter (array)
      + block (HDGS/0)
      + block 
      + block
    + chapter (array)
      + block (HDGS/0)
      + block
      + block
  ```

- if there are chapters as well as parts, 
  then the 'top' object is to contain only arrays.
  Each array is to capture the imported part, except
  for the first one, which is an anonymous part that
  always contains a single anonymous chapter, which
  contain all the blocks in the main document.
  If there are no content in the main document, 
  then the "anonymous chapter" will still be there
  but it will have zero elements.

  ```
  top (array) 
    + anonymous part (array)
      + anonymous chapter (array) 
        + block
        + block
        + block
        + section (array) 
          + block
          + block
        + section (array)
          + block
          + block
    + part 1 (array)
      + chapter (array)
        + block (HDGS/0)
        + block 
        + block
      + chapter (array)
        + block (HDGS/0)
        + block
        + block
    + part 2 (array)
  ```

When the main document is a master document that imports parts
and/or chapters, the content of the main document will always
be an individual XHTML file that is part of the spine---this
means that the read will likely encounter an empty page after
the title. This intentional, and serve the purpose of allowing
front matter contents to be served in the future, which
should be captured by the main document blocks.



[ Issues and remarks ]

- For MATH blocks with two more equations, EPUB tends to shrink
  the SVG for an formula if that formula has been too wide
  to fit within the boundary of the page. The shrink has been
  kept of their aspect ratio. However, this does raise an issue
  of vertical equations where they should be aligned with their
  "alignment points"---when one of the formula is shrinked it
  is no longer aligned with the neighboring formulas. One possible
  solution is to place them all inside a container SVG, thus
  if the container SVG is shrinked at least all formulas in it
  are kept in relative positions.

- For iBOOK which is on iPAD, first generation, there are several
  problems. First it does not support Unicode characters beyond
  0xFFFF. Thus, an italic variable such as v that is expressed
  by U+1D463 is not going to be shown correctly. Secondly, it
  has trouble position the image inside a <caption> element
  correctly---the image being a <img> element containing an
  embedded SVG. 

- When a SVG is converted to an IMG, with an embedded data URI,
  then the 'currentColor' for both 'stroke' and 'fill' attribute
  of the SVG does not pick up the current color setting of the
  document, and is always the color of black instead.
   
