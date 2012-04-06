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

// Constructor: window
{
  var window = new calango.Window(111, 222),
      canvas = new calango.Canvas(window);
  
  assert.equal(canvas.width, 300); // spec default
  assert.equal(canvas.height, 150); // spec default
  assert.equal(canvas.top, 0);
  assert.equal(canvas.left, 0);
  assert.equal(typeof canvas.viewWidth, 'undefined');
  assert.equal(typeof canvas.viewHeight, 'undefined');
}

// Constructor- headless
{
  var canvas = new calango.Canvas;
  
  assert.equal(canvas.width, 300); // spec default
  assert.equal(canvas.height, 150); // spec default
}

// getContext()
{
  var canvas = new calango.Canvas;    
  assert.ok(canvas.getContext('2d'));
}

// Regression tests
{
  var canvas = new calango.Canvas;

  test.regression('canvas-blank', canvas, function() {});
}

calango.stop();
