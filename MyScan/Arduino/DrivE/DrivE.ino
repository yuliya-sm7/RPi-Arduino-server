/*
  Controlling a servo position using a potentiometer (variable resistor)
  by Michal Rinott <http://people.interaction-ivrea.it/m.rinott>

  modified on 8 Nov 2013
  by Scott Fitzgerald
  http://www.arduino.cc/en/Tutorial/Knob
*/

#include <Servo.h>

Servo myservo;  // create servo object to control a servo

int potpin = 0;  // analog pin used to connect the potentiometer
int val;    // variable to read the value from the analog pin

void setup() {
  Serial.begin(115200);
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object
}

void loop() {
}

void serialEvent() {
  char command[32] = "";
  inputCommand(command);
  int pos[] = { -1, -1};
  parseM1M2(command, pos);
  Serial.println(pos[0]);
  int val = map(pos[0], 0, 360, 0, 180);     // scale it to use it with the servo (value between 0 and 180)
  myservo.write(val);
}

///////////////////////////////////////////////////////
void inputCommand(char * command) {
  int i = 0;
  while (Serial.available()) {
    command[i] = Serial.read();
    i++;
    delay(1);
  }
  strcat(command, "\0");
  Serial.print(command);
}

///////////////////////////////////////////////////////
bool parseM1M2(char * m, int* A) {
  for (int i = 0; i < 32; i++) {
    if (m[i] == '\n' || m[i] == '\r' || m[i] == '\0')
      break;
    if (m[i] == 'X') {
      i++;
      A[0] = readNum(m, i);
    }
    if (m[i] == 'Y') {
      i++;
      A[1] = readNum(m, i);
    }
  }
  // проверка на адекватность будет
  return true;
}

///////////////////////////////////////////////////////
int readNum(char * m, int i) {
  char buff[10] = "";
  int n = 0;
  while ((isdigit(m[i]) || m[i] == '.' || m[i] == '-') && n < 9) {
    buff[n] = m[i];
    i++;
    n++;
  }
  buff[n] = '\0';
  if (n == 0)
    return (0);
  return (atoi(buff));
}
