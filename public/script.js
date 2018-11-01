// ********************************************************** 
// STARTING JS FILE

// Declaring variables
var mic;
var micInput;
var colorNum;
var sound = [];
// Sketch

// p5.js function protocol
function setup() {
  noCanvas();
  // mic setup
  mic = new p5.AudioIn();
  mic.start();
  
  // load sounds
  sound[0] = new p5.Oscillator(220.00, 'sine');
  sound[1] = new p5.Oscillator(246.94, 'sine');
  sound[2] = new p5.Oscillator(277.18, 'sine');
  sound[3] = new p5.Oscillator(329.63, 'sine');
  sound[4] = new p5.Oscillator(349.23, 'sine');
  sound[5] = new p5.Oscillator(207.65, 'sine');
  sound[6] = new p5.Oscillator(293.66, 'sine');
  sound[7] = new p5.Oscillator(253.22, 'sine');
  sound[8] = new p5.Oscillator(270.66, 'sine');
  sound[9] = new p5.Oscillator(300.50, 'sine');
}

function draw() {
  // Get mic volume level/ blow val 
  vol = mic.getLevel();
  micInput = map(vol, 0, 1, 1, 255); //inputVal is for arduino to control the fan

  // tell the server that we want the mic data now 
  socket.emit('testingMic', micInput);
}

// Circles placed in a circle design for taphold page
var type = 1, // circle type - 1 whole, 0.5 half, 0.25 quarter
    radius = '22em', // distance from center
    start = -90, // shift start from 0
    $elements = $('li'),
    numberOfElements = (type === 1) ?  $elements.length : $elements.length - 1, //adj for even distro of elements when not full circle
    slice = 360 * type / numberOfElements;

$elements.each(function(i) {
    var $self = $(this),
        rotate = slice * i + start,
        rotateReverse = rotate * -1;
    
    $self.css({
        'transform': 'rotate(' + rotate + 'deg) translate(' + radius + ') rotate(' + rotateReverse + 'deg)'
    });
});

// Disable longpress on mobile devices
function longClickHandler(e) {
  e.preventDefault();
}

$("div.circleContainer").longclick(250, longClickHandler);

// On tap add selection border
$(function() {
  $("div.circleContainer").bind("vmousedown", tapholdHandler);
  $("div.circleContainer").bind("vmouseup", removeTap);

  function tapholdHandler(event) {
    $(event.target).addClass("tap");
    // console.log("i touched the but");
    // console.log(event.target.id); // which circle is being pressed?
    var idString = (event.target.id); //take the circle id string
    colorNum = idString.slice(6); //slice the string so it only prints the circle number
    // console.log(colorNum); //print button color number
    
    sound[colorNum].start();

    // tell the server that the button has been pressed
    socket.emit('pressed', colorNum);
  }

    function removeTap(event) {
      $(event.target).removeClass("tap");
      for (i=0; i<sound.length; i++){
        sound[i].stop();
      }

      
  }

});

// ********************************************************** 
// OTHER MICROPHONE OPTION OTHER THAN P5
// var webaudio_tooling_obj = function () {

//     var audioContext = new AudioContext();

//     var BUFF_SIZE = 16384;

//     var audioInput = null,
//         microphone_stream = null,
//         gain_node = null,
//         script_processor_node = null,
//         script_processor_fft_node = null,
//         analyserNode = null;

//     if (!navigator.getUserMedia)
//             navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
//                           navigator.mozGetUserMedia || navigator.msGetUserMedia;

//     if (navigator.getUserMedia){

//         navigator.getUserMedia({audio:true}, 
//           function(stream) {
//               start_microphone(stream);
//           },
//           function(e) {
//             alert('Error capturing audio.');
//           }
//         );

//     } else { alert('getUserMedia not supported in this browser.'); }

//     // ---

//     function show_some_data(given_typed_array, num_row_to_display, label) {

//         var size_buffer = given_typed_array.length;
//         var index = 0;
//         var max_index = num_row_to_display;

//         // console.log("__________ " + label);

//         for (; index < max_index && index < size_buffer; index += 1) {

//             // console.log(given_typed_array[index]);
//             micInput = given_typed_array[index];
//             // socket.emit('testingMic', micInput);
//             inputVal = map(micInput, 0, 150, 1, 255);
//             // console.log(inputVal);
//         }
//     }

//     function start_microphone(stream){

//       gain_node = audioContext.createGain();
//       gain_node.connect( audioContext.destination );

//       microphone_stream = audioContext.createMediaStreamSource(stream);
//       // microphone_stream.connect(gain_node); 

//       script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
//       // script_processor_node.onaudioprocess = process_microphone_buffer;

//       microphone_stream.connect(script_processor_node);

//       script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
//       script_processor_fft_node.connect(gain_node);

//       analyserNode = audioContext.createAnalyser();
//       analyserNode.smoothingTimeConstant = 0;
//       analyserNode.fftSize = 2048;

//       microphone_stream.connect(analyserNode);

//       analyserNode.connect(script_processor_fft_node);

//       script_processor_fft_node.onaudioprocess = function() {

//         // get the average for the first channel
//         var array = new Uint8Array(analyserNode.frequencyBinCount);
//         analyserNode.getByteFrequencyData(array);

//         // draw the spectrogram
//         if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {

//             show_some_data(array, 5, "from fft");
//         }
//       };
//     }

//   }(); //  webaudio_tooling_obj = function()

// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();

socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) { 
  console.log('total number of users online is: ' + userCount); // console number of users after one goes off;
});

// ********************************************************** 
// BOOTSTRAP 
// * Start Bootstrap - New Age v5.0.0 (https://startbootstrap.com/template-overviews/new-age)
// * Copyright 2013-2018 Start Bootstrap
// * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-new-age/blob/master/LICENSE)
 
// Scroll trigger
!function(e){
  "use strict";e('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function(){
    if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){
      var a=e(this.hash);if((a=a.length?a:e("[name="+this.hash.slice(1)+"]")).length)return e("html, body").animate({
        scrollTop:a.offset().top-48},1e3,"easeInOutExpo"),!1
      }
    }),
  e(".js-scroll-trigger").click(function(){
  
  }),

  a(),e(window).scroll(a);

}(jQuery);