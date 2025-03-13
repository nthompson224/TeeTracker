import { device, location } from "../types/types";

import "../styles/Sidebar.css";

export function Sidebar(props: { devices?: device[], showPopup: Function }) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Active Golfers</h3>
                <div className="add-device">
                    <button className="add-device-button" onClick={() => props.showPopup(true)}>+</button>
                </div>
            </div>
            <div className="golfers">
                {props.devices ? props.devices.filter((device: device) => {
                    return device.status === "INITIALIZED";
                }).map((device: device) => {
                    return (
                        <div className="golfer">
                            <img src="logo512.png" />
                            <h3>{device["name"]}</h3>
                        </div>
                    )
                }) : <></>}
            </div>
        </div>
    );
}