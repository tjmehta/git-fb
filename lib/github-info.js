var keychain = require('keychain');
var spawn    = require('child_process').spawn;
var exec     = require('child_process').exec;
var $p       = require('procstreams');
var noop     = function () {};
var cleanStdout = function (strOrBuffer) {
  return strOrBuffer.toString().replace('\n', '');
};

var GitHubInfo = module.exports = function () {
  // private
  var username = '';
  var setUsername = function (_username) {
    username = _username;
  };
  var getUsername = function (cb) {
    setUsername('');
    exec('git config --get user.name', function (err, stdout, stderr) {
      if (err) {
        console.error("setUsername error.");
        cb(err);
      }
      else {
        stdout = cleanStdout(stdout);
        setUsername(stdout);
        cb(null, stdout);
      }
    });
  };
  var getPassword = function (cb) {
    keychain.getPassword({
      service: 'github.com',
      account: username,
      type   : 'internet'
    }, cb);
  };

  // public
  this.username = function (username, cb) {
    if (username instanceof Function) {
      cb = username;
      username = null;
    }
    cb = cb || noop;
    if (username instanceof String) {
      setUsername(username, cb);
    }
    else {
      getUsername(cb);
    }
  };
  this.password = function (cb) {
    cb = cb || noop;
    if (!username) {
      this.username(function (err, username) {
        if (err) { cb(err); } else {
          getPassword(cb);
        }
      }.bind(this));
    }
    else {
      getPassword(cb);
    }
  };
  this.repo = function (cb) {
    $p('git remote -v')
      .pipe('head -n1')
      .pipe('awk "{print $2}"')
      .pipe('sed -e "s/^.*github[.]com[/][^/]*[/]//"')
      .pipe('sed -e "s/[.]git.*$//"')
      .data(function (err, stdout, stderr) {
        if (err) {
          console.error('repo error.');
          cb(err);
        }
        else {
          cb(null, cleanStdout(stdout));
        }
      })
    ;
  };
  this.repoOwner = function (cb) {
    $p('git remote -v')
      .pipe('head -n1')
      .pipe('sed -e "s/^.*github[.]com[/]//"')
      .pipe('sed -e "s/[/].*$//"')
      .data(function (err, stdout, stderr) {
        if (err) {
          console.error('repoOwner error.');
          cb(err);
        }
        else {
          cb(null, cleanStdout(stdout));
        }
      })
    ;
  };
  this.branch = function (cb) {
    exec('git rev-parse --abbrev-ref HEAD', function (err, stdout, stderr) {
      if (err) {
        console.error("branch error.");
        cb(err);
      }
      else {
        cb(null, cleanStdout(stdout));
      }
    });
  };
  this.integrationBranch = function (cb) {
    exec('git config --get gitfb.integrationBranch', function (err, stdout, stderr) {
      if (err) {
        cb(null, 'master'); //default to master
      }
      else {
        cb(null, cleanStdout(stdout) || 'master');
      }
    });
  };
  this.get = function (cb) {
    var self = this;
    this.username(function (err, username) {
      if (err) { cb(err); } else {
        self.password(function (err, password) {
          if (err) { cb(err); } else {
            self.repoOwner(function (err, repoOwner) {
              if (err) { cb(err); } else {
                self.repo(function (err, repo) {
                  if (err) { cb(err); } else {
                    self.branch(function (err, branch) {
                      if (err) { cb(err); } else {
                        self.integrationBranch(function (err, integrationBranch) {
                          if (err) { cb(err); } else {
                            cb(null, {
                              username : username,
                              password : password,
                              repoOwner: repoOwner,
                              repo     : repo,
                              branch   : branch,
                              integrationBranch: integrationBranch
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  };
  this.getWips = function (cb) {

  };
};