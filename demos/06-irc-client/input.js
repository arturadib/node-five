var five = global.five,
    window = global.window;

var inputCallback = null,
    text = '';

// All units in pixels
const kFontSize = 12,
      kInitialX = 10,
      kCharWidth = kFontSize - 4,
      kBgColor = 'black',
      kCursorColor = 'white',
      kColor = 'white',
      kLineColor = 'white';


//
// Initialize input area
//

var canvas = new five.Canvas(window),
    ctx = canvas.getContext('2d');

canvas.width = window.width;
canvas.height = 40;
canvas.top = window.height - canvas.height;
canvas.left = 0;

ctx.fillStyle = kColor;
ctx.font = kFontSize + 'px courier';

function clearInput() {
  ctx.save();
  ctx.fillStyle = kBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Separation line
  ctx.fillStyle = kLineColor;
  ctx.fillRect(0, 0, canvas.width, 1);
  ctx.restore();
}

clearInput();
var x = kInitialX, y = canvas.height/2 + kFontSize/2;

//
// Key handler
//

window.addEventListener('keydown', function(e) {
  if (e.key === five.Key_Enter || e.key === five.Key_Return) {
    clearCursor(x, y);
    x = kInitialX;
    clearInput();
    showCursor(x, y);

    if (inputCallback)
      inputCallback(text);
    text = '';

    return;
  }

  if (e.key === five.Key_Backspace) {
    if (x === kInitialX)
      return;

    clearCursor(x, y);
    x -= kCharWidth;

    // Erase character
    ctx.save();
    ctx.fillStyle = kBgColor;
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
  text += e.char;
  x += kCharWidth;
  showCursor(x, y);
});

//
// Cursor blinking
//

var cursorOn = false;

function clearCursor(x, y) {
  ctx.save();
  ctx.fillStyle = kBgColor;
  ctx.fillRect(x, y-13, 2, 16);
  ctx.restore();
  cursorOn = false;
}

function showCursor(x, y) {
  ctx.save();
  ctx.fillStyle = kCursorColor;
  ctx.fillRect(x, y-13, 2, 16);
  ctx.restore();
  cursorOn = true;
}

setInterval(function() {
  if (cursorOn)
    clearCursor(x, y);
  else
    showCursor(x, y);
}, 500);

//
// Exports
//

exports.onInput = function(callback) {
  inputCallback = callback;
}
