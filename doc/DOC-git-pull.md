---
title: Managing Remote and Local Repositories
---

To incorporate changes from a remote site, you would use the git/remote command such as follows.

    $ git pull

An alternative approach is to only download the remote changes and then inspect them before incorporate them. In this way you can use git/fetch.

    $ git fetch

To publish the changes you would need to use the git/push command.

    $ git push <remote> <branch>

If we are working with another team on the same branch and would like to both publish/merge the changes on this branch, then we can add a `-branch` option to the git/checkout command when switching to this branch. This way, we can later on share the additional commits we have made at any time with the git/push command.

    $ git checkout -track <remote>/<branch>

    
