var five = require('..'),
    window = new five.Window(640, 480),
    canvas = new five.Canvas(window),
    ctx = canvas.getContext('2d');

canvas.width = window.width;
canvas.height = window.height;

ctx.font = '16px arial';
ctx.fillText('Hello world, from Node-Five', 20, 20);
