var five = global.five,
    window = global.window;

// All units in pixels
const kFontSize = 12,
      kBgColor = 'black',
      kColor = 'white',
      kNickColor = 'rgb(200, 170, 120)',
      kInfoColor = '#666',
      kSelfColor = 'rgb(100, 120, 140)',
      kPaddingX = 8,
      kPaddingY = 8,
      kLineIncrement = kFontSize + 4;

//
// Initialize output area
//

var canvas = new five.Canvas(window),
    ctx = canvas.getContext('2d');

canvas.width = window.width - 150;
canvas.height = window.height - 40;
canvas.viewHeight = canvas.height;
canvas.top = 0;
canvas.left = 0;
ctx.font = kFontSize + 'px courier';

var y, textArr = [];

function printLine(line) {
  //
  // Info line: "~Line contents"
  //
  var infoMatch = line.match(/^\~/);
  if (infoMatch) {
    // Remove '~'
    line = line.replace(/^\~/, '');
    ctx.save();
    ctx.fillStyle = kInfoColor;
    ctx.fillText(line, kPaddingX, y);
    ctx.restore();
    y += kLineIncrement;
    return;
  }

  //
  // Simple output
  //
  ctx.save();
  ctx.fillStyle = kColor;
  ctx.fillText(line.substr(1), kPaddingX, y);
  ctx.restore();

  //
  // Message line: "@nick Message contents"
  // Prints colored nick on top of simple output
  //
  var nickMatch = line.match(/^\@([\w|\d|\-]+)/);
  if (nickMatch) {
    ctx.save();
    ctx.fillStyle = kNickColor;
    ctx.fillText(nickMatch[1], kPaddingX, y);
    ctx.restore();
  }

  //
  // Self message line: "$nick Message contents"
  // Prints colored nick on top of simple output
  //
  var selfMatch = line.match(/^\$([\w|\d|\-]+)/);
  if (selfMatch) {
    ctx.save();
    ctx.fillStyle = kSelfColor;
    ctx.fillText(selfMatch[1], kPaddingX, y);
    ctx.restore();
  }

  y += kLineIncrement;
}

// Re-paints the entire canvas
function refresh() {
  // Reset y to very top
  y = kFontSize + kPaddingY;

  ctx.save();
  ctx.fillStyle = kBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  textArr.forEach(function(text) {
    printLine(text);
  });

  canvas.scrollTop = canvas.height;
}

refresh();

//
// Exports
//

exports.push = function(text) {
  text = text.toString();
  textArr.push(text);

  if (y > canvas.height) {
    canvas.height += kLineIncrement;
    refresh();
  } else {
    printLine(text);
  }
}
