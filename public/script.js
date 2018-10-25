// ********************************************************** 
// STARTING JS FILE

// Declaring variables
var mic;
var inputVal;
var vol = 0;
var h;
var data;
var isStop = false;


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
    console.log("i touched the but");
    console.log(event.target.id);
    blowVal(); //only if you are pressing, will the mic be listening
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


function setup() {
  mic = new p5.AudioIn();
  mic.start();
}

function blowVal() {
    vol = mic.getLevel();
    // h = map(vol, 0, 1, height, 0); //for ellipse
    h = map(vol, 0.3, 1, 130, 255); //for fan
    data = h;
    socket.emit('mouse', data);
    console.log('Sending: ' + data);
}

function draw() {

}


// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();

socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) {
  // console.log('total number of users online is: ' + userCount);
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


