---
title: Git Gui
doc: page
---

# The gui-git command

The git-gui command shows a Tcl/Tk based graphical user interface (GUI) to Git. This GUI
focuses on allowing users to make changes to their repository by making new
commits, amending existing ones, creating branches, performing local merges,
and fetching/pushing to remote repositories.

Unlike gitk, git-gui focuses on commit generation and single file annotation
and does not show project history. It does however supply menu actions to start
a gitk session from within git gui.

git-gui is known to work on all popular UNIX systems, Mac OS X, and Windows
(under both Cygwin and MSYS). To the extent possible OS specific user interface
guidelines are followed, making git gui a fairly native interface for users.

To use git-gui, start with "git gui" and then follow it with additional commands
and switches. The additional commands are discussed below.

+ blame
  Start a blame viewer on the specified file on the given version (or working directory if not specified).

+ browser
  Start a tree browser showing all files in the specified commit. Files selected through the browser are opened in the blame viewer.

+ citool
  Start git gui and arrange to make exactly one commit before exiting and returning to the shell. The interface is limited to only commit actions, slightly reducing the application’s startup time and simplifying the menubar.

+ version
  Display the currently running version of git gui.

Following are additional examples of using git-gui.
  
> git gui blame Makefile

  Show the contents of the file Makefile in the current working directory, and
  provide annotations for both the original author of each line, and who moved
  the line to its current location. The uncommitted file is annotated, and
  uncommitted changes (if any) are explicitly attributed to Not Yet Committed.

> git gui blame v0.99.8 Makefile

  Show the contents of Makefile in revision v0.99.8 and provide annotations for
  each line. Unlike the above example the file is read from the object database
  and not the working directory.

> git gui blame --line=100 Makefile

  Loads annotations as described above and automatically scrolls the view to
  center on line 100.

> git gui citool

  Make one commit and return to the shell when it is complete. This command
  returns a non-zero exit code if the window was closed in any way other than
  by making a commit.

> git gui citool --amend

  Automatically enter the Amend Last Commit mode of the interface.

> git gui citool --nocommit

  Behave as normal citool, but instead of making a commit simply terminate with
  a zero exit code. It still checks that the index does not contain any
  unmerged entries, so you can use it as a GUI version of git-mergetool[1]

> git citool

  Same as git gui citool (above).

> git gui browser maint

  Show a browser for the tree of the maint branch. Files selected in the
  browser can be viewed with the internal blame viewer.




