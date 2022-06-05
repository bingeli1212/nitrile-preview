% !TEX title = EPUB Generation



# The "package.opf" file

An example "package.opf" file:

    <?xml version='1.0' encoding='UTF-8'?>
    <package xmlns='http://www.idpf.org/2007/opf' version='3.0' xml:lang='en' unique-identifier='pub-id'>
      <metadata xmlns:dc='http://purl.org/dc/elements/1.1/'>
        <dc:identifier id='pub-id'>zwqrwtcablkj6v3a45</dc:identifier>
        <dc:language>en</dc:language>
        <dc:title id='title'>740 - Sequence and Series</dc:title>
        <dc:subject>Math and Science</dc:subject>
        <dc:creator>John Smith</dc:creator>
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

# Navigation file 

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

# Fixed Layout Books

If your book is a picture book or other Fixed Layout book, you must indicate
pre-paginated in the <meta property="rendition:layout"> tag in the <metadata>
element within the OPF file. (See Defining Book Layout Metadata for
instructions.) The pre-paginated option determines how the sample is cut.
Without this option, the sample is cut as if the content is a text-heavy book
like a novel. With this option, the sample is cut based on a percentage of the
number of pages rather than word count. Apple Books determines the first page
of the book (each page of a Fixed Layout Book, whether a single page or a
two-page spread, must be a separate XHTML file) and then cuts the sample from a
percentage of total page count. The sample will look to the Landmarks <nav>
block of the .opf to determine the start of the content of the book. For
optimal samples, include epub:type="bodymatter" to indicate the beginning of
the book's content. Note that a Landmarks nav is required for Fixed Layout
books only if you do not provide a custom sample.

    <metadata xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" > 
      <dc:title>Fixed Layout Book</dc:title> 
      <dc:identifier id="bookid">0123456789</dc:identifier> 
      <dc:language>en</dc:language> 
      <meta property="dcterms:modified">2012-08-15T00:00:00Z</meta> 
      <meta property="rendition:layout">pre-paginated</meta> 
      <meta property="rendition:spread">none</meta> 
    </metadata>


The `redition:layout` defines whether a book is a flowing book or a Fixed
Layout book. Supported values are reflowable (standard Flowing book) and
pre-paginated (Fixed Layout book). This is equivalent to fixed-layout :
true|false in EPUB 2.

    <meta property="rendition:layout">pre-paginated</meta>

The `rendition:spread` expresses the "spread".
Following is an example designating two content documents per spread:

    <meta property="rendition:spread">auto</meta> or <meta property="rendition:spread">both</meta>

Following is an example designating a single content document per spread:

    <meta property="rendition:spread">none</meta>

The `rendition:flow` expresses if there are one or two content documents per
spread. Supported values are auto, both, and none.
Following example designating content documents to be rendered in a continuous
scrolling view from spine item to spine item:

    <meta property="rendition:flow">scrolled-continuous</meta>

Must be defined if your book is to be presented in one continuous scroll
without space or gaps in vertical scrolling mode. (See Vertical Scrolling.)
Otherwise, a book will be presented vertically with space between content
documents.

The `ibooks:specified-fonts` expresses if you book contains embedded fonts.

Tip: You can use the specified-fonts attribute to override a user’s
justification preference. You do not need to use embedded fonts in this
instance. Apple Books provides a preference that a user can choose to display
the text in a book to full justification. This option overrides any text
alignment you specify and justifies all paragraphs in a book, including all
headings. You can preserve your text alignment by using the specified-fonts
attribute and setting it to true. This attribute preserves the font settings as
specified in your CSS stylesheet, as long as the user does not choose a
different font when reading the book. When this happens, the justification for
paragraphs returns to the user preference, but the text alignment for your
headings is preserved. If the user later returns to the “original” font, your
text alignments are respected.

Note: When creating Fixed Layout books in EPUB 3, you must include the
following prefix attribute in the <package> element in the OPF file:

    <package xmlns="http://www.idpf.org/2007/opf" 
             unique-identifier="bookid" version="3.0"
             prefix="rendition: http://www.idpf.org/vocab/rendition/#">
    ....
    </package>

