// ********************************************************** 
// STARTING JS FILE

// Declaring variables
var mic;
var vol;
var micInput;
var colorNum;
var idString;
var sound = [];
var thisDevice;
var buttonStatusList = [];
var myActiveButtons = [false,false,false,false,false,false,false,false,false,false]; 

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
  // vol = mic.getLevel();
  // micInput = map(vol, 0, 1, 1, 255); //inputVal is for arduino to control the fan

  // // Tell the server that we want the mic data now 
  // socket.emit('testingMic', micInput);
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
    console.log("asking the server to restrict color " + colorNum + ' for me');
    // claim the color by tellling the server
    socket.emit('usingColor', colorNum);
    // local button status is now false (not available)
    // buttonStatusList[colorNum] = false;


    //REBECCA!!! DONT FORGET TO CHANGE THIS WHEN THE USER IS DONE WITH THE BUTTON
    myActiveButtons[colorNum] = true;
  } else {
    console.log("that color number is not available");
  }

  // STEP 3 //

  // After button color is claimed, 

  // Get mic volume level/ blow val 
  vol = mic.getLevel();
  
  // Get mic input value 
  micInput = map(vol, 0, 1, 1, 255); //inputVal is for arduino to control the fan

  // Tell the server that we want the mic and color data now 
  socket.emit('liveData', micInput, colorNum);

  $('#' + idString).addClass("tap");
  console.log("i touched the but");

}




//   // // set timeout after 8 seconds to release the button 
//   setTimeout(function() { sendingData(micInput); }, 10000);
// }


// sendingData function () {

// }

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

function updateButtonElements(localButtonStatus){
  // for the buttonsStatus array, 
  for (var i=0; i<localButtonStatus.length; i++){
    var circleNumber = "circle" + i;
    // if "i" spot in the array is true,
    if (localButtonStatus[i] == true){
      // button is available
      console.log('setting button ' + i + ' as active');
      $('#' + circleNumber).css("background-color");

      // //update the button binding
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
      $('#' + circleNumber).unbind("vmousedown", tapholdHandler);    }
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
socket.on('colorStatusUpdate',function(colorNum){
      console.log("got an update from the server - " + colorNum + "is now taken");
      // update local button status to taken 
      buttonStatusList[colorNum] = false;
      // update button status to the current button status
      updateButtonElements(buttonStatusList);
});


// socket.on('colorPressed', function(colorNum){
//        // update local button status to taken 
//       buttonStatusList[colorNum] = true;
//       // update button status to the current button status
//       updateButtonsStatus(buttonStatusList);
// });






// STEP 4 //

//Broadcasted to all clients that the color number has been released, now update
socket.on('colorStatusUpdate2',function(colorNum){
      // update local button status to taken 
      buttonStatusList[colorNum] = true;
      setTimeout(function() { changeCSS(colorNum); updateButtonsStatus(buttonStatusList); }, 10000);
});

function changeCSS(colorNum){
  $('#' + 'class' + colorNum).removeClass("tap");
  $('#' + 'class' + colorNum).unbind("vmousedown", tapholdHandler);
}


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

//Thanks mdn
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}