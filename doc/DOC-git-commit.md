---
title: Commiting Local Changes
---

To commit local changes, use the git/commit command.

    $ git commit -m <commit-comments>

The <commit-comments> argument attaches a text description to this commit so the text becomes part of the record that is kept permanently by GIT.

To see all the previous commits that we have made, we would use the command git/log such as:

    $ git log

The git/log command shows a list of commit. Each commit would be listed as a hash as well as the text comments that were provided at the time of that commit.

When a new file is created and needs to be added, we would use the git/add command to add it to the area called "index" first, before running the git/commit.

    $ touch <my-new-file>
    $ git add <my-new-file>
    $ git commit -m "added"

The git/add command first moves this file to another area called INDEX, which can be considered a "waiting room" in which one or more files are waiting for the next git/commit command to incorporate the changes that these files entails to be permanently recorded with the repository. Moving file to this area is also known as "staging", as for "staging files for commit".

We can call git/status to see if we have already made changes to local files that are different than the latest HEAD of the repository. Here, the word HEAD refers to the latest snapshot of the repository.

    $ git status

When git/status is run, it print out information regarding the status of the files being tracked, as well as any new files that are created and is eligible to be tracked but not yet done so. The word "track" here is to mean the fact whether GIT is made to be aware to keep track of the contents changes of a particular file.

The file being tracked could be a text file, and it could also be a binary file, such as a PNG image file. GIT tries to determine whether the file is a text file or an image file by its internal algorithm and will behave differently depending on each situation. GIT will print out some additional information when committing a binary file.

The git/add command come with several options allowing you some flexibility in choosing which file to add to the INDEX area.

    $ git add -A

The `-A` option stages everything in the current directory, including files that have been deleted, which will be staged for deletion.

    $ git add -u

Stage only modified files.

    $ git add .

This command would have staged everything in the current directory, but without the deleted file for deletion.

% !NTR .caption Git Data Transport Commands

~~~ pict
image git-data-transport.png
image git-data-transport.png
~~~ pict

- The WORKSPACE is the directory tree of (source) files that you see and edit.

- The INDEX is a single, large, binary file in <baseOfRepo>/.git/index, which lists all files in the current branch, their sha1 checksums, time stamps and the file name -- it is not another directory with a copy of files in it.

- The LOCAL REPOSITORY is a hidden directory (.git) including an objects directory containing all versions of every file in the repo (local branches and copies of remote branches) as a copressed "blob" file.

# Checking the differences between the commits

At anytime you can always go back the history and compare the differences of the two commit points.

    $ git diff
    diff --git a/myfile1.txt b/myfile1.txt
    <printout>

The git/diff command would, by default, compare the differences of files of the HEAD and the ones that have been modified and print the differences at the console.

You can also ask to compare just the file that you have changed against the local repository:

    $ edit helloworld.txt
    $ git diff HEAD helloworld.txt
    diff --git a/helloworld.txt b/helloworld.txt
    index e4f37c4..557db03 100644
    --- a/helloworld.txt
        b/helloworld.txt
    @@ -1  1 @@
    -Hello India
     Hello World

If you can recall, Git has the INDEX area that sits between _local repository_ and your _working directory_. So most of Git commands can either refer to index or the local repo. When you say HEAD in your Git command, it refers the local repo. Following are commands that will also compare with the INDEX.

    //  compare the working directory with local repository.
    git diff HEAD [filename]

    // compare the working directory with index.
    git diff [filename]

    // compare the index with local repository.
    git diff --cached [filename]

You can also compare files between two different commits. Every commit in Git has a commit id which you can get when you give git log. Then you can use the commit id if diff command like this.

    git diff 7eb2..e03 812...a3f35

You can compare not just a single file, but all your changes at once. If you made changes in many files, just don’t mention any file name in the diff command which will diff all the changed files.

    // compares working directory with index,
    // i.e. shows the changes that are not staged yet.
    git diff

    // compares working directory with local repository.
    // shows the list of changes after your last commit.
    git diff HEAD

    // compares index with local repository.
    // shows the diff between your last commit and changes
    // to be committed next.
    git diff --cached
