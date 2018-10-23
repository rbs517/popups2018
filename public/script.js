var canvasHeight, canvasWidth, cnv;

var h = 5;
var w = 5;
var limit, restartInterval, final;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  canvasWidth = 400;
  canvasHeight = 400;
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  smooth();
}

function windowResized() {
  centerCanvas();
}

var socket = io();
socket.emit('user', 'new user is connected');
socket.on('userCount', function(userCount){
  console.log('total number of users online is: ' + userCount);
});

socket.on('dimensions', function(data){
  w = data.w;
  h = data.h;
  limit = data.limit;
  restartInterval = data.restartInterval;
  final = data.final;
  console.log('new data came to light...');
  console.log('h = ' + h);
  console.log('w = ' + w);
  console.log('limit: ' + limit);
  console.log('restartInterval: ' + restartInterval);
  console.log('final state: ' + final);

  if (data.r) {
    r = data.r;
    g = data.g;
    b = data.b;
    x = data.x;
    y = data.y;
  }
});

function mousePressed(){
  if (final !== 2) {
    console.log("click");
    // generating random color
    // var r = Math.round(Math.random() * (256 - 0));
    // var g = Math.round(Math.random() * (256 - 0));
    // var b = Math.round(Math.random() * (256 - 0));

    // getting mouse position
    // var x = mouseX;
    // var y = mouseY;
    // shooting data to the server
    // socket.emit('click', {r: r, g: g, b: b, x: x, y: y});
    // fill('rgba(0,255,0, 0.25)');
    socket.emit('click', 'click');

  }
}

function draw() {
  background(30, 32, 33);
  smooth();
  if (final == 2) {
    var blue = Math.round((Math.random() * 100)) + 230 ;
    var green = Math.round((Math.random() * 100)) + 220 ;
    var red = Math.round((Math.random() * 100)) + 140 ;
    // console.log(blue);
    fill(red, green, blue);
  }
  else {
    fill(142, 227, 239);
  }

  noStroke();
  if (final === 0) {
    ellipse((windowWidth/2), (windowHeight/2), w, h);
  }
  if (final === 1) {
    ellipse((windowWidth/2), (windowHeight/2 - 10), w, h);
    textSize(32);
    textFont("Courier New");
    textStyle(NORMAL);
    fill(30, 32, 33);
    textAlign('center');
    text("hello itp", (windowWidth/2), (windowHeight/2));
  }
  if (final === 2) {
    ellipse((windowWidth/2), (windowHeight/2 - 10), limit, limit);
    textSize(32);
    textStyle(BOLD);
    textFont("Courier New");
    fill(30, 32, 33);
    textAlign('center');
    text("hello world", (windowWidth/2), (windowHeight/2));
  }

}


function reduceSize () {
  console.log("reducing size...");
  socket.emit('reduce', 'reduce');
}

function restart (){
  final = 0;
}
