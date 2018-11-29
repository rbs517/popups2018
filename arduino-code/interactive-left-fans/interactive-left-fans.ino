//Created for FLUTO - Popup Windows 2018
//Designed to run on Arduino ZERO
//FIRST SET CODE

// Libraries
#include <FastLED.h>

//--------------------------HARDWARE VARIABLES------------------------

#define NUM_TUBES 5 // Number of tubes being controlled

//Writeout pins of the fans (blue wire)
#define TUBE_FAN_1_PIN  4
#define TUBE_FAN_2_PIN  6
#define TUBE_FAN_3_PIN  9
#define TUBE_FAN_4_PIN  11
#define TUBE_FAN_5_PIN  13

//Null pins of the fans (yellow wire)
#define TUBE_FAN_NULL_1_PIN  5
#define TUBE_FAN_NULL_2_PIN  7
#define TUBE_FAN_NULL_3_PIN  8
#define TUBE_FAN_NULL_4_PIN  10
#define TUBE_FAN_NULL_5_PIN  12

// Data Pins of the LED strips
#define TUBE_STRIP_1_PIN  46
#define TUBE_STRIP_2_PIN  45
#define TUBE_STRIP_3_PIN  44
#define TUBE_STRIP_4_PIN  2
#define TUBE_STRIP_5_PIN  3

// Pixel length of the LED strip types (long, medium, and short)
#define N_LEDS_LONG 86
#define N_LEDS_MID 80
#define N_LEDS_SHORT 72

#define LED_TYPE    WS2812B  // LED Strip type
#define UPDATES_PER_SECOND 24 // how often the strip should update (ideally)
#define FASTLED_INTERRUPT_RETRY_COUNT 1  //try this if the LEDs are still freaking out
//#define FASTLED_ALLOW_INTERRUPTS 0       //try this instead if the LEDs are still freaking out

//Provisioning 5 strips with individual names - 1 long, 2 medium, 1 short
CRGB LONG_STRIP_1[N_LEDS_LONG];
CRGB MID_STRIP_1[N_LEDS_MID];
CRGB MID_STRIP_2[N_LEDS_MID];
CRGB SHORT_STRIP_1[N_LEDS_SHORT];
CRGB SHORT_STRIP_2[N_LEDS_SHORT];

int lengthsArray[] = {N_LEDS_MID, N_LEDS_SHORT, N_LEDS_LONG, N_LEDS_SHORT, N_LEDS_MID};     // an array containing each strip's length

int fansArray[] = {TUBE_FAN_1_PIN, TUBE_FAN_2_PIN, TUBE_FAN_3_PIN, TUBE_FAN_4_PIN, TUBE_FAN_5_PIN, 0, 0, 0, 0, 0}; //an array containing each fan's data pin
int fansNullArray[] = {TUBE_FAN_NULL_1_PIN, TUBE_FAN_NULL_2_PIN, TUBE_FAN_NULL_3_PIN, TUBE_FAN_NULL_4_PIN, TUBE_FAN_NULL_5_PIN, 0, 0, 0, 0, 0}; //an array containing each dummy pin to write 0 to

int fanLowValues[] = {120, 120, 120, 120, 120, 0, 0, 0, 0, 0}; //the value when the fans are passively blowing
int fanHighValues[] = {255, 255, 255, 255, 255, 0, 0, 0, 0, 0}; //an extreme high value for each fan to quickly boost airflow - varies based on individual tubes and environmental conditions (i.e. airflow)

//-------------------------------------BEGIN PALETTES--------------------------------------------//

