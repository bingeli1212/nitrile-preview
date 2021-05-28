---
title: Compare What Is Changed 
---

Various ways to check your working tree.

Following command shows changes in the working tree not yet staged for the next
commit.

    $ git diff            

Following command shows changes between the index and your last commit; what
you would be committing if you run git commit without -a option.

    $ git diff --cached  

Following command shows changes in the working tree since your last commit;
what you would be committing if you run git commit -a

    $ git diff HEAD     

The git-diff command can also be used to compare across branches. 
Following would compare the current changes of the file against
the tip of the 'test' branch.

    $ git diff test

Instead of comparing with the tip of "test" branch, compare with the tip of the
current branch, but limit the comparison to the file "test".

    $ git diff HEAD -- ./test.md

Following command would show the differences between before two commit points:
the last commit and the one before: the last commit is denoted by "HEAD", and
the one before the last commit is "HEAD^".

    $ git diff HEAD^ HEAD

The following command would show the same differences but would limit the
comparison to the file "./test.md" only.

    $ git diff HEAD^ HEAD -- ./test.md

The commit points can be expressed such as "HEAD", "HEAD^", the hash,
and the name of a branch name. Following command would have shown
the result of changes between two commit points.

    $ git diff topic master
    $ git diff topic..master

Following command would show all the changes occurred on the 'master'
branch from the time the 'topic' branch was created.

    $ git diff topic...master

To limit the changes to a particular file, use the double hyphen followed
by the name of the file. However, the output of the changes could also
be modified such as to show only certain aspects of the change.
Following command would show all changes that are related to modifications,
renames, and copies, but not additions and deletions. 

    $ git diff --diff-filter=MRC

Following command would show only names and the nature of changes, but not
actual diff output.

    $ git diff --name-status

Typically to limit the scope of files it would require the appearance of double
hyphen before the name of the file, but sometimes the double hyphen could be
omitted if the commit points are presented. For instance, follow command would
have shown all the changes in the working tree not yet staged for the next
commit, but limiting the scope of files to those only live in the two sub
directories of "arch/i386" and "include/asm-i386".

    $ git diff -- arch/i386 include/asm-i386
    $ git diff arch/i386 include/asm-i386

Following command would Spend extra cycles to find renames, copies and complete
rewrites (very expensive).

    $ git diff --find-copies-harder -B -C

Following command would show output in reverse.

    $ git diff -R








