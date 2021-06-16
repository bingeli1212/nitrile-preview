---
title: Restoring Old Verions
---

Reset will rewind your current HEAD branch to the specified version.  In our
example above, we'd like to return to the one before the current revision -
effectively making our last commit undone.

    $ git reset --soft HEAD~1

Note the ``--soft`` flag: this makes sure that the changes in undone revisions
are preserved. After running the command, you'll find the changes as
uncommitted local modifications in your working copy.

If you don't want to keep these changes, simply use the ``--hard ``flag. 
Be sure to only do this when you're sure you don't need these changes anymore.

    $ git reset --head HEAD~1

The same technique allows you to return to any previous revision:

    $ git reset --hard 0ad5a7a6

As said, using the reset command on your HEAD branch is a quite drastic action:
it will remove any commits (on this branch) that came after the specified
revision. If you're sure that this is what you want, everything is fine.

However, there is also a "safer" way in case you'd prefer leaving your current
HEAD branch untouched. Since "branches" are so cheap and easy in Git, we can
easily create a new branch which starts at that old revision:

    $ git checkout -b old-project-state 0ad5a7a6

Normally, the checkout command is used to just switch branches. However,
providing the -b parameter, you can also let it create a new branch (named
"old-project-state" in this example). If you don't want it to start at the
current HEAD revision, you also need to provide a commit hash - the old project
revision we want to restore.

Voilà: you now have a new branch named "old-project-state" reflecting the old
version of your project - without touching or even removing any other commits
or branches. You can then merge the change in this branch to that of the HEAD,
effectively "restoring" the old changes.



