Git feature-branch workflow helper commands

How to Install:::

npm install -g git-fb

Commands:::

git fb "<new-feature-branch>"
* creates a new branch off of the integration branch
1) checks out the integration branch
2) pulls down the integration branch from origin
3) creates a branch with the name specified
4) checks out the newly created branch
4) pushes branch to origin

git sync
* pulls and merges the current branch to the latest integration branch (set as gitfb.integrationBranch or master)
1) checks out the integration branch
2) pulls down the integration branch from origin
3) checks out the current branch again
4) merges the integration branch into current branch
5) commits automerge, if successful (else you manually merge and push on your own)
6) pushes the current branch to origin

git sync "<branch-to-sync-with>"
* same as git sync except you can specify the branch you'd like to "sync" with

git pullr "<title>" "<description>"
* pull requests to integration branch (set as gitfb.integrationBranch or master)

git pullr "title" "description" "<branch-to-pull-request-to>"
* you can specify the branch to pull-request into, just remember it is the third parameter; so description is required

git done
* merges into default integration branch (set as gitfb.integrationBranch or master)
1) checks out the integration branch
2) merges the current branch
3) commits automerge, if successful (else you manually merge and push on your own)
4) deletes current branch locally
5) deletes current branch on origin
* This does not push after it

git done <branch-to-merge-into>
* same as git done but you can specify the branch to merge into
