/**
 * @file main.ino
 * @author Gita Alekhya Paul
 * @brief A home automation system
 * @version 1.0.0
 * @date 2021-01-16
 * 
 * @copyright Gita Alekhya Paul (c) 2021
 * 
 */
//Importing Libraries
#include <ESP8266SSDP.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiManager.h>

//Defining pins
#define PORT 80
#define redPin D6
#define yellowPin D5
#define greenPin D1

//Init server and wifiManager
ESP8266WebServer server(PORT);
WiFiManager wifiManager;

void wifiConnect();
String getHostname();
void initPins();
void startMDNS();
void handleDescription();
void startWebServer();
void configureSSDP();

void setup()
{
    initPins();
    Serial.begin(115200);
    wifiConnect();
    startMDNS();
    startWebServer();
    configureSSDP();
}

void loop()
{
    MDNS.update();
    server.handleClient();
}

void configureSSDP()
{
    String hostname = getHostname();
    SSDP.setSchemaURL("description.xml");
    SSDP.setHTTPPort(PORT);
    SSDP.setName(hostname);
    SSDP.setSerialNumber(ESP.getChipId());
    SSDP.setURL("http://" + hostname + ".local");
    SSDP.setModelName("ESP8266");
    SSDP.setModelNumber(WiFi.macAddress());
    SSDP.setModelURL("http://" + hostname + ".local");
    SSDP.setManufacturer("Gita Alekhya Paul");
    SSDP.setManufacturerURL("https://esp8266.gitaalekhyapaul.xyz");
    SSDP.setDeviceType("urn:gitaalekhyapaul:device:ESP8266:1");
    SSDP.setInterval(1000);
    SSDP.begin();
    Serial.println("SSDP Completed.");
}

void startWebServer()
{
    server.on("/description.xml", HTTP_GET, handleDescription);
    server.begin();
    MDNS.addService("http", "tcp", PORT);
    Serial.print("Web server started on Port ");
    Serial.println(PORT);
}

void handleDescription()
{
    SSDP.schema(server.client());
}

void startMDNS()
{
    Serial.println("Starting mDNS...");
    String hostname = getHostname();
    if (!MDNS.begin(hostname))
    {
        Serial.println("Error starting up mDNS responder!");
        Serial.println("Restarting...");
        ESP.restart();
    }
    Serial.println("mDNS responder started.");
    Serial.println("Hostname: " + hostname + ".local");
}

void initPins()
{
    pinMode(redPin, OUTPUT);
    pinMode(yellowPin, OUTPUT);
    pinMode(greenPin, OUTPUT);
}

String getHostname()
{
    String hostname = WiFi.macAddress();
    hostname.replace(":", "");
    hostname = "ESP8266" + hostname;
    return hostname;
}

void wifiConnect()
{
    Serial.print("Connecting to WiFi");
    wifiManager.setDebugOutput(false);
    wifiManager.autoConnect();
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(500);
    }
    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    return;
}