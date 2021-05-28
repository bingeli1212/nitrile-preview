---
title: Checking Out Code
---


# The problem with a detached HEAD

The HEAD pointer in Git determines your current working revision
(and thereby the files that are placed in your project's working
directory). Normally, when checking out a proper branch name, Git
automatically moves the HEAD pointer along when you create a new
commit. You are automatically on the newest commit of the chosen
branch.

When you instead choose to check out a commit hash, Git won't do
this for you. The consequence is that when you make changes and
commit them, these changes do NOT belong to any branch.  This
means they can easily get lost once you check out a different
revision or branch: not being recorded in the context of a
branch, you lack the possibility to access that state easily
(unless you have a brilliant memory and can remember the commit
hash of that new commit...).

# When a detached HEAD shows up

There are a handful of situations where detached HEAD states are
common:

- Submodules are indeed checked out at specific commits instead
  of branches.
- Rebase works by creating a temporary detached HEAD state while
  it runs.

# Where a detached HEAD should not show up

Additionally, another situation might spring to mind: what about
going back in time to try out an older version of your project?
For example in the context of a bug, you want to see how things
worked in an older revision.

This is a perfectly valid and common use case. However, you don't
have to maneuver yourself into a detached HEAD state to deal with
it. Instead, remember how simple and cheap the whole concept of
branching is in Git: you can simply create a (temporary) branch
and delete it once you're done.

  $ git checkout -b test-branch 56a4e5c08

  ...do your thing...

  $ git checkout master
  $ git branch -d test-branch


