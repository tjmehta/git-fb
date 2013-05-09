GIT-FB
=========

Git feature-branch workflow helper commands

git fb <branch-name>: must be on a clean branch before this

git sync <branch-name:default-to-master>: stash changes; merge master to the current branch and push to origin; pop stash;

git boom <branch-name>: delete branch locally and remotely

git done: merge the current branch into master and delete the current branch

git pullr "<title>" "<description>" "<branch-name-to-creat-pr-for>

git config gitfb.integrationBranch <branch-name-to-be-default>