#include <Wire.h>  //Needed for I2C to GNSS
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

#include <SparkFun_u-blox_GNSS_Arduino_Library.h>  //http://librarymanager/All#SparkFun_u-blox_GNSS
SFE_UBLOX_GNSS myGNSS;

const char* ssid = "whore home";
const char* password = "orangemango899";

String id = "1";
String status = "UNINITIALIZED";
String name = "Test Device 1";
String golferUUID = "";

WebSocketsClient ws;

long lastPing = 0;  //Simple local timer. Limits amount if I2C traffic to u-blox module.

void setup() {
  Serial.begin(115200);
  while (!Serial)
    ;  //Wait for user to open terminal

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("WiFi connected");

  Serial.println("Connecting to websocket...");
  if (!connectToWebsocket()) {
    Serial.println("Error connecting to websocket");
  }

  Wire.begin();

  //myGNSS.enableDebugging(); // Uncomment this line to enable helpful debug messages on Serial

  if (myGNSS.begin() == false)  //Connect to the u-blox module using Wire port
  {
    Serial.println(F("u-blox GNSS not detected at default I2C address. Please check wiring. Freezing."));
    while (1)
      ;
  }

  myGNSS.setI2COutput(COM_TYPE_UBX);                  //Set the I2C port to output UBX only (turn off NMEA noise)
  myGNSS.saveConfigSelective(VAL_CFG_SUBSEC_IOPORT);  //Save (only) the communications port settings to flash and BBR
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    if (millis() - lastPing > 5000) {
      if (status == "INITIALIZED") {
        if (!sendWebsocketData()) {
          Serial.println("Error sending websocket GPS data");
        }
      }
    }
  } else {
    Serial.println("Error in WiFi connection");
  }

  ws.loop();
}

bool sendWebsocketData() {
  lastPing = millis();

  double latitude = myGNSS.getLatitude() * pow(10, -7);
  double longitude = myGNSS.getLongitude() * pow(10, -7);

  String payload = "{\"messageType\": \"ARDUINO_DATA\", \"id\": " + id + ", \"status\": \"" + status + "\", \"golferUUID\": \"" + golferUUID + "\", \"name\": \"" + name + "\", \"latitude\": " + String(latitude, 8) + ", \"longitude\": " + String(longitude, 8) + "}";
  bool status = ws.sendTXT(payload);

  return status;
}

bool connectToWebsocket() {
  const char* serverName = "192.168.1.12";

  long startTime = millis();
  ws.begin(serverName, 3002);
  while (!ws.isConnected()) {
    if (millis() - startTime > 10000) {
      return false;
    }
    ws.loop();
  }

  Serial.println("Connected to websocket");

  ws.onEvent(webSocketMessage);

  String payload = "{\"messageType\": \"REGISTER\", \"id\": " + id + ", \"status\": \"" + status + "\", \"name\": \"" + name + "\"}";
  ws.sendTXT(payload);

  return true;
}

void webSocketMessage(WStype_t type, uint8_t* payload, size_t length) {
  Serial.println(type);
  Serial.println((char*)payload);
  if (type == WStype_BIN || type == WStype_TEXT) {
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, (char*)payload);
    if (error) {
      Serial.println("deserializeJson() returned: ");
      Serial.println(error.c_str());
    }

    String command = doc["command"];

    Serial.println("Command received: ");
    Serial.println(command);

    if (command == "INITIALIZE") {
      status = "INITIALIZED";
      name = doc["name"].as<String>();
      golferUUID = doc["golferId"].as<String>();
    }
  }
}
