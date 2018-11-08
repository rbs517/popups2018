//  **********************************************************
// CREATING A NODE.JS SERVER

// Require dependencies
var express = require('express');
var app = express();
var path = require('path');
var PORT = process.env.PORT || 5000;
var request = require('request');
var http = require('http').Server(app);

// File path
app.use(express.static(path.join(__dirname, 'public')));

// Port
app.set('port', PORT);

// Get request to me from index.html
app.get('/', function(req, res) {
  console.log('user enters..');
  res.render('index');
});

console.log("App is served on localhost: " + PORT);

// **********************************************************
// SOCKET COMMUNICATION ON SERVER SIDE

// Declare variables
var userCount = 0;
var colorSelectonString, inputValString, outputString;
var colorSelection = 0;
var buttonsStatus = [true, true, true, true, true, true, true, true, true, true]; //a list to keep track of which buttons are currently available - true means available
var userDict = []; //a list to keep track of the users and which buttons they are using
// On connect to socket

var io = require('socket.io')(http);

// On user connection
io.on('connection', function(socket) {

  // Add the user to the userDict
  userDict.push({
    id: socket.id,
    activeColors: buttonsStatus
  });

  // Add to the userCount
  userCount = userCount + 1;
  console.log('user ' + socket.id + ' has connected');
  console.log('number of connected users: ' + userCount);

  // On disconnect to socket
  socket.on('disconnect', function() {

    // Check which user it was and free up their colors
    for (user in userDict) { // loop through the userDict
      if (userDict[user].id = socket.id) { // find the user that just disconnected
        // console.log("their active colors were: " + userDict[user].activeColors);
        for (color in userDict[user].activeColors) { // loop through the colors that they had active
          if (userDict[user].activeColors[color] == false) { // if they were using a color
            buttonsStatus[color] = true; // release the color/button on the app side
            socket.broadcast.emit('colorStatusUpdate', color, true); // announce that update
          }
        }
        //Remove the user from userDict
        console.log("removing user " + userDict[user].id + " from the user dictionary");
        delete userDict[user];
      }
    }

    //Remove from the userCount
    userCount = userCount - 1;
    console.log('user ' + socket.id + ' has disconnected');
    console.log('number of connected users: ' + userCount);
    io.sockets.emit('userCount', userCount); // call userCount function on js side
  });


  // BUTTON PRESS EVENT

  // STEP 1 //

  // Responding to client request which runs onLoad, checking the color buttons for availability
  socket.on('getColorAvail', colorButtonCheck);

  // Send the button/color statuses to the client
  function colorButtonCheck(thisDevice) {
    console.log('got a color check request from ' + thisDevice + " sending them the array I have: ");
    for (var i = 0; i < buttonsStatus.length; i++) {
      console.log("button " + i + ": " + buttonsStatus[i]);
    }
    socket.emit(thisDevice, buttonsStatus);
  }

  // STEP 2 //

  // When a color is tapped or timed out on the client side
  socket.on('usingColor', broadcastColStatus);

  // Broadcast color claim to all users
  function broadcastColStatus(colorNum, colorStatus) {
    buttonsStatus[colorNum] = colorStatus;
    // console.log(buttonsStatus);
    console.log('got a request to reserve (or release) color ' + colorNum + " now broadcasting this reservation/release to all others");
    socket.broadcast.emit('colorStatusUpdate', colorNum, colorStatus);
  }


  // STEP 3 //

  // Send live data of mic and color button values to local.js (serialport)
  socket.on('liveData', sendLiveDataToLocal);

  function sendLiveDataToLocal(micInput, colorNum) {
    inputValString = micInput.toString();
    colorSelectonString = colorNum.toString();
    outputString = inputValString + colorSelectonString; //mash together the intended strip (0 -4) and the value
    console.log('emitting ' + outputString + ' to local');
    io.sockets.emit('toLocal', outputString);
  }

  // STEP 4 //

  // Send kill data message to local.js (serialport) to reset values/ clear the data after no activity
  socket.on('killData', sendKillMesageToLocal);

  function sendKillMesageToLocal(colorNum) {
    //reset the array of blow values for that tube
    var colorNumString = colorNum.toString();
    var killMessage = "1" + colorNumString;
    killForTime(colorNum, 1500);
  }

  function killForTime(colorNum, time) {
    var colorNumString = colorNum.toString();
    var killMessage = "1" + colorNumString;
    var interval = setInterval(function() {
      console.log("emitting " + killMessage + " to Locals");
      io.sockets.emit('toLocal', killMessage);
    }, 500);
    var timeout = setTimeout(function() {
      console.log("done killing tube " + colorNum);
      clearInterval(interval);
    }, time);
  }

  function restart() {
    final = 0;
    console.log('restarting...');
  }


});

// Http listen on the port
http.listen(PORT, () => console.log(`Listening on ${ PORT }`));
