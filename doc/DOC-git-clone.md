---
title: Git Clone
doc: page
---

# Git clone command

git clone is primarily used to point to an existing repo and make 
a clone or copy of that repo at in a new directory, at another 
location. The original repository can be located on the local 
filesystem or on remote machine accessible supported protocols. 
The git clone command copies an existing Git repository.


# Purpose: repo-to-repo collaboration development copy

If a project has already been set up in a central repository, 
the git clone command is the most common way for users to obtain a development copy. 
Like git init, cloning is generally a one-time operation. 
Once a developer has obtained a working copy, all version control 
operations and collaborations are managed through their local repository.

Repo-to-repo collaboration

It’s important to understand that Git’s idea of a “working copy” is very 
different from the working copy you get by checking out code from an SVN 
repository. Unlike SVN, Git makes no distinction between the working copy 
and the central repository—they're all full-fledged Git repositories.

This makes collaborating with Git fundamentally different than with SVN. 
Whereas SVN depends on the relationship between the central repository and 
the working copy, Git’s collaboration model is based on repository-to-repository 
interaction. Instead of checking a working copy into SVN’s central repository, 
you push or pull commits from one repository to another.


git clone is primarily used to point to an existing repo and make a clone or 
copy of that repo at in a new directory, at another location. The original 
repository can be located on the local filesystem or on remote machine 
accessible supported protocols. The git clone command copies an existing 
Git repository. This is sort of like SVN checkout, except the “working copy” 
is a full-fledged Git repository—it has its own history, manages its own files, 
and is a completely isolated environment from the original repository.

As a convenience, cloning automatically creates a remote connection 
called "origin" pointing back to the original repository. This makes it 
very easy to interact with a central repository. This automatic connection 
is established by creating Git refs to the remote branch heads under 
refs/remotes/origin and by initializing 
``remote.origin.url`` and ``remote.origin.fetch`` 
configuration variables.

An example demonstrating using git clone can be found on the 
setting up a repository guide. The example below demonstrates how to 
obtain a local copy of a central repository stored on a server 
accessible at example.com using the SSH username john:

.sample

  git clone ssh://john@example.com/path/to/my-project.git 
  cd my-project 
  # Start working on the project

Following example clones the repository located at ＜repo＞ 
into the folder called ＜directory＞ on the local machine.

.sample

  git clone <repo> <directory>

Following example clones an existing repository such that the only contents
cloned are the branch named <tag>.

.sample

  git clone --branch <tag> <repo>

Clone the repository located at ＜repo＞ and only clone the 
history of commits specified by the option depth=1. 
In this example a clone of ＜repo＞ is made and only the most 
recent commit is included in the new cloned Repo. Shallow 
cloning is most useful when working with repos that have an 
extensive commit history. An extensive commit history may 
cause scaling problems such as disk space usage limits and 
long wait times when cloning. A Shallow clone can help 
alleviate these scaling issues.

.sample

  git clone -depth=1 <repo>


# The "bare" option

The git-clone command can be run with the switch ``--bare``.

    git clone --bare

Similar to the same switch when running git-init, when this same switch
is passed to git-clone, a copy of the remote repository is made with an 
omitted working directory. This means that a repository will be set 
up with the history of the project that can be pushed and pulled from, 
but cannot be edited directly. In addition, no remote branches for the 
repo will be configured with the -bare repository. Like git init --bare, 
this is used to create a hosted repository that developers will 
not edit directly.


# The "mirror" option

Passing the "mirror" argument implicitly passes the "bare" argument as 
well. This means the behavior of "bare" is inherited by "mirror". 
Resulting in a bare repo with no editable working files. 
In addition, "mirror" will clone all the extended refs of 
the remote repository, and maintain remote branch tracking configuration. 
You can then run git remote update on the mirror and it will 
overwrite all refs from the origin repo. Giving you exact "mirrored" functionality.


# The "template" option

The git-clone command can also be run with the ``--template`` option

    git clone --template=<template_directory> <repo location>



# URLs for accessing remote repositories

Git has its own URL syntax which is used to pass 
remote repository locations to Git commands. Because git 
clone is most commonly used on remote repositories we will 
examine Git URL syntax here.

Secure Shell (SSH) is a ubiquitous authenticated network 
protocol that is commonly configured by default on most servers. 
Because SSH is an authenticated protocol, you'll need to establish 
credentials with the hosting server before connecting. 

    ssh://[user@]host.xz[:port]/path/to/repo.git/

The GIT
protocol unique to git. Git comes with a daemon that runs on port (9418). 
The protocol is similar to SSH however it has NO AUTHENTICATION. 

    git://host.xz[:port]/path/to/repo.git/
 
The HTTP, or Hyper text transfer protocol
is the protocol of the web, most commonly used for transferring web page 
HTML data over the Internet. Git can be configured to communicate over HTTP. 

    http[s]://host.xz[:port]/path/to/repo.git/






