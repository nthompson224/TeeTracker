import { useState, useEffect, useRef } from "react";
import { data, useNavigate } from "react-router-dom";
import { APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

import { supabase } from "./lib/helper/SupabaseClient";

import './styles/HomePage.css';

type location = { coordinates: google.maps.LatLngLiteral };
type device = { id: string, status: string, name: string, location?: location };

export function HomePage() {
    const loginRedirect = useNavigate();

    const [userID, setUserID] = useState("");
    const [initializedDevices, setInitializedDevices] = useState<device[]>()
    const [uninitializedDevices, setUninitializedDevices] = useState<device[]>()
    const [locations, setLocations] = useState<location[]>();

    const socket = useRef<WebSocket | null>(null);

    function test() {
        if (socket.current) {
            socket.current.send(JSON.stringify({
                messageType: "INITIALIZE",
                id: "1",
                name: "changed test device"
            }));
            console.log("Message sent");
        } else {
            console.log("Websocket is not connected.");
        }
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
            socket.current = new WebSocket('ws://192.168.1.16:3001');

            socket.current.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                console.log(messageData);

                if (messageData['message-type'] === "DEVICE_INFORMATION") {
                    let tempDevices: device[] = []
                    for (let i = 0; i < messageData["device-data"].length; ++i) {
                        tempDevices.push({ id: messageData["device-data"][i]["id"], status: messageData['device-data'][i]['Status'], name: messageData["device-data"][i]["deviceName"] })
                    }

                    setInitializedDevices(tempDevices);
                }

                if (messageData['message-type'] === "ARDUINO_DATA") {
                    setInitializedDevices((prevDevices) =>
                        prevDevices?.map((device) =>
                            device.id == messageData['arduino-data']['id']
                                ? {
                                    ...device,
                                    location: {
                                        coordinates: {
                                            lng: messageData['arduino-data']['longitude'],
                                            lat: messageData['arduino-data']['latitude']
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
            <button onClick={test}></button>
            <div className="dashboard">
                <div className="map">
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!} onLoad={() => console.log("Maps API has loaded.")}>
                        <Map
                            defaultZoom={20}
                            defaultCenter={{ lat: 41.0032, lng: -81.59075 }}
                            mapId={'858637552d9afbaf '}
                            mapTypeId='satellite'
                            disableDefaultUI={true}
                            onCameraChanged={(ev: MapCameraChangedEvent) =>
                                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                            }>
                            {initializedDevices ? <PoiMarkers devices={initializedDevices}></PoiMarkers> : <></>}
                        </Map>
                    </APIProvider>
                </div>
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h3>Active Golfers</h3>
                        <div className="add-device">
                            <button className="add-device-button">+</button>
                        </div>
                    </div>
                    <div className="golfers">
                        {initializedDevices ? initializedDevices.filter((device) => {
                            return device.status === "INITIALIZED";
                        }).map((device) => {
                            return (
                                <div className="golfer">
                                    <img src="logo512.png" />
                                    <h3>{device['name']}</h3>
                                </div>
                            )
                        }) : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}

const PoiMarkers = (props: { devices: device[] }) => {
    return (
        <>
            {props.devices.map((device: device) => {
                if (device.location) {
                    return (
                        <AdvancedMarker
                            position={device.location.coordinates}>
                            <div className="marker" />
                        </AdvancedMarker>
                    )
                } else {
                    return <></>
                }

            })}
        </>
    );
}