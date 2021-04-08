---
title: LuaLatex Font Handling
---


# Background


In this manual we will look at fonts from the perspective of yet another
descendant, LuaTEX. It inherits the font technology from traditional TEX, but
also extends it so that we can deal with modern font technologies. Of course
it offers much more, but in practice much relates to fonts one way or the
other.


# Basic concepts regarding fonts


A typeset text is mostly a sequence of characters turned into glyphs. We talk
of char- acters when you input the text, but the visualization involves
glyphs. When you copy a part of the screen in an open pdf document or html
page back to your editor you end up with characters again. In case you wonder
why we make this distinction between these two states we give an example.

    affiliation   affiliation

We see here that the shape of the a is different for an upright serif and an
italic. We also see that in ffi there is no dot on the i. The first case is
just a stylistic one but the second one, called a ligature, is actually one
shape. The 11 characters are converted into 9 glyphs. Hopefully the final
document format carries some extra information about this transformation so
that a cut and paste will work out well. In pdf files this is normally the
case. In this document we will not be too picky about the distinction as in
most cases the glyph is rather related to the character as one knows it.

So, a font contains glyphs and it also carries some information about
replacements. In addition to that there needs to be at least some information
about the dimensions of them. Actually, a typesetting engine does not have to
know anything about the actual shape at all.

@ figure{subfigure}

  &img{image-font-format-1.png}{width:5cm}
  
  &img{image-font-format-2.png}{width:5cm}

  \\
  
  &img{image-font-format-3.png}{width:10cm}

The rectangles around the shapes are called
boundingbox. The dashed line reflects the baseline where they eventually are
aligned onto next to each other. The amount above the baseline is called
height, and below is called depth. The piece of the shape above the baseline
is the ascender and the bit below the descender. The width of the bounding box
is not by definition the width of the glyph. In Type1 and OpenType fonts each
shape has a so called advance width and that is the one that will be used.

Another traditional property of a font is kerning.  In typography, kerning is
the process of adjusting the spacing between characters in a proportional
font, usually to achieve a visually pleasing result. Kerning adjusts the space
between individual letterforms, while tracking (letter-spacing) adjusts
spacing uniformly over a range of characters.

In its simplest form, kerning is adjusting the space between two individual
letters, while tracking is adjusting the spacing uniformly over a given
selection of text. The goal for both is to equalize the appearance of the
whitespace between letters.

In figure (c) you see this in action. These examples demonstrate that not all
fonts need (or provide) the same kerns (in points).

Leading is a typography term that describes the distance between each line of
text. It is pronounced ledding (like "sledding" without the "s"). The name
comes from a time when typesetting was done by hand and pieces of lead were
used to separate the lines.

So, as a start, we have now met a couple of properties of a font. They can be
summarized as follows:

- mapping to glyphs : characters are represented by a shapes that have
  recognizable properties so that readers know what they mean 

- ligature building : a sequence of characters gets mapped onto one glyph

- dimensions : each glyph has a width, height and depth

- inter-glyph kerning : optionally a bit of positive or negative space has to
  be inserted between glyphs

Regular font kerning is hardly noticeable and improves the overall look of the
page. Typesetting applications sometimes are capable of inserting additional
spaces between shapes. This more excessive kerning is not that much related to
the font and is used for special purposes, like making a snippet of text stand
out. In ConTEXt this kind of kerning is available but it is a font independent
feature. Keep in mind that when applying that kind of rather visible kerning
you’d better not have ligatures and fancy replacements enabled as ConTEXt
already tries to deal with that as good as possible.


# The basic process of handing fonts


In TEX a font is an abstraction: the engine only needs to know about the
mapping from characters to glyphs, what the width, height and depth is, what
sequences need to be translated into ligatures and when kerning has to be
applied. If for the moment we forget about math, these are all the properties
that matter and this is what the TEX font metric files that we see in the next
section provide. Because one of the principles behind LuaTEX is that the core
engine (the binary) stays small and that new functionality is provided in Lua
code, the font subsystem largely looks like it always has been. As users will
normally use a macro package most of the loading will be hidden from the user.
It is however good to give a quick overview of how for instance pdfTEX deals
with fonts using traditional metric files.

Because one of the principles behind LuaTEX is that the core engine (the
binary) stays small and that new functionality is provided in Lua code, the
font subsystem largely looks like it always has been. As users will normally
use a macro package most of the loading will be hidden from the user. It is
however good to give a quick overview of how for instance pdfTEX deals with
fonts using traditional metric files.

    INPUT -> CHARACTERS -> GLYPHS -> SUBSET

The input (bytes) gets translated into characters by the input parser.
Normally this is a one-to-one translation but there are examples of some
translation taking place. You can for instance make characters active and give
them a meaning. So, the eight bit repre- sention of an editors code page ë
can become something else internally, for instance a regular e with an  ̈
overlayed. It can also become another character, which in the code page would
be shown as á but the user will not know this as by then this byte is already
tokenized. Another example is multibyte translation, for instance utf
sequences can get remapped to something that is known internally as being a
character of some kind. The LuaTEX engine expects utf so a macro package has
to make sure that translation to this encoding happens beforehand, for
instance using a callback that intercepts the input from file.

