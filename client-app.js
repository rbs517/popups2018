var socket = require('socket.io-client')('http://localhost:5000');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});


socket.on('reply', function(){
	console.log('hello');

}); // listen to the event