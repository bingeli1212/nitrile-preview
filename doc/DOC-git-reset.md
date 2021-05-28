---
title: Restoring Old Verions
---


# How can I restore a previous version of my project?

Using a version control system like Git brings a fantastic benefit: you can
return to any old version of your project at any time. Returning to an Old
Revision

The fastest way to restore an old version is to use the "reset" command:

    $ git reset --hard 0ad5a7a6

This will rewind your HEAD branch to the specified version. All commits that
came after this version are effectively undone; your project is exactly as it
was at that point in time.

The reset command comes with a couple of options, one of the more interesting
ones being the "--soft" flag. If you use it instead of --hard, Git will keep all
the changes in those "undone" commits as local modifications:

    $ git reset --soft 0ad5a7a6

You'll be left with a couple of changes in your working copy and can then decide
what to do with them.

# Restoring a Revision in a New Local Branch

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
version of your project - without touching or even removing any other commits or
branches.