CRGB pinkPassive1 = CHSV(128, 255, 255);
CRGB pinkPassive2 = CHSV(128, 255, 255);
CRGB pinkPassive3 = CHSV(118, 255, 255);
CRGB pinkPassive4 = CHSV(118, 255, 255);
CRGB redPassive1 = CHSV(100, 170, 255);
CRGB redPassive2 = CHSV(100, 170, 255);
CRGB redPassive3 = CHSV(90, 160, 255);
CRGB redPassive4 = CHSV(90, 160, 255);
CRGB orangePassive1 = CHSV(100, 255, 255);
CRGB orangePassive2 = CHSV(100, 255, 255);
CRGB orangePassive3 = CHSV(94, 240, 255);
CRGB orangePassive4 = CHSV(94, 240, 255);
CRGB yellowPassive1 = CHSV(88, 255, 255);
CRGB yellowPassive2 = CHSV(88, 255, 255);
CRGB yellowPassive3 = CHSV(82, 255, 255);
CRGB yellowPassive4 = CHSV(82, 255, 255);
CRGB lightGreenPassive1 = CHSV(75, 255, 255);
CRGB lightGreenPassive2 = CHSV(75, 255, 255);
CRGB lightGreenPassive3 = CHSV(69, 255, 255);
CRGB lightGreenPassive4 = CHSV(69, 255, 255);
CRGB darkGreenPassive1 = CHSV(38, 200, 255);
CRGB darkGreenPassive2 = CHSV(38, 200, 255);
CRGB darkGreenPassive3 = CHSV(32, 200, 255);
CRGB darkGreenPassive4 = CHSV(32, 200, 255);
CRGB lightBluePassive1 = CHSV(-18, 255, 255);
CRGB lightBluePassive2 = CHSV(-18, 255, 255);
CRGB lightBluePassive3 = CHSV(-24, 255, 255);
CRGB lightBluePassive4 = CHSV(-24, 255, 255);
CRGB darkBluePassive1 = CHSV(-60, 200, 255);
CRGB darkBluePassive2 = CHSV(-60, 200, 255);
CRGB darkBluePassive3 = CHSV(-66, 200, 255);
CRGB darkBluePassive4 = CHSV(-66, 200, 255);
CRGB lightPurplePassive1 = CHSV(-90, 255, 255);
CRGB lightPurplePassive2 = CHSV(-90, 255, 255);
CRGB lightPurplePassive3 = CHSV(-96, 255, 255);
CRGB lightPurplePassive4 = CHSV(-96, 255, 255);
CRGB darkPurplePassive1 = CHSV(148, 255, 255);
CRGB darkPurplePassive2 = CHSV(148, 255, 255);
CRGB darkPurplePassive3 = CHSV(142, 255, 255);
CRGB darkPurplePassive4 = CHSV(142, 255, 255);

