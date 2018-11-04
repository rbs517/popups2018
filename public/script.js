// ********************************************************** 
// STARTING JS FILE

// Declaring variables
var mic;
var vol;
var micInput;
var colorNum;
var idString;
var sound = [];
var thisDevice = 12345;
var buttonStatusList = [];

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

  // Tell the server that we want the mic data now 
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
    // claim the color, and tell server
    socket.emit('usingColor', colorNum);
    // local button status is now false (not available)
    buttonStatusList[colorNum] = false;
  }

  // STEP 3 //

  // After button color is claimed, 
  // Get mic input value 
  // micInput = map(vol, 0, 1, 1, 255); //inputVal is for arduino to control the fan


  socket.emit('pressed', colorNum);

  // // Tell the server that we want the mic data now 
  // socket.emit('testingMic', micInput);


  // // set timeout after 8 seconds to release the button 
  // setTimeout(function() { removeTap(idString); }, 10000);
}




// function removeTap(id) {
//   $('#' + idString).removeClass("tap");

//   for (i=0; i<sound.length; i++){
//     sound[i].stop();
//   }
//   // tell the server that the button has been released
//   socket.emit('unpressed', colorNum);

// } 

// STEP 2 //

// Update button color statuses 
function updateButtonsStatus(buttonsStatus){
  // for the buttonsStatus array, 
  for (var i=0; i<buttonsStatus.length; i++){
   
    // if "i" spot in the array is true,
    if (buttonsStatus[i] == true){
      // button is available
      console.log('button ' + i + ' is available');
      buttonStatusList[i] = true;
      
      //update the button css
      $('#' + idString).addClass("tap");
      // console.log("i touched the but");

      // //update the button binding
      // $('#' + idString).bind("vmousedown", tapholdHandler);


    } 

    // if "i" spot in the array is false,
    else if (buttonsStatus[i] == false){
      // button is available
      console.log('button ' + i + ' is not available');
      buttonStatusList[i] = false;
      
      //update the button css
      $('#' + idString).addClass("turnGray");

      // //update the button binding
      // $('#' + idString).unbind("vmousedown", tapholdHandler);
    }
  }
}



  // // tell the server that the button has been pressed
  // socket.emit('pressed', colorNum);



  // sound[colorNum].start();




// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();

// Telling server when new user is connected 
socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) { 
  console.log('total number of users online is: ' + userCount); // console number of users after one goes off;
});


/////////////////////////////////////////////////////////////
/////////////////////BUTTON CHECK////////////////////////////
/////////////////////////////////////////////////////////////

// STEP 1 //

// Ask server to give the button colors that are available -- Upon Window Onload
socket.emit('getColorAvail', thisDevice);

// STEP 2 //

// Getting the button color statuses from the server and update local button status
socket.on(thisDevice,function(buttonsStatus){
  console.log(buttonsStatus);
  updateButtonsStatus(buttonsStatus);
});

// STEP 3 //

// Broadcasted to all clients that the color number has been claimed, now update
socket.on('colorStatusUpdate',function(colorNum){
      // update local button status to taken 
      buttonStatusList[colorNum] = false;
      // update button status to the current button status
      updateButtonsStatus(buttonStatusList);
});


socket.on('colorPressed', function(colorNum){
       // update local button status to taken 
      buttonStatusList[colorNum] = true;
      // update button status to the current button status
      updateButtonsStatus(buttonStatusList);
});





// STEP 4 //

// Broadcasted to all clients that the color number has been released, now update
// socket.on('colorStatusUpdate2',function(colorSelection){
//       // update local button status to taken 
//       buttonStatusList[colorNum] = true;
//       // update button status to the current button status
//       updateButtonsStatus(buttonStatusList);
// });



// socket.on('toColorPresser', function(colorNum){
  // console.log("This is a private message just to the color-presser");
  // $('#' + 'circle' + colorNum).unbind("vmousedown", function(){

  // });
    // console.log('colorNum: ' + colorNum + ' is taken by ME!');  
// });


// socket.on('colorPressed', function(colorNum){
  // console.log("Got colorPressed: " + colorNum);
  //disable button --change to grey
  // $('#' + 'circle' + colorNum).unbind("vmousedown"); //- not a kickoff but disables forever 
  // $('#' + 'circle' + colorNum).addClass('turnGray');

  // removeTap(colorNum);// kick off --tap on/off 

  // setTimeout(function() { addTapBack(colorNum); }, 25000);


  // $('#' + 'circle' + colorNum).addClass('turnGray');
  // set timeout after 8 seconds to release the button 
  // setTimeout(function() { turnGray(colorNum); }, 8000);
  // setTimeout(function() { binding(colorNum);}, 8000);
  // console.log('colorNum: ' + colorNum + ' is taken!');  
// });

// function addTapBack(colorNum){
//   $('#' + 'circle' + colorNum).bind("vmousedown"); 
//   $('#' + 'circle' + colorNum).removeClass('turnGray');

// }

// function binding(colorNum){
//   $('#' + 'circle' + colorNum).bind("vmousedown"); 
// }

// socket.on('toClients', function(colorNum){
  //enable button --change to normal color state
  // $('#' + 'circle' + colorNum).bind("vmousedown"); 
  // $('#' + 'circle' + colorNum).removeClass('turnGray');
  // console.log('colorNum: ' + colorNum + ' is no longer taken');
// });

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