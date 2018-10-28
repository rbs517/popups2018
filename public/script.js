// ********************************************************** 
// STARTING JS FILE



// Declaring variables
let haveibeenpressed = false;
var mic;
var h;
var l;
var inputVal = 1;
var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here -- CHANGE ME!
var options = {
  baudrate: 9600
}; // change the data rate to whatever you wish -- MAKE ME MATCH!
var inData; // for incoming serial data
var colorSelection=0;
var colorSelectonString;
var outputString;
var outputVal;
var smoothVal;
var inputValString;
var blowData = [0, 0, 0, 0, 0]; //an array of recent microphone readings (for moving average)

//p5 Serialport

function checkPorts() {
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event

  serial.list(); // list the serial ports
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function connectToSerialPort(port) {
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(port, options); // open a serial port
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  var inString = serial.readStringUntil('\r\n');
  // console.log(haveibeenpressed);
  //check to see that there's actually a string there:
  if (inString.length > 0) {
    //console.log("I read a string that says: " + inString) // if there is something in that line...
    if (inString == "A") { // ... and that something is 'hello' in the form of "A"...
      smoothVal = smoothReading(inputVal); // prepare the value to send
      // combine the mic value and color selection into a 4 digit number for arudiuno
      var tempInt = int(smoothVal);
      inputValString = String(tempInt);
      // var tempVal = int(smoothVal);
      if (inputValString.length == 1) {inputValString = "00" + inputValString};
      if (inputValString.length == 2) {inputValString = "0" + inputValString};
      colorSelectonString = String(colorSelection);
      outputString = inputValString + colorSelectonString; //mash together the intended strip (0 -4) and the value
      // outputVal = int(outputString);
      // outboundString = String(outPutVal); //mash together the intended strip (0 -4) and the value
      // outboundString = String(colorSelection) + String(outPutVal); //mash together the intended strip (0 -4) and the value
      // outBoundInt = int(outboundString); //convert it to a string
      // console.log("sending: " + outputString);
      serial.write(outputString+ '\n'); // write the value - add + '\n' if using arduino uno
      serial.write("hello"+'\n');
    }
    // else {serial.clear();
    //   serial.write(valToSend + '\n'); // write the value
    // }
  }
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}


// p5.js function protocol
 

function setup() {
  mic = new p5.AudioIn();
  mic.start();
  connectToSerialPort(portName); // list and connect to portName, throw errors if they happen
  serial.write("100") //send a "hello" value to start off the serial communication
}

function draw() {
  vol = mic.getLevel();
  inputVal = map(vol, 0, 0.4, 1, 255); //inputVal is for arduino to control the fan
}


// Sketch

//Disable longpress on mobile devices
function longClickHandler(e) {
  e.preventDefault();
}

$("div.circleContainer").longclick(250, longClickHandler);

// On tap hold change color
$(function() {
  $("div.circleContainer").bind("taphold", tapholdHandler);
  // $("div.circleContainer").addEventListener("blow", blowVal);

  function tapholdHandler(event) {
    $(event.target).addClass("taphold");
    console.log("I touched the button");
    console.log(event.target.id); // which circle is being pressed?
    var idString = (event.target.id); //take the circle id string
    colorSelection = idString.slice(6); //slice the string so it only prints the circle number
    console.log(colorSelection); //print button color number

    // blowVal(); //only if you are pressing, will the mic be listening
    socket.emit('pressed', 'pressed');
  }
});

// On tap release go back to original color
$(document).on("vmouseup", function() {
  $(event.target).removeClass("taphold");
  // data = 0;
  // socket.emit('mouse', data);
  // $(event.target).removeEventListener("blow");
});


// function blowVal() {
//     vol = mic.getLevel();
//     inputVal = map(vol, 0, 1, 1, 255); //inputVal is for arduino to control the fan
// }

//Data smoothing functions
function smoothReading(newReading) {
  blowData.shift();
  blowData.push(newReading);
  var total = 0;
  for (var i = 0; i < blowData.length; i++) {
    total += blowData[i];
  }
  var avg = total / blowData.length;
  return avg;
  //maybe use math.floor and do more elegant control on the arduino side
}



// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();

socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) {
  console.log('total number of users online is: ' + userCount);
});

socket.on('connect', function(){
  socket.emit('ferret','tobiiiii',function(data){
    console.log("feeretsssss"+ data);
  });
 // haveibeenpressed = true;
 //console.log("am I being pressed?");

socket.on('pressedConfirmed', function(pressedConfirmed){
    console.log(pressedConfirmed);
  });





});


// ********************************************************** 
// BOOTSTRAP 
// * Start Bootstrap - New Age v5.0.0 (https://startbootstrap.com/template-overviews/new-age)
// * Copyright 2013-2018 Start Bootstrap
// * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-new-age/blob/master/LICENSE)
 
// Scroll trigger
// !function(e){
//   "use strict";e('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function(){
//     if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){
//       var a=e(this.hash);if((a=a.length?a:e("[name="+this.hash.slice(1)+"]")).length)return e("html, body").animate({
//         scrollTop:a.offset().top-48},1e3,"easeInOutExpo"),!1
//       }
//     }),
//   e(".js-scroll-trigger").click(function(){
  
//   }),

//   a(),e(window).scroll(a);

// }(jQuery);