So, the input character (sequence) becomes tokens representing a character.
From these tokens TEX will start building a (linked) node list where each
character becomes a node. In this node there is a reference to the current
font. If you know TEX you will understand that a list can have more than
characters: there can be skips, kerns, rules, references to images, boxes,
etc.

At some point TEX will handle this list over to a routine that will turn them
into something that resembles a paragraph or otherwise snippet of text. In
that stage hyphenation kicks in, ligatures get built and kerning is added.
Character references become glyph indices. This list can finally be broken
into lines.

It is no secret that TEX can box and unbox material and that after unboxing
some new formatting has to happen. The traditional engine has some
optimizations that demand a partial reconstruction of the original list but in
LuaTEX we removed this kind of opti- mization so there the process is somewhat
simpler. We will see more of that later.

When TEX ships out a page, the backend will load the real font data and merge
that into the final output. It will now take the glyph index and build the
right data structures and references to the real font. As a font gets subset
only the used glyphs end up in the final output.

There is one tricky aspect involved here: re-encoding. In so called map files
one can map a specific metric filename onto a real font name. One can also
specify an encoding vector that tells what a given index really refers to.
This makes it possible to use fonts that have more than 256 glyphs and refer
to any of them. This is also the trick that makes it possible to use TrueType
fonts in pdfTEX: the backend code filters the right glyphs from the font,
remapping TEX’s glyph indices onto real entries in the font happens via the
encoding vector. In the following figure  we show a possible route for input
byte 68.

    BYTES (68) -> BYTES (31) -> INDEX (31) -> INDEX (88)

As LuaTEX carries much of the bagage of older engines, you can still do it
this way but in ConTEXt MkIV we have made our live much simpler: we use
unicode as much as possible. This means that we effectively have removed two
steps (see figure 1.7).

    INPUT -> GLYPHS

There is of course still some work to do for the backend, like subsetting, but
the nasty dependency on the input encoding, font encoding (that itself relates
to hyphenation) and backend re-encoding is gone. But keep in mind that the
internal data structure of the font is still quite traditional.

Before we move on to font formats I like to point out that there is no space
in TEX. Spaces in the input are converted into glue, either or not with some
stretch and/or shrink. This also means that accessing character 32 in
traditional TEX will not end up as space in the output.


# TEX metrics

Traditional font metrics are packaged in a binary format. Due to the
limitations of that time a font has at most 256 characters. In books dedicated
to TEX you will often find tables that show what glyphs are in a font, so we
will not repeat that here as after all we got rid of that limitation in
LuaTEX.

Because 256 is not that much, especially when you mix many scripts and need
lots of symbols from the same font, there are quite some encodings used in
traditional TEX, like texnansi, ec and qx. When you use LuaTEX exclusively you
can do with way less font files. This is easier for users, especially because
most of those files were never used anyway. It’s interesting to notice that
some of the encodings contain symbols that are never used or used only once in
a document, like the copyright or registered symbols. They are often accessed
by symbolic names and therefore easily could have been omitted and collected
in a dedicated symbol font thereby freeing slots for more useful characters
anyway. The lack of coverage is probably one of the reasons why new encodings
kept popping up. In the next table you see how many files are involved in
Latin Modern which comes in a couple of design sizes.

    ================================================================
    @font-format    @type   @num-files   @size-in-bytes  @CONTEX
    ================================================================
    type1           tfm            380        3,841,708
                    afm             25        2,697,583
                    pfb             92        9,193,082
                    enc             15           37,605
                    map              9           42,040
    ----------------------------------------------------------------
                                   521       15,812,018     mkii
    opentype        otf             73        8,224,100     mkiv  
    ================================================================               
   
A tfm file can contain so called italic corrections. This is an additional
kern that can be added after a character in order to get better spacing
between an italic shape and an upright one. As this is manual work, it’s a not
that advanced mechanism, but in addition to width, height, depth, kerns and
ligatures it is nevertheless a useful piece of information. But, it’s a rather
TEX specific quantity.

Since TEX showed up many fonts have been added. In addition support for
commercial fonts was provided. In fact, for that to happen, one only needs
accompanying metric files for TEX itself and map files and encoding vectors
for the backend. Because a metric file also has some general information, like
spacing (including stretch and shrink), the ex-height and em-width, this means
that sometimes guesses must be made when the original font does not come with
such parameters.

At some point virtual fonts were introduced. In a virtual font a tfm file has
an accom- panying vf file. In that file each glyph has a specification that
tells where to find the real glyph. It is even possible to construct glyphs
from other glyphs. In traditional TEX this only concerns the backend, which in
pdfTEX is built in. In LuaTEX this mechanism is integrated into the frontend
which means that users can construct such virtual fonts themselves. We will
see more of that later, but for now it’s enough to know that when we talk
about the representation of font (the tfm table) in LuaTEX, this includes
virtual functionality.

An important limitation of tfm files cq. traditional TEX is that the number of
depths and heights is limited to 16 each. Although this results in somewhat
inaccurate dimensions in practice this gets unnoticed, if only because many
designs have some consistency in this. On the other hand, it is a limitation
when we start thinking of accents or even multiple accents which lead to many
more distinctive heights and depths.

Concerning ligatures we can remark that there are quite some substitutions
possible although in practice only the multiple to one replacement has been
used.

Some fonts that are used in TEX started out as bitmaps but rather soon Type1
outline fonts became the fashion. These are supported using the map files that
we will discuss later. First we look into Type1 fonts.


