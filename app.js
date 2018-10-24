var express = require('express');
var app = express ();
// var path = require('path');
var PORT = process.env.PORT || 5000;
var Request = require('request');
// var http = require('http').Server(app);
var http = require('http').Server(app);

app.use(express.static( __dirname + '/public' ));
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('port', PORT);

app.get('/', function(req, res){
  console.log('user enters..');
  res.render('index');
});

// app.get("*", function(req, res){
// 	res.send('Ooops.. nothing here.');
// });


// var server = app.listen(PORT);

// var server = http.createServer(app);
console.log("App is served on localhost: " + PORT);

var io = require('socket.io')(http);
var userCount = 0;


io.on('connection', function(socket){
  userCount = userCount + 1;
  console.log('a user connected');
  console.log('number of connected users: ' + userCount);
  io.sockets.emit('userCount', userCount);

  socket.on('disconnect', function(){
    userCount = userCount - 1;
    console.log('user disconnected');
    console.log('number of connected users: ' + userCount);
    io.sockets.emit('userCount', userCount);
  });

  function restart (){
    final = 0;
    console.log('restarting...');
  }

});


http.listen(PORT, () => console.log(`Listening on ${ PORT }`));