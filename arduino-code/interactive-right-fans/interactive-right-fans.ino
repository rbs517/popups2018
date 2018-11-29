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

int fanLowValues[] = {0, 0, 0, 0, 0, 120, 120, 120, 120, 120}; //the value when the fans are passively blowing
int fanHighValues[] = {0, 0, 0, 0, 0, 255, 255, 255, 255, 255}; //an extreme high value for each fan to quickly boost airflow - varies based on individual tubes and environmental conditions (i.e. airflow)

//-------------------------------------BEGIN PALETTES--------------------------------------------//
CRGB pinkActive1 = CHSV(128, 255, 128);
CRGB pinkActive2 = CHSV(128, 255, 128);
CRGB pinkActive3 = CHSV(122, 255, 128);
CRGB pinkActive4 = CHSV(122, 255, 128);
CRGB redActive1 = CHSV(100, 170, 128);
CRGB redActive2 = CHSV(100, 170, 128);
CRGB redActive3 = CHSV(90, 160, 128);
CRGB redActive4 = CHSV(90, 160, 128);
CRGB orangeActive1 = CHSV(100, 255, 128);
CRGB orangeActive2 = CHSV(100, 255, 128);
CRGB orangeActive3 = CHSV(94, 255, 128);
CRGB orangeActive4 = CHSV(94, 255, 128);
CRGB yellowActive1 = CHSV(88, 255, 128);
CRGB yellowActive2 = CHSV(88, 255, 128);
CRGB yellowActive3 = CHSV(82, 255, 128);
CRGB yellowActive4 = CHSV(82, 255, 128);
CRGB lightGreenActive1 = CHSV(75, 255, 128);
CRGB lightGreenActive2 = CHSV(75, 255, 128);
CRGB lightGreenActive3 = CHSV(69, 255, 128);
CRGB lightGreenActive4 = CHSV(69, 255, 128);
CRGB darkGreenActive1 = CHSV(38, 200, 128);
CRGB darkGreenActive2 = CHSV(38, 200, 128);
CRGB darkGreenActive3 = CHSV(32, 200, 128);
CRGB darkGreenActive4 = CHSV(32, 200, 128);
CRGB lightBlueActive1 = CHSV(-18, 255, 128);
CRGB lightBlueActive2 = CHSV(-18, 255, 128);
CRGB lightBlueActive3 = CHSV(-24, 255, 128);
CRGB lightBlueActive4 = CHSV(-24, 255, 128);
CRGB darkBlueActive1 = CHSV(-60, 200, 128);
CRGB darkBlueActive2 = CHSV(-60, 200, 128);
CRGB darkBlueActive3 = CHSV(-66, 200, 128);
CRGB darkBlueActive4 = CHSV(-66, 200, 128);
CRGB lightPurpleActive1 = CHSV(-90, 255, 128);
CRGB lightPurpleActive2 = CHSV(-90, 255, 128);
CRGB lightPurpleActive3 = CHSV(-96, 255, 128);
CRGB lightPurpleActive4 = CHSV(-96, 255, 128);
CRGB darkPurpleActive1=CHSV(148, 255, 128);
CRGB darkPurpleActive2=CHSV(148, 255, 128);
CRGB darkPurpleActive3=CHSV(142, 255, 128);
CRGB darkPurpleActive4=CHSV(142, 255, 128);

CRGB pinkPassive1 = CHSV(128, 255, 255);
CRGB pinkPassive2 = CHSV(128, 255, 255);
CRGB pinkPassive3 = CHSV(122, 255, 255);
CRGB pinkPassive4 = CHSV(122, 255, 255);
CRGB redPassive1 = CHSV(100, 170, 255);
CRGB redPassive2 = CHSV(100, 170, 255);
CRGB redPassive3 = CHSV(90, 160, 255);
CRGB redPassive4 = CHSV(90, 160, 255);
CRGB orangePassive1 = CHSV(100, 255, 255);
CRGB orangePassive2 = CHSV(100, 255, 255);
CRGB orangePassive3 = CHSV(94, 255, 255);
CRGB orangePassive4 = CHSV(94, 255, 255);
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