The first area covered in the ePUB Fixed Layout Documents draft is the
definition of properties that can be used in the metadata section of the
package or .opf document as a meta element or in the spine section of the .opf
as an itemref element. By defining these properties in the metadata as a meta
element, an ePUB creator is essentially setting a global definition that will
be applied to the whole document. When the properties are applied in the spine
section, essentially following <itemref id="itemname", it will only be applied
to that particular item in the ePUB. Any property included in an itemref will
override the global property defined in the metadata section for that
particular itemref. In this way you can potentially make some content in an
ePUB fixed-layout and some reflowable.

There are four properties in the draft that allow reading systems to understand
that they are to render the ePUB with fixed layout. They are: rendition:layout,
rendition:orientation, rendition:spread, and page-spread-*. We will take a look
at each of these properties and what they convey to an ePUB reading system.



# The rendition:layout property

The rendition:layout property essentially tells a reading system whether the
ePUB or spine element is reflowable or pre-paginated (fixed-layout). When using
this property, there are literally these two choices: reflowable or
pre-paginated. The default value is reflowable, so if the property is not
defined in the metadata section or the spine, the ePUB content will render as
reflowable text.

Using this property in the metadata would look like this:

    <meta property="rendition:layout">reflowable</meta>

    <meta property="rendition:layout">pre-paginated</meta>

If this property is used in the spine within an itemref, the property is
defined immediately following the item id. In the spine, using this property
would look like this:

    <itemref id="page01" properties="rendition:layout-reflowable"/>

    <itemref id="page02" properties="rendition:layout-pre-paginated"/>


# The rendition:spread property

The rendition:spread property “specifies the intended Reading System synthetic
spread behavior for this Publication or spine item” where synthetic spread is
defined as the rendering of two adjacent pages simultaneously on the device
screen. If you are working in the print environment, this would be the
equivalent of having an image cut into two images that connects in the gutter
across a two-page spread.

There are five possible values for rendition:spread: none, landscape, portrait,
both, or auto. The value none means spreads should never be rendered; landscape
means spreads should only be rendered when the device is in landscape
orientation; portrait means spreads should only be rendered when the device is
in portrait orientation; both means spreads should be rendered both when the
device is in landscape orientation and when the device is in portrait
orientation. The default value for this property is auto or “No explicit
synthetic spread behavior is defined. Reading Systems may use synthetic spreads
in specific or all device orientations as part of a display area utilization
optimization process.” In other words, the Reading Systems will decide how to
render the page.

In the metadata section, rendition:spread would look like this:

    <meta property="rendition:spread">auto</meta>

    <meta property="rendition:spread">none</meta>

    <meta property="rendition:spread">landscape</meta>

    <meta property="rendition:spread">portrait</meta>

    <meta property="rendition:spread">both</meta>

If this property is used in the spine within an itemref, the property is
defined immediately following the item id. In the spine, using this property
would look like this:

    <itemref id="page01" properties="rendition:spread-auto"/>

    <itemref id="page02" properties="rendition:spread-none"/>

    <itemref id="page03" properties="rendition:spread-landscape"/>

    <itemref id="page04" properties="rendition:spread-portrait"/>

    <itemref id="page05" properties="rendition:spread-both"/>

 
# The page-spread-* properties

When dealing with spreads in this draft, there is a left-side viewport and a
right-side viewport. The `page-spread-left`, `page-spread-right`, or
`page-spread-center` property allows you to specify which viewport a spine
itemref element will appear on. As the draft states:

  When a Reading System is rendering synthetic spreads, the default behavior is
  to populate the spread, which conceptually consists of two adjacent viewports,
  by rendering the next Content Document in the next available unpopulated
  viewport, where the location of “next” is determined by the given page
  progression direction, or by local declarations within content documents. By
  providing one of the `page-spread-left`, `page-spread-right` and `page-spread-center` 
  properties on the spine itemref element, the
  author can override this automatic population behavior by forcing the given
  Content Document to be placed in a particular viewport.  So if you have two
  spine itemref elements that make up a single image that should be appear across
  a spread, you can define the one that should be on the left as `page-spread-left`
  and the one that should appear on the right as `page-spread-right`.

In addition to `page-spread-left` and `page-spread-right`, the draft also
defines an additional property, `page-spread-center`, as:

  which indicates that the synthetic spread mode should be overridden such that
  instead of two adjacent viewports, a single viewport must be used, and
  positioned at the center of the screen. Note that the presence of
  rendition:page-spread-center does not in itself affect the content dimensions.
  If you are dealing with a children’s book, for instance, this would allow you
  to make single pages appear on a device screen alone while the two itemrefs
  that make a spread would appear together. These three page-spread-* properties
  apply to both reflowable and pre-paginated content.

