// ********************************************************** 
// STARTING JS FILE

// Declaring variables
var mic;
var vol = 0;
var avgVol = 0;
var micInput = 2;
var colorNum;
var idString;
var sound = [];
var thisDevice;
var buttonStatusList = [];
var myActiveButtons = [false,false,false,false,false,false,false,false,false,false]; 
var buttonColors = ['#ff0019', '#ed2157', '#ff5900', '#ffe500', '#b0f442', '#00ffcb','#00f6ff', '#639EFC', '#D053F1', '#8c00ff'];
var circleNumber;
var counter = 0;
var instantMeter;
var slowMeter;
var AudioContext;
var SoundMeter;
var micAvg;
var micData = [0,0,0,0,0,0,0,0,0,0];


// Sketch

// p5.js function protocol
function setup() {
  noCanvas();

  // load sounds
  sound[0] = new p5.Oscillator(220.00, 'sine');
  sound[1] = new p5.Oscillator(369.99, 'sine');
  sound[2] = new p5.Oscillator(277.18, 'sine');
  sound[3] = new p5.Oscillator(329.63, 'sine');
  sound[4] = new p5.Oscillator(349.23, 'sine');
  sound[5] = new p5.Oscillator(207.65, 'sine');
  sound[6] = new p5.Oscillator(293.66, 'sine');
  sound[7] = new p5.Oscillator(196.00, 'sine');
  sound[8] = new p5.Oscillator(270.66, 'sine');
  sound[9] = new p5.Oscillator(300.50, 'sine');

}

// Allow Chrome to access microphone

  /*
   *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */

'use strict';

var instantMeter = document.querySelector('#instant meter');
var slowMeter = document.querySelector('#slow meter');


var instantValueDisplay = document.querySelector('#instant .value');
var slowValueDisplay = document.querySelector('#slow .value');

instantMeter.style.display = "none";
slowMeter.style.display = "none";
instantValueDisplay.style.display = "none";
slowValueDisplay.style.display = "none";

try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API not supported');
}

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
  audio: true
  // video: false
};


function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  window.stream = stream;
  soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
  soundMeter.connectToSource(stream, function(e) {
    if (e) {
      alert(e);
      return;
    }
    setInterval(() => {
      instantMeter.value = instantValueDisplay.innerText =
        soundMeter.instant.toFixed(2);
      slowMeter.value = slowValueDisplay.innerText =
        soundMeter.slow.toFixed(2);

        // console.log('instant :' + instantMeter.value );
        // console.log('slow :'+ slowMeter.value);

        vol = instantMeter.value;
        avgVol = slowMeter.value;
        updateArray(micData, vol);
        micAvg = average(micData);


    }, 15);
  });
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);



function draw() {

}



// Circles placed in a circle design for taphold page
var type = 1, // circle type - 1 whole, 0.5 half, 0.25 quarter
    radius = '22em', // distance from center
    start = -162, // shift start from 0
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
$("div.circleContainer").bind("vmousedown", tapholdHandler);
// $("div.circleContainer").bind("vmouseup", removeTap);

function tapholdHandler(event) {
    // console.log(event.target); // which circle is being pressed?
  idString = (event.target.id); // take the circle id string
  colorNum = idString.slice(6); // slice the string so it only prints the circle number
    // console.log(colorNum); // print button color number

  // STEP 1 //

  // Ask server to give the button colors that are available -- Upon Tap
  socket.emit('getColorAvail', thisDevice);

  // STEP 2 //

  // If button color is available
  if (buttonStatusList[colorNum] == true){
      console.log("asking the server to restrict color " + colorNum + ' for me');
    // claim the color by tellling the server
    socket.emit('usingColor', colorNum, false);

    // REBECCA!!! DONT FORGET TO CHANGE THIS BACK WHEN THE USER IS DONE WITH THE BUTTON
    // The color number that corresponds to the number in my array (of active buttons) is true
    myActiveButtons[colorNum] = true;
    $('#' + idString).addClass("tap");
      console.log("i touched the but");

    sound[colorNum].amp(1.0);  
    sound[colorNum].start();

  } else {
      console.log("that color number is not available");
  }

  // STEP 3 //
  sendMicData(colorNum);
}


// STEP 4 //

