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
    five = require('..'),
    test = require('./test');

// Constructor
{
  var image = new five.Image();
  image.src = 'resources/image.png';
  assert.equal(image.complete, true);
}

// Constructor- bad file
{
  var image = new five.Image();
  image.src = 'BAD-FILE';
  assert.equal(image.complete, false);
}

// .onload() : before .src
{
  var called = false;
  var image = new five.Image();
  image.onload = function() { called = true; }
  image.src = 'resources/image.png';
  assert.equal(called, true);
}

// .onload() : after .src
{
  var called = false;
  var image = new five.Image();
  image.src = 'resources/image.png';
  image.onload = function() { called = true; }
  assert.equal(called, true);
}

// .onload() : bad image before .src
{
  var called = false;
  var image = new five.Image();
  image.onload = function() { called = true; }
  image.src = 'BAD-IMAGE';
  assert.equal(called, false);
}

// .onload() : bad image after .src
{
  var called = false;
  var image = new five.Image();
  image.src = 'BAD-IMAGE';
  image.onload = function() { called = true; }
  assert.equal(called, false);
}

five.stop();