When this property is used in the spine within an itemref, the property is
defined immediately following the item id. In the spine, using this property
would look like this:

    <itemref id="page01" properties="page-spread-left"/>

    <itemref id="page02" properties="page-spread-right"/>

    <itemref id="page03" properties="page-spread-center"/>

Multiple properties can be combined in both the metadata and in a spine itemref
element. So a children’s book might have the following in its metadata if you
wanted fixed-layout with all pages displayed horizontally in landscape mode as
spreads:

    <meta property="rendition:layout">pre-paginated</meta>

    <meta property="rendition:orientation">landscape</meta>

    <meta property="rendition:spread">landscape</meta>

Similarly, you can apply multiple properties to a spine itemref element. Take
note how properties are listed within the `properties=` quote marks and separated
by a space.

    <itemref id="titlepage" properties="page-spread-right rendition:layout-pre-paginated"/>

There are multiple examples of how to use the properties at the end of the EPUB
3 Fixed-Layout Documents draft.



# Landmarks

The Landmarks structure identifies key component files within the book, such as
the cover page, bibliography, and so on. It is created using a nav element with
an epub:type value of "landmarks". The Landmarks navigation structure replaces
EPUB 2's <guide> element. Apple Books references the Landmarks when cutting the
sample for a book. A Landmarks nav is required for Fixed Layout books if you do
not provide a custom sample.

Landmarks can also be used to define the start page of a Flowing book, which is
the first page a reader will see the first time they open a book. Apple Books
opens to the first landmark item that contains the epub:type value of
"ibooks:reader-start-page". If that value is not specified in the Landmarks
navigation structure, Apple Books opens to the first spine item that contains
one of the following epub:type landmarks values:

-   bodymatter
-   acknowledgements
-   dedication
-   epigraph
-   foreword
-   preface
-   introduction
-   frontmatter

Within the package, only one "landmarks" nav element can be delivered.

The Landmarks structure uses the epub:type attribute to identify both the <nav>
element and the document functions listed within it. Apple recommends you
identify all of the key files in your book. The required epub:type attribute
describes the publication component referenced by the href attribute. The value
for the epub:type attribute is case-sensitive. Apple suggests you label the
first chapter of the book with an epub:type value of "bodymatter", with all
other epub:type attributes tagged with the appropriate type ("toc",
"titlepage", "epilogue", "preface", and so on). Within the Landmarks <nav>
block, there can be only one epub:type attribute of each type; for example,
there cannot be multiple epub:type attributes of type "bodymatter". For a full
listing of the values available for epub:type, see
https://idpf.github.io/epub-vocabs/structure/.

Landmarks Example:

    <nav epub:type="landmarks">
      <ol>
        <li><a href="coverpg.xhtml" epub:type="cover">Cover</a></li>
        <li><a href="titlepg.xhtml" epub:type="titlepage">Title Page</a></li>
        <li><a href="chapter.xhtml" epub:type="bodymatter">Start</a></li>
        <li><a href="bibliog.xhtml" epub:type="bibliography">Bibliography</a></li>
      </ol>
    </nav>



# Page Mapping Using page-list

The <nav> element using the epub:type="page-list" attribute provides a method
to designate pages in an EPUB that correspond to the pages of the physical
book. This is especially useful in a classroom setting when the teacher
instructs students to turn to a particular page. You can use the optional
epub:type="page-list" attribute to define an empty string to that page so that
it is not numbered. Similarly, you can define Roman numerals (i, ii, iii),
letters (a, b, c), or numbers (1, 2, 3) for page numbers. If you use something
other than numbers or a single word, make sure it is meaningful, keep it very
short, and check to make sure it doesn't get truncated on the screen.

Page-list is supported for both Flowing and Fixed Layout books. The example
below shows how to provide page navigation using epub:type="page-list":

Page-list Example:

    <nav epub:type="page-list">
        <ol>
          <li><a href="coverpg.xhtml">intro</a></li>
          <li><a href="titlepg.xhtml"></a></li>
          <li><a href="chp1.xhtml#p1">1</a></li>
          <li><a href="chp1.xhtml#p2">2</a></li>
          <li><a href="chp1.xhtml#p3">3</a></li>
        </ol>
    </nav>



# Navigation Document