CRGBPalette16 pinkPalettePassive = CRGBPalette16(pinkPassive1, pinkPassive2, pinkPassive3, pinkPassive4, pinkPassive1, pinkPassive2, pinkPassive3, pinkPassive4, pinkPassive1, pinkPassive2, pinkPassive3, pinkPassive4, pinkPassive1, pinkPassive2, pinkPassive3, pinkPassive4);
CRGBPalette16 redPalettePassive = CRGBPalette16(redPassive1, redPassive2, redPassive3, redPassive4, redPassive1, redPassive2, redPassive3, redPassive4, redPassive1, redPassive2, redPassive3, redPassive4, redPassive1, redPassive2, redPassive3, redPassive4);
CRGBPalette16 orangePalettePassive = CRGBPalette16(orangePassive1, orangePassive2, orangePassive3, orangePassive4, orangePassive1, orangePassive2, orangePassive3, orangePassive4, orangePassive1, orangePassive2, orangePassive3, orangePassive4, orangePassive1, orangePassive2, orangePassive3, orangePassive4);
CRGBPalette16 yellowPalettePassive = CRGBPalette16(yellowPassive1, yellowPassive2, yellowPassive3, yellowPassive4, yellowPassive1, yellowPassive2, yellowPassive3, yellowPassive4, yellowPassive1, yellowPassive2, yellowPassive3, yellowPassive4, yellowPassive1, yellowPassive2, yellowPassive3, yellowPassive4);
CRGBPalette16 lightGreenPalettePassive = CRGBPalette16(lightGreenPassive1, lightGreenPassive2, lightGreenPassive3, lightGreenPassive4, lightGreenPassive1, lightGreenPassive2, lightGreenPassive3, lightGreenPassive4, lightGreenPassive1, lightGreenPassive2, lightGreenPassive3, lightGreenPassive4, lightGreenPassive1, lightGreenPassive2, lightGreenPassive3, lightGreenPassive4);
CRGBPalette16 darkGreenPalettePassive = CRGBPalette16(darkGreenPassive1, darkGreenPassive2, darkGreenPassive3, darkGreenPassive4, darkGreenPassive1, darkGreenPassive2, darkGreenPassive3, darkGreenPassive4, darkGreenPassive1, darkGreenPassive2, darkGreenPassive3, darkGreenPassive4, darkGreenPassive1, darkGreenPassive2, darkGreenPassive3, darkGreenPassive4);
CRGBPalette16 lightBluePalettePassive = CRGBPalette16(lightBluePassive1, lightBluePassive2, lightBluePassive3, lightBluePassive4, lightBluePassive1, lightBluePassive2, lightBluePassive3, lightBluePassive4, lightBluePassive1, lightBluePassive2, lightBluePassive3, lightBluePassive4, lightBluePassive1, lightBluePassive2, lightBluePassive3, lightBluePassive4);
CRGBPalette16 darkBluePalettePassive = CRGBPalette16(darkBluePassive1, darkBluePassive2, darkBluePassive3, darkBluePassive4, darkBluePassive1, darkBluePassive2, darkBluePassive3, darkBluePassive4, darkBluePassive1, darkBluePassive2, darkBluePassive3, darkBluePassive4, darkBluePassive1, darkBluePassive2, darkBluePassive3, darkBluePassive4);
CRGBPalette16 lightpurplePalettePassive = CRGBPalette16(lightPurplePassive1, lightPurplePassive2, lightPurplePassive3, lightPurplePassive4, lightPurplePassive1, lightPurplePassive2, lightPurplePassive3, lightPurplePassive4, lightPurplePassive1, lightPurplePassive2, lightPurplePassive3, lightPurplePassive4, lightPurplePassive1, lightPurplePassive2, lightPurplePassive3, lightPurplePassive4);
CRGBPalette16 darkPurplePalettePassive = CRGBPalette16(darkPurplePassive1, darkPurplePassive2, darkPurplePassive3, darkPurplePassive4, darkPurplePassive1, darkPurplePassive2, darkPurplePassive3, darkPurplePassive4, darkPurplePassive1, darkPurplePassive2, darkPurplePassive3, darkPurplePassive4, darkPurplePassive1, darkPurplePassive2, darkPurplePassive3, darkPurplePassive4);

//CRGBPalette16 leftPassivePalettesArray[] = {pinkPalettePassive, redPalettePassive, orangePalettePassive, yellowPalettePassive, lightGreenPalettePassive};  //an array containing each warm palette
CRGBPalette16 rightPassivePalettesArray[] = {darkGreenPalettePassive, lightBluePalettePassive, darkBluePalettePassive, lightpurplePalettePassive, darkPurplePalettePassive};  //an array containing each warm palette

CRGBPalette16 currentPalette;

int palettesArrayLength = 10;
uint8_t globalIndex = 0;                         //index value for palettes

//-------------------------------------END PALETTES--------------------------------------------//

// Other strip variables
TBlendType    currentBlending;
uint8_t highBrightness = 255;   //max is 255
uint8_t lowBrightness = 128;    //min is 0 (none)
uint8_t localBrightness = 0;    //min is 0 (none)
int stripSpeed = 3;             //speed of LED strip animation
int pixDir = 1;                 //variable for direction of led pixel animation

//--------------------------SERIAL VARIABLES--------------------------

uint8_t mostRecent[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0}; //an array of the most recent mic values received from serial
uint8_t micVal = 1;                              //placeholder value for the mic value recieved from serial
uint8_t tubeNumber = 0;                         //placeholder value for the strip number value recieved from serial


