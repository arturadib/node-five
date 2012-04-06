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
//@ ## calango.Window(width, height)
//@
//@ Native window constructor with the given `height` and `width`.

var qt = require('node-qt');

// Holds global references to objects that shouldn't get garbage collected during a Calango session
// e.g. Windows, painting devices (Pixmaps), etc
var refStore = [];

//
// Class Window()
//
module.exports = function(width, height) {

  ///////////////////////////////////////////////////////////////////////////
  // Private
  //

  var widget_,
      width_ = width || 640,
      height_ = height || 480,
      eventHandlers_ = {
        mousedown: [],
        mouseup: [],
        mousemove: [],
        keyup: [],
        keydown: []
      };

  ///////////////////////////////////////////////////////////////////////////
  // Public
  //

  var obj = Object.create({
    //@
    //@ #### width = 640
    //@ Gets/sets window width in pixels
    set width(val) {
      width_ = val;

      if (!widget_)
        return;      
      widget_.resize(width_, height_);
    },

    get width() {
      return width_;
    },

    //@
    //@ #### height = 480
    //@ Gets/sets window height in pixels
    set height(val) {
      height_ = val;

      if (!widget_)
        return;      
      widget_.resize(width_, height_);
    },

    get height() {
      return height_;
    },

    //@
    //@ #### close()
    //@ Closes window. It can't be reopened.
    close: function() {
      widget_.close();
    },

    //@
    //@ #### addEventListener(event, callback)
    //@ Binds `event` to `callback`. Supported events are listed below.
    addEventListener: function(event, callback) {
      if (!event || !callback)
        return;

      eventHandlers_[event].push(callback);

      if (event === 'mousemove')
        widget_.setMouseTracking(true);
    },

    //@
    //@ #### removeEventListener(event, callback)
    //@ Removes callback from `event` handler.
    removeEventListener: function(event, callback) {
      if (!event || !callback)
        return;

      var arr = eventHandlers_[event],
          pos = arr.indexOf(callback);
      
      if (pos > -1)
        arr.splice(pos, 1);

      // No need for mouse tracking if no more handlers left
      if (event === 'mousemove' && arr.length === 0)
        widget_.setMouseTracking(false);
    },

    // TODO: find a better window-canvas instantiation pattern to avoid leaking internals like widget
    get __widget() {
      return widget_;
    }
  });

  ///////////////////////////////////////////////////////////////////////////
  // Constructor
  //
  
  // Prepare main widget
  widget_ = new qt.QWidget();
  widget_.resize(width_, height_);
  widget_.show();

  //@
  //@ #### Supported events for `addEventListener()`
  //@
  //@ + `mousedown`:
  //@ Callback will be passed `{ clientX, clientY, button }`. `button` values correspond
  //@ to the convenience constants `calango.LeftButton`, `calango.RightButton`, etc. 
  //@ See http://developer.qt.nokia.com/doc/qt-4.8/qt.html#MouseButton-enum
  //@ for a list of supported button codes
  widget_.mousePressEvent(function(qtEvent) {
    eventHandlers_['mousedown'].forEach(function(handler) {
      handler({
        clientX: qtEvent.x(),
        clientY: qtEvent.y(),
        button: qtEvent.button()
      });
    });
  });

  //@
  //@ + `mouseup`:
  //@ Callback will be passed `{ clientX, clientY, button }` as in `mousedown`.
  widget_.mouseReleaseEvent(function(qtEvent) {
    eventHandlers_['mouseup'].forEach(function(handler) {
      handler({
        clientX: qtEvent.x(),
        clientY: qtEvent.y(),
        button: qtEvent.button()
      });
    });
  });

  //@
  //@ + `mousemove`:
  //@ Callback will be passed `{ clientX, clientY }`.
  widget_.mouseMoveEvent(function(qtEvent) {
    eventHandlers_['mousemove'].forEach(function(handler) {
      handler({
        clientX: qtEvent.x(),
        clientY: qtEvent.y()
      });
    });
  });

  //@
  //@ + `keydown`:
  //@ Callback will be passed `{ key, char }`.
  //@ Key values correspond to the convenience constants `calango.Key_Esc`, `calango.Key_Left`, etc.
  //@ See http://developer.qt.nokia.com/doc/qt-4.8/qt.html#Key-enum for the list of supported keys.
  //@ `char` is the corresponding Unicode character, if available.
  widget_.keyPressEvent(function(qtEvent) {
    eventHandlers_['keydown'].forEach(function(handler) {
      handler({
        key: qtEvent.key(),
        char: qtEvent.text()
      });
    });
  });

  //@
  //@ + `keyup`:
  //@ Callback will be passed `{ key, char }`. Details as in `keydown`.
  widget_.keyReleaseEvent(function(qtEvent) {
    eventHandlers_['keyup'].forEach(function(handler) {
      handler({
        key: qtEvent.key(),
        char: qtEvent.text()
      });
    });
  });

  refStore.push(obj);
  return obj;
}
