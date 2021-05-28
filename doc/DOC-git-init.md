---
title: Initializing Repository
---


# Initialize an empty repository

With git/init, an empty repository is created in the current folder of your local hard drive. The git/add command then marks the current contents of your project directory for the next, and in this case, your first commit.

    $ git init
    $ git add .
    $ git commit -m "initial commit"

# Cloning

Another way to create a new repository is to use the git/clone command.

    $ git clone ssh://git@example.com/path/to/git-repo.git

# Import existing repository and uploading into GIT server

If we have a GIT repository `my_project` in our home folder, and we would like to upload this into your personal GIT server, here is how to do this.

    $ pwd
    /home/james/
    $ ls
    my_project/

The next step is to create a bare GIT repository from the existing respository.

    $ git clone --bare my_project my_project.git
    $ ls
    my_project/
    my_project.git/

Note that the `.git` extension should be used for any "bare" repository that is prepared with the `--bare` option. A server repository should always be a bare repository.

The next step is to upload the entire directory to the server. You can do that by running the `scp` command such as follows.

    $ scp -r my_project.git git@myserver:

This would have copied the entire directory that is `my_project` including the name of the directory itself into the remote server named `myserver` and place it just under the home directory of user `git`.

Alright, that's it. A new server respository has been set up at the remote location. And now you should be able to clone it using the following command:

    $ git clone ssh://git@myserver:my_project.git

An alternative approach that is less demanding is to directly create a bare repository on the server such as the following:

    $ ssh git@myserver
    username: <type username>
    password: <type password>
    $ pwd
    /home/git
    $ git init --bare my_project.git
    $ ls
    my_project.git/

This will create a new folder named `my_project.git` under the home bolder.


# Starting a new local respository

A local repository is the one you create for your projects that you would not, or have not decided to share with others. In this case, all the changes are made locally.

GIT has been designed to allow you to work in this situation. In this case, you will be creating a local repository that will keep track of the changes you have made to your files.

Let's suppose you have a local project named `my_project` in your home directory.

    $ pwd
    /home/james
    $ ls
    my_project/

You would first need to change to that directory by issuing a `cd` command such as the following.

    $ cd my_project
    $ pwd
    /home/james/my_project

Then you would need to issue a git/init command:

    $ git init

This command will assume that you are current at the root of your project and will then prepare a local repository for this project. The local repository is stored with the directory named `.git` that locates within the project root.

    $ ls -a
    .git/

After the local repository has been created, you are now supposedly able to add files to be tracked by this repository:

    $ git add file1.txt
    $ git add file2.txt

To commit, you issue the following command:

    $ git commit -m "added"
    <failure>

However, we would probably encounter some error at this time that GIT is asking for additional information. GIT typically needs to know the identity of the person committing the changes so that it can prepare for it when the time has come for this project to be shared with others, even though at the time the project is solely owned by the author alone. You can add these information by issuing the following commands:

    $ git config --global user.name <my-name>
    $ git config --global user.email <my-email>

Here, `user.name` and `user.email` are configuration keys that allows for storing of information for that keys: the first one being the name of the user and the second one being the email address. GIT requires that at least these two pieces of information being set before allowing the commit to go through.

    $ git commit -m "added"
    <success>
