// Copyright (c) 2011, Mozilla Corporation
// All rights reserved.
//
// Author(s): Artur Adib <aadib@mozilla.com>
//
// You may use this file under the terms of the New BSD license as follows:
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of Mozilla Corporation nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
// ARE DISCLAIMED. IN NO EVENT SHALL MOZILLA CORPORATION BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF 
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var assert = require('assert'),
    calango = require('..'),
    test = require('./test');

function checkDefaults(ctx) {
  assert.equal(ctx.fillStyle, '#000000');
  assert.equal(ctx.strokeStyle, '#000000');
  assert.equal(ctx.font, '10px sans-serif');
}

// Getters, setters
{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  checkDefaults(ctx);

  ctx.save();

  //
  // fillStyle, strokeStyle
  //

  ctx.fillStyle = ' #030201  ';
  assert.equal(ctx.fillStyle, '#030201');
  ctx.strokeStyle = ' #030201  ';
  assert.equal(ctx.strokeStyle, '#030201');

  ctx.fillStyle = ' blue  ';
  assert.equal(ctx.fillStyle, '#0000ff');
  ctx.strokeStyle = ' blue  ';
  assert.equal(ctx.strokeStyle, '#0000ff');

  ctx.fillStyle = '   rgb ( 1,2,  3)    ';
  assert.equal(ctx.fillStyle, '#010203');
  ctx.strokeStyle = '   rgb ( 1,2,  3)    ';
  assert.equal(ctx.strokeStyle, '#010203');

  ctx.fillStyle = '   rgba ( 3,1,  2, 1.0)    ';
  assert.equal(ctx.fillStyle, '#030102');
  ctx.strokeStyle = '   rgba ( 3,1,  2, 1.0)    ';
  assert.equal(ctx.strokeStyle, '#030102');

  ctx.fillStyle = '   rgba ( 2,3,  1, 0.2311111)    ';
  // FF seems to use 2 decimal points precision
  assert.equal(ctx.fillStyle, 'rgba(2, 3, 1, 0.23)');
  ctx.strokeStyle = '   rgba ( 2,3,  1, 0.2311111)    ';
  // FF seems to use 2 decimal points precision
  assert.equal(ctx.strokeStyle, 'rgba(2, 3, 1, 0.23)');

  //
  // Font
  //

  ctx.font = '15px helvetica';
  assert.equal(ctx.font, '15px helvetica');

  ctx.font = '   15px   helvetica  ';
  assert.equal(ctx.font, '15px helvetica');

  ctx.font = '   1px   sans-serif  ';
  assert.equal(ctx.font, '1px sans-serif');

  ctx.font = '5px arial';
  ctx.font = '   1pxx   sans-serif--  '; // induce parse error
  assert.equal(ctx.font, '5px arial');

  // Defaults
  ctx.restore();

  checkDefaults(ctx);
}

// Regression tests
{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillRect-black-sq', canvas, function() {
    ctx.fillRect(0, 0, 10, 10);
  });
}

{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillRect-black-sq2', canvas, function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 20, 20);
    
    canvas.width = canvas.width; // reset canvas pixmap, as per spec

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 10, 10); // should be only square
  });
}

{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillRect-red-sq', canvas, function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 10, 10);
  });
}

{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillRect-blue-sq', canvas, function() {
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(0, 0, 10, 10);
  });
}

{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillText-hello-black', canvas, function() {
    ctx.fillText('hello', 20, 20);
  });
}

{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillText-hello-green', canvas, function() {
    ctx.fillStyle = 'green';
    ctx.fillText('hello', 20, 20);
  });
}

{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillText-hello-big-arial', canvas, function() {
    ctx.font = '40px arial';
    ctx.fillText('hello', 20, 50);
  });
}

{
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillText-hello-big-courier', canvas, function() {
    ctx.font = '40px courier';
    ctx.fillText('hello', 20, 50);
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillRect-many-rgb-colored', canvas, function() {
    var i, j;
    for (i=0;i<6;i++) {
      for (j=0;j<6;j++) {
        ctx.fillStyle = 'rgb(' + Math.floor(255-42.5*i) + ',' +   
                         Math.floor(255-42.5*j) + ',0)';  
        ctx.fillRect(j*25,i*25,25,25);
      }  
    }
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillRect-translate-redonblue', canvas, function() {
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 20, 20);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'red';
    ctx.translate(10, 10);
    ctx.fillRect(0, 0, 20, 20);
    ctx.restore();
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillRect-scale-redonblue', canvas, function() {
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 20, 20);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'red';
    ctx.translate(10, 10);
    ctx.scale(2, 2);
    ctx.fillRect(0, 0, 20, 20);
    ctx.restore();
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillText-translate-redonblue', canvas, function() {
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.fillText('hello world', 0, 20);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'red';
    ctx.translate(10, 10);
    ctx.fillText('hello world', 0, 20);
    ctx.restore();
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-fillText-scale-redonblue', canvas, function() {
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.fillText('hello world', 0, 20);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'red';
    ctx.scale(2, 2);
    ctx.fillText('hello world', 0, 20);
    ctx.restore();
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-strokePath-lineTo', canvas, function() {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(10, 10);
    ctx.lineTo(30, 30);
    ctx.stroke();
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-strokePath-lineTo-translate-blueonright', canvas, function() {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(10, 10);
    ctx.lineTo(30, 30);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.translate(10, 0);
    ctx.moveTo(10, 10);
    ctx.lineTo(30, 30);
    ctx.stroke();
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-drawImage', canvas, function() {
    var image = new calango.Image();
    image.src = 'resources/image.png';
    assert.equal(image.complete, true);
    ctx.drawImage(image, 0, 0);
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-drawImage-translate-imageontop', canvas, function() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 20, 20);

    var image = new calango.Image();
    image.src = 'resources/image.png';
    assert.equal(image.complete, true);
    
    ctx.translate(10, 10);
    ctx.drawImage(image, 0, 0);
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-drawImage-scale-mirror', canvas, function() {
    var image = new calango.Image();
    image.src = 'resources/image.png';
    assert.equal(image.complete, true);
    
    ctx.drawImage(image, 0, 0);

    ctx.translate(200, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0);
  });
}

{ 
  var canvas = new calango.Canvas,
      ctx = canvas.getContext('2d');

  test.regression('context2d-drawImage-save-restore-matrix', canvas, function() {
    var image = new calango.Image();
    image.src = 'resources/image.png';
    assert.equal(image.complete, true);
    
    ctx.save();
    ctx.translate(200, 0);
    ctx.scale(-1, 1);
    ctx.restore();

    // should draw original picture at 0, 0
    ctx.drawImage(image, 0, 0);
  });
}

calango.stop();