CRGBPalette16 pinkPaletteActive = CRGBPalette16(pinkActive1, pinkActive2, pinkActive3, pinkActive4, pinkActive1, pinkActive2, pinkActive3, pinkActive4, pinkActive1, pinkActive2, pinkActive3, pinkActive4, pinkActive1, pinkActive2, pinkActive3, pinkActive4);
CRGBPalette16 redPaletteActive = CRGBPalette16(redActive1, redActive2, redActive3, redActive4, redActive1, redActive2, redActive3, redActive4, redActive1, redActive2, redActive3, redActive4, redActive1, redActive2, redActive3, redActive4);
CRGBPalette16 orangePaletteActive = CRGBPalette16(orangeActive1, orangeActive2, orangeActive3, orangeActive4, orangeActive1, orangeActive2, orangeActive3, orangeActive4, orangeActive1, orangeActive2, orangeActive3, orangeActive4, orangeActive1, orangeActive2, orangeActive3, orangeActive4);
CRGBPalette16 yellowPaletteActive = CRGBPalette16(yellowActive1, yellowActive2, yellowActive3, yellowActive4, yellowActive1, yellowActive2, yellowActive3, yellowActive4, yellowActive1, yellowActive2, yellowActive3, yellowActive4, yellowActive1, yellowActive2, yellowActive3, yellowActive4);
CRGBPalette16 lightGreenPaletteActive = CRGBPalette16(lightGreenActive1, lightGreenActive2, lightGreenActive3, lightGreenActive4, lightGreenActive1, lightGreenActive2, lightGreenActive3, lightGreenActive4, lightGreenActive1, lightGreenActive2, lightGreenActive3, lightGreenActive4, lightGreenActive1, lightGreenActive2, lightGreenActive3, lightGreenActive4);
CRGBPalette16 darkGreenPaletteActive = CRGBPalette16(darkGreenActive1, darkGreenActive2, darkGreenActive3, darkGreenActive4, darkGreenActive1, darkGreenActive2, darkGreenActive3, darkGreenActive4, darkGreenActive1, darkGreenActive2, darkGreenActive3, darkGreenActive4, darkGreenActive1, darkGreenActive2, darkGreenActive3, darkGreenActive4);
CRGBPalette16 lightBluePaletteActive = CRGBPalette16(lightBlueActive1, lightBlueActive2, lightBlueActive3, lightBlueActive4, lightBlueActive1, lightBlueActive2, lightBlueActive3, lightBlueActive4, lightBlueActive1, lightBlueActive2, lightBlueActive3, lightBlueActive4, lightBlueActive1, lightBlueActive2, lightBlueActive3, lightBlueActive4);
CRGBPalette16 darkBluePaletteActive = CRGBPalette16(darkBlueActive1, darkBlueActive2, darkBlueActive3, darkBlueActive4, darkBlueActive1, darkBlueActive2, darkBlueActive3, darkBlueActive4, darkBlueActive1, darkBlueActive2, darkBlueActive3, darkBlueActive4, darkBlueActive1, darkBlueActive2, darkBlueActive3, darkBlueActive4);
CRGBPalette16 lightpurplePaletteActive = CRGBPalette16(lightPurpleActive1, lightPurpleActive2, lightPurpleActive3, lightPurpleActive4, lightPurpleActive1, lightPurpleActive2, lightPurpleActive3, lightPurpleActive4, lightPurpleActive1, lightPurpleActive2, lightPurpleActive3, lightPurpleActive4, lightPurpleActive1, lightPurpleActive2, lightPurpleActive3, lightPurpleActive4);
CRGBPalette16 darkPurplePaletteActive = CRGBPalette16(darkPurpleActive1, darkPurpleActive2, darkPurpleActive3, darkPurpleActive4, darkPurpleActive1, darkPurpleActive2, darkPurpleActive3, darkPurpleActive4, darkPurpleActive1, darkPurpleActive2, darkPurpleActive3, darkPurpleActive4, darkPurpleActive1, darkPurpleActive2, darkPurpleActive3, darkPurpleActive4);

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
//CRGBPalette16 leftActivePalettesArray[] = {pinkPaletteActive, redPaletteActive, orangePaletteActive, yellowPaletteActive, lightGreenPaletteActive};  //an array containing each warm palette

CRGBPalette16 rightPassivePalettesArray[] = {darkGreenPalettePassive, lightBluePalettePassive, darkBluePalettePassive, lightpurplePalettePassive, darkPurplePalettePassive};  //an array containing each warm palette
CRGBPalette16 rightActivePalettesArray[] = {darkGreenPaletteActive, lightBluePaletteActive, darkBluePaletteActive, lightpurplePaletteActive, darkPurplePaletteActive};  //an array containing each warm palette