# Type1 Fonts


For a long time Type1 fonts have dominated the scene. These are PostScript
fonts that A.4 can have more that 256 glyphs in the file that defines the
shapes, but only 256 of them A.3 can be used at one time. Of course there can
be multiple subsets active in one document.

In traditional TEX a Type1 font is used by making a tfm file from a so called
Adobe metric file (afm) that come with such a font. There are several tool
chains for doing this and ConTEXt MkII ships with one that can be of help when
you need to support commercial fonts. Projects like the Latin Modern Fonts and
TEX Gyre have normalized a whole lot of fonts that came in several more or
less complete encodings into a consistent package of Type1 fonts. This already
simplified life a lot but still users had to choose a suitable input and font
encoding for their language and/or script. As TEX only cares about metrics and
not about the rendering, it doesn’t consider Type1 fonts as something special.
Also, as TEX and PostScript were developed about the same time support for
Type1 fonts is rather present in TEX distributions.

You can still follow this route but for ConTEXt MkIV this is no longer the
recommended way because there we have changed the whole subsystem to use
Unicode. As a result we no longer use tfm files derived from afm files, but
directly interpret the afm data. This not only removes the 256 limitation, but
also brings more resolution in height and depth as we no longer have at most
16 alternatives. There can also be more kerns. Of course we need some
heuristics to determine for instance the spacing but that is not different
from former times.

Because most TEX users don’t use commercial fonts, they will not notice that
ConTEXt MkIV treats Type1 fonts this way. One reason is that the free fonts
also come as wide fonts in OpenType format and whenever possible ConTEXt
prefers OpenType over Type1 over tfm.

In the beginning LuaTEX could only load a tfm file, which is why loading afm
files is implemented in Lua. Later, when the capability to OpenType was added,
loading pfb and afm files also became possible but it’s slower and we see no
reason to rewrite the current code in ConTEXt. We also do a couple of extra
things when loading such a file. As more Type1 fonts move on to OpenType we
don’t expect that much usage anyway.


# OpenType Fonts


When an engine can deal with Unicode directly it also means that it can handle
large number of glyph indices. The first TEX descendent that went wide was
Omega, later replaced by Aleph. However, this engine never took off and still
used its own extended tfm format: ofm. In fact, as LuaTEX uses some of the
Aleph code, it can also use these extended metric files but I don’t think that
there are any useful fonts around so we can forget about this.

We use the term OpenType for a couple of font formats that share the same
principles: OpenType (otf), TrueType (ttf) and TrueType containers (ttc). The
LuaTEX font reader presents them in a similar format. In the case of a
TrueType container, one does not load the whole font but selects an instance
from it. Internally an OpenType font can have the glyphs organized in
subfonts.

The first TEX descendent to really go wide from front to back is XƎTEX. This
engine can use OpenType fonts directly and for a whole category of users this
opened up a new world. However, it is still mostly a traditional engine. The
transition from characters to glyphs is accomplished by external libraries,
while in LuaTEX we code in Lua. This has the disadvantage that it is slower
(although that depends on the job) but the advantage is that we have much more
control and can extend the font handler as we like.

An OpenType font is much more complex than a Type1 one. Unless it is a quick
and dirty converted existing font, it will have more glyphs to start with.
Quite likely it will have kerns and ligatures too and of course there are
dimensions. However, there is no concept of a depth and height. These need to
be deduced from the bounding box instead. There is an advance width. This
means that we can start right away using such fonts if we map those properties
onto the tfm table that LuaTEX expects.

But there is more, take ligatures. In a traditional font the sequence ffi
always becomes a ligature, given that the font has such a glyph. In LuaTEX
there is a way to disable this mechanism, which is sometimes handy when
dealing with mono-spaced fonts in verbatim. It’s pretty hard to disable that.
For instance one option is to insert kerns manually. In an OpenType font
ligatures are collected in a so called feature. There can be many such
features and even kerning is a feature. Other examples are old style numerals,
fractions, superiors, inferiors, historic ligatures and stylistic alternates.

@ figure 

  &img{image-font-format-4.png}{width:10cm}

To this all you need to add that features operate in two dimensions: languages
and scripts. This means that when ligatures are enabled for Dutch the ij
sequence becomes a single glyph but for German it gets mapped onto two glyphs.
And, to make it even more complex, a substitution can depend on circumstances,
which means that for Dutch fijn becomes f ij n but fiets becomes fi ets. It
will be no surprise that not all OpenType fonts come with a complete and rich
repertoire of rules. To make things worse, there can be rules that turn 1/2
into one glyph, or transfer the numbers into superior and inferior
alternatives, but leaves us with an unacceptable rendered 1/a, given that the
frac features is enabled. It looks like features like this are to be applied
to a manually selected range of characters.  

The fact that an OpenType font can contain many features and rules to apply
them makes it possible to typeset scripts like Arabic. And this is where it
gets vague. A generic OpenType sub-engine can do clever things using these
rules, but if you read the spec- ification for some scripts additional
intelligence has to be provided by the typesetting engine.

While users no longer have to care about encodings, map files and back-end
issues, they do have to carry knowledge about the possibilities and
limitations of features. Even worse, he or she needs to be aware that fonts
can have bugs. Also, as font vendors have no tradition of providing updates
this is something that we might need to take care of ourselves by tweaking the
engine.

