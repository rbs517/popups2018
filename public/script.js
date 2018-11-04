// ********************************************************** 
// STARTING JS FILE

// Declaring variables
var mic;
var micInput;
var colorNum;
var idString;
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
// $(function() {
  // vmousedown and vmouseup become a part of the circle DIVVV
  // for (var i = 0;  i<10; i++){
  //   $('#' + 'circle' +i).bind("vmousedown", tapholdHandler);
  //   // console.log(event.target);
  // }

    $("div.circleContainer").bind("vmousedown", tapholdHandler);
    // $("div.circleContainer").bind("vmouseup", removeTap);
    
    function tapholdHandler(event) {
      $(event.target).addClass("tap");
      // console.log("i touched the but");
      console.log(event.target); // which circle is being pressed?
      idString = (event.target.id); //take the circle id string
      colorNum = idString.slice(6); //slice the string so it only prints the circle number
      // console.log(colorNum); //print button color number
      
      sound[colorNum].start();
      
      // tell the server that the button has been pressed
      socket.emit('pressed', colorNum);

      // set timeout after 8 seconds to release the button 
      setTimeout(function() { removeTap(idString); }, 8000);
    }

    function removeTap(id) {
      $('#' + idString).removeClass("tap");

      for (i=0; i<sound.length; i++){
        sound[i].stop();
      }
      // tell the server that the button has been released
      socket.emit('unpressed', colorNum);

    } 

// });



// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();

socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) { 
  console.log('total number of users online is: ' + userCount); // console number of users after one goes off;
});


socket.on('toColorPresser', function(colorNum){
  // console.log("This is a private message just to the color-presser");
  // $('#' + 'circle' + colorNum).unbind("vmousedown", function(){

  // });
    // console.log('colorNum: ' + colorNum + ' is taken by ME!');  
});


socket.on('colorPressed', function(colorNum){
  // console.log("Got colorPressed: " + colorNum);
  //disable button --change to grey
  // $('#' + 'circle' + colorNum).addClass('turnGray');
  // removeTap(colorNum);
  // $('#' + 'circle' + colorNum).addClass('turnGray');
  // set timeout after 8 seconds to release the button 
  // setTimeout(function() { turnGray(colorNum); }, 8000);
  setTimeout(function() { removeTap(colorNum); unbind(colorNum);}, 8000);
  // console.log('colorNum: ' + colorNum + ' is taken!');  
});

function unbind(colorNum){
  $('#' + 'circle' + colorNum).unbind("vmousedown", tapholdHandler); 
}

// socket.on('toClients', function(colorNum){
//   //enable button --change to normal color state
//   $('#' + 'circle' + colorNum).bind("vmousedown", tapholdHandler); 
  // $('#' + 'circle' + colorNum).removeClass('turnGray');
//   // console.log('colorNum: ' + colorNum + ' is no longer taken');
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