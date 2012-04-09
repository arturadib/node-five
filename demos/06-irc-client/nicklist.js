var five = global.five,
    window = global.window;

// All units in pixels
const kFontSize = 12,
      kBgColor = '#002',
      kColor = 'rgb(200,170,120)',
      kLineColor = 'white',
      kPaddingX = 8,
      kPaddingY = 4,
      kLineIncrement = kFontSize + 4,
      kWidth = 150;

//
// Initialize nick list area
//

var canvas = new five.Canvas(window),
    ctx = canvas.getContext('2d');

canvas.width = kWidth;
canvas.height = window.height - 40;
canvas.viewHeight = canvas.height;
canvas.top = 0;
canvas.left = window.width - kWidth;
ctx.font = kFontSize + 'px courier';

function clearCanvas() {
  ctx.save();
  ctx.fillStyle = kBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = kLineColor;
  ctx.fillRect(0, 0, 1, canvas.height);
  ctx.restore();
}
clearCanvas();

//
// Exports
//

exports.update = function(nickArr) {
  // Reset y to very top
  var y = kFontSize + kPaddingY;

  var height = y + nickArr.length*kLineIncrement;
  if (height > canvas.height)
    canvas.height = height;

  clearCanvas();

  nickArr.forEach(function(nick) {
    // Simple output
    ctx.save();
    ctx.fillStyle = kColor;
    ctx.fillText(nick, kPaddingX, y);
    ctx.restore();

    y += kLineIncrement;
  });  
}
