% !TEX title = Standalone Distribution
% !TEX peek = folio




# Installing for WINDOWS

Following instruction allows for CONTEX suite to be installed 
alongside existing MikTeX/TeXLive (needed if you also run LaTeX).

First, download the installation file from this link:

    "http://minimals.contextgarden.net/setup/context-setup-mswin.zip"
or

    "http://minimals.contextgarden.net/setup/context-setup-win64.zip"

Unzip this file, rename the unzipped top-level directory to "context",
and place it inside "C:\WINDOWS", such that it becomes "C:\WINDOWS\context".

Start the user prompt program, change directory to "C:\WINDOWS\context", and
run the following batch file.

    $ first-setup.bat

This batch file is designed to install the latest CONTEX suite inside this
directory (it will fetch remote contents while doing so). 

The installed CONTEX suite is always the latest development suite, which may
not be the latest stable suite.  To always install the latest stable suite,
run the following command instead.

    $ first-setup.bat --context=latest

By default, the batch file does not automatically install modules and other
third party contents.  To force all modules to be installed on top of existing
suite contents, add the "--module=all" command line switch to the
"first-setup.bat" batch file command.

    $ first-setup.bat --modules=all

The "all" option above expresses that *all* modules should be installed, which
could take a long time time depending on the bandwidth. If only a selected few
modules are to be installed, such as only that of "t-letter" and "t-mathsets",
replace "all" with the list of module names, each separated by a comma.

    $ first-setup.bat --modules="t-letter,t-mathsets"

After the installation has completed, run the "setuptex.bat" file which is
located at the following location. This batch file needs to be run once only
for each user prompt window.  This batch file is designed to perform setup of
needed environments which are essential to run programs such as "context"
successfully.                   

    $ C:\Programs\context\tex\setuptex.bat

When environments are preloaded, the "context" command is recognized 
without full-path.

    $ context --version

Following is an example of starting a new user prompt program preloaded with
needed environments.

    $ C:\WINDOWS\System32\cmd.exe /k C:\Programs\context\tex\setuptex.bat

If running from an editor, following command can be used.

    C:\context\tex\texmf-win64\bin\mtxrun.exe --autogenerate --script context --autopdf myfile.tex



# Installing for MAXOSX

The recommanded place for hosting the installation folder is
the "$HOME/context", which would need to be manually created
as such,

    $ cd
    $ mkdir context

Following commands are to be run to download the installation 
file.

    $ cd context
    $ rsync -av rsync://contextgarden.net/minimals/setup/first-setup.sh .

Note that for LINUX the "rsync" command can be replaced by "wget" command
which is to be run as follows,

    $ wget http://minimals.contextgarden.net/setup/first-setup.sh

After the download has completed, run the following command,

    $ sh ./first-setup.sh --modules=all

This script will *install* the standalone CONTEX. Once, done, and before
invoking "context" command, it is recommanded to *always* run the following
script once for each new terminal program.

    $ source $HOME/context/tex/setuptex

ConTeXt suite works in a non-interfering manner because it does not put
anything in your $PATH and does not set any system variables. This in turn
means that in order to use it, you need to do some initialization. An
intialization script called setuptex is provided in installation-dir/tex/.

The easiest way to run CONTEX from an editor is to open a terminal, source
"setuptex" in the terminal, and then open your editor from the same terminal.

Another option is to add "$HOME/context/tex/texmf-<platform>/bin" to the
$PATH that the editor searches. The details vary depending on the editor. See
Text Editors for instructions on integrating ConTeXt with various editors.

To update to the latest suite from the current installed suite, first download
the latest "first-setup.sh" the same way as the initial download does.

    $ rsync -ptv rsync://contextgarden.net/minimals/setup/first-setup.sh .

To install and overwrite existing installations, do,

    $ sh ./first-setup.sh --modules=all

To update retain currently-installed modules:

    $ sh ./first-setup.sh --keep





# Uninstalling

ConTeXt suite does not touch anything outside its installation folder. So to
uninstall it, you can simply remove the installation folder.



# Remaking formats

Normally, the update script should create the formats for you. If for some
reason you need to recreate the formats, you can do the following:

For making MKII format.

    mktexlsr
    texexec --make --all 

For making XeTeX format

    mktexlsr
    texexec --make --xtx --all 

For making MKIV format

    mtxrun --generate
    context --make








