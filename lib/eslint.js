'use strict';
let extname = require('path').extname;
let exec    = require('child_process').exec;
let spawn   = require('child_process').spawn;

//customized eslint file before commit
let diffIndexOptions = [
  'diff-index',
  '--diff-filter=AM',
  '--name-only',
  'HEAD'
];
listStagedFiles(diffIndexOptions, function(err, stagedFiles) {
  if (err) {    
    process.exit(err);
  }

  let files;
  let extensions = ['js'];


  let jsExtensionRegex = new RegExp('^.(?:' + extensions.join('|') + ')$', 'i');

  files = stagedFiles.filter(function(file) {
    let extension = extname(file);
    return jsExtensionRegex.test(extension);
  });
  // If we found any files to check, run eslint on them
  // otherwise, just exit -- nothing to do
  if (files.length > 0) {
    lintFiles(files);
  }
});

// List all javascripty files to be committed
function listStagedFiles(diffIndexOptions, cb) {
  let child = exec('git ' + diffIndexOptions.join(' '), { encoding: 'utf8' }, function(err, stdout, stderr) {
    if (err) return cb(buildError(err, child.exitCode));
    else if (child.exitCode !== 0) return cb(buildError(stderr, child.exitCode));
    else {
      let stagedFiles = stdout.split('\n');
      return cb(null, stagedFiles);
    }
  });
}

function lintFiles(files) {
  // Use --quiet option to suppress warnings and only print errors.
  let child = spawn('eslint --quiet', files, { encoding: 'utf8', shell: true, stdio: 'inherit' });
  child.on('close', function(code) {
    process.exit(code);
  });
}

function buildError(msg, code) {
  let error = new Error(msg);
  error.code = code;
  return error;
}