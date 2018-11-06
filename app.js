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

console.log("App is served on localhost: " + PORT);

// **********************************************************
// SOCKET COMMUNICATION ON SERVER SIDE

// Declare variables
var userCount = 0;
var blowData = [[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0],[0, 0, 0, 0, 0,0,0,0,0]]; // an array of recent microphone readings (for moving average)
var colorSelectonString, inputValString, outputString;
var colorSelection = 0;
var smoothVal = 0;
var buttonsStatus = [true, true, true, true, true, true, true, true, true, true]; //true means available

// On connect to socket

var io = require('socket.io')(http);

io.on('connection', function(socket){
  // On user connection
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


  // BUTTON CHECK

  // STEP 1 //

  // Responding to client request, checking the color buttons for availability
  socket.on('getColorAvail', colorButtonCheck);

  
  // Once checked, send the button color statuses to the client
  function colorButtonCheck(thisDevice){
    console.log('got a color check request from ' + thisDevice + " sending them the array I have: ");
    for (var i = 0; i < buttonsStatus.length ;i++) {
    console.log("button " +i + ": " +buttonsStatus[i]);
  }
    socket.emit(thisDevice, buttonsStatus);
  }
  
  // STEP 2 //

  // Color has been claimed
  socket.on('usingColor', broadcastColStatus);

  // Broadcast color claim to all users
  function broadcastColStatus(colorNum, colorStatus){
    buttonsStatus[colorNum] = colorStatus;
    console.log('got a request to reserve (or release) color ' + colorNum + " now broadcasting this reservation/release to all others");
    socket.broadcast.emit('colorStatusUpdate', colorNum, colorStatus);
  }


  // STEP 3 //

  // Send live data of mic and color button values to local.js (serialport)
  socket.on('liveData',sendLiveDataToLocal);

  function sendLiveDataToLocal(micInput, colorNum){
    // updateArray(micInput, colorNum);
    // smoothVal = average(blowData[colorNum]); // prepare the value to send
    // console.log('preparing emission with a avg micVal of: ' + smoothVal);
    inputValString = micInput.toString();
    colorSelectonString = colorNum.toString();
    // console.log('...and a color selection of ' + colorSelection);
    // LED testing workaround
    // if (smoothVal > 50) {
    //     smoothVal = 2;
    //     inputValString = smoothVal.toString();
    // } else {
    //   smoothVal = 1;
    //   inputValString = smoothVal.toString();
    // }

    outputString = inputValString + colorSelectonString; //mash together the intended strip (0 -4) and the value
    console.log('emitting ' + outputString + ' to local');
    io.sockets.emit('toLocal', outputString);
  }

  // STEP 4 //
  
  // Send kill data message to local.js (serialport) to reset values/ clear the data after no activity
  socket.on('killData',sendKillMesageToLocal);
  
  function sendKillMesageToLocal(colorNum) {
        //reset the array of blow values for that tube
        blowData[colorNum] = [0,0,0,0,0,0,0,0,0,0];
        var colorNumString = colorNum.toString();
        var killMessage = "1" + colorNumString;
        console.log("emitting " + killMessage + " to Local");
        io.sockets.emit('toLocal', killMessage);
  }


  // socket.on('countedTen', sendFullHouse);
  
  // function sendFullHouse (){
  //   socket.broadcast.emit('fullHouse', alert);
  // }


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

// Getting average of array
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