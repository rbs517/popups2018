// ********************************************************** 
// STARTING JS FILE

// Declaring variables
var haveibeenpressed = false;
var mic;
var h;
var l;
var micInput;
var inputVal = 1;
var colorSelection=0;
var colorSelectonString;
var outputString;
var outputVal;
var smoothVal;
var inputValString;
var blowData = [0, 0, 0, 0, 0]; //an array of recent microphone readings (for moving average)


function Microphone (_fft) {
  var FFT_SIZE = _fft || 1024;
  this.spectrum = [];
  this.volume = this.vol = 0;
  this.peak_volume = 0;
  var self = this;
  var audioContext = new AudioContext();
  var SAMPLE_RATE = audioContext.sampleRate;
  
  // this is just a browser check to see
  // if it supports AudioContext and getUserMedia
  window.AudioContext = window.AudioContext ||  window.webkitAudioContext;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
  // now just wait until the microphone is fired up
  window.addEventListener('load', init, false);
  function init () {
      try {
        startMic(new AudioContext());
      }
      catch (e) {
        console.error(e);
        alert('Web Audio API is not supported in this browser');
      }
  }
  function startMic (context) {
    navigator.getUserMedia({ audio: true }, processSound, error);
    function processSound (stream) {
     // analyser extracts frequency, waveform, etc.
     var analyser = context.createAnalyser();
     analyser.smoothingTimeConstant = 0.2;
     analyser.fftSize = FFT_SIZE;
     var node = context.createScriptProcessor(FFT_SIZE*2, 1, 1);
     node.onaudioprocess = function () {
       // bitcount returns array which is half the FFT_SIZE
       self.spectrum = new Uint8Array(analyser.frequencyBinCount);
       // getByteFrequencyData returns amplitude for each bin
       analyser.getByteFrequencyData(self.spectrum);
       // getByteTimeDomainData gets volumes over the sample time
       // analyser.getByteTimeDomainData(self.spectrum);

       self.vol = self.getRMS(self.spectrum);
       // get peak - a hack when our volumes are low
       if (self.vol > self.peak_volume) self.peak_volume = self.vol;
       self.volume = self.vol;
     };
     var input = context.createMediaStreamSource(stream);
     input.connect(analyser);
     analyser.connect(node);
     node.connect(context.destination);
  }
  function error () {
     console.log(arguments);
  }
}
//////// SOUND UTILITIES  ////////
///// ..... we going to put more stuff here....
return this;
};
var Mic = new Microphone();

// p5.js function protocol
function setup() {
  // mic = new p5.AudioIn();
  // mic.start();
  // connectToSerialPort(portName); // list and connect to portName, throw errors if they happen
  // serial.write("100"); //send a "hello" value to start off the serial communication
}

function draw() {
  // vol = mic.getLevel();
  // inputVal = map(vol, 0, 0.4, 1, 255); //inputVal is for arduino to control the fan
  // tell the server that the button has been pressed
  // socket.emit('testingMic', micInput);
  // inputVal = micInput;
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
    // console.log("i touched the but");
    // console.log(event.target.id); // which circle is being pressed?
    var idString = (event.target.id); //take the circle id string
    colorNum = idString.slice(6); //slice the string so it only prints the circle number
    // console.log(colorSelection); //print button color number
    socket.emit('pressed', colorNum);

    // tell the server that the button has been pressed
  //   socket.emit('pressed', colorNum,function(data){
  //     // console log the data you get back from the server
  //     console.log(data);
  // });
  }
});

// On tap release go back to original color
$(document).on("vmouseup", function() {
  $(event.target).removeClass("taphold");
  // data = 0;
  // socket.emit('mouse', data);
  // $(event.target).removeEventListener("blow");
});


// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();

socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) { 
  console.log('total number of users online is: ' + userCount); //console number of users after one goes off;
});

socket.on('connect', function(){
  connectToSerialPort(portName); // list and connect to portName, throw errors if they happen
  serial.write("100"); //send a "hello" value to start off the serial communication
});

socket.on('pressed', whichColorIsPressed);

function whichColorIsPressed(colorNum){
  colorSelection = colorNum;
}

// socket.on('testingMic', getMicInput);

// function getMicInput(micInput){
//   inputVal = micInput;
// }
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