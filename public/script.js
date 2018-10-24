// ********************************************************** 
// SOCKET COMMUNICATION ON CLIENT SIDE

var socket = io();
// Value of Pressed or not 0 = off, 1 = on
var touchValue = 0;

socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount) {
  // console.log('total number of users online is: ' + userCount);
});

//example from docs
socket.on('news', function(data) {
  console.log(data);
  socket.emit('my other event', {
    my: 'data'
  });
});

socket.on('receiveMessage', function(msg) {
  console.log(msg);
  console.log("hello");
});

// socket.on('tapholdData', function(colorTap){
//   console.log('Color: ' + color);
// });

socket.on('dimensions', function(data) {
  console.log('new data came to light...');
});

// ********************************************************** 
// STARTING JS FILE

//Disable longpress on mobile devices
function longClickHandler(e) {
  e.preventDefault();
  // $("body").append("<p>You longclicked. Nice!</p>");
}

$("div.circle").longclick(250, longClickHandler);


// On tap hold change color
$(function() {
  $("div.circle").bind("taphold", tapholdHandler);

  function tapholdHandler(event) {
    $(event.target).addClass("taphold");
    console.log("i touched the but");
    touchValue = 1;
    var data = 1;
    socket.emit('newData', {
      my: 'data'
      // (touchValue) =>{
      // console.log(touchValue);
      // console.log(touchValue +4);
    });

  }
});

// On tap release go back to original color
$(document).on("vmouseup", function() {
  $(event.target).removeClass("taphold");
});


