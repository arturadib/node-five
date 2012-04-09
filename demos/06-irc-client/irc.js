//
// Globals
//
global.five = require('../..');
global.window = new five.Window(1000, 800);

var irc = require('irc'),
    inputArea = require('./input'),
    outputArea = require('./output'),
    nicklistArea = require('./nicklist');

const kServer = 'irc.mozilla.org',
      kNick = 'McTest',
      kChannel = '#labs';

outputArea.push('~Connecting to '+kServer+' '+kChannel+' as "'+kNick+'"...');

var client = new irc.Client(kServer, kNick, {
  channels: [kChannel]
});

inputArea.onInput(function(text) {
  outputArea.push('$'+kNick+': ' + text);
  client.say(kChannel, text);
});

client.addListener('names', function (channel, nicks) {
  var nickArr = [];
  for (nick in nicks) {
    nickArr.push(nick);
  }
  nickArr.sort();
  nicklistArea.update(nickArr);
});

client.addListener('message', function (from, to, message) {
  outputArea.push('@'+from+': ' + message);
});

client.addListener('quit', function (nick, reason, channels, message) {
  outputArea.push('~'+nick+' has left IRC: ' + (reason || 'no reason'));
});

client.addListener('join', function (channel, nick, message) {
  outputArea.push('~'+nick+' has joined');
});