The EPUB navigation document is a mandatory component of an EPUB publication.
It allows EPUB creators to include a human- and machine-readable global
navigation layer, thereby ensuring increased usability and accessibility for
the user.

The EPUB navigation document is a special type of XHTML content document that
defines the table of contents for reading systems. It may also include other
specialized navigation elements, such as a page list and a list of key
landmarks. These navigation elements have additional restrictions on their
content to facilitate their processing.

    Example: Basic patterns of a navigation element
    <nav epub:type="…">
       <h1>…</h1>
       <ol>
          <li>
             <a href="chap1.xhtml">
                A basic leaf node
             </a>
          </li>
          <li>
             <a href="chap2.xhtml">
                A linked heading
             </a>
             <ol>
                …
             </ol>
          </li>
          <li>
             <span>An unlinked heading</span>
             <ol>
                …
             </ol>
          </li>
       </ol>
    </nav>

The `epub:type=` attribute can be set to one of the following three values:

+ toc
  Identifies the nav element that contains the table of contents. The toc nav is the only navigation aid that EPUB creators must include in the EPUB navigation document.
+ page-list
  Identifies the nav element that contains a list of pages for a print or other statically paginated source.
+ landmarks
  Identifies the nav element that contains a list of points of interest.

The "toc nav" element defines the primary navigational hierarchy. It conceptually
corresponds to a table of contents in a printed work (i.e., it provides
navigation to the major structural sections of the publication).

The "page-list nav" element provides navigation to static page boundaries in
the content. These boundaries may correspond to a statically paginated source
such as print or may be defined exclusively for the EPUB publication.  It is
OPTIONAL in EPUB navigation documents and MUST NOT occur more than once.  It
SHOULD contain only a single ol descendant (i.e., no nested sublists).  EPUB
creators MAY identify the destinations of the "page-list" references in their
respective EPUB content documents using the pagebreak term [epub-ssv-11].

The "landmarks nav" element identifies fundamental structural components in the
content to enable reading systems to provide the user efficient access to them
(e.g., through a dedicated button in the user interface).  It is OPTIONAL in
EPUB navigation documents and MUST NOT occur more than once.  It SHOULD contain
only a single ol descendant (i.e., no nested sublists).  The `epub:type`
attribute is REQUIRED on "a" element descendants. The structural semantics of
each link target within the landmarks nav element is determined by the value of
this attribute.  Following is an example:

    Example: A basic landmarks nav
    <nav epub:type="landmarks">
       <h2>Guide</h2>
       <ol>
           <li>
              <a epub:type="toc"
                 href="#toc">
                Table of Contents
              </a>
           </li>
           <li>
              <a epub:type="loi"
                 href="content.html#loi">
                List of Illustrations
              </a>
           </li>
           <li>
              <a epub:type="bodymatter"
                 href="content.html#bodymatter">
                Start of Content
              </a>
           </li>
       </ol>
    </nav>

The following landmarks are recommended to include when available:

- bodymatter [epub-ssv-11] : Reading systems often use this landmark to
  automatically jump users past the front matter when they begin reading.
- toc [epub-ssv-11] : If the table of contents is available in the spine,
  reading systems may use this landmark to take users to the document
  containing it.

Other possibilities for inclusion in the landmarks nav are key reference
sections such as indexes and glossaries.



# Media query

For each XHTML document, it can include the "head" section the different
CSS to apply if the device has different media size.

    Example: OPF file with "meta" element defining the current document 
    to be a fixed size document.
    <package …>
       <metadata …>
          …
          <meta
              property="rendition:layout">
             pre-paginated
          </meta>
          …
       </metadata>
       …
    </package>

    Example: XHTML file with "meta" element for providing the media size
    of the current document as well as media query for what CSS to apply
    given that the actual media device is at a different size.
    <html …>
       <head>
          <meta
              name="viewport"
              content="width=1200,
              height=900"/>
          
          <link
              rel="stylesheet"
              href="eink-style.css"
              media="(max-monochrome: 3)"/>
             
          <link
              rel="stylesheet"
              href="skinnytablet-style.css"
              media="((color) and (max-height:600px) and (orientation:landscape),
                      (color) and (max-width:600px) and (orientation:portrait))"/>
          
          <link
              rel="stylesheet"
              href="fattablet-style.css"
              media="((color) and (min-height:601px) and (orientation:landscape),
                      (color) and (min-width:601px) and (orientation:portrait))"/>	
       </head>
       …
    </html>






