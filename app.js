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
// app.get('/data.json', function(req, res){
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
    console.log('got a press');
    fn('press confirmed'); //on pressed send meeeehhh

  // socket.on('ferret',function(name, fn){
  //   fn('mehhhhh'); //on pressed send meeeehhh
  });

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




  //LED STUFF
  // socket.on('mouse', mouseMsg);
  // board.on('ready', function() {
  //   boardIsReady = true;

  //   strip = new pixel.Strip({
  //     board: this,
  //     controller: "FIRMATA",
  //     strips: [{
  //       pin: 10,
  //       length: 12
  //     }, ],
  //     gamma: 2.8,
  //   });

  //   strip.on("ready", function() {
  //     // Set the entire strip to pink.
  //     strip.color('#903');

  //     // Send instructions to NeoPixel.
  //     strip.show();
  //   });

  //   this.repl.inject({
  //     strip: strip
  //   });

  // });

  // function mouseMsg(data) {
  //   // socket.broadcast.emit('mouse', data); //
  //   // io.socket.emit('mouse', data); // including client who sends the msg
  //   // console.log(socket.id + ': ' + data);

  //   if (boardIsReady) {
  //     var led = new five.Led(5); // pin 13
  //     led.brightness(data);
  //     console.log(data);
  //     led = new five.Led(6); // pin 13
  //     led.brightness(0);
  //   }  
  // }


  function restart (){
    final = 0;
    console.log('restarting...');
  }

});

// Http listen on the port
http.listen(PORT, () => console.log(`Listening on ${ PORT }`));