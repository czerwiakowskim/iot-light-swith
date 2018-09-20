#include <Arduino.h>
#line 1 "/Users/magic/Documents/projects/personal/angular_meetup_21/switch_device/switch_device.ino"
#line 1 "/Users/magic/Documents/projects/personal/angular_meetup_21/switch_device/switch_device.ino"
#include <ESP8266WiFi.h>          //ESP8266 Core WiFi Library (you most likely already have this in your sketch)

#include <DNSServer.h>            //Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     //Local WebServer used to serve the configuration portal
#include <WiFiManager.h>          //https://github.com/tzapu/WiFiManager WiFi Configuration Magic

WiFiManager wifiManager;
//flag for saving data
bool shouldSaveConfig = false;

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());

  Serial.println(myWiFiManager->getConfigPortalSSID());
}

//callback notifying us of the need to save config
void saveConfigCallback () {
  Serial.println("Should save config");
  shouldSaveConfig = true;
}


void setup() {
  Serial.begin(115200);
  wifiManager.setAPCallback(configModeCallback);
  wifiManager.setSaveConfigCallback(saveConfigCallback);
  wifiManager.autoConnect("AP-NAME", "AP-PASSWORD");


}

void loop() {
  // put your main code here, to run repeatedly:

}

