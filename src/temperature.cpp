#include <Arduino.h>
// Demo of Grove - Starter Kit V2.0

// Reads the value of the Grove - Temperature Sensor, converts it to a Celsius temperature,
// and prints it to the serial console.
// Connect the Grove - Temperature Sensor to the socket marked A0
// Open the Serial Monitor in the Arduino IDE after uploading

// Define the pin to which the temperature sensor is connected.
const int pinTemp = A0;

// Define the B-value of the thermistor.
// This value is a property of the thermistor used in the Grove - Temperature Sensor,
// and used to convert from the analog value it measures and a temperature value.
const int B = 3975;

void setup()
{
    // Configure the serial communication line at 9600 baud (bits per second.)
    Serial.begin(9600);
}


float readTemperature() {
    int val = analogRead(pinTemp);
    float resistance = (float)(1023-val)*10000/val;
    return 1/(log(resistance/10000)/B+1/298.15)-273.15;
}

void loop() {
    const int windowSize = 10;
    float readings[windowSize];
    int index = 0;
    bool equilibrium = false;

    // Fill buffer first
    for (int i = 0; i < windowSize; i++) {
        readings[i] = readTemperature();
        delay(1000);
    }

    while (!equilibrium) {
        readings[index] = readTemperature();
        index = (index + 1) % windowSize;

        float minTemp = readings[0];
        float maxTemp = readings[0];
        for (int i = 1; i < windowSize; i++) {
            if (readings[i] < minTemp) minTemp = readings[i];
            if (readings[i] > maxTemp) maxTemp = readings[i];
        }
        if ((maxTemp - minTemp) < 0.2) { // threshold for stability
            equilibrium = true;
            Serial.println(readings[index == 0 ? windowSize - 1 : index - 1]);
        }
    delay(1000);
}

    delay(20000); // Wait before next measurement
}