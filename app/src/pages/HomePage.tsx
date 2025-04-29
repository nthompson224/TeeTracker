
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

import { Sidebar } from "../components/Sidebar";
import { IntializeDeviceDialog } from "../components/IntializeDeviceDialog";
import { PoiMarkers } from "../components/PoiMarkers";
import { NavBar } from "../components/NavBar";

import { supabase } from "../lib/helper/SupabaseClient";

import { Company, Member } from "../types/DatabaseTypes";
import { device, member } from "../types/types";

import "../styles/HomePage.css"
import { InitializedDevicePopup } from "../components/InitializedDevicePopup";

export function HomePage() {
    const loginRedirect = useNavigate();

    const [userID, setUserID] = useState("");
    const [company, setCompany] = useState<Company>();
    const [initializedDevices, setInitializedDevices] = useState<device[]>();
    const [showPopup, setShowPopup] = useState(false);
    const [showEditInitializedDevicePopup, setShowEditInitializedDevicePopup] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | undefined>()
    const [hoveredDevice, setHoveredDevice] = useState<device | undefined>();

    const socket = useRef<WebSocket | null>(null);

    function sendInitializeCommand(member: member, deviceId: string) {
        let message = {
            command: "INITIALIZE",
            id: deviceId,
            golferId: member.id,
            name: member.firstName + " " + member.lastName
        };

        socket.current!.send(JSON.stringify(message))
    }

    function sendUninitializeCommand(member: member, deviceId: string) {
        let message = {
            command: "UNINITIALIZE",
            id: deviceId
        }

        socket.current!.send(JSON.stringify(message));
    }

    function handleEditInitializedDeviceClicked(member: Member) {
        setSelectedMember(member);
        setShowEditInitializedDevicePopup(true);
    }

    function closeEditInitializedDeviceClicked() {
        setSelectedMember(undefined);
        setShowEditInitializedDevicePopup(false);
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const {
                    data: { user }
                } = await supabase.auth.getUser();
                if (user !== null) {
                    setUserID(user.id);
                    try {
                        const { data, error } = await supabase.from("registered_companies").select("*").eq("domain", user.email!.split("@")[1]);
                        if (data && data.length !== 0) {
                            setCompany(data[0]);
                        } else {
                            console.log(error);
                            alert("There was an error finding your company. Please contact your admin.");
                            loginRedirect("/login");
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    setUserID("");
                    loginRedirect("/login", { state: { userID: userID } });
                }
            } catch (e) {
                console.log(e);
            }
        };
        getUser();

        socket.current = new WebSocket("ws://192.168.1.12:3001");

        socket.current.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            console.log(messageData);

            if (messageData["message-type"] === "DEVICE_INFORMATION") {
                let tempDevices: device[] = []
                for (let i = 0; i < messageData["device-data"].length; ++i) {
                    tempDevices.push({
                        id: messageData["device-data"][i]["id"],
                        status: messageData["device-data"][i]["status"],
                        name: messageData["device-data"][i]["deviceName"],
                    })
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
                                golferUUID: messageData["arduino-data"]["golferUUID"],
                                name: messageData["arduino-data"]["name"],
                                location: {
                                    coordinates: {
                                        lng: messageData["arduino-data"]["coordinates"]["long"],
                                        lat: messageData["arduino-data"]["coordinates"]["lat"]
                                    }
                                },
                            }
                            : device
                    ) ?? []
                );
            };

            return () => {
                if (socket.current) {
                    socket.current.close();
                }
            };
        }
    }, []);

    return company ?
        <div className="base">
            <NavBar company={company} />
            <div className="dashboard">
                <div className="map">
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!} onLoad={() => console.log("Maps API has loaded.")}>
                        <Map
                            defaultZoom={20}
                            defaultCenter={{ lat: company.course_latitude, lng: company.course_longitude }}
                            mapId={"858637552d9afbaf "}
                            mapTypeId="satellite"
                            disableDefaultUI={true}
                        >
                            {initializedDevices ? <PoiMarkers devices={initializedDevices} hoveredDevice={hoveredDevice} color="cyan"></PoiMarkers> : <></>}
                        </Map>
                    </APIProvider>
                </div>
                <Sidebar devices={initializedDevices} showPopup={setShowPopup} setHoveredDevice={setHoveredDevice} handleMemberClicked={handleEditInitializedDeviceClicked} />
                <IntializeDeviceDialog devices={initializedDevices} show={showPopup} closePopup={setShowPopup} sendInitializeCommand={sendInitializeCommand} companyId={company?.company_id!} />
            </div>
            <InitializedDevicePopup show={showEditInitializedDevicePopup} closePopup={closeEditInitializedDeviceClicked} selectedMember={selectedMember!} sendUninitializeCommand={sendUninitializeCommand} companyId={company.company_id} />
        </div> : <></>
}
