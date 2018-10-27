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

// Get request to me from data.html
// app.get('/.json', function(req, res){
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
  socket.on('pressed',function(name, fn){
    fn('got a press');
  }
//on pressed send meeeehhhhh
  );

  userCount = userCount + 1;
  console.log('a user connected');
  console.log('number of connected users: ' + userCount);
  io.emit('this', {will: 'be received by everyone'});

// On disconnect to socket
  socket.on('disconnect', function(){
    userCount = userCount - 1;
    console.log('user disconnected');
    console.log('number of connected users: ' + userCount);
    io.sockets.emit('userCount', userCount);
  });


  // socket.on ('private message', function(from, msg){
  //   console.log("I received a pm by", from, "saying", msg);
  // });

  //trying this
  // socket.on('pressed', function(){
  //   console.log('got a press');
    //socket.broadcast.emit('broadcasting');
    //socket.broadcast.emit('broadcast', 'hello friends!');
    // io.sockets.emit('dimensions', {h: h});
  // });

  // function restart (){
  //   final = 0;
  //   console.log('restarting...');
  // }

});

// Http listen on the port
http.listen(PORT, () => console.log('Listening on ${ PORT }'));