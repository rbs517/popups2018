// ********************************************************** 
// STARTING JS FILE

// Declaring variables
let haveibeenpressed = false;
var mic;
var inputVal = 1;
var colorSelection=0;
var blowData = [0, 0, 0, 0, 0]; //an array of recent microphone readings (for moving average)


// Sketch
function setup() {
  mic = new p5.AudioIn();
  mic.start();
  connectToSerialPort(portName); // list and connect to portName, throw errors if they happen
  serial.write("100"); //send a "hello" value to start off the serial communication
}

function draw() {
  vol = mic.getLevel();
  inputVal = map(vol, 0, 0.4, 1, 255); //inputVal is for arduino to control the fan
}

//Disable longpress on mobile devices
function longClickHandler(e) {
  e.preventDefault();
}

$("div.circleContainer").longclick(250, longClickHandler);

// On tap hold change color
$(function() {
  $("div.circleContainer").bind("taphold", tapholdHandler);

  function tapholdHandler(event) {
    $(event.target).addClass("taphold");
    console.log("i touched the but");
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


