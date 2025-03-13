
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

import { Sidebar } from "../components/Sidebar";
import { IntializeDeviceDialog } from "../components/IntializeDeviceDialog";
import { PoiMarkers } from "../components/PoiMarkers";

import { supabase } from "../lib/helper/SupabaseClient";
import { device, location } from "../types/types";

import "../styles/HomePage.css"

export function HomePage() {
    const loginRedirect = useNavigate();

    const [userID, setUserID] = useState("");
    const [initializedDevices, setInitializedDevices] = useState<device[]>();
    const [uninitializedDevices, setUninitializedDevices] = useState<device[]>();
    const [locations, setLocations] = useState<location[]>();
    const [showPopup, setShowPopup] = useState(false);

    const socket = useRef<WebSocket | null>(null);

    function test() {
        let message = {
            command: "INITIALIZE",
            id: 1,
            name: "testestest"
        };
        socket.current!.send(JSON.stringify(message))
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const {
                    data: { user }
                } = await supabase.auth.getUser();
                console.log(user)
                if (user !== null) {
                    setUserID(user.id);
                } else {
                    setUserID("");
                    loginRedirect("/login", { state: { userID: userID } });
                }
            } catch (e) {
                console.log(e);
            }
        };
        getUser();

        if (userID !== "") {
            socket.current = new WebSocket("ws://192.168.1.12:3001");

            socket.current.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                console.log(messageData);

                if (messageData["message-type"] === "DEVICE_INFORMATION") {
                    let tempDevices: device[] = []
                    for (let i = 0; i < messageData["device-data"].length; ++i) {
                        tempDevices.push({ id: messageData["device-data"][i]["id"], status: messageData["device-data"][i]["status"], name: messageData["device-data"][i]["deviceName"] })
                    }

                    setInitializedDevices(tempDevices);
                }

                if (messageData["message-type"] === "ARDUINO_DATA") {
                    setInitializedDevices((prevDevices) =>
                        prevDevices?.map((device) =>
                            device.id === messageData["arduino-data"]["id"]
                                ? {
                                    id: messageData["arduino-data"]["id"],
                                    status: messageData["arduino-data"]["status"],
                                    name: messageData["arduino-data"]["name"],
                                    location: {
                                        coordinates: {
                                            lng: messageData["arduino-data"]["coordinates"]["long"],
                                            lat: messageData["arduino-data"]["coordinates"]["lat"]
                                        }
                                    }
                                }
                                : device
                        ) ?? []
                    );
                }
            };

            return () => {
                if (socket.current) {
                    socket.current.close();
                }
            };
        }
    }, [userID, loginRedirect]);

    return (
        <div>
            <button onClick={test}>Test</button>
            <div className="dashboard">
                <div className="map">
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!} onLoad={() => console.log("Maps API has loaded.")}>
                        <Map
                            defaultZoom={20}
                            defaultCenter={{ lat: 41.0032, lng: -81.59075 }}
                            mapId={"858637552d9afbaf "}
                            mapTypeId="satellite"
                            disableDefaultUI={true}
                        >
                            {initializedDevices ? <PoiMarkers devices={initializedDevices}></PoiMarkers> : <></>}
                        </Map>
                    </APIProvider>
                </div>
                <Sidebar devices={initializedDevices} showPopup={setShowPopup} />
                <IntializeDeviceDialog devices={initializedDevices} show={showPopup} closePopup={setShowPopup} />
            </div>
        </div>
    );
}
