import WebSocket, { WebSocketServer } from "ws";

const ws = require("ws");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const websocketServer: WebSocketServer = new ws.Server({ port: 3001 });
const arduinoWebsocketServer: WebSocketServer = new ws.Server({ port: 3002 });

app.use(bodyParser.json());

type device = { id: string, status: string, deviceName: string, lastPing: number, golferUUID: string };

let connectedDevices = new Map<string, device>();
let arduinoWebsockets = new Map<string, WebSocket>();

websocketServer.on('connection', (ws: WebSocket) => {
    console.log("client connected");

    let deviceData = {
        "message-type": "DEVICE_INFORMATION",
        "device-data": Array.from(connectedDevices.values())
    };

    if (deviceData['device-data']) {
        ws.send(JSON.stringify(deviceData));
    }

    ws.on('message', (message: string) => {
        const msg = JSON.parse(message);

        console.log(msg);

        const arduinoWs = arduinoWebsockets.get(msg.id);
        if (arduinoWs) {
            arduinoWs.send(message);
        }
    });

    ws.on('close', () => {
        console.log("client disconnected");
    })
});

arduinoWebsocketServer.on("connection", (ws: WebSocket) => {
    console.log("device connected through websocket");

    ws.on("message", (message: string) => {
        const msg = JSON.parse(message);

        console.log("message", msg);

        if (msg.messageType === "REGISTER") {
            arduinoWebsockets.set(msg.id, ws);

            let newDevice: device = {
                id: msg.id,
                status: msg.status,
                golferUUID: msg.golferUUID,
                deviceName: msg.name,
                lastPing: Date.now(),
            };

            connectedDevices.set(msg.id, newDevice);

            websocketServer.clients.forEach((client) => {
                if (client.readyState == ws.OPEN) {
                    let deviceData = {
                        "message-type": "DEVICE_INFORMATION",
                        "device-data": Array.from(connectedDevices.values())
                    };

                    client.send(JSON.stringify(deviceData));
                }
            })
        }

        if (msg.messageType === "ARDUINO_DATA") {
            connectedDevices.set(msg.id, {
                id: msg.id,
                status: msg.status,
                deviceName: msg.name,
                golferUUID: msg.golferUUID,
                lastPing: Date.now()
            });

            let arduinoData = {
                "message-type": "ARDUINO_DATA",
                "arduino-data": {
                    id: msg.id,
                    status: msg.status,
                    name: msg.name,
                    golferUUID: msg.golferUUID,
                    coordinates: {
                        long: msg.longitude,
                        lat: msg.latitude
                    }
                }
            };

            websocketServer.clients.forEach((client) => {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify(arduinoData))
                }
            });
        }

        if (msg.messageType === "PING") {
            const device = connectedDevices.get(msg.id);
            if (device) {
                device.lastPing = Date.now();
            }
        }
    })
});

// setInterval(() => {
//     for (const [key, value] of connectedDevices.entries()) {
//         if (Date.now() - value['lastPing'] > 20000) {
//             console.log("removing device: ", value['deviceName']);
//             connectedDevices.delete(key);
//         }
//     }
// }, 5000);
