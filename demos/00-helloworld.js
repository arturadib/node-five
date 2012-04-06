var calango = require('..'),
    window = new calango.Window(640, 480),
    canvas = new calango.Canvas(window),
    ctx = canvas.getContext('2d');

canvas.width = window.width;
canvas.height = window.height;

ctx.font = '16px arial';
ctx.fillText('Hello world, from Calango', 20, 20);