One of the problems with the transition from Type1 to OpenType is that font
designers can take an existing design and start from that basic repertoire of
shapes. If such a design had oldstyle figures only, there is a good chance
that this will be the case in the OpenType variant too. However, such a
default interferes with the fact that the onum feature is one that we
explicitly have to enable. This means that writing a generic style where a
font is later plugged in becomes somewhat messy if it assumes that features
need to be turned on.

TEX users expect more control, which means that in practice just an OpenType
engine is not enough, but for the average font the TEX model using the
traditional approach still is quite acceptable. After all, not all users use
complex scripts or need advanced features. And, in practice most readers don’t
notice the difference anyway.


# Lua


As mentioned support for virtual fonts is built into LuaTEX and loading the so
called vf files happens when needed. However, that concerns traditional
fonts that we already covered. In ConTEXt we do use the virtual font mechanism
for creating missing glyphs out of existing ones or add fallbacks when this is
not possible. But this is not related to some kind of font format.

In 2010 and 2011 the first public OpenType math fonts showed up that replace
their Type1 originals. In ConTEXt we already went forward and created virtual
Unicode fonts out of traditional fonts. Of course eventually the defaults will
change to the OpenType alternatives. The specification for such a virtual font
is given in Lua tables and therefore you can consider Lua to be a font format
as well. In ConTEXt such fonts can be defined in so called goodies files. As
we use these files for much more tuning, we come back to that in a later
chapter. In a virtual font you can mix real Type1 fonts and real OpenType
fonts using whatever metrics suit best.

An extreme example is the virtual Unicode Punk font. This font is defined in
the Me- taPost language (derived from Don Knuths METAFONT sources) where each
glyph is one graphic. Normally we get PostScript, but in LuaTEX we can also
get output in a compa- rable Lua table. That output is converted to pdf
literals that become part of the virtual font definitions and these eventually
end up in the pdf page stream. So, at the TEX end we have regular (virtual)
characters and all TEX needs is their dimensions, but in the pdf each glyph is
shown using drawing operations. Of course the now available OpenType variant
is more efficient, but it demonstrates the possibilities.


# Files


We summarize these formats in the following table where we explain what the
file suf- fixes stand for:

+ tfm 

  This is the traditional TEX font metric file format and it reflects the
internal quantities that TEX uses. The internal data structures (in LuaTEX)
are an extension of the tfm format.

+ vf 

  This file contains information about how to construct and where to find
  virtual glyphs and is meant for the backend. With LuaTEX this format gets
  more known.

+ pk 

  This is the bitmap format used for the first generation of TEX fonts but the
  typeset- ter never deals with them. Bitmap files are more or less obselete.

+ ofm 

  This is the Omega variant of the tfm files that caters for larger fonts. 

+ ovf 

  This is the Omega variant of the vf.

+ pfb 

  In this file we find the glyph data (outlines) and some basic information about the font, like name-to-index mappings. A differently byte-encoded variant of this format is pfa.

+ afm 

  This file accompanies the pfb file and provides additional metrics, kerns and
infor- mation about ligatures. A binary variant of this is the pfa format. For
MS Windows there is a variant that has the pfm suffix.

+ map 

  The backend will consult this file for mapping metric file names onto real
  font names.

+ enc 

  The backend will include (and use) this encoding vector to map internal
indices to font indices using glyph names, if needed.

+ otf 

  This binary format describes not only the font in terms of metrics, features
  and properties but also contains the shapes.

+ ttf 
  
  This is the Microsoft variant of OpenType.

+ ttc 

  This is the Microsoft container format that combines multiple fonts in one.

+ fea 

  A (FontForge) feature definition file. Such a file can be loaded and applied
to a font. This is no longer supported in ConTEXt as we have other means to
achieve the same goals.

+ cid 

  A glyph index (name) to Unicode mapping file that is referenced from an
OpenType font and is shared between fonts.

+ lfg 

  These are ConTEXt specific Lua font goodie files providing additional
  information.

If you look at how files are organized in a TEX distribution, you will notice
that these files all get their own place. Therefore adding a Type1 font to the
distribution is not that trivial if you want to avoid clashes. Also, files are
simply not found when they are not in the right spot. Just to mention a few
paths:

    <root>/fonts/tfm/vendor/typeface
    <root>/fonts/vf/vendor/typeface
    <root>/fonts/type1/vendor/typeface
    <root>/fonts/truetype/vendor/typeface
    <root>/fonts/opentype/vendor/typeface
    <root>/fonts/fea
    <root>/fonts/cid
    <root>/fonts/dvips/enc
    <root>/fonts/dvips/map

There can be multiple roots and the right locations are specified in a
configuration file. Currently all engines can use the dvips encoding and map
files, so luckily we don’t need to duplicate this. For some reason TrueType
and OpenType fonts have different locations and you need to be aware of the
fact that some fonts come in both formats (just to confuse users) so you might
end up with conflicts.

In ConTEXt we try to make live somewhat easier by also supporting a simple
path struc- ture:

    <root>/fonts/data/vendor/typeface

This way files are kept together and installing commercial fonts is less
complex and error prone. Also, in practice we only have one set of files now:
one of the other OpenType formats.

If you want to see the difference between a traditional (pdfTEX or XƎTEX plus
ConTEXt MkII) setup or a modern one (LuaTEX with ConTEXt MkIV) you can install
the ConTEXt suite (formerly known as minimals). If you explicitly choose for a
LuaTEX only setup, you will notice that far less files get installed.


