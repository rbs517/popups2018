//  ********************************************************** 
// CREATING A NODE.JS SERVER 

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

// Get request to me from index.html
app.get('/', function(req, res){
  console.log('user enters..');
  res.render('index');
});

// // Get request to me from data.html
// app.get('/data.html', function(req, res){
//   console.log('arduino is asking for data');
//   res.render('data');
// });


console.log("App is served on localhost: " + PORT);


// **********************************************************
// SOCKET COMMUNICATION ON SERVER SIDE

var io = require('socket.io')(http);
var userCount = 0;

// On connect to socket
io.on('connection', function(socket){
  userCount = userCount + 1;
  console.log('a user connected');
  console.log('number of connected users: ' + userCount);

//example from docs
  socket.emit('news', { hello: 'world' }); //emitting data to html console
  socket.on('my other event', function (data) {
  console.log(data);
  });
  //io.sockets.emit('userCount', userCount);


// On disconnect to socket
  socket.on('disconnect', function(){
    userCount = userCount - 1;
    console.log('user disconnected');
    console.log('number of connected users: ' + userCount);
    io.sockets.emit('userCount', userCount);
  });

  //trying this
  socket.on('pressed', function(){
    console.log('got a press');
    io.sockets.emit('dimensions', {h: h});
  });


  // function broadcast(msg){
  //   socket.forEach(function each(client) {
  //     socket.emit(msg);
  //   });
  // }

  // socket.on('newData', function(data) {
  //     console.log('im the server and i see ur: ' + data);
  //     // io.emit('message', msg);
  // });

  // socket.on('newData', function(data) {
  //     console.log(data);
  // });

  // socket.on('newData', function(){
  //   console.log("hey! I am the app and I saw new data");
  // });

  function restart (){
    final = 0;
    console.log('restarting...');
  }

});


// Http listen on the port
http.listen(PORT, () => console.log(`Listening on ${ PORT }`));