CRGBPalette16 currentPalette;

int palettesArrayLength = 10;
uint8_t globalIndex = 0;                         //index value for palettes

//-------------------------------------END PALETTES--------------------------------------------//

// Other strip variables
TBlendType    currentBlending;
uint8_t highBrightness = 255;   //max is 255
uint8_t lowBrightness = 128;     //min is 0 (none)
uint8_t localBrightness = 0;     //min is 0 (none)
int stripSpeed = 3;                //speed of LED strip animation
int pixDir = 1;

//--------------------------TIMING VARIABLES--------------------------

int sections[] = {0, 0, 0, 0, 0};                   // an array to keep track of which section of the animation each fan is on (one for each fan)
unsigned long sectionTimers[] = {0, 0, 0, 0, 0};    //an array to keep track of the timer for each section

int throwawaySection = 2000;                        //workaround for animation of the fans
int timeSection[] = {throwawaySection, 2000, 3000}; //number of seconds to do acceleration and deceleration
int numSections = 2;                                //the number of sections - one for accel, one for decel

unsigned long startMillis;  //some global variables available anywhere in the program
unsigned long currentMillis;

//--------------------------SERIAL VARIABLES--------------------------

uint8_t mostRecent[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0}; //an array of the most recent mic values received from serial
uint8_t micVal = 1;                              //placeholder value for the mic value recieved from serial
uint8_t tubeNumber = 0;                         //placeholder value for the strip number value recieved from serial


void setup()
{
  //Serial Setup
  Serial.begin(9600);     //initialize serial communications at a 9600 baud rate
  Serial.setTimeout(40); // set the timeout for parseInt - how long it will wait around for an int before moving on

  //Timing Setup
  startMillis = millis();  //initial start time

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
  currentMillis = millis();
  for (uint8_t tube = 5; tube < NUM_TUBES + 5; tube++) {     //update every tube, every loop
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
      //            Serial.print("got data, blowing ");
      //            Serial.print(micVal);
      //            Serial.print(" to tube number ");
      //            Serial.println(tubeNumber);
      mostRecent[tubeNumber] = micVal; //update the array of most recent values (per tube) with the new value (for a specific tube) recieved for the serial
    }
  }
}

//-------------------------------------------FAN FUNCTIONS -------------------------------------------------//

//This function is performed once for each tube
void blowFans(uint8_t tubeNumber, uint8_t thisRecentValue) {
  if (thisRecentValue > 1) {                      //if the most-recent value for the tube is greater than 1 (greater than zero does not work)
    analogWrite(fansArray[tubeNumber-5], map(thisRecentValue, 2, 9, fanLowValues[tubeNumber], 255));           //deactivate the fan of that tube -- MAYBE CHANGE 0 TO 5 or something
    analogWrite(fansNullArray[tubeNumber-5], 0);                                  //write 0 to the null pin of the fan of that tube
  } else {
    analogWrite(fansArray[tubeNumber-5], fanLowValues[tubeNumber]);               //deactivate the fan of that tube -- MAYBE CHANGE 0 TO 5 or something
    analogWrite(fansNullArray[tubeNumber-5], 0);                                  //write 0 to the null pin of the fan of that tube
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
    //    uint8_t localIndex = globalIndex;                           //create a local counter to define which color to pull from the palette

    //Different animation options
    uint8_t localIndex = globalIndex + 50;                      //create a uniform offset between the strips
    //    uint8_t localIndex = globalIndex + tubeNumber * 5;         //creates a non-unoform offset between the strips
    

    pixDir = pixDir * -1;
    if (mostRecent[tubeNumber+5] > 1) {
      localBrightness = highBrightness;
//      currentPalette = rightActivePalettesArray[tubeNumber];
    } else {
      localBrightness = lowBrightness;
//      currentPalette = rightPassivePalettesArray[tubeNumber];                   //update the palette to the one correspondent with the tube
    }
          currentPalette = rightPassivePalettesArray[tubeNumber];                   //update the palette to the one correspondent with the tube

    for ( int i = 0; i < lengthsArray[tubeNumber]; i++) {         // loop through each pixel
      FastLED[tubeNumber][i] = ColorFromPalette(currentPalette, localIndex, localBrightness, currentBlending);
      localIndex = localIndex + pixDir;
    }
  }
}
