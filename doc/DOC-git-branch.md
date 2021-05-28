---
title: Creating Git Branches
---

To see a list of branches.

    $ git branch

You can create a new branch by using the git-branch command. Following example
creates a new branch named "hotfix".

    $ git branch hotfix

To see what branches are current available, use the ``-l`` option.

    $ git branch -l
    *master
     hotfix

The asterisk in front of the branch name states that the current checkout
branch is "master". To switch to the branch "hotfix" the following
command can be issued.

    $ git checkout hotfix
    $ git branch -l
     master
    *hotfix
    
If we are working with another team on the same branch and would like to both
publish/merge the changes on this branch, then we can add a ``-track`` option to
the git/checkout command when switching to this branch. This way, we can later
on share the additional commits we have made at any time with the git/push
command. The following command would check out a branch that is created by
John which has been pushed and ready for download. The ``-track`` option
would set up the checkout of this branch "johnsbranch" in such a way that 
any local changes to this branch would be able to be pushed remotely to be 
merged with others.

    $ git checkout -track <remote>/johnsbranch

Any time a local branch is not needed it should be deleted.  Deleting it would
have required the same git-branch command but with the ``-d`` option followed
by the name of the branch itself.

    $ git branch -d hotfix

The ``-D`` option would force deletion of a branch.

    $ git branch -D hotfix

Delete the branch on github :

    $ git push origin :hotfix

If the changes of the branch needs to be merged back to the master branch,
then it can be done by first switching to the master branch, and then
issuing the git-merge command such as follows.

    $ git checkout master
    $ git merge hotfix
    Updating f42c576..3a0874c
    Fast-forward
     index.html | 2 ++
     1 file changed, 2 insertions(+)

If you have noticed the phrase "fast-forward" in the merge, it means that nobody
has made any changes and commited them to the master branch 
after the "hotfix" branch was made. In this case there is no need to merge
these changes with those in "hotfix", and the "master" branch can simply skip
forward to be the same as that of the "hotfix".

On the other hand, let's suppose that we needed to merge changes in branch
"iss53" into the "master", and the "master" has had changes made to it after
the "iss53" was branched off. This means that there are changes in the "master"
that would have to be "incorporated" into the changes of the current branch,
and only after they have been "incorporated" successfully can it become the
official contents of the "master" branch. This also means that Git cannot
simply "fastforward" to the tips of the "iss53" itself.

    $ git checkout master
    Switched to branch 'master'
    $ git merge iss53
    Merge made by the 'recursive' strategy.
    index.html |    1 +
    1 file changed, 1 insertion(+)

The output of this command can be observed from the example above. The result
of this is a new commit called "merge commit". Instead of a normal commit done
by the command git-commit, this merge commit is done by Git with the contents
that is automatically created by Git itself after it has performed a so called
"three-way merge" action. This action would look at the tip of "iss53", the tip
of "master", and their common ancester, and come up with the content that would
incorporate changes from both places. 

This new "merge commit" is typically done successfully when the three-way merge
itself had completed successfully. However, in the case when there had been
merge conflicts, then Git would not have created "merge commit". Instead, it
would have "added" the files that had actually passed the "merge conflict"
test, and then "leaves" those that had merge conflict untouched, except for
updating their contents such that the part of the file where merge conflict
happened is marked with some special characters, such as  <<<<<<<, =======, and
>>>>>>> lines. 

    <<<<<<< HEAD:index.html
    <div id="footer">contact : email.support@github.com</div>
    =======
    <div id="footer">
     please contact us at support@github.com
    </div>
    >>>>>>> iss53:index.html

For example, the area of a file could look like the one shown above. Git has
changes the file such that the lines between <<<<<<< and ======= are the
changes that currently live inside the "master" branch, and the contents
between ======= and >>>>>>> lines are the ones that are made within the "iss53"
branch. Users are required to "resolve" these conflict manually by pick and
choose the changes they wanted to keep. They would keep making changes to the
file so that this portion would look exactly what they think it should be, and
then save the file.  User should also ensure that the lines marked by <<<<<<<,
=======, and >>>>>>> be removed.

Users should proceed to do this for each one of the file that are in conflict.
Once all files are done, they should proceed to create a manual "merge commit",
by following the typical commit process, such as to do a git-add of these files,
followed by git-commit.

The git-status command can be issued immediately after git-merge to see which
files are marked as merge conflict by Git. The following is a likely output
immediately after the return of the git-merge and before any file was being
manually edited.

    $ git status
    On branch master
    You have unmerged paths.
      (fix conflicts and run "git commit")

    Unmerged paths:
      (use "git add <file>..." to mark resolution)

        both modified:      index.html

    no changes added to commit (use "git add" and/or "git commit -a")

The same git-status command can be run again to re-examine the files that had
previously been marked as conflict had instead been modified in such a way that
the conflicts are now resolved.  (Git could be doing this by looking at the
presence of <<<<<<<, =======, and >>>>>>> lines.) If the answer is affirmative,
then the git-status command could have returned the following message.

    $ git status
    On branch master
    All conflicts fixed but you are still merging.
      (use "git commit" to conclude merge)

    Changes to be committed:

        modified:   index.html

This means that it has detected that all file previously been marked as having
a merged conflict are now been cleaned up and ready to be commited.
Use should have to issue the following commands:

    $ git add index.html
    $ git commit 






