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
//@ ## five.Canvas(window)
//@
//@ Class/constructor for Canvas objects, either off-screen (no `window` argument) or inside an existing `window`.

var qt = require('node-qt'),
    CanvasRenderingContext2D = require('./canvascontext2d');

// Holds references to objects that shouldn't get garbage collected during a Node-Five session
// e.g. Windows, painting devices (Pixmaps), etc
var refStore = [];

//
// Class Canvas()
// 
module.exports = function(parent) {

  ///////////////////////////////////////////////////////////////////////////
  // Private
  //

  var pixmap_, painter_,
      parentWidget_ = parent ? parent.__widget : null,
      scrollArea_ = null,
      widget_ = null,
      geom_ = {
        width: 300, // Spec default
        height: 150, // Spec default
        viewWidth: undefined,
        viewHeight: undefined,
        top: 0,
        left: 0
      };

  function resetPixmap() {
    pixmap_ = new qt.QPixmap(geom_.width, geom_.height);
    // Spec default is transparent black
    pixmap_.fill(new qt.QColor(0, 0, 0, 0));
    
    if (painter_.isActive())
      painter_.end();
    painter_.begin(pixmap_);
  }

  function updateGeometry() {
    if (!scrollArea_ || !widget_)
      return;

    scrollArea_.move(geom_.left, geom_.top);
    scrollArea_.resize(geom_.viewWidth || geom_.width, geom_.viewHeight || geom_.height);
    widget_.resize(geom_.width, geom_.height);

    // Avoid having one scrollbar come up due to another scrollbar appearing
    // This will crop the content though, corresponding to the scrollbar's width/height
    if (geom_.viewWidth && geom_viewWidth < geom_.width)
      scrollArea_.setHorizontalScrollBarPolicy(0); // auto
    else
      scrollArea_.setHorizontalScrollBarPolicy(1); // off

    if (geom_.viewHeight && geom_.viewHeight < geom_.height)
      scrollArea_.setVerticalScrollBarPolicy(0); // auto
    else
      scrollArea_.setVerticalScrollBarPolicy(1); // off
  }

  ///////////////////////////////////////////////////////////////////////////
  // Public
  //

  var obj = Object.create({
    //@
    //@ #### width = 300
    set width(val) {
      geom_.width = val;
      resetPixmap(); // as per spec
      updateGeometry();
    },

    get width() {
      return geom_.width;
    },

    //@
    //@ #### height = 150
    set height(val) {
      geom_.height = val;
      resetPixmap(); // as per spec
      updateGeometry();
    },

    get height() {
      return geom_.height;
    },

    //@
    //@ #### viewWidth = width
    //@ (Non-standard) Width of the canvas view. Will crop canvas and create 
    //@ scroll bars if smaller than the canvas `width`.
    set viewWidth(val) {
      geom_.viewWidth = val;
      updateGeometry();
    },

    get viewWidth() {
      return geom_.viewWidth;
    },

    //@
    //@ #### viewHeight = height
    //@ (Non-standard) Height of the canvas view. Will crop canvas and create scroll bars if smaller 
    //@ than the canvas `height`.
    set viewHeight(val) {
      geom_.viewHeight = val;
      updateGeometry();
    },

    get viewHeight() {
      return geom_.viewHeight;
    },

    //@
    //@ #### scrollTop = 0
    //@ Vertical scroll position. To be used when `height > viewHeight`.
    //@ Maximum value is `height - viewHeight`.
    set scrollTop(val) {
      if (typeof val === 'number')
        scrollArea_.verticalScrollBar().setValue(val);
    },

    get scrollTop() {
      return scrollArea_.verticalScrollBar().value();
    },

    //@
    //@ #### scrollLeft = 0
    //@ Horizontal scroll position. To be used when `width > viewWidth`.
    //@ Maximum value is `width - viewWidth`.
    set scrollLeft(val) {
      if (typeof val === 'number')
        scrollArea_.horizontalScrollBar().setValue(val);
    },

    get scrollLeft() {
      return scrollArea_.horizontalScrollBar().value();
    },

    //@
    //@ #### top = 0
    //@ (Non-standard) Top position of the canvas with respect to parent window (if any), in pixels.
    //@ Only absolute positioning is available.
    set top(val) {
      geom_.top = val;
      updateGeometry();
    },

    get top() {
      return geom_.top;
    },

    //@
    //@ #### left = 0
    //@ (Non-standard) Left position of the canvas with respect to parent window (if any), in pixels.
    //@ Only absolute positioning is available.
    set left(val) {
      geom_.left = val;
      updateGeometry();
    },

    get left() {
      return geom_.left;
    },

    //@
    //@ #### getContext(type)
    //@ Presently only supports `type == '2d'`.
    getContext: function(type) {
      if (type === '2d')
        return new CanvasRenderingContext2D(painter_, parentWidget_);
    },

    //@
    //@ #### toDataURL()
    toDataURL: function() {
      // HACK
      // Ideally we'd save the pixmap to a QBuffer-QByteArray in memory, then run QByteArray.toBase64()
      // This would require bindings to QBuffer and QByteArray though, so some other time...
      var fs = require('fs');
      pixmap_.save('__tmp_canvas.png');
      var buf = fs.readFileSync('__tmp_canvas.png');
      fs.unlink('__tmp_canvas.png');
      return 'data:image/png;base64,' + buf.toString('base64');
    }
  }); // prototype

  ///////////////////////////////////////////////////////////////////////////
  // Constructor
  //

  painter_ = new qt.QPainter;
  resetPixmap();

  // Painting on a window?
  if (parentWidget_) {
    // Create widget wrapper (for scroll support) and the widget itself
    scrollArea_ = new qt.QScrollArea(parentWidget_);
    widget_ = new qt.QWidget(scrollArea_);
    scrollArea_.setWidget(widget_);
    
    scrollArea_.setFrameShape(0); // no borders
    scrollArea_.setFocusPolicy(0); // no focus (prevents Qt from intercepting Tab + arrow keys)
    widget_.setFocusPolicy(0);  // no focus

    scrollArea_.resize(geom_.width, geom_.height);
    widget_.resize(geom_.width, geom_.height);
    scrollArea_.show();
    widget_.show();

    // Bind pixmap to widget
    widget_.paintEvent(function() {
      var painter_ = new qt.QPainter;
      painter_.begin(widget_);
      painter_.drawPixmap(0, 0, pixmap_);
      painter_.end();
    });
  }

  refStore.push(obj);
  return obj;
}
