import { device, location } from "../types/types";

import "../styles/Sidebar.css";
import { supabase } from "../lib/helper/SupabaseClient";
import { InitializedDevice } from "./InitializedDevice";

const CDNURL = "https://raehtwwdbuzfggmigybx.supabase.co/storage/v1/object/sign/golfer-pictures/"

export function Sidebar(props: { devices?: device[], showPopup: Function, setHoveredDevice: Function, handleMemberClicked: Function }) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Active Golfers</h3>
                <div className="add-device">
                    <button className="add-device-button" onClick={() => console.log(props.devices)}>+</button>
                </div>
            </div>
            <div className="golfers">
                {props.devices ? props.devices.filter((device: device) => {
                    return device.status === "INITIALIZED";
                }).map((device: device) => {
                    return (
                        <InitializedDevice device={device} setHoveredDevice={props.setHoveredDevice} handleClick={props.handleMemberClicked} />
                    )
                }) : <></>}
            </div>
        </div>
    );
}