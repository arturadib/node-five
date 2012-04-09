var five = require('../..');

var context = new five.AudioContext();

var source = context.createBufferSource();
source.buffer = 'conga1.wav'; // currently non-compliant
source.connect(context.destination);
source.noteOn(0); // play sound
