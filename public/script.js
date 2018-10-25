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
  // $("body").append("<p>You longclicked. Nice!</p>");
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
    
    // socket.emit('mouse', data);

    // socket.emit('newData', 
    // {my: 'data'
    //   // (touchValue) =>{
    //   // console.log(touchValue);
    //   // console.log(touchValue +4);
    // });

    // //example from docs
    // socket.on('news', function(data) {
    //   console.log(data);
    //   socket.emit('my other event', {
    //     my: 'data'
    //   });
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




function setup() {

  mic = new p5.AudioIn();
  mic.start();

  // createCanvas(200, 200);
  // background(200);
  // // var button = createButton("Start Blowing");
  // // button.style("background-color:red");
  // socket = io.connect('https://fluto.ngrok.io');
  // // socket.on('mouse', newDrawing);
}

// function newDrawing(data) {
  // background(200);
  // fill(127);
  // stroke(0);
  // ellipse(width / 2, data - 25, 50, 50);

// }

function blowVal() {

  // var interval = setInterval(function() {
    vol = mic.getLevel();
    // h = map(vol, 0, 1, height, 0); //for ellipse
    h = map(vol, 0.3, 1, 130, 255); //for fan
    data = h;
    // if (data )
    //newDrawing(data);
    // var myBtn = document.getElementById('circle1');
    // myBtn.style.backgroundColor = "red";
    // myBtn.disabled = true;
    socket.emit('mouse', data);
    console.log('Sending: ' + data);
  // }, 10);



  // setTimeout(function() {
  //   // isStop = true;
  //   myBtn.disabled = false;
  //   clearInterval(interval);
  // }, 5000);

  // setTimeout(function() {
  //   myBtn.style.backgroundColor = '#4CAF50';
  //   data = 125;
  //   socket.emit('mouse', data);
  //   console.log('Sending: ' + data);
  // }, 5100);

}


// var setBtn = document.getElementById('myBtn');
// setBtn.addEventListener("click", function() {
//   blowVal();
// });


function draw() {

  // blowVal();
}
















// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();
// Value of Pressed or not 0 = off, 1 = on
// var touchValue = 0;

socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) {
  // console.log('total number of users online is: ' + userCount);
});

// socket.on('dimensions', function(data){
//   w = data.w;
//   h = data.h;
// });
// //example from docs
// socket.on('news', function(data) {
//   console.log(data);
//   socket.emit('my other event', {
//     my: 'data'
//   });
// });

// socket.on('receiveMessage', function(msg) {
//   console.log(msg);
//   console.log("hello");
// });

// socket.on('tapholdData', function(colorTap){
//   console.log('Color: ' + color);
// });

// socket.on('dimensions', function(data) {
//   console.log('new data came to light...');
// });


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