# Text


This is not an in-depth explanation of how to define and load fonts in
ConTEXt. First of all this is covered in other manuals, but more important is
that we assume that the reader is already familiar with the way ConTEXt deals
with fonts. Therefore we limit ourselves to some remarks and expand on this a
bit in later chapters.

The font subsystem has evolved over years and when you look at the low level
code you will probably find it complex. This is true, although in some aspects
it is not as complex as in MkII where we also had to deal with encodings due
to the eight bit limitations. In fact, setting up fonts is easier due the fact
that we have less files to deal with.

The main properties of a (modern) font subsystem for typesetting text are the
following:

1. Weneedtobeabletoswitchthelookandfeelefficientlyandconsistently,forinstance
going from regular to bold or italic. So, when we load a font family we not
only load one file, but often at least four: regular, bold, italic (oblique)
and bolditalic (boldoblique).

2. When we change the size we also need to make sure that these related sets
are changed accordingly. You really want the bold shapes to scale along with
the regular ones.

3. Shapes are organized in serif, sans serif, mono spaced and math and for
proper work- ing of a typesetter that has math all over you need always need
the math. Again, when you change size, all these shapes need to scale in sync.

4. In one document several families can be combined so the subsystem should
make it possible to switch from one to the other without too much overhead.

5. Becaus esection heads and other structural elements have their own sizes
there has to be a consistent way to deal with that. It should also be possible
to specify exceptions for them.

In the next chapters we will cover some details, for instance font features.
You can actually control these when setting up a body font, simply by
redefining the default feature set, but not all features are dealt with this
way. So let’s continue the demands put on a font subsystem.

6. Sometimes inter-character kerning is needed. In ConTEXt this is not a
property of a font because glyphs can be mixed with basically anything. This
kind of features is applied independent of a font.

7. The same is true for casing (like uppercasing and such) which is not
related to a font but applied to a selected (or marked) piece of the input
stream.

8. Using so called "smallcaps" or "oldstyle" numerals, can be dealt with by
setting the default features but often these are applied selectively. As these
are applied using the information in a font they do belong to the font
subsystem but in practice they can be seen as independent (assuming that the
font supports them at all).

9. Protrusion (into margins) and expansion (to improve whitespace) are applied
to the font at load time because the engine needs to know about them. But they
two can selectively be turned on and off. They are more related to line break
handling than font defining.

10. Slanting (to fake oblique) and expanding (to fake bold) are regular
features but are applied to the font because the engine needs to know about
them. They permanently influence the shape.

