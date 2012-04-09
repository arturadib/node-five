var five = require('..');

var window = new five.Window(640, 480),
    canvas = new five.Canvas(window),
    ctx = canvas.getContext('2d');

canvas.width = window.width;
canvas.height = window.height;

// All units in pixels
const kFontSize = 14,
      kInitialX = 10,
      kLinePadding = 4,
      kCharWidth = kFontSize - 4;

var x = kInitialX, y = kFontSize + kLinePadding;

// Reset writing area
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 640, 480);

// Defaults
ctx.fillStyle = 'blue';
ctx.font = kFontSize + 'px courier';

//
// Key handler
//

window.addEventListener('keydown', function(e) {
  if (e.key === five.Key_Enter || e.key === five.Key_Return) {
    clearCursor(x, y);
    x = kInitialX;
    y += kFontSize + kLinePadding;
    showCursor(x, y);
    return;
  }

  if (e.key === five.Key_Backspace) {
    if (x === kInitialX)
      return;

    clearCursor(x, y);
    x -= kCharWidth;

    // Erase character
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y - kFontSize, kCharWidth, kFontSize + 4);
    ctx.restore();

    showCursor(x, y);
    return;
  }

  // All others

  if (e.char.length === 0)
    return;

  clearCursor(x, y);
  ctx.fillText(e.char, x, y);
  x += kCharWidth;
  showCursor(x, y);
});

//
// Cursor blinking
//

var cursorOn = false;

function clearCursor(x, y) {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y-13, 3, 16);
  ctx.restore();
  cursorOn = false;
}

function showCursor(x, y) {
  ctx.save();
  ctx.fillStyle = 'black';
  ctx.fillRect(x, y-13, 3, 16);
  ctx.restore();
  cursorOn = true;
}

setInterval(function() {
  if (cursorOn)
    clearCursor(x, y);
  else
    showCursor(x, y);
}, 500);
