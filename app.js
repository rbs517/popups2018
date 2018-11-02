//  ********************************************************** 
// CREATING A NODE.JS SERVER 

// Require dependencies
var express = require('express');
var app = express ();
var path = require('path');
var PORT = process.env.PORT || 5000;
var request = require('request');
var http = require('http').Server(app);

var blowData = [[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0]]; // an array of recent microphone readings (for moving average)
var colorSelectonString, inputValString, outputString;
var colorSelection = 0;
var smoothVal = 0;

// File path
app.use(express.static(path.join(__dirname, 'public')));

// Port
app.set('port', PORT);

// Get request to me from index.html
app.get('/', function(req, res){
  console.log('user enters..');
  res.render('index');
});

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
  io.emit('this', {will: 'be received by everyone'});

  // On disconnect to socket
  socket.on('disconnect', function(){
    userCount = userCount - 1;
    console.log('user disconnected');
    console.log('number of connected users: ' + userCount);
    io.sockets.emit('userCount', userCount); // call userCount function on js side
  });

  // When you receive "pressed" from the client (js)
  socket.on('pressed', colorMsg);

  function colorMsg(colorNum){
    // send pressed data back to client to disable that color button
    socket.broadcast.emit('colorPressed', colorNum);

    // send pressed data to Local.js which is used to talk to serialport
    colorSelection = colorNum;

    // io.sockets.emit('toLocal', colorNum);
    console.log('color selection from client is: '+ colorSelection);

    // // send pressed data back to client to disable that color button
    // socket.broadcast.emit('colorPressed', colorNum);
  }

  // When you receive "unpressed" from the client (js)
  socket.on('unpressed', unpressedMsg);

  function unpressedMsg(colorNum){
  // send pressed data back to client to enable that color button
  socket.broadcast.emit('toClients', colorNum);
}


  socket.on('testingMic', micMsg);

  function micMsg(micInput){
    updateArray(micInput,colorSelection);
    smoothVal = average(blowData[colorSelection]); // prepare the value to send
    console.log('preparing emission with a avg micVal of: ' + smoothVal);
    colorSelectonString = colorSelection.toString();
    console.log('...and a color selection of ' + colorSelection);
    // LED testing workaround
        if (smoothVal > 50) {
        smoothVal = 3;
        inputValString = smoothVal.toString();
    } else {
      smoothVal = 2;
      inputValString = smoothVal.toString();
    }

    outputString = inputValString + colorSelectonString; //mash together the intended strip (0 -4) and the value
    console.log('emitting ' + outputString + ' to local');
    io.sockets.emit('toLocal2', outputString);
    // console.log(micInput);
    // add another emit here that the phones will listen for 'notifyAllUsers'
  }

  function restart (){
    final = 0;
    console.log('restarting...');
  }

});

// Data smoothing function
function updateArray(newReading,tube) {
  blowData[tube].shift();
  blowData[tube].push(newReading);
  // maybe use math.floor and do more elegant control on the arduino side
}

function average(array) {
    var total = 0;
  for (var i = 0; i < array.length; i++) {
    total += array[i];
  }
  var avg = total / array.length;
  return avg;
}

// Http listen on the port
http.listen(PORT, () => console.log(`Listening on ${ PORT }`));