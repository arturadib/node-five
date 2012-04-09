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

//@
//@ ## five
//@
//@ Main object. Typical usage is:
//@
//@ ```
//@ var five = require('path-to-node-five-dir');
//@ ```

var qt = require('node-qt');

var app = new qt.QApplication();
var timerHandler, tickStop = false;

//@
//@ #### useInterval()
//@ Add event handler to Node's event loop via setTimeout(). This is the default event loop integration.
exports.useInterval = function() {
  if (timerHandler)
    clearInterval(timerHandler);    
  tickStop = true;  
  
  timerHandler = setInterval(function(){
    app.processEvents();
  }, 0);
}

//@
//@ #### useTick()
//@ Add event handler to Node's event loop via `process.nextTick()`.
//@ This should used in applications that require more instant responsiveness (CPU-intensive!).
exports.useTick = function() {
  var registerNextTick = function() {
    process.nextTick(function(){
      app.processEvents();
      if (!tickStop) registerNextTick();
    });
  };

  if (timerHandler)
    clearInterval(timerHandler);
  tickStop = false;
  
  registerNextTick();
}

//@
//@ #### stop()
//@ Stop Node-Five's event loop. Applications never exit without a call to this method.
exports.stop = function() {
  clearInterval(timerHandler);
}
