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

var webaudio_tooling_obj = function () {

    var audioContext = new AudioContext();

    var BUFF_SIZE = 16384;

    var audioInput = null,
        microphone_stream = null,
        gain_node = null,
        script_processor_node = null,
        script_processor_fft_node = null,
        analyserNode = null;

    if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia){

        navigator.getUserMedia({audio:true}, 
          function(stream) {
              start_microphone(stream);
          },
          function(e) {
            alert('Error capturing audio.');
          }
        );

    } else { alert('getUserMedia not supported in this browser.'); }

    // ---

    function show_some_data(given_typed_array, num_row_to_display, label) {

        var size_buffer = given_typed_array.length;
        var index = 0;
        var max_index = num_row_to_display;

        // console.log("__________ " + label);

        for (; index < max_index && index < size_buffer; index += 1) {

            // console.log(given_typed_array[index]);
            micInput = given_typed_array[index];
            // socket.emit('testingMic', micInput);
            inputVal = map(micInput, 0, 150, 1, 255);
            // console.log(inputVal);
        }
    }

    function start_microphone(stream){

      gain_node = audioContext.createGain();
      gain_node.connect( audioContext.destination );

      microphone_stream = audioContext.createMediaStreamSource(stream);
      // microphone_stream.connect(gain_node); 

      script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
      // script_processor_node.onaudioprocess = process_microphone_buffer;

      microphone_stream.connect(script_processor_node);

      script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
      script_processor_fft_node.connect(gain_node);

      analyserNode = audioContext.createAnalyser();
      analyserNode.smoothingTimeConstant = 0;
      analyserNode.fftSize = 2048;

      microphone_stream.connect(analyserNode);

      analyserNode.connect(script_processor_fft_node);

      script_processor_fft_node.onaudioprocess = function() {

        // get the average for the first channel
        var array = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(array);

        // draw the spectrogram
        if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {

            show_some_data(array, 5, "from fft");
        }
      };
    }

  }(); //  webaudio_tooling_obj = function()

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