void setup()
{
  //Serial Setup
  Serial.begin(9600);     //initialize serial communications at a 9600 baud rate
  Serial.setTimeout(40); // set the timeout for parseInt - how long it will wait around for an int before moving on

  //LED Strip setup - makes an array of strips accessible through 'FastLED[stripNumber]'
  FastLED.addLeds<LED_TYPE, TUBE_STRIP_1_PIN>(MID_STRIP_1, N_LEDS_MID);
  FastLED.addLeds<LED_TYPE, TUBE_STRIP_2_PIN>(SHORT_STRIP_1, N_LEDS_SHORT);
  FastLED.addLeds<LED_TYPE, TUBE_STRIP_3_PIN>(LONG_STRIP_1, N_LEDS_LONG);
  FastLED.addLeds<LED_TYPE, TUBE_STRIP_4_PIN>(SHORT_STRIP_2, N_LEDS_SHORT);
  FastLED.addLeds<LED_TYPE, TUBE_STRIP_5_PIN>(MID_STRIP_2, N_LEDS_MID);

  //Color palette setup
  currentBlending = LINEARBLEND;
  currentPalette = rightPassivePalettesArray[0];
}

void loop()
{
  for (uint8_t tube = 0; tube < NUM_TUBES; tube++) {     //update every tube, every loop
    blowFans(tube, mostRecent[tube]);                   //see the function for more details on what happens
  }
  glowLights();                                         //see the function for more details on what happens
  getBlow();                                             //get the most recent data to come in from the serial
}

//-------------------------------------SERIAL COMM FUNCTIONS --------------------------------------------//

void getBlow() {
  if (Serial.available() > 0) {     // If data is available to read,
    int inByte = Serial.parseInt(); // find the int within it
    if (inByte > 0) {               // if its more than 0, cut up the inbound message
      tubeNumber = inByte % 10;     // identify the last digit in the inByte (the tube number)
      micVal = inByte / 10;         // cut out that last digit and the remaining digits are the mic value
      mostRecent[tubeNumber] = micVal; //update the array of most recent values (per tube) with the new value (for a specific tube) recieved for the serial
    }
  }
}

//-------------------------------------------FAN FUNCTIONS -------------------------------------------------//

//This function is performed once for each tube
void blowFans(uint8_t tubeNumber, uint8_t thisRecentValue) {
  if (thisRecentValue > 1) {                      //if the most-recent value for the tube is greater than 1 (greater than zero does not work)
    analogWrite(fansArray[tubeNumber], map(thisRecentValue, 2, 9, fanLowValues[tubeNumber], 255));         //deactivate the fan of that tube -- MAYBE CHANGE 0 TO 5 or something
    analogWrite(fansNullArray[tubeNumber], 0);                                //write 0 to the null pin of the fan of that tube
  } else {
    analogWrite(fansArray[tubeNumber], fanLowValues[tubeNumber]);             //deactivate the fan of that tube -- MAYBE CHANGE 0 TO 5 or something
    analogWrite(fansNullArray[tubeNumber], 0);                                //write 0 to the null pin of the fan of that tube
  }
}

//-------------------------------------------LED STRIP FUNCTIONS -------------------------------------------------//

void glowLights() {
  globalIndex = (globalIndex + stripSpeed) % 255;               //Motion speed of passive animation. Change the stripSpeed variable to speed up/slow down. Must be an int less than 256

  animatePassive(globalIndex);                                  //update what values each pixel should shine
  FastLED.show();                                               //display the updated strip
  FastLED.delay(1000 / UPDATES_PER_SECOND);                     //update the strip
}

void animatePassive(uint8_t globalIndex) {
  pixDir = 1;

  for (int tubeNumber = 0; tubeNumber < NUM_TUBES; tubeNumber++) {
    //Different animation options
    //    uint8_t localIndex = globalIndex;                           //create a local counter to define which color to pull from the palette
    //    uint8_t localIndex = globalIndex + tubeNumber * 5;         //creates a non-unoform offset between the strips

    uint8_t localIndex = globalIndex + 50;                      //create a uniform offset between the strips
    pixDir = pixDir * -1;                                       //change the pixel direction each tube

    if (mostRecent[tubeNumber] > 1) {                       //if the tube is activated
      localBrightness = highBrightness;                         //make the brightness high
    } else {
      localBrightness = lowBrightness;
    }
    currentPalette = rightPassivePalettesArray[tubeNumber];                   //update the palette to the one correspondent with the tube

    for ( int i = 0; i < lengthsArray[tubeNumber]; i++) {                     // loop through each pixel
      FastLED[tubeNumber][i] = ColorFromPalette(currentPalette, localIndex, localBrightness, currentBlending);
      localIndex = localIndex + pixDir;
    }
  }
}
