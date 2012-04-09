#!/usr/bin/env node
require('shelljs/make');

var root = __dirname;

//
// Docs
//
target.docs = function() {
  cd(root);

  echo('_________________________________________________________________');
  echo('Building docs');

  var apiDocs = grep('//@',
      'lib/core.js',
      'lib/window.js',
      'lib/canvas.js',
      'lib/canvascontext2d.js',
      'lib/image.js',
      'lib/audiocontext.js',
      'lib/audiobuffersource.js'
    ).replace(/ *\/\/\@ */g, '');
  
  sed(/# API reference(.|\n)*/, '# API reference\n\n' + apiDocs, 'README.md').to('README.md');
}


//
// Test
//
target.test = function() {
  cd(root);

  echo('_________________________________________________________________');
  echo('Running Node-Five tests');
  echo();

  cd('test');
  rm('-f', 'img-test/*');
  ls('*.js').forEach(function(f) {
    echo('Running test file '+f);
    exec('node '+f);
  });
}


//
// Ref
//
target.ref = function() {
  cd(root);

  echo('_________________________________________________________________');
  echo('Node-Five tests: Overwriting reference images');
  rm('-f', 'img-ref/*');
  mv('img-test/*', 'img-ref');
}
