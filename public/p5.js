var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here -- CHANGE ME!
var options = {
  baudrate: 9600
}; // change the data rate to whatever you wish -- MAKE ME MATCH!
var inData; // for incoming serial data



//p5 Serialport
function checkPorts() {
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event

  serial.list(); // list the serial ports
}

// get the list of ports:
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
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.');
}

// p5.js function protocol
function setup() {
  mic = new p5.AudioIn();
  mic.start();
  // connectToSerialPort(portName); // list and connect to portName, throw errors if they happen
  // serial.write("100"); //send a "hello" value to start off the serial communication
}

function draw() {
  vol = mic.getLevel();
  inputVal = map(vol, 0, 0.4, 1, 255); //inputVal is for arduino to control the fan
  // tell the server that the button has been pressed
  // socket.emit('testingMic', micInput);
  // inputVal = micInput;
}

//Data smoothing functions
function smoothReading(newReading) {
  blowData.shift();
  blowData.push(newReading);
  var total = 0;
  for (var i = 0; i < blowData.length; i++) {
    total += blowData[i];
  }
  var avg = total / blowData.length;
  return avg;
  //maybe use math.floor and do more elegant control on the arduino side
}


function serialEvent() {
  var inString = serial.readStringUntil('\r\n');
  // console.log(haveibeenpressed);
  //check to see that there's actually a string there:
  if (inString.length > 0) {
    //console.log("I read a string that says: " + inString) // if there is something in that line...
    if (inString == "A") { // ... and that something is 'hello' in the form of "A"...
      smoothVal = smoothReading(inputVal); // prepare the value to send
      // combine the mic value and color selection into a 4 digit number for arudiuno
      var tempInt = parseInt(smoothVal);
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
      serial.write("hello"+'\n');
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
