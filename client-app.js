var socket = require('socket.io-client')('http://localhost:5000');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

// var socket = io();

//socket.emit('user', 'new user is connected');
socket.on('message', function(msg) {
  console.log('hello');
});