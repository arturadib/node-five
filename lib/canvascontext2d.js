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

//////////////////////////////////////////////////////////////////////////////
//
// The implementation below is based on QPainter, whose API is fortuitously
// very similar to that of 2d canvas context
//

//@
//@ ## five.Canvas.getContext('2d')
//@ 
//@ The documentation below is for exposed methods after a `ctx = canvas.getContext('2d')` 
//@ call, which returns a `CanvasRenderingContext2D` object.

var qt = require('node-qt');

// getStyle()
// Helper function for fillStyle and strokeStyle getters
// Returns appropriate value from given style state
function getStyle(state) {
  if (!(state instanceof qt.QColor))
    return null; // not yet supported

  // It's a QColor
  var color = state;

  if (color.alpha() === 255)
    // '#aabbcc'
    return color.name();
  else
    // 'rgba(1, 2, 3, 0.5)'
    return 'rgba('+color.red()+', '+color.green()+', '+color.blue()+', '+(color.alpha()/255).toFixed(2)+')';
}

// setStyle()
// Helper function for fillStyle and strokeStyle setters
// Returns internal state from user-given value
function setStyle(val) {
  if (!(typeof val === 'string'))
    return null; // not yet supported

  val = val.replace(/\s/g, '');

  // 'rgb(1, 2, 3)
  var rgbMatch = val.match(/rgb\((\d+)\,(\d+)\,(\d+).*\)/);
  if (rgbMatch)
    return new qt.QColor(rgbMatch[1], rgbMatch[2], rgbMatch[3]);

  // 'rgba(1, 2, 3, 0.5)'
  var rgbaMatch = val.match(/rgba\((\d+)\,(\d+)\,(\d+)\,([\d|\.]+).*\)/);
  if (rgbaMatch)
    return new qt.QColor(rgbaMatch[1], rgbaMatch[2], rgbaMatch[3], 255*rgbaMatch[4]);

  // '#abc', '#aabbcc', etc, 'blue', 'black', etc
  // These are handled by QColor itself
  return new qt.QColor(val);
}

//
// Class CanvasRenderingContext2D()
// 
module.exports = function(painter, widget) {

  ///////////////////////////////////////////////////////////////////////////
  // Private
  //

  var painter_ = painter,
      widget_ = widget,
      path_ = null, 
      stack_ = [];

  var state_ = {
    fillStyle: new qt.QColor('black'),
    strokeStyle: new qt.QColor('black'),
    font: new qt.QFont('sans-serif', 10),
    matrix: new qt.QMatrix(1, 0, 0, 1, 0, 0)
  }

  function cloneState(state) {
    return {
      fillStyle: new qt.QColor(state.fillStyle),
      strokeStyle: new qt.QColor(state.strokeStyle),
      font: new qt.QFont(state.font),
      matrix: new qt.QMatrix(state.matrix)
    }
  }

  function updateWidget() {
    if (widget_) 
      widget_.update();
  }

  ///////////////////////////////////////////////////////////////////////////
  // Public
  //

  var obj = Object.create({
    save: function() {
      // Can't push state_ directly as that would keep the state by reference
      // We need to push by value so that the saved state is not modified by ensuing state-changing operations
      stack_.push( cloneState(state_) );
    },

    restore: function() {
      if (stack_.length > 0)
        state_ = stack_.pop();
    },

    get fillStyle() {
      return getStyle(state_.fillStyle);
    },

    //@
    //@ #### ctx.fillStyle = 'color'
    //@ Currently only supports color types (e.g. `'rgb()'`, `'rgba()'`, `'blue'`, `'#aabbcc'`, etc)
    set fillStyle(val) {
      state_.fillStyle = setStyle(val) || state_.fillStyle;
    },

    get strokeStyle() {
      return getStyle(state_.strokeStyle);
    },

    //@
    //@ #### ctx.strokeStyle = 'color'
    //@ Currently only supports color types (e.g. `'rgb()'`, `'rgba()'`, `'blue'`, `'#aabbcc'`, etc)
    set strokeStyle(val) {
      state_.strokeStyle = setStyle(val) || state_.strokeStyle;
    },

    get font() {
      var font = state_.font;
      return font.pointSizeF() + 'px ' + font.family();
    },

    //@
    //@ #### ctx.font = '10px family'
    //@ Currently only supports the format above
    set font(val) {
      var match = val.match(/([\d|\.]+)px\s+([\w|\-]+)/);
      if (!match)
        return;
      
      var size = match[1],
          family = match[2];

      var font = new qt.QFont;
      font.setFamily(family);
      font.setPointSizeF(size);
      state_.font = font;
    },

    //@
    //@ #### ctx.fillRect(x, y, w, h)
    fillRect: function(x, y, w, h) {
      painter_.save();
      // setMatrix() is undocumented in Qt. The syntax is the same as setTransform()
      painter_.setMatrix(state_.matrix, false);
      painter_.fillRect(x, y, w, h, state_.fillStyle);
      painter_.restore();
      
      updateWidget();
    },

    //@
    //@ #### ctx.fillText(text, x, y)
    fillText: function(text, x, y) {
      // TODO: check if spec supports other fillStyles
      var fillStyle = state_.fillStyle instanceof qt.QColor ? 
                      state_.fillStyle : new qt.QColor(0, 0, 0);

      painter_.save();
      var pen = new qt.QPen(state_.fillStyle);
      painter_.setPen(pen);
      painter_.setFont(state_.font);
      // setMatrix() is undocumented in Qt. The syntax is the same as setTransform()
      painter_.setMatrix(state_.matrix, false);
      painter_.drawText(x, y, text);
      painter_.restore();

      updateWidget();
    },

    //@
    //@ #### ctx.translate(x, y)
    translate: function(x, y) {
      state_.matrix.translate(x, y);
    },

    //@
    //@ #### ctx.scale(x, y)
    scale: function(x, y) {
      state_.matrix.scale(x, y);
    },

    //@
    //@ #### ctx.beginPath()
    beginPath: function() {
      path_ = new qt.QPainterPath;
    },

    //@
    //@ #### ctx.closePath()
    closePath: function() {
      path_.closeSubpath();
    },

    //@
    //@ #### ctx.moveTo(x, y)
    moveTo: function(x, y) {
      if (!path_)
        return;
      
      path_.moveTo(new qt.QPointF(x, y));
    },

    //@
    //@ #### ctx.lineTo(x, y)
    lineTo: function(x, y) {
      if (!path_)
        return;
      
      path_.lineTo(new qt.QPointF(x, y));
    },

    //@
    //@ #### ctx.stroke()
    stroke: function() {
      if (!path_)
        return;
      
      if (!(state_.strokeStyle instanceof qt.QColor))
        return;
        
      var pen = new qt.QPen(state_.strokeStyle);
      
      painter_.save();
      painter_.setMatrix(state_.matrix, false);
      painter_.strokePath(path_, pen);
      painter_.restore();
      
      updateWidget();
    },

    //@
    //@ #### ctx.drawImage(image, x, y)
    //@ Presently only supports images created via `five.Image()`
    drawImage: function(image, x, y) {
      var img = image.__image;
      if (!(img instanceof qt.QImage))
        return; // not supported
      
      painter_.save();
      painter_.setMatrix(state_.matrix, false);
      painter_.drawImage(x, y, img);
      painter_.restore();

      updateWidget();
    }
  }); // prototype

  ///////////////////////////////////////////////////////////////////////////
  // Constructor
  //

  return obj;  
}
