
// //Data smoothing functions
// function smoothReading(newReading) {
//   blowData.shift();
//   blowData.push(newReading);
//   var total = 0;
//   for (var i = 0; i < blowData.length; i++) {
//     total += blowData[i];
//   }
//   var avg = total / blowData.length;
//   return avg;
//   //maybe use math.floor and do more elegant control on the arduino side
// }