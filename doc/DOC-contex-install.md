---
title: Installation
---


# Installation

The general steps to install ConTeXt LMTX are as follows:

* Create a directory for ConTeXt.
* Download the platform-specific archive file into the ConTeXt directory.
* Unpack the archive.
* Execute the install program, which downloads the distribution.
* Update the PATH environment variable.
* Optionally, delete the archive file.

See the next sections for instructions specific to various platforms.


# Unix

The steps in this section show how to download and install ConTeXt for a 64-bit
Linux system. Change the archive file download link as needed for your target
platform. Open a new terminal then run the following commands:

* mkdir $HOME/bin/context
* cd $HOME/bin/context
* wget http://lmtx.pragma-ade.nl/install-lmtx/context-linux-64.zip
* unzip context-linux-64.zip
* sh install.sh

Update the PATH environment variable by using the path instructions displayed
when the install program finishes. The instructions will vary depending on the
type of shell being used:

* Bash: echo 'export PATH=...instructions...:$PATH' >> ~/.bashrc
* Zsh: echo 'export PATH=...instructions...:$PATH' >> ~/.zshenv
* Sh/Ksh: echo 'export PATH=...instructions...:$PATH' >> ~/.profile
* Tcsh/csh: echo 'set path = ($path ...instructions...)' >> ~/.cshrc

For example, if ConTeXt was downloaded into $HOME/bin/context on a system
running bash, then the following line would update the PATH environment
variable:

    echo 'export PATH=$HOME/bin/context/tex/texmf-linux-64/bin:$PATH' >> ~/.bashrc


# MacOS

The instructions for MacOS are the same as for Unix, but note that:

* MacOS versions from Catalina (10.15) and newer use Zsh by default.
* MacOS versions before Catalina use Bash by default.


# Windows

Complete the following steps to set up ConTeXt on Windows:

* Create a directory for ConTeXt, such as C:\context.
* Download the architecture-specific version into the ConTeXt directory.
* Extract the archive.
* Run: install.bat
* Run: setpath.bat

Installation is complete.


# First Run

This section describes how to run ConTeXt to transform your first TeX document
into a PDF.

* Download the tex input file Hello-World.tex from our Detailed example.
* Run context Hello-world.tex in your terminal (or command prompt).
* Check the PDF output Hello-world.pdf.


# Command Line

Following is the command to run to compile a CONTEX document.

    $HOME/bin/context/tex/texmf-osx-64/bin/mtxrun --autogenerate --script context --autopdf $*