We will discuss these in this manual too. What we will not discuss in depth is
spacing, even when it depends on the (main body) font size. These use
properties of fonts (like the ex-height or em-width and maybe the width of the
space, but normally they are controlled by the spacing subsystem. We will
however mention some rather specific possibilities:

11. The ConTEXt font subsystem provides ways to combine multiple fonts into
one.

12. You can construct artificial fonts, using existing fonts or MetaPost
graphics.

13. Fonts can be fixed (dimensions) and completed (for instance accented
characters) when loading.

14. There are extensive tracing options, not only for applied features but
also for loading, checking etc. There is a set of styles that can be used to
study fonts.

Sometimes users ask for very special trickery and it no surprise then that
some of that is now widely know (or even discussed in detail). When we get
notice of that we can mention it in this manual.

So how does this all relate to font formats? We mentioned that when loading we
basically load some four files per family (and more if we use specific fonts
for titling). These files just provide the data: metric information, shapes
and ways to remap characters (or sequences) into glyphs, either of not
positioned relative to each other. In traditional TEX only dimensions, kerns
and ligatures mattered, but in nowadays we also deal with specific OpenType
features. But still, as you can deduce from the above, this is only part of
the story. You need a complete and properly integrated system. It is no big
deal to set up some environment that uses font files to achieve some
typesetting goal, but to provide users with some consistent and extensible
system is a bit more work.

There are basically three font formats: good old bitmaps, Type1 and OpenType.
All need to be supported and expectations are that we also support their
features. But is should be noticed that whatever font you use, the quality of
the outcome depends on what information the font can provide. We can improve
processing but are often stuck with the font. There are many thousands of
fonts out there and we need to be able to use them all.

# Math Fonts

In the previous section we already mentioned math fonts. The fonts are just
one aspect of typesetting math and math fonts are special in the sense that
they have to provide the relevant information. For instance a parenthesis
comes in several sizes and at some point turns in a symbol made out of pieces
(like a top curve, middle lines and bottom curve) that overlap. The user never
sees such details. In fact, there are ot that many math fonts and these are
already set up so there is not much to mess up here. Nevertheless we mention:

1. Math fonts are loaded in three sizes: text, script and scriptscript. The
optimal relative sizes ar defined in the font.

2. There are direction aware math fonts and we support this in ConTEXt.

3. Boldmathisinfactabolderversionofaregularmathfont(thatcanhaveboldsymbols
too). Again this is supported.

The way math is dealt with in ConTEXt is different from the way it is done
traditionally. Already when we started with MkIV we moved to Unicode and the
setup at the font level is kept simple by delegating some of the work to the
Lua end. We will see some of the mentioned aspects in more detail later.

Because of it’s complexity and because in a math text there can be many times
activation of math fonts (and related settings) quite some effort has been put
in making it efficient. But you need to keep in mind that when we discuss math
related topics later on, this is hardly of concern. Math fonts are loaded only
once so manipulating them a bit has no penalty. And using them later on is
hardly related to the font subsystem.

Concerning formats we can notice that traditional TEX comes with math fonts
that have properties that the engine can use. Because there were not many math
fonts, this was no problem. The OpenType math fonts however are also used in
other applications and therefore are a bit more generic.3 For this we not only
had to adapt the math engine in LuaTEX (although we kept that to the minimum)
but we also had to think different about loading them. In later chapters we
will see that in the transition to Unicode math fonts we implemented a
mechanism for combining Type1 fonts into virtual Unicode fonts. We did that
because it made no sense to keep an old and new loader alongside.

There will not be thousands of math fonts flying around. A few dozen is
already a lot and the developers of macro packages can set them up for the
users. So, in practice there is not much that a user needs to know about math
font formats.


# @sec:caching Caching

Because fonts can be large and because we use Lua tables to describe them a
bit of effort has been put into managing them efficiently. Once converted to
the representation that we need they get cached. You can peek into the cache
which is someplace on your system (depending on the setup):

+ fonts/afm
  type one fonts, converted from afm and pfb files
+ fonts/data
  font name databases
+ fonts/mp
  fonts created using MetaPost
+ fonts/otf
  open type fonts, converted from ttf, otf, ttc and ttx files loaded using the FontForge loader
+ fonts/otl
  open type fonts, converted from ttf, otf, ttc and ttx files loaded using the ConTEXt Lua loader
+ fonts/shapes
  outlines of fonts (for instance for use in MetaFun)
  
There can be three types of files there. The tma files are just Lua tables and
they can be large. These files can be compiled to bytecode where tmc is for
stock LuaTEX and tmb for LuajitTEX. The tma files are optimized for space and
memory (aka: packed) but you can expand them with

    mtxrun --script font.

Fonts in the cache are automatically updated when you install new versions of a
font or when the ConTEXt font loader has been updated.



# Mode

We use the term modes for classifying the several ways characters are turned
into glyphs. When a font is defined, a set of features can be associated and one
of them is the mode.

+ none 
  Characters are just mapped onto glyphs and no substitution or positioning 
  takes place.
+ base 
  The routines built into the engine are used. For many Latin fonts this is a 
  rather useable and efficient method.
+ node 
  Here alternative routines written in Lua are used. This mode is needed for 
  more complex scripts as well as more advanced features that demand some 
  analysis.
+ auto 
  This mode will determine the most suitable mode for the given feature set.

When we talk about features, we refer to more than only features provided by
fonts as ConTEXt adds some of its own. In the following section each of these
modes is discussed. Before we do so a short introduction to font tables that we
use is given.


# The font table


The internal representation of a font in ConTEXt is such that we can
conveniently access data that is needed in the mentioned modes. When a font is
used for the first time, or when it has changed, it is read in its most raw
form. After some cleanup and normalization the font gets cached when it is a
Type1 or OpenType font. This is done in a rather efficient way. A next time
the cached copy is used.

The normalized table is shared among instances of a font. This means that when
a font is used at a different scale, or when a different feature set is used,
the font gets loaded only once and its data is shared when possible. In figure
below we have visualized the process. Say that you ask for font whatever at
12pt using featureset smallcaps. In low level code this boils down to:

@ figure
  Defining a font.

  &img{image-font-format-5.png}{width:10cm}

The first step is loading the font (or using the cached copy). From that a
copy is made that has some additional data concerning the features set and
from that a scaled copy is constructed. These copies share as much data as
possible to keep the memory footprint as small as possible. The table that is
passed to LuaTEX gets cleaned up afterwards. In practice the tfm loader only
kicks in for creating virtual math fonts. The afm reader is used for Type1
fonts and as there is no free upgrade path from Type1 to OpenType for
commercial fonts, that one will get used for older fonts. Of course most
loading is done by the otf reader(s).

The data in the final tfm table is organized in subtables. The biggest ones
are the characters and descriptions tables that have information about each
glyph. Later we will see more of that. There are a few additional tables of
which we show two: properties and parameters. For the current font the first
one has the following en- tries:


# Lookups


In traditional TEX a font is defined by referring to its filename. A
definition looks like this:

    \font \MyFontA = lmr10
    \font \MyFontB = lmr10 at 20pt
    \font \MyFontC = lmr10 scaled 1500

The first definition defines the command MyFontA as a reference to the font
stored in the file lmx10. No scaling takes place so the natural size is taken.
This so called designsize is in no way standardized. Just look at these three
specimen:

Design Size (Dejavu)
Design Size (Cambria)
Design Size (Latin Modern)

The designsize is normally 10 point, but as there is no real reference for
this a designer decides how to translate this into a visual representation. As
a consequence the 20pt in the second line of the example definitions only
means that the font is scaled to (normally) twice the designsize. The third
line scaled by a factor 1.5 and the reason for using a value thousand times
larger is that TEX’s numbers are integers.

The next three lines are typical for Latin Modern (derived from Computer
Modern) be- cause this family comes in different design sizes.

&img{image-font-format-6.png}

The designsize is normally 10 point, but as there is no real reference for
this a designer decides how to translate this into a visual representation. As
a consequence the 20pt in the second line of the example definitions only
means that the font is scaled to (normally) twice the designsize. The third
line scaled by a factor 1.5 and the reason for using a value thousand times
larger is that TEX’s numbers are integers.

The next three lines are typical for Latin Modern (derived from Computer
Modern) be- cause this family comes in different design sizes.

    \font \MyFontD = lmr12
    \font \MyFontE = lmr12 at 20pt
    \font \MyFontF = lmr12 scaled 1500

Because the designsize is part of the font metrics the second line (\MyFontE)
is of similar size as \MyFontB although the 12 point variant is visually
better suited for scaling up.

These definitions refer to files, but what file? What gets loaded is the file
with name name.tfm. Eventually for embedding in the (let’s assume pdf) file
the outlines are taken from name.pfb. At that stage, when present, a name.vf
is consulted in order to resolve characters that are combinations of others
(potentially from other pfb files). The map- ping from name.tfm to name.pfb
filename happens in the so called map file. This means that one can also refer
to another file, for instance name.ttf.

All this logic is hard coded in the engine and because the virtual font
mechanism was introduced later without extending the tfm format, it can be
hard at times to figure out issues when a (maybe obsolete) virtual file is
present (this can be the case if you have generated the tfm file from an afm
file that comes with the pfb file when you buy one. But, in LuaTEX we no
longer use traditional fonts and as a consequence we have more options open.
Before we move on to them, we mention yet another definition:

    \font \MyFontG = lmr12 sa 1.2

This method is not part of TEX but is provided by ConTEXt, MkII as well as
MkIV. It means as much as “scale this font to 1.2 times the bodyfontsize”. As
this involves parsing the specification, it does not work as advertised here,
but the next definition works okay:

    \definefont[MyFontG][lmr12 sa 1.2]

This indicates that we already had a parser for font specifications on board
which in turn made it relatively easy to do even more parsing, for instance
for font features as introduced in XƎTEX and LuaTEX.


# Specifications

In LuaTEX we intercept the font loader. We do so for several reasons.

- We want to make decisions on what file to load, this is needed 
  when for instance there are files with the same name but different 
  properties.
- We want to be able to lookup by file, by name, and by more abstract 
  specification. In doing so, we want to be as tolerant as possible.
- We want to support several scaling methods, as discussed in the 
  previous section.
- We want to implement several strategies for passing features and 
  defining non standard approaches.

The formal specification of a font is as follows:

    \definefont[PublicReference][filename]
    \definefont[PublicReference][filename at dimension]
    \definefont[PublicReference][filename scaled number]

We already had that extended to:

    \definefont[PublicReference][filename]
    \definefont[PublicReference][filename at dimension]
    \definefont[PublicReference][filename scaled number]
    \definefont[PublicReference][filename sa number]

So let’s generalize that to:

    \definefont[PublicReference][filename scaling]

And in MkIV we now have:

    \definefont[PublicReference][filename*featurenames scaling]
    \definefont[PublicReference][filename:featurespecication scaling]
    \definefont[PublicReference][filename@virtualconstructor scaling]

The second variant is seldom used and is only provided because some users have
fonts defined in the XƎTEX way. Users are advised not to use this method. The
last method is special in the sense that it’s used to define fonts that are
constructed using the built in virtual font constructors. This method is for
instance used for defining virtual math fonts.

The first method is what we use most. It is really important not to forget the
feature specification. A rather safe bet is default. In a next chapter we will
discuss the differ- ence between these two; here we focus on the name part.

The filename is in fact a symbolic name. In ConTEXt we have always used an
indirect reference to fonts. Look at this:

    \definefont[TitleFont][SerifBold*default sa 2]

A reference like SerifBold makes it possible to define styles independent of
the chosen font family. This reference eventually gets resolved to a real name
and there can be a chain of references.

Font definitions can be grouped into a larger setup using typescripts. In that
case, we can set the features for a regular, italic, bold and bolditalic for
the whole set but when a fontname has a specific feature associated (as in the
previous examples) that one takes precedence.

So far we talked about fonts being files, but in practice a lookup happens by
file as well as by name as known to the system. In the next section this will
be explained in more detail.


# File


You can force a file lookup with:

    \definefont[TitleFont][file:somefilename*default sa 2]

If you use more symbolic names you can use the file: prefix in the mapping:

    \definefontsynonym[SerifBold][file:somefile]
    \definefont[TitleFont][SerifBold*default sa 2]

In projects that are supposed to run for a long time I always use the file
based lookup, because filenames tend to be rather stable. Also, as the lookup
happens in the TEX directory structure, file lookups will rely on the general
file search routines. This has the benefit that case is ignored. When no match
is found the lookup will also use the font name database. Spaces and special
characters are ignored.

The name alone is not enough as there can be similar filenames with different suffixes. Therefore the lookup will happen in the order otf, ttf, afm, tfm and lua. You can force a lookup by being more explicit, like:

    \definefont[TitleFont][file:somefilename.ttf*default sa 1]

# Accessing A Font By Name

Say that we want to use a Dejavu font and that instead of filenames we want to
use its given name. The best way to find out what is available is to call for
a list:

    mtxrun --script font --list --all dejavu

This could have produced the following list:

&img{image-font-format-7.png}

The first two columns mention the names that we can use to access a font.
These are normalized names in the sense that we only kept letters and numbers.
The next three definitions are equivalent:

    \definefont[TitleFont][name:dejavuserif*default sa 1]
    \definefont[TitleFont][name:dejavuserifnormal*default sa 1]
    \definefont[TitleFont][name:dejavuserif.ttf*default sa 1]

In the list you see two names that all point to dejavusans-extralight.ttf:

    dejavusansextralight
    dejavusanslight

There are some heuristics built into ConTEXt and we do some cleanup as well.
For instance we interpret the presence of the string ``ital`` as expressing an
italic typeface. In a font there is sometimes information about the weight and
we look at those properties as well. Unfortunately font names (even within a
collection) are often rather inconsistent so you still need to know what
you’re looking for. The more explicit you are, the less change of problems.


# Spec

There is often some logic in naming fonts but it’s not robust and really
depends on how consistent a font designer or typefoundry has been. In ConTEXt
we can access names by using a normalized scheme.

    name-weight-style-width-variant

The following values are valid:

weight
style 
width 
variant

For placeholder "weight" following values are valid:

    black bold demi demibold extrabold heavy light medium 
    mediumbold normal regular semi semibold ultra ultrabold 
    ultralight

For placeholder "style" following values are valid:

    italic normal oblique regular reverseitalic reverseoblique 
    roman slanted

For placeholder "width" following values are valid:

    book condensed expanded normal thin

For placeholder "variant" following values are valid:

    normal oldstyle smallcaps

The four specifiers are optional but the more you provide, the better the
match. Let’s give an example:

   mtxrun --script fonts --list --spec dejavu

This would have reported the list shown below:

&img{image-font-format-8.png}

We can be more specific, for instance:
    
    mtxrun --script fonts --list --spec dejavu-bold

The reported could have changed to the following:

&img{image-font-format-9.png}

We add another specifier:

    mtxrun --script fonts --list --spec dejavu-bold-italic

The list could have changed to the following:

&img{image-font-format-10.png}

As the first hit is used we need to be more specific with respect to the name,
so lets do that in an example definition:

    \definefont[TitleFont][spec:dejavuserif-bold-italic*default sa 1]

Watch the prefix spec. Wolfgang Schusters simplefonts module nowadays uses
this method to define sets of fonts based on a name only specification. Of
course that works best if a fontset has well defined properties.

As the first hit is used we need to be more specific with respect to the name,
so lets do that in an example definition:

    \definefont[TitleFont][spec:dejavuserif-bold-italic*default sa 1]

Watch the prefix spec. Wolfgang Schusters simplefonts module nowadays uses
this method to define sets of fonts based on a name only specification. Of
course that works best if a fontset has well defined properties.


# Creating New Font Names

A font definition looks as follows:

    \definefont
      [MyFont]
      [namepart method specification size]

For example:

    \definefont
      [MyFont]
      [Bold*default at 12.3pt]

We have already discussed the namepart and size in a previous chapter and here
we will focus on the method. The method is represented by a character and
although we currently only have a few methods there can be many more.

This one is seldom used, but those coming from another macro package to
ConTEXt might use it as first attempt to defining a font.

    \definefont
      [MyFont]
      [Bold:+kern;+liga; at 12.3pt]

This is the XƎTEX way of defining fonts. A + means as much as “turn on this
feature” so you can guess what the minus sign does. Alternatively you can use
a key/value approach with semicolons as separator. If no value is given the
value yes is assumed.

    \definefont
      [MyFont]
      [Bold:kern=yes;liga=yes; at 12.3pt]

When we started supporting XƎTEX we ran into issues with already present
features of ConTEXt as the XƎTEX syntax also has some more obscure properties
using slashes and brackets for signalling a file or name lookup. As in ConTEXt
we prefer a more symbolic approach anyway, it never was a real issue.

The most natural way to associate a set of features with a font instance is
the following:

    \definefont
      [MyFont]
      [Bold*default at 12.3pt]

This will use the featureset named default and this one is defined in
font-pre.mkiv which might be worth looking at.


    \definefontfeature
      [always]
      [mode=auto,
       script=auto,
       kern=yes,
       mark=yes,
       mkmk=yes,
       curs=yes]

    \definefontfeature
      [default]
      [always]
      [liga=yes,
       tlig=yes,
       trep=yes] % texligatures=yes,texquotes=yes

    \definefontfeature
      [smallcaps]
      [always]
      [smcp=yes,
       tlig=yes,
       trep=yes] % texligatures=yes,texquotes=yes

    \definefontfeature
      [oldstyle]
      [always]
      [onum=yes,
       liga=yes,
       tlig=yes,
       trep=yes] % texligatures=yes,texquotes=yes

    \definefontfeature % == default unless redefined
      [ligatures]
      [always]
      [liga=yes,
       tlig=yes,
       trep=yes]

    \definefontfeature % can be used for type1 fonts
      [complete]
      [always]
      [compose=yes,
       liga=yes,
       tlig=yes,
       trep=yes]

    \definefontfeature
      [none]
      [mode=none,
       features=no]

These definitions show that you can construct feature sets on top of existing
ones, but keep in mind that they are defined instantly, so any change in the
parent is not reflected in its kids.

In a font definition you can specify more than one set:

    \definefont
      [MyFont]
      [Bold*always,oldstyle at 12.3pt]




