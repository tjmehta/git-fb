var keychain = require('keychain');
var spawn    = require('child_process').spawn;
var noop     = function () {};

var GitHubInfo = module.exports = function () {
  // private
  var username = '';
  var processOutput = function (command, cb) {
    var split = command.split(' ');
    command = split.shift();

    spawn(command, split, {cwd:process.cwd()})
      .stdout.on('data', function (data) {
        stdout += data;
      })
      .on('exit', function (code, signal) {
        stdout = stdout.trim();
        if (code) {
          cb(new Error('ProcessError code '+code));
        }
        else if (!stdout) {
          cb(new Error('Stdout empty'));
        }
        else {
          cb(null, stdout);
        }
      })
    ;
  };
  var setUsername = function (_username) {
    username = _username;
  };
  var getUsername = function (cb) {
    var stdout = '';
    setUsername('');
    processOutput('git config --get user.name', function (err, stdout) {
      if (err) { cb(err); } else {
        username = stdout;
        cb(null, username);
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
    processOutput('git remote -v | head -n1 | awk "{print $2}" | sed -e "s,.*:\(.*/\)\?,,"  -e "s/\.git$//" | sed -e "s/^.*\/.*\///"', function (err, stdout) {
      if (err) { cb(err); } else {
        cb(null, stdout);
      }
    });
  };
  this.branch = function (cb) {
    processOutput('git rev-parse --abbrev-ref HEAD', function (err, stdout) {
      if (err) { cb(err); } else {
        cb(null, stdout);
      }
    });
  };
  this.integrationBranch = function (cb) {
    processOutput('git config --get gitfb.integrationBranch', function (err, stdout) {
      if (err) { cb(err); } else {
        cb(null, stdout);
      }
    });
  };
  this.get = function (cb) {
    this.username(function (err, username) {
      if (err) { cb(err); } else {
        this.password(function (err, password) {
          if (err) { cb(err); } else {
            this.repo(function (err, repo) {
              if (err) { cb(err); } else {
                this.branch(function (err, branch) {
                  if (err) { cb(err); } else {
                    this.integrationBranch(function (err, branch) {
                      if (err) { cb(err); } else {
                        cb(null, {
                          username : username,
                          password : password,
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
  };
};