// Send mic and button color data to server
function sendMicData(colorNum) {

    // After button color is claimed, send data for x seconds
  var interval = setInterval(function(){
      // Get mic volume level/ blow val 
      // vol = mic.getLevel();

      console.log('volume :' + vol);
      console.log('avg volume :' + avgVol);
  

      // Get mic input value 
      var micMapped = constrain(map(micAvg, 0, 0.03, 1, 9), 4, 9);

      // var micMapped = constrain(map(vol, 0, 0.06, 1, 9), 4, 9); // inputVal is for arduino to control the fan
      micInput = Math.floor(micMapped);

        console.log("gonna send micVal " + micInput + " and colorNum " + colorNum + " to the server");
      socket.emit('liveData', micInput, colorNum);
    },250);

  var timeout = setTimeout(function() {
        console.log("circle " + colorNum +" timing out now");
      clearInterval(interval);

      // removing the color number from the local list of active buttons
      myActiveButtons[colorNum] = false;
      // remove the tap css from it
      $('#circle' + colorNum).removeClass("tap");

      sound[colorNum].stop();

      // tell the server we're done with the color
      socket.emit('usingColor', colorNum, true);

      // tell the server to send a kill message to the fans (via /local)
      socket.emit('killData',colorNum);

  },20000);

}

// UPDATE FUNCTIONS //

// Update button color statuses 
function updateButtonsStatus(buttonsStatus){
  // for the buttonsStatus array, 
  for (var i=0; i<buttonsStatus.length; i++){
    // if "i" spot in the array is true,
    if (buttonsStatus[i] == true){
      // button is available
        console.log('button ' + i + ' is available, updating my local list');
      buttonStatusList[i] = true;
    } 

    // if "i" spot in the array is false,
    else if (buttonsStatus[i] == false && myActiveButtons[i] == false){
      // button is not available
        console.log('button ' + i + ' is not available');
      buttonStatusList[i] = false;
    }
  }
}

// After color has been claimed
function updateButtonElements(localButtonStatus){
  // for the buttonsStatus array, 
  for (var i=0; i<localButtonStatus.length; i++){
    circleNumber = "circle" + i;

    $('#' + circleNumber).unbind("vmousedown", tapholdHandler);

    // if "i" spot in the array is true,
    if (localButtonStatus[i] == true){
      // button is available
        console.log('setting button ' + i + ' as active');
      $('#' + circleNumber).css("background-color", buttonColors[i]);
      // update the button css
      //update the button binding
      $('#' + circleNumber).bind("vmousedown", tapholdHandler);
    } 

    // if "i" spot in the array is false,
    else if (localButtonStatus[i] == false){
      // button is not available
        console.log('setting button ' + i + ' as inactive');
      
      //update the button css
      $('#' + circleNumber).css("background-color", "gray");
      $('#' + circleNumber).removeClass("tap");
      // update the button binding
      $('#' + circleNumber).unbind("vmousedown", tapholdHandler); 

      // // set a variable counter
      // counter++;

      // // when counter is at 10, send alert to everyone to try again soon.
      // if (counter == 10){
      //   socket.emit('countedTen', counter);
      // } else{

      // }
   
    }
  }
}

// Data smoothing function
function updateArray(array, newReading) {
  array.shift();
  array.push(newReading);
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

// Window onload timeout and alert 
function alertFunc(){
  // alert("You have timed out of Fluto. Please refresh page to begin again");
  for (var i = 0; i<myActiveButtons.length; i++){
    if (myActiveButtons[i] == true){

      // tell the server we're done with the color
      socket.emit('usingColor', i, true);
    }
  }

    

}


window.onload = function(){
  // set timeout and alert for after 5 minutes 
  // setTimeout(function(){ alertFunc(); }, 300000);
};


// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();

// Telling server when new user is connected 
socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) { 
  console.log('total number of users online is: ' + userCount); // console number of users after one goes off;
});

// On disconnect
socket.on('disconnect', function(){
  alertFunc();
});

// socket.on('fullHouse', function(){
//   alert("All buttons are being used. Please try again soon");

// });

// On disconnect
// socket.on('disconnect', (reason) => {
//   if (reason === 'io server disconnect') {
//     // the disconnection was initiated by the server, you need to reconnect manually
//     socket.connect();
//   }
//   // else the socket will automatically try to reconnect
// });


// BUTTON CHECK

thisDevice = getRandomIntInclusive(1,1000);

// STEP 1 //

// Ask server to give the button colors that are available -- Upon Window Onload
socket.emit('getColorAvail', thisDevice);

// STEP 2 //

// Getting the button color statuses from the server and update local button status
socket.on(thisDevice,function(buttonsStatus){
    console.log(buttonsStatus);
  updateButtonsStatus(buttonsStatus);
  updateButtonElements(buttonStatusList);
});

// STEP 3 //

// Broadcasted to all clients that the color number has been claimed, now update
socket.on('colorStatusUpdate',function(colorNum, colorStatus){
    console.log("color: " + colorNum + " is now taken or released");
  // update local button status to taken 
  buttonStatusList[colorNum] = colorStatus;
  // update button status to the current button status
  updateButtonElements(buttonStatusList);
});


// Thanks mdn
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

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
