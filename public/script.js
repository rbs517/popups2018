// ********************************************************** 
// STARTING JS FILE

// Declaring variables
var mic;
var vol;
var micInput = 2;
var colorNum;
var idString;
var sound = [];
var thisDevice;
var buttonStatusList = [];
var myActiveButtons = [false,false,false,false,false,false,false,false,false,false]; 
var buttonColors = ['maroon', 'red', 'orange', 'yellow', 'green', 'lime', 'teal', 'aqua', 'blue', 'purple'];
var circleNumber;
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
  
  // Get mic input value 
  var micMapped = map(vol, 0, 0.2, 2, 9); //inputVal is for arduino to control the fan
  micInput = Math.floor(micMapped);
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
// // Disable double tap and zoom on mobile devices
// $('.no-zoom').bind('touchend', function(e) {
//   e.preventDefault();
//   // Add your code here. 
//   $(this).click();
//   // This line still calls the standard click event, in case the user needs to interact with the element that is being clicked on, but still avoids zooming in cases of double clicking.
// });

// // Keep portrait orientation locked on mobile devices
// lockedAllowed = window.screen.lockOrientation(portrait);


$("div.circleContainer").longclick(250, longClickHandler);

// On tap add selection border
$("div.circleContainer").bind("vmousedown", tapholdHandler);
// $("div.circleContainer").bind("vmouseup", removeTap);

function tapholdHandler(event) {
  // console.log(event.target); // which circle is being pressed?
  idString = (event.target.id); //take the circle id string
  colorNum = idString.slice(6); //slice the string so it only prints the circle number
  // console.log(colorNum); //print button color number

  // STEP 1 //

  // Ask server to give the button colors that are available -- Upon Tap
  socket.emit('getColorAvail', thisDevice);

  // STEP 2 //

  // If button color is available
  if (buttonStatusList[colorNum] == true){
    console.log("asking the server to restrict color " + colorNum + ' for me');
    // claim the color by tellling the server
    socket.emit('usingColor', colorNum, false);

    //REBECCA!!! DONT FORGET TO CHANGE THIS BACK WHEN THE USER IS DONE WITH THE BUTTON
    // The color number that corresponds to the number in my array (of active buttons) is true
    myActiveButtons[colorNum] = true;
    $('#' + idString).addClass("tap");
    console.log("i touched the but");

  } else {
    console.log("that color number is not available");
  }

  // STEP 3 //
  sendMicData(micInput,colorNum);

  // micTimer(colorNum);
  // stopActiveTimer(colorNum);
}


// STEP 2 //

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

    // set a variable counter
    // evertime when you set a button grey, the counter +1
    // at the end of the loop, if the counter == 10, do a alert

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
   
    }
  }
}

function sendMicData(micInput,colorNum) {
    // After button color is claimed, send data for x seconds
  var interval = setInterval(function(){
      console.log("gonna send micVal " + micInput + " and colorNum " + colorNum + " to the server");
      socket.emit('liveData', micInput, colorNum);
    },100);

  var timeout = setTimeout(function() {
      console.log("circle " + colorNum +" timing out now");
      clearInterval(interval);

      // removing the color number from the local list of active buttons
        myActiveButtons[colorNum] = false;
        // remove the tap css from it
      $('#circle' + colorNum).removeClass("tap");

      // tell the server we're done with the color
      socket.emit('usingColor', colorNum, true);

      // tell the server to send a kill message to the fans (via /local)
      socket.emit('killData',colorNum);

  },2000);

  // setTimeout(function(){ clearInterval(interval); console.log('cleared'); sendColorData(micInput,colorNum);}, 4000);
}

function alertFunc(){
  alert("You have timed out of Fluto. Please refresh page to begin again");
}


window.onload = function(){
  // set timeout and alert for after 5 minutes 
  setTimeout(function(){ alertFunc(); }, 300000);
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


// On disconnect
// socket.on('disconnect', (reason) => {
//   if (reason === 'io server disconnect') {
//     // the disconnection was initiated by the server, you need to reconnect manually
//     socket.connect();
//   }
//   // else the socket will automatically try to reconnect
// });


/////////////////////////////////////////////////////////////
/////////////////////BUTTON CHECK////////////////////////////
/////////////////////////////////////////////////////////////

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
