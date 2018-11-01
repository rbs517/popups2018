// ********************************************************** 
// INIT THE SERIALPORT COMMUNICATION (OPEN SERIAL TO ARDUINO) 

// Declare Global Variables
var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here -- CHANGE ME!
var options = {
  baudrate: 9600 // change the data rate to whatever you wish -- MAKE ME MATCH!
}; 
var inData; // for incoming serial data
var inputVal = 1;
var colorSelection=0;
var colorSelectonString;
var outputString;
var outputVal;
var smoothVal;
var inputValString;
var blowData = [0, 0, 0, 0, 0]; // an array of recent microphone readings (for moving average)

// Get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function connectToSerialPort(port) {
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(port, options); // open a serial port
  serial.write("100"); //send a "hello" value to start off the serial communication
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.');
}

// Data smoothing function
function smoothReading(newReading) {
  blowData.shift();
  blowData.push(newReading);
  var total = 0;
  for (var i = 0; i < blowData.length; i++) {
    total += blowData[i];
  }
  var avg = total / blowData.length;
  return avg;
  // maybe use math.floor and do more elegant control on the arduino side
}

function serialEvent() {
  var inString = serial.readStringUntil('\r\n');
  //check to see that there's actually a string there:
  if (inString.length > 0) {
    // console.log("I read a string that says: " + inString);  // if there is something in that line...
    if (inString == "A") { // ... and that something is 'hello' in the form of "A"...
      smoothVal = smoothReading(inputVal); // prepare the value to send
      // combine the mic value and color selection into a 4 digit number for arduino
      var tempInt = smoothVal;
      inputValString = String(tempInt);
      // var tempVal = int(smoothVal);
      if (inputValString.length == 1) {inputValString = "00" + inputValString};
      if (inputValString.length == 2) {inputValString = "0" + inputValString};
      colorSelectonString = String(colorSelection);
      outputString = inputValString + colorSelectonString; //mash together the intended strip (0 -4) and the value
      // outputVal = int(outputString);
      // outboundString = String(outPutVal); //mash together the intended strip (0 -4) and the value
      // outboundString = String(colorSelection) + String(outPutVal); //mash together the intended strip (0 -4) and the value
      // outBoundInt = int(outboundString); //convert it to a string
      console.log("sending: " + outputString);
      serial.write(outputString+ '\n'); // write the value - add + '\n' if using arduino uno
    }
    // else {serial.clear();
    //   serial.write(valToSend + '\n'); // write the value
    // }
  }
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}

// ********************************************************** 
// INIT SOCKET.IO

let init = () => {

	var socket = io();

	socket.emit('user', 'new user is connected');
	socket.on('userCount', function(userCount) { 
  console.log('total number of users online is: ' + userCount); //console number of users after one goes off;
	});
	
  console.log("init done");

// ********************************************************** 
// WHEN RECEIVE DATA FROM SOCKET.IO, SEND THE DATA TO SERIALPORT 

	socket.on('toLocal', function(data){
		// this is the function got long press data from socket.io server
		// console.log(data); // colorNum data
    colorSelection = Math.floor(data);
	});

  socket.on('toLocal2', function(data){
    // console.log(data); // mic data
    inputVal = Math.floor(data);
  });

	connectToSerialPort(portName);
};


// init a connection to socket.io server (heroku server)
window.onload =init();