##GitHub Flow Commands (feature-branch helpers)

##Bash Commands
#### ```git fb new-feature```
#### ```git sync```
#### ```git pullr "title" "description"```
#### ```git done```
#### ```git boom```
below provided by [git-wip](https://github.com/tjmehta/git-wip) (included):
#### ```git wip```
#### ```git unwip```
#### ```git resume some-feature```

##Requirements

Node.js - [Download here](http://nodejs.org/download/)

##How to Install

```sh
$ npm install -g git-fb
```

##Setup

If you want to setup you integration branch as something other than master use the following command:
```sh
$ git config gitfb.integrationBranch <integration-branch> # defaults to master
$ git config user.name <github-username> # not email
```


##Documentation

####git fb new-feature
```sh
$ git fb <new-feature-branch>
```
* creates a new branch off of the integration branch
  1. if on integration branch ```git stash``` else ```git wip``` * see git-wip below
  2. checks out the integration branch
  3. pulls down the integration branch from origin
  4. creates a branch with the name specified
  5. checks out the newly created branch
  6. pushes branch to origin
  7. if coming from integration branch and had stashed ```git stash pop```

```sh
$ git fb <new-feature-branch> <source-branch>
```
* creates a new branch off of the source branch
  1. if on source branch ```git stash``` else ```git wip```
  2. git fetch origin (to fetch branches from origin)
  3. checks out the source branch
  4. pulls down the source branch from origin
  5. creates a branch with the name specified
  6. checks out the newly created branch
  7. pushes branch to origin
  8. if coming from source branch and had stashed ```git stash pop```

####git sync
```sh
$ git sync
```
* pulls and merges the current branch to the latest integration branch (set as gitfb.integrationBranch or master)
  1. checks out the integration branch
  2. pulls down the integration branch from origin
  3. checks out the current branch again
  4. merges the integration branch into current branch
  5. commits automerge, if successful (else you manually merge and push on your own)
  6. pushes the current branch to origin

```sh
$ git sync <branch-to-sync-with>
```
* same as git sync except you can specify the branch you'd like to "sync" with

####git pullr "title" "description"
```sh
$ git pullr <title> <description>
```
* pull requests to integration branch (set as gitfb.integrationBranch or master)

```sh
$ git pullr <title> <description> <branch-to-pull-request-to>
```
* you can specify the branch to pull-request into, just remember it is the third parameter; so description is required

####git done
```sh
$ git done
```
* merges into default integration branch (set as gitfb.integrationBranch or master)
  1. checks out the integration branch
  2. merges the current branch
  3. commits automerge, if successful (else you manually merge and push on your own)
  4. deletes current branch locally
  5. deletes current branch on origin
  6. pushes integration branch to origin

```sh
$ git done <branch-to-merge-into>
```
* same as git done but you can specify the branch to merge into

####git boom some-feature
```sh
$ git boom <branch-to-delete>
```
* deletes branch locally and remotely

###Commands provided by [git-wip](https://github.com/tjmehta/git-wip):

####git wip
```sh
$ git wip
```
* alias for ```git add .; git commit -m __wip;```

####git unwip
```sh
$ git unwip
```
* checks if last commit is a wip and ```git reset HEAD^```

####git resume
```sh
$ git resume <branch>
```
* alias for ```git checkout <branch>; git unwip;```


##License
MIT

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/tjmehta/git-fb/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

