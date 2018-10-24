// Require dependencies
var express = require('express');
var app = express ();
var path = require('path');
var PORT = process.env.PORT || 5000;
var request = require('request');
var http = require('http').Server(app);

// File path
app.use(express.static(path.join(__dirname, 'public')));

// Port
app.set('port', PORT);

// Get request
app.get('/', function(req, res){
  console.log('user enters..');
  res.render('index');
});

// Get request
app.get('/data.txt', function(req, res){
  console.log('arduino is asking for data');
  res.render('data');
});

// // Post request
// app.post('/', function(req, res){
//   console.log('user enters..');
//   res.render('index');
// });

console.log("App is served on localhost: " + PORT);


// Sockets
var io = require('socket.io')(http);
var userCount = 0;

// On connect to socket
io.on('connection', function(socket){
  userCount = userCount + 1;
  console.log('a user connected');
  console.log('number of connected users: ' + userCount);
  io.sockets.emit('userCount', userCount);

// On disconnect to socket
  socket.on('disconnect', function(){
    userCount = userCount - 1;
    console.log('user disconnected');
    console.log('number of connected users: ' + userCount);
    io.sockets.emit('userCount', userCount);
  });

  function restart (){
    final = 0;
    console.log('restarting...');
  }

});

// Http listen on the port
http.listen(PORT, () => console.log(`Listening on ${ PORT }`));