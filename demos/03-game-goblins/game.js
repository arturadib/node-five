// Simple canvas game: Get the goblins!
//
// Adapted from the tutorial:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// https://github.com/lostdecade/simple_canvas_game


var five = require('../..');

// Create the canvas
var window = new five.Window(512, 480);
var canvas = new five.Canvas(window);
var ctx = canvas.getContext("2d");

canvas.width = window.width;
canvas.height = window.height;

// Background image
var bgReady = false;
var bgImage = new five.Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = __dirname + "/resources/background.png";

// Hero image
var heroReady = false;
var heroImage = new five.Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = __dirname + "/resources/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new five.Image();
monsterImage.onload = function () {
  monsterReady = true;
};
monsterImage.src = __dirname + "/resources/monster.png";

// Game objects
var hero = {
  speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

window.addEventListener("keydown", function (e) {
  keysDown[e.key] = true;
});

window.addEventListener("keyup", function (e) {
  delete keysDown[e.key];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;

  // Throw the monster somewhere on the screen randomly
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
  if (five.Key_Up in keysDown) { // up
    hero.y -= hero.speed * modifier;
  }
  if (five.Key_Down in keysDown) { // down
    hero.y += hero.speed * modifier;
  }
  if (five.Key_Left in keysDown) { // left
    hero.x -= hero.speed * modifier;
  }
  if (five.Key_Right in keysDown) { // right
    hero.x += hero.speed * modifier;
  }

  // Are they touching?
  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
    playSound(__dirname + '/resources/tada.wav');
    reset();
  }
};

// Draw everything
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  // ctx.textAlign = "left";
  // ctx.textBaseline = "top";
  ctx.fillText("Goblins caught: " + monstersCaught, 50, 70);
};

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;
};


function playSound(path) {
  var context = new five.AudioContext(),
      source = context.createBufferSource();
  source.buffer = path; // currently non-compliant
  source.connect(context.destination);
  source.noteOn(0); // play sound  
}

// Audio intro
playSound(__dirname + '/resources/entry.wav');

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
