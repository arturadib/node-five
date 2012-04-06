var calango = require('..');

var window = new calango.Window(640, 480),
    canvas = new calango.Canvas(window),
    ctx = canvas.getContext('2d');

canvas.width = window.width;
canvas.height = window.height;

ctx.strokeStyle = 'blue';

var holdingButton = false;

window.addEventListener('mousedown', function(e) {
  ctx.fillRect(e.clientX, e.clientY, 1, 1);
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);

  holdingButton = true;
});

window.addEventListener('mouseup', function(e) {
  ctx.fillRect(e.clientX, e.clientY, 1, 1);
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);

  holdingButton = false;
});

window.addEventListener('mousemove', function(e) {
  if (!holdingButton)
    return;

  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
});
