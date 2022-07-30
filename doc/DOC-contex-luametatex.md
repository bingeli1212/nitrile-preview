% !TEX title = LuaMetaTex



# README      

CONTEXT LMTX is a self contained installation of the CONTEXT macro package. It
is the follow up on MKII and MKIV and uses the LUAMETATEX engine.

- 32 bit Microsoft Windows
- 64 bit Microsoft Windows
- 64 bit Microsoft Windows ARM
- 32 bit Linux
- 64 bit Linux
- 64 bit Linux Musl
- 32 bit Linux ARM
- 64 bit Linux ARM
- 64 bit Mac OSX
- 64 bit Mac OSX ARM
- 32 bit Free BSD
- 64 bit Free BSD
- 64 bit OpenBSD 7.0
- 64 bit OpenBSD 7.1

Installation is straightforward (on paper):

- create a directory for, e.g. data/context
- go there and download the relevant zip
- unpack the archive
- on UNIX set the executable permissions for install.sh
- on WINDOWS run the install.bat
- on UNIX run the install.sh file

On WINDOWS you can best run the script as administrator because that will use
shortcuts to programs instead of copies which is more efficient. There you can
also run the setpath.bat file.

You can update an installation by running the same script again. Keep an eye on
developments (via the mailing list). This follow up is relatively new and
experimental but will eventually be the main setup.

Where MKII runs on top of PDFTEX and XETEX, and MKIV on top of LUATEX, LMTX
uses LUAMETATEX (but it can use LUATEX too). This installation contains only
the MKIV files but we do offer the usual zip files with all files. The TEX tree
contains all documentation and some example files. Support is provided at:

- mailing list (subscribe)
- web page
- archive(s)
- wiki

The formal release will happen at the 2019 CONTEXT meeting. Around that time we
also hope to have adapted the compile farm to support more platforms and mirror
the installer on the CONTEXT garden. The source code of LUAMETATEX will become
part of the regular CONTEXT distribution so that users have an complete
archival snapshot bundle.

If you want more information about CONTEXT and what kind of extra support we
can provide, you can always contact us.

| PRAGMA Advanced Document Engineering
| Ridderstraat 27, 8061GH Hasselt NL
| +31 (0)38 477 53 69
| info: pragma at xs4all dot